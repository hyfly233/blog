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

- default: 默认访问修饰符，在同一包内可见
- private: 在同一类内可见，不能修饰类
- protected : 对同一包内的类和所有子类可见，不能修饰类
- public: 对所有类可见

### 构造方法、成员变量初始化以及静态成员变量三者的初始化顺序？

先后顺序：静态成员变量、成员变量、构造方法。

详细的先后顺序：父类静态变量、父类静态代码块、子类静态变量、子类静态代码块、父类非静态变量、父类非静态代码块、父类构造函数、子类非静态变量、子类非静态代码块、子类构造函数。

### Java 代码块执行顺序

- 父类静态代码块（只执行一次）
- 子类静态代码块（只执行一次）
- 父类构造代码块
- 父类构造函数
- 子类构造代码块
- 子类构造函数
- 普通代码块

### 面向对象的三大特性？

继承：对象的一个新类可以从现有的类中派生，派生类可以从它的基类那继承方法和实例变量，且派生类可以修改或新增新的方法使之更适合特殊的需求。

封装：将客观事物抽象成类，每个类可以把自身数据和方法只让可信的类或对象操作，对不可信的进行信息隐藏。

多态：允许不同类的对象对同一消息作出响应。不同对象调用相同方法即使参数也相同，最终表现行为是不一样的。

### 为什么 Java 语言不支持多重继承？

为了程序的结构能够更加清晰从而便于维护。假设 Java 语言支持多重继承，类 C 继承自类 A 和类 B，如果类 A 和 B 都有自定义的成员方法 `f()`，那么当代码中调用类 C 的 `f()` 会产生二义性。

Java 语言通过实现多个接口间接支持多重继承，接口由于只包含方法定义，不能有方法的实现，类 C 继承接口 A 与接口 B 时即使它们都有方法`f()`，也不能直接调用方法，需实现具体的`f()`方法才能调用，不会产生二义性。

多重继承会使类型转换、构造方法的调用顺序变得复杂，会影响到性能。

### 简述 Java 的多态

Java 多态可以分为编译时多态和运行时多态。

编译时多态主要指方法的重载，即通过参数列表的不同来区分不同的方法。

运行时多态主要指继承父类和实现接口时，可使用父类引用指向子类对象。

运行时多态的实现：主要依靠方法表，方法表中最先存放的是 Object 类的方法，接下来是该类的父类的方法，最后是该类本身的方法。如果子类改写了父类的方法，那么子类和父类的那些同名方法共享一个方法表项，都被认作是父类的方法。因此可以实现运行时多态。

### Java 提供的多态机制？

Java 提供了两种用于多态的机制，分别是重载与覆盖。

重载：重载是指同一个类中有多个同名的方法，但这些方法有不同的参数，在编译期间就可以确定调用哪个方法。

覆盖：覆盖是指派生类重写基类的方法，使用基类指向其子类的实例对象，或接口的引用变量指向其实现类的实例对象，在程序调用的运行期根据引用变量所指的具体实例对象调用正在运行的那个对象的方法，即需要到运行期才能确定调用哪个方法。

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
- 当子类和父类之间存在逻辑上的层次结构，推荐使用抽象类，有利于功能的累积。当功能不需要，希望支持差别较大的两个或更多对象间的特定交互行为，推荐使用接口。使用接口能降低软件系统的耦合度，便于日后维护或添加删除方法。

### 简述抽象类与接口的区别

抽象类：体现的是 is-a 的关系，如对于 man is a person，就可以将 person 定义为抽象类。

接口：体现的是 can 的关系。是作为模板实现的。如设置接口 fly，plane 类和 bird 类均可实现该接口。

一个类只能继承一个抽象类，但可以实现多个接口。

### 简述内部类及其作用

- 成员内部类：作为成员对象的内部类。可以访问 private 及以上外部类的属性和方法。外部类想要访问内部类属性或方法时，必须要创建一个内部类对象，然后通过该对象访问内部类的属性或方法。外部类也可访问 private 修饰的内部类属性。
- 局部内部类：存在于方法中的内部类。访问权限类似局部变量，只能访问外部类的 final 变量。
- 匿名内部类：只能使用一次，没有类名，只能访问外部类的 final 变量。
- 静态内部类：类似类的静态成员变量。

### Java 语言中关键字 static 的作用是什么？

static 的主要作用有两个：

- 为某种特定数据类型或对象分配与创建对象个数无关的单一的存储空间。
- 使得某个方法或属性与类而不是对象关联在一起，即在不创建对象的情况下可通过类直接调用方法或使用类的属性。

