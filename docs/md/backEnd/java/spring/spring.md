# Spring IoC容器

IoC容器负责实例化，配置和组装对象。 IoC容器从XML文件获取信息并相应地工作。 IoC容器执行的主要任务是:

实例化应用程序类配置对象组装对象之间的依赖关系

有两种类型的IoC容器。它们是:

**BeanFactory****ApplicationContext**

### BeanFactory和ApplicationContext之间的区别

org.springframework.beans.factory。 **BeanFactory** 和org.springframework.context。 **ApplicationContext** 接口充当IoC容器。 ApplicationContext接口建立在BeanFactory接口的顶部。它比BeanFactory增加了一些额外的功能，例如与Spring的AOP的简单集成，消息资源处理(用于I18N)，事件传播，Web应用程序的特定于应用程序层的上下文(例如WebApplicationContext)。因此，使用ApplicationContext比使用BeanFactory更好。

### 使用BeanFactory

XmlBeanFactory是BeanFactory接口的实现类。要使用BeanFactory，我们需要创建XmlBeanFactory类的实例，如下所示:

示例

```
Resource resource=new ClassPathResource("applicationContext.xml");
BeanFactory factory=new XmlBeanFactory(resource);
```

XmlBeanFactory类的构造函数接收Resource对象，因此我们需要传递该资源对象来创建BeanFactory对象。

------

使用ApplicationContext

ClassPathXmlApplicationContext类是ApplicationContext接口的实现类。我们需要实例化ClassPathXmlApplicationContext类以使用ApplicationContext，如下所示:

示例

```
ApplicationContext context = 
    new ClassPathXmlApplicationContext("applicationContext.xml");
```

ClassPathXmlApplicationContext类的构造函数接收字符串，因此我们可以传递xml文件的名称来创建ApplicationContext的实例。



# Spring 依赖注入

依赖注入(DI)是一种设计模式，可以从编程代码中删除依赖，以便可以轻松管理和测试应用程序。依赖注入使我们的编程代码松散耦合。为了更好地理解DI，让我们首先了解依赖关系查找(DL):

### 依赖关系查找

依赖查找是一种在需求之后获取资源的方法。例如，可以有多种获取资源的方法:

示例

```
A obj = new AImpl();
```

这样，我们可以通过new关键字直接获取资源(A类的实例)。另一种方法是工厂方法:

示例

```
A obj = A.getA();
```

这样，我们通过调用静态工厂方法getA()获取资源(A类的实例)。

或者，我们可以通过JNDI(Java命名目录接口)获取资源。 :

示例

```
Context ctx = new InitialContext();
Context environmentCtx = (Context) ctx.lookup("java:comp/env");
A obj = (A)environmentCtx.lookup("A");
```

可以有多种获取资源的方法来获取资源。让我们看看这种方法的问题。

### 依赖关系查找问题

主要有两个依赖关系查找问题。

**紧密耦合**: 依赖关系查找方法使代码紧密耦合。如果更改了资源，则需要对代码进行大量修改。**测试不容易**: 这种方法在测试应用程序时会产生很多问题，尤其是在黑盒测试中。

### 依赖注入

依赖注入是一种设计模式，它消除了程式。在这种情况下，我们提供来自外部源(例如XML文件)的信息。它使我们的代码松散耦合，并且更易于测试。在这种情况下，我们将代码编写为:

示例

```
class Employee{
Address address;
Employee(Address address){
this.address=address;
}
public void setAddress(Address address){
this.address=address;
}
}
```

在这种情况下，Address类的实例由外部源(例如XML文件)通过构造函数或setter方法提供。

### 在Spring框架中执行依赖注入的两种方法

Spring框架提供了两种注入依赖项的方法

通过构造方法通过Setter方法



# 依赖项构造方法注入示例

我们可以通过构造函数注入依赖项。 ****的 ****子元素用于构造函数注入。在这里，我们要注入

原始和基于字符串的值从属对象(包含对象)集合值等

### 注入原始值和基于字符串的值

让我们看一下注入原始值和基于字符串的简单示例价值观。我们在这里创建了三个文件:

Employee.javaapplicationContext.xmlTest.java

**Employee.java**

这是一个简单的类，包含两个字段id和name。此类中有四个构造函数和一个方法。

示例

```
package com.nhooo;
public class Employee {
private int id;
private String name;
public Employee() {System.out.println("def cons");}
public Employee(int id) {this.id = id;}
public Employee(String name) { this.name = name;}
public Employee(int id, String name) {
    this.id = id;
    this.name = name;
}
void show(){
    System.out.println(id+" "+name);
}
}
```



**applicationContext.xml**

我们通过此文件将信息提供给Bean。 constructor-arg元素调用构造函数。在这种情况下，将调用int类型的参数化构造函数。 Constructor-arg元素的value属性将分配指定的值。 type属性指定将调用int参数构造函数。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="e" class="com.nhooo.Employee">
<constructor-arg value="10" type="int"></constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用show方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.*;
public class Test {
    public static void main(String[] args) {
        
        Resource r=new ClassPathResource("applicationContext.xml");
        BeanFactory factory=new XmlBeanFactory(r);
        
        Employee s=(Employee)factory.getBean("e");
        s.show();
        
    }
}
```

**输出:** 10空

------

### 注入基于字符串的值

如果您未在构造函数arg元素中指定type属性，则默认情况下将调用字符串类型构造函数。

示例

```
....
<bean id="e" class="com.nhooo.Employee">
<constructor-arg value="10"></constructor-arg>
</bean>
....
```

如果如上所述更改bean元素，则将调用字符串参数构造函数，并且输出将为0 10。

**输出:** 0 10

------

您还可以按如下所示传递字符串文字:

示例

```
....
<bean id="e" class="com.nhooo.Employee">
<constructor-arg value="Sonoo"></constructor-arg>
</bean>
....
```

**输出:** 0 Sonoo

------

您可以按以下方式传递整数文字和字符串

示例

```
....
<bean id="e" class="com.nhooo.Employee">
<constructor-arg value="10" type="int" ></constructor-arg>
<constructor-arg value="Sonoo"></constructor-arg>
</bean>
....
```

**输出:** 10 Sonoo



# 具有依赖对象的构造函数注入

如果类之间存在HAS-A关系，则首先创建依赖对象(包含对象)的实例，然后将其作为主类构造函数的参数传递。在这里，我们的场景是员工HAS-A地址。 Address类对象将称为从属对象。首先让我们看一下Address类:

**Address.java**

该类包含三个属性，一个构造函数和toString()方法以返回这些对象的值。

示例

```
package com.nhooo;
public class Address {
private String city;
private String state;
private String country;
public Address(String city, String state, String country) {
    super();
    this.city = city;
    this.state = state;
    this.country = country;
}
public String toString(){
    return city+" "+state+" "+country;
}
}
```

**Employee.java**

它包含三个属性id，名称和地址(从属对象)，两个构造函数和show()方法来显示当前对象(包括依赖对象)的记录。

示例

```
package com.nhooo;
public class Employee {
private int id;
private String name;
private Address address;//Aggregation
public Employee() {System.out.println("def cons");}
public Employee(int id, String name, Address address) {
    super();
    this.id = id;
    this.name = name;
    this.address = address;
}
void show(){
    System.out.println(id+" "+name);
    System.out.println(address.toString());
}
}
```

**applicationContext.xml**

**ref** 属性用于定义另一个对象的引用，例如，我们将依赖对象传递为构造函数参数。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="a1" class="com.nhooo.Address">
<constructor-arg value="ghaziabad"></constructor-arg>
<constructor-arg value="UP"></constructor-arg>
<constructor-arg value="India"></constructor-arg>
</bean>
<bean id="e" class="com.nhooo.Employee">
<constructor-arg value="12" type="int"></constructor-arg>
<constructor-arg value="Sonoo"></constructor-arg>
<constructor-arg>
<ref bean="a1"/>
</constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用show方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.*;
public class Test {
    public static void main(String[] args) {
        
        Resource r=new ClassPathResource("applicationContext.xml");
        BeanFactory factory=new XmlBeanFactory(r);
        
        Employee s=(Employee)factory.getBean("e");
        s.show();
        
    }
}
```



我们可以在Spring框架中通过构造函数注入集合值。 **constructor-arg** 元素内可以使用三个元素。

可以是:**List****Set****Map**

每个集合可以具有基于字符串和基于非字符串的值。 在此示例中，我们以"论坛"为例，其中 **一个问题可以有多个答案**。一共有三页:

**Question.java****applicationContext.xml****Test.java**

在此示例中，我们使用的列表可以包含重复的元素，您可以使用仅包含唯一元素的set。但是，您需要更改在applicationContext.xml文件中设置的列表和在Question.java文件中设置的列表。

**Question.java**

此类包含三个属性，两个构造函数和显示信息的displayInfo()方法。在这里，我们使用列表来包含多个答案。

示例

```
package com.nhooo;
import java.util.Iterator;
import java.util.List;
public class Question {
private int id;
private String name;
private List<String> answers;
public Question() {}
public Question(int id, String name, List<String> answers) {
    super();
    this.id = id;
    this.name = name;
    this.answers = answers;
}
public void displayInfo(){
    System.out.println(id+" "+name);
    System.out.println("answers are:");
    Iterator<String> itr=answers.iterator();
    while(itr.hasNext()){
        System.out.println(itr.next());
    }
}
}
```

**applicationContext.xml**

