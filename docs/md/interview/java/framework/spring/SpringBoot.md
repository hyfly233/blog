# Spring Boot

## 基础相关

### Spring 与 Spring Boot

**Spring:** Spring 框架是一个开源的 Java EE 开发框架，主要功能是**依赖注入(DI)**或**控制反转(IoC)**。借助 Spring 框架可以开发一个**松耦合**的应用程序。

**SpringBoot:** Spring Boot 是 Spring 框架的一个模块。它允许构建具有最少配置或零配置的独立应用程序。

| **Spring**                                               | **Spring Boot**                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Spring** 是用于构建应用程序的广泛使用的 Java EE 框架。 | **SpringBoot** 被广泛用于开发 **REST API** 。                                                    |
| 简化 Java EE 开发，从而使开发更加高效。                  | 它旨在缩短代码长度，并提供开发 **Web 应用程序**的最简单方法。                                    |
| 主要功能是**依赖注入**。                                 | 主要功能是**自动配置**。根据需求自动配置类。                                                     |
| 开发**松耦合**应用程序，可以使事情变得更简单。           | 有助于创建配置更少的**独立**应用。                                                               |
| 编写了大量代码(**模板代码**)来完成最小的任务。           | **减少**样板代码。                                                                               |
| 需要显式设置服务器。                                     | 提供了**嵌入式服务器**，例如 **Jetty** 和 **Tomcat** 等。                                        |
| 不支持内存数据库。                                       | 提供了多个插件来处理嵌入式和**内存中**数据库。                                                   |
| 开发人员在 **pom.xml** 中为 Spring 项目手动定义依赖项。  | 在 pom.xml 文件中带有 **starter** 概念，该概念内部负责根据 Spring Boot 要求下载依赖项 **JAR** 。 |

### Spring Boot 与 Spring MVC

**Spring Boot:** SpringBoot 使得快速引导和开发 Spring 变得容易。应用。它避免了很多样板代码。它隐藏了很多复杂的信息，可以快速入门并轻松开发基于 Spring 的应用程序。

**Spring MVC:** Spring MVC 是是一个面向 HTTP 的 Web MVC 应用程序开发框架，它包含许多用于各种功能的配置文件。

| **SpringBoot**                                                                    | **SpringMVC**                                                 |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **SpringBoot** 是 Spring 的模块，用于使用合理的默认值打包基于 Spring 的应用程序。 | **SpringMVC** 是 Spring 框架下基于模型视图控制器的 Web 框架。 |
| 它提供了用于构建 **Spring-powered** 框架的默认配置。                              | 它提供了**易于使用**功能来构建 Web 应用程序。                 |
| 无需手动构建配置。                                                                | 它需要手动进行构建配置。                                      |
| **不需要**部署描述符。                                                            | **必需**。                                                    |
| 它避免了样板代码，并将依赖项包装在一个单元中。                                    | 它分别指定每个依赖项。                                        |
| 它**减少**开发时间并提高生产率。                                                  | 相同的功能，要花费**更多**。                                  |

### 什么是 Spring Boot？

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件一站式解决方案，主要是简化了使用 Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。

### Spring Boot 有哪些优点？

Spring Boot 主要有如下优点：

1. 容易上手，提升开发效率，为 Spring 开发提供一个更快、更广泛的入门体验。
2. 开箱即用，远离繁琐的配置。
3. 提供了一系列大型项目通用的非业务性功能，例如：内嵌服务器、安全管理、运行数据监控、运行状况检查和外部化配置等。
4. 没有代码生成，也不需要 XML 配置。
5. 避免大量的 Maven 导入和各种版本冲突。

###

###

### 开启 Spring Boot 特性有哪几种方式？

1）继承 spring-boot-starter-parent 项目

2）导入 spring-boot-dependencies 项目依赖

### 如何使用 Spring Boot 实现异常处理？

Spring 提供了一种使用 ControllerAdvice 处理异常的非常有用的方法。 通过实现一个 ControlerAdvice 类，来处理控制器类抛出的所有异常。

### 如何使用 Spring Boot 实现分页和排序？

使用 Spring Data-JPA 可以实现将可分页的传递给存储库方法。

### Spring Boot 中如何实现定时任务 ?

使用 Spring 中的 @Scheduled 注解，另一个则是使用第三方框架 Quartz、Xxl-job 等

### 什么是 JavaConfig？

Spring JavaConfig 提供了配置 Spring IoC 容器的纯 Java 方法，有助于避免使用 XML 配置。使用 JavaConfig 的优点在于：

-   面向对象的配置。由于配置被定义为 JavaConfig 中的类，因此可以充分利用 Java 中的面向对象功能。一个配置类可以继承另一个，重写它的@Bean 方法等；

-   减少或消除 XML 配置；
-   类型安全和重构友好。JavaConfig 提供了一种类型安全的方法来配置 Spring 容器。由于 Java 5.0 对泛型的支持，现在可以按类型而不是按名称检索 bean，不需要任何强制转换或基于字符串的查找。

### Spring Boot 自动配置原理是什么？

@EnableAutoConfiguration, @Configuration, @ConditionalOnClass 就是自动配置的核心，@EnableAutoConfiguration 给容器导入 META-INF/spring.factories 里定义的自动配置类。筛选有效的自动配置类。每一个自动配置类结合对应的 xxxProperties.java 读取配置文件进行自动配置功能

### 你如何理解 Spring Boot 配置加载顺序？

在 Spring Boot 里面，可以使用以下几种方式来加载配置。

1） properties 文件；

2） YAML 文件；

3） 系统环境变量；

### Spring Boot 是否可以使用 XML 配置 ?

Spring Boot 推荐使用 Java 配置而非 XML 配置，但是也可以使用 XML 配置，通过 @ImportResource 注解可以引入一个 XML 配置。

### Spring Boot 核心配置文件是什么？

bootstrap.properties 配置文件在结合 Spring Cloud 会经常遇到，在需要加载一些远程配置文件的时侯使用到

spring boot 核心的两个配置文件：

**bootstrap (. yml 或者 . properties)：**boostrap 由**父 ApplicationContext**加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来在 Spring Cloud Config 或者 Nacos 中会用到。且 boostrap 里面的属性不能被覆盖；

**application (. yml 或者 . properties)：**由 ApplicatonContext 加载，用于 spring boot 项目的自动化配置。

### 什么是 Spring Profiles？

Spring Profiles 允许用户根据配置文件（dev，test，prod 等）来注册 bean。因此，当应用程序在开发中运行时，只有某些 bean 可以加载，而在 prod 中，某些其他 bean 可以加载。假设要求是 Swagger 文档仅适用于 QA 环境，并且禁用所有其他文档。这可以使用配置文件来完成。

### 如何在自定义端口上运行 Spring Boot 应用程序？

在 application.properties 中指定端口。server.port = 8090

### todo 如何自定义 starter

