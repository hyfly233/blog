## 性能监控与故障处理工具

### 命令行工具

#### jps

#### jinfo

#### jstack

#### jmap

#### jstat

#### jstatd

#### jcmd

### 图形化工具

#### jconsole

#### jmc

#### visualvm

### 远程连接

#### jmx

#### jstatd

## JVM 调优

### JVM 如何调优、调什么、目标

#### 内存方面

-   JVM 需要的内存总大小
-   各块内存分配，新生代，老年代，存活区
-   选择合适的垃圾回收算法，控制 GC 停顿次数和时间
-   解决内存泄漏的问题，辅助代码优化
-   内存热点，检查那些对象在系统中数量最大，辅助代码优化
-   死锁检查，辅助代码优化
-   Dump 线程详细信息：查看线程内部运行情况，查找竞争线程，辅助代码优化
-   CPU 热点，检查系统那些方法占用了大量 CPU 时间，辅助代码优化

#### 线程方面

### 调优步骤

-   监控 JVM 的状态，主要是内存、线程、代码、I/O 等
-   分析结果，判断是否需要优化
-   调整垃圾回收算法和内存分配，优化代码
-   不断重复监控、分析和调整，直到找到优化平衡点

### 调优目标

-   GC 的时间要足够小
-   GC 的次数要足够少
-   将转移到老年代的对象数量降低到最小
-   减少 Full GC 的执行时间
-   发生 Full GC 的间隔足够的长

### JVM 调优策略

-   减少创建对象的数量
-   减少使用全局变量和大对象
-   调整新生代、老年代的大小到最合适
-   选择合适的 GC 收集器，并设置合理的参数

### JVM 调优冷思考

-   多少的 Java 应用不需要在服务器上进行 GC 优化
-   多数导致 GC 问题的 Java 应用，都不是因为参数设置错误导致的，而是代码问题
-   在应用上线之前，先考虑将机器的 JVM 参数设置到最优
-   JVM 优化是最后不得已才采用的手段，优先是优化代码
-   在实际情况中，分析 JVM 情况优化代码比优化 JVM 本身要多得多
-   如下情况通常不用优化
    -   Minor GC 执行时间不到 50 ms
    -   Minor GC 执行不频繁，约 10 秒一次
    -   Full GC 执行时间不到 1 秒
    -   Full GC 执行不频繁，约 10 分钟一次

### JVM 调优经验

-   要注意 32 位和 64 位的区别，通常 32 位的仅支持 2 - 3 g 左右的内存
-   要注意 client 模式和 server 模式的选择
-   要想 GC 时间小必须要一个更小的堆，而要保证 GC 次数足够少，又必须保证一个更大的堆，这两个是冲突的，只能取其平衡
-   针对 JVM 堆的设置，一般通过 -Xms -Xmx 限定其最小最大值，防止垃圾收集器在最小、最大之间收缩堆而产生额外的时间开销，通常把最大、最小设置为相同的值
-   新生代和老年代将根据默认的比例（1 : 2）来分配堆内存，可以通过 NewRadio 来调整比例，也可以通过 -XX:newSize -XX:MaxNewSize 来设置其绝对大小，同样，为了防止新生的堆收缩，通常会把 -XX:newSize -XX:MaxNewSize 设置为相同大小
-   合理规划新生代和老年代的大小
-   如果应用存在大量的临时对象，应该选择更大的新生代；如果存在相对较多的持久对象，应该适当的增大老年代。在抉择时应该本着 Full GC 尽量少的原则，让老年代尽量缓存常用对象，JVM 的默认比例 1 : 2 也是这个道理
-   通过观察应用一段时间，看其在峰值时老年代会占用多少内存，在不影响 Full GC 的前提下，根据实际情况加大新生代，但应该给老年代至少预留 1/3 的增长空间
-   线程堆栈的设置：每个线程默认会开启 1 M 的堆栈，用于存放栈帧、调用参数、局部变量等，对于大多数应用而言这个默认值太大，一般 256 K 够用，在内存不变的情况下，减少每个线程的堆栈，可以产生更多的线程

