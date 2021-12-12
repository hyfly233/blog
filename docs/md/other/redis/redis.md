---
title: Redis
---

# 应用场景

+ 缓存系统
+ 计数器
+ 消息队列
+ 排行榜
+ 社交网络
+ 实时系统

# 安装及启动

## 安装

+ ` wget http://download.redis.io/releases/redis-3.0.7.tar.gz `
+ `tar -xzf redis-3.0.7.tar.gz`
+ `ln -s redis-3.0.7 redis` （软连接）
+ `cd redis`
+ `make && make install`

## 可执行文件说明

+ redis-server：Redis 服务器
+ redis-cli：Redis 命令行客户端
+ redis-benchmark：基准测试工具
+ redis-check-aof：AOF 文件修复工具
+ redis-check-dump：RDB 文件修复工具
+ redis-sentinel：Sentinel 服务器

## 启动方式

+ 最简启动

  `redis-server`

  验证：` ps -ef | grep redis `、` netstat -antpl | grep redis`、`redis-cli -h ip -p port ping`

+ 配置文件启动

  `redis-server --port 6380`

+ 动态参数启动

  `redis-server configPath`

## 常用启动配置

+ daemonize：是否是守护进程（no | yes）
+ port：对外端口
+ logfile：日志
+ dir：工作目录

# 数据结构和内部编码

## 数据结构

string、hash、list、set、zset

## 内部编码

+ string：raw、int、embstr
+ hash：hashtable、ziplist
+ list：linkedlist、ziplist
+ set：hashtable、intset
+ zset：skiplist、ziplist

# API

## 通用命令

### keys

`keys *`：遍历出所有 key

`keys [pattern]`

阻塞，时间复杂度 O(n)；建议在从节点中使用，或更换为 scan 命令

### dbsize

计算 key 总数，redis 有单独的计数器统计 key 的数量

时间复杂度 O(1)

### exists key

检查 key 是否存在

时间复杂度 O(1)

### del key [key ...]

删除一个或多个 key-value

时间复杂度 O(1)

### expire、ttl、persist

+ expire key seconds：key 在 seconds 秒后过期
+ ttl key：key 还有多少秒过期
+ persist key：去掉 key 的过去时间

时间复杂度 O(1)

### type key

key 的 value 的类型

时间复杂度 O(1)



## 字符串

### Value 的类型

string，int，二进制，值上限 512MB

### 使用场景

缓存（基础信息）、计数器（视频访问量）、分布式锁

### 命令

#### get

get key，O(1)

#### mget

mget key1 key2 key3 ....，获取多个，O(1)

#### set

set key value，不管 key 是否存在，都 set，O(1)

#### setnx

setnx key value，key 不存在，O(1)

#### setxx

setxx key value，key 存在，O(1)

#### mset

mset key1 value1 key2 valu2 key3 valu3 ....，设置多个，O(n)

#### getset

getset key newValue，设置新值返回旧值，O(n)

#### getrange

getrange key start end，获取字符串指定下标的所有值，O(1)

#### setrange

setrange key start end，设置字符串指定下标的所有值，O(1)

#### append

append key value，追加到旧值后，O(1)

#### strlen

strlen key，返回字符串长度（中文是两个字节），O(1)

#### del

del key，O(1)

#### incr

incr key，key 自增 1，key 不存在时，自增后为 1，O(1)，单线程，无竞争

#### decr

decr key，key 自减 1，key 不存在时，自减后为 -1，O(1)，单线程，无竞争

#### incrby

incrby key k，key 自增 k，key 不存在时，自增后为 k，O(1)，单线程，无竞争

#### decrby

decrby key k，key 自减 k，key 不存在时，自减后为 -k，O(1)，单线程，无竞争

#### incrbyfloat

