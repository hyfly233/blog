# Zookeeper

### 什么是 Zookeeper

ZooKeeper 是一个开源的分布式程序协调服务，为分布式应用提供一致性服务，提供的功能包括：数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、主节点 Master 选举、配置维护，名字服务、分布式同步、分布式锁和分布式队列等。ZooKeeper 的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户

### ZooKeeper 典型应用场景

-   **数据发布/订阅：**发布者将数据发布到 zk 上一个或多个节点上，订阅者从中订阅数据，从而动态获取数据的目的，实现配置信息的集中式管理和数据动态更新
-   **配置管理：**程序的配置信息放在 zk 的 **znode** 下，**配置发生改变也就是 znode 发生变化**，可以通过改变 zk 中某个目录节点的内容，利用 **watcher 通知给各个客户端**，从而更改配置
-   **负载均衡**
-   **命名服务：**在分布式系统中，通过使用命名服务，客户端应用能够根据指定名字来获取资源或服务的地址，提供者等信息
-   **分布式协调/通知：**

-   -   对于系统调度来说：操作人员发送通知实际是通过控制台改变某个节点的状态，然后 zk 将这些变化发送给注册了这个节点的 watcher 的所有客户端
    -   对于执行情况汇报：每个工作进程都在某个目录下创建一个临时节点，并携带工作的进度数据，这样汇总的进程可以监控目录子节点的变化获得工作进度的实时的全局情况

-   **集群管理：**监控节点存活状态、运行请求等
-   **主节点 Master 选举：**主节点挂掉了之后可以从备用的节点开始新一轮主节点选举，使用 Zookeeper 可以**协助**完成这个过程
-   **分布式锁：**提供两种锁：独占锁、共享锁

-   -   独占锁：即一次只能有一个线程使用资源
    -   共享锁：读锁共享，读写互斥，即可以有多线线程同时读同一个资源，如果要使用写锁也只能有一个线程使用

-   **分布式队列：**

-   -   同步队列：当一个队列的成员都聚齐时，这个队列才可用，否则一直等待所有成员到达。在文件系统中使用，在约定目录下创建临时目录节点，监听节点数目是否符合要求的数目
    -   FIFO 队列：按照 FIFO 方式进行入队和出队操作

### ZAB 协议

**ZAB 协议：**Zookeeper 专门设计的一种**支持崩溃恢复的原子广播协议**。ZAB 协议包括两种基本的模式：**崩溃恢复**和**消息广播**。当整个 Zookeeper 集群**刚刚启动**或者 **Leader 服务器宕机**、**重启**或者**网络故障**导致**没有过半的**服务器与 Leader 服务器保持正常通信时，所有服务器进入**崩溃恢复模式**，首先**选举产生新的 Leader 服务器**，然后集群中 Follower 服务器开始与新的 Leader 服务器进行数据同步。当集群中**超过半数**机器与该 Leader 服务器完成数据同步之后，退出恢复模式进入**消息广播模式**，Leader 服务器开始接收客户端的事务请求生成事物提案来进行事务请求处理。

### Zookeeper 怎么保证主从节点的状态同步

Zookeeper 的核心是**ZAB 协议原子广播机制**，保证了各个 server 之间的同步。Zab 协议有两种模式，恢复模式和广播模式。

-   **恢复模式**

-   -   当服务启动或者在领导者崩溃后，Zab 就进入了恢复模式，当领导者被选举出来，且过半的 server 完成了和 leader 的状态同步以后，恢复模式就结束了。状态同步保证了 leader 和 server 具有相同的系统状态

-   **广播模式**

-   -   一旦 leader 已经和多数的 follower 进行了状态同步后，它就可以开始广播消息了，即进入广播状态。这时候当一个 server 加入 ZooKeeper 服务中，它会在恢复模式下启动，发现 leader，并和 leader 进行状态同步。待到同步结束，它也参与消息广播。ZooKeeper 服务一直维持在 Broadcast 状态，直到 leader 崩溃了或者 leader 失去了大部分的 followers 支持。

### Zookeeper 有几种部署模式

三种部署模式：

-   **单机部署**
-   **集群部署**
-   **伪集群部署：**一台机器启动多个 Zookeeper 实例运行

### Zookeeper 的通知机制

client 端会对某个 **znode** 建立一个 **watcher 事件**，当该 **znode** 发生变化时，这些 client 会收到 zk 的通知，然后 client 可以根据 znode 变化来做出业务上的改变等

### 集群中为什么要有主节点

在分布式环境中，有些业务逻辑只需要集群中的某一台机器进行执行，其他的机器可以共享这个结果，这样可以**大大减少重复计算，提高性能**，于是就需要进行 leader 选举

### 集群中有 3 台服务器，其中一个节点宕机，这个时候 Zookeeper 还可以使用吗？

可以继续使用，单数服务器只要没超过一半的服务器宕机就可以继续使用。集群规则为 2N+1 台，N >0，即最少需要 3 台。

### Zookeeper 宕机如何处理？

Zookeeper 本身也是集群，推荐配置不少于 3 个服务器。Zookeeper 自身也要保证当一个节点宕机时，其他节点会继续提供服务

-   如果是一个 Follower 宕机，还有 2 台服务器提供访问，因为 Zookeeper 上的数据是有多个副本的，数据并不会丢失
-   如果是一个 Leader 宕机，Zookeeper 会选举出新的 Leader。

Zookeeper 集群的机制是**只要超过半数的节点正常，集群就能正常提供服务**。只有在 Zookeeper 节点挂得太多，只剩一半或不到一半节点能工作，集群才失效。所以：

-   3 个节点的 cluster 可以挂掉 1 个节点(leader 可以得到 2 票 > 1.5)
-   2 个节点的 cluster 就不能挂掉任何 1 个节点了(leader 可以得到 1 票 <= 1)

### 四种类型的数据节点 Znode

-   **持久节点(PERSISTENT)：**除非手动删除，否则节点一直存在于 Zookeeper 上
-   **临时节点(EPHEMERAL)：**临时节点的生命周期与客户端会话绑定，一旦客户端会话失效（客户端与 Zookeeper 连接断开不一定会话失效），那么这个客户端创建的所有临时节点都会被移除
-   **持久顺序节点(PERSISTENT_SEQUENTIAL)：**基本特性同持久节点，只是增加了顺序属性，节点名后边会追加一个由父节点维护的自增整型数字
-   **临时顺序节点(EPHEMERAL_SEQUENTIAL)：**基本特性同临时节点，增加了顺序属性，节点名后边会追加一个由父节点维护的自增整型数字

### ZooKeeper 可以保证哪些分布式一致性特性

-   顺序一致性
-   原子性
-   单一视图
-   可靠性
-   实时性

