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



## 日志





## 线程堆栈



## JVM 调优