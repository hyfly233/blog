## 基础相关

### Java 语言具有哪些特点？

- Java 为纯面向对象的语言。它能够直接反应现实生活中的对象。
- 具有平台无关性。Java 利用 Java 虚拟机运行字节码，无论是在 Windows、Linux 还是 MacOS 等其它平台对 Java 程序进行编译，编译后的程序可在其它平台运行。
- Java 为解释型语言，编译器把 Java 代码编译成平台无关的中间代码，然后在 JVM 上解释运行，具有很好的可移植性。
- Java 提供了很多内置类库。如对多线程支持，对网络通信支持，最重要的一点是提供了垃圾回收器。
- Java 具有较好的安全性和健壮性。Java 提供了异常处理和垃圾回收机制，去除了 C++中难以理解的指针特性。



### JDK 与 JRE 有什么区别？

- JDK：Java 开发工具包（Java Development Kit），提供了 Java 的开发环境和运行环境。
- JRE：Java 运行环境(Java Runtime Environment)，提供了 Java 运行所需的环境。
- JDK 包含了 JRE。如果只运行 Java 程序，安装 JRE 即可。要编写 Java 程序需安装 JDK.



### 简述 Java 基本数据类型

- byte: 占用 1 个字节，取值范围-128 ~ 127
- short: 占用 2 个字节，取值范围-2^15^ ~ 2^15^-1
- int：占用 4 个字节，取值范围-2^31^ ~ 2^31^-1
- long：占用 8 个字节
- float：占用 4 个字节
- double：占用 8 个字节
- char: 占用 2 个字节
- boolean：占用大小根据实现虚拟机不同有所差异



### 简述自动装箱拆箱

对于 Java 基本数据类型，均对应一个包装类。

装箱就是自动将基本数据类型转换为包装器类型，如 int->Integer

拆箱就是自动将包装器类型转换为基本数据类型，如 Integer->int



### 简述 Java 访问修饰符

- public: 对所有类可见
- protected : 对同一包内的类和所有子类可见，不能修饰类
- default: 默认访问修饰符，在同一包内可见
- private: 在同一类内可见，不能修饰类



|  修饰符   | 当前类 | 同包 | 子类 | 其他包 |
| :-------: | :----: | :--: | :--: | :----: |
|  public   |   √    |  √   |  √   |   √    |
| protected |   √    |  √   |  √   |   ×    |
|  default  |   √    |  √   |  ×   |   ×    |
|  private  |   √    |  ×   |  ×   |   ×    |



### Java 代码块执行顺序

静态代码块只执行一次

先后顺序：**父类静态变量 => 父类静态代码块 => 子类静态变量 => 子类静态代码块 => 父类非静态变量 => 父类非静态代码块 => 父类构造函数 => 子类非静态变量 => 子类非静态代码块 => 子类构造函数**



### 面向对象的三大特性

+ 继承：对象的一个新类可以从现有的类中派生，派生类可以从它的基类那继承方法和实例变量，且派生类可以修改或新增新的方法使之更适合特殊的需求
+ 封装：将客观事物抽象成类，每个类可以把自身数据和方法只让可信的类或对象操作，对不可信的进行信息隐藏
+ 多态：允许不同类的对象对同一消息作出响应。不同对象调用相同方法即使参数也相同，最终表现行为是不一样的。



### 为什么 Java 语言不支持多重继承？

多重继承会使类型转换、构造方法的调用顺序变得复杂，会影响到性能。



### 多态机制

Java 提供了两种用于多态的机制，分别是重载与覆盖。

+ 重载：重载是指同一个类中有多个同名的方法，但这些方法有不同的参数，在编译期间就可以确定调用哪个方法
+ 覆盖：覆盖是指派生类重写基类的方法，使用基类指向其子类的实例对象，或接口的引用变量指向其实现类的实例对象，在程序调用的运行期根据引用变量所指的具体实例对象调用正在运行的那个对象的方法，即需要到运行期才能确定调用哪个方法



### 重载与覆盖的区别？

- 覆盖是父类与子类之间的关系，是垂直关系；重载是同一类中方法之间的关系，是水平关系。
- 覆盖只能由一个方法或一对方法产生关系；重载是多个方法之间的关系。
- 覆盖要求参数列表相同；重载要求参数列表不同。
- 覆盖中，调用方法体是根据对象的类型来决定的，而重载是根据调用时实参表与形参表来对应选择方法体。
- 重载方法可以改变返回值的类型，覆盖方法不能改变返回值的类型。



### 接口和抽象类的相同点和不同点？

相同点:

- 都不能被实例化。
- 接口的实现类或抽象类的子类需实现接口或抽象类中相应的方法才能被实例化。

不同点：

- 接口只能有方法定义，不能有方法的实现，而抽象类可以有方法的定义与实现。
- 实现接口的关键字为 implements，继承抽象类的关键字为 extends。一个类可以实现多个接口，只能继承一个抽象类。
- 当子类和父类之间存在逻辑上的层次结构，推荐使用抽象类，有利于功能的累积。当功能不需要，希望支持差别较大的两个或更多对象间的特定交互行为，推荐使用接口。使用接口能降低软件系统的耦合度，便于日后维护或添加删除方法



### 简述内部类及其作用

- 成员内部类

  作为成员对象的内部类。可以访问 private 及以上外部类的属性和方法。外部类想要访问内部类属性或方法时，必须要创建一个内部类对象，然后通过该对象访问内部类的属性或方法。外部类也可访问 private 修饰的内部类属性