具体而言 static 又可分为 4 种使用方式：

- 修饰成员变量。用 static 关键字修饰的静态变量在内存中只有一个副本。只要静态变量所在的类被加载，这个静态变量就会被分配空间，可以使用“类.静态变量”和“对象.静态变量”的方法使用。
- 修饰成员方法。static 修饰的方法无需创建对象就可以被调用。static 方法中不能使用 this 和 super 关键字，不能调用非 static 方法，只能访问所属类的静态成员变量和静态成员方法。
- 修饰代码块。JVM 在加载类的时候会执行 static 代码块。static 代码块常用于初始化静态变量。static 代码块只会被执行一次。
- 修饰内部类。static 内部类可以不依赖外部类实例对象而被实例化。静态内部类不能与外部类有相同的名字，不能访问普通成员变量，只能访问外部类中的静态成员和静态成员方法。

### 为什么要把 String 设计为不可变？

- 节省空间：字符串常量存储在 JVM 的字符串池中可以被用户共享。
- 提高效率：String 可以被不同线程共享，是线程安全的。在涉及多线程操作中不需要同步操作。
- 安全：String 常被用于用户名、密码、文件名等使用，由于其不可变，可避免黑客行为对其恶意修改。

### 简述 String/StringBuffer 与 StringBuilder

String 类采用利用 final 修饰的字符数组进行字符串保存，因此不可变。如果对 String 类型对象修改，需要新建对象，将老字符和新增加的字符一并存进去。

StringBuilder，采用无 final 修饰的字符数组进行保存，因此可变。但线程不安全。

StringBuffer，采用无 final 修饰的字符数组进行保存，可理解为实现线程安全的 StringBuilder。

### 判等运算符==与 equals 的区别？

== 比较的是引用，equals 比较的是内容。

如果变量是基础数据类型，== 用于比较其对应值是否相等。如果变量指向的是对象，== 用于比较两个对象是否指向同一块存储空间。

equals 是 Object 类提供的方法之一，每个 Java 类都继承自 Object 类，所以每个对象都具有 equals 这个方法。Object 类中定义的 equals 方法内部是直接调用 == 比较对象的。但通过覆盖的方法可以让它不是比较引用而是比较数据内容。

### 简述 Object 类常用方法

- hashCode：通过对象计算出的散列码。用于 map 型或 equals 方法。需要保证同一个对象多次调用该方法，总返回相同的整型值。
- equals：判断两个对象是否一致。需保证 equals 方法相同对应的对象 hashCode 也相同。
- toString: 用字符串表示该对象
- clone:深拷贝一个对象

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

其中 type 为基本数据类型或类，arrayName 为数组名字

### 简述 Java 异常的分类

Java 异常分为 Error（程序无法处理的错误），和 Exception（程序本身可以处理的异常）。这两个类均继承 Throwable。

Error 常见的有 StackOverFlowError、OutOfMemoryError 等等。

Exception 可分为运行时异常和非运行时异常。对于运行时异常，可以利用 try catch 的方式进行处理，也可以不处理。对于非运行时异常，必须处理，不处理的话程序无法通过编译。

### 简述 throw 与 throws 的区别

throw 一般是用在方法体的内部，由开发者定义当程序语句出现问题后主动抛出一个异常。

throws 一般用于方法声明上，代表该方法可能会抛出的异常列表。

### 出现在 Java 程序中的 finally 代码块是否一定会执行？

当遇到下面情况不会执行。

- 当程序在进入 try 语句块之前就出现异常时会直接结束。
- 当程序在 try 块中强制退出时，如使用 System.exit(0)，也不会执行 finally 块中的代码。

其它情况下，在 try/catch/finally 语句执行的时候，try 块先执行，当有异常发生，catch 和 finally 进行处理后程序就结束了，当没有异常发生，在执行完 finally 中的代码后，后面代码会继续执行。值得注意的是，当 try/catch 语句块中有 return 时，finally 语句块中的代码会在 return 之前执行。如果 try/catch/finally 块中都有 return 语句，finally 块中的 return 语句会覆盖 try/catch 模块中的 return 语句。

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

### 简述 Java 的 List

List 是一个有序队列，在 Java 中有两种实现方式:

ArrayList 使用数组实现，是容量可变的非线程安全列表，随机访问快，集合扩容时会创建更大的数组，把原有数组复制到新数组。

LinkedList 本质是双向链表，与 ArrayList 相比插入和删除速度更快，但随机访问元素很慢。

### Java 中线程安全的基本数据结构有哪些

