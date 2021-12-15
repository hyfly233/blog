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

### Direct