- 局部内部类

  存在于方法中的内部类。访问权限类似局部变量，只能访问外部类的 final 变量

- 匿名内部类

  只能使用一次，没有类名，只能访问外部类的 final 变量

- 静态内部类

  类似类的静态成员变量



### Java 语言中关键字 static 的作用是什么？

static 的主要作用有两个：

- 为某种特定数据类型或对象分配与创建对象个数无关的单一的存储空间
- 使得某个方法或属性与类而不是对象关联在一起，即在不创建对象的情况下可通过类直接调用方法或使用类的属性



具体而言 static 又可分为 4 种使用方式：

- 修饰成员变量

  用 static 关键字修饰的静态变量在内存中只有一个副本。只要静态变量所在的类被加载，这个静态变量就会被分配空间，可以使用“类.静态变量”和“对象.静态变量”的方法使用

- 修饰成员方法

  static 修饰的方法无需创建对象就可以被调用。static 方法中不能使用 this 和 super 关键字，不能调用非 static 方法，只能访问所属类的静态成员变量和静态成员方法

- 修饰代码块

  JVM 在加载类的时候会执行 static 代码块。static 代码块常用于初始化静态变量。static 代码块只会被执行一次

- 修饰内部类

  static 内部类可以不依赖外部类实例对象而被实例化。静态内部类不能与外部类有相同的名字，不能访问普通成员变量，只能访问外部类中的静态成员和静态成员方法



## 是否可以从一个静态（static）方法内部发出对非静态（non-static）方法的调用？

不可以

静态方法只能访问静态成员

因为非静态方法的调用要先创建对象，在调用静态方法时可能对象并没有被初始化



## 抽象的（abstract）方法是否可同时是静态的（static）,是否可同时是本地方法（native），是否可同时被synchronized修饰

都不能

+ 抽象方法需要子类重写，而静态的方法是无法被重写的，因此二者是矛盾的
+ 本地方法是由本地代码实现的方法，而抽象方法是没有实现的，也是矛盾的
+ synchronized和方法的实现细节有关，抽象方法不涉及实现细节，因此也是相互矛盾的

 

### 为什么要把 String 设计为不可变

- 节省空间

  字符串常量存储在 JVM 的字符串池中可以被用户共享

- 提高效率

  String 可以被不同线程共享，是线程安全的。在涉及多线程操作中不需要同步操作

- 安全

  String 常被用于用户名、密码、文件名等使用，由于其不可变，可避免黑客行为对其恶意修改



### 简述 String/StringBuffer 与 StringBuilder

+ String

  采用利用 final 修饰的字符数组进行字符串保存，因此不可变。如果对 String 类型对象修改，需要新建对象，将老字符和新增加的字符一并存进去

+ StringBuilder

  采用无 final 修饰的字符数组进行保存，因此可变，线程不安全

+ StringBuffer

  采用无 final 修饰的字符数组进行保存，线程安全

- 

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



### 简述 Java 异常的分类

Java 异常分为 Error（程序无法处理的错误），和 Exception（程序本身可以处理的异常）。这两个类均继承 Throwable。

+ Error 常见的有 StackOverFlowError、OutOfMemoryError 等等
+ Exception 可分为运行时异常和非运行时异常。对于运行时异常，可以利用 try catch 的方式进行处理，也可以不处理。对于非运行时异常，必须处理，不处理的话程序无法通过编译



### 简述 throw 与 throws 的区别

+ throw

  一般是用在方法体的内部，由开发者定义当程序语句出现问题后主动抛出一个异常

+ throws

  一般用于方法声明上，代表该方法可能会抛出的异常列表



### 出现在 Java 程序中的 finally 代码块是否一定会执行？

当遇到下面情况不会执行。

- 当程序在进入 try 语句块之前就出现异常时会直接结束。
- 当程序在 try 块中强制退出时，如使用 System.exit(0)，也不会执行 finally 块中的代码。

其它情况下，在 try/catch/finally 语句执行的时候，try 块先执行，当有异常发生，catch 和 finally 进行处理后程序就结束了，当没有异常发生，在执行完 finally 中的代码后，后面代码会继续执行。值得注意的是，当 try/catch 语句块中有 return 时，finally 语句块中的代码会在 return 之前执行。如果 try/catch/finally 块中都有 return 语句，finally 块中的 return 语句会覆盖 try/catch 模块中的 return 语句

 

### final、finally 和 finalize 的区别是什么？

- final 用于声明属性、方法和类，分别表示属性不可变、方法不可覆盖、类不可继承。
- finally 作为异常处理的一部分，只能在 try/catch 语句中使用，finally 附带一个语句块用来表示这个语句最终一定被执行，经常被用在需要释放资源的情况下。
- finalize 是 Object 类的一个方法，在垃圾收集器执行的时候会调用被回收对象的 finalize()方法。当垃圾回收器准备好释放对象占用空间时，首先会调用 finalize()方法，并在下一次垃圾回收动作发生时真正回收对象占用的内存。

### 简述泛型

泛型，即“参数化类型”，解决不确定对象具体类型的问题。在编译阶段有效。在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型在类中称为泛型类、接口中称为泛型接口和方法中称为泛型方法。

### 简述泛型擦除

Java 编译器生成的字节码是不包涵泛型信息的，泛型类型信息将在编译处理是被擦除，这个过程被称为泛型擦除。

### 简述注解