此处使用builder-arg的list元素定义列表。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="q" class="com.nhooo.Question">
<constructor-arg value="111"></constructor-arg>
<constructor-arg value="What is java?"></constructor-arg>
<constructor-arg>
<list>
<value>Java is a programming language</value>
<value>Java is a Platform</value>
<value>Java is an Island of Indonasia</value>
</list>
</constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用displayInfo方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Question q=(Question)factory.getBean("q");
    q.displayInfo();
    
}
}
```



# Constructor注入(具有从属对象)示例

如果集合中有依赖对象，则可以使用 **list** ， **set** 中的 **ref** 元素来注入这些信息。 或 **Map**。

在此示例中，我们以"论坛"为例，其中 **一个问题可以有多个答案**。但是Answer具有自己的信息，例如answerId，answer和postedBy。在此示例中使用了四个页面:

**Question.java****Answer.java****applicationContext.xml****Test.java**

在此示例中，我们使用的列表可以包含重复的元素，您可以使用仅包含唯一元素的set。但是，您需要更改在applicationContext.xml文件中设置的列表和在Question.java文件中设置的列表。

**Question.java**

此类包含三个属性，两个构造函数和显示信息的displayInfo()方法。在这里，我们使用列表来包含多个答案。

示例

```
package com.nhooo;
import java.util.Iterator;
import java.util.List;
public class Question {
private int id;
private String name;
private List<Answer> answers;
public Question() {}
public Question(int id, String name, List<Answer> answers) {
    super();
    this.id = id;
    this.name = name;
    this.answers = answers;
}
public void displayInfo(){
    System.out.println(id+" "+name);
    System.out.println("answers are:");
    Iterator<Answer> itr=answers.iterator();
    while(itr.hasNext()){
        System.out.println(itr.next());
    }
}
}
```

**Answer.java**

此类具有三个属性id，name和by构造函数和toString()方法。

示例

```
package com.nhooo;
public class Answer {
private int id;
private String name;
private String by;
public Answer() {}
public Answer(int id, String name, String by) {
    super();
    this.id = id;
    this.name = name;
    this.by = by;
}
public String toString(){
    return id+" "+name+" "+by;
}
}
```

**applicationContext.xml**

**ref** 元素用于定义另一个bean的引用。在这里，我们使用 **ref** 元素的 **bean** 属性来指定另一个bean的引用。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="ans1" class="com.nhooo.Answer">
<constructor-arg value="1"></constructor-arg>
<constructor-arg value="Java is a programming language"></constructor-arg>
<constructor-arg value="John"></constructor-arg>
</bean>
<bean id="ans2" class="com.nhooo.Answer">
<constructor-arg value="2"></constructor-arg>
<constructor-arg value="Java is a Platform"></constructor-arg>
<constructor-arg value="Ravi"></constructor-arg>
</bean>
<bean id="q" class="com.nhooo.Question">
<constructor-arg value="111"></constructor-arg>
<constructor-arg value="What is java?"></constructor-arg>
<constructor-arg>
<list>
<ref bean="ans1"/>
<ref bean="ans2"/>
</list>
</constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用displayInfo方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Question q=(Question)factory.getBean("q");
    q.displayInfo();
    
}
}
```



# Constructor注入和Map示例

在此示例中，我们使用 **`map `**作为具有已发布用户名答案的答案。在这里，我们将键和值对都用作字符串。

像前面的示例一样，它是论坛的示例，其中 **`一个问题可以有多个答案`**。

**Question.java**

此类包含三个属性，两个构造函数和用于显示信息的displayInfo()方法。

示例

```
package com.nhooo;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
public class Question {
private int id;
private String name;
private Map<String,String> answers;
public Question() {}
public Question(int id, String name, Map<String, String> answers) {
    super();
    this.id = id;
    this.name = name;
    this.answers = answers;
}
public void displayInfo(){
    System.out.println("question id:"+id);
    System.out.println("question name:"+name);
    System.out.println("Answers....");
    Set<Entry<String, String>> set=answers.entrySet();
    Iterator<Entry<String, String>> itr=set.iterator();
    while(itr.hasNext()){
        Entry<String,String> entry=itr.next();
        System.out.println("Answer:"+entry.getKey()+" Posted By:"+entry.getValue());
    }
}
}
```

**applicationContext.xml**

**`map `**的 **entry** 属性用于定义键和值信息。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="q" class="com.nhooo.Question">
<constructor-arg value="11"></constructor-arg>
<constructor-arg value="What is Java?"></constructor-arg>
<constructor-arg>
<map>
<entry key="Java is a Programming Language"  value="Ajay Kumar"></entry>
<entry key="Java is a Platform" value="John Smith"></entry>
<entry key="Java is an Island" value="Raj Kumar"></entry>
</map>
</constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用displayInfo()方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Question q=(Question)factory.getBean("q");
    q.displayInfo();
    
}
}
```



# Constructor注入(具有相关对象)示例

在此示例中，我们使用 **`map `**作为具有Answer和User的答案。在这里，我们将键和值对都用作对象。答案具有自己的信息，例如answerId，答案和postedDate，用户具有自己的信息，例如userId，用户名，emailId。

像前面的示例一样，它是论坛的示例其中 **`一个问题可以有多个答案`**。

**Question.java**

此类包含三个属性，两个构造函数和用于显示信息的displayInfo()方法。

示例

```
package com.nhooo;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
public class Question {
private int id;
private String name;
private Map<Answer,User> answers;
public Question() {}
public Question(int id, String name, Map<Answer, User> answers) {
    super();
    this.id = id;
    this.name = name;
    this.answers = answers;
}
public void displayInfo(){
    System.out.println("question id:"+id);
    System.out.println("question name:"+name);
    System.out.println("Answers....");
    Set<Entry<Answer, User>> set=answers.entrySet();
    Iterator<Entry<Answer, User>> itr=set.iterator();
    while(itr.hasNext()){
        Entry<Answer, User> entry=itr.next();
        Answer ans=entry.getKey();
        User user=entry.getValue();
        System.out.println("Answer Information:");
        System.out.println(ans);
        System.out.println("Posted By:");
        System.out.println(user);
    }
}
}
```

**Answer.java**

示例

```
package com.nhooo;
import java.util.Date;
public class Answer {
private int id;
private String answer;
private Date postedDate;
public Answer() {}
public Answer(int id, String answer, Date postedDate) {
    super();
    this.id = id;
    this.answer = answer;
    this.postedDate = postedDate;
}
public String toString(){
    return "Id:"+id+" Answer:"+answer+" Posted Date:"+postedDate;
}
}
```

**User.java**

示例

```
package com.nhooo;
public class User {
private int id;
private String name,email;
public User() {}
public User(int id, String name, String email) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
}
public String toString(){
    return "Id:"+id+" Name:"+name+" Email Id:"+email;
}
}
```

**applicationContext.xml**

条目 **`element `**的 **key-ref** 和 **value-ref** 属性用于在地图中定义bean的引用。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="answer1" class="com.nhooo.Answer">
<constructor-arg value="1"></constructor-arg>
<constructor-arg value="Java is a Programming Language"></constructor-arg>
<constructor-arg value="12/12/2001"></constructor-arg>
</bean>
<bean id="answer2" class="com.nhooo.Answer">
<constructor-arg value="2"></constructor-arg>
<constructor-arg value="Java is a Platform"></constructor-arg>
<constructor-arg value="12/12/2003"></constructor-arg>
</bean>
<bean id="user1" class="com.nhooo.User">
<constructor-arg value="1"></constructor-arg>
<constructor-arg value="Arun Kumar"></constructor-arg>
<constructor-arg value="arun@gmail.com"></constructor-arg>
</bean>
<bean id="user2" class="com.nhooo.User">
<constructor-arg value="2"></constructor-arg>
<constructor-arg value="Varun Kumar"></constructor-arg>
<constructor-arg value="Varun@gmail.com"></constructor-arg>
</bean>
<bean id="q" class="com.nhooo.Question">
<constructor-arg value="1"></constructor-arg>
<constructor-arg value="What is Java?"></constructor-arg>
<constructor-arg>
<map>
<entry key-ref="answer1" value-ref="user1"></entry>
<entry key-ref="answer2" value-ref="user2"></entry>
</map>
</constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean，并调用displayInfo()方法以显示信息。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Question q=(Question)factory.getBean("q");
    q.displayInfo();
    
}
}
```







# Spring Bean继承

通过使用 **bean** 的 **parent** 属性，我们可以指定Bean之间的继承关系。在这种情况下，父bean的值将被继承到当前bean。

让我们看一下继承bean的简单示例。

**Employee.java**

此该类包含三个属性，三个构造函数和用于显示值的show()方法。

示例

```
package com.nhooo;
public class Employee {
private int id;
private String name;
private Address address;
public Employee() {}
public Employee(int id, String name) {
    super();
    this.id = id;
    this.name = name;
}
public Employee(int id, String name, Address address) {
    super();
    this.id = id;
    this.name = name;
    this.address = address;
}
void show(){
    System.out.println(id+" "+name);
    System.out.println(address);
}
}
```

**Address.java**

示例

```
package com.nhooo;
public class Address {
private String addressLine1,city,state,country;
public Address(String addressLine1, String city, String state, String country) {
    super();
    this.addressLine1 = addressLine1;
    this.city = city;
    this.state = state;
    this.country = country;
}
public String toString(){
    return addressLine1+" "+city+" "+state+" "+country;
}
}
```

**applicationContext.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="e1" class="com.nhooo.Employee">
<constructor-arg value="101"></constructor-arg>
<constructor-arg  value="Sachin"></constructor-arg>
</bean>
<bean id="address1" class="com.nhooo.Address">
<constructor-arg value="21,Lohianagar"></constructor-arg>
<constructor-arg value="Ghaziabad"></constructor-arg>
<constructor-arg value="UP"></constructor-arg>
<constructor-arg value="USA"></constructor-arg>
</bean>
<bean id="e2" class="com.nhooo.Employee" parent="e1">
<constructor-arg ref="address1"></constructor-arg>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用show方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Employee e1=(Employee)factory.getBean("e2");
    e1.show();
    
}
}
```

# Spring setter方法注入

我们也可以通过setter方法注入依赖项。 ****的 ****子元素用于Setter注入。在这里，我们要注入

原始和基于字符串的值从属对象(包含对象)集合值等

### 通过setter方法注入原始值和基于字符串的值

让我们看一下注入原始值和通过setter方法基于字符串的值。我们在这里创建了三个文件:

Employee.javaapplicationContext.xmlTest.java

**Employee.java**

这是一个简单的类，包含三个字段id，name和city及其设置器和获取器，以及一种显示这些信息的方法。

示例

```
package com.nhooo;
public class Employee {
private int id;
private String name;
private String city;
public int getId() {
    return id;
}
public void setId(int id) {
    this.id = id;
}
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
public String getCity() {
    return city;
}
public void setCity(String city) {
    this.city = city;
}
void display(){
    System.out.println(id+" "+name+" "+city);
}
}
```

**applicationContext.xml**

我们通过此文件将信息提供给Bean。 property元素调用setter方法。属性的value子元素将分配指定的值。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="obj" class="com.nhooo.Employee">
<property name="id">
<value>20</value>
</property>
<property name="name">
<value>Arun</value>
</property>
<property name="city">
<value>ghaziabad</value>
</property>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用显示方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.*;
public class Test {
    public static void main(String[] args) {
        
        Resource r=new ClassPathResource("applicationContext.xml");
        BeanFactory factory=new XmlBeanFactory(r);
        
        Employee e=(Employee)factory.getBean("obj");
        s.display();
        
    }
}
```

