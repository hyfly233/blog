

# Spring Cloud 组件

## Eureka

## Actuator

## RestTemplate

## Ribbon

## Feign

## Hystrix

## Hystrix dashboard

## Zuul

## Sleuth + Zipkin

## Spring Cloud / Boot Admin

## Spring Cloud Config

# Spring Cloud Alibaba 组件

## Sentinel

## Sentinel dashboard

## Nacos

# Spring Cloud Netflix / Alibaba 选型



# 响应式 web

## http 协议下的服务器推 SSE

## Project Reactor

## RXJava 2

## WebFlux

## Spring Cloud Gateway



# 微服务安全

# Apollo

# Apache Skywalking

# 会话管理

## Spring Security

## SSO CAS

## Oauth2.0

## JWT



# 分布式锁

分布式锁每次只能有一个能成功

使用 Redis 或 数据库

数据库：比如把同一个型号的商品 id、开始时间、结束时间（uk）存表（锁记录），其他  service 再存该记录就存不进去了，就实现了锁，当前 service 操作完一个商品后，删除表中的记录，其他 service 操作时又新建一条，操作完再删除

并发量不高，分库分表



Redis：

用原子操作`set nx key value ex 10`



时间过期了，业务没处理完怎么办：业务再开个守护线程（watch dog，@async   getKey == 自己的值{续期}）给锁续期，业务执行完后删除 key（if（getKey == 自己的值）{ del key }）

单点故障：用集群

主从不同步：使用红锁，比如5台redis，一个线程设置锁的时候，在redis中挨个设置锁，设置redis数量过半时（设置第3个）返回成功，其他线程设置锁就不能过半，就算设置失败释放已加的锁，只要5个里面活3台就行，谁到拿不到3把锁就把锁释放掉

延伸重启一天



鸵鸟算法

# 分布式事务



一致性，高并发

解决高并发：业务间使用消息队列，但会牺牲一致性

可靠信息服务，





