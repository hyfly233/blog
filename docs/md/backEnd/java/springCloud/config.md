## Spring Cloud Config

- spring cloud config 为微服务架构中的微服务提供集中化的外部支持，配置服务器为各个不同微服务应用的所有环节提供了一个中心化的外部配置
- **spring cloud config 分为服务端和客户端两部分**
- **服务端也称为 分布式配置中心，它是一个独立的微服务应用，用来连接配置服务器并为客户端提供获取配置信息，加密，解密信息等访问接口**
- **客户端则是通过 指定的配置中心来管理应用资源，以及与业务相关的配置内容，并在启动的时候从配置中心获取和加载配置信息。配置服务器默认采用git来存储配置信息，这样就有助于对环境配置进行版本管理。并且可用通过git客户端工具来方便的管理和访问配置内容**



## 作用

- 集中式管理配置文件(**分布式配置中心就是将所有的配置文件都进行集中管理，项目需要使用配置文件了就从配置中心中读取即可**)
- 不同环境，不同配置，动态化的配置更新
- 运行期间动态调整配置，服务会向配置中心统一拉取配置自己的信息
- 当配置发生变动时，服务不需要重启，即可感知到配置的变化，并应用新的配置
- 将配置信息以REST接口的形式暴露



## 服务端

+ 导入依赖

  ```java
  <dependencies>
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-config-server</artifactId>
          <version>xxx</version>
      </dependency>
  </dependencies>
  ```

  

+ 配置文件

  ```yml
  spring:
    cloud:
      config:
        server:
          git:
            uri: https://github.com/xxx/xxx.git
  ```

  

+ 启动类

  ```java
  @SpringBootApplication
  @EnableConfigServer
  public class test {
      public static void main(String[] args) {
          SpringApplication.run(test.class,args);
      }
  }
  ```

  

+ 浏览器中测试`localhost:8080/application.yml`



## 客户端

+ 导入依赖

  ```xml
  <dependencies>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
  
      <dependency>
          <groupId>org.springframework.cloud</groupId>
          <artifactId>spring-cloud-starter-config</artifactId>
          <version>xxx</version>
      </dependency>
  
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-actuator</artifactId>
      </dependency>
  </dependencies>
  ```

  

+  配置文件， bootstrap.yml

  ```yml
  spring:
    cloud:
      config:
        uri: http://localhost:8080 # config服务端
        name: config-client # 加载的远程仓库中配置文件的名称，不要后缀
        profile: dev # 配置环境
        label: master # 分支
  ```







