# Spring Cloud Netflix

## Spring Cloud Netflix

Netflix OSS 开源组件集成，包括 Eureka、Hystrix、Ribbon、Feign、Zuul 等核心组件，Spring Cloud 2020.0 版本删除了 Netflix 除 Eureka 外的所有组件

-   **Eureka：**服务治理组件，包括服务端的注册中心和客户端的服务发现机制
-   **Ribbon：**负载均衡的服务调用组件，具有多种负载均衡调用策略
-   **Hystrix：**服务容错组件，实现了断路器模式，为依赖服务的出错和延迟提供了容错能力
-   **Feign：**基于 Ribbon 和 Hystrix 的**声明式服务调用组件**
-   **Zuul：**API 网关组件，对请求提供路由及过滤功能

## Eureka

### Eureka 工作原理

-   **Eureka：**服务注册中心(可以是一个集群)，对外暴露自己地址
-   **服务提供者：**启动后向 Eureka 注册自己信息(地址，提供的是什么服务)
-   **服务消费者：**向 Eureka 订阅服务，Eureka 会将对应服务的服务列表发送给消费者，并且定期更新
-   **心跳(续约)：**服务提供者定期通过 http 方式向 Eureka 刷新自己的状态

### 什么是服务注册

服务提供者在启动时，会向 EurekaServer 发起一次请求，将自己注册到 Eureka 注册中心中去

### 什么是服务续约

在注册服务完成以后，服务提供者会维持一个心跳(每 30s 定时向 EurekaServer 分发起请求)，通知 EurekaServer 当前为可用状态

### 什么是失效剔除

服务提供方并不一定是正常下线的，可能是内存溢出、网络故障等原因导致服务无法正常工作。EurekaServer 会将这些失效的服务从服务列表中剔除。因此它会开启一个定时任务，每隔 60 秒会对失效的服务进行一次剔除

### 什么是自我保护

当可能因为网络原因服务未按时进行心跳续约时，此时把服务从服务列表中剔除并不妥当，因为服务也有可能未宕机。Eureka 就会把当前实例的注册信息保护起来，不允剔除。这种方式在生产环境下很有效，保证了大多数服务依然可用

### 不使用 Eureka 注册中心的情况下，分布式服务必然面临的问题

-   服务管理：

-   -   如何自动注册和发现服务
    -   如何实现服务状态的监管
    -   如何实现动态路由，从而实现负载均衡

-   服务如何实现负载均衡
-   服务如何解决容灾问题
-   服务如何实现统一配置

### 简述什么是 CAP，并说明 Eureka 包含 CAP 中的哪些?

-   CAP 理论：一个分布式系统不可能同时满足 C (一致性)、A(可用性)、P(分区容错性)。由于**分区容错性 P**在分布式系统中是必须要保证的，因此只能从 A 和 C 中进行权衡
-   Eureka 遵守 AP
-   Eureka 各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务
-   Eureka 的客户端在向某个 Eureka 注册或查询时，如果发现连接失败，则会自动切换至其他节点
-   只要有一台 Eureka 还在，就能保证注册服务可用，只不过查的信息可能不是最新的（不保证强一致性）

### Eureka 的 Region 和 Zone todo

## Zuul

### 什么是 Zuul

Zuul 作为微服务系统的网关组件，是从设备和网站到后端的所有请求的前门。作为边缘服务应用程序，Zuul 旨在实现动态路由，监控，弹性和安全性。Zuul 包含了对请求的路由、过滤、限流三个最主要的功能，Zuul 和 Eureka 进行整合时，Zuul 将自身注册为 Eureka 服务治理下的应用，同时从 Eureka 中获得其他微服务的消息，以后的访问微服务都是通过 Zuul 跳转后获得

-   **路由：**负责将外部请求转发到具体的微服务实例上，是实现外部访问统一入口
-   **过滤器：**负责对请求的处理过程进行干预，可实现请求校验、服务聚合等功能
-   **限流：**添加 spring-cloud-zuul-ratelimit 依赖，进行流量限制

### Zuul 的工作原理 todo

### Zuul 的作用

Zuul 可以通过加载动态过滤机制，从而实现以下各项功能：

-   **验证与安全保障:** 识别面向各类资源的验证要求并拒绝那些与要求不符的请求
-   **审查与监控:** 在边缘位置追踪有意义数据及统计结果
-   **动态路由:** 以动态方式根据需要将请求路由至不同后端集群处
-   **分散压力:** 逐渐增加指向集群的负载流量，从而计算性能水平
-   **负载分配:** 为每一种负载类型分配对应容量，并弃用超出限定值的请求
-   **静态响应处理:** 在边缘位置直接建立部分响应，从而避免其流入内部集群

### Zuul 和 Nginx 的区别

-   相同点：Zuul 和 Nginx 都可以实现负载均衡、反向代理、过滤请求，实现网关的效果
-   不同点:

-   -   Nginx 由 C 语言开发，Zuul 由 Java 开发
    -   负载均衡：Nginx 采用服务器实现负载均衡，Zuul 采用 Ribbon+Eureka 实现本地负载均衡
    -   Nginx 相比 Zuul 功能会更加强大，Nginx 整合一些脚本语言（lua）
    -   Nginx 适合于服务器端负载均衡，Zuul 适合微服务中的网关实现

### Zuul 限流

-   Zuul 的限流算法为**漏桶算法和令牌桶算法**(所有的限流统一算法)
-   限流粒度

-   -   **粗粒度**

-   -   -   网关限流
        -   单个服务

-   -   **细粒度**

-   -   -   **user：**认证用户或者匿名，针对某个用户粒度进行限流
        -   **origin：**客户机的 IP，针对请求客户机的 IP 进行限流
        -   **url：**特定 url，针对请求的 url 粒度进行限流
        -   **serviceId：**特定服务，针对某个服务的 id 粒度进行限流

