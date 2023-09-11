## 基础配置

- CentOS 7.4 x86
- Kolla-ansible Train
- Ceph-ansible stable-4.0

## 基础环境配置

### 安装基础软件

```bash
# step.1 设置 yun 源
sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
         -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g' \
         -i.bak \
         /etc/yum.repos.d/CentOS-*.repo

# step.2
sudo yum makecache

# step.3
sudo yum update -y

# step.4 安装基础软件
sudo yum install vim git wget gcc libffi-devel openssl-devel lvm2 chrony -y
```

### 修改主机 host 文件

```bash
# step.1
vim /etc/hosts

# step.1 添加内容
192.168.93.101  node01
192.168.93.102  node02
192.168.93.103  node03
192.168.93.104  node04
192.168.93.105  node05
```

### 配置免密

```bash
# step.1 生成密钥
ssh-keygen -b 1024 -t rsa -P '' -f ~/.ssh/id_rsa

# step.2 所有节点配置免密
for i in {1..5}; do sudo ssh-copy-id -i ~/.ssh/id_rsa.pub node0$i; done
```

### 关闭 Selinux

```bash
# step.1
setenforce 0

# step.2
vim /etc/selinux/config

# step.2 修改内容
SELINUX=disabled
```

### 关闭防火墙

```bash
systemctl stop firewalld
systemctl disable firewalld
```

### 磁盘结构

执行 lsblk 命令，输出如下，使用 sdc、sdd 两个磁盘分区

```bash
lsblk

NAME            MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda               8:0    0 447.1G  0 disk 
├─sda1            8:1    0     1G  0 part /boot
└─sda2            8:2    0 446.1G  0 part 
  ├─centos-root 253:0    0 877.3G  0 lvm  /
  └─centos-swap 253:1    0    16G  0 lvm  [SWAP]
sdb               8:16   0 447.1G  0 disk 
sdc               8:32   0 447.1G  0 disk 
sdd               8:48   0 447.1G  0 disk 
```

## 安装 Docker

### 安装 docker

```bash
# step.1
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# step.2
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# step.3 配置 Docker 镜像源
touch /etc/docker/daemon.json && vim /etc/docker/daemon.json

# step.3 内容
{
  "registry-mirrors": [
    "https://dockerproxy.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://ccr.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}

# step.4
systemctl daemon-reload
systemctl enable docker
systemctl start docker

systemctl restart docker
```

### 配置 Docker 私有仓库

#### 编写 /etc/docker/docker-compose.yaml

```yaml
version: '3'

services:
  registry:
    image: registry:2.8.2
    container_name: docker_registry
    restart: always
    ports:
      - 4000:5000
    volumes:
      - ./registry:/var/lib/registry
```

## 安装 PIP

```bash
# step.1
yum -y install epel-release
yum -y install python-pip

# step.2
mkdir ~/.pip

# step.3 配置 pip 源
cat > ~/.pip/pip.conf <<EOF
[global]
timeout = 6000
index-url = http://mirrors.aliyun.com/pypi/simple/
trusted-host = mirrors.aliyun.com
EOF
```

## 安装 Ceph-Ansible

### 创建虚拟环境

```bash
# step.1 安装虚拟环境依赖
yum install python-devel libselinux-python python-virtualenv -y

# step.2 创建虚拟环境
virtualenv /opt/ceph/venv/

# step.3 激活虚拟环境
source /opt/ceph/venv/bin/activate
```

### 虚拟环境中安装 Ceph-Ansible stable-4.0

```bash
# step.1 克隆源码
cd /opt/ceph
git clone https://github.com/ceph/ceph-ansible.git

# step.2
cd /opt/ceph/ceph-ansible && git checkout stable-4.0

# step.3
pip install -U pip
pip install -U setuptools

# step.4 安装 ceph-ansible 依赖
pip install -r requirements.txt

# step.5 编辑 ansible 配置
vim /etc/ansible/ansible.cfg

# step.5 内容
[defaults]
host_key_checking=False
pipelining=True
forks=100
```

