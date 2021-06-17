# Spring Cloud Alibaba

## Spring Cloud Alibaba

Spring Cloud Alibaba 包含了它所使用的所有依赖的版本

```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-alibaba-dependencies</artifactId>
  <version>xxx</version>
</dependency>
```

### Sentinel

以流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性

特征:

-   **丰富的应用场景**： 秒杀（即突发流量控制在系统容量可以承受的范围）、消息削峰填谷、实时熔断下游不可用应用等。
-   **完备的实时监控**： Sentinel 同时提供实时的监控功能。可以在控制台中看到接入应用的单台机器秒级数据，甚至 500 台以下规模的集群的汇总运行情况
-   **广泛的开源生态**： Sentinel 提供开箱即用的与其它开源框架/库的整合模块，例如与 Spring Cloud、Dubbo、gRPC 的整合
-   **完善的 SPI 扩展点**： Sentinel 提供简单易用、完善的 SPI 扩展点。可以通过实现扩展点，快速的定制逻辑。例如定制规则管理、适配数据源等。

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(ServiceApplication.class, args);
    }

}

@RestController
public class TestController {

    /**
    * @SentinelResource 注解用来标识资源是否被限流、降级
	* 注解的属性 'hello' 表示资源名
    */
    @GetMapping(value = "/hello")
    @SentinelResource("hello")
    public String hello() {
        return "Hello Sentinel";
    }

}
```

@SentinelResource 还提供了其它额外的属性如 blockHandler，blockHandlerClass，fallback 用于表示限流或降级的操作

#### Sentinel 控制台

Sentinel 控制台提供一个轻量级的控制台，它提供机器发现、单机资源实时监控、集群资源汇总，以及规则管理的功能，Sentinel 控制台是一个标准的 SpringBoot 应用，以 SpringBoot 的方式运行 jar 包即可

```shell
java -Dserver.port=8080 -Dcsp.sentinel.dashboard.server=localhost:8080 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard.jar
```

#### 配置控制台信息

spring.cloud.sentinel.transport.port 端口配置会在应用对应的机器上启动一个 Http Server，该 Server 会与 Sentinel 控制台做交互。比如 Sentinel 控制台添加了 1 个限流规则，会把规则数据 push 给这个 Http Server 接收，Http Server 再将规则注册到 Sentinel 中

```yaml
spring:
    cloud:
        sentinel:
            transport:
                port: 8719
                dashboard: localhost:8080
```

#### OpenFeign 支持

Sentinel 适配了 [OpenFeign](https://github.com/OpenFeign/feign) 组件。如果想使用，除了引入 sentinel-starter 的依赖外还需要 2 个步骤：

-   配置文件打开 sentinel 对 feign 的支持：feign.sentinel.enabled=true
-   加入 openfeign starter 依赖使 sentinel starter 中的自动化配置类生效：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

FeignClient 的使用示例：

```java
@FeignClient(name = "service-provider",
             fallback = EchoServiceFallback.class,
             configuration = FeignConfiguration.class)
public interface EchoService {
    @GetMapping(value = "/echo/{str}")
    String echo(@PathVariable("str") String str);
}

class FeignConfiguration {
    @Bean
    public EchoServiceFallback echoServiceFallback() {
        return new EchoServiceFallback();
    }
}

class EchoServiceFallback implements EchoService {
    @Override
    public String echo(@PathVariable("str") String str) {
        return "echo fallback";
    }
}
```

#### RestTemplate 支持

Spring Cloud Alibaba Sentinel 支持对 RestTemplate 的服务调用使用 Sentinel 进行保护，在构造 RestTemplate bean 的时候需要加上 @SentinelRestTemplate 注解

```java
@Bean
@SentinelRestTemplate(blockHandler = "handleException",
                      blockHandlerClass = ExceptionUtil.class)
public RestTemplate restTemplate() {
    return new RestTemplate();
}


public class ExceptionUtil {
    public static ClientHttpResponse handleException(HttpRequest request, byte[] body, ClientHttpRequestExecution execution, BlockException exception) {
        ...
    }
}
```

@SentinelRestTemplate 注解的属性支持限流(blockHandler, blockHandlerClass)和降级(fallback, fallbackClass)的处理。

其中 blockHandler 或 fallback 属性对应的方法必须是对应 blockHandlerClass 或 fallbackClass 属性中的静态方法。

该方法的参数跟返回值跟 org.springframework.http.client.ClientHttpRequestInterceptor#interceptor 方法一致，其中参数多出了一个 BlockException 参数用于获取 Sentinel 捕获的异常

#### Spring Cloud Gateway 支持

依赖

```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

