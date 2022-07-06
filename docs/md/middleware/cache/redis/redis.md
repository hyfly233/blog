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



# RedisTemplate



```java
@Bean
public RedisTemplate redisTemplate(){
    return new RedisTemplate();
}
```









# 面试

## redis的应用场景

```
1，5大value类型
2，基本上就是缓存~！
3，为的是服务无状态，延申思考，看你的项目有哪些数据结构或对象，在单机里需要单机锁，在多机需要分布式锁，抽出来放入redis中；
4，无锁化
```

## redis是单线程还是多线程

```
1，无论什么版本，工作线程就是一个
2，6.x高版本出现了IO多线程
3，单线程，满足redis的串行原子，只不过IO多线程后，把输入/输出放到更多的线程里去并行，好处如下：1，执行时间缩短，更快；2，更好的压榨系统及硬件的资源(网卡能够高效的使用)；
*，客户端被读取的顺序不能被保障
```



## 缓存穿透

缓存穿透：数据库和reids中没有该数据，然后查了redis再查数据库，没有查出数据。

所以应该让有效地请求到达数据库，即便放大前置环节的复杂度和成本

+ redis 中放 null key （可能浪费空间）
+ 布隆过滤器（` [布隆过滤器-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/773205) `）

请求的时候加锁



## 缓存击穿

缓存击穿：热点key过期（没有被缓存的），但数据库中有，大量并发查询该 key，就绕过redis，直接去数据库查

+ 请求的时候加锁，因为查询的key是同一个，所以必须由一个redis提供锁，锁必须是唯一的

  

步骤：

1. 请求 redis，肯定没有

2. 大家抢锁，O（只有发生redis取不到的情况）

   2.1. 抢上的查数据库，O(1)

   2.2. 没抢上的 sleep（sleep线程不会占用cpu）

3. 数据库查询，更新redis，O(1)

4. sleep的回到第一步



## 缓存雪崩

缓存雪崩，缓存击穿 * N

解决方案同上

请求的时候加锁，需要AKF分治，因为查询的key是多个，相互之间不影响，不同的key可以在不同的redis中



## Redis是怎么删除过期key的、缓存如何回收的？

```
1，后台在轮询，分段分批的删除哪些过期的key
2，请求的时候判断时候已经过期了
尽量的把内存无用空间回收回来~！
```



## 缓存是如何淘汰的

```
0，内存空间不足的情况下：
1，淘汰机制里有不允许淘汰
2，lru/lfu/random/TTL
3，全空间
4，设置过过期的key的集合中
```

9. 如何进行缓存预热？

   ```
   1，提前把数据塞入redis，(你知道那些是热数据吗？肯定不知道，会造成上线很多数据没有缓存命中)
   2，开发逻辑上也要规避差集(你没缓存的)，会造成击穿，穿透，雪崩，实施456中的锁方案
   3，一劳永逸，未来也不怕了
   *，结合4，5，6点去看，看图理解
   ```

10. 数据库与缓存不一致如何解决？

    ```
    1，恶心点的，我们可以使用分布式事务来解决，（意义不大），顶多读多，写稀有情况下
    结合图去思考
    1，redis是缓存，更倾向于稍微的有时差
    2，还是减少DB的操作
    3. 完全异步化，使用 MQ
    4，真的要落地，就使用 canal binlog
    ```

11. 简述一下主从不一致的问题？

    ```
    1，redis的确默认是弱一致性，异步的同步
    2，锁不能用主从、(可用单实例/分片集群/redlock)==>redisson
    3，在配置中提供了必须有多少个Client连接能同步，你可以配置同步因子，趋向于强制一性
    4，命令 wait 2 0  小心
    5，34点就有点违背redis的初衷了
    ```

12. 描述一下redis持久化原理？

    ```
    当前线程阻塞服务 不聊
    异步后台进程完成持久
    fork  +  cow
    ```

13. Redis有哪些持久化方式？

    ```
    1，RDB，AOF；主从同步也算持久化；
    2，高版本：开启AOF，AOF是可以通过执行日志得到全部内存数据的方式，但是追求性能：
    2.1，体积变大，重复无效指令  重写，后台用线程把内存的kv生成指令写个新的aof
    2.2，4.x 新增更有性能模式：把重写方式换成直接RDB放到aof文件的头部，比2.1的方法快了，再追加日志
    ```

14. Redis也打不住了，万级流量会打到DB上，该怎么处理？

    ```
    见456
    ```

15. redis中的事务三条指令式什么，第三条指令到达后执行失败了，怎么处理

    ```
    见图， 事务失败就失败，不处理，其他的指令继续执行
    ```

16. redis实现分布式锁的指令

17. 为什么使用setnx？

    ```
    1，好东西，原子（不存在的情况下完成创建）
    2，如果要做分布式锁，就要用set k v nx ex  (不存在，过期时间，避免死锁)
    ```

18. 分布式锁实现，理论：



# 缓存基础

## 缓存雪崩

缓存雪崩是由于原有缓存失效(过期)，新缓存未到期间。所有请求都去查询数据库，而对数据库CPU和内存造成巨大压力，严重的会造成数据库宕机。从而形成一系列连锁反应，造成整个系统崩溃。

解决方法：

