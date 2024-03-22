import{_ as t,M as l,p as c,q as o,R as n,t as a,N as e,a1 as i}from"./framework-39bdc1ba.js";const p={},r=n("h2",{id:"seatunnel",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#seatunnel","aria-hidden":"true"},"#"),a(" SeaTunnel")],-1),d=n("p",null,"SeaTunnel job 应该更换为集群启动，本地模式只适用于测试，部分功能是不适用的。",-1),u={href:"https://seatunnel.apache.org/docs/2.3.4/seatunnel-engine/savepoint",target:"_blank",rel:"noopener noreferrer"},m={href:"https://seatunnel.apache.org/docs/seatunnel-engine/checkpoint-storage/",target:"_blank",rel:"noopener noreferrer"},v=i(`<h3 id="正确步骤" tabindex="-1"><a class="header-anchor" href="#正确步骤" aria-hidden="true">#</a> 正确步骤</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 1.打开 seatunnel cluster</span>
<span class="token function">nohup</span> <span class="token function">sh</span> ./bin/seatunnel-cluster.sh <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span>

<span class="token comment"># 2.初始启动 job</span>
<span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span>
  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span>
  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial

<span class="token function">nohup</span> <span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span>
  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span>
  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial <span class="token punctuation">\\</span>
  <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span>

<span class="token comment"># 3.查询 zabbixmysql2kafka_initial 对应的 jobId 如：123456</span>
./bin/seatunnel.sh <span class="token parameter variable">--list</span>

<span class="token comment"># 4.查看 checkpoint_snapshot</span>
ll /tmp/seatunnel/checkpoint_snapshot

<span class="token comment"># 5.检查是否存在 123456 的文件夹，并检查是否包含 *.ser 文件</span>
ll /tmp/seatunnel/checkpoint_snapshot/123456

<span class="token comment"># 6.可选，触发 savepoint 可停止任务</span>
./bin/seatunnel.sh <span class="token punctuation">\\</span>
  <span class="token parameter variable">--savepoint</span> <span class="token number">123456</span>

<span class="token comment"># 7.重启 jobId 为 123456 的任务</span>
<span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span>
  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span>
  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial <span class="token punctuation">\\</span>
  <span class="token parameter variable">--restore</span> <span class="token number">123456</span>

<span class="token function">nohup</span> <span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span>
  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span>
  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial <span class="token punctuation">\\</span>
  <span class="token parameter variable">--restore</span> <span class="token number">123456</span> <span class="token punctuation">\\</span>
  <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>SeaTunnel 端发送数据重复是：原先使用本地模式，并且重启任务也一直使用的上述的步骤一，导致每次都是启动的一个新的 job</p><h2 id="vm-的配置" tabindex="-1"><a class="header-anchor" href="#vm-的配置" aria-hidden="true">#</a> VM 的配置</h2>`,5),b={href:"https://docs.victoriametrics.com/#deduplication",target:"_blank",rel:"noopener noreferrer"},k=i(`<h3 id="问题点" tabindex="-1"><a class="header-anchor" href="#问题点" aria-hidden="true">#</a> 问题点</h3><p>VM 的配置只能从存储层解决数据重复的问题，SeaTunnel 端发送重复数据是 VM 管不了的</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>
<span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span>
  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-latest.conf <span class="token punctuation">\\</span>
  <span class="token parameter variable">--restore</span> <span class="token number">666666</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function h(f,_){const s=l("ExternalLinkIcon");return c(),o("div",null,[r,d,n("ul",null,[n("li",null,[n("a",u,[a("https://seatunnel.apache.org/docs/2.3.4/seatunnel-engine/savepoint"),e(s)])]),n("li",null,[n("a",m,[a("https://seatunnel.apache.org/docs/seatunnel-engine/checkpoint-storage/"),e(s)])])]),v,n("p",null,[n("a",b,[a("https://docs.victoriametrics.com/#deduplication"),e(s)]),a(' VM 的启动命令行参数 "-dedup.minScrapeInterval=1ms" 可以解决在存储时数据重复的问题。该值为正值时，VM 会保留在该时间间隔中的最大值')]),k])}const x=t(p,[["render",h],["__file","SeaTunnel_VM 数据重复.html.vue"]]);export{x as default};
