# Redis

## Redis实现原理

- 纯内存操作
- 单线程操作，避免频繁的上下文切换
- 采用非阻塞I/O多路复用机制
- 纯ANSI C编写



```plain
redis的工作原理是什么

Redis 是一个高性能的 key-value 存储系统，支持多种数据结构，如字符串、哈希表、列表、集合、有序集合等。它的工作原理可以概括为：

内存存储：Redis 将数据存储在内存中，以实现快速读写操作。同时，Redis 也支持数据持久化到磁盘中，以保证数据在断电等情况下不会丢失。

单线程执行：Redis 使用单线程模型来避免多线程之间的竞争和锁等问题，从而提高系统的并发处理能力。同时，Redis 也使用了一些异步 IO 技术，以实现高效的网络 IO 操作。

事件驱动模型：Redis 采用事件驱动模型，通过监听网络套接字上的事件，如可读事件、可写事件等，来触发对应的事件处理函数，从而实现对客户端请求的响应。这种模型避免了传统的轮询方式带来的性能问题。

数据结构的支持：Redis 支持多种数据结构，如字符串、哈希表、列表、集合、有序集合等。这些数据结构都有自己的特点和适用场景，可以满足不同应用的需求。

原子性操作：Redis 支持多种原子性操作，如事务、乐观锁、悲观锁等。这些操作可以保证数据的一致性和正确性，同时也提高了系统的并发性能。

总之，Redis 的工作原理非常灵活和高效，可以满足各种应用场景的需求。
```

## 使用redis有哪些好处

1. **速度快**，因为数据存在内存中
2. **支持丰富数据类型**，支持 string，list，set，sorted set，hash
3. **支持事务**，操作都是原子性（与关系型数据库的事务不是同一个东西）
4. **丰富的特性**：可用于缓存，消息，按key设置过期时间，过期后将会自动删除

## redis相比memcached有哪些优势？

1. memcached所有的值均是简单的字符串，redis作为其替代者，支持更为丰富的数据类型
2. redis的速度比memcached快很多
3. redis可以持久化其数据

## redis 最适合的场景

- 会话缓存（Session Cache）
- 全页缓存（FPC）
- 队列
- 排行榜/计数器
- 发布/订阅

## redis是单线程还是多线程

- 无论什么版本，工作线程就是一个
- 6.x高版本出现了IO多线程
- 单线程，满足redis的串行原子，只不过IO多线程后，把输入/输出放到更多的线程里去并行，好处如下：1、执行时间缩短，更快；2、更好的压榨系统及硬件的资源(网卡能够高效的使用)；

## redis的一些其他特点

- Redis是单进程单线程的，利用队列技术将并发访问变为串行访问 
- 读写分离模型，整个集群的读和写的可用性都非常高 
- 数据分片模型，可以将每个节点看成都是独立的master，然后通过业务实现数据分片 
- Redis的回收策略 

- - volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰 
  - volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰 
  - volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰 
  - allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰 
  - allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰 
  - no-enviction（驱逐）：禁止驱逐数据
    使用策略规则： 

1. 1. 1. 如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用allkeys-lru
      2. 如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用allkeys-random

## MySQL里有2000w数据，Redis中只存20w的数据，如何保证Redis中的数据都是热点数据

Redis 内存数据集大小上升到一定大小的时候，就会施行数据淘汰策略，可以通过淘汰策略保证热点数据

## 假如Redis里面有1亿个key，其中有10w个key是以某个固定的已知的前缀开头的，如果将它们全部找出来？

使用`scan`指令查找，使用`keys`指令会阻塞

## Redis 常见的性能问题都有哪些？如何解决？

1. Master最好不要写内存快照，Master 写内存快照，save命令调度rdbSave函数，**会阻塞主线程的工作**，当快照比较大时对性能影响是非常大的，会间断性暂停服务。
2. Master最好不要做任何持久化工作，如RDB内存快照和AOF日志文件。Master AOF持久化，如果不重写AOF文件，这个持久化方式对性能的影响是最小的，但是AOF文件会不断增大，**AOF文件过大**会影响Master重启的恢复速度。**Master最好不要做任何持久化工作**，包括内存快照和AOF日志文件，特别是不要启用内存快照做持久化，如果数据比较关键，某个Slave开启AOF备份数据，策略为每秒同步一次。
3. Master调用`BGREWRITEAOF`重写AOF文件，AOF在重写的时候会占大量的CPU和内存资源，导致服务load过高，出现短暂服务暂停现象。
4. Redis主从复制的性能问题，为了主从复制的速度和连接的稳定性，Slave和Master最好在`同一个局域网`内
5. 如果数据比较重要，某个Slave开启AOF备份数据，策略设置为每秒同步一次
6. 尽量避免在压力很大的主库上增加从库
7. 主从复制不要用图状结构，用**单向链表结构**更为稳定，即：`Master <- Slave1 <- Slave2 <- …`