### Nacos

Nacos 是一个 Alibaba 开源的、易于构建云原生应用的动态服务发现、配置管理和服务管理平台

使用 Spring Cloud Alibaba Nacos Discovery，可基于 Spring Cloud 的编程模型快速接入 Nacos 服务注册功能

#### 服务注册/发现 Nacos Discovery

Nacos Discovery 可以将服务自动注册到 Nacos 服务端并且能够动态感知和刷新某个服务实例的服务列表。除此之外，Nacos Discovery 也将服务实例自身的一些元数据信息（host，port, 健康检查 URL，主页等内容）注册到 Nacos

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

##### Nacos Server 启动

docker 部署 Nacos Server，127.0.0.1:8848（默认账号名/密码为 nacos/nacos）

##### Provider 应用

**application.properties** 中配置 Nacos Server 地址

```ini
server.port=8081
spring.application.name=nacos-provider
spring.cloud.nacos.discovery=true
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
management.endpoints.web.exposure.include=*
```

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosProviderDemoApplication.class, args);
    }

    @RestController
    public class EchoController {
        @GetMapping(value = "/echo/{string}")
        public String echo(@PathVariable String string) {
            return "Hello Nacos Discovery " + string;
        }
    }
}
```

##### Consumer 应用

**application.properties** 中配置 Nacos Server 地址

```ini
server.port=8082
spring.application.name=nacos-consumer
spring.cloud.nacos.discovery=true
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
management.endpoints.web.exposure.include=*
```

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApp {

    @RestController
    public class NacosController {

        @Autowired
        private LoadBalancerClient loadBalancerClient;
        @Autowired
        private RestTemplate restTemplate;

        @Value("${spring.application.name}")
        private String appName;

        @GetMapping("/echo/app-name")
        public String echoAppName(){
            //使用 LoadBalanceClient 和 RestTemplate 结合的方式来访问
            ServiceInstance serviceInstance = loadBalancerClient.choose("nacos-provider");
            String url = String.format("http://%s:%s/echo/%s",serviceInstance.getHost(),serviceInstance.getPort(),appName);
            System.out.println("request url:"+url);
            return restTemplate.getForObject(url,String.class);
        }
    }

    //实例化 RestTemplate 实例
    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApp.class,args);
    }
}
```

##### Nacos Discovery 对外暴露的 Endpoint

Nacos Discovery 内部提供了一个 Endpoint, 对应的 endpoint id 为 nacos-discovery。

Endpoint 暴露的 json 中包含了两种属性:

1. subscribe: 显示了当前服务有哪些服务订阅者
2. NacosDiscoveryProperties: 当前应用 Nacos 的基础配置信息

```json
{
    "subscribe": [
        {
            "jsonFromServer": "",
            "name": "nacos-provider",
            "clusters": "",
            "cacheMillis": 10000,
            "hosts": [
                {
                    "instanceId": "30.5.124.156#8081#DEFAULT#nacos-provider",
                    "ip": "30.5.124.156",
                    "port": 8081,
                    "weight": 1.0,
                    "healthy": true,
                    "enabled": true,
                    "cluster": {
                        "serviceName": null,
                        "name": null,
                        "healthChecker": {
                            "type": "TCP"
                        },
                        "defaultPort": 80,
                        "defaultCheckPort": 80,
                        "useIPPort4Check": true,
                        "metadata": {}
                    },
                    "service": null,
                    "metadata": {}
                }
            ],
            "lastRefTime": 1541755293119,
            "checksum": "e5a699c9201f5328241c178e804657e11541755293119",
            "allIPs": false,
            "key": "nacos-provider",
            "valid": true
        }
    ],
    "NacosDiscoveryProperties": {
        "serverAddr": "127.0.0.1:8848",
        "endpoint": "",
        "namespace": "",
        "logName": "",
        "service": "nacos-provider",
        "weight": 1.0,
        "clusterName": "DEFAULT",
        "metadata": {},
        "registerEnabled": true,
        "ip": "30.5.124.201",
        "networkInterface": "",
        "port": 8082,
        "secure": false,
        "accessKey": "",
        "secretKey": ""
    }
}
```

##### 开启权重路由

###### Ribbon

**application.properties**

```ini
[service_name].ribbon.NFLoadBalancerRuleClassName=com.alibaba.cloud.nacos.ribbon.NacosRule
```

##### Nacos Discovery Starter 更多的配置项信息

| 配置项               | Key                                            | 默认值                     | 说明                                                                                                                                                |
| -------------------- | ---------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 服务端地址           | spring.cloud.nacos.discovery.server-addr       |                            | Nacos Server 启动监听的 ip 地址和端口                                                                                                               |
| 服务名               | spring.cloud.nacos.discovery.service           | ${spring.application.name} | 注册的服务名                                                                                                                                        |
| 权重                 | spring.cloud.nacos.discovery.weight            | 1                          | 取值范围 1 到 100，数值越大，权重越大                                                                                                               |
| 网卡名               | spring.cloud.nacos.discovery.network-interface |                            | 当 IP 未配置时，注册的 IP 为此网卡所对应的 IP 地址，如果此项也未配置，则默认取第一块网卡的地址                                                      |
| 注册的 IP 地址       | spring.cloud.nacos.discovery.ip                |                            | 优先级最高                                                                                                                                          |
| 注册的 IP 地址类型   | spring.cloud.nacos.discovery.ip-type           | IPv4                       | 可以配置 IPv4 和 IPv6 两种类型，如果网卡同类型 IP 地址存在多个，希望制定特定网段地址，可使用`spring.cloud.inetutils.preferred-networks`配置筛选地址 |
| 注册的端口           | spring.cloud.nacos.discovery.port              | -1                         | 默认情况下不用配置，会自动探测                                                                                                                      |
| 命名空间             | spring.cloud.nacos.discovery.namespace         |                            | 常用场景之一是不同环境的注册的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等                                                      |
| AccessKey            | spring.cloud.nacos.discovery.access-key        |                            | 当要上阿里云时，阿里云上面的一个云账号名                                                                                                            |
| SecretKey            | spring.cloud.nacos.discovery.secret-key        |                            | 当要上阿里云时，阿里云上面的一个云账号密码                                                                                                          |
| Metadata             | spring.cloud.nacos.discovery.metadata          |                            | 使用 Map 格式配置，用户可以根据自己的需要自定义一些和服务相关的元数据信息                                                                           |
| 日志文件名           | spring.cloud.nacos.discovery.log-name          |                            |                                                                                                                                                     |
| 集群                 | spring.cloud.nacos.discovery.cluster-name      | DEFAULT                    | Nacos 集群名称                                                                                                                                      |
| 接入点               | spring.cloud.nacos.discovery.endpoint          |                            | 地域的某个服务的入口域名，通过此域名可以动态地拿到服务端地址                                                                                        |
| 是否集成 Ribbon      | ribbon.nacos.enabled                           | true                       | 一般都设置成 true 即可                                                                                                                              |
| 是否开启 Nacos Watch | spring.cloud.nacos.discovery.watch.enabled     | true                       | 可以设置成 false 来关闭 watch                                                                                                                       |

#### Nacos Config

Spring Cloud Alibaba Nacos Config，可基于 Spring Cloud 的编程模型快速接入 Nacos 配置管理功能

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

todo

### RocketMQ

Apache RocketMQ 基于 Java 的高性能、高吞吐量的分布式消息和流计算平台

### Dubbo

Apache Dubbo 是一款高性能 Java RPC 框架

### Seata

高性能微服务分布式事务解决方案

# Spring Cloud Alibaba 微服务开发指南

## 1. Spring Cloud Alibaba 概述

### 1.1 什么是 Spring Cloud Alibaba

Spring Cloud Alibaba 是阿里巴巴开源的微服务组件集合，致力于提供微服务开发的一站式解决方案。它包含了开发分布式应用微服务的必需组件，方便开发者通过 Spring Cloud 编程模型轻松使用这些组件来开发分布式应用服务。

### 1.2 核心组件概览

| 组件         | 功能                   | 优势                       |
| ------------ | ---------------------- | -------------------------- |
| **Nacos**    | 服务注册发现、配置管理 | 动态配置服务、服务健康监测 |
| **Sentinel** | 流量控制、熔断降级     | 实时监控、规则动态配置     |
| **RocketMQ** | 消息驱动能力           | 高性能、低延迟、高可靠     |
| **Dubbo**    | RPC 通信               | 高性能、多协议支持         |
| **Seata**    | 分布式事务             | 高性能、零侵入             |

### 1.3 版本管理与依赖

Spring Cloud Alibaba 采用统一的版本管理机制，确保各组件之间的兼容性：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2022.0.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 2. Sentinel：流量防护与熔断降级

## 2. Sentinel：流量防护与熔断降级

### 2.1 Sentinel 核心概念

Sentinel 是阿里巴巴开源的流量控制组件，以流量作为切入点，从**流量控制**、**熔断降级**、**系统负载保护**等多个维度保护服务的稳定性。

**核心特性：**

-   **丰富的应用场景**：秒杀流量控制、消息削峰填谷、实时熔断下游不可用应用
-   **完备的实时监控**：提供秒级数据监控，支持 500 台以下规模集群的汇总运行情况
-   **广泛的开源生态**：与 Spring Cloud、Dubbo、gRPC 等框架无缝整合
-   **完善的 SPI 扩展点**：支持规则管理、数据源适配等定制化需求

### 2.2 快速开始

#### 2.2.1 添加依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

#### 2.2.2 基础使用示例

```java
@SpringBootApplication
public class SentinelApplication {
    public static void main(String[] args) {
        SpringApplication.run(SentinelApplication.class, args);
    }
}

@RestController
public class TestController {

    /**
     * @SentinelResource 注解用来标识资源是否被限流、降级
     * value: 资源名称
     * blockHandler: 被限流时调用的方法
     * fallback: 发生异常时调用的降级方法
     */
    @GetMapping(value = "/hello")
    @SentinelResource(value = "hello",
                      blockHandler = "handleBlock",
                      fallback = "handleFallback")
    public String hello() {
        return "Hello Sentinel";
    }

    // 限流处理方法
    public String handleBlock(BlockException ex) {
        return "系统繁忙，请稍后再试";
    }

    // 异常降级方法
    public String handleFallback(Throwable throwable) {
        return "系统异常，请稍后再试";
    }
}
```

### 2.3 Sentinel 控制台配置

### 2.3 Sentinel 控制台配置

#### 2.3.1 控制台启动

Sentinel 控制台是一个标准的 Spring Boot 应用，提供机器发现、资源实时监控、集群资源汇总和规则管理功能。

**启动命令：**

```bash
java -Dserver.port=8080 \
     -Dcsp.sentinel.dashboard.server=localhost:8080 \
     -Dproject.name=sentinel-dashboard \
     -jar sentinel-dashboard.jar
```

#### 2.3.2 应用接入控制台

**配置文件 (application.yml)：**

```yaml
spring:
    cloud:
        sentinel:
            transport:
                port: 8719 # 与控制台通信端口
                dashboard: localhost:8080 # 控制台地址
            # 饥饿加载，应用启动时即连接控制台
            eager: true
```

**控制台交互原理：**

-   `transport.port` 在应用机器上启动 HTTP Server
-   控制台通过此端口推送规则给应用
-   应用接收规则并注册到 Sentinel 中

### 2.4 微服务整合方案

#### 2.4.1 OpenFeign 整合

**1. 开启 Feign 支持**

```yaml
feign:
    sentinel:
        enabled: true
```

**2. 添加依赖**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

**3. 实现 Feign 客户端**

```java
@FeignClient(name = "service-provider",
             fallback = EchoServiceFallback.class,
             configuration = FeignConfiguration.class)
public interface EchoService {
    @GetMapping(value = "/echo/{str}")
    String echo(@PathVariable("str") String str);
}

@Configuration
public class FeignConfiguration {
    @Bean
    public EchoServiceFallback echoServiceFallback() {
        return new EchoServiceFallback();
    }
}

@Component
public class EchoServiceFallback implements EchoService {
    @Override
    public String echo(@PathVariable("str") String str) {
        return "echo fallback: " + str;
    }
}
```