**输出:
**

```
20 Arun ghaziabad
```



# Setter注入和依赖对象示例

就像构造函数注入一样，我们可以使用setter注入另一个bean的依赖项。在这种情况下，我们使用 **`property `**元素。在这里，我们的场景是 **`Employee HAS-A Address`**。 Address类对象将称为从属对象。首先让我们看一下Address类:

**Address.java**

该类包含四个属性，即setter和getter以及toString()方法。

示例

```
package com.nhooo;
public class Address {
private String addressLine1,city,state,country;
//getters and setters
public String toString(){
    return addressLine1+" "+city+" "+state+" "+country;
}
```

**Employee.java**

它包含三个属性id，名称和地址(依赖对象)，使用displayInfo()方法的setter和getter。

示例

```
package com.nhooo;
public class Employee {
private int id;
private String name;
private Address address;
//setters and getters
void displayInfo(){
    System.out.println(id+" "+name);
    System.out.println(address);
}
}
```

**applicationContext.xml**

**`属性`**元素的 **ref** 属性用于定义另一个bean的引用。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="address1" class="com.nhooo.Address">
<property name="addressLine1" value="51,Lohianagar"></property>
<property name="city" value="Ghaziabad"></property>
<property name="state" value="UP"></property>
<property name="country" value="India"></property>
</bean>
<bean id="obj" class="com.nhooo.Employee">
<property name="id" value="1"></property>
<property name="name" value="Sachin Yadav"></property>
<property name="address" ref="address1"></property>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用displayInfo()方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Employee e=(Employee)factory.getBean("obj");
    e.displayInfo();
    
}
}
```



# Setter注入和集合示例

我们可以在Spring框架中通过setter方法注入集合值。 **property** 元素内可以使用三个元素。可以是:

**List****Set****Map**

每个集合可以具有基于字符串和基于非字符串的值。 在此示例中，我们以"论坛"为例，其中 **一个问题可以有多个答案**。一共有三页:

**Question.java****applicationContext.xml****Test.java**

在此示例中，我们使用的列表可以包含重复的元素，您可以使用仅包含唯一元素的set。但是，您需要更改在applicationContext.xml文件中设置的列表和在Question.java文件中设置的列表。

**Question.java**

此类包含三个带有setter的属性以及获取信息的getters和displayInfo()方法。在这里，我们使用列表来包含多个答案。

示例

```
package com.nhooo;
import java.util.Iterator;
import java.util.List;
public class Question {
private int id;
private String name;
private List<String> answers;
//setters and getters
public void displayInfo(){
    System.out.println(id+" "+name);
    System.out.println("answers are:");
    Iterator<String> itr=answers.iterator();
    while(itr.hasNext()){
        System.out.println(itr.next());
    }
}
}
```

**applicationContext.xml**

此处使用builder-arg的list元素定义列表。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="q" class="com.nhooo.Question">
<property name="id" value="1"></property>
<property name="name" value="What is Java?"></property>
<property name="answers">
<list>
<value>Java is a programming language</value>
<value>Java is a platform</value>
<value>Java is an Island</value>
</list>
</property>
</bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用displayInfo方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
public class Test {
public static void main(String[] args) {
    Resource r=new ClassPathResource("applicationContext.xml");
    BeanFactory factory=new XmlBeanFactory(r);
    
    Question q=(Question)factory.getBean("q");
    q.displayInfo();
    
}
}
```









# Spring 自动装配

Spring框架的自动装配功能使您可以隐式注入对象依赖项。它在内部使用setter或构造函数注入。

自动装配不能用于注入基本值和字符串值。它仅适用于参考。

## 自动装配的优点

它需要 **更少的代码**，因为我们不需要编写代码来显式注入依赖项。

## 自动装配的缺点

没有程序员的控制权。

它不能用于原始值和字符串值。

## 自动装配模式

有很多自动装配模式:

| 模式        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| no          | 这是默认的自动装配模式。这意味着默认情况下没有自动装配。     |
| byName      | byName模式根据bean的名称注入对象依赖项。在这种情况下，属性名称和bean名称必须相同。它在内部调用setter方法。 |
| byType      | byType模式根据类型注入对象依赖项。因此属性名称和bean名称可以不同。它在内部调用setter方法。 |
| constructor | 构造函数模式通过调用类的构造函数来注入依赖项。它会调用具有大量参数的构造函数。 |
| autodetect  | 从Spring 3开始不推荐使用。                                   |

## 自动装配示例

让我们看一下在Spring使用自动装配的简单代码。您需要使用bean元素的autowire属性来应用自动装配模式。

示例

```
<bean id="a" class="org.sssit.A" autowire="byName"></bean>
```

让我们看看Spring自动布线的完整示例。为了创建此示例，我们创建了4个文件。

**B.java****A.java****applicationContext.xml****Test.java**

**B.java**

此类仅包含构造函数和方法。

示例

```
package org.sssit;
public class B {
B(){System.out.println("b is created");}
void print(){System.out.println("hello b");}
}
```

**A.java**

此类包含B类的引用以及构造函数和方法。

示例

```
package org.sssit;
public class A {
B b;
A(){System.out.println("a is created");}
public B getB() {
  return b;
}
public void setB(B b) {
  this.b = b;
}
void print(){System.out.println("hello a");}
void display(){
  print();
  b.print();
}
}
```

**applicationContext.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
  xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:p="http://www.springframework.org/schema/p"
  xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="b" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="byName"></bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用显示方法。

示例

```
package org.sssit;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class Test {
public static void main(String[] args) {
  ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
  A a=context.getBean("a",A.class);
  a.display();
}
}
```

输出:

示例

```
b is created
a is created
hello a
hello b
```

### 1)byName自动装配模式

在byName自动装配模式下，bean id和引用名称必须相同。

内部使用setter注射。

示例

```
<bean id="b" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="byName"></bean>
```

但是，如果更改bean的名称，它将不会注入依赖项。

让我们看看将bean的名称从b更改为b1的代码。

示例

```
<bean id="b1" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="byName"></bean>
```

### 2)byType自动装配模式

在byType自动装配模式下，bean ID和引用名称可能不同。但是只能有一个类型的bean。

内部使用setter注入。

示例

```
<bean id="b1" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="byType"></bean>
```

在这种情况下，它可以正常工作，因为您创建了B类型的实例。没关系，您可以使用与引用名称不同的Bean名称。

但是，如果您具有一种类型的多个Bean，它将不起作用并抛出异常。

让我们看看代码中有很多B型bean。

示例

```
<bean id="b1" class="org.sssit.B"></bean>
<bean id="b2" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="byName"></bean>
```

在这种情况下，它将引发异常。

### 3)构造函数自动装配模式

在构造函数自动装配模式下，spring容器通过最高参数化的构造函数注入依赖项。

如果一个类中的3个构造函数，零参数，一个参数和两个参数，然后通过调用两个参数构造函数执行注入。

示例

```
<bean id="b" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="constructor"></bean>
```

### 4)没有自动装配模式

在没有自动装配模式的情况下，spring容器不会通过自动装配注入依赖项。

示例

```
<bean id="b" class="org.sssit.B"></bean>
<bean id="a" class="org.sssit.A" autowire="no"></bean>
```



# Spring Dependency注入

## 在Spring中使用工厂方法进行依赖注入

Spring框架提供了使用工厂方法来注入bean的便利。为此，我们可以使用bean元素的两个属性。

**factory-method:** 表示将被调用以注入bean的工厂方法。**factory-bean:** 表示将调用工厂方法的bean的引用。如果工厂方法是非静态的，则使用它。

一种返回类实例的方法称为 **factory-method**。

示例

```
public class A {
public static A getA(){//factory method
    return new A();
}
}
```

## factory-method类型

可以有三种类型的factory-method:

1)返回的 **静态工厂方法** **自己的**类的实例。用于单例设计模式。

示例

```
<bean id="a" class="com.nhooo.A" factory-method="getA"></bean>
```

2)一种 **静态工厂方法**，它返回 **另一个**类的实例。所使用的实例未知，并在运行时决定。

示例

```
<bean id="b" class="com.nhooo.A" factory-method="getB"></bean>
```

3)一种 **非静态工厂**方法，该方法返回 **另一个**类的实例。所使用的实例未知，并在运行时决定。

示例

```
<bean id="a" class="com.nhooo.A"></bean>
<bean id="b" class="com.nhooo.A" factory-method="getB" factory-bean="a"></bean>
```

------

## 类型1

让我们看一下用静态工厂方法注入依赖项的简单代码。

示例

```
<bean id="a" class="com.nhooo.A" factory-method="getA"></bean>
```

让我们看一下完整的示例，以在Spring使用工厂方法注入依赖项。为了创建此示例，我们创建了3个文件。

**A.java****applicationContext.xml****Test.java**

**A.java**

此类是单例类。

示例

```
package com.nhooo;
public class A {
private static final A obj=new A();
private A(){System.out.println("private constructor");}
public static A getA(){
    System.out.println("factory method ");
    return obj;
}
public void msg(){
    System.out.println("hello user");
}
}
```

**applicationContext.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="a" class="com.nhooo.A" factory-method="getA"></bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用msg方法。

示例

```
package org.sssit;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class Test {
public static void main(String[] args) {
    ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
    A a=(A)context.getBean("a");
    a.msg();
}
}
```

输出:

示例

```
private constructor
factory method
hello user
```

