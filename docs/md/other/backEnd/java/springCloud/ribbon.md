## 1.Ribbon

- Spring Cloud Ribbon 是基于Netflix Ribbon 实现的一套 客户端 负载均衡 的工具，每个客户端可使用不同的均衡策略
- Ribbon 是 Netflix 发布的开源项目，主要功能是提供客户端的负载均衡算法，将 Netflix 的中间层服务连接在一起
- Ribbon 的客户端组件提供一系列完整的配置项，如：连接超时、重试等
- 在配置文件中列出 LoadBalancer (简称LB：负载均衡) 后面所有的集群服务器，Ribbon 会自动的基于某种规则 (如简单轮询，随机连接等等) 去连接服务器，也可自定义的负载均衡算法



## 2.Ribbon的作用

- LB，即负载均衡 (LoadBalancer) ，在微服务或分布式集群中经常用的一种应用。
- 负载均衡简单的说就是将用户的请求平摊的分配到多个服务上，从而达到系统的HA (高可用)
- 常见的负载均衡软件有 Nginx、Lvs 等等
- Dubbo、SpringCloud 中均给我们提供了负载均衡，**SpringCloud 的负载均衡算法可以自定义**。
- 负载均衡简单分类：
  - 集中式LB(在消费者请求到达服务器集群之前，首先通过服务器集群前面运行着负载均衡程序的服务器，由它来决定消费者的这个请求发送到服务器集群中的哪一台服务器上进行处理)
    - 即在服务的提供方和消费方之间使用独立的LB设施，如Nginx：反向代理服务器，由该设施负责把访问请求通过某种策略转发至服务的提供方！
  - 进程式LB(将负载均衡的处理交给用户，即消费者在本地发送请求的时候就已经知道了自己应该将这个请求发送到集群服务器中的那一台具体的服务器进行处理，这是由集成在客户端的负载均衡算法实现的)
    - 将LB逻辑集成到消费方，**消费方**从服务注册中心获知有哪些地址可用(负载均衡的依据)，然后**自己再从这些地址中选出一个合适的服务器**
    - Ribbon 就属于进程内LB，它只是一个类库，集成于消费方进程，消费方通过它来获取到服务提供方的地址



## 3. 集成Ribbon

+ 导入依赖

  ```xml
  <!-- Ribbon -->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-ribbon</artifactId>
      <version>xxx</version>
  </dependency>
  
  <!--eureka-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-eureka</artifactId>
      <version>xxx</version>
  </dependency>
  ```

  

+  编写配置文件， 配置eureka

  ```yml
  #eureka配置
  eureka:
    client:
      register-with-eureka: false #表示不向eureka中注册自己，即表明自己是一个消费者
      service-url:
        defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/,http://eureka7003.com:7003/eureka/
  
  ```

  

+ 启动类

  ```java
  @SpringBootApplication
  @EnableEurekaClient //开启EurekaClient
  public class test {
      public static void main(String[] args) {
          SpringApplication.run(test.class,args);
      }
  }
  ```

  

+ 在 RestTemplate 的 Bean 上添加 @LoadBalanced 即可为其提供负载均衡

  ```java
  @Configuration
  public class ConfigBean {
      @Bean
      @LoadBalanced
      public RestTemplate getRestTemplate(){
          return new RestTemplate();
      }
  }
  ```

  

## 4.切换自带的负载均衡算法

+ 自带的负载均衡算法

  - AvailabilityFilteringRule：先过滤掉已经故障的服务，然后再在剩下的服务中进行轮询
  - RoundRobinRule：轮询策略
  - RandomRule：随机策略
  - WeightedResponseTimeRule：按照权重实现负载均衡
  - RetryRule：首先使用轮询获取服务，如果获取的服务故障了，就会在指定的时间内进行重连

+  在config类中将负载均衡策略对象注入spring容器中即可

  ```java
  @Bean
  public IRule myRule(){
      return new AvailabilityFilteringRule();
      return new RoundRobinRule();
      return new RandomRule();
      return new WeightedResponseTimeRule();
      return new RetryRule();
  }
  
  public interface IRule {
      Server choose(Object var1);
  
      void setLoadBalancer(ILoadBalancer var1);
  
      ILoadBalancer getLoadBalancer();
  }
  ```

  

## 5.自定义负载均衡算法

+ 直接或间接的继承了一个IRule接口的实现类AbstractLoadBalancerRule

+ @RibbonClient中的name属性指定注册中心中需要使用自定义的ribbon策略实现负载均衡的服务者集群

+ @RibbonClient中的configuration属性用于指定自定义的实现Ribbon的负载均衡算法的类

+ 将自定义的类放在spring boot项目的入口的同级目录的文件夹中，那么自定义的负载均衡策略将对注册中心中所有的服务提供者提供的服务集群生效 

  + 自定义负载均衡算法类

    ```java
    @Configuration
    public class myAbstractLoadBalancerRule extends AbstractLoadBalancerRule {
    
    	@Override
    	public Server choose(Object key) {
    		// todo
    	}
    
    	@Override
    	public void initWithNiwsConfig(IClientConfig clientConfig) {
    		// todo
    		
    	}
    }
    
    ```

    

  + 编写config类装配自定义的Ribbon负载均衡算法对象到spring容器中

    ```java
    @Configuration
    public class myRule {
        @Bean
        public IRule myRule(){
            return new myAbstractLoadBalancerRule();
        }
    }
    ```

    

  + 入口程序上加上注解@RibbonClient

    ```java
    @SpringBootApplication
    @EnableEurekaClient
    @RibbonClient(name = "PROVIDER-DEPT",configuration = myRule.class)
    public class test {
        public static void main(String[] args) {
            SpringApplication.run(test.class,args);
        }
    }
    ```

    











