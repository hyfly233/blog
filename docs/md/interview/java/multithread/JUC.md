### CyclicBarrier 和 CountDownLatch 区别

这两个类非常类似，都在 java.util.concurrent 下，都可以用来表示代码运行到某个点上
区别：

-   CyclicBarrier 的某个线程运行到某个点上之后，该线程即停止运行，直到所有的线程都到达了这个点，所有线程才重新运行；CountDownLatch 则不是，某线程运行到某个点上之后，只是给某个数值 -1 而已，该线程继续运行
-   CyclicBarrier 只能唤起一个任务，CountDownLatch 可以唤起多个任务
-   CyclicBarrier 可重用，CountDownLatch 不可重用，计数值为 0 该 CountDownLatch 就不可再用了

### 描述一下 AQS？ todo

AQS 的全称为 AbstractQueuedSynchronizer ，翻译过来的意思就是抽象队列同步器。这个类在 java.util.concurrent.locks 包下面。AQS 为构建锁和同步器提供了一些通用功能的是实现，因此，使用 AQS 能简单且高效地构造出应用广泛的大量的同步器，比如 ReentrantLock，Semaphore，其他的诸如 ReentrantReadWriteLock，SynchronousQueue 等等皆是基于 AQS 的

### 简述 CountDownLatch

CountDownLatch 这个类使一个线程等待其他线程各自执行完毕后再执行。是通过一个计数器来实现的，计数器的初始值是线程的数量。每当一个线程执行完毕后，调用 countDown 方法，计数器的值就减 1，当计数器的值为 0 时，表示所有线程都执行完毕，然后在等待的线程就可以恢复工作了。只能一次性使用，不能 reset。

### 简述 CyclicBarrier

CyclicBarrier 主要功能和 CountDownLatch 类似，也是通过一个计数器，使一个线程等待其他线程各自执行完毕后再执行。但是其可以重复使用（reset）。

### 简述 Semaphore

Semaphore 即信号量。Semaphore 的构造方法参数接收一个 int 值，设置一个计数器，表示可用的许可数量即最大并发数。使用 acquire 方法获得一个许可证，计数器减一，使用 release 方法归还许可，计数器加一。如果此时计数器值为 0，线程进入休眠。

### 简述 Exchanger

Exchanger 类可用于两个线程之间交换信息。可简单地将 Exchanger 对象理解为一个包含两个格子的容器，通过 exchanger 方法可以向两个格子中填充信息。线程通过 exchange 方法交换数据，第一个线程执行 exchange 方法后会阻塞等待第二个线程执行该方法。当两个线程都到达同步点时这两个线程就可以交换数据当两个格子中的均被填充时，该对象会自动将两个格子的信息交换，然后返回给线程，从而实现两个线程的信息交换。

### 简述 ConcurrentHashMap

JDK7 采用锁分段技术。首先将数据分成 Segment 数据段，然后给每一个数据段配一把锁，当一个线程占用锁访问其中一个段的数据时，其他段的数据也能被其他线程访问。
get 除读到空值不需要加锁。该方法先经过一次再散列，再用这个散列值通过散列运算定位到 Segment，最后通过散列算法定位到元素。put 须加锁，首先定位到 Segment，然后进行插入操作，第一步判断是否需要对 Segment 里的 HashEntry 数组进行扩容，第二步定位添加元素的位置，然后将其放入数组。
JDK8 的改进

-   取消分段锁机制，采用 CAS 算法进行值的设置，如果 CAS 失败再使用 synchronized 加锁添加元素
-   引入红黑树结构，当某个槽内的元素个数超过 8 且 Node 数组 容量大于 64 时，链表转为红黑树。
-   使用了更加优化的方式统计集合内的元素数量。

### 简述 AQS

AQS（AbstractQuenedSynchronizer）抽象的队列式同步器。AQS 是将每一条请求共享资源的线程封装成一个锁队列的一个结点（Node），来实现锁的分配。AQS 是用来构建锁或其他同步组件的基础框架，它使用一个 volatile int state 变量作为共享资源，如果线程获取资源失败，则进入同步队列等待；如果获取成功就执行临界区代码，释放资源时会通知同步队列中的等待线程。
子类通过继承同步器并实现它的抽象方法 getState、setState 和 compareAndSetState 对同步状态进行更改。
AQS 获取独占锁/释放独占锁原理：
获取：（acquire）

