## zuul

- Zull包含了对请求的**路由(用来跳转的)和过滤**两个最主要功能
- 路由功能负责将外部请求转发到具体的微服务实例上，是实现外部访问统一入口的基础
- 过滤器功能则负责对请求的处理过程进行干预，是实现请求校验，服务聚合等功能的基础
- Zuul 和 Eureka进行整合，将Zuul自身注册为Eureka服务治理下的应用，同时从Eureka中获得其他服务的消息，也即**访问微服务都是通过Zuul跳转后获得**
- 注意：Zuul 服务最终还是会注册进 Eureka
- 提供：代理、路由、过滤 三大功能



## 基本使用

+ 依赖

  ```xml
  <dependencies>
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-starter-zuul</artifactId>
          <version>xxx</version>
      </dependency>
  
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-starter-eureka</artifactId>
          <version>xxx</version>
      </dependency>
  </dependencies>
  ```

  

+ 配置文件

  ```yml
  server:
    port: 9002
  
  spring:
    application:
      name: springcould-zuul-getway
  
  eureka:
    client:
      service-url:
        defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/
    instance:
      instance-id: springcould-zuul-9002
      prefer-ip-address: true #将描述信息对应的超链接设置为IP格式，而不是主机名称格式
  
  info:
    app.name: zuul-getway
    company.name: com.xxx
  ```

  

+ 启动类

  ```java
  @SpringBootApplication
  @EnableZuulProxy    //开启zuul服务代理
  public class ZuulApplication {
     public static void main(String[] args) {
         SpringApplication.run(ZuulApplication.class,args);
     }
  }
  ```

  

+ 隐藏服务提供者

  ```yml
  zuul:
    routes:
      xxx.serviceId: springcould-provider-dept #微服务名称，key
      xxx.path: /yyy/** #代替微服务名称的path变量，即只要是"主机名称:端口号/yyy/"下面的所有请求，都去注册中心的服务springcould-provider-dept中处理
    ignored-services: zzz #设置不能再在zuul中使用这个微服务进行消费
    prefix: /xyz  #设置这个zuul模块配置的路由的访问前缀
  ```





未完待续 ...