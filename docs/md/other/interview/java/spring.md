# Spring

## 基础相关

### 什么是Spring

Spring是一个开源的Java EE开发框架

Spring的核心功能可以应用在任何Java应用程序中，但对Java EE平台上的Web应用程序有更好的扩展性

Spring的目标是使得Java EE应用程序的开发更加简捷



### Spring有哪些优点

+ 轻量级：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB
+ 控制反转(IOC)：使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象
+ 面向切面编程(AOP)：支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来
+ 容器：Spring包含并管理应用程序对象的配置及生命周期
+ MVC框架：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架
+ 事务管理：Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口
+ 异常处理：Spring提供一个方便的API将特定的异常(由JDBC, Hibernate抛出)转化为一致的、Unchecked异常



### Spring中用到的设计模式

+ 单例模式：bean默认都是单例的
+ 原型模式：指定作用域为prototype
+ 工厂模式：BeanFactory
+ 模板方法：postProcessBeanFactory、onRefresh、initPropertyValue
+ 策略模式：XmlBeanDefinitionReader、PropertiesBeanDefinitionReader
+ 观察者模式：listener、event、multicast
+ 适配器模式：Adapter
+ 装饰者模式：BeanWrapper
+ 责任链模式：使用aop的时候会先生成一个拦截器链
+ 代理模式：动态代理
+ 委托者模式：delegate
+ ...



## Bean 相关

### BeanFactory和ApplicationContext的区别

**ApplicationContext**

Spring容器就是`ApplicationContext`，它是一个接口，有很多实现类

`ClassPathXmlApplicationContext`，表示它会自动从`classpath`中查找指定的XML配置文件的Spring容器

获得了`ApplicationContext`的实例，就获得了`IoC容器的引用`

可以根据Bean的ID获取Bean，也可以根据Bean的类型获取Bean的引用

```java
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = context.getBean(UserService.class);
```



**BeanFactory**

Spring还提供另一种`IoC容器`叫`BeanFactory`，使用方式和`ApplicationContext`类似

```java
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("application.xml"));
MailService mailService = factory.getBean(MailService.class);
```



**区别**

`BeanFactory`和`ApplicationContext`的区别

+ `BeanFactory`的实现是按需创建，即第一次获取Bean时才创建这个Bean

+ `ApplicationContext`会一次性创建所有的Bean

实际上，`ApplicationContext`接口是从`BeanFactory`接口继承而来的，并且，`ApplicationContext`提供了一些额外的功能，包括国际化支持、事件和通知机制等。通常情况下，使用`ApplicationContext`，很少会考虑使用`BeanFactory`。 



### Bean Factory与FactoryBean有什么区别

+ 相同点：都是用来创建bean对象的
+ 不同点：使用BeanFactory创建对象的时候，必须要遵循严格的生命周期流程，如果想要简单的自定义某个对象的创建，同时创建完成的对象想交给Spring来管理，那么需要实现FactroyBean接口



### 什么是Spring Beans

Spring Beans是构成Spring应用核心的Java对象

这些对象由Spring IOC容器实例化、组装、管理。这些对象通过容器中配置的元数据创建，例如，使用XML文件中定义的创建

在Spring中创建的beans默认都是单例的beans



### Spring Bean线程安全吗

+ Spring本身并没有针对Bean做线程安全的处理，所以：
  1. 如果Bean是无状态的，那么Bean则是线程安全的
  2. 如果Bean是有状态的，那么Bean则不是线程安全的

+ Bean是不是线程安全，跟Bean的作用域（单例、多例）没有关系，Bean的作用域只是表示Bean的生命周期范围，对于任何生命周期的Bean都是一个对象，这个对象是不是线程安全的，还是得看这个Bean对象本身



### Spring中支持的bean作用域

- `singleton`：在Spring IOC容器中仅存在一个Bean实例，Bean以单实例的方式存在
- `prototype`：一个bean可以定义多个实例
- `request`：每次HTTP请求都会创建一个新的Bean，仅适用于`WebApplicationContext`环境
- `session`：一个HTTP Session定义一个Bean，仅适用于`WebApplicationContext`环境
- `globalSession`：同一个全局HTTP Session定义一个Bean，仅适用于`WebApplicationContext`环境

默认的 scope 属性是 singleton



### Spring 的单例实现原理

Spring框架对单例的支持是采用**单例注册表**的方式进行实现的，而这个注册表的缓存是HashMap对象

如果配置文件中的配置信息不要求使用单例，Spring会采用新建实例的方式返回对象实例



### Bean的生命周期

ApplicationContext容器中，Bean的生命周期流程大致如下：

