# Redis

## Redis 实现原理

-   纯内存操作
-   单线程操作，避免频繁的上下文切换
-   采用非阻塞 I/O 多路复用机制
-   纯 ANSI C 编写

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

## 使用 redis 有哪些好处

1. **速度快**，因为数据存在内存中
2. **支持丰富数据类型**，支持 string，list，set，sorted set，hash
3. **支持事务**，操作都是原子性（与关系型数据库的事务不是同一个东西）
4. **丰富的特性**：可用于缓存，消息，按 key 设置过期时间，过期后将会自动删除

## redis 相比 memcached 有哪些优势？

1. memcached 所有的值均是简单的字符串，redis 作为其替代者，支持更为丰富的数据类型
2. redis 的速度比 memcached 快很多
3. redis 可以持久化其数据

## redis 最适合的场景

-   会话缓存（Session Cache）
-   全页缓存（FPC）
-   队列
-   排行榜/计数器
-   发布/订阅

## redis 是单线程还是多线程

-   无论什么版本，工作线程就是一个
-   6.x 高版本出现了 IO 多线程
-   单线程，满足 redis 的串行原子，只不过 IO 多线程后，把输入/输出放到更多的线程里去并行，好处如下：1、执行时间缩短，更快；2、更好的压榨系统及硬件的资源(网卡能够高效的使用)；

## redis 的一些其他特点

-   Redis 是单进程单线程的，利用队列技术将并发访问变为串行访问
-   读写分离模型，整个集群的读和写的可用性都非常高
-   数据分片模型，可以将每个节点看成都是独立的 master，然后通过业务实现数据分片
-   Redis 的回收策略

-   -   volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰
    -   volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰
    -   volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰
    -   allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰
    -   allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰
    -   no-enviction（驱逐）：禁止驱逐数据
        使用策略规则：

1.  1.  1. 如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用 allkeys-lru
    2.  如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用 allkeys-random

## MySQL 里有 2000w 数据，Redis 中只存 20w 的数据，如何保证 Redis 中的数据都是热点数据

Redis 内存数据集大小上升到一定大小的时候，就会施行数据淘汰策略，可以通过淘汰策略保证热点数据

## 假如 Redis 里面有 1 亿个 key，其中有 10w 个 key 是以某个固定的已知的前缀开头的，如果将它们全部找出来？

使用`scan`指令查找，使用`keys`指令会阻塞

## Redis 常见的性能问题都有哪些？如何解决？

1. Master 最好不要写内存快照，Master 写内存快照，save 命令调度 rdbSave 函数，**会阻塞主线程的工作**，当快照比较大时对性能影响是非常大的，会间断性暂停服务。
2. Master 最好不要做任何持久化工作，如 RDB 内存快照和 AOF 日志文件。Master AOF 持久化，如果不重写 AOF 文件，这个持久化方式对性能的影响是最小的，但是 AOF 文件会不断增大，**AOF 文件过大**会影响 Master 重启的恢复速度。**Master 最好不要做任何持久化工作**，包括内存快照和 AOF 日志文件，特别是不要启用内存快照做持久化，如果数据比较关键，某个 Slave 开启 AOF 备份数据，策略为每秒同步一次。
3. Master 调用`BGREWRITEAOF`重写 AOF 文件，AOF 在重写的时候会占大量的 CPU 和内存资源，导致服务 load 过高，出现短暂服务暂停现象。
4. Redis 主从复制的性能问题，为了主从复制的速度和连接的稳定性，Slave 和 Master 最好在`同一个局域网`内
5. 如果数据比较重要，某个 Slave 开启 AOF 备份数据，策略设置为每秒同步一次
6. 尽量避免在压力很大的主库上增加从库
7. 主从复制不要用图状结构，用**单向链表结构**更为稳定，即：`Master <- Slave1 <- Slave2 <- …`

## 缓存穿透

-   **缓存穿透：**查询某个 Key 对应的数据，**数据库和 reids 中没有该数据**，查了 redis 再查数据库，没有查出数据返回空（相当于进行了两次无用的查询），redis 也不会缓存空结果，这就造成每次通过这样的 Key 去查询数据都会直接到数据库中查询，这也是缓存命中率问题。
-   **解决方法：**

-   -   让有效地请求到达数据库，即便放大前置环节的复杂度和成本

-   -   -   布隆过滤器。布隆过滤器可以针对大数据量的、有规律的键值进行处理。一条记录是不是存在，本质上是一个 Bool 值，只需要使用 1bit 就可以存储。使用布隆过滤器将这种表示是、否等操作，压缩到一个数据结构中。比如，用户性别这种数据，就非常适合使用布隆过滤器来处理
        -   将数据库查询的空结果缓存到 redis 中，设置合理的过期时间（可能浪费空间）

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

-   **缓存击穿：**如果缓存中的数据在某个时刻批量过期（相同的过期时间），导致大部分用户的请求都会直接落在数据库上，这种现象就叫作缓存击穿
-   **解决方法：**

-   -   对于不变的比较热点的数据可以设置为永不过期
    -   在访问数据的时候，更新其过期时间
    -   对于批量入库的缓存项，分配比较合理的过期时间，避免同一时刻失效
    -   使用分布式锁，保证对于每个 key 同时只有一个线程去查询后端服务，其他线程进入等待（性能大大降低）

-   -   -   步骤：

1.  1.  1.  1. 请求 redis，肯定没有
        2.  大家抢锁，redis 取不到数据时

1.  1.  1.  1.  1. 抢上的查数据库，O(1)
            2.  没抢上的 sleep（sleep 线程不会占用 cpu）

1.  1.  1.  1. 数据库查询，更新 redis，O(1)
        2.  sleep 的线程回到第一步

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

-   -   给每一个缓存数据增加相应的缓存标记，记录缓存的是否失效，如果缓存标记失效，则更新数据缓存

-   -   -   缓存标记：记录缓存数据是否过期，如果过期会触发通知另外的线程在后台去更新实际 key 的缓存
        -   缓存数据：它的过期时间比缓存标记的时间延长 1 倍，例：标记缓存时间 30 分钟，数据缓存设置为 60 分钟。 这样，当缓存标记 key 过期后，实际缓存还能把旧数据返回给调用端，直到另外的线程在后台更新完成后，才会返回新缓存

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

-   **缓存雪崩：**如果在某一时刻缓存集中失效（缓存击穿 \* N），或者缓存系统出现故障，所有的并发流量就会直接到达数据库。数据存储层的调用量就会暴增，用不了多长时间，数据库就会被大流量压垮，这种级联式的服务故障，就叫作缓存雪崩。
-   **解决方法：**

-   -   保证 Redis 的高可用，将 Redis 缓存部署成高可用集群，有效的防止缓存雪崩问题的发生
    -   缓解大并发流量，使用限流降级的方式防止缓存雪崩
    -   通过数据预热的方式将可能大量访问的数据加载到缓存，在即将发生大并发访问的时候，提前手动触发加载不同的数据到缓存中，并为数据设置不同的过期时间，让缓存失效的时间点尽量均匀，不至于在同一时刻全部失效

## Redis 是怎么删除过期 key 的、缓存如何回收的？

-   被动清理

-   -   当用户主动访问一个过期的 key 时，redis 会将其直接从内存中删除

-   主动清理

-   -   redis 后台轮询，分段分批的删除过期的 key

## Redis 的淘汰回收策略

-   volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰
-   volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰
-   volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰
-   allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰
-   allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰
-   no-enviction（驱逐）：禁止驱逐数据
    使用策略规则：

1.  1. 如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用 allkeys-lru
    2. 如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用 allkeys-random

## 缓存预热

缓存预热就是系统上线后，将相关的缓存数据直接加载到缓存系统。这样就可以避免在用户请求的时候，先查询数据库，然后再将数据缓存的问题，用户直接查询事先被预热的缓存数据。

解决思路：

1. 写个缓存刷新页面，上线时手工操作；
2. 数据量不大，可以在项目启动的时候自动进行加载；
3. 定时刷新缓存；

## 主从不一致

-   redis 的确默认是弱一致性，异步的同步
-   锁不能用主从、(可用单实例/分片集群/redlock)==>redisson
-   在配置中提供了必须有多少个 Client 连接能同步，可以配置同步因子，趋向于强制一性

## 数据库与缓存不一致如何解决？

-   分布式事务（读多，写稀有情况下）
-   不强求一致

-   -   redis 是缓存，更倾向于稍微的有时差，默认是弱一致性，异步的同步
    -   减少 DB 的操作

-   完全异步化，使用`MQ`
-   使用`canal binlog`

## 描述一下 redis 持久化原理？

当前线程阻塞服务
异步后台进程完成持久，fork + cow

## redis 实现分布式锁的指令

```
set k v nx ex
```

## 缓存降级

缓存降级是指当访问量剧增、服务出现问题（如响应时间慢或不响应）或非核心服务影响到核心流程的性能时，即使是有损部分其他服务，仍然需要保证主服务可用。可以将其他次要服务的数据进行缓存降级，从而提升主服务的稳定性。

## 使用过 Redis 分布式锁么，它是什么回事？

`setnx + expire`的原子操作枪锁，也可以防止锁一直占用

## Redis 做异步队列

-   一般使用 list 结构作为队列，`rpush`生产消息，`blpop`消费消息，`blpop`没有消息的时候，它会阻塞住直到消息到来
-   使用 pub/sub 主题订阅者模式，可以实现 1:N 的消息队列，在消费者下线的情况下，生产的消息会丢失，得使用专业的消息队列如 rabbitmq 等

## 如果有大量的 key 需要设置同一时间过期，一般需要注意什么？

如果大量的 key 过期时间设置的过于集中，到过期的那个时间点，redis 可能会出现短暂的**卡顿现象**。一般需要在时间上加一个随机值，使得**过期时间分散**一些。

## 为什么 Redis 需要把所有数据放到内存中？

Redis 为了达到最快的读写速度将数据都读到内存中，并通过异步的方式将数据写入磁盘。所以 redis 具有快速和数据持久化的特征
如果设置了最大使用的内存，则数据已有记录数达到内存限值后不能继续插入新值

## Pipeline 有什么好处，为什么要用 pipeline？

可以将多次 IO 往返的时间缩减为一次，前提是 pipeline 执行的指令之间没有因果相关性

## Redis 集群方案与实现

Redis Sentinal 着眼于高可用，在 master 宕机时会自动将 slave 提升为 master，继续提供服务

Redis Cluster 着眼于扩展性，在单个 redis 内存不足时，使用 Cluster 进行分片存储

## Redis 持久化数据和缓存怎么做扩容？

-   如果 Redis 被当做缓存使用，使用一致性哈希实现动态扩容缩容。
-   如果 Redis 被当做一个持久化存储使用，必须使用固定的 keys-to-nodes 映射关系，节点的数量一旦确定不能变化。否则的话(即 Redis 节点需要动态变化的情况），必须使用可以在运行时进行数据再平衡的一套系统，而当前只有 Redis 集群可以做到这样。

## 缓存脏读

缓存的数据与数据库中不一样

## 多级缓存

-   前台
-   中台
-   后台

# Redis 技术指南

## 目录

1. [Redis 基础概念](#redis-基础概念)
2. [Redis 工作原理](#redis-工作原理)
3. [Redis 优势与特性](#redis-优势与特性)
4. [Redis 数据结构与应用场景](#redis-数据结构与应用场景)
5. [Redis 线程模型](#redis-线程模型)
6. [Redis 内存管理](#redis-内存管理)
7. [Redis 缓存问题与解决方案](#redis-缓存问题与解决方案)
8. [Redis 持久化机制](#redis-持久化机制)
9. [Redis 分布式应用](#redis-分布式应用)
10. [Redis 集群与高可用](#redis-集群与高可用)
11. [Redis 性能优化](#redis-性能优化)
12. [面试常见问题](#面试常见问题)

---

## Redis 基础概念

### 什么是 Redis？

Redis（Remote Dictionary Server）是一个开源的**内存数据结构存储系统**，可以用作数据库、缓存和消息代理。它支持多种数据结构，包括字符串、哈希、列表、集合、有序集合等。

### Redis 核心特性

-   **内存存储**：数据主要存储在内存中，访问速度极快
-   **持久化支持**：支持 RDB 和 AOF 两种持久化方式
-   **多数据结构**：支持字符串、列表、集合、哈希、有序集合等
-   **原子性操作**：所有操作都是原子性的
-   **高性能**：单线程模型，避免上下文切换开销
-   **分布式支持**：支持主从复制、分片和集群

---

## Redis 工作原理

### 核心架构

Redis 采用**单线程事件驱动架构**，其工作原理包括以下几个核心方面：

#### 1. 内存存储机制

```
+-------------------+
|    Client 1       |
+-------------------+
         |
+-------------------+
|    Client 2       |
+-------------------+
         |
+-------------------+
|   Redis Server    |
|                   |
|  +--------------+ |
|  |   事件循环    | |
|  +--------------+ |
|  |   内存数据    | |
|  +--------------+ |
|  |   持久化      | |
|  +--------------+ |
+-------------------+
```

#### 2. 事件驱动模型

```java
// Redis 事件处理伪代码
while (!server.shutdown) {
    // 1. 处理文件事件（网络IO）
    aeProcessEvents(server.el, AE_FILE_EVENTS);

    // 2. 处理时间事件（定时任务）
    aeProcessEvents(server.el, AE_TIME_EVENTS);

    // 3. 处理过期键删除
    activeExpireCycle();
}
```

#### 3. I/O 多路复用

Redis 使用 I/O 多路复用技术（epoll/kqueue/select）来处理大量客户端连接：

```c
// I/O多路复用示例
int epoll_fd = epoll_create(1024);

// 添加监听socket
struct epoll_event ev;
ev.events = EPOLLIN;
ev.data.fd = server_fd;
epoll_ctl(epoll_fd, EPOLL_CTL_ADD, server_fd, &ev);

// 事件循环
while (1) {
    int nfds = epoll_wait(epoll_fd, events, MAX_EVENTS, -1);
    for (int i = 0; i < nfds; i++) {
        if (events[i].data.fd == server_fd) {
            // 接受新连接
            accept_new_connection();
        } else {
            // 处理客户端请求
            handle_client_request(events[i].data.fd);
        }
    }
}
```

#### 4. 命令执行流程

```
客户端请求 → 命令解析 → 参数校验 → 执行命令 → 返回结果
     ↓
1. 网络接收命令
2. 协议解析（RESP）
3. 查找命令处理函数
4. 参数类型检查
5. 执行具体操作
6. 生成响应数据
7. 发送给客户端
```

### 详细工作原理

#### 内存存储

-   **快速访问**：数据存储在内存中，读写速度极快（微秒级别）
-   **数据结构优化**：针对不同数据类型使用优化的底层数据结构
-   **内存管理**：采用 jemalloc 内存分配器，减少内存碎片

#### 单线程执行

```java
// Redis 单线程处理示例
public class RedisEventLoop {
    private Queue<Command> commandQueue = new LinkedList<>();

    public void eventLoop() {
        while (running) {
            // 1. 接收网络事件
            List<SocketEvent> events = epoll.wait();

            // 2. 处理每个事件
            for (SocketEvent event : events) {
                if (event.isReadable()) {
                    Command cmd = parseCommand(event.getSocket());
                    commandQueue.offer(cmd);
                }
            }

            // 3. 执行命令
            while (!commandQueue.isEmpty()) {
                Command cmd = commandQueue.poll();
                Result result = executeCommand(cmd);
                sendResponse(cmd.getSocket(), result);
            }

            // 4. 处理定时事件
            processTimeEvents();
        }
    }
}
```

#### 原子性保证

-   **单线程特性**：避免了多线程竞争问题
-   **事务支持**：通过 MULTI/EXEC 提供事务功能
-   **Lua 脚本**：保证脚本执行的原子性

#### 原子性保证

-   **单线程特性**：避免了多线程竞争问题
-   **事务支持**：通过 MULTI/EXEC 提供事务功能
-   **Lua 脚本**：保证脚本执行的原子性

---

## Redis 优势与特性

### Redis vs Memcached

| 特性         | Redis                                                | Memcached                     |
| ------------ | ---------------------------------------------------- | ----------------------------- |
| **数据类型** | 支持多种数据结构（String、Hash、List、Set、ZSet 等） | 仅支持简单的 key-value 字符串 |
| **持久化**   | 支持 RDB 和 AOF 持久化                               | 不支持持久化                  |
| **性能**     | 单线程，性能优秀                                     | 多线程，性能略低于 Redis      |
| **内存使用** | 内存利用率高，支持压缩                               | 内存利用率相对较低            |
| **分布式**   | 原生支持主从复制、集群                               | 需要客户端实现分布式          |
| **事务**     | 支持事务和 Lua 脚本                                  | 不支持事务                    |

### Redis 核心优势

#### 1. 性能优势

```java
// 性能测试示例
public class RedisPerformanceTest {
    public void performanceComparison() {
        // Redis 内存操作：微秒级别
        long start = System.nanoTime();
        jedis.set("key", "value");
        String value = jedis.get("key");
        long redisTime = System.nanoTime() - start;

        // 数据库操作：毫秒级别
        start = System.nanoTime();
        database.insert("key", "value");
        String dbValue = database.select("key");
        long dbTime = System.nanoTime() - start;

        System.out.println("Redis 操作耗时: " + redisTime + " 纳秒");
        System.out.println("数据库操作耗时: " + dbTime + " 纳秒");
        // Redis 通常比数据库快 10-100 倍
    }
}
```

#### 2. 丰富的数据结构

```java
// Redis 数据结构应用示例
public class RedisDataStructures {

    // 字符串：缓存、计数器
    public void stringOperations() {
        jedis.set("user:1001:name", "张三");
        jedis.incr("page:visits"); // 页面访问计数
        jedis.setex("session:abc123", 3600, "session_data"); // 会话缓存
    }

    // 哈希：对象存储
    public void hashOperations() {
        jedis.hset("user:1001", "name", "张三");
        jedis.hset("user:1001", "age", "25");
        jedis.hset("user:1001", "email", "zhangsan@example.com");
    }

    // 列表：消息队列、最新列表
    public void listOperations() {
        // 消息队列
        jedis.lpush("task_queue", "task1", "task2", "task3");
        String task = jedis.rpop("task_queue");

        // 最新文章列表
        jedis.lpush("latest_articles", "article1", "article2");
        List<String> articles = jedis.lrange("latest_articles", 0, 9);
    }

    // 集合：标签、好友关系
    public void setOperations() {
        // 用户标签
        jedis.sadd("user:1001:tags", "java", "redis", "mysql");

        // 共同好友
        jedis.sadd("user:1001:friends", "user:1002", "user:1003");
        jedis.sadd("user:1002:friends", "user:1001", "user:1004");
        Set<String> commonFriends = jedis.sinter("user:1001:friends", "user:1002:friends");
    }

    // 有序集合：排行榜、时间线
    public void zsetOperations() {
        // 游戏排行榜
        jedis.zadd("game_rank", 1000, "player1");
        jedis.zadd("game_rank", 1500, "player2");
        jedis.zadd("game_rank", 800, "player3");

        // 获取排行榜前 10 名
        Set<String> topPlayers = jedis.zrevrange("game_rank", 0, 9);
    }
}
```

### Redis 主要使用场景

#### 1. 缓存系统

```java
@Service
public class UserService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private UserMapper userMapper;

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;

        // 先查缓存
        User user = (User) redisTemplate.opsForValue().get(cacheKey);
        if (user != null) {
            return user;
        }

        // 缓存未命中，查数据库
        user = userMapper.selectById(userId);
        if (user != null) {
            // 写入缓存，设置过期时间
            redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
        }

        return user;
    }
}
```

#### 2. 会话存储

```java
@Component
public class SessionManager {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final int SESSION_TIMEOUT = 3600; // 1小时

    public void createSession(String sessionId, String userId) {
        String sessionKey = "session:" + sessionId;

        // 存储会话信息
        Map<String, String> sessionData = new HashMap<>();
        sessionData.put("userId", userId);
        sessionData.put("loginTime", String.valueOf(System.currentTimeMillis()));

        redisTemplate.opsForHash().putAll(sessionKey, sessionData);
        redisTemplate.expire(sessionKey, SESSION_TIMEOUT, TimeUnit.SECONDS);
    }

    public String getUserId(String sessionId) {
        String sessionKey = "session:" + sessionId;
        return (String) redisTemplate.opsForHash().get(sessionKey, "userId");
    }

    public void destroySession(String sessionId) {
        String sessionKey = "session:" + sessionId;
        redisTemplate.delete(sessionKey);
    }
}
```

#### 3. 消息队列

```java
@Component
public class RedisMessageQueue {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String QUEUE_KEY = "message_queue";

    // 生产者
    public void publishMessage(String message) {
        redisTemplate.opsForList().leftPush(QUEUE_KEY, message);
    }

    // 消费者（阻塞式）
    public String consumeMessage() {
        List<String> result = redisTemplate.opsForList()
            .rightPop(QUEUE_KEY, 10, TimeUnit.SECONDS);
        return result != null && !result.isEmpty() ? result.get(0) : null;
    }

    // 使用 Pub/Sub 模式
    @EventListener
    public void handleMessage(String message) {
        System.out.println("收到消息: " + message);
    }
}
```

#### 4. 排行榜系统

```java
@Service
public class RankingService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String RANKING_KEY = "user_score_ranking";

    // 更新用户分数
    public void updateUserScore(String userId, double score) {
        redisTemplate.opsForZSet().add(RANKING_KEY, userId, score);
    }

    // 获取用户排名
    public Long getUserRank(String userId) {
        return redisTemplate.opsForZSet().reverseRank(RANKING_KEY, userId);
    }

    // 获取排行榜前N名
    public Set<ZSetOperations.TypedTuple<String>> getTopRanking(int count) {
        return redisTemplate.opsForZSet()
            .reverseRangeWithScores(RANKING_KEY, 0, count - 1);
    }

    // 获取用户分数
    public Double getUserScore(String userId) {
        return redisTemplate.opsForZSet().score(RANKING_KEY, userId);
    }
}
```

#### 5. 计数器

```java
@Service
public class CounterService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 页面访问计数
    public void incrementPageView(String pageId) {
        String key = "page:view:" + pageId;
        redisTemplate.opsForValue().increment(key);
    }

    // 获取访问量
    public Long getPageViews(String pageId) {
        String key = "page:view:" + pageId;
        String value = redisTemplate.opsForValue().get(key);
        return value != null ? Long.parseLong(value) : 0L;
    }

    // 限流计数器（滑动窗口）
    public boolean isRateLimited(String userId, int limit, int windowSeconds) {
        String key = "rate_limit:" + userId;
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - windowSeconds * 1000L;

        // 清理过期的计数
        redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStart);

        // 检查当前窗口内的请求数
        Long count = redisTemplate.opsForZSet().count(key, windowStart, currentTime);

        if (count < limit) {
            // 添加当前请求
            redisTemplate.opsForZSet().add(key, String.valueOf(currentTime), currentTime);
            redisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
            return false; // 未限流
        }

        return true; // 被限流
    }
}
```

---

---

## Redis 线程模型

### 单线程 vs 多线程

#### Redis 6.0 之前：纯单线程

```
Client 1 ──┐
Client 2 ──┼─→ Event Loop (单线程) ──→ 命令执行 ──→ 响应
Client 3 ──┘
```

#### Redis 6.0 之后：I/O 多线程

```
Client 1 ──→ I/O Thread 1 ──┐
Client 2 ──→ I/O Thread 2 ──┼─→ Main Thread (命令执行) ──→ Response Threads
Client 3 ──→ I/O Thread 3 ──┘
```

### 为什么 Redis 选择单线程？

#### 1. 避免线程切换开销

```java
// 多线程上下文切换示例
public class ThreadSwitchCost {
    private static volatile boolean flag = true;

    public static void main(String[] args) {
        // 创建多个线程竞争资源
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                while (flag) {
                    // 模拟工作
                    for (int j = 0; j < 1000; j++) {
                        Math.random();
                    }
                    // 主动让出CPU，触发线程切换
                    Thread.yield();
                }
            }).start();
        }

        // 单线程执行相同工作量会更快
    }
}
```

#### 2. 避免锁竞争

```java
// Redis 单线程避免锁竞争
public class RedisNoLockExample {
    private Map<String, String> data = new HashMap<>();

    // 单线程执行，无需加锁
    public void set(String key, String value) {
        data.put(key, value); // 线程安全
    }

    public String get(String key) {
        return data.get(key); // 线程安全
    }
}

// 对比：多线程需要加锁
public class MultiThreadExample {
    private Map<String, String> data = new ConcurrentHashMap<>();

    public void set(String key, String value) {
        data.put(key, value); // 需要内部锁机制
    }

    public String get(String key) {
        return data.get(key); // 需要内部锁机制
    }
}
```

#### 3. CPU 不是瓶颈

Redis 的瓶颈通常在于：

-   **内存带宽**
-   **网络 I/O**
-   **持久化 I/O**

而不是 CPU 计算能力。

### Redis 6.0 的 I/O 多线程

#### 配置示例

```conf
# redis.conf
# 启用I/O多线程
io-threads-do-reads yes

# 设置I/O线程数（建议设置为CPU核心数）
io-threads 4
```

#### I/O 多线程工作流程

```java
// Redis I/O多线程模型（伪代码）
public class RedisIOThreads {

    public void ioMultipleThreadsModel() {
        // 1. 主线程接受连接
        while (running) {
            // 2. 分发读任务到I/O线程
            distributeReadTasks();

            // 3. 等待I/O线程完成读取
            waitForIOThreads();

            // 4. 主线程执行命令（串行）
            executeCommands();

            // 5. 分发写任务到I/O线程
            distributeWriteTasks();

            // 6. 等待I/O线程完成写入
            waitForIOThreads();
        }
    }

    // I/O线程工作函数
    public void ioThreadWork() {
        while (running) {
            // 等待主线程分配任务
            waitForTask();

            // 执行读/写操作
            if (isReadTask()) {
                readFromSocket();
            } else if (isWriteTask()) {
                writeToSocket();
            }

            // 通知主线程完成
            notifyMainThread();
        }
    }
}
```

### 性能对比

#### 单线程 vs 多线程性能测试

```bash
# 测试单线程Redis性能
redis-benchmark -h 127.0.0.1 -p 6379 -c 100 -n 100000 -d 1024

# 结果示例：
# SET: 85000 requests per second
# GET: 90000 requests per second

# 测试多线程Redis性能（Redis 6.0+）
redis-benchmark -h 127.0.0.1 -p 6379 -c 100 -n 100000 -d 1024 --threads 4

# 结果示例：
# SET: 120000 requests per second
# GET: 130000 requests per second
```

---

## Redis 内存管理

### 内存淘汰策略

#### 淘汰策略分类

| 策略                | 描述                                       | 适用场景                 |
| ------------------- | ------------------------------------------ | ------------------------ |
| **volatile-lru**    | 从设置过期时间的键中，淘汰最近最少使用的键 | 有明确过期时间的缓存数据 |
| **volatile-ttl**    | 从设置过期时间的键中，淘汰即将过期的键     | 希望优先淘汰快过期的数据 |
| **volatile-random** | 从设置过期时间的键中，随机淘汰键           | 对淘汰顺序没有特殊要求   |
| **allkeys-lru**     | 从所有键中，淘汰最近最少使用的键           | 数据访问有热点特征       |
| **allkeys-random**  | 从所有键中，随机淘汰键                     | 数据访问比较平均         |
| **no-eviction**     | 不淘汰任何键，写入时返回错误               | 不允许数据丢失的场景     |
| **volatile-lfu**    | 从设置过期时间的键中，淘汰访问频率最低的键 | Redis 4.0+               |
| **allkeys-lfu**     | 从所有键中，淘汰访问频率最低的键           | Redis 4.0+               |

#### 淘汰策略配置

```conf
# redis.conf

# 设置最大内存限制
maxmemory 2gb

# 设置淘汰策略
maxmemory-policy allkeys-lru

# 设置淘汰策略执行的精度
maxmemory-samples 5
```

#### LRU 算法实现

```java
// Redis LRU 算法简化实现
public class RedisLRU {
    private final int maxSize;
    private final LinkedHashMap<String, String> cache;

    public RedisLRU(int maxSize) {
        this.maxSize = maxSize;
        this.cache = new LinkedHashMap<String, String>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
                return size() > maxSize;
            }
        };
    }

    public String get(String key) {
        return cache.get(key); // 自动更新访问顺序
    }

    public void put(String key, String value) {
        cache.put(key, value); // 自动淘汰最久未使用的元素
    }
}
```

### 过期键删除机制

#### 1. 被动删除（惰性删除）

```java
// Redis 惰性删除实现
public class LazyExpiration {
    private Map<String, String> data = new HashMap<>();
    private Map<String, Long> expireTime = new HashMap<>();

    public String get(String key) {
        // 检查是否过期
        if (isExpired(key)) {
            // 立即删除过期键
            data.remove(key);
            expireTime.remove(key);
            return null;
        }
        return data.get(key);
    }

    private boolean isExpired(String key) {
        Long expire = expireTime.get(key);
        return expire != null && expire < System.currentTimeMillis();
    }
}
```

#### 2. 主动删除（定期删除）

```java
// Redis 定期删除实现
public class ActiveExpiration {
    private final ScheduledExecutorService scheduler =
        Executors.newScheduledThreadPool(1);

    public void startActiveExpiration() {
        scheduler.scheduleAtFixedRate(() -> {
            // 每秒执行一次过期检查
            activeExpireCycle();
        }, 1, 1, TimeUnit.SECONDS);
    }

    private void activeExpireCycle() {
        int maxChecks = 20; // 每次最多检查20个键
        int expired = 0;

        for (int i = 0; i < maxChecks; i++) {
            String randomKey = getRandomExpirableKey();
            if (randomKey != null && isExpired(randomKey)) {
                deleteKey(randomKey);
                expired++;
            }
        }

        // 如果过期键比例过高，继续检查
        if (expired > maxChecks / 4) {
            activeExpireCycle(); // 递归调用
        }
    }
}
```

### 内存使用优化

#### 1. 热点数据识别

```java
@Service
public class HotDataManager {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 确保热点数据不过期
    public void ensureHotDataCached() {
        List<String> hotKeys = identifyHotKeys();

        for (String key : hotKeys) {
            if (!redisTemplate.hasKey(key)) {
                // 重新加载热点数据
                Object data = loadFromDatabase(key);
                if (data != null) {
                    // 热点数据设置较长过期时间或不过期
                    redisTemplate.opsForValue().set(key, data, 24, TimeUnit.HOURS);
                }
            }
        }
    }

    private List<String> identifyHotKeys() {
        // 通过访问统计识别热点数据
        // 实际实现可能需要结合业务逻辑和监控数据
        return Arrays.asList("user:popular", "config:system", "data:trending");
    }
}
```

#### 2. 内存使用监控

```java
@Component
public class RedisMemoryMonitor {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Scheduled(fixedRate = 60000) // 每分钟检查一次
    public void monitorMemoryUsage() {
        Properties info = redisTemplate.getConnectionFactory()
            .getConnection().info("memory");

        String usedMemory = info.getProperty("used_memory");
        String maxMemory = info.getProperty("maxmemory");

        if (maxMemory != null && !maxMemory.equals("0")) {
            long used = Long.parseLong(usedMemory);
            long max = Long.parseLong(maxMemory);
            double usageRatio = (double) used / max;

            if (usageRatio > 0.8) {
                // 内存使用超过80%，发出警告
                System.err.println("Redis内存使用率过高: " +
                    String.format("%.2f%%", usageRatio * 100));

                // 可以触发清理或扩容操作
                triggerCleanup();
            }
        }
    }

    private void triggerCleanup() {
        // 清理策略：删除一些非关键缓存
        String pattern = "temp:*";
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}
```

---

---

## Redis 缓存问题与解决方案

### 缓存穿透

#### 问题描述

**缓存穿透**是指查询一个数据库和缓存中都不存在的数据，由于缓存无法命中，每次请求都会直接访问数据库，可能导致数据库压力过大。

```java
// 缓存穿透示例
public class CachePenetration {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private UserMapper userMapper;

    // 存在缓存穿透风险的代码
    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;

        // 1. 查询缓存
        User user = (User) redisTemplate.opsForValue().get(cacheKey);
        if (user != null) {
            return user;
        }

        // 2. 缓存未命中，查询数据库
        user = userMapper.selectById(userId);

        // 3. 如果数据库也没有，缓存不会存储null值
        if (user != null) {
            redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
        }

        return user; // 可能返回null，导致下次请求重复查询
    }
}
```

#### 解决方案

##### 1. 缓存空值

```java
public class CacheNullSolution {

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;

        // 查询缓存，包括空值标记
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached instanceof User ? (User) cached : null;
        }

        // 查询数据库
        User user = userMapper.selectById(userId);

        if (user != null) {
            // 缓存正常数据
            redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
        } else {
            // 缓存空值，设置较短的过期时间
            redisTemplate.opsForValue().set(cacheKey, "NULL", 5, TimeUnit.MINUTES);
        }

        return user;
    }
}
```

##### 2. 布隆过滤器

```java
@Component
public class BloomFilterSolution {

    private BloomFilter<Long> userBloomFilter;

    @PostConstruct
    public void initBloomFilter() {
        // 创建布隆过滤器，预期插入100万个元素，误判率0.01%
        userBloomFilter = BloomFilter.create(
            Funnels.longFunnel(),
            1000000,
            0.0001
        );

        // 将所有存在的用户ID加入布隆过滤器
        List<Long> existingUserIds = userMapper.selectAllUserIds();
        for (Long userId : existingUserIds) {
            userBloomFilter.put(userId);
        }
    }

    public User getUserById(Long userId) {
        // 先检查布隆过滤器
        if (!userBloomFilter.mightContain(userId)) {
            // 布隆过滤器判断不存在，直接返回null
            return null;
        }

        // 布隆过滤器判断可能存在，继续正常的缓存查询流程
        return normalCacheQuery(userId);
    }

    // 当新增用户时，更新布隆过滤器
    public void addUser(User user) {
        userMapper.insert(user);
        userBloomFilter.put(user.getId());
    }
}
```

##### 3. 参数校验

```java
@RestController
public class UserController {

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        // 基本参数校验
        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        // 业务规则校验
        if (userId > MAX_USER_ID) {
            return ResponseEntity.notFound().build();
        }

        User user = userService.getUserById(userId);
        return user != null ?
            ResponseEntity.ok(user) :
            ResponseEntity.notFound().build();
    }
}
```

### 缓存击穿

#### 问题描述

**缓存击穿**是指一个热点 Key 在缓存过期瞬间，有大量请求同时访问该 Key，导致请求直接落到数据库上。

#### 解决方案

##### 1. 分布式锁

```java
@Service
public class CacheBreakdownSolution {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private RedissonClient redissonClient;

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;
        String lockKey = "lock:user:" + userId;

        // 先查缓存
        User user = (User) redisTemplate.opsForValue().get(cacheKey);
        if (user != null) {
            return user;
        }

        // 获取分布式锁
        RLock lock = redissonClient.getLock(lockKey);
        try {
            // 尝试获取锁，等待时间1秒，锁过期时间10秒
            if (lock.tryLock(1, 10, TimeUnit.SECONDS)) {
                // 再次检查缓存（双重检查）
                user = (User) redisTemplate.opsForValue().get(cacheKey);
                if (user != null) {
                    return user;
                }

                // 查询数据库
                user = userMapper.selectById(userId);
                if (user != null) {
                    // 更新缓存
                    redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
                }

                return user;
            } else {
                // 获取锁失败，等待一段时间后重试或返回默认值
                Thread.sleep(100);
                return getUserById(userId);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
```

##### 2. 设置热点数据永不过期

```java
@Service
public class HotDataManager {

    private final Set<String> hotKeys = Set.of(
        "config:system",
        "user:vip_list",
        "data:hot_products"
    );

    public void setHotData(String key, Object value) {
        if (hotKeys.contains(key)) {
            // 热点数据永不过期
            redisTemplate.opsForValue().set(key, value);
        } else {
            // 普通数据设置过期时间
            redisTemplate.opsForValue().set(key, value, 30, TimeUnit.MINUTES);
        }
    }

    // 定期更新热点数据
    @Scheduled(fixedRate = 3600000) // 每小时更新一次
    public void refreshHotData() {
        for (String hotKey : hotKeys) {
            try {
                Object newData = loadDataFromDatabase(hotKey);
                if (newData != null) {
                    redisTemplate.opsForValue().set(hotKey, newData);
                }
            } catch (Exception e) {
                log.error("刷新热点数据失败: {}", hotKey, e);
            }
        }
    }
}
```

##### 3. 逻辑过期

```java
@Component
public class LogicalExpireSolution {

    // 带逻辑过期时间的数据包装类
    @Data
    public static class DataWithExpire<T> {
        private T data;
        private LocalDateTime expireTime;

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expireTime);
        }
    }

    private final ExecutorService refreshExecutor =
        Executors.newFixedThreadPool(10);

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;

        // 获取缓存数据
        DataWithExpire<User> cached = (DataWithExpire<User>)
            redisTemplate.opsForValue().get(cacheKey);

        if (cached == null) {
            // 缓存未命中，同步加载
            return loadAndCache(userId);
        }

        if (!cached.isExpired()) {
            // 数据未过期，直接返回
            return cached.getData();
        }

        // 数据已过期，异步刷新
        refreshExecutor.submit(() -> {
            String lockKey = "refresh:user:" + userId;
            // 使用简单的Redis锁避免重复刷新
            Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, "1", Duration.ofMinutes(5));

            if (Boolean.TRUE.equals(acquired)) {
                try {
                    loadAndCache(userId);
                } finally {
                    redisTemplate.delete(lockKey);
                }
            }
        });

        // 返回过期数据（比返回null更好的用户体验）
        return cached.getData();
    }

    private User loadAndCache(Long userId) {
        User user = userMapper.selectById(userId);
        if (user != null) {
            DataWithExpire<User> dataWithExpire = new DataWithExpire<>();
            dataWithExpire.setData(user);
            dataWithExpire.setExpireTime(LocalDateTime.now().plusMinutes(30));

            // 数据永不过期，通过逻辑时间控制
            redisTemplate.opsForValue().set("user:" + userId, dataWithExpire);
        }
        return user;
    }
}
```

### 缓存雪崩

#### 问题描述

**缓存雪崩**是指缓存中大量数据同时过期，或者缓存服务整体宕机，导致大量请求直接落到数据库上，可能压垮数据库。

#### 解决方案

##### 1. 过期时间随机化

```java
@Service
public class CacheAvalancheSolution {

    private final Random random = new Random();

    public void setCacheWithRandomExpire(String key, Object value, int baseExpireMinutes) {
        // 基础过期时间 + 随机时间（避免同时过期）
        int randomExpire = baseExpireMinutes + random.nextInt(10); // 增加0-10分钟随机时间
        redisTemplate.opsForValue().set(key, value, randomExpire, TimeUnit.MINUTES);
    }

    // 批量数据预热
    public void warmUpCache() {
        List<Long> userIds = userMapper.selectHotUserIds();

        for (Long userId : userIds) {
            User user = userMapper.selectById(userId);
            if (user != null) {
                String cacheKey = "user:" + userId;
                // 使用随机过期时间
                setCacheWithRandomExpire(cacheKey, user, 30);
            }
        }
    }
}
```

##### 2. Redis 高可用集群

```yaml
# Redis 哨兵配置
spring:
    redis:
        sentinel:
            master: mymaster
            nodes:
                - 192.168.1.10:26379
                - 192.168.1.11:26379
                - 192.168.1.12:26379
        password: your_password
        timeout: 2000ms
        lettuce:
            pool:
                max-active: 20
                max-idle: 10
                min-idle: 5
```

```java
@Configuration
public class RedisHAConfig {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisSentinelConfiguration sentinelConfig =
            new RedisSentinelConfiguration()
                .master("mymaster")
                .sentinel("192.168.1.10", 26379)
                .sentinel("192.168.1.11", 26379)
                .sentinel("192.168.1.12", 26379);

        LettuceClientConfiguration clientConfig =
            LettuceClientConfiguration.builder()
                .commandTimeout(Duration.ofSeconds(2))
                .shutdownTimeout(Duration.ZERO)
                .build();

        return new LettuceConnectionFactory(sentinelConfig, clientConfig);
    }
}
```

##### 3. 多级缓存

```java
@Service
public class MultiLevelCacheService {

    // L1: 本地缓存
    private final Cache<String, Object> localCache = Caffeine.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(5, TimeUnit.MINUTES)
        .build();

    // L2: Redis 缓存
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;

        // 1. 先查本地缓存
        User user = (User) localCache.getIfPresent(cacheKey);
        if (user != null) {
            return user;
        }

        // 2. 查Redis缓存
        user = (User) redisTemplate.opsForValue().get(cacheKey);
        if (user != null) {
            // 更新本地缓存
            localCache.put(cacheKey, user);
            return user;
        }

        // 3. 查数据库
        user = userMapper.selectById(userId);
        if (user != null) {
            // 更新两级缓存
            localCache.put(cacheKey, user);
            redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
        }

        return user;
    }
}
```

##### 4. 熔断降级

```java
@Component
public class CacheCircuitBreaker {

    private final CircuitBreaker circuitBreaker = CircuitBreaker.ofDefaults("redis");

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public User getUserById(Long userId) {
        return circuitBreaker.executeSupplier(() -> {
            // Redis 查询操作
            return (User) redisTemplate.opsForValue().get("user:" + userId);
        }).recover(throwable -> {
            // Redis 不可用时的降级策略
            log.warn("Redis不可用，降级到数据库查询", throwable);
            return userMapper.selectById(userId);
        });
    }
}
```

### 数据一致性问题

#### 缓存与数据库不一致的场景

##### 1. 先更新数据库，再删除缓存

```java
@Service
@Transactional
public class CacheConsistencyService {

    public void updateUser(User user) {
        String cacheKey = "user:" + user.getId();

        try {
            // 1. 先更新数据库
            userMapper.updateById(user);

            // 2. 再删除缓存
            redisTemplate.delete(cacheKey);

        } catch (Exception e) {
            // 数据库更新失败，事务回滚
            log.error("更新用户失败", e);
            throw e;
        }
    }
}
```

##### 2. 使用 Canal 监听 Binlog

```java
@Component
public class CanalCacheSync {

    @EventListener
    public void handleDatabaseChange(CanalEntry.Entry entry) {
        if (entry.getEntryType() == CanalEntry.EntryType.ROWDATA) {
            CanalEntry.RowChange rowChange = CanalEntry.RowChange.parseFrom(entry.getStoreValue());

            String tableName = entry.getHeader().getTableName();
            CanalEntry.EventType eventType = rowChange.getEventType();

            for (CanalEntry.RowData rowData : rowChange.getRowDatasList()) {
                if ("user".equals(tableName)) {
                    handleUserTableChange(eventType, rowData);
                }
            }
        }
    }

    private void handleUserTableChange(CanalEntry.EventType eventType, CanalEntry.RowData rowData) {
        String userId = null;

        // 获取用户ID
        for (CanalEntry.Column column : rowData.getAfterColumnsList()) {
            if ("id".equals(column.getName())) {
                userId = column.getValue();
                break;
            }
        }

        if (userId != null) {
            String cacheKey = "user:" + userId;

            switch (eventType) {
                case UPDATE:
                case DELETE:
                    // 删除缓存
                    redisTemplate.delete(cacheKey);
                    break;
                default:
                    break;
            }
        }
    }
}
```

##### 3. 延时双删策略

```java
@Service
public class DelayedDoubleDeleteService {

    @Async
    public void updateUserWithDelayedDoubleDelete(User user) {
        String cacheKey = "user:" + user.getId();

        try {
            // 1. 先删除缓存
            redisTemplate.delete(cacheKey);

            // 2. 更新数据库
            userMapper.updateById(user);

            // 3. 延时再次删除缓存
            CompletableFuture.delayedExecutor(500, TimeUnit.MILLISECONDS)
                .execute(() -> redisTemplate.delete(cacheKey));

        } catch (Exception e) {
            log.error("用户更新失败", e);
        }
    }
}
```

---

---

## Redis 持久化机制

### 持久化概述

Redis 提供两种持久化方式：**RDB（Redis Database）** 和 **AOF（Append Only File）**，可以单独使用或组合使用。

### RDB 持久化

#### RDB 工作原理

RDB 是把当前内存中的数据集快照写入磁盘，恢复时是将快照文件直接读到内存里。

```java
// RDB 持久化过程模拟
public class RDBPersistence {

    public void saveRDB() {
        // 1. fork 子进程
        int pid = fork();

        if (pid == 0) {
            // 子进程执行持久化
            try {
                // 2. 遍历内存中的所有数据
                Map<String, Object> allData = getAllMemoryData();

                // 3. 写入临时文件
                File tempFile = new File("dump_temp.rdb");
                try (ObjectOutputStream oos = new ObjectOutputStream(
                    new FileOutputStream(tempFile))) {
                    oos.writeObject(allData);
                }

                // 4. 原子性重命名
                tempFile.renameTo(new File("dump.rdb"));

            } catch (Exception e) {
                log.error("RDB持久化失败", e);
            } finally {
                // 子进程退出
                System.exit(0);
            }
        } else {
            // 父进程继续处理客户端请求
            continueHandlingClients();
        }
    }
}
```

#### RDB 配置

```conf
# redis.conf

# RDB文件名
dbfilename dump.rdb

# RDB文件保存路径
dir /var/lib/redis

# 自动触发RDB的条件
save 900 1      # 900秒内至少1个key发生变化
save 300 10     # 300秒内至少10个key发生变化
save 60 10000   # 60秒内至少10000个key发生变化

# RDB文件压缩
rdbcompression yes

# RDB文件校验
rdbchecksum yes

# 后台保存失败时停止写入
stop-writes-on-bgsave-error yes
```

#### RDB 手动触发

```bash
# 阻塞式保存（会阻塞Redis服务）
redis-cli SAVE

# 非阻塞式保存（后台执行）
redis-cli BGSAVE

# 查看最后一次保存时间
redis-cli LASTSAVE
```

### AOF 持久化

#### AOF 工作原理

AOF 持久化是通过保存 Redis 服务器所执行的写命令来记录数据库状态。

```java
// AOF 持久化过程模拟
public class AOFPersistence {

    private FileWriter aofFile;

    public void executeCommand(String command) {
        // 1. 执行命令
        Object result = processCommand(command);

        // 2. 将命令写入AOF缓冲区
        appendToAOFBuffer(command);

        // 3. 根据同步策略写入磁盘
        flushAOFBuffer();

        // 4. 返回结果给客户端
        sendResult(result);
    }

    private void appendToAOFBuffer(String command) {
        // 转换为RESP协议格式
        String respCommand = toRESPFormat(command);
        aofBuffer.append(respCommand);
    }

    private void flushAOFBuffer() {
        try {
            switch (aofSyncPolicy) {
                case ALWAYS:
                    // 每个命令都同步到磁盘
                    aofFile.write(aofBuffer.toString());
                    aofFile.flush();
                    aofBuffer.setLength(0);
                    break;

                case EVERYSEC:
                    // 每秒同步一次
                    if (shouldSyncThisSecond()) {
                        aofFile.write(aofBuffer.toString());
                        aofFile.flush();
                        aofBuffer.setLength(0);
                    }
                    break;

                case NO:
                    // 由操作系统决定何时同步
                    aofFile.write(aofBuffer.toString());
                    aofBuffer.setLength(0);
                    break;
            }
        } catch (IOException e) {
            log.error("AOF写入失败", e);
        }
    }
}
```

#### AOF 配置

```conf
# redis.conf

# 启用AOF
appendonly yes

# AOF文件名
appendfilename "appendonly.aof"

# AOF同步策略
appendfsync everysec   # always | everysec | no

# AOF重写期间是否同步
no-appendfsync-on-rewrite no

# 自动AOF重写触发条件
auto-aof-rewrite-percentage 100  # AOF文件增长100%时触发重写
auto-aof-rewrite-min-size 64mb   # AOF文件至少64MB时才考虑重写

# AOF文件损坏时的处理
aof-load-truncated yes
```

#### AOF 重写机制

```java
// AOF 重写实现
public class AOFRewrite {

    public void rewriteAOF() {
        // 1. fork子进程
        int pid = fork();

        if (pid == 0) {
            // 子进程执行AOF重写
            try {
                File newAOF = new File("appendonly_temp.aof");

                try (FileWriter writer = new FileWriter(newAOF)) {
                    // 2. 遍历所有数据库
                    for (int dbIndex = 0; dbIndex < 16; dbIndex++) {
                        Database db = getDatabase(dbIndex);

                        if (!db.isEmpty()) {
                            writer.write("SELECT " + dbIndex + "\r\n");

                            // 3. 为每个key生成一条命令
                            for (Entry<String, Object> entry : db.entrySet()) {
                                String key = entry.getKey();
                                Object value = entry.getValue();

                                String command = generateCommand(key, value);
                                writer.write(command);

                                // 添加过期时间
                                Long expireTime = db.getExpireTime(key);
                                if (expireTime != null) {
                                    writer.write("PEXPIREAT " + key + " " + expireTime + "\r\n");
                                }
                            }
                        }
                    }
                }

                // 4. 原子性替换AOF文件
                newAOF.renameTo(new File("appendonly.aof"));

            } catch (Exception e) {
                log.error("AOF重写失败", e);
            } finally {
                System.exit(0);
            }
        } else {
            // 父进程继续服务，并将新命令写入重写缓冲区
            continueWithRewriteBuffer();
        }
    }

    private String generateCommand(String key, Object value) {
        if (value instanceof String) {
            return "SET " + key + " " + value + "\r\n";
        } else if (value instanceof List) {
            StringBuilder sb = new StringBuilder();
            for (Object item : (List<?>) value) {
                sb.append("RPUSH ").append(key).append(" ").append(item).append("\r\n");
            }
            return sb.toString();
        }
        // 处理其他数据类型...
        return "";
    }
}
```

### 混合持久化（Redis 4.0+）

#### 混合持久化配置

```conf
# 启用混合持久化
aof-use-rdb-preamble yes
```

#### 混合持久化原理

```java
public class HybridPersistence {

    public void hybridAOFRewrite() {
        // 1. 生成RDB格式的数据快照
        byte[] rdbData = generateRDBSnapshot();

        // 2. 获取重写期间的增量AOF命令
        List<String> incrementalCommands = getIncrementalAOFCommands();

        // 3. 写入新的AOF文件
        try (FileOutputStream fos = new FileOutputStream("appendonly_new.aof")) {
            // 先写入RDB数据
            fos.write(rdbData);

            // 再追加AOF命令
            for (String command : incrementalCommands) {
                fos.write(command.getBytes());
            }
        }

        // 4. 原子性替换
        new File("appendonly_new.aof").renameTo(new File("appendonly.aof"));
    }
}
```

### 持久化性能对比

#### 性能测试

```java
@Component
public class PersistencePerformanceTest {

    @Test
    public void testPersistencePerformance() {
        // 测试RDB性能
        long rdbStart = System.currentTimeMillis();
        executeRDBSave();
        long rdbTime = System.currentTimeMillis() - rdbStart;

        // 测试AOF性能
        long aofStart = System.currentTimeMillis();
        executeAOFWrite();
        long aofTime = System.currentTimeMillis() - aofStart;

        System.out.println("RDB保存耗时: " + rdbTime + "ms");
        System.out.println("AOF写入耗时: " + aofTime + "ms");
    }
}
```

| 特性             | RDB      | AOF    | 混合持久化 |
| ---------------- | -------- | ------ | ---------- |
| **启动恢复速度** | 快       | 慢     | 较快       |
| **数据完整性**   | 可能丢失 | 更完整 | 较完整     |
| **文件大小**     | 小       | 大     | 中等       |
| **兼容性**       | 好       | 好     | 需要 4.0+  |

### 持久化最佳实践

#### 1. 生产环境配置建议

```conf
# 推荐的生产环境配置
save 900 1
save 300 10
save 60 10000

appendonly yes
appendfsync everysec
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 开启混合持久化（如果Redis版本支持）
aof-use-rdb-preamble yes
```

#### 2. 主从配置建议

```java
@Configuration
public class RedisPersistenceConfig {

    // 主节点配置
    public void configureMaster() {
        // 主节点关闭持久化，专注处理写入
        // save ""  # 禁用RDB
        // appendonly no  # 禁用AOF
    }

    // 从节点配置
    public void configureSlave() {
        // 从节点开启持久化
        // save 900 1
        // appendonly yes
        // appendfsync everysec
    }
}
```

#### 3. 容灾恢复策略

```java
@Service
public class RedisDisasterRecovery {

    public void recoverFromRDB(String rdbFile) {
        try {
            // 1. 停止Redis服务
            stopRedisService();

            // 2. 替换RDB文件
            Files.copy(Paths.get(rdbFile), Paths.get("/var/lib/redis/dump.rdb"));

            // 3. 重启Redis服务
            startRedisService();

            log.info("从RDB文件恢复完成");
        } catch (Exception e) {
            log.error("RDB恢复失败", e);
        }
    }

    public void recoverFromAOF(String aofFile) {
        try {
            // 1. 停止Redis服务
            stopRedisService();

            // 2. 替换AOF文件
            Files.copy(Paths.get(aofFile), Paths.get("/var/lib/redis/appendonly.aof"));

            // 3. 修复AOF文件（如果需要）
            repairAOFFile();

            // 4. 重启Redis服务
            startRedisService();

            log.info("从AOF文件恢复完成");
        } catch (Exception e) {
            log.error("AOF恢复失败", e);
        }
    }

    private void repairAOFFile() {
        // 使用redis-check-aof修复损坏的AOF文件
        try {
            Process process = Runtime.getRuntime().exec(
                "redis-check-aof --fix /var/lib/redis/appendonly.aof");
            process.waitFor();
        } catch (Exception e) {
            log.error("AOF文件修复失败", e);
        }
    }
}
```

---

---

## Redis 分布式应用

### 分布式锁

#### 基本实现

```java
@Component
public class RedisDistributedLock {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String LOCK_PREFIX = "lock:";
    private static final int DEFAULT_EXPIRE_TIME = 30; // 30秒

    /**
     * 尝试获取分布式锁
     * @param lockKey 锁的key
     * @param requestId 请求标识（用于释放锁时验证）
     * @param expireTime 过期时间（秒）
     * @return 是否获取成功
     */
    public boolean tryLock(String lockKey, String requestId, int expireTime) {
        String key = LOCK_PREFIX + lockKey;

        // 使用SET NX EX命令，保证原子性
        Boolean result = redisTemplate.opsForValue()
            .setIfAbsent(key, requestId, Duration.ofSeconds(expireTime));

        return Boolean.TRUE.equals(result);
    }

    /**
     * 释放分布式锁
     * @param lockKey 锁的key
     * @param requestId 请求标识
     * @return 是否释放成功
     */
    public boolean releaseLock(String lockKey, String requestId) {
        String key = LOCK_PREFIX + lockKey;

        // 使用Lua脚本保证释放锁的原子性
        String script =
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
            "  return redis.call('del', KEYS[1]) " +
            "else " +
            "  return 0 " +
            "end";

        Long result = redisTemplate.execute(
            new DefaultRedisScript<>(script, Long.class),
            Collections.singletonList(key),
            requestId
        );

        return Long.valueOf(1).equals(result);
    }
}
```

#### 可重入锁实现

```java
@Component
public class RedisReentrantLock {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final ThreadLocal<Map<String, Integer>> lockCount =
        new ThreadLocal<Map<String, Integer>>() {
            @Override
            protected Map<String, Integer> initialValue() {
                return new HashMap<>();
            }
        };

    public boolean lock(String lockKey, String requestId, int expireTime) {
        Map<String, Integer> counts = lockCount.get();
        Integer count = counts.get(lockKey);

        if (count != null && count > 0) {
            // 已经持有锁，重入计数+1
            counts.put(lockKey, count + 1);
            return true;
        }

        // 尝试获取锁
        boolean acquired = tryLock(lockKey, requestId, expireTime);
        if (acquired) {
            counts.put(lockKey, 1);
        }

        return acquired;
    }

    public boolean unlock(String lockKey, String requestId) {
        Map<String, Integer> counts = lockCount.get();
        Integer count = counts.get(lockKey);

        if (count == null || count <= 0) {
            return false;
        }

        if (count > 1) {
            // 重入锁，计数-1
            counts.put(lockKey, count - 1);
            return true;
        } else {
            // 完全释放锁
            counts.remove(lockKey);
            return releaseLock(lockKey, requestId);
        }
    }
}
```

#### Redlock 算法

```java
@Component
public class RedlockImplementation {

    private final List<RedisTemplate<String, String>> redisInstances;
    private final int quorum; // 大多数节点数量

    public RedlockImplementation(List<RedisTemplate<String, String>> instances) {
        this.redisInstances = instances;
        this.quorum = instances.size() / 2 + 1;
    }

    public boolean acquireRedlock(String resource, String value, long ttl) {
        long startTime = System.currentTimeMillis();
        long validityTime = ttl - (System.currentTimeMillis() - startTime) - 100; // 留100ms时间

        int successCount = 0;

        // 在所有Redis实例上尝试获取锁
        for (RedisTemplate<String, String> redis : redisInstances) {
            if (tryLockOnInstance(redis, resource, value, ttl)) {
                successCount++;
            }
        }

        // 检查是否获得了大多数节点的锁
        if (successCount >= quorum && validityTime > 0) {
            return true;
        } else {
            // 释放已获得的锁
            releaseRedlock(resource, value);
            return false;
        }
    }

    private boolean tryLockOnInstance(RedisTemplate<String, String> redis,
                                    String resource, String value, long ttl) {
        try {
            Boolean result = redis.opsForValue()
                .setIfAbsent(resource, value, Duration.ofMillis(ttl));
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            return false;
        }
    }

    public void releaseRedlock(String resource, String value) {
        String script =
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
            "  return redis.call('del', KEYS[1]) " +
            "else " +
            "  return 0 " +
            "end";

        for (RedisTemplate<String, String> redis : redisInstances) {
            try {
                redis.execute(
                    new DefaultRedisScript<>(script, Long.class),
                    Collections.singletonList(resource),
                    value
                );
            } catch (Exception e) {
                // 忽略释放锁时的异常
            }
        }
    }
}
```

### 消息队列

#### List 实现消息队列

```java
@Component
public class RedisListQueue {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 生产者
    public void publishMessage(String queueName, String message) {
        redisTemplate.opsForList().leftPush(queueName, message);
    }

    // 消费者（非阻塞）
    public String consumeMessage(String queueName) {
        return redisTemplate.opsForList().rightPop(queueName);
    }

    // 消费者（阻塞）
    public String blockingConsumeMessage(String queueName, long timeout) {
        List<String> result = redisTemplate.opsForList()
            .rightPop(queueName, Duration.ofSeconds(timeout));
        return result != null && !result.isEmpty() ? result.get(0) : null;
    }

    // 获取队列长度
    public Long getQueueSize(String queueName) {
        return redisTemplate.opsForList().size(queueName);
    }
}
```

#### Stream 实现消息队列（推荐）

```java
@Component
public class RedisStreamQueue {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 发布消息
    public String publishMessage(String streamKey, Map<String, String> message) {
        RecordId recordId = redisTemplate.opsForStream()
            .add(StreamRecords.newRecord()
                .ofMap(message)
                .withStreamKey(streamKey));
        return recordId.getValue();
    }

    // 消费消息（消费者组）
    @EventListener
    public void consumeMessages() {
        String streamKey = "user_events";
        String groupName = "user_service";
        String consumerName = "consumer_1";

        try {
            // 创建消费者组（如果不存在）
            redisTemplate.opsForStream()
                .createGroup(streamKey, ReadOffset.from("0"), groupName);
        } catch (Exception e) {
            // 消费者组已存在
        }

        // 消费未确认的消息
        List<MapRecord<String, Object, Object>> pendingMessages =
            redisTemplate.opsForStream().read(
                Consumer.from(groupName, consumerName),
                StreamReadOptions.empty().count(10),
                StreamOffset.create(streamKey, ReadOffset.from("0-0"))
            );

        // 消费新消息
        List<MapRecord<String, Object, Object>> newMessages =
            redisTemplate.opsForStream().read(
                Consumer.from(groupName, consumerName),
                StreamReadOptions.empty().count(10).block(Duration.ofSeconds(5)),
                StreamOffset.create(streamKey, ReadOffset.lastConsumed())
            );

        // 处理消息
        processMessages(streamKey, groupName, pendingMessages);
        processMessages(streamKey, groupName, newMessages);
    }

    private void processMessages(String streamKey, String groupName,
                               List<MapRecord<String, Object, Object>> messages) {
        for (MapRecord<String, Object, Object> message : messages) {
            try {
                // 处理消息
                handleMessage(message);

                // 确认消息
                redisTemplate.opsForStream().acknowledge(streamKey, groupName, message.getId());
            } catch (Exception e) {
                log.error("处理消息失败: {}", message.getId(), e);
            }
        }
    }
}
```

#### Pub/Sub 发布订阅

```java
@Component
public class RedisPubSub {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // 发布消息
    public void publishMessage(String channel, String message) {
        redisTemplate.convertAndSend(channel, message);
    }

    // 订阅消息
    @EventListener
    public void subscribeMessages() {
        RedisMessageListenerContainer container =
            new RedisMessageListenerContainer();
        container.setConnectionFactory(redisTemplate.getConnectionFactory());

        container.addMessageListener(new MessageListener() {
            @Override
            public void onMessage(Message message, byte[] pattern) {
                String channel = new String(message.getChannel());
                String body = new String(message.getBody());

                System.out.println("收到消息 [" + channel + "]: " + body);
                handleMessage(channel, body);
            }
        }, new ChannelTopic("user_events"));

        container.start();
    }

    private void handleMessage(String channel, String message) {
        // 处理业务逻辑
        switch (channel) {
            case "user_events":
                processUserEvent(message);
                break;
            case "order_events":
                processOrderEvent(message);
                break;
            default:
                log.warn("未知频道: {}", channel);
        }
    }
}
```

### 限流器实现

#### 滑动窗口限流

```java
@Component
public class SlidingWindowRateLimiter {

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * 滑动窗口限流
     * @param key 限流key
     * @param limit 限制次数
     * @param windowSizeSeconds 窗口大小（秒）
     * @return 是否允许通过
     */
    public boolean isAllowed(String key, int limit, int windowSizeSeconds) {
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - windowSizeSeconds * 1000L;

        String script =
            "local key = KEYS[1] " +
            "local window_start = ARGV[1] " +
            "local window_end = ARGV[2] " +
            "local limit = tonumber(ARGV[3]) " +

            // 删除窗口外的记录
            "redis.call('zremrangebyscore', key, 0, window_start) " +

            // 统计当前窗口内的请求数
            "local current_count = redis.call('zcard', key) " +

            "if current_count < limit then " +
            "  redis.call('zadd', key, window_end, window_end) " +
            "  redis.call('expire', key, " + (windowSizeSeconds + 1) + ") " +
            "  return 1 " +
            "else " +
            "  return 0 " +
            "end";

        Long result = redisTemplate.execute(
            new DefaultRedisScript<>(script, Long.class),
            Collections.singletonList(key),
            String.valueOf(windowStart),
            String.valueOf(currentTime),
            String.valueOf(limit)
        );

        return Long.valueOf(1).equals(result);
    }
}
```

#### 令牌桶限流

```java
@Component
public class TokenBucketRateLimiter {

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * 令牌桶限流
     * @param key 限流key
     * @param capacity 桶容量
     * @param refillRate 令牌补充速率（每秒）
     * @param requestTokens 请求令牌数
     * @return 是否允许通过
     */
    public boolean isAllowed(String key, int capacity, int refillRate, int requestTokens) {
        String script =
            "local key = KEYS[1] " +
            "local capacity = tonumber(ARGV[1]) " +
            "local refill_rate = tonumber(ARGV[2]) " +
            "local request_tokens = tonumber(ARGV[3]) " +
            "local current_time = tonumber(ARGV[4]) " +

            "local bucket = redis.call('hmget', key, 'tokens', 'last_refill') " +
            "local tokens = tonumber(bucket[1]) or capacity " +
            "local last_refill = tonumber(bucket[2]) or current_time " +

            // 计算需要补充的令牌数
            "local time_passed = current_time - last_refill " +
            "local tokens_to_add = math.floor(time_passed * refill_rate / 1000) " +
            "tokens = math.min(capacity, tokens + tokens_to_add) " +

            "if tokens >= request_tokens then " +
            "  tokens = tokens - request_tokens " +
            "  redis.call('hmset', key, 'tokens', tokens, 'last_refill', current_time) " +
            "  redis.call('expire', key, 3600) " +
            "  return 1 " +
            "else " +
            "  redis.call('hmset', key, 'tokens', tokens, 'last_refill', current_time) " +
            "  redis.call('expire', key, 3600) " +
            "  return 0 " +
            "end";

        Long result = redisTemplate.execute(
            new DefaultRedisScript<>(script, Long.class),
            Collections.singletonList(key),
            String.valueOf(capacity),
            String.valueOf(refillRate),
            String.valueOf(requestTokens),
            String.valueOf(System.currentTimeMillis())
        );

        return Long.valueOf(1).equals(result);
    }
}
```

---

---

## Redis 集群与高可用

### 主从复制

#### 主从复制配置

```conf
# 从节点配置
replicaof 192.168.1.100 6379
masterauth password123

# 主从复制设置
replica-read-only yes
replica-serve-stale-data yes
```

#### 主从复制原理

```java
// 主从复制过程模拟
public class RedisMasterSlaveReplication {

    public void startReplication() {
        // 1. 从节点连接主节点
        connectToMaster();

        // 2. 发送PING命令
        sendPingToMaster();

        // 3. 身份验证
        authenticateWithMaster();

        // 4. 发送端口信息
        sendPortToMaster();

        // 5. 发送IP地址
        sendIPToMaster();

        // 6. 发送CAPA
        sendCapabilityToMaster();

        // 7. 发送PSYNC命令开始同步
        sendPSyncCommand();
    }

    private void sendPSyncCommand() {
        // 全量同步或增量同步
        if (isFirstTimeReplication()) {
            // 全量同步
            fullResynchronization();
        } else {
            // 增量同步
            partialResynchronization();
        }
    }

    private void fullResynchronization() {
        // 1. 主节点执行BGSAVE生成RDB
        masterExecuteBGSave();

        // 2. 主节点将RDB发送给从节点
        receiveRDBFromMaster();

        // 3. 从节点加载RDB文件
        loadRDBFile();

        // 4. 主节点发送缓冲区中的写命令
        receiveBufferedCommands();
    }

    private void partialResynchronization() {
        // 基于复制偏移量进行增量同步
        String runId = getCurrentRunId();
        long offset = getCurrentOffset();

        // 发送PSYNC runid offset
        sendPSyncWithOffset(runId, offset);

        // 接收增量数据
        receiveIncrementalData();
    }
}
```

#### 主从切换处理

```java
@Component
public class MasterSlaveFailover {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @EventListener
    public void handleMasterFailure() {
        // 检测主节点状态
        if (!isMasterAlive()) {
            // 执行主从切换
            promoteSlaveToMaster();
        }
    }

    private boolean isMasterAlive() {
        try {
            redisTemplate.opsForValue().get("heartbeat");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void promoteSlaveToMaster() {
        // 1. 选择最佳从节点
        String bestSlave = selectBestSlave();

        // 2. 提升为主节点
        promoteToMaster(bestSlave);

        // 3. 重新配置其他从节点
        reconfigureSlaves(bestSlave);

        // 4. 更新应用配置
        updateApplicationConfig(bestSlave);
    }
}
```

### Redis Sentinel

#### Sentinel 配置

```conf
# sentinel.conf
port 26379
sentinel monitor mymaster 192.168.1.100 6379 2
sentinel auth-pass mymaster password123
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 15000
```

#### Sentinel 集成

```java
@Configuration
public class RedisSentinelConfig {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisSentinelConfiguration sentinelConfig =
            new RedisSentinelConfiguration()
                .master("mymaster")
                .sentinel("192.168.1.10", 26379)
                .sentinel("192.168.1.11", 26379)
                .sentinel("192.168.1.12", 26379);

        return new LettuceConnectionFactory(sentinelConfig);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            LettuceConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
```

#### Sentinel 客户端实现

```java
@Service
public class RedisSentinelService {

    private JedisSentinelPool sentinelPool;

    @PostConstruct
    public void initSentinelPool() {
        Set<String> sentinels = new HashSet<>();
        sentinels.add("192.168.1.10:26379");
        sentinels.add("192.168.1.11:26379");
        sentinels.add("192.168.1.12:26379");

        sentinelPool = new JedisSentinelPool("mymaster", sentinels);
    }

    public String get(String key) {
        try (Jedis jedis = sentinelPool.getResource()) {
            return jedis.get(key);
        }
    }

    public void set(String key, String value) {
        try (Jedis jedis = sentinelPool.getResource()) {
            jedis.set(key, value);
        }
    }

    // 获取当前主节点信息
    public HostAndPort getCurrentMaster() {
        return sentinelPool.getCurrentHostMaster();
    }
}
```

### Redis Cluster

#### Cluster 配置

```conf
# redis-cluster.conf
port 7000
cluster-enabled yes
cluster-config-file nodes-7000.conf
cluster-node-timeout 5000
appendonly yes

# 其他节点类似配置，修改端口号
```

#### Cluster 集群搭建

```bash
#!/bin/bash
# 启动6个Redis实例
for port in 7000 7001 7002 7003 7004 7005; do
    redis-server redis-${port}.conf
done

# 创建集群
redis-cli --cluster create \
    127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
    127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
    --cluster-replicas 1
```

#### Cluster 客户端实现

```java
@Configuration
public class RedisClusterConfig {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        List<RedisNode> nodes = Arrays.asList(
            new RedisNode("192.168.1.10", 7000),
            new RedisNode("192.168.1.11", 7001),
            new RedisNode("192.168.1.12", 7002),
            new RedisNode("192.168.1.13", 7003),
            new RedisNode("192.168.1.14", 7004),
            new RedisNode("192.168.1.15", 7005)
        );

        RedisClusterConfiguration clusterConfig =
            new RedisClusterConfiguration();
        clusterConfig.setClusterNodes(nodes);
        clusterConfig.setMaxRedirects(3);

        return new LettuceConnectionFactory(clusterConfig);
    }
}
```

#### 数据分片算法

```java
public class RedisClusterSlot {

    private static final int SLOT_COUNT = 16384;

    // 计算key对应的槽位
    public static int calculateSlot(String key) {
        // 如果key包含{}，只对{}内容计算CRC16
        int start = key.indexOf('{');
        if (start != -1) {
            int end = key.indexOf('}', start + 1);
            if (end != -1 && end != start + 1) {
                key = key.substring(start + 1, end);
            }
        }

        return CRC16.checksum(key.getBytes()) % SLOT_COUNT;
    }

    // CRC16算法实现
    public static class CRC16 {
        private static final int[] CRC16_TABLE = {
            // CRC16查找表...
        };

        public static int checksum(byte[] data) {
            int crc = 0;
            for (byte b : data) {
                crc = (crc << 8) ^ CRC16_TABLE[((crc >> 8) ^ (b & 0xFF)) & 0xFF];
            }
            return crc & 0xFFFF;
        }
    }
}
```

#### Cluster 扩容缩容

```java
@Service
public class RedisClusterManager {

    // 添加新节点
    public void addNode(String newNodeHost, int newNodePort) {
        try {
            // 1. 将新节点加入集群
            ProcessBuilder pb = new ProcessBuilder(
                "redis-cli", "--cluster", "add-node",
                newNodeHost + ":" + newNodePort,
                "existing-node:7000"
            );
            Process process = pb.start();
            process.waitFor();

            // 2. 重新分片
            reshardCluster(newNodeHost, newNodePort);

        } catch (Exception e) {
            log.error("添加节点失败", e);
        }
    }

    // 重新分片
    private void reshardCluster(String newNodeHost, int newNodePort) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                "redis-cli", "--cluster", "reshard",
                newNodeHost + ":" + newNodePort,
                "--cluster-slots", "1365", // 分配的槽位数
                "--cluster-yes"
            );
            Process process = pb.start();
            process.waitFor();
        } catch (Exception e) {
            log.error("重新分片失败", e);
        }
    }

    // 移除节点
    public void removeNode(String nodeId) {
        try {
            // 1. 先迁移槽位
            migrateSlots(nodeId);

            // 2. 移除节点
            ProcessBuilder pb = new ProcessBuilder(
                "redis-cli", "--cluster", "del-node",
                "any-cluster-node:7000", nodeId
            );
            Process process = pb.start();
            process.waitFor();

        } catch (Exception e) {
            log.error("移除节点失败", e);
        }
    }
}
```

### 高可用方案对比

| 方案         | 优点             | 缺点         | 适用场景       |
| ------------ | ---------------- | ------------ | -------------- |
| **主从复制** | 简单、读写分离   | 手动故障切换 | 读多写少场景   |
| **Sentinel** | 自动故障切换     | 不支持分片   | 中小型应用     |
| **Cluster**  | 自动分片、高可用 | 复杂度高     | 大型分布式应用 |

---

## Redis 性能优化

### 性能监控与诊断

#### 性能指标监控

```java
@Component
public class RedisPerformanceMonitor {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Scheduled(fixedRate = 60000) // 每分钟执行一次
    public void monitorRedisPerformance() {
        try {
            Properties info = redisTemplate.getConnectionFactory()
                .getConnection().info();

            // 内存使用情况
            String usedMemory = info.getProperty("used_memory_human");
            String maxMemory = info.getProperty("maxmemory_human");

            // 连接数
            String connectedClients = info.getProperty("connected_clients");

            // 命令统计
            String totalCommandsProcessed = info.getProperty("total_commands_processed");
            String instantaneousOpsPerSec = info.getProperty("instantaneous_ops_per_sec");

            // 键空间统计
            String keyspaceHits = info.getProperty("keyspace_hits");
            String keyspaceMisses = info.getProperty("keyspace_misses");

            // 计算命中率
            long hits = Long.parseLong(keyspaceHits);
            long misses = Long.parseLong(keyspaceMisses);
            double hitRate = (double) hits / (hits + misses) * 100;

            log.info("Redis性能监控 - 内存使用: {}/{}, 连接数: {}, QPS: {}, 命中率: {:.2f}%",
                usedMemory, maxMemory, connectedClients, instantaneousOpsPerSec, hitRate);

            // 发送告警
            if (hitRate < 80) {
                sendAlert("Redis命中率过低: " + hitRate + "%");
            }

        } catch (Exception e) {
            log.error("Redis性能监控失败", e);
        }
    }
}
```

#### 慢查询分析

```java
@Component
public class RedisSlowLogAnalyzer {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void analyzeSlowQueries() {
        try {
            List<Object> slowLogEntries = redisTemplate.getConnectionFactory()
                .getConnection().slowLogGet(10); // 获取最近10条慢查询

            for (Object entry : slowLogEntries) {
                if (entry instanceof List) {
                    List<?> logEntry = (List<?>) entry;
                    if (logEntry.size() >= 4) {
                        Long id = (Long) logEntry.get(0);
                        Long timestamp = (Long) logEntry.get(1);
                        Long duration = (Long) logEntry.get(2); // 微秒
                        List<?> command = (List<?>) logEntry.get(3);

                        log.warn("慢查询 - ID: {}, 时间: {}, 耗时: {}μs, 命令: {}",
                            id, new Date(timestamp * 1000), duration, command);

                        // 分析慢查询原因
                        analyzeSlowCommand(command, duration);
                    }
                }
            }
        } catch (Exception e) {
            log.error("慢查询分析失败", e);
        }
    }

    private void analyzeSlowCommand(List<?> command, Long duration) {
        if (command.isEmpty()) return;

        String cmd = command.get(0).toString().toUpperCase();

        switch (cmd) {
            case "KEYS":
                log.warn("发现KEYS命令，建议使用SCAN替代");
                break;
            case "SORT":
                log.warn("发现SORT命令，可能数据量过大");
                break;
            case "SUNION":
            case "SINTER":
            case "SDIFF":
                log.warn("发现集合运算命令，检查集合大小");
                break;
            default:
                if (duration > 10000) { // 超过10ms
                    log.warn("命令{}执行时间过长: {}μs", cmd, duration);
                }
        }
    }
}
```

### Pipeline 优化

#### Pipeline 使用示例

```java
@Service
public class RedisPipelineService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 批量操作优化
    public void batchOperationsWithPipeline(Map<String, String> data) {
        // 使用Pipeline减少网络往返
        redisTemplate.executePipelined(new RedisCallback<Object>() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                StringRedisConnection stringConn = (StringRedisConnection) connection;

                for (Map.Entry<String, String> entry : data.entrySet()) {
                    stringConn.set(entry.getKey(), entry.getValue());
                }

                return null; // Pipeline不需要返回值
            }
        });
    }

    // 性能对比测试
    public void performanceComparison(Map<String, String> testData) {
        int dataSize = testData.size();

        // 1. 逐个操作
        long start = System.currentTimeMillis();
        for (Map.Entry<String, String> entry : testData.entrySet()) {
            redisTemplate.opsForValue().set(entry.getKey(), entry.getValue());
        }
        long normalTime = System.currentTimeMillis() - start;

        // 2. Pipeline操作
        start = System.currentTimeMillis();
        batchOperationsWithPipeline(testData);
        long pipelineTime = System.currentTimeMillis() - start;

        log.info("数据量: {}, 普通操作: {}ms, Pipeline操作: {}ms, 性能提升: {}倍",
            dataSize, normalTime, pipelineTime, (double) normalTime / pipelineTime);
    }

    // 批量查询优化
    public List<String> batchGet(List<String> keys) {
        return redisTemplate.executePipelined(new RedisCallback<Object>() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                StringRedisConnection stringConn = (StringRedisConnection) connection;

                for (String key : keys) {
                    stringConn.get(key);
                }

                return null;
            }
        }).stream()
        .map(result -> result != null ? result.toString() : null)
        .collect(Collectors.toList());
    }
}
```

### 内存优化

#### 数据结构优化

```java
@Service
public class RedisMemoryOptimization {

    // 使用Hash存储对象，节省内存
    public void optimizeUserStorage() {
        // 不推荐：为每个用户字段创建独立的key
        /*
        redisTemplate.opsForValue().set("user:1001:name", "张三");
        redisTemplate.opsForValue().set("user:1001:age", "25");
        redisTemplate.opsForValue().set("user:1001:email", "zhangsan@example.com");
        */

        // 推荐：使用Hash存储
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("name", "张三");
        userInfo.put("age", "25");
        userInfo.put("email", "zhangsan@example.com");

        redisTemplate.opsForHash().putAll("user:1001", userInfo);
    }

    // 使用位图优化布尔值存储
    public void optimizeBooleanStorage() {
        String key = "user_online_status";

        // 设置用户在线状态
        redisTemplate.opsForValue().setBit(key, 1001, true);  // 用户1001在线
        redisTemplate.opsForValue().setBit(key, 1002, false); // 用户1002离线

        // 查询用户在线状态
        Boolean isOnline = redisTemplate.opsForValue().getBit(key, 1001);

        // 统计在线用户数
        Long onlineCount = redisTemplate.execute((RedisCallback<Long>) connection ->
            connection.bitCount(key.getBytes()));
    }

    // 使用HyperLogLog优化基数统计
    public void optimizeCardinalityCount() {
        String key = "page_unique_visitors";

        // 添加访问者ID
        redisTemplate.opsForHyperLogLog().add(key, "user1001", "user1002", "user1003");

        // 获取去重访问量（近似值）
        Long uniqueVisitors = redisTemplate.opsForHyperLogLog().size(key);

        log.info("页面独立访客数: {}", uniqueVisitors);
    }

    // 压缩长字符串
    public void compressLongString(String key, String longContent) {
        try {
            // 压缩数据
            byte[] compressed = compress(longContent);

            // 存储压缩后的数据
            redisTemplate.opsForValue().set(key + ":compressed",
                Base64.getEncoder().encodeToString(compressed));

        } catch (Exception e) {
            log.error("数据压缩失败", e);
        }
    }

    private byte[] compress(String data) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPOutputStream gzipOut = new GZIPOutputStream(baos)) {
            gzipOut.write(data.getBytes("UTF-8"));
        }
        return baos.toByteArray();
    }
}
```

#### 过期策略优化

```java
@Service
public class RedisExpirationOptimization {

    // 分散过期时间，避免缓存雪崩
    public void setExpireWithJitter(String key, Object value, int baseExpireSeconds) {
        Random random = new Random();
        // 在基础过期时间上增加±20%的随机值
        int jitter = (int) (baseExpireSeconds * 0.2 * (random.nextDouble() - 0.5) * 2);
        int finalExpire = baseExpireSeconds + jitter;

        redisTemplate.opsForValue().set(key, value, Duration.ofSeconds(finalExpire));
    }

    // 热点数据延长过期时间
    public void extendHotDataExpiration() {
        Set<String> hotKeys = identifyHotKeys();

        for (String key : hotKeys) {
            Long currentTtl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            if (currentTtl != null && currentTtl > 0 && currentTtl < 300) {
                // 如果热点数据即将过期，延长过期时间
                redisTemplate.expire(key, Duration.ofHours(2));
                log.info("延长热点数据过期时间: {}", key);
            }
        }
    }

    private Set<String> identifyHotKeys() {
        // 实际实现中可以通过统计访问频率来识别热点key
        return Set.of("config:system", "user:vip_list", "product:hot");
    }
}
```

### 连接池优化

#### Lettuce 连接池配置

```java
@Configuration
public class RedisConnectionConfig {

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        // 连接池配置
        GenericObjectPoolConfig<StatefulRedisConnection<String, String>> poolConfig =
            new GenericObjectPoolConfig<>();
        poolConfig.setMaxTotal(200);        // 最大连接数
        poolConfig.setMaxIdle(50);          // 最大空闲连接数
        poolConfig.setMinIdle(10);          // 最小空闲连接数
        poolConfig.setMaxWaitMillis(3000);  // 获取连接最大等待时间
        poolConfig.setTestOnBorrow(true);   // 获取连接时检测连接可用性
        poolConfig.setTestOnReturn(false);  // 归还连接时检测连接可用性
        poolConfig.setTestWhileIdle(true);  // 空闲时检测连接可用性

        // 客户端配置
        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
            .commandTimeout(Duration.ofSeconds(2))      // 命令执行超时时间
            .shutdownTimeout(Duration.ZERO)             // 关闭超时时间
            .poolConfig(poolConfig)                     // 连接池配置
            .build();

        // Redis配置
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName("localhost");
        redisConfig.setPort(6379);
        redisConfig.setDatabase(0);

        return new LettuceConnectionFactory(redisConfig, clientConfig);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            LettuceConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 序列化配置
        Jackson2JsonRedisSerializer<Object> serializer =
            new Jackson2JsonRedisSerializer<>(Object.class);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        return template;
    }
}
```

#### 连接池监控

````java
@Component
public class RedisConnectionPoolMonitor {

    @Autowired
    private LettuceConnectionFactory connectionFactory;

    @Scheduled(fixedRate = 30000) // 每30秒监控一次
    public void monitorConnectionPool() {
        try {
            LettucePool pool = connectionFactory.getClientResources().eventLoopGroupProvider();

            // 这里是伪代码，实际获取连接池统计信息的方法可能不同
            // log.info("连接池状态 - 活跃: {}, 空闲: {}, 等待: {}",
            //     pool.getNumActive(), pool.getNumIdle(), pool.getNumWaiters());

---

## 面试常见问题

### 基础问题

#### 1. Redis 与 Memcached 的区别？

**答：** 主要区别包括：
- **数据类型**：Redis 支持多种数据结构（String、Hash、List、Set、ZSet），Memcached 只支持字符串
- **持久化**：Redis 支持 RDB 和 AOF 持久化，Memcached 不支持
- **分布式**：Redis 原生支持主从复制和集群，Memcached 需要客户端实现
- **性能**：Redis 单线程模型性能更稳定，Memcached 多线程但有锁竞争
- **内存使用**：Redis 内存利用率更高，支持压缩

#### 2. 为什么 Redis 选择单线程？

**答：**
- **避免上下文切换**：单线程避免了线程切换的开销
- **避免锁竞争**：不需要考虑线程安全问题
- **简化实现**：单线程模型实现简单，易于维护
- **瓶颈不在 CPU**：Redis 的瓶颈通常是内存和网络 I/O，而不是 CPU

#### 3. Redis 6.0 的多线程是什么？

**答：** Redis 6.0 引入了 I/O 多线程，但**命令执行仍然是单线程**：
- **I/O 多线程**：用于网络数据的读写操作
- **命令执行单线程**：保证操作的原子性和一致性
- **性能提升**：减少 I/O 等待时间，提高吞吐量

### 数据结构问题

#### 4. Redis 有哪些数据结构？分别适用于什么场景？

**答：**
```java
// String：缓存、计数器、分布式锁
redisTemplate.opsForValue().set("user:1001", userInfo);
redisTemplate.opsForValue().increment("page:views");

// Hash：存储对象
redisTemplate.opsForHash().put("user:1001", "name", "张三");

// List：消息队列、最新列表
redisTemplate.opsForList().leftPush("messages", message);

// Set：标签、去重
redisTemplate.opsForSet().add("user:tags", "java", "redis");

// ZSet：排行榜、时间线
redisTemplate.opsForZSet().add("ranking", "user1", 100);
````

#### 5. 如何实现 Redis 分布式锁？

**答：** 使用 `SET key value NX EX timeout` 实现：

```java
public boolean tryLock(String lockKey, String requestId, int expireTime) {
    String result = jedis.set(lockKey, requestId, "NX", "EX", expireTime);
    return "OK".equals(result);
}

public boolean releaseLock(String lockKey, String requestId) {
    String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                   "return redis.call('del', KEYS[1]) else return 0 end";
    Object result = jedis.eval(script, Collections.singletonList(lockKey),
                              Collections.singletonList(requestId));
    return "1".equals(result.toString());
}
```

### 缓存问题

#### 6. 什么是缓存穿透、击穿、雪崩？如何解决？

**答：**

**缓存穿透**：查询不存在的数据

-   解决方案：缓存空值、布隆过滤器、参数校验

**缓存击穿**：热点数据过期

-   解决方案：分布式锁、热点数据不过期、逻辑过期

**缓存雪崩**：大量数据同时过期

-   解决方案：过期时间随机化、多级缓存、熔断降级

#### 7. 如何保证缓存与数据库的一致性？

**答：**

-   **Cache Aside Pattern**：先更新数据库，再删除缓存
-   **Write Through**：同时更新缓存和数据库
-   **Write Behind**：异步更新数据库
-   **使用消息队列**：异步保证最终一致性
-   **Canal + Binlog**：监听数据库变更

### 持久化问题

#### 8. RDB 和 AOF 的区别？

**答：**

| 特性           | RDB                       | AOF                        |
| -------------- | ------------------------- | -------------------------- |
| **恢复速度**   | 快                        | 慢                         |
| **数据完整性** | 可能丢失部分数据          | 丢失数据较少               |
| **文件大小**   | 小                        | 大                         |
| **性能影响**   | fork 子进程，对性能影响小 | 每次写入都要记录，影响性能 |

#### 9. Redis 持久化的原理？

**答：**

-   **RDB**：fork 子进程生成内存快照，利用 COW (Copy On Write) 机制
-   **AOF**：记录每个写操作命令，通过重放命令恢复数据
-   **混合持久化**：RDB + AOF，兼顾恢复速度和数据完整性

### 集群问题

#### 10. Redis 集群如何实现数据分片？

**答：** Redis Cluster 使用**一致性哈希槽**：

-   **16384 个槽位**：数据根据 CRC16 算法分配到不同槽位
-   **槽位分配**：每个节点负责一部分槽位
-   **数据迁移**：扩容时重新分配槽位

```java
// 计算 key 对应的槽位
public int calculateSlot(String key) {
    return CRC16.checksum(key.getBytes()) % 16384;
}
```

#### 11. Redis 主从复制的原理？

**答：** 主从复制分为**全量同步**和**增量同步**：

**全量同步**：

1. 从节点发送 PSYNC 命令
2. 主节点执行 BGSAVE 生成 RDB
3. 主节点发送 RDB 给从节点
4. 从节点加载 RDB 文件
5. 主节点发送复制缓冲区的命令

**增量同步**：

1. 主节点将写命令发送给从节点
2. 从节点执行命令保持同步

### 性能优化问题

#### 12. 如何优化 Redis 性能？

**答：**

-   **命令优化**：避免使用 KEYS，使用 SCAN 替代
-   **数据结构优化**：选择合适的数据结构
-   **Pipeline**：批量操作减少网络往返
-   **连接池**：合理配置连接池参数
-   **内存优化**：设置合理的淘汰策略
-   **监控告警**：实时监控关键指标

#### 13. 什么是 Redis Pipeline？有什么好处？

**答：** Pipeline 是一种批量执行命令的技术：

-   **减少网络往返**：一次发送多个命令
-   **提高吞吐量**：显著提升性能
-   **注意事项**：命令之间不能有依赖关系

```java
// Pipeline 示例
redisTemplate.executePipelined(new RedisCallback<Object>() {
    public Object doInRedis(RedisConnection connection) {
        for (String key : keys) {
            connection.get(key.getBytes());
        }
        return null;
    }
});
```

### 实际应用问题

#### 14. 在什么场景下选择 Redis？

**答：**

-   **缓存**：提高数据访问速度
-   **会话存储**：分布式 session 管理
-   **消息队列**：简单的发布订阅场景
-   **分布式锁**：控制并发访问
-   **计数器**：实时统计数据
-   **排行榜**：游戏分数排名等

#### 15. Redis 在微服务架构中的作用？

**答：**

-   **服务间缓存共享**：减少重复计算
-   **分布式锁**：协调服务间的资源访问
-   **配置中心**：存储动态配置信息
-   **限流**：实现接口访问频率控制
-   **消息传递**：简单的服务间通信

---

## 总结

Redis 作为高性能的内存数据库，在现代应用架构中发挥着重要作用。掌握其工作原理、数据结构、持久化机制、集群方案和性能优化等知识，对于系统设计和面试都具有重要意义。

**关键要点：**

-   理解 Redis 的单线程模型和 I/O 多路复用
-   熟练使用各种数据结构解决实际问题
-   掌握缓存常见问题的解决方案
-   了解持久化和集群的实现原理
-   具备性能优化和故障排查能力

通过实际项目经验和深入学习，能够更好地运用 Redis 解决复杂的业务场景。
