# 面试

+ 使用 Spring Cloud 有什么优势

  使用 Spring Boot 开发分布式微服务时，我们面临以下问题 

  •    与分布式系统相关的复杂性 - 网络问题，延迟开销，带宽问题，安全问题

  •    服务发现-服务发现工具管理群集中的流程和服务如何查找和互相交谈。它涉及一个服务目录，在该目录中注册服务，然后能够查找并连接到该目录中的服务。 

  •    冗余-分布式系统中的冗余问题。 

  •    负载平衡 --负载平衡改善跨多个计算资源的工作负荷，诸如计算机，计算机集群，网络链路，中央处理单元，或磁盘驱动器的分布。 

  •    性能-问题 由于各种运营开销导致的性能问题。 

  •    部署复杂性-Devops 技能的要求

  

+ 服务注册和发现是什么意思？Spring Cloud 如何实现

  当我们开始一个项目时，我们通常在属性文件中进行所有的配置。随着越来越多的服务开发和部署，添加和修改这些属性变得更加复杂。有些服务可能会下降，而某些位置可能会发生变化。手动更改属性可能会产生问题。 Eureka 服务注册和发现可以在这种情况下提供帮助。由于所有服务都在 Eureka 服务器上注册并通过调用 Eureka 服务器完成查找，因此无需处理服务地点的任何更改和处理。

  

+ 负载平衡的意义什么

  负载平衡可以改善跨计算机，计算机集群，网络链接，中央处理单元或磁盘驱动器等多种计算资源的工作负载分布。

  负载平衡旨在优化资源使用，最大化吞吐量，最小化响应时间并避免任何单一资源的过载

  使用多个组件进行负载平衡而不是单个组件可能会通过冗余来提高可靠性和可用性

  负载平衡通常涉及专用软件或硬件，例如多层交换机或域名系统服务器进程

  

+ 什么是 Hystrix？它如何实现容错

  Hystrix 是一个延迟和容错库，旨在隔离远程系统，服务和第三方库的访问点，当出现故障是不可避免的故障时，停止级联故障并在复杂的分布式系统中实现弹性

  Hystrix 定义了一个回退方法。这种后备方法应该具有与公开服务相同的返回类型。如果暴露服务中出现异常，则回退方法将返回一些值

  

  通常对于使用微服务架构开发的系统，涉及到许多微服务。这些微服务彼此协作。  

  思考以下微服务 

  ![1](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/SpringCloud面试专题及答案.assets/1.jpg)

  假设如果上图中的微服务 9 失败了，那么使用传统方法我们将传播一个异常。但这仍然会导致整个系统崩溃。 

  随着微服务数量的增加，这个问题变得更加复杂。微服务的数量可以高达 1000.这是 hystrix 出现的地方我们将使用 Hystrix 在这种情况下的 Fallback 方法功能。我们有两个服务 employee-consumer 使用由 employee-consumer 公开的服务。  

  简化图如下所示  

  ![2](E:/面试/金三银四 面试突击班/3月面试突击班/突击班面经/04-常见面试题汇总(有选择看)/SpringCloud面试专题及答案.assets/2.jpg)

  现在假设由于某种原因，employee-producer 公开的服务会抛出异常

  

+ 什么是Hystrix 断路器

  由于某些原因，服务会引发异常。在这种情况下使用 Hystrix 我们定义了一个回退方法。如果在公开服务中发生异常，则回退方法返回一些默认值

  断路器的目的是给第一页方法或第一页方法可能调用的其他方法留出时间，并导致异常恢复。

  

+ Netflix Feign

  Feign 是受到 Retrofit，JAXRS-2.0 和 WebSocket 启发的 java 客户端联编程序。Feign 的第一个目标是将约束分母的复杂性统一到 http apis，而不考虑其稳定性。使用 REST 模板公开的 REST 服务

  ·   使用功能区进行负载平衡。 

  ·   获取服务实例，然后获取基本 URL。 

  ·   利用 REST 模板来使用服务。

  

  ```java
  @Controller
  public class ConsumerControllerClient { 
      
      @Autowired
      private LoadBalancerClient loadBalancer;
      
      public void getEmployee() throws RestClientException, IOException { 
  
  	ServiceInstance serviceInstance = loadBalancer.choose("employee-producer"); 
  
  	System.out.println(serviceInstance.getUri()); 
  
  	String baseUrl = serviceInstance.getUri().toString(); 
  
  	baseUrl = baseUrl + "/employee"; 
  
  	RestTemplate restTemplate = new RestTemplate(); 
  	ResponseEntity<String> response = null; 
          
      try { 
          response = restTemplate.exchange(baseUrl, HttpMethod.GET, getHeaders(), String.class); 
      } catch (Exception ex) {
  		System.out.println(ex);
  	}
      
  	System.out.println(response.getBody());
  }
  ```

  

  之前的代码，有像 NullPointer 这样的例外的机会，并不是最优的。我们将看到如何使用 Netflix Feign使呼叫变得更加轻松和清洁。如果 Netflix Ribbon 依赖关系也在类路径中，那么 Feign 默认也会负责负载平衡。

  

