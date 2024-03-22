import{_ as t,M as l,p as o,q as p,R as n,t as s,N as e,a1 as i}from"./framework-39bdc1ba.js";const c={},r=i(`<h2 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql" aria-hidden="true">#</a> MySql</h2><p>需要开启 binlog，修改数据库 /etc/my.cnf</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code>server_id=100
log<span class="token punctuation">-</span>bin=mysql<span class="token punctuation">-</span>bin
binlog<span class="token punctuation">-</span>format=ROW
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在数据库中执行以下命令检查</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">show</span> variables <span class="token operator">like</span> <span class="token string">&#39;%binlog_format%&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">show</span> variables <span class="token operator">like</span> <span class="token string">&#39;%binlog_row_image%&#39;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,5),d={href:"https://developer.aliyun.com/article/869534",target:"_blank",rel:"noopener noreferrer"},u=n("ul",null,[n("li",null,"基于查询和binlog的方案都有一定的劣势，在全量数据下，一致性方面都会有所欠缺"),n("li",null,[s("FlinkCDC 基于Snapshot+binlog的方案结合了两者的特点，可以保证同步数据的一致性 "),n("ul",null,[n("li",null,"原生的基于锁的全量数据获取具有一定的性能问题"),n("li",null,"基于DBLog的无锁方案在性能和一致性上可以兼得。是比较理想的方案")])])],-1),v=n("h2",{id:"pg",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#pg","aria-hidden":"true"},"#"),s(" pg")],-1),b={href:"https://blog.csdn.net/xiweiller/article/details/126030209",target:"_blank",rel:"noopener noreferrer"},m={href:"https://seatunnel.apache.org/docs/2.3.4/connector-v2/source/Postgre-CDC/",target:"_blank",rel:"noopener noreferrer"},k=i(`<h3 id="seatunnel" tabindex="-1"><a class="header-anchor" href="#seatunnel" aria-hidden="true">#</a> SeaTunnel</h3><p>192.168.0.17 ./bin/seatunnel.sh --config ./jobs/zabbixmysql2kafka-latest.conf -e local /data/app/apache-seatunnel-2.3.4-release</p><p>MySQL CDC 到 kafka</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">env</span> <span class="token punctuation">{</span>
  execution.parallelism <span class="token operator">=</span> <span class="token number">1</span>
  job.mode <span class="token operator">=</span> <span class="token string">&quot;STREAMING&quot;</span>
  checkpoint.interval <span class="token operator">=</span> <span class="token number">10000</span>
<span class="token punctuation">}</span>

