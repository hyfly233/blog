## 基础相关

### Java 语言具有哪些特点

- Java 为纯面向对象的语言。它能够直接反应现实生活中的对象。
- 具有平台无关性。Java 利用 Java 虚拟机运行字节码，编译后的程序可在其它平台运行。
- Java 为解释型语言，编译器把 Java 代码编译成平台无关的中间代码，然后在 JVM 上解释运行，具有很好的可移植性。
- Java 提供了很多内置类库。
- Java 具有较好的安全性和健壮性，Java 提供了异常处理和垃圾回收机制。

### JDK 与 JRE

- JDK：Java 开发工具包（Java Development Kit），提供了 Java 的开发环境和运行环境
- JRE：Java 运行环境（Java Runtime Environment），提供了 Java 运行所需的环境
- JDK 包含了 JRE

### Java 基本数据类型

- byte: 占用 1 个字节，取值范围-128 ~ 127
- short: 占用 2 个字节，取值范围-215 ~ 215-1
- int：占用 4 个字节，取值范围-231 ~ 231-1
- long：占用 8 个字节
- float：占用 4 个字节
- double：占用 8 个字节
- char: 占用 2 个字节
- boolean：占用大小根据实现虚拟机不同有所差异

### 简述 Java 访问修饰符

- public: 对所有类可见
- protected : 对同一包内的类和所有子类可见，不能修饰类
- default: 默认访问修饰符，在同一包内可见
- private: 在同一类内可见，不能修饰类

| 修饰符    | 当前类 | 同包 | 子类 | 其他包 |
| --------- | ------ | ---- | ---- | ------ |
| public    | y      | y    | y    | y      |
| protected | y      | y    | y    | ×      |
| default   | y      | y    | ×    | ×      |
| private   | y      | ×    | ×    | ×      |

### Java 代码块执行顺序

- 静态代码块只执行一次
- 先后顺序：父类静态变量 => 父类静态代码块 => 子类静态变量 => 子类静态代码块 => 父类非静态变量 => 父类非静态代码块 => 父类构造函数 => 子类非静态变量 => 子类非静态代码块 => 子类构造函数

### Java中类、对象、引用三者是什么关系

在 Java 中，类是一种定义对象属性和行为的模板，对象是类的一个实例，而引用是指向对象在内存中的地址的变量

- 类是一个通用的模板，它定义了一组属性和方法，可以用来创建对象
- 对象是由类创建的实例，它包含了类中定义的所有属性和方法的值和实现。可以通过使用 new 关键字来创建对象，然后可以使用该对象调用类中的方法和访问其属性
- 引用是一个指向对象的指针，它存储对象在内存中的地址。当使用 new 关键字创建对象时，返回的是对象在内存中的地址，可以将该地址存储在一个引用变量中。然后，可以使用该引用变量来访问对象的属性和方法

因此，类是创建对象的模板，对象是类的实例，而引用是指向对象的指针。可以通过引用来访问对象的属性和方法

## 类

### 简述类

类是一个通用的模板，它定义了一组属性和方法，可以用来创建对象

### 内部类相关

#### 简述内部类及其作用

- 成员内部类
  作为成员对象的内部类。可以访问 private 及以上外部类的属性和方法。外部类想要访问内部类属性或方法时，必须要创建一个内部类对象，然后通过该对象访问内部类的属性或方法。外部类也可访问 private 修饰的内部类属性 
- 局部内部类
  存在于方法中的内部类。访问权限类似局部变量，只能访问外部类的 final 变量 
- 匿名内部类
  只能使用一次，没有类名，只能访问外部类的 final 变量 
- 静态内部类
  类似类的静态成员变量 

### 包装类

#### Integer a = 1000，Integer b = 1000，a==b 的结果是什么？那如果 a，b 都为1，结果又是什么？

- Integer a = 1000，Integer b = 1000，a==b 结果为false
- Integer a = 1，Integer b = 1，a==b 结果为true
- Integer 包装类缓存的范围，在-128~127之间会缓存起来，比较的是直接缓存的数据，在此之外比较的是对象

#### 什么是包装类

Java 中有 8 个基本类型，分别对应的 8 个包装类

- byte -- Byte
- boolean -- Boolean
- short -- Short
- char -- Character
- int -- Integer
- long -- Long
- float -- Float
- double -- Double

#### 为什么需要包装类:

- 基本数据类型方便、简单、高效，但泛型不支持、集合元素不支持
- 不符合面向对象思维
- 包装类提供很多方法，方便使用，如 Integer 类 toString(int i)、parseInt(String s) 方法等等

#### 自动装箱拆箱

