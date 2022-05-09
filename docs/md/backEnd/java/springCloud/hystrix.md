# Hystrix

## 服务雪崩

+ 多个微服务之间调用的时候，假设 微服务A 调用 微服务B 和 微服务C，微服务B 和 微服务C 又调用 其他的微服务，如果链路上某个微服务的调用响应时间过长，或者不可用，对 微服务A 的调用进入等待就会占用越来越多的系统资源，进而引起系统崩溃，所谓的“雪崩效应”
+ 对于高流量的应用来说，单一的后端依赖可能会导致所有服务器上的所有资源都在几十秒内饱和。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列，线程和其他系统资源紧张，导致整个系统发生更多的级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统
+ 最简单的做法就是做服务备份，服务备份大多数情况下是指当这个服务崩溃之后，系统自动切换服务备份顶上，服务备份一般不会提供服务，而是向客户端返回一些提示信息，提示当前的这个服务崩溃了，而不是让用户等待，一直占用服务器的资源；当然备份也可以是将当前这个服务拷贝一份，当这个服务奔溃的时候切换它继续提供正常的服务，但是这样成本就增加了，因为按照这种备份，原来的服务器资源需要翻倍



## Hystrix

- Hystrix 是一个应用于处理分布式系统的延迟和容错的开源库，在分布式系统里，许多依赖不可避免的会调用失败，比如超时，异常等，**Hystrix能够保证在一个依赖出问题的情况下，不会导致整个体系服务失败，避免级联故障，以提高分布式系统的弹性**
- 断路器/Hystrix 本身是一种开关装置，当某个服务单元发生故障之后，通过断路器的故障监控，**向调用方返回一个服务预期的，可处理的备选响应 (FallBack) ，而不是长时间的等待或者抛出调用方法无法处理的异常**，这样就可以保证了服务调用方的线程不会被长时间，不必要的占用，从而避免了故障在分布式系统中的蔓延，乃至雪崩



## Hystrix的作用

- 服务降级
- 服务熔断
- 服务限流
- 接近实时的监控





## 服务熔断

- **熔断机制是对应服务雪崩效应的一种微服务链路保护机制**
- 服务熔断是应对雪崩效应的一种微服务链路保护机制。当调用链路的某个微服务不可用或者响应时间太长时，会进行服务熔断，不占用该节点微服务的调用，快速返回错误的响应信息；当检测到该节点微服务调用响应正常后，恢复调用链路。
- 当扇出链路的某个微服务不可用或者响应时间太长时，会进行服务的降级，进而熔断该节点微服务的调用，快速返回错误的响应信息，检测到该节点微服务调用响应正常后恢复调用链路。**在SpringCloud框架里熔断机制通过Hystrix实现**。Hystrix会监控微服务间调用的状况，**当失败的调用到一定阀值缺省是5秒内20次调用失败，就会启动熔断机制**，在spring cloud中只需要使用一个熔断机制的注解是：**@HystrixCommand** 即可
- 服务熔断解决如下问题：
  - 当所依赖的对象不稳定时，能够起到快速失败的目的
  - 快速失败后，能够根据一定的算法动态试探所依赖对象是否恢复



+ 导入依赖

  ```xml
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-hystrix</artifactId>
      <version>xxx</version>
  </dependency>
  ```

  

+ 配置文件

  ```yml
  eureka:
      client:
        service-url:
          defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/
  ```

  

+ 启动类

  ```java
  @SpringBootApplication
  @EnableEurekaClient
  @EnableCircuitBreaker // 开启熔断器
  public class test {
      public static void main(String[] args) {
          SpringApplication.run(test.class,args);
      }
  }
  ```

  

+ 配置类

```JAVA
@HystrixCommand(fallbackMethod = "hystrixQueryDeptById")
@GetMapping("/dept/queryById/{deptno}")
public Dept queryDeptById(@PathVariable("deptno") long id){
    Dept dept = deptService.queryDeptById(id);
    if (dept==null){	
    	//注意：这个异常抛出必须有，否则hystrix不能发现这个方法执行的时候出现了异常
        throw new RuntimeException("");
    }
    return dept;
}

public Dept hystrixQueryDeptById(@PathVariable("deptno") long id){
    return new Dept()
            .setDeptno(id)
            .setDname("抱歉，未查询到您指定的id对应的部门信息")
            .setDbSource("MySQL数据库中没有匹配的数据库存有查询的信息");
}
```



