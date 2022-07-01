# IoC

## 容器

容器是一种为某种特定组件的运行提供必要支持的一个软件环境。例如，Tomcat就是一个Servlet容器

通常来说，使用容器运行组件，除了提供一个组件运行环境之外，容器还提供了许多底层服务。例如，Servlet容器底层实现了TCP连接，解析HTTP协议等非常复杂的服务

Spring的核心就是提供了一个`IoC容器`，它可以管理所有轻量级的JavaBean组件，提供的底层服务包括组件的生命周期管理、配置和组装服务、AOP支持，以及建立在AOP基础上的声明式事务服务等



## IoC原理

`IoC`全称`Inversion of Control`，直译为控制反转

传统的应用程序中，控制权在程序本身，程序的控制流程完全由开发者控制

在`IoC模式`下，控制权发生了反转，即从应用程序转移到了`IoC容器`，所有组件不再由应用程序自己创建和配置，而是由`IoC容器`负责，应用程序只需要直接使用已经创建好并且配置好的组件



为了能让组件在`IoC容器`中被“装配”出来，需要某种“注入”机制

`IoC`又称为依赖注入（DI：Dependency Injection），它解决了一个最主要的问题：将组件的`创建 + 配置`与组件的使用相分离，并且，由`IoC容器`负责管理组件的生命周期



因为`IoC容器`要负责实例化所有的组件，因此，有必要告诉容器如何创建组件，以及各组件的依赖关系。最简单的配置是通过`XML文件`来实现，例如：

```xml
<beans>
    <bean id="dataSource" class="DataSource" />
    
    <bean id="bookService" class="BookService">
        <property name="dataSource" ref="dataSource" />
    </bean>
    
    <bean id="userService" class="UserService">
        <property name="dataSource" ref="dataSource" />
    </bean>
</beans>
```

上述`XML配置文件`指示`IoC容器`创建3个`JavaBean组件`，并把id为`dataSource`的组件通过`setDataSource()`方法注入到另外两个组件中

在Spring的`IoC容器`中，把所有组件统称为`JavaBean`，即配置一个组件就是配置一个Bean



**

Spring在初始化时，解析xml文件，将bean信息放在位于`beanFactory`的`beanDefinitionMap`中

依赖注入的时候，存放在`factoryBeanObjectCache`的`map`中

**



### 依赖注入方式

+ 依赖注入可以通过`set()`方法实现

+ 依赖注入可以通过构造方法实现

  ```java
  public class BookService {
      private DataSource dataSource;
  
      public BookService(@AutoWired DataSource dataSource) {
          this.dataSource = dataSource;
      }
  }
  ```

  

Spring的`IoC容器`同时支持属性注入和构造方法注入，并允许混合使用



### 无侵入容器

在设计上，Spring的`IoC容器`是一个高度可扩展的无侵入容器

无侵入，是指应用程序的组件无需实现Spring的特定接口，或者说，组件根本不知道自己在Spring的容器中运行。这种无侵入的设计有以下好处：

1. 应用程序组件既可以在Spring的`IoC容器`中运行，也可以自己编写代码自行组装配置；
2. 测试的时候并不依赖Spring容器，可单独进行测试，大大提高了开发效率。



## 装配Bean

编写一个特定的`application.xml`配置文件，告诉Spring的`IoC容器`应该如何创建并组装Bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="com.itranswarp.learnjava.service.UserService">
        <property name="mailService" ref="mailService" />
    </bean>

    <bean id="mailService" class="com.itranswarp.learnjava.service.MailService" />
</beans>
```

两个Bean的配置：

- 每个Bean都有一个`id`标识，相当于Bean的唯一ID；
- 在`userService`的Bean中，通过`property`注入了另一个Bean；
- Bean的顺序不重要，Spring根据依赖关系会自动正确初始化。



Spring容器是通过读取XML文件后使用反射完成的

如果注入的不是Bean，而是`boolean`、`int`、`String`这样的数据类型，则通过`value`注入

```xml
<bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource">
    <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/test" />
    <property name="username" value="root" />
    <property name="password" value="password" />
    <property name="maximumPoolSize" value="10" />
    <property name="autoCommit" value="true" />
