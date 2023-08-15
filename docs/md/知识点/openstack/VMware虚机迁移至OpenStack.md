## 迁移步骤

### 安装 ovftools 工具

在 [https://customerconnect.vmware.com/cn/downloads/search?query=ovftool](https://customerconnect.vmware.com/cn/downloads/search?query=ovftool) 下载对应的 ovftool 文件
如 VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle，上传到相应的文件夹中，执行

```bash
# step.1
sh VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle

# step.2 验证
ovftool -v

# step.3 导出远程ESXI中虚拟机的OVF模板到本地，密码如果存在特殊字符需要进行 url 编码
ovftool \
	--X:logFile=./ovftool.log \
	vi://root:password%40123@127.0.0.1/source \
	./source.ovf

# step.4
ll
```

### 创建虚拟机镜像

#### 转换为 QCOW2 格式（可选）

在 ESXi 中运行的虚拟机可以转换为 OpenStack 支持的 QCOW2 镜像格式

```bash
# step.1
yum install qemu-img -y

# step.2 转换镜像
qemu-img convert -f vmdk -O qcow2 \
	/path/to/source.vmdk \
	/path/to/destination.qcow2

# step.3 创建镜像
openstack image create "test-image" \
	--disk-format qcow2 \
	--container-format bare \
	--file ./destination.qcow2

# step.4
openstack image list
```

创建的虚拟机可能会出现磁盘分区找不到的情况

```bash
Warning: /dev/centos/root does not exist
Warning: /dev/centos/swap does not exist
Warning: /dev/mapper/centos-root does not exist
```

#### 直接使用 VMDK 格式

```bash
# step.1
openstack image create "test-vmdk" \
	--property hw_disk_bus=ide \
	--disk-format vmdk \
	--container-format bare \
	--file ./destination.vmdk

# step.2
openstack image list
```

创建的虚拟机可能会出现系统盘大小与实际创建虚拟机时选的系统盘大小不一致。比如虚拟机在 VMware 创建时使用了 20G 的系统盘，迁移到 OpenStack 时使用 40G 的系统盘，使用 lsblk 命令会发现其中的 20G 空间没有被使用

[https://www.51cto.com/article/618604.html](https://www.51cto.com/article/618604.html)

[https://blog.csdn.net/jmh1996/article/details/102815195](https://blog.csdn.net/jmh1996/article/details/102815195)

[https://blog.51cto.com/qsyj/6066745