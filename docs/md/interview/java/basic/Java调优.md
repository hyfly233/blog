## 基础相关

### Java 语言具有哪些特点

-   Java 为纯面向对象的语言。它能够直接反应现实生活中的对象。
-   具有平台无关性。Java 利用 Java 虚拟机运行字节码，编译后的程序可在其它平台运行。
-   Java 为解释型语言，编译器把 Java 代码编译成平台无关的中间代码，然后在 JVM 上解释运行，具有很好的可移植性。
-   Java 提供了很多内置类库。
-   Java 具有较好的安全性和健壮性，Java 提供了异常处理和垃圾回收机制。

### JDK 与 JRE

-   JDK：Java 开发工具包（Java Development Kit），提供了 Java 的开发环境和运行环境
-   JRE：Java 运行环境（Java Runtime Environment），提供了 Java 运行所需的环境
-   JDK 包含了 JRE

### Java 基本数据类型

-   byte: 占用 1 个字节，取值范围-128 ~ 127
-   short: 占用 2 个字节，取值范围-215 ~ 215-1
-   int：占用 4 个字节，取值范围-231 ~ 231-1
-   long：占用 8 个字节
-   float：占用 4 个字节
-   double：占用 8 个字节
-   char: 占用 2 个字节
-   boolean：占用大小根据实现虚拟机不同有所差异

### 简述 Java 访问修饰符

-   public: 对所有类可见
-   protected : 对同一包内的类和所有子类可见，不能修饰类
-   default: 默认访问修饰符，在同一包内可见
-   private: 在同一类内可见，不能修饰类

| 修饰符    | 当前类 | 同包 | 子类 | 其他包 |
| --------- | ------ | ---- | ---- | ------ |
| public    | y      | y    | y    | y      |
| protected | y      | y    | y    | ×      |
| default   | y      | y    | ×    | ×      |
| private   | y      | ×    | ×    | ×      |

### Java 代码块执行顺序

-   静态代码块只执行一次
-   先后顺序：父类静态变量 => 父类静态代码块 => 子类静态变量 => 子类静态代码块 => 父类非静态变量 => 父类非静态代码块 => 父类构造函数 => 子类非静态变量 => 子类非静态代码块 => 子类构造函数

### Java 中类、对象、引用三者是什么关系

在 Java 中，类是一种定义对象属性和行为的模板，对象是类的一个实例，而引用是指向对象在内存中的地址的变量

-   类是一个通用的模板，它定义了一组属性和方法，可以用来创建对象
-   对象是由类创建的实例，它包含了类中定义的所有属性和方法的值和实现。可以通过使用 new 关键字来创建对象，然后可以使用该对象调用类中的方法和访问其属性
-   引用是一个指向对象的指针，它存储对象在内存中的地址。当使用 new 关键字创建对象时，返回的是对象在内存中的地址，可以将该地址存储在一个引用变量中。然后，可以使用该引用变量来访问对象的属性和方法

因此，类是创建对象的模板，对象是类的实例，而引用是指向对象的指针。可以通过引用来访问对象的属性和方法

## 类

### 简述类

类是一个通用的模板，它定义了一组属性和方法，可以用来创建对象

### 内部类相关

#### 简述内部类及其作用

-   成员内部类
    作为成员对象的内部类。可以访问 private 及以上外部类的属性和方法。外部类想要访问内部类属性或方法时，必须要创建一个内部类对象，然后通过该对象访问内部类的属性或方法。外部类也可访问 private 修饰的内部类属性
-   局部内部类
    存在于方法中的内部类。访问权限类似局部变量，只能访问外部类的 final 变量
-   匿名内部类
    只能使用一次，没有类名，只能访问外部类的 final 变量
-   静态内部类
    类似类的静态成员变量

### 包装类

#### Integer a = 1000，Integer b = 1000，a==b 的结果是什么？那如果 a，b 都为 1，结果又是什么？

-   Integer a = 1000，Integer b = 1000，a==b 结果为 false
-   Integer a = 1，Integer b = 1，a==b 结果为 true
-   Integer 包装类缓存的范围，在-128~127 之间会缓存起来，比较的是直接缓存的数据，在此之外比较的是对象

#### 什么是包装类

Java 中有 8 个基本类型，分别对应的 8 个包装类

-   byte -- Byte
-   boolean -- Boolean
-   short -- Short
-   char -- Character
-   int -- Integer
-   long -- Long
-   float -- Float
-   double -- Double

#### 为什么需要包装类:

-   基本数据类型方便、简单、高效，但泛型不支持、集合元素不支持
-   不符合面向对象思维
-   包装类提供很多方法，方便使用，如 Integer 类 toString(int i)、parseInt(String s) 方法等等

#### 自动装箱拆箱

对于 Java 基本数据类型，均对应一个包装类。

-   装箱：将基本数据类型转换为包装器类型，如 int->Integer
-   拆箱：将包装器类型转换为基本数据类型，如 Integer->int

## 对象

### 简述 Java 中 Class 对象

java 中对象可以分为实例对象和 Class 对象，每一个类都有一个 Class 对象，其包含了与该类有关的信息。
获取 Class 对象的方法：

```java
Class.forName(“类的全限定名”)
实例对象.getClass()
类名.class
```

### 创建对象有哪些方式

有五种创建对象的方式

1. new 关键字

```java
Person p1 = new Person();
```

2. Class.newInstance

```java
Person p1 = Person.class.newInstance();
```

3. Constructor.newInstance

```java
Constructor<Person> constructor = Person.class.getConstructor();
Person p1 = constructor.newInstance();
```

4. clone

```java
Person p1 = new Person();
Person p2 = p1.clone();
```

5. 反序列化

```java
Person p1 = new Person();
byte[] bytes = SerializationUtils.serialize(p1);
Person p2 = (Person)SerializationUtils.deserialize(bytes);
```

### 一个对象的内存布局是怎么样的?