- HashTable: 哈希表的线程安全版，效率低
- ConcurrentHashMap：哈希表的线程安全版，效率高，用于替代 HashTable
- Vector：线程安全版 Arraylist
- Stack：线程安全版栈
- BlockingQueue 及其子类：线程安全版队列

### 简述 Java 的 Set

Set 即集合，该数据结构不允许元素重复且无序。Java 对 Set 有三种实现方式：

HashSet 通过 HashMap 实现，HashMap 的 Key 即 HashSet 存储的元素，Value 系统自定义一个名为 PRESENT 的 Object 类型常量。判断元素是否相同时，先比较 hashCode，相同后再利用 equals 比较，查询 O(1)

LinkedHashSet 继承自 HashSet，通过 LinkedHashMap 实现，使用双向链表维护元素插入顺序。

TreeSet 通过 TreeMap 实现的，底层数据结构是红黑树，添加元素到集合时按照比较规则将其插入合适的位置，保证插入后的集合仍然有序。查询 O(logn)

### 简述 Java 的 HashMap

JDK8 之前底层实现是数组 + 链表，JDK8 改为数组 + 链表/红黑树。主要成员变量包括存储数据的 table 数组、元素数量 size、加载因子 loadFactor。HashMap 中数据以键值对的形式存在，键对应的 hash 值用来计算数组下标，如果两个元素 key 的 hash 值一样，就会发生哈希冲突，被放到同一个链表上。

table 数组记录 HashMap 的数据，每个下标对应一条链表，所有哈希冲突的数据都会被存放到同一条链表，Node/Entry 节点包含四个成员变量：key、value、next 指针和 hash 值。在 JDK8 后链表超过 8 会转化为红黑树。

若当前数据/总数据容量>负载因子，Hashmap 将执行扩容操作。默认初始化容量为 16，扩容容量必须是 2 的幂次方、最大容量为 1<< 30 、默认加载因子为 0.75。

### 为何 HashMap 线程不安全

在 JDK1.7 中，HashMap 采用头插法插入元素，因此并发情况下会导致环形链表，产生死循环。

虽然 JDK1.8 采用了尾插法解决了这个问题，但是并发下的 put 操作也会使前一个 key 被后一个 key 覆盖。

由于 HashMap 有扩容机制存在，也存在 A 线程进行扩容后，B 线程执行 get 方法出现失误的情况。

### 简述 Java 的 TreeMap

TreeMap 是底层利用红黑树实现的 Map 结构，底层实现是一棵平衡的排序二叉树，由于红黑树的插入、删除、遍历时间复杂度都为 O(logN)，所以性能上低于哈希表。但是哈希表无法提供键值对的有序输出，红黑树可以按照键的值的大小有序输出。

### ArrayList、Vector 和 LinkedList 有什么共同点与区别？

- ArrayList、Vector 和 LinkedList 都是可伸缩的数组，即可以动态改变长度的数组。
- ArrayList 和 Vector 都是基于存储元素的 Object[] array 来实现的，它们会在内存中开辟一块连续的空间来存储，支持下标、索引访问。但在涉及插入元素时可能需要移动容器中的元素，插入效率较低。当存储元素超过容器的初始化容量大小，ArrayList 与 Vector 均会进行扩容。
- Vector 是线程安全的，其大部分方法是直接或间接同步的。ArrayList 不是线程安全的，其方法不具有同步性质。LinkedList 也不是线程安全的。
- LinkedList 采用双向列表实现，对数据索引需要从头开始遍历，因此随机访问效率较低，但在插入元素的时候不需要对数据进行移动，插入效率较高。

### HashMap 和 Hashtable 有什么区别？

- HashMap 是 Hashtable 的轻量级实现，HashMap 允许 key 和 value 为 null，但最多允许一条记录的 key 为 null.而 HashTable 不允许。
- HashTable 中的方法是线程安全的，而 HashMap 不是。在多线程访问 HashMap 需要提供额外的同步机制。
- Hashtable 使用 Enumeration 进行遍历，HashMap 使用 Iterator 进行遍历。

### 如何决定使用 HashMap 还是 TreeMap?

如果对 Map 进行插入、删除或定位一个元素的操作更频繁，HashMap 是更好的选择。如果需要对 key 集合进行有序的遍历，TreeMap 是更好的选择。

### HashSet 中，equals 与 hashCode 之间的关系？

equals 和 hashCode 这两个方法都是从 object 类中继承过来的，equals 主要用于判断对象的内存地址引用是否是同一个地址；hashCode 根据定义的哈希规则将对象的内存地址转换为一个哈希码。HashSet 中存储的元素是不能重复的，主要通过 hashCode 与 equals 两个方法来判断存储的对象是否相同：

