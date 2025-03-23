import{_ as i,c as a,f as e,o as n}from"./app-BOK5XMKI.js";const t={};function s(r,l){return n(),a("div",null,l[0]||(l[0]=[e('<h2 id="java内存模型" tabindex="-1"><a class="header-anchor" href="#java内存模型"><span>Java内存模型</span></a></h2><ul><li>内存模型：在特定的操作协议下，对特定的内存或高速缓存进行读写访问的过程抽象</li><li>Java 内存模型主要关注 JVM 中把变量值存储到内存中和从内存中取出变量值这样的底层细节</li><li>所有共享的变量都存储在主内存中，每个线程都有自己的工作内存，工作内存中保存该线程使用到的变量的主内存副本拷贝</li><li>线程对变量的所有操作（读、写）都应该在工作内存中完成</li><li>不同线程之间不能相互访问工作内存，交互数据要通过主内存</li></ul><p><img src="https://cdn.nlark.com/yuque/0/2023/png/29236088/1683272248379-d69b3735-738c-42db-99e4-3a834b034b8a.png#averageHue=%23fdfefe&amp;clientId=uadc26a4c-3be0-4&amp;from=ui&amp;id=ub7358597&amp;originHeight=650&amp;originWidth=730&amp;originalType=binary&amp;ratio=2&amp;rotation=0&amp;showTitle=false&amp;size=176087&amp;status=done&amp;style=none&amp;taskId=u84742cef-42e7-452c-9ab6-78295945f07&amp;title=" alt="Snipaste_2023-05-05_15-37-13.png"></p><h2 id="内存间的交互操作" tabindex="-1"><a class="header-anchor" href="#内存间的交互操作"><span>内存间的交互操作</span></a></h2><p>Java 内存模型规定了一些操作来实现内存间交互，JVM 会保证它们是原子的</p><h3 id="交互操作" tabindex="-1"><a class="header-anchor" href="#交互操作"><span>交互操作</span></a></h3><ul><li>lock：锁定，把变量标识为线程独占，作用于主内存变量</li><li>unlock：解锁，把锁定的变量释放，别的线程才能使用，作用于主内存变量</li><li>read：读取，把变量值从主内存读取到工作内存中</li><li>load：载入，把 read 读取到的主内存中的值放到工作内存的变量副本中</li><li>use：使用，把工作内存中一个变量的值传递给执行引擎（如：字节码执行引擎）</li><li>assign：赋值，把从执行引擎接收到的值赋给工作内存里面的变量</li><li>store：存储，把工作内存中一个变量的值传递到主内存中</li><li>write：写入，把 store 进来的数据存储到如主内存的变量中</li></ul><p><img src="https://cdn.nlark.com/yuque/0/2023/png/29236088/1683273484127-79a1e59f-c13e-47f2-943b-4a7877011802.png#averageHue=%23fcfefe&amp;clientId=uadc26a4c-3be0-4&amp;from=ui&amp;id=u2c600a7d&amp;originHeight=684&amp;originWidth=860&amp;originalType=binary&amp;ratio=2&amp;rotation=0&amp;showTitle=false&amp;size=244371&amp;status=done&amp;style=none&amp;taskId=uf203524e-1e71-49f9-b595-2297691092e&amp;title=" alt="Snipaste_2023-05-05_15-57-46.png"></p><h3 id="交互操作的规则" tabindex="-1"><a class="header-anchor" href="#交互操作的规则"><span>交互操作的规则</span></a></h3><ul><li>不允许 read 和 load、store 和 write 操作之一单独出现，以上两个操作必须按顺序执行，但不保证连续执行，即，read 和 load 之间、store 和 write 之间可以插入其他指令</li><li>不允许一个线程丢弃它的最近的 assign 操作，即变量在工作内存中改变了之后必须把该变化同步回主内存中</li><li>不允许一个线程无原因的（没有发生过任何 assign 操作）把数据从线程的工作内存同步回主内存中</li><li>一个新的公关变量只能从主内存中“诞生”，不允许在工作内存中直接使用一个未被初始化的变量，也就是对一个变量实施 use 和 store 操作之前，必须先执行过了 assign 和 load 操作</li><li>一个变量在同一个时刻只运行一个线程对其执行 lock 操作，但 lock 操作可以被同一个线程重复执行多次，多次执行 lock 后，只有执行相同次数的 unlock 操作，变量才会被解锁</li><li>如果对一个变量执行 lock 操作，将会清空工作内存中此变量的值，在执行引擎使用这个变量前，需要重新执行 load 或 assign 操作初始化变量的值</li><li>如果一个变量没有被 lock 操作锁定，则不允许对它执行 unlock 操作，也不能 unlock 一个被其他线程锁定的变量</li><li>对一个变量执行 unlock 操作之前，必须先把此变量同步回主内存（执行 store 和 write 操作）</li></ul><h2 id="多线程的可见性" tabindex="-1"><a class="header-anchor" href="#多线程的可见性"><span>多线程的可见性</span></a></h2><ul><li>可见性：一个线程修改了变量，其他线程可以获取到被修改后的值</li><li>保证可见性的常见方法：volatile、synchronized、final（一旦初始化完成，其他线程就可见）</li></ul><h3 id="volatile" tabindex="-1"><a class="header-anchor" href="#volatile"><span>volatile</span></a></h3><ul><li>volatile 是 JVM 提供的最轻量级的同步机制，用 volatile 修饰的变量，对所有的线程可见，即对 volatile 变量所做的写操作能立即反映到其他线程中</li><li>用 volatile 修饰的变量，在多线程环境下仍然是不安全的</li><li>volatile 修饰的变量，禁止指令重排优化</li></ul><h3 id="适用-volatile-的场景" tabindex="-1"><a class="header-anchor" href="#适用-volatile-的场景"><span>适用 volatile 的场景</span></a></h3><ul><li>运算结果不依赖变量的当前值</li><li>或者能确保只有一个线程修改变量的值</li></ul><h2 id="有序性" tabindex="-1"><a class="header-anchor" href="#有序性"><span>有序性</span></a></h2><ul><li>在本线程内，操作都是有序的</li><li>在线程外观察，操作都是无序的，因此存在指令重排或主内存同步延时</li></ul><h2 id="指令重排" tabindex="-1"><a class="header-anchor" href="#指令重排"><span>指令重排</span></a></h2><ul><li>指令重排：指的是 JVM 为了优化，在条件允许的情况下，对指令进行一定的重新排列，直接运行当前能够立即执行的后续指令，避开获取下一条指令所需数据造成的等待</li><li>线程内串行语义（先后顺序），不考虑多线程间的语义</li><li>不是所有的指令都能重排，如： <ul><li>写后读：a = 1；b = a；写一个变量后，再读取这个变量</li><li>写后写：a = 1；a = 2；写一个变量后，再写这个变量</li><li>读后写：a = b；b = 1；读取一个变量后，再写这个变量</li></ul></li></ul><h3 id="基本规则" tabindex="-1"><a class="header-anchor" href="#基本规则"><span>基本规则</span></a></h3><ul><li>程序顺序原则：一个线程内保证语义的串行性（即代码是在一个线程中运行的，则按照先后顺序执行）</li><li>volatile 规则：volatile 变量一定要先赋值后才能取值</li><li>锁规则：解锁（unlock）必然发生在随后的加锁（lock）前</li><li>传递性：A 先于 B，B 先于 C，那么 A 必然先于 C</li><li>线程的 start() 方法先于它的每一个动作</li><li>线程的所有操作先于线程的终结（Thread.join()）</li><li>线程的中断（interrupt()）先于被中断线程的代码</li><li>对象的构造函数执行结束先于 finalize() 方法</li></ul><h2 id="线程安全的处理方法" tabindex="-1"><a class="header-anchor" href="#线程安全的处理方法"><span>线程安全的处理方法</span></a></h2><ul><li>不可变是线程安全的</li><li>互斥同步（阻塞同步）：synchronized、ReentrantLock <ul><li>一般情况下，synchronized 的性能比 ReentrantLock 要好</li><li>ReentrantLock 具有一些 synchronized 不具备的特性 <ul><li>等待可中断：当持有锁的线程长时间不释放锁，正在等待的线程可以选择放弃等待</li><li>公平锁：多个线程等待同一个锁时，必须严格按照申请锁的时间顺序来获取锁</li><li>可以绑定多个条件：一个 ReentrantLock 对象可以绑定多个 condition 对象，而 synchronized 是针对一个条件的，如果要针对多个条件就需要多个锁</li></ul></li></ul></li><li>非阻塞同步：是一种基于冲突检查的乐观锁策略，通常是先操作，如果没有冲突，操作就成功了，有冲突再采取其他方式进行补偿处理</li><li>无同步方案：在多线程中方法不涉及共享数据时不需要同步</li></ul><h2 id="锁优化" tabindex="-1"><a class="header-anchor" href="#锁优化"><span>锁优化</span></a></h2><h3 id="自旋锁" tabindex="-1"><a class="header-anchor" href="#自旋锁"><span>自旋锁</span></a></h3><ul><li>自旋：如果线程可以很快获取锁，那么可以不在 OS 层挂起线程，而是让线程做几次循环，即自旋</li><li>自适应自旋：自旋的时间不再固定，而是由前一次在同一个锁上的自旋时间和锁的拥有者状态来决定</li><li>如果锁被占用时间很短，自旋成功，那么能节省线程挂起、切换的时间，从而提升系统性能</li><li>如果锁被占用的时间很长，自旋失败，会耗费处理器资源，降低系统性能</li></ul><h3 id="锁消除" tabindex="-1"><a class="header-anchor" href="#锁消除"><span>锁消除</span></a></h3><ul><li>在编译代码的时候，JVM 检测到代码不存在共享数据竞争，就无需同步加锁，JVM 会将加的锁消除掉</li><li>通过 -XX:+EliminateLocks 开启，同时需要使用 -XX:+DoEscapeAnalysis 开启逃逸分析</li><li>逃逸分析 <ul><li>方法逃逸：一个方法中定义的一个对象，可能被外部方法引用</li><li>线程逃逸：对象可能被其他外部线程访问，如：赋值给类变量、在其他线程中访问实例变量</li></ul></li><li>可逃逸的资源不能进行锁消除</li></ul><h3 id="锁粗化" tabindex="-1"><a class="header-anchor" href="#锁粗化"><span>锁粗化</span></a></h3><ul><li>通常要求同板块要小，但一系列连续的操作导致对一个对象反复加锁和解锁，这会导致不必要的性能损耗，这种情况建议把锁同步的范围加大到整个操作上</li></ul><h3 id="轻量级锁" tabindex="-1"><a class="header-anchor" href="#轻量级锁"><span>轻量级锁</span></a></h3><ul><li>轻量级是相对于传统锁机制而言，本意是没有多线程竞争的情况下，减少传统锁机制使用 OS 实现的互斥锁产生的性能损耗</li><li>实现方式类似乐观锁</li><li>轻量级锁失败，表示存在竞争，升级为重量级锁，导致性能下降</li></ul><h3 id="偏向锁" tabindex="-1"><a class="header-anchor" href="#偏向锁"><span>偏向锁</span></a></h3><ul><li>偏向锁是在无竞争情况下，直接把整个同步消除，连乐观锁都不需要，从而提高性能，锁会偏向于当前已经占有锁的线程</li><li>只要没有竞争，获取偏向锁的线程，在将来进入同步块，也不需要做同步</li><li>当有其他线程请求相同的锁时，偏向模式结束</li><li>如果程序中大多数锁总是被多个线程访问的时候，即竞争比较激烈，偏向锁会降低性能</li><li>使用 -XX:-UseBiasedLocking 来禁用偏向锁，默认是开启的</li></ul><h2 id="jvm-获取锁的步骤" tabindex="-1"><a class="header-anchor" href="#jvm-获取锁的步骤"><span>JVM 获取锁的步骤</span></a></h2><ol><li>先尝试偏向锁</li><li>然后尝试轻量级锁</li><li>再然后尝试自旋锁</li><li>最后尝试普通锁，使用 OS 互斥量在操作系统层挂起</li></ol><h3 id="大致流程" tabindex="-1"><a class="header-anchor" href="#大致流程"><span>大致流程</span></a></h3><ol><li>尝试获取锁对象的对象头：当一个线程需要获取一个对象的锁时，首先会尝试获取这个对象的对象头，这个过程是比较轻量级的操作。</li><li>判断锁对象的对象头是否已经被其他线程占用：如果锁对象的对象头已经被其他线程占用了，那么当前线程就会进入锁阻塞状态。</li><li>自旋获取锁：如果锁对象的对象头没有被其他线程占用，当前线程就会尝试自旋获取锁。自旋是指当前线程在一个循环中反复尝试获取锁，直到获取到锁或者等待超时。</li><li>尝试获取锁失败，进入锁阻塞状态：如果自旋获取锁的过程中等待超时或者被其他线程抢占了锁，当前线程就会进入锁阻塞状态，等待锁释放或者被唤醒。</li></ol>',39)]))}const o=i(t,[["render",s],["__file","JVM对高效并发的支持.html.vue"]]),d=JSON.parse('{"path":"/md/article/language/java/jvm/JVM%E5%AF%B9%E9%AB%98%E6%95%88%E5%B9%B6%E5%8F%91%E7%9A%84%E6%94%AF%E6%8C%81.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Java内存模型","slug":"java内存模型","link":"#java内存模型","children":[]},{"level":2,"title":"内存间的交互操作","slug":"内存间的交互操作","link":"#内存间的交互操作","children":[{"level":3,"title":"交互操作","slug":"交互操作","link":"#交互操作","children":[]},{"level":3,"title":"交互操作的规则","slug":"交互操作的规则","link":"#交互操作的规则","children":[]}]},{"level":2,"title":"多线程的可见性","slug":"多线程的可见性","link":"#多线程的可见性","children":[{"level":3,"title":"volatile","slug":"volatile","link":"#volatile","children":[]},{"level":3,"title":"适用 volatile 的场景","slug":"适用-volatile-的场景","link":"#适用-volatile-的场景","children":[]}]},{"level":2,"title":"有序性","slug":"有序性","link":"#有序性","children":[]},{"level":2,"title":"指令重排","slug":"指令重排","link":"#指令重排","children":[{"level":3,"title":"基本规则","slug":"基本规则","link":"#基本规则","children":[]}]},{"level":2,"title":"线程安全的处理方法","slug":"线程安全的处理方法","link":"#线程安全的处理方法","children":[]},{"level":2,"title":"锁优化","slug":"锁优化","link":"#锁优化","children":[{"level":3,"title":"自旋锁","slug":"自旋锁","link":"#自旋锁","children":[]},{"level":3,"title":"锁消除","slug":"锁消除","link":"#锁消除","children":[]},{"level":3,"title":"锁粗化","slug":"锁粗化","link":"#锁粗化","children":[]},{"level":3,"title":"轻量级锁","slug":"轻量级锁","link":"#轻量级锁","children":[]},{"level":3,"title":"偏向锁","slug":"偏向锁","link":"#偏向锁","children":[]}]},{"level":2,"title":"JVM 获取锁的步骤","slug":"jvm-获取锁的步骤","link":"#jvm-获取锁的步骤","children":[{"level":3,"title":"大致流程","slug":"大致流程","link":"#大致流程","children":[]}]}],"git":{"updatedTime":1718018615000,"contributors":[{"name":"hyfly233","username":"hyfly233","email":"hyfly233@outlook.com","commits":5,"url":"https://github.com/hyfly233"}]},"filePathRelative":"md/article/language/java/jvm/JVM对高效并发的支持.md"}');export{o as comp,d as data};
