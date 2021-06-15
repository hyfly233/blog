# Spring

## 基础

### 什么是 Spring

Spring 是一个开源的 Java EE 开发框架

Spring 的核心功能可以应用在任何 Java 应用程序中，但对 Java EE 平台上的 Web 应用程序有更好的扩展性

Spring 的目标是使得 Java EE 应用程序的开发更加简捷

### Spring 有哪些优点

-   轻量级：Spring 在大小和透明性方面绝对属于轻量级的，基础版本的 Spring 框架大约只有 2MB
-   控制反转(IOC)：使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象
-   面向切面编程(AOP)：支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来
-   容器：Spring 包含并管理应用程序对象的配置及生命周期
-   MVC 框架：Spring 的 web 框架是一个设计优良的 web MVC 框架，很好的取代了一些 web 框架
-   事务管理：Spring 对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口
-   异常处理：Spring 提供一个方便的 API 将特定的异常(由 JDBC, Hibernate 抛出)转化为一致的、Unchecked 异常

### Spring 中用到的设计模式

-   单例模式：bean 默认都是单例的
-   原型模式：指定作用域为 prototype
-   工厂模式：BeanFactory
-   模板方法：postProcessBeanFactory、onRefresh、initPropertyValue
-   策略模式：XmlBeanDefinitionReader、PropertiesBeanDefinitionReader
-   观察者模式：listener、event、multicast
-   适配器模式：Adapter
-   装饰者模式：BeanWrapper
-   责任链模式：使用 aop 的时候会先生成一个拦截器链
-   代理模式：动态代理
-   委托者模式：delegate
-   ...

## Bean 相关

### BeanFactory 和 ApplicationContext 的区别

-   **ApplicationContext：**Spring 容器就是 ApplicationContext，它是一个接口，有很多实现类，如：ClassPathXmlApplicationContext，表示它会自动从 classpath 中查找指定的 XML 配置文件的 Spring 容器获得了 ApplicationContext 的实例，就获得了 IoC 容器的引用，可以根据 Bean 的 ID 或类型获取 Bean
-   **BeanFactory：**Spring 的另一种 IoC 容器叫 BeanFactory，使用方式和 ApplicationContext 类似
-   区别

-   -   BeanFactory 的实现是按需创建，即第一次获取 Bean 时才创建这个 Bean
    -   ApplicationContext 会一次性创建所有的 Bean
    -   ApplicationContext 接口是从 BeanFactory 接口继承而来的，并且，ApplicationContext 提供了一些额外的功能，包括国际化支持、事件和通知机制等。通常情况下，使用 ApplicationContext，很少会考虑使用 BeanFactory

```java
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = context.getBean(UserService.class);
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("application.xml"));
MailService mailService = factory.getBean(MailService.class);
```

### Bean Factory 与 Factory Bean 有什么区别

-   相同点：都是用来创建 bean 对象的
-   不同点：使用 BeanFactory 创建对象的时候，必须要遵循严格的生命周期流程。如果想要简单的自定义某个对象的创建，同时创建完成的对象想交给 Spring 来管理，那么需要实现 Factroy Bean 接口

### 什么是 Spring Beans

Spring Beans 是构成 Spring 应用核心的 Java 对象，由 Spring IOC 容器实例化、组装、管理，通过容器中配置的元数据创建，例如，使用 XML 文件中定义的创建，在 Spring 中创建的 beans 默认都是单例的 beans

### Spring Bean 线程安全吗

-   Spring 本身并没有针对 Bean 做线程安全的处理，所以：

1.  1. 如果 Bean 是无状态的，那么 Bean 则是线程安全的
    2. 如果 Bean 是有状态的，那么 Bean 则不是线程安全的

-   Bean 是不是线程安全，跟 Bean 的作用域（单例、多例）没有关系，Bean 的作用域只是表示 Bean 的生命周期范围，对于任何生命周期的 Bean 都是一个对象，这个对象是不是线程安全的，还是得看这个 Bean 对象本身

### Spring 中支持的 bean 作用域

默认的 scope 属性是 singleton

-   singleton：在 Spring IOC 容器中仅存在一个 Bean 实例，Bean 以单实例的方式存在
-   prototype：一个 bean 可以定义多个实例
-   request：每次 HTTP 请求都会创建一个新的 Bean，仅适用于 WebApplicationContext 环境
-   session：一个 HTTP Session 定义一个 Bean，仅适用于 WebApplicationContext 环境
-   globalSession：同一个全局 HTTP Session 定义一个 Bean，仅适用于 WebApplicationContext 环境

### Spring 的单例实现原理

Spring 框架对单例的支持是采用 **单例注册表** 的方式进行实现的，而这个**注册表的缓存**是**ConcurrentHashMap 对象**，如果配置文件中的配置信息不要求使用单例，Spring 会采用新建实例的方式返回对象实例

### Bean 的生命周期 todo

ApplicationContext 容器中，Bean 的生命周期流程大致如下：

