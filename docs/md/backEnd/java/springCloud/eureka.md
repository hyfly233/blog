## 1.什么是 Eureka

- Eureka是Netflix的有个子模块，也是核心模块之一；
- Eureka是**基于REST的服务**，用于定位服务，以实现服务发现和故障转移，服务注册与发现对于微服务来说是非常重要的，有了服务注册与发现，只需要使用服务的标识符，就可以访问到服务，而不需要修改服务调用的配置文件了，**功能类似于Dubbo的注册中心，比如Zookeeper**。



## 2.Eureka原理理解

### 1.Eureka基本的架构

- Springcloud 封装了Netflix公司开发的Eureka模块来实现服务注册与发现 (对比Zookeeper)
- **Eureka采用了C-S的架构设计，Eureka Server作为服务注册功能的服务器，它是服务注册中心**
- 而系统中的其他微服务，使用Eureka的客户端连接到Eureka Server并维持心跳连接，这样系统的维护人员就可以通过Eureka Server来监控系统中各个微服务是否正常运行，Spring cloud 的一些其他模块 (比如Zuul) 就可以通过Eureka Server来发现系统中的其他微服务，并执行相关的逻辑
  - 在dubbo+zookeeper中我们可以使用dubbo-admin来实现可视化的监控，在spring cloud中我们可以使用Eureka Server实现监控功能
- Eureka 包含两个组件：Eureka Server 和 Eureka Client
- Eureka Server 提供服务注册，各个节点启动后，会在Eureka Server中进行注册，这样Eureka Server中的服务注册表中将会储存所有可用服务节点的信息，服务节点的信息可以在界面中直观的看到
- Eureka Client 是一个Java客户端，用于简化Eureka Server的交互，客户端同时也具备一个内置的，使用轮询负载算法的负载均衡器。在应用启动后，将会向Eureka Server发送**心跳 (默认周期为30秒)** 。如果Eureka Server在多个心跳周期内没有接收到某个节点的心跳，Eureka Server将会从服务注册表中**把这个服务节点移除掉 (默认周期为90s)**
- Eureka 三大角色
  - Eureka Server：提供服务的注册与发现
  - Service Provider：服务生产方，将自身服务注册到Eureka中，从而使服务消费方能够找到
  - Service Consumer：服务消费方，从Eureka中获取注册服务列表，从而获取可以进行消费的服务



## 3.代码实现Eureka注册中心

- 只需要导入依赖，配置参数，并在spring boot项目的入口程序上添加注解@EnableEurekaServer即可实现Eureka注册中心

- 导入依赖

  ```xml
  <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-eureka-server</artifactId>
     <version>xxx</version>
  </dependency>
  ```

  

- 编写配置文件

  ```yml
  server:
   port: 8080
  #eureka配置
  eureka:
   instance:
     hostname: localhost:8080 #eureka server运行的主机名，监控页面的url为http://localhost:8080/
   client:
     register-with-eureka: false
     #表示是否向eureka注册中心注册自己，设为false也表明这个是eureka server
     fetch-registry: false #fetch-registry为false表示这个微服务为eureka注册中心
     service-url:
       defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
       #微服务提供者向注册中心的注册服务的地址，它有默认的url，为"http://localhost:8080/eureka/"
  
  ```

  

-  启动类

   ```java
  @SpringBootApplication
  @EnableEurekaServer //开启EurekaServer
  public class test {
      public static void main(String[] args) {
          SpringApplication.run(test.class,args);
      }
  }
   ```

  

## 4.服务注册

- 注册中心是被动的接收服务提供者需要注册的服务

- 在服务提供者中导入eureka的依赖：Spring Cloud Starter Eureka

  ```xml
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-eureka</artifactId>
      <version>xxx</version>
  </dependency>
  ```

  

- 配置文件中配置注册中心的地址 

  ```yml
  server:
  	port: 8090
  
  eureka:
      client:
          instance:
          	instance-id: provider-dept-8090
          service-url:
          	defaultZone: http://localhost:8080/eureka/
  ```

  

