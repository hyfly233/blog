### 简述JVM内存模型

线程私有的运行时数据区: 程序计数器、Java 虚拟机栈、本地方法栈。

线程共享的运行时数据区：Java 堆、方法区。

### 简述程序计数器

程序计数器表示当前线程所执行的字节码的行号指示器。

程序计数器不会产生StackOverflowError和OutOfMemoryError。

### 简述虚拟机栈

Java 虚拟机栈用来描述 Java 方法执行的内存模型。线程创建时就会分配一个栈空间，线程结束后栈空间被回收。

栈中元素用于支持虚拟机进行方法调用，每个方法在执行时都会创建一个栈帧存储方法的局部变量表、操作栈、动态链接和返回地址等信息。

虚拟机栈会产生两类异常：

- StackOverflowError：线程请求的栈深度大于虚拟机允许的深度抛出。
- OutOfMemoryError：如果 JVM 栈容量可以动态扩展，虚拟机栈占用内存超出抛出。

### 简述本地方法栈

本地方法栈与虚拟机栈作用相似，不同的是虚拟机栈为虚拟机执行 Java 方法服务，本地方法栈为本地方法服务。可以将虚拟机栈看作普通的java函数对应的内存模型，本地方法栈看作由native关键词修饰的函数对应的内存模型。

本地方法栈会产生两类异常：

- StackOverflowError：线程请求的栈深度大于虚拟机允许的深度抛出。
- OutOfMemoryError：如果 JVM 栈容量可以动态扩展，虚拟机栈占用内存超出抛出。

### 简述JVM中的堆

堆主要作用是存放对象实例，Java 里几乎所有对象实例都在堆上分配内存，堆也是内存管理中最大的一块。Java的垃圾回收主要就是针对堆这一区域进行。 可通过 -Xms 和 -Xmx 设置堆的最小和最大容量。

堆会抛出 OutOfMemoryError异常。

### 简述方法区

方法区用于存储被虚拟机加载的类信息、常量、静态变量等数据。

JDK6之前使用永久代实现方法区，容易内存溢出。JDK7 把放在永久代的字符串常量池、静态变量等移出，JDK8 中抛弃永久代，改用在本地内存中实现的元空间来实现方法区，把 JDK 7 中永久代内容移到元空间。

方法区会抛出 OutOfMemoryError异常。

### 简述运行时常量池

运行时常量池存放常量池表，用于存放编译器生成的各种字面量与符号引用。一般除了保存 Class 文件中描述的符号引用外，还会把符号引用翻译的直接引用也存储在运行时常量池。除此之外，也会存放字符串基本类型。

JDK8之前，放在方法区，大小受限于方法区。JDK8将运行时常量池存放堆中。

### 简述直接内存

直接内存也称为堆外内存，就是把内存对象分配在JVM堆外的内存区域。这部分内存不是虚拟机管理，而是由操作系统来管理。 Java通过DriectByteBuffer对其进行操作，避免了在 Java 堆和 Native堆来回复制数据。

### 简述Java创建对象的过程

- 检查该指令的参数能否在常量池中定位到一个类的符号引用，并检查引用代表的类是否已被加载、解析和初始化，如果没有就先执行类加载。
- 通过检查通过后虚拟机将为新生对象分配内存。
- 完成内存分配后虚拟机将成员变量设为零值
- 设置对象头，包括哈希码、GC 信息、锁信息、对象所属类的类元信息等。
- 执行 init 方法，初始化成员变量，执行实例化代码块，调用类的构造方法，并把堆内对象的首地址赋值给引用变量。

### 简述JVM给对象分配内存的策略

- 指针碰撞：这种方式在内存中放一个指针作为分界指示器将使用过的内存放在一边，空闲的放在另一边，通过指针挪动完成分配。
- 空闲列表：对于 Java 堆内存不规整的情况，虚拟机必须维护一个列表记录哪些内存可用，在分配时从列表中找到一块足够大的空间划分给对象并更新列表记录。

### Java对象内存分配是如何保证线程安全的

第一种方法，采用CAS机制，配合失败重试的方式保证更新操作的原子性。该方式效率低。

第二种方法，每个线程在Java堆中预先分配一小块内存，然后再给对象分配内存的时候，直接在自己这块"私有"内存中分配。一般采用这种策略。

### 简述对象的内存布局

对象在堆内存的存储布局可分为对象头、实例数据和对齐填充。

1）对象头主要包含两部分数据： MarkWord、类型指针。

MarkWord 用于存储哈希码（HashCode）、GC分代年龄、锁状态标志位、线程持有的锁、偏向线程ID等信息。

类型指针即对象指向他的类元数据指针，如果对象是一个 Java 数组，会有一块用于记录数组长度的数据。

2）实例数据存储代码中所定义的各种类型的字段信息。

3）对齐填充起占位作用。HotSpot 虚拟机要求对象的起始地址必须是8的整数倍，因此需要对齐填充。

### 如何判断对象是否是垃圾

1）引用计数法：

设置引用计数器，对象被引用计数器加 1，引用失效时计数器减 1，如果计数器为 0 则被标记为垃圾。会存在对象间循环引用的问题，一般不使用这种方法。

2）可达性分析：

通过 GC Roots 的根对象作为起始节点，从这些节点开始，根据引用关系向下搜索，如果某个对象没有被搜到，则会被标记为垃圾。可作为 GC Roots 的对象包括虚拟机栈和本地方法栈中引用的对象、类静态属性引用的对象、常量引用的对象。

### 简述java的引用类型

- 强引用： 被强引用关联的对象不会被回收。一般采用 new 方法创建强引用。
- 软引用：被软引用关联的对象只有在内存不够的情况下才会被回收。一般采用 SoftReference 类来创建软引用。
- 弱引用：垃圾收集器碰到即回收，也就是说它只能存活到下一次垃圾回收发生之前。一般采用 WeakReference 类来创建弱引用。
- 虚引用： 无法通过该引用获取对象。唯一目的就是为了能在对象被回收时收到一个系统通知。虚引用必须与引用队列联合使用。

### 简述标记清除算法、标记整理算法和标记复制算法

- 标记清除算法：先标记需清除的对象，之后统一回收。这种方法效率不高，会产生大量不连续的碎片。
- 标记整理算法：先标记存活对象，然后让所有存活对象向一端移动，之后清理端边界以外的内存
- 标记复制算法：将可用内存按容量划分为大小相等的两块，每次只使用其中一块。当使用的这块空间用完了，就将存活对象复制到另一块，再把已使用过的内存空间一次清理掉。

### 简述分代收集算法

根据对象存活周期将内存划分为几块，不同块采用适当的收集算法。

一般将堆分为新生代和老年代，对这两块采用不同的算法。

新生代使用：标记复制算法

老年代使用：标记清除或者标记整理算法

### 简述Serial垃圾收集器

Serial垃圾收集器是单线程串行收集器。垃圾回收的时候，必须暂停其他所有线程。新生代使用标记复制算法，老年代使用标记整理算法。简单高效。

### 简述ParNew垃圾收集器

ParNew垃圾收集器可以看作Serial垃圾收集器的多线程版本，新生代使用标记复制算法，老年代使用标记整理算法。

### 简述Parallel Scavenge垃圾收集器

注重吞吐量，即 CPU运行代码时间/CPU耗时总时间（CPU运行代码时间+ 垃圾回收时间）。新生代使用标记复制算法，老年代使用标记整理算法。

### 简述CMS垃圾收集器

CMS垃圾收集器注重最短时间停顿。CMS垃圾收集器为最早提出的并发收集器，垃圾收集线程与用户线程同时工作。采用标记清除算法。该收集器分为初始标记、并发标记、并发预清理、并发清除、并发重置这么几个步骤。

- 初始标记：暂停其他线程(stop the world)，标记与GC roots直接关联的对象。
- 并发标记：可达性分析过程(程序不会停顿)。
- 并发预清理：查找执行并发标记阶段从年轻代晋升到老年代的对象，重新标记，暂停虚拟机（stop the world）扫描CMS堆中剩余对象。
- 并发清除：清理垃圾对象，(程序不会停顿)。
- 并发重置，重置CMS收集器的数据结构。