</bean>
```



最后一步，需要创建一个Spring的`IoC容器实例`，然后加载配置文件，让Spring容器创建并装配好配置文件中指定的所有Bean

```java
ApplicationContext context = new ClassPathXmlApplicationContext("application.xml");
```

接下来，可以从Spring容器中“取出”装配好的Bean然后使用它

```java
// 获取Bean:
UserService userService = context.getBean(UserService.class);
```



## IoC 容器

`IoC容器`负责实例化，配置和组装对象。 `IoC容器`从`XML文件`获取信息并相应地工作

`IoC容器`执行的主要任务是：实例化应用程序类，配置对象、组装对象之间的依赖关系



一个有两种类型的`IoC容器`。它们是：`BeanFactory`、`ApplicationContext`



### ApplicationContext

Spring容器就是`ApplicationContext`，它是一个接口，有很多实现类

`ClassPathXmlApplicationContext`，表示它会自动从`classpath`中查找指定的XML配置文件的Spring容器

获得了`ApplicationContext`的实例，就获得了`IoC容器的引用`

可以根据Bean的ID获取Bean，也可以根据Bean的类型获取Bean的引用

```java
UserService userService = context.getBean(UserService.class);
```



### BeanFactory

Spring还提供另一种`IoC容器`叫`BeanFactory`，使用方式和`ApplicationContext`类似

```java
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("application.xml"));
MailService mailService = factory.getBean(MailService.class);
```



### 区别

`BeanFactory`和`ApplicationContext`的区别

+ `BeanFactory`的实现是按需创建，即第一次获取Bean时才创建这个Bean

+ `ApplicationContext`会一次性创建所有的Bean

实际上，`ApplicationContext`接口是从`BeanFactory`接口继承而来的，并且，`ApplicationContext`提供了一些额外的功能，包括国际化支持、事件和通知机制等。通常情况下，使用`ApplicationContext`，很少会考虑使用`BeanFactory`。 



## Annotation配置

使用Spring的`IoC容器`，实际上就是通过类似`XML`的配置文件，把Bean的依赖关系描述出来，然后让容器来创建并装配Bean。一旦容器初始化完毕，就直接从容器中获取Bean使用它们

`XML配置`的优点是所有的Bean都能一目了然地列出来，并通过配置注入能直观地看到每个Bean的依赖。它的缺点是非常繁琐，每增加一个组件，就必须把新的Bean配置到XML中



使用Annotation配置，可以完全不需要XML，让Spring自动扫描Bean并组装它们

```java
@Component
public class MailService {
    ...
}
```



`@Component`注解就相当于定义了一个Bean，它有一个可选的名称，默认是`mailService`，即小写开头的类名。

`UserService`添加一个`@Component`注解和一个`@Autowired`注解

```java
@Component
public class UserService {
    @Autowired
    MailService mailService;

    ...
}
```

使用`@Autowired`就相当于把指定类型的Bean注入到指定的字段中。和XML配置相比，`@Autowired`大幅简化了注入，因为它不但可以写在`set()`方法上，还可以直接写在字段上，甚至可以写在构造方法中

```java
@Component
public class UserService {
    MailService mailService;

    public UserService(@Autowired MailService mailService) {
        this.mailService = mailService;
    }
    ...
}
```

编写一个`AppConfig`类启动容器

```java
@Configuration
@ComponentScan
public class AppConfig {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        UserService userService = context.getBean(UserService.class);
        User user = userService.login("bob@example.com", "password");
        System.out.println(user.getName());
    }
}
```



除了`main()`方法外，`AppConfig`标注了`@Configuration`，表示它是一个配置类，因为创建`ApplicationContext`时：

```java
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
```

使用的实现类是`AnnotationConfigApplicationContext`，必须传入一个标注了`@Configuration`的类名

此外，`AppConfig`还标注了`@ComponentScan`，它告诉容器，自动搜索当前类所在的包以及子包，把所有标注为`@Component`的Bean自动创建出来，并根据`@Autowired`进行装配



使用Annotation配合自动扫描能大幅简化Spring的配置，只需要保证：

- 每个Bean被标注为`@Component`并正确使用`@Autowired`注入
- 配置类被标注为`@Configuration`和`@ComponentScan`
- 所有Bean均在指定包以及子包内





## 定制Bean

### Scope

对于Spring容器来说，当把一个Bean标记为`@Component`后，它就会自动创建一个单例（Singleton），即容器初始化时创建Bean，容器关闭前销毁Bean。在容器运行期间，调用`getBean(Class)`获取到的Bean总是同一个实例。

还有一种Bean，每次调用`getBean(Class)`，容器都返回一个新的实例，这种Bean称为Prototype（原型），它的生命周期显然和Singleton不同。声明一个Prototype的Bean时，需要添加一个额外的`@Scope`注解

```java
@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) // @Scope("prototype")
public class MailSession {
    ...
}
```



### 注入List

有些时候，会有一系列接口相同，不同实现类的Bean。例如，注册用户时，要对email、password和name这3个变量进行验证。为了便于扩展，先定义验证接口

```java
public interface Validator {
    void validate(String email, String password, String name);
}
```



然后，分别使用3个`Validator`对用户参数进行验证

 ```java