![Spring框架中bean的生命周期](https://static.bookstack.cn/projects/java_interview_manual/images/687474703a2f2f7374617469632e7a7962756c756f2e636f6d2f686f6d6973732f75726e75686337656271356a343831656b617875787067652f696d6167655f31626e35326663733376756f31767376316566617171636e31736d2e706e67.png)



1. 首先容器启动后，会对 **scope** 为 **singleton** 且**非懒加载**的 bean 进行实例化

2. 按照 Bean 定义信息配置信息，注入所有的属性

3. 如果 Bean 实现了 **BeanNameAware** 接口，会回调该接口的 **setBeanName()** 方法，传入该 Bean 的 id，该 Bean 就获得了自己在配置文件中的 id

   如果 Bean 实现了 **BeanFactoryAware** 接口，会回调该接口的 **setBeanFactory()** 方法，传入该 Bean 的 BeanFactory，该 Bean 就获得了自己所在的 BeanFactory

   如果 Bean 实现了 **ApplicationContextAware** 接口，会回调该接口的 **setApplicationContext()** 方法，传入该 Bean 的 ApplicationContext，该 Bean 就获得了自己所在的 ApplicationContext

4. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessBeforeInitialzation()** 方法

5. 如果 Bean 实现了 **InitializingBean** 接口，则会回调该接口的 **afterPropertiesSet()** 方法

6. 如果 Bean 配置了 **init-method** 方法，则会执行 **init-method** 配置的方法

7. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessAfterInitialization()**方法

8. 经过各个流程之后，就可以正式使用该 Bean 了，对于 scope 为 singleton 的 Bean，Spring 的 ioc 容器中会缓存一份该 bean 的实例，而对于 scope 为 prototype 的 Bean，每次被调用都会new一个新的对象，期生命周期就交给调用方管理不再是Spring容器进行管理

9. 容器关闭后，如果 Bean 实现了 **DisposableBean** 接口，则会回调该接口的 **destroy()** 方法

10. 如果 Bean 配置了 **destroy-method** 方法，则会执行 **destroy-method** 配置的方法，至此，整个 Bean 的生命周期结束



### Bean创建的生命周期

创建`bean`大致步骤：

1. 推断构造方法
2. 实例化
3. 填充属性，及依赖注入
4. 处理`aware`回调
5. 初始化前，处理`@PostConstruct`注解
6. 初始化，处理`Initialization`接口
7. 初始化后，进行`aop`



## IoC 相关

### Spring IoC容器是什么

Spring IOC负责创建、管理(通过依赖注入)、整合、配置对象以及管理这些对象的生命周期



### IoC有什么优点

+ 减少了代码量
+ 使得程序的测试简单，因为在单元测试中不再需要单例或JNDI查找机制
+ 松耦合
+ 支持勤性单例及延迟加载服务



### 推荐哪种依赖注入

可以同时使用两种方式的依赖注入，最好使用构造器参数实现强制依赖注入，使用setter方法实现可选的依赖关系



### todo Spring IOC的理解，原理与实现

工厂 + 反射



+ 控制反转：理论思想，原来的对象是由使用者来进行控制，有了spring之后，可以把整个对象交给spring来帮我们进行管理
+ DI：依赖注入，把对应的属性的值注入到具体的对象中，@Autowired，populateBean完成属性值的注入
+ 容器：存储对象，使用map结构来存储，在spring中一般存在三级缓存，singletonObjects存放完整的bean对象，整个bean的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean的生命周期）



1、一般要涉及到容器的创建过程（beanFactory,DefaultListableBeanFactory）,向bean工厂中设置一些参数（BeanPostProcessor,Aware接口的子类）等等属性

2、加载解析bean对象，准备要创建的bean对象的定义对象beanDefinition,(xml或者注解的解析过程)

3、beanFactoryPostProcessor的处理，此处是扩展点，PlaceHolderConfigurSupport,ConfigurationClassPostProcessor

4、BeanPostProcessor的注册功能，方便后续对bean对象完成具体的扩展功能

5、通过反射的方式讲BeanDefinition对象实例化成具体的bean对象，

6、bean对象的初始化过程（填充属性，调用aware子类的方法，调用BeanPostProcessor前置处理方法，调用init-mehtod方法，调用BeanPostProcessor的后置处理方法）

7、生成完整的bean对象，通过getBean方法可以直接获取

8、销毁过程



### 依赖注入是什么

依赖注入作为控制反转(IOC)的一个层面，可以有多种解释方式

在这个概念中，不用创建对象而只需要描述如何创建它们。不必通过代码直接的将组件和服务连接在一起，而是通过配置文件说明哪些组件需要什么服务，之后IOC容器负责衔接



### 有哪些不同类型的依赖注入

+ 构造器依赖注入

  构造器依赖注入在容器触发构造器的时候完成，该构造器有一系列的参数，每个参数代表注入的对象

+ Setter方法依赖注入

  首先容器会触发一个无参构造函数或无参静态工厂方法实例化对象，之后容器调用bean中的setter方法完成Setter方法依赖注入



### 自动装配的各种模式

自动装配提供五种不同的模式供Spring容器用来自动装配beans之间的依赖注入:

+ no：默认的方式是不进行自动装配，通过手工设置ref 属性来进行装配bean
+ byName：通过参数名自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byName。之后容器试图匹配、装配和该bean的属性具有相同名字的bean
+ byType：通过参数的数据类型自动自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byType。之后容器试图匹配和装配和该bean的属性类型一样的bean。如果有多个bean符合条件，则抛出错误
+ constructor：这个同byType类似，不过是应用于构造函数的参数。如果在BeanFactory中不是恰好有一个bean与构造函数参数相同类型，则抛出一个严重的错误
+ autodetect：如果有默认的构造方法，通过 construct的方式自动装配，否则使用 byType的方式自动装配



### Spring 是如何解决循环依赖的问题的

循环依赖问题：A依赖B，B依赖A，形成闭环

三级缓存，提前暴露对象，AOP



先说明bean的创建过程：实例化，初始化（填充属性）

1. 先创建A对象，实例化A对象，此时A对象中的b属性为空，填充属性b
2. 从容器中查找B对象，如果找到了，直接赋值不存在循环依赖问题（不通），找不到直接创建B对象
3. 实例化B对象，此时B对象中的a属性为空，填充属性a
4. 从容器中查找A对象，找不到，直接创建



此时，会发现A对象是存在的，只不过此时的A对象不是一个完整的状态，只完成了实例化但是未完成初始化

如果在程序调用过程中，拥有了某个对象的引用，能否在后期给他完成赋值操作，可以优先把非完整状态的对象优先赋值，等待后续操作来完成赋值

相当于**提前暴露了某个不完整对象的引用**，所以解决问题的核心在于实例化和初始化分开操作，这也是解决循环依赖问题的关键



当所有的对象都完成实例化和初始化操作之后，还要把完整对象放到容器中，此时在容器中存在对象的几个状态，完成实例化但未完成初始化，完整状态，因为都在容器中，所以要使用不同的map结构来进行存储，此时就有了一级缓存和二级缓存

如果一级缓存中有了，那么二级缓存中就不会存在同名的对象，因为他们的查找顺序是1，2，3这样的方式来查找的

**一级缓存中放的是完整对象，二级缓存中放的是非完整对象**

**三级缓存的value类型是ObjectFactory**，是一个函数式接口，存在的意义是保证在整个容器的运行过程中同名的bean对象只能有一个



**代理**

+ 如果一个对象需要被代理，或者说需要生成代理对象，那么要不要优先生成一个普通对象？要
+ 普通对象和代理对象是**不能同时出现在容器中**的
+ 当对象需要被代理的时候，就要使用代理对象**覆盖掉**之前的普通对象
+ 在实际的调用过程中，是没有办法确定什么时候对象被使用，所以就要求当某个对象被调用的时候，**优先判断此对象是否需要被代理**，类似于一种回调机制的实现，因此传入lambda表达式的时候，可通过lambda表达式来执行对象的覆盖过程，**getEarlyBeanReference()**
+ 因此，所有的bean对象在创建的时候都要优先放到三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，如果不需要被代理，则直接返回普通对象



### 缓存的放置时间和删除时间

+ 三级缓存：createBeanInstance之后；addSingletonFactory
+ 二级缓存：第一次从三级缓存确定对象是代理对象还是普通对象的时候，同时删除三级缓存；getSingleton
+ 一级缓存：生成完整对象之后放到一级缓存，删除二三级缓存；addSingleton



## AOP 相关

### 解释AOP模块

+ AOP模块用来开发Spring应用程序中具有切面性质的部分
+ 该模块的大部分服务由AOP Aliance提供，这就保证了Spring框架和其他AOP框架之间的互操作性
+ 该模块将元数据编程引入到了Spring



### 面向切面编程(AOP)

+ 面向切面编程（AOP）

  允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理和事务管理

+ 切面（Aspect） 

  AOP的核心就是切面，它将多个类的通用行为封装为可重用的模块。该模块含有一组API提供 cross-cutting 功能。根据需求的不同，一个应用程序可以有若干切面。在Spring AOP中，切面通过带有 @Aspect 注解的类实现

+ 通知（Advice）

  通知表示在方法执行前后需要执行的动作。实际上它是Spring AOP框架在程序执行过程中触发的一些代码。Spring切面可以执行一下五种类型的通知

  + before(前置通知)：在一个方法之前执行的通知
  + after(最终通知)：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）
  + after-returning(后置通知)：在某连接点正常完成后执行的通知
  + after-throwing(异常通知)：在方法抛出异常退出时执行的通知
  + around(环绕通知)：在方法调用前后触发的通知

- 切入点（Pointcut）

  切入点是一个或一组连接点，通知将在这些位置执行。可以通过表达式或匹配的方式指明切入点

- 引入

  引入允许我们在已有的类上添加新的方法或属性

- 目标对象

  被一个或者多个切面所通知的对象。它通常是一个代理对象。也被称做被通知（advised）对象

- 代理

  代理是将通知应用到目标对象后创建的对象。从客户端的角度看，代理对象和目标对象是一样的。有以下几种代理

  + BeanNameAutoProxyCreator：bean名称自动代理创建器
  + DefaultAdvisorAutoProxyCreator：默认通知者自动代理创建器
  + Metadata autoproxying：元数据自动代理

- 织入

  将切面和其他应用类型或对象连接起来创建一个通知对象的过程。织入可以在编译、加载或运行时完成



### Spring AOP 实现原理

实现AOP的技术，主要分为两大类：

- 动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行
- 静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码



Spring AOP 的实现原理其实很简单

AOP 框架负责动态地生成 AOP 代理类，这个代理类的方法则由 Advice 和回调目标对象的方法所组成，并将该对象可作为目标对象使用

AOP 代理包含了目标对象的全部方法，但AOP代理中的方法与目标对象的方法存在差异，AOP方法在特定切入点添加了增强处理，并回调了目标对象的方法



动态代理技术在运行期织入增强代码，使用两种代理机制：基于JDK的动态代理（JDK本身只提供接口的代理）和基于CGlib的动态代理。

- JDK的动态代理

  JDK的动态代理主要涉及 **java.lang.reflect** 包中的两个类：**Proxy** 和 **InvocationHandler**

  **InvocationHandler** 只是一个接口，可以通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态的将横切逻辑与业务逻辑织在一起。而 **Proxy** 利用 **InvocationHandler** 动态创建一个符合某一接口的实例，生成目标类的代理对象

  其代理对象**必须是某个接口的实现**，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理，只能实现接口的类生成代理，而不能针对类

- CGLib

  CGLib采用**底层的字节码技术**，为一个类**创建子类**，并在子类中采用方法拦截的技术拦截所有父类的调用方法，并顺势织入横切逻辑

  它运行期间生成的代理对象是**目标类的扩展子类**，所以无法通知**final、private的方法**，因为它们不能被覆写。是针对类实现代理，主要是为指定的类生成一个子类，覆盖其中方法

  在spring中默认情况下使用JDK动态代理实现AOP，如果**proxy-target-class**设置为true或者使用了优化策略那么会使用CGLIB来创建动态代理

  

  Spring AOP在这两种方式的实现上基本一样。JDK代理中，会使用**JdkDynamicAopProxy**来创建代理，在**invoke()**方法首先需要织入到当前类的增强器封装到**拦截器链**中，然后递归的调用这些拦截器完成功能的织入，最终返回代理对象



### todo CgLib和jdk动态代理什么区别

如上所述



## 启动相关

### Spring容器启动流程

1. 在创建Spring容器，也就是启动Spring时，首先会进行扫描，扫描得到所有的**BeanDefinition**对象，并存在一个Map中
2. 然后筛选出**非懒加载的单例BeanDefinition**进行创建Bean；对于多例Bean不需要在启动过程中去进行创建，对于多例Bean会在每次获取Bean时利用**BeanDefinition**去通过new创建
3. 利用**BeanDefinition**创建Bean就是Bean的创建生命周期，这期间包括了合并**BeanDefinition**、推断构造方法、实例化、属性填充、初始化前、初始化、初始化后等步骤，其中AOP就是发生在初始化后这一步骤中
4. 单例Bean创建完了之后， Spring会发布一个容器启动事件，Spring启动结束



可以归纳为三个步骤：

- 1、初始化 Spring 容器，注册内置的 **BeanPostProcessor** 的 **BeanDefinition** 到容器中
- 2、将配置类的 **BeanDefinition** 注册到容器中
- 3、调用 **refresh()** 方法刷新容器



## 事务相关

### Spring 事务实现方式

- 编程式事务管理：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护
- 声明式事务管理：将事务管理和业务代码分离。只需要通过**注解或者XML配置**管理事务



### Spring框架的事务管理有哪些优点

- 为不同的事务API（如JTA, JDBC, Hibernate, JPA, 和JDO）提供了统一的编程模型
- 为编程式事务管理提供了一个简单的API
- 支持声明式事务管理
- 可以和Spring 的多种数据访问技术很好的兼容



### spring事务定义的传播规则

- PROPAGATION_REQUIRED：支持当前事务，如果当前没有事务，就新建一个事务
- PROPAGATION_SUPPORTS：支持当前事务，如果当前没有事务，就以非事务方式执行
- PROPAGATION_MANDATORY：支持当前事务，如果当前没有事务，就抛出异常
- PROPAGATION_REQUIRES_NEW：新建事务，如果当前存在事务，把当前事务挂起
- PROPAGATION_NOT_SUPPORTED：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
- PROPAGATION_NEVER：以非事务方式执行，如果当前存在事务，则抛出异常
- PROPAGATION_NESTED：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，就新建一个事务



### Spring 事务底层原理

- 划分处理单元——IoC

  由于spring解决的问题是**对单个数据库进行局部事务处理**的

  首先用spring中的IoC划分了**事务处理单元**，并且将对事务的各种配置放到了ioc容器中（设置事务管理器，设置事务的传播特性及隔离机制）

- AOP拦截需要进行事务处理的类

  Spring事务处理模块是通过AOP功能来实现声明式事务处理的

  具体操作（比如事务实行的配置和读取，事务对象的抽象），用**TransactionProxyFactoryBean**接口来使用AOP功能，生成**Proxy代理对象**，通过**TransactionInterceptor**完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取IoC容器事务配置属性，转化为Spring事务处理需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为**TransactionAttribute**表示的数据对象

- 对事务处理实现（事务的生成、提交、回滚、挂起）

  Spring委托给具体的事务处理器实现，实现了一个抽象和适配。

  适配的具体事务处理器：DataSource数据源支持、hibernate数据源事务处理支持、JDO数据源事务处理支持、JPA、JTA数据源事务处理支持。

  这些支持都是通过设计**PlatformTransactionManager、AbstractPlatforTransaction**一系列事务处理的支持，为常用数据源支持提供了一系列的TransactionManager

- 结合

  **PlatformTransactionManager**实现了**TransactionInterception接口**，让其与**TransactionProxyFactoryBean**结合起来，形成一个Spring声明式事务处理的设计体系



大致步骤：

Spring事务底层是基于**数据库事务**和**AOP机制**的

2. 首先对于使用了**@Transactional**注解的Bean， Spring会创建一个代理对象作为Bean
3. 当调用**代理对象的方法**时，会先判断该方法上是否加了@Transactional注解
4. 如果加了，那么则利用**事务管理器**创建一个数据库连接
5. 并且**修改数据库**连接的**autocommit**属性为**false**，禁止此连接的自动提交
6. 然后执行当前方法，方法中会执行SQL
7. 执行完当前方法后，如果没有出现异常就直接提交事务
8. 如果出现了异常，并且这个异常是需要回滚的就会回滚事务，否则仍然提交事务
9. Spring事务的**隔离级别默认**对应的就是**数据库的隔离级别**
11. Spring事务的传播机制是**基于数据库连接**来做的，一个数据库连接一个事务，如果传播机制配置为需要新开一个事务，那么实际上就是先建立一个数据库连接，在此新数据库连接上执行sql



### Spring 事务隔离级别

+ **DEFAULT**：默认对应
+ **READ_UNCOMMITTED**：读未提交
+ **READ_COMMITTED**：读已提交
+ **REPEATABLE_READ**：可重复读
+ **SERIALIZABLE**：串行化



### Spring事务失效的情况

1. 普通对象调方法，事务是不生效的。只有代理对象调用才行
2. 因为**Cglib动态代理**是基于父子类来实现的，子类是不能重载父类的**private**方法，所以类中的方法是**private**的则代理类不能重载，及**@Transaction**会失效

​	

### todo Spring的事务是如何回滚的?

​		spring的事务管理是如何实现的？

​		总：spring的事务是由aop来实现的，首先要生成具体的代理对象，然后按照aop的整套流程来执行具体的操作逻辑，正常情况下要通过通知来完成核心功能，但是事务不是通过通知来实现的，而是通过一个TransactionInterceptor来实现的，然后调用invoke来实现具体的逻辑

​		分：1、先做准备工作，解析各个方法上事务相关的属性，根据具体的属性来判断是否开始新事务

​				2、当需要开启的时候，获取数据库连接，关闭自动提交功能，开起事务

​				3、执行具体的sql逻辑操作

​				4、在操作过程中，如果执行失败了，那么会通过completeTransactionAfterThrowing看来完成事务的回滚操作，回滚的具体逻辑是通过doRollBack方法来实现的，实现的时候也是要先获取连接对象，通过连接对象来回滚

​				5、如果执行过程中，没有任何意外情况的发生，那么通过commitTransactionAfterReturning来完成事务的提交操作，提交的具体逻辑是通过doCommit方法来实现的，实现的时候也是要获取连接，通过连接对象来提交

​				6、当事务执行完毕之后需要清除相关的事务信息cleanupTransactionInfo

如果想要聊的更加细致的话，需要知道TransactionInfo,TransactionStatus,



### **Spring** **事务实现方式** 

\> 1、编码方式 

\> 所谓编程式事务指的是通过编码方式实现事务，即类似于JDBC编程实现事务管理。 

\> 2、声明式事务管理方式 

\> 声明式事务管理又有两种实现方式：基于xml配置文件的方式；另一个实在业务方法上进行@Transaction注解，将事务规则应用到业务逻辑中 

 

### **Spring** **事务底层原理** 

\> a、划分处理单元——IOC 

\> 由于spring解决的问题是对单个数据库进行局部事务处理的，具体的实现首相用spring 中的IOC划分了事务处理单元。并且将对事务的各种配置放到了ioc容器中（设置事务管理器，设置事务的传播特性及隔离机制）。 

\> b、AOP拦截需要进行事务处理的类 

\> Spring事务处理模块是通过AOP功能来实现声明式事务处理的，具体操作（比如事务实行的配置和读取，事务对象的抽象），用TransactionProxyFactoryBean接口来使用AOP

功能，生成proxy代理对象，通过TransactionInterceptor完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取ioc容器事务配置属性，转化为spring事务处理

需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为 TransactionAttribute表示的数据对象。 

\> c、对事物处理实现（事务的生成、提交、回滚、挂起） 

\> spring委托给具体的事务处理器实现。实现了一个抽象和适配。适配的具体事务处理器：DataSource数据源支持、hibernate数据源事务处理支持、JDO数据源事务处理支持，JPA、JTA数据源事务处理支持。这些支持都是通过设计

PlatformTransactionManager、AbstractPlatforTransaction一系列事务处理的支持。 为常用数据源支持提供了一系列的TransactionManager。 

\> d、结合 

\> PlatformTransactionManager实现了TransactionInterception接口，让其与

TransactionProxyFactoryBean结合起来，形成一个Spring声明式事务处理的设计体系。 

 

### **如何自定义注解实现功能** 

\> 创建自定义注解和创建一个接口相似，但是注解的interface关键字需要以@符号开头。 

\> 注解方法不能带有参数； 

\> 注解方法返回值类型限定为：基本类型、String、Enums、Annotation或者是这些类型的数组； 

\> 注解方法可以有默认值； 

\> 注解本身能够包含元注解，元注解被用来注解其它注解。 



## 其他

### Resource 是如何被查找、加载的

Resource 接口是 Spring 资源访问策略的抽象，它本身并不提供任何资源访问实现，具体的资源访问由该接口的实现类完成——每个实现类代表一种资源访问策略。 Spring 为 Resource 接口提供了如下实现类：

- UrlResource：访问网络资源的实现类。
- ClassPathResource：访问类加载路径里资源的实现类。
- FileSystemResource：访问文件系统里资源的实现类。
- ServletContextResource：访问相对于 ServletContext 路径里的资源的实现类：
- InputStreamResource：访问输入流资源的实现类。
- ByteArrayResource：访问字节数组资源的实现类。 这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。



# Spring MVC

## 启动相关

### Spring MVC 运行流程

1. 发起请求到`前端控制器DispatcherServle`
2. 前端控制器请求`HandlerMapping`查找`Handler`（ 可以根据xml配置、注解进行查找），并向前端控制器返回`Handler`
3. 前端控制器调用`处理器适配器HandlerAdaptor`去执行`Handler`
4. `Handler`执行完成给处理器适配器`HandlerAdaptor`返回`ModelAndView`
5. 处理器适配器向前端控制器返回ModelAndView（ModelAndView是springmvc框架的一个底层对象，包括Model和view）
6. 前端控制器请求视图解析器`ViewReslover`去进行视图解析
7. 视图解析器向前端控制器返回View
8. `前端控制器DispatcherServle`进行视图渲染（ 视图渲染将模型数据(在ModelAndView对象中)填充到request域）
9. `前端控制器DispatcherServle`向用户响应结果



1．用户发送请求至前端控制器DispatcherServlet。

2．DispatcherServlet收到请求调用 HandlerMapping 处理器映射器。

3．处理器映射器找到具体的处理器（可以根据xml配置、注解进行查找），生成处理器及处理器拦截器（如果有则生成）—并返回给DispatcherServlet。

4．DispatcherServlet 调用HandlerAdapter 处理器适配器。

5．HandlerAdapter经过适配调用具体的处理器（Controller，也叫后端控制器）

6．Controller 执行完成返回 ModelAndView。

7．HandlerAdapter 将 controller执行结果 ModelAndView 返回给 DispatcherServlet。

8．DispatcherServlet将 ModelAndView 传给ViewReslover 视图解析器。

9．ViewReslover 解析后返回具体View。

10．DispatcherServlet 根据View 进行渲染视图（即将模型数据填充至视图中）。

11．DispatcherServlet 响应用户。



### Spring MVC 启动流程

\> 在 web.xml 文件中给 Spring MVC 的 Servlet 配置了 load-on-startup,所以程序启动的 > 时候会初始化 Spring MVC，在 HttpServletBean 中将配置的 contextConfigLocation 

\> 属性设置到 Servlet 中，然后在 FrameworkServlet 中创建了 WebApplicationContext, 

\> DispatcherServlet 根据 contextConfigLocation 配置的 classpath 下的 xml 文件初始化了 

\> Spring MVC 总的组件。 

 **Spring** **的单例实现原理** 

\> Spring 对 Bean 实例的创建是采用单例注册表的方式进行实现的，而这个注册表的缓存是

ConcurrentHashMap 对象。 

**Spring** **框架中用到了哪些设计模式** 

\> 代理模式—在AOP和remoting中被用的比较多。 

\> 单例模式—在spring配置文件中定义的bean默认为单例模式。 > 模板方法—用来解决代码重复的问题。比如. RestTemplate, JmsTemplate, 

JpaTemplate。 

\> 前端控制器—Spring提供了DispatcherServlet来对请求进行分发。 

\> 视图帮助(View Helper )—Spring提供了一系列的JSP标签，高效宏来辅助将分散的代码整合在视图里。 

\> 依赖注入—贯穿于BeanFactory / ApplicationContext接口的核心理念。 

\> 工厂模式—BeanFactory用来创建对象的实例。 

















































### 1、什么是 SpringMvc？ 

答：SpringMvc 是 spring 的一个模块，基于 MVC 的一个框架，无需中间整合层来整合。 

### 2、Spring MVC 的优点：答： 

1）它是基于组件技术的.全部的应用对象,无论控制器和视图,还是业务对象之类的都是 java 组件.并且和 Spring 提供的其他基础结构紧密集成.  

2）不依赖于 Servlet API(目标虽是如此,但是在实现的时候确实是依赖于 Servlet 的)  

3）可以任意使用各种视图技术,而不仅仅局限于 JSP  

4）支持各种请求资源的映射策略  

5）它应是易于扩展的 

 

### 3、SpringMVC 工作原理？答： 

1）客户端发送请求到 DispatcherServlet 

2）DispatcherServlet 查询 handlerMapping 找到处理请求的 Controller  

3）Controller 调用业务逻辑后，返回 ModelAndView 

4）DispatcherServlet 查询 ModelAndView，找到指定视图  

5）视图将结果返回到客户端 

###  4、SpringMVC 流程？答：  

 1）  用户发送请求至前端控制器 DispatcherServlet。  

 2）  DispatcherServlet 收到请求调用 HandlerMapping 处理器映射器。 

 3）  处理器映射器找到具体的处理器(可以根据 xml 配置、注解进行查找)，生成处理器对象及处理器拦截器(如果有则生成)一并返回给 DispatcherServlet。   

4）  DispatcherServlet 调用 HandlerAdapter 处理器适配器。

5）  HandlerAdapter 经过适配调用具体的处理器(Controller，也叫后端控制器)。   

6）  Controller 执行完成返回 ModelAndView。   

7）  HandlerAdapter 将 controller 执行结果 ModelAndView 返回给 DispatcherServlet。   

8）  DispatcherServlet 将 ModelAndView 传给 ViewReslover 视图解析器。   

9）  ViewReslover 解析后返回具体 View。   

10）DispatcherServlet 根据 View 进行渲染视图（即将模型数据填充至视图中）。   

11）DispatcherServlet 响应用户。 

 

### 6、SpringMvc 的控制器是不是单例模式,如果是,有什么问题,怎么解决？

答：是单例模式,所以在多线程访问的时候有线程安全问题,不要用同步,会影响性能的,解决方案是在控制器里面不能写字段。 

### 7、如果你也用过 struts2.简单介绍下 springMVC 和 struts2 的区别有哪些? 

答：  

1）springmvc 的入口是一个 servlet 即前端控制器，而 struts2 入口是一个 filter 过虑器。 

2）springmvc 是基于方法开发(一个 url 对应一个方法)，请求参数传递到方法的形参，可以设计为单例或多例(建议单例)，struts2 是基于类开发，传递参数是通过类的属性，只能设计为多例。 

3）Struts 采用值栈存储请求和响应的数据，通过 OGNL 存取数据，springmvc 通过参数解析器是将 request 请求内容解析，并给方法形参赋值，将数据和视图封装成 ModelAndView 对象，最后又将 ModelAndView 中的模型数据通过 reques 域传输到页面。Jsp 视图解析器默认使用 jstl。 

 

### 8、  SpingMvc 中的控制器的注解一般用那个,有没有别的注解可以替代？

答：一般用@Conntroller 注解,表示是表现层,不能用用别的注解代替。 

### 9、  @RequestMapping 注解用在类上面有什么作用？ 

答：是一个用来处理请求地址映射的注解，可用于类或方法上。用于类上，表示类中的所有响应请求的方法都是以该地址作为父路径。 

### 10、怎么样把某个请求映射到特定的方法上面？

答：直接在方法上面加上注解@RequestMapping,并且在这个注解里面写上要拦截的路径 

### 11、如果在拦截请求中,我想拦截 get 方式提交的方法,怎么配置？ 

答：可以在@RequestMapping 注解里面加上 method=RequestMethod.GET

### 12、怎么样在方法里面得到 Request,或者 Session？ 

答：直接在方法的形参中声明 request,SpringMvc 就自动把 request 对象传入 

### 13、我想在拦截的方法里面得到从前台传入的参数,怎么得到？

答：直接在形参里面声明这个参数就可以,但必须名字和传过来的参数一样 

### 14、如果前台有很多个参数传入,并且这些参数都是一个对象的,那么怎么样快速得到这个对象？ 

答：直接在方法中声明这个对象,SpringMvc 就自动会把属性赋值到这个对象里面。 

### 15、SpringMvc 中函数的返回值是什么？

答：返回值可以有很多类型,有 String, ModelAndView,当一般用 String 比较好。 

### 16、SpringMVC 怎么样设定重定向和转发的？

答：在返回值前面加"forward:"就可以让结果转发,譬如"forward:user.do?name=method4" 在返回值前面加"redirect:"就可以让返回值重定向,譬如"redirect:http://www.baidu.com"

### 17、SpringMvc 用什么对象从后台向前台传递数据的？ 

答：通过 ModelMap 对象,可以在这个对象里面用 put 方法,把对象加到里面,前台就可以通过 el 表达式拿到。 

### 18、SpringMvc 中有个类把视图和数据都合并的一起的,叫什么？

答：叫 ModelAndView。 

### 19、怎么样把 ModelMap 里面的数据放入 Session 里面？ 

答：可以在类上面加上@SessionAttributes 注解,里面包含的字符串就是要放入 session 里面的 key 

### 20、SpringMvc 怎么和 AJAX 相互调用的？答： 

 通过 Jackson 框架就可以把 Java 里面的对象直接转化成 Js 可以识别的 Json 对象。  

  具体步骤如下 ：  

1）加入 Jackson.jar  

2）在配置文件中配置 json 的映射   

3）在接受 Ajax 方法里面可以直接返回 Object,List 等,但方法前面要加上@ResponseBody 注解 

21、当一个方法向 AJAX 返回特殊对象,譬如 Object,List 等,需要做什么处理？答：要加上@ResponseBody 注解 22、SpringMvc 里面拦截器是怎么写的 

答：有两种写法,一种是实现接口,另外一种是继承适配器类,然后在 SpringMvc 的配置文件中配置拦截器即可：  

 

```xml
<!-- 配置 SpringMvc 的拦截器 --> 

<mvc:interceptors>    

   <!-- 配置一个拦截器的 Bean 就可以了 默认是对所有请求都拦截 -->    

   <bean id="myInterceptor" class="com.et.action.MyHandlerInterceptor"></bean>      

   <!-- 只针对部分请求拦截 -->      

   <mvc:interceptor>       

​     <mvc:mapping path="/modelMap.do" />        

​     <bean class="com.et.action.MyHandlerInterceptorAdapter" />  

   </mvc:interceptor>

</mvc:interceptors> 
```



### 23、讲下 SpringMvc 的执行流程 

答：系统启动的时候根据配置文件创建 spring 的容器, 首先是发送 http 请求到核心控制器

disPatherServlet，spring 容器通过映射器去寻找业务控制器，使用适配器找到相应的业务类，在进业务类时进行数据封装，在封装前可能会涉及到类型转换，执行完业务类后使用

ModelAndView 进行视图转发，数据放在 model 中，用 map 传递数据进行页面显示。





 







 











# Spring Boot

## 基础相关

### Spring与Spring Boot对比

**Spring:** Spring框架是最流行的Java应用程序开发框架。 Spring框架的主要功能是**依赖注入**或**控制反转**(IoC)。借助Spring Framework，我们可以开发一个**松耦合**的应用程序。如果纯粹定义应用程序类型或特征，最好使用。

**SpringBoot:** Spring Boot是Spring Framework的模块。它允许我们构建具有最少配置或零配置的独立应用程序。如果我们要开发一个简单的基于Spring的应用程序或RESTful服务，最好使用它。

Spring和Spring Boot之间的主要比较讨论如下:

| Spring                                                       | Spring Boot                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Spring Framework**是用于构建应用程序的广泛使用的Java EE框架。 | **SpringBoot Framework** 被广泛用于开发 **REST API** 。      |
| 它旨在简化Java EE开发，从而使开发人员更加高效。              | 它旨在缩短代码长度，并提供开发 **Web应用程序**的最简单方法。 |
| Spring Framework的主要功能是**依赖注入**。                   | Spring Boot的主要功能是**自动配置**。它会根据需求自动配置类。 |
| 通过允许我们开发**松耦合**应用程序，可以使事情变得更简单。   | 它有助于创建配置更少的**独立**应用。                         |
| 开发人员编写了大量代码(**模板代码**)来完成最小的任务。       | 它**减少**样板代码。                                         |
| 要测试Spring项目，我们需要显式设置服务器。                   | SpringBoot提供了**嵌入式服务器**，例如 **Jetty** 和 **Tomcat** 等。 |
| 它不支持内存数据库。                                         | 它提供了多个插件来处理嵌入式和**内存中**数据库，例如 **H2** 。 |
| 开发人员在 **pom.xml** 中为Spring项目手动定义依赖项。        | Spring Boot在pom.xml文件中带有 **starter** 概念，该概念内部负责根据Spring Boot要求下载依赖项 **JAR** 。 |



### Spring Boot与Spring MVC

**Spring Boot:** SpringBoot使得快速引导和开始开发基于Spring的过程变得容易。应用。它避免了很多样板代码。它隐藏了很多复杂的信息，因此开发人员可以快速入门并轻松开发基于Spring的应用程序。

**Spring MVC:** Spring MVC是用于以下方面的Web MVC框架: 构建Web应用程序。它包含许多用于各种功能的配置文件。这是一个面向HTTP的Web应用程序开发框架。

Spring Boot和Spring MVC出于不同的目的而存在。下面讨论了Spring Boot和Spring MVC之间的主要比较:

| SpringBoot                                                   | SpringMVC                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| **SpringBoot** 是Spring的模块，用于使用合理的默认值打包基于Spring的应用程序。 | **SpringMVC** 是Spring框架下基于模型视图控制器的Web框架。 |
| 它提供了用于构建 **Spring-powered** 框架的默认配置。         | 它提供了**易于使用**功能来构建Web应用程序。               |
| 无需手动构建配置。                                           | 它需要手动进行构建配置。                                  |
| **不需要**部署描述符。                                       | **必需**。                                                |
| 它避免了样板代码，并将依赖项包装在一个单元中。               | 它分别指定每个依赖项。                                    |
| 它**减少**开发时间并提高生产率。                             | 要花费相同的时间，要花费**更多**。                        |



### 什么是 Spring Boot？

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件一站式解决方案，主要是简化了使用 Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。

### Spring Boot 有哪些优点？

Spring Boot 主要有如下优点：

1. 容易上手，提升开发效率，为 Spring 开发提供一个更快、更广泛的入门体验。

2. 开箱即用，远离繁琐的配置。

3. 提供了一系列大型项目通用的非业务性功能，例如：内嵌服务器、安全管理、运行数据监控、运行状况检查和外部化配置等。

4. 没有代码生成，也不需要XML配置。

5. 避免大量的 Maven 导入和各种版本冲突。

### Spring Boot 的核心注解是哪个？它主要由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：

+ @SpringBootConfiguration：组合了 @Configuration 注解，实现配置文件的功能。

+ @EnableAutoConfiguration：打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能：

  @SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })

+ @ComponentScan：Spring组件扫描



## 运行 Spring Boot 有哪几种方式？

1）     打包用命令或者放到容器中运行

2）     用 Maven/ Gradle 插件运行

3）直接执行 main 方法运行



## 开启 Spring Boot 特性有哪几种方式？

1）     继承spring-boot-starter-parent项目

2）     导入spring-boot-dependencies项目依赖

## 如何使用 Spring Boot 实现异常处理？

Spring 提供了一种使用 ControllerAdvice 处理异常的非常有用的方法。 我们通过实现一个 ControlerAdvice 类，来处理控制器类抛出的所有异常。

## 如何使用 Spring Boot 实现分页和排序？

使用 Spring Boot 实现分页非常简单。使用 Spring Data-JPA 可以实现将可分页的传递给存储库方法。

微服务中如何实现 session 共享 ?

在微服务中，一个完整的项目被拆分成多个不相同的独立的服务，各个服务独立部署在不同的服务器上，各自的 session 被从物理空间上隔离开了，但是经

常，我们需要在不同微服务之间共享 session ，常见的方案就是 Spring 

Session + Redis 来实现 session 共享。将所有微服务的 session 统一保存在 Redis 上，当各个微服务对 session 有相关的读写操作时，都去操作 Redis 上的 session 。这样就实现了 session 共享，Spring Session 基于 Spring 中的代理过滤器实现，使得 session 的同步操作对开发人员而言是透明的，非常简便。