Java 注解用于为 Java 代码提供元数据。作为元数据，注解不直接影响你的代码执行，但也有一些类型的注解实际上可以用于这一目的。

其可以用于提供信息给编译器，在编译阶段时给软件提供信息进行相关的处理，在运行时处理写相应代码，做对应操作。

### 简述元注解

元注解可以理解为注解的注解，即在注解中使用，实现想要的功能。其具体分为：

- @Retention: 表示注解存在阶段是保留在源码，还是在字节码（类加载）或者运行期（JVM 中运行）。
- @Target：表示注解作用的范围。
- @Documented：将注解中的元素包含到 Javadoc 中去。
- @Inherited：一个被@Inherited 注解了的注解修饰了一个父类，如果他的子类没有被其他注解修饰，则它的子类也继承了父类的注解。
- @Repeatable：被这个元注解修饰的注解可以同时作用一个对象多次，但是每次作用注解又可以代表不同的含义。

### 简述 Java 中 Class 对象

java 中对象可以分为实例对象和 Class 对象，每一个类都有一个 Class 对象，其包含了与该类有关的信息。

获取 Class 对象的方法：



```java
Class.forName(“类的全限定名”)
实例对象.getClass()
类名.class
```

### Java 反射机制是什么？

Java 反射机制是指在程序的运行过程中可以构造任意一个类的对象、获取任意一个类的成员变量和成员方法、获取任意一个对象所属的类信息、调用任意一个对象的属性和方法。反射机制使得 Java 具有动态获取程序信息和动态调用对象方法的能力。可以通过以下类调用反射 API。

- Class 类：可获得类属性方法
- Field 类：获得类的成员变量
- Method 类：获取类的方法信息
- Construct 类：获取类的构造方法等信息

### 序列化是什么？

序列化是一种将对象转换成字节序列的过程，用于解决在对对象流进行读写操作时所引发的问题。序列化可以将对象的状态写在流里进行网络传输，或者保存到文件、数据库等系统里，并在需要的时候把该流读取出来重新构造成一个相同的对象。

### 简述 Java 序列化与反序列化的实现

序列化：将 java 对象转化为字节序列，由此可以通过网络对象进行传输。

反序列化：将字节序列转化为 java 对象。

具体实现：实现 Serializable 接口，或实现 Externalizable 接口中的 writeExternal()与 readExternal()方法。















## 1.介绍一下 java 吧

java 是一门**开源的跨平台的面向对象的**计算机语言.

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-01.png)

跨平台是因为 java 的 class 文件是运行在虚拟机上的,其实跨平台的,而**虚拟机是不同平台有不同版本**,所以说 java 是跨平台的.

面向对象有几个特点:

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-02.png)

- 1.

  封装

  - 两层含义：一层含义是把对象的属性和行为看成一个密不可分的整体，将这两者'封装'在一个不可分割的**独立单元**(即对象)中
  - 另一层含义指'信息隐藏，把不需要让外界知道的信息隐藏起来，有些对象的属性及行为允许外界用户知道或使用，但不允许更改，而另一些属性或行为，则不允许外界知晓，或只允许使用对象的功能，而尽可能**隐藏对象的功能实现细节**。

**优点**:

> 1.良好的封装能够**减少耦合**，符合程序设计追求'高内聚，低耦合'。
> 2.**类内部的结构可以自由修改**。
> 3.可以对成员变量进行更**精确的控制**。
> 4.**隐藏信息**实现细节。

- 2.

  继承

  - 继承就是子类继承父类的特征和行为，使得子类对象（实例）具有父类的实例域和方法，或子类从父类继承方法，使得子类具有父类相同的行为。

**优点**:

> 1.提高类代码的**复用性**
> 2.提高了代码的**维护性**

- 3.

  多态

  - 多态是同一个行为具有多个不同表现形式或形态的能力。Java语言中含有方法重载与对象多态两种形式的多态：
    - 1.**方法重载**：在一个类中，允许多个方法使用同一个名字，但方法的参数不同，完成的功能也不同。
    - 2.**对象多态**：子类对象可以与父类对象进行转换，而且根据其使用的子类不同完成的功能也不同（重写父类的方法）。

**优点**

> 1. **消除类型之间的耦合关系**
> 2. **可替换性**
> 3. **可扩充性**
> 4. **接口性**
> 5. **灵活性**
> 6. **简化性**

## 2.java 有哪些数据类型？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-03.png)

java 主要有两种数据类型

- 1.

  基本数据类型

  - 基本数据有

    八个

    ,

    - byte,short,int,long属于数值型中的整数型
    - float,double属于数值型中的浮点型
    - char属于字符型
    - boolean属于布尔型

- 2.

  引用数据类型

  - 引用数据类型有**三个**,分别是类,接口和数组

## 3.接口和抽象类有什么区别？

- 1.接口是抽象类的变体，**接口中所有的方法都是抽象的**。而抽象类是声明方法的存在而不去实现它的类。
- 2.接口可以多继承，抽象类不行。
- 3.接口定义方法，不能实现，默认是 **public abstract**，而抽象类可以实现部分方法。
- 4.接口中基本数据类型为 **public static final** 并且需要给出初始值，而抽类象不是的。

## 4.重载和重写什么区别？

重写：

- 1.参数列表必须**完全与被重写的方法**相同，否则不能称其为重写而是重载.
- 2.**返回的类型必须一直与被重写的方法的返回类型相同**，否则不能称其为重写而是重载。
- 3.访问**修饰符的限制一定要大于被重写方法的访问修饰符**
- 4.重写方法一定**不能抛出新的检查异常或者比被重写方法申明更加宽泛的检查型异常**。

