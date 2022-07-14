# 面试

## 使用redis有哪些好处？

1. **速度快**，因为数据存在内存中，类似于HashMap，HashMap的优势就是查找和操作的时间复杂度都是O(1)
2. **支持丰富数据类型**，支持string，list，set，sorted set，hash
3. **支持事务**，操作都是原子性，所谓的原子性就是对数据的更改要么全部执行，要么全部不执行
4. **丰富的特性**：可用于缓存，消息，按key设置过期时间，过期后将会自动删除



## redis相比memcached有哪些优势？

1. memcached所有的值均是简单的字符串，redis作为其替代者，支持更为丰富的数据类型
2. redis的速度比memcached快很多
3. redis可以持久化其数据



## redis常见性能问题和解决方案：

1. Master最好不要做任何持久化工作，如RDB内存快照和AOF日志文件
2. 如果数据比较重要，某个Slave开启AOF备份数据，策略设置为每秒同步一次
3. 为了主从复制的速度和连接的稳定性，Master和Slave最好在**同一个局域网内**
4. 尽量避免在压力很大的主库上增加从库
5. 主从复制不要用图状结构，用**单向链表结构**更为稳定，即：`Master <- Slave1 <- Slave2 <- Slave3…`



## redis 最适合的场景

+ 会话缓存（Session Cache）
+ 全页缓存（FPC）
+ 队列
+ 排行榜/计数器
+ 发布/订阅



## redis是单线程还是多线程

+ 无论什么版本，工作线程就是一个
+ 6.x高版本出现了IO多线程
+ 单线程，满足redis的串行原子，只不过IO多线程后，把输入/输出放到更多的线程里去并行，好处如下：1，执行时间缩短，更快；2，更好的压榨系统及硬件的资源(网卡能够高效的使用)；



## redis的一些其他特点

+ Redis是单进程单线程的，利用队列技术将并发访问变为串行访问

+ 读写分离模型，整个集群的读和写的可用性都非常高

+ 数据分片模型，可以将每个节点看成都是独立的master，然后通过业务实现数据分片

+ Redis的回收策略

  + volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰

  + volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰

  + volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰

  + allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰

  + allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰

  + no-enviction（驱逐）：禁止驱逐数据

    使用策略规则：

    1. 如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用allkeys-lr
    2. 如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用allkeys-random



## MySQL里有2000w数据，Redis中只存20w的数据，如何保证Redis中的数据都是热点数据

Redis 内存数据集大小上升到一定大小的时候，就会施行数据淘汰策略，可以通过淘汰策略保证热点数据



## 假如Redis里面有1亿个key，其中有10w个key是以某个固定的已知的前缀开头的，如果将它们全部找出来？

使用`scan`指令，`keys`指令会阻塞



## Redis 常见的性能问题都有哪些？如何解决？

1. Master 写内存快照，save命令调度rdbSave函数，**会阻塞主线程的工作**，当快照比较大时对性能影响是非常大的，会间断性暂停服务，所以Master最好不要写内存快照。
2. Master AOF持久化，如果不重写AOF文件，这个持久化方式对性能的影响是最小的，但是AOF文件会不断增大，**AOF文件过大**会影响Master重启的恢复速度。**Master最好不要做任何持久化工作**，包括内存快照和AOF日志文件，特别是不要启用内存快照做持久化，如果数据比较关键，某个Slave开启AOF备份数据，策略为每秒同步一次。
3. Master调用`BGREWRITEAOF`重写AOF文件，AOF在重写的时候会占大量的CPU和内存资源，导致服务load过高，出现短暂服务暂停现象。
4. Redis主从复制的性能问题，为了主从复制的速度和连接的稳定性，Slave和Master最好在`同一个局域网`内



## 缓存穿透

缓存穿透：**数据库和reids中没有该数据**，然后查了redis再查数据库，没有查出数据。



