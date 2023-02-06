# 安装 Mysql Server

## 环境准备

1. 挂载外部持久化配置和数据目录

```sh
mkdir /opt/mysql
mkdir /opt/mysql/conf.d
mkdir /opt/mysql/data/
```

创建my.cnf配置文件

```sh
touch /opt/mysql/my.cnf
```

my.cnf添加如下内容：

```properties
[mysqld]
user=mysql
character-set-server=utf8
default_authentication_plugin=mysql_native_password
secure_file_priv=/var/lib/mysql
expire_logs_days=7
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
max_connections=1000

[client]
default-character-set=utf8

[mysql]
default-character-set=utf8
```

2. 运行 Mysql Docker 镜像

   ```dockerfile
   docker run \
    --name mysql8 \
    -p 3306:3306 \
    -v /opt/mysql/data:/var/lib/mysql \
    -v /opt/mysql/log:/var/log/mysql \
    -v /opt/mysql/my.cnf:/etc/mysql/my.cnf:rw \
    -e MYSQL_ROOT_PASSWORD=password \
    -d mysql:8.0.30 --default-authentication-plugin=mysql_native_password
   ```

3. 登录 mysql server，设置 root 密码
   mysql -u root -p
   UPDATE mysql.user SET host='%' WHERE user='root';
   flush privileges;

4. 安装Mysql client

   - 添加rpm源
     rpm -ivh https://repo.mysql.com//mysql57-community-release-el7-11.noarch.rpm
   - 安装x64位的 mysql客户端
     yum install mysql-community-client.x86_64 -y 
   - 登录 mysql server
     mysql -h 127.0.0.1 -uroot -p
     输入密码：password

   

5. 创建数据库 blogDB
   ```sql
   CREATE DATABASE IF NOT EXISTS blogDB DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
   ```

   

# 应用编译，打包，运行

## 1. 项目编译，打包

在 IDEA 里设置 Maven 项目。

```sh
cd k8s-demo
mvn package
```

## 2. 运行博客项目

```sh
java -jar target/k8s-demo.jar
```

- 访问博客用户端：http://localhost:50000
- 访问博客管理员端：http://localhost:50000/admin, 用户名密码 admin/password





# 为什么需要Docker？k8s与Docker的关系？

## Docker VS 虚拟机

![](/Users/flyhy/baiduCloud/Kubernetes 入门到进阶实战，系统性掌握 K8s 生产实践/资料/kubeblog/docs/Chapter3/images/2-1Container.png)
官方解释：Package Software into Standardized Units for Development, Shipment and Deployment.



# Docker namespace 隔离

1. Docker通过 Namespace 实现进程隔离

```c
int clone(int (*child_func)(void *), void *child_stack, int flags, void *arg);
```

2. Docker 的实现原理：Docker 如何通过 Namespace 聚合进程，实现进程间隔离。

```sh
docker run -d -p 8083:8083 nginx
ps -ef|grep docker 
ls -al /proc/[PID]/ns
```



# Docker 的资源配额 CGroups

1. Docker 使用CGroups实现资源的配额管理。

- Cgroups (control groups)
- 2007年由谷歌工程师研发
- 2008年并入 Linux Kernel 2.6.24
- C语言实现

2. CGroups 限制进程的 CPU使用时间。 
   Docker中的 CPU，内存，网络的限制均通过 cgroups 实现 
   ![](/Users/flyhy/baiduCloud/Kubernetes 入门到进阶实战，系统性掌握 K8s 生产实践/资料/kubeblog/docs/Chapter3/images/docker-cgroups.png)
3. 实践
   在宿主机上创建一个让 CPU 飙升到100%的进程： （此操作有风险，慎用）

```c
while : ; do : ; done &
```

记录下 PID = 27358

```sh
cd /sys/fs/cgroup/cpu
mkdir cgroups_test
echo 20000 > /sys/fs/cgroup/cpu/cgroups_test/cpu.cfs_quota_us
echo 27358 > /sys/fs/cgroup/cpu/cgroups_test/tasks
```

清理该进程 

```sh
Kill -9 27358 
```

4. docker 里如何加参数进行资源配额
   docker run -it --cpus=".5" nginx /bin/sh
   进入容器查看是否有对应的 cgroup 设置

```sh
cd /sys/fs/cgroup/cpu
cat cpu.cfs_quota_us
```

配置显示 500000，证明--cpus=".5"的参数已经生效



