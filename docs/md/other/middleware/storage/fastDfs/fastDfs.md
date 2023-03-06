## 什么是FastDFS

　　FastDFS是用c语言编写的一款开源的分布式文件系统。FastDFS为互联网量身定制，充分考虑了冗余备份、负载均衡、线性扩容等机制，并注重高可用、高性能等指标，使用FastDFS很容易搭建一套高性能的文件服务器集群提供文件上传、下载等服务。由跟踪服务器（tracker server）、存储服务器（storage server）和客户端（client）组成。它主要解决的是海量数据存储的问题。

 

## FastDFS的系统架构

　　FastDFS架构包括Tracker server和Storage server。客户端请求Tracker server进行文件上传、下载，通过Tracker server调度最终由Storage server完成文件上传和下载。

　　Tracker server作用是负载均衡和调度，通过Tracker server在文件上传时可以根据一些策略找到Storage server提供文件上传服务。可以将tracker称为追踪服务器或调度服务器。

　　Storage server作用是文件存储，客户端上传的文件最终存储在Storage服务器上，Storage server没有实现自己的文件系统而是利用操作系统 的文件系统来管理文件。可以将storage称为存储服务器。

 

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200204175307346-682674823.png)

 

###  

### Tracker集群

　　FastDFS集群中的Tracker server可以有多台，Tracker server之间是相互平等关系同时提供服务，Tracker server不存在单点故障。客户端请求Tracker server采用轮询方式，如果请求的tracker无法提供服务则换另一个tracker。

 

### Storage集群

　　Storage集群采用了分组存储方式。storage集群由一个或多个组构成，集群存储总容量为集群中所有组的存储容量之和。一个组由一台或多台存储服务器组成，组内的Storage server之间是平等关系，不同组的Storage server之间不会相互通信，同组内的Storage server之间会相互连接进行文件同步，从而保证同组内每个storage上的文件完全一致的。一个组的存储容量为该组内存储服务器容量最小的那个，由此可见组内存储服务器的软硬件配置最好是一致的。

　　采用分组存储方式的好处是灵活、可控性较强。比如上传文件时，可以由客户端直接指定上传到的组也可以由tracker进行调度选择。一个分组的存储服务器访问压力较大时，可以在该组增加存储服务器来扩充服务能力（纵向扩容）。当系统容量不足时，可以增加组来扩充存储容量（横向扩容）。

 

### Storage的状态收集

　　Storage server会连接集群中所有的Tracker server，定时向他们报告自己的状态，包括磁盘剩余空间、文件同步状况、文件上传下载次数等统计信息。

 

## 文件上传流程

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200204200428188-146799219.png)

 

　　客户端上传文件后存储服务器将文件ID返回给客户端，此文件ID用于以后访问该文件的索引信息。文件索引信息包括：组名，磁盘编号，数据两级目录，文件名。这里的文件名是由文件上传的源头服务器、文件上传的时间戳、文件大小、随机数经过base64加密后的一个串。

- 组名：文件上传后所在的storage组名称，在文件上传成功后有storage服务器返回，需要客户端自行保存。
- 磁盘编号：storage配置的上传路store_path*与磁盘编号对应。如果配置了store_path0则是M00，如果配置了store_path1则是M01，以此类推。因为FastDFS支持多次盘上传，也就是说如果你的服务器有多块儿挂在磁盘，那么可以配置多个Store_path，如store_path0、store_path1..对应的磁盘编号就是M00、M01，这样在上传的时候会上传到多块磁盘上。
- 数据两级目录：storage服务器在每个虚拟磁盘路径下创建的两级目录，用于存储数据文件。
- 文件名：与文件上传时不同。是由存储服务器根据特定信息生成，文件名包含：源存储服务器IP地址、文件创建时间戳、文件大小、随机数和文件拓展名等信息。

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200204200715317-1861991968.png)

## 文件下载流程

 ![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200204200751548-1942691019.png)

　　tracker根据请求的文件路径即文件ID来快速定位文件。

　　比如请求下边的文件：

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200204200826279-459792770.png)

1. 通过组名tracker能够很快的定位到客户端需要访问的存储服务器组是group1，并选择合适的存储服务器提供客户端访问。
2. 选择完一台存储服务器后，存储服务器根据“磁盘编号M00”可以得知使用的是哪块磁盘是M00这块磁盘。由于M00对应的是store_path0,所以根据store_path0配置的路径就可以找到对应的目录。
3. 根据两级目录/02/44/和文件名就可以获取到对应的文件了。

　　注意：由于FastDFS只提供了文件上传的服务并没有提供文件下载的接口，所以需要在storage上安装nginx来实现文件下载。





## 1、安装顺序

