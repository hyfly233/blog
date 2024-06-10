import{_ as n,c as s,o as a,e}from"./app-B9NuXgA3.js";const l={},i=e(`<h2 id="seatunnel" tabindex="-1"><a class="header-anchor" href="#seatunnel"><span>SeaTunnel</span></a></h2><p>SeaTunnel job 应该更换为集群启动，本地模式只适用于测试，部分功能是不适用的。</p><ul><li><a href="https://seatunnel.apache.org/docs/2.3.4/seatunnel-engine/savepoint" target="_blank" rel="noopener noreferrer">https://seatunnel.apache.org/docs/2.3.4/seatunnel-engine/savepoint</a></li><li><a href="https://seatunnel.apache.org/docs/seatunnel-engine/checkpoint-storage/" target="_blank" rel="noopener noreferrer">https://seatunnel.apache.org/docs/seatunnel-engine/checkpoint-storage/</a></li></ul><h3 id="正确步骤" tabindex="-1"><a class="header-anchor" href="#正确步骤"><span>正确步骤</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># 1.打开 seatunnel cluster</span></span>
<span class="line"><span class="token function">nohup</span> <span class="token function">sh</span> ./bin/seatunnel-cluster.sh <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2.初始启动 job</span></span>
<span class="line"><span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial</span>
<span class="line"></span>
<span class="line"><span class="token function">nohup</span> <span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3.查询 zabbixmysql2kafka_initial 对应的 jobId 如：123456</span></span>
<span class="line">./bin/seatunnel.sh <span class="token parameter variable">--list</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4.查看 checkpoint_snapshot</span></span>
<span class="line">ll /tmp/seatunnel/checkpoint_snapshot</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5.检查是否存在 123456 的文件夹，并检查是否包含 *.ser 文件</span></span>
<span class="line">ll /tmp/seatunnel/checkpoint_snapshot/123456</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 6.可选，触发 savepoint 可停止任务</span></span>
<span class="line">./bin/seatunnel.sh <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--savepoint</span> <span class="token number">123456</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 7.重启 jobId 为 123456 的任务</span></span>
<span class="line"><span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--restore</span> <span class="token number">123456</span></span>
<span class="line"></span>
<span class="line"><span class="token function">nohup</span> <span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-initial.conf <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> zabbixmysql2kafka_initial <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--restore</span> <span class="token number">123456</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>SeaTunnel 端发送数据重复是：原先使用本地模式，并且重启任务也一直使用的上述的步骤一，导致每次都是启动的一个新的 job</p><h2 id="vm-的配置" tabindex="-1"><a class="header-anchor" href="#vm-的配置"><span>VM 的配置</span></a></h2><p><a href="https://docs.victoriametrics.com/#deduplication" target="_blank" rel="noopener noreferrer">https://docs.victoriametrics.com/#deduplication</a> VM 的启动命令行参数 &quot;-dedup.minScrapeInterval=1ms&quot; 可以解决在存储时数据重复的问题。该值为正值时，VM 会保留在该时间间隔中的最大值</p><h3 id="问题点" tabindex="-1"><a class="header-anchor" href="#问题点"><span>问题点</span></a></h3><p>VM 的配置只能从存储层解决数据重复的问题，SeaTunnel 端发送重复数据是 VM 管不了的</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"></span>
<span class="line"><span class="token function">sh</span> ./bin/seatunnel.sh <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--config</span> ./jobs/zabbixmysql2kafka-latest.conf <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--restore</span> <span class="token number">666666</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),p=[i];function t(c,r){return a(),s("div",null,p)}const d=n(l,[["render",t],["__file","SeaTunnel_VM 数据重复.html.vue"]]),u=JSON.parse('{"path":"/md/article/middleware/seatunnel/SeaTunnel_VM%20%E6%95%B0%E6%8D%AE%E9%87%8D%E5%A4%8D.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"SeaTunnel","slug":"seatunnel","link":"#seatunnel","children":[{"level":3,"title":"正确步骤","slug":"正确步骤","link":"#正确步骤","children":[]}]},{"level":2,"title":"VM 的配置","slug":"vm-的配置","link":"#vm-的配置","children":[{"level":3,"title":"问题点","slug":"问题点","link":"#问题点","children":[]}]}],"git":{"updatedTime":1718025146000,"contributors":[{"name":"hyfly233","email":"hyfly233@outlook.com","commits":1}]},"filePathRelative":"md/article/middleware/seatunnel/SeaTunnel+VM 数据重复.md"}');export{d as comp,u as data};