# Docker镜像

## 3.4.1 Docker镜像的由来

- 虽然 Docker 实现了运行环境的隔离，但如何将一个运行的容器快速进行启动，复制，迁移到其他的主机上运行？

- 如果容器无法快速进行复制，迁移，那么和以 VMware 为代表的虚拟化技术相比并没有太多优势

## 3.4.2 Docker 镜像的特性

- Docker 镜像具备了应用运行所需要的所有依赖

- 一次构建，处处运行

- Docker 镜像的存储是基于 checksum 的去重存储，大大降低存储空间

## 3.4.3 Docker 镜像常用命令

- 下载 Docker 镜像
  docker pull nginx
- 为镜像打版本号
  docker tag 
- 上传 Docker 镜像
  docker push



# 编写博客 应用的 Dockerfile

```dockerfile
FROM openjdk:8-jdk-alpine
MAINTAINER QingFeng
VOLUME /tmp
ADD target/kubeblog.jar /kubeblog.jar
EXPOSE 5000
ENTRYPOINT ["java","-jar","/kubeblog.jar"]
```



# 为博客应用构建 Docker 镜像

- 增加 mysql57 hosts 记录，作为数据库的域名

```sh
vi /etc/hosts
127.0.0.1    mysql57
```

- 下载代码,构建 mvn package

```sh
git clone <git url>
cd /root/kubeblog/Final
mvn package
```

- 构建 Docker 镜像

```sh
docker build -t kubeblog .
```

- 查看 docker 镜像

```sh
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
kubeblog            1.0                 f9bb30633155        4 minutes ago       148MB
```

# Docker run --link运行博客应用

- docker run --link运行博客应用

```sh
docker run --name kubeblog -d -p 5000:5000  --link mysql57 kubeblog:1.0
```

-进入容器查看环境变量 evn

```sh
docker exec -it kubeblog sh
env |grep MYSQL
MYSQL57_ENV_MYSQL_MAJOR=5.7
MYSQL57_PORT_3306_TCP_ADDR=172.17.0.2
MYSQL57_ENV_MYSQL_ROOT_PASSWORD=password
MYSQL57_ENV_GOSU_VERSION=1.12
MYSQL57_PORT_3306_TCP_PORT=3306
MYSQL57_PORT_3306_TCP_PROTO=tcp
MYSQL57_PORT_33060_TCP_ADDR=172.17.0.2
MYSQL57_PORT=tcp://172.17.0.2:3306
MYSQL57_PORT_3306_TCP=tcp://172.17.0.2:3306
MYSQL57_PORT_33060_TCP_PORT=33060
MYSQL57_ENV_MYSQL_VERSION=5.7.30-1debian10
MYSQL57_PORT_33060_TCP_PROTO=tcp
MYSQL57_NAME=/kubeblog/mysql57
MYSQL57_PORT_33060_TCP=tcp://172.17.0.2:33060
```

- 更新/etc/hosts文件

  ```sh
  cat /etc/hosts
  127.0.0.1	localhost
  ::1	localhost ip6-localhost ip6-loopback
  fe00::0	ip6-localnet
  ff00::0	ip6-mcastprefix
  ff02::1	ip6-allnodes
  ff02::2	ip6-allrouters
  172.17.0.2	mysql57 401b104b930a
  172.17.0.3	2028007380c4
  ```

  

- 在宿主机访问 centos 虚拟机上的 kubeblog 应用，需要关闭虚拟机防火墙

```sh
systemctl stop firewalld
192.168.99.101:5000
```





# 第五章 Kubernetes入门及集群搭建



# Kubernetes的起源和发展 

## Kubernetes 的起源

- Kubernetes最初源于谷歌内部的Borg，Kubernetes 的最初目标是为应用的容器化编排部署提供一个最小化的平台，包含几个基本功能：

1. 将应用水平扩容到多个集群
2. 为扩容的实例提供负载均衡的策略
3. 提供基本的健康检查和自愈能力
4. 实现任务的统一调度



## Kubernetes 的发展