1. libfastcommon
2. fdfs_tracker （依赖Gcc、libevent、perl）
3. fdfs_storage
4. FastDFS-nginx-module
5. nginx （依赖pcre-devel、zlib-devel）

 

## 2、依赖环境

　　一步到位，FastDFS和Nginx的所有依赖

```
yum -y install zlib zlib-devel pcre pcre-devel gcc gcc-c++ openssl openssl-devel libevent libevent-devel perl unzip net-tools wget
```

 

## 3、下载FastDFS

tracker和storage使用相同的安装包，下载地址：http://sourceforge.net/projects/FastDFS/ 或https://github.com/happyfish100/FastDFS

 

## 4、Tracker Server安装

### 4.1、Tracker安装环境准备

FastDFS是C语言开发的，需要gcc环境

```
yum -y install gcc-c++
```

 

FastDFS依赖libevent库

```
yum -y install libevent
```

 

perl库

```
yum install perl* 
```

 

### 4.2、libfastcommon基础库

libfastcommon是FastDFS官方提供的，libfastcommon包含了FastDFS运行所需要的一些基础库

 

将libfastcommonV1.0.7.tar.gz解压至/usr/local下，执行shell脚本

```
cd /usr/local/

tar -zxvf libfastcommonV1.0.7.tar.gz –C /usr/local/

cd libfastcommon-1.0.7

./make.sh

./make.sh install
```

 

libfastcommon安装好后会自动将库文件拷贝至/usr/lib64下，FastDFS程序引用usr/lib目录，所以需要将/usr/lib64下的库文件拷贝至/usr/lib下

```
cp /usr/lib64/libfastcommon.so /usr/lib/
```

 

### 4.3、 编译安装Tracker

将FastDFS_v5.05.tar.gz解压至/usr/local/src/，然后进入目录/usr/local/FastDFS，编译，安装

```
tar -zxvf FastDFS_v5.05.tar.gz –C /usr/local/cd /usr/local/FastDFS./make.sh./make.sh instal
```

 

默认的安装方式，配置文件都存储在/etc/fdfs/，命令文件都安装在/usr/bin/

 

安装成功将安装目录下的conf下的文件拷贝到/etc/fdfs/下。/etc/fdfs/目录是FastDFS配置文件目录

```
cp ./* /etc/fdfs/ 
```

 

进入/etc/fdfs/目录下，修改复制tracker.conf配置文件(建议备份)

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206130659073-823957543.png)

 

修改内容

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206130717742-328051877.png)

 

其中

　　Tracker默认的服务端口是22122

　　base_path=/opt/fastdfs，tracker的数据文件目录路径，用来存储storage的信息

　　http.server_port=8088，Http服务端口8088

 

### 4.4、启动Tracker

启动tracker，查看启动情况

```
/usr/bin/fdfs_trackerd /etc/fdfs/tracker.confps -ef|grep fdfs
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206130910113-1796336530.png)

 

### 4.5、设置开机启动

创建文件夹/usr/local/fdfs，拷贝FastDfs目录下stop.sh和restart.sh 到/usr/local/fdfs/，修改启动脚本（建议备份）

```
mkdir /usr/local/fdfs

cp restart.sh stop.sh  /usr/local/fdfs/

vim /etc/init.d/fdfs_trackerd
```

修改内容如下

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131044302-585657794.png)

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131053511-1903024614.png)

 

注册服务，启动测试

```
chkconfig  --add  fdfs_trackerd

service fdfs_trackerd start 
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131150165-230166649.png)

 

## 5、Storage Server安装

### 5.1、Storage安装环境准备

tracker和storage使用相同的安装包，所以和Tracker Server一样，单机版就用不管了

 

### 5.2、 编译安装Storage

集群，是在另外一台机器上安装Storage。编译安装和Tracker一样，解压tar包，然后make，make install

 

单机，可不管，tracker和storage使用相同的安装包，所有不需要再解压

进入/etc/fdfs/目录下，修改storage.conf配置文件

```
vim /etc/fdfs/storage.conf
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131307499-1429904143.png)

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131315972-188046284.png)

 

tracker_server=192.168.188.21:22122，配置tracker的IP地址，storage是主动连接tracker的

 

创建目录，storage存储数据的目录

```
mkdir /opt/fastdfs/fdfs_storage
```

 

### 5.3、启动storage

启动storage，查看启动情况

```
/usr/bin/fdfs_storaged /etc/fdfs/storage.conf 

ps -ef|grep fdfs
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131551724-820416496.png)

 

### 5.4、设置启动项

```
vim  /etc/init.d/fdfs_storaged
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131622903-522723889.png)

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131630932-196535226.png)

 

注册服务，启动服务

```
chkconfig - -add fdfs_storaged