### ZooKeeper 的数据模型

**共享的树形结构**，由一系列的 ZNode 数据节点组成。ZNode 存有数据信息，如版本号等等。ZNode 之间的层级关系，像文件系统中的目录结构一样。并且它是将数据存在内存中，这样可以提高吞吐、减少延迟

### 如何识别请求的先后顺序

ZooKeeper 会给每个更新请求，分配一个**全局唯一的递增编号（zxid)**，编号的大小体现事务操作的先后顺序

### A 是根节点，如何表达 A 子节点下的 B 节点

/A/B

### 集群角色

**Leader**

（1）事务请求的唯一调度和处理者，保证集群事务处理的顺序性

（2）集群内部各服务的调度者

**Follower**

（1）处理客户端的非事务请求，转发事务请求给 Leader 服务器

（2）参与事务请求 Proposal 的投票

（3）参与 Leader 选举投票

**Observer**

（1）3.0 版本以后引入的一个服务器角色，在不影响集群事务处理能力的基础上提升集群的非事务处理能力

（2）处理客户端的非事务请求，转发事务请求给 Leader 服务器

（3）不参与任何形式的投票

### Stat 记录了哪些版本相关数据

-   **version：**当前 ZNode 版本
-   **cversion：**当前 ZNode 子节点版本
-   **aversion：**当前 ZNode 的 ACL 版本

### 权限控制

Access Control Lists，ACL，类似于 UNIX 文件系统的权限控制

### ZooKeeper 定义了几种权限？

-   CREATE
-   READ
-   WRITE
-   DELETE
-   ADMIN

### Zookeeper 默认端口

**2181**

### 如何创建一个 ZNode

-   create /app -e 临时
-   create /app -s 顺序

### 如何查看子节点

**ls /节点路径 [watch]**

### 获取指定节点信息

**get /节点路径 [watch]**

### 更新指定节点信息

**set /节点路径 data [version]**

### 删除指定节点

**delete /节点路径 [version]**

如果没有子节点，就能删除成功。如果有会提示，该节点不为空

### 会话 Session

客户端会话，客户端启动时，会与服务器建议 TCP 链接，连接成功后，客户端的生命周期开始，客户端和服务器通过**心跳检测**保持有效的的会话以及发请求并响应、监听 Watch 事件等

### 在 sessionTimeout 之内的会话，因服务器压力大、网络故障或客户端主动断开情况下，之前的会话还有效吗？

有效

### Watcher 事件监听器

ZooKeeper 允许用户在指定节点上注册 Watcher，当触发特定事件时，ZooKeeper 服务端会把相应的事件通知到相应的**客户端**上，属于 ZooKeeper 一个重要的特性

### Quorum

当集群中过半 UP 状态的进程组成了进程子集后，就可以正常的消息传播了，这样的一个子集称为 Quorum

### 同进程组的两个进程消息网络通信有哪两个特性

-   **完整性：**如果进程 a 收到进程 b 的消息 msg,那么 b 一定发送了消息 msg。
-   **前置性：**如果 msg1 是 msg2 的前置消息，那么当前进程务必先接收到 msg1,在接受 msg2。

### ZAB 三个阶段

-   **发现 (Discovery)**
-   **同步 (Synchronization)**
-   **广播 (Broadcast)**

### ZooKeeper 数据发布/订阅

发布者将数据发布到 ZooKeeper 上一个或多个节点上，订阅者从中订阅数据，从而动态获取数据的目的，实现配置信息的集中式管理和数据动态更新

### ZooKeeper 发布订阅的两种设计模式

-   **推(Push)：**服务端主动推数据给所有定于的客户端
-   **拉(Pull)：**客户端主动发请求来获取最新数据

### 客户端如何获取配置信息

启动时**主动到服务端拉取信息**，同时，在制定节点**注册 Watcher 监听**。一旦有配置变化，服务端就会实时通知订阅它的所有客户端

### Zookeeper 文件系统

-   Zookeeper 提供一个**多层级的节点命名空间**（节点称为 **znode**）。与文件系统不同的是，这些节点都可以设置关联的数据，而文件系统中只有文件节点可以存放数据，目录节点不行
-   Zookeeper 为了保证高吞吐和低延迟，在**内存中**维护了这个树状的目录结构，这种特性使得 Zookeeper 不能存放大量的数据，每个节点的存放**数据上限为 1M**

### Zookeeper Watcher 机制

-   Zookeeper 允许客户端向服务端的某个 Znode 注册一个 Watcher 监听，当服务端的一些指定事件触发了这个 Watcher，服务端会向指定客户端发送一个事件通知来实现分布式的通知功能，然后客户端根据 Watcher 通知状态和事件类型做出业务上的改变。
-   工作机制

-   -   客户端注册 watcher
    -   服务端处理 watcher
    -   客户端回调 watcher

-   Watcher 特性

-   -   **一次性：**无论是服务端还是客户端，一旦一个 Watcher 被触发，zk 都会将其从相应的**存储中移除**。这样的设计有效的**减轻了服务端的压力**，不然对于更新非常频繁的节点，服务端会不断的向客户端发送事件通知，无论对于网络还是服务端的压力都非常大
    -   **客户端串行执行：**客户端 Watcher 回调的过程是一个串行同步的过程
    -   **轻量：**

-   -   -   Watcher 通知非常简单，只会告诉客户端发生了事件，而不会说明事件的具体内容
        -   客户端向服务端注册 Watcher 的时候，并不会把客户端真实的 Watcher 对象实体传递到服务端，仅仅是在客户端请求中使用 boolean 类型属性进行了标记

-   **Watcher event 异步发送：**Watcher 的通知事件从 server 发送到 client 是异步的，这就存在一个问题，不同的客户端和服务器之间通过 socket 进行通信，由于**网络延迟或其他因素**导致客户端在不通的时刻监听到事件，由于 Zookeeper 本身提供了 ordering guarantee，即客户端监听事件后，才会感知它所监视 znode 发生了变化。所以我使用 Zookeeper 不能期望能够监控到节点每次的变化。Zookeeper 只能保证最终的一致性，而无法保证强一致性。
-   **注册 watcher：**getData、exists、getChildren
-   **触发 watcher：**create、delete、setData
-   当一个客户端连接到一个新的服务器上时，watch 将会被以任意会话事件触发。当与一个服务器失去连接的时候，是无法接收到 watch 的。而当 client 重新连接时，如果需要的话，所有先前注册过的 watch，都会被重新注册。通常这是完全透明的。只有在一个特殊情况下，watch 可能会丢失：对于一个未创建的 znode 的 exist watch，如果在客户端断开连接期间被创建了，并且随后在客户端连接上之前又删除了，这种情况下，这个 watch 事件可能会被丢失。