- 如果两个对象的 hashCode 值不同，说明两个对象不相同。
- 如果两个对象的 hashCode 值相同，接着会调用对象的 equals 方法，如果 equlas 方法的返回结果为 true，那么说明两个对象相同，否则不相同。

### fail-fast 和 fail-safe 迭代器的区别是什么？

- fail-fast 直接在容器上进行，在遍历过程中，一旦发现容器中的数据被修改，就会立刻抛出 ConcurrentModificationException 异常从而导致遍历失败。常见的使用 fail-fast 方式的容器有 HashMap 和 ArrayList 等。
- fail-safe 这种遍历基于容器的一个克隆。因此对容器中的内容修改不影响遍历。常见的使用 fail-safe 方式遍历的容器有 ConcurrentHashMap 和 CopyOnWriteArrayList。

### Collection 和 Collections 有什么区别？

- Collection 是一个集合接口，它提供了对集合对象进行基本操作的通用接口方法，所有集合都是它的子类，比如 List、Set 等。
- Collections 是一个包装类，包含了很多静态方法、不能被实例化，而是作为工具类使用，比如提供的排序方法：Collections.sort(list);提供的反转方法：Collections.reverse(list)。





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

## 7.arrayList 和 linkedList 的区别？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-04.png)

- 1.ArrayList 是实现了基于**数组**的，存储空间是连续的。LinkedList 基于**链表**的，存储空间是不连续的。（LinkedList 是双向链表）
- 2.对于**随机访问** get 和 set ，ArrayList 觉得优于 LinkedList，因为 LinkedList 要移动指针。
- 3.对于**新增和删除**操作 add 和 remove ，LinedList 比较占优势，因为 ArrayList 要移动数据。
- 4.同样的数据量 LinkedList 所占用空间可能会更小，因为 ArrayList 需要**预留空间**便于后续数据增加，而 LinkedList 增加数据只需要**增加一个节点**

## 8.hashMap 1.7 和 hashMap 1.8 的区别？

只记录**重点**

| 不同点          |          hashMap 1.7           |                    hashMap 1.8 |
| :-------------- | :----------------------------: | -----------------------------: |
| 数据结构        |           数组+链表            |               数组+链表+红黑树 |
| 插入数据的方式  |             头插法             |                         尾插法 |
| hash 值计算方式 | 9次扰动处理(4次位运算+5次异或) | 2次扰动处理(1次位运算+1次异或) |
| 扩容策略        |           插入前扩容           |                     插入后扩容 |

## 9.hashMap 线程不安全体现在哪里？

在 **hashMap1.7 中扩容**的时候，因为采用的是头插法，所以会可能会有循环链表产生，导致数据有问题，在 1.8 版本已修复，改为了尾插法

在任意版本的 hashMap 中，如果在**插入数据时多个线程命中了同一个槽**，可能会有数据覆盖的情况发生，导致线程不安全。

## 10.那么 hashMap 线程不安全怎么解决？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-05.png)

- 一.给 hashMap **直接加锁**,来保证线程安全
- 二.使用 **hashTable**,比方法一效率高,其实就是在其方法上加了 synchronized 锁
- 三.使用 **concurrentHashMap** , 不管是其 1.7 还是 1.8 版本,本质都是**减小了锁的粒度,减少线程竞争**来保证高效.

## 11.concurrentHashMap 1.7 和 1.8 有什么区别

只记录**重点**

| 不同点   |    concurrentHashMap 1.7     |              concurrentHashMap 1.8 |
| :------- | :--------------------------: | ---------------------------------: |
| 锁粒度   |         基于segment          |                      基于entry节点 |
| 锁       |        reentrantLock         |                       synchronized |
| 底层结构 | Segment + HashEntry + Unsafe | Synchronized + CAS + Node + Unsafe |

## 12.介绍一下 hashset 吧

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-06.png)

上图是 set 家族整体的结构，

set 继承于 Collection 接口，是一个**不允许出现重复元素，并且无序的集合**.

HashSet 是**基于 HashMap 实现**的，底层**采用 HashMap 来保存元素**

元素的哈希值是通过元素的 hashcode 方法 来获取的, HashSet 首先判断两个元素的哈希值，如果哈希值一样，接着会比较 equals 方法 如果 equls 结果为 true ，HashSet 就视为同一个元素。如果 equals 为 false 就不是同一个元素。

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