service fdfs_storaged start 
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131719788-2088721734.png)

 

## 6、测试上传

通过/usr/bin/fdfs_test测试上传，集群中在tracker上和storage上修改/etc/fdfs/client.conf配置文件

```
vim /etc/fdfs/client.conf
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131811208-458867344.png)

 

测试上传格式

```
/usr/bin/fdfs_test /etc/fdfs/client.conf upload /opt/1.jpg
```

 

测试上传成功

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131851377-873227097.png)

 

对应的上传路径

```
/opt/fastdfs/fdfs_storage/data/00/00

/wKiMoF46wdiAT1NeABKeZYGkypw508_big.jpg
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206131949232-1150823291.png)

 

## 7、FastDFS整合nginx

### 7.1、nginx安装前准备

进入http://nginx.org/en/download.html 下载最新稳定版tar包

 

安装nginx的依赖包

nginx是C语言开发的，需要gcc环境

```
yum -y install gcc-c++ 
```

 

PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。nginx的http模块使用pcre来解析正则表达式，pcre-devel是使用pcre开发的一个二次开发库

```
yum -y install pcre pcre-devel
```

 

zlib 提供了很多种压缩和解压缩的方式，nginx使用zlib对http包的内容进行gzip

```
yum -y install zlib zlib-devel
```

 

OpenSSL 是一个安全套接字层密码库，nginx支持https，要用https传数据

```
yum -y install openssl openssl-devel
```

 

### 7.2、安装FastDFS-nginx-module

FastDFS-nginx-module是FastDFS和Nginx整合的插件，因为nginx需要给Storage提供下载接口，所以在Storage上需要安装

 

FastDFS-nginx-module.tar.gz作为nginx的一个模块，要随着nginx一起编译，安装，要配置在nginx的安装配置里

 

将fastdfs-nginx-module_v1.16.tar.gz传至/usr/local/，并修改/usr/local/fastdfs-nginx-module/src/中config文件中的路径（建议备份）

```
tar -zxvf fastdfs-nginx-module_v1.16.tar.gz –C /usr/local/ 

cd /usr/local/fastdfs-nginx-module/src

vim config
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206133304537-337000148.png)

 

将FastDFS-nginx-module/src下的mod_FastDFS.conf拷贝至/etc/fdfs/下,并修改mod_FastDFS.conf的内容

```
cp mod_FastDFS.conf /etc/fdfs/

vim /etc/fdfs/mod_FastDFS.conf
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206133401135-51994298.png)

 

其中

　　url_have_group_name=true，url中包含group名称

　　store_path0=/home/FastDFS/fdfs_storage，指定文件存储路径

 

将libfdfsclient.so拷贝至/usr/lib下

```
cp /usr/lib64/libfdfsclient.so /usr/lib/
```

 

## 8、 在Storage上安装nginx

### 8.1、Storage上安装nginx的目的

目的是提供http下载接口，通过访问nginx的服务，来下载文件，静态资源服务器

 

### 8.2、安装nginx

创建临时文件目录，解压nginx-1.8.0.tar.gz 到/usr/local/下

```
mkdir -p /var/temp/nginx/client

tar -zxvf nginx-1.8.0.tar.gz –C /usr/local/

cd /usr/local/nginx-1.8.0
```

 

参数配置，配置安装目录和命令文件和配置文件的位置

参数设置如下：设置安装前的设置如安装的位置，添加依赖包

```
./configure \
--prefix=/usr/local/nginx \
--pid-path=/usr/local/nginx/logs/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi \
--add-module=/usr/local/fastdfs-nginx-module/src
```

 

其中

　　--prefix=/usr/local/nginx \，是nginx的安装目录

　　--add-module=/usr/local/fastdfs-nginx-module/src，是添加依赖模块

 

编译安装

```
make

make install
```

 

### 8.3、修改nginx的配置文件

修改/usr/local/nginx安装目录下的conf下的nginx.conf配置文件

```
vim /usr/local/nginx/conf/nginx.conf
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206134832508-1433054045.png)

 

### 8.4、启动nginx

```
cd /usr/local/nginx/sbin/

./nginx
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206135207706-254972136.png)

 

### 8.5、设置开机启动