#### 内存泄漏

-   内存泄漏导致系统崩溃前的一些现象，如：
    -   每次垃圾回收的时间越来越长，FullGC 时间也延长到好几秒
    -   FullGC 的次数越来越多，最频繁时间间隔不到 1 分钟，内存泄漏后是不会释放内存的
    -   老年代的内存越来越大，并且每次 FullGC 后老年代没有内存被释放
    -   老年代堆空间被占满
-   解决方案：一般根据垃圾回收前后情况对比，同时根据对象引用情况分析，辅助去查找泄漏点
-   堆栈溢出的情况：
    -   通常抛出 StackOverflowError
    -   一般是递归调用没退出，或者循环调用造成

# JVM 工具和 JVM 调优指南

## 1. 性能监控与故障处理工具

### 1.1 命令行工具

#### 1.1.1 jps（JVM Process Status Tool）

-   **功能**：显示系统内所有的 HotSpot 虚拟机进程
-   **用法**：`jps [options] [hostid]`
-   **常用参数**：
    -   `-l`：输出主类的全名，如果进程执行的是 Jar 包，输出 Jar 路径
    -   `-v`：输出虚拟机进程启动时 JVM 参数
    -   `-m`：输出传递给 Java 进程 main()函数的参数
-   **示例**：`jps -l -v`

#### 1.1.2 jinfo（Configuration Info for Java）

-   **功能**：实时查看和调整虚拟机各项参数
-   **用法**：`jinfo [option] pid`
-   **常用参数**：
    -   `-flag <name>`：查看指定的 JVM 参数值
    -   `-flag [+|-]<name>`：开启或关闭指定的 JVM 参数
    -   `-flag <name>=<value>`：设置指定的 JVM 参数值
    -   `-flags`：查看所有的 JVM 参数
-   **示例**：`jinfo -flag UseG1GC 12345`

#### 1.1.3 jstack（Stack Trace for Java）

-   **功能**：生成虚拟机当前时刻的线程快照
-   **用法**：`jstack [option] pid`
-   **常用参数**：
    -   `-F`：当正常输出的请求不被响应时，强制输出线程堆栈
    -   `-l`：除堆栈外，显示关于锁的附加信息
    -   `-m`：如果调用到本地方法的话，可以显示 C/C++的堆栈
-   **应用场景**：定位线程停顿、死锁、性能瓶颈等问题

#### 1.1.4 jmap（Memory Map for Java）

-   **功能**：生成堆转储快照（heap dump）
-   **用法**：`jmap [option] pid`
-   **常用参数**：
    -   `-dump`：生成 Java 堆转储快照
    -   `-finalizerinfo`：显示在 F-Queue 中等待 Finalizer 线程执行 finalize 方法的对象
    -   `-heap`：显示 Java 堆详细信息
    -   `-histo`：显示堆中对象统计信息
-   **示例**：`jmap -dump:format=b,file=heap.hprof 12345`

#### 1.1.5 jstat（JVM Statistics Monitoring Tool）

-   **功能**：监视虚拟机各种运行状态信息
-   **用法**：`jstat [option vmid [interval[s|ms] [count]]]`
-   **常用选项**：
    -   `-gc`：监视 Java 堆状况，包括 Eden 区、两个 Survivor 区、老年代等
    -   `-gccapacity`：监视内容与-gc 基本相同，但输出主要关注 Java 堆各个区域使用到的最大、最小空间
    -   `-gcutil`：监视内容与-gc 基本相同，但输出主要关注已使用空间占总空间的百分比
    -   `-gccause`：与-gcutil 功能一样，但是会额外输出导致上一次 GC 产生的原因
-   **示例**：`jstat -gc 12345 1s 10`

#### 1.1.6 jstatd（JVM jstat Daemon）

-   **功能**：jstat 的守护进程，启动一个 RMI 服务器应用程序
-   **用法**：`jstatd [options]`
-   **作用**：提供远程监控 JVM 的能力