![img](https://cdn.nlark.com/yuque/0/2023/png/29236088/1675669749521-657e0d23-280e-4440-9cc2-26d677b648aa.png)

1. 首先容器启动后，会对 **scope** 为 **singleton** 且**非懒加载**的 bean 进行实例化
2. 按照 Bean 定义信息配置信息，注入所有的属性
3. 如果 Bean 实现了 **BeanNameAware** 接口，会回调该接口的 **setBeanName()** 方法，传入该 Bean 的 id，该 Bean 就获得了自己在配置文件中的 id 如果 Bean 实现了 **BeanFactoryAware** 接口，会回调该接口的 **setBeanFactory()** 方法，传入该 Bean 的 BeanFactory，该 Bean 就获得了自己所在的 BeanFactory 如果 Bean 实现了 **ApplicationContextAware** 接口，会回调该接口的 **setApplicationContext()** 方法，传入该 Bean 的 ApplicationContext，该 Bean 就获得了自己所在的 ApplicationContext
4. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessBeforeInitialzation()** 方法
5. 如果 Bean 实现了 **InitializingBean** 接口，则会回调该接口的 **afterPropertiesSet()** 方法
6. 如果 Bean 配置了 **init-method** 方法，则会执行 **init-method** 配置的方法
7. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessAfterInitialization()**方法
8. 经过各个流程之后，就可以正式使用该 Bean 了，对于 scope 为 singleton 的 Bean，Spring 的 ioc 容器中会缓存一份该 bean 的实例，而对于 scope 为 prototype 的 Bean，每次被调用都会 new 一个新的对象，期生命周期就交给调用方管理不再是 Spring 容器进行管理
9. 容器关闭后，如果 Bean 实现了 **DisposableBean** 接口，则会回调该接口的 **destroy()** 方法
10. 如果 Bean 配置了 **destroy-method** 方法，则会执行 **destroy-method** 配置的方法，至此，整个 Bean 的生命周期结束

### Bean 创建的生命周期

创建 bean 大致步骤：

1. 推断构造方法
2. 实例化
3. 填充属性，及依赖注入
4. 处理 aware 回调
5. 初始化前，处理@PostConstruct 注解
6. 初始化，处理 Initialization 接口
7. 初始化后，进行 aop

## IoC 相关

### Spring IoC 容器是什么

Spring IOC 负责创建、管理(通过依赖注入)、整合、配置对象以及管理这些对象的生命周期

### IoC 有什么优点

-   减少了代码量
-   使得程序的测试简单，因为在单元测试中不再需要单例或 JNDI 查找机制
-   松耦合
-   支持勤性单例及延迟加载服务

### 推荐哪种依赖注入

可以同时使用两种方式的依赖注入，最好使用构造器参数实现强制依赖注入，使用 setter 方法实现可选的依赖关系

### todo Spring IOC 的理解，原理与实现

工厂 + 反射

-   控制反转：理论思想，原来的对象是由使用者来进行控制，有了 spring 之后，可以把整个对象交给 spring 来帮我们进行管理
-   DI：依赖注入，把对应的属性的值注入到具体的对象中，@Autowired，populateBean 完成属性值的注入
-   容器：存储对象，使用 map 结构来存储，在 spring 中一般存在三级缓存，singletonObjects 存放完整的 bean 对象，整个 bean 的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean 的生命周期）

1、一般要涉及到容器的创建过程（beanFactory,DefaultListableBeanFactory）,向 bean 工厂中设置一些参数（BeanPostProcessor,Aware 接口的子类）等等属性

2、加载解析 bean 对象，准备要创建的 bean 对象的定义对象 beanDefinition,(xml 或者注解的解析过程)

3、beanFactoryPostProcessor 的处理，此处是扩展点，PlaceHolderConfigurSupport,ConfigurationClassPostProcessor

4、BeanPostProcessor 的注册功能，方便后续对 bean 对象完成具体的扩展功能

5、通过反射的方式讲 BeanDefinition 对象实例化成具体的 bean 对象，

6、bean 对象的初始化过程（填充属性，调用 aware 子类的方法，调用 BeanPostProcessor 前置处理方法，调用 init-mehtod 方法，调用 BeanPostProcessor 的后置处理方法）

7、生成完整的 bean 对象，通过 getBean 方法可以直接获取

8、销毁过程

### 依赖注入是什么

依赖注入作为控制反转(IOC)的一个层面，在这个概念中，不用创建对象而只需要描述如何创建它们。不必通过代码直接的将组件和服务连接在一起，而是通过配置文件说明哪些组件需要什么服务，之后 IOC 容器负责衔接

### 有哪些不同类型的依赖注入

-   **构造器依赖注入：**在容器触发构造器的时候完成，该构造器有一系列的参数，每个参数代表注入的对象
-   **Setter 方法依赖注入：**首先容器会触发一个无参构造函数或无参静态工厂方法实例化对象，之后容器调用 bean 中的 setter 方法完成 setter 方法依赖注入

### 自动装配的各种模式

提供五种模式用来自动装配 beans 之间的依赖注入:

-   no：默认的方式是不进行自动装配，通过手工设置 ref 属性来进行装配 bean
-   byName：通过参数名自动装配，Spring 容器查找 beans 的属性，这些 beans 在 XML 配置文件中被设置为 byName。之后容器试图匹配、装配和该 bean 的属性具有相同名字的 bean
-   byType：通过参数的数据类型自动自动装配，Spring 容器查找 beans 的属性，这些 beans 在 XML 配置文件中被设置为 byType。之后容器试图匹配和装配和该 bean 的属性类型一样的 bean。如果有多个 bean 符合条件，则抛出错误
-   constructor：这个同 byType 类似，不过是应用于构造函数的参数。如果在 BeanFactory 中不是恰好有一个 bean 与构造函数参数相同类型，则抛出错误
-   autodetect：如果有默认的构造方法，通过 cconstructor 的方式自动装配，否则使用 byType 的方式自动装配

### Spring 循环依赖的问题 todo

-   循环依赖：A 依赖 B，B 依赖 A，形成闭环
-   解决方法：使用三级缓存，提前暴露对象，AOP
-   **一级缓存中放的是完整对象，二级缓存中放的是非完整对象，三级缓存的 value 类型是 ObjectFactory**（是一个函数式接口，存在的意义是保证在整个容器的运行过程中同名的 bean 对象只能有一个）
-   bean 的创建过程：实例化，初始化（填充属性）

1.  1. 先创建 A 对象，实例化 A 对象，此时 A 对象中的 b 属性为空，填充属性 b
    2. 从容器中查找 B 对象，如果找到了，直接赋值不存在循环依赖问题，如果找不到直接创建 B 对象
    3. 实例化 B 对象，此时 B 对象中的 a 属性为空，填充属性 a
    4. 从容器中查找 A 对象，找不到，直接创建

-   在 d 的一步，会发现 A 对象是存在的，只不过此时的 A 对象不是一个完整的状态，只完成了实例化但是未完成初始化，如果在程序调用过程中，拥有了某个对象的引用，能否在后期给他完成赋值操作，可以优先把非完整状态的对象优先赋值，等待后续操作来完成赋值，这相当于**提前暴露了某个不完整对象的引用**，所以解决问题的核心在于实例化和初始化分开操作，这也是解决循环依赖问题的关键
-   当所有的对象都完成实例化和初始化操作之后，还要把完整对象放到容器中，此时在容器中存在对象的几个状态：1. 完成实例化但未完成初始化、2. 完整状态；因为都在容器中，所以要使用不同的 map 结构来进行存储，此时就有了一级缓存和二级缓存（如果一级缓存中有了，那么二级缓存中就不会存在同名的对象，因为他们的查找顺序是 1，2，3 这样的方式来查找的）

### 代理

-   如果一个对象需要被代理，或者说需要生成代理对象，需要优先生成一个普通对象，普通对象和代理对象是**不能同时出现在容器中**的
-   当对象需要被代理的时候，就要使用代理对象**覆盖掉**之前的普通对象
-   在实际的调用过程中，是没有办法确定什么时候对象被使用，所以就要求当某个对象被调用的时候，**优先判断此对象是否需要被代理**，类似于一种回调机制的实现，因此传入 lambda 表达式的时候，可通过 lambda 表达式来执行对象的覆盖过程，**getEarlyBeanReference()**
-   因此，所有的 bean 对象在创建的时候都要优先放到三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，如果不需要被代理，则直接返回普通对象

### 三级缓存的放置时间和删除时间

-   三级缓存：createBeanInstance 之后；addSingletonFactory
-   二级缓存：第一次从三级缓存确定对象是代理对象还是普通对象的时候，同时删除三级缓存；getSingleton
-   一级缓存：生成完整对象之后放到一级缓存，删除二三级缓存；addSingleton

### @Lazy

用于指定单例 bean 实例化的时机，在没有指定此注解时，单例会在容器初始化时就被创建。而当使用此注解后，单例对象的创建时机会在该 bean 在被第一次使用时创建，并且只创建一次。第二次及以后获取使用就不再创建。此注解只对单例 bean 有用，原型 bean 时此注解不起作用。也可以解决循环依赖问题

## AOP 相关

### 解释 AOP 模块

-   AOP 模块用来开发 Spring 应用程序中具有切面性质的部分
-   该模块的大部分服务由 AOP Aliance 提供，这就保证了 Spring 框架和其他 AOP 框架之间的互操作性
-   该模块将元数据编程引入到了 Spring

### 面向切面编程(AOP)

-   面向切面编程（AOP）允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理和事务管理
-   切面（Aspect） AOP 的核心就是切面，它将多个类的通用行为封装为可重用的模块。该模块含有一组 API 提供 cross-cutting 功能。根据需求的不同，一个应用程序可以有若干切面。在 Spring AOP 中，切面通过带有 @Aspect 注解的类实现
-   通知（Advice）通知表示在方法执行前后需要执行的动作。实际上它是 Spring AOP 框架在程序执行过程中触发的一些代码。Spring 切面可以执行一下五种类型的通知

-   -   before(前置通知)：在一个方法之前执行的通知
    -   after(最终通知)：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）
    -   after-returning(后置通知)：在某连接点正常完成后执行的通知
    -   after-throwing(异常通知)：在方法抛出异常退出时执行的通知
    -   around(环绕通知)：在方法调用前后触发的通知

-   切入点（Pointcut）切入点是一个或一组连接点，通知将在这些位置执行。可以通过表达式或匹配的方式指明切入点
-   引入引入允许我们在已有的类上添加新的方法或属性
-   目标对象被一个或者多个切面所通知的对象。它通常是一个代理对象。也被称做被通知（advised）对象
-   代理代理是将通知应用到目标对象后创建的对象。从客户端的角度看，代理对象和目标对象是一样的。有以下几种代理

-   -   BeanNameAutoProxyCreator：bean 名称自动代理创建器
    -   DefaultAdvisorAutoProxyCreator：默认通知者自动代理创建器
    -   Metadata autoproxying：元数据自动代理

-   织入将切面和其他应用类型或对象连接起来创建一个通知对象的过程。织入可以在编译、加载或运行时完成

### Spring AOP 实现原理

实现 AOP 的技术，主要分为两大类：

-   动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行
-   静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码

Spring AOP 的实现原理其实很简单

AOP 框架负责动态地生成 AOP 代理类，这个代理类的方法则由 Advice 和回调目标对象的方法所组成，并将该对象可作为目标对象使用

AOP 代理包含了目标对象的全部方法，但 AOP 代理中的方法与目标对象的方法存在差异，AOP 方法在特定切入点添加了增强处理，并回调了目标对象的方法

动态代理技术在运行期织入增强代码，使用两种代理机制：基于 JDK 的动态代理（JDK 本身只提供接口的代理）和基于 CGlib 的动态代理。

-   JDK 的动态代理 JDK 的动态代理主要涉及 **java.lang.reflect** 包中的两个类：**Proxy** 和 **InvocationHandler\*\***InvocationHandler** 只是一个接口，可以通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态的将横切逻辑与业务逻辑织在一起。而 **Proxy** 利用 **InvocationHandler** 动态创建一个符合某一接口的实例，生成目标类的代理对象其代理对象**必须是某个接口的实现\*\*，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理，只能实现接口的类生成代理，而不能针对类
-   CGLibCGLib 采用**底层的字节码技术**，为一个类**创建子类**，并在子类中采用方法拦截的技术拦截所有父类的调用方法，并顺势织入横切逻辑它运行期间生成的代理对象是**目标类的扩展子类**，所以无法通知**final、private 的方法**，因为它们不能被覆写。是针对类实现代理，主要是为指定的类生成一个子类，覆盖其中方法在 spring 中默认情况下使用 JDK 动态代理实现 AOP，如果**proxy-target-class**设置为 true 或者使用了优化策略那么会使用 CGLIB 来创建动态代理 Spring AOP 在这两种方式的实现上基本一样。JDK 代理中，会使用**JdkDynamicAopProxy**来创建代理，在**invoke()**方法首先需要织入到当前类的增强器封装到**拦截器链**中，然后递归的调用这些拦截器完成功能的织入，最终返回代理对象

### todo CgLib 和 jdk 动态代理什么区别

如上所述

## 启动相关

### Spring 容器启动流程

1. 在创建 Spring 容器，也就是启动 Spring 时，首先会进行扫描，扫描得到所有的**BeanDefinition**对象，并存在一个 Map 中
2. 然后筛选出**非懒加载的单例 BeanDefinition**进行创建 Bean；对于多例 Bean 不需要在启动过程中去进行创建，对于多例 Bean 会在每次获取 Bean 时利用**BeanDefinition**去通过 new 创建
3. 利用**BeanDefinition**创建 Bean 就是 Bean 的创建生命周期，这期间包括了合并**BeanDefinition**、推断构造方法、实例化、属性填充、初始化前、初始化、初始化后等步骤，其中 AOP 就是发生在初始化后这一步骤中
4. 单例 Bean 创建完了之后，Spring 会发布一个容器启动事件，Spring 启动结束

可以归纳为三个步骤：

1. 初始化 Spring 容器，注册内置的 **BeanPostProcessor** 的 **BeanDefinition** 到容器中
2. 将配置类的 **BeanDefinition** 注册到容器中
3. 调用 **refresh()** 方法刷新容器

## 事务相关

### Spring 事务实现方式

-   编程式事务管理：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护
-   声明式事务管理：将事务管理和业务代码分离。只需要通过**注解或者 XML 配置**管理事务

### Spring 框架的事务管理有哪些优点

-   为不同的事务 API（如 JTA, JDBC, Hibernate, JPA, 和 JDO）提供了统一的编程模型
-   为编程式事务管理提供了一个简单的 API
-   支持声明式事务管理
-   可以和 Spring 的多种数据访问技术很好的兼容

### Spring 事务定义的传播规则 todo

-   **PROPAGATION_REQUIRED：**支持当前事务，如果当前没有事务，就新建一个事务
-   **PROPAGATION_SUPPORTS：**支持当前事务，如果当前没有事务，就以非事务方式执行
-   **PROPAGATION_MANDATORY：**支持当前事务，如果当前没有事务，就抛出异常
-   **PROPAGATION_REQUIRES_NEW：**新建事务，如果当前存在事务，把当前事务挂起
-   **PROPAGATION_NOT_SUPPORTED：**以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
-   **PROPAGATION_NEVER：**以非事务方式执行，如果当前存在事务，则抛出异常
-   **PROPAGATION_NESTED：**如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，就新建一个事务

### Spring 事务底层原理

-   **划分处理单元 IoC**

-   -   Spring 是**对单个数据库进行局部事务处理**的，具体的实现首先用 IoC 划分了事务处理单元，并且将事务的各种配置放到了 ioc 容器中（设置事务管理器，设置事务的传播特性及隔离机制）

-   **AOP 拦截需要进行事务处理的类**

-   -   Spring 事务处理模块是通过 AOP 功能来实现声明式事务处理的具体操作（比如事务实行的配置和读取，事务对象的抽象），用**TransactionProxyFactoryBean**接口来使用 AOP 功能，生成**Proxy 代理对象**，再通过**TransactionInterceptor**完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取 IoC 容器事务配置属性，转化为 Spring 事务处理需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为**TransactionAttribute**表示的数据对象

-   对事务处理实现（事务的生成、提交、回滚、挂起）

-   -   Spring 委托给具体的事务处理器实现，实现了一个抽象和适配。适配的具体事务处理器：DataSource 数据源支持、hibernate 数据源事务处理支持、JDO 数据源事务处理支持、JPA、JTA 数据源事务处理支持。这些支持都是通过设计**PlatformTransactionManager、AbstractPlatforTransaction**一系列事务处理的支持，为常用数据源支持提供了一系列的 TransactionManager

-   结合

-   -   **PlatformTransactionManager**实现了**TransactionInterception 接口**，让其与**TransactionProxyFactoryBean**结合起来，形成一个 Spring 声明式事务处理的设计体系

### Spring 事务大致步骤

Spring 事务底层是基于**数据库事务**和**AOP 机制**的

1. 首先对于使用了**@Transactional**注解的 Bean， Spring 会创建一个代理对象作为 Bean
2. 当调用**代理对象的方法**时，会先判断该方法上是否加了@Transactional 注解
3. 如果加了，那么则利用**事务管理器**创建一个数据库连接
4. 并且**修改数据库**连接的**autocommit**属性（自动提交事务）为**false**，禁止此连接的自动提交
5. 然后执行当前方法，方法中会执行 SQL
6. 执行完当前方法后，如果没有出现异常就直接提交事务
7. 如果出现了异常，并且这个异常是需要回滚的就会回滚事务，否则仍然提交事务
8. Spring 事务的**隔离级别默认**对应的就是**数据库的隔离级别**
9. Spring 事务的传播机制是**基于数据库连接**来做的，一个数据库连接一个事务，如果传播机制配置为需要新开一个事务，那么实际上就是先建立一个数据库连接，在此新数据库连接上执行 sql

### Spring 事务隔离级别

-   **DEFAULT**：默认对应数据库的隔离级别
-   **READ_UNCOMMITTED**：读未提交
-   **READ_COMMITTED**：读已提交
-   **REPEATABLE_READ**：可重复读
-   **SERIALIZABLE**：串行化

### Spring 事务失效的情况 todo

1. 普通对象调用方法，即类中的非事务方法通过 this.xxx() 调用，事务是不生效的，只有代理对象调用才行，解决办法：

1.  1. 注入自己，通过注入的对象来调用；
    2. 使用@EnableAspectJAutoProxy(exposeProxy = true) + AopContext.currentProxy()

1. 业务方法为非 public 方法，因为**Cglib 动态代理**是基于父子类来实现的，Spring 事务默认生效的方法权限都必须为 public，解决办法：

1.  1. 将方法改为 public
    2. 修改 TansactionAttributeSource，将 publicMethodsOnly 改为 false
    3. 使用 AspectJ 代理模式替换 Cglib 动态代理

1. 因为**Cglib 动态代理**是基于父子类来实现的，子类是不能重载父类的**private**方法，所以类中的方法是**private**的则代理类不能重载，及**@Transaction**会失效
1. 方法用 final、static 修饰
1. service 类没有托管给 Spring，即没有加 @Service 或 @Component，解决办法：

1.  1. 将 service 注入 spring

1. 抛出受检异常，Spring 默认只会回滚非检查异常和 error 异常，解决办法：

1.  1. 配置 rollbackFor

1. 业务代码中将异常捕获后没有原样抛出异常，解决办法：

1.  1. 原样抛出异常
    2. 设置 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

1. 使用其他切面，并在切面代码中捕获了异常没有原样抛出异常，Spring 事务的切面优先级是最低的，所以其他切面捕获异常后 Spring 事务是无感知的，解决办法：

1.  1. 在切面中原样抛出异常
    2. 在切面中设置 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

1. 多线程调用，因为 Spring 的事务是通过数据库连接来实现，而数据库连接 Spring 是放在 threadLocal 里面。同一个事务，只能用同一个数据库连接。而多线程场景下，拿到的数据库连接是不一样的，即是属于不同事务
1. 错误的传播行为 @Transactional(propagation = Propagation.NOT_SUPPORTED)
1. 使用了不支持事务的存储引擎，如 mysql 的 MyISAM
1. 数据源没有配置事务管理器
1. 被代理的类过早实例化，当代理类的实例化早于 AbstractAutoProxyCreator 后置处理器，就无法被 AbstractAutoProxyCreator 后置处理器增强

```java
@Service
public class TranInvalidCaseInstantiatedTooEarly implements BeanPostProcessor , Ordered {

    @Autowired
    private UserService userService;


    @Transactional
    public boolean save(User user) {
        boolean isSuccess = userService.save(user);
        try {
            int i = 1 % 0;
        } catch (Exception e) {
            throw new RuntimeException();
        }
        return isSuccess;
    }

    @Override
    public int getOrder() {
        return 1;
    }
}
```

### todo Spring 的事务是如何回滚的?

### spring 的事务管理是如何实现的？ todo

​ 总：spring 的事务是由 aop 来实现的，首先要生成具体的代理对象，然后按照 aop 的整套流程来执行具体的操作逻辑，正常情况下要通过通知来完成核心功能，但是事务不是通过通知来实现的，而是通过一个 TransactionInterceptor 来实现的，然后调用 invoke 来实现具体的逻辑

​ 分：1、先做准备工作，解析各个方法上事务相关的属性，根据具体的属性来判断是否开始新事务

​ 2、当需要开启的时候，获取数据库连接，关闭自动提交功能，开起事务

​ 3、执行具体的 sql 逻辑操作

​ 4、在操作过程中，如果执行失败了，那么会通过 completeTransactionAfterThrowing 看来完成事务的回滚操作，回滚的具体逻辑是通过 doRollBack 方法来实现的，实现的时候也是要先获取连接对象，通过连接对象来回滚

​ 5、如果执行过程中，没有任何意外情况的发生，那么通过 commitTransactionAfterReturning 来完成事务的提交操作，提交的具体逻辑是通过 doCommit 方法来实现的，实现的时候也是要获取连接，通过连接对象来提交

​ 6、当事务执行完毕之后需要清除相关的事务信息 cleanupTransactionInfo

如果想要聊的更加细致的话，需要知道 TransactionInfo,TransactionStatus,

### **如何自定义注解实现功能**

1. 创建自定义注解和创建一个接口相似，但是注解的 interface 关键字需要以@符号开头。
2. 注解方法不能带有参数；
3. 注解方法返回值类型限定为：基本类型、String、Enums、Annotation 或者是这些类型的数组；
4. 注解方法可以有默认值；
5. 注解本身能够包含元注解，元注解被用来注解其它注解。

## 其他

### Resource 是如何被查找、加载的

Resource 接口是 Spring 资源访问策略的抽象，它本身并不提供任何资源访问实现，具体的资源访问由该接口的实现类完成——每个实现类代表一种资源访问策略。 Spring 为 Resource 接口提供了如下实现类：

-   UrlResource：访问网络资源的实现类。
-   ClassPathResource：访问类加载路径里资源的实现类。
-   FileSystemResource：访问文件系统里资源的实现类。
-   ServletContextResource：访问相对于 ServletContext 路径里的资源的实现类：
-   InputStreamResource：访问输入流资源的实现类。
-   ByteArrayResource：访问字节数组资源的实现类。 这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。

# Spring Framework 技术详解

## 1. Spring 框架概述

### 1.1 Spring 简介

Spring 是一个开源的 Java EE 开发框架，旨在简化企业级应用程序的开发。Spring 的核心功能可以应用在任何 Java 应用程序中，但对 Java EE 平台上的 Web 应用程序有更好的扩展性。

### 1.2 Spring 的设计目标

-   **简化开发**：使得 Java EE 应用程序的开发更加简捷
-   **降低耦合**：通过 IoC 容器管理对象依赖关系
-   **模块化设计**：提供可选择的模块化架构
-   **企业级功能**：提供事务管理、安全性、远程访问等企业级功能

### 1.3 Spring 的核心优势

| 优势                  | 描述                                                | 技术实现           |
| --------------------- | --------------------------------------------------- | ------------------ |
| **轻量级**            | Spring 在大小和透明性方面属于轻量级，基础版本约 2MB | 非侵入式设计       |
| **控制反转(IoC)**     | 使用控制反转技术实现了松耦合，依赖被注入到对象      | IoC 容器管理       |
| **面向切面编程(AOP)** | 支持面向切面编程，将业务逻辑与系统服务分离          | 动态代理技术       |
| **容器管理**          | Spring 包含并管理应用程序对象的配置及生命周期       | ApplicationContext |
| **MVC 框架**          | 提供设计优良的 web MVC 框架                         | Spring MVC         |
| **事务管理**          | 提供统一的事务管理接口                              | 声明式事务         |
| **异常处理**          | 提供便捷的 API 转化特定异常为一致的 Unchecked 异常  | 异常转换机制       |

### 1.4 Spring 中使用的设计模式

| 设计模式       | 在 Spring 中的应用     | 具体实现                                                |
| -------------- | ---------------------- | ------------------------------------------------------- |
| **单例模式**   | Bean 默认都是单例的    | SingletonBeanRegistry                                   |
| **原型模式**   | 指定作用域为 prototype | PrototypeBean                                           |
| **工厂模式**   | BeanFactory 创建 Bean  | BeanFactory/ApplicationContext                          |
| **模板方法**   | 抽象模板定义流程       | postProcessBeanFactory、onRefresh                       |
| **策略模式**   | 不同实现策略           | XmlBeanDefinitionReader、PropertiesBeanDefinitionReader |
| **观察者模式** | 事件监听机制           | ApplicationListener、ApplicationEvent                   |
| **适配器模式** | 适配不同接口           | HandlerAdapter                                          |
| **装饰者模式** | 功能增强               | BeanWrapper                                             |
| **责任链模式** | AOP 拦截器链           | InterceptorChain                                        |
| **代理模式**   | AOP 动态代理           | JDK Dynamic Proxy、CGLIB                                |

## 2. Spring IoC 容器

### 2.1 IoC 容器概述

**控制反转（Inversion of Control，IoC）** 是 Spring 框架的核心概念。Spring IoC 容器负责创建、管理、整合、配置对象以及管理这些对象的生命周期。

#### 2.1.1 IoC 的核心概念

```java
// 传统方式：对象自己创建依赖
public class UserService {
    private UserDao userDao = new UserDaoImpl(); // 紧耦合

    public void saveUser(User user) {
        userDao.save(user);
    }
}

// IoC方式：依赖被注入
@Service
public class UserService {
    @Autowired
    private UserDao userDao; // 松耦合，由容器注入

    public void saveUser(User user) {
        userDao.save(user);
    }
}
```

#### 2.1.2 IoC 的优势

**代码简化**：减少了对象创建和管理的代码
**易于测试**：在单元测试中不再需要复杂的对象创建
**松耦合**：对象间的依赖关系由容器管理
**灵活配置**：支持懒加载和延迟初始化

### 2.2 Spring IoC 实现原理

#### 2.2.1 核心机制

**工厂模式 + 反射技术**

```java
// 简化的IoC容器实现原理
public class SimpleIoCContainer {
    private Map<String, Object> beanContainer = new ConcurrentHashMap<>();
    private Map<String, BeanDefinition> beanDefinitionMap = new HashMap<>();

    // 注册Bean定义
    public void registerBeanDefinition(String beanName, BeanDefinition beanDefinition) {
        beanDefinitionMap.put(beanName, beanDefinition);
    }

    // 获取Bean实例
    public Object getBean(String beanName) {
        Object bean = beanContainer.get(beanName);
        if (bean == null) {
            bean = createBean(beanName);
            beanContainer.put(beanName, bean);
        }
        return bean;
    }

    // 创建Bean实例
    private Object createBean(String beanName) {
        BeanDefinition beanDefinition = beanDefinitionMap.get(beanName);
        Class<?> beanClass = beanDefinition.getBeanClass();

        try {
            // 1. 实例化
            Object bean = beanClass.newInstance();

            // 2. 属性填充（依赖注入）
            populateBean(bean, beanDefinition);

            // 3. 初始化
            initializeBean(bean, beanName);

            return bean;
        } catch (Exception e) {
            throw new RuntimeException("创建Bean失败: " + beanName, e);
        }
    }
}
```

#### 2.2.2 IoC 容器启动流程

1. **容器初始化**：创建 BeanFactory，设置 BeanPostProcessor
2. **Bean 定义加载**：解析 XML/注解，创建 BeanDefinition 对象
3. **BeanFactoryPostProcessor 处理**：扩展点处理
4. **BeanPostProcessor 注册**：为后续 Bean 处理做准备
5. **Bean 实例化**：通过反射创建 Bean 对象
6. **Bean 初始化**：属性填充、回调方法、代理生成
7. **Bean 使用**：通过 getBean 方法获取完整对象
8. **Bean 销毁**：容器关闭时的清理工作

### 2.3 BeanFactory vs ApplicationContext

#### 2.3.1 核心区别

| 特性              | BeanFactory                | ApplicationContext          |
| ----------------- | -------------------------- | --------------------------- |
| **Bean 创建时机** | 懒加载（第一次获取时创建） | 容器启动时创建所有单例 Bean |
| **功能范围**      | 基础的依赖注入功能         | 提供完整的企业级功能        |
| **国际化支持**    | 不支持                     | 支持国际化                  |
| **事件机制**      | 不支持                     | 支持应用事件发布            |
| **使用场景**      | 资源受限的环境             | 企业级应用（推荐）          |

#### 2.3.2 使用示例

```java
// BeanFactory使用
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("application.xml"));
MailService mailService = factory.getBean(MailService.class);

// ApplicationContext使用（推荐）
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = context.getBean(UserService.class);

// 注解配置方式
@Configuration
@ComponentScan("com.example")
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserServiceImpl();
    }
}

// 使用
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
UserService userService = context.getBean(UserService.class);
```

### 2.4 依赖注入（DI）

#### 2.4.1 依赖注入类型

**构造器注入**：

```java
@Service
public class UserService {
    private final UserDao userDao;
    private final EmailService emailService;

    // 构造器注入（推荐，强制依赖）
    public UserService(UserDao userDao, EmailService emailService) {
        this.userDao = userDao;
        this.emailService = emailService;
    }
}
```

**Setter 方法注入**：

```java
@Service
public class UserService {
    private UserDao userDao;
    private EmailService emailService;

    // Setter注入（可选依赖）
    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

**字段注入**：

```java
@Service
public class UserService {
    @Autowired
    private UserDao userDao; // 字段注入（不推荐，难以测试）

    @Autowired
    private EmailService emailService;
}
```

#### 2.4.2 自动装配模式

| 模式            | 说明                     | 使用场景               |
| --------------- | ------------------------ | ---------------------- |
| **no**          | 默认方式，不进行自动装配 | 手动配置场景           |
| **byName**      | 通过属性名自动装配       | 属性名与 Bean 名称一致 |
| **byType**      | 通过类型自动装配         | 类型唯一的情况         |
| **constructor** | 通过构造器参数类型装配   | 构造器注入             |
| **autodetect**  | 自动检测装配方式         | 已废弃                 |

### 2.5 循环依赖解决

#### 2.5.1 循环依赖问题

```java
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB; // A依赖B
}