[https://www.php.cn/blog/detail/799137.html#:~:text=Spring%20Boot%20%E5%AE%98%E6%96%B9%E5%BB%BA%E8%AE%AE%E6%88%91%E4%BB%AC%E5%9C%A8%E8%87%AA%E5%AE%9A%E4%B9%89%20starter%20%E6%97%B6%EF%BC%8C%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%20Module%20%EF%BC%9AautoConfigure%20Module,%E5%92%8C%20starter%20Module%EF%BC%8C%E5%85%B6%E4%B8%AD%20starter%20Module%20%E4%BE%9D%E8%B5%96%E4%BA%8E%20autoConfigure%20Module%E3%80%82](https://www.php.cn/blog/detail/799137.html#:~:text=Spring Boot 官方建议我们在自定义 starter 时，创建两个 Module ：autoConfigure Module,和 starter Module，其中 starter Module 依赖于 autoConfigure Module。)

## 安全相关

### 如何实现 Spring Boot 应用程序的安全性？

可以使用 spring-boot-starter-security 依赖项，并且必须添加安全配置。它只需要很少的代码。配置类将必须扩展 WebSecurityConfigurerAdapter 并覆盖其方法。

### 比较一下 Spring Security 和 Shiro 各自的优缺点 ?

1. Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级的安全管理框架
2. Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单
3. Spring Security 功能强大；Shiro 功能简单

## Spring Boot 中如何解决跨域问题 ?

项目中前后端分离部署，所以需要解决跨域的问题。

跨域可以在前端通过 JSONP 来解决，但是 JSONP 只可以发送 GET 请求，无法发送其他类型的请求，在 RESTful 风格的应用中，就显得非常鸡肋

推荐在后端通过 （CORS，Cross-origin resource sharing）来解决跨域问题。这种解决方案并非 Spring Boot 特有的，在传统的 SSM 框架中，就可以通过 CORS 来解决跨域问题，只不过之前是在 XML 文件中配置 CORS ，现在可以通过实现 WebMvcConfigurer 接口然后重写 addCorsMappings 方法解决跨域问题。

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

使用 cookie 存放用户登录的信息，在 spring 拦截器进行权限控制，当权限不符合时，直接返回给用户固定的 json 结果。

当用户登录以后，正常使用；当用户退出登录状态时或者 token 过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。

**一个 http 请求，先走 filter，到达 servlet 后才进行拦截器的处理，如果把 cors 放在 filter 里，就可以优先于权限拦截器执行**

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

Spring boot actuator 监视器可帮助访问生产环境中正在运行的应用程序的当前状态。有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为 HTTP URL 访问的 REST 端点来检查状态。

### 如何在 Spring Boot 中禁用 Actuator 端点安全性？

默认情况下，所有敏感的 HTTP 端点都是安全的，只有具有 ACTUATOR 角色的用户才能访问它们。安全性是使用标准的 HttpServletRequest.isUserInRole 方法实施的。 只有在执行机构端点在防火墙后访问时，才建议禁用安全性。

### 如何监视所有 Spring Boot 微服务？

Spring Boot 提供监视器端点以监控各个微服务的度量。这些端点对于获取有关应用程序的信息（如它们是否已启动）以及它们的组件（如数据库等）是否正常运行很有帮助。但是，使用监视器的一个主要缺点或困难是，必须单独打开应用程序的知识点以了解其状态或健康状况。想象一下涉及 50 个应用程序的微服务，管理员将不得不击中所有 50 个应用程序的执行终端。为了处理这种情况，可以使用 Spring-boot-admin。 它建立在 Spring Boot Actuator 之上，它提供了一个 Web UI，使我们能够可视化多个应用程序的度量。

## 注解相关

### SpringBoot 中常用注解及其底层实现

1. **＠SpringBootApplication 注解：**这个注解标识了一个 SpringBoot 工程，它实际上是另外三个注解的组合，这三个注解是：

1.  1. **＠SpringBootConfiguration：**这个注解实际就是一个＠Configuration，表示启动类也是一个配置类
    2. **＠EnableAutoConfiguration：**向 Spring 容器中导入了一个 Selector，用来加载 ClassPath 下 SpringFactories 中所定义的自动配置类，将这些自 动加载为配置 Bean
    3. **＠ComponentScan：**标识扫描路径，因为默认是没有配置实际扫描路径，所以 SpringBoot 扫描的路径是启动类所在的当前目录

1. **＠Bean 注解：**用来定义 Bean，类似于 XML 中的＜ bean ＞标签，Spring 在启动时，会对加了＠Bean 注解的方法进行解析，将方法的名字做为 beanName，并通过执行方法得到 bean 对象
1. **＠Controller**、**＠Service**、**＠ResponseBody**、**＠Autowired**

### Spring Boot 的核心注解是哪个？它主要由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：

-   **@SpringBootConfiguration：**组合了 @Configuration 注解，实现配置文件的功能。
-   **@EnableAutoConfiguration：**打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能：@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
-   **@ComponentScan：**Spring 组件扫描

## 启动相关

### 运行 Spring Boot 有哪几种方式？

1. 打包用命令或者放到容器中运行
2. 用 Maven/Gradle 插件运行
3. 直接执行 main 方法运行

### Spring Boot 启动过程

1. 首先创建一个 **SpringApplication 对象**，在创建的过程中对资源进行获取：判断该应用应该是什么类型，使用 **SpringFactoriesLoader** 查找并加载注册所有有用的 **ApplicationContextInitializer** 和 **ApplicationListener** 到容器中；
2. 然后由创建出来的对象 **XxxSpringApplication** 执行 **run()** 方法；
3. **run()** 方法的开始会启动一个**时间监视器 StopWatch**，统计项目启动所用的时间；
4. 初始化 **ConfigurableApplicationContext 上下文** 和 **Spring Boot 启动异常收集类集合**；
5. 通过 **SpringFactoriesLoader** 从 **META-INF/Spring.factories** 中获取并实例化**SpringApplicationRunListener 类**并且调用它们的 **starting() 方法**，用于通知所有的 **SpringApplicationRunListener 类**“Spring Boot 开始启动了”（**SpringApplicationRunListener** 是只在 Spring Boot 启动过程中接受不同时间点的事件的监听者，用于在 Spring Boot 的 **run()** 方法执行不同过程中监听执行不同的方法）
6. 创建并配置 Spring Boot 的环境配置 （这里会重新执行一次 run() 方法，如果是 debug 的时候，需要留意这次 run() 方法不同于第一次的 run() 方法）
7. 打印 **Banner**
8. 创建 Spring 的 **ApplicationContent 上下文类**
9. 创建 **SpringBootExceptionReporter** 类，用于存放启动的时候错误信息
10. 遍历调用 **SpringApplicationRunListener** 的 **contextLoaded()** 方法通知所有**SpringApplicationRunListener**，告诉它们 **SpringContext** 加载完成。并加载**ConfigurableEnvironment** 和 **Configuration** 类到 **Spring Context** 上下文中
11. 调用 **ApplicationContext** 的 **refresh()** 方法，进行**自动配置模块的加载**，启动 Tomcat 容器，加载并初始化数据源，消息队列等中间件组件，执行 **@Scheduled** 注解等
12. 计时器停止计时，通知所有的 **SpringApplicationRunListener**：Spring Boot 的上下文刷新完成了
13. 查找实现了 **ApplicationRunner** 或 **CommandLineRunner** 接口的类，并执行它们的 **run()** 方法
14. 最后再遍历执行 **SpringApplicationRunListener** 的 **finished()** 方法，通知 Spring Boot 启动完成

### Spring Boot 启动过程简单概括

1. **加载应用程序类路径中的配置文件和依赖项**
   在应用程序启动时，Spring Boot 会加载应用程序类路径中的所有配置文件和依赖项。这些配置文件包括 application.properties、application.yml、bootstrap.properties、bootstrap.yml 等。Spring Boot 使用默认配置来加载这些配置文件，但是你也可以自定义配置文件的位置和名称。
2. **创建 Spring 应用程序上下文**
   Spring Boot 会创建一个 Spring 应用程序上下文（ApplicationContext），它是一个依赖注入容器，用于管理应用程序中的所有 bean。Spring Boot 会自动扫描应用程序中的所有 bean，并将它们注册到应用程序上下文中。
3. **执行自动配置**
   Spring Boot 的自动配置机制会根据应用程序中的类路径和配置文件来自动配置应用程序。例如，如果应用程序中包含了 Spring MVC 相关的类和配置文件，Spring Boot 会自动配置一个基于 Spring MVC 的 Web 应用程序。
4. **启动 Web 服务器**
   如果应用程序中包含 Web 组件，Spring Boot 会自动启动一个内嵌的 Web 服务器。默认情况下，Spring Boot 使用 Tomcat 作为默认的 Web 服务器，但是你也可以使用 Jetty 或 Undertow 等其他 Web 服务器。
5. **运行应用程序**
   最后，Spring Boot 启动应用程序并运行它

总之，Spring Boot 的启动过程主要包括加载配置文件和依赖项、创建应用程序上下文、执行自动配置、启动 Web 服务器以及运行应用程序。通过这个过程，Spring Boot 简化了应用程序的开发和部署，并提供了一种快速、简单、灵活的方式来构建 Spring 应用程序。

### SpringBoot 是如何启动 Tomcat 的

1. 首先，SpringBoot 在启动时会先创建一个 Spring 容器
2. 在创建 Spring 容器过程中，会利用@ConditionalOnclass 技术来判断当前 classpath 中是否存在 Tomcat 依赖，如果存在则会生成一个启动 Tomcat 的 Bean
3. Spring 容器创建完之后，就会获取启动 Tomcat 的 Bean，并创建 Tomcat 对象，并绑定端口等，然后启动 Tomcat

### SpringBoot 中配置文件的加载顺序是怎样的？

优先级从高到低，高优先级的配置赋值低优先级的配置，所有配置会形成互补配置

1. 命令行参数。所有的配置都可以在命令行上进行指定
2. Java 系统属性（System.getProperties0）
3. 操作系统环境变量；
4. jar 包外部的 application-fprofile.properties 或 application.yml（带 spring.profile）配置文件
5. jar 包内部的 application-fprofile.properties 或 application.yml（带 spring.profile）配置文件再来加载不带 profile
6. jar 包外部的 application.properties 或 application.yml（不带 spring.profile）配置文件
7. ja 包内部的 application.properties 或 application.yml（不带 springprofile）配置文件
8. @Configuration 注解类上的@PropertySource

### Spring Boot 项目如何热部署？

使用 DEV 工具来实现。通过这种依赖关系，任何更改都会使嵌入式 tomcat 将重新启动。Spring Boot 有一个开发工具（DevTools）模块，它有助于提高开发人员的生产力。Java 开发人员面临的一个主要挑战是将文件更改自动部署到服务器并自动重启服务器。开发人员可以重新加载 Spring Boot 上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。

Spring Boot 在发布它的第一个版本时没有这个功能。这是开发人员需要的功能。DevTools 模块完全满足开发人员的需求。该模块将在生产环境中被禁用。

它还提供 H2 数据库控制台以更好地测试应用程序。

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring‐boot‐devtools</artifactId>
</dependency>
```

##

## 其他

### 什么是 Spring Data

Spring Data 是 Spring 的一个子项目。用于简化数据库访问，支持 NoSQL 和 关系数据存储。其主要目标是使数据库的访问变得方便快捷。Spring Data 具有如下特点：

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

# Spring Boot 技术指南

## 1. Spring Boot 概述

### 1.1 Spring Boot 简介

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件的一站式解决方案。它基于 Spring 框架，通过自动配置和起步依赖等特性，极大地简化了 Spring 应用的初始搭建以及开发过程。

### 1.2 Spring Boot 核心特性

**设计理念：**

-   **约定优于配置**（Convention over Configuration）
-   **开箱即用**（Opinionated Defaults）
-   **生产就绪**（Production Ready）

**核心优势：**

1. **快速创建独立运行的 Spring 应用程序**
2. **直接嵌入 Tomcat、Jetty 或 Undertow**（无需部署 WAR 文件）
3. **提供 starter POMs 来简化 Maven 配置**
4. **尽可能自动配置 Spring**
5. **提供生产就绪型功能**，如指标、健康检查和外部化配置
6. **完全不需要代码生成和 XML 配置**

### 1.3 Spring vs Spring Boot vs Spring MVC 对比

#### Spring vs Spring Boot 详细对比

| 特性         | Spring Framework                | Spring Boot                    |
| ------------ | ------------------------------- | ------------------------------ |
| **定位**     | 企业级 Java 开发框架            | Spring 应用快速开发脚手架      |
| **核心功能** | 依赖注入（DI）、控制反转（IoC） | 自动配置、起步依赖             |
| **配置方式** | 大量 XML 或 Java 配置           | 零配置或最少配置               |
| **部署方式** | 需要外部 Web 服务器             | 内嵌式服务器，打包为可执行 JAR |
| **依赖管理** | 手动配置所有依赖                | Starter 自动管理依赖版本       |
| **开发效率** | 配置繁琐，开发周期长            | 快速启动，提高开发效率         |
| **适用场景** | 复杂企业应用，需要精确控制      | 快速开发，微服务架构           |

#### Spring Boot vs Spring MVC 详细对比

| 特性           | Spring MVC             | Spring Boot               |
| -------------- | ---------------------- | ------------------------- |
| **层次关系**   | Spring 框架的 Web 模块 | Spring 生态的应用开发平台 |
| **配置复杂度** | 需要大量 XML 配置      | 自动配置，零配置启动      |
| **部署描述符** | 需要 web.xml           | 不需要部署描述符          |
| **服务器配置** | 手动配置外部服务器     | 内嵌服务器，自动配置      |
| **依赖管理**   | 逐个指定依赖           | Starter 统一管理          |
| **开发体验**   | 配置繁琐，启动慢       | 快速启动，开发友好        |

### 1.4 Spring Boot 核心优势

**开发效率提升：**

1. **容易上手**：提供更快、更广泛的入门体验
2. **开箱即用**：远离繁琐的配置工作
3. **约定大于配置**：智能默认配置减少决策成本

**企业级特性：**

1. **内嵌服务器**：Tomcat、Jetty、Undertow
2. **安全管理**：集成 Spring Security
3. **运行监控**：Actuator 提供健康检查、指标收集
4. **外部化配置**：灵活的配置管理机制

**开发体验：**

1. **无代码生成**：纯 Java 配置，类型安全
2. **无 XML 配置**：注解驱动开发
3. **版本管理**：避免 Maven 依赖冲突

## 2. 核心注解与配置

### 2.1 @SpringBootApplication 核心注解

`@SpringBootApplication` 是 Spring Boot 的核心注解，它是一个复合注解，包含以下三个重要注解：

```java
@SpringBootApplication
// 等价于以下三个注解的组合
@SpringBootConfiguration  // 配置类
@EnableAutoConfiguration  // 自动配置
@ComponentScan           // 组件扫描
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 核心注解详解

**1. @SpringBootConfiguration**

-   本质上是 `@Configuration` 注解的特化版本
-   标识启动类也是一个配置类
-   允许在启动类中定义 Bean

**2. @EnableAutoConfiguration**

-   Spring Boot 自动配置的核心
-   根据类路径中的 jar 依赖自动配置 Spring 应用
-   使用 `SpringFactoriesLoader` 加载 `META-INF/spring.factories` 中的配置类

**3. @ComponentScan**

-   自动扫描并加载符合条件的组件
-   默认扫描启动类所在包及其子包
-   可通过 `basePackages` 属性自定义扫描路径

### 2.2 常用注解详解

**Bean 定义注解：**

```java
@Component    // 通用组件
@Service      // 业务层组件
@Repository   // 数据访问层组件
@Controller   // 控制层组件
@RestController // REST 控制器，组合了 @Controller 和 @ResponseBody
@Configuration // 配置类
@Bean         // Bean 定义方法
```

**依赖注入注解：**

```java
@Autowired    // 自动装配
@Qualifier    // 指定注入的 Bean 名称
@Resource     // JSR-250 标准注解
@Value        // 注入配置值
```

**条件化配置注解：**

```java
@ConditionalOnClass        // 类路径存在指定类时生效
@ConditionalOnMissingBean  // 容器中不存在指定 Bean 时生效
@ConditionalOnProperty     // 配置属性满足条件时生效
@ConditionalOnWebApplication // Web 应用环境时生效
```

### 2.3 配置文件管理

#### 核心配置文件

**1. application.properties / application.yml**

-   主配置文件，用于 Spring Boot 项目的自动化配置
-   由 `ApplicationContext` 加载
-   支持环境特定配置（如 application-dev.yml）

**2. bootstrap.properties / bootstrap.yml**

-   引导配置文件，优先级高于 application 配置
-   由父 `ApplicationContext` 加载
-   主要用于 Spring Cloud 配置中心
-   配置属性不能被覆盖

#### 配置加载顺序（优先级从高到低）

1. **命令行参数**
2. **SPRING_APPLICATION_JSON 中的属性**
3. **ServletConfig 初始化参数**
4. **ServletContext 初始化参数**
5. **java:comp/env 里的 JNDI 属性**
6. **Java 系统属性（System.getProperties()）**
7. **操作系统环境变量**
8. **RandomValuePropertySource 配置的 random.\* 属性**
9. **jar 包外部的 application-{profile}.properties/yml**
10. **jar 包内部的 application-{profile}.properties/yml**
11. **jar 包外部的 application.properties/yml**
12. **jar 包内部的 application.properties/yml**
13. **@Configuration 注解类上的 @PropertySource**
14. **默认属性（SpringApplication.setDefaultProperties）**

### 2.4 Profile 环境配置

**Profile 概念：**
Spring Profiles 提供了一种隔离应用程序配置的方式，使其只在特定环境中生效。

**使用方式：**

```yaml
# application.yml
spring:
    profiles:
        active: dev

---
# 开发环境配置
spring:
    profiles: dev
    datasource:
        url: jdbc:mysql://localhost:3306/dev_db

---
# 生产环境配置
spring:
    profiles: prod
    datasource:
        url: jdbc:mysql://prod-server:3306/prod_db
```

**激活 Profile：**

```bash
# 1. 命令行参数
java -jar app.jar --spring.profiles.active=prod

# 2. 环境变量
export SPRING_PROFILES_ACTIVE=prod

# 3. 代码中设置
System.setProperty("spring.profiles.active", "prod");
```

### 2.5 JavaConfig 配置

**JavaConfig 优势：**

-   **类型安全**：编译时检查配置错误
-   **面向对象**：可以使用继承、多态等特性
-   **重构友好**：IDE 支持重构
-   **无 XML**：纯 Java 配置

**示例：**

```java
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.example")
public class WebConfig implements WebMvcConfigurer {

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/db");
        dataSource.setUsername("user");
        dataSource.setPassword("password");
        return dataSource;
    }

    @Bean
    @ConditionalOnMissingBean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(jedisConnectionFactory());
        return template;
    }
}
```

### 2.6 开启 Spring Boot 特性

**方式一：继承 spring-boot-starter-parent**

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
    <relativePath/>
</parent>
```

**方式二：导入 spring-boot-dependencies**

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.7.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 3. 自动配置原理

### 3.1 自动配置机制概述

Spring Boot 的自动配置是其核心特性之一，通过 `@EnableAutoConfiguration` 注解实现。它能够根据类路径中的 jar 依赖自动配置 Spring 应用程序。

### 3.2 自动配置原理详解

**核心组件：**

-   `@EnableAutoConfiguration`：启用自动配置
-   `@Configuration`：配置类标识
-   `@ConditionalOnClass`：条件装配
-   `SpringFactoriesLoader`：配置加载器

**工作流程：**

1. **启动扫描**：`@EnableAutoConfiguration` 触发自动配置
2. **加载配置类**：`SpringFactoriesLoader` 从 `META-INF/spring.factories` 加载配置类
3. **条件筛选**：根据 `@Conditional` 注解进行条件匹配
4. **实例化 Bean**：满足条件的配置类被实例化并注册到容器

**spring.factories 示例：**

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration,\
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
```

### 3.3 条件化配置注解

**常用条件注解：**

```java
@ConditionalOnClass(DataSource.class)          // 类存在
@ConditionalOnMissingClass("com.example.Foo")  // 类不存在
@ConditionalOnBean(DataSource.class)           // Bean存在
@ConditionalOnMissingBean(DataSource.class)    // Bean不存在
@ConditionalOnProperty(name = "app.enabled")   // 属性匹配
@ConditionalOnWebApplication                   // Web应用
@ConditionalOnNotWebApplication               // 非Web应用
@ConditionalOnResource(resources = "file.txt") // 资源存在
```

**自定义条件示例：**

```java
@Configuration
@ConditionalOnClass({DataSource.class, JdbcTemplate.class})
@ConditionalOnSingleCandidate(DataSource.class)
@EnableConfigurationProperties(JdbcProperties.class)
public class JdbcTemplateAutoConfiguration {

    @Bean
    @Primary
    @ConditionalOnMissingBean(JdbcOperations.class)
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

### 3.4 自定义 Starter

**Starter 设计原则：**

-   **命名规范**：第三方 starter 命名为 `xxx-spring-boot-starter`
-   **模块化设计**：autoconfigure 模块 + starter 模块
-   **条件装配**：使用 `@Conditional` 实现智能配置

**创建自定义 Starter 步骤：**

**1. 创建 AutoConfigure 模块**

```java
@Configuration
@ConditionalOnClass(MyService.class)
@EnableConfigurationProperties(MyProperties.class)
public class MyServiceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyProperties properties) {
        return new MyService(properties.getName(), properties.getTimeout());
    }
}
```

**2. 创建 Properties 配置类**

```java
@ConfigurationProperties(prefix = "my.service")
public class MyProperties {
    private String name = "default";
    private int timeout = 30;