1. 一般并发量不是特别多的时候，使用最多的解决方案是加锁排队。
2. 给每一个缓存数据增加相应的缓存标记，记录缓存的是否失效，如果缓存标记失效，则更新数据缓存。
   - 缓存标记：记录缓存数据是否过期，如果过期会触发通知另外的线程在后台去更新实际key的缓存。
   - 缓存数据：它的过期时间比缓存标记的时间延长1倍，例：标记缓存时间30分钟，数据缓存设置为60分钟。 这样，当缓存标记key过期后，实际缓存还能把旧数据返回给调用端，直到另外的线程在后台更新完成后，才会返回新缓存。

加锁排队方案伪代码：

```
//伪代码public object GetProductListNew() {    int cacheTime = 30;    String cacheKey = "product_list";    String lockKey = cacheKey;    String cacheValue = CacheHelper.get(cacheKey);    if (cacheValue != null) {        return cacheValue;    } else {        synchronized(lockKey) {            cacheValue = CacheHelper.get(cacheKey);            if (cacheValue != null) {                return cacheValue;            } else {                //这里一般是sql查询数据                cacheValue = GetProductListFromDB();                CacheHelper.Add(cacheKey, cacheValue, cacheTime);            }        }        return cacheValue;    }}
```

缓存标记方案伪代码：

```
//伪代码public object GetProductListNew() {    int cacheTime = 30;    String cacheKey = "product_list";    //缓存标记    String cacheSign = cacheKey + "_sign";    String sign = CacheHelper.Get(cacheSign);    //获取缓存值    String cacheValue = CacheHelper.Get(cacheKey);    if (sign != null) {        return cacheValue; //未过期，直接返回    } else {        CacheHelper.Add(cacheSign, "1", cacheTime);        ThreadPool.QueueUserWorkItem((arg) -> {            //这里一般是 sql查询数据            cacheValue = GetProductListFromDB();            //日期设缓存时间的2倍，用于脏读            CacheHelper.Add(cacheKey, cacheValue, cacheTime * 2);        });        return cacheValue;    }}
```

## 缓存穿透

缓存穿透是指用户查询数据，在数据库没有，自然在缓存中也不会有。这样就导致用户查询的时候，在缓存中找不到，每次都要去数据库再查询一遍，然后返回空（相当于进行了两次无用的查询）。这样请求就绕过缓存直接查数据库，这也是经常提的缓存命中率问题。

解决方案：

1. 布隆过滤器，将所有可能存在的数据哈希到一个足够大的bitmap中，一个一定不存在的数据会被这个bitmap拦截掉，从而避免了对底层存储系统的查询压力。
2. 如果一个查询返回的数据为空（不管是数据不存在，还是系统故障），我们仍然把这个空结果进行缓存，但它的过期时间会很短，最长不超过五分钟。通过这个直接设置的默认值存放到缓存，这样第二次到缓冲中获取就有值了，而不会继续访问数据库，这种办法最简单粗暴！

方案二伪代码：

```
//伪代码public object GetProductListNew() {    int cacheTime = 30;    String cacheKey = "product_list";    String cacheValue = CacheHelper.Get(cacheKey);    if (cacheValue != null) {        return cacheValue;    }    cacheValue = CacheHelper.Get(cacheKey);    if (cacheValue != null) {        return cacheValue;    } else {        //数据库查询不到，为空        cacheValue = GetProductListFromDB();        if (cacheValue == null) {            //如果发现为空，设置个默认值，也缓存起来            cacheValue = string.Empty;        }        CacheHelper.Add(cacheKey, cacheValue, cacheTime);        return cacheValue;    }}
```

## 缓存预热

缓存预热这个应该是一个比较常见的概念，相信很多小伙伴都应该可以很容易的理解，缓存预热就是系统上线后，将相关的缓存数据直接加载到缓存系统。这样就可以避免在用户请求的时候，先查询数据库，然后再将数据缓存的问题！用户直接查询事先被预热的缓存数据！

解决思路：

1. 直接写个缓存刷新页面，上线时手工操作下；
2. 数据量不大，可以在项目启动的时候自动进行加载；
3. 定时刷新缓存；

## 缓存更新

除了缓存服务器自带的缓存失效策略之外，我们还可以根据具体的业务需求进行自定义的缓存淘汰，常见的策略有两种：

1. 定时去清理过期的缓存。
2. 当有用户请求过来时，再判断这个请求所用到的缓存是否过期，过期的话就去底层系统得到新数据并更新缓存。

## 缓存降级

当访问量剧增、服务出现问题（如响应时间慢或不响应）或非核心服务影响到核心流程的性能时，仍然需要保证服务还是可用的，即使是有损服务。系统可以根据一些关键数据进行自动降级，也可以配置开关实现人工降级。

降级的最终目的是保证核心服务可用，即使是有损的。而且有些服务是无法降级的。

在进行降级之前要对系统进行梳理，看看系统是不是可以丢卒保帅；从而梳理出哪些必须誓死保护，哪些可降级；比如可以参考日志级别设置预案：

（1）一般：比如有些服务偶尔因为网络抖动或者服务正在上线而超时，可以自动降级；

（2）警告：有些服务在一段时间内成功率有波动（如在95~100%之间），可以自动降级或人工降级，并发送告警；

（3）错误：比如可用率低于90%，或者数据库连接池被打爆了，或者访问量突然猛增到系统能承受的最大阀值，此时可以根据情况自动降级或者人工降级；

（4）严重错误：比如因为特殊原因数据错误了，此时需要紧急人工降级。

------

参考文章：

- [缓存雪崩、缓存穿透、缓存预热、缓存更新、缓存降级等问题](https://blog.csdn.net/xlgen157387/article/details/79530877)





## 