-   调用 tryAcquire 方法安全地获取线程同步状态，获取失败的线程会被构造同步节点并通过 addWaiter 方法加入到同步队列的尾部，在队列中自旋。
-   调用 acquireQueued 方法使得该节点以死循环的方式获取同步状态，如果获取不到则阻塞。

释放：（release）

-   调用 tryRelease 方法释放同步状态
-   调用 unparkSuccessor 方法唤醒头节点的后继节点，使后继节点重新尝试获取同步状态。

AQS 获取共享锁/释放共享锁原理
获取锁（acquireShared）

-   调用 tryAcquireShared 方法尝试获取同步状态，返回值不小于 0 表示能获取同步状态。
-   释放（releaseShared），并唤醒后续处于等待状态的节点。

### ConcurrentHashMap 底层原理？ todo

-   JDK 1.7：ConcurrentHashMap 内部主要是一个 Segment 数组，而数组的每一项又是一个 HashEntry 数组，元素都存在 HashEntry 数组里。因为每次锁定的是 Segment 对象，也就是整个 HashEntry 数组，所以又叫分段锁
-   JDK 1.8：ConcurrentHashMap 舍弃了分段锁的实现方式，元素都存在 Node 数组中，每次锁住的是一个 Node 对象，而不是某一段数组，所以支持的写的并发度更高。引入了红黑树，在 hash 冲突严重时，读操作的效率更高

## Atomic

Atomic 是指一个操作是不可中断的。即使是在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程干扰。并发包 java.util.concurrent 的原子类都存放在 java.util.concurrent.atomic 下

根据操作的数据类型，可以将 JUC 包中的原子类分为 4 类
基本类型
使用原子的方式更新基本类型

-   AtomicInteger：整型原子类
-   AtomicLong：长整型原子类
-   AtomicBoolean ：布尔型原子类

数组类型
使用原子的方式更新数组里的某个元素

-   AtomicIntegerArray：整型数组原子类
-   AtomicLongArray：长整型数组原子类
-   AtomicReferenceArray ：引用类型数组原子类

引用类型

-   AtomicReference：引用类型原子类
-   AtomicMarkableReference：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来
-   AtomicStampedReference ：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。

对象的属性修改类型

-   AtomicIntegerFieldUpdater:原子更新整型字段的更新器
-   AtomicLongFieldUpdater：原子更新长整型字段的更新器
-   AtomicReferenceFieldUpdater：原子更新引用类型里的字段

### 基本类型原子类

使用原子的方式更新基本类型

-   AtomicInteger：整型原子类
-   AtomicLong：长整型原子类
-   AtomicBoolean ：布尔型原子类

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

-   AtomicIntegerArray：整形数组原子类
-   AtomicLongArray：长整形数组原子类
-   AtomicReferenceArray ：引用类型数组原子类

上面三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerArray 为例子来介绍。

## [#](#引用类型原子类) 引用类型原子类

基本类型原子类只能更新一个变量，如果需要原子更新多个变量，需要使用 引用类型原子类。

-   AtomicReference：引用类型原子类
-   AtomicStampedReference：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。
-   AtomicMarkableReference ：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来，也可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。

上面三个类提供的方法几乎相同，所以我们这里以 AtomicReference 为例子来介绍。
AtomicReference 类使用示例 :

## [#](#对象的属性修改类型原子类) 对象的属性修改类型原子类

如果需要原子更新某个类里的某个字段时，需要用到对象的属性修改类型原子类。

-   AtomicIntegerFieldUpdater:原子更新整形字段的更新器
-   AtomicLongFieldUpdater：原子更新长整形字段的更新器
-   AtomicReferenceFieldUpdater ：原子更新引用类型里的字段的更新器

要想原子地更新对象的属性需要两步。第一步，因为对象的属性修改类型原子类都是抽象类，所以每次使用都必须使用静态方法 newUpdater()创建一个更新器，并且需要设置想要更新的类和属性。第二步，更新的对象属性必须使用 public volatile 修饰符。
上面三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerFieldUpdater 为例子来介绍。

### 简述常见的 Atomic 类