## Spring Boot 中如何实现定时任务 ?

定时任务也是一个常见的需求，Spring Boot 中对于定时任务的支持主要还是来自 Spring 框架。

在 Spring Boot 中使用定时任务主要有两种不同的方式，一个就是使用 Spring 中的 @Scheduled 注解，另一个则是使用第三方框架 Quartz。

使用 Spring 中的 @Scheduled 的方式主要通过 @Scheduled 注解来实现。

使用 Quartz ，则按照 Quartz 的方式，定义 Job 和 Trigger 即可。





## 什么是 JavaConfig？

Spring JavaConfig 是 Spring 社区的产品，它提供了配置 Spring IoC 容器的纯Java 方法。因此它有助于避免使用 XML 配置。使用 JavaConfig 的优点在于：

（1）  面向对象的配置。由于配置被定义为 JavaConfig 中的类，因此用户可以

充分利用 Java 中的面向对象功能。一个配置类可以继承另一个，重写它的

@Bean 方法等。

（2）  减少或消除 XML 配置。基于依赖注入原则的外化配置的好处已被证明。

但是，许多开发人员不希望在 XML 和 Java 之间来回切换。JavaConfig 为开发人员提供了一种纯 Java 方法来配置与 XML 配置概念相似的 Spring 容器。从

