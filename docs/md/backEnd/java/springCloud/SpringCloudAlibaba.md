## Spring Cloud Alibaba



- `Nacos`：阿里巴巴开源产品，一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
- `Sentinel`：面向分布式服务架构的轻量级流量控制产品，把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。
- `RocketMQ`：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
- `Dubbo`：Apache Dubbo™ 是一款高性能 Java RPC 框架，用于实现服务通信。
- `Seata`：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。



**Nacos Discoveny--服务治理、Sentinel--服务容错、Gateway--服务网关、Sleuth--链路追踪、Rocketmq--消息驱动、SMS--短信服务、Nacos Config--服务配置、Seata--分布式事务** 



- `Alibaba Cloud ACM`：一款在分布式架构环境中对应用配置进行集中管理和推送的应用配置中心产品。
- `Alibaba Cloud OSS`：阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。您可以在任何应用、任何时间、任何地点存储和访问任意类型的数据。
- `Alibaba Cloud SchedulerX`：阿里中间件团队开发的一款分布式任务调度产品，提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。
- `Alibaba Cloud SMS`：覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。



- `Spring Cloud Netflix Eureka`：服务注册中心。
- `Spring Cloud Zookeeper`：服务注册中心。
- `Spring Cloud Consul`：服务注册和配置管理中心。
- `Spring Cloud Netflix Ribbon`：客户端负载均衡。
- `Spring Cloud Netflix Hystrix`：服务容错保护。
- `Spring Cloud Netflix Feign`：声明式服务调用。
- `Spring Cloud OpenFeign(可替代 Feign)`：OpenFeign 是 Spring Cloud 在 Feign 的基础上支持了 Spring MVC 的注解，如 @RequesMapping等等。OpenFeign 的 @FeignClient 可以解析 SpringMVC 的 @RequestMapping 注解下的接口，并通过动态代理的方式产生实现类，实现类中做负载均衡并调用其他服务。
- `Spring Cloud Netflix Zuul`：API 网关服务，过滤、安全、监控、限流、路由。
- `Spring Cloud Gateway(可替代 Zuul)`：Spring Cloud Gateway 是 Spring 官方基于 Spring 5.0，Spring Boot 2.0 和 Project Reactor 等技术开发的网关，Spring Cloud Gateway 旨在为微服务架构提供一种简单而有效的统一的 API 路由管理方式。Spring Cloud Gateway 作为 Spring Cloud 生态系中的网关，目标是替代 Netflix Zuul，其不仅提供统一的路由方式，并且基于 Filter 链的方式提供了网关基本的功能，例如：安全，监控/埋点，和限流等。
- `Spring Cloud Security`：安全认证。
- `Spring Cloud Config`：分布式配置中心。配置管理工具，支持使用 Git 存储配置内容，支持应用配置的外部化存储，支持客户端配置信息刷新、加解密配置内容等。
- `Spring Cloud Bus`：事件、消息总线，用于在集群（例如，配置变化事件）中传播状态变化，可与 Spring Cloud Config 联合实现热部署。
- `Spring Cloud Stream`：消息驱动微服务。
- `Spring Cloud Sleuth`：分布式服务跟踪。
- `Spring Cloud Alibaba Nacos`：阿里巴巴开源产品，一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
- `Spring Cloud Alibaba Sentinel`：面向分布式服务架构的轻量级流量控制产品，把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。
- `Spring Cloud Alibaba RocketMQ`：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
- `Spring Cloud Alibaba Dubbo`：Apache Dubbo™ 是一款高性能 Java RPC 框架，用于实现服务通信。
- `Spring Cloud Alibaba Seata`：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。





- 【配置中心】Distributed/versioned configuration
- 【注册中心】Service registration and discovery
- 【API 网关】Routing
- 【服务调用】Service-to-service calls
- 【负载均衡】Load balancing
- 【服务容错】Circuit Breakers
- 【分布式消息】Distributed messaging



- API 网关：[Spring Cloud Gateway](https://link.segmentfault.com/?enc=B9avhSzB4V%2FcHhszy%2FE1yA%3D%3D.%2FQeeey4cuQwvh%2BR3kQ9rN9UvYc%2BL3sIiQEfBDDjwY32OtTOWk05Y7JUkPhAyqCwemJOydZhuOwNF0lPsqiQf0g%3D%3D)
- 配置中心：[Spring Cloud Config](https://link.segmentfault.com/?enc=IE%2F62mGz1CwzzBG%2FeN9iCw%3D%3D.y4HqJqgW3t6zel8RSCCL%2B7zjrRpLbFgMIWPes4hhNdZvVxtfcG7odDVOb5f%2Bo2c3AIlXUuvb5H4eLxdmbi3OgA%3D%3D)、[Spring Cloud Vault](https://link.segmentfault.com/?enc=GC7ZKgV62TJ5%2Bv4P8lnZXA%3D%3D.m7HNdssOm7jWz217KMHdC34pXU9AoRNkhGd%2BMScQwnsmlPCtebaVyaJ5vzQw4xpLXfopoASSkzgpAgT90IeqSQ%3D%3D)
- 链路追踪：[Spring Cloud Sleuth](https://link.segmentfault.com/?enc=qhDi5ToeWWG8uX7RK1Y1rA%3D%3D.ak0S0UgbJd7adb%2F1311us2t4%2Fnc1PtI4XMVEVh%2FwkLVBuOPV0Fsl%2FjeihhLydoSaKgX4S5AVyyBPzpUubm44IA%3D%3D)
- 消息驱动：[Spring Cloud Stream](https://link.segmentfault.com/?enc=QiKsAL5rQ%2FWYiBKEQMzvXQ%3D%3D.HDUsPaGcViO4LNYXqDVO01Qp7YpviJvjMDIOz62jyh72HtWvGUUsX6fr6nyICUyVJGQBCMkMLv2HR3fBirUpew%3D%3D)
- 事件总线：[Spring Cloud Bus](https://link.segmentfault.com/?enc=CJtusmPs%2BJmw%2FJ3Zn3LA2w%3D%3D.WP7GKqUb3LVHascu%2Fpta2ENz3TPZRPSVALlxHQR2Z6ih9%2BS%2FLmUZihPTnwvKnnXnJ30bGS4%2FHs36N36HwK81AA%3D%3D)
- 服务调用：[Spring Cloud OpenFeign](https://link.segmentfault.com/?enc=S2HD74AjXMB%2FpexCdd2TZA%3D%3D.VDjEsp9j30Ogs7f7pzwyvg6mVNMxuzxzI%2BLlna04YWH%2BOwbPOyfE8uuyHoEm%2F5mXa2ZgsDXKB%2BKyfyl%2FZroPkg%3D%3D)
- 负载均衡：[Spring Cloud Load Balancer](https://link.segmentfault.com/?enc=n8X7UEl3CYrg7EFLWdBNJA%3D%3D.IrgUeqUTfFRdGYWBBL9qekOuZ2HombYg5Rg2UelbYyILBPawRunfsuTqL7P0nJrzxf6bLuDBbFfRRQNHipEsXVV0uq0PVAkgWMhSR9A5SKWXXfDcaRG4SsPaV4Vk0cUp)