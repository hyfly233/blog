import{_ as s,c as n,o as a,e}from"./app-B0rS_8FZ.js";const l={},i=e(`<p>Syslog 是 Linux 系统默认的日志守护进程</p><ul><li>$template 指令：<a href="https://www.rsyslog.com/doc/master/configuration/properties.html" target="_blank" rel="noopener noreferrer">https://www.rsyslog.com/doc/master/configuration/properties.html</a></li></ul><h2 id="探针日志-syslog-服务端" tabindex="-1"><a class="header-anchor" href="#探针日志-syslog-服务端"><span>探针日志 Syslog 服务端</span></a></h2><h3 id="开启日志接收" tabindex="-1"><a class="header-anchor" href="#开启日志接收"><span>开启日志接收</span></a></h3><p>使用 udp 协议接收日志，需要打开注释</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># Provides UDP syslog reception 打开 udp</span></span>
<span class="line"><span class="token variable">$ModLoad</span> imudp</span>
<span class="line"><span class="token variable">$UDPServerRun</span> <span class="token number">514</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Provides TCP syslog reception 打开 tcp</span></span>
<span class="line"><span class="token comment">#$ModLoad imtcp</span></span>
<span class="line"><span class="token comment">#$InputTCPServerRun 514</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 tcpdump 查看 syslog 客户端是否有发送数据</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">tcpdump <span class="token parameter variable">-i</span> eth1 <span class="token parameter variable">-vvv</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="日志转存" tabindex="-1"><a class="header-anchor" href="#日志转存"><span>日志转存</span></a></h3><p>在 /etc/rsyslog.conf 中添加规则，将 192.168.0.111 发送过来的日志转存到其他文件夹中，得到的日文件名为 &quot;/var/log/nta/%fromhost-ip%/%syslogtag%-%$YEAR%%$MONTH%%$DAY%%$HOUR%.log&quot;</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># 设置日志记录的最大长度</span></span>
<span class="line"><span class="token variable">$MaxMessageSize</span> 32k</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 需要放 *.info 之前，不然会导致 /var/log/message 重复记录日志</span></span>
<span class="line"><span class="token variable">$template</span> CleanMsgFormat,<span class="token string">&quot;%fromhost-ip%%msg%<span class="token entity" title="\\n">\\n</span>&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token variable">$template</span> nta_FileFormat,<span class="token string">&quot;/var/log/nta/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.111&#39;</span> <span class="token keyword">then</span> ?nta_FileFormat<span class="token punctuation">;</span>CleanMsgFormat</span>
<span class="line"><span class="token operator">&amp;</span> ~</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下面的不需要修改</span></span>
<span class="line"><span class="token comment"># Log anything (except mail) of level info or higher.</span></span>
<span class="line"><span class="token comment"># Don&#39;t log private authentication messages!</span></span>
<span class="line">*.info<span class="token punctuation">;</span>mail.none<span class="token punctuation">;</span>authpriv.none<span class="token punctuation">;</span>cron.none                /var/log/messages</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启 syslog 服务端</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># 重启服务</span></span>
<span class="line">systemctl restart rsyslog.service <span class="token operator">&amp;&amp;</span> systemctl status rsyslog.service</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看转存的日志</span></span>
<span class="line">ll /var/log/nta</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="防火墙日志" tabindex="-1"><a class="header-anchor" href="#防火墙日志"><span>防火墙日志</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># 设置日志记录的最大长度</span></span>
<span class="line"><span class="token variable">$MaxMessageSize</span> 32k</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 需要放 *.info 之前，不然会导致 /var/log/message 重复记录日志</span></span>
<span class="line"><span class="token variable">$template</span> CleanMsgFormat,<span class="token string">&quot;%msg%<span class="token entity" title="\\n">\\n</span>&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token variable">$template</span> firewall_FileFormat,<span class="token string">&quot;/var/log/firewall/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.17&#39;</span> <span class="token keyword">then</span> ?firewall_FileFormat<span class="token punctuation">;</span>CleanMsgFormat</span>
<span class="line"><span class="token operator">&amp;</span> ~</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="corn-脚本" tabindex="-1"><a class="header-anchor" href="#corn-脚本"><span>Corn 脚本</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置要清理的目录</span></span>
<span class="line"><span class="token assign-left variable">target_directory</span><span class="token operator">=</span><span class="token string">&quot;/var/log/nta/&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 计算当前时间减去5小时的时间戳</span></span>
<span class="line"><span class="token assign-left variable">five_hours_ago</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;5 hours ago&quot;</span> +<span class="token string">&quot;%s&quot;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查找目录中最后一次修改时间超过5个小时的文件并删除</span></span>
<span class="line"><span class="token function">find</span> <span class="token string">&quot;<span class="token variable">$target_directory</span>&quot;</span>/*/ <span class="token parameter variable">-type</span> f <span class="token parameter variable">-mmin</span> +300 <span class="token parameter variable">-delete</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 输出日志（可选）</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;Cleanup completed at <span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置要清理的目录</span></span>
<span class="line"><span class="token assign-left variable">target_directory</span><span class="token operator">=</span><span class="token string">&quot;/var/log/firewall/&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 计算当前时间减去5小时的时间戳</span></span>
<span class="line"><span class="token assign-left variable">five_hours_ago</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;5 hours ago&quot;</span> +<span class="token string">&quot;%s&quot;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查找目录中最后一次修改时间超过5个小时的文件并删除</span></span>
<span class="line"><span class="token function">find</span> <span class="token string">&quot;<span class="token variable">$target_directory</span>&quot;</span>/*/ <span class="token parameter variable">-type</span> f <span class="token parameter variable">-mmin</span> +300 <span class="token parameter variable">-delete</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 输出日志（可选）</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;Cleanup completed at <span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">chmod</span> +x cleanup_script.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 打开 crontab 编辑器</span></span>
<span class="line"><span class="token function">crontab</span> <span class="token parameter variable">-e</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加内容</span></span>
<span class="line"><span class="token number">0</span> */5 * * * /var/log/nta/cleanup_script.sh</span>
<span class="line"></span>
<span class="line"><span class="token number">0</span> */5 * * * /var/log/firewall/cleanup_script.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看 crontab 脚本</span></span>
<span class="line"><span class="token function">crontab</span> <span class="token parameter variable">-l</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">grep</span> <span class="token parameter variable">-o</span> <span class="token string">&#39;example&#39;</span> file.txt <span class="token operator">|</span> <span class="token function">wc</span> <span class="token parameter variable">-l</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">tcpdump <span class="token parameter variable">-i</span> eth1 src <span class="token number">192.168</span>.0.17 <span class="token parameter variable">-vvv</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># rsyslog configuration file</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># For more information see /usr/share/doc/rsyslog-*/rsyslog_conf.html</span></span>
<span class="line"><span class="token comment"># If you experience problems, see http://www.rsyslog.com/doc/troubleshoot.html</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#### MODULES ####</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># The imjournal module bellow is now used as a message source instead of imuxsock.</span></span>
<span class="line"><span class="token variable">$ModLoad</span> imuxsock <span class="token comment"># provides support for local system logging (e.g. via logger command)</span></span>
<span class="line"><span class="token variable">$ModLoad</span> imjournal <span class="token comment"># provides access to the systemd journal</span></span>
<span class="line"><span class="token comment">#$ModLoad imklog # reads kernel messages (the same are read from journald)</span></span>
<span class="line"><span class="token comment">#$ModLoad immark  # provides --MARK-- message capability</span></span>
<span class="line"></span>
<span class="line"><span class="token variable">$MaxMessageSize</span> 32k</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Provides UDP syslog reception</span></span>
<span class="line"><span class="token comment">#$ModLoad imudp</span></span>
<span class="line"><span class="token comment">#$UDPServerRun 514</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Provides TCP syslog reception</span></span>
<span class="line"><span class="token variable">$ModLoad</span> imtcp</span>
<span class="line"><span class="token variable">$InputTCPServerRun</span> <span class="token number">514</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#### GLOBAL DIRECTIVES ####</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Where to place auxiliary files</span></span>
<span class="line"><span class="token variable">$WorkDirectory</span> /var/lib/rsyslog</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Use default timestamp format</span></span>
<span class="line"><span class="token variable">$ActionFileDefaultTemplate</span> RSYSLOG_TraditionalFileFormat</span>
<span class="line"></span>
<span class="line"><span class="token comment"># File syncing capability is disabled by default. This feature is usually not required,</span></span>
<span class="line"><span class="token comment"># not useful and an extreme performance hit</span></span>
<span class="line"><span class="token comment">#$ActionFileEnableSync on</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Include all config files in /etc/rsyslog.d/</span></span>
<span class="line"><span class="token variable">$IncludeConfig</span> /etc/rsyslog.d/*.conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Turn off message reception via local log socket;</span></span>
<span class="line"><span class="token comment"># local messages are retrieved through imjournal now.</span></span>
<span class="line"><span class="token variable">$OmitLocalLogging</span> on</span>
<span class="line"></span>
<span class="line"><span class="token comment"># File to store the position in the journal</span></span>
<span class="line"><span class="token variable">$IMJournalStateFile</span> imjournal.state</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment">#### RULES ####</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">## 在消息头前加上了源IP地址</span></span>
<span class="line"><span class="token variable">$template</span> CleanMsgFormat111,<span class="token string">&quot;%fromhost-ip% %timestamp:::date-rfc3339% %msg%<span class="token entity" title="\\n">\\n</span>&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token variable">$template</span> nta_FileFormat,<span class="token string">&quot;/var/log/nta/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.111&#39;</span> <span class="token keyword">then</span> ?nta_FileFormat<span class="token punctuation">;</span>CleanMsgFormat111</span>
<span class="line"><span class="token operator">&amp;</span> ~</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token variable">$template</span> CleanMsgFormat17,<span class="token string">&quot;%fromhost-ip% %timestamp:::date-rfc3339% %msg%<span class="token entity" title="\\n">\\n</span>&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token variable">$template</span> firewall_FileFormat,<span class="token string">&quot;/var/log/firewall/%fromhost-ip%/%syslogtag%-%<span class="token variable">$YEAR</span>%%<span class="token variable">$MONTH</span>%%<span class="token variable">$DAY</span>%%<span class="token variable">$HOUR</span>%.log&quot;</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token variable">$fromhost</span>-ip <span class="token operator">==</span> <span class="token string">&#39;192.168.0.17&#39;</span> <span class="token keyword">then</span> ?firewall_FileFormat<span class="token punctuation">;</span>CleanMsgFormat17</span>
<span class="line"><span class="token operator">&amp;</span> ~</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Log all kernel messages to the console.</span></span>
<span class="line"><span class="token comment"># Logging much else clutters up the screen.</span></span>
<span class="line"><span class="token comment">#kern.*                                                 /dev/console</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Log anything (except mail) of level info or higher.</span></span>
<span class="line"><span class="token comment"># Don&#39;t log private authentication messages!</span></span>
<span class="line">*.info<span class="token punctuation">;</span>mail.none<span class="token punctuation">;</span>authpriv.none<span class="token punctuation">;</span>cron.none                /var/log/messages</span>
<span class="line"></span>
<span class="line"><span class="token comment"># The authpriv file has restricted access.</span></span>
<span class="line">authpriv.*                                              /var/log/secure</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Log all the mail messages in one place.</span></span>
<span class="line">mail.*                                                  -/var/log/maillog</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Log cron stuff</span></span>
<span class="line">cron.*                                                  /var/log/cron</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Everybody gets emergency messages</span></span>
<span class="line">*.emerg                                                 :omusrmsg:*</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Save news errors of level crit and higher in a special file.</span></span>
<span class="line">uucp,news.crit                                          /var/log/spooler</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Save boot messages also to boot.log</span></span>
<span class="line">local7.*                                                /var/log/boot.log</span>
<span class="line"></span>
<span class="line"><span class="token comment"># ### begin forwarding rule ###</span></span>
<span class="line"><span class="token comment"># The statement between the begin ... end define a SINGLE forwarding</span></span>
<span class="line"><span class="token comment"># rule. They belong together, do NOT split them. If you create multiple</span></span>
<span class="line"><span class="token comment"># forwarding rules, duplicate the whole block!</span></span>
<span class="line"><span class="token comment"># Remote Logging (we use TCP for reliable delivery)</span></span>
<span class="line"><span class="token comment">#</span></span>
<span class="line"><span class="token comment"># An on-disk queue is created for this action. If the remote host is</span></span>
<span class="line"><span class="token comment"># down, messages are spooled to disk and sent when it is up again.</span></span>
<span class="line"><span class="token comment">#$ActionQueueFileName fwdRule1 # unique name prefix for spool files</span></span>
<span class="line"><span class="token comment">#$ActionQueueMaxDiskSpace 1g   # 1gb space limit (use as much as possible)</span></span>
<span class="line"><span class="token comment">#$ActionQueueSaveOnShutdown on # save messages to disk on shutdown</span></span>
<span class="line"><span class="token comment">#$ActionQueueType LinkedList   # run asynchronously</span></span>
<span class="line"><span class="token comment">#$ActionResumeRetryCount -1    # infinite retries if host is down</span></span>
<span class="line"><span class="token comment"># remote host is: name/ip:port, e.g. 192.168.0.1:514, port optional</span></span>
<span class="line"><span class="token comment">#*.* @@remote-host:514</span></span>
<span class="line"><span class="token comment"># ### end of the forwarding rule ###</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog</a><a href="https://www.rsyslog.com/doc/configuration/properties.html" target="_blank" rel="noopener noreferrer">https://www.rsyslog.com/doc/configuration/properties.html</a></p>`,22),p=[i];function c(t,o){return a(),n("div",null,p)}const d=s(l,[["render",c],["__file","Rsyslog处理日志报文.html.vue"]]),m=JSON.parse('{"path":"/md/article/middleware/rsyslog/Rsyslog%E5%A4%84%E7%90%86%E6%97%A5%E5%BF%97%E6%8A%A5%E6%96%87.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"探针日志 Syslog 服务端","slug":"探针日志-syslog-服务端","link":"#探针日志-syslog-服务端","children":[{"level":3,"title":"开启日志接收","slug":"开启日志接收","link":"#开启日志接收","children":[]},{"level":3,"title":"日志转存","slug":"日志转存","link":"#日志转存","children":[]}]},{"level":2,"title":"防火墙日志","slug":"防火墙日志","link":"#防火墙日志","children":[]},{"level":2,"title":"Corn 脚本","slug":"corn-脚本","link":"#corn-脚本","children":[]}],"git":{"updatedTime":1722677006000,"contributors":[{"name":"hyfly233","email":"hyfly233@outlook.com","commits":1}]},"filePathRelative":"md/article/middleware/rsyslog/Rsyslog处理日志报文.md"}');export{d as comp,m as data};
