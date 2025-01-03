---
title: iSCSI安装
sidebar: heading
---

# iSCSI安装

服务器手动和 tgtd 工具安装不能同时进行，可能导致手动安装生成 portals 时出现端口冲突

## 服务器手动安装

### 安装 target

```bash
yum -y install targetd targetcli

systemctl restart targetd && systemctl enable targetd
```

### 手动分盘

```bash
# step.1 对磁盘进行分区：n 进行分盘、w 保存退出
fdisk /dev/sdd

# step.2
partprobe
```

### 创建 block

```bash
# step.1 进入 target 交互页面
targetcli

################### target 交互页面 #######################

# step.2
ls /

o- / .............................................................................. [...]
  o- backstores ................................................................... [...]
  | o- block ....................................................... [Storage Objects: 0]
  | o- fileio ...................................................... [Storage Objects: 0]
  | o- pscsi ....................................................... [Storage Objects: 0]
  | o- ramdisk ..................................................... [Storage Objects: 0]
  o- iscsi ................................................................. [Targets: 0]
  o- loopback .............................................................. [Targets: 0]

# step.3
cd backstores/block

# step.4 创建块
create name=block1  dev=/dev/sdd1
create name=block2  dev=/dev/sde1

# step.5
ls /

o- / .............................................................................. [...]
  o- backstores ................................................................... [...]
  | o- block ....................................................... [Storage Objects: 2]
  | | o- block1 ........................... [/dev/sdd1 (447.1GiB) write-thru deactivated]
  | | | o- alua ........................................................ [ALUA Groups: 1]
  | | |   o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | | o- block2 ........................... [/dev/sde1 (447.1GiB) write-thru deactivated]
  | |   o- alua ........................................................ [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | o- fileio ...................................................... [Storage Objects: 0]
  | o- pscsi ....................................................... [Storage Objects: 0]
  | o- ramdisk ..................................................... [Storage Objects: 0]
  o- iscsi ................................................................. [Targets: 0]
  o- loopback .............................................................. [Targets: 0]
```

### 创建 target

```bash
################### target 交互页面 #######################

# step.6
cd /iscsi

# step.7 创建 target
create wwn=iqn.2024-03.com.test:server

# step.8
ls /

o- / .............................................................................. [...]
  o- backstores ................................................................... [...]
  | o- block ....................................................... [Storage Objects: 2]
  | | o- block1 ........................... [/dev/sdd1 (447.1GiB) write-thru deactivated]
  | | | o- alua ........................................................ [ALUA Groups: 1]
  | | |   o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | | o- block2 ........................... [/dev/sde1 (447.1GiB) write-thru deactivated]
  | |   o- alua ........................................................ [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | o- fileio ...................................................... [Storage Objects: 0]
  | o- pscsi ....................................................... [Storage Objects: 0]
  | o- ramdisk ..................................................... [Storage Objects: 0]
  o- iscsi ................................................................. [Targets: 1]
  | o- iqn.2024-03.com.cloudos:server ......................................... [TPGs: 1]
  |   o- tpg1 .................................................... [no-gen-acls, no-auth]
  |     o- acls ............................................................... [ACLs: 0]
  |     o- luns ............................................................... [LUNs: 0]
  |     o- portals ......................................................... [Portals: 1]
  |       o- 0.0.0.0:3260 .......................................................... [OK]
  o- loopback .............................................................. [Targets: 0]
```

### 创建 acls

```bash
################### target 交互页面 #######################

# step.9 设置访问控制列表
cd /iscsi/iqn...:server/tpg1/acls

# step.10
create wwn=iqn.2024-03.com.test:client

cd /iscsi/iqn...:server/tpg1/acls/iqn...:client

# step.11
set auth userid=username password=password

# step.12
ls /

o- / .............................................................................. [...]
  o- backstores ................................................................... [...]
  | o- block ....................................................... [Storage Objects: 2]
  | | o- block1 ........................... [/dev/sdd1 (447.1GiB) write-thru deactivated]
  | | | o- alua ........................................................ [ALUA Groups: 1]
  | | |   o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | | o- block2 ........................... [/dev/sde1 (447.1GiB) write-thru deactivated]
  | |   o- alua ........................................................ [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | o- fileio ...................................................... [Storage Objects: 0]
  | o- pscsi ....................................................... [Storage Objects: 0]
  | o- ramdisk ..................................................... [Storage Objects: 0]
  o- iscsi ................................................................. [Targets: 1]
  | o- iqn.2024-03.com.cloudos:server ......................................... [TPGs: 1]
  |   o- tpg1 .................................................... [no-gen-acls, no-auth]
  |     o- acls ............................................................... [ACLs: 1]
  |     | o- iqn.2024-03.com.cloudos:client ............................ [Mapped LUNs: 0]
  |     o- luns ............................................................... [LUNs: 0]
  |     o- portals ......................................................... [Portals: 1]
  |       o- 0.0.0.0:3260 .......................................................... [OK]
  o- loopback .............................................................. [Targets: 0]
```

### 创建 luns

