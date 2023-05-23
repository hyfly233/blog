### CyclicBarrier 和 CountDownLatch 区别
这两个类非常类似，都在 java.util.concurrent 下，都可以用来表示代码运行到某个点上
区别：

- CyclicBarrier 的某个线程运行到某个点上之后，该线程即停止运行，直到所有的线程都到达了这个点，所有线程才重新运行；CountDownLatch 则不是，某线程运行到某个点上之后，只是给某个数值 -1 而已，该线程继续运行
- CyclicBarrier 只能唤起一个任务，CountDownLatch 可以唤起多个任务
- CyclicBarrier 可重用，CountDownLatch 不可重用，计数值为 0 该 CountDownLatch 就不可再用了
### 描述一下AQS？ todo
AQS 的全称为 AbstractQueuedSynchronizer ，翻译过来的意思就是抽象队列同步器。这个类在 java.util.concurrent.locks 包下面。AQS 为构建锁和同步器提供了一些通用功能的是实现，因此，使用 AQS 能简单且高效地构造出应用广泛的大量的同步器，比如 ReentrantLock，Semaphore，其他的诸如 ReentrantReadWriteLock，SynchronousQueue 等等皆是基于 AQS 的

### 简述CountDownLatch
CountDownLatch这个类使一个线程等待其他线程各自执行完毕后再执行。是通过一个计数器来实现的，计数器的初始值是线程的数量。每当一个线程执行完毕后，调用countDown方法，计数器的值就减1，当计数器的值为0时，表示所有线程都执行完毕，然后在等待的线程就可以恢复工作了。只能一次性使用，不能reset。
### 简述CyclicBarrier
CyclicBarrier 主要功能和CountDownLatch类似，也是通过一个计数器，使一个线程等待其他线程各自执行完毕后再执行。但是其可以重复使用（reset）。

### 简述Semaphore
Semaphore即信号量。Semaphore 的构造方法参数接收一个 int 值，设置一个计数器，表示可用的许可数量即最大并发数。使用 acquire 方法获得一个许可证，计数器减一，使用 release 方法归还许可，计数器加一。如果此时计数器值为0，线程进入休眠。

### 简述Exchanger
Exchanger类可用于两个线程之间交换信息。可简单地将Exchanger对象理解为一个包含两个格子的容器，通过exchanger方法可以向两个格子中填充信息。线程通过exchange 方法交换数据，第一个线程执行 exchange 方法后会阻塞等待第二个线程执行该方法。当两个线程都到达同步点时这两个线程就可以交换数据当两个格子中的均被填充时，该对象会自动将两个格子的信息交换，然后返回给线程，从而实现两个线程的信息交换。
### 简述ConcurrentHashMap
JDK7采用锁分段技术。首先将数据分成 Segment 数据段，然后给每一个数据段配一把锁，当一个线程占用锁访问其中一个段的数据时，其他段的数据也能被其他线程访问。
get 除读到空值不需要加锁。该方法先经过一次再散列，再用这个散列值通过散列运算定位到 Segment，最后通过散列算法定位到元素。put 须加锁，首先定位到 Segment，然后进行插入操作，第一步判断是否需要对 Segment 里的 HashEntry 数组进行扩容，第二步定位添加元素的位置，然后将其放入数组。
JDK8的改进

- 取消分段锁机制，采用CAS算法进行值的设置，如果CAS失败再使用 synchronized 加锁添加元素
- 引入红黑树结构，当某个槽内的元素个数超过8且 Node数组 容量大于 64 时，链表转为红黑树。
- 使用了更加优化的方式统计集合内的元素数量。


### 简述AQS
AQS（AbstractQuenedSynchronizer）抽象的队列式同步器。AQS是将每一条请求共享资源的线程封装成一个锁队列的一个结点（Node），来实现锁的分配。AQS是用来构建锁或其他同步组件的基础框架，它使用一个 volatile int state 变量作为共享资源，如果线程获取资源失败，则进入同步队列等待；如果获取成功就执行临界区代码，释放资源时会通知同步队列中的等待线程。
子类通过继承同步器并实现它的抽象方法getState、setState 和 compareAndSetState对同步状态进行更改。
AQS获取独占锁/释放独占锁原理：
获取：（acquire）

