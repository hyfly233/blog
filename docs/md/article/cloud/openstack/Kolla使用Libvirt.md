---
title: Kolla使用Libvirt
sidebar: heading
---


## 参考资料
[https://docs.openstack.org/kolla-ansible/train/reference/compute/libvirt-guide.html](https://docs.openstack.org/kolla-ansible/train/reference/compute/libvirt-guide.html)

## OpenStack 容器中使用 Libvirt
OpenStack 容器中集成了 libvirt，进入容器 nova_libvirt 可以使用 virsh 命令查看虚机列表、虚机详情、虚机资源使用等信息。

```bash
# step.1 进入 docker 容器 nova_libvirt
docker exec -it nova_libvirt /bin/sh

# step.2 查看虚机列表
virsh list

 Id    Name                           State
----------------------------------------------------
 28    instance-000000ee              running
 67    instance-000001ae              running
 68    instance-000001b1              running
 69    instance-000000d6              running

# step.3 查看虚机详情 28 虚机id
virsh dominfo 28

Id:             28
Name:           instance-000000ee
UUID:           27bcbe2d-3f1c-4de0-a751-5fee7f7e8553
OS Type:        hvm
State:          running
CPU(s):         16
CPU time:       44073170.4s
Max memory:     33554432 KiB
Used memory:    33554432 KiB
Persistent:     yes
Autostart:      disable
Managed save:   no
Security model: none
Security DOI:   0

# step.3 查看虚机资源使用 28 虚机id
virsh domstats 28
```

## 在容器外安装 virt-top

```bash
# step.1
yum install virt-top -y

# step.2 启动 virt-top
virt-top

virt-top 11:07:39 - x86_64 48/48CPU 2799MHz 257749MB 58.4% 58.4% 58.5% 58.4% 58.5% 58.3% 58.4%
11 domains, 4 active, 4 running, 0 sleeping, 0 paused, 7 inactive D:0 O:0 X:0
CPU: 58.5%  Mem: 73728 MB (73728 MB by guests)

   ID S RDRQ WRRQ RXBY TXBY %CPU %MEM    TIME   NAME                                                                                                              
   28 R    0    3  12K 8038 33.4 12.0 513d00:41 instance-000000ee
   67 R    0    0  32K  48K 16.7  6.0 491:27:55 instance-000001ae
   69 R    0   76    0    0  8.4  3.0 209:14:46 instance-000000d6
   68 R    0    0    0    0  0.0  6.0 157:41:54 instance-000001b1

```

## virsh 命令

```bash
# 虚机列表 ----------------------------------------------------
virsh list

 Id    名称                         状态
----------------------------------------------------
 28    instance-000000ee              running
 69    instance-000000d6              running
 73    instance-000001b7              running
 76    instance-000001bd              running
 77    instance-000001ba              running
 80    instance-000001b4              running

# 域信息 ----------------------------------------------------
virsh dominfo 28

Id:             28
名称：       instance-000000ee
UUID:           27bcbe2d-3f1c-4de0-a751-5fee7f7e8553
OS 类型：    hvm
状态：       running
CPU：          16
CPU 时间：   52228467.0s
最大内存： 33554432 KiB
使用的内存： 33554432 KiB
持久：       是
自动启动： 禁用
管理的保存： 否
安全性模式： none
安全性 DOI： 0

# 域 vcpu 计数 ----------------------------------------------------
virsh vcpucount 28

# 详细的域 vcpu 信息 ----------------------------------------------------
virsh vcpuinfo 28

# 域状态 ----------------------------------------------------
virsh domstate 28 --reason

running (已引导)

# 列出域的统计时间 ----------------------------------------------------
virsh domstats 28

Domain: 'instance-000000ee'
  state.state=1
  state.reason=1
  cpu.time=52504552418705584
  cpu.user=6406610000000
  cpu.system=1167761870000000
  balloon.current=33554432
  balloon.maximum=33554432
  balloon.swap_in=0
  balloon.swap_out=0
  balloon.major_fault=5962
  balloon.minor_fault=20114340564
  balloon.unused=19014624
  balloon.available=32778184
  balloon.usable=23161172
  balloon.last-update=1703555715
  balloon.rss=32547456
  vcpu.current=16
  vcpu.maximum=16
  vcpu.0.state=1
  vcpu.0.time=3232119990000000
  vcpu.0.wait=0
  vcpu.1.state=1
  vcpu.1.time=3293771200000000
  vcpu.1.wait=0
  vcpu.2.state=1
  vcpu.2.time=3278008150000000
  vcpu.2.wait=0
  vcpu.3.state=1
  vcpu.3.time=3263658960000000
  vcpu.3.wait=0
  vcpu.4.state=1
  vcpu.4.time=3500166820000000
  vcpu.4.wait=0
  vcpu.5.state=1
  vcpu.5.time=3252304890000000
  vcpu.5.wait=0
  vcpu.6.state=1
  vcpu.6.time=3247763790000000
  vcpu.6.wait=0
  vcpu.7.state=1
  vcpu.7.time=3244455030000000
  vcpu.7.wait=0
  vcpu.8.state=1
  vcpu.8.time=3242926590000000
  vcpu.8.wait=0
  vcpu.9.state=1
  vcpu.9.time=3240341430000000
  vcpu.9.wait=0
  vcpu.10.state=1
  vcpu.10.time=3240201900000000
  vcpu.10.wait=0
  vcpu.11.state=1
  vcpu.11.time=3238765480000000
  vcpu.11.wait=0
  vcpu.12.state=1
  vcpu.12.time=3237512270000000
  vcpu.12.wait=0
  vcpu.13.state=1
  vcpu.13.time=3236968380000000
  vcpu.13.wait=0
  vcpu.14.state=1
  vcpu.14.time=3236084260000000
  vcpu.14.wait=0
  vcpu.15.state=1
  vcpu.15.time=3236273290000000
  vcpu.15.wait=0
  net.count=1
  net.0.name=tap256efb14-ad
  net.0.rx.bytes=945777256706
  net.0.rx.pkts=3406495058
  net.0.rx.errs=0
  net.0.rx.drop=0
  net.0.tx.bytes=912455379041
  net.0.tx.pkts=6601093454
  net.0.tx.errs=0
  net.0.tx.drop=0
  block.count=1
  block.0.name=vda
  block.0.rd.reqs=5355351
  block.0.rd.bytes=217238636544
  block.0.rd.times=29233985318577
  block.0.wr.reqs=15710720
  block.0.wr.bytes=924862565888
  block.0.wr.times=11025844354065885
  block.0.fl.reqs=4331573
  block.0.fl.times=86345312150799
  block.0.allocation=171798671360
  block.0.capacity=171798691840
  block.0.physical=171798691840

# 获得域设备块状态 ----------------------------------------------------
virsh domblklist 28

目标     源
------------------------------------------------
vda        volumes/volume-1098292c-d744-4990-94fb-51c0cff07c66

# 获得域设备块状态 ----------------------------------------------------
virsh domblkstat 28 --human

Device: 
 读取操作数：              5355351
 读取字节数：              217238636544
 写入操作数：              15709870
 写入字节数：              924856935936
 flush 操作数：              4331302
 读取总计消耗时间 (ns)： 29233985318577
 写入总计消耗时间 (ns)： 11025841781525527
 Flush 总计消耗时间 (ns)： 86345233508040

 rd_req 5355351
 rd_bytes 217238636544
 wr_req 15730331
 wr_bytes 924996151296
 flush_operations 4337712
 rd_total_times 29233985318577
 wr_total_times 11025908677851915
 flush_total_times 86347134438085

# 列出域的所有虚拟接口 ----------------------------------------------------
virsh domiflist  28

接口     类型     源        型号      MAC
-------------------------------------------------------
tap256efb14-ad bridge     qbr256efb14-ad virtio      fa:16:3e:a5:91:e7

# 获得域网络接口状态 ----------------------------------------------------
virsh domifstat --domain 28 --interface tap256efb14-ad

tap256efb14-ad rx_bytes 945775078367
tap256efb14-ad rx_packets 3406480683
tap256efb14-ad rx_errs 0
tap256efb14-ad rx_drop 0
tap256efb14-ad tx_bytes 912451533438
tap256efb14-ad tx_packets 6601053005
tap256efb14-ad tx_errs 0
tap256efb14-ad tx_drop 0

# 获取域的内存统计 ----------------------------------------------------
virsh dommemstat 28

actual 33554432
swap_in 0
swap_out 0
major_fault 5962
minor_fault 20114013079
unused 19013256
available 32778184
usable 23159700
last_update 1703555354
rss 32548136

```

## 参考资料

[https://libvirt-python.readthedocs.io/monitoring-performance/#io-statistics](https://libvirt-python.readthedocs.io/monitoring-performance/#io-statistics)

## Golang 调用 libvirt
[https://pkg.go.dev/libvirt.org/go/libvirt#section-readme](https://pkg.go.dev/libvirt.org/go/libvirt#section-readme)

```bash
# step.1
yum install libvirt libvirt-devel pkgconfig -y

# step.2 安装 golang
```
Go 示例代码
```go
package main

import (
    "fmt"
    "libvirt.org/go/libvirt"
)

func main() {
    conn, err := libvirt.NewConnect("qemu:///system")

    if err != nil {
        panic(err)
    }
    defer conn.Close()

    doms, err := conn.ListAllDomains(libvirt.CONNECT_LIST_DOMAINS_ACTIVE)
    if err != nil {
        panic(err)
    }

    fmt.Printf("%d running domains:\n", len(doms))
    for _, dom := range doms {
        name, err := dom.GetName()
        if err == nil {
            fmt.Printf("  %s\n", name)
        }
        dom.Free()
    }
}
```
