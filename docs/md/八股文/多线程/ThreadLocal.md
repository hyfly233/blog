## ThreadLocal
### ThreadLocal 是什么

- ThreadLocal 其实就是线程本地变量，他会在每个线程都创建一个副本，那么在线程之间访问内部副本变量就行了，做到了线程之间互相隔离![image.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1675687054141-6d877fd1-3a94-451b-b939-9b2f6a1b4fd5.png#averageHue=%23edf0e6&clientId=u00400ee8-e274-4&from=paste&id=gvHot&originHeight=626&originWidth=1984&originalType=url&ratio=1&rotation=0&showTitle=false&size=513616&status=done&style=none&taskId=ue84ab641-9cbf-461e-ac57-8a6c1fd9fff&title=)
- ThreadLocal 有一个静态内部类 ThreadLocalMap，ThreadLocalMap 包含了一个 Entry 数组，Entry 本身是一个弱引用，他的 key 是指向 ThreadLocal 的弱引用，弱引用的目的是为了防止内存泄露，如果是强引用那么除非线程结束，否则无法终止，可能会有内存泄漏的风险
- 但是这样还是会存在内存泄露的问题，假如 key 和 ThreadLocal 对象被回收之后，entry 中就存在 key 为 null ，但是 value 有值的 entry 对象，但是永远没办法被访问到，同样除非线程结束运行。解决方法就是调用 remove 方法删除 entry 对象
### ThreadLocal 的底层实现形式及数据结构 
Thread 类中有两个变量 threadLocals 和 inheritableThreadLocals，二者都是 ThreadLocal 内部类 ThreadLocalMap 类型的变量，内部类 ThreadLocalMap 类似于一个 HashMap。在默认情况下，每个线程中的这两个变量都为 null，只有当线程第一次调用 ThreadLocal#set() 或者 ThreadLocal#get() 方法的时候才会创建他们。ThreadLocal 类型的本地变量是存放在具体的线程空间上，其本身相当于一个装载本地变量的工具壳，通过 ThreadLocal#set() 方法将 value 添加到调用线程的 threadLocals 中，当调用线程调用 ThreadLocal#get() 方法时候能够从它的 threadLocals 中取出变量。如果调用线程一直不终止，那么这个本地变量将会一直存放在他的 threadLocals 中，所以不使用本地变量的时候需要调用 ThreadLocal#remove() 方法将 threadLocals 中删除不用的本地变量，防止出现内存泄漏
```java
ThreadLocal.ThreadLocalMap threadLocals = null;
ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;

public T get() { 
    Thread t = Thread.currentThread(); 
    ThreadLocalMap map = getMap(t); 
    if (map != null) { 
        ThreadLocalMap.Entry e = map.getEntry(this); 
        if (e != null) { 
            @SuppressWarnings("unchecked") 
            T result = (T)e.value; 
            return result; 
        } 
    } 
    return setInitialValue(); 
}

ThreadLocalMap getMap(Thread t) { 
    return t.threadLocals; 
}
```
### ThreadLoal的作用是什么 todo
ThreadLocal 是一种以空间换时间的做法，在每个 Thread 里面维护了一个 ThreadLocal。ThreadLocalMap 把数据进行隔离，数据不共享，自然就没有线程安全方面的问题
### ThreadLocal 原理分析
ThreadLocal 解决多线程程序的并发问题。ThreadLocal，顾名思义是线程的一个本地化对象，当工作于多线程中的对象使用 ThreadLocal 维护变量时，ThreadLocal 为每个使用该变量的线程分配一个独立的变量副本，所以每一个线程都可以独立的改变自己的副本，而不影响其他线程所对应的副本。从线程的角度看，这个变量就像是线程的本地变量。
ThreadLocal 类只有四个方法，能用上的也就是下面三个方法：

- void set(T value)：设置当前线程的线程局部变量的值。
- T get()：获得当前线程所对应的线程局部变量的值。
- void remove()：删除当前线程中线程局部变量的值。
### ThreadLocal 是如何做到为每一个线程维护一份独立的变量副本的呢？
在 ThreadLocal 类中有一个 Map，键为线程对象，值是其线程对应的变量的副本
```java
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class MyThreadLocal<T> {
    private Map<Thread, T> map = Collections.synchronizedMap(new HashMap<Thread, T>());

    public void set(T newValue) {
        map.put(Thread.currentThread(), newValue);
    }

    public T get() {
        return map.get(Thread.currentThread());
    }

    public void remove() {
        map.remove(Thread.currentThread());
    }
}
```
### 谈一谈ThreadLocal
ThreadLocal 是线程共享变量。ThreadLoacl 有一个静态内部类 ThreadLocalMap，其 Key 是 ThreadLocal 对象，值是 Entry 对象，ThreadLocalMap是每个线程私有的。

- set 给ThreadLocalMap设置值。
- get 获取ThreadLocalMap。
- remove 删除ThreadLocalMap类型的对象。

存在的问题：对于线程池，由于线程池会重用 Thread 对象，因此与 Thread 绑定的 ThreadLocal 也会被重用，造成一系列问题。
比如说内存泄漏。由于 ThreadLocal 是弱引用，但 Entry 的 value 是强引用，因此当 ThreadLocal 被垃圾回收后，value 依旧不会被释放，产生内存泄漏。
