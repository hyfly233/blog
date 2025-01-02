---
title: 动态分区和RoutineLoad
sidebar: heading
---

## 建表语句
添加 create_history_partition、history_partition_num 属性，将会创建历史分区

```sql
// 建表
CREATE TABLE testdb.test_table_1
(
    begin_time DATETIME ,
    k1 TINYINT,
    k2 DECIMAL(10, 2) DEFAULT "10.5",
    k3 VARCHAR(10) COMMENT "string column",
    k4 INT NOT NULL DEFAULT "1" COMMENT "int column"
)
DUPLICATE KEY( begin_time, k1, k2 )
PARTITION BY RANGE( begin_time ) ()
DISTRIBUTED BY HASH( begin_time ) BUCKETS 3
PROPERTIES (
    "replication_num" = "3",
    "dynamic_partition.enable" = "true",
    "dynamic_partition.time_unit" = "DAY",
    "dynamic_partition.create_history_partition" = "true",
    "dynamic_partition.history_partition_num" = 7,
    "dynamic_partition.start" = "-7",
    "dynamic_partition.end" = "3",
    "dynamic_partition.prefix" = "p",
    "dynamic_partition.buckets" = "10"
);
```

## 查看分区情况
```bash
./mysql -uroot -P9030 -h127.0.0.1

SHOW PARTITIONS FROM testdb.test_table_1;
```

## 建立Routine Load
```sql
// Routine Load
CREATE ROUTINE LOAD testdb.test_table_1_routine_load ON testdb.test_table_1
COLUMNS(begin_time, k1, k2, k3, k4)
PROPERTIES(
    "desired_concurrent_number"="3",
    "format"="json",
    "strict_mode" = "false"
)
FROM KAFKA(
    "kafka_broker_list" = "127.0.0.1:9092",
    "kafka_topic" = "doris-test-table-1",
    "property.group.id" = "b-doris-test-table-1",
    "property.kafka_default_offsets" = "OFFSET_BEGINNING"
);
```
