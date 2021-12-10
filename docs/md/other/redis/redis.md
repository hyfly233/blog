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





































