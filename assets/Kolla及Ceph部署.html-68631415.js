import{_ as l,M as c,p as t,q as p,R as n,t as s,N as e,a1 as i}from"./framework-39bdc1ba.js";const r={},o=i(`<h2 id="基础配置" tabindex="-1"><a class="header-anchor" href="#基础配置" aria-hidden="true">#</a> 基础配置</h2><ul><li>CentOS 7.4 x86</li><li>Kolla-ansible Train</li><li>Ceph-ansible stable-4.0</li></ul><h2 id="基础环境配置" tabindex="-1"><a class="header-anchor" href="#基础环境配置" aria-hidden="true">#</a> 基础环境配置</h2><h3 id="安装基础软件" tabindex="-1"><a class="header-anchor" href="#安装基础软件" aria-hidden="true">#</a> 安装基础软件</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 设置 yun 源</span>
<span class="token function">sudo</span> <span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^mirrorlist=|#mirrorlist=|g&#39;</span> <span class="token punctuation">\\</span>
         <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g&#39;</span> <span class="token punctuation">\\</span>
         <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\\</span>s
         /etc/yum.repos.d/CentOS-*.repo

<span class="token comment"># step.2</span>
<span class="token function">sudo</span> yum makecache

<span class="token comment"># step.3</span>
<span class="token function">sudo</span> yum update <span class="token parameter variable">-y</span>

<span class="token comment"># step.4 安装基础软件</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token function">vim</span> <span class="token function">git</span> <span class="token function">wget</span> gcc libffi-devel openssl-devel lvm2 chrony <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改主机-host-文件" tabindex="-1"><a class="header-anchor" href="#修改主机-host-文件" aria-hidden="true">#</a> 修改主机 host 文件</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vim</span> /etc/hosts

<span class="token comment"># step.1 添加内容</span>
<span class="token number">192.168</span>.93.101  node01
<span class="token number">192.168</span>.93.102  node02
<span class="token number">192.168</span>.93.103  node03
<span class="token number">192.168</span>.93.104  node04
<span class="token number">192.168</span>.93.105  node05
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置免密" tabindex="-1"><a class="header-anchor" href="#配置免密" aria-hidden="true">#</a> 配置免密</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 生成密钥</span>
ssh-keygen <span class="token parameter variable">-b</span> <span class="token number">1024</span> <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-P</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa

<span class="token comment"># step.2 所有节点配置免密</span>
<span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token number">5</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token keyword">do</span> <span class="token function">sudo</span> ssh-copy-id <span class="token parameter variable">-i</span> ~/.ssh/id_rsa.pub node0<span class="token variable">$i</span><span class="token punctuation">;</span> <span class="token keyword">done</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关闭-selinux" tabindex="-1"><a class="header-anchor" href="#关闭-selinux" aria-hidden="true">#</a> 关闭 Selinux</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
setenforce <span class="token number">0</span>

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/selinux/config

<span class="token comment"># step.2 修改内容</span>
<span class="token assign-left variable">SELINUX</span><span class="token operator">=</span>disabled
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关闭防火墙" tabindex="-1"><a class="header-anchor" href="#关闭防火墙" aria-hidden="true">#</a> 关闭防火墙</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl stop firewalld
systemctl disable firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="磁盘结构" tabindex="-1"><a class="header-anchor" href="#磁盘结构" aria-hidden="true">#</a> 磁盘结构</h3><p>执行 lsblk 命令，输出如下，使用 sdc、sdd 两个磁盘分区</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>lsblk

NAME            MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda               <span class="token number">8</span>:0    <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk 
├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>     1G  <span class="token number">0</span> part /boot
└─sda2            <span class="token number">8</span>:2    <span class="token number">0</span> <span class="token number">446</span>.1G  <span class="token number">0</span> part 
  ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span> <span class="token number">877</span>.3G  <span class="token number">0</span> lvm  /
  └─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    16G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span>
sdb               <span class="token number">8</span>:16   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk 
sdc               <span class="token number">8</span>:32   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk 
sdd               <span class="token number">8</span>:48   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装-docker" tabindex="-1"><a class="header-anchor" href="#安装-docker" aria-hidden="true">#</a> 安装 Docker</h2><h3 id="安装-docker-1" tabindex="-1"><a class="header-anchor" href="#安装-docker-1" aria-hidden="true">#</a> 安装 docker</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils
<span class="token function">sudo</span> yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

<span class="token comment"># step.2</span>
<span class="token function">sudo</span> yum <span class="token function">install</span> docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin <span class="token parameter variable">-y</span>

<span class="token comment"># step.3 配置 Docker 镜像源</span>
<span class="token function">touch</span> /etc/docker/daemon.json <span class="token operator">&amp;&amp;</span> <span class="token function">vim</span> /etc/docker/daemon.json

<span class="token comment"># step.3 内容</span>
<span class="token punctuation">{</span>
  <span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;https://dockerproxy.com&quot;</span>,
    <span class="token string">&quot;https://hub-mirror.c.163.com&quot;</span>,
    <span class="token string">&quot;https://mirror.baidubce.com&quot;</span>,
    <span class="token string">&quot;https://ccr.ccs.tencentyun.com&quot;</span>,
    <span class="token string">&quot;https://registry.docker-cn.com&quot;</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># step.4</span>
systemctl daemon-reload
systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span> <span class="token operator">&amp;&amp;</span> systemctl start <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置-docker-私有仓库" tabindex="-1"><a class="header-anchor" href="#配置-docker-私有仓库" aria-hidden="true">#</a> 配置 Docker 私有仓库</h3><h4 id="编写-etc-docker-docker-compose-yaml" tabindex="-1"><a class="header-anchor" href="#编写-etc-docker-docker-compose-yaml" aria-hidden="true">#</a> 编写 /etc/docker/docker-compose.yaml</h4><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span>

<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">registry</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry<span class="token punctuation">:</span>2.8.2
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> docker_registry
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 4000<span class="token punctuation">:</span><span class="token number">5000</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./registry<span class="token punctuation">:</span>/var/lib/registry
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装-pip" tabindex="-1"><a class="header-anchor" href="#安装-pip" aria-hidden="true">#</a> 安装 PIP</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
yum <span class="token function">install</span> epel-release python-pip <span class="token parameter variable">-y</span>

<span class="token comment"># step.2</span>
<span class="token function">mkdir</span> ~/.pip

<span class="token comment"># step.3 配置 pip 源</span>
<span class="token function">cat</span> <span class="token operator">&gt;</span> ~/.pip/pip.conf <span class="token operator">&lt;&lt;</span><span class="token string">EOF
[global]
timeout = 6000
index-url = http://mirrors.aliyun.com/pypi/simple/
trusted-host = mirrors.aliyun.com
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装-ceph-ansible" tabindex="-1"><a class="header-anchor" href="#安装-ceph-ansible" aria-hidden="true">#</a> 安装 Ceph-Ansible</h2><h3 id="创建虚拟环境" tabindex="-1"><a class="header-anchor" href="#创建虚拟环境" aria-hidden="true">#</a> 创建虚拟环境</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 安装虚拟环境依赖</span>
yum <span class="token function">install</span> python-devel libselinux-python python-virtualenv <span class="token parameter variable">-y</span>

<span class="token comment"># step.2 创建虚拟环境</span>
virtualenv /opt/ceph/venv/

<span class="token comment"># step.3 激活虚拟环境</span>
<span class="token builtin class-name">source</span> /opt/ceph/venv/bin/activate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="虚拟环境中安装-ceph-ansible-stable-4-0" tabindex="-1"><a class="header-anchor" href="#虚拟环境中安装-ceph-ansible-stable-4-0" aria-hidden="true">#</a> 虚拟环境中安装 Ceph-Ansible stable-4.0</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 克隆源码</span>
<span class="token builtin class-name">cd</span> /opt/ceph
<span class="token function">git</span> clone https://github.com/ceph/ceph-ansible.git

<span class="token comment"># step.2</span>
<span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible <span class="token operator">&amp;&amp;</span> <span class="token function">git</span> checkout stable-4.0

<span class="token comment"># step.3</span>
pip <span class="token function">install</span> <span class="token parameter variable">-U</span> pip
pip <span class="token function">install</span> <span class="token parameter variable">-U</span> setuptools

<span class="token comment"># step.4 安装 ceph-ansible 依赖</span>
pip <span class="token function">install</span> <span class="token parameter variable">-r</span> requirements.txt

<span class="token comment"># step.5 编辑 ansible 配置</span>
<span class="token function">vim</span> /etc/ansible/ansible.cfg

<span class="token comment"># step.5 内容</span>
<span class="token punctuation">[</span>defaults<span class="token punctuation">]</span>
<span class="token assign-left variable">host_key_checking</span><span class="token operator">=</span>False
<span class="token assign-left variable">pipelining</span><span class="token operator">=</span>True
<span class="token assign-left variable">forks</span><span class="token operator">=</span><span class="token number">100</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编写-ceph-inventory" tabindex="-1"><a class="header-anchor" href="#编写-ceph-inventory" aria-hidden="true">#</a> 编写 Ceph Inventory</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vim</span> /opt/ceph/ceph-ansible/hosts

<span class="token comment"># step.1 内容 mons osds grafana-server 是必须要的</span>
<span class="token punctuation">[</span>mons<span class="token punctuation">]</span>
node0<span class="token punctuation">[</span><span class="token number">1</span>:5<span class="token punctuation">]</span>

<span class="token punctuation">[</span>osds<span class="token punctuation">]</span>
node0<span class="token punctuation">[</span><span class="token number">1</span>:5<span class="token punctuation">]</span>

<span class="token punctuation">[</span>mgrs<span class="token punctuation">]</span>
node01

<span class="token punctuation">[</span>mdss<span class="token punctuation">]</span>
node01

<span class="token punctuation">[</span>grafana-server<span class="token punctuation">]</span>
node01
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-group-vars-all-yml-配置" tabindex="-1"><a class="header-anchor" href="#修改-group-vars-all-yml-配置" aria-hidden="true">#</a> 修改 group_vars/all.yml 配置</h3><p>在 Docker 中部署 Ceph</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible/group_vars

<span class="token comment"># step.2 备份 group_vars 下的文件</span>
<span class="token keyword">for</span> <span class="token for-or-select variable">file</span> <span class="token keyword">in</span> *<span class="token punctuation">;</span> <span class="token keyword">do</span> <span class="token function">cp</span> <span class="token variable">$file</span> <span class="token variable">\${file<span class="token operator">%</span>.*}</span><span class="token punctuation">;</span> <span class="token keyword">done</span>

<span class="token comment"># step.3 编辑 all.yml</span>
<span class="token function">vim</span> /opt/ceph/ceph-ansible/group_vars/all.yml

<span class="token comment"># step.3 内容</span>
--- 
dummy:
cluster: ceph

mon_group_name: mons
osd_group_name: osds
rgw_group_name: rgws
mds_group_name: mdss
nfs_group_name: nfss
rbdmirror_group_name: rbdmirrors
client_group_name: clients
iscsi_gw_group_name: iscsigws
mgr_group_name: mgrs
rgwloadbalancer_group_name: rgwloadbalancers
grafana_server_group_name: grafana-server

configure_firewall: False

ntp_service_enabled: <span class="token boolean">false</span>

upgrade_ceph_packages: False

ceph_origin: repository 
ceph_repository: community
ceph_mirror: http://mirrors.aliyun.com/ceph 
ceph_stable_key: http://mirrors.aliyun.com/ceph/keys/release.asc 
ceph_stable_release: nautilus 
ceph_stable_repo: <span class="token string">&quot;{{ ceph_mirror }}/rpm-{{ ceph_stable_release }}&quot;</span>

monitor_interface: ens33

public_network: <span class="token string">&quot;192.168.93.0/24&quot;</span>

radosgw_interface: ens33

ceph_docker_image_tag: v4.0.22-stable-4.0-nautilus-centos-7-x86_64
containerized_deployment: True

dashboard_admin_password: password@123456
grafana_admin_password: password@123456

no_log_on_ceph_key_tasks: False
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-group-vars-osds-yml" tabindex="-1"><a class="header-anchor" href="#修改-group-vars-osds-yml" aria-hidden="true">#</a> 修改 group_vars/osds.yml</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">devices</span><span class="token punctuation">:</span>
	<span class="token punctuation">-</span> /dev/sdb
	<span class="token punctuation">-</span> /dev/sdc
	<span class="token punctuation">-</span> /dev/sdd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="docker-ceph-部署" tabindex="-1"><a class="header-anchor" href="#docker-ceph-部署" aria-hidden="true">#</a> Docker Ceph 部署</h3><p>可能遇到 ceph-ansible 和已安装的 docker 冲突的情况</p>`,38),d={href:"https://github.com/ceph/ceph-ansible/issues/5159",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/ceph/ceph-ansible/issues/3609",target:"_blank",rel:"noopener noreferrer"},u=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible
<span class="token function">cp</span> site-container.yml.sample site-container.yml

<span class="token comment"># step.2 验证连通性</span>
ansible <span class="token parameter variable">-i</span> hosts all <span class="token parameter variable">-m</span> <span class="token function">ping</span>

<span class="token comment"># step.3 部署 ceph</span>
ansible-playbook <span class="token parameter variable">-i</span> hosts site-container.yml <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/ceph/venv/bin/python <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span>

<span class="token comment"># 或者指定 /usr/bin/python2</span>
ansible-playbook <span class="token parameter variable">-i</span> hosts site-container.yml <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/usr/bin/python2 <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署后-ceph-service-位置" tabindex="-1"><a class="header-anchor" href="#部署后-ceph-service-位置" aria-hidden="true">#</a> 部署后 Ceph Service 位置</h3><p>ceph-ansible 将会把所有的 ceph 组件分别对应到各自的 service 中</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">ls</span> <span class="token parameter variable">-l</span> /etc/systemd/system/ceph*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="出错回滚" tabindex="-1"><a class="header-anchor" href="#出错回滚" aria-hidden="true">#</a> 出错回滚</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 清理集群，会将所有的容器和镜像全部清除</span>
<span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible

ansible-playbook <span class="token parameter variable">-i</span> hosts infrastructure-playbooks/purge-cluster.yml <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span>

<span class="token comment"># step.2 手动清除 ceph 相关文件</span>
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> /etc/ceph/ <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/ceph/

<span class="token comment"># step.3 检测硬盘分区</span>
lsblk

<span class="token comment"># step.3 如输出内容，需要移除 LVM 逻辑卷</span>
sdc     <span class="token number">8</span>:32   <span class="token number">0</span> <span class="token number">447</span>.1G  <span class="token number">0</span> disk 
└─ceph--399e8b5a--4348xxxx

<span class="token comment"># step.4 移除 LVM 逻辑卷</span>
lvremove /dev/ceph-399e8b5a--4348xxxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="集群升级" tabindex="-1"><a class="header-anchor" href="#集群升级" aria-hidden="true">#</a> 集群升级</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 升级集群</span>
<span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible
ansible-playbook <span class="token parameter variable">-i</span> hosts infrastructure-playbooks/rolling_update.yml <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问控制台" tabindex="-1"><a class="header-anchor" href="#访问控制台" aria-hidden="true">#</a> 访问控制台</h3><ul><li>Ceph 控制台：https://192.168.93.101:8443/#/login，账号密码 admin/password@123456</li><li>Grafana 控制台：https://10.247.53.6:3000/login，账号密码 admin/password@123456</li></ul><h2 id="安装-kolla-ansible-train" tabindex="-1"><a class="header-anchor" href="#安装-kolla-ansible-train" aria-hidden="true">#</a> 安装 Kolla Ansible Train</h2><h3 id="创建虚拟环境-1" tabindex="-1"><a class="header-anchor" href="#创建虚拟环境-1" aria-hidden="true">#</a> 创建虚拟环境</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 安装虚拟环境依赖</span>
yum <span class="token function">install</span> python-devel libselinux-python python-virtualenv <span class="token parameter variable">-y</span>

<span class="token comment"># step.2 创建虚拟环境</span>
virtualenv /opt/openstack/venv

<span class="token comment"># step.3 激活</span>
<span class="token builtin class-name">source</span> /opt/openstack/venv/bin/activate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装并配置-ansible" tabindex="-1"><a class="header-anchor" href="#安装并配置-ansible" aria-hidden="true">#</a> 安装并配置 Ansible</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 </span>
<span class="token builtin class-name">cd</span> /opt/openstack

<span class="token comment"># step.2 在虚拟环境中执行</span>
pip <span class="token function">install</span> <span class="token parameter variable">-U</span> pip
pip <span class="token function">install</span> <span class="token parameter variable">-U</span> setuptools

<span class="token comment"># step.2</span>
pip <span class="token function">install</span> <span class="token string">&#39;ansible&lt;2.10&#39;</span>

<span class="token comment"># step.3</span>
<span class="token function">vim</span> /etc/ansible/ansible.cfg

<span class="token comment"># step.3 内容</span>
<span class="token punctuation">[</span>defaults<span class="token punctuation">]</span>
<span class="token assign-left variable">host_key_checking</span><span class="token operator">=</span>False
<span class="token assign-left variable">pipelining</span><span class="token operator">=</span>True
<span class="token assign-left variable">forks</span><span class="token operator">=</span><span class="token number">100</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装-kolla-ansible" tabindex="-1"><a class="header-anchor" href="#安装-kolla-ansible" aria-hidden="true">#</a> 安装 Kolla Ansible</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /opt/openstack

<span class="token comment"># step.2 拟环境中执行</span>
pip <span class="token function">install</span> kolla-ansible
pip <span class="token function">install</span> <span class="token parameter variable">-U</span> <span class="token function">docker</span>
pip <span class="token function">install</span> <span class="token parameter variable">-U</span> websocket-client

<span class="token comment"># step.3</span>
<span class="token function">sudo</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/kolla
<span class="token function">sudo</span> <span class="token function">chown</span> <span class="token environment constant">$USER</span><span class="token builtin class-name">:</span><span class="token environment constant">$USER</span> /etc/kolla

<span class="token comment"># step.4 复制 kolla 的文件</span>
<span class="token function">cp</span> <span class="token parameter variable">-r</span> /opt/openstack/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
<span class="token function">cp</span> /opt/openstack/venv/share/kolla-ansible/ansible/inventory/* <span class="token builtin class-name">.</span>

<span class="token comment"># step.5</span>
ll
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-kolla-ansible-配置" tabindex="-1"><a class="header-anchor" href="#修改-kolla-ansible-配置" aria-hidden="true">#</a> 修改 Kolla Ansible 配置</h3><h3 id="修改-inventory-文件-multinode" tabindex="-1"><a class="header-anchor" href="#修改-inventory-文件-multinode" aria-hidden="true">#</a> 修改 Inventory 文件（multinode）</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>control<span class="token punctuation">]</span>
node0<span class="token punctuation">[</span><span class="token number">1</span>:3<span class="token punctuation">]</span>

<span class="token punctuation">[</span>network<span class="token punctuation">]</span>
node0<span class="token punctuation">[</span><span class="token number">1</span>:3<span class="token punctuation">]</span>

<span class="token punctuation">[</span>compute<span class="token punctuation">]</span>
node0<span class="token punctuation">[</span><span class="token number">1</span>:5<span class="token punctuation">]</span>

<span class="token punctuation">[</span>monitoring<span class="token punctuation">]</span>
node05

<span class="token punctuation">[</span>storage<span class="token punctuation">]</span>
node0<span class="token punctuation">[</span><span class="token number">1</span>:3<span class="token punctuation">]</span>

<span class="token punctuation">[</span>deployment<span class="token punctuation">]</span>
localhost       <span class="token assign-left variable">ansible_connection</span><span class="token operator">=</span>local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生成-kolla-密钥" tabindex="-1"><a class="header-anchor" href="#生成-kolla-密钥" aria-hidden="true">#</a> 生成 Kolla 密钥</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 执行</span>
kolla-genpwd

<span class="token comment"># step.2 查看内容，keystone_admin_password 可修改，登录 dashboard 会用到</span>
<span class="token function">cat</span> /etc/kolla/passwords.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改-globals-yml" tabindex="-1"><a class="header-anchor" href="#修改-globals-yml" aria-hidden="true">#</a> 修改 globals.yml</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">vim</span> /etc/kolla/globals.yml

<span class="token comment"># step.1 修改内容</span>
kolla_base_distro: <span class="token string">&quot;centos&quot;</span>

kolla_install_type: <span class="token string">&quot;binary&quot;</span>
openstack_release: <span class="token string">&quot;train&quot;</span>

kolla_internal_vip_address: <span class="token string">&quot;192.168.93.100&quot;</span> 

network_interface: <span class="token string">&quot;ens33&quot;</span>
neutron_external_interface: <span class="token string">&quot;ens35&quot;</span>

enable_cinder: <span class="token string">&quot;yes&quot;</span>

enable_neutron_provider_networks: <span class="token string">&quot;yes&quot;</span> 

openstack_region_name: <span class="token string">&quot;RegionOne&quot;</span>

enable_chrony: <span class="token string">&quot;no&quot;</span>

enable_ceph: <span class="token string">&quot;no&quot;</span>
glance_backend_ceph: <span class="token string">&quot;yes&quot;</span>
cinder_backend_ceph: <span class="token string">&quot;yes&quot;</span>
nova_backend_ceph: <span class="token string">&quot;yes&quot;</span>
gnocchi_backend_storage: <span class="token string">&quot;ceph&quot;</span>
enable_manila_backend_cephfs_native: <span class="token string">&quot;yes&quot;</span>

docker_custom_config:
  registry-mirrors: 
    - http://192.168.93.1:4000
    - https://dockerproxy.com
    - https://hub-mirror.c.163.com
    - https://mirror.baidubce.com
    - https://ccr.ccs.tencentyun.com
    - https://registry.docker-cn.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置-external-ceph" tabindex="-1"><a class="header-anchor" href="#设置-external-ceph" aria-hidden="true">#</a> 设置 External ceph</h3><h4 id="创建-ceph-pool" tabindex="-1"><a class="header-anchor" href="#创建-ceph-pool" aria-hidden="true">#</a> 创建 ceph pool</h4><p>在 ceph 中创建存储池 pool</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 进入 ceph 容器</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> ceph-mon /bin/sh

<span class="token comment"># step.2 分别创建备份 pool</span>
ceph osd pool create images <span class="token number">128</span>
ceph osd pool create instances <span class="token number">128</span>
ceph osd pool create volumes <span class="token number">128</span>
ceph osd pool create backups <span class="token number">128</span>

<span class="token comment"># step.3 初始化 pool</span>
rbd pool init images
rbd pool init instances
rbd pool init volumes
rbd pool init backups

<span class="token comment"># step.4 查看 pool 的情况</span>
ceph osd pool <span class="token function">ls</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建-ceph-user" tabindex="-1"><a class="header-anchor" href="#创建-ceph-user" aria-hidden="true">#</a> 创建 ceph user</h4><p>在 ceph 中创建对应 pool 的 user，输出的 keyring 将用于 openstack 集成 ceph</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 进入 ceph 容器</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> ceph-mon /bin/sh

<span class="token comment"># step.2 创建 glance</span>
ceph auth get-or-create client.glance <span class="token punctuation">\\</span>
	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span>
	osd <span class="token string">&#39;profile rbd pool=images&#39;</span> <span class="token punctuation">\\</span>
	mgr <span class="token string">&#39;profile rbd pool=images&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span>
	/tmp/ceph.client.glance.keyring

<span class="token comment"># step.2 输出 keyring</span>
<span class="token function">cat</span> /tmp/ceph.client.glance.keyring
<span class="token punctuation">[</span>client.glance<span class="token punctuation">]</span>
key <span class="token operator">=</span> AQC627hkgS2WKhAAQLPn80a8m7CxysJ/vasvJA<span class="token operator">==</span>

<span class="token comment"># step.3 创建 cinder</span>
ceph auth get-or-create client.cinder <span class="token punctuation">\\</span>
	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span>
	osd <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=instances, profile rbd-read-only pool=images&#39;</span> <span class="token punctuation">\\</span>
	mgr <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=instances&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span>
	/tmp/ceph.client.cinder.keyring

<span class="token comment"># step.3 输出 keyring</span>
<span class="token function">cat</span> /tmp/ceph.client.cinder.keyring
<span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span>
key <span class="token operator">=</span> AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A<span class="token operator">==</span>

<span class="token comment"># step.4 创建 cinder-backup</span>
ceph auth get-or-create client.cinder-backup <span class="token punctuation">\\</span>
	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span>
	osd <span class="token string">&#39;profile rbd pool=backups&#39;</span> <span class="token punctuation">\\</span>
	mgr <span class="token string">&#39;profile rbd pool=backups&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span>
	/tmp/ceph.client.cinder-backup.keyring

<span class="token comment"># step.4 输出 keyring</span>
<span class="token function">cat</span> /tmp/ceph.client.cinder-backup.keyring
<span class="token punctuation">[</span>client.cinder-backup<span class="token punctuation">]</span>
key <span class="token operator">=</span> AQAw3LhkgXPpLRAAUTqHmwNh29+nswRWjsUo+Q<span class="token operator">==</span>

<span class="token comment"># step.5 创建 nova</span>
ceph auth get-or-create client.nova <span class="token punctuation">\\</span>
	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span>
	osd <span class="token string">&#39;profile rbd pool=instances&#39;</span> <span class="token punctuation">\\</span>
	mgr <span class="token string">&#39;profile rbd pool=instances&#39;</span> <span class="token operator">&gt;</span> <span class="token punctuation">\\</span>
	/tmp/ceph.client.nova.keyring

<span class="token comment"># step.5 输出 keyring</span>
<span class="token function">cat</span> /tmp/ceph.client.nova.keyring
<span class="token punctuation">[</span>client.nova<span class="token punctuation">]</span>
key <span class="token operator">=</span> AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA<span class="token operator">==</span>

<span class="token comment"># step.6 查看 user 的情况</span>
ceph auth <span class="token function">ls</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="glance-external-ceph" tabindex="-1"><a class="header-anchor" href="#glance-external-ceph" aria-hidden="true">#</a> Glance External ceph</h4><h5 id="设置-glance-api-conf" tabindex="-1"><a class="header-anchor" href="#设置-glance-api-conf" aria-hidden="true">#</a> 设置 glance-api.conf</h5><p>在 glance-api.conf 中配置 RBD 后端存储</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 创建并编辑 glance-api.conf</span>
<span class="token function">vim</span> /etc/kolla/config/glance/glance-api.conf

<span class="token comment"># step.1 内容</span>
<span class="token punctuation">[</span>glance_store<span class="token punctuation">]</span>
stores <span class="token operator">=</span> rbd
default_store <span class="token operator">=</span> rbd
rbd_store_pool <span class="token operator">=</span> images
rbd_store_user <span class="token operator">=</span> glance
rbd_store_ceph_conf <span class="token operator">=</span> /etc/ceph/ceph.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="设置-ceph-conf" tabindex="-1"><a class="header-anchor" href="#设置-ceph-conf" aria-hidden="true">#</a> 设置 ceph.conf</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 复制 ceph.conf</span>
<span class="token function">cp</span> /etc/ceph/ceph.conf /etc/kolla/config/glance/ceph.conf

<span class="token comment"># step.2 编辑</span>
<span class="token function">vim</span> /etc/kolla/config/glance/ceph.conf

<span class="token comment"># step.2 添加内容</span>
<span class="token punctuation">[</span>global<span class="token punctuation">]</span>
fsid <span class="token operator">=</span> 1d89fec3-325a-4963-a950-c4afedd37fe3

<span class="token comment"># 添加内容</span>
auth cluster required <span class="token operator">=</span> cephx
auth <span class="token function">service</span> required <span class="token operator">=</span> cephx
auth client required <span class="token operator">=</span> cephx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建-keyring" tabindex="-1"><a class="header-anchor" href="#创建-keyring" aria-hidden="true">#</a> 创建 keyring</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 创建并编辑</span>
<span class="token function">vim</span> /etc/kolla/config/glance/ceph.client.glance.keyring

<span class="token comment"># step.1 内容复制 /tmp/ceph.client.glance.keyring</span>
<span class="token punctuation">[</span>client.glance<span class="token punctuation">]</span>
key <span class="token operator">=</span> <span class="token assign-left variable">AQAX9LNkAAAAABAA2qfvgDC4wqZm8PKBcWBY4g</span><span class="token operator">==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="cinder-external-ceph" tabindex="-1"><a class="header-anchor" href="#cinder-external-ceph" aria-hidden="true">#</a> Cinder External ceph</h4><h5 id="设置-cinder-volume-conf" tabindex="-1"><a class="header-anchor" href="#设置-cinder-volume-conf" aria-hidden="true">#</a> 设置 cinder-volume.conf</h5><p>cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 输出 cinder_rbd_secret_uuid</span>
<span class="token function">cat</span> /etc/kolla/passwords.yml <span class="token operator">|</span> <span class="token function">grep</span> cinder_rbd_secret_uuid

<span class="token comment"># step.2 创建并编辑 cinder-volume.conf</span>
<span class="token function">vim</span> /etc/kolla/config/cinder/cinder-volume.conf

<span class="token comment"># step.2 内容 cinder_rbd_secret_uuid 在 /etc/kolla/passwords.yml 文件中</span>
<span class="token punctuation">[</span>DEFAULT<span class="token punctuation">]</span>
<span class="token assign-left variable">enabled_backends</span><span class="token operator">=</span>rbd-1

<span class="token punctuation">[</span>rbd-1<span class="token punctuation">]</span>
<span class="token assign-left variable">rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf
<span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>cinder
<span class="token assign-left variable">backend_host</span><span class="token operator">=</span>rbd:volumes
<span class="token assign-left variable">rbd_pool</span><span class="token operator">=</span>volumes

<span class="token assign-left variable">volume_backend_name</span><span class="token operator">=</span>rbd-1
<span class="token assign-left variable">volume_driver</span><span class="token operator">=</span>cinder.volume.drivers.rbd.RBDDriver
rbd_secret_uuid <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> cinder_rbd_secret_uuid <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="挂载多个存储池" tabindex="-1"><a class="header-anchor" href="#挂载多个存储池" aria-hidden="true">#</a> 挂载多个存储池</h6><ol><li><p>创建新的 pool</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ceph osd pool create volumes_two <span class="token number">128</span>

rbd pool init volumes_two
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>更新 ceph 的 client.cinder user</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ceph auth caps client.cinder <span class="token punctuation">\\</span>
	mon <span class="token string">&#39;profile rbd&#39;</span> <span class="token punctuation">\\</span>
	osd <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=volumes_two, profile rbd pool=instances, profile rbd-read-only pool=images&#39;</span> <span class="token punctuation">\\</span>
	mgr <span class="token string">&#39;profile rbd pool=volumes, profile rbd pool=volumes_two, profile rbd pool=instances&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>设置 cinder-volume.conf</p><p>cinder-volume 挂载多个池时的 cinder-volume.conf，如果已经使用 kolla 部署了 Openstack 则可以直接修改对应的 cinder 节点上的 /etc/kolla/cinder-volume/cinder.conf 后重启 cinder_volume 容器</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>DEFAULT<span class="token punctuation">]</span>
<span class="token assign-left variable">enabled_backends</span><span class="token operator">=</span>rbd-1,rbd-2

<span class="token punctuation">[</span>rbd-1<span class="token punctuation">]</span>
<span class="token assign-left variable">rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf
<span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>cinder
<span class="token assign-left variable">backend_host</span><span class="token operator">=</span>rbd:volumes
<span class="token assign-left variable">rbd_pool</span><span class="token operator">=</span>volumes

<span class="token assign-left variable">volume_backend_name</span><span class="token operator">=</span>rbd-1
<span class="token assign-left variable">volume_driver</span><span class="token operator">=</span>cinder.volume.drivers.rbd.RBDDriver
rbd_secret_uuid <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> cinder_rbd_secret_uuid <span class="token punctuation">}</span><span class="token punctuation">}</span>

<span class="token punctuation">[</span>rbd-2<span class="token punctuation">]</span>
<span class="token assign-left variable">rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf
<span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>cinder                   <span class="token comment"># 需要 ceph auth caps 命令更新 user</span>
<span class="token assign-left variable">backend_host</span><span class="token operator">=</span>rbd:volumes
<span class="token assign-left variable">rbd_pool</span><span class="token operator">=</span>volumes_two
<span class="token assign-left variable">volume_backend_name</span><span class="token operator">=</span>rbd-2
<span class="token assign-left variable">volume_driver</span><span class="token operator">=</span>cinder.volume.drivers.rbd.RBDDriver
rbd_secret_uuid <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> cinder_rbd_secret_uuid <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h5 id="设置-cinder-backup-conf" tabindex="-1"><a class="header-anchor" href="#设置-cinder-backup-conf" aria-hidden="true">#</a> 设置 cinder-backup.conf</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 创建并编辑 cinder-volume.conf</span>
<span class="token function">vim</span> /etc/kolla/config/cinder/cinder-backup.conf

<span class="token comment"># step.1 内容</span>
<span class="token punctuation">[</span>DEFAULT<span class="token punctuation">]</span>
<span class="token assign-left variable">backup_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf
<span class="token assign-left variable">backup_ceph_user</span><span class="token operator">=</span>cinder-backup
backup_ceph_chunk_size <span class="token operator">=</span> <span class="token number">134217728</span>
<span class="token assign-left variable">backup_ceph_pool</span><span class="token operator">=</span>backups

backup_driver <span class="token operator">=</span> cinder.backup.drivers.ceph.CephBackupDriver
backup_ceph_stripe_unit <span class="token operator">=</span> <span class="token number">0</span>
backup_ceph_stripe_count <span class="token operator">=</span> <span class="token number">0</span>
restore_discard_excess_bytes <span class="token operator">=</span> <span class="token boolean">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="设置-ceph-conf-1" tabindex="-1"><a class="header-anchor" href="#设置-ceph-conf-1" aria-hidden="true">#</a> 设置 ceph.conf</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 复制 ceph.conf</span>
<span class="token function">cp</span> /etc/ceph/ceph.conf /etc/kolla/config/cinder/ceph.conf

<span class="token comment"># step.2 编辑</span>
<span class="token function">vim</span> /etc/kolla/config/cinder/ceph.conf

<span class="token comment"># step.2 添加内容</span>
<span class="token punctuation">[</span>global<span class="token punctuation">]</span>
fsid <span class="token operator">=</span> 1d89fec3-325a-4963-a950-c4afedd37fe3

<span class="token comment"># 添加内容</span>
auth cluster required <span class="token operator">=</span> cephx
auth <span class="token function">service</span> required <span class="token operator">=</span> cephx
auth client required <span class="token operator">=</span> cephx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建-keyring-1" tabindex="-1"><a class="header-anchor" href="#创建-keyring-1" aria-hidden="true">#</a> 创建 keyring</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 创建并编辑</span>
<span class="token function">vim</span> /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder.keyring

<span class="token comment"># step.1 内容复制 /tmp/ceph.client.cinder.keyring</span>
<span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span>
key <span class="token operator">=</span> <span class="token assign-left variable">AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w</span><span class="token operator">==</span>

<span class="token comment"># step.2 创建并编辑</span>
<span class="token function">vim</span> /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder-backup.keyring

<span class="token comment"># step.2 内容复制 /tmp/ceph.client.cinder-backup.keyring</span>
<span class="token punctuation">[</span>client.cinder-backup<span class="token punctuation">]</span>
key <span class="token operator">=</span> <span class="token assign-left variable">AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w</span><span class="token operator">==</span>

<span class="token comment"># step.3 创建并编辑</span>
<span class="token function">vim</span> /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring

<span class="token comment"># step.3 内容复制 /tmp/ceph.client.cinder.keyring</span>
<span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span>
key <span class="token operator">=</span> <span class="token assign-left variable">AQAg5YRXpChaGRAAlTSCleesthCRmCYrfQVX1w</span><span class="token operator">==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nova-external-ceph" tabindex="-1"><a class="header-anchor" href="#nova-external-ceph" aria-hidden="true">#</a> Nova External ceph</h4><p>如果使用 ceph-ansible 部署的 ceph，需要将 ceph.client.cinder.keyring 复制为 /etc/kolla/config/nova/ceph.client.nova.keyring</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 复制 ceph.conf</span>
<span class="token function">cp</span> /etc/ceph/ceph.conf /etc/kolla/config/ceph.conf

<span class="token comment"># step.2 编辑</span>
<span class="token function">vim</span> /etc/kolla/config/ceph.conf

<span class="token comment"># step.2 添加内容</span>
<span class="token punctuation">[</span>global<span class="token punctuation">]</span>
fsid <span class="token operator">=</span> 1d89fec3-325a-4963-a950-c4afedd37fe3

<span class="token comment"># 添加内容</span>
auth cluster required <span class="token operator">=</span> cephx
auth <span class="token function">service</span> required <span class="token operator">=</span> cephx
auth client required <span class="token operator">=</span> cephx

<span class="token comment"># step.3 复制 ceph.client.cinder.keyring</span>
<span class="token function">cp</span> /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring /etc/kolla/config/nova/ceph.client.nova.keyring

<span class="token comment"># step.4 编辑 ceph.client.nova.keyring</span>
<span class="token function">vim</span> /etc/kolla/config/nova/ceph.client.nova.keyring

<span class="token comment"># step.4 添加内容复制 /tmp/ceph.client.nova.keyring</span>
<span class="token punctuation">[</span>client.nova<span class="token punctuation">]</span>
key <span class="token operator">=</span> AQBY3LhkGmfyARAA25e4H/Dc3Fd02NSCSN3UmA<span class="token operator">==</span>

<span class="token punctuation">[</span>client.cinder<span class="token punctuation">]</span>
key <span class="token operator">=</span> AQD627hkgs6+KhAAjveZJ159j0oKAGdGp7Ss8A<span class="token operator">==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建-nova-compute-conf" tabindex="-1"><a class="header-anchor" href="#创建-nova-compute-conf" aria-hidden="true">#</a> 创建 nova-compute.conf</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 创建并编辑</span>
<span class="token function">vim</span> /etc/kolla/config/nova/nova-compute.conf

<span class="token comment"># step.1 内容</span>
<span class="token punctuation">[</span>libvirt<span class="token punctuation">]</span>
<span class="token assign-left variable">images_rbd_pool</span><span class="token operator">=</span>instances
<span class="token assign-left variable">images_type</span><span class="token operator">=</span>rbd
<span class="token assign-left variable">images_rbd_ceph_conf</span><span class="token operator">=</span>/etc/ceph/ceph.conf
<span class="token assign-left variable">rbd_user</span><span class="token operator">=</span>nova
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构" aria-hidden="true">#</a> 目录结构</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>tree /etc/kolla/config/

/etc/kolla/config/
├── cinder
│   ├── ceph.conf
│   ├── cinder-backup
│   │   ├── ceph.client.cinder-backup.keyring
│   │   └── ceph.client.cinder.keyring
│   ├── cinder-backup.conf
│   ├── cinder-volume
│   │   └── ceph.client.cinder.keyring
│   └── cinder-volume.conf
├── glance
│   ├── ceph.client.glance.keyring
│   ├── ceph.conf
│   └── glance-api.conf
└── nova
    ├── ceph.client.cinder.keyring
    ├── ceph.client.nova.keyring
    ├── ceph.conf
    └── nova-compute.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-openstack" tabindex="-1"><a class="header-anchor" href="#部署-openstack" aria-hidden="true">#</a> 部署 OpenStack</h2><h3 id="安装-openstack" tabindex="-1"><a class="header-anchor" href="#安装-openstack" aria-hidden="true">#</a> 安装 OpenStack</h3>`,60),m={href:"https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html",target:"_blank",rel:"noopener noreferrer"},b={href:"https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html",target:"_blank",rel:"noopener noreferrer"},k=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 检测节点连通性</span>
<span class="token builtin class-name">cd</span> /opt/openstack
ansible <span class="token parameter variable">-i</span> multinode all <span class="token parameter variable">-m</span> <span class="token function">ping</span>

<span class="token comment"># step.2</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode certificates

<span class="token comment"># step.3 根据 Kolla 部署依赖创建服务器</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode bootstrap-servers <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span>

<span class="token comment"># step.4 部署前检查主机</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode prechecks <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/openstack/venv/bin/python <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvvv</span>

<span class="token comment"># step.5 拉取镜像</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode pull <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/openstack/venv/bin/python <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvvv</span>

<span class="token comment"># step.6 部署 OpenStack</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode deploy <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/opt/openstack/venv/bin/python <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvvv</span>

kolla-ansible <span class="token parameter variable">-i</span> multinode deploy <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvvv</span>
	
<span class="token comment">##################</span>
<span class="token comment"># 停止所有节点 openstack 服务</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode stop <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	--yes-i-really-really-mean-it <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvvv</span>

<span class="token comment"># 销毁所有节点 openstack 服务</span>
kolla-ansible <span class="token parameter variable">-i</span> multinode destroy <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">virtualenv</span><span class="token operator">=</span>/opt/openstack/venv <span class="token punctuation">\\</span>
	--yes-i-really-really-mean-it <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvvv</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-openstack" tabindex="-1"><a class="header-anchor" href="#使用-openstack" aria-hidden="true">#</a> 使用 OpenStack</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 安装 OpenStack CLI 客户端</span>
pip <span class="token function">install</span> python-openstackclient python-glanceclient python-neutronclient <span class="token parameter variable">-y</span>

<span class="token comment"># step.2 生成 openrc 文件</span>
kolla-ansible post-deploy

<span class="token comment"># step.3 执行脚本，将密码设置到环境变量中</span>
<span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh

<span class="token comment"># step.3 执行脚本生成示例网络、镜像、实例等</span>
<span class="token builtin class-name">cd</span> /usr/local/share/kolla-ansible <span class="token operator">&amp;&amp;</span> ./init-runonce
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="访问-horizon" tabindex="-1"><a class="header-anchor" href="#访问-horizon" aria-hidden="true">#</a> 访问 horizon</h3><p>访问 ip 地址可进入 horizon 登录界面</p><ul><li>用户名：admin</li><li>密码：查看 /etc/kolla/passwords.yml</li></ul><h2 id="创建镜像" tabindex="-1"><a class="header-anchor" href="#创建镜像" aria-hidden="true">#</a> 创建镜像</h2>`,7),h={href:"https://docs.openstack.org/image-guide/obtain-images.html",target:"_blank",rel:"noopener noreferrer"},g=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
yum <span class="token function">install</span> libguestfs-tools <span class="token parameter variable">-y</span>

<span class="token comment"># step.2</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">LIBGUESTFS_BACKEND</span><span class="token operator">=</span>direct

<span class="token comment"># step.3 设置镜像密码，否则会创建虚拟机时会随机生成密码</span>
virt-customize <span class="token parameter variable">-a</span> ./CentOS-7-x86_64-GenericCloud-2009.qcow2 <span class="token punctuation">\\</span>
  --root-password password:123456

virt-customize <span class="token parameter variable">-a</span> ./debian-9.13.42-20220706-openstack-amd64.qcow2 <span class="token punctuation">\\</span>
  --root-password password:123456

<span class="token comment"># step.4 创建 glance 镜像</span>
openstack image create <span class="token string">&quot;CentOS-7-x86_64-GenericCloud-2009&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--public</span> <span class="token punctuation">\\</span>
  --min-ram <span class="token number">512</span> <span class="token punctuation">\\</span>
  --min-disk <span class="token number">20</span> <span class="token punctuation">\\</span>
  --disk-format qcow2 <span class="token punctuation">\\</span>
  --container-format bare <span class="token punctuation">\\</span>
  <span class="token parameter variable">--file</span> ./CentOS-7-x86_64-GenericCloud-2009.qcow2

openstack image create <span class="token string">&quot;debian-9.13.42-20220706-openstack-amd64&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--public</span> <span class="token punctuation">\\</span>
  --min-ram <span class="token number">512</span> <span class="token punctuation">\\</span>
  --min-disk <span class="token number">20</span> <span class="token punctuation">\\</span>
  --disk-format qcow2 <span class="token punctuation">\\</span>
  --container-format bare <span class="token punctuation">\\</span>
  <span class="token parameter variable">--file</span> ./debian-9.13.42-20220706-openstack-amd64.qcow2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function f(_,y){const a=c("ExternalLinkIcon");return t(),p("div",null,[o,n("ul",null,[n("li",null,[n("a",d,[s("https://github.com/ceph/ceph-ansible/issues/5159"),e(a)])]),n("li",null,[n("a",v,[s("https://github.com/ceph/ceph-ansible/issues/3609"),e(a)])])]),u,n("ul",null,[n("li",null,[s("virtualenv: "),n("a",m,[s("https://docs.openstack.org/kolla-ansible/train/reference/deployment-and-bootstrapping/bootstrap-servers.html"),e(a)])]),n("li",null,[s("ansible_python_interpreter: "),n("a",b,[s("https://docs.openstack.org/kolla-ansible/train/user/virtual-environments.html"),e(a)])])]),k,n("p",null,[s("OpenStack 默认支持的镜像 "),n("a",h,[s("https://docs.openstack.org/image-guide/obtain-images.html"),e(a)])]),g])}const q=l(r,[["render",f],["__file","Kolla及Ceph部署.html.vue"]]);export{q as default};
