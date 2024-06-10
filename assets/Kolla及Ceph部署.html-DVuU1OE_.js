import{_ as s,c as n,o as a,e}from"./app-B9NuXgA3.js";const l={},i=e(`<h2 id="基础配置" tabindex="-1"><a class="header-anchor" href="#基础配置"><span>基础配置</span></a></h2><ul><li>CentOS 7.4 x86</li><li>Kolla-ansible Train</li><li>Ceph-ansible stable-4.0</li></ul><h2 id="基础环境配置" tabindex="-1"><a class="header-anchor" href="#基础环境配置"><span>基础环境配置</span></a></h2><h3 id="安装基础软件" tabindex="-1"><a class="header-anchor" href="#安装基础软件"><span>安装基础软件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 设置 yun 源</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^mirrorlist=|#mirrorlist=|g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">         <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">         <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\\</span>s</span>
<span class="line">         /etc/yum.repos.d/CentOS-*.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">sudo</span> yum makecache</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">sudo</span> yum update <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 安装基础软件</span></span>
<span class="line"><span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token function">vim</span> <span class="token function">git</span> <span class="token function">wget</span> gcc libffi-devel openssl-devel lvm2 chrony <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改主机-host-文件" tabindex="-1"><a class="header-anchor" href="#修改主机-host-文件"><span>修改主机 host 文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vim</span> /etc/hosts</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 添加内容</span></span>
<span class="line"><span class="token number">192.168</span>.93.101  node01</span>
<span class="line"><span class="token number">192.168</span>.93.102  node02</span>
<span class="line"><span class="token number">192.168</span>.93.103  node03</span>
<span class="line"><span class="token number">192.168</span>.93.104  node04</span>
<span class="line"><span class="token number">192.168</span>.93.105  node05</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置免密" tabindex="-1"><a class="header-anchor" href="#配置免密"><span>配置免密</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 生成密钥</span></span>
<span class="line">ssh-keygen <span class="token parameter variable">-b</span> <span class="token number">1024</span> <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-P</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 所有节点配置免密</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token number">5</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token keyword">do</span> <span class="token function">sudo</span> ssh-copy-id <span class="token parameter variable">-i</span> ~/.ssh/id_rsa.pub node0<span class="token variable">$i</span><span class="token punctuation">;</span> <span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关闭-selinux" tabindex="-1"><a class="header-anchor" href="#关闭-selinux"><span>关闭 Selinux</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">setenforce <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">vim</span> /etc/selinux/config</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 修改内容</span></span>
<span class="line"><span class="token assign-left variable">SELINUX</span><span class="token operator">=</span>disabled</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关闭防火墙" tabindex="-1"><a class="header-anchor" href="#关闭防火墙"><span>关闭防火墙</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">systemctl stop firewalld</span>
<span class="line">systemctl disable firewalld</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="磁盘结构" tabindex="-1"><a class="header-anchor" href="#磁盘结构"><span>磁盘结构</span></a></h3><p>执行 lsblk 命令，输出如下，使用 sdc、sdd 两个磁盘分区</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">lsblk</span>
<span class="line"></span>
<span class="line">NAME            MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT</span>
<span class="line">sda               <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk </span>
<span class="line">├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>     1G  <span class="token number">0</span> part /boot</span>
<span class="line">└─sda2            <span class="token number">8</span>:2    <span class="token number">0</span> <span class="token number">446</span>.1G  <span class="token number">0</span> part </span>
<span class="line">  ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span> <span class="token number">877</span>.3G  <span class="token number">0</span> lvm  /</span>
<span class="line">  └─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    16G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span></span>
<span class="line">sdb               <span class="token number">8</span>:16   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk </span>
<span class="line">sdc               <span class="token number">8</span>:32   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk </span>
<span class="line">sdd               <span class="token number">8</span>:48   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk </span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装-docker" tabindex="-1"><a class="header-anchor" href="#安装-docker"><span>安装 Docker</span></a></h2><h3 id="安装-docker-1" tabindex="-1"><a class="header-anchor" href="#安装-docker-1"><span>安装 docker</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils</span>
<span class="line"><span class="token function">sudo</span> yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">sudo</span> yum <span class="token function">install</span> docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 配置 Docker 镜像源</span></span>
<span class="line"><span class="token function">touch</span> /etc/docker/daemon.json <span class="token operator">&amp;&amp;</span> <span class="token function">vim</span> /etc/docker/daemon.json</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 内容</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;https://dockerproxy.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://hub-mirror.c.163.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://mirror.baidubce.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://ccr.ccs.tencentyun.com&quot;</span>,</span>
<span class="line">    <span class="token string">&quot;https://registry.docker-cn.com&quot;</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4</span></span>
<span class="line">systemctl daemon-reload</span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span> <span class="token operator">&amp;&amp;</span> systemctl start <span class="token function">docker</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置-docker-私有仓库" tabindex="-1"><a class="header-anchor" href="#配置-docker-私有仓库"><span>配置 Docker 私有仓库</span></a></h3><h4 id="编写-etc-docker-docker-compose-yaml" tabindex="-1"><a class="header-anchor" href="#编写-etc-docker-docker-compose-yaml"><span>编写 /etc/docker/docker-compose.yaml</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="line"><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">registry</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry<span class="token punctuation">:</span>2.8.2</span>
<span class="line">    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> docker_registry</span>
<span class="line">    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always</span>
<span class="line">    <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> 4000<span class="token punctuation">:</span><span class="token number">5000</span></span>
<span class="line">    <span class="token key atrule">volumes</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> ./registry<span class="token punctuation">:</span>/var/lib/registry</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装-pip" tabindex="-1"><a class="header-anchor" href="#安装-pip"><span>安装 PIP</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">yum <span class="token function">install</span> epel-release python-pip <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token function">mkdir</span> ~/.pip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 配置 pip 源</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> ~/.pip/pip.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF</span>
<span class="line">[global]</span>
<span class="line">timeout = 6000</span>
<span class="line">index-url = http://mirrors.aliyun.com/pypi/simple/</span>
<span class="line">trusted-host = mirrors.aliyun.com</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装-ceph-ansible" tabindex="-1"><a class="header-anchor" href="#安装-ceph-ansible"><span>安装 Ceph-Ansible</span></a></h2><h3 id="创建虚拟环境" tabindex="-1"><a class="header-anchor" href="#创建虚拟环境"><span>创建虚拟环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 安装虚拟环境依赖</span></span>
<span class="line">yum <span class="token function">install</span> python-devel libselinux-python python-virtualenv <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 创建虚拟环境</span></span>
<span class="line">virtualenv /opt/ceph/venv/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 激活虚拟环境</span></span>
<span class="line"><span class="token builtin class-name">source</span> /opt/ceph/venv/bin/activate</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="虚拟环境中安装-ceph-ansible-stable-4-0" tabindex="-1"><a class="header-anchor" href="#虚拟环境中安装-ceph-ansible-stable-4-0"><span>虚拟环境中安装 Ceph-Ansible stable-4.0</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 克隆源码</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph</span>
<span class="line"><span class="token function">git</span> clone https://github.com/ceph/ceph-ansible.git</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible <span class="token operator">&amp;&amp;</span> <span class="token function">git</span> checkout stable-4.0</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-U</span> pip</span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-U</span> setuptools</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 安装 ceph-ansible 依赖</span></span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-r</span> requirements.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 编辑 ansible 配置</span></span>
<span class="line"><span class="token function">vim</span> /etc/ansible/ansible.cfg</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 内容</span></span>
<span class="line"><span class="token punctuation">[</span>defaults<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">host_key_checking</span><span class="token operator">=</span>False</span>
<span class="line"><span class="token assign-left variable">pipelining</span><span class="token operator">=</span>True</span>
<span class="line"><span class="token assign-left variable">forks</span><span class="token operator">=</span><span class="token number">100</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编写-ceph-inventory" tabindex="-1"><a class="header-anchor" href="#编写-ceph-inventory"><span>编写 Ceph Inventory</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vim</span> /opt/ceph/ceph-ansible/hosts</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 内容 mons osds grafana-server 是必须要的</span></span>
<span class="line"><span class="token punctuation">[</span>mons<span class="token punctuation">]</span></span>
<span class="line">node0<span class="token punctuation">[</span><span class="token number">1</span>:5<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>osds<span class="token punctuation">]</span></span>
<span class="line">node0<span class="token punctuation">[</span><span class="token number">1</span>:5<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mgrs<span class="token punctuation">]</span></span>
<span class="line">node01</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>mdss<span class="token punctuation">]</span></span>
<span class="line">node01</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>grafana-server<span class="token punctuation">]</span></span>
<span class="line">node01</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-group-vars-all-yml-配置" tabindex="-1"><a class="header-anchor" href="#修改-group-vars-all-yml-配置"><span>修改 group_vars/all.yml 配置</span></a></h3><p>在 Docker 中部署 Ceph</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible/group_vars</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 备份 group_vars 下的文件</span></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">file</span> <span class="token keyword">in</span> *<span class="token punctuation">;</span> <span class="token keyword">do</span> <span class="token function">cp</span> <span class="token variable">$file</span> <span class="token variable">\${file<span class="token operator">%</span>.*}</span><span class="token punctuation">;</span> <span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 编辑 all.yml</span></span>
<span class="line"><span class="token function">vim</span> /opt/ceph/ceph-ansible/group_vars/all.yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 内容</span></span>
<span class="line">--- </span>
<span class="line">dummy:</span>
<span class="line">cluster: ceph</span>
<span class="line"></span>
<span class="line">mon_group_name: mons</span>
<span class="line">osd_group_name: osds</span>
<span class="line">rgw_group_name: rgws</span>
<span class="line">mds_group_name: mdss</span>
<span class="line">nfs_group_name: nfss</span>
<span class="line">rbdmirror_group_name: rbdmirrors</span>
<span class="line">client_group_name: clients</span>
<span class="line">iscsi_gw_group_name: iscsigws</span>
<span class="line">mgr_group_name: mgrs</span>
<span class="line">rgwloadbalancer_group_name: rgwloadbalancers</span>
<span class="line">grafana_server_group_name: grafana-server</span>
<span class="line"></span>
<span class="line">configure_firewall: False</span>
<span class="line"></span>
<span class="line">ntp_service_enabled: <span class="token boolean">false</span></span>
<span class="line"></span>
<span class="line">upgrade_ceph_packages: False</span>
<span class="line"></span>
<span class="line">ceph_origin: repository </span>
<span class="line">ceph_repository: community</span>
<span class="line">ceph_mirror: http://mirrors.aliyun.com/ceph </span>
<span class="line">ceph_stable_key: http://mirrors.aliyun.com/ceph/keys/release.asc </span>
<span class="line">ceph_stable_release: nautilus </span>
<span class="line">ceph_stable_repo: <span class="token string">&quot;{{ ceph_mirror }}/rpm-{{ ceph_stable_release }}&quot;</span></span>
<span class="line"></span>
<span class="line">monitor_interface: ens33</span>
<span class="line"></span>
<span class="line">public_network: <span class="token string">&quot;192.168.93.0/24&quot;</span></span>
<span class="line"></span>
<span class="line">radosgw_interface: ens33</span>
<span class="line"></span>
<span class="line">ceph_docker_image_tag: v4.0.22-stable-4.0-nautilus-centos-7-x86_64</span>
<span class="line">containerized_deployment: True</span>
<span class="line"></span>
<span class="line">dashboard_admin_password: password@123456</span>
<span class="line">grafana_admin_password: password@123456</span>
<span class="line"></span>
<span class="line">no_log_on_ceph_key_tasks: False</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-group-vars-osds-yml" tabindex="-1"><a class="header-anchor" href="#修改-group-vars-osds-yml"><span>修改 group_vars/osds.yml</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="line"><span class="token key atrule">devices</span><span class="token punctuation">:</span></span>
<span class="line">	<span class="token punctuation">-</span> /dev/sdb</span>
<span class="line">	<span class="token punctuation">-</span> /dev/sdc</span>
<span class="line">	<span class="token punctuation">-</span> /dev/sdd</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="docker-ceph-部署" tabindex="-1"><a class="header-anchor" href="#docker-ceph-部署"><span>Docker Ceph 部署</span></a></h3><p>可能遇到 ceph-ansible 和已安装的 docker 冲突的情况</p><ul><li><a href="https://github.com/ceph/ceph-ansible/issues/5159" target="_blank" rel="noopener noreferrer">https://github.com/ceph/ceph-ansible/issues/5159</a></li><li><a href="https://github.com/ceph/ceph-ansible/issues/3609" target="_blank" rel="noopener noreferrer">https://github.com/ceph/ceph-ansible/issues/3609</a></li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible</span>
<span class="line"><span class="token function">cp</span> site-container.yml.sample site-container.yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 验证连通性</span></span>
<span class="line">ansible <span class="token parameter variable">-i</span> hosts all <span class="token parameter variable">-m</span> <span class="token function">ping</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 部署 ceph</span></span>
<span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts site-container.yml <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/ceph/venv/bin/python <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或者指定 /usr/bin/python2</span></span>
<span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts site-container.yml <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/usr/bin/python2 <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署后-ceph-service-位置" tabindex="-1"><a class="header-anchor" href="#部署后-ceph-service-位置"><span>部署后 Ceph Service 位置</span></a></h3><p>ceph-ansible 将会把所有的 ceph 组件分别对应到各自的 service 中</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">ls</span> <span class="token parameter variable">-l</span> /etc/systemd/system/ceph*</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="出错回滚" tabindex="-1"><a class="header-anchor" href="#出错回滚"><span>出错回滚</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 清理集群，会将所有的容器和镜像全部清除</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible</span>
<span class="line"></span>
<span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts infrastructure-playbooks/purge-cluster.yml <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 手动清除 ceph 相关文件</span></span>
<span class="line"><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /etc/ceph/ <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/ceph/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 检测硬盘分区</span></span>
<span class="line">lsblk</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 如输出内容，需要移除 LVM 逻辑卷</span></span>
<span class="line">sdc     <span class="token number">8</span>:32   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk </span>
<span class="line">└─ceph--399e8b5a--4348xxxx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 移除 LVM 逻辑卷</span></span>
<span class="line">lvremove /dev/ceph-399e8b5a--4348xxxx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="集群升级" tabindex="-1"><a class="header-anchor" href="#集群升级"><span>集群升级</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># 升级集群</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible</span>
<span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts infrastructure-playbooks/rolling_update.yml <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问控制台" tabindex="-1"><a class="header-anchor" href="#访问控制台"><span>访问控制台</span></a></h3><ul><li>Ceph 控制台：https://192.168.93.101:8443/#/login，账号密码 admin/password@123456</li><li>Grafana 控制台：https://10.247.53.6:3000/login，账号密码 admin/password@123456</li></ul><h2 id="安装-kolla-ansible-train" tabindex="-1"><a class="header-anchor" href="#安装-kolla-ansible-train"><span>安装 Kolla Ansible Train</span></a></h2><h3 id="创建虚拟环境-1" tabindex="-1"><a class="header-anchor" href="#创建虚拟环境-1"><span>创建虚拟环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 安装虚拟环境依赖</span></span>
<span class="line">yum <span class="token function">install</span> python-devel libselinux-python python-virtualenv <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 创建虚拟环境</span></span>
<span class="line">virtualenv /opt/openstack/venv</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 激活</span></span>
<span class="line"><span class="token builtin class-name">source</span> /opt/openstack/venv/bin/activate</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装并配置-ansible" tabindex="-1"><a class="header-anchor" href="#安装并配置-ansible"><span>安装并配置 Ansible</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 </span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/openstack</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 在虚拟环境中执行</span></span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-U</span> pip</span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-U</span> setuptools</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line">pip <span class="token function">install</span> <span class="token string">&#39;ansible&lt;2.10&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">vim</span> /etc/ansible/ansible.cfg</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 内容</span></span>
<span class="line"><span class="token punctuation">[</span>defaults<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">host_key_checking</span><span class="token operator">=</span>False</span>
<span class="line"><span class="token assign-left variable">pipelining</span><span class="token operator">=</span>True</span>
<span class="line"><span class="token assign-left variable">forks</span><span class="token operator">=</span><span class="token number">100</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装-kolla-ansible" tabindex="-1"><a class="header-anchor" href="#安装-kolla-ansible"><span>安装 Kolla Ansible</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/openstack</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 拟环境中执行</span></span>
<span class="line">pip <span class="token function">install</span> kolla-ansible</span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-U</span> <span class="token function">docker</span></span>
<span class="line">pip <span class="token function">install</span> <span class="token parameter variable">-U</span> websocket-client</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/kolla</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chown</span> <span class="token environment constant">$USER</span><span class="token builtin class-name">:</span><span class="token environment constant">$USER</span> /etc/kolla</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 复制 kolla 的文件</span></span>
<span class="line"><span class="token function">cp</span> <span class="token parameter variable">-r</span> /opt/openstack/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla</span>
<span class="line"><span class="token function">cp</span> /opt/openstack/venv/share/kolla-ansible/ansible/inventory/* <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5</span></span>
<span class="line">ll</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-kolla-ansible-配置" tabindex="-1"><a class="header-anchor" href="#修改-kolla-ansible-配置"><span>修改 Kolla Ansible 配置</span></a></h3><h3 id="修改-inventory-文件-multinode" tabindex="-1"><a class="header-anchor" href="#修改-inventory-文件-multinode"><span>修改 Inventory 文件（multinode）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token punctuation">[</span>control<span class="token punctuation">]</span></span>
<span class="line">node0<span class="token punctuation">[</span><span class="token number">1</span>:3<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>network<span class="token punctuation">]</span></span>
<span class="line">node0<span class="token punctuation">[</span><span class="token number">1</span>:3<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>compute<span class="token punctuation">]</span></span>
<span class="line">node0<span class="token punctuation">[</span><span class="token number">1</span>:5<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>monitoring<span class="token punctuation">]</span></span>
<span class="line">node05</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>storage<span class="token punctuation">]</span></span>
<span class="line">node0<span class="token punctuation">[</span><span class="token number">1</span>:3<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>deployment<span class="token punctuation">]</span></span>
<span class="line">localhost       <span class="token assign-left variable">ansible_connection</span><span class="token operator">=</span>local</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生成-kolla-密钥" tabindex="-1"><a class="header-anchor" href="#生成-kolla-密钥"><span>生成 Kolla 密钥</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 执行</span></span>
<span class="line">kolla-genpwd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 查看内容，keystone_admin_password 可修改，登录 dashboard 会用到</span></span>
<span class="line"><span class="token function">cat</span> /etc/kolla/passwords.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-globals-yml" tabindex="-1"><a class="header-anchor" href="#修改-globals-yml"><span>修改 globals.yml</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/globals.yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 修改内容</span></span>
<span class="line">kolla_base_distro: <span class="token string">&quot;centos&quot;</span></span>
<span class="line"></span>
<span class="line">kolla_install_type: <span class="token string">&quot;binary&quot;</span></span>
<span class="line">openstack_release: <span class="token string">&quot;train&quot;</span></span>
<span class="line"></span>
<span class="line">kolla_internal_vip_address: <span class="token string">&quot;192.168.93.100&quot;</span> </span>
<span class="line"></span>
<span class="line">network_interface: <span class="token string">&quot;ens33&quot;</span></span>
<span class="line">neutron_external_interface: <span class="token string">&quot;ens35&quot;</span></span>
<span class="line"></span>
<span class="line">enable_cinder: <span class="token string">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line">enable_neutron_provider_networks: <span class="token string">&quot;yes&quot;</span> </span>
<span class="line"></span>
<span class="line">openstack_region_name: <span class="token string">&quot;RegionOne&quot;</span></span>
<span class="line"></span>
<span class="line">enable_chrony: <span class="token string">&quot;no&quot;</span></span>
<span class="line"></span>
<span class="line">enable_ceph: <span class="token string">&quot;no&quot;</span></span>
<span class="line">glance_backend_ceph: <span class="token string">&quot;yes&quot;</span></span>
<span class="line">cinder_backend_ceph: <span class="token string">&quot;yes&quot;</span></span>
<span class="line">nova_backend_ceph: <span class="token string">&quot;yes&quot;</span></span>
<span class="line">gnocchi_backend_storage: <span class="token string">&quot;ceph&quot;</span></span>
<span class="line">enable_manila_backend_cephfs_native: <span class="token string">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line">docker_custom_config:</span>
<span class="line">  registry-mirrors: </span>
<span class="line">    - http://192.168.93.1:4000</span>
<span class="line">    - https://dockerproxy.com</span>
<span class="line">    - https://hub-mirror.c.163.com</span>
<span class="line">    - https://mirror.baidubce.com</span>
<span class="line">    - https://ccr.ccs.tencentyun.com</span>
<span class="line">    - https://registry.docker-cn.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置-external-ceph" tabindex="-1"><a class="header-anchor" href="#设置-external-ceph"><span>设置 External ceph</span></a></h3><h4 id="创建-ceph-pool" tabindex="-1"><a class="header-anchor" href="#创建-ceph-pool"><span>创建 ceph pool</span></a></h4><p>在 ceph 中创建存储池 pool</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 进入 ceph 容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> ceph-mon /bin/sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 分别创建备份 pool</span></span>
<span class="line">ceph osd pool create images <span class="token number">128</span></span>
<span class="line">ceph osd pool create instances <span class="token number">128</span></span>
<span class="line">ceph osd pool create volumes <span class="token number">128</span></span>
<span class="line">ceph osd pool create backups <span class="token number">128</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 初始化 pool</span></span>
<span class="line">rbd pool init images</span>
<span class="line">rbd pool init instances</span>
<span class="line">rbd pool init volumes</span>
<span class="line">rbd pool init backups</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 查看 pool 的情况</span></span>
<span class="line">ceph osd pool <span class="token function">ls</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建-ceph-user" tabindex="-1"><a class="header-anchor" href="#创建-ceph-user"><span>创建 ceph user</span></a></h4><p>在 ceph 中创建对应 pool 的 user，输出的 keyring 将用于 openstack 集成 ceph</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 进入 ceph 容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> ceph-mon /bin/sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 创建 glance</span></span>
<span class="line">ceph auth get-or-create client.glance <span class="token punctuation">\\</span></span>
<span class="line">	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	osd <span class="token string">&#39;profile rbd pool=images&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	mgr <span class="token string">&#39;profile rbd pool=images&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line">	/tmp/ceph.client.glance.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 输出 keyring</span></span>
<span class="line"><span class="token function">cat</span> /tmp/ceph.client.glance.keyring</span>
<span class="line"><span class="token punctuation">[</span>client.glance<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> AQC627hkgS2WKhAAQLPn80a8m7CxysJ/vasvJA<span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 创建 cinder</span></span>
<span class="line">ceph auth get-or-create client.cinder <span class="token punctuation">\\</span></span>
<span class="line">	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	osd <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=instances, profile rbd-read-only pool=images&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	mgr <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=instances&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line">	/tmp/ceph.client.cinder.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 输出 keyring</span></span>
<span class="line"><span class="token function">cat</span> /tmp/ceph.client.cinder.keyring</span>
<span class="line"><span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A<span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 创建 cinder-backup</span></span>
<span class="line">ceph auth get-or-create client.cinder-backup <span class="token punctuation">\\</span></span>
<span class="line">	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	osd <span class="token string">&#39;profile rbd pool=backups&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	mgr <span class="token string">&#39;profile rbd pool=backups&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line">	/tmp/ceph.client.cinder-backup.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 输出 keyring</span></span>
<span class="line"><span class="token function">cat</span> /tmp/ceph.client.cinder-backup.keyring</span>
<span class="line"><span class="token punctuation">[</span>client.cinder-backup<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> AQAw3LhkgXPpLRAAUTqHmwNh29+nswRWjsUo+Q<span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 创建 nova</span></span>
<span class="line">ceph auth get-or-create client.nova <span class="token punctuation">\\</span></span>
<span class="line">	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	osd <span class="token string">&#39;profile rbd pool=instances&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	mgr <span class="token string">&#39;profile rbd pool=instances&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span></span>
<span class="line">	/tmp/ceph.client.nova.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 输出 keyring</span></span>
<span class="line"><span class="token function">cat</span> /tmp/ceph.client.nova.keyring</span>
<span class="line"><span class="token punctuation">[</span>client.nova<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA<span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.6 查看 user 的情况</span></span>
<span class="line">ceph auth <span class="token function">ls</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="glance-external-ceph" tabindex="-1"><a class="header-anchor" href="#glance-external-ceph"><span>Glance External ceph</span></a></h4><h5 id="设置-glance-api-conf" tabindex="-1"><a class="header-anchor" href="#设置-glance-api-conf"><span>设置 glance-api.conf</span></a></h5><p>在 glance-api.conf 中配置 RBD 后端存储</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 创建并编辑 glance-api.conf</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/glance/glance-api.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 内容</span></span>
<span class="line"><span class="token punctuation">[</span>glance_store<span class="token punctuation">]</span></span>
<span class="line">stores <span class="token operator">=</span> rbd</span>
<span class="line">default_store <span class="token operator">=</span> rbd</span>
<span class="line">rbd_store_pool <span class="token operator">=</span> images</span>
<span class="line">rbd_store_user <span class="token operator">=</span> glance</span>
<span class="line">rbd_store_ceph_conf <span class="token operator">=</span> /etc/ceph/ceph.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="设置-ceph-conf" tabindex="-1"><a class="header-anchor" href="#设置-ceph-conf"><span>设置 ceph.conf</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 复制 ceph.conf</span></span>
<span class="line"><span class="token function">cp</span> /etc/ceph/ceph.conf /etc/kolla/config/glance/ceph.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/glance/ceph.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 添加内容</span></span>
<span class="line"><span class="token punctuation">[</span>global<span class="token punctuation">]</span></span>
<span class="line">fsid <span class="token operator">=</span> 1d89fec3-325a-4963-a950-c4afedd37fe3</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加内容</span></span>
<span class="line">auth cluster required <span class="token operator">=</span> cephx</span>
<span class="line">auth <span class="token function">service</span> required <span class="token operator">=</span> cephx</span>
<span class="line">auth client required <span class="token operator">=</span> cephx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建-keyring" tabindex="-1"><a class="header-anchor" href="#创建-keyring"><span>创建 keyring</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 创建并编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/glance/ceph.client.glance.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 内容复制 /tmp/ceph.client.glance.keyring</span></span>
<span class="line"><span class="token punctuation">[</span>client.glance<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> <span class="token assign-left variable">AQAX9LNkAAAAABAA2qfvgDC4wqZm8PKBcWBY4g</span><span class="token operator">==</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="cinder-external-ceph" tabindex="-1"><a class="header-anchor" href="#cinder-external-ceph"><span>Cinder External ceph</span></a></h4><h5 id="设置-cinder-volume-conf" tabindex="-1"><a class="header-anchor" href="#设置-cinder-volume-conf"><span>设置 cinder-volume.conf</span></a></h5><p>cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 输出 cinder_rbd_secret_uuid</span></span>
<span class="line"><span class="token function">cat</span> /etc/kolla/passwords.yml <span class="token operator">|</span> <span class="token function">grep</span> cinder_rbd_secret_uuid</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 创建并编辑 cinder-volume.conf</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/cinder/cinder-volume.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 内容 cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中</span></span>
<span class="line"><span class="token punctuation">[</span>DEFAULT<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">enabled_backends</span><span class="token operator">=</span>rbd-1</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>rbd-1<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf</span>
<span class="line"><span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>cinder</span>
<span class="line"><span class="token assign-left variable">backend_host</span><span class="token operator">=</span>rbd:volumes</span>
<span class="line"><span class="token assign-left variable">rbd_pool</span><span class="token operator">=</span>volumes</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">volume_backend_name</span><span class="token operator">=</span>rbd-1</span>
<span class="line"><span class="token assign-left variable">volume_driver</span><span class="token operator">=</span>cinder.volume.drivers.rbd.RBDDriver</span>
<span class="line">rbd_secret_uuid <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> cinder_rbd_secret_uuid <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="挂载多个存储池" tabindex="-1"><a class="header-anchor" href="#挂载多个存储池"><span>挂载多个存储池</span></a></h6><ol><li><p>创建新的 pool</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">ceph osd pool create volumes_two <span class="token number">128</span></span>
<span class="line"></span>
<span class="line">rbd pool init volumes_two</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>更新 ceph 的 client.cinder user</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">ceph auth caps client.cinder <span class="token punctuation">\\</span></span>
<span class="line">	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	osd <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=volumes_two, profile rbd pool=instances, profile rbd-read-only pool=images&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">	mgr <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=volumes_two, profile rbd pool=instances&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>设置 cinder-volume.conf</p><p>cinder-volume 挂载多个池时的 cinder-volume.conf，如果已经使用 kolla 部署了 Openstack 则可以直接修改对应的 cinder 节点上的 /etc/kolla/cinder-volume/cinder.conf 后重启 cinder_volume 容器</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token punctuation">[</span>DEFAULT<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">enabled_backends</span><span class="token operator">=</span>rbd-1,rbd-2</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>rbd-1<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf</span>
<span class="line"><span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>cinder</span>
<span class="line"><span class="token assign-left variable">backend_host</span><span class="token operator">=</span>rbd:volumes</span>
<span class="line"><span class="token assign-left variable">rbd_pool</span><span class="token operator">=</span>volumes</span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">volume_backend_name</span><span class="token operator">=</span>rbd-1</span>
<span class="line"><span class="token assign-left variable">volume_driver</span><span class="token operator">=</span>cinder.volume.drivers.rbd.RBDDriver</span>
<span class="line">rbd_secret_uuid <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> cinder_rbd_secret_uuid <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>rbd-2<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf</span>
<span class="line"><span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>cinder                   <span class="token comment"># 需要 ceph auth caps 命令更新 user</span></span>
<span class="line"><span class="token assign-left variable">backend_host</span><span class="token operator">=</span>rbd:volumes</span>
<span class="line"><span class="token assign-left variable">rbd_pool</span><span class="token operator">=</span>volumes_two</span>
<span class="line"><span class="token assign-left variable">volume_backend_name</span><span class="token operator">=</span>rbd-2</span>
<span class="line"><span class="token assign-left variable">volume_driver</span><span class="token operator">=</span>cinder.volume.drivers.rbd.RBDDriver</span>
<span class="line">rbd_secret_uuid <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> cinder_rbd_secret_uuid <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h5 id="设置-cinder-backup-conf" tabindex="-1"><a class="header-anchor" href="#设置-cinder-backup-conf"><span>设置 cinder-backup.conf</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 创建并编辑 cinder-volume.conf</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/cinder/cinder-backup.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 内容</span></span>
<span class="line"><span class="token punctuation">[</span>DEFAULT<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">backup_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf</span>
<span class="line"><span class="token assign-left variable">backup_ceph_user</span><span class="token operator">=</span>cinder-backup</span>
<span class="line">backup_ceph_chunk_size <span class="token operator">=</span> <span class="token number">134217728</span></span>
<span class="line"><span class="token assign-left variable">backup_ceph_pool</span><span class="token operator">=</span>backups</span>
<span class="line"></span>
<span class="line">backup_driver <span class="token operator">=</span> cinder.backup.drivers.ceph.CephBackupDriver</span>
<span class="line">backup_ceph_stripe_unit <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">backup_ceph_stripe_count <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">restore_discard_excess_bytes <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="设置-ceph-conf-1" tabindex="-1"><a class="header-anchor" href="#设置-ceph-conf-1"><span>设置 ceph.conf</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 复制 ceph.conf</span></span>
<span class="line"><span class="token function">cp</span> /etc/ceph/ceph.conf /etc/kolla/config/cinder/ceph.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/cinder/ceph.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 添加内容</span></span>
<span class="line"><span class="token punctuation">[</span>global<span class="token punctuation">]</span></span>
<span class="line">fsid <span class="token operator">=</span> 1d89fec3-325a-4963-a950-c4afedd37fe3</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加内容</span></span>
<span class="line">auth cluster required <span class="token operator">=</span> cephx</span>
<span class="line">auth <span class="token function">service</span> required <span class="token operator">=</span> cephx</span>
<span class="line">auth client required <span class="token operator">=</span> cephx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建-keyring-1" tabindex="-1"><a class="header-anchor" href="#创建-keyring-1"><span>创建 keyring</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 创建并编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 内容复制 /tmp/ceph.client.cinder.keyring</span></span>
<span class="line"><span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> <span class="token assign-left variable">AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w</span><span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 创建并编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder-backup.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 内容复制 /tmp/ceph.client.cinder-backup.keyring</span></span>
<span class="line"><span class="token punctuation">[</span>client.cinder-backup<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> <span class="token assign-left variable">AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w</span><span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 创建并编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 内容复制 /tmp/ceph.client.cinder.keyring</span></span>
<span class="line"><span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> <span class="token assign-left variable">AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w</span><span class="token operator">==</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nova-external-ceph" tabindex="-1"><a class="header-anchor" href="#nova-external-ceph"><span>Nova External ceph</span></a></h4><p>如果使用 ceph-ansible 部署的 ceph，需要将 ceph.client.cinder.keyring 复制为 /etc/kolla/config/nova/ceph.client.nova.keyring</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 复制 ceph.conf</span></span>
<span class="line"><span class="token function">cp</span> /etc/ceph/ceph.conf /etc/kolla/config/ceph.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/ceph.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 添加内容</span></span>
<span class="line"><span class="token punctuation">[</span>global<span class="token punctuation">]</span></span>
<span class="line">fsid <span class="token operator">=</span> 1d89fec3-325a-4963-a950-c4afedd37fe3</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加内容</span></span>
<span class="line">auth cluster required <span class="token operator">=</span> cephx</span>
<span class="line">auth <span class="token function">service</span> required <span class="token operator">=</span> cephx</span>
<span class="line">auth client required <span class="token operator">=</span> cephx</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 复制 ceph.client.cinder.keyring</span></span>
<span class="line"><span class="token function">cp</span> /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring /etc/kolla/config/nova/ceph.client.nova.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 编辑 ceph.client.nova.keyring</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/nova/ceph.client.nova.keyring</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 添加内容复制 /tmp/ceph.client.nova.keyring</span></span>
<span class="line"><span class="token punctuation">[</span>client.nova<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA<span class="token operator">==</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span></span>
<span class="line">key <span class="token operator">=</span> AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A<span class="token operator">==</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建-nova-compute-conf" tabindex="-1"><a class="header-anchor" href="#创建-nova-compute-conf"><span>创建 nova-compute.conf</span></a></h5><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 创建并编辑</span></span>
<span class="line"><span class="token function">vim</span> /etc/kolla/config/nova/nova-compute.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.1 内容</span></span>
<span class="line"><span class="token punctuation">[</span>libvirt<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">images_rbd_pool</span><span class="token operator">=</span>instances</span>
<span class="line"><span class="token assign-left variable">images_type</span><span class="token operator">=</span>rbd</span>
<span class="line"><span class="token assign-left variable">images_rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf</span>
<span class="line"><span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>nova</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构"><span>目录结构</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">tree /etc/kolla/config/</span>
<span class="line"></span>
<span class="line">/etc/kolla/config/</span>
<span class="line">├── cinder</span>
<span class="line">│   ├── ceph.conf</span>
<span class="line">│   ├── cinder-backup</span>
<span class="line">│   │   ├── ceph.client.cinder-backup.keyring</span>
<span class="line">│   │   └── ceph.client.cinder.keyring</span>
<span class="line">│   ├── cinder-backup.conf</span>
<span class="line">│   ├── cinder-volume</span>
<span class="line">│   │   └── ceph.client.cinder.keyring</span>
<span class="line">│   └── cinder-volume.conf</span>
<span class="line">├── glance</span>
<span class="line">│   ├── ceph.client.glance.keyring</span>
<span class="line">│   ├── ceph.conf</span>
<span class="line">│   └── glance-api.conf</span>
<span class="line">└── nova</span>
<span class="line">    ├── ceph.client.cinder.keyring</span>
<span class="line">    ├── ceph.client.nova.keyring</span>
<span class="line">    ├── ceph.conf</span>
<span class="line">    └── nova-compute.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-openstack" tabindex="-1"><a class="header-anchor" href="#部署-openstack"><span>部署 OpenStack</span></a></h2><h3 id="安装-openstack" tabindex="-1"><a class="header-anchor" href="#安装-openstack"><span>安装 OpenStack</span></a></h3><ul><li>virtualenv: <a href="https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html" target="_blank" rel="noopener noreferrer">https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html</a></li><li>ansible_python_interpreter: <a href="https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html" target="_blank" rel="noopener noreferrer">https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html</a></li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 检测节点连通性</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/openstack</span>
<span class="line">ansible <span class="token parameter variable">-i</span> multinode all <span class="token parameter variable">-m</span> <span class="token function">ping</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode certificates</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 根据 Kolla 部署依赖创建服务器</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode bootstrap-servers <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 部署前检查主机</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode prechecks <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/openstack/venv/bin/python <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvvv</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 拉取镜像</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode pull <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/openstack/venv/bin/python <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvvv</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.6 部署 OpenStack</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode deploy <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/openstack/venv/bin/python <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvvv</span></span>
<span class="line"></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode deploy <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvvv</span></span>
<span class="line">	</span>
<span class="line"><span class="token comment">##################</span></span>
<span class="line"><span class="token comment"># 停止所有节点 openstack 服务</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode stop <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	--yes-i-really-really-mean-it <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvvv</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 销毁所有节点 openstack 服务</span></span>
<span class="line">kolla-ansible <span class="token parameter variable">-i</span> multinode destroy <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span></span>
<span class="line">	--yes-i-really-really-mean-it <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvvv</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-openstack" tabindex="-1"><a class="header-anchor" href="#使用-openstack"><span>使用 OpenStack</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 安装 OpenStack CLI 客户端</span></span>
<span class="line">pip <span class="token function">install</span> python-openstackclient python-glanceclient python-neutronclient <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 生成 openrc 文件</span></span>
<span class="line">kolla-ansible post-deploy</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 执行脚本，将密码设置到环境变量中</span></span>
<span class="line"><span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 执行脚本生成示例网络、镜像、实例等</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /usr/local/share/kolla-ansible <span class="token operator">&amp;&amp;</span> ./init-runonce</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问-horizon" tabindex="-1"><a class="header-anchor" href="#访问-horizon"><span>访问 horizon</span></a></h3><p>访问 ip 地址可进入 horizon 登录界面</p><ul><li>用户名：admin</li><li>密码：查看 /etc/kolla/passwords.yml</li></ul><h2 id="创建镜像" tabindex="-1"><a class="header-anchor" href="#创建镜像"><span>创建镜像</span></a></h2><p>OpenStack 默认支持的镜像 <a href="https://docs.openstack.org/image-guide/obtain-images.html" target="_blank" rel="noopener noreferrer">https://docs.openstack.org/image-guide/obtain-images.html</a></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">yum <span class="token function">install</span> libguestfs-tools <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">LIBGUESTFS_BACKEND</span><span class="token operator">=</span>direct</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 设置镜像密码，否则会创建虚拟机时会随机生成密码</span></span>
<span class="line">virt-customize <span class="token parameter variable">-a</span> ./CentOS-7-x86_64-GenericCloud-2009.qcow2 <span class="token punctuation">\\</span></span>
<span class="line">  --root-password password:123456</span>
<span class="line"></span>
<span class="line">virt-customize <span class="token parameter variable">-a</span> ./debian-9.13.42-20220706-openstack-amd64.qcow2 <span class="token punctuation">\\</span></span>
<span class="line">  --root-password password:123456</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 创建 glance 镜像</span></span>
<span class="line">openstack image create <span class="token string">&quot;CentOS-7-x86_64-GenericCloud-2009&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--public</span> <span class="token punctuation">\\</span></span>
<span class="line">  --min-ram <span class="token number">512</span> <span class="token punctuation">\\</span></span>
<span class="line">  --min-disk <span class="token number">20</span> <span class="token punctuation">\\</span></span>
<span class="line">  --disk-format qcow2 <span class="token punctuation">\\</span></span>
<span class="line">  --container-format bare <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--file</span> ./CentOS-7-x86_64-GenericCloud-2009.qcow2</span>
<span class="line"></span>
<span class="line">openstack image create <span class="token string">&quot;debian-9.13.42-20220706-openstack-amd64&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--public</span> <span class="token punctuation">\\</span></span>
<span class="line">  --min-ram <span class="token number">512</span> <span class="token punctuation">\\</span></span>
<span class="line">  --min-disk <span class="token number">20</span> <span class="token punctuation">\\</span></span>
<span class="line">  --disk-format qcow2 <span class="token punctuation">\\</span></span>
<span class="line">  --container-format bare <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--file</span> ./debian-9.13.42-20220706-openstack-amd64.qcow2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,109),p=[i];function c(t,r){return a(),n("div",null,p)}const d=s(l,[["render",c],["__file","Kolla及Ceph部署.html.vue"]]),v=JSON.parse('{"path":"/md/article/cloud/openstack/Kolla%E5%8F%8ACeph%E9%83%A8%E7%BD%B2.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"基础配置","slug":"基础配置","link":"#基础配置","children":[]},{"level":2,"title":"基础环境配置","slug":"基础环境配置","link":"#基础环境配置","children":[{"level":3,"title":"安装基础软件","slug":"安装基础软件","link":"#安装基础软件","children":[]},{"level":3,"title":"修改主机 host 文件","slug":"修改主机-host-文件","link":"#修改主机-host-文件","children":[]},{"level":3,"title":"配置免密","slug":"配置免密","link":"#配置免密","children":[]},{"level":3,"title":"关闭 Selinux","slug":"关闭-selinux","link":"#关闭-selinux","children":[]},{"level":3,"title":"关闭防火墙","slug":"关闭防火墙","link":"#关闭防火墙","children":[]},{"level":3,"title":"磁盘结构","slug":"磁盘结构","link":"#磁盘结构","children":[]}]},{"level":2,"title":"安装 Docker","slug":"安装-docker","link":"#安装-docker","children":[{"level":3,"title":"安装 docker","slug":"安装-docker-1","link":"#安装-docker-1","children":[]},{"level":3,"title":"配置 Docker 私有仓库","slug":"配置-docker-私有仓库","link":"#配置-docker-私有仓库","children":[]}]},{"level":2,"title":"安装 PIP","slug":"安装-pip","link":"#安装-pip","children":[]},{"level":2,"title":"安装 Ceph-Ansible","slug":"安装-ceph-ansible","link":"#安装-ceph-ansible","children":[{"level":3,"title":"创建虚拟环境","slug":"创建虚拟环境","link":"#创建虚拟环境","children":[]},{"level":3,"title":"虚拟环境中安装 Ceph-Ansible stable-4.0","slug":"虚拟环境中安装-ceph-ansible-stable-4-0","link":"#虚拟环境中安装-ceph-ansible-stable-4-0","children":[]},{"level":3,"title":"编写 Ceph Inventory","slug":"编写-ceph-inventory","link":"#编写-ceph-inventory","children":[]},{"level":3,"title":"修改 group_vars/all.yml 配置","slug":"修改-group-vars-all-yml-配置","link":"#修改-group-vars-all-yml-配置","children":[]},{"level":3,"title":"修改 group_vars/osds.yml","slug":"修改-group-vars-osds-yml","link":"#修改-group-vars-osds-yml","children":[]},{"level":3,"title":"Docker Ceph 部署","slug":"docker-ceph-部署","link":"#docker-ceph-部署","children":[]},{"level":3,"title":"部署后 Ceph Service 位置","slug":"部署后-ceph-service-位置","link":"#部署后-ceph-service-位置","children":[]},{"level":3,"title":"出错回滚","slug":"出错回滚","link":"#出错回滚","children":[]},{"level":3,"title":"集群升级","slug":"集群升级","link":"#集群升级","children":[]},{"level":3,"title":"访问控制台","slug":"访问控制台","link":"#访问控制台","children":[]}]},{"level":2,"title":"安装 Kolla Ansible Train","slug":"安装-kolla-ansible-train","link":"#安装-kolla-ansible-train","children":[{"level":3,"title":"创建虚拟环境","slug":"创建虚拟环境-1","link":"#创建虚拟环境-1","children":[]},{"level":3,"title":"安装并配置 Ansible","slug":"安装并配置-ansible","link":"#安装并配置-ansible","children":[]},{"level":3,"title":"安装 Kolla Ansible","slug":"安装-kolla-ansible","link":"#安装-kolla-ansible","children":[]},{"level":3,"title":"修改 Kolla Ansible 配置","slug":"修改-kolla-ansible-配置","link":"#修改-kolla-ansible-配置","children":[]},{"level":3,"title":"修改 Inventory 文件（multinode）","slug":"修改-inventory-文件-multinode","link":"#修改-inventory-文件-multinode","children":[]},{"level":3,"title":"生成 Kolla 密钥","slug":"生成-kolla-密钥","link":"#生成-kolla-密钥","children":[]},{"level":3,"title":"修改 globals.yml","slug":"修改-globals-yml","link":"#修改-globals-yml","children":[]},{"level":3,"title":"设置 External ceph","slug":"设置-external-ceph","link":"#设置-external-ceph","children":[]}]},{"level":2,"title":"部署 OpenStack","slug":"部署-openstack","link":"#部署-openstack","children":[{"level":3,"title":"安装 OpenStack","slug":"安装-openstack","link":"#安装-openstack","children":[]},{"level":3,"title":"使用 OpenStack","slug":"使用-openstack","link":"#使用-openstack","children":[]},{"level":3,"title":"访问 horizon","slug":"访问-horizon","link":"#访问-horizon","children":[]}]},{"level":2,"title":"创建镜像","slug":"创建镜像","link":"#创建镜像","children":[]}],"git":{"updatedTime":1718025146000,"contributors":[{"name":"hyfly233","email":"hyfly233@outlook.com","commits":1}]},"filePathRelative":"md/article/cloud/openstack/Kolla及Ceph部署.md"}');export{d as comp,v as data};
