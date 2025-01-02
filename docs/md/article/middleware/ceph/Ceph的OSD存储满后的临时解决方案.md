---
title: Ceph的OSD存储满后的临时解决方案
sidebar: heading
---

# Ceph的OSD存储满后的临时解决方案

## 问题描述
硬盘容量不足，导致Ceph功能异常

## 查看 ceph 健康状况

```bash
# 查看健康状况
ceph health detail

# 输出内容
HEALTH_ERR 1 full osd(s); 10 pool(s) full; 
Degraded data redundancy: 2220/890481 objects degraded (0.249%), 8 pgs degraded, 8 pgs undersized; 
Full OSDs blocking recovery: 8 pgs recovery_toofull; 
1 pools have too many placement groups;

mons are allowing insecure global_id reclaim
OSD_FULL 1 full osd(s)
    osd.3 is full
POOL_FULL 10 pool(s) full
    pool 'cephfs_data' is full (no space)
    pool 'cephfs_metadata' is full (no space)
    pool '.rgw.root' is full (no space)
    pool 'default.rgw.control' is full (no space)
    pool 'default.rgw.meta' is full (no space)
    pool 'default.rgw.log' is full (no space)
    pool 'images' is full (no space)
    pool 'instances' is full (no space)
    pool 'volumes' is full (no space)
    pool 'backups' is full (no space)
```

## 查找 volumes 池中的虚拟硬盘

```bash
rbd ls volumes
```

## 查看虚拟硬盘的详情

```bash
rbd info volumes/volume-b2056888-245d-4890-85ed-bf187cb1fa4e

rbd image 'volume-b2056888-245d-4890-85ed-bf187cb1fa4e':
	size 160 GiB in 40960 objects
	order 22 (4 MiB objects)
	snapshot_count: 0
	id: 73823d21437986
	block_name_prefix: rbd_data.73823d21437986
	format: 2
	features: layering, exclusive-lock, object-map, fast-diff, deep-flatten
	op_features: 
	flags: 
	create_timestamp: Tue Sep  5 14:22:02 2023
	access_timestamp: Tue Sep  5 17:07:24 2023
	modify_timestamp: Tue Sep  5 17:07:31 2023
```

## Ceph 磁盘满了导致虚机无法操作
获取到 OpenStack Cinder 卷与 ceph object 的对应关系

```shell
docker exec -it cinder_volume /bin/sh
```

[https://access.redhat.com/documentation/en-us/red_hat_ceph_storage/5/html/troubleshooting_guide/troubleshooting-ceph-osds#deleting-data-from-a-full-storage-cluster_diag](https://access.redhat.com/documentation/en-us/red_hat_ceph_storage/5/html/troubleshooting_guide/troubleshooting-ceph-osds#deleting-data-from-a-full-storage-cluster_diag)

## 修改 OSD 存储满的比例
临时解决方案，修改 OSD 存储满的比例，Ceph 服务正常后应该扩充存储来解决问题

```shell
docker exec -it ceph-osd /bin/sh

# 
ceph osd dump | grep -i full

# 
ceph osd set-full-ratio 0.97
```