@Component
public class EmailValidator implements Validator {
    public void validate(String email, String password, String name) {
        if (!email.matches("^[a-z0-9]+\\@[a-z0-9]+\\.[a-z]{2,10}$")) {
            throw new IllegalArgumentException("invalid email: " + email);
        }
    }
}

@Component
public class PasswordValidator implements Validator {
    public void validate(String email, String password, String name) {
        if (!password.matches("^.{6,20}$")) {
            throw new IllegalArgumentException("invalid password");
        }
    }
}

@Component
public class NameValidator implements Validator {
    public void validate(String email, String password, String name) {
        if (name == null || name.isBlank() || name.length() > 20) {
            throw new IllegalArgumentException("invalid name: " + name);
        }
    }
}
 ```



最后，通过一个`Validators`作为入口进行验证

```java
@Component
public class Validators {
    @Autowired
    List<Validator> validators;

    public void validate(String email, String password, String name) {
        for (var validator : this.validators) {
            validator.validate(email, password, name);
        }
    }

```



`Validators`被注入了一个`List`，Spring会自动把所有类型为`Validator`的Bean装配为一个`List`注入进来

这样一来，每新增一个`Validator`类型，就自动被Spring装配到`Validators`中了，非常方便。



因为Spring是通过扫描classpath获取到所有的Bean，而`List`是有序的，要指定`List`中Bean的顺序，可以加上`@Order`注解

```java
@Component
@Order(1)
public class EmailValidator implements Validator {
    ...
}

@Component
@Order(2)
public class PasswordValidator implements Validator {
    ...
}

@Component
@Order(3)
public class NameValidator implements Validator {
    ...
}
```



### 可选注入

默认情况下，当标记了一个`@Autowired`后，Spring如果没有找到对应类型的Bean，它会抛出`NoSuchBeanDefinitionException`异常。 

可以给`@Autowired`增加一个`required = false`的参数，告诉Spring容器，如果找到一个类型为`ZoneId`的Bean，就注入，如果找不到，就忽略





### 创建第三方Bean

如果一个Bean不在自己的package管理之内，在`@Configuration`类中编写一个Java方法创建并返回它，注意给方法标记一个`@Bean`注解

```java
@Configuration
@ComponentScan
public class AppConfig {
    // 创建一个Bean:
    @Bean
    ZoneId createZoneId() {
        return ZoneId.of("Z");
    }
}
```

Spring对标记为`@Bean`的方法只调用一次，因此返回的Bean仍然是单例





### 初始化和销毁

有些时候，一个Bean在注入必要的依赖后，需要进行初始化（监听消息等）。在容器关闭时，有时候还需要清理资源（关闭连接池等）

通常会定义一个`init()`方法进行初始化，定义一个`shutdown()`方法进行清理，然后，引入JSR-250定义的Annotation

```java
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
</dependency>
```

在Bean的初始化和清理方法上标记`@PostConstruct`和`@PreDestroy`

```java
@Component
public class MailService {
    @Autowired(required = false)
    ZoneId zoneId = ZoneId.systemDefault();

    @PostConstruct
    public void init() {
        System.out.println("Init mail service with zoneId = " + this.zoneId);
    }

    @PreDestroy
    public void shutdown() {
        System.out.println("Shutdown mail service");
    }
}
```

Spring容器会对上述Bean做如下初始化流程：

- 调用构造方法创建`MailService`实例；
- 根据`@Autowired`进行注入；
- 调用标记有`@PostConstruct`的`init()`方法进行初始化。

而销毁时，容器会首先调用标记有`@PreDestroy`的`shutdown()`方法



Spring只根据Annotation查找无参数方法，对方法名不作要求



### 使用别名

给每个Bean添加不同的名字

```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean("z")
    ZoneId createZoneOfZ() {
        return ZoneId.of("Z");
    }

