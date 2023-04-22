# Spring

## 基础

### 什么是Spring

Spring是一个开源的Java EE开发框架

Spring的核心功能可以应用在任何Java应用程序中，但对Java EE平台上的Web应用程序有更好的扩展性

Spring的目标是使得Java EE应用程序的开发更加简捷

### Spring有哪些优点

- 轻量级：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB
- 控制反转(IOC)：使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象
- 面向切面编程(AOP)：支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来
- 容器：Spring包含并管理应用程序对象的配置及生命周期
- MVC框架：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架
- 事务管理：Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口
- 异常处理：Spring提供一个方便的API将特定的异常(由JDBC, Hibernate抛出)转化为一致的、Unchecked异常

### Spring中用到的设计模式

- 单例模式：bean默认都是单例的
- 原型模式：指定作用域为prototype
- 工厂模式：BeanFactory
- 模板方法：postProcessBeanFactory、onRefresh、initPropertyValue
- 策略模式：XmlBeanDefinitionReader、PropertiesBeanDefinitionReader
- 观察者模式：listener、event、multicast
- 适配器模式：Adapter
- 装饰者模式：BeanWrapper
- 责任链模式：使用aop的时候会先生成一个拦截器链
- 代理模式：动态代理
- 委托者模式：delegate
- ...

## Bean 相关

### BeanFactory和ApplicationContext的区别

- **ApplicationContext：**Spring容器就是ApplicationContext，它是一个接口，有很多实现类，如：ClassPathXmlApplicationContext，表示它会自动从classpath中查找指定的XML配置文件的Spring容器获得了ApplicationContext的实例，就获得了IoC容器的引用，可以根据Bean的ID或类型获取Bean
- **BeanFactory：**Spring的另一种IoC容器叫BeanFactory，使用方式和ApplicationContext类似
- 区别

- - BeanFactory的实现是按需创建，即第一次获取Bean时才创建这个Bean
  - ApplicationContext会一次性创建所有的Bean
  - ApplicationContext接口是从BeanFactory接口继承而来的，并且，ApplicationContext提供了一些额外的功能，包括国际化支持、事件和通知机制等。通常情况下，使用ApplicationContext，很少会考虑使用BeanFactory

```java
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = context.getBean(UserService.class);
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("application.xml"));
MailService mailService = factory.getBean(MailService.class);
```

### Bean Factory与Factory Bean有什么区别

- 相同点：都是用来创建bean对象的
- 不同点：使用BeanFactory创建对象的时候，必须要遵循严格的生命周期流程。如果想要简单的自定义某个对象的创建，同时创建完成的对象想交给Spring来管理，那么需要实现Factroy Bean接口

### 什么是Spring Beans

Spring Beans是构成Spring应用核心的Java对象，由Spring IOC容器实例化、组装、管理，通过容器中配置的元数据创建，例如，使用XML文件中定义的创建，在Spring中创建的beans默认都是单例的beans

### Spring Bean线程安全吗

- Spring本身并没有针对Bean做线程安全的处理，所以：

1. 1. 如果Bean是无状态的，那么Bean则是线程安全的
   2. 如果Bean是有状态的，那么Bean则不是线程安全的

- Bean是不是线程安全，跟Bean的作用域（单例、多例）没有关系，Bean的作用域只是表示Bean的生命周期范围，对于任何生命周期的Bean都是一个对象，这个对象是不是线程安全的，还是得看这个Bean对象本身

### Spring中支持的bean作用域

默认的 scope 属性是 singleton

- singleton：在Spring IOC容器中仅存在一个Bean实例，Bean以单实例的方式存在
- prototype：一个bean可以定义多个实例
- request：每次HTTP请求都会创建一个新的Bean，仅适用于WebApplicationContext环境
- session：一个HTTP Session定义一个Bean，仅适用于WebApplicationContext环境
- globalSession：同一个全局HTTP Session定义一个Bean，仅适用于WebApplicationContext环境

### Spring 的单例实现原理

Spring框架对单例的支持是采用 **单例注册表** 的方式进行实现的，而这个**注册表的缓存**是**ConcurrentHashMap对象**，如果配置文件中的配置信息不要求使用单例，Spring会采用新建实例的方式返回对象实例

### Bean的生命周期 todo

ApplicationContext容器中，Bean的生命周期流程大致如下：

