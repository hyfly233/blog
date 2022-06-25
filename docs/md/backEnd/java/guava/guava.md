# Google Guava

## 1. 基本工具 [Basic utilities]

### Optional

`Optional<T>`表示可能为null的T类型引用

一个Optional实例可能包含非null的引用，也可能什么也不包括（称之为引用缺失）。Optional从不包含的是null值，而是用存在或缺失来表示，但Optional从不会包含null值引用

```java
Optional<Integer> possible = Optional.of(5);

possible.isPresent(); // returns true

possible.get(); // returns 5
```



**创建Optional实例（以下都是静态方法）**

| 方法名                   | 作用                                               |
| :----------------------- | :------------------------------------------------- |
| Optional.of(T)           | 创建指定引用的Optional实例，若引用为null则快速失败 |
| Optional.absent()        | 创建引用缺失的Optional实例                         |
| Optional.fromNullable(T) | 创建指定引用的Optional实例，若引用为null则表示缺失 |



**用Optional实例查询引用（以下都是非静态方法）**

| 方法名              | 作用                                                         |
| :------------------ | :----------------------------------------------------------- |
| boolean isPresent() | 如果Optional包含非null的引用（引用存在），返回true           |
| T get()             | 返回Optional所包含的引用，若引用缺失，则抛出java.lang.IllegalStateException |
| T or(T)             | 返回Optional所包含的引用，若引用缺失，返回指定的值           |
| T orNull()          | 返回Optional所包含的引用，若引用缺失，返回null               |
| Set asSet()         | 返回Optional所包含引用的单例不可变集，如果引用存在，返回一个只有单一元素的集合，如果引用缺失，返回一个空集合。 |



**使用Optional的意义**

使用Optional除了赋予null语义，增加了可读性，最大的优点在于它是一种傻瓜式的防护

Optional迫使你积极思考引用缺失的情况，因为必须显式地从Optional获取引用，这样可避免空指针异常



**其他处理null的便利方法**

当需要用一个默认值来替换可能的null，可使用`Objects.firstNonNull(T, T)`方法。但如果两个值都是null，该方法会抛出NullPointerException。Optional也是一个比较好的替代方案，例如：Optional.of(first).or(second).

还有其它一些方法专门处理null或空字符串：`emptyToNull(String)，nullToEmpty(String)，isNullOrEmpty(String)`。这些方法主要用来与混淆null/空的API进行交互。



### Preconditions 前置条件

`Preconditions类`中提供了若干前置条件判断的实用方法，每个方法都有三个变种：

- 没有额外参数：抛出的异常中没有错误消息；
- 有一个Object对象作为额外参数：抛出的异常使用Object.toString() 作为错误消息；
- 有一个String对象作为额外参数，并且有一组任意数量的附加Object对象：这个变种处理异常消息的方式有点类似printf，但考虑GWT的兼容性和效率，只支持`%s指示符`。例如：

```java
checkArgument(i >= 0, "Argument was %s but expected nonnegative", i);
checkArgument(i < j, "Expected i < j, but %s > %s", i, j);
```



| **方法声明（不包括额外参数）**                     | **描述**                                                     | **检查失败时抛出的异常**  |
| :------------------------------------------------- | :----------------------------------------------------------- | :------------------------ |
| checkArgument(boolean)                             | 检查boolean是否为true，用来检查传递给方法的参数。            | IllegalArgumentException  |
| checkNotNull(T)                                    | 检查value是否为null，该方法直接返回value，因此可以内嵌使用checkNotNull`。` | NullPointerException      |
| checkState(boolean)                                | 用来检查对象的某些状态。                                     | IllegalStateException     |
| checkElementIndex(int index, int size)             | 检查index作为索引值对某个列表、字符串或数组是否有效。index>=0 && index<size | IndexOutOfBoundsException |
| checkPositionIndex(int index, int size)            | 检查index作为位置值对某个列表、字符串或数组是否有效。index>=0 && index<=size | IndexOutOfBoundsException |
| checkPositionIndexes(int start, int end, int size) | 检查[start, end]表示的位置范围对某个列表、字符串或数组是否有效 | IndexOutOfBoundsException |



索引值常用来查找列表、字符串或数组中的元素，如：`List.get(int), String.charAt(int)`

位置值和位置范围常用来截取列表、字符串或数组，如：`List.subList(int，int), String.substring(int)`



### Objects 工具类

**equals**

当一个对象中的字段可以为null时，实现Object.equals方法会很痛苦，因为不得不分别对它们进行null检查。使用`Objects.equal`帮助执行null敏感的equals判断，从而避免抛出NullPointerException。例如:

