## 目录
1. JVM概念
   1. JVM基础
      1. JVM是什么
      2. JVM有什么
      3. JVM能干什么
   2. JVM怎么实现平台无关
2. JVM规范
   1. JVM规范的作用
   2. JVM规范的主要内容
3. Class文件
   1. Class文件格式
   2. Class字节码
   3. 虚拟机汇编表示的Java类
   4. ASM
      1. ASM是什么
      2. ASM编程模型
      3. ASM核心API
4. 类加载、连接和初始化
   1. 类加载、连接、初始化到卸载的生命周期
   2. 类加载
   3. 类加载器
   4. 双亲委派模型
   5. 类连接
   6. 初始化
      1. 类初始化
      2. 初始化时机
   7. 类卸载
5. JVM内存分配
   1. JVM简化架构
   2. JVM内存模型
   3. 栈、堆、方法区的交互
6. JVM堆内存
   1. 概念
   2. 堆的结构
   3. 对象的内存布局
   4. 内存分配的参数
      1. Trace跟踪参数
      2. GC日志格式
      3. Java堆的参数
      4. Java栈的参数
      5. 元空间的参数
7. 字节码执行引擎
   1. 概念
      1. 栈帧
      2. 局部变量表
      3. 操作数栈
      4. 动态连接
      5. 方法返回地址
   2. 栈帧、运行期操作数栈和局部变量表之间的交互
   3. 方法调用
      1. 方法调用
      2. 分派
         1. 静态分派
         2. 动态分派
8. 垃圾回收基础
   1. 什么是垃圾
   2. 如何判断垃圾
   3. 如何回收
   4. 根搜索算法
   5. 引用分类
   6. 跨代引用
   7. 记忆集
   8. 写屏障
   9. GC类型
   10. Stop-The-World
   11. 垃圾收集类型
9. 垃圾收集算法
   1. 标记清除法
   2. 复制算法
   3. 标记整理法
   4. 分配担保（分代）
10. 垃圾收集器
   1. HotSpot中的收集器
   2. 串行收集器
   3. 并行收集器
   4. 新生代 Parallel Scavenge 收集器
   5. CMS 收集器
   6. G1 收集器
      1. 新生代回收过程
      2. 老年代回收过程
   7. ZGC 收集器
   8. GC 性能指标
   9. JVM内存配置原则
11. JVM对高效并发的支持
   1. Java内存模型
   2. 内存间的交互操作
   3. 多线程的可见性
   4. 有序性
   5. 指令重排
   6. 线程安全的处理方法
   7. 锁优化
      1. 自旋锁
      2. 锁消除
      3. 锁粗化
      4. 轻量级锁
      5. 偏向锁
12. 性能监控与故障处理工具
   1. 命令行工具
      1. jps
      2. jinfo
      3. jstack
      4. jmap
      5. jstat
      6. jstatd
      7. jcmd
   2. 图形化工具
      1. jconsole
      2. jmc
      3. visualvm
   3. 远程连接
      1. jmx
      2. jstatd
13. JVM调优
   1. JVM如何调优、调什么、目标
   2. JVM调优策略
   3. JVM调优冷思考
   4. JVM调优经验
   5. 调优实战


## JVM概念
### JVM基础
#### JVM是什么

