# Spring Boot

## 基础相关

### Spring与Spring Boot

**Spring:** Spring框架是一个开源的Java EE开发框架，主要功能是**依赖注入(DI)**或**控制反转(IoC)**。借助Spring框架可以开发一个**松耦合**的应用程序。

**SpringBoot:** Spring Boot是Spring框架的一个模块。它允许构建具有最少配置或零配置的独立应用程序。



| **Spring**                                             | **Spring Boot**                                              |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| **Spring** 是用于构建应用程序的广泛使用的Java EE框架。 | **SpringBoot** 被广泛用于开发 **REST API** 。                |
| 简化Java EE开发，从而使开发更加高效。                  | 它旨在缩短代码长度，并提供开发 **Web应用程序**的最简单方法。 |
| 主要功能是**依赖注入**。                               | 主要功能是**自动配置**。根据需求自动配置类。                 |
| 开发**松耦合**应用程序，可以使事情变得更简单。         | 有助于创建配置更少的**独立**应用。                           |
| 编写了大量代码(**模板代码**)来完成最小的任务。         | **减少**样板代码。                                           |
| 需要显式设置服务器。                                   | 提供了**嵌入式服务器**，例如 **Jetty** 和 **Tomcat** 等。    |
| 不支持内存数据库。                                     | 提供了多个插件来处理嵌入式和**内存中**数据库。               |
| 开发人员在 **pom.xml** 中为Spring项目手动定义依赖项。  | 在pom.xml文件中带有 **starter** 概念，该概念内部负责根据Spring Boot要求下载依赖项 **JAR** 。 |

### Spring Boot与Spring MVC

**Spring Boot:** SpringBoot使得快速引导和开发Spring变得容易。应用。它避免了很多样板代码。它隐藏了很多复杂的信息，可以快速入门并轻松开发基于Spring的应用程序。

**Spring MVC:** Spring MVC是是一个面向HTTP的Web MVC应用程序开发框架，它包含许多用于各种功能的配置文件。



| **SpringBoot**                                               | **SpringMVC**                                             |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| **SpringBoot** 是Spring的模块，用于使用合理的默认值打包基于Spring的应用程序。 | **SpringMVC** 是Spring框架下基于模型视图控制器的Web框架。 |
| 它提供了用于构建 **Spring-powered** 框架的默认配置。         | 它提供了**易于使用**功能来构建Web应用程序。               |
| 无需手动构建配置。                                           | 它需要手动进行构建配置。                                  |
| **不需要**部署描述符。                                       | **必需**。                                                |
| 它避免了样板代码，并将依赖项包装在一个单元中。               | 它分别指定每个依赖项。                                    |
| 它**减少**开发时间并提高生产率。                             | 相同的功能，要花费**更多**。                              |

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

- **@SpringBootConfiguration：**组合了 @Configuration 注解，实现配置文件的功能。
- **@EnableAutoConfiguration：**打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能：@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
- **@ComponentScan：**Spring组件扫描

### 运行 Spring Boot 有哪几种方式？

1）打包用命令或者放到容器中运行

2）用 Maven/ Gradle 插件运行

3）直接执行 main 方法运行

### 开启 Spring Boot 特性有哪几种方式？

1）继承spring-boot-starter-parent项目

2）导入spring-boot-dependencies项目依赖

### 如何使用 Spring Boot 实现异常处理？

Spring 提供了一种使用 ControllerAdvice 处理异常的非常有用的方法。 通过实现一个 ControlerAdvice 类，来处理控制器类抛出的所有异常。

### 如何使用 Spring Boot 实现分页和排序？

使用 Spring Data-JPA 可以实现将可分页的传递给存储库方法。

### Spring Boot 中如何实现定时任务 ?

使用 Spring 中的 @Scheduled 注解，另一个则是使用第三方框架 Quartz、Xxl-job 等

### 什么是 JavaConfig？

Spring JavaConfig 提供了配置 Spring IoC 容器的纯Java 方法，有助于避免使用 XML 配置。使用 JavaConfig 的优点在于：

- 面向对象的配置。由于配置被定义为 JavaConfig 中的类，因此可以充分利用 Java 中的面向对象功能。一个配置类可以继承另一个，重写它的@Bean 方法等；