- 调用 tryAcquire 方法安全地获取线程同步状态，获取失败的线程会被构造同步节点并通过 addWaiter 方法加入到同步队列的尾部，在队列中自旋。
- 调用 acquireQueued 方法使得该节点以死循环的方式获取同步状态，如果获取不到则阻塞。

释放：（release）

- 调用 tryRelease 方法释放同步状态
- 调用 unparkSuccessor 方法唤醒头节点的后继节点，使后继节点重新尝试获取同步状态。

AQS获取共享锁/释放共享锁原理
获取锁（acquireShared）

- 调用 tryAcquireShared 方法尝试获取同步状态，返回值不小于 0 表示能获取同步状态。
- 释放（releaseShared），并唤醒后续处于等待状态的节点。
### ConcurrentHashMap 底层原理？ todo

- JDK 1.7：ConcurrentHashMap 内部主要是一个 Segment 数组，而数组的每一项又是一个 HashEntry 数组，元素都存在 HashEntry 数组里。因为每次锁定的是 Segment 对象，也就是整个 HashEntry 数组，所以又叫分段锁
- JDK 1.8：ConcurrentHashMap 舍弃了分段锁的实现方式，元素都存在Node数组中，每次锁住的是一个 Node 对象，而不是某一段数组，所以支持的写的并发度更高。引入了红黑树，在 hash 冲突严重时，读操作的效率更高

## Atomic
Atomic 是指一个操作是不可中断的。即使是在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程干扰。并发包 java.util.concurrent 的原子类都存放在 java.util.concurrent.atomic 下

根据操作的数据类型，可以将 JUC 包中的原子类分为 4 类
基本类型
使用原子的方式更新基本类型

- AtomicInteger：整型原子类
- AtomicLong：长整型原子类
- AtomicBoolean ：布尔型原子类

数组类型
使用原子的方式更新数组里的某个元素

- AtomicIntegerArray：整型数组原子类
- AtomicLongArray：长整型数组原子类
- AtomicReferenceArray ：引用类型数组原子类

引用类型

- AtomicReference：引用类型原子类
- AtomicMarkableReference：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来
- AtomicStampedReference ：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。

对象的属性修改类型

- AtomicIntegerFieldUpdater:原子更新整型字段的更新器
- AtomicLongFieldUpdater：原子更新长整型字段的更新器
- AtomicReferenceFieldUpdater：原子更新引用类型里的字段


### 基本类型原子类
使用原子的方式更新基本类型

- AtomicInteger：整型原子类
- AtomicLong：长整型原子类
- AtomicBoolean ：布尔型原子类

上面三个类提供的方法几乎相同，所以我们这里以 AtomicInteger 为例子来介绍。
AtomicInteger 类常用方法
```java
public final int get() //获取当前的值
public final int getAndSet(int newValue)//获取当前的值，并设置新的值
public final int getAndIncrement()//获取当前的值，并自增
public final int getAndDecrement() //获取当前的值，并自减
public final int getAndAdd(int delta) //获取当前的值，并加上预期的值
boolean compareAndSet(int expect, int update) //如果输入的数值等于预期值，则以原子方式将该值设置为输入值（update）
public final void lazySet(int newValue)//最终设置为newValue,使用 lazySet 设置之后可能导致其他线程在之后的一小段时间内还是可以读到旧的值。
```
### 基本数据类型原子类的优势
通过一个简单例子带大家看一下基本数据类型原子类的优势
1、多线程环境不使用原子类保证线程安全（基本数据类型）
```java
class Test {
        private volatile int count = 0;
        //若要线程安全执行执行count++，需要加锁
        public synchronized void increment() {
                  count++;
        }

        public int getCount() {
                  return count;
        }
}

```
2、多线程环境使用原子类保证线程安全（基本数据类型）
```java
class Test2 {
        private AtomicInteger count = new AtomicInteger();

        public void increment() {
                  count.incrementAndGet();
        }
      //使用AtomicInteger之后，不需要加锁，也可以实现线程安全。
       public int getCount() {
                return count.get();
        }
}


```
### 
AtomicInteger 线程安全原理简单分析
AtomicInteger 类的部分源码：
```java
    // setup to use Unsafe.compareAndSwapInt for updates（更新操作时提供“比较并替换”的作用）
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long valueOffset;

    static {
        try {
            valueOffset = unsafe.objectFieldOffset
                (AtomicInteger.class.getDeclaredField("value"));
        } catch (Exception ex) { throw new Error(ex); }
    }

    private volatile int value;

```
AtomicInteger 类主要利用 CAS (compare and swap) + volatile 和 native 方法来保证原子操作，从而避免 synchronized 的高开销，执行效率大为提升。
CAS 的原理是拿期望的值和原本的一个值作比较，如果相同则更新成新的值。UnSafe 类的 objectFieldOffset() 方法是一个本地方法，这个方法是用来拿到“原来的值”的内存地址。另外 value 是一个 volatile 变量，在内存中可见，因此 JVM 可以保证任何时刻任何线程总能拿到该变量的最新值。

