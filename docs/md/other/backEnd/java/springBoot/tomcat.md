





`spring-configuration-metadata.json`





## 默认内嵌Tomcat配置

+ server.tomcat.accept-count：等待队列长度，默认100
+ server.tomcat.max-connections：最大可被连接数，默认1000
+ server.tomcat.max-threads：最大工作线程数，默认200
+ server.tomcat.min-spare-threads：最小工作线程数，默认10
+ server.tomcat.keepAliveTimeOut：超时时间，默认10000
+ server.tomcat.maxKeepAliveRequests：请求超时拒绝处理时间，默认100





## 定制内嵌Tomcat

+ 设置 keepAliveTimeOut

+ 设置 maxKeepAliveRequests

+ 使用 WebServerFactoryCustomizer - ConfigurableServletWebServerFactory 定制化内置Tomcat

  ```java
  import org.apache.coyote.http11.Http11NioProtocol;
  import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
  import org.springframework.boot.web.server.WebServerFactoryCustomizer;
  import org.springframework.stereotype.Component;
  
  /**
   * 当Spring容器中没有TomcatEmbeddedServletContainerFactory时，会把此bean加载到容器中
   */
  @Component
  public class WebServerConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
      @Override
      public void customize(TomcatServletWebServerFactory factory) {
          factory.addConnectorCustomizers(connector -> {
              Http11NioProtocol protocol = (Http11NioProtocol) connector.getProtocolHandler();
              // keepAliveTimeout设置30s没有请求自动断开，设置为0，表示不使用keep-alive
              protocol.setKeepAliveTimeout(30000);
              // maxKeepAliveRequests客户端发送超过10000则自动断开连接，设置为0，表示不使用keep-alive
              protocol.setMaxKeepAliveRequests(10000);
          });
      }
  }
  ```

  















## 外挂Tomcat