### 编写 Ceph Inventory

```bash
# step.1
vim /opt/ceph/ceph-ansible/hosts

# step.1 内容 mons osds grafana-server 是必须要的
[mons]
node0[1:5]

[osds]
node0[1:5]

[mgrs]
node01

[mdss]
node01

[grafana-server]
node01
```

### 修改 group_vars/all.yml 配置

在 Docker 中部署 Ceph

```bash
# step.1
cd /opt/ceph/ceph-ansible/group_vars

# step.2 备份 group_vars 下的文件
for file in *; do cp $file ${file%.*}; done

# step.3 编辑 all.yml
vim /opt/ceph/ceph-ansible/group_vars/all.yml

# step.3 内容
--- 
dummy:
cluster: ceph

mon_group_name: mons
osd_group_name: osds
rgw_group_name: rgws
mds_group_name: mdss
nfs_group_name: nfss
rbdmirror_group_name: rbdmirrors
client_group_name: clients
iscsi_gw_group_name: iscsigws
mgr_group_name: mgrs
rgwloadbalancer_group_name: rgwloadbalancers
grafana_server_group_name: grafana-server

configure_firewall: False

ntp_service_enabled: false

upgrade_ceph_packages: False

ceph_origin: repository 
ceph_repository: community
ceph_mirror: http://mirrors.aliyun.com/ceph 
ceph_stable_key: http://mirrors.aliyun.com/ceph/keys/release.asc 
ceph_stable_release: nautilus 
ceph_stable_repo: "{{ ceph_mirror }}/rpm-{{ ceph_stable_release }}"

monitor_interface: ens33

public_network: "192.168.93.0/24"

radosgw_interface: ens33

ceph_docker_image_tag: v4.0.22-stable-4.0-nautilus-centos-7-x86_64
containerized_deployment: True

dashboard_admin_password: password@123456
grafana_admin_password: password@123456

no_log_on_ceph_key_tasks: False
```

### 修改 group_vars/osds.yml

```yaml
devices:
	- /dev/sdb
	- /dev/sdc
	- /dev/sdd
```

### Docker Ceph 部署

可能遇到 ceph-ansible 和已安装的 docker 冲突的情况 

