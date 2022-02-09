## Spring与Spring Boot对比

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

## Spring Boot与Spring MVC

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





# SpringBoot 注解

Spring Boot注解是一种元数据形式，可提供有关程序的数据。换句话说，注解用于提供有关程序的 **补充**信息。它不是我们开发的应用程序的一部分。它对其注解的代码的操作没有直接影响。不会更改已编译程序的操作。

在本节中，我们将讨论一些重要的 **Spring Boot注解**，我们将在本教程的后面部分使用。

## Core Spring框架注解

**@Required:** 它适用于 **bean** 设置方法。它指示必须在配置时使用必需的属性填充带注解的Bean，否则它将引发异常 **BeanInitilizationException** 。

**示例**

示例

```
public class Machine 
{
private Integer cost;
@Required
public void setCost(Integer cost) 
{
    this.cost = cost;
}
public Integer getCost() 
{
    return cost;
}   
}
```

**@Autowired:** : Spring通过提供@Autowired注解来提供基于注解的自动装配。它用于自动连接setter方法，实例变量和构造函数上的spring bean。当我们使用@Autowired批注时，spring容器通过匹配数据类型自动连接bean。

**示例**

示例

```
@Component
public class Customer
{
    private Person person;
    @Autowired
    public Customer(Person person) 
    { 
        this.person=person;
    }
}
```

**@Configuration:** : 它是一个类级别的注解。带有@Configuration注解的类由Spring Containers用作bean定义的源。

**示例**

示例

```
@Configuration
public class Vehicle
{
    @BeanVehicle engine()
    {
        return new Vehicle();
    }
}
```

**@ComponentScan:** : 当我们要扫描软件包中的bean时使用。它与注解@Configuration一起使用。我们还可以指定用于扫描Spring组件的基本软件包。

**示例**

示例

```
@ComponentScan(basePackages = "com.nhooo")
@Configuration
public class ScanComponent
{
// ...
}
```

**@Bean:** 是方法级的注解。它是XML标记的代替方法。它告诉产生由Spring Container管理的bean的方法。

**示例**

示例

```
@Bean
public BeanExample beanExample() 
{
    return new BeanExample ();
}
```

## Spring Framework构造型注解

**@Component:** 。它是一个类级别的注解。它用于将Java类标记为Bean。在类路径中找到了一个用 **@Component** 注解的Java类。 Spring框架将其拾取并在应用程序上下文中将其配置为 **Spring Bean** 。

**示例**

示例

```
@Component
public class Student
{
    .......
}
```

**@Controller:** @Controller是类级别的注解。它是 **@Component** 的专业化。它将一个类标记为Web请求处理程序。它通常用于服务网页。默认情况下，它返回一个字符串，该字符串指示要重定向的路由。它通常与 **@RequestMapping** 注解一起使用。

**示例**

示例

```
@Controller
@RequestMapping("books")
public class BooksController 
{
    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public Employee getBooksByName() 
    {
        return booksTemplate;
    }
}
```

**@Service:** 也用于类级别。它告诉Spring该类包含 **业务逻辑**。

**示例**

示例

```
package com.nhooo;
@Service
public class TestService
{
    public void service1()
    {
        //business code
    }
}
```

**@Repository:** 这是一个类级别的注解。该存储库是直接访问数据库的 **DAO** (数据访问对象)。该存储库执行与数据库有关的所有操作。

示例

```
package com.nhooo;
@Repository 
public class TestRepository
{
    public void delete()
    {   
        //persistence code
    }
}
```

## Spring Boot注解

**@EnableAutoConfiguration:** : 它自动配置类路径中存在的bean，并将其配置为运行方法。在Spring Boot 1.2.0发行版中减少了使用此批注，因为开发人员提供了该批注的代替方法，即 **@SpringBootApplication** 。**@SpringBootApplication:** : 它是三个注解 **@ EnableAutoConfiguration，@ ComponentScan，**和 **@Configuration** 的组合。



### Spring MVC和REST注解

**@RequestMapping:** 用于映射**网络请求**。它具有许多可选元素，例如 consumes, header, method, name, params, path, produces和value。我们将其与类以及方法一起使用。

**示例**

示例

```
@Controller
public class BooksController 
{
    @RequestMapping("/computer-science/books")
    public String getAllBooks(Model model)
    {
        //application code
        return "bookList";
    }
}
```

**@GetMapping:** 它将 **HTTP GET** 请求映射到特定的处理程序方法。它用于创建**提取**的Web服务终结点，而不是使用 **@RequestMapping(method = RequestMethod.GET)****@PostMapping** 它将 **HTTP POST** 请求映射到特定的处理程序方法。它用于创建**创建**的Web服务终结点，而不是使用: **@RequestMapping(method = RequestMethod.POST)****@PutMapping:** 它将 **HTTP PUT** 请求映射到特定的处理程序方法。它用于创建**创建**或**更新**的Web服务终结点，而不是使用: **@RequestMapping(method = RequestMethod.PUT)****@DeleteMapping:** 它将 **HTTP DELETE** 请求映射到特定的处理程序方法。它用于创建**删除**资源的Web服务终结点。使用它而不是使用: **@RequestMapping(method = RequestMethod.DELETE)****@PatchMapping:** 它将 **HTTP PATCH** 请求映射到特定的处理程序方法。使用它代替使用: **@RequestMapping(method = RequestMethod.PATCH)****@RequestBody:** 用于将HTTP请求与方法参数中的对象**绑定**。在内部，它使用 **HTTP MessageConverters** 转换请求的正文。当我们用 **@RequestBody注解方法参数时，Spring框架会将传入的HTTP请求主体绑定到该参数。****@ResponseBody:** 它将方法返回值绑定到响应主体。它告诉Spring Boot Framework将返回的对象序列化为JSON和XML格式。**@PathVariable:** 用于从URI中提取值。它最适合RESTful Web服务，其中URL包含路径变量。我们可以在一个方法中定义多个@PathVariable。**@RequestParam:** 用于从URL提取查询参数。也称为**查询参数**。它最适合Web应用程序。如果URL中不存在查询参数，则可以指定默认值。**@RequestHeader:** 用于获取有关HTTP请求标头的详细信息。我们将此注解用作**方法参数**。注解的可选元素是**名称，必填，值，defaultValue。** 对于标题中的每个细节，我们应指定单独的注解。我们可以在一种方法中多次使用它**@RestController:** 可以将其视为 **@Controller** 和 **@ResponseBody** 注解**的组合。** @RestController注解本身使用@ResponseBody注解进行注解。无需使用@ResponseBody注解每个方法。**@RequestAttribute:** 它将方法参数绑定到请求属性。它提供了从控制器方法方便地访问请求属性的方法。借助@RequestAttribute批注，我们可以访问服务器端填充的对象。





# SpringBoot 应用程序属性

Spring Boot Framework带有内置的机制，用于使用名为 **application.properties** 的文件进行应用程序配置。它位于 **src/main/resources** 文件夹中

## Spring Boot属性类别

有 16个Spring Boot属性的类别如下:

核心属性缓存属性邮件属性JSON属性数据属性交易属性数据迁移属性集成属性网络媒体资源模板属性服务器属性安全属性RSocket属性执行器属性DevTools属性测试属性

## 应用程序属性表

下表提供了常见的Spring Boot属性列表:

| 属性                                          | 默认值                | 说明                                                         |
| --------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| Debug                                         | false                 | 它启用调试日志。                                             |
| spring.application.name                       |                       | 它用来设置应用程序名称。                                     |
| spring.application.admin.enabled              | false                 | 它用于启用应用程序的管理功能。                               |
| spring.config.name                            | application           | 用于设置配置文件名。                                         |
| spring.config.location                        |                       | 它用于配置文件名。                                           |
| server.port                                   | 8080                  | 配置HTTP服务器端口                                           |
| server.servlet.context-path                   |                       | 它配置应用程序的上下文路径。                                 |
| logging.file.path                             |                       | 它配置日志文件的位置。                                       |
| spring.banner.charset                         | UTF-8                 | 横幅文件编码。                                               |
| spring.banner.location                        | classpath: banner.txt | 它用于设置标题文件的位置。                                   |
| logging.file                                  |                       | 它用于设置日志文件名。例如，data.log。                       |
| spring.application.index                      |                       | 它用来设置应用程序索引。                                     |
| spring.application.name                       |                       | 它用来设置应用程序名称。                                     |
| spring.application.admin.enabled              | false                 | 它用于为应用程序启用管理功能。                               |
| spring.config.location                        |                       | 它用于配置文件位置。                                         |
| spring.config.name                            | application           | 用于设置文件名。                                             |
| spring.mail.default-encoding                  | UTF-8                 | 它用于设置默认的MimeMessage编码。                            |
| spring.mail.host                              |                       | 用于设置SMTP服务器主机。例如，smtp.example.com。             |
| spring.mail.password                          |                       | 用于设置SMTP服务器的登录密码。                               |
| spring.mail.port                              |                       | 用于设置SMTP服务器端口。                                     |
| spring.mail.test-connection                   | false                 | 它用于测试邮件服务器在启动时是否可用。                       |
| spring.mail.username                          |                       | 用于设置SMTP服务器的登录用户。                               |
| spring.main.sources                           |                       | 它用于设置应用程序的来源。                                   |
| server.address                                |                       | 它用于设置服务器应绑定到的网络地址。                         |
| server.connection-timeout                     |                       | 用于设置连接器在关闭连接之前将等待另一个HTTP请求的时间(以毫秒为单位)。 |
| server.context-path                           |                       | 它用于设置应用程序的上下文路径。                             |
| server.port                                   | 8080                  | 用于设置HTTP端口。                                           |
| server.server-header                          |                       | 用于服务器响应标头(如果为空则不发送标头)                     |
| server.servlet-path                           | /                     | 用于设置主调度程序servlet的路径                              |
| server.ssl.enabled                            |                       | 用于启用SSL支持。                                            |
| spring.http.multipart.enabled                 | 真                    | 它用于启用对分段上传的支持。                                 |
| spring.servlet.multipart.max-文件大小         | 1MB                   | 用于设置最大文件大小。                                       |
| spring.mvc.async.request-timeout              |                       | 它用于设置时间(以毫秒为单位)。                               |
| spring.mvc.date-format                        |                       | 用于设置日期格式。例如，dd/MM/yyyy。                         |
| spring.mvc.locale                             |                       | 用于设置应用程序的语言环境。                                 |
| spring.social.facebook.app-id                 |                       | 它用于设置应用程序的Facebook App ID。                        |
| spring.social.linkedin.app-id                 |                       | 它用于设置应用程序的LinkedIn应用程序ID。                     |
| spring.social.twitter.app-id                  |                       | 它用于设置应用程序的Twitter App ID。                         |
| security.basic.authorize-mode                 | role                  | 用于设置要应用的安全授权模式。                               |
| security.basic.enabled                        | true                  | 它用于启用基本身份验证。                                     |
| Spring.test.database.replace                  | any                   | 要替换的现有数据源的类型。                                   |
| Spring.test.mockmvc.print                     | default               | MVC打印选项                                                  |
| spring.freemaker.content-type                 | text/html             | 内容类型值                                                   |
| server.server-header                          |                       | 用于服务器响应标头的值。                                     |
| spring.security.filter.dispatcher-type        | async, error, request | 安全过滤器链调度程序类型。                                   |
| spring.security.filter.order                  | -100                  | 安全过滤器链顺序。                                           |
| spring.security.oauth2.client.registration。* |                       | OAuth客户端注册。                                            |
| spring.security.oauth2.client.provider。*     |                       | OAuth提供者详细信息。                                        |



