import{_ as i,M as l,p as o,q as t,R as s,t as n,N as e,a1 as r}from"./framework-39bdc1ba.js";const c={},p=s("p",null,"Syslog 是 Linux 系统默认的日志守护进程",-1),d={href:"https://www.rsyslog.com/doc/master/configuration/properties.html",target:"_blank",rel:"noopener noreferrer"},m=r(`<h2 id="探针日志-syslog-服务端" tabindex="-1"><a class="header-anchor" href="#探针日志-syslog-服务端" aria-hidden="true">#</a> 探针日志 Syslog 服务端</h2><h3 id="开启日志接收" tabindex="-1"><a class="header-anchor" href="#开启日志接收" aria-hidden="true">#</a> 开启日志接收</h3><p>使用 udp 协议接收日志，需要打开注释</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Provides UDP syslog reception 打开 udp</span>
<span class="token variable">$ModLoad</span> imudp
<span class="token variable">$UDPServerRun</span> <span class="token number">514</span>

<span class="token comment"># Provides TCP syslog reception 打开 tcp</span>
<span class="token comment">#$ModLoad imtcp</span>
<span class="token comment">#$InputTCPServerRun 514</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 tcpdump 查看 syslog 客户端是否有发送数据</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>tcpdump <span class="token parameter variable">-i</span> eth1 <span class="token parameter variable">-vvv</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="日志转存" tabindex="-1"><a class="header-anchor" href="#日志转存" aria-hidden="true">#</a> 日志转存</h3><p>在 /etc/rsyslog.conf 中添加规则，将 192.168.0.111 发送过来的日志转存到其他文件夹中，得到的日文件名为 &quot;/var/log/nta/%fromhost-ip%/%syslogtag%-%$YEAR%%$MONTH%%$DAY%%$HOUR%.log&quot;</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置日志记录的最大长度</span>
<span class="token variable">$MaxMessageSize</span> 32k

<span class="token comment"># 需要放 *.info 之前，不然会导致 /var/log/message 重复记录日志</span>
<span class="token variable">$template</span> CleanMsgFormat,<span class="token string">&quot;%fromhost-ip%%msg%<span class="token entity" title="\\n">\\n</span>&quot;</span>

<span class="token variable">$template</span> nta_FileFormat,<span class="token string">&quot;/var/log/nta/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span>
<span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.111&#39;</span> <span class="token keyword">then</span> ?nta_FileFormat<span class="token punctuation">;</span>CleanMsgFormat
<span class="token operator">&amp;</span> ~

<span class="token comment"># 下面的不需要修改</span>
<span class="token comment"># Log anything (except mail) of level info or higher.</span>
<span class="token comment"># Don&#39;t log private authentication messages!</span>
*.info<span class="token punctuation">;</span>mail.none<span class="token punctuation">;</span>authpriv.none<span class="token punctuation">;</span>cron.none                /var/log/messages
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启 syslog 服务端</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 重启服务</span>
systemctl restart rsyslog.service <span class="token operator">&amp;&amp;</span> systemctl status rsyslog.service

<span class="token comment"># 查看转存的日志</span>
ll /var/log/nta
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="防火墙日志" tabindex="-1"><a class="header-anchor" href="#防火墙日志" aria-hidden="true">#</a> 防火墙日志</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 设置日志记录的最大长度</span>
<span class="token variable">$MaxMessageSize</span> 32k

<span class="token comment"># 需要放 *.info 之前，不然会导致 /var/log/message 重复记录日志</span>
<span class="token variable">$template</span> CleanMsgFormat,<span class="token string">&quot;%msg%<span class="token entity" title="\\n">\\n</span>&quot;</span>

<span class="token variable">$template</span> firewall_FileFormat,<span class="token string">&quot;/var/log/firewall/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span>
<span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.17&#39;</span> <span class="token keyword">then</span> ?firewall_FileFormat<span class="token punctuation">;</span>CleanMsgFormat
<span class="token operator">&amp;</span> ~
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="corn-脚本" tabindex="-1"><a class="header-anchor" href="#corn-脚本" aria-hidden="true">#</a> Corn 脚本</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token comment"># 设置要清理的目录</span>
<span class="token assign-left variable">target_directory</span><span class="token operator">=</span><span class="token string">&quot;/var/log/nta/&quot;</span>

<span class="token comment"># 计算当前时间减去5小时的时间戳</span>
<span class="token assign-left variable">five_hours_ago</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;5 hours ago&quot;</span> +<span class="token string">&quot;%s&quot;</span><span class="token variable">)</span></span>

<span class="token comment"># 查找目录中最后一次修改时间超过5个小时的文件并删除</span>
<span class="token function">find</span> <span class="token string">&quot;<span class="token variable">$target_directory</span>&quot;</span>/*/ <span class="token parameter variable">-type</span> f <span class="token parameter variable">-mmin</span> +300 <span class="token parameter variable">-delete</span>

<span class="token comment"># 输出日志（可选）</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;Cleanup completed at <span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token comment"># 设置要清理的目录</span>
<span class="token assign-left variable">target_directory</span><span class="token operator">=</span><span class="token string">&quot;/var/log/firewall/&quot;</span>

<span class="token comment"># 计算当前时间减去5小时的时间戳</span>
<span class="token assign-left variable">five_hours_ago</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;5 hours ago&quot;</span> +<span class="token string">&quot;%s&quot;</span><span class="token variable">)</span></span>

<span class="token comment"># 查找目录中最后一次修改时间超过5个小时的文件并删除</span>
<span class="token function">find</span> <span class="token string">&quot;<span class="token variable">$target_directory</span>&quot;</span>/*/ <span class="token parameter variable">-type</span> f <span class="token parameter variable">-mmin</span> +300 <span class="token parameter variable">-delete</span>

<span class="token comment"># 输出日志（可选）</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;Cleanup completed at <span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">chmod</span> +x cleanup_script.sh

<span class="token comment"># 打开 crontab 编辑器</span>
<span class="token function">crontab</span> <span class="token parameter variable">-e</span>

<span class="token comment"># 添加内容</span>
<span class="token number">0</span> */5 * * * /var/log/nta/cleanup_script.sh

<span class="token number">0</span> */5 * * * /var/log/firewall/cleanup_script.sh

<span class="token comment"># 查看 crontab 脚本</span>
<span class="token function">crontab</span> <span class="token parameter variable">-l</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">grep</span> <span class="token parameter variable">-o</span> <span class="token string">&#39;example&#39;</span> file.txt <span class="token operator">|</span> <span class="token function">wc</span> <span class="token parameter variable">-l</span>


tcpdump <span class="token parameter variable">-i</span> eth1 src <span class="token number">192.168</span>.0.17 <span class="token parameter variable">-vvv</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># rsyslog configuration file</span>

<span class="token comment"># For more information see /usr/share/doc/rsyslog-*/rsyslog_conf.html</span>
<span class="token comment"># If you experience problems, see http://www.rsyslog.com/doc/troubleshoot.html</span>

<span class="token comment">#### MODULES ####</span>

<span class="token comment"># The imjournal module bellow is now used as a message source instead of imuxsock.</span>
<span class="token variable">$ModLoad</span> imuxsock <span class="token comment"># provides support for local system logging (e.g. via logger command)</span>
<span class="token variable">$ModLoad</span> imjournal <span class="token comment"># provides access to the systemd journal</span>
<span class="token comment">#$ModLoad imklog # reads kernel messages (the same are read from journald)</span>
<span class="token comment">#$ModLoad immark  # provides --MARK-- message capability</span>

<span class="token variable">$MaxMessageSize</span> 32k

<span class="token comment"># Provides UDP syslog reception</span>
<span class="token comment">#$ModLoad imudp</span>
<span class="token comment">#$UDPServerRun 514</span>

<span class="token comment"># Provides TCP syslog reception</span>
<span class="token variable">$ModLoad</span> imtcp
<span class="token variable">$InputTCPServerRun</span> <span class="token number">514</span>

<span class="token comment">#### GLOBAL DIRECTIVES ####</span>

<span class="token comment"># Where to place auxiliary files</span>
<span class="token variable">$WorkDirectory</span> /var/lib/rsyslog

<span class="token comment"># Use default timestamp format</span>
<span class="token variable">$ActionFileDefaultTemplate</span> RSYSLOG_TraditionalFileFormat

<span class="token comment"># File syncing capability is disabled by default. This feature is usually not required,</span>
<span class="token comment"># not useful and an extreme performance hit</span>
<span class="token comment">#$ActionFileEnableSync on</span>

<span class="token comment"># Include all config files in /etc/rsyslog.d/</span>
<span class="token variable">$IncludeConfig</span> /etc/rsyslog.d/*.conf

<span class="token comment"># Turn off message reception via local log socket;</span>
<span class="token comment"># local messages are retrieved through imjournal now.</span>
<span class="token variable">$OmitLocalLogging</span> on

<span class="token comment"># File to store the position in the journal</span>
<span class="token variable">$IMJournalStateFile</span> imjournal.state


<span class="token comment">#### RULES ####</span>

<span class="token comment">## 在消息头前加上了源IP地址</span>
<span class="token variable">$template</span> CleanMsgFormat111,<span class="token string">&quot;%fromhost-ip% %timestamp:::date-rfc3339% %msg%<span class="token entity" title="\\n">\\n</span>&quot;</span>

<span class="token variable">$template</span> nta_FileFormat,<span class="token string">&quot;/var/log/nta/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span>
<span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.111&#39;</span> <span class="token keyword">then</span> ?nta_FileFormat<span class="token punctuation">;</span>CleanMsgFormat111
<span class="token operator">&amp;</span> ~


<span class="token variable">$template</span> CleanMsgFormat17,<span class="token string">&quot;%fromhost-ip% %timestamp:::date-rfc3339% %msg%<span class="token entity" title="\\n">\\n</span>&quot;</span>

<span class="token variable">$template</span> firewall_FileFormat,<span class="token string">&quot;/var/log/firewall/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span>
<span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.17&#39;</span> <span class="token keyword">then</span> ?firewall_FileFormat<span class="token punctuation">;</span>CleanMsgFormat17
<span class="token operator">&amp;</span> ~


<span class="token comment"># Log all kernel messages to the console.</span>
<span class="token comment"># Logging much else clutters up the screen.</span>
<span class="token comment">#kern.*                                                 /dev/console</span>

<span class="token comment"># Log anything (except mail) of level info or higher.</span>
<span class="token comment"># Don&#39;t log private authentication messages!</span>
*.info<span class="token punctuation">;</span>mail.none<span class="token punctuation">;</span>authpriv.none<span class="token punctuation">;</span>cron.none                /var/log/messages

<span class="token comment"># The authpriv file has restricted access.</span>
authpriv.*                                              /var/log/secure

<span class="token comment"># Log all the mail messages in one place.</span>
mail.*                                                  -/var/log/maillog


<span class="token comment"># Log cron stuff</span>
cron.*                                                  /var/log/cron

<span class="token comment"># Everybody gets emergency messages</span>
*.emerg                                                 :omusrmsg:*

<span class="token comment"># Save news errors of level crit and higher in a special file.</span>
uucp,news.crit                                          /var/log/spooler

<span class="token comment"># Save boot messages also to boot.log</span>
local7.*                                                /var/log/boot.log

<span class="token comment"># ### begin forwarding rule ###</span>
<span class="token comment"># The statement between the begin ... end define a SINGLE forwarding</span>
<span class="token comment"># rule. They belong together, do NOT split them. If you create multiple</span>
<span class="token comment"># forwarding rules, duplicate the whole block!</span>
<span class="token comment"># Remote Logging (we use TCP for reliable delivery)</span>
<span class="token comment">#</span>
<span class="token comment"># An on-disk queue is created for this action. If the remote host is</span>
<span class="token comment"># down, messages are spooled to disk and sent when it is up again.</span>
<span class="token comment">#$ActionQueueFileName fwdRule1 # unique name prefix for spool files</span>
<span class="token comment">#$ActionQueueMaxDiskSpace 1g   # 1gb space limit (use as much as possible)</span>
<span class="token comment">#$ActionQueueSaveOnShutdown on # save messages to disk on shutdown</span>
<span class="token comment">#$ActionQueueType LinkedList   # run asynchronously</span>
<span class="token comment">#$ActionResumeRetryCount -1    # infinite retries if host is down</span>
<span class="token comment"># remote host is: name/ip:port, e.g. 192.168.0.1:514, port optional</span>
<span class="token comment">#*.* @@remote-host:514</span>
<span class="token comment"># ### end of the forwarding rule ###</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19),v={href:"https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog",target:"_blank",rel:"noopener noreferrer"},u={href:"https://www.rsyslog.com/doc/configuration/properties.html",target:"_blank",rel:"noopener noreferrer"};function b(k,g){const a=l("ExternalLinkIcon");return o(),t("div",null,[p,s("ul",null,[s("li",null,[n("$template 指令："),s("a",d,[n("https://www.rsyslog.com/doc/master/configuration/properties.html"),e(a)])])]),m,s("p",null,[s("a",v,[n("https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog"),e(a)]),s("a",u,[n("https://www.rsyslog.com/doc/configuration/properties.html"),e(a)])])])}const f=i(c,[["render",b],["__file","Rsyslog处理日志报文.html.vue"]]);export{f as default};