    // getters and setters
}
```

**3. 创建 spring.factories**

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.MyServiceAutoConfiguration
```

**4. 创建 Starter 模块**

```xml
<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>my-service-autoconfigure</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
</dependencies>
```

### 3.5 XML 配置支持

虽然 Spring Boot 推荐使用 Java 配置，但仍然支持 XML 配置：

```java
@SpringBootApplication
@ImportResource("classpath:applicationContext.xml")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 3.6 端口配置

**配置应用端口：**

```properties
# application.properties
server.port=8090

# 随机端口
server.port=0

# 禁用Web服务器
spring.main.web-application-type=none
```

```yaml
# application.yml
server:
    port: 8090
    servlet:
        context-path: /api
    tomcat:
        max-threads: 200
```

## 4. 启动过程与生命周期

### 4.1 Spring Boot 启动方式

**启动方式汇总：**

1. **直接执行 main 方法**（开发环境）
2. **Maven/Gradle 插件运行**
    ```bash
    mvn spring-boot:run
    gradle bootRun
    ```
3. **打包后运行**
    ```bash
    java -jar application.jar
    ```
4. **Docker 容器运行**
    ```dockerfile
    FROM openjdk:8-jre-slim
    COPY app.jar /app.jar
    ENTRYPOINT ["java", "-jar", "/app.jar"]
    ```

### 4.2 详细启动过程

**核心启动流程：**

```java
public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
}
```

**详细启动步骤：**

**1. 创建 SpringApplication 对象**

```java
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));

    // 判断应用类型（Servlet、Reactive、None）
    this.webApplicationType = WebApplicationType.deduceFromClasspath();

    // 加载 ApplicationContextInitializer
    setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));

    // 加载 ApplicationListener
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));

    // 推断主类
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