```java
Objects.equal("a", "a"); // returns true
Objects.equal(null, "a"); // returns false
Objects.equal("a", null); // returns false
Objects.equal(null, null); // returns true
```



**hashCode**

Guava的`Objects.hashCode(Object...)`会对传入的字段序列计算出合理的、顺序敏感的散列值

可以使用`Objects.hashCode(field1, field2, …, fieldn)`来代替手动计算散列值。



**toString**

使用 `Objects.toStringHelper`可以轻松编写有用的toString方法。例如：

```java
// Returns "ClassName{x=1}"
Objects.toStringHelper(this).add("x", 1).toString();
// Returns "MyObject{x=1}"
Objects.toStringHelper("MyObject").add("x", 1).toString();
```



**compare/compareTo**

Guava提供了`ComparisonChain`，执行一种懒比较：它执行比较操作直至发现非零的结果，在那之后的比较输入将被忽略

```
public int compareTo(Foo that) {
    return ComparisonChain.start()
            .compare(this.aString, that.aString)
            .compare(this.anInt, that.anInt)
            .compare(this.anEnum, that.anEnum, Ordering.natural().nullsLast())
            .result();
}
```

这种`Fluent接口`风格的可读性更高，发生错误编码的几率更小，并且能避免做不必要的工作



### Ordering 排序器

`Ordering`是Guava流畅风格比较器`Comparator`的实现，它可以用来为构建复杂的比较器，以完成集合排序的功能

`Ordering实例`就是一个特殊的`Comparator实例`。Ordering把很多基于Comparator的静态方法（如Collections.max）包装为自己的实例方法（非静态方法），并且提供了链式调用方法，来定制和增强现有的比较器



**创建排序器** （静态方法） 

| **方法**           | **描述**                                               |
| :----------------- | :----------------------------------------------------- |
| `natural()`        | 对可排序类型做自然排序，如数字按大小，日期按先后排序   |
| `usingToString()`  | 按对象的字符串形式做字典排序[lexicographical ordering] |
| `from(Comparator)` | 把给定的Comparator转化为排序器                         |



实现自定义的排序器时，除了用from方法，也可以跳过实现Comparator，而直接继承Ordering：

```java
Ordering<String> byLengthOrdering = new Ordering<String>() {
    public int compare(String left, String right) {
        return Ints.compare(left.length(), right.length());
    }
};
```



**链式调用方法** 通过链式调用，可以由给定的排序器衍生出其它排序器

| **方法**               | **描述**                                                     |
| :--------------------- | :----------------------------------------------------------- |
| `reverse()`            | 获取语义相反的排序器                                         |
| `nullsFirst()`         | 使用当前排序器，但额外把null值排到最前面。                   |
| `nullsLast()`          | 使用当前排序器，但额外把null值排到最后面。                   |
| `compound(Comparator)` | 合成另一个比较器，以处理当前排序器中的相等情况。             |
| `lexicographical()`    | 基于处理类型T的排序器，返回该类型的可迭代对象Iterable<T>的排序器。 |
| `onResultOf(Function)` | 对集合中元素调用Function，再按返回值用当前排序器排序。       |

例如

```java
class Foo {
    @Nullable 
    String sortedBy;
    
    int notSortedBy;
}
```

考虑到排序器应该能处理sortedBy为null的情况，可以使用下面的链式调用来合成排序器：

```java
Ordering<Foo> ordering = Ordering
    .natural()
    .nullsFirst()
    .onResultOf(new Function<Foo, String>() {
        public String apply(Foo foo) {
            return foo.sortedBy;
        }
	});
```

当阅读链式调用产生的排序器时，应该从后往前读。

上面的例子中，排序器

1. 首先调用apply方法获取sortedBy值，并把sortedBy为null的元素都放到最前面
2. 然后把剩下的元素按sortedBy进行自然排序

之所以要从后往前读，是因为每次链式调用都是用后面的方法包装了前面的排序器



*注：用compound方法包装排序器时，就不应遵循从后往前读的原则。为了避免理解上的混乱，请不要把compound写在一长串链式调用的中间，可以另起一行，在链中最先或最后调用compound。*



超过一定长度的链式调用，也可能会带来阅读和理解上的难度。建议在一个链中最多使用三个方法。此外，也可以把Function分离成中间对象，让链式调用更简洁紧凑

```java
Ordering<Foo> ordering = Ordering.natural().nullsFirst().onResultOf(sortKeyFunction)
```



**运用排序器：**Guava的排序器实现有若干操纵集合或元素值的方法

