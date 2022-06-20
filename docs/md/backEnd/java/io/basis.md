# IO

IO是指Input/Output，即输入和输出。以内存为中心：

- Input指从外部读入数据到内存，例如，把文件从磁盘读取到内存，从网络读取数据到内存等等。
- Output指把数据从内存输出到外部，例如，把数据从内存写入到文件，把数据从内存输出到网络等等。





### InputStream / OutputStream

IO流以`byte`（字节）为最小单位，因此也称为*字节流*。例如，要从磁盘读入一个文件，包含6个字节，就相当于读入了6个字节的数据：

```ascii
╔════════════╗
║   Memory   ║
╚════════════╝
       ▲
       │0x48
       │0x65
       │0x6c
       │0x6c
       │0x6f
       │0x21
 ╔═══════════╗
 ║ Hard Disk ║
 ╚═══════════╝
```

这6个字节是按顺序读入的，所以是输入字节流。

反过来，我们把6个字节从内存写入磁盘文件，就是输出字节流：

```ascii
╔════════════╗
║   Memory   ║
╚════════════╝
       │0x21
       │0x6f
       │0x6c
       │0x6c
       │0x65
       │0x48
       ▼
 ╔═══════════╗
 ║ Hard Disk ║
 ╚═══════════╝
```

在Java中，`InputStream`代表输入字节流，`OuputStream`代表输出字节流，这是最基本的两种IO流。





### Reader / Writer

如果需要读写的是字符，并且字符不全是单字节表示的ASCII字符，那么，按照`char`来读写显然更方便，这种流称为*字符流*。

Java提供了`Reader`和`Writer`表示字符流，字符流传输的最小数据单位是`char`。





### 同步和异步

同步IO，读写IO时代码必须等待数据返回后才继续执行后续代码，它的优点是代码编写简单，缺点是CPU执行效率低

异步IO，读写IO时仅发出请求，然后立刻执行后续代码，它的优点是CPU执行效率高，缺点是代码编写复杂



Java标准库的包`java.io`提供了同步IO，而`java.nio`则是异步IO





IO流是一种流式的数据输入/输出模型：

- 二进制数据以`byte`为最小单位在`InputStream`/`OutputStream`中单向流动
- 字符数据以`char`为最小单位在`Reader`/`Writer`中单向流动



Java标准库的`java.io`包提供了同步IO功能：

- 字节流接口：`InputStream`/`OutputStream`
- 字符流接口：`Reader`/`Writer`





# File

Java的标准库`java.io`提供了`File`对象来操作文件和目录



要构造一个`File`对象，需要传入文件路径，既可以传入绝对路径，也可以传入相对路径

```java
File f = new File("C:\\test.txt");
```





## 文件和目录

`File`对象既可以表示文件，也可以表示目录

特别要注意的是，构造一个`File`对象，即使传入的文件或目录不存在，代码也不会出错，因为构造一个`File`对象，并不会导致任何磁盘操作。只有当调用`File`对象的某些方法的时候，才真正进行磁盘操作



调用`isFile()`，判断该`File`对象是否是一个已存在的文件，调用`isDirectory()`，判断该`File`对象是否是一个已存在的目录

```java
File f1 = new File("C:\\Windows");
File f2 = new File("C:\\Windows\\notepad.exe");
File f3 = new File("C:\\Windows\\nothing");
System.out.println(f1.isFile());
System.out.println(f1.isDirectory());
System.out.println(f2.isFile());
System.out.println(f2.isDirectory());
System.out.println(f3.isFile());
System.out.println(f3.isDirectory());
```

用`File`对象获取到一个文件时，还可以进一步判断文件的权限和大小：

- `boolean canRead()`：是否可读；
- `boolean canWrite()`：是否可写；
- `boolean canExecute()`：是否可执行；
- `long length()`：文件字节大小。

对目录而言，是否可执行表示能否列出它包含的文件和子目录。



## 创建和删除文件

当File对象表示一个文件时，可以通过`createNewFile()`创建一个新文件，用`delete()`删除该文件：

```java
File file = new File("/path/to/file");
if (file.createNewFile()) {
    // 文件创建成功:
    // TODO:
    if (file.delete()) {
        // 删除文件成功:
    }
}
```