在很多时候，我们需要的仅仅是一个简单的、高效的、线程安全的++或者--方案，使用 synchronized 关键字和 lock 固然可以实现，但代价比较大，此时用原子类更加方便。基本数据类型的原子类有：

-   AtomicInteger 原子更新整型
-   AtomicLong 原子更新长整型
-   AtomicBoolean 原子更新布尔类型

Atomic 数组类型有：

-   AtomicIntegerArray 原子更新整型数组里的元素
-   AtomicLongArray 原子更新长整型数组里的元素
-   AtomicReferenceArray 原子更新引用类型数组里的元素。

Atomic 引用类型有：

-   AtomicReference 原子更新引用类型
-   AtomicMarkableReference 原子更新带有标记位的引用类型，可以绑定一个 boolean 标记
-   AtomicStampedReference 原子更新带有版本号的引用类型

FieldUpdater 类型：

-   AtomicIntegerFieldUpdater 原子更新整型字段的更新器
-   AtomicLongFieldUpdater 原子更新长整型字段的更新器
-   AtomicReferenceFieldUpdater 原子更新引用类型字段的更新器

### 简述 Atomic 类基本实现原理

以 AtomicIntger 为例。
方法 getAndIncrement，以原子方式将当前的值加 1，具体实现为：

-   在 for 死循环中取得 AtomicInteger 里存储的数值
-   对 AtomicInteger 当前的值加 1
-   调用 compareAndSet 方法进行原子更新
-   先检查当前数值是否等于 expect
-   如果等于则说明当前值没有被其他线程修改，则将值更新为 next，
-   如果不是会更新失败返回 false，程序会进入 for 循环重新进行 compareAndSet 操作。

# Java 并发工具类（JUC）详解

## 目录