    @Bean
    @Qualifier("utc8")
    ZoneId createZoneOfUTC8() {
        return ZoneId.of("UTC+08:00");
    }

```



可以用`@Bean("name")`指定别名，也可以用`@Bean`+`@Qualifier("name")`指定别名



存在多个同类型的Bean时，注入`ZoneId`又会报错

```
NoUniqueBeanDefinitionException: No qualifying bean of type 'java.time.ZoneId' available: expected single matching bean but found 2
```

期待找到唯一的`ZoneId`类型Bean，但是找到两。因此，注入时，要指定Bean的名称

```java
@Component
public class MailService {
	@Autowired(required = false)
	@Qualifier("z") // 指定注入名称为"z"的ZoneId
	ZoneId zoneId = ZoneId.systemDefault();
    ...
}
```



另一种方法是把其中某个Bean指定为`@Primary` 

```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean
    @Primary // 指定为主要Bean
    @Qualifier("z")
    ZoneId createZoneOfZ() {
        return ZoneId.of("Z");
    }

    @Bean
    @Qualifier("utc8")
    ZoneId createZoneOfUTC8() {
        return ZoneId.of("UTC+08:00");
    }
}
```

在注入时，如果没有指出Bean的名字，Spring会注入标记有`@Primary`的Bean

这种方式也很常用。例如，对于主从两个数据源，通常将主数据源定义为`@Primary`

```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean
    @Primary
    DataSource createMasterDataSource() {
        ...
    }

    @Bean
    @Qualifier("slave")
    DataSource createSlaveDataSource() {
        ...
    }
}
```

其他Bean默认注入的就是主数据源。如果要注入从数据源，那么只需要指定名称即可 



### 使用FactoryBean

Spring提供了工厂模式，允许定义一个工厂，然后由工厂创建真正的Bean

用工厂模式创建Bean需要实现`FactoryBean`接口

```java
@Component
public class ZoneIdFactoryBean implements FactoryBean<ZoneId> {

    String zone = "Z";

    @Override
    public ZoneId getObject() throws Exception {
        return ZoneId.of(zone);
    }

    @Override
    public Class<?> getObjectType() {
        return ZoneId.class;
    }
}
```

当一个Bean实现了`FactoryBean`接口后，Spring会先实例化这个工厂，然后调用`getObject()`创建真正的Bean， `getObjectType()`可以指定创建的Bean的类型 

因此，如果定义了一个`FactoryBean`，要注意Spring创建的Bean实际上是这个`FactoryBean`的`getObject()`方法返回的Bean。为了和普通Bean区分，通常都以`XxxFactoryBean`命名





## 使用Resource

程序需要读取`logo.txt`这个文件，通常情况下，需要写很多繁琐的代码，主要是为了定位文件，打开InputStream

Spring提供了一个`org.springframework.core.io.Resource`（注意不是`javax.annotation.Resource`），它可以像`String`、`int`一样使用`@Value`注入

```java
@Component
public class AppService {
    @Value("classpath:/logo.txt")
    private Resource resource;

    private String logo;

    @PostConstruct
    public void init() throws IOException {
        try (var reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            this.logo = reader.lines().collect(Collectors.joining("\n"));
        }
    }
}

```

注入`Resource`最常用的方式是通过classpath，即类似`classpath:/logo.txt`表示在classpath中搜索`logo.txt`文件，然后，直接调用`Resource.getInputStream()`就可以获取到输入流

也可以直接指定文件的路径

```java
@Value("file:/path/to/logo.txt")
private Resource resource;
```





## 注入配置

在开发应用程序时，经常需要读取配置文件。最常用的配置方法是以`key=value`的形式写在`.properties`文件中

Spring容器还提供了一个更简单的`@PropertySource`来自动读取配置文件。只需要在`@Configuration`配置类上再添加一个注解

```java
@Configuration
@ComponentScan
@PropertySource("app.properties") // 表示读取classpath的app.properties
public class AppConfig {
    @Value("${app.zone:Z}")
    String zoneId;

