# 面向对象

## 什么是对象

 对象是系统中用来描述客观事物的一个实体，它是构成系统的一个基本单位。一个对象由一组属性和对这组属性进行操作的一组服务组成。 

类的实例化可生成对象，一个对象的生命周期包括三个阶段：生成、使用、消除。

当不存在对一个对象的引用时，该对象成为一个无用对象。Java的垃圾收集器自动扫描对象的动态内存区，把没有引用的对象作为垃圾收集起来并释放。当系统内存用尽或调用System.gc()要求垃圾回收时，垃圾回收程与系统同步运行。

## 面向对象的特征

封装，继承和多态。

- 封装：面向对象最基础的一个特性，封装性，是指隐藏对象的属性和现实细节，仅对外提供公共访问方式。

> 封装的原则：将不需要对外提供的内容都隐藏（设置访问修饰符为“private”）起来。把属性都隐藏，仅提供公共方法对其访问，可以在访问方式中加入逻辑判断等语句。

- 继承：继承是从已有类得到继承信息创建新类的过程。提供继承信息的类被称为父类（超类、基类）；得到继承信息的类被称为子类（派生类）。
- 多态：多态性是指允许不同子类型的对象对同一消息作出不同的响应。简单的说就是用同样的对象引用调用同样的方法但是做了不同的事情。

> 多态性分为编译时的多态性和运行时的多态性。
>
> 运行时的多态是面向对象最精髓的东西，要实现多态需要做两件事：
>
> 1). 方法重写（子类继承父类并重写父类中已有的或抽象的方法）
>
> 2). 对象造型（用父类型引用引用子类型对象，这样同样的引用调用同样的方法就会根据子类对象的不同而表现出不同的行为）。

## 什么是类

类是具有相同属性和方法的一组对象的集合，它为属于该类的所有对象提供了统一的抽象描述，其内部包括属性和方法两个主要部分。在面向对象的编程语言中，类是一个独立的程序单位，它应该有一个类名并包括属性和方法两个主要部分。

Java中的类实现包括两个部分：类声明和类体。

## 多态的好处

多态的定义：指允许不同类的对象对同一消息做出响应。即同一消息可以根据发送对象的不同而采用多种不同的行为方式。

主要有以下优点:

- 可替换性:多态对已存在代码具有可替换性.
- 可扩充性:增加新的子类不影响已经存在的类结构.
- 接口性:多态是超类通过方法签名,向子类提供一个公共接口,由子类来完善或者重写它来实现的.
- 灵活性:它在应用中体现了灵活多样的操作，提高了使用效率
- 简化性:多态简化对应用软件的代码编写和修改过程，尤其在处理大量对象的运算和操作时，这个特点尤为突出和重要

## 代码中如何实现多态

实现多态主要有以下三种方式:

- 接口实现
- 继承父类重写方法
- 同一类中进行方法重载

## 虚拟机是如何实现多态的

动态绑定技术(dynamic binding),执行期间判断所引用对象的实际类型,根据实际类型调用对应的方法.

## 重载（Overload）和重写（Override）的区别。重载的方法能否根据返回类型进行区分？

方法的重载和重写都是实现多态的方式，区别在于前者实现的是编译时的多态性，而后者实现的是运行时的多态性。

- 重载发生在一个类中，同名的方法如果有不同的参数列表（参数类型不同、参数个数不同或者二者都不同）则视为重载；
- 重写发生在子类与父类之间，重写要求子类被重写方法与父类被重写方法有相同的返回类型，比父类被重写方法更好访问，不能比父类被重写方法声明更多的异常（里氏代换原则）。重载对返回类型没有特殊的要求。

构造器不能被继承，因此不能被重写，但可以被重载。

父类的静态方法不能被子类重写。重写只适用于实例方法，不能用于静态方法，而子类当中含有和父类相同签名的静态方法，我们一般称之为隐藏，调用的方法为定义的类所有的静态方法。

## 构造器（constructor）是否可被重写（override）？

构造器不能被继承，因此不能被重写，但可以被重载。

## 接口的意义

接口的意义用四个词就可以概括：规范，扩展，回调和安全。

## 抽象类的意义

抽象类的意义可以用三句话来概括:

- 为其他子类提供一个公共的类型
- 封装子类中重复定义的内容
- 定义抽象方法,子类虽然有不同的实现,但是定义是一致的

## 抽象类和接口有什么区别

抽象类和接口都不能够实例化，但可以定义抽象类和接口类型的引用。一个类如果继承了某个抽象类或者实现了某个接口都需要对其中的抽象方法全部进行实现，否则该类仍然需要被声明为抽象类。接口比抽象类更加抽象，因为抽象类中可以定义构造器，可以有抽象方法和具体方法，而接口中不能定义构造器而且其中的方法全部都是抽象方法。抽象类中的成员可以是private、默认、protected、public的，而接口中的成员全都是public的。抽象类中可以定义成员变量，而接口中定义的成员变量实际上都是常量。有抽象方法的类必须被声明为抽象类，而抽象类未必要有抽象方法。

## 访问修饰符public,private,protected,以及不写（默认）时的区别

|  修饰符   | 当前类 | 同包 | 子类 | 其他包 |
| :-------: | :----: | :--: | :--: | :----: |
|  public   |   √    |  √   |  √   |   √    |
| protected |   √    |  √   |  √   |   ×    |
|  default  |   √    |  √   |  ×   |   ×    |
|  private  |   √    |  ×   |  ×   |   ×    |

类的成员不写访问修饰时默认为default。默认对于同一个包中的其他类相当于公开（public），对于不是同一个包中的其他类相当于私有（private）。受保护（protected）对子类相当于公开，对不是同一包中的没有父子关系的类相当于私有。Java中，外部类的修饰符只能是public或默认，类的成员（包括内部类）的修饰符可以是以上四种。





## 简述一下面向对象的”六原则一法则”。

- 单一职责原则：一个类只做它该做的事情。

单一职责原则想表达的就是”高内聚”，写代码最终极的原则只有六个字”高内聚、低耦合”。所谓的高内聚就是一个代码模块只完成一项功能，在面向对象中，如果只让一个类完成它该做的事，而不涉及与它无关的领域就是践行了高内聚的原则，这个类就只有单一职责。我们都知道一句话叫”因为专注，所以专业”，一个对象如果承担太多的职责，那么注定它什么都做不好。一个好的软件系统，它里面的每个功能模块也应该是可以轻易的拿到其他系统中使用的，这样才能实现软件复用的目标。

- 开闭原则：软件实体应当对扩展开放，对修改关闭。

在理想的状态下，当我们需要为一个软件系统增加新功能时，只需要从原来的系统派生出一些新类就可以，不需要修改原来的任何一行代码。要做到开闭有两个要点：

1）抽象是关键，一个系统中如果没有抽象类或接口系统就没有扩展点；

2）封装可变性，将系统中的各种可变因素封装到一个继承结构中，如果多个可变因素混杂在一起，系统将变得复杂而换乱，如果不清楚如何封装可变性，可以参考《设计模式精解》一书中对桥梁模式的讲解的章节。

- 依赖倒转原则：面向接口编程。

该原则说得直白和具体一些就是声明方法的参数类型、方法的返回类型、变量的引用类型时，尽可能使用抽象类型而不用具体类型，因为抽象类型可以被它的任何一个子类型所替代，请参考下面的里氏替换原则。

- 里氏替换原则：任何时候都可以用子类型替换掉父类型。

关于里氏替换原则的描述，Barbara Liskov女士的描述比这个要复杂得多，但简单的说就是能用父类型的地方就一定能使用子类型。里氏替换原则可以检查继承关系是否合理，如果一个继承关系违背了里氏替换原则，那么这个继承关系一定是错误的，需要对代码进行重构。例如让猫继承狗，或者狗继承猫，又或者让正方形继承长方形都是错误的继承关系，因为你很容易找到违反里氏替换原则的场景。需要注意的是：子类一定是增加父类的能力而不是减少父类的能力，因为子类比父类的能力更多，把能力多的对象当成能力少的对象来用当然没有任何问题。

- 接口隔离原则：接口要小而专，绝不能大而全。

臃肿的接口是对接口的污染，既然接口表示能力，那么一个接口只应该描述一种能力，接口也应该是高度内聚的。例如，琴棋书画就应该分别设计为四个接口，而不应设计成一个接口中的四个方法，因为如果设计成一个接口中的四个方法，那么这个接口很难用，毕竟琴棋书画四样都精通的人还是少数，而如果设计成四个接口，会几项就实现几个接口，这样的话每个接口被复用的可能性是很高的。Java中的接口代表能力、代表约定、代表角色，能否正确的使用接口一定是编程水平高低的重要标识。

- 合成聚合复用原则：优先使用聚合或合成关系复用代码。

通过继承来复用代码是面向对象程序设计中被滥用得最多的东西，因为所有的教科书都无一例外的对继承进行了鼓吹从而误导了初学者，类与类之间简单的说有三种关系，Is-A关系、Has-A关系、Use-A关系，分别代表继承、关联和依赖。其中，关联关系根据其关联的强度又可以进一步划分为关联、聚合和合成，但说白了都是Has-A关系，合成聚合复用原则想表达的是优先考虑Has-A关系而不是Is-A关系复用代码，原因嘛可以自己从百度上找到一万个理由，需要说明的是，即使在Java的API中也有不少滥用继承的例子，例如Properties类继承了Hashtable类，Stack类继承了Vector类，这些继承明显就是错误的，更好的做法是在Properties类中放置一个Hashtable类型的成员并且将其键和值都设置为字符串来存储数据，而Stack类的设计也应该是在Stack类中放一个Vector对象来存储数据。记住：任何时候都不要继承工具类，工具是可以拥有并可以使用的，而不是拿来继承的。

- 迪米特法则：迪米特法则又叫最少知识原则，一个对象应当对其他对象有尽可能少的了解。

迪米特法则简单的说就是如何做到”低耦合”，门面模式和调停者模式就是对迪米特法则的践行。对于门面模式可以举一个简单的例子，你去一家公司洽谈业务，你不需要了解这个公司内部是如何运作的，你甚至可以对这个公司一无所知，去的时候只需要找到公司入口处的前台美女，告诉她们你要做什么，她们会找到合适的人跟你接洽，前台的美女就是公司这个系统的门面。再复杂的系统都可以为用户提供一个简单的门面，Java Web开发中作为前端控制器的Servlet或Filter不就是一个门面吗，浏览器对服务器的运作方式一无所知，但是通过前端控制器就能够根据你的请求得到相应的服务。调停者模式也可以举一个简单的例子来说明，例如一台计算机，CPU、内存、硬盘、显卡、声卡各种设备需要相互配合才能很好的工作，但是如果这些东西都直接连接到一起，计算机的布线将异常复杂，在这种情况下，主板作为一个调停者的身份出现，它将各个设备连接在一起而不需要每个设备之间直接交换数据，这样就减小了系统的耦合度和复杂度。







