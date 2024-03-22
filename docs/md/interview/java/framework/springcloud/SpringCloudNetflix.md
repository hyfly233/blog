# Spring Cloud Netflix

## Spring Cloud Netflix

Netflix OSS 开源组件集成，包括Eureka、Hystrix、Ribbon、Feign、Zuul等核心组件，Spring Cloud 2020.0 版本删除了Netflix除Eureka外的所有组件

- **Eureka：**服务治理组件，包括服务端的注册中心和客户端的服务发现机制
- **Ribbon：**负载均衡的服务调用组件，具有多种负载均衡调用策略
- **Hystrix：**服务容错组件，实现了断路器模式，为依赖服务的出错和延迟提供了容错能力
- **Feign：**基于 Ribbon 和 Hystrix 的**声明式服务调用组件**
- **Zuul：**API网关组件，对请求提供路由及过滤功能

## Eureka

### Eureka工作原理

- **Eureka：**服务注册中心(可以是一个集群)，对外暴露自己地址
- **服务提供者：**启动后向 Eureka 注册自己信息(地址，提供的是什么服务)
- **服务消费者：**向 Eureka 订阅服务，Eureka会将对应服务的服务列表发送给消费者，并且定期更新
- **心跳(续约)：**服务提供者定期通过 http 方式向 Eureka 刷新自己的状态

### 什么是服务注册

服务提供者在启动时，会向 EurekaServer 发起一次请求，将自己注册到 Eureka 注册中心中去

### 什么是服务续约

在注册服务完成以后，服务提供者会维持一个心跳(每30s定时向 EurekaServer 分发起请求)，通知 EurekaServer 当前为可用状态

### 什么是失效剔除

服务提供方并不一定是正常下线的，可能是内存溢出、网络故障等原因导致服务无法正常工作。EurekaServer 会将这些失效的服务从服务列表中剔除。因此它会开启一个定时任务，每隔60秒会对失效的服务进行一次剔除

### 什么是自我保护

当可能因为网络原因服务未按时进行心跳续约时，此时把服务从服务列表中剔除并不妥当，因为服务也有可能未宕机。Eureka 就会把当前实例的注册信息保护起来，不允剔除。这种方式在生产环境下很有效，保证了大多数服务依然可用

### 不使用Eureka注册中心的情况下，分布式服务必然面临的问题

- 服务管理：

- - 如何自动注册和发现服务
  - 如何实现服务状态的监管
  - 如何实现动态路由，从而实现负载均衡

- 服务如何实现负载均衡
- 服务如何解决容灾问题
- 服务如何实现统一配置

### 简述什么是CAP，并说明Eureka包含CAP中的哪些?

- CAP理论：一个分布式系统不可能同时满足C (一致性)、A(可用性)、P(分区容错性)。由于**分区容错性P**在分布式系统中是必须要保证的，因此只能从A和C中进行权衡
- Eureka 遵守 AP
- Eureka 各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务
- Eureka的客户端在向某个 Eureka 注册或查询时，如果发现连接失败，则会自动切换至其他节点
- 只要有一台Eureka还在，就能保证注册服务可用，只不过查的信息可能不是最新的（不保证强一致性）

### Eureka的Region和Zone todo

## Zuul

### 什么是Zuul

Zuul作为微服务系统的网关组件，是从设备和网站到后端的所有请求的前门。作为边缘服务应用程序，Zuul旨在实现动态路由，监控，弹性和安全性。Zuul包含了对请求的路由、过滤、限流三个最主要的功能，Zuul 和 Eureka进行整合时，Zuul 将自身注册为 Eureka 服务治理下的应用，同时从 Eureka 中获得其他微服务的消息，以后的访问微服务都是通过 Zuul 跳转后获得

- **路由：**负责将外部请求转发到具体的微服务实例上，是实现外部访问统一入口
- **过滤器：**负责对请求的处理过程进行干预，可实现请求校验、服务聚合等功能
- **限流：**添加 spring-cloud-zuul-ratelimit 依赖，进行流量限制

### Zuul的工作原理 todo

### Zuul的作用

Zuul可以通过加载动态过滤机制，从而实现以下各项功能：