@Service
public class ServiceB {
    @Autowired
    private ServiceA serviceA; // B依赖A，形成循环依赖
}
```

#### 2.5.2 三级缓存解决方案

```java
public class DefaultSingletonBeanRegistry {
    // 一级缓存：完整的Bean对象
    private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

    // 二级缓存：早期Bean对象（完成实例化但未完成初始化）
    private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);

    // 三级缓存：Bean工厂对象
    private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);

    protected Object getSingleton(String beanName, boolean allowEarlyReference) {
        Object singletonObject = this.singletonObjects.get(beanName);
        if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
            synchronized (this.singletonObjects) {
                singletonObject = this.earlySingletonObjects.get(beanName);
                if (singletonObject == null && allowEarlyReference) {
                    ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                    if (singletonFactory != null) {
                        singletonObject = singletonFactory.getObject();
                        this.earlySingletonObjects.put(beanName, singletonObject);
                        this.singletonFactories.remove(beanName);
                    }
                }
            }
        }
        return singletonObject;
    }
}
```

#### 2.5.3 三级缓存的时机

| 缓存级别     | 存放时机                | 删除时机         | 内容               |
| ------------ | ----------------------- | ---------------- | ------------------ |
| **三级缓存** | createBeanInstance 之后 | 移动到二级缓存时 | ObjectFactory 对象 |
| **二级缓存** | 第一次从三级缓存获取时  | 移动到一级缓存时 | 早期 Bean 对象     |
| **一级缓存** | Bean 完全初始化后       | Bean 销毁时      | 完整 Bean 对象     |

#### 2.5.4 @Lazy 解决循环依赖

```java
@Service
public class ServiceA {
    @Lazy
    @Autowired
    private ServiceB serviceB; // 延迟初始化，避免循环依赖
}
```

## 3. Spring Bean 管理

### 3.1 Bean 基础概念

#### 3.1.1 什么是 Spring Bean

Spring Bean 是构成 Spring 应用核心的 Java 对象，具有以下特点：

-   由 Spring IoC 容器实例化、组装、管理
-   通过容器中配置的元数据创建
-   默认情况下都是单例 Bean
-   完整的生命周期管理

#### 3.1.2 BeanFactory vs FactoryBean

```java
// BeanFactory：Spring容器的顶层接口
public interface BeanFactory {
    Object getBean(String name) throws BeansException;
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;
    boolean containsBean(String name);
    // ... 其他方法
}