### 简述G1垃圾收集器

和Serial、Parallel Scavenge、CMS不同，G1垃圾收集器把堆划分成多个大小相等的独立区域（Region），新生代和老年代不再物理隔离。通过引入 Region 的概念，从而将原来的一整块内存空间划分成多个的小空间，使得每个小空间可以单独进行垃圾回收。

- 初始标记：标记与GC roots直接关联的对象。
- 并发标记：可达性分析。
- 最终标记：对并发标记过程中，用户线程修改的对象再次标记一下。
- 筛选回收：对各个Region的回收价值和成本进行排序，然后根据用户所期望的GC停顿时间制定回收计划并回收。

### 简述Minor GC

Minor GC指发生在新生代的垃圾收集，因为 Java 对象大多存活时间短，所以 Minor GC 非常频繁，一般回收速度也比较快。

### 简述Full GC

Full GC 是清理整个堆空间—包括年轻代和永久代。调用System.gc(),老年代空间不足，空间分配担保失败，永生代空间不足会产生full gc。

### 常见内存分配策略

大多数情况下对象在新生代 Eden 区分配，当 Eden 没有足够空间时将发起一次 Minor GC。

大对象需要大量连续内存空间，直接进入老年代区分配。

如果经历过第一次 Minor GC 仍然存活且能被 Survivor 容纳，该对象就会被移动到 Survivor 中并将年龄设置为 1，并且每熬过一次 Minor GC 年龄就加 1 ，当增加到一定程度（默认15）就会被晋升到老年代。

如果在 Survivor 中相同年龄所有对象大小的总和大于 Survivor 的一半，年龄不小于该年龄的对象就可以直接进入老年代。

MinorGC 前，虚拟机必须检查老年代最大可用连续空间是否大于新生代对象总空间，如果满足则说明这次 Minor GC 确定安全。如果不，JVM会查看HandlePromotionFailure 参数是否允许担保失败，如果允许会继续检查老年代最大可用连续空间是否大于历次晋升老年代对象的平均大小，如果满足将Minor GC，否则改成一次 FullGC。

### 简述JVM类加载过程

1）加载：

- 通过全类名获取类的二进制字节流。
- 将类的静态存储结构转化为方法区的运行时数据结构。
- 在内存中生成类的Class对象，作为方法区数据的入口。

2）验证：对文件格式，元数据，字节码，符号引用等验证正确性。

3）准备：在方法区内为类变量分配内存并设置为0值。

4）解析：将符号引用转化为直接引用。

5）初始化：执行类构造器clinit方法，真正初始化。

### 简述JVM中的类加载器

- BootstrapClassLoader启动类加载器：加载/lib下的jar包和类。 由C++编写。
- ExtensionClassLoader扩展类加载器： /lib/ext目录下的jar包和类。由Java编写。
- AppClassLoader应用类加载器，加载当前classPath下的jar包和类。由Java编写。

### 简述双亲委派机制

一个类加载器收到类加载请求之后，首先判断当前类是否被加载过。已经被加载的类会直接返回，如果没有被加载，首先将类加载请求转发给父类加载器，一直转发到启动类加载器，只有当父类加载器无法完成时才尝试自己加载。

加载类顺序：BootstrapClassLoader->ExtensionClassLoader->AppClassLoader->CustomClassLoader 检查类是否加载顺序： CustomClassLoader->AppClassLoader->ExtensionClassLoader->BootstrapClassLoader

### 双亲委派机制的优点

- 避免类的重复加载。相同的类被不同的类加载器加载会产生不同的类，双亲委派保证了Java程序的稳定运行。
- 保证核心API不被修改。
- 如何破坏双亲委派机制
- 重载loadClass()方法，即自定义类加载器。

### 如何构建自定义类加载器

新建自定义类继承自java.lang.ClassLoader，重写findClass、loadClass、defineClass方法

### JVM常见调优参数

- -Xms 初始堆大小
- -Xmx 最大堆大小
- -XX:NewSize 年轻代大小
- -XX:MaxNewSize 年轻代最大值
- -XX:PermSize 永生代初始值
- -XX:MaxPermSize 永生代最大值
- -XX:NewRatio 新生代与老年代的比例



# JVM 调优

# 1 调优层次

性能调优包含多个层次，比如:架构调优、代码调优、JVM调优、数据库调优、操作系统调优等。
 架构调优和代码调优是JVM调优的基础，其中架构调优是对系统影响最大的。

# 2 调优指标

- 吞吐量：运行用户代码的时间占总运行时间的行例 （总运行时间=程序的运行时间+内存回收的时间）；
- 暂停时间：执行垃圾收集时，程序的工作线程被暂停的时间；
- 内存占用：java堆区所占的内存大小；

这三者共同构成一个“不可能三角”。三者总体的表现会随着技术进步而越来越好。一款优秀的收集器通常最多同时满足其中的两项。

简单来说，主要抓住两点:

- 吞吐量
   吞吐量优先，意味着在单位时间内，STW的时间最短
- 暂停时间
   暂停时间优先，意味这尽可能让单次STW的时间最短

在设计(或使用)GC算法时，必须确定我们的目标：一个GC算法只可能针对两个目标之一（即只专注于较大吞吐量或最小暂停时间），或尝试找一个二者的折衷。

**现在标准，在最大吞吐量优先的情况下，降低停顿时间**。

# 3 JVM调优原则

## 3.1 优先原则

优先架构调优和代码调优，JVM优化是不得已的手段，大多数的Java应用不需要进行JVM优化

## 3.2 堆设置

参数-Xms和-Xmx，通常设置为相同的值，避免运行时要不断扩展JVM内存，建议扩大至3-4倍FullGC后的老年代空间占用。

## 3.3 年轻代设置

参数-Xmn，1-1.5倍FullGC之后的老年代空间占用。

避免新生代设置过小，当新生代设置过小时，会带来两个问题：一是minor GC次数频繁，二是可能导致 minor GC对象直接进老年代。当老年代内存不足时，会触发Full GC。
 避免新生代设置过大，当新生代设置过大时，会带来两个问题：一是老年代变小，可能导致Full GC频繁执行；二是 minor GC 执行回收的时间大幅度增加。

## 3.4 老年代设置

- 注重低延迟的应用
  - 老年代使用并发收集器，所以其大小需要小心设置，一般要考虑并发会话率和会话持续时间等一些参数
  - 如果堆设置偏小，可能会造成内存碎片、高回收频率以及应用暂停
  - 如果堆设置偏大，则需要较长的收集时间
- 吞吐量优先的应用
   一般吞吐量优先的应用都有一个较大的年轻代和一个较小的老年代。原因是，这样可以尽可能回收掉大部分短期对象，减少中期的对象，而老年代尽可能存放长期存活对象

## 3.5 方法区设置

基于jdk1.7版本，永久代：参数-XX:PermSize和-XX:MaxPermSize；
 基于jdk1.8版本，元空间：参数 -XX:MetaspaceSize和-XX:MaxMetaspaceSize；
 通常设置为相同的值，避免运行时要不断扩展，建议扩大至1.2-1.5倍FullGc后的永久带空间占用。

## 3.6 GC设置

### 3.6.1 GC发展阶段

Serial➡Parallel（并行) ➡CMS（并发)➡ G1➡ZGC
 截至jdk1.8 ，一共有7款不同垃圾收集器。每一款不同的垃圾收集器都有不同的特点，在具体使用的时候，需要根据具体的情况选择不同的垃圾回收器