重载：

- 1.必须具有**不同的参数列表**；
- 2.可以有不同的返回类型，只要参数列表不同就可以了；
- 3.可以有**不同的访问修饰符**；
- 4.可以抛出**不同的异常**；

## 5.常见的异常有哪些？

- NullPointerException 空指针异常
- ArrayIndexOutOfBoundsException 索引越界异常
- InputFormatException 输入类型不匹配
- SQLException SQL异常
- IllegalArgumentException 非法参数
- NumberFormatException 类型转换异常 等等....

## 6.异常要怎么解决？

Java标准库内建了一些通用的异常，这些类以Throwable为顶层父类。

Throwable又派生出**Error类和Exception类**。

错误：Error类以及他的子类的实例，代表了JVM本身的错误。错误不能被程序员通过代码处理，Error很少出现。因此，程序员应该关注Exception为父类的分支下的各种异常类。

异常：Exception以及他的子类，代表程序运行时发送的各种不期望发生的事件。可以被Java异常处理机制使用，是异常处理的核心。

处理方法:

- 1.**try()catch(){}**



```text
try{
// 程序代码
}catch(ExceptionName e1){
//Catch 块
}
```

- 2.

  throw

  - throw 关键字作用是抛出一个异常，抛出的时候是抛出的是一个异常类的实例化对象，在异常处理中，try 语句要捕获的是一个异常对象，那么此异常对象也可以自己抛出

- 3.

  throws

  - 定义一个方法的时候可以使用 throws 关键字声明。使用 throws 关键字声明的方法表示此方法不处理异常，而交给方法调用处进行处理。





## 13.什么是泛型？

泛型:**把类型明确的工作推迟到创建对象或调用方法的时候才去明确的特殊的类型**

## 14.泛型擦除是什么？

因为泛型其实只是在编译器中实现的而虚拟机并不认识泛型类项，所以要在虚拟机中将泛型类型进行擦除。也就是说，**在编译阶段使用泛型，运行阶段取消泛型，即擦除**。 擦除是将泛型类型以其父类代替，如String 变成了Object等。其实在使用的时候还是进行带强制类型的转化，只不过这是比较安全的转换，因为在编译阶段已经确保了数据的一致性。

## 15.说说进程和线程的区别？

**进程是系统资源分配和调度的基本单位**，它能并发执行较高系统资源的利用率.

**线程**是**比进程更小**的能独立运行的基本单位,创建、销毁、切换成本要小于进程,可以减少程序并发执行时的时间和空间开销，使得操作系统具有更好的并发性。

## 16.volatile 有什么作用？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-07.png)

- 1.保证内存可见性
  - 可见性是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的。也就是一个线程修改的结果，另一个线程马上就能看到。
- 2.禁止指令重排序
  - cpu 是和缓存做交互的，但是由于 cpu 运行效率太高，所以会不等待当前命令返回结果从而继续执行下一个命令，就会有乱序执行的情况发生

## 17.什么是包装类？为什么需要包装类？

**Java 中有 8 个基本类型，分别对应的 8 个包装类**

- byte -- Byte
- boolean -- Boolean
- short -- Short
- char -- Character
- int -- Integer
- long -- Long
- float -- Float
- double -- Double

**为什么需要包装类**:

- 基本数据类型方便、简单、高效，但泛型不支持、集合元素不支持
- 不符合面向对象思维
- 包装类提供很多方法，方便使用，如 Integer 类 toHexString(int i)、parseInt(String s) 方法等等



## 19.JMM 是什么？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-08.png)

JMM 就是 **Java内存模型**(java memory model)。因为在不同的硬件生产商和不同的操作系统下，内存的访问有一定的差异，所以会造成相同的代码运行在不同的系统上会出现各种问题。所以java内存模型(JMM)**屏蔽掉各种硬件和操作系统的内存访问差异，以实现让java程序在各种平台下都能达到一致的并发效果**。

Java内存模型规定所有的变量都存储在主内存中，包括实例变量，静态变量，但是不包括局部变量和方法参数。每个线程都有自己的工作内存，线程的工作内存保存了该线程用到的变量和主内存的副本拷贝，线程对变量的操作都在工作内存中进行。**线程不能直接读写主内存中的变量**。

每个线程的工作内存都是独立的，**线程操作数据只能在工作内存中进行，然后刷回到主存**。这是 Java 内存模型定义的线程基本工作方式。

## 20.创建对象有哪些方式

有**五种创建对象的方式**

- 1、new关键字



```text
Person p1 = new Person();
```

- 2.Class.newInstance



```text
Person p1 = Person.class.newInstance();
```

- 3.Constructor.newInstance



```text
Constructor<Person> constructor = Person.class.getConstructor();
Person p1 = constructor.newInstance();
```

- 4.clone



```text
Person p1 = new Person();
Person p2 = p1.clone();
```

- 5.反序列化



```text
Person p1 = new Person();
byte[] bytes = SerializationUtils.serialize(p1);
Person p2 = (Person)SerializationUtils.deserialize(bytes);
```

## 21.讲讲单例模式懒汉式吧

直接贴代码



```text
// 懒汉式
public class Singleton {
// 延迟加载保证多线程安全
    Private volatile static Singleton singleton;
    private Singleton(){}
    public static Singleton getInstance(){
        if(singleton == null){
            synchronized(Singleton.class){
                if(singleton == null){
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```