------

## 类型2

让我们看一下通过静态工厂方法注入依赖关系的简单代码，该方法返回另一个类的实例。

要创建在此示例中，我们创建了6个文件。

**Printable.java****A.java****B.java****PrintableFactory.java****applicationContext.xml****Test.java**

**Printable.java**

示例

```
package com.nhooo;
public interface Printable {
void print();
}
```

**A.java**

示例

```
package com.nhooo;
public class A implements Printable{
    @Override
    public void print() {
        System.out.println("hello a");
    }
}
```

**B.java**

示例

```
package com.nhooo;
public class B implements Printable{
    @Override
    public void print() {
        System.out.println("hello b");
    }
}
```

**PrintableFactory.java**

示例

```
package com.nhooo;
public class PrintableFactory {
    public static Printable getPrintable(){
        //return new B();
              return new A();//返回任意一个实例，A或B
    }
}
```

**applicationContext.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="p" class="com.nhooo.PrintableFactory" factory-method="getPrintable"></bean>
</beans>
```

**Test.java**

此类从applicationContext.xml文件获取Bean并调用print()方法。

示例

```
package org.sssit;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class Test {
public static void main(String[] args) {
    ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
    Printable p=(Printable)context.getBean("p");
    p.print();
}
}
```

输出:

示例

```
hello a
```

------

## 类型3

让我们看一下通过非静态工厂方法注入依赖关系的示例，该方法返回另一个类的实例。

To创建这个示例，我们已经创建了6个文件。

**Printable.java****A.java****B.java****PrintableFactory.java****applicationContext.xml****Test.java**

所有文件都与以前的文件相同，您只需更改两个文件: PrintableFactory和applicationContext.xml。

**PrintableFactory.java**

示例

```
package com.nhooo;
public class PrintableFactory {
    //非静态工厂法
    public Printable getPrintable(){
        return new A();//返回任何一个实例，A或B
    }
}
```

**applicationContext.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
    xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="pfactory" class="com.nhooo.PrintableFactory"></bean>
<bean id="p" class="com.nhooo.PrintableFactory" factory-method="getPrintable" 
factory-bean="pfactory"></bean>
</beans>
```

输出:

示例

```
hello a
```



# Spring AOP

**Aspect Oriented Programming**(AOP)从某种意义上说是对OOP的补充，因为它还提供了模块化的功能。但是模块化的关键单元是方面而不是类。

AOP将程序逻辑分为不同的部分(称为关注点)。它用于通过 **跨领域关注点**来提高模块化。

**cross-cutting concerns**是一个会影响整个应用程序的关注点，应该尽可能集中在一个位置的代码中，例如事务管理，身份验证，日志记录，安全性等。

------

为什么使用AOP？

它提供了一种可插拔的方式，可以在实际逻辑之前，之后或周围动态添加附加关注点。假设一个类中有10个方法，如下所示:

示例

```
class A{
public void m1(){...}
public void m2(){...}
public void m3(){...}
public void m4(){...}
public void m5(){...}
public void n1(){...}
public void n2(){...}
public void p1(){...}
public void p2(){...}
public void p3(){...}
}
```

从m开始有5种方法，从n开始有2种方法，从p开始有3种方法。

**了解情况**我必须维护日志并发送

**没有AOP的问题**我们可以从m开头的方法中调用方法(维护日志并发送通知)。在这种情况下，我们需要使用所有5种方法编写代码。

但是，如果客户以后说，我不必发送通知，则需要更改所有方法。这会导致维护问题。

**AOP解决方案**我们不必从方法中调用方法。现在，我们可以在类的方法中定义其他关注点，例如维护日志，发送通知等。它的条目在xml文件中给出。

将来，如果客户说要删除通知程序功能，我们只需要在xml文件中进行更改。因此，在AOP中维护很容易。

## 在哪里使用AOP？

在以下情况下主要使用AOP:

提供声明式企业服务，例如声明式事务管理。它允许用户实现自定义aspects。

## AOP概念和术语

AOP概念和术语如下:

Join pointAdvicePointcutIntroductionTarget ObjectAspectInterceptorAOP ProxyWeaving

### Join point

Join point是程序中的任何点，例如方法执行，异常处理，字段访问等。Spring仅支持方法执行Join point。

### Advice

Advice表示方面在特定的Join point处采取的操作。有不同类型的Advice:

**Before Advice:** 它在Join point之前执行。**After Returning Advice:** 在联合点正常完成后执行。**After Throwing Advice:** 如果方法因引发异常而退出，则执行。**After (finally) Advice:** 无论Join point退出是正常返回还是异常返回，它都会在Join point之后执行。**Around Advice:** 它在Join point之前和之后执行。

### Pointcut

它是AOP的一种表达语言，它与Join point相匹配。

### Introduction

这意味着引入类型的其他方法和字段。它允许您向任何建议对象引入新的界面。

### Target Object

这是一个或多个方面建议的对象。在Spring，它也被称为代理对象，因为Spring AOP是使用运行时代理实现的。

### Aspect

这是一个包含建议，Join point等的类。

### Interceptor

这是一个仅包含一个建议的方面。

### AOP Proxy

它用于实现由AOP框架创建的方面合同。在Spring框架中它将是JDK动态代理或CGLIB代理。

### Weaving

这是将方面与其他应用程序类型或对象链接在一起以创建建议对象的过程。编织可以在编译时，加载时或运行时完成。 Spring AOP在运行时执行编织。

### AOP实现

AOP实现由以下提供:

AspectJSpringAOPJBoss AOP

### Spring AOP

Spring AOP可以通过以下三种方式使用。但是广泛使用的方法是Spring AspectJ注释样式。下面给出了使用Spring AOP的3种方法:

采用Spring1.2旧样式(基于dtd)(在Spring3中也受支持)通过AspectJ注释样式通过Spring XML配置样式(基于模式)





# Spring Java Mail

Spring框架提供了许多用于发送和接收邮件的有用接口和类。

**org.springframework.mail** 软件包是在Spring框架中提供邮件支持的根软件包。

## Spring Java Mail API

spring框架中Java邮件支持的接口和类如下:

![带有javamail api层次结构的Spring](https://www.cainiaojc.com/static/upload/210424/0835580.jpg)**MailSender接口**: 它是根接口。它提供了发送简单邮件的基本功能。**JavaMailSender接口**: 它是MailSender的子接口。它支持MIME消息。它主要与 **MimeMessageHelper** 类一起使用，以创建JavaMail **MimeMessage** ，以及附件等。spring框架推荐使用 **MimeMessagePreparator** 机制来使用此接口。**JavaMailSenderImpl类**: 它提供JavaMailSender接口的实现。它支持JavaMail MimeMessages和Spring SimpleMailMessages。**SimpleMailMessage类**: 用于创建简单的邮件，包括从，到，抄送，主题和文本邮件。**MimeMessagePreparator接口**: 它是用于准备JavaMail MIME消息的回调接口。**MimeMessageHelper类**: 它是用于创建MIME消息的帮助器类。它支持内联元素，例如图像，典型的邮件附件和HTML文本内容。

### 通过Gmail服务器在Spring中发送邮件的示例

使用两个Spring邮件类:

**SimpleMailMessage** 用于创建消息。**JavaMailSenderImpl** 用于发送消息。

您需要创建以下文件以通过Spring框架发送电子邮件。

**MailMail.java****applicationContext.xml****Test.java**您需要加载mail.jar和activation.jar文件才能运行此示例。

下载mail.jar和Activation.jar 或访问Oracle网站以下载最新版本。

------

**1)MailMail.java**

这是定义mailSender属性的简单类。在运行时将向该属性提供MailSender对象。

在sendMail()方法中，我们正在创建SimpleMailMessage的实例，并将信息(例如，从，到，主题和消息)存储到该对象中。

这里使用MailSender接口的send()方法发送简单邮件。

示例

```
package com.nhooo;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
 
public class MailMail{
  private MailSender mailSender;
 
  public void setMailSender(MailSender mailSender) {
    this.mailSender = mailSender;
  }
 
  public void sendMail(String from, String to, String subject, String msg) {
        //creating message
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(to);
    message.setSubject(subject);
    message.setText(msg);
        //sending message
    mailSender.send(message); 
  }
}
```

------

**2)applicationContext.xml**

在此xml文件中，我们为JavaMailSenderImpl类创建了一个bean。我们需要定义以下属性的值:

主机用户名密码javaMailProperties

我们还将使用mailSender属性为MailMail类创建bean。现在，将在MailMail类的mailSender属性中设置JavaMailSenderImpl类的实例。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
  xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:p="http://www.springframework.org/schema/p"
  xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="mailSender" class="org.springframework.mail.javamail.JavaMailSenderImpl">
  <property name="host" value="smtp.gmail.com" />
  <property name="username" value="yourgmailid@gmail.com" />
  <property name="password" value="yourgmailpassword" />
  <property name="javaMailProperties">
     <props>
              <prop key="mail.smtp.auth">true</prop>
              <prop key="mail.smtp.socketFactory.port">465</prop>
              <prop key="mail.smtp.socketFactory.class">javax.net.ssl.SSLSocketFactory</prop>
              <prop key="mail.smtp.port">465</prop>
        </props>
  </property>
</bean>
<bean id="mailMail" class="com.nhooo.MailMail">
  <property name="mailSender" ref="mailSender" />
