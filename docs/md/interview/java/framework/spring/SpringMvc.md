# Spring MVC

## 基础

### 什么是 SpringMvc？

SpringMvc 是 spring 的一个模块，基于 MVC 的一个框架，无需中间整合层来整合。

### Spring MVC 的优点

1）它是基于组件技术的.全部的应用对象,无论控制器和视图,还是业务对象之类的都是 java 组件.并且和 Spring 提供的其他基础结构紧密集成.

2）不依赖于 Servlet API(目标虽是如此,但是在实现的时候确实是依赖于 Servlet 的)

3）可以任意使用各种视图技术,而不仅仅局限于 JSP

4）支持各种请求资源的映射策略

5）它应是易于扩展的

### SpringMVC 工作原理？

1）客户端发送请求到 DispatcherServlet

2）DispatcherServlet 查询 handlerMapping 找到处理请求的 Controller

3）Controller 调用业务逻辑后，返回 ModelAndView

4）DispatcherServlet 查询 ModelAndView，找到指定视图

5）视图将结果返回到客户端

### SpringMvc 的控制器是不是单例模式,如果是,有什么问题,怎么解决？

是单例模式,所以在多线程访问的时候有线程安全问题,不要用同步,会影响性能的,解决方案是在控制器里面不能写字段。

### 如果你也用过 struts2.简单介绍下 springMVC 和 struts2 的区别有哪些?

1）springmvc 的入口是一个 servlet 即前端控制器，而 struts2 入口是一个 filter 过虑器。

2）springmvc 是基于方法开发(一个 url 对应一个方法)，请求参数传递到方法的形参，可以设计为单例或多例(建议单例)，struts2 是基于类开发，传递参数是通过类的属性，只能设计为多例。

3）Struts 采用值栈存储请求和响应的数据，通过 OGNL 存取数据，springmvc 通过参数解析器是将 request 请求内容解析，并给方法形参赋值，将数据和视图封装成 ModelAndView 对象，最后又将 ModelAndView 中的模型数据通过 reques 域传输到页面。Jsp 视图解析器默认使用 jstl。

### SpingMvc 中的控制器的注解一般用那个,有没有别的注解可以替代？

一般用@Conntroller 注解,表示是表现层,不能用用别的注解代替。

### @RequestMapping 注解用在类上面有什么作用？

是一个用来处理请求地址映射的注解，可用于类或方法上。用于类上，表示类中的所有响应请求的方法都是以该地址作为父路径。

### 怎么样把某个请求映射到特定的方法上面？

直接在方法上面加上注解@RequestMapping,并且在这个注解里面写上要拦截的路径

### 如果在拦截请求中,我想拦截 get 方式提交的方法,怎么配置？

可以在@RequestMapping 注解里面加上 method=RequestMethod.GET

### 怎么样在方法里面得到 Request,或者 Session？

直接在方法的形参中声明 request,SpringMvc 就自动把 request 对象传入

### 我想在拦截的方法里面得到从前台传入的参数,怎么得到？

直接在形参里面声明这个参数就可以,但必须名字和传过来的参数一样

### 如果前台有很多个参数传入,并且这些参数都是一个对象的,那么怎么样快速得到这个对象？

直接在方法中声明这个对象,SpringMvc 就自动会把属性赋值到这个对象里面。

### SpringMvc 中函数的返回值是什么？

返回值可以有很多类型,有 String, ModelAndView,当一般用 String 比较好。

### SpringMVC 怎么样设定重定向和转发的？

在返回值前面加"forward:"就可以让结果转发,譬如"forward:user.do?name=method4" 在返回值前面加"redirect:"就可以让返回值重定向,譬如"redirect:http://www.baidu.com"

### SpringMvc 用什么对象从后台向前台传递数据的？

通过 ModelMap 对象,可以在这个对象里面用 put 方法,把对象加到里面,前台就可以通过 el 表达式拿到。

### SpringMvc 中有个类把视图和数据都合并的一起的,叫什么？

ModelAndView。

### 怎么样把 ModelMap 里面的数据放入 Session 里面？

可以在类上面加上@SessionAttributes 注解,里面包含的字符串就是要放入 session 里面的 key

### SpringMvc 怎么和 AJAX 相互调用的？

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

    •     <mvc:mapping path="/modelMap.do" />

    •     <bean class="com.et.action.MyHandlerInterceptorAdapter" />

  </mvc:interceptor>