## 18.Integer a = 1000，Integer b = 1000，a==b 的结果是什么？那如果 a，b 都为1，结果又是什么？

Integer a = 1000，Integer b = 1000，a==b 结果为**false**

Integer a = 1，Integer b = 1，a==b 结果为**true**

这道题主要考察 Integer 包装类缓存的范围,**在-128~127之间会缓存起来**,比较的是直接缓存的数据,在此之外比较的是对象

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

## 22.volatile 有什么作用

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-09.png)

- 1.

  保证内存可见性

  - 当一个被volatile关键字修饰的变量被一个线程修改的时候，其他线程可以立刻得到修改之后的结果。当一个线程向被volatile关键字修饰的变量**写入数据**的时候，虚拟机会**强制它被值刷新到主内存中**。当一个线程**读取**被volatile关键字修饰的值的时候，虚拟机会**强制要求它从主内存中读取**。

- 2.

  禁止指令重排序

  - 指令重排序是编译器和处理器为了高效对程序进行优化的手段，cpu 是与内存交互的，而 cpu 的效率想比内存高很多，所以 cpu 会在不影响最终结果的情况下，不等待返回结果直接进行后续的指令操作，而 volatile 就是给相应代码加了**内存屏障**，在屏障内的代码禁止指令重排序。

## 23.怎么保证线程安全？

- 1.synchronized关键字
  - 可以用于代码块，方法（静态方法，同步锁是当前字节码对象；实例方法，同步锁是实例对象）
- 2.lock锁机制



```text
Lock lock = new ReentrantLock();
lock. lock();
try {
    System. out. println("获得锁");
} catch (Exception e) {
   
} finally {
    System. out. println("释放锁");
    lock. unlock();
}
```

## 24.synchronized 锁升级的过程

在 Java1.6 之前的版本中，synchronized 属于重量级锁，效率低下，**锁是** cpu 一个**总量级的资源**，每次获取锁都要和 cpu 申请，非常消耗性能。

在 **jdk1.6 之后** Java 官方对从 JVM 层面对 synchronized 较大优化，所以现在的 synchronized 锁效率也优化得很不错了，Jdk1.6 之后，为了减少获得锁和释放锁所带来的性能消耗，引入了偏向锁和轻量级锁，**增加了锁升级的过程**，由无锁->偏向锁->自旋锁->重量级锁 ![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-10.png)

增加锁升级的过程主要是**减少用户态到核心态的切换，提高锁的效率，从 jvm 层面优化锁**

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

## 26.聊聊 ReentrantLock 吧

ReentrantLock 意为**可重入锁**，说起 ReentrantLock 就不得不说 AQS ，因为其底层就是**使用 AQS 去实现**的。

ReentrantLock有两种模式，一种是公平锁，一种是非公平锁。

- 公平模式下等待线程入队列后会严格按照队列顺序去执行
- 非公平模式下等待线程入队列后有可能会出现插队情况

**公平锁**

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-12.png)

- 第一步：

  获取状态的 state 的值

  - 如果 state=0 即代表锁没有被其它线程占用，执行第二步。
  - 如果 state!=0 则代表锁正在被其它线程占用，执行第三步。

- 第二步：

  判断队列中是否有线程在排队等待

  - 如果不存在则直接将锁的所有者设置成当前线程，且更新状态 state 。
  - 如果存在就入队。

- 第三步：

  判断锁的所有者是不是当前线程

  - 如果是则更新状态 state 的值。
  - 如果不是，线程进入队列排队等待。

**非公平锁**

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-13.png)

- 获取状态的 state 的值

  - 如果 state=0 即代表锁没有被其它线程占用，则设置当前锁的持有者为当前线程，该操作用 CAS 完成。
  - 如果不为0或者设置失败，代表锁被占用进行下一步。

- 此时

  获取 state 的值

  - 如果是，则给state+1，获取锁
  - 如果不是，则进入队列等待
  - 如果是0，代表刚好线程释放了锁，此时将锁的持有者设为自己
  - 如果不是0，则查看线程持有者是不是自己

## 27.多线程的创建方式有哪些？

- 1、**继承Thread类**，重写run()方法



```text
public class Demo extends Thread{
    //重写父类Thread的run()
    public void run() {
    }
    public static void main(String[] args) {
        Demo d1 = new Demo();
        Demo d2 = new Demo();
        d1.start();
        d2.start();
    }
}
```

- 2.**实现Runnable接口**，重写run()



```text
public class Demo2 implements Runnable{

    //重写Runnable接口的run()
    public void run() {
    }
    
    public static void main(String[] args) {
        Thread t1 = new Thread(new Demo2());
        Thread t2 = new Thread(new Demo2());
        t1.start();
        t2.start();
    }

}
```