- 2014年6月 谷歌云计算专家Eric Brewer在旧金山的发布会为这款新的开源工具揭牌。
- 2015年7月22日K8S迭代到 v 1.0并在OSCON大会上正式对外公布。
- 为了建立容器编排领域的标准和规范，Google、RedHat 等开源基础设施领域玩家们，在 2015 年共同牵头发起了名为 CNCF（Cloud Native Computing Foundation）的基金会。Kubernetes 成为 CNCF 最核心的项目。发起成员：AT&T, Box, Cisco, Cloud Foundry Foundation, CoreOS, Cycle Computing, Docker, eBay, Goldman Sachs, Google, Huawei, IBM, Intel, Joyent, Kismatic, Mesosphere, Red Hat, Switch SUPERNAP, Twitter, Univa, VMware and Weaveworks。
- 2018年，超过 1700 开发者成为 Kubernetes 项目社区贡献者，全球有 500 多场沙龙。国内出现大量基于 Kubernetes 的创业公司。
- 2020 年，Kubernetes 项目已经成为贡献者仅次于 Linux 项目的第二大开源项目。成为了业界容器编排的事实标准，各大厂商纷纷宣布支持 Kubernetes 作为容器编排的方案。

# 为什么需要 Kubernetes？

## 传统的容器编排痛点

容器技术虽然解决了应用和基础设施异构的问题，让应用可以做到一次构建，多次部署，但在复杂的微服务场景，单靠 Docker 技术还不够，它仍然有以下问题没有解决：

- 集成和编排微服务模块
- 提供按需自动扩容，缩容能力
- 故障自愈
- 集群内的通信

## Kubernetes 能解决的问题

- 按需的垂直扩容，新的服务器(node)能够轻易的增加或删除
- 按需的水平扩容，容器实例能够轻松扩容，缩容
- 副本控制器，你不用担心副本的状态
- 服务发现和路由
- 自动部署和回滚，如果应用状态错误，可以实现自动回滚

## 什么时候使用 Kubernetes？

- 当你的应用是微服务架构
- 开发者需要快速部署自己的新功能到测试环境进行验证
- 降低硬件资源成本，提高使用率

## 什么时候不适合使用 Kubernetes

- 应用是轻量级的单体应用，没有高并发的需求
- 团队文化不适应变革



# Kubernetes 的架构和核心概念

## 主控制节点组件

主控制节点组件对集群做出全局决策(比如调度)，以及检测和响应集群事件（例如，当不满足部署的 replicas 字段时，启动新的 pod）。

主控制节点组件可以在集群中的任何节点上运行。 然而，为了简单起见，设置脚本通常会在同一个计算机上启动所有主控制节点组件，并且不会在此计算机上运行用户容器。

- apiserver
  主节点上负责提供 Kubernetes API 服务的组件；它是 Kubernetes 控制面的前端组件。
- etcd
  etcd 是兼具一致性和高可用性的键值数据库，可以作为保存 Kubernetes 所有集群数据的后台数据库。

- kube-scheduler
  主节点上的组件，该组件监视那些新创建的未指定运行节点的 Pod，并选择节点让 Pod 在上面运行。
  调度决策考虑的因素包括单个 Pod 和 Pod 集合的资源需求、硬件/软件/策略约束、亲和性和反亲和性规范、数据位置、工作负载间的干扰和最后时限。
- kube-controller-manager
  在主节点上运行控制器的组件。
  从逻辑上讲，每个控制器都是一个单独的进程，但是为了降低复杂性，它们都被编译到同一个可执行文件，并在一个进程中运行。这些控制器包括:
         1. 节点控制器（Node Controller）: 负责在节点出现故障时进行通知和响应。
         2. 副本控制器（Replication Controller）: 负责为系统中的每个副本控制器对象维护正确数量的 Pod。
         3. 终端控制器（Endpoints Controller）: 填充终端(Endpoints)对象(即加入 Service 与 Pod)。
         4. 服务帐户和令牌控制器（Service Account & Token Controllers），为新的命名空间创建默认帐户和 API 访问令牌.


## 从节点组件

节点组件在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行环境。

- kubelet 
  一个在集群中每个节点上运行的代理。它保证容器都运行在 Pod 中。

kubelet 接收一组通过各类机制提供给它的 PodSpecs，确保这些 PodSpecs 中描述的容器处于运行状态且健康。kubelet 不会管理不是由 Kubernetes 创建的容器。

- kube-proxy
  kube-proxy 是集群中每个节点上运行的网络代理,实现 Kubernetes Service 概念的一部分。
  kube-proxy 维护节点上的网络规则。这些网络规则允许从集群内部或外部的网络会话与 Pod 进行网络通信。

