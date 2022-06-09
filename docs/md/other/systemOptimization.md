# 优化方案



## 云端部署

1. 本地项目使用`mvn clean package`打包生产jar文件

2. 将jar包上传服务器，并编写额外的`application.properties`配置文件，用于优化自带的Tomcat

3. 编写`deploy.sh`文件启动对应的项目

   ```shell
   nohup java -Xms2048m -Xmx2048m -XX:NewSize=1024m -XX:MaxNewSize=1024m -jar test.jar
   --spring.config.addition-location=/var/application.properties
   ```



参数说明

+ nohup：以非停止方式运行程序，即便控制台退出了程序也不会停止 
+ java：java命令启动，设置jvm初始和最大内存为2048m，设置jvm中初始新生代和最大新生代大小为1024m，设置成一样的目的是为了减少扩展jvm内存池过程中向操作系统索要内存分配的消耗，
+ –spring.config.addtion-location：指定额外的配置文件地址  



## 配置优化

### Tomcat配置优化

+ 最小线程数
+ 最大线程数
+ 线程等待队列
+ 连接数
+ keepAlive优化



## 分布式扩展

### Nginx负载均衡反向代理

#### OpenResty

1. 在linux安装pcre，openssl，gcc，curl等

   ```shell
   yum install pcre-devel openssl-devel gcc curl
   ```

2. 下载openresty，解压`tar -xvzf openresty**.tar.gz`

3. ` ./configure make && make install `

4. 安装完成，nginx默认安装在 //usr/local/openresty/nginx目录下



#### Nginx静态资源部署

1. 进入nginx根目录下的html下，然后新建resources目录用于存放前端静态资源
2. 设置指向resources目录下的location可以访问对应的html下的静态资源文件



#### Nginx动态请求反向代理

配置一个backend server，用于指向后端不同的server集群，配置内容为server集群的局域网ip，以及轮训的权重值，并且配置一个location，当访问规则命中location任何一个规则的时候则可以进入反向代理规则

```nginx
upstream backend_server{
    server test_server1 weight=1;
    server test_server2 weight=1;
}
location / {
    proxy_pass http://backend_server;
    proxy_set_header Host $http_host;
}
```

最后在 Tomcat 中开启 access log



### Java服务分布式

部署脚本

启动脚本



### 分布式会话

cookie

session

token





## 查询优化

### Redis缓存

缓存脏读处理

反击穿

### 本地缓存

guava cache

缓存清理

### 热点缓存

如何判断热

如何保持热

如何淘汰非热



### Nginx代理缓存

在`nginx.config`中声明

```nginx
#//usr/local/openresty/nginx/cache_temp：把缓存⽂件放在哪⾥
#levels：⽬录设置两层结构⽤来缓存
#keys_zone：指定了⼀个叫tmp_cache的缓存区，并且设置了100m的内存⽤来存储缓存key到⽂件路径的位置
#inactive：缓存⽂件超过7天后⾃动释放淘汰
#max_size：缓存⽂件总⼤⼩超过100g后⾃动释放淘汰

#申明⼀个cache缓存节点的路径
proxy_cache_path //usr/local/openresty/nginx/cache_temp levels=1:2 keys_zone=tmp_cache:100m inactive=7d max_size=100000m
```

在 location 内加入

```nginx
proxy_cache tmp_cache;
proxy_cache_valid 200 206 304 302 10d;
proxy_cache_key $request_uri;
```



### OpenResty

加载 lua 模块，http模块下

```nginx
lua_package_path "/usr/local/openresty/?.lua;;"; #lua 模块
lua_package_cpath "/usr/local/openresty/lualib/?.so;;"; #c模块
```

测试输出

```nginx
location = /lua {
	default_type 'text/plain';
	content_by_lua 'ngx.say("hello,lua!")';
}
```

#### shared dict扩展

1. 修改nginx.conf内，加入shared dictionary的扩展，声明128m的共享字典的访问内存

   ```nginx
   lua_shared_dict my_cache 128m;
   ```

2. 设置location用来做访问shared dict的lua文件

   ```nginx
   location ^~/itemlua/get {
   	default_type 'application/json';
   	content_by_lua_file '/usr/local/openresty/nginx/lua/itemsharedic.lua';
   }
   ```

   

3. 然后使用itemlua url去访问验证



### 静态资源CDN

刷新方式



### 全页面静态化 PhantomJS

爬虫

初始化标记

CDN部署



## 流量削峰

### 秒杀令牌

权限模块

令牌频次控制

### 秒杀大闸

库存联动

### 队列泄洪



## 交易优化（商城秒杀）

### 高效验证

缓存

索引

### 缓存库存

原子操作

一致性

### 库存售罄防击穿

缓存令牌

### 交易异步化

异步

轮询

### RocketMQ事务型消息

生产者

消费者

消息反查

## 防刷限流

### 验证码

### 令牌桶限流

ratelimiter

### 防黄牛防刷

设备指纹





