技术角度来讲，只使用 JavaConfig 配置类来配置容器是可行的，但实际上很多人认为将JavaConfig 与 XML 混合匹配是理想的。（3）类型安全和重构友好。JavaConfig 提供了一种类型安全的方法来配置 

Spring容器。由于 Java 5.0 对泛型的支持，现在可以按类型而不是按名称检索 bean，不需要任何强制转换或基于字符串的查找。

## Spring Boot 自动配置原理是什么？

注解 @EnableAutoConfiguration, @Configuration, @ConditionalOnClass 就是自动配置的核心，

@EnableAutoConfiguration 给容器导入META-INF/spring.factories 里定义的自动配置类。

筛选有效的自动配置类。

每一个自动配置类结合对应的 xxxProperties.java 读取配置文件进行自动配置功能

## 你如何理解 Spring Boot 配置加载顺序？

在 Spring Boot 里面，可以使用以下几种方式来加载配置。

1）     properties文件；

2）     YAML文件；

3）     系统环境变量；

等等……

## 4）命令行参数； 什么是 YAML？

YAML 是一种人类可读的数据序列化语言。它通常用于配置文件。与属性文件相比，如果我们想要在配置文件中添加复杂的属性，YAML 文件就更加结构化，而且更少混淆。可以看出 YAML 具有分层配置数据。