</bean>
</beans>
```

------

**3)Test.java**

该类从applicationContext.xml文件获取mailMail的bean，并调用MailMail类的sendMail方法。

示例

```
package com.nhooo;
import org.springframework.beans.factory.*;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.*;
public class Test { 
public static void main(String[] args) {
  
Resource r=new ClassPathResource("applicationContext.xml");
BeanFactory b=new XmlBeanFactory(r);
MailMail m=(MailMail)b.getBean("mailMail");
String sender="sendergmailid@gmail.com";//write here sender gmail id
String receiver="receiveremailid@gmail.com";//write here receiver id
m.sendMail(sender,receiver,"hi","welcome");
  
System.out.println("success");
}
}
```

### 如何运行此示例

为core和Java邮件加载spring jar文件加载mail.jar和activation.jar在applicationContext.xml文件中更改用户名和密码属性，并指定您的gmail ID和密码。在Test.java文件中更改发件人gmail ID和Receivermail ID。编译并运行Test类

------

### 由主机提供商提供的服务器在Spring中发送邮件的示例

如果您有自己的站点，则可以使用邮件服务器。 MailMail.java和Test类将相同。您只需要在Test.java文件中更改发件人电子邮件ID。在applicationContext.xml文件中需要进行一些更改。

在applicationContext.xml文件中，我们正在使用:

mail.unitedsquaad.com作为主机名。更改它。a@unitedsquaad.com作为用户名。更改它。xxxxx作为密码。更改它。

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans
  xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:p="http://www.springframework.org/schema/p"
  xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
<bean id="mailSender" class="org.springframework.mail.javamail.JavaMailSenderImpl">
  <property name="host" value="mail.unitedsquaad.com" />
  <property name="username" value="a@unitedsquaad.com" />
  <property name="password" value="xxxxx" />
 
  <property name="javaMailProperties">
     <props>
              <prop key="mail.smtp.auth">true</prop>
           </props>
  </property>
</bean>
<bean id="mailMail" class="MailMail">
  <property name="mailSender" ref="mailSender" />
</bean>
 
</beans>
```

------

### 将邮件发送到多个收件人

您可以借助SimpleMailMessage类将邮件发送到多个收件人。 SimpleMailMessage类的 **setTo(String []接收者)**方法用于将消息发送到多个接收者。让我们看一下简单的代码。

示例

```
      ....
  public void sendMail(String from, String[] to, String subject, String msg) {
        //creating message
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(to);//passing array of recipients
    message.setSubject(subject);
    message.setText(msg);
        //sending message
    mailSender.send(message); 
  }
     ...
```

------

### Spring MimeMessagePreparator示例

我们可以借助MimeMessagePreparator接口发送mime消息。它有一个方法prepare(MimeMessage message)。

让我们看一下发送mime消息的简单代码。

示例

```
  import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
public class MailMail{
  private JavaMailSender mailSender;
 
  public void setMailSender(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }
 
  public void sendMail(final String from, final String to,final String subject,final String msg) {
      
    MimeMessagePreparator messagePreparator = new MimeMessagePreparator() {
          
                public void prepare(MimeMessage mimeMessage) throws Exception {
                   mimeMessage.setRecipient(Message.RecipientType.TO,new InternetAddress(to));
                   mimeMessage.setFrom(new InternetAddress(from));
                   mimeMessage.setSubject(subject);
                   mimeMessage.setText(msg);
                }
        };
        mailSender.send(messagePreparator);
  }
}
```

applicationContext.xml和Test.java文件与上面给出的相同。

------

### 通过Spring MimeMessageHelper示例发送附件

我们可以在MimeMessageHelper类的帮助下在Spring发送带有附件的mime消息。推荐使用MimeMessagePreparator。

让我们看一下发送带有附件(图像)的mime消息的简单代码。

示例

```
import java.io.File;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
public class MailMail{
  private JavaMailSender mailSender;
 
  public void setMailSender(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }
 
  public void sendMail(final String from, final String to,final String subject,final String msg) {
    try{
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setFrom(from);
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(msg);
    // attach the file
    FileSystemResource file = new FileSystemResource(new File("c:/rr.jpg"));
    helper.addAttachment("mybrothermage.jpg", file);//image will be sent by this name
    mailSender.send(message);
    }catch(MessagingException e){e.printStackTrace();}
  }
}
```

applicationContext.xml和Test.java文件与上面给出的相同。





# Spring security功能

LDAP（轻型目录访问协议）单点登录JAAS（Java身份验证和授权服务）LoginModule基本访问身份验证摘要访问身份验证记住我Web表单身份验证授权软件本地化HTTP授权

### LDAP (Lightweight Directory Access Protocol)

这是一个开放应用程序协议，用于通过Internet协议维护和访问分布式目录信息服务。

### Single sign-on

此功能允许用户在单个帐户(用户名和密码)的帮助下访问多个应用程序。

### JAAS (Java Authentication and Authorization Service) LoginModule

这是用Java实现的可插拔身份验证模块。 Spring Security支持它的身份验证过程。

### Basic Access Authentication

Spring Security支持基本访问身份验证，该基本访问身份验证用于在请求时提供用户名和密码。

### Digest Access Authentication

此功能使我们可以使身份验证过程比基本访问身份验证更安全。它要求浏览器在通过网络发送敏感数据之前确认用户的身份。

### Remember-me

Spring Security在帮助下支持此功能。 HTTP Cookies。它会记住用户的信息，避免在用户注销之前从同一台计算机再次登录。

### Web Form Authentication

在此过程中，Web表单会收集并验证用户身份来自网络浏览器的凭据。当我们要实现Web表单身份验证时，Spring Security支持它。

### Authorization

Spring Security提供了此功能，可以在访问资源之前授权用户。它允许开发人员针对资源定义访问策略。

### Software Localization

此功能允许我们使用任何语言制作应用程序用户界面。

### HTTP Authorization

Spring使用Apache Ant路径或正则表达式为Web请求URL的HTTP授权提供了此功能。

------

## Spring Security 5.0中添加的功能

### OAuth 2.0登录

此功能为用户提供了登录所需的功能通过使用他们在GitHub或Google上的现有帐户来应用程序。此功能是通过使用OAuth 2.0授权框架中指定的授权代码授予来实现的。

### 响应式支持

从Spring Security 5.0版本开始，它提供了响应式甚至可以与Spring WebFlux集成。

### 现代化的密码编码

Spring Security 5.0引入了新的密码编码器 **DelegatingPasswordEncoder** ，它可以更现代化地解决以前的编码器 **NoOpPasswordEncoder** 的所有问题。



# Spring security模块

在Spring Security 3.0中，"安全性"模块分为单独的jar文件。目的是根据jar文件的功能进行划分，以便开发人员可以根据其要求进行集成。

这还有助于将所需的依赖项设置为maven项目的pom.xml文件。

以下是Spring Security模块中包含的jar文件。

spring-security-core.jarspring-security-remoting.jarspring-security-web.jarspring-security-config.jarspring-security-ldap.jarspring-security-oauth2-core.jarspring-security-oauth2-client.jarspring-security-oauth2-jose.jarspring-security-acl.jarspring-security-cas.jarspring-security-openid.jarspring-security-test.jar

## 核心-spring-security-core.jar

这是核心jar文件，对于每个想要使用Spring Security的应用程序都是必需的。此jar文件包含核心访问控制和核心身份验证类和接口。我们可以在独立应用程序或远程客户端应用程序中使用它。

它包含顶级程序包:

org.springframework.security.coreorg.springframework.security.accessorg.springframework.security.authenticationorg.springframework.security.provisioning

## 远程处理-spring-security-remoting.jar

此jar用于将安全功能集成到Spring远程应用程序中。直到或除非创建远程应用程序，我们才需要它。所有类和接口都位于 **org.springframework.security.remoting** 包中。

## Web-spring-security-web.jar

此jar对于Spring Security Web身份验证和基于URL的访问控制很有用。它包括过滤器和Web安全基础结构。

所有类和接口都位于 **org.springframework.security.web** 包中。

## 配置-spring-security-config.jar

对于同时使用XML和Java进行Spring Security配置，此jar文件是必需的。它包括Java配置代码和安全名称空间解析代码。所有类和接口均存储在 **org.springframework.security.config** 包中。

## LDAP-spring-security-ldap.jar

仅当我们要使用LDAP(轻型目录访问协议)时才需要此jar文件。它包括身份验证和配置代码。所有类和接口都存储在 **org.springframework.security.ldap** 包中。

## OAuth 2.0核心-spring-security-oauth2-core.jar

需要此jar才能将Oauth 2.0授权框架和OpenID Connect Core 1.0集成到应用程序中。该jar文件包含OAuth 2.0的核心类，并且这些类存储在 **org.springframework.security.oauth2.core** 包中。

## OAuth 2.0客户端- spring-security-oauth2-client.jar

此jar文件是获得OAuth 2.0授权框架和OpenID Connect Core 1.0的客户端支持所必需的。该模块提供OAuth登录和OpenID客户端支持。所有类和接口均可从 **org.springframework.security.oauth2.client** 包中获得。

## OAuth 2.0 JOSE-spring-security-oauth2-jose。 jar

它为JOSE(Javascript对象签名和加密)框架提供Spring Security的支持。 JOSE框架提供了在客户端之间建立安全连接的方法。它包含以下规范集合:

JWT(JSON 网络令牌)JWS(JSON Web签名)JWE(JSON Web加密)JWK(JSON Web密钥)

所有类和接口都可用于这两个软件包:

**org.springframework.security.oauth2.jwt** 和 **org.springframework。 security.oauth2.jose。**

## ACL-spring-security-acl.jar

此jar用于将安全性应用于应用程序中的域对象。我们可以从 **org.springframework.security.acls** 包中访问类和代码。

## CAS-spring-security-cas.jar

Spring Security的CAS客户端集成是必需的。我们可以使用它来将Spring Security Web身份验证与CAS单一登录服务器集成在一起。源代码位于 **org.springframework.security.cas** 包中。

## OpenID-spring-security-openid.jar

此jar用于OpenID Web身份验证支持。我们可以使用它来针对外部OpenID服务器对用户进行身份验证。它要求使用OpenID4Java，顶级软件包为 **org.springframework.security.openid** 。

## 测试-spring-security-test.jar

此jar为测试Spring Security应用程序提供了支持。



### 控制器

**HomeController。 Java**

示例

```
package com.nhooo.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
public class HomeController {
    
    @RequestMapping(value="/", method=RequestMethod.GET)
    public String home() {
        return "home";
    }
    
    @RequestMapping(value="/admin", method=RequestMethod.GET)
    public String privateHome() {
        return "privatePage";
    }
}
```

### Spring security配置

**spring-security.xml**

示例

