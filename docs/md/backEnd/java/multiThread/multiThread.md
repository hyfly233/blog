# 多线程基础

## 进程

+ 把一个任务称为一个进程，浏览器就是一个进程，播放器是另一个进程



## 线程

+ 进程内部还需要同时执行多个子任务。例如，使用Word时，Word可以一边打字，一边进行拼写检查，同时还可以在后台进行打印，子任务称为线程

+ 操作系统调度的最小任务单位是线程 



## 进程和线程的关系

+ 一个进程可以包含一个或多个线程，但至少会有一个线程

+ 同一个应用程序，既可以有多个进程，也可以有多个线程 

+ 进程和线程是包含关系

  多任务既可以由多进程实现，也可以由单进程内的多线程实现，还可以混合多进程＋多线程

+ 一个进程包括由操作系统分配的内存空间，包含一个或多个线程；一个线程不能独立的存在，它必须是进程的一部分；一个进程一直运行，直到所有的非守护线程都结束运行后才能结束



+ 多进程的缺点
  + 创建进程比创建线程开销大，尤其是在Windows系统上
  + 进程间通信比线程间通信要慢，因为线程间通信就是读写同一个变量，速度很快

+ 多进程的优点
  + 多进程稳定性高，一个进程崩溃不会影响其他进程



## 多线程

+ 一条线程是进程中一个单一顺序的控制流，一个进程中可以并发多个线程，每条线程并行执行不同的任务
+ 多线程是多任务的一种特别的形式，但多线程使用了更小的资源开销
+ 多线程能满足程序员编写高效率的程序来达到充分利用 CPU 的目的
+ 一个`Java`程序实际上是一个`JVM`进程，`JVM`进程用一个主线程来执行`main()`方法，在`main()`方法内部，又可以启动多个线程。`JVM`还有负责垃圾回收的其他工作线程等

+ 多线程编程的特点在于：多线程经常需要读写共享数据，并且需要同步。例如，播放电影时，就必须由一个线程播放视频，另一个线程播放音频，两个线程需要协调运行，否则画面和声音就不同步
+ 多线程模型是Java程序最基本的并发模型



# 线程的状态

## 线程生命周期

