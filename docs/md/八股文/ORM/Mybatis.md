# Mybatis

## 基础

### 什么是 MyBatis

MyBatis 是一个可以自定义 SQL、存储过程和高级映射的持久层框架

### MyBatis 的好处是什么

- MyBatis 把 sql 语句从 Java 源程序中独立出来，放在单独的 XML 文件中编写，给程序的维护带来了很大便利
- MyBatis 封装了底层 JDBC API 的调用细节，并能自动将结果集转换成 Java Bean 对象，大大简化了 Java 数据库编程的重复工作
- 因为 MyBatis 需要自己去编写 sql 语句，可以结合数据库自身的特点灵活控制 sql 语句，因此能够实现比 Hibernate 等全自动 orm 框架更高的查询效率，能够完成复杂查询

### 为什么说 Mybatis 是半自动 ORM 映射工具、它与全自动的区别在哪里？

+ Hibernate 属于全自动 ORM 映射工具，使用 Hibernate 查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的
+ Mybatis 在查询关联对象或关联集合对象时，需要手动编写 sql 来完成，所以，称之为半自动 ORM 映射工具

### MyBatis 与 Hibernate 有哪些不同

- Mybatis 不完全是一个 ORM 框架，因为 MyBatis 需要自己编写 Sql 语句，不过 mybatis 可以通过 XML 或注解方式灵活配置要运行的 sql 语句，并将 java 对象和 sql 语句映射生成最终执行的 sql，最后将 sql 执行的结果再映射生成 java 对象。
- Mybatis 学习门槛低，可直接编写原生态 sql，可严格控制 sql 执行性能，灵活度高，非常适合对关系数据模型要求不高的软件开发，例如互联网软件、企业运营类软件等，因为这类软件需求变化频繁，一但需求变化要求成果输出迅速。但是灵活的前提是 mybatis 无法做到数据库无关性，如果需要实现支持多种数据库的软件则需要自定义多套 sql 映射文件，工作量大。
- Hibernate 对象/关系映射能力强，数据库无关性好，对于关系模型要求高的软件（例如需求固定的定制化软件）如果用 hibernate 开发可以节省很多代码，提高效率。但是 Hibernate 的缺点是学习门槛高，要精通门槛更高，而且怎么设计 O/R 映射，在性能和对象模型之间如何权衡，以及怎样用好 Hibernate 需要具有很强的经验和能力才行。

## 缓存

### MyBatis 缓存是什么

MyBatis 的缓存分为一级缓存和二级缓存

- 一级缓存放在 **session** 里面，默认就有，通过同一个 SqlSession 查询的数据会被缓存，下次查询相同的数据，会直接从缓存中读取

- 二级缓存放在它的**命名空间**里，默认是不打开的（不建议使用，跨 SqlSession 导致严重的脏读），使用二级缓存属性类需要实现 Serializable 序列化接口，查出的数据先保存在一级缓存中，会话提交或关闭后数据从一级缓存转移到二级缓存。实际开发中使用第三方缓存

  1. 第一步：在配置文件中标明配置

     ```xml
     <settings>
         <setting name="cacheEnabled" value="true"/>
     </settings>
     ```

  2. 第二步：开启二级缓存

     ```java
     @CacheNamespace
     public interface TestMapper {
     }
     
     public class TestDto implements Serializable {
     }
     ```

     ```xml
     <mapper namespace="TestMapper">
         <cache eviction="FIFO" flushInterval="60000" size="512" readOnly="true" />
         <select>
           select * from test
       	</select>
     </mapper>
     ```

### MyBatis **一级**缓存失效的条件

- 不同的 SqlSession 对应不同的一级缓存
- 同一个 SqlSession 但是查询条件不同
- 同一个 SqlSession 两次相同的查询期间做了增删改操作
- 同一个 SqlSession 两次相同的查询期间手动清空了缓存

### MyBatis **一级**缓存清除方法

1. 执行 SqlSession 的 commit（执行插入、更新、删除操作后）

2. 执行 SqlSession 的 close 方法

3. 执行 SqlSession 的 clearCache 方法

4. 映射文件XML中添加 `flushCache=“true”` 

   ```xml
   <select flushCache="true"> </select>
   ```

## 分页

### Mybatis 分页的？分页插件的原理是什么？

- Mybatis 使用 RowBounds 对象进行分页，也可以直接编写 sql 实现分页，也可以使用 Mybatis 的分页插件
- 分页插件的原理：实现 Mybatis 提供的接口，实现自定义插件，在插件的拦截方法内拦截待执行的 sql，然后重写 sql。如：select  *from student，拦截 sql 后重写为：select t.** from （select * from student）t limit 0，10

## 动态 SQL

### Mybatis 动态 SQL 是什么

+ Mybatis 动态 sql 可以在 Xml 映射文件内，以标签的形式编写动态 sql，完成逻辑判断和动态拼接 sql 的功能
+ 其执行原理是使用 OGNL 从 sql 参数对象中计算表达式的值，根据表达式的值动态拼接 sql，以此来完成动态 sql 的功能
+ 一共 9 种动态 sql 标签
  1. trim
  2. where
  3. set
  4. foreach
  5. if
  6. choose
  7. when
  8. otherwise
  9. bind

### 字符串替换 #{} 和 ${}

+  在处理 **#{}** 时会进行预处理，会将 sql 中的 **#{}** 替换为 **?** 号，调用 PreparedStatement 的 set 方法来赋值
+ 在处理 **${}** 时，就是把 **${}** 替换成变量的值
+ 使用 **#{}** 可以有效的防止 **SQL注入**，提高系统安全性

## 映射