- 3.**实现 Callable 接口**



```text
public class Demo implements Callable<String>{

    public String call() throws Exception {
        System.out.println("正在执行新建线程任务");
        Thread.sleep(2000);
        return "结果";
    }

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        Demo d = new Demo();
        FutureTask<String> task = new FutureTask<>(d);
        Thread t = new Thread(task);
        t.start();
        //获取任务执行后返回的结果
        String result = task.get();
    }
    
}
```

- 4.**使用线程池创建**



```text
public class Demo {
    public static void main(String[] args) {
        Executor threadPool = Executors.newFixedThreadPool(5);
        for(int i = 0 ;i < 10 ; i++) {
            threadPool.execute(new Runnable() {
                public void run() {
                    //todo
                }
            });
        }
        
    }
}
```

## 28.线程池有哪些参数？

- **1.corePoolSize**：**核心线程数**，线程池中始终存活的线程数。
- **2.maximumPoolSize**: **最大线程数**，线程池中允许的最大线程数。
- **3.keepAliveTime**: **存活时间**，线程没有任务执行时最多保持多久时间会终止。
- **4.unit**: **单位**，参数keepAliveTime的时间单位，7种可选。
- **5.workQueue**: 一个**阻塞队列**，用来存储等待执行的任务，均为线程安全，7种可选。
- **6.threadFactory**: **线程工厂**，主要用来创建线程，默及正常优先级、非守护线程。
- **7.handler**：**拒绝策略**，拒绝处理任务时的策略，4种可选，默认为AbortPolicy。

## 29.线程池的执行流程？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-14.png)

- 判断线程池中的线程数

  是否大于设置的核心线程数

  - 如果**小于**，就**创建**一个核心线程来执行任务

  - 如果

    大于

    ，就会

    判断缓冲队列是否满了

    - 如果**没有满**，则**放入队列**，等待线程空闲时执行任务

    - 如果队列已经

      满了

      ，则判断

      是否达到了线程池设置的最大线程数

      - 如果**没有达到**，就**创建新线程**来执行任务
      - 如果已经**达到了**最大线程数，则**执行指定的拒绝策略**

## 30.线程池的拒绝策略有哪些？

- **AbortPolicy**：直接丢弃任务，抛出异常，这是默认策略
- **CallerRunsPolicy**：只用调用者所在的线程来处理任务
- **DiscardOldestPolicy**：丢弃等待队列中最旧的任务，并执行当前任务
- **DiscardPolicy**：直接丢弃任务，也不抛出异常

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

## 33.聊聊 ThreadLocal 吧

- ThreadLocal其实就是**线程本地变量**，他会在每个线程都创建一个副本，那么在线程之间访问内部副本变量就行了，做到了线程之间互相隔离。 ![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/baguwen/basic-34-15.png)
- ThreadLocal 有一个**静态内部类 ThreadLocalMap**，ThreadLocalMap 又包含了一个 Entry 数组，**Entry 本身是一个弱引用**，他的 key 是指向 ThreadLocal 的弱引用，**弱引用的目的是为了防止内存泄露**,如果是强引用那么除非线程结束,否则无法终止,可能会有内存泄漏的风险。
- 但是这样还是会存在内存泄露的问题，假如 key 和 ThreadLocal 对象被回收之后，entry 中就存在 key 为 null ，但是 value 有值的 entry 对象，但是永远没办法被访问到，同样除非线程结束运行。**解决方法就是调用 remove 方法删除 entry 对象**。

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





### 01、HashMap的底层数据结构是什么？

JDK 7 中，HashMap 由“数组+链表”组成，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的。

在 JDK 8 中，HashMap 由“数组+链表+红黑树”组成。链表过长，会严重影响 HashMap 的性能，而红黑树搜索的时间复杂度是 O(logn)，而链表是糟糕的 O(n)。因此，JDK 8 对数据结构做了进一步的优化，引入了红黑树，链表和红黑树在达到一定条件会进行转换：

- 当链表超过 8 且数据总量超过 64 时会转红黑树。
- 将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树，以减少搜索时间。

链表长度超过 8 体现在 putVal 方法中的这段代码：



```java
//链表长度大于8转换为红黑树进行处理
if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
    treeifyBin(tab, hash);
```

table 长度为 64 体现在 treeifyBin 方法中的这段代码：：



```java
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
}
```

MIN_TREEIFY_CAPACITY 的值正好为 64。