```
vim /etc/init.d/nginx
#!/bin/bash## nginx - this script starts and stops the nginx daemon## chkconfig:   - 85 15# description:  NGINX is an HTTP(S) server, HTTP(S) reverse \#               proxy and IMAP/POP3 proxy server# processname: nginx# config:      /etc/nginx/nginx.conf# config:      /etc/sysconfig/nginx# pidfile:     /var/run/nginx.pid# Source function library.. /etc/rc.d/init.d/functions# Source networking configuration.. /etc/sysconfig/network# Check that networking is up.[ "$NETWORKING" = "no" ] && exit 0nginx="/usr/local/nginx/sbin/nginx"prog=$(basename $nginx)NGINX_CONF_FILE="/usr/local/nginx/conf/nginx.conf"[ -f /etc/sysconfig/nginx ] && . /etc/sysconfig/nginxlockfile=/var/lock/subsys/nginxmake_dirs() {  # make required directories  user=`$nginx -V 2>&1 | grep "configure arguments:.*--user=" | sed 's/[^*]*--user=\([^ ]*\).*/\1/g' -`  if [ -n "$user" ]; then    if [ -z "`grep $user /etc/passwd`" ]; then      useradd -M -s /bin/nologin $user    fi    options=`$nginx -V 2>&1 | grep 'configure arguments:'`    for opt in $options; do        if [ `echo $opt | grep '.*-temp-path'` ]; then          value=`echo $opt | cut -d "=" -f 2`          if [ ! -d "$value" ]; then            # echo "creating" $value            mkdir -p $value && chown -R $user $value          fi        fi    done  fi}start() {  [ -x $nginx ] || exit 5  [ -f $NGINX_CONF_FILE ] || exit 6  make_dirs  echo -n $"Starting $prog: "  daemon $nginx -c $NGINX_CONF_FILE  retval=$?  echo  [ $retval -eq 0 ] && touch $lockfile  return $retval}stop() {  echo -n $"Stopping $prog: "  killproc $prog -QUIT  retval=$?  echo  [ $retval -eq 0 ] && rm -f $lockfile  return $retval}restart() {  configtest || return $?  stop  sleep 1  start}reload() {  configtest || return $?  echo -n $"Reloading $prog: "  killproc $nginx -HUP  RETVAL=$?  echo}force_reload() {  restart}configtest() {  $nginx -t -c $NGINX_CONF_FILE}rh_status() {  status $prog}rh_status_q() {  rh_status >/dev/null 2>&1}case "$1" in  start)    rh_status_q && exit 0    $1    ;;  stop)    rh_status_q || exit 0    $1    ;;  restart|configtest)    $1    ;;  reload)    rh_status_q || exit 7    $1    ;;  force-reload)    force_reload    ;;  status)    rh_status    ;;  condrestart|try-restart)    rh_status_q || exit 0    ;;  *)    echo $"Usage: $0 {start|stop|status|restart|reload|configtest}"    exit 2esac
```

 

其中nginxd，nginx_config，nginx_pid要与自己安装的位置一致

 

```
chmod 777 /etc/init.d/nginx
```

 

测试启动

```
/etc/init.d/nginx start

/etc/init.d/nginx stop
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206135421303-1816024290.png)

 

注册服务，开启服务

```
chkconfig --add /etc/init.d/nginxservice nginx start
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206135601368-781366509.png)

 

## 9、测试上传

现在的测试上传，是通过HTTP协议访问，是不同主机之间的访问，Linux作为服务器是有防火墙的，要么关闭防火墙，要么开发访问的端口。

 

临时关闭防火墙（不推荐）

```
service iptables stop
```


永久关闭防火墙（不推荐）

```
chkconfig iptables off
```

或者

```
systemctl stop firewalld

systemctl disable firewalld
```

 

开放nginx的监听端口80（推荐，依次输入）

```
firewall-cmd --add-service=http --permanent

firewall-cmd --add-service=https --permanent

firewall-cmd --add-port=80/tcp --permanent

firewall-cmd --reload//查看开放端口号firewall-cmd --list-all
```

 

测试上传

```
/usr/bin/fdfs_test /etc/fdfs/client.conf upload /opt/1.jpg
```

![img](https://img2018.cnblogs.com/common/991783/202002/991783-20200206135714519-760315682.png)

 

浏览器中输入之前上传的图片的url

```
http://192.168.140.160/group1/M00/00/00/wKiMoF467-SAM8_CABKeZYGkypw552_big.jpg
```

 

得到图片，测试成功，单机版FastDFS就已经完成了。

 

## 10、补充

Tracker上安装nginx的目的是为了做反向代理和负载均衡。Tracker上安装nginx的配置

```
./configure \
--prefix=/usr/local/nginx \
--pid-path=/usr/local/nginx/logs/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi \
--add-module=/usr/local/ngx_cache_purge-2.3
```

 

这个添加的是ngx_cache_purge-2.3模块

```
--add-module=/usr/local/ngx_cache_purge-2.3
```

 

剩下的就只是改nginx.conf配置文件，只要熟悉nginx就很简单

 