#### 1.1.7 jcmd（JVM Command）

-   **功能**：多功能命令行工具，可以用来导出堆、查看 Java 进程、导出线程信息等
-   **用法**：`jcmd <pid | main class> <command [options]>`
-   **常用命令**：
    -   `jcmd <pid> help`：查看可用命令
    -   `jcmd <pid> VM.flags`：查看 JVM 参数
    -   `jcmd <pid> GC.run_finalization`：执行 finalization

### 1.2 图形化工具

#### 1.2.1 JConsole

-   **功能**：基于 JMX 的可视化监视、管理工具
-   **特点**：
    -   内存监控：监控内存使用情况，可以手动执行 GC
    -   线程监控：监控线程使用情况，检测死锁
    -   类加载监控：监控类的加载情况
    -   MBean 监控：监控 MBean 的属性和操作
-   **启动方式**：
    -   本地：直接运行`jconsole`命令
    -   远程：需要在目标 JVM 启动时设置相关参数

#### 1.2.2 Java Mission Control（JMC）

-   **功能**：Oracle 官方提供的性能分析工具
-   **特点**：
    -   低开销的持续收集性能数据
    -   支持 Java Flight Recorder（JFR）
    -   提供详细的性能分析报告
    -   支持自定义事件监控
-   **优势**：生产环境可用，开销极低

#### 1.2.3 VisualVM

-   **功能**：多合一故障处理工具
-   **特点**：
    -   显示虚拟机进程以及进程的配置、环境信息
    -   监视应用程序的 CPU、GC、堆、方法区以及线程的信息
    -   dump 以及分析堆转储文件
    -   方法级的程序运行性能分析，找到被调用最多、运行时间最长的方法
    -   离线程序快照：收集程序的运行时配置、线程 dump、内存 dump 等信息建立一个快照
-   **插件支持**：支持大量第三方插件扩展功能

### 1.3 远程监控配置

#### 1.3.1 JMX 远程连接

**启用 JMX 远程监控**：

```bash
-Dcom.sun.management.jmxremote
-Dcom.sun.management.jmxremote.port=9999
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```

**安全配置**：

```bash
-Dcom.sun.management.jmxremote.authenticate=true
-Dcom.sun.management.jmxremote.password.file=/path/to/jmxremote.password
-Dcom.sun.management.jmxremote.access.file=/path/to/jmxremote.access
```

#### 1.3.2 jstatd 远程服务

**启动 jstatd 服务**：

```bash
# 创建安全策略文件
cat > jstatd.policy << EOF
grant codebase "file:\${java.home}/../lib/tools.jar" {
    permission java.security.AllPermission;
};
EOF

# 启动jstatd服务
jstatd -J-Djava.security.policy=jstatd.policy -p 1099
```

## 2. JVM 调优

### 2.1 调优概述

#### 2.1.1 调优目标

JVM 调优的核心目标是在保证系统稳定运行的前提下，最大化应用程序的性能：

**性能指标**：

-   **响应时间**：应用程序响应请求的时间
-   **吞吐量**：单位时间内处理的请求数量
-   **并发用户数**：系统能够同时支持的用户数量
-   **资源利用率**：CPU、内存、网络等资源的使用效率

**GC 性能目标**：

-   GC 暂停时间要足够短（一般要求低于 100ms）
-   GC 执行频率要合理（Minor GC 间隔 10 秒以上，Full GC 间隔 10 分钟以上）
-   减少对象晋升到老年代的数量
-   降低 Full GC 的执行时间和频率

#### 2.1.2 调优范围

**内存调优**：

-   确定 JVM 所需的总内存大小
-   合理分配各内存区域（新生代、老年代、Survivor 区）
-   选择合适的垃圾收集器和参数
-   解决内存泄漏问题
-   识别内存热点对象
-   优化对象生命周期管理

**线程调优**：

-   线程池配置优化
-   死锁检测和解决
-   线程竞争分析
-   线程栈大小调整

**代码调优**：