- 容器运行时（Container Runtime）
  容器运行环境是负责运行容器的软件。
  Kubernetes 支持多个容器运行环境: Docker、 containerd、cri-o、 rktlet 以及任何实现 Kubernetes CRI (容器运行环境接口)。

## 插件（Addons）

- DNS
  尽管其他插件都并非严格意义上的必需组件，但几乎所有 Kubernetes 集群都应该有集群 DNS， 因为很多示例都需要 DNS 服务。
- Web 界面（仪表盘）
  Dashboard 是Kubernetes 集群的通用的、基于 Web 的用户界面。 它使用户可以管理集群中运行的应用程序以及集群本身并进行故障排除。

- 容器资源监控
  容器资源监控 将关于容器的一些常见的时间序列度量值保存到一个集中的数据库中，并提供用于浏览这些数据的界面。

- 集群层面日志
  集群层面日志 机制负责将容器的日志数据 保存到一个集中的日志存储中，该存储能够提供搜索和浏览接口。

# 5-4 Kubernetes 的部署方案介绍

## 部署目标

- 在所有节点上安装Docker和kubeadm
- 部署Kubernetes Master
- 部署容器网络插件

## 部署架构

| ip             | 域名   | 备注     | 安装软件                               |
| -------------- | ------ | -------- | -------------------------------------- |
| 192.168.99.101 | master | 主节点   | Docker Kubeadm kubelet kubectl flannel |
| 192.168.99.102 | node1  | 从节点 1 | Docker Kubeadm kubelet kubectl         |
| 192.168.99.103 | node2  | 从节点 2 | Docker Kubeadm kubelet kubectl         |

## 环境准备

- 3台虚拟机CentOS7.x-86_x64
- 硬件配置：2GB或更多RAM，2个CPU或更多CPU，硬盘30GB或更多
- 集群中所有机器之间网络互通
- 可以访问外网，需要拉取镜像
- 禁止swap分区

# 5-5 Virtualbox 虚拟机配置双网卡实现固定IP

- Virtualbox安装 CentOS
- 配置虚机双网卡,实现固定 IP，且能访问外网
  网卡 1： 仅主机host-only
  网卡 2： 网络转换地址NAT
  查看虚拟机网络，点击管理—>主机网络管理器，记住ip地址（192.168.99.1），并选择“手动配置网卡”。
- 重启虚拟机，此时在虚拟机 ping www.baidu.com 是返回成功的。
- 设置外部网络访问虚拟机
  设置静态ip地址，编辑网络配置文件，编辑网络设置文件

```
vi /etc/sysconfig/network-scripts/ifcfg-enp0s3
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
#BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp0s3
UUID=08012b4a-d6b1-41d9-a34d-e0f52a123e7a
DEVICE=enp0s3
ONBOOT=yes
BOOTPROTO=static
IPADDR=192.168.99.101
```

- 重启网络

```
systemctl restart network
```

- 查看 enp0s3 网卡的 ip

```
[root@localhost Final]#ip addr |grep 192
inet 192.168.99.101/24 brd 192.168.99.255 scope global noprefixroute enp0s3
```

- 此时虚拟机既可以访问外网，也能够和宿主机( 192.168.31.178)进行通信

```
ping 192.168.31.178
PING 192.168.31.178 (192.168.31.178): 56 data bytes
64 bytes from 192.168.31.178: icmp_seq=0 ttl=64 time=0.060 ms
```

- 使用iTerm2 连接虚拟机


# 5-6 配置虚拟机 Yum 源，iptables

- 删除原有的yum源：

```sh
rm -f /etc/yum.repos.d/*
```

- 重新下载阿里云的yum源：

```sh
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

- 列出yum各软件包：

```sh
yum list
```

- 清除缓存：

```sh
yum clean all
```

# 5-7 Master节点安装 kubeadm, kubelet and kubectl

- 安装基本软件包

```sh
yum install wget net‐tools vim bash‐comp* ‐y
```

- 设置主机名，管理节点设置主机名为master

```
[root@master ~]# hostnamectl set‐hostname master
[root@master ~]# su ‐
```

- 配置 Master 和 work 节点的域名

```
vim /etc/hosts
 192.168.99.101 master
 192.168.99.102 node1
 192.168.99.103 node2
