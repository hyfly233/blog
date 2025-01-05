---
title: SeaTunnel数据库CDC配置
sidebar: heading
---

# SeaTunnel数据库CDC配置

## MySql

需要开启 binlog，修改数据库 /etc/my.cnf

```yaml
server_id=100
log-bin=mysql-bin
binlog-format=ROW
```

在数据库中执行以下命令检查

```sql
show variables like '%binlog_format%';
show variables like '%binlog_row_image%';
```

[https://developer.aliyun.com/article/869534](https://developer.aliyun.com/article/869534)
从该文章描述得到的结论

- 基于查询和binlog的方案都有一定的劣势，在全量数据下，一致性方面都会有所欠缺
- FlinkCDC 基于Snapshot+binlog的方案结合了两者的特点，可以保证同步数据的一致性
   - 原生的基于锁的全量数据获取具有一定的性能问题
   - 基于DBLog的无锁方案在性能和一致性上可以兼得。是比较理想的方案

## pg

### 参考资料

[https://blog.csdn.net/xiweiller/article/details/126030209](https://blog.csdn.net/xiweiller/article/details/126030209)
[https://seatunnel.apache.org/docs/2.3.4/connector-v2/source/Postgre-CDC/](https://seatunnel.apache.org/docs/2.3.4/connector-v2/source/Postgre-CDC/)

## SeaTunnel CDC

### MySQL CDC 到 kafka

```bash
env {
  execution.parallelism = 1
  job.mode = "STREAMING"
  checkpoint.interval = 10000
}

source {
  MySQL-CDC {
    result_table_name = "test"
  	hostname = "192.168.0.1"
    username = "root"
    password = "biitt@123"
    parallelism = 1
  	server-id = 100
  	server-time-zone = "Asia/Hong_Kong"
  	database-names = ["test "]
  	table-names = ["test"]
  	base-url = "jdbc:mysql://192.168.0.1:3306/test"
    debezium {
      snapshot.mode = "always"
      decimal.handling.mode = "double"
    }
  }
}
 
sink {
  kafka {
    format = JSON
    semantics = NON
    source_table_name = "test"
    topic = "test"
    bootstrap.servers = "192.168.0.1:9092"
  }
}
```
