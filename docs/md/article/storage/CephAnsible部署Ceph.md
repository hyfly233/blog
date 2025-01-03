---
title: CephAnsible部署Ceph
sidebar: heading
---
# Ceph-Ansible 部署 Ceph

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

# 或者指定 /usr/bin/python2
ansible-playbook -i hosts site-container.yml \
	-e ansible_python_interpreter=/usr/bin/python2 \
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