## 数组类型原子类
使用原子的方式更新数组里的某个元素

- AtomicIntegerArray：整形数组原子类
- AtomicLongArray：长整形数组原子类
- AtomicReferenceArray ：引用类型数组原子类

上面三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerArray 为例子来介绍。
AtomicIntegerArray 类常用方法 ：
public final int get(int i) //获取 index=i 位置元素的值 public final int getAndSet(int i, int newValue)//返回 index=i 位置的当前的值，并将其设置为新值：newValue public final int getAndIncrement(int i)//获取 index=i 位置元素的值，并让该位置的元素自增 public final int getAndDecrement(int i) //获取 index=i 位置元素的值，并让该位置的元素自减 public final int getAndAdd(int i, int delta) //获取 index=i 位置元素的值，并加上预期的值 boolean compareAndSet(int i, int expect, int update) //如果输入的数值等于预期值，则以原子方式将 index=i 位置的元素值设置为输入值（update） public final void lazySet(int i, int newValue)//最终 将index=i 位置的元素设置为newValue,使用 lazySet 设置之后可能导致其他线程在之后的一小段时间内还是可以读到旧的值。 
AtomicIntegerArray 类使用示例 :
import java.util.concurrent.atomic.AtomicIntegerArray; public class AtomicIntegerArrayTest {     public static void main(String[] args) {         int temvalue = 0;         int[] nums = { 1, 2, 3, 4, 5, 6 };         AtomicIntegerArray i = new AtomicIntegerArray(nums);         for (int j = 0; j < nums.length; j++) {             System.out.println(i.get(j));         }         temvalue = i.getAndSet(0, 2);         System.out.println("temvalue:" + temvalue + ";  i:" + i);         temvalue = i.getAndIncrement(0);         System.out.println("temvalue:" + temvalue + ";  i:" + i);         temvalue = i.getAndAdd(0, 5);         System.out.println("temvalue:" + temvalue + ";  i:" + i);     } } 
## [#](#引用类型原子类) 引用类型原子类
基本类型原子类只能更新一个变量，如果需要原子更新多个变量，需要使用 引用类型原子类。

- AtomicReference：引用类型原子类
- AtomicStampedReference：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。
- AtomicMarkableReference ：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来，也可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。

