---
title: RabbitMQ
---

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



## 发送确认机制

+ 单条确认

  配置 channel，开启确认模式：`channel.confirmSelect()`

  每发送一条消息，调用`channel.waitForConfirms()`方法，等待确认

+ 多条确认

  配置 channel，开启确认模式：`channel.confirmSelect()`

  发送多条消息后，调用`channel.waitForConfirms()`方法，等待确认

+ 异步确认

  配置 channel，开启确认模式：`channel.confirmSelect()`

  在channel上添加监听，`addConfirmListener`方法，发送消息后，回调此方法，通知是否发送成功

  异步确认可能是单条，或多条，取决于MQ

## 消息返回机制

+ RabbitMQ 基础配置中配置：Mandatory，为 false，MQ 将直接丢弃无法路由的消息

## 消费端限流机制

QoS 机制、服务质量保证，保证在一定数目的消息未被确认前，不消费新的消息

**前提是不使用自动确认**

+ prefetchCount：针对一个消费端最多推送多少未确认消息
+ global：true、针对整个消费端限流，false：针对当前 channel
+ prefetchSize：0、单个消息大小限制，一般为 0
+ prefetchSize 和 global 两项，RabbitMq 未实现

消费端限流后，其他消息可由其他服务使用，这些消息是 Ready 状态，否则为 unacked 状态就不能被其他服务使用



## 消费端确认机制

手动 ACK

+ 单条手动ACK：multiple = false （推荐）
+ 多条手动ACK：multiple = true

### 重回队列

设置了重回队列，消息被 nack 之后，会返回队列末尾，等待进一步被处理，

但因为消费者业务代码是一样的，其他消费者接受消息多半都会失败，将进入死循环，所以不建议开启

## 消息过期机制

`TTL（Time to Live）`过期时间，分为 单条消息TTL 和 队列中所有消息TTL，两个不能重复设置

TTL 应该明显长于服务的平均重启时间

TTL 长于业务高峰期时间

### 死信队列

+ 队列被配置 DLX 属性（Dead-Letter-Exchange）
+ 当一个消息变成死信后，能重新被发布到另一个 Exchange，这个 Exchange 也是一个普通交换机
+ 死信被死信交换机路由后，一般进入一个固定队列，死信队列

### 消息变成死信

+ 消息被拒绝（reject / nack）并且 requeue = false
+ 消息过期
+ 队列达到最大长度

### 设置死信队列

#### 新建转发、接收死信的交换机和队列

+ Exchange：dlx.exchange
+ Queue：dlx.queue
+ RoutingKey：#

#### 在需要设置死信的队列加入参数

+ x-dead-letter-exchange = dlx.exchange

```java
channel.exchangeDeclare("exchange.dlx", BuiltinExchangeType.TOPIC, true, false, null);
channel.queueDeclare("queue.dlx", true, false, false, null);
channel.queueBind("queue.dlx", "exchange.dlx", "#");
```







## Spring AMQP

+ 异步消息监听容器
+ 原生提供 RabbitTemplate，方便收发消息
+ 原生提供 RabbitAdmin，方便队列，交换机声明
+ Spring Boot Config 原生支持 RabbitMQ

### RabbitAdmin

+ declareExchange：创建交换机
+ deleteExchange：删除
+ declareQueue：创建队列
+ deleteQueue：删除
+ purgeQueue：清空队列
+ declareBinding：新建绑定关系
+ removeBinding：删除
+ getQueueProperties：查询队列属性

RabbitAdmin 代码实现

```java
@Configuration
public class RabbitConfig {

    public static final String EXCHANGE_ORDER_RESTAURANT = "exchange.order.restaurant";
    public static final String EXCHANGE_ORDER_DELIVERYMAN = "exchange.order.deliveryman";
    public static final String EXCHANGE_ORDER_SETTLEMENT = "exchange.order.settlement";
    public static final String EXCHANGE_SETTLEMENT_ORDER = "exchange.settlement.order";
    public static final String EXCHANGE_ORDER_REWARD = "exchange.order.reward";

    public static final String QUEUE_ORDER = "queue.order";

    public static final String KEY_ORDER = "key.order";

    @Autowired
    public void initRabbit() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost("localhost");
        connectionFactory.setPort(5672);
        connectionFactory.setUsername("guest");
        connectionFactory.setPassword("guest");

        RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);

        DirectExchange directExchange;
        FanoutExchange fanoutExchange;
        TopicExchange topicExchange;
        Queue queue;
        Binding binding;

        /* restaurant */
        directExchange = new DirectExchange(EXCHANGE_ORDER_RESTAURANT);
        rabbitAdmin.declareExchange(directExchange);

        queue = new Queue(QUEUE_ORDER);
        rabbitAdmin.declareQueue(queue);

        binding = new Binding(QUEUE_ORDER, Binding.DestinationType.QUEUE, EXCHANGE_ORDER_RESTAURANT, KEY_ORDER, null);
        rabbitAdmin.declareBinding(binding);

        /* deliveryman */
        directExchange = new DirectExchange(EXCHANGE_ORDER_DELIVERYMAN);
        rabbitAdmin.declareExchange(directExchange);

        binding = new Binding(QUEUE_ORDER, Binding.DestinationType.QUEUE, EXCHANGE_ORDER_DELIVERYMAN, KEY_ORDER, null);
        rabbitAdmin.declareBinding(binding);

        /* settlement */
        fanoutExchange = new FanoutExchange(EXCHANGE_SETTLEMENT_ORDER);
        rabbitAdmin.declareExchange(fanoutExchange);

        fanoutExchange = new FanoutExchange(EXCHANGE_ORDER_SETTLEMENT);
        rabbitAdmin.declareExchange(fanoutExchange);

        binding = new Binding(QUEUE_ORDER, Binding.DestinationType.QUEUE, EXCHANGE_SETTLEMENT_ORDER, KEY_ORDER, null);
        rabbitAdmin.declareBinding(binding);

        /* reward */
        topicExchange = new TopicExchange(EXCHANGE_ORDER_REWARD);
        rabbitAdmin.declareExchange(topicExchange);

        binding = new Binding(QUEUE_ORDER, Binding.DestinationType.QUEUE, EXCHANGE_ORDER_REWARD, KEY_ORDER, null);
        rabbitAdmin.declareBinding(binding);

    }
}

```



RabbitAdmin 声明式配置

1. 将 Exchange、Queue、Binding 声明为 Bean
2. 再将 RabbitAdmin 声明为 Bean
3. Exchange、Queue、Binding 即可以自动创建

+ 将声明和创建工作分开，解耦
+ 不用显示声明，减少代码量，减少 Bug



### SimpleMessageListenerContainer 简单消息监听容器

+ 设置同时监听多个队列，自动启动，自动配置 RabbitMQ
+ 设置消费者数量



### MessageListenerAdapter 消息监听适配器

+ 适配器模式
+ 解决业务代码无法修改的问题
+ 简单模式：实现 handleMessage 方法



## RabbiListener

`@RabbitListener`也可以在 SpringBoot 配置文件中声明

可嵌套注解

+ `@Exchange`：自动声明 Exchange
+ `@Queue`：自动声明 Queue
+ `@QueueBinding`：自动声明绑定关系














# 消息队列基础

## 消息队列的使用场景

## 消息的重发补偿解决思路

## 消息的幂等性解决思路

## 消息的堆积解决思路

## 自己如何实现消息队列

## 如何保证消息的有序性

## 如何解决消息队列丢失消息和重复消费问题

## 异步队列怎么实现