- 减少或消除 XML 配置；
- 类型安全和重构友好。JavaConfig 提供了一种类型安全的方法来配置 Spring容器。由于 Java 5.0 对泛型的支持，现在可以按类型而不是按名称检索 bean，不需要任何强制转换或基于字符串的查找。

### Spring Boot 自动配置原理是什么？

@EnableAutoConfiguration, @Configuration, @ConditionalOnClass 就是自动配置的核心，@EnableAutoConfiguration 给容器导入META-INF/spring.factories 里定义的自动配置类。筛选有效的自动配置类。每一个自动配置类结合对应的 xxxProperties.java 读取配置文件进行自动配置功能

### 你如何理解 Spring Boot 配置加载顺序？

在 Spring Boot 里面，可以使用以下几种方式来加载配置。

1） properties文件；

2） YAML文件；

3） 系统环境变量；

### Spring Boot 是否可以使用 XML 配置 ?

Spring Boot 推荐使用 Java 配置而非 XML 配置，但是也可以使用 XML 配置，通过 @ImportResource 注解可以引入一个 XML 配置。

### Spring Boot 核心配置文件是什么？

bootstrap.properties 配置文件在结合 Spring Cloud会经常遇到，在需要加载一些远程配置文件的时侯使用到

spring boot 核心的两个配置文件：

**bootstrap (. yml 或者 . properties)：**boostrap 由**父ApplicationContext**加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来在 Spring Cloud Config 或者 Nacos 中会用到。且 boostrap 里面的属性不能被覆盖；

**application (. yml 或者 . properties)：**由 ApplicatonContext 加载，用于 spring boot 项目的自动化配置。

### 什么是 Spring Profiles？

Spring Profiles 允许用户根据配置文件（dev，test，prod 等）来注册 bean。因此，当应用程序在开发中运行时，只有某些 bean 可以加载，而在 prod 中，某些其他 bean 可以加载。假设要求是 Swagger 文档仅适用于 QA 环境，并且禁用所有其他文档。这可以使用配置文件来完成。

### 如何在自定义端口上运行 Spring Boot 应用程序？

在 application.properties 中指定端口。server.port = 8090



### todo 如何自定义starter

[https://www.php.cn/blog/detail/799137.html#:~:text=Spring%20Boot%20%E5%AE%98%E6%96%B9%E5%BB%BA%E8%AE%AE%E6%88%91%E4%BB%AC%E5%9C%A8%E8%87%AA%E5%AE%9A%E4%B9%89%20starter%20%E6%97%B6%EF%BC%8C%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%20Module%20%EF%BC%9AautoConfigure%20Module,%E5%92%8C%20starter%20Module%EF%BC%8C%E5%85%B6%E4%B8%AD%20starter%20Module%20%E4%BE%9D%E8%B5%96%E4%BA%8E%20autoConfigure%20Module%E3%80%82](https://www.php.cn/blog/detail/799137.html#:~:text=Spring Boot 官方建议我们在自定义 starter 时，创建两个 Module ：autoConfigure Module,和 starter Module，其中 starter Module 依赖于 autoConfigure Module。)

## 安全

### 如何实现 Spring Boot 应用程序的安全性？

可以使用 spring-boot-starter-security 依赖项，并且必须添加安全配置。它只需要很少的代码。配置类将必须扩展 WebSecurityConfigurerAdapter 并覆盖其方法。

### 比较一下 Spring Security 和 Shiro 各自的优缺点 ?

1. Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级的安全管理框架
2. Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单
3. Spring Security 功能强大；Shiro 功能简单

## Spring Boot 中如何解决跨域问题 ?

项目中前后端分离部署，所以需要解决跨域的问题。

跨域可以在前端通过 JSONP 来解决，但是 JSONP 只可以发送 GET 请求，无法发送其他类型的请求，在 RESTful 风格的应用中，就显得非常鸡肋

推荐在后端通过 （CORS，Cross-origin resource sharing）来解决跨域问题。这种解决方案并非 Spring Boot 特有的，在传统的 SSM 框架中，就可以通过 CORS 来解决跨域问题，只不过之前是在 XML 文件中配置 CORS ，现在可以通过实现WebMvcConfigurer接口然后重写addCorsMappings方法解决跨域问题。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(3600);
    }
}
```

使用cookie存放用户登录的信息，在spring拦截器进行权限控制，当权限不符合时，直接返回给用户固定的json结果。

当用户登录以后，正常使用；当用户退出登录状态时或者token过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。

**一个http请求，先走filter，到达servlet后才进行拦截器的处理，如果把cors放在filter里，就可以优先于权限拦截器执行**

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
```