- 使用 volatile 是**防止指令重排序，保证对象可见**，防止读到半初始化状态的对象
- 第一层if(singleton == null) 是为了防止有多个线程同时创建
- synchronized 是加锁防止多个线程同时进入该方法创建对象
- 第二层if(singleton == null) 是防止有多个线程同时等待锁，一个执行完了后面一个又继续执行的情况

[关于双检锁可以参考open in new window](https://blog.csdn.net/fly910905/article/details/79286680)



## 25.cas 是什么？

cas 叫做 CompareAndSwap，**比较并交换**，很多地方使用到了它，比如锁升级中自旋锁就有用到，主要是**通过处理器的指令来保证操作的原子性**，它主要包含三个变量：

- **1.变量内存地址**
- **2.旧的预期值 A**
- **3.准备设置的新值 B**

当一个线程需要修改一个共享变量的值，完成这个操作需要先取出共享变量的值，赋给 A，基于 A 进行计算，得到新值 B，在用预期原值 A 和内存中的共享变量值进行比较，**如果相同就认为其他线程没有进行修改**，而将新值写入内存

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-11.png)

**CAS的缺点**

- **CPU开销比较大**：在并发量比较高的情况下，如果许多线程反复尝试更新某一个变量，却又一直更新不成功，又因为自旋的时候会一直占用CPU，如果CAS一直更新不成功就会一直占用，造成CPU的浪费。
- **ABA 问题**：比如线程 A 去修改 1 这个值，修改成功了，但是中间 线程 B 也修改了这个值，但是修改后的结果还是 1，所以不影响 A 的操作，这就会有问题。可以用**版本号**来解决这个问题。
- **只能保证一个共享变量的原子性**







## 31.介绍一下四种引用类型?

- **强引用 StrongReference**



```text
Object obj = new Object(); 
//只要obj还指向Object对象，Object对象就不会被回收
```

垃圾回收器不会回收被引用的对象，哪怕内存不足时，JVM 也会直接抛出 OutOfMemoryError，除非赋值为 null。

- **软引用 SoftReference**

软引用是用来描述一些非必需但仍有用的对象。在内存足够的时候，软引用对象不会被回收，只有在内存不足时，系统则会回收软引用对象，如果回收了软引用对象之后仍然没有足够的内存，才会抛出内存溢出异常。

- **弱引用 WeakReference**

弱引用的引用强度比软引用要更弱一些，无论内存是否足够，只要 JVM 开始进行垃圾回收，那些被弱引用关联的对象都会被回收。

- **虚引用 PhantomReference**

虚引用是最弱的一种引用关系，如果一个对象仅持有虚引用，那么它就和没有任何引用一样，它随时可能会被回收，在 JDK1.2 之后，用 PhantomReference 类来表示，通过查看这个类的源码，发现它只有一个构造函数和一个 get() 方法，而且它的 get() 方法仅仅是返回一个null，也就是说将永远无法通过虚引用来获取对象，虚引用必须要和 ReferenceQueue 引用队列一起使用，NIO 的堆外内存就是靠其管理。

## 32.深拷贝、浅拷贝是什么？

- 浅拷贝并不是真的拷贝，只是**复制指向某个对象的指针**，而不复制对象本身，新旧对象还是共享同一块内存。
- 深拷贝会另外**创造一个一模一样的对象**，新对象跟原对象不共享内存，修改新对象不会改到原对象。







## 34.一个对象的内存布局是怎么样的?

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-16.png)

- 1.对象头

  : 对象头又分为

   

  MarkWord

   

  和

   

  Class Pointer

   

  两部分。

  - **MarkWord**:包含一系列的标记位，比如轻量级锁的标记位，偏向锁标记位,gc记录信息等等。
  - **ClassPointer**:用来指向对象对应的 Class 对象（其对应的元数据对象）的内存地址。在 32 位系统占 4 字节，在 64 位系统中占 8 字节。

- **2.Length**:只在数组对象中存在，用来记录数组的长度，占用 4 字节

- **3.Instance data**: 对象实际数据，对象实际数据包括了对象的所有成员变量，其大小由各个成员变量的大小决定。(这里不包括静态成员变量，因为其是在方法区维护的)

- **4.Padding**:Java 对象占用空间是 8 字节对齐的，即所有 Java 对象占用 bytes 数必须是 8 的倍数,是因为当我们从磁盘中取一个数据时，不会说我想取一个字节就是一个字节，都是按照一块儿一块儿来取的，这一块大小是 8 个字节，所以为了完整，padding 的作用就是补充字节，**保证对象是 8 字节的整数倍**。





### 





### 08、为什么 hash 值要与length-1相与？

- 把 hash 值对数组长度取模运算，模运算的消耗很大，没有位运算快。
- 当 length 总是 2 的n次方时，`h& (length-1) `运算等价于对length取模，也就是 h%length，但是 & 比 % 具有更高的效率。











## float f=3.4;是否正确？

不正确。3.4是双精度数，将双精度型（double）赋值给浮点型（float）属于下转型（down-casting，也称为窄化）会造成精度损失，因此需要强制类型转换float f =(float)3.4; 或者写成float f =3.4F;。





## int和Integer有什么区别？

Java是一个近乎纯洁的面向对象编程语言，但是为了编程的方便还是引入了基本数据类型，但是为了能够将这些基本数据类型当成对象操作，Java为每一个基本数据类型都引入了对应的包装类型（wrapper class），int的包装类就是Integer，从Java 5开始引入了自动装箱/拆箱机制，使得二者可以相互转换。