- JVM：Java Virtual Machine，Java 虚拟机
- 虚拟机是指通过软件模拟的具有完整硬件系统功能，并且运行在一个完全隔离环境中的计算机系统
- JVM是通过软件来模拟 Java 字节码的指令集，是 Java 程序的运行环境
#### JVM有什么 todo
![Snipaste_2023-03-23_10-08-27.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1679537343985-07f5827a-2d5d-406b-af62-fc0b6c75a743.png#averageHue=%23f4f3f3&clientId=ufc842c6e-7270-4&from=drop&id=uc6d87bbb&name=Snipaste_2023-03-23_10-08-27.png&originHeight=1216&originWidth=2846&originalType=binary&ratio=2&rotation=0&showTitle=false&size=899278&status=done&style=none&taskId=uedc0d811-a6b9-4fa8-bb3c-2c0389974e5&title=)
#### JVM主要功能

1. 通过 ClassLoader 寻找和装载 class 文件
2. 解释字节码成为指令并执行，提供 class 文件的运行环境
3. 进行运行期间的内存分配和垃圾回收
4. 提供与硬件交互的平台
#### JVM怎么实现平台无关
JDK 的安装包是和平台相关的，自己写的代码和平台无关的
![Snipaste_2023-03-23_10-14-34.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1679537692385-590e5dba-0ddf-49fe-994e-1520f9a7cc10.png#averageHue=%23fafafa&clientId=ufc842c6e-7270-4&from=drop&id=u40564c22&name=Snipaste_2023-03-23_10-14-34.png&originHeight=1208&originWidth=1620&originalType=binary&ratio=2&rotation=0&showTitle=false&size=374300&status=done&style=none&taskId=u36999bd7-f1af-4669-b436-e869ee3cd0a&title=)
## JVM规范
### JVM规范的作用

- JVM 规范为不同硬件平台提供了一种编译 Java 技术代码的规范
- JVM 规范使得 Java 软件独立于平台
- 编程语言只要符合 JVM 规范，JVM 就可以运行对应的 class 文件，实现了编程语言无关性
### JVM规范的主要内容

1. 字节码指令集
JVM 的指令由一个字节长度代表着某种特殊操作含义的操作码（opcode）以及跟随其后的零个或多个代表此操作所需参数的操作数（operand）所构成
2. Class 文件的格式
3. 数据类型和值
4. 运行时的数据区
5. 栈帧
6. 特殊方法
   1. 〈init〉：实例初始化方法，通过 JVM 的 invokespecial 指令来调用
   2. 〈clinit〉：类或接口的初始化方法，不含参数，返回 void
7. 类库
JVM 必须对一些 Java 类库提供支持，否则这些类库根本无法实现
   1. 反射
   2. 加载和创建类或接口，如：ClassLoader
   3. 连接和初始化类和接口的类
   4. 安全类，如：security
   5. 多线程
   6. 弱引用
8. 异常
9. 虚拟机的启动、加载、链接和初始化
## Class文件
Class 文件是 JVM 的输入，Class 文件是 JVM 实现平台无关、技术无关的基础
### Class文件格式

- Class 文件是一组以 8 字节为单位的字节流，各个数据项目按顺序紧凑排列
- 对于占用空间大于 8 字节的数据项，按照高位在前的方式分割成多个 8 字节进行存储
- Class 文件格式里面只有两种类型：无符号数、表
   - 无符号数：基本数据类型，以 u1、u2、u4、u8 来代表几个字节的无符号数
   - 表：由多个无符号数和其他表构成的复合数据类型，通常以 _info 结尾

![image.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1679908617361-7e8897d4-4598-46f4-ab07-436d83abd340.png#averageHue=%23f2f2f2&clientId=ud8f846c8-416c-4&from=paste&height=364&id=u372865a6&name=image.png&originHeight=728&originWidth=1088&originalType=binary&ratio=2&rotation=0&showTitle=false&size=308274&status=done&style=none&taskId=udbd4e0f6-d3ef-4c1e-bdad-88ebedbd407&title=&width=544)
#### 查看方式

- vim 查看 16 进制源文件
- javap 工具生成非正式的"虚拟机汇编语言"
#### 例子
```java
package test;

public class Hello {
    private static final String msg = "hello world";

    public static void main(String[] args) {
        System.out.println(msg);
    }
}
```

1. 使用 javac ./test/Hello.java 将其编译为 class 文件
2. 使用 vim ./test/Hello.class 并使用命令 :%!xxd 将文件转换为 16 进制显示源文件
```shell
00000000: cafe babe 0000 003d 0020 0a00 0200 0307  .......=. ......
00000010: 0004 0c00 0500 0601 0010 6a61 7661 2f6c  ..........java/l     
00000020: 616e 672f 4f62 6a65 6374 0100 063c 696e  ang/Object...<in
00000030: 6974 3e01 0003 2829 5609 0008 0009 0700  it>...()V.......
00000040: 0a0c 000b 000c 0100 106a 6176 612f 6c61  .........java/la
00000050: 6e67 2f53 7973 7465 6d01 0003 6f75 7401  ng/System...out.
00000060: 0015 4c6a 6176 612f 696f 2f50 7269 6e74  ..Ljava/io/Print
00000070: 5374 7265 616d 3b07 000e 0100 0a74 6573  Stream;......tes
00000080: 742f 4865 6c6c 6f08 0010 0100 0b68 656c  t/Hello......hel
00000090: 6c6f 2077 6f72 6c64 0a00 1200 1307 0014  lo world........
000000a0: 0c00 1500 1601 0013 6a61 7661 2f69 6f2f  ........java/io/
000000b0: 5072 696e 7453 7472 6561 6d01 0007 7072  PrintStream...pr
000000c0: 696e 746c 6e01 0015 284c 6a61 7661 2f6c  intln...(Ljava/l
000000d0: 616e 672f 5374 7269 6e67 3b29 5601 0003  ang/String;)V...
000000e0: 6d73 6701 0012 4c6a 6176 612f 6c61 6e67  msg...Ljava/lang
000000f0: 2f53 7472 696e 673b 0100 0d43 6f6e 7374  /String;...Const
00000100: 616e 7456 616c 7565 0100 0443 6f64 6501  antValue...Code.
00000110: 000f 4c69 6e65 4e75 6d62 6572 5461 626c  ..LineNumberTabl
00000120: 6501 0004 6d61 696e 0100 1628 5b4c 6a61  e...main...([Lja
00000130: 7661 2f6c 616e 672f 5374 7269 6e67 3b29  va/lang/String;)
00000140: 5601 000a 536f 7572 6365 4669 6c65 0100  V...SourceFile..
00000150: 0a48 656c 6c6f 2e6a 6176 6100 2100 0d00  .Hello.java.!...
00000160: 0200 0000 0100 1a00 1700 1800 0100 1900  ................
00000170: 0000 0200 0f00 0200 0100 0500 0600 0100  ................
00000180: 1a00 0000 1d00 0100 0100 0000 052a b700  .............*..
00000190: 01b1 0000 0001 001b 0000 0006 0001 0000  ................
000001a0: 0003 0009 001c 001d 0001 001a 0000 0025  ...............%
000001b0: 0002 0001 0000 0009 b200 0712 0fb6 0011  ................
000001c0: b100 0000 0100 1b00 0000 0a00 0200 0000  ................
000001d0: 0700 0800 0800 0100 1e00 0000 0200 1f0a  ................
```

3. 使用 javap -verbose ./test/Hello.class 查看 class 文件解析后的内容
```java
Classfile /Users/xxx/test/Hello.class
  Last modified 2023年3月27日; size 479 bytes
  SHA-256 checksum 8f00f7dfcd98f34e709426dd8e2311c216f576cbd02bbea3cf189562d56523c9
  Compiled from "Hello.java"
public class test.Hello
  minor version: 0
  major version: 61
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #13                         // test/Hello
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 1, methods: 2, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // java/lang/System.out:Ljava/io/PrintStream;
   #8 = Class              #10            // java/lang/System
   #9 = NameAndType        #11:#12        // out:Ljava/io/PrintStream;
  #10 = Utf8               java/lang/System
  #11 = Utf8               out
  #12 = Utf8               Ljava/io/PrintStream;
  #13 = Class              #14            // test/Hello
  #14 = Utf8               test/Hello
  #15 = String             #16            // hello world
  #16 = Utf8               hello world
  #17 = Methodref          #18.#19        // java/io/PrintStream.println:(Ljava/lang/String;)V
  #18 = Class              #20            // java/io/PrintStream
  #19 = NameAndType        #21:#22        // println:(Ljava/lang/String;)V
  #20 = Utf8               java/io/PrintStream
  #21 = Utf8               println
  #22 = Utf8               (Ljava/lang/String;)V
  #23 = Utf8               msg
  #24 = Utf8               Ljava/lang/String;
  #25 = Utf8               ConstantValue
  #26 = Utf8               Code
  #27 = Utf8               LineNumberTable
  #28 = Utf8               main
  #29 = Utf8               ([Ljava/lang/String;)V
  #30 = Utf8               SourceFile
  #31 = Utf8               Hello.java
{
  public test.Hello();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #7                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #15                 // String hello world
         5: invokevirtual #17                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 7: 0
        line 8: 8
}
SourceFile: "Hello.java"
```
### Class字节码
#### 常量池 Constant pool
请阅读官方 JVM 规范获取更多信息！！！
#### 类定义和属性
请阅读官方 JVM 规范获取更多信息！！！
属性的通用格式
```java
attribute_info {
    u2 attribute_name_index;
    u4 attribute_length;
    u1 info;
}
```
#### 方法和调用
请阅读官方 JVM 规范获取更多信息！！！
方法的通用格式
```java
method_info {
    u2 access_flag;
    u2 name_index;
    u2 attribute_count;
    attribute_info attributes[attribute_count];
}
```
### ASM

- ASM 是 Java 字节码操作框架，用来动态生成类或增强既有类的功能
- ASM 可以直接产生二进制 class 文件，也可以在类被加载入虚拟机之前动态改变类行为，ASM 从类文件中读入信息后，能改变类行为、分析类信息、根据要求生成新类
- cglib、hibernate、spring 都直接或间接使用了 ASM 操作字节码
#### ASM 编程模型

- Core API：提供了基于事件形式的编程模型，该模型不需要一次性将整个类的结构读取到内存中，因此这种方式更快，需要更少的内存，但编程难度较大
- Tree API：提供基于树形的编程模型，该模型需要一次性将一个类的完整结构全部读取到内存中，所以需要更多的内存，较简单
#### Core API

- Core API 操作字节码是基于 ClassVisitor 接口，这个接口的每个方法对应了 class 文件中的每一项
- ASM 提供了三个基于 ClassVisitor 接口的类来实现 class 文件的生成和转换
   - ClassReader：解析一个类的 class 字节码
   - ClassAdapter：主要功能是将 Classreader 解析的字节码进行改造
   - ClassWriter：输出变化后的字节码
- ASMifier：ASMifier 工具可以生成 ASM 结构
#### ASMifier
idea 插件有 ASM Bytecode Outline 、ASM Bytecode Viewer  等，可以生成 ASM 结构文件
```java
package com.hyfly.asm;

/**
 * java -cp .:../lib/asm-9.1.jar:../lib/asm-util-9.1.jar org.objectweb.asm.util.ASMifier com.hyfly.asm.TargetClass
 * idea plugin: ASM Bytecode Outline / ASM Bytecode Viewer
 *
 * @author flyhy
 */
public class TargetClass {

    public void fun01() {
        long startTime = System.currentTimeMillis();
        System.out.println("TargetClass#fun01 --------");
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        long endTime = System.currentTimeMillis();
        System.out.println("TargetClass#fun01 cost: " + (endTime - startTime));
    }
}
```
通过 ASM Bytecode Viewer  生成的 ASM 文件为
```java
package asm.com.hyfly.asm;

import org.objectweb.asm.AnnotationVisitor;
import org.objectweb.asm.Attribute;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.ConstantDynamic;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.Handle;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.RecordComponentVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.TypePath;

public class TargetClassDump implements Opcodes {

    public static byte[] dump() throws Exception {

        ClassWriter classWriter = new ClassWriter(0);
        FieldVisitor fieldVisitor;
        RecordComponentVisitor recordComponentVisitor;
        MethodVisitor methodVisitor;
        AnnotationVisitor annotationVisitor0;

        classWriter.visit(V17, ACC_PUBLIC | ACC_SUPER, "com/hyfly/asm/TargetClass", null, "java/lang/Object", null);

        classWriter.visitSource("TargetClass.java", null);

        classWriter.visitInnerClass("java/lang/invoke/MethodHandles$Lookup", "java/lang/invoke/MethodHandles", "Lookup", ACC_PUBLIC | ACC_FINAL | ACC_STATIC);

        {
            methodVisitor = classWriter.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            methodVisitor.visitCode();
            Label label0 = new Label();
            methodVisitor.visitLabel(label0);
            methodVisitor.visitLineNumber(9, label0);
            methodVisitor.visitVarInsn(ALOAD, 0);
            methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            methodVisitor.visitInsn(RETURN);
            Label label1 = new Label();
            methodVisitor.visitLabel(label1);
            methodVisitor.visitLocalVariable("this", "Lcom/hyfly/asm/TargetClass;", null, label0, label1, 0);
            methodVisitor.visitMaxs(1, 1);
            methodVisitor.visitEnd();
        }
        {
            methodVisitor = classWriter.visitMethod(ACC_PUBLIC, "fun01", "()V", null, null);
            methodVisitor.visitCode();
            Label label0 = new Label();
            Label label1 = new Label();
            Label label2 = new Label();
            methodVisitor.visitTryCatchBlock(label0, label1, label2, "java/lang/InterruptedException");
            Label label3 = new Label();
            methodVisitor.visitLabel(label3);
            methodVisitor.visitLineNumber(12, label3);
            methodVisitor.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            methodVisitor.visitVarInsn(LSTORE, 1);
            Label label4 = new Label();
            methodVisitor.visitLabel(label4);
            methodVisitor.visitLineNumber(13, label4);
            methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            methodVisitor.visitLdcInsn("TargetClass#fun01 --------");
            methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            methodVisitor.visitLabel(label0);
            methodVisitor.visitLineNumber(15, label0);
            methodVisitor.visitLdcInsn(new Long(100L));
            methodVisitor.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "sleep", "(J)V", false);
            methodVisitor.visitLabel(label1);
            methodVisitor.visitLineNumber(18, label1);
            Label label5 = new Label();
            methodVisitor.visitJumpInsn(GOTO, label5);
            methodVisitor.visitLabel(label2);
            methodVisitor.visitLineNumber(16, label2);
            methodVisitor.visitFrame(Opcodes.F_FULL, 2, new Object[]{"com/hyfly/asm/TargetClass", Opcodes.LONG}, 1, new Object[]{"java/lang/InterruptedException"});
            methodVisitor.visitVarInsn(ASTORE, 3);
            Label label6 = new Label();
            methodVisitor.visitLabel(label6);
            methodVisitor.visitLineNumber(17, label6);
            methodVisitor.visitVarInsn(ALOAD, 3);
            methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/lang/InterruptedException", "printStackTrace", "()V", false);
            methodVisitor.visitLabel(label5);
            methodVisitor.visitLineNumber(19, label5);
            methodVisitor.visitFrame(Opcodes.F_SAME, 0, null, 0, null);
            methodVisitor.visitMethodInsn(INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            methodVisitor.visitVarInsn(LSTORE, 3);
            Label label7 = new Label();
            methodVisitor.visitLabel(label7);
            methodVisitor.visitLineNumber(20, label7);
            methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            methodVisitor.visitVarInsn(LLOAD, 3);
            methodVisitor.visitVarInsn(LLOAD, 1);
            methodVisitor.visitInsn(LSUB);
            methodVisitor.visitInvokeDynamicInsn("makeConcatWithConstants", "(J)Ljava/lang/String;", new Handle(Opcodes.H_INVOKESTATIC, "java/lang/invoke/StringConcatFactory", "makeConcatWithConstants", "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;", false), new Object[]{"TargetClass#fun01 cost: \u0001"});
            methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            Label label8 = new Label();
            methodVisitor.visitLabel(label8);
            methodVisitor.visitLineNumber(21, label8);
            methodVisitor.visitInsn(RETURN);
            Label label9 = new Label();
            methodVisitor.visitLabel(label9);
            methodVisitor.visitLocalVariable("e", "Ljava/lang/InterruptedException;", null, label6, label5, 3);
            methodVisitor.visitLocalVariable("this", "Lcom/hyfly/asm/TargetClass;", null, label3, label9, 0);
            methodVisitor.visitLocalVariable("startTime", "J", null, label4, label9, 1);
            methodVisitor.visitLocalVariable("endTime", "J", null, label7, label9, 3);
            methodVisitor.visitMaxs(5, 5);
            methodVisitor.visitEnd();
        }
        classWriter.visitEnd();

        return classWriter.toByteArray();
    }
}

```
### ASM 代码演示
代码可参考 [https://github.com/hyfly233/jvm-test](https://github.com/hyfly233/jvm-test)
#### ASM 演示例子 01
创建三个类，分别为 TargetClass、MyClassVisiter、Generator，其中的 MyClassVisiter 是有 bug 的

- TargetClass
```java
package com.hyfly.asm;

/**
 * @author flyhy
 */
public class TargetClass {

    public void fun01() {
        try {
            Thread.sleep(100);
            System.out.println("TargetClass#fun01 run");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```

- MyClassVisiter
```java
package com.hyfly.asm;

import org.objectweb.asm.*;

public class MyClassVisitor extends ClassVisitor {

    public MyClassVisitor(ClassVisitor classVisitor) {
        super(Opcodes.ASM9, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        cv.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access, name, descriptor, signature, exceptions);
        if (!"<init>".equals(name) && mv != null) {
            // 为这种方法增加记录执行时间的功能
            mv = new MyMethodVisitor(mv);
        }
        return mv;
    }

    static class MyMethodVisitor extends MethodVisitor {

        public MyMethodVisitor(MethodVisitor methodVisitor) {
            super(Opcodes.ASM9, methodVisitor);
        }

        @Override
        public void visitCode() {
            super.visitCode();
            // 在方法开始处插入代码
            mv.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
            mv.visitVarInsn(Opcodes.LSTORE, 1);
        }

        @Override
        public void visitInsn(int opcode) {
            // 在方法返回处插入代码
            if ((opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN) || opcode == Opcodes.ATHROW) {
                // 下面的代码是通过 ASM Bytecode Viewer 生成的 ASM 文件中复制出来的
                mv.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/System", "currentTimeMillis", "()J", false);
                mv.visitVarInsn(Opcodes.LSTORE, 3);
                Label label7 = new Label();
                mv.visitLabel(label7);
                mv.visitLineNumber(20, label7);
                mv.visitFieldInsn(Opcodes.GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
                mv.visitVarInsn(Opcodes.LLOAD, 3);
                mv.visitVarInsn(Opcodes.LLOAD, 1);
                mv.visitInsn(Opcodes.LSUB);
                mv.visitInvokeDynamicInsn("makeConcatWithConstants", "(J)Ljava/lang/String;", new Handle(Opcodes.H_INVOKESTATIC, "java/lang/invoke/StringConcatFactory", "makeConcatWithConstants", "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;", false), new Object[]{"TargetClass#fun01 cost: \u0001"});
                mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
                Label label8 = new Label();
                mv.visitLabel(label8);
                mv.visitLineNumber(21, label8);
            }

            super.visitInsn(opcode);
        }
    }
}

```

- Generator
```java
package com.hyfly.asm;

import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;

import java.io.File;
import java.io.FileOutputStream;

public class Generator {
    public static void main(String[] args) throws Exception {
        ClassReader cr = new ClassReader("com/hyfly/asm/TargetClass");

        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);

        ClassVisitor cv = new MyClassVisitor(cw);

        cr.accept(cv, ClassReader.SKIP_DEBUG);

        byte[] data = cw.toByteArray();

        // 输出到文件
        File file = new File("/Users/flyhy/workspace/jvm-test/asm/bin/com/hyfly/asm/TargetClass.class");

        FileOutputStream fileOutputStream = new FileOutputStream(file);
        fileOutputStream.write(data);
        fileOutputStream.close();
    }
}

```
执行 Generator 中的 main 方法生成 TargetClass.class 文件，并通过 idea 打开得到的内容为，能清楚的看到代码 13 行是错误的
```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.hyfly.asm;

public class TargetClass {
    public TargetClass() {
    }

    public void fun01() {
        InterruptedException var1 = System.currentTimeMillis();

        try {
            Thread.sleep(100L);
            System.out.println("TargetClass#fun01 run");
        } catch (InterruptedException var5) {
            var1 = var5;
            var5.printStackTrace();
        }

        long var3 = System.currentTimeMillis();
        System.out.println("TargetClass#fun01 cost: " + (var3 - var1));
    }
}

```
使用 javap -verbose 命令得到的内容
```java
Classfile /Users/flyhy/workspace/jvm-test/asm/bin/com/hyfly/asm/TargetClass.class
  Last modified 2023年4月1日; size 961 bytes
  SHA-256 checksum 5fd3906b265448870bbff62db9ed106d9527d38b2b43f5d305ecf51992b68e4c
public class com.hyfly.asm.TargetClass
  minor version: 0
  major version: 61
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #2                          // com/hyfly/asm/TargetClass
  super_class: #4                         // java/lang/Object
  interfaces: 0, fields: 0, methods: 2, attributes: 1
Constant pool:
   #1 = Utf8               com/hyfly/asm/TargetClass
   #2 = Class              #1             // com/hyfly/asm/TargetClass
   #3 = Utf8               java/lang/Object
   #4 = Class              #3             // java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = NameAndType        #5:#6          // "<init>":()V
   #8 = Methodref          #4.#7          // java/lang/Object."<init>":()V
   #9 = Utf8               fun01
  #10 = Utf8               java/lang/System
  #11 = Class              #10            // java/lang/System
  #12 = Utf8               currentTimeMillis
  #13 = Utf8               ()J
  #14 = NameAndType        #12:#13        // currentTimeMillis:()J
  #15 = Methodref          #11.#14        // java/lang/System.currentTimeMillis:()J
  #16 = Utf8               java/lang/InterruptedException
  #17 = Class              #16            // java/lang/InterruptedException
  #18 = Long               100l
  #20 = Utf8               java/lang/Thread
  #21 = Class              #20            // java/lang/Thread
  #22 = Utf8               sleep
  #23 = Utf8               (J)V
  #24 = NameAndType        #22:#23        // sleep:(J)V
  #25 = Methodref          #21.#24        // java/lang/Thread.sleep:(J)V
  #26 = Utf8               out
  #27 = Utf8               Ljava/io/PrintStream;
  #28 = NameAndType        #26:#27        // out:Ljava/io/PrintStream;
  #29 = Fieldref           #11.#28        // java/lang/System.out:Ljava/io/PrintStream;
  #30 = Utf8               TargetClass#fun01 run
  #31 = String             #30            // TargetClass#fun01 run
  #32 = Utf8               java/io/PrintStream
  #33 = Class              #32            // java/io/PrintStream
  #34 = Utf8               println
  #35 = Utf8               (Ljava/lang/String;)V
  #36 = NameAndType        #34:#35        // println:(Ljava/lang/String;)V
  #37 = Methodref          #33.#36        // java/io/PrintStream.println:(Ljava/lang/String;)V
  #38 = Utf8               printStackTrace
  #39 = NameAndType        #38:#6         // printStackTrace:()V
  #40 = Methodref          #17.#39        // java/lang/InterruptedException.printStackTrace:()V
  #41 = Utf8               TargetClass#fun01 cost: \u0001
  #42 = String             #41            // TargetClass#fun01 cost: \u0001
  #43 = Utf8               java/lang/invoke/StringConcatFactory
  #44 = Class              #43            // java/lang/invoke/StringConcatFactory
  #45 = Utf8               makeConcatWithConstants
  #46 = Utf8               (Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
  #47 = NameAndType        #45:#46        // makeConcatWithConstants:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
  #48 = Methodref          #44.#47        // java/lang/invoke/StringConcatFactory.makeConcatWithConstants:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
  #49 = MethodHandle       6:#48          // REF_invokeStatic java/lang/invoke/StringConcatFactory.makeConcatWithConstants:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
  #50 = Utf8               (J)Ljava/lang/String;
  #51 = NameAndType        #45:#50        // makeConcatWithConstants:(J)Ljava/lang/String;
  #52 = InvokeDynamic      #0:#51         // #0:makeConcatWithConstants:(J)Ljava/lang/String;
  #53 = Utf8               Code
  #54 = Utf8               StackMapTable
  #55 = Utf8               LineNumberTable
  #56 = Utf8               BootstrapMethods
{
  public com.hyfly.asm.TargetClass();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #8                  // Method java/lang/Object."<init>":()V
         4: return

  public void fun01();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=5, locals=5, args_size=1
         0: invokestatic  #15                 // Method java/lang/System.currentTimeMillis:()J
         3: lstore_1
         4: invokestatic  #15                 // Method java/lang/System.currentTimeMillis:()J
         7: lstore_1
         8: ldc2_w        #18                 // long 100l
        11: invokestatic  #25                 // Method java/lang/Thread.sleep:(J)V
        14: getstatic     #29                 // Field java/lang/System.out:Ljava/io/PrintStream;
        17: ldc           #31                 // String TargetClass#fun01 run
        19: invokevirtual #37                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        22: goto          30
        25: astore_1
        26: aload_1
        27: invokevirtual #40                 // Method java/lang/InterruptedException.printStackTrace:()V
        30: invokestatic  #15                 // Method java/lang/System.currentTimeMillis:()J
        33: lstore_3
        34: getstatic     #29                 // Field java/lang/System.out:Ljava/io/PrintStream;
        37: lload_3
        38: lload_1
        39: lsub
        40: invokedynamic #52,  0             // InvokeDynamic #0:makeConcatWithConstants:(J)Ljava/lang/String;
        45: invokevirtual #37                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        48: invokestatic  #15                 // Method java/lang/System.currentTimeMillis:()J
        51: lstore_3
        52: getstatic     #29                 // Field java/lang/System.out:Ljava/io/PrintStream;
        55: lload_3
        56: lload_1
        57: lsub
        58: invokedynamic #52,  0             // InvokeDynamic #0:makeConcatWithConstants:(J)Ljava/lang/String;
        63: invokevirtual #37                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        66: return
      Exception table:
         from    to  target type
             8    22    25   Class java/lang/InterruptedException
      StackMapTable: number_of_entries = 2
        frame_type = 89 /* same_locals_1_stack_item */
          stack = [ class java/lang/InterruptedException ]
        frame_type = 4 /* same */
      LineNumberTable:
        line 20: 52
        line 21: 66
}
BootstrapMethods:
  0: #49 REF_invokeStatic java/lang/invoke/StringConcatFactory.makeConcatWithConstants:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
    Method arguments:
      #42 TargetClass#fun01 cost: \u0001

```
##### 测试生成的 TargetClass.class
将生成的 TargetClass.class 文件替换 target 文件夹中的 TargetClass.class 文件，执行 TestTargetClass 的 main() 方法将报错
```java
package com.hyfly.asm;

public class TestTargetClass {
    public static void main(String[] args) {
        TargetClass targetClass = new TargetClass();
        targetClass.fun01();
    }
}
```
报错信息
```
Exception in thread "main" java.lang.VerifyError: Bad local variable type
Exception Details:
  Location:
    com/hyfly/asm/TargetClass.fun01()V @34: lload_1
  Reason:
    Type top (current frame, locals[1]) is not assignable to long
  Current Frame:
    bci: @34
    flags: { }
    locals: { 'com/hyfly/asm/TargetClass', top, top, long, long_2nd }
    stack: { 'java/io/PrintStream', long, long_2nd }
  Bytecode:
    0000000: b800 0f40 1400 12b8 0019 b200 1d12 1fb6
    0000010: 0025 a700 084c 2bb6 0028 b800 0f42 b200
    0000020: 1d21 1f65 ba00 3400 00b6 0025 b1       
  Exception Handler Table:
    bci [4, 18] => handler: 21
  Stackmap Table:
    same_locals_1_stack_item_frame(@21,Object[#17])
    same_frame(@26)

	at com.hyfly.asm.TestTargetClass.main(TestTargetClass.java:5)
```
##### 报错原因
在 MyClassVisitor 的内部类 MyMethodVisitor 的 visitCode() 方法中，mv.visitVarInsn(Opcodes.LSTORE, 1); 是用于存储局部变量的，而 TargetClass 也存储了局部变量 InterruptedException e，两次存储变量冲突
#### ASM 演示例子 02
##### 修改相关类
修改 ASM 演示例子 01 中的相关类，生成 ASM 文件

1. 添加 MyTimeLogger 类
```java
package com.hyfly.asm;

public class MyTimeLogger {
    private static long startTime = 0L;

    public static void start() {
        startTime = System.currentTimeMillis();
    }

    public static void end() {
        long endTime = System.currentTimeMillis();
        System.out.println("MyTimeLogger invoke method cost: " + (endTime - startTime));
    }
}
```
 2. 修改 TargetClass 并对其 javac 编译为 class 文件
```java
package com.hyfly.asm;

public class TargetClass {

    public void fun01() {
        MyTimeLogger.start();

        try {
            Thread.sleep(100);
            System.out.println("TargetClass#fun01 run");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        MyTimeLogger.end();
    }
}

```

3. 通过 ASM Bytecode Viewer  生成的 ASM 文件为
```java
package asm.com.hyfly.asm;

import org.objectweb.asm.AnnotationVisitor;
import org.objectweb.asm.Attribute;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.ConstantDynamic;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.Handle;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.RecordComponentVisitor;
import org.objectweb.asm.Type;
import org.objectweb.asm.TypePath;

public class TargetClassDump implements Opcodes {

    public static byte[] dump() throws Exception {

        ClassWriter classWriter = new ClassWriter(0);
        FieldVisitor fieldVisitor;
        RecordComponentVisitor recordComponentVisitor;
        MethodVisitor methodVisitor;
        AnnotationVisitor annotationVisitor0;

        classWriter.visit(V17, ACC_PUBLIC | ACC_SUPER, "com/hyfly/asm/TargetClass", null, "java/lang/Object", null);

        classWriter.visitSource("TargetClass.java", null);

        {
            methodVisitor = classWriter.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
            methodVisitor.visitCode();
            Label label0 = new Label();
            methodVisitor.visitLabel(label0);
            methodVisitor.visitLineNumber(9, label0);
            methodVisitor.visitVarInsn(ALOAD, 0);
            methodVisitor.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
            methodVisitor.visitInsn(RETURN);
            Label label1 = new Label();
            methodVisitor.visitLabel(label1);
            methodVisitor.visitLocalVariable("this", "Lcom/hyfly/asm/TargetClass;", null, label0, label1, 0);
            methodVisitor.visitMaxs(1, 1);
            methodVisitor.visitEnd();
        }
        {
            methodVisitor = classWriter.visitMethod(ACC_PUBLIC, "fun01", "()V", null, null);
            methodVisitor.visitCode();
            Label label0 = new Label();
            Label label1 = new Label();
            Label label2 = new Label();
            methodVisitor.visitTryCatchBlock(label0, label1, label2, "java/lang/InterruptedException");
            Label label3 = new Label();
            methodVisitor.visitLabel(label3);
            methodVisitor.visitLineNumber(12, label3);
            methodVisitor.visitMethodInsn(INVOKESTATIC, "com/hyfly/asm/MyTimeLogger", "start", "()V", false);
            methodVisitor.visitLabel(label0);
            methodVisitor.visitLineNumber(15, label0);
            methodVisitor.visitLdcInsn(new Long(100L));
            methodVisitor.visitMethodInsn(INVOKESTATIC, "java/lang/Thread", "sleep", "(J)V", false);
            Label label4 = new Label();
            methodVisitor.visitLabel(label4);
            methodVisitor.visitLineNumber(16, label4);
            methodVisitor.visitFieldInsn(GETSTATIC, "java/lang/System", "out", "Ljava/io/PrintStream;");
            methodVisitor.visitLdcInsn("TargetClass#fun01 run");
            methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            methodVisitor.visitLabel(label1);
            methodVisitor.visitLineNumber(19, label1);
            Label label5 = new Label();
            methodVisitor.visitJumpInsn(GOTO, label5);
            methodVisitor.visitLabel(label2);
            methodVisitor.visitLineNumber(17, label2);
            methodVisitor.visitFrame(Opcodes.F_SAME1, 0, null, 1, new Object[]{"java/lang/InterruptedException"});
            methodVisitor.visitVarInsn(ASTORE, 1);
            Label label6 = new Label();
            methodVisitor.visitLabel(label6);
            methodVisitor.visitLineNumber(18, label6);
            methodVisitor.visitVarInsn(ALOAD, 1);
            methodVisitor.visitMethodInsn(INVOKEVIRTUAL, "java/lang/InterruptedException", "printStackTrace", "()V", false);
            methodVisitor.visitLabel(label5);
            methodVisitor.visitLineNumber(21, label5);
            methodVisitor.visitFrame(Opcodes.F_SAME, 0, null, 0, null);
            methodVisitor.visitMethodInsn(INVOKESTATIC, "com/hyfly/asm/MyTimeLogger", "end", "()V", false);
            Label label7 = new Label();
            methodVisitor.visitLabel(label7);
            methodVisitor.visitLineNumber(22, label7);
            methodVisitor.visitInsn(RETURN);
            Label label8 = new Label();
            methodVisitor.visitLabel(label8);
            methodVisitor.visitLocalVariable("e", "Ljava/lang/InterruptedException;", null, label6, label5, 1);
            methodVisitor.visitLocalVariable("this", "Lcom/hyfly/asm/TargetClass;", null, label3, label8, 0);
            methodVisitor.visitMaxs(2, 2);
            methodVisitor.visitEnd();
        }
        classWriter.visitEnd();

        return classWriter.toByteArray();
    }
}

```

4. 复制 ASM 文件中的相关内容，修改 MyClassVisitor 类
```java
package com.hyfly.asm;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

public class MyClassVisitor extends ClassVisitor {

    public MyClassVisitor(ClassVisitor classVisitor) {
        super(Opcodes.ASM9, classVisitor);
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName, String[] interfaces) {
        cv.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String descriptor, String signature, String[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access, name, descriptor, signature, exceptions);
        if (!"<init>".equals(name) && mv != null) {
            // 为这种方法增加记录执行时间的功能
            mv = new MyMethodVisitor(mv);
        }
        return mv;
    }

    static class MyMethodVisitor extends MethodVisitor {

        public MyMethodVisitor(MethodVisitor methodVisitor) {
            super(Opcodes.ASM9, methodVisitor);
        }

        @Override
        public void visitCode() {
            super.visitCode();
            // 在方法开始处插入代码
            mv.visitMethodInsn(Opcodes.INVOKESTATIC, "com/hyfly/asm/MyTimeLogger", "start", "()V", false);
        }

        @Override
        public void visitInsn(int opcode) {
            // 在方法返回处插入代码
            if ((opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN) || opcode == Opcodes.ATHROW) {
                mv.visitMethodInsn(Opcodes.INVOKESTATIC, "com/hyfly/asm/MyTimeLogger", "end", "()V", false);
            }

            super.visitInsn(opcode);
        }
    }
}

```
##### 测试
使用到的类有 MyTimeLogger、TargetClass、Generator 、TestTargetClass 、MyClassVisitor。其中为修改的类有 Generator、MyClassVisitor，新增的类为 MyTimeLogger，需要回滚的类为 TargetClass

1. 执行 Generator 中的 main 方法生成 TargetClass.class 文件，并通过 idea 打开得到的内容为
```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.hyfly.asm;

public class TargetClass {
    public TargetClass() {
    }

    public void fun01() {
        MyTimeLogger.start();

        try {
            Thread.sleep(100L);
            System.out.println("TargetClass#fun01 run");
        } catch (InterruptedException var2) {
            var2.printStackTrace();
        }

        MyTimeLogger.end();
    }
}

```

2. 将生成的 TargetClass.class 文件替换 target 文件夹中的 TargetClass.class 文件，执行 TestTargetClass 的 main() 方法，控制台输出内容
```
TargetClass#fun01 run
MyTimeLogger invoke method cost: 104
```
### ASM 总结
在使用 ASM 增强原始类的功能时，不应该在 MethodVisitor 的相关方法中使用局部变量，而是将增强的方法封装到类的方法中，以避免在存储局部变量时增强类中的局部变量与原始类中的局部变量冲突
## 类加载、连接和初始化
### 类在 JVM 中的生命周期
![Snipaste_2023-04-03_21-50-25.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1680529849532-80ea864c-2405-424d-a5e1-0950f3c1cf69.png#averageHue=%23fefefd&clientId=ue6824eed-7a6a-4&from=ui&id=u1eb22735&name=Snipaste_2023-04-03_21-50-25.png&originHeight=946&originWidth=952&originalType=binary&ratio=2&rotation=0&showTitle=false&size=149146&status=done&style=none&taskId=u61615b0c-f4c7-4381-8e5c-9229ee13679&title=)

1. 加载：查找并加载类文件的二进制数据
2. 连接：将已经读入内存的类的二进制数据合并到 JVM 运行时环境中去
   1. 验证：确保被加载类的正确性
   2. 装备：为类的静态变量分配内存，创建静态变量
   3. 解析：把常量池中的符号引用转换成直接引用
3. 初始化：为类的静态变量赋初始值
4. 使用
5. 卸载
### 类加载

1. 通过类的全限定名来获取该类的二进制字节流
2. 把二进制字节流转化为方法区的运行时数据结构
3. 在堆上创建一个 java.lang.Class 对象，用来封装类在方法区内的数据结构，并向外提供了访问方法区内数据结构的接口
### 加载类的方法

- 常见方式：从本地文件系统中加载，从 jar 等归档文件中加载
- 动态方式：将 Java 源文件动态编译成 class
- 其他：网络下载，从专有数据库中加载
### 类加载器

- 类加载器并不需要等到某个类首次主动使用的时候才加载它，JVM 规范允许类加载器在预料到某个类将要被使用的时候就预先加载它
- 如果在加载的时候 .class 文件缺失。会在该类首次主动使用时抛出 LinkageError 错误，如果一直没有被使用，则不会报错
#### JVM 自带的加载器

- 启动类加载器（BootstrapClassLoader）
   - Java 程序不能直接引用启动类加载器，直接设置 classLoader 为 null，默认使用启动类加载器
   - 用于加载启动的基础模块，比如：java.base、java.management、java.xml 等，启动类加载器是 JVM 平台自身的，不允许被其他方式修改，通过 Object.getClass().getClassLoader() 得到的结果是 null
   - JDK 8 的启动类加载器负责将 JAVA_HONME/lib，或者 -Xbootclasspath 参数指定的路径中的，且是虚拟机识别的类库加载到内存中（按照名字识别，如：rt.jar，对于不能识别的文件不予加载）
```java
String str = "hello class loader";

// str class loader null
System.out.println("str class loader " + str.getClass().getClassLoader());
```

- 扩展类加载器（ExtensionClassLoader）、平台类加载器（PlatformClassLoader）
   - JDK 8 之前是扩展类加载器，JDK 8 之后为平台类加载器，扩展类加载器的扩展性较差、安全性较低，所以被移除
   - JDK 8  的扩展类加载器负责加载 JRE_HOME/lib/ext，或者 java.ext.dirs 系统变量所指定路径上的所有类库
```java
Class<?> sqlDriver = Class.forName("java.sql.Driver");
ClassLoader classLoader = sqlDriver.getClassLoader();

// jdk.internal.loader.ClassLoaders$PlatformClassLoader@1f32e575
System.out.println("sqlDriver class loader " + classLoader);

// null
System.out.println("sqlDriver parent class loader " + classLoader.getParent());
```

- 应用程序类加载器（AppClassLoader）
   - 用于加载应用级别的模块，比如：jdk.compiler、jdk.jartool、jdk.jshell 等等，还加载 classpath 路径中的所有类库
   - JDK 8 的应用程序类加载器只加载 classpath 路径中的所有类库
```java
ClassLoader01 classLoader01 = new ClassLoader01();
ClassLoader classLoader03 = classLoader01.getClass().getClassLoader();

// jdk.internal.loader.ClassLoaders$AppClassLoader@251a69d7
System.out.println("classLoader01 class loader " + classLoader03);

// jdk.internal.loader.ClassLoaders$PlatformClassLoader@1f32e575
System.out.println("classLoader01 parent class loader " + classLoader03.getParent());

// null
System.out.println("classLoader01 parent parent class loader " + classLoader03.getParent().getParent());

Class jShell = Class.forName("jdk.jshell.JShell");

// jdk.internal.loader.ClassLoaders$AppClassLoader@251a69d7
System.out.println("jShell class loader " + jShell.getClassLoader());
```
#### 用户自定义类加载器
是 java,lang.ClassLoader 的子类，用户可以定制类的加载方式，其加载顺序在所有系统类加载器之后
#### 类加载器的关系
![Snipaste_2023-04-03_22-28-17.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1680532123384-54c99d32-9ebc-4d46-8950-e63bb0f459e4.png#averageHue=%23e5e7e6&clientId=ue6824eed-7a6a-4&from=ui&id=ubf926a56&name=Snipaste_2023-04-03_22-28-17.png&originHeight=1032&originWidth=1986&originalType=binary&ratio=2&rotation=0&showTitle=false&size=716301&status=done&style=none&taskId=ufe61f262-c04b-4453-9f12-0b4b6a92898&title=)
### 双亲委派模型
JVM 中的 ClassLoader 通常采用双亲委派模型，要求除了启动类加载器外，其余的类加载器都应该有自己的父级加载器，这个父子关系是组合而不是继承
#### 工作过程

1. 一个类加载器接收到类加载请求后，首先搜索它内建加载器定义的所有“具名模块”
2. 如果找到了合适的模块定义，即该模块中存在该需要加载的类，将会使用该加载器来加载
3. 如果 class 没有在这些加载器定义的具名模块中找到，那么将会委托给父级加载器，直到启动类加载器
4. 如果父级加载器反馈它不能完成加载请求，比如在搜索路径下找不到这个类。那子的类加载器才自己来加载
5. 在类路径下找到的类将成为这些加载器的无名模块
6. 都没找到抛出 ClassNotFound
7. JDK 8 没有模块化，所以直接委派个父加载器
#### 作用

- 双亲委派模型对于保证了 Java 程序的稳定运行很重要
- 公用且具有一致性的类都只会被加载一次
- 对于已经加载的系统级别的类，不管是哪一级别的类都不能再次加载，保证了系统级别的类不会被恶意修改或被覆盖
#### 其他

- 实现双亲委派的代码在 java.lang.ClassLoader 的 loadClass() 方法中，如果自定义类加载器的话，推荐覆盖实现 findClass() 方法
- 如果有一个类加载器能加载某个类，则该加载器称为定义类加载的，所有能成功返回该类的 Class 的类加载器都被称为初始类加载器
- 如果没有指定父加载器，默认就是启动类加载器
- 每个类加载器都有自己的命名空间，命名空间由该加载器及其所有父加载器所加载的类构成，不同的命名空间可以出现类的全路径名相同的情况
- 运行时包由同一个类加载器的类构成，决定两个类是否属于同一个运行时包，不及要看全路径名是否一样，还要看定义类加载器是否相同，只有属于同一个运行时包的类才能实现相互包内可见
### 破坏双亲委派模型

- 双亲委派模型的问题：父加载器无法向下识别子加载器加载的资源
- Java 不太完美的解决方式：引入线程上下文类加载器，可以通过 Thread 的 setContextClassLoader() 进行设置
- 另一种情况：实现热替换，比如 OSGI 的模块化热部署，它的类加载器不再严格按照双亲委派模型，更多的使用平级的类加载器

### 类连接
#### 类连接主要验证的内容

- 类文件结构检查：按照 JVM 规范规定的类文件结构进行检查
- 元数据验证：对字节码描述的信息进行语义分析，保证其符合 Java 语言规范的要求
- 字节码验证：通过对数据流和控制流进行分析，确保程序语义是合法和符合逻辑的
- 符号引用验证：对类自身以外的信息，即常量池中的各种符号引用，进行匹配校验
#### 类连接的解析

- 解析是把常量池中的符号引用转换成直接引用的过程，包括：符号引用（以一组无歧义的符号来描述所引用的目标，与虚拟机的实现无关）
- 直接引用：直接指向目标的指针、相对偏移量、或能间接定位到目标的句柄，是和虚拟机的实现相关
- 主要针对：类、接口、字段、类方法、接口方法、方法类型、方法句柄、调用点限定符
### 类的初始化

- 类的初始化是类的静态变量赋初始值，或者说是执行类构造器 clinit 方法的过程
   - 如果类还没有加载和连接，就先加载和连接
   - 如果类存在父类，且父类没有初始化，就先初始化父类
   - 如果类中存在初始化语句，则会依次执行初始化语句
   - 如果是接口
      - 初始化一个类的时候，并不会先初始化它的接口
      - 初始化一个接口时，并不会初始化它的父接口
      - 只有当程序首次使用接口里面的变量或者调用接口方法的时候，才会导致接口初始化
   - 调用 ClassLoader 类的 loadClass 方法来装载一个类，并不会初始化这个类，这不是对类的主动使用
#### 初始化的时机

- Java 程序对类的使用方式分成：主动使用和被动使用，JVM 必须在每个类或接口“首次主动使用”时才初始化它们；被动使用类不会导致类的初始化
- 主动使用：
   - 创建类实例
   - 访问某个类或接口的静态变量
   - 调用类的静态方法
   - 反射某个类
   - 某个父类还没有初始化时，初始化父类的子类
   - JVM 启动的时候运行的主类
   - 定义了 default 方法的接口，当接口实现类初始化时
#### 类初始化机制
在Java中，类的初始化可以分为以下两种情况：

1. 类的静态初始化：当一个类被加载时，会执行类的静态初始化过程。类的静态初始化会按照以下顺序进行：
   1. 静态变量的赋值操作：静态变量会按照定义的顺序依次初始化，如果一个静态变量在定义时没有指定初始值，那么它将被赋予默认值。
   2. 静态代码块的执行：如果一个类包含静态代码块，那么这些代码块会在静态变量的初始化之后执行，且按照代码块的顺序执行。
2. 对象的初始化：当一个对象被创建时，会执行对象的初始化过程。对象的初始化会按照以下顺序进行：
   1. 成员变量的赋值操作：成员变量会按照定义的顺序依次初始化，如果一个成员变量在定义时没有指定初始值，那么它将被赋予默认值。
   2. 构造代码块的执行：如果一个类包含构造代码块，那么这些代码块会在成员变量的初始化之后执行，且按照代码块的顺序执行。
   3. 构造函数的执行：最后，会执行对象的构造函数。

需要注意的是，如果一个类被继承，那么子类的初始化过程中，会先执行父类的初始化过程，然后再执行子类的初始化过程。此外，静态变量和静态代码块只会在类被加载时执行一次，而成员变量和构造代码块会在每次创建对象时都执行。
#### 类初始化顺序
Java中，类的初始化顺序可以分为以下三个步骤：

1. 父类的静态成员变量和静态代码块的初始化，按照代码顺序执行。
2. 子类的静态成员变量和静态代码块的初始化，按照代码顺序执行。
3. 父类和子类的实例成员变量和构造函数的初始化，按照代码顺序执行。如果有多个构造函数，则以调用的构造函数为准。

具体来说，Java类的初始化顺序如下：

1. 加载父类的类对象，并初始化其静态成员变量和静态代码块。
2. 加载子类的类对象，并初始化其静态成员变量和静态代码块。
3. 创建父类的实例对象，并按照代码顺序初始化其实例成员变量和构造函数。
4. 创建子类的实例对象，并按照代码顺序初始化其实例成员变量和构造函数。

需要注意的是，父类和子类的静态成员变量和静态代码块只会在类被加载时执行一次，而实例成员变量和构造函数会在每次创建对象时都执行。另外，如果父类和子类中有同名的成员变量，子类的成员变量会覆盖父类的成员变量。
### 类的卸载

- 当代表一个类的 Class 对象不再被引用，那么 Class 对象的生命周期就结束了，对应在方法区中的数据也会被卸载
- JVM 自带的类加载器装载的类，是不会卸载的，由用户自定义的类加载器加载的类是可以被卸载的
## Java 内存分配基础
### JVM 的简化架构
JVM 的简化架构，内存区域被称为运行时数据区
![Snipaste_2023-04-10_22-26-17.png](https://cdn.nlark.com/yuque/0/2023/png/29236088/1681136814886-240288f8-3b94-461e-9fa2-4bfcebf5e5fe.png#averageHue=%23d1a985&clientId=u35c67d1a-373a-4&from=ui&id=ufa9a0d6e&name=Snipaste_2023-04-10_22-26-17.png&originHeight=1044&originWidth=1400&originalType=binary&ratio=2&rotation=0&showTitle=false&size=505683&status=done&style=none&taskId=u272586e2-5a21-4584-a572-ad7f48b6dd9&title=)
#### 运行时数据区
主要包括：PC 寄存器、Java 虚拟机栈、Java 堆、方法区、运行时常量池、本地方法栈等
### 栈、堆、方法区之间的交互关系
