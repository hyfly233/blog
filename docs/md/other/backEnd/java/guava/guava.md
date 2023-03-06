# Google Guava

## 1. 基本工具

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
| `lexicographical()`    | 基于处理类型T的排序器，返回该类型的可迭代对象Iterable\<T>的排序器。 |
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



## 2. 集合

### 不可变集合

| 可变集合接口           | 属于  | 不可变版本                  |
| :--------------------- | :---- | :-------------------------- |
| Collection             | JDK   | ImmutableCollection         |
| List                   | JDK   | ImmutableList               |
| Set                    | JDK   | ImmutableSet                |
| SortedSet/NavigableSet | JDK   | ImmutableSortedSet          |
| Map                    | JDK   | ImmutableMap                |
| SortedMap              | JDK   | ImmutableSortedMap          |
| Multiset               | Guava | ImmutableMultiset           |
| SortedMultiset         | Guava | ImmutableSortedMultiset     |
| Multimap               | Guava | ImmutableMultimap           |
| ListMultimap           | Guava | ImmutableListMultimap       |
| SetMultimap            | Guava | ImmutableSetMultimap        |
| BiMap                  | Guava | ImmutableBiMap              |
| ClassToInstanceMap     | Guava | ImmutableClassToInstanceMap |
| Table                  | Guava | ImmutableTable              |



**优点**

- 当对象被不可信的库调用时，不可变形式是安全的
- 不可变对象被多个线程调用时，不存在竞态条件问题
- 不可变集合不需要考虑变化，因此可以节省时间和空间。所有不可变的集合都比它们的可变形式有更好的内存利用率
- 不可变对象因为有固定不变，可以作为常量来安全使用



Guava为所有JDK标准集合类型和Guava新集合类型都提供了简单易用的不可变版本

JDK也提供了Collections.unmodifiableXXX方法把集合包装为不可变形式，但其笨重而且累赘，不安全，低效



所有Guava不可变集合的实现都不接受null值。只有5%的情况需要在集合中允许null元素，剩下的95%场景都是遇到null值就快速失败。如果需要在不可变集合中使用null，请使用JDK中的Collections.unmodifiableXXX方法



**使用不可变集合**

不可变集合可以用如下多种方式创建：

- copyOf方法，如`ImmutableSet.copyOf(set)`
- of方法，如`ImmutableSet.of(“a”, “b”, “c”)`或` ImmutableMap.of(“a”, 1, “b”, 2)`
- Builder工具，如

```java
public static final ImmutableSet<Color> GOOGLE_COLORS =
        ImmutableSet.<Color>builder()
            .addAll(WEBSAFE_COLORS)
            .add(new Color(0, 191, 255))
            .build();
```

此外，对有序不可变集合来说，排序是在构造集合的时候完成的，如：

```java
ImmutableSortedSet.of("a", "b", "c", "a", "d", "b");
```

会在构造时就把元素排序为`a, b, c, d`



**copyOf**

`ImmutableXXX.copyOf`方法会尝试在安全的时候避免做拷贝

比如：

```java
ImmutableSet<String> foobar = ImmutableSet.of("foo", "bar", "baz");
thingamajig(foobar);

void thingamajig(Collection<String> collection) {
    ImmutableList<String> defensiveCopy = ImmutableList.copyOf(collection);
    ...
}
```

在这段代码中，ImmutableList.copyOf(foobar)会智能地直接返回foobar.asList()，它是一个ImmutableSet的常量时间复杂度的List视图。 作为一种探索，ImmutableXXX.copyOf(ImmutableCollection)会试图对如下情况避免线性时间拷贝：

- 在常量时间内使用底层数据结构是可能的——例如，ImmutableSet.copyOf(ImmutableList)就不能在常量时间内完成。
- 不会造成内存泄露——例如，你有个很大的不可变集合ImmutableList\<String> hugeList， ImmutableList.copyOf(hugeList.subList(0, 10))就会显式地拷贝，以免不必要地持有hugeList的引用。
- 不改变语义——所以ImmutableSet.copyOf(myImmutableSortedSet)会显式地拷贝，因为和基于比较器的ImmutableSortedSet相比，ImmutableSet对hashCode()和equals有不同语义。

在可能的情况下避免线性拷贝，可以最大限度地减少防御性编程风格所带来的性能开销



**asList视图**

所有不可变集合都有一个asList()方法提供ImmutableList视图，来帮助用列表形式方便地读取集合元素

例如，你可以使用sortedSet.asList().get(k)从ImmutableSortedSet中读取第k个最小元素

asList()返回的ImmutableList通常是（并不总是）开销稳定的视图实现，而不是简单地把元素拷贝进List。也就是说，asList返回的列表视图通常比一般的列表平均性能更好，比如，在底层集合支持的情况下，它总是使用高效的contains方法。



### 新集合类型

#### Multiset

统计一个词在文档中出现了多少次，传统的做法：

```java
Map<String, Integer> counts = new HashMap<String, Integer>();
for (String word : words) {
    Integer count = counts.get(word);
    if (count == null) {
        counts.put(word, 1);
    } else {
        counts.put(word, count + 1);
    }
}
```



Guava提供了一个新集合类型 Multiset，它可以多次添加相等的元素

`Multiset`是集合[set]概念的延伸，它的元素可以重复出现，`Multiset`元素的顺序是无关紧要的：Multiset {a, a, b}和{a, b, a}是相等的

Multiset继承自JDK中的Collection接口，而不是Set接口，所以可以包含重复元素



可以用两种方式看待Multiset：

- 没有元素顺序限制的ArrayList\<E\>
- Map<E, Integer>，键为元素，值为计数



Guava的Multiset API也结合考虑了这两种方式： 当把Multiset看成普通的Collection时，它表现得就像无序的ArrayList

- add(E)添加单个给定元素
- iterator()返回一个迭代器，包含Multiset的所有元素（包括重复的元素）
- size()返回所有元素的总个数（包括重复的元素）



当把Multiset看作Map<E, Integer>时，它也提供了符合性能期望的查询操作：

- count(Object)返回给定元素的计数。HashMultiset.count的复杂度为O(1)，TreeMultiset.count的复杂度为O(log n)
- entrySet()返回Set<Multiset.Entry\<E>>，和Map的entrySet类似
- elementSet()返回所有不重复元素的Set\<E>，和Map的keySet()类似
- 所有Multiset实现的内存消耗随着不重复元素的个数线性增长



| **方法**         | **描述**                                                     |
| :--------------- | :----------------------------------------------------------- |
| count(E)         | 给定元素在Multiset中的计数                                   |
| elementSet()     | Multiset中不重复元素的集合，类型为Set\<E>                    |
| entrySet()       | 和Map的entrySet类似，返回Set<Multiset.Entry\<E>>，其中包含的Entry支持getElement()和getCount()方法 |
| add(E, int)      | 增加给定元素在Multiset中的计数                               |
| remove(E, int)   | 减少给定元素在Multiset中的计数                               |
| setCount(E, int) | 设置给定元素在Multiset中的计数，不可以为负数                 |
| size()           | 返回集合元素的总个数（包括重复的元素）                       |



Multiset\<E\>不是Map<E, Integer>，Multiset是一种Collection类型

Multiset和Map的区别

- Multiset中的元素计数只能是正数。任何元素的计数都不能为负，也不能是0。elementSet()和entrySet()视图中也不会有这样的元素
- `multiset.size()`返回集合的大小，等同于所有元素计数的总和。对于不重复元素的个数，应使用`elementSet().size()`方法
- `multiset.iterator()`会迭代重复元素，因此迭代长度等于`multiset.size()`
- Multiset支持直接增加、减少或设置元素的计数。`setCount(elem, 0)`等同于移除所有elem
- 对multiset 中没有的元素，`multiset.count(elem)`始终返回0



**Multiset的各种实现**

Guava提供了多种Multiset的实现，大致对应JDK中Map的各种实现：

| Map               | 对应的Multiset         | 是否支持null                 |
| :---------------- | :--------------------- | :--------------------------- |
| HashMap           | HashMultiset           | 是                           |
| TreeMap           | TreeMultiset           | 是（如果comparator支持的话） |
| LinkedHashMap     | LinkedHashMultiset     | 是                           |
| ConcurrentHashMap | ConcurrentHashMultiset | 否                           |
| ImmutableMap      | ImmutableMultiset      | 否                           |



#### SortedMultiset

`SortedMultiset`是 Multiset 接口的变种，它支持高效地获取指定范围的子集

TreeMultiset实现SortedMultiset接口



#### Multimap

`Multimap`可以代替`Map<K, List<V>>、Map<K, Set<V>>`等结构

Map<K, Set\<V>>通常用来表示非标定有向图。Multimap可以很容易地把一个键映射到多个值



可以用两种方式思考Multimap的概念：

+ ”键-单个值映射”的集合：

  ```java
  a -> 1, a -> 2, a ->4, b -> 3, c -> 5
  ```

+ 或者”键-值集合映射”的映射：

  ```java
  a -> [1, 2, 4] b -> 3 c -> 5
  ```



一般来说，Multimap接口应该用第一种方式看待，但asMap()视图返回`Map<K, Collection<V>>`，也可以按另一种方式看待Multimap

重要的是，不会有任何键映射到空集合：一个键要么至少到一个值，要么根本就不在Multimap中



**修改Multimap**

`Multimap.get(key)`以集合形式返回键所对应的值视图，即使没有任何对应的值，也会返回空集合。ListMultimap.get(key)返回List，SetMultimap.get(key)返回Set。

对值视图集合进行的修改最终都会反映到底层的Multimap。例如：

```java
Set<Person> aliceChildren = childrenMultimap.get(alice);
aliceChildren.clear();
aliceChildren.add(bob);
aliceChildren.add(carol);
```



其他修改Multimap的方法

| **方法签名**               | **描述**                                                     | **等价于**                                                   |
| :------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| put(K, V)                  | 添加键到单个值的映射                                         | multimap.get(key).add(value)                                 |
| putAll(K, Iterable)        | 依次添加键到多个值的映射                                     | Iterables.addAll(multimap.get(key), values)                  |
| remove(K, V)               | 移除键到值的映射；如果有这样的键值并成功移除，返回true。     | multimap.get(key).remove(value)                              |
| removeAll(K)               | 清除键对应的所有值，返回的集合包含所有之前映射到K的值，但修改这个集合就不会影响Multimap了。 | multimap.get(key).clear()                                    |
| replaceValues(K, Iterable) | 清除键对应的所有值，并重新把key关联到Iterable中的每个元素。返回的集合包含所有之前映射到K的值。 | multimap.get(key).clear(); Iterables.addAll(multimap.get(key), values) |



**Multimap的视图**

Multimap还支持若干强大的视图：

- `asMap`为Multimap<K, V>提供Map<K,Collection\<V>>形式的视图。返回的Map支持remove操作，并且会反映到底层的Multimap，但它不支持put或putAll操作。更重要的是，如果你想为Multimap中没有的键返回null，而不是一个新的、可写的空集合，你就可以使用asMap().get(key)。（你可以并且应当把asMap.get(key)返回的结果转化为适当的集合类型——如SetMultimap.asMap.get(key)的结果转为Set，ListMultimap.asMap.get(key)的结果转为List——Java类型系统不允许ListMultimap直接为asMap.get(key)返回List——*译者注：也可以用__Multimaps中的asMap静态方法帮你完成类型转换*）
- `entries`用Collection<Map.Entry<K, V>>返回Multimap中所有”键-单个值映射”——包括重复键。（对SetMultimap，返回的是Set）
- `keySet`用Set表示Multimap中所有不同的键。
- `keys`用Multiset表示Multimap中的所有键，每个键重复出现的次数等于它映射的值的个数。可以从这个Multiset中移除元素，但不能做添加操作；移除操作会反映到底层的Multimap。
- `values()`用一个”扁平”的Collection\<V>包含Multimap中的所有值。这有一点类似于Iterables.concat(multimap.asMap().values())，但它直接返回了单个Collection，而不像multimap.asMap().values()那样是按键区分开的Collection。

**Multimap不是Map**

Multimap<K, V>不是Map<K,Collection\<V>>，虽然某些Multimap实现中可能使用了map。它们之间的显著区别包括：