```

- 关闭 防火墙

```
systemctl stop firewalld
systemctl disable firewalld
```

- 关闭 SeLinux

```
setenforce 0
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
```

- 关闭 swap

```
swapoff -a
yes | cp /etc/fstab /etc/fstab_bak
cat /etc/fstab_bak |grep -v swap > /etc/fstab
```

- 配置Docker, K8S的阿里云yum源

```sh
[root@master ~]# cat >>/etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
[root@master ~]# wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
[root@master ~]# yum clean all
[root@master ~]# yum repolist
```

- 安装并启动 docker

```sh
yum install -y docker-ce.x86_64 docker-ce-cli.x86_64 containerd.io.x86_64

mkdir /etc/docker

cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": ["https://registry.cn-hangzhou.aliyuncs.com"],
  "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
```

- 编辑/usr/lib/systemd/system/docker.service

```sh
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd
```

```sh
# Restart Docker
systemctl daemon-reload
systemctl enable docker
systemctl restart docker
```

此时查看 docker info，可以看到默认 Cgroup Driver为 systemd

- 卸载旧版本

```sh
yum remove -y kubelet kubeadm kubectl
```

- 安装kubelet、kubeadm、kubectl

```sh
yum install -y kubelet.x86_64 kubeadm.x86_64 kubectl.x86_64
```

- 重启 docker，并启动 kubelet

```sh
systemctl enable kubelet && systemctl start kubelet
```

# 5-8 初始化Master 节点

- 将桥接的IPv4流量传递到iptables的链

```sh
echo "1" >/proc/sys/net/bridge/bridge-nf-call-iptables
vi /etc/sysctl.d/k8s.conf 
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1 
```

- 初始化主节点

```
kubeadm init --kubernetes-version=1.19.2 \
--apiserver-advertise-address=10.168.99.101 \
--image-repository registry.aliyuncs.com/google_containers \
--service-cidr=10.1.0.0/16 \
--pod-network-cidr=10.244.0.0/16

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

- 安装网络插件 Flannel

```sh
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

- 查看是否成功创建flannel网络

```sh
ifconfig |grep flannel
```

- 重置 kubeadm

```sh
kubeadm reset
```

# 5-9 安装配置 worker Node节点

- 初始虚拟机，Centos，配置双网卡
  ![图片描述](http://img.mukewang.com/wiki/5f81ad9709adac0715340828.jpg)
  ![图片描述](http://img.mukewang.com/wiki/5f81ada70971ea2315140770.jpg)
  注意 clone snapshot 虚拟机时，选择'Generate new MAC address'。
- ssh 免密登录
- 设置 ip 地址为 192.168.99.102
- 配置域名

```
hostnamectl set-hostname node1
vi /etc/hosts
192.168.99.101 master
192.168.99.102 node1
192.168.99.103 node2
```

- 配置阿里云 yum 源

```
[root@master ~]# cat >>/etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
[root@master ~]# wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
[root@master ~]# yum clean all
[root@master ~]# yum repolist
```

- 安装基础软件

```
yum install bash‐comp* vim net‐tools wget ‐y
```

- 安装 Docker，Kubeadm，Kubectl，kubelet

```
yum install docker-ce -y
systemctl start docker
systemctl enable docker
yum install kubelet kubeadm kubectl -y
systemctl enable kubelet
```

- kubadm join 加入集群

```
kubeadm join 192.168.99.101:6443 --token vrqf1w.dyg1wru7nz0ut9jz    --discovery-token-ca-cert-hash sha256:1832d6d6c8386de5ecb1a7f512cfdef27a6d14ef901ffbe7d3c01d999d794f90
```

默认token的有效期为24小时，当过期之后，该token就不可用了。解决方法如下：

重新生成新的token，在master端执行

```
kubeadm token create --print-join-command
```

- 将 master 节点的 admin.conf 拷贝到 node1

```
scp /etc/kubernetes/admin.conf root@node1:/etc/kubernetes/
```

- 配置 Kubeconfig 环境变量

```
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bash_profile
source ~/.bash_profile
```

- 安装 flannel 网络插件

```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

- 将master节点下面 /etc/cni/net.d/下面的所有文件拷贝到node节点上

在node1节点上面创建目录：
`mkdir -p /etc/cni/net.d/`

在master： 
`scp /etc/cni/net.d/* root@nodeip:/etc/cni/net.d/`

执行命令：
`kubectl get nodes 查看 node 节点处于ready状态`

- 检查集群状态
  稍等几分钟，在master节点输入命令检查集群状态.