# JAVA 基础面试

+ String 是最基本的数据类型吗？

  不是

  Java中的基本数据类型只有8个：byte、short、int、long、float、double、char、boolean；

  除了基本类型（primitive type）和枚举类型（enumeration type），剩下的都是引用类型（reference type）
  

+ float f=3.4;是否正确？

  不正确

  3.4是双精度数，将双精度型（double）赋值给浮点型（float）属于下转型会造成精度损失，因此需要强制类型转换float f = (float)3.4; 或者写成float f =3.4F

+ short s1 = 1; s1 = s1 + 1;有错吗?short s1 = 1; s1 += 1;有错吗？

  对于short s1 = 1; s1 = s1 + 1;由于1是int类型，因此s1+1运算结果也是int 型，需要强制转换类型才能赋值给short型

  而short s1 = 1; s1 += 1;可以正确编译，因为s1+= 1;相当于s1 = (short)(s1 + 1);其中有隐含的强制类型转换
  

+ int 和 Integer 有什么区别？

  Java为每一个基本数据类型都引入了对应的包装类型（wrapper class），int的包装类就是Integer，从Java 5开始引入了自动装箱/拆箱机制，使得二者可以相互转换。

  Java 为每个原始类型提供了包装类型：

  - 原始类型: boolean，char，byte，short，int，long，float，double
  - 包装类型：Boolean，Character，Byte，Short，Integer，Long，Float，Double

  

+ & 和 && 的区别？

  &运算符有两种用法：(1)按位与；(2)逻辑与

  &&运算符是短路与运算

  逻辑与跟短路与的差别是非常巨大的，虽然二者都要求运算符左右两端的布尔值都是true整个表达式的值才是true。&&之所以称为短路运算是因为，如果&&左边的表达式的值是false，右边的表达式会被直接短路掉，不会进行运算

  很多时候可能都需要用&&而不是&，例如在验证用户登录时判定用户名不是null而且不是空字符串，应当写为：username != null && !username.equals(“”)，二者的顺序不能交换，更不能用&运算符，因为第一个条件如果不成立，根本不能进行字符串的equals比较，否则会产生NullPointerException异常。注意：逻辑或运算符（|）和短路或运算符（||）的差别也是如此

  

+ Math.round(11.5) 等于多少？Math.round(-11.5)等于多少？

  Math.round(11.5) 的返回值是12，Math.round(-11.5) 的返回值是 -11。四舍五入的原理是在参数上加 0.5 然后进行下取整

  

+ switch 是否能作用在byte 上，是否能作用在long,float 上，是否能作用在String上？

  Java 5 以前，switch(expr)中，expr只能是byte、short、char、int

  Java 5开始，Java中引入了枚举类型，expr也可以是enum类型

  Java 7开始，expr还可以是字符串（String）

  但是长整型（long）,浮点数（float）在目前所有的版本中都是不可以的

  

+ 两个对象值相同(x.equals(y) == true)，但却可有不同的hash code，这句话对不对？

  不对

  如果两个对象x和y满足x.equals(y) == true，它们的哈希码（hash code）应当相同

  两个对象的hashCode相同，它们并不一定相同

  实现高质量的equals方法的诀窍包括：

  1. 使用 == 操作符检查”参数是否为这个对象的引用”；
  2. 使用 instanceof 操作符检查”参数是否为正确的类型”；
  3. 对于类中的关键属性，检查参数传入对象的属性是否与之相匹配；
  4. 重写 equals 时总是要重写 hashCode；

  

+ 当一个对象被当作参数传递到一个方法后，此方法可改变这个对象的属性，并可返回变化后的结果，那么这里到底是值传递还是引用传递？

  是值传递

  Java语言的方法调用只支持参数的值传递

  当一个对象实例作为一个参数被传递到方法中时，参数的值就是对该对象的引用。对象的属性可以在被调用过程中被改变，但对对象引用的改变是不会影响到调用者的

  

+ String、StringBuilder、StringBuffer的区别？

  String是只读字符串，String引用的字符串内容是不能被改变的

  StringBuffer/StringBuilder类表示的字符串对象可以直接进行修改

  StringBuilder是 Java 5 中引入的，它和 StringBuffer 的方法完全相同，区别在于它是在单线程环境下使用的，因为它的所有方面都没有被 synchronized 修饰，因此它的效率也比StringBuffer要高

  

+ 抽象的（abstract）方法是否可同时是静态的（static）,是否可同时是本地方法（native），是否可同时被synchronized修饰？

  都不能

  抽象方法需要子类重写，而静态的方法是无法被重写的，因此二者是矛盾的

  本地方法是由本地代码实现的方法，而抽象方法是没有实现的，也是矛盾的

  synchronized 要有锁，和方法的实现细节有关，抽象方法不涉及实现细节，因此也是相互矛盾的

  

+ 静态变量和实例变量的区别

  静态变量是被static修饰符修饰的变量，也称为类变量，它属于类，不属于类的任何一个对象，一个类不管创建多少个对象，静态变量在内存中有且仅有一个拷贝；实例变量必须依存于某一实例，需要先创建对象然后通过对象才能访问到它。静态变量可以实现让多个对象共享内存。

  补充：在Java开发中，上下文类和工具类中通常会有大量的静态成员

  

+ Object中有哪些公共方法

  - `toString、hashCode、equals、clone、finalized、wait、notify、notifyAll`

    + toString：默认返回`类的全路径名 + @ + 对象的哈希码`，可重写返回自己想要的东西
    + hashCode：
    + equals：
    + clone：
    + finalized：
    + wait：
    + notify：
    + notifyAll：

  

+ 是否可以从一个静态（static）方法内部发出对非静态（non-static）方法的调用

  不可以

  静态方法只能访问静态成员，因为非静态方法的调用要先创建对象，在调用静态方法时可能对象并没有被初始化

  

+ 深拷贝和浅拷贝的区别是什么

  浅拷贝：被复制对象的所有变量都含有与原来的对象相同的值，而所有的对其他对象的引用仍然指向原来的对象。换言之，浅拷贝仅仅复制所考虑的对象，而不复制它所引用的对象

  深拷贝：被复制对象的所有变量都含有与原来的对象相同的值，而那些引用其他对象的变量将指向被复制过的新对象，而不再是原有的那些被引用的对象。换言之，深拷贝把要复制的对象所引用的对象都复制了一遍

  

+ 如何实现对象克隆

  1. 实现Cloneable接口并重写Object类中的clone()方法；
  2. 实现Serializable接口，通过对象的序列化和反序列化实现克隆，可以实现真正的深度克隆
  3. 克隆构造方法
  4. 克隆工厂模式

  

+ String s = new String(“xyz”);创建了几个字符串对象

  一个或者两个对象

  一个是静态区的 ”xyz”，一个是用new创建在堆上的对象

  静态区内有则创建一个在堆中，否则静态区、堆上都要创建

  

+ 接口是否可继承（extends）接口？

  接口可以继承接口，而且支持多重继承

  

+ 抽象类是否可实现（implements）接口？

  抽象类可以实现(implements)接口

  

+ 抽象类是否可继承具体类（concrete class）

  抽象类可继承具体类也可以继承抽象类

  

+ final关键字有哪些用法

  1、修饰类：表示该类不能被继承；

  2、修饰方法：表示方法不能被重写；

  3、修饰变量：表示变量只能一次赋值以后值不能被修改（常量）

  

+ throw和throws的区别

  throw 用于主动抛出java.lang.Throwable 类的一个实例化对象，意思是说你可以通过关键字 throw 抛出一个 Error 或者 一个Exception，如：throw new IllegalArgumentException(“size must be multiple of 2″)。

  throws 写在方法名后面，方法被抛出相应的异常以便调用者能处理。Java 中，任何未处理的受检查异常强制在 throws 子句中声明

  

+ Error和Exception

  Error表示系统级的错误和程序不必处理的异常，是恢复不是不可能但很困难的情况下的一种严重问题；比如内存溢出，不可能指望程序能处理这样的情况；

  Exception表示需要捕捉或者需要程序进行处理的异常，是一种设计或实现问题；也就是说，它表示如果程序运行正常，从不会发生的情况。

  

+ throws、throw、try、catch、finally

  一般情况下是用try来执行一段程序，如果系统会抛出（throw）一个异常对象，可以通过它的类型来捕获（catch）它，或通过总是执行代码块（finally）来处理；
  try：用来指定一块预防所有异常的程序；
  catch：子句紧跟在try块后面，用来指定你想要捕获的异常的类型；
  throw：语句用来明确地抛出一个异常；
  throws：用来声明一个方法可能抛出的各种异常（当然声明异常时允许无病呻吟）；
  finally：为确保一段代码不管发生什么异常状况都要被执行

  

  try语句可以嵌套，每当遇到一个try语句，异常的结构就会被放入异常栈中，直到所有的try语句都完成。如果下一级的try语句没有对某种异常进行处理，异常栈就会执行出栈操作，直到遇到有处理这种异常的try语句或者最终将异常抛给JVM

  

+ 运行时异常与受检异常有何异同

  异常表示程序运行过程中可能出现的非正常状态，运行时异常表示虚拟机的通常操作中可能遇到的异常，是一种常见运行错误，只要程序设计得没有问题通常就不会发生。受检异常跟程序运行的上下文环境有关，即使程序设计无误，仍然可能因使用的问题而引发。Java编译器要求方法必须声明抛出可能发生的受检异常，但是并不要求必须声明抛出未被捕获的运行时异常。

  异常和继承一样，是面向对象程序设计中经常被滥用的东西，在Effective Java中对异常的使用给出了以下指导原则：

  - 不要将异常处理用于正常的控制流（设计良好的API不应该强迫它的调用者为了正常的控制流而使用异常）
  - 对可以恢复的情况使用受检异常，对编程错误使用运行时异常
  - 避免不必要的使用受检异常（可以通过一些状态检测手段来避免异常的发生）
  - 优先使用标准的异常
  - 每个方法抛出的异常都要有文档
  - 保持异常的原子性
  - 不要在catch中忽略掉捕获到的异常

  

+ 列出一些你常见的运行时异常

  - ArithmeticException（算术异常）
  - ClassCastException （类转换异常）
  - IllegalArgumentException （非法参数异常）
  - IndexOutOfBoundsException （下标越界异常）
  - NullPointerException （空指针异常）
  - SecurityException （安全异常）

  

