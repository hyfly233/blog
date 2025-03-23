import{_ as n,c as a,f as l,o as e}from"./app-BOK5XMKI.js";const i={};function c(p,s){return e(),a("div",null,s[0]||(s[0]=[l(`<h3 id="cyclicbarrier-和-countdownlatch-区别" tabindex="-1"><a class="header-anchor" href="#cyclicbarrier-和-countdownlatch-区别"><span>CyclicBarrier 和 CountDownLatch 区别</span></a></h3><p>这两个类非常类似，都在 java.util.concurrent 下，都可以用来表示代码运行到某个点上 区别：</p><ul><li>CyclicBarrier 的某个线程运行到某个点上之后，该线程即停止运行，直到所有的线程都到达了这个点，所有线程才重新运行；CountDownLatch 则不是，某线程运行到某个点上之后，只是给某个数值 -1 而已，该线程继续运行</li><li>CyclicBarrier 只能唤起一个任务，CountDownLatch 可以唤起多个任务</li><li>CyclicBarrier 可重用，CountDownLatch 不可重用，计数值为 0 该 CountDownLatch 就不可再用了</li></ul><h3 id="描述一下aqs-todo" tabindex="-1"><a class="header-anchor" href="#描述一下aqs-todo"><span>描述一下AQS？ todo</span></a></h3><p>AQS 的全称为 AbstractQueuedSynchronizer ，翻译过来的意思就是抽象队列同步器。这个类在 java.util.concurrent.locks 包下面。AQS 为构建锁和同步器提供了一些通用功能的是实现，因此，使用 AQS 能简单且高效地构造出应用广泛的大量的同步器，比如 ReentrantLock，Semaphore，其他的诸如 ReentrantReadWriteLock，SynchronousQueue 等等皆是基于 AQS 的</p><h3 id="简述countdownlatch" tabindex="-1"><a class="header-anchor" href="#简述countdownlatch"><span>简述CountDownLatch</span></a></h3><p>CountDownLatch这个类使一个线程等待其他线程各自执行完毕后再执行。是通过一个计数器来实现的，计数器的初始值是线程的数量。每当一个线程执行完毕后，调用countDown方法，计数器的值就减1，当计数器的值为0时，表示所有线程都执行完毕，然后在等待的线程就可以恢复工作了。只能一次性使用，不能reset。</p><h3 id="简述cyclicbarrier" tabindex="-1"><a class="header-anchor" href="#简述cyclicbarrier"><span>简述CyclicBarrier</span></a></h3><p>CyclicBarrier 主要功能和CountDownLatch类似，也是通过一个计数器，使一个线程等待其他线程各自执行完毕后再执行。但是其可以重复使用（reset）。</p><h3 id="简述semaphore" tabindex="-1"><a class="header-anchor" href="#简述semaphore"><span>简述Semaphore</span></a></h3><p>Semaphore即信号量。Semaphore 的构造方法参数接收一个 int 值，设置一个计数器，表示可用的许可数量即最大并发数。使用 acquire 方法获得一个许可证，计数器减一，使用 release 方法归还许可，计数器加一。如果此时计数器值为0，线程进入休眠。</p><h3 id="简述exchanger" tabindex="-1"><a class="header-anchor" href="#简述exchanger"><span>简述Exchanger</span></a></h3><p>Exchanger类可用于两个线程之间交换信息。可简单地将Exchanger对象理解为一个包含两个格子的容器，通过exchanger方法可以向两个格子中填充信息。线程通过exchange 方法交换数据，第一个线程执行 exchange 方法后会阻塞等待第二个线程执行该方法。当两个线程都到达同步点时这两个线程就可以交换数据当两个格子中的均被填充时，该对象会自动将两个格子的信息交换，然后返回给线程，从而实现两个线程的信息交换。</p><h3 id="简述concurrenthashmap" tabindex="-1"><a class="header-anchor" href="#简述concurrenthashmap"><span>简述ConcurrentHashMap</span></a></h3><p>JDK7采用锁分段技术。首先将数据分成 Segment 数据段，然后给每一个数据段配一把锁，当一个线程占用锁访问其中一个段的数据时，其他段的数据也能被其他线程访问。 get 除读到空值不需要加锁。该方法先经过一次再散列，再用这个散列值通过散列运算定位到 Segment，最后通过散列算法定位到元素。put 须加锁，首先定位到 Segment，然后进行插入操作，第一步判断是否需要对 Segment 里的 HashEntry 数组进行扩容，第二步定位添加元素的位置，然后将其放入数组。 JDK8的改进</p><ul><li>取消分段锁机制，采用CAS算法进行值的设置，如果CAS失败再使用 synchronized 加锁添加元素</li><li>引入红黑树结构，当某个槽内的元素个数超过8且 Node数组 容量大于 64 时，链表转为红黑树。</li><li>使用了更加优化的方式统计集合内的元素数量。</li></ul><h3 id="简述aqs" tabindex="-1"><a class="header-anchor" href="#简述aqs"><span>简述AQS</span></a></h3><p>AQS（AbstractQuenedSynchronizer）抽象的队列式同步器。AQS是将每一条请求共享资源的线程封装成一个锁队列的一个结点（Node），来实现锁的分配。AQS是用来构建锁或其他同步组件的基础框架，它使用一个 volatile int state 变量作为共享资源，如果线程获取资源失败，则进入同步队列等待；如果获取成功就执行临界区代码，释放资源时会通知同步队列中的等待线程。 子类通过继承同步器并实现它的抽象方法getState、setState 和 compareAndSetState对同步状态进行更改。 AQS获取独占锁/释放独占锁原理： 获取：（acquire）</p><ul><li>调用 tryAcquire 方法安全地获取线程同步状态，获取失败的线程会被构造同步节点并通过 addWaiter 方法加入到同步队列的尾部，在队列中自旋。</li><li>调用 acquireQueued 方法使得该节点以死循环的方式获取同步状态，如果获取不到则阻塞。</li></ul><p>释放：（release）</p><ul><li>调用 tryRelease 方法释放同步状态</li><li>调用 unparkSuccessor 方法唤醒头节点的后继节点，使后继节点重新尝试获取同步状态。</li></ul><p>AQS获取共享锁/释放共享锁原理 获取锁（acquireShared）</p><ul><li>调用 tryAcquireShared 方法尝试获取同步状态，返回值不小于 0 表示能获取同步状态。</li><li>释放（releaseShared），并唤醒后续处于等待状态的节点。</li></ul><h3 id="concurrenthashmap-底层原理-todo" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap-底层原理-todo"><span>ConcurrentHashMap 底层原理？ todo</span></a></h3><ul><li>JDK 1.7：ConcurrentHashMap 内部主要是一个 Segment 数组，而数组的每一项又是一个 HashEntry 数组，元素都存在 HashEntry 数组里。因为每次锁定的是 Segment 对象，也就是整个 HashEntry 数组，所以又叫分段锁</li><li>JDK 1.8：ConcurrentHashMap 舍弃了分段锁的实现方式，元素都存在Node数组中，每次锁住的是一个 Node 对象，而不是某一段数组，所以支持的写的并发度更高。引入了红黑树，在 hash 冲突严重时，读操作的效率更高</li></ul><h2 id="atomic" tabindex="-1"><a class="header-anchor" href="#atomic"><span>Atomic</span></a></h2><p>Atomic 是指一个操作是不可中断的。即使是在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程干扰。并发包 java.util.concurrent 的原子类都存放在 java.util.concurrent.atomic 下</p><p>根据操作的数据类型，可以将 JUC 包中的原子类分为 4 类 基本类型 使用原子的方式更新基本类型</p><ul><li>AtomicInteger：整型原子类</li><li>AtomicLong：长整型原子类</li><li>AtomicBoolean ：布尔型原子类</li></ul><p>数组类型 使用原子的方式更新数组里的某个元素</p><ul><li>AtomicIntegerArray：整型数组原子类</li><li>AtomicLongArray：长整型数组原子类</li><li>AtomicReferenceArray ：引用类型数组原子类</li></ul><p>引用类型</p><ul><li>AtomicReference：引用类型原子类</li><li>AtomicMarkableReference：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来</li><li>AtomicStampedReference ：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。</li></ul><p>对象的属性修改类型</p><ul><li>AtomicIntegerFieldUpdater:原子更新整型字段的更新器</li><li>AtomicLongFieldUpdater：原子更新长整型字段的更新器</li><li>AtomicReferenceFieldUpdater：原子更新引用类型里的字段</li></ul><h3 id="基本类型原子类" tabindex="-1"><a class="header-anchor" href="#基本类型原子类"><span>基本类型原子类</span></a></h3><p>使用原子的方式更新基本类型</p><ul><li>AtomicInteger：整型原子类</li><li>AtomicLong：长整型原子类</li><li>AtomicBoolean ：布尔型原子类</li></ul><p>上面三个类提供的方法几乎相同，所以我们这里以 AtomicInteger 为例子来介绍。 AtomicInteger 类常用方法</p><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> get</span><span style="color:#ECEFF4;">()</span><span style="color:#616E88;"> //获取当前的值</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getAndSet</span><span style="color:#ECEFF4;">(</span><span style="color:#81A1C1;">int</span><span style="color:#D8DEE9FF;"> newValue</span><span style="color:#ECEFF4;">)</span><span style="color:#616E88;">//获取当前的值，并设置新的值</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getAndIncrement</span><span style="color:#ECEFF4;">()</span><span style="color:#616E88;">//获取当前的值，并自增</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getAndDecrement</span><span style="color:#ECEFF4;">()</span><span style="color:#616E88;"> //获取当前的值，并自减</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getAndAdd</span><span style="color:#ECEFF4;">(</span><span style="color:#81A1C1;">int</span><span style="color:#D8DEE9FF;"> delta</span><span style="color:#ECEFF4;">)</span><span style="color:#616E88;"> //获取当前的值，并加上预期的值</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">boolean</span><span style="color:#88C0D0;"> compareAndSet</span><span style="color:#ECEFF4;">(</span><span style="color:#81A1C1;">int</span><span style="color:#D8DEE9FF;"> expect</span><span style="color:#ECEFF4;">,</span><span style="color:#81A1C1;"> int</span><span style="color:#D8DEE9FF;"> update</span><span style="color:#ECEFF4;">)</span><span style="color:#616E88;"> //如果输入的数值等于预期值，则以原子方式将该值设置为输入值（update）</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> void</span><span style="color:#88C0D0;"> lazySet</span><span style="color:#ECEFF4;">(</span><span style="color:#81A1C1;">int</span><span style="color:#D8DEE9FF;"> newValue</span><span style="color:#ECEFF4;">)</span><span style="color:#616E88;">//最终设置为newValue,使用 lazySet 设置之后可能导致其他线程在之后的一小段时间内还是可以读到旧的值。</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基本数据类型原子类的优势" tabindex="-1"><a class="header-anchor" href="#基本数据类型原子类的优势"><span>基本数据类型原子类的优势</span></a></h3><p>通过一个简单例子带大家看一下基本数据类型原子类的优势 1、多线程环境不使用原子类保证线程安全（基本数据类型）</p><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#81A1C1;">class</span><span style="color:#8FBCBB;"> Test</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        private</span><span style="color:#81A1C1;"> volatile</span><span style="color:#81A1C1;"> int</span><span style="color:#D8DEE9;"> count</span><span style="color:#81A1C1;"> =</span><span style="color:#B48EAD;"> 0</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">        //若要线程安全执行执行count++，需要加锁</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        public</span><span style="color:#81A1C1;"> synchronized</span><span style="color:#81A1C1;"> void</span><span style="color:#88C0D0;"> increment</span><span style="color:#ECEFF4;">()</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">                  count</span><span style="color:#81A1C1;">++;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        public</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getCount</span><span style="color:#ECEFF4;">()</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">                  return</span><span style="color:#D8DEE9FF;"> count</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">}</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、多线程环境使用原子类保证线程安全（基本数据类型）</p><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#81A1C1;">class</span><span style="color:#8FBCBB;"> Test2</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        private</span><span style="color:#8FBCBB;"> AtomicInteger</span><span style="color:#D8DEE9;"> count</span><span style="color:#81A1C1;"> =</span><span style="color:#81A1C1;"> new</span><span style="color:#88C0D0;"> AtomicInteger</span><span style="color:#ECEFF4;">()</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        public</span><span style="color:#81A1C1;"> void</span><span style="color:#88C0D0;"> increment</span><span style="color:#ECEFF4;">()</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">                  count</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">incrementAndGet</span><span style="color:#ECEFF4;">()</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">      //使用AtomicInteger之后，不需要加锁，也可以实现线程安全。</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">       public</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getCount</span><span style="color:#ECEFF4;">()</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">                return</span><span style="color:#D8DEE9;"> count</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">get</span><span style="color:#ECEFF4;">()</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">}</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h3><p>AtomicInteger 线程安全原理简单分析 AtomicInteger 类的部分源码：</p><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#616E88;">    // setup to use Unsafe.compareAndSwapInt for updates（更新操作时提供“比较并替换”的作用）</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    private</span><span style="color:#81A1C1;"> static</span><span style="color:#81A1C1;"> final</span><span style="color:#8FBCBB;"> Unsafe</span><span style="color:#D8DEE9;"> unsafe</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9;"> Unsafe</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">getUnsafe</span><span style="color:#ECEFF4;">()</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    private</span><span style="color:#81A1C1;"> static</span><span style="color:#81A1C1;"> final</span><span style="color:#81A1C1;"> long</span><span style="color:#D8DEE9;"> valueOffset</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    static</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        try</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">            valueOffset </span><span style="color:#81A1C1;">=</span><span style="color:#D8DEE9;"> unsafe</span><span style="color:#ECEFF4;">.</span><span style="color:#D8DEE9;">objectFieldOffset</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">                (</span><span style="color:#D8DEE9;">AtomicInteger</span><span style="color:#ECEFF4;">.</span><span style="color:#D8DEE9;">class</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">getDeclaredField</span><span style="color:#ECEFF4;">(</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">value</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#ECEFF4;">))</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span><span style="color:#81A1C1;"> catch</span><span style="color:#ECEFF4;"> (</span><span style="color:#8FBCBB;">Exception</span><span style="color:#D8DEE9;"> ex</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span><span style="color:#81A1C1;"> throw</span><span style="color:#81A1C1;"> new</span><span style="color:#88C0D0;"> Error</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">ex</span><span style="color:#ECEFF4;">)</span><span style="color:#81A1C1;">;</span><span style="color:#ECEFF4;"> }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    }</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    private</span><span style="color:#81A1C1;"> volatile</span><span style="color:#81A1C1;"> int</span><span style="color:#D8DEE9;"> value</span><span style="color:#81A1C1;">;</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AtomicInteger 类主要利用 CAS (compare and swap) + volatile 和 native 方法来保证原子操作，从而避免 synchronized 的高开销，执行效率大为提升。 CAS 的原理是拿期望的值和原本的一个值作比较，如果相同则更新成新的值。UnSafe 类的 objectFieldOffset() 方法是一个本地方法，这个方法是用来拿到“原来的值”的内存地址。另外 value 是一个 volatile 变量，在内存中可见，因此 JVM 可以保证任何时刻任何线程总能拿到该变量的最新值。</p><h2 id="数组类型原子类" tabindex="-1"><a class="header-anchor" href="#数组类型原子类"><span>数组类型原子类</span></a></h2><p>使用原子的方式更新数组里的某个元素</p><ul><li>AtomicIntegerArray：整形数组原子类</li><li>AtomicLongArray：长整形数组原子类</li><li>AtomicReferenceArray ：引用类型数组原子类</li></ul><p>上面三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerArray 为例子来介绍。</p><h2 id="引用类型原子类" tabindex="-1"><a class="header-anchor" href="#引用类型原子类"><span><a href="#%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B%E5%8E%9F%E5%AD%90%E7%B1%BB">#</a> 引用类型原子类</span></a></h2><p>基本类型原子类只能更新一个变量，如果需要原子更新多个变量，需要使用 引用类型原子类。</p><ul><li>AtomicReference：引用类型原子类</li><li>AtomicStampedReference：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。</li><li>AtomicMarkableReference ：原子更新带有标记的引用类型。该类将 boolean 标记与引用关联起来，也可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。</li></ul><p>上面三个类提供的方法几乎相同，所以我们这里以 AtomicReference 为例子来介绍。 AtomicReference 类使用示例 :</p><h2 id="对象的属性修改类型原子类" tabindex="-1"><a class="header-anchor" href="#对象的属性修改类型原子类"><span><a href="#%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7%E4%BF%AE%E6%94%B9%E7%B1%BB%E5%9E%8B%E5%8E%9F%E5%AD%90%E7%B1%BB">#</a> 对象的属性修改类型原子类</span></a></h2><p>如果需要原子更新某个类里的某个字段时，需要用到对象的属性修改类型原子类。</p><ul><li>AtomicIntegerFieldUpdater:原子更新整形字段的更新器</li><li>AtomicLongFieldUpdater：原子更新长整形字段的更新器</li><li>AtomicReferenceFieldUpdater ：原子更新引用类型里的字段的更新器</li></ul><p>要想原子地更新对象的属性需要两步。第一步，因为对象的属性修改类型原子类都是抽象类，所以每次使用都必须使用静态方法 newUpdater()创建一个更新器，并且需要设置想要更新的类和属性。第二步，更新的对象属性必须使用 public volatile 修饰符。 上面三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerFieldUpdater为例子来介绍。</p><h3 id="简述常见的atomic类" tabindex="-1"><a class="header-anchor" href="#简述常见的atomic类"><span>简述常见的Atomic类</span></a></h3><p>在很多时候，我们需要的仅仅是一个简单的、高效的、线程安全的++或者--方案，使用synchronized关键字和lock固然可以实现，但代价比较大，此时用原子类更加方便。基本数据类型的原子类有：</p><ul><li>AtomicInteger 原子更新整型</li><li>AtomicLong 原子更新长整型</li><li>AtomicBoolean 原子更新布尔类型</li></ul><p>Atomic数组类型有：</p><ul><li>AtomicIntegerArray 原子更新整型数组里的元素</li><li>AtomicLongArray 原子更新长整型数组里的元素</li><li>AtomicReferenceArray 原子更新引用类型数组里的元素。</li></ul><p>Atomic引用类型有：</p><ul><li>AtomicReference 原子更新引用类型</li><li>AtomicMarkableReference 原子更新带有标记位的引用类型，可以绑定一个 boolean 标记</li><li>AtomicStampedReference 原子更新带有版本号的引用类型</li></ul><p>FieldUpdater类型：</p><ul><li>AtomicIntegerFieldUpdater 原子更新整型字段的更新器</li><li>AtomicLongFieldUpdater 原子更新长整型字段的更新器</li><li>AtomicReferenceFieldUpdater 原子更新引用类型字段的更新器</li></ul><h3 id="简述atomic类基本实现原理" tabindex="-1"><a class="header-anchor" href="#简述atomic类基本实现原理"><span>简述Atomic类基本实现原理</span></a></h3><p>以AtomicIntger 为例。 方法getAndIncrement，以原子方式将当前的值加1，具体实现为：</p><ul><li>在 for 死循环中取得 AtomicInteger 里存储的数值</li><li>对 AtomicInteger 当前的值加 1</li><li>调用 compareAndSet 方法进行原子更新</li><li>先检查当前数值是否等于 expect</li><li>如果等于则说明当前值没有被其他线程修改，则将值更新为 next，</li><li>如果不是会更新失败返回 false，程序会进入 for 循环重新进行 compareAndSet 操作。</li></ul>`,73)]))}const r=n(i,[["render",c],["__file","JUC.html.vue"]]),t=JSON.parse('{"path":"/md/interview/java/multithread/JUC.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":3,"title":"CyclicBarrier 和 CountDownLatch 区别","slug":"cyclicbarrier-和-countdownlatch-区别","link":"#cyclicbarrier-和-countdownlatch-区别","children":[]},{"level":3,"title":"描述一下AQS？ todo","slug":"描述一下aqs-todo","link":"#描述一下aqs-todo","children":[]},{"level":3,"title":"简述CountDownLatch","slug":"简述countdownlatch","link":"#简述countdownlatch","children":[]},{"level":3,"title":"简述CyclicBarrier","slug":"简述cyclicbarrier","link":"#简述cyclicbarrier","children":[]},{"level":3,"title":"简述Semaphore","slug":"简述semaphore","link":"#简述semaphore","children":[]},{"level":3,"title":"简述Exchanger","slug":"简述exchanger","link":"#简述exchanger","children":[]},{"level":3,"title":"简述ConcurrentHashMap","slug":"简述concurrenthashmap","link":"#简述concurrenthashmap","children":[]},{"level":3,"title":"简述AQS","slug":"简述aqs","link":"#简述aqs","children":[]},{"level":3,"title":"ConcurrentHashMap 底层原理？ todo","slug":"concurrenthashmap-底层原理-todo","link":"#concurrenthashmap-底层原理-todo","children":[]},{"level":2,"title":"Atomic","slug":"atomic","link":"#atomic","children":[{"level":3,"title":"基本类型原子类","slug":"基本类型原子类","link":"#基本类型原子类","children":[]},{"level":3,"title":"基本数据类型原子类的优势","slug":"基本数据类型原子类的优势","link":"#基本数据类型原子类的优势","children":[]},{"level":3,"title":"","slug":"","link":"#","children":[]}]},{"level":2,"title":"数组类型原子类","slug":"数组类型原子类","link":"#数组类型原子类","children":[]},{"level":2,"title":"# 引用类型原子类","slug":"引用类型原子类","link":"#引用类型原子类","children":[]},{"level":2,"title":"# 对象的属性修改类型原子类","slug":"对象的属性修改类型原子类","link":"#对象的属性修改类型原子类","children":[{"level":3,"title":"简述常见的Atomic类","slug":"简述常见的atomic类","link":"#简述常见的atomic类","children":[]},{"level":3,"title":"简述Atomic类基本实现原理","slug":"简述atomic类基本实现原理","link":"#简述atomic类基本实现原理","children":[]}]}],"git":{"updatedTime":1711074643000,"contributors":[{"name":"hyfly233","username":"hyfly233","email":"hyfly233@outlook.com","commits":4,"url":"https://github.com/hyfly233"}]},"filePathRelative":"md/interview/java/multithread/JUC.md"}');export{r as comp,t as data};