### 什么是 CSRF 攻击？

CSRF 代表跨站请求伪造，迫使终用户在当前通过身份验证的 Web 应用程序上执行不需要的操作。CSRF 攻击专门针对状态改变请求，而不是数据窃取，因为攻击者无法查看对伪造请求的响应。

## 监视器

### Spring Boot 中的监视器是什么？

Spring boot actuator 监视器可帮助访问生产环境中正在运行的应用程序的当前状态。有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为 HTTP URL 访问的REST 端点来检查状态。

### 如何在 Spring Boot 中禁用 Actuator 端点安全性？

默认情况下，所有敏感的 HTTP 端点都是安全的，只有具有 ACTUATOR 角色的用户才能访问它们。安全性是使用标准的 HttpServletRequest.isUserInRole 方法实施的。 只有在执行机构端点在防火墙后访问时，才建议禁用安全性。

### 如何监视所有 Spring Boot 微服务？

Spring Boot 提供监视器端点以监控各个微服务的度量。这些端点对于获取有关应用程序的信息（如它们是否已启动）以及它们的组件（如数据库等）是否正常运行很有帮助。但是，使用监视器的一个主要缺点或困难是，必须单独打开应用程序的知识点以了解其状态或健康状况。想象一下涉及 50 个应用程序的微服务，管理员将不得不击中所有 50 个应用程序的执行终端。为了处理这种情况，可以使用 Spring-boot-admin。 它建立在 Spring Boot Actuator 之上，它提供了一个 Web UI，使我们能够可视化多个应用程序的度量。



### 什么是 Spring Data

Spring Data 是 Spring 的一个子项目。用于简化数据库访问，支持NoSQL 和 关系数据存储。其主要目标是使数据库的访问变得方便快捷。Spring Data 具有如下特点：

SpringData 项目支持 NoSQL 存储：

1. MongoDB （文档数据库）
2. Neo4j（图形数据库）
3. Redis（键/值存储）
4. Hbase（列族数据库）

SpringData 项目所支持的关系数据存储技术：

1. JDBC
2. JPA

Spring Data Jpa 致力于减少数据访问层 (DAO) 的开发量。开发者唯一要做的，就是声明持久层的接口，其他都交给 Spring Data JPA 来完成

### 什么是 Spring Batch？

Spring Boot Batch 提供可重用的函数，这些函数在处理大量记录时非常重要，包括日志/跟踪，事务管理，作业处理统计信息，作业重新启动，跳过和资源管理。它还提供了更先进的技术服务和功能，通过优化和分区技术，可以实现极高批量和高性能批处理作业。简单以及复杂的大批量批处理作业可以高度可扩展的方式利用框架处理重要大量的信息。

### 什么是 Swagger

Swagger 广泛用于可视化 API，使用 Swagger UI 为前端开发人员提供在线沙箱。Swagger 是用于生成 RESTful Web 服务的可视化表示的工具，规范和完整框架实现。它使文档能够以与服务器相同的速度更新。当通过 Swagger 正确定义时，消费者可以使用 少量的实现逻辑来理解远程服务并与其进行交互。因此，Swagger消除了调用服务时的猜测。

推荐 Knife4j

## 如何重新加载 Spring Boot 上的更改，而无需重新启动服务器？Spring Boot项目如何热部署？

使用 DEV 工具来实现。通过这种依赖关系，任何更改都会使嵌入式tomcat 将重新启动。Spring Boot 有一个开发工具（DevTools）模块，它有助于提高开发人员的生产力。Java 开发人员面临的一个主要挑战是将文件更改自动部署到服务器并自动重启服务器。开发人员可以重新加载 Spring Boot 上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。

Spring Boot 在发布它的第一个版本时没有这个功能。这是开发人员需要的功能。DevTools 模块完全满足开发人员的需求。该模块将在生产环境中被禁用。