![image.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1679034098498-ad6d11cc-5f47-4c13-ae20-3dd8f382e1c3.png#averageHue=%23a4f2c0&clientId=ub4b1a7b2-78f5-4&id=MAx2s&name=image.png&originHeight=653&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&size=145534&status=done&style=none&taskId=u1c918607-0cba-40bb-8699-73f99cf5d1d&title=)

1.  对象头: 对象头又分为 MarkWord 和 Class Pointer 两部分
    1. MarkWord：包含一系列的标记位，比如轻量级锁的标记位，偏向锁标记位,gc 记录信息等等
    2. ClassPointer：用来指向对象对应的 Class 对象（其对应的元数据对象）的内存地址。在 32 位系统占 4 字节，在 64 位系统中占 8 字节。
2.  Length：只在数组对象中存在，用来记录数组的长度，占用 4 字节
3.  Instance data：对象实际数据，对象实际数据包括了对象的所有成员变量，其大小由各个成员变量的大小决定。(这里不包括静态成员变量，因为其是在方法区维护的)
4.  Padding：Java 对象占用空间是 8 字节对齐的，即所有 Java 对象占用 bytes 数必须是 8 的倍数,是因为当我们从磁盘中取一个数据时，不会说我想取一个字节就是一个字节，都是按照一块儿一块儿来取的，这一块大小是 8 个字节，所以为了完整，padding 的作用就是补充字节，保证对象是 8 字节的整数倍。

## 引用

### 四种引用类型?

-   强引用 StrongReference
    垃圾回收器不会回收被引用的对象，哪怕内存不足时，JVM 也会直接抛出 OutOfMemoryError，除非赋值为 null

```java
Object obj = new Object(); //只要obj还指向Object对象，Object对象就不会被回收
```

-   软引用 SoftReference
    软引用是用来描述一些非必需但仍有用的对象。在内存足够的时候，软引用对象不会被回收，只有在内存不足时，系统则会回收软引用对象，如果回收了软引用对象之后仍然没有足够的内存，才会抛出内存溢出异常
-   弱引用 WeakReference
    弱引用的引用强度比软引用要更弱一些，无论内存是否足够，只要 JVM 开始进行垃圾回收，那些被弱引用关联的对象都会被回收
-   虚引用 PhantomReference
    虚引用是最弱的一种引用关系，如果一个对象仅持有虚引用，那么它就和没有任何引用一样，它随时可能会被回收，在 JDK1.2 之后，用 PhantomReference 类来表示，通过查看这个类的源码，发现它只有一个构造函数和一个 get() 方法，而且它的 get() 方法仅仅是返回一个 null，也就是说将永远无法通过虚引用来获取对象，虚引用必须要和 ReferenceQueue 引用队列一起使用，NIO 的堆外内存就是靠其管理

## 方法

### 是否可以从一个静态（static）方法内部发出对非静态（non-static）方法的调用？

不可以，静态方法只能访问静态成员，因为非静态方法的调用要先创建对象，在调用静态方法时可能对象并没有被初始化

### 抽象的（abstract）方法是否可同时是静态的（static）,是否可同时是本地方法（native），是否可同时被 synchronized 修饰

**都不能**

-   抽象方法需要子类重写，而静态的方法是无法被重写的，因此二者是矛盾的
-   本地方法是由本地代码实现的方法，而抽象方法是没有实现的，也是矛盾的
-   synchronized 和方法的实现细节有关，抽象方法不涉及实现细节，因此也是相互矛盾的

### Object 中有哪些公共方法？

-   equals()
-   clone()
-   getClass()
-   notify(),notifyAll(),wait()
-   toString()

### 深拷贝、浅拷贝是什么？

-   浅拷贝并不是真的拷贝，只是复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。
-   深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

### 如何实现对象克隆？

有两种方式：

1. 实现 Cloneable 接口并重写 Object 类中的 clone()方法；
2. 实现 Serializable 接口，通过对象的序列化和反序列化实现克隆，可以实现真正的深度克隆。

### JDK 8 为什么要 hashcode 异或其右移十六位的值

因为在 JDK 7 中扰动了 4 次，计算 hash 值的性能会稍差一点点。从速度、功效、质量来考虑，JDK 8 优化了高位运算的算法，通过 hashCode()的高 16 位异或低 16 位实现：`(h = k.hashCode()) ^ (h >>> 16)`。这么做可以在数组 table 的 length 比较小的时候，也能保证考虑到高低 Bit 都参与到 Hash 的计算中，同时不会有太大的开销。

### 两个对象值相同(x.equals(y) == true)，但却可有不同的 hash code，这句话对不对？

不对，如果两个对象 x 和 y 满足 x.equals(y) == true，它们的哈希码（hash code）应当相同。
Java 对于 eqauls 方法和 hashCode 方法是这样规定的：

1. 如果两个对象相同（equals 方法返回 true），那么它们的 hashCode 值一定要相同；
2. 如果两个对象的 hashCode 相同，它们并不一定相同。当然，你未必要按照要求去做，但是如果你违背了上述原则就会发现在使用容器时，相同的对象可以出现在 Set 集合中，同时增加新元素的效率会大大下降（对于使用哈希存储的系统，如果哈希码频繁的冲突将会造成存取性能急剧下降）。

首先 equals 方法必须满足自反性（x.equals(x)必须返回 true）、对称性（x.equals(y)返回 true 时，y.equals(x)也必须返回 true）、传递性（x.equals(y)和 y.equals(z)都返回 true 时，x.equals(z)也必须返回 true）和一致性（当 x 和 y 引用的对象信息没有被修改时，多次调用 x.equals(y)应该得到同样的返回值），而且对于任何非 null 值的引用 x，x.equals(null)必须返回 false。

### 实现高质量的 equals 方法的诀窍包括

1. 使用==操作符检查”参数是否为这个对象的引用”；
2. 使用 instanceof 操作符检查”参数是否为正确的类型”；
3. 对于类中的关键属性，检查参数传入对象的属性是否与之相匹配；
4. 编写完 equals 方法后，问自己它是否满足对称性、传递性、一致性；
5. 重写 equals 时总是要重写 hashCode；
6. 不要将 equals 方法参数中的 Object 对象替换为其他的类型，在重写时不要忘掉 @Override 注解。

### Java 中 == 和 eqauls()的区别

-   == 比较的是引用，equals 比较的是内容。
-   如果变量是基础数据类型，== 用于比较其对应值是否相等。如果变量指向的是对象，== 用于比较两个对象是否指向同一块存储空间。
-   equals 是 Object 类提供的方法之一，每个 Java 类都继承自 Object 类，所以每个对象都具有 equals 这个方法。Object 类中定义的 equals 方法内部是直接调用 == 比较对象的。但通过覆盖的方法可以让它不是比较引用而是比较数据内容。

### equals()和 hashcode 的区别

在 Java 中，equals()和 hashCode()方法都是用于处理对象相等性的方法，但它们的作用有所不同。

-   equals()方法用于比较两个对象的内容是否相同，而不是比较它们的引用是否相等。默认情况下，equals()方法使用对象的引用相等性来比较对象，也就是说，它只有在两个对象引用指向同一个对象时才返回 true。如果需要比较两个对象的内容，就需要在类中重写 equals() 方法，并根据对象的内容来比较对象。
-   hashCode()方法用于获取对象的哈希码，这是一个整数值，用于将对象存储在哈希表等数据结构中。哈希码是根据对象的内容计算出来的，因此如果两个对象的内容相同，它们的哈希码也应该相同。如果一个类重写了 equals() 方法，那么它也应该重写 hashCode() 方法，以保证相等的对象具有相等的哈希码。

需要注意的是，两个对象的 hashCode() 方法返回相等的哈希码，并不意味着这两个对象是相等的，因为哈希码在计算过程中可能会存在冲突。因此，在比较对象相等性时，必须同时比较对象的哈希码和内容。

## 异常

### 简述 Java 异常的分类

Java 异常分为 Error（程序无法处理的错误），和 Exception（程序本身可以处理的异常）。这两个类均继承 Throwable。

-   Error 常见的有 StackOverFlowError、OutOfMemoryError 等等
-   Exception 可分为运行时异常和非运行时异常。对于运行时异常，可以利用 try catch 的方式进行处理，也可以不处理。对于非运行时异常，必须处理，不处理的话程序无法通过编译

### 常见的异常有哪些？

-   NullPointerException 空指针异常
-   ArrayIndexOutOfBoundsException 索引越界异常
-   InputFormatException 输入类型不匹配
-   SQLException SQL 异常
-   IllegalArgumentException 非法参数
-   NumberFormatException 类型转换异常

### 异常要怎么解决？

Java 标准库内建了一些通用的异常，这些类以 Throwable 为顶层父类。Throwable 又派生出 Error 类和 Exception 类

-   错误：Error 类以及他的子类的实例，代表了 JVM 本身的错误。错误不能被程序员通过代码处理，Error 很少出现。因此，程序员应该关注 Exception 为父类的分支下的各种异常类
-   异常：Exception 以及他的子类，代表程序运行时发送的各种不期望发生的事件。可以被 Java 异常处理机制使用，是异常处理的核心

处理方法:

-   try catch

```java
try{
	// 程序代码
}catch(ExceptionName e1){
	//Catch 块
}
```

-   throw
    throw 关键字作用是抛出一个异常，抛出的时候是抛出的是一个异常类的实例化对象，在异常处理中，try 语句要捕获的是一个异常对象，那么此异常对象也可以自己抛出
-   throws
    定义一个方法的时候可以使用 throws 关键字声明。使用 throws 关键字声明的方法表示此方法不处理异常，而交给方法调用处进行处理

### 运行时异常与受检异常有何异同？

异常表示程序运行过程中可能出现的非正常状态，运行时异常表示虚拟机的通常操作中可能遇到的异常，是一种常见运行错误，只要程序设计得没有问题通常就不会发生。受检异常跟程序运行的上下文环境有关，即使程序设计无误，仍然可能因使用的问题而引发。Java 编译器要求方法必须声明抛出可能发生的受检异常，但是并不要求必须声明抛出未被捕获的运行时异常。
异常和继承一样，是面向对象程序设计中经常被滥用的东西，在 Effective Java 中对异常的使用给出了以下指导原则：

-   不要将异常处理用于正常的控制流（设计良好的 API 不应该强迫它的调用者为了正常的控制流而使用异常）
-   对可以恢复的情况使用受检异常，对编程错误使用运行时异常
-   避免不必要的使用受检异常（可以通过一些状态检测手段来避免异常的发生）
-   优先使用标准的异常
-   每个方法抛出的异常都要有文档
-   保持异常的原子性
-   不要在 catch 中忽略掉捕获到的异常

## 注解

### 简述注解

Java 注解用于为 Java 代码提供元数据。作为元数据，注解不直接影响你的代码执行，但也有一些类型的注解实际上可以用于这一目的。其可以用于提供信息给编译器，在编译阶段时给软件提供信息进行相关的处理，在运行时处理写相应代码，做对应操作。

### 简述元注解

元注解可以理解为注解的注解，即在注解中使用，实现想要的功能。其具体分为：

-   @Retention: 表示注解存在阶段是保留在源码，还是在字节码（类加载）或者运行期（JVM 中运行）。
-   @Target：表示注解作用的范围。
-   @Documented：将注解中的元素包含到 Javadoc 中去。
-   @Inherited：一个被@Inherited 注解了的注解修饰了一个父类，如果他的子类没有被其他注解修饰，则它的子类也继承了父类的注解。
-   @Repeatable：被这个元注解修饰的注解可以同时作用一个对象多次，但是每次作用注解又可以代表不同的含义

## 关键字相关

### final、finally 和 finalize 的区别是什么？

-   final：用于声明属性、方法和类，分别表示属性不可变、方法不可覆盖、类不可继承
-   finally：作为异常处理的一部分，只能在 try/catch 语句中使用，finally 附带一个语句块用来表示这个语句最终一定被执行，经常被用在需要释放资源的情况下
-   finalize：是 Object 类的一个方法，在垃圾收集器执行的时候会调用被回收对象的 finalize()方法。当垃圾回收器准备好释放对象占用空间时，首先会调用 finalize()方法，并在下一次垃圾回收动作发生时真正回收对象占用的内存

### Java 中的 final 关键字有哪些用法？

-   修饰类：表示该类不能被继承；
-   修饰方法：表示方法不能被重写；
-   修饰变量：表示变量只能一次赋值以后值不能被修改（常量）。

### volatile 有什么作用？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1677824831929-34dc6429-1cee-4222-9a20-973d021e3afe.png#averageHue=%23f1ede2&clientId=u74b777b2-7848-4&id=qbGxm&name=image.png&originHeight=846&originWidth=1032&originalType=binary&ratio=1&rotation=0&showTitle=false&size=320533&status=done&style=none&taskId=u4ba11097-1490-46ae-a497-03a70bf13a6&title=)

1. 保证内存可见性
   可见性是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的。也就是一个线程修改的结果，另一个线程马上就能看到。
2. 禁止指令重排序
   cpu 是和缓存做交互的，但是由于 cpu 运行效率太高，所以会不等待当前命令返回结果从而继续执行下一个命令，就会有乱序执行的情况发生

### 简述 throw 与 throws 的区别

-   throw：一般是用在方法体的内部，由开发者定义当程序语句出现问题后主动抛出一个异常
-   throws：一般用于方法声明上，代表该方法可能会抛出的异常列表

### 出现在 Java 程序中的 finally 代码块是否一定会执行？

-   当遇到下面情况不会执行：
    -   当程序在进入 try 语句块之前就出现异常时会直接结束
    -   当程序在 try 块中强制退出时，如使用 System.exit(0)，也不会执行 finally 块中的代码
-   其它情况下，在 try/catch/finally 语句执行的时候，try 块先执行，当有异常发生，catch 和 finally 进行处理后程序就结束了，当没有异常发生，在执行完 finally 中的代码后，后面代码会继续执行
-   当 try/catch 语句块中有 return 时，finally 语句块中的代码会在 return 之前执行。如果 try/catch/finally 块中都有 return 语句，finally 块中的 return 语句会覆盖 try/catch 模块中的 return 语句

### switch 是否能作用在 byte 上，是否能作用在 long、float 上，是否能作用在 String 上？

在 Java 5 以前，switch(expr)中，expr 只能是 byte、short、char、int。从 Java 5 开始，Java 中引入了枚举类型，expr 也可以是 enum 类型，从 Java 7 开始，expr 还可以是字符串（String），但是长整型（long）,浮点数（float）在目前所有的版本中都是不可以的。

### float f=3.4 是否正确？

不正确。3.4 是双精度数，将双精度型（double）赋值给浮点型（float）属于下转型（down-casting，也称为窄化）会造成精度损失，因此需要强制类型转换 float f =(float)3.4; 或者写成 float f =3.4F

### Java 语言中关键字 static 的作用是什么？

static 的主要作用有两个：

-   为某种特定数据类型或对象分配与创建对象个数无关的单一的存储空间
-   使得某个方法或属性与类而不是对象关联在一起，即在不创建对象的情况下可通过类直接调用方法或使用类的属性

具体而言 static 又可分为 4 种使用方式：

-   修饰成员变量
    用 static 关键字修饰的静态变量在内存中只有一个副本。只要静态变量所在的类被加载，这个静态变量就会被分配空间，可以使用“类.静态变量”和“对象.静态变量”的方法使用
-   修饰成员方法
    static 修饰的方法无需创建对象就可以被调用。static 方法中不能使用 this 和 super 关键字，不能调用非 static 方法，只能访问所属类的静态成员变量和静态成员方法
-   修饰代码块
    JVM 在加载类的时候会执行 static 代码块。static 代码块常用于初始化静态变量。static 代码块只会被执行一次
-   修饰内部类
    static 内部类可以不依赖外部类实例对象而被实例化。静态内部类不能与外部类有相同的名字，不能访问普通成员变量，只能访问外部类中的静态成员和静态成员方法

## 其他

### short s1 = 1; s1 = s1 + 1; 与 short s1 = 1; s1 += 1;有错吗

对于 short s1 = 1; s1 = s1 + 1;由于 1 是 int 类型，因此 s1+1 运算结果也是 int 型，需要强制转换类型才能赋值给 short 型。而 short s1 = 1; s1 += 1;可以正确编译，因为 s1+= 1;相当于 s1 = (short)(s1 + 1);其中有隐含的强制类型转换。

### &和&&的区别

-   &运算符有两种用法：(1)按位与；(2)逻辑与
-   &&运算符是短路与运算。逻辑与跟短路与的差别是非常巨大的，虽然二者都要求运算符左右两端的布尔值都是 true 整个表达式的值才是 true。&&之所以称为短路运算是因为，如果&&左边的表达式的值是 false，右边的表达式会被直接短路掉，不会进行运算。很多时候我们可能都需要用&&而不是&，例如在验证用户登录时判定用户名不是 null 而且不是空字符串，应当写为：username != null &&!username.equals(“”)，二者的顺序不能交换，更不能用&运算符，因为第一个条件如果不成立，根本不能进行字符串的 equals 比较，否则会产生 NullPointerException 异常。注意：逻辑或运算符（|）和短路或运算符（||）的差别也是如此。

### 为什么要把 String 设计为不可变

-   节省空间
    字符串常量存储在 JVM 的字符串池中可以被用户共享
-   提高效率
    String 可以被不同线程共享，是线程安全的。在涉及多线程操作中不需要同步操作
-   安全
    String 常被用于用户名、密码、文件名等使用，由于其不可变，可避免黑客行为对其恶意修改

### 简述 String/StringBuffer 与 StringBuilder

-   String
    采用利用 final 修饰的字符数组进行字符串保存，因此不可变。如果对 String 类型对象修改，需要新建对象，将老字符和新增加的字符一并存进去
-   StringBuilder
    采用无 final 修饰的字符数组进行保存，因此可变，线程不安全
-   StringBuffer
    采用无 final 修饰的字符数组进行保存，线程安全

### Java 中一维数组和二维数组的声明方式？

一维数组的声明方式：

```java
type arrayName[]
type[] arrayName
```

二维数组的声明方式：

```java
type arrayName[][]
type[][] arrayName
type[] arrayName[]
```

### 为什么 hash 值要与 length-1 相与？

-   把 hash 值对数组长度取模运算，模运算的消耗很大，没有位运算快。
-   当 length 总是 2 的 n 次方时，`h & (length-1)`运算等价于对 length 取模，也就是 h%length，但是 & 比 % 具有更高的效率。

### 静态变量和实例变量的区别

静态变量是被 static 修饰符修饰的变量，也称为类变量，它属于类，不属于类的任何一个对象，一个类不管创建多少个对象，静态变量在内存中有且仅有一个拷贝；实例变量必须依存于某一实例，需要先创建对象然后通过对象才能访问到它。静态变量可以实现让多个对象共享内存。在 Java 开发中，上下文类和工具类中通常会有大量的静态成员

# Java 性能调优与问题排查指南

> 本文档全面介绍 Java 应用性能调优的各个方面，包括异常处理、JVM 调优、缓存优化、分布式部署等核心内容。

## 目录

-   [1. 异常处理](#1-异常处理)
-   [2. JVM 调优](#2-jvm调优)
-   [3. 性能优化](#3-性能优化)
-   [4. 分布式扩展](#4-分布式扩展)
-   [5. 问题排查](#5-问题排查)

---

## 1. 异常处理

### 1.1 Java 异常体系结构

Java 异常体系以`Throwable`为根类，分为两大分支：

```
Throwable
├── Error（系统错误，程序无法处理）
│   ├── StackOverflowError
│   ├── OutOfMemoryError
│   └── VirtualMachineError
└── Exception（可处理的异常）
    ├── RuntimeException（运行时异常）
    │   ├── NullPointerException
    │   ├── IndexOutOfBoundsException
    │   └── IllegalArgumentException
    └── CheckedException（编译时异常）
        ├── IOException
        ├── SQLException
        └── ClassNotFoundException
```

**异常类型对比：**

| 异常类型             | 特点           | 处理方式     | 常见示例             |
| -------------------- | -------------- | ------------ | -------------------- |
| **Error**            | JVM 系统级错误 | 程序无法处理 | OutOfMemoryError     |
| **RuntimeException** | 运行时异常     | 可选择处理   | NullPointerException |
| **CheckedException** | 编译时异常     | 必须处理     | IOException          |

### 1.2 Throwable 类核心方法详解

`Throwable`类是所有异常的根类，提供了异常处理的核心功能。

#### 1.2.1 构造方法

`Throwable`提供了四种构造方法，满足不同的异常创建需求：

| 构造方法                                     | 说明       | 使用场景       |
| -------------------------------------------- | ---------- | -------------- |
| `Throwable()`                                | 无参构造   | 简单异常创建   |
| `Throwable(String message)`                  | 带异常信息 | 提供异常描述   |
| `Throwable(String message, Throwable cause)` | 异常链     | 包装底层异常   |
| `Throwable(Throwable cause)`                 | 异常包装   | 简化异常链创建 |

```java
// Throwable类的关键属性
private String detailMessage;  // 异常详细信息
private Throwable cause = this; // 异常原因

// 四种构造方法实现
public Throwable() {
    fillInStackTrace();
}

public Throwable(String message) {
    fillInStackTrace();
    detailMessage = message;
}

public Throwable(String message, Throwable cause) {
    fillInStackTrace();
    detailMessage = message;
    this.cause = cause;
}

public Throwable(Throwable cause) {
    fillInStackTrace();
    detailMessage = (cause == null ? null : cause.toString());
    this.cause = cause;
}
```

#### 1.2.2 核心信息获取方法

| 方法                    | 功能               | 返回值              |
| ----------------------- | ------------------ | ------------------- |
| `getMessage()`          | 获取异常消息       | String              |
| `getLocalizedMessage()` | 获取本地化消息     | String              |
| `toString()`            | 获取异常字符串表示 | String              |
| `getStackTrace()`       | 获取堆栈跟踪       | StackTraceElement[] |

**getMessage()方法：**

```java
public String getMessage() {
    return detailMessage;
}
```

**getLocalizedMessage()方法：**

```java
public String getLocalizedMessage() {
    return getMessage(); // 默认返回getMessage()结果
}
```

**toString()方法：**

```java
public String toString() {
    String s = getClass().getName();
    String message = getLocalizedMessage();
    return (message != null) ? (s + ": " + message) : s;
}
```

#### 1.2.3 堆栈跟踪方法

**printStackTrace()方法：**

```java
// 将异常堆栈信息打印到标准错误流
public void printStackTrace() {
    printStackTrace(System.err);
}
```

**核心实现逻辑：**

```java
private void printStackTrace(PrintStreamOrWriter s) {
    // 使用IdentityHashMap防止循环引用
    Set<Throwable> dejaVu = Collections.newSetFromMap(
        new IdentityHashMap<Throwable, Boolean>());
    dejaVu.add(this);

    synchronized (s.lock()) {
        // 打印异常信息
        s.println(this);

        // 打印堆栈跟踪
        StackTraceElement[] trace = getOurStackTrace();
        for (StackTraceElement traceElement : trace)
            s.println("\tat " + traceElement);

        // 打印被抑制的异常
        for (Throwable se : getSuppressed())
            se.printEnclosedStackTrace(s, trace, SUPPRESSED_CAPTION, "\t", dejaVu);

        // 打印原因异常
        Throwable ourCause = getCause();
        if (ourCause != null)
            ourCause.printEnclosedStackTrace(s, trace, CAUSE_CAPTION, "", dejaVu);
    }
}
```

**getStackTrace()方法：**

```java
public StackTraceElement[] getStackTrace() {
    return getOurStackTrace().clone(); // 返回副本防止修改
}
```

### 1.3 JVM 内存结构与异常

#### 1.3.1 栈与堆的概念区别

**数据结构 vs 内存管理：**

| 概念   | 数据结构           | 内存管理               |
| ------ | ------------------ | ---------------------- |
| **栈** | 后进先出(LIFO)结构 | 自动分配回收的内存区域 |
| **堆** | 完全二叉树结构     | 动态分配的内存区域     |

**JVM 内存区域对比：**

| 内存区域     | 虚拟机栈                   | 虚拟机堆                  |
| ------------ | -------------------------- | ------------------------- |
| **内存管理** | JVM 自动分配               | 程序动态申请，GC 自动回收 |
| **存储内容** | 局部变量、方法参数、返回值 | 对象实例、数组            |
| **访问速度** | 快速                       | 较慢                      |
| **大小限制** | 连续内存空间，默认 1MB     | 可动态扩展                |
| **线程共享** | 线程私有                   | 线程共享                  |
| **数据结构** | 栈结构（LIFO）             | 树状结构管理              |

#### 1.3.2 内存区域可能的异常

| 内存区域     | 可能异常             | 产生原因                       |
| ------------ | -------------------- | ------------------------------ |
| **虚拟机栈** | `StackOverflowError` | 栈深度超过限制（如无限递归）   |
| **虚拟机栈** | `OutOfMemoryError`   | 栈内存不足（多线程创建过多栈） |
| **虚拟机堆** | `OutOfMemoryError`   | 堆内存不足，无法分配新对象     |

**异常示例：**

```java
// StackOverflowError示例
public void recursiveMethod() {
    recursiveMethod(); // 无限递归导致栈溢出
}

// HeapOutOfMemoryError示例
List<Object> list = new ArrayList<>();
while (true) {
    list.add(new Object()); // 不断创建对象导致堆内存溢出
}
```

### 1.4 异常堆栈信息分析

#### 1.4.1 异常堆栈阅读指南

**异常堆栈结构：**

```
异常类型: 异常详细信息
    at 包名.类名.方法名(文件名:行号)  ← 最先抛出异常的位置
    at 包名.类名.方法名(文件名:行号)  ← 调用链向上追溯
    at 包名.类名.方法名(文件名:行号)  ← 最后捕获异常的位置
```

**阅读原则：**

-   **异常信息**：异常类型 + 详细描述
-   **异常路径**：按照先进后出的顺序打印
-   **最下方**：最早抛出异常的源头
-   **最上方**：最后传播异常的位置

#### 1.4.2 JVM 堆栈信息优化机制

**为什么 JVM 要省略部分堆栈信息？**

1. **性能优化**：减少 I/O 打印开销
2. **避免重复**：忽略相同的堆栈信息
3. **提高可读性**：突出关键信息

**省略机制实现：**

```java
private void printEnclosedStackTrace(PrintStreamOrWriter s,
                                   StackTraceElement[] enclosingTrace,
                                   String caption,
                                   String prefix,
                                   Set<Throwable> dejaVu) {
    // 防止循环引用
    if (dejaVu.contains(this)) {
        s.println("\t[CIRCULAR REFERENCE:" + this + "]");
        return;
    }

    dejaVu.add(this);
    StackTraceElement[] trace = getOurStackTrace();
    int m = trace.length - 1;
    int n = enclosingTrace.length - 1;

    // 找出重复的堆栈帧数量
    while (m >= 0 && n >= 0 && trace[m].equals(enclosingTrace[n])) {
        m--; n--;
    }
    int framesInCommon = trace.length - 1 - m;

    // 打印堆栈信息
    s.println(prefix + caption + this);
    for (int i = 0; i <= m; i++)
        s.println(prefix + "\tat " + trace[i]);

    // 显示省略的帧数
    if (framesInCommon != 0)
        s.println(prefix + "\t... " + framesInCommon + " more");
}
```

#### 1.4.3 完整堆栈信息输出

**自定义异常处理器示例：**

```java
/**
 * 完整异常堆栈信息处理器
 */
public class FullStackTraceHandler implements Thread.UncaughtExceptionHandler {

    @Override
    public void uncaughtException(Thread t, Throwable e) {
        StackTraceElement[] elements = e.getStackTrace();
        System.err.println("Exception in thread \"" + t.getName() + "\" " + e.toString());

        // 打印完整堆栈信息
        for (StackTraceElement element : elements) {
            System.err.println("\tat " + element);
        }
    }
}
```

            System.err.println("\tat " + se);
        }

        Throwable ec = e.getCause();
        if (null != ec) {
            uncaughtException(t, ec);
        }
    }

}

public static void main(String[] args) {
Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler());
new CompleteException().someMethodThrowable();
}

````



---

## 2. JVM调优

### 2.1 JVM调优概述

JVM调优是提升Java应用性能的核心手段，涉及内存管理、垃圾回收、线程优化等多个方面。

#### 2.1.1 JVM调优核心策略

| 调优方向 | 具体措施 | 预期效果 |
|----------|----------|----------|
| **内存优化** | 调整堆大小、配置内存比例 | 减少GC频率，提高内存利用率 |
| **GC优化** | 选择合适的垃圾收集器 | 降低GC暂停时间 |
| **代码优化** | 减少对象创建、优化算法 | 减少JVM负担 |
| **监控诊断** | 使用性能监控工具 | 及时发现性能瓶颈 |

#### 2.1.2 JVM调优步骤

1. **性能监控**：使用JConsole、VisualVM等工具收集性能数据
2. **参数调整**：根据应用特性调整JVM参数
3. **GC策略选择**：选择适合的垃圾收集器
4. **代码优化**：优化应用程序代码
5. **数据存储优化**：使用缓存、内存映射等技术
6. **内存泄漏检测**：及时发现和修复内存泄漏

---

## 3. 性能优化

### 3.1 云端部署优化

#### 3.1.1 项目部署流程

**标准部署步骤：**

1. **本地打包**
   ```shell
   mvn clean package
````

2. **服务器部署**

    - 上传 JAR 包到服务器
    - 创建额外的`application.properties`配置文件
    - 编写启动脚本`deploy.sh`

3. **优化启动**
    ```shell
    nohup java -Xms2048m -Xmx2048m -XX:NewSize=1024m -XX:MaxNewSize=1024m \
    -jar test.jar --spring.config.addition-location=/var/application.properties &
    ```

#### 3.1.2 JVM 启动参数详解

| 参数                                | 说明                           | 推荐值              |
| ----------------------------------- | ------------------------------ | ------------------- |
| `-Xms`                              | JVM 初始堆内存                 | 与-Xmx 相同         |
| `-Xmx`                              | JVM 最大堆内存                 | 根据可用内存设置    |
| `-XX:NewSize`                       | 初始新生代大小                 | 堆内存的 1/3 到 1/2 |
| `-XX:MaxNewSize`                    | 最大新生代大小                 | 与 NewSize 相同     |
| `nohup`                             | 后台运行，控制台关闭后程序继续 | 生产环境必须        |
| `--spring.config.addition-location` | 指定额外配置文件               | 环境差异化配置      |

**参数设置原则：**

-   初始值与最大值相同，减少内存扩展开销
-   新生代大小合理配置，平衡 GC 效率
-   添加额外配置文件路径，支持环境差异化配置

### 3.2 Tomcat 配置优化

#### 3.2.1 核心配置参数

在`application.properties`中配置 Tomcat 优化参数：

```properties
# 线程配置
server.tomcat.threads.min-spare=10          # 最小线程数
server.tomcat.threads.max=200               # 最大线程数
server.tomcat.max-connections=8192          # 最大连接数
server.tomcat.accept-count=100              # 线程等待队列长度

# 连接优化
server.tomcat.connection-timeout=20000      # 连接超时时间(ms)
server.tomcat.keep-alive-timeout=60000      # KeepAlive超时时间(ms)
server.tomcat.max-keep-alive-requests=100   # KeepAlive最大请求数

# 性能优化
server.compression.enabled=true             # 开启压缩
server.compression.mime-types=text/html,text/css,application/javascript,application/json
```

#### 3.2.2 Tomcat 优化参数详解

| 参数类别     | 参数            | 作用                         | 推荐值     |
| ------------ | --------------- | ---------------------------- | ---------- |
| **线程配置** | min-spare       | 最小空闲线程数，提高响应速度 | 10-50      |
| **线程配置** | max             | 最大线程数，控制并发处理能力 | 200-800    |
| **连接配置** | max-connections | 最大连接数，控制服务器负载   | 8192-10000 |
| **队列配置** | accept-count    | 等待队列长度，缓冲高并发请求 | 100-1000   |
| **性能配置** | keep-alive      | 保持连接，减少握手开销       | 启用       |

---

## 4. 分布式扩展

### 4.1 Nginx 负载均衡与反向代理

#### 4.1.1 OpenResty 安装配置

**安装步骤：**

1. **依赖安装**

    ```shell
    yum install pcre-devel openssl-devel gcc curl
    ```

2. **OpenResty 安装**

    ```shell
    # 下载并解压
    wget https://openresty.org/download/openresty-1.19.9.1.tar.gz
    tar -xvzf openresty-1.19.9.1.tar.gz
    cd openresty-1.19.9.1

    # 编译安装
    ./configure
    make && make install
    ```

3. **验证安装**
    ```shell
    # Nginx默认安装路径
    /usr/local/openresty/nginx
    ```

#### 4.1.2 静态资源部署

**目录结构配置：**

```shell
/usr/local/openresty/nginx/html/
├── index.html          # 默认页面
└── resources/          # 静态资源目录
    ├── css/
    ├── js/
    ├── images/
    └── fonts/
```

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name example.com;

    # 静态资源location
    location /resources/ {
        root /usr/local/openresty/nginx/html;
        expires 30d;                    # 缓存30天
        add_header Cache-Control "public, immutable";
    }

    # 首页配置
    location / {
        root /usr/local/openresty/nginx/html;
        index index.html;
    }
}
```

#### 4.1.3 动态请求反向代理

**负载均衡配置：**

```nginx
# 后端服务器集群配置
upstream backend_server {
    server 192.168.1.100:8080 weight=3 max_fails=2 fail_timeout=30s;
    server 192.168.1.101:8080 weight=2 max_fails=2 fail_timeout=30s;
    server 192.168.1.102:8080 weight=1 max_fails=2 fail_timeout=30s;

    # 健康检查
    keepalive 32;
}

server {
    listen 80;

    # API请求代理
    location /api/ {
        proxy_pass http://backend_server;

        # 请求头设置
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;

        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
}
```

**负载均衡策略对比：**

| 策略            | 说明         | 适用场景       |
| --------------- | ------------ | -------------- |
| **round-robin** | 轮询（默认） | 服务器性能相近 |
| **weight**      | 加权轮询     | 服务器性能不同 |
| **ip_hash**     | IP 哈希      | 需要会话保持   |
| **least_conn**  | 最少连接     | 长连接应用     |

### 4.2 Java 服务分布式部署

#### 4.2.1 服务部署脚本

**启动脚本示例 (start.sh)：**

```shell
#!/bin/bash

APP_NAME="user-service"
JAR_FILE="user-service-1.0.0.jar"
PID_FILE="/var/run/${APP_NAME}.pid"
LOG_FILE="/var/log/${APP_NAME}.log"

# JVM参数配置
JVM_OPTS="-Xms1024m -Xmx2048m"
JVM_OPTS="$JVM_OPTS -XX:+UseG1GC"
JVM_OPTS="$JVM_OPTS -XX:MaxGCPauseMillis=200"
JVM_OPTS="$JVM_OPTS -XX:+PrintGCDetails"
JVM_OPTS="$JVM_OPTS -Xloggc:/var/log/${APP_NAME}-gc.log"

# 启动应用
start() {
    if [ -f $PID_FILE ]; then
        echo "Service is already running"
        exit 1
    fi

    echo "Starting $APP_NAME..."
    nohup java $JVM_OPTS -jar $JAR_FILE > $LOG_FILE 2>&1 &
    echo $! > $PID_FILE
    echo "Service started with PID: $(cat $PID_FILE)"
}

# 停止应用
stop() {
    if [ ! -f $PID_FILE ]; then
        echo "Service is not running"
        exit 1
    fi

    PID=$(cat $PID_FILE)
    echo "Stopping $APP_NAME (PID: $PID)..."
    kill $PID
    rm -f $PID_FILE
    echo "Service stopped"
}

# 重启应用
restart() {
    stop
    sleep 5
    start
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac
```

#### 4.2.2 Tomcat 访问日志配置

**在 application.properties 中启用访问日志：**

```properties
# 访问日志配置
server.tomcat.accesslog.enabled=true
server.tomcat.accesslog.directory=/var/log/tomcat
server.tomcat.accesslog.file-date-format=.yyyy-MM-dd
server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D
server.tomcat.accesslog.prefix=access_log
server.tomcat.accesslog.suffix=.log
```

### 4.3 分布式会话管理

#### 4.3.1 会话管理方案对比

| 方案              | 优点                     | 缺点                       | 适用场景     |
| ----------------- | ------------------------ | -------------------------- | ------------ |
| **Cookie**        | 客户端存储，服务器无状态 | 安全性差，大小限制         | 简单状态信息 |
| **Session**       | 服务器端存储，相对安全   | 服务器压力大，扩展性差     | 单机应用     |
| **Token(JWT)**    | 无状态，跨域支持好       | 无法主动失效，信息泄露风险 | 微服务架构   |
| **Redis Session** | 集中存储，高可用         | 增加网络开销               | 分布式应用   |

#### 4.3.2 Token 方案实现

**JWT Token 示例：**

```java
@Service
public class TokenService {

    private final String SECRET_KEY = "mySecretKey";
    private final long EXPIRATION_TIME = 86400000; // 24小时

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### 4.4 查询优化

#### 4.4.1 Redis 缓存优化

**缓存模式对比：**

| 缓存模式          | 说明                 | 优点         | 缺点         |
| ----------------- | -------------------- | ------------ | ------------ |
| **Cache-Aside**   | 应用程序管理缓存     | 控制灵活     | 代码复杂     |
| **Read-Through**  | 缓存层管理数据读取   | 代码简洁     | 缓存层复杂   |
| **Write-Through** | 同步写入缓存和数据库 | 数据一致性好 | 写入性能差   |
| **Write-Behind**  | 异步写入数据库       | 写入性能好   | 数据可能丢失 |

**缓存脏读处理策略：**

1. **设置合理的过期时间**

    ```java
    @Cacheable(value = "user", key = "#id", expire = 3600) // 1小时过期
    public User getUserById(Long id) {
        return userRepository.findById(id);
    }
    ```

2. **主动缓存更新**
    ```java
    @CacheEvict(value = "user", key = "#user.id")
    public User updateUser(User user) {
        User updated = userRepository.save(user);
        // 重新加载缓存
        return updated;
    }
    ```

**缓存击穿防护：**

```java
@Service
public class UserService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    public User getUserById(Long id) {
        String key = "user:" + id;

        // 1. 查询缓存
        User user = (User) redisTemplate.opsForValue().get(key);
        if (user != null) {
            return user;
        }

        // 2. 分布式锁防止缓存击穿
        String lockKey = "lock:user:" + id;
        String lockValue = UUID.randomUUID().toString();

        try {
            // 尝试获取锁（5秒超时）
            Boolean locked = stringRedisTemplate.opsForValue()
                .setIfAbsent(lockKey, lockValue, Duration.ofSeconds(5));

            if (Boolean.TRUE.equals(locked)) {
                // 获取锁成功，查询数据库
                user = userRepository.findById(id);
                if (user != null) {
                    // 设置缓存（30分钟）
                    redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(30));
                } else {
                    // 防止缓存穿透，设置空值（5分钟）
                    redisTemplate.opsForValue().set(key, new Object(), Duration.ofMinutes(5));
                }
                return user;
            } else {
                // 获取锁失败，短暂等待后重试
                Thread.sleep(50);
                return getUserById(id);
            }
        } finally {
            // 释放锁
            releaseLock(lockKey, lockValue);
        }
    }

    private void releaseLock(String lockKey, String lockValue) {
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                       "return redis.call('del', KEYS[1]) else return 0 end";
        stringRedisTemplate.execute(
            RedisScript.of(script, Long.class),
            Collections.singletonList(lockKey),
            lockValue);
    }
}
```

#### 4.4.2 本地缓存优化

**Guava Cache 配置：**

```java
@Configuration
public class CacheConfig {