## Spring Boot属性类别

有 16个Spring Boot属性的类别如下:

核心属性缓存属性邮件属性JSON属性数据属性交易属性数据迁移属性集成属性网络媒体资源模板属性服务器属性安全属性RSocket属性执行器属性DevTools属性测试属性

## 应用程序属性表

下表提供了常见的Spring Boot属性列表:

| 属性                                          | 默认值                | 说明                                                         |
| --------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| Debug                                         | false                 | 它启用调试日志。                                             |
| spring.application.name                       |                       | 它用来设置应用程序名称。                                     |
| spring.application.admin.enabled              | false                 | 它用于启用应用程序的管理功能。                               |
| spring.config.name                            | application           | 用于设置配置文件名。                                         |
| spring.config.location                        |                       | 它用于配置文件名。                                           |
| server.port                                   | 8080                  | 配置HTTP服务器端口                                           |
| server.servlet.context-path                   |                       | 它配置应用程序的上下文路径。                                 |
| logging.file.path                             |                       | 它配置日志文件的位置。                                       |
| spring.banner.charset                         | UTF-8                 | 横幅文件编码。                                               |
| spring.banner.location                        | classpath: banner.txt | 它用于设置标题文件的位置。                                   |
| logging.file                                  |                       | 它用于设置日志文件名。例如，data.log。                       |
| spring.application.index                      |                       | 它用来设置应用程序索引。                                     |
| spring.application.name                       |                       | 它用来设置应用程序名称。                                     |
| spring.application.admin.enabled              | false                 | 它用于为应用程序启用管理功能。                               |
| spring.config.location                        |                       | 它用于配置文件位置。                                         |
| spring.config.name                            | application           | 用于设置文件名。                                             |
| spring.mail.default-encoding                  | UTF-8                 | 它用于设置默认的MimeMessage编码。                            |
| spring.mail.host                              |                       | 用于设置SMTP服务器主机。例如，smtp.example.com。             |
| spring.mail.password                          |                       | 用于设置SMTP服务器的登录密码。                               |
| spring.mail.port                              |                       | 用于设置SMTP服务器端口。                                     |
| spring.mail.test-connection                   | false                 | 它用于测试邮件服务器在启动时是否可用。                       |
| spring.mail.username                          |                       | 用于设置SMTP服务器的登录用户。                               |
| spring.main.sources                           |                       | 它用于设置应用程序的来源。                                   |
| server.address                                |                       | 它用于设置服务器应绑定到的网络地址。                         |
| server.connection-timeout                     |                       | 用于设置连接器在关闭连接之前将等待另一个HTTP请求的时间(以毫秒为单位)。 |
| server.context-path                           |                       | 它用于设置应用程序的上下文路径。                             |
| server.port                                   | 8080                  | 用于设置HTTP端口。                                           |
| server.server-header                          |                       | 用于服务器响应标头(如果为空则不发送标头)                     |
| server.servlet-path                           | /                     | 用于设置主调度程序servlet的路径                              |
| server.ssl.enabled                            |                       | 用于启用SSL支持。                                            |
| spring.http.multipart.enabled                 | 真                    | 它用于启用对分段上传的支持。                                 |
| spring.servlet.multipart.max-文件大小         | 1MB                   | 用于设置最大文件大小。                                       |
| spring.mvc.async.request-timeout              |                       | 它用于设置时间(以毫秒为单位)。                               |
| spring.mvc.date-format                        |                       | 用于设置日期格式。例如，dd/MM/yyyy。                         |
| spring.mvc.locale                             |                       | 用于设置应用程序的语言环境。                                 |
| spring.social.facebook.app-id                 |                       | 它用于设置应用程序的Facebook App ID。                        |
| spring.social.linkedin.app-id                 |                       | 它用于设置应用程序的LinkedIn应用程序ID。                     |
| spring.social.twitter.app-id                  |                       | 它用于设置应用程序的Twitter App ID。                         |
| security.basic.authorize-mode                 | role                  | 用于设置要应用的安全授权模式。                               |
| security.basic.enabled                        | true                  | 它用于启用基本身份验证。                                     |
| Spring.test.database.replace                  | any                   | 要替换的现有数据源的类型。                                   |
| Spring.test.mockmvc.print                     | default               | MVC打印选项                                                  |
| spring.freemaker.content-type                 | text/html             | 内容类型值                                                   |
| server.server-header                          |                       | 用于服务器响应标头的值。                                     |
| spring.security.filter.dispatcher-type        | async, error, request | 安全过滤器链调度程序类型。                                   |
| spring.security.filter.order                  | -100                  | 安全过滤器链顺序。                                           |
| spring.security.oauth2.client.registration。* |                       | OAuth客户端注册。                                            |
| spring.security.oauth2.client.provider。*     |                       | OAuth提供者详细信息。                                        |



# SpringBoot Starter Parent

spring-boot-starter-parent是项目启动器。它为我们的应用程序提供了默认配置。所有依赖项都在内部使用它。所有的Spring Boot项目在pom.xml文件中都将spring-boot-starter-parent用作父项。

示例

```
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-parent</artifactId>
<version>1.4.0.RELEASE</version>
</parent>
```

Parent Poms使我们可以管理多个子项目和模块的以下内容:

**Configuration:** 它使我们能够维护Java版本和其他相关属性的一致性。**Dependency Management:** 它控制依赖性的版本以避免冲突。源编码默认Java版本资源过滤它还控制默认的插件配置。

spring-boot-starter-parent从spring-boot-dependencies继承依赖关系管理。我们只需要指定Spring Boot版本号即可。如果需要额外的启动器，我们可以安全地省略版本号。

## Spring Boot Starter Parent内部

Spring Boot Starter Parent定义了spring-boot。 -依赖关系作为父pom。它从spring-boot-dependencies继承了依赖管理。

示例

```
<parent>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-dependencies</artifactId>
<version>1.6.0.RELEASE</version>
<relativePath>../../spring-boot-dependencies</relativePath>
</parent>
```

**默认父Pom**

示例

```
<properties>
<java.version>1.8</java.version>
<resource.delimiter>@</resource.delimiter> 
<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
<maven.compiler.source>${java.version}</maven.compiler.source>
<maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```

属性部分定义应用程序默认值。 Java的默认版本是1.8。我们还可以通过在项目pom中指定属性 **1.8**来覆盖Java版本。父pom还包含其他一些与编码和源有关的设置。如果未在application.properties文件中定义，则Spring Boot框架会使用这些默认值。

**插件管理**

**spring -boot-starter-parent** 指定了许多插件的默认配置，包括maven-failsafe-plugin，maven-jar-plugin和maven-surefire-plugin。

示例

```
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-failsafe-plugin</artifactId>
<executions>
<execution>
<goals>
<goal>integration-test</goal>
<goal>verify</goal>
</goals>
</execution>
</executions>
</plugin>
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-jar-plugin</artifactId>
<configuration>
<archive>
<manifest>
<mainClass>${start-class}</mainClass> <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
</manifest>
</archive>
</configuration>
</plugin>
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-surefire-plugin</artifactId>
<configuration>
<includes>
<include>**/*Tests.java</include>
<include>**/*Test.java</include>
</includes>
<excludes>
<exclude>**/Abstract*.java</exclude>
</excludes>
</configuration>
</plugin>
```

**Spring Boot依赖项**

spring-boot-starter-parent依赖项从spring-boot依赖项继承而来，它也具有所有这些特征。因此，Spring Boot将依赖项列表作为依赖项管理的一部分进行管理。

示例

```
<properties>
<activemq.version>5.13.4</activemq.version>
...
<ehcache.version>2.10.2.2.21</ehcache.version>
<ehcache3.version>3.1.1</ehcache3.version>
...
<h2.version>1.4.192</h2.version>
<hamcrest.version>1.3</hamcrest.version>
<hazelcast.version>3.6.4</hazelcast.version>
<hibernate.version>5.0.9.Final</hibernate.version>
<hibernate-validator.version>5.2.4.Final</hibernate-validator.version>
<hikaricp.version>2.4.7</hikaricp.version>
<hikaricp-java6.version>2.3.13</hikaricp-java6.version>
<hornetq.version>2.4.7.Final</hornetq.version>
<hsqldb.version>2.3.3</hsqldb.version>
<htmlunit.version>2.21</htmlunit.version>
<httpasyncclient.version>4.1.2</httpasyncclient.version>
<httpclient.version>4.5.2</httpclient.version>
<httpcore.version>4.4.5</httpcore.version>
<infinispan.version>8.2.2.Final</infinispan.version>
<jackson.version>2.8.1</jackson.version>
....
<jersey.version>2.23.1</jersey.version>
<jest.version>2.0.3</jest.version>
<jetty.version>9.3.11.v20160721</jetty.version>
<jetty-jsp.version>2.2.0.v201112011158</jetty-jsp.version>
<spring-security.version>4.1.1.RELEASE</spring-security.version>
<tomcat.version>8.5.4</tomcat.version>
<undertow.version>1.3.23.Final</undertow.version>
<velocity.version>1.7</velocity.version>
<velocity-tools.version>2.0</velocity-tools.version>
<webjars-hal-browser.version>9f96c74</webjars-hal-browser.version>
<webjars-locator.version>0.32</webjars-locator.version>
<wsdl4j.version>1.6.3</wsdl4j.version>
<xml-apis.version>1.4.01</xml-apis.version>
</properties>
<prerequisites>
<maven>3.2.1</maven>
</prerequisites>
```

## 没有父级的Spring Boot Starter

在某些情况下，我们不需要继承pom.xml文件中的spring-boot-starter-parent。为了处理此类用例，Spring Boot提供了灵活性，可以在不继承spring-boot-starter-parent的情况下仍然使用依赖项管理。

示例

```
<dependencyManagement>
<dependencies>
<dependency>
<!-- import dependency management from Spring Boot -->
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-dependencies</artifactId>
<version>2.1.1.RELEASE</version>
<type>pom</type>
<scope>import</scope>
</dependency>
</dependencies>
</dependencyManagement>
```

在上面的代码中，我们可以看到我们为此使用了 ****标签。当我们要对特定的依赖项使用不同的版本时，这很有用。



# SpringBoot Starter Web

spring-boot-starter-web有两个重要功能:

与Web开发兼容自动配置

如果要开发Web应用程序，则需要在pom.xml文件中添加以下依赖项:

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
<version>2.2.2.RELEASE</version>
</dependency>
```

Spring web的启动程序使用Spring MVC，REST和Tomcat作为默认的嵌入式服务器。单个spring-boot-starter-web依赖关系可传递地获取与Web开发相关的所有依赖关系。它还减少了构建依赖项计数。 spring-boot-starter-web可传递地取决于以下内容:

org.springframework.boot: spring-boot-starterorg.springframework.boot: spring-boot-starter-tomcatorg.springframework.boot: spring-boot-starter-validationcom.fasterxml.jackson.core: jackson-databindorg.springframework: spring-weborg.springframework: spring-webmvc

默认情况下，spring-boot-starter-web包含以下tomcat服务器依赖项:

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-tomcat</artifactId>
<version>2.0.0.RELEASE</version>
<scope>compile</scope>
</dependency>
```