有些时候，程序需要读写一些临时文件，File对象提供了`createTempFile()`来创建一个临时文件，以及`deleteOnExit()`在JVM退出时自动删除该文件。

```java
File f = File.createTempFile("tmp-", ".txt"); // 提供临时文件的前缀和后缀
f.deleteOnExit(); // JVM退出时自动删除
System.out.println(f.isFile());
System.out.println(f.getAbsolutePath());
```





## 遍历文件和目录

当File对象表示一个目录时，可以使用`list()`和`listFiles()`列出目录下的文件和子目录名。`listFiles()`提供了一系列重载方法，可以过滤不想要的文件和目录：

```java
public class Main {
    public static void main(String[] args) throws IOException {
        File f = new File("C:\\Windows");
        File[] fs1 = f.listFiles(); // 列出所有文件和子目录
        printFiles(fs1);
        File[] fs2 = f.listFiles(new FilenameFilter() { // 仅列出.exe文件
            public boolean accept(File dir, String name) {
                return name.endsWith(".exe"); // 返回true表示接受该文件
            }
        });
        printFiles(fs2);
    }

    static void printFiles(File[] files) {
        System.out.println("==========");
        if (files != null) {
            for (File f : files) {
                System.out.println(f);
            }
        }
        System.out.println("==========");
    }
}
```



和文件操作类似，File对象如果表示一个目录，可以通过以下方法创建和删除目录：

- `boolean mkdir()`：创建当前File对象表示的目录；
- `boolean mkdirs()`：创建当前File对象表示的目录，并在必要时将不存在的父目录也创建出来；
- `boolean delete()`：删除当前File对象表示的目录，当前目录必须为空才能删除成功。



## Path

Java标准库还提供了一个`Path`对象，它位于`java.nio.file`包。`Path`对象和`File`对象类似，但操作更加简单

```java
Path p1 = Paths.get(".", "project", "study"); // 构造一个Path对象
System.out.println(p1);
Path p2 = p1.toAbsolutePath(); // 转换为绝对路径
System.out.println(p2);
Path p3 = p2.normalize(); // 转换为规范路径
System.out.println(p3);
File f = p3.toFile(); // 转换为File对象
System.out.println(f);
for (Path p : Paths.get("..").toAbsolutePath()) { // 可以直接遍历Path
    System.out.println("  " + p);
}
```





# InputStream

`InputStream`是Java标准库提供的最基本的输入流。它位于`java.io`这个包里。`java.io`包提供了所有同步IO的功能



`InputStream`并不是一个接口，而是一个抽象类，它是所有输入流的超类

这个抽象类定义的一个最重要的方法就是`int read()`

```
public abstract int read() throws IOException;
```

这个方法会读取输入流的下一个字节，并返回字节表示的`int`值（0~255）。如果已读到末尾，返回`-1`表示不能继续读取了



`FileInputStream`是`InputStream`的一个子类。`FileInputStream`是从文件流中读取数据

```java
public void readFile() throws IOException {
    InputStream input = null;
    try {
        input = new FileInputStream("src/readme.txt");
        int n;
        while ((n = input.read()) != -1) { // 利用while同时读取并判断
            System.out.println(n);
        }
    } finally {
        if (input != null) { input.close(); }
    }
}

public void readFile() throws IOException {
    try (InputStream input = new FileInputStream("src/readme.txt")) {
        int n;
        while ((n = input.read()) != -1) {
            System.out.println(n);
        }
    } // 编译器在此自动为我们写入finally并调用close()
}
```



`InputStream`和`OutputStream`都是通过`close()`方法来关闭流。关闭流就会释放对应的底层资源



在读取或写入IO流的过程中，可能会发生错误，例如，文件不存在导致无法读取，没有写权限导致写入失败，等等，这些底层错误由Java虚拟机自动封装成`IOException`异常并抛出。因此，所有与IO操作相关的代码都必须正确处理`IOException`



## 缓冲

在读取流的时候，一次读取一个字节并不是最高效的方法。很多流支持一次性读取多个字节到缓冲区，对于文件和网络流来说，利用缓冲区一次性读取多个字节效率往往要高很多。`InputStream`提供了两个重载方法来支持读取多个字节：