## YAML 配置的优势在哪里 ?

YAML 现在可以算是非常流行的一种配置文件格式了，无论是前端还是后端，都可以见到 YAML 配置。那么 YAML 配置和传统的 properties 配置相比到底有哪些优势呢？

1. 配置有序，在一些特殊的场景下，配置有序很关键

2. 支持数组，数组中的元素可以是基本数据类型也可以是对象

3. 简洁

相比 properties 配置文件，YAML 还有一个缺点，就是不支持 @PropertySource 注解导入自定义的 YAML 配置。

## Spring Boot 是否可以使用 XML 配置 ?

Spring Boot 推荐使用 Java 配置而非 XML 配置，但是 Spring Boot 中也可以使用 XML 配置，通过 @ImportResource 注解可以引入一个 XML 配置。 spring boot 核心配置文件是什么？

bootstrap.properties 和 application.properties 有何区别 ?

单纯做 Spring Boot 开发，可能不太容易遇到 bootstrap.properties 配置文

件，但是在结合 Spring Cloud 时，这个配置就会经常遇到了，特别是在需要加载一些远程配置文件的时侯。

spring boot 核心的两个配置文件：

 bootstrap (. yml 或者 . properties)：boostrap 由父 ApplicationContext 加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来说我们在 Spring Cloud Config 或者 Nacos 中会用到它。且 boostrap 里面的属性不

能被覆盖；

 application (. yml 或者 . properties)： 由ApplicatonContext 加载，用于 spring boot 项目的自动化配置。

## 什么是 Spring Profiles？

Spring Profiles 允许用户根据配置文件（dev，test，prod 等）来注册 bean。因此，当应用程序在开发中运行时，只有某些 bean 可以加载，而在

PRODUCTION中，某些其他 bean 可以加载。假设我们的要求是 Swagger 文档仅适用于 QA 环境，并且禁用所有其他文档。这可以使用配置文件来完成。Spring Boot 使得使用配置文件非常简单。

##  如何在自定义端口上运行 Spring Boot 应用程序？

为了在自定义端口上运行 Spring Boot 应用程序，您可以在

application.properties 中指定端口。server.port = 8090



# 安全

## 如何实现 Spring Boot 应用程序的安全性？

为了实现 Spring Boot 的安全性，我们使用 spring-boot-starter-security 依赖项，并且必须添加安全配置。它只需要很少的代码。配置类将必须扩展