## 缓存穿透

- **缓存穿透：**查询某个 Key 对应的数据，**数据库和reids中没有该数据**，查了redis再查数据库，没有查出数据返回空（相当于进行了两次无用的查询），redis 也不会缓存空结果，这就造成每次通过这样的 Key 去查询数据都会直接到数据库中查询，这也是缓存命中率问题。
- **解决方法：**

- - 让有效地请求到达数据库，即便放大前置环节的复杂度和成本

- - - 布隆过滤器。布隆过滤器可以针对大数据量的、有规律的键值进行处理。一条记录是不是存在，本质上是一个 Bool 值，只需要使用 1bit 就可以存储。使用布隆过滤器将这种表示是、否等操作，压缩到一个数据结构中。比如，用户性别这种数据，就非常适合使用布隆过滤器来处理
    - 将数据库查询的空结果缓存到 redis 中，设置合理的过期时间（可能浪费空间）

```java
public object getProductList() {
    int cacheTime = 30;
    String cacheKey = "product_list";

    String cacheValue = CacheHelper.Get(cacheKey);

    if (cacheValue != null) {
        return cacheValue;
    } else {
        //数据库查询不到，为空
        cacheValue = getProductListFromDB();
        if (cacheValue == null) {
            //如果发现为空，设置个默认值，也缓存起来
            cacheValue = string.Empty;
        }
        CacheHelper.Add(cacheKey, cacheValue, cacheTime);
        return cacheValue;
    }
}
```

## 缓存击穿

- **缓存击穿：**如果缓存中的数据在某个时刻批量过期（相同的过期时间），导致大部分用户的请求都会直接落在数据库上，这种现象就叫作缓存击穿
- **解决方法：**

- - 对于不变的比较热点的数据可以设置为永不过期
  - 在访问数据的时候，更新其过期时间
  - 对于批量入库的缓存项，分配比较合理的过期时间，避免同一时刻失效
  - 使用分布式锁，保证对于每个 key 同时只有一个线程去查询后端服务，其他线程进入等待（性能大大降低）

- - - 步骤：

1. 1. 1. 1. 请求 redis，肯定没有
         2. 大家抢锁，redis取不到数据时

1. 1. 1. 1. 1. 抢上的查数据库，O(1)
            2. 没抢上的 sleep（sleep线程不会占用cpu） 

1. 1. 1. 1. 数据库查询，更新redis，O(1) 
         2. sleep的线程回到第一步 

```java
public object getProductList() {
    int cacheTime = 30;
    String cacheKey = "product_list";
    String lockKey = cacheKey;
    String cacheValue = CacheHelper.get(cacheKey);
    
    if (cacheValue != null) {
        return cacheValue;    
    } else {
        synchronized(lockKey) {
            cacheValue = CacheHelper.get(cacheKey);
            if (cacheValue != null) {
                return cacheValue;
            } else {                
                //这里一般是sql查询数据
                cacheValue = getProductListFromDB();
                CacheHelper.Add(cacheKey, cacheValue, cacheTime);
            }        
        }        
        return cacheValue;
    }
}
```

- - 给每一个缓存数据增加相应的缓存标记，记录缓存的是否失效，如果缓存标记失效，则更新数据缓存

- - - 缓存标记：记录缓存数据是否过期，如果过期会触发通知另外的线程在后台去更新实际key的缓存
    - 缓存数据：它的过期时间比缓存标记的时间延长1倍，例：标记缓存时间30分钟，数据缓存设置为60分钟。 这样，当缓存标记key过期后，实际缓存还能把旧数据返回给调用端，直到另外的线程在后台更新完成后，才会返回新缓存

```java
public object getProductList() {
    int cacheTime = 30;
    String cacheKey = "product_list";    
    //缓存标记
    String cacheSign = cacheKey + "_sign";  
    
    String sign = CacheHelper.Get(cacheSign);
    //获取缓存值
    String cacheValue = CacheHelper.Get(cacheKey);
    
    if (sign != null) {
        return cacheValue; //未过期，直接返回
    } else {
        CacheHelper.Add(cacheSign, "1", cacheTime);       
        ThreadPool.QueueUserWorkItem((arg) -> {
            //这里一般是 sql查询数据
            cacheValue = getProductListFromDB();
            //日期设缓存时间的2倍，用于脏读
            CacheHelper.Add(cacheKey, cacheValue, cacheTime * 2);
        });
        return cacheValue;
    }
}
```

## 缓存雪崩