```
kubectl get nodes
```





# 5-8 为容器定义相互依赖的环境变量
当创建一个 Pod 时，你可以为运行在 Pod 中的容器设置相互依赖的环境变量。 设置相互依赖的环境变量，你就可以在配置清单文件的  `env`  的  `value`  中使用 $(VAR_NAME)。

在本练习中，你会创建一个单容器的 Pod。 此 Pod 的配置文件定义了一个已定义常用用法的相互依赖的环境变量。 下面是 Pod 的配置清单：


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dependent-envars-demo
spec:
  containers:
    - name: dependent-envars-demo
      args:
        - while true; do echo -en '\n'; printf UNCHANGED_REFERENCE=$UNCHANGED_REFERENCE'\n'; printf SERVICE_ADDRESS=$SERVICE_ADDRESS'\n';printf ESCAPED_REFERENCE=$ESCAPED_REFERENCE'\n'; sleep 30; done;
      command:
        - sh
        - -c
      image: busybox
      env:
        - name: SERVICE_PORT
          value: "80"
        - name: SERVICE_IP
          value: "172.17.0.1"
        - name: UNCHANGED_REFERENCE
          value: "$(PROTOCOL)://$(SERVICE_IP):$(SERVICE_PORT)"
        - name: PROTOCOL
          value: "https"
        - name: SERVICE_ADDRESS
          value: "$(PROTOCOL)://$(SERVICE_IP):$(SERVICE_PORT)"
        - name: ESCAPED_REFERENCE
          value: "$$(PROTOCOL)://$(SERVICE_IP):$(SERVICE_PORT)"

```

1.  依据清单创建 Pod：
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
    
    ```
    
    ```
    pod/dependent-envars-demo created
    
    ```
    
2.  列出运行的 Pod：
    
    ```shell
    kubectl get pods dependent-envars-demo
    
    ```
    
    ```
    NAME                      READY     STATUS    RESTARTS   AGE
    dependent-envars-demo     1/1       Running   0          9s
    
    ```
    
3.  检查 Pod 中运行容器的日志：
    
    ```shell
    kubectl logs pod/dependent-envars-demo
    
    ```
    
    ```
    
    UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
    SERVICE_ADDRESS=https://172.17.0.1:80
    ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
    
    ```
    

如上所示，你已经定义了  `SERVICE_ADDRESS`  的正确依赖引用，  `UNCHANGED_REFERENCE`  的错误依赖引用， 并跳过了  `ESCAPED_REFERENCE`  的依赖引用。

如果环境变量被引用时已事先定义，则引用可以正确解析， 比如  `SERVICE_ADDRESS`  的例子。

当环境变量未定义或仅包含部分变量时，未定义的变量会被当做普通字符串对待， 比如  `UNCHANGED_REFERENCE`  的例子。 注意，解析不正确的环境变量通常不会阻止容器启动。

`$(VAR_NAME)`  这样的语法可以用两个  `$`  转义，既：`$$(VAR_NAME)`。 无论引用的变量是否定义，转义的引用永远不会展开。 这一点可以从上面  `ESCAPED_REFERENCE`  的例子得到印证。





# 6-2 创建 Service 连接到应用

## 在集群中暴露 Pod

创建一个 Nginx Pod，声明它具有一个容器端口80：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80


```

这使得可以从集群中任何一个节点来访问它。检查节点，该 Pod 正在运行：

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide

```

```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd

```

检查 Pod 的 IP 地址：

```shell
kubectl get pods -l run=my-nginx -o yaml | grep podIP
    podIP: 10.244.3.4
    podIP: 10.244.2.5

```

此时能够通过 ssh 登录到集群中的任何一个节点上，使用 curl 也能调通所有 IP 地址。 需要注意的是，容器不会使用该节点上的 80 端口，也不会使用任何特定的 NAT 规则去路由流量到 Pod 上。 这意味着可以在同一个节点上运行多个 Pod，使用相同的容器端口，并且可以从集群中任何其他的 Pod 或节点上使用 IP 的方式访问到它们。

## 创建 Service

Kubernetes Service 从逻辑上定义了运行在集群中的一组 Pod，这些 Pod 提供了相同的功能。 当每个 Service 创建时，会被分配一个唯一的 IP 地址（也称为 clusterIP）。 这个 IP 地址与一个 Service 的生命周期绑定在一起，当 Service 存在的时候它也不会改变。 可以配置 Pod 使它与 Service 进行通信，Pod 知道与 Service 通信将被自动地负载均衡到该 Service 中的某些 Pod 上。

