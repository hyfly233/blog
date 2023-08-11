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

# step.3
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
# step.1
yum install python-devel libselinux-python python-virtualenv -y

# step.2 创建虚拟环境
virtualenv /opt/ceph/venv/

# step.3 激活
source /opt/ceph/venv/bin/activate

# 退出虚拟环境
deactivate
```

### 虚拟环境中安装 Ceph-Ansible stable-4.0

```bash
# step.1 克隆源码
cd /opt/ceph
git clone https://github.com/ceph/ceph-ansible.git

# step.2
cd ceph-ansible && git checkout stable-4.0

# step.3
pip install -U pip
pip install -U setuptools

# step.4 安装依赖
pip install -r requirements.txt

# step.5
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

### 备份 group_vars 下的文件

```bash
# step.1
cd ceph-ansible/group_vars

# step.2
for file in *; do cp $file ${file%.*}; done
```

### 修改 group_vars/all.yml 配置

在 Docker 中部署 Ceph

```bash
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

# ceph_origin: repository 
# ceph_repository: community
# ceph_mirror: http://mirrors.aliyun.com/ceph 
# ceph_stable_key: http://mirrors.aliyun.com/ceph/keys/release.asc 
# ceph_stable_release: nautilus 
# ceph_stable_repo: "{{ ceph_mirror }}/rpm-{{ ceph_stable_release }}"

monitor_interface: ens33

public_network: "192.168.93.0/24"

radosgw_interface: ens33

ceph_docker_image_tag: v4.0.22-stable-4.0-nautilus-centos-7-x86_64
containerized_deployment: True

dashboard_admin_password: password@123456
grafana_admin_password: password@123456

no_log_on_ceph_key_tasks: False
```

### 修改 group_vars/osds.yml 配置

```yaml
devices:
	- /dev/sdb
	- /dev/sdc
	- /dev/sdd
```

### Docker Ceph 部署