## 服务降级

- 服务降级是指当服务器压力剧增的情况下，根据实际业务情况及流量，对一些服务和页面有策略的不处理或换种简单的方式处理，从而释放服务器资源以保证核心业务正常运作或高效运作。**就是尽可能的把系统资源让给优先级高的服务**
- 资源有限，而请求是无限的。如果在并发高峰期，不做服务降级处理，肯定会影响整体服务的性能，严重的话可能会导致宕机某些重要的服务不可用。**所以，一般在高峰期，为了保证核心功能服务的可用性，都要对某些服务降级处理**
- 当整个微服务架构整体的负载超出了预设的上限阈值或即将到来的流量预计将会超过预设的阈值时，为了保证重要或基本的服务能正常运行，**可以将一些 不重要 或 不紧急 的服务或任务进行服务的 延迟使用 或 暂停使用**
- 降级的方式可以根据业务来，可以延迟服务，比如延迟给用户增加积分，只是放到一个缓存中，等服务平稳之后再执行 ；或者在粒度范围内关闭服务，比如关闭相关文章的推荐
- **当某一时间内 服务A 的访问量暴增，而 B 和 C 的访问量较少，为了缓解A服务的压力，这时候需要B和C暂时关闭一些服务功能，去承担A的部分服务，从而为A分担压力，这就叫做服务降级**
- 服务降级需要考虑的问题
  - 那些服务是核心服务，哪些服务是非核心服务
  - 那些服务可以支持降级，那些服务不能支持降级，降级策略是什么
  - 除服务降级之外是否存在更复杂的业务放通场景，策略是什么？
- 自动降级分类
  - 超时降级：主要配置好超时时间和超时重试次数和机制，并使用异步机制探测回复情况
  - 失败次数降级：主要是一些不稳定的api，当失败调用次数达到一定阀值自动降级，同样要使用异步机制探测回复情况
  - 故障降级：比如要调用的远程服务挂掉了（网络故障、DNS故障、http服务返回错误的状态码、rpc服务抛出异常），则可以直接降级。降级后的处理方案有：默认值（比如库存服务挂了，返回默认现货）、兜底数据（比如广告挂了，返回提前准备好的一些静态页面）、缓存（之前暂存的一些缓存数据）
  - 限流降级：秒杀或者抢购一些限购商品时，此时可能会因为访问量太大而导致系统崩溃，此时会使用限流来进行限制访问量，当达到限流阀值，后续请求会被降级；降级后的处理方案可以是：排队页面（将用户导流到排队页面等一会重试）、无货（直接告知用户没货了）、错误页（如活动太火爆了，稍后重试）



+  在 service 同级目录下创建一个实现FallbackFactory接口的实现类

  ```JAVA
  @Component
  public class DeptClientServiceFallbackFactory implements FallbackFactory {  //实现服务降级的类需要实现接口FallbackFactory，即失败回调工厂
      @Override
      public DeptClientService create(Throwable throwable) {
          return new DeptClientService() {
              @Override
              public Dept queryById(Long id) {
                  return new Dept()
                          .setDeptno(id)
                          .setDname("没有找到"+id+"对应的数据，当前该服务已经出现了服务降级，该服务已经关闭，请等待服务重启之后再试")
                          .setDb_source("没有对应的数据库");
              }
              
              @Override
              public List<Dept> queryAll() {
                  return null;
              }
  
              @Override
              public boolean addDept(Dept dept) {
                  return false;
              }
          };
      }
  }
  ```

  

+ 在实现 **服务熔断** 的时候为了指定某一个方法熔断之后顶替它的方法，使用注解@HystrixCommand，并传入了参数fallbackMethod指定顶替方法名称