<span class="token builtin class-name">source</span> <span class="token punctuation">{</span>
  MySQL-CDC <span class="token punctuation">{</span>
    result_table_name <span class="token operator">=</span> <span class="token string">&quot;zabbix_history&quot;</span>
  	<span class="token function">hostname</span> <span class="token operator">=</span> <span class="token string">&quot;192.168.0.1&quot;</span>
    username <span class="token operator">=</span> <span class="token string">&quot;root&quot;</span>
    password <span class="token operator">=</span> <span class="token string">&quot;biitt@123&quot;</span>
    parallelism <span class="token operator">=</span> <span class="token number">1</span>
  	server-id <span class="token operator">=</span> <span class="token number">100</span>
  	server-time-zone <span class="token operator">=</span> <span class="token string">&quot;Asia/Hong_Kong&quot;</span>
  	database-names <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;zabbix &quot;</span><span class="token punctuation">]</span>
  	table-names <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;zabbix.history&quot;</span><span class="token punctuation">]</span>
  	base-url <span class="token operator">=</span> <span class="token string">&quot;jdbc:mysql://192.168.0.1:13306/zabbix&quot;</span>
    debezium <span class="token punctuation">{</span>
      snapshot.mode <span class="token operator">=</span> <span class="token string">&quot;always&quot;</span>
      decimal.handling.mode <span class="token operator">=</span> <span class="token string">&quot;double&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
sink <span class="token punctuation">{</span>
  kafka <span class="token punctuation">{</span>
    <span class="token function">format</span> <span class="token operator">=</span> JSON
    semantics <span class="token operator">=</span> NON
    source_table_name <span class="token operator">=</span> <span class="token string">&quot;zabbix_history&quot;</span>
    topic <span class="token operator">=</span> <span class="token string">&quot;zabbix_mysql_cdc2vm&quot;</span>
    bootstrap.servers <span class="token operator">=</span> <span class="token string">&quot;192.168.0.211:9092&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>MySQL 查询数据到 Console</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">env</span> <span class="token punctuation">{</span>
  execution.parallelism <span class="token operator">=</span> <span class="token number">1</span>
  job.mode <span class="token operator">=</span> <span class="token string">&quot;STREAMING&quot;</span>
  <span class="token assign-left variable">checkpoint.interval</span><span class="token operator">=</span><span class="token number">10000</span>
<span class="token punctuation">}</span>

<span class="token builtin class-name">source</span> <span class="token punctuation">{</span>
  Jdbc <span class="token punctuation">{</span>
    url <span class="token operator">=</span> <span class="token string">&quot;jdbc:mysql://192.168.0.1:13306/zabbix?useUnicode=true&amp;characterEncoding=UTF-8&amp;rewriteBatchedStatements=true&quot;</span>
    driver <span class="token operator">=</span> <span class="token string">&quot;com.mysql.cj.jdbc.Driver&quot;</span>
    connection_check_timeout_sec <span class="token operator">=</span> <span class="token number">100</span>
    user <span class="token operator">=</span> <span class="token string">&quot;root&quot;</span>
    password <span class="token operator">=</span> <span class="token string">&quot;biitt@123&quot;</span>
    query <span class="token operator">=</span> <span class="token string">&quot;select h.hostid , h.name , i2.ip , i2.dns , i.itemid, i.name , i.key_ as item_key from items i ,hosts h ,interface i2 WHERE i2.<span class="token variable"><span class="token variable">\`</span><span class="token builtin class-name">type</span><span class="token variable">\`</span></span> = 1 and i2.ip is not NULL and h.available = 1 and i.hostid = h.hostid and h.hostid = i2.hostid&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

sink <span class="token punctuation">{</span>
  Console <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># select h.hostid , h.name , i2.ip , i2.dns , i.itemid, i.name , i.key_ as item_key from items i ,hosts h ,interface i2 WHERE i2.\`type\` = 1 and i2.ip is not NULL and h.available = 1 and i.hostid = h.hostid and h.hostid = i2.hostid;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>命令行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>./bin/seatunnel.sh <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka.conf <span class="token parameter variable">-e</span> <span class="token builtin class-name">local</span>

./bin/seatunnel.sh <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2console.conf <span class="token parameter variable">-e</span> <span class="token builtin class-name">local</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">nohup</span> ./bin/seatunnel.sh <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka.conf <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">wget</span> <span class="token string">&quot;https://archive.apache.org/dist/seatunnel/2.3.4/apache-seatunnel-2.3.4-bin.tar.gz&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token punctuation">\\</span>
  <span class="token parameter variable">-e</span> <span class="token assign-left variable">config</span><span class="token operator">=</span><span class="token string">&quot;/data/seatunnel.streaming.conf&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">-v</span> /data/apache-seatunnel-2.3.4/config/v2.streaming.conf.template:/data/seatunnel.streaming.conf  <span class="token punctuation">\\</span>
  <span class="token parameter variable">-d</span> hyfly233/seatunnel:2.3.4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12);function h(g,q){const a=l("ExternalLinkIcon");return o(),p("div",null,[r,n("p",null,[n("a",d,[s("https://developer.aliyun.com/article/869534"),e(a)]),s(" 从该文章描述得到的结论")]),u,v,n("p",null,[n("a",b,[s("https://blog.csdn.net/xiweiller/article/details/126030209"),e(a)]),n("a",m,[s("https://seatunnel.apache.org/docs/2.3.4/connector-v2/source/Postgre-CDC/"),e(a)])]),k])}const f=t(c,[["render",h],["__file","数据库CDC配置.html.vue"]]);export{f as default};