## Ribbon

### Ribbon 概述

Srping Cloud Ribbon 是基于 Netfix Ribbon 实现的一套客户端负债均衡工具，Ribbon 是 Netflix 发布的开源项目，主要功能是提供**客户端的负载均衡算法**。Ribbon 客户端组件提供一系列完善的配置项，如：连接超时，重试等。简单的说，就是在配置文件中列出 Load Balancer 后面所有的机器，Ribbon 会自动基于某种规则（如简单轮询，随机连接等）去连接这些机器

### Ribbon 常见的负载均衡算法

-   **轮询(RoundRobinRule)**：默认算法
-   **随机(RandomRule）**
-   **轮询重试(RetryRule)**
-   **响应速度决定权重(WeightedResponseTimeRule)**：响应时间越快，权重越大
-   **最优可用(BestAvailableRule)：**选择**并发连接数**较小的 Server 发送请求
-   **可用性过滤规则(AvailabilityFilteringRule)：**先过滤掉不可用的 Server 实例，再选择并发连接最小的实例
-   **区域内可用性能最优(ZoneAvoidanceRule)：**基于**可用性过滤规则(AvailabilityFilteringRule)**的基础，首先判断一个 Zone 的运行性能是否可用，剔除不可用的区域 Zone 的所有 Server，然后再过滤并发连接过多的 Server

### Ribbon 自定义负载均衡算法

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

### Ribbon 和 Feign 的区别

都是调用其他服务的，但方式不同

1. 启动类注解不同：Ribbon 是**@RibbonClient**，Feign 的是**@EnableFeignClients**
2. 服务指定的位置不同：Ribbon 是在**@RibbonClient**注解上**声明负载均衡算法和使用负载均衡的 Service**，Feign 是在定义抽象方法的**接口中**使用@FeignClient 声明
3. 调用方式不同：Ribbon 需要自己构建 http 请求，然后使用 RestTemplate 发送给其他服务，步骤繁琐。Feign 只需要将调用的方法定义成抽象方法即可

### Ribbon 原理

使用 HTTP 通信的框架组件(如：HttpClient)，先从 Ribbon 的**本地 Eureka 注册表缓存**中获取服务提供者的列表，然后进行负载均衡，选出一台机器，接着针对那台机器发送 Http 请求

### Ribbon 的总体流程

针对被**@LoadBalanced**修饰的 RestTemplate，给该 RestTemplate 增加**LoadBalancerInterceptor 拦截器**，从而实现对负载均衡器的调用。负载均衡器通过服务名获取过滤后的服务列表，通过负载均衡算法获取其中某台实例，并进行调用

### Ribbon 如何选择调用哪个实例

1. **获取服务列表：**为了减少服务的延迟，客户端会通过 **eureka.instance.metadata-map.zone** 指定的 zone 对服务列表进行过滤
2. **负载均衡：**通过负载均衡策略从服务列表中获得其中一台，默认是 RoundRobinRule 轮询策略，再对服务端进行调用

### 服务列表的获取过程

1. 服务列表默认是基于服务发现的，在应用启动时 Ribbon 就会从 Eureka 服务器中获取所有注册服务的列表数据，并**保持同步**。也可以通过动态设置的方式在配置文件中进行指定
2. 通过**ServerListFilter**对服务器列表进行过滤

3.  1. **ZoneAffinityServerListFilter：**基于区域感知的方式，实现对服务实例的过滤，仅返回与本身所处区域一直的服务提供者实例列表；
    2. **ServerListSubsetFilter：**该过滤器继承自 ZoneAffinityServerListFilter，在进行区域感知过滤后，仅返回一个固定大小的服务列表。默认将返回 20 个服务实例，可以通过**ribbon.ServerListSubsetFilter.size**进行设置；
    3. **ZonePreferenceServerListFilter：**Eureka 和 Ribbon 时默认的过滤器。实现通过配置或者 Eureka 所属区域来过滤出同区域的服务实例列表。

### Ribbon 如何避免调用失效实例

1. 通过**IPing 机制**检测实例，如果检测到某服务实例不存在或一定时间未响应，则会从服务列表中及时移除
2. 保留 Zone 的统计数据，Ribbon 可以避免可能访问失效的 Zone

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

配置的文件为 application.yml：

```yaml
feign:
	hystrix:
		enabled: true
```

### Hystrix 简介

-   Hystrix 是一个用于处理分布式系统的延迟和容错的开源库，在分布式系统里，许多依赖不可避免的会调用失败，比如超时、异常等，Hystrix 能够保证在一个依赖出问题的情况下，不会导致整体服务失败，避免级联故障，从而提高分布式系统的稳定性
-   **断路器**本身是一种开关装置，当某个服务单元发送故障之后，通过断路器的**故障监控**(类似熔断保险丝)，向调用方返回一个**符合预期的、可处理的备选响应**(FallBack)，**而不是长时间的等待或抛出调用方无法处理的异常**，这样就保证了**服务调用方的线程不会被长时间、不必要地占用**，从而避免了故障在分布式系统中的蔓延，乃至雪崩

### Hystrix 的提供的功能

资源隔离、限流、熔断、降级、运维监控

### 为什么要使用断路器 Hystrix

在微服务架构中，将业务拆分成一个个的服务，服务与服务之间可以相互调用。为了保证其高可用，单个服务有必须集群部署。由于**网络原因**或者**自身的原因**，服务并不能保证服务的 100%可用，如果单个服务出现问题，调用这个服务就会出现**网络延迟**，此时若有大量的网络请求涌入，会形成**任务累计**，导致服务瘫痪，甚至导致**服务雪崩**。为了解决这个问题出现了短路器，相当于现实生活中的保险丝，用于保障系统的稳定性

### Hystrix 重要概念

-   服务降级：服务器忙，不让客户端等待并立刻返回一个友好提示，**fallback**

-   -   出现降级的情况：

-   -   -   程序运行异常
        -   超时
        -   线程池 / 信号量打满导致服务降级
        -   服务熔断触发服务降级

-   服务熔断：类似保险丝达到最大服务访问后，直接拒绝访问，拉闸限电，然后调用服务降级的方法并返回友好提示
-   服务限流：秒杀高并发等操作，严禁大量的流量直接涌入

### 什么是服务雪崩

-   多个服务之间调用的时候，假设服务 A 调用服务 B 和服务 C，服务 B 和服务 C 又调用其他的服务，这就是所谓的**扇出**。如果扇出的链路上某个服务调用**响应时间过长或者不可用**，对服务 A 的调用就会**占用越来越多的系统资源**，**进而引起系统崩溃**，所谓的**雪崩效应**。
-   对于**高流量的应用**来说，**单一**的后端依赖可能会导致所有服务器上的**所有资源**都在**几秒钟内饱和**。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列、线程和其他系统资源紧张，导致整个系统发生更多的级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。
-   通常当发现一个模块下的某个实例失败后，这时候这个模块依然还会接受流量，然后这个**有问题的模块还调用了其他的模块**，这样就会发生**级联故障**及**服务雪崩**。
-   要避免级联故障，需要有一种**链路中断**的方案：**服务降级**、**服务熔断**

### Hystrix 的总体流程

1. 【入口】通过**HystrixCommand**和**HystrixCollapser**注解修饰的方法，会被**HystrixCommandAspect**进行 AOP 处理
2. 【缓存】如**RequestCache**打开，则判断缓存是否命中
3. 【熔断】判断是否有被开关、熔断降级；若被降级，则走降级逻辑；若未被降级，则走正常逻辑
4. 【隔离】根据配置走**线程池隔离**或**信号量隔离**，任务满则走降级逻辑
5. 【执行】执行任务，若任务执行失败或异常，则进入降级逻辑
6. 【超时】通过**定时器延时任务**检测业务调用执行是否超时，若超时则**取消业务执行**的线程，进入降级逻辑；若未超时，则正常返回
7. 【降级】若进入降级逻辑，根据**getFallback()**方法，返回降级处理的数据，**若未实现该方法，则返回异常**
8. 【统计】业务调用执行结果成功、失败、超时等均会进入统计模块，**通过健康统计结果来决定熔断器打开或关闭**

### RequestCache 是什么

**缓存在高并发的环境下使用，能够有效地减少服务器的压力**，使用 Hystrix 返回结果缓存，后续请求可以直接调用缓存数据，该缓存就是 RequestCache。Hystrix 通过参数 **requestCache.enabled** 设置是否缓存请求，默认值 true

### Hystrix 的开关降级如何实现

开关降级的参数：

-   **circuitBreaker.forceOpen：**熔断器**强制打开**，该状态下它将拒绝所有请求，默认值 false。
-   **circuitBreaker.forceClosed：**熔断器**强制关闭**，在此状态下，无论错误百分比如何，它都将允许请求，默认值 false。

### Hystrix 的超时降级如何实现

超时降级的参数：

-   **execution.timeout.enabled：**是否启用超时时间，默认值为 true
-   **execution.isolationthread.timeoutInMilliseconds：**超时时间，默认值为 1000
-   **execution.isolation.thread.interruptOnTimeout：**超时后是否允许中断 interrupt，默认为 true
-   **execution.isolation.thread.interruptOnCancel：**关闭 cancel 后是否中断 interrupt，默认为 false

### Hystrix 的熔断降级如何实现

熔断降级的参数：

-   **circuitBreaker.requestVolumeThreshold：触发熔断判断**的**请求次数阈值**，**默认值为 20，**是一段时间内**至少**有 20 个请求才进行熔断降级计算。如一段时间有 19 个请求全部失败，错误率是 100%，但熔断器不会打开，因为总请求数不满足 20
-   **circuitBreaker.sleepWindowInMilliseconds：半开状态试探睡眠时间**，默认值 5000ms，如熔断器开启 5000ms 后，会尝试放过去一部分流量**进行试探**，确定依赖服务是否恢复
-   **circuitBreaker.errorThresholdPersentage：**错误率，默认值 50%，例如一段时间（10s）内有 100 个请求，其中有 54 个超时或者有异常，则错误率是 54%，大于默认值 50%，这种情况下触发熔断器开关

### 线程池隔离与信号量隔离的选型

线程池隔离和信号量隔离是**用于限制调用分布式服务的资源使用，某一个调用的服务出现问题不会影响其他服务调用**，通过 **hystrix.command.default.execution.isolation.strategy** 配置隔离策略，可选 Thread、Semaphore，默认是 Thread

-   **线程隔离（Thread）：**使用该方式**HystrixCommand**将会在**单独的线程上执行**，**并发请求受线程池中线程数量的限制**
-   **信号量隔离（Semaphore）：**使用该方式**HystrixCommand**将会在**调用线程上执行**，开销相对较小，**并发请求受信号量的个数的限制**

# Spring Cloud Netflix 微服务开发指南

## 1. Spring Cloud Netflix 概述

### 1.1 Netflix OSS 简介

Spring Cloud Netflix 是 Spring Cloud 微服务生态中的重要组成部分，整合了 Netflix 开源的一系列组件，为微服务架构提供了完整的解决方案。

**重要说明**：Spring Cloud 2020.0 版本开始，除 Eureka 外的其他 Netflix 组件已被移除，但理解这些组件对于掌握微服务架构原理仍然非常重要。

### 1.2 核心组件架构

| 组件        | 功能           | 状态    | 替代方案                  |
| ----------- | -------------- | ------- | ------------------------- |
| **Eureka**  | 服务注册与发现 | ✅ 保留 | Nacos、Consul             |
| **Ribbon**  | 客户端负载均衡 | ❌ 移除 | Spring Cloud LoadBalancer |
| **Hystrix** | 服务熔断降级   | ❌ 移除 | Resilience4j、Sentinel    |
| **Feign**   | 声明式服务调用 | ❌ 移除 | OpenFeign                 |
| **Zuul**    | API 网关       | ❌ 移除 | Spring Cloud Gateway      |

### 1.3 技术选型建议

**学习价值**：

-   理解微服务架构的核心概念
-   掌握分布式系统的设计原理
-   为使用新一代组件打下基础

**生产环境建议**：

-   服务发现：Eureka → Nacos
-   负载均衡：Ribbon → Spring Cloud LoadBalancer
-   熔断降级：Hystrix → Sentinel/Resilience4j
-   服务调用：Feign → OpenFeign
-   API 网关：Zuul → Spring Cloud Gateway

## 2. Eureka：服务注册与发现

### 2.1 Eureka 架构原理

#### 2.1.1 工作机制

Eureka 采用 AP（可用性 + 分区容错性）架构，通过以下机制实现服务治理：

-   **Eureka Server**：服务注册中心（支持集群部署）
-   **Eureka Client**：服务提供者和消费者
-   **服务注册**：服务启动时向注册中心注册实例信息
-   **服务发现**：消费者从注册中心获取服务列表
-   **心跳续约**：定期发送心跳维持服务状态
-   **故障剔除**：清理失效的服务实例

#### 2.1.2 Eureka 生命周期

#### 2.1.2 Eureka 生命周期

**1. 服务注册（Service Registration）**

```java
// 服务提供者启动时自动注册
@SpringBootApplication
@EnableEurekaClient
public class ProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProviderApplication.class, args);
    }
}
```

**2. 服务续约（Service Renewal）**

-   默认每 30 秒发送一次心跳
-   通过 HTTP 请求通知 Eureka Server 服务状态
-   配置参数：`eureka.instance.lease-renewal-interval-in-seconds=30`

**3. 服务剔除（Service Eviction）**

-   默认每 60 秒执行一次剔除任务
-   剔除 90 秒内未收到心跳的服务实例
-   配置参数：`eureka.instance.lease-expiration-duration-in-seconds=90`

**4. 服务发现（Service Discovery）**

-   客户端定期从 Eureka Server 拉取服务列表
-   默认每 30 秒更新一次本地缓存
-   配置参数：`eureka.client.registry-fetch-interval-seconds=30`

### 2.2 Eureka 核心机制

#### 2.2.1 CAP 理论与 Eureka

**CAP 理论**：分布式系统无法同时满足一致性（Consistency）、可用性（Availability）、分区容错性（Partition Tolerance）。

**Eureka 选择 AP**：

-   **可用性优先**：只要有一个 Eureka 节点存活，就能提供服务
-   **最终一致性**：允许短时间内数据不一致
-   **分区容错**：网络分区时仍能正常工作

#### 2.2.2 自我保护机制

**触发条件**：

```yaml
eureka:
    server:
        enable-self-preservation: true # 开启自我保护
        renewal-percent-threshold: 0.85 # 续约比例阈值
```

**保护机制**：

-   当心跳续约比例低于阈值时启动保护模式
-   保护期间不再剔除任何服务实例
-   宁可保留错误信息，也不盲目删除可能正常的服务

#### 2.2.3 Region 和 Zone

**概念说明**：

-   **Region**：地理位置概念，如北京、上海
-   **Zone**：可用区概念，如机房 A、机房 B

**配置示例**：

```yaml
eureka:
    client:
        region: beijing
        availability-zones:
            beijing: zone1,zone2
    instance:
        metadata-map:
            zone: zone1
```

### 2.3 Eureka 实战配置

#### 2.3.1 Eureka Server 配置

```yaml
server:
    port: 8761

eureka:
    instance:
        hostname: localhost
    client:
        register-with-eureka: false # 不注册自己
        fetch-registry: false # 不拉取注册表
        service-url:
            defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
    server:
        enable-self-preservation: true
        eviction-interval-timer-in-ms: 60000
```

#### 2.3.2 Eureka Client 配置

```yaml
eureka:
    client:
        service-url:
            defaultZone: http://localhost:8761/eureka/
        registry-fetch-interval-seconds: 30
    instance:
        lease-renewal-interval-in-seconds: 30
        lease-expiration-duration-in-seconds: 90
        instance-id: ${spring.application.name}:${server.port}
```

## 3. Ribbon：客户端负载均衡

### 3.1 Ribbon 核心概念

Spring Cloud Ribbon 是基于 Netflix Ribbon 实现的客户端负载均衡工具，提供了多种负载均衡算法，实现服务调用的负载分发。

#### 3.1.1 工作原理

```java
@RestController
public class ConsumerController {

    @Autowired
    @LoadBalanced  // 开启负载均衡
    private RestTemplate restTemplate;

    @GetMapping("/consumer")
    public String consumer() {
        // 使用服务名调用，Ribbon自动负载均衡
        return restTemplate.getForObject("http://provider-service/hello", String.class);
    }
}
```

**执行流程**：

1. `@LoadBalanced` 为 RestTemplate 添加拦截器
2. 拦截器解析服务名，从本地缓存获取服务列表
3. 根据负载均衡算法选择实例
4. 替换服务名为实际 IP:Port 发起调用

### 3.2 负载均衡算法

#### 3.2.1 内置算法对比

| 算法             | 类名                      | 特点               | 适用场景     |
| ---------------- | ------------------------- | ------------------ | ------------ |
| **轮询**         | RoundRobinRule            | 依次调用，默认算法 | 服务性能相近 |
| **随机**         | RandomRule                | 随机选择实例       | 简单场景     |
| **重试**         | RetryRule                 | 轮询+重试机制      | 网络不稳定   |
| **响应时间权重** | WeightedResponseTimeRule  | 响应快的权重高     | 性能差异大   |
| **最少连接**     | BestAvailableRule         | 选择连接数最少的   | 长连接场景   |
| **可用性过滤**   | AvailabilityFilteringRule | 过滤不可用实例     | 高可用要求   |
| **区域感知**     | ZoneAvoidanceRule         | 优先同区域调用     | 跨区域部署   |

#### 3.2.2 自定义负载均衡算法

**实现自定义规则**：

```java
public class CustomRule extends AbstractLoadBalancerRule {

    @Override
    public Server choose(Object key) {
        List<Server> upList = getLoadBalancer().getReachableServers();
        List<Server> allList = getLoadBalancer().getAllServers();

        if (upList.isEmpty()) {
            return null;
        }

        // 自定义选择逻辑
        return customChoose(upList);
    }

    private Server customChoose(List<Server> servers) {
        // 实现自定义算法逻辑
        return servers.get(0);
    }
}
```

**配置自定义规则**：

```java
@Configuration
public class RibbonConfig {

    @Bean
    public IRule ribbonRule() {
        return new CustomRule();
    }
}

@RibbonClient(name = "provider-service", configuration = RibbonConfig.class)
public class RibbonConfiguration {
}
```

### 3.3 Ribbon 高级特性

#### 3.3.1 服务列表过滤机制

**ServerListFilter 过滤器**：

-   **ZoneAffinityServerListFilter**：区域感知过滤
-   **ServerListSubsetFilter**：返回固定大小的服务列表
-   **ZonePreferenceServerListFilter**：区域偏好过滤（默认）

#### 3.3.2 健康检查机制

**IPing 接口实现**：

```java
public class CustomPing implements IPing {

    @Override
    public boolean isAlive(Server server) {
        // 自定义健康检查逻辑
        try {
            URL url = new URL("http://" + server.getHostPort() + "/health");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(1000);
            connection.setReadTimeout(1000);
            return connection.getResponseCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }
}
```

### 3.4 Ribbon vs Feign

| 比较项         | Ribbon                 | Feign        |
| -------------- | ---------------------- | ------------ |
| **调用方式**   | RestTemplate + 服务名  | 接口代理     |
| **编程模型**   | 命令式编程             | 声明式编程   |
| **代码复杂度** | 需手动构建请求         | 接口定义即可 |
| **负载均衡**   | 显式使用 @LoadBalanced | 内置支持     |
| **容错处理**   | 需额外集成             | 集成 Hystrix |

## Zuul

### 什么是 Zuul

Zuul 作为微服务系统的网关组件，是从设备和网站到后端的所有请求的前门。作为边缘服务应用程序，Zuul 旨在实现动态路由，监控，弹性和安全性。Zuul 包含了对请求的路由、过滤、限流三个最主要的功能，Zuul 和 Eureka 进行整合时，Zuul 将自身注册为 Eureka 服务治理下的应用，同时从 Eureka 中获得其他微服务的消息，以后的访问微服务都是通过 Zuul 跳转后获得

-   **路由：**负责将外部请求转发到具体的微服务实例上，是实现外部访问统一入口
-   **过滤器：**负责对请求的处理过程进行干预，可实现请求校验、服务聚合等功能
-   **限流：**添加 spring-cloud-zuul-ratelimit 依赖，进行流量限制

### Zuul 的工作原理 todo

### Zuul 的作用

Zuul 可以通过加载动态过滤机制，从而实现以下各项功能：

-   **验证与安全保障:** 识别面向各类资源的验证要求并拒绝那些与要求不符的请求
-   **审查与监控:** 在边缘位置追踪有意义数据及统计结果
-   **动态路由:** 以动态方式根据需要将请求路由至不同后端集群处
-   **分散压力:** 逐渐增加指向集群的负载流量，从而计算性能水平
-   **负载分配:** 为每一种负载类型分配对应容量，并弃用超出限定值的请求
-   **静态响应处理:** 在边缘位置直接建立部分响应，从而避免其流入内部集群

### Zuul 和 Nginx 的区别

-   相同点：Zuul 和 Nginx 都可以实现负载均衡、反向代理、过滤请求，实现网关的效果
-   不同点:

-   -   Nginx 由 C 语言开发，Zuul 由 Java 开发
    -   负载均衡：Nginx 采用服务器实现负载均衡，Zuul 采用 Ribbon+Eureka 实现本地负载均衡
    -   Nginx 相比 Zuul 功能会更加强大，Nginx 整合一些脚本语言（lua）
    -   Nginx 适合于服务器端负载均衡，Zuul 适合微服务中的网关实现

### Zuul 限流

-   Zuul 的限流算法为**漏桶算法和令牌桶算法**(所有的限流统一算法)
-   限流粒度

-   -   **粗粒度**

-   -   -   网关限流
        -   单个服务

-   -   **细粒度**

-   -   -   **user：**认证用户或者匿名，针对某个用户粒度进行限流
        -   **origin：**客户机的 IP，针对请求客户机的 IP 进行限流
        -   **url：**特定 url，针对请求的 url 粒度进行限流
        -   **serviceId：**特定服务，针对某个服务的 id 粒度进行限流

## Ribbon

### Ribbon 概述

Srping Cloud Ribbon 是基于 Netfix Ribbon 实现的一套客户端负债均衡工具，Ribbon 是 Netflix 发布的开源项目，主要功能是提供**客户端的负载均衡算法**。Ribbon 客户端组件提供一系列完善的配置项，如：连接超时，重试等。简单的说，就是在配置文件中列出 Load Balancer 后面所有的机器，Ribbon 会自动基于某种规则（如简单轮询，随机连接等）去连接这些机器

### Ribbon 常见的负载均衡算法

-   **轮询(RoundRobinRule)**：默认算法
-   **随机(RandomRule）**
-   **轮询重试(RetryRule)**
-   **响应速度决定权重(WeightedResponseTimeRule)**：响应时间越快，权重越大
-   **最优可用(BestAvailableRule)：**选择**并发连接数**较小的 Server 发送请求
-   **可用性过滤规则(AvailabilityFilteringRule)：**先过滤掉不可用的 Server 实例，再选择并发连接最小的实例
-   **区域内可用性能最优(ZoneAvoidanceRule)：**基于**可用性过滤规则(AvailabilityFilteringRule)**的基础，首先判断一个 Zone 的运行性能是否可用，剔除不可用的区域 Zone 的所有 Server，然后再过滤并发连接过多的 Server

### Ribbon 自定义负载均衡算法

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

### Ribbon 和 Feign 的区别

都是调用其他服务的，但方式不同

1. 启动类注解不同：Ribbon 是**@RibbonClient**，Feign 的是**@EnableFeignClients**
2. 服务指定的位置不同：Ribbon 是在**@RibbonClient**注解上**声明负载均衡算法和使用负载均衡的 Service**，Feign 是在定义抽象方法的**接口中**使用@FeignClient 声明
3. 调用方式不同：Ribbon 需要自己构建 http 请求，然后使用 RestTemplate 发送给其他服务，步骤繁琐。Feign 只需要将调用的方法定义成抽象方法即可

### Ribbon 原理

使用 HTTP 通信的框架组件(如：HttpClient)，先从 Ribbon 的**本地 Eureka 注册表缓存**中获取服务提供者的列表，然后进行负载均衡，选出一台机器，接着针对那台机器发送 Http 请求

### Ribbon 的总体流程

针对被**@LoadBalanced**修饰的 RestTemplate，给该 RestTemplate 增加**LoadBalancerInterceptor 拦截器**，从而实现对负载均衡器的调用。负载均衡器通过服务名获取过滤后的服务列表，通过负载均衡算法获取其中某台实例，并进行调用

### Ribbon 如何选择调用哪个实例

1. **获取服务列表：**为了减少服务的延迟，客户端会通过 **eureka.instance.metadata-map.zone** 指定的 zone 对服务列表进行过滤
2. **负载均衡：**通过负载均衡策略从服务列表中获得其中一台，默认是 RoundRobinRule 轮询策略，再对服务端进行调用

### 服务列表的获取过程

1. 服务列表默认是基于服务发现的，在应用启动时 Ribbon 就会从 Eureka 服务器中获取所有注册服务的列表数据，并**保持同步**。也可以通过动态设置的方式在配置文件中进行指定
2. 通过**ServerListFilter**对服务器列表进行过滤

3.  1. **ZoneAffinityServerListFilter：**基于区域感知的方式，实现对服务实例的过滤，仅返回与本身所处区域一直的服务提供者实例列表；
    2. **ServerListSubsetFilter：**该过滤器继承自 ZoneAffinityServerListFilter，在进行区域感知过滤后，仅返回一个固定大小的服务列表。默认将返回 20 个服务实例，可以通过**ribbon.ServerListSubsetFilter.size**进行设置；
    3. **ZonePreferenceServerListFilter：**Eureka 和 Ribbon 时默认的过滤器。实现通过配置或者 Eureka 所属区域来过滤出同区域的服务实例列表。

### Ribbon 如何避免调用失效实例

1. 通过**IPing 机制**检测实例，如果检测到某服务实例不存在或一定时间未响应，则会从服务列表中及时移除
2. 保留 Zone 的统计数据，Ribbon 可以避免可能访问失效的 Zone

## 4. Feign：声明式服务调用

### 4.1 Feign 概述

Feign 是 Netflix 开发的声明式、模板化的 HTTP 客户端，在 Spring Cloud 中集成了 Ribbon 和 Hystrix，提供了声明式的服务调用能力。

**注意**：原生 Feign 已被 OpenFeign 替代，但核心理念相同。

### 4.2 Feign 核心特性

#### 4.2.1 声明式调用

```java
@FeignClient(name = "user-service", fallback = UserServiceFallback.class)
public interface UserService {

    @GetMapping("/users/{id}")
    User getUserById(@PathVariable("id") Long id);

    @PostMapping("/users")
    User createUser(@RequestBody User user);

    @PutMapping("/users/{id}")
    User updateUser(@PathVariable("id") Long id, @RequestBody User user);

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable("id") Long id);
}
```

#### 4.2.2 容错处理

```java
@Component
public class UserServiceFallback implements UserService {

    @Override
    public User getUserById(Long id) {
        return new User(id, "默认用户", "fallback@example.com");
    }

    @Override
    public User createUser(User user) {
        throw new RuntimeException("用户服务暂时不可用");
    }

    // 其他方法的降级实现...
}
```

### 4.3 Feign 配置与优化

#### 4.3.1 全局配置

```yaml
feign:
    hystrix:
        enabled: true
    compression:
        request:
            enabled: true
            mime-types: text/xml,application/xml,application/json
            min-request-size: 2048
        response:
            enabled: true
    client:
        config:
            default:
                connectTimeout: 5000
                readTimeout: 10000
                loggerLevel: basic
```

#### 4.3.2 自定义配置

```java
@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Contract feignContract() {
        return new SpringMvcContract();
    }

    @Bean
    public Retryer feignRetryer() {
        return new Retryer.Default(100, 1000, 3);
    }
}
```

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

配置的文件为 application.yml：

```yaml
feign:
	hystrix:
		enabled: true
```

### Hystrix 简介

-   Hystrix 是一个用于处理分布式系统的延迟和容错的开源库，在分布式系统里，许多依赖不可避免的会调用失败，比如超时、异常等，Hystrix 能够保证在一个依赖出问题的情况下，不会导致整体服务失败，避免级联故障，从而提高分布式系统的稳定性
-   **断路器**本身是一种开关装置，当某个服务单元发送故障之后，通过断路器的**故障监控**(类似熔断保险丝)，向调用方返回一个**符合预期的、可处理的备选响应**(FallBack)，**而不是长时间的等待或抛出调用方无法处理的异常**，这样就保证了**服务调用方的线程不会被长时间、不必要地占用**，从而避免了故障在分布式系统中的蔓延，乃至雪崩

### Hystrix 的提供的功能

资源隔离、限流、熔断、降级、运维监控

### 为什么要使用断路器 Hystrix

在微服务架构中，将业务拆分成一个个的服务，服务与服务之间可以相互调用。为了保证其高可用，单个服务有必须集群部署。由于**网络原因**或者**自身的原因**，服务并不能保证服务的 100%可用，如果单个服务出现问题，调用这个服务就会出现**网络延迟**，此时若有大量的网络请求涌入，会形成**任务累计**，导致服务瘫痪，甚至导致**服务雪崩**。为了解决这个问题出现了短路器，相当于现实生活中的保险丝，用于保障系统的稳定性

### Hystrix 重要概念

-   服务降级：服务器忙，不让客户端等待并立刻返回一个友好提示，**fallback**

-   -   出现降级的情况：

-   -   -   程序运行异常
        -   超时
        -   线程池 / 信号量打满导致服务降级
        -   服务熔断触发服务降级

-   服务熔断：类似保险丝达到最大服务访问后，直接拒绝访问，拉闸限电，然后调用服务降级的方法并返回友好提示
-   服务限流：秒杀高并发等操作，严禁大量的流量直接涌入

### 什么是服务雪崩

-   多个服务之间调用的时候，假设服务 A 调用服务 B 和服务 C，服务 B 和服务 C 又调用其他的服务，这就是所谓的**扇出**。如果扇出的链路上某个服务调用**响应时间过长或者不可用**，对服务 A 的调用就会**占用越来越多的系统资源**，**进而引起系统崩溃**，所谓的**雪崩效应**。
-   对于**高流量的应用**来说，**单一**的后端依赖可能会导致所有服务器上的**所有资源**都在**几秒钟内饱和**。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列、线程和其他系统资源紧张，导致整个系统发生更多的级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。
-   通常当发现一个模块下的某个实例失败后，这时候这个模块依然还会接受流量，然后这个**有问题的模块还调用了其他的模块**，这样就会发生**级联故障**及**服务雪崩**。
-   要避免级联故障，需要有一种**链路中断**的方案：**服务降级**、**服务熔断**

### Hystrix 的总体流程

1. 【入口】通过**HystrixCommand**和**HystrixCollapser**注解修饰的方法，会被**HystrixCommandAspect**进行 AOP 处理
2. 【缓存】如**RequestCache**打开，则判断缓存是否命中
3. 【熔断】判断是否有被开关、熔断降级；若被降级，则走降级逻辑；若未被降级，则走正常逻辑
4. 【隔离】根据配置走**线程池隔离**或**信号量隔离**，任务满则走降级逻辑
5. 【执行】执行任务，若任务执行失败或异常，则进入降级逻辑
6. 【超时】通过**定时器延时任务**检测业务调用执行是否超时，若超时则**取消业务执行**的线程，进入降级逻辑；若未超时，则正常返回
7. 【降级】若进入降级逻辑，根据**getFallback()**方法，返回降级处理的数据，**若未实现该方法，则返回异常**
8. 【统计】业务调用执行结果成功、失败、超时等均会进入统计模块，**通过健康统计结果来决定熔断器打开或关闭**

### RequestCache 是什么

**缓存在高并发的环境下使用，能够有效地减少服务器的压力**，使用 Hystrix 返回结果缓存，后续请求可以直接调用缓存数据，该缓存就是 RequestCache。Hystrix 通过参数 **requestCache.enabled** 设置是否缓存请求，默认值 true

### Hystrix 的开关降级如何实现

开关降级的参数：

-   **circuitBreaker.forceOpen：**熔断器**强制打开**，该状态下它将拒绝所有请求，默认值 false。
-   **circuitBreaker.forceClosed：**熔断器**强制关闭**，在此状态下，无论错误百分比如何，它都将允许请求，默认值 false。

### Hystrix 的超时降级如何实现

超时降级的参数：

-   **execution.timeout.enabled：**是否启用超时时间，默认值为 true
-   **execution.isolationthread.timeoutInMilliseconds：**超时时间，默认值为 1000
-   **execution.isolation.thread.interruptOnTimeout：**超时后是否允许中断 interrupt，默认为 true
-   **execution.isolation.thread.interruptOnCancel：**关闭 cancel 后是否中断 interrupt，默认为 false

### Hystrix 的熔断降级如何实现

熔断降级的参数：

-   **circuitBreaker.requestVolumeThreshold：触发熔断判断**的**请求次数阈值**，**默认值为 20，**是一段时间内**至少**有 20 个请求才进行熔断降级计算。如一段时间有 19 个请求全部失败，错误率是 100%，但熔断器不会打开，因为总请求数不满足 20
-   **circuitBreaker.sleepWindowInMilliseconds：半开状态试探睡眠时间**，默认值 5000ms，如熔断器开启 5000ms 后，会尝试放过去一部分流量**进行试探**，确定依赖服务是否恢复
-   **circuitBreaker.errorThresholdPersentage：**错误率，默认值 50%，例如一段时间（10s）内有 100 个请求，其中有 54 个超时或者有异常，则错误率是 54%，大于默认值 50%，这种情况下触发熔断器开关

### 线程池隔离与信号量隔离的选型

线程池隔离和信号量隔离是**用于限制调用分布式服务的资源使用，某一个调用的服务出现问题不会影响其他服务调用**，通过 **hystrix.command.default.execution.isolation.strategy** 配置隔离策略，可选 Thread、Semaphore，默认是 Thread

**线程隔离（Thread）：**

-   HystrixCommand 在单独线程上执行
-   并发请求受线程池大小限制
-   支持超时中断和异步调用
-   资源开销相对较大

**信号量隔离（Semaphore）：**

-   HystrixCommand 在调用线程上执行
-   并发请求受信号量个数限制
-   无法支持超时中断
-   资源开销相对较小

| 特性         | 线程隔离   | 信号量隔离 |
| ------------ | ---------- | ---------- |
| **线程**     | 独立线程池 | 调用线程   |
| **开销**     | 高         | 低         |
| **异步**     | 支持       | 不支持     |
| **超时**     | 支持中断   | 不支持中断 |
| **适用场景** | 网络调用   | 内存操作   |

## 7. 最佳实践与总结

### 7.1 Netflix 组件迁移指南

#### 7.1.1 组件替换方案

| 原组件      | 替代方案               | 迁移难度 | 迁移建议       |
| ----------- | ---------------------- | -------- | -------------- |
| **Eureka**  | Nacos、Consul          | 简单     | 配置调整即可   |
| **Ribbon**  | LoadBalancer           | 中等     | 注解和配置调整 |
| **Hystrix** | Resilience4j、Sentinel | 困难     | 重写熔断逻辑   |
| **Feign**   | OpenFeign              | 简单     | 依赖替换       |
| **Zuul**    | Spring Cloud Gateway   | 中等     | 过滤器重写     |

#### 7.1.2 迁移策略

**渐进式迁移**：

1. 新项目直接使用新组件
2. 存量项目逐步替换
3. 保持向下兼容性
4. 充分测试验证

**迁移步骤**：

```yaml
# 第一步：添加新组件依赖
# 第二步：配置新组件
# 第三步：代码适配
# 第四步：测试验证
# 第五步：灰度发布
```

### 7.2 架构设计建议

#### 7.2.1 微服务拆分原则

-   **单一职责**：每个服务只负责一个业务领域
-   **数据独立**：避免服务间直接访问数据库
-   **接口标准**：统一的 API 设计规范
-   **版本管理**：支持多版本并存

#### 7.2.2 容错设计模式

```java
// 组合使用多种容错机制
@Service
public class OrderService {

    @Retryable(value = {Exception.class}, maxAttempts = 3)
    @HystrixCommand(fallbackMethod = "fallbackCreateOrder")
    public Order createOrder(Order order) {
        // 业务逻辑
        return orderRepository.save(order);
    }

    public Order fallbackCreateOrder(Order order) {
        // 降级逻辑
        return new Order();
    }
}
```

### 7.3 性能优化建议

#### 7.3.1 Eureka 优化

```yaml
eureka:
    instance:
        lease-renewal-interval-in-seconds: 10 # 心跳间隔
        lease-expiration-duration-in-seconds: 30 # 过期时间
    client:
        registry-fetch-interval-seconds: 10 # 拉取间隔
```

#### 7.3.2 Ribbon 优化

```yaml
ribbon:
    ConnectTimeout: 1000
    ReadTimeout: 3000
    MaxAutoRetries: 1
    MaxAutoRetriesNextServer: 2
```

#### 7.3.3 Hystrix 优化

```yaml
hystrix:
    command:
        default:
            execution:
                isolation:
                    thread:
                        timeoutInMilliseconds: 2000
    threadpool:
        default:
            coreSize: 20
            maxQueueSize: 100
```

### 7.4 Spring Cloud Netflix 总结

#### 7.4.1 历史价值

**奠定微服务基础**：

-   服务注册与发现机制
-   客户端负载均衡模式
-   熔断降级设计模式
-   声明式服务调用理念

**推动生态发展**：

-   完整的微服务解决方案
-   丰富的组件生态
-   标准化的开发模式

#### 7.4.2 现状与未来

**技术演进**：

-   大部分组件已被新一代产品替代
-   核心理念继续影响微服务发展
-   云原生架构成为主流趋势

**学习建议**：

1. **重点理解**架构思想和设计原理
2. **掌握核心**微服务概念和模式
3. **学习新技术**，关注技术演进趋势
4. **实践应用**，将理论转化为实践经验

#### 7.4.3 知识传承

**从 Netflix 到现代微服务**：

```
Netflix OSS → Spring Cloud Alibaba → Cloud Native
     ↓              ↓                    ↓
   基础理念      本土化改进          云原生架构
```

**核心价值**：

-   **设计模式**：服务拆分、容错设计、分布式架构
-   **技术思想**：去中心化、服务自治、弹性扩展
-   **工程实践**：DevOps、微服务治理、监控运维

Spring Cloud Netflix 作为微服务架构的先驱，虽然部分组件已经退出历史舞台，但它所建立的微服务理念和架构模式仍然是现代分布式系统设计的重要基石。通过学习和理解这些组件的设计原理，我们能够更好地掌握微服务架构的精髓，为构建现代化的分布式系统打下坚实的基础。