+ 实现 **服务降级** 的时候需要配合Feign的注解@FeignClient和它的参数fallbackFactory，这个参数用于传入FallbackFactory 接口的实现类

  ```java
  @Service
  @Component
  @FeignClient(value = "SPRINGCOULD-PROVIDER-DEPT",fallbackFactory = DeptClientServiceFallbackFactory.class)
  public interface DeptClientService {
  
      @GetMapping("/dept/queryById/{id}")
      Dept queryById(@PathVariable("id") Long id);
      
      @GetMapping("/dept/queryList")
      List<Dept> queryAll();
  
      @PostMapping("/dept/add")
      boolean addDept(Dept dept);
  }
  ```

  

+ 使用Feign作为负载均衡的消费者的中的配置文件中开启Hystrix的降级服务

  ```java
  server:
    port: 9001
  
  eureka:
    client:
      register-with-eureka: false #表示不向eureka中注册自己，即表明自己是一个消费者
      service-url:
        defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/ #配置可以连接的eureka注册中心的url
  
  feign:
    hystrix:
      enabled: true	#只需要设置该属性就可以开启该消费者model的hystrix服务降级
  ```





## 对比服务熔断和服务降级

- 服务熔断（服务端）

  是发生在消费者已经向服务提供者提供的服务的API发送了请求数据，并在一连串的微服务调用中出现了某一个服务崩溃的时候，它防止了大量用户访问该崩溃服务造成的服务雪崩

- 服务降级（客户端）

  是发生在服务提供者为了满足核心功能的正常供应，将非核心功能提供的服务暂时关闭，而消费者此时又对非核心服务进行访问的时候，它防止因为当前非核心业务服务被停止供应而出现客户端异常的情况，并且在消费者模块中就对服务端的请求进行拦截，并返回定义好的服务降级的提示信息

  - 触发的条件：使用的Feign不能关联到注册中心中指定的服务名称的服务，从而就会去调用fallbackFactory 指定的失败回调工厂返回的 DeptClientService 对象中对应的方法返回服务降级提示信息
  - 保证了服务器关闭之后服务将不再被调用，消费者还是可以正常的发送对应服务的请求，只是这个请求不会到达服务器，在消费者模块中自己的就进行了处理，并返回服务降级信息
  - 对于服务降级，它返回的是一个缺省值，整个系统提供的服务水平下降了，但是整个系统的核心业务还能正常提供，非核心业务也能正常的返回提示信息





## Hystrix Dashboard

- Hystrix提供了对于微服务调用状态的监控信息，需要结合spring-boot-actuator模块一起使用
- Hystrix-dashboard是一款**针对Hystrix进行实时监控的工具**，通过Hystrix Dashboard我们可以在直观地**看到各Hystrix Command实时的请求响应时间, 请求成功率等数据**，可以帮助快速发现系统中存在的问题
- 注意：从**Hystrix Dashboard**是**专门用来监控使用了Hystrix的注解@Hystrix Command的方法的实时情况的**，那么使用Hystrix Dashboard**进行服务者某些服务的实时监控的**前提为我们监控的这个服务者向外提供的API使用了Hystrix的**服务熔断机制**，即方法上面使用了注解@Hystrix Command，并且定义了一个备份的替代方法，那么这个方法被消费者微服务请求的情况才能够通过Hystrix Dashboard看到其实时的情况



+ 导入依赖

  ```java
  <dependencies>
      <!--Hystrix:Dashboard依赖-->
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-starter-hystrix-dashboard</artifactId>
          <version>xxx</version>
      </dependency>
  
      <!--eureka完善对应服务的监控信息依赖-->
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-actuator</artifactId>
      </dependency>
  </dependencies>
  ```

  

+ 配置文件

  ```yml
  server:
    port: 10000
  
  hystrix:
    dashboard:
      proxy-stream-allow-list: "*" # 开放所有端点
  ```

  

+ 启动类

  ```java
  @SpringBootApplication
  @EnableHystrixDashboard
  public class test {
      public static void main(String[] args) {
          SpringApplication.run(test.class,args);
      }
  }
  ```

  

+ 浏览器中输入` http://localhost:10000/hystrix `进入 Dashboard 的监控首页 





未完待续 ...



