// FactoryBean：创建Bean的工厂接口
public interface FactoryBean<T> {
    T getObject() throws Exception;
    Class<?> getObjectType();
    boolean isSingleton();
}

// FactoryBean实现示例
@Component
public class UserFactoryBean implements FactoryBean<User> {
    @Override
    public User getObject() throws Exception {
        User user = new User();
        user.setName("工厂创建的用户");
        return user;
    }

    @Override
    public Class<?> getObjectType() {
        return User.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

### 3.2 Bean 作用域

#### 3.2.1 Bean 作用域类型

| 作用域            | 描述                                       | 使用场景     |
| ----------------- | ------------------------------------------ | ------------ |
| **singleton**     | 默认作用域，IoC 容器中仅存在一个 Bean 实例 | 无状态 Bean  |
| **prototype**     | 每次获取 Bean 都创建新实例                 | 有状态 Bean  |
| **request**       | 每次 HTTP 请求创建新 Bean（Web 环境）      | Web 请求处理 |
| **session**       | 每个 HTTP Session 一个 Bean（Web 环境）    | 用户会话数据 |
| **globalSession** | 全局 Session 作用域（Portal 环境）         | Portal 应用  |

#### 3.2.2 作用域配置示例

```java
// 注解方式
@Service
@Scope("prototype") // 或 @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class PrototypeService {
    // 每次获取都是新实例
}

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedService {
    // 每次HTTP请求创建新实例
}

// XML配置方式
<bean id="userService" class="com.example.UserService" scope="singleton"/>
<bean id="prototypeBean" class="com.example.PrototypeBean" scope="prototype"/>
```

### 3.3 Bean 线程安全

#### 3.3.1 线程安全分析

Spring 本身不对 Bean 做线程安全处理，线程安全性取决于 Bean 的设计：

**无状态 Bean（线程安全）**：

```java
@Service
public class StatelessService {
    @Autowired
    private UserDao userDao;

    // 无实例变量，线程安全
    public User findUser(Long id) {
        return userDao.findById(id);
    }
}
```

**有状态 Bean（非线程安全）**：

```java
@Service
public class StatefulService {
    private int count = 0; // 实例变量，非线程安全

    public int increment() {
        return ++count; // 多线程访问会有问题
    }
}
```

#### 3.3.2 线程安全解决方案

```java
@Service
public class ThreadSafeService {
    private final AtomicInteger count = new AtomicInteger(0); // 使用原子类

    public int increment() {
        return count.incrementAndGet();
    }
}

@Service
@Scope("prototype") // 使用原型作用域
public class PrototypeThreadSafeService {
    private int count = 0; // 每个实例独立，线程安全

    public int increment() {
        return ++count;
    }
}
```

### 3.4 Bean 生命周期

#### 3.4.1 完整生命周期流程

```java
@Component
public class LifecycleBean implements BeanNameAware, BeanFactoryAware,
        ApplicationContextAware, InitializingBean, DisposableBean {

    private String beanName;
    private BeanFactory beanFactory;
    private ApplicationContext applicationContext;

    // 1. 构造器
    public LifecycleBean() {
        System.out.println("1. 构造器执行");
    }

    // 2. 设置属性值
    @Value("${app.name:default}")
    private String appName;

    // 3. BeanNameAware
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("3. BeanNameAware.setBeanName(): " + name);
    }

    // 4. BeanFactoryAware
    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
        System.out.println("4. BeanFactoryAware.setBeanFactory()");
    }

    // 5. ApplicationContextAware
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        System.out.println("5. ApplicationContextAware.setApplicationContext()");
    }

    // 6. @PostConstruct
    @PostConstruct
    public void postConstruct() {
        System.out.println("6. @PostConstruct 方法执行");
    }

    // 7. InitializingBean
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("7. InitializingBean.afterPropertiesSet()");
    }

    // 8. init-method
    public void initMethod() {
        System.out.println("8. init-method 执行");
    }

    // 9. @PreDestroy
    @PreDestroy
    public void preDestroy() {
        System.out.println("9. @PreDestroy 方法执行");
    }

    // 10. DisposableBean
    @Override
    public void destroy() throws Exception {
        System.out.println("10. DisposableBean.destroy()");
    }

    // 11. destroy-method
    public void destroyMethod() {
        System.out.println("11. destroy-method 执行");
    }
}
```

#### 3.4.2 BeanPostProcessor 扩展

```java
@Component
public class CustomBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("BeanPostProcessor.postProcessBeforeInitialization: " + beanName);
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("BeanPostProcessor.postProcessAfterInitialization: " + beanName);
        // 这里可以返回代理对象（AOP就是在这里实现的）
        return bean;
    }
}
```

### 3.5 单例实现原理

#### 3.5.1 单例注册表

-   使用 ConcurrentHashMap 作为缓存容器
-   在关键操作上使用 synchronized 同步
-   双重检查锁定模式确保单例创建的线程安全

## 4. Spring AOP（面向切面编程）

### 4.1 AOP 基础概念

#### 4.1.1 AOP 简介

面向切面编程（Aspect-Oriented Programming，AOP）允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理、事务管理、安全控制等。

#### 4.1.2 AOP 核心概念

| 概念                     | 定义                                             | 实际应用               |
| ------------------------ | ------------------------------------------------ | ---------------------- |
| **切面（Aspect）**       | AOP 的核心，将多个类的通用行为封装为可重用的模块 | 日志切面、事务切面     |
| **连接点（Join Point）** | 程序执行过程中能够插入切面的点                   | 方法调用、异常处理     |
| **切入点（Pointcut）**   | 定义在何处应用通知的表达式                       | execution()表达式      |
| **通知（Advice）**       | 在特定连接点执行的代码                           | 前置、后置、环绕通知   |
| **目标对象（Target）**   | 被一个或多个切面所通知的对象                     | 业务 Service 对象      |
| **代理（Proxy）**        | 将通知应用到目标对象后创建的对象                 | JDK/CGLIB 代理         |
| **织入（Weaving）**      | 将切面与应用类型连接创建通知对象的过程           | 编译期、加载期、运行期 |

#### 4.1.3 通知类型详解

```java
@Aspect
@Component
public class LoggingAspect {

    // 前置通知：方法执行前
    @Before("execution(* com.example.service.*.*(..))")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println("Before method: " + joinPoint.getSignature().getName());
    }

    // 后置通知：方法正常返回后
    @AfterReturning(value = "execution(* com.example.service.*.*(..))", returning = "result")
    public void afterReturningAdvice(JoinPoint joinPoint, Object result) {
        System.out.println("Method returned: " + result);
    }

    // 异常通知：方法抛出异常后
    @AfterThrowing(value = "execution(* com.example.service.*.*(..))", throwing = "exception")
    public void afterThrowingAdvice(JoinPoint joinPoint, Exception exception) {
        System.out.println("Method threw exception: " + exception.getMessage());
    }

    // 最终通知：方法执行后（无论正常或异常）
    @After("execution(* com.example.service.*.*(..))")
    public void afterAdvice(JoinPoint joinPoint) {
        System.out.println("After method: " + joinPoint.getSignature().getName());
    }

    // 环绕通知：完全控制方法执行
    @Around("execution(* com.example.service.*.*(..))")
    public Object aroundAdvice(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("Around before method");

        long startTime = System.currentTimeMillis();
        Object result = proceedingJoinPoint.proceed(); // 执行目标方法
        long endTime = System.currentTimeMillis();

        System.out.println("Around after method, execution time: " + (endTime - startTime) + "ms");
        return result;
    }
}
```

### 4.2 AOP 实现原理

#### 4.2.1 实现技术分类

**静态织入**：

-   **编译期织入**：AspectJ 编译器在编译时织入切面代码
-   **类加载期织入**：在类加载时通过字节码操作织入切面

**动态代理**：

-   **JDK 动态代理**：基于接口的代理
-   **CGLIB 动态代理**：基于继承的代理

#### 4.2.2 JDK 动态代理

```java
// JDK动态代理实现
public class JdkProxyExample {

    // 目标接口
    interface UserService {
        void saveUser(String username);
        User findUser(Long id);
    }

    // 目标实现类
    static class UserServiceImpl implements UserService {
        @Override
        public void saveUser(String username) {
            System.out.println("Saving user: " + username);
        }

        @Override
        public User findUser(Long id) {
            System.out.println("Finding user: " + id);
            return new User(id, "User" + id);
        }
    }

    // 代理处理器
    static class LoggingInvocationHandler implements InvocationHandler {
        private final Object target;

        public LoggingInvocationHandler(Object target) {
            this.target = target;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("Before method: " + method.getName());

            long startTime = System.currentTimeMillis();
            Object result = method.invoke(target, args); // 调用目标方法
            long endTime = System.currentTimeMillis();

            System.out.println("After method: " + method.getName() +
                             ", execution time: " + (endTime - startTime) + "ms");
            return result;
        }
    }

    public static void main(String[] args) {
        UserService target = new UserServiceImpl();

        // 创建代理对象
        UserService proxy = (UserService) Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            target.getClass().getInterfaces(),
            new LoggingInvocationHandler(target)
        );

        // 使用代理对象
        proxy.saveUser("张三");
        proxy.findUser(1L);
    }
}
```

#### 4.2.3 CGLIB 动态代理

```java
// CGLIB动态代理实现
public class CglibProxyExample {

    // 目标类（不需要实现接口）
    static class UserService {
        public void saveUser(String username) {
            System.out.println("Saving user: " + username);
        }

        public User findUser(Long id) {
            System.out.println("Finding user: " + id);
            return new User(id, "User" + id);
        }
    }

    // CGLIB方法拦截器
    static class LoggingMethodInterceptor implements MethodInterceptor {
        @Override
        public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
            System.out.println("CGLIB Before method: " + method.getName());

            long startTime = System.currentTimeMillis();
            Object result = proxy.invokeSuper(obj, args); // 调用父类方法
            long endTime = System.currentTimeMillis();

            System.out.println("CGLIB After method: " + method.getName() +
                             ", execution time: " + (endTime - startTime) + "ms");
            return result;
        }
    }

    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(UserService.class);
        enhancer.setCallback(new LoggingMethodInterceptor());

        // 创建代理对象
        UserService proxy = (UserService) enhancer.create();

        // 使用代理对象
        proxy.saveUser("李四");
        proxy.findUser(2L);
    }
}
```

#### 4.2.4 JDK 代理 vs CGLIB 代理

| 对比维度        | JDK 动态代理                     | CGLIB 动态代理                 |
| --------------- | -------------------------------- | ------------------------------ |
| **实现方式**    | 基于接口，实现 InvocationHandler | 基于继承，生成子类             |
| **性能**        | 调用效率高                       | 创建代理对象较慢，但方法调用快 |
| **限制**        | 目标类必须实现接口               | 不能代理 final 类和方法        |
| **JDK 版本**    | JDK 原生支持                     | 需要第三方库                   |
| **Spring 选择** | 目标类实现接口时使用             | 目标类未实现接口时使用         |

## 5. Spring 容器启动

### 5.1 容器启动流程

#### 5.1.1 整体启动流程

Spring 容器启动可以归纳为以下核心步骤：

1. **初始化 Spring 容器**：注册内置的 BeanPostProcessor 的 BeanDefinition 到容器中
2. **注册配置类**：将配置类的 BeanDefinition 注册到容器中
3. **调用 refresh()方法**：刷新容器，完成 Bean 的创建和初始化

#### 5.1.2 详细启动流程

```java
// refresh()方法的核心流程
@Override
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // 1. 准备刷新上下文
        prepareRefresh();

        // 2. 获取BeanFactory
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // 3. 准备BeanFactory
        prepareBeanFactory(beanFactory);

        try {
            // 4. 后置处理BeanFactory
            postProcessBeanFactory(beanFactory);

            // 5. 调用BeanFactoryPostProcessor
            invokeBeanFactoryPostProcessors(beanFactory);

            // 6. 注册BeanPostProcessor
            registerBeanPostProcessors(beanFactory);

            // 7. 初始化消息源
            initMessageSource();

            // 8. 初始化事件多播器
            initApplicationEventMulticaster();

            // 9. 初始化其他特殊bean（模板方法）
            onRefresh();

            // 10. 注册监听器
            registerListeners();

            // 11. 实例化所有非懒加载的单例Bean
            finishBeanFactoryInitialization(beanFactory);

            // 12. 完成刷新
            finishRefresh();
        }
        catch (BeansException ex) {
            // 销毁已创建的bean
            destroyBeans();
            cancelRefresh(ex);
            throw ex;
        }
        finally {
            resetCommonCaches();
        }
    }
}
```

#### 5.1.3 Bean 创建生命周期

```java
// 简化的Bean创建流程
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args) {
    // 1. 推断构造方法 & 实例化
    BeanWrapper instanceWrapper = createBeanInstance(beanName, mbd, args);

    // 2. 提前暴露Bean（解决循环依赖）
    if (isSingletonCurrentlyInCreation(beanName)) {
        addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }

    // 3. 填充属性（依赖注入）
    populateBean(beanName, mbd, instanceWrapper);

    // 4. 初始化Bean
    Object exposedObject = initializeBean(beanName, exposedObject, mbd);

    return exposedObject;
}

// Bean初始化过程
protected Object initializeBean(final String beanName, final Object bean, @Nullable RootBeanDefinition mbd) {
    // 4.1 处理Aware回调
    invokeAwareMethods(beanName, bean);

    // 4.2 执行BeanPostProcessor的前置处理
    Object wrappedBean = applyBeanPostProcessorsBeforeInitialization(bean, beanName);

    // 4.3 执行初始化方法
    invokeInitMethods(beanName, wrappedBean, mbd);

    // 4.4 执行BeanPostProcessor的后置处理（AOP在这里执行）
    wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);

    return wrappedBean;
}
```

### 5.2 Bean 创建详细步骤

#### 5.2.1 七个核心步骤

1. **推断构造方法**：确定使用哪个构造器创建 Bean
2. **实例化**：使用反射调用构造器创建对象
3. **填充属性**：依赖注入，设置 Bean 的属性值
4. **处理 Aware 回调**：调用各种 Aware 接口方法
5. **初始化前**：处理@PostConstruct 注解
6. **初始化**：处理 InitializingBean 接口
7. **初始化后**：进行 AOP 代理创建

#### 5.2.2 构造器推断示例

```java
@Component
public class ConstructorExample {
    private final UserDao userDao;
    private final EmailService emailService;

    // 只有一个构造器，Spring会自动使用
    public ConstructorExample(UserDao userDao, EmailService emailService) {
        this.userDao = userDao;
        this.emailService = emailService;
    }
}

@Component
public class MultipleConstructorExample {
    private UserDao userDao;
    private EmailService emailService;

    // 默认构造器
    public MultipleConstructorExample() {
    }

    // 指定Spring使用此构造器
    @Autowired
    public MultipleConstructorExample(UserDao userDao) {
        this.userDao = userDao;
    }

    // 其他构造器
    public MultipleConstructorExample(UserDao userDao, EmailService emailService) {
        this.userDao = userDao;
        this.emailService = emailService;
    }
}
```

## 6. Spring 事务管理

### 6.1 事务基础

#### 6.1.1 事务实现方式

| 实现方式       | 描述                     | 优缺点               |
| -------------- | ------------------------ | -------------------- |
| **编程式事务** | 通过编程方式管理事务     | 灵活性高，但代码繁琐 |
| **声明式事务** | 将事务管理和业务代码分离 | 简化开发，推荐使用   |

#### 6.1.2 声明式事务示例

````java
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // 默认事务配置
    public User saveUser(User user) {
        User savedUser = userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail());
        return savedUser;
    }