- `int read(byte[] b)`：读取若干字节并填充到`byte[]`数组，返回读取的字节数
- `int read(byte[] b, int off, int len)`：指定`byte[]`数组的偏移量和最大填充数



```java
public void readFile() throws IOException {
    try (InputStream input = new FileInputStream("src/readme.txt")) {
        // 定义1000个字节大小的缓冲区:
        byte[] buffer = new byte[1000];
        int n;
        while ((n = input.read(buffer)) != -1) { // 读取到缓冲区
            System.out.println("read " + n + " bytes.");
        }
    }
}
```



## 阻塞

`read()`方法读取数据时是阻塞（Blocking）的，因为读取IO流相比执行普通代码，速度会慢很多，因此，无法确定`read()`方法调用到底要花费多长时间



## InputStream实现类

用`FileInputStream`可以从文件获取输入流，这是`InputStream`常用的一个实现类

此外，`ByteArrayInputStream`可以在内存中模拟一个`InputStream`

```java
try (InputStream input = new ByteArrayInputStream(data)) {
    int n;
    while ((n = input.read()) != -1) {
        System.out.println((char)n);
    }
}
```



`ByteArrayInputStream`实际上是把一个`byte[]`数组在内存中变成一个`InputStream`



Java标准库的`java.io.InputStream`定义了所有输入流的超类：

- `FileInputStream`实现了文件流输入；
- `ByteArrayInputStream`在内存中模拟一个字节流输入。





# OutputStream

`OutputStream`是Java标准库提供的最基本的输出流

`OutputStream`也是抽象类，它是所有输出流的超类。这个抽象类定义的一个最重要的方法就是`void write(int b)`，签名如下：

```java
public abstract void write(int b) throws IOException;
```

这个方法会写入一个字节到输出流。要注意的是，虽然传入的是`int`参数，但只会写入一个字节，即只写入`int`最低8位表示字节的部分（相当于`b & 0xff`）。

`OutputStream`也提供了`close()`方法关闭输出流，以便释放系统资源

`OutputStream`还提供了一个`flush()`方法，它的目的是将缓冲区的内容真正输出到目的地





## FileOutputStream

以`FileOutputStream`为例，演示如何将若干个字节写入文件流：

```java
public void writeFile() throws IOException {
    OutputStream output = new FileOutputStream("out/readme.txt");
    output.write(72); // H
    output.write(101); // e
    output.write(108); // l
    output.write(108); // l
    output.write(111); // o
    output.close();
}
```



每次写入一个字节非常麻烦，更常见的方法是一次性写入若干字节。可以用`OutputStream`提供的重载方法`void write(byte[])`来实现：

```java
public void writeFile() throws IOException {
    OutputStream output = new FileOutputStream("out/readme.txt");
    output.write("Hello".getBytes("UTF-8")); // Hello
    output.close();
}
```



和`InputStream`一样，上述代码没有考虑到在发生异常的情况下如何正确地关闭资源。写入过程也会经常发生IO错误，例如，磁盘已满，无权限写入等等。需要用`try(resource)`来保证`OutputStream`在无论是否发生IO错误的时候都能够正确地关闭：

```java
public void writeFile() throws IOException {
    try (OutputStream output = new FileOutputStream("out/readme.txt")) {
        output.write("Hello".getBytes("UTF-8")); // Hello
    } // 编译器在此自动为我们写入finally并调用close()
}
```



## 阻塞

`OutputStream`的`write()`方法也是阻塞的



## OutputStream实现类

用`FileOutputStream`可以从文件获取输出流，这是`OutputStream`常用的一个实现类

`ByteArrayOutputStream`可以在内存中模拟一个`OutputStream`

```java
byte[] data;
try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
    output.write("Hello ".getBytes("UTF-8"));
    output.write("world!".getBytes("UTF-8"));
    data = output.toByteArray();
}
System.out.println(new String(data, "UTF-8"));
```



`ByteArrayOutputStream`实际上是把一个`byte[]`数组在内存中变成一个`OutputStream`



# Filter模式

Java的IO标准库提供的`InputStream`根据来源可以包括：