| **方法**                               | **描述**                                                     | **另请参见**                                      |
| :------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------ |
| `greatestOf(Iterable iterable, int k)` | 获取可迭代对象中最大的k个元素。                              | `leastOf`                                         |
| `isOrdered(Iterable)`                  | 判断可迭代对象是否已按排序器排序：允许有排序值相等的元素。   | `isStrictlyOrdered`                               |
| `sortedCopy(Iterable)`                 | 判断可迭代对象是否已严格按排序器排序：不允许排序值相等的元素。 | `immutableSortedCopy`                             |
| `min(E, E)`                            | 返回两个参数中最小的那个。如果相等，则返回第一个参数。       | `max(E, E)`                                       |
| `min(E, E, E, E...)`                   | 返回多个参数中最小的那个。如果有超过一个参数都最小，则返回第一个最小的参数。 | `max(E, E, E, E...)`                              |
| `min(Iterable)`                        | 返回迭代器中最小的元素。如果可迭代对象中没有元素，则抛出NoSuchElementException。 | `max(Iterable)`, `min(Iterator)`, `max(Iterator)` |



### Throwables 简化异常和错误的传播与检查

#### 异常传播

有时候会把捕获到的异常再次抛出。这种情况通常发生在Error或RuntimeException被捕获的时候，并没想捕获它们，但是声明捕获Throwable和Exception的时候，也包括了了Error或RuntimeException。Guava提供了若干方法，来判断异常类型并且重新传播异常。例如：

```java
try {
    someMethodThatCouldThrowAnything();
} catch (IKnowWhatToDoWithThisException e) {
    handle(e);
} catch (Throwable t) {
    Throwables.propagateIfInstanceOf(t, IOException.class);
    Throwables.propagateIfInstanceOf(t, SQLException.class);
    throw Throwables.propagate(t);
}
```