### 在 mapper 中如何传递多个参数

- 直接在方法中传递参数，xml 文件用 **#{0} #{1}** 来获取
- 使用 **@param** 注解后，直接在 xml 文件中通过 **#{name}** 来获取

### 简述 Mybatis 的 Xml 映射文件和 Mybatis 内部数据结构之间的映射关系

+ Mybatis 将所有 Xml 配置信息都封装到 All-In-One 重量级对象 Configuration 内部
+ 在 Xml 映射文件中，标签会被解析为 ParameterMap 对象，其每个子元素会被解析为 ParameterMapping 对象
+ 标签会被解析为ResultMap 对象，其每个子元素会被解析为 ResultMapping 对象
+ 每一个标签均会被解析为 MappedStatement 对象，标签内的 sql 会被解析为 BoundSql 对象

### 通常一个 Xml 映射文件，都会写一个 Dao 接口与之对应，Dao 是否可以重载

+ 不能重载
+ 因为通过 Dao 寻找 Xml 对应的 sql 的时候 **全限名 + 方法名** 的保存和寻找策略
+ 接口工作原理为 jdk 动态代理原理，运行时会为 dao 生成 proxy，代理对象会拦截接口方法，去执行对应的 sql 返回数据

### Mybatis 的 Xml 映射文件中，不同的 Xml 映射文件，id 是否可以重复？

+ 不同的 Xml 映射文件，如果配置了 namespace，那么 id 可以重复
+ 如果没有配置 namespace，那么 id 不能重复
+ namespace 不是必须的
+ **namespace + id** 是作为 **Map<String,  MappedStatement>** 的 key 使用的，如果没有 namespace，那么 id 重复会导致数据互相覆盖

### Mybatis 是否可以映射 Enum 枚举类？

+ Mybatis 可以映射枚举类
+ Mybatis 可以映射任何对象到表的一列上。

### Mybatis 自定义映射方式

+ 实现 **TypeHandler** 接口的 **setParameter()** 和 **getResult()** 方法
+ **setParameter()** 方法代表设置 sql 问号占位符参数
+ **getResult()** 方法代表获取列查询结果
+ TypeHandler 有两个作用
  + 完成 javaType 到 jdbcType 的转换
  + 完成 jdbcType 到 javaType 的转换

## 绑定

### MyBatis 的接口绑定是什么

接口映射就是在 MyBatis 中任意定义接口，然后把接口里面的方法和 SQL 语句绑定，直接调用接口方法就可以，这样比 SqlSession 提供的方法有更加灵活的选择和设置

### 接口绑定有几种实现方式

接口绑定有两种实现方式

- 通过注解绑定，就是在接口的方法上面加上 @Select @Update 等注解里面包含 Sql 语句来绑定
- 通过 xml 里面写 SQL 来绑定,在这种情况下，要指定 xml 映射文件里面的 namespace 必须为接口的全路径名

### 当实体类中的属性名和表中的字段名不一样，如果将查询的结果封装到指定 pojo

- 通过在查询的 sql 语句中定义字段名的别名
- 通过来映射字段名和实体类属性名的一一对应的关系

### 如何获取自动生成的主键值？

配置文件设置 usegeneratedkeys 为 true

### resultType、resultMap 的区别？

- 类的名字和数据库相同时，可以直接设置 resultType 参数为 Pojo 类
- 若不同，需要设置 resultMap 将结果名字和 Pojo 名字进行转换

### Mybatis 延迟加载

+ Mybatis 仅支持 **association** 和 **collection** 关联的延迟加载，association 指的就是一对一，collection 指的就是一对多查询
+ 在 Mybatis 配置文件中，可以配置是否启用延迟加载 **lazyLoadingEnabled = true/false**
+ 原理是使用 CGLIB 创建目标对象的代理对象，当调用目标方法时，进入拦截器方法
+ 比如调用 a.getB().getName()，拦截器 invoke() 方法发现 a.getB() 是 null 值，那么就会单独发送事先保存好的查询关联 B 对象的 sql，把 B 查询上来，然后调用 a.setB(b)，于是 a 的对象 b 属性就有值了，接着完成 a.getB().getName() 方法的调用

### 使用 MyBatis 的 mapper 接口调用时有哪些要求

- Mapper 接口方法名和 mapper.xml 中定义的每个 sql 的 id 相同
- Mapper 接口方法的输入参数类型和 mapper.xml 中定义的每个 sql 的 parameterType 的类型相同
- Mapper 接口方法的输出参数类型和 mapper.xml 中定义的每个 sql 的 resultType 的类型相同
- Mapper.xml 文件中的 namespace 即是 mapper 接口的类路径

## 执行器

### Mybatis 都有哪些 Executor 执行器

- **SimpleExecutor**：每执行一次 update 或 select，就开启一个 Statement 对象，用完立刻关闭 Statement 对象
- **ReuseExecutor**：执行 update 或 select，以 sql 作为 key 查找 Statement 对象，存在就使用，不存在就创建，用完后，不关闭 Statement 对象，而是放置于 Map
- **BatchExecutor**：完成批处理

### Mybatis 中如何指定 Executor 执行器

在 Mybatis 配置文件中，可以指定默认的 ExecutorType 执行器类型，也可以手动给 DefaultSqlSessionFactory 的创建 SqlSession 的方法传递 ExecutorType 类型参数

## 其他

### IBatis 和 MyBatis 在核心处理类分别叫什么？

IBatis 里面的核心处理类交 SqlMapClient，MyBatis 里面的核心处理类叫做 SqlSession

### Mybatis 中如何执行批处理？

使用 BatchExecutor 完成批处理