**2. 执行 run() 方法**

```java
public ConfigurableApplicationContext run(String... args) {
    // 创建并启动计时器
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    ConfigurableApplicationContext context = null;
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();

    // 配置 headless 属性
    configureHeadlessProperty();

    // 获取并启动监听器
    SpringApplicationRunListeners listeners = getRunListeners(args);
    listeners.starting();

    try {
        // 封装命令行参数
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);

        // 准备环境
        ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
        configureIgnoreBeanInfo(environment);

        // 打印 Banner
        Banner printedBanner = printBanner(environment);

        // 创建应用上下文
        context = createApplicationContext();

        // 准备异常报告器
        exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
                new Class[] { ConfigurableApplicationContext.class }, context);

        // 准备上下文
        prepareContext(context, environment, listeners, applicationArguments, printedBanner);

        // 刷新上下文（核心）
        refreshContext(context);

        // 刷新后处理
        afterRefresh(context, applicationArguments);

        // 停止计时器
        stopWatch.stop();

        // 发布启动完成事件
        listeners.started(context);

        // 调用 Runner
        callRunners(context, applicationArguments);

    } catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, listeners);
        throw new IllegalStateException(ex);
    }

    try {
        listeners.running(context);
    } catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, null);
        throw new IllegalStateException(ex);
    }
    return context;
}
```

### 4.3 关键启动阶段详解

**环境准备阶段（prepareEnvironment）：**

-   创建和配置环境对象
-   绑定命令行参数
-   加载配置文件（application.properties/yml）
-   触发 ApplicationEnvironmentPreparedEvent 事件

**上下文创建阶段（createApplicationContext）：**

```java
protected ConfigurableApplicationContext createApplicationContext() {
    Class<?> contextClass = this.applicationContextClass;
    if (contextClass == null) {
        try {
            switch (this.webApplicationType) {
            case SERVLET:
                contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
                break;
            case REACTIVE:
                contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
                break;
            default:
                contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
            }
        } catch (ClassNotFoundException ex) {
            throw new IllegalStateException("Unable create a default ApplicationContext, " +
                    "please specify an ApplicationContextClass", ex);
        }
    }
    return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}
```

**上下文刷新阶段（refreshContext）：**