-   CPU 热点方法分析
-   I/O 操作优化
-   算法和数据结构优化
-   缓存策略优化

### 2.2 调优流程

#### 2.2.1 标准调优步骤

1. **建立监控基线**

    - 收集应用程序在正常负载下的性能数据
    - 记录 GC 日志、内存使用情况、线程状态等
    - 建立性能基准指标

2. **性能瓶颈分析**

    - 分析 GC 日志，识别 GC 问题
    - 使用 profiling 工具分析 CPU 热点
    - 检查内存使用模式和对象分配
    - 分析线程状态和并发情况

3. **制定优化方案**

    - 根据分析结果确定优化重点
    - 选择合适的 JVM 参数调整策略
    - 识别需要代码优化的部分

4. **参数调整与测试**

    - 在测试环境中调整 JVM 参数
    - 进行压力测试验证效果
    - 对比优化前后的性能指标

5. **生产环境部署**

    - 在非高峰期逐步部署优化参数
    - 持续监控系统性能变化
    - 根据实际运行情况进一步微调

6. **持续监控优化**
    - 建立长期监控机制
    - 定期分析性能趋势
    - 根据业务变化调整优化策略

#### 2.2.2 调优决策原则

**何时需要调优**：

-   Minor GC 频率过高（间隔小于 10 秒）
-   Minor GC 耗时过长（超过 50ms）
-   Full GC 频率过高（间隔小于 10 分钟）
-   Full GC 耗时过长（超过 1 秒）
-   内存使用率持续过高（超过 80%）
-   应用响应时间不满足要求

**何时不需要调优**：

-   Minor GC 执行时间小于 50ms 且频率合理
-   Full GC 执行时间小于 1 秒且频率合理
-   系统性能满足业务需求
-   资源利用率在合理范围内

### 2.3 调优策略

#### 2.3.1 应用层面优化策略

**对象创建优化**：

-   减少不必要的对象创建
-   复用对象（如 StringBuilder、线程池等）
-   使用对象池技术
-   避免在循环中创建对象

**内存使用优化**：

-   减少全局变量和静态变量的使用
-   及时释放不再使用的对象引用
-   使用合适的数据结构（如 ArrayList vs LinkedList）
-   避免创建过大的对象

**算法和数据结构优化**：

-   选择高效的算法实现
-   使用合适的集合类型
-   优化数据访问模式
-   减少不必要的计算

#### 2.3.2 JVM 层面优化策略

**堆内存配置**：

-   设置合适的堆大小（-Xms、-Xmx）
-   调整新生代和老年代的比例（-XX:NewRatio）
-   配置 Survivor 区大小（-XX:SurvivorRatio）
-   设置合适的晋升阈值（-XX:MaxTenuringThreshold）

**垃圾收集器选择**：

-   **G1 收集器**：适用于大堆内存、低延迟要求的应用
-   **CMS 收集器**：适用于响应时间敏感的应用
-   **Parallel 收集器**：适用于吞吐量优先的批处理应用
-   **ZGC/Shenandoah**：适用于超大堆、超低延迟要求的应用

**其他参数优化**：

-   线程栈大小调整（-Xss）
-   方法区大小设置（-XX:MetaspaceSize）
-   直接内存配置（-XX:MaxDirectMemorySize）

### 2.4 调优最佳实践

#### 2.4.1 调优理念

**代码优先原则**：

-   大部分性能问题源于代码层面，而非 JVM 参数配置
-   优先进行代码 Review 和算法优化
-   JVM 调优应该是最后的优化手段
-   在上线前就应该设置合理的 JVM 参数

**渐进式优化**：

-   一次只调整一个参数，观察效果
-   避免同时修改多个参数
-   详细记录每次调整的参数和效果
-   建立参数变更的回滚方案

**监控驱动优化**：

-   基于实际监控数据进行决策
-   避免盲目调参或经验主义
-   建立完善的监控体系
-   定期分析性能趋势

#### 2.4.2 常见调优误区

**盲目追求极致性能**：

-   过度优化可能导致系统不稳定
-   忽略了代码可维护性
-   没有考虑业务实际需求