- `FileInputStream`：从文件读取数据，是最终数据源；
- `ServletInputStream`：从HTTP请求读取数据，是最终数据源；
- `Socket.getInputStream()`：从TCP连接读取数据，是最终数据源；
- 





如果要给`FileInputStream`添加缓冲功能，则可以从`FileInputStream`派生一个类：

```java
BufferedFileInputStream extends FileInputStream
```

如果要给`FileInputStream`添加计算签名的功能，类似的，也可以从`FileInputStream`派生一个类：

```java
DigestFileInputStream extends FileInputStream
```

如果要给`FileInputStream`添加加密/解密功能，还是可以从`FileInputStream`派生一个类：

```java
CipherFileInputStream extends FileInputStream
```

如果要给`FileInputStream`添加缓冲和签名的功能，那么还需要派生`BufferedDigestFileInputStream`

如果要给`FileInputStream`添加缓冲和加解密的功能，则需要派生`BufferedCipherFileInputStream`





给`FileInputStream`添加3种功能，至少需要3个子类。这3种功能的组合，又需要更多的子类：

```ascii
                          ┌─────────────────┐
                          │ FileInputStream │
                          └─────────────────┘
                                   ▲
             ┌───────────┬─────────┼─────────┬───────────┐
             │           │         │         │           │
┌───────────────────────┐│┌─────────────────┐│┌─────────────────────┐
│BufferedFileInputStream│││DigestInputStream│││CipherFileInputStream│
└───────────────────────┘│└─────────────────┘│└─────────────────────┘
                         │                   │
    ┌─────────────────────────────┐ ┌─────────────────────────────┐
    │BufferedDigestFileInputStream│ │BufferedCipherFileInputStream│
    └─────────────────────────────┘ └─────────────────────────────┘
```



这还只是针对`FileInputStream`设计，如果针对另一种`InputStream`设计，很快会出现子类爆炸的情况





因此，直接使用继承，为各种`InputStream`附加更多的功能，根本无法控制代码的复杂度，很快就会失控





为了解决依赖继承会导致子类数量失控的问题，JDK首先将`InputStream`分为两大类：

+ 一类是直接提供数据的基础`InputStream`，例如：
  + FileInputStream
  + ByteArrayInputStream
  + ServletInputStream
  + ...

+ 一类是提供额外附加功能的`InputStream`，例如：
  + BufferedInputStream
  + DigestInputStream
  + CipherInputStream
  + ...



当需要给一个“基础”`InputStream`附加各种功能时，先确定这个能提供数据源的`InputStream`，因为需要的数据总得来自某个地方，例如，`FileInputStream`，数据来源自文件：

```
InputStream file = new FileInputStream("test.gz");
```

紧接着，希望`FileInputStream`能提供缓冲的功能来提高读取的效率，因此用`BufferedInputStream`包装这个`InputStream`，得到的包装类型是`BufferedInputStream`，但它仍然被视为一个`InputStream`：

```
InputStream buffered = new BufferedInputStream(file);
```

最后，假设该文件已经用gzip压缩了，希望直接读取解压缩的内容，就可以再包装一个`GZIPInputStream`：

```
InputStream gzip = new GZIPInputStream(buffered);
```

无论包装多少次，得到的对象始终是`InputStream`，直接用`InputStream`来引用它，就可以正常读取：

```ascii
┌─────────────────────────┐
│GZIPInputStream          │
│┌───────────────────────┐│
││BufferedFileInputStream││
││┌─────────────────────┐││
│││   FileInputStream   │││
││└─────────────────────┘││
│└───────────────────────┘│
└─────────────────────────┘
```

上述这种通过一个“基础”组件再叠加各种“附加”功能组件的模式，称之为Filter模式（或者装饰器模式：Decorator）

它可以通过少量的类来实现各种功能的组合：

```ascii
                 ┌─────────────┐
                 │ InputStream │
                 └─────────────┘
                       ▲ ▲
┌────────────────────┐ │ │ ┌─────────────────┐
│  FileInputStream   │─┤ └─│FilterInputStream│
└────────────────────┘ │   └─────────────────┘
┌────────────────────┐ │     ▲ ┌───────────────────┐
│ByteArrayInputStream│─┤     ├─│BufferedInputStream│
└────────────────────┘ │     │ └───────────────────┘
┌────────────────────┐ │     │ ┌───────────────────┐
│ ServletInputStream │─┘     ├─│  DataInputStream  │
└────────────────────┘       │ └───────────────────┘
                             │ ┌───────────────────┐
                             └─│CheckedInputStream │
                               └───────────────────┘
```