- **验证与安全保障:** 识别面向各类资源的验证要求并拒绝那些与要求不符的请求
- **审查与监控:** 在边缘位置追踪有意义数据及统计结果
- **动态路由:** 以动态方式根据需要将请求路由至不同后端集群处
- **分散压力:** 逐渐增加指向集群的负载流量，从而计算性能水平
- **负载分配:** 为每一种负载类型分配对应容量，并弃用超出限定值的请求
- **静态响应处理:** 在边缘位置直接建立部分响应，从而避免其流入内部集群

### Zuul和Nginx的区别

- 相同点：Zuul和Nginx都可以实现负载均衡、反向代理、过滤请求，实现网关的效果
- 不同点:

- - Nginx由C语言开发，Zuul由Java开发
  - 负载均衡：Nginx采用服务器实现负载均衡，Zuul采用Ribbon+Eureka实现本地负载均衡
  - Nginx相比Zuul功能会更加强大，Nginx整合一些脚本语言（lua）
  - Nginx适合于服务器端负载均衡，Zuul适合微服务中的网关实现

### Zuul限流

- Zuul的限流算法为**漏桶算法和令牌桶算法**(所有的限流统一算法)
- 限流粒度

- - **粗粒度**

- - - 网关限流
    - 单个服务

- - **细粒度**

- - - **user：**认证用户或者匿名，针对某个用户粒度进行限流
    - **origin：**客户机的IP，针对请求客户机的IP进行限流
    - **url：**特定url，针对请求的url粒度进行限流
    - **serviceId：**特定服务，针对某个服务的id粒度进行限流

## Ribbon

### Ribbon概述

Srping Cloud Ribbon是基于Netfix Ribbon实现的一套客户端负债均衡工具，Ribbon是Netflix发布的开源项目，主要功能是提供**客户端的负载均衡算法**。Ribbon客户端组件提供一系列完善的配置项，如：连接超时，重试等。简单的说，就是在配置文件中列出 Load Balancer 后面所有的机器，Ribbon会自动基于某种规则（如简单轮询，随机连接等）去连接这些机器

### Ribbon常见的负载均衡算法