Java 为每个原始类型提供了包装类型：

- 原始类型: boolean，char，byte，short，int，long，float，double
- 包装类型：Boolean，Character，Byte，Short，Integer，Long，Float，Double







## switch 是否能作用在byte 上，是否能作用在long,float 上，是否能作用在String上？

在Java 5以前，switch(expr)中，expr只能是byte、short、char、int。从Java 5开始，Java中引入了枚举类型，expr也可以是enum类型，从Java 7开始，expr还可以是字符串（String），但是长整型（long）,浮点数（float）在目前所有的版本中都是不可以的。





## 阐述静态变量和实例变量的区别。

静态变量是被static修饰符修饰的变量，也称为类变量，它属于类，不属于类的任何一个对象，一个类不管创建多少个对象，静态变量在内存中有且仅有一个拷贝；实例变量必须依存于某一实例，需要先创建对象然后通过对象才能访问到它。静态变量可以实现让多个对象共享内存。

补充：在Java开发中，上下文类和工具类中通常会有大量的静态成员。

## Object中有哪些公共方法？

- equals()
- clone()
- getClass()
- notify(),notifyAll(),wait()
- toString()



## 深拷贝和浅拷贝的区别是什么？

浅拷贝：被复制对象的所有变量都含有与原来的对象相同的值，而所有的对其他对象的引用仍然指向原来的对象。换言之，浅拷贝仅仅复制所考虑的对象，而不复制它所引用的对象。

深拷贝：被复制对象的所有变量都含有与原来的对象相同的值，而那些引用其他对象的变量将指向被复制过的新对象，而不再是原有的那些被引用的对象。换言之，深拷贝把要复制的对象所引用的对象都复制了一遍。

## 如何实现对象克隆？

有两种方式：

1. 实现Cloneable接口并重写Object类中的clone()方法；
2. 实现Serializable接口，通过对象的序列化和反序列化实现克隆，可以实现真正的深度克隆。

代码如下：

```
import java.io.ByteArrayInputStream;import java.io.ByteArrayOutputStream;import java.io.ObjectInputStream;import java.io.ObjectOutputStream;public class MyUtil {    private MyUtil() {        throw new AssertionError();    }    public static <T> T clone(T obj) throws Exception {        ByteArrayOutputStream bout = new ByteArrayOutputStream();        ObjectOutputStream oos = new ObjectOutputStream(bout);        oos.writeObject(obj);        ByteArrayInputStream bin = new ByteArrayInputStream(bout.toByteArray());        ObjectInputStream ois = new ObjectInputStream(bin);        return (T) ois.readObject();        // 说明：调用ByteArrayInputStream或ByteArrayOutputStream对象的close方法没有任何意义        // 这两个基于内存的流只要垃圾回收器清理对象就能够释放资源，这一点不同于对外部资源（如文件流）的释放    }}
```

下面是测试代码：

```
import java.io.Serializable;/** * 人类 * @author 骆昊 * */class Person implements Serializable {    private static final long serialVersionUID = -9102017020286042305L;    private String name;    // 姓名    private int age;        // 年龄    private Car car;        // 座驾    public Person(String name, int age, Car car) {        this.name = name;        this.age = age;        this.car = car;    }    public String getName() {        return name;    }    public void setName(String name) {        this.name = name;    }    public int getAge() {        return age;    }    public void setAge(int age) {        this.age = age;    }    public Car getCar() {        return car;    }    public void setCar(Car car) {        this.car = car;    }    @Override    public String toString() {        return "Person [name=" + name + ", age=" + age + ", car=" + car + "]";    }}
/** * 小汽车类 * @author 骆昊 * */class Car implements Serializable {    private static final long serialVersionUID = -5713945027627603702L;    private String brand;       // 品牌    private int maxSpeed;       // 最高时速    public Car(String brand, int maxSpeed) {        this.brand = brand;        this.maxSpeed = maxSpeed;    }    public String getBrand() {        return brand;    }    public void setBrand(String brand) {        this.brand = brand;    }    public int getMaxSpeed() {        return maxSpeed;    }    public void setMaxSpeed(int maxSpeed) {        this.maxSpeed = maxSpeed;    }    @Override    public String toString() {        return "Car [brand=" + brand + ", maxSpeed=" + maxSpeed + "]";    }}
class CloneTest {    public static void main(String[] args) {        try {            Person p1 = new Person("Hao LUO", 33, new Car("Benz", 300));            Person p2 = MyUtil.clone(p1);   // 深度克隆            p2.getCar().setBrand("BYD");            // 修改克隆的Person对象p2关联的汽车对象的品牌属性            // 原来的Person对象p1关联的汽车不会受到任何影响            // 因为在克隆Person对象时其关联的汽车对象也被克隆了            System.out.println(p1);        } catch (Exception e) {            e.printStackTrace();        }    }}
```

注意：基于序列化和反序列化实现的克隆不仅仅是深度克隆，更重要的是通过泛型限定，可以检查出要克隆的对象是否支持序列化，这项检查是编译器完成的，不是在运行时抛出异常，这种是方案明显优于使用Object类的clone方法克隆对象。让问题在编译的时候暴露出来总是优于把问题留到运行时。







## 接口是否可继承（extends）接口？抽象类是否可实现（implements）接口？抽象类是否可继承具体类（concrete class）？