### 客户端注册 Watcher 实现

1. 调用 getData()/getChildren()/exist() 三个 API，传入 Watcher 对象
2. 标记请求 request，封装 Watcher 到 WatchRegistration
3. 封装成 Packet 对象，发服务端发送 request
4. 收到服务端响应后，将 Watcher 注册到 ZKWatcherManager 中进行管理
5. 请求返回，完成注册。

### 服务端处理 Watcher 实现

1. 服务端接收 Watcher 并存储
   接收到客户端请求，处理请求判断是否需要注册 Watcher，需要的话将数据节点的节点路径和 ServerCnxn（ServerCnxn 代表一个客户端和服务端的连接，实现了 Watcher 的 process 接口，此时可以看成一个 Watcher 对象）存储在 WatcherManager 的 WatchTable 和 watch2Paths 中去
2. Watcher 触发
   以服务端接收到 setData() 事务请求触发 NodeDataChanged 事件为例：

3.  1. 封装 WatchedEvent
       将通知状态（SyncConnected）、事件类型（NodeDataChanged）以及节点路径封装成一个 WatchedEvent 对象
    2. 查询 Watcher
       从 WatchTable 中根据节点路径查找 Watcher
    3. 没找到；说明没有客户端在该数据节点上注册过 Watcher
    4. 找到；提取并从 WatchTable 和 Watch2Paths 中删除对应 Watcher（从这里可以看出 Watcher 在服务端是一次性的，触发一次就失效了）

4. 调用 process 方法来触发 Watcher，process 主要就是通过 ServerCnxn 对应的 TCP 连接发送 Watcher 事件通知

### 客户端回调 Watcher

客户端 SendThread 线程接收事件通知，交由 EventThread 线程回调 Watcher，客户端的 Watcher 机制同样是一次性的，一旦被触发后，该 Watcher 就失效了

### ACL 权限控制机制 todo

**UGO（User/Group/Others）**

目前在 Linux/Unix 文件系统中使用，也是使用最广泛的权限控制方式。是一种粗粒度的文件系统权限控制模式。

**ACL（Access Control List）访问控制列表**

包括三个方面：

权限模式（Scheme）

（1）IP：从 IP 地址粒度进行权限控制

（2）Digest：最常用，用类似于 username:password 的权限标识来进行权限配置，便于区分不同应用来进行权限控制

（3）World：最开放的权限控制方式，是一种特殊的 digest 模式，只有一个权限标识“world:anyone”

（4）Super：超级用户

授权对象

授权对象指的是权限赋予的用户或一个指定实体，例如 IP 地址或是机器灯。

权限 Permission

（1）CREATE：数据节点创建权限，允许授权对象在该 Znode 下创建子节点

（2）DELETE：子节点删除权限，允许授权对象删除该数据节点的子节点

（3）READ：数据节点的读取权限，允许授权对象访问该数据节点并读取其数据内容或子节点列表等

（4）WRITE：数据节点更新权限，允许授权对象对该数据节点进行更新操作

（5）ADMIN：数据节点管理权限，允许授权对象对该数据节点进行 ACL 相关设置操作

## Chroot 特性

3.2.0 版本后，添加了 Chroot 特性，该特性允许每个客户端为自己设置一个命名空间。如果一个客户端设置了 Chroot，那么该客户端对服务器的任何操作，都将会被限制在其自己的命名空间下。通过设置 Chroot，能够将一个客户端应用于 Zookeeper 服务端的一颗子树相对应，在那些多个应用公用一个 Zookeeper 进群的场景下，对实现不同应用间的相互隔离非常有帮助

## 12. 会话管理

分桶策略：将类似的会话放在同一区块中进行管理，以便于 Zookeeper 对会话进行不同区块的隔离处理以及同一区块的统一处理。

分配原则：每个会话的“下次超时时间点”（ExpirationTime）

计算公式：

ExpirationTime\_ = currentTime + sessionTimeout

ExpirationTime = (ExpirationTime\_ / ExpirationInrerval + 1) \*

ExpirationInterval , ExpirationInterval 是指 Zookeeper 会话超时检查时间间隔，默认 tickTime

## 13. Zookeeper 对节点的 watch 监听通知是永久的吗？为什么不是永久的?

不是。官方声明：一个 Watch 事件是一个一次性的触发器，当被设置了 Watch 的数据发生了改变的时候，则服务器将这个改变发送给设置了 Watch 的客户端，以便通知它们。

为什么不是永久的，举个例子，如果服务端变动频繁，而监听的客户端很多情况下，每次变动都要通知到所有的客户端，给网络和服务器造成很大压力。

一般是客户端执行 getData(“/节点 A”,true)，如果节点 A 发生了变更或删除，客户端会得到它的 watch 事件，但是在之后节点 A 又发生了变更，而客户端又没有设置 watch 事件，就不再给客户端发送。

在实际应用中，很多情况下，我们的客户端不需要知道服务端的每一次变动，我只要最新的数据即可。

## 16. 说几个 zookeeper 常用的命令。

常用命令：ls get set create delete 等。

##

## 18. Zookeeper 下 Server 工作状态

服务器具有四种状态，分别是 LOOKING、FOLLOWING、LEADING、OBSERVING。

（1）LOOKING：寻 找 Leader 状态。当服务器处于该状态时，它会认为当前集群中没有 Leader，因此需要进入 Leader 选举状态。

（2）FOLLOWING：跟随者状态。表明当前服务器角色是 Follower。

（3）LEADING：领导者状态。表明当前服务器角色是 Leader。

（4）OBSERVING：观察者状态。表明当前服务器角色是 Observer。

## 15. 数据同步

整个集群完成 Leader 选举之后，Learner（Follower 和 Observer 的统称）回向 Leader 服务器进行注册。当 Learner 服务器想 Leader 服务器完成注册后，进入数据同步环节。

数据同步流程：（均以消息传递的方式进行）

Learner 向 Learder 注册

数据同步

同步确认

Zookeeper 的数据同步通常分为四类：

（1）直接差异化同步（DIFF 同步）

（2）先回滚再差异化同步（TRUNC+DIFF 同步）

（3）仅回滚同步（TRUNC 同步）

（4）全量同步（SNAP 同步）

在进行数据同步前，Leader 服务器会完成数据同步初始化：

peerLastZxid：

· 从 learner 服务器注册时发送的 ACKEPOCH 消息中提取 lastZxid（该 Learner 服务器最后处理的 ZXID）

minCommittedLog：

· Leader 服务器 Proposal 缓存队列 committedLog 中最小 ZXIDmaxCommittedLog：

· Leader 服务器 Proposal 缓存队列 committedLog 中最大 ZXID 直接差异化同步（DIFF 同步）