    @Bean
    ZoneId createZoneId() {
        return ZoneId.of(zoneId);
    }
}
```

Spring容器看到`@PropertySource("app.properties")`注解后，自动读取这个配置文件，然后使用`@Value`正常注入



注意注入的字符串语法，它的格式如下：

- `"${app.zone}"`表示读取key为`app.zone`的value，如果key不存在，启动将报错；
- `"${app.zone:Z}"`表示读取key为`app.zone`的value，但如果key不存在，就使用默认值`Z`



还可以把注入的注解写到方法参数中 

```java
@Bean
ZoneId createZoneId(@Value("${app.zone:Z}") String zoneId) {
    return ZoneId.of(zoneId);
}
```

可见，先使用`@PropertySource`读取配置文件，然后通过`@Value`以`${key:defaultValue}`的形式注入，可以极大地简化读取配置的麻烦



另一种注入配置的方式是先通过一个简单的JavaBean持有所有的配置

```java
@Component
public class SmtpConfig {
    @Value("${smtp.host}")
    private String host;

    @Value("${smtp.port:25}")
    private int port;

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }
}
```

然后，在需要读取的地方，使用`#{smtpConfig.host}`注入

```java
@Component
public class MailService {
    @Value("#{smtpConfig.host}")
    private String smtpHost;

    @Value("#{smtpConfig.port}")
    private int smtpPort;
}
```



`#{}`这种注入语法，它和`${key}`不同的是，`#{}`表示从JavaBean读取属性

`"#{smtpConfig.host}"`的意思是，从名称为`smtpConfig`的Bean读取`host`属性，即调用`getHost()`方法

一个Class名为`SmtpConfig`的Bean，它在Spring容器中的默认名称就是`smtpConfig`，除非用`@Qualifier`指定了名称



使用一个独立的JavaBean持有所有属性，然后在其他Bean中以`#{bean.property}`注入的好处是，多个Bean都可以引用同一个Bean的某个属性

例如，如果`SmtpConfig`决定从数据库中读取相关配置项，那么`MailService`注入的`@Value("#{smtpConfig.host}")`仍然可以不修改正常运行 





## 使用条件装配

Spring为应用程序准备了Profile这一概念，用来表示不同的环境 



创建某个Bean时，Spring容器可以根据注解`@Profile`来决定是否创建

```java
@Configuration
@ComponentScan
public class AppConfig {
    @Bean
    @Profile("!test")
    ZoneId createZoneId() {
        return ZoneId.systemDefault();
    }

    @Bean
    @Profile("test")
    ZoneId createZoneIdForTest() {
        return ZoneId.of("America/New_York");
    }
}
```

如果当前的Profile设置为`test`，则Spring容器会调用`createZoneIdForTest()`创建`ZoneId`，否则，调用`createZoneId()`创建`ZoneId`。注意到`@Profile("!test")`表示非test环境



在运行程序时，加上JVM参数`-Dspring.profiles.active=test`就可以指定以`test`环境启动

实际上，Spring允许指定多个Profile，例如

```
-Dspring.profiles.active=test,master
```

可以表示`test`环境，并使用`master`分支代码



### 使用Conditional

除了根据`@Profile`条件来决定是否创建某个Bean外，Spring还可以根据`@Conditional`决定是否创建某个Bean

```java
@Component
@Conditional(OnSmtpEnvCondition.class)
public class SmtpMailService implements MailService {
    ...
}
```

如果满足`OnSmtpEnvCondition`的条件，才会创建`SmtpMailService`这个Bean

```java
public class OnSmtpEnvCondition implements Condition {
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return "true".equalsIgnoreCase(System.getenv("smtp"));
    }
}
```

`OnSmtpEnvCondition`的条件是存在环境变量`smtp`，值为`true`。这样，就可以通过环境变量来控制是否创建`SmtpMailService` 

Spring只提供了`@Conditional`注解，具体判断逻辑还需要自己实现



+ 如果配置文件中存在`app.smtp=true`，则创建`MailService`

  ```java
  @Component
  @ConditionalOnProperty(name="app.smtp", havingValue="true")
  public class MailService {
      ...
  }
  ```

  

+ 如果当前classpath中存在类`javax.mail.Transport`，则创建`MailService`

  ```java
  @Component
  @ConditionalOnClass(name = "javax.mail.Transport")
  public class MailService {
      ...
  }
  ```



# 源码

todo