| 垃圾收集器   | 分类       | 作用位置       | 使用算法            | 特点         | 使用场景                             |
| :----------- | :--------- | :------------- | :------------------ | :----------- | :----------------------------------- |
| Serial       | 串行       | 新生代         | 复制算法            | 响应速度优先 | 单CPU环境下client模式                |
| ParNew       | 并行       | 新生代         | 复制算法            | 响应速度优先 | 多CPU环境下Server模式下与CMS配合使用 |
| Parallel     | 并行       | 新生代         | 复制算法            | 吞吐量优先   | 适用于后台运算而不需要太多交互的场景 |
| Serial Old   | 串行       | 老年代         | 标记-整理           | 响应速度优先 | 单CPU环境下client模式                |
| Parallel Old | 并行       | 老年代         | 标记-整理           | 吞吐量优先   | 适用于后台运算而不需要太多交互的场景 |
| CMS          | 并发       | 老年代         | 标记-清除           | 响应速度优先 | 互联网或B/S业务                      |
| G1           | 并发、并行 | 新生代、老年代 | 复制算法、标记-整理 | 响应速度优先 | 面向服务端应用                       |

![img](https:////upload-images.jianshu.io/upload_images/9359211-c1d84fd40ccee598.png?imageMogr2/auto-orient/strip|imageView2/2/w/783/format/webp)

01.png

### 3.6.2 G1的适用场景

- 面向服务端应用，针对具有大内存、多处理器的机器。(在普通大小的堆里表现并不惊喜)
- 最主要的应用是需要低GC延迟并具有大堆的应用程序提供解决方案(G1通过每次只清理一部分而不是全部Region的增量式清理来保证每次GC停顿时间不会过长)
- 在堆大小约6GB或更大时，可预测的暂停时间可以低于0.5秒
- 用来替换掉JDK1.5中的CMS收集器，以下情况，使用G1可能比CMS好 
  - 超过50% 的java堆被活动数据占用
  - 对象分配频率或年代提升频率变化很大
  - GC停顿时间过长(大于0.5至1秒)
- 从经验上来说，整体而言： 
  - 小内存应用上，CMS大概率会优于 G1；
  - 大内存应用上，G1则很可能更胜一筹。
     这个临界点大概是在 6~8G 之间（经验值）

### 3.6.3 其他收集器适用场景

- 如果你想要最小化地使用内存和并行开销，请选择Serial Old(老年代) + Serial(年轻代)
- 如果你想要最大化应用程序的吞吐量，请选择Parallel Old(老年代) + Parallel(年轻代)
- 如果你想要最小化GC的中断或停顿时间，请选择CMS(老年代) + ParNew(年轻代)

# 4 JVM调优步骤

## 4.1 监控分析

分析GC日志及dump文件，判断是否需要优化，确定瓶颈问题点。

### 4.1.1 如何生成GC日志

常用参数部分会详细讲解如何生成GC日志

### 4.1.2 如何产生dump文件

#### 4.1.2.1 JVM的配置文件中配置

JVM启动时增加两个参数:



```mysql
# 出现OOME时生成堆dump:
-XX:+HeapDumpOnOutOfMemoryError
# 生成堆文件地址：
-XX:HeapDumpPath=/home/hadoop/dump/
```

#### 4.1.2.2 jmap生成

发现程序异常前通过执行指令，直接生成当前JVM的dump文件



```mysql
jmap -dump:file=文件名.dump [pid]
# 9257是指JVM的进程号
jmap -dump:format=b,file=testmap.dump 9257
```

第一种方式是一种事后方式，需要等待当前JVM出现问题后才能生成dump文件，实时性不高；
 第二种方式在执行时，JVM是暂停服务的，所以对线上的运行会产生影响。

所以建议第一种方式。

#### 4.1.2.3 第三方可视化工具生成

## 4.2 判断

如果各项参数设置合理，系统没有超时日志或异常信息出现，GC频率不高，GC耗时不高，那么没有必要进行GC优化，如果GC时间超过1-3秒，或者频繁GC，则必须优化。
 遇到以下情况，就需要考虑进行JVM调优：

- 系统吞吐量与响应性能不高或下降；
- Heap内存（老年代）持续上涨达到设置的最大内存值；
- Full GC 次数频繁；
- GC 停顿时间过长（超过1秒）；
- 应用出现OutOfMemory等内存异常；
- 应用中有使用本地缓存且占用大量内存空间；

## 4.3 确定目标

调优的最终目的都是为了应用程序使用最小的硬件消耗来承载更大的吞吐量或者低延迟。
 jvm调优主要是针对垃圾收集器的收集性能优化，减少GC的频率和Full GC的次数，令运行在虚拟机上的应用能够使用更少的内存、高吞吐量、低延迟。

下面列举一些JVM调优的量化目标参考实例，注意：不同应用的JVM调优量化目标是不一样的。

- 堆内存使用率<=70%;
- 老年代内存使用率<=70%;
- avgpause<=1秒;
- Full GC次数0或avg pause interval>=24小时 ;

## 4.4 调整参数

调优一般是从满足程序的内存使用需求开始的，之后是时间延迟的要求，最后才是吞吐量的要求。
 要基于这个步骤来不断优化，每一个步骤都是进行下一步的基础，不可逆行之。

## 4.5 对比调优前后指标差异

## 4.6 重复以上过程

## 4.7 应用

找到合适的参数，先在单台服务器上试运行，然后将这些参数应用到所有服务器，并进行后续跟踪。

# 5 JVM调优工具

## 5.1 jps

jps：JVM Process Status Tool
 jps可以查看Java进程，相当于Linux下的ps命令，只不过它只列出Java进程。

### 5.1.1 使用语法



```undefined
jps：列出Java程序进程ID和Main函数名称
jps -q：只输出进程ID
jps -m：输出传递给Java进程（主函数）的参数
jps -l：输出主函数的完整路径
jps -v：显示传递给Java虚拟的参数
```

### 5.1.2  示例

![img](https:////upload-images.jianshu.io/upload_images/9359211-af8464d854ebaa9c.png?imageMogr2/auto-orient/strip|imageView2/2/w/770/format/webp)

02.png

## 5.2 jstat

jstat：JVM Statistics Monitoring Tool
 jstat可以查看Java程序运行时相关信息，可以通过它查看堆信息的相关情况

### 5.2.1 使用语法



```xml
jstat -<options> [-t] [-h<lines>] <vmid> [<interval> [<count>]]
```

### 5.2.2 options可选值



```kotlin
-class：显示ClassLoader的相关信息
-compiler：显示JIT编译的相关信息
-gc：显示与GC相关信息
-gccapacity：显示各个代的容量和使用情况
-gccause：显示垃圾收集相关信息（同-gcutil），同时显示最后一次或当前正在发生的垃圾收集的诱发原因
-gcnew：显示新生代信息
-gcnewcapacity：显示新生代大小和使用情况
-gcold：显示老年代信息
-gcoldcapacity：显示老年代大小
-gcpermcapacity：显示永久代大小
-gcutil：显示垃圾收集信息
-printcompilation：输出JIT编译的方法信息
-t：在输出信息前加上一个Timestamp列，显示程序的运行时间
-h：可以在周期性数据输出后，输出多少行数据后，跟着一个表头信息
interval：用于指定输出统计数据的周期，单位为毫秒
count：用于指定一个输出多少次数据
```

### 5.2.3 示例

**示例一**
 显示GC相关信息



```undefined
jstat -gc 7063 500 4
7063 是进程ID ，采样时间间隔为500ms，采样数为4
```

![img](https:////upload-images.jianshu.io/upload_images/9359211-8c8e5c388600a358.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

03.png



```undefined
S0C：年轻代中第一个survivor（幸存区）的容量 （字节）
S1C：年轻代中第二个survivor（幸存区）的容量 (字节)
S0U：年轻代中第一个survivor（幸存区）目前已使用空间 (字节)
S1U：年轻代中第二个survivor（幸存区）目前已使用空间 (字节)
EC ：年轻代中Eden（伊甸园）的容量 (字节)
EU ：年轻代中Eden（伊甸园）⽬前已使⽤空间 (字节)
OC ：Old代的容量 (字节)
OU ：Old代目前已使用空间 (字节)
MC：metaspace(元空间)的容量 (字节)
MU：metaspace(元空间)目前已使用空间 (字节)
CCSC：压缩类空间大小
CCSU：压缩类空间使用大小
YGC ：从应用程序启动到采样时年轻代中gc次数
YGCT ：从应用程序启动到采样时年轻代中gc所用时间(s)
FGC ：从应用程序启动到采样时old代(全gc)gc次数
FGCT ：从应用程序启动到采样时old代(全gc)gc所用时间(s)
GCT：从应用程序启动到采样时gc用的总时间(s)
```

**示例二**
 显示垃圾收集相关信息



```undefined
jstat -gcutil 7737 5s 5
```

![img](https:////upload-images.jianshu.io/upload_images/9359211-25f2d1bf562cabdd.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

04.png



```undefined
S0 年轻代中第一个survivor（幸存区）已使用的占当前容量百分比
S1 年轻代中第二个survivor（幸存区）已使用的占当前容量百分比
E 年轻代中Eden（伊甸园）已使用的占当前容量百分比
O old代已使用的占当前容量百分比
M metaspace已使用的占当前容量百分比
CCS 压缩使用比例
YGC 从应用程序启动到采样时年轻代中gc次数
YGCT 从应用程序启动到采样时年轻代中gc所用时间(s)
FGC 从应用程序启动到采样时old代(全gc)gc次数
FGCT 从应用程序启动到采样时old代(全gc)gc所用时间(s)
GCT 从应用程序启动到采样时gc用的总时间(s)
```

## 5.3 jinfo

jinfo：Java Configuration Info
 jinfo可以用来查看正在运行的java程序的扩展参数，甚至支持运行时修改部分参数

### 5.3.1 使用语法



```css
jinfo [option] <pid>
```

### 5.3.2 option可选值



```bash
-flag <name> to print the value of the named VM flag
-flag [+|-]<name> to enable or disable the named VM flag
-flag <name>=<value> to set the named VM flag to the given value
-flags to print VM flags
-sysprops to print Java system properties
<no option> to print both of the above
-h | -help to print this help message
```

### 5.3.2 示例

**示例一**

查看堆的最大值



```undefined
~ jinfo -flag MaxHeapSize 8384
-XX:MaxHeapSize=10485760
```

**示例二**

查看所有参数



```csharp
~ jinfo -flags 8384
Attaching to process ID 8384, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.121-b13
Non-default VM flags: -XX:CICompilerCount=4 -XX:InitialHeapSize=10485760 -
XX:MaxHeapSize=10485760 -XX:MaxNewSize=3145728 -XX:MinHeapDeltaBytes=524288 -
XX:NewSize=3145728 -XX:OldSize=7340032 -XX:+UseCompressedClassPointers -
XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseParallelGC
Command line: -Xms10m -Xmx10m -Dfile.encoding=UTF-8
```

**示例三**

查看使用的垃圾回收器



```css
~ jinfo -flag UseParallelGC 8384
-XX:+UseParallelGC
~ jinfo -flag UseConcMarkSweepGC 8384
-XX:-UseConcMarkSweepGC
```

**示例四**

设置日志打印



```css
~ jinfo -flag PrintGCDetails 8384
-XX:-PrintGCDetails

~ jinfo -flag +PrintGCDetails 8384
~ jinfo -flag PrintGCDetails 8384
-XX:+PrintGCDetails

~ jinfo -flag -PrintGCDetails 8384
~ jinfo -flag PrintGCDetails 8384
-XX:-PrintGCDetails
```

## 5.4 jmap

jmap：Memory Map
 jmap可以查看堆内存使用状况，一般结合jhat使用。

### 5.4.1 使用语法



```c
 jmap [option] <pid>
        (to connect to running process)
 jmap [option] <executable <core>
        (to connect to a core file)
 jmap [option] [server_id@]<remote server IP or hostname>
        (to connect to remote debug server)
```

option：选项参数。
 pid：需要打印配置信息的进程ID。
 executable：产生核心dump的Java可执行文件。
 core：需要打印配置信息的核心文件。
 server-id：可选的唯一id，如果相同的远程主机上运行了多台调试服务器，用此选项参数标识服务器。
 remote server IP or hostname：远程调试服务器的IP地址或主机名。

### 5.4.2 option可选值



```c
<none> to print same info as Solaris pmap
-heap to print java heap summary
-histo[:live] to print histogram of java object heap; if the "live" suboption is specified, only count live objects

-clstats to print class loader statistics
-finalizerinfo to print information on objects awaiting finalization
-dump:<dump-options> to dump java heap in hprof binary format
-F force. Use with -dump:<dump-options> <pid> or -histo to force a heap dump or histogram when <pid> does not respond. The "live" suboption is not supported in this mode.

-h | -help to print this help message
-J<flag> to pass <flag> directly to the runtime system
```

no option： 查看进程的内存映像信息,类似 Solaris pmap 命令。
 heap： 显示Java堆详细信息
 histo[:live]： 显示堆中对象的统计信息
 clstats：打印类加载器信息
 finalizerinfo： 显示在F-Queue队列等待Finalizer线程执行finalizer方法的对象
 dump:<dump-options>：生成堆转储快照
 F：当-dump没有响应时，使用-dump或者-histo参数。在这个模式下，live子参数无效
 help：打印帮助信息
 J<flag>：指定传递给运行jmap的JVM的参数

**dump-options可选值**



```c
-live dump only live objects; if not specified,all objects in the heap are dumped.
-format=b binary format
-file=<file> dump heap to <file>
Example:jmap -dump:live,format=b,file=heap.bin <pid>
```

### 5.4.3 示例

**示例一**

显示Java堆详细信息



```undefined
jmap -heap pid
```

打印一个堆的摘要信息，包括使用的GC算法、堆配置信息和各内存区域内存使用信息



```cpp
~ jmap -heap 8985
Attaching to process ID 8985, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.121-b13

using thread-local object allocation.
Parallel GC with 8 thread(s)

Heap Configuration:
 MinHeapFreeRatio = 0
 MaxHeapFreeRatio = 100
 MaxHeapSize = 524288000 (500.0MB)
 NewSize = 174587904 (166.5MB)
 MaxNewSize = 174587904 (166.5MB)
 OldSize = 349700096 (333.5MB)
 NewRatio = 2
 SurvivorRatio = 8
 MetaspaceSize = 21807104 (20.796875MB)
 CompressedClassSpaceSize = 1073741824 (1024.0MB)
 MaxMetaspaceSize = 17592186044415 MB
 G1HeapRegionSize = 0 (0.0MB)
 
Heap Usage:
PS Young Generation
Eden Space:
 capacity = 131596288 (125.5MB)
 used = 127090976 (121.20339965820312MB)
 free = 4505312 (4.296600341796875MB)
 96.57641407028137% used
From Space:
 capacity = 21495808 (20.5MB)
 used = 21477712 (20.482742309570312MB)
 free = 18096 (0.0172576904296875MB)
 99.91581614424543% used
To Space:
 capacity = 21495808 (20.5MB)
 used = 0 (0.0MB)
 free = 21495808 (20.5MB)
 0.0% used
PS Old Generation
 capacity = 349700096 (333.5MB)
 used = 100703528 (96.03836822509766MB)
 free = 248996568 (237.46163177490234MB)
 28.79711191157351% used
 
2156 interned Strings occupying 152440 bytes.
```

**示例二**

显示堆中对象的统计信息



```css
jmap -histo:live pid 
```

其中包括每个Java类、对象数量、内存大小(单位：字节)、完全限定的类名。打印的虚拟机内部的类名称将会带有一个’*’前缀。如果指定了live子选项，则只计算活动的对象。



```dart
~ jmap -histo:live 8985
 num #instances #bytes class name
----------------------------------------------
 1: 3682 339156840 [B
 2: 3806 408160 [C
 3: 3794 91056 java.lang.String
 4: 593 67480 java.lang.Class
 5: 587 54568 [Ljava.lang.Object;
 6: 3273 52368 com.kkb.example.HeapInstanceTest
```

**示例三**

打印类加载器信息



```undefined
jmap -clstats pid 
```

-clstats是-permstat的替代方案，在JDK8之前，-permstat用来打印类加载器的数据打印Java堆内存的永久保存区域的类加载器的智能统计信息。对于每个类加载器而言，它的名称、活跃 度、地址、父类加载器、它所加载的类的数量和大小都会被打印。此外，包含的字符串数量和大小也会被打印。



```bash
~ jmap -clstats 8985
Attaching to process ID 8985, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.121-b13
finding class loader instances ..done.
computing per loader stat ..done.
please wait.. computing
liveness......................................................................
.............................done.
class_loader classes bytes parent_loader alive? type
<bootstrap> 517 969116 null live <internal>
0x00000007af095a08 0 0 0x00000007ae86f288 live 
java/util/ResourceBundle$RBClassLoader@0x00000007c00555e8
0x00000007ae86f288 9 29861 0x00000007ae8770f8 live 
sun/misc/Launcher$AppClassLoader@0x00000007c000f6a0
0x00000007ae8770f8 0 0 null live 
sun/misc/Launcher$ExtClassLoader@0x00000007c000fa48
total = 4 526 998977 N/A alive=4, dead=0 N/A
```

**示例四**

打印正等候回收的对象的信息



```undefined
jmap -finalizerinfo pid 
```



```bash
~ jmap -finalizerinfo 10067
Attaching to process ID 10067, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.121-b13
Number of objects pending for finalization: 0
```

Number of objects pending for finalization: 0 说明当前F-QUEUE队列中并没有等待Fializer线程执行final

**示例五**

生成堆转储快照dump文件



```swift
jmap -dump:format=b,file=heapdump.dump pid 
```

以hprof二进制格式转储Java堆到指定filename的文件中。live子选项是可选的。如果指定了live 子选项，堆中只有活动的对象会被转储。想要浏览heap dump，你可以使用jhat(Java堆分析⼯具)读取生成的文件。

这个命令执行，JVM会将整个heap的信息dump写入到⼀个文件，heap如果比较大的话，就会导致这个过程比较耗时，并且执行的过程中为了保证dump的信息是可靠的，所以会暂停应用， 线上系统慎用。



```swift
~ jmap -dump:format=b,file=heapdump.dump 10067 
Dumping heap to /Users/hadoop/heapdump.dump ...
```

## 5.5 jhat

jhat：Java Heap Analysis Tool

jhat 命令解析Java堆转储文件并启动一个 web server，然后用浏览器来查看、浏览 dump 出来的 heap。

jhat 命令支持预先设计的查询，比如显示某个类的所有实例。 还支持对象查询语言(OQL, Object Query Language)。 OQL有点类似SQL，专门用来查询堆转储。

### 5.5.1 使用语法



```css
jhat [ options ] heap-dump-file
```

### 5.5.2 options可选值



```c
-stack false|true
关闭对象分配调用栈跟踪(tracking object allocation call stack)。 如果分配位置信息在堆转储中不可用，则必须将此标志设置为 false。 默认值为 true 。

-refs false|true
关闭对象引用跟踪(tracking of references to objects)。 默认值为 true 。 默认情况下, 返回的指针是指向其他特定对象的对象，如反向链接或输入引用(referrers or incoming references), 会统计、计算堆中的所有对象。

-port port-number
设置 jhat HTTP server 的端口号。 默认值 7000 。

-exclude exclude-file
指定对象查询时需要排除的数据成员列表文件(a file that lists data members that should be excluded from the reachable objects query)。 例如, 如果文件列列出了 java.lang.String.value , 那么当从某个特定对象 Object o 计算可达的对象列表时, 引用路径涉及 java.lang.String.value 的都会被排除。

-baseline exclude-file
指定一个基准堆转储(baseline heap dump)。 在两个 heap dumps 中有相同 object ID 的对象会被标记为不是新的(marked as not being new)，其他对象被标记为新的(new)。 在比较两个不同的堆转储时很有用。

-debug int
设置 debug 级别。 0表示不输出调试信息。 值越大则表示输出更详细的 debug 信息。

-version
启动后只显示版本信息就退出

-h
显示帮助信息并退出。 同 -help

-help
显示帮助信息并退出。 同 -h

-J< flag >
因为jhat命令实际上会启动一个JVM来执行, 通过 -J 可以在启动JVM时传入一些启动参数。 例如, -J-Xmx512m 则指定运行jhat的Java虚拟机使用的最大堆内存为 512 MB。 如果需要使用多个JVM启动参数，则传多多个 -Jxxxxxx。
```

### 5.5.3 示例

利用jhat分析刚刚jmap输出的堆文件

![img](https:////upload-images.jianshu.io/upload_images/9359211-8f3722e2ee8b7167.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

05.png

这样就启动起来了一个简易的HTTP服务，端口号是7000，尝试一下用浏览器访问⼀下它，本地的可以通过[http://localhost:7000](https://links.jianshu.com/go?to=http%3A%2F%2Flocalhost%3A7000)就可以得到这样的页面：

**jhat启动后显示的html页面中包含有**:

- All classes including platform:显示出堆中所包含的所有的类
- Show all members of the rootset :从根集能引用到的对象
- Show instance counts for all classes (including platform/excluding platform):显示平台包括的所有类的实例数量
- Show heap histogram:堆实例的分布表
- Show finalizer summary:Finalizer 摘要
- Execute Object Query Language (OQL) query:执行对象查询语句（OQL）



```csharp
select a from [I a where a.length > 256 //查询长度大于256的数组
```

## 5.6 jstack

jstack：Java Stack Trace

jstack是java虚拟机自带的一种堆栈跟踪工具。jstack用于生成java虚拟机当前时刻的线程快照。线程快照是当前java虚拟机内每一条线程正在执行的方法堆栈的集合，生成线程快照的主要目的是定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致的长时间等待等。 线程出现停顿的时候通过jstack来查看各个线程的调用堆栈，就可以知道没有响应的线程到底在后台做什么事情，或者等待什么资源。

如果java程序崩溃生成core文件，jstack工具可以用来获得core文件的java stack和native stack的信息，从而可以轻松地知道java程序是如何崩溃和在程序何处发生问题。另外，jstack工具还可以附属到正在运行的java程序中，看到当时运行的java程序的java stack和native stack的信息, 如果现在运行的java程序呈现hung的状态，jstack是非常有用的。

### 5.6.1  使用语法



```css
jstack [ option ] pid 查看当前时间点，指定进程的dump堆栈信息。
jstack [ option ] pid > 文件 将当前时间点的指定进程的dump堆栈信息，写入到指定文件中。
注:若该文件不存在，则会自动生成；若该文件存在，则会覆盖源文件。
jstack [ option ] executable core 查看当前时间点，core文件的dump堆栈信息。
jstack [ option ] [server_id@]<remote server IP or hostname> 查看当前时间点，远程机器的dump堆栈信息。
```

### 5.6.2 option可选值



```java
-F 强制jstack。当进程挂起了，此时'jstack [-l] pid'是没有响应的，这时候可使用此参数来强制打印堆栈信息，一般情况不需要使用。
-m 打印java和native c/c++框架的所有栈信息。可以打印JVM的堆栈，以及Native的栈帧，一般应用排查不需要使用。
-l 长列表。打印关于锁的附加信息。例如属于java.util.concurrent的ownable synchronizers列表，会使得JVM停顿得⻓久得多（可能会差很多倍，⽐如普通的jstack可能⼏毫秒和⼀次GC没区别，加了-l 就是近一秒的时间），-l 建议不要用。一般情况不需要使用。
-h or -hel 打印帮助信息
```

在thread dump中，要留意下面几种状态

- 死锁，Deadlock（重点关注）
- 等待资源，Waiting on condition（重点关注）
- 等待获取监视器，Waiting on monitor entry（重点关注）
- 阻塞，Blocked（重点关注）
- 执行中，Runnable
- 暂停，Suspended
- 对象等待中，Object.wait() 或 TIMED_WAITING
- 停止，Parked

### 5.6.3 示例

**示例一**

![img](https:////upload-images.jianshu.io/upload_images/9359211-a5336054ced59773.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

06.png

**示例二**
 将指定进程的当前堆栈情况记录到某个⽂件中


![img](https:////upload-images.jianshu.io/upload_images/9359211-b4b9b688e75940c8.png?imageMogr2/auto-orient/strip|imageView2/2/w/696/format/webp)

07.png



**示例三**
 统计线程数


![img](https:////upload-images.jianshu.io/upload_images/9359211-e2229a53c73a7c02.png?imageMogr2/auto-orient/strip|imageView2/2/w/1020/format/webp)

08.png



**示例四**
 检测死锁


![img](https:////upload-images.jianshu.io/upload_images/9359211-ea6d6a76796993f9.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

09.png



![img](https:////upload-images.jianshu.io/upload_images/9359211-522a459795ab2da3.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

10.png

## 5.7 hprof

hprof：Heap/CPU Profiling Tool 能够展现CPU使用率，统计堆内存使用情况。

J2SE中提供了一个简单的命令行工具来对java程序的cpu和heap进行profiling，叫做HPROF。HPROF实际上是JVM中的一个native的库，它会在JVM启动的时候通过命令行参数来动态加载，并成为JVM进程的一部分。若要在java进程启动的时候使用HPROF，用户可以通过各种命令行参数类型来使用HPROF对java进程的heap或者（和）cpu进行profiling的功能。HPROF产生的profiling数据可以是二进制的，也可以是文本格式的。这些日志可以用来跟踪和分析java进程的性能问题和瓶颈，解决内存使用上不优的地方或者程序实现上的不优之处。二进制格式的日志还可以被JVM中的HAT工具来进行浏览和分析，用以观察java进程的heap中各种类型和数据的情况。在J2SE 5.0以后的版本中，HPROF已经被并入到一个叫做Java Virtual Machine Tool Interface（JVM TI）中。

### 5.7.1 使用语法



```css
java -agentlib:hprof[=options] ToBeProfiledClass
java -Xrunprof[:options] ToBeProfiledClass
javac -J-agentlib:hprof[=options] ToBeProfiledClass
```

### 5.7.2 options可选值



```ruby
Option Name and Value   Description                     Default
---------------------   -----------                     -------
heap=dump|sites|all     heap profiling                  all
cpu=samples|times|old   CPU usage                       off
monitor=y|n             monitor contention              n
format=a|b              text(txt) or binary output      a
file=<file>             write data to file              java.hprof[.txt]
net=<host>:<port>       send data over a socket         off
depth=<size>            stack trace depth               4
interval=<ms>           sample interval in ms           10
cutoff=<value>          output cutoff point             0.0001
lineno=y|n              line number in traces?          y
thread=y|n              thread in traces?               n
doe=y|n                 dump on exit?                   y
msa=y|n                 Solaris micro state accounting  n
force=y|n               force output to <file>          y
verbose=y|n             print messages about dumps      y
```

![img](https:////upload-images.jianshu.io/upload_images/9359211-e4a77581bdf3ec40.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

11.png

### 5.7.3 示例

**官方示例**

CPU Usage Sampling Profiling(cpu=samples)的例子
 下面每隔20毫秒采样CPU消耗信息，堆栈深度为3，生成的profile文件名称是java.hprof.txt，在当前目录。



```undefined
java -agentlib:hprof=cpu=samples,interval=20,depth=3 Hello
```

CPU Usage Times Profiling(cpu=times)的例子
 它相对于CPU Usage Sampling Profile能够获得更加细粒度的CPU消耗信息，能够细到每个⽅法调⽤的开始和结束，它的实现使用了字节码注入技术（BCI）



```bash
javac -J-agentlib:hprof=cpu=times Hello.java
```

Heap Allocation Profiling(heap=sites)的例子



```undefined
javac -J-agentlib:hprof=heap=sites Hello.java
```

Heap Dump(heap=dump)的例子
 它能比上面的Heap Allocation Profiling生成更详细的Heap Dump信息：



```swift
javac -J-agentlib:hprof=heap=dump Hello.java
```

**虽然在JVM启动参数中加入-Xrunprof:heap=sites参数可以生成CPU/Heap Profile文件，但对JVM性
 能影响非常大，不建议在线上服务器环境使用。**

**示例一**

统计方法耗时



```bash
classes java -agentlib:hprof=cpu=times,interval=10 com.kkb.example.HprofTest
Dumping CPU usage by timing methods ... done.
```



```css
classes vim java.hprof.txt
```

![img](https:////upload-images.jianshu.io/upload_images/9359211-a4958231c2a814b6.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

12.png

**示例二**

生成跟踪点类所占内存百分比



```bash
classes java -agentlib:hprof=heap=sites com.kkb.example.HprofTest
Dumping allocation sites ... done.
```



```css
classes vim java.hprof.txt
```

![img](https:////upload-images.jianshu.io/upload_images/9359211-2af9c6fc6cb64c34.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

13.png

## 5.8 jconsole

Jconsole：Java Monitoring and Management Console，Java 5引入，一个内置 Java 性能分析器，可以从命令行或在 GUI shell 中运行。您可以轻松地使用 JConsole来监控 Java 应用程序性能和跟踪Java 中的代码。

### 5.8.1 如何启动JConsole

如果是从命令行启动，使 JDK 在 PATH 上，运行 jconsole 即可。
 如果从 GUI shell 启动，找到 JDK 安装路径，打开 bin 文件夹，双击 jconsole 。

当分析工具弹出时（取决于正在运行的 Java 版本以及正在运行的 Java 程序数量），可能会出现一个对话框，要求输入一个进程的 URL 来连接，也可能列出许多不同的本地 Java 进程（有时包含JConsole 进程本身）来连接。
 如下图所示：想分析哪个程序就双击哪个进程。

![img](https:////upload-images.jianshu.io/upload_images/9359211-0a3b617cc864c706.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

14.png

### 5.8.2 如何设置JAVA程序运行时可以被JConsolse连接分析

本地程序（相对于开启JConsole的计算机），无需设置任何参数就可以被本地开启的JConsole连接（Java SE 6开始无需设置，之前还是需要设置运行时参数 -Dcom.sun.management.jmxremote ）

**JConsole如何连接远程机器的JAVA程序？**



```css
jconsole 192.168.0.1:8999
```

也可以在已经打开的JConsole界面操作，连接➡新建连接➡选择远程进程➡输入远程主机IP和端口号➡点击“连接”，如下图

![img](https:////upload-images.jianshu.io/upload_images/9359211-a39cca54bf737a29.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

15.png

### 5.8.3 示例

**示例一**
 进入视图后包括这六个标签：

- Overview: 显示有关JVM和监视值的概述信息

- Memory: 显示内存使用信息

- Threads: 显示线程使用信息

- Classes: 显示类装载信息

- VM Summary:显示java VM信息

- MBeans: 显示 MBeans

  ![img](https:////upload-images.jianshu.io/upload_images/9359211-5bda43ea298154e4.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

  16.png

上图描述有我们需要的信息，同时点击右键可以保存数据到CSV文件。

**内存页签相对于可视化的jstat 命令，用于监视受收集器管理的虚拟机内存。**

![img](https:////upload-images.jianshu.io/upload_images/9359211-629705f86715648b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

17.png

# 6 JVM参数

在JVM调整过程中，主要是对JVM参数做的调整，以下我们介绍主要参数。JVM参数有很多，其实我们直接使用默认的JVM参数，不去修改都可以满足大多数情况。但是如果你想在有限的硬件资源下，部署的系统达到最大的运行效率，那么进行相关的JVM参数设置是必不可少的。

JVM参数主要分为以下三种：标准参数、非标准参数、不稳定参数。

## 6.1 标准参数

标准参数，顾名思义，标准参数中包括功能以及输出的结果都是很稳定的，基本上不会随着JVM版本的变化而变化。

标准参数以-开头，如：java -version、java -jar等，通过java -help可以查询所有的标准参数，-help 也是⼀个标准参数。

## 6.2 非标准参数

非标准参数以-X开头，是标准参数的扩展。对应前面讲的标准化参数，这是非标准化参数。表示在将来的JVM版本中可能会发生改变，但是这类以-X开始的参数变化的比较小。
 我们可以通过 Java -X 命令来检索所有-X 参数。

我们可以通过设置非标准参数来配置堆的内存分配，常用的非标准参数有：

- -Xmn新生代内存的大小，包括Eden区和两个Survivor区的总和，写法如：-Xmn1024，-Xmn1024k，-Xmn1024m，-Xmn1g 。
- -Xms堆内存的最小值，默认值是总内存/64（且小于1G）。默认情况下，当堆中可用内存小于40%（这个值可以用-XX: MinHeapFreeRatio 调整，如-X:MinHeapFreeRatio=30）时，堆内存会开始增加，⼀直增加到-Xmx的大小。
- -Xmx堆内存的最大值，默认值是总内存/4（且小于1G）。默认情况下，当堆中可用内存大于70%（这个值可以用-XX: MaxHeapFreeRatio调整，如-X:MaxHeapFreeRatio =80）时，堆内存会开始减少，一直减小到-Xms的大小。
   ***如果Xms和Xmx都不设置，则两者大小会相同\*** 
- -Xss每个线程的栈内存，默认1M，⼀般来说是不需要改的。
- -Xrs减少JVM对操作系统信号的使用。
- -Xprof跟踪正运行的程序，并将跟踪数据在标准输出输出。适合于开发环境调试。
- -Xnoclassgc关闭针对class的gc功能。因为其阻至内存回收，所以可能会导致OutOfMemoryError错误，慎用。
- -Xincgc开启增量gc（默认为关闭）。这有助于减少长时间GC时应用程序出现的停顿，但由于可能和应用程序并发执行，所以会降低CPU对应用的处理能力。
- -Xloggc:file与-verbose:gc功能类似，只是将每次GC事件的相关情况记录到一个文件中，文件的位置最好在本地，以避免网络的潜在问题。

## 6.3 不稳定参数

这是我们日常开发中接触到最多的参数类型。这也是非标准化参数，相对来说不稳定，随着JVM版本的变化可能会发生变化，主要用于JVM调优和debug。

不稳定参数以-XX 开头，此类参数的设置很容易引起JVM 性能上的差异，使JVM存在极大的不稳定性。如果此类参数设置合理将大大提高JVM的性能及稳定性。

**不稳定参数分为三类**：

- 性能参数：用于JVM的性能调优和内存分配控制，如内存大小的设置
- 行为参数：用于改变JVM的基础行为，如GC的方式和算法的选择
- 调试参数：用于监控、打印、输出jvm的信息

**不稳定参数语法规则**：

- 布尔类型参数值： 
  - -XX:+
  - -XX:-
     示例：-XX:+UseG1GC，表示启用G1垃圾收集器
- 数字类型参数值：
   -XX:
   示例：-XX:MaxGCPauseMillis=500 ，表示设置GC的最大停顿时间是500ms
- 字符串类型参数值：
   -XX:
   示例：-XX:HeapDumpPath=./dump.core

## 6.4 常⽤参数



```undefined
–Xms4g -Xmx4g –Xmn1200m –Xss512k 
-XX:NewRatio=4 -XX:SurvivorRatio=8 -XX:MaxTenuringThreshold=15 
-XX:PermSize=100m -XX:MaxPermSize=256m 
-XX:MaxDirectMemorySize=1G -XX:+DisableExplicitGC
```

参数解析：

- -Xms4g：初始化堆内存大小为4GB，ms是memory start的简称，等价于-XX:InitialHeapSize。
- -Xmx4g：堆内存最大值为4GB，mx是memory max的简称，等价于-XX:MaxHeapSize。
- -Xmn1200m：设置年轻代大小为1200MB。增大年轻代后，将会减小老年代大小。此值对系统性能影响较大，**Sun官方推荐配置为整个堆的3/8**。
- -Xss512k：设置每个线程的堆栈大小。JDK5.0以后每个线程堆栈大小为1MB，以前每个线程堆栈大小为256K。应根据应用线程所需内存大小进行调整。在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在3000~5000左右。
- -XX:NewRatio=4：设置年轻代（包括Eden和两个Survivor区）与老年代的比值（除去持久代）。设置为4，则年轻代与老年代所占比值为1：4，年轻代占整个堆栈的1/5
- -XX:SurvivorRatio=8：设置年轻代中Eden区与Survivor区的大小比值。设置为8，则两个Survivor区与⼀个Eden区的比值为2:8，⼀个Survivor区占整个年轻代的1/10
- -XX:PermSize=100m：初始化永久代大小为100MB。
- -XX:MaxPermSize=256m：设置持久代大小为256MB。
- -XX:MaxTenuringThreshold=15：设置垃圾最大年龄。如果设置为0的话，则年轻代对象不经过Survivor区，直接进入老年代。对于老年代比较多的应用，可以提高效率。如果将此值设置为⼀个较大值，则年轻代对象会在Survivor区进行多次复制，这样可以增加对象在年轻代的存活时间，增加在年轻代即被回收的概率。
- -XX:MaxDirectMemorySize=1G：直接内存。报java.lang.OutOfMemoryError: Direct buffermemory异常可以上调这个值。
- -XX:+DisableExplicitGC：禁止运行期显式地调用System.gc()来触发fulll GC。
   注意: Java RMI的定时GC触发机制可通过配置-Dsun.rmi.dgc.server.gcInterval=86400来控制触发的时间。
- -XX:CMSInitiatingOccupancyFraction=60：老年代内存回收阈值，默认值为68。
- -XX:ConcGCThreads=4：CMS垃圾回收器并行线程线，推荐值为CPU核心数。
- -XX:ParallelGCThreads=8：新生代并行收集器的线程数。
- -XX:CMSMaxAbortablePrecleanTime=500：当abortable-preclean预清理阶段执行达到这个时间时就会结束。

***新生代、老年代、永久代的参数，如果不进性指定，虚拟机会子动选择合适的值，同时也会基于系统的开销自动调整\***。

### 6.4.1 -XX:+PrintFlagsInitial、-XX:+PrintFlagsFinal

Java 6（update 21oder 21之后）版本， HotSpot JVM 提供给了两个新的参数，在JVM启动后，在命令行中可以输出所有XX参数和值。
 -XX:+PrintFlagsInitial：查看初始值
 -XX:+PrintFlagsFinal：查看最终值（初始值可能被修改掉）
 让我们现在就了解一下新参数的输出。以 -client 作为参数的 -XX:+ PrintFlagsFinal 的结果是一个按字母排序的590个参数表格（注意，每个release版本参数的数量会不一样）

![img](https:////upload-images.jianshu.io/upload_images/9359211-f6b6c40fa48cfa9c.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

18.png

表格的每一行包括五列，来表示一个XX参数。第一列表示参数的数据类型，第二列是名称，第四列为值，第五列是参数的类别。第三列”=”表示第四列是参数的默认值，而”:=” 表明了参数被用户或者JVM赋值了。

如果我们只想看下所有XX参数的默认值，能够用一个相关的参数，-XX:+PrintFlagsInitial 。 用 -XX:+PrintFlagsInitial , 只是展示了第三列为“=”的数据（也包括那些被设置其他值的参数）。

然而，注意当与-XX:+PrintFlagsFinal 对比的时候，一些参数会丢失，大概因为这些参数是动态创建的。

![img](https:////upload-images.jianshu.io/upload_images/9359211-e0bd510bdb80be3e.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

19.png

### 6.4.2  -XX:+PrintCommandLineFlags

让我们看下这个参数，事实上这个参数非常有用: -XX:+PrintCommandLineFlags 。这个参数让JVM打印出那些已经被用户或者JVM设置过的详细的XX参数的名称和值。

换句话说，它列举出 -XX:+PrintFlagsFinal的结果中第三列有":="的参数。以这种方式， 我们可以用-XX:+PrintCommandLineFlags作为快捷方式来查看修改过的参数。看下面的例子。

![img](https:////upload-images.jianshu.io/upload_images/9359211-7846714fa9d3cd03.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

20.png

现在如果我们每次启动java 程序的时候设置 -XX:+PrintCommandLineFlags 并且输出到日志文件上，这样会记录下我们设置的JVM 参数对应用程序性能的影响。

### 6.4.3 GC日志相关

设置JVM GC格式日志的主要参数包括如下8个：

1. -XX:+PrintGC 输出简要GC日志
2. -XX:+PrintGCDetails 输出详细GC日志
3. -Xloggc:gc.log 输出GC日志到文件
4. -XX:+PrintGCTimeStamps 输出GC的时间戳（以JVM启动到当期的总时长的时间戳形式）
5. -XX:+PrintGCDateStamps 输出GC的时间戳（以日期的形式，如 2020-04-26T21:53:59.234+0800）
6. -XX:+PrintHeapAtGC 在进行GC的前后打印出堆的信息
7. -verbose:gc : 在JDK 8中，-verbose:gc是-XX:+PrintGC一个别称，日志格式等价于：-XX:+PrintGC。不过在JDK 9中 -XX:+PrintGC被标记为deprecated。
    -verbose:gc是一个标准的选项，-XX:+PrintGC是一个实验的选项，建议使用-verbose:gc 替代-XX:+PrintGC
8. -XX:+PrintReferenceGC 打印年轻代各个引用的数量以及时长

**开启GC日志**
 多种方法都能开启GC的日志功能，其中包括：使用-verbose:gc或-XX:+PrintGC这两个标志中的任意一个能创建基本的GC日志（这两个日志标志实际上互为别名，默认情况下的GC日志功能是关闭的）使用-XX:+PrintGCDetails标志会创建更详细的GC日志。
 推荐使用-XX:+PrintGCDetails标志（这个标志默认情况下也是关闭的）；通常情况下使用基本的GC日志很难诊断垃圾回收时发生的问题。

**开启GC时间提示**
 除了使用详细的GC日志，我们还推荐使用-XX:+PrintGCTimeStamps或者-XX:+PrintGCDateStamps，便于我们更精确地判断几次GC操作之间的时间。这两个参数之间的差别在于时间戳是相对于0（依据JVM启动的时间）的值，而日期戳（date stamp）是实际的日期字符串。由于日期戳需要进性格式化，所以它的效率可能会受轻微的影响，不过这种操作并不频繁，它造成的影响也很难被我们感知。

**指定GC日志路径**
 默认情况下GC日志直接输出到标准输出，不过使用-Xloggc:filename标志也能修改输出到某个文件。除了显式地使用-PrintGCDetails标志，否则使用-Xloggc会自动地开启基本日志模式。

使用日志循环（Log rotation）标志可以限制保存在GC日志中的数据量；对于需要长时间运行的服务器而言，这是一个非常有用的标志，否则累积几个月的数据很可能会耗尽服务器的磁盘。

**开启日志滚动输出**
 通过-XX:+UseGCLogfileRotation -XX:NumberOfGCLogfiles=N -XX:GCLogfileSize=N标志可以控制日志文件的循环。
 默认情况下，UseGCLogfileRotation标志是关闭的。它负责打开或关闭GC日志滚动记录功能的。要求必须设置 -Xloggc参数开启UseGCLogfileRotation标志后，默认的文件数目是0（意味着不作任何限制），默认的日志文件大小是0（同样也是不作任何限制）。因此，为了让日志循环功能真正生效，我们必须为所有这些标志设定值。

需要注意的是：

- 设置滚动日志文件的大小，必须大于8k。当前写日志文件大小超过该参数值时，日志将写入下一个文件
- 设置滚动日志文件的个数，必须大于等于1
- 必须设置 -Xloggc 参数

**开启语句**



```cpp
-XX:+PrintGCDetails 
-XX:+PrintGCDateStamps 
-Xloggc:/home/hadoop/gc.log 
-XX:+UseGCLogFileRotation 
-XX:NumberOfGCLogFiles=10 
-XX:GCLogFileSize=512k
```

**其他有用参数**
 -XX:+PrintGCApplicationStoppedTime 打印GC造成应用暂停的时间
 -XX:+PrintTenuringDistribution 在每次新生代 young GC时,输出幸存区中对象的年龄分布

**日志含义**

![img](https:////upload-images.jianshu.io/upload_images/9359211-50fb645114ba9e05.png?imageMogr2/auto-orient/strip|imageView2/2/w/810/format/webp)

21.png

![img](https:////upload-images.jianshu.io/upload_images/9359211-4d9ca119e850847b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1122/format/webp)

22.png

### 6.4.4 -XX:CMSFullGCsBeforeCompaction

CMSFullGCsBeforeCompaction 说的是，在上一次CMS并发GC执行过后，到底还要再执行多少次full GC才会做压缩。默认是0，也就是在默认配置下每次CMS GC顶不住了而要转入full GC的时候都会做压缩。 如果把CMSFullGCsBeforeCompaction配置为10，就会让上面说的第一个条件变成每隔10次真正的full GC才做一次压缩（而不是每10次CMS并发GC就做一次压缩，目前VM里没有这样的参数）。这会使full GC更少做压缩，也就更容易使CMS的old gen受碎片化问题的困扰。 本来这个参数就是用来配置降低full GC压缩的频率，以期减少某些full GC的暂停时间。CMS回退到full GC时用的算法是mark-sweep-compact，但compaction是可选的，不做的话碎片化会严重些但这次full GC的暂停时间会短些。这是个取舍。



```objectivec
-XX:+UseCMSCompactAtFullCollection
-XX:CMSFullGCsBeforeCompaction=10
```

两个参数必须同时使用才能生效。

### 6.4.5 -XX:HeapDumpPath

堆内存出现OOM的概率是所有内存耗尽异常中最高的，出错时的堆内信息对解决问题非常有帮助，所以给JVM设置这个参数(-XX:+HeapDumpOnOutOfMemoryError)，让JVM遇到OOM异常时能输出堆内信息，并通过（-XX:+HeapDumpPath）参数设置堆内存溢出快照输出的文件地址，这对于特别是对相隔数月才出现的OOM异常来说尤为重要。
 这两个参数通常配套使用：



```undefined
-XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=./
```

### 6.4.6 -XX:OnOutOfMemoryError



```bash
-XX:OnOutOfMemoryError=
"/Library/Java/JavaVirtualMachines/jdk1.8.0_121.jdk/Contents/Home/binjconsole"
```

表示发生OOM后，运行jconsole程序。这里可以不用加“”，因为jconsole.exe路径Program Files含有空格。

利用这个参数，我们可以在系统OOM后，自定义一个脚本，可以用来发送邮件告警信息，可以用来重启系统等等。

### 6.4.7 XX:InitialCodeCacheSize

JVM一个有趣的，但往往被忽视的内存区域是“代码缓存”，它是用来存储已编译方法生成的本地代码。代码缓存确实很少引起性能问题，但是一旦发生其影响可能是毁灭性的。如果代码缓存被占满，JVM会打印出一条警告消息，并切换到interpreted-only 模式：JIT编译器被停用，字节码将不再会被编译成机器码。因此，应用程序将继续运行，但运行速度会降低一个数量级，直到有人注意到这个问题。

就像其他内存区域一样，我们可以自定义代码缓存的大小。相关的参数是-XX:InitialCodeCacheSize 和-
 XX:ReservedCodeCacheSize，它们的参数和上面介绍的参数一样，都是字节值。

### 6.4.8 -XX:+UseCodeCacheFlushing

如果代码缓存不断增长，例如，因为热部署引起的内存泄漏，那么提高代码的缓存大小只会延缓其发生溢出。

为了避免这种情况的发生，我们可以尝试一个有趣的新参数：当代码缓存被填满时让JVM放弃一些编译代码。通过使用-XX:+UseCodeCacheFlushing 这个参数，我们至少可以避免当代码缓存被填满的时候JVM切换到interpreted-only 模式。

不过，我仍建议尽快解决代码缓存问题发生的根本原因，如找出内存泄漏并修复它。

