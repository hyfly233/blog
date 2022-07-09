# 面试

### 1、关系型和非关系型数据库的区别？

关系型数据库的优点

- 容易理解，因为它采用了关系模型来组织数据。
- 可以保持数据的一致性。
- 数据更新的开销比较小。
- 支持复杂查询（带 where 子句的查询）

非关系型数据库（NOSQL）的优点

- 无需经过 SQL 层的解析，读写效率高。
- 基于键值对，读写性能很高，易于扩展
- 可以支持多种类型数据的存储，如图片，文档等等。
- 扩展（可分为内存性数据库以及文档型数据库，比如 Redis，MongoDB，HBase 等，适合场景：数据量大高可用的日志系统/地理位置存储系统）。



### 8、什么是覆盖索引和索引下推？

覆盖索引：

- 在某个查询里面，索引 k 已经“覆盖了”我们的查询需求，称为覆盖索引。
- 覆盖索引可以减少树的搜索次数，显著提升查询性能，所以使用覆盖索引是一个常用的性能优化手段。

索引下推：

- MySQL 5.6 引入的索引下推优化（index condition pushdown)， 可以在索引遍历过程中，对索引中包含的字段先做判断，直接过滤掉不满足条件的记录，减少回表次数。

### 9、哪些操作会导致索引失效？

- 对索引使用左或者左右模糊匹配，也就是 like %xx 或者 like %xx% 这两种方式都会造成索引失效。原因在于查询的结果可能是多个，不知道从哪个索引值开始比较，于是就只能通过全表扫描的方式来查询。
- 对索引进行函数/对索引进行表达式计算，因为索引保持的是索引字段的原始值，而不是经过函数计算的值，自然就没办法走索引。
- 对索引进行隐式转换相当于使用了新函数。
- WHERE 子句中的 OR语句，只要有条件列不是索引列，就会进行全表扫描。

### 10、字符串加索引

- 直接创建完整索引，这样可能会比较占用空间。
- 创建前缀索引，节省空间，但会增加查询扫描次数，并且不能使用覆盖索引。
- 倒序存储，再创建前缀索引，用于绕过字符串本身前缀的区分度不够的问题。
- 创建 hash 字段索引，查询性能稳定，有额外的存储和计算消耗，跟第三种方式一样，都不支持范围扫描。



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








# MySQL



### 数据库表结构的优化

数据库表结构的优化包括选择合适数据类型、表的范式的优化、表的垂直拆分和表的水平拆分等手段。

#### 选择合适数据类型

- 使用较小的数据类型解决问题；
- 使用简单的数据类型(mysql处理int要比varchar容易)；
- 尽可能的使用not null 定义字段；
- 尽量避免使用text类型，非用不可时最好考虑分表；

#### 表的范式的优化

一般情况下，表的设计应该遵循三大范式。

#### 表的垂直拆分

- 把含有多个列的表拆分成多个表，解决表宽度问题，具体包括以下几种拆分手段：
- 把不常用的字段单独放在同一个表中；
- 把大字段独立放入一个表中；
- 把经常使用的字段放在一起；
- 这样做的好处是非常明显的，具体包括：拆分后业务清晰，拆分规则明确、系统之间整合或扩展容易、数据维护简单。

#### 表的水平拆分

表的水平拆分用于解决数据表中数据过大的问题，水平拆分每一个表的结构都是完全一致的。一般地，将数据平分到N张表中的常用方法包括以下两种：

- 对ID进行hash运算，如果要拆分成5个表，mod(id,5)取出0~4个值；
- 针对不同的hashID将数据存入不同的表中；
- 表的水平拆分会带来一些问题和挑战，包括跨分区表的数据查询、统计及后台报表的操作等问题，但也带来了一些切实的好处：
  - 表分割后可以降低在查询时需要读的数据和索引的页数，同时也降低了索引的层数，提高查询速度；
  - 表中的数据本来就有独立性，例如表中分别记录各个地区的数据或不同时期的数据，特别是有些数据常用，而另外一些数据不常用。
- 需要把数据存放到多个数据库中，提高系统的总体可用性(分库，鸡蛋不能放在同一个篮子里)。

### 系统配置的优化

操作系统配置的优化：增加TCP支持的队列数

mysql配置文件优化：Innodb缓存池设置(innodb_buffer_pool_size，推荐总内存的75%)和缓存池的个数（innodb_buffer_pool_instances）

### 硬件的优化

CPU：核心数多并且主频高的
内存：增大内存
磁盘配置和选择：磁盘性能

## MySQL中的悲观锁与乐观锁的实现

悲观锁与乐观锁是两种常见的资源并发锁设计思路，也是并发编程中一个非常基础的概念。

### 悲观锁

悲观锁的特点是先获取锁，再进行业务操作，即“悲观”的认为所有的操作均会导致并发安全问题，因此要先确保获取锁成功再进行业务操作。通常来讲，在数据库上的悲观锁需要数据库本身提供支持，即通过常用的select … for update操作来实现悲观锁。当数据库执行select … for update时会获取被select中的数据行的行锁，因此其他并发执行的select … for update如果试图选中同一行则会发生排斥（需要等待行锁被释放），因此达到锁的效果。select for update获取的行锁会在当前事务结束时自动释放，因此必须在事务中使用。

这里需要特别注意的是，不同的数据库对select… for update的实现和支持都是有所区别的，例如oracle支持select for update no wait，表示如果拿不到锁立刻报错，而不是等待，mysql就没有no wait这个选项。另外，mysql还有个问题是: select… for update语句执行中所有扫描过的行都会被锁上，这一点很容易造成问题。因此，如果在mysql中用悲观锁务必要确定使用了索引，而不是全表扫描。

### 乐观锁

乐观锁的特点先进行业务操作，只在最后实际更新数据时进行检查数据是否被更新过，若未被更新过，则更新成功；否则，失败重试。乐观锁在数据库上的实现完全是逻辑的，不需要数据库提供特殊的支持。一般的做法是在需要锁的数据上增加一个版本号或者时间戳，然后按照如下方式实现：

```
SELECT data AS old_data, version AS old_version FROM …;//根据获取的数据进行业务操作，得到new_data和new_versionUPDATE SET data = new_data, version = new_version WHERE version = old_versionif (updated row > 0) {// 乐观锁获取成功，操作完成} else {// 乐观锁获取失败，回滚并重试}
```

乐观锁是否在事务中其实都是无所谓的，其底层机制是这样：在数据库内部update同一行的时候是不允许并发的，即数据库每次执行一条update语句时会获取被update行的写锁，直到这一行被成功更新后才释放。因此在业务操作进行前获取需要锁的数据的当前版本号，然后实际更新数据时再次对比版本号确认与之前获取的相同，并更新版本号，即可确认这其间没有发生并发的修改。如果更新失败，即可认为老版本的数据已经被并发修改掉而不存在了，此时认为获取锁失败，需要回滚整个业务操作并可根据需要重试整个过程。

### 悲观锁与乐观锁的应用场景

一般情况下，读多写少更适合用乐观锁，读少写多更适合用悲观锁。乐观锁在不发生取锁失败的情况下开销比悲观锁小，但是一旦发生失败回滚开销则比较大，因此适合用在取锁失败概率比较小的场景，可以提升系统并发性能。

## MySQL存储引擎中的MyISAM和InnoDB区别详解

在MySQL 5.5之前，MyISAM是mysql的默认数据库引擎，其由早期的ISAM（Indexed Sequential Access Method：有索引的顺序访问方法）所改良。虽然MyISAM性能极佳，但却有一个显著的缺点： 不支持事务处理。不过，MySQL也导入了另一种数据库引擎InnoDB，以强化参考完整性与并发违规处理机制，后来就逐渐取代MyISAM。

InnoDB是MySQL的数据库引擎之一，其由Innobase oy公司所开发，2006年五月由甲骨文公司并购。与传统的ISAM、MyISAM相比，InnoDB的最大特色就是支持ACID兼容的事务功能，类似于PostgreSQL。目前InnoDB采用双轨制授权，一是GPL授权，另一是专有软件授权。具体地，MyISAM与InnoDB作为MySQL的两大存储引擎的差异主要包括：

存储结构：每个MyISAM在磁盘上存储成三个文件：第一个文件的名字以表的名字开始，扩展名指出文件类型。.frm文件存储表定义，数据文件的扩展名为.MYD (MYData)，索引文件的扩展名是.MYI (MYIndex)。InnoDB所有的表都保存在同一个数据文件中（也可能是多个文件，或者是独立的表空间文件），InnoDB表的大小只受限于操作系统文件的大小，一般为2GB。

存储空间：MyISAM可被压缩，占据的存储空间较小，支持静态表、动态表、压缩表三种不同的存储格式。InnoDB需要更多的内存和存储，它会在主内存中建立其专用的缓冲池用于高速缓冲数据和索引。

可移植性、备份及恢复：MyISAM的数据是以文件的形式存储，所以在跨平台的数据转移中会很方便，同时在备份和恢复时也可单独针对某个表进行操作。InnoDB免费的方案可以是拷贝数据文件、备份 binlog，或者用 mysqldump，在数据量达到几十G的时候就相对痛苦了。

事务支持：MyISAM强调的是性能，每次查询具有原子性，其执行数度比InnoDB类型更快，但是不提供事务支持。InnoDB提供事务、外键等高级数据库功能，具有事务提交、回滚和崩溃修复能力。

AUTO_INCREMENT：在MyISAM中，可以和其他字段一起建立联合索引。引擎的自动增长列必须是索引，如果是组合索引，自动增长可以不是第一列，它可以根据前面几列进行排序后递增。InnoDB中必须包含只有该字段的索引，并且引擎的自动增长列必须是索引，如果是组合索引也必须是组合索引的第一列。

表锁差异：MyISAM只支持表级锁，用户在操作MyISAM表时，select、update、delete和insert语句都会给表自动加锁，如果加锁以后的表满足insert并发的情况下，可以在表的尾部插入新的数据。InnoDB支持事务和行级锁。行锁大幅度提高了多用户并发操作的新能，但是InnoDB的行锁，只是在WHERE的主键是有效的，非主键的WHERE都会锁全表的。

全文索引：MyISAM支持 FULLTEXT类型的全文索引；InnoDB不支持FULLTEXT类型的全文索引，但是innodb可以使用sphinx插件支持全文索引，并且效果更好。

表主键：MyISAM允许没有任何索引和主键的表存在，索引都是保存行的地址。对于InnoDB，如果没有设定主键或者非空唯一索引，就会自动生成一个6字节的主键(用户不可见)，数据是主索引的一部分，附加索引保存的是主索引的值。

表的具体行数：MyISAM保存表的总行数，select count() from table;会直接取出出该值；而InnoDB没有保存表的总行数，如果使用select count() from table；就会遍历整个表，消耗相当大，但是在加了wehre条件后，myisam和innodb处理的方式都一样。

CURD操作：在MyISAM中，如果执行大量的SELECT，MyISAM是更好的选择。对于InnoDB，如果你的数据执行大量的INSERT或UPDATE，出于性能方面的考虑，应该使用InnoDB表。DELETE从性能上InnoDB更优，但DELETE FROM table时，InnoDB不会重新建立表，而是一行一行的删除，在innodb上如果要清空保存有大量数据的表，最好使用truncate table这个命令。

外键：MyISAM不支持外键，而InnoDB支持外键。

通过上述的分析，基本上可以考虑使用InnoDB来替代MyISAM引擎了，原因是InnoDB自身很多良好的特点，比如事务支持、存储过程、视图、行级锁、外键等等。尤其在并发很多的情况下，相信InnoDB的表现肯定要比MyISAM强很多。另外，必须需要注意的是，任何一种表都不是万能的，合适的才是最好的，才能最大的发挥MySQL的性能优势。如果是不复杂的、非关键的Web应用，还是可以继续考虑MyISAM的，这个具体情况具体考虑。

MyISAM：不支持事务，不支持外键，表锁；插入数据时锁定整个表，查行数时无需整表扫描。主索引数据文件和索引文件分离；与主索引无区别；

InnoDB：支持事务，外键，行锁，查表总行数时，全表扫描；主索引的数据文件本身就是索引文件；辅助索引记录主键的值；

## MySQL锁类型　　

根据锁的类型分，可以分为共享锁，排他锁，意向共享锁和意向排他锁。

根据锁的粒度分，又可以分为行锁，表锁。

对于mysql而言，事务机制更多是靠底层的存储引擎来实现，因此，mysql层面只有表锁，而支持事务的innodb存 储引擎则实现了行锁(记录锁（在行相应的索引记录上的锁）)，gap锁（是在索引记录间歇上的锁），next-key锁（是记录锁和在此索引记录之前的gap上的锁的结合）。Mysql的记录锁实质是索引记录的锁，因为innodb是索引组织表；gap锁是索引记录间隙的锁，这种锁只在RR隔离级别下有效；next-key锁是记录锁加上记录之前gap锁的组合。mysql通过gap锁和next-key锁实现RR隔离级别。

说明：对于更新操作(读不上锁)，只有走索引才可能上行锁；否则会对聚簇索引的每一行上写锁，实际等同于对表上写锁。

若多个物理记录对应同一个索引，若同时访问，也会出现锁冲突；

当表有多个索引时，不同事务可以用不同的索引锁住不同的行，另外innodb会同时用行锁对数据记录(聚簇索引)加锁。

MVCC(多版本并发控制)并发控制机制下，任何操作都不会阻塞读操作，读操作也不会阻塞任何操作，只因为读不上锁。

共享锁：由读表操作加上的锁，加锁后其他用户只能获取该表或行的共享锁，不能获取排它锁，也就是说只能读不能写

排它锁：由写表操作加上的锁，加锁后其他用户不能获取该表或行的任何锁，典型是mysql事务中的更新操作。

意向共享锁（IS）：事务打算给数据行加行共享锁，事务在给一个数据行加共享锁前必须先取得该表的IS锁。

意向排他锁（IX）：事务打算给数据行加行排他锁，事务在给一个数据行加排他锁前必须先取得该表的IX锁。

## 数据库死锁概念