```
<beans:beans xmlns="http://www.springframework.org/schema/security"
    xmlns:beans="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/security
    http://www.springframework.org/schema/security/spring-security.xsd">
    <http auto-config="true">
        <intercept-url pattern="/admin" access="hasRole('ROLE_ADMIN')" />
    </http>
    <authentication-manager>
      <authentication-provider>
        <user-service>
        <user name="admin" password="1234" authorities="hasRole(ROLE_ADMIN)" />
        </user-service>
      </authentication-provider>
    </authentication-manager>
</beans:beans>
```

### Servlet调度程序

**spring-servlet.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:mvc="http://www.springframework.org/schema/mvc"
xmlns:context="http://www.springframework.org/schema/context"
xsi:schemaLocation="
http://www.springframework.org/schema/mvc
http://www.springframework.org/schema/mvc/spring-mvc.xsd
http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context 
http://www.springframework.org/schema/context/spring-context.xsd">
<mvc:annotation-driven />
   <context:component-scan base-package="com.nhooo.controller">
   </context:component-scan>
   <context:annotation-config></context:annotation-config>
   <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
      <property name="prefix" value="/WEB-INF/views/"></property>
      <property name="suffix" value=".jsp"></property>
   </bean>
</beans>
```

### Web描述符

**web.xml**

示例

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xml>
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
        
        <!-- Spring Configuration -->
        <servlet>
            <servlet-name>spring</servlet-name>
            <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet-mapping>
            <servlet-name>spring</servlet-name>
            <url-pattern>/</url-pattern>
        </servlet-mapping>
        
        <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    
    <filter>
        <filter-name>springSecurityFilterChain</filter-name>
        <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>springSecurityFilterChain</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
        
        <context-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>
                /WEB-INF/spring-servlet.xml
                /WEB-INF/spring-security.xml
            </param-value>
        </context-param>
</web-app>
```

### 项目依赖项

**pom.xml**

示例

```
<project xmlns="http://maven.apache.org/POM/4.0.0" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.nhooo</groupId>
  <artifactId>springsecurity</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>war</packaging>   
<properties>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.source>1.8</maven.compiler.source>
</properties>
<dependencies>
  <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>
        <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-web</artifactId>
        <version>5.0.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-core</artifactId>
        <version>5.0.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-config</artifactId>
        <version>5.0.0.RELEASE</version>
    </dependency>
        
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-war-plugin</artifactId>
            <version>2.6</version>
            <configuration>
                <failOnMissingWebXml>false</failOnMissingWebXml>
            </configuration>
        </plugin>
    </plugins>
</build>
</project>
```

### 查看页面

**home.jsp**

示例

```
<html>
<head>
<meta content="text/html; charset=UTF-8">
<title>Home</title>
</head>
<body>
<h2>Welcome to Nhooo spring tutorial!</h2>
</body>
</html>
```

### privatePage.jsp

**home.jsp**

示例

```
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Admin</title>
</head>
<body>
Hello Admin
</body>
</html>
```

输出

此示例使用Apache Tomcat v9.0执行。运行后，它会向浏览器产生以下输出。

最初，它将呈现 **home.jsp** 页面，其中显示以下输出。

如果我们在管理页面中输入/ **admin** ，则会在管理页面中添加spring security。浏览器，应用程序将产生以下输出。

**请求URL: http: //localhost: 8080/springsecurity/admin**   要输入密码



# Spring security配置项目

Spring Framework在Spring 3.1中添加了Java配置支持。在Spring Security中，Java配置已添加到Spring Security 3.2中，使我们可以配置Spring Security **而无需编写XML单行。**

在这里，我们将创建一个实现Spring的示例。安全性且未使用XML进行配置。它包括以下步骤。

### 步骤1

第一步是创建Spring Security Java配置。下面给出了一个简单的基本Java配置。

**WebSecurityConfig.java**

示例

```
package com.nhooo;
import org.springframework.context.annotation.*;
//import org.springframework.security.config.annotation.authentication.builders.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@EnableWebSecurity
@ComponentScan("com.nhooo")
public class WebSecurityConfig implements WebMvcConfigurer {
    
    @Bean
    public UserDetailsService userDetailsService() throws Exception {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withDefaultPasswordEncoder().username("Nhooo").
        password("java123").roles("USER").build());
        return manager;
    }
    
    protected void configure(HttpSecurity http) throws Exception {
                
        http
        .antMatcher("/")                               
        .authorizeRequests()
            .anyRequest().hasRole("ADMIN")
            .and()
        .httpBasic();
    }
}
```

此配置创建一个称为 **springSecurityFilterChain** 的Servlet过滤器。 **负责**保护应用程序URL，验证提交的用户名和密码，重定向到登录表单等。

上述Java配置为我们的应用程序执行以下操作。

要求对每个URL进行身份验证创建登录表单允许用户使用基于表单的身份验证进行身份验证允许注销防止CSRF攻击安全标题集成等

### 步骤2

现在，我们将向战争注册 **springSecurityFilterChain** 。要进行注册，Spring Security提供了我们需要扩展的基类AbstractSecurityWebApplicationInitializer。

对于Spring MVC应用程序，SecurityWebApplicationInitializer如下所示。

**SecurityWebApplicationInitializer.java**

示例

```
package com.nhooo;
import org.springframework.security.web.context.*;
public class SecurityWebApplicationInitializer
    extends AbstractSecurityWebApplicationInitializer {
}
```

此代码将为我们应用程序中的每个URL注册springSecurityFilterChain。

### 步骤3

现在，将WebSecurityConfig加载到我们现有的ApplicationInitializer中并添加到getRootConfigClasses()方法。

**MvcWebApplicationInitializer.java**

示例

```
package com.nhooo;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
public class MvcWebApplicationInitializer extends
        AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[] { WebSecurityConfig.class };
    }
    @Override
    protected Class<?>[] getServletConfigClasses() {
        // TOdo Auto-generated method stub
        return null;
    }
    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }
}
```

### 步骤4

**WebSecurityConfigurerAdapter** 类提供了一个configure(HttpSecurity http)方法，该方法包含以下默认配置。默认定义如下所示。

示例

```
protected void configure(HttpSecurity http) throws Exception {
http
.authorizeRequests()
.anyRequest().authenticated()
.and()
.formLogin()
.and()
.httpBasic();
}
```

它类似于给定的XML。

示例

```
<http>
<intercept-url pattern="/**" access="authenticated"/>
<form-login />
<http-basic />
</http>
```

此方法执行以下操作。

它确保用户提出的每个请求都要求对用户进行身份验证它允许用户使用基于表单的登录进行身份验证它允许用户使用HTTP Basic身份验证进行身份验证

### 第5步

创建一个控制器来处理用户请求。

**HomeController.java**

示例

```
package com.nhooo.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
public class HomeController {
    
    @RequestMapping(value="/", method=RequestMethod.GET)
    public String index() {
        
        return "index";
    }
}
```

我们有一个视图(.jsp)页面 **index.jsp** ，其中包含以下源代码。

示例

```
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Home Page</title>
</head>
<body>
Welcome to home page!
</body>
</html>
```



# Spring Security登录-注销模块示例

Spring Security提供了我们可以在应用程序中使用的登录和注销功能。创建安全的Spring应用程序很有帮助。

在这里，我们正在使用Spring Security创建一个Spring MVC应用程序，并实现登录和注销功能。

首先，我们创建了一个maven项目，并在pom.xml文件中提供了以下项目依赖项。

### 项目依赖项

示例

```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.nhooo</groupId>
  <artifactId>springSecurityLoginOut</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>war</packaging>
  <properties>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.source>1.8</maven.compiler.source>
</properties>
<dependencies>
  <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>
        <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-web</artifactId>
        <version>5.0.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-core</artifactId>
        <version>5.0.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-config</artifactId>
        <version>5.0.0.RELEASE</version>
    </dependency>
    
        <!-- https://mvnrepository.com/artifact/javax.servlet/javax.servlet-api -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
</dependencies>
  <build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-war-plugin</artifactId>
            <version>2.6</version>
            <configuration>
                <failOnMissingWebXml>false</failOnMissingWebXml>
            </configuration>
        </plugin>
    </plugins>
</build>
</project>
```

### Spring security配置

此后，我们创建了配置文件以启用登录功能并仅允许授权用户访问。

该项目包含以下四个Java文件。

**AppConfig.java**

示例

```
package com.nhooo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;
@EnableWebMvc
@Configuration
@ComponentScan({ "com.nhooo.controller.*" })
public class AppConfig {
    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver
                          = new InternalResourceViewResolver();
        viewResolver.setViewClass(JstlView.class);
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
}
```

**MvcWebApplicationInitializer.java**

示例

```
package com.nhooo;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
public class MvcWebApplicationInitializer extends
        AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[] { WebSecurityConfig.class };
    }
    @Override
    protected Class<?>[] getServletConfigClasses() {
        // TOdo Auto-generated method stub
        return null;
    }
    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }
}
```

**SecurityWebApplicationInitializer.java**

示例

```
package com.nhooo;
import org.springframework.security.web.context.*;
public class SecurityWebApplicationInitializer
    extends AbstractSecurityWebApplicationInitializer {
}
```

**WebSecurityConfig.java**

示例

```
package com.nhooo;
import org.springframework.context.annotation.*;
//import org.springframework.security.config.annotation.authentication.builders.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@EnableWebSecurity
@ComponentScan("com.nhooo")
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withDefaultPasswordEncoder()
        .username("irfan").password("khan").roles("ADMIN").build());
        return manager;
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
                
        http                            
        .authorizeRequests()
            .anyRequest().hasRole("ADMIN")
            .and().formLogin().and()
        .httpBasic()
        .and()
        .logout()
        .logoutUrl("/j_spring_security_logout")
        .logoutSuccessUrl("/")
        ;
    }
}
```

### 控制器

**HomeController:** 处理用户请求的控制器。

示例

```
package com.nhooo.controller;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
public class HomeController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "index";
    }
    
    @RequestMapping(value="/logout", method=RequestMethod.GET)
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null){    
           new SecurityContextLogoutHandler().logout(request, response, auth);
        }
         return "redirect:/";
     }
}
```

### 视图

我们有一个JSP文件 **index.jsp** ，其中包含以下代码。

示例