```java
static final int MIN_TREEIFY_CAPACITY = 64;
```

JDK 8 中 HashMap 的结构示意图：

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/collection/hashmap-interview-01.png)

### 02、为什么链表改为红黑树的阈值是 8?

因为泊松分布，我们来看作者在源码中的注释：

> Because TreeNodes are about twice the size of regular nodes, we use them only when bins contain enough nodes to warrant use (see TREEIFY_THRESHOLD). And when they become too small (due to removal or resizing) they are converted back to plain bins. In usages with well-distributed user hashCodes, tree bins are rarely used. Ideally, under random hashCodes, the frequency of nodes in bins follows a Poisson distribution (http://en.wikipedia.org/wiki/Poisson_distribution) with a parameter of about 0.5 on average for the default resizing threshold of 0.75, although with a large variance because of resizing granularity. Ignoring variance, the expected occurrences of list size k are (exp(-0.5) pow(0.5, k) / factorial(k)). The first values are: 0: 0.60653066
> 1: 0.30326533
> 2: 0.07581633
> 3: 0.01263606
> 4: 0.00157952
> 5: 0.00015795
> 6: 0.00001316
> 7: 0.00000094
> 8: 0.00000006
> more: less than 1 in ten million

翻译过来大概的意思是：理想情况下使用随机的哈希码，容器中节点分布在 hash 桶中的频率遵循泊松分布，按照泊松分布的计算公式计算出了桶中元素个数和概率的对照表，可以看到链表中元素个数为 8 时的概率已经非常小，再多的就更少了，所以原作者在选择链表元素个数时选择了 8，是根据概率统计而选择的。

### 03、解决hash冲突的办法有哪些？HashMap用的哪种？

解决Hash冲突方法有：

- 开放定址法：也称为再散列法，基本思想就是，如果p=H(key)出现冲突时，则以p为基础，再次hash，p1=H(p),如果p1再次出现冲突，则以p1为基础，以此类推，直到找到一个不冲突的哈希地址pi。因此开放定址法所需要的hash表的长度要大于等于所需要存放的元素，而且因为存在再次hash，所以只能在删除的节点上做标记，而不能真正删除节点。
- 再哈希法：双重散列，多重散列，提供多个不同的hash函数，当R1=H1(key1)发生冲突时，再计算R2=H2(key1)，直到没有冲突为止。这样做虽然不易产生堆集，但增加了计算的时间。
- 链地址法：拉链法，将哈希值相同的元素构成一个同义词的单链表，并将单链表的头指针存放在哈希表的第i个单元中，查找、插入和删除主要在同义词链表中进行。链表法适用于经常进行插入和删除的情况。
- 建立公共溢出区：将哈希表分为公共表和溢出表，当溢出发生时，将所有溢出数据统一放到溢出区。

HashMap中采用的是链地址法 。

### 04、为什么在解决 hash 冲突的时候，不直接用红黑树？而选择先用链表，再转红黑树?

因为红黑树需要进行左旋，右旋，变色这些操作来保持平衡，而单链表不需要。

当元素小于 8 个的时候，此时做查询操作，链表结构已经能保证查询性能。当元素大于 8 个的时候， 红黑树搜索时间复杂度是 O(logn)，而链表是 O(n)，此时需要红黑树来加快查询速度，但是新增节点的效率变慢了。

因此，如果一开始就用红黑树结构，元素太少，新增效率又比较慢，无疑这是浪费性能的。

### 05、HashMap默认加载因子是多少？为什么是 0.75，不是 0.6 或者 0.8 ？

作为一般规则，默认负载因子（0.75）在时间和空间成本上提供了很好的折衷。



### 06、HashMap 中 key 的存储索引是怎么计算的？

首先根据key的值计算出hashcode的值，然后根据hashcode计算出hash值，最后通过hash&（length-1）计算得到存储的位置。



### 07、JDK 8 为什么要 hashcode 异或其右移十六位的值？

因为在JDK 7 中扰动了 4 次，计算 hash 值的性能会稍差一点点。

从速度、功效、质量来考虑，JDK 8 优化了高位运算的算法，通过hashCode()的高16位异或低16位实现：`(h = k.hashCode()) ^ (h >>> 16)`。

这么做可以在数组 table 的 length 比较小的时候，也能保证考虑到高低Bit都参与到Hash的计算中，同时不会有太大的开销。

### 08、为什么 hash 值要与length-1相与？

- 把 hash 值对数组长度取模运算，模运算的消耗很大，没有位运算快。
- 当 length 总是 2 的n次方时，`h& (length-1) `运算等价于对length取模，也就是 h%length，但是 & 比 % 具有更高的效率。

### 09、HashMap数组的长度为什么是 2 的幂次方？

2 的 N 次幂有助于减少碰撞的几率。如果 length 为2的幂次方，则 length-1 转化为二进制必定是11111……的形式，在与h的二进制与操作效率会非常的快，而且空间不浪费。我们来举个例子，看下图：

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/collection/hashmap-interview-02.png)