![img](https://cdn.nlark.com/yuque/0/2023/png/29236088/1675669749521-657e0d23-280e-4440-9cc2-26d677b648aa.png)

1. 首先容器启动后，会对 **scope** 为 **singleton** 且**非懒加载**的 bean 进行实例化
2. 按照 Bean 定义信息配置信息，注入所有的属性
3. 如果 Bean 实现了 **BeanNameAware** 接口，会回调该接口的 **setBeanName()** 方法，传入该 Bean 的 id，该 Bean 就获得了自己在配置文件中的 id如果 Bean 实现了 **BeanFactoryAware** 接口，会回调该接口的 **setBeanFactory()** 方法，传入该 Bean 的 BeanFactory，该 Bean 就获得了自己所在的 BeanFactory如果 Bean 实现了 **ApplicationContextAware** 接口，会回调该接口的 **setApplicationContext()** 方法，传入该 Bean 的 ApplicationContext，该 Bean 就获得了自己所在的 ApplicationContext
4. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessBeforeInitialzation()** 方法
5. 如果 Bean 实现了 **InitializingBean** 接口，则会回调该接口的 **afterPropertiesSet()** 方法
6. 如果 Bean 配置了 **init-method** 方法，则会执行 **init-method** 配置的方法
7. 如果 Bean 实现了 **BeanPostProcessor** 接口，则会回调该接口的 **postProcessAfterInitialization()**方法
8. 经过各个流程之后，就可以正式使用该 Bean 了，对于 scope 为 singleton 的 Bean，Spring 的 ioc 容器中会缓存一份该 bean 的实例，而对于 scope 为 prototype 的 Bean，每次被调用都会new一个新的对象，期生命周期就交给调用方管理不再是Spring容器进行管理
9. 容器关闭后，如果 Bean 实现了 **DisposableBean** 接口，则会回调该接口的 **destroy()** 方法
10. 如果 Bean 配置了 **destroy-method** 方法，则会执行 **destroy-method** 配置的方法，至此，整个 Bean 的生命周期结束

### Bean创建的生命周期

创建bean大致步骤：

1. 推断构造方法
2. 实例化
3. 填充属性，及依赖注入
4. 处理aware回调
5. 初始化前，处理@PostConstruct注解
6. 初始化，处理Initialization接口
7. 初始化后，进行aop

## IoC 相关

### Spring IoC容器是什么

Spring IOC负责创建、管理(通过依赖注入)、整合、配置对象以及管理这些对象的生命周期

### IoC有什么优点

- 减少了代码量
- 使得程序的测试简单，因为在单元测试中不再需要单例或JNDI查找机制
- 松耦合
- 支持勤性单例及延迟加载服务

### 推荐哪种依赖注入

可以同时使用两种方式的依赖注入，最好使用构造器参数实现强制依赖注入，使用setter方法实现可选的依赖关系

### todo Spring IOC的理解，原理与实现

工厂 + 反射

- 控制反转：理论思想，原来的对象是由使用者来进行控制，有了spring之后，可以把整个对象交给spring来帮我们进行管理
- DI：依赖注入，把对应的属性的值注入到具体的对象中，@Autowired，populateBean完成属性值的注入
- 容器：存储对象，使用map结构来存储，在spring中一般存在三级缓存，singletonObjects存放完整的bean对象，整个bean的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean的生命周期）

1、一般要涉及到容器的创建过程（beanFactory,DefaultListableBeanFactory）,向bean工厂中设置一些参数（BeanPostProcessor,Aware接口的子类）等等属性

2、加载解析bean对象，准备要创建的bean对象的定义对象beanDefinition,(xml或者注解的解析过程)

3、beanFactoryPostProcessor的处理，此处是扩展点，PlaceHolderConfigurSupport,ConfigurationClassPostProcessor

4、BeanPostProcessor的注册功能，方便后续对bean对象完成具体的扩展功能

5、通过反射的方式讲BeanDefinition对象实例化成具体的bean对象，

6、bean对象的初始化过程（填充属性，调用aware子类的方法，调用BeanPostProcessor前置处理方法，调用init-mehtod方法，调用BeanPostProcessor的后置处理方法）

7、生成完整的bean对象，通过getBean方法可以直接获取

8、销毁过程

### 依赖注入是什么

依赖注入作为控制反转(IOC)的一个层面，在这个概念中，不用创建对象而只需要描述如何创建它们。不必通过代码直接的将组件和服务连接在一起，而是通过配置文件说明哪些组件需要什么服务，之后IOC容器负责衔接

### 有哪些不同类型的依赖注入

- **构造器依赖注入：**在容器触发构造器的时候完成，该构造器有一系列的参数，每个参数代表注入的对象
- **Setter方法依赖注入：**首先容器会触发一个无参构造函数或无参静态工厂方法实例化对象，之后容器调用bean中的setter方法完成setter方法依赖注入

### 自动装配的各种模式

提供五种模式用来自动装配beans之间的依赖注入:

- no：默认的方式是不进行自动装配，通过手工设置 ref 属性来进行装配bean
- byName：通过参数名自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byName。之后容器试图匹配、装配和该 bean 的属性具有相同名字的 bean
- byType：通过参数的数据类型自动自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byType。之后容器试图匹配和装配和该bean的属性类型一样的bean。如果有多个bean符合条件，则抛出错误
- constructor：这个同byType类似，不过是应用于构造函数的参数。如果在BeanFactory中不是恰好有一个bean与构造函数参数相同类型，则抛出错误
- autodetect：如果有默认的构造方法，通过 cconstructor 的方式自动装配，否则使用 byType的方式自动装配

### Spring 循环依赖的问题 todo

- 循环依赖：A依赖B，B依赖A，形成闭环
- 解决方法：使用三级缓存，提前暴露对象，AOP
- **一级缓存中放的是完整对象，二级缓存中放的是非完整对象，三级缓存的value类型是ObjectFactory**（是一个函数式接口，存在的意义是保证在整个容器的运行过程中同名的bean对象只能有一个）
- bean的创建过程：实例化，初始化（填充属性）

1. 1. 先创建A对象，实例化A对象，此时A对象中的b属性为空，填充属性b
   2. 从容器中查找B对象，如果找到了，直接赋值不存在循环依赖问题，如果找不到直接创建B对象
   3. 实例化B对象，此时B对象中的a属性为空，填充属性a
   4. 从容器中查找A对象，找不到，直接创建

- 在d的一步，会发现A对象是存在的，只不过此时的A对象不是一个完整的状态，只完成了实例化但是未完成初始化，如果在程序调用过程中，拥有了某个对象的引用，能否在后期给他完成赋值操作，可以优先把非完整状态的对象优先赋值，等待后续操作来完成赋值，这相当于**提前暴露了某个不完整对象的引用**，所以解决问题的核心在于实例化和初始化分开操作，这也是解决循环依赖问题的关键
- 当所有的对象都完成实例化和初始化操作之后，还要把完整对象放到容器中，此时在容器中存在对象的几个状态：1. 完成实例化但未完成初始化、2. 完整状态；因为都在容器中，所以要使用不同的map结构来进行存储，此时就有了一级缓存和二级缓存（如果一级缓存中有了，那么二级缓存中就不会存在同名的对象，因为他们的查找顺序是1，2，3这样的方式来查找的）

### 代理

- 如果一个对象需要被代理，或者说需要生成代理对象，需要优先生成一个普通对象，普通对象和代理对象是**不能同时出现在容器中**的
- 当对象需要被代理的时候，就要使用代理对象**覆盖掉**之前的普通对象
- 在实际的调用过程中，是没有办法确定什么时候对象被使用，所以就要求当某个对象被调用的时候，**优先判断此对象是否需要被代理**，类似于一种回调机制的实现，因此传入lambda表达式的时候，可通过lambda表达式来执行对象的覆盖过程，**getEarlyBeanReference()**
- 因此，所有的bean对象在创建的时候都要优先放到三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，如果不需要被代理，则直接返回普通对象

### 三级缓存的放置时间和删除时间

- 三级缓存：createBeanInstance之后；addSingletonFactory
- 二级缓存：第一次从三级缓存确定对象是代理对象还是普通对象的时候，同时删除三级缓存；getSingleton
- 一级缓存：生成完整对象之后放到一级缓存，删除二三级缓存；addSingleton

### @Lazy

用于指定单例bean实例化的时机，在没有指定此注解时，单例会在容器初始化时就被创建。而当使用此注解后，单例对象的创建时机会在该bean在被第一次使用时创建，并且只创建一次。第二次及以后获取使用就不再创建。此注解只对单例bean有用，原型bean时此注解不起作用。也可以解决循环依赖问题

## AOP 相关

### 解释AOP模块

- AOP模块用来开发Spring应用程序中具有切面性质的部分
- 该模块的大部分服务由AOP Aliance提供，这就保证了Spring框架和其他AOP框架之间的互操作性
- 该模块将元数据编程引入到了Spring

### 面向切面编程(AOP)

- 面向切面编程（AOP）允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理和事务管理
- 切面（Aspect） AOP的核心就是切面，它将多个类的通用行为封装为可重用的模块。该模块含有一组API提供 cross-cutting 功能。根据需求的不同，一个应用程序可以有若干切面。在Spring AOP中，切面通过带有 @Aspect 注解的类实现
- 通知（Advice）通知表示在方法执行前后需要执行的动作。实际上它是Spring AOP框架在程序执行过程中触发的一些代码。Spring切面可以执行一下五种类型的通知

- - before(前置通知)：在一个方法之前执行的通知
  - after(最终通知)：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）
  - after-returning(后置通知)：在某连接点正常完成后执行的通知
  - after-throwing(异常通知)：在方法抛出异常退出时执行的通知
  - around(环绕通知)：在方法调用前后触发的通知

- 切入点（Pointcut）切入点是一个或一组连接点，通知将在这些位置执行。可以通过表达式或匹配的方式指明切入点
- 引入引入允许我们在已有的类上添加新的方法或属性
- 目标对象被一个或者多个切面所通知的对象。它通常是一个代理对象。也被称做被通知（advised）对象
- 代理代理是将通知应用到目标对象后创建的对象。从客户端的角度看，代理对象和目标对象是一样的。有以下几种代理

- - BeanNameAutoProxyCreator：bean名称自动代理创建器
  - DefaultAdvisorAutoProxyCreator：默认通知者自动代理创建器
  - Metadata autoproxying：元数据自动代理

- 织入将切面和其他应用类型或对象连接起来创建一个通知对象的过程。织入可以在编译、加载或运行时完成

### Spring AOP 实现原理

实现AOP的技术，主要分为两大类：

- 动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行
- 静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码

Spring AOP 的实现原理其实很简单

AOP 框架负责动态地生成 AOP 代理类，这个代理类的方法则由 Advice 和回调目标对象的方法所组成，并将该对象可作为目标对象使用

AOP 代理包含了目标对象的全部方法，但AOP代理中的方法与目标对象的方法存在差异，AOP方法在特定切入点添加了增强处理，并回调了目标对象的方法

动态代理技术在运行期织入增强代码，使用两种代理机制：基于JDK的动态代理（JDK本身只提供接口的代理）和基于CGlib的动态代理。

- JDK的动态代理JDK的动态代理主要涉及 **java.lang.reflect** 包中的两个类：**Proxy** 和 **InvocationHandler****InvocationHandler** 只是一个接口，可以通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态的将横切逻辑与业务逻辑织在一起。而 **Proxy** 利用 **InvocationHandler** 动态创建一个符合某一接口的实例，生成目标类的代理对象其代理对象**必须是某个接口的实现**，它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理，只能实现接口的类生成代理，而不能针对类
- CGLibCGLib采用**底层的字节码技术**，为一个类**创建子类**，并在子类中采用方法拦截的技术拦截所有父类的调用方法，并顺势织入横切逻辑它运行期间生成的代理对象是**目标类的扩展子类**，所以无法通知**final、private的方法**，因为它们不能被覆写。是针对类实现代理，主要是为指定的类生成一个子类，覆盖其中方法在spring中默认情况下使用JDK动态代理实现AOP，如果**proxy-target-class**设置为true或者使用了优化策略那么会使用CGLIB来创建动态代理Spring AOP在这两种方式的实现上基本一样。JDK代理中，会使用**JdkDynamicAopProxy**来创建代理，在**invoke()**方法首先需要织入到当前类的增强器封装到**拦截器链**中，然后递归的调用这些拦截器完成功能的织入，最终返回代理对象

### todo CgLib和jdk动态代理什么区别

如上所述

## 启动相关

### Spring容器启动流程

1. 在创建Spring容器，也就是启动Spring时，首先会进行扫描，扫描得到所有的**BeanDefinition**对象，并存在一个Map中
2. 然后筛选出**非懒加载的单例BeanDefinition**进行创建Bean；对于多例Bean不需要在启动过程中去进行创建，对于多例Bean会在每次获取Bean时利用**BeanDefinition**去通过new创建
3. 利用**BeanDefinition**创建Bean就是Bean的创建生命周期，这期间包括了合并**BeanDefinition**、推断构造方法、实例化、属性填充、初始化前、初始化、初始化后等步骤，其中AOP就是发生在初始化后这一步骤中
4. 单例Bean创建完了之后，Spring会发布一个容器启动事件，Spring启动结束

可以归纳为三个步骤：

1. 初始化 Spring 容器，注册内置的 **BeanPostProcessor** 的 **BeanDefinition** 到容器中
2. 将配置类的 **BeanDefinition** 注册到容器中
3. 调用 **refresh()** 方法刷新容器

## 事务相关

### Spring 事务实现方式

- 编程式事务管理：通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护
- 声明式事务管理：将事务管理和业务代码分离。只需要通过**注解或者XML配置**管理事务

### Spring框架的事务管理有哪些优点

- 为不同的事务API（如JTA, JDBC, Hibernate, JPA, 和JDO）提供了统一的编程模型
- 为编程式事务管理提供了一个简单的API
- 支持声明式事务管理
- 可以和 Spring 的多种数据访问技术很好的兼容

### Spring事务定义的传播规则 todo

- **PROPAGATION_REQUIRED：**支持当前事务，如果当前没有事务，就新建一个事务
- **PROPAGATION_SUPPORTS：**支持当前事务，如果当前没有事务，就以非事务方式执行
- **PROPAGATION_MANDATORY：**支持当前事务，如果当前没有事务，就抛出异常
- **PROPAGATION_REQUIRES_NEW：**新建事务，如果当前存在事务，把当前事务挂起
- **PROPAGATION_NOT_SUPPORTED：**以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
- **PROPAGATION_NEVER：**以非事务方式执行，如果当前存在事务，则抛出异常
- **PROPAGATION_NESTED：**如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，就新建一个事务

### Spring 事务底层原理

- **划分处理单元 IoC**

- - Spring是**对单个数据库进行局部事务处理**的，具体的实现首先用IoC划分了事务处理单元，并且将事务的各种配置放到了ioc容器中（设置事务管理器，设置事务的传播特性及隔离机制）

- **AOP拦截需要进行事务处理的类**

- - Spring事务处理模块是通过AOP功能来实现声明式事务处理的具体操作（比如事务实行的配置和读取，事务对象的抽象），用**TransactionProxyFactoryBean**接口来使用AOP功能，生成**Proxy代理对象**，再通过**TransactionInterceptor**完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取IoC容器事务配置属性，转化为Spring事务处理需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为**TransactionAttribute**表示的数据对象

- 对事务处理实现（事务的生成、提交、回滚、挂起）

- - Spring委托给具体的事务处理器实现，实现了一个抽象和适配。适配的具体事务处理器：DataSource数据源支持、hibernate数据源事务处理支持、JDO数据源事务处理支持、JPA、JTA数据源事务处理支持。这些支持都是通过设计**PlatformTransactionManager、AbstractPlatforTransaction**一系列事务处理的支持，为常用数据源支持提供了一系列的TransactionManager

- 结合

- - **PlatformTransactionManager**实现了**TransactionInterception接口**，让其与**TransactionProxyFactoryBean**结合起来，形成一个Spring声明式事务处理的设计体系

### Spring 事务大致步骤

Spring事务底层是基于**数据库事务**和**AOP机制**的

1. 首先对于使用了**@Transactional**注解的Bean， Spring会创建一个代理对象作为Bean
2. 当调用**代理对象的方法**时，会先判断该方法上是否加了@Transactional注解
3. 如果加了，那么则利用**事务管理器**创建一个数据库连接
4. 并且**修改数据库**连接的**autocommit**属性（自动提交事务）为**false**，禁止此连接的自动提交
5. 然后执行当前方法，方法中会执行SQL
6. 执行完当前方法后，如果没有出现异常就直接提交事务
7. 如果出现了异常，并且这个异常是需要回滚的就会回滚事务，否则仍然提交事务
8. Spring事务的**隔离级别默认**对应的就是**数据库的隔离级别**
9. Spring事务的传播机制是**基于数据库连接**来做的，一个数据库连接一个事务，如果传播机制配置为需要新开一个事务，那么实际上就是先建立一个数据库连接，在此新数据库连接上执行sql

### Spring 事务隔离级别

- **DEFAULT**：默认对应数据库的隔离级别
- **READ_UNCOMMITTED**：读未提交
- **READ_COMMITTED**：读已提交
- **REPEATABLE_READ**：可重复读
- **SERIALIZABLE**：串行化

### Spring事务失效的情况 todo

1. 普通对象调用方法，即类中的非事务方法通过 this.xxx() 调用，事务是不生效的，只有代理对象调用才行，解决办法：

1. 1. 注入自己，通过注入的对象来调用；
   2. 使用@EnableAspectJAutoProxy(exposeProxy = true) + AopContext.currentProxy()

1. 业务方法为非public方法，因为**Cglib动态代理**是基于父子类来实现的，Spring事务默认生效的方法权限都必须为public，解决办法：

1. 1. 将方法改为public
   2. 修改TansactionAttributeSource，将publicMethodsOnly改为false
   3. 使用AspectJ 代理模式替换 Cglib动态代理

1. 因为**Cglib动态代理**是基于父子类来实现的，子类是不能重载父类的**private**方法，所以类中的方法是**private**的则代理类不能重载，及**@Transaction**会失效
2. 方法用final、static修饰
3. service类没有托管给Spring，即没有加 @Service 或 @Component，解决办法：

1. 1. 将service注入spring

1. 抛出受检异常，Spring默认只会回滚非检查异常和error异常，解决办法：

1. 1. 配置 rollbackFor

1. 业务代码中将异常捕获后没有原样抛出异常，解决办法：

1. 1. 原样抛出异常
   2. 设置TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

1. 使用其他切面，并在切面代码中捕获了异常没有原样抛出异常，Spring事务的切面优先级是最低的，所以其他切面捕获异常后Spring事务是无感知的，解决办法：

1. 1. 在切面中原样抛出异常
   2. 在切面中设置TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

1. 多线程调用，因为Spring的事务是通过数据库连接来实现，而数据库连接Spring是放在threadLocal里面。同一个事务，只能用同一个数据库连接。而多线程场景下，拿到的数据库连接是不一样的，即是属于不同事务
2. 错误的传播行为 @Transactional(propagation = Propagation.NOT_SUPPORTED)
3. 使用了不支持事务的存储引擎，如mysql的MyISAM
4. 数据源没有配置事务管理器
5. 被代理的类过早实例化，当代理类的实例化早于AbstractAutoProxyCreator后置处理器，就无法被AbstractAutoProxyCreator后置处理器增强

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

### todo Spring的事务是如何回滚的?

### spring的事务管理是如何实现的？ todo

​		总：spring的事务是由aop来实现的，首先要生成具体的代理对象，然后按照aop的整套流程来执行具体的操作逻辑，正常情况下要通过通知来完成核心功能，但是事务不是通过通知来实现的，而是通过一个TransactionInterceptor来实现的，然后调用invoke来实现具体的逻辑

​		分：1、先做准备工作，解析各个方法上事务相关的属性，根据具体的属性来判断是否开始新事务

​				2、当需要开启的时候，获取数据库连接，关闭自动提交功能，开起事务

​				3、执行具体的sql逻辑操作

​				4、在操作过程中，如果执行失败了，那么会通过completeTransactionAfterThrowing看来完成事务的回滚操作，回滚的具体逻辑是通过doRollBack方法来实现的，实现的时候也是要先获取连接对象，通过连接对象来回滚

​				5、如果执行过程中，没有任何意外情况的发生，那么通过commitTransactionAfterReturning来完成事务的提交操作，提交的具体逻辑是通过doCommit方法来实现的，实现的时候也是要获取连接，通过连接对象来提交

​				6、当事务执行完毕之后需要清除相关的事务信息cleanupTransactionInfo

如果想要聊的更加细致的话，需要知道TransactionInfo,TransactionStatus,

### **如何自定义注解实现功能**

1. 创建自定义注解和创建一个接口相似，但是注解的interface关键字需要以@符号开头。
2. 注解方法不能带有参数；
3. 注解方法返回值类型限定为：基本类型、String、Enums、Annotation或者是这些类型的数组；
4. 注解方法可以有默认值；
5. 注解本身能够包含元注解，元注解被用来注解其它注解。

## 其他

### Resource 是如何被查找、加载的

Resource 接口是 Spring 资源访问策略的抽象，它本身并不提供任何资源访问实现，具体的资源访问由该接口的实现类完成——每个实现类代表一种资源访问策略。 Spring 为 Resource 接口提供了如下实现类：

- UrlResource：访问网络资源的实现类。
- ClassPathResource：访问类加载路径里资源的实现类。
- FileSystemResource：访问文件系统里资源的实现类。
- ServletContextResource：访问相对于 ServletContext 路径里的资源的实现类：
- InputStreamResource：访问输入流资源的实现类。
- ByteArrayResource：访问字节数组资源的实现类。 这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。