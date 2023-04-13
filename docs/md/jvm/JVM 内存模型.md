## JVM 的简化架构
JVM 的简化架构，内存区域被称为运行时数据区
![Snipaste_2023-04-10_22-26-17.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681136814886-240288f8-3b94-461e-9fa2-4bfcebf5e5fe.png#averageHue=%23d1a985&clientId=u35c67d1a-373a-4&from=ui&id=tzWmT&name=Snipaste_2023-04-10_22-26-17.png&originHeight=1044&originWidth=1400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=505683&status=done&style=none&taskId=u272586e2-5a21-4584-a572-ad7f48b6dd9&title=)
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

![Snipaste_2023-04-12_15-37-09.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681285052154-cf767e7d-f237-4417-8884-38a82b5a7f4d.png#averageHue=%23f2f4f1&clientId=uc4953b46-eede-4&from=ui&id=Uvruq&name=Snipaste_2023-04-12_15-37-09.png&originHeight=294&originWidth=940&originalType=binary&ratio=2&rotation=0&showTitle=false&size=104401&status=done&style=none&taskId=uf1361e6c-e39b-47f2-a386-7e669f0a2c7&title=)
todo
![Snipaste_2023-04-11_22-48-26.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681224528581-7ebca77d-91b7-47f6-820a-66038d300e8c.png#averageHue=%233d8b88&clientId=uf6415ab8-e277-4&from=ui&id=k1bpb&name=Snipaste_2023-04-11_22-48-26.png&originHeight=990&originWidth=2220&originalType=binary&ratio=2&rotation=0&showTitle=false&size=584286&status=done&style=none&taskId=u97b6ab35-3bbd-4261-8435-4103698f6ce&title=)
## Java 堆内存


![Snipaste_2023-04-13_10-52-12.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681354356507-45303e39-377b-409f-8d76-ed307651294a.png#averageHue=%23e1f3df&clientId=u9e9d98e7-061c-4&from=ui&id=u6b064ea7&name=Snipaste_2023-04-13_10-52-12.png&originHeight=758&originWidth=1122&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171811&status=done&style=none&taskId=u2663ecb1-a0df-4218-9488-fbb5ab0fee0&title=)


![Snipaste_2023-04-13_10-52-58.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681354395586-5b2abdc6-7436-4d8e-9cad-c5e5032caa4c.png#averageHue=%23f5e5cf&clientId=u9e9d98e7-061c-4&from=ui&id=u8afbc775&name=Snipaste_2023-04-13_10-52-58.png&originHeight=808&originWidth=1374&originalType=binary&ratio=2&rotation=0&showTitle=false&size=520205&status=done&style=none&taskId=u1fb45aa2-6c0c-4aa4-913a-707949553fa&title=)


![Snipaste_2023-04-13_10-53-35.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681354426253-f139b275-2f3b-49ba-9e15-098fb455dc03.png#averageHue=%23f7e9d5&clientId=u9e9d98e7-061c-4&from=ui&id=u35d6b625&name=Snipaste_2023-04-13_10-53-35.png&originHeight=772&originWidth=1466&originalType=binary&ratio=2&rotation=0&showTitle=false&size=564570&status=done&style=none&taskId=ubff5af4e-1681-4164-8fcd-e058408238e&title=)