-   执行 BeanFactoryPostProcessor
-   注册 BeanPostProcessor
-   初始化消息源（MessageSource）
-   初始化事件广播器
-   启动内嵌服务器（如 Tomcat）
-   注册监听器
-   实例化所有非懒加载的单例 Bean
-   完成刷新，发布 ContextRefreshedEvent

### 4.4 内嵌服务器启动原理

**Tomcat 启动过程：**

1. **判断 Tomcat 依赖**：通过 `@ConditionalOnClass` 检查类路径
2. **创建 TomcatServletWebServerFactory**
3. **配置 Tomcat**：端口、上下文路径、连接器等
4. **启动服务器**：在 `onRefresh()` 方法中启动

```java
@Configuration
@ConditionalOnClass({Servlet.class, Tomcat.class, UpgradeProtocol.class})
@ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
public static class EmbeddedTomcat {

    @Bean
    public TomcatServletWebServerFactory tomcatServletWebServerFactory() {
        return new TomcatServletWebServerFactory();
    }
}
```

### 4.5 应用生命周期回调

**ApplicationRunner 和 CommandLineRunner：**

```java
@Component
@Order(1)
public class MyApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("ApplicationRunner executed");
    }
}

@Component
@Order(2)
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        System.out.println("CommandLineRunner executed");
    }
}
```

**Spring 应用事件：**

```java
@EventListener
public class ApplicationEventListener {

    @EventListener
    public void handleContextStarted(ContextStartedEvent event) {
        System.out.println("Context Started");
    }

    @EventListener
    public void handleContextStopped(ContextStoppedEvent event) {
        System.out.println("Context Stopped");
    }
}
```

## 5. Web 开发与功能特性

### 5.1 异常处理机制

