# 访问数据库

## JDBC

使用JDBC，首先通过IoC容器创建并管理一个`DataSource`实例，然后，Spring提供了一个`JdbcTemplate`，可以方便地让操作JDBC，因此，通常情况下，会实例化一个`JdbcTemplate`。这个类主要使用了模板模式



导入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>javax.annotation</groupId>
        <artifactId>javax.annotation-api</artifactId>
        <version>1.3.2</version>
    </dependency>
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
        <version>3.4.2</version>
    </dependency>
    <dependency>
        <groupId>org.hsqldb</groupId>
        <artifactId>hsqldb</artifactId>
        <version>2.5.0</version>
    </dependency>
</dependencies>
```



在config中，创建以下几个必须的Bean 

```java
public User getUserById(long id) {
    
    // 传入的是ConnectionCallback
    return jdbcTemplate.execute((Connection conn) -> {
        
        // 可以直接使用conn实例，回调结束后JdbcTemplate自动释放:
        // 在内部手动创建的PreparedStatement、ResultSet必须用try(...)释放:
        try (var ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
            ps.setObject(1, id);
            try (var rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User( // new User object:
                            rs.getLong("id"), // id
                            rs.getString("email"), // email
                            rs.getString("password"), // password
                            rs.getString("name")); // name
                }
                throw new RuntimeException("user not found by id.");
            }
        }
    });
}
```

上述回调方法允许获取Connection，然后做任何基于Connection的操作



## 声明式事务

Spring提供了一个`PlatformTransactionManager`来表示事务管理器，所有的事务都由它负责管理。而事务由`TransactionStatus`表示

如果手写事务代码，使用`try...catch`如下

```java
TransactionStatus tx = null;
try {
    // 开启事务:
    tx = txManager.getTransaction(new DefaultTransactionDefinition());
    // 相关JDBC操作:
    jdbcTemplate.update("...");
    jdbcTemplate.update("...");
    // 提交事务:
    txManager.commit(tx);
} catch (RuntimeException e) {
    // 回滚事务:
    txManager.rollback(tx);
    throw e;
}
```



Spring为了同时支持JDBC和JTA两种事务模型，抽象出`PlatformTransactionManager`

需要定义一个`PlatformTransactionManager`对应的Bean，实际类型是`DataSourceTransactionManager`

```java
@Configuration
@ComponentScan
@PropertySource("jdbc.properties")
public class AppConfig {
    ...
    @Bean
    PlatformTransactionManager createTxManager(@Autowired DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```



声明式事务非常简单，除了在`AppConfig`中追加一个上述定义的`PlatformTransactionManager`外，再加一个`@EnableTransactionManagement`就可以启用声明式事务

```java
@Configuration
@ComponentScan
@EnableTransactionManagement // 启用声明式
@PropertySource("jdbc.properties")
public class AppConfig {
    ...
}
```

然后，对需要事务支持的方法，加一个`@Transactional`注解

```java
@Component
public class UserService {
    // 此public方法自动具有事务支持:
    @Transactional
    public User register(String email, String password, String name) {
       ...
    }
}
```



Spring对一个声明式事务的方法，原理仍然是AOP代理，即通过自动创建Bean的Proxy实现，类似于

```java
public class UserService$$EnhancerBySpringCGLIB extends UserService {
    UserService target = ...
    PlatformTransactionManager txManager = ...

    public User register(String email, String password, String name) {
        TransactionStatus tx = null;
        try {
            tx = txManager.getTransaction(new DefaultTransactionDefinition());
            
            // 执行相关逻辑
            target.register(email, password, name);
            
            txManager.commit(tx);
        } catch (RuntimeException e) {
            txManager.rollback(tx);
            throw e;
        }
    }
    ...
}
```





### 回滚事务

默认情况下，如果发生了`RuntimeException`，Spring的声明式事务将自动回滚。在一个事务方法中，如果程序判断需要回滚事务，只需抛出`RuntimeException` 



如果要针对Checked Exception回滚事务，需要在`@Transactional`注解中写出来

```java
@Transactional(rollbackFor = {RuntimeException.class, IOException.class})
public buyProducts(long productId, int num) throws IOException {
    ...
}
```

表示在抛出`RuntimeException`或`IOException`时，事务将回滚



为了简化代码，业务异常体系从`RuntimeException`派生，这样就不必声明任何特殊异常即可让Spring的声明式事务正常工作

```java
public class BusinessException extends RuntimeException {
    ...
}
```



### 事务边界

```java
@Component
public class UserService {
    @Transactional
    public User register(String email, String password, String name) { // 事务开始
       ...
    } // 事务结束
}
```

事务边界就是`register()`方法开始和结束

```java
@Component
public class BonusService {
    @Transactional
    public void addBonus(long userId, int bonus) { // 事务开始
       ...
    } // 事务结束
}
```

事务边界就是`addBonus()`方法开始和结束



如果用户注册后，能自动获得100积分，因此，实际代码如下：

```java
@Component
public class UserService {
    @Autowired
    BonusService bonusService;

    @Transactional
    public User register(String email, String password, String name) {
        // 插入用户记录:
        User user = jdbcTemplate.insert("...");
        // 增加100积分:
        bonusService.addBonus(user.id, 100);
    }
}
```

调用方（比如`RegisterController`）调用`UserService.register()`这个事务方法，它在内部又调用了`BonusService.addBonus()`这个事务方法



### 事务传播

假设用户注册的入口是`RegisterController`，它本身没有事务，仅仅是调用`UserService.register()`这个事务方法

```java
@Controller
public class RegisterController {
    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ModelAndView doRegister(HttpServletRequest req) {
        String email = req.getParameter("email");
        String password = req.getParameter("password");
        String name = req.getParameter("name");
        User user = userService.register(email, password, name);
        return ...
    }
}
```

因此，`UserService.register()`这个事务方法的起始和结束，就是事务的范围

在`UserService.register()`这个事务方法内，调用`BonusService.addBonus()`，对于大多数业务来说，期待`BonusService.addBonus()`的调用，和`UserService.register()`应当融合在一起



Spring的声明式事务为事务传播定义了几个级别，默认传播级别就是REQUIRED，意思是，如果当前没有事务，就创建一个新事务，如果当前有事务，就加入到当前事务中执行



默认的事务传播级别是`REQUIRED`，它满足绝大部分的需求。还有一些其他的传播级别：

+ `SUPPORTS`：表示如果有事务，就加入到当前事务，如果没有，那也不开启事务执行。这种传播级别可用于查询方法，因为SELECT语句既可以在事务内执行，也可以不需要事务；

+ `MANDATORY`：表示必须要存在当前事务并加入执行，否则将抛出异常。这种传播级别可用于核心更新逻辑，比如用户余额变更，它总是被其他事务方法调用，不能直接由非事务方法调用；

+ `REQUIRES_NEW`：表示不管当前有没有事务，都必须开启一个新的事务执行。如果当前已经有事务，那么当前事务会挂起，等新事务完成后，再恢复执行；

+ `NOT_SUPPORTED`：表示不支持事务，如果当前有事务，那么当前事务会挂起，等这个方法执行完成后，再恢复执行；

+ `NEVER`：和`NOT_SUPPORTED`相比，它不但不支持事务，而且在监测到当前有事务时，会抛出异常拒绝执行；

+ `NESTED`：表示如果当前有事务，则开启一个嵌套级别事务，如果当前没有事务，则开启一个新事务。

默认的`REQUIRED`已经满足绝大部分需求，`SUPPORTS`和`REQUIRES_NEW`在少数情况下会用到，其他基本不会用到，因为把事务搞得越复杂，不仅逻辑跟着复杂，而且速度也会越慢



JDBC中使用事务，是这个写法：

```
Connection conn = openConnection();
try {
    // 关闭自动提交:
    conn.setAutoCommit(false);
    // 执行多条SQL语句:
    insert(); update(); delete();
    // 提交事务:
    conn.commit();
} catch (SQLException e) {
    // 回滚事务:
    conn.rollback();
} finally {
    conn.setAutoCommit(true);
    conn.close();
}
```

Spring使用声明式事务，最终也是通过执行JDBC事务来实现功能的

一个事务方法，通过 ThreadLocal 获知当前是否存在事务

Spring总是把JDBC相关的`Connection`和`TransactionStatus`实例绑定到`ThreadLocal`。如果一个事务方法从`ThreadLocal`未取到事务，那么它会打开一个新的JDBC连接，同时开启一个新的事务，否则，它就直接使用从`ThreadLocal`获取的JDBC连接以及`TransactionStatus` 



因此，事务能正确传播的前提是，方法调用是在一个线程内才行

```java
@Transactional
public User register(String email, String password, String name) { // BEGIN TX-A
    User user = jdbcTemplate.insert("...");
    new Thread(() -> {
        // BEGIN TX-B:
        bonusService.addBonus(user.id, 100);
        // END TX-B
    }).start();
} // END TX-A
```

在另一个线程中调用`BonusService.addBonus()`，它根本获取不到当前事务

因此，`UserService.register()`和`BonusService.addBonus()`两个方法，将分别开启两个完全独立的事务



事务只能在当前线程传播，无法跨线程传播