spring-boot-starter-web自动配置Web开发所需的以下各项:

调度程序Servlet错误页面用于管理静态依赖项的Web JAR嵌入式servlet容器

## Spring Boot嵌入式Web服务器

每个Spring Boot应用程序都包含一个嵌入式服务器。嵌入式服务器被嵌入为可部署应用程序的一部分。嵌入式服务器的优点是，我们不需要在环境中预安装服务器。使用Spring Boot，默认的嵌入式服务器为 **Tomcat** 。 Spring Boot还支持另外两个嵌入式服务器:

**Jetty服务器****Undertow服务器**

## 使用其他嵌入式Web服务器

对于 **servlet堆栈**应用程序， **spring-boot-starter-web** 通过包含 **spring-boot-starter-tomcat** 来包含 **Tomcat** ，但是我们可以使用 **spring-boot-starter-jetty** 或 **spring -boot-starter-undertow** 。

对于 **反应堆**应用程序， **spring-boot-starter-webflux** 包括 **包括 \**spring-boot-starter-reactor-netty\** 来实现Reactor Netty** ，但我们可以使用 **spring-boot-starter-tomcat，spring-boot-starter-jetty，**

### Jetty服务器

Spring Boot还支持称为 **Jetty服务器**。它是一个HTTP服务器和Servlet容器，具有提供静态和动态内容的功能。

如果要在应用程序中添加Jetty服务器，则需要添加 **spring-boot-starter-jetty** 依赖项。

**记住:** 。在应用程序中使用Jetty服务器时，请确保 **排除了默认的Tomcat服务器** **spring-boot-starter-web** 。它避免了服务器之间的冲突。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
<exclusions>
<exclusion>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-tomcat</artifactId>
</exclusion>
</exclusions>
</dependency>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

我们还可以使用 **application.properties** 文件来自定义Jetty服务器的行为。

### Undertow Server

Spring Boot提供了另一个名为 **Undertow** 的服务器。它也是像Jetty这样的嵌入式Web服务器。它用Java编写，由JBoss管理和赞助。 Undertow服务器的主要优点是:

支持HTTP/2HTTP升级支持Websocket支持提供对Servlet 4.0的支持灵活可嵌入

**记住:** : 在应用程序中使用Undertow服务器时，请确保从 **spring-boot-starter中\**排除了默认的Tomcat服务器\** -web。**避免了服务器之间的冲突。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
<exclusions>
<exclusion>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-tomcat</artifactId>
</exclusion>
</exclusions>
</dependency>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

我们还可以使用 **application.properties** 文件来自定义Undertow服务器的行为。

## spring-boot-starter-web vs. spring-boot-starter-tomcat

spring-boot-starter-web包含spring web依赖项，其中包括spring-boot-starter-tomcat。 spring-boot-starter-web包含以下内容:

spring-boot-starterjacksonspring-corespring-mvcspring-boot-starter-tomcat

**spring-boot-starter-tomcat** 包含与Tomcat服务器相关的所有内容。

coreelloggingwebsocket

starter-tomcat具有以下依赖性:

示例

```
<dependency>
<groupId>org.apache.tomcat.embed</groupId>
<artifactId>tomcat-embed-core</artifactId>
<version>8.5.23</version>
 <scope>compile</scope>
</dependency>
<dependency>
<groupId>org.apache.tomcat.embed</groupId>
<artifactId>tomcat-embed-el</artifactId>
<version>8.5.23</version>
<scope>compile</scope>
</dependency>
<dependency>
<groupId>org.apache.tomcat.embed</groupId>
<artifactId>tomcat-embed-websocket</artifactId>
<version>8.5.23</version>
<scope>compile</scope>
</dependency>
```

我们也可以使用 **spring-mvc** 而不使用嵌入式Tomcat服务器。如果要这样做，我们需要使用 标记排除Tomcat服务器，如以下代码所示。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
<exclusions>
<exclusion>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-tomcat</artifactId>
</exclusion>
</exclusions>
</dependency>
```



# SpringBoot Data JPA

Spring Data是一个高级Spring Source项目。其目的是统一并轻松访问关系数据库系统和NoSQL数据存储等不同类型的持久性存储。

在实现新应用程序时，我们应该专注于业务逻辑而不是技术复杂性和样板代码。这就是Java持久性API(JPA)规范和Spring Data JPA非常受欢迎的原因。

Spring Data JPA在JPA的顶部增加了一层。这意味着，Spring Data JPA使用JPA规范定义的所有功能，尤其是实体，关联映射和JPA的查询功能。 Spring Data JPA添加了自己的功能，例如存储库模式的无代码实现以及从方法名称创建数据库查询。

## Spring Data JPA

Spring Data JPA处理大多数基于JDBC的数据库访问和ORM(对象关系映射)的复杂性。它减少了JPA所需的样板代码。

Spring Data JPA旨在通过减少所需的工作量来改进数据访问层的实现。

### Spring Data JPA功能

Spring Data JPA有 **三个**主要功能，如下所示:

**无代码存储库**: 这是最流行的与持久性相关的模式。它使我们能够在更高的抽象级别上实现业务代码。**简化的样板代码:** 它通过其存储库接口为每种方法提供默认实现。这意味着不再需要实现读写操作。**生成的查询**: Spring Data JPA的另一个功能是根据方法名称**生成数据库查询**。如果查询不太复杂，则需要在存储库接口上定义一个以 **findBy** 开头的名称的方法。定义方法后，Spring解析方法名称并为其创建查询。例如:

示例

```
public interface EmployeeRepository extends CrudRepository<Employee, Long> 
{
Employee findByName(String name);
}
```

在上面的示例中，我们扩展了使用两个泛型的 **CrudRepository** : **Employee** 和 **Long** 。 Employee是要管理的 **实体**，而 **Long** 是主键的数据类型

Spring内部会生成 **JPQL** (Java持久性查询语言)基于方法名称的查询。该查询是从方法签名派生的。它设置绑定参数值，执行查询并返回结果。

还有其他一些功能，如下所示:

它可以集成自定义存储库代码。这是一个功能强大的存储库和自定义对象映射抽象。它支持透明审核。它实现了提供基本属性的域基类。它支持多个模块，例如Spring Data JPA，Spring Data MongoDB，Spring Data REST，Spring Data Cassandra等。

## Spring数据存储库

Spring Data JPA提供了 **三个**存储库，如下所示:

**CrudRepository:** : 它提供标准的**创建，读取，更新**和**删除**。它包含诸如 **findOne()，findAll( )，save()，delete()，**等。**PagingAndSortingRepository** : 它扩展了 **CrudRepository** 并添加了findAll方法。它使我们能够以分页方式**排序**和**检索**数据。**JpaRepository** : 这是一个 **JPA特定存储库**，它在 **Spring Data Jpa** 中定义。它扩展了存储库CrudRepository和PagingAndSortingRepository。它添加了特定于JPA的方法，例如 **flush()**，以在持久性上下文上触发刷新。

示例

```
<dependency>
<groupId>org.springframework.data</groupId>
<artifactId>spring-data-jpa</artifactId>
<version>2.2.3.RELEASE</version>
</dependency>
```

## SpringBoot Starter Data JPA

Spring Boot提供了 **spring-boot-starter-data-jpa** 依赖关系，以有效地将Spring应用程序与关系数据库连接。 spring-boot-starter-data-jpa在内部使用spring-boot-jpa依赖项(自Spring Boot版本1.5.3起)。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-jpa</artifactId>
<version>2.2.2.RELEASE</version>
</dependency>
```

数据库是用表/关系设计的。较早的方法(JDBC)涉及编写SQL查询。在JPA中，我们会将对象中的数据存储到表中，反之亦然。但是，JPA是由于不同的思维过程而演变的。

在JPA之前，ORM是更常用于指代这些框架的术语。这就是Hibernate被称为ORM框架的原因。

JPA允许我们将应用程序类映射到数据库中的表。

**实体管理器:** : 定义映射后，它将处理与数据库的所有交互。**JPQL(Java持久性查询语言)**: 它提供了一种编写查询以对实体执行搜索的方法。它不同于SQL查询。 JPQL查询已经了解实体之间定义的映射。如果需要，我们可以添加其他条件。**标准API** : 它定义了一个基于Java的API以对数据库执行搜索。



# SpringBoot Starter Actuator

**SpringBoot Actuator**是的子项目Spring Boot框架。它包括许多其他功能，可帮助我们监视和管理Spring Boot应用程序。它包含 Actuator端点(资源所在的位置)。我们可以使用 **HTTP** 和 **JMX** 端点来管理和监视Spring Boot应用程序。如果要在应用程序中获得生产就绪的功能，则应使用S **pring Boot Actuator。**

### Spring Boot Actuator功能

Spring Boot Actuator有 **三个**主要功能:

**Endpoints****Metrics****Audit**

**Endpoint:** Actuator端点使我们可以监视应用程序并与之交互。 Spring Boot提供了许多内置端点。我们也可以创建自己的端点。我们可以分别启用和禁用每个端点。大多数应用程序选择 **HTTP** ，该终结点的ID和 **/actuator前缀**映射到URL。

对于例如， **/health** 端点提供了应用程序的基本健康信息。 Actuator默认情况下将其映射到 **/actuator/health** 。

**Metrics**: Spring Boot Actuator通过与 **千分尺**集成来提供尺寸指标。千分尺已集成到Spring Boot中。它是工具库，用于支持从Spring交付应用程序指标。它为具有维度数据模型的 **计时器，仪表，计数器，分配汇总**和 **长任务计时器**提供了与供应商无关的界面。

**Audit:** Spring Boot提供了一个灵活的审核框架，该框架将事件发布到 **AuditEventRepository。**如果正在执行spring-security，它将自动发布身份验证事件。

## 启用Spring Boot Actuator

我们可以通过在pom.xml文件中注入依赖项 **spring-boot-starter-actuator** 来启用 Actuator。

示例

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
    <version>2.2.2.RELEASE</version>