- **缓存雪崩：**如果在某一时刻缓存集中失效（缓存击穿 * N），或者缓存系统出现故障，所有的并发流量就会直接到达数据库。数据存储层的调用量就会暴增，用不了多长时间，数据库就会被大流量压垮，这种级联式的服务故障，就叫作缓存雪崩。
- **解决方法：**

- - 保证 Redis 的高可用，将 Redis 缓存部署成高可用集群，有效的防止缓存雪崩问题的发生
  - 缓解大并发流量，使用限流降级的方式防止缓存雪崩
  - 通过数据预热的方式将可能大量访问的数据加载到缓存，在即将发生大并发访问的时候，提前手动触发加载不同的数据到缓存中，并为数据设置不同的过期时间，让缓存失效的时间点尽量均匀，不至于在同一时刻全部失效

## Redis是怎么删除过期key的、缓存如何回收的？

- 被动清理

- - 当用户主动访问一个过期的key时，redis会将其直接从内存中删除

- 主动清理

- - redis后台轮询，分段分批的删除过期的key

## Redis的淘汰回收策略

-  volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰 
-  volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰 
-  volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰 
-  allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰 
-  allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰 
-  no-enviction（驱逐）：禁止驱逐数据
  使用策略规则： 

1. 1. 如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用allkeys-lru
   2. 如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用allkeys-random

## 缓存预热

缓存预热就是系统上线后，将相关的缓存数据直接加载到缓存系统。这样就可以避免在用户请求的时候，先查询数据库，然后再将数据缓存的问题，用户直接查询事先被预热的缓存数据。

解决思路：

1. 写个缓存刷新页面，上线时手工操作；
2. 数据量不大，可以在项目启动的时候自动进行加载；
3. 定时刷新缓存；

## 主从不一致

- redis的确默认是弱一致性，异步的同步
- 锁不能用主从、(可用单实例/分片集群/redlock)==>redisson
- 在配置中提供了必须有多少个Client连接能同步，可以配置同步因子，趋向于强制一性

## 数据库与缓存不一致如何解决？

- 分布式事务（读多，写稀有情况下）
- 不强求一致 

- - redis是缓存，更倾向于稍微的有时差，默认是弱一致性，异步的同步
  - 减少DB的操作

- 完全异步化，使用`MQ`
- 使用`canal binlog`

## 描述一下redis持久化原理？

当前线程阻塞服务
异步后台进程完成持久，fork  +  cow

## redis实现分布式锁的指令

```
set k v nx ex
```

## 缓存降级

缓存降级是指当访问量剧增、服务出现问题（如响应时间慢或不响应）或非核心服务影响到核心流程的性能时，即使是有损部分其他服务，仍然需要保证主服务可用。可以将其他次要服务的数据进行缓存降级，从而提升主服务的稳定性。

## 使用过Redis分布式锁么，它是什么回事？

`setnx + expire`的原子操作枪锁，也可以防止锁一直占用

## Redis做异步队列

- 一般使用list结构作为队列，`rpush`生产消息，`blpop`消费消息，`blpop`没有消息的时候，它会阻塞住直到消息到来
- 使用pub/sub主题订阅者模式，可以实现1:N的消息队列，在消费者下线的情况下，生产的消息会丢失，得使用专业的消息队列如rabbitmq等

## 如果有大量的key需要设置同一时间过期，一般需要注意什么？

如果大量的key过期时间设置的过于集中，到过期的那个时间点，redis可能会出现短暂的**卡顿现象**。一般需要在时间上加一个随机值，使得**过期时间分散**一些。

## 为什么Redis需要把所有数据放到内存中？

Redis为了达到最快的读写速度将数据都读到内存中，并通过异步的方式将数据写入磁盘。所以redis具有快速和数据持久化的特征
如果设置了最大使用的内存，则数据已有记录数达到内存限值后不能继续插入新值

## Pipeline有什么好处，为什么要用pipeline？

可以将多次IO往返的时间缩减为一次，前提是pipeline执行的指令之间没有因果相关性

## Redis 集群方案与实现

Redis Sentinal着眼于高可用，在master宕机时会自动将slave提升为master，继续提供服务

Redis Cluster着眼于扩展性，在单个redis内存不足时，使用Cluster进行分片存储

## Redis持久化数据和缓存怎么做扩容？

- 如果Redis被当做缓存使用，使用一致性哈希实现动态扩容缩容。
- 如果Redis被当做一个持久化存储使用，必须使用固定的keys-to-nodes映射关系，节点的数量一旦确定不能变化。否则的话(即Redis节点需要动态变化的情况），必须使用可以在运行时进行数据再平衡的一套系统，而当前只有Redis集群可以做到这样。

## 缓存脏读

缓存的数据与数据库中不一样

## 多级缓存

- 前台
- 中台
- 后台