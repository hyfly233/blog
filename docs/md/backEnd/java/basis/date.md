# 日期与时间

## 时区

以`GMT`或者`UTC`加时区偏移表示，`GMT`和`UTC`可以认为基本是等价的，只是`UTC`使用更精确的原子钟计时，每隔几年会有一个闰秒，在开发程序的时候可以忽略两者的误差，因为计算机的时钟在联网的时候会自动与时间服务器同步时间

`CST`表示`China Standard Time`，也就是中国标准时间。但是`CST`也可以表示美国中部时间`Central Standard Time USA`，因此，缩写容易产生混淆 

以洲／城市表示，例如，`Asia/Shanghai`，表示上海所在地的时区。 

夏令时，就是夏天开始的时候，把时间往后拨1小时，夏天结束的时候，再把时间往前拨1小时



## 本地化

通常使用`Locale`表示一个国家或地区的日期、时间、数字、货币等格式。`Locale`由`语言_国家`的字母缩写构成，例如，`zh_CN`表示中文+中国，`en_US`表示英文+美国。语言使用小写，国家使用大写。 



## Date和Calendar









## DateFormat

DateFormat 的所有实现，包括 SimpleDateFormat 都不是线程安全的

因此不应该在多线程序中使用，除非是在对外线程安全的环境中使用，如将 SimpleDateFormat 限制在 ThreadLocal 中

因此，从日期、时间处理的所有实践来说，强力推荐 joda-time 库





# Joda-time





todo