```bash
################### target 交互页面 #######################
# step.13
cd /iscsi/iqn...:server/tpg1/luns

create /backstores/block/block1
create /backstores/block/block2

ls /

o- / .............................................................................. [...]
  o- backstores ................................................................... [...]
  | o- block ....................................................... [Storage Objects: 2]
  | | o- block1 ............................. [/dev/sdd1 (447.1GiB) write-thru activated]
  | | | o- alua ........................................................ [ALUA Groups: 1]
  | | |   o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | | o- block2 ............................. [/dev/sde1 (447.1GiB) write-thru activated]
  | |   o- alua ........................................................ [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | o- fileio ...................................................... [Storage Objects: 0]
  | o- pscsi ....................................................... [Storage Objects: 0]
  | o- ramdisk ..................................................... [Storage Objects: 0]
  o- iscsi ................................................................. [Targets: 1]
  | o- iqn.2024-03.com.cloudos:server ......................................... [TPGs: 1]
  |   o- tpg1 .................................................... [no-gen-acls, no-auth]
  |     o- acls ............................................................... [ACLs: 1]
  |     | o- iqn.2024-03.com.cloudos:client ............................ [Mapped LUNs: 2]
  |     |   o- mapped_lun0 ..................................... [lun0 block/block1 (rw)]
  |     |   o- mapped_lun1 ..................................... [lun1 block/block2 (rw)]
  |     o- luns ............................................................... [LUNs: 2]
  |     | o- lun0 ......................... [block/block1 (/dev/sdd1) (default_tg_pt_gp)]
  |     | o- lun1 ......................... [block/block2 (/dev/sde1) (default_tg_pt_gp)]
  |     o- portals ......................................................... [Portals: 1]
  |       o- 0.0.0.0:3260 .......................................................... [OK]
  o- loopback .............................................................. [Targets: 0]
```

### 创建 portals

```bash
################### target 交互页面 #######################
# step.14
cd /iscsi/iqn...:server/tpg1/portals

# step.15
create 192.168.0.16 ip_port=3260

# step.
ls /

o- / .............................................................................. [...]
  o- backstores ................................................................... [...]
  | o- block ....................................................... [Storage Objects: 2]
  | | o- block1 ............................. [/dev/sdd1 (447.1GiB) write-thru activated]
  | | | o- alua ........................................................ [ALUA Groups: 1]
  | | |   o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | | o- block2 ............................. [/dev/sde1 (447.1GiB) write-thru activated]
  | |   o- alua ........................................................ [ALUA Groups: 1]
  | |     o- default_tg_pt_gp ............................ [ALUA state: Active/optimized]
  | o- fileio ...................................................... [Storage Objects: 0]
  | o- pscsi ....................................................... [Storage Objects: 0]
  | o- ramdisk ..................................................... [Storage Objects: 0]
  o- iscsi ................................................................. [Targets: 1]
  | o- iqn.2024-03.com.cloudos:server ......................................... [TPGs: 1]
  |   o- tpg1 .................................................... [no-gen-acls, no-auth]
  |     o- acls ............................................................... [ACLs: 1]
  |     | o- iqn.2024-03.com.cloudos:client ............................ [Mapped LUNs: 2]
  |     |   o- mapped_lun0 ..................................... [lun0 block/block1 (rw)]
  |     |   o- mapped_lun1 ..................................... [lun1 block/block2 (rw)]
  |     o- luns ............................................................... [LUNs: 2]
  |     | o- lun0 ......................... [block/block1 (/dev/sdd1) (default_tg_pt_gp)]
  |     | o- lun1 ......................... [block/block2 (/dev/sde1) (default_tg_pt_gp)]
  |     o- portals ......................................................... [Portals: 1]
  |       o- 10.247.53.16:3260 ..................................................... [OK]
  o- loopback .............................................................. [Targets: 0]

# step. 保存退出
exit
```

### 重启 target 服务

```bash
# step. 查看更新后的配置
cat /etc/target/saveconfig.json

# 
systemctl restart target && systemctl enable target
```

## 服务器 tgtd 工具安装

```bash
yum install scsi-target-utils -y

systemctl start tgtd
systemctl enable tgtd
systemctl status tgtd
```

## 客户端安装

```bash
#
yum install iscsi-initiator-utils -y

#
vim /etc/iscsi/initiatorname.iscsi

# 修改内容，和 target acl 保持一致
InitiatorName=iqn.2024-03.com.test:client

# 修改 chap 认证
vim /etc/iscsi/iscsid.conf

# 打开注释，和 target acl 的账号密码保持一致
node.session.auth.username = username
node.session.auth.password = password

# 
systemctl restart iscsid && systemctl start iscsid

# 发现 iscsi target
iscsiadm --mode discoverydb \
  --type sendtargets \
  --portal 192.168.0.16 \
  --discover

# 登录 iscsi target
iscsiadm --mode node \
  --targetname iqn.2024-03.com.test:server \
  --portal 192.168.0.16:3260 \
  --login

# 多了两块盘
lsblk
lsscsi
```

## 参考资料

+ [https://blog.csdn.net/qq_44777969/article/details/115026137](https://blog.csdn.net/qq_44777969/article/details/115026137)
+ [https://www.jianshu.com/p/b48e3fec1303](https://www.jianshu.com/p/b48e3fec1303)
+ [https://cshihong.github.io/2018/10/23/ISCSI%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%90%AD%E5%BB%BA%E4%B8%8E%E9%85%8D%E7%BD%AE/](https://cshihong.github.io/2018/10/23/ISCSI%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%90%AD%E5%BB%BA%E4%B8%8E%E9%85%8D%E7%BD%AE/)