类似的，`OutputStream`也是以这种模式来提供各种功能：

```ascii
                  ┌─────────────┐
                  │OutputStream │
                  └─────────────┘
                        ▲ ▲
┌─────────────────────┐ │ │ ┌──────────────────┐
│  FileOutputStream   │─┤ └─│FilterOutputStream│
└─────────────────────┘ │   └──────────────────┘
┌─────────────────────┐ │     ▲ ┌────────────────────┐
│ByteArrayOutputStream│─┤     ├─│BufferedOutputStream│
└─────────────────────┘ │     │ └────────────────────┘
┌─────────────────────┐ │     │ ┌────────────────────┐
│ ServletOutputStream │─┘     ├─│  DataOutputStream  │
└─────────────────────┘       │ └────────────────────┘
                              │ ┌────────────────────┐
                              └─│CheckedOutputStream │
                                └────────────────────┘
```



### 编写FilterInputStream

例子，`CountInputStream`，它的作用是对输入的字节进行计数：

```java
public class Main {
    public static void main(String[] args) throws IOException {
        byte[] data = "hello, world!".getBytes("UTF-8");
        try (CountInputStream input = new CountInputStream(new ByteArrayInputStream(data))) {
            int n;
            while ((n = input.read()) != -1) {
                System.out.println((char)n);
            }
            System.out.println("Total read " + input.getBytesRead() + " bytes");
        }
    }
}

class CountInputStream extends FilterInputStream {
    private int count = 0;

    CountInputStream(InputStream in) {
        super(in);
    }

    public int getBytesRead() {
        return this.count;
    }

    public int read() throws IOException {
        int n = in.read();
        if (n != -1) {
            this.count ++;
        }
        return n;
    }

    public int read(byte[] b, int off, int len) throws IOException {
        int n = in.read(b, off, len);
        if (n != -1) {
            this.count += n;
        }
        return n;
    }
}
```



在叠加多个`FilterInputStream`，只需要持有最外层的`InputStream`，并且，当最外层的`InputStream`关闭时（在`try(resource)`块的结束处自动关闭），内层的`InputStream`的`close()`方法也会被自动调用，并最终调用到最核心的“基础”`InputStream`，因此不存在资源泄露







# 操作Zip

`ZipInputStream`是一种`FilterInputStream`，它可以直接读取zip包的内容

另一个`JarInputStream`是从`ZipInputStream`派生，它增加的主要功能是直接读取jar文件里面的`MANIFEST.MF`文件。因为本质上jar包就是zip包，只是额外附加了一些固定的描述文件





## 读取zip包

要创建一个`ZipInputStream`，通常是传入一个`FileInputStream`作为数据源，然后，循环调用`getNextEntry()`，直到返回`null`，表示zip流结束。

一个`ZipEntry`表示一个压缩文件或目录，如果是压缩文件，用`read()`方法不断读取，直到返回`-1`

```java
try (ZipInputStream zip = new ZipInputStream(new FileInputStream(...))) {
    ZipEntry entry = null;
    while ((entry = zip.getNextEntry()) != null) {
        String name = entry.getName();
        if (!entry.isDirectory()) {
            int n;
            while ((n = zip.read()) != -1) {
                ...
            }
        }
    }
}
```



## 写入zip包

`ZipOutputStream`是一种`FilterOutputStream`，它可以直接写入内容到zip包

先创建一个`ZipOutputStream`，通常是包装一个`FileOutputStream`，然后，每写入一个文件前，先调用`putNextEntry()`，然后用`write()`写入`byte[]`数据，写入完毕后调用`closeEntry()`结束这个文件的打包

```java
try (ZipOutputStream zip = new ZipOutputStream(new FileOutputStream(...))) {
    File[] files = ...
    for (File file : files) {
        zip.putNextEntry(new ZipEntry(file.getName()));
        zip.write(Files.readAllBytes(file.toPath()));
        zip.closeEntry();
    }
}
```