对于 Java 基本数据类型，均对应一个包装类。

- 装箱：将基本数据类型转换为包装器类型，如 int->Integer
- 拆箱：将包装器类型转换为基本数据类型，如 Integer->int

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

1. new关键字

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
    1. MarkWord：包含一系列的标记位，比如轻量级锁的标记位，偏向锁标记位,gc记录信息等等
    2. ClassPointer：用来指向对象对应的 Class 对象（其对应的元数据对象）的内存地址。在 32 位系统占 4 字节，在 64 位系统中占 8 字节。 
2.  Length：只在数组对象中存在，用来记录数组的长度，占用 4 字节 
3.  Instance data：对象实际数据，对象实际数据包括了对象的所有成员变量，其大小由各个成员变量的大小决定。(这里不包括静态成员变量，因为其是在方法区维护的) 
4.  Padding：Java 对象占用空间是 8 字节对齐的，即所有 Java 对象占用 bytes 数必须是 8 的倍数,是因为当我们从磁盘中取一个数据时，不会说我想取一个字节就是一个字节，都是按照一块儿一块儿来取的，这一块大小是 8 个字节，所以为了完整，padding 的作用就是补充字节，保证对象是 8 字节的整数倍。 

## 引用

### 四种引用类型?

- 强引用 StrongReference
  垃圾回收器不会回收被引用的对象，哪怕内存不足时，JVM 也会直接抛出 OutOfMemoryError，除非赋值为 null

```java
Object obj = new Object(); //只要obj还指向Object对象，Object对象就不会被回收
```

- 软引用 SoftReference
  软引用是用来描述一些非必需但仍有用的对象。在内存足够的时候，软引用对象不会被回收，只有在内存不足时，系统则会回收软引用对象，如果回收了软引用对象之后仍然没有足够的内存，才会抛出内存溢出异常
- 弱引用 WeakReference
  弱引用的引用强度比软引用要更弱一些，无论内存是否足够，只要 JVM 开始进行垃圾回收，那些被弱引用关联的对象都会被回收
- 虚引用 PhantomReference
  虚引用是最弱的一种引用关系，如果一个对象仅持有虚引用，那么它就和没有任何引用一样，它随时可能会被回收，在 JDK1.2 之后，用 PhantomReference 类来表示，通过查看这个类的源码，发现它只有一个构造函数和一个 get() 方法，而且它的 get() 方法仅仅是返回一个null，也就是说将永远无法通过虚引用来获取对象，虚引用必须要和 ReferenceQueue 引用队列一起使用，NIO 的堆外内存就是靠其管理

## 方法

### 是否可以从一个静态（static）方法内部发出对非静态（non-static）方法的调用？

不可以，静态方法只能访问静态成员，因为非静态方法的调用要先创建对象，在调用静态方法时可能对象并没有被初始化

### 抽象的（abstract）方法是否可同时是静态的（static）,是否可同时是本地方法（native），是否可同时被synchronized修饰

**都不能**

- 抽象方法需要子类重写，而静态的方法是无法被重写的，因此二者是矛盾的
- 本地方法是由本地代码实现的方法，而抽象方法是没有实现的，也是矛盾的
- synchronized和方法的实现细节有关，抽象方法不涉及实现细节，因此也是相互矛盾的

### Object中有哪些公共方法？

- equals()
- clone()
- getClass()
- notify(),notifyAll(),wait()
- toString()

### 深拷贝、浅拷贝是什么？

- 浅拷贝并不是真的拷贝，只是复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。
- 深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

### 如何实现对象克隆？

有两种方式：

1. 实现Cloneable接口并重写Object类中的clone()方法；
2. 实现Serializable接口，通过对象的序列化和反序列化实现克隆，可以实现真正的深度克隆。

### JDK 8 为什么要 hashcode 异或其右移十六位的值

因为在JDK 7 中扰动了 4 次，计算 hash 值的性能会稍差一点点。从速度、功效、质量来考虑，JDK 8 优化了高位运算的算法，通过hashCode()的高16位异或低16位实现：`(h = k.hashCode()) ^ (h >>> 16)`。这么做可以在数组 table 的 length 比较小的时候，也能保证考虑到高低Bit都参与到Hash的计算中，同时不会有太大的开销。

### 两个对象值相同(x.equals(y) == true)，但却可有不同的hash code，这句话对不对？

不对，如果两个对象x和y满足x.equals(y) == true，它们的哈希码（hash code）应当相同。
Java对于eqauls方法和hashCode方法是这样规定的：

