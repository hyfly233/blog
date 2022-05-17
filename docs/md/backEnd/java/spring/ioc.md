# IoC

## IoC容器

容器是一种为某种特定组件的运行提供必要支持的一个软件环境。例如，Tomcat就是一个Servlet容器

通常来说，使用容器运行组件，除了提供一个组件运行环境之外，容器还提供了许多底层服务。例如，Servlet容器底层实现了TCP连接，解析HTTP协议等非常复杂的服务

Spring的核心就是提供了一个IoC容器，它可以管理所有轻量级的JavaBean组件，提供的底层服务包括组件的生命周期管理、配置和组装服务、AOP支持，以及建立在AOP基础上的声明式事务服务等



## IoC原理

IoC全称 Inversion of Control，直译为控制反转

传统的应用程序中，控制权在程序本身，程序的控制流程完全由开发者控制

在IoC模式下，控制权发生了反转，即从应用程序转移到了IoC容器，所有组件不再由应用程序自己创建和配置，而是由IoC容器负责，这样，应用程序只需要直接使用已经创建好并且配置好的组件。为了能让组件在IoC容器中被“装配”出来，需要某种“注入”机制

IoC又称为依赖注入（DI：Dependency Injection），它解决了一个最主要的问题：将组件的创建 + 配置与组件的使用相分离，并且，由IoC容器负责管理组件的生命周期



因为IoC容器要负责实例化所有的组件，因此，有必要告诉容器如何创建组件，以及各组件的依赖关系。一种最简单的配置是通过XML文件来实现，例如：

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

上述XML配置文件指示IoC容器创建3个JavaBean组件，并把id为`dataSource`的组件通过`setDataSource()`方法注入到另外两个组件中

在Spring的IoC容器中，把所有组件统称为JavaBean，即配置一个组件就是配置一个Bean



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

  

Spring的IoC容器同时支持属性注入和构造方法注入，并允许混合使用



### 无侵入容器

在设计上，Spring的IoC容器是一个高度可扩展的无侵入容器

无侵入，是指应用程序的组件无需实现Spring的特定接口，或者说，组件根本不知道自己在Spring的容器中运行。这种无侵入的设计有以下好处：

1. 应用程序组件既可以在Spring的IoC容器中运行，也可以自己编写代码自行组装配置；
2. 测试的时候并不依赖Spring容器，可单独进行测试，大大提高了开发效率。





## 装配Bean

编写一个特定的`application.xml`配置文件，告诉Spring的IoC容器应该如何创建并组装Bean

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
- 在`userService`Bean中，通过`property`注入了另一个Bean；
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



最后一步，需要创建一个Spring的IoC容器实例，然后加载配置文件，让Spring容器创建并装配好配置文件中指定的所有Bean

```java
ApplicationContext context = new ClassPathXmlApplicationContext("application.xml");
```

接下来，可以从Spring容器中“取出”装配好的Bean然后使用它

```java
// 获取Bean:
UserService userService = context.getBean(UserService.class);
```



### ApplicationContext

Spring容器就是`ApplicationContext`，它是一个接口，有很多实现类

`ClassPathXmlApplicationContext`，表示它会自动从classpath中查找指定的XML配置文件的Spring容器

获得了`ApplicationContext`的实例，就获得了IoC容器的引用

可以根据Bean的ID获取Bean，也可以根据Bean的类型获取Bean的引用

```java
UserService userService = context.getBean(UserService.class);
```



### BeanFactory

Spring还提供另一种IoC容器叫`BeanFactory`，使用方式和`ApplicationContext`类似

```java
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("application.xml"));
MailService mailService = factory.getBean(MailService.class);
```



`BeanFactory`和`ApplicationContext`的区别

+ `BeanFactory`的实现是按需创建，即第一次获取Bean时才创建这个Bean

+ `ApplicationContext`会一次性创建所有的Bean

实际上，`ApplicationContext`接口是从`BeanFactory`接口继承而来的，并且，`ApplicationContext`提供了一些额外的功能，包括国际化支持、事件和通知机制等。通常情况下，使用`ApplicationContext`，很少会考虑使用`BeanFactory`。 



## Annotation配置







## 定制Bean



## 使用Resource







## 注入配置







## 使用条件装配









# 源码

























