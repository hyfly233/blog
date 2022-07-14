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