    @Bean
    public Cache<String, Object> localCache() {
        return CacheBuilder.newBuilder()
                .maximumSize(10000)                    // 最大缓存条数
                .expireAfterWrite(30, TimeUnit.MINUTES) // 写入30分钟后过期
                .expireAfterAccess(10, TimeUnit.MINUTES) // 访问10分钟后过期
                .refreshAfterWrite(5, TimeUnit.MINUTES)  // 写入5分钟后刷新
                .recordStats()                          // 启用统计
                .removalListener(notification -> {       // 移除监听器
                    System.out.println("Cache removed: " + notification.getKey()
                        + ", cause: " + notification.getCause());
                })
                .build();
    }
}
```

**本地缓存使用示例：**

```java
@Service
public class ProductService {

    @Autowired
    private Cache<String, Object> localCache;

    public Product getProduct(String productId) {
        return (Product) localCache.get(productId, () -> {
            // 缓存未命中时的加载逻辑
            return productRepository.findById(productId);
        });
    }

    public void updateProduct(Product product) {
        productRepository.save(product);
        // 清理本地缓存
        localCache.invalidate(product.getId());
    }
}
```

#### 4.4.3 热点缓存策略

**热点数据识别：**

1. **访问频次统计**

    ```java
    @Component
    public class HotDataDetector {

        private final Map<String, AtomicInteger> accessCount = new ConcurrentHashMap<>();
        private final int HOT_THRESHOLD = 100; // 热点阈值

        public boolean isHotData(String key) {
            int count = accessCount.computeIfAbsent(key, k -> new AtomicInteger(0))
                                  .incrementAndGet();
            return count >= HOT_THRESHOLD;
        }

        @Scheduled(fixedRate = 300000) // 5分钟重置一次
        public void resetAccessCount() {
            accessCount.clear();
        }
    }
    ```

2. **热点数据预热**

    ```java
    @Component
    public class CacheWarmup {

        @EventListener
        @Async
        public void warmupCache(ApplicationReadyEvent event) {
            // 预热热点商品数据
            List<String> hotProductIds = getHotProductIds();
            for (String productId : hotProductIds) {
                productService.getProduct(productId);
            }
        }
    }
    ```

3. **热点数据淘汰策略**

    | 策略       | 说明         | 适用场景     |
    | ---------- | ------------ | ------------ |
    | **LRU**    | 最近最少使用 | 通用场景     |
    | **LFU**    | 最少使用频次 | 访问模式稳定 |
    | **TTL**    | 时间过期     | 时效性数据   |
    | **Random** | 随机淘汰     | 内存紧张时   |

#### 4.4.4 Nginx 代理缓存

**缓存路径配置：**

在`nginx.conf`中配置缓存路径：

```nginx
# 缓存路径配置
proxy_cache_path /usr/local/openresty/nginx/cache_temp
                 levels=1:2                          # 两层目录结构
                 keys_zone=tmp_cache:100m             # 缓存区名称和内存大小
                 inactive=7d                          # 7天未访问自动删除
                 max_size=10g                         # 最大缓存文件大小
                 use_temp_path=off;                   # 关闭临时文件路径