接口可以继承接口，而且支持多重继承。抽象类可以实现(implements)接口，抽象类可继承具体类也可以继承抽象类。











## 运行时异常与受检异常有何异同？

异常表示程序运行过程中可能出现的非正常状态，运行时异常表示虚拟机的通常操作中可能遇到的异常，是一种常见运行错误，只要程序设计得没有问题通常就不会发生。受检异常跟程序运行的上下文环境有关，即使程序设计无误，仍然可能因使用的问题而引发。Java编译器要求方法必须声明抛出可能发生的受检异常，但是并不要求必须声明抛出未被捕获的运行时异常。

异常和继承一样，是面向对象程序设计中经常被滥用的东西，在Effective Java中对异常的使用给出了以下指导原则：

- 不要将异常处理用于正常的控制流（设计良好的API不应该强迫它的调用者为了正常的控制流而使用异常）
- 对可以恢复的情况使用受检异常，对编程错误使用运行时异常
- 避免不必要的使用受检异常（可以通过一些状态检测手段来避免异常的发生）
- 优先使用标准的异常
- 每个方法抛出的异常都要有文档
- 保持异常的原子性
- 不要在catch中忽略掉捕获到的异常

## 列出一些你常见的运行时异常？

- ArithmeticException（算术异常）
- ClassCastException （类转换异常）
- IllegalArgumentException （非法参数异常）
- IndexOutOfBoundsException （下标越界异常）
- NullPointerException （空指针异常）
- SecurityException （安全异常）

- 









## 内部类的作用

内部类可以有多个实例,每个实例都有自己的状态信息,并且与其他外围对象的信息相互独立.在单个外围类当中,可以让多个内部类以不同的方式实现同一接口,或者继承同一个类.创建内部类对象的时刻不依赖于外部类对象的创建.内部类并没有令人疑惑的”is-a”关系,它就像是一个独立的实体.

内部类提供了更好的封装,除了该外围类,其他类都不能访问



## 说出几条 Java 中方法重载的最佳实践？

下面有几条可以遵循的方法重载的最佳实践来避免造成自动装箱的混乱。

- 不要重载这样的方法：一个方法接收 int 参数，而另个方法接收 Integer 参数。
- 不要重载参数数量一致，而只是参数顺序不同的方法。
- 如果重载的方法参数个数多于 5 个，采用可变参数。





## 关键字相关

### 阐述final、finally、finalize的区别

- final：修饰符（关键字）有三种用法：如果一个类被声明为final，意味着它不能再派生出新的子类，即不能被继承，因此它和abstract是反义词。将变量声明为final，可以保证它们在使用中不被改变，被声明为final的变量必须在声明时给定初值，而在以后的引用中只能读取不可修改。被声明为final的方法也同样只能使用，不能在子类中被重写。
- finally：通常放在try…catch…的后面构造总是执行代码块，这就意味着程序无论正常执行还是发生异常，这里的代码只要JVM不关闭都能执行，可以将释放外部资源的代码写在finally块中。
- finalize：Object类中定义的方法，Java中允许使用finalize()方法在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。这个方法是由垃圾收集器在销毁对象时调用的，通过重写finalize()方法可以整理系统资源或者执行其他清理工作。



## Java 中的final关键字有哪些用法？

(1)修饰类：表示该类不能被继承；

(2)修饰方法：表示方法不能被重写；

(3)修饰变量：表示变量只能一次赋值以后值不能被修改（常量）。



## 操作符相关

### short s1 = 1; s1 = s1 + 1; 与 short s1 = 1; s1 += 1;有错吗

对于short s1 = 1; s1 = s1 + 1;由于1是int类型，因此s1+1运算结果也是int 型，需要强制转换类型才能赋值给short型。而short s1 = 1; s1 += 1;可以正确编译，因为s1+= 1;相当于s1 = (short)(s1 + 1);其中有隐含的强制类型转换。



### &和&&的区别

&运算符有两种用法：(1)按位与；(2)逻辑与

&&运算符是短路与运算。逻辑与跟短路与的差别是非常巨大的，虽然二者都要求运算符左右两端的布尔值都是true整个表达式的值才是true。&&之所以称为短路运算是因为，如果&&左边的表达式的值是false，右边的表达式会被直接短路掉，不会进行运算。很多时候我们可能都需要用&&而不是&，例如在验证用户登录时判定用户名不是null而且不是空字符串，应当写为：username != null &&!username.equals(“”)，二者的顺序不能交换，更不能用&运算符，因为第一个条件如果不成立，根本不能进行字符串的equals比较，否则会产生NullPointerException异常。注意：逻辑或运算符（|）和短路或运算符（||）的差别也是如此。





## 常见函数相关

### JDK 8 为什么要 hashcode 异或其右移十六位的值

因为在JDK 7 中扰动了 4 次，计算 hash 值的性能会稍差一点点。

从速度、功效、质量来考虑，JDK 8 优化了高位运算的算法，通过hashCode()的高16位异或低16位实现：`(h = k.hashCode()) ^ (h >>> 16)`。

这么做可以在数组 table 的 length 比较小的时候，也能保证考虑到高低Bit都参与到Hash的计算中，同时不会有太大的开销。



### Math.round(11.5) 等于多少？Math.round(-11.5)等于多少？

Math.round(11.5)的返回值是12，Math.round(-11.5)的返回值是-11。四舍五入的原理是在参数上加0.5然后进行下取整。



### 两个对象值相同(x.equals(y) == true)，但却可有不同的hash code，这句话对不对？