```
<%@ page language="java" contentType="text/html; charset=UTF-8"pageEncoding="UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html public "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Home</title>
</head>
<body>
<h3> Hello ${pageContext.request.userPrincipal.name}, </h3>
<h4>Welcome to Nhooo! </h4>
<a href="<c:url value='/logout' />">Click here to logout</a>
</body>
</html>
```











# Spring 面试

## 什么是Spring？

Spring是一个开源的Java EE开发框架。Spring框架的核心功能可以应用在任何Java应用程序中，但对Java EE平台上的Web应用程序有更好的扩展性。Spring框架的目标是使得Java EE应用程序的开发更加简捷，通过使用POJO为基础的编程模型促进良好的编程风格。

## Spring有哪些优点？

轻量级：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB。

控制反转(IOC)：Spring使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象。

面向切面编程(AOP)： Spring支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来。

容器：Spring包含并管理应用程序对象的配置及生命周期。

MVC框架：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架。

事务管理：Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口。

异常处理：Spring提供一个方便的API将特定技术的异常(由JDBC, Hibernate, 或JDO抛出)转化为一致的、Unchecked异常。

## Spring 事务实现方式

- 编程式事务管理：这意味着你可以通过编程的方式管理事务，这种方式带来了很大的灵活性，但很难维护。
- 声明式事务管理：这种方式意味着你可以将事务管理和业务代码分离。你只需要通过注解或者XML配置管理事务。

## Spring框架的事务管理有哪些优点

- 它为不同的事务API(如JTA, JDBC, Hibernate, JPA, 和JDO)提供了统一的编程模型。
- 它为编程式事务管理提供了一个简单的API而非一系列复杂的事务API(如JTA).
- 它支持声明式事务管理。
- 它可以和Spring 的多种数据访问技术很好的融合。

## spring事务定义的传播规则

- PROPAGATION_REQUIRED: 支持当前事务，如果当前没有事务，就新建一个事务。这是最常见的选择。
- PROPAGATION_SUPPORTS: 支持当前事务，如果当前没有事务，就以非事务方式执行。
- PROPAGATION_MANDATORY: 支持当前事务，如果当前没有事务，就抛出异常。
- PROPAGATION_REQUIRES_NEW: 新建事务，如果当前存在事务，把当前事务挂起。
- PROPAGATION_NOT_SUPPORTED: 以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
- PROPAGATION_NEVER: 以非事务方式执行，如果当前存在事务，则抛出异常。
- PROPAGATION_NESTED: 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则进行与PROPAGATION_REQUIRED类似的操作。

## Spring 事务底层原理

- 划分处理单元——IoC

由于spring解决的问题是对单个数据库进行局部事务处理的，具体的实现首先用spring中的IoC划分了事务处理单元。并且将对事务的各种配置放到了ioc容器中（设置事务管理器，设置事务的传播特性及隔离机制）。

- AOP拦截需要进行事务处理的类

Spring事务处理模块是通过AOP功能来实现声明式事务处理的，具体操作（比如事务实行的配置和读取，事务对象的抽象），用TransactionProxyFactoryBean接口来使用AOP功能，生成proxy代理对象，通过TransactionInterceptor完成对代理方法的拦截，将事务处理的功能编织到拦截的方法中。读取ioc容器事务配置属性，转化为spring事务处理需要的内部数据结构（TransactionAttributeSourceAdvisor），转化为TransactionAttribute表示的数据对象。

- 对事务处理实现（事务的生成、提交、回滚、挂起）

spring委托给具体的事务处理器实现。实现了一个抽象和适配。适配的具体事务处理器：DataSource数据源支持、hibernate数据源事务处理支持、JDO数据源事务处理支持，JPA、JTA数据源事务处理支持。这些支持都是通过设计PlatformTransactionManager、AbstractPlatforTransaction一系列事务处理的支持。 为常用数据源支持提供了一系列的TransactionManager。

- 结合

PlatformTransactionManager实现了TransactionInterception接口，让其与TransactionProxyFactoryBean结合起来，形成一个Spring声明式事务处理的设计体系。

## 有没有遇到过Spring事务失效的情况？在什么情况下Spring的事务是失效的？

