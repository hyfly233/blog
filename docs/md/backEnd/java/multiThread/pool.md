# 线程池

## 核心参数

+ coreSize：核心线程数
+ maxSize：最大线程数
+ queueSize：等待队列数
+ keepAliveTime：空闲线程销毁时间
+ handler：拒绝策略，丢弃/丢弃抛异常/调用线程处理/丢弃最前面的任务然后尝试重新执行



Java标准库提供了`ExecutorService`接口表示线程池，它的典型用法如下：

```java
// 创建固定大小的线程池:
ExecutorService executor = Executors.newFixedThreadPool(3);
// 提交任务:
executor.submit(task1);
executor.submit(task2);
executor.submit(task3);
executor.submit(task4);
executor.submit(task5);
```

因为`ExecutorService`只是接口，Java标准库提供的几个常用实现类有：

- FixedThreadPool：线程数固定的线程池；
- CachedThreadPool：线程数根据任务动态调整的线程池；
- SingleThreadExecutor：仅单线程执行的线程池。





线程池在程序结束的时候要关闭

+ `shutdown()`方法关闭线程池的时候，它会等待正在执行的任务先完成，然后再关闭
+ `shutdownNow()`会立刻停止正在执行的任务
+ `awaitTermination()`则会等待指定的时间让线程池关闭。 



指定动态范围的线程池，可以这么写：

```java
int min = 4;
int max = 10;
ExecutorService es = new ThreadPoolExecutor(min, max,
        60L, TimeUnit.SECONDS, new SynchronousQueue<Runnable>());
```



# ScheduledThreadPool

任务本身固定，需要反复执行的，可以使用`ScheduledThreadPool`。放入`ScheduledThreadPool`的任务可以定期反复执行

```java
ScheduledExecutorService ses = Executors.newScheduledThreadPool(4);

// 2秒后开始执行定时任务，每3秒执行:
ses.scheduleAtFixedRate(new Task("fixed-rate"), 2, 3, TimeUnit.SECONDS);
```



Java标准库还提供了一个`java.util.Timer`类，这个类也可以定期执行任务

但是，一个`Timer`会对应一个`Thread`，所以，一个`Timer`只能定期执行一个任务，多个定时任务必须启动多个`Timer`

而一个`ScheduledThreadPool`就可以调度多个定时任务，所以完全可以用`ScheduledThreadPool`取代旧的`Timer`