- **轮询(RoundRobinRule)**：默认算法
- **随机(RandomRule）**
- **轮询重试(RetryRule)**
- **响应速度决定权重(WeightedResponseTimeRule)**：响应时间越快，权重越大
- **最优可用(BestAvailableRule)：**选择**并发连接数**较小的Server发送请求
- **可用性过滤规则(AvailabilityFilteringRule)：**先过滤掉不可用的Server实例，再选择并发连接最小的实例
- **区域内可用性能最优(ZoneAvoidanceRule)：**基于**可用性过滤规则(AvailabilityFilteringRule)**的基础，首先判断一个Zone的运行性能是否可用，剔除不可用的区域Zone的所有Server，然后再过滤并发连接过多的Server

### Ribbon自定义负载均衡算法

1. 实现 IRule 接口，参考 RoundRobinRule 的实现

```java
@Configuration
public class MyRule implements IRule {
}
```

1. 创建 IRule 的 Bean

```java
@Configuration
public class MyRuleConfig {
	@Bean
    public IRule myRule() {
        return new MyRule();
    }
}
```

### Ribbon和Feign的区别

都是调用其他服务的，但方式不同 

1. 启动类注解不同：Ribbon是**@RibbonClient**，Feign的是**@EnableFeignClients**
2. 服务指定的位置不同：Ribbon是在**@RibbonClient**注解上**声明负载均衡算法和使用负载均衡的Service**，Feign是在定义抽象方法的**接口中**使用@FeignClient声明
3. 调用方式不同：Ribbon需要自己构建http请求，然后使用RestTemplate发送给其他服务，步骤繁琐。Feign只需要将调用的方法定义成抽象方法即可

### Ribbon 原理

使用HTTP通信的框架组件(如：HttpClient)，先从Ribbon的**本地Eureka注册表缓存**中获取服务提供者的列表，然后进行负载均衡，选出一台机器，接着针对那台机器发送 Http 请求

### Ribbon的总体流程

针对被**@LoadBalanced**修饰的RestTemplate，给该RestTemplate增加**LoadBalancerInterceptor拦截器**，从而实现对负载均衡器的调用。负载均衡器通过服务名获取过滤后的服务列表，通过负载均衡算法获取其中某台实例，并进行调用

### Ribbon如何选择调用哪个实例

1. **获取服务列表：**为了减少服务的延迟，客户端会通过 **eureka.instance.metadata-map.zone** 指定的zone对服务列表进行过滤
2. **负载均衡：**通过负载均衡策略从服务列表中获得其中一台，默认是RoundRobinRule轮询策略，再对服务端进行调用

### 服务列表的获取过程

1. 服务列表默认是基于服务发现的，在应用启动时Ribbon就会从Eureka服务器中获取所有注册服务的列表数据，并**保持同步**。也可以通过动态设置的方式在配置文件中进行指定
2. 通过**ServerListFilter**对服务器列表进行过滤

1. 1. **ZoneAffinityServerListFilter：**基于区域感知的方式，实现对服务实例的过滤，仅返回与本身所处区域一直的服务提供者实例列表；
   2. **ServerListSubsetFilter：**该过滤器继承自ZoneAffinityServerListFilter，在进行区域感知过滤后，仅返回一个固定大小的服务列表。默认将返回20个服务实例，可以通过**ribbon.ServerListSubsetFilter.size**进行设置；
   3. **ZonePreferenceServerListFilter：**Eureka和Ribbon时默认的过滤器。实现通过配置或者Eureka所属区域来过滤出同区域的服务实例列表。

### Ribbon如何避免调用失效实例

1. 通过**IPing机制**检测实例，如果检测到某服务实例不存在或一定时间未响应，则会从服务列表中及时移除
2. 保留Zone的统计数据，Ribbon可以避免可能访问失效的Zone

## Feign todo





## Hystrix

### 使用

一般都是在消费端配置断路器，因为不用来回传值。需要在启动类配置的注解为：**@EnableHystrix**

```java
@GetMapping("/test/{id}")
@HystrixCommand(fallbackMethod = "testFallBackMethod", 
                commandProperties = {
                    @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", 
                                     value = "1500")
                })
public String test(@PathVariable("id") Integer id) {
    return testService.test(id);
}
```

配置的文件为application.yml：

```yaml
feign:
	hystrix:
		enabled: true
```

### Hystrix简介

- Hystrix是一个用于处理分布式系统的延迟和容错的开源库，在分布式系统里，许多依赖不可避免的会调用失败，比如超时、异常等，Hystrix 能够保证在一个依赖出问题的情况下，不会导致整体服务失败，避免级联故障，从而提高分布式系统的稳定性
- **断路器**本身是一种开关装置，当某个服务单元发送故障之后，通过断路器的**故障监控**(类似熔断保险丝)，向调用方返回一个**符合预期的、可处理的备选响应**(FallBack)，**而不是长时间的等待或抛出调用方无法处理的异常**，这样就保证了**服务调用方的线程不会被长时间、不必要地占用**，从而避免了故障在分布式系统中的蔓延，乃至雪崩

### Hystrix的提供的功能

资源隔离、限流、熔断、降级、运维监控

### 为什么要使用断路器Hystrix

在微服务架构中，将业务拆分成一个个的服务，服务与服务之间可以相互调用。为了保证其高可用，单个服务有必须集群部署。由于**网络原因**或者**自身的原因**，服务并不能保证服务的100%可用，如果单个服务出现问题，调用这个服务就会出现**网络延迟**，此时若有大量的网络请求涌入，会形成**任务累计**，导致服务瘫痪，甚至导致**服务雪崩**。为了解决这个问题出现了短路器，相当于现实生活中的保险丝，用于保障系统的稳定性

### Hystrix重要概念

- 服务降级：服务器忙，不让客户端等待并立刻返回一个友好提示，**fallback**

- - 出现降级的情况：

- - - 程序运行异常
    - 超时
    - 线程池 / 信号量打满导致服务降级
    - 服务熔断触发服务降级

- 服务熔断：类似保险丝达到最大服务访问后，直接拒绝访问，拉闸限电，然后调用服务降级的方法并返回友好提示
- 服务限流：秒杀高并发等操作，严禁大量的流量直接涌入

### 什么是服务雪崩

- 多个服务之间调用的时候，假设服务A调用服务B和服务C，服务B和服务C又调用其他的服务，这就是所谓的**扇出**。如果扇出的链路上某个服务调用**响应时间过长或者不可用**，对服务A的调用就会**占用越来越多的系统资源**，**进而引起系统崩溃**，所谓的**雪崩效应**。
- 对于**高流量的应用**来说，**单一**的后端依赖可能会导致所有服务器上的**所有资源**都在**几秒钟内饱和**。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列、线程和其他系统资源紧张，导致整个系统发生更多的级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。
- 通常当发现一个模块下的某个实例失败后，这时候这个模块依然还会接受流量，然后这个**有问题的模块还调用了其他的模块**，这样就会发生**级联故障**及**服务雪崩**。
- 要避免级联故障，需要有一种**链路中断**的方案：**服务降级**、**服务熔断**

### Hystrix的总体流程

1. 【入口】通过**HystrixCommand**和**HystrixCollapser**注解修饰的方法，会被**HystrixCommandAspect**进行AOP处理
2. 【缓存】如**RequestCache**打开，则判断缓存是否命中
3. 【熔断】判断是否有被开关、熔断降级；若被降级，则走降级逻辑；若未被降级，则走正常逻辑
4. 【隔离】根据配置走**线程池隔离**或**信号量隔离**，任务满则走降级逻辑
5. 【执行】执行任务，若任务执行失败或异常，则进入降级逻辑
6. 【超时】通过**定时器延时任务**检测业务调用执行是否超时，若超时则**取消业务执行**的线程，进入降级逻辑；若未超时，则正常返回
7. 【降级】若进入降级逻辑，根据**getFallback()**方法，返回降级处理的数据，**若未实现该方法，则返回异常**
8. 【统计】业务调用执行结果成功、失败、超时等均会进入统计模块，**通过健康统计结果来决定熔断器打开或关闭**

### RequestCache是什么

**缓存在高并发的环境下使用，能够有效地减少服务器的压力**，使用Hystrix返回结果缓存，后续请求可以直接调用缓存数据，该缓存就是 RequestCache。Hystrix 通过参数 **requestCache.enabled** 设置是否缓存请求，默认值true

### Hystrix的开关降级如何实现

开关降级的参数：

- **circuitBreaker.forceOpen：**熔断器**强制打开**，该状态下它将拒绝所有请求，默认值 false。
- **circuitBreaker.forceClosed：**熔断器**强制关闭**，在此状态下，无论错误百分比如何，它都将允许请求，默认值 false。

### Hystrix的超时降级如何实现

超时降级的参数：

- **execution.timeout.enabled：**是否启用超时时间，默认值为true
- **execution.isolationthread.timeoutInMilliseconds：**超时时间，默认值为1000
- **execution.isolation.thread.interruptOnTimeout：**超时后是否允许中断 interrupt，默认为 true
- **execution.isolation.thread.interruptOnCancel：**关闭 cancel 后是否中断 interrupt，默认为 false

### Hystrix的熔断降级如何实现

熔断降级的参数：

- **circuitBreaker.requestVolumeThreshold：触发熔断判断**的**请求次数阈值**，**默认值为20，**是一段时间内**至少**有20个请求才进行熔断降级计算。如一段时间有19个请求全部失败，错误率是100%，但熔断器不会打开，因为总请求数不满足20
- **circuitBreaker.sleepWindowInMilliseconds：半开状态试探睡眠时间**，默认值5000ms，如熔断器开启5000ms后，会尝试放过去一部分流量**进行试探**，确定依赖服务是否恢复
- **circuitBreaker.errorThresholdPersentage：**错误率，默认值50%，例如一段时间（10s）内有100个请求，其中有54个超时或者有异常，则错误率是54%，大于默认值50%，这种情况下触发熔断器开关

### 线程池隔离与信号量隔离的选型

线程池隔离和信号量隔离是**用于限制调用分布式服务的资源使用，某一个调用的服务出现问题不会影响其他服务调用**，通过 **hystrix.command.default.execution.isolation.strategy** 配置隔离策略，可选 Thread、Semaphore，默认是 Thread

- **线程隔离（Thread）：**使用该方式**HystrixCommand**将会在**单独的线程上执行**，**并发请求受线程池中线程数量的限制**
- **信号量隔离（Semaphore）：**使用该方式**HystrixCommand**将会在**调用线程上执行**，开销相对较小，**并发请求受信号量的个数的限制**