-   [1. AQS（AbstractQueuedSynchronizer）详解](#1-aqs)
-   [2. 同步工具类](#2-同步工具类)
-   [3. 并发集合](#3-并发集合)
-   [4. 原子类（Atomic）](#4-原子类)

---

## 1. AQS（AbstractQueuedSynchronizer）详解

### 1.1 AQS 基本概念

**AQS**（AbstractQueuedSynchronizer）是 Java 并发包的核心，为构建锁和同步器提供了通用的基础框架。

**核心特性：**

-   使用 `volatile int state` 变量作为共享资源
-   基于 FIFO 双向队列管理等待线程
-   支持独占模式和共享模式
-   提供了基于 CAS 的无锁算法

**基于 AQS 的同步器：**

-   `ReentrantLock`：可重入锁
-   `ReentrantReadWriteLock`：读写锁
-   `Semaphore`：信号量
-   `CountDownLatch`：倒计时门闩
-   `CyclicBarrier`：循环屏障

### 1.2 AQS 工作原理

#### 1.2.1 独占模式（Exclusive Mode）

**获取锁流程（acquire）：**

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

1. **tryAcquire(arg)**：尝试获取锁，由子类实现具体逻辑
2. **addWaiter(Node.EXCLUSIVE)**：获取失败时，将当前线程封装成 Node 节点加入等待队列尾部
3. **acquireQueued()**：在队列中自旋等待，直到获取锁或被中断

**释放锁流程（release）：**

```java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

1. **tryRelease(arg)**：尝试释放锁，由子类实现
2. **unparkSuccessor(h)**：唤醒头节点的后继节点

#### 1.2.2 共享模式（Shared Mode）

**获取锁流程（acquireShared）：**

-   `tryAcquireShared()`：返回值 ≥ 0 表示获取成功
-   获取成功时可能会传播唤醒后续等待的共享节点

**释放锁流程（releaseShared）：**

-   `tryReleaseShared()`：释放共享锁
-   唤醒后续等待的节点

### 1.3 Node 节点状态

```java
static final class Node {
    static final int CANCELLED =  1;  // 线程已取消
    static final int SIGNAL    = -1;  // 后继节点需要被唤醒
    static final int CONDITION = -2;  // 线程在条件队列中等待
    static final int PROPAGATE = -3;  // 共享模式下，释放操作需要传播

    volatile int waitStatus;           // 节点状态
    volatile Node prev;                // 前驱节点
    volatile Node next;                // 后继节点
    volatile Thread thread;            // 关联的线程
}
```

---

## 2. 同步工具类

### 2.1 CountDownLatch（倒计时门闩）

**功能：** 让一个或多个线程等待其他线程完成操作后再执行。

**特点：**

-   基于 AQS 的共享模式实现
-   一次性使用，不可重置
-   计数器减到 0 时，所有等待线程被唤醒

**使用示例：**

```java
public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        final int threadCount = 3;
        CountDownLatch latch = new CountDownLatch(threadCount);

        // 启动工作线程
        for (int i = 0; i < threadCount; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    System.out.println("线程" + threadId + "开始工作");
                    Thread.sleep(2000); // 模拟工作
                    System.out.println("线程" + threadId + "完成工作");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown(); // 计数器减1
                }
            }).start();
        }

        // 等待所有线程完成
        latch.await();
        System.out.println("所有线程完成，主线程继续执行");
    }
}
```

### 2.2 CyclicBarrier（循环屏障）

**功能：** 让一组线程互相等待，直到所有线程都到达屏障点，然后同时继续执行。

**特点：**

-   可重复使用（reset）
-   支持屏障动作（barrierAction）
-   基于 ReentrantLock 和 Condition 实现

**使用示例：**

```java
public class CyclicBarrierExample {
    public static void main(String[] args) {
        final int threadCount = 3;
        CyclicBarrier barrier = new CyclicBarrier(threadCount, () -> {
            System.out.println("所有线程都到达屏障点，开始下一阶段！");
        });

        for (int i = 0; i < threadCount; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    System.out.println("线程" + threadId + "开始第一阶段工作");
                    Thread.sleep(2000);
                    System.out.println("线程" + threadId + "完成第一阶段，等待其他线程");

                    barrier.await(); // 等待其他线程

                    System.out.println("线程" + threadId + "开始第二阶段工作");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

### 2.3 CountDownLatch vs CyclicBarrier

| 特性         | CountDownLatch    | CyclicBarrier             |
| ------------ | ----------------- | ------------------------- |
| **计数方式** | 递减到 0          | 递增到指定值              |
| **重用性**   | 一次性使用        | 可重复使用                |
| **等待机制** | 一个/多个线程等待 | 所有线程互相等待          |
| **回调支持** | 不支持            | 支持屏障动作              |
| **底层实现** | AQS 共享模式      | ReentrantLock + Condition |

### 2.4 Semaphore（信号量）

**功能：** 控制同时访问资源的线程数量。

**特点：**

-   基于 AQS 的共享模式
-   支持公平和非公平模式
-   可动态增减许可证数量

**使用示例：**

```java
public class SemaphoreExample {
    public static void main(String[] args) {
        // 允许最多3个线程同时访问
        Semaphore semaphore = new Semaphore(3);

        for (int i = 0; i < 10; i++) {
            final int threadId = i;
            new Thread(() -> {
                try {
                    semaphore.acquire(); // 获取许可证
                    System.out.println("线程" + threadId + "获得许可证，开始工作");
                    Thread.sleep(2000); // 模拟工作
                    System.out.println("线程" + threadId + "完成工作，释放许可证");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    semaphore.release(); // 释放许可证
                }
            }).start();
        }
    }
}
```

### 2.5 Exchanger（数据交换器）

**功能：** 两个线程间的数据交换点。

**特点：**

-   只能用于两个线程间
-   线程安全的数据交换
-   支持超时等待

**使用示例：**

```java
public class ExchangerExample {
    public static void main(String[] args) {
        Exchanger<String> exchanger = new Exchanger<>();

        // 线程1
        new Thread(() -> {
            try {
                String data = "来自线程1的数据";
                System.out.println("线程1准备交换数据: " + data);
                String result = exchanger.exchange(data);
                System.out.println("线程1收到数据: " + result);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        // 线程2
        new Thread(() -> {
            try {
                String data = "来自线程2的数据";
                System.out.println("线程2准备交换数据: " + data);
                String result = exchanger.exchange(data);
                System.out.println("线程2收到数据: " + result);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

---

## 3. 并发集合

### 3.1 ConcurrentHashMap 详解

`ConcurrentHashMap` 是线程安全的哈希表实现，在不同 JDK 版本中有显著的优化演进。

#### 3.1.1 JDK 1.7 实现（分段锁）

**核心结构：**

```
ConcurrentHashMap
├── Segment[] segments     // 分段数组
    ├── Segment[0]
    │   └── HashEntry[] table
    ├── Segment[1]
    │   └── HashEntry[] table
    └── ...
```

**特点：**

-   **分段锁技术**：将数据分成多个 Segment，每个 Segment 维护一把锁
-   **并发度**：等于 Segment 数量，默认 16
-   **锁粒度**：锁定整个 Segment，即整个 HashEntry 数组

**关键操作：**

-   **get 操作**：几乎无锁，只有读到空值时才加锁
-   **put 操作**：需要获取 Segment 锁，然后在对应的 HashEntry 数组中操作
-   **扩容**：只扩容单个 Segment 内的数组

#### 3.1.2 JDK 1.8 优化（Node + 红黑树）

**核心结构：**

```
ConcurrentHashMap
├── Node[] table           // 主数组
├── TreeNode (红黑树)      // 链表转换为红黑树
└── CAS + synchronized     // 细粒度锁
```

**重大改进：**

1. **取消分段锁**：

    - 改用 CAS + synchronized 的组合
    - 锁粒度更细，只锁定数组的一个位置

2. **引入红黑树**：

    ```java
    // 链表转红黑树的条件
    static final int TREEIFY_THRESHOLD = 8;     // 链表长度阈值
    static final int MIN_TREEIFY_CAPACITY = 64; // 数组容量阈值
    ```

3. **优化计算方式**：
    - 使用 CounterCell 数组统计元素数量
    - 避免高并发时的计数竞争

**关键操作流程：**

**PUT 操作：**

```java
final V putVal(K key, V value, boolean onlyIfAbsent) {
    // 1. 计算hash值
    int hash = spread(key.hashCode());

    for (Node<K,V>[] tab = table;;) {
        // 2. 如果表为空，初始化
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        // 3. 如果对应位置为空，CAS插入
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))
                break;
        }
        // 4. 如果正在扩容，帮助扩容
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        // 5. 加锁处理冲突
        else {
            synchronized (f) {
                // 链表或红黑树插入逻辑
            }
        }
    }
}
```

#### 3.1.3 性能对比

| 维度           | JDK 1.7          | JDK 1.8          |
| -------------- | ---------------- | ---------------- |
| **锁粒度**     | Segment 级别     | Node 级别        |
| **并发度**     | Segment 数量(16) | 数组长度         |
| **数据结构**   | 数组+链表        | 数组+链表+红黑树 |
| **查找复杂度** | O(n)             | O(log n)         |
| **内存占用**   | 较高             | 较低             |

---

## 4. 原子类（Atomic）

### 4.1 原子类概述

**Atomic**类提供了一种无锁的线程安全编程方式，基于 CAS（Compare And Swap）操作实现。

**优势：**

-   **性能更高**：避免了 synchronized 的重量级锁开销
-   **无阻塞**：基于 CAS 的乐观锁机制
-   **原子性**：保证操作的原子性，避免中间状态

**分类：**
根据操作的数据类型，JUC 包中的原子类分为 4 大类：

### 4.2 基本类型原子类

**主要类：**

-   `AtomicInteger`：整型原子类
-   `AtomicLong`：长整型原子类
-   `AtomicBoolean`：布尔型原子类

#### 4.2.1 AtomicInteger 详解

**常用方法：**

```java
public final int get()                    // 获取当前值
public final int getAndSet(int newValue)  // 获取当前值并设置新值
public final int getAndIncrement()        // 获取当前值并自增
public final int getAndDecrement()        // 获取当前值并自减
public final int getAndAdd(int delta)     // 获取当前值并加上指定值
public final int incrementAndGet()        // 自增并获取新值
public final int decrementAndGet()        // 自减并获取新值
public final int addAndGet(int delta)     // 加上指定值并获取新值
public final boolean compareAndSet(int expect, int update)  // CAS操作
public final void lazySet(int newValue)   // 延迟设置（性能优化）
```

**使用示例对比：**

**传统 synchronized 方式：**

```java
public class CounterWithSync {
    private volatile int count = 0;

