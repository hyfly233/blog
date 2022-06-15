# 线程池

## 核心参数

+ coreSize：核心线程数
+ maxSize：最大线程数
+ queueSize：等待队列数
+ keepAliveTime：空闲线程销毁时间
+ handler：拒绝策略，丢弃/丢弃抛异常/调用线程处理/丢弃最前面的任务然后尝试重新执行