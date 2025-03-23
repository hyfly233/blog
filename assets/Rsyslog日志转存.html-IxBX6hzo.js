import{_ as n,c as a,f as l,o as e}from"./app-BOK5XMKI.js";const i={};function p(c,s){return e(),a("div",null,s[0]||(s[0]=[l(`<h2 id="syslog" tabindex="-1"><a class="header-anchor" href="#syslog"><span>Syslog</span></a></h2><p>Syslog 是 Linux 系统默认的日志守护进程</p><ul><li>$template 指令：<a href="https://www.rsyslog.com/doc/master/configuration/properties.html" target="_blank" rel="noopener noreferrer">https://www.rsyslog.com/doc/master/configuration/properties.html</a></li></ul><h2 id="日志转存" tabindex="-1"><a class="header-anchor" href="#日志转存"><span>日志转存</span></a></h2><h3 id="开启日志接收" tabindex="-1"><a class="header-anchor" href="#开启日志接收"><span>开启日志接收</span></a></h3><p>使用 udp 协议接收日志，需要打开注释</p><div class="language-bash line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-bash;"><code><span class="line"><span class="line"><span style="color:#616E88;"># Provides UDP syslog reception 打开 udp</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$ModLoad</span><span style="color:#D8DEE9FF;"> imudp</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$UDPServerRun</span><span style="color:#D8DEE9FF;"> 514</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Provides TCP syslog reception 打开 tcp</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ModLoad imtcp</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$InputTCPServerRun 514</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 tcpdump 查看 syslog 客户端是否有发送数据</p><div class="language-bash line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-bash;"><code><span class="line"><span class="line"><span style="color:#88C0D0;">tcpdump</span><span style="color:#A3BE8C;"> -i</span><span style="color:#A3BE8C;"> eth1</span><span style="color:#A3BE8C;"> -vvv</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="修改-rsyslog-conf" tabindex="-1"><a class="header-anchor" href="#修改-rsyslog-conf"><span>修改 rsyslog.conf</span></a></h3><p>在 /etc/rsyslog.conf 中添加规则，将 192.168.0.111 发送过来的日志转存到其他文件夹中，得到的日文件名为 &quot;/var/log/test/%fromhost-ip%/%syslogtag%-%$YEAR%%$MONTH%%$DAY%%$HOUR%.log&quot;</p><div class="language-bash line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-bash;"><code><span class="line"><span class="line"><span style="color:#616E88;"># 设置日志记录的最大长度</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$MaxMessageSize</span><span style="color:#D8DEE9FF;"> 32k</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># 需要放 *.info 之前，不然会导致 /var/log/message 重复记录日志</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$template</span><span style="color:#D8DEE9FF;"> CleanMsgFormat,</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">%fromhost-ip%%msg%\\n</span><span style="color:#ECEFF4;">&quot;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$template</span><span style="color:#D8DEE9FF;"> test_FileFormat,</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">/var/log/test/%fromhost-ip%/%syslogtag%-%</span><span style="color:#D8DEE9;">$YEAR</span><span style="color:#A3BE8C;">%%</span><span style="color:#D8DEE9;">$MONTH</span><span style="color:#A3BE8C;">%%</span><span style="color:#D8DEE9;">$DAY</span><span style="color:#A3BE8C;">%%</span><span style="color:#D8DEE9;">$HOUR</span><span style="color:#A3BE8C;">%.log</span><span style="color:#ECEFF4;">&quot;</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">if</span><span style="color:#D8DEE9;"> $fromhost</span><span style="color:#D8DEE9FF;">-ip == </span><span style="color:#ECEFF4;">&#39;</span><span style="color:#A3BE8C;">192.168.0.111</span><span style="color:#ECEFF4;">&#39;</span><span style="color:#81A1C1;"> then</span><span style="color:#81A1C1;"> ?</span><span style="color:#D8DEE9FF;">test_FileFormat</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">CleanMsgFormat</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">&amp;</span><span style="color:#88C0D0;"> ~</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># 下面的不需要修改</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Log anything (except mail) of level info or higher.</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Don&#39;t log private authentication messages!</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">*.info</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">mail.none</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">authpriv.none</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">cron.none</span><span style="color:#A3BE8C;">                /var/log/messages</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重启-syslog-服务端" tabindex="-1"><a class="header-anchor" href="#重启-syslog-服务端"><span>重启 syslog 服务端</span></a></h3><div class="language-bash line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-bash;"><code><span class="line"><span class="line"><span style="color:#616E88;"># 重启服务</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">systemctl</span><span style="color:#A3BE8C;"> restart</span><span style="color:#A3BE8C;"> rsyslog.service</span><span style="color:#ECEFF4;"> &amp;&amp;</span><span style="color:#88C0D0;"> systemctl</span><span style="color:#A3BE8C;"> status</span><span style="color:#A3BE8C;"> rsyslog.service</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># 查看转存的日志</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">ll</span><span style="color:#A3BE8C;"> /var/log/test</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="完整配置" tabindex="-1"><a class="header-anchor" href="#完整配置"><span>完整配置</span></a></h2><div class="language-bash line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-bash;"><code><span class="line"><span class="line"><span style="color:#616E88;"># rsyslog configuration file</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># For more information see /usr/share/doc/rsyslog-*/rsyslog_conf.html</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># If you experience problems, see http://www.rsyslog.com/doc/troubleshoot.html</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#### MODULES ####</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># The imjournal module bellow is now used as a message source instead of imuxsock.</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$ModLoad</span><span style="color:#D8DEE9FF;"> imuxsock </span><span style="color:#616E88;"># provides support for local system logging (e.g. via logger command)</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$ModLoad</span><span style="color:#D8DEE9FF;"> imjournal </span><span style="color:#616E88;"># provides access to the systemd journal</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ModLoad imklog # reads kernel messages (the same are read from journald)</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ModLoad immark  # provides --MARK-- message capability</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$MaxMessageSize</span><span style="color:#D8DEE9FF;"> 32k</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Provides UDP syslog reception</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ModLoad imudp</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$UDPServerRun 514</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Provides TCP syslog reception</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$ModLoad</span><span style="color:#D8DEE9FF;"> imtcp</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$InputTCPServerRun</span><span style="color:#D8DEE9FF;"> 514</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#### GLOBAL DIRECTIVES ####</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Where to place auxiliary files</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$WorkDirectory</span><span style="color:#D8DEE9FF;"> /var/lib/rsyslog</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Use default timestamp format</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$ActionFileDefaultTemplate</span><span style="color:#D8DEE9FF;"> RSYSLOG_TraditionalFileFormat</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># File syncing capability is disabled by default. This feature is usually not required,</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># not useful and an extreme performance hit</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ActionFileEnableSync on</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Include all config files in /etc/rsyslog.d/</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$IncludeConfig</span><span style="color:#D8DEE9FF;"> /etc/rsyslog.d/</span><span style="color:#81A1C1;">*</span><span style="color:#D8DEE9FF;">.conf</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Turn off message reception via local log socket;</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># local messages are retrieved through imjournal now.</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$OmitLocalLogging</span><span style="color:#D8DEE9FF;"> on</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># File to store the position in the journal</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$IMJournalStateFile</span><span style="color:#D8DEE9FF;"> imjournal.state</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#### RULES ####</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">## 在消息头前加上了源IP地址</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$template</span><span style="color:#D8DEE9FF;"> CleanMsgFormat111,</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">%fromhost-ip% %timestamp:::date-rfc3339% %msg%\\n</span><span style="color:#ECEFF4;">&quot;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">$template</span><span style="color:#D8DEE9FF;"> test_FileFormat,</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">/var/log/test/%fromhost-ip%/%syslogtag%-%</span><span style="color:#D8DEE9;">$YEAR</span><span style="color:#A3BE8C;">%%</span><span style="color:#D8DEE9;">$MONTH</span><span style="color:#A3BE8C;">%%</span><span style="color:#D8DEE9;">$DAY</span><span style="color:#A3BE8C;">%%</span><span style="color:#D8DEE9;">$HOUR</span><span style="color:#A3BE8C;">%.log</span><span style="color:#ECEFF4;">&quot;</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">if</span><span style="color:#D8DEE9;"> $fromhost</span><span style="color:#D8DEE9FF;">-ip == </span><span style="color:#ECEFF4;">&#39;</span><span style="color:#A3BE8C;">192.168.0.111</span><span style="color:#ECEFF4;">&#39;</span><span style="color:#81A1C1;"> then</span><span style="color:#81A1C1;"> ?</span><span style="color:#D8DEE9FF;">test_FileFormat</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">CleanMsgFormat111</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">&amp;</span><span style="color:#88C0D0;"> ~</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Log all kernel messages to the console.</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Logging much else clutters up the screen.</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#kern.*                                                 /dev/console</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Log anything (except mail) of level info or higher.</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Don&#39;t log private authentication messages!</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">*.info</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">mail.none</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">authpriv.none</span><span style="color:#81A1C1;">;</span><span style="color:#88C0D0;">cron.none</span><span style="color:#A3BE8C;">                /var/log/messages</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># The authpriv file has restricted access.</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">authpriv.*</span><span style="color:#A3BE8C;">                                              /var/log/secure</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Log all the mail messages in one place.</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">mail.*</span><span style="color:#A3BE8C;">                                                  -/var/log/maillog</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Log cron stuff</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">cron.*</span><span style="color:#A3BE8C;">                                                  /var/log/cron</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Everybody gets emergency messages</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">*</span><span style="color:#D8DEE9FF;">.emerg                                                 :omusrmsg:</span><span style="color:#81A1C1;">*</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Save news errors of level crit and higher in a special file.</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">uucp,news.crit</span><span style="color:#A3BE8C;">                                          /var/log/spooler</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Save boot messages also to boot.log</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">local7.*</span><span style="color:#A3BE8C;">                                                /var/log/boot.log</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># ### begin forwarding rule ###</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># The statement between the begin ... end define a SINGLE forwarding</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># rule. They belong together, do NOT split them. If you create multiple</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># forwarding rules, duplicate the whole block!</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># Remote Logging (we use TCP for reliable delivery)</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># An on-disk queue is created for this action. If the remote host is</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># down, messages are spooled to disk and sent when it is up again.</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ActionQueueFileName fwdRule1 # unique name prefix for spool files</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ActionQueueMaxDiskSpace 1g   # 1gb space limit (use as much as possible)</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ActionQueueSaveOnShutdown on # save messages to disk on shutdown</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ActionQueueType LinkedList   # run asynchronously</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#$ActionResumeRetryCount -1    # infinite retries if host is down</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># remote host is: name/ip:port, e.g. 192.168.0.1:514, port optional</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;">#*.* @@remote-host:514</span></span></span>
<span class="line"><span class="line"><span style="color:#616E88;"># ### end of the forwarding rule ###</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考</span></a></h2><p><a href="https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog</a><a href="https://www.rsyslog.com/doc/configuration/properties.html" target="_blank" rel="noopener noreferrer">https://www.rsyslog.com/doc/configuration/properties.html</a></p>`,18)]))}const r=n(i,[["render",p],["__file","Rsyslog日志转存.html.vue"]]),d=JSON.parse('{"path":"/md/article/middleware/rsyslog/Rsyslog%E6%97%A5%E5%BF%97%E8%BD%AC%E5%AD%98.html","title":"Rsyslog日志转存","lang":"en-US","frontmatter":{"title":"Rsyslog日志转存","sidebar":"heading"},"headers":[{"level":2,"title":"Syslog","slug":"syslog","link":"#syslog","children":[]},{"level":2,"title":"日志转存","slug":"日志转存","link":"#日志转存","children":[{"level":3,"title":"开启日志接收","slug":"开启日志接收","link":"#开启日志接收","children":[]},{"level":3,"title":"修改 rsyslog.conf","slug":"修改-rsyslog-conf","link":"#修改-rsyslog-conf","children":[]},{"level":3,"title":"重启 syslog 服务端","slug":"重启-syslog-服务端","link":"#重启-syslog-服务端","children":[]}]},{"level":2,"title":"完整配置","slug":"完整配置","link":"#完整配置","children":[]},{"level":2,"title":"参考","slug":"参考","link":"#参考","children":[]}],"git":{"updatedTime":1735864944000,"contributors":[{"name":"hyfly233","username":"hyfly233","email":"hyfly233@outlook.com","commits":4,"url":"https://github.com/hyfly233"}]},"filePathRelative":"md/article/middleware/rsyslog/Rsyslog日志转存.md"}');export{r as comp,d as data};
