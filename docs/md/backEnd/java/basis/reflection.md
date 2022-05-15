# 反射

Java的反射是指程序在运行期可以拿到一个对象的所有信息 



## Class类

除了`int`等基本类型外，Java的其他类型全部都是`class` ， `class`是由JVM在执行过程中动态加载的。JVM在第一次读取到一种`class`类型时，将其加载进内存， 每加载一种`class`，JVM就为其创建一个`Class`类型的实例，并关联起来。注意：这里的`Class`类型是一个名叫`Class`的`class`

```java
public final class Class {
    private Class() {}
}
```

以`String`类为例，当JVM加载`String`类时，它首先读取`String.class`文件到内存，然后，为`String`类创建一个`Class`实例并关联起来 

```java
Class cls = new Class(String);
```

JVM持有的每个`Class`实例都指向一个数据类型（`class`或`interface`），一个`Class`实例包含了该`class`的所有完整信息



### 获取`class`的`Class`实例

+ 直接通过一个`class`的静态变量`class`获取

  ```java
  Class cls = String.class;
  ```

  

+ 通过该实例变量提供的`getClass()`方法获取

  ```java
  String s = "Hello";
  Class cls = s.getClass();
  ```

  

+ 通过完整类名使用静态方法`Class.forName()`获取

  ```java
  Class cls = Class.forName("java.lang.String");
  ```

因为`Class`实例在JVM中是唯一的，所以，上述方法获取的`Class`实例是同一个实例，可以用`==`比较两个`Class`实例



### instanceof

`instanceof`不但匹配指定类型，还匹配指定类型的子类。而用`==`判断`class`实例可以精确地判断数据类型，但不能作子类型比较





通过`Class.newInstance()`可以创建类实例，它的局限是：只能调用`public`的无参数构造方法。带参数的构造方法，或者非`public`的构造方法都无法通过`Class.newInstance()`被调用





### 动态加载

JVM在执行Java程序的时候，并不是一次性把所有用到的class全部加载到内存，而是第一次需要用到class时才加载

```java
public class Main {
    public static void main(String[] args) {
        if (args.length > 0) {
            create(args[0]);
        }
    }

    static void create(String name) {
        Person p = new Person(name);
    }
}
```



当执行`Main.java`时，由于用到了`Main`，因此，JVM首先会把`Main.class`加载到内存。然而，并不会加载`Person.class`，除非程序执行到`create()`方法，JVM发现需要加载`Person`类时，才会首次加载`Person.class`



利用JVM动态加载`class`的特性，才能在运行期根据条件加载不同的实现类。例如，Commons Logging总是优先使用Log4j，只有当Log4j不存在时，才使用JDK的logging

```java
LogFactory factory = null;
if (isClassPresent("org.apache.logging.log4j.Logger")) {
    factory = createLog4j();
} else {
    factory = createJdkLog();
}

boolean isClassPresent(String name) {
    try {
        Class.forName(name);
        return true;
    } catch (Exception e) {
        return false;
    }
}
```

这就是为什么只需要把Log4j的jar包放到classpath中，Commons Logging就会自动使用Log4j的原因