可以使用  `kubectl expose`  命令为 2个 Nginx 副本创建一个 Service：

```shell
kubectl expose deployment/my-nginx
service/my-nginx exposed

```

这等价于使用  `kubectl create -f`  命令创建，对应如下的 yaml 文件：
nginx-svc.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx

```

上述规约将创建一个 Service，对应具有标签  `run: my-nginx`  的 Pod，目标 TCP 端口 80， 并且在一个抽象的 Service 端口（`targetPort`：容器接收流量的端口；`port`：抽象的 Service 端口，可以使任何其它 Pod 访问该 Service 的端口）上暴露。 查看你的 Service 资源:

```shell
kubectl get svc my-nginx

```

```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s

```

正如前面所提到的，一个 Service 由一组 backend Pod 组成。这些 Pod 通过  `endpoints`  暴露出来。 Service Selector 将持续观察，结果被 POST 到一个名称为  `my-nginx`  的 Endpoint 对象上。 当 Pod 终止后，它会自动从 Endpoint 中移除，新的能够匹配上 Service Selector 的 Pod 将自动地被添加到 Endpoint 中。 检查该 Endpoint，注意到 IP 地址与在第一步创建的 Pod 是相同的。

```shell
kubectl describe svc my-nginx

```

```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP:                  10.0.162.149
Port:                <unset> 80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>

```

```shell
kubectl get ep my-nginx

```

```
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m

```

现在，能够从集群中任意节点上使用 curl 命令请求 Nginx Service  `<CLUSTER-IP>:<PORT>`  。 注意 Service IP 完全是虚拟的，它从来没有走过网络。

## 访问 Service

Kubernetes支持两种查找服务的主要模式: 环境变量和DNS。 前者开箱即用，而后者则需要CoreDNS

### 环境变量

当 Pod 在 Node 上运行时，kubelet 会为每个活跃的 Service 添加一组环境变量。 这会有一个顺序的问题。想了解为何，检查正在运行的 Nginx Pod 的环境变量（Pod 名称将不会相同）：

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE

```

```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443

```







apiVersion: v1
kind: Pod
metadata:
  name: hostpath-pod
spec:
  containers:

  - name: test-container
    image: nginx
    volumeMounts:
    - mountPath: /test-nginx
      name: myhostpath
      volumes:
  - name: myhostpath
    hostPath:
      path: /tmp/nginx
      type: DirectoryOrCreate





# 4.1 深入理解容器镜像中心

- Dockerhub
  https://registry.hub.docker.com/
- 配置国内 Docker 镜像源

```
vi  /etc/docker/daemon.json
#修改后如下：
{
    "registry-mirrors": ["https://registry.docker-cn.com"],
    "live-restore": true
}
```

- 重启 docker 服务

```
systemctl restart docker
```

- 推送镜像到 dockerhub

```
docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: wangqingjiewa
Password:

Login Succeeded

docker tag kubeblog:1.0 wangqingjiewa/kubeblog:1.0
[root@localhost Final]# docker push wangqingjiewa/kubeblog:1.0
```

# 4.2 实践搭建私有镜像中心

## 安装 JFrog Container Registry(JCR)

```
mkdir -p $JFROG_HOME/artifactory/var/etc/
cd $JFROG_HOME/artifactory/var/etc/
touch ./system.yaml
chown -R 1030:1030 $JFROG_HOME/artifactory/var
chmod -R 777 $JFROG_HOME/artifactory/var

docker run --name artifactory-jcr -v $JFROG_HOME/artifactory/var/:/var/opt/jfrog/artifactory -d -p 8081:8081 -p 8082:8082 docker.bintray.io/jfrog/artifactory-jcr:latest
```

- 登录镜像中心JCR

```
localhost:8081
admin/passw0rd
```

# 4.3 将博客应用镜像上传到私有容器镜像中心进行管理

- 配置 JCR 本地域名

```
vi /etc/hosts
127.0.0.1 art.local
```

- 登录镜像中心

```
docker login art.local:8081 admin/passw0rd

docker build -t art.local:8081/docker-local/kubeblog:1.0 .

docker push art.local:8081/docker-local/kubeblog:1.0

```

- 登录 JCR 查看推送的镜像
