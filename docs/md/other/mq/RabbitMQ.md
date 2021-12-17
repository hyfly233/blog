## 消息中间件

是 软件 和 软件 之间发送消息的 软件

### 作用

+ 异步处理
+ 系统解耦
+ 流量削峰和流控
+ 消息广播
+ 消息收集
+ 最终一致性

## AMQP 协议

![Snipaste_2021-12-12_23-33-07](C:\Users\hyfly\Pictures\blog\Snipaste_2021-12-12_23-33-07.png)

RabbitMQ 的规范，规定了 RabbitMQ 对外的接口

+ Broker：接收和分发消息的应用
+ Virtual Host：虚拟 Broker，将多个单元隔离开
+ Connection：publisher / consumer 和 broker 之间的 TCP 连接
+ Channel：Connection 内部建立的逻辑连接，通常每个线程创建单独的 channel
+ Routing Key：路由键，指示消息的路由转发
+ Exchange：交换机，分拨中心（最核心）
+ Queue：消息队列，consumer 取走消息
+ Binding：Exchange 和 Queue 之间的虚拟连接

## Exchange

+ Exchange 是 AMQP 协议和 RabbitMQ 的核心组件
+ Exchange 的功能是根据 绑定关系 和 路由键 为消息提供路由，将消息转发至相应的队列
+ 4种类型：Direct、Topic、Fanout、Headers

### Direct Exchange

Message 中的 Routing Key 如果和 Binding Key 一致，Direct Exchange 则将 Message 发到对应的 queue 中

### Fanout Exchange

每个发到 Fanout Exchange 的 message 都会分发到所有绑定的 Queue 中，相当于广播

### Topit Exchange

根据 Routing Key 及通配规则，Topit Exchange 将消息分发到目标 Queue 中

全匹配：与 Direct 类似

Binding Key：

+ `#`：匹配任意个数的 word
+ `*`：匹配一个单词



## 管理工具

在 Rabbitmq 目录 sbin 中，cmd 输入 rabbitmq-plugins enable rabbitmq_management 

访问 ` [127.0.0.1](http://127.0.0.1:15672/) ` 账号密码 guest/guest



## 命令行

list、purge、delete、-- help

### 状态查看

`rabbitmqctl status`：查看状态

`rabbitmqtcl list_bindings`：查看绑定

`rabbitmqtcl list_channels：查看channel

`rabbitmqtcl list_connections：查看connection

`rabbitmqtcl list_consumers：查看consumers

`rabbitmqtcl list_exchanges：查看exchanges

`rabbitmqtcl list_queues：查看队列

`rabbitmqtcl delete_queues：删除队列

`rabbitmqtcl purge_queues：清空队列

`rabbitmqtcl add_user：新建用户

`rabbitmqtcl change_password：修改用户密码

`rabbitmqtcl delete_user：删除用户

`rabbitmqtcl list_user：查看用户

`rabbitmqtcl set_user_tags：设置用户角色

### 应用启停

`rabbitmqtcl start_app`：启动应用

`rabbitmqtcl stop_app`：关闭应用，保留虚拟机

`rabbitmqtcl stop：关闭应用，关闭虚拟机





交换机数量不能过多，同一个业务或同一类业务使用同一个交换机

一个微服务监听一个队列，或者一个微服务的一个业务监听一个队列

尽量使用自动化配置



## 架构设计

使用微服务，组件之间充分解耦

使用消息中间件，解耦业务逻辑

### 拆分微服务

根据系统操作进行微服务拆分

根据业务能力拆分

根据子域进行拆分

| 订单获取和履行   | >    | 订单微服务 |
| ---------------- | ---- | ---------- |
| 供应商和产品管理 | >    | 商家微服务 |
| 送餐，骑手管理   | >    | 骑手微服务 |
| 记账结算         | >    | 结算微服务 |
| 积分管理         | >    | 积分微服务 |



