---
title: ESXI虚机迁移至OpenStack
sidebar: heading
---

## 迁移步骤

### 安装 ovftools 工具

在 [ovftool 下载](https://customerconnect.vmware.com/cn/downloads/search?query=ovftool) 下载对应的 ovftool 文件，如 VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle，上传到相应的文件夹中，执行

```bash
# step.1
sh VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle

# step.2 验证
ovftool -v

# step.3 导出远程ESXI中虚拟机的OVF模板到本地，密码如果存在特殊字符需要进行 url 编码
ovftool --X:logFile=./ovftool.log \
	vi://root:password%40123@127.0.0.1/source \
	./source.ovf

# step.4
ll

source.vmdk
```

### 转换镜像

#### 方式1：转换为 QCOW2 格式

在 ESXi 中运行的虚拟机可以转换为 OpenStack 支持的 QCOW2 镜像格式

```bash
# step.1
yum install qemu-img -y

# step.2 转换镜像
qemu-img convert -f vmdk -O qcow2 \
	/path/to/source.vmdk \
	/path/to/destination.qcow2
	
# step.3 修改密码（可选）
export LIBGUESTFS_BACKEND=direct

virt-customize -a /path/to/destination.qcow2 \
  --root-password password:123456

# step.4 登录 openstack
source /etc/kolla/admin-openrc.sh

# step.5 创建镜像
openstack image create "test-image" \
  --property hw_disk_bus=ide \
	--disk-format qcow2 \
	--container-format bare \
	--file ./destination.qcow2

# step.6
openstack image list
```

#### 方式2：转换为 RAW 格式

```bash
# step.1
yum install qemu-img -y

# step.2 转换镜像
qemu-img convert -f vmdk -O raw \
	/path/to/source.vmdk \
	/path/to/destination.raw

# step.3 登录 openstack
source /etc/kolla/admin-openrc.sh

# step.4 创建镜像
openstack image create "test-image" \
  --property hw_disk_bus=ide \
	--disk-format raw \
	--container-format bare \
	--file ./destination.raw

# step.5
openstack image list
```

#### 方式3：直接使用 VMDK 格式

```bash
# step.1 登录 openstack
source /etc/kolla/admin-openrc.sh

# step.2 创建镜像
openstack image create "test-vmdk" \
	--property hw_disk_bus=ide \
	--disk-format vmdk \
	--container-format bare \
	--file ./destination.vmdk

# step.3
openstack image list
```

### 参考资料

+ https://www.51cto.com/article/618604.html
+ https://blog.csdn.net/jmh1996/article/details/102815195
+ https://blog.51cto.com/qsyj/6066745