    // 自定义事务配置
    @Transactional(
        propagation = Propagation.REQUIRES_NEW,
        isolation = Isolation.READ_COMMITTED,
        timeout = 30,
### 6.3 事务底层原理

#### 6.3.1 事务实现机制

Spring事务管理基于以下核心组件：

1. **IoC容器划分处理单元**：将事务配置放到IoC容器中
2. **AOP拦截需要事务处理的类**：通过AOP实现声明式事务
3. **PlatformTransactionManager**：抽象事务管理器
4. **TransactionInterceptor**：事务拦截器

#### 6.3.2 事务执行流程

```java
// 事务执行的核心流程
@Component
public class TransactionFlow {

    // 1. Spring为@Transactional标注的Bean创建代理对象
    @Transactional
    public void businessMethod() {
        // 业务逻辑
    }

    // 2. 代理对象的方法调用流程
    public Object invoke(MethodInvocation invocation) throws Throwable {
        // 3. 事务管理器创建数据库连接
        TransactionInfo txInfo = createTransactionIfNecessary();

        Object retVal;
        try {
            // 4. 设置autocommit=false
            // 5. 执行目标方法
            retVal = invocation.proceed();

            // 6. 如果没有异常，提交事务
            commitTransactionAfterReturning(txInfo);
        } catch (Throwable ex) {
            // 7. 如果有异常且需要回滚，回滚事务
            completeTransactionAfterThrowing(txInfo, ex);
            throw ex;
        } finally {
            // 8. 清理事务信息
            cleanupTransactionInfo(txInfo);
        }

        return retVal;
    }
}
````

#### 6.3.3 事务隔离级别

| 隔离级别             | 描述                   | 并发问题               |
| -------------------- | ---------------------- | ---------------------- |
| **DEFAULT**          | 使用数据库默认隔离级别 | 取决于数据库           |
| **READ_UNCOMMITTED** | 读未提交               | 脏读、不可重复读、幻读 |
| **READ_COMMITTED**   | 读已提交               | 不可重复读、幻读       |
| **REPEATABLE_READ**  | 可重复读               | 幻读                   |
| **SERIALIZABLE**     | 串行化                 | 无并发问题，性能最差   |

### 6.4 事务失效场景与解决方案

#### 6.4.1 常见失效场景

```java
@Service
public class TransactionFailureService {

    @Autowired
    private TransactionFailureService self; // 解决内部调用问题

    // 1. 内部方法调用导致事务失效
    public void publicMethod() {
        // 错误：内部调用不经过代理，事务失效
        // this.transactionalMethod();

        // 正确：通过代理对象调用
        self.transactionalMethod();
    }

    @Transactional
    public void transactionalMethod() {
        // 事务方法
    }

    // 2. 非public方法，事务失效
    @Transactional // 无效，因为方法不是public
    private void privateTransactionalMethod() {
        // 事务不会生效
    }

    // 3. final方法，事务失效
    @Transactional
    public final void finalMethod() {
        // CGLIB无法创建子类重写final方法，事务失效
    }

    // 4. 异常被捕获，事务不回滚
    @Transactional
    public void catchExceptionMethod() {
        try {
            // 可能抛出异常的代码
            riskyOperation();
        } catch (Exception e) {
            // 错误：异常被捕获，事务不会回滚
            log.error("操作失败", e);

            // 正确：手动设置回滚
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
    }

    // 5. 抛出检查异常，事务不回滚
    @Transactional // 默认只回滚RuntimeException和Error
    public void checkedExceptionMethod() throws Exception {
        throw new Exception("检查异常"); // 不会回滚
    }

    // 正确：指定回滚异常类型
    @Transactional(rollbackFor = Exception.class)
    public void correctCheckedExceptionMethod() throws Exception {
        throw new Exception("检查异常"); // 会回滚
    }
}
```

#### 6.4.2 多线程事务失效

```java
@Service
public class MultiThreadTransactionService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void processUsersIncorrectly(List<User> users) {
        users.parallelStream().forEach(user -> {
            // 错误：多线程环境下，子线程无法获得主线程的事务
            userRepository.save(user); // 每个线程都是独立的事务
        });
    }

    @Transactional
    public void processUsersCorrectly(List<User> users) {
        // 正确：在同一线程中串行处理
        for (User user : users) {
            userRepository.save(user); // 都在同一事务中
        }
    }
}
```

#### 6.4.3 解决方案总结

| 失效场景                  | 解决方案                                           |
| ------------------------- | -------------------------------------------------- |
| **内部调用**              | 注入自己或使用 AopContext.currentProxy()           |
| **非 public 方法**        | 改为 public 或修改 TransactionAttributeSource 配置 |
| **final/static 方法**     | 去掉 final/static 修饰符                           |
| **Bean 未被 Spring 管理** | 添加@Component 等注解                              |
| **检查异常**              | 配置 rollbackFor 属性                              |
| **异常被捕获**            | 重新抛出异常或手动设置回滚                         |
| **多线程调用**            | 避免跨线程使用事务或使用编程式事务                 |
| **错误的传播行为**        | 检查 propagation 配置                              |

## 7. Spring 高级特性

### 7.1 自定义注解

#### 7.1.1 创建自定义注解

```java
// 操作日志注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface OperationLog {
    String value() default "";
    String module() default "";
    OperationType type() default OperationType.OTHER;
}

// 操作类型枚举
public enum OperationType {
    CREATE("创建"),
    UPDATE("更新"),
    DELETE("删除"),
    QUERY("查询"),
    OTHER("其他");