</mvc:interceptors>
```

## 启动运行相关

### Spring MVC 启动流程

在 web.xml 文件中给 Spring MVC 的 Servlet 配置了 load-on-startup，所以程序启动的时候会初始化 Spring MVC，在 HttpServletBean 中将配置的 contextConfigLocation 属性设置到 Servlet 中，然后在 FrameworkServlet 中创建了 WebApplicationContext, DispatcherServlet 根据 contextConfigLocation 配置的 classpath 下的 xml 文件初始化了 Spring MVC 总的组件。

### Spring MVC 运行流程

1. 用户发起请求到**前端控制器 DispatcherServlet**
2. **前端控制器 DispatcherServlet**收到请求调用**处理器映射器 HandlerMapping**查找**处理器 Handler**（可以根据 xml 配置、注解进行查找），并**前端控制器 DispatcherServlet**返回**处理器 Handler**
3. **前端控制器 DispatcherServlet**调用**处理器适配器 HandlerAdaptor**去执行**处理器 Handler**
4. **处理器 Handler**执行完成给**处理器适配器 HandlerAdaptor**返回**ModelAndView**（ModelAndView 是 springmvc 框架的一个底层对象，包括 Model 和 view）
5. **处理器适配器 HandlerAdaptor**向**前端控制器 DispatcherServlet**返回**ModelAndView**
6. **前端控制器 DispatcherServlet**请求**视图解析器 ViewReslover**对**ModelAndView**进行视图解析
7. **视图解析器 ViewReslover**向**前端控制器 DispatcherServlet**返回**View**
8. **前端控制器 DispatcherServlet**根据**View**进行**视图渲染**（ 将 ModelAndView 中的模型数据填充到 request 域）
9. **前端控制器 DispatcherServlet**向用户响应结果

###

###

# Spring MVC 技术指南

## 1. Spring MVC 概述

### 1.1 Spring MVC 简介

Spring MVC 是 Spring 框架的一个重要模块，是基于模型-视图-控制器（MVC）设计模式的 Web 框架。它为构建灵活且松散耦合的 Web 应用程序提供了丰富的功能，无需中间整合层即可与 Spring 框架的其他组件无缝集成。

### 1.2 MVC 架构模式

**MVC 模式构成：**

-   **Model（模型）**：负责数据访问和业务逻辑处理
-   **View（视图）**：负责数据展示和用户界面渲染
-   **Controller（控制器）**：负责接收用户请求，调用模型处理业务，选择视图展示结果

**架构优势：**

-   **关注点分离**：业务逻辑、数据、界面分离
-   **松耦合**：各层之间依赖关系简单
-   **易于维护**：修改一层不影响其他层
-   **可重用性**：组件可以在不同上下文中重用

### 1.3 Spring MVC 核心特性

**1. 基于组件的架构**

-   所有应用对象（控制器、视图、业务对象）都是 Java 组件
-   与 Spring 提供的其他基础设施紧密集成
-   支持依赖注入和面向切面编程

**2. 灵活的配置方式**

-   基于注解的配置（推荐）
-   基于 XML 的配置
-   Java 配置类支持

**3. 丰富的视图技术支持**

-   JSP/JSTL
-   Thymeleaf
-   FreeMarker
-   Velocity
-   JSON/XML（REST API）

**4. 强大的数据绑定**

-   自动参数绑定
-   类型转换
-   数据验证
-   格式化支持

**5. 国际化和本地化**

-   多语言支持
-   区域设置解析
-   消息资源管理

### 1.4 Spring MVC vs Struts2 对比

| 特性         | Spring MVC                        | Struts2                               |
| ------------ | --------------------------------- | ------------------------------------- |
| **入口点**   | Servlet（DispatcherServlet）      | Filter                                |
| **设计模式** | 基于方法（一个 URL 对应一个方法） | 基于类（一个 URL 对应一个 Action 类） |
| **线程安全** | 单例模式，线程安全                | 多例模式，每个请求创建新实例          |
| **参数传递** | 方法形参，自动绑定                | 类属性，通过 setter 方法              |
| **数据存储** | Model/ModelMap，通过 request 域   | 值栈（ValueStack），通过 OGNL         |
| **配置方式** | 注解为主，XML 为辅                | XML 配置为主                          |
| **学习曲线** | 相对平缓                          | 较陡峭                                |
| **性能**     | 较好，单例模式                    | 一般，多例模式开销大                  |
| **集成性**   | 与 Spring 生态完美集成            | 需要额外集成工作                      |

## 2. 核心组件与架构

### 2.1 DispatcherServlet（前端控制器）

**作用：**
DispatcherServlet 是 Spring MVC 的核心组件，作为前端控制器负责接收所有 HTTP 请求并协调各个组件完成请求处理。

**核心职责：**

-   接收用户请求
-   查找合适的处理器（Handler）
-   调用处理器执行业务逻辑
-   处理返回结果并响应给客户端

**配置示例：**

```xml
<!-- web.xml 配置 -->
<servlet>
    <servlet-name>springmvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-mvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>springmvc</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

### 2.2 HandlerMapping（处理器映射器）

**作用：**
负责根据请求 URL 找到对应的处理器（Handler/Controller）。

**常用实现：**

-   **RequestMappingHandlerMapping**：基于 @RequestMapping 注解
-   **BeanNameUrlHandlerMapping**：基于 Bean 名称
-   **SimpleUrlHandlerMapping**：基于 URL 模式配置

**工作原理：**

```java
// 基于注解的映射
@Controller
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/list")
    public String list() {
        return "user/list";
    }

    @RequestMapping("/detail/{id}")
    public String detail(@PathVariable Long id, Model model) {
        // 业务逻辑
        return "user/detail";
    }
}
```

### 2.3 HandlerAdapter（处理器适配器）

**作用：**
适配器模式的应用，负责执行具体的处理器，屏蔽不同处理器的差异。

**常用实现：**

-   **RequestMappingHandlerAdapter**：处理 @RequestMapping 注解的方法
-   **HttpRequestHandlerAdapter**：处理 HttpRequestHandler 接口
-   **SimpleControllerHandlerAdapter**：处理 Controller 接口

**适配器工作流程：**

```java
public interface HandlerAdapter {
    boolean supports(Object handler);
    ModelAndView handle(HttpServletRequest request,
                       HttpServletResponse response,
                       Object handler) throws Exception;
}
```

### 2.4 ViewResolver（视图解析器）

**作用：**
根据视图名称解析到具体的视图对象。

**常用实现：**

-   **InternalResourceViewResolver**：JSP 视图解析器
-   **ThymeleafViewResolver**：Thymeleaf 模板引擎
-   **FreeMarkerViewResolver**：FreeMarker 模板引擎
-   **ContentNegotiatingViewResolver**：内容协商视图解析器

**配置示例：**

```xml
<!-- JSP 视图解析器 -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/"/>
    <property name="suffix" value=".jsp"/>
    <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
</bean>
```

### 2.5 Controller（控制器）

**控制器特性：**

-   **单例模式**：默认情况下，Spring MVC 的控制器是单例的
-   **线程安全**：由于单例模式，需要注意线程安全问题
-   **无状态设计**：避免在控制器中定义实例变量

**线程安全解决方案：**

```java
@Controller
public class UserController {

    // ❌ 错误：实例变量在多线程环境下不安全
    // private String userName;

    @Autowired
    private UserService userService; // ✅ 正确：注入的服务通常是线程安全的

    @RequestMapping("/user/{id}")
    public String getUser(@PathVariable Long id, Model model) {
        // ✅ 正确：使用局部变量，每个线程独立
        String userName = userService.getUserName(id);
        model.addAttribute("userName", userName);
        return "user/detail";
    }
}
```

### 2.6 Spring MVC 架构图

```
    ┌─────────────┐
    │   Client    │
    └─────┬───────┘
          │ 1. HTTP Request
          ▼
    ┌─────────────────────┐
    │ DispatcherServlet   │ ◄── Front Controller
    └─────┬───────────────┘
          │ 2. Find Handler
          ▼
    ┌─────────────────────┐
    │  HandlerMapping     │
    └─────┬───────────────┘
          │ 3. Return Handler
          ▼
    ┌─────────────────────┐
    │  HandlerAdapter     │
    └─────┬───────────────┘
          │ 4. Execute Handler
          ▼
    ┌─────────────────────┐
    │    Controller       │
    └─────┬───────────────┘
          │ 5. Return ModelAndView
          ▼
    ┌─────────────────────┐
    │   ViewResolver      │
    └─────┬───────────────┘
          │ 6. Return View
          ▼
    ┌─────────────────────┐
    │      View           │
    └─────┬───────────────┘
          │ 7. Render Response
          ▼
    ┌─────────────┐
    │   Client    │
    └─────────────┘
```