+ 所以应该让有效地请求到达数据库，即便放大前置环节的复杂度和成本
  + redis 中放 null key （可能浪费空间）
  + 布隆过滤器（` [布隆过滤器-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/773205) `）

+ 请求的时候加锁



## 缓存击穿

缓存击穿：热点key过期（没有被缓存的），但**数据库中有**，大量并发查询该 key，就绕过redis，直接去数据库查

+ 请求的时候加锁，因为查询的key是同一个，所以必须由一个redis提供锁，锁必须是唯一的，红锁



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

+ 后台在轮询，分段分批的删除哪些过期的key
+ 请求的时候判断时候已经过期了，尽量的把内存无用空间回收回来



## 缓存是如何淘汰的

+ 淘汰机制里有不允许淘汰
+ lru/lfu/random/TTL
+ 全空间
+ 设置过过期的key的集合中



Redis的回收策略

+ volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰

+ volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰

+ volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰

+ allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰

+ allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰

+ no-enviction（驱逐）：禁止驱逐数据

  使用策略规则：

  1. 如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用allkeys-lr
  2. 如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用allkeys-random



## 如何进行缓存预热

1，提前把数据塞入redis，(你知道那些是热数据吗？肯定不知道，会造成上线很多数据没有缓存命中)
2，开发逻辑上也要规避差集，会造成击穿，穿透，雪崩

## 简述一下主从不一致的问题？

+ redis的确默认是弱一致性，异步的同步
+ 锁不能用主从、(可用单实例/分片集群/redlock)==>redisson
+ 在配置中提供了必须有多少个Client连接能同步，可以配置同步因子，趋向于强制一性



## 数据库与缓存不一致如何解决？

+ 分布式事务（意义不大，顶多读多，写稀有情况下）
+ 摆烂，不强求一致
  + redis是缓存，更倾向于稍微的有时差，默认是弱一致性，异步的同步
  + 减少DB的操作
+ 完全异步化，使用`MQ`
+ 真的要落地，就使用`canal binlog`



## 描述一下redis持久化原理？

当前线程阻塞服务
异步后台进程完成持久，fork  +  cow

## redis实现分布式锁的指令

`set k v nx ex`



# 缓存基础

## 缓存雪崩

缓存雪崩是由于原有缓存失效(过期)，新缓存未到期间。所有请求都去查询数据库，而对数据库CPU和内存造成巨大压力，严重的会造成数据库宕机。从而形成一系列连锁反应，造成整个系统崩溃



解决方法：

1. 一般并发量不是特别多的时候，使用最多的解决方案是加锁排队
2. 给每一个缓存数据增加相应的缓存标记，记录缓存的是否失效，如果缓存标记失效，则更新数据缓存
   - 缓存标记：记录缓存数据是否过期，如果过期会触发通知另外的线程在后台去更新实际key的缓存
   - 缓存数据：它的过期时间比缓存标记的时间延长1倍，例：标记缓存时间30分钟，数据缓存设置为60分钟。 这样，当缓存标记key过期后，实际缓存还能把旧数据返回给调用端，直到另外的线程在后台更新完成后，才会返回新缓存



加锁排队方案伪代码：

```java
public object GetProductListNew() {
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
                cacheValue = GetProductListFromDB();
                CacheHelper.Add(cacheKey, cacheValue, cacheTime);
            }        
        }        
        return cacheValue;
    }
}
```



缓存标记方案伪代码：

```java
//伪代码
public object GetProductListNew() {
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
            cacheValue = GetProductListFromDB();
            //日期设缓存时间的2倍，用于脏读
            CacheHelper.Add(cacheKey, cacheValue, cacheTime * 2);
        });
        return cacheValue;
    }
}
```



## 缓存穿透

缓存穿透是指用户查询数据，在数据库没有，自然在缓存中也不会有。这样就导致用户查询的时候，在缓存中找不到，每次都要去数据库再查询一遍，然后返回空（相当于进行了两次无用的查询）。这样请求就绕过缓存直接查数据库，这也是经常提的缓存命中率问题。