WebSecurityConfigurerAdapter 并覆盖其方法。

## 比较一下 Spring Security 和 Shiro 各自的优缺点 ?

由于 Spring Boot 官方提供了大量的非常方便的开箱即用的 Starter ，包括 

Spring Security 的 Starter ，使得在 Spring Boot 中使用 Spring Security 变得更加容易，甚至只需要添加一个依赖就可以保护所有的接口，所以，如果是 

Spring Boot 项目，一般选择 Spring Security 。当然这只是一个建议的组合，单纯从技术上来说，无论怎么组合，都是没有问题的。Shiro 和 Spring 

Security 相比，主要有如下一些特点：

1. Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级

的安全管理框架

2. Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单

3. Spring Security 功能强大；Shiro 功能简单

## Spring Boot 中如何解决跨域问题 ?

跨域可以在前端通过 JSONP 来解决，但是 JSONP 只可以发送 GET 请求，无法发送其他类型的请求，在 RESTful 风格的应用中，就显得非常鸡肋，因此我们推荐在后端通过 （CORS，Cross-origin resource sharing） 来解决跨域问题。这种解决方案并非 Spring Boot 特有的，在传统的 SSM 框架中，就可以通过 CORS 来解决跨域问题，只不过之前我们是在 XML 文件中配置 CORS ，现在可以通过实现WebMvcConfigurer接口然后重写addCorsMappings方法解决跨域问题。

```
1  @Configuration
2  public class CorsConfig implements WebMvcConfigurer { 3
4   @Override
5   public void addCorsMappings(CorsRegistry registry) {
6   registry.addMapping("/**")
7   .allowedOrigins("*")
8   .allowCredentials(true)
9   .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
10   .maxAge(3600);
11   } 
12
13  }
```

项目中前后端分离部署，所以需要解决跨域的问题。

我们使用cookie存放用户登录的信息，在spring拦截器进行权限控制，当权限不符合时，直接返回给用户固定的json结果。

当用户登录以后，正常使用；当用户退出登录状态时或者token过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。

我们知道一个http请求，先走filter，到达servlet后才进行拦截器的处理，如果我们把cors放在filter里，就可以优先于权限拦截器执行。

```
1  @Configuration
2  public class CorsConfig { 3
4   @Bean
5   public CorsFilter corsFilter() {
6   CorsConfiguration corsConfiguration = new CorsConfiguration();
7   corsConfiguration.addAllowedOrigin("*");
8   corsConfiguration.addAllowedHeader("*");
9   corsConfiguration.addAllowedMethod("*");
10   corsConfiguration.setAllowCredentials(true);
11   UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new U rlBasedCorsConfigurationSource();
12   urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsCo nfiguration);
13   return new CorsFilter(urlBasedCorsConfigurationSource);
14   } 
15
16  }
```

## 什么是 CSRF 攻击？

CSRF 代表跨站请求伪造。这是一种攻击，迫使 终用户在当前通过身份验证的 Web 应用程序上执行不需要的操作。CSRF 攻击专门针对状态改变请求，而不是数据窃取，因为攻击者无法查看对伪造请求的响应。

# 监视器

## Spring Boot 中的监视器是什么？

Spring boot actuator 是 spring 启动框架中的重要功能之一。Spring boot 监视器可帮助您访问生产环境中正在运行的应用程序的当前状态。有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为 HTTP URL 访问 的REST 端点来检查状态。

如何在 Spring Boot 中禁用 Actuator 端点安全性？

默认情况下，所有敏感的 HTTP 端点都是安全的，只有具有 ACTUATOR 角色

的用户才能访问它们。安全性是使用标准的 HttpServletRequest.isUserInRole 方法实施的。 我们可以使用来禁用安全性。只有在执行机构端点在防火墙后访问时，才建议禁用安全性。

## 我们如何监视所有 Spring Boot 微服务？

Spring Boot 提供监视器端点以监控各个微服务的度量。这些端点对于获取有关应用程序的信息（如它们是否已启动）以及它们的组件（如数据库等）是否正常运行很有帮助。但是，使用监视器的一个主要缺点或困难是，我们必须单独打开应用程序的知识点以了解其状态或健康状况。想象一下涉及 50 个应用程序的微服务，管理员将不得不击中所有 50 个应用程序的执行终端。为了帮助我们处理这种情况，我们将使用位于的开源项目。 它建立在 Spring Boot Actuator 之上，它提供了一个 Web UI，使我们能够可视化多个应用程序的度量。



## 什么是 WebSockets？

WebSocket 是一种计算机通信协议，通过单个 TCP 连接提供全双工通信信道。

1、     WebSocket 是双向的 -使用 WebSocket 客户端或服务器可以发起消息发送。

2、     WebSocket 是全双工的 -客户端和服务器通信是相互独立的。

3、     单个 TCP 连接 -初始连接使用 HTTP，然后将此连接升级到基于套接字的连接。然后这个单一连接用于所有未来的通信

4、     Light -与 http 相比，WebSocket 消息数据交换要轻得多。

什么是 Spring Data ?

Spring Data 是 Spring 的一个子项目。用于简化数据库访问，支持NoSQL 和 关系数据存储。其主要目标是使数据库的访问变得方便快捷。Spring Data 具有如下特点：

SpringData 项目支持 NoSQL 存储：

1. MongoDB （文档数据库）

2. Neo4j（图形数据库）

3. Redis（键/值存储）

4. Hbase（列族数据库）

SpringData 项目所支持的关系数据存储技术：

1. JDBC

2. JPA

Spring Data Jpa 致力于减少数据访问层 (DAO) 的开发量. 开发者唯一要做的，就是声明持久层的接口，其他都交给 Spring Data JPA 来帮你完成！Spring Data JPA 通过规范方法的名字，根据符合规范的名字来确定方法需要实现什么样的逻辑。

## 什么是 Spring Batch？

Spring Boot Batch 提供可重用的函数，这些函数在处理大量记录时非常重要，包括日志/跟踪，事务管理，作业处理统计信息，作业重新启动，跳过和资源管理。它还提供了更先进的技术服务和功能，通过优化和分区技术，可以实现极高批量和高性能批处理作业。简单以及复杂的大批量批处理作业可以高度可扩展的方式利用框架处理重要大量的信息。

## 什么是 FreeMarker 模板？

FreeMarker 是一个基于 Java 的模板引擎，  初专注于使用 MVC 软件架构进行动态网页生成。使用 Freemarker 的主要优点是表示层和业务层的完全分离。程序员可以处理应用程序代码，而设计人员可以处理 html 页面设计。 后使用 freemarker 可以将这些结合起来，给出  终的输出页面。

## 如何集成 Spring Boot 和 ActiveMQ？

对于集成 Spring Boot 和 ActiveMQ，我们使用依赖关系。 它只需要很少的配置，并且不需要样板代码。

## 什么是 Apache Kafka？

Apache Kafka 是一个分布式发布 - 订阅消息系统。它是一个可扩展的，容错的发布 - 订阅消息系统，它使我们能够构建分布式应用程序。这是一个 Apache 顶级项目。Kafka 适合离线和在线消息消费。

## 什么是 Swagger？你用 Spring Boot 实现了它吗？

Swagger 广泛用于可视化 API，使用 Swagger UI 为前端开发人员提供在线沙箱。Swagger 是用于生成 RESTful Web 服务的可视化表示的工具，规范和完整框架实现。它使文档能够以与服务器相同的速度更新。当通过 Swagger 正确定义时，消费者可以使用 少量的实现逻辑来理解远程服务并与其进行交互。因此，Swagger消除了调用服务时的猜测。

前后端分离，如何维护接口文档 ?

前后端分离开发日益流行，大部分情况下，我们都是通过 Spring Boot 做前后端分离开发，前后端分离一定会有接口文档，不然会前后端会深深陷入到扯皮中。一个比较笨的方法就是使用 word 或者 md 来维护接口文档，但是效率太低，接口一变，所有人手上的文档都得变。在 Spring Boot 中，这个问题常见

