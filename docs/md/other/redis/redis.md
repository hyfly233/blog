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

# 发布订阅

# bitmap

# geo

# 持久化

# RDB

# AOF

# fork

# AOF阻塞

# 全量复杂

# 故障处理

# sentinel







# Jedis



