所有这些方法都会自己决定是否要抛出异常，但也能直接抛出方法返回的结果——例如，`throw Throwables.propagate(t);   这样可以向编译器声明这里一定会抛出异常。

Guava中的异常传播方法简要列举如下：

| 方法名                                                   | 作用                                                         |
| :------------------------------------------------------- | :----------------------------------------------------------- |
| `RuntimeException propagate(Throwable)`                  | 如果Throwable是Error或RuntimeException，直接抛出；否则把Throwable包装成RuntimeException抛出。返回类型是RuntimeException，所以你可以像上面说的那样写成`throw Throwables.propagate(t)`，Java编译器会意识到这行代码保证抛出异常。 |
| `void propagateIfInstanceOf( Throwable, Class) throws X` | Throwable类型为X才抛出                                       |
| `void propagateIfPossible( Throwable)`                   | Throwable类型为Error或RuntimeException才抛出                 |
| `void propagateIfPossible( Throwable, Class) throws X`   | Throwable类型为X, Error或RuntimeException才抛出              |



#### Throwables.propagate的用法

##### 模仿Java7的多重异常捕获和再抛出

通常来说，如果调用者想让异常传播到栈顶，他不需要写任何catch代码块。因为他不打算从异常中恢复，他可能就不应该记录异常，或者有其他的动作。他可能是想做一些清理工作，但通常来说，无论操作是否成功，清理工作都要进行，所以清理工作可能会放在finallly代码块中

但有时候，捕获异常然后再抛出也是有用的：也许调用者想要在异常传播之前统计失败的次数，或者有条件地传播异常

当只对一种异常进行捕获和再抛出时，代码可能还是简单明了的。但当多种异常需要处理时，却可能变得一团糟：

```java
@Override 
public void run() {
    try {
        delegate.run();
    } catch (RuntimeException e) {
        failures.increment();
        throw e;
    }catch (Error e) {
        failures.increment();
        throw e;
    }
}
```

Java7用多重捕获解决了这个问题：

```java
} catch (RuntimeException | Error e) {
    failures.increment();
    throw e;
}
```



使用`throw Throwables.propagate(t)`替换`throw t`可以实现相同效果

然而，用`Throwables.propagate`也很容易写出有其他隐藏行为的代码。尤其要注意的是，这个方案只适用于处理 RuntimeException 或 Error。如果 catch块 捕获了受检异常，需要调用`propagateIfInstanceOf`来保留原始代码的行为，因为`Throwables.propagate`不能直接传播受检异常



总之，Throwables.propagate 的这种用法也就马马虎虎，在Java7中就没必要这样做了



##### 非必要用法：把抛出的Throwable转为Exception

有少数API，尤其是Java反射API和（以此为基础的）Junit，把方法声明成抛出Throwable。和这样的API交互太痛苦了，因为即使是最通用的API通常也只是声明抛出Exception。当确定代码会抛出Throwable，而不是Exception或Error时，调用者可能会用`Throwables.propagate`转化`Throwable`。这里有个用Callable执行Junit测试的范例：

```java
public Void call() throws Exception {
    try {
        FooTest.super.runTest();
    } catch (Throwable t) {
        Throwables.propagateIfPossible(t, Exception.class);
        Throwables.propagate(t);
    }

    return null;
}
```

在这儿没必要调用propagate()方法，因为propagateIfPossible传播了Throwable之外的所有异常类型，第二行的propagate就变得完全等价于`throw new RuntimeException(t)`。（这个例子也表明了`propagateIfPossible`可能也会引起混乱，因为它不但会传播参数中给定的异常类型，还抛出Error和RuntimeException）



#### Throwables.propagate的有争议用法

原则上，非受检异常代表bug，而受检异常表示不可控的问题。但在实际运用中，即使JDK也有所误用——如Object.clone()、Integer. parseInt(String)、URI(String)——或者至少对某些方法来说，没有让每个人都信服的答案，如URI.create(String)的异常声明。

因此，调用者有时不得不把受检异常和非受检异常做相互转化：

```java
try {
    return Integer.parseInt(userInput);
} catch (NumberFormatException e) {
    throw new InvalidInputException(e);
}
try {
    return publicInterfaceMethod.invoke();
} catch (IllegalAccessException e) {
    throw new AssertionError(e);
}
```

有时候，调用者会使用Throwables.propagate转化异常。这样做有没有什么缺点？

`throw Throwables.propagate(ioException)` 和 `throw new RuntimeException(ioException)`做了同样的事情，但后者的意思更简单直接



#### 异常原因链

Guava提供了如下三个有用的方法，让研究异常的原因链变得稍微简便

+ `Throwable getRootCause(Throwable)`
+ `List getCausalChain(Throwable)`
+ `String getStackTraceAsString(Throwable)`



## 2. 集合[Collections]

Guava对JDK集合的扩展，这是Guava最成熟和为人所知的部分

2.1 [不可变集合](http://ifeve.com/google-guava-immutablecollections/): 用不变的集合进行防御性编程和性能提升。

2.2 [新集合类型](http://ifeve.com/google-guava-newcollectiontypes/): multisets, multimaps, tables, bidirectional maps等

2.3 [强大的集合工具类](http://ifeve.com/google-guava-collectionutilities/): 提供java.util.Collections中没有的集合工具

2.4 [扩展工具类](http://ifeve.com/google-guava-collectionhelpersexplained/)：让实现和扩展集合类变得更容易，比如创建`Collection`的装饰器，或实现迭代器

## 3. [缓存](http://ifeve.com/google-guava-cachesexplained)[Caches]

Guava Cache：本地缓存实现，支持多种缓存过期策略

## 4. [函数式风格](http://ifeve.com/google-guava-functional/)[Functional idioms]

Guava的函数式支持可以显著简化代码，但请谨慎使用它

## 5. 并发[Concurrency]

强大而简单的抽象，让编写正确的并发代码更简单

5.1 [ListenableFuture](http://ifeve.com/google-guava-listenablefuture/)：完成后触发回调的Future

5.2 [Service框架](http://ifeve.com/google-guava-serviceexplained/)：抽象可开启和关闭的服务，帮助你维护服务的状态逻辑

## 6. [字符串处理](http://ifeve.com/google-guava-strings/)[Strings]

非常有用的字符串工具，包括分割、连接、填充等操作

## 7. [原生类型](http://ifeve.com/google-guava-primitives/)[Primitives]

扩展 JDK 未提供的原生类型（如int、char）操作， 包括某些类型的无符号形式

## 8. [区间](http://ifeve.com/google-guava-ranges/)[Ranges]

可比较类型的区间API，包括连续和离散类型

## 9. [I/O](http://ifeve.com/google-guava-io/)

简化I/O尤其是I/O流和文件的操作，针对Java5和6版本

## 10. [散列](http://ifeve.com/google-guava-hashing/)[Hash]

提供比`Object.hashCode()`更复杂的散列实现，并提供布鲁姆过滤器的实现

## 11. [事件总线](http://ifeve.com/google-guava-eventbus/)[EventBus]

发布-订阅模式的组件通信，但组件不需要显式地注册到其他组件中

## 12. [数学运算](http://ifeve.com/google-guava-math/)[Math]

优化的、充分测试的数学工具类

## 13. [反射](http://ifeve.com/guava-reflection/)[Reflection]

Guava 的 Java 反射机制工具类