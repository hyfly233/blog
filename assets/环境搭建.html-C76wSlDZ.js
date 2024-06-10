import{_ as s,c as n,o as a,e}from"./app-B9NuXgA3.js";const l={},i=e(`<h2 id="基础环境" tabindex="-1"><a class="header-anchor" href="#基础环境"><span>基础环境</span></a></h2><ul><li>MacBook Pro M1 MacOS 13.3</li><li>VMware Fusion 13</li><li>CentOS-Stream-9-latest-aarch64-dvd1.iso</li></ul><h2 id="centos-配置" tabindex="-1"><a class="header-anchor" href="#centos-配置"><span>CentOS 配置</span></a></h2><h3 id="配置-ssh" tabindex="-1"><a class="header-anchor" href="#配置-ssh"><span>配置 ssh</span></a></h3><h4 id="开启-root-用户远程登录" tabindex="-1"><a class="header-anchor" href="#开启-root-用户远程登录"><span>开启 root 用户远程登录</span></a></h4><p>linux 系统是默认禁止远程登录 root 用户</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vi</span> /etc/ssh/sshd_config</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 替换内容</span></span>
<span class="line">PermitRootLogin <span class="token function">yes</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">service</span> sshd restart</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="导入-ssh-公钥" tabindex="-1"><a class="header-anchor" href="#导入-ssh-公钥"><span>导入 ssh 公钥</span></a></h4><p>使用远程工具通过 root 用户的密码登录</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vim</span> ~/.ssh/authorized_keys</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 将已有的 id_rsa.pub 公钥的内容复制进去</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="更换-yum-源" tabindex="-1"><a class="header-anchor" href="#更换-yum-源"><span>更换 yum 源</span></a></h3><h4 id="备份源配置" tabindex="-1"><a class="header-anchor" href="#备份源配置"><span>备份源配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">mv</span> /etc/yum.repos.d/centos.repo /etc/yum.repos.d/centos.repo.backup</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">mv</span> /etc/yum.repos.d/centos-addons.repo /etc/yum.repos.d/centos-addons.repo.backup</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="重写源配置" tabindex="-1"><a class="header-anchor" href="#重写源配置"><span>重写源配置</span></a></h4><p>将 <a href="https://mirrors.tuna.tsinghua.edu.cn/help/centos-stream/" target="_blank" rel="noopener noreferrer">清华大学开源软件镜像站-CentOS Stream 软件仓库镜像使用帮助</a></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vim</span> /etc/yum.repos.d/centos.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">vim</span> /etc/yum.repos.d/centos-addons.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 更新缓存</span></span>
<span class="line">yum makecache <span class="token operator">&amp;&amp;</span> yum update</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置静态-ip" tabindex="-1"><a class="header-anchor" href="#设置静态-ip"><span>设置静态 IP</span></a></h3><p>设置静态 IP</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /etc/NetworkManager/system-connections/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">ls</span>  <span class="token comment"># 如 ens160.nmconnection</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">vim</span> ens160.nmconnection</span>
<span class="line"><span class="token comment"># 配置参考</span></span>
<span class="line"><span class="token punctuation">[</span>connection<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">id</span><span class="token operator">=</span>ens160</span>
<span class="line"><span class="token assign-left variable">uuid</span><span class="token operator">=</span>e3e7f376-9406-3500-813a-6f9fb790b7fb</span>
<span class="line"><span class="token assign-left variable">type</span><span class="token operator">=</span>ethernet</span>
<span class="line">autoconnect-priority<span class="token operator">=</span>-999</span>
<span class="line">interface-name<span class="token operator">=</span>ens160</span>
<span class="line"><span class="token assign-left variable">timestamp</span><span class="token operator">=</span><span class="token number">1684422360</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>ipv4<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">address1</span><span class="token operator">=</span><span class="token number">192.168</span>.64.135/24,192.168.64.2</span>
<span class="line"><span class="token assign-left variable">dns</span><span class="token operator">=</span><span class="token number">114.114</span>.114.114</span>
<span class="line"><span class="token assign-left variable">method</span><span class="token operator">=</span>manual</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 重启网卡</span></span>
<span class="line">nmcli c reload <span class="token operator">&amp;&amp;</span> nmcli c up ens160 <span class="token comment"># 网卡名 ens160</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 关闭防火墙</span></span>
<span class="line">systemctl stop firewalld</span>
<span class="line">systemctl disable firewalld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-docker" tabindex="-1"><a class="header-anchor" href="#配置-docker"><span>配置 Docker</span></a></h2><h3 id="安装-docker" tabindex="-1"><a class="header-anchor" href="#安装-docker"><span>安装 Docker</span></a></h3><p>使用 <a href="https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/" target="_blank" rel="noopener noreferrer">清华大学开源软件镜像站-Docker CE 软件仓库镜像使用帮助</a> 脚本安装 Docker</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">DOWNLOAD_URL</span><span class="token operator">=</span><span class="token string">&quot;https://mirrors.tuna.tsinghua.edu.cn/docker-ce&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">wget</span> -O- https://get.docker.com/ <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token parameter variable">-E</span> <span class="token function">sh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 启动并加入开机启动</span></span>
<span class="line">systemctl start <span class="token function">docker</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置-docker-源镜像" tabindex="-1"><a class="header-anchor" href="#配置-docker-源镜像"><span>配置 Docker 源镜像</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vim</span> /etc/docker/daemon.json</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;https://dockerproxy.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://hub-mirror.c.163.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://mirror.baidubce.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://ccr.ccs.tencentyun.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://registry.cn-hangzhou.aliyuncs.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://registry.docker-cn.com&quot;</span></span>
<span class="line">  <span class="token punctuation">]</span>,</span>
<span class="line">  <span class="token string">&quot;exec-opts&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">&quot;native.cgroupdriver=systemd&quot;</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 重启 docker 服务</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span></span>
<span class="line">systemctl restart <span class="token function">docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-k8s" tabindex="-1"><a class="header-anchor" href="#配置-k8s"><span>配置 K8s</span></a></h2><h3 id="k8s-master" tabindex="-1"><a class="header-anchor" href="#k8s-master"><span>k8s-master</span></a></h3><h4 id="前置条件" tabindex="-1"><a class="header-anchor" href="#前置条件"><span>前置条件</span></a></h4><p>1、更改主机名</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">hostnamectl set-hostname k8s-master</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>2、配置节点的域名</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">vim</span> /etc/hosts</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置样例</span></span>
<span class="line"><span class="token number">192.168</span>.64.135 k8s-master</span>
<span class="line"><span class="token number">192.168</span>.64.136 k8s-node1</span>
<span class="line"><span class="token number">192.168</span>.64.137 k8s-node2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、将桥接的 IPv4 流量传递到 iptables</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">modprobe br_netfilter</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;1&quot;</span> <span class="token operator">&gt;</span>/proc/sys/net/bridge/bridge-nf-call-iptables</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">vim</span> /etc/sysctl.d/k8s.conf</span>
<span class="line"><span class="token comment"># step.3 输入值</span></span>
<span class="line">net.bridge.bridge-nf-call-ip6tables <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line">net.bridge.bridge-nf-call-iptables <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4</span></span>
<span class="line">systemctl stop firewalld</span>
<span class="line">systemctl disable firewalld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、关闭 SeLinux</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">setenforce <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/SELINUX=enforcing/SELINUX=disabled/g&quot;</span> /etc/selinux/config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、关闭 swap</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">swapoff <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">vim</span> /etc/fstab</span>
<span class="line"><span class="token comment"># step.2 注释掉如下 swap 配置</span></span>
<span class="line"><span class="token comment">#/dev/mapper/cs_192-swap none                    swap    defaults        0 0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 查看 swap 区是否清空</span></span>
<span class="line"><span class="token function">free</span> <span class="token parameter variable">-m</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h4><p>1、修改 kubernetes.repo 文件</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 备份</span></span>
<span class="line"><span class="token function">cp</span> /etc/yum.repos.d/kubernetes.repo /etc/yum.repos.d/kubernetes.repo.bak</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">vim</span> /etc/yum.repos.d/kubernetes.repo</span>
<span class="line"><span class="token comment"># step.2 操作系统无法解析 $basearch 变量, 可修改为 aarch64/armhfp/ppc64le/s390x/x86_64</span></span>
<span class="line"><span class="token punctuation">[</span>kubernetes<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">name</span><span class="token operator">=</span>Kubernetes</span>
<span class="line"><span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-<span class="token variable">$basearch</span>/</span>
<span class="line"><span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">repo_gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">yum repolist</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 安装版本为 1.23.6</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> kubelet-1.23.6 kubeadm-1.23.6 kubectl-1.23.6 <span class="token parameter variable">--disableexcludes</span><span class="token operator">=</span>kubernetes</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> kubelet</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 查看安装情况</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubelet          <span class="token comment"># kubelet-1.23.6-0.aarch64</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubeadm          <span class="token comment"># kubeadm-1.23.6-0.aarch64</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubectl          <span class="token comment"># kubectl-1.23.6-0.aarch64</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubernetes-cni   <span class="token comment"># kubernetes-cni-0.8.7-0.aarch64</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="初始化master节点" tabindex="-1"><a class="header-anchor" href="#初始化master节点"><span>初始化Master节点</span></a></h4><p>1、始化主节点</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 k8s 版本对应安装的版本，192.168.64.135 为 CentOS 本机地址</span></span>
<span class="line">kubeadm init --kubernetes-version<span class="token operator">=</span><span class="token number">1.23</span>.6 <span class="token punctuation">\\</span></span>
<span class="line">--apiserver-advertise-address<span class="token operator">=</span><span class="token number">192.168</span>.64.135 <span class="token punctuation">\\</span></span>
<span class="line">--image-repository registry.aliyuncs.com/google_containers <span class="token punctuation">\\</span></span>
<span class="line">--service-cidr<span class="token operator">=</span><span class="token number">10.1</span>.0.0/16 <span class="token punctuation">\\</span></span>
<span class="line">--pod-network-cidr<span class="token operator">=</span><span class="token number">10.244</span>.0.0/16</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4</span></span>
<span class="line"><span class="token function">cat</span> /etc/kubernetes/admin.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.6 配置 kubeconfig 地址</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;export KUBECONFIG=/etc/kubernetes/admin.conf&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.bash_profile</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.7</span></span>
<span class="line">kubectl get <span class="token function">node</span></span>
<span class="line"><span class="token comment"># NAME         STATUS     ROLES                  AGE   VERSION</span></span>
<span class="line"><span class="token comment"># k8s-master   NotReady   control-plane,master   12m   v1.23.6</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装 flannel 插件</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line">kubectl get pod <span class="token parameter variable">-n</span> kube-system</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">kubectl get nodes</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 镜像下载失败时</span></span>
<span class="line"><span class="token comment"># https://github.com/coreos/flannel/releases 仓库下载镜像 flanneld-v0.21.5-arm64.docker</span></span>
<span class="line"><span class="token comment"># other step.1</span></span>
<span class="line"><span class="token function">docker</span> load <span class="token operator">&lt;</span> flanneld-v0.21.5-arm64.docker</span>
<span class="line"></span>
<span class="line"><span class="token comment"># other step.2</span></span>
<span class="line"><span class="token function">docker</span> images</span>
<span class="line"></span>
<span class="line"><span class="token comment"># other step.3</span></span>
<span class="line">kubectl get pod <span class="token parameter variable">-n</span> kube-system</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装配置-worker-node" tabindex="-1"><a class="header-anchor" href="#安装配置-worker-node"><span>安装配置 worker node</span></a></h3><h3 id="k8s-node1" tabindex="-1"><a class="header-anchor" href="#k8s-node1"><span>k8s-node1</span></a></h3><h4 id="前置条件-1" tabindex="-1"><a class="header-anchor" href="#前置条件-1"><span>前置条件</span></a></h4><p>1、更改主机名</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">hostnamectl set-hostname k8s-node1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>2、配置节点的域名</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">vim</span> /etc/hosts</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置样例</span></span>
<span class="line"><span class="token number">192.168</span>.64.135 k8s-master</span>
<span class="line"><span class="token number">192.168</span>.64.136 k8s-node1</span>
<span class="line"><span class="token number">192.168</span>.64.137 k8s-node2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、将桥接的IPv4流量传递到 iptables</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">modprobe br_netfilter</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;1&quot;</span> <span class="token operator">&gt;</span>/proc/sys/net/bridge/bridge-nf-call-iptables</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">vim</span> /etc/sysctl.d/k8s.conf</span>
<span class="line"><span class="token comment"># step.3 输入值</span></span>
<span class="line">net.bridge.bridge-nf-call-ip6tables <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line">net.bridge.bridge-nf-call-iptables <span class="token operator">=</span> <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4</span></span>
<span class="line">systemctl stop firewalld</span>
<span class="line">systemctl disable firewalld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、关闭 SeLinux</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">setenforce <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;s/SELINUX=enforcing/SELINUX=disabled/g&quot;</span> /etc/selinux/config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、关闭 swap</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">swapoff <span class="token parameter variable">-a</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">vim</span> /etc/fstab</span>
<span class="line"><span class="token comment"># step.2 注释掉如下 swap 配置</span></span>
<span class="line"><span class="token comment">#/dev/mapper/cs_192-swap none                    swap    defaults        0 0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 查看 swap 区是否清空</span></span>
<span class="line"><span class="token function">free</span> <span class="token parameter variable">-m</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="安装-1" tabindex="-1"><a class="header-anchor" href="#安装-1"><span>安装</span></a></h4><p>1、修改 kubernetes.repo 文件</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 备份</span></span>
<span class="line"><span class="token function">cp</span> /etc/yum.repos.d/kubernetes.repo /etc/yum.repos.d/kubernetes.repo.bak</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">vim</span> /etc/yum.repos.d/kubernetes.repo</span>
<span class="line"><span class="token comment"># step.2 操作系统无法解析 $basearch 变量, 可修改为 aarch64/armhfp/ppc64le/s390x/x86_64</span></span>
<span class="line"><span class="token punctuation">[</span>kubernetes<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">name</span><span class="token operator">=</span>Kubernetes</span>
<span class="line"><span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-<span class="token variable">$basearch</span>/</span>
<span class="line"><span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">repo_gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">yum repolist</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、安装</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 安装版本为 1.23.6</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> kubelet-1.23.6 kubeadm-1.23.6 kubectl-1.23.6 <span class="token parameter variable">--disableexcludes</span><span class="token operator">=</span>kubernetes</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> kubelet</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 查看安装情况</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubelet          <span class="token comment"># kubelet-1.23.6-0.aarch64</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubeadm          <span class="token comment"># kubeadm-1.23.6-0.aarch64</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubectl          <span class="token comment"># kubectl-1.23.6-0.aarch64</span></span>
<span class="line"><span class="token function">rpm</span> <span class="token parameter variable">-qa</span> <span class="token operator">|</span> <span class="token function">grep</span> kubernetes-cni   <span class="token comment"># kubernetes-cni-0.8.7-0.aarch64</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、在 master 节点生成新的 token</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 master 节点执行</span></span>
<span class="line">kubeadm token create --print-join-command</span>
<span class="line"><span class="token comment"># kubeadm join 192.168.64.135:6443 --token 12tm05.n3h0e3lf2cmfxj37 --discovery-token-ca-cert-hash sha256:a81a5934acb4981485962138dc8599e9a428a2eefe03a7a03b805ef2b175f384</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 node 节点执行</span></span>
<span class="line">kubeadm <span class="token function">join</span> <span class="token number">192.168</span>.64.135:6443 <span class="token parameter variable">--token</span> 12tm05.n3h0e3lf2cmfxj37 --discovery-token-ca-cert-hash sha256:a81a5934acb4981485962138dc8599e9a428a2eefe03a7a03b805ef2b175f384</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、创建 net.d 相关文件</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 node 节点执行</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/cni/net.d/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 master 节点执行将文件复制到 k8s-node1 节点</span></span>
<span class="line"><span class="token function">scp</span> /etc/cni/net.d/* root@k8s-node1:/etc/cni/net.d/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">kubectl get nodes</span>
<span class="line"><span class="token comment"># NAME         STATUS   ROLES                  AGE     VERSION</span></span>
<span class="line"><span class="token comment"># k8s-master   Ready    control-plane,master   5h41m   v1.23.6</span></span>
<span class="line"><span class="token comment"># k8s-node1    Ready    &lt;none&gt;                 11m     v1.23.6</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装配置-dashboard" tabindex="-1"><a class="header-anchor" href="#安装配置-dashboard"><span>安装配置 dashboard</span></a></h3><p>1、安装配置 dashboard</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 下载 dashboard.yaml 文件</span></span>
<span class="line"><span class="token function">wget</span> <span class="token parameter variable">-O</span> kubernetes-dashboard.yaml https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 修改 service 类型为 NodePort</span></span>
<span class="line">kind: Service</span>
<span class="line">apiVersion: v1</span>
<span class="line">metadata:</span>
<span class="line">  labels:</span>
<span class="line">    k8s-app: kubernetes-dashboard</span>
<span class="line">  name: kubernetes-dashboard</span>
<span class="line">  namespace: kubernetes-dashboard</span>
<span class="line">spec:</span>
<span class="line">  type: NodePort          <span class="token comment"># 修改 1</span></span>
<span class="line">  ports:</span>
<span class="line">    - port: <span class="token number">443</span></span>
<span class="line">      targetPort: <span class="token number">8443</span></span>
<span class="line">      nodePort: <span class="token number">31111</span>     <span class="token comment"># 修改 2</span></span>
<span class="line">  selector:</span>
<span class="line">    k8s-app: kubernetes-dashboard</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">kubectl apply <span class="token parameter variable">-f</span> kubernetes-dashboard.yaml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4</span></span>
<span class="line">kubectl get svc <span class="token parameter variable">-n</span> kubernetes-dashboard</span>
<span class="line"><span class="token comment"># NAME                        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)         AGE</span></span>
<span class="line"><span class="token comment"># dashboard-metrics-scraper   ClusterIP   10.1.252.50    &lt;none&gt;        8000/TCP        3m38s</span></span>
<span class="line"><span class="token comment"># kubernetes-dashboard        NodePort    10.1.216.183   &lt;none&gt;        443:31111/TCP   3m38s</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、浏览器访问 <a href="https://192.168.64.135:31111/#/login" target="_blank" rel="noopener noreferrer">https://192.168.64.135:31111/#/login</a></p><p>3、获取 token</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl <span class="token parameter variable">-n</span> kube-system describe <span class="token variable"><span class="token variable">$(</span>kubectl <span class="token parameter variable">-n</span> kube-system get secret <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">-o</span> name <span class="token operator">|</span> <span class="token function">grep</span> namespace<span class="token variable">)</span></span> <span class="token operator">|</span> <span class="token function">grep</span> token</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>4、登录</p>`,77),p=[i];function c(t,r){return a(),n("div",null,p)}const o=s(l,[["render",c],["__file","环境搭建.html.vue"]]),m=JSON.parse('{"path":"/md/article/container/kubernetes/%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"基础环境","slug":"基础环境","link":"#基础环境","children":[]},{"level":2,"title":"CentOS 配置","slug":"centos-配置","link":"#centos-配置","children":[{"level":3,"title":"配置 ssh","slug":"配置-ssh","link":"#配置-ssh","children":[]},{"level":3,"title":"更换 yum 源","slug":"更换-yum-源","link":"#更换-yum-源","children":[]},{"level":3,"title":"设置静态 IP","slug":"设置静态-ip","link":"#设置静态-ip","children":[]}]},{"level":2,"title":"配置 Docker","slug":"配置-docker","link":"#配置-docker","children":[{"level":3,"title":"安装 Docker","slug":"安装-docker","link":"#安装-docker","children":[]},{"level":3,"title":"配置 Docker 源镜像","slug":"配置-docker-源镜像","link":"#配置-docker-源镜像","children":[]}]},{"level":2,"title":"配置 K8s","slug":"配置-k8s","link":"#配置-k8s","children":[{"level":3,"title":"k8s-master","slug":"k8s-master","link":"#k8s-master","children":[]},{"level":3,"title":"安装配置 worker node","slug":"安装配置-worker-node","link":"#安装配置-worker-node","children":[]},{"level":3,"title":"k8s-node1","slug":"k8s-node1","link":"#k8s-node1","children":[]},{"level":3,"title":"安装配置 dashboard","slug":"安装配置-dashboard","link":"#安装配置-dashboard","children":[]}]}],"git":{"updatedTime":1718025146000,"contributors":[{"name":"hyfly233","email":"hyfly233@outlook.com","commits":1}]},"filePathRelative":"md/article/container/kubernetes/环境搭建.md"}');export{o as comp,m as data};
