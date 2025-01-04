---
title: ZabbixAgent安装及自定义脚本
sidebar: heading
---

## RPM 下载地址

[https://mirrors.aliyun.com/zabbix/zabbix/5.0/rhel/6/x86_64/?spm=a2c6h.25603864.0.0.2e235942vUkIKa](https://mirrors.aliyun.com/zabbix/zabbix/5.0/rhel/6/x86_64/?spm=a2c6h.25603864.0.0.2e235942vUkIKa)

+ [zabbix-agent-5.0.40-1.el6.x86_64.rpm](https://mirrors.aliyun.com/zabbix/zabbix/5.0/rhel/6/x86_64/zabbix-agent-5.0.40-1.el6.x86_64.rpm)
+ [zabbix-agent2-5.0.40-1.el6.x86_64.rpm](https://mirrors.aliyun.com/zabbix/zabbix/5.0/rhel/6/x86_64/zabbix-agent2-5.0.40-1.el6.x86_64.rpm)

## 自定义脚本

使用自定义脚本采集数据时，可能需要 root 权限，所以需要将 zabbix 修改为以 root 用户运行

+ 脚本名称：custom_script.sh
+ 脚本存放地址：/usr/local/bin/

```bash
mv custom_script.sh /usr/local/bin/

chmod 777 custom_script.sh
```

## Zabbix Agent

1. 配置 zabbix_agent.conf
    1. 编辑 zabbix_agent.conf

```bash
vim /etc/zabbix/zabbix_agent.conf
```

    2. 修改如下内容

```bash
Server=50.100.151.29

StartAgents=0  # 设置 StartAgents 为 0

ServerActive=50.100.151.29

# Hostname=Zabbix server  # 注释掉 Hostname

HostMetadata=CustomHostMetadata  # 新增 HostMetadata

# 新增自定义脚本
UserParameter=custom.script.name,/bin/bash /usr/local/bin/custom_script.sh
```

2. 修改 zabbix-agent.service
    1. 编辑 zabbix-agent.service

```bash
vim /usr/lib/systemd/system/zabbix-agent.service
```

    2. 修改如下内容

```bash
User=root      # 将原先的 zabbix 修改为 root
Group=root     # 将原先的 zabbix 修改为 root
```

3. 设置 zabbix-agent 为开机自启

```bash
systemctl enable zabbix-agent
```

## Zabbix Agent2

1. 配置 zabbix_agent2.conf
    1. 编辑 zabbix_agent2.conf

```bash
vim /etc/zabbix/zabbix_agent2.conf
```

    2. 修改如下内容

```bash
Server=50.100.151.29

ServerActive=50.100.151.29

# Hostname=Zabbix server  # 注释掉 Hostname

HostMetadata=CustomHostMetadata  # 新增 HostMetadata

# 新增自定义脚本
UserParameter=custom.script.name,/bin/bash /usr/local/bin/custom_script.sh
```

2. 修改 zabbix-agent2.service
    1. 编辑 zabbix-agent2.service

```bash
vim /usr/lib/systemd/system/zabbix-agent2.service
```

    2. 修改如下内容

```bash
User=root      # 将原先的 zabbix 修改为 root
Group=root     # 将原先的 zabbix 修改为 root
```

3. 设置 zabbix-agent2 为开机自启

```bash
systemctl enable zabbix-agent2
```