参考：[面试必备技能：JDK动态代理给Spring事务埋下的坑！](https://mp.weixin.qq.com/s?__biz=MzI1NDQ3MjQxNA==&mid=2247484940&idx=1&sn=0a0a7198e96f57d610d3421b19573002&chksm=e9c5ffbddeb276ab64ff3b3efde003193902c69acda797fdc04124f6c2a786255d58817b5a5c&scene=21#wechat_redirect)

## Spring MVC 运行流程

第一步：发起请求到前端控制器(DispatcherServlet)

第二步：前端控制器请求HandlerMapping查找 Handler（ 可以根据xml配置、注解进行查找）

第三步：处理器映射器HandlerMapping向前端控制器返回Handler

第四步：前端控制器调用处理器适配器去执行Handler

第五步：处理器适配器去执行Handler

第六步：Handler执行完成给适配器返回ModelAndView

第七步：处理器适配器向前端控制器返回ModelAndView（ModelAndView是springmvc框架的一个底层对象，包括Model和view）

第八步：前端控制器请求视图解析器去进行视图解析（根据逻辑视图名解析成真正的视图(jsp)）

第九步：视图解析器向前端控制器返回View

第十步：前端控制器进行视图渲染（ 视图渲染将模型数据(在ModelAndView对象中)填充到request域）

第十一步：前端控制器向用户响应结果

## BeanFactory和ApplicationContext有什么区别？

ApplicationContext提供了一种解决文档信息的方法，一种加载文件资源的方式(如图片)，他们可以向监听他们的beans发送消息。另外，容器或者容器中beans的操作，这些必须以bean工厂的编程方式处理的操作可以在应用上下文中以声明的方式处理。应用上下文实现了MessageSource，该接口用于获取本地消息，实际的实现是可选的。

相同点：两者都是通过xml配置文件加载bean,ApplicationContext和BeanFacotry相比,提供了更多的扩展功能。

不同点：BeanFactory是延迟加载,如果Bean的某一个属性没有注入，BeanFacotry加载后，直至第一次使用调用getBean方法才会抛出异常；而ApplicationContext则在初始化自身是检验，这样有利于检查所依赖属性是否注入；所以通常情况下我们选择使用ApplicationContext。

## 什么是Spring Beans？

Spring Beans是构成Spring应用核心的Java对象。这些对象由Spring IOC容器实例化、组装、管理。这些对象通过容器中配置的元数据创建，例如，使用XML文件中定义的创建。

在Spring中创建的beans都是单例的beans。在bean标签中有一个属性为”singleton”,如果设为true，该bean是单例的，如果设为false，该bean是原型bean。Singleton属性默认设置为true。因此，spring框架中所有的bean都默认为单例bean。

## 说一下Spring中支持的bean作用域

Spring框架支持如下五种不同的作用域：

- singleton：在Spring IOC容器中仅存在一个Bean实例，Bean以单实例的方式存在。
- prototype：一个bean可以定义多个实例。
- request：每次HTTP请求都会创建一个新的Bean。该作用域仅适用于WebApplicationContext环境。
- session：一个HTTP Session定义一个Bean。该作用域仅适用于WebApplicationContext环境。
- globalSession：同一个全局HTTP Session定义一个Bean。该作用域同样仅适用于WebApplicationContext环境。

bean默认的scope属性是”singleton”。

## Spring 的单例实现原理

Spring框架对单例的支持是采用单例注册表的方式进行实现的，而这个注册表的缓存是HashMap对象，如果配置文件中的配置信息不要求使用单例，Spring会采用新建实例的方式返回对象实例。

## 解释Spring框架中bean的生命周期

ApplicationContext容器中，Bean的生命周期流程如上图所示，流程大致如下：

![Spring框架中bean的生命周期](https://static.bookstack.cn/projects/java_interview_manual/images/687474703a2f2f7374617469632e7a7962756c756f2e636f6d2f686f6d6973732f75726e75686337656271356a343831656b617875787067652f696d6167655f31626e35326663733376756f31767376316566617171636e31736d2e706e67.png)

1.首先容器启动后，会对scope为singleton且非懒加载的bean进行实例化，

2.按照Bean定义信息配置信息，注入所有的属性，

3.如果Bean实现了BeanNameAware接口，会回调该接口的setBeanName()方法，传入该Bean的id，此时该Bean就获得了自己在配置文件中的id，

4.如果Bean实现了BeanFactoryAware接口,会回调该接口的setBeanFactory()方法，传入该Bean的BeanFactory，这样该Bean就获得了自己所在的BeanFactory，

5.如果Bean实现了ApplicationContextAware接口,会回调该接口的setApplicationContext()方法，传入该Bean的ApplicationContext，这样该Bean就获得了自己所在的ApplicationContext，

6.如果有Bean实现了BeanPostProcessor接口，则会回调该接口的postProcessBeforeInitialzation()方法，

7.如果Bean实现了InitializingBean接口，则会回调该接口的afterPropertiesSet()方法，

8.如果Bean配置了init-method方法，则会执行init-method配置的方法，

9.如果有Bean实现了BeanPostProcessor接口，则会回调该接口的postProcessAfterInitialization()方法，

10.经过流程9之后，就可以正式使用该Bean了,对于scope为singleton的Bean,Spring的ioc容器中会缓存一份该bean的实例，而对于scope为prototype的Bean,每次被调用都会new一个新的对象，期生命周期就交给调用方管理了，不再是Spring容器进行管理了

11.容器关闭后，如果Bean实现了DisposableBean接口，则会回调该接口的destroy()方法，

12.如果Bean配置了destroy-method方法，则会执行destroy-method配置的方法，至此，整个Bean的生命周期结束

## Resource 是如何被查找、加载的？

Resource 接口是 Spring 资源访问策略的抽象，它本身并不提供任何资源访问实现，具体的资源访问由该接口的实现类完成——每个实现类代表一种资源访问策略。 Spring 为 Resource 接口提供了如下实现类：

- UrlResource：访问网络资源的实现类。
- ClassPathResource：访问类加载路径里资源的实现类。
- FileSystemResource：访问文件系统里资源的实现类。
- ServletContextResource：访问相对于 ServletContext 路径里的资源的实现类：
- InputStreamResource：访问输入流资源的实现类。
- ByteArrayResource：访问字节数组资源的实现类。 这些 Resource 实现类，针对不同的的底层资源，提供了相应的资源访问逻辑，并提供便捷的包装，以利于客户端程序的资源访问。

## 解释自动装配的各种模式？

自动装配提供五种不同的模式供Spring容器用来自动装配beans之间的依赖注入:

no：默认的方式是不进行自动装配，通过手工设置ref 属性来进行装配bean。

byName：通过参数名自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byName。之后容器试图匹配、装配和该bean的属性具有相同名字的bean。

byType：通过参数的数据类型自动自动装配，Spring容器查找beans的属性，这些beans在XML配置文件中被设置为byType。之后容器试图匹配和装配和该bean的属性类型一样的bean。如果有多个bean符合条件，则抛出错误。

constructor：这个同byType类似，不过是应用于构造函数的参数。如果在BeanFactory中不是恰好有一个bean与构造函数参数相同类型，则抛出一个严重的错误。

autodetect：如果有默认的构造方法，通过 construct的方式自动装配，否则使用 byType的方式自动装配。

## Spring中的依赖注入是什么？

依赖注入作为控制反转(IOC)的一个层面，可以有多种解释方式。在这个概念中，你不用创建对象而只需要描述如何创建它们。你不必通过代码直接的将组件和服务连接在一起，而是通过配置文件说明哪些组件需要什么服务。之后IOC容器负责衔接。

## 有哪些不同类型的IOC(依赖注入)？

构造器依赖注入：构造器依赖注入在容器触发构造器的时候完成，该构造器有一系列的参数，每个参数代表注入的对象。

Setter方法依赖注入：首先容器会触发一个无参构造函数或无参静态工厂方法实例化对象，之后容器调用bean中的setter方法完成Setter方法依赖注入。

## 你推荐哪种依赖注入？构造器依赖注入还是Setter方法依赖注入？

你可以同时使用两种方式的依赖注入，最好的选择是使用构造器参数实现强制依赖注入，使用setter方法实现可选的依赖关系。

## Spring IOC 如何实现

Spring中的 org.springframework.beans 包和 org.springframework.context包构成了Spring框架IoC容器的基础。

BeanFactory 接口提供了一个先进的配置机制，使得任何类型的对象的配置成为可能。ApplicationContex接口对BeanFactory（是一个子接口）进行了扩展，在BeanFactory的基础上添加了其他功能，比如与Spring的AOP更容易集成，也提供了处理message resource的机制（用于国际化）、事件传播以及应用层的特别配置，比如针对Web应用的WebApplicationContext。

org.springframework.beans.factory.BeanFactory 是Spring IoC容器的具体实现，用来包装和管理前面提到的各种bean。BeanFactory接口是Spring IoC 容器的核心接口。

## Spring IoC容器是什么？

Spring IOC负责创建对象、管理对象(通过依赖注入)、整合对象、配置对象以及管理这些对象的生命周期。

## IoC有什么优点？

IOC或依赖注入减少了应用程序的代码量。它使得应用程序的测试很简单，因为在单元测试中不再需要单例或JNDI查找机制。简单的实现以及较少的干扰机制使得松耦合得以实现。IOC容器支持勤性单例及延迟加载服务。

## 解释AOP模块

AOP模块用来开发Spring应用程序中具有切面性质的部分。该模块的大部分服务由AOP Aliance提供，这就保证了Spring框架和其他AOP框架之间的互操作性。另外，该模块将元数据编程引入到了Spring。

## Spring面向切面编程(AOP)

面向切面编程（AOP）：允许程序员模块化横向业务逻辑，或定义核心部分的功能，例如日志管理和事务管理。

切面(Aspect) ：AOP的核心就是切面，它将多个类的通用行为封装为可重用的模块。该模块含有一组API提供 cross-cutting功能。例如,日志模块称为日志的AOP切面。根据需求的不同，一个应用程序可以有若干切面。在Spring AOP中，切面通过带有[@Aspect](https://github.com/Aspect)注解的类实现。

通知(Advice)：通知表示在方法执行前后需要执行的动作。实际上它是Spring AOP框架在程序执行过程中触发的一些代码。Spring切面可以执行一下五种类型的通知:

- before(前置通知)：在一个方法之前执行的通知。
- after(最终通知)：当某连接点退出的时候执行的通知（不论是正常返回还是异常退出）。
- after-returning(后置通知)：在某连接点正常完成后执行的通知。
- after-throwing(异常通知)：在方法抛出异常退出时执行的通知。
- around(环绕通知)：在方法调用前后触发的通知。

切入点(Pointcut)：切入点是一个或一组连接点，通知将在这些位置执行。可以通过表达式或匹配的方式指明切入点。

引入：引入允许我们在已有的类上添加新的方法或属性。

目标对象：被一个或者多个切面所通知的对象。它通常是一个代理对象。也被称做被通知（advised）对象。

代理：代理是将通知应用到目标对象后创建的对象。从客户端的角度看，代理对象和目标对象是一样的。有以下几种代理：

- BeanNameAutoProxyCreator：bean名称自动代理创建器
- DefaultAdvisorAutoProxyCreator：默认通知者自动代理创建器
- Metadata autoproxying：元数据自动代理

织入：将切面和其他应用类型或对象连接起来创建一个通知对象的过程。织入可以在编译、加载或运行时完成。

## Spring AOP 实现原理

实现AOP的技术，主要分为两大类：

- 一是采用动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行；
- 二是采用静态织入的方式，引入特定的语法创建“方面”，从而使得编译器可以在编译期间织入有关“方面”的代码。

Spring AOP 的实现原理其实很简单：AOP 框架负责动态地生成 AOP 代理类，这个代理类的方法则由 Advice和回调目标对象的方法所组成, 并将该对象可作为目标对象使用。AOP 代理包含了目标对象的全部方法，但AOP代理中的方法与目标对象的方法存在差异，AOP方法在特定切入点添加了增强处理，并回调了目标对象的方法。

Spring AOP使用动态代理技术在运行期织入增强代码。使用两种代理机制：基于JDK的动态代理（JDK本身只提供接口的代理）和基于CGlib的动态代理。

- (1) JDK的动态代理

  JDK的动态代理主要涉及java.lang.reflect包中的两个类：Proxy和InvocationHandler。其中InvocationHandler只是一个接口，可以通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态的将横切逻辑与业务逻辑织在一起。而Proxy利用InvocationHandler动态创建一个符合某一接口的实例，生成目标类的代理对象。

  其代理对象必须是某个接口的实现, 它是通过在运行期间创建一个接口的实现类来完成对目标对象的代理.只能实现接口的类生成代理,而不能针对类

- (2)CGLib

  CGLib采用底层的字节码技术，为一个类创建子类，并在子类中采用方法拦截的技术拦截所有父类的调用方法，并顺势织入横切逻辑.它运行期间生成的代理对象是目标类的扩展子类.所以无法通知final、private的方法,因为它们不能被覆写.是针对类实现代理,主要是为指定的类生成一个子类,覆盖其中方法.

  在spring中默认情况下使用JDK动态代理实现AOP,如果proxy-target-class设置为true或者使用了优化策略那么会使用CGLIB来创建动态代理.Spring　AOP在这两种方式的实现上基本一样．以JDK代理为例，会使用JdkDynamicAopProxy来创建代理，在invoke()方法首先需要织入到当前类的增强器封装到拦截器链中，然后递归的调用这些拦截器完成功能的织入．最终返回代理对象．

  `http://zhengjianglong.cn/2015/12/12/Spring/spring-source-aop/`

## 如何自定义注解实现功能

## SpringMVC启动流程

## cgLib知道吗？他和jdk动态代理什么区别？手写一个jdk动态代理呗？





# 1.谈谈Spring IOC的理解，原理与实现?

**总：**

控制反转：理论思想，原来的对象是由使用者来进行控制，有了spring之后，可以把整个对象交给spring来帮我们进行管理

​				DI：依赖注入，把对应的属性的值注入到具体的对象中，@Autowired，populateBean完成属性值的注入

容器：存储对象，使用map结构来存储，在spring中一般存在三级缓存，singletonObjects存放完整的bean对象,

​			整个bean的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean的生命周期）

**分：**

1、一般聊ioc容器的时候要涉及到容器的创建过程（beanFactory,DefaultListableBeanFactory）,向bean工厂中设置一些参数（BeanPostProcessor,Aware接口的子类）等等属性

2、加载解析bean对象，准备要创建的bean对象的定义对象beanDefinition,(xml或者注解的解析过程)

3、beanFactoryPostProcessor的处理，此处是扩展点，PlaceHolderConfigurSupport,ConfigurationClassPostProcessor

4、BeanPostProcessor的注册功能，方便后续对bean对象完成具体的扩展功能

5、通过反射的方式讲BeanDefinition对象实例化成具体的bean对象，

6、bean对象的初始化过程（填充属性，调用aware子类的方法，调用BeanPostProcessor前置处理方法，调用init-mehtod方法，调用BeanPostProcessor的后置处理方法）

7、生成完整的bean对象，通过getBean方法可以直接获取

8、销毁过程



# 2.谈一下spring IOC的底层实现

底层实现：工作原理，过程，数据结构，流程，设计模式，设计思想

你对他的理解和你了解过的实现过程

反射，工厂，设计模式（会的说，不会的不说），关键的几个方法

createBeanFactory，getBean,doGetBean,createBean,doCreateBean,createBeanInstance(getDeclaredConstructor,newinstance),populateBean,initializingBean

1、先通过createBeanFactory创建出一个Bean工厂（DefaultListableBeanFactory）

2、开始循环创建对象，因为容器中的bean默认都是单例的，所以优先通过getBean,doGetBean从容器中查找，找不到的话，

3、通过createBean,doCreateBean方法，以反射的方式创建对象，一般情况下使用的是无参的构造方法（getDeclaredConstructor，newInstance）

4、进行对象的属性填充populateBean

5、进行其他的初始化操作（initializingBean）

# 3.描述一下bean的生命