1. 如果两个对象相同（equals方法返回true），那么它们的hashCode值一定要相同；
2. 如果两个对象的hashCode相同，它们并不一定相同。当然，你未必要按照要求去做，但是如果你违背了上述原则就会发现在使用容器时，相同的对象可以出现在Set集合中，同时增加新元素的效率会大大下降（对于使用哈希存储的系统，如果哈希码频繁的冲突将会造成存取性能急剧下降）。

首先equals方法必须满足自反性（x.equals(x)必须返回true）、对称性（x.equals(y)返回true时，y.equals(x)也必须返回true）、传递性（x.equals(y)和y.equals(z)都返回true时，x.equals(z)也必须返回true）和一致性（当x和y引用的对象信息没有被修改时，多次调用x.equals(y)应该得到同样的返回值），而且对于任何非null值的引用x，x.equals(null)必须返回false。

### 实现高质量的equals方法的诀窍包括

1. 使用==操作符检查”参数是否为这个对象的引用”；
2. 使用instanceof操作符检查”参数是否为正确的类型”；
3. 对于类中的关键属性，检查参数传入对象的属性是否与之相匹配；
4. 编写完equals方法后，问自己它是否满足对称性、传递性、一致性；
5. 重写equals时总是要重写hashCode；
6. 不要将equals方法参数中的Object对象替换为其他的类型，在重写时不要忘掉 @Override  注解。 

### Java中 == 和eqauls()的区别

- == 比较的是引用，equals 比较的是内容。
- 如果变量是基础数据类型，== 用于比较其对应值是否相等。如果变量指向的是对象，== 用于比较两个对象是否指向同一块存储空间。
- equals 是 Object 类提供的方法之一，每个 Java 类都继承自 Object 类，所以每个对象都具有 equals 这个方法。Object 类中定义的 equals 方法内部是直接调用 == 比较对象的。但通过覆盖的方法可以让它不是比较引用而是比较数据内容。

### equals()和 hashcode的区别

在 Java 中，equals()和hashCode()方法都是用于处理对象相等性的方法，但它们的作用有所不同。

- equals()方法用于比较两个对象的内容是否相同，而不是比较它们的引用是否相等。默认情况下，equals()方法使用对象的引用相等性来比较对象，也就是说，它只有在两个对象引用指向同一个对象时才返回 true。如果需要比较两个对象的内容，就需要在类中重写 equals() 方法，并根据对象的内容来比较对象。
- hashCode()方法用于获取对象的哈希码，这是一个整数值，用于将对象存储在哈希表等数据结构中。哈希码是根据对象的内容计算出来的，因此如果两个对象的内容相同，它们的哈希码也应该相同。如果一个类重写了 equals() 方法，那么它也应该重写 hashCode() 方法，以保证相等的对象具有相等的哈希码。

需要注意的是，两个对象的 hashCode() 方法返回相等的哈希码，并不意味着这两个对象是相等的，因为哈希码在计算过程中可能会存在冲突。因此，在比较对象相等性时，必须同时比较对象的哈希码和内容。

## 异常

### 简述 Java 异常的分类

Java 异常分为 Error（程序无法处理的错误），和 Exception（程序本身可以处理的异常）。这两个类均继承 Throwable。

- Error 常见的有 StackOverFlowError、OutOfMemoryError 等等
- Exception 可分为运行时异常和非运行时异常。对于运行时异常，可以利用 try catch 的方式进行处理，也可以不处理。对于非运行时异常，必须处理，不处理的话程序无法通过编译

### 常见的异常有哪些？

- NullPointerException 空指针异常
- ArrayIndexOutOfBoundsException 索引越界异常
- InputFormatException 输入类型不匹配
- SQLException SQL异常
- IllegalArgumentException 非法参数
- NumberFormatException 类型转换异常

### 异常要怎么解决？

Java标准库内建了一些通用的异常，这些类以Throwable为顶层父类。Throwable又派生出Error类和Exception类

- 错误：Error类以及他的子类的实例，代表了JVM本身的错误。错误不能被程序员通过代码处理，Error很少出现。因此，程序员应该关注Exception为父类的分支下的各种异常类
- 异常：Exception以及他的子类，代表程序运行时发送的各种不期望发生的事件。可以被Java异常处理机制使用，是异常处理的核心

处理方法:

- try catch

```java
try{
	// 程序代码
}catch(ExceptionName e1){
	//Catch 块
}
```

- throw
  throw 关键字作用是抛出一个异常，抛出的时候是抛出的是一个异常类的实例化对象，在异常处理中，try 语句要捕获的是一个异常对象，那么此异常对象也可以自己抛出 
