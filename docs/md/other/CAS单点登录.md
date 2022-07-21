## CAS服务端搭建

参考官网地址https://github.com/apereo/cas-overlay-template



**CAS服务端必须要开启rest支持**

```xml
<!--开启cas server的rest支持-->
<dependency>
    <groupId>org.apereo.cas</groupId>
    <artifactId>cas-server-support-rest</artifactId>
    <version>${cas.version}</version>
</dependency>
```