**参数设置过于激进**：

-   堆内存设置过大导致 GC 时间过长
-   新生代设置过小导致频繁 Minor GC
-   并发线程数设置不当

**忽略业务特性**：

-   没有考虑应用的访问模式
-   忽略了对象的生命周期特征
-   不了解系统的负载特点

### 2.5 内存配置实践

#### 2.5.1 堆内存配置原则

**基本配置策略**：

-   **堆大小设置**：`-Xms`和`-Xmx`设置为相同值，避免动态扩展开销
-   **平台差异**：32 位 JVM 最大支持约 4GB 内存，64 位 JVM 理论上无限制
-   **运行模式**：Server 模式适用于服务器应用，Client 模式适用于桌面应用

**新生代和老年代比例**：

-   **默认比例**：新生代:老年代 = 1:2（可通过`-XX:NewRatio`调整）
-   **绝对大小**：使用`-XX:NewSize`和`-XX:MaxNewSize`设置绝对值
-   **统一设置**：为避免动态调整开销，建议将最小值和最大值设置相同

**Eden 和 Survivor 区配置**：

-   **默认比例**：Eden:Survivor1:Survivor2 = 8:1:1
-   **调整参数**：使用`-XX:SurvivorRatio`调整比例
-   **空间利用**：实际可用新生代空间为 90%（Eden + 1 个 Survivor）

#### 2.5.2 内存分配策略

**对象特征分析**：

-   **短生命周期对象多**：增大新生代比例，减少对象晋升
-   **长生命周期对象多**：适当增大老年代，减少 Full GC 频率
-   **大对象处理**：配置`-XX:PretenureSizeThreshold`直接分配到老年代

**实际配置步骤**：

1. **观察业务峰值**：统计老年代在峰值时的内存占用
2. **预留增长空间**：为老年代预留至少 1/3 的增长空间
3. **新生代优化**：在不影响 Full GC 的前提下，尽可能增大新生代
4. **持续监控**：根据实际运行情况进行微调

#### 2.5.3 线程栈配置

**栈大小优化**：

-   **默认大小**：每个线程默认 1MB 栈空间
-   **一般建议**：多数应用 256KB 已足够使用
-   **配置参数**：使用`-Xss256k`调整栈大小
-   **收益分析**：在相同内存下可以创建更多线程

**参数示例**：

```bash
# 基础内存配置
-Xms4g -Xmx4g                    # 堆内存4GB
-XX:NewRatio=2                   # 新生代:老年代 = 1:2
-XX:SurvivorRatio=8              # Eden:Survivor = 8:1
-Xss256k                         # 线程栈256KB

# 高级配置
-XX:MetaspaceSize=256m           # 元空间初始大小
-XX:MaxMetaspaceSize=512m        # 元空间最大大小
-XX:MaxDirectMemorySize=1g       # 直接内存最大大小
```

### 2.6 故障诊断与解决

#### 2.6.1 内存泄漏诊断

**内存泄漏症状**：

-   垃圾回收时间逐渐增长，Full GC 耗时达到数秒
-   Full GC 频率越来越高，间隔可能少于 1 分钟
-   老年代内存使用率持续上升
-   Full GC 后老年代内存无法有效释放
-   最终导致老年代堆空间被完全占满

**诊断步骤**：

1. **监控 GC 行为**：

    ```bash
    # 启用详细GC日志
    -XX:+PrintGC
    -XX:+PrintGCDetails
    -XX:+PrintGCTimeStamps
    -Xloggc:gc.log
    ```

2. **生成堆转储**：

    ```bash
    # 手动生成heap dump
    jmap -dump:format=b,file=heap.dump <pid>

    # OOM时自动生成
    -XX:+HeapDumpOnOutOfMemoryError
    -XX:HeapDumpPath=/path/to/dumps/
    ```

3. **分析堆转储文件**：
    - 使用 Eclipse MAT、VisualVM 等工具分析
    - 查找占用内存最多的对象
    - 分析对象引用链，找到泄漏根源

