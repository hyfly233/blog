# Map

重复放入`key-value`并不会有任何问题，但是一个`key`只能关联一个`value`



使用`HashMap`，作为`key`的类必须正确覆写`equals()`和`hashCode()`方法；

一个类如果覆写了`equals()`，就必须覆写`hashCode()`，并且覆写规则是：

- 如果`equals()`返回`true`，则`hashCode()`返回值必须相等；
- 如果`equals()`返回`false`，则`hashCode()`返回值尽量不要相等。

实现`hashCode()`方法可以通过`Objects.hashCode()`辅助方法实现。



## 遍历Map

对`Map`来说，要遍历`key`可以使用`for each`循环遍历`Map`实例的`keySet()`方法返回的`Set`集合，它包含不重复的`key`的集合

```java
for (String key : map.keySet()) {
    Integer value = map.get(key);
    System.out.println(key + " = " + value);
}
```

同时遍历`key`和`value`可以使用`for each`循环遍历`Map`对象的`entrySet()`集合，它包含每一个`key-value`映射 

```java
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    String key = entry.getKey();
    Integer value = entry.getValue();
    System.out.println(key + " = " + value);
}
```



`HashMap`是一种通过对key计算`hashCode()`，通过空间换时间的方式，直接定位到value所在的内部数组的索引，因此，查找效率非常高



## EnumMap

`EnumMap`，它在内部以一个非常紧凑的数组存储value，并且根据`enum`类型的key直接定位到内部数组的索引，并不需要计算`hashCode()`，不但效率最高，而且没有额外的空间浪费



## TreeMap

`TreeMap`，是`SortedMap`的实现类，保证遍历时以Key的顺序来进行排序

使用`TreeMap`时，放入的Key必须实现`Comparable`接口



如果作为Key的class没有实现`Comparable`接口，那么，必须在创建`TreeMap`时同时指定一个自定义排序算法

```java
Map<Person, Integer> map = new TreeMap<>(new Comparator<Person>() {
    public int compare(Person p1, Person p2) {
        return p1.name.compareTo(p2.name);
    }
});
```



## Properties

`Properties`内部本质上是一个`Hashtable`

用`Properties`读取配置文件，一共有三步：

1. 创建`Properties`实例；
2. 调用`load()`读取文件；
3. 调用`getProperty()`获取配置

```java
String f = "xxx.properties";
Properties props = new Properties();
props.load(new java.io.FileInputStream(f), StandardCharsets.UTF_8));

String filepath = props.getProperty("xxx");
String interval = props.getProperty("xxxx", "120");
```





# HashMap





# LinkedHashMap





# ConcurrentHashMap加锁粒度