· 场景：peerLastZxid 介于 minCommittedLog 和 maxCommittedLog 之间先回滚再差异化同步（TRUNC+DIFF 同步）

· 场景：当新的 Leader 服务器发现某个 Learner 服务器包含了一条自己没有的事务记录，那么就需要让该 Learner 服务器进行事务回滚--回滚到 Leader 服务器上存在的，同时也是最接近于 peerLastZxid 的 ZXID 仅回滚同步（TRUNC 同步）

· 场景：peerLastZxid 大于 maxCommittedLog

全量同步（SNAP 同步）

· 场景一：peerLastZxid 小于 minCommittedLog

· 场景二：Leader 服务器上没有 Proposal 缓存队列且 peerLastZxid 不等于 lastProcessZxid

### 集群支持动态添加机器吗

水平扩容，Zookeeper 在这方面不太好。两种方式：

-   全部重启：关闭所有 Zookeeper 服务，修改配置之后启动。不影响之前客户端的会话。
-   逐个重启：在过半存活即可用的原则下，一台机器重启不影响整个集群对外提供服务。这是比较常用的方式。3.5 版本开始支持动态扩容。

# Apache ZooKeeper 分布式协调服务指南

## 1. ZooKeeper 概述

### 1.1 什么是 ZooKeeper

Apache ZooKeeper 是一个开源的分布式协调服务，为分布式应用提供高可用的一致性服务。它是一个为大型分布式系统构建的协调内核，旨在简化分布式应用的开发。

**核心特性：**

-   **数据一致性**：提供强一致性保证
-   **高可用性**：支持集群部署，容错能力强
-   **顺序保证**：严格的操作顺序保证
-   **原子性**：所有操作要么成功要么失败
-   **实时性**：客户端能及时获得最新数据

### 1.2 ZooKeeper 功能模块

| 功能模块          | 描述               | 应用场景               |
| ----------------- | ------------------ | ---------------------- |
| **数据发布/订阅** | 配置信息集中管理   | 配置中心、参数动态更新 |
| **命名服务**      | 提供分布式命名     | 服务发现、资源定位     |
| **分布式协调**    | 进程间协调通信     | 系统调度、状态通知     |
| **集群管理**      | 监控节点状态       | 成员管理、故障检测     |
| **主节点选举**    | Leader 选举机制    | 避免脑裂、保证唯一性   |
| **分布式锁**      | 排他锁和共享锁     | 资源同步、并发控制     |
| **分布式队列**    | 顺序队列和同步队列 | 任务调度、数据同步     |

### 1.3 典型应用场景

#### 1.3.1 配置管理中心

```java
// 配置管理示例
public class ConfigManager {
    private ZooKeeper zk;
    private String configPath = "/app/config";

    public void updateConfig(String key, String value) throws Exception {
        String path = configPath + "/" + key;
        if (zk.exists(path, false) != null) {
            zk.setData(path, value.getBytes(), -1);
        } else {
            zk.create(path, value.getBytes(),
                     ZooDefs.Ids.OPEN_ACL_UNSAFE,
                     CreateMode.PERSISTENT);
        }
    }

    public String getConfig(String key) throws Exception {
        String path = configPath + "/" + key;
        byte[] data = zk.getData(path, true, null);
        return new String(data);
    }
}
```

#### 1.3.2 分布式锁实现

```java
// 分布式锁实现
public class DistributedLock {
    private ZooKeeper zk;
    private String lockPath = "/locks";
    private String currentLock;

    public boolean acquireLock(String lockName) throws Exception {
        String lockFullPath = lockPath + "/" + lockName + "-";
        currentLock = zk.create(lockFullPath, new byte[0],
                               ZooDefs.Ids.OPEN_ACL_UNSAFE,
                               CreateMode.EPHEMERAL_SEQUENTIAL);

        List<String> children = zk.getChildren(lockPath, false);
        Collections.sort(children);

        String lockNodeName = currentLock.substring(lockPath.length() + 1);
        int index = children.indexOf(lockNodeName);

        if (index == 0) {
            return true; // 获得锁
        } else {
            // 监听前一个节点
            String prevNode = children.get(index - 1);
            CountDownLatch latch = new CountDownLatch(1);

            Watcher watcher = new Watcher() {
                @Override
                public void process(WatchedEvent event) {
                    if (event.getType() == Event.EventType.NodeDeleted) {
                        latch.countDown();
                    }
                }
            };

            zk.exists(lockPath + "/" + prevNode, watcher);
            latch.await();
            return acquireLock(lockName); // 递归重试
        }
    }

    public void releaseLock() throws Exception {
        if (currentLock != null) {
            zk.delete(currentLock, -1);
        }
    }
}
```

## 2. ZooKeeper 架构与核心概念

### 2.1 数据模型

ZooKeeper 维护一个类似文件系统的树形命名空间，称为 **ZNode 树**。

#### 2.1.1 ZNode 类型

| 类型                                     | 特性             | 生命周期 | 应用场景     |
| ---------------------------------------- | ---------------- | -------- | ------------ |
| **持久节点 (PERSISTENT)**                | 手动删除才消失   | 永久     | 配置信息存储 |
| **临时节点 (EPHEMERAL)**                 | 会话结束自动删除 | 会话期间 | 服务注册发现 |
| **持久顺序节点 (PERSISTENT_SEQUENTIAL)** | 持久 + 自动编号  | 永久     | 分布式队列   |
| **临时顺序节点 (EPHEMERAL_SEQUENTIAL)**  | 临时 + 自动编号  | 会话期间 | 分布式锁     |

#### 2.1.2 ZNode 结构

```
ZNode 包含的信息：
├── data[]: 存储的数据内容（限制1MB）
├── ACL: 访问控制列表
├── stat: 状态信息
│   ├── version: 数据版本号
│   ├── cversion: 子节点版本号
│   ├── aversion: ACL版本号
│   ├── ephemeralOwner: 临时节点的会话ID
│   ├── dataLength: 数据长度
│   └── numChildren: 子节点数量
└── children[]: 子节点列表
```

### 2.2 集群架构

#### 2.2.1 集群角色

**Leader（领导者）**

-   事务请求的唯一调度和处理者
-   保证集群事务处理的顺序性
-   集群内部各服务的调度者

**Follower（跟随者）**

-   处理客户端非事务请求
-   转发事务请求给 Leader
-   参与事务投票和 Leader 选举

**Observer（观察者）**

-   处理客户端非事务请求
-   转发事务请求给 Leader
-   不参与任何投票（3.0+ 版本引入）

#### 2.2.2 集群部署模式