## 3. 请求处理流程

### 3.1 详细执行流程

**Spring MVC 请求处理的完整流程：**

1. **用户发起请求**

    - 客户端（浏览器）发送 HTTP 请求到服务器
    - 请求被 web 服务器接收并转发给 DispatcherServlet

2. **DispatcherServlet 接收请求**

    - 前端控制器 DispatcherServlet 接收所有进入的请求
    - 开始协调各个组件处理请求

3. **查找处理器**

    - DispatcherServlet 调用 HandlerMapping
    - HandlerMapping 根据请求 URL 查找对应的 Handler（Controller）
    - 可以根据 XML 配置、注解等方式进行查找

4. **返回处理器执行链**

    - HandlerMapping 返回 HandlerExecutionChain
    - 包含处理器（Handler）和拦截器（Interceptor）

5. **执行处理器**

    - DispatcherServlet 调用 HandlerAdapter
    - HandlerAdapter 执行具体的 Handler（Controller 方法）
    - 处理业务逻辑，调用 Service 层

6. **返回 ModelAndView**

    - Handler 执行完成后返回 ModelAndView 对象
    - ModelAndView 包含模型数据（Model）和视图名称（View）

7. **视图解析**

    - DispatcherServlet 请求 ViewResolver 进行视图解析
    - ViewResolver 根据视图名称返回具体的 View 对象

8. **视图渲染**

    - DispatcherServlet 根据 View 进行视图渲染
    - 将 ModelAndView 中的模型数据填充到 request 域
    - 生成最终的 HTML 响应

9. **响应用户**
    - DispatcherServlet 将渲染后的视图响应给用户
    - 用户在浏览器中看到最终页面

### 3.2 关键组件交互

```java
// 伪代码展示核心流程
public class DispatcherServlet extends HttpServlet {

    protected void doDispatch(HttpServletRequest request, HttpServletResponse response) {

        // 1. 获取处理器执行链
        HandlerExecutionChain mappedHandler = getHandler(request);

        // 2. 获取处理器适配器
        HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());

        // 3. 执行拦截器的前置方法
        if (!mappedHandler.applyPreHandle(request, response)) {
            return;
        }

        // 4. 执行处理器
        ModelAndView mv = ha.handle(request, response, mappedHandler.getHandler());

        // 5. 执行拦截器的后置方法
        mappedHandler.applyPostHandle(request, response, mv);

        // 6. 处理分发结果（视图渲染）
        processDispatchResult(request, response, mappedHandler, mv);
    }
}
```

### 3.3 启动流程详解

**Web 应用启动时的初始化过程：**

1. **Web 容器启动**

    - Tomcat 等 Web 容器启动
    - 加载 web.xml 配置文件

2. **DispatcherServlet 初始化**

    - 由于配置了`<load-on-startup>1</load-on-startup>`
    - DispatcherServlet 在容器启动时就被初始化

3. **WebApplicationContext 创建**

    - DispatcherServlet 继承自 FrameworkServlet
    - 在 FrameworkServlet 中创建 WebApplicationContext
    - 这是 Spring 的 Web 应用上下文

4. **加载 Spring 配置**

    - 根据 contextConfigLocation 参数加载 Spring 配置文件
    - 初始化 Spring 容器中的所有 Bean

5. **初始化 Spring MVC 组件**
    - 初始化 HandlerMapping
    - 初始化 HandlerAdapter
    - 初始化 ViewResolver
    - 初始化其他必要组件

**启动配置示例：**

```xml
<!-- web.xml -->
<servlet>
    <servlet-name>springmvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring-mvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
```

```xml
<!-- spring-mvc.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context">

    <!-- 启用注解驱动 -->
    <mvc:annotation-driven/>

    <!-- 组件扫描 -->
    <context:component-scan base-package="com.example.controller"/>

    <!-- 视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

</beans>
```

## 4. 注解与控制器

### 4.1 核心注解详解

#### @Controller 注解

**作用：**

-   标识一个类为 Spring MVC 的控制器组件
-   表示该类属于表现层（Presentation Layer）
-   使类能够被 Spring 容器管理并处理 HTTP 请求

**特点：**

-   专用于表现层，无其他注解可以替代
-   结合@RequestMapping 使用处理请求映射
-   默认返回值会被视图解析器处理

```java
@Controller
public class UserController {
    // 控制器方法
}
```

#### @RequestMapping 注解

**功能特性：**

-   处理请求地址映射的核心注解
-   可以用于类级别和方法级别
-   支持多种 HTTP 方法和请求参数

**类级别使用：**

```java
@Controller
@RequestMapping("/user")  // 类级别：所有方法的父路径
public class UserController {

    @RequestMapping("/list")  // 实际路径：/user/list
    public String list() {
        return "user/list";
    }

    @RequestMapping("/detail")  // 实际路径：/user/detail
    public String detail() {
        return "user/detail";
    }
}
```

**HTTP 方法限制：**

```java
@Controller
@RequestMapping("/api/user")
public class UserApiController {

    // 只处理GET请求
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String getUsers() {
        return "user/list";
    }

    // 只处理POST请求
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createUser() {
        return "user/create";
    }

    // 处理多种HTTP方法
    @RequestMapping(value = "/update", method = {RequestMethod.PUT, RequestMethod.POST})
    public String updateUser() {
        return "user/update";
    }
}
```

**现代化注解（Spring 4.3+）：**

```java
@Controller
@RequestMapping("/user")
public class ModernUserController {

    @GetMapping("/list")     // 等价于 @RequestMapping(method = GET)
    public String list() { return "user/list"; }

    @PostMapping("/create")  // 等价于 @RequestMapping(method = POST)
    public String create() { return "user/create"; }

    @PutMapping("/update")   // 等价于 @RequestMapping(method = PUT)
    public String update() { return "user/update"; }

    @DeleteMapping("/{id}")  // 等价于 @RequestMapping(method = DELETE)
    public String delete(@PathVariable Long id) { return "user/delete"; }
}
```

### 4.2 参数绑定

#### 基本参数绑定

**简单参数：**

```java
@Controller
public class ParamController {

    // URL: /search?name=john&age=25
    @RequestMapping("/search")
    public String search(String name, Integer age, Model model) {
        // 参数名必须与请求参数名一致
        model.addAttribute("name", name);
        model.addAttribute("age", age);
        return "search/result";
    }
}
```

**@RequestParam 注解：**

