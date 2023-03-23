## 目录
1. JVM概念
   1. JVM基础
      1. JVM是什么
      2. JVM有什么
      3. JVM能干什么
   2. JVM怎么实现平台无关
2. JVM规范
   1. JVM规范的作用
   2. JVM规范的主要内容
3. Class文件
   1. Class文件格式
   2. Class字节码
   3. 虚拟机汇编表示的Java类
   4. ASM
      1. ASM是什么
      2. ASM编程模型
      3. ASM核心API
4. 类加载、连接和初始化
   1. 类加载、连接、初始化到卸载的生命周期
   2. 类加载
   3. 类加载器
   4. 双亲委派模型
   5. 类连接
   6. 初始化
      1. 类初始化
      2. 初始化时机
   7. 类卸载
5. JVM内存分配
   1. JVM简化架构
   2. JVM内存模型
   3. 栈、堆、方法区的交互
6. JVM堆内存
   1. 概念
   2. 堆的结构
   3. 对象的内存布局
   4. 内存分配的参数
      1. Trace跟踪参数
      2. GC日志格式
      3. Java堆的参数
      4. Java栈的参数
      5. 元空间的参数
7. 字节码执行引擎
   1. 概念
      1. 栈帧
      2. 局部变量表
      3. 操作数栈
      4. 动态连接
      5. 方法返回地址
   2. 栈帧、运行期操作数栈和局部变量表之间的交互
   3. 方法调用
      1. 方法调用
      2. 分派
         1. 静态分派
         2. 动态分派
8. 垃圾回收基础
   1. 什么是垃圾
   2. 如何判断垃圾
   3. 如何回收
   4. 根搜索算法
   5. 引用分类
   6. 跨代引用
   7. 记忆集
   8. 写屏障
   9. GC类型
   10. Stop-The-World
   11. 垃圾收集类型
9. 垃圾收集算法
   1. 标记清除法
   2. 复制算法
   3. 标记整理法
   4. 分配担保（分代）
10. 垃圾收集器
   1. HotSpot中的收集器
   2. 串行收集器
   3. 并行收集器
   4. 新生代 Parallel Scavenge 收集器
   5. CMS 收集器
   6. G1 收集器
      1. 新生代回收过程
      2. 老年代回收过程
   7. ZGC 收集器
   8. GC 性能指标
   9. JVM内存配置原则
11. JVM对高效并发的支持
   1. Java内存模型
   2. 内存间的交互操作
   3. 多线程的可见性
   4. 有序性
   5. 指令重排
   6. 线程安全的处理方法
   7. 锁优化
      1. 自旋锁
      2. 锁消除
      3. 锁粗化
      4. 轻量级锁
      5. 偏向锁
12. 性能监控与故障处理工具
   1. 命令行工具
      1. jps
      2. jinfo
      3. jstack
      4. jmap
      5. jstat
      6. jstatd
      7. jcmd
   2. 图形化工具
      1. jconsole
      2. jmc
      3. visualvm
   3. 远程连接
      1. jmx
      2. jstatd
13. JVM调优
   1. JVM如何调优、调什么、目标
   2. JVM调优策略
   3. JVM调优冷思考
   4. JVM调优经验
   5. 调优实战


## JVM概念
### JVM基础
#### JVM是什么

- JVM：Java Virtual Machine，Java 虚拟机
- 虚拟机是指通过软件模拟的具有完整硬件系统功能，并且运行在一个完全隔离环境中的计算机系统
- JVM是通过软件来模拟 Java 字节码的指令集，是 Java 程序的运行环境
#### JVM有什么 todo
![Snipaste_2023-03-23_10-08-27.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1679537343985-07f5827a-2d5d-406b-af62-fc0b6c75a743.png#averageHue=%23f4f3f3&clientId=ufc842c6e-7270-4&from=drop&id=uc6d87bbb&name=Snipaste_2023-03-23_10-08-27.png&originHeight=1216&originWidth=2846&originalType=binary&ratio=2&rotation=0&showTitle=false&size=899278&status=done&style=none&taskId=uedc0d811-a6b9-4fa8-bb3c-2c0389974e5&title=)
#### JVM主要功能

1. 通过 ClassLoader 寻找和装载 class 文件
2. 解释字节码成为指令并执行，提供 class 文件的运行环境
3. 进行运行期间的内存分配和垃圾回收
4. 提供与硬件交互的平台
#### JVM怎么实现平台无关
JDK 的安装包是和平台相关的，自己写的代码和平台无关的
![Snipaste_2023-03-23_10-14-34.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1679537692385-590e5dba-0ddf-49fe-994e-1520f9a7cc10.png#averageHue=%23fafafa&clientId=ufc842c6e-7270-4&from=drop&id=u40564c22&name=Snipaste_2023-03-23_10-14-34.png&originHeight=1208&originWidth=1620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=374300&status=done&style=none&taskId=u36999bd7-f1af-4669-b436-e869ee3cd0a&title=)
## JVM规范
### JVM规范的作用
### JVM规范的主要内容