它还提供 H2 数据库控制台以更好地测试应用程序。

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring‐boot‐devtools</artifactId>
</dependency>
```

### SpringBoot中常用注解及其底层实现

1. **＠SpringBootApplication注解：**这个注解标识了一个SpringBoot工程，它实际上是另外三个注解的组合，这三个注解是：

1. 1. **＠SpringBootConfiguration：**这个注解实际就是一个＠Configuration，表示启动类也是一个配置类
   2. **＠EnableAutoConfiguration：**向Spring容器中导入了一个Selector，用来加载ClassPath下SpringFactories中所定义的自动配置类，将这些自 动加载为配置Bean
   3. **＠ComponentScan：**标识扫描路径，因为默认是没有配置实际扫描路径，所以SpringBoot扫描的路径是启动类所在的当前目录

1. **＠Bean注解：**用来定义Bean，类似于XML中的＜bean＞标签，Spring在启动时，会对加了＠Bean注解的方法进行解析，将方法的名字做为beanName，并通过执行方法得到bean对象
2. **＠Controller**、**＠Service**、**＠ResponseBody**、**＠Autowired**

### SpringBoot是如何启动Tomcat的

1. 首先，SpringBoot在启动时会先创建一个Spring容器
2. 在创建Spring容器过程中，会利用@ConditionalOnclass技术来判断当前classpath中是否存在Tomcat依赖，如果存在则会生成一个启动Tomcat的Bean
3. Spring容器创建完之后，就会获取启动Tomcat的Bean，并创建Tomcat对象，并绑定端口等，然后启动Tomcat

### SpringBoot中配置文件的加载顺序是怎样的？

优先级从高到低，高优先级的配置赋值低优先级的配置，所有配置会形成互补配置

1. 命令行参数。所有的配置都可以在命令行上进行指定
2. Java系统属性（System.getProperties0）
3. 操作系统环境变量；
4. jar包外部的application-fprofile.properties或application.yml（带spring.profile）配置文件
5. jar包内部的application-fprofile.properties或application.yml（带spring.profile）配置文件再来加载不带profile
6. jar包外部的application.properties或application.yml（不带spring.profile）配置文件
7. ja包内部的application.properties或application.yml（不带springprofile）配置文件
8. @Configuration注解类上的@PropertySource

## 启动相关

### Spring Boot 启动过程

1. 首先创建一个 **SpringApplication对象**，在创建的过程中对资源进行获取：判断该应用应该是什么类型，使用 **SpringFactoriesLoader** 查找并加载注册所有有用的 **ApplicationContextInitializer** 和 **ApplicationListener** 到容器中；
2. 然后由创建出来的对象 **XxxSpringApplication** 执行 **run()** 方法；
3. **run()** 方法的开始会启动一个**时间监视器 StopWatch**，统计项目启动所用的时间；
4. 初始化 **ConfigurableApplicationContext 上下文** 和 **Spring Boot 启动异常收集类集合**；
5. 通过 **SpringFactoriesLoader** 从 **META-INF/Spring.factories** 中获取并实例化**SpringApplicationRunListener 类**并且调用它们的 **starting() 方法**，用于通知所有的 **SpringApplicationRunListener 类**“Spring Boot开始启动了”（**SpringApplicationRunListener** 是只在 Spring Boot 启动过程中接受不同时间点的事件的监听者，用于在Spring Boot的 **run()** 方法执行不同过程中监听执行不同的方法）
6. 创建并配置 Spring Boot 的环境配置 （这里会重新执行一次 run() 方法，如果是debug的时候，需要留意这次run() 方法不同于第一次的run() 方法）
7. 打印 **Banner**
8. 创建 Spring 的 **ApplicationContent 上下文类**
9. 创建 **SpringBootExceptionReporter** 类，用于存放启动的时候错误信息
10. 遍历调用 **SpringApplicationRunListener** 的 **contextLoaded()** 方法通知所有**SpringApplicationRunListener**，告诉它们 **SpringContext** 加载完成。并加载**ConfigurableEnvironment** 和 **Configuration** 类到 **Spring Context** 上下文中
11. 调用 **ApplicationContext** 的 **refresh()** 方法，进行**自动配置模块的加载**，启动Tomcat容器，加载并初始化数据源，消息队列等中间件组件，执行 **@Scheduled** 注解等
12. 计时器停止计时，通知所有的 **SpringApplicationRunListener**：Spring Boot 的上下文刷新完成了
13. 查找实现了 **ApplicationRunner** 或 **CommandLineRunner** 接口的类，并执行它们的 **run()** 方法
14. 最后再遍历执行 **SpringApplicationRunListener** 的 **finished()** 方法，通知 Spring Boot 启动完成