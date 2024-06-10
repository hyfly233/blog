+ [https://access.redhat.com/documentation/zh-cn/red_hat_ceph_storage/4/html/operations_guide/ceph-osds-ops](https://access.redhat.com/documentation/zh-cn/red_hat_ceph_storage/4/html/operations_guide/ceph-osds-ops)
+ [https://www.cnblogs.com/lvzhenjiang/p/14908195.html](https://www.cnblogs.com/lvzhenjiang/p/14908195.html)

## 扩充 osd 节点
### 激活虚拟环境
```bash
# step.1 激活虚拟环境
source /opt/venv/ceph/bin/activate


source /opt/venv/ceph-2/bin/activate
```
### 编辑 osds.yml
```bash
vim /opt/ceph/ceph-ansible/group_vars/osds.yml

# 添加内容
devices:
  - /dev/sdc
  - /dev/sdd
  - /dev/sde
```
### 部署
```bash
cd /opt/ceph/ceph-ansible

ansible -i hosts all -m ping

ansible-playbook -i hosts infrastructure-playbooks/add-osd.yml \
	-e ansible_python_interpreter=/usr/bin/python2 \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-v
```

## 添加 osd 节点的硬盘
```bash
# 查看硬盘类型
lsblk -d -o name,rota

NAME ROTA
sda     0
sdb     0
sdc     0
sdd     0
sde     1
```
### 编辑 osds.yml
```bash
vim /opt/ceph/ceph-ansible/group_vars/osds.yml

# 添加内容
devices:
  - /dev/sdc
  - /dev/sdd

lvm_volumes:
  - data: /dev/sde
```
### 部署
```bash
# step.1
cd /opt/ceph/ceph-ansible

# step.2 验证连通性
ansible -i hosts all -m ping

# step.3
ansible-playbook -i hosts site-container.yml \
	-e ansible_python_interpreter=/usr/bin/python2 \
	-e container_package_name=docker-ce \
	-e container_service_name=docker-ce \
	-e container_binding_name=python-docker-py \
	-vvv
```