incrbyfloat key float，增加对应浮点数，O(1）



## 哈希

### Value 的类型

key 对应`field -> value 的键值对值`，每个 field 不能相同，value 可以相同，无法设置过期时间

### 命令

#### hget

hget key field，获取 hash key 对应的 field 的 value，O(1)

#### hset

hset key field value，设置 hash key 对应的 field 的 value，O(1)

#### hsetnx

#### hdel

hdel key field，删除 hash key 对应的 field 的 value，O(1)

#### hexists

hexists key field，判断 hash key 是否有 field，O(1)

#### hlen

hlen key，获取 hash key field 的数量，O(1)

#### hmget

hmget key field1 field2 ....，获取 hash key 的一批 field 对应的值，O(n)

#### hmset

hmget key field1 value1 field2 value2 ....，设置 hash key 的一批 field value，O(n)

#### hincrby

incrby key field k，key field 自增 k，O(1)，单线程，无竞争

#### hincrbyfloat

#### hgetall

hgetall key，返回 hash key 对应所有的 field 和 value，O(n)

#### hvals

hvals key，返回 key 所有的 filed 的 value

#### hkeys

hkeys key，返回 key 所有的 filed

## 列表

有序、可重复、左右都可插入弹出

### 命令

#### rpush、lpush

rpush(lpush) key val1 val2 val3，从列表右（左）端插入值，O(1~n)

#### linsert

linsert key before|after val newVal、在 list 指定的值前|后插入 newVal，O(n)

#### lpop、rpop

lpop(rpop) key、从左（右）删除key、O(1)

#### lrem

lrem key n val、根据 n 值，从列表中删除所有 val 相等的项，O(1)

+ n > 0：从左到右，删除最多 n 个 val 相等的项
+ n < 0：从右到左，删除最多 -n 个 val 相等的项
+ n = 0：删除所有 val 相等的项

#### ltrim

ltrim key start end、按索引范围修建列表，O(1)

#### lrange

lrange key start end、获取列表指定索引范围所有 item，O(n)

#### lset

lset key index newVal、设置列表指定索引的值为 newVal，O(n)

#### blpop、brpop

blpop(brpop) key timeout、lpop 阻塞版，阻塞 timeout 时间，timeout = 0 永不阻塞，O(1)

### Tips

+ lrpush + lpop = Stack
+ lpush + rpop = Queue
+ lpush + ltrim = Capped Collection
+ lpush + brpop = Message Queue

## Set

### 单个set命令

#### sadd、srem

sadd（srem）key vals、向集合 key 添加（删除）vals，（vals 已存在添加失败），O(1)

#### scard、sismember、srandmember、smembers

scard key、计算集合大小

sismember key val、判断 val 是否在集合中

srandmember key n、随机获取 n 个元素

smembers key、获取所有元素、无序的

#### spop

spop key、随机弹出一个元素

### set间命令

#### sdiff、sinter、sunion

差、交、并集

sdiff key1 key2、差集

sinter key1 key2、交集

sunion key1 key2、并集

sdiff | sinter | sunion + store key、将差集、交集、并集结果保持到 key 中



## zset

key val 结构、val 由 score 和 value 组成、通过 score 来排序

#### zadd

zadd key score vals、添加 score 和 vals、O(logN)

#### zrem

zrem key vals、删除单个或多个元素

#### zscore

zscore key val、返回元素的分数、O(1)

#### zincrby

zincrby key increScore val、增加或减少元素的分数、O(1)

#### zcard

zcard key、返回元素的个数、O(1)

#### zrange、zrangebyscore

zrange(zrangebyscore) key start end [withscores]、返回指定索引（分数）范围内的升序元素[分值]、O(logN + m)

#### zcount

zcount key minScore maxScore、返回有序集合内在指定分数范围内的个数、O(logN + m)

#### zremrangebyrank、zremrangebyscore

zremrangebyrank key start end、删除指定排名内的升序元素、O(logN + m)

#### zrevrank、zrevrange、zrevrangebyscore、zinterstore、zunionstore



# 慢查询

+ 生命周期

  + 客户端发送命令
  + 命令在 Redis 中排队
  + Redis 执行命令
  + Redis 返回结果

  慢查询发生在第三阶段

  客户端超时不一定慢查询

  

+ 两个配置

  + slowlog-max-len

    1、先进先出队列

    2、固定长度

    3、保存在内存中

  + slowlog-log-slower-than

    1、慢查询阈值（微秒）

    2、slowlog-log-slower-than = 0，记录所有命令

    3、slowlog-log-slower-than < 0，不记录命令

  

+ 三个命令

  1、slowlog get [n]、获取慢查询队列

  2、slowlog len、获取慢查询队列长度

  3、slowlog reset、清空慢查询队列

  

+ 运维经验

  1、slowlog-max-len、不要设置过大，默认 10 ms，通常设置 1ms

  2、slowlog-log-slower-than、不要设置过小，通常 1000

  3、理解命令生命周期

  4、定期持久化慢查询

# pipeline

将多个命令打包发给 Redis 处理、1 次网络请求 + n 次命令

```java
Jedis jedis = new Jedis("127.0.0.1", 6379);

Pipeline pipeline = jedis.pipeline();

for(int i = 0; i < 10000; i++) {
    pipeline.hset("key" + i, "field" + i, "val" + i);
}

pipeline.syncAndReturnAll();
```

+ 注意每次 pipeline 携带数据量，适时拆分成多条命令
+ pipeline 每次只能作用在一个 redis 节点
+ M 操作与 pipeline 区别

# 发布订阅

# bitmap

# hyperloglog

# geo





# 持久化

将数据的更新异步保存在磁盘中，可将磁盘中的数据恢复到内存中

+ 快照：MySQL Dump、Redis RDB
+ 日志：MySQL Binlog、Hbase HLog、Redis AOF

## RDB

### 3 种触发机制

+ save（同步）：

  客户端执行 save 命令，同步生存 RDB 二进制文件，新文件替换老文件，阻塞，O(n)

  

+ bgsave（异步）：

  客户端执行 bgsave 命令，Redis 通过 fork() 生存子进程，子进程生存 RDB 二进制文件后，通知主进程、fork() 函数会阻塞主进程并消耗额外的内存，新文件替换老文件，O(n)

  

+ 自动：

  通过 save 配置设置自动保存，save n m，在 n 秒中 m 次操作就自动保存
  
  + dbfilename dump-${port}.rdb：改名
  + dir ./：文件位置
  + stop-writes-on-bgsave-error yes：bgsave 出错时是否停止写入
  + rdbcompression yes：是否压缩
  + rdbchecksum yes：是否做校验和检测

### 触发机制 - 不容忽视方式

1. 全量复制：主从复制时，主数据库会生存 rdb 文件
2. debug reload：不清空内存的 debug 模式重启
3. shutdown：shutdown save

### RDB 的问题

耗时，耗性能，不可控，数据易丢失



## AOF

根据日志操作，记录数据，可通过 AOF 对 RDB 丢失的数据进行修复

### 3种策略

+ always：每一次操作都记录，不会丢失数据，IO 开销大
+ everysec：每一秒记录一次，可能丢失一秒的数据，
+ no：操作系统决定记录操作，不可控

### AOF重写

去掉无用的命令，减少磁盘占用量，加速恢复速度

+ bgrewriteaof：fork() 出子进程，重写 aof

+ AOF 重写配置：

  + auto-aof-rewrite-min-size：AOF 文件重写需要的尺寸

  + auto-aof-rewrite-percentage：AOF 文件增长率

  + aof_current_size：AOF 当前尺寸

  + aof_base_size：AOF 上次启动和重写的尺寸

  + 触发时机

    aof_current_size > auto-aof-rewrite-min-size

    (aof_current_size - aof_base_size) / aof_base_size > auto-aof-rewrite-percentage

  + appendonly yes

  + appendfilename "appendonly-${port}.aof"

  + appendfsync everysec

  + no-appendfsync-on-rewrite yes

### 阻塞



## 选择

|            | RDB    | AOF          |
| ---------- | ------ | ------------ |
| 启动优先级 | 低     | 高           |
| 体积       | 小     | 大           |
| 恢复速度   | 快     | 慢           |
| 数据安全性 | 丢数据 | 根据策略决定 |
| 轻重       | 重     | 轻           |



### RDB 最佳策略

主从都 "关" 了，集中管理定时备份，从节点开

### AOF 最佳策略

"开" 缓存和存储，AOF 重写集中管理，everysec

# fork



# 主从复制

解决机器故障、容量瓶颈、QPS 瓶颈等问题

+ 一个 master 可有多个 slave
+ 一个 slave 只能有一个 master
+ 数据流向是单向的，master 到 slave

## 配置

+ slaveof 命令：不方便管理

  slaveof 127.0.0.1 6378，清空从节点数据，异步复制

  slaveof no one，取消复制，不会清除原先复制的数据

+ 配置文件：需要重启

  slaveof ip port

  slave-read-only yes：从节点不可写操作

## runid

每个节点的标识

## 偏移量 offset

# 全量复制

pysnc {offset} {runid}

开销巨大

+ bgsave 时间
+ RDB 文件网络传输时间
+ 从节点清空数据时间
+ 从节点加载 RDB 的时间
+ 可能的 AOF 重写时间

# sentinel

多个 Sentinel 进行 Redis 故障判断，故障转移选出一个 slave 作为 master，通知客户端，客户端从 Sentinel 获取 Redis 信息

## 安装和配置

1. 配置开启主从节点
2. 配置开启 sentinel 监控主节点

+ port ${port}
+ dir "/opt/soft/redis/data"
+ logfile "${port}.log"
+ sentinel monitor mymaster 127.0.0.1 7000 2
+ sentinel down-after-milliseconds mymaster 30000
+ sentinel pararllel-syncs mymaster 1
+ sentinel failover-timeout mymaster 180000

## Java

获取所有 sentinel，和主节点，选择一个可用的 sentinel

```java
JedisSentinelPool sentinelPool = new JedisSentinelPool(masterName, sentinelSet, poolConfig, timeout);
Jedis jedis = null;

try {
    jedis = sentinelPool.getResource();
    jedis.set("hello", "world");
} catch (Exception e) {
    
} finally {
    if (jedis != null) {
        jedis.close();
    }
}
```

# Jedis

```java
Jedis jedis = new Jedis("127.0.0.1", 6379);
jedis.set("hello", "world");
jedis.get("hello");
```

` Jedis(String host, int port, int connectionTimeout, int soTimeout) `

+ host：Redis节点的所在机器的IP 
+ port：Redis节点的端口 
+ connectionTimeout：客户端连接超时
+ soTimeout：客户端读写超时 



## 字符串

+ jedis.set(key，value)
+ jedis.get(key)
+ jedis.incr(key)

## hash

+ jedis.hset(key，vkey，val)
+ jedis.hgetAll(key)

## list

+ jedis.rpush(key，value)
+ jedis.lrange(key，start，end)

## set

+ jedis.sadd(key，val)
+ jedis.smembers(key)

## zset

+ jedis.zadd(key，score，val)
+ jedis.zrangeWithScores(key，start，end)

## Jedis 连接池

### Jedis 直连

1. 生成 Jedis 对象
2. Jedis 执行命令
3. 返回执行结果
4. 关闭 Jedis 连接



### JedisPool

1. 从资源池借用 Jedis 对象
2. Jedis 执行命令
3. 返回执行结果
4. 归还 Jedis 对象给连接池

```java
// 初始化 Jedis 连接池
GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
JedisPool jedisPool = new JedisPool(poolConfig, "127.0.0.1", 6379);

Jedis jedis = null;

try {
    // 从连接池中获取 jedis 对象
    jedis = jedisPool.getResource();
    jedis.set("hello", "world");
} catch (Exception e) {
    
} finally {
    if (jedis != null) {
        // 使用 JedisPool 时，close() 方法表示归还连接池
        jedis.close();
    }
}
```



## 配置

### 1、资源数控制

+ maxTotal：最大连接数，默认 8，建议 命令平均执行时间 * 业务量
+ maxIdle：最大空闲数，默认 8，建议 maxIdle = maxTotal
+ minIdle：最小空闲数，默认 0
+ jmxEnabled：是否开启 jmx 监控，默认 true

### 2、借还

+  blockWhenExhausted：当资源池用尽后，调用者是否要等待。只有当为true时，maxWaitMillis 才会生效，默认 true，建议默认
+  maxWaitMillis：当资源池连接用尽后，调用者的最大等待时间（毫秒），默认 -1 永不超时
+  testOnBorrow：向资源池借用连接时是否做连接有效性检测（ping），无效连接会被移除，默认 false，建议 false
+  testOnReturn： 向资源池归还连接时是否做连接有效性检测（ping），无效连接会被移除，默认 false，建议 false



## 常见问题

```java
java.util.NoSuchElementException:Timeout waiting for idle object

java.util.NoSuchElementException:Pool exhausted
```

### 解决思路

1. 慢查询阻塞：池子连接被阻塞
2. 资源池参数不合理：QPS高、池子小
3. 连接泄露（没有 close）：client list、netstat 查连接情况
4. DNS 异常

## Java 客户端优化

1. 避免多个应用使用一个 Redis 实例，不相干的业务拆分，公共数据做服务化（微服务）
2. 使用连接池