不对，如果两个对象x和y满足x.equals(y) == true，它们的哈希码（hash code）应当相同。

Java对于eqauls方法和hashCode方法是这样规定的：

(1)如果两个对象相同（equals方法返回true），那么它们的hashCode值一定要相同；

(2)如果两个对象的hashCode相同，它们并不一定相同。当然，你未必要按照要求去做，但是如果你违背了上述原则就会发现在使用容器时，相同的对象可以出现在Set集合中，同时增加新元素的效率会大大下降（对于使用哈希存储的系统，如果哈希码频繁的冲突将会造成存取性能急剧下降）。

补充：关于equals和hashCode方法，很多Java程序都知道，但很多人也就是仅仅知道而已，在Joshua Bloch的大作《Effective Java》（很多软件公司，《Effective Java》、《Java编程思想》以及《重构：改善既有代码质量》是Java程序员必看书籍，如果你还没看过，那就赶紧去亚马逊买一本吧）中是这样介绍equals方法的：首先equals方法必须满足自反性（x.equals(x)必须返回true）、对称性（x.equals(y)返回true时，y.equals(x)也必须返回true）、传递性（x.equals(y)和y.equals(z)都返回true时，x.equals(z)也必须返回true）和一致性（当x和y引用的对象信息没有被修改时，多次调用x.equals(y)应该得到同样的返回值），而且对于任何非null值的引用x，x.equals(null)必须返回false。

实现高质量的equals方法的诀窍包括：

1. 使用==操作符检查”参数是否为这个对象的引用”；
2. 使用instanceof操作符检查”参数是否为正确的类型”；
3. 对于类中的关键属性，检查参数传入对象的属性是否与之相匹配；
4. 编写完equals方法后，问自己它是否满足对称性、传递性、一致性；
5. 重写equals时总是要重写hashCode；
6. 不要将equals方法参数中的Object对象替换为其他的类型，在重写时不要忘掉[@Override](https://github.com/Override)注解。



### java中==和eqauls()的区别,equals()和 hashcode的区别

==是运算符,用于比较两个变量是否相等,而equals是Object类的方法,用于比较两个对象是否相等.默认Object类的equals方法是比较两个对象的地址,此时和==的结果一样.换句话说:基本类型比较用==,比较的是他们的值.默认下,对象用==比较时,比较的是内存地址,如果需要比较对象内容,需要重写equal方法





### 判等运算符==与 equals 的区别？

== 比较的是引用，equals 比较的是内容。

如果变量是基础数据类型，== 用于比较其对应值是否相等。如果变量指向的是对象，== 用于比较两个对象是否指向同一块存储空间。

equals 是 Object 类提供的方法之一，每个 Java 类都继承自 Object 类，所以每个对象都具有 equals 这个方法。Object 类中定义的 equals 方法内部是直接调用 == 比较对象的。但通过覆盖的方法可以让它不是比较引用而是比较数据内容。

### 简述 Object 类常用方法

- hashCode：通过对象计算出的散列码。用于 map 型或 equals 方法。需要保证同一个对象多次调用该方法，总返回相同的整型值。
- equals：判断两个对象是否一致。需保证 equals 方法相同对应的对象 hashCode 也相同。
- toString: 用字符串表示该对象
- clone:深拷贝一个对象









### 18.Integer a = 1000，Integer b = 1000，a==b 的结果是什么？那如果 a，b 都为1，结果又是什么？

Integer a = 1000，Integer b = 1000，a==b 结果为**false**

Integer a = 1，Integer b = 1，a==b 结果为**true**

这道题主要考察 Integer 包装类缓存的范围,**在-128~127之间会缓存起来**,比较的是直接缓存的数据,在此之外比较的是对象









# Java程序如何排除线上问题

## 通用JVM工具

+ jps：虚拟机进程状态工具

  ```shell
  jps -v | grep pid
  ```

  

+ jinfo：jvm参数信息工具

  ```shell
  jinfo -flags pid
  ```

  

+ jstat：查看虚拟机各种运行状态

  ```shell
  jstat -gcutil pid
  ```

  + S0：新生代中 Survivor space 0 区已使用空间的百分比
  + S1：新生代中 Survivor space 1 区已使用空间的百分比
  + E：新生代已使用空间的百分比
  + O：老年代已使用空间的百分比
  + M：元数据区已使用空间的百分比
  + CCS：压缩类空间利用率百分比
  + YGC：从应用程序启动到当前，发生Yang GC的次数
  + YGCT：从应用程序启动到当前，Yang GC所用的时间【单位秒】
  + FGC：从应用程序启动到当前，发生Full GC的次数
  + FGCT：从应用程序启动到当前，Full GC所用的时间
  + GCT：从应用程序启动到当前，用于垃圾回收的总时间【单位秒】

  

+ jstack：线程快照工具

  ```shell
  jstack -l pid
  ```

  

+ jmap：HeapDump工具

  ```shell
  jmap -heap pid  // 查看堆信息
  jmap -dump:format = b, file = xxx.hprof pid  // 导出消息文件
  
  jhat -port 8899 xxx.hprof  // 查看文件内容
  ```



## 线上OOM问题排查

1、设置启动参数

```shell
java -Xms20m -Xmx48m -XX:+HeapDumpOnOutOfMemoryError XX:HeapDump=./xxx.hprof -jar xxx.jar
```

2、使用jprofiler查看hprof文件以及call tree分析



## jprofiler

todo