#### 2.4.2 RestTemplate 整合

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    @SentinelRestTemplate(
        blockHandler = "handleException",
        blockHandlerClass = ExceptionUtil.class,
        fallback = "fallback",
        fallbackClass = ExceptionUtil.class
    )
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

public class ExceptionUtil {

    // 限流处理
    public static ClientHttpResponse handleException(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution,
            BlockException exception) {
        return new SentinelClientHttpResponse("限流了");
    }

    // 异常降级
    public static ClientHttpResponse fallback(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution,
            Throwable exception) {
        return new SentinelClientHttpResponse("降级了");
    }
}
```

#### 2.4.3 Spring Cloud Gateway 整合

#### 2.4.3 Spring Cloud Gateway 整合

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>

<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-sentinel-gateway</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

**配置示例：**

```yaml
spring:
    cloud:
        gateway:
            routes:
                - id: user-service
                  uri: lb://user-service
                  predicates:
                      - Path=/user/**
                  filters:
                      - name: RequestRateLimiter
                        args:
                            redis-rate-limiter.replenishRate: 1
                            redis-rate-limiter.burstCapacity: 3
        sentinel:
            scg:
                fallback:
                    mode: response
                    response-status: 429
                    response-body: "限流了"
```

## 3. Nacos：服务注册发现与配置管理

### 3.1 Nacos 概述

Nacos（Dynamic Naming and Configuration Service）是阿里巴巴开源的动态服务发现、配置管理和服务管理平台。它更易于构建云原生应用，提供了以下核心功能：

-   **服务发现和服务健康监测**
-   **动态配置服务**
-   **动态 DNS 服务**
-   **服务及其元数据管理**

### 3.2 服务注册与发现

#### 3.2.1 快速开始

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### 3.2.2 Nacos Server 部署

**Docker 启动：**

```bash
docker run -d \
  --name nacos-server \
  -p 8848:8848 \
  -e MODE=standalone \
  nacos/nacos-server:latest
```

**访问控制台：**

-   地址：http://127.0.0.1:8848/nacos
-   默认账号/密码：nacos/nacos

#### 3.2.3 Provider 服务配置

#### 3.2.3 Provider 服务配置

**application.yml 配置：**

```yaml
server:
    port: 8081

spring:
    application:
        name: nacos-provider
    cloud:
        nacos:
            discovery:
                server-addr: 127.0.0.1:8848
                enabled: true
                namespace: public
                group: DEFAULT_GROUP

management:
    endpoints:
        web:
            exposure:
                include: "*"
```

**代码实现：**

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosProviderApplication.class, args);
    }

    @RestController
    public static class EchoController {

        @GetMapping(value = "/echo/{string}")
        public String echo(@PathVariable String string) {
            return "Hello Nacos Discovery " + string;
        }

        @GetMapping("/health")
        public String health() {
            return "Provider is healthy";
        }
    }
}
```

#### 3.2.4 Consumer 服务配置

**application.yml 配置：**

```yaml
server:
    port: 8082

spring:
    application:
        name: nacos-consumer
    cloud:
        nacos:
            discovery:
                server-addr: 127.0.0.1:8848
                enabled: true

management:
    endpoints:
        web:
            exposure:
                include: "*"
```

**代码实现：**

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApplication {

    @RestController
    public static class NacosController {

        @Autowired
        private LoadBalancerClient loadBalancerClient;

        @Autowired
        private RestTemplate restTemplate;

        @Value("${spring.application.name}")
        private String appName;

        @GetMapping("/echo/app-name")
        public String echoAppName() {
            // 使用 LoadBalanceClient 和 RestTemplate 结合访问
            ServiceInstance serviceInstance = loadBalancerClient.choose("nacos-provider");
            String url = String.format("http://%s:%s/echo/%s",
                serviceInstance.getHost(),
                serviceInstance.getPort(),
                appName);
            System.out.println("Request URL: " + url);
            return restTemplate.getForObject(url, String.class);
        }

        @GetMapping("/services")
        public List<String> services() {
            return discoveryClient.getServices();
        }
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApplication.class, args);
    }
}
```

### 3.3 配置中心功能

### 3.3 配置中心功能

#### 3.3.1 Nacos Config 快速开始

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

**bootstrap.yml 配置：**

```yaml
spring:
    application:
        name: nacos-config-example
    cloud:
        nacos:
            config:
                server-addr: 127.0.0.1:8848
                file-extension: yml
                namespace: public
                group: DEFAULT_GROUP
                # 共享配置
                shared-configs:
                    - data-id: common.yml
                      group: DEFAULT_GROUP
                      refresh: true
                # 扩展配置
                extension-configs:
                    - data-id: redis.yml
                      group: DEFAULT_GROUP
                      refresh: true
```

#### 3.3.2 动态配置示例

**配置类：**

```java
@Component
@RefreshScope
public class ConfigProperties {

    @Value("${user.name:defaultName}")
    private String userName;

    @Value("${user.age:0}")
    private Integer userAge;

    // getter and setter
}

@RestController
@RefreshScope
public class ConfigController {

    @Value("${user.name:defaultName}")
    private String userName;

    @Autowired
    private ConfigProperties configProperties;

    @GetMapping("/config")
    public Map<String, Object> getConfig() {
        Map<String, Object> result = new HashMap<>();
        result.put("userName", userName);
        result.put("userAge", configProperties.getUserAge());
        return result;
    }
}
```

### 3.4 监控端点

Nacos Discovery 提供了 `nacos-discovery` 端点，用于监控服务发现状态：

**端点信息包含：**

1. **subscribe**：当前服务的订阅者信息
2. **NacosDiscoveryProperties**：Nacos 基础配置信息

**端点响应示例：**

**端点响应示例：**

```json
{
    "subscribe": [
        {
            "name": "nacos-provider",
            "clusters": "",
            "cacheMillis": 10000,
            "hosts": [
                {
                    "instanceId": "192.168.1.100#8081#DEFAULT#nacos-provider",
                    "ip": "192.168.1.100",
                    "port": 8081,
                    "weight": 1.0,
                    "healthy": true,
                    "enabled": true,
                    "metadata": {}
                }
            ],
            "checksum": "hash-value",
            "valid": true
        }
    ],
    "NacosDiscoveryProperties": {
        "serverAddr": "127.0.0.1:8848",
        "namespace": "",
        "service": "nacos-provider",
        "weight": 1.0,
        "clusterName": "DEFAULT",
        "registerEnabled": true,
        "ip": "192.168.1.100",
        "port": 8081
    }
}
```

### 3.5 负载均衡配置

#### 3.5.1 权重路由配置

**使用 Ribbon：**

```properties
# 启用 Nacos 权重规则
nacos-provider.ribbon.NFLoadBalancerRuleClassName=com.alibaba.cloud.nacos.ribbon.NacosRule
```

#### 3.5.2 Discovery 配置参数

| 配置项      | Key                                            | 默认值                     | 说明              |
| ----------- | ---------------------------------------------- | -------------------------- | ----------------- |
| 服务端地址  | spring.cloud.nacos.discovery.server-addr       |                            | Nacos Server 地址 |
| 服务名      | spring.cloud.nacos.discovery.service           | ${spring.application.name} | 注册的服务名      |
| 权重        | spring.cloud.nacos.discovery.weight            | 1                          | 权重值(1-100)     |
| 网卡名      | spring.cloud.nacos.discovery.network-interface |                            | 指定网卡          |
| 注册 IP     | spring.cloud.nacos.discovery.ip                |                            | 优先级最高        |
| IP 类型     | spring.cloud.nacos.discovery.ip-type           | IPv4                       | IPv4/IPv6         |
| 端口        | spring.cloud.nacos.discovery.port              | -1                         | 自动探测          |
| 命名空间    | spring.cloud.nacos.discovery.namespace         |                            | 环境隔离          |
| 集群名      | spring.cloud.nacos.discovery.cluster-name      | DEFAULT                    | Nacos 集群名      |
| 元数据      | spring.cloud.nacos.discovery.metadata          |                            | 自定义元数据      |
| Ribbon 集成 | ribbon.nacos.enabled                           | true                       | 是否集成 Ribbon   |
| Watch 功能  | spring.cloud.nacos.discovery.watch.enabled     | true                       | 是否开启监听      |

## 4. RocketMQ：高性能消息中间件

### 4.1 RocketMQ 概述

Apache RocketMQ 是阿里巴巴开源的分布式消息中间件，基于 Java 开发，具有**高性能**、**高吞吐量**、**低延迟**的特点，广泛应用于电商、金融、物流等领域。

**核心特性：**

-   **高性能**：单机支持万级 QPS
-   **高可用**：支持多 Master 多 Slave 架构
-   **消息顺序**：支持全局顺序和分区顺序
-   **事务消息**：支持分布式事务
-   **延时消息**：支持任意时间的延时消息

### 4.2 Spring Cloud 整合

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-stream-rocketmq</artifactId>
</dependency>
```

**配置文件：**

```yaml
spring:
    cloud:
        stream:
            rocketmq:
                binder:
                    name-server: 127.0.0.1:9876
                bindings:
                    output:
                        producer:
                            group: producer-group
                            sync: true
                    input:
                        consumer:
                            group: consumer-group
                            subscription: test-topic
            bindings:
                output:
                    destination: test-topic
                input:
                    destination: test-topic
                    group: test-group
```

**生产者示例：**

```java
@RestController
public class ProducerController {

    @Autowired
    private Source source;

    @GetMapping("/send")
    public String send(@RequestParam String message) {
        source.output().send(MessageBuilder.withPayload(message).build());
        return "Message sent: " + message;
    }
}
```

**消费者示例：**

```java
@Component
@EnableBinding(Sink.class)
public class MessageConsumer {

    @StreamListener(Sink.INPUT)
    public void receive(String message) {
        System.out.println("Received: " + message);
    }
}
```

## 5. Dubbo：高性能 RPC 框架

### 5.1 Dubbo 概述

Apache Dubbo 是阿里巴巴开源的高性能 Java RPC 框架，提供了面向接口的远程方法调用、智能容错和负载均衡，以及服务自动注册和发现。

### 5.2 Spring Cloud 整合

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-dubbo</artifactId>
</dependency>
```

**配置示例：**

```yaml
dubbo:
    application:
        name: dubbo-provider
    protocol:
        name: dubbo
        port: -1
    registry:
        address: nacos://127.0.0.1:8848
```

## 6. Seata：分布式事务解决方案

### 6.1 Seata 概述

Seata 是阿里巴巴开源的分布式事务解决方案，致力于在微服务架构下提供高性能和简单易用的分布式事务服务。

**事务模式：**

-   **AT 模式**：基于支持本地 ACID 事务的关系型数据库
-   **TCC 模式**：不依赖于底层数据资源的事务支持
-   **SAGA 模式**：长事务解决方案
-   **XA 模式**：基于 XA 协议的强一致性分布式事务

### 6.2 快速开始

**添加依赖：**

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

**配置示例：**

```yaml
seata:
    application-id: seata-example
    tx-service-group: my_test_tx_group
    service:
        vgroup-mapping:
            my_test_tx_group: default
        grouplist:
            default: 127.0.0.1:8091
```

**使用示例：**

```java
@Service
public class BusinessService {

    @GlobalTransactional
    public void purchase(String userId, String commodityCode, int orderCount) {
        // 业务逻辑
        orderService.create(userId, commodityCode, orderCount);
        accountService.debit(userId, orderCount * 100);
    }
}
```

## 7. 最佳实践与总结

### 7.1 技术选型建议

**Spring Cloud Alibaba 适用场景：**

-   电商、金融等对性能要求较高的场景
-   需要完整的中文技术支持和文档
-   希望使用经过阿里巴巴大规模实践验证的组件
-   对云原生和容器化部署有需求

### 7.2 架构设计原则

1. **服务拆分**：按业务领域进行合理拆分
2. **数据一致性**：选择合适的分布式事务方案
3. **容错设计**：完善的限流、熔断、降级机制
4. **监控告警**：完整的链路追踪和监控体系

### 7.3 Spring Cloud Alibaba 优势

-   **生产验证**：经过阿里巴巴双 11 等大促验证
-   **性能优异**：相比 Netflix 组件有更好的性能表现
-   **中文生态**：完善的中文文档和社区支持
-   **持续更新**：活跃的开源社区和版本迭代

Spring Cloud Alibaba 为微服务开发提供了完整的解决方案，在性能、稳定性和易用性方面都有出色表现，是构建企业级微服务应用的优秀选择。