- throws
  定义一个方法的时候可以使用 throws 关键字声明。使用 throws 关键字声明的方法表示此方法不处理异常，而交给方法调用处进行处理

### 运行时异常与受检异常有何异同？

异常表示程序运行过程中可能出现的非正常状态，运行时异常表示虚拟机的通常操作中可能遇到的异常，是一种常见运行错误，只要程序设计得没有问题通常就不会发生。受检异常跟程序运行的上下文环境有关，即使程序设计无误，仍然可能因使用的问题而引发。Java编译器要求方法必须声明抛出可能发生的受检异常，但是并不要求必须声明抛出未被捕获的运行时异常。
异常和继承一样，是面向对象程序设计中经常被滥用的东西，在Effective Java中对异常的使用给出了以下指导原则：

- 不要将异常处理用于正常的控制流（设计良好的API不应该强迫它的调用者为了正常的控制流而使用异常）
- 对可以恢复的情况使用受检异常，对编程错误使用运行时异常
- 避免不必要的使用受检异常（可以通过一些状态检测手段来避免异常的发生）
- 优先使用标准的异常
- 每个方法抛出的异常都要有文档
- 保持异常的原子性
- 不要在catch中忽略掉捕获到的异常

## 注解

### 简述注解

Java 注解用于为 Java 代码提供元数据。作为元数据，注解不直接影响你的代码执行，但也有一些类型的注解实际上可以用于这一目的。其可以用于提供信息给编译器，在编译阶段时给软件提供信息进行相关的处理，在运行时处理写相应代码，做对应操作。

### 简述元注解

元注解可以理解为注解的注解，即在注解中使用，实现想要的功能。其具体分为：

- @Retention: 表示注解存在阶段是保留在源码，还是在字节码（类加载）或者运行期（JVM 中运行）。
- @Target：表示注解作用的范围。
- @Documented：将注解中的元素包含到 Javadoc 中去。
- @Inherited：一个被@Inherited  注解了的注解修饰了一个父类，如果他的子类没有被其他注解修饰，则它的子类也继承了父类的注解。 
- @Repeatable：被这个元注解修饰的注解可以同时作用一个对象多次，但是每次作用注解又可以代表不同的含义

## 关键字相关

### final、finally 和 finalize 的区别是什么？

- final：用于声明属性、方法和类，分别表示属性不可变、方法不可覆盖、类不可继承
- finally：作为异常处理的一部分，只能在 try/catch 语句中使用，finally 附带一个语句块用来表示这个语句最终一定被执行，经常被用在需要释放资源的情况下
- finalize：是 Object 类的一个方法，在垃圾收集器执行的时候会调用被回收对象的 finalize()方法。当垃圾回收器准备好释放对象占用空间时，首先会调用 finalize()方法，并在下一次垃圾回收动作发生时真正回收对象占用的内存

### Java 中的final关键字有哪些用法？

- 修饰类：表示该类不能被继承；
- 修饰方法：表示方法不能被重写；
- 修饰变量：表示变量只能一次赋值以后值不能被修改（常量）。

### volatile 有什么作用？