**全局异常处理：**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse("INVALID_ARGUMENT", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(DataNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleDataNotFound(DataNotFoundException ex) {
        return new ErrorResponse("DATA_NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", "系统内部错误");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

**自定义错误页面：**

```java
@Controller
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Integer statusCode = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (statusCode == 404) {
            return "error/404";
        } else if (statusCode == 500) {
            return "error/500";
        }
        return "error/general";
    }
}
```

### 5.2 数据分页和排序

**Spring Data JPA 分页：**

```java
@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public Page<User> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return userRepository.findAll(pageable);
    }
}
```

**Repository 接口：**

```java
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    Page<User> findByNameContaining(String name, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.age > :age")
    Slice<User> findByAgeGreaterThan(@Param("age") int age, Pageable pageable);
}
```

### 5.3 定时任务实现

**@Scheduled 注解：**

```java
@Component
@EnableScheduling
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    // 固定延迟
    @Scheduled(fixedDelay = 5000)
    public void fixedDelayTask() {
        logger.info("Fixed delay task executed at {}", new Date());
    }

    // 固定频率
    @Scheduled(fixedRate = 10000)
    public void fixedRateTask() {
        logger.info("Fixed rate task executed at {}", new Date());
    }

    // Cron 表达式
    @Scheduled(cron = "0 0 12 * * ?")
    public void cronTask() {
        logger.info("Cron task executed at {}", new Date());
    }

    // 初始延迟
    @Scheduled(fixedRate = 5000, initialDelay = 2000)
    public void initialDelayTask() {
        logger.info("Initial delay task executed at {}", new Date());
    }
}
```

**Quartz 集成：**

```java
@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail myJobDetail() {
        return JobBuilder.newJob(MyJob.class)
            .withIdentity("myJob")
            .storeDurably()
            .build();
    }

    @Bean
    public Trigger myJobTrigger() {
        return TriggerBuilder.newTrigger()
            .forJob(myJobDetail())
            .withIdentity("myTrigger")
            .withSchedule(CronScheduleBuilder.cronSchedule("0/10 * * * * ?"))
            .build();
    }
}
```

### 5.4 跨域问题解决

**全局 CORS 配置：**

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**Filter 方式配置 CORS：**

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
```

**注解方式：**

```java
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ApiController {

    @CrossOrigin(methods = {RequestMethod.GET, RequestMethod.POST})
    @GetMapping("/data")
    public ResponseEntity<String> getData() {
        return ResponseEntity.ok("Data retrieved successfully");
    }
}
```

### 5.5 开发工具与热部署

**DevTools 配置：**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

**DevTools 特性：**

-   **自动重启**：检测到类路径文件变化时自动重启
-   **LiveReload**：浏览器自动刷新
-   **全局设置**：支持全局开发者设置
-   **远程应用**：支持远程应用调试

**配置示例：**

```properties
# application-dev.properties
spring.devtools.restart.enabled=true
spring.devtools.restart.additional-paths=src/main/java
spring.devtools.restart.exclude=static/**,public/**
spring.devtools.livereload.enabled=true
spring.devtools.livereload.port=35729
```

## 6. 安全与监控

### 6.1 Spring Security 集成

**基本安全配置：**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/login", "/register").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            )
            .csrf().disable()
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
```

**JWT 认证实现：**

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);

        if (token != null && tokenProvider.validateToken(token)) {
            Authentication auth = tokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

**Spring Security vs Apache Shiro 对比：**

| 特性            | Spring Security  | Apache Shiro     |
| --------------- | ---------------- | ---------------- |
| **复杂度**      | 重量级，配置复杂 | 轻量级，配置简单 |
| **学习曲线**    | 陡峭，概念复杂   | 平缓，易于理解   |
| **功能丰富度**  | 功能强大，企业级 | 功能适中，够用   |
| **Spring 集成** | 完美集成         | 需要额外配置     |
| **社区支持**    | Spring 官方支持  | Apache 社区支持  |
| **适用场景**    | 复杂企业应用     | 中小型应用       |

### 6.2 CSRF 攻击防护

**CSRF 攻击概念：**
Cross-Site Request Forgery（跨站请求伪造）是一种网络攻击方式，攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。

**防护机制：**

```java
@Configuration
@EnableWebSecurity
public class CsrfConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/public/**")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
```

**前端 CSRF Token 处理：**

```javascript
// 获取 CSRF Token
const csrfToken = document
    .querySelector('meta[name="_csrf"]')
    .getAttribute("content");
const csrfHeader = document
    .querySelector('meta[name="_csrf_header"]')
    .getAttribute("content");

// AJAX 请求中包含 Token
fetch("/api/data", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        [csrfHeader]: csrfToken,
    },
    body: JSON.stringify(data),
});
```

### 6.3 Spring Boot Actuator 监控

**Actuator 基本配置：**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```yaml
# application.yml
management:
    endpoints:
        web:
            exposure:
                include: health,info,metrics,env,beans
            base-path: /actuator
    endpoint:
        health:
            show-details: when-authorized
        info:
            enabled: true
    info:
        env:
            enabled: true
        git:
            mode: simple
```

**常用 Actuator 端点：**

| 端点                    | 描述         | 默认启用 |
| ----------------------- | ------------ | -------- |
| `/actuator/health`      | 应用健康状况 | 是       |
| `/actuator/info`        | 应用信息     | 是       |
| `/actuator/metrics`     | 应用指标     | 是       |
| `/actuator/env`         | 环境属性     | 否       |
| `/actuator/beans`       | Spring Beans | 否       |
| `/actuator/configprops` | 配置属性     | 否       |
| `/actuator/httptrace`   | HTTP 跟踪    | 否       |
| `/actuator/shutdown`    | 优雅关闭     | 否       |

**自定义健康检查：**

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        int errorCode = check();

        if (errorCode != 0) {
            return Health.down()
                .withDetail("Error Code", errorCode)
                .withDetail("Description", "Custom health check failed")
                .build();
        }

        return Health.up()
            .withDetail("Custom Service", "Available")
            .withDetail("Check Time", new Date())
            .build();
    }

    private int check() {
        // 自定义健康检查逻辑
        return 0;
    }
}
```

**自定义指标：**

```java
@RestController
public class MetricsController {

    private final MeterRegistry meterRegistry;
    private final Counter customCounter;
    private final Timer customTimer;

    public MetricsController(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.customCounter = Counter.builder("custom.requests")
            .description("Custom request counter")
            .register(meterRegistry);
        this.customTimer = Timer.builder("custom.request.duration")
            .description("Custom request duration")
            .register(meterRegistry);
    }

    @GetMapping("/api/data")
    public ResponseEntity<String> getData() {
        return Timer.Sample.start(meterRegistry)
            .stop(customTimer)
            .recordCallable(() -> {
                customCounter.increment();
                return ResponseEntity.ok("Data retrieved");
            });
    }
}
```

### 6.4 Actuator 安全配置

**端点安全配置：**

```java
@Configuration
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {
        http
            .requestMatcher(EndpointRequest.toAnyEndpoint())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
                .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("ACTUATOR")
            )
            .httpBasic();

        return http.build();
    }
}
```

**生产环境监控配置：**

```yaml
management:
    endpoints:
        web:
            exposure:
                include: health,metrics,prometheus
    endpoint:
        health:
            show-details: never
    security:
        enabled: true
        roles: ACTUATOR
```

### 6.5 微服务监控

**Spring Boot Admin 集成：**

```xml
<!-- Admin Server -->
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-server</artifactId>
</dependency>

<!-- Admin Client -->
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>
```

**Admin Server 配置：**

```java
@SpringBootApplication
@EnableAdminServer
public class AdminServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminServerApplication.class, args);
    }
}
```

**Admin Client 配置：**

```yaml
spring:
    boot:
        admin:
            client:
                url: http://localhost:8080
                instance:
                    prefer-ip: true
management:
    endpoints:
        web:
            exposure:
                include: "*"
```

## 注解相关

### SpringBoot 中常用注解及其底层实现

1. **＠SpringBootApplication 注解：**这个注解标识了一个 SpringBoot 工程，它实际上是另外三个注解的组合，这三个注解是：

1.  1. **＠SpringBootConfiguration：**这个注解实际就是一个＠Configuration，表示启动类也是一个配置类
    2. **＠EnableAutoConfiguration：**向 Spring 容器中导入了一个 Selector，用来加载 ClassPath 下 SpringFactories 中所定义的自动配置类，将这些自 动加载为配置 Bean
    3. **＠ComponentScan：**标识扫描路径，因为默认是没有配置实际扫描路径，所以 SpringBoot 扫描的路径是启动类所在的当前目录

1. **＠Bean 注解：**用来定义 Bean，类似于 XML 中的＜ bean ＞标签，Spring 在启动时，会对加了＠Bean 注解的方法进行解析，将方法的名字做为 beanName，并通过执行方法得到 bean 对象
1. **＠Controller**、**＠Service**、**＠ResponseBody**、**＠Autowired**

### Spring Boot 的核心注解是哪个？它主要由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：

-   **@SpringBootConfiguration：**组合了 @Configuration 注解，实现配置文件的功能。
-   **@EnableAutoConfiguration：**打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能：@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
-   **@ComponentScan：**Spring 组件扫描

## 启动相关

### 运行 Spring Boot 有哪几种方式？

1. 打包用命令或者放到容器中运行
2. 用 Maven/Gradle 插件运行
3. 直接执行 main 方法运行

### Spring Boot 启动过程

1. 首先创建一个 **SpringApplication 对象**，在创建的过程中对资源进行获取：判断该应用应该是什么类型，使用 **SpringFactoriesLoader** 查找并加载注册所有有用的 **ApplicationContextInitializer** 和 **ApplicationListener** 到容器中；
2. 然后由创建出来的对象 **XxxSpringApplication** 执行 **run()** 方法；
3. **run()** 方法的开始会启动一个**时间监视器 StopWatch**，统计项目启动所用的时间；
4. 初始化 **ConfigurableApplicationContext 上下文** 和 **Spring Boot 启动异常收集类集合**；
5. 通过 **SpringFactoriesLoader** 从 **META-INF/Spring.factories** 中获取并实例化**SpringApplicationRunListener 类**并且调用它们的 **starting() 方法**，用于通知所有的 **SpringApplicationRunListener 类**“Spring Boot 开始启动了”（**SpringApplicationRunListener** 是只在 Spring Boot 启动过程中接受不同时间点的事件的监听者，用于在 Spring Boot 的 **run()** 方法执行不同过程中监听执行不同的方法）
6. 创建并配置 Spring Boot 的环境配置 （这里会重新执行一次 run() 方法，如果是 debug 的时候，需要留意这次 run() 方法不同于第一次的 run() 方法）
7. 打印 **Banner**
8. 创建 Spring 的 **ApplicationContent 上下文类**
9. 创建 **SpringBootExceptionReporter** 类，用于存放启动的时候错误信息
10. 遍历调用 **SpringApplicationRunListener** 的 **contextLoaded()** 方法通知所有**SpringApplicationRunListener**，告诉它们 **SpringContext** 加载完成。并加载**ConfigurableEnvironment** 和 **Configuration** 类到 **Spring Context** 上下文中
11. 调用 **ApplicationContext** 的 **refresh()** 方法，进行**自动配置模块的加载**，启动 Tomcat 容器，加载并初始化数据源，消息队列等中间件组件，执行 **@Scheduled** 注解等
12. 计时器停止计时，通知所有的 **SpringApplicationRunListener**：Spring Boot 的上下文刷新完成了
13. 查找实现了 **ApplicationRunner** 或 **CommandLineRunner** 接口的类，并执行它们的 **run()** 方法
14. 最后再遍历执行 **SpringApplicationRunListener** 的 **finished()** 方法，通知 Spring Boot 启动完成

### Spring Boot 启动过程简单概括

1. **加载应用程序类路径中的配置文件和依赖项**
   在应用程序启动时，Spring Boot 会加载应用程序类路径中的所有配置文件和依赖项。这些配置文件包括 application.properties、application.yml、bootstrap.properties、bootstrap.yml 等。Spring Boot 使用默认配置来加载这些配置文件，但是你也可以自定义配置文件的位置和名称。
2. **创建 Spring 应用程序上下文**
   Spring Boot 会创建一个 Spring 应用程序上下文（ApplicationContext），它是一个依赖注入容器，用于管理应用程序中的所有 bean。Spring Boot 会自动扫描应用程序中的所有 bean，并将它们注册到应用程序上下文中。
3. **执行自动配置**
   Spring Boot 的自动配置机制会根据应用程序中的类路径和配置文件来自动配置应用程序。例如，如果应用程序中包含了 Spring MVC 相关的类和配置文件，Spring Boot 会自动配置一个基于 Spring MVC 的 Web 应用程序。
4. **启动 Web 服务器**
   如果应用程序中包含 Web 组件，Spring Boot 会自动启动一个内嵌的 Web 服务器。默认情况下，Spring Boot 使用 Tomcat 作为默认的 Web 服务器，但是你也可以使用 Jetty 或 Undertow 等其他 Web 服务器。
5. **运行应用程序**
   最后，Spring Boot 启动应用程序并运行它

总之，Spring Boot 的启动过程主要包括加载配置文件和依赖项、创建应用程序上下文、执行自动配置、启动 Web 服务器以及运行应用程序。通过这个过程，Spring Boot 简化了应用程序的开发和部署，并提供了一种快速、简单、灵活的方式来构建 Spring 应用程序。

### SpringBoot 是如何启动 Tomcat 的

1. 首先，SpringBoot 在启动时会先创建一个 Spring 容器
2. 在创建 Spring 容器过程中，会利用@ConditionalOnclass 技术来判断当前 classpath 中是否存在 Tomcat 依赖，如果存在则会生成一个启动 Tomcat 的 Bean
3. Spring 容器创建完之后，就会获取启动 Tomcat 的 Bean，并创建 Tomcat 对象，并绑定端口等，然后启动 Tomcat

### SpringBoot 中配置文件的加载顺序是怎样的？

优先级从高到低，高优先级的配置赋值低优先级的配置，所有配置会形成互补配置

1. 命令行参数。所有的配置都可以在命令行上进行指定
2. Java 系统属性（System.getProperties0）
3. 操作系统环境变量；
4. jar 包外部的 application-fprofile.properties 或 application.yml（带 spring.profile）配置文件
5. jar 包内部的 application-fprofile.properties 或 application.yml（带 spring.profile）配置文件再来加载不带 profile
6. jar 包外部的 application.properties 或 application.yml（不带 spring.profile）配置文件
7. ja 包内部的 application.properties 或 application.yml（不带 springprofile）配置文件
8. @Configuration 注解类上的@PropertySource

### Spring Boot 项目如何热部署？

使用 DEV 工具来实现。通过这种依赖关系，任何更改都会使嵌入式 tomcat 将重新启动。Spring Boot 有一个开发工具（DevTools）模块，它有助于提高开发人员的生产力。Java 开发人员面临的一个主要挑战是将文件更改自动部署到服务器并自动重启服务器。开发人员可以重新加载 Spring Boot 上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。

Spring Boot 在发布它的第一个版本时没有这个功能。这是开发人员需要的功能。DevTools 模块完全满足开发人员的需求。该模块将在生产环境中被禁用。

它还提供 H2 数据库控制台以更好地测试应用程序。

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring‐boot‐devtools</artifactId>
</dependency>
```

##

## 其他

## 7. 数据访问与集成

### 7.1 Spring Data 生态

**Spring Data 概述：**
Spring Data 是 Spring 的一个子项目，目标是统一和简化对各类型持久化存储的访问，而不拘泥于是关系型数据库还是 NoSQL 数据存储。

**核心特性：**

-   **统一的编程模型**：提供一致的数据访问抽象
-   **减少样板代码**：自动生成基础的 CRUD 操作
-   **类型安全**：基于接口的编程模型
-   **分页和排序**：内置分页和排序支持
-   **审计功能**：自动记录创建时间、修改时间等

### 7.2 关系型数据库支持

**Spring Data JPA 配置：**

```yaml
spring:
    datasource:
        url: jdbc:mysql://localhost:3306/demo
        username: root
        password: password
        driver-class-name: com.mysql.cj.jdbc.Driver

    jpa:
        hibernate:
            ddl-auto: update
        show-sql: true
        properties:
            hibernate:
                dialect: org.hibernate.dialect.MySQL8Dialect
                format_sql: true
```

**实体类定义：**

```java
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String email;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();

    // constructors, getters, setters
}
```

**Repository 接口：**

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // 方法名查询
    Optional<User> findByUsername(String username);
    List<User> findByEmailContaining(String email);

    // @Query 注解
    @Query("SELECT u FROM User u WHERE u.createdAt > :date")
    List<User> findUsersCreatedAfter(@Param("date") LocalDateTime date);

    // 原生 SQL
    @Query(value = "SELECT * FROM users WHERE email LIKE %:domain%", nativeQuery = true)
    List<User> findByEmailDomain(@Param("domain") String domain);

    // Modifying 查询
    @Modifying
    @Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
    int updateUserEmail(@Param("id") Long id, @Param("email") String email);
}
```

**JDBC Template 使用：**

```java
@Repository
public class UserJdbcRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> findAll() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class));
    }

    public void save(User user) {
        String sql = "INSERT INTO users (username, email) VALUES (?, ?)";
        jdbcTemplate.update(sql, user.getUsername(), user.getEmail());
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), id);
            return Optional.of(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
## 8. 最佳实践与性能优化

### 8.1 应用分层架构

**标准分层结构：**
```

src/
├── main/
│ ├── java/
│ │ └── com/example/demo/
│ │ ├── DemoApplication.java # 启动类
│ │ ├── config/ # 配置类
│ │ │ ├── DatabaseConfig.java
│ │ │ ├── SecurityConfig.java
│ │ │ └── CacheConfig.java
│ │ ├── controller/ # 控制层
│ │ │ ├── UserController.java
│ │ │ └── OrderController.java
│ │ ├── service/ # 服务层
│ │ │ ├── UserService.java
│ │ │ └── impl/
│ │ │ └── UserServiceImpl.java
│ │ ├── repository/ # 数据访问层
│ │ │ ├── UserRepository.java
│ │ │ └── OrderRepository.java
│ │ ├── entity/ # 实体类
│ │ │ ├── User.java
│ │ │ └── Order.java
│ │ ├── dto/ # 数据传输对象
│ │ │ ├── UserDTO.java
│ │ │ └── OrderDTO.java
│ │ ├── exception/ # 异常处理
│ │ │ ├── GlobalExceptionHandler.java
│ │ │ └── BusinessException.java
│ │ └── util/ # 工具类
│ │ └── DateUtil.java
│ └── resources/
│ ├── application.yml
│ ├── application-dev.yml
│ ├── application-prod.yml
│ └── static/
└── test/

````

### 8.2 配置管理最佳实践

**环境分离配置：**
```yaml
# application.yml - 公共配置
spring:
  application:
    name: demo-app
  profiles:
    active: @spring.profiles.active@

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics

---
# application-dev.yml - 开发环境
spring:
  config:
    activate:
      on-profile: dev

  datasource:
    url: jdbc:h2:mem:devdb
    driver-class-name: org.h2.Driver
    username: sa
    password:

  h2:
    console:
      enabled: true

logging:
  level:
    com.example: DEBUG
    org.springframework.web: DEBUG

---
# application-prod.yml - 生产环境
spring:
  config:
    activate:
      on-profile: prod

  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

logging:
  level:
    root: WARN
    com.example: INFO
````

**自定义配置属性：**

```java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {

    @NotBlank
    private String name;

    @Min(1)
    @Max(65535)
    private int port = 8080;

    private Security security = new Security();

    private Map<String, String> features = new HashMap<>();

    public static class Security {
        private boolean enabled = true;
        private String secretKey;

        // getters and setters
    }

    // getters and setters
}

@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {

    @Bean
    @ConditionalOnProperty(name = "app.security.enabled", havingValue = "true")
    public SecurityService securityService(AppProperties properties) {
        return new SecurityService(properties.getSecurity().getSecretKey());
    }
}
```

### 8.3 性能优化策略

**连接池优化：**

```yaml
spring:
    datasource:
        type: com.zaxxer.hikari.HikariDataSource
        hikari:
            minimum-idle: 5
            maximum-pool-size: 20
            auto-commit: true
            idle-timeout: 30000
            pool-name: SpringBootJPAHikariCP
            max-lifetime: 1800000
            connection-timeout: 30000
            connection-test-query: SELECT 1
```

**JVM 参数优化：**

```bash
# 生产环境 JVM 参数
java -server \
     -Xms2g -Xmx2g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=100 \
     -XX:+UseStringDeduplication \
     -XX:+PrintGCDetails \
     -XX:+PrintGCTimeStamps \
     -Xloggc:gc.log \
     -jar app.jar
```

**缓存策略：**

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
            .RedisCacheManagerBuilder
            .fromConnectionFactory(redisConnectionFactory())
            .cacheDefaults(cacheConfiguration(Duration.ofMinutes(10)));

        return builder.build();
    }

    private RedisCacheConfiguration cacheConfiguration(Duration ttl) {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(ttl)
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}

@Service
public class UserService {

    @Cacheable(value = "users", key = "#id")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @CacheEvict(value = "users", key = "#user.id")
    public User save(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", allEntries = true)
    public void clearCache() {
        // 清除所有缓存
    }
}
```

### 8.4 监控与诊断

**自定义健康检查：**

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                    .withDetail("database", "Available")
                    .withDetail("validationQuery", "SELECT 1")
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("database", "Unavailable")
                .withDetail("error", e.getMessage())
                .build();
        }

        return Health.down()
            .withDetail("database", "Unknown")
            .build();
    }
}
```

**自定义指标：**

```java
@Component
public class BusinessMetrics {

    private final MeterRegistry meterRegistry;
    private final Counter orderCounter;
    private final Timer paymentTimer;
    private final Gauge activeUsersGauge;

    public BusinessMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.orderCounter = Counter.builder("orders.created")
            .description("Number of orders created")
            .register(meterRegistry);
        this.paymentTimer = Timer.builder("payment.processing.time")
            .description("Payment processing time")
            .register(meterRegistry);
        this.activeUsersGauge = Gauge.builder("users.active")
            .description("Number of active users")
            .register(meterRegistry, this, BusinessMetrics::getActiveUserCount);
    }

    public void recordOrderCreated() {
        orderCounter.increment();
    }

    public void recordPaymentTime(Duration duration) {
        paymentTimer.record(duration);
    }

    private double getActiveUserCount() {
        // 实际业务逻辑
        return 100.0;
    }
}
```

### 8.5 安全最佳实践

**敏感信息保护：**

```yaml
# 使用环境变量
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

# 使用 Jasypt 加密
jasypt:
  encryptor:
    password: ${JASYPT_ENCRYPTOR_PASSWORD}

spring:
  datasource:
    password: ENC(encrypted_password_here)
```

**安全配置：**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true)
                )
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
```

### 8.6 测试最佳实践

**单元测试：**

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldCreateUser() {
        // Given
        User user = new User("john", "john@example.com");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        User result = userService.createUser(user);

        // Then
        assertThat(result.getUsername()).isEqualTo("john");
        verify(userRepository).save(user);
    }
}
```

**集成测试：**

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class UserControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldCreateUser() {
        // Given
        User user = new User("john", "john@example.com");

        // When
        ResponseEntity<User> response = restTemplate.postForEntity("/api/users", user, User.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getUsername()).isEqualTo("john");
        assertThat(userRepository.findByUsername("john")).isPresent();
    }
}
```

### 8.7 部署与运维

**Docker 化部署：**

```dockerfile
# Dockerfile
FROM openjdk:11-jre-slim

VOLUME /tmp

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]
```

**Docker Compose：**

```yaml
version: "3.8"
services:
    app:
        build: .
        ports:
            - "8080:8080"
        environment:
            - SPRING_PROFILES_ACTIVE=prod
            - DATABASE_URL=jdbc:mysql://db:3306/demo
            - DATABASE_USERNAME=demo
            - DATABASE_PASSWORD=demo123
        depends_on:
            - db
            - redis

    db:
        image: mysql:8.0
        environment:
            - MYSQL_DATABASE=demo
            - MYSQL_USER=demo
            - MYSQL_PASSWORD=demo123
            - MYSQL_ROOT_PASSWORD=root123
        volumes:
            - mysql_data:/var/lib/mysql

    redis:
        image: redis:6-alpine
        ports:
            - "6379:6379"

volumes:
    mysql_data:
```

## 9. 总结与学习建议

### 9.1 Spring Boot 核心价值

**简化开发：**

-   **零配置启动**：基于约定的自动配置
-   **起步依赖**：简化依赖管理
-   **内嵌服务器**：简化部署流程

**提升效率：**

-   **快速原型**：快速搭建可运行的应用
-   **开发工具**：热部署、自动重启
-   **生产特性**：监控、健康检查、外部化配置

**企业级特性：**

-   **安全集成**：Spring Security 无缝集成
-   **数据访问**：多种数据存储支持
-   **云原生**：微服务友好，容器化支持

### 9.2 学习路径建议

**基础阶段：**

1. **掌握 Spring 基础**：IoC、AOP、MVC
2. **理解自动配置原理**：@EnableAutoConfiguration 机制
3. **熟悉核心注解**：@SpringBootApplication、@Configuration 等
4. **实践基本功能**：Web 开发、数据访问、配置管理

**进阶阶段：**

1. **深入启动原理**：SpringApplication 启动流程
2. **自定义 Starter**：理解扩展机制
3. **性能优化**：JVM 调优、连接池配置、缓存策略
4. **监控运维**：Actuator、日志、指标收集

**高级阶段：**

1. **微服务架构**：Spring Cloud 生态
2. **云原生部署**：Docker、Kubernetes
3. **安全最佳实践**：认证授权、数据保护
4. **架构设计**：领域驱动设计、事件驱动架构

### 9.3 常见问题与解决方案

**性能问题：**

-   **启动慢**：排除不必要的自动配置、优化依赖
-   **内存占用高**：调整 JVM 参数、使用轻量级组件
-   **响应慢**：数据库优化、缓存策略、异步处理

**部署问题：**

-   **配置管理**：环境分离、外部化配置
-   **服务发现**：使用注册中心、健康检查
-   **日志管理**：结构化日志、集中收集

**开发问题：**

-   **依赖冲突**：版本管理、排除传递依赖
-   **测试困难**：分层测试、Mock 使用
-   **调试复杂**：理解自动配置、使用开发工具

Spring Boot 作为现代 Java 开发的首选框架，通过其强大的自动配置和丰富的生态系统，大大简化了企业级应用的开发。掌握 Spring Boot 不仅要理解其表面功能，更要深入理解其设计理念和实现原理，这样才能在实际项目中游刃有余，构建高质量的应用系统。

````

### 7.3 NoSQL 数据存储支持

**MongoDB 集成：**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/demo
      auto-index-creation: true
````

```java
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @Indexed
    private String name;

    private BigDecimal price;

    @DBRef
    private Category category;

    private List<String> tags;

    // constructors, getters, setters
}

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByNameContaining(String name);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    @Query("{ 'tags': { $in: ?0 } }")
    List<Product> findByTags(List<String> tags);
}
```

**Redis 集成：**

```yaml
spring:
    redis:
        host: localhost
        port: 6379
        password:
        timeout: 2000ms
        jedis:
            pool:
                max-active: 8
                max-wait: -1ms
                max-idle: 8
                min-idle: 0
```

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 使用 Jackson2JsonRedisSerializer 来序列化和反序列化 redis 的 value 值
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);

        // 使用 StringRedisSerializer 来序列化和反序列化 redis 的 key 值
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(jackson2JsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }
}

@Service
public class CacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void set(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }
}
```

### 7.4 Spring Batch 批处理

**Batch 基本概念：**

-   **Job**：批处理作业，包含一个或多个 Step
-   **Step**：作业步骤，包含 Reader、Processor、Writer
-   **ItemReader**：数据读取
-   **ItemProcessor**：数据处理
-   **ItemWriter**：数据写入

**批处理配置：**

```java
@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public FlatFileItemReader<User> reader() {
        return new FlatFileItemReaderBuilder<User>()
            .name("userItemReader")
            .resource(new ClassPathResource("users.csv"))
            .delimited()
            .names(new String[]{"username", "email"})
            .targetType(User.class)
            .build();
    }

    @Bean
    public UserItemProcessor processor() {
        return new UserItemProcessor();
    }

    @Bean
    public JdbcBatchItemWriter<User> writer(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<User>()
            .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
            .sql("INSERT INTO users (username, email) VALUES (:username, :email)")
            .dataSource(dataSource)
            .build();
    }

    @Bean
    public Job importUserJob(JobCompletionNotificationListener listener, Step step1) {
        return jobBuilderFactory.get("importUserJob")
            .incrementer(new RunIdIncrementer())
            .listener(listener)
            .flow(step1)
            .end()
            .build();
    }

    @Bean
    public Step step1(JdbcBatchItemWriter<User> writer) {
        return stepBuilderFactory.get("step1")
            .<User, User> chunk(10)
            .reader(reader())
            .processor(processor())
            .writer(writer)
            .build();
    }
}
```

**Item Processor 实现：**

```java
public class UserItemProcessor implements ItemProcessor<User, User> {

    private static final Logger log = LoggerFactory.getLogger(UserItemProcessor.class);

    @Override
    public User process(final User user) throws Exception {
        final String username = user.getUsername().toUpperCase();
        final String email = user.getEmail().toLowerCase();

        final User transformedUser = new User(username, email);

        log.info("Converting (" + user + ") into (" + transformedUser + ")");

        return transformedUser;
    }
}
```

### 7.5 事务管理

**声明式事务：**

```java
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createOrder(Order order) {
        orderRepository.save(order);
    }

    @Transactional(rollbackFor = Exception.class)
    public void transferMoney(Long fromUserId, Long toUserId, BigDecimal amount) {
        User fromUser = userRepository.findById(fromUserId)
            .orElseThrow(() -> new UserNotFoundException("From user not found"));
        User toUser = userRepository.findById(toUserId)
            .orElseThrow(() -> new UserNotFoundException("To user not found"));

        if (fromUser.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        fromUser.setBalance(fromUser.getBalance().subtract(amount));
        toUser.setBalance(toUser.getBalance().add(amount));

        userRepository.save(fromUser);
        userRepository.save(toUser);
    }
}
```

**编程式事务：**

```java
@Service
public class PaymentService {

    @Autowired
    private TransactionTemplate transactionTemplate;

    public void processPayment(Payment payment) {
        transactionTemplate.execute(status -> {
            try {
                // 业务逻辑
                validatePayment(payment);
                deductAmount(payment);
                recordTransaction(payment);
                return null;
            } catch (Exception e) {
                status.setRollbackOnly();
                throw new PaymentProcessingException("Payment failed", e);
            }
        });
    }
}
```