解决方案：

1. 布隆过滤器，将所有可能存在的数据哈希到一个足够大的bitmap中，一个一定不存在的数据会被这个bitmap拦截掉，从而避免了对底层存储系统的查询压力。
2. 如果一个查询返回的数据为空（不管是数据不存在，还是系统故障），仍然把这个空结果进行缓存，但它的过期时间会很短，最长不超过五分钟。通过这个直接设置的默认值存放到缓存，这样第二次到缓冲中获取就有值了，而不会继续访问数据库，这种办法最简单粗暴！

方案二伪代码：

```java
//伪代码
public object GetProductListNew() {
    int cacheTime = 30;
    String cacheKey = "product_list";
    String cacheValue = CacheHelper.Get(cacheKey);
    if (cacheValue != null) {
        return cacheValue;    
    }
    
    cacheValue = CacheHelper.Get(cacheKey);
    if (cacheValue != null) {
        return cacheValue;
    } else {
        //数据库查询不到，为空
        cacheValue = GetProductListFromDB();
        if (cacheValue == null) {
            //如果发现为空，设置个默认值，也缓存起来
            cacheValue = string.Empty;
        }
        CacheHelper.Add(cacheKey, cacheValue, cacheTime);
        return cacheValue;
    }
}
```



## 缓存预热

缓存预热就是系统上线后，将相关的缓存数据直接加载到缓存系统。这样就可以避免在用户请求的时候，先查询数据库，然后再将数据缓存的问题！用户直接查询事先被预热的缓存数据！

解决思路：

1. 直接写个缓存刷新页面，上线时手工操作下；
2. 数据量不大，可以在项目启动的时候自动进行加载；
3. 定时刷新缓存；



## 缓存更新

除了缓存服务器自带的缓存失效策略之外，还可以根据具体的业务需求进行自定义的缓存淘汰，常见的策略有两种：

1. 定时去清理过期的缓存。
2. 当有用户请求过来时，再判断这个请求所用到的缓存是否过期，过期的话就去底层系统得到新数据并更新缓存。



## 缓存降级

当访问量剧增、服务出现问题（如响应时间慢或不响应）或非核心服务影响到核心流程的性能时，仍然需要保证服务还是可用的，即使是有损服务

系统可以根据一些关键数据进行自动降级，也可以配置开关实现人工降级

降级的最终目的是保证核心服务可用，即使是有损的。而且有些服务是无法降级的



在进行降级之前要对系统进行梳理，看看系统是不是可以丢卒保帅；从而梳理出哪些必须誓死保护，哪些可降级；比如可以参考日志级别设置预案：

（1）一般：比如有些服务偶尔因为网络抖动或者服务正在上线而超时，可以自动降级；

（2）警告：有些服务在一段时间内成功率有波动（如在95~100%之间），可以自动降级或人工降级，并发送告警；

（3）错误：比如可用率低于90%，或者数据库连接池被打爆了，或者访问量突然猛增到系统能承受的最大阀值，此时可以根据情况自动降级或者人工降级；

（4）严重错误：比如因为特殊原因数据错误了，此时需要紧急人工降级。



参考文章：

- [缓存雪崩、缓存穿透、缓存预热、缓存更新、缓存降级等问题](https://blog.csdn.net/xlgen157387/article/details/79530877)





## 使用过Redis分布式锁么，它是什么回事？

`setnx + expire`的原子操作枪锁，也可以防止锁一直占用



## 使用过Redis做异步队列么，你是怎么用的？

+ 一般使用list结构作为队列，`rpush`生产消息，`blpop`消费消息，`blpop`没有消息的时候，它会阻塞住直到消息到来
+ 使用pub/sub主题订阅者模式，可以实现1:N的消息队列，在消费者下线的情况下，生产的消息会丢失，得使用专业的消息队列如rabbitmq等



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

+ 前台
+ 中台
+ 后台