+ final、finally、finalize

  - final：修饰符（关键字）有三种用法：如果一个类被声明为final，意味着它不能再派生出新的子类，即不能被继承，因此它和abstract是反义词。将变量声明为final，可以保证它们在使用中不被改变，被声明为final的变量必须在声明时给定初值，而在以后的引用中只能读取不可修改。被声明为final的方法也同样只能使用，不能在子类中被重写。
  - finally：通常放在try…catch…的后面构造总是执行代码块，这就意味着程序无论正常执行还是发生异常，这里的代码只要JVM不关闭都能执行，可以将释放外部资源的代码写在finally块中。
  - finalize：Object类中定义的方法，Java中允许使用finalize()方法在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。这个方法是由垃圾收集器在销毁对象时调用的，通过重写finalize()方法可以整理系统资源或者执行其他清理工作

  

+ 四种引用

  强引用：如果一个对象具有强引用，它就不会被垃圾回收器回收。即使当前内存空间不足，JVM也不会回收它，而是抛出 OutOfMemoryError 错误，使程序异常终止。如果想中断强引用和某个对象之间的关联，可以显式地将引用赋值为null，这样一来的话，JVM在合适的时间就会回收该对象

  软引用：在使用软引用时，如果内存的空间足够，软引用就能继续被使用，而不会被垃圾回收器回收，只有在内存不足时，软引用才会被垃圾回收器回收。

  弱引用：具有弱引用的对象拥有的生命周期更短暂。GC 过程中，一旦发现弱引用对象，无论当前内存空间是否充足，都会将弱引用回收。不过由于垃圾回收器是一个优先级较低的线程，所以并不一定能迅速发现弱引用对象

  虚引用：顾名思义，就是形同虚设，如果一个对象仅持有虚引用，那么它相当于没有引用，在任何时候都可能被垃圾回收器回收。

  资料： `http://blog.csdn.net/dd864140130/article/details/49885811`

  

+ 为什么要有不同的引用类型

  利用软引用和弱引用解决OOM问题

  用一个 HashMap 来保存`图片的路径`和`相应图片对象`关联的软引用之间的映射关系，在内存不足时，JVM 会自动回收这些缓存图片对象所占用的空间，从而有效地避免了 OOM 的问题

  

  通过软引用实现Java对象的高速缓存

  比如创建了一Person的类，如果每次需要查询一个人的信息，哪怕是几秒中之前刚刚查询过的，都要重新构建一个实例，这将引起大量Person对象的消耗，并且由于这些对象的生命周期相对较短，会引起多次GC影响性能。此时，通过软引用和 HashMap 的结合可以构建高速缓存，提供性能（那么，为什么不直接Redis）

  

+ 内部类的作用

  内部类提供了更好的封装，除了该外围类,，其他类都不能访问

  

+ SimpleDateFormat是线程安全的吗

  DateFormat 的所有实现都不是线程安全的，需要将 SimpleDateFormat 限制在 ThreadLocal 中，或使用 joda-time 库

  

+ 如何格式化日期

  可以使用 SimpleDateFormat 类或者 joda-time 库来格式日期。DateFormat 类允许你使用多种流行的格式来格式化日期。参见答案中的示例代码，代码中演示了将日期格式化成不同的格式，如 dd-MM-yyyy 或 ddMMyyyy

  

+ 反射的用途及实现

  反射机制是Java语言中一个非常重要的特性，它允许程序在运行时进行自我检查，同时也允许对其内部成员进行操作

  反射机制提供的功能主要有：得到一个对象所属的类；获取一个类的所有成员变量和方法；在运行时创建对象；在运行时调用对象的方法

  

+ 自定义注解的场景及实现

  自定义注解是通过运行时靠反射获取注解

  

+ 





# 集合

## 普通集合

### 集合及其继承关系

