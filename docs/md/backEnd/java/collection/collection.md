# 集合

## 继承关系


![Java集合框架图](https://static.bookstack.cn/projects/java_interview_manual/images/collections_class-map.png)



Java标准库自带的`java.util`包提供了集合类`Collection`，它是除`Map`外所有其他集合类的根接口

Java的`java.util`包主要提供了以下三种类型的集合：

- `Collection`
  + `List`：一种有序列表的集合
  + `Set`：一种保证没有重复元素的集合
- `Map`：一种通过键值（key-value）查找的映射表集合



Java访问集合总是通过统一的方式——迭代器（Iterator）来实现，它最明显的好处在于无需知道集合内部元素是按什么方式存储的



由于Java的集合设计非常久远，中间经历过大规模改进，我们要注意到有一小部分集合类是遗留类，不应该继续使用：

- `Hashtable`：一种线程安全的`Map`实现；
- `Vector`：一种线程安全的`List`实现；
- `Stack`：基于`Vector`实现的`LIFO`的栈。

还有一小部分接口是遗留接口，也不应该继续使用：

- `Enumeration`：已被`Iterator`取代。





# List

有序可重复



`List`是最基础的一种集合：它是一种有序列表

`List`的行为和数组几乎完全相同：`List`内部按照放入元素的先后顺序存放，每个元素都可以通过索引确定自己的位置，`List`的索引和数组一样，从`0`开始



数组和`List`类似，也是有序结构，如果使用数组，在添加和删除元素的时候，会非常不方便。例如，从一个已有的数组`{'A', 'B', 'C', 'D', 'E'}`中删除索引为`2`的元素：

```ascii
┌───┬───┬───┬───┬───┬───┐
│ A │ B │ C │ D │ E │   │
└───┴───┴───┴───┴───┴───┘
              │   │
          ┌───┘   │
          │   ┌───┘
          │   │
          ▼   ▼
┌───┬───┬───┬───┬───┬───┐
│ A │ B │ D │ E │   │   │
└───┴───┴───┴───┴───┴───┘
```

这个“删除”操作实际上是把`'C'`后面的元素依次往前挪一个位置，而“添加”操作实际上是把指定位置以后的元素都依次向后挪一个位置，腾出来的位置给新加的元素。这两种操作，用数组实现非常麻烦。

在实际应用中，需要增删元素的有序列表，使用最多的是`ArrayList`。实际上，`ArrayList`在内部使用了数组来存储所有元素。例如，一个`ArrayList`拥有5个元素，实际数组大小为`6`（即有一个空位）：

```ascii
size=5
┌───┬───┬───┬───┬───┬───┐
│ A │ B │ C │ D │ E │   │
└───┴───┴───┴───┴───┴───┘
```

当添加一个元素并指定索引到`ArrayList`时，`ArrayList`自动移动需要移动的元素：

```ascii
size=5
┌───┬───┬───┬───┬───┬───┐
│ A │ B │   │ C │ D │ E │
└───┴───┴───┴───┴───┴───┘
```

然后，往内部指定索引的数组位置添加一个元素，然后把`size`加`1`：

```ascii
size=6
┌───┬───┬───┬───┬───┬───┐
│ A │ B │ F │ C │ D │ E │
└───┴───┴───┴───┴───┴───┘
```

继续添加元素，但是数组已满，没有空闲位置的时候，`ArrayList`先创建一个更大的新数组，然后把旧数组的所有元素复制到新数组，紧接着用新数组取代旧数组：

```ascii
size=6
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ A │ B │ F │ C │ D │ E │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

现在，新数组就有了空位，可以继续添加一个元素到数组末尾，同时`size`加`1`：

```ascii
size=7
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ A │ B │ F │ C │ D │ E │ G │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```



## List的特点

+ 可添加重复的元素
+ 可添加`null`



## 创建List

`List`接口提供的`of()`方法，根据给定元素快速创建`List`

`List.of()`方法不接受`null`值，如果传入`null`，会抛出`NullPointerException`异常



## 遍历List

+ `for`循环

+ Iterator

  ```java
  List<String> list = List.of("apple", "pear", "banana");
  for (Iterator<String> it = list.iterator(); it.hasNext(); ) {
      String s = it.next();
      System.out.println(s);
  }
  ```

  



## List和Array转换

`List`变为`Array`

+ 调用`toArray()`方法直接返回一个`Object[]`数组

  ```java
  Object[] array = list.toArray()
  ```

  

+ `toArray(T[])`传入一个类型相同的`Array`

  ```java
  Integer[] array = list.toArray(new Integer[3]);
  ```

  

+ 通过`List`接口定义的`T[] toArray(IntFunction generator)`方法

  ```java
  Integer[] array = list.toArray(Integer[]::new);
  ```





# ArrayList

`ArrayList`把添加和删除的操作封装起来，不用关心内部元素如何移动

`List`接口主要方法：

- 在末尾添加一个元素：`boolean add(E e)`
- 在指定索引添加一个元素：`boolean add(int index, E e)`
- 删除指定索引的元素：`E remove(int index)`
- 删除某个元素：`boolean remove(Object e)`
- 获取指定索引的元素：`E get(int index)`
- 获取链表大小（包含元素的个数）：`int size()`



部分源码

```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, Serializable {
    
    /**
     * 默认初始容量
     */
    private static final int DEFAULT_CAPACITY = 10;

    /**
     * 用于空实例的共享空数组实例
     */
    private static final Object[] EMPTY_ELEMENTDATA = {};

    /**
     * 用于默认大小的空实例的共享空数组实例
     */
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

    /**
     * 存储 ArrayList 元素的数组缓冲区
     * ArrayList 的容量就是这个数组缓冲区的长度
     */
    transient Object[] elementData;
    
    /**
     * ArrayList 的大小（它包含的元素数量）
     */
    private int size;
    
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
    
    /**
     * 构造一个具有指定初始容量的空列表
     */
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
        }
    }
    
    /**
     * 按照集合的迭代器返回的顺序构造一个包含指定集合元素的列表
     */
    public ArrayList(Collection<? extends E> c) {
        Object[] a = c.toArray();
        if ((size = a.length) != 0) {
            if (c.getClass() == ArrayList.class) {
                elementData = a;
            } else {
                elementData = Arrays.copyOf(a, size, Object[].class);
            }
        } else {
            elementData = EMPTY_ELEMENTDATA;
        }
    }
    
    public boolean contains(Object o) {
        return indexOf(o) >= 0;
    }
    
    /**
     * 从此列表中删除所有元素。 此调用返回后，列表将为空
     */
    public void clear() {
        modCount++;
        final Object[] es = elementData;
        for (int to = size, i = size = 0; i < to; i++)
            es[i] = null;
    }
    
}
```







# LinkedList

`LinkedList`通过“链表”也实现了List接口。在`LinkedList`中，它的内部每个元素都指向下一个元素：

```ascii
        ┌───┬───┐   ┌───┬───┐   ┌───┬───┐   ┌───┬───┐