    private final String description;

    OperationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

// 缓存注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Cache {
    String key();
    int expireSeconds() default 300;
    boolean condition() default true;
}

// 参数验证注解
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidParam {
    boolean required() default true;
    String message() default "参数验证失败";
}
```

#### 7.1.2 注解处理器

```java
@Aspect
@Component
@Slf4j
public class OperationLogAspect {

    @Autowired
    private OperationLogService operationLogService;

    @Around("@annotation(operationLog)")
    public Object logOperation(ProceedingJoinPoint joinPoint, OperationLog operationLog) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        // 构建操作日志
        OperationLogEntity logEntity = OperationLogEntity.builder()
                .module(operationLog.module())
                .operation(operationLog.value())
                .operationType(operationLog.type())
                .className(className)
                .methodName(methodName)
                .params(JSON.toJSONString(args))
                .startTime(new Date(startTime))
                .build();

        try {
            // 执行目标方法
            Object result = joinPoint.proceed();

            // 记录成功日志
            long endTime = System.currentTimeMillis();
            logEntity.setEndTime(new Date(endTime));
            logEntity.setExecutionTime(endTime - startTime);
            logEntity.setSuccess(true);
            logEntity.setResult(JSON.toJSONString(result));

            return result;
        } catch (Exception e) {
            // 记录失败日志
            long endTime = System.currentTimeMillis();
            logEntity.setEndTime(new Date(endTime));
            logEntity.setExecutionTime(endTime - startTime);
            logEntity.setSuccess(false);
            logEntity.setErrorMessage(e.getMessage());

            throw e;
        } finally {
            // 异步保存日志
            operationLogService.saveLogAsync(logEntity);
        }
    }
}

// 使用示例
@RestController
@RequestMapping("/users")
public class UserController {

