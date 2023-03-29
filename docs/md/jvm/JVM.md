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