```

**Location 缓存配置：**

```nginx
location /api/ {
    proxy_pass http://backend_server;

    # 缓存配置
    proxy_cache tmp_cache;                           # 使用缓存区
    proxy_cache_valid 200 206 304 302 10d;          # 成功响应缓存10天
    proxy_cache_valid 404 1m;                       # 404缓存1分钟
    proxy_cache_key $scheme$proxy_host$request_uri;  # 缓存key规则

    # 缓存控制
    proxy_cache_bypass $http_pragma $http_authorization; # 绕过缓存条件
    proxy_no_cache $http_pragma $http_authorization;     # 不缓存条件

    # 响应头
    add_header X-Cache-Status $upstream_cache_status;    # 添加缓存状态头
}
```

**缓存参数详解：**

| 参数                | 说明               | 推荐值       |
| ------------------- | ------------------ | ------------ |
| `levels`            | 目录层级结构       | 1:2          |
| `keys_zone`         | 内存缓存区大小     | 100m         |
| `inactive`          | 非活跃数据过期时间 | 7d           |
| `max_size`          | 最大磁盘缓存大小   | 10g          |
| `proxy_cache_valid` | 不同状态码缓存时间 | 根据业务设定 |

### 4.5 OpenResty + Lua 扩展

#### 4.5.1 Lua 模块配置

**在 nginx.conf 的 http 模块下配置：**

```nginx
http {
    # Lua模块路径
    lua_package_path "/usr/local/openresty/lualib/?.lua;;";
    lua_package_cpath "/usr/local/openresty/lualib/?.so;;";

    # 共享字典配置
    lua_shared_dict my_cache 128m;
    lua_shared_dict api_limit 10m;

    # 其他配置...
}
```

#### 4.5.2 Lua 脚本应用

**简单 Lua 测试：**

```nginx
location = /lua {
    default_type 'text/plain';
    content_by_lua_block {
        ngx.say("Hello, Lua!")
        ngx.say("Current time: ", ngx.now())
    };
}
```

**共享字典缓存示例：**

```nginx
location ^~/api/cache/ {
    default_type 'application/json';
    content_by_lua_file '/usr/local/openresty/nginx/lua/cache_handler.lua';
}
```

**cache_handler.lua 文件内容：**

```lua
-- 获取共享字典
local cache = ngx.shared.my_cache