的解决方案是 Swagger ，使用 Swagger 我们可以快速生成一个接口文档网

站，接口一旦发生变化，文档就会自动更新，所有开发工程师访问这一个在线网站就可以获取到 新的接口文档，非常方便。



## 如何重新加载 Spring Boot 上的更改，而无需重新启动服务器？Spring Boot项目如何热部署？

这可以使用 DEV 工具来实现。通过这种依赖关系，您可以节省任何更改，嵌入式tomcat 将重新启动。Spring Boot 有一个开发工具（DevTools）模块，它有助于提高开发人员的生产力。Java 开发人员面临的一个主要挑战是将文件更改自动部署到服务器并自动重启服务器。开发人员可以重新加载 Spring Boot 上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。

Spring Boot 在发布它的第一个版本时没有这个功能。这是开发人员 需要的功能。DevTools 模块完全满足开发人员的需求。该模块将在生产环境中被禁用。

它还提供 H2 数据库控制台以更好地测试应用程序。

```
1 <dependency>
2   <groupId>org.springframework.boot</groupId>
3   <artifactId>spring‐boot‐devtools</artifactId>
4  </dependency>
```

## 您使用了哪些 starter maven 依赖项？

使用了下面的一些依赖项

spring-boot-starter-activemq

spring-boot-starter-security

这有助于增加更少的依赖关系，并减少版本的冲突。

Spring Boot 中的 starter 到底是什么 ?

首先，这个 Starter 并非什么新的技术点，基本上还是基于 Spring 已有功能来实现的。首先它提供了一个自动化配置类，一般命名为 XXXAutoConfiguration 

，在这个配置类中通过条件注解来决定一个配置是否生效（条件注解就是 

Spring 中原本就有的），然后它还会提供一系列的默认配置，也允许开发者根据实际情况自定义相关配置，然后通过类型安全的属性注入将这些配置属性注入进来，新注入的属性会代替掉默认属性。正因为如此，很多第三方框架，我们只需要引入依赖就可以直接使用了。当然，开发者也可以自定义 Starter spring-boot-starter-parent 有什么用 ?

我们都知道，新创建一个 Spring Boot 项目，默认都是有 parent 的，这个 

parent 就是 spring-boot-starter-parent ，spring-boot-starter-parent 主要有如下作用：

1. 定义了 Java 编译版本为 1.8 。

2. 使用 UTF-8 格式编码。

3. 继承自 spring-boot-dependencies，这个里边定义了依赖的版本，也正是因为继承了这个依赖，所以我们在写依赖时才不需要写版本号。

4. 执行打包操作的配置。

5. 自动化的资源过滤。

6. 自动化的插件配置。

7. 针对 application.properties 和 application.yml 的资源过滤，包括通过 profile 定义的不同环境的配置文件，例如 applicationdev.properties 和 application-dev.yml。

Spring Boot 打成的 jar 和普通的 jar 有什么区别 ?

Spring Boot 项目  终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 java jar xxx.jar 命令来运行，这种 jar 不可以作为普通的 jar 被其他项目依赖，即使依赖了也无法使用其中的类。

Spring Boot 的 jar 无法被其他项目依赖，主要还是他和普通 jar 的结构不同。普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 

打包成的可执行 jar 解压后，在 \BOOT-INF\classes 目录下才是我们的代码，因此无法被直接引用。如果非要引用，可以在 pom.xml 文件中增加配置，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。

































## SpringBoot中常用注解及其底层实现

1．＠SpringBootApplication注解：这个注解标识了一个SpringBoot工程，它实际上是另外三个注解的组合，这三个注解是：

​	a.＠SpringBootConfiguration：这个注解实际就是一个＠Configuration，表示启动类也是一个配置类

​	b.＠EnableAutoConfiguration：向Spring容器中导入了一个Selector，用来加载ClassPath下SpringFactories中所定义的自动配置类，将这些自 动加载为配置Bean

​	c.＠ComponentScan：标识扫描路径，因为默认是没有配置实际扫描路径，所以SpringBoot扫描的路径是启动类所在的当前目录

2．＠Bean注解：用来定义Bean，类似于XML中的＜bean＞标签，Spring在启动时，会对加了＠Bean注解的方法进行解析，将方法的名字做为beanName，并通过执行方法得到bean对象

3．＠Controller、＠Service、＠ResponseBody、＠Autowired





## SpringBoot是如何启动Tomcat的

1. 首先，SpringBoot在启动时会先创建一个Spring容器
2. 在创建Spring容器过程中，会利用`@ConditionalOnclass`技术来判断当前classpath中是否存在Tomcat依赖，如果存在则会生成一个启动`Tomcat`的Bean
3. Spring容器创建完之后，就会获取启动Tomcat的Bean，并创建Tomcat对象，并绑定端口等，然后启动Tomcat



## SpringBoot中配置文件的加载顺序是怎样的？

优先级从高到低，高优先级的配置赋值低优先级的配置，所有配置会形成互补配置

1. 命令行参数。所有的配置都可以在命令行上进行指定
2. Java系统属性（System.getProperties0）；
3. 操作系统环境变量；
4. jar包外部的application-fprofile.properties或application.yml（带spring.profile）配置文件
5. jar包内部的application-fprofile.properties或application.yml（带spring.profile）配置文件再来加载不带profile
6. jar包外部的application.properties或application.yml（不带spring.profile）配置文件
7. ja包内部的application.properties或application.yml（不带springprofile）配置文件
8. @Configuration注解类上的@PropertySource





## 启动相关

### Spring Boot 启动过程

1. 首先创建 一个 **SpringApplication** 对象

   在创建的过程中对资源进行获取：判断该应用应该是什么类型，使用 **SpringFactoriesLoader** 查找并加载注册所有有用的 **ApplicationContextInitializer** 和 **ApplicationListener** 到容器中

2. 然后由创建出来的对象 **SpringApplication** 执行 **run** 方法

3. **run** 方法的开始会启动一个时间监视器 **StopWatch**，统计项目启动所用的时间

4. 初始化 **ConfigurableApplicationContext** 上下文和 **Spring Boot 启动异常收集类集合**

5. 通过 **SpringFactoriesLoader** 从 **META-INF/Spring.factories** 中获取并实例化**SpringApplicationRunListener类** 和调用他们的 **starting() 方法**，用于通知他们 “Spring Boot开始启动了”  

   （**SpringApplicationRunListener** 是只在 Spring Boot 启动过程中接受不同时间点的事件的监听者，用于在Spring Boot 的 **run** 方法执行不同过程中监听执行不同的方法）

6. 创建并配置 Spring Boot 的环境配置 （这里会重新执行一次 run 方法，如果是debug的时候，需要留意这次run 方法不同于第一次的run）

7. 打印 **Banner**

8. 创建 Spring 的 **ApplicationContent** 上下文类

9. 创建 **SpringBootExceptionReporter** 类，用于存放启动的时候错误信息

10. 遍历调用 **SpringApplicationRunListener** 的 **contextLoaded()** 通知所有**SpringApplicationRunListener**，告诉它们 **SpringContext** 加载完成。并加载**ConfigurableEnvironment** 和 **Configuration** 类到 **Springcontext** 上下文中

11. 调用 **ApplicationContext** 的 **refresh()** 方法，进行**自动配置模块的加载**，启动Tomcat容器，加载并初始化数据源，消息队列等中间件组件，执行 **@Scheduled** 注解等

12. 计时器停止计时，通知 **SpringApplicationRunListener** Spring Boot 的上下文刷新完成了

13. 查找实现了 **ApplicationRunner** 或 **CommandLineRunner** 接口的类，并执行它们的 **run** 方法

14. 最后再遍历执行 **SpringApplicationRunListener** 的 **finished()** 方法，通知 Spring Boot 启动完成