```java
@Controller
public class RequestParamController {

    @RequestMapping("/search")
    public String search(
        @RequestParam("userName") String name,        // 指定参数名
        @RequestParam(value = "userAge", defaultValue = "18") Integer age,  // 默认值
        @RequestParam(required = false) String email, // 可选参数
        Model model) {

        model.addAttribute("name", name);
        model.addAttribute("age", age);
        model.addAttribute("email", email);
        return "search/result";
    }
}
```

#### 对象参数绑定

**POJO 对象绑定：**

```java
// 用户实体类
public class User {
    private String name;
    private Integer age;
    private String email;

    // getters and setters
}

@Controller
public class UserController {

    // Spring MVC 自动将请求参数绑定到User对象
    @PostMapping("/user/create")
    public String createUser(User user, Model model) {
        // 自动绑定：name=john&age=25&email=john@example.com
        model.addAttribute("user", user);
        return "user/success";
    }
}
```

#### 路径变量绑定

**@PathVariable 注解：**

```java
@Controller
@RequestMapping("/user")
public class UserController {

    // URL: /user/123
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id, Model model) {
        model.addAttribute("userId", id);
        return "user/detail";
    }

    // URL: /user/john/orders/456
    @GetMapping("/{username}/orders/{orderId}")
    public String getUserOrder(
        @PathVariable String username,
        @PathVariable Long orderId,
        Model model) {

        model.addAttribute("username", username);
        model.addAttribute("orderId", orderId);
        return "user/order";
    }
}
```

#### 请求头和 Cookie 绑定

```java
@Controller
public class HeaderController {

    @RequestMapping("/info")
    public String getInfo(
        @RequestHeader("User-Agent") String userAgent,
        @RequestHeader(value = "Accept-Language", defaultValue = "en") String language,
        @CookieValue(value = "JSESSIONID", required = false) String sessionId,
        Model model) {

        model.addAttribute("userAgent", userAgent);
        model.addAttribute("language", language);
        model.addAttribute("sessionId", sessionId);
        return "info";
    }
}
```

### 4.3 获取 Request 和 Session 对象

**直接注入方式：**

```java
@Controller
public class ServletController {

    @RequestMapping("/servlet")
    public String handleServlet(
        HttpServletRequest request,
        HttpServletResponse response,
        HttpSession session,
        Model model) {

        // 直接使用Servlet API
        String userAgent = request.getHeader("User-Agent");
        session.setAttribute("visitTime", new Date());

        model.addAttribute("userAgent", userAgent);
        return "servlet/info";
    }
}
```

**使用工具类方式：**

```java
@Controller
public class UtilController {

    @RequestMapping("/util")
    public String handleUtil(Model model) {
        // 通过Spring提供的工具类获取
        HttpServletRequest request =
            ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest();

        HttpSession session = request.getSession();

        model.addAttribute("sessionId", session.getId());
        return "util/info";
    }
}
```

## 5. 数据传输与视图处理

### 5.1 控制器返回值类型

**Spring MVC 控制器方法支持多种返回值类型：**

#### String（推荐）

**逻辑视图名：**

```java
@Controller
public class ViewController {

    @RequestMapping("/user/list")
    public String list(Model model) {
        // 返回逻辑视图名，由ViewResolver解析
        model.addAttribute("users", userService.findAll());
        return "user/list";  // 解析为 /WEB-INF/views/user/list.jsp
    }
}
```

**转发和重定向：**

```java
@Controller
public class RedirectController {

    @RequestMapping("/user/save")
    public String saveUser(User user) {
        userService.save(user);

        // 重定向到列表页面（防止重复提交）
        return "redirect:/user/list";
    }

    @RequestMapping("/user/forward")
    public String forwardUser() {
        // 转发到另一个请求处理方法
        return "forward:/user/list";
    }

    @RequestMapping("/external")
    public String redirectExternal() {
        // 重定向到外部URL
        return "redirect:https://www.example.com";
    }
}
```

#### ModelAndView

**视图和数据统一管理：**

```java
@Controller
public class ModelAndViewController {

    @RequestMapping("/user/detail")
    public ModelAndView detail(@RequestParam Long id) {
        ModelAndView mav = new ModelAndView();

        // 设置视图名
        mav.setViewName("user/detail");

        // 添加模型数据
        User user = userService.findById(id);
        mav.addObject("user", user);
        mav.addObject("currentTime", new Date());

        return mav;
    }

    @RequestMapping("/user/create")
    public ModelAndView create() {
        // 简化构造方式
        ModelAndView mav = new ModelAndView("user/form");
        mav.addObject("user", new User());
        return mav;
    }
}
```

#### ResponseEntity

**RESTful API 响应：**

```java
@Controller
public class ApiController {

    @RequestMapping("/api/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @RequestMapping("/api/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.findAll();

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(users.size()));

        return ResponseEntity.ok()
                .headers(headers)
                .body(users);
    }
}
```

#### void

**直接操作 Response：**

```java
@Controller
public class VoidController {

    @RequestMapping("/download")
    public void download(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=file.txt");

        try (OutputStream out = response.getOutputStream()) {
            out.write("Hello World".getBytes());
        }
    }
}
```

### 5.2 数据传递机制

#### Model 接口

**Model 是 Spring MVC 推荐的数据传递方式：**

```java
@Controller
public class ModelController {

    @RequestMapping("/user/list")
    public String list(Model model) {
        // 添加单个属性
        model.addAttribute("title", "用户列表");

        // 添加对象（属性名为类名首字母小写）
        List<User> users = userService.findAll();
        model.addAttribute(users);  // 属性名为 "userList"

        // 指定属性名
        model.addAttribute("allUsers", users);

        return "user/list";
    }
}
```

#### ModelMap 类

**ModelMap 继承了 LinkedHashMap：**

```java
@Controller
public class ModelMapController {

    @RequestMapping("/user/detail")
    public String detail(@RequestParam Long id, ModelMap modelMap) {
        User user = userService.findById(id);

        // 使用put方法添加数据
        modelMap.put("user", user);
        modelMap.put("timestamp", System.currentTimeMillis());

        // 也可以使用addAttribute方法
        modelMap.addAttribute("viewCount", 100);

        return "user/detail";
    }
}
```

#### @ModelAttribute 注解

**预处理模型数据：**