**常见泄漏场景**：

-   集合类只添加不删除
-   监听器注册后未注销
-   线程池使用不当
-   静态集合持有对象引用
-   数据库连接、文件流未关闭

#### 2.6.2 栈溢出问题

**栈溢出症状**：

-   抛出`StackOverflowError`异常
-   通常发生在深度递归或无限递归中

**常见原因**：

-   递归调用没有正确的退出条件
-   递归深度超过栈容量限制
-   相互调用形成循环依赖

**解决方案**：

-   检查递归逻辑，确保有正确的退出条件
-   使用迭代代替深度递归
-   适当增加栈大小（-Xss 参数）
-   优化算法，减少调用深度

#### 2.6.3 性能问题诊断

**CPU 热点分析**：

```bash
# 生成线程堆栈
jstack <pid> > thread.dump

# 分析CPU使用率高的线程
top -H -p <pid>
```

**内存使用分析**：

```bash
# 查看堆内存使用情况
jstat -gc <pid> 1s 10

# 查看对象分布
jmap -histo <pid>
```

**GC 分析**：

```bash
# 实时监控GC
jstat -gcutil <pid> 1s

# 分析GC日志
# 使用GCViewer、GCPlot等工具
```

## 3. 监控与日志配置

### 3.1 GC 日志配置

#### 3.1.1 JDK 8 及以前版本

```bash
# 基础GC日志
-XX:+PrintGC
-XX:+PrintGCDetails
-XX:+PrintGCTimeStamps
-XX:+PrintGCDateStamps
-Xloggc:/path/to/gc.log

# 高级配置
-XX:+UseGCLogFileRotation
-XX:NumberOfGCLogFiles=5
-XX:GCLogFileSize=100M
-XX:+PrintGCApplicationStoppedTime
```

#### 3.1.2 JDK 9 及以后版本

```bash
# 统一日志配置
-Xlog:gc*:gc.log:time,tags
-Xlog:gc*:gc-%t.log:time,tags

# 日志轮转
-XX:+UseGCLogFileRotation
-XX:NumberOfGCLogFiles=5
-XX:GCLogFileSize=100M
```

### 3.2 监控指标

#### 3.2.1 关键性能指标

-   **堆内存使用率**：各代内存使用情况
-   **GC 频率和耗时**：Minor GC 和 Full GC 的执行情况
-   **线程状态**：线程数量、状态分布、死锁检测
-   **类加载**：类加载数量和速度
-   **CPU 使用率**：JVM 进程 CPU 占用情况

#### 3.2.2 告警阈值建议

-   老年代使用率超过 80%
-   Full GC 频率高于每 10 分钟一次
-   GC 停顿时间超过 100ms
-   堆内存使用率持续上升
-   出现 OutOfMemoryError

## 4. 实际案例分析

### 4.1 高并发 Web 应用优化

**场景描述**：电商网站，高并发访问，响应时间要求低于 100ms

**优化策略**：

```bash
# G1收集器配置
-XX:+UseG1GC
-XX:MaxGCPauseMillis=50
-XX:G1HeapRegionSize=16m
-Xms8g -Xmx8g

# 其他优化
-XX:+DisableExplicitGC
-XX:+UseStringDeduplication
```

### 4.2 大数据批处理应用

**场景描述**：数据分析任务，处理大量数据，追求吞吐量

**优化策略**：

```bash
# Parallel收集器配置
-XX:+UseParallelGC
-XX:+UseParallelOldGC
-XX:ParallelGCThreads=8
-Xms16g -Xmx16g

# 大对象优化
-XX:PretenureSizeThreshold=1m
```

### 4.3 微服务应用

**场景描述**：容器化部署，内存资源有限，启动速度要求高

**优化策略**：

```bash
# 内存限制配置
-Xms512m -Xmx1g
-XX:+UseG1GC
-XX:MaxGCPauseMillis=100

# 启动优化
-XX:TieredStopAtLevel=1
-XX:+UseStringDeduplication
```