![java集合关系图](https://hyfly-blog-1307706368.cos.ap-chengdu.myqcloud.com/%E5%90%8E%E7%AB%AF/java/%E5%9F%BA%E7%A1%80/%E9%9B%86%E5%90%88/java%E9%9B%86%E5%90%88%E5%85%B3%E7%B3%BB%E5%9B%BE.jpg)



#### Iterator 接口

#### Collection 接口



#### Map 接口

##### HashMap

类图

![类图](https://hyfly-blog-1307706368.cos.ap-chengdu.myqcloud.com/%E5%90%8E%E7%AB%AF/java/%E5%9F%BA%E7%A1%80/%E9%9B%86%E5%90%88/HashMap%E7%B1%BB%E5%9B%BE.png)



内部类类图

![](https://hyfly-blog-1307706368.cos.ap-chengdu.myqcloud.com/%E5%90%8E%E7%AB%AF/java/%E5%9F%BA%E7%A1%80/%E9%9B%86%E5%90%88/HashMap%E5%86%85%E9%83%A8%E7%B1%BBEntrySet%E7%9A%84%E7%B1%BB%E5%9B%BE.png)





##### TreeMap

##### HashTable





#### Arrays 工具类

#### Collections 工具类







## JUC

### 关系

![JUC关系图](https://hyfly-blog-1307706368.cos.ap-chengdu.myqcloud.com/%E5%90%8E%E7%AB%AF/java/%E5%9F%BA%E7%A1%80/%E9%9B%86%E5%90%88/JUC%E5%85%B3%E7%B3%BB%E5%9B%BE.png)





## 集合面试题

+ List、Set、Map是否继承自Collection接口

  List、Set 是，Map 不是。Map是键值对映射容器，与List和Set有明显的区别，而Set存储的零散的元素且不允许有重复元素（数学中的集合也是如此），List是线性结构的容器，适用于按数值索引访问元素的情形

  

+ 阐述 ArrayList、Vector、LinkedList 的存储性能和特性

  ArrayList 和Vector都是使用数组方式存储数据，此数组元素数大于实际存储的数据以便增加和插入元素，它们都允许直接按序号索引元素，但是插入元素要涉及数组元素移动等内存操作，所以索引数据快而插入数据慢。Vector中的方法由于添加了synchronized修饰，因此Vector是线程安全的容器，但性能上较ArrayList差，因此已经是Java中的遗留容器。

  LinkedList使用双向链表实现存储（将内存中零散的内存单元通过附加的引用关联起来，形成一个可以按序号索引的线性结构，这种链式存储方式与数组的连续存储方式相比，内存的利用率更高），按序号索引数据需要进行前向或后向遍历，但是插入数据时只需要记录本项的前后项即可，所以插入速度较快。

  Vector属于遗留容器（Java早期的版本中提供的容器，除此之外，Hashtable、Dictionary、BitSet、Stack、Properties都是遗留容器），已经不推荐使用，但是由于ArrayList和LinkedListed都是非线程安全的，如果遇到多个线程操作同一个容器的场景，则可以通过工具类Collections中的synchronizedList方法将其转换成线程安全的容器后再使用（这是对装潢模式的应用，将已有对象传入另一个类的构造器中创建新的对象来增强实现）

  

+ Collection 和 Collections

  Collection是一个接口，它是Set、List等容器的父接口

  Collections是个一个工具类，提供了一系列的静态方法来辅助容器操作，这些方法包括对容器的搜索、排序、线程安全化等等

  

+ List、Map、Set三个接口存取元素时，各有什么特点

  List以特定索引来存取元素，可以有重复元素

  Set不能存放重复元素（用对象的equals()方法来区分元素是否重复）

  Map保存键值对（key-value pair）映射，映射关系可以是一对一或多对一

  

  Set和Map容器都有基于哈希存储和排序树的两种实现版本，基于哈希存储的版本理论存取时间复杂度为O(1)，而基于排序树版本的实现在插入或删除元素时会按照元素或元素的键（key）构成排序树从而达到排序和去重的效果

  

+ List 和 Set 区别

  Set是最简单的一种集合。集合中的对象不按特定的方式排序，并且没有重复对象。

  - HashSet： HashSet类按照哈希算法来存取集合中的对象，存取速度比较快
  - TreeSet ：TreeSet类实现了SortedSet接口，能够对集合中的对象进行排序

  

  List的特征是其元素以线性方式存储，集合中可以存放重复对象。

  - ArrayList() : 代表长度可以改变得数组。可以对元素进行随机的访问，向ArrayList()中插入与删除元素的速度慢。
  - LinkedList(): 在实现中采用链表数据结构。插入和删除速度快，访问速度慢

  

+ LinkedHashMap和PriorityQueue

  PriorityQueue 是一个优先级队列，保证最高或者最低优先级的的元素总是在队列头部

  LinkedHashMap 维持的顺序是元素插入的顺序

  当遍历一个 PriorityQueue 时，没有任何顺序保证，但是 LinkedHashMap 课保证遍历顺序是元素插入的顺序

  

+ WeakHashMap与HashMap的区别是什么

  WeakHashMap 的工作与正常的 HashMap 类似，但是使用弱引用作为 key，意思就是当 key 对象没有任何引用时，key/value 将会被回收

  

+ ArrayList和LinkedList的区别

  最明显的区别是 ArrrayList底层的数据结构是数组，支持随机访问，而 LinkedList 的底层数据结构是双向循环链表，不支持随机访问，使用下标访问一个元素。

  ArrayList 的时间复杂度是 O(1)，而 LinkedList 是 O(n)

  LinkedList的插入，添加，删除操作速度更快，因为当元素被添加到集合任意位置的时候，不需要像数组那样重新计算大小或者是更新索引

  LinkedList 比 ArrayList 更占内存，因为 LinkedList 为每一个节点存储了两个引用，一个指向前一个元素，一个指向下一个元素

  

+ ArrayList 和 Array 有什么区别

  Array可以容纳基本类型和对象

  ArrayList只能容纳对象

  Array是指定大小的，ArrayList大小是动态变化的 

  

+ ArrayList与Vector

  ArrayList和Vector在很多时候都很类似。

  - 两者都是基于索引的，内部由一个数组支持。
  - 两者维护插入的顺序，我们可以根据插入顺序来获取元素。
  - ArrayList和Vector的迭代器实现都是fail-fast的。
  - ArrayList和Vector两者允许null值，也可以使用索引值对元素进行随机访问

  

  以下是ArrayList和Vector的不同点。

  - Vector是同步的，而ArrayList不是。然而，如果你寻求在迭代的时候对列表进行改变，你应该使用CopyOnWriteArrayList。
  - ArrayList比Vector快，它因为有同步，不会过载。
  - ArrayList更加通用，因为我们可以使用Collections工具类轻易地获取同步列表和只读列表

  

+ HashMap和Hashtable

  HashMap和Hashtable都实现了Map接口，因此很多特性非常相似。但是，他们有以下不同点：

  - HashMap允许键和值是null，而Hashtable不允许键或者值是null。
  - Hashtable是同步的，而HashMap不是。因此，HashMap更适合于单线程环境，而Hashtable适合于多线程环境。
  - HashMap提供了可供应用迭代的键的集合，因此，HashMap是快速失败的。另一方面，Hashtable提供了对键的列举(Enumeration)。
  - 一般认为Hashtable是一个遗留的类

  

+ HashSet和HashMap

  - HashSet实现了Set接口，它不允许集合中有重复的值。它存储的是对象
  - HashMap实现了Map接口，Map接口对键值对进行映射。Map中不允许重复的键。Map接口有两个基本的实现，HashMap和TreeMap

  

+ HashMap和ConcurrentHashMap的区别

  - ConcurrentHashMap：对整个桶数组进行了分段，而HashMap则没有
  - ConcurrentHashMap：JDK7 在每一个分段上都用锁进行保护，从而让锁的粒度更精细一些，并发性能更好，JDK8，为CAS + Synchronized + 红黑树，而HashMap没有锁机制，不是线程安全的

  

+ Comparator和Comparable的区别

  Comparable 接口用于定义对象的自然顺序，而 comparator 通常用于定义用户定制的顺序。

  Comparable 总是只有一个，但是可以有多个 comparator 来定义对象的顺序

  

+ poll()方法和remove()方法区别

  poll() 和 remove() 都是从队列中取出一个元素

  poll() 在获取元素失败的时候会返回空

   remove() 失败的时候会抛出异常

  

+ ArrayList、HashMa和LinkedList的默认空间是多少？扩容机制是什么

  - ArrayList 的默认大小是 10 个元素。扩容点规则是，新增的时候发现容量不够用了，就去扩容；扩容大小规则是：扩容后的大小= 原始大小+原始大小/2 + 1。
  - HashMap 的默认大小是16个元素（必须是2的幂）。扩容因子默认0.75，扩容机制.(当前大小 和 当前容量 的比例超过了 扩容因子，就会扩容，扩容后大小为 一倍。例如：初始大小为 16 ，扩容因子 0.75 ，当容量为12的时候，比例已经是0.75 。触发扩容，扩容后的大小为 32.)
  - LinkedList 是一个双向链表，没有初始化大小，也没有扩容的机制，就是一直在前面或者后面新增就好

  ```java
  private static final int DEFAULT_CAPACITY = 10;//from HashMap.java JDK 7
  
  static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
  ```

  

+ 如何实现集合排序

  可以使用有序集合，如 TreeSet 或 TreeMap，

  可以使用有顺序的的集合，如 list，然后通过 Collections.sort() 来排序

  

+ 如何打印数组内容

  Arrays.toString()，Arrays.deepToString() 

  

+ LinkedList的是单向链表还是双向

  双向循环列表

  

+ TreeMap是实现原理

  红黑树

  

+ 遍历ArrayList时如何正确移除一个元素

  Iterator 的 remove()方法

  for倒序遍历删除 remove()，正序会抛 ConcurrentModificationException

  

+ 什么是ArrayMap？它和HashMap有什么区别

  ArrayMap是Android SDK中提供的

  

+ 如何决定选用HashMap还是TreeMap

  对于在Map中插入、删除和定位元素这类操作，选HashMap

  需要对一个有序的key集合进行遍历，选TreeMap

  基于collection的大小，也许向HashMap中添加元素会更快，将map换为TreeMap进行有序key的遍历

  

+ 



12、区别

- 







23、？

。



24、HashMap的实现原理

1. HashMap概述： HashMap是基于哈希表的Map接口的非同步实现。此实现提供所有可选的映射操作，并允许使用null值和null键。此类不保证映射的顺序，特别是它不保证该顺序恒久不变。
2. HashMap的数据结构： 在java编程语言中，最基本的结构就是两种，一个是数组，另外一个是模拟指针（引用），所有的数据结构都可以用这两个基本结构来构造的，HashMap也不例外。HashMap实际上是一个“链表散列”的数据结构，即数组和链表的结合体。

当我们往Hashmap中put元素时,首先根据key的hashcode重新计算hash值,根绝hash值得到这个元素在数组中的位置(下标),如果该数组在该位置上已经存放了其他元素,那么在这个位置上的元素将以链表的形式存放,新加入的放在链头,最先加入的放入链尾.如果数组中该位置没有元素,就直接将该元素放到数组的该位置上.

需要注意Jdk 1.8中对HashMap的实现做了优化,当链表中的节点数据超过八个之后,该链表会转为红黑树来提高查询效率,从原来的O(n)到O(logn)

也可以参考：

- [深入Java集合学习系列：HashMap的实现原理](http://zhangshixi.iteye.com/blog/672697)
- [深入理解HashMap](https://github.com/guohongjun/HashMap-System-Learning)



25、解决Hash冲突的方法有哪些

开放地址法、链地址法、再哈希法、建立公共溢出区等

参考：

- [java 解决Hash(散列)冲突的四种方法—开放定址法(线性探测,二次探测,伪随机探测)、链地址法、再哈希、建立公共溢出区](https://blog.csdn.net/qq_27093465/article/details/52269862)
- [Java 8中HashMap冲突解决](https://blog.csdn.net/cpcpcp123/article/details/52744331)



26、ConcurrentHashMap 的工作原理及代码实现

ConcurrentHashMap具体是怎么实现线程安全的呢，肯定不可能是每个方法加synchronized，那样就变成了HashTable。

从ConcurrentHashMap代码中可以看出，它引入了一个“分段锁”的概念，具体可以理解为把一个大的Map拆分成N个小的HashTable，根据key.hashCode()来决定把key放到哪个HashTable中。

在ConcurrentHashMap中，就是把Map分成了N个Segment，put和get的时候，都是现根据key.hashCode()算出放到哪个Segment中。



27、你了解Fail-Fast机制吗

Fail-Fast即我们常说的快速失败,

更多内容参看fail-fast机制：`http://blog.csdn.net/chenssy/article/details/38151189`



28、Fail-fast和Fail-safe有什么区别

Iterator的fail-fast属性与当前的集合共同起作用，因此它不会受到集合中任何改动的影响。Java.util包中的所有集合类都被设计为fail->fast的，而java.util.concurrent中的集合类都为fail-safe的。当检测到正在遍历的集合的结构被改变时，Fail-fast迭代器抛出ConcurrentModificationException，而fail-safe迭代器从不抛出ConcurrentModificationException。



29、说出几点 Java 中使用 Collections 的最佳实践

这是我在使用 Java 中 Collectionc 类的一些最佳实践：

- 使用正确的集合类，例如，如果不需要同步列表，使用 ArrayList 而不是 Vector。
- 优先使用并发集合，而不是对集合进行同步。并发集合提供更好的可扩展性。
- 使用接口代表和访问集合，如使用List存储 ArrayList，使用 Map 存储 HashMap 等等。
- 使用迭代器来循环集合。
- 使用集合的时候使用泛型。



30、BlockingQueue是什么？

Java.util.concurrent.BlockingQueue是一个队列，在进行检索或移除一个元素的时候，它会等待队列变为非空；当在添加一个元素时，它会等待队列中的可用空间。BlockingQueue接口是Java集合框架的一部分，主要用于实现生产者-消费者模式。我们不需要担心等待生产者有可用的空间，或消费者有可用的对象，因为它都在BlockingQueue的实现类中被处理了。Java提供了集中BlockingQueue的实现，比如ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue,、SynchronousQueue



31、队列和栈是什么，列出它们的区别？

栈和队列两者都被用来预存储数据。java.util.Queue是一个接口，它的实现类在Java并发包中。队列允许先进先出（FIFO）检索元素，但并非总是这样。Deque接口允许从两端检索元素。

栈与队列很相似，但它允许对元素进行后进先出（LIFO）进行检索。

Stack是一个扩展自Vector的类，而Queue是一个接口。



32、多线程情况下HashMap死循环的问题

可以参考：[疫苗：JAVA HASHMAP的死循环](https://coolshell.cn/articles/9606.html)



33、HashMap出现Hash DOS攻击的问题

可以参考：[HASH COLLISION DOS 问题](https://coolshell.cn/articles/6424.html)



34、Java Collections和Arrays的sort方法默认的排序方法是什么？

参考：[Collections.sort()和Arrays.sort()排序算法选择](







# 面试

# java 后端面试题答案<1>

说明：以下所有答案均为个人的理解和网上的一些资料的整合

## List 和 Set 的区别

List , Set 都是继承自 Collection 接口 List 特点：元素有放入顺序，元素可重复 ，

Set 特点：元素无放入顺序，元素不可重复，重复元素会覆盖掉，（元素虽然无放入顺序，但是元素在set中的位置是有该元素的 HashCode 决定的，其位置其实是固定的，加入Set 的 Object 必须定义 equals ()方法 ，另外list支持for循环，也就是通过下标来遍历，也可以用迭代器，但是set只能用迭代，因为他无序，无法用下标来取得想要的值。） Set和List对比 Set：检索元素效率低下，删除和插入效率高，插入和删除不会引起元素位置改变。List：和数组类似，List可以动态增长，查找元素效率高，插入删除元素效率低，因为会引起其他元素位置改变

## HashSet 是如何保证不重复的

向 HashSet 中 add ()元素时，判断元素是否存在的依据，不仅要比较hash值，同时还要结合 equles 方法比较。

HashSet 中的 add ()方法会使用 HashMap 的 add ()方法。以下是 HashSet 部分源码：

 ```
private static final Object PRESENT = new Object(); private transient HashMap<E,Object> map;
public HashSet() {
map = new HashMap<>();
}
public boolean add(E e) {
return map.put(e, PRESENT)==null;
}
 ```

`HashMap 的 key 是唯一的，由上面的代码可以看出 HashSet 添加进去的值就是作为 HashMap 的key。所以不会重复（ HashMap 比较key是否相等是先比较 hashcode 在比较 equals ）。`

## HashMap 是线程安全的吗，为什么不是线程安全的（最好画图说明多线程环境下不安全）?不是线程安全的；

如果有两个线程A和B，都进行插入数据，刚好这两条不同的数据经过哈希计算后得到的哈希码是一样的，且该位置还没有其他的数据。所以这两个线程都会进入我在上面标记为1的代码中。假设一种情况，线程A通过if判断，该位置没有哈希冲突，进入了if语句，还没有进行数据插入，这时候 CPU 就把资源让给了线程B，线程A停在了if语句里面，线程B判断该位置没有哈希冲突（线程A的数据还没插入），也进入了if语句，线程B执行完后，轮到线程A执行，现在线程A直接在该位置插入而不用再判断。这时候，你会发现线程A把线程B插入的数据给覆盖了。发生了线程不安全情况。本来在 HashMap 中，发生哈希冲突是可以用链表法或者红黑树来解决的，但是在多线程中，可能就直接给覆盖了。

上面所说的是一个图来解释可能更加直观。如下面所示，两个线程在同一个位置添加数据，后面添加的数据就覆盖住了前面添加的。

![1](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/1java后端面试题答案.assets/1.jpg)

如果上述插入是插入到链表上，如两个线程都在遍历到最后一个节点，都要在最后添加一个数据，那么后面添加数据的线程就会把前面添加的数据给覆盖住。则![2](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/1java后端面试题答案.assets/2.jpg)

在扩容的时候也可能会导致数据不一致，因为扩容是从一个数组拷贝到另外一个数组。

 

## HashMap 的扩容过程

 

当向容器添加元素的时候，会判断当前容器的元素个数，如果大于等于阈值(知道这个阈字怎么念吗？不念 fa 值，念 yu 值四声)---即当前数组的长度乘以加载因子的值的时候，就要自动扩容啦。

扩容( resize )就是重新计算容量，向 HashMap 对象里不停的添加元素，而 HashMap 对象内部的数组无法装载更多的元素时，对象就需要扩大数组的长度，以便能装入更多的元素。当然 Java 里的数组是无法自动扩容的，方法是使用一个新的数组代替已有的容量小的数组，就像我们用一个小桶装水，如果想装更多的水，就得换大水桶。

`HashMap hashMap=new HashMap(cap);`

cap =3， hashMap 的容量为4；

cap =4， hashMap 的容量为4；

cap =5， hashMap 的容量为8；

cap =9， hashMap 的容量为16；

如果 cap 是2的n次方，则容量为 cap ，否则为大于 cap 的第一个2的n次方的数。

## HashMap 1.7 与 1.8 的 区别，说明 1.8 做了哪些优化，如何优化的？

 

HashMap结构图![3](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/1java后端面试题答案.assets/3.jpg)

在 JDK1.7 及之前的版本中， HashMap 又叫散列链表：基于一个数组以及多个链表的实现，hash值冲突的时候，就将对应节点以链表的形式存储。 

JDK1.8 中，当同一个hash值（ Table 上元素）的链表节点数不小于8时，将不再以单链表的形式存储了，会被

调整成一颗红黑树。这就是 JDK7 与 JDK8 中 HashMap 实现的最大区别。 

其下基于 JDK1.7.0_80 与 JDK1.8.0_66 做的分析

JDK1.7中

使用一个 Entry 数组来存储数据，用key的 hashcode 取模来决定key会被放到数组里的位置，如果 hashcode 相同，或者 hashcode 取模后的结果相同（ hash collision ），那么这些 key 会被定位到 Entry 数组的同一个格子里，这些 key 会形成一个链表。

在 hashcode 特别差的情况下，比方说所有key的 hashcode 都相同，这个链表可能会很长，那么 put/get 操作都可能需要遍历这个链表，也就是说时间复杂度在最差情况下会退化到 O(n)

JDK1.8中 

使用一个 Node 数组来存储数据，但这个 Node 可能是链表结构，也可能是红黑树结构

- 如果插入的 key 的 hashcode 相同，那么这些key也会被定位到 Node 数组的同一个格子里。
- 如果同一个格子里的key不超过8个，使用链表结构存储。
- 如果超过了8个，那么会调用 treeifyBin 函数，将链表转换为红黑树。

那么即使 hashcode 完全相同，由于红黑树的特点，查找某个特定元素，也只需要O(log n)的开销也就是说put/get的操作的时间复杂度最差只有 O(log n)

听起来挺不错，但是真正想要利用 JDK1.8 的好处，有一个限制：key的对象，必须正确的实现了 Compare 接口

如果没有实现 Compare 接口，或者实现得不正确（比方说所有 Compare 方法都返回0）那 JDK1.8 的 HashMap 其实还是慢于 JDK1.7 的

简单的测试数据如下：

向 HashMap 中 put/get 1w 条 hashcode 相同的对象

JDK1.7: put 0.26s ， get 0.55s

JDK1.8 （未实现 Compare 接口）： put 0.92s ， get 2.1s

但是如果正确的实现了 Compare 接口，那么 JDK1.8 中的 HashMap 的性能有巨大提升，这次 put/get 100W条hashcode 相同的对象

JDK1.8 （正确实现 Compare 接口，）： put/get 大概开销都在320 ms 左右

`final finally finalize`

- final可以修饰类、变量、方法，修饰类表示该类不能被继承、修饰方法表示该方法不能被重写、修饰变量表示该变量是一个常量不能被重新赋值。
- finally一般作用在try-catch代码块中，在处理异常的时候，通常我们将一定要执行的代码方法finally代码块中，表示不管是否出现异常，该代码块都会执行，一般用来存放一些关闭资源的代码。
- finalize是一个方法，属于Object类的一个方法，而Object类是所有类的父类，该方法一般由垃圾回收器来调用，当我们调用 System.gc() 方法的时候，由垃圾回收器调用finalize()，回收垃圾，一个对象是否可回收的最后判断。

 

## 对象的四种引用

 

强引用 只要引用存在，垃圾回收器永远不会回收

```
Object obj = new Object(); 
User user=new User();
```

可直接通过obj取得对应的对象 如 obj.equels(new Object()); 而这样 obj 对象对后面 new Object 的一个强引用，只有当 obj 这个引用被释放之后，对象才会被释放掉，这也是我们经常所用到的编码形式。

软引用 非必须引用，内存溢出之前进行回收，可以通过以下代码实现

```
Object obj = new Object();
SoftReference<Object> sf = new SoftReference<Object>(obj);
obj = null;
sf.get();//有时候会返回null
```

这时候sf是对obj的一个软引用，通过sf.get()方法可以取到这个对象，当然，当这个对象被标记为需要回收的对象时，则返回null； 软引用主要用户实现类似缓存的功能，在内存足够的情况下直接通过软引用取值，无需从繁忙的真实来源查询数据，提升速度；当内存不足时，自动删除这部分缓存数据，从真正的来源查询这些数据。

弱引用 第二次垃圾回收时回收，可以通过如下代码实现

```
Object obj = new Object();
WeakReference<Object> wf = new WeakReference<Object>(obj);
obj = null;
wf.get();//有时候会返回null
wf.isEnQueued();//返回是否被垃圾回收器标记为即将回收的垃圾
```

弱引用是在第二次垃圾回收时回收，短时间内通过弱引用取对应的数据，可以取到，当执行过第二次垃圾回收时，

将返回null。弱引用主要用于监控对象是否已经被垃圾回收器标记为即将回收的垃圾，可以通过弱引用的

isEnQueued 方法返回对象是否被垃圾回收器标记。ThreadLocal 中有使用到弱引用，	

```
public class ThreadLocal<T> {
	static class ThreadLocalMap {
		static class Entry extends WeakReference<ThreadLocal<?>> { /** The 			value associated with this ThreadLocal. */ Object value;
			Entry(ThreadLocal<?> k, Object v) {
			super(k); value = v;
			}
		}
		//....
	}
	//.....
}
```

虚引用 垃圾回收时回收，无法通过引用取到对象值，可以通过如下代码实现

```
Object obj = new Object();
PhantomReference<Object> pf = new PhantomReference<Object>(obj);
obj=null;
pf.get();//永远返回null pf.isEnQueued();//返回是否从内存中已经删除
```

虚引用是每次垃圾回收的时候都会被回收，通过虚引用的get方法永远获取到的数据为null，因此也被成为幽灵引用。虚引用主要用于检测对象是否已经从内存中删除。

 

## Java获取反射的三种方法

 

1.通过new对象实现反射机制 2.通过路径实现反射机制 3.通过类名实现反射机制

 ```
public class Student { 
	private int id; 
	String name;
	protected boolean sex; 
	public float score;
}
 ```

```
public class Get {
//获取反射机制三种方式

	public static void main(String[] args) throws ClassNotFoundException {
	//方式一(通过建立对象)

		Student stu = new Student();

		Class classobj1 = stu.getClass(); 								
		System.out.println(classobj1.getName()); //方式二（所在通过路径-相对路径）

		Class classobj2 = Class.forName("fanshe.Student");

		System.out.println(classobj2.getName());
		//方式三（通过类名）

		Class classobj3 = Student.class; 			
		System.out.println(classobj3.getName());
	}

}
```

## Java反射机制

 

Java 反射机制是在运行状态中，对于任意一个类，都能够获得这个类的所有属性和方法，对于任意一个对象都能够调用它的任意一个属性和方法。这种在运行时动态的获取信息以及动态调用对象的方法的功能称为 Java 的反射机制。

 

Class 类与 java.lang.reflect 类库一起对反射的概念进行了支持，该类库包含了 Field,Method,Constructor 类 (每个类都实现了 Member 接口)。这些类型的对象时由 JVM 在运行时创建的，用以表示未知类里对应的成员。

 

这样你就可以使用 Constructor 创建新的对象，用 get() 和 set() 方法读取和修改与 Field 对象关联的字段，用invoke() 方法调用与 Method 对象关联的方法。另外，还可以调用 getFields() getMethods() 和

getConstructors() 等很便利的方法，以返回表示字段，方法，以及构造器的对象的数组。这样匿名对象的信息

就能在运行时被完全确定下来，而在编译时不需要知道任何事情。

```
import java.lang.reflect.Constructor;

public class ReflectTest {

	public static void main(String[] args) throws Exception {
	
		Class clazz = null;

		clazz = Class.forName("com.jas.reflect.Fruit"); 
		Constructor<Fruit> constructor1 = clazz.getConstructor();
		Constructor<Fruit> constructor2 = clazz.getConstructor(String.class);

		Fruit fruit1 = constructor1.newInstance();

		Fruit fruit2 = constructor2.newInstance("Apple");

	}

}

class Fruit{

	public Fruit(){
		System.out.println("无参构造器  Run...........");

	}

	public Fruit(String type){
		System.out.println("有参构造器  Run..........." + type);

	}

}

```

`运行结果： 无参构造器 Run……….. 有参构造器 Run………..Apple `

## Arrays.sort 和 Collections.sort 实现原理 和区别

Collection和Collections区别

java.util.Collection 是一个集合接口。它提供了对集合对象进行基本操作的通用接口方法。

java.util.Collections 是针对集合类的一个帮助类，他提供一系列静态方法实现对各种集合的搜索、排序、线程安全等操作。 然后还有混排（Shuffling）、反转（Reverse）、替换所有的元素（fill）、拷贝（copy）、返回Collections中最小元素（min）、返回Collections中最大元素（max）、返回指定源列表中最后一次出现指定目标列表的起始位置（ lastIndexOfSubList ）、返回指定源列表中第一次出现指定目标列表的起始位置（ IndexOfSubList ）、根据指定的距离循环移动指定列表中的元素（Rotate）;

事实上Collections.sort方法底层就是调用的array.sort方法，

```
public static void sort(Object[] a) {

	if (LegacyMergeSort.userRequested)
		legacyMergeSort(a);
	else
		ComparableTimSort.sort(a, 0, a.length, null, 0, 0);
}

//void java.util.ComparableTimSort.sort()
static void sort(Object[] a, int lo, int hi, Object[] work, int workBase, int workLen) {

	assert a != null && lo >= 0 && lo <= hi && hi <= a.length; 
	int nRemaining = hi - lo;
	if (nRemaining < 2)

		return; // Arrays of size 0 and 1 are always sorted

	// If array is small, do a "mini-TimSort" with no merges 
	if (nRemaining < MIN_MERGE) {
		int initRunLen = countRunAndMakeAscending(a, lo, hi); 
		binarySort(a, lo, hi, lo + initRunLen);
		return;

	}
  
}
```

legacyMergeSort (a)：归并排序 ComparableTimSort.sort() ： Timsort 排序

Timsort 排序是结合了合并排序（merge sort）和插入排序（insertion sort）而得出的排序算法

Timsort的核心过程

> TimSort 算法为了减少对升序部分的回溯和对降序部分的性能倒退，将输入按其升序和降序特点进行了分区。排序的输入的单位不是一个个单独的数字，而是一个个的块-分区。其中每一个分区叫一个run。针对这些 run 序列，每次拿一个 run 出来按规则进行合并。每次合并会将两个 run合并成一个 run。合并的结果保存到栈中。合并直到消耗掉所有的 run，这时将栈上剩余的 run合并到只剩一个 run 为止。这时这个仅剩的run 便是排好序的结果。

综上述过程，Timsort算法的过程包括

（0）如何数组长度小于某个值，直接用二分插入排序算法

（1）找到各个run，并入栈

（2）按规则合并run



## LinkedHashMap 的应用

 

基于 LinkedHashMap 的访问顺序的特点，可构造一个 LRU（Least Recently Used） 最近最少使用简单缓存。也有一些开源的缓存产品如 ehcache 的淘汰策略（ LRU ）就是在 LinkedHashMap 上扩展的。



## Cloneable 接口实现原理

Cloneable接口是Java开发中常用的一个接口， 它的作用是使一个类的实例能够将自身拷贝到另一个新的实例中，注意，这里所说的“拷贝”拷的是对象实例，而不是类的定义，进一步说，拷贝的是一个类的实例中各字段的值。

`在开发过程中，拷贝实例是常见的一种操作，如果一个类中的字段较多，而我们又采用在客户端中逐字段复制的方法进行拷贝操作的话，将不可避免的造成客户端代码繁杂冗长，而且也无法对类中的私有成员进行复制，而如果让需要具备拷贝功能的类实现Cloneable接口，并重写clone()方法，就可以通过调用clone()方法的方式简洁地实现实例拷贝功能`

深拷贝(深复制)和浅拷贝(浅复制)是两个比较通用的概念，尤其在C++语言中，若不弄懂，则会在delete的时候出问题，但是我们在这幸好用的是Java。虽然Java自动管理对象的回收，但对于深拷贝(深复制)和浅拷贝(浅复制)，我们还是要给予足够的重视，因为有时这两个概念往往会给我们带来不小的困惑。

浅拷贝是指拷贝对象时仅仅拷贝对象本身（包括对象中的基本变量），而不拷贝对象包含的引用指向的对象。深拷贝不仅拷贝对象本身，而且拷贝对象包含的引用指向的所有对象。举例来说更加清楚：对象 A1 中包含对 B1 的引用， B1 中包含对 C1 的引用。浅拷贝 A1 得到 A2 ， A2 中依然包含对 B1 的引用， B1 中依然包含对 C1 的引用。深拷贝则是对浅拷贝的递归，深拷贝 A1 得到 A2 ， A2 中包含对 B2 （ B1 的 copy ）的引用， B2 中包含对 C2 （ C1 的 copy ）的引用。

若不对clone()方法进行改写，则调用此方法得到的对象即为浅拷贝

 

## 异常分类以及处理机制

![4](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/1java后端面试题答案.assets/4.jpg)

Java标准库内建了一些通用的异常，这些类以Throwable为顶层父类。Throwable又派生出Error类和Exception类。

错误：Error类以及他的子类的实例，代表了JVM本身的错误。错误不能被程序员通过代码处理，Error很少出现。因此，程序员应该关注Exception为父类的分支下的各种异常类。

异常：Exception以及他的子类，代表程序运行时发送的各种不期望发生的事件。可以被Java异常处理机制使用，是异常处理的核心。

# **1.面向对象和面向过程的区别**

## 面向过程

**优点：** 性能比面向对象高，因为类调用时需要实例化，开销比较大，比较消耗

资源;比如单片机、嵌入式开发、Linux/Unix 等一般采用面向过程开发，性能是最重要的因素。 

**缺点：** 没有面向对象易维护、易复用、易扩展 

## 面向对象

**优点：** 易维护、易复用、易扩展，由于面向对象有封装、继承、多态性的特性，可以设计出低耦合的系统，使系统更加灵活、更加易于维护 

**缺点：** 性能比面向过程低 

# **2. Java** **语言有哪些特点** 

1. 简单易学； 

2. 面向对象（封装，继承，多态）； 

3. 平台无关性（ Java 虚拟机实现平台无关性）； 

4. 可靠性； 

5. 安全性； 

6. 支持多线程（ C++ 语言没有内置的多线程机制，因此必须调用操作系

统的多线程功能来进行多线程程序设计，而 Java 语言却提供了多线程支持）； 

7.   支持网络编程并且很方便（ Java 语言诞生本身就是为简化网络编程设

计的，因此 Java 语言不仅支持网络编程而且很方便）； 

8.   编译与解释并存； 

# 3. 关于 JVM JDK 和 JRE 最详细通俗的解答 

## JVM 

Java 虚拟机（JVM）是运行 Java 字节码的虚拟机。JVM 有针对不同系统的特

定实现（Windows，Linux，macOS），目的是使用相同的字节码，它们都会给出相同的结果。 

**什么是字节码?采用字节码的好处是什么?** 

在 Java 中，JVM 可以理解的代码就叫做字节码（即扩展名为 .class 的文

件），它不面向任何特定的处理器，只面向虚拟机。Java 语言通过字节码的方式，在一定程度上解决了传统解释型语言执行效率低的问题，同时又保留了解释型语言可移植的特点。所以 Java 程序运行时比较高效，而且，由于字节码

并不专对一种特定的机器，因此，Java 程序无须重新编译便可在多种不同的计算机上运行。 

**Java 程序从源代码到运行一般有下面** **3 步：** 

我们需要格外注意的是 .class->机器码 这一步。在这一步 jvm 类加载器首先加载字节码文件，然后通过解释器逐行解释执行，这种方式的执行速度会相对比较慢。而且，有些方法和代码块是经常需要被调用的，也就是所谓的热点代码，所以后面引进了 JIT 编译器，JIT 属于运行时编译。当 JIT 编译器完成第一

次编译后，其会将字节码对应的机器码保存下来，下次可以直接使用。而我们知道，机器码的运行效率肯定是高于 Java 解释器的。这也解释了我们为什

么经常会说 Java 是编译与解释共存的语言。 

HotSpot 采用了惰性评估(Lazy Evaluation)的做法，根据二八定律，消耗大部分系统资源的只有那一小部分的代码（热点代码），而这也就是 JIT 所需要编译

的部分。JVM 会根据代码每次被执行的情况收集信息并相应地做出一些优化，

因此执行的次数越多，它的速度就越快。JDK 9 引入了一种新的编译模式

AOT(Ahead of Time Compilation)，它是直接将字节码编译成机器码，这样就

避免了 JIT 预热等各方面的开销。JDK 支持分层编译和 AOT 协作使用。但是 ，

AOT 编译器的编译质量是肯定比不上 JIT 编译器的。 

总结：Java 虚拟机（JVM）是运行 Java 字节码的虚拟机。JVM 有针对不同系

统的特定实现（Windows，Linux，macOS），目的是使用相同的字节码，它们

都会给出相同的结果。字节码和不同系统的 JVM 实现是 Java 语言“一次编译，随处可以运行”的关键所在。 

## JDK 和 JRE 

JDK 是 Java Development Kit，它是功能齐全的 Java SDK。它拥有 JRE 所拥有

的一切，还有编译器（javac）和工具（如 javadoc 和 jdb）。它能够创建和编译程序。 

JRE 是 Java 运行时环境。它是运行已编译 Java 程序所需的所有内容的集合，

包括 Java 虚拟机（JVM），Java 类库，java 命令和其他的一些基础构件。但是，它不能用于创建新程序。 

如果你只是为了运行一下 Java 程序的话，那么你只需要安装 JRE 就可以了。

如果你需要进行一些 Java 编程方面的工作，那么你就需要安装 JDK 了。但是，这不是绝对的。有时，即使您不打算在计算机上进行任何 Java 开发，仍然需要安装 JDK。例如，如果要使用 JSP 部署 Web 应用程序，那么从技术上讲，您只是在应用程序服务器中运行 Java 程序。那你为什么需要 JDK 呢？因为应用

程序服务器会将 JSP 转换为 Java servlet，并且需要使用 JDK 来编译 

servlet。 

# 4. Oracle JDK 和 OpenJDK 的对比 



可能在看这个问题之前很多人和我一样并没有接触和使用过 OpenJDK 。那么

Oracle 和 OpenJDK 之间是否存在重大差异？下面通过我通过我收集到一些资料对你解答这个被很多人忽视的问题。 

对于 Java 7，没什么关键的地方。OpenJDK 项目主要基于 Sun 捐赠的 HotSpot

源代码。此外，OpenJDK 被选为 Java 7 的参考实现，由 Oracle 工程师维护。

关于 JVM，JDK，JRE 和 OpenJDK 之间的区别，Oracle 博客帖子在 2012 年有一个更详细的答案： 

问：OpenJDK 存储库中的源代码与用于构建 Oracle JDK 的代码之间有什么区别？ 

答：非常接近 - 我们的 Oracle JDK 版本构建过程基于 OpenJDK 7 构建，只添

加了几个部分，例如部署代码，其中包括 Oracle 的 Java 插件和 Java WebStart 的实现，以及一些封闭的源代码派对组件，如图形光栅化器，一些开源的第三方组件，如 Rhino，以及一些零碎的东西，如附加文档或第三方字体。展望未

来，我们的目的是开源 Oracle JDK 的所有部分，除了我们考虑商业功能的部

分。 

总结： 

1.   Oracle JDK 版本将每三年发布一次，而 OpenJDK 版本每三个月发布一

次； 

2.   OpenJDK 是一个参考模型并且是完全开源的，而 Oracle JDK 是

OpenJDK 的一个实现，并不是完全开源的； 

3.   Oracle JDK 比 OpenJDK 更稳定。OpenJDK 和 Oracle JDK 的代码几乎相同，但 Oracle JDK 有更多的类和一些错误修复。因此，如果您想开发

企业/商业软件，我建议您选择 Oracle JDK，因为它经过了彻底的测试和稳定。某些情况下，有些人提到在使用 OpenJDK 可能会遇到了许多应用程序崩溃的问题，但是，只需切换到 Oracle JDK 就可以解决问题； 

4.   顶级公司正在使用 Oracle JDK，例如 Android Studio，Minecraft 和

IntelliJ IDEA 开发工具，其中 Open JDK 不太受欢迎； 

5. 在响应性和 JVM 性能方面，Oracle JDK 与 OpenJDK 相比提供了更好的性能； 

6. Oracle JDK 不会为即将发布的版本提供长期支持，用户每次都必须通过更新到最新版本获得支持来获取最新版本； 

7. Oracle JDK 根据二进制代码许可协议获得许可，而 OpenJDK 根据 GPL v2 许可获得许可。 

# 5. Java 和 C++的区别 



我知道很多人没学过 C++，但是面试官就是没事喜欢拿咱们 Java 和 C++ 比呀！没办法！！！就算没学过 C++，也要记下来！ 

•    都是面向对象的语言，都支持封装、继承和多态 

•    Java 不提供指针来直接访问内存，程序内存更加安全 

•    Java 的类是单继承的，C++ 支持多重继承；虽然 Java 的类不可以多

继承，但是接口可以多继承。 

•    Java 有自动内存管理机制，不需要程序员手动释放无用内存 

# **6.**   **什么是** **Java** **程序的主类** **应用程序和小程序的主类有何不同** 

一个程序中可以有多个类，但只能有一个类是主类。在 Java 应用程序中，这

个主类是指包含 main（）方法的类。而在 Java 小程序中，这个主类是一个继

承自系统类 JApplet 或 Applet 的子类。应用程序的主类不一定要求是 public 

类，但小程序的主类要求必须是 public 类。主类是 Java 程序执行的入口点。 

# **7.**   **Java** **应用程序与小程序之间有那些差别** 

简单说应用程序是从主线程启动(也就是 main() 方法)。applet 小程序没有

main 方法，主要是嵌在浏览器页面上运行(调用 init()线程或者 run()来启动)，嵌

入浏览器这点跟 flash 的小游戏类似。 

# **8.**   **字符型常量和字符串常量的区别** 



1.   形式上: 字符常量是单引号引起的一个字符 字符串常量是双引号引起的

若干个字符 

2.   含义上: 字符常量相当于一个整形值( ASCII 值),可以参加表达式运算 字符串常量代表一个地址值(该字符串在内存中存放位置) 

3.   占内存大小 字符常量只占 2 个字节 字符串常量占若干个字节(至少一个

字符结束标志) (**注意：** **char 在** **Java 中占两个字节**) 

java 编程思想第四版：2.2.2 节

![1](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/1Java基础面试题.assets/1.png)

# 9. 构造器 Constructor 是否可被 override 

在讲继承的时候我们就知道父类的私有属性和构造方法并不能被继承，所以 

Constructor 也就不能被 override（重写）,但是可以 overload（重载）,所以你可以看到一个类中有多个构造函数的情况。 

# **10.**   **重载和重写的区别** 

**重载：** 发生在同一个类中，方法名必须相同，参数类型不同、个数不同、顺序不同，方法返回值和访问修饰符可以不同，发生在编译时。 　　 

**重写：** 发生在父子类中，方法名、参数列表必须相同，返回值范围小于等于父类，抛出的异常范围小于等于父类，访问修饰符范围大于等于父类；如果父类方法访问修饰符为 private 则子类就不能重写该方法。 

# **11.**   **Java** **面向对象编程三大特性:** **封装** **继承** **多态** 

## 封装 

封装把一个对象的属性私有化，同时提供一些可以被外界访问的属性的方法，如果属性不想被外界访问，我们大可不必提供方法给外界访问。但是如果一个类没有提供给外界访问的方法，那么这个类也没有什么意义了。 

## 继承 

继承是使用已存在的类的定义作为基础建立新类的技术，新类的定义可以增加新的数据或新的功能，也可以用父类的功能，但不能选择性地继承父类。通过使用继承我们能够非常方便地复用以前的代码。**关于继承如下** **3 点请记住：** 

1.   子类拥有父类非 private 的属性和方法。 

2.   子类可以拥有自己属性和方法，即子类可以对父类进行扩展。 

3.   子类可以用自己的方式实现父类的方法。（以后介绍）。 

## 多态 

所谓多态就是指程序中定义的引用变量所指向的具体类型和通过该引用变量发出的方法调用在编程时并不确定，而是在程序运行期间才确定，即一个引用变量倒底会指向哪个类的实例对象，该引用变量发出的方法调用到底是哪个类中实现的方法，必须在由程序运行期间才能决定。 

在 Java 中有两种形式可以实现多态：继承（多个子类对同一方法的重写）和接口（实现接口并覆盖接口中同一方法）。 

# 12. String StringBuffer 和 StringBuilder 的区别是什么 String 为什么是不可变的 

**可变性** 　 

简单的来说：String 类中使用 final 关键字字符数组保存字符串，private　

final　char　value[]，所以 String 对象是不可变的。而 StringBuilder 与 

StringBuffer 都继承自 AbstractStringBuilder 类，在 AbstractStringBuilder 中

也是使用字符数组保存字符串char[]value 但是没有用 final 关键字修饰，所以这两种对象都是可变的。 

StringBuilder 与 StringBuffer 的构造方法都是调用父类构造方法也就是 AbstractStringBuilder 实现的，大家可以自行查阅源码。 

AbstractStringBuilder.java 

```
abstract class AbstractStringBuilder implements Appendable, CharSequence {     char[] value;     
	int count; 
    AbstractStringBuilder() { 
    } 
    AbstractStringBuilder(int capacity) {         
    value = new char[capacity]; 
    } 
```

**线程安全性** 

String 中的对象是不可变的，也就可以理解为常量，线程安全。

AbstractStringBuilder 是 StringBuilder 与 StringBuffer 的公共父类，定义了一些字符串的基本操作，如 expandCapacity、append、insert、indexOf 等公共方法。StringBuffer 对方法加了同步锁或者对调用的方法加了同步锁，所以是线程安全的。StringBuilder 并没有对方法进行加同步锁，所以是非线程安全的。 　　**性能** 

每次对 String 类型进行改变的时候，都会生成一个新的 String 对象，然后将指针指向新的 String 对象。StringBuffer 每次都会对 StringBuffer 对象本身进行操作，而不是生成新的对象并改变对象引用。相同情况下使用 

StringBuilder 相比使用 StringBuffer 仅能获得 10%~15% 左右的性能提升，但却要冒多线程不安全的风险。**对于三者使用的总结：** 

1. 操作少量的数据 = String 

2. 单线程操作字符串缓冲区下操作大量数据 = StringBuilder 

3. 多线程操作字符串缓冲区下操作大量数据 = StringBuffer 

# **13.**   **自动装箱与拆箱** 

**装箱**：将基本类型用它们对应的引用类型包装起来；**拆箱**：将包装类型转换为基本数据类型； 

# **14.**   **在一个静态方法内调用一个非静态成员为什么是非法的** 

由于静态方法可以不通过对象进行调用，因此在静态方法里，不能调用其他非静态变量，也不可以访问非静态变量成员。 

# **15.**   **在** **Java** **中定义一个不做事且没有参数的构造方法的作用** 

　Java 程序在执行子类的构造方法之前，如果没有用 super() 来调用父类特定的构造方法，则会调用父类中“没有参数的构造方法”。因此，如果父类中只定义了有参数的构造方法，而在子类的构造方法中又没有用 super() 来调用父类

中特定的构造方法，则编译时将发生错误，因为 Java 程序在父类中找不到没有参数的构造方法可供执行。解决办法是在父类里加上一个不做事且没有参数的构造方法。 　 

# 16. import java 和 javax 有什么区别 

刚开始的时候 JavaAPI 所必需的包是 java 开头的包，javax 当时只是扩展 

API 包来说使用。然而随着时间的推移，javax 逐渐的扩展成为 Java API 的组

成部分。但是，将扩展从 javax 包移动到 java 包将是太麻烦了，最终会破坏

一堆现有的代码。因此，最终决定 javax 包将成为标准 API 的一部分。 

所以，实际上 java 和 javax 没有区别。这都是一个名字。 

# **17.**   **接口和抽象类的区别是什么** 

1. 接口的方法默认是 public，所有方法在接口中不能有实现(Java 8 开始

接口方法可以有默认实现），抽象类可以有非抽象的方法 

2.   接口中的实例变量默认是 final 类型的，而抽象类中则不一定 

3.   一个类可以实现多个接口，但最多只能实现一个抽象类 

4.   一个类实现接口的话要实现接口的所有方法，而抽象类不一定 

5.   接口不能用 new 实例化，但可以声明，但是必须引用一个实现该接口的对象 从设计层面来说，抽象是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。 

# **18.**   **成员变量与局部变量的区别有那些** 

1.   从语法形式上，看成员变量是属于类的，而局部变量是在方法中定义的变量或是方法的参数；成员变量可以被 public,private,static 等修饰符所

修饰，而局部变量不能被访问控制修饰符及 static 所修饰；但是，成员

变量和局部变量都能被 final 所修饰； 

2. 从变量在内存中的存储方式来看，成员变量是对象的一部分，而对象存在于堆内存，局部变量存在于栈内存 

3. 从变量在内存中的生存时间上看，成员变量是对象的一部分，它随着对象的创建而存在，而局部变量随着方法的调用而自动消失。 

4. 成员变量如果没有被赋初值，则会自动以类型的默认值而赋值（一种情况例外被 final 修饰的成员变量也必须显示地赋值）；而局部变量则不

会自动赋值。 

# **19.**   **创建一个对象用什么运算符?对象实体与对象引用有何不同?** 

new 运算符，new 创建对象实例（对象实例在堆内存中），对象引用指向对象实例（对象引用存放在栈内存中）。一个对象引用可以指向 0 个或 [[1\]](#_ftn1) 个对象

（一根绳子可以不系气球，也可以系一个气球）;一个对象可以有 n 个引用指向

它（可以用 n 条绳子系住一个气球）。 



------

[[1\]](#_ftnref1) . 名字与类名相同； 

# **20.**   **什么是方法的返回值?返回值在类的方法里的作用是什么?** 

方法的返回值是指我们获取到的某个方法体中的代码执行后产生的结果！（前提是该方法可能产生结果）。返回值的作用:接收出结果，使得它可以用于其他的操作！ 

# **21.**   **一个类的构造方法的作用是什么** **若一个类没有声明构造方法,该程序能正确执行吗** **?为什么?** 

主要作用是完成对类对象的初始化工作。可以执行。因为一个类即使没有声明构造方法也会有默认的不带参数的构造方法。 

# **22.**   **构造方法有哪些特性** 

1. 名字与类名相同

2. 没有返回值，但不能用 void 声明构造函数； 

3. 生成类的对象时自动执行，无需调用。 

# **23.**   **静态方法和实例方法有何不同** 

1. 在外部调用静态方法时，可以使用"类名.方法名"的方式，也可以使用"对

象名.方法名"的方式。而实例方法只有后面这种方式。也就是说，调用

静态方法可以无需创建对象。 

2. 静态方法在访问本类的成员时，只允许访问静态成员（即静态成员变量和静态方法），而不允许访问实例成员变量和实例方法；实例方法则无此限制. 

# **24.**   **对象的相等与指向他们的引用相等，两者有什么不同？** 

对象的相等，比的是内存中存放的内容是否相等。而引用相等，比较的是他们指向的内存地址是否相等。 

# **25.**   **在调用子类构造方法之前会先调用父类没有参数的构造方法，其目的是?** 

帮助子类做初始化工作。 

# 26. == 与 equals(重要) 

**==** : 它的作用是判断两个对象的地址是不是相等。即，判断两个对象是不是同

一个对象。(基本数据类型==比较的是值，引用数据类型==比较的是内存地址) 

**equals()** : 它的作用也是判断两个对象是否相等。但它一般有两种使用情况： 

•    情况 1：类没有覆盖 equals() 方法。则通过 equals() 比较该类的两个

对象时，等价于通过“==”比较这两个对象。 

•    情况 2：类覆盖了 equals() 方法。一般，我们都覆盖 equals() 方法来

两个对象的内容相等；若它们的内容相等，则返回 true (即，认为这两

个对象相等)。 

**举个例子：** 

```
public class test1 { 
    public static void main(String[] args) {     
    String a = new String("ab"); // a 为一个引用 
        String b = new String("ab"); // b为另一个引用,对象的内容一样 
        String aa = "ab"; // 放在常量池中        
        String bb = "ab"; // 从常量池中查找       
        if (aa == bb) // true 
            System.out.println("aa==bb");       
            if (a == b) // false，非同一对象   
            System.out.println("a==b");      
            if (a.equals(b)) // true      
            System.out.println("aEQb");        
            if (42 == 42.0) { // true      
            System.out.println("true"); 
        } 
    } 
} 

```

**说明：** 

•    String 中的 equals 方法是被重写过的，因为 object 的 equals 方法是

比较的对象的内存地址，而 String 的 equals 方法比较的是对象的值。 

•    当创建 String 类型的对象时，虚拟机会在常量池中查找有没有已经存

在的值和要创建的值相同的对象，如果有就把它赋给当前引用。如果没有就在常量池中重新创建一个 String 对象。 

# 27. hashCode 与 equals（重要） 

面试官可能会问你：“你重写过 hashcode 和 equals 么，为什么重写 equals

时必须重写 hashCode 方法？” 

## hashCode（）介绍 

hashCode() 的作用是获取哈希码，也称为散列码；它实际上是返回一个 int 整数。这个哈希码的作用是确定该对象在哈希表中的索引位置。hashCode() 定义

在 JDK 的 Object.java 中，这就意味着 Java 中的任何类都包含有 hashCode() 函数。 

散列表存储的是键值对(key-value)，它的特点是：能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码！（可以快速找到所需要的对象） 

## 为什么要有 hashCode 

**我们以“HashSet 如何检查重复”为例子来说明为什么要有** **hashCode：** 

当你把对象加入 HashSet 时，HashSet 会先计算对象的 hashcode 值来判断

对象加入的位置，同时也会与其他已经加入的对象的 hashcode 值作比较，如

果没有相符的 hashcode，HashSet 会假设对象没有重复出现。但是如果发现有

相同 hashcode 值的对象，这时会调用 equals（）方法来检查 hashcode 相等的对象是否真的相同。如果两者相同，HashSet 就不会让其加入操作成功。

如果不同的话，就会重新散列到其他位置。（摘自我的 Java 启蒙书《Head 

first java》第二版）。这样我们就大大减少了 equals 的次数，相应就大大提高了执行速度。 

## hashCode（）与 equals（）的相关规定 

1. 如果两个对象相等，则 hashcode 一定也是相同的 

2. 两个对象相等,对两个对象分别调用 equals 方法都返回 true 

3. 两个对象有相同的 hashcode 值，它们也不一定是相等的 

4. **因此，equals 方法被覆盖过，则** **hashCode 方法也必须被覆盖** 

5. hashCode() 的默认行为是对堆上的对象产生独特值。如果没有重写 hashCode()，则该 class 的两个对象无论如何都不会相等（即使这两个对象指向相同的数据） 

# **28.**   **为什么** **Java** **中只有值传递** 



# **29.**   **简述线程，程序、进程的基本概念。以及他们之间关系是什么** 

**线程**与进程相似，但线程是一个比进程更小的执行单位。一个进程在其执行的过程中可以产生多个线程。与进程不同的是同类的多个线程共享同一块内存空间和一组系统资源，所以系统在产生一个线程，或是在各个线程之间作切换工作时，负担要比进程小得多，也正因为如此，线程也被称为轻量级进程。 

**程序**是含有指令和数据的文件，被存储在磁盘或其他的数据存储设备中，也就是说程序是静态的代码。 

**进程**是程序的一次执行过程，是系统运行程序的基本单位，因此进程是动态的。系统运行一个程序即是一个进程从创建，运行到消亡的过程。简单来说，一个进程就是一个执行中的程序，它在计算机中一个指令接着一个指令地执行着，同时，每个进程还占有某些系统资源如 CPU 时间，内存空间，文件，文件，输入输出设备的使用权等等。换句话说，当程序在执行时，将会被操作系统载入内存中。 线程是进程划分成的更小的运行单位。线程和进程最大的不同在于基本上各进程是独立的，而各线程则不一定，因为同一进程中的线程极有可能会相互影响。从另一角度来说，进程属于操作系统的范畴，主要是同一段时间内，可以同时执行一个以上的程序，而线程则是在同一程序内几乎同时执行一个以上的程序段。 

# **30.**   **线程有哪些基本状态?** 

参考《Java 并发编程艺术》4.1.4 节。 

Java 线程在运行的生命周期中的指定时刻只可能处于下面 6 种不同状态的其中一个状态。 

线程在生命周期中并不是固定处于某一个状态而是随着代码的执行在不同状态之间切换。Java 线程状态变迁如下图所示： 

# **31** **关于** **final** **关键字的一些总结** 


final 关键字主要用在三个地方：变量、方法、类。 

1. 对于一个 final 变量，如果是基本数据类型的变量，则其数值一旦在初始化之后便不能更改；如果是引用类型的变量，则在对其初始化之后便不能再让其指向另一个对象。 

2. 当用 final 修饰一个类时，表明这个类不能被继承。final 类中的所有成员方法都会被隐式地指定为 final 方法。 

3. 使用 final 方法的原因有两个。第一个原因是把方法锁定，以防任何继承类修改它的含义；第二个原因是效率。在早期的 Java 实现版本中，会将final 方法转为内嵌调用。但是如果方法过于庞大，可能看不到内嵌调用带来的任何性能提升（现在的 Java 版本已经不需要使用 final 方法进行这些优化了）。类中所有的 private 方法都隐式地指定为 final。 

# 32 Java 中的异常处理 

## Java 异常类层次结构图 

![2](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/1Java基础面试题.assets/2.jpg)

 在 Java 中，所有的异常都有一个共同的祖先 java.lang 包中的 **Throwable类**。Throwable： 有两个重要的子类：**Exception（异常）** 和 **Error（错误）** ，二者都是 Java 异常处理的重要子类，各自都包含大量子类。 

**Error（错误）:是程序无法处理的错误**，表示运行应用程序中较严重问题。大多数错误与代码编写者执行的操作无关，而表示代码运行时 JVM（Java 虚拟机）出现的问题。例如，Java 虚拟机运行错误（Virtual MachineError），当 JVM 不再有继续执行操作所需的内存资源时，将出现 OutOfMemoryError。这些异常发生时，Java 虚拟机（JVM）一般会选择线程终止。 

这些错误表示故障发生于虚拟机自身、或者发生在虚拟机试图执行应用时，如Java 虚拟机运行错误（Virtual MachineError）、类定义错误（NoClassDefFoundError）等。这些错误是不可查的，因为它们在应用程序的控制和处理能力之 外，而且绝大多数是程序运行时不允许出现的状况。对于设计合理的应用程序来说，即使确实发生了错误，本质上也不应该试图去处理它所引起的异常状况。在 Java 中，错误通过 Error 的子类描述。 

**Exception（异常）:是程序本身可以处理的异常**。Exception 类有一个重要的子类**RuntimeException**。RuntimeException 异常由 Java 虚拟机抛出。

**NullPointerException**（要访问的变量没有引用任何对象时，抛出该异常）、**ArithmeticException**（算术运算异常，一个整数除以 0 时，抛出该异常）和 **ArrayIndexOutOfBoundsException** （下标越界异常）。 

**注意：异常和错误的区别：异常能被程序本身可以处理，错误是无法处理。** 

## Throwable 类常用方法 

•    **public string getMessage()**:返回异常发生时的详细信息 

•    **public string toString()**:返回异常发生时的简要描述 

•    **public string getLocalizedMessage()**:返回异常对象的本地化信息。使用 Throwable 的子类覆盖这个方法，可以声称本地化信息。如果子类没有覆盖该方法，则该方法返回的信息与 getMessage（）返回的结果相同 

•    **public void printStackTrace()**:在控制台上打印 Throwable 对象封装的异常信息 

### 异常处理总结 

•    try 块：用于捕获异常。其后可接零个或多个 catch 块，如果没有 catch

块，则必须跟一个 finally 块。 

•    catch 块：用于处理 try 捕获到的异常。 

•    finally 块：无论是否捕获或处理异常，finally 块里的语句都会被执行。

当在 try 块或 catch 块中遇到 return 语句时，finally 语句块将在方法返回之前被执行。**在以下** **4 种特殊情况下，finally 块不会被执行：** 

1.   在 finally 语句块中发生了异常。 

2.   在前面的代码中用了 System.exit()退出程序。 

3.   程序所在的线程死亡。 

4.   关闭 CPU。 

# **33**   **Java** **序列化中如果有些字段不想进行序列化** **怎么办** 

对于不想进行序列化的变量，使用 transient 关键字修饰。 

transient 关键字的作用是：阻止实例中那些用此关键字修饰的的变量序列化；当对象被反序列化时，被 transient 修饰的变量值不会被持久化和恢复。 transient 只能修饰变量，不能修饰类和方法。 

# **34**   **获取用键盘输入常用的的两种方法** 

方法 1：通过 Scanner 

`Scanner input = new Scanner(System.in); `

 `String s = input.nextLine(); input.close(); `

方法 2：通过 BufferedReader 

`BufferedReader input = new BufferedReader(new InputStreamReader(System.in));  `

  `String s = input.readLine();  `