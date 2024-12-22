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

- **丰富的应用场景**： 秒杀（即突发流量控制在系统容量可以承受的范围）、消息削峰填谷、实时熔断下游不可用应用等。
- **完备的实时监控**： Sentinel 同时提供实时的监控功能。可以在控制台中看到接入应用的单台机器秒级数据，甚至 500 台以下规模的集群的汇总运行情况
- **广泛的开源生态**： Sentinel 提供开箱即用的与其它开源框架/库的整合模块，例如与 Spring Cloud、Dubbo、gRPC 的整合
- **完善的 SPI 扩展点**： Sentinel 提供简单易用、完善的 SPI 扩展点。可以通过实现扩展点，快速的定制逻辑。例如定制规则管理、适配数据源等。

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

spring.cloud.sentinel.transport.port 端口配置会在应用对应的机器上启动一个 Http Server，该 Server 会与 Sentinel 控制台做交互。比如 Sentinel 控制台添加了1个限流规则，会把规则数据 push 给这个 Http Server 接收，Http Server 再将规则注册到 Sentinel 中

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

- 配置文件打开 sentinel 对 feign 的支持：feign.sentinel.enabled=true
- 加入 openfeign starter 依赖使 sentinel starter 中的自动化配置类生效：

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

Spring Cloud Alibaba Sentinel 支持对 RestTemplate 的服务调用使用 Sentinel 进行保护，在构造 RestTemplate bean的时候需要加上 @SentinelRestTemplate 注解

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

Nacos Discovery 可以将服务自动注册到 Nacos 服务端并且能够动态感知和刷新某个服务实例的服务列表。除此之外，Nacos Discovery 也将服务实例自身的一些元数据信息（host，port, 健康检查URL，主页等内容）注册到 Nacos

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
            "metadata": {

            }
          },
          "service": null,
          "metadata": {

          }
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
    "metadata": {

    },
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

| 配置项              | Key                                            | 默认值                     | 说明                                                         |
| ------------------- | ---------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| 服务端地址          | spring.cloud.nacos.discovery.server-addr       |                            | Nacos Server 启动监听的ip地址和端口                          |
| 服务名              | spring.cloud.nacos.discovery.service           | ${spring.application.name} | 注册的服务名                                                 |
| 权重                | spring.cloud.nacos.discovery.weight            | 1                          | 取值范围 1 到 100，数值越大，权重越大                        |
| 网卡名              | spring.cloud.nacos.discovery.network-interface |                            | 当IP未配置时，注册的IP为此网卡所对应的IP地址，如果此项也未配置，则默认取第一块网卡的地址 |
| 注册的IP地址        | spring.cloud.nacos.discovery.ip                |                            | 优先级最高                                                   |
| 注册的IP地址类型    | spring.cloud.nacos.discovery.ip-type           | IPv4                       | 可以配置IPv4和IPv6两种类型，如果网卡同类型IP地址存在多个，希望制定特定网段地址，可使用`spring.cloud.inetutils.preferred-networks`配置筛选地址 |
| 注册的端口          | spring.cloud.nacos.discovery.port              | -1                         | 默认情况下不用配置，会自动探测                               |
| 命名空间            | spring.cloud.nacos.discovery.namespace         |                            | 常用场景之一是不同环境的注册的区分隔离，例如开发测试环境和生产环境的资源（如配置、服务）隔离等 |
| AccessKey           | spring.cloud.nacos.discovery.access-key        |                            | 当要上阿里云时，阿里云上面的一个云账号名                     |
| SecretKey           | spring.cloud.nacos.discovery.secret-key        |                            | 当要上阿里云时，阿里云上面的一个云账号密码                   |
| Metadata            | spring.cloud.nacos.discovery.metadata          |                            | 使用Map格式配置，用户可以根据自己的需要自定义一些和服务相关的元数据信息 |
| 日志文件名          | spring.cloud.nacos.discovery.log-name          |                            |                                                              |
| 集群                | spring.cloud.nacos.discovery.cluster-name      | DEFAULT                    | Nacos集群名称                                                |
| 接入点              | spring.cloud.nacos.discovery.endpoint          |                            | 地域的某个服务的入口域名，通过此域名可以动态地拿到服务端地址 |
| 是否集成Ribbon      | ribbon.nacos.enabled                           | true                       | 一般都设置成true即可                                         |
| 是否开启Nacos Watch | spring.cloud.nacos.discovery.watch.enabled     | true                       | 可以设置成false来关闭 watch                                  |

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