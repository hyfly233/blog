## SeaTunnel
SeaTunnel job 应该更换为集群启动，本地模式只适用于测试，部分功能是不适用的。

- [https://seatunnel.apache.org/docs/2.3.4/seatunnel-engine/savepoint](https://seatunnel.apache.org/docs/2.3.4/seatunnel-engine/savepoint)
- [https://seatunnel.apache.org/docs/seatunnel-engine/checkpoint-storage/](https://seatunnel.apache.org/docs/seatunnel-engine/checkpoint-storage/)
### 正确步骤
```bash
# 1.打开 seatunnel cluster
nohup sh ./bin/seatunnel-cluster.sh 2>&1 &

# 2.初始启动 job
sh ./bin/seatunnel.sh \
  --config ./jobs/zabbixmysql2kafka-initial.conf \
  --name zabbixmysql2kafka_initial

nohup sh ./bin/seatunnel.sh \
  --config ./jobs/zabbixmysql2kafka-initial.conf \
  --name zabbixmysql2kafka_initial \
  2>&1 &

# 3.查询 zabbixmysql2kafka_initial 对应的 jobId 如：123456
./bin/seatunnel.sh --list

# 4.查看 checkpoint_snapshot
ll /tmp/seatunnel/checkpoint_snapshot

# 5.检查是否存在 123456 的文件夹，并检查是否包含 *.ser 文件
ll /tmp/seatunnel/checkpoint_snapshot/123456

# 6.可选，触发 savepoint 可停止任务
./bin/seatunnel.sh \
  --savepoint 123456

# 7.重启 jobId 为 123456 的任务
sh ./bin/seatunnel.sh \
  --config ./jobs/zabbixmysql2kafka-initial.conf \
  --name zabbixmysql2kafka_initial \
  --restore 123456

nohup sh ./bin/seatunnel.sh \
  --config ./jobs/zabbixmysql2kafka-initial.conf \
  --name zabbixmysql2kafka_initial \
  --restore 123456 \
  2>&1 &
```

```bash



```

SeaTunnel 端发送数据重复是：原先使用本地模式，并且重启任务也一直使用的上述的步骤一，导致每次都是启动的一个新的 job


## VM 的配置
[https://docs.victoriametrics.com/#deduplication](https://docs.victoriametrics.com/#deduplication)
VM 的启动命令行参数 "-dedup.minScrapeInterval=1ms" 可以解决在存储时数据重复的问题。该值为正值时，VM 会保留在该时间间隔中的最大值
### 问题点
VM 的配置只能从存储层解决数据重复的问题，SeaTunnel 端发送重复数据是 VM 管不了的



```bash

sh ./bin/seatunnel.sh \
  --config ./jobs/zabbixmysql2kafka-latest.conf \
  --restore 666666
```
