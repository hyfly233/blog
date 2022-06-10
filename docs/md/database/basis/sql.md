# 面试



## 架构

### RDBMS

+ 程序实例
  + 存储管理
  + 缓存机制
  + SQL解析
  + 日志管理
  + 权限划分
  + 容灾机制
  + 索引管理
  + 所管理
+ 文件系统



## 索引

### 为什么要使用索引

+ 能避免全表扫描，快速查询数据



### 什么信息能成为索引

+ 主键、唯一键以及普通键，只要能让数据有区分的字段都可以



### 索引的数据结构

+ 二分查找树进行二分查找
  + 缺点：
    + 可能变成线性的链表结构，导致时间复杂度从 O(logN) 变为 O(N)
+ B-Tree结构进行查找
  + 根节点至少包括两个子节点
  + 树中每个节点最多包含m个子节点（m >= 2）
  + 除根节点和叶子节点外，其他每个节点至少有 ceil(m/2) 个子节点
  + 所有叶子节点都位于同一层
  + 每个非终端节点中包含 n 个关键字信息，关键字按升序排序
+ B+ Tree结构进行查找
  + B+ Tree 是 B-Tree 的变体
  + 非叶子节点的子树指针与关键字个数相同
  + 非叶子节点仅用来做索引，数据全保存在叶子节点中
+ Hash结构进行查找
  + 缺点：
    + 仅仅满足 “=”，“IN”，不能使用范围查询
    + 无法被用来避免数据的排序操作
    + 不能利用组合索引的部分索引键查询
    + 不能避免全表扫描
    + 遇到大量Hash值相同的情况后性能并不一定就会比B-Tree索引高
+ BitMap索引
  + 只有Oracle支持



### 密集索引

+ 密集索引文件中的每个搜索码值都对应一个索引值



### 稀疏索引

+ 稀疏索引文件只为索引码的某些值建立索引项



### 如何定位并优化慢查询SQL

+ 根据慢查询日志定位慢查询sql

  + 在数据库工具中查找慢日志是否打开

    ```sql
    show variables like '%quer%';
    
    // long_query_time 查询时间，超过则记录慢日志
    // show_query_log 开启慢日志
    // show_query_log_file 日志地址
    
    show status like '%slow_queries%'; // 慢日志条数
    
    set global show_query_log = on; // 开启
    set global long_query_time = 1; // 设置查询时间，再重新连接数据库
    ```

+ 使用`explain`等工具分析sql

  ```sql
  explain select t1.* from t1;
  ```

  explain查询的字段

  + type：值为 index、all 就需要优化
  + extra：filesort、temporary 表示无法用到索引，就需要优化

+ 修改sql或者尽量让sql走索引

  ```mysql
  alter table t1 add index idx_name(col1); // 加索引
  ```

+ 使用`force index`测试最优索引



### 联合索引最左匹配原则的成因

最左前缀匹配原则，mysql会一直向右匹配直到遇到范围查询（>、<、between、like）就停止匹配

比如`a  = 3 and b = 4 and c > 5 and d = 6`，如过建立的索引顺序为`a、b、c、d`，则 d 用不到索引，若索引顺序为`a、b、d、c`则可以用到索引

= 和 in 可以乱序，索引列写的顺序可以任意



mysql会对复合索引的第一个索引进行排序，然后再根据第一个索引列对第二个索引列进行排序，所以这个第二列是无序的，所以在直接对第二个索引列进行条件判断的时候，是不会使用到复合索引的





## 锁

## 分类

+ 锁粒度：表级锁、行级锁、页级锁
+ 锁级别：共享锁、排它锁
+ 加锁方式：自动锁、显示锁
+ 操作划分：DML锁、DDL锁
+ 使用方式：乐观锁、悲观锁



### MyISAM与InnoDB关于锁方面的区别是什么

+ MyISAM默认用的是表级锁，不支持行级锁
+ InnoDB默认使用行级锁，也支持表级锁



### 事务的四大特性

+ 原子性
+ 一致性
+ 隔离性
+ 持久性



### 事务隔离级别及各个级别下的并发问题

#### 隔离级别

+ 读未提交
+ 读已提交
+ 可重复读
+ 串行化



```mysql
select @@tx_isolation;  // 查看隔离性
set session transaction isolation level read uncommitted; // 设置隔离级别
```



#### 可引发的问题

+ 更新丢失：mysql所有事务隔离级别在数据库层面上均可避免
+ 脏读：read-committed事务隔离级别以上可避免
+ 不可重复读：repeatable-read事务隔离级别以上可避免
+ 幻读：设置为最高隔离级别serializable





### InnoDB可重复读如何避免幻读

+ 表象：快照读（非阻塞读）-- 伪MVCC
+ 内在：next-key锁（行锁 + gap锁）







### RC、RR级别下的InnoDB的非阻塞读如何实现













## 语法

### 关键语法

+ group by
+ having
+ 统计相关
  + count
  + sum
  + max
  + min
  + avg
+ 
