-- 获取请求参数
local key = ngx.var.arg_key
local value = ngx.var.arg_value

if not key then
    ngx.status = 400
    ngx.say('{"error": "key parameter is required"}')
    return
end

-- GET请求：获取缓存
if ngx.var.request_method == "GET" then
    local cached_value = cache:get(key)
    if cached_value then
        ngx.say('{"key": "', key, '", "value": "', cached_value, '"}')
    else
        ngx.status = 404
        ngx.say('{"error": "key not found"}')
    end

-- POST请求：设置缓存
elseif ngx.var.request_method == "POST" then
    if not value then
        ngx.status = 400
        ngx.say('{"error": "value parameter is required"}')
        return
    end

    local success, err = cache:set(key, value, 3600) -- 缓存1小时
    if success then
        ngx.say('{"message": "cache set successfully"}')
    else
        ngx.status = 500
        ngx.say('{"error": "failed to set cache: ', err, '"}')
    end

-- DELETE请求：删除缓存
elseif ngx.var.request_method == "DELETE" then
    cache:delete(key)
    ngx.say('{"message": "cache deleted"}')

else
    ngx.status = 405
    ngx.say('{"error": "method not allowed"}')
end
```

### 静态资源 CDN

刷新方式

### 全页面静态化 PhantomJS

爬虫

初始化标记

CDN 部署

## 流量削峰

### 秒杀令牌

权限模块

令牌频次控制

### 秒杀大闸

库存联动

### 队列泄洪

## 交易优化（商城秒杀）

### 高效验证

缓存

索引

### 缓存库存

原子操作

一致性

### 库存售罄防击穿

缓存令牌

### 交易异步化

异步

轮询

### RocketMQ 事务型消息

生产者

消费者

消息反查

## 防刷限流

### 验证码

### 令牌桶限流

ratelimiter

### 防黄牛防刷

设备指纹

---

## 5. 问题排查

### 5.1 JVM 性能调优最佳实践

#### 5.1.1 JVM 调优核心原则

JVM 调优是一个系统性工程，需要遵循以下核心原则：

| 调优步骤        | 具体措施                           | 目标效果           |
| --------------- | ---------------------------------- | ------------------ |
| **1. 性能监控** | 使用 JConsole、VisualVM、JProfiler | 了解应用运行状态   |
| **2. 参数调整** | 调整堆大小、GC 策略、线程池        | 优化内存和并发性能 |
| **3. GC 优化**  | 选择合适的垃圾收集器               | 减少 GC 暂停时间   |
| **4. 代码优化** | 减少对象创建、优化算法             | 降低 JVM 负担      |
| **5. 存储优化** | 使用缓存、内存映射文件             | 减少 IO 负担       |
| **6. 内存检测** | 及时发现和修复内存泄漏             | 保证应用稳定性     |

#### 5.1.2 垃圾收集器选择指南

| GC 类型            | 适用场景               | 优点                 | 缺点                 |
| ------------------ | ---------------------- | -------------------- | -------------------- |
| **Serial GC**      | 单核 CPU、小内存应用   | 简单、内存占用小     | STW 时间长           |
| **Parallel GC**    | 多核 CPU、吞吐量优先   | 高吞吐量             | STW 时间较长         |
| **CMS GC**         | 大内存、低延迟要求     | 并发收集、STW 时间短 | 内存碎片问题         |
| **G1 GC**          | 大内存、可预测暂停时间 | 可控暂停时间         | 吞吐量略低           |
| **ZGC/Shenandoah** | 超大内存、极低延迟     | 超低延迟             | 新技术，稳定性待验证 |

### 5.2 线上问题排查工具

#### 5.2.1 JVM 诊断工具详解

**核心诊断工具：**

| 工具       | 功能           | 使用场景     | 命令示例                         |
| ---------- | -------------- | ------------ | -------------------------------- |
| **jps**    | 查看 Java 进程 | 获取进程 ID  | `jps -v \| grep appname`         |
| **jinfo**  | 查看 JVM 参数  | 检查配置     | `jinfo -flags PID`               |
| **jstat**  | 查看 GC 统计   | 性能分析     | `jstat -gcutil PID 1s`           |
| **jstack** | 查看线程栈     | 死锁分析     | `jstack -l PID`                  |
| **jmap**   | 内存分析       | OOM 问题排查 | `jmap -dump:file=heap.hprof PID` |

#### 5.2.2 jstat 命令详解

**GC 统计信息解读：**

```shell
jstat -gcutil PID 1s 10  # 每秒输出一次，共10次
```

**输出字段说明：**

| 字段     | 含义                | 正常范围       |
| -------- | ------------------- | -------------- |
| **S0**   | Survivor 0 区使用率 | 0-100%         |
| **S1**   | Survivor 1 区使用率 | 0-100%         |
| **E**    | Eden 区使用率       | 通常较高       |
| **O**    | 老年代使用率        | <80%           |
| **M**    | 元数据区使用率      | <90%           |
| **CCS**  | 压缩类空间使用率    | <90%           |
| **YGC**  | Young GC 次数       | 监控增长趋势   |
| **YGCT** | Young GC 总时间(秒) | 单次<100ms     |
| **FGC**  | Full GC 次数        | 尽量避免       |
| **FGCT** | Full GC 总时间(秒)  | 单次<1s        |
| **GCT**  | 总 GC 时间(秒)      | <总运行时间 5% |

#### 5.2.3 线程栈分析

**jstack 命令使用：**

```shell
# 生成线程栈快照
jstack -l PID > thread_dump.txt