当 length =15时，6 和 7 的结果一样，这样表示他们在 table 存储的位置是相同的，也就是产生了碰撞，6、7就会在一个位置形成链表，4和5的结果也是一样，这样就会导致查询速度降低。

如果我们进一步分析，还会发现空间浪费非常大，以 length=15 为例，在 1、3、5、7、9、11、13、15 这八处没有存放数据。因为hash值在与14（即 1110）进行&运算时，得到的结果最后一位永远都是0，即 0001、0011、0101、0111、1001、1011、1101、1111位置处是不可能存储数据的。

**再补充数组容量计算的小奥秘。**

HashMap 构造函数允许用户传入的容量不是 2 的 n 次方，因为它可以自动地将传入的容量转换为 2 的 n 次方。会取大于或等于这个数的 且最近的2次幂作为 table 数组的初始容量，使用tableSizeFor(int)方法，如 tableSizeFor(10) = 16（2 的 4 次幂），tableSizeFor(20) = 32（2 的 5 次幂），也就是说 table 数组的长度总是 2 的次幂。JDK 8 源码如下：



```java
static final int tableSizeFor(int cap) {
        int n = cap - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
    }
```

让cap-1再赋值给n的目的是另找到的目标值大于或等于原值。例如二进制1000，十进制数值为8。如果不对它减1而直接操作，将得到答案10000，即16。显然不是结果。减1后二进制为111，再进行操作则会得到原来的数值1000，即8。

### 10、HashMap 的put方法流程？

以JDK 8为例，简要流程如下：

1、首先根据 key 的值计算 hash 值，找到该元素在数组中存储的下标；

2、如果数组是空的，则调用 resize 进行初始化；

3、如果没有哈希冲突直接放在对应的数组下标里；

4、如果冲突了，且 key 已经存在，就覆盖掉 value；

5、如果冲突后，发现该节点是红黑树，就将这个节点挂在树上；

6、如果冲突后是链表，判断该链表是否大于 8 ，如果大于 8 并且数组容量小于 64，就进行扩容；如果链表节点大于 8 并且数组的容量大于 64，则将这个结构转换为红黑树；否则，链表插入键值对，若 key 存在，就覆盖掉 value。

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/collection/hashmap-interview-03.png)

### 11、HashMap 的扩容方式？

HashMap 在容量超过负载因子所定义的容量之后，就会扩容。



### 12、一般用什么作为HashMap的key?

一般用Integer、String 这种不可变类当作 HashMap 的 key，String 最为常见。

- 因为字符串是不可变的，所以在它创建的时候 hashcode 就被缓存了，不需要重新计算。
- 因为获取对象的时候要用到 equals() 和 hashCode() 方法，那么键对象正确的重写这两个方法是非常重要的。Integer、String 这些类已经很规范的重写了 hashCode() 以及 equals() 方法。

### 13、HashMap为什么线程不安全？

- JDK 7 时多线程下扩容会造成死循环。
- 多线程的put可能导致元素的丢失。
- put和get并发时，可能导致get为null。











## 请用Iterable实现一个随机序列产生器?

```java
public class RandomStringGenerator<T> implements Iterable<T> {

    private final List<T> list;
    
    private void swap(int[] a, int i, int i1) {
    }

    public RandomStringGenerator(List<T> list) {
        this.list = list;
    }

    @Override
    public Iterator<T> iterator() {

        return new Iterator<T>() {
            @Override
            public boolean hasNext() {
                return true;
            }

            @Override
            public T next() {
                return list.get((int) (list.size() * Math.random()));
            }
        };
    }
    
    public static void main(String[] argv) {
        var list = Arrays.asList("List", "Tree", "Array");
        var gen = new RandomStringGenerator<String>(list);

//        for(var s: gen) {
//            System.out.println(s);
//        }

//        var it = gen.iterator();
//        for(int i = 0; i < 100; i++) {
//            System.out.println(it.next());
//        }
    }
}
```





## Collection和Set的区别？





## Map是不是Collection?





## TreeMap和HashMap的区别？



## HashMap vs Hashtable

## 实现Key-Value的LRU缓存