</dependency>
```

## Spring Boot Actuator端点

Actuator端点允许我们监视Spring Boot应用程序并与之交互。 Spring Boot包含许多内置端点，我们还可以在Spring Boot应用程序中添加自定义端点。

下表描述了广泛使用的端点。

| Id          | 用法                                                         | 默认 |
| ----------- | ------------------------------------------------------------ | ---- |
| Actuator    | 它为其他端点提供了一个基于超媒体的**发现页面**。它要求Spring HATEOAS位于类路径上。 | true |
| auditevents | 它公开了当前应用程序的审核事件信息。                         | true |
| autoconfig  | 它用于显示自动配置报告，该报告显示所有自动配置候选者以及应用它们"被"或"未被"的原因。 | true |
| beans       | 它用于显示应用程序中所有Spring Bean的完整列表。              | true |
| configprops | 它用于显示所有@ConfigurationProperties的整理列表。           | true |
| dump        | 它用于执行线程转储。                                         | true |
| env         | 它用于从Spring的ConfigurableEnvironment中公开属性。          | true |
| flyway      | 它用于显示已应用的所有Flyway数据库迁移。                     | true |
| health      | 它用于显示应用程序运行状况信息。                             | 错误 |
| info        | 它用于显示任意应用程序信息。                                 | 错误 |
| loggers     | 它用于显示和修改应用程序中记录器的配置。                     | true |
| liquibase   | 它用于显示已应用的所有Liquibase数据库迁移。                  | true |
| metrics     | 它用于显示当前应用程序的指标信息。                           | true |
| mappings    | 它用于显示所有@RequestMapping路径的整理列表。                | true |
| shutdown    | 它用于允许正常关闭应用程序。                                 | true |
| trace       | 它用于显示跟踪信息。                                         | true |

对于Spring MVC，使用了以下附加端点。

| Id         | 说明                                                         | 默认 |
| ---------- | ------------------------------------------------------------ | ---- |
| docs       | 它用于显示文档，包括对 Actuator端点的示例请求和响应。        | 错误 |
| heapdump   | 它用于返回GZip压缩的hprof堆转储文件。                        | true |
| jolokia    | 它用于通过HTTP公开JMX bean(当Jolokia在类路径上时)。          | true |
| logfile    | 它用于返回日志文件的内容。                                   | true |
| prometheus | 它用于以Prometheus服务器可以抓取的格式公开指标。它需要依赖千分尺-普罗米修斯。 | true |

## Spring Boot Actuator属性

Spring Boot为所有 Actuator端点提供安全性。它使用 **基于表单的**身份验证，该身份提供 **用户ID** 作为用户，并提供随机生成的 **密码**。我们还可以通过为端点定制基本身份验证安全性来访问 Actuator受限的端点。我们需要通过 **management.security.roles** 属性覆盖此配置。例如:

示例

```
management.security.enabled=true
management.security.roles=ADMIN
security.basic.enabled=true
security.user.name=admin
security.user.passowrd=admin
```



# SpringBoot Starter Test

**spring-boot-starter-test** 是该测试的主要依赖项。它包含测试所需的大多数元素。

我们可以编写几种不同类型的测试来帮助测试和自动化应用程序的运行状况。在开始任何测试之前，我们需要集成测试框架。

对于Spring Boot，我们需要在项目中添加 **starter** ，对于测试，我们只需添加 **spring-boot-starter-test** 依赖项。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-test</artifactId>
<version>2.2.2.RELEASE</version>
<scope>test</scope>
</dependency>
```

它拉出所有与测试相关的依赖项。添加之后，我们可以构建一个简单的单元测试。我们可以通过IDE创建Spring Boot项目，也可以使用Spring Initializr生成它。

注意: 如果要手动添加测试依赖项，请将其添加到pom.xml文件的底部。

在上述依赖项中，需要注意的一件事是，它包括测试的范围 **test。**通过捆绑和打包以进行部署，将忽略使用测试范围声明的任何依赖项。测试范围依赖关系仅在以开发和Maven测试模式运行时可用。

默认情况下，当我们创建一个简单的Spring Boot应用程序时，它在pom.xml文件中包含测试依赖关系 **src/test/java**文件夹下的 **ApplicationNameTest.java** 文件。





# SpringBoot DevTools

## Spring Boot DevTools

Spring Boot 1.3提供了另一个名为Spring Boot DevTools的模块。 DevTools代表 **Developer Tool** 。该模块的目的是在使用Spring Boot应用程序时尝试并缩短开发时间。 Spring Boot DevTools接受更改并重新启动应用程序。

