import{_ as l,M as t,p as c,q as r,R as n,t as s,N as i,a1 as e}from"./framework-39bdc1ba.js";const p={},d=e(`<h2 id="基础环境" tabindex="-1"><a class="header-anchor" href="#基础环境" aria-hidden="true">#</a> 基础环境</h2><ul><li>MacBook Pro M1 MacOS 13.3</li><li>VMware Fusion 13</li><li>CentOS-Stream-9-latest-aarch64-dvd1.iso</li></ul><h2 id="centos-配置" tabindex="-1"><a class="header-anchor" href="#centos-配置" aria-hidden="true">#</a> CentOS 配置</h2><h3 id="配置-ssh" tabindex="-1"><a class="header-anchor" href="#配置-ssh" aria-hidden="true">#</a> 配置 ssh</h3><h4 id="开启-root-用户远程登录" tabindex="-1"><a class="header-anchor" href="#开启-root-用户远程登录" aria-hidden="true">#</a> 开启 root 用户远程登录</h4><p>linux 系统是默认禁止远程登录 root 用户</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vi</span> /etc/ssh/sshd_config

<span class="token comment"># step.2 替换内容</span>
PermitRootLogin <span class="token function">yes</span>

<span class="token comment"># step.3</span>
<span class="token function">service</span> sshd restart
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="导入-ssh-公钥" tabindex="-1"><a class="header-anchor" href="#导入-ssh-公钥" aria-hidden="true">#</a> 导入 ssh 公钥</h4><p>使用远程工具通过 root 用户的密码登录</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vim</span> ~/.ssh/authorized_keys

<span class="token comment"># step.2 将已有的 id_rsa.pub 公钥的内容复制进去</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="更换-yum-源" tabindex="-1"><a class="header-anchor" href="#更换-yum-源" aria-hidden="true">#</a> 更换 yum 源</h3><h4 id="备份源配置" tabindex="-1"><a class="header-anchor" href="#备份源配置" aria-hidden="true">#</a> 备份源配置</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">mv</span> /etc/yum.repos.d/centos.repo /etc/yum.repos.d/centos.repo.backup

<span class="token comment"># step.2</span>
<span class="token function">mv</span> /etc/yum.repos.d/centos-addons.repo /etc/yum.repos.d/centos-addons.repo.backup
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="重写源配置" tabindex="-1"><a class="header-anchor" href="#重写源配置" aria-hidden="true">#</a> 重写源配置</h4>`,14),o={href:"https://mirrors.tuna.tsinghua.edu.cn/help/centos-stream/",target:"_blank",rel:"noopener noreferrer"},m=e(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vim</span> /etc/yum.repos.d/centos.repo

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/yum.repos.d/centos-addons.repo

<span class="token comment"># step.3 更新缓存</span>
yum makecache <span class="token operator">&amp;&amp;</span> yum update
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置静态-ip" tabindex="-1"><a class="header-anchor" href="#设置静态-ip" aria-hidden="true">#</a> 设置静态 IP</h3><p>设置静态 IP</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /etc/NetworkManager/system-connections/

<span class="token comment"># step.2</span>
<span class="token function">ls</span>  <span class="token comment"># 如 ens160.nmconnection</span>

<span class="token comment"># step.3</span>
<span class="token function">vim</span> ens160.nmconnection
<span class="token comment"># 配置参考</span>
<span class="token punctuation">[</span>connection<span class="token punctuation">]</span>
<span class="token assign-left variable">id</span><span class="token operator">=</span>ens160
<span class="token assign-left variable">uuid</span><span class="token operator">=</span>e3e7f376-9406-3500-813a-6f9fb790b7fb
<span class="token assign-left variable">type</span><span class="token operator">=</span>ethernet
autoconnect-priority<span class="token operator">=</span>-999
interface-name<span class="token operator">=</span>ens160
<span class="token assign-left variable">timestamp</span><span class="token operator">=</span><span class="token number">1684422360</span>

<span class="token punctuation">[</span>ipv4<span class="token punctuation">]</span>
<span class="token assign-left variable">address1</span><span class="token operator">=</span><span class="token number">192.168</span>.64.135/24,192.168.64.2
<span class="token assign-left variable">dns</span><span class="token operator">=</span><span class="token number">114.114</span>.114.114
<span class="token assign-left variable">method</span><span class="token operator">=</span>manual

<span class="token comment"># step.4 重启网卡</span>
nmcli c reload <span class="token operator">&amp;&amp;</span> nmcli c up ens160 <span class="token comment"># 网卡名 ens160</span>

<span class="token comment"># step.5 关闭防火墙</span>
systemctl stop firewalld
systemctl disable firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-docker" tabindex="-1"><a class="header-anchor" href="#配置-docker" aria-hidden="true">#</a> 配置 Docker</h2><h3 id="安装-docker" tabindex="-1"><a class="header-anchor" href="#安装-docker" aria-hidden="true">#</a> 安装 Docker</h3>`,6),v={href:"https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/",target:"_blank",rel:"noopener noreferrer"},u=e(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">DOWNLOAD_URL</span><span class="token operator">=</span><span class="token string">&quot;https://mirrors.tuna.tsinghua.edu.cn/docker-ce&quot;</span>

<span class="token comment"># step.2</span>
<span class="token function">wget</span> -O- https://get.docker.com/ <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token parameter variable">-E</span> <span class="token function">sh</span>

<span class="token comment"># step.3 启动并加入开机启动</span>
systemctl start <span class="token function">docker</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置-docker-源镜像" tabindex="-1"><a class="header-anchor" href="#配置-docker-源镜像" aria-hidden="true">#</a> 配置 Docker 源镜像</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vim</span> /etc/docker/daemon.json

<span class="token punctuation">{</span>
  <span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;https://dockerproxy.com&quot;</span>,
    <span class="token string">&quot;https://hub-mirror.c.163.com&quot;</span>,
    <span class="token string">&quot;https://mirror.baidubce.com&quot;</span>,
    <span class="token string">&quot;https://ccr.ccs.tencentyun.com&quot;</span>,
    <span class="token string">&quot;https://registry.cn-hangzhou.aliyuncs.com&quot;</span>,
    <span class="token string">&quot;https://registry.docker-cn.com&quot;</span>
  <span class="token punctuation">]</span>,
  <span class="token string">&quot;exec-opts&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&quot;native.cgroupdriver=systemd&quot;</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># step.2 重启 docker 服务</span>
systemctl daemon-reload
systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span>
systemctl restart <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-k8s" tabindex="-1"><a class="header-anchor" href="#配置-k8s" aria-hidden="true">#</a> 配置 K8s</h2><h3 id="k8s-master" tabindex="-1"><a class="header-anchor" href="#k8s-master" aria-hidden="true">#</a> k8s-master</h3><h4 id="前置条件" tabindex="-1"><a class="header-anchor" href="#前置条件" aria-hidden="true">#</a> 前置条件</h4><p>1、更改主机名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>hostnamectl set-hostname k8s-master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2、配置节点的域名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /etc/hosts

<span class="token comment"># 配置样例</span>
<span class="token number">192.168</span>.64.135 k8s-master
<span class="token number">192.168</span>.64.136 k8s-node1
<span class="token number">192.168</span>.64.137 k8s-node2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、将桥接的 IPv4 流量传递到 iptables</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
modprobe br_netfilter

<span class="token comment"># step.2</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;1&quot;</span> <span class="token operator">&gt;</span>/proc/sys/net/bridge/bridge-nf-call-iptables

<span class="token comment"># step.3</span>
<span class="token function">vim</span> /etc/sysctl.d/k8s.conf
<span class="token comment"># step.3 输入值</span>
net.bridge.bridge-nf-call-ip6tables <span class="token operator">=</span> <span class="token number">1</span>
net.bridge.bridge-nf-call-iptables <span class="token operator">=</span> <span class="token number">1</span>

<span class="token comment"># step.4</span>
systemctl stop firewalld
systemctl disable firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、关闭 SeLinux</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
setenforce <span class="token number">0</span>

<span class="token comment"># step.2</span>
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/SELINUX=enforcing/SELINUX=disabled/g&quot;</span> /etc/selinux/config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、关闭 swap</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
swapoff <span class="token parameter variable">-a</span>

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/fstab
<span class="token comment"># step.2 注释掉如下 swap 配置</span>
<span class="token comment">#/dev/mapper/cs_192-swap none                    swap    defaults        0 0</span>

<span class="token comment"># step.3 查看 swap 区是否清空</span>
<span class="token function">free</span> <span class="token parameter variable">-m</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h4><p>1、修改 kubernetes.repo 文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 备份</span>
<span class="token function">cp</span> /etc/yum.repos.d/kubernetes.repo /etc/yum.repos.d/kubernetes.repo.bak

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/yum.repos.d/kubernetes.repo
<span class="token comment"># step.2 操作系统无法解析 $basearch 变量, 可修改为 aarch64/armhfp/ppc64le/s390x/x86_64</span>
<span class="token punctuation">[</span>kubernetes<span class="token punctuation">]</span>
<span class="token assign-left variable">name</span><span class="token operator">=</span>Kubernetes
<span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-<span class="token variable">$basearch</span>/
<span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">repo_gpgcheck</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg

<span class="token comment"># step.3</span>
yum repolist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 安装版本为 1.23.6</span>
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> kubelet-1.23.6 kubeadm-1.23.6 kubectl-1.23.6 <span class="token parameter variable">--disableexcludes</span><span class="token operator">=</span>kubernetes

<span class="token comment"># step.2</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> kubelet

<span class="token comment"># step.3 查看安装情况</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubelet          <span class="token comment"># kubelet-1.23.6-0.aarch64</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubeadm          <span class="token comment"># kubeadm-1.23.6-0.aarch64</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubectl          <span class="token comment"># kubectl-1.23.6-0.aarch64</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubernetes-cni   <span class="token comment"># kubernetes-cni-0.8.7-0.aarch64</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="初始化master节点" tabindex="-1"><a class="header-anchor" href="#初始化master节点" aria-hidden="true">#</a> 初始化Master节点</h4><p>1、始化主节点</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 k8s 版本对应安装的版本，192.168.64.135 为 CentOS 本机地址</span>
kubeadm init --kubernetes-version<span class="token operator">=</span><span class="token number">1.23</span>.6 <span class="token punctuation">\\</span>
--apiserver-advertise-address<span class="token operator">=</span><span class="token number">192.168</span>.64.135 <span class="token punctuation">\\</span>
--image-repository registry.aliyuncs.com/google_containers <span class="token punctuation">\\</span>
--service-cidr<span class="token operator">=</span><span class="token number">10.1</span>.0.0/16 <span class="token punctuation">\\</span>
--pod-network-cidr<span class="token operator">=</span><span class="token number">10.244</span>.0.0/16

<span class="token comment"># step.2</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube

<span class="token comment"># step.3</span>
<span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config

<span class="token comment"># step.4</span>
<span class="token function">cat</span> /etc/kubernetes/admin.conf

<span class="token comment"># step.5</span>
<span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config

<span class="token comment"># step.6 配置 kubeconfig 地址</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;export KUBECONFIG=/etc/kubernetes/admin.conf&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.bash_profile

<span class="token comment"># step.7</span>
kubectl get <span class="token function">node</span>
<span class="token comment"># NAME         STATUS     ROLES                  AGE   VERSION</span>
<span class="token comment"># k8s-master   NotReady   control-plane,master   12m   v1.23.6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装 flannel 插件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
kubectl apply <span class="token parameter variable">-f</span> https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

<span class="token comment"># step.2</span>
kubectl get pod <span class="token parameter variable">-n</span> kube-system

<span class="token comment"># step.3</span>
kubectl get nodes

<span class="token comment"># 镜像下载失败时</span>
<span class="token comment"># https://github.com/coreos/flannel/releases 仓库下载镜像 flanneld-v0.21.5-arm64.docker</span>
<span class="token comment"># other step.1</span>
<span class="token function">docker</span> load <span class="token operator">&lt;</span> flanneld-v0.21.5-arm64.docker

<span class="token comment"># other step.2</span>
<span class="token function">docker</span> images

<span class="token comment"># other step.3</span>
kubectl get pod <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装配置-worker-node" tabindex="-1"><a class="header-anchor" href="#安装配置-worker-node" aria-hidden="true">#</a> 安装配置 worker node</h3><h3 id="k8s-node1" tabindex="-1"><a class="header-anchor" href="#k8s-node1" aria-hidden="true">#</a> k8s-node1</h3><h4 id="前置条件-1" tabindex="-1"><a class="header-anchor" href="#前置条件-1" aria-hidden="true">#</a> 前置条件</h4><p>1、更改主机名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>hostnamectl set-hostname k8s-node1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2、配置节点的域名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /etc/hosts

<span class="token comment"># 配置样例</span>
<span class="token number">192.168</span>.64.135 k8s-master
<span class="token number">192.168</span>.64.136 k8s-node1
<span class="token number">192.168</span>.64.137 k8s-node2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、将桥接的IPv4流量传递到 iptables</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
modprobe br_netfilter

<span class="token comment"># step.2</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;1&quot;</span> <span class="token operator">&gt;</span>/proc/sys/net/bridge/bridge-nf-call-iptables

<span class="token comment"># step.3</span>
<span class="token function">vim</span> /etc/sysctl.d/k8s.conf
<span class="token comment"># step.3 输入值</span>
net.bridge.bridge-nf-call-ip6tables <span class="token operator">=</span> <span class="token number">1</span>
net.bridge.bridge-nf-call-iptables <span class="token operator">=</span> <span class="token number">1</span>

<span class="token comment"># step.4</span>
systemctl stop firewalld
systemctl disable firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、关闭 SeLinux</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
setenforce <span class="token number">0</span>

<span class="token comment"># step.2</span>
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/SELINUX=enforcing/SELINUX=disabled/g&quot;</span> /etc/selinux/config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、关闭 swap</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
swapoff <span class="token parameter variable">-a</span>

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/fstab
<span class="token comment"># step.2 注释掉如下 swap 配置</span>
<span class="token comment">#/dev/mapper/cs_192-swap none                    swap    defaults        0 0</span>

<span class="token comment"># step.3 查看 swap 区是否清空</span>
<span class="token function">free</span> <span class="token parameter variable">-m</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="安装-1" tabindex="-1"><a class="header-anchor" href="#安装-1" aria-hidden="true">#</a> 安装</h4><p>1、修改 kubernetes.repo 文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 备份</span>
<span class="token function">cp</span> /etc/yum.repos.d/kubernetes.repo /etc/yum.repos.d/kubernetes.repo.bak

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/yum.repos.d/kubernetes.repo
<span class="token comment"># step.2 操作系统无法解析 $basearch 变量, 可修改为 aarch64/armhfp/ppc64le/s390x/x86_64</span>
<span class="token punctuation">[</span>kubernetes<span class="token punctuation">]</span>
<span class="token assign-left variable">name</span><span class="token operator">=</span>Kubernetes
<span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-<span class="token variable">$basearch</span>/
<span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">repo_gpgcheck</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg

<span class="token comment"># step.3</span>
yum repolist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 安装版本为 1.23.6</span>
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> kubelet-1.23.6 kubeadm-1.23.6 kubectl-1.23.6 <span class="token parameter variable">--disableexcludes</span><span class="token operator">=</span>kubernetes

<span class="token comment"># step.2</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> kubelet

<span class="token comment"># step.3 查看安装情况</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubelet          <span class="token comment"># kubelet-1.23.6-0.aarch64</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubeadm          <span class="token comment"># kubeadm-1.23.6-0.aarch64</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubectl          <span class="token comment"># kubectl-1.23.6-0.aarch64</span>
<span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubernetes-cni   <span class="token comment"># kubernetes-cni-0.8.7-0.aarch64</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、在 master 节点生成新的 token</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 master 节点执行</span>
kubeadm token create --print-join-command
<span class="token comment"># kubeadm join 192.168.64.135:6443 --token 12tm05.n3h0e3lf2cmfxj37 --discovery-token-ca-cert-hash sha256:a81a5934acb4981485962138dc8599e9a428a2eefe03a7a03b805ef2b175f384</span>

<span class="token comment"># step.2 node 节点执行</span>
kubeadm <span class="token function">join</span> <span class="token number">192.168</span>.64.135:6443 <span class="token parameter variable">--token</span> 12tm05.n3h0e3lf2cmfxj37 --discovery-token-ca-cert-hash sha256:a81a5934acb4981485962138dc8599e9a428a2eefe03a7a03b805ef2b175f384
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、创建 net.d 相关文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 node 节点执行</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/cni/net.d/

<span class="token comment"># step.2 master 节点执行将文件复制到 k8s-node1 节点</span>
<span class="token function">scp</span> /etc/cni/net.d/* root@k8s-node1:/etc/cni/net.d/

<span class="token comment"># step.3</span>
kubectl get nodes
<span class="token comment"># NAME         STATUS   ROLES                  AGE     VERSION</span>
<span class="token comment"># k8s-master   Ready    control-plane,master   5h41m   v1.23.6</span>
<span class="token comment"># k8s-node1    Ready    &lt;none&gt;                 11m     v1.23.6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装配置-dashboard" tabindex="-1"><a class="header-anchor" href="#安装配置-dashboard" aria-hidden="true">#</a> 安装配置 dashboard</h3><p>1、安装配置 dashboard</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 下载 dashboard.yaml 文件</span>
<span class="token function">wget</span> <span class="token parameter variable">-O</span> kubernetes-dashboard.yaml https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

<span class="token comment"># step.2 修改 service 类型为 NodePort</span>
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  type: NodePort          <span class="token comment"># 修改 1</span>
  ports:
    - port: <span class="token number">443</span>
      targetPort: <span class="token number">8443</span>
      nodePort: <span class="token number">31111</span>     <span class="token comment"># 修改 2</span>
  selector:
    k8s-app: kubernetes-dashboard

<span class="token comment"># step.3</span>
kubectl apply <span class="token parameter variable">-f</span> kubernetes-dashboard.yaml

<span class="token comment"># step.4</span>
kubectl get svc <span class="token parameter variable">-n</span> kubernetes-dashboard
<span class="token comment"># NAME                        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)         AGE</span>
<span class="token comment"># dashboard-metrics-scraper   ClusterIP   10.1.252.50    &lt;none&gt;        8000/TCP        3m38s</span>
<span class="token comment"># kubernetes-dashboard        NodePort    10.1.216.183   &lt;none&gt;        443:31111/TCP   3m38s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,51),b={href:"https://192.168.64.135:31111/#/login",target:"_blank",rel:"noopener noreferrer"},k=e(`<p>3、获取 token</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl <span class="token parameter variable">-n</span> kube-system describe <span class="token variable"><span class="token variable">$(</span>kubectl <span class="token parameter variable">-n</span> kube-system get secret <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">-o</span> name <span class="token operator">|</span> <span class="token function">grep</span> namespace<span class="token variable">)</span></span> <span class="token operator">|</span> <span class="token function">grep</span> token
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>4、登录</p>`,3);function h(g,f){const a=t("ExternalLinkIcon");return c(),r("div",null,[d,n("p",null,[s("将 "),n("a",o,[s("清华大学开源软件镜像站-CentOS Stream 软件仓库镜像使用帮助"),i(a)])]),m,n("p",null,[s("使用 "),n("a",v,[s("清华大学开源软件镜像站-Docker CE 软件仓库镜像使用帮助"),i(a)]),s(" 脚本安装 Docker")]),u,n("p",null,[s("2、浏览器访问 "),n("a",b,[s("https://192.168.64.135:31111/#/login"),i(a)])]),k])}const x=l(p,[["render",h],["__file","环境搭建.html.vue"]]);export{x as default};
