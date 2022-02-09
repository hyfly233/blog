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