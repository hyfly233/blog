# Java异常与调优



## 异常

### 核心异常类



todo 流程图截图



### Throwable 类重要方法

#### 四个构造方法

```java
// 有关 Throwable 的具体细节
private String detailMessage;

private Throwable cause = this;

public Throwable() {
    fillInStackTrace();
}

public Throwable(String message) {
    fillInStackTrace();
    detailMessage = message;
}

public Throwable(String message, Throwable cause) {
    fillInStackTrace();
    detailMessage = message;
    this.cause = cause;
}

public Throwable(Throwable cause) {
    fillInStackTrace();
    detailMessage = (cause==null ? null : cause.toString());
    this.cause = cause;
}
```



#### getMessage

```java
public String getMessage() {
    return detailMessage;
}
```



#### getLocalizedMessage

```java
public String getLocalizedMessage() {
    return getMessage();
}
```



#### toString

```java
public String toString() {
    String s = getClass().getName();
    String message = getLocalizedMessage();
    return (message != null) ? (s + ": " + message) : s;
}
```



#### printStackTrace

```java
// 将此 throwable 及其回溯打印到标准错误流
public void printStackTrace() {
    printStackTrace(System.err);
}

private void printStackTrace(PrintStreamOrWriter s) {
    // 通过使用具有身份相等语义的 Set 来防止恶意覆盖 Throwable.equals
    Set<Throwable> dejaVu =
        Collections.newSetFromMap(new IdentityHashMap<Throwable, Boolean>());
    dejaVu.add(this);

    synchronized (s.lock()) {
        // Print our stack trace
        s.println(this);
        StackTraceElement[] trace = getOurStackTrace();
        for (StackTraceElement traceElement : trace)
            s.println("\tat " + traceElement);

        // Print suppressed exceptions, if any
        for (Throwable se : getSuppressed())
            se.printEnclosedStackTrace(s, trace, SUPPRESSED_CAPTION, "\t", dejaVu);

        // Print cause, if any
        Throwable ourCause = getCause();
        if (ourCause != null)
            ourCause.printEnclosedStackTrace(s, trace, CAUSE_CAPTION, "", dejaVu);
    }
}

private synchronized StackTraceElement[] getOurStackTrace() {
    // 如果这是对该方法的第一次调用，则使用来自回溯的信息初始化堆栈跟踪字段
    if (stackTrace == UNASSIGNED_STACK ||
        (stackTrace == null && backtrace != null) /* Out of protocol state */) {
        int depth = getStackTraceDepth();
        stackTrace = new StackTraceElement[depth];
        for (int i=0; i < depth; i++)
            stackTrace[i] = getStackTraceElement(i);
    } else if (stackTrace == null) {
        return UNASSIGNED_STACK;
    }
    return stackTrace;
}
```



#### getStackTrace

```java
public StackTraceElement[] getStackTrace() {
    return getOurStackTrace().clone();
}
```



#### Java 虚拟机堆栈

+ 栈：先进后出的结构，只能在一个位置（栈顶）进行插入和删除
+ 堆：树状数据结构，是一颗完全二叉树
+ 操作系统的堆栈：是指对内存进行操作和管理的一些方式，和数据结构中的堆栈是有区别的



##### 虚拟机栈的基本性质

+ 内存管理：栈由虚拟机自动分配
+ 内容存放：
+ 速度：
+ 申请大小受限：一块连续的内存空间，Java 默认是 1M
+ 结构：与数据结构的栈一致

![image-20220903180507599](C:\Users\hyfly\AppData\Roaming\Typora\typora-user-images\image-20220903180507599.png)



##### 虚拟机堆的基本性质

+ 内存管理：JVM中预留的一块内存空间，供程序自由使用，堆中被程序申请使用的内存在自动释放前是一直有效的
+ 申请/回收：



+ JVM 里的**堆**特指用于存放Java对象的内存区域
+ JVM 堆被同一个JVM实例中的所有Java线程共享
+ JVM 堆通常由垃圾回收器自动管理内存



##### Jvm 内存结构



![image-20220903181258922](C:\Users\hyfly\AppData\Roaming\Typora\typora-user-images\image-20220903181258922.png)



##### 虚拟机堆和栈可能抛出的异常

+ 虚拟机栈：
  1. StackOverflowError
  2. OutOfMemoryError
+ 虚拟机堆：
  1. OutOfMemoryError



### 如何阅读日志中的异常堆栈信息

#### 如何阅读异常堆栈信息

异常栈是以数据结构中的栈为基础，以先进后出的顺序打印的，位于打印内容的最下方的是最早抛出异常的，最上方的异常最晚被抛出且没有被捕获

异常信息的组成：异常名称 + 详细信息 + 异常路径（先进先出的顺序打印，打印的最上方最早被异常经过，逐层向外抛出）



#### JVM为什么要省略部分堆栈信息

为了提高性能，忽略不必要（重复）的信息，减少打印的 IO

```java
// enclosingTrace 可以简单理解为 trace 的父级对象
private void printEnclosedStackTrace(PrintStreamOrWriter s,
                                     StackTraceElement[] enclosingTrace,
                                     String caption,
                                     String prefix,
                                     Set<Throwable> dejaVu) {
    assert Thread.holdsLock(s.lock());
    if (dejaVu.contains(this)) {
        s.println("\t[CIRCULAR REFERENCE:" + this + "]");
    } else {
        dejaVu.add(this);
        // Compute number of frames in common between this and enclosing trace
        StackTraceElement[] trace = getOurStackTrace();
        int m = trace.length - 1;
        int n = enclosingTrace.length - 1;
        
        // 倒序找出 enclosingTrace 与 trace 从那一个栈帧不一样，算出有多少信息是重复的
        while (m >= 0 && n >=0 && trace[m].equals(enclosingTrace[n])) {
            m--; n--;
        }
        int framesInCommon = trace.length - 1 - m;

        // Print our stack trace
        s.println(prefix + caption + this);
        for (int i = 0; i <= m; i++)
            s.println(prefix + "\tat " + trace[i]);
        if (framesInCommon != 0)
            s.println(prefix + "\t... " + framesInCommon + " more");

        // Print suppressed exceptions, if any
        for (Throwable se : getSuppressed())
            se.printEnclosedStackTrace(s, trace, SUPPRESSED_CAPTION,
                                       prefix +"\t", dejaVu);

        // Print cause, if any
        Throwable ourCause = getCause();
        if (ourCause != null)
            ourCause.printEnclosedStackTrace(s, trace, CAUSE_CAPTION, prefix, dejaVu);
    }
}
```



打印全部堆栈信息

```java
/**
 * 异常捕捉
 */
public class ExceptionHandler implements Thread.UncaughtExceptionHandler {

    @Override
    public void uncaughtException(Thread t, Throwable e) {

        StackTraceElement[] ses = e.getStackTrace();
        System.err.println("Exception in thread \"" + t.getName() + "\" " + e.toString());

        for (StackTraceElement se : ses) {
            System.err.println("\tat " + se);
        }

        Throwable ec = e.getCause();
        if (null != ec) {
            uncaughtException(t, ec);
        }
    }
}


public static void main(String[] args) {
    Thread.setDefaultUncaughtExceptionHandler(new ExceptionHandler());
    new CompleteException().someMethodThrowable();
}
```



## 日志





## 线程堆栈



## JVM 调优