+ [https://github.com/ceph/ceph-ansible/issues/5159](https://github.com/ceph/ceph-ansible/issues/5159)
+ [https://github.com/ceph/ceph-ansible/issues/3609](https://github.com/ceph/ceph-ansible/issues/3609)

```bash
# step.1
cd /opt/ceph/ceph-ansible
cp site-container.yml.sample site-container.yml

# step.2 验证连通性
ansible -i hosts all -m ping

# step.3 部署 ceph
ansible-playbook -i hosts site-container.yml \
	-e ansible_python_interpreter=/opt/ceph/venv/bin/python \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-v
```

### 部署后 Ceph Service 位置

ceph-ansible 将会把所有的 ceph 组件分别对应到各自的 service 中

```bash
ls -l /etc/systemd/system/ceph*
```

### 出错回滚

```bash
# step.1 清理集群，会将所有的容器和镜像全部清除
cd /opt/ceph/ceph-ansible
ansible-playbook -i hosts infrastructure-playbooks/purge-cluster.yml \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-v

# step.2 手动清除 ceph 相关文件
rm -rf /etc/ceph/ && rm -rf /var/lib/ceph/

# step.3 检测硬盘分区
lsblk

# step.3 如输出内容，需要移除 LVM 逻辑卷
sdc     8:32   0 447.1G  0 disk 
└─ceph--399e8b5a--4348xxxx

# step.4 移除 LVM 逻辑卷
lvremove /dev/ceph-399e8b5a--4348xxxx
```

### 集群升级

```bash
# 升级集群
cd /opt/ceph/ceph-ansible
ansible-playbook -i hosts infrastructure-playbooks/rolling_update.yml \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-v
```

### 访问控制台

+ Ceph 控制台：https://192.168.93.101:8443/#/login，账号密码 admin/password@123456
+ Grafana 控制台：https://10.247.53.6:3000/login，账号密码 admin/password@123456

## 安装 Kolla Ansible Train

### 创建虚拟环境

```bash
# step.1 安装虚拟环境依赖
yum install python-devel libselinux-python python-virtualenv -y

# step.2 创建虚拟环境
virtualenv /opt/openstack/venv

# step.3 激活
source /opt/openstack/venv/bin/activate
```

### 安装并配置 Ansible

```bash
# step.1 
cd /opt/openstack

# step.2 在虚拟环境中执行
pip install -U pip
pip install -U setuptools

# step.2
pip install 'ansible<2.10'

# step.3
vim /etc/ansible/ansible.cfg

# step.3 内容
[defaults]
host_key_checking=False
pipelining=True
forks=100
```

### 安装 Kolla Ansible

```bash
# step.1
cd /opt/openstack

# step.2 拟环境中执行
pip install kolla-ansible
pip install -U docker
pip install -U websocket-client

# step.3
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla

# step.4 复制 kolla 的文件
cp -r /opt/openstack/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
cp /opt/openstack/venv/share/kolla-ansible/ansible/inventory/* .

# step.5
ll
```

### 修改 Kolla Ansible 配置

### 修改 Inventory 文件（multinode）

```bash
[control]
node0[1:3]

[network]
node0[1:3]

[compute]
node0[1:5]

[monitoring]
node05

[storage]
node0[1:3]

[deployment]
localhost       ansible_connection=local
```

### 生成 Kolla 密钥

```bash
# step.1 执行
kolla-genpwd

# step.2 查看内容，keystone_admin_password 可修改，登录 dashboard 会用到
cat /etc/kolla/passwords.yml
```

### 修改 globals.yml

```bash
# step.1
vim /etc/kolla/globals.yml

# step.1 修改内容
kolla_base_distro: "centos"

kolla_install_type: "binary"
openstack_release: "train"

kolla_internal_vip_address: "192.168.93.100" 

network_interface: "ens33"
neutron_external_interface: "ens35"

enable_cinder: "yes"

enable_neutron_provider_networks: "yes" 

openstack_region_name: "RegionOne"

enable_chrony: "no"

enable_ceph: "no"
glance_backend_ceph: "yes"
cinder_backend_ceph: "yes"
nova_backend_ceph: "yes"
gnocchi_backend_storage: "ceph"
enable_manila_backend_cephfs_native: "yes"

docker_custom_config:
  registry-mirrors: 
    - http://192.168.93.1:4000
    - https://dockerproxy.com
    - https://hub-mirror.c.163.com
    - https://mirror.baidubce.com
    - https://ccr.ccs.tencentyun.com
    - https://registry.docker-cn.com
```

### 设置 External ceph

#### 创建 ceph pool

在 ceph 中创建存储池 pool

```bash
# step.1 进入 ceph 容器
docker exec -it ceph-mon /bin/sh

# step.2 分别创建默认的备份 pool
ceph osd pool create images 128
ceph osd pool create instances 128
ceph osd pool create volumes 128
ceph osd pool create backups 128

# step.2 或者创建基于纠错码的 pool
ceph osd pool create backups 128 erasure

# step.3 初始化 pool
rbd pool init images
rbd pool init instances
rbd pool init volumes
rbd pool init backups

# step.4 查看 pool 的情况
ceph osd pool ls
```

#### 创建 ceph user

在 ceph 中创建对应 pool 的 user，输出的 keyring 将用于 openstack 集成 ceph

```bash
# step.1 进入 ceph 容器
docker exec -it ceph-mon /bin/sh

# step.2 创建 glance
ceph auth get-or-create client.glance \
	mon 'profile rbd' \
	osd 'profile rbd pool=images' \
	mgr 'profile rbd pool=images' > \
	/tmp/ceph.client.glance.keyring

# step.2 输出 keyring
cat /tmp/ceph.client.glance.keyring
[client.glance]
key = AQC627hkgS2WKhAAQLPn80a8m7CxysJ/vasvJA==

# step.3 创建 cinder
ceph auth get-or-create client.cinder \
	mon 'profile rbd' \
	osd 'profile rbd pool=volumes, profile rbd pool=instances, profile rbd-read-only pool=images' \
	mgr 'profile rbd pool=volumes, profile rbd pool=instances' > \
	/tmp/ceph.client.cinder.keyring

# step.3 输出 keyring
cat /tmp/ceph.client.cinder.keyring
[client.cinder]
key = AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A==

# step.4 创建 cinder-backup
ceph auth get-or-create client.cinder-backup \
	mon 'profile rbd' \
	osd 'profile rbd pool=backups' \
	mgr 'profile rbd pool=backups' > \
	/tmp/ceph.client.cinder-backup.keyring

# step.4 输出 keyring
cat /tmp/ceph.client.cinder-backup.keyring
[client.cinder-backup]
key = AQAw3LhkgXPpLRAAUTqHmwNh29+nswRWjsUo+Q==

# step.5 创建 nova
ceph auth get-or-create client.nova \
	mon 'profile rbd' \
	osd 'profile rbd pool=instances' \
	mgr 'profile rbd pool=instances' > \
	/tmp/ceph.client.nova.keyring

# step.5 输出 keyring
cat /tmp/ceph.client.nova.keyring
[client.nova]
key = AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA==

# step.6 查看 user 的情况
ceph auth ls
```

#### Glance External ceph

##### 设置 glance-api.conf

在 glance-api.conf 中配置 RBD 后端存储

```bash
# step.1 创建并编辑 glance-api.conf
vim /etc/kolla/config/glance/glance-api.conf

# step.1 内容
[glance_store]
stores = rbd
default_store = rbd
rbd_store_pool = images
rbd_store_user = glance
rbd_store_ceph_conf = /etc/ceph/ceph.conf
```

##### 设置 ceph.conf

```bash
# step.1 复制 ceph.conf
cp /etc/ceph/ceph.conf /etc/kolla/config/glance/ceph.conf

# step.2 编辑
vim /etc/kolla/config/glance/ceph.conf

# step.2 添加内容
[global]
fsid = 1d89fec3-325a-4963-a950-c4afedd37fe3

# 添加内容
auth cluster required = cephx
auth service required = cephx
auth client required = cephx
```

##### 创建 keyring

```bash
# step.1 创建并编辑
vim /etc/kolla/config/glance/ceph.client.glance.keyring

# step.1 内容复制 /tmp/ceph.client.glance.keyring
[client.glance]
key = AQAX9LNkAAAAABAA2qfvgDC4wqZm8PKBcWBY4g==
```

#### Cinder External ceph

##### 设置 cinder-volume.conf

cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中

```bash
# step.1 输出 cinder_rbd_secret_uuid
cat /etc/kolla/passwords.yml | grep cinder_rbd_secret_uuid

# step.2 创建并编辑 cinder-volume.conf
vim /etc/kolla/config/cinder/cinder-volume.conf

# step.2 内容 cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中
[DEFAULT]
enabled_backends=rbd-1

[rbd-1]
rbd_ceph_conf=/etc/ceph/ceph.conf
rbd_user=cinder
backend_host=rbd:volumes
rbd_pool=volumes

volume_backend_name=rbd-1
volume_driver=cinder.volume.drivers.rbd.RBDDriver
rbd_secret_uuid = {{ cinder_rbd_secret_uuid }}
```

cinder-volume 中挂载多个 pool

```bash
[DEFAULT]
enabled_backends=rbd-1,rbd-2

[rbd-1]
rbd_ceph_conf=/etc/ceph/ceph.conf
rbd_user=cinder
backend_host=rbd:volumes
rbd_pool=volumes

volume_backend_name=rbd-1
volume_driver=cinder.volume.drivers.rbd.RBDDriver
rbd_secret_uuid = {{ cinder_rbd_secret_uuid }}

[rbd-2]
rbd_ceph_conf=/etc/ceph/ceph.conf
rbd_user=cinder                       #
backend_host=rbd:volumes-erasure      # 
rbd_pool=volumes-erasure              #
volume_backend_name=rbd-2
volume_driver=cinder.volume.drivers.rbd.RBDDriver
rbd_secret_uuid = {{ cinder_rbd_secret_uuid }}
```

##### 设置 cinder-backup.conf

```bash
# step.1 创建并编辑 cinder-volume.conf
vim /etc/kolla/config/cinder/cinder-backup.conf

# step.1 内容
[DEFAULT]
backup_ceph_conf=/etc/ceph/ceph.conf
backup_ceph_user=cinder-backup
backup_ceph_chunk_size = 134217728
backup_ceph_pool=backups

backup_driver = cinder.backup.drivers.ceph.CephBackupDriver
backup_ceph_stripe_unit = 0
backup_ceph_stripe_count = 0
restore_discard_excess_bytes = true
```

##### 设置 ceph.conf

```bash
# step.1 复制 ceph.conf
cp /etc/ceph/ceph.conf /etc/kolla/config/cinder/ceph.conf

# step.2 编辑
vim /etc/kolla/config/cinder/ceph.conf

# step.2 添加内容
[global]
fsid = 1d89fec3-325a-4963-a950-c4afedd37fe3

# 添加内容
auth cluster required = cephx
auth service required = cephx
auth client required = cephx
```

##### 创建 keyring

```bash
# step.1 创建并编辑
vim /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder.keyring

# step.1 内容复制 /tmp/ceph.client.cinder.keyring
[client.cinder]
key = AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w==

# step.2 创建并编辑
vim /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder-backup.keyring

# step.2 内容复制 /tmp/ceph.client.cinder-backup.keyring
[client.cinder-backup]
key = AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w==

# step.3 创建并编辑
vim /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring

# step.3 内容复制 /tmp/ceph.client.cinder.keyring
[client.cinder]
key = AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w==
```

#### Nova External ceph

如果使用 ceph-ansible 部署的 ceph，需要将 ceph.client.cinder.keyring 复制为 /etc/kolla/config/nova/ceph.client.nova.keyring

```bash
# step.1 复制 ceph.conf
cp /etc/ceph/ceph.conf /etc/kolla/config/ceph.conf

# step.2 编辑
vim /etc/kolla/config/ceph.conf

# step.2 添加内容
[global]
fsid = 1d89fec3-325a-4963-a950-c4afedd37fe3

# 添加内容
auth cluster required = cephx
auth service required = cephx
auth client required = cephx

# step.3 复制 ceph.client.cinder.keyring
cp /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring /etc/kolla/config/nova/ceph.client.nova.keyring

# step.4 编辑 ceph.client.nova.keyring
vim /etc/kolla/config/nova/ceph.client.nova.keyring

# step.4 添加内容复制 /tmp/ceph.client.nova.keyring
[client.nova]
key = AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA==

[client.cinder]
key = AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A==
```

##### 创建 nova-compute.conf

```bash
# step.1 创建并编辑
vim /etc/kolla/config/nova/nova-compute.conf

# step.1 内容
[libvirt]
images_rbd_pool=instances
images_type=rbd
images_rbd_ceph_conf=/etc/ceph/ceph.conf
rbd_user=nova
```

#### 目录结构

```bash
tree /etc/kolla/config/

/etc/kolla/config/
├── cinder
│   ├── ceph.conf
│   ├── cinder-backup
│   │   ├── ceph.client.cinder-backup.keyring
│   │   └── ceph.client.cinder.keyring
│   ├── cinder-backup.conf
│   ├── cinder-volume
│   │   └── ceph.client.cinder.keyring
│   └── cinder-volume.conf
├── glance
│   ├── ceph.client.glance.keyring
│   ├── ceph.conf
│   └── glance-api.conf
└── nova
    ├── ceph.client.cinder.keyring
    ├── ceph.client.nova.keyring
    ├── ceph.conf
    └── nova-compute.conf
```

## 部署 OpenStack

### 安装 OpenStack

+ virtualenv: [https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html](https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html)
+ ansible_python_interpreter: [https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html](https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html)

```bash
# step.1 检测节点连通性
cd /opt/openstack
ansible -i multinode all -m ping

# step.2
kolla-ansible -i multinode certificates

# step.3 根据 Kolla 部署依赖创建服务器
kolla-ansible -i multinode bootstrap-servers \
	-e virtualenv=/opt/openstack/venv \
	-v

# step.4 部署前检查主机
kolla-ansible -i multinode prechecks \
	-e virtualenv=/opt/openstack/venv \
	-e ansible_python_interpreter=/opt/openstack/venv/bin/python \
	-vvvv

# step.5 拉取镜像
kolla-ansible -i multinode pull \
	-e virtualenv=/opt/openstack/venv \
	-e ansible_python_interpreter=/opt/openstack/venv/bin/python \
	-vvvv

# step.6 部署 OpenStack
kolla-ansible -i multinode deploy \
	-e virtualenv=/opt/openstack/venv \
	-e ansible_python_interpreter=/opt/openstack/venv/bin/python \
	-vvvv

kolla-ansible -i multinode deploy \
	-e virtualenv=/opt/openstack/venv \
	-vvvv
	
##################
# 停止所有节点 openstack 服务
kolla-ansible -i multinode stop \
	-e virtualenv=/opt/openstack/venv \
	--yes-i-really-really-mean-it \
	-vvvv

# 销毁所有节点 openstack 服务
kolla-ansible -i multinode destroy \
	-e virtualenv=/opt/openstack/venv \
	--yes-i-really-really-mean-it \
	-vvvv
```

### 使用 OpenStack

```bash
# step.1 安装 OpenStack CLI 客户端
pip install python-openstackclient python-glanceclient python-neutronclient -y

# step.2 生成 openrc 文件
kolla-ansible post-deploy

# step.3 执行脚本，将密码设置到环境变量中
source /etc/kolla/admin-openrc.sh

# step.3 执行脚本生成示例网络、镜像、实例等
cd /usr/local/share/kolla-ansible && ./init-runonce
```

### 访问 horizon

访问 ip 地址可进入 horizon 登录界面

- 用户名：admin
- 密码：查看 /etc/kolla/passwords.yml

## 创建镜像

OpenStack 默认支持的镜像 [https://docs.openstack.org/image-guide/obtain-images.html](https://docs.openstack.org/image-guide/obtain-images.html)

```bash
# step.1
yum install libguestfs-tools -y

# step.2
export LIBGUESTFS_BACKEND=direct

# step.3 设置镜像密码，否则会创建虚拟机时会随机生成密码
virt-customize -a ./CentOS-7-x86_64-GenericCloud-2009.qcow2 \
  --root-password password:123456

virt-customize -a ./debian-9.13.42-20220706-openstack-amd64.qcow2 \
  --root-password password:123456

# step.4 创建 glance 镜像
openstack image create "CentOS-7-x86_64-GenericCloud-2009" \
  --public \
  --min-ram 512 \
  --min-disk 20 \
  --disk-format qcow2 \
  --container-format bare \
  --file ./CentOS-7-x86_64-GenericCloud-2009.qcow2

openstack image create "debian-9.13.42-20220706-openstack-amd64" \
  --public \
  --min-ram 512 \
  --min-disk 20 \
  --disk-format qcow2 \
  --container-format bare \
  --file ./debian-9.13.42-20220706-openstack-amd64.qcow2
```