我们可以通过在pom.xml文件中添加以下依赖项来在我们的项目中实现DevTools。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-devtools</artifactId>
<scope>runtime<scope >
</dependency>
```

## Spring Boot DevTools功能

Spring Boot DevTools提供以下功能:

**属性默认值****自动重启****LiveReload****远程调试隧道****远程更新和重新启动**

**属性默认值:** : Spring Boot提供了模板技术 **Thymeleaf** ，其中包含属性 **spring.thymeleaf.cache。**。缓存并允许我们更新页面，而无需重新启动应用程序。但是在开发过程中设置这些属性总是会带来一些问题。

当我们使用spring-boot-devtools模块时，不需要设置属性。在Thymeleaf，Freemarker，Groovy模板的开发缓存期间，将自动禁用。

注意: 如果我们不想在应用程序上应用属性默认值，可以在application.properties文件中将configprop: spring.devtools.add-properties []设置为false。

**自动重启:** 自动重启意味着重新加载Java类并在服务器端对其进行配置。服务器端更改后，它会动态部署，服务器会重新启动，并加载修改后的代码。它主要用于基于微服务的应用程序。 Spring Boot使用 **两种**类型的ClassLoader:

不变的类(三分之二)已加载到**基本ClassLoader中。**我们正在积极开发的类已加载到**重新启动ClassLoader中。**

应用程序重新启动时，重新启动的ClassLoader被丢弃，并填充了一个新的类。因此，基本的ClassLoader始终可用并已填充。

我们可以使用属性 **spring.devtools.restart.enabled** 设置为 **来禁用服务器的自动重启。错误。**

### 记住:

DevTools始终监视类路径资源。触发重启的唯一方法是更新类路径。DevTools需要单独的应用程序类加载器才能正常工作。默认情况下，Maven派生应用程序进程。自动重新启动与 **LiveReload一起很好地工作。**DevTools依赖于应用程序上下文的关闭挂钩在重新启动期间将其关闭。

**LiveReload:** Spring Boot DevTools模块包括一个名为 **LiveReload的嵌入式服务器。**，只要我们在其中进行更改，该应用程序就可以自动触发浏览器刷新。资源。这也称为 **自动刷新。**

**注意:** 我们可以通过设置属性 **spring.devtools.livereload来禁用LiveReload。启用**为 **false。**

它提供了适用于Chrome，Firefox和Safari的浏览器扩展。默认情况下，启用LiveReload。 LiveReload在以下路径上工作:

/META-INF/maven/META-INF/resources/资源/静态/public/模板

我们还可以通过排除上述路径来禁用浏览器中的自动重新加载。例如:

示例

```
spring.devtools.restart.exclude=public/**, static/**, templates/**
```

我们可以使用属性 **spring.devtools.restart.additional-paths查看其他附加路径。**例如:

示例

```
spring.devtools.restart.additional-paths=/path-to-folder
```

如果我们要排除其他路径并希望保留默认路径，请使用属性 **spring.devtools.restart.additional-exclude。**例如:

示例

```
spring.devtools.restart.additional-exclude=styles/**
```

### 记住

我们可以一次运行一台LiveReload服务器。启动应用程序之前，请确保没有其他LiveReload服务器正在运行。如果我们从IDE启动多个应用程序，则它仅支持第一个LiveReload。

**远程调试隧道:** Spring Boot可以通过HTTP将JDWP(Java调试线协议)直接隧道到应用程序。它甚至可以将应用程序部署到仅公开端口80和443的Internet Cloud提供商。

**远程更新和重新启动:** DevTools提供的另一个技巧是: 它支持远程应用程序 **更新**和 **重新启动。**它监视本地类路径中的文件更改，并将其推送到远程服务器，然后重新启动。我们还可以将此功能与LiveReload结合使用。

## 使用触发文件

由于频繁的重启，自动重启有时会减慢开发时间。为了解决这个问题，我们可以使用一个 **触发文件。**。SpringBoot监视触发文件并检测该文件中的修改。它会重新启动服务器并重新加载所有先前的更改。

我们可以通过添加属性 **spring.devtools.restart.trigger-file在我们的应用程序中实现触发文件。**是内部的还是外部的。例如:

示例

```
spring.devtools.restart.trigger-file=c:/workspace-sts-3.9.9.RELEASE/restart-trigger.txt
```



# SpringBoot 多模块项目

## Multi-Module项目

包含嵌套Maven项目的Spring Boot项目称为 **多模块项目**。在多模块项目中，父项目充当基础Maven配置的容器。

换句话说， **多模块项目**是从管理一组子模块的父pom构建的。或 **多模块项目**由父POM引用一个或多个子模块来定义。

父maven项目必须包含 **pom** 的包装类型使该项目成为聚合器。父项目的 **pom.xml** 文件包含子项目继承的所有 **模块，公共依赖项**和 **属性**的列表。父pom位于项目的根目录中。子模块是实际的Spring Boot项目，它们从父项目继承maven属性。

当我们运行多模块项目时，所有模块都一起部署在嵌入式Tomcat Server中。我们也可以部署单个模块。

## 父POM

父POM定义了 **组ID，工件ID，版本**，和 **packaging。**。在以前的Maven项目中，我们已经看到父级POM定义了包装 **jar。**。但是在多模块项目中，父级 **POM** 定义包装pom。打包pom引用了其他Maven项目。

## 子模块-ear，war和jar

子模块可以是任何项目，并且可以有任何包装。我们可以自由地在模块和束之间创建任何类型的依赖关系。

例如，我们正在创建 **EAR** (企业归档)， **WAR** (Web ARchive)和 **JAR** (Java ARchive)文件。 JAR文件捆绑到war文件中，而war文件捆绑到EAR文件中。 EAR文件是可以在应用程序服务器上部署的最终软件包。

EAR文件包含一个或多个WAR文件。每个WAR文件都包含服务项目，该项目对JAR中的所有WAR文件和打包类型具有通用代码。

## Maven子项目/模块

子模块是独立的maven项目，它们共享父项目的属性。所有子项目都可以用一个命令来构建，因为它位于父项目中。定义项目之间的关系更容易。

在父pom文件中配置打包pom，而不是 **jar。**

示例

```
<packaging>pom</packaging>
```

当我们在项目中创建Maven模块时，Spring Boot会在 **module** 标签内的父pom中自动配置模块，如下所示。

示例

```
<modules>
<module>module1</module>
<module>module2</module>
</modules>
```





# SpringBoot 打包

在J2EE应用程序中，模块打包为 **JAR，WAR，**和 **EAR** 。 J2EE中使用的是压缩文件格式。 J2EE定义了三种类型的档案: War、JAR、EAR

## WAR

**WAR** 代表 **Web存档。**。WAR文件代表Web应用程序。 Web模块包含servlet类，JSP文件，HTML文件，JavaScript等，并打包为扩展名为。 **war** 的JAR文件。它包含一个名为 **WEB-INF** 的特殊目录。

WAR是一个模块，可加载到Java Application Server的Web容器中。 Java Application Server具有 **两个**容器: **Web容器**和 **EJB容器**。

**Web容器**托管基于Servlet API和JSP的Web应用程序。 Web容器要求将Web模块打包为WAR文件。这是WAR文件专用的JAR文件，在 **WEB-INF** 文件夹中包含 **web.xmlv** 文件。

**EJB容器**托管基于EJB API的Enterprise Java Bean。它要求将EJB模块打包为JAR文件。它在 **META-INF** 文件夹中包含一个 **ejb-jar.xml** 文件。

WAR文件的优点是可以轻松部署。在Web服务器环境中的客户端计算机上。要执行WAR文件，需要Web服务器或Web容器。例如，Tomcat，Weblogic和Websphere。

## JAR

**JAR** 代表 **Java存档。**包含Bean文件(类文件)，清单和EJB部署描述符(XML文件)的EJB(企业Java Beans)模块打包为JAR文件，扩展名为。 **jar。**软件开发人员可以分发Java类和各种元数据。

换句话说，一个封装一个或多个Java类，清单和描述符的文件称为JAR文件。它是存档的最低级别。它在J2EE中用于包装EJB和客户端Java应用程序。

## EAR

**EAR** 代表 **Enterprise Archive。**。EAR文件代表企业应用程序。上面两个文件打包为扩展名为。 **ear** 的JAR文件。它已部署到应用服务器中。它可以包含多个EJB模块(JAR)和Web模块(WAR)。这是一个特殊的JAR，它在 **META-INF** 文件夹中包含一个 **application.xml** 文件。



# SpringBoot 自动装配

SpringBoot自动配置根据我们添加的jar依赖项自动配置SpringBoot应用程序。

例如，如果类路径中存在H2数据库Jar，而我们尚未手动配置任何与数据库相关的bean，则Spring Boot的自动配置功能会在项目中自动对其进行配置。

我们可以启用自动通过使用注解 **@EnableAutoConfiguration** 配置功能。但是此注解不使用，因为它包装在 **@SpringBootApplication** 注解内。注解@SpringBootApplication是三个注解的组合: **@ComponentScan，@EnableAutoConfiguration，**和 **@Configuration** 。但是，我们使用@SpringBootApplication批注而不是使用@EnableAutoConfiguration。

**@SpringBootApplication = @ComponentScan + @EnableAutoConfiguration + @Configuration**

当添加 **在项目中使用spring-boot-starter-web** 依赖项时，Spring Boot自动配置会在类路径中查找Spring MVC。它会自动配置 **dispatcherServlet** ，默认的 **错误页面**和 **网络罐子**。

类似地，当我们添加spring-boot-starter-data-jpa 依赖关系，我们看到Spring Boot自动配置会自动配置 **数据源**和 **实体管理器**。



## 需要自动配置

基于Spring的应用程序需要很多配置。使用Spring MVC时，我们需要配置 **dispatcher servlet，视图解析器，Web jars** 。以下代码显示了Web应用程序中调度程序servlet的典型配置:

示例

```
<servlet>
<servlet-name>dispatcher</servlet-name>
<servlet-class>
org.springframework.web.servlet.DispatcherServlet
</servlet-class>
<init-param>
<param-name>contextConfigLocation</param-name>
<param-value>/WEB-INF/todo-servlet.xml</param-value>
</init-param>
<load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
<servlet-name>dispatcher</servlet-name>
<url-pattern>/</url-pattern>
</servlet-mapping>
```

类似地，当我们使用Hibernate/JPA时，我们需要配置数据源，事务管理器，实体管理器工厂等等。

**配置数据源**

示例

```
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource"
destroy-method="close">
<property name="driverClass" value="${db.driver}" />
<property name="jdbcUrl" value="${db.url}" />
<property name="user" value="${db.username}" />
<property name="password" value="${db.password}" />
</bean>
<jdbc:initialize-database data-source="dataSource">
<jdbc:script location="classpath:config/schema.sql" />
<jdbc:script location="classpath:config/data.sql" />
</jdbc:initialize-database>
```

**配置实体管理器工厂**

示例

```
<bean
class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"
id="entityManagerFactory">
<property name="persistenceUnitName" value="hsql_pu" />
<property name="dataSource" ref="dataSource" />
</bean>
```

**配置事务管理器**

示例

```
<bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
<property name="entityManagerFactory" ref="entityManagerFactory" />
<property name="dataSource" ref="dataSource" />
</bean>
<tx:annotation-driven transaction-manager="transactionManager"/>
```

## 禁用自动配置类

如果我们不想被应用，我们还可以禁用特定的自动配置类。我们使用注解@EnableAutoConfiguration的 **exclude** 属性来禁用自动配置类。例如:

示例

```
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.autoconfigure.jdbc.*;
import org.springframework.context.annotation.*;
@Configuration(proxyBeanMethods = false)
@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
public class MyConfiguration 
{
}
```

如果类不在类路径中，我们可以使用@EnableAutoConfiguration批注的属性 **excludeName** 并指定类的 **qualified** 名称。我们可以使用属性 **spring.autoconfigure.exclude** 排除任何数量的自动配置类。



# SpringBoot AOP

该应用程序通常是多层开发的。典型的Java应用程序具有以下几层:

**Web层:** 它使用REST或Web应用程序公开**服务**。**业务层:** 它实现了应用程序的**业务逻辑**。**数据层:** 它实现了应用程序的**持久性逻辑**。

每层的职责不同，但是有一些适用于所有层的常见方面是 **日志记录，安全性，验证，缓存等**。这些常见方面被称为 **跨领域关注点。**

如果我们分别在每一层中实现这些关注点，则代码将变得更加难以维护。为了克服这个问题， **面向方面的编程**(AOP)提供了一种解决跨领域问题的解决方案。

将跨领域关注作为一个方面。定义切入点以指示必须在何处应用方面。

它确保跨领域关注点在一个内聚的代码组件中定义。

## AOP

AOP **(Aspect-Oriented Programming)**是一种通过允许 **跨领域关注点**分离来提高模块化的编程模式。这些跨部门关注点与主要业务逻辑不同。我们可以在不修改代码本身的情况下向现有代码添加其他行为。

Spring的AOP框架可帮助我们实现这些跨领域的关注。

使用AOP，我们在一个地方。我们可以自由定义应用此功能的方式和位置，而无需修改应用新功能的类。现在，可以将横切关注点模块化为特殊类，称为 **方面**。

方面有 **两个**的优点:

首先，每个关注点的逻辑现在都集中在一个地方，而不是分散在整个代码库中。其次，业务模块仅包含主要关注的代码。次要关注点已移至**方面**。

各个方面都有要执行的职责，称为 **Advice**。我们可以在一个或多个连接点将方面的功能实现到程序中。

## AOP的优点

它是用纯Java实现的。不需要特殊的编译过程。它仅支持方法执行连接点。仅提供运行时编织。有两种类型的AOP代理: **JDK动态代理**和 **CGLIB代理。**

## 跨领域关注点

跨领域关注点是我们要在应用程序中的多个位置实现的关注点。它会影响整个应用程序。

## AOP术语

**Aspect:** 方面是一个模块，其中封装了**advice**和**pointcuts**，并提供**cross-cutting**可以有许多方面。我们可以使用带有 **@Aspect** 批注的常规类来实现方面。**Pointcut:** 切入点是一种表达式，它选择一个或多个执行Advice的连接点。我们可以使用**expressions**或**patterns**定义切入点。它使用与联接点匹配的不同类型的表达式。在Spring Framework中，使用 **AspectJ** 切入点表达语言。**Join point:** 连接点是应用程序中应用 **AOP方面**的点。或者它是Advice的特定执行实例。在AOP中，连接点可以是**方法执行，异常处理，更改对象变量值**等。**Advice:** Advice是我们在方法执行之前**before**或**after**采取的措施。该动作是在程序执行期间调用的一段代码。SpringAOP框架中有**五种**类型的Advice: **在Advicebefore, after, after-returning, after-throwing和**around advice。 是针对特定**join point的Advice。** 我们将在本节中进一步讨论这些Advice。**Target object:** 一个应用了Advice的对象称为**target object**。目标对象始终是**proxied**，这意味着在运行时将创建一个覆盖目标方法的子类，并根据其配置包含Advice。**Weaving:** 这是将各个方面与其他应用程序类型进行**linking aspects**的过程。我们可以在**运行时，加载时间**和**编译时**进行织造。

**Proxy:** 它是在将Advice应用于目标对象后创建的对象，称为 **proxy** 。 Spring AOP实现了 **JDK动态代理**，以使用目标类和Advice调用创建代理类。这些称为AOP代理类。

## AOP与OOP

AOP与OOP之间的区别如下:

| AOP                                                  | OOP                                                    |
| ---------------------------------------------------- | ------------------------------------------------------ |
| **Aspect:** 一个封装切入点，Advice和属性的代码单元。 | **Class:** 一个封装方法和属性的代码单元。              |
| **Pointcut:** 它定义了执行Advice的一组入口点。       | **Method signature:** 。它定义了执行方法主体的入口点。 |
| **Advice:** 这是跨领域关注点的实现。                 | **Method bodies:** 是业务逻辑问题的实现。              |
| **Waver: 借助Advice构造代码(源或对象)。**            | **Compiler: 它将源代码转换为目标代码。**               |



## Spring AOP与AspectJ

AOP和OOP之间的区别如下:

| Spring AOP                                 | AspectJ                                                  |
| ------------------------------------------ | -------------------------------------------------------- |
| 需要单独的编译过程。                       | 它需要AspectJ编译器。                                    |
| 它仅支持方法执行切入点。                   | 它支持所有切入点。                                       |
| 它可以在Spring Container管理的bean上实现。 | 它可以在所有域对象上实现。                               |
| 它仅支持方法级编织。                       | 它可以波动字段，方法，构造函数，静态初始化器，最终类等。 |

## AOP Advice的类型

AOP Advice有五种类型，如下所示:

Before AdviceAfter AdviceAround AdviceAfter ThrowingAfter Returning

**Before Advice:** 在连接点之前执行的Advice在通知之前被调用。我们使用 **@Before** 批注将Advice标记为Before通知。

**After Advice:** 在连接点之后执行的Advice被称为after notification。我们使用 **@After** 注解将Advice标记为After通知。

**Around Advice:** 在连接点之前和之后执行的Advice是

**After Throwing:** 在连接点抛出异常时执行的Advice。

**After Returning:** 当方法成功执行时执行的Advice。

在应用程序中实现AOP之前，我们需要在pom.xml文件中添加 **Spring AOP** 依赖项。

## Spring Boot Starter AOP

Spring Boot Starter AOP是提供Spring AOP和AspectJ的依赖项。 AOP提供基本的AOP功能，而AspectJ提供完整的AOP框架。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-aop</artifactId>
<version>2.2.2.RELEASE</version>
</dependency>
```

在下一节中，我们将在应用程序中实现不同的Advice。



# SpringBoot AOP @Before

在面向方面的编程中使用建议之前，可以实现交叉操作。这是一种建议类型，可确保在方法执行之前运行建议。我们使用 **@Before** 注解来实现before通知。

# SpringBoot AOP @After

SpringBoot AOP的After Advice用于实现交叉。这是一种建议类型，可确保建议在方法执行后运行。我们使用 **@After** 注解来实现事后建议。

# SpringBoot AOP @Around

Around Advice由 **@Around** 注解表示。它在连接点之前和之后执行。这是最有力的建议。它还为最终用户提供了更多控制权，使他们可以处理 **ProceedingJoinPoint。**

# SpringBoot AOP @AfterReturning

**After returning**是Spring AOP中的一个建议，通常在连接点执行完成(执行)后调用。如果引发异常，则不会调用。我们可以使用 **@AfterReturning** 批注在应用程序中返回建议后实施。注解将功能标记为要在PointCut覆盖的方法之前执行的建议。

在返回的建议运行之后，当匹配的方法执行正常返回值时，便会执行该建议。我们在return属性中定义的名称必须与advice方法中的参数名称相对应。当方法返回值时，该值将作为相应的参数值传递到通知方法。

# SpringBoot AOP @AfterThrowing

After throwing是Spring AOP中的建议类型。如果方法抛出异常，它将确保建议运行。我们使用 **@AfterThrowing** 注解来实现掷后建议。



# Spring Boot JPA

## 什么是JPA？

**Spring Boot JPA** 是用于管理的Java规范Java应用程序中的**关系**数据。它允许我们访问和持久化Java对象/类与关系数据库之间的数据。 JPA遵循**对象关系映射**(ORM)。它是一组接口。它还提供了运行时 **EntityManager** API，用于处理针对数据库对象的查询和事务。它使用与平台无关的面向对象的查询语言JPQL(Java持久查询语言)。

在持久性方面，它涵盖了三个领域:

Java持久性API**Object-Relational**元数据在 **persistence** 包中定义的API本身

JPA不是框架。它定义了可以在任何框架中实现的概念。

## 为什么我们应该使用JPA？

与JDBC相比，JPA更简单，更清洁且劳动强度更低，SQL和手写映射。 JPA适用于非性能导向的复杂应用程序。与JDBC相比，JPA的主要优点在于，在JPA中，数据由对象和类表示，而在JDBC中，数据由表和记录表示。它使用POJO表示持久数据，从而简化了数据库编程。 JPA还有其他优点:

JPA避免使用SQL的特定于数据库的方言编写DDL。取而代之的是，它允许以XML或使用Java注解进行映射。JPA允许我们避免用SQL的数据库专用方言编写DML。JPA允许我们完全不使用任何DML语言来保存和加载Java对象和图形。当我们需要执行查询JPQL时，它允许我们用Java实体而不是(本机)SQL表和列来表达查询。

## JPA功能

JPA具有以下功能:

这是一个功能强大的存储库和自定义的**对象映射抽象。**它支持**跨商店持久性**。这意味着一个实体可以部分存储在MySQL和Neo4j(图形数据库管理系统)中。它从查询方法名称动态生成查询。域基类提供基本属性。它支持透明审核。集成自定义存储库代码的可能性。通过自定义名称空间很容易与Spring Framework集成。

## JPA体系结构

JPA是将业务实体存储为关系实体的源。它显示了如何将POJO定义为实体以及如何通过关系管理实体。

下图描述了JPA的类级别体系结构，该体系结构描述了JPA的核心类和接口。 **javax持久性**包。 JPA体系结构包含以下单元:

**Persistence:** 这是一个包含用于获取EntityManagerFactory实例的静态方法的类。**EntityManagerFactory:** 是EntityManager的工厂类。它创建和管理EntityManager的多个实例。**EntityManager:** 。它是一个界面。它控制对对象的持久性操作。它适用于Query实例。**Entity**: 实体是作为记录存储在数据库中的持久性对象。**Persistence Unit:** 它定义了一组所有实体类。在应用程序中，EntityManager实例对其进行管理。一组实体类表示包含在单个数据存储中的数据。**EntityTransaction:** 它与EntityManager类具有**一对一**关系。对于每个EntityManager，操作都由EntityTransaction类维护。**Query:** 该接口由每个JPA供应商实现，以获取符合条件的关系对象。![Spring Boot jpa](https://www.cainiaojc.com/static/upload/210424/0447160.png)

## JPA类关系

我们上面讨论的类和接口保持一种关系。下图显示了类和接口之间的关系。

![Spring Boot jpa](https://www.cainiaojc.com/static/upload/210424/0447161.png)EntityManager和EntiyTransaction之间的关系是**一对一**。每个EntityManager操作都有一个EntityTransaction实例。EntityManageFactory和EntiyManager之间的关系是**一对多**。这是EntityManager实例的工厂类。EntityManager和Query之间的关系是**一对多**。我们可以使用EntityManager类的实例执行任意数量的查询。EntityManager和Entity之间的关系是**一对多**。 EntityManager实例可以管理多个实体。

## JPA实现

JPA是一种开源API。有各种企业供应商，例如Eclipse，RedHat，Oracle等，通过在其中添加JPA来提供新产品。有一些流行的JPA实现框架，例如 **Hibernate，EclipseLink，DataNucleus** 等。它也称为**对象关系映射**(ORM)工具。

## 对象关系映射(ORM)

在ORM中，Java对象到数据库表的映射(反之亦然)被称为**对象关系映射。** ORM映射充当**关系数据库**(表和记录)和 **Java应用程序**(类和对象)之间的桥梁。

在下面如图所示，ORM层是适配器层。它将对象图的语言适应SQL和关系表的语言。

![Spring Boot jpa](https://www.cainiaojc.com/static/upload/210424/0447162.png)

ORM层存在于应用程序和数据库之间。它转换Java类和对象，以便可以在关系数据库中存储和管理它们。默认情况下，持久化的名称将成为表的名称，而字段将成为列。一旦应用程序建立，每个表行都对应一个对象。

## JPA版本

EJB的早期版本定义了与业务逻辑层结合的持久层。使用 **javax.ejb.EntityBean** 接口。 EJB规范包括JPA的定义。

在引入EJB 3.0时，持久层被分离并指定为JPA 1.0(Java Persistence API)。该API的规范已与2006年5月11日使用JSR 220的JAVA EE5规范一起发布。

2019年，JPA重命名为 **Jakarta Persistence** 。 JPA的最新版本是 **2.2** 。它支持以下功能:

Java 8，数据和时间APIAttributeConvertes中的CDI注入它使注解@Repeatable

## JPA和Hibernate之间的区别

**JPA:** JPA是一种Java规范，用于访问，管理和持久化之间的数据Java对象和关系数据库。这是ORM的标准方法。

**Hibernate:** 这是一种轻量级的开源ORM工具，用于在关系数据库系统中存储Java对象。它是JPA的提供者。它遵循JPA提供的一种通用方法。

下表描述了JPA和Hibernate之间的区别。

| JPA                                                          | Hibernate                                                |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| JPA是用于在Java应用程序中映射关系数据的 **Java规范**。       | Hibernate是一个用于处理数据持久性的 **ORM框架**。        |
| JPA不提供任何实现类。                                        | 它提供了实现类。                                         |
| 它使用称为 **JPQL** (Java持久性查询语言)的平台无关的查询语言。 | 它使用自己的称为 **HQL** 的查询语言(Hibernate查询语言)。 |
| 它在 **javax.persistence** 包中定义。                        | 它在 **org.hibernate** 包中定义。                        |
| 它在 **Hibernate，EclipseLink** 等各种ORM工具中实现。        | Hibernate是JPA的**提供者**。                             |
| JPA使用 **EntityManager** 处理数据的持久性。                 | 在Hibernate中，使用 **Session** 处理数据的持久性。       |

## Spring Boot启动程序数据JPA

Spring Boot提供了启动程序依赖项 **spring-boot-starter-data-jpa** 以连接Spring Boot应用程序高效地使用关系数据库。 spring-boot-starter-data-jpa在内部使用spring-boot-jpa依赖项。

示例

```
<dependency>  
<groupId>org.springframework.boot</groupId>  
<artifactId>spring-boot-starter-data-jpa</artifactId>  
<version>2.2.2.RELEASE</version>  
</dependency>
```



**Spring Boot JDBC** 提供了用于将应用程序与JDBC连接的启动程序和库。

在Spring Boot JDBC中，与数据库相关的Bean(例如 **DataSource，JdbcTemplate** 和 **NamedParameterJdbcTemplate** )会在启动期间自动配置并创建。如果我们想使用它们，我们可以自动装配这些类。例如:

示例

```
@Autowired
JdbcTemplate jdbcTemplate;
@Autowired
private NamedParameterJdbcTemplate jdbcTemplate;
```

在 **application.properties** 文件中，我们配置 **DataSource** 和 **连接池**。 Spring Boot 默认选择 **tomcat** 池。





# SpringBoot 增删改查

## 什么是CRUD操作？

**CRUD** 代表 **创建，读取/检索，更新**和 **删除**。这些是持久性存储的四个基本功能。

可以将CRUD操作定义为用户界面约定，该约定允许通过基于计算机的表单和报告查看，搜索和修改信息。 CRUD是面向数据的，是 **HTTP动作动词**的标准化用法。 HTTP有一些重要的动词。

**POST:** 创建新资源**GET:** 读取资源**PUT:** 更新现有资源**DELETE:** 删除资源

在数据库中，这些操作中的每一个都直接映射到一系列命令。但是，它们与RESTful API的关系稍微复杂一些。

## 标准CRUD操作

**创建操作:** 它执行INSERT语句以创建新记录。**读取操作:** 它根据输入参数读取表记录。**更新操作:** 它在表上执行一条update语句。它基于输入参数。**删除操作:** 它将删除表中的指定行。它也基于输入参数。

## CRUD操作的工作原理

CRUD操作是最动态的网站的基础。因此，我们应该将 **CRUD** 与 **HTTP** **动作动词**区分开来。

假设我们要 **创建**一条新记录，我们应该使用HTTP操作动词 **POST** 。要 **更新**一条记录，我们应该使用 **PUT** 动词。同样，如果要 **删除**记录，则应使用 **DELETE** 动词。通过CRUD操作，用户和管理员有权在线检索，创建，编辑和删除记录。

我们有许多执行CRUD操作的选项。最有效的选择之一是在SQL中创建一组存储过程来执行操作。

CRUD操作引用关系数据库应用程序中实现的所有主要功能。 CRUD的每个字母都可以映射到SQL语句和HTTP方法。

| 操作       | SQL    | HTTP动词       | RESTful Web服务 |
| ---------- | ------ | -------------- | --------------- |
| **Create** | INSERT | PUT/POST       | POST            |
| **Read**   | SELECT | GET            | GET             |
| **Update** | UPDATE | PUT/POST/PATCH | PUT             |
| **Delete** | Delete | Delete         | Delete          |

## Spring Boot CrudRepository

Spring Boot提供了一个名为 **CrudRepository** 的接口，其中包含用于CRUD操作的方法。它在包 **org.springframework.data.repository** 中定义。它扩展了Spring Data **存储库**界面。它在存储库上提供通用的Crud操作。如果要在应用程序中使用CrudRepository，则必须创建一个接口并扩展 **CrudRepository** 。

**语法**

示例

```
public interface CrudRepository<T,ID> extends Repository<T,ID>
```

其中

**T** 是存储库管理的域类型。**ID** 是存储库管理的实体的ID类型。

例如:

示例

```
public interface StudentRepository extends CrudRepository<Student, Integer>
{
}
```

在上面的示例中，我们创建了一个名为 **StudentRepository** 的接口，该接口扩展了CrudRepository。其中 **Student** 是要管理的存储库，而 **Integer** 是Student存储库中定义的ID类型。

## Spring引导JpaRepository

JpaRepository提供了与JPA相关的方法，例如刷新，持久性上下文，并批量删除了一条记录。它在包 **org.springframework.data.jpa.repository中定义。** JpaRepository扩展了 **CrudRepository** 和 **PagingAndSortingRepository。**

例如:

示例

```
public interface BookDAO extends JpaRepository 
{
}
```


![Spring Boot CRUD操作](https://www.cainiaojc.com/static/upload/210424/0619280.png)

## 为什么要使用这些接口？

这些接口允许Spring查找存储库接口并为此创建代理对象。它提供了允许我们执行一些常见操作的方法。我们还可以定义自定义方法。

## CrudRepository与JpaRepository

| CrudRepository                                               | JpaRepository                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CrudRepository没有提供任何用于分页和排序的方法。             | JpaRepository扩展了PagingAndSortingRepository。它提供了实现分页的所有方法。 |
| 它用作**标记**界面。                                         | JpaRepository扩展了 **CrudRepository** 和 **PagingAndSortingRepository** 。 |
| 它仅提供CRUD功能。例如 **findById(),findAll()**等。          | 它提供了一些额外的方法以及PagingAndSortingRepository和CrudRepository的方法。例如， **flush(),deleteInBatch()。** |
| 在不需要JpaRepository和PagingAndSortingRepository提供的功能时使用。 | 当我们要在应用程序中实现分页和排序功能时使用。               |



# SpringBoot 缓存提供程序

SpringBoot框架允许集成各种 **缓存提供程序**，例如 **EhCache、Redis、Hazelcast、Infinispan、Caffeine，**等。缓存提供程序允许开发人员在应用程序中透明且显式地配置缓存。我们应该使用缓存，因为它减少了执行次数并提高了应用程序的性能。

在Spring中引导，缓存抽象未提供缓存的实际空间。这取决于 **org.springframework.cache.Cache** 或 **org.springframework.cache.CacheManager** 接口所发生的抽象。

## 缓存自动配置

Spring Boot Framework通过自动配置支持简化了缓存的实现。它在类路径中搜索库和配置文件，并在应用程序启动时初始化所需的依赖项Bean。缓存的自动配置包括以下步骤:

在配置文件中添加注解 **@EnableCaching** 。在类路径中添加所需的**缓存库**。在类路径的根目录中，为缓存提供程序添加**配置文件**。

例如，如果我们要在应用程序中实现 **EhCache** ，首先我们在配置文件中启用缓存。

示例

```
@SpringBootApplication
@EnableCaching
public class Employee
{
@Bean
public CacheManager cacheManager()
{
//some code
}
}
```

在 **pom.xml** 文件中添加 **EhCache** 依赖性。它将所需的库添加到类路径中。

示例

```
<dependency>
<groupId>org.ehcache</groupId>
<artifactId>ehcache</artifactId>
</dependency>
```

最后，为高速缓存提供程序配置文件。在这里，我们正在使用EhCache，因此需要在类路径的根目录下配置 **ehcache.xml** 文件。

当我们没有定义 **CacheManager** 或 **CacheResolver** ，Spring Boot Framework会尝试检测以下缓存提供程序:

**Generic****JCache****EhCache****Hazelcast****Infinispan****Couchbase****Redis****Caffeine****Simple**

如果Spring Boot在类路径中找到多个缓存提供程序，则在这种情况下，我们必须在 **application.properties** 文件中明确指定缓存提供程序。

示例

```
spring.cache.ehcache.provider=net.sf.ehcache.CacheManager
spring.cache.ehcache.config=classpath:config/another-config.xml
```

我们可以使用属性 **spring.cache.type** 设置特定的缓存提供程序。如果要禁用缓存，则在特定环境中使用它。

示例

```
spring.cache.type=none
```

Spring Boot Framework提供了一个启动程序依赖项，该依赖项在应用程序中添加了基本的缓存依赖项。默认情况下，启动程序缓存依赖项提供 **spring-context-support** 依赖项。

注意: 如果我们手动添加缓存依赖项，则必须在pom.xml文件中包含spring-context-support依赖项。因为，它提供了对Jcache，EhCache和Caffiene的支持。

示例

```
<dependency>
<groupId>org.springframework</groupId>
<artifactId>spring-context-support</artifactId>
<version>5.2.3.RELEASE</version>
</dependency>
```

Spring Boot Framework自动配置CacheManager，可以通过实现 **CacheManagerCustomizer** 接口进一步对其进行自定义。

在follwoig示例中，我们设置了一个传递标记主映射的空值。

示例

```
@Bean
public CacheManagerCustomizer<ConcurrentMapCacheManager> cacheManagerCustomizer() 
{
return new CacheManagerCustomizer<ConcurrentMapCacheManager>() 
{
@Override
public void customize(ConcurrentMapCacheManager cacheManager) 
{
cacheManager.setAllowNullValues(false);
}
};
}
```

上面的bean需要一个自动配置的 **ConcurrentMapCacheManager** 。如果ConcurrentMapCacheManager没有自动配置，则定制器将不会以任何方式调用。我们可以使用任意数量的定制程序，并使用注解 **@Order** 或 **@Ordered。**

### Generic缓存

如果spring-context-support定义了至少一个 **org.springframework.cache.Cache.Cache** bean，它将使用通用缓存。 **CacheManager** 捆绑并配置了所有bean。

### JCache

JCache是由 **javax.cache.spi.CahingProvider。**。它位于类路径JSR 107中。spring-boot-starter-cache提供了 **JCacheCacheManager。**我们也可以添加其他任何缓存库。

注意: 如果缓存库同时提供本机实现和JSR支持，则Spring Boot首选JSR支持。

### EhCache 2.x

EHCache是基于Java的开放源代码，被广泛使用。为了使用EhCache，我们应该使用以下依赖项。

示例

```
<dependency>
<groupId>org.ehcache</groupId>
<artifactId>ehcache</artifactId>
</dependency>
```

有两种方法配置EhCache:

首先，通过配置Java POJO文件(其中所有配置参数均通过EhCache API配置)。其次，通过配置XML文件，我们根据提供的架构定义在其中配置EhCache。

EhCache使用了一个名为 **ehcache.xml的文件。** 如果应用程序在类路径上找到了文件，则为spring-boot-starter-cache提供的 **EhCacheCacheManager** 。我们可以使用以下属性来配置 XML 文件:

示例

```
spring.cache.ehcache.config=classpath:config/demo-config.xml
```

### Hazelcast

当我们在应用程序中启用缓存时，Spring Boot会自动将 **HazelcastInstance** 包装在CacheManager中。它在节点之间平均分配数据。我们可以使用以下属性来配置Hazelcast。

示例

```
spring.hazelcast.config=classpath:config/demo-hazelcast.xml
```

如果未设置该属性，Spring Boot会尝试在类路径中找到 **hazelcast.xml** (Hazelcast配置)文件。

### Infinispan

Infinispan是嵌入式 Java 库。它用作 **缓存**或 **数据网格**。它以 **键值**形式存储数据。它可以轻松地与JCache， JPA Quarkus， Spring 等。

它没有默认文件位置，因此我们应该明确指定它。如果未明确指定infinispan，则会使用默认的引导程序。

示例

```
spring.cache.infinispan.config=infinispan.xml
```

### Couchbase

当我们实现 **couchbase-spring-cache** 并配置了Couchbase时，会自动配置 **CouchebaseCacheManager** 。与缓存有关的所有操作都在 **Bucket** 中执行。它允许我们通过设置属性 **spring.cache.cache-name来创建其他缓存(如果需要)。**

自定义程序允许我们创建其他存储桶，其中可以创建另一个缓存。

让我们通过一个示例来了解上述概念。

假设我们需要三个名为 **cacheA** ， **cacheB，**和 **cacheC** 。 cacheA和cacheB位于主存储桶(即自动配置的存储桶)上。 cacheC在另一个存储桶上，该存储桶可以存活几秒钟，例如4秒钟。因此，我们可以通过指定属性来创建cacheA和cacheB，如下所示:

示例

```
spring.cache.cache-names=cacheA, cacheB
```

### Redis

当我们配置 **Redis** 时，将自动配置 **RedisCacheManager** 。它还允许我们使用属性 **spring.cache.cache-names** 创建其他缓存。可以使用属性 **spring.cache.redis。\*** 实现默认配置。

我们可以使用 **RedisCacheConfiguration** 完全控制默认配置。 strong bean。

示例

```
spring.cache.cache-names=cacheA, cacheB
spring.cache.redis.time-to-live=100000
```

以上属性配置了两个缓存，分别称为cacheA和cacheB，它们的寿命为10分钟。

### Caffeine

咖啡因是基于Java的缓存库。它还提供了一个内存中缓存。如果spring-boot-starter-cache依赖项在类路径中找到了Caffeine，它会自动配置 **CaffeineCacheManger** 。如果要在应用程序中使用咖啡因，则需要添加以下依赖项:

示例

```
<dependency>
<groupId>com.github.ben-manes.caffeine</groupId>
<artifactId>caffeine</artifactId>
<version>2.7.0</version>
</dependency>
```

通过咖啡因缓存，我们可以使用属性 **spring.cache.caffeine.spec定义缓存的\**大小\**和\**生存时间\**。** 例如:

示例

```
spring.cache.cache-names=cacheA,cacheB
spring.cache.caffeine.spec=maximumSize=500,expireAfterAccess=600s
```

上面的配置创建两个名为cache1和cache2的缓存。缓存的最大大小为 **500** ，最长生存时间为 **6** 秒。

### Simple

这是默认实现。如果未指定缓存提供程序。如果Spring Boot在类路径中找不到任何缓存提供程序，则会将 **ConcurrentHashMap** 配置为缓存存储。

例如，如果我们需要两个缓存，请使用设置它们的名称。以下属性:

示例

```
spring.cache.cache-names=cache1,cache2
```

### None

当我们使用注解@EnableCaching启用缓存时，应用程序需要合适的配置。当我们要在特定环境中 **禁用**缓存时使用。我们使用属性 **spring.cache.type** 禁用缓存。

示例

```
spring.cache.type=none
```





# SpringBoot EhCaching

## EhCache

EhCache是一种基于Java的开源缓存，用于提高性能。 Ehcache的当前版本为 **3** 。它提供了 **JSR-107** 缓存管理器的实现。我们可以直接使用它。

## EhCache的功能

它**快速**，**轻巧，可扩展**和**灵活**。它允许我们执行**可序列化**和**对象**它提供诸如 **LRU，LFU，FIFO等**的缓存逐出策略。它将缓存存储在**内存**和**磁盘**(SSD)中。它依赖于 **SLF4J** 进行记录。它已完全实现 **JSR-107** 和 **Jcache**它支持通过 **JGroups** 或 **JMS** 和 **RMI** 进行分布式缓存。它使用**流利的查询语言**进行分布式搜索。

## EhCache使用模式

缓存使用多种访问模式。 EhCache使用以下模式:

**Cache-aside****Cache-as-SoR (system-of-record)****Read-through****Write-through****Write-behind**

### Cache-aside

在 **备用缓存**模式中，首先，应用程序查询缓存。如果找到数据，它将直接返回数据。在相反的情况下，它从SoR中获取数据，将其存储到缓存中，然后返回。

### Cache-as-SoR

**cache-as-SoR** 模式代表SoR对缓存的读写操作。它减少了应用程序的责任。它使用读写模式的组合，包括 **直读，直写，**和 **后写。** 它减少了应用程序的难度。它允许缓存解决雷电问题

### Read-through

**Read-through**模式还复制了缓存-从高速缓存中读取数据时预留模式。读取和缓存保留之间的区别在于，读取模式实现了 **CacheEntryFactory** 接口。它指导缓存如何从缓存中读取对象。最好在使用通读模式时将EhCache实例包装为 **SelfPopulatingCache** 实例。

### Write-through

**Write-through**模式还可以在将数据写入缓存时复制备用缓存模式。直写模式和备用缓存模式之间的区别在于，直写模式实现 **CacheWriter** 接口。它为直写和后写模式配置高速缓存。它在同一执行线程中将数据写入SoR。

### Write-behind

**Write-behind**模式的形式不同其他三种模式。在 **可配置的延迟**之后，它会修改缓存条目。延迟可能会在 **秒，分钟，一天，一周，**或 **很长时间**。同时，它还将数据排队，以便稍后在同一执行线程中写入。

使用后写模式进行数据写入发生在事务范围之外。这意味着它创建了一个新事务以在SoR中提交与主事务不同的数据。

## EhCaching存储层

EhCache允许我们使用各种数据存储区域，例如堆，磁盘和群集。我们可以配置一个多存储缓存(使用多个存储区域)。可以将其安排为 **层。**

这些层是按顺序组织的。最底层是 **授权层**，另一层是 **缓存层**。也称为 **nearer** 或 **near cache。** 缓存层可以具有多个存储区域。最热的数据保留在缓存层中，因为它比授权层更快。与高速缓存层相比，其他数据保留在权限层中，速度较慢但较丰富。

EhCache支持的数据存储类型有 **四种**:

**On-Heap Store****Off-Heap Store****Disk Store****Clustered Store**

### On-Heap Store

它将缓存条目存储在Java堆内存中。它与 Java 应用程序共享存储。这是快速的，因为它使用堆，但存储空间有限。垃圾收集器还会扫描堆上存储。

### Off-Heap Store

它使用主内存(RAM)来存储缓存条目。垃圾收集器不会对其进行扫描。它比堆上存储慢，因为缓存条目在使用前移到了堆上存储。它的大小受到限制。

### Disk Store

它使用磁盘来存储高速缓存条目。它比基于 RAM 的存储(存储上和存储下)要慢得多。如果使用磁盘存储模式，最好使用专用磁盘。

### Clustered Store

它将缓存条目存储在远程服务器上。它比堆外存储慢。它可能具有提供高可用性的故障转移服务器。





# Spring Boot缓存

Spring框架透明地在Spring应用程序中提供缓存。在Spring中，**缓存抽象**是一种机制，它允许在不影响代码的情况下一致使用各种缓存方法。

## 缓存抽象

缓存抽象机制适用于 **Java 方法**。使用缓存抽象的主要目的是根据缓存中存在的信息**减少**执行次数。它适用于昂贵的方法，例如 **CPU** 或 **IO绑定。**

每次调用方法时，抽象都会将缓存行为应用于该方法。它检查该方法是否已经针对给定参数执行。

如果是，则不执行实际方法就返回缓存的结果。如果否，则首先执行该方法，并将结果缓存并返回给用户。

注意: 此方法仅适用于保证为给定输入返回相同结果的方法。该方法执行多少次并不重要。

开发人员在处理缓存抽象时会注意两件事。

**缓存声明**: 它标识需要缓存的方法。**缓存配置:** 用于存储和读取数据的后备缓存。

### 缓存

缓存是临时内存的一部分( RAM )。它位于应用程序和持久性数据库之间。它存储最近使用的数据，从而尽可能减少数据库命中次数。换句话说，缓存是为了存储数据以供将来参考。

## 为什么要使用缓存？

使用缓存的主要原因是为了进行数据访问更快，更便宜。当多次请求高度请求的资源时，对于开发人员来说，缓存资源通常是有益的，这样它可以快速给出响应。在应用程序中使用缓存可以增强应用程序的性能。与从数据库中获取数据相比，从内存进行数据访问总是更快。它降低了货币成本和机会成本。

## 应缓存哪些数据？

不经常更改的数据。经常使用的读取查询，其查询结果在每个调用中至少一段时间没有变化。

## 缓存类型

有**四种**缓存类型如下:

内存中缓存数据库缓存Web服务器缓存CDN缓存

### 内存缓存

内存缓存可提高应用程序的性能。这是经常使用的区域。 **Memcached** 和 **Redis** 是内存中缓存的示例。它在应用程序和数据库之间存储键值。 Redis是一种**内存中，分布式**高级缓存工具，可用于备份和还原功能。我们还可以管理分布式集群中的缓存。

### 数据库缓存

数据库缓存是一种通过获取数据按需(动态)生成网页的机制。从数据库中。它在涉及客户端，Web应用程序服务器和数据库的**多层**环境中使用。通过分配查询工作负载，它提高了**可扩展性**和**性能**。最受欢迎的数据库缓存是 Hibernate 的一级缓存。

### Web服务器缓存

Web服务器缓存是一种存储数据以便**重用**的机制。例如，由Web服务器提供的网页的副本。用户首次访问该页面时将对其进行缓存。如果用户下次再次请求相同的内容，则缓存将提供页面的副本。这样可以避免服务器表单过载。 Web服务器缓存可提高页面交付速度，并减少后端服务器要做的工作。

### CDN缓存

**CDN** 代表**内容交付网络**。它是现代Web应用程序中使用的组件。通过**复制**常用文件(例如 HTML 页面，样式表)，它可以改善内容的传递。 ， JavaScript ，图像，视频等)分布在一组全球分布的**缓存服务器上。**

这是CDN越来越受欢迎的原因。 CDN减轻了应用程序源的负担，并改善了用户体验。它从附近的**缓存边缘**(更靠近最终用户的缓存服务器)或**存在点(PoP)**提供内容的本地副本。

## 缓存与缓冲区

| 缓存                       | 缓冲区                        |
| -------------------------- | ----------------------------- |
| 缓存基于**最近最少使用**。 | 缓冲区基于**先进先出**        |
| 它是页面缓存的大小。       | 它是内存中的原始块I/O缓冲区。 |
| 它生存了**很长**时期。     | 它生存了**短**时期。          |
| 我们**从缓存中读取**。     | 我们**写入**到缓冲区。        |
| 它存储**实际**文件数据。   | 它存储文件**元数据**。        |
| 它提高了 **read** 性能。   | 它提高了**写入**性能。        |

## Spring Boot缓存注解

### @EnableCaching

这是一个类级别的注解。我们可以通过使用 **@EnableCaching注解在Spring Boot应用程序中启用缓存。**它在 **org.springframework.cache.annotation** 包中定义。它与 **@Configuration** 类一起使用。

如果没有已定义的CacheManager实例，自动配置将启用缓存并设置 **CacheManager** 。它会扫描特定的提供程序，如果找不到，则会使用并发的 **HashMap创建内存中缓存。**

**示例**

在以下示例中， **@EnableCaching** 注解启用了缓存机制。

示例

```
@SpringBootApplication
@EnableCaching 
public class SpringBootCachingApplication 
{
public static void main(String[] args) 
{
SpringApplication.run(SpringBootCachingApplication.class, args);
}
}
```

### @CacheConfig

这是一个类级别的注解，提供了与缓存有关的通用设置。它告诉Spring将类的缓存存储在何处。当我们使用注解为类添加注解时，它为该类中定义的任何缓存操作提供了一组默认设置。使用注解，我们不需要多次声明。

**示例**

在下面的示例中，**员工**是缓存的名称。

示例

```
@CacheConfig(cacheNames={"employee"}) 
public class UserService
{
//some code
}
```

### @Caching

当我们同时需要两个注解 **@CachePut** 或 **@CacheEvict** 时使用同样的方法。换句话说，当我们要使用相同类型的多个注解时使用。

但是 **Java不允许为给定声明相同类型的多个注解**方法。为避免此问题，我们使用 **@Caching** 注解。

**示例**

在下面的示例中，我们使用了注解 **@Caching** 并将所有 **@CacheEvict** 注解分组。

示例

```
@Caching(evict = {@CacheEvict("phone_number"), @CacheEvict(value="directory", key="#student.id") })public String getAddress(Student student) 
{
//some code
}
```

### @Cacheable

它是方法级别的注解。它为方法的返回值定义了一个缓存。 Spring框架管理方法对注解属性中指定的缓存的请求和响应。 @Cacheable批注包含更多选项。例如，我们可以使用 **value** 或 **cacheNames** 属性提供**缓存名称**。

我们还可以指定注解的 **key** 属性，用于唯一标识缓存中的每个条目。如果未指定密钥，Spring将使用默认机制来创建密钥。

**示例**

在以下示例中，我们缓存了< **cacheStudentInfo，**和 **id** 中方法 **studentInfo()**的strong>返回值是唯一键，用于标识缓存。

示例

```
@Cacheable(value="cacheStudentInfo", key="#id")public List studentInfo()
{
//some code 
return studentDetails;
}
```

我们还可以通过使用condition属性在注解中应用条件。当我们在注解中应用条件时，它称为**条件缓存**。

例如，如果参数名称的长度短于20，则将缓存以下方法。

示例

```
@Cacheable(value="student", condition="#name.length<20")public Student findStudent(String name)
{
//some code
}
```

### @CacheEvict

它是方法级别的注解。当我们想要从缓存中删除陈旧或未使用的数据时，将使用它。它需要一个或多个受操作影响的缓存。我们还可以在其中指定键或条件。如果我们想要广泛的缓存驱逐，则@CacheEvict批注提供一个名为 **allEntries** 的参数。它会驱逐所有条目，而不是根据密钥驱逐一个条目。

关于@CacheEvict批注的重要一点是它可以与void方法一起使用，因为该方法充当触发器。它避免了返回值。另一方面，@Cacheable批注需要一个返回值，该值用于添加/更新缓存中的数据。我们可以通过以下方式使用@CacheEvict批注:

逐出整个缓存:

示例

```
@CacheEvict(allEntries=true)
```

通过密钥逐出条目:

示例

```
@CacheEvict(key="#student.stud_name")
```

**示例**

以下带注解的方法从缓存 **student_data** 中清除所有数据。

示例

```
@CacheEvict(value="student_data", allEntries=true) //removing all entries from the cache
public String getNames(Student student) 
{
//some code
}
```

### @CachePut

它是方法级别的注解。当我们想要**更新**缓存而不干扰方法执行时，使用它。这意味着该方法将始终执行，并将其结果放入缓存中。它支持@Cacheable批注的属性。

需要注意的是，由于@Cacheable和@CachePut批注的行为不同，因此它们是不相同的。 @Cacheable和@CachePut批注之间存在细微差别，就是@ **Cacheable** 批注**跳过方法执行**，而 **@CachePut** 批注**运行该方法**，然后将结果放入缓存。

**示例**

以下方法将更新缓存本身。

示例

```
@CachePut(cacheNames="employee", key="#id")  //updating cachepublic Employee updateEmp(ID id, EmployeeData data)
{
//some code
}
```

## Spring Boot缓存依赖项

如果要在Spring Boot应用程序中启用缓存机制，则需要在pom.xml文件中添加缓存依赖项。它启用缓存并配置CacheManager。

示例

```
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```