    // 需要同步保证线程安全
    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

**AtomicInteger 方式：**

```java
public class CounterWithAtomic {
    private AtomicInteger count = new AtomicInteger(0);

    // 无锁操作，性能更高
    public void increment() {
        count.incrementAndGet();
    }

    public int getCount() {
        return count.get();
    }
}
```

#### 4.2.2 原理分析

**AtomicInteger 核心源码：**

```java
public class AtomicInteger extends Number implements java.io.Serializable {
    // 获取Unsafe实例，用于直接操作内存
    private static final Unsafe unsafe = Unsafe.getUnsafe();

    // value字段在对象内存中的偏移量
    private static final long valueOffset;

    static {
        try {
            valueOffset = unsafe.objectFieldOffset
                (AtomicInteger.class.getDeclaredField("value"));
        } catch (Exception ex) {
            throw new Error(ex);
        }
    }

    // 实际存储的值，使用volatile保证可见性
    private volatile int value;

    // CAS操作的核心实现
    public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }
}
```

**CAS 原理：**

1. **比较**：比较内存中的值与期望值
2. **交换**：如果相等，则更新为新值
3. **原子性**：整个操作由 CPU 保证原子性
4. **重试**：如果 CAS 失败，通常在循环中重试

**getAndIncrement 实现：**

```java
public final int getAndIncrement() {
    return unsafe.getAndAddInt(this, valueOffset, 1);
}

// Unsafe类中的实现
public final int getAndAddInt(Object o, long offset, int delta) {
    int v;
    do {
        v = getIntVolatile(o, offset);  // 获取当前值
    } while (!compareAndSwapInt(o, offset, v, v + delta));  // CAS更新
    return v;
}
```

### 4.3 数组类型原子类

**主要类：**

-   `AtomicIntegerArray`：整型数组原子类
-   `AtomicLongArray`：长整型数组原子类
-   `AtomicReferenceArray`：引用类型数组原子类

**使用示例：**

```java
public class AtomicArrayExample {
    public static void main(String[] args) {
        AtomicIntegerArray array = new AtomicIntegerArray(10);

        // 并发更新数组元素
        for (int i = 0; i < 10; i++) {
            final int index = i;
            new Thread(() -> {
                // 原子性地增加指定索引位置的值
                int newValue = array.incrementAndGet(index);
                System.out.println("索引" + index + "的新值: " + newValue);
            }).start();
        }
    }
}
```

### 4.4 引用类型原子类

**主要类：**

-   `AtomicReference<T>`：引用类型原子类
-   `AtomicStampedReference<T>`：带版本号的引用类型（解决 ABA 问题）
-   `AtomicMarkableReference<T>`：带标记位的引用类型

#### 4.4.1 AtomicReference 使用

```java
public class AtomicReferenceExample {
    private static AtomicReference<User> userRef = new AtomicReference<>();

    static class User {
        private String name;
        private int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public String toString() {
            return "User{name='" + name + "', age=" + age + "}";
        }
    }

    public static void main(String[] args) {
        User user1 = new User("张三", 25);
        User user2 = new User("李四", 30);

        userRef.set(user1);

        // 原子性地更新用户对象
        boolean success = userRef.compareAndSet(user1, user2);
        System.out.println("更新成功: " + success);
        System.out.println("当前用户: " + userRef.get());
    }
}
```

#### 4.4.2 ABA 问题与解决方案

**ABA 问题：**
线程 1 读取值 A，线程 2 将 A 改为 B 再改回 A，线程 1 的 CAS 操作仍会成功，但实际上值已经被修改过。

**AtomicStampedReference 解决方案：**

```java
public class ABAExample {
    private static AtomicStampedReference<Integer> atomicRef =
        new AtomicStampedReference<>(100, 0);

    public static void main(String[] args) throws InterruptedException {
        int[] stampHolder = new int[1];
        Integer value = atomicRef.get(stampHolder);
        int stamp = stampHolder[0];

        // 线程1：尝试CAS操作
        new Thread(() -> {
            try {
                Thread.sleep(1000); // 等待其他操作完成
                boolean success = atomicRef.compareAndSet(value, 200, stamp, stamp + 1);
                System.out.println("线程1 CAS操作: " + success);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        // 线程2：进行ABA操作
        new Thread(() -> {
            atomicRef.compareAndSet(100, 50, stamp, stamp + 1);
            atomicRef.compareAndSet(50, 100, stamp + 1, stamp + 2);
            System.out.println("线程2 完成ABA操作");
        }).start();

        Thread.sleep(2000);
    }
}
```

### 4.5 字段更新原子类

**主要类：**

-   `AtomicIntegerFieldUpdater<T>`：原子更新整型字段
-   `AtomicLongFieldUpdater<T>`：原子更新长整型字段
-   `AtomicReferenceFieldUpdater<T,V>`：原子更新引用类型字段

**使用要求：**

1. 字段必须是`volatile`修饰
2. 字段必须是非`static`的
3. 字段必须是非`final`的
4. 对于`AtomicIntegerFieldUpdater`和`AtomicLongFieldUpdater`，字段类型必须是`int`或`long`

**使用示例：**

```java
public class FieldUpdaterExample {
    static class User {
        volatile String name;
        volatile int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public String toString() {
            return "User{name='" + name + "', age=" + age + "}";
        }
    }

    public static void main(String[] args) {
        // 创建字段更新器
        AtomicIntegerFieldUpdater<User> ageUpdater =
            AtomicIntegerFieldUpdater.newUpdater(User.class, "age");

        AtomicReferenceFieldUpdater<User, String> nameUpdater =
            AtomicReferenceFieldUpdater.newUpdater(User.class, String.class, "name");

        User user = new User("张三", 25);
        System.out.println("初始状态: " + user);

        // 原子更新age字段
        int newAge = ageUpdater.incrementAndGet(user);
        System.out.println("年龄+1后: " + user + ", 新年龄: " + newAge);

        // 原子更新name字段
        boolean nameUpdated = nameUpdater.compareAndSet(user, "张三", "李四");
        System.out.println("姓名更新成功: " + nameUpdated + ", 结果: " + user);
    }
}
```

### 4.6 JDK 8 新增原子类

**LongAdder 和 DoubleAdder：**
针对高并发场景下的计数操作进行优化，性能比 AtomicLong 更好。

**核心思想：**

-   **分散热点**：将单个变量的竞争分散到多个变量上
-   **最终汇总**：读取时将所有分段的值求和

**使用示例：**

```java
public class LongAdderExample {
    public static void main(String[] args) throws InterruptedException {
        LongAdder counter = new LongAdder();
        int threadCount = 10;
        CountDownLatch latch = new CountDownLatch(threadCount);

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                for (int j = 0; j < 100000; j++) {
                    counter.increment();  // 比AtomicLong.incrementAndGet()更快
                }
                latch.countDown();
            }).start();
        }

        latch.await();
        long endTime = System.currentTimeMillis();

        System.out.println("最终计数: " + counter.sum());
        System.out.println("耗时: " + (endTime - startTime) + "ms");
    }
}
```

### 4.7 原子类性能对比

| 场景         | AtomicLong | LongAdder | 说明                           |
| ------------ | ---------- | --------- | ------------------------------ |
| **低并发**   | 性能相近   | 性能相近  | 差异不明显                     |
| **高并发读** | 较好       | 更好      | LongAdder 分散读取压力         |
| **高并发写** | 较差       | 更好      | LongAdder 避免 CAS 竞争        |
| **内存占用** | 较少       | 较多      | LongAdder 需要额外的 Cell 数组 |

### 4.8 原子类最佳实践

1. **选择合适的原子类**：

    - 简单计数：优先考虑 LongAdder
    - 需要精确控制：使用 AtomicLong
    - 复杂对象：使用 AtomicReference

2. **避免 ABA 问题**：

    - 使用 AtomicStampedReference
    - 或者设计时避免 ABA 场景

3. **注意性能特点**：

    - 低并发场景：原子类和 synchronized 性能相近
    - 高并发场景：原子类性能显著更好

4. **合理使用 CAS**：
    - 适合冲突较少的场景
    - 高冲突场景可能导致大量重试

---

## 总结

JUC 包提供了丰富的并发工具类，每种工具都有其特定的使用场景：

-   **AQS**：并发工具的基础框架
-   **同步工具类**：解决线程协调问题
-   **并发集合**：提供线程安全的数据结构
-   **原子类**：提供无锁的原子操作

正确理解和使用这些工具类，能够帮助我们编写出高性能、线程安全的并发程序。