多数情况下，可以认为如果一个资源被锁定，它总会在以后某个时间被释放。而死锁发生在当多个进程访问同一数据库时，其中每个进程拥有的锁都是其他进程所需的，由此造成每个进程都无法继续下去。简单的说，进程A等待进程B释放他的资源，B又等待A释放他的资源，这样就互相等待就形成死锁。

虽然进程在运行过程中，可能发生死锁，但死锁的发生也必须具备一定的条件，死锁的发生必须具备以下四个必要条件：

1）互斥条件：指进程对所分配到的资源进行排它性使用，即在一段时间内某资源只由一个进程占用。如果此时还有其它进程请求资源，则请求者只能等待，直至占有资源的进程用毕释放。

2）请求和保持条件：指进程已经保持至少一个资源，但又提出了新的资源请求，而该资源已被其它进程占有，此时请求进程阻塞，但又对自己已获得的其它资源保持不放。

3）不剥夺条件：指进程已获得的资源，在未使用完之前，不能被剥夺，只能在使用完时由自己释放。

4）环路等待条件：指在发生死锁时，必然存在一个进程——资源的环形链，即进程集合{P0，P1，P2，•••，Pn}中的P0正在等待一个P1占用的资源；P1正在等待P2占用的资源，……，Pn正在等待已被P0占用的资源。

下列方法有助于最大限度地降低死锁：

- 按同一顺序访问对象。
- 避免事务中的用户交互。
- 保持事务简短并在一个批处理中。
- 使用低隔离级别。
- 使用绑定连接。

## 千万级MySQL数据库建立索引的事项及提高性能的手段

