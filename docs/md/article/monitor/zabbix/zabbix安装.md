---
title: Zabbix安装
sidebar: heading
---

# Zabbix安装

## 参考资料

- [官方下载 Zabbix](https://www.zabbix.com/download?zabbix=5.0&os_distribution=centos&os_version=7&components=server_frontend_agent&db=mysql&ws=apache)

## 安装 Zabbix Server

### 关闭 Selinux

```bash
# step.1
setenforce 0

# step.2
vim /etc/selinux/config

# step.2 修改内容
SELINUX=disabled
```

### 修改防火墙策略

```bash
# 关闭防火墙
systemctl stop firewalld && systemctl disable firewalld

# 或者修改防火墙策略
firewall-cmd --zone=public --add-port=10050/tcp --permanent
firewall-cmd --zone=public --add-port=10050/udp --permanent
firewall-cmd --zone=public --add-port=10051/tcp --permanent
firewall-cmd --zone=public --add-port=10051/udp --permanent
firewall-cmd --zone=public --add-port=80/tcp --permanent
systemctl restart firewalld
```

### 备份

```bash
# step.1
cd /etc/yum.repos.d

# step.2 备份
for file in *; do cp $file ${file}.bak; done

# step.3
sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
         -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g' \
         -i.bak \
         /etc/yum.repos.d/CentOS-*.repo

# step.4
yum clean all && yum makecache fast
```

### 安装 zabbix

```bash
# step.1 配置 zabbix 源
rpm -ivh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm

# step.2
yum clean all

# step.3 安装 zabbix 服务端组件
yum install zabbix-server-mysql zabbix-agent -y

# step.4 安装 zabbix 前端组件
yum install centos-release-scl -y

# step.5
vim /etc/yum.repos.d/zabbix.repo

# step.5 修改内容
[zabbix-frontend]
...
enabled=1
...

# step.6 安装 zabbix 前端页面、初始数据库、PHP 及 httpd 组件，可能会出错
yum install zabbix-web-mysql-scl zabbix-apache-conf-scl -y
```

> ## 错误排查
>
> ### Network is unreachable
>
> #### 现象
>
> 执行 `yum install zabbix-web-mysql-scl` 出现 `Network is unreachable`
> `Could not retrieve mirrorlist http://mirrorlist.centos.org?arch=x86_64&release=7&repo=sclo-rh error was 14: curl#7 - "Failed to connect to 2a05:d012:8b5:6503:9efb:5cad:348f:e826: Network is unreachable"`
>
> #### 解决
>
> ```bash title="配置源"
> # step.1
> cd /etc/yum.repos.d
> 
> # step.2 备份
> for file in ./CentOS-SCLo-scl*; do cp $file ${file}.bak; done
> 
> # step.3
> sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
>          -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g' \
>          -i.bak \
>          /etc/yum.repos.d/CentOS-SCLo-scl*.repo
> 
> # step.4
> yum clean all && yum makecache fast
> 
> # step.5
> yum install zabbix-web-mysql-scl zabbix-apache-conf-scl -y
> ```

### 创建数据库

```bash
# step.1
yum install mariadb-server -y

# step.2
systemctl enable --now mariadb

# step.3
mysql_secure_installation

# step.4
mysql -u root -p
create database zabbix character set utf8 collate utf8_bin;
create user zabbix@localhost identified by 'password@123';
grant all privileges on zabbix.* to zabbix@localhost;
quit;

# step.5
zcat /usr/share/doc/zabbix-server-mysql*/create.sql.gz | mysql -u zabbix -p zabbix

# step.6
vim /etc/zabbix/zabbix_server.conf

# step.6 修改内容
DBPassword=password@123

# step.7 配置时区
vim /etc/opt/rh/rh-php72/php-fpm.d/zabbix.conf

# step.7 修改内容
php_value[date.timezone] = Asia/Shanghai

# step.8 配置字体，避免前台监控图形中文乱码
yum -y install wqy-microhei-fonts

# step.8 修改内容
cp /usr/share/fonts/wqy-microhei/wqy-microhei.ttc /usr/share/fonts/dejavu/DejaVuSans.ttf
```

### 启动 zabbix

```bash
# step.1
systemctl restart zabbix-server zabbix-agent httpd rh-php72-php-fpm

# step.2
systemctl enable zabbix-server zabbix-agent httpd rh-php72-php-fpm

# step.3 查看 zabbix server 日志
cat /var/log/zabbix/zabbix_server.log
```

浏览器访问 http://xxxx/zabbix ，账号密码 Admin/zabbix

## 安装 Zabbix Agent

在 Zabbix web 页面点击 Configuration -> Hosts -> Create host 添加主机

### 安装 zabbix agent

#### 被动模式

```bash
# step.1 配置 zabbix 源
rpm -ivh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm

# step.2
yum clean all

# step.3 安装
yum install zabbix-agent -y

# step.4
vim /etc/zabbix/zabbix_agentd.conf

# step.4 修改内容
StartAgents=0               # 可选，开启主动推送
Server=192.168.1.129        # zabbix server 地址
ServerActive=192.168.1.129  # zabbix server 地址
Hostname=192.168.1.130      # 本机主机名，与 zabbix web 中配置一样

# step.5 启动
systemctl restart zabbix-agent.service && systemctl enable zabbix-agent.service

# step.6
systemctl status zabbix-agent.service

# step.7 查看 zabbix server 日志
cat /var/log/zabbix/zabbix_agentd.log
```

## Docker 部署

### docker-compose.yaml

```yaml
version: '3'

networks:
  zbx_net:
    driver: bridge

services:
  zabbix-mysql:
    image: mysql:8.0.23
    container_name: zabbix-mysql
    restart: always
    command:
      - mysqld
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8
      - --collation-server=utf8_bin
    environment:
      - MYSQL_DATABASE=zabbix
      - MYSQL_USER=zabbix
      - MYSQL_PASSWORD=zabbix
      - MYSQL_ROOT_PASSWORD=biitt@123
    ports:
      - 13306:3306
    volumes:
      - ./db/data:/var/lib/mysql
      - ./db/logs:/logs
    networks:
      - zbx_net

  zabbix-server:
    image: zabbix/zabbix-server-mysql:centos-5.2-latest
    container_name: zabbix-server
    restart: always
    environment:
      - DB_SERVER_HOST=zabbix-mysql
      - MYSQL_DATABASE=zabbix
      - MYSQL_USER=zabbix
      - MYSQL_PASSWORD=zabbix
      - MYSQL_ROOT_PASSWORD=biitt@123
      - ZBX_JAVAGATEWAY=zabbix-java-gateway
      - ZBX_JAVAGATEWAY_ENABLE=true
      - ZBX_JAVAGATEWAYPORT=10052
      - ZBX_IPMIPOLLERS=3
    ports:
      - 10051:10051
    volumes:
      - ./server/conf.d:/etc/zabbix/zabbix_server.conf.d
      - ./server/logs:/logs
    depends_on:
      - zabbix-mysql
    networks:
      - zbx_net
  
  zabbix-web-nginx:
    image: zabbix/zabbix-web-nginx-mysql:centos-5.2-latest
    container_name: zabbix-web-nginx
    restart: always
    environment:
      - DB_SERVER_HOST=zabbix-mysql
      - MYSQL_DATABASE=zabbix
      - MYSQL_USER=zabbix
      - MYSQL_PASSWORD=zabbix
      - MYSQL_ROOT_PASSWORD=biitt@123
      - ZBX_SERVER_HOST=zabbix-server
    ports:
      - 18080:8080
    volumes:
      - ./web/conf.d:/etc/zabbix/web/conf.d
      - ./web/logs:/logs
      - ./web/DejaVuSans.ttf:/usr/share/zabbix/assets/fonts/DejaVuSans.ttf
    depends_on:
      - zabbix-server
      - zabbix-mysql
    networks:
      - zbx_net
  
  zabbix-java-gateway:
    image: zabbix/zabbix-java-gateway:centos-5.2-latest
    container_name: zabbix-java-gateway
    restart: always
    networks:
      - zbx_net
  
  zabbix-agent:
    image: zabbix/zabbix-agent:centos-5.2-latest
    container_name: zabbix-agent
    restart: always
    ports:
      - 10050:10050
    environment:
      - ZBX_HOSTNAME=Zabbix server
      - ZBX_SERVER_HOST=zabbix-server
      - ZBX_SERVER_PORT=10051
    depends_on:
      - zabbix-server
    networks:
      - zbx_net
```

### 部署

```bash
cd /opt/docker/zabbix/web

wget https://dl.cactifans.com/zabbix_docker/msty.ttf
mv msty.ttf DejaVuSans.ttf

cd /opt/docker/zabbix

docker-compose up -d
```