![image.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1677824831929-34dc6429-1cee-4222-9a20-973d021e3afe.png#averageHue=%23f1ede2&clientId=u74b777b2-7848-4&id=qbGxm&name=image.png&originHeight=846&originWidth=1032&originalType=binary&ratio=1&rotation=0&showTitle=false&size=320533&status=done&style=none&taskId=u4ba11097-1490-46ae-a497-03a70bf13a6&title=)

1. 保证内存可见性
   可见性是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的。也就是一个线程修改的结果，另一个线程马上就能看到。 
2. 禁止指令重排序
   cpu 是和缓存做交互的，但是由于 cpu 运行效率太高，所以会不等待当前命令返回结果从而继续执行下一个命令，就会有乱序执行的情况发生 

### 简述 throw 与 throws 的区别

- throw：一般是用在方法体的内部，由开发者定义当程序语句出现问题后主动抛出一个异常 
- throws：一般用于方法声明上，代表该方法可能会抛出的异常列表 

### 出现在 Java 程序中的 finally 代码块是否一定会执行？

- 当遇到下面情况不会执行：
  - 当程序在进入 try 语句块之前就出现异常时会直接结束
  - 当程序在 try 块中强制退出时，如使用 System.exit(0)，也不会执行 finally 块中的代码
- 其它情况下，在 try/catch/finally 语句执行的时候，try 块先执行，当有异常发生，catch 和 finally 进行处理后程序就结束了，当没有异常发生，在执行完 finally 中的代码后，后面代码会继续执行
- 当 try/catch 语句块中有 return 时，finally 语句块中的代码会在 return 之前执行。如果 try/catch/finally 块中都有 return 语句，finally 块中的 return 语句会覆盖 try/catch 模块中的 return 语句

### switch 是否能作用在byte 上，是否能作用在long、float 上，是否能作用在String上？

在Java 5以前，switch(expr)中，expr只能是byte、short、char、int。从Java 5开始，Java中引入了枚举类型，expr也可以是enum类型，从Java 7开始，expr还可以是字符串（String），但是长整型（long）,浮点数（float）在目前所有的版本中都是不可以的。

### float f=3.4是否正确？

不正确。3.4是双精度数，将双精度型（double）赋值给浮点型（float）属于下转型（down-casting，也称为窄化）会造成精度损失，因此需要强制类型转换float f =(float)3.4; 或者写成float f =3.4F

### Java 语言中关键字 static 的作用是什么？

static 的主要作用有两个：

- 为某种特定数据类型或对象分配与创建对象个数无关的单一的存储空间
- 使得某个方法或属性与类而不是对象关联在一起，即在不创建对象的情况下可通过类直接调用方法或使用类的属性

具体而言 static 又可分为 4 种使用方式：

-  修饰成员变量
   用 static 关键字修饰的静态变量在内存中只有一个副本。只要静态变量所在的类被加载，这个静态变量就会被分配空间，可以使用“类.静态变量”和“对象.静态变量”的方法使用 
-  修饰成员方法
   static 修饰的方法无需创建对象就可以被调用。static 方法中不能使用 this 和 super 关键字，不能调用非 static 方法，只能访问所属类的静态成员变量和静态成员方法 
-  修饰代码块
   JVM 在加载类的时候会执行 static 代码块。static 代码块常用于初始化静态变量。static 代码块只会被执行一次 
-  修饰内部类
   static 内部类可以不依赖外部类实例对象而被实例化。静态内部类不能与外部类有相同的名字，不能访问普通成员变量，只能访问外部类中的静态成员和静态成员方法 

## 其他

### short s1 = 1; s1 = s1 + 1; 与 short s1 = 1; s1 += 1;有错吗

对于short s1 = 1; s1 = s1 + 1;由于1是int类型，因此s1+1运算结果也是int 型，需要强制转换类型才能赋值给short型。而short s1 = 1; s1 += 1;可以正确编译，因为s1+= 1;相当于s1 = (short)(s1 + 1);其中有隐含的强制类型转换。

### &和&&的区别

- &运算符有两种用法：(1)按位与；(2)逻辑与
- &&运算符是短路与运算。逻辑与跟短路与的差别是非常巨大的，虽然二者都要求运算符左右两端的布尔值都是true整个表达式的值才是true。&&之所以称为短路运算是因为，如果&&左边的表达式的值是false，右边的表达式会被直接短路掉，不会进行运算。很多时候我们可能都需要用&&而不是&，例如在验证用户登录时判定用户名不是null而且不是空字符串，应当写为：username != null &&!username.equals(“”)，二者的顺序不能交换，更不能用&运算符，因为第一个条件如果不成立，根本不能进行字符串的equals比较，否则会产生NullPointerException异常。注意：逻辑或运算符（|）和短路或运算符（||）的差别也是如此。

### 为什么要把 String 设计为不可变

-  节省空间
   字符串常量存储在 JVM 的字符串池中可以被用户共享 
-  提高效率
   String 可以被不同线程共享，是线程安全的。在涉及多线程操作中不需要同步操作 
-  安全
   String 常被用于用户名、密码、文件名等使用，由于其不可变，可避免黑客行为对其恶意修改 

### 简述 String/StringBuffer 与 StringBuilder

-  String
   采用利用 final 修饰的字符数组进行字符串保存，因此不可变。如果对 String 类型对象修改，需要新建对象，将老字符和新增加的字符一并存进去 
-  StringBuilder
   采用无 final 修饰的字符数组进行保存，因此可变，线程不安全 
-  StringBuffer
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

- 把 hash 值对数组长度取模运算，模运算的消耗很大，没有位运算快。
- 当 length 总是 2 的n次方时，`h & (length-1)`运算等价于对length取模，也就是 h%length，但是 & 比 % 具有更高的效率。

### 静态变量和实例变量的区别

静态变量是被static修饰符修饰的变量，也称为类变量，它属于类，不属于类的任何一个对象，一个类不管创建多少个对象，静态变量在内存中有且仅有一个拷贝；实例变量必须依存于某一实例，需要先创建对象然后通过对象才能访问到它。静态变量可以实现让多个对象共享内存。在Java开发中，上下文类和工具类中通常会有大量的静态成员