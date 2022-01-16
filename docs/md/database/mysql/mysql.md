


# MySQL

## 实践中如何优化MySQL

实践中，MySQL的优化主要涉及SQL语句及索引的优化、数据表结构的优化、系统配置的优化和硬件的优化四个方面，如下图所示：

![优化](https://static.bookstack.cn/projects/java_interview_manual/images/db-mysql-optimize.png)

### SQL语句及索引的优化

#### SQL语句的优化

SQL语句的优化主要包括三个问题，即如何发现有问题的SQL、如何分析SQL的执行计划以及如何优化SQL，下面将逐一解释。

1. 怎么发现有问题的SQL?（通过MySQL慢查询日志对有效率问题的SQL进行监控）

MySQL的慢查询日志是MySQL提供的一种日志记录，它用来记录在MySQL中响应时间超过阀值的语句，具体指运行时间超过long_query_time值的SQL，则会被记录到慢查询日志中。

long_query_time的默认值为10，意思是运行10s以上的语句。慢查询日志的相关参数如下所示：

![慢查询日志相关参数](https://static.bookstack.cn/projects/java_interview_manual/images/db-mysql-long_query_time-param.png)

通过MySQL的慢查询日志，我们可以查询出执行的次数多占用的时间长的SQL、可以通过pt_query_disgest(一种mysql慢日志分析工具)分析Rows examine(MySQL执行器需要检查的行数)项去找出IO大的SQL以及发现未命中索引的SQL，对于这些SQL，都是我们优化的对象。

##### 通过explain查询和分析SQL的执行计划

使用 EXPLAIN 关键字可以知道MySQL是如何处理你的SQL语句的，以便分析查询语句或是表结构的性能瓶颈。通过explain命令可以得到表的读取顺序、数据读取操作的操作类型、哪些索引可以使用、哪些索引被实际使用、表之间的引用以及每张表有多少行被优化器查询等问题。当扩展列extra出现Using filesort和Using temporay，则往往表示SQL需要优化了。

##### 优化SQL语句

- 优化insert语句：一次插入多值；
- 应尽量避免在 where 子句中使用!=或<>操作符，否则将引擎放弃使用索引而进行全表扫描；
- 应尽量避免在 where 子句中对字段进行null值判断，否则将导致引擎放弃使用索引而进行全表扫描；
- 优化嵌套查询：子查询可以被更有效率的连接(Join)替代；
- 很多时候用 exists 代替 in 是一个好的选择。

#### 索引优化

建议在经常作查询选择的字段、经常作表连接的字段以及经常出现在order by、group by、distinct 后面的字段中建立索引。但必须注意以下几种可能会引起索引失效的情形：

- 以“%(表示任意0个或多个字符)”开头的LIKE语句，模糊匹配；
- OR语句前后没有同时使用索引；
- 数据类型出现隐式转化（如varchar不加单引号的话可能会自动转换为int型）；
- 对于多列索引，必须满足最左匹配原则(eg,多列索引col1、col2和col3，则 索引生效的情形包括col1或col1，col2或col1，col2，col3)。

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

- READ-UNCOMMITTED(读取未提交)： 事务的修改，即使没有提交，对其他事务也都是可见的。事务能够读取未提交的数据，这种情况称为脏读。
- READ-COMMITTED(读取已提交)： 事务读取已提交的数据，大多数数据库的默认隔离级别。当一个事务在执行过程中，数据被另外一个事务修改，造成本次事务前后读取的信息不一样，这种情况称为不可重复读。
- REPEATABLE-READ(可重复读)： 这个级别是MySQL的默认隔离级别，它解决了脏读的问题，同时也保证了同一个事务多次读取同样的记录是一致的，但这个级别还是会出现幻读的情况。幻读是指当一个事务A读取某一个范围的数据时，另一个事务B在这个范围插入行，A事务再次读取这个范围的数据时，会产生幻读
- SERIALIZABLE(可串行化)： 最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。

事务隔离机制的实现基于锁机制和并发调度。其中并发调度使用的是MVVC（多版本并发控制），通过保存修改的旧版本信息来支持并发一致性读和回滚等特性。

因为隔离级别越低，事务请求的锁越少，所以大部分数据库系统的隔离级别都是READ-COMMITTED(读取提交内容):，但是你要知道的是InnoDB 存储引擎默认使用 **REPEATABLE-READ（可重读）**并不会有任何性能损失。

# 2、MVCC的实现原理

详见mvcc文档

# 3、mysql幻读怎么解决的

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

​	像不加锁的select操作就是快照读，即不加锁的非阻塞读；快照读的前提是隔离级别不是串行级别，串行级别下的快照读会退化成当前读；之所以出现快照读的情况，是基于提高并发性能的考虑，快照读的实现是基于多版本并发控制，即MVCC,可以认为MVCC是行锁的一个变种，但它在很多情况下，避免了加锁操作，降低了开销；既然是基于多版本，即快照读可能读到的并不一定是数据的最新版本，而有可能是之前的历史版本

### 4、当前读、快照读、MVCC关系

​		MVCC多版本并发控制指的是维持一个数据的多个版本，使得读写操作没有冲突，快照读是MySQL为实现MVCC的一个非阻塞读功能。MVCC模块在MySQL中的具体实现是由三个隐式字段，undo日志、read view三个组件来实现的。

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

​		DB_ROW_JD

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