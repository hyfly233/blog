---
title: Rsyslog日志转存
sidebar: heading
---

## Syslog

Syslog 是 Linux 系统默认的日志守护进程

- $template 指令：[https://www.rsyslog.com/doc/master/configuration/properties.html](https://www.rsyslog.com/doc/master/configuration/properties.html)

## 日志转存

### 开启日志接收
使用 udp 协议接收日志，需要打开注释

```bash
# Provides UDP syslog reception 打开 udp
$ModLoad imudp
$UDPServerRun 514

# Provides TCP syslog reception 打开 tcp
#$ModLoad imtcp
#$InputTCPServerRun 514
```

使用 tcpdump 查看 syslog 客户端是否有发送数据

```bash
tcpdump -i eth1 -vvv
```

### 修改 rsyslog.conf

在 /etc/rsyslog.conf 中添加规则，将 192.168.0.111 发送过来的日志转存到其他文件夹中，得到的日文件名为
"/var/log/test/%fromhost-ip%/%syslogtag%-%$YEAR%%$MONTH%%$DAY%%$HOUR%.log"

```bash
# 设置日志记录的最大长度
$MaxMessageSize 32k

# 需要放 *.info 之前，不然会导致 /var/log/message 重复记录日志
$template CleanMsgFormat,"%fromhost-ip%%msg%\n"

$template test_FileFormat,"/var/log/test/%fromhost-ip%/%syslogtag%-%$YEAR%%$MONTH%%$DAY%%$HOUR%.log"
if $fromhost-ip == '192.168.0.111' then ?test_FileFormat;CleanMsgFormat
& ~

# 下面的不需要修改
# Log anything (except mail) of level info or higher.
# Don't log private authentication messages!
*.info;mail.none;authpriv.none;cron.none                /var/log/messages
```

### 重启 syslog 服务端

```bash
# 重启服务
systemctl restart rsyslog.service && systemctl status rsyslog.service

# 查看转存的日志
ll /var/log/test
```

## 完整配置

```bash
# rsyslog configuration file

# For more information see /usr/share/doc/rsyslog-*/rsyslog_conf.html
# If you experience problems, see http://www.rsyslog.com/doc/troubleshoot.html

#### MODULES ####

# The imjournal module bellow is now used as a message source instead of imuxsock.
$ModLoad imuxsock # provides support for local system logging (e.g. via logger command)
$ModLoad imjournal # provides access to the systemd journal
#$ModLoad imklog # reads kernel messages (the same are read from journald)
#$ModLoad immark  # provides --MARK-- message capability

$MaxMessageSize 32k

# Provides UDP syslog reception
#$ModLoad imudp
#$UDPServerRun 514

# Provides TCP syslog reception
$ModLoad imtcp
$InputTCPServerRun 514

#### GLOBAL DIRECTIVES ####

# Where to place auxiliary files
$WorkDirectory /var/lib/rsyslog

# Use default timestamp format
$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat

# File syncing capability is disabled by default. This feature is usually not required,
# not useful and an extreme performance hit
#$ActionFileEnableSync on

# Include all config files in /etc/rsyslog.d/
$IncludeConfig /etc/rsyslog.d/*.conf

# Turn off message reception via local log socket;
# local messages are retrieved through imjournal now.
$OmitLocalLogging on

# File to store the position in the journal
$IMJournalStateFile imjournal.state


#### RULES ####

## 在消息头前加上了源IP地址
$template CleanMsgFormat111,"%fromhost-ip% %timestamp:::date-rfc3339% %msg%\n"

$template test_FileFormat,"/var/log/test/%fromhost-ip%/%syslogtag%-%$YEAR%%$MONTH%%$DAY%%$HOUR%.log"
if $fromhost-ip == '192.168.0.111' then ?test_FileFormat;CleanMsgFormat111
& ~


# Log all kernel messages to the console.
# Logging much else clutters up the screen.
#kern.*                                                 /dev/console

# Log anything (except mail) of level info or higher.
# Don't log private authentication messages!
*.info;mail.none;authpriv.none;cron.none                /var/log/messages

# The authpriv file has restricted access.
authpriv.*                                              /var/log/secure

# Log all the mail messages in one place.
mail.*                                                  -/var/log/maillog


# Log cron stuff
cron.*                                                  /var/log/cron

# Everybody gets emergency messages
*.emerg                                                 :omusrmsg:*

# Save news errors of level crit and higher in a special file.
uucp,news.crit                                          /var/log/spooler

# Save boot messages also to boot.log
local7.*                                                /var/log/boot.log

# ### begin forwarding rule ###
# The statement between the begin ... end define a SINGLE forwarding
# rule. They belong together, do NOT split them. If you create multiple
# forwarding rules, duplicate the whole block!
# Remote Logging (we use TCP for reliable delivery)
#
# An on-disk queue is created for this action. If the remote host is
# down, messages are spooled to disk and sent when it is up again.
#$ActionQueueFileName fwdRule1 # unique name prefix for spool files
#$ActionQueueMaxDiskSpace 1g   # 1gb space limit (use as much as possible)
#$ActionQueueSaveOnShutdown on # save messages to disk on shutdown
#$ActionQueueType LinkedList   # run asynchronously
#$ActionResumeRetryCount -1    # infinite retries if host is down
# remote host is: name/ip:port, e.g. 192.168.0.1:514, port optional
#*.* @@remote-host:514
# ### end of the forwarding rule ###

```

## 参考

[https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog](https://stackoverflow.com/questions/49449301/how-to-change-timestamp-format-on-rsyslog)
[https://www.rsyslog.com/doc/configuration/properties.html](https://www.rsyslog.com/doc/configuration/properties.html)