上面三个类提供的方法几乎相同，所以我们这里以 AtomicReference 为例子来介绍。
AtomicReference 类使用示例 :
import java.util.concurrent.atomic.AtomicReference; public class AtomicReferenceTest {     public static void main(String[] args) {         AtomicReference < Person > ar = new AtomicReference < Person > ();         Person person = new Person("SnailClimb", 22);         ar.set(person);         Person updatePerson = new Person("Daisy", 20);         ar.compareAndSet(person, updatePerson);         System.out.println(ar.get().getName());         System.out.println(ar.get().getAge());     } } class Person {     private String name;     private int age;     public Person(String name, int age) {         super();         this.name = name;         this.age = age;     }     public String getName() {         return name;     }     public void setName(String name) {         this.name = name;     }     public int getAge() {         return age;     }     public void setAge(int age) {         this.age = age;     } } 
上述代码首先创建了一个 Person 对象，然后把 Person 对象设置进 AtomicReference 对象中，然后调用 compareAndSet 方法，该方法就是通过 CAS 操作设置 ar。如果 ar 的值为 person 的话，则将其设置为 updatePerson。实现原理与 AtomicInteger 类中的 compareAndSet 方法相同。运行上面的代码后的输出结果如下：
Daisy 20 
AtomicStampedReference 类使用示例 :
import java.util.concurrent.atomic.AtomicStampedReference; public class AtomicStampedReferenceDemo {     public static void main(String[] args) {         // 实例化、取当前值和 stamp 值         final Integer initialRef = 0, initialStamp = 0;         final AtomicStampedReference<Integer> asr = new AtomicStampedReference<>(initialRef, initialStamp);         System.out.println("currentValue=" + asr.getReference() + ", currentStamp=" + asr.getStamp());         // compare and set         final Integer newReference = 666, newStamp = 999;         final boolean casResult = asr.compareAndSet(initialRef, newReference, initialStamp, newStamp);         System.out.println("currentValue=" + asr.getReference()                 + ", currentStamp=" + asr.getStamp()                 + ", casResult=" + casResult);         // 获取当前的值和当前的 stamp 值         int[] arr = new int[1];         final Integer currentValue = asr.get(arr);         final int currentStamp = arr[0];         System.out.println("currentValue=" + currentValue + ", currentStamp=" + currentStamp);         // 单独设置 stamp 值         final boolean attemptStampResult = asr.attemptStamp(newReference, 88);         System.out.println("currentValue=" + asr.getReference()                 + ", currentStamp=" + asr.getStamp()                 + ", attemptStampResult=" + attemptStampResult);         // 重新设置当前值和 stamp 值         asr.set(initialRef, initialStamp);         System.out.println("currentValue=" + asr.getReference() + ", currentStamp=" + asr.getStamp());         // [不推荐使用，除非搞清楚注释的意思了] weak compare and set         // 困惑！weakCompareAndSet 这个方法最终还是调用 compareAndSet 方法。[版本: jdk-8u191]         // 但是注释上写着 "May fail spuriously and does not provide ordering guarantees,         // so is only rarely an appropriate alternative to compareAndSet."         // todo 感觉有可能是 jvm 通过方法名在 native 方法里面做了转发         final boolean wCasResult = asr.weakCompareAndSet(initialRef, newReference, initialStamp, newStamp);         System.out.println("currentValue=" + asr.getReference()                 + ", currentStamp=" + asr.getStamp()                 + ", wCasResult=" + wCasResult);     } } 
输出结果如下：
currentValue=0, currentStamp=0 currentValue=666, currentStamp=999, casResult=true currentValue=666, currentStamp=999 currentValue=666, currentStamp=88, attemptStampResult=true currentValue=0, currentStamp=0 currentValue=666, currentStamp=999, wCasResult=true 
AtomicMarkableReference 类使用示例 :
import java.util.concurrent.atomic.AtomicMarkableReference; public class AtomicMarkableReferenceDemo {     public static void main(String[] args) {         // 实例化、取当前值和 mark 值         final Boolean initialRef = null, initialMark = false;         final AtomicMarkableReference<Boolean> amr = new AtomicMarkableReference<>(initialRef, initialMark);         System.out.println("currentValue=" + amr.getReference() + ", currentMark=" + amr.isMarked());         // compare and set         final Boolean newReference1 = true, newMark1 = true;         final boolean casResult = amr.compareAndSet(initialRef, newReference1, initialMark, newMark1);         System.out.println("currentValue=" + amr.getReference()                 + ", currentMark=" + amr.isMarked()                 + ", casResult=" + casResult);         // 获取当前的值和当前的 mark 值         boolean[] arr = new boolean[1];         final Boolean currentValue = amr.get(arr);         final boolean currentMark = arr[0];         System.out.println("currentValue=" + currentValue + ", currentMark=" + currentMark);         // 单独设置 mark 值         final boolean attemptMarkResult = amr.attemptMark(newReference1, false);         System.out.println("currentValue=" + amr.getReference()                 + ", currentMark=" + amr.isMarked()                 + ", attemptMarkResult=" + attemptMarkResult);         // 重新设置当前值和 mark 值         amr.set(initialRef, initialMark);         System.out.println("currentValue=" + amr.getReference() + ", currentMark=" + amr.isMarked());         // [不推荐使用，除非搞清楚注释的意思了] weak compare and set         // 困惑！weakCompareAndSet 这个方法最终还是调用 compareAndSet 方法。[版本: jdk-8u191]         // 但是注释上写着 "May fail spuriously and does not provide ordering guarantees,         // so is only rarely an appropriate alternative to compareAndSet."         // todo 感觉有可能是 jvm 通过方法名在 native 方法里面做了转发         final boolean wCasResult = amr.weakCompareAndSet(initialRef, newReference1, initialMark, newMark1);         System.out.println("currentValue=" + amr.getReference()                 + ", currentMark=" + amr.isMarked()                 + ", wCasResult=" + wCasResult);     } } 
输出结果如下：
currentValue=null, currentMark=false currentValue=true, currentMark=true, casResult=true currentValue=true, currentMark=true currentValue=true, currentMark=false, attemptMarkResult=true currentValue=null, currentMark=false currentValue=true, currentMark=true, wCasResult=true 
## [#](#对象的属性修改类型原子类) 对象的属性修改类型原子类
如果需要原子更新某个类里的某个字段时，需要用到对象的属性修改类型原子类。

- AtomicIntegerFieldUpdater:原子更新整形字段的更新器
- AtomicLongFieldUpdater：原子更新长整形字段的更新器
- AtomicReferenceFieldUpdater ：原子更新引用类型里的字段的更新器

要想原子地更新对象的属性需要两步。第一步，因为对象的属性修改类型原子类都是抽象类，所以每次使用都必须使用静态方法 newUpdater()创建一个更新器，并且需要设置想要更新的类和属性。第二步，更新的对象属性必须使用 public volatile 修饰符。
上面三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerFieldUpdater为例子来介绍。
AtomicIntegerFieldUpdater 类使用示例 :
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater; public class AtomicIntegerFieldUpdaterTest { 	public static void main(String[] args) { 		AtomicIntegerFieldUpdater<User> a = AtomicIntegerFieldUpdater.newUpdater(User.class, "age"); 		User user = new User("Java", 22); 		System.out.println(a.getAndIncrement(user));// 22 		System.out.println(a.get(user));// 23 	} } class User { 	private String name; 	public volatile int age; 	public User(String name, int age) { 		super(); 		this.name = name; 		this.age = age; 	} 	public String getName() { 		return name; 	} 	public void setName(String name) { 		this.name = name; 	} 	public int getAge() { 		return age; 	} 	public void setAge(int age) { 		this.age = age; 	} } 
输出结果：
22 23







### 简述常见的Atomic类
在很多时候，我们需要的仅仅是一个简单的、高效的、线程安全的++或者--方案，使用synchronized关键字和lock固然可以实现，但代价比较大，此时用原子类更加方便。基本数据类型的原子类有：

- AtomicInteger 原子更新整型
- AtomicLong 原子更新长整型
- AtomicBoolean 原子更新布尔类型

Atomic数组类型有：

- AtomicIntegerArray 原子更新整型数组里的元素
- AtomicLongArray 原子更新长整型数组里的元素
- AtomicReferenceArray 原子更新引用类型数组里的元素。

Atomic引用类型有：

- AtomicReference 原子更新引用类型
- AtomicMarkableReference 原子更新带有标记位的引用类型，可以绑定一个 boolean 标记
- AtomicStampedReference 原子更新带有版本号的引用类型

FieldUpdater类型：

- AtomicIntegerFieldUpdater 原子更新整型字段的更新器
- AtomicLongFieldUpdater 原子更新长整型字段的更新器
- AtomicReferenceFieldUpdater 原子更新引用类型字段的更新器
### 简述Atomic类基本实现原理
以AtomicIntger 为例。
方法getAndIncrement，以原子方式将当前的值加1，具体实现为：

- 在 for 死循环中取得 AtomicInteger 里存储的数值
- 对 AtomicInteger 当前的值加 1
- 调用 compareAndSet 方法进行原子更新
- 先检查当前数值是否等于 expect
- 如果等于则说明当前值没有被其他线程修改，则将值更新为 next，
- 如果不是会更新失败返回 false，程序会进入 for 循环重新进行 compareAndSet 操作。