HEAD ──>│ A │ ●─┼──>│ B │ ●─┼──>│ C │ ●─┼──>│ D │   │
        └───┴───┘   └───┴───┘   └───┴───┘   └───┴───┘
```



部分源码

```java
public class LinkedList<E> extends AbstractSequentialList<E> implements List<E>, Deque<E>, Cloneable, Serializable {
    transient int size = 0;

    /**
     * Pointer to first node.
     */
    transient Node<E> first;

    /**
     * Pointer to last node.
     */
    transient Node<E> last;
    
    public LinkedList() {
    }
    
    /**
     * 按照集合的迭代器返回的顺序构造一个包含指定集合元素的列表
     */
    public LinkedList(Collection<? extends E> c) {
        this();
        addAll(c);
    }

    public boolean addAll(Collection<? extends E> c) {
        return addAll(size, c);
    }
    
    public boolean addAll(int index, Collection<? extends E> c) {
        checkPositionIndex(index);

        Object[] a = c.toArray();
        int numNew = a.length;
        if (numNew == 0)
            return false;

        Node<E> pred, succ;
        if (index == size) {
            succ = null;
            pred = last;
        } else {
            succ = node(index);
            pred = succ.prev;
        }

        for (Object o : a) {
            @SuppressWarnings("unchecked") E e = (E) o;
            Node<E> newNode = new Node<>(pred, e, null);
            if (pred == null)
                first = newNode;
            else
                pred.next = newNode;
            pred = newNode;
        }

        if (succ == null) {
            last = pred;
        } else {
            pred.next = succ;
            succ.prev = pred;
        }

        size += numNew;
        modCount++;
        return true;
    }
    