![](https://tse1-mm.cn.bing.net/th/id/R-C.f8704fa643ba821648c6a0cf88f9a2b4?rik=sPIwW2Vx8n21tQ&riu=http%3a%2f%2fupload-images.jianshu.io%2fupload_images%2f6516264-acdde18e59303351.png&ehk=JmJu2sUiI4cM1A47ypOjlAyLlZZYQPwMb2HU6PlzDBQ%3d&risl=&pid=ImgRaw&r=0)



- 新建状态

  使用 `new` 关键字和 `Thread` 类或其子类建立一个线程对象后，该线程对象就处于新建状态。它保持这个状态直到程序 `start()`这个线程。

- 就绪状态

  当线程对象调用了`start()`方法之后，该线程就进入就绪状态。就绪状态的线程处于就绪队列中，要等待`JVM`里线程调度器的调度。

- 运行状态

  如果就绪状态的线程获取 CPU 资源，就可以执行`run()`，此时线程便处于运行状态。处于运行状态的线程最为复杂，它可以变为阻塞状态、就绪状态和死亡状态。

- 阻塞状态

  如果一个线程执行了`sleep（睡眠）`、`suspend（挂起）`等方法，失去所占用资源之后，该线程就从运行状态进入阻塞状态。在睡眠时间已到或获得设备资源后可以重新进入就绪状态。可以分为三种：

  - 等待阻塞：运行状态中的线程执行`wait()`方法，使线程进入到等待阻塞状态。
  - 同步阻塞：线程在获取`synchronized`同步锁失败（因为同步锁被其他线程占用）。
  - 其他阻塞：通过调用线程的`sleep()`或`join()`发出了 I/O 请求时，线程就会进入到阻塞状态。当`sleep()`状态超时，`join()`等待线程终止或超时，或者 I/O 处理完毕，线程重新转入就绪状态。

- 死亡状态

  一个运行状态的线程完成任务或者其他终止条件发生时，该线程就切换到终止状态。



## Java线程的状态

在`Java`中，一个线程对象只能调用一次`start()`方法启动新线程，并在新线程中执行`run()`方法。一旦`run()`方法执行完毕，线程就结束了

- New：新创建的线程，尚未执行；
- Runnable：运行中的线程，正在执行`run()`方法的Java代码；
- Blocked：运行中的线程，因为某些操作被阻塞而挂起；
- Waiting：运行中的线程，因为某些操作在等待中；
- Timed Waiting：运行中的线程，因为执行`sleep()`方法正在计时等待；
- Terminated：线程已终止，因为`run()`方法执行完毕。





# 线程的优先级

每一个 Java 线程都有一个优先级，这样有助于操作系统确定线程的调度顺序。

Java 线程的优先级是一个整数，其取值范围是 1 （Thread.MIN_PRIORITY ） - 10 （Thread.MAX_PRIORITY ）。

默认情况下，每一个线程都会分配一个优先级 NORM_PRIORITY（5）。

具有较高优先级的线程对程序更重要，并且应该在低优先级的线程之前分配处理器资源。但是，线程优先级不能保证线程执行的顺序，而且非常依赖于平台



# 创建线程的方式

## 实现 Runnable 接口

实现`Runnable` 接口，重写`run()`，无返回值，无法抛出异常

```java
public class RunnableThread implements Runnable {
	@Override
    public void run() {
		System.out.println("用实现Runnable接口实现线程");
	}
}
```

将 `RunnableThread` 对象传入 `Thread`对象中，再调用 `start()`方法

```java
public static void main(String[] args) {
    Thread t = new Thread(new RunnableThread());
    t.setDaemon(true); // 守护进程
    t.start();
}
```





## 继承 Thread 类

继承`java.lang.Thread类`，重写`run()`，调用`start()`开启线程，无返回值

```java
public class ExtendsThread extends Thread {
	@Override
    public void run() {
		System.out.println("用实现Runnable接口实现线程");
	}
}

public static void main(String[] args) {
    Thread t = new ExtendsThread();
    t.start();
}
```

本质上`Thread`实现`Runnable`接口

```java
public class Thread implements Runnable { }
```

启动线程的唯一方法是通过`Thread` 类的`start()`实例方法

```java
public synchronized void start() {
        
    if (threadStatus != 0) throw new IllegalThreadStateException();

    group.add(this);

    boolean started = false;
    try {
        start0();
        started = true;
    } finally {
        try {
            if (!started) {
                group.threadStartFailed(this);
            }
        } catch (Throwable ignore) {

        }
    }
}

private native void start0();
```

`start()`会调用一个叫`start0()` 的 `native`方法，它将启动一个新线程，并执行`run()`



## 实现 Callable 接口

实现`java.util.concurrent.Callable 接口`：重写 `call()`，任务执行后有返回值，可以抛出异常

```java
public class CallableThread implements Callable<Object> {

    @Override
    public Object call() throws Exception {
        return null;
    }
}

new CallableThread().call();
```







## 匿名内部类



## Lambda

```java
new Thread(() -> {
    // todo
}).start();
```



## FutureTask

```java
public class FutureTaskDemo {

    public static void main(String[] args) throws Exception {
        FutureTask<String> task = new FutureTask<>(new Callable<String>() {
            @Override
            public String call() throws Exception {
                return "SUCCESS";
            }
        });

        new Thread(task).start();

        System.out.println(task.get()); // 阻塞
    }
}
```

本质上`FutureTask`实现`Runnable`接口

```java
public class FutureTask<V> implements RunnableFuture<V> { }

public interface RunnableFuture<V> extends Runnable, Future<V> { }
```

```java
// FutureTask run
public void run() {
    if (state != NEW || !RUNNER.compareAndSet(this, null, Thread.currentThread()))
        return;
    try {
        Callable<V> c = callable;
        if (c != null && state == NEW) {
            V result;
            boolean ran;
            try {
                result = c.call();
                ran = true;
            } catch (Throwable ex) {
                result = null;
                ran = false;
                setException(ex);
            }
            if (ran)
                set(result);
        }
    } finally {
        // runner must be non-null until state is settled to
        // prevent concurrent calls to run()
        runner = null;
        // state must be re-read after nulling runner to prevent
        // leaked interrupts
        int s = state;
        if (s >= INTERRUPTING)
            handlePossibleCancellationInterrupt(s);
    }
}

// FutureTask get
public V get() throws InterruptedException, ExecutionException {
    int s = state;
    if (s <= COMPLETING)
        s = awaitDone(false, 0L);  // 死循环，等待方法执行完改变结果
    return report(s);
}
```



## TimerTask

```java
public static void main(String[] args) {
    Timer timer = new Timer();

    timer.schedule(new TimerTask() {
        @Override
        public void run() {
            // todo
        }
    }, 20);
}
```

本质上`TimerTask`实现`Runnable`接口

```java
public abstract class TimerTask implements Runnable { }
```





## 线程池

线程池是一种多线程处理形式，处理过程中将任务添加到队列，然后在创建线程后自动执行这些任务

如果并发请求数量很多，但每个线程执行的时间很短，就会出现频繁的创建和销毁线程。会大大降低系统的效率，可能频繁创建和销毁线程的时间、资源开销要大于实际工作的所需



### Executor 框架

Executor 框架是一个根据一组执行策略调用，调度，执行和控制的异步任务的框架。 

#### 核心 API

- Executor：运行任务的简单接口

  ```java
  public interface Executor {
      void execute(Runnable command);
  }
  ```

  

- ExecutorService： 扩展了`Executor`接口 

  - 支持有返回值的线程
  - 支持管理线程的生命周期

  

  ```java
  public interface ExecutorService extends Executor {
  
      // 启动有序关闭，其中执行先前提交的任务，但不会接受新任务
      void shutdown();
  
      // 尝试停止所有正在执行的任务，停止等待任务的处理，并返回等待执行的任务列表
      List<Runnable> shutdownNow();
  
      boolean isShutdown();
  
      boolean isTerminated();
  
      // 阻塞，直到所有任务都完成执行
      boolean awaitTermination(long timeout, TimeUnit unit)
          throws InterruptedException;
  
      // 提交一个任务并执行
      <T> Future<T> submit(Callable<T> task);
  
      <T> Future<T> submit(Runnable task, T result);
  
      Future<?> submit(Runnable task);
  
      // 执行给定的任务
      <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)
          throws InterruptedException;
  
      <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks,
                                    long timeout, TimeUnit unit)
          throws InterruptedException;
  
      <T> T invokeAny(Collection<? extends Callable<T>> tasks)
          throws InterruptedException, ExecutionException;
  
      <T> T invokeAny(Collection<? extends Callable<T>> tasks,
                      long timeout, TimeUnit unit)
          throws InterruptedException, ExecutionException, TimeoutException;
  }
  ```

  

- ScheduledExecutorService：扩展了 `ExecutorService` 接口

  + 支持定期执行任务

  

  ```java
  public interface ScheduledExecutorService extends ExecutorService {
  
      // 提交在给定延迟后启用的一次性任务
      public ScheduledFuture<?> schedule(Runnable command,
                                         long delay, TimeUnit unit);
  
      public <V> ScheduledFuture<V> schedule(Callable<V> callable,
                                             long delay, TimeUnit unit);
  
      // 提交一个周期性操作
      public ScheduledFuture<?> scheduleAtFixedRate(Runnable command,
                                                    long initialDelay,
                                                    long period,
                                                    TimeUnit unit);
  
      public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command,
                                                       long initialDelay,
                                                       long delay,
                                                       TimeUnit unit);
  }
  ```

  

- AbstractExecutorService：`ExecutorService` 接口的默认实现

  

- ThreadPoolExecutor：`Executor` 框架最核心的类，它继承了 `AbstractExecutorService` 类

  

- ScheduledThreadPoolExecutor：`ScheduledExecutorService` 接口的实现，一个可定时调度任务的线程池

  

- Executors：可以通过调用 `Executors` 的静态工厂方法来创建线程池并返回一个 `ExecutorService` 对象

  主要方法：

  + newFixedThreadPool

    创建一个固定大小的线程池，默认情况：`LinkedBlockingQueue`的长度为`Integer.MAX_VALUE`，线程工厂为`Executors.defaultThreadFactory()`，默认拒接策略

    ```java
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
    ```

    

  + newWorkStealingPool

    使用所有可用处理器作为目标并行度，创建一个窃取线程的池， 是基于 **work-stealing** 算法的，其中一个任务可以产生其他较小的任务，这些任务被添加到并行处理线程的队列中。 如果一个线程完成了工作并且无事可做，则可以从另一线程的队列中"窃取"工作。 

    ```java
    public static ExecutorService newWorkStealingPool() {
        return new ForkJoinPool
            (Runtime.getRuntime().availableProcessors(),
             ForkJoinPool.defaultForkJoinWorkerThreadFactory,
             null, true);
    }
    ```

    

  + newSingleThreadExecutor

    单线程的线程池，默认情况：`LinkedBlockingQueue`的长度为`Integer.MAX_VALUE`，线程工厂为`Executors.defaultThreadFactory()`，默认拒接策略

    ```java
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
    ```

    

  + newCachedThreadPool

    创建一个可缓存的线程池，根据需要创建新线程，但在可用时将重用以前构造的线程

    60s内未使用的线程将被终止并从缓存中删除

    具有非公平访问策略的 SynchronousQueue 

    ```java
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
    ```

    

  + newScheduledThreadPool

    创建一个线程池，可以安排命令在给定延迟后运行，或定期执行

    ```java
    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }
    
    public ScheduledThreadPoolExecutor(int corePoolSize) {
        super(corePoolSize, Integer.MAX_VALUE,
              DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
              new DelayedWorkQueue());
    }
    ```

    

#### Executor 框架结构

+ 任务（`Runnable` /`Callable`）

  执行任务需要实现的 **`Runnable` 接口** 或 **`Callable`接口**。**`Runnable` 接口**或 **`Callable` 接口** 实现类都可以被 **`ThreadPoolExecutor`** 或 **`ScheduledThreadPoolExecutor`** 执行

  

+ 任务的执行（`Executor`）

   **`ThreadPoolExecutor`** 和 **`ScheduledThreadPoolExecutor`** 这两个关键类实现了 **ExecutorService 接口**

  

+ 异步计算的结果（`Future`）

   **`Future`** 接口以及 `Future` 接口的实现类 **`FutureTask`** 类都可以代表异步计算的结果 



### 线程池种类

+ newSingleThreadExecutor：单线程的线程池
+ newFixedThreadPool：固定大小的线程池
+ newCachedThreadPool：可缓存的线程池
+ newScheduleThreadPool：大小无限的线程池，延迟后运行，或定期执行
+ newWorkStealingPool： 使用所有可用处理器作为目标并行度，创建一个窃取线程的池， 是基于 **work-stealing** 算法的，其中一个任务可以产生其他较小的任务，这些任务被添加到并行处理线程的队列中 



### 线程池参数

+ **corePoolSize**：线程池的核心线程数

  当有任务提交到线程池时，如果线程池中的线程数小于`corePoolSize`，那么则直接创建新的线程来执行任务

  

+ **maximumPoolSize**：线程池支持的最大线程数量

  当一个任务提交到线程池时，线程池中的线程数大于`corePoolSize`，并且`workQueue`已满，那么则会创建新的线程执行任务，但是线程数要小于等于`maximumPoolSize`

  

+ **keepAliveTime**：非核心线程空闲时保持存活的时间

  非核心线程即`workQueue`满了之后，再提交任务时创建的线程，因为这些线程不是核心线程，所以它空闲时间超过`keepAliveTime`后则会被回收

  

+ **unit**：非核心线程空闲时保持存活的时间的单位

  

+ **threadFactory**：创建线程的工厂，可以在这里统一处理创建线程的属性

  

+ **workQueue**：任务队列

  它是一个阻塞队列，用于存储来不及执行的任务的队列。当有任务提交到线程池的时候，如果线程池中的线程数大于等于`corePoolSize`，那么这个任务则会先被放到这个队列中，等待执行

  

+ **handler**：拒绝策略

  当线程池中的线程达到maximumPoolSize线程数后且workQueue已满的情况下，再向线程池提交任务则执行对应的拒绝策略




## Spring 注解

使用`Spring 注解`：`@EnableAsync，@Async`

```java
@EnableAsync
@Configuration
public class AsyncConfig implements AsyncConfigurer {

    @Bean
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor threadPool = new ThreadPoolTaskExecutor();

        threadPool.setCorePoolSize(10);
        threadPool.setMaxPoolSize(20);
        threadPool.setQueueCapacity(10);
        threadPool.setWaitForTasksToCompleteOnShutdown(true);
        threadPool.setAwaitTerminationSeconds(60);
        threadPool.setThreadNamePrefix("Test-Async-");

        return threadPool;
    }
}
```



```java
@Service
public class AsyncService {

    @Async
    public void executeAsyncTask(int i) {
        System.out.println("线程 " + Thread.currentThread().getName() + " 执行任务：" + i);
    }
}
```



```java
@SpringBootTest
class DemoApplicationTests {

    @Autowired
    AsyncService asyncService;

    @Test
    void contextLoads() {
    }

    @Test
    void test(){
        for (int i = 0; i < 20; i++) {
            asyncService.executeAsyncTask(i);
        }
    }
}
```





# 线程安全

当进程中有多个并发线程进入一个重要数据的代码块时，在修改数据的过程中，很有可能引发线程安全问题，从而造成数据异常 



## 保证线程安全

+ 同步方法

  + 阻塞
    + Synchronized
    + ReentrantLock
  + 非阻塞
    + CAS

  

+ 非同步方法

  + Reentrant code（可重入代码）
  + ThreadLocal











# 多线程面试

## 什么是进程，什么是线程，为什么需要多线程编程？

进程是具有一定独立功能的程序关于某个数据集合上的一次运行活动，是操作系统进行资源分配和调度的一个独立单位；

线程是进程的一个实体，是CPU调度和分派的基本单位，是比进程更小的能独立运行的基本单位。线程的划分尺度小于进程，这使得多线程程序的并发性高；进程在执行时通常拥有独立的内存单元，而线程之间可以共享内存。

使用多线程的编程通常能够带来更好的性能和用户体验，但是多线程的程序对于其他程序是不友好的，因为它可能占用了更多的CPU资源。当然，也不是线程越多，程序的性能就越好，因为线程之间的调度和切换也会浪费CPU时间。时下很时髦的Node.js就采用了单线程异步I/O的工作模式



## 什么是线程安全

如果你的代码在多线程下执行和在单线程下执行永远都能获得一样的结果，那么你的代码就是线程安全的。

这个问题有值得一提的地方，就是线程安全也是有几个级别的：

- 不可变。像String、Integer、Long这些，都是final类型的类，任何一个线程都改变不了它们的值，要改变除非新创建一个，因此这些不可变对象不需要任何同步手段就可以直接在多线程环境下使用
- 绝对线程安全。不管运行时环境如何，调用者都不需要额外的同步措施。要做到这一点通常需要付出许多额外的代价，Java中标注自己是线程安全的类，实际上绝大多数都不是线程安全的，不过绝对线程安全的类，Java中也有，比方说CopyOnWriteArrayList、CopyOnWriteArraySet
- 相对线程安全。相对线程安全也就是我们通常意义上所说的线程安全，像Vector这种，add、remove方法都是原子操作，不会被打断，但也仅限于此，如果有个线程在遍历某个Vector、有个线程同时在add这个Vector，99%的情况下都会出现ConcurrentModificationException，也就是fail-fast机制。
- 线程非安全。这个就没什么好说的了，ArrayList、LinkedList、HashMap等都是线程非安全的类

## 编写多线程程序有几种实现方式？

Java 5以前实现多线程有两种实现方法：一种是继承Thread类；另一种是实现Runnable接口。
两种方式都要通过重写run()方法来定义线程的行为，推荐使用后者，因为Java中的继承是单继承，一个类有一个父类，如果继承了Thread类就无法再继承其他类了，显然使用Runnable接口更为灵活。

Java 5以后创建线程还有第三种方式：实现Callable接口，该接口中的call方法可以在线程执行结束时产生一个返回值。

## synchronized关键字的用法？

synchronized关键字可以将对象或者方法标记为同步，以实现对对象和方法的互斥访问，可以用synchronized(对象) { … }定义同步代码块，或者在声明方法时将synchronized作为方法的修饰符。

## 简述synchronized 和java.util.concurrent.locks.Lock的异同？

Lock是Java 5以后引入的新的API，和关键字synchronized相比主要相同点：Lock 能完成synchronized所实现的所有功能；主要不同点：Lock有比synchronized更精确的线程语义和更好的性能，而且不强制性的要求一定要获得锁。synchronized会自动释放锁，而Lock一定要求程序员手工释放，并且最好在finally 块中释放（这是释放外部资源的最好的地方）。

## 当一个线程进入一个对象的synchronized方法A之后，其它线程是否可进入此对象的synchronized方法B？

不能。其它线程只能访问该对象的非同步方法，同步方法则不能进入。因为非静态方法上的synchronized修饰符要求执行方法时要获得对象的锁，如果已经进入A方法说明对象锁已经被取走，那么试图进入B方法的线程就只能在等锁池（注意不是等待池哦）中等待对象的锁。

## synchronized和ReentrantLock的区别

synchronized是和if、else、for、while一样的关键字，ReentrantLock是类，这是二者的本质区别。既然ReentrantLock是类，那么它就提供了比synchronized更多更灵活的特性，可以被继承、可以有方法、可以有各种各样的类变量，ReentrantLock比synchronized的扩展性体现在几点上：

1. ReentrantLock可以对获取锁的等待时间进行设置，这样就避免了死锁
2. ReentrantLock可以获取各种锁的信息
3. ReentrantLock可以灵活地实现多路通知

另外，二者的锁机制其实也是不一样的:ReentrantLock底层调用的是Unsafe的park方法加锁，synchronized操作的应该是对象头中mark word.

## 举例说明同步和异步。

如果系统中存在临界资源（资源数量少于竞争资源的线程数量的资源），例如正在写的数据以后可能被另一个线程读到，或者正在读的数据可能已经被另一个线程写过了，那么这些数据就必须进行同步存取（数据库操作中的排他锁就是最好的例子）。当应用程序在对象上调用了一个需要花费很长时间来执行的方法，并且不希望让程序等待方法的返回时，就应该使用异步编程，在很多情况下采用异步途径往往更有效率。事实上，所谓的同步就是指阻塞式操作，而异步就是非阻塞式操作。

## 启动一个线程是调用run()还是start()方法？

启动一个线程是调用start()方法，使线程所代表的虚拟处理机处于可运行状态，这意味着它可以由JVM 调度并执行，这并不意味着线程就会立即运行。run()方法是线程启动后要进行回调（callback）的方法。

## 为什么需要run()和start()方法，我们可以只用run()方法来完成任务吗？

我们需要run()&start()这两个方法是因为JVM创建一个单独的线程不同于普通方法的调用，所以这项工作由线程的start方法来完成，start由本地方法实现，需要显示地被调用，使用这俩个方法的另外一个好处是任何一个对象都可以作为线程运行，只要实现了Runnable接口，这就避免因继承了Thread类而造成的Java的多继承问题。

## 什么是线程池（thread pool）？

在面向对象编程中，创建和销毁对象是很费时间的，因为创建一个对象要获取内存资源或者其它更多资源。

在Java中更是如此，虚拟机将试图跟踪每一个对象，以便能够在对象销毁后进行垃圾回收。所以提高服务程序效率的一个手段就是尽可能减少创建和销毁对象的次数，特别是一些很耗资源的对象创建和销毁，这就是“池化资源”技术产生的原因。线程池顾名思义就是事先创建若干个可执行的线程放入一个池（容器）中，需要的时候从池中获取线程不用自行创建，使用完毕不需要销毁线程而是放回池中，从而减少创建和销毁线程对象的开销。

Java 5+中的Executor接口定义一个执行线程的工具。它的子类型即线程池接口是ExecutorService。要配置一个线程池是比较复杂的，尤其是对于线程池的原理不是很清楚的情况下，因此在工具类Executors面提供了一些静态工厂方法，生成一些常用的线程池，如下所示：

- newSingleThreadExecutor：创建一个单线程的线程池。这个线程池只有一个线程在工作，也就是相当于单线程串行执行所有任务。如果这个唯一的线程因为异常结束，那么会有一个新的线程来替代它。此线程池保证所有任务的执行顺序按照任务的提交顺序执行。
- newFixedThreadPool：创建固定大小的线程池。每次提交一个任务就创建一个线程，直到线程达到线程池的最大大小。线程池的大小一旦达到最大值就会保持不变，如果某个线程因为执行异常而结束，那么线程池会补充一个新线程。
- newCachedThreadPool：创建一个可缓存的线程池。如果线程池的大小超过了处理任务所需要的线程，那么就会回收部分空闲（60秒不执行任务）的线程，当任务数增加时，此线程池又可以智能的添加新线程来处理任务。此线程池不会对线程池大小做限制，线程池大小完全依赖于操作系统（或者说JVM）能够创建的最大线程大小。
- newScheduledThreadPool：创建一个大小无限的线程池。此线程池支持定时以及周期性执行任务的需求。
- newSingleThreadExecutor：创建一个单线程的线程池。此线程池支持定时以及周期性执行任务的需求。

## 线程的基本状态以及状态之间的关系？

![线程的基本状态以及状态之间的关系](https://static.bookstack.cn/projects/java_interview_manual/images/multithread-status-change.png)

其中Running表示运行状态；Runnable表示就绪状态（万事俱备，只欠CPU）；Blocked表示阻塞状态；阻塞状态又有多种情况，可能是因为调用wait()方法进入等待池，也可能是执行同步方法或同步代码块进入等锁池，或者是调用了sleep()方法或join()方法等待休眠或其他线程结束，或是因为发生了I/O中断。

## Java中如何实现序列化，有什么意义？

序列化就是一种用来处理对象流的机制，所谓对象流也就是将对象的内容进行流化。可以对流化后的对象进行读写操作，也可将流化后的对象传输于网络之间。序列化是为了解决对象流读写操作时可能引发的问题（如果不进行序列化可能会存在数据乱序的问题）。

要实现序列化，需要让一个类实现Serializable接口，该接口是一个标识性接口，标注该类对象是可被序列化的，然后使用一个输出流来构造一个对象输出流并通过writeObject(Object)方法就可以将实现对象写出（即保存其状态）；如果需要反序列化则可以用一个输入流建立对象输入流，然后通过readObject方法从流中读取对象。序列化除了能够实现对象的持久化之外，还能够用于对象的深度克隆。

## 产生死锁的条件

1. 互斥条件：一个资源每次只能被一个进程使用。
2. 请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放
3. 不剥夺条件:进程已获得的资源，在末使用完之前，不能强行剥夺。
4. 循环等待条件:若干进程之间形成一种头尾相接的循环等待资源关系。

## 什么是线程饿死，什么是活锁？

线程饿死和活锁虽然不想是死锁一样的常见问题，但是对于并发编程的设计者来说就像一次邂逅一样。

当所有线程阻塞，或者由于需要的资源无效而不能处理，不存在非阻塞线程使资源可用。JavaAPI中线程活锁可能发生在以下情形：

- 当所有线程在程序中执行Object.wait(0)，参数为0的wait方法。程序将发生活锁直到在相应的对象上有线程调用Object.notify()或者Object.notifyAll()。
- 当所有线程卡在无限循环中。

## 什么导致线程阻塞

阻塞指的是暂停一个线程的执行以等待某个条件发生（如某资源就绪），学过操作系统的同学对它一定已经很熟悉了。Java 提供了大量方法来支持阻塞，下面让我们逐一分析。

| 方法                  | 说明                                                         |
| :-------------------- | :----------------------------------------------------------- |
| sleep()               | sleep() 允许 指定以毫秒为单位的一段时间作为参数，它使得线程在指定的时间内进入阻塞状态，不能得到CPU 时间，指定的时间一过，线程重新进入可执行状态。 典型地，sleep() 被用在等待某个资源就绪的情形：测试发现条件不满足后，让线程阻塞一段时间后重新测试，直到条件满足为止 |
| suspend() 和 resume() | 两个方法配套使用，suspend()使得线程进入阻塞状态，并且不会自动恢复，必须其对应的resume() 被调用，才能使得线程重新进入可执行状态。典型地，suspend() 和 resume() 被用在等待另一个线程产生的结果的情形：测试发现结果还没有产生后，让线程阻塞，另一个线程产生了结果后，调用 resume() 使其恢复。 |
| yield()               | yield() 使当前线程放弃当前已经分得的CPU 时间，但不使当前线程阻塞，即线程仍处于可执行状态，随时可能再次分得 CPU 时间。调用 yield() 的效果等价于调度程序认为该线程已执行了足够的时间从而转到另一个线程。 |
| wait() 和 notify()    | 两个方法配套使用，wait() 使得线程进入阻塞状态，它有两种形式，一种允许 指定以毫秒为单位的一段时间作为参数，另一种没有参数，前者当对应的 notify() 被调用或者超出指定时间时线程重新进入可执行状态，后者则必须对应的 notify() 被调用. |

## 怎么检测一个线程是否持有对象监视器

Thread类提供了一个holdsLock(Object obj)方法，当且仅当对象obj的监视器被某条线程持有的时候才会返回true，注意这是一个static方法，这意味着”某条线程”指的是当前线程。

## 请说出与线程同步以及线程调度相关的方法。

- wait()：使一个线程处于等待（阻塞）状态，并且释放所持有的对象的锁；
- sleep()：使一个正在运行的线程处于睡眠状态，是一个静态方法，调用此方法要处理InterruptedException异常；
- notify()：唤醒一个处于等待状态的线程，当然在调用此方法的时候，并不能确切的唤醒某一个等待状态的线程，而是由JVM确定唤醒哪个线程，而且与优先级无关；
- notityAll()：唤醒所有处于等待状态的线程，该方法并不是将对象的锁给所有线程，而是让它们竞争，只有获得锁的线程才能进入就绪状态；

## sleep() 、join（）、yield（）有什么区别

- sleep()方法给其他线程运行机会时不考虑线程的优先级，因此会给低优先级的线程以运行的机会；yield()方法只会给相同优先级或更高优先级的线程以运行的机会；
- 线程执行sleep()方法后转入阻塞（blocked）状态，而执行yield()方法后转入就绪（ready）状态；
- sleep()方法声明抛出InterruptedException，而yield()方法没有声明任何异常；
- sleep()方法比yield()方法（跟操作系统CPU调度相关）具有更好的可移植性。

## wait(),notify()和suspend(),resume()之间的区别

初看起来它们与 suspend() 和 resume() 方法对没有什么分别，但是事实上它们是截然不同的。区别的核心在于，前面叙述的所有方法，阻塞时都不会释放占用的锁（如果占用了的话），而这一对方法则相反。上述的核心区别导致了一系列的细节上的区别。

首先，前面叙述的所有方法都隶属于 Thread 类，但是这一对却直接隶属于 Object 类，也就是说，所有对象都拥有这一对方法。初看起来这十分不可思议，但是实际上却是很自然的，因为这一对方法阻塞时要释放占用的锁，而锁是任何对象都具有的，调用任意对象的 wait() 方法导致线程阻塞，并且该对象上的锁被释放。而调用 任意对象的notify()方法则导致从调用该对象的 wait() 方法而阻塞的线程中随机选择的一个解除阻塞（但要等到获得锁后才真正可执行）。

其次，前面叙述的所有方法都可在任何位置调用，但是这一对方法却必须在 synchronized 方法或块中调用，理由也很简单，只有在synchronized 方法或块中当前线程才占有锁，才有锁可以释放。同样的道理，调用这一对方法的对象上的锁必须为当前线程所拥有，这样才有锁可以释放。因此，这一对方法调用必须放置在这样的 synchronized 方法或块中，该方法或块的上锁对象就是调用这一对方法的对象。若不满足这一条件，则程序虽然仍能编译，但在运行时会出现IllegalMonitorStateException 异常。

wait() 和 notify() 方法的上述特性决定了它们经常和synchronized关键字一起使用，将它们和操作系统进程间通信机制作一个比较就会发现它们的相似性：synchronized方法或块提供了类似于操作系统原语的功能，它们的执行不会受到多线程机制的干扰，而这一对方法则相当于 block 和wakeup 原语（这一对方法均声明为 synchronized）。它们的结合使得我们可以实现操作系统上一系列精妙的进程间通信的算法（如信号量算法），并用于解决各种复杂的线程间通信问题。

关于 wait() 和 notify() 方法最后再说明两点：

第一：调用 notify() 方法导致解除阻塞的线程是从因调用该对象的 wait() 方法而阻塞的线程中随机选取的，我们无法预料哪一个线程将会被选择，所以编程时要特别小心，避免因这种不确定性而产生问题。

第二：除了 notify()，还有一个方法 notifyAll() 也可起到类似作用，唯一的区别在于，调用 notifyAll() 方法将把因调用该对象的 wait() 方法而阻塞的所有线程一次性全部解除阻塞。当然，只有获得锁的那一个线程才能进入可执行状态。

谈到阻塞，就不能不谈一谈死锁，略一分析就能发现，suspend() 方法和不指定超时期限的 wait() 方法的调用都可能产生死锁。遗憾的是，Java 并不在语言级别上支持死锁的避免，我们在编程中必须小心地避免死锁。

以上我们对 Java 中实现线程阻塞的各种方法作了一番分析，我们重点分析了 wait() 和 notify() 方法，因为它们的功能最强大，使用也最灵活，但是这也导致了它们的效率较低，较容易出错。实际使用中我们应该灵活使用各种方法，以便更好地达到我们的目的。

## 为什么wait()方法和notify()/notifyAll()方法要在同步块中被调用

这是JDK强制的，wait()方法和notify()/notifyAll()方法在调用前都必须先获得对象的锁

## wait()方法和notify()/notifyAll()方法在放弃对象监视器时有什么区别

wait()方法和notify()/notifyAll()方法在放弃对象监视器的时候的区别在于：wait()方法立即释放对象监视器，notify()/notifyAll()方法则会等待线程剩余代码执行完毕才会放弃对象监视器。

## Runnable和Callable的区别

Runnable接口中的run()方法的返回值是void，它做的事情只是纯粹地去执行run()方法中的代码而已；Callable接口中的call()方法是有返回值的，是一个泛型，和Future、FutureTask配合可以用来获取异步执行的结果。

这其实是很有用的一个特性，因为多线程相比单线程更难、更复杂的一个重要原因就是因为多线程充满着未知性，某条线程是否执行了？某条线程执行了多久？某条线程执行的时候我们期望的数据是否已经赋值完毕？无法得知，我们能做的只是等待这条多线程的任务执行完毕而已。而Callable+Future/FutureTask却可以方便获取多线程运行的结果，可以在等待时间太长没获取到需要的数据的情况下取消该线程的任务。

## Thread类的sleep()方法和对象的wait()方法都可以让线程暂停执行，它们有什么区别？

sleep()方法（休眠）是线程类（Thread）的静态方法，调用此方法会让当前线程暂停执行指定的时间，将执行机会（CPU）让给其他线程，但是对象的锁依然保持，因此休眠时间结束后会自动恢复。

wait()是Object类的方法，调用对象的wait()方法导致当前线程放弃对象的锁（线程暂停执行），进入对象的等待池（wait pool），只有调用对象的notify()方法（或notifyAll()方法）时才能唤醒等待池中的线程进入等锁池（lock pool），如果线程重新获得对象的锁就可以进入就绪状态。

## 线程的sleep()方法和yield()方法有什么区别？

1. sleep()方法给其他线程运行机会时不考虑线程的优先级，因此会给低优先级的线程以运行的机会；yield()方法只会给相同优先级或更高优先级的线程以运行的机会；
2. 线程执行sleep()方法后转入阻塞（blocked）状态，而执行yield()方法后转入就绪（ready）状态；
3. sleep()方法声明抛出InterruptedException，而yield()方法没有声明任何异常；
4. sleep()方法比yield()方法（跟操作系统CPU调度相关）具有更好的可移植性。

## 为什么wait,nofity和nofityAll这些方法不放在Thread类当中

一个很明显的原因是JAVA提供的锁是对象级的而不是线程级的，每个对象都有锁，通过线程获得。如果线程需要等待某些锁那么调用对象中的wait()方法就有意义了。如果wait()方法定义在Thread类中，线程正在等待的是哪个锁就不明显了。简单的说，由于wait，notify和notifyAll都是锁级别的操作，所以把他们定义在Object类中因为锁属于对象。

## 怎么唤醒一个阻塞的线程

如果线程是因为调用了wait()、sleep()或者join()方法而导致的阻塞，可以中断线程，并且通过抛出InterruptedException来唤醒它；如果线程遇到了IO阻塞，无能为力，因为IO是操作系统实现的，Java代码并没有办法直接接触到操作系统。

## 什么是多线程的上下文切换

多线程的上下文切换是指CPU控制权由一个已经正在运行的线程切换到另外一个就绪并等待获取CPU执行权的线程的过程。

## FutureTask是什么

这个其实前面有提到过，FutureTask表示一个异步运算的任务。FutureTask里面可以传入一个Callable的具体实现类，可以对这个异步运算的任务的结果进行等待获取、判断是否已经完成、取消任务等操作。当然，由于FutureTask也是Runnable接口的实现类，所以FutureTask也可以放入线程池中。

## 一个线程如果出现了运行时异常怎么办？

如果这个异常没有被捕获的话，这个线程就停止执行了。另外重要的一点是：如果这个线程持有某个某个对象的监视器，那么这个对象监视器会被立即释放

## Java当中有哪几种锁

自旋锁: 自旋锁在JDK1.6之后就默认开启了。基于之前的观察，共享数据的锁定状态只会持续很短的时间，为了这一小段时间而去挂起和恢复线程有点浪费，所以这里就做了一个处理，让后面请求锁的那个线程在稍等一会，但是不放弃处理器的执行时间，看看持有锁的线程能否快速释放。为了让线程等待，所以需要让线程执行一个忙循环也就是自旋操作。在jdk6之后，引入了自适应的自旋锁，也就是等待的时间不再固定了，而是由上一次在同一个锁上的自旋时间及锁的拥有者状态来决定

偏向锁: 在JDK1.之后引入的一项锁优化，目的是消除数据在无竞争情况下的同步原语。进一步提升程序的运行性能。 偏向锁就是偏心的偏，意思是这个锁会偏向第一个获得他的线程，如果接下来的执行过程中，改锁没有被其他线程获取，则持有偏向锁的线程将永远不需要再进行同步。偏向锁可以提高带有同步但无竞争的程序性能，也就是说他并不一定总是对程序运行有利，如果程序中大多数的锁都是被多个不同的线程访问，那偏向模式就是多余的，在具体问题具体分析的前提下，可以考虑是否使用偏向锁。

轻量级锁: 为了减少获得锁和释放锁所带来的性能消耗，引入了“偏向锁”和“轻量级锁”，所以在Java SE1.6里锁一共有四种状态，无锁状态，偏向锁状态，轻量级锁状态和重量级锁状态，它会随着竞争情况逐渐升级。锁可以升级但不能降级，意味着偏向锁升级成轻量级锁后不能降级成偏向锁

## 如何在两个线程间共享数据

通过在线程之间共享对象就可以了，然后通过wait/notify/notifyAll、await/signal/signalAll进行唤起和等待，比方说阻塞队列BlockingQueue就是为线程之间共享数据而设计的

## 如何正确的使用wait()?使用if还是while？

wait() 方法应该在循环调用，因为当线程获取到 CPU 开始执行的时候，其他条件可能还没有满足，所以在处理前，循环检测条件是否满足会更好。下面是一段标准的使用 wait 和 notify 方法的代码：

```
synchronized (obj) {   while (condition does not hold)     obj.wait(); // (Releases lock, and reacquires on wakeup)     ... // Perform action appropriate to condition}
```

## 什么是线程局部变量ThreadLocal

线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。Java提供ThreadLocal类来支持线程局部变量，是一种实现线程安全的方式。但是在管理环境下（如 web 服务器）使用线程局部变量的时候要特别小心，在这种情况下，工作线程的生命周期比任何应用变量的生命周期都要长。任何线程局部变量一旦在工作完成后没有释放，Java 应用就存在内存泄露的风险。

## ThreadLoal的作用是什么？

简单说ThreadLocal就是一种以空间换时间的做法在每个Thread里面维护了一个ThreadLocal.ThreadLocalMap把数据进行隔离，数据不共享，自然就没有线程安全方面的问题了.

## ThreadLocal 原理分析

ThreadLocal为解决多线程程序的并发问题提供了一种新的思路。ThreadLocal，顾名思义是线程的一个本地化对象，当工作于多线程中的对象使用ThreadLocal维护变量时，ThreadLocal为每个使用该变量的线程分配一个独立的变量副本，所以每一个线程都可以独立的改变自己的副本，而不影响其他线程所对应的副本。从线程的角度看，这个变量就像是线程的本地变量。

ThreadLocal类非常简单好用，只有四个方法，能用上的也就是下面三个方法：

- void set(T value)：设置当前线程的线程局部变量的值。
- T get()：获得当前线程所对应的线程局部变量的值。
- void remove()：删除当前线程中线程局部变量的值。

ThreadLocal是如何做到为每一个线程维护一份独立的变量副本的呢？在ThreadLocal类中有一个Map，键为线程对象，值是其线程对应的变量的副本，自己要模拟实现一个ThreadLocal类其实并不困难，代码如下所示：

```
import java.util.Collections;import java.util.HashMap;import java.util.Map;public class MyThreadLocal<T> {    private Map<Thread, T> map = Collections.synchronizedMap(new HashMap<Thread, T>());    public void set(T newValue) {        map.put(Thread.currentThread(), newValue);    }    public T get() {        return map.get(Thread.currentThread());    }    public void remove() {        map.remove(Thread.currentThread());    }}
```

## 如果你提交任务时，线程池队列已满，这时会发生什么

如果你使用的LinkedBlockingQueue，也就是无界队列的话，没关系，继续添加任务到阻塞队列中等待执行，因为LinkedBlockingQueue可以近乎认为是一个无穷大的队列，可以无限存放任务；如果你使用的是有界队列比方说ArrayBlockingQueue的话，任务首先会被添加到ArrayBlockingQueue中，ArrayBlockingQueue满了，则会使用拒绝策略RejectedExecutionHandler处理满了的任务，默认是AbortPolicy。

## 为什么要使用线程池

避免频繁地创建和销毁线程，达到线程对象的重用。另外，使用线程池还可以根据项目灵活地控制并发的数目。

## java中用到的线程调度算法是什么

抢占式。一个线程用完CPU之后，操作系统会根据线程优先级、线程饥饿情况等数据算出一个总的优先级并分配下一个时间片给某个线程执行。

## Thread.sleep(0)的作用是什么

由于Java采用抢占式的线程调度算法，因此可能会出现某条线程常常获取到CPU控制权的情况，为了让某些优先级比较低的线程也能获取到CPU控制权，可以使用Thread.sleep(0)手动触发一次操作系统分配时间片的操作，这也是平衡CPU控制权的一种操作。

## 什么是CAS

CAS，全称为Compare and Swap，即比较-替换。假设有三个操作数：内存值V、旧的预期值A、要修改的值B，当且仅当预期值A和内存值V相同时，才会将内存值修改为B并返回true，否则什么都不做并返回false。当然CAS一定要volatile变量配合，这样才能保证每次拿到的变量是主内存中最新的那个值，否则旧的预期值A对某条线程来说，永远是一个不会变的值A，只要某次CAS操作失败，永远都不可能成功

## 什么是乐观锁和悲观锁

乐观锁：乐观锁认为竞争不总是会发生，因此它不需要持有锁，将比较-替换这两个动作作为一个原子操作尝试去修改内存中的变量，如果失败则表示发生冲突，那么就应该有相应的重试逻辑。

悲观锁：悲观锁认为竞争总是会发生，因此每次对某资源进行操作时，都会持有一个独占的锁，就像synchronized，不管三七二十一，直接上了锁就操作资源了。

## ConcurrentHashMap的并发度是什么？

ConcurrentHashMap的并发度就是segment的大小，默认为16，这意味着最多同时可以有16条线程操作ConcurrentHashMap，这也是ConcurrentHashMap对Hashtable的最大优势，任何情况下，Hashtable能同时有两条线程获取Hashtable中的数据吗？

## ConcurrentHashMap的工作原理

ConcurrentHashMap在jdk 1.6和jdk 1.8实现原理是不同的.

jdk 1.6:
ConcurrentHashMap是线程安全的，但是与Hashtablea相比，实现线程安全的方式不同。Hashtable是通过对hash表结构进行锁定，是阻塞式的，当一个线程占有这个锁时，其他线程必须阻塞等待其释放锁。ConcurrentHashMap是采用分离锁的方式，它并没有对整个hash表进行锁定，而是局部锁定，也就是说当一个线程占有这个局部锁时，不影响其他线程对hash表其他地方的访问。
具体实现:ConcurrentHashMap内部有一个Segment

jdk 1.8
在jdk 8中，ConcurrentHashMap不再使用Segment分离锁，而是采用一种乐观锁CAS算法来实现同步问题，但其底层还是“数组+链表->红黑树”的实现。

## CyclicBarrier和CountDownLatch区别

这两个类非常类似，都在java.util.concurrent下，都可以用来表示代码运行到某个点上，二者的区别在于：

CyclicBarrier的某个线程运行到某个点上之后，该线程即停止运行，直到所有的线程都到达了这个点，所有线程才重新运行；CountDownLatch则不是，某线程运行到某个点上之后，只是给某个数值-1而已，该线程继续运行

CyclicBarrier只能唤起一个任务，CountDownLatch可以唤起多个任务

CyclicBarrier可重用，CountDownLatch不可重用，计数值为0该CountDownLatch就不可再用了

## java中的++操作符线程安全么？

不是线程安全的操作。它涉及到多个指令，如读取变量值，增加，然后存储回内存，这个过程可能会出现多个线程交差

## 有三个线程T1，T2，T3，怎么确保它们按顺序执行？

在多线程中有多种方法让线程按特定顺序执行，你可以用线程类的join()方法在一个线程中启动另一个线程，另外一个线程完成该线程继续执行。为了确保三个线程的顺序你应该先启动最后一个(T3调用T2，T2调用T1)，这样T1就会先完成而T3最后完成。

## 如何在Java中创建Immutable对象？

这个问题看起来和多线程没什么关系， 但不变性有助于简化已经很复杂的并发程序。Immutable对象可以在没有同步的情况下共享，降低了对该对象进行并发访问时的同步化开销。可是Java没有[@Immutable](https://github.com/Immutable)这个注解符，要创建不可变类，要实现下面几个步骤：通过构造方法初始化所有成员、对变量不要提供setter方法、将所有的成员声明为私有的，这样就不允许直接访问这些成员、在getter方法中，不要直接返回对象本身，而是克隆对象，并返回对象的拷贝。

## 你有哪些多线程开发良好的实践？

- 给线程命名
- 最小化同步范围
- 优先使用volatile
- 尽可能使用更高层次的并发工具而非wait和notify()来实现线程通信,如BlockingQueue,Semeaphore
- 优先使用并发容器而非同步容器.
- 考虑使用线程池

## 可以创建Volatile数组吗？

Java 中可以创建 volatile类型数组，不过只是一个指向数组的引用，而不是整个数组。如果改变引用指向的数组，将会受到volatile 的保护，但是如果多个线程同时改变数组的元素，volatile标示符就不能起到之前的保护作用了

## Volatile关键字的作用

一个非常重要的问题，是每个学习、应用多线程的Java程序员都必须掌握的。理解volatile关键字的作用的前提是要理解Java内存模型，这里就不讲Java内存模型了，可以参见第31点，volatile关键字的作用主要有两个：

- 多线程主要围绕可见性和原子性两个特性而展开，使用volatile关键字修饰的变量，保证了其在多线程之间的可见性，即每次读取到volatile变量，一定是最新的数据
- 代码底层执行不像我们看到的高级语言—-Java程序这么简单，它的执行是Java代码–>字节码–>根据字节码执行对应的C/C++代码–>C/C++代码被编译成汇编语言–>和硬件电路交互，现实中，为了获取更好的性能JVM可能会对指令进行重排序，多线程下可能会出现一些意想不到的问题。使用volatile则会对禁止语义重排序，当然这也一定程度上降低了代码执行效率

从实践角度而言，volatile的一个重要作用就是和CAS结合，保证了原子性，详细的可以参见java.util.concurrent.atomic包下的类，比如AtomicInteger。

## volatile能使得一个非原子操作变成原子操作吗？

一个典型的例子是在类中有一个 long 类型的成员变量。如果你知道该成员变量会被多个线程访问，如计数器、价格等，你最好是将其设置为 volatile。为什么？因为 Java 中读取 long 类型变量不是原子的，需要分成两步，如果一个线程正在修改该 long 变量的值，另一个线程可能只能看到该值的一半（前 32 位）。但是对一个 volatile 型的 long 或 double 变量的读写是原子。

一种实践是用 volatile 修饰 long 和 double 变量，使其能按原子类型来读写。double 和 long 都是64位宽，因此对这两种类型的读是分为两部分的，第一次读取第一个 32 位，然后再读剩下的 32 位，这个过程不是原子的，但 Java 中 volatile 型的 long 或 double 变量的读写是原子的。volatile 修复符的另一个作用是提供内存屏障（memory barrier），例如在分布式框架中的应用。简单的说，就是当你写一个 volatile 变量之前，Java 内存模型会插入一个写屏障（write barrier），读一个 volatile 变量之前，会插入一个读屏障（read barrier）。意思就是说，在你写一个 volatile 域时，能保证任何线程都能看到你写的值，同时，在写之前，也能保证任何数值的更新对所有线程是可见的，因为内存屏障会将其他所有写的值更新到缓存。

## volatile类型变量提供什么保证？

volatile 主要有两方面的作用:1.避免指令重排2.可见性保证.例如，JVM 或者 JIT为了获得更好的性能会对语句重排序，但是 volatile 类型变量即使在没有同步块的情况下赋值也不会与其他语句重排序。 volatile 提供 happens-before 的保证，确保一个线程的修改能对其他线程是可见的。某些情况下，volatile 还能提供原子性，如读 64 位数据类型，像 long 和 double 都不是原子的(低32位和高32位)，但 volatile 类型的 double 和 long 就是原子的.

## Java 中，编写多线程程序的时候你会遵循哪些最佳实践？

这是我在写Java 并发程序的时候遵循的一些最佳实践：

- 给线程命名，这样可以帮助调试。
- 最小化同步的范围，而不是将整个方法同步，只对关键部分做同步。
- 如果可以，更偏向于使用 volatile 而不是 synchronized。
- 使用更高层次的并发工具，而不是使用 wait() 和 notify() 来实现线程间通信，如 BlockingQueue，CountDownLatch 及 Semeaphore。
- 优先使用并发集合，而不是对集合进行同步。并发集合提供更好的可扩展性。

## 说出至少 5 点在 Java 中使用线程的最佳实践。

这个问题与之前的问题类似，你可以使用上面的答案。对线程来说，你应该：

- 对线程命名
- 将线程和任务分离，使用线程池执行器来执行 Runnable 或 Callable。
- 使用线程池

## Java中如何获取到线程dump文件

死循环、死锁、阻塞、页面打开慢等问题，打线程dump是最好的解决问题的途径。所谓线程dump也就是线程堆栈，获取到线程堆栈有两步：

- 获取到线程的pid，可以通过使用jps命令，在Linux环境下还可以使用ps -ef | grep java
- 打印线程堆栈，可以通过使用jstack pid命令，在Linux环境下还可以使用kill -3 pid

另外提一点，Thread类提供了一个getStackTrace()方法也可以用于获取线程堆栈。这是一个实例方法，因此此方法是和具体线程实例绑定的，每次获取获取到的是具体某个线程当前运行的堆栈。

## 高并发、任务执行时间短的业务怎样使用线程池？并发不高、任务执行时间长的业务怎样使用线程池？并发高、业务执行时间长的业务怎样使用线程池？

这是我在并发编程网上看到的一个问题，把这个问题放在最后一个，希望每个人都能看到并且思考一下，因为这个问题非常好、非常实际、非常专业。关于这个问题，个人看法是：

1. 高并发、任务执行时间短的业务，线程池线程数可以设置为CPU核数+1，减少线程上下文的切换
2. 并发不高、任务执行时间长的业务要区分开看：
   - 假如是业务时间长集中在IO操作上，也就是IO密集型的任务，因为IO操作并不占用CPU，所以不要让所有的CPU闲下来，可以加大线程池中的线程数目，让CPU处理更多的业务
   - 假如是业务时间长集中在计算操作上，也就是计算密集型任务，这个就没办法了，和（1）一样吧，线程池中的线程数设置得少一些，减少线程上下文的切换
3. 并发高、业务执行时间长，解决这种类型任务的关键不在于线程池而在于整体架构的设计，看看这些业务里面某些数据是否能做缓存是第一步，增加服务器是第二步，至于线程池的设置，设置参考（2）。
4. 业务执行时间长的问题，也可能需要分析一下，看看能不能使用中间件对任务进行拆分和解耦。

## 作业(进程)调度算法

1. 先来先服务调度算法(FCFS) 每次调度都是从后备作业队列中选择一个或多个最先进入该队列的作业，将它们调入内存，为它们分配资源、创建进程，然后放入就绪队列。
2. 短作业(进程)优先调度算法(SPF) 短作业优先(SJF)的调度算法是从后备队列中选择一个或若干个估计运行时间最短的作业，将它们调入内存运行。缺点:长作业的运行得不到保证
3. 优先权调度算法(HPF) 当把该算法用于作业调度时，系统将从后备队列中选择若干个优先权最高的作业装入内存。当用于进程调度时，该算法是把处理机分配给就绪队列中优先权最高的进程，这时，又可进一步把该算法分成如下两种。 可以分为:
   - 非抢占式优先权算法
   - 抢占式优先权调度算法
4. 高响应比优先调度算法(HRN) 每次选择高响应比最大的作业执行，响应比=(等待时间+要求服务时间)/要求服务时间。该算法同时考虑了短作业优先和先来先服务。
   - 如果作业的等待时间相同，则要求服务的时间愈短，其优先权愈高，因而该算法有利于短作业。
   - 当要求服务的时间相同时，作业的优先权决定于其等待时间，等待时间愈长，其优先权愈高，因而它实现的是先来先服务。
   - 对于长作业，作业的优先级可以随等待时间的增加而提高，当其等待时间足够长时，其优先级便可升到很高，从而也可获得处理机。简言之，该算法既照顾了短作业，又考虑了作业到达的先后次序，不会使长作业长期得不到服务。因此，该算法实现了一种较好的折衷。当然，在利用该算法时，每要进行调度之前，都须先做响应比的计算，这会增加系统开销。
5. 时间片轮转法（RR） 在早期的时间片轮转法中，系统将所有的就绪进程按先来先服务的原则排成一个队列，每次调度时，把CPU分配给队首进程，并令其执行一个时间片。时间片的大小从几ms到几百ms。当执行的时间片用完时，由一个计时器发出时钟中断请求，调度程序便据此信号来停止该进程的执行，并将它送往就绪队列的末尾；然后，再把处理机分配给就绪队列中新的队首进程，同时也让它执行一个时间片。这样就可以保证就绪队列中的所有进程在一给定的时间内均能获得一时间片的处理机执行时间。换言之，系统能在给定的时间内响应所有用户的请求。
6. 多级反馈队列调度算法 它是目前被公认的一种较好的进程调度算法。
   - 应设置多个就绪队列，并为各个队列赋予不同的优先级。第一个队列的优先级最高，第二个队列次之，其余各队列的优先权逐个降低。该算法赋予各个队列中进程执行时间片的大小也各不相同，在优先权愈高的队列中，为每个进程所规定的执行时间片就愈小。例如，第二个队列的时间片要比第一个队列的时间片长一倍，……，第i+1个队列的时间片要比第i个队列的时间片长一倍。
   - 当一个新进程进入内存后，首先将它放入第一队列的末尾，按FCFS原则排队等待调度。当轮到该进程执行时，如它能在该时间片内完成，便可准备撤离系统；如果它在一个时间片结束时尚未完成，调度程序便将该进程转入第二队列的末尾，再同样地按FCFS原则等待调度执行；如果它在第二队列中运行一个时间片后仍未完成，再依次将它放入第三队列，……，如此下去，当一个长作业(进程)从第一队列依次降到第n队列后，在第n 队列便采取按时间片轮转的方式运行。
   - 仅当第一队列空闲时，调度程序才调度第二队列中的进程运行；仅当第1～(i-1)队列均空时，才会调度第i队列中的进程运行。如果处理机正在第i队列中为某进程服务时，又有新进程进入优先权较高的队列(第1～(i-1)中的任何一个队列)，则此时新进程将抢占正在运行进程的处理机，即由调度程序把正在运行的进程放回到第i队列的末尾，把处理机分配给新到的高优先权进程。

## 讲讲线程池的实现原理

[以下资源来源](https://github.com/crossoverJie/Java-Interview/blob/master/MD/ThreadPoolExecutor.md)

首先要明确为什么要使用线程池，使用线程池会带来什么好处？

- 线程是稀缺资源，不能频繁的创建。
- 应当将其放入一个池子中，可以给其他任务进行复用。
- 解耦作用，线程的创建于执行完全分开，方便维护。

### 创建一个线程池

以一个使用较多的

```
ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, RejectedExecutionHandler handler);
```

为例：

- 其中的 corePoolSize 为线程池的基本大小。
- maximumPoolSize 为线程池最大线程大小。
- keepAliveTime 和 unit 则是线程空闲后的存活时间。
- workQueue 用于存放任务的阻塞队列。
- handler 当队列和最大线程池都满了之后的饱和策略。

### 处理流程

当提交一个任务到线程池时它的执行流程是怎样的呢？

![执行流程](https://static.bookstack.cn/projects/java_interview_manual/images/68747470733a2f2f7773312e73696e61696d672e636e2f6c617267652f303036744e625277677931666e627a6d61693879726a333064773038353734732e6a7067.jpg)

首先第一步会判断核心线程数有没有达到上限，如果没有则创建线程(会获取全局锁)，满了则会将任务丢进阻塞队列。

如果队列也满了则需要判断最大线程数是否达到上限，如果没有则创建线程(获取全局锁)，如果最大线程数也满了则会根据饱和策略处理。

常用的饱和策略有:

- 直接丢弃任务。
- 调用者线程处理。
- 丢弃队列中的最近任务，执行当前任务。

所以当线程池完成预热之后都是将任务放入队列，接着由工作线程一个个从队列里取出执行。

### 合理配置线程池

线程池并不是配置越大越好，而是要根据任务的熟悉来进行划分： 如果是 CPU 密集型任务应当分配较少的线程，比如 CPU 个数相当的大小。

如果是 IO 密集型任务，由于线程并不是一直在运行，所以可以尽可能的多配置线程，比如 CPU 个数 * 2 。

当是一个混合型任务，可以将其拆分为 CPU 密集型任务以及 IO 密集型任务，这样来分别配置。

## synchronize 实现原理

[以下资源来源](https://github.com/crossoverJie/Java-Interview/blob/master/MD/Synchronize.md)

众所周知 Synchronize 关键字是解决并发问题常用解决方案，有以下三种使用方式:

- 同步普通方法，锁的是当前对象。
- 同步静态方法，锁的是当前 Class 对象。
- 同步块，锁的是 {} 中的对象。

实现原理： JVM 是通过进入、退出对象监视器( Monitor )来实现对方法、同步块的同步的。

具体实现是在编译之后在同步方法调用前加入一个 monitor.enter 指令，在退出方法和异常处插入 monitor.exit 的指令。

其本质就是对一个对象监视器( Monitor )进行获取，而这个获取过程具有排他性从而达到了同一时刻只能一个线程访问的目的。

而对于没有获取到锁的线程将会阻塞到方法入口处，直到获取锁的线程 monitor.exit 之后才能尝试继续获取锁。

流程图如下:

![流程图](https://static.bookstack.cn/projects/java_interview_manual/images/68747470733a2f2f7773322e73696e61696d672e636e2f6c617267652f303036744e6337396c7931666e3237666b6c30376a6a333165383068796e306e2e6a7067.jpg)

synchronize 很多都称之为重量锁，JDK1.6 中对 synchronize 进行了各种优化，为了能减少获取和释放锁带来的消耗引入了偏向锁和轻量锁。

### 轻量锁

当代码进入同步块时，如果同步对象为无锁状态时，当前线程会在栈帧中创建一个锁记录(Lock Record)区域，同时将锁对象的对象头中 Mark Word 拷贝到锁记录中，再尝试使用 CAS 将 Mark Word 更新为指向锁记录的指针。

如果更新成功，当前线程就获得了锁。

如果更新失败 JVM 会先检查锁对象的 Mark Word 是否指向当前线程的锁记录。

如果是则说明当前线程拥有锁对象的锁，可以直接进入同步块。

不是则说明有其他线程抢占了锁，如果存在多个线程同时竞争一把锁，轻量锁就会膨胀为重量锁。

#### 解锁

轻量锁的解锁过程也是利用 CAS 来实现的，会尝试锁记录替换回锁对象的 Mark Word 。如果替换成功则说明整个同步操作完成，失败则说明有其他线程尝试获取锁，这时就会唤醒被挂起的线程(此时已经膨胀为重量锁)

轻量锁能提升性能的原因是：

认为大多数锁在整个同步周期都不存在竞争，所以使用 CAS 比使用互斥开销更少。但如果锁竞争激烈，轻量锁就不但有互斥的开销，还有 CAS 的开销，甚至比重量锁更慢。

### 偏向锁

为了进一步的降低获取锁的代价，JDK1.6 之后还引入了偏向锁。

偏向锁的特征是:锁不存在多线程竞争，并且应由一个线程多次获得锁。

当线程访问同步块时，会使用 CAS 将线程 ID 更新到锁对象的 Mark Word 中，如果更新成功则获得偏向锁，并且之后每次进入这个对象锁相关的同步块时都不需要再次获取锁了。

#### 释放锁

当有另外一个线程获取这个锁时，持有偏向锁的线程就会释放锁，释放时会等待全局安全点(这一时刻没有字节码运行)，接着会暂停拥有偏向锁的线程，根据锁对象目前是否被锁来判定将对象头中的 Mark Word 设置为无锁或者是轻量锁状态。

偏向锁可以提高带有同步却没有竞争的程序性能，但如果程序中大多数锁都存在竞争时，那偏向锁就起不到太大作用。可以使用 -XX:-userBiasedLocking=false 来关闭偏向锁，并默认进入轻量锁。

## 线程池的几种方式与使用场景

参考：[线程池的种类，区别和使用场景](https://blog.csdn.net/PORSCHE_GT3RS/article/details/80261720)

## volatile 实现原理

禁止指令重排、刷新内存

参考：

- [【死磕Java并发】—–深入分析volatile的实现原理](http://cmsblogs.com/?p=2092)
- [深入分析Volatile的实现原理](https://blog.csdn.net/eff666/article/details/67640648)

## synchronized 实现原理

（对象监视器）

## 说说 Semaphore 原理

## 说说 Exchanger 原理

## 线程的生命周期

## 重入锁的概念，重入锁为什么可以防止死锁

## 如何检查死锁（通过jConsole检查死锁）

## AQS同步队列

## 什么是ABA问题，出现ABA问题JDK是如何解决的

## 乐观锁的业务场景及实现方式



























## 如何预防死锁

1. 首先需要将死锁发生的是个必要条件讲出来：

   1. 互斥条件：同一时间只能有一个线程获取资源
   2. 不可剥夺条件：一个线程已经占有的资源，在释放之前不会被其它线程抢占
   3. 请求和保持条件：线程等待过程中不会释放已占有的资源
   4. 循环等待条件：多个线程互相等待对方释放资源

   

2. 预防死锁，就是需要破坏这四个必要条件

   1. 由于资源互斥是资源使用的固有特性，无法改变，不讨论
   2. 破坏不可剥夺条件：一个进程不能获得所需要的全部资源时便处于等待状态，等待期间他占有的资源将 被隐式的释放重新加入到系统的资源列表中，可以被其他的进程使用，而等待的进 程只有重新获得自己原有的资源以及新申请的资源才可以重新启动，执行
   3. 破坏请求与保持条件：
      1. 第一种方法是，静态分配即每个进程在开始执行时就申请他所需要的全部资源
      2. 第二种是，动态分配即每个进程在申请所需要的资源时，他本身不占用系统资源
   4. 破坏循环等待条件：采用资源有序分配其基本思想是将系统中的所有资源顺序编号，将紧缺的，稀少的 采用较大的编号，在申请资源时必须按照编号的顺序进行，一个进程只有获得较小 编号的进程才能申请较大编号的进程





##  描述一下线程安全活跃态问题，竞态条件 

读写锁会造成饥饿

1. 线程安全的活跃性问题分为`死锁、活锁、饥饿`

   1. 活锁：就是有时线程虽然没有发生阻塞，但是仍然会存在执行不下去的情况，活锁不会阻 塞线程，线程会一直重复执行某个相同的操作，并且一直失败重试 

      1. 我们开发中使用的异步消息队列就有可能造成活锁的问题，在消息队列的消费端如 果没有正确的ack消息，并且执行过程中报错了，就会再次放回消息头，然后再拿 出来执行，一直循环往复的失败。这个问题除了正确的ack之外，往往是通过将失 败的消息放入到延时队列中，等到一定的延时再进行重试来解决。 
      2.  解决活锁的方案很简单，尝试等待一个随机的时间就可以，会按时间轮去重试 1. 饥饿 就是 线程因无法访问所需资源而无法执行下去的情况

   2. 饥饿：分为两种情况

      1. 一种是其他的线程在临界区做了无限循环或无限制等待资源的操作，让其他的 线程一直不能拿到锁进入临界区，对其他线程来说，就进入了饥饿状态
      2. 另一种是因为线程优先级不合理的分配，导致部分线程始终无法获取到CPU资 源而一直无法执行

      解决方案

      1. 保证资源充足，很多场景下，资源的稀缺性无法解决
      2. 公平分配资源，在并发编程里使用公平锁，例如FIFO策略，线程等待是有顺 序的，排在等待队列前面的线程会优先获得资源
      3. 避免持有锁的线程长时间执行，很多场景下，持有锁的线程的执行时间也很难 缩短

      

   3. 死锁：线程在对同一把锁进行竞争的时候，未抢占到锁的线程会等待持有锁的线程释放锁 后继续抢占，如果两个或两个以上的线程互相持有对方将要抢占的锁，互相等待对方先 行释放锁就会进入到一个循环等待的过程，这个过程就叫做死锁 

   

2. 线程安全的竞态条件问题

   1. 同一个程序多线程访问同一个资源，如果对资源的访问顺序敏感，就称存在竞态条件， 代码区成为临界区。 大多数并发错误一样，竞态条件不总是会产生问题，还需要不恰当 的执行时序
   2.  最常见的竞态条件为 
      1. 先检测后执行执行依赖于检测的结果，而检测结果依赖于多个线程的执行时序，而 多个线程的执行时序通常情况下是不固定不可判断的，从而导致执行结果出现各种 问题，见一种可能 的解决办法就是：在一个线程修改访问一个状态时，要防止其他 线程访问修改，也就是加锁机制，保证原子性 
      2. 延迟初始化（典型为单例）

   

## Java中的wait和sleep的区别与联系

1. 所属类: 首先，这两个方法来自不同的类分别是`Thread`和`Object` ，`wait()`是`Object`的方法， `sleep()`是`Thread`的方法

   `sleep()`针对的是线程，表示让一个线程进入睡眠状态，等待一定的时间之 后，自动醒来进入到可运行状态，不会马上进入运行状态，因为线程调度机制恢复线程 的运行也需要时间，一个线程对象调用了sleep方法之后，并不会释放他所持有的所有对象锁，所以也就不会影响其他进程对象的运行。但在sleep的过程中过程中有可能被其他对象调用它的`interrupt()`，产生`InterruptedException 异常`，如果你的程序不捕获这个异常，线程就会异常终止，进入`TERMINATED 状态`，如果你的程序捕获了这个异常，那么 程序就会继续执行catch语句块(可能还有finally语句块)以及以后的代码 

2. 作用范围：`sleep()`没有释放锁，只是休眠，而`wait()`释放了锁，使得其他线程可以使用同步控制块或方法

3. 使用范围：`wait()，notify() 和 notifyAll()` 只能在同步控制方法或者同步控制块里面使用，而`sleep()`可以在任何地方使用

4. 异常范围：`sleep()`必须捕获异常，而`wait()，notify() 和 notifyAll()`不需要捕获异常

联系：都阻塞，都可被中断唤醒



## 进程与线程区别

1. 进程（Process）：

   是系统进行资源分配和调度的基本单位，是操作系统结构的基础。在当代面向线程设计 的计算机结构中，进程是线程的容器。程序是指令、数据及其组织形式的描述，进程是 程序的实体。是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分 配和调度的基本单位，是操作系统结构的基础。程序是指令、数据及其组织形式的描 述，进程是程序的实体。

   总结：进程是指在系统中正在运行的一个应用程序；程序一旦 运行就是进程；进程——资源分配的最小单位 

2. 线程 

   操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单 位。一条线程指的是进程中一个单一顺序的控制流，一个进程中可以并发多个线程，每 条线程并行执行不同的任务。

   总结：系统分配处理器时间资源的基本单元，或者说进程之 内独立执行的一个单元执行流。线程——程序执行的最小单位 



## 描述一下Java线程的生命周期

1. 大致包括5个阶段

   1. 新建 就是刚使用new方法，new出来的线程
   2. 就绪 就是调用的线程的start()方法后，这时候线程处于等待CPU分配资源阶段，谁先抢 的CPU资源，谁开始执行
   3. 运行 当就绪的线程被调度并获得CPU资源时，便进入运行状态，run方法定义了线程的 操作和功能
   4. 阻塞 在运行状态的时候，可能因为某些原因导致运行状态的线程变成了阻塞状态，比如 sleep()、wait()之后线程就处于了阻塞状态，这个时候需要其他机制将处于阻塞状态的线 程唤醒，比如调用notify或者notifyAll()方法。唤醒的线程不会立刻执行run方法，它们 要再次等待CPU分配资源进入运行状态
   5. 销毁 如果线程正常执行完毕后或线程被提前强制性的终止或出现异常导致结束，那么线 程就要被销毁，释放资源 

   

2. 按JDK的源码分析来看，Thread的状态分为

   1. NEW： 尚未启动的线程的线程状态

   2. RUNNABLE： 处于可运行状态的线程正在Java虚拟机中执行，但它可能正在等待来自操 作系统（例如处理器）的其他资源

   3. BLOCKED： 线程的线程状态被阻塞，等待监视器锁定。处于阻塞状态的线程正在等待 监视器锁定以输入同步的块方法或在调用后重新输入同步的块方法，通过 Object#wait() 进入阻塞

   4. WAITING：处于等待状态的线程正在等待另一个线程执行特定操作：例如: 在对象上调用 了Object.wait（）的线程正在等待另一个线程调用Object.notify（） 或者 Object.notifyAll(), 调用了 Thread.join（）的线程正在等待指定的线程终止

   5. TIMED_WAITING ： 具有指定等待时间的等待线程的线程状态。由于以指定的正等待时 间调用以下方法之一，因此线程处于定时等待状态： 

      1. Thread.sleep（long）
      2. Object#wait(long)
      3. Thread.join（long）
      4. LockSupport.parkNanos（long...）
      5. LockSupport.parkUntil（long...）

      

   6. TERMINATED: 终止线程的线程状态。线程已完成执行



## 程序开多少线程合适

这里需要区别下应用是什么样的程序：

1. CPU 密集型程序， 一个完整请求，I/O操作可以在很短时间内完成， CPU还有很多运 算要处理，也就是说 CPU 计算的比例占很大一部分，线程等待时间接近0
   1. 单核CPU： 一个完整请求，I/O操作可以在很短时间内完成， CPU还有很多运算要 处理，也就是说 CPU 计算的比例占很大一部分，线程等待时间接近0。单核CPU处 理CPU密集型程序，这种情况并不太适合使用多线程
   2. 多核 ： 如果是多核CPU 处理 CPU 密集型程序，我们完全可以最大化的利用 CPU 核心数，应用并发编程来提高效率。CPU 密集型程序的最佳线程数就是：因此对于 CPU 密集型来说，理论上 线程数量 = CPU 核数（逻辑），但是实际上，数量一般 会设置为 CPU 核数（逻辑）+ 1（经验值） 计算(CPU)密集型的线程恰好在某时因为发生一个页错误或者因其他原因而暂停， 刚好有一个“额外”的线程，可以确保在这种情况下CPU周期不会中断工作 
2. I/O 密集型程序，与 CPU 密集型程序相对，一个完整请求，CPU运算操作完成之后还有 很多 I/O 操作要做，也就是说 I/O 操作占比很大部分，等待时间较长，线程等待时间所 占比例越高，需要越多线程；线程CPU时间所占比例越高，需要越少线程
   1. I/O 密集型程序的最佳线程数就是： 最佳线程数 = CPU核心数 (1/CPU利用率) = CPU核心数 (1 + (I/O耗时/CPU耗时))
   2. 如果几乎全是 I/O耗时，那么CPU耗时就无限趋近于0，所以纯理论你就可以说是 2N（N=CPU核数），当然也有说 2N + 1的，1应该是backup 
   3. 一般我们说 2N + 1 就即可 



## 描述一下notify和notifyAll区别

1. 首先最好说一下 锁池 和 等待池 的概念 1. 锁池:假设线程A已经拥有了某个对象(注意:不是类)的锁，而其它的线程想要调用这个对 象的某个synchronized方法(或者synchronized块)，由于这些线程在进入对象的 synchronized方法之前必须先获得该对象的锁的拥有权，但是该对象的锁目前正被线程 A拥有，所以这些线程就进入了该对象的锁池中。
2. 等待池:假设一个线程A调用了某个对象的wait()方法，线程A就会释放该对象的锁(因为 wait()方法必须出现在synchronized中，这样自然在执行wait()方法之前线程A就已经拥 有了该对象的锁)，同时线程A就进入到了该对象的等待池中。如果另外的一个线程调用 了相同对象的notifyAll()方法，那么处于该对象的等待池中的线程就会全部进入该对象的 锁池中，准备争夺锁的拥有权。如果另外的一个线程调用了相同对象的notify()方法，那 么仅仅有一个处于该对象的等待池中的线程(随机)会进入该对象的锁池. 1. 如果线程调用了对象的 wait()方法，那么线程便会处于该对象的等待池中，等待池中的线程不 会去竞争该对象的锁 2. 当有线程调用了对象的 notifyAll()方法（唤醒所有 wait 线程）或 notify()方法（只随机唤醒一 个 wait 线程），被唤醒的的线程便会进入该对象的锁池中，锁池中的线程会去竞争该对象 锁。也就是说，调用了notify后只要一个线程会由等待池进入锁池，而notifyAll会将该对象等 待池内的所有线程移动到锁池中，等待锁竞争
3. 所谓唤醒线程，另一种解释可以说是将线程由等待池移动到锁池，notifyAll调用后，会将全部 线程由等待池移到锁池，然后参与锁的竞争，竞争成功则继续执行，如果不成功则留在锁池等 待锁被释放后再次参与竞争。而notify只会唤醒一个线程。

## 描述一下synchronized和lock区别

## 简单描述一下ABA问题

1. 有两个线程同时去修改一个变量的值，比如线程1、线程2，都更新变量值，将变量值从A更新成 B
2. 首先线程1、获取到CPU的时间片，线程2由于某些原因发生阻塞进行等待，此时线程1进行比较更 新（CompareAndSwap），成功将变量的值从A更新成B
3. 更新完毕之后，恰好又有线程3进来想要把变量的值从B更新成A，线程3进行比较更新，成功将变 量的值从B更新成A
4. 线程2获取到CPU的时间片，然后进行比较更新，发现值是预期的A，然后有更新成了B。但是线程 1并不知道，该值已经有了 A->B->A这个过程，这也就是我们常说的ABA问题
5. 可以通过加版本号或者加时间戳解决，或者保证单向递增或者递减就不会存在此类问题





## 实现一下DCL

```java
public class Singleton {
    //volatile是防止指令重排
    private static volatile Singleton singleton;
    private Singleton() {}
    public static Singleton getInstance() {
        //第一层判断singleton是不是为null
        //如果不为null直接返回，这样就不必加锁了
        if (singleton == null) {
            //现在再加锁
            synchronized (Singleton.class) {
                //第二层判断
                //如果A,B两个线程都在synchronized等待
                //A创建完对象之后，B还会再进入，如果不再检查一遍，B又会创建一个对象
                    if (singleton == null) {
                        singleton = new Singleton();
                    }
                }
            }
        return singleton;
    }
}
```



##  实现一个阻塞队列（用Condition写生产者与消费者就）

```java
public class ProviderConsumer<T> {
    private int length;
    private Queue<T> queue;
    private ReentrantLock lock = new ReentrantLock();
    private Condition provideCondition = lock.newCondition();
    private Condition consumeCondition = lock.newCondition();
    
    public ProviderConsumer(int length){
        this.length = length;
        this.queue = new LinkedList<T>();
    }
    
    public void provide(T product){
        lock.lock();
        try {
            while (queue.size() >= length) {
            	provideCondition.await();
        	}
            queue.add(product);
            consumeCondition.signal();
        } catch (InterruptedException e) {
        	e.printStackTrace();
        } finally {
        	lock.unlock();
        }
	}
	public T consume() {
        lock.lock();
        try {
            while (queue.isEmpty()) {
            	consumeCondition.await();
            }
        	T product = queue.remove();
            provideCondition.signal();
        	return product;
        } catch (InterruptedException e) {
        	e.printStackTrace();
        } finally {
        	lock.unlock();
        }
        return null;
    }
}
```



##  实现多个线程顺序打印abc 

```java
public class PrintABC {
    ReentrantLock lock = new ReentrantLock();
    Condition conditionA = lock.newCondition();
    Condition conditionB = lock.newCondition();
    Condition conditionC = lock.newCondition();
    volatile int value = 0;
    //打印多少遍
    private int count;
    public PrintABC (int count) {
    	this.count = count;
    }
    
    public void printABC() {
        new Thread(new ThreadA()).start();
        new Thread(new ThreadB()).start();
        new Thread(new ThreadC()).start();
    }
    
	class ThreadA implements Runnable{
        @Override
        public void run() {
            lock.lock();
            try {
                for (int i = 0; i < count; i++) {
                    while (value % 3 != 0) {
                        conditionA.await();
                    }
                    System.out.print("A");
                    conditionB.signal();
                    value ++;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }
	}

    class ThreadB implements Runnable{
        @Override
        public void run() {
            lock.lock();
            try {
                for (int i = 0; i < count; i++) {
                    while (value % 3 != 1) {
                        conditionB.await();
                    }
                    System.out.print("B");
                    conditionC.signal();
                    value ++;
                }
            } catch (InterruptedException e) {
            	e.printStackTrace();
            } finally {
            	lock.unlock();
            }
        }
    }
    class ThreadC implements Runnable{
        @Override
        public void run() {
        	lock.lock();
            try {
                for (int i = 0; i < count; i++) {
                    while ( value % 3 != 2) {
                        conditionC.await();
                    }
                    System.out.println("C");
                    conditionA.signal();
                    value ++;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }
    }
    
    public static void main(String[] args) {
        PrintABC printABC = new PrintABC(15);
        printABC.printABC();
	}
}
```





## 服务器CPU数量及线程池线程数量的关系

多线程之间是如何通信的？ 1、通过共享变量，变量需要volatile 修饰 2、使用wait()和notifyAll()方法，但是由于需要使用同一把锁，所以必须通知线程释放锁，被通知线程才 能获取到锁，这样导致通知不及时。 3、使用CountDownLatch实现，通知线程到指定条件，调用countDownLatch.countDown()，被通知 线程进行countDownLatch.await()。 4、使用Condition的await()和signalAll()方法。 



描述一下synchronized底层实现，以及和lock的区别？ 详见第九题 17.synchronized关键字加在静态方法和实例方法的区别? 修饰静态方法，是对类进行加锁，如果该类中有methodA 和methodB都是被synchronized修饰的静态 方法，此时有两个线程T1、T2分别调用methodA()和methodB()，则T2会阻塞等待直到T1执行完成之后 才能执行。 修饰实例方法时，是对实例进行加锁，锁的是实例对象的对象头，如果调用同一个对象的两个不同的被 synchronized修饰的实例方法时，看到的效果和上面的一样，如果调用不同对象的两个不同的被 synchronized修饰的实例方法时，则不会阻塞。 







18.countdownlatch的用法？ 两种用法： 1、让主线程await，业务线程进行业务处理，处理完成时调用countdownLatch.countDown()， CountDownLatch实例化的时候需要根据业务去选择CountDownLatch的count; 2、让业务线程await，主线程处理完数据之后进行countdownLatch.countDown()，此时业务线程被唤 醒，然后去主线程拿数据，或者执行自己的业务逻辑。 

19.线程池问题： （1）Executor提供了几种线程池 1、newCachedThreadPool()（工作队列使用的是 SynchronousQueue） 创建一个线程池，如果线程池中的线程数量过大，它可以有效的回收多余的线程，如果线程数不足，那么它可 以创建新的线程。 不足：这种方式虽然可以根据业务场景自动的扩展线程数来处理我们的业务，但是最多需要多少个线程同时处 理却是我们无法控制的。 优点：如果当第二个任务开始，第一个任务已经执行结束，那么第二个任务会复用第一个任务创建的线程，并 不会重新创建新的线程，提高了线程的复用率。 作用：该方法返回一个可以根据实际情况调整线程池中线程的数量的线程池。即该线程池中的线程数量不确 定，是根据实际情况动态调整的。 2、newFixedThreadPool()（工作队列使用的是 LinkedBlockingQueue） 这种方式可以指定线程池中的线程数。如果满了后又来了新任务，此时只能排队等待。 （2）线程池的参数 （3）拒绝策略 优点：newFixedThreadPool 的线程数是可以进行控制的，因此我们可以通过控制最大线程来使我们的服务 器达到最大的使用率，同时又可以保证即使流量突然增大也不会占用服务器过多的资源。 作用：该方法返回一个固定线程数量的线程池，该线程池中的线程数量始终不变，即不会再创建新的线程，也 不会销毁已经创建好的线程，自始自终都是那几个固定的线程在工作，所以该线程池可以控制线程的最大并发 数。 3、newScheduledThreadPool() 该线程池支持定时，以及周期性的任务执行，我们可以延迟任务的执行时间，也可以设置一个周期性的时间让 任务重复执行。该线程池中有以下两种延迟的方法。 scheduleAtFixedRate 不同的地方是任务的执行时间，如果间隔时间大于任务的执行时间，任务不受执行 时间的影响。如果间隔时间小于任务的执行时间，那么任务执行结束之后，会立马执行，至此间隔时间就会被 打乱。 scheduleWithFixedDelay 的间隔时间不会受任务执行时间长短的影响。 作用：该方法返回一个可以控制线程池内线程定时或周期性执行某任务的线程池。 4、newSingleThreadExecutor() 这是一个单线程池，至始至终都由一个线程来执行。 作用：该方法返回一个只有一个线程的线程池，即每次只能执行一个线程任务，多余的任务会保存到一个任务 队列中，等待这一个线程空闲，当这个线程空闲了再按 FIFO 方式顺序执行任务队列中的任务。 5、newSingleThreadScheduledExecutor() 只有一个线程，用来调度任务在指定时间执行。 作用：该方法返回一个可以控制线程池内线程定时或周期性执行某任务的线程池。只不过和上面的区别是该线 程池大小为 1，而上面的可以指定线程池的大小。 int corePoolSize,//线程池核心线程大小 int maximumPoolSize,//线程池最大线程数量 long keepAliveTime,//空闲线程存活时间 TimeUnit unit,//空闲线程存活时间单位，一共有七种静态属性(TimeUnit.DAYS天,TimeUnit.HOURS 小时,TimeUnit.MINUTES分钟,TimeUnit.SECONDS秒,TimeUnit.MILLISECONDS毫 秒,TimeUnit.MICROSECONDS微妙,TimeUnit.NANOSECONDS纳秒) BlockingQueue workQueue,//工作队列 ThreadFactory threadFactory,//线程工厂，主要用来创建线程(默认的工厂方法是： Executors.defaultThreadFactory()对线程进行安全检查并命名) RejectedExecutionHandler handler//拒绝策略(默认是：ThreadPoolExecutor.AbortPolicy不 执行并抛出异常) 当工作队列中的任务已到达最大限制，并且线程池中的线程数量也达到最大限制，这时如果有新任务提交进 来，就会执行拒绝策略。 jdk中提供了4中拒绝策略： ①ThreadPoolExecutor.CallerRunsPolicy （4）任务放置的顺序过程 该策略下，在调用者线程中直接执行被拒绝任务的 run 方法，除非线程池已经 shutdown，则直接抛弃任 务。 ②ThreadPoolExecutor.AbortPolicy 该策略下，直接丢弃任务，并抛出 RejectedExecutionException 异常。 ③ThreadPoolExecutor.DiscardPolicy 该策略下，直接丢弃任务，什么都不做。 ④ThreadPoolExecutor.DiscardOldestPolicy 该策略下，抛弃进入队列最早的那个任务，然后尝试把这次拒绝的任务放入队列。 除此之外，还可以根据应用场景需要来实现 RejectedExecutionHandler 接口自定义策略。 任务调度是线程池的主要入口，当用户提交了一个任务，接下来这个任务将如何执行都是由这个阶段决定的。 了解这部分就相当于了解了线程池的核心运行机制。 首先，所有任务的调度都是由execute方法完成的，这部分完成的工作是：检查现在线程池的运行状态、运行 线程数、运行策略，决定接下来执行的流程，是直接申请线程执行，或是缓冲到队列中执行，亦或是直接拒绝 该任务。其执行过程如下： 首先检测线程池运行状态，如果不是RUNNING，则直接拒绝，线程池要保证在RUNNING的状态下执行任务。 如果workerCount < corePoolSize，则创建并启动一个线程来执行新提交的任务。 如果workerCount >= corePoolSize，且线程池内的阻塞队列未满，则将任务添加到该阻塞队列中。 如果workerCount >= corePoolSize && workerCount < maximumPoolSize，且线程池内的阻塞队 列已满，则创建并启动一个线程来执行新提交的任务。 如果workerCount >= maximumPoolSize，并且线程池内的阻塞队列已满, 则根据拒绝策略来处理该任 务, 默认的处理方式是直接抛异常。 其执行流程如下图所示： （5）任务结束后会不会回收线程 根据情况. /java/util/concurrent/ThreadPoolExecutor.java:1127 final void runWorker(Worker w) { Thread wt = Thread.currentThread(); Runnable task = w.firstTask; w.firstTask = null; w.unlock(); // allow interrupts boolean completedAbruptly = true; try { while (task != null || (task = getTask()) != null) {...执行任务...} completedAbruptly = false; } finally { processWorkerExit(w, completedAbruptly); } } 首先线程池内的线程都被包装成了一个个的java.util.concurrent.ThreadPoolExecutor.Worker,然 后这个worker会马不停蹄的执行任务,执行完任务之后就会在while循环中去取任务,取到任务就继续执行,取 不到任务就跳出while循环(这个时候worker就不能再执行任务了)执行 processWorkerExit方法,这个方 法呢就是做清场处理,将当前woker线程从线程池中移除,并且判断是否是异常进入processWorkerExit方 法,如果是非异常情况,就对当前线程池状态(RUNNING,shutdown)和当前工作线程数和当前任务数做判断,是 否要加入一个新的线程去完成最后的任务. 那么什么时候会退出while循环呢?取不到任务的时候.下面看一下getTask方法 private Runnable getTask() { （6）未使用的线程池中的线程放在哪里 （7）线程池线程存在哪 （8）cache线程池会不会销毁核心线程 20.Java多线程的几种状态及线程各个状态之间是如何切换的？ boolean timedOut = false; // Did the last poll() time out? for (;;) { int c = ctl.get(); int rs = runStateOf(c); // Check if queue empty only if necessary. if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) { decrementWorkerCount(); return null; } int wc = workerCountOf(c); // Are workers subject to culling? boolean timed = allowCoreThreadTimeOut || wc > corePoolSize; if ((wc > maximumPoolSize || (timed && timedOut)) && (wc > 1 || workQueue.isEmpty())) { if (compareAndDecrementWorkerCount(c)) return null; continue; } try { Runnable r = timed ? workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) : workQueue.take(); if (r != null) return r; timedOut = true; } catch (InterruptedException retry) { timedOut = false; } } } private final HashSet workers = new HashSet(); private final HashSet workers = new HashSet(); 运行状态 状态描述 RUNNING 能接受新提交的任务,并且也能处理阻塞队列中的任务 SHUTDOWN 关闭状态,不再接受新提交的任务.但却可以继续处理阻塞队列中已经保存的任务 STOP 不能接收新任务,也不处理队列中的任务,会中断正在处理的线程 TIDYING 所有的任务已经终止,wokerCount = 0 TERMINATED 在terminated()方法执行后进入此状态 

21.如何在方法栈中进行数据传递？ 通过方法参数传递;通过共享变量;如果在用一个线程中,还可以使用ThreadLocal进行传递. 

22.描述一下ThreadLocal的底层实现形式及实现的数据结构？ Thread类中有两个变量threadLocals和inheritableThreadLocals，二者都是ThreadLocal内部类 ThreadLocalMap类型的变量，我们通过查看内部内ThreadLocalMap可以发现实际上它类似于一个 HashMap。在默认情况下，每个线程中的这两个变量都为null: 只有当线程第一次调用ThreadLocal的set或者get方法的时候才会创建他们。 除此之外，和我所想的不同的是，每个线程的本地变量不是存放在ThreadLocal实例中，而是放在调用 线程的ThreadLocals变量里面。也就是说，ThreadLocal类型的本地变量是存放在具体的线程空间上， 其本身相当于一个装载本地变量的工具壳，通过set方法将value添加到调用线程的threadLocals中，当 调用线程调用get方法时候能够从它的threadLocals中取出变量。如果调用线程一直不终止，那么这个本 地变量将会一直存放在他的threadLocals中，所以不使用本地变量的时候需要调用remove方法将 threadLocals中删除不用的本地变量,防止出现内存泄漏。 ThreadLocal.ThreadLocalMap threadLocals = null; ThreadLocal.ThreadLocalMap inheritableThreadLocals = null; public T get() { Thread t = Thread.currentThread(); ThreadLocalMap map = getMap(t); if (map != null) { ThreadLocalMap.Entry e = map.getEntry(this); if (e != null) { @SuppressWarnings("unchecked") T result = (T)e.value; return result; } } return setInitialValue(); } ThreadLocalMap getMap(Thread t) { return t.threadLocals; } 锁状态 25 bit 4bit 1bit 2bit 23bit 2bit 是否是偏向锁 锁标志位 轻量级 锁 指向栈中锁记录的指针 00 重量级 锁 指向互斥量（重量级锁）的指针 10 GC标记 空 11 偏向锁 线程ID Epoch 对象分代年龄 1 01 

23.Sychornized是否是公平锁？ 不是公平锁 

24.Sychronized和ReentryLock的区别？ 请看第9题 

25.描述一下线程池的创建方式、分类、应用场景、拒绝策略的场 景？ 请看第19题. 

26.描述一下锁的四种状态及升级过程？ 以下是32位的对象头描述 public void set(T value) { Thread t = Thread.currentThread(); ThreadLocalMap map = getMap(t); if (map != null) map.set(this, value); else createMap(t, value); } public void remove() { ThreadLocalMap m = getMap(Thread.currentThread()); if (m != null) m.remove(this); } synchronized锁的膨胀过程： 当线程访问同步代码块。首先查看当前锁状态是否是偏向锁(可偏向状态) 1、如果是偏向锁： 1.1、检查当前mark word中记录是否是当前线程id，如果是当前线程id，则获得偏向锁执行同步代码 块。 1.2、如果不是当前线程id，cas操作替换线程id，替换成功获得偏向锁(线程复用)，替换失败锁撤销升 级轻量锁(同一类对象多次撤销升级达到阈值20，则批量重偏向,这个点可以稍微提一下,详见下面的注意) 2、升级轻量锁 

27.描述一下CMS和G1的异同？ CMS只对老年代进行收集，采用“标记-清除”算法，会出现内存碎片，但是可以设置；而G1使用了独立区 域（Region）概念，G1从整体来看是基于“标记-整理”算法实现收集，从局部（两个Region）上来看是 基于“复制”算法实现的，但无论如何，这两种算法都意味着G1运作期间不会产生内存空间碎片尤其是当 Java 堆非常大的时候，G1 的优势更加明显，并且G1建立了可预测的停顿时间模型， 可以直观的设定停 顿时间的目标，减少每一次的垃圾收集时间，相比于 CMS GC，G1 未必能做到 CMS 在最好情况下的延 时停顿，但是最差情况要好很多。 

28. G1什么时候引发Full GC? 1. Evacuation的时候没有足够的to-space来存放晋升的对象; 2. 并发处理过程完成之前空间耗尽。 
29. 除了CAS，原子类，syn，Lock还有什么线程安全的方式？ park() 、信号量semaphore 

30. 描述一下HashMap和Hashtable的异同。 1.两者最主要的区别在于Hashtable是线程安全，而HashMap则非线程安全。 2.key、value都是对象，但是不能拥有重复key值，value值可以重复出现。 1.Hashtable中，key和value都不允许出现null值。 2.HashMap允许null值(key和value都可以)，因为在HashMap中null可以作为健，而它对应的值可以有 多个null。 3.Hashtable 是线程安全的，每个方法都要阻塞其他线程，所以 Hashtable 性能较差，HashMap 性能 较好，使用更广。 4.Hashtable 继承了 Dictionary类，而 HashMap 继承的是 AbstractMap 类 升级轻量锁对于当前线程，分配栈帧锁记录lock_record(包含mark word和object-指向锁记录首地 址)，对象头mark word复制到线程栈帧的锁记录 mark word存储的是无锁的hashcode(里面有重入次数 问题)。 3、重量级锁(纯理论可结合源码) CAS自旋达到一定次数升级为重量级锁(多个线程同时竞争锁时) 存储在ObjectMonitor对象，里面有很多属性ContentionList、EntryList 、WaitSet、 owner。当一个线程尝试获取锁时，如果该锁已经被占用，则该线程封装成ObjectWaiter对象插到 ContentionList队列的对首，然后调用park挂起。该线程锁时方式会从ContentionList或EntryList挑 一个唤醒。线程获得锁后调用Object的wait方法，则会加入到WaitSet集合中(当前锁或膨胀为重量级锁) 注意: 1.偏向锁在JDK1.6以上默认开启，开启后程序启动几秒后才会被激活 2.偏向锁撤销是需要在safe_point,也就是安全点的时候进行,这个时候是stop the word的,所以说偏向 锁的撤销是开销很大的,如果明确了项目里的竞争情况比较多,那么关闭偏向锁可以减少一些偏向锁撤销的开销 3.以class为单位，为每个class维护一个偏向锁撤销计数器。每一次该class的对象发生偏向撤销操作时 (这个时候进入轻量级锁)，该计数器+1，当这个值达到重偏向阈值(默认20,也就是说前19次进行加锁的时候, 都是假的轻量级锁,当第20次加锁的时候,就会走批量冲偏向的逻辑)时，JVM就认为该class的偏向锁有问 题，因此会进行批量重偏向。每个class对象也会有一个对应的epoch字段，每个处于偏向锁状态对象的mark word中也有该字段，其初始值为创建该对象时，class中的epoch值。每次发生批量重偏向时，就将该值+1， 同时遍历JVM中所有线程的站，找到该class所有正处于加锁状态的偏向锁，将其epoch字段改为新值。下次 获取锁时，发现当前对象的epoch值和class不相等，那就算当前已经偏向了其他线程，也不会执行撤销操 作，而是直接通过CAS操作将其mark word的Thread Id改为当前线程ID 4.需要看源码的同学:https://github.com/farmerjohngit/myblog/issues/12 
31. CAS的ABA问题怎么解决的？ 通过加版本号控制，只要有变更，就更新版本号 
32. 描述一下AQS？ 状态变量state AQS中定义了一个状态变量state，它有以下两种使用方法： （1）互斥锁 当AQS只实现为互斥锁的时候，每次只要原子更新state的值从0变为1成功了就获取了锁，可重入是通过 不断把state原子更新加1实现的。 （2）互斥锁 + 共享锁 当AQS需要同时实现为互斥锁+共享锁的时候，低16位存储互斥锁的状态，高16位存储共享锁的状态， 主要用于实现读写锁。 互斥锁是一种独占锁，每次只允许一个线程独占，且当一个线程独占时，其它线程将无法再获取互斥锁 及共享锁，但是它自己可以获取共享锁。 共享锁同时允许多个线程占有，只要有一个线程占有了共享锁，所有线程（包括自己）都将无法再获取 互斥锁，但是可以获取共享锁。 AQS队列 AQS中维护了一个队列，获取锁失败（非tryLock()）的线程都将进入这个队列中排队，等待锁释放后唤 醒下一个排队的线程（互斥锁模式下）。 condition队列 AQS中还有另一个非常重要的内部类ConditionObject，它实现了Condition接口，主要用于实现条件 锁。 ConditionObject中也维护了一个队列，这个队列主要用于等待条件的成立，当条件成立时，其它线程将 signal这个队列中的元素，将其移动到AQS的队列中，等待占有锁的线程释放锁后被唤醒。 Condition典型的运用场景是在BlockingQueue中的实现，当队列为空时，获取元素的线程阻塞在 notEmpty条件上，一旦队列中添加了一个元素，将通知notEmpty条件，将其队列中的元素移动到AQS 队列中等待被唤醒。 模板方法 AQS这个抽象类把模板方法设计模式运用地炉火纯青，它里面定义了一系列的模板方法，比如下面这 些： // 获取互斥锁 public final void acquire(int arg) { // tryAcquire(arg)需要子类实现 if (!tryAcquire(arg) && acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) selfInterrupt(); } // 获取互斥锁可中断 public final void acquireInterruptibly(int arg) throws InterruptedException { if (Thread.interrupted()) throw new InterruptedException(); // tryAcquire(arg)需要子类实现 if (!tryAcquire(arg)) doAcquireInterruptibly(arg); } // 获取共享锁 public final void acquireShared(int arg) { // tryAcquireShared(arg)需要子类实现 if (tryAcquireShared(arg) < 0) doAcquireShared(arg); 获取锁、释放锁的这些方法基本上都穿插在ReentrantLock、ReentrantReadWriteLock、 Semaphore、CountDownLatch的源码解析中 需要子类实现的方法 上面一起学习了AQS中几个重要的模板方法，下面我们再一起学习下几个需要子类实现的方法： } // 获取共享锁可中断 public final void acquireSharedInterruptibly(int arg) throws InterruptedException { if (Thread.interrupted()) throw new InterruptedException(); // tryAcquireShared(arg)需要子类实现 if (tryAcquireShared(arg) < 0) doAcquireSharedInterruptibly(arg); } // 释放互斥锁 public final boolean release(int arg) { // tryRelease(arg)需要子类实现 if (tryRelease(arg)) { Node h = head; if (h != null && h.waitStatus != 0) unparkSuccessor(h); return true; } return false; } // 释放共享锁 public final boolean releaseShared(int arg) { // tryReleaseShared(arg)需要子类实现 if (tryReleaseShared(arg)) { doReleaseShared(); return true; } return false; } // 互斥模式下使用：尝试获取锁 protected boolean tryAcquire(int arg) { throw new UnsupportedOperationException(); } // 互斥模式下使用：尝试释放锁 protected boolean tryRelease(int arg) { throw new UnsupportedOperationException(); } // 共享模式下使用：尝试获取锁 protected int tryAcquireShared(int arg) { throw new UnsupportedOperationException(); } // 共享模式下使用：尝试释放锁 protected boolean tryReleaseShared(int arg) { throw new UnsupportedOperationException(); } // 如果当前线程独占着锁，返回true protected boolean isHeldExclusively() { throw new UnsupportedOperationException(); } 这几个方法为什么不直接定义成抽象方法呢？ 因为子类只要实现这几个方法中的一部分就可以实现一个同步器了，所以不需要定义成抽象方法。 
33. JUC包里的同步组件主要实现了AQS的哪些主要方法？（见问题 32） 
34. 介绍一下volatile的功能？ 保证线程可见性 防止指令重排序 
35.  volatile的可见性和禁止指令重排序怎么实现的？ 可见性： volatile的功能就是被修饰的变量在被修改后可以立即同步到主内存，被修饰的变量在每次是用之 前都从主内存刷新。本质也是通过内存屏障来实现可见性 写内存屏障（Store Memory Barrier）可以促使处理器将当前store buffer（存储缓存）的值写回 主存。读内存屏障（Load Memory Barrier）可以促使处理器处理invalidate queue（失效队 列）。进而避免由于Store Buffer和Invalidate Queue的非实时性带来的问题。 禁止指令重排序： volatile是通过内存屏障来禁止指令重排序 JMM内存屏障的策略 在每个 volatile 写操作的前面插入一个 StoreStore 屏障。 在每个 volatile 写操作的后面插入一个 StoreLoad 屏障。 在每个 volatile 读操作的后面插入一个 LoadLoad 屏障。 在每个 volatile 读操作的后面插入一个 LoadStore 屏障。
36. 简要描述一下ConcurrentHashMap底层原理？ JDK1.7中的ConcurrentHashMap 内部主要是一个Segment数组，而数组的每一项又是一个HashEntry数组，元素都存在HashEntry数组 里。因为每次锁定的是Segment对象，也就是整个HashEntry数组，所以又叫分段锁。 JDK1.8中的ConcurrentHashMap 舍弃了分段锁的实现方式，元素都存在Node数组中，每次锁住的是一个Node对象，而不是某一段数 组，所以支持的写的并发度更高。 再者它引入了红黑树，在hash冲突严重时，读操作的效率更高 