# 读取classpath资源

在classpath中的资源文件，路径总是以`／`开头，先获取当前的`Class`对象，然后调用`getResourceAsStream()`就可以直接从classpath读取任意的资源文件

```java
try (InputStream input = getClass().getResourceAsStream("/default.properties")) {
    if (input != null) {
        // TODO:
    }
}
```



如果把默认的配置放到jar包中，再从外部文件系统读取一个可选的配置文件，就可以做到既有默认的配置文件，又可以让用户自己修改配置

```java
Properties props = new Properties();
props.load(inputStreamFromClassPath("/default.properties"));
props.load(inputStreamFromFile("./conf.properties"));
```



# 序列化

序列化是指把一个Java对象变成二进制内容，本质上就是一个`byte[]`数组

反序列化，即把一个二进制内容（也就是`byte[]`数组）变回Java对象



Java对象要能序列化，必须实现一个特殊的`java.io.Serializable`接口

```java
public interface Serializable {
}
```

`Serializable`接口没有定义任何方法，它是一个空接口。把这样的空接口称为“标记接口”（Marker Interface），实现了标记接口的类仅仅是给自身贴了个“标记”，并没有增加任何方法。

```java
ByteArrayOutputStream buffer = new ByteArrayOutputStream();
try (ObjectOutputStream output = new ObjectOutputStream(buffer)) {
    // 写入int:
    output.writeInt(12345);
    // 写入String:
    output.writeUTF("Hello");
    // 写入Object:
    output.writeObject(Double.valueOf(123.456));
}
```



## 反序列化

```java
try (ObjectInputStream input = new ObjectInputStream(...)) {
    int n = input.readInt();
    String s = input.readUTF();
    Double d = (Double) input.readObject();
}
```





因为Java的序列化机制可以导致一个实例能直接从`byte[]`数组创建，而不经过构造方法，因此，它存在一定的安全隐患。一个精心构造的`byte[]`数组被反序列化后可以执行特定的Java代码，从而导致严重的安全漏洞

实际上，Java本身提供的基于对象的序列化和反序列化机制既存在安全性问题，也存在兼容性问题。更好的序列化方法是通过JSON这样的通用数据结构来实现，只输出基本类型（包括String）的内容，而不存储任何与代码相关的信息



# Reader

`Reader`是Java的IO库提供的另一个输入流接口。和`InputStream`的区别是，`InputStream`是一个字节流，即以`byte`为单位读取，而`Reader`是一个字符流，即以`char`为单位读取



| InputStream                         | Reader                                |
| :---------------------------------- | :------------------------------------ |
| 字节流，以`byte`为单位              | 字符流，以`char`为单位                |
| 读取字节（-1，0~255）：`int read()` | 读取字符（-1，0~65535）：`int read()` |
| 读到字节数组：`int read(byte[] b)`  | 读到字符数组：`int read(char[] c)`    |

`java.io.Reader`是所有字符输入流的超类，它最主要的方法是：

```java
public int read() throws IOException;
```

这个方法读取字符流的下一个字符，并返回字符表示的`int`，范围是`0`~`65535`。如果已读到末尾，返回`-1`。



## FileReader

 `FileReader`是`Reader`的一个子类

```java
// 创建一个FileReader对象:
try (Reader reader = new FileReader("src/readme.txt", StandardCharsets.UTF_8)) {
    for (;;) {
        int n = reader.read(); // 反复调用read()方法，直到返回-1
        if (n == -1) {
            break;
        }
        System.out.println((char)n); // 打印char
    }
    reader.close(); // 关闭流
}
```





## CharArrayReader

`CharArrayReader`可以在内存中模拟一个`Reader`，它的作用实际上是把一个`char[]`数组变成一个`Reader`，这和`ByteArrayInputStream`非常类似：

```java
try (Reader reader = new CharArrayReader("Hello".toCharArray())) {
}
```



## StringReader

`StringReader`可以直接把`String`作为数据源，它和`CharArrayReader`几乎一样：

```java
try (Reader reader = new StringReader("Hello")) {
}
```



## InputStreamReader

`Reader`和`InputStream`有什么关系？













































