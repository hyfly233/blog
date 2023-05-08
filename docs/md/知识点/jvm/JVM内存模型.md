## JVM 的简化架构
JVM 的简化架构，内存区域被称为运行时数据区
![Snipaste_2023-04-10_22-26-17.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681136814886-240288f8-3b94-461e-9fa2-4bfcebf5e5fe.png#averageHue=%23d1a985&clientId=u35c67d1a-373a-4&from=ui&id=tzWmT&originHeight=1044&originWidth=1400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=505683&status=done&style=none&taskId=u272586e2-5a21-4584-a572-ad7f48b6dd9&title=)
### 运行时数据区
主要包括：PC 寄存器、Java 虚拟机栈、Java 堆、方法区、运行时常量池、本地方法栈等
### PC（Program Counter）寄存器

1. 每个线程拥有一个 PC 寄存器，是线程私有的，用来存储的是当前线程下一条即将执行的指令的地址（而不是当前正在执行的指令的地址）
2. 在创建一个新线程时，会自动创建一个 PC 寄存器，并将其初始化为 0，表示从字节码的第一条指令开始执行
3. 执行本地方法时，PC 寄存器的值为 undefined
4. PC 寄存器是一个较小的内存空间，是唯一一个在 JVM 规范中没有规定 OutOfMemoryError 的内存区域
5. PC 寄存器的下一条指令地址是由 JVM 根据当前指令的“操作码”和“操作数”计算出来的，并由 JVM 自动将 PC 寄存器中的值更新为下一条指令的地址，以便继续执行下一条指令
### Java 栈（Java Stack）

1. 栈由一系列帧 Frame 组成的（Java 栈也叫做帧栈），是线程私有的，具有“先进后出”的特性
2. 每个线程在执行方法时，都会创建一个对应的栈，用于存储该线程执行方法的信息。及线程每一次方法调用都会创建一个帧，并进行压栈，退出方法的时候，修改栈顶指针就可以把栈帧中的内容销毁
3. 当线程调用的方法又调用了其他方法，则 JVM 会在当前的栈中创建一个新的栈，以此类推
4. 一个线程可以同时对应多个栈，并且线程中的 Java 栈相互独立，当一个线程执行完一个方法后，该方法的栈会被销毁，线程继续执行其他方法的栈
5. 帧保存的信息主要有：局部变量、操作数栈（所有的参数传递使用操作数栈）、常量池指针、动态链接、方法返回值等
6. 局部变量表存放了编译期可知的各种基本数据类型和引用类型，每个插槽 slot 存放 32 位的数据，long、double 占两个插槽
7. 栈的存取速度比堆快，仅次于 PC 寄存器
8. 在栈中的数据的大小、生命周期是在编译期决定的，缺乏灵活性。栈的大小是由 Java 虚拟机在启动时，根据方法调用的嵌套深度和栈的大小限制等因素设置的，通常只有几百到几千字节
9. 栈空间不足时，JVM 会抛出 StackOverflowError，而当 JVM 无法分配更多的栈空间时，会抛出 OutOfMemoryError
#### 操作数栈（Operand Stack）
操作数栈是 JVM 在执行方法的过程中使用的临时数据区域，先进后出的结构。用于存储方法执行过程中的操作数、中间结果以及返回值等信息，JVM 在执行方法时，需要将操作数栈中的数据作为操作数进行相应的计算
#### Java 栈和操作数栈的区别
Java 栈和操作数栈是 JVM 执行方法时使用的两种不同的内存区域

- Java 栈主要用于存储方法的局部变量、操作数栈、方法调用信息等
- 操作数栈主要用于存储方法执行过程中的操作数和返回值
### Java 堆（Java Heap）

1. Java 堆（Java Heap）是 JVM 中用于存储对象实例和数组的内存区域，是 Java 中最大的一块内存区域。在 Java 程序运行期间，所有通过 new 关键字创建的对象都会被分配到 Java 堆中
2. Java 堆是一个运行时数据区，它是在 JVM 启动时创建的，是可以被所有线程共享的内存区域
3. Java 堆的大小可以通过虚拟机的启动参数来设置，并且可以动态扩展
4. 在 Java 堆中分配对象实例时，Java 虚拟机会自动进行内存管理，负责对象的分配、回收等操作，开发人员不需要手动管理 Java 堆中的内存
5. Java 堆中不仅仅存储了 Java 对象的实例数据，还包括对象头信息、数组长度等数据。在 Java 堆中分配对象实例时，JVM 会为每个对象分配一个对象头，用于存储对象的运行时数据和类型信息。同时，如果该对象是数组，JVM 还会为该对象分配一个额外的空间，用于存储数组的长度信息
6. GC 主要是管理堆空间，对分代 GC 来说，堆也是分代的
7. 堆的效率相对较慢
### 方法区（Method Area）

1. JDK 7 时 HotSpot 虚拟机使用永生代（PermGen）实现的方法区
2. JDK 8 移除了永生代，使用了元空间（Metaspace）实现的方法区，一部分数据存在元空间，一部分存在 Java 堆中
3. 元空间与堆不相连，但与堆共享物理内存，逻辑上可认为在堆中，它的别名是 Non-heap（非堆）
4. 方法区是线程共享的内存区域，在 JVM 启动时创建的
5. 方法区的大小可以通过虚拟机的启动参数来设置，并且可以动态扩展
   1. JDK 7：
      1. -XX:Permsize 设置永久代初始分配空间
      2. -XX:MaxPermsize 设定永久代最大可分配空间
   2. JDK 8：
      1. -XX:MetaspaceSize：设置初始的元空间大小
      2. -XX:MaxMetaspaceSize：设置元空间最大的大小
6. 通常用来保存的信息有：
   1. 装载的类型信息：各类全限定名、类型标志、类的访问描述符等
   2. 类型的常量池
   3. 字段信息：修饰符、类型、名称等
   4. 方法信息：修饰符、返回类型、方法名、参数等
   5. 静态变量
   6. 指向类加载器的引用
   7. 指向 Class 实例的引用
   8. 方法表
   9. 运用时常量池
7. Java 方法区和 Java 堆之间存在交集关系，Java 方法区并不等同于 Java 堆
#### 元空间（Metaspace）
Java 元空间是从 JDK 8 开始引入的一种新的内存区域，用于存储类的元数据信息。在之前的版本中，Java 类的元数据信息是存储在永久代中的，在 JDK 8 中，永久代被移除，元数据信息被存储在了元空间中，解决了永久代大小有限的问题
### 运行时常量池（Runtime Constant Pool）

1. 运行时常量池是方法区的一部分
2. JDK 6 时运行时常量池存放在永久代，JDK 7 开始存放在堆中
3. 运行时常量池是 Class 文件中每个类或接口的常量池表，在运行期间的表示形式
4. 通常包括：类的版本、字段、方法、接口等信息
5. 通常在加载类和接口到 JVM 后，就创建了相应的运行时常量池
### 本地方法栈（Native Method Stack）
本地方法栈是在 JVM 中用来支持 native 方法执行的栈
## 栈、堆、方法区之间的交互关系

![Snipaste_2023-04-12_15-37-09.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681285052154-cf767e7d-f237-4417-8884-38a82b5a7f4d.png#averageHue=%23f2f4f1&clientId=uc4953b46-eede-4&from=ui&id=Uvruq&originHeight=294&originWidth=940&originalType=binary&ratio=2&rotation=0&showTitle=false&size=104401&status=done&style=none&taskId=uf1361e6c-e39b-47f2-a386-7e669f0a2c7&title=)
todo
![Snipaste_2023-04-11_22-48-26.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681224528581-7ebca77d-91b7-47f6-820a-66038d300e8c.png#averageHue=%233d8b88&clientId=uf6415ab8-e277-4&from=ui&id=k1bpb&originHeight=990&originWidth=2220&originalType=binary&ratio=2&rotation=0&showTitle=false&size=584286&status=done&style=none&taskId=u97b6ab35-3bbd-4261-8435-4103698f6ce&title=)


### 堆与方法区的关系
![Snipaste_2023-04-13_10-52-12.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681354356507-45303e39-377b-409f-8d76-ed307651294a.png#averageHue=%23e1f3df&clientId=u9e9d98e7-061c-4&from=ui&id=u6b064ea7&originHeight=758&originWidth=1122&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171811&status=done&style=none&taskId=u2663ecb1-a0df-4218-9488-fbb5ab0fee0&title=)


![Snipaste_2023-04-13_10-52-58.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681354395586-5b2abdc6-7436-4d8e-9cad-c5e5032caa4c.png#averageHue=%23f5e5cf&clientId=u9e9d98e7-061c-4&from=ui&id=u8afbc775&originHeight=808&originWidth=1374&originalType=binary&ratio=2&rotation=0&showTitle=false&size=520205&status=done&style=none&taskId=u1fb45aa2-6c0c-4aa4-913a-707949553fa&title=)


![Snipaste_2023-04-13_10-53-35.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681354426253-f139b275-2f3b-49ba-9e15-098fb455dc03.png#averageHue=%23f7e9d5&clientId=u9e9d98e7-061c-4&from=ui&id=u35d6b625&originHeight=772&originWidth=1466&originalType=binary&ratio=2&rotation=0&showTitle=false&size=564570&status=done&style=none&taskId=ubff5af4e-1681-4164-8fcd-e058408238e&title=)

## Java 堆内存

- Java 堆用来存放应用系统创建的对象和数组，所有线程共享 Java 堆
- Java 堆需要在逻辑上连续
- Java 堆是在运行期动态分配内存大小，自动进行垃圾回收
- Java 垃圾回收主要是回收堆内存，对分代 GC 来说，堆也是分代的
### Java 堆的结构
![Snipaste_2023-04-15_12-50-26.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681534245501-ecc0cfb6-cb21-422e-9f55-df01e0f529f9.png#averageHue=%23f1ebc2&clientId=u0221be08-7657-4&from=ui&id=u6bcdb1fe&originHeight=844&originWidth=1966&originalType=binary&ratio=2&rotation=0&showTitle=false&size=538294&status=done&style=none&taskId=u1802b859-ae2e-4fa9-9667-1afcea7294e&title=)

- 新时代：用来存放新分配的对象，新生代中经过垃圾回收，没有被回收的对象将被复制到老年代
- 老年代存储对象比新生代对象的年龄大得多
- 老年代会存储一些大对象
- 整个堆大小 = 新生代 + 老年代
- 新时代 = Eden + 存活区
- JDK 8 之前的永生代，用来存放 Class、Method 等元信息，JDK 8 使用元空间（MetaSpace）代替，元空间并不存在于虚拟机中，而是直接使用本地内存
### 对象的内存布局

- 对象在内存中存储的布局（HotSpot），分为：对象头、实例数据和对齐填充
- 对象头：
   - Mark Word：存储对象自身的运行数据，如：HashCode、GC 分代年龄、锁状态标志等
   - 类型指针：对象指向它的类元数据的指针
- 实例数据：
   - 真正存放对象实例数据的地方
- 对齐填充
   - 这部分不一定存在，仅仅是占位符，HotSpot 要求对象的起始地址都是 8 字节的整数倍，如果不是就需要对齐填充
### 对象的访问定位

- 在 JVM 规范中只规定了 reference 类型是一个指向对象的引用，但没有规定这个引用具体如何去定位、访问堆中对象的具体位置
- 因此对象的访问方式取决于 JVM 的实现，目前主流的有：使用“句柄”和“指针”两种方式
   - 句柄
在 Java 堆中会划分出一块内存来做句柄池，reference 中存储句柄的地址，句柄中存储对象的实例数据和类元数据的地址

![Snipaste_2023-04-15_14-24-21.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681539870482-4d574dc0-5afb-4158-bb94-2d6d0cd60c3e.png#averageHue=%23c9d5e2&clientId=u0221be08-7657-4&from=ui&id=u96db2158&originHeight=886&originWidth=1562&originalType=binary&ratio=2&rotation=0&showTitle=false&size=480592&status=done&style=none&taskId=u2d3a5256-3cb6-4297-a3c7-43cc5ab4ddc&title=)

   - 指针
Java 堆中会存放访问类元数据的地址，reference 存储的是对象的地址

![Snipaste_2023-04-15_14-26-53.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681540025703-46036514-3110-45a5-a417-3dc3205590b4.png#averageHue=%23b5d5b1&clientId=u0221be08-7657-4&from=ui&id=u225cc9ae&originHeight=848&originWidth=1818&originalType=binary&ratio=2&rotation=0&showTitle=false&size=712477&status=done&style=none&taskId=u2af4b1d7-9503-49e3-b07f-c245b6a4f63&title=)
## Java 内存分配参数
### Trace 跟踪参数

- 打印 GC 的简要信息：-Xlog:gc、PrintGC（JDK 8）
- 打印 GC 的详细信息：-Xlog:gc*
- 指定 GC log 的位置，以文件输出：-Xlog:gc:flieName.log
- 每次 GC 后，都打印堆信息：-Xlog:gc+heap=debug
#### GC 日志格式

- GC 发生的时间，JVM 从启动以来经过的秒数
- 日志级别信息和日志类型标记
- GC 识别号
- GC 类型和说明 GC 的原因
- 容量：GC 前容量 -> GC 后容量（该区域总容量）
- GC 持续时间，单位秒
### Java 堆的参数

- Xms：初始堆大小，默认是物理内存的 1/64
- Xmx：最大堆大小，默认物理内存的 1/4
- Xmn：新生代大小。默认是堆的 3/8，新生代过小会频繁的 GC，新生代过大会导致过多的 Full GC，程序停顿时间长
- -XX:+HeapDumpOnOutOfMemoryError：OOM 时导出堆到文件
- -XX:+HeapDumpPath：导出 OOM 的路径
- -XX:NewRatio：；老年代与新生代的比值，如果 xms = xmx，且设置了 xmn 的情况下，该参数不用设置
- -XX:SurvivorRatio：Eden 区和 survivor 区的大小比值，设置为 8，则两个 Survivor 区与一个 Eden 区的比值为 2:8，一个 Survivor 占整个新生代的 1/10
- -XX:OnOutOfMemoryError：在 OOM 时，执行一个脚本
### Java 栈的参数

- Xss：通常只有几百 K，决定了函数调用的深度
### 元空间的参数

- -XX:MetaspaceSize：初始空间大小
- -XX:MaxMetaspaceSize：最大空间，默认没有限制
- -XX:MinMetaspaceFreeRatio：在 GC 之后，最小的 Metaspace 剩余空间容量的百分比
- -XX:MaxMetaspaceFreeRatio：在 GC 之后，最大的 Metaspace 剩余空间容量的百分比
## 字节码执行引擎

- JVM 字节码执行引擎，基本功能就是输入字节码文件，然后对字节码进行解析并处理，最后输出执行的结果
- 实现方式：
   - 通过解释器直接解释执行字节码
   - 通过编译器产生本地代码，编译执行
### 栈帧
![Snipaste_2023-04-29_12-58-17.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1682744312961-b3746c12-8a3a-47d9-a894-adb2a4f57179.png#averageHue=%23eaeae9&clientId=u45945a78-9e3a-4&from=ui&id=u1b53a524&originHeight=920&originWidth=1020&originalType=binary&ratio=2&rotation=0&showTitle=false&size=255713&status=done&style=none&taskId=ue4e1bae5-937a-4c20-b98e-c1dfa5ca162&title=)

- 是用于支持 JVM 进行方法调用和方法执行的数据结构
- 栈帧随着方法的调用而创建，随着方法结束而销毁
- 栈帧用于存放方法的局部变量、操作数栈、动态连接、方法返回地址等信息
   - 局部变量表：用来存放方法参数和方法内部定义的局部变量的存储空间
      - 以变量槽 slot 为单位，目前一个 slot 存放 32 位以内的数据类型
      - 对于 64 位数据占 2 个 slot
      - 对于实例方法，第 0 位 slot 存放的是 this，然后从 1 到 n，依次分配给参数列表
      - 然后根据方法体内部定义的变量顺序和作用域分配 slot
      - slot 是复用的，以节省栈帧的空间，这种设计可能会影响到系统的垃圾回收行为
   - 操作数栈：用来存放方法运行期间，各个指令操作的数据
      - 操作数栈中元素的数据类型必须和字节码指令的顺序严格匹配
      - 虚拟机在实现栈帧的时候可能会让两个栈帧出现部分重叠区域，以存放公用的数据
   - 动态连接：每个栈帧持有一个指向运行时常量池中该栈帧所属方法的引用，以支持方法调用过程的动态连接
      - 静态解析：类加载的时候，符号引用转换为直接引用
      - 动态连接：运行期间转换为直接引用
   - 方法返回地址：方法执行后返回的地址
   - 方法调用：方法调用是确定具体调用那一个方法，并不涉及方法内部的执行过程
      - 部分方法是直接在类加载的解析节点就确定了直接引用关系
      - 对于实例方法，也称虚方法，因为重载和多态，需要运行期间动态委派
   - 分派：静态分派和动态分派
      - 静态分派：所有依赖静态类型来定位方法执行版本的分派方式，如：方法重载
      - 动态分派：根据运行期的实际类型来定位方法执行版本的分配方式，如：方法覆盖
      - 单分派和多分派：多余一个的就是多分派，只有一个的就是单分派
- JVM 通过基于栈的字节码解释执行引擎来执行指令，JVM 的指令集也是基于栈的


