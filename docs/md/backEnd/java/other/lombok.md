## 简介
`Lombok`是一种`Java™`实用工具，可用来帮助开发人员消除 Java 的冗长，尤其是对于简单的 Java 对象（POJO）。它通过注解实现这一目的。

## 插件安装
* 由于`Lombok`采取注解形式，在编译后，自动生成相应的方法，所以需要下载插件来支持它。  
* 以 idea 为例：查找插件`lombok plugin`安装即可。

## 引入依赖
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>${lombok.version}</version>
    <scope>provided</scope>
</dependency>
```

## Lombok注解一览
* @Setter
* @Getter
* @Data
* @Log(这是一个泛型注解，具体有很多种形式)
* @AllArgsConstructor
* @NoArgsConstructor
* @EqualsAndHashCode
* @NonNull
* @Cleanup
* @ToString
* @RequiredArgsConstructor
* @Value
* @SneakyThrows
* @Synchronized

## 常用注解介绍
* @Getter和@Setter ：该注解可以使用在类上也可以使用在属性上。生成的getter遵循布尔属性的约定。在使用该注解时，会默认生成一个无参构造。和对应的`getter`、`setter`方法
```java
@Getter
@Setter
public class Notice {

   private Integer id;
   private String title;
   private Boolean isDeleted;

}
```
编译后将会转化为
```java
public class Notice {

   private Integer id;
   private String title;
   private Boolean isDeleted;

   public Notice() {}

   public Integer getId() {
      return id;
   }

   public void setId(Integer id) {
      this.id = id;
   }

   public String getTitle() {
      return title;
   }

   public void setTitle(String title) {
      this.title = title;
   }

   public Boolean getDeleted() {
      return isDeleted;
   }

   public void setDeleted(Boolean deleted) {
      isDeleted = deleted;
   }
}
```
*  @ToString ：该注解使用在**类**上，编译后toString方法返回将会以字段的名称-值的形式输出
*  @EqualsAndHashCode ：该注解使用在**类**上，同时生成`equals`和`hashCode`。
*  @AllArgsConstructor ：该注解使用在**类**上，提供全参数的构造方法，默认不提供无参构造。
*  @NoArgsConstructor ：该注解使用在**类**上，提供无参构造
*  @Data ：使用`@Data`注解就可以有下面几个注解的功能：`@ToString`、`@Getter`、`@Setter`、`@EqualsAndHashCode`、`@NoArgsConstructor`。
需要注意的是：同时使用`@Data`和`@AllArgsConstructor`后 ，默认的无参构造函数失效，如果需要它，要重新设置`@NoArgsConstructor`
* @Slf4j ：在类上注解后，可直接调用log
```java
log.info(xxxx);
```
* @Builder：bulder 模式构建对象。
* @Cleanup：自动化关闭流，相当于 `try with resource`
```java
@Cleanup 
InputStream in = new FileInputStream(args[0]);
@Cleanup 
OutputStream out = new FileOutputStream(args[1]);
```
* @NonNull ：增加不为空判断
```java
public NonNullExample(@NonNull Person person) {
    this.name = person.getName();
 }
```
转换为：
```java
public NonNullExample(@NonNull Person person) {
    if (person == null) {
      throw new NullPointerException("person");
    }
    this.name = person.getName();
 }
```
*  @SneakyThrows ：当我们需要抛出异常，在当前方法上调用，不用显示的在方法名后面写 throw
```java
@SneakyThrows(Exception.class)
```
* @Synchronized ：方法中所有的代码都加入到一个代码块中，默认静态方法使用的是全局锁，普通方法使用的是对象锁，当然也可以指定锁的对象。
```java
private final Object lock = new Object();
@Synchronized("lock")
public void foo() {
    // Do something
}
```