# 分析死锁
jstack PID | grep -A 5 -B 5 "Found deadlock"

# 分析高CPU使用的线程
top -Hp PID  # 找到高CPU线程ID
printf "%x\n" THREAD_ID  # 转换为16进制
jstack PID | grep -A 10 0x[16进制线程ID]
```

### 5.3 OOM 问题排查

#### 5.3.1 OOM 预防配置

**启动参数配置：**

```shell
java -Xms2048m -Xmx4096m \
     -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/heapdump/ \
     -XX:+PrintGCDetails \
     -XX:+PrintGCTimeStamps \
     -Xloggc:/var/log/gc.log \
     -jar application.jar
```

**参数说明：**

| 参数                              | 作用                 | 推荐值       |
| --------------------------------- | -------------------- | ------------ |
| `-XX:+HeapDumpOnOutOfMemoryError` | OOM 时自动生成堆转储 | 必须启用     |
| `-XX:HeapDumpPath`                | 堆转储文件路径       | 可写目录     |
| `-XX:+PrintGCDetails`             | 打印详细 GC 信息     | 生产环境启用 |
| `-Xloggc`                         | GC 日志文件路径      | 独立文件     |

#### 5.3.2 堆转储文件分析

**使用 JProfiler 分析堆转储：**

1. **内存泄漏检测**

    - 查看对象引用链
    - 分析大对象占用
    - 检查集合类大小

2. **内存使用模式分析**
    - 对象分配热点
    - 内存增长趋势
    - GC 效率评估

**Memory Analyzer (MAT) 使用：**

```shell
# 安装MAT
wget https://eclipse.org/mat/downloads.php