- Multimap.get(key)总是返回非null、但是可能空的集合。这并不意味着Multimap为相应的键花费内存创建了集合，而只是提供一个集合视图方便你为键增加映射值——*译者注：如果有这样的键，返回的集合只是包装了__Multimap中已有的集合；如果没有这样的键，返回的空集合也只是持有Multimap引用的栈对象，让你可以用来操作底层的Multimap。因此，返回的集合不会占据太多内存，数据实际上还是存放在Multimap中。*
- 如果你更喜欢像Map那样，为Multimap中没有的键返回null，请使用asMap()视图获取一个Map<K, Collection\<V>>。（或者用静态方法[Multimaps.asMap()](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/collect/Multimaps.html#asMap(com.google.common.collect.ListMultimap))为ListMultimap返回一个Map<K, List\<V>>。对于SetMultimap和SortedSetMultimap，也有类似的静态方法存在）
- 当且仅当有值映射到键时，Multimap.containsKey(key)才会返回true。尤其需要注意的是，如果键k之前映射过一个或多个值，但它们都被移除后，Multimap.containsKey(key)会返回false。
- Multimap.entries()返回Multimap中所有”键-单个值映射”——包括重复键。如果你想要得到所有”键-值集合映射”，请使用asMap().entrySet()。
- Multimap.size()返回所有”键-单个值映射”的个数，而非不同键的个数。要得到不同键的个数，请改用Multimap.keySet().size()。



**Multimap的各种实现**

Multimap提供了多种形式的实现。在大多数要使用Map<K, Collection\<V>>的地方，你都可以使用它们：

| **实现**              | **键行为类似** | **值行为类似** |
| :-------------------- | :------------- | :------------- |
| ArrayListMultimap     | HashMap        | ArrayList      |
| HashMultimap          | HashMap        | HashSet        |
| LinkedListMultimap    | LinkedHashMap  | LinkedList     |
| LinkedHashMultimap    | LinkedHashMap  | LinkedHashMap  |
| TreeMultimap          | TreeMap        | TreeSet        |
| ImmutableListMultimap | ImmutableMap   | ImmutableList  |
| ImmutableSetMultimap  | ImmutableMap   | ImmutableSet   |

除了两个不可变形式的实现，其他所有实现都支持null键和null值

`LinkedListMultimap.entries()`保留了所有键和值的迭代顺序

`LinkedHashMultimap`保留了映射项的插入顺序，包括键插入的顺序，以及键映射的所有值的插入顺序



#### BiMap

传统上，实现键值对的双向映射需要维护两个单独的map，并保持它们间的同步。但这种方式很容易出错，而且对于值已经在map中的情况，会变得非常混乱。例如：

```
Map<String, Integer> nameToId = Maps.newHashMap();
Map<Integer, String> idToName = Maps.newHashMap();

nameToId.put("Bob", 42);
idToName.put(42, "Bob");
//如果"Bob"和42已经在map中了，会发生什么? 如果忘了同步两个map，会有诡异的bug发生...
```



BiMap是特殊的Map：

- 可以用`inverse()`反转BiMap<K, V>的键值映射
- 保证值是唯一的，因此`values()`返回Set而不是普通的Collection



在BiMap中，如果想把键映射到已经存在的值，会抛出IllegalArgumentException异常。如果对特定值，想要强制替换它的键，请使用`BiMap.forcePut(key, value)`

```java
BiMap<String, Integer> userId = HashBiMap.create();
...

String userForId = userId.inverse().get(id);
```



**BiMap的各种实现**

| 键值实现     | 值键实现     | 对应的BiMap实现 |
| :----------- | :----------- | :-------------- |
| HashMap      | HashMap      | HashBiMap       |
| ImmutableMap | ImmutableMap | ImmutableBiMap  |
| EnumMap      | EnumMap      | EnumBiMap       |
| EnumMap      | HashMap      | EnumHashBiMap   |

`Maps`类中还有一些诸如`synchronizedBiMap`的`BiMap`工具方法.



#### Table

```java
Table<Vertex, Vertex, Double> weightedGraph = HashBasedTable.create();
weightedGraph.put(v1, v2, 4);
weightedGraph.put(v1, v3, 20);
weightedGraph.put(v2, v3, 5);

weightedGraph.row(v1); // returns a Map mapping v2 to 4, v3 to 20
weightedGraph.column(v3); // returns a Map mapping v1 to 20, v2 to 5
```

通常来说，当想使用多个键做索引的时候，可能会用类似`Map<FirstName, Map<LastName, Person>>`的实现，这种方式使用上很不友好

Guava为此提供了新集合类型`Table`，它有两个支持所有类型的键：”行”和”列”。Table提供多种视图，以便从各种角度使用它：

- rowMap()：用Map<R, Map<C, V>>表现Table<R, C, V>。同样的， rowKeySet()返回”行”的集合Set\<R>。
- row(r) ：用Map<C, V>返回给定”行”的所有列，对这个map进行的写操作也将写入Table中。
- 类似的列访问方法：columnMap()、columnKeySet()、column(c)。（基于列的访问会比基于的行访问稍微低效点）
- cellSet()：用元素类型为`Table.Cell`的Set表现Table<R, C, V>。Cell类似于Map.Entry，但它是用行和列两个键区分的。



Table有如下几种实现：

- HashBasedTable：本质上用HashMap<R, HashMap<C, V>>实现；
- TreeBasedTable：本质上用TreeMap<R, TreeMap<C,V>>实现；
- ImmutableTable：本质上用ImmutableMap<R, ImmutableMap<C, V>>实现；注：ImmutableTable对稀疏或密集的数据集都有优化。
- ArrayTable：要求在构造时就指定行和列的大小，本质上由一个二维数组实现，以提升访问速度和密集Table的内存利用率。ArrayTable与其他Table的工作原理有点不同，请参见Javadoc了解详情。



#### ClassToInstanceMap

`ClassToInstanceMap`是一种特殊的Map：它的键是类型，而值是符合键所指类型的对象



ClassToInstanceMap额外声明了两个方法：`T getInstance(Class)` 和`T putInstance(Class, T)`，从而避免强制类型转换，同时保证了类型安全



ClassToInstanceMap有唯一的泛型参数，通常称为B，代表Map支持的所有类型的上界。例如：

```java
ClassToInstanceMap<Number> numberDefaults=MutableClassToInstanceMap.create();
numberDefaults.putInstance(Integer.class, Integer.valueOf(0));
```



`ClassToInstanceMap`两种有用的实现：`MutableClassToInstanceMap`和 `ImmutableClassToInstanceMap`



#### RangeSet

RangeSet描述了一组不相连的、非空的区间。当把一个区间添加到可变的RangeSet时，所有相连的区间会被合并，空区间会被忽略。例如：

```java
RangeSet<Integer> rangeSet = TreeRangeSet.create();
rangeSet.add(Range.closed(1, 10)); // {[1,10]}
rangeSet.add(Range.closedOpen(11, 15));//不相连区间:{[1,10], [11,15)}
rangeSet.add(Range.closedOpen(15, 20)); //相连区间; {[1,10], [11,20)}
rangeSet.add(Range.openClosed(0, 0)); //空区间; {[1,10], [11,20)}
rangeSet.remove(Range.open(5, 10)); //分割[1, 10]; {[1,5], [10,10], [11,20)}
```

要合并Range.closed(1, 10)和Range.closedOpen(11, 15)的区间，需要首先用`Range.canonical(DiscreteDomain)`对区间进行预处理，例如DiscreteDomain.integers()。



**RangeSet的视图**

RangeSet的实现支持非常广泛的视图：

- complement()：返回RangeSet的补集视图。complement也是RangeSet类型,包含了不相连的、非空的区间。
- subRangeSet(Range\<C>)：返回RangeSet与给定Range的交集视图。这扩展了传统排序集合中的headSet、subSet和tailSet操作。
- asRanges()：用Set<Range\<C>>表现RangeSet，这样可以遍历其中的Range。
- asSet(DiscreteDomain\<C>)（仅ImmutableRangeSet支持）：用ImmutableSortedSet\<C>表现RangeSet，以区间中所有元素的形式而不是区间本身的形式查看。（这个操作不支持DiscreteDomain 和RangeSet都没有上边界，或都没有下边界的情况）

**RangeSet的查询方法**

为了方便操作，RangeSet直接提供了若干查询方法，其中最突出的有:

- contains(C)：RangeSet最基本的操作，判断RangeSet中是否有任何区间包含给定元素。
- rangeContaining(C)：返回包含给定元素的区间；若没有这样的区间，则返回null。
- encloses(Range\<C>)：简单明了，判断RangeSet中是否有任何区间包括给定区间。
- span()：返回包括RangeSet中所有区间的最小区间。



#### RangeMap

RangeMap描述了”不相交的、非空的区间”到特定值的映射。和RangeSet不同，RangeMap不会合并相邻的映射，即便相邻的区间映射到相同的值。例如：

```java
RangeMap<Integer, String> rangeMap = TreeRangeMap.create();
rangeMap.put(Range.closed(1, 10), "foo"); //{[1,10] => "foo"}
rangeMap.put(Range.open(3, 6), "bar"); //{[1,3] => "foo", (3,6) => "bar", [6,10] => "foo"}
rangeMap.put(Range.open(10, 20), "foo"); //{[1,3] => "foo", (3,6) => "bar", [6,10] => "foo", (10,20) => "foo"}
rangeMap.remove(Range.closed(5, 11)); //{[1,3] => "foo", (3,5) => "bar", (11,20) => "foo"}
```

**RangeMap的视图**

RangeMap提供两个视图：

- asMapOfRanges()：用Map<Range\<K>, V>表现RangeMap。这可以用来遍历RangeMap。
- subRangeMap(Range\<K>)：用RangeMap类型返回RangeMap与给定Range的交集视图。这扩展了传统的headMap、subMap和tailMap操作。



### 集合工具类

| **集合接口** | 属于  | 对应的Guava工具类 |
| :----------- | :---- | :---------------- |
| Collection   | JDK   | `Collections2`    |
| List         | JDK   | `Lists`           |
| Set          | JDK   | `Sets`            |
| SortedSet    | JDK   | `Sets`            |
| Map          | JDK   | `Maps`            |
| SortedMap    | JDK   | `Maps`            |
| Queue        | JDK   | `Queues`          |
| Multiset     | Guava | `Multisets`       |
| Multimap     | Guava | `Multimaps`       |
| BiMap        | Guava | `Maps`            |
| Table        | Guava | `Tables`          |



#### 静态工厂方法

在JDK 7之前，构造新的范型集合时要重复声明范型：

```java
List<TypeTest> list = new ArrayList<TypeTest>();
```

JDK7版本没有这样的麻烦：

```java
List<TypeTest> list = new ArrayList<>();
```



Guava提供了能够推断范型的静态工厂方法，可以方便地在初始化时就指定起始元素：

```java
List<TypeTest> list = Lists.newArrayList();
Map<KeyType, ValueType> map = Maps.newLinkedHashMap();

Set<Type> copySet = Sets.newHashSet(elements);
List<String> theseElements = Lists.newArrayList("alpha", "beta", "gamma");
```



通过为工厂方法命名，可以提高集合初始化大小的可读性：

```java
List<Type> exactly100 = Lists.newArrayListWithCapacity(100);
List<Type> approx100 = Lists.newArrayListWithExpectedSize(100);
Set<Type> approx100Set = Sets.newHashSetWithExpectedSize(100);
```



注意：Guava引入的新集合类型没有暴露原始构造器，也没有在工具类中提供初始化方法。而是直接在集合类中提供了静态工厂方法，例如：

```java
Multiset<String> multiset = HashMultiset.create();
```



#### Iterables

Guava提供的工具方法更偏向于接受Iterable而不是Collection类型

在Google，对于不存放在主存的集合——比如从数据库或其他数据中心收集的结果集，因为实际上还没有攫取全部数据，这类结果集都不能支持类似size()的操作 ——通常都不会用Collection类型来表示。

支持所有集合的操作都在`Iterables`类中。大多数Iterables方法有一个在`Iterators`类中的对应版本，用来处理Iterator



#### 常规方法

| 方法名                          |                                                              |                                                              |
| :------------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `concat(Iterable)`              | 串联多个iterables的懒视图*                                   | `concat(Iterable...)`                                        |
| `frequency(Iterable, Object)`   | 返回对象在iterable中出现的次数                               | 与Collections.frequency (Collection, Object)比较；Multiset   |
| `partition(Iterable, int)`      | 把iterable按指定大小分割，得到的子集都不能进行修改操作       | `Lists.partition(List, int)`；`paddedPartition(Iterable, int)` |
| `getFirst(Iterable, T default)` | 返回iterable的第一个元素，若iterable为空则返回默认值         | 与Iterable.iterator(). next()比较;`FluentIterable.first()`   |
| `getLast(Iterable)`             | 返回iterable的最后一个元素，若iterable为空则抛出NoSuchElementException | `getLast(Iterable, T default)`                               |



#### 与Collection方法相似的工具方法

通常来说，Collection的实现天然支持操作其他Collection，但却不能操作Iterable。

下面的方法中，如果传入的Iterable是一个Collection实例，则实际操作将会委托给相应的Collection接口方法

例如，往`Iterables.size`方法传入是一个`Collection实例`，它不会真的遍历iterator获取大小，而是直接调用`Collection.size`

| 方法                                                  | 类似的Collection方法             | 等价的FluentIterable方法          |
| :---------------------------------------------------- | :------------------------------- | :-------------------------------- |
| `addAll(Collection addTo, Iterable toAdd)`            | Collection.addAll(Collection)    |                                   |
| `contains(Iterable, Object)`                          | Collection.contains(Object)      | `FluentIterable.contains(Object)` |
| `removeAll(Iterable removeFrom, Collection toRemove)` | Collection.removeAll(Collection) |                                   |
| `retainAll(Iterable removeFrom, Collection toRetain)` | Collection.retainAll(Collection) |                                   |
| `size(Iterable)`                                      | Collection.size()                | `FluentIterable.size()`           |
| `toArray(Iterable, Class)`                            | Collection.toArray(T[])          | `FluentIterable.toArray(Class)`   |
| `isEmpty(Iterable)`                                   | Collection.isEmpty()             | `FluentIterable.isEmpty()`        |
| `get(Iterable, int)`                                  | List.get(int)                    | `FluentIterable.get(int)`         |
| `toString(Iterable)`                                  | Collection.toString()            | `FluentIterable.toString()`       |



#### FluentIterable

FluentIterable有一些便利方法用来把自己拷贝到不可变集合

| 方法名             |                                    |
| :----------------- | ---------------------------------- |
| ImmutableList      |                                    |
| ImmutableSet       | `toImmutableSet()`                 |
| ImmutableSortedSet | `toImmutableSortedSet(Comparator)` |



#### Lists

除了静态工厂方法和函数式编程方法，`Lists`为List类型的对象提供了若干工具方法。

| **方法**               | **描述**                                                     |
| :--------------------- | :----------------------------------------------------------- |
| `partition(List, int)` | 把List按指定大小分割                                         |
| [`reverse(List)`       | 返回给定List的反转视图。注: 如果List是不可变的，考虑改用`ImmutableList.reverse()` |

```java
List countUp = Ints.asList(1, 2, 3, 4, 5);
List countDown = Lists.reverse(theList); // {5, 4, 3, 2, 1}
List<List> parts = Lists.partition(countUp, 2);//{{1,2}, {3,4}, {5}}
```



##### 静态工厂方法

Lists提供如下静态工厂方法：

| **具体实现类型** | **工厂方法**                                                 |
| :--------------- | :----------------------------------------------------------- |
| ArrayList        | basic, with elements, from Iterable, with exact capacity, with expected size, from Iterator |
| LinkedList       | basic, from Iterable                                         |



#### Sets

`Sets`工具类包含了若干好用的方法。

##### 集合理论方法

标准的集合运算（Set-Theoretic）方法，这些方法接受Set参数并返回`SetView`，可用于：

- 直接当作Set使用，因为SetView也实现了Set接口
- 用`copyInto(Set)`拷贝进另一个可变集合
- 用`immutableCopy()`对自己做不可变拷贝

| **方法**                        |
| :------------------------------ |
| `union(Set, Set)`               |
| `intersection(Set, Set)`        |
| `difference(Set, Set)`          |
| `symmetricDifference(Set, Set)` |

使用范例：

```java
Set<String> wordsWithPrimeLength = ImmutableSet.of("one", "two", "three", "six", "seven", "eight");
Set<String> primes = ImmutableSet.of("two", "three", "five", "seven");
SetView<String> intersection = Sets.intersection(primes,wordsWithPrimeLength);
// intersection包含"two", "three", "seven"
return intersection.immutableCopy();//可以使用交集，但不可变拷贝的读取效率更高
```



##### 其他Set工具方法

| **方法**                 | **描述**               | **另请参见**               |
| :----------------------- | :--------------------- | :------------------------- |
| `cartesianProduct(List)` | 返回所有集合的笛卡儿积 | `cartesianProduct(Set...)` |
| `powerSet(Set)`          | 返回给定集合的所有子集 |                            |

```java
Set<String> animals = ImmutableSet.of("gerbil", "hamster");
Set<String> fruits = ImmutableSet.of("apple", "orange", "banana");

Set<List<String>> product = Sets.cartesianProduct(animals, fruits);
// {{"gerbil", "apple"}, {"gerbil", "orange"}, {"gerbil", "banana"},
//  {"hamster", "apple"}, {"hamster", "orange"}, {"hamster", "banana"}}

Set<Set<String>> animalSets = Sets.powerSet(animals);
// {{}, {"gerbil"}, {"hamster"}, {"gerbil", "hamster"}}
```

##### 静态工厂方法

Sets提供如下静态工厂方法：

| **具体实现类型** | **工厂方法**                                                 |
| :--------------- | :----------------------------------------------------------- |
| HashSet          | basic, with elements, from Iterable, with expected size, from Iterator |
| LinkedHashSet    | basic, from Iterable, with expected size                     |
| TreeSet          | basic, with Comparator, from Iterable                        |



#### Maps

`Maps`类有若干值得单独说明的、很酷的方法。

**uniqueIndex**

`Maps.uniqueIndex(Iterable,Function)`通常针对的场景是：有一组对象，它们在某个属性上分别有独一无二的值，而希望能够按照这个属性值查找对象

比方说，我们有一堆字符串，这些字符串的长度都是独一无二的，而我们希望能够按照特定长度查找字符串：

```java
ImmutableMap<Integer, String> stringsByIndex = Maps.uniqueIndex(strings,
    new Function<String, Integer> () {
        public Integer apply(String string) {
            return string.length();
        }
    });
```

如果索引值不是独一无二的，请参见Multimaps.index方法。

**difference**

`Maps.difference(Map, Map)`用来比较两个Map以获取所有不同点。该方法返回MapDifference对象，把不同点的维恩图分解为：

| 方法名                 |                                                              |
| :--------------------- | :----------------------------------------------------------- |
| `entriesInCommon()`    | 两个Map中都有的映射项，包括匹配的键与值                      |
| `entriesDiffering()`   | 键相同但是值不同值映射项。返回的Map的值类型为`MapDifference.ValueDifference`，以表示左右两个不同的值 |
| `entriesOnlyOnLeft()`  | 键只存在于左边Map的映射项                                    |
| `entriesOnlyOnRight()` | 键只存在于右边Map的映射项                                    |

```java
Map<String, Integer> left = ImmutableMap.of("a", 1, "b", 2, "c", 3);
Map<String, Integer> left = ImmutableMap.of("a", 1, "b", 2, "c", 3);
MapDifference<String, Integer> diff = Maps.difference(left, right);

diff.entriesInCommon(); // {"b" => 2}
diff.entriesInCommon(); // {"b" => 2}
diff.entriesOnlyOnLeft(); // {"a" => 1}
diff.entriesOnlyOnRight(); // {"d" => 5}
```

**处理BiMap的工具方法**

Guava中处理BiMap的工具方法在Maps类中，因为BiMap也是一种Map实现。

| **BiMap\****工具方法**     | **相应的\****Map***\*工具方法**  |
| :------------------------- | :------------------------------- |
| `synchronizedBiMap(BiMap)` | Collections.synchronizedMap(Map) |
| `unmodifiableBiMap(BiMap)` | Collections.unmodifiableMap(Map) |

**静态工厂方法**

Maps提供如下静态工厂方法：

| **具体实现类型**            | **工厂方法**                                                 |
| :-------------------------- | :----------------------------------------------------------- |
| HashMap                     | [basic](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newHashMap()), [from `Map`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newHashMap(java.util.Map)), [with expected size](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newHashMapWithExpectedSize(int)) |
| LinkedHashMap               | [basic](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newLinkedHashMap()), [from `Map`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newLinkedHashMap(java.util.Map)) |
| TreeMap                     | [basic](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newTreeMap()), [from `Comparator`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newTreeMap(java.util.Comparator)), [from `SortedMap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newTreeMap(java.util.SortedMap)) |
| EnumMap                     | [from `Class`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newEnumMap(java.lang.Class)), [from `Map`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newEnumMap(java.util.Map)) |
| ConcurrentMap：支持所有操作 | [basic](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newConcurrentMap()) |
| IdentityHashMap             | [basic](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Maps.html#newIdentityHashMap()) |



#### Multisets

标准的Collection操作会忽略Multiset重复元素的个数，而只关心元素是否存在于Multiset中，如containsAll方法。为此，[`Multisets`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/collect/Multisets.html)提供了若干方法，以顾及Multiset元素的重复性：

| **方法**                                                     | **说明**                                                     | **和\****Collection***\*方法的区别**                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`containsOccurrences(Multiset sup, Multiset sub)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…lect/Multisets.html#containsOccurrences(com.google.common.collect.Multiset, com.google.common.collect.Multiset)) | 对任意o，如果sub.count(o)<=super.count(o)，返回true          | Collection.containsAll忽略个数，而只关心sub的元素是否都在super中 |
| [`removeOccurrences(Multiset removeFrom, Multiset toRemove)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ollect/Multisets.html#removeOccurrences(com.google.common.collect.Multiset, com.google.common.collect.Multiset)) | 对toRemove中的重复元素，仅在removeFrom中删除相同个数。       | Collection.removeAll移除所有出现在toRemove的元素             |
| [`retainOccurrences(Multiset removeFrom, Multiset toRetain)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ollect/Multisets.html#retainOccurrences(com.google.common.collect.Multiset, com.google.common.collect.Multiset)) | 修改removeFrom，以保证任意o都符合removeFrom.count(o)<=toRetain.count(o) | Collection.retainAll保留所有出现在toRetain的元素             |
| [`intersection(Multiset, Multiset)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…mon/collect/Multisets.html#intersection(com.google.common.collect.Multiset, com.google.common.collect.Multiset)) | 返回两个multiset的交集;                                      | 没有类似方法                                                 |

```java
Multiset<String> multiset1 = HashMultiset.create();
multiset1.add("a", 2);

Multiset<String> multiset2 = HashMultiset.create();
multiset2.add("a", 5);

multiset1.containsAll(multiset2); //返回true；因为包含了所有不重复元素，
//虽然multiset1实际上包含2个"a"，而multiset2包含5个"a"
Multisets.containsOccurrences(multiset1, multiset2); // returns false

multiset2.removeOccurrences(multiset1); // multiset2 现在包含3个"a"
multiset2.removeAll(multiset1);//multiset2移除所有"a"，虽然multiset1只有2个"a"
multiset2.isEmpty(); // returns true
```

Multisets中的其他工具方法还包括：

| [`copyHighestCountFirst(Multiset)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/co…ct/Multisets.html#copyHighestCountFirst(com.google.common.collect.Multiset)) | 返回Multiset的不可变拷贝，并将元素按重复出现的次数做降序排列 |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`unmodifiableMultiset(Multiset)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ect/Multisets.html#unmodifiableMultiset(com.google.common.collect.Multiset)) | 返回Multiset的只读视图                                       |
| [`unmodifiableSortedMultiset(SortedMultiset)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…s.html#unmodifiableSortedMultiset(com.google.common.collect.SortedMultiset)) | 返回SortedMultiset的只读视图                                 |

```
Multiset<String> multiset = HashMultiset.create();
multiset.add("a", 3);
multiset.add("b", 5);
multiset.add("c", 1);

ImmutableMultiset highestCountFirst = Multisets.copyHighestCountFirst(multiset);
//highestCountFirst，包括它的entrySet和elementSet，按{"b", "a", "c"}排列元素
```

#### Multimaps

[`Multimaps`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html)提供了若干值得单独说明的通用工具方法

##### index

作为Maps.uniqueIndex的兄弟方法，[`Multimaps.index(Iterable, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html#index(java.lang.Iterable, com.google.common.base.Function))通常针对的场景是：有一组对象，它们有共同的特定属性，我们希望按照这个属性的值查询对象，但属性值不一定是独一无二的。

比方说，我们想把字符串按长度分组。

```
ImmutableSet digits = ImmutableSet.of("zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine");
Function<String, Integer> lengthFunction = new Function<String, Integer>() {
    public Integer apply(String string) {
        return string.length();
    }
};

ImmutableListMultimap<Integer, String> digitsByLength= Multimaps.index(digits, lengthFunction);
/*
*  digitsByLength maps:
*  3 => {"one", "two", "six"}
*  4 => {"zero", "four", "five", "nine"}
*  5 => {"three", "seven", "eight"}
*/
```

##### invertFrom

鉴于Multimap可以把多个键映射到同一个值（*译者注：实际上这是任何__map都有的特性*），也可以把一个键映射到多个值，反转Multimap也会很有用。Guava 提供了[`invertFrom(Multimap toInvert, Multimap dest)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ommon/collect/Multimaps.html#invertFrom(com.google.common.collect.Multimap, M))做这个操作，并且你可以自由选择反转后的Multimap实现。

注：如果你使用的是ImmutableMultimap，考虑改用[`ImmutableMultimap.inverse()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/ImmutableMultimap.html#inverse())做反转。

```
ArrayListMultimap<String, Integer> multimap = ArrayListMultimap.create();
multimap.putAll("b", Ints.asList(2, 4, 6));
multimap.putAll("a", Ints.asList(4, 2, 1));
multimap.putAll("c", Ints.asList(2, 5, 3));

TreeMultimap<Integer, String> inverse = Multimaps.invertFrom(multimap, TreeMultimap<String, Integer>.create());
//注意我们选择的实现，因为选了TreeMultimap，得到的反转结果是有序的
/*
* inverse maps:
*  1 => {"a"}
*  2 => {"a", "b", "c"}
*  3 => {"c"}
*  4 => {"a", "b"}
*  5 => {"c"}
*  6 => {"b"}
*/
```

##### forMap

想在Map对象上使用Multimap的方法吗？[`forMap(Map)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html#forMap(java.util.Map))把Map包装成SetMultimap。这个方法特别有用，例如，与Multimaps.invertFrom结合使用，可以把多对一的Map反转为一对多的Multimap。

```
Map<String, Integer> map = ImmutableMap.of("a", 1, "b", 1, "c", 2);
SetMultimap<String, Integer> multimap = Multimaps.forMap(map);
// multimap：["a" => {1}, "b" => {1}, "c" => {2}]
Multimap<Integer, String> inverse = Multimaps.invertFrom(multimap, HashMultimap<Integer, String>.create());
// inverse：[1 => {"a","b"}, 2 => {"c"}]
```

##### 包装器

Multimaps提供了传统的包装方法，以及让你选择Map和Collection类型以自定义Multimap实现的工具方法。

| 只读包装   | [`Multimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ect/Multimaps.html#unmodifiableMultimap(com.google.common.collect.Multimap)) | [`ListMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…imaps.html#unmodifiableListMultimap(com.google.common.collect.ListMultimap)) | [`SetMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ltimaps.html#unmodifiableSetMultimap(com.google.common.collect.SetMultimap)) | [`SortedSetMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…#unmodifiableSortedSetMultimap(com.google.common.collect.SortedSetMultimap)) |
| :--------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 同步包装   | [`Multimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ect/Multimaps.html#synchronizedMultimap(com.google.common.collect.Multimap)) | [`ListMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…imaps.html#synchronizedListMultimap(com.google.common.collect.ListMultimap)) | [`SetMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ltimaps.html#synchronizedSetMultimap(com.google.common.collect.SetMultimap)) | [`SortedSetMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…#synchronizedSortedSetMultimap(com.google.common.collect.SortedSetMultimap)) |
| 自定义实现 | [`Multimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html#newMultimap(java.util.Map, com.google.common.base.Supplier)) | [`ListMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html#newListMultimap(java.util.Map, com.google.common.base.Supplier)) | [`SetMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html#newSetMultimap(java.util.Map, com.google.common.base.Supplier)) | [`SortedSetMultimap`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Multimaps.html#newSortedSetMultimap(java.util.Map, com.google.common.base.Supplier)) |

自定义Multimap的方法允许你指定Multimap中的特定实现。但要注意的是：

- Multimap假设对Map和Supplier产生的集合对象有完全所有权。这些自定义对象应避免手动更新，并且在提供给Multimap时应该是空的，此外还不应该使用软引用、弱引用或虚引用。
- 无法保证修改了Multimap以后，底层Map的内容是什么样的。
- 即使Map和Supplier产生的集合都是线程安全的，它们组成的Multimap也不能保证并发操作的线程安全性。并发读操作是工作正常的，但需要保证并发读写的话，请考虑用同步包装器解决。
- 只有当Map、Supplier、Supplier产生的集合对象、以及Multimap存放的键值类型都是可序列化的，Multimap才是可序列化的。
- Multimap.get(key)返回的集合对象和Supplier返回的集合对象并不是同一类型。但如果Supplier返回的是随机访问集合，那么Multimap.get(key)返回的集合也是可随机访问的。

请注意，用来自定义Multimap的方法需要一个Supplier参数，以创建崭新的集合。下面有个实现ListMultimap的例子——用TreeMap做映射，而每个键对应的多个值用LinkedList存储。

```
ListMultimap<String, Integer> myMultimap = Multimaps.newListMultimap(
    Maps.<String, Collection>newTreeMap(),
    new Supplier<LinkedList>() {
        public LinkedList get() {
            return Lists.newLinkedList();
        }
    });
```

#### Tables

[`Tables`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Tables.html)类提供了若干称手的工具方法。

##### 自定义Table

堪比Multimaps.newXXXMultimap(Map, Supplier)工具方法，[`Tables.newCustomTable(Map, Supplier)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Tables.html#newCustomTable(java.util.Map, com.google.common.base.Supplier))允许你指定Table用什么样的map实现行和列。

```
// 使用LinkedHashMaps替代HashMaps
Table<String, Character, Integer> table = Tables.newCustomTable(
Maps.<String, Map<Character, Integer>>newLinkedHashMap(),
new Supplier<Map<Character, Integer>> () {
public Map<Character, Integer> get() {
return Maps.newLinkedHashMap();
}
});
```

##### transpose

[`transpose(Table)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Tables.html#transpose(com.google.common.collect.Table))方法允许你把Table<C, R, V>转置成Table<R, C, V>。例如，如果你在用Table构建加权有向图，这个方法就可以把有向图反转。

##### 包装器

还有很多你熟悉和喜欢的Table包装类。然而，在大多数情况下还请使用[`ImmutableTable`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/ImmutableTable.html)

| Unmodifiable                                                 |
| :----------------------------------------------------------- |
| [`Table`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…mmon/collect/Tables.html#unmodifiableTable(com.google.common.collect.Table)) |
| [`RowSortedTable`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…s.html#unmodifiableRowSortedTable(com.google.common.collect.RowSortedTable)) |



### 扩展工具类

有时候你需要实现自己的集合扩展。也许你想要在元素被添加到列表时增加特定的行为，或者你想实现一个Iterable，其底层实际上是遍历数据库查询的结果集。Guava为你，也为我们自己提供了若干工具方法，以便让类似的工作变得更简单。（毕竟，我们自己也要用这些工具扩展集合框架。）

#### Forwarding装饰器

针对所有类型的集合接口，Guava都提供了Forwarding抽象类以简化[装饰者模式](http://en.wikipedia.org/wiki/Decorator_pattern)的使用。

Forwarding抽象类定义了一个抽象方法：delegate()，你可以覆盖这个方法来返回被装饰对象。所有其他方法都会直接委托给delegate()。例如说：ForwardingList.get(int)实际上执行了delegate().get(int)。

通过创建ForwardingXXX的子类并实现delegate()方法，可以选择性地覆盖子类的方法来增加装饰功能，而不需要自己委托每个方法——*译者注：因为所有方法都默认委托给__delegate()返回的对象，你可以只覆盖需要装饰的方法。*

此外，很多集合方法都对应一个”标准方法[standardxxx]”实现，可以用来恢复被装饰对象的默认行为，以提供相同的优点。比如在扩展AbstractList或JDK中的其他骨架类时，可以使用类似standardAddAll这样的方法。

让我们看看这个例子。假定你想装饰一个List，让其记录所有添加进来的元素。当然，无论元素是用什么方法——add(int, E), add(E), 或addAll(Collection)——添加进来的，我们都希望进行记录，因此我们需要覆盖所有这些方法。

```
class AddLoggingList<E> extends ForwardingList<E> {
    final List<E> delegate; // backing list
    @Override protected List<E> delegate() {
        return delegate;
    }
    @Override public void add(int index, E elem) {
        log(index, elem);
        super.add(index, elem);
    }
    @Override public boolean add(E elem) {
        return standardAdd(elem); // 用add(int, E)实现
    }
    @Override public boolean addAll(Collection<? extends E> c) {
        return standardAddAll(c); // 用add实现
    }
}
```

记住，默认情况下，所有方法都直接转发到被代理对象，因此覆盖ForwardingMap.put并不会改变ForwardingMap.putAll的行为。小心覆盖所有需要改变行为的方法，并且确保装饰后的集合满足接口契约。

通常来说，类似于AbstractList的抽象集合骨架类，其大多数方法在Forwarding装饰器中都有对应的”标准方法”实现。

对提供特定视图的接口，Forwarding装饰器也为这些视图提供了相应的”标准方法”实现。例如，ForwardingMap提供StandardKeySet、StandardValues和StandardEntrySet类，它们在可以的情况下都会把自己的方法委托给被装饰的Map，把不能委托的声明为抽象方法。

#### PeekingIterator

有时候，普通的Iterator接口还不够。

Iterators提供一个[`Iterators.peekingIterator(Iterator)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Iterators.html#peekingIterator(java.util.Iterator))方法，来把Iterator包装为[`PeekingIterator`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/PeekingIterator.html)，这是Iterator的子类，它能让你事先窥视[[`peek()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/PeekingIterator.html#peek())]到下一次调用next()返回的元素。

注意：Iterators.peekingIterator返回的PeekingIterator不支持在peek()操作之后调用remove()方法。

举个例子：复制一个List，并去除连续的重复元素。

```
List<E> result = Lists.newArrayList();
PeekingIterator<E> iter = Iterators.peekingIterator(source.iterator());
while (iter.hasNext()) {
    E current = iter.next();
    while (iter.hasNext() && iter.peek().equals(current)) {
        //跳过重复的元素
        iter.next();
    }
    result.add(current);
}
```

传统的实现方式需要记录上一个元素，并在特定情况下后退，但这很难处理且容易出错。相较而言，PeekingIterator在理解和使用上就比较直接了。

#### AbstractIterator

实现你自己的Iterator？[`AbstractIterator`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/AbstractIterator.html)让生活更轻松。

用一个例子来解释AbstractIterator最简单。比方说，我们要包装一个iterator以跳过空值。

```
public static Iterator<String> skipNulls(final Iterator<String> in) {
    return new AbstractIterator<String>() {
        protected String computeNext() {
            while (in.hasNext()) {
                String s = in.next();
                if (s != null) {
                    return s;
                }
            }
            return endOfData();
        }
    };
}
```

你实现了[`computeNext()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/AbstractIterator.html#computeNext())方法，来计算下一个值。如果循环结束了也没有找到下一个值，请返回endOfData()表明已经到达迭代的末尾。

注意：AbstractIterator继承了UnmodifiableIterator，所以禁止实现remove()方法。如果你需要支持remove()的迭代器，就不应该继承AbstractIterator。

#### AbstractSequentialIterator

有一些迭代器用其他方式表示会更简单。[`AbstractSequentialIterator`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/AbstractSequentialIterator.html) 就提供了表示迭代的另一种方式。

```
Iterator<Integer> powersOfTwo = new AbstractSequentialIterator<Integer>(1) { // 注意初始值1!
    protected Integer computeNext(Integer previous) {
        return (previous == 1 << 30) ? null : previous * 2;
    }
};
```

我们在这儿实现了[`computeNext(T)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/AbstractSequentialIterator.html#computeNext(T))方法，它能接受前一个值作为参数。

注意，你必须额外传入一个初始值，或者传入null让迭代立即结束。因为computeNext(T)假定null值意味着迭代的末尾——AbstractSequentialIterator不能用来实现可能返回null的迭代器。



## 3. 缓存 Caches

范例

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(10, TimeUnit.MINUTES)
        .removalListener(MY_LISTENER)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) throws AnyException {
                    return createExpensiveGraph(key);
                }
        });
```



Guava Cache与ConcurrentMap很相似，但也不完全一样。最基本的区别是ConcurrentMap会一直保存所有添加的元素，直到显式地移除。相对地，Guava Cache为了限制内存占用，通常都设定为自动回收元素

在某些场景下，尽管 LoadingCache 不回收元素，它也是很有用的，因为它会自动加载缓存。



通常来说，`Guava Cache`适用于：

- 愿意消耗一些内存空间来提升速度。
- 预料到某些键会被查询一次以上。
- 缓存中存放的数据总量不会超出内存容量。（Guava Cache是单个应用运行时的本地缓存。它不把数据存放到文件或外部服务器。如果这不符合需求，可尝试`Memcached`这类工具）



### CacheLoader

LoadingCache是附带CacheLoader构建而成的缓存实现

创建自己的CacheLoader通常只需要简单地实现V load(K key) throws Exception方法

例如，你可以用下面的代码构建LoadingCache：

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) throws AnyException {
                    return createExpensiveGraph(key);
                }
            });

...
try {
    return graphs.get(key);
} catch (ExecutionException e) {
    throw new OtherException(e.getCause());
}
```

从LoadingCache查询的正规方式是使用`get(K)`方法。这个方法要么返回已经缓存的值，要么使用CacheLoader向缓存原子地加载新值。由于CacheLoader可能抛出异常，LoadingCache.get(K)也声明为抛出ExecutionException异常。如果你定义的CacheLoader没有声明任何检查型异常，则可以通过getUnchecked(K)查找缓存；但必须注意，一旦CacheLoader声明了检查型异常，就不可以调用getUnchecked(K)。

```
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .expireAfterAccess(10, TimeUnit.MINUTES)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) { // no checked exception
                    return createExpensiveGraph(key);
                }
            });

...
return graphs.getUnchecked(key);
```

getAll(Iterable<? extends K>)方法用来执行批量查询。默认情况下，对每个不在缓存中的键，getAll方法会单独调用CacheLoader.load来加载缓存项。如果批量的加载比多个单独加载更高效，你可以重载[CacheLoader.loadAll](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheLoader.html#loadAll(java.lang.Iterable))来利用这一点。getAll(Iterable)的性能也会相应提升。

*注：CacheLoader.loadAll的实现可以为没有明确请求的键加载缓存值。例如，为某组中的任意键计算值时，能够获取该组中的所有键值，loadAll方法就可以实现为在同一时间获取该组的其他键值*。*校注：getAll(Iterable)方法会调用loadAll，但会筛选结果，只会返回请求的键值对。*

### Callable

所有类型的Guava Cache，不管有没有自动加载功能，都支持[get(K, Callable)](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/Cache.html#get(java.lang.Object,java.util.concurrent.Callable))方法。这个方法返回缓存中相应的值，或者用给定的Callable运算并把结果加入到缓存中。在整个加载方法完成前，缓存项相关的可观察状态都不会更改。这个方法简便地实现了模式"如果有缓存则返回；否则运算、缓存、然后返回"。

```
Cache<Key, Graph> cache = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .build(); // look Ma, no CacheLoader
...
try {
    // If the key wasn't in the "easy to compute" group, we need to
    // do things the hard way.
    cache.get(key, new Callable<Key, Graph>() {
        @Override
        public Value call() throws AnyException {
            return doThingsTheHardWay(key);
        }
    });
} catch (ExecutionException e) {
    throw new OtherException(e.getCause());
}
```

### 显式插入

使用cache.put(key, value)方法可以直接向缓存中插入值，这会直接覆盖掉给定键之前映射的值。使用Cache.asMap()视图提供的任何方法也能修改缓存。但请注意，asMap视图的任何方法都不能保证缓存项被原子地加载到缓存中。进一步说，asMap视图的原子运算在Guava Cache的原子加载范畴之外，所以相比于Cache.asMap().putIfAbsent(K, V)，Cache.get(K, Callable\<V>) 应该总是优先使用。

### 缓存回收

Guava Cache提供了三种基本的缓存回收方式：基于容量回收、定时回收和基于引用回收。

### 基于容量的回收（size-based eviction）

如果要规定缓存项的数目不超过固定值，只需使用[`CacheBuilder.maximumSize(long)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/CacheBuilder.html#maximumSize(long))。缓存将尝试回收最近没有使用或总体上很少使用的缓存项。——*警告*：在缓存项的数目达到限定值之前，缓存就可能进行回收操作——通常来说，这种情况发生在缓存项的数目逼近限定值时。

另外，不同的缓存项有不同的“权重”（weights）——例如，如果你的缓存值，占据完全不同的内存空间，你可以使用[`CacheBuilder.weigher(Weigher)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ommon/cache/CacheBuilder.html#weigher(com.google.common.cache.Weigher))指定一个权重函数，并且用[`CacheBuilder.maximumWeight(long)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/CacheBuilder.html#maximumWeight(long))指定最大总重。在权重限定场景中，除了要注意回收也是在重量逼近限定值时就进行了，还要知道重量是在缓存创建时计算的，因此要考虑重量计算的复杂度。

```
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumWeight(100000)
        .weigher(new Weigher<Key, Graph>() {
            public int weigh(Key k, Graph g) {
                return g.vertices().size();
            }
        })
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) { // no checked exception
                    return createExpensiveGraph(key);
                }
            });
```

### 定时回收（Timed Eviction）

```
CacheBuilder``提供两种定时回收的方法：
```

- [`expireAfterAccess(long, TimeUnit)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…eBuilder.html#expireAfterAccess(long, java.util.concurrent.TimeUnit))：缓存项在给定时间内没有被读/写访问，则回收。请注意这种缓存的回收顺序和基于大小回收一样。
- [`expireAfterWrite(long, TimeUnit)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…heBuilder.html#expireAfterWrite(long, java.util.concurrent.TimeUnit))：缓存项在给定时间内没有被写访问（创建或覆盖），则回收。如果认为缓存数据总是在固定时候后变得陈旧不可用，这种回收方式是可取的。

如下文所讨论，定时回收周期性地在写操作中执行，偶尔在读操作中执行。

#### 测试定时回收

对定时回收进行测试时，不一定非得花费两秒钟去测试两秒的过期。你可以使用[`Ticker`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Ticker.html)接口和[`CacheBuilder.ticker(Ticker)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…e/common/cache/CacheBuilder.html#ticker(com.google.common.base.Ticker))方法在缓存中自定义一个时间源，而不是非得用系统时钟。

### 基于引用的回收（Reference-based Eviction）

通过使用弱引用的键、或弱引用的值、或软引用的值，Guava Cache可以把缓存设置为允许垃圾回收：

- [`CacheBuilder.weakKeys()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheBuilder.html#weakKeys())：使用弱引用存储键。当键没有其它（强或软）引用时，缓存项可以被垃圾回收。因为垃圾回收仅依赖恒等式（==），使用弱引用键的缓存用==而不是equals比较键。
- [`CacheBuilder.weakValues()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheBuilder.html#weakValues())：使用弱引用存储值。当值没有其它（强或软）引用时，缓存项可以被垃圾回收。因为垃圾回收仅依赖恒等式（==），使用弱引用值的缓存用==而不是equals比较值。
- [`CacheBuilder.softValues()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheBuilder.html#softValues())：使用软引用存储值。软引用只有在响应内存需要时，才按照全局最近最少使用的顺序回收。考虑到使用软引用的性能影响，我们通常建议使用更有性能预测性的缓存大小限定（见上文，基于容量回收）。使用软引用值的缓存同样用==而不是equals比较值。

### 显式清除

任何时候，你都可以显式地清除缓存项，而不是等到它被回收：

- 个别清除：[`Cache.invalidate(key)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/Cache.html#invalidate(java.lang.Object))
- 批量清除：[`Cache.invalidateAll(keys)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/Cache.html#invalidateAll(java.lang.Iterable))
- 清除所有缓存项：[`Cache.invalidateAll()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/Cache.html#invalidateAll())

### 移除监听器

通过[`CacheBuilder.removalListener(RemovalListener)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…eBuilder.html#removalListener(com.google.common.cache.RemovalListener))，你可以声明一个监听器，以便缓存项被移除时做一些额外操作。缓存项被移除时，[`RemovalListener`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/RemovalListener.html)会获取移除通知[`RemovalNotification`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/RemovalNotification.html)，其中包含移除原因[`RemovalCause`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/RemovalCause.html)、键和值。

请注意，RemovalListener抛出的任何异常都会在记录到日志后被丢弃[swallowed]。

```
CacheLoader<Key, DatabaseConnection> loader = new CacheLoader<Key, DatabaseConnection> () {
    public DatabaseConnection load(Key key) throws Exception {
        return openConnection(key);
    }
};

RemovalListener<Key, DatabaseConnection> removalListener = new RemovalListener<Key, DatabaseConnection>() {
    public void onRemoval(RemovalNotification<Key, DatabaseConnection> removal) {
        DatabaseConnection conn = removal.getValue();
        conn.close(); // tear down properly
    }
};

return CacheBuilder.newBuilder()
    .expireAfterWrite(2, TimeUnit.MINUTES)
    .removalListener(removalListener)
    .build(loader);
```

警告：默认情况下，监听器方法是在移除缓存时同步调用的。因为缓存的维护和请求响应通常是同时进行的，代价高昂的监听器方法在同步模式下会拖慢正常的缓存请求。在这种情况下，你可以使用[`RemovalListeners.asynchronous(RemovalListener, Executor)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…om.google.common.cache.RemovalListener, java.util.concurrent.Executor))把监听器装饰为异步操作。

### 清理什么时候发生？

使用CacheBuilder构建的缓存不会"自动"执行清理和回收工作，也不会在某个缓存项过期后马上清理，也没有诸如此类的清理机制。相反，它会在写操作时顺带做少量的维护工作，或者偶尔在读操作时做——如果写操作实在太少的话。

这样做的原因在于：如果要自动地持续清理缓存，就必须有一个线程，这个线程会和用户操作竞争共享锁。此外，某些环境下线程创建可能受限制，这样CacheBuilder就不可用了。

相反，我们把选择权交到你手里。如果你的缓存是高吞吐的，那就无需担心缓存的维护和清理等工作。如果你的 缓存只会偶尔有写操作，而你又不想清理工作阻碍了读操作，那么可以创建自己的维护线程，以固定的时间间隔调用[`Cache.cleanUp()`](http://docs.guava-libraries.googlecode.com/git-history/v11.0.1/javadoc/com/google/common/cache/Cache.html#cleanUp())。[`ScheduledExecutorService`](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/ScheduledExecutorService.html)可以帮助你很好地实现这样的定时调度。

### 刷新

刷新和回收不太一样。正如[LoadingCache.refresh(K)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/LoadingCache.html#refresh(K))所声明，刷新表示为键加载新值，这个过程可以是异步的。在刷新操作进行时，缓存仍然可以向其他线程返回旧值，而不像回收操作，读缓存的线程必须等待新值加载完成。

如果刷新过程抛出异常，缓存将保留旧值，而异常会在记录到日志后被丢弃[swallowed]。

重载[CacheLoader.reload(K, V)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/cache/CacheLoader.html#reload(K, V))可以扩展刷新时的行为，这个方法允许开发者在计算新值时使用旧的值。

```
//有些键不需要刷新，并且我们希望刷新是异步完成的
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .refreshAfterWrite(1, TimeUnit.MINUTES)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) { // no checked exception
                    return getGraphFromDatabase(key);
                }

                public ListenableFuture<Key, Graph> reload(final Key key, Graph prevGraph) {
                    if (neverNeedsRefresh(key)) {
                        return Futures.immediateFuture(prevGraph);
                    }else{
                        // asynchronous!
                        ListenableFutureTask<Key, Graph> task=ListenableFutureTask.create(new Callable<Key, Graph>() {
                            public Graph call() {
                                return getGraphFromDatabase(key);
                            }
                        });
                        executor.execute(task);
                        return task;
                    }
                }
            });
```

[CacheBuilder.refreshAfterWrite(long, TimeUnit)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…eBuilder.html#refreshAfterWrite(long, java.util.concurrent.TimeUnit))可以为缓存增加自动定时刷新功能。和expireAfterWrite相反，refreshAfterWrite通过定时刷新可以让缓存项保持可用，但请注意：缓存项只有在被检索时才会真正刷新（如果CacheLoader.refresh实现为异步，那么检索不会被刷新拖慢）。因此，如果你在缓存上同时声明expireAfterWrite和refreshAfterWrite，缓存并不会因为刷新盲目地定时重置，如果缓存项没有被检索，那刷新就不会真的发生，缓存项在过期时间后也变得可以回收。

### 其他特性

#### 统计

[`CacheBuilder.recordStats()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/cache/CacheBuilder.html#recordStats())用来开启Guava Cache的统计功能。统计打开后，[`Cache.stats()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/Cache.html#stats())方法会返回[`CacheStats`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheStats.html)对象以提供如下统计信息：

- [`hitRate()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheStats.html#hitRate())：缓存命中率；
- [`averageLoadPenalty()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheStats.html#averageLoadPenalty())：加载新值的平均时间，单位为纳秒；
- [`evictionCount()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheStats.html#evictionCount())：缓存项被回收的总数，不包括显式清除。

此外，还有其他很多统计信息。这些统计信息对于调整缓存设置是至关重要的，在性能要求高的应用中我们建议密切关注这些数据。

#### asMap视图

asMap视图提供了缓存的ConcurrentMap形式，但asMap视图与缓存的交互需要注意：

- cache.asMap()包含当前所有加载到缓存的项。因此相应地，cache.asMap().keySet()包含当前所有已加载键;
- asMap().get(key)实质上等同于cache.getIfPresent(key)，而且不会引起缓存项的加载。这和Map的语义约定一致。
- 所有读写操作都会重置相关缓存项的访问时间，包括Cache.asMap().get(Object)方法和Cache.asMap().put(K, V)方法，但不包括Cache.asMap().containsKey(Object)方法，也不包括在Cache.asMap()的集合视图上的操作。比如，遍历Cache.asMap().entrySet()不会重置缓存项的读取时间。

#### 中断

缓存加载方法（如Cache.get）不会抛出InterruptedException。我们也可以让这些方法支持InterruptedException，但这种支持注定是不完备的，并且会增加所有使用者的成本，而只有少数使用者实际获益。详情请继续阅读。

Cache.get请求到未缓存的值时会遇到两种情况：当前线程加载值；或等待另一个正在加载值的线程。这两种情况下的中断是不一样的。等待另一个正在加载值的线程属于较简单的情况：使用可中断的等待就实现了中断支持；但当前线程加载值的情况就比较复杂了：因为加载值的CacheLoader是由用户提供的，如果它是可中断的，那我们也可以实现支持中断，否则我们也无能为力。

如果用户提供的CacheLoader是可中断的，为什么不让Cache.get也支持中断？从某种意义上说，其实是支持的：如果CacheLoader抛出InterruptedException，Cache.get将立刻返回（就和其他异常情况一样）；此外，在加载缓存值的线程中，Cache.get捕捉到InterruptedException后将恢复中断，而其他线程中InterruptedException则被包装成了ExecutionException。

原则上，我们可以拆除包装，把ExecutionException变为InterruptedException，但这会让所有的LoadingCache使用者都要处理中断异常，即使他们提供的CacheLoader不是可中断的。如果你考虑到所有非加载线程的等待仍可以被中断，这种做法也许是值得的。但许多缓存只在单线程中使用，它们的用户仍然必须捕捉不可能抛出的InterruptedException异常。即使是那些跨线程共享缓存的用户，也只是有时候能中断他们的get调用，取决于那个线程先发出请求。

对于这个决定，我们的指导原则是让缓存始终表现得好像是在当前线程加载值。这个原则让使用缓存或每次都计算值可以简单地相互切换。如果老代码（加载值的代码）是不可中断的，那么新代码（使用缓存加载值的代码）多半也应该是不可中断的。

如上所述，Guava Cache在某种意义上支持中断。另一个意义上说，Guava Cache不支持中断，这使得LoadingCache成了一个有漏洞的抽象：当加载过程被中断了，就当作其他异常一样处理，这在大多数情况下是可以的；但如果多个线程在等待加载同一个缓存项，即使加载线程被中断了，它也不应该让其他线程都失败（捕获到包装在ExecutionException里的InterruptedException），正确的行为是让剩余的某个线程重试加载。为此，我们记录了一个[bug](https://code.google.com/p/guava-libraries/issues/detail?id=1122)。然而，与其冒着风险修复这个bug，我们可能会花更多的精力去实现另一个建议AsyncLoadingCache，这个实现会返回一个有正确中断行为的Future对象。



## 5. 并发

### ListenableFuture

并发编程是一个难题，但是一个强大而简单的抽象可以显著的简化并发的编写。出于这样的考虑，Guava 定义了 [ListenableFuture](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ListenableFuture.html)接口并继承了JDK concurrent包下的`Future` 接口。

**我们强烈地建议你在代码中多使用`ListenableFuture来代替JDK的` `Future`**, 因为：

- `大多数Futures` 方法中需要它。
- 转到`ListenableFuture` 编程比较容易。
- Guava提供的通用公共类封装了公共的操作方方法，不需要提供Future和`ListenableFuture的扩展方法。`

#### 接口

传统JDK中的Future通过异步的方式计算返回结果:在多线程运算中可能或者可能在没有结束返回结果，Future是运行中的多线程的一个引用句柄，确保在服务执行返回一个Result。

ListenableFuture可以允许你注册回调方法(callbacks)，在运算（多线程执行）完成的时候进行调用, 或者在运算（多线程执行）完成后立即执行。这样简单的改进，使得可以明显的支持更多的操作，这样的功能在JDK concurrent中的Future是不支持的。

`ListenableFuture` 中的基础方法是`addListener(Runnable, Executor)`, 该方法会在多线程运算完的时候，指定的Runnable参数传入的对象会被指定的Executor执行。

#### 添加回调（Callbacks）

多数用户喜欢使用 [Futures.addCallback(ListenableFuture, FutureCallback, Executor)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#addCallback(com.google.common.util.concurrent.ListenableFuture, com.google.common.util.concurrent.FutureCallback, java.util.concurrent.Executor))的方式, 或者 另外一个版本[version](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#addCallback(com.google.common.util.concurrent.ListenableFuture, com.google.common.util.concurrent.FutureCallback))（译者注：[addCallback](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/src-html/com/google/common/util/concurrent/Futures.html#line.1106)(ListenableFuture\<V> future,[FutureCallback](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/FutureCallback.html)<? super V> callback)），默认是采用 `MoreExecutors.sameThreadExecutor()线程池`, 为了简化使用，Callback采用轻量级的设计. [`FutureCallback`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/FutureCallback.html) 中实现了两个方法:

- `onSuccess(V)`,在Future成功的时候执行，根据Future结果来判断。
- `onFailure(Throwable)`, 在Future失败的时候执行，根据Future结果来判断。

#### ListenableFuture的创建

对应JDK中的 [`ExecutorService.submit(Callable)`](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/ExecutorService.html#submit(java.util.concurrent.Callable)) 提交多线程异步运算的方式，Guava 提供了[`ListeningExecutorService`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ListeningExecutorService.html) 接口, 该接口返回 `ListenableFuture` 而相应的 `ExecutorService` 返回普通的 `Future`。将 `ExecutorService` 转为 `ListeningExecutorService，`可以使用MoreExecutors.listeningDecorator(ExecutorService)进行装饰。

```java
ListeningExecutorService service = MoreExecutors.listeningDecorator(Executors.newFixedThreadPool(10));
ListenableFuture explosion = service.submit(new Callable() {
  public Explosion call() {
    return pushBigRedButton();
  }
});
Futures.addCallback(explosion, new FutureCallback() {
  // we want this handler to run immediately after we push the big red button!
  public void onSuccess(Explosion explosion) {
    walkAwayFrom(explosion);
  }
  public void onFailure(Throwable thrown) {
    battleArchNemesis(); // escaped the explosion!
  }
});
```

另外, 假如你是从 [FutureTask](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/FutureTask.html)转换而来的, Guava 提供[`ListenableFutureTask.create(Callable)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…/concurrent/ListenableFutureTask.html#create(java.util.concurrent.Callable)) 和[`ListenableFutureTask.create(Runnable, V)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…common/util/concurrent/ListenableFutureTask.html#create(java.lang.Runnable, V)). 和 JDK不同的是, `ListenableFutureTask` 不能随意被继承（译者注：ListenableFutureTask中的done方法实现了调用listener的操作）。

假如你喜欢抽象的方式来设置future的值，而不是想实现接口中的方法，可以考虑继承抽象类[`AbstractFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractFuture.html) 或者直接使用 [`SettableFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/SettableFuture.html) 。

假如你必须将其他API提供的Future转换成 `ListenableFuture`，你没有别的方法只能采用硬编码的方式[`JdkFutureAdapters.listenInPoolThread(Future)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/JdkFutureAdapters.html) 来将 `Future` 转换成 `ListenableFuture`。尽可能地采用修改原生的代码返回 `ListenableFuture`会更好一些。

#### Application

使用`ListenableFuture` 最重要的理由是它可以进行一系列的复杂链式的异步操作。

```java
ListenableFuture rowKeyFuture = indexService.lookUp(query);
AsyncFunction<RowKey, QueryResult> queryFunction =
new AsyncFunction<RowKey, QueryResult>() {
public ListenableFuture apply(RowKey rowKey) {
return dataService.read(rowKey);
}
};
ListenableFuture queryFuture = Futures.transform(rowKeyFuture, queryFunction, queryExecutor);
```

其他更多的操作可以更加有效的支持而JDK中的Future是没法支持的.

不同的操作可以在不同的Executors中执行，单独的`ListenableFuture` 可以有多个操作等待。

当一个操作开始的时候其他的一些操作也会尽快开始执行–“fan-out”–`ListenableFuture` 能够满足这样的场景：促发所有的回调（callbacks）。反之更简单的工作是，同样可以满足“fan-in”场景，促发`ListenableFuture` 获取（get）计算结果，同时其它的Futures也会尽快执行：可以参考 [the implementation of `Futures.allAsList`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/src-html/com/google/common/util/concurrent/Futures.html#line.1276) 。

| 方法                                                         | 描述                                                         | 参考                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`transform(ListenableFuture, AsyncFunction, Executor)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…/Futures.html#transform(com.google.common.util.concurrent.ListenableFuture, com.google.common.util.concurrent.AsyncFunction, java.util.concurrent.Executor))`*` | `返回一个新的ListenableFuture` ，该`ListenableFuture` 返回的result是由传入的`AsyncFunction` 参数指派到传入的 `ListenableFuture中`. | [`transform(ListenableFuture, AsyncFunction)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…/Futures.html#transform(com.google.common.util.concurrent.ListenableFuture, com.google.common.util.concurrent.AsyncFunction)) |
| [`transform(ListenableFuture, Function, Executor)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…/Futures.html#transform(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function, java.util.concurrent.Executor)) | `返回一个新的ListenableFuture` ，该`ListenableFuture` 返回的result是由传入的`Function` 参数指派到传入的 `ListenableFuture中`. | [`transform(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…/Futures.html#transform(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function)) |
| [`allAsList(Iterable>)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Futures.html#allAsList(java.lang.Iterable)) | `返回一个ListenableFuture` ，该`ListenableFuture` 返回的result是一个List，List中的值是每个ListenableFuture的返回值，假如传入的其中之一fails或者cancel，这个Future fails 或者canceled | [`allAsList(ListenableFuture...)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…/Futures.html#allAsList(com.google.common.util.concurrent.ListenableFuture...)) |
| [`successfulAsList(Iterable>)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…le/common/util/concurrent/Futures.html#successfulAsList(java.lang.Iterable)) | `返回一个ListenableFuture` ，该Future的结果包含所有成功的Future，按照原来的顺序，当其中之一Failed或者cancel，则用null替代 | [`successfulAsList(ListenableFuture...)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…s.html#successfulAsList(com.google.common.util.concurrent.ListenableFuture...)) |

[`AsyncFunction`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AsyncFunction.html) 中提供一个方法`ListenableFuture<B> apply(A input)，`它可以被用于异步变换值。

```
List<ListenableFuture> queries;
// The queries go to all different data centers, but we want to wait until they're all done or failed.

ListenableFuture<List> successfulQueries = Futures.successfulAsList(queries);

Futures.addCallback(successfulQueries, callbackOnSuccessfulQueries);
```

#### CheckedFuture

Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。 Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。 Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。 Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。 Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。 Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。 Guava也提供了 [`CheckedFuture`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/CheckedFuture.html) 接口。`CheckedFuture` 是一个`ListenableFuture` ，其中包含了多个版本的get 方法，方法声明抛出检查异常.这样使得创建一个在执行逻辑中可以抛出异常的Future更加容易 。将 `ListenableFuture` 转换成`CheckedFuture`，可以使用 [`Futures.makeChecked(ListenableFuture, Function)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…utures.html#makeChecked(com.google.common.util.concurrent.ListenableFuture, com.google.common.base.Function))。



### Service框架

Guava包里的Service接口用于封装一个服务对象的运行状态、包括start和stop等方法。例如web服务器，RPC服务器、计时器等可以实现这个接口。对此类服务的状态管理并不轻松、需要对服务的开启/关闭进行妥善管理、特别是在多线程环境下尤为复杂。Guava包提供了一些基础类帮助你管理复杂的状态转换逻辑和同步细节。

**使用一个服务**

一个服务正常生命周期有：

- [Service.State.NEW](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#NEW)
- [Service.State.STARTING](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#STARTING)
- [Service.State.RUNNING](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#RUNNING)
- [Service.State.STOPPING](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#STOPPING)
- [Service.State.TERMINATED](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#TERMINATED)

服务一旦被停止就无法再重新启动了。如果服务在starting、running、stopping状态出现问题、会进入[`Service.State.FAILED`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#FAILED).状态。调用 [`startAsync()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.html#startAsync())方法可以异步开启一个服务,同时返回this对象形成方法调用链。注意：只有在当前服务的状态是[`NEW`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#NEW)时才能调用startAsync()方法，因此最好在应用中有一个统一的地方初始化相关服务。停止一个服务也是类似的、使用异步方法[`stopAsync()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.html#stopAsync()) 。但是不像startAsync(),多次调用这个方法是安全的。这是为了方便处理关闭服务时候的锁竞争问题。

**Service也提供了一些方法用于等待服务状态转换的完成:**

通过 [`addListener()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.html#addListener())方法异步添加监听器。此方法允许你添加一个 [`Service.Listener`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.Listener.html) 、它会在每次服务状态转换的时候被调用。注意：最好在服务启动之前添加Listener（这时的状态是NEW）、否则之前已发生的状态转换事件是无法在新添加的Listener上被重新触发的。

同步使用[`awaitRunning()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.html#awaitRunning())。这个方法不能被打断、不强制捕获异常、一旦服务启动就会返回。如果服务没有成功启动，会抛出IllegalStateException异常。同样的， [`awaitTerminated()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.html#awaitTerminated()) 方法会等待服务达到终止状态（[`TERMINATED`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#TERMINATED) 或者 [`FAILED`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.State.html#FAILED)）。两个方法都有重载方法允许传入超时时间。

[`Service`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/Service.html) 接口本身实现起来会比较复杂、且容易碰到一些捉摸不透的问题。因此我们不推荐直接实现这个接口。而是请继承Guava包里已经封装好的基础抽象类。每个基础类支持一种特定的线程模型。

**基础实现类**

**AbstractIdleService**

[`AbstractIdleService`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractIdleService.html) 类简单实现了Service接口、其在running状态时不会执行任何动作–因此在running时也不需要启动线程–但需要处理开启/关闭动作。要实现一个此类的服务，只需继承AbstractIdleService类，然后自己实现[`startUp()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractIdleService.html#startUp()) 和[`shutDown()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractIdleService.html#shutDown())方法就可以了。

```java
protected void startUp() {
servlets.add(new GcStatsServlet());
}
protected void shutDown() {}
```

如上面的例子、由于任何请求到GcStatsServlet时已经会有现成线程处理了，所以在服务运行时就不需要做什么额外动作了。

**AbstractExecutionThreadService**

[`AbstractExecutionThreadService`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractExecutionThreadService.html) 通过单线程处理启动、运行、和关闭等操作。你必须重载run()方法，同时需要能响应停止服务的请求。具体的实现可以在一个循环内做处理：

```java
 public void run() {
   while (isRunning()) {
     // perform a unit of work
   }
 }
```

另外，你还可以重载[`triggerShutdown()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ommon/util/concurrent/AbstractExecutionThreadService.html#triggerShutdown())方法让run()方法结束返回。

重载startUp()和shutDown()方法是可选的，不影响服务本身状态的管理

```java
 protected void startUp() {
dispatcher.listenForConnections(port, queue);
 }
 protected void run() {
   Connection connection;
   while ((connection = queue.take() != POISON)) {
     process(connection);
   }
 }
 protected void triggerShutdown() {
   dispatcher.stopListeningForConnections(queue);
   queue.put(POISON);
 }
```

start()内部会调用startUp()方法，创建一个线程、然后在线程内调用run()方法。stop()会调用 triggerShutdown()方法并且等待线程终止。

**AbstractScheduledService**

[`AbstractScheduledService`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractScheduledService.html)类用于在运行时处理一些周期性的任务。子类可以实现 [`runOneIteration()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ogle/common/util/concurrent/AbstractScheduledService.html#runOneIteration())方法定义一个周期执行的任务，以及相应的startUp()和shutDown()方法。为了能够描述执行周期，你需要实现[`scheduler()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractScheduledService.html#scheduler())方法。通常情况下，你可以使用[`AbstractScheduledService.Scheduler`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractScheduledService.Scheduler.html)类提供的两种调度器：[`newFixedRateSchedule(initialDelay, delay, TimeUnit)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ncurrent/AbstractScheduledService.Scheduler.html#newFixedRateSchedule(long, long, java.util.concurrent.TimeUnit)) 和[`newFixedDelaySchedule(initialDelay, delay, TimeUnit)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…current/AbstractScheduledService.Scheduler.html#newFixedDelaySchedule(long, long, java.util.concurrent.TimeUnit))，类似于JDK并发包中ScheduledExecutorService类提供的两种调度方式。如要自定义schedules则可以使用 [`CustomScheduler`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractScheduledService.CustomScheduler.html)类来辅助实现；具体用法见javadoc。

**AbstractService**

如需要自定义的线程管理、可以通过扩展 [`AbstractService`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractService.html)类来实现。一般情况下、使用上面的几个实现类就已经满足需求了，但如果在服务执行过程中有一些特定的线程处理需求、则建议继承AbstractService类。

继承AbstractService方法必须实现两个方法.

- **[`doStart()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractService.html#doStart()):** 首次调用startAsync()时会同时调用doStart(),doStart()内部需要处理所有的初始化工作、如果启动成功则调用[`notifyStarted()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractService.html#notifyStarted())方法；启动失败则调用[`notifyFailed()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…mmon/util/concurrent/AbstractService.html#notifyFailed(java.lang.Throwable))
- **[`doStop()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractService.html#doStop()):** 首次调用stopAsync()会同时调用doStop(),doStop()要做的事情就是停止服务，如果停止成功则调用 [`notifyStopped()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/AbstractService.html#notifyStopped())方法；停止失败则调用 [`notifyFailed()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…mmon/util/concurrent/AbstractService.html#notifyFailed(java.lang.Throwable))方法。

doStart和doStop方法的实现需要考虑下性能，尽可能的低延迟。如果初始化的开销较大，如读文件，打开网络连接，或者其他任何可能引起阻塞的操作，建议移到另外一个单独的线程去处理。

**使用ServiceManager**

除了对Service接口提供基础的实现类，Guava还提供了 [`ServiceManager`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html)类使得涉及到多个Service集合的操作更加容易。通过实例化ServiceManager类来创建一个Service集合，你可以通过以下方法来管理它们：

- **[`startAsync()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#startAsync())** ： 将启动所有被管理的服务。如果当前服务的状态都是NEW的话、那么你只能调用该方法一次、这跟 Service#startAsync()是一样的。
- **[`stopAsync()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#stopAsync())** **：**将停止所有被管理的服务。
- **[`addListener`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…html#addListener(com.google.common.util.concurrent.ServiceManager.Listener, java.util.concurrent.Executor))** **：**会添加一个[`ServiceManager.Listener`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.Listener.html)，在服务状态转换中会调用该Listener
- **[`awaitHealthy()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#awaitHealthy())** **：**会等待所有的服务达到Running状态
- **[`awaitStopped()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#awaitStopped())：**会等待所有服务达到终止状态

检测类的方法有：

- **[`isHealthy()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#isHealthy()) \****：**如果所有的服务处于Running状态、会返回True
- **[`servicesByState()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#servicesByState())：**以状态为索引返回当前所有服务的快照
- **[`startupTimes()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/util/concurrent/ServiceManager.html#startupTimes()) ：**返回一个Map对象，记录被管理的服务启动的耗时、以毫秒为单位，同时Map默认按启动时间排序。

我们建议整个服务的生命周期都能通过ServiceManager来管理，不过即使状态转换是通过其他机制触发的、也不影响ServiceManager方法的正确执行。例如：当一个服务不是通过startAsync()、而是其他机制启动时，listeners 仍然可以被正常调用、awaitHealthy()也能够正常工作。ServiceManager 唯一强制的要求是当其被创建时所有的服务必须处于New状态。



## 6. 字符串处理

### 连接器[Joiner]

用分隔符把字符串序列连接起来也可能会遇上不必要的麻烦。如果字符串序列中含有null，那连接操作会更难。Fluent风格的[`Joiner`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/base/Joiner.html)让连接字符串更简单。

```
Joiner joiner = Joiner.on("; ").skipNulls();
return joiner.join("Harry", null, "Ron", "Hermione");
```

上述代码返回”Harry; Ron; Hermione”。另外，useForNull(String)方法可以给定某个字符串来替换null，而不像skipNulls()方法是直接忽略null。 Joiner也可以用来连接对象类型，在这种情况下，它会把对象的toString()值连接起来。

```
Joiner.on(",").join(Arrays.asList(1, 5, 7)); // returns "1,5,7"
```

*警告：joiner实例总是不可变的。用来定义joiner目标语义的配置方法总会返回一个新的joiner实例。这使得joiner实例都是线程安全的，你可以将其定义为static final常量。*

### 拆分器[Splitter]

JDK内建的字符串拆分工具有一些古怪的特性。比如，String.split悄悄丢弃了尾部的分隔符。 问题：”,a,,b,”.split(“,”)返回？

1. “”, “a”, “”, “b”, “”
2. null, “a”, null, “b”, null
3. “a”, null, “b”
4. “a”, “b”
5. 以上都不对

正确答案是5：””, “a”, “”, “b”。只有尾部的空字符串被忽略了。 [`Splitter`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html)使用令人放心的、直白的流畅API模式对这些混乱的特性作了完全的掌控。

```java
Splitter.on(',')
        .trimResults()
        .omitEmptyStrings()
        .split("foo,bar,,   qux");
```

上述代码返回Iterable\<String>，其中包含”foo”、”bar”和”qux”。Splitter可以被设置为按照任何模式、字符、字符串或字符匹配器拆分。

#### 拆分器工厂

| **方法**                                                     | **描述**                                               | **范例**                                     |
| :----------------------------------------------------------- | :----------------------------------------------------- | :------------------------------------------- |
| [`Splitter.on(char)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#on(char)) | 按单个字符拆分                                         | Splitter.on(‘;’)                             |
| [`Splitter.on(CharMatcher)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#on(com.google.common.base.CharMatcher)) | 按字符匹配器拆分                                       | Splitter.on(CharMatcher.BREAKING_WHITESPACE) |
| [`Splitter.on(String)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#on(java.lang.String)) | 按字符串拆分                                           | Splitter.on(“, “)                            |
| [`Splitter.on(Pattern)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#on(java.util.regex.Pattern)) [`Splitter.onPattern(String)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#onPattern(java.lang.String)) | 按正则表达式拆分                                       | Splitter.onPattern(“\r?\n”)                  |
| [`Splitter.fixedLength(int)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#fixedLength(int)) | 按固定长度拆分；最后一段可能比给定长度短，但不会为空。 | Splitter.fixedLength(3)                      |

#### 拆分器修饰符

| **方法**                                                     | **描述**                                               |
| :----------------------------------------------------------- | :----------------------------------------------------- |
| [`omitEmptyStrings()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#omitEmptyStrings()) | 从结果中自动忽略空字符串                               |
| [`trimResults()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#trimResults()) | 移除结果字符串的前导空白和尾部空白                     |
| [`trimResults(CharMatcher)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…e/common/base/Splitter.html#trimResults(com.google.common.base.CharMatcher)) | 给定匹配器，移除结果字符串的前导匹配字符和尾部匹配字符 |
| [`limit(int)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Splitter.html#limit(int)) | 限制拆分出的字符串数量                                 |

如果你想要拆分器返回List，只要使用Lists.newArrayList(splitter.split(string))或类似方法。 *警告：splitter实例总是不可变的。用来定义splitter目标语义的配置方法总会返回一个新的splitter实例。这使得splitter实例都是线程安全的，你可以将其定义为static final常量。*

### 字符匹配器[CharMatcher]

在以前的Guava版本中，StringUtil类疯狂地膨胀，其拥有很多处理字符串的方法：allAscii、collapse、collapseControlChars、collapseWhitespace、indexOfChars、lastIndexNotOf、numSharedChars、removeChars、removeCrLf、replaceChars、retainAllChars、strip、stripAndCollapse、stripNonDigits。 所有这些方法指向两个概念上的问题：

1. 怎么才算匹配字符？
2. 如何处理这些匹配字符？

为了收拾这个泥潭，我们开发了CharMatcher。

直观上，你可以认为一个CharMatcher实例代表着某一类字符，如数字或空白字符。事实上来说，CharMatcher实例就是对字符的布尔判断——CharMatcher确实也实现了[Predicate](http://code.google.com/p/guava-libraries/wiki/FunctionalExplained#Predicate)——但类似”所有空白字符”或”所有小写字母”的需求太普遍了，Guava因此创建了这一API。

然而使用CharMatcher的好处更在于它提供了一系列方法，让你对字符作特定类型的操作：修剪[trim]、折叠[collapse]、移除[remove]、保留[retain]等等。CharMatcher实例首先代表概念1：怎么才算匹配字符？然后它还提供了很多操作概念2：如何处理这些匹配字符？这样的设计使得API复杂度的线性增加可以带来灵活性和功能两方面的增长。

```
String noControl = CharMatcher.JAVA_ISO_CONTROL.removeFrom(string); //移除control字符
String theDigits = CharMatcher.DIGIT.retainFrom(string); //只保留数字字符
String spaced = CharMatcher.WHITESPACE.trimAndCollapseFrom(string, ' ');
//去除两端的空格，并把中间的连续空格替换成单个空格
String noDigits = CharMatcher.JAVA_DIGIT.replaceFrom(string, "*"); //用*号替换所有数字
String lowerAndDigit = CharMatcher.JAVA_DIGIT.or(CharMatcher.JAVA_LOWER_CASE).retainFrom(string);
// 只保留数字和小写字母
```

注：CharMatcher只处理char类型代表的字符；它不能理解0x10000到0x10FFFF的Unicode 增补字符。这些逻辑字符以代理对[surrogate pairs]的形式编码进字符串，而CharMatcher只能将这种逻辑字符看待成两个独立的字符。

#### 获取字符匹配器

CharMatcher中的常量可以满足大多数字符匹配需求：

| [`ANY`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#ANY) | [`NONE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#NONE) | [`WHITESPACE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#WHITESPACE) | [`BREAKING_WHITESPACE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#BREAKING_WHITESPACE) |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`INVISIBLE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#INVISIBLE) | [`DIGIT`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#DIGIT) | [`JAVA_LETTER`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#JAVA_LETTER) | [`JAVA_DIGIT`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#JAVA_DIGIT) |
| [`JAVA_LETTER_OR_DIGIT`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#JAVA_LETTER_OR_DIGIT) | [`JAVA_ISO_CONTROL`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#JAVA_ISO_CONTROL) | [`JAVA_LOWER_CASE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#JAVA_LOWER_CASE) | [`JAVA_UPPER_CASE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#JAVA_UPPER_CASE) |
| [`ASCII`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#ASCII) | [`SINGLE_WIDTH`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#SINGLE_WIDTH) |                                                              |                                                              |

其他获取字符匹配器的常见方法包括：

| **方法**                                                     | **描述**                                                   |
| :----------------------------------------------------------- | :--------------------------------------------------------- |
| [`anyOf(CharSequence)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#anyOf(java.lang.CharSequence)) | 枚举匹配字符。如CharMatcher.anyOf(“aeiou”)匹配小写英语元音 |
| [`is(char)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#is(char)) | 给定单一字符匹配。                                         |
| [`inRange(char, char)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#inRange(char, char)) | 给定字符范围匹配，如CharMatcher.inRange(‘a’, ‘z’)          |

此外，CharMatcher还有[`negate()`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#negate())、[`and(CharMatcher)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#and(com.google.common.base.CharMatcher))和[`or(CharMatcher)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#or(com.google.common.base.CharMatcher))方法。

#### 使用字符匹配器

CharMatcher提供了[多种多样的方法](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#method_summary)操作CharSequence中的特定字符。其中最常用的罗列如下：

| **方法**                                                     | **描述**                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`collapseFrom(CharSequence, char)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#collapseFrom(java.lang.CharSequence, char)) | 把每组连续的匹配字符替换为特定字符。如WHITESPACE.collapseFrom(string, ‘ ‘)把字符串中的连续空白字符替换为单个空格。 |
| [`matchesAllOf(CharSequence)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#matchesAllOf(java.lang.CharSequence)) | 测试是否字符序列中的所有字符都匹配。                         |
| [`removeFrom(CharSequence)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#removeFrom(java.lang.CharSequence)) | 从字符序列中移除所有匹配字符。                               |
| [`retainFrom(CharSequence)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#retainFrom(java.lang.CharSequence)) | 在字符序列中保留匹配字符，移除其他字符。                     |
| [`trimFrom(CharSequence)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#trimFrom(java.lang.CharSequence)) | 移除字符序列的前导匹配字符和尾部匹配字符。                   |
| [`replaceFrom(CharSequence, CharSequence)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CharMatcher.html#replaceFrom(java.lang.CharSequence, java.lang.CharSequence)) | 用特定字符序列替代匹配字符。                                 |

所有这些方法返回String，除了matchesAllOf返回的是boolean。

### 字符集[Charsets]

不要这样做字符集处理：

```
try {
    bytes = string.getBytes("UTF-8");
} catch (UnsupportedEncodingException e) {
    // how can this possibly happen?
    throw new AssertionError(e);
}
```

试试这样写：

```
bytes = string.getBytes(Charsets.UTF_8);
```

[`Charsets`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/Charsets.html)针对所有Java平台都要保证支持的六种字符集提供了常量引用。尝试使用这些常量，而不是通过名称获取字符集实例。

#### 大小写格式[CaseFormat]

CaseFormat被用来方便地在各种ASCII大小写规范间转换字符串——比如，编程语言的命名规范。CaseFormat支持的格式如下：

| **格式**                                                     | **范例**         |
| :----------------------------------------------------------- | :--------------- |
| [`LOWER_CAMEL`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CaseFormat.html#LOWER_CAMEL) | lowerCamel       |
| [`LOWER_HYPHEN`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CaseFormat.html#LOWER_HYPHEN) | lower-hyphen     |
| [`LOWER_UNDERSCORE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CaseFormat.html#LOWER_UNDERSCORE) | lower_underscore |
| [`UPPER_CAMEL`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CaseFormat.html#UPPER_CAMEL) | UpperCamel       |
| [`UPPER_UNDERSCORE`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/base/CaseFormat.html#UPPER_UNDERSCORE) | UPPER_UNDERSCORE |

CaseFormat的用法很直接：

```
CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, "CONSTANT_NAME")); // returns "constantName"
```

我们CaseFormat在某些时候尤其有用，比如编写代码生成器的时候。





## 7. 原生类型

### 概述

Java的原生类型就是指基本类型：byte、short、int、long、float、double、char和boolean。

*在从Guava查找原生类型方法之前，可以先查查*[***Arrays\***](http://docs.oracle.com/javase/1.5.0/docs/api/java/util/Arrays.html)*类，或者对应的基础类型包装类，如*[***Integer\***](http://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Integer.html)***。\***

原生类型不能当作对象或泛型的类型参数使用，这意味着许多通用方法都不能应用于它们。Guava提供了若干通用工具，包括原生类型数组与集合API的交互，原生类型和字节数组的相互转换，以及对某些原生类型的无符号形式的支持。

| **原生类型** | **Guava\****工具类（都在***\*com.google.common.primitives\****包***\*）** |
| :----------- | :----------------------------------------------------------- |
| byte         | [`Bytes`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Bytes.html), [`SignedBytes`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/SignedBytes.html), [`UnsignedBytes`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedBytes.html) |
| short        | [`Shorts`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Shorts.html) |
| int          | [`Ints`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Ints.html), [`UnsignedInteger`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedInteger.html), [`UnsignedInts`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedInts.html) |
| long         | [`Longs`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Longs.html), [`UnsignedLong`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedLong.html), [`UnsignedLongs`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedLongs.html) |
| float        | [`Floats`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Floats.html) |
| double       | [`Doubles`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Doubles.html) |
| char         | [`Chars`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Chars.html) |
| boolean      | [`Booleans`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/Booleans.html) |

Bytes工具类没有定义任何区分有符号和无符号字节的方法，而是把它们都放到了SignedBytes和UnsignedBytes工具类中，因为字节类型的符号性比起其它类型要略微含糊一些。

int和long的无符号形式方法在UnsignedInts和UnsignedLongs类中，但由于这两个类型的大多数用法都是有符号的，Ints和Longs类按照有符号形式处理方法的输入参数。

此外，Guava为int和long的无符号形式提供了包装类，即UnsignedInteger和UnsignedLong，以帮助你使用类型系统，以极小的性能消耗对有符号和无符号值进行强制转换。

在本章下面描述的方法签名中，我们用Wrapper表示JDK包装类，prim表示原生类型。（Prims表示相应的Guava工具类。）

### 原生类型数组工具

原生类型数组是处理原生类型集合的最有效方式（从内存和性能双方面考虑）。Guava为此提供了许多工具方法。

| **方法签名**                                    | **描述**                                             | **类似方法**                                                 | **可用性** |
| :---------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------- | :--------- |
| List\<Wrapper> asList(prim… backingArray)       | 把数组转为相应包装类的List                           | [Arrays.asList](http://docs.oracle.com/javase/6/docs/api/java/util/Arrays.html#asList(T...)) | 符号无关*  |
| prim[] toArray(Collection\<Wrapper> collection) | 把集合拷贝为数组，和collection.toArray()一样线程安全 | [Collection.toArray()](http://docs.oracle.com/javase/6/docs/api/java/util/Collection.html#toArray()) | 符号无关   |
| prim[] concat(prim[]… arrays)                   | 串联多个原生类型数组                                 | [Iterables.concat](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Iterables.html#concat(java.lang.Iterable...)) | 符号无关   |
| boolean contains(prim[] array, prim target)     | 判断原生类型数组是否包含给定值                       | [Collection.contains](http://docs.oracle.com/javase/6/docs/api/java/util/Collection.html#contains(java.lang.Object)) | 符号无关   |
| int indexOf(prim[] array, prim target)          | 给定值在数组中首次出现处的索引，若不包含此值返回-1   | [List.indexOf](http://docs.oracle.com/javase/6/docs/api/java/util/List.html#indexOf(java.lang.Object)) | 符号无关   |
| int lastIndexOf(prim[] array, prim target)      | 给定值在数组最后出现的索引，若不包含此值返回-1       | [List.lastIndexOf](http://docs.oracle.com/javase/6/docs/api/java/util/List.html#lastIndexOf(java.lang.Object)) | 符号无关   |
| prim min(prim… array)                           | 数组中最小的值                                       | [Collections.min](http://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#min(java.util.Collection)) | 符号相关*  |
| prim max(prim… array)                           | 数组中最大的值                                       | [Collections.max](http://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#max(java.util.Collection)) | 符号相关   |
| String join(String separator, prim… array)      | 把数组用给定分隔符连接为字符串                       | [Joiner.on(separator).join](http://code.google.com/p/guava-libraries/wiki/StringsExplained#Joiner) | 符号相关   |
| Comparator<prim[]> lexicographicalComparator()  | 按字典序比较原生类型数组的Comparator                 | [Ordering.natural().lexicographical()](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/collect/Ordering.html#lexicographical()) | 符号相关   |

*符号无关方法存在于Bytes, Shorts, Ints, Longs, Floats, Doubles, Chars, Booleans。而UnsignedInts, UnsignedLongs, SignedBytes, 或UnsignedBytes不存在。

*符号相关方法存在于SignedBytes, UnsignedBytes, Shorts, Ints, Longs, Floats, Doubles, Chars, Booleans, UnsignedInts, UnsignedLongs。而Bytes不存在。

### 通用工具方法

Guava为原生类型提供了若干JDK6没有的工具方法。但请注意，其中某些方法已经存在于JDK7中。

| **方法签名**                   | **描述**                                                     | **可用性**              |
| :----------------------------- | :----------------------------------------------------------- | :---------------------- |
| int compare(prim a, prim b)    | 传统的Comparator.compare方法，但针对原生类型。JDK7的原生类型包装类也提供这样的方法 | 符号相关                |
| prim checkedCast(long value)   | 把给定long值转为某一原生类型，若给定值不符合该原生类型，则抛出IllegalArgumentException | 仅适用于符号相关的整型* |
| prim saturatedCast(long value) | 把给定long值转为某一原生类型，若给定值不符合则使用最接近的原生类型值 | 仅适用于符号相关的整型  |

*这里的整型包括byte, short, int, long。不包括char, boolean, float, 或double。

***译者注：不符合主要是指long值超出prim类型的范围，比如过大的long超出int范围。*

注：com.google.common.math.DoubleMath提供了舍入double的方法，支持多种舍入模式。相见第12章的”浮点数运算”。

### 字节转换方法

Guava提供了若干方法，用来把原生类型按**大字节序**与字节数组相互转换。所有这些方法都是符号无关的，此外Booleans没有提供任何下面的方法。

| **方法或字段签名**                  | **描述**                                                     |
| :---------------------------------- | :----------------------------------------------------------- |
| int BYTES                           | 常量：表示该原生类型需要的字节数                             |
| prim fromByteArray(byte[] bytes)    | 使用字节数组的前Prims.BYTES个字节，按**大字节序**返回原生类型值；如果bytes.length <= Prims.BYTES，抛出IAE |
| prim fromBytes(byte b1, …, byte bk) | 接受Prims.BYTES个字节参数，按**大字节序**返回原生类型值      |
| byte[] toByteArray(prim value)      | 按**大字节序**返回value的字节数组                            |

### 无符号支持

JDK原生类型包装类提供了针对有符号类型的方法，而UnsignedInts和UnsignedLongs工具类提供了相应的无符号通用方法。UnsignedInts和UnsignedLongs直接处理原生类型：使用时，由你自己保证只传入了无符号类型的值。

此外，对int和long，Guava提供了无符号包装类（[UnsignedInteger](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedInteger.html)和[UnsignedLong](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedLong.html)），来帮助你以极小的性能消耗，对有符号和无符号类型进行强制转换。

无符号通用工具方法

JDK的原生类型包装类提供了有符号形式的类似方法。

| **方法签名**                                                 | **说明**                       |
| :----------------------------------------------------------- | :----------------------------- |
| [`int UnsignedInts.parseUnsignedInt(String)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ogle/common/primitives/UnsignedInts.html#parseUnsignedInt(java.lang.String))[`long UnsignedLongs.parseUnsignedLong(String)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…le/common/primitives/UnsignedLongs.html#parseUnsignedLong(java.lang.String)) | 按无符号十进制解析字符串       |
| [`int UnsignedInts.parseUnsignedInt(String string, int radix)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…ogle/common/primitives/UnsignedInts.html#parseUnsignedInt(java.lang.String, int))[`long UnsignedLongs.parseUnsignedLong(String string, int radix)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/…le/common/primitives/UnsignedLongs.html#parseUnsignedLong(java.lang.String)) | 按无符号的特定进制解析字符串   |
| [`String UnsignedInts.toString(int)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedInts.html#toString(int))[`String UnsignedLongs.toString(long)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedLongs.html#toString(long)) | 数字按无符号十进制转为字符串   |
| [`String UnsignedInts.toString(int value, int radix)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedInts.html#toString(int, int))[`String UnsignedLongs.toString(long value, int radix)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/primitives/UnsignedLongs.html#toString(long, int)) | 数字按无符号特定进制转为字符串 |

### 无符号包装类

无符号包装类包含了若干方法，让使用和转换更容易。

| **方法签名**                                                 | **说明**                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| UnsignedPrim add(UnsignedPrim), subtract, multiply, divide, remainder | 简单算术运算                                                 |
| UnsignedPrim valueOf(BigInteger)                             | 按给定BigInteger返回无符号对象，若BigInteger为负或不匹配，抛出IAE |
| UnsignedPrim valueOf(long)                                   | 按给定long返回无符号对象，若long为负或不匹配，抛出IAE        |
| UnsignedPrim asUnsigned(prim value)                          | 把给定的值当作无符号类型。例如，UnsignedInteger.asUnsigned(1<<31)的值为2<sup>31</sup>,尽管1<<31当作int时是负的 |
| BigInteger bigIntegerValue()                                 | 用BigInteger返回该无符号对象的值                             |
| toString(), toString(int radix)                              | 返回无符号值的字符串表示                                     |







## 9. I/O

### 字节流和字符流

Guava使用术语”流” 来表示可关闭的，并且在底层资源中有位置状态的I/O数据流。术语”字节流”指的是InputStream或OutputStream，”字符流”指的是Reader 或Writer（虽然他们的接口Readable 和Appendable被更多地用于方法参数）。相应的工具方法分别在[`ByteStreams`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/ByteStreams.html) 和[`CharStreams`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/CharStreams.html)中。

大多数Guava流工具一次处理一个完整的流，并且/或者为了效率自己处理缓冲。还要注意到，接受流为参数的Guava方法不会关闭这个流：关闭流的职责通常属于打开流的代码块。

其中的一些工具方法列举如下：

| **ByteStreams**                                              | **CharStreams**                                              |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`byte[\] toByteArray(InputStream)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/ByteStreams.html#toByteArray(java.io.InputStream)) | [`String toString(Readable)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/CharStreams.html#toString(java.lang.Readable)) |
| N/A                                                          | [`List readLines(Readable)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharStreams.html#readLines(java.lang.Readable)) |
| [`long copy(InputStream, OutputStream)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/ByteStreams.html#copy(java.io.InputStream, java.io.OutputStream)) | [`long copy(Readable, Appendable)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/CharStreams.html#copy(java.lang.Readable, java.lang.Appendable)) |
| [`void readFully(InputStream, byte[\])`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/ByteStreams.html#readFully(java.io.InputStream, byte[])) | N/A                                                          |
| [`void skipFully(InputStream, long)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteStreams.html#skipFully(java.io.InputStream, long)) | [`void skipFully(Reader, long)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharStreams.html#skipFully(java.io.Reader, long)) |
| [`OutputStream nullOutputStream()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteStreams.html#nullOutputStream()) | [`Writer nullWriter()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharStreams.html#nullWriter()) |

**关于InputSupplier 和OutputSupplier要注意：**

在ByteStreams、CharStreams以及com.google.common.io包中的一些其他类中，某些方法仍然在使用InputSupplier和OutputSupplier接口。这两个借口和相关的方法是不推荐使用的：它们已经被下面描述的source和sink类型取代了，并且最终会被移除。

### 源与汇

通常我们都会创建I/O工具方法，这样可以避免在做基础运算时总是直接和流打交道。例如，Guava有Files.toByteArray(File) 和Files.write(File, byte[])。然而，流工具方法的创建经常最终导致散落各处的相似方法，每个方法读取不同类型的源

或写入不同类型的汇[sink]。例如，Guava中的Resources.toByteArray(URL)和Files.toByteArray(File)做了同样的事情，只不过数据源一个是URL，一个是文件。

为了解决这个问题，Guava有一系列关于源与汇的抽象。源或汇指某个你知道如何从中打开流的资源，比如File或URL。源是可读的，汇是可写的。此外，源与汇按照字节和字符划分类型。

| **字节** | **字符**                                                     |                                                              |
| :------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| **读**   | [`ByteSource`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/ByteSource.html) | [`CharSource`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/CharSource.html) |
| **写**   | [`ByteSink`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/ByteSink.html) | [`CharSink`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/CharSink.html) |

源与汇API的好处是它们提供了通用的一组操作。比如，一旦你把数据源包装成了ByteSource，无论它原先的类型是什么，你都得到了一组按字节操作的方法。

#### 创建源与汇

Guava提供了若干源与汇的实现：

| **字节**                                                     | **字符**                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`Files.asByteSource(File)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Files.html#asByteSource(java.io.File)) | [`Files.asCharSource(File, Charset)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Files.html#asCharSource(java.io.File, java.nio.charset.Charset)) |
| [`Files.asByteSink(File, FileWriteMode...)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Files.html#asByteSink(java.io.File, com.google.common.io.FileWriteMode...)) | [`Files.asCharSink(File, Charset, FileWriteMode...)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Files.html#asCharSink(java.io.File, java.nio.charset.Charset, com.google.common.io.FileWriteMode...)) |
| [`Resources.asByteSource(URL)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Resources.html#asByteSource(java.net.URL)) | [`Resources.asCharSource(URL, Charset)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Resources.html#asCharSource(java.net.URL, java.nio.charset.Charset)) |
| [`ByteSource.wrap(byte[\])`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#wrap(byte[])) | [`CharSource.wrap(CharSequence)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#wrap(java.lang.CharSequence)) |
| [`ByteSource.concat(ByteSource...)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#concat(com.google.common.io.ByteSource...)) | [`CharSource.concat(CharSource...)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#concat(com.google.common.io.CharSource...)) |
| [`ByteSource.slice(long, long)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#slice(long, long)) | N/A                                                          |
| N/A                                                          | [`ByteSource.asCharSource(Charset)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#asCharSource(java.nio.charset.Charset)) |
| N/A                                                          | [`ByteSink.asCharSink(Charset)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSink.html#asCharSink(java.nio.charset.Charset)) |

此外，你也可以继承这些类，以创建新的实现。

注：把已经打开的流（比如InputStream）包装为源或汇听起来是很有诱惑力的，但是应该避免这样做。源与汇的实现应该在每次openStream()方法被调用时都创建一个新的流。始终创建新的流可以让源或汇管理流的整个生命周期，并且让多次调用openStream()返回的流都是可用的。此外，如果你在创建源或汇之前创建了流，你不得不在异常的时候自己保证关闭流，这压根就违背了发挥源与汇API优点的初衷。

#### 使用源与汇

一旦有了源与汇的实例，就可以进行若干读写操作。

**通用操作**

所有源与汇都有一些方法用于打开新的流用于读或写。默认情况下，其他源与汇操作都是先用这些方法打开流，然后做一些读或写，最后保证流被正确地关闭了。这些方法列举如下：

- openStream()：根据源与汇的类型，返回InputStream、OutputStream、Reader或者Writer。
- openBufferedStream()：根据源与汇的类型，返回InputStream、OutputStream、BufferedReader或者BufferedWriter。返回的流保证在必要情况下做了缓冲。例如，从字节数组读数据的源就没有必要再在内存中作缓冲，这就是为什么该方法针对字节源不返回BufferedInputStream。字符源属于例外情况，它一定返回BufferedReader，因为BufferedReader中才有readLine()方法。

**源操作**

| **字节源**                                                   | **字符源**                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`byte[\] read()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#read()) | [`String read()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#read()) |
| N/A                                                          | [`ImmutableList readLines()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#readLines()) |
| N/A                                                          | [`String readFirstLine()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#readFirstLine()) |
| [`long copyTo(ByteSink)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#copyTo(com.google.common.io.ByteSink)) | [`long copyTo(CharSink)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#copyTo(com.google.common.io.CharSink)) |
| [`long copyTo(OutputStream)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#copyTo(java.io.OutputStream)) | [`long copyTo(Appendable)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#copyTo(java.lang.Appendable)) |
| [`long size()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#size()) (in bytes) | N/A                                                          |
| [`boolean isEmpty()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#isEmpty()) | [`boolean isEmpty()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSource.html#isEmpty()) |
| [`boolean contentEquals(ByteSource)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#contentEquals(com.google.common.io.ByteSource)) | N/A                                                          |
| [`HashCode hash(HashFunction)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSource.html#hash(com.google.common.hash.HashFunction)) | N/A                                                          |

汇操作

| **字节汇**                                                   | **字符汇**                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`void write(byte[\])`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSink.html#write(byte[])) | [`void write(CharSequence)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSink.html#write(java.lang.CharSequence)) |
| [`long writeFrom(InputStream)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/ByteSink.html#writeFrom(java.io.InputStream)) | [`long writeFrom(Readable)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSink.html#writeFrom(java.lang.Readable)) |
| N/A                                                          | [`void writeLines(Iterable)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSink.html#writeLines(java.lang.Iterable)) |
| N/A                                                          | [`void writeLines(Iterable, String)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/CharSink.html#writeLines(java.lang.Iterable, java.lang.String)) |

范例

```
//Read the lines of a UTF-8 text file
ImmutableList<String> lines = Files.asCharSource(file, Charsets.UTF_8).readLines();
//Count distinct word occurrences in a file
Multiset<String> wordOccurrences = HashMultiset.create(
        Splitter.on(CharMatcher.WHITESPACE)
            .trimResults()
            .omitEmptyStrings()
            .split(Files.asCharSource(file, Charsets.UTF_8).read()));

//SHA-1 a file
HashCode hash = Files.asByteSource(file).hash(Hashing.sha1());

//Copy the data from a URL to a file
Resources.asByteSource(url).copyTo(Files.asByteSink(file));
```

### 文件操作

除了创建文件源和文件的方法，Files类还包含了若干你可能感兴趣的便利方法。

| [`createParentDirs(File)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/Files.html#createParentDirs(java.io.File)) | 必要时为文件创建父目录                           |
| :----------------------------------------------------------- | :----------------------------------------------- |
| [`getFileExtension(String)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/Files.html#getFileExtension(java.lang.String)) | 返回给定路径所表示文件的扩展名                   |
| [`getNameWithoutExtension(String)`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Files.html#getNameWithoutExtension(java.lang.String)) | 返回去除了扩展名的文件名                         |
| [`simplifyPath(String)`](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/io/Files.html#simplifyPath(java.lang.String)) | 规范文件路径，并不总是与文件系统一致，请仔细测试 |
| [`fileTreeTraverser()`](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/io/Files.html#fileTreeTraverser()) | 返回TreeTraverser用于遍历文件树                  |







## 10. 散列

### 概述

Java内建的散列码[hash code]概念被限制为32位，并且没有分离散列算法和它们所作用的数据，因此很难用备选算法进行替换。此外，使用Java内建方法实现的散列码通常是劣质的，部分是因为它们最终都依赖于JDK类中已有的劣质散列码。

Object.hashCode往往很快，但是在预防碰撞上却很弱，也没有对分散性的预期。这使得它们很适合在散列表中运用，因为额外碰撞只会带来轻微的性能损失，同时差劲的分散性也可以容易地通过再散列来纠正（Java中所有合理的散列表都用了再散列方法）。然而，在简单散列表以外的散列运用中，Object.hashCode几乎总是达不到要求——因此，有了[com.google.common.hash](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/package-summary.html)包。

### 散列包的组成

在这个包的Java doc中，我们可以看到很多不同的类，但是文档中没有明显地表明它们是怎样 一起配合工作的。在介绍散列包中的类之前，让我们先来看下面这段代码范例：

```
HashFunction hf = Hashing.md5();
HashCode hc = hf.newHasher()
        .putLong(id)
        .putString(name, Charsets.UTF_8)
        .putObject(person, personFunnel)
        .hash();
```

#### HashFunction

[HashFunction](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/HashFunction.html)是一个单纯的（引用透明的）、无状态的方法，它把任意的数据块映射到固定数目的位指，并且保证相同的输入一定产生相同的输出，不同的输入尽可能产生不同的输出。

#### Hasher

HashFunction的实例可以提供有状态的[Hasher](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/Hasher.html)，Hasher提供了流畅的语法把数据添加到散列运算，然后获取散列值。Hasher可以接受所有原生类型、字节数组、字节数组的片段、字符序列、特定字符集的字符序列等等，或者任何给定了Funnel实现的对象。

Hasher实现了PrimitiveSink接口，这个接口为接受原生类型流的对象定义了fluent风格的API

#### Funnel

Funnel描述了如何把一个具体的对象类型分解为原生字段值，从而写入PrimitiveSink。比如，如果我们有这样一个类：

```
class Person {
    final int id;
    final String firstName;
    final String lastName;
    final int birthYear;
}
```

它对应的Funnel实现可能是：

```java
Funnel<Person> personFunnel = new Funnel<Person>() {
    @Override
    public void funnel(Person person, PrimitiveSink into) {
        into
            .putInt(person.id)
            .putString(person.firstName, Charsets.UTF_8)
            .putString(person.lastName, Charsets.UTF_8)
            .putInt(birthYear);
    }
}
```

注：putString(“abc”, Charsets.UTF_8).putString(“def”, Charsets.UTF_8)完全等同于putString(“ab”, Charsets.UTF_8).putString(“cdef”, Charsets.UTF_8)，因为它们提供了相同的字节序列。这可能带来预料之外的散列冲突。增加某种形式的分隔符有助于消除散列冲突。

#### HashCode

一旦Hasher被赋予了所有输入，就可以通过[hash()](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/Hasher.html#hash())方法获取[HashCode](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/HashCode.html)实例（多次调用hash()方法的结果是不确定的）。HashCode可以通过[asInt()](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/HashCode.html#asInt())、[asLong()](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/HashCode.html#asLong())、[asBytes()](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/HashCode.html#asBytes())方法来做相等性检测，此外，[writeBytesTo(array, offset, maxLength)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/HashCode.html#writeBytesTo(byte[], int, int))把散列值的前maxLength字节写入字节数组。

### 布鲁姆过滤器[BloomFilter]

布鲁姆过滤器是哈希运算的一项优雅运用，它可以简单地基于Object.hashCode()实现。简而言之，布鲁姆过滤器是一种概率数据结构，它允许你检测某个对象是一定不在过滤器中，还是可能已经添加到过滤器了。[布鲁姆过滤器的维基页面](http://en.wikipedia.org/wiki/Bloom_filter)对此作了全面的介绍，同时我们推荐github中的一个[教程](http://billmill.org/bloomfilter-tutorial/)。

Guava散列包有一个内建的布鲁姆过滤器实现，你只要提供Funnel就可以使用它。你可以使用[create(Funnel funnel, int expectedInsertions, double falsePositiveProbability)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/BloomFilter.html#create(com.google.common.hash.Funnel, int, double))方法获取[BloomFilter](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/BloomFilter.html)，缺省误检率[falsePositiveProbability]为3%。BloomFilter\<T>提供了[boolean mightContain(T)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/BloomFilter.html#mightContain(T)) 和[void put(T)](http://docs.guava-libraries.googlecode.com/git-history/release/javadoc/com/google/common/hash/BloomFilter.html#put(T))，它们的含义都不言自明了。

```java
BloomFilter<Person> friends = BloomFilter.create(personFunnel, 500, 0.01);
for(Person friend : friendsList) {
    friends.put(friend);
}

// 很久以后
if (friends.mightContain(dude)) {
    //dude不是朋友还运行到这里的概率为1%
    //在这儿，我们可以在做进一步精确检查的同时触发一些异步加载
}
```

### Hashing类

Hashing类提供了若干散列函数，以及运算HashCode对象的工具方法。

#### 已提供的散列函数

| [`md5()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#md5()) | [`murmur3_128()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#murmur3_128()) | [`murmur3_32()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#murmur3_32()) | [`sha1()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#sha1()) |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`sha256()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#sha256()) | [`sha512()`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#sha512()) | [`goodFastHash(int bits)`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#goodFastHash(int)) |                                                              |

#### HashCode运算

| **方法**                                                     | **描述**                                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`HashCode combineOrdered( Iterable)`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#combineOrdered(java.lang.Iterable)) | 以有序方式联接散列码，如果两个散列集合用该方法联接出的散列码相同，那么散列集合的元素可能是顺序相等的 |
| [`HashCode combineUnordered( Iterable)`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/com/google/common/hash/Hashing.html#combineUnordered(java.lang.Iterable)) | 以无序方式联接散列码，如果两个散列集合用该方法联接出的散列码相同，那么散列集合的元素可能在某种排序下是相等的 |
| [`int consistentHash( HashCode, int buckets)`](http://docs.guava-libraries.googlecode.com/git-history/release12/javadoc/co…le/common/hash/Hashing.html#consistentHash(com.google.common.hash.HashCode, int)) | 为给定的”桶”大小返回一致性哈希值。当”桶”增长时，该方法保证最小程度的一致性哈希值变化。详见[一致性哈希](http://en.wikipedia.org/wiki/Consistent_hashing)。 |







## 13. 反射

由于类型擦除，你不能够在运行时传递泛型类对象——你可能想强制转换它们，并假装这些对象是有泛型的，但实际上它们没有。

举个例子：

```
ArrayList<String> stringList = Lists.newArrayList();
ArrayList<Integer> intList = Lists.newArrayList();
System.out.println(stringList.getClass().isAssignableFrom(intList.getClass()));
returns true, even though ArrayList<String> is not assignable from ArrayList<Integer>
```

Guava提供了[TypeToken](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/reflect/TypeToken.html), 它使用了基于反射的技巧甚至让你在运行时都能够巧妙的操作和查询泛型类型。想象一下TypeToken是创建，操作，查询泛型类型（以及，隐含的类）对象的方法。

Guice用户特别注意：TypeToken与类[Guice](http://code.google.com/p/google-guice/)的[TypeLiteral](http://google-guice.googlecode.com/git/javadoc/com/google/inject/TypeLiteral.html)很相似，但是有一个点特别不同：它能够支持非具体化的类型，例如T，List\<T>，甚至是List<? extends Number>；TypeLiteral则不能支持。TypeToken也能支持序列化并且提供了很多额外的工具方法。

### 背景：类型擦除与反射

Java不能在运行时保留对象的泛型类型信息。如果你在运行时有一个ArrayList\<String>对象，你不能够判定这个对象是有泛型类型ArrayList\<String>的 —— 并且通过不安全的原始类型，你可以将这个对象强制转换成ArrayList\<Object>。

但是，反射允许你去检测方法和类的泛型类型。如果你实现了一个返回List的方法，并且你用反射获得了这个方法的返回类型，你会获得代表List\<String>的[ParameterizedType](http://docs.oracle.com/javase/6/docs/api/java/lang/reflect/ParameterizedType.html)。

TypeToken类使用这种变通的方法以最小的语法开销去支持泛型类型的操作。

### 介绍

获取一个基本的、原始类的TypeToken非常简单：

```java
TypeToken<String> stringTok = TypeToken.of(String.class);
TypeToken<Integer> intTok = TypeToken.of(Integer.class);
```

为获得一个含有泛型的类型的TypeToken —— 当你知道在编译时的泛型参数类型 —— 你使用一个空的匿名内部类：

```
TypeToken<List<String>> stringListTok = new TypeToken<List<String>>() {};
```

或者你想故意指向一个通配符类型：

```
TypeToken<Map<?, ?>> wildMapTok = new TypeToken<Map<?, ?>>() {};
```

TypeToken提供了一种方法来动态的解决泛型类型参数，如下所示：

```
static <K, V> TypeToken<Map<K, V>> mapToken(TypeToken<K> keyToken, TypeToken<V> valueToken) {
    return new TypeToken<Map<K, V>>() {}
        .where(new TypeParameter<K>() {}, keyToken)
        .where(new TypeParameter<V>() {}, valueToken);
}
...
TypeToken<Map<String, BigInteger>> mapToken = mapToken(
    TypeToken.of(String.class),
    TypeToken.of(BigInteger.class)
);
TypeToken<Map<Integer, Queue<String>>> complexToken = mapToken(
   TypeToken.of(Integer.class),
   new TypeToken<Queue<String>>() {}
);
```

注意如果mapToken只是返回了new TypeToken>()，它实际上不能把具体化的类型分配到K和V上面，举个例子

```
class Util {
    static <K, V> TypeToken<Map<K, V>> incorrectMapToken() {
        return new TypeToken<Map<K, V>>() {};
    }
}
System.out.println(Util.<String, BigInteger>incorrectMapToken());
// just prints out "java.util.Map<K, V>"
```

或者，你可以通过一个子类（通常是匿名）来捕获一个泛型类型并且这个子类也可以用来替换知道参数类型的上下文类。

```
abstract class IKnowMyType<T> {
    TypeToken<T> type = new TypeToken<T>(getClass()) {};
}
...
new IKnowMyType<String>() {}.type; // returns a correct TypeToken<String>
```

使用这种技术，你可以，例如，获得知道他们的元素类型的类。

### 查询

TypeToken支持很多种类能支持的查询，但是也会把通用的查询约束考虑在内。

支持的查询操作包括：

| 方法                   | 描述                                                         |
| :--------------------- | :----------------------------------------------------------- |
| getType()              | 获得包装的java.lang.reflect.Type.                            |
| getRawType()           | 返回大家熟知的运行时类                                       |
| getSubtype(Class<?>)   | 返回那些有特定原始类的子类型。举个例子，如果这有一个Iterable并且参数是List.class，那么返回将是List。 |
| getSupertype(Class<?>) | 产生这个类型的超类，这个超类是指定的原始类型。举个例子，如果这是一个Set并且参数是Iterable.class，结果将会是Iterable。 |
| isAssignableFrom(type) | 如果这个类型是 assignable from 指定的类型，并且考虑泛型参数，返回true。List<? extends Number>是assignable from List，但List没有. |
| getTypes()             | 返回一个Set，包含了这个所有接口，子类和类是这个类型的类。返回的Set同样提供了classes()和interfaces()方法允许你只浏览超类和接口类。 |
| isArray()              | 检查某个类型是不是数组，甚至是<? extends A[]>。              |
| getComponentType()     | 返回组件类型数组。                                           |

### resolveType

resolveType是一个可以用来“替代”context token（译者：不知道怎么翻译，只好去stackoverflow去问了）中的类型参数的一个强大而复杂的查询操作。例如，

```
TypeToken<Function<Integer, String>> funToken = new TypeToken<Function<Integer, String>>() {};

TypeToken<?> funResultToken = funToken.resolveType(Function.class.getTypeParameters()[1]));
// returns a TypeToken<String>
```

TypeToken将Java提供的TypeVariables和context token中的类型变量统一起来。这可以被用来一般性地推断出在一个类型相关方法的返回类型：

```
TypeToken<Map<String, Integer>> mapToken = new TypeToken<Map<String, Integer>>() {};
TypeToken<?> entrySetToken = mapToken.resolveType(Map.class.getMethod("entrySet").getGenericReturnType());
// returns a TypeToken<Set<Map.Entry<String, Integer>>>
```

### Invokable

Guava的Invokable是对java.lang.reflect.Method和java.lang.reflect.Constructor的流式包装。它简化了常见的反射代码的使用。一些使用例子：

#### 方法是否是public的?

JDK:

```
Modifier.isPublic(method.getModifiers())
```

Invokable:

```
invokable.isPublic()
```

#### 方法是否是package private?

JDK:

```
!(Modifier.isPrivate(method.getModifiers()) || Modifier.isPublic(method.getModifiers()))
```

Invokable:

```
invokable.isPackagePrivate()
```

#### 方法是否能够被子类重写？

JDK:

```
!(Modifier.isFinal(method.getModifiers())
|| Modifiers.isPrivate(method.getModifiers())
|| Modifiers.isStatic(method.getModifiers())
|| Modifiers.isFinal(method.getDeclaringClass().getModifiers()))
```

Invokable:

```
invokable.isOverridable()
```

#### 方法的第一个参数是否被定义了注解@Nullable？

JDK:

```
for (Annotation annotation : method.getParameterAnnotations[0]) {
    if (annotation instanceof Nullable) {
        return true;
    }
}
return false;
```

Invokable:

```
invokable.getParameters().get(0).isAnnotationPresent(Nullable.class)
```

#### 构造函数和工厂方法如何共享同样的代码？

你是否很想重复自己，因为你的反射代码需要以相同的方式工作在构造函数和工厂方法中？

Invokable提供了一个抽象的概念。下面的代码适合任何一种方法或构造函数：

```
invokable.isPublic();
invokable.getParameters();
invokable.invoke(object, args);
```

List的List.get(int)返回类型是什么？ Invokable提供了与众不同的类型解决方案：

```
Invokable<List<String>, ?> invokable = new TypeToken<List<String>>()        {}.method(getMethod);
invokable.getReturnType(); // String.class
```

### Dynamic Proxies

#### newProxy()

实用方法Reflection.newProxy(Class, InvocationHandler)是一种更安全，更方便的API，它只有一个单一的接口类型需要被代理来创建Java动态代理时

JDK:

```
Foo foo = (Foo) Proxy.newProxyInstance(
Foo.class.getClassLoader(),
new Class<?>[] {Foo.class},
invocationHandler);
```

Guava:

```
Foo foo = Reflection.newProxy(Foo.class, invocationHandler);
```

#### AbstractInvocationHandler

有时候你可能想动态代理能够更直观的支持equals()，hashCode()和toString()，那就是：

1. 一个代理实例equal另外一个代理实例，只要他们有同样的接口类型和equal的invocation handlers。
2. 一个代理实例的toString()会被代理到invocation handler的toString()，这样更容易自定义。

[AbstractInvocationHandler](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/reflect/AbstractInvocationHandler.html)实现了以上逻辑。

除此之外，AbstractInvocationHandler确保传递给handleInvocation(Object, Method, Object[\])的参数数组永远不会空，从而减少了空指针异常的机会。

### ClassPath

严格来讲，Java没有平台无关的方式来浏览类和类资源。不过一定的包或者工程下，还是能够实现的，比方说，去检查某个特定的工程的惯例或者某种一直遵从的约束。

[ClassPath](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/reflect/ClassPath.html)是一种实用工具，它提供尽最大努力的类路径扫描。用法很简单：

```
ClassPath classpath = ClassPath.from(classloader); // scans the class path used by classloader
for (ClassPath.ClassInfo classInfo : classpath.getTopLevelClasses("com.mycomp.mypackage")) {
  ...
}
```

在上面的例子中，[ClassInfo](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/reflect/ClassPath.ClassInfo.html)是被加载类的句柄。它允许程序员去检查类的名字和包的名字，让类直到需要的时候才被加载。

值得注意的是，ClassPath是一个尽力而为的工具。它只扫描jar文件中或者某个文件目录下的class文件。也不能扫描非URLClassLoader的自定义class loader管理的class，所以不要将它用于关键任务生产任务。

### Class Loading

工具方法Reflection.initialize(Class…)能够确保特定的类被初始化——执行任何静态初始化。

使用这种方法的是一个代码异味，因为静态伤害系统的可维护性和可测试性。在有些情况下，你别无选择，而与传统的框架，操作间，这一方法有助于保持代码不那么丑。