    public E getFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return f.item;
    }

    public E getLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return l.item;
    }
   
    /**
     * 链接 e 作为最后一个元素
     */
    void linkLast(E e) {
        final Node<E> l = last;
        final Node<E> newNode = new Node<>(l, e, null);
        last = newNode;
        if (l == null)
            first = newNode;
        else
            l.next = newNode;
        size++;
        modCount++;
    }

    /**
     * 取消非空节点 x 的链接
     */
     E unlink(Node<E> x) {
        // assert x != null;
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;

        if (prev == null) {
            first = next;
        } else {
            prev.next = next;
            x.prev = null;
        }

        if (next == null) {
            last = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }

        x.item = null;
        size--;
        modCount++;
        return element;
    }
    
    /**
     * 从此列表中删除所有元素。此调用返回后，列表将为空。
     */
    public void clear() {
        for (Node<E> x = first; x != null; ) {
            Node<E> next = x.next;
            x.item = null;
            x.next = null;
            x.prev = null;
            x = next;
        }
        first = last = null;
        size = 0;
        modCount++;
    }
    
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
}
```







## 区别

|                     | ArrayList    | LinkedList           |
| :------------------ | :----------- | :------------------- |
| 获取指定元素        | 速度很快     | 需要从头开始查找元素 |
| 添加元素到末尾      | 速度很快     | 速度很快             |
| 在指定位置添加/删除 | 需要移动元素 | 不需要移动元素       |
| 内存占用            | 少           | 较大                 |



# Set

`Set`用于存储不重复的元素集合，它主要提供以下几个方法：

- 将元素添加进`Set`：`boolean add(E e)`
- 将元素从`Set`删除：`boolean remove(Object e)`
- 判断是否包含元素：`boolean contains(Object e)`



`Set`实际上相当于只存储key、不存储value的`Map`

因为放入`Set`的元素和`Map`的key类似，都要正确实现`equals()`和`hashCode()`方法，否则该元素无法正确地放入`Set`。



## HashSet

`HashSet`仅仅是对`HashMap`的一个简单封装

```java
public class HashSet<E> extends AbstractSet<E> implements Set<E>, Cloneable, Serializable {
    // 持有一个HashMap:
    private HashMap<E, Object> map;

    // 放入HashMap的value:
    private static final Object PRESENT = new Object();

    public HashSet() {
        map = new HashMap<>();
    }
    
    public HashSet(Collection<? extends E> c) {
        map = new HashMap<>(Math.max((int) (c.size()/.75f) + 1, 16));
        addAll(c);
    }
    
    
    public boolean add(E e) {
        return map.put(e, PRESENT) == null;
    }

    public boolean contains(Object o) {
        return map.containsKey(o);
    }

    public boolean remove(Object o) {
        return map.remove(o) == PRESENT;
    }
}
```



##  TreeSet

`TreeSet`是有序的，因为它实现了`SortedSet`接口

使用`TreeSet`和使用`TreeMap`的要求一样，添加的元素必须正确实现`Comparable`接口，如果没有实现`Comparable`接口，那么创建`TreeSet`时必须传入一个`Comparator`对象



部分源码

```java
public class TreeSet<E> extends AbstractSet<E> implements NavigableSet<E>, Cloneable, Serializable {

    private transient NavigableMap<E,Object> m;

    private static final Object PRESENT = new Object();
    
    public TreeSet() {
        this(new TreeMap<>());
    }
    
    TreeSet(NavigableMap<E,Object> m) {
        this.m = m;
    }
    
    public boolean add(E e) {
        return m.put(e, PRESENT)==null;
    }
    
    public boolean remove(Object o) {
        return m.remove(o)==PRESENT;
    }
}
```



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



部分代码

```java
public class TreeMap<K,V> extends AbstractMap<K,V> implements NavigableMap<K,V>, Cloneable, Serializable {
    
    /**
     * 用于在此树形图中维护顺序的比较器，如果它使用其键的自然顺序，则为 null。
     */
    @SuppressWarnings("serial") // Conditionally serializable
    private final Comparator<? super K> comparator;

