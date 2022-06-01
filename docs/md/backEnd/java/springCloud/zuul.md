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
        defaultZone: http://eureka7001.com:7001/eureka/
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






## 隐藏服务提供者

配置文件

```yml
zuul:
  prefix: /api
  routes:
    greeting-service:
      path: /greeting/**
      url: forward:/greeting
    foos-service:
      path: /foos/**
      url: http://localhost:8081/spring-zuul-foos-resource/foos
```





## 自定义 ZuulFilter

例如

```java
@Component
public class ResponseLogFilter extends ZuulFilter {

    private Logger logger = LoggerFactory.getLogger(ResponseLogFilter.class);

    /**
     * FilterConstants filterType
     * pre：可以在请求被路由之前调用
     * route：在路由请求时候被调用
     * post：在route和error过滤器之后被调用
     * error：处理请求时发生错误时被调用
     *
     * @return String
     */
    @Override
    public String filterType() {
        return FilterConstants.POST_TYPE;
    }

    /**
     * 决定执行顺序 数字越小，越先执行
     *
     * @return int
     */
    @Override
    public int filterOrder() {
        return 0;
    }

    /**
     * 是否启用该 filter
     *
     * @return boolean
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    /**
     * filter 的执行逻辑
     *
     * @return Object
     * @throws ZuulException e
     */
    @Override
    public Object run() throws ZuulException {

        RequestContext context = RequestContext.getCurrentContext();
        try (final InputStream responseDataStream = context.getResponseDataStream()) {

            if (responseDataStream == null) {
                logger.info("BODY: {}", "");
                return null;
            }

            String responseData = CharStreams.toString(new InputStreamReader(responseDataStream, StandardCharsets.UTF_8));
            logger.info("BODY: {}", responseData);

            context.setResponseBody(responseData);
        } catch (Exception e) {
            throw new ZuulException(e, HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
        }

        return null;
    }
}
```





