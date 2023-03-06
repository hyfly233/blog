# Spring MVC

Spring MVC是一个Java框架，用于构建Web应用程序。它遵循Model-View-Controller设计模式。它实现了核心Spring框架的所有基本功能，例如控制反转，依赖注入。

Spring MVC通过 **DispatcherServlet** 提供了一种优雅的解决方案，可以在Spring框架中使用MVC。



## Spring Web Model-View-Controller

![Spring MVC教程](https://www.cainiaojc.com/static/upload/210424/0820590.png)

**Model**-模型包含应用程序的数据。数据可以是单个对象或对象的集合。

**Controller**-控制器包含应用程序的业务逻辑。在这里，@ Controller批注用于将类标记为控制器。

**View**-视图以特定格式表示所提供的信息。通常，JSP + JSTL用于创建视图页面。尽管spring还支持其他视图技术，例如Apache Velocity，Thymeleaf和FreeMarker。

**Front Controller**-在Spring Web MVC中，DispatcherServlet类用作前端控制器。它负责管理Spring MVC应用程序的流程。



# Spring MVC验证

Spring MVC验证用于限制用户提供的输入。为了验证用户的输入，Spring 4或更高版本支持并使用Bean验证API。它可以同时验证服务器端和客户端应用程序。

## Bean验证API

Bean验证API是一种Java规范，可用于应用通过注释对对象模型的约束。在这里，我们可以验证长度，数字，正则表达式等。除此之外，我们还可以提供自定义验证。

由于Bean验证API只是一个规范，因此需要实现。因此，为此，它使用了Hibernate Validator。 Hibernate Validator是完全兼容的JSR-303/309实现，允许表达和验证应用程序约束。

## 验证注释

让我们看看一些常用的验证注释。

| 注释     | 说明                               |
| -------- | ---------------------------------- |
| @NotNull | 它确定该值不能为空。               |
| @Min     | 确定该数字必须等于或大于指定的值。 |
| @Max     | 确定该数字必须等于或小于指定的值。 |
| @Size    | 确定大小必须等于指定的值。         |
| @Pattern | 它确定序列遵循指定的正则表达式。   |





# 执行流程

![1](https://img.javatt.com/e8/e824676190c76edc5038f1c29d97539d.png)

1.  用户向服务器发送请求，请求被Spring 前端控制Servelt DispatcherServlet捕获； 
2.  DispatcherServlet对请求URL进行解析，得到请求资源标识符（URI）。然后根据该URI，调用HandlerMapping获得该Handler配置的所有相关的对象（包括Handler对象以及Handler对象对应的拦截器），最后以HandlerExecutionChain对象的形式返回； 
3.  DispatcherServlet 根据获得的Handler，选择一个合适的HandlerAdapter。（附注：如果成功获得HandlerAdapter后，此时将开始执行拦截器的preHandler(…)方法） 
4.  提取Request中的模型数据，填充Handler入参，开始执行Handler（Controller)。 在填充Handler的入参过程中，根据你的配置，Spring将帮你做一些额外的工作： HttpMessageConveter： 将请求消息（如Json、xml等数据）转换成一个对象，将对象转换为指定的响应信息； 数据转换：对请求消息进行数据转换。如String转换成Integer、Double等； 数据根式化：对请求消息进行数据格式化。 如将字符串转换成格式化数字或格式化日期等； 数据验证： 验证数据的有效性（长度、格式等），验证结果存储到BindingResult或Error中； 
5.  Handler执行完成后，向DispatcherServlet 返回一个ModelAndView对象； 
6.  根据返回的ModelAndView，选择一个适合的ViewResolver（必须是已经注册到Spring容器中的ViewResolver)返回给DispatcherServlet ； 
7.  ViewResolver 结合Model和View，来渲染视图； 
8.  将渲染结果返回给客户端。