- 可能遇到 ceph-ansible 和已安装的 docker 冲突的情况 [https://github.com/ceph/ceph-ansible/issues/5159](https://github.com/ceph/ceph-ansible/issues/5159)、[https://github.com/ceph/ceph-ansible/issues/3609](https://github.com/ceph/ceph-ansible/issues/3609)

```bash
# step.1
cp site-container.yml.sample site-container.yml

# step.2 验证连通性
ansible -i hosts all -m ping

# step.3
ansible-playbook -i hosts site-container.yml \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-v
```

### Ceph Service 位置

ceph-ansible 将会把所有的 ceph 组件分别对应到各自的 service 中，随着主机启动而启动

```bash
ls -l /etc/systemd/system/ceph*
```

### 出错回滚

```bash
// step.1 清理集群，会将所有的容器和镜像全部清除
ansible-playbook -i hosts \
	infrastructure-playbooks/purge-cluster.yml \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py

// step.2
rm -rf /etc/ceph/ && rm -rf /var/lib/ceph/

// step.3 检测硬盘分区
lsblk

// step.3 如输出内容
sdc     8:32   0 447.1G  0 disk 
└─ceph--399e8b5a--4348xxxx

// step.4 移除 LVM 逻辑卷
lvremove /dev/ceph-399e8b5a--4348xxxx
```

```bash
// 升级集群
ansible-playbook -vv -i hosts infrastructure-playbooks/rolling_update.yml \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-v
```

## 安装 Kolla Ansible Train

### 安装依赖

```bash
yum install python-devel libselinux-python python-virtualenv -y
```

### 创建虚拟环境

```bash
# step.1 创建虚拟环境
virtualenv /opt/openstack/venv

# step.2 激活
source /opt/openstack/venv/bin/activate
```

### 安装并配置 Ansible

```bash
# step.1 在虚拟环境中执行
pip install -U pip
pip install -U setuptools

# step.2
pip install 'ansible<2.10'

yum install ansible

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
# step.1 在虚拟环境中执行
pip install kolla-ansible

# step.4
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla

cp -r /opt/venv/openstack/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
cp /opt/venv/openstack/share/kolla-ansible/ansible/inventory/* .


cp -r /opt/openstack/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
cp /opt/openstack/venv/share/kolla-ansible/ansible/inventory/* .
```

### 修改 Kolla Ansible 配置

### 修改 Inventory 文件（multinode） todo

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
node04

[deployment]
localhost       ansible_connection=local
```

### 检测节点

```bash
ansible -i multinode all -m ping
```

### 生成 Kolla 密钥

```bash
# step.1 执行
kolla-genpwd

# step.2 查看内容
cat /etc/kolla/passwords.yml
```

### 修改 Kolla globals.yml

```bash
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

docker exec -it  '/bin/bash'

在ceph节点中创建 pool

```bash
ceph osd pool create images 128
ceph osd pool create instances 128
ceph osd pool create volumes 128
ceph osd pool create backups 128

rbd pool init images
rbd pool init instances
rbd pool init volumes
rbd pool init backups
```

在ceph节点中创建 user

```bash
# step.1 创建 glance
ceph auth get-or-create client.glance mon 'profile rbd' osd 'profile rbd pool=images' mgr 'profile rbd pool=images'

# step.1 输出
[client.glance]
        key = AQC627hkgS2WKhAAQLPn80a8m7CxysJ/vasvJA==

# step.2 创建 cinder
ceph auth get-or-create client.cinder mon 'profile rbd' osd 'profile rbd pool=volumes, profile rbd pool=instances, profile rbd-read-only pool=images' mgr 'profile rbd pool=volumes, profile rbd pool=instances'

[client.cinder]
        key = AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A==

# step.3 创建 cinder-backup
ceph auth get-or-create client.cinder-backup mon 'profile rbd' osd 'profile rbd pool=backups' mgr 'profile rbd pool=backups'

[client.cinder-backup]
        key = AQAw3LhkgXPpLRAAUTqHmwNh29+nswRWjsUo+Q==

# step.4 创建 nova
ceph auth get-or-create client.nova mon 'profile rbd' osd 'profile rbd pool=instances' mgr 'profile rbd pool=instances'

[client.nova]
        key = AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA==
```

#### 获取 ceph 的密钥

在 ceph 管理节点生成密钥

```bash
# step.1
ceph auth get-or-create client.glance > /tmp/ceph.client.glance.keyring

cat /tmp/ceph.client.glance.keyring

[client.glance]
        key = AQC627hkgS2WKhAAQLPn80a8m7CxysJ/vasvJA==

# step.2
ceph auth get-or-create client.cinder > /tmp/ceph.client.cinder.keyring

[client.cinder]
        key = AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A==

# step.3
ceph auth get-or-create client.cinder-backup > /tmp/ceph.client.cinder-backup.keyring

[client.cinder-backup]
        key = AQAw3LhkgXPpLRAAUTqHmwNh29+nswRWjsUo+Q==

# step.4
ceph auth get-or-create client.nova > /tmp/ceph.client.nova.keyring

[client.nova]
        key = AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA==
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

fsid 在 cat /etc/ceph/ceph.conf

```bash
# step.1 编辑
cp /etc/ceph/ceph.conf /etc/kolla/config/glance/ceph.conf

# step.1 内容
[global]
fsid = 1d89fec3-325a-4963-a950-c4afedd37fe3

# 添加下面内容
auth cluster required = cephx
auth service required = cephx
auth client required = cephx
```

##### 创建 keyring

```bash
# step.1 创建并编辑
vim /etc/kolla/config/glance/ceph.client.glance.keyring

# step.1 内容 key 是 ceph 管理节点生成的密钥
[client.glance]
key = AQAX9LNkAAAAABAA2qfvgDC4wqZm8PKBcWBY4g==
```

#### Cinder External ceph

##### 设置 cinder-volume.conf

```bash
# 创建并编辑 cinder-volume.conf
vim /etc/kolla/config/cinder/cinder-volume.conf
```

cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中
cat /etc/kolla/passwords.yml |grep cinder_rbd_secret_uuid

```bash
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

ceph 中添加 cinder 用户

##### 设置 cinder-backup.conf

```bash
# 创建并编辑 cinder-volume.conf
vim /etc/kolla/config/cinder/cinder-backup.conf
```

```bash
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
# step.1 创建并编辑
cp /etc/ceph/ceph.conf /etc/kolla/config/cinder/ceph.conf

# step.1 内容
[global]
fsid = 1d89fec3-325a-4963-a950-c4afedd37fe3

# 添加下面内容
auth cluster required = cephx
auth service required = cephx
auth client required = cephx
```

##### 创建 keyring

```bash
# step.1 创建并编辑
vim /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder.keyring

# step.1 内容
[client.cinder]
key = AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w==

# step.2 创建并编辑
vim /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder-backup.keyring

# step.2 内容
[client.cinder-backup]
key = AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w==

# step.3 创建并编辑
vim /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring

# step.3 内容
[client.cinder]
key = AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w==
```

#### Nova External ceph

如果使用 ceph-ansible，需要将 ceph.client.cinder.keyring 复制为 /etc/kolla/config/nova/ceph.client.nova.keyring

If you are using ceph-ansible - please copy ceph.client.cinder.keyring as /etc/kolla/config/nova/ceph.client.nova.keyring

```bash
cp /etc/ceph/ceph.conf /etc/kolla/config/ceph.conf

# step.1 内容
[client]
rbd_cache = True
rbd_cache_max_dirty = 134217728
rbd_cache_max_dirty_age = 10
rbd_cache_size = 335544320

[global]
auth cluster required = cephx
auth service required = cephx
auth client required = cephx

fsid = e408cb46-d5ce-4cf1-beb2-9dab81519f94

mon host = [v2:192.168.93.1:3300,v1:192.168.93.1:6789],[v2:192.168.93.2:3300,v1:192.168.93.2:6789],[v2:192.168.93.3:3300,v1:192.168.93.3:6789],[v2:192.168.93.4:3300,v1:192.168.93.4:6789],[v2:192.168.93.5:3300,v1:192.168.93.5:6789]
mon initial members = node01,node02,node03,node04,node05

cluster network = 192.168.93.0/24
public network = 192.168.93.0/24

# step.2
cp /etc/kolla/config/ceph.conf /etc/kolla/config/nova/ceph.conf

# step.3
ls /etc/kolla/config/nova
ceph.client.cinder.keyring  ceph.client.nova.keyring  nova-compute.conf ceph.conf
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

virtualenv: [https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html](https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html)
ansible_python_interpreter: [https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html](https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html)

 pip install -U docker    pip install websocket-client

```bash
# step.1
kolla-ansible -i multinode certificates

# step.2 根据 Kolla 部署依赖创建服务器
kolla-ansible -i multinode bootstrap-servers \
	-e virtualenv=/opt/openstack/venv \
	-v

# step.3 部署前检查主机
kolla-ansible -i multinode prechecks \
	-e virtualenv=/opt/openstack/venv \
	-e ansible_python_interpreter=/opt/openstack/venv/bin/python \
	-vvvv

# step.4
kolla-ansible -i multinode pull \
	-e virtualenv=/opt/openstack/venv \
	-e ansible_python_interpreter=/opt/openstack/venv/bin/python \
	-vvvv

# step.5 部署 OpenStack
kolla-ansible -i multinode deploy \
	-e virtualenv=/opt/openstack/venv \
	-e ansible_python_interpreter=/opt/openstack/venv/bin/python \
	-vvvv

kolla-ansible -i multinode deploy \
	-e virtualenv=/opt/openstack/venv \
	-vvvv
```

```bash
# 停止
kolla-ansible -i multinode stop \
	-e virtualenv=/opt/openstack/venv \
	--yes-i-really-really-mean-it \
	-v

# 销毁
kolla-ansible -i multinode destroy \
	-e virtualenv=/opt/openstack/venv \
	--yes-i-really-really-mean-it \
	-v
```

### 使用 OpenStack

```bash
# step.1 安装 OpenStack CLI 客户端
pip install python-openstackclient python-glanceclient python-neutronclient

# step.2 生成 openrc 文件
kolla-ansible post-deploy

# 自动建立 demo project，建议手工建立
source /etc/kolla/admin-openrc.sh

# step.3 执行脚本生成示例网络、镜像、实例等
cd /usr/local/share/kolla-ansible && ./init-runonce
```

### 访问 horizon

访问 ip 地址可进入 horizon 登录界面

- 用户名：admin
- 密码：查看 /etc/kolla/passwords.yml