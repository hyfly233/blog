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
[https://blog.csdn.net/xiweiller/article/details/126030209](https://blog.csdn.net/xiweiller/article/details/126030209)
[https://seatunnel.apache.org/docs/2.3.4/connector-v2/source/Postgre-CDC/](https://seatunnel.apache.org/docs/2.3.4/connector-v2/source/Postgre-CDC/)



### SeaTunnel
192.168.0.17
./bin/seatunnel.sh --config ./jobs/zabbixmysql2kafka-latest.conf -e local
/data/app/apache-seatunnel-2.3.4-release


MySQL CDC 到 kafka
```bash
env {
  execution.parallelism = 1
  job.mode = "STREAMING"
  checkpoint.interval = 10000
}

source {
  MySQL-CDC {
    result_table_name = "zabbix_history"
  	hostname = "192.168.0.1"
    username = "root"
    password = "biitt@123"
    parallelism = 1
  	server-id = 100
  	server-time-zone = "Asia/Hong_Kong"
  	database-names = ["zabbix "]
  	table-names = ["zabbix.history"]
  	base-url = "jdbc:mysql://192.168.0.1:13306/zabbix"
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
    source_table_name = "zabbix_history"
    topic = "zabbix_mysql_cdc2vm"
    bootstrap.servers = "192.168.0.211:9092"
  }
}
```
MySQL 查询数据到 Console
```bash
env {
  execution.parallelism = 1
  job.mode = "STREAMING"
  checkpoint.interval=10000
}

source {
  Jdbc {
    url = "jdbc:mysql://192.168.0.1:13306/zabbix?useUnicode=true&characterEncoding=UTF-8&rewriteBatchedStatements=true"
    driver = "com.mysql.cj.jdbc.Driver"
    connection_check_timeout_sec = 100
    user = "root"
    password = "biitt@123"
    query = "select h.hostid , h.name , i2.ip , i2.dns , i.itemid, i.name , i.key_ as item_key from items i ,hosts h ,interface i2 WHERE i2.`type` = 1 and i2.ip is not NULL and h.available = 1 and i.hostid = h.hostid and h.hostid = i2.hostid"
  }
}

sink {
  Console {}
}
```
```bash
# select h.hostid , h.name , i2.ip , i2.dns , i.itemid, i.name , i.key_ as item_key from items i ,hosts h ,interface i2 WHERE i2.`type` = 1 and i2.ip is not NULL and h.available = 1 and i.hostid = h.hostid and h.hostid = i2.hostid;
```
命令行
```bash
./bin/seatunnel.sh --config ./jobs/zabbixmysql2kafka.conf -e local

./bin/seatunnel.sh --config ./jobs/zabbixmysql2console.conf -e local
```
```bash
nohup ./bin/seatunnel.sh --config ./jobs/zabbixmysql2kafka.conf 2>&1 &
```



```bash
wget "https://archive.apache.org/dist/seatunnel/2.3.4/apache-seatunnel-2.3.4-bin.tar.gz"
```

```bash
docker run \
  -e config="/data/seatunnel.streaming.conf" \
  -v /data/apache-seatunnel-2.3.4/config/v2.streaming.conf.template:/data/seatunnel.streaming.conf  \
  -d hyfly233/seatunnel:2.3.4
```