    @OperationLog(value = "创建用户", module = "用户管理", type = OperationType.CREATE)
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @OperationLog(value = "删除用户", module = "用户管理", type = OperationType.DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

### 7.2 Resource 资源管理

#### 7.2.1 Resource 接口实现

Spring 的 Resource 接口提供了统一的资源访问策略：

```java
@Service
public class ResourceService {

    @Value("classpath:config/application.properties")
    private Resource configResource;

    @Value("file:/path/to/file.txt")
    private Resource fileResource;

    @Value("http://example.com/data.json")
    private Resource urlResource;

    public void demonstrateResourceUsage() throws IOException {
        // 1. ClassPath资源
        try (InputStream is = configResource.getInputStream()) {
            Properties props = new Properties();
            props.load(is);
            System.out.println("配置属性: " + props);
        }

        // 2. 文件系统资源
        if (fileResource.exists()) {
            String content = new String(Files.readAllBytes(fileResource.getFile().toPath()));
            System.out.println("文件内容: " + content);
        }

        // 3. URL资源
        try (InputStream is = urlResource.getInputStream()) {
            String data = IOUtils.toString(is, StandardCharsets.UTF_8);
            System.out.println("URL数据: " + data);
        }
    }
}
```

#### 7.2.2 Resource 实现类型

| 实现类                     | 用途                | 示例                            |
| -------------------------- | ------------------- | ------------------------------- |
| **ClassPathResource**      | 访问类路径资源      | classpath:config/app.properties |
| **FileSystemResource**     | 访问文件系统资源    | file:/home/user/data.txt        |
| **UrlResource**            | 访问网络资源        | http://example.com/api/data     |
| **ServletContextResource** | 访问 Web 上下文资源 | /WEB-INF/config/web.xml         |
| **InputStreamResource**    | 访问输入流资源      | InputStream 包装                |
| **ByteArrayResource**      | 访问字节数组资源    | byte[]包装                      |

### 7.3 Spring 事件机制

#### 7.3.1 自定义事件

```java
// 自定义事件
public class UserRegisteredEvent extends ApplicationEvent {
    private final User user;
    private final String source;

    public UserRegisteredEvent(Object source, User user, String eventSource) {
        super(source);
        this.user = user;
        this.source = eventSource;
    }

    public User getUser() {
        return user;
    }

    public String getEventSource() {
        return source;
    }
}

// 事件发布者
@Service
public class UserService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // 保存用户
        User savedUser = userRepository.save(user);

        // 发布用户注册事件
        UserRegisteredEvent event = new UserRegisteredEvent(this, savedUser, "用户注册");
        eventPublisher.publishEvent(event);

        return savedUser;
    }
}

// 事件监听者
@Component
@Slf4j
public class UserEventListener {

    @Autowired
    private EmailService emailService;

    @Autowired
    private CouponService couponService;

    // 发送欢迎邮件
    @EventListener
    @Async
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = event.getUser();
        log.info("用户注册事件：{}, 来源：{}", user.getUsername(), event.getEventSource());

        // 发送欢迎邮件
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
    }

    // 发放新用户优惠券
    @EventListener
    @Async
    public void giveNewUserCoupon(UserRegisteredEvent event) {
        User user = event.getUser();

        // 发放新用户优惠券
        couponService.giveNewUserCoupon(user.getId());
    }

    // 条件监听
    @EventListener(condition = "#event.user.vip == true")
    public void handleVipUserRegistered(UserRegisteredEvent event) {
        User user = event.getUser();
        log.info("VIP用户注册：{}", user.getUsername());

        // VIP用户特殊处理
        processVipUser(user);
    }
}
```

## 8. Spring 最佳实践

### 8.1 配置最佳实践

#### 8.1.1 配置类组织

```java
// 主配置类
@Configuration
@EnableWebMvc
@EnableTransactionManagement
@EnableAspectJAutoProxy
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    // 主要配置
}

// 数据库配置
@Configuration
@EnableJpaRepositories(basePackages = "com.example.repository")
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url("jdbc:mysql://localhost:3306/primary")
                .username("root")
                .password("password")
                .build();
    }

    @Bean
    public DataSource secondaryDataSource() {
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url("jdbc:mysql://localhost:3306/secondary")
                .username("root")
                .password("password")
                .build();
    }
}

// 缓存配置
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
                .RedisCacheManagerBuilder
                .fromConnectionFactory(redisConnectionFactory())
                .cacheDefaults(cacheConfiguration());

        return builder.build();
    }

    private RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}
```

### 8.2 性能优化

#### 8.2.1 Bean 创建优化

```java
@Configuration
public class PerformanceOptimizationConfig {

    // 1. 使用@Lazy延迟初始化
    @Bean
    @Lazy
    public ExpensiveService expensiveService() {
        return new ExpensiveService();
    }

    // 2. 使用@ConditionalOnProperty条件创建
    @Bean
    @ConditionalOnProperty(name = "feature.enabled", havingValue = "true")
    public FeatureService featureService() {
        return new FeatureService();
    }

    // 3. 使用Profile分环境创建Bean
    @Bean
    @Profile("development")
    public MockService mockService() {
        return new MockService();
    }

    @Bean
    @Profile("production")
    public RealService realService() {
        return new RealService();
    }
}

// 4. 使用@PostConstruct替代InitializingBean
@Component
public class OptimizedService {

    @PostConstruct
    public void init() {
        // 初始化逻辑，比实现InitializingBean接口更轻量
    }
}
```

#### 8.2.2 AOP 性能优化

```java
// 精确的切入点表达式
@Aspect
@Component
public class OptimizedAspect {

    // 避免过于宽泛的切入点
    // 错误：会匹配太多方法
    // @Around("execution(* com.example..*.*(..))")

    // 正确：精确匹配需要的方法
    @Around("@annotation(com.example.annotation.Monitored)")
    public Object monitorPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        // 监控逻辑
        return joinPoint.proceed();
    }

    // 使用@within优化类级别的切入点
    @Before("@within(org.springframework.stereotype.Service)")
    public void beforeServiceMethod(JoinPoint joinPoint) {
        // 服务方法前置处理
    }
}
```

### 8.3 测试最佳实践

#### 8.3.1 单元测试

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {TestConfig.class})
class UserServiceTest {

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Test
    @DisplayName("用户注册成功测试")
    void shouldRegisterUserSuccessfully() {
        // Given
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .build();

        User savedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.registerUser(user);

        // Then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUsername()).isEqualTo("testuser");

        verify(userRepository).save(user);
        verify(emailService).sendWelcomeEmail(user.getEmail(), user.getUsername());
    }
}
```

#### 8.3.2 集成测试

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@Rollback
class UserControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("用户创建API集成测试")
    void shouldCreateUserThroughApi() {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
                .username("apiuser")
                .email("api@example.com")
                .password("password123")
                .build();

        // When
        ResponseEntity<UserResponse> response = restTemplate.postForEntity(
                "/api/users", request, UserResponse.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getUsername()).isEqualTo("apiuser");

        // 验证数据库
        Optional<User> savedUser = userRepository.findByUsername("apiuser");
        assertThat(savedUser).isPresent();
        assertThat(savedUser.get().getEmail()).isEqualTo("api@example.com");
    }
}
```

## 9. 总结

### 9.1 Spring 框架优势

**简化开发**：通过 IoC 和 DI 减少了对象创建和管理的复杂性
**模块化设计**：提供可选择的模块，按需使用
**非侵入式**：对业务代码的侵入性最小
**丰富的生态**：强大的 Spring 生态系统支持
**企业级特性**：提供事务管理、安全、缓存等企业级功能

### 9.2 核心技术总结

| 技术模块     | 核心功能           | 应用场景               |
| ------------ | ------------------ | ---------------------- |
| **IoC 容器** | 对象创建和依赖管理 | 所有 Spring 应用的基础 |
| **AOP**      | 横切关注点分离     | 日志、事务、安全、监控 |
| **事务管理** | 声明式事务支持     | 数据一致性保证         |
| **MVC**      | Web 应用开发       | RESTful API、Web 应用  |
| **Data**     | 数据访问抽象       | 数据库操作简化         |
| **Security** | 安全框架           | 认证、授权、防护       |

### 9.3 学习建议

1. **扎实基础**：深入理解 IoC 和 AOP 原理
2. **实践为主**：通过项目实践掌握 Spring 使用
3. **源码阅读**：阅读 Spring 源码理解实现原理
4. **持续学习**：跟上 Spring 生态的发展
5. **最佳实践**：学习和应用 Spring 最佳实践

Spring 框架作为 Java 企业级开发的事实标准，其设计思想和技术实现都值得深入学习和理解。通过系统掌握 Spring 的核心技术，可以显著提升 Java 应用开发的效率和质量。

-   使用 ConcurrentHashMap 作为缓存容器
-   在关键操作上使用 synchronized 同步
-   双重检查锁定模式确保单例创建的线程安全

### Bean 的生命周期 todo

ApplicationContext 容器中，Bean 的生命周期流程大致如下：

![img](https://cdn.nlark.com/yuque/0/2023/png/29236088/1675669749521-657e0d23-280e-4440-9cc2-26d677b648aa.png)

1. 首先容器启动后，会对 **scope** 为 **singleton** 且**非懒加载**的 bean 进行实例化
2. 按照 Bean 定义信息配置信息，注入所有的属性
3. 如果 Bean 实现了 **BeanNameAware** 接口，会回调该接口的 **setBeanName()** 方法，传入该 Bean 的 id，该 Bean 就获得了自己在配置文件中的 id 如果 Bean 实现了 **BeanFactoryAware** 接口，会回调该接口的 **setBeanFactory()** 方法，传入该 Bean 的 BeanFactory，该 Bean 就获得了自己所在的 BeanFactory 如果 Bean 实现了 **ApplicationContextAware** 接口，会回调该接口的 **setApplicationContext()** 方法，传入该 Bean 的 ApplicationContext，该 Bean 就获得了自己所在的 ApplicationContext
4. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessBeforeInitialzation()** 方法
5. 如果 Bean 实现了 **InitializingBean** 接口，则会回调该接口的 **afterPropertiesSet()** 方法
6. 如果 Bean 配置了 **init-method** 方法，则会执行 **init-method** 配置的方法
7. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessAfterInitialization()**方法
8. 经过各个流程之后，就可以正式使用该 Bean 了，对于 scope 为 singleton 的 Bean，Spring 的 ioc 容器中会缓存一份该 bean 的实例，而对于 scope 为 prototype 的 Bean，每次被调用都会 new 一个新的对象，期生命周期就交给调用方管理不再是 Spring 容器进行管理
9. 容器关闭后，如果 Bean 实现了 **DisposableBean** 接口，则会回调该接口的 **destroy()** 方法
10. 如果 Bean 配置了 **destroy-method** 方法，则会执行 **destroy-method** 配置的方法，至此，整个 Bean 的生命周期结束

### Bean 创建的生命周期

创建 bean 大致步骤：

1. 推断构造方法
2. 实例化
3. 填充属性，及依赖注入
4. 处理 aware 回调
5. 初始化前，处理@PostConstruct 注解
6. 初始化，处理 Initialization 接口
7. 初始化后，进行 aop

## IoC 相关

### Spring IoC 容器是什么

Spring IOC 负责创建、管理(通过依赖注入)、整合、配置对象以及管理这些对象的生命周期

### IoC 有什么优点

-   减少了代码量
-   使得程序的测试简单，因为在单元测试中不再需要单例或 JNDI 查找机制
-   松耦合
-   支持勤性单例及延迟加载服务

### 推荐哪种依赖注入

可以同时使用两种方式的依赖注入，最好使用构造器参数实现强制依赖注入，使用 setter 方法实现可选的依赖关系

### todo Spring IOC 的理解，原理与实现

工厂 + 反射

-   控制反转：理论思想，原来的对象是由使用者来进行控制，有了 spring 之后，可以把整个对象交给 spring 来帮我们进行管理
-   DI：依赖注入，把对应的属性的值注入到具体的对象中，@Autowired，populateBean 完成属性值的注入
-   容器：存储对象，使用 map 结构来存储，在 spring 中一般存在三级缓存，singletonObjects 存放完整的 bean 对象，整个 bean 的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean 的生命周期）

1、一般要涉及到容器的创建过程（beanFactory,DefaultListableBeanFactory）,向 bean 工厂中设置一些参数（BeanPostProcessor,Aware 接口的子类）等等属性

2、加载解析 bean 对象，准备要创建的 bean 对象的定义对象 beanDefinition,(xml 或者注解的解析过程)

3、beanFactoryPostProcessor 的处理，此处是扩展点，PlaceHolderConfigurSupport,ConfigurationClassPostProcessor

4、BeanPostProcessor 的注册功能，方便后续对 bean 对象完成具体的扩展功能

5、通过反射的方式讲 BeanDefinition 对象实例化成具体的 bean 对象，

6、bean 对象的初始化过程（填充属性，调用 aware 子类的方法，调用 BeanPostProcessor 前置处理方法，调用 init-mehtod 方法，调用 BeanPostProcessor 的后置处理方法）

7、生成完整的 bean 对象，通过 getBean 方法可以直接获取

8、销毁过程

### 依赖注入是什么

依赖注入作为控制反转(IOC)的一个层面，在这个概念中，不用创建对象而只需要描述如何创建它们。不必通过代码直接的将组件和服务连接在一起，而是通过配置文件说明哪些组件需要什么服务，之后 IOC 容器负责衔接

### 有哪些不同类型的依赖注入

-   **构造器依赖注入：**在容器触发构造器的时候完成，该构造器有一系列的参数，每个参数代表注入的对象
-   **Setter 方法依赖注入：**首先容器会触发一个无参构造函数或无参静态工厂方法实例化对象，之后容器调用 bean 中的 setter 方法完成 setter 方法依赖注入

### 自动装配的各种模式

提供五种模式用来自动装配 beans 之间的依赖注入:

-   no：默认的方式是不进行自动装配，通过手工设置 ref 属性来进行装配 bean
-   byName：通过参数名自动装配，Spring 容器查找 beans 的属性，这些 beans 在 XML 配置文件中被设置为 byName。之后容器试图匹配、装配和该 bean 的属性具有相同名字的 bean
-   byType：通过参数的数据类型自动自动装配，Spring 容器查找 beans 的属性，这些 beans 在 XML 配置文件中被设置为 byType。之后容器试图匹配和装配和该 bean 的属性类型一样的 bean。如果有多个 bean 符合条件，则抛出错误
-   constructor：这个同 byType 类似，不过是应用于构造函数的参数。如果在 BeanFactory 中不是恰好有一个 bean 与构造函数参数相同类型，则抛出错误
-   autodetect：如果有默认的构造方法，通过 cconstructor 的方式自动装配，否则使用 byType 的方式自动装配

### Spring 循环依赖的问题 todo

-   循环依赖：A 依赖 B，B 依赖 A，形成闭环
-   解决方法：使用三级缓存，提前暴露对象，AOP
-   **一级缓存中放的是完整对象，二级缓存中放的是非完整对象，三级缓存的 value 类型是 ObjectFactory**（是一个函数式接口，存在的意义是保证在整个容器的运行过程中同名的 bean 对象只能有一个）
-   bean 的创建过程：实例化，初始化（填充属性）

1.  1. 先创建 A 对象，实例化 A 对象，此时 A 对象中的 b 属性为空，填充属性 b
    2. 从容器中查找 B 对象，如果找到了，直接赋值不存在循环依赖问题，如果找不到直接创建 B 对象
    3. 实例化 B 对象，此时 B 对象中的 a 属性为空，填充属性 a
    4. 从容器中查找 A 对象，找不到，直接创建

-   在 d 的一步，会发现 A 对象是存在的，只不过此时的 A 对象不是一个完整的状态，只完成了实例化但是未完成初始化，如果在程序调用过程中，拥有了某个对象的引用，能否在后期给他完成赋值操作，可以优先把非完整状态的对象优先赋值，等待后续操作来完成赋值，这相当于**提前暴露了某个不完整对象的引用**，所以解决问题的核心在于实例化和初始化分开操作，这也是解决循环依赖问题的关键
-   当所有的对象都完成实例化和初始化操作之后，还要把完整对象放到容器中，此时在容器中存在对象的几个状态：1. 完成实例化但未完成初始化、2. 完整状态；因为都在容器中，所以要使用不同的 map 结构来进行存储，此时就有了一级缓存和二级缓存（如果一级缓存中有了，那么二级缓存中就不会存在同名的对象，因为他们的查找顺序是 1，2，3 这样的方式来查找的）

### 代理

-   如果一个对象需要被代理，或者说需要生成代理对象，需要优先生成一个普通对象，普通对象和代理对象是**不能同时出现在容器中**的
-   当对象需要被代理的时候，就要使用代理对象**覆盖掉**之前的普通对象
-   在实际的调用过程中，是没有办法确定什么时候对象被使用，所以就要求当某个对象被调用的时候，**优先判断此对象是否需要被代理**，类似于一种回调机制的实现，因此传入 lambda 表达式的时候，可通过 lambda 表达式来执行对象的覆盖过程，**getEarlyBeanReference()**
-   因此，所有的 bean 对象在创建的时候都要优先放到三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，如果不需要被代理，则直接返回普通对象

### 三级缓存的放置时间和删除时间

-   三级缓存：createBeanInstance 之后；addSingletonFactory
-   二级缓存：第一次从三级缓存确定对象是代理对象还是普通对象的时候，同时删除三级缓存；getSingleton
-   一级缓存：生成完整对象之后放到一级缓存，删除二三级缓存；addSingleton

### @Lazy

用于指定单例 bean 实例化的时机，在没有指定此注解时，单例会在容器初始化时就被创建。而当使用此注解后，单例对象的创建时机会在该 bean 在被第一次使用时创建，并且只创建一次。第二次及以后获取使用就不再创建。此注解只对单例 bean 有用，原型 bean 时此注解不起作用。也可以解决循环依赖问题

## AOP 相关

### 解释 AOP 模块

-   AOP 模块用来开发 Spring 应用程序中具有切面性质的部分
-   该模块的大部分服务由 AOP Aliance 提供，这就保证了 Spring 框架和其他 AOP 框架之间的互操作性
-   该模块将元数据编程引入到了 Spring

### 面向切面编程(AOP)

-   面向切面编程（AOP）允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理和事务管理
-   切面（Aspect） AOP 的核心就是切面，它将多个类的通用行为封装为可重用的模块。该模块含有一组 API 提供 cross-cutting 功能。根据需求的不同，一个应用程序可以有若干切面。在 Spring AOP 中，切面通过带有 @Aspect 注解的类实现
-   通知（Advice）通知表示在方法执行前后需要执行的动作。实际上它是 Spring AOP 框架在程序执行过程中触发的一些代码。Spring 切面可以执行一下五种类型的通知

-   -   before(前置通知)：在一个方法之前执行的通知
    -   after(最终通知)：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）
    -   after-returning(后置通知)：在某连接点正常完成后执行的通知
    -   after-throwing(异常通知)：在方法抛出异常退出时执行的通知
    -   around(环绕通知)：在方法调用前后触发的通知

-   切入点（Pointcut）切入点是一个或一组连接点，通知将在这些位置执行。可以通过表达式或匹配的方式指明切入点
-   引入引入允许我们在已有的类上添加新的方法或属性
-   目标对象被一个或者多个切面所通知的对象。它通常是一个代理对象。也被称做被通知（advised）对象
-   代理代理是将通知应用到目标对象后创建的对象。从客户端的角度看，代理对象和目标对象是一样的。有以下几种代理

-   -   BeanNameAutoProxyCreator：bean 名称自动代理创建器
    -   DefaultAdvisorAutoProxyCreator：默认通知者自动代理创建器
    -   Metadata autoproxying：元数据自动代理

-   织入将切面和其他应用类型或对象连接起来创建一个通知对象的过程。织入可以在编译、加载或运行时完成

### Spring AOP 实现原理

实现 AOP 的技术，主要分为两大类：

-   动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行
-   静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码

Spring AOP 的实现原理其实很简单

AOP 框架负责动态地生成 AOP 代理类，这个代理类的方法则由 Advice 和回调目标对象的方法所组成，并将该对象可作为目标对象使用

AOP 代理包含了目标对象的全部方法，但 AOP 代理中的方法与目标对象的方法存在差异，AOP 方法在特定切入点添加了增强处理，并回调了目标对象的方法

动态代理技术在运行期织入增强代码，使用两种代理机制：基于 JDK 的动态代理（JDK 本身只提供接口的代理）和基于 CGlib 的动态代理。

-   JDK 的动态代理 JDK 的动态代理主要涉及 **java.lang.reflect** 包中的两个类：**Proxy** 和 **InvocationHandler\*\***InvocationHandler** 只是一个接口，可以通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态的将横切逻辑与业务逻辑织在一起。而 **Proxy** 利用 **InvocationHandler** 动态创建一个符合某一接口的实例，生成目标类的代理对象其代理对象**必须是某个接口的实现\*\*，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理，只能实现接口的类生成代理，而不能针对类
-   CGLibCGLib 采用**底层的字节码技术**，为一个类**创建子类**，并在子类中采用方法拦截的技术拦截所有父类的调用方法，并顺势织入横切逻辑它运行期间生成的代理对象是**目标类的扩展子类**，所以无法通知**final、private 的方法**，因为它们不能被覆写。是针对类实现代理，主要是为指定的类生成一个子类，覆盖其中方法在 spring 中默认情况下使用 JDK 动态代理实现 AOP，如果**proxy-target-class**设置为 true 或者使用了优化策略那么会使用 CGLIB 来创建动态代理 Spring AOP 在这两种方式的实现上基本一样。JDK 代理中，会使用**JdkDynamicAopProxy**来创建代理，在**invoke()**方法首先需要织入到当前类的增强器封装到**拦截器链**中，然后递归的调用这些拦截器完成功能的织入，最终返回代理对象

### todo CgLib 和 jdk 动态代理什么区别

如上所述

## 启动相关

### Spring 容器启动流程

1. 在创建 Spring 容器，也就是启动 Spring 时，首先会进行扫描，扫描得到所有的**BeanDefinition**对象，并存在一个 Map 中
2. 然后筛选出**非懒加载的单例 BeanDefinition**进行创建 Bean；对于多例 Bean 不需要在启动过程中去进行创建，对于多例 Bean 会在每次获取 Bean 时利用**BeanDefinition**去通过 new 创建
3. 利用**BeanDefinition**创建 Bean 就是 Bean 的创建生命周期，这期间包括了合并**BeanDefinition**、推断构造方法、实例化、属性填充、初始化前、初始化、初始化后等步骤，其中 AOP 就是发生在初始化后这一步骤中
4. 单例 Bean 创建完了之后，Spring 会发布一个容器启动事件，Spring 启动结束

可以归纳为三个步骤：

1. 初始化 Spring 容器，注册内置的 **BeanPostProcessor** 的 **BeanDefinition** 到容器中
2. 将配置类的 **BeanDefinition** 注册到容器中
3. 调用 **refresh()** 方法刷新容器

## 事务相关

### Spring 事务实现方式

-   编程式事务管理：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护
-   声明式事务管理：将事务管理和业务代码分离。只需要通过**注解或者 XML 配置**管理事务

### Spring 框架的事务管理有哪些优点

-   为不同的事务 API（如 JTA, JDBC, Hibernate, JPA, 和 JDO）提供了统一的编程模型
-   为编程式事务管理提供了一个简单的 API
-   支持声明式事务管理
-   可以和 Spring 的多种数据访问技术很好的兼容

### Spring 事务定义的传播规则 todo

-   **PROPAGATION_REQUIRED：**支持当前事务，如果当前没有事务，就新建一个事务
-   **PROPAGATION_SUPPORTS：**支持当前事务，如果当前没有事务，就以非事务方式执行
-   **PROPAGATION_MANDATORY：**支持当前事务，如果当前没有事务，就抛出异常
-   **PROPAGATION_REQUIRES_NEW：**新建事务，如果当前存在事务，把当前事务挂起
-   **PROPAGATION_NOT_SUPPORTED：**以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
-   **PROPAGATION_NEVER：**以非事务方式执行，如果当前存在事务，则抛出异常
-   **PROPAGATION_NESTED：**如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，就新建一个事务

### Spring 事务底层原理

-   **划分处理单元 IoC**

-   -   Spring 是**对单个数据库进行局部事务处理**的，具体的实现首先用 IoC 划分了事务处理单元，并且将事务的各种配置放到了 ioc 容器中（设置事务管理器，设置事务的传播特性及隔离机制）

-   **AOP 拦截需要进行事务处理的类**

-   -   Spring 事务处理模块是通过 AOP 功能来实现声明式事务处理的具体操作（比如事务实行的配置和读取，事务对象的抽象），用**TransactionProxyFactoryBean**接口来使用 AOP 功能，生成**Proxy 代理对象**，再通过**TransactionInterceptor**完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取 IoC 容器事务配置属性，转化为 Spring 事务处理需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为**TransactionAttribute**表示的数据对象

-   对事务处理实现（事务的生成、提交、回滚、挂起）

-   -   Spring 委托给具体的事务处理器实现，实现了一个抽象和适配。适配的具体事务处理器：DataSource 数据源支持、hibernate 数据源事务处理支持、JDO 数据源事务处理支持、JPA、JTA 数据源事务处理支持。这些支持都是通过设计**PlatformTransactionManager、AbstractPlatforTransaction**一系列事务处理的支持，为常用数据源支持提供了一系列的 TransactionManager

-   结合

-   -   **PlatformTransactionManager**实现了**TransactionInterception 接口**，让其与**TransactionProxyFactoryBean**结合起来，形成一个 Spring 声明式事务处理的设计体系

### Spring 事务大致步骤

Spring 事务底层是基于**数据库事务**和**AOP 机制**的

1. 首先对于使用了**@Transactional**注解的 Bean， Spring 会创建一个代理对象作为 Bean
2. 当调用**代理对象的方法**时，会先判断该方法上是否加了@Transactional 注解
3. 如果加了，那么则利用**事务管理器**创建一个数据库连接
4. 并且**修改数据库**连接的**autocommit**属性（自动提交事务）为**false**，禁止此连接的自动提交
5. 然后执行当前方法，方法中会执行 SQL
6. 执行完当前方法后，如果没有出现异常就直接提交事务
7. 如果出现了异常，并且这个异常是需要回滚的就会回滚事务，否则仍然提交事务
8. Spring 事务的**隔离级别默认**对应的就是**数据库的隔离级别**
9. Spring 事务的传播机制是**基于数据库连接**来做的，一个数据库连接一个事务，如果传播机制配置为需要新开一个事务，那么实际上就是先建立一个数据库连接，在此新数据库连接上执行 sql

### Spring 事务隔离级别

-   **DEFAULT**：默认对应数据库的隔离级别
-   **READ_UNCOMMITTED**：读未提交
-   **READ_COMMITTED**：读已提交
-   **REPEATABLE_READ**：可重复读
-   **SERIALIZABLE**：串行化

### Spring 事务失效的情况 todo

1. 普通对象调用方法，即类中的非事务方法通过 this.xxx() 调用，事务是不生效的，只有代理对象调用才行，解决办法：

1.  1. 注入自己，通过注入的对象来调用；
    2. 使用@EnableAspectJAutoProxy(exposeProxy = true) + AopContext.currentProxy()

1. 业务方法为非 public 方法，因为**Cglib 动态代理**是基于父子类来实现的，Spring 事务默认生效的方法权限都必须为 public，解决办法：

1.  1. 将方法改为 public
    2. 修改 TansactionAttributeSource，将 publicMethodsOnly 改为 false
    3. 使用 AspectJ 代理模式替换 Cglib 动态代理

1. 因为**Cglib 动态代理**是基于父子类来实现的，子类是不能重载父类的**private**方法，所以类中的方法是**private**的则代理类不能重载，及**@Transaction**会失效
1. 方法用 final、static 修饰
1. service 类没有托管给 Spring，即没有加 @Service 或 @Component，解决办法：

1.  1. 将 service 注入 spring

1. 抛出受检异常，Spring 默认只会回滚非检查异常和 error 异常，解决办法：

1.  1. 配置 rollbackFor

1. 业务代码中将异常捕获后没有原样抛出异常，解决办法：

1.  1. 原样抛出异常
    2. 设置 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

1. 使用其他切面，并在切面代码中捕获了异常没有原样抛出异常，Spring 事务的切面优先级是最低的，所以其他切面捕获异常后 Spring 事务是无感知的，解决办法：

1.  1. 在切面中原样抛出异常
    2. 在切面中设置 TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

1. 多线程调用，因为 Spring 的事务是通过数据库连接来实现，而数据库连接 Spring 是放在 threadLocal 里面。同一个事务，只能用同一个数据库连接。而多线程场景下，拿到的数据库连接是不一样的，即是属于不同事务
1. 错误的传播行为 @Transactional(propagation = Propagation.NOT_SUPPORTED)
1. 使用了不支持事务的存储引擎，如 mysql 的 MyISAM
1. 数据源没有配置事务管理器
1. 被代理的类过早实例化，当代理类的实例化早于 AbstractAutoProxyCreator 后置处理器，就无法被 AbstractAutoProxyCreator 后置处理器增强

```java
@Service
public class TranInvalidCaseInstantiatedTooEarly implements BeanPostProcessor , Ordered {

    @Autowired
    private UserService userService;


    @Transactional
    public boolean save(User user) {
        boolean isSuccess = userService.save(user);
        try {
            int i = 1 % 0;
        } catch (Exception e) {
            throw new RuntimeException();
        }
        return isSuccess;
    }

    @Override
    public int getOrder() {
        return 1;
    }
}
```

### todo Spring 的事务是如何回滚的?

### spring 的事务管理是如何实现的？ todo

​ 总：spring 的事务是由 aop 来实现的，首先要生成具体的代理对象，然后按照 aop 的整套流程来执行具体的操作逻辑，正常情况下要通过通知来完成核心功能，但是事务不是通过通知来实现的，而是通过一个 TransactionInterceptor 来实现的，然后调用 invoke 来实现具体的逻辑

​ 分：1、先做准备工作，解析各个方法上事务相关的属性，根据具体的属性来判断是否开始新事务

​ 2、当需要开启的时候，获取数据库连接，关闭自动提交功能，开起事务

​ 3、执行具体的 sql 逻辑操作

​ 4、在操作过程中，如果执行失败了，那么会通过 completeTransactionAfterThrowing 看来完成事务的回滚操作，回滚的具体逻辑是通过 doRollBack 方法来实现的，实现的时候也是要先获取连接对象，通过连接对象来回滚

​ 5、如果执行过程中，没有任何意外情况的发生，那么通过 commitTransactionAfterReturning 来完成事务的提交操作，提交的具体逻辑是通过 doCommit 方法来实现的，实现的时候也是要获取连接，通过连接对象来提交

​ 6、当事务执行完毕之后需要清除相关的事务信息 cleanupTransactionInfo

如果想要聊的更加细致的话，需要知道 TransactionInfo,TransactionStatus,

### **如何自定义注解实现功能**

1. 创建自定义注解和创建一个接口相似，但是注解的 interface 关键字需要以@符号开头。
2. 注解方法不能带有参数；
3. 注解方法返回值类型限定为：基本类型、String、Enums、Annotation 或者是这些类型的数组；
4. 注解方法可以有默认值；
5. 注解本身能够包含元注解，元注解被用来注解其它注解。

## 其他

### Resource 是如何被查找、加载的

Resource 接口是 Spring 资源访问策略的抽象，它本身并不提供任何资源访问实现，具体的资源访问由该接口的实现类完成——每个实现类代表一种资源访问策略。 Spring 为 Resource 接口提供了如下实现类：

-   UrlResource：访问网络资源的实现类。
-   ClassPathResource：访问类加载路径里资源的实现类。
-   FileSystemResource：访问文件系统里资源的实现类。
-   ServletContextResource：访问相对于 ServletContext 路径里的资源的实现类：
-   InputStreamResource：访问输入流资源的实现类。
-   ByteArrayResource：访问字节数组资源的实现类。 这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。