+ **什么是**  Spring Cloud Bus？

  Spring Cloud Bus 提供了跨多个实例刷新配置的功能，无论何时刷新实例，此事件都会订阅到侦听此代理的所有微服务，并且它们也会刷新。可以通过使用端点/总线/刷新来实现对任何单个实例的刷新

+ Spring Cloud Config

  在分布式系统中，由于服务数量巨多，为了方便服务配置文件统一管理，实时更新，所以需要分布式配置中心组件。在Spring Cloud中，有分布式配置中心组件spring cloud config ，它支持配置服务放在配置服务的内存中（即本地），也支持放在远程Git仓库中。在spring cloud config 组件中，分两个角色，一是 config server，二是config client。

  使用：

  （1）  添加pom依赖

  （2）  配置文件添加相关配置

  （3）  启动类添加注解@EnableConfigServer

  

+ Spring Cloud Gateway

  Spring Cloud Gateway是Spring Cloud官方推出的第二代网关框架，取代Zuul 网关。网关作为流量的，在微服务系统中有着非常作用，网关常见的功能有路由转发、权限校验、限流控制等作用。

  使用了一个RouteLocatorBuilder的bean去创建路由，除了创建路由

  RouteLocatorBuilder可以让你添加各种predicates和filters，predicates断言的意思，顾名思义就是根据具体的请求的规则，由具体的route去处理，filters 是各种过滤器，用来对请求做各种判断和修改。





# 主要项目

Spring Cloud的子项目，大致可分成两类

第一类是对现有成熟框架"Spring Boot化"的封装和抽象，也是数量最多的项目；

第二类是开发了一部分分布式系统的基础设施的实现，如Spring Cloud Stream扮演的就是kafka, ActiveMQ这样的角色。

## Spring Cloud Config

集中配置管理工具，分布式系统中统一的外部配置管理，默认使用Git来存储配置，可以支持客户端配置的刷新及加密、解密操作



## Spring Cloud Netflix

Netflix OSS 开源组件集成，包括Eureka、Hystrix、Ribbon、Feign、Zuul等核心组件。

Eureka：服务治理组件，包括服务端的注册中心和客户端的服务发现机制；

Ribbon：负载均衡的服务调用组件，具有多种负载均衡调用策略；

Hystrix：服务容错组件，实现了断路器模式，为依赖服务的出错和延迟提供了容错能力；

Feign：基于Ribbon和Hystrix的声明式服务调用组件；

Zuul：API网关组件，对请求提供路由及过滤功能



## Spring Cloud Bus

用于传播集群状态变化的消息总线，使用轻量级消息代理链接分布式系统中的节点，可以用来动态刷新集群中的服务配置。

Spring Cloud Consul

基于Hashicorp Consul的服务治理组件。

Spring Cloud Security

安全工具包，对Zuul代理中的负载均衡OAuth2客户端及登录认证进行支持



## Spring Cloud Sleuth

Spring Cloud应用程序的分布式请求链路跟踪，支持使用Zipkin、HTrace和基于日志（例如ELK）的跟踪



## Spring Cloud Stream

轻量级事件驱动微服务框架，可以使用简单的声明式模型来发送及接收消息，主要实现为Apache Kafka及RabbitMQ



## Spring Cloud Task

用于快速构建短暂、有限数据处理任务的微服务框架，用于向应用中添加功能性和非功能性的特性。

Spring Cloud Zookeeper

基于Apache Zookeeper的服务治理组件。

Spring Cloud Gateway

API网关组件，对请求提供路由及过滤功能



## Spring Cloud OpenFeign

基于Ribbon和Hystrix的声明式服务调用组件，可以动态创建基于Spring MVC 注解的接口实现用于服务调用，在Spring Cloud 2.0中已经取代Feign成为了一等公民





# SpringBoot和SpringCloud的区别？

SpringBoot专注于快速方便的开发单个个体微服务。

SpringCloud是关注全局的微服务协调整理治理框架，它将SpringBoot开发的一个个单体微服务整合并管理起来，为各个微服务之间提供，配置管理、服务发现、断路器、路由、微代理、事件总线、全局锁、决策竞选、分布式会话等等集成服务

SpringBoot可以离开SpringCloud独立使用开发项目， 但是SpringCloud离不开SpringBoot ，属于依赖的关系

SpringBoot专注于快速、方便的开发单个微服务个体，SpringCloud关注全局的服务治理框架



## 使用 Spring Boot 开发分布式微服务时，我们面临以下问题

（1）  与分布式系统相关的复杂性-这种开销包括网络问题，延迟开销，带宽问题，安全问题。

（2）  服务发现-服务发现工具管理群集中的流程和服务如何查找和互相交谈。它涉及一个服务目录，在该目录中注册服务，然后能够查找并连接到该目录中的服务。

（3）  冗余-分布式系统中的冗余问题。

（4）  负载平衡 --负载平衡改善跨多个计算资源的工作负荷，诸如计算机，计算机集群，网络链路，中央处理单元，或磁盘驱动器的分布。

（5）  性能-问题 由于各种运营开销导致的性能问题。

（6）部署复杂性-Devops 技能的要求。





------



# 分布式面试

## CAP原则