1. 对查询进行优化，应尽量避免全表扫描，首先应考虑在 where 及 order by 涉及的列上建立索引。
2. 应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描，如：select id from t where num is null可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：select id from t where num=0
3. 应尽量避免在 where 子句中使用!=或<>操作符，否则引擎将放弃使用索引而进行全表扫描。
4. 应尽量避免在 where 子句中使用or 来连接条件，否则将导致引擎放弃使用索引而进行全表扫描，如：select id from t where num=10 or num=20可以这样查询：select id from t where num=10 union all select id from t where num=20
5. in 和 not in 也要慎用，否则会导致全表扫描，如：select id from t where num in(1,2,3) 对于连续的数值，能用 between 就不要用 in 了：select id from t where num between 1 and 3
6. 避免使用通配符。下面的查询也将导致全表扫描：select id from t where name like ‘李%’若要提高效率，可以考虑全文检索。
7. 如果在 where 子句中使用参数，也会导致全表扫描。因为SQL只有在运行时才会解析局部变量，但优化程序不能将访问计划的选择推迟到运行时；它必须在编译时进行选择。然而，如果在编译时建立访问计划，变量的值还是未知的，因而无法作为索引选择的输入项。如下面语句将进行全表扫描：select id from t where num=[@num](https://github.com/num)可以改为强制查询使用索引：select id from t with(index(索引名)) where num=[@num](https://github.com/num)
8. 应尽量避免在 where 子句中对字段进行表达式操作，这将导致引擎放弃使用索引而进行全表扫描。如：select id from t where num/2=100应改为:select id from t where num=100*2
9. 应尽量避免在where子句中对字段进行函数操作，这将导致引擎放弃使用索引而进行全表扫描。如：select id from t where substring(name,1,3)=’abc’ ，name以abc开头的id应改为:select id from t where name like ‘abc%’
10. 不要在 where 子句中的“=”左边进行函数、算术运算或其他表达式运算，否则系统将可能无法正确使用索引。
11. 在使用索引字段作为条件时，如果该索引是复合索引，那么必须使用到该索引中的第一个字段作为条件时才能保证系统使用该索引，否则该索引将不会被使用，并且应尽可能的让字段顺序与索引顺序相一致。
12. 不要写一些没有意义的查询，如需要生成一个空表结构：select col1,col2 into #t from t where 1=0 这类代码不会返回任何结果集，但是会消耗系统资源的，应改成这样：create table #t(…)
13. 很多时候用 exists 代替 in 是一个好的选择：select num from a where num in(select num from b)用下面的语句替换：select num from a where exists(select 1 from b where num=a.num)
14. 并不是所有索引对查询都有效，SQL是根据表中数据来进行查询优化的，当索引列有大量数据重复时，SQL查询可能不会去利用索引，如一表中有字段sex，male、female几乎各一半，那么即使在sex上建了索引也对查询效率起不了作用。
15. 索引并不是越多越好，索引固然可以提高相应的 select 的效率，但同时也降低了insert 及 update 的 效率，因为 insert 或 update 时有可能会重建索引，所以怎样建索引需要慎重考虑，视具体情况而定。一个表的索引数最好不要超过6个，若太多则应考虑一些不常使用到的列上建的索引是否有 必要。
16. 应尽可能的避免更新 clustered 索引数据列，因为 clustered 索引数据列的顺序就是表记录的物理存储 顺序，一旦该列值改变将导致整个表记录的顺序的调整，会耗费相当大的资源。若应用系统需要频繁更新 clustered 索引数据列，那么需要考虑是否应将该索引建为 clustered 索引。
17. 尽量使用数字型字段，若只含数值信息的字段尽量不要设计为字符型，这会降低查询和连接的性能，并会增加存储开销。这是因为引擎在处理查询和连接时会逐个比较字符串中每一个字符，而对于数字型而言只需要比较一次就够了。
18. 尽可能的使用 varchar/nvarchar 代替 char/nchar ，因为首先变长字段存储空间小，可以节省存储空间，其次对于查询来说，在一个相对较小的字段内搜索效率显然要高些。
19. 任何地方都不要使用 select * from t ，用具体的字段列表代替“*”，不要返回用不到的任何字段。
20. 尽量使用表变量来代替临时表。如果表变量包含大量数据，请注意索引非常有限（只有主键索引）。
21. 避免频繁创建和删除临时表，以减少系统表资源的消耗。
22. 临时表并不是不可使用，适当地使用它们可以使某些例程更有效，例如，当需要重复引用大型表或常用表中的某个数据集时。但是，对于一次性事件，最好使用导出表。
23. 在新建临时表时，如果一次性插入数据量很大，那么可以使用 select into 代替 create table，避免造成大量 log ，以提高速度；如果数据量不大，为了缓和系统表的资源，应先create table，然后insert。
24. 如果使用到了临时表，在存储过程的最后务必将所有的临时表显式删除，先 truncate table ，然后 drop table ，这样可以避免系统表的较长时间锁定。
25. 尽量避免使用游标，因为游标的效率较差，如果游标操作的数据超过1万行，那么就应该考虑改写。
26. 使用基于游标的方法或临时表方法之前，应先寻找基于集的解决方案来解决问题，基于集的方法通常更有效。
27. 与临时表一样，游标并不是不可使用。对小型数据集使用 FAST_FORWARD 游标通常要优于其他逐行处理方法，尤其是在必须引用几个表才能获得所需的数据时。在结果集中包括“合计”的例程通常要比使用游标执行的速度快。如果开发时间允许，基于游标的方法和基于集的方法都可以尝试一下，看哪一种方法的效果更好。
28. 在所有的存储过程和触发器的开始处设置 SET NOCOUNT ON ，在结束时设置 SET NOCOUNT OFF。无需在执行存储过程和触发器的每个语句后向客户端发送DONE_IN_PROC 消息。
29. 尽量避免大事务操作，提高系统并发能力。
30. 尽量避免向客户端返回大数据量，若数据量过大，应该考虑相应需求是否合理。

## limit 20000 加载很慢怎么解决

## 树状结构的MYSQL存储



# 1、描述一下数据库事务隔离级别？

ACID

+ 原子性（A，Atomicity）：事务全成功或全失败，失败则回滚，原先的数据保留在`undo log（MVCC）`中，用于回滚
+ 一致性（C，Consistency）：最核心和最本质的要求
+ 隔离性（I，Isolation）：锁，mvcc（多版本并发控制）
+ 持久性（D，Protracted）：redo log

​		数据库的事务隔离级别有四种，分别是读未提交、读已提交、可重复读、序列化，不同的隔离级别下会产生脏读、幻读、不可重复读等相关问题，因此在选择隔离级别的时候要根据应用场景来决定，使用合适的隔离级别。

​		各种隔离级别和数据库异常情况对应情况如下：

| 隔离级别          | 脏读 | 不可重复  读 | 幻读 |
| ----------------- | ---- | ------------ | ---- |
| READ- UNCOMMITTED | √    | √            | √    |
| READ-COMMITTED    | ×    | √            | √    |
| REPEATABLE- READ  | ×    | ×            | √    |
| SERIALIZABLE      | ×    | ×            | ×    |

SQL 标准定义了四个隔离级别：

- READ-UNCOMMITTED(读取未提交)： 事务的修改，即使没有提交，对其他事务也都是可见的。

  事务能够读取未提交的数据，这种情况称为脏读。

- READ-COMMITTED(读取已提交)： 事务读取已提交的数据，大多数数据库的默认隔离级别。

  当一个事务在执行过程中，数据被另外一个事务修改，造成本次事务前后读取的信息不一样，这种情况称为不可重复读。

- REPEATABLE-READ(可重复读)： 这个级别是MySQL的默认隔离级别，它解决了脏读的问题，同时也保证了同一个事务多次读取同样的记录是一致的，但这个级别还是会出现幻读的情况。

  幻读是指当一个事务A读取某一个范围的数据时，另一个事务B在这个范围插入行，A事务再次读取这个范围的数据时，会产生幻读

- SERIALIZABLE(可串行化)： 最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。

事务隔离机制的实现基于锁机制和并发调度。其中并发调度使用的是MVVC（多版本并发控制），通过保存修改的旧版本信息来支持并发一致性读和回滚等特性。

因为隔离级别越低，事务请求的锁越少，所以大部分数据库系统的隔离级别都是READ-COMMITTED(读取提交内容):，但是你要知道的是InnoDB 存储引擎默认使用 **REPEATABLE-READ（可重读）**并不会有任何性能损失。

# 2、MVCC的实现原理

详见mvcc文档

# 3、mysql幻读怎么解决的

forupdate  本质是加锁

​		事务A按照一定条件进行数据读取，期间事务B插入了相同搜索条件的新数据，事务A再次按照原先条件进行读取时，发现了事务B新插入的数据称之为幻读。

```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB ;

INSERT into user VALUES (1,'1',20),(5,'5',20),(15,'15',30),(20,'20',30);
```

假设有如下业务场景：

| 时间 | 事务1                                                        | 事务2                                       |
| ---- | ------------------------------------------------------------ | ------------------------------------------- |
|      | begin；                                                      |                                             |
| T1   | select * from user where age = 20;2个结果                    |                                             |
| T2   |                                                              | insert into user values(25,'25',20);commit; |
| T3   | select * from user where age =20;2个结果                     |                                             |
| T4   | update user set name='00' where age =20;此时看到影响的行数为3 |                                             |
| T5   | select * from user where age =20;三个结果                    |                                             |

执行流程如下：

1、T1时刻读取年龄为20 的数据，事务1拿到了2条记录

2、T2时刻另一个事务插入一条新的记录，年龄也是20 

3、T3时刻，事务1再次读取年龄为20的数据，发现还是2条记录，事务2插入的数据并没有影响到事务1的事务读取

4、T4时刻，事务1修改年龄为20的数据，发现结果变成了三条，修改了三条数据

5、T5时刻，事务1再次读取年龄为20的数据，发现结果有三条，第三条数据就是事务2插入的数据，此时就产生了幻读情况

此时大家需要思考一个问题，在当下场景里，为什么没有解决幻读问题？

其实通过前面的分析，大家应该知道了快照读和当前读，一般情况下select * from ....where ...是快照读，不会加锁，而 for update,lock in share mode,update,delete都属于当前读，**如果事务中都是用快照读，那么不会产生幻读的问题，但是快照读和当前读一起使用的时候就会产生幻读**。

如果都是当前读的话，如何解决幻读问题呢？

```sql
truncate table user;
INSERT into user VALUES (1,'1',20),(5,'5',20),(15,'15',30),(20,'20',30);
```

| 时间 | 事务1                                        | 事务2                                                |
| ---- | -------------------------------------------- | ---------------------------------------------------- |
|      | begin;                                       |                                                      |
| T1   | select * from user where age =20 for update; |                                                      |
| T2   |                                              | insert into user values(25,'25',20);此时会阻塞等待锁 |
| T3   | select * from user where age =20 for update; |                                                      |

此时，可以看到事务2被阻塞了，需要等待事务1提交事务之后才能完成，其实本质上来说采用的是间隙锁的机制解决幻读问题。

# 4、sql join原理?

​		MySQL是只支持一种Join算法Nested-Loop Join(嵌套循环连接)，并不支持哈希连接和合并连接，不过在mysql中包含了多种变种，能够帮助MySQL提高join执行的效率。

​		**1、Simple Nested-Loop Join**

​		这个算法相对来说就是很简单了，从驱动表中取出R1匹配S表所有列，然后R2，R3,直到将R表中的所有数据匹配完，然后合并数据，可以看到这种算法要对S表进行RN次访问，虽然简单，但是相对来说开销还是太大了。

​		**2、Index Nested-Loop Join**

​		索引嵌套联系由于非驱动表上有索引，所以比较的时候不再需要一条条记录进行比较，而可以通过索引来减少比较，从而加速查询。这也就是平时我们在做关联查询的时候必须要求关联字段有索引的一个主要原因。

​		这种算法在链接查询的时候，驱动表会根据关联字段的索引进行查找，当在索引上找到了符合的值，再回表进行查询，也就是只有当匹配到索引以后才会进行回表。至于驱动表的选择，MySQL优化器一般情况下是会选择记录数少的作为驱动表，但是当SQL特别复杂的时候不排除会出现错误选择。

​		在索引嵌套链接的方式下，如果非驱动表的关联键是主键的话，这样来说性能就会非常的高，如果不是主键的话，关联起来如果返回的行数很多的话，效率就会特别的低，因为要多次的回表操作。先关联索引，然后根据二级索引的主键ID进行回表的操作。这样来说的话性能相对就会很差。

​		**3、Block Nested-Loop Join**

​		在有索引的情况下，MySQL会尝试去使用Index Nested-Loop Join算法，在有些情况下，可能Join的列就是没有索引，那么这时MySQL的选择绝对不会是最先介绍的Simple Nested-Loop Join算法，而是会优先使用Block Nested-Loop Join的算法。

​		Block Nested-Loop Join对比Simple Nested-Loop Join多了一个中间处理的过程，也就是join buffer，使用join buffer将驱动表的查询JOIN相关列都给缓冲到了JOIN BUFFER当中，然后批量与非驱动表进行比较，这也来实现的话，可以将多次比较合并到一次，降低了非驱动表的访问频率。也就是只需要访问一次S表。这样来说的话，就不会出现多次访问非驱动表的情况了，也只有这种情况下才会访问join buffer。

​		在MySQL当中，我们可以通过参数join_buffer_size来设置join buffer的值，然后再进行操作。默认情况下join_buffer_size=256K，在查找的时候MySQL会将所有的需要的列缓存到join buffer当中，包括select的列，而不是仅仅只缓存关联列。在一个有N个JOIN关联的SQL当中会在执行时候分配N-1个join buffer。

# 5、说明一下数据库索引原理、底层索引数据结构，叶子节点存储的是什么，索引失效的情况？

​		索引的实现原理，底层数据结构，叶子节点存储数据需要看视频了解。

​		索引失效的情况：

​		1、组合索引不遵循最左匹配原则

​		2、组合索引的前面索引列使用范围查询(<,>,like),会导致后续的索引失效

​		3、不要在索引上做任何操作（计算，函数，类型转换）

​		4、is null和is not null无法使用索引

​		5、尽量少使用or操作符，否则连接时索引会失效

​		6、字符串不添加引号会导致索引失效

​		7、两表关联使用的条件字段中字段的长度、编码不一致会导致索引失效

​		8、like语句中，以%开头的模糊查询

​		9、如果mysql中使用全表扫描比使用索引快，也会导致索引失效

# 6、mysql如何做分库分表的？

​		使用mycat或者shardingsphere中间件做分库分表，选择合适的中间件，水平分库，水平分表，垂直分库，垂直分表

​		在进行分库分表的时候要尽量遵循以下原则：

​		1、能不切分尽量不要切分；

​		2、如果要切分一定要选择合适的切分规则，提前规划好；

​		3、数据切分尽量通过数据冗余或表分组来降低跨库 Join 的可能；

​		4、由于数据库中间件对数据 Join 实现的优劣难以把握，而且实现高性能难度极大，业务读取尽量少使用多表 Join。

# 7、数据存储引擎有哪些？

​		大家可以通过show engines的方式查看对应的数据库支持的存储引擎。

# 8、描述一下InnoDB和MyISAM的区别？

| 区别     | Innodb                         | MyISAM                             |
| -------- | ------------------------------ | ---------------------------------- |
| 事务     | 支持                           | 不支持                             |
| 外键     | 支持                           | 不支持                             |
| 索引     | 即支持聚簇索引又支持非聚簇索引 | 只支持非聚簇索引                   |
| 行锁     | 支持                           | 不支持                             |
| 表锁     | 支持                           | 支持                               |
| 存储文件 | frm，ibd                       | frm,myi,myd                        |
| 具体行数 | 每次必须要全表扫描统计行数     | 通过变量保存行数（查询不能带条件） |

如何选择？

​		1、是否需要支持事务，如果需要选择innodb，如果不需要选择myisam

​		2、如果表的大部分请求都是读请求，可以考虑myisam，如果既有读也有写，使用innodb

​		现在mysql的默认存储引擎已经变成了Innodb,推荐使用innodb

# 9、描述一下聚簇索引和非聚簇索引的区别？

​		innodb存储引擎在进行数据插入的时候必须要绑定到一个索引列上，默认是主键，如果没有主键，会选择唯一键，如果没有唯一键，那么会选择生成6字节的rowid，跟数据绑定在一起的索引我们称之为聚簇索引，没有跟数据绑定在一起的索引我们称之为非聚簇索引。

​		innodb存储引擎中既有聚簇索引也有非聚簇索引，而myisam存储引擎中只有非聚簇索引。

# 10、事务有哪些隔离级别，分别解决了什么问题？

​		参考问题1

# 11、描述一下mysql主从复制的机制的原理？mysql主从复制主要有几种模式？

​		参考mysql主从复制原理文档

# 12、如何优化sql，查询计划的结果中看哪些些关键数据？

​		参考执行计划文档

# 13、MySQL为什么选择B+树作为它的存储结构，为什么不选择Hash、二叉、红黑树？

​		参考问题5

# 14、描述一下mysql的乐观锁和悲观锁，锁的种类？

​		乐观锁并不是数据库自带的，如果需要使用乐观锁，那么需要自己去实现，一般情况下，我们会在表中新增一个version字段，每次更新数据version+1,在进行提交之前会判断version是否一致。

​		mysql中的绝大部分锁都是悲观锁，按照粒度可以分为行锁和表锁：

​		**行锁：**

​			共享锁：当读取一行记录的时候，为了防止别人修改，则需要添加S锁

​			排它锁：当修改一行记录的时候，为了防止别人同时进行修改，则需要添加X锁

|      |   X    |   S    |
| :--: | :----: | :----: |
|  X   | 不兼容 | 不兼容 |
|  S   | 不兼容 |  兼容  |

​			记录锁：添加在行索引上的锁

​			间隙锁：锁定范围是索引记录之间的间隙，针对可重复读以上隔离级别

​			临键锁：记录锁+间隙锁

​		**表锁：**

​			意向锁：在获取某行的锁之前，必须要获取表的锁，分为意向共享锁，意向排它锁

​			自增锁：对自增字段所采用的特殊表级锁

​		锁模式的含义：

​			IX：意向排它锁

​			X：锁定记录本身和记录之前的间隙

​			S：锁定记录本身和记录之前的间隙

​			X,REC_NOT_GAP：只锁定记录本身

​			S，REC_NOT_GAP：只锁定记录本身

​			X，GAP：间隙锁，不锁定记录本身

​			S，GAP：间隙锁，不锁定记录本身

​			X，GAP,INSERT_INTENTION：插入意向锁

# 15、mysql原子性和持久性是怎么保证的？

​		原子性通过undolog来实现，持久性通过redo log来实现



# MVCC多版本并发控制

### 1、MVCC

​	全称`Multi-Version Concurrency Control`，即多版本并发控制。MVCC是一种并发控制的方法，一般在数据库管理系统中，实现对数据库的并发访问，在编程语言中实现事务内存。

​	MVCC在MySQL InnoDB中的实现主要是为了提高数据库并发性能，用更好的方式去处理读写冲突，做到即使有读写冲突时，也能做到不加锁，非阻塞并发读。

### 2、当前读

​	像`select lock in share mode(共享锁)，select for update；update，insert，delete(排他锁)`这些操作都是一种当前读，当前读就是它读取的是记录的最新版本，读取时还要保证其他并发事务不能修改当前记录，会对读取的记录进行加锁。

### 3、快照读（提高数据库的并发查询能力）

​	像不加锁的`select`操作就是快照读，即不加锁的非阻塞读；快照读的前提是隔离级别不是串行级别，串行级别下的快照读会退化成当前读；之所以出现快照读的情况，是基于提高并发性能的考虑，快照读的实现是基于多版本并发控制，即MVCC,可以认为MVCC是行锁的一个变种，但它在很多情况下，避免了加锁操作，降低了开销；既然是基于多版本，即快照读可能读到的并不一定是数据的`最新版本`，而有可能是之前的`历史版本`

### 4、当前读、快照读、MVCC关系

​		MVCC多版本并发控制指的是维持一个数据的多个版本，使得读写操作没有冲突，快照读是MySQL为实现MVCC的一个非阻塞读功能。MVCC模块在MySQL中的具体实现是由三个`隐式字段，undo log、read view`三个组件来实现的。

### 5、MVCC解决的问题

​		数据库并发场景有三种，分别为：

​		1、读读：不存在任何问题，也不需要并发控制

​		2、读写：有线程安全问题，可能会造成事务隔离性问题，可能遇到脏读、幻读、不可重复读

​		3、写写：有线程安全问题，可能存在更新丢失问题

​		MVCC是一种用来解决读写冲突的无锁并发控制，也就是为事务分配单项增长的时间戳，为每个修改保存一个版本，版本与事务时间戳关联，读操作只读该事务开始前的数据库的快照，所以MVCC可以为数据库解决一下问题：

​		1、在并发读写数据库时，可以做到在读操作时不用阻塞写操作，写操作也不用阻塞读操作，提高了数据库并发读写的性能

​		2、解决脏读、幻读、不可重复读等事务隔离问题，但是不能解决更新丢失问题

### 6、MVCC实现原理

​		mvcc的实现原理主要依赖于记录中的三个隐藏字段，undolog，read view来实现的。

​		**隐藏字段**

​		每行记录除了我们自定义的字段外，还有数据库隐式定义的DB_TRX_ID,DB_ROLL_PTR,DB_ROW_ID等字段

​		DB_TRX_ID

​		6字节，最近修改事务id，记录创建这条记录或者最后一次修改该记录的事务id

​		DB_ROLL_PTR

​		7字节，回滚指针，指向这条记录的上一个版本,用于配合undolog，指向上一个旧版本

​		DB_ROW_ID

​		6字节，隐藏的主键，如果数据表没有主键，那么innodb会自动生成一个6字节的row_id

​		记录如图所示：

![image-20210225233929554](F:/BaiduNetdiskDownload/金三银四 面试突击班/3月面试突击班/0322mysql专题(1)/0322mysql专题(1)/mysql专题/mvcc/数据案例.png)

​		在上图中，DB_ROW_ID是数据库默认为该行记录生成的唯一隐式主键，DB_TRX_ID是当前操作该记录的事务ID，DB_ROLL_PTR是一个回滚指针，用于配合undo日志，指向上一个旧版本

​		**undo log**

​		undolog被称之为回滚日志，表示在进行insert，delete，update操作的时候产生的方便回滚的日志

​		当进行insert操作的时候，产生的undolog只在事务回滚的时候需要，并且在事务提交之后可以被立刻丢弃

​		当进行update和delete操作的时候，产生的undolog不仅仅在事务回滚的时候需要，在快照读的时候也需要，所以不能随便删除，只有在快照读或事务回滚不涉及该日志时，对应的日志才会被purge线程统一清除（当数据发生更新和删除操作的时候都只是设置一下老记录的deleted_bit，并不是真正的将过时的记录删除，因为为了节省磁盘空间，innodb有专门的purge线程来清除deleted_bit为true的记录，如果某个记录的deleted_id为true，并且DB_TRX_ID相对于purge线程的read view 可见，那么这条记录一定时可以被清除的）

​		**下面我们来看一下undolog生成的记录链**

​		1、假设有一个事务编号为1的事务向表中插入一条记录，那么此时行数据的状态为：

![image-20210225235444975](F:/BaiduNetdiskDownload/金三银四 面试突击班/3月面试突击班/0322mysql专题(1)/0322mysql专题(1)/mysql专题/mvcc/1.png)

​		2、假设有第二个事务编号为2对该记录的name做出修改，改为lisi

​		在事务2修改该行记录数据时，数据库会对该行加排他锁

​		然后把该行数据拷贝到undolog中，作为 旧记录，即在undolog中有当前行的拷贝副本

​		拷贝完毕后，修改该行name为lisi，并且修改隐藏字段的事务id为当前事务2的id，回滚指针指向拷贝到undolog的副本记录中

​		事务提交后，释放锁

![image-20210313220450629](F:/BaiduNetdiskDownload/金三银四 面试突击班/3月面试突击班/0322mysql专题(1)/0322mysql专题(1)/mysql专题/mvcc/2.png)

​		3、假设有第三个事务编号为3对该记录的age做了修改，改为32

​		在事务3修改该行数据的时，数据库会对该行加排他锁

​		然后把该行数据拷贝到undolog中，作为旧纪录，发现该行记录已经有undolog了，那么最新的旧数据作为链表的表头，插在该行记录的undolog最前面

​		修改该行age为32岁，并且修改隐藏字段的事务id为当前事务3的id，回滚指针指向刚刚拷贝的undolog的副本记录

​		事务提交，释放锁

![image-20210313220337624](F:/BaiduNetdiskDownload/金三银四 面试突击班/3月面试突击班/0322mysql专题(1)/0322mysql专题(1)/mysql专题/mvcc/3.png)

​		从上述的一系列图中，大家可以发现，不同事务或者相同事务的对同一记录的修改，会导致该记录的undolog生成一条记录版本线性表，即链表，undolog的链首就是最新的旧记录，链尾就是最早的旧记录。

​		**Read View**

​		上面的流程如果看明白了，那么大家需要再深入理解下read view的概念了。

​		Read View是事务进行快照读操作的时候生产的读视图，在该事务执行快照读的那一刻，会生成一个数据系统当前的快照，记录并维护系统当前活跃事务的id，事务的id值是递增的。

​		其实Read View的最大作用是用来做可见性判断的，也就是说当某个事务在执行快照读的时候，对该记录创建一个Read View的视图，把它当作条件去判断当前事务能够看到哪个版本的数据，有可能读取到的是最新的数据，也有可能读取的是当前行记录的undolog中某个版本的数据

​		Read View遵循的可见性算法主要是将要被修改的数据的最新记录中的DB_TRX_ID（当前事务id）取出来，与系统当前其他活跃事务的id去对比，如果DB_TRX_ID跟Read View的属性做了比较，不符合可见性，那么就通过DB_ROLL_PTR回滚指针去取出undolog中的DB_TRX_ID做比较，即遍历链表中的DB_TRX_ID，直到找到满足条件的DB_TRX_ID,这个DB_TRX_ID所在的旧记录就是当前事务能看到的最新老版本数据。

​		Read View的可见性规则如下所示：

​		首先要知道Read View中的三个全局属性：

​		trx_list:一个数值列表，用来维护Read View生成时刻系统正活跃的事务ID（1,2,3）

​		up_limit_id:记录trx_list列表中事务ID最小的ID（1）

​		low_limit_id:Read View生成时刻系统尚未分配的下一个事务ID，（4）

​		具体的比较规则如下：

​		1、首先比较DB_TRX_ID < up_limit_id,如果小于，则当前事务能看到DB_TRX_ID所在的记录，如果大于等于进入下一个判断

​		2、接下来判断DB_TRX_ID >= low_limit_id,如果大于等于则代表DB_TRX_ID所在的记录在Read View生成后才出现的，那么对于当前事务肯定不可见，如果小于，则进入下一步判断

​		3、判断DB_TRX_ID是否在活跃事务中，如果在，则代表在Read View生成时刻，这个事务还是活跃状态，还没有commit，修改的数据，当前事务也是看不到，如果不在，则说明这个事务在Read View生成之前就已经开始commit，那么修改的结果是能够看见的。

### 7、MVCC的整体处理流程

假设有四个事务同时在执行，如下图所示：

|  事务1   |  事务2   |  事务3   |    事务4     |
| :------: | :------: | :------: | :----------: |
| 事务开始 | 事务开始 | 事务开始 |   事务开始   |
|  ......  |  ......  |  ......  | 修改且已提交 |
|  进行中  |  快照读  |  进行中  |              |
|  ......  |  ......  |  ......  |              |

从上述表格中，我们可以看到，当事务2对某行数据执行了快照读，数据库为该行数据生成一个Read View视图，可以看到事务1和事务3还在活跃状态，事务4在事务2快照读的前一刻提交了更新，所以，在Read View中记录了系统当前活跃事务1，3，维护在一个列表中。同时可以看到up_limit_id的值为1，而low_limit_id为5，如下图所示：

![image-20210227183316573](F:\lian\oracle\mvcc\4.png)

在上述的例子中，只有事务4修改过该行记录，并在事务2进行快照读前，就提交了事务，所以该行当前数据的undolog如下所示：

![image-20210227183849998](F:\lian\oracle\mvcc\5.png)

​		当事务2在快照读该行记录的是，会拿着该行记录的DB_TRX_ID去跟up_limit_id,lower_limit_id和活跃事务列表进行比较，判读事务2能看到该行记录的版本是哪个。

​		具体流程如下：先拿该行记录的事务ID（4）去跟Read View中的up_limit_id相比较，判断是否小于，通过对比发现不小于，所以不符合条件，继续判断4是否大于等于low_limit_id,通过比较发现也不大于，所以不符合条件，判断事务4是否处理trx_list列表中，发现不再次列表中，那么符合可见性条件，所以事务4修改后提交的最新结果对事务2 的快照是可见的，因此，事务2读取到的最新数据记录是事务4所提交的版本，而事务4提交的版本也是全局角度的最新版本。如下图所示：

![image-20210227185820394](F:\lian\oracle\mvcc\6.png)

当上述的内容都看明白了的话，那么大家就应该能够搞清楚这几个核心概念之间的关系了，下面我们讲一个不同的隔离级别下的快照读的不同。

### 8、RC、RR级别下的InnoDB快照读有什么不同

​		因为Read View生成时机的不同，从而造成RC、RR级别下快照读的结果的不同

​		1、在RR级别下的某个事务的对某条记录的第一次快照读会创建一个快照即Read View,将当前系统活跃的其他事务记录起来，此后在调用快照读的时候，还是使用的是同一个Read View,所以只要当前事务在其他事务提交更新之前使用过快照读，那么之后的快照读使用的都是同一个Read View,所以对之后的修改不可见

​		2、在RR级别下，快照读生成Read View时，Read View会记录此时所有其他活动和事务的快照，这些事务的修改对于当前事务都是不可见的，而早于Read View创建的事务所做的修改均是可见

​		3、在RC级别下，事务中，每次快照读都会新生成一个快照和Read View,这就是我们在RC级别下的事务中可以看到别的事务提交的更新的原因。

​		**总结：在RC隔离级别下，是每个快照读都会生成并获取最新的Read View,而在RR隔离级别下，则是同一个事务中的第一个快照读才会创建Read View，之后的快照读获取的都是同一个Read View.**





# mysql的加锁情况

## 1、REPEATABLE-READ隔离级别+表无显式主键和索引

创建表t,没有索引和主键，并插入测试数据

```sql
create table t(id int default null,name char(20) default null);
insert into t values(10,'10'),(20,'20'),(30,'30');
```

手动开启事务，执行语句并采用for update方式（当前读）

```sql
begin;
select * from t for update;
show engine innodb status\G
```

从返回的信息中，可以看到对表添加了IX锁和4个记录锁，表中的三行记录上分别添加了Next-key Lock锁，防止有数据变化发生幻读，例如进行了更新、删除操作。同时会出现“ 0: len 8; hex 73757072656d756d; asc supremum;;”这样的描述信息，此操作也是为了防止幻读，会将最大索引值之后的间隙锁住并用supremum表示高于表中任何一个索引的值。

同表下，如果加上where条件之后，是否会产生Next-key Lock呢？执行如下语句：

```sql
begin;
select * from t where id = 10 for update;
show engine innodb status\G
```

从上述反馈信息中，可以发现跟不加where条件的加锁情况是一样的，会同时出现多个行的临键锁和supremum，这到底是为什么呢？

出现supremum的原因是：虽然where的条件是10，但是每次插入记录时所需要生成的聚簇索引Row_id还是自增的，每次都会在表的最后插入，所以就有可能插入id=10这条记录，因此要添加一个supremum防止数据插入。

出现其他行的临键锁的原因是：为了防止幻读，如果不添加Next-Key Lock锁，这时若有其他会话执行DELETE或者UPDATE语句，则都会造成幻读。

## 2、REPEATABLE-READ隔离级别+表有显式主键无索引

创建如下表并添加数据：

```sql
create table t2(id int primary key not null,name char(20) default null);
insert into t2 values(10,'10'),(20,'20'),(30,'30');
```

在此情况下要分为三种情况来进行分析，不同情况的加锁方式也不同：

1、不带where条件

```sql
begin;
select * from t2 for update;
show engine innodb status\G
```

通过上述信息可以看到，与之前的加锁方式是相同的。

2、where条件是主键字段

```sql
begin;
select * from t2 where id = 10 for update;
show engine innodb status\G
```

通过上述信息可以看到，只会对表中添加IX锁和对主键添加了记录锁（X locks rec but not gap）,并且只锁住了where条件id=10这条记录，因为主键已经保证了唯一性，所以在插入时就不会是id=10这条记录。

3、where条件包含主键字段和非关键字段

```sql
begin;
select * from t2 where id = 10 and name = '10' for update;
show engine innodb status\G
```

通过看到，加锁方式与where条件是主键字段的加锁方式相同，因为根据主键字段可以直接定位一条记录。

## 3、REPEATABLE-READ隔离级别+表无显式主键有索引

1、不带where条件，跟之前的情况类似

2、where条件是普通索引字段或者（普通索引字段+非索引字段）

创建如下表：

```sql
create table t3(id int default null,name char(20) default null);
create index idx_id on t3(id);
insert into t3 values(10,'10'),(20,'20'),(30,'30');
```

执行如下语句：

```sql
begin;
select * from t3 where id = 10 for update;
show engine innodb status\G

```

通过上述信息可以看到，对表添加了IX锁，对id=10的索引添加了Next-Key Lock锁，区间是负无穷到10，对索引对应的聚集索引添加了X记录锁，为了防止幻读，对索引记录区间（10，20）添加间隙锁。

此时大家可以开启一个新的事务，插入负无穷到id=19的全部记录都会被阻塞，而大于等于20 的值不会被阻塞

3、where条件是唯一索引字段或者（唯一索引字段+非索引字段）

创建如下表：

```sql
create table t4(id int default null,name char(20) default null);
create unique index idx_id on t4(id);
insert into t4 values(10,'10'),(20,'20'),(30,'30');

```

执行如下语句：

```sql
begin;
select * from t4 where id = 10 for update;
show engine innodb status\G

```

通过上述信息可以看到，此方式与where条件是主键字段的加锁情况相同，表无显式主键则会把唯一索引作为主键，因为是主键，所以不能再插入id=10这条记录，因此也不需要间隙锁。

## 4、REPEATABLE-READ隔离级别+表有显式主键和索引

此情况可以分为以下几种：

1、表有显式主键和普通索引

创建如下表：

```sql
create table t5(id int not null,name char(20) default null,primary key(id),key idx_name(name));
insert into t5 values(10,'10'),(20,'20'),(30,'30');

```

(1)不带where条件

```sql
begin;
select * from t5 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对supremum添加临键锁，对name索引列添加临键锁，对主键索引添加X记录锁

(2)where条件是普通索引字段

```sql
begin;
select * from t5 where name='10' for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对name添加临键锁，对主键索引列添加X记录锁，为了防止幻读，对name的（10，20）添加间隙锁

(3)where条件是主键字段

```sql
begin;
select * from t5 where id=10 for update;
show engine innodb status\G

```

通过上述信息可以看到，对表添加了意向锁，对主键添加了记录锁。

(4)where条件同时包含普通索引字段和主键索引字段

```sql
begin;
select * from t5 where id=10 and name='10' for update;
show engine innodb status\G

```

此处大家需要注意，如果在执行过程中使用的是主键索引，那么跟使用主键字段是一致的，如果使用的是普通索引，那么跟普通字段是类似的，其实本质点就在于加锁的字段不同而已。

2、表有显式主键和唯一索引

创建如下表：

```sql
create table t6(id int not null,name char(20) default null,primary key(id),unique key idx_name(name));
insert into t6 values(10,'10'),(20,'20'),(30,'30');

```

(1)不带where条件

```sql
begin;
select * from t6 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对supremum添加临键锁，对name索引列添加临键锁，对主键索引添加X记录锁

(2)where条件是唯一索引字段

```sql
begin;
select * from t6 where name='10' for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对name和主键添加行锁

(3)where条件是主键字段

```sql
begin;
select * from t6 where id=10 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后主键添加行锁

(4)where条件是唯一索引字段和主键字段

```sql
begin;
select * from t6 where id=10 and name='10' for update;
show engine innodb status\G

```

此处大家需要注意，如果在执行过程中使用的是主键索引，那么跟使用主键字段是一致的，如果使用的是唯一索引，那么跟唯一索引字段是一样的，其实本质点就在于加锁的字段不同而已。

## 5、READ-COMMITTED隔离级别+表无显式主键和索引

创建表t,没有索引和主键，并插入测试数据

```sql
create table t7(id int default null,name char(20) default null);
insert into t7 values(10,'10'),(20,'20'),(30,'30');

```

手动开启事务，执行语句并采用for update方式（当前读）

```sql
begin;
select * from t7 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对表的三行记录添加记录锁（聚簇索引）

同表下，如果加上where条件之后，是否会产生Next-key Lock呢？执行如下语句：

```sql
begin;
select * from t7 where id = 10 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后会对聚集索引添加记录锁，因为RC隔离级别无法解决幻读问题，所以不会添加临键锁。

## 6、READ-COMMITTED隔离级别+表有显式主键无索引

创建如下表并添加数据：

```sql
create table t8(id int primary key not null,name char(20) default null);
insert into t8 values(10,'10'),(20,'20'),(30,'30');

```

在此情况下要分为三种情况来进行分析，不同情况的加锁方式也不同：

1、不带where条件

```sql
begin;
select * from t8 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对表的三行记录添加记录锁（主键）

2、where条件是主键字段

```sql
begin;
select * from t8 where id = 10 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对表id=10的积累添加记录锁

3、where条件包含主键字段和非关键字段

```sql
begin;
select * from t8 where id = 10 and name = '10' for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对表id=10的积累添加记录锁

## 7、READ-COMMITTED隔离级别+表无显式主键有索引

创建如下表：

```sql
create table t9(id int default null,name char(20) default null);
create index idx_id on t9(id);
insert into t9 values(10,'10'),(20,'20'),(30,'30');

```

1、不带where条件，跟之前的情况类似

```sql
begin;
select * from t9 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对表的三行记录添加记录锁（聚簇索引）

2、where条件是普通索引字段或者（普通索引字段+非索引字段）

执行如下语句：

```sql
begin;
select * from t9 where id = 10 for update;
show engine innodb status\G

```

通过上述信息可以看到，对表添加了IX锁，对id=10的索引添加了行锁，对索引对应的聚集索引添加了行锁，

3、where条件是唯一索引字段或者（唯一索引字段+非索引字段）

创建如下表：

```sql
create table t10(id int default null,name char(20) default null);
create unique index idx_id on t10(id);
insert into t10 values(10,'10'),(20,'20'),(30,'30');

```

执行如下语句：

```sql
begin;
select * from t10 where id = 10 for update;
show engine innodb status\G

```

通过上述信息可以看到，对表添加了IX锁，对id=10的索引添加了行锁，对索引对应的聚集索引添加了行锁。

## 8、READ-COMMITTED隔离级别+表有显式主键和索引

此情况可以分为以下几种：

1、表有显式主键和普通索引

创建如下表：

```sql
create table t11(id int not null,name char(20) default null,primary key(id),key idx_name(name));
insert into t11 values(10,'10'),(20,'20'),(30,'30');

```

(1)不带where条件

```sql
begin;
select * from t11 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对name索引列添加记录锁，对主键索引添加X记录锁

(2)where条件是普通索引字段

```sql
begin;
select * from t11 where name='10' for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对name添加X记录锁，对主键索引列添加X记录锁

(3)where条件是主键字段

```sql
begin;
select * from t11 where id=10 for update;
show engine innodb status\G

```

通过上述信息可以看到，对表添加了意向锁，对主键添加了记录锁。

(4)where条件同时包含普通索引字段和主键索引字段

```sql
begin;
select * from t11 where id=10 and name='10' for update;
show engine innodb status\G

```

此处大家需要注意，如果在执行过程中使用的是主键索引，那么跟使用主键字段是一致的，如果使用的是普通索引，那么跟普通字段是类似的，其实本质点就在于加锁的字段不同而已。

2、表有显式主键和唯一索引

创建如下表：

```sql
create table t12(id int not null,name char(20) default null,primary key(id),unique key idx_name(name));
insert into t12 values(10,'10'),(20,'20'),(30,'30');

```

(1)不带where条件

```sql
begin;
select * from t12 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对name索引列添加X记录锁，对主键索引添加X记录锁

(2)where条件是唯一索引字段

```sql
begin;
select * from t12 where name='10' for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后对name和主键添加行锁

(3)where条件是主键字段

```sql
begin;
select * from t12 where id=10 for update;
show engine innodb status\G

```

通过上述信息可以看到，首先对表添加IX锁，然后主键添加行锁

(4)where条件是唯一索引字段和主键字段

```sql
begin;
select * from t6 where id=10 and name='10' for update;
show engine innodb status\G

```

此处大家需要注意，如果在执行过程中使用的是主键索引，那么跟使用主键字段是一致的，如果使用的是唯一索引，那么跟唯一索引字段是一样的，其实本质点就在于加锁的字段不同而已。







## 1、一张表，里面有 ID 自增主键，当 insert 了 17 条记录之后，删除了第 15,16,17 条记录，再把 Mysql 重启，再 insert 一条记录，这条记录的 ID 是 18 还是 15 ？ 

(1)如果表的类型是 MyISAM，那么是 18 

因为 MyISAM 表会把自增主键的最大 ID 记录到数据文件里，重启 MySQL 自增主键的最大

ID 也不会丢失 

（2）如果表的类型是 InnoDB，那么是 15 

InnoDB 表只是把自增主键的最大 ID 记录到内存中，所以重启数据库或者是对表进行

OPTIMIZE 操作，都会导致最大 ID 丢失 

 

## 2、   Mysql 的技术特点是什么？ 

 

Mysql 数据库软件是一个客户端或服务器系统，其中包括：支持各种客户端程序和库的多

线程 SQL 服务器、不同的后端、广泛的应用程序编程接口和管理工具。 

 

## 3、   Heap 表是什么？ 

 

HEAP 表存在于内存中，用于临时高速存储。 

 

BLOB 或 TEXT 字段是不允许的 

只能使用比较运算符=，<，>，=>，= < 

HEAP 表不支持 AUTO_INCREMENT 索引不可为 NULL 

## 4、   Mysql 服务器默认端口是什么？ 

 

Mysql 服务器的默认端口是 3306。 

 

## 5、   与 Oracle 相比，Mysql 有什么优势？ 

 

Mysql 是开源软件，随时可用，无需付费。 

Mysql 是便携式的带有命令提示符的 GUI。 

使用 Mysql 查询浏览器支持管理 

## 6、   如何区分 FLOAT 和 DOUBLE？ 

 

以下是 FLOAT 和 DOUBLE 的区别： 

 

浮点数以 8 位精度存储在 FLOAT 中，并且有四个字节。浮点数存储在 DOUBLE 中，精度为 18 位，有八个字节。 

## 7、   区分 CHAR_LENGTH 和 LENGTH？ 

 

CHAR_LENGTH 是字符数，而 LENGTH 是字节数。Latin 字符的这两个数据是相同的，但是对于 Unicode 和其他编码，它们是不同的。 

 

## 8、   请简洁描述 Mysql 中 InnoDB 支持的四种事务隔离级别名称，以及逐级之间的区别？ SQL 标准定义的四个隔离级别为： 

 

read uncommited ：读到未提交数据 read committed：脏读，不可重复读 repeatable read：可重读 serializable ：串行事物 

 

 

 

## 9、   在 Mysql 中 ENUM 的用法是什么？ 

 

ENUM 是一个字符串对象，用于指定一组预定义的值，并可在创建表时使用。 

 

Create table size(name ENUM('Smail,'Medium','Large'); 

 

## 10、  如何定义 REGEXP？ 

 

REGEXP 是模式匹配，其中匹配模式在搜索值的任何位置。 

 

## 11、  CHAR 和 VARCHAR 的区别？ 

 

以下是 CHAR 和 VARCHAR 的区别： 

 

CHAR 和 VARCHAR 类型在存储和检索方面有所不同 

CHAR 列长度固定为创建表时声明的长度，长度值范围是 1 到 255 

 

当 CHAR 值被存储时，它们被用空格填充到特定长度，检索 CHAR 值时需删除尾随空格。 

## 12、  列的字符串类型可以是什么？ 

 

字符串类型是： 

 

SET 

BLOB 

ENUM 

CHAR 

TEXT 

VARCHAR 

## 13、  如何获取当前的 Mysql 版本？ 

 

SELECT VERSION();用于获取当前 Mysql 的版本。 

 

## 14、  Mysql 中使用什么存储引擎？存储引擎称为表类型，数据使用各种技术存储在文件中。 

 

技术涉及： 

 

Storage mechanism 

Locking levels 

Indexing 

Capabilities and functions. 

## 15、  Mysql 驱动程序是什么？ 

 

以下是 Mysql 中可用的驱动程序： 

 

PHP 驱动程序 

JDBC 驱动程序 

ODBC 驱动程序 

CWRAPPER 

PYTHON 驱动程序 

PERL 驱动程序 

RUBY 驱动程序 

CAP11PHP 驱动程序 

Ado.net5.mxj 

## 16、  TIMESTAMP 在 UPDATE CURRENT_TIMESTAMP 数据类型上做什么？ 

 

创建表时 TIMESTAMP 列用 Zero 更新。只要表中的其他字段发生更改，UPDATE CURRENT_TIMESTAMP 修饰符就将时间戳字段更新为当前时间。 

 

## 17、  主键和候选键有什么区别？ 

 表格的每一行都由主键唯一标识,一个表只有一个主键。 

 主键也是候选键。按照惯例，候选键可以被指定为主键，并且可以用于任何外键引用。 

 

## 18、  如何使用 Unix shell 登录 Mysql？ 

 

我们可以通过以下命令登录： 

 

[mysql dir]/bin/mysql -h hostname -u 

## 19、  myisamchk 是用来做什么的？ 

 它用来压缩 MyISAM 表，这减少了磁盘或内存使用。 

 

## 20、  MYSQL 数据库服务器性能分析的方法命令有哪些? 

 

 

## 21、  如何控制 HEAP 表的最大尺寸？ 

 

Heal 表的大小可通过称为 max_heap_table_size 的 Mysql 配置变量来控制。 

 

## 22、  MyISAM Static 和 MyISAM Dynamic 有什么区别？ 

 

在 MyISAM  Static 上的所有字段有固定宽度。动态 MyISAM 表将具有像 TEXT，BLOB 等字段，以适应不同长度的数据类型。点击这里有一套最全阿里面试题总结。 

 

MyISAM Static 在受损情况下更容易恢复。 

 

## 23、  federated 表是什么？ 

 

federated 表，允许访问位于其他服务器数据库上的表。 

 

## 24、  如果一个表有一列定义为 TIMESTAMP，将发生什么？ 

 

每当行被更改时，时间戳字段将获取当前时间戳。 

 

## 25、  列设置为 AUTO INCREMENT 时，如果在表中达到最大值，会发生什么情况？ 

 

它会停止递增，任何进一步的插入都将产生错误，因为密钥已被使用。 

 

## 26、  怎样才能找出最后一次插入时分配了哪个自动增量？ 

 

LAST_INSERT_ID 将返回由 Auto_increment 分配的最后一个值，并且不需要指定表名称。 

 

## 27、  你怎么看到为表格定义的所有索引？ 

 

索引是通过以下方式为表格定义的： 

 

SHOW INDEX FROM 

 

## 28.、LIKE 声明中的％和_是什么意思？ 



％对应于 0 个或更多字符，_只是 LIKE 语句中的一个字符。 

 

## 29、如何在 Unix 和 Mysql 时间戳之间进行转换？ 

 

UNIX_TIMESTAMP 是从 Mysql 时间戳转换为 Unix 时间戳的命令 

FROM_UNIXTIME 是从 Unix 时间戳转换为 Mysql 时间戳的命令 

## 30、列对比运算符是什么？ 

在 SELECT 语句的列比较中使用=，<>，<=，<，> =，>，<<，>>，<=>，AND，OR 或 LIKE 运算符。 

 

## 31、我们如何得到受查询影响的行数？ 

 

行数可以通过以下代码获得： 

 

SELECT COUNT(user_id)FROM users; 

 

## 32、Mysql 查询是否区分大小写？ 

 

不区分 

 

SELECT VERSION(), CURRENT_DATE; 

 

SeLect version(), current_date; 

 

seleCt vErSiOn(), current_DATE; 

 所有这些例子都是一样的，Mysql 不区分大小写。 

 

## 33.、LIKE 和 REGEXP 操作有什么区别？ 

 

LIKE 和 REGEXP 运算符用于表示^和％。 

SELECT * FROM employee WHERE emp_name REGEXP "^b"; 

SELECT * FROM employee WHERE emp_name LIKE "%b"; 

## 34.、BLOB 和 TEXT 有什么区别？ 

 

BLOB 是一个二进制对象，可以容纳可变数量的数据。有四种类型的 BLOB - 

 

TINYBLOB 

BLOB 

MEDIUMBLOB 和 LONGBLOB 它们只能在所能容纳价值的最大长度上有所不同。 

 

TEXT 是一个不区分大小写的 BLOB。四种 TEXT 类型 

 

TINYTEXT 

TEXT 

MEDIUMTEXT 和 LONGTEXT 

它们对应于四种 BLOB 类型，并具有相同的最大长度和存储要求。 

BLOB 和 TEXT 类型之间的唯一区别在于对 BLOB 值进行排序和比较时区分大小写，对 TEXT 值不区分大小写。 

 

## 35、mysql_fetch_array 和 mysql_fetch_object 的区别是什么？ 

 

以下是 mysql_fetch_array 和 mysql_fetch_object 的区别： 

 mysql_fetch_array（） - 将结果行作为关联数组或来自数据库的常规数组返回。 

 mysql_fetch_object - 从数据库返回结果行作为对象。 

 

## 36、我们如何在 mysql 中运行批处理模式？ 

 

以下命令用于在批处理模式下运行： 

 

mysql; 

 

mysql mysql.out 

 

## 37、MyISAM 表格将在哪里存储，并且还提供其存储格式？ 

 

每个 MyISAM 表格以三种格式存储在磁盘上： 

 

·“.frm”文件存储表定义 

 

·数据文件具有“.MYD”（MYData）扩展名 

 

索引文件具有“.MYI”（MYIndex）扩展名 

 

## 38.、Mysql 中有哪些不同的表格？ 

 

共有 5 种类型的表格： 

 

MyISAM 

Heap 

Merge 

INNODB 

ISAM 

MyISAM 是 Mysql 的默认存储引擎。 

 

## 39、ISAM 是什么？ 

 

ISAM 简称为索引顺序访问方法。它是由 IBM 开发的，用于在磁带等辅助存储系统上存储和检索数据。 

 

## 40、InnoDB 是什么？ 

 

lnnoDB 是一个由 Oracle 公司开发的 Innobase Oy 事务安全存储引擎。 

 

## 41、Mysql 如何优化 DISTINCT？ 

 

DISTINCT 在所有列上转换为 GROUP BY，并与 ORDER BY 子句结合使用。 

 

1 

SELECT DISTINCT t1.a FROM t1,t2 where t1.a=t2.a; 

## 42、如何输入字符为十六进制数字？ 

 

如果想输入字符为十六进制数字，可以输入带有单引号的十六进制数字和前缀（X），或者只用（Ox）前缀输入十六进制数字。 

 

如果表达式上下文是字符串，则十六进制数字串将自动转换为字符串。 

 

## 43、如何显示前 50 行？ 

 

在 Mysql 中，使用以下代码查询显示前 50 行： 

 

SELECT*FROM 

 

LIMIT 0,50; 

 

## 44、可以使用多少列创建索引？ 

 

任何标准表最多可以创建 16 个索引列。 

 

## 45、NOW（）和 CURRENT_DATE（）有什么区别？ 

 

NOW（）命令用于显示当前年份，月份，日期，小时，分钟和秒。 

 

CURRENT_DATE（）仅显示当前年份，月份和日期。 

 

## 46、什么样的对象可以使用 CREATE 语句创建？ 

 

以下对象是使用 CREATE 语句创建的： 

 

DATABASE 

EVENT 

FUNCTION 

INDEX 

PROCEDURE 

TABLE 

TRIGGER 

USER 

VIEW 

## 47、Mysql 表中允许有多少个 TRIGGERS？ 

 

在 Mysql 表中允许有六个触发器，如下： 

 

BEFORE INSERT 

AFTER INSERT 

BEFORE UPDATE 

AFTER UPDATE 

BEFORE DELETE 

AFTER DELETE 

## 48、什么是非标准字符串类型？ 

 

以下是非标准字符串类型： 

 

TINYTEXT 

TEXT 

MEDIUMTEXT 

LONGTEXT 

## 49、什么是通用 SQL 函数？ 

 

CONCAT(A, B) - 连接两个字符串值以创建单个字符串输出。通常用于将两个或多个字段合并为一个字段。 

FORMAT(X, D)- 格式化数字 X 到 D 有效数字。 

CURRDATE(), CURRTIME()- 返回当前日期或时间。 

NOW（） - 将当前日期和时间作为一个值返回。 

MONTH（），DAY（），YEAR（），WEEK（），WEEKDAY（） - 从日期值中提取给定数据。 HOUR（），MINUTE（），SECOND（） - 从时间值中提取给定数据。 DATEDIFF（A，B） - 确定两个日期之间的差异，通常用于计算年龄 SUBTIMES（A，B） - 确定两次之间的差异。 

FROMDAYS（INT） - 将整数天数转换为日期值。 

## 50、解释访问控制列表 

 

ACL（访问控制列表）是与对象关联的权限列表。这个列表是 Mysql 服务器安全模型的基础，它有助于排除用户无法连接的问题。 

 

Mysql 将 ACL（也称为授权表）缓存在内存中。当用户尝试认证或运行命令时，Mysql 会按照预定的顺序检查 ACL 的认证信息和权限。 

 

## 51、MYSQL 支持事务吗？ 

 

在缺省模式下，MYSQL 是 autocommit 模式的，所有的数据库更新操作都会即时提交，所以在缺省情况下，mysql 是不支持事务的。 

 

但是如果你的 MYSQL 表类型是使用 InnoDB Tables 或 BDB tables 的话，你的 MYSQL 就可以使用事务处理,使用 SET AUTOCOMMIT=0 就可以使 MYSQL 允许在非 autocommit 模式，在非 autocommit 模式下，你必须使用 COMMIT 来提交你的更改，或者用 ROLLBACK 来回滚你的更改。 

 

示例如下： 

 

一 

 

START TRANSACTION; 

 

SELECT @A:=SUM(salary) FROM table1 WHERE type=1; 

 

UPDATE table2 SET summmary=@A WHERE type=1; 

 

COMMIT; 

 

## 52、mysql 里记录货币用什么字段类型好 

 

NUMERIC 和 DECIMAL 类型被 Mysql 实现为同样的类型，这在 SQL92 标准允许。他们被用于保存值，该值的准确精度是极其重要的值，例如与金钱有关的数据。当声明一个类是这些类型之一时，精度和规模的能被(并且通常是)指定；点击这里有一套最全阿里面试题总结。 

 

例如： 

 

salary DECIMAL(9,2) 

 

在这个例子中，9(precision)代表将被用于存储值的总的小数位数，而 2(scale)代表将被用于存储小数点后的位数。 

 

因此，在这种情况下，能被存储在 salary 列中的值的范围是从-9999999.99 到 9999999.99。在 ANSI/ISO SQL92 中，句法 DECIMAL(p)等价于 DECIMAL(p,0)。 

 

同样，句法 DECIMAL 等价于 DECIMAL(p,0)，这里实现被允许决定值 p。Mysql 当前不支持 DECIMAL/NUMERIC 数据类型的这些变种形式的任一种。 

 

这一般说来不是一个严重的问题，因为这些类型的主要益处得自于明显地控制精度和规模的能力。 

 

DECIMAL 和 NUMERIC 值作为字符串存储，而不是作为二进制浮点数，以便保存那些值的小数精度。 

 

一个字符用于值的每一位、小数点(如果 scale>0)和“-”符号(对于负值)。如果 scale 是 0，

DECIMAL 和 NUMERIC 值不包含小数点或小数部分。 

 

DECIMAL 和 NUMERIC 值得最大的范围与 DOUBLE 一样，但是对于一个给定的 DECIMAL 或

NUMERIC 列，实际的范围可由制由给定列的 precision 或 scale 限制。 

 

当这样的列赋给了小数点后面的位超过指定 scale 所允许的位的值，该值根据 scale 四舍五入。 

 

当一个 DECIMAL 或 NUMERIC 列被赋给了其大小超过指定(或缺省的）precision 和 scale 隐含的范围的值，Mysql 存储表示那个范围的相应的端点值。 

 

我希望本文可以帮助你提升技术水平。那些，感觉学的好难，甚至会令你沮丧的人，别担心，我认为，如果你愿意试一试本文介绍的几点，会向前迈进，克服这种感觉。这些要点也许对你不适用，但你会明确一个重要的道理：接受自己觉得受困这个事实是摆脱这个困境的第一步。 

 

## 53、MYSQL 数据表在什么情况下容易损坏？ 

 

服务器突然断电导致数据文件损坏。 

强制关机，没有先关闭 mysql 服务等。 

## 54、mysql 有关权限的表都有哪几个？ 

 

Mysql 服务器通过权限表来控制用户对数据库的访问，权限表存放在 mysql 数据库里，由 mysql_install_db 脚本初始化。这些权限表分别 user，db，table_priv，columns_priv 和 host。 

 

## 55、Mysql 中有哪几种锁？ 

 

MyISAM 支持表锁，InnoDB 支持表锁和行锁，默认为行锁 

表级锁：开销小，加锁快，不会出现死锁。锁定粒度大，发生锁冲突的概率最高，并发量最低 

行级锁：开销大，加锁慢，会出现死锁。锁力度小，发生锁冲突的概率小，并发度最高





## 基础



### 2、详细说一下一条 MySQL 语句执行的步骤

Server 层按顺序执行 SQL 的步骤为：

- 客户端请求 -> 连接器（验证用户身份，给予权限）
- 查询缓存（存在缓存则直接返回，不存在则执行后续操作）
- 分析器（对 SQL 进行词法分析和语法分析操作）
- 优化器（主要对执行的 SQL 优化选择最优的执行方案方法）
- 执行器（执行时会先看用户是否有执行权限，有才去使用这个引擎提供的接口）-> 去引擎层获取数据返回（如果开启查询缓存则会缓存查询结果）

## 索引相关

### 3、MySQL 使用索引的原因？

根本原因

- 索引的出现，就是为了提高数据查询的效率，就像书的目录一样。
- 对于数据库的表而言，索引其实就是它的“目录”。

扩展

- 创建唯一性索引，可以保证数据库表中每一行数据的唯一性。
- 帮助引擎层避免排序和临时表
- 将随机 IO 变为顺序 IO，加速表和表之间的连接。

### 4、索引的三种常见底层数据结构以及优缺点

三种常见的索引底层数据结构：分别是哈希表、有序数组和搜索树。

- 哈希表这种适用于等值查询的场景，比如 memcached 以及其它一些 NoSQL 引擎，不适合范围查询。
- 有序数组索引只适用于静态存储引擎，等值和范围查询性能好，但更新数据成本高。
- N 叉树由于读写上的性能优点以及适配磁盘访问模式以及广泛应用在数据库引擎中。
- 扩展（以 InnoDB 的一个整数字段索引为例，这个 N 差不多是 1200。棵树高是 4 的时候，就可以存 1200 的 3 次方个值，这已经 17 亿了。考虑到树根的数据块总是在内存中的，一个 10 亿行的表上一个整数字段的索引，查找一个值最多只需要访问 3 次磁盘。其实，树的第二层也有很大概率在内存中，那么访问磁盘的平均次数就更少了。）

### 5、索引的常见类型以及它是如何发挥作用的？

根据叶子节点的内容，索引类型分为主键索引和非主键索引。

- 主键索引的叶子节点存的整行数据，在InnoDB里也被称为聚簇索引。
- 非主键索引叶子节点存的主键的值，在InnoDB里也被称为二级索引。

### 6、MyISAM 和 InnoDB 实现 B 树索引方式的区别是什么？

- InnoDB 存储引擎：B+ 树索引的叶子节点保存数据本身，其数据文件本身就是索引文件。
- MyISAM 存储引擎：B+ 树索引的叶子节点保存数据的物理地址，叶节点的 data 域存放的是数据记录的地址，索引文件和数据文件是分离的。

### 7、InnoDB 为什么设计 B+ 树索引？

两个考虑因素：

- InnoDB 需要执行的场景和功能需要在特定查询上拥有较强的性能。
- CPU 将磁盘上的数据加载到内存中需要花费大量时间。

为什么选择 B+ 树：

- 哈希索引虽然能提供O（1）复杂度查询，但对范围查询和排序却无法很好的支持，最终会导致全表扫描。

- B 树能够在非叶子节点存储数据，但会导致在查询连续数据可能带来更多的随机 IO。

- 而 B+ 树的所有叶节点可以通过指针来相互连接，减少顺序遍历带来的随机 IO。

- 普通索引还是唯一索引？

  由于唯一索引用不上 change buffer 的优化机制，因此如果业务可以接受，从性能角度出发建议你优先考虑非唯一索引。





## 日志相关

### 11、MySQL 的 change buffer 是什么？

- 当需要更新一个数据页时，如果数据页在内存中就直接更新；而如果这个数据页还没有在内存中的话，在不影响数据一致性的前提下，InnoDB 会将这些更新操作缓存在 change buffer 中。
- 这样就不需要从磁盘中读入这个数据页了，在下次查询需要访问这个数据页的时候，将数据页读入内存，然后执行 change buffer 中与这个页有关的操作。通过这种方式就能保证这个数据逻辑的正确性。
- 注意唯一索引的更新就不能使用 change buffer，实际上也只有普通索引可以使用。
- 适用场景：
- - 对于写多读少的业务来说，页面在写完以后马上被访问到的概率比较小，此时 change buffer 的使用效果最好。这种业务模型常见的就是账单类、日志类的系统。
  - 反过来，假设一个业务的更新模式是写入之后马上会做查询，那么即使满足了条件，将更新先记录在 change buffer，但之后由于马上要访问这个数据页，会立即触发 merge 过程。这样随机访问 IO 的次数不会减少，反而增加了 change buffer 的维护代价。

### 12、MySQL 是如何判断一行扫描数的？

- MySQL 在真正开始执行语句之前，并不能精确地知道满足这个条件的记录有多少条。
- 而只能根据统计信息来估算记录数。这个统计信息就是索引的“区分度。

### 13、MySQL 的 redo log 和 binlog 区别？

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/herongwei/mysql-a2b8e123-41cb-4717-9225-3a8b49197004.png)

### 14、为什么需要 redo log？

- redo log 主要用于 MySQL 异常重启后的一种数据恢复手段，确保了数据的一致性。
- 其实是为了配合 MySQL 的 WAL 机制。因为 MySQL 进行更新操作，为了能够快速响应，所以采用了异步写回磁盘的技术，写入内存后就返回。但是这样，会存在 **crash后** 内存数据丢失的隐患，而 redo log 具备 crash safe 的能力。

### 15、为什么 redo log 具有 crash-safe 的能力，是 binlog 无法替代的？

第一点：redo log 可确保 innoDB 判断哪些数据已经刷盘，哪些数据还没有

- redo log 和 binlog 有一个很大的区别就是，一个是循环写，一个是追加写。也就是说 redo log 只会记录未刷盘的日志，已经刷入磁盘的数据都会从 redo log 这个有限大小的日志文件里删除。binlog 是追加日志，保存的是全量的日志。
- 当数据库 crash 后，想要恢复**未刷盘但已经写入 redo log 和 binlog 的数据**到内存时，binlog 是无法恢复的。虽然 binlog 拥有全量的日志，但没有一个标志让 innoDB 判断哪些数据已经刷盘，哪些数据还没有。
- 但 redo log 不一样，只要刷入磁盘的数据，都会从 redo log 中抹掉，因为是循环写！数据库重启后，直接把 redo log 中的数据都恢复至内存就可以了。

第二点：如果 redo log 写入失败，说明此次操作失败，事务也不可能提交

- redo log 每次更新操作完成后，就一定会写入日志，如果**写入失败**，说明此次操作失败，事务也不可能提交。
- redo log 内部结构是基于页的，记录了这个页的字段值变化，只要crash后读取redo log进行重放，就可以恢复数据。
- 这就是为什么 redo log 具有 crash-safe 的能力，而 binlog 不具备。

### 16、当数据库 crash 后，如何恢复未刷盘的数据到内存中？

根据 redo log 和 binlog 的两阶段提交，未持久化的数据分为几种情况：

- change buffer 写入，redo log 虽然做了 fsync 但未 commit，binlog 未 fsync 到磁盘，这部分数据丢失。
- change buffer 写入，redo log fsync 未 commit，binlog 已经 fsync 到磁盘，先从 binlog 恢复 redo log，再从 redo log 恢复 change buffer。
- change buffer 写入，redo log 和 binlog 都已经 fsync，直接从 redo log 里恢复。

### 17、redo log 写入方式？

redo log包括两部分内容，分别是内存中的**日志缓冲**(redo log buffer)和磁盘上的**日志文件**(redo log file)。

MySQL 每执行一条 DML 语句，会先把记录写入 **redo log buffer（用户空间）** ，再保存到内核空间的缓冲区 OS-buffer 中，后续某个时间点再一次性将多个操作记录写到 **redo log file（刷盘）** 。这种先写日志，再写磁盘的技术，就是**WAL**。

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/herongwei/mysql-f901a97f-9d82-4d4e-a5be-559a64b3d9b8.png)

可以发现，redo log buffer写入到redo log file，是经过OS buffer中转的。其实可以通过参数innodb_flush_log_at_trx_commit进行配置，参数值含义如下：

- 0：称为**延迟写**，事务提交时不会将redo log buffer中日志写入到OS buffer，而是每秒写入OS buffer并调用写入到redo log file中。
- 1：称为**实时写**，实时刷”，事务每次提交都会将redo log buffer中的日志写入OS buffer并保存到redo log file中。
- 2： 称为**实时写，延迟刷**。每次事务提交写入到OS buffer，然后是每秒将日志写入到redo log file。

### 18、redo log 的执行流程?

我们来看下Redo log的执行流程，假设执行的 SQL 如下：



```text
update T set a =1 where id =666
```

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/herongwei/mysql-43fe6587-0cb8-49aa-bd93-0119e46430d7.png)

1. MySQL 客户端将请求语句 update T set a =1 where id =666，发往 MySQL Server 层。
2. MySQL Server 层接收到 SQL 请求后，对其进行分析、优化、执行等处理工作，将生成的 SQL 执行计划发到 InnoDB 存储引擎层执行。
3. InnoDB 存储引擎层将**a修改为1**的这个操作记录到内存中。
4. 记录到内存以后会修改 redo log 的记录，会在添加一行记录，其内容是**需要在哪个数据页上做什么修改**。
5. 此后，将事务的状态设置为 prepare ，说明已经准备好提交事务了。
6. 等到 MySQL Server 层处理完事务以后，会将事务的状态设置为 **commit**，也就是提交该事务。
7. 在收到事务提交的请求以后，**redo log** 会把刚才写入内存中的操作记录写入到磁盘中，从而完成整个日志的记录过程。

### 19、binlog 的概念是什么，起到什么作用， 可以保证 crash-safe 吗?

- binlog 是归档日志，属于 MySQL Server 层的日志。可以实现**主从复制**和**数据恢复**两个作用。
- 当需要**恢复数据**时，可以取出某个时间范围内的 binlog 进行重放恢复。
- 但是 binlog 不可以做 crash safe，因为 crash 之前，binlog **可能没有写入完全** MySQL 就挂了。所以需要配合 **redo log** 才可以进行 crash safe。

### 20、什么是两阶段提交？

MySQL 将 redo log 的写入拆成了两个步骤：prepare 和 commit，中间再穿插写入binlog，这就是"两阶段提交"。

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/herongwei/mysql-11420486-f9d0-483a-ba2e-a742ec4c518d.png)

而两阶段提交就是让这两个状态保持逻辑上的一致。redolog 用于恢复主机故障时的未更新的物理数据，binlog 用于备份操作。两者本身就是两个独立的个体，要想保持一致，就必须使用分布式事务的解决方案来处理。

**为什么需要两阶段提交呢?**

- 如果不用两阶段提交的话，可能会出现这样情况
- 先写 redo log，crash 后 bin log 备份恢复时少了一次更新，与当前数据不一致。
- 先写 bin log，crash 后，由于 redo log 没写入，事务无效，所以后续 bin log 备份恢复时，数据不一致。
- 两阶段提交就是为了保证 redo log 和 binlog 数据的安全一致性。只有在这两个日志文件逻辑上高度一致了才能放心的使用。

在恢复数据时，redolog 状态为 commit 则说明 binlog 也成功，直接恢复数据；如果 redolog 是 prepare，则需要查询对应的 binlog事务是否成功，决定是回滚还是执行。

### 21、MySQL 怎么知道 binlog 是完整的?

一个事务的 binlog 是有完整格式的：

- statement 格式的 binlog，最后会有 COMMIT；
- row 格式的 binlog，最后会有一个 XID event。

### 22、什么是 WAL 技术，有什么优点？

WAL，中文全称是 Write-Ahead Logging，它的关键点就是日志先写内存，再写磁盘。MySQL 执行更新操作后，**在真正把数据写入到磁盘前，先记录日志**。

好处是不用每一次操作都实时把数据写盘，就算 crash 后也可以通过redo log 恢复，所以能够实现快速响应 SQL 语句。

### 23、binlog 日志的三种格式

binlog 日志有三种格式

- Statement：基于SQL语句的复制((statement-based replication,SBR))
- Row：基于行的复制。(row-based replication,RBR)
- Mixed：混合模式复制。(mixed-based replication,MBR)

**Statement格式**

每一条会修改数据的 SQL 都会记录在 binlog 中

- 优点：不需要记录每一行的变化，减少了binlog日志量，节约了IO，提高性能。
- 缺点：由于记录的只是执行语句，为了这些语句能在备库上正确运行，还必须记录每条语句在执行的时候的一些相关信息，以保证所有语句能在备库得到和在主库端执行时候相同的结果。

**Row格式**

不记录 SQL 语句上下文相关信息，仅保存哪条记录被修改。

- 优点：binlog 中可以不记录执行的 SQL 语句的上下文相关的信息，仅需要记录那一条记录被修改成什么了。所以rowlevel的日志内容会非常清楚的记录下每一行数据修改的细节。不会出现某些特定情况下的存储过程、或 function、或trigger的调用和触发无法被正确复制的问题。
- 缺点:可能会产生大量的日志内容。

**Mixed格式**

实际上就是 Statement 与 Row 的结合。一般的语句修改使用 statment 格式保存 binlog，如一些函数，statement 无法完成主从复制的操作，则采用 row 格式保存 binlog，MySQL 会根据执行的每一条具体的 SQL 语句来区分对待记录的日志形式。

### 24、redo log日志格式

![img](http://cdn.tobebetterjavaer.com/tobebetterjavaer/images/sidebar/herongwei/mysql-ee8a859f-d1e8-4ab6-94d1-9733373be825.png)

redo log buffer (内存中)是由首尾相连的四个文件组成的，它们分别是：ib_logfile_1、ib_logfile_2、ib_logfile_3、ib_logfile_4。

- write pos 是当前记录的位置，一边写一边后移，写到第 3 号文件末尾后就回到 0 号文件开头。
- checkpoint 是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。
- write pos 和 checkpoint 之间的是“粉板”上还空着的部分，可以用来记录新的操作。
- 如果 write pos 追上 checkpoint，表示“粉板”满了，这时候不能再执行新的更新，得停下来先擦掉一些记录，把 checkpoint 推进一下。
- 有了 redo log，当数据库发生宕机重启后，可通过 redo log将未落盘的数据（check point之后的数据）恢复，保证已经提交的事务记录不会丢失，这种能力称为**crash-safe**。

### 25、原本可以执行得很快的 SQL 语句，执行速度却比预期的慢很多，原因是什么？如何解决？

原因：从大到小可分为四种情况

- MySQL 数据库本身被堵住了，比如：系统或网络资源不够。
- SQL 语句被堵住了，比如：表锁，行锁等，导致存储引擎不执行对应的 SQL 语句。
- 确实是索引使用不当，没有走索引。
- 表中数据的特点导致的，走了索引，但回表次数庞大。

解决：

- 考虑采用 force index 强行选择一个索引
- 考虑修改语句，引导 MySQL 使用我们期望的索引。比如把“order by b limit 1” 改成 “order by b,a limit 1” ，语义的逻辑是相同的。
- 第三种方法是，在有些场景下，可以新建一个更合适的索引，来提供给优化器做选择，或删掉误用的索引。
- 如果确定是索引根本没必要，可以考虑删除索引。

### 26、InnoDB 数据页结构

一个数据页大致划分七个部分

- File Header：表示页的一些通用信息，占固定的38字节。
- page Header：表示数据页专有信息，占固定的56字节。
- inimum+Supermum：两个虚拟的伪记录，分别表示页中的最小记录和最大记录，占固定的26字节。
- User Records：真正存储我们插入的数据，大小不固定。
- Free Space：页中尚未使用的部分，大小不固定。
- Page Directory：页中某些记录的相对位置，也就是各个槽对应的记录在页面中的地址偏移量。
- File Trailer：用于检验页是否完整，占固定大小 8 字节。

## 数据相关

### 27、MySQL 是如何保证数据不丢失的？

- 只要redolog 和 binlog 保证持久化磁盘就能确保MySQL异常重启后回复数据
- 在恢复数据时，redolog 状态为 commit 则说明 binlog 也成功，直接恢复数据；如果 redolog 是 prepare，则需要查询对应的 binlog事务是否成功，决定是回滚还是执行。

### 28、误删数据怎么办？

DBA 的最核心的工作就是保证数据的完整性，先要做好预防，预防的话大概是通过这几个点：

- 权限控制与分配(数据库和服务器权限)
- 制作操作规范
- 定期给开发进行培训
- 搭建延迟备库
- 做好 SQL 审计，只要是对线上数据有更改操作的语句(DML和DDL)都需要进行审核
- 做好备份。备份的话又分为两个点 (1)如果数据量比较大，用物理备份 xtrabackup。定期对数据库进行全量备份，也可以做增量备份。 (2)如果数据量较少，用 mysqldump 或者 mysqldumper。再利用 binlog 来恢复或者搭建主从的方式来恢复数据。 定期备份binlog 文件也是很有必要的
- 如果发生了数据删除的操作，又可以从以下几个点来恢复:
- DML 误操作语句造成数据不完整或者丢失。可以通过 flashback，美团的 myflash，也是一个不错的工具，本质都差不多，都是先解析 binlog event，然后在进行反转。把 delete 反转为insert，insert 反转为 delete，update前后 image 对调。所以必须设置binlog_format=row 和 binlog_row_image=full，切记恢复数据的时候，应该先恢复到临时的实例，然后在恢复回主库上。
- DDL语句误操作(truncate和drop)，由于DDL语句不管 binlog_format 是 row 还是 statement ，在 binlog 里都只记录语句，不记录 image 所以恢复起来相对要麻烦得多。只能通过全量备份+应用 binlog 的方式来恢复数据。一旦数据量比较大，那么恢复时间就特别长
- rm 删除：使用备份跨机房，或者最好是跨城市保存。

### 29、drop、truncate 和 delete 的区别

- DELETE 语句执行删除的过程是每次从表中删除一行，并且同时将该行的删除操作作为事务记录在日志中保存以便进行进行回滚操作。
- TRUNCATE TABLE 则一次性地从表中删除所有的数据并不把单独的删除操作记录记入日志保存，删除行是不能恢复的。并且在删除的过程中不会激活与表有关的删除触发器。执行速度快。
- drop语句将表所占用的空间全释放掉。
- 在速度上，一般来说，drop> truncate > delete。
- 如果想删除部分数据用 delete，注意带上 where 子句，回滚段要足够大；
- 如果想删除表，当然用 drop； 如果想保留表而将所有数据删除，如果和事务无关，用 truncate 即可；
- 如果和事务有关，或者想触发 trigger，还是用 delete； 如果是整理表内部的碎片，可以用 truncate 跟上 reuse stroage，再重新导入/插入数据。

### 30、在 MySQL 中有两个 kill 命令

- 一个是 kill query + 线程 id，表示终止这个线程中正在执行的语句
- 一个是 kill connection + 线程 id，这里 connection 可缺省，表示断开这个线程的连接

kill 不掉的原因

- kill命令被堵了，还没到位
- kill命令到位了，但是没被立刻触发
- kill命令被触发了，但执行完也需要时间

### 31、如何理解 MySQL 的边读边发

- 如果客户端接受慢，会导致 MySQL 服务端由于结果发不出去，这个事务的执行时间会很长。
- 服务端并不需要保存一个完整的结果集，取数据和发数据的流程都是通过一个 next_buffer 来操作的。
- 内存的数据页都是在 Buffer_Pool中操作的。
- InnoDB 管理 Buffer_Pool 使用的是改进的 LRU 算法，使用链表实现，实现上，按照 5:3 的比例把整个 LRU 链表分成了 young 区域和 old 区域。

### 32、MySQL 的大表查询为什么不会爆内存？

- 由于 MySQL 是边读变发，因此对于数据量很大的查询结果来说，不会再 server 端保存完整的结果集，所以，如果客户端读结果不及时，会堵住 MySQL 的查询过程，但是不会把内存打爆。
- InnoDB 引擎内部，由于有淘汰策略，InnoDB 管理 Buffer_Pool 使用的是改进的 LRU 算法，使用链表实现，实现上，按照 5:3 的比例把整个 LRU 链表分成了 young 区域和 old 区域。对冷数据的全扫描，影响也能做到可控制。

### 33、MySQL 临时表的用法和特性

- 只对当前session可见。
- 可以与普通表重名。
- 增删改查用的是临时表。
- show tables 不显示普通表。
- 在实际应用中，临时表一般用于处理比较复杂的计算逻辑。
- 由于临时表是每个线程自己可见的，所以不需要考虑多个线程执行同一个处理时临时表的重名问题，在线程退出的时候，临时表会自动删除。

### 34、MySQL 存储引擎介绍（InnoDB、MyISAM、MEMORY）

- InnoDB 是事务型数据库的首选引擎，支持事务安全表 (ACID)，支持行锁定和外键。MySQL5.5.5 之后，InnoDB 作为默认存储引擎
- MyISAM 基于 ISAM 的存储引擎，并对其进行扩展。它是在 Web、数据存储和其他应用环境下最常用的存储引擎之一。MyISAM 拥有较高的插入、查询速度，但不支持事务。在 MySQL5.5.5 之前的版本中，MyISAM 是默认存储引擎
- MEMORY 存储引擎将表中的数据存储到内存中，为查询和引用其他表数据提供快速访问。

### 35、都说 InnoDB 好，那还要不要使用 MEMORY 引擎？

- 内存表就是使用 memory 引擎创建的表
- 为什么我不建议你在生产环境上使用内存表。这里的原因主要包括两个方面：锁粒度问题；数据持久化问题。
- 由于重启会丢数据，如果一个备库重启，会导致主备同步线程停止；如果主库跟这个备库是双 M 架构，还可能导致主库的内存表数据被删掉。

### 36、如果数据库误操作, 如何执行数据恢复?

数据库在某个时候误操作，就可以找到距离误操作最近的时间节点的bin log，重放到临时数据库里，然后选择误删的数据节点，恢复到线上数据库。

## 主从备份相关

### 37、MySQL 是如何保证主备同步？

主备关系的建立：

- 一开始创建主备关系的时候，是由备库指定的，比如基于位点的主备关系，备库说“我要从binlog文件A的位置P”开始同步，主库就从这个指定的位置开始往后发。
- 而主备关系搭建之后，是主库决定要发给数据给备库的，所以主库有新的日志也会发给备库。

MySQL 主备切换流程：

- 客户端读写都是直接访问A，而节点B是备库，只要将A的更新都同步过来，到本地执行就可以保证数据是相同的。
- 当需要切换的时候就把节点换一下，A的节点B的备库

一个事务完整的同步过程：

- 备库B和主库A建立来了长链接，主库A内部专门线程用于维护了这个长链接。
- 在备库B上通过changemaster命令设置主库A的IP端口用户名密码以及从哪个位置开始请求binlog包括文件名和日志偏移量
- 在备库B上执行start-slave命令备库会启动两个线程：io_thread和sql_thread分别负责建立连接和读取中转日志进行解析执行
- 备库读取主库传过来的binlog文件备库收到文件写到本地成为中转日志
- 后来由于多线程复制方案的引入，sql_thread演化成了多个线程。

### 38、什么是主备延迟

主库和备库在执行同一个事务的时候出现时间差的问题，主要原因有：

- 有些部署条件下，备库所在机器的性能要比主库性能差。
- 备库的压力较大。
- 大事务，一个主库上语句执行10分钟，那么这个事务可能会导致从库延迟10分钟。

### 39、为什么要有多线程复制策略？

- 因为单线程复制的能力全面低于多线程复制，对于更新压力较大的主库，备库可能是一直追不上主库的，带来的现象就是备库上seconds_behind_master值越来越大。
- 在实际应用中，建议使用可靠性优先策略，减少主备延迟，提升系统可用性，尽量减少大事务操作，把大事务拆分小事务。

### 40、MySQL 的并行策略有哪些？

- 按表分发策略：如果两个事务更新不同的表，它们就可以并行。因为数据是存储在表里的，所以按表分发，可以保证两个 worker 不会更新同一行。缺点：如果碰到热点表，比如所有的更新事务都会涉及到某一个表的时候，所有事务都会被分配到同一个 worker 中，就变成单线程复制了。
- 按行分发策略：如果两个事务没有更新相同的行，它们在备库上可以并行。如果两个事务没有更新相同的行，它们在备库上可以并行执行。显然，这个模式要求 binlog 格式必须是 row。缺点：相比于按表并行分发策略，按行并行策略在决定线程分发的时候，需要消耗更多的计算资源。

### 41、MySQL的一主一备和一主多从有什么区别？

在一主一备的双 M 架构里，主备切换只需要把客户端流量切到备库；而在一主多从架构里，主备切换除了要把客户端流量切到备库外，还需要把从库接到新主库上。

### 42、主库出问题如何解决?

- 基于位点的主备切换：存在找同步位点这个问题
- MySQL 5.6 版本引入了 GTID，彻底解决了这个困难。那么，GTID 到底是什么意思，又是如何解决找同步位点这个问题呢？
- GTID：全局事务 ID，是一个事务在提交的时候生成的，是这个事务的唯一标识；它由两部分组成，格式是：GTID=server_uuid:gno
- 每个 MySQL 实例都维护了一个 GTID 集合，用来对应“这个实例执行过的所有事务”。
- 在基于 GTID 的主备关系里，系统认为只要建立主备关系，就必须保证主库发给备库的日志是完整的。因此，如果实例 B 需要的日志已经不存在，A’就拒绝把日志发给 B。

### 43、MySQL 读写分离涉及到过期读问题的几种解决方案?

- 强制走主库方案
- sleep 方案
- 判断主备无延迟方案
- 配合 semi-sync 方案
- 等主库位点方案
- GTID 方案。
- 实际生产中，先客户端对请求做分类，区分哪些请求可以接受过期读，而哪些请求完全不能接受过期读；然后，对于不能接受过期读的语句，再使用等 GTID 或等位点的方案。

### 44、MySQL的并发链接和并发查询有什么区别？

- 在执行show processlist的结果里，看到了几千个连接，指的是并发连接。而"当前正在执行"的语句，才是并发查询。
- 并发连接数多影响的是内存，并发查询太高对CPU不利。一个机器的CPU核数有限，线程全冲进来，上下文切换的成本就会太高。
- 所以需要设置参数：innodb_thread_concurrency 用来限制线程数，当线程数达到该参数，InnoDB就会认为线程数用完了，会阻止其他语句进入引擎执行。

## 性能相关

### 45、短时间提高 MySQL 性能的方法

- 第一种方法：先处理掉那些占着连接但是不工作的线程。或者再考虑断开事务内空闲太久的连接。 kill connection + id
- 第二种方法：减少连接过程的消耗：慢查询性能问题在 MySQL 中，会引发性能问题的慢查询，大体有以下三种可能：索引没有设计好；SQL 语句没写好；MySQL 选错了索引（force index）。

### 46、为什么 MySQL 自增主键 ID 不连续？

- 唯一键冲突
- 事务回滚
- 自增主键的批量申请
- 深层次原因是：MySQL 不判断自增主键是否存在，从而减少加锁的时间范围和粒度，这样能保持更高的性能，确保自增主键不能回退，所以才有自增主键不连续。
- 自增主键怎么做到唯一性？自增值加1来通过自增锁控制并发

### 47、InnoDB 为什么要用自增 ID 作为主键？

- 自增主键的插入模式，符合递增插入，每次都是追加操作，不涉及挪动记录，也不会触发叶子节点的分裂。
- 每次插入新的记录就会顺序添加到当前索引节点的后续位置，当一页写满，就会自动开辟一个新的页。
- 而有业务逻辑的字段做主键，不容易保证有序插入，由于每次插入主键的值近似于随机
- 因此每次新纪录都要被插到现有索引页得中间某个位置， 频繁的移动、分页操作造成了大量的碎片，得到了不够紧凑的索引结构，写数据成本较高。

### 48、如何最快的复制一张表？

- 为了避免对源表加读锁，更稳妥的方案是先将数据写到外部文本文件，然后再写回目标表
- 一种方法是，使用 mysqldump 命令将数据导出成一组 INSERT 语句
- 另一种方法是直接将结果导出成.csv 文件。MySQL 提供语法，用来将查询结果导出到服务端本地目录：`select * from db1.t where a>900 into outfile '/server_tmp/t.csv'`;得到.csv 导出文件后，你就可以用下面的 load data 命令将数据导入到目标表 db2.t 中：`load data infile '/server_tmp/t.csv' into table db2.t;`
- 物理拷贝：在 MySQL 5.6 版本引入了可传输表空间(transportable tablespace) 的方法，可以通过导出 + 导入表空间的方式，实现物理拷贝表的功能。

### 49、grant 和 flush privileges语句

- grant语句会同时修改数据表和内存，判断权限的时候使用的内存数据，因此，规范使用是不需要加上 flush privileges 语句。
- flush privileges 语句本身会用数据表的数据重建一份内存权限数据，所以在权限数据可能存在不一致的情况下再使用。

### 50、要不要使用分区表？

- 分区并不是越细越好。实际上，单表或者单分区的数据一千万行，只要没有特别大的索引，对于现在的硬件能力来说都已经是小表了。
- 分区也不要提前预留太多，在使用之前预先创建即可。比如，如果是按月分区，每年年底时再把下一年度的 12 个新分区创建上即可。对于没有数据的历史分区，要及时的 drop 掉。

### 51、join 用法

- 使用 left join 左边的表不一定是驱动表
- 如果需要 left join 的语义，就不能把被驱动表的字段放在 where 条件里面做等值判断或不等值判断，必须都写在 on 里面
- 标准的 group by 语句，是需要在 select 部分加一个聚合函数，比如`select a,count(*) from t group by a order by null;`

### 52、MySQL 有哪些自增ID？各自场景是什么？

- 表的自增 ID 达到上限之后，在申请值不会变化，进而导致联系插入数据的时候报主键冲突错误。
- row_id 达到上限之后，归 0 在重新递增，如果出现相同的 row_id 后写的数据会覆盖之前的数据。
- Xid 只需要不在同一个 binlog 文件出现重复值即可，理论上会出现重复值，但概率极小可忽略不计。
- InnoDB 的 max_trx_id 递增值每次 MySQL 重启会保存起来。
- Xid 是由 server 层维护的。InnoDB 内部使用 Xid，就是为了能够在 InnoDB 事务和 server 之间做关联。但是，InnoDB 自己的 trx_id，是另外维护的。
- thread_id 是我们使用中最常见的，而且也是处理得最好的一个自增 id 逻辑了。使用了insert_unique算法

### 53、Xid 在 MySQL 内部是怎么生成的呢？

**MySQL 内部维护了一个全局变量 global_query_id，每次执行语句（包括select语句）的时候将它赋值给 Query_id，然后给这个变量加 1。如果当前语句是这个事务执行的第一条语句，那么 MySQL 还会同时把 Query_id 赋值给这个事务的 Xid。**

而 global_query_id 是一个纯内存变量，重启之后就清零了。所以你就知道了，在同一个数据库实例中，不同事务的 Xid 也是有可能相同的。但是 MySQL 重启之后会重新生成新的 binlog 文件，这就保证了，同一个 binlog 文件里，Xid 一定是惟一的。

## 锁相关

### 54、说一下 MySQL 的锁

- MySQL 在 server 层 和 存储引擎层 都运用了大量的锁
- MySQL server 层需要讲两种锁，第一种是MDL(metadata lock) 元数据锁，第二种则 Table Lock 表锁。
- MDL 又名元数据锁，那么什么是元数据呢，任何描述数据库的内容就是元数据，比如我们的表结构、库结构等都是元数据。那为什么需要 MDL 呢？
- 主要解决两个问题：事务隔离问题；数据复制问题
- InnoDB 有五种表级锁：IS（意向读锁）；IX（意向写锁）；S（读）；X（写）；AUTO-INC
- 在对表进行select/insert/delete/update语句时候不会加表级锁
- IS和IX的作用是为了判断表中是否有已经被加锁的记录
- 自增主键的保障就是有 AUTO-INC 锁，是语句级别的：为表的某个列添加 AUTO_INCREMENT 属性，之后在插⼊记录时，可以不指定该列的值，系统会⾃动为它赋上单调递增的值。
- InnoDB 4 种行级锁
- RecordLock：记录锁
- GapLock：间隙锁解决幻读；前一次查询不存在的东西在下一次查询出现了，其实就是事务A中的两次查询之间事务B执行插入操作被事务A感知了
- Next-KeyLock：锁住某条记录又想阻止其它事务在改记录前面的间隙插入新纪录
- InsertIntentionLock：插入意向锁;如果插入到同一行间隙中的多个事务未插入到间隙内的同一位置则无须等待
- 行锁和表锁的抉择
  - 全表扫描用行级锁

### 55、什么是幻读？

值在同一个事务中，存在前后两次查询同一个范围的数据，第二次看到了第一次没有查询到的数据。

幻读出现的场景：

- 事务的隔离级别是可重复读，且是当前读。
- 幻读指新插入的行。

幻读带来的问题：

- 对行锁语义的破坏
- 破坏了数据一致性

解决：

- 加间隙锁，锁住行与行之间的间隙，阻塞新插入的操作。
- 带来的问题：降低并发度，可能导致死锁。

## 其它为什么系列

### 56、为什么 MySQL 会抖一下？

- 脏页会被后台线程自动 flush，也会由于数据页淘汰而触发 flush，而刷脏页的过程由于会占用资源，可能会让你的更新和查询语句的响应时间长一些。

### 57、为什么删除了表，表文件的大小还是没变？

- 数据项删除之后 InnoDB 某个页 page A 会被标记为可复用。
- delete 命令把整个表的数据删除，结果就是，所有的数据页都会被标记为可复用。但是磁盘上，文件不会变小。
- 经过大量增删改的表，都是可能是存在空洞的。这些空洞也占空间所以，如果能够把这些空洞去掉，就能达到收缩表空间的目的。
- 重建表，就可以达到这样的目的。可以使用 alter table A engine=InnoDB 命令来重建表。

### 58、`count(*)`实现方式以及各种 count 对比

- 对于 count(主键 id) 来说，InnoDB 引擎会遍历整张表，把每一行的 id 值都取出来，返回给 server 层。server 层拿到 id 后，判断是不可能为空的，就按行累加。
- 对于 count(1) 来说，InnoDB 引擎遍历整张表，但不取值。server 层对于返回的每一行，放一个数字“1”进去，判断是不可能为空的，按行累加。 单看这两个用法的差别的话，你能对比出来，count(1) 执行得要比 count(主键 id) 快。因为从引擎返回 id 会涉及到解析数据行，以及拷贝字段值的操作。
- 对于 count(字段) 来说：如果这个“字段”是定义为 not null 的话，一行行地从记录里面读出这个字段，判断不能为 null，按行累加；如果这个“字段”定义允许为 null，那么执行的时候，判断到有可能是 null，还要把值取出来再判断一下，不是 null 才累加。也就是前面的第一条原则，server 层要什么字段，InnoDB 就返回什么字段。
- 但是 `count *` 是例外，并不会把全部字段取出来，而是专门做了优化，不取值。`count(*)`肯定不是 null，按行累加。
- 所以结论是：按照效率排序的话，count(字段)`，所以建议尽量使用 `count(*)`。

### 59、orderby 排序内部原理

- MySQL 会为每个线程分配一个内存（sort-buffer）用于排序该内存大小为 sort_buffer_size；

- 如果排序的数据量小于 sort_buffer_size，排序就会在内存中完成；

  内部排序分为两种

- 全字段排序：到索引树上找到满足条件的主键ID根据主键ID去取出数据放到sort_buffer然后进行快速排序

- rowid排序：通过控制排序的行数据的长度来让sort_buffer中尽可能多的存放数据

- 如果数据量很大，内存中无法存下这么多，就会使用磁盘临时文件来辅助排序，称为外部排序；

- 外部排序，MySQL会分为好几份单独的临时文件来存放排序后的数据，一般是磁盘文件中进行归并，然后将这些文件合并成一个大文件；

### 60、如何高效的使用 MySQL 显式随机消息

- 随机取出 Y1,Y2,Y3之后，算出Ymax,Ymin
- 得到id集后算出Y1、Y2、Y3对应的三个id 最后 select * from t where id in (id1, id2, id3) 这样扫描的行数应该是C+Ymax+3



```mysql
  mysql> select count(*) into @C from t;
  set @Y1 = floor(@C * rand());
  set @Y2 = floor(@C * rand());
  set @Y3 = floor(@C * rand());
  Ymax = max(Y1,Y2,Y3)
  Ymin = min(Y1,Y2,Y3)
  select id from t limit Ymin，(Ymax - Ymin)
```





## Mybatis存在哪些优点和缺点

优点：
  1.基于SQL语句编程，相当灵活，不会对应用程序或者数据库的现有设计造成任何影响，SQL单独写，解除sql与程序代码的合，便于统一管理。
  2.与JDBC相比，减少了50%以上的代码量，消除了JDBC大量余的代码，不需要手动开关连接
  3.很好的与各种数据库兼容（因为MyBatis使用JDBC来连接数据库，所以只要JDBC支持的数据库MyBatis都支持）
  4.能够与Spring很好的集成
  5.提供映射标签，支持对象与数据库的ORM字段关系映射；提供对象关系映射标签，支持对象关系组件维护。
缺点
 1.SQL语句的编写工作量较大，尤其当字段多、关联表多时，对开发人员编写SQL语句的功底有一定要求
  2.SQL语句依赖于数据库，导致数据库移植性差，不能随意更换数据库



## Mybatis中#{}和${}的区别是什么？

  1.#{}是预编译处理、是占位符，${}是字符串替换、是拼接符
  2.Mybatis在处理#{}时，会将sql中的出替换为？号，调用PreparedStatement来赋值
  3.Mybatis在处理${}时，就是把${}替换成变量的值，调用Statement来赋值
  4.使用#{}可以有效的防止SQL注入，提高系统安全性