# 分析堆转储文件
./MemoryAnalyzer -vmargs -Xmx4g -data workspace
```

### 5.4 性能监控与告警

#### 5.4.1 关键指标监控

**核心性能指标：**

| 指标分类 | 监控指标     | 告警阈值   | 处理建议             |
| -------- | ------------ | ---------- | -------------------- |
| **内存** | 堆内存使用率 | >85%       | 调整堆大小或优化代码 |
| **GC**   | Full GC 频率 | >1 次/小时 | 优化 GC 策略         |
| **线程** | 线程数量     | >1000      | 检查线程泄漏         |
| **CPU**  | CPU 使用率   | >80%       | 性能优化或扩容       |
| **响应** | 接口响应时间 | >1s        | 代码优化或缓存       |

#### 5.4.2 自动化监控脚本

**JVM 监控脚本示例：**

```shell
#!/bin/bash

APP_NAME="user-service"
PID=$(ps aux | grep $APP_NAME | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
    echo "Application not running"
    exit 1
fi

# 获取JVM指标
HEAP_USED=$(jstat -gc $PID | tail -1 | awk '{print ($3+$4+$6+$8)/($3+$4+$5+$6+$7+$8)*100}')
GC_COUNT=$(jstat -gc $PID | tail -1 | awk '{print $12+$13}')
THREAD_COUNT=$(jstack $PID | grep "^\"" | wc -l)

# 告警检查
if (( $(echo "$HEAP_USED > 85" | bc -l) )); then
    echo "ALERT: High heap usage: ${HEAP_USED}%"
fi

if [ $THREAD_COUNT -gt 1000 ]; then
    echo "ALERT: High thread count: $THREAD_COUNT"
fi

echo "Heap Usage: ${HEAP_USED}%, Threads: $THREAD_COUNT, GC Count: $GC_COUNT"
```

---

## 总结

本文档全面介绍了 Java 性能调优的各个方面，包括：

1. **异常处理**：深入理解 Java 异常体系和堆栈分析
2. **JVM 调优**：内存管理、垃圾回收、参数配置
3. **性能优化**：缓存策略、分布式部署、配置优化
4. **分布式扩展**：负载均衡、会话管理、微服务架构
5. **问题排查**：监控工具、性能分析、故障诊断

通过系统化的调优方法和工具使用，可以显著提升 Java 应用的性能和稳定性。在实际应用中，应该根据具体业务场景选择合适的优化策略，并建立完善的监控和告警机制。