```java
@Controller
@RequestMapping("/user")
public class UserController {

    // 每个请求都会执行此方法，用于添加公共数据
    @ModelAttribute
    public void commonData(Model model) {
        model.addAttribute("currentTime", new Date());
        model.addAttribute("serverName", "UserServer");
    }

    // 方法级别的@ModelAttribute
    @ModelAttribute("user")
    public User getUser(@RequestParam(required = false) Long id) {
        if (id != null) {
            return userService.findById(id);
        }
        return new User();
    }

    @RequestMapping("/edit")
    public String edit(@ModelAttribute("user") User user, Model model) {
        // user对象已经通过@ModelAttribute预填充
        model.addAttribute("action", "edit");
        return "user/form";
    }
}
```

### 5.3 Session 数据管理

#### @SessionAttributes 注解

**将模型数据存储到 Session 中：**

```java
@Controller
@RequestMapping("/user")
@SessionAttributes({"user", "editMode"})  // 指定要存入session的属性
public class SessionController {

    @RequestMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        User user = userService.findById(id);

        // 这些数据会自动存入Session
        model.addAttribute("user", user);
        model.addAttribute("editMode", true);

        return "user/edit";
    }

    @RequestMapping("/update")
    public String update(@ModelAttribute("user") User user,
                        SessionStatus sessionStatus) {
        userService.update(user);

        // 清除Session中的数据
        sessionStatus.setComplete();

        return "redirect:/user/list";
    }
}
```

#### 手动 Session 操作

```java
@Controller
public class ManualSessionController {

    @RequestMapping("/login")
    public String login(String username, String password,
                       HttpSession session, Model model) {

        if (userService.authenticate(username, password)) {
            User user = userService.findByUsername(username);

            // 手动将用户信息存入Session
            session.setAttribute("currentUser", user);
            session.setAttribute("loginTime", new Date());

            return "redirect:/dashboard";
        } else {
            model.addAttribute("error", "用户名或密码错误");
            return "login";
        }
    }

    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        // 清除Session
        session.invalidate();
        return "redirect:/login";
    }
}
```

### 5.4 视图解析器配置

#### JSP 视图解析器

```xml
<!-- spring-mvc.xml -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/"/>
    <property name="suffix" value=".jsp"/>
    <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
    <property name="order" value="1"/>
</bean>
```

#### 多视图解析器

```xml
<!-- Thymeleaf视图解析器 -->
<bean class="org.thymeleaf.spring5.view.ThymeleafViewResolver">
    <property name="templateEngine" ref="templateEngine"/>
    <property name="characterEncoding" value="UTF-8"/>
    <property name="order" value="1"/>
</bean>

<!-- JSP视图解析器 -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/"/>
    <property name="suffix" value=".jsp"/>
    <property name="order" value="2"/>
</bean>
```

#### JSON 视图解析器

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        // 配置JSON视图解析器
        registry.enableContentNegotiation(new MappingJackson2JsonView());

        // 配置JSP视图解析器
        registry.jsp("/WEB-INF/views/", ".jsp");
    }
}
```

## 6. AJAX 与 RESTful 支持

### 6.1 AJAX 集成

#### JSON 数据交互

**基本配置：**

```xml
<!-- spring-mvc.xml -->
<mvc:annotation-driven>
    <mvc:message-converters>
        <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
            <property name="objectMapper">
                <bean class="com.fasterxml.jackson.databind.ObjectMapper">
                    <property name="dateFormat">
                        <bean class="java.text.SimpleDateFormat">
                            <constructor-arg value="yyyy-MM-dd HH:mm:ss"/>
                        </bean>
                    </property>
                </bean>
            </property>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```

**Maven 依赖：**

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.0</version>
</dependency>
```

#### @ResponseBody 注解

**返回 JSON 数据：**

```java
@Controller
@RequestMapping("/api")
public class AjaxController {

    @Autowired
    private UserService userService;

    // 返回单个对象
    @RequestMapping("/user/{id}")
    @ResponseBody
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    // 返回对象列表
    @RequestMapping("/users")
    @ResponseBody
    public List<User> getUsers() {
        return userService.findAll();
    }

    // 返回Map对象
    @RequestMapping("/user/count")
    @ResponseBody
    public Map<String, Object> getUserCount() {
        Map<String, Object> result = new HashMap<>();
        result.put("total", userService.count());
        result.put("active", userService.countActive());
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
}
```

#### @RestController 注解

**简化 RESTful 控制器：**

```java
// @RestController = @Controller + @ResponseBody
@RestController
@RequestMapping("/api/v1")
public class UserRestController {

    @Autowired
    private UserService userService;

    // 自动转换为JSON，无需@ResponseBody
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userService.update(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
```

#### @RequestBody 注解

**接收 JSON 数据：**

```java
@RestController
@RequestMapping("/api")
public class DataController {

    // 接收JSON格式的请求体
    @PostMapping("/user")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        // user对象自动从JSON转换而来
        userService.save(user);
        return ResponseEntity.ok("用户创建成功");
    }

    // 接收复杂对象
    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // 接收List数据
    @PostMapping("/users/batch")
    public ResponseEntity<String> createUsers(@RequestBody List<User> users) {
        userService.saveAll(users);
        return ResponseEntity.ok("批量创建成功");
    }
}
```

### 6.2 前端 AJAX 调用示例

#### jQuery AJAX

```javascript
// GET请求
$.ajax({
    url: "/api/users",
    type: "GET",
    dataType: "json",
    success: function (data) {
        console.log("用户列表:", data);
        // 处理返回的用户列表
    },
    error: function (xhr, status, error) {
        console.error("请求失败:", error);
    },
});

// POST请求
var newUser = {
    name: "John Doe",
    email: "john@example.com",
    age: 25,
};

$.ajax({
    url: "/api/users",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(newUser),
    success: function (data) {
        console.log("用户创建成功:", data);
    },
});
```

#### 原生 JavaScript Fetch

```javascript
// GET请求
fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
        console.log("用户列表:", data);
    })
    .catch((error) => {
        console.error("请求失败:", error);
    });

// POST请求
const newUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    age: 28,
};

fetch("/api/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
})
    .then((response) => response.json())
    .then((data) => {
        console.log("用户创建成功:", data);
    });
```

### 6.3 异常处理

#### 统一异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse();
        error.setCode("USER_NOT_FOUND");
        error.setMessage(ex.getMessage());
        error.setTimestamp(System.currentTimeMillis());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = new ErrorResponse();
        error.setCode("VALIDATION_ERROR");
        error.setMessage(ex.getMessage());
        error.setTimestamp(System.currentTimeMillis());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse();
        error.setCode("INTERNAL_ERROR");
        error.setMessage("系统内部错误");
        error.setTimestamp(System.currentTimeMillis());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

// 错误响应对象
public class ErrorResponse {
    private String code;
    private String message;
    private long timestamp;

