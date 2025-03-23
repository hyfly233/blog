import{_ as l,c as s,f as a,o as i}from"./app-BOK5XMKI.js";const e={};function r(o,n){return i(),s("div",null,n[0]||(n[0]=[a(`<h1 id="spring" tabindex="-1"><a class="header-anchor" href="#spring"><span>Spring</span></a></h1><h2 id="基础" tabindex="-1"><a class="header-anchor" href="#基础"><span>基础</span></a></h2><h3 id="什么是spring" tabindex="-1"><a class="header-anchor" href="#什么是spring"><span>什么是Spring</span></a></h3><p>Spring是一个开源的Java EE开发框架</p><p>Spring的核心功能可以应用在任何Java应用程序中，但对Java EE平台上的Web应用程序有更好的扩展性</p><p>Spring的目标是使得Java EE应用程序的开发更加简捷</p><h3 id="spring有哪些优点" tabindex="-1"><a class="header-anchor" href="#spring有哪些优点"><span>Spring有哪些优点</span></a></h3><ul><li>轻量级：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB</li><li>控制反转(IOC)：使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象</li><li>面向切面编程(AOP)：支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来</li><li>容器：Spring包含并管理应用程序对象的配置及生命周期</li><li>MVC框架：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架</li><li>事务管理：Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口</li><li>异常处理：Spring提供一个方便的API将特定的异常(由JDBC, Hibernate抛出)转化为一致的、Unchecked异常</li></ul><h3 id="spring中用到的设计模式" tabindex="-1"><a class="header-anchor" href="#spring中用到的设计模式"><span>Spring中用到的设计模式</span></a></h3><ul><li>单例模式：bean默认都是单例的</li><li>原型模式：指定作用域为prototype</li><li>工厂模式：BeanFactory</li><li>模板方法：postProcessBeanFactory、onRefresh、initPropertyValue</li><li>策略模式：XmlBeanDefinitionReader、PropertiesBeanDefinitionReader</li><li>观察者模式：listener、event、multicast</li><li>适配器模式：Adapter</li><li>装饰者模式：BeanWrapper</li><li>责任链模式：使用aop的时候会先生成一个拦截器链</li><li>代理模式：动态代理</li><li>委托者模式：delegate</li><li>...</li></ul><h2 id="bean-相关" tabindex="-1"><a class="header-anchor" href="#bean-相关"><span>Bean 相关</span></a></h2><h3 id="beanfactory和applicationcontext的区别" tabindex="-1"><a class="header-anchor" href="#beanfactory和applicationcontext的区别"><span>BeanFactory和ApplicationContext的区别</span></a></h3><ul><li><p>**ApplicationContext：**Spring容器就是ApplicationContext，它是一个接口，有很多实现类，如：ClassPathXmlApplicationContext，表示它会自动从classpath中查找指定的XML配置文件的Spring容器获得了ApplicationContext的实例，就获得了IoC容器的引用，可以根据Bean的ID或类型获取Bean</p></li><li><p>**BeanFactory：**Spring的另一种IoC容器叫BeanFactory，使用方式和ApplicationContext类似</p></li><li><p>区别</p></li><li><ul><li>BeanFactory的实现是按需创建，即第一次获取Bean时才创建这个Bean</li><li>ApplicationContext会一次性创建所有的Bean</li><li>ApplicationContext接口是从BeanFactory接口继承而来的，并且，ApplicationContext提供了一些额外的功能，包括国际化支持、事件和通知机制等。通常情况下，使用ApplicationContext，很少会考虑使用BeanFactory</li></ul></li></ul><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#8FBCBB;">ApplicationContext</span><span style="color:#D8DEE9;"> context</span><span style="color:#81A1C1;"> =</span><span style="color:#81A1C1;"> new</span><span style="color:#88C0D0;"> ClassPathXmlApplicationContext</span><span style="color:#ECEFF4;">(</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">applicationContext.xml</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#ECEFF4;">)</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#8FBCBB;">UserService</span><span style="color:#D8DEE9;"> userService</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9;"> context</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">getBean</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9;">UserService</span><span style="color:#ECEFF4;">.</span><span style="color:#D8DEE9;">class</span><span style="color:#ECEFF4;">)</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#8FBCBB;">BeanFactory</span><span style="color:#D8DEE9;"> factory</span><span style="color:#81A1C1;"> =</span><span style="color:#81A1C1;"> new</span><span style="color:#88C0D0;"> XmlBeanFactory</span><span style="color:#ECEFF4;">(</span><span style="color:#81A1C1;">new</span><span style="color:#88C0D0;"> ClassPathResource</span><span style="color:#ECEFF4;">(</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">application.xml</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#ECEFF4;">))</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#8FBCBB;">MailService</span><span style="color:#D8DEE9;"> mailService</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9;"> factory</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">getBean</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9;">MailService</span><span style="color:#ECEFF4;">.</span><span style="color:#D8DEE9;">class</span><span style="color:#ECEFF4;">)</span><span style="color:#81A1C1;">;</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="bean-factory与factory-bean有什么区别" tabindex="-1"><a class="header-anchor" href="#bean-factory与factory-bean有什么区别"><span>Bean Factory与Factory Bean有什么区别</span></a></h3><ul><li>相同点：都是用来创建bean对象的</li><li>不同点：使用BeanFactory创建对象的时候，必须要遵循严格的生命周期流程。如果想要简单的自定义某个对象的创建，同时创建完成的对象想交给Spring来管理，那么需要实现Factroy Bean接口</li></ul><h3 id="什么是spring-beans" tabindex="-1"><a class="header-anchor" href="#什么是spring-beans"><span>什么是Spring Beans</span></a></h3><p>Spring Beans是构成Spring应用核心的Java对象，由Spring IOC容器实例化、组装、管理，通过容器中配置的元数据创建，例如，使用XML文件中定义的创建，在Spring中创建的beans默认都是单例的beans</p><h3 id="spring-bean线程安全吗" tabindex="-1"><a class="header-anchor" href="#spring-bean线程安全吗"><span>Spring Bean线程安全吗</span></a></h3><ul><li>Spring本身并没有针对Bean做线程安全的处理，所以：</li></ul><ol><li><ol><li>如果Bean是无状态的，那么Bean则是线程安全的</li><li>如果Bean是有状态的，那么Bean则不是线程安全的</li></ol></li></ol><ul><li>Bean是不是线程安全，跟Bean的作用域（单例、多例）没有关系，Bean的作用域只是表示Bean的生命周期范围，对于任何生命周期的Bean都是一个对象，这个对象是不是线程安全的，还是得看这个Bean对象本身</li></ul><h3 id="spring中支持的bean作用域" tabindex="-1"><a class="header-anchor" href="#spring中支持的bean作用域"><span>Spring中支持的bean作用域</span></a></h3><p>默认的 scope 属性是 singleton</p><ul><li>singleton：在Spring IOC容器中仅存在一个Bean实例，Bean以单实例的方式存在</li><li>prototype：一个bean可以定义多个实例</li><li>request：每次HTTP请求都会创建一个新的Bean，仅适用于WebApplicationContext环境</li><li>session：一个HTTP Session定义一个Bean，仅适用于WebApplicationContext环境</li><li>globalSession：同一个全局HTTP Session定义一个Bean，仅适用于WebApplicationContext环境</li></ul><h3 id="spring-的单例实现原理" tabindex="-1"><a class="header-anchor" href="#spring-的单例实现原理"><span>Spring 的单例实现原理</span></a></h3><p>Spring框架对单例的支持是采用 <strong>单例注册表</strong> 的方式进行实现的，而这个<strong>注册表的缓存</strong>是<strong>ConcurrentHashMap对象</strong>，如果配置文件中的配置信息不要求使用单例，Spring会采用新建实例的方式返回对象实例</p><h3 id="bean的生命周期-todo" tabindex="-1"><a class="header-anchor" href="#bean的生命周期-todo"><span>Bean的生命周期 todo</span></a></h3><p>ApplicationContext容器中，Bean的生命周期流程大致如下：</p><p><img src="https://cdn.nlark.com/yuque/0/2023/png/29236088/1675669749521-657e0d23-280e-4440-9cc2-26d677b648aa.png" alt="img"></p><ol><li>首先容器启动后，会对 <strong>scope</strong> 为 <strong>singleton</strong> 且<strong>非懒加载</strong>的 bean 进行实例化</li><li>按照 Bean 定义信息配置信息，注入所有的属性</li><li>如果 Bean 实现了 <strong>BeanNameAware</strong> 接口，会回调该接口的 <strong>setBeanName()</strong> 方法，传入该 Bean 的 id，该 Bean 就获得了自己在配置文件中的 id如果 Bean 实现了 <strong>BeanFactoryAware</strong> 接口，会回调该接口的 <strong>setBeanFactory()</strong> 方法，传入该 Bean 的 BeanFactory，该 Bean 就获得了自己所在的 BeanFactory如果 Bean 实现了 <strong>ApplicationContextAware</strong> 接口，会回调该接口的 <strong>setApplicationContext()</strong> 方法，传入该 Bean 的 ApplicationContext，该 Bean 就获得了自己所在的 ApplicationContext</li><li>如果 Bean 实现了 <strong>BeanPostProcessor</strong> 接口，则会回调该接口的 <strong>postProcessBeforeInitialzation()</strong> 方法</li><li>如果 Bean 实现了 <strong>InitializingBean</strong> 接口，则会回调该接口的 <strong>afterPropertiesSet()</strong> 方法</li><li>如果 Bean 配置了 <strong>init-method</strong> 方法，则会执行 <strong>init-method</strong> 配置的方法</li><li>如果 Bean 实现了 <strong>BeanPostProcessor</strong> 接口，则会回调该接口的 **postProcessAfterInitialization()**方法</li><li>经过各个流程之后，就可以正式使用该 Bean 了，对于 scope 为 singleton 的 Bean，Spring 的 ioc 容器中会缓存一份该 bean 的实例，而对于 scope 为 prototype 的 Bean，每次被调用都会new一个新的对象，期生命周期就交给调用方管理不再是Spring容器进行管理</li><li>容器关闭后，如果 Bean 实现了 <strong>DisposableBean</strong> 接口，则会回调该接口的 <strong>destroy()</strong> 方法</li><li>如果 Bean 配置了 <strong>destroy-method</strong> 方法，则会执行 <strong>destroy-method</strong> 配置的方法，至此，整个 Bean 的生命周期结束</li></ol><h3 id="bean创建的生命周期" tabindex="-1"><a class="header-anchor" href="#bean创建的生命周期"><span>Bean创建的生命周期</span></a></h3><p>创建bean大致步骤：</p><ol><li>推断构造方法</li><li>实例化</li><li>填充属性，及依赖注入</li><li>处理aware回调</li><li>初始化前，处理@PostConstruct注解</li><li>初始化，处理Initialization接口</li><li>初始化后，进行aop</li></ol><h2 id="ioc-相关" tabindex="-1"><a class="header-anchor" href="#ioc-相关"><span>IoC 相关</span></a></h2><h3 id="spring-ioc容器是什么" tabindex="-1"><a class="header-anchor" href="#spring-ioc容器是什么"><span>Spring IoC容器是什么</span></a></h3><p>Spring IOC负责创建、管理(通过依赖注入)、整合、配置对象以及管理这些对象的生命周期</p><h3 id="ioc有什么优点" tabindex="-1"><a class="header-anchor" href="#ioc有什么优点"><span>IoC有什么优点</span></a></h3><ul><li>减少了代码量</li><li>使得程序的测试简单，因为在单元测试中不再需要单例或JNDI查找机制</li><li>松耦合</li><li>支持勤性单例及延迟加载服务</li></ul><h3 id="推荐哪种依赖注入" tabindex="-1"><a class="header-anchor" href="#推荐哪种依赖注入"><span>推荐哪种依赖注入</span></a></h3><p>可以同时使用两种方式的依赖注入，最好使用构造器参数实现强制依赖注入，使用setter方法实现可选的依赖关系</p><h3 id="todo-spring-ioc的理解-原理与实现" tabindex="-1"><a class="header-anchor" href="#todo-spring-ioc的理解-原理与实现"><span>todo Spring IOC的理解，原理与实现</span></a></h3><p>工厂 + 反射</p><ul><li>控制反转：理论思想，原来的对象是由使用者来进行控制，有了spring之后，可以把整个对象交给spring来帮我们进行管理</li><li>DI：依赖注入，把对应的属性的值注入到具体的对象中，@Autowired，populateBean完成属性值的注入</li><li>容器：存储对象，使用map结构来存储，在spring中一般存在三级缓存，singletonObjects存放完整的bean对象，整个bean的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean的生命周期）</li></ul><p>1、一般要涉及到容器的创建过程（beanFactory,DefaultListableBeanFactory）,向bean工厂中设置一些参数（BeanPostProcessor,Aware接口的子类）等等属性</p><p>2、加载解析bean对象，准备要创建的bean对象的定义对象beanDefinition,(xml或者注解的解析过程)</p><p>3、beanFactoryPostProcessor的处理，此处是扩展点，PlaceHolderConfigurSupport,ConfigurationClassPostProcessor</p><p>4、BeanPostProcessor的注册功能，方便后续对bean对象完成具体的扩展功能</p><p>5、通过反射的方式讲BeanDefinition对象实例化成具体的bean对象，</p><p>6、bean对象的初始化过程（填充属性，调用aware子类的方法，调用BeanPostProcessor前置处理方法，调用init-mehtod方法，调用BeanPostProcessor的后置处理方法）</p><p>7、生成完整的bean对象，通过getBean方法可以直接获取</p><p>8、销毁过程</p><h3 id="依赖注入是什么" tabindex="-1"><a class="header-anchor" href="#依赖注入是什么"><span>依赖注入是什么</span></a></h3><p>依赖注入作为控制反转(IOC)的一个层面，在这个概念中，不用创建对象而只需要描述如何创建它们。不必通过代码直接的将组件和服务连接在一起，而是通过配置文件说明哪些组件需要什么服务，之后IOC容器负责衔接</p><h3 id="有哪些不同类型的依赖注入" tabindex="-1"><a class="header-anchor" href="#有哪些不同类型的依赖注入"><span>有哪些不同类型的依赖注入</span></a></h3><ul><li>**构造器依赖注入：**在容器触发构造器的时候完成，该构造器有一系列的参数，每个参数代表注入的对象</li><li>**Setter方法依赖注入：**首先容器会触发一个无参构造函数或无参静态工厂方法实例化对象，之后容器调用bean中的setter方法完成setter方法依赖注入</li></ul><h3 id="自动装配的各种模式" tabindex="-1"><a class="header-anchor" href="#自动装配的各种模式"><span>自动装配的各种模式</span></a></h3><p>提供五种模式用来自动装配beans之间的依赖注入:</p><ul><li>no：默认的方式是不进行自动装配，通过手工设置 ref 属性来进行装配bean</li><li>byName：通过参数名自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byName。之后容器试图匹配、装配和该 bean 的属性具有相同名字的 bean</li><li>byType：通过参数的数据类型自动自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byType。之后容器试图匹配和装配和该bean的属性类型一样的bean。如果有多个bean符合条件，则抛出错误</li><li>constructor：这个同byType类似，不过是应用于构造函数的参数。如果在BeanFactory中不是恰好有一个bean与构造函数参数相同类型，则抛出错误</li><li>autodetect：如果有默认的构造方法，通过 cconstructor 的方式自动装配，否则使用 byType的方式自动装配</li></ul><h3 id="spring-循环依赖的问题-todo" tabindex="-1"><a class="header-anchor" href="#spring-循环依赖的问题-todo"><span>Spring 循环依赖的问题 todo</span></a></h3><ul><li>循环依赖：A依赖B，B依赖A，形成闭环</li><li>解决方法：使用三级缓存，提前暴露对象，AOP</li><li><strong>一级缓存中放的是完整对象，二级缓存中放的是非完整对象，三级缓存的value类型是ObjectFactory</strong>（是一个函数式接口，存在的意义是保证在整个容器的运行过程中同名的bean对象只能有一个）</li><li>bean的创建过程：实例化，初始化（填充属性）</li></ul><ol><li><ol><li>先创建A对象，实例化A对象，此时A对象中的b属性为空，填充属性b</li><li>从容器中查找B对象，如果找到了，直接赋值不存在循环依赖问题，如果找不到直接创建B对象</li><li>实例化B对象，此时B对象中的a属性为空，填充属性a</li><li>从容器中查找A对象，找不到，直接创建</li></ol></li></ol><ul><li>在d的一步，会发现A对象是存在的，只不过此时的A对象不是一个完整的状态，只完成了实例化但是未完成初始化，如果在程序调用过程中，拥有了某个对象的引用，能否在后期给他完成赋值操作，可以优先把非完整状态的对象优先赋值，等待后续操作来完成赋值，这相当于<strong>提前暴露了某个不完整对象的引用</strong>，所以解决问题的核心在于实例化和初始化分开操作，这也是解决循环依赖问题的关键</li><li>当所有的对象都完成实例化和初始化操作之后，还要把完整对象放到容器中，此时在容器中存在对象的几个状态：1. 完成实例化但未完成初始化、2. 完整状态；因为都在容器中，所以要使用不同的map结构来进行存储，此时就有了一级缓存和二级缓存（如果一级缓存中有了，那么二级缓存中就不会存在同名的对象，因为他们的查找顺序是1，2，3这样的方式来查找的）</li></ul><h3 id="代理" tabindex="-1"><a class="header-anchor" href="#代理"><span>代理</span></a></h3><ul><li>如果一个对象需要被代理，或者说需要生成代理对象，需要优先生成一个普通对象，普通对象和代理对象是<strong>不能同时出现在容器中</strong>的</li><li>当对象需要被代理的时候，就要使用代理对象<strong>覆盖掉</strong>之前的普通对象</li><li>在实际的调用过程中，是没有办法确定什么时候对象被使用，所以就要求当某个对象被调用的时候，<strong>优先判断此对象是否需要被代理</strong>，类似于一种回调机制的实现，因此传入lambda表达式的时候，可通过lambda表达式来执行对象的覆盖过程，<strong>getEarlyBeanReference()</strong></li><li>因此，所有的bean对象在创建的时候都要优先放到三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，如果不需要被代理，则直接返回普通对象</li></ul><h3 id="三级缓存的放置时间和删除时间" tabindex="-1"><a class="header-anchor" href="#三级缓存的放置时间和删除时间"><span>三级缓存的放置时间和删除时间</span></a></h3><ul><li>三级缓存：createBeanInstance之后；addSingletonFactory</li><li>二级缓存：第一次从三级缓存确定对象是代理对象还是普通对象的时候，同时删除三级缓存；getSingleton</li><li>一级缓存：生成完整对象之后放到一级缓存，删除二三级缓存；addSingleton</li></ul><h3 id="lazy" tabindex="-1"><a class="header-anchor" href="#lazy"><span>@Lazy</span></a></h3><p>用于指定单例bean实例化的时机，在没有指定此注解时，单例会在容器初始化时就被创建。而当使用此注解后，单例对象的创建时机会在该bean在被第一次使用时创建，并且只创建一次。第二次及以后获取使用就不再创建。此注解只对单例bean有用，原型bean时此注解不起作用。也可以解决循环依赖问题</p><h2 id="aop-相关" tabindex="-1"><a class="header-anchor" href="#aop-相关"><span>AOP 相关</span></a></h2><h3 id="解释aop模块" tabindex="-1"><a class="header-anchor" href="#解释aop模块"><span>解释AOP模块</span></a></h3><ul><li>AOP模块用来开发Spring应用程序中具有切面性质的部分</li><li>该模块的大部分服务由AOP Aliance提供，这就保证了Spring框架和其他AOP框架之间的互操作性</li><li>该模块将元数据编程引入到了Spring</li></ul><h3 id="面向切面编程-aop" tabindex="-1"><a class="header-anchor" href="#面向切面编程-aop"><span>面向切面编程(AOP)</span></a></h3><ul><li><p>面向切面编程（AOP）允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理和事务管理</p></li><li><p>切面（Aspect） AOP的核心就是切面，它将多个类的通用行为封装为可重用的模块。该模块含有一组API提供 cross-cutting 功能。根据需求的不同，一个应用程序可以有若干切面。在Spring AOP中，切面通过带有 @Aspect 注解的类实现</p></li><li><p>通知（Advice）通知表示在方法执行前后需要执行的动作。实际上它是Spring AOP框架在程序执行过程中触发的一些代码。Spring切面可以执行一下五种类型的通知</p></li><li><ul><li>before(前置通知)：在一个方法之前执行的通知</li><li>after(最终通知)：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）</li><li>after-returning(后置通知)：在某连接点正常完成后执行的通知</li><li>after-throwing(异常通知)：在方法抛出异常退出时执行的通知</li><li>around(环绕通知)：在方法调用前后触发的通知</li></ul></li><li><p>切入点（Pointcut）切入点是一个或一组连接点，通知将在这些位置执行。可以通过表达式或匹配的方式指明切入点</p></li><li><p>引入引入允许我们在已有的类上添加新的方法或属性</p></li><li><p>目标对象被一个或者多个切面所通知的对象。它通常是一个代理对象。也被称做被通知（advised）对象</p></li><li><p>代理代理是将通知应用到目标对象后创建的对象。从客户端的角度看，代理对象和目标对象是一样的。有以下几种代理</p></li><li><ul><li>BeanNameAutoProxyCreator：bean名称自动代理创建器</li><li>DefaultAdvisorAutoProxyCreator：默认通知者自动代理创建器</li><li>Metadata autoproxying：元数据自动代理</li></ul></li><li><p>织入将切面和其他应用类型或对象连接起来创建一个通知对象的过程。织入可以在编译、加载或运行时完成</p></li></ul><h3 id="spring-aop-实现原理" tabindex="-1"><a class="header-anchor" href="#spring-aop-实现原理"><span>Spring AOP 实现原理</span></a></h3><p>实现AOP的技术，主要分为两大类：</p><ul><li>动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行</li><li>静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码</li></ul><p>Spring AOP 的实现原理其实很简单</p><p>AOP 框架负责动态地生成 AOP 代理类，这个代理类的方法则由 Advice 和回调目标对象的方法所组成，并将该对象可作为目标对象使用</p><p>AOP 代理包含了目标对象的全部方法，但AOP代理中的方法与目标对象的方法存在差异，AOP方法在特定切入点添加了增强处理，并回调了目标对象的方法</p><p>动态代理技术在运行期织入增强代码，使用两种代理机制：基于JDK的动态代理（JDK本身只提供接口的代理）和基于CGlib的动态代理。</p><ul><li>JDK的动态代理JDK的动态代理主要涉及 <strong>java.lang.reflect</strong> 包中的两个类：<strong>Proxy</strong> 和 <strong>InvocationHandler****InvocationHandler</strong> 只是一个接口，可以通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态的将横切逻辑与业务逻辑织在一起。而 <strong>Proxy</strong> 利用 <strong>InvocationHandler</strong> 动态创建一个符合某一接口的实例，生成目标类的代理对象其代理对象<strong>必须是某个接口的实现</strong>，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理，只能实现接口的类生成代理，而不能针对类</li><li>CGLibCGLib采用<strong>底层的字节码技术</strong>，为一个类<strong>创建子类</strong>，并在子类中采用方法拦截的技术拦截所有父类的调用方法，并顺势织入横切逻辑它运行期间生成的代理对象是<strong>目标类的扩展子类</strong>，所以无法通知<strong>final、private的方法</strong>，因为它们不能被覆写。是针对类实现代理，主要是为指定的类生成一个子类，覆盖其中方法在spring中默认情况下使用JDK动态代理实现AOP，如果<strong>proxy-target-class</strong>设置为true或者使用了优化策略那么会使用CGLIB来创建动态代理Spring AOP在这两种方式的实现上基本一样。JDK代理中，会使用<strong>JdkDynamicAopProxy</strong>来创建代理，在<strong>invoke()<strong>方法首先需要织入到当前类的增强器封装到</strong>拦截器链</strong>中，然后递归的调用这些拦截器完成功能的织入，最终返回代理对象</li></ul><h3 id="todo-cglib和jdk动态代理什么区别" tabindex="-1"><a class="header-anchor" href="#todo-cglib和jdk动态代理什么区别"><span>todo CgLib和jdk动态代理什么区别</span></a></h3><p>如上所述</p><h2 id="启动相关" tabindex="-1"><a class="header-anchor" href="#启动相关"><span>启动相关</span></a></h2><h3 id="spring容器启动流程" tabindex="-1"><a class="header-anchor" href="#spring容器启动流程"><span>Spring容器启动流程</span></a></h3><ol><li>在创建Spring容器，也就是启动Spring时，首先会进行扫描，扫描得到所有的<strong>BeanDefinition</strong>对象，并存在一个Map中</li><li>然后筛选出<strong>非懒加载的单例BeanDefinition</strong>进行创建Bean；对于多例Bean不需要在启动过程中去进行创建，对于多例Bean会在每次获取Bean时利用<strong>BeanDefinition</strong>去通过new创建</li><li>利用<strong>BeanDefinition</strong>创建Bean就是Bean的创建生命周期，这期间包括了合并<strong>BeanDefinition</strong>、推断构造方法、实例化、属性填充、初始化前、初始化、初始化后等步骤，其中AOP就是发生在初始化后这一步骤中</li><li>单例Bean创建完了之后，Spring会发布一个容器启动事件，Spring启动结束</li></ol><p>可以归纳为三个步骤：</p><ol><li>初始化 Spring 容器，注册内置的 <strong>BeanPostProcessor</strong> 的 <strong>BeanDefinition</strong> 到容器中</li><li>将配置类的 <strong>BeanDefinition</strong> 注册到容器中</li><li>调用 <strong>refresh()</strong> 方法刷新容器</li></ol><h2 id="事务相关" tabindex="-1"><a class="header-anchor" href="#事务相关"><span>事务相关</span></a></h2><h3 id="spring-事务实现方式" tabindex="-1"><a class="header-anchor" href="#spring-事务实现方式"><span>Spring 事务实现方式</span></a></h3><ul><li>编程式事务管理：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护</li><li>声明式事务管理：将事务管理和业务代码分离。只需要通过<strong>注解或者XML配置</strong>管理事务</li></ul><h3 id="spring框架的事务管理有哪些优点" tabindex="-1"><a class="header-anchor" href="#spring框架的事务管理有哪些优点"><span>Spring框架的事务管理有哪些优点</span></a></h3><ul><li>为不同的事务API（如JTA, JDBC, Hibernate, JPA, 和JDO）提供了统一的编程模型</li><li>为编程式事务管理提供了一个简单的API</li><li>支持声明式事务管理</li><li>可以和 Spring 的多种数据访问技术很好的兼容</li></ul><h3 id="spring事务定义的传播规则-todo" tabindex="-1"><a class="header-anchor" href="#spring事务定义的传播规则-todo"><span>Spring事务定义的传播规则 todo</span></a></h3><ul><li>**PROPAGATION_REQUIRED：**支持当前事务，如果当前没有事务，就新建一个事务</li><li>**PROPAGATION_SUPPORTS：**支持当前事务，如果当前没有事务，就以非事务方式执行</li><li>**PROPAGATION_MANDATORY：**支持当前事务，如果当前没有事务，就抛出异常</li><li>**PROPAGATION_REQUIRES_NEW：**新建事务，如果当前存在事务，把当前事务挂起</li><li>**PROPAGATION_NOT_SUPPORTED：**以非事务方式执行操作，如果当前存在事务，就把当前事务挂起</li><li>**PROPAGATION_NEVER：**以非事务方式执行，如果当前存在事务，则抛出异常</li><li>**PROPAGATION_NESTED：**如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，就新建一个事务</li></ul><h3 id="spring-事务底层原理" tabindex="-1"><a class="header-anchor" href="#spring-事务底层原理"><span>Spring 事务底层原理</span></a></h3><ul><li><p><strong>划分处理单元 IoC</strong></p></li><li><ul><li>Spring是<strong>对单个数据库进行局部事务处理</strong>的，具体的实现首先用IoC划分了事务处理单元，并且将事务的各种配置放到了ioc容器中（设置事务管理器，设置事务的传播特性及隔离机制）</li></ul></li><li><p><strong>AOP拦截需要进行事务处理的类</strong></p></li><li><ul><li>Spring事务处理模块是通过AOP功能来实现声明式事务处理的具体操作（比如事务实行的配置和读取，事务对象的抽象），用<strong>TransactionProxyFactoryBean</strong>接口来使用AOP功能，生成<strong>Proxy代理对象</strong>，再通过<strong>TransactionInterceptor</strong>完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取IoC容器事务配置属性，转化为Spring事务处理需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为<strong>TransactionAttribute</strong>表示的数据对象</li></ul></li><li><p>对事务处理实现（事务的生成、提交、回滚、挂起）</p></li><li><ul><li>Spring委托给具体的事务处理器实现，实现了一个抽象和适配。适配的具体事务处理器：DataSource数据源支持、hibernate数据源事务处理支持、JDO数据源事务处理支持、JPA、JTA数据源事务处理支持。这些支持都是通过设计<strong>PlatformTransactionManager、AbstractPlatforTransaction</strong>一系列事务处理的支持，为常用数据源支持提供了一系列的TransactionManager</li></ul></li><li><p>结合</p></li><li><ul><li><strong>PlatformTransactionManager</strong>实现了<strong>TransactionInterception接口</strong>，让其与<strong>TransactionProxyFactoryBean</strong>结合起来，形成一个Spring声明式事务处理的设计体系</li></ul></li></ul><h3 id="spring-事务大致步骤" tabindex="-1"><a class="header-anchor" href="#spring-事务大致步骤"><span>Spring 事务大致步骤</span></a></h3><p>Spring事务底层是基于<strong>数据库事务</strong>和<strong>AOP机制</strong>的</p><ol><li>首先对于使用了**@Transactional**注解的Bean， Spring会创建一个代理对象作为Bean</li><li>当调用<strong>代理对象的方法</strong>时，会先判断该方法上是否加了@Transactional注解</li><li>如果加了，那么则利用<strong>事务管理器</strong>创建一个数据库连接</li><li>并且<strong>修改数据库</strong>连接的<strong>autocommit</strong>属性（自动提交事务）为<strong>false</strong>，禁止此连接的自动提交</li><li>然后执行当前方法，方法中会执行SQL</li><li>执行完当前方法后，如果没有出现异常就直接提交事务</li><li>如果出现了异常，并且这个异常是需要回滚的就会回滚事务，否则仍然提交事务</li><li>Spring事务的<strong>隔离级别默认</strong>对应的就是<strong>数据库的隔离级别</strong></li><li>Spring事务的传播机制是<strong>基于数据库连接</strong>来做的，一个数据库连接一个事务，如果传播机制配置为需要新开一个事务，那么实际上就是先建立一个数据库连接，在此新数据库连接上执行sql</li></ol><h3 id="spring-事务隔离级别" tabindex="-1"><a class="header-anchor" href="#spring-事务隔离级别"><span>Spring 事务隔离级别</span></a></h3><ul><li><strong>DEFAULT</strong>：默认对应数据库的隔离级别</li><li><strong>READ_UNCOMMITTED</strong>：读未提交</li><li><strong>READ_COMMITTED</strong>：读已提交</li><li><strong>REPEATABLE_READ</strong>：可重复读</li><li><strong>SERIALIZABLE</strong>：串行化</li></ul><h3 id="spring事务失效的情况-todo" tabindex="-1"><a class="header-anchor" href="#spring事务失效的情况-todo"><span>Spring事务失效的情况 todo</span></a></h3><ol><li><p>普通对象调用方法，即类中的非事务方法通过 this.xxx() 调用，事务是不生效的，只有代理对象调用才行，解决办法：</p></li><li><ol><li>注入自己，通过注入的对象来调用；</li><li>使用@EnableAspectJAutoProxy(exposeProxy = true) + AopContext.currentProxy()</li></ol></li><li><p>业务方法为非public方法，因为<strong>Cglib动态代理</strong>是基于父子类来实现的，Spring事务默认生效的方法权限都必须为public，解决办法：</p></li><li><ol><li>将方法改为public</li><li>修改TansactionAttributeSource，将publicMethodsOnly改为false</li><li>使用AspectJ 代理模式替换 Cglib动态代理</li></ol></li><li><p>因为<strong>Cglib动态代理</strong>是基于父子类来实现的，子类是不能重载父类的<strong>private</strong>方法，所以类中的方法是<strong>private</strong>的则代理类不能重载，及**@Transaction**会失效</p></li><li><p>方法用final、static修饰</p></li><li><p>service类没有托管给Spring，即没有加 @Service 或 @Component，解决办法：</p></li><li><ol><li>将service注入spring</li></ol></li><li><p>抛出受检异常，Spring默认只会回滚非检查异常和error异常，解决办法：</p></li><li><ol><li>配置 rollbackFor</li></ol></li><li><p>业务代码中将异常捕获后没有原样抛出异常，解决办法：</p></li><li><ol><li>原样抛出异常</li><li>设置TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();</li></ol></li><li><p>使用其他切面，并在切面代码中捕获了异常没有原样抛出异常，Spring事务的切面优先级是最低的，所以其他切面捕获异常后Spring事务是无感知的，解决办法：</p></li><li><ol><li>在切面中原样抛出异常</li><li>在切面中设置TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();</li></ol></li><li><p>多线程调用，因为Spring的事务是通过数据库连接来实现，而数据库连接Spring是放在threadLocal里面。同一个事务，只能用同一个数据库连接。而多线程场景下，拿到的数据库连接是不一样的，即是属于不同事务</p></li><li><p>错误的传播行为 @Transactional(propagation = Propagation.NOT_SUPPORTED)</p></li><li><p>使用了不支持事务的存储引擎，如mysql的MyISAM</p></li><li><p>数据源没有配置事务管理器</p></li><li><p>被代理的类过早实例化，当代理类的实例化早于AbstractAutoProxyCreator后置处理器，就无法被AbstractAutoProxyCreator后置处理器增强</p></li></ol><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#ECEFF4;">@</span><span style="color:#D08770;">Service</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> class</span><span style="color:#8FBCBB;"> TranInvalidCaseInstantiatedTooEarly</span><span style="color:#81A1C1;"> implements</span><span style="color:#8FBCBB;font-weight:bold;"> BeanPostProcessor</span><span style="color:#ECEFF4;"> ,</span><span style="color:#8FBCBB;font-weight:bold;"> Ordered</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    @</span><span style="color:#D08770;">Autowired</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    private</span><span style="color:#8FBCBB;"> UserService</span><span style="color:#D8DEE9;"> userService</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    @</span><span style="color:#D08770;">Transactional</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    public</span><span style="color:#81A1C1;"> boolean</span><span style="color:#88C0D0;"> save</span><span style="color:#ECEFF4;">(</span><span style="color:#8FBCBB;">User</span><span style="color:#D8DEE9;"> user</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        boolean</span><span style="color:#D8DEE9;"> isSuccess</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9;"> userService</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">save</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">user</span><span style="color:#ECEFF4;">)</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        try</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">            int</span><span style="color:#D8DEE9;"> i</span><span style="color:#81A1C1;"> =</span><span style="color:#B48EAD;"> 1</span><span style="color:#81A1C1;"> %</span><span style="color:#B48EAD;"> 0</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span><span style="color:#81A1C1;"> catch</span><span style="color:#ECEFF4;"> (</span><span style="color:#8FBCBB;">Exception</span><span style="color:#D8DEE9;"> e</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">            throw</span><span style="color:#81A1C1;"> new</span><span style="color:#88C0D0;"> RuntimeException</span><span style="color:#ECEFF4;">()</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        return</span><span style="color:#D8DEE9FF;"> isSuccess</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    }</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    @</span><span style="color:#D08770;">Override</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    public</span><span style="color:#81A1C1;"> int</span><span style="color:#88C0D0;"> getOrder</span><span style="color:#ECEFF4;">()</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        return</span><span style="color:#B48EAD;"> 1</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">}</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="todo-spring的事务是如何回滚的" tabindex="-1"><a class="header-anchor" href="#todo-spring的事务是如何回滚的"><span>todo Spring的事务是如何回滚的?</span></a></h3><h3 id="spring的事务管理是如何实现的-todo" tabindex="-1"><a class="header-anchor" href="#spring的事务管理是如何实现的-todo"><span>spring的事务管理是如何实现的？ todo</span></a></h3><p>​ 总：spring的事务是由aop来实现的，首先要生成具体的代理对象，然后按照aop的整套流程来执行具体的操作逻辑，正常情况下要通过通知来完成核心功能，但是事务不是通过通知来实现的，而是通过一个TransactionInterceptor来实现的，然后调用invoke来实现具体的逻辑</p><p>​ 分：1、先做准备工作，解析各个方法上事务相关的属性，根据具体的属性来判断是否开始新事务</p><p>​ 2、当需要开启的时候，获取数据库连接，关闭自动提交功能，开起事务</p><p>​ 3、执行具体的sql逻辑操作</p><p>​ 4、在操作过程中，如果执行失败了，那么会通过completeTransactionAfterThrowing看来完成事务的回滚操作，回滚的具体逻辑是通过doRollBack方法来实现的，实现的时候也是要先获取连接对象，通过连接对象来回滚</p><p>​ 5、如果执行过程中，没有任何意外情况的发生，那么通过commitTransactionAfterReturning来完成事务的提交操作，提交的具体逻辑是通过doCommit方法来实现的，实现的时候也是要获取连接，通过连接对象来提交</p><p>​ 6、当事务执行完毕之后需要清除相关的事务信息cleanupTransactionInfo</p><p>如果想要聊的更加细致的话，需要知道TransactionInfo,TransactionStatus,</p><h3 id="如何自定义注解实现功能" tabindex="-1"><a class="header-anchor" href="#如何自定义注解实现功能"><span><strong>如何自定义注解实现功能</strong></span></a></h3><ol><li>创建自定义注解和创建一个接口相似，但是注解的interface关键字需要以@符号开头。</li><li>注解方法不能带有参数；</li><li>注解方法返回值类型限定为：基本类型、String、Enums、Annotation或者是这些类型的数组；</li><li>注解方法可以有默认值；</li><li>注解本身能够包含元注解，元注解被用来注解其它注解。</li></ol><h2 id="其他" tabindex="-1"><a class="header-anchor" href="#其他"><span>其他</span></a></h2><h3 id="resource-是如何被查找、加载的" tabindex="-1"><a class="header-anchor" href="#resource-是如何被查找、加载的"><span>Resource 是如何被查找、加载的</span></a></h3><p>Resource 接口是 Spring 资源访问策略的抽象，它本身并不提供任何资源访问实现，具体的资源访问由该接口的实现类完成——每个实现类代表一种资源访问策略。 Spring 为 Resource 接口提供了如下实现类：</p><ul><li>UrlResource：访问网络资源的实现类。</li><li>ClassPathResource：访问类加载路径里资源的实现类。</li><li>FileSystemResource：访问文件系统里资源的实现类。</li><li>ServletContextResource：访问相对于 ServletContext 路径里的资源的实现类：</li><li>InputStreamResource：访问输入流资源的实现类。</li><li>ByteArrayResource：访问字节数组资源的实现类。 这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。</li></ul>`,122)]))}const t=l(e,[["render",r],["__file","Spring.html.vue"]]),c=JSON.parse('{"path":"/md/interview/java/framework/spring/Spring.html","title":"Spring","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"基础","slug":"基础","link":"#基础","children":[{"level":3,"title":"什么是Spring","slug":"什么是spring","link":"#什么是spring","children":[]},{"level":3,"title":"Spring有哪些优点","slug":"spring有哪些优点","link":"#spring有哪些优点","children":[]},{"level":3,"title":"Spring中用到的设计模式","slug":"spring中用到的设计模式","link":"#spring中用到的设计模式","children":[]}]},{"level":2,"title":"Bean 相关","slug":"bean-相关","link":"#bean-相关","children":[{"level":3,"title":"BeanFactory和ApplicationContext的区别","slug":"beanfactory和applicationcontext的区别","link":"#beanfactory和applicationcontext的区别","children":[]},{"level":3,"title":"Bean Factory与Factory Bean有什么区别","slug":"bean-factory与factory-bean有什么区别","link":"#bean-factory与factory-bean有什么区别","children":[]},{"level":3,"title":"什么是Spring Beans","slug":"什么是spring-beans","link":"#什么是spring-beans","children":[]},{"level":3,"title":"Spring Bean线程安全吗","slug":"spring-bean线程安全吗","link":"#spring-bean线程安全吗","children":[]},{"level":3,"title":"Spring中支持的bean作用域","slug":"spring中支持的bean作用域","link":"#spring中支持的bean作用域","children":[]},{"level":3,"title":"Spring 的单例实现原理","slug":"spring-的单例实现原理","link":"#spring-的单例实现原理","children":[]},{"level":3,"title":"Bean的生命周期 todo","slug":"bean的生命周期-todo","link":"#bean的生命周期-todo","children":[]},{"level":3,"title":"Bean创建的生命周期","slug":"bean创建的生命周期","link":"#bean创建的生命周期","children":[]}]},{"level":2,"title":"IoC 相关","slug":"ioc-相关","link":"#ioc-相关","children":[{"level":3,"title":"Spring IoC容器是什么","slug":"spring-ioc容器是什么","link":"#spring-ioc容器是什么","children":[]},{"level":3,"title":"IoC有什么优点","slug":"ioc有什么优点","link":"#ioc有什么优点","children":[]},{"level":3,"title":"推荐哪种依赖注入","slug":"推荐哪种依赖注入","link":"#推荐哪种依赖注入","children":[]},{"level":3,"title":"todo Spring IOC的理解，原理与实现","slug":"todo-spring-ioc的理解-原理与实现","link":"#todo-spring-ioc的理解-原理与实现","children":[]},{"level":3,"title":"依赖注入是什么","slug":"依赖注入是什么","link":"#依赖注入是什么","children":[]},{"level":3,"title":"有哪些不同类型的依赖注入","slug":"有哪些不同类型的依赖注入","link":"#有哪些不同类型的依赖注入","children":[]},{"level":3,"title":"自动装配的各种模式","slug":"自动装配的各种模式","link":"#自动装配的各种模式","children":[]},{"level":3,"title":"Spring 循环依赖的问题 todo","slug":"spring-循环依赖的问题-todo","link":"#spring-循环依赖的问题-todo","children":[]},{"level":3,"title":"代理","slug":"代理","link":"#代理","children":[]},{"level":3,"title":"三级缓存的放置时间和删除时间","slug":"三级缓存的放置时间和删除时间","link":"#三级缓存的放置时间和删除时间","children":[]},{"level":3,"title":"@Lazy","slug":"lazy","link":"#lazy","children":[]}]},{"level":2,"title":"AOP 相关","slug":"aop-相关","link":"#aop-相关","children":[{"level":3,"title":"解释AOP模块","slug":"解释aop模块","link":"#解释aop模块","children":[]},{"level":3,"title":"面向切面编程(AOP)","slug":"面向切面编程-aop","link":"#面向切面编程-aop","children":[]},{"level":3,"title":"Spring AOP 实现原理","slug":"spring-aop-实现原理","link":"#spring-aop-实现原理","children":[]},{"level":3,"title":"todo CgLib和jdk动态代理什么区别","slug":"todo-cglib和jdk动态代理什么区别","link":"#todo-cglib和jdk动态代理什么区别","children":[]}]},{"level":2,"title":"启动相关","slug":"启动相关","link":"#启动相关","children":[{"level":3,"title":"Spring容器启动流程","slug":"spring容器启动流程","link":"#spring容器启动流程","children":[]}]},{"level":2,"title":"事务相关","slug":"事务相关","link":"#事务相关","children":[{"level":3,"title":"Spring 事务实现方式","slug":"spring-事务实现方式","link":"#spring-事务实现方式","children":[]},{"level":3,"title":"Spring框架的事务管理有哪些优点","slug":"spring框架的事务管理有哪些优点","link":"#spring框架的事务管理有哪些优点","children":[]},{"level":3,"title":"Spring事务定义的传播规则 todo","slug":"spring事务定义的传播规则-todo","link":"#spring事务定义的传播规则-todo","children":[]},{"level":3,"title":"Spring 事务底层原理","slug":"spring-事务底层原理","link":"#spring-事务底层原理","children":[]},{"level":3,"title":"Spring 事务大致步骤","slug":"spring-事务大致步骤","link":"#spring-事务大致步骤","children":[]},{"level":3,"title":"Spring 事务隔离级别","slug":"spring-事务隔离级别","link":"#spring-事务隔离级别","children":[]},{"level":3,"title":"Spring事务失效的情况 todo","slug":"spring事务失效的情况-todo","link":"#spring事务失效的情况-todo","children":[]},{"level":3,"title":"todo Spring的事务是如何回滚的?","slug":"todo-spring的事务是如何回滚的","link":"#todo-spring的事务是如何回滚的","children":[]},{"level":3,"title":"spring的事务管理是如何实现的？ todo","slug":"spring的事务管理是如何实现的-todo","link":"#spring的事务管理是如何实现的-todo","children":[]},{"level":3,"title":"如何自定义注解实现功能","slug":"如何自定义注解实现功能","link":"#如何自定义注解实现功能","children":[]}]},{"level":2,"title":"其他","slug":"其他","link":"#其他","children":[{"level":3,"title":"Resource 是如何被查找、加载的","slug":"resource-是如何被查找、加载的","link":"#resource-是如何被查找、加载的","children":[]}]}],"git":{"updatedTime":1711074643000,"contributors":[{"name":"hyfly233","username":"hyfly233","email":"hyfly233@outlook.com","commits":4,"url":"https://github.com/hyfly233"}]},"filePathRelative":"md/interview/java/framework/spring/Spring.md"}');export{t as comp,c as data};