    private transient Entry<K,V> root;

    /**
     * 树中的条目数
     */
    private transient int size = 0;

    /**
     * 对树的结构修改次数
     */
    private transient int modCount = 0;

    /**
     * 使用其键的自然顺序构造一个新的空树映射
     */
    public TreeMap() {
        comparator = null;
    }
    
    private V put(K key, V value, boolean replaceOld) {
        Entry<K,V> t = root;
        if (t == null) {
            addEntryToEmptyMap(key, value);
            return null;
        }
        int cmp;
        Entry<K,V> parent;
        // split comparator and comparable paths
        Comparator<? super K> cpr = comparator;
        if (cpr != null) {
            do {
                parent = t;
                cmp = cpr.compare(key, t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else {
                    V oldValue = t.value;
                    if (replaceOld || oldValue == null) {
                        t.value = value;
                    }
                    return oldValue;
                }
            } while (t != null);
        } else {
            Objects.requireNonNull(key);
            @SuppressWarnings("unchecked")
            Comparable<? super K> k = (Comparable<? super K>) key;
            do {
                parent = t;
                cmp = k.compareTo(t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else {
                    V oldValue = t.value;
                    if (replaceOld || oldValue == null) {
                        t.value = value;
                    }
                    return oldValue;
                }
            } while (t != null);
        }
        addEntry(key, value, parent, cmp < 0);
        return null;
    }
}
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





## HashMap

部分源码

```java
public class HashMap<K,V> extends AbstractMap<K,V> implements Map<K,V>, Cloneable, Serializable {
	
    /**
     * 默认初始容量 - 必须是 2 的幂
     */
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    /**
     * 构造函数中未指定时使用的负载因子
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    /**
     * 使用树而不是列表的 bin 计数阈值
     */
    static final int TREEIFY_THRESHOLD = 8;

    /**
     * 可对其进行树化的 bin 的最小表容量
     */
    static final int MIN_TREEIFY_CAPACITY = 64;
    
    /**
     * 基本哈希 bin 节点
     */
    static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
    }
    
    /**
     * 树 bin 的入口。 扩展 LinkedHashMap.Entry（进而扩展 Node）
     */
    static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
        TreeNode<K,V> parent;  // red-black tree links
        TreeNode<K,V> left;
        TreeNode<K,V> right;
        TreeNode<K,V> prev;    // needed to unlink next upon deletion
        boolean red;
    }
    
    /**
     * 该表在首次使用时初始化，并根据需要调整大小。 分配时，长度始终是 2 的幂
     */
    transient Node<K,V>[] table;

    /**
     * 保存缓存的 entrySet()
     */
    transient Set<Map.Entry<K,V>> entrySet;

    transient int size;

    /**
     * 此 HashMap 已被结构修改的次数
     * 
     * 该字段用于使 HashMap 的 Collection-views 上的迭代器快速失败
     */
    transient int modCount;

    /**
     * 要调整大小的下一个大小值 (capacity * load factor).
     */
    int threshold;

    /**
     * 哈希表的负载因子
     *
     * @serial
     */
    final float loadFactor;
    
    public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }
    
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }
    
    
    /**
     * 返回指定键映射到的值，如果此映射不包含该键的映射，则返回 {@code null}
     */
    public V get(Object key) {
        Node<K,V> e;
        return (e = getNode(key)) == null ? null : e.value;
    }

    /**
     * 实现 Map.get 和相关方法
     */
    final Node<K,V> getNode(Object key) {
        Node<K,V>[] tab; 
        Node<K,V> first, e; 
        int n, hash; K k;
        
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & (hash = hash(key))]) != null) {
            if (first.hash == hash && // always check first node
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            if ((e = first.next) != null) {
                if (first instanceof TreeNode)
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }

    /**
     * 将指定的值与此映射中的指定键相关联。 如果映射先前包含键的映射，则替换旧值。
     */
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }
    
    /**
     * 实现 Map.put 和相关方法。
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
        Node<K,V>[] tab;
        Node<K,V> p;
        int n, i;
        
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }
    
    /**
     * 如果存在，则从此映射中删除指定键的映射。
     */
    public V remove(Object key) {
        Node<K,V> e;
        return (e = removeNode(hash(key), key, null, false, true)) == null ?
            null : e.value;
    }
    
    /**
     * 实现 Map.remove 和相关方法
     */
    final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
        Node<K,V>[] tab; Node<K,V> p; int n, index;
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (p = tab[index = (n - 1) & hash]) != null) {
            Node<K,V> node = null, e; K k; V v;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                node = p;
            else if ((e = p.next) != null) {
                if (p instanceof TreeNode)
                    node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
                else {
                    do {
                        if (e.hash == hash &&
                            ((k = e.key) == key ||
                             (key != null && key.equals(k)))) {
                            node = e;
                            break;
                        }
                        p = e;
                    } while ((e = e.next) != null);
                }
            }
            if (node != null && (!matchValue || (v = node.value) == value ||
                                 (value != null && value.equals(v)))) {
                if (node instanceof TreeNode)
                    ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
                else if (node == p)
                    tab[index] = node.next;
                else
                    p.next = node.next;
                ++modCount;
                --size;
                afterNodeRemoval(node);
                return node;
            }
        }
        return null;
    }
}
```





## LinkedHashMap

部分源码

```java
public class LinkedHashMap<K,V> extends HashMap<K,V> implements Map<K,V> {
	
    /**
     * 普通 LinkedHashMap 条目的 HashMap.Node 子类
     */
    static class Entry<K,V> extends HashMap.Node<K,V> {
        Entry<K,V> before, after;
        Entry(int hash, K key, V value, Node<K,V> next) {
            super(hash, key, value, next);
        }
    }

    /**
     * 双向链表的头部（最老的）。
     */
    transient LinkedHashMap.Entry<K,V> head;

    /**
     * 双向链表的尾部（最小）。
     */
    transient LinkedHashMap.Entry<K,V> tail;

    /**
     * 此链接哈希映射的迭代排序方法：{@code true} 用于访问顺序，{@code false} 用于插入顺序。
     */
    final boolean accessOrder;

    /**
     * 返回指定键映射到的值，如果此映射不包含该键的映射，则返回 {@code null}。
     */
    public V get(Object key) {
        Node<K,V> e;
        if ((e = getNode(key)) == null)
            return null;
        if (accessOrder)
            afterNodeAccess(e);
        return e.value;
    }
}
```





# Queue



队列（`Queue`）是一种经常使用的集合。`Queue`实际上是实现了一个先进先出（FIFO：First In First Out）的有序表。它和`List`的区别在于，`List`可以在任意位置添加和删除元素，而`Queue`只有两个操作：

- 把元素添加到队列末尾；
- 从队列头部取出元素。



在Java的标准库中，队列接口`Queue`定义了以下几个方法：

- `int size()`：获取队列长度；
- `boolean add(E)`/`boolean offer(E)`：添加元素到队尾；
- `E remove()`/`E poll()`：获取队首元素并从队列中删除；
- `E element()`/`E peek()`：获取队首元素但并不从队列中删除。



## 添加

### add

一个队列，对它做一个添加操作，如果调用`add()`方法，当添加失败时（可能超过了队列的容量），它会抛出异常

```java
Queue<String> q = ...
try {
    q.add("Apple");
    System.out.println("添加成功");
} catch(IllegalStateException e) {
    System.out.println("添加失败");
}
```



### offer

调用`offer()`方法来添加元素，当添加失败时，它不会抛异常，而是返回`false`

```java
Queue<String> q = ...
if (q.offer("Apple")) {
    System.out.println("添加成功");
} else {
    System.out.println("添加失败");
}
```



## 取出

### remove

从`Queue`中取出队首元素时，如果当前`Queue`是一个空队列，调用`remove()`方法，它会抛出异常

```java
Queue<String> q = ...
try {
    String s = q.remove();
    System.out.println("获取成功");
} catch(IllegalStateException e) {
    System.out.println("获取失败");
}
```



### poll

调用`poll()`方法来取出队首元素，当获取失败时，它不会抛异常，而是返回`null`

```java
Queue<String> q = ...
String s = q.poll();
if (s != null) {
    System.out.println("获取成功");
} else {
    System.out.println("获取失败");
}
```



注意：不要把`null`添加到队列中，否则`poll()`方法返回`null`时，很难确定是取到了`null`元素还是队列为空



## 获取但不删除

### peek

`peek()`，因为获取队首元素时，并不会从队列中删除这个元素，所以可以反复获取

```java
Queue<String> q = new LinkedList<>();
// 添加3个元素到队列:
q.offer("apple");
q.offer("pear");
q.offer("banana");
// 队首永远都是apple，因为peek()不会删除它:
System.out.println(q.peek()); // apple
System.out.println(q.peek()); // apple
System.out.println(q.peek()); // apple
```





`LinkedList`即实现了`List`接口，又实现了`Queue`接口

但是，在使用的时候，如果我们把它当作List，就获取List的引用，如果我们把它当作Queue，就获取Queue的引用：

```java
// 这是一个List:
List<String> list = new LinkedList<>();
// 这是一个Queue:
Queue<String> queue = new LinkedList<>();
```





# PriorityQueue

`PriorityQueue`和`Queue`的区别在于，它的出队顺序与元素的优先级有关，对`PriorityQueue`调用`remove()`或`poll()`方法，返回的总是优先级最高的元素

```java
public class Main {
    public static void main(String[] args) {
        Queue<User> q = new PriorityQueue<>(new UserComparator());
        // 添加3个元素到队列:
        q.offer(new User("Bob", "A1"));
        q.offer(new User("Alice", "A2"));
        q.offer(new User("Boss", "V1"));
        System.out.println(q.poll()); // Boss/V1
        System.out.println(q.poll()); // Bob/A1
        System.out.println(q.poll()); // Alice/A2
        System.out.println(q.poll()); // null,因为队列为空
    }
}

class UserComparator implements Comparator<User> {
    public int compare(User u1, User u2) {
        if (u1.number.charAt(0) == u2.number.charAt(0)) {
            // 如果两人的号都是A开头或者都是V开头,比较号的大小:
            return u1.number.compareTo(u2.number);
        }
        if (u1.number.charAt(0) == 'V') {
            // u1的号码是V开头,优先级高:
            return -1;
        } else {
            return 1;
        }
    }
}

class User {
    public final String name;
    public final String number;

    public User(String name, String number) {
        this.name = name;
        this.number = number;
    }

    public String toString() {
        return name + "/" + number;
    }
}
```



# Deque

允许两头都进，两头都出，这种队列叫双端队列（Double Ended Queue），学名`Deque`



`Queue`和`Deque`出队和入队的方法：

|                    | Queue                  | Deque                           |
| :----------------- | :--------------------- | :------------------------------ |
| 添加元素到队尾     | add(E e) / offer(E e)  | addLast(E e) / offerLast(E e)   |
| 取队首元素并删除   | E remove() / E poll()  | E removeFirst() / E pollFirst() |
| 取队首元素但不删除 | E element() / E peek() | E getFirst() / E peekFirst()    |
| 添加元素到队首     | 无                     | addFirst(E e) / offerFirst(E e) |
| 取队尾元素并删除   | 无                     | E removeLast() / E pollLast()   |
| 取队尾元素但不删除 | 无                     | E getLast() / E peekLast()      |



`Deque`接口实际上扩展自`Queue`：

```java
public interface Deque<E> extends Queue<E> {
    ...
}
```



```java
Deque<String> deque = new LinkedList<>();
deque.offerLast("A"); // A
deque.offerLast("B"); // A <- B
deque.offerFirst("C"); // C <- A <- B
System.out.println(deque.pollFirst()); // C, 剩下A <- B
System.out.println(deque.pollLast()); // B, 剩下A
System.out.println(deque.pollFirst()); // A
System.out.println(deque.pollFirst()); // null
```



`Deque`是一个接口，它的实现类有`ArrayDeque`和`LinkedList`

```java
// 推荐的写法：
Deque<String> d2 = new LinkedList<>();
d2.offerLast("z");
```



# Stack

栈（Stack）是一种后进先出（LIFO：Last In First Out）的数据结构



用`Deque`可以实现`Stack`的功能：

- 把元素压栈：`push(E)`/`addFirst(E)`；
- 把栈顶的元素“弹出”：`pop()`/`removeFirst()`；
- 取栈顶元素但不弹出：`peek()`/`peekFirst()`。



把`Deque`作为`Stack`使用时，注意只调用`push()`/`pop()`/`peek()`方法，不要调用`addFirst()`/`removeFirst()`/`peekFirst()`方法

