-  启动类

  ```java
  @SpringBootApplication
  @EnableEurekaClient //开启EurekaClient
  public class test {
      public static void main(String[] args) {
          SpringApplication.run(test.class,args);
      }
  }
  ```



## 5.信息配置

+ 服务提供者导入actuator的依赖

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

  

+ 配置文件

  ```yml
  info:
      app.name: provider-dept-8090 #actuator 配置
      company.name: com.hyfly
  ```

  

+ 查看

  ```http
  http://localhost:8090/actuator/info
  ```

  

## 6.自我保护机制

+ 现象：将注册到eureka注册中心中的某一个微服务重启的时候，再次刷新eureka监控页面，页面上多出一行红字
+ **EureKa自我保护机制：好死不如赖活着**
+ 某时刻某一个微服务不可用，eureka不会立即清理，依旧会对该微服务的信息进行保存
+ 默认情况下，当eureka server在一定时间内没有收到实例的心跳，便会把该实例从注册表中删除（默认是90秒），但是，如果短时间内丢失大量的实例心跳，便会触发eureka server的自我保护机制
+ 该保护机制的目的是避免网络连接故障，在发生网络故障时，微服务和注册中心之间无法正常通信，但服务本身是健康的，不应该注销该服务，如果eureka因网络故障而把微服务误删了，那即使网络恢复了，该微服务也不会重新注册到eureka server了，因为只有在微服务启动的时候才会发起注册请求，后面只会发送心跳和服务列表请求，这样的话，该实例虽然是运行着，但永远不会被其它服务所感知
+ Eureka server在短时间内丢失过多的客户端心跳时，会进入自我保护模式，该模式下，eureka会保护注册表中的信息，不在注销任何微服务，当网络故障恢复后，eureka会自动退出保护模式。自我保护模式可以让集群更加健壮
+ 在开发测试阶段，需要频繁地重启发布，如果触发了保护机制，则旧的服务实例没有被删除，这时请求有可能跑到旧的实例中，而该实例已经关闭了，这就导致请求错误，影响开发测试。所以可以把自我保护模式关闭，在eureka server配置文件中加上：`eureka.server.enable-self-preservation=false`





## 7.服务发现 DiscoveryClient

+ 在服务提供者的 Controller 中编写

  ```java
  @GetMapping("/dept/discovery")
  public Object discovery(){
      List<ServiceInstance> instanceList = discoveryClient.getInstances("PROVIDER-DEPT");
      for (ServiceInstance instance: instanceList) {
          System.out.println(
                  instance.getHost()+"\t"+
                  instance.getUri()+"\t"+
                  instance.getPort()+"\t"+
                  instance.getServiceId()+"\t"+
                  instance.getMetadata()+"\t"+
                  instance.getScheme()+"\t"+
                  instance.getInstanceId()
          );
      }
  
      return instanceList;
  }
  ```

  

## 8.集群

+ 单个 yml

  ```yml
  eureka:
    client:
      fetch-registry: false
      register-with-eureka: false
      service-url:
        defaultZone: http://localhost:23300/eureka/,http://localhost:23301/eureka/,http://localhost:23302/eureka/
  
  ---
  spring:
    application:
      name: eureka-23300
    config:
      activate:
        on-profile: 23300
  eureka:
    instance:
      hostname: eureka-23300
  server:
    port: 23300
  
  ---
  
  spring:
    application:
      name: car-eureka-23301
    config:
      activate:
        on-profile: 23301
  eureka:
    instance:
      hostname: eureka-23301
  server:
    port: 23301
  
  ---
  
  spring:
    application:
      name: car-eureka-23302
    config:
      activate:
        on-profile: 23302
  eureka:
    instance:
      hostname: eureka-23302
  server:
    port: 23302
  
  ```

  

+ 在 idea 启动配置中分别设置`Active profiles`对应的端点`23300、23301、23302`



