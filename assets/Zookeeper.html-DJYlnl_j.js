import{_ as r,c as o,f as a,o as l}from"./app-BOK5XMKI.js";const t={};function i(n,e){return l(),o("div",null,e[0]||(e[0]=[a('<h1 id="zookeeper" tabindex="-1"><a class="header-anchor" href="#zookeeper"><span>Zookeeper</span></a></h1><h3 id="什么是zookeeper" tabindex="-1"><a class="header-anchor" href="#什么是zookeeper"><span>什么是Zookeeper</span></a></h3><p>ZooKeeper 是一个开源的分布式程序协调服务，为分布式应用提供一致性服务，提供的功能包括：数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、主节点 Master 选举、配置维护，名字服务、分布式同步、分布式锁和分布式队列等。ZooKeeper 的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户</p><h3 id="zookeeper典型应用场景" tabindex="-1"><a class="header-anchor" href="#zookeeper典型应用场景"><span>ZooKeeper典型应用场景</span></a></h3><ul><li><p>**数据发布/订阅：**发布者将数据发布到 zk 上一个或多个节点上，订阅者从中订阅数据，从而动态获取数据的目的，实现配置信息的集中式管理和数据动态更新</p></li><li><p>**配置管理：**程序的配置信息放在 zk 的 <strong>znode</strong> 下，<strong>配置发生改变也就是 znode 发生变化</strong>，可以通过改变 zk 中某个目录节点的内容，利用 <strong>watcher 通知给各个客户端</strong>，从而更改配置</p></li><li><p><strong>负载均衡</strong></p></li><li><p>**命名服务：**在分布式系统中，通过使用命名服务，客户端应用能够根据指定名字来获取资源或服务的地址，提供者等信息</p></li><li><p><strong>分布式协调/通知：</strong></p></li><li><ul><li>对于系统调度来说：操作人员发送通知实际是通过控制台改变某个节点的状态，然后 zk 将这些变化发送给注册了这个节点的 watcher 的所有客户端</li><li>对于执行情况汇报：每个工作进程都在某个目录下创建一个临时节点，并携带工作的进度数据，这样汇总的进程可以监控目录子节点的变化获得工作进度的实时的全局情况</li></ul></li><li><p>**集群管理：**监控节点存活状态、运行请求等</p></li><li><p><strong>主节点 Master 选举：<strong>主节点挂掉了之后可以从备用的节点开始新一轮主节点选举，使用 Zookeeper 可以</strong>协助</strong>完成这个过程</p></li><li><p>**分布式锁：**提供两种锁：独占锁、共享锁</p></li><li><ul><li>独占锁：即一次只能有一个线程使用资源</li><li>共享锁：读锁共享，读写互斥，即可以有多线线程同时读同一个资源，如果要使用写锁也只能有一个线程使用</li></ul></li><li><p><strong>分布式队列：</strong></p></li><li><ul><li>同步队列：当一个队列的成员都聚齐时，这个队列才可用，否则一直等待所有成员到达。在文件系统中使用，在约定目录下创建临时目录节点，监听节点数目是否符合要求的数目</li><li>FIFO 队列：按照 FIFO 方式进行入队和出队操作</li></ul></li></ul><h3 id="zab-协议" tabindex="-1"><a class="header-anchor" href="#zab-协议"><span>ZAB 协议</span></a></h3><p><strong>ZAB 协议：<strong>Zookeeper 专门设计的一种</strong>支持崩溃恢复的原子广播协议</strong>。ZAB 协议包括两种基本的模式：<strong>崩溃恢复</strong>和<strong>消息广播</strong>。当整个 Zookeeper 集群<strong>刚刚启动</strong>或者 <strong>Leader 服务器宕机</strong>、<strong>重启</strong>或者<strong>网络故障</strong>导致<strong>没有过半的</strong>服务器与 Leader 服务器保持正常通信时，所有服务器进入<strong>崩溃恢复模式</strong>，首先<strong>选举产生新的 Leader 服务器</strong>，然后集群中 Follower 服务器开始与新的 Leader 服务器进行数据同步。当集群中<strong>超过半数</strong>机器与该 Leader 服务器完成数据同步之后，退出恢复模式进入<strong>消息广播模式</strong>，Leader 服务器开始接收客户端的事务请求生成事物提案来进行事务请求处理。</p><h3 id="zookeeper-怎么保证主从节点的状态同步" tabindex="-1"><a class="header-anchor" href="#zookeeper-怎么保证主从节点的状态同步"><span>Zookeeper 怎么保证主从节点的状态同步</span></a></h3><p>Zookeeper 的核心是<strong>ZAB 协议原子广播机制</strong>，保证了各个 server 之间的同步。Zab 协议有两种模式，恢复模式和广播模式。</p><ul><li><p><strong>恢复模式</strong></p></li><li><ul><li>当服务启动或者在领导者崩溃后，Zab就进入了恢复模式，当领导者被选举出来，且过半的 server 完成了和 leader 的状态同步以后，恢复模式就结束了。状态同步保证了 leader 和 server 具有相同的系统状态</li></ul></li><li><p><strong>广播模式</strong></p></li><li><ul><li>一旦 leader 已经和多数的 follower 进行了状态同步后，它就可以开始广播消息了，即进入广播状态。这时候当一个 server 加入 ZooKeeper 服务中，它会在恢复模式下启动，发现 leader，并和 leader 进行状态同步。待到同步结束，它也参与消息广播。ZooKeeper 服务一直维持在 Broadcast 状态，直到 leader 崩溃了或者 leader 失去了大部分的 followers 支持。</li></ul></li></ul><h3 id="zookeeper-有几种部署模式" tabindex="-1"><a class="header-anchor" href="#zookeeper-有几种部署模式"><span>Zookeeper 有几种部署模式</span></a></h3><p>三种部署模式：</p><ul><li><strong>单机部署</strong></li><li><strong>集群部署</strong></li><li>**伪集群部署：**一台机器启动多个 Zookeeper 实例运行</li></ul><h3 id="zookeeper-的通知机制" tabindex="-1"><a class="header-anchor" href="#zookeeper-的通知机制"><span>Zookeeper 的通知机制</span></a></h3><p>client 端会对某个 <strong>znode</strong> 建立一个 <strong>watcher 事件</strong>，当该 <strong>znode</strong> 发生变化时，这些 client 会收到 zk 的通知，然后 client 可以根据 znode 变化来做出业务上的改变等</p><h3 id="集群中为什么要有主节点" tabindex="-1"><a class="header-anchor" href="#集群中为什么要有主节点"><span>集群中为什么要有主节点</span></a></h3><p>在分布式环境中，有些业务逻辑只需要集群中的某一台机器进行执行，其他的机器可以共享这个结果，这样可以<strong>大大减少重复计算，提高性能</strong>，于是就需要进行 leader 选举</p><h3 id="集群中有-3-台服务器-其中一个节点宕机-这个时候-zookeeper-还可以使用吗" tabindex="-1"><a class="header-anchor" href="#集群中有-3-台服务器-其中一个节点宕机-这个时候-zookeeper-还可以使用吗"><span>集群中有 3 台服务器，其中一个节点宕机，这个时候 Zookeeper 还可以使用吗？</span></a></h3><p>可以继续使用，单数服务器只要没超过一半的服务器宕机就可以继续使用。集群规则为 2N+1 台，N &gt;0，即最少需要 3 台。</p><h3 id="zookeeper-宕机如何处理" tabindex="-1"><a class="header-anchor" href="#zookeeper-宕机如何处理"><span>Zookeeper 宕机如何处理？</span></a></h3><p>Zookeeper 本身也是集群，推荐配置不少于 3 个服务器。Zookeeper 自身也要保证当一个节点宕机时，其他节点会继续提供服务</p><ul><li>如果是一个 Follower 宕机，还有 2 台服务器提供访问，因为 Zookeeper 上的数据是有多个副本的，数据并不会丢失</li><li>如果是一个 Leader 宕机，Zookeeper 会选举出新的 Leader。</li></ul><p>Zookeeper 集群的机制是<strong>只要超过半数的节点正常，集群就能正常提供服务</strong>。只有在 Zookeeper 节点挂得太多，只剩一半或不到一半节点能工作，集群才失效。所以：</p><ul><li>3 个节点的 cluster 可以挂掉 1 个节点(leader 可以得到 2 票 &gt; 1.5)</li><li>2 个节点的 cluster 就不能挂掉任何1个节点了(leader 可以得到 1 票 &lt;= 1)</li></ul><h3 id="四种类型的数据节点-znode" tabindex="-1"><a class="header-anchor" href="#四种类型的数据节点-znode"><span>四种类型的数据节点 Znode</span></a></h3><ul><li>**持久节点(PERSISTENT)：**除非手动删除，否则节点一直存在于 Zookeeper 上</li><li>**临时节点(EPHEMERAL)：**临时节点的生命周期与客户端会话绑定，一旦客户端会话失效（客户端与 Zookeeper连接断开不一定会话失效），那么这个客户端创建的所有临时节点都会被移除</li><li>**持久顺序节点(PERSISTENT_SEQUENTIAL)：**基本特性同持久节点，只是增加了顺序属性，节点名后边会追加一个由父节点维护的自增整型数字</li><li>**临时顺序节点(EPHEMERAL_SEQUENTIAL)：**基本特性同临时节点，增加了顺序属性，节点名后边会追加一个由父节点维护的自增整型数字</li></ul><h3 id="zookeeper可以保证哪些分布式一致性特性" tabindex="-1"><a class="header-anchor" href="#zookeeper可以保证哪些分布式一致性特性"><span>ZooKeeper可以保证哪些分布式一致性特性</span></a></h3><ul><li>顺序一致性</li><li>原子性</li><li>单一视图</li><li>可靠性</li><li>实时性</li></ul><h3 id="zookeeper的数据模型" tabindex="-1"><a class="header-anchor" href="#zookeeper的数据模型"><span>ZooKeeper的数据模型</span></a></h3><p><strong>共享的树形结构</strong>，由一系列的 ZNode 数据节点组成。ZNode 存有数据信息，如版本号等等。ZNode 之间的层级关系，像文件系统中的目录结构一样。并且它是将数据存在内存中，这样可以提高吞吐、减少延迟</p><h3 id="如何识别请求的先后顺序" tabindex="-1"><a class="header-anchor" href="#如何识别请求的先后顺序"><span>如何识别请求的先后顺序</span></a></h3><p>ZooKeeper会给每个更新请求，分配一个<strong>全局唯一的递增编号（zxid)</strong>，编号的大小体现事务操作的先后顺序</p><h3 id="a是根节点-如何表达a子节点下的b节点" tabindex="-1"><a class="header-anchor" href="#a是根节点-如何表达a子节点下的b节点"><span>A是根节点，如何表达A子节点下的B节点</span></a></h3><p>/A/B</p><h3 id="集群角色" tabindex="-1"><a class="header-anchor" href="#集群角色"><span>集群角色</span></a></h3><p><strong>Leader</strong></p><p>（1）事务请求的唯一调度和处理者，保证集群事务处理的顺序性</p><p>（2）集群内部各服务的调度者</p><p><strong>Follower</strong></p><p>（1）处理客户端的非事务请求，转发事务请求给 Leader 服务器</p><p>（2）参与事务请求 Proposal 的投票</p><p>（3）参与 Leader 选举投票</p><p><strong>Observer</strong></p><p>（1）3.0 版本以后引入的一个服务器角色，在不影响集群事务处理能力的基础上提升集群的非事务处理能力</p><p>（2）处理客户端的非事务请求，转发事务请求给 Leader 服务器</p><p>（3）不参与任何形式的投票</p><h3 id="stat记录了哪些版本相关数据" tabindex="-1"><a class="header-anchor" href="#stat记录了哪些版本相关数据"><span>Stat记录了哪些版本相关数据</span></a></h3><ul><li>**version：**当前ZNode版本</li><li>**cversion：**当前ZNode子节点版本</li><li>**aversion：**当前ZNode的ACL版本</li></ul><h3 id="权限控制" tabindex="-1"><a class="header-anchor" href="#权限控制"><span>权限控制</span></a></h3><p>Access Control Lists，ACL，类似于UNIX文件系统的权限控制</p><h3 id="zookeeper定义了几种权限" tabindex="-1"><a class="header-anchor" href="#zookeeper定义了几种权限"><span>ZooKeeper定义了几种权限？</span></a></h3><ul><li>CREATE</li><li>READ</li><li>WRITE</li><li>DELETE</li><li>ADMIN</li></ul><h3 id="zookeeper默认端口" tabindex="-1"><a class="header-anchor" href="#zookeeper默认端口"><span>Zookeeper默认端口</span></a></h3><p><strong>2181</strong></p><h3 id="如何创建一个znode" tabindex="-1"><a class="header-anchor" href="#如何创建一个znode"><span>如何创建一个ZNode</span></a></h3><ul><li>create /app -e 临时</li><li>create /app -s 顺序</li></ul><h3 id="如何查看子节点" tabindex="-1"><a class="header-anchor" href="#如何查看子节点"><span>如何查看子节点</span></a></h3><p><strong>ls /节点路径 [watch]</strong></p><h3 id="获取指定节点信息" tabindex="-1"><a class="header-anchor" href="#获取指定节点信息"><span>获取指定节点信息</span></a></h3><p><strong>get /节点路径 [watch]</strong></p><h3 id="更新指定节点信息" tabindex="-1"><a class="header-anchor" href="#更新指定节点信息"><span>更新指定节点信息</span></a></h3><p><strong>set /节点路径 data [version]</strong></p><h3 id="删除指定节点" tabindex="-1"><a class="header-anchor" href="#删除指定节点"><span>删除指定节点</span></a></h3><p><strong>delete /节点路径 [version]</strong></p><p>如果没有子节点，就能删除成功。如果有会提示，该节点不为空</p><h3 id="会话session" tabindex="-1"><a class="header-anchor" href="#会话session"><span>会话Session</span></a></h3><p>客户端会话，客户端启动时，会与服务器建议TCP链接，连接成功后，客户端的生命周期开始，客户端和服务器通过<strong>心跳检测</strong>保持有效的的会话以及发请求并响应、监听Watch事件等</p><h3 id="在sessiontimeout之内的会话-因服务器压力大、网络故障或客户端主动断开情况下-之前的会话还有效吗" tabindex="-1"><a class="header-anchor" href="#在sessiontimeout之内的会话-因服务器压力大、网络故障或客户端主动断开情况下-之前的会话还有效吗"><span>在sessionTimeout之内的会话，因服务器压力大、网络故障或客户端主动断开情况下，之前的会话还有效吗？</span></a></h3><p>有效</p><h3 id="watcher事件监听器" tabindex="-1"><a class="header-anchor" href="#watcher事件监听器"><span>Watcher事件监听器</span></a></h3><p>ZooKeeper允许用户在指定节点上注册Watcher，当触发特定事件时，ZooKeeper服务端会把相应的事件通知到相应的<strong>客户端</strong>上，属于ZooKeeper一个重要的特性</p><h3 id="quorum" tabindex="-1"><a class="header-anchor" href="#quorum"><span>Quorum</span></a></h3><p>当集群中过半UP状态的进程组成了进程子集后，就可以正常的消息传播了，这样的一个子集称为Quorum</p><h3 id="同进程组的两个进程消息网络通信有哪两个特性" tabindex="-1"><a class="header-anchor" href="#同进程组的两个进程消息网络通信有哪两个特性"><span>同进程组的两个进程消息网络通信有哪两个特性</span></a></h3><ul><li>**完整性：**如果进程a收到进程b的消息msg,那么b一定发送了消息msg。</li><li>**前置性：**如果msg1是msg2的前置消息，那么当前进程务必先接收到msg1,在接受msg2。</li></ul><h3 id="zab三个阶段" tabindex="-1"><a class="header-anchor" href="#zab三个阶段"><span>ZAB三个阶段</span></a></h3><ul><li><strong>发现 (Discovery)</strong></li><li><strong>同步 (Synchronization)</strong></li><li><strong>广播 (Broadcast)</strong></li></ul><h3 id="zookeeper数据发布-订阅" tabindex="-1"><a class="header-anchor" href="#zookeeper数据发布-订阅"><span>ZooKeeper数据发布/订阅</span></a></h3><p>发布者将数据发布到ZooKeeper上一个或多个节点上，订阅者从中订阅数据，从而动态获取数据的目的，实现配置信息的集中式管理和数据动态更新</p><h3 id="zookeeper发布订阅的两种设计模式" tabindex="-1"><a class="header-anchor" href="#zookeeper发布订阅的两种设计模式"><span>ZooKeeper发布订阅的两种设计模式</span></a></h3><ul><li>**推(Push)：**服务端主动推数据给所有定于的客户端</li><li>**拉(Pull)：**客户端主动发请求来获取最新数据</li></ul><h3 id="客户端如何获取配置信息" tabindex="-1"><a class="header-anchor" href="#客户端如何获取配置信息"><span>客户端如何获取配置信息</span></a></h3><p>启动时<strong>主动到服务端拉取信息</strong>，同时，在制定节点<strong>注册Watcher监听</strong>。一旦有配置变化，服务端就会实时通知订阅它的所有客户端</p><h3 id="zookeeper文件系统" tabindex="-1"><a class="header-anchor" href="#zookeeper文件系统"><span>Zookeeper文件系统</span></a></h3><ul><li>Zookeeper 提供一个<strong>多层级的节点命名空间</strong>（节点称为 <strong>znode</strong>）。与文件系统不同的是，这些节点都可以设置关联的数据，而文件系统中只有文件节点可以存放数据，目录节点不行</li><li>Zookeeper 为了保证高吞吐和低延迟，在<strong>内存中</strong>维护了这个树状的目录结构，这种特性使得 Zookeeper 不能存放大量的数据，每个节点的存放<strong>数据上限为1M</strong></li></ul><h3 id="zookeeper-watcher-机制" tabindex="-1"><a class="header-anchor" href="#zookeeper-watcher-机制"><span>Zookeeper Watcher 机制</span></a></h3><ul><li><p>Zookeeper 允许客户端向服务端的某个 Znode 注册一个 Watcher 监听，当服务端的一些指定事件触发了这个 Watcher，服务端会向指定客户端发送一个事件通知来实现分布式的通知功能，然后客户端根据 Watcher 通知状态和事件类型做出业务上的改变。</p></li><li><p>工作机制</p></li><li><ul><li>客户端注册 watcher</li><li>服务端处理 watcher</li><li>客户端回调 watcher</li></ul></li><li><p>Watcher 特性</p></li><li><ul><li><strong>一次性：<strong>无论是服务端还是客户端，一旦一个 Watcher 被触发，zk 都会将其从相应的</strong>存储中移除</strong>。这样的设计有效的<strong>减轻了服务端的压力</strong>，不然对于更新非常频繁的节点，服务端会不断的向客户端发送事件通知，无论对于网络还是服务端的压力都非常大</li><li>**客户端串行执行：**客户端 Watcher 回调的过程是一个串行同步的过程</li><li><strong>轻量：</strong></li></ul></li><li><ul><li><ul><li>Watcher 通知非常简单，只会告诉客户端发生了事件，而不会说明事件的具体内容</li><li>客户端向服务端注册 Watcher 的时候，并不会把客户端真实的 Watcher 对象实体传递到服务端，仅仅是在客户端请求中使用 boolean 类型属性进行了标记</li></ul></li></ul></li><li><p><strong>Watcher event 异步发送：<strong>Watcher 的通知事件从 server 发送到 client 是异步的，这就存在一个问题，不同的客户端和服务器之间通过 socket 进行通信，由于</strong>网络延迟或其他因素</strong>导致客户端在不通的时刻监听到事件，由于 Zookeeper 本身提供了 ordering guarantee，即客户端监听事件后，才会感知它所监视 znode发生了变化。所以我使用 Zookeeper 不能期望能够监控到节点每次的变化。Zookeeper 只能保证最终的一致性，而无法保证强一致性。</p></li><li><p>**注册 watcher：**getData、exists、getChildren</p></li><li><p>**触发 watcher：**create、delete、setData</p></li><li><p>当一个客户端连接到一个新的服务器上时，watch 将会被以任意会话事件触发。当与一个服务器失去连接的时候，是无法接收到 watch 的。而当 client 重新连接时，如果需要的话，所有先前注册过的 watch，都会被重新注册。通常这是完全透明的。只有在一个特殊情况下，watch 可能会丢失：对于一个未创建的 znode的 exist watch，如果在客户端断开连接期间被创建了，并且随后在客户端连接上之前又删除了，这种情况下，这个 watch 事件可能会被丢失。</p></li></ul><h3 id="客户端注册-watcher-实现" tabindex="-1"><a class="header-anchor" href="#客户端注册-watcher-实现"><span>客户端注册 Watcher 实现</span></a></h3><ol><li>调用 getData()/getChildren()/exist() 三个 API，传入 Watcher 对象</li><li>标记请求 request，封装 Watcher 到 WatchRegistration</li><li>封装成 Packet 对象，发服务端发送 request</li><li>收到服务端响应后，将 Watcher 注册到 ZKWatcherManager 中进行管理</li><li>请求返回，完成注册。</li></ol><h3 id="服务端处理-watcher-实现" tabindex="-1"><a class="header-anchor" href="#服务端处理-watcher-实现"><span>服务端处理 Watcher 实现</span></a></h3><ol><li><p>服务端接收 Watcher 并存储 接收到客户端请求，处理请求判断是否需要注册 Watcher，需要的话将数据节点的节点路径和 ServerCnxn（ServerCnxn 代表一个客户端和服务端的连接，实现了 Watcher 的 process 接口，此时可以看成一个 Watcher 对象）存储在WatcherManager 的 WatchTable 和 watch2Paths 中去</p></li><li><p>Watcher 触发 以服务端接收到 setData() 事务请求触发 NodeDataChanged 事件为例：</p></li><li><ol><li>封装 WatchedEvent 将通知状态（SyncConnected）、事件类型（NodeDataChanged）以及节点路径封装成一个 WatchedEvent 对象</li><li>查询 Watcher 从 WatchTable 中根据节点路径查找 Watcher</li><li>没找到；说明没有客户端在该数据节点上注册过 Watcher</li><li>找到；提取并从 WatchTable 和 Watch2Paths 中删除对应 Watcher（从这里可以看出 Watcher 在服务端是一次性的，触发一次就失效了）</li></ol></li><li><p>调用 process 方法来触发 Watcher，process 主要就是通过 ServerCnxn 对应的 TCP 连接发送 Watcher 事件通知</p></li></ol><h3 id="客户端回调-watcher" tabindex="-1"><a class="header-anchor" href="#客户端回调-watcher"><span>客户端回调 Watcher</span></a></h3><p>客户端 SendThread 线程接收事件通知，交由 EventThread 线程回调 Watcher，客户端的 Watcher 机制同样是一次性的，一旦被触发后，该 Watcher 就失效了</p><h3 id="acl-权限控制机制-todo" tabindex="-1"><a class="header-anchor" href="#acl-权限控制机制-todo"><span>ACL 权限控制机制 todo</span></a></h3><p><strong>UGO（User/Group/Others）</strong></p><p>目前在 Linux/Unix 文件系统中使用，也是使用最广泛的权限控制方式。是一种粗粒度的文件系统权限控制模式。</p><p><strong>ACL（Access Control List）访问控制列表</strong></p><p>包括三个方面：</p><p>权限模式（Scheme）</p><p>（1）IP：从 IP 地址粒度进行权限控制</p><p>（2）Digest：最常用，用类似于 username:password 的权限标识来进行权限配置，便于区分不同应用来进行权限控制</p><p>（3）World：最开放的权限控制方式，是一种特殊的 digest 模式，只有一个权限标识“world:anyone”</p><p>（4）Super：超级用户</p><p>授权对象</p><p>授权对象指的是权限赋予的用户或一个指定实体，例如 IP 地址或是机器灯。</p><p>权限 Permission</p><p>（1）CREATE：数据节点创建权限，允许授权对象在该 Znode 下创建子节点</p><p>（2）DELETE：子节点删除权限，允许授权对象删除该数据节点的子节点</p><p>（3）READ：数据节点的读取权限，允许授权对象访问该数据节点并读取其数据内容或子节点列表等</p><p>（4）WRITE：数据节点更新权限，允许授权对象对该数据节点进行更新操作</p><p>（5）ADMIN：数据节点管理权限，允许授权对象对该数据节点进行 ACL 相关设置操作</p><h2 id="chroot-特性" tabindex="-1"><a class="header-anchor" href="#chroot-特性"><span>Chroot 特性</span></a></h2><p>3.2.0 版本后，添加了 Chroot 特性，该特性允许每个客户端为自己设置一个命名空间。如果一个客户端设置了 Chroot，那么该客户端对服务器的任何操作，都将会被限制在其自己的命名空间下。通过设置 Chroot，能够将一个客户端应用于 Zookeeper 服务端的一颗子树相对应，在那些多个应用公用一个 Zookeeper 进群的场景下，对实现不同应用间的相互隔离非常有帮助</p><h2 id="_12-会话管理" tabindex="-1"><a class="header-anchor" href="#_12-会话管理"><span>12. 会话管理</span></a></h2><p>分桶策略：将类似的会话放在同一区块中进行管理，以便于 Zookeeper 对会话进行不同区块的隔离处理以及同一区块的统一处理。</p><p>分配原则：每个会话的“下次超时时间点”（ExpirationTime）</p><p>计算公式：</p><p>ExpirationTime_ = currentTime + sessionTimeout</p><p>ExpirationTime = (ExpirationTime_ / ExpirationInrerval + 1) *</p><p>ExpirationInterval , ExpirationInterval 是指 Zookeeper 会话超时检查时间间隔，默认 tickTime</p><h2 id="_13-zookeeper-对节点的-watch-监听通知是永久的吗-为什么不是永久的" tabindex="-1"><a class="header-anchor" href="#_13-zookeeper-对节点的-watch-监听通知是永久的吗-为什么不是永久的"><span>13. Zookeeper 对节点的 watch 监听通知是永久的吗？为什么不是永久的?</span></a></h2><p>不是。官方声明：一个 Watch 事件是一个一次性的触发器，当被设置了 Watch的数据发生了改变的时候，则服务器将这个改变发送给设置了 Watch 的客户端，以便通知它们。</p><p>为什么不是永久的，举个例子，如果服务端变动频繁，而监听的客户端很多情况下，每次变动都要通知到所有的客户端，给网络和服务器造成很大压力。</p><p>一般是客户端执行 getData(“/节点 A”,true)，如果节点 A 发生了变更或删除，客户端会得到它的 watch 事件，但是在之后节点 A 又发生了变更，而客户端又没有设置 watch 事件，就不再给客户端发送。</p><p>在实际应用中，很多情况下，我们的客户端不需要知道服务端的每一次变动，我只要最新的数据即可。</p><h2 id="_16-说几个-zookeeper-常用的命令。" tabindex="-1"><a class="header-anchor" href="#_16-说几个-zookeeper-常用的命令。"><span>16. 说几个 zookeeper 常用的命令。</span></a></h2><p>常用命令：ls get set create delete 等。</p><h2 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h2><h2 id="_18-zookeeper-下-server-工作状态" tabindex="-1"><a class="header-anchor" href="#_18-zookeeper-下-server-工作状态"><span>18. Zookeeper 下 Server 工作状态</span></a></h2><p>服务器具有四种状态，分别是 LOOKING、FOLLOWING、LEADING、OBSERVING。</p><p>（1）LOOKING：寻 找 Leader 状态。当服务器处于该状态时，它会认为当前集群中没有 Leader，因此需要进入 Leader 选举状态。</p><p>（2）FOLLOWING：跟随者状态。表明当前服务器角色是 Follower。</p><p>（3）LEADING：领导者状态。表明当前服务器角色是 Leader。</p><p>（4）OBSERVING：观察者状态。表明当前服务器角色是 Observer。</p><h2 id="_15-数据同步" tabindex="-1"><a class="header-anchor" href="#_15-数据同步"><span>15. 数据同步</span></a></h2><p>整个集群完成 Leader 选举之后，Learner（Follower 和 Observer 的统称）回向Leader 服务器进行注册。当 Learner 服务器想 Leader 服务器完成注册后，进入数据同步环节。</p><p>数据同步流程：（均以消息传递的方式进行）</p><p>Learner 向 Learder 注册</p><p>数据同步</p><p>同步确认</p><p>Zookeeper 的数据同步通常分为四类：</p><p>（1）直接差异化同步（DIFF 同步）</p><p>（2）先回滚再差异化同步（TRUNC+DIFF 同步）</p><p>（3）仅回滚同步（TRUNC 同步）</p><p>（4）全量同步（SNAP 同步）</p><p>在进行数据同步前，Leader 服务器会完成数据同步初始化：</p><p>peerLastZxid：</p><p>· 从 learner 服务器注册时发送的 ACKEPOCH 消息中提取 lastZxid（该Learner 服务器最后处理的 ZXID）</p><p>minCommittedLog：</p><p>· Leader 服务器 Proposal 缓存队列 committedLog 中最小 ZXIDmaxCommittedLog：</p><p>· Leader 服务器 Proposal 缓存队列 committedLog 中最大 ZXID直接差异化同步（DIFF 同步）</p><p>· 场景：peerLastZxid 介于 minCommittedLog 和 maxCommittedLog之间先回滚再差异化同步（TRUNC+DIFF 同步）</p><p>· 场景：当新的 Leader 服务器发现某个 Learner 服务器包含了一条自己没有的事务记录，那么就需要让该 Learner 服务器进行事务回滚--回滚到 Leader服务器上存在的，同时也是最接近于 peerLastZxid 的 ZXID仅回滚同步（TRUNC 同步）</p><p>· 场景：peerLastZxid 大于 maxCommittedLog</p><p>全量同步（SNAP 同步）</p><p>· 场景一：peerLastZxid 小于 minCommittedLog</p><p>· 场景二：Leader 服务器上没有 Proposal 缓存队列且 peerLastZxid 不等于 lastProcessZxid</p><h3 id="集群支持动态添加机器吗" tabindex="-1"><a class="header-anchor" href="#集群支持动态添加机器吗"><span>集群支持动态添加机器吗</span></a></h3><p>水平扩容，Zookeeper 在这方面不太好。两种方式：</p><ul><li>全部重启：关闭所有 Zookeeper 服务，修改配置之后启动。不影响之前客户端的会话。</li><li>逐个重启：在过半存活即可用的原则下，一台机器重启不影响整个集群对外提供服务。这是比较常用的方式。3.5 版本开始支持动态扩容。</li></ul>',160)]))}const s=r(t,[["render",i],["__file","Zookeeper.html.vue"]]),h=JSON.parse('{"path":"/md/interview/java/framework/springcloud/Zookeeper.html","title":"Zookeeper","lang":"en-US","frontmatter":{},"headers":[{"level":3,"title":"什么是Zookeeper","slug":"什么是zookeeper","link":"#什么是zookeeper","children":[]},{"level":3,"title":"ZooKeeper典型应用场景","slug":"zookeeper典型应用场景","link":"#zookeeper典型应用场景","children":[]},{"level":3,"title":"ZAB 协议","slug":"zab-协议","link":"#zab-协议","children":[]},{"level":3,"title":"Zookeeper 怎么保证主从节点的状态同步","slug":"zookeeper-怎么保证主从节点的状态同步","link":"#zookeeper-怎么保证主从节点的状态同步","children":[]},{"level":3,"title":"Zookeeper 有几种部署模式","slug":"zookeeper-有几种部署模式","link":"#zookeeper-有几种部署模式","children":[]},{"level":3,"title":"Zookeeper 的通知机制","slug":"zookeeper-的通知机制","link":"#zookeeper-的通知机制","children":[]},{"level":3,"title":"集群中为什么要有主节点","slug":"集群中为什么要有主节点","link":"#集群中为什么要有主节点","children":[]},{"level":3,"title":"集群中有 3 台服务器，其中一个节点宕机，这个时候 Zookeeper 还可以使用吗？","slug":"集群中有-3-台服务器-其中一个节点宕机-这个时候-zookeeper-还可以使用吗","link":"#集群中有-3-台服务器-其中一个节点宕机-这个时候-zookeeper-还可以使用吗","children":[]},{"level":3,"title":"Zookeeper 宕机如何处理？","slug":"zookeeper-宕机如何处理","link":"#zookeeper-宕机如何处理","children":[]},{"level":3,"title":"四种类型的数据节点 Znode","slug":"四种类型的数据节点-znode","link":"#四种类型的数据节点-znode","children":[]},{"level":3,"title":"ZooKeeper可以保证哪些分布式一致性特性","slug":"zookeeper可以保证哪些分布式一致性特性","link":"#zookeeper可以保证哪些分布式一致性特性","children":[]},{"level":3,"title":"ZooKeeper的数据模型","slug":"zookeeper的数据模型","link":"#zookeeper的数据模型","children":[]},{"level":3,"title":"如何识别请求的先后顺序","slug":"如何识别请求的先后顺序","link":"#如何识别请求的先后顺序","children":[]},{"level":3,"title":"A是根节点，如何表达A子节点下的B节点","slug":"a是根节点-如何表达a子节点下的b节点","link":"#a是根节点-如何表达a子节点下的b节点","children":[]},{"level":3,"title":"集群角色","slug":"集群角色","link":"#集群角色","children":[]},{"level":3,"title":"Stat记录了哪些版本相关数据","slug":"stat记录了哪些版本相关数据","link":"#stat记录了哪些版本相关数据","children":[]},{"level":3,"title":"权限控制","slug":"权限控制","link":"#权限控制","children":[]},{"level":3,"title":"ZooKeeper定义了几种权限？","slug":"zookeeper定义了几种权限","link":"#zookeeper定义了几种权限","children":[]},{"level":3,"title":"Zookeeper默认端口","slug":"zookeeper默认端口","link":"#zookeeper默认端口","children":[]},{"level":3,"title":"如何创建一个ZNode","slug":"如何创建一个znode","link":"#如何创建一个znode","children":[]},{"level":3,"title":"如何查看子节点","slug":"如何查看子节点","link":"#如何查看子节点","children":[]},{"level":3,"title":"获取指定节点信息","slug":"获取指定节点信息","link":"#获取指定节点信息","children":[]},{"level":3,"title":"更新指定节点信息","slug":"更新指定节点信息","link":"#更新指定节点信息","children":[]},{"level":3,"title":"删除指定节点","slug":"删除指定节点","link":"#删除指定节点","children":[]},{"level":3,"title":"会话Session","slug":"会话session","link":"#会话session","children":[]},{"level":3,"title":"在sessionTimeout之内的会话，因服务器压力大、网络故障或客户端主动断开情况下，之前的会话还有效吗？","slug":"在sessiontimeout之内的会话-因服务器压力大、网络故障或客户端主动断开情况下-之前的会话还有效吗","link":"#在sessiontimeout之内的会话-因服务器压力大、网络故障或客户端主动断开情况下-之前的会话还有效吗","children":[]},{"level":3,"title":"Watcher事件监听器","slug":"watcher事件监听器","link":"#watcher事件监听器","children":[]},{"level":3,"title":"Quorum","slug":"quorum","link":"#quorum","children":[]},{"level":3,"title":"同进程组的两个进程消息网络通信有哪两个特性","slug":"同进程组的两个进程消息网络通信有哪两个特性","link":"#同进程组的两个进程消息网络通信有哪两个特性","children":[]},{"level":3,"title":"ZAB三个阶段","slug":"zab三个阶段","link":"#zab三个阶段","children":[]},{"level":3,"title":"ZooKeeper数据发布/订阅","slug":"zookeeper数据发布-订阅","link":"#zookeeper数据发布-订阅","children":[]},{"level":3,"title":"ZooKeeper发布订阅的两种设计模式","slug":"zookeeper发布订阅的两种设计模式","link":"#zookeeper发布订阅的两种设计模式","children":[]},{"level":3,"title":"客户端如何获取配置信息","slug":"客户端如何获取配置信息","link":"#客户端如何获取配置信息","children":[]},{"level":3,"title":"Zookeeper文件系统","slug":"zookeeper文件系统","link":"#zookeeper文件系统","children":[]},{"level":3,"title":"Zookeeper Watcher 机制","slug":"zookeeper-watcher-机制","link":"#zookeeper-watcher-机制","children":[]},{"level":3,"title":"客户端注册 Watcher 实现","slug":"客户端注册-watcher-实现","link":"#客户端注册-watcher-实现","children":[]},{"level":3,"title":"服务端处理 Watcher 实现","slug":"服务端处理-watcher-实现","link":"#服务端处理-watcher-实现","children":[]},{"level":3,"title":"客户端回调 Watcher","slug":"客户端回调-watcher","link":"#客户端回调-watcher","children":[]},{"level":3,"title":"ACL 权限控制机制 todo","slug":"acl-权限控制机制-todo","link":"#acl-权限控制机制-todo","children":[]},{"level":2,"title":"Chroot 特性","slug":"chroot-特性","link":"#chroot-特性","children":[]},{"level":2,"title":"12. 会话管理","slug":"_12-会话管理","link":"#_12-会话管理","children":[]},{"level":2,"title":"13. Zookeeper 对节点的 watch 监听通知是永久的吗？为什么不是永久的?","slug":"_13-zookeeper-对节点的-watch-监听通知是永久的吗-为什么不是永久的","link":"#_13-zookeeper-对节点的-watch-监听通知是永久的吗-为什么不是永久的","children":[]},{"level":2,"title":"16. 说几个 zookeeper 常用的命令。","slug":"_16-说几个-zookeeper-常用的命令。","link":"#_16-说几个-zookeeper-常用的命令。","children":[]},{"level":2,"title":"","slug":"","link":"#","children":[]},{"level":2,"title":"18. Zookeeper 下 Server 工作状态","slug":"_18-zookeeper-下-server-工作状态","link":"#_18-zookeeper-下-server-工作状态","children":[]},{"level":2,"title":"15. 数据同步","slug":"_15-数据同步","link":"#_15-数据同步","children":[{"level":3,"title":"集群支持动态添加机器吗","slug":"集群支持动态添加机器吗","link":"#集群支持动态添加机器吗","children":[]}]}],"git":{"updatedTime":1711074643000,"contributors":[{"name":"hyfly233","username":"hyfly233","email":"hyfly233@outlook.com","commits":5,"url":"https://github.com/hyfly233"}]},"filePathRelative":"md/interview/java/framework/springcloud/Zookeeper.md"}');export{s as comp,h as data};
