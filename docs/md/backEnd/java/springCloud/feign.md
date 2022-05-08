## 1.Feign简介

- **Feign是声明式Web Service客户端**，集成了Ribbon和Eureka，可以使用Ribbon提供负载均衡



## 2.Feign的作用

- Feign 在 Ribbon + RestTemplate 基础上做了进一步的封装，由 Feign 来帮助定义和实现依赖服务接口的定义，在Feign的实现下，只需要创建一个接口并使用注解的方式来配置它 (类似标注Mapper)，即可完成对服务提供方的接口绑定，简化了开发
- Feign默认集成了Ribbon，利用Ribbon维护服务列表信息，并且通过轮询实现了客户端的负载均衡



## 3.Feign的使用

+ 启动类

  ```java
  @SpringBootApplication
  @EnableEurekaClient
  @EnableFeignClients(basePackages = "com.xxx.xxx")
  public class test {
     public static void main(String[] args) {
         SpringApplication.run(test.class,args);
     }
  }
  ```

  

+ 导入依赖

  ```java
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-feign</artifactId>
      <version>xxx</version>
  </dependency>
  ```

  

+ 编写 Fegin 接口

  ```java
  @Service
  @Component
  @FeignClient(value = "服务提供者注册到 Eureka 的名称")
  public interface DeptClientService {
  
      @GetMapping("/dept/queryById/{id}")/
      Dept queryById(@PathVariable("id") Long id);
  
      @GetMapping("/dept/queryList")
      List<Dept> queryAll();
  }
  ```