    // getters and setters
}
```

### 6.4 内容协商

#### Accept 头处理

```java
@RestController
@RequestMapping("/api/users")
public class ContentNegotiationController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id,
                                       HttpServletRequest request) {
        User user = userService.findById(id);

        String accept = request.getHeader("Accept");

        if ("application/xml".equals(accept)) {
            // 返回XML格式
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_XML)
                    .body(user);
        } else {
            // 默认返回JSON格式
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(user);
        }
    }

    // 使用produces指定响应格式
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User getUserJson(@PathVariable Long id) {
        return userService.findById(id);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_XML_VALUE)
    public User getUserXml(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

## 7. 拦截器与过滤器

### 7.1 拦截器概述

**HandlerInterceptor 接口：**
Spring MVC 拦截器基于 HandlerInterceptor 接口，提供了在请求处理的不同阶段进行拦截的能力。

**拦截器执行时机：**

1. **preHandle**：控制器方法执行前
2. **postHandle**：控制器方法执行后，视图渲染前
3. **afterCompletion**：视图渲染完成后

### 7.2 拦截器实现方式

#### 方式一：实现 HandlerInterceptor 接口

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler) throws Exception {

        System.out.println("=== AuthInterceptor.preHandle ===");

        // 检查用户是否登录
        HttpSession session = request.getSession();
        Object user = session.getAttribute("currentUser");

        if (user == null) {
            // 未登录，重定向到登录页
            response.sendRedirect("/login");
            return false; // 阻止请求继续执行
        }

        // 已登录，允许请求继续
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request,
                          HttpServletResponse response,
                          Object handler,
                          ModelAndView modelAndView) throws Exception {

        System.out.println("=== AuthInterceptor.postHandle ===");

        // 可以修改ModelAndView
        if (modelAndView != null) {
            modelAndView.addObject("interceptorMessage", "请求处理完成");
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                               HttpServletResponse response,
                               Object handler,
                               Exception ex) throws Exception {

        System.out.println("=== AuthInterceptor.afterCompletion ===");

        // 清理资源、记录日志等
        if (ex != null) {
            System.err.println("请求处理出现异常: " + ex.getMessage());
        }
    }
}
```

#### 方式二：继承 HandlerInterceptorAdapter

```java
@Component
public class LoggingInterceptor extends HandlerInterceptorAdapter {

    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler) throws Exception {

        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        String userAgent = request.getHeader("User-Agent");

        logger.info("=== 请求开始 ===");
        logger.info("请求URI: {}", requestURI);
        logger.info("请求方法: {}", method);
        logger.info("用户代理: {}", userAgent);

        // 记录开始时间
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                               HttpServletResponse response,
                               Object handler,
                               Exception ex) throws Exception {

        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;

        logger.info("=== 请求结束 ===");
        logger.info("执行时间: {} ms", executionTime);
        logger.info("响应状态: {}", response.getStatus());
    }
}
```

### 7.3 拦截器配置

#### XML 配置方式

```xml
<!-- spring-mvc.xml -->
<mvc:interceptors>

    <!-- 全局拦截器：拦截所有请求 -->
    <bean class="com.example.interceptor.LoggingInterceptor"/>

    <!-- 指定路径拦截器 -->
    <mvc:interceptor>
        <mvc:mapping path="/admin/**"/>
        <mvc:exclude-mapping path="/admin/login"/>
        <bean class="com.example.interceptor.AuthInterceptor"/>
    </mvc:interceptor>

    <!-- 多路径配置 -->
    <mvc:interceptor>
        <mvc:mapping path="/user/**"/>
        <mvc:mapping path="/order/**"/>
        <mvc:exclude-mapping path="/user/login"/>
        <mvc:exclude-mapping path="/user/register"/>
        <bean class="com.example.interceptor.SessionInterceptor"/>
    </mvc:interceptor>

</mvc:interceptors>
```

#### Java 配置方式

```java
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private AuthInterceptor authInterceptor;

    @Autowired
    private LoggingInterceptor loggingInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // 添加日志拦截器，拦截所有请求
        registry.addInterceptor(loggingInterceptor)
                .addPathPatterns("/**");

        // 添加认证拦截器
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/admin/**", "/user/**")
                .excludePathPatterns("/user/login", "/user/register", "/admin/login")
                .order(1); // 设置执行顺序

        // 添加其他拦截器
        registry.addInterceptor(new SessionTimeoutInterceptor())
                .addPathPatterns("/secure/**")
                .order(2);
    }
}
```

### 7.4 多拦截器执行顺序

**执行流程图：**

```
Request → preHandle1 → preHandle2 → Controller → postHandle2 → postHandle1 → View → afterCompletion2 → afterCompletion1 → Response
```

**示例代码：**

```java
// 拦截器1
public class FirstInterceptor implements HandlerInterceptor {
    public boolean preHandle(...) {
        System.out.println("FirstInterceptor.preHandle");
        return true;
    }

    public void postHandle(...) {
        System.out.println("FirstInterceptor.postHandle");
    }

    public void afterCompletion(...) {
        System.out.println("FirstInterceptor.afterCompletion");
    }
}

// 拦截器2
public class SecondInterceptor implements HandlerInterceptor {
    public boolean preHandle(...) {
        System.out.println("SecondInterceptor.preHandle");
        return true;
    }

    public void postHandle(...) {
        System.out.println("SecondInterceptor.postHandle");
    }

    public void afterCompletion(...) {
        System.out.println("SecondInterceptor.afterCompletion");
    }
}

// 输出结果：
// FirstInterceptor.preHandle
// SecondInterceptor.preHandle
// Controller method execution
// SecondInterceptor.postHandle
// FirstInterceptor.postHandle
// View rendering
// SecondInterceptor.afterCompletion
// FirstInterceptor.afterCompletion
```

### 7.5 拦截器应用场景

#### 权限控制拦截器

```java
@Component
public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    private PermissionService permissionService;

    @Override
    public boolean preHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler) throws Exception {

        // 检查是否为Controller方法
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;

        // 检查方法上的权限注解
        RequirePermission permission = handlerMethod.getMethodAnnotation(RequirePermission.class);
        if (permission == null) {
            // 检查类上的权限注解
            permission = handlerMethod.getBeanType().getAnnotation(RequirePermission.class);
        }

        if (permission != null) {
            // 获取当前用户
            User currentUser = getCurrentUser(request);

            // 检查权限
            if (!permissionService.hasPermission(currentUser, permission.value())) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().write("Access Denied");
                return false;
            }
        }

        return true;
    }

    private User getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null ? (User) session.getAttribute("currentUser") : null;
    }
}

// 权限注解
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    String value();
}

// 使用示例
@Controller
@RequirePermission("USER_MANAGEMENT")
public class UserController {

    @RequirePermission("USER_CREATE")
    @PostMapping("/users")
    public String createUser(@ModelAttribute User user) {
        // 创建用户逻辑
        return "redirect:/users";
    }
}
```

#### 请求限流拦截器

```java
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, List<Long>> requestTimes = new ConcurrentHashMap<>();
    private final int maxRequests = 100; // 每分钟最大请求数
    private final long timeWindow = 60 * 1000; // 时间窗口：1分钟

    @Override
    public boolean preHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler) throws Exception {

        String clientIP = getClientIP(request);
        long currentTime = System.currentTimeMillis();

        // 获取该IP的请求时间列表
        List<Long> times = requestTimes.computeIfAbsent(clientIP, k -> new ArrayList<>());

        synchronized (times) {
            // 清理过期的请求记录
            times.removeIf(time -> currentTime - time > timeWindow);

            // 检查是否超过限制
            if (times.size() >= maxRequests) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Rate limit exceeded");
                return false;
            }

            // 记录当前请求时间
            times.add(currentTime);
        }

        return true;
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
```

### 7.6 拦截器 vs 过滤器

| 特性                 | 拦截器（Interceptor）    | 过滤器（Filter）       |
| -------------------- | ------------------------ | ---------------------- |
| **实现基础**         | 基于 Spring AOP          | 基于 Servlet 规范      |
| **执行时机**         | DispatcherServlet 内部   | DispatcherServlet 外部 |
| **配置方式**         | Spring 配置              | web.xml 或@WebFilter   |
| **访问 Spring 容器** | 可以                     | 需要特殊处理           |
| **粒度**             | 可精确到 HandlerMethod   | 只能到 Servlet 级别    |
| **执行顺序**         | 支持多个执行点           | 请求前后               |
| **异常处理**         | 可以访问 Spring 异常处理 | 原始异常处理           |

## 8. 数据验证与格式化

### 8.1 JSR-303 Bean Validation

#### 基本验证注解

**Maven 依赖：**

```xml
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.2.0.Final</version>
</dependency>
```

**实体类验证：**

```java
public class User {

    @NotNull(message = "用户ID不能为空")
    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20之间")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    private String password;

    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    private String email;

    @Min(value = 18, message = "年龄不能小于18岁")
    @Max(value = 120, message = "年龄不能大于120岁")
    private Integer age;

    @Pattern(regexp = "^1[3-9]\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Future(message = "生日必须是未来日期")
    private Date birthday;

    // getters and setters
}
```

#### 控制器验证

```java
@Controller
@RequestMapping("/user")
public class UserValidationController {

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute User user,
                          BindingResult bindingResult,
                          Model model) {

        // 检查验证结果
        if (bindingResult.hasErrors()) {
            // 验证失败，返回表单页面显示错误信息
            model.addAttribute("user", user);
            return "user/register";
        }

        // 验证成功，处理业务逻辑
        userService.register(user);
        return "redirect:/user/login";
    }

    @PostMapping("/api/register")
    @ResponseBody
    public ResponseEntity<?> registerApi(@Valid @RequestBody User user,
                                        BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            // 返回验证错误信息
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }
}
```

#### 分组验证

```java
// 验证分组接口
public interface CreateGroup {}
public interface UpdateGroup {}

// 实体类分组验证
public class User {

    @NotNull(groups = UpdateGroup.class, message = "更新时ID不能为空")
    private Long id;

    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class}, message = "用户名不能为空")
    private String username;

    @NotBlank(groups = CreateGroup.class, message = "创建时密码不能为空")
    private String password;

    // getters and setters
}

// 控制器分组验证
@Controller
@RequestMapping("/user")
public class UserGroupValidationController {

    @PostMapping("/create")
    public String create(@Validated(CreateGroup.class) @ModelAttribute User user,
                        BindingResult bindingResult) {
        // 只验证CreateGroup分组的字段
        if (bindingResult.hasErrors()) {
            return "user/form";
        }
        userService.create(user);
        return "redirect:/user/list";
    }

    @PutMapping("/update")
    public String update(@Validated(UpdateGroup.class) @ModelAttribute User user,
                        BindingResult bindingResult) {
        // 只验证UpdateGroup分组的字段
        if (bindingResult.hasErrors()) {
            return "user/form";
        }
        userService.update(user);
        return "redirect:/user/list";
    }
}
```

#### 自定义验证器

```java
// 自定义验证注解
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueUsernameValidator.class)
public @interface UniqueUsername {
    String message() default "用户名已存在";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// 验证器实现
@Component
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    @Autowired
    private UserService userService;

    @Override
    public void initialize(UniqueUsername constraintAnnotation) {
        // 初始化方法
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        if (username == null || username.trim().isEmpty()) {
            return true; // 空值由@NotBlank处理
        }

        // 检查用户名是否已存在
        return !userService.existsByUsername(username);
    }
}

// 使用自定义验证器
public class User {

    @NotBlank(message = "用户名不能为空")
    @UniqueUsername(message = "用户名已存在")
    private String username;

    // 其他字段
}
```

### 8.2 数据格式化

#### 日期格式化

```java
public class User {

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate localDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime localDateTime;

    // getters and setters
}
```

#### 数字格式化

```java
public class Product {

    @NumberFormat(pattern = "#,###.##")
    private BigDecimal price;

    @NumberFormat(style = NumberFormat.Style.CURRENCY)
    private BigDecimal amount;

    @NumberFormat(style = NumberFormat.Style.PERCENT)
    private Double discount;

    // getters and setters
}
```

#### 自定义格式化器

```java
// 自定义电话号码格式化器
@Component
public class PhoneNumberFormatter implements Formatter<String> {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^(\d{3})(\d{4})(\d{4})$");

    @Override
    public String parse(String text, Locale locale) throws ParseException {
        // 解析：将格式化的电话号码转换为原始字符串
        if (text == null || text.trim().isEmpty()) {
            return null;
        }
        return text.replaceAll("[^\d]", "");
    }

    @Override
    public String print(String phoneNumber, Locale locale) {
        // 格式化：将原始电话号码格式化为显示格式
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return "";
        }

        Matcher matcher = PHONE_PATTERN.matcher(phoneNumber);
        if (matcher.matches()) {
            return String.format("%s-%s-%s",
                matcher.group(1),
                matcher.group(2),
                matcher.group(3));
        }
        return phoneNumber;
    }
}

// 注册自定义格式化器
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private PhoneNumberFormatter phoneNumberFormatter;

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(phoneNumberFormatter);
    }
}
```

### 8.3 文件上传

#### 单文件上传

**配置文件上传解析器：**

```xml
<!-- spring-mvc.xml -->
<bean id="multipartResolver"
      class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <!-- 设置文件编码 -->
    <property name="defaultEncoding" value="UTF-8"/>
    <!-- 设置最大文件大小：10MB -->
    <property name="maxUploadSize" value="10485760"/>
    <!-- 设置最大内存大小：1MB -->
    <property name="maxInMemorySize" value="1048576"/>
</bean>
```

**Maven 依赖：**

```xml
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.4</version>
</dependency>
```

**控制器处理：**

```java
@Controller
@RequestMapping("/file")
public class FileUploadController {

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,
                           Model model) {

        if (file.isEmpty()) {
            model.addAttribute("message", "请选择要上传的文件");
            return "file/upload";
        }

        try {
            // 获取文件信息
            String originalFilename = file.getOriginalFilename();
            String contentType = file.getContentType();
            long size = file.getSize();

            // 生成唯一文件名
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;

            // 设置上传路径
            String uploadPath = "/Users/uploads/";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 保存文件
            File destFile = new File(uploadDir, fileName);
            file.transferTo(destFile);

            model.addAttribute("message", "文件上传成功");
            model.addAttribute("fileName", fileName);
            model.addAttribute("originalName", originalFilename);
            model.addAttribute("size", size);

        } catch (IOException e) {
            model.addAttribute("message", "文件上传失败：" + e.getMessage());
        }

        return "file/result";
    }
}
```

#### 多文件上传

```java
@Controller
@RequestMapping("/file")
public class MultiFileUploadController {

    @PostMapping("/upload/multiple")
    public String uploadMultipleFiles(@RequestParam("files") MultipartFile[] files,
                                    Model model) {

        List<String> uploadedFiles = new ArrayList<>();
        List<String> errorMessages = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                try {
                    String fileName = saveFile(file);
                    uploadedFiles.add(fileName);
                } catch (IOException e) {
                    errorMessages.add("文件 " + file.getOriginalFilename() + " 上传失败：" + e.getMessage());
                }
            }
        }

        model.addAttribute("uploadedFiles", uploadedFiles);
        model.addAttribute("errorMessages", errorMessages);

        return "file/multiple-result";
    }

    private String saveFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + extension;

        String uploadPath = "/Users/uploads/";
        File destFile = new File(uploadPath, fileName);
        file.transferTo(destFile);

        return fileName;
    }
}
```

#### RESTful API 文件上传

```java
@RestController
@RequestMapping("/api/file")
public class FileUploadApiController {

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {

        // 验证文件
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "文件不能为空"));
        }

        // 验证文件类型
        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "只支持图片文件"));
        }

        // 验证文件大小
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "文件大小不能超过5MB"));
        }

        try {
            String fileName = saveFile(file);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileName", fileName);
            response.put("originalName", file.getOriginalFilename());
            response.put("size", file.getSize());
            response.put("url", "/uploads/" + fileName);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "文件保存失败"));
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif") ||
                contentType.equals("image/webp")
        );
    }

    private String saveFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + extension;

        String uploadPath = "/Users/uploads/";
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        File destFile = new File(uploadDir, fileName);
        file.transferTo(destFile);

        return fileName;
    }
}
```

#### Spring Boot 文件上传配置

```properties
# application.properties

# 文件上传配置
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
spring.servlet.multipart.file-size-threshold=2KB

# 静态资源配置
spring.web.resources.static-locations=file:/Users/uploads/
```

## 9. 最佳实践与总结

### 9.1 开发最佳实践

#### Controller 设计原则

1. **单一职责原则**

```java
// 好的做法：专注于用户管理
@RestController
@RequestMapping("/api/users")
public class UserController {
    // 只处理用户相关操作
}

// 不好的做法：混合多种业务
@RestController
@RequestMapping("/api")
public class MixedController {
    // 处理用户、订单、产品等多种业务
}
```

2. **使用 DTO 传输对象**

```java
// 用户DTO
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    // 不包含敏感信息如密码
}

// 创建用户请求DTO
public class CreateUserRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @Email
    private String email;
}
```

3. **统一响应格式**

```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String errorCode;
    private long timestamp;

    // 构造方法和getters/setters
}

@RestController
public class UserController {

    @GetMapping("/users/{id}")
    public ApiResponse<UserDTO> getUser(@PathVariable Long id) {
        try {
            UserDTO user = userService.findById(id);
            return ApiResponse.success("获取成功", user);
        } catch (UserNotFoundException e) {
            return ApiResponse.error("USER_NOT_FOUND", "用户不存在");
        }
    }
}
```

#### 异常处理最佳实践

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest()
                .body(ApiResponse.error("VALIDATION_ERROR", "参数验证失败", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGenericException(Exception ex) {
        logger.error("未处理的异常", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("INTERNAL_ERROR", "系统内部错误"));
    }
}
```

### 9.2 性能优化建议

#### 视图解析优化

```java
@Configuration
public class ViewResolverConfig {

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        resolver.setViewClass(JstlView.class);

        // 启用缓存
        resolver.setCache(true);
        resolver.setCacheLimit(1000);

        return resolver;
    }
}
```

#### 静态资源优化

```java
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("/static/")
                .setCachePeriod(3600) // 缓存1小时
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }
}
```

### 9.3 常见问题与解决方案

#### 中文乱码问题

```xml
<!-- web.xml 配置字符编码过滤器 -->
<filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

#### 跨域问题解决

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 9.4 Spring MVC 优势总结

1. **清晰的架构分层**：模型、视图、控制器职责分明
2. **灵活的配置方式**：支持 XML 和注解配置
3. **强大的数据绑定**：自动将请求参数绑定到对象
4. **丰富的视图技术支持**：JSP、Thymeleaf、FreeMarker 等
5. **完善的异常处理机制**：统一异常处理和错误页面
6. **RESTful 支持**：原生支持 RESTful API 开发
7. **拦截器机制**：AOP 风格的横切关注点处理
8. **数据验证支持**：集成 JSR-303 验证框架
9. **国际化支持**：内置国际化和本地化功能
10. **测试友好**：良好的单元测试和集成测试支持

Spring MVC 作为 Spring 生态系统的重要组成部分，为 Java Web 开发提供了完整、灵活、强大的解决方案，是企业级 Web 应用开发的首选框架。
