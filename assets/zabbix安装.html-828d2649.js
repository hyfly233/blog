import{_ as e,M as i,p as t,q as l,R as n,t as s,N as p,a1 as c}from"./framework-39bdc1ba.js";const o={},r=n("h2",{id:"参考资料",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#参考资料","aria-hidden":"true"},"#"),s(" 参考资料")],-1),u={href:"https://www.zabbix.com/download?zabbix=5.0&os_distribution=centos&os_version=7&components=server_frontend_agent&db=mysql&ws=apache",target:"_blank",rel:"noopener noreferrer"},d=c(`<h2 id="安装-zabbix-server" tabindex="-1"><a class="header-anchor" href="#安装-zabbix-server" aria-hidden="true">#</a> 安装 Zabbix Server</h2><h3 id="关闭-selinux" tabindex="-1"><a class="header-anchor" href="#关闭-selinux" aria-hidden="true">#</a> 关闭 Selinux</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
setenforce <span class="token number">0</span>

<span class="token comment"># step.2</span>
<span class="token function">vim</span> /etc/selinux/config

<span class="token comment"># step.2 修改内容</span>
<span class="token assign-left variable">SELINUX</span><span class="token operator">=</span>disabled
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改防火墙策略" tabindex="-1"><a class="header-anchor" href="#修改防火墙策略" aria-hidden="true">#</a> 修改防火墙策略</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 关闭防火墙</span>
systemctl stop firewalld <span class="token operator">&amp;&amp;</span> systemctl disable firewalld

<span class="token comment"># 或者修改防火墙策略</span>
firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">10050</span>/tcp <span class="token parameter variable">--permanent</span>
firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">10050</span>/udp <span class="token parameter variable">--permanent</span>
firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">10051</span>/tcp <span class="token parameter variable">--permanent</span>
firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">10051</span>/udp <span class="token parameter variable">--permanent</span>
firewall-cmd <span class="token parameter variable">--zone</span><span class="token operator">=</span>public --add-port<span class="token operator">=</span><span class="token number">80</span>/tcp <span class="token parameter variable">--permanent</span>
systemctl restart firewalld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="备份" tabindex="-1"><a class="header-anchor" href="#备份" aria-hidden="true">#</a> 备份</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /etc/yum.repos.d

<span class="token comment"># step.2 备份</span>
<span class="token keyword">for</span> <span class="token for-or-select variable">file</span> <span class="token keyword">in</span> *<span class="token punctuation">;</span> <span class="token keyword">do</span> <span class="token function">cp</span> <span class="token variable">$file</span> <span class="token variable">\${file}</span>.bak<span class="token punctuation">;</span> <span class="token keyword">done</span>

<span class="token comment"># step.3</span>
<span class="token function">sudo</span> <span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^mirrorlist=|#mirrorlist=|g&#39;</span> <span class="token punctuation">\\</span>
         <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g&#39;</span> <span class="token punctuation">\\</span>
         <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\\</span>
         /etc/yum.repos.d/CentOS-*.repo

<span class="token comment"># step.4</span>
yum clean all <span class="token operator">&amp;&amp;</span> yum makecache fast
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装-zabbix" tabindex="-1"><a class="header-anchor" href="#安装-zabbix" aria-hidden="true">#</a> 安装 zabbix</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 配置 zabbix 源</span>
<span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm

<span class="token comment"># step.2</span>
yum clean all

<span class="token comment"># step.3 安装 zabbix 服务端组件</span>
yum <span class="token function">install</span> zabbix-server-mysql zabbix-agent <span class="token parameter variable">-y</span>

<span class="token comment"># step.4 安装 zabbix 前端组件</span>
yum <span class="token function">install</span> centos-release-scl <span class="token parameter variable">-y</span>

<span class="token comment"># step.5</span>
<span class="token function">vim</span> /etc/yum.repos.d/zabbix.repo

<span class="token comment"># step.5 修改内容</span>
<span class="token punctuation">[</span>zabbix-frontend<span class="token punctuation">]</span>
<span class="token punctuation">..</span>.
<span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token punctuation">..</span>.

<span class="token comment"># step.6 安装 zabbix 前端页面、初始数据库、PHP 及 httpd 组件，可能会出错</span>
yum <span class="token function">install</span> zabbix-web-mysql-scl zabbix-apache-conf-scl <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><h2 id="错误排查" tabindex="-1"><a class="header-anchor" href="#错误排查" aria-hidden="true">#</a> 错误排查</h2><h3 id="network-is-unreachable" tabindex="-1"><a class="header-anchor" href="#network-is-unreachable" aria-hidden="true">#</a> Network is unreachable</h3><h4 id="现象" tabindex="-1"><a class="header-anchor" href="#现象" aria-hidden="true">#</a> 现象</h4><p>执行 <code>yum install zabbix-web-mysql-scl</code> 出现 <code>Network is unreachable</code><code>Could not retrieve mirrorlist http://mirrorlist.centos.org?arch=x86_64&amp;release=7&amp;repo=sclo-rh error was 14: curl#7 - &quot;Failed to connect to 2a05:d012:8b5:6503:9efb:5cad:348f:e826: Network is unreachable&quot;</code></p><h4 id="解决" tabindex="-1"><a class="header-anchor" href="#解决" aria-hidden="true">#</a> 解决</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /etc/yum.repos.d

<span class="token comment"># step.2 备份</span>
<span class="token keyword">for</span> <span class="token for-or-select variable">file</span> <span class="token keyword">in</span> ./CentOS-SCLo-scl*<span class="token punctuation">;</span> <span class="token keyword">do</span> <span class="token function">cp</span> <span class="token variable">$file</span> <span class="token variable">\${file}</span>.bak<span class="token punctuation">;</span> <span class="token keyword">done</span>

<span class="token comment"># step.3</span>
<span class="token function">sudo</span> <span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^mirrorlist=|#mirrorlist=|g&#39;</span> <span class="token punctuation">\\</span>
         <span class="token parameter variable">-e</span> <span class="token string">&#39;s|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.tuna.tsinghua.edu.cn/centos|g&#39;</span> <span class="token punctuation">\\</span>
         <span class="token parameter variable">-i.bak</span> <span class="token punctuation">\\</span>
         /etc/yum.repos.d/CentOS-SCLo-scl*.repo

<span class="token comment"># step.4</span>
yum clean all <span class="token operator">&amp;&amp;</span> yum makecache fast

<span class="token comment"># step.5</span>
yum <span class="token function">install</span> zabbix-web-mysql-scl zabbix-apache-conf-scl <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h3 id="创建数据库" tabindex="-1"><a class="header-anchor" href="#创建数据库" aria-hidden="true">#</a> 创建数据库</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
yum <span class="token function">install</span> mariadb-server <span class="token parameter variable">-y</span>

<span class="token comment"># step.2</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token parameter variable">--now</span> mariadb

<span class="token comment"># step.3</span>
mysql_secure_installation

<span class="token comment"># step.4</span>
mysql <span class="token parameter variable">-u</span> root <span class="token parameter variable">-p</span>
create database zabbix character <span class="token builtin class-name">set</span> utf8 collate utf8_bin<span class="token punctuation">;</span>
create user zabbix@localhost identified by <span class="token string">&#39;password@123&#39;</span><span class="token punctuation">;</span>
grant all privileges on zabbix.* to zabbix@localhost<span class="token punctuation">;</span>
quit<span class="token punctuation">;</span>

<span class="token comment"># step.5</span>
zcat /usr/share/doc/zabbix-server-mysql*/create.sql.gz <span class="token operator">|</span> mysql <span class="token parameter variable">-u</span> zabbix <span class="token parameter variable">-p</span> zabbix

<span class="token comment"># step.6</span>
<span class="token function">vim</span> /etc/zabbix/zabbix_server.conf

<span class="token comment"># step.6 修改内容</span>
<span class="token assign-left variable">DBPassword</span><span class="token operator">=</span>password@123

<span class="token comment"># step.7 配置时区</span>
<span class="token function">vim</span> /etc/opt/rh/rh-php72/php-fpm.d/zabbix.conf

<span class="token comment"># step.7 修改内容</span>
php_value<span class="token punctuation">[</span>date.timezone<span class="token punctuation">]</span> <span class="token operator">=</span> Asia/Shanghai

<span class="token comment"># step.8 配置字体，避免前台监控图形中文乱码</span>
yum <span class="token parameter variable">-y</span> <span class="token function">install</span> wqy-microhei-fonts

<span class="token comment"># step.8 修改内容</span>
<span class="token function">cp</span> /usr/share/fonts/wqy-microhei/wqy-microhei.ttc /usr/share/fonts/dejavu/DejaVuSans.ttf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-zabbix" tabindex="-1"><a class="header-anchor" href="#启动-zabbix" aria-hidden="true">#</a> 启动 zabbix</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
systemctl restart zabbix-server zabbix-agent httpd rh-php72-php-fpm

<span class="token comment"># step.2</span>
systemctl <span class="token builtin class-name">enable</span> zabbix-server zabbix-agent httpd rh-php72-php-fpm

<span class="token comment"># step.3 查看 zabbix server 日志</span>
<span class="token function">cat</span> /var/log/zabbix/zabbix_server.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>浏览器访问 http://xxxx/zabbix ，账号密码 Admin/zabbix</p><h2 id="安装-zabbix-agent" tabindex="-1"><a class="header-anchor" href="#安装-zabbix-agent" aria-hidden="true">#</a> 安装 Zabbix Agent</h2><p>在 Zabbix web 页面点击 Configuration -&gt; Hosts -&gt; Create host 添加主机</p><h3 id="安装-zabbix-agent-1" tabindex="-1"><a class="header-anchor" href="#安装-zabbix-agent-1" aria-hidden="true">#</a> 安装 zabbix agent</h3><h4 id="被动模式" tabindex="-1"><a class="header-anchor" href="#被动模式" aria-hidden="true">#</a> 被动模式</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 配置 zabbix 源</span>
<span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm

<span class="token comment"># step.2</span>
yum clean all

<span class="token comment"># step.3 安装</span>
yum <span class="token function">install</span> zabbix-agent <span class="token parameter variable">-y</span>

<span class="token comment"># step.4</span>
<span class="token function">vim</span> /etc/zabbix/zabbix_agentd.conf

<span class="token comment"># step.4 修改内容</span>
<span class="token assign-left variable">StartAgents</span><span class="token operator">=</span><span class="token number">0</span>               <span class="token comment"># 可选，开启主动推送</span>
<span class="token assign-left variable">Server</span><span class="token operator">=</span><span class="token number">192.168</span>.1.129        <span class="token comment"># zabbix server 地址</span>
<span class="token assign-left variable">ServerActive</span><span class="token operator">=</span><span class="token number">192.168</span>.1.129  <span class="token comment"># zabbix server 地址</span>
<span class="token assign-left variable">Hostname</span><span class="token operator">=</span><span class="token number">192.168</span>.1.130      <span class="token comment"># 本机主机名，与 zabbix web 中配置一样</span>

<span class="token comment"># step.5 启动</span>
systemctl restart zabbix-agent.service <span class="token operator">&amp;&amp;</span> systemctl <span class="token builtin class-name">enable</span> zabbix-agent.service

<span class="token comment"># step.6</span>
systemctl status zabbix-agent.service

<span class="token comment"># step.7 查看 zabbix server 日志</span>
<span class="token function">cat</span> /var/log/zabbix/zabbix_agentd.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-部署" tabindex="-1"><a class="header-anchor" href="#docker-部署" aria-hidden="true">#</a> Docker 部署</h2><h3 id="docker-compose-yaml" tabindex="-1"><a class="header-anchor" href="#docker-compose-yaml" aria-hidden="true">#</a> docker-compose.yaml</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span>

<span class="token key atrule">networks</span><span class="token punctuation">:</span>
  <span class="token key atrule">zbx_net</span><span class="token punctuation">:</span>
    <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge

<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">zabbix-mysql</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> mysql<span class="token punctuation">:</span>8.0.23
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> zabbix<span class="token punctuation">-</span>mysql
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">command</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> mysqld
      <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>default<span class="token punctuation">-</span>authentication<span class="token punctuation">-</span>plugin=mysql_native_password
      <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>character<span class="token punctuation">-</span>set<span class="token punctuation">-</span>server=utf8
      <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>collation<span class="token punctuation">-</span>server=utf8_bin
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> MYSQL_DATABASE=zabbix
      <span class="token punctuation">-</span> MYSQL_USER=zabbix
      <span class="token punctuation">-</span> MYSQL_PASSWORD=zabbix
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=biitt@123
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 13306<span class="token punctuation">:</span><span class="token number">3306</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./db/data<span class="token punctuation">:</span>/var/lib/mysql
      <span class="token punctuation">-</span> ./db/logs<span class="token punctuation">:</span>/logs
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zbx_net

  <span class="token key atrule">zabbix-server</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> zabbix/zabbix<span class="token punctuation">-</span>server<span class="token punctuation">-</span>mysql<span class="token punctuation">:</span>centos<span class="token punctuation">-</span>5.2<span class="token punctuation">-</span>latest
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> zabbix<span class="token punctuation">-</span>server
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> DB_SERVER_HOST=zabbix<span class="token punctuation">-</span>mysql
      <span class="token punctuation">-</span> MYSQL_DATABASE=zabbix
      <span class="token punctuation">-</span> MYSQL_USER=zabbix
      <span class="token punctuation">-</span> MYSQL_PASSWORD=zabbix
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=biitt@123
      <span class="token punctuation">-</span> ZBX_JAVAGATEWAY=zabbix<span class="token punctuation">-</span>java<span class="token punctuation">-</span>gateway
      <span class="token punctuation">-</span> ZBX_JAVAGATEWAY_ENABLE=true
      <span class="token punctuation">-</span> ZBX_JAVAGATEWAYPORT=10052
      <span class="token punctuation">-</span> ZBX_IPMIPOLLERS=3
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 10051<span class="token punctuation">:</span><span class="token number">10051</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./server/conf.d<span class="token punctuation">:</span>/etc/zabbix/zabbix_server.conf.d
      <span class="token punctuation">-</span> ./server/logs<span class="token punctuation">:</span>/logs
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>mysql
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zbx_net
  
  <span class="token key atrule">zabbix-web-nginx</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> zabbix/zabbix<span class="token punctuation">-</span>web<span class="token punctuation">-</span>nginx<span class="token punctuation">-</span>mysql<span class="token punctuation">:</span>centos<span class="token punctuation">-</span>5.2<span class="token punctuation">-</span>latest
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> zabbix<span class="token punctuation">-</span>web<span class="token punctuation">-</span>nginx
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> DB_SERVER_HOST=zabbix<span class="token punctuation">-</span>mysql
      <span class="token punctuation">-</span> MYSQL_DATABASE=zabbix
      <span class="token punctuation">-</span> MYSQL_USER=zabbix
      <span class="token punctuation">-</span> MYSQL_PASSWORD=zabbix
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=biitt@123
      <span class="token punctuation">-</span> ZBX_SERVER_HOST=zabbix<span class="token punctuation">-</span>server
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 18080<span class="token punctuation">:</span><span class="token number">8080</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./web/conf.d<span class="token punctuation">:</span>/etc/zabbix/web/conf.d
      <span class="token punctuation">-</span> ./web/logs<span class="token punctuation">:</span>/logs
      <span class="token punctuation">-</span> ./web/DejaVuSans.ttf<span class="token punctuation">:</span>/usr/share/zabbix/assets/fonts/DejaVuSans.ttf
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>server
      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>mysql
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zbx_net
  
  <span class="token key atrule">zabbix-java-gateway</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> zabbix/zabbix<span class="token punctuation">-</span>java<span class="token punctuation">-</span>gateway<span class="token punctuation">:</span>centos<span class="token punctuation">-</span>5.2<span class="token punctuation">-</span>latest
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> zabbix<span class="token punctuation">-</span>java<span class="token punctuation">-</span>gateway
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zbx_net
  
  <span class="token key atrule">zabbix-agent</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> zabbix/zabbix<span class="token punctuation">-</span>agent<span class="token punctuation">:</span>centos<span class="token punctuation">-</span>5.2<span class="token punctuation">-</span>latest
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> zabbix<span class="token punctuation">-</span>agent
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 10050<span class="token punctuation">:</span><span class="token number">10050</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ZBX_HOSTNAME=Zabbix server
      <span class="token punctuation">-</span> ZBX_SERVER_HOST=zabbix<span class="token punctuation">-</span>server
      <span class="token punctuation">-</span> ZBX_SERVER_PORT=10051
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zabbix<span class="token punctuation">-</span>server
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> zbx_net
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署" tabindex="-1"><a class="header-anchor" href="#部署" aria-hidden="true">#</a> 部署</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /opt/docker/zabbix/web

<span class="token function">wget</span> https://dl.cactifans.com/zabbix_docker/msty.ttf
<span class="token function">mv</span> msty.ttf DejaVuSans.ttf

<span class="token builtin class-name">cd</span> /opt/docker/zabbix

<span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25);function b(v,m){const a=i("ExternalLinkIcon");return t(),l("div",null,[r,n("ul",null,[n("li",null,[n("a",u,[s("官方下载 Zabbix"),p(a)])])]),d])}const h=e(o,[["render",b],["__file","zabbix安装.html.vue"]]);export{h as default};
