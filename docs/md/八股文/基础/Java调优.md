# Java调优

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



- 栈：先进后出的结构，只能在一个位置（栈顶）进行插入和删除
- 堆：树状数据结构，是一颗完全二叉树
- 操作系统的堆栈：是指对内存进行操作和管理的一些方式，和数据结构中的堆栈是有区别的



##### 虚拟机栈的基本性质



- 内存管理：栈由虚拟机自动分配
- 内容存放：
- 速度：
- 申请大小受限：一块连续的内存空间，Java 默认是 1M
- 结构：与数据结构的栈一致







##### 虚拟机堆的基本性质



-  内存管理：JVM中预留的一块内存空间，供程序自由使用，堆中被程序申请使用的内存在自动释放前是一直有效的 
-  申请/回收： 
-  JVM 里的**堆**特指用于存放Java对象的内存区域 
-  JVM 堆被同一个JVM实例中的所有Java线程共享 
-  JVM 堆通常由垃圾回收器自动管理内存 



##### Jvm 内存结构







##### 虚拟机堆和栈可能抛出的异常



- 虚拟机栈： 

1. 1. StackOverflowError
   2. OutOfMemoryError

- 虚拟机堆： 

1. 1. OutOfMemoryError



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







# 优化方案



## 云端部署



1.  本地项目使用`mvn clean package`打包生产jar文件 
2.  将jar包上传服务器，并编写额外的`application.properties`配置文件，用于优化自带的Tomcat 
3.  编写`deploy.sh`文件启动对应的项目 

```shell
nohup java -Xms2048m -Xmx2048m -XX:NewSize=1024m -XX:MaxNewSize=1024m -jar test.jar
--spring.config.addition-location=/var/application.properties
```

 



参数说明



- nohup：以非停止方式运行程序，即便控制台退出了程序也不会停止
- java：java命令启动，设置jvm初始和最大内存为2048m，设置jvm中初始新生代和最大新生代大小为1024m，设置成一样的目的是为了减少扩展jvm内存池过程中向操作系统索要内存分配的消耗，
- –spring.config.addtion-location：指定额外的配置文件地址



## 配置优化



### Tomcat配置优化



- 最小线程数
- 最大线程数
- 线程等待队列
- 连接数
- keepAlive优化



## 分布式扩展



### Nginx负载均衡反向代理



#### OpenResty



1.  在linux安装pcre，openssl，gcc，curl等 

```shell
yum install pcre-devel openssl-devel gcc curl
```

 

1.  下载openresty，解压`tar -xvzf openresty**.tar.gz` 
2.  `./configure make && make install` 
3.  安装完成，nginx默认安装在 //usr/local/openresty/nginx目录下 



#### Nginx静态资源部署



1. 进入nginx根目录下的html下，然后新建resources目录用于存放前端静态资源
2. 设置指向resources目录下的location可以访问对应的html下的静态资源文件



#### Nginx动态请求反向代理



配置一个backend server，用于指向后端不同的server集群，配置内容为server集群的局域网ip，以及轮训的权重值，并且配置一个location，当访问规则命中location任何一个规则的时候则可以进入反向代理规则



```nginx
upstream backend_server{
    server test_server1 weight=1;
    server test_server2 weight=1;
}
location / {
    proxy_pass http://backend_server;
    proxy_set_header Host $http_host;
}
```



最后在 Tomcat 中开启 access log



### Java服务分布式



部署脚本



启动脚本



### 分布式会话



cookie



session



token



## 查询优化



### Redis缓存



缓存脏读处理



反击穿



### 本地缓存



guava cache



缓存清理



### 热点缓存



如何判断热



如何保持热



如何淘汰非热



### Nginx代理缓存



在`nginx.config`中声明



```nginx
#//usr/local/openresty/nginx/cache_temp：把缓存⽂件放在哪⾥
#levels：⽬录设置两层结构⽤来缓存
#keys_zone：指定了⼀个叫tmp_cache的缓存区，并且设置了100m的内存⽤来存储缓存key到⽂件路径的位置
#inactive：缓存⽂件超过7天后⾃动释放淘汰
#max_size：缓存⽂件总⼤⼩超过100g后⾃动释放淘汰

#申明⼀个cache缓存节点的路径
proxy_cache_path //usr/local/openresty/nginx/cache_temp levels=1:2 keys_zone=tmp_cache:100m inactive=7d max_size=100000m
```



在 location 内加入



```nginx
proxy_cache tmp_cache;
proxy_cache_valid 200 206 304 302 10d;
proxy_cache_key $request_uri;
```



### OpenResty



加载 lua 模块，http模块下