| 模式           | 描述                | 适用场景     |
| -------------- | ------------------- | ------------ |
| **单机部署**   | 单个 ZooKeeper 实例 | 开发测试环境 |
| **集群部署**   | 多台机器多个实例    | 生产环境     |
| **伪集群部署** | 单台机器多个实例    | 测试环境     |

**集群规模建议**：采用 2N+1 台服务器，最少 3 台，推荐 5 台或 7 台。

### 2.3 ZAB 协议

ZooKeeper Atomic Broadcast（ZAB）是 ZooKeeper 专门设计的崩溃恢复原子广播协议。

#### 2.3.1 协议阶段

**Phase 1: 发现阶段 (Discovery)**

-   选举产生 PeerLeader
-   收集 Follower 的最大事务提案编号

**Phase 2: 同步阶段 (Synchronization)**

-   Leader 与 Follower 进行数据同步
-   确保集群数据一致性

**Phase 3: 广播阶段 (Broadcast)**

-   Leader 处理客户端事务请求
-   通过两阶段提交协议广播事务

#### 2.3.2 协议模式

**崩溃恢复模式**

-   触发条件：集群启动、Leader 宕机、网络分区
-   主要流程：Leader 选举 → 数据同步 → 恢复服务

**消息广播模式**

-   触发条件：超过半数节点与 Leader 完成同步
-   主要流程：接收请求 → 生成提案 → 广播投票 → 提交执行

```
ZAB 协议状态转换：
启动 → 选举 → 同步 → 广播
  ↑      ↓      ↓      ↓
  └─── 故障恢复 ←──────┘
```

## 3. Watcher 事件监听机制

### 3.1 Watcher 工作原理

Watcher 是 ZooKeeper 提供的分布式数据发布/订阅功能的重要机制，允许客户端在 ZNode 上注册监听器。

#### 3.1.1 工作流程

```
客户端注册 Watcher → 服务端处理 Watcher → 事件触发 → 客户端回调
       ↓                    ↓              ↓           ↓
   getData/exists/      存储在WatchManager    事件通知    业务处理
   getChildren + true                      (一次性)
```

#### 3.1.2 Watcher 特性

| 特性         | 说明                       | 原因/影响                |
| ------------ | -------------------------- | ------------------------ |
| **一次性**   | 触发后自动移除             | 减轻服务端压力           |
| **异步通知** | 事件异步发送               | 网络延迟可能导致顺序问题 |
| **轻量级**   | 只通知事件类型，不包含数据 | 减少网络传输             |
| **串行执行** | 客户端串行处理回调         | 保证处理顺序             |

### 3.2 Watcher 编程实现

#### 3.2.1 注册 Watcher

```java
public class WatcherExample implements Watcher {
    private ZooKeeper zk;

    public void watchNode(String path) throws Exception {
        // 方式1: getData 注册监听
        byte[] data = zk.getData(path, this, null);

        // 方式2: exists 注册监听
        Stat stat = zk.exists(path, this);

        // 方式3: getChildren 注册监听
        List<String> children = zk.getChildren(path, this);
    }

    @Override
    public void process(WatchedEvent event) {
        System.out.println("接收到事件: " + event.getType());
        System.out.println("事件路径: " + event.getPath());

        try {
            // 重新注册监听（因为是一次性的）
            if (event.getType() != Event.EventType.NodeDeleted) {
                zk.getData(event.getPath(), this, null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### 3.2.2 事件类型映射

| 注册方式                       | 触发事件                                  | 说明                     |
| ------------------------------ | ----------------------------------------- | ------------------------ |
| `getData(path, watcher, stat)` | NodeDataChanged, NodeDeleted              | 节点数据变化、删除       |
| `exists(path, watcher)`        | NodeCreated, NodeDeleted, NodeDataChanged | 节点创建、删除、数据变化 |
| `getChildren(path, watcher)`   | NodeChildrenChanged                       | 子节点变化               |

### 3.3 数据同步策略

ZooKeeper 提供四种数据同步策略：

#### 3.3.1 DIFF 同步（直接差异化同步）

-   **适用场景**：Follower 的 lastZxid 在 Leader 的提案缓存范围内
-   **同步方式**：发送差异化的提案进行同步

#### 3.3.2 TRUNC + DIFF 同步（回滚+差异化同步）

-   **适用场景**：Follower 包含 Leader 没有的事务记录
-   **同步方式**：先回滚到共同点，再进行差异化同步

#### 3.3.3 TRUNC 同步（仅回滚同步）

-   **适用场景**：Follower 的 lastZxid 大于 Leader 的最大提案 ZXID
-   **同步方式**：仅进行回滚操作

#### 3.3.4 SNAP 同步（全量同步）

-   **适用场景**：Follower 与 Leader 差异过大或首次加入
-   **同步方式**：发送完整的数据快照

## 4. 会话管理与连接

### 4.1 会话生命周期

#### 4.1.1 会话状态

| 状态             | 描述     | 转换条件           |
| ---------------- | -------- | ------------------ |
| **CONNECTING**   | 连接中   | 客户端初始化连接   |
| **CONNECTED**    | 已连接   | 成功建立连接       |
| **RECONNECTING** | 重连中   | 连接断开，尝试重连 |
| **RECONNECTED**  | 重连成功 | 重新建立连接       |
| **CLOSE**        | 会话关闭 | 主动关闭或超时     |

#### 4.1.2 会话管理机制

**分桶策略**：

```java
// 会话超时时间计算
ExpirationTime = currentTime + sessionTimeout
ExpirationTime = (ExpirationTime / ExpirationInterval + 1) * ExpirationInterval

// ExpirationInterval = tickTime（默认2000ms）
```

**心跳检测**：

-   客户端定期发送心跳包
-   服务端更新会话的最后访问时间
-   超时会话会被自动清理

### 4.2 服务器状态

ZooKeeper 服务器具有四种工作状态：

| 状态          | 描述        | 角色     |
| ------------- | ----------- | -------- |
| **LOOKING**   | 寻找 Leader | 选举状态 |
| **FOLLOWING** | 跟随者状态  | Follower |
| **LEADING**   | 领导者状态  | Leader   |
| **OBSERVING** | 观察者状态  | Observer |

## 5. ACL 权限控制

### 5.1 权限模型

ZooKeeper 使用 ACL（Access Control List）进行权限控制，包含三个维度：

#### 5.1.1 权限模式（Scheme）

| 模式       | 说明        | 示例                     |
| ---------- | ----------- | ------------------------ |
| **IP**     | IP 地址控制 | ip:192.168.1.100         |
| **Digest** | 用户名密码  | digest:username:password |
| **World**  | 开放权限    | world:anyone             |
| **Super**  | 超级用户    | super:admin              |

#### 5.1.2 权限类型（Permission）

| 权限           | 描述                     | 操作                 |
| -------------- | ------------------------ | -------------------- |
| **CREATE (c)** | 创建子节点               | create               |
| **READ (r)**   | 读取节点数据和子节点列表 | getData, getChildren |
| **WRITE (w)**  | 写入节点数据             | setData              |
| **DELETE (d)** | 删除子节点               | delete               |
| **ADMIN (a)**  | 管理权限，设置 ACL       | setAcl, getAcl       |

#### 5.1.3 ACL 配置示例

```java
// 创建带权限的节点
List<ACL> acls = new ArrayList<>();

// IP权限：只允许特定IP访问
acls.add(new ACL(ZooDefs.Perms.ALL, new Id("ip", "192.168.1.100")));

// Digest权限：用户名密码验证
acls.add(new ACL(ZooDefs.Perms.READ | ZooDefs.Perms.WRITE,
                new Id("digest", DigestAuthenticationProvider.generateDigest("user:pass"))));

// 创建节点
zk.create("/secure-node", "data".getBytes(), acls, CreateMode.PERSISTENT);

// 添加认证信息
zk.addAuthInfo("digest", "user:pass".getBytes());
```

## 6. ZooKeeper 操作命令

### 6.1 基本命令

#### 6.1.1 节点操作

```bash
# 连接ZooKeeper
zkCli.sh -server localhost:2181

# 创建节点
create /app "application data"                    # 持久节点
create -e /temp "temporary data"                  # 临时节点
create -s /seq "sequence data"                    # 持久顺序节点
create -e -s /temp-seq "temp sequence data"       # 临时顺序节点

# 查看节点
ls /                                              # 查看根目录子节点
ls -s /app                                        # 查看节点状态信息
get /app                                          # 获取节点数据
get -s /app                                       # 获取节点数据和状态

# 更新节点
set /app "new data"                               # 更新数据
set /app "new data" 1                             # 指定版本更新

# 删除节点
delete /app                                       # 删除节点（无子节点）
deleteall /app                                    # 递归删除节点及子节点

# 监听节点
get /app watch                                    # 监听数据变化
ls /app watch                                     # 监听子节点变化
stat /app watch                                   # 监听状态变化
```

#### 6.1.2 管理命令

```bash
# 查看服务器状态
echo stat | nc localhost 2181
echo ruok | nc localhost 2181                     # 检查服务器是否正常
echo conf | nc localhost 2181                     # 查看配置信息
echo cons | nc localhost 2181                     # 查看连接信息
echo dump | nc localhost 2181                     # 查看会话信息
echo envi | nc localhost 2181                     # 查看环境变量
echo mntr | nc localhost 2181                     # 查看监控指标
```

### 6.2 节点路径表示

**绝对路径格式**：

-   根节点：`/`
-   子节点：`/parent/child`
-   多层节点：`/app/config/database`

**路径规则**：

-   必须以 `/` 开头
-   不能以 `/` 结尾（除根节点外）
-   路径元素不能包含特殊字符

## 7. 高可用与故障处理

### 7.1 集群容错机制

#### 7.1.1 故障场景分析

| 故障类型               | 集群状态   | 影响           | 处理方式              |
| ---------------------- | ---------- | -------------- | --------------------- |
| **单个 Follower 宕机** | 正常服务   | 无影响         | 自动剔除，数据不丢失  |
| **Leader 宕机**        | 重新选举   | 短暂中断       | 自动选举新 Leader     |
| **网络分区**           | 可能脑裂   | 部分节点不可用 | Quorum 机制保证一致性 |
| **超过半数节点宕机**   | 集群不可用 | 完全中断       | 需要人工干预恢复      |

#### 7.1.2 Quorum 机制

**过半数原则**：

-   3 节点集群：最多容忍 1 个节点故障
-   5 节点集群：最多容忍 2 个节点故障
-   7 节点集群：最多容忍 3 个节点故障

**计算公式**：

```
可容忍故障节点数 = (N - 1) / 2
最少存活节点数 = (N / 2) + 1
```

### 7.2 集群扩展

#### 7.2.1 动态扩容

**传统方式**（3.5 版本之前）：

1. **全部重启**：停止所有服务，修改配置，重新启动
2. **滚动重启**：逐个重启节点，保持集群可用

**动态配置**（3.5+ 版本）：

```bash
# 添加新节点
reconfig -add server.4=host4:2888:3888:participant;2181

# 移除节点
reconfig -remove 4

# 查看当前配置
config
```

#### 7.2.2 Chroot 特性

允许客户端设置命名空间，实现应用隔离：

```java
// 连接时指定 chroot
ZooKeeper zk = new ZooKeeper("localhost:2181/app1", 5000, watcher);

// 在 /app1 命名空间下操作
zk.create("/config", data, ACL, mode);  // 实际路径: /app1/config
```

## 8. 性能优化与最佳实践

### 8.1 性能特点

#### 8.1.1 读写性能

| 操作类型    | 性能特点               | 优化建议           |
| ----------- | ---------------------- | ------------------ |
| **读操作**  | 高性能，可扩展         | 增加 Observer 节点 |
| **写操作**  | 受限于 Leader 处理能力 | 控制写入频率       |
| **Watcher** | 异步通知，轻量级       | 避免频繁注册       |

#### 8.1.2 存储限制

-   **节点数据**：最大 1MB
-   **子节点数量**：理论无限，实际建议控制在万级别
-   **路径深度**：建议不超过 10 层

### 8.2 最佳实践

#### 8.2.1 架构设计

```java
// 良好的节点结构设计
/app
├── /config              # 配置信息
│   ├── /database       # 数据库配置
│   └── /cache          # 缓存配置
├── /services           # 服务注册
│   ├── /user-service   # 用户服务
│   └── /order-service  # 订单服务
├── /locks              # 分布式锁
└── /queues             # 分布式队列
```

#### 8.2.2 开发建议

1. **合理使用临时节点**：服务注册、分布式锁
2. **避免频繁 Watcher**：使用长连接，减少重连
3. **控制数据大小**：大数据存储在外部系统
4. **异常处理**：处理连接断开、会话超时等情况
5. **连接池管理**：复用 ZooKeeper 连接

#### 8.2.3 运维监控

**关键指标**：

-   连接数、会话数
-   请求响应时间
-   Leader 选举频率
-   节点数据大小
-   网络延迟

**监控命令**：

```bash
# 监控脚本示例
echo mntr | nc localhost 2181 | grep -E "(zk_packets|zk_outstanding|zk_avg_latency)"
```

Apache ZooKeeper 作为分布式协调服务的核心组件，为构建可靠的分布式系统提供了强大的基础设施。掌握其原理和最佳实践，是构建高可用分布式应用的关键技能。

### Stat 记录了哪些版本相关数据

-   **version：**当前 ZNode 版本
-   **cversion：**当前 ZNode 子节点版本
-   **aversion：**当前 ZNode 的 ACL 版本

### 权限控制

Access Control Lists，ACL，类似于 UNIX 文件系统的权限控制

### ZooKeeper 定义了几种权限？

-   CREATE
-   READ
-   WRITE
-   DELETE
-   ADMIN

### Zookeeper 默认端口

**2181**

### 如何创建一个 ZNode

-   create /app -e 临时
-   create /app -s 顺序

### 如何查看子节点

**ls /节点路径 [watch]**

### 获取指定节点信息

**get /节点路径 [watch]**

### 更新指定节点信息

**set /节点路径 data [version]**

### 删除指定节点

**delete /节点路径 [version]**

如果没有子节点，就能删除成功。如果有会提示，该节点不为空

### 会话 Session

客户端会话，客户端启动时，会与服务器建议 TCP 链接，连接成功后，客户端的生命周期开始，客户端和服务器通过**心跳检测**保持有效的的会话以及发请求并响应、监听 Watch 事件等

### 在 sessionTimeout 之内的会话，因服务器压力大、网络故障或客户端主动断开情况下，之前的会话还有效吗？

有效

### Watcher 事件监听器

ZooKeeper 允许用户在指定节点上注册 Watcher，当触发特定事件时，ZooKeeper 服务端会把相应的事件通知到相应的**客户端**上，属于 ZooKeeper 一个重要的特性

### Quorum

当集群中过半 UP 状态的进程组成了进程子集后，就可以正常的消息传播了，这样的一个子集称为 Quorum

### 同进程组的两个进程消息网络通信有哪两个特性

-   **完整性：**如果进程 a 收到进程 b 的消息 msg,那么 b 一定发送了消息 msg。
-   **前置性：**如果 msg1 是 msg2 的前置消息，那么当前进程务必先接收到 msg1,在接受 msg2。

### ZAB 三个阶段

-   **发现 (Discovery)**
-   **同步 (Synchronization)**
-   **广播 (Broadcast)**

### ZooKeeper 数据发布/订阅

发布者将数据发布到 ZooKeeper 上一个或多个节点上，订阅者从中订阅数据，从而动态获取数据的目的，实现配置信息的集中式管理和数据动态更新

### ZooKeeper 发布订阅的两种设计模式

-   **推(Push)：**服务端主动推数据给所有定于的客户端
-   **拉(Pull)：**客户端主动发请求来获取最新数据

### 客户端如何获取配置信息

启动时**主动到服务端拉取信息**，同时，在制定节点**注册 Watcher 监听**。一旦有配置变化，服务端就会实时通知订阅它的所有客户端

### Zookeeper 文件系统

-   Zookeeper 提供一个**多层级的节点命名空间**（节点称为 **znode**）。与文件系统不同的是，这些节点都可以设置关联的数据，而文件系统中只有文件节点可以存放数据，目录节点不行
-   Zookeeper 为了保证高吞吐和低延迟，在**内存中**维护了这个树状的目录结构，这种特性使得 Zookeeper 不能存放大量的数据，每个节点的存放**数据上限为 1M**

### Zookeeper Watcher 机制

-   Zookeeper 允许客户端向服务端的某个 Znode 注册一个 Watcher 监听，当服务端的一些指定事件触发了这个 Watcher，服务端会向指定客户端发送一个事件通知来实现分布式的通知功能，然后客户端根据 Watcher 通知状态和事件类型做出业务上的改变。
-   工作机制

-   -   客户端注册 watcher
    -   服务端处理 watcher
    -   客户端回调 watcher

-   Watcher 特性

-   -   **一次性：**无论是服务端还是客户端，一旦一个 Watcher 被触发，zk 都会将其从相应的**存储中移除**。这样的设计有效的**减轻了服务端的压力**，不然对于更新非常频繁的节点，服务端会不断的向客户端发送事件通知，无论对于网络还是服务端的压力都非常大
    -   **客户端串行执行：**客户端 Watcher 回调的过程是一个串行同步的过程
    -   **轻量：**

-   -   -   Watcher 通知非常简单，只会告诉客户端发生了事件，而不会说明事件的具体内容
        -   客户端向服务端注册 Watcher 的时候，并不会把客户端真实的 Watcher 对象实体传递到服务端，仅仅是在客户端请求中使用 boolean 类型属性进行了标记

-   **Watcher event 异步发送：**Watcher 的通知事件从 server 发送到 client 是异步的，这就存在一个问题，不同的客户端和服务器之间通过 socket 进行通信，由于**网络延迟或其他因素**导致客户端在不通的时刻监听到事件，由于 Zookeeper 本身提供了 ordering guarantee，即客户端监听事件后，才会感知它所监视 znode 发生了变化。所以我使用 Zookeeper 不能期望能够监控到节点每次的变化。Zookeeper 只能保证最终的一致性，而无法保证强一致性。
-   **注册 watcher：**getData、exists、getChildren
-   **触发 watcher：**create、delete、setData
-   当一个客户端连接到一个新的服务器上时，watch 将会被以任意会话事件触发。当与一个服务器失去连接的时候，是无法接收到 watch 的。而当 client 重新连接时，如果需要的话，所有先前注册过的 watch，都会被重新注册。通常这是完全透明的。只有在一个特殊情况下，watch 可能会丢失：对于一个未创建的 znode 的 exist watch，如果在客户端断开连接期间被创建了，并且随后在客户端连接上之前又删除了，这种情况下，这个 watch 事件可能会被丢失。

### 客户端注册 Watcher 实现

1. 调用 getData()/getChildren()/exist() 三个 API，传入 Watcher 对象
2. 标记请求 request，封装 Watcher 到 WatchRegistration
3. 封装成 Packet 对象，发服务端发送 request
4. 收到服务端响应后，将 Watcher 注册到 ZKWatcherManager 中进行管理
5. 请求返回，完成注册。

### 服务端处理 Watcher 实现

1. 服务端接收 Watcher 并存储
   接收到客户端请求，处理请求判断是否需要注册 Watcher，需要的话将数据节点的节点路径和 ServerCnxn（ServerCnxn 代表一个客户端和服务端的连接，实现了 Watcher 的 process 接口，此时可以看成一个 Watcher 对象）存储在 WatcherManager 的 WatchTable 和 watch2Paths 中去
2. Watcher 触发
   以服务端接收到 setData() 事务请求触发 NodeDataChanged 事件为例：

3.  1. 封装 WatchedEvent
       将通知状态（SyncConnected）、事件类型（NodeDataChanged）以及节点路径封装成一个 WatchedEvent 对象
    2. 查询 Watcher
       从 WatchTable 中根据节点路径查找 Watcher
    3. 没找到；说明没有客户端在该数据节点上注册过 Watcher
    4. 找到；提取并从 WatchTable 和 Watch2Paths 中删除对应 Watcher（从这里可以看出 Watcher 在服务端是一次性的，触发一次就失效了）

4. 调用 process 方法来触发 Watcher，process 主要就是通过 ServerCnxn 对应的 TCP 连接发送 Watcher 事件通知

### 客户端回调 Watcher

客户端 SendThread 线程接收事件通知，交由 EventThread 线程回调 Watcher，客户端的 Watcher 机制同样是一次性的，一旦被触发后，该 Watcher 就失效了

### ACL 权限控制机制 todo

**UGO（User/Group/Others）**

目前在 Linux/Unix 文件系统中使用，也是使用最广泛的权限控制方式。是一种粗粒度的文件系统权限控制模式。

**ACL（Access Control List）访问控制列表**

包括三个方面：

权限模式（Scheme）

（1）IP：从 IP 地址粒度进行权限控制

（2）Digest：最常用，用类似于 username:password 的权限标识来进行权限配置，便于区分不同应用来进行权限控制

（3）World：最开放的权限控制方式，是一种特殊的 digest 模式，只有一个权限标识“world:anyone”

（4）Super：超级用户

授权对象

授权对象指的是权限赋予的用户或一个指定实体，例如 IP 地址或是机器灯。

权限 Permission

（1）CREATE：数据节点创建权限，允许授权对象在该 Znode 下创建子节点

（2）DELETE：子节点删除权限，允许授权对象删除该数据节点的子节点

（3）READ：数据节点的读取权限，允许授权对象访问该数据节点并读取其数据内容或子节点列表等

（4）WRITE：数据节点更新权限，允许授权对象对该数据节点进行更新操作

（5）ADMIN：数据节点管理权限，允许授权对象对该数据节点进行 ACL 相关设置操作

## Chroot 特性

3.2.0 版本后，添加了 Chroot 特性，该特性允许每个客户端为自己设置一个命名空间。如果一个客户端设置了 Chroot，那么该客户端对服务器的任何操作，都将会被限制在其自己的命名空间下。通过设置 Chroot，能够将一个客户端应用于 Zookeeper 服务端的一颗子树相对应，在那些多个应用公用一个 Zookeeper 进群的场景下，对实现不同应用间的相互隔离非常有帮助

## 12. 会话管理

分桶策略：将类似的会话放在同一区块中进行管理，以便于 Zookeeper 对会话进行不同区块的隔离处理以及同一区块的统一处理。

分配原则：每个会话的“下次超时时间点”（ExpirationTime）

计算公式：

ExpirationTime\_ = currentTime + sessionTimeout

ExpirationTime = (ExpirationTime\_ / ExpirationInrerval + 1) \*

ExpirationInterval , ExpirationInterval 是指 Zookeeper 会话超时检查时间间隔，默认 tickTime

## 13. Zookeeper 对节点的 watch 监听通知是永久的吗？为什么不是永久的?

不是。官方声明：一个 Watch 事件是一个一次性的触发器，当被设置了 Watch 的数据发生了改变的时候，则服务器将这个改变发送给设置了 Watch 的客户端，以便通知它们。

为什么不是永久的，举个例子，如果服务端变动频繁，而监听的客户端很多情况下，每次变动都要通知到所有的客户端，给网络和服务器造成很大压力。

一般是客户端执行 getData(“/节点 A”,true)，如果节点 A 发生了变更或删除，客户端会得到它的 watch 事件，但是在之后节点 A 又发生了变更，而客户端又没有设置 watch 事件，就不再给客户端发送。

在实际应用中，很多情况下，我们的客户端不需要知道服务端的每一次变动，我只要最新的数据即可。

## 16. 说几个 zookeeper 常用的命令。

常用命令：ls get set create delete 等。

##

## 18. Zookeeper 下 Server 工作状态

服务器具有四种状态，分别是 LOOKING、FOLLOWING、LEADING、OBSERVING。

（1）LOOKING：寻 找 Leader 状态。当服务器处于该状态时，它会认为当前集群中没有 Leader，因此需要进入 Leader 选举状态。

（2）FOLLOWING：跟随者状态。表明当前服务器角色是 Follower。

（3）LEADING：领导者状态。表明当前服务器角色是 Leader。

（4）OBSERVING：观察者状态。表明当前服务器角色是 Observer。

## 15. 数据同步

整个集群完成 Leader 选举之后，Learner（Follower 和 Observer 的统称）回向 Leader 服务器进行注册。当 Learner 服务器想 Leader 服务器完成注册后，进入数据同步环节。

数据同步流程：（均以消息传递的方式进行）

Learner 向 Learder 注册

数据同步

同步确认

Zookeeper 的数据同步通常分为四类：

（1）直接差异化同步（DIFF 同步）

（2）先回滚再差异化同步（TRUNC+DIFF 同步）

（3）仅回滚同步（TRUNC 同步）

（4）全量同步（SNAP 同步）

在进行数据同步前，Leader 服务器会完成数据同步初始化：

peerLastZxid：

· 从 learner 服务器注册时发送的 ACKEPOCH 消息中提取 lastZxid（该 Learner 服务器最后处理的 ZXID）

minCommittedLog：

· Leader 服务器 Proposal 缓存队列 committedLog 中最小 ZXIDmaxCommittedLog：

· Leader 服务器 Proposal 缓存队列 committedLog 中最大 ZXID 直接差异化同步（DIFF 同步）

· 场景：peerLastZxid 介于 minCommittedLog 和 maxCommittedLog 之间先回滚再差异化同步（TRUNC+DIFF 同步）

· 场景：当新的 Leader 服务器发现某个 Learner 服务器包含了一条自己没有的事务记录，那么就需要让该 Learner 服务器进行事务回滚--回滚到 Leader 服务器上存在的，同时也是最接近于 peerLastZxid 的 ZXID 仅回滚同步（TRUNC 同步）

· 场景：peerLastZxid 大于 maxCommittedLog

全量同步（SNAP 同步）

· 场景一：peerLastZxid 小于 minCommittedLog

· 场景二：Leader 服务器上没有 Proposal 缓存队列且 peerLastZxid 不等于 lastProcessZxid

### 集群支持动态添加机器吗

水平扩容，Zookeeper 在这方面不太好。两种方式：

-   全部重启：关闭所有 Zookeeper 服务，修改配置之后启动。不影响之前客户端的会话。
-   逐个重启：在过半存活即可用的原则下，一台机器重启不影响整个集群对外提供服务。这是比较常用的方式。3.5 版本开始支持动态扩容。