```nginx
lua_package_path "/usr/local/openresty/?.lua;;"; #lua 模块
lua_package_cpath "/usr/local/openresty/lualib/?.so;;"; #c模块
```



测试输出



```nginx
location = /lua {
	default_type 'text/plain';
	content_by_lua 'ngx.say("hello,lua!")';
}
```



#### shared dict扩展



1.  修改nginx.conf内，加入shared dictionary的扩展，声明128m的共享字典的访问内存 

```nginx
lua_shared_dict my_cache 128m;
```

 

1.  设置location用来做访问shared dict的lua文件 

```nginx
location ^~/itemlua/get {
	default_type 'application/json';
	content_by_lua_file '/usr/local/openresty/nginx/lua/itemsharedic.lua';
}
```

 

1.  然后使用itemlua url去访问验证 



### 静态资源CDN



刷新方式



### 全页面静态化 PhantomJS



爬虫



初始化标记



CDN部署



## 流量削峰



### 秒杀令牌



权限模块



令牌频次控制



### 秒杀大闸



库存联动



### 队列泄洪



## 交易优化（商城秒杀）



### 高效验证



缓存



索引



### 缓存库存



原子操作



一致性



### 库存售罄防击穿



缓存令牌



### 交易异步化



异步



轮询



### RocketMQ事务型消息



生产者



消费者



消息反查



## 防刷限流



### 验证码



### 令牌桶限流



ratelimiter



### 防黄牛防刷



设备指纹







### JVM调优怎么做 ChatGPT

JVM调优是优化Java应用程序性能的重要步骤。以下是一些JVM调优的建议：

1. 监控JVM性能：使用性能监控工具（如JConsole，VisualVM等）来收集JVM的性能数据，包括CPU使用率、内存使用率、线程数等，以帮助您了解应用程序在JVM上的运行情况。
2. 调整JVM参数：JVM提供了许多可调整的参数，如堆大小、线程池大小、GC策略等。通过调整这些参数，可以优化应用程序的性能。例如，通过调整堆大小和GC策略可以减少GC暂停时间。
3. 选择合适的GC策略：GC策略会影响应用程序的性能，因此选择合适的GC策略至关重要。例如，CMS GC适用于大型内存的应用程序，而G1 GC则适用于内存较小的应用程序。
4. 优化代码：优化应用程序的代码可以减少JVM的负担，从而提高性能。例如，减少对象的创建和销毁、使用高效的算法和数据结构、避免使用递归等。
5. 使用高效的数据存储方式：使用高效的数据存储方式，如缓存、内存映射文件等，可以减少JVM的IO负担，提高应用程序的性能。
6. 避免内存泄漏：内存泄漏会导致应用程序使用的内存越来越多，最终导致JVM崩溃。因此，要及时发现和修复内存泄漏问题。

总之，JVM调优是一个复杂和需要耐心的过程。需要深入了解应用程序和JVM的内部工作原理，并不断尝试和实践不同的调优策略。





## Java程序如何排除线上问题



### 通用JVM工具



-  jps：虚拟机进程状态工具 

```shell
jps -v | grep pid
```

 

-  jinfo：jvm参数信息工具 

```shell
jinfo -flags pid
```

 

-  jstat：查看虚拟机各种运行状态 

```shell
jstat -gcutil pid
```

 

- - S0：新生代中 Survivor space 0 区已使用空间的百分比
  - S1：新生代中 Survivor space 1 区已使用空间的百分比
  - E：新生代已使用空间的百分比
  - O：老年代已使用空间的百分比
  - M：元数据区已使用空间的百分比
  - CCS：压缩类空间利用率百分比
  - YGC：从应用程序启动到当前，发生Yang GC的次数
  - YGCT：从应用程序启动到当前，Yang GC所用的时间【单位秒】
  - FGC：从应用程序启动到当前，发生Full GC的次数
  - FGCT：从应用程序启动到当前，Full GC所用的时间
  - GCT：从应用程序启动到当前，用于垃圾回收的总时间【单位秒】

-  jstack：线程快照工具 

```shell
jstack -l pid
```

 

-  jmap：HeapDump工具 

```shell
jmap -heap pid  // 查看堆信息
jmap -dump:format = b, file = xxx.hprof pid  // 导出消息文件

jhat -port 8899 xxx.hprof  // 查看文件内容
```

 



### 线上OOM问题排查



1、设置启动参数



```shell
java -Xms20m -Xmx48m -XX:+HeapDumpOnOutOfMemoryError XX:HeapDump=./xxx.hprof -jar xxx.jar
```



2、使用jprofiler查看hprof文件以及call tree分析



### jprofiler



todo