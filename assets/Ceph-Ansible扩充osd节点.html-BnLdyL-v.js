import{_ as s,c as a,o as n,e}from"./app-B9NuXgA3.js";const l={},i=e(`<ul><li><a href="https://access.redhat.com/documentation/zh-cn/red_hat_ceph_storage/4/html/operations_guide/ceph-osds-ops" target="_blank" rel="noopener noreferrer">https://access.redhat.com/documentation/zh-cn/red_hat_ceph_storage/4/html/operations_guide/ceph-osds-ops</a></li><li><a href="https://www.cnblogs.com/lvzhenjiang/p/14908195.html" target="_blank" rel="noopener noreferrer">https://www.cnblogs.com/lvzhenjiang/p/14908195.html</a></li></ul><h2 id="扩充-osd-节点" tabindex="-1"><a class="header-anchor" href="#扩充-osd-节点"><span>扩充 osd 节点</span></a></h2><h3 id="激活虚拟环境" tabindex="-1"><a class="header-anchor" href="#激活虚拟环境"><span>激活虚拟环境</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 激活虚拟环境</span></span>
<span class="line"><span class="token builtin class-name">source</span> /opt/venv/ceph/bin/activate</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">source</span> /opt/venv/ceph-2/bin/activate</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编辑-osds-yml" tabindex="-1"><a class="header-anchor" href="#编辑-osds-yml"><span>编辑 osds.yml</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">vim</span> /opt/ceph/ceph-ansible/group_vars/osds.yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加内容</span></span>
<span class="line">devices:</span>
<span class="line">  - /dev/sdc</span>
<span class="line">  - /dev/sdd</span>
<span class="line">  - /dev/sde</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署" tabindex="-1"><a class="header-anchor" href="#部署"><span>部署</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible</span>
<span class="line"></span>
<span class="line">ansible <span class="token parameter variable">-i</span> hosts all <span class="token parameter variable">-m</span> <span class="token function">ping</span></span>
<span class="line"></span>
<span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts infrastructure-playbooks/add-osd.yml <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/usr/bin/python2 <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="添加-osd-节点的硬盘" tabindex="-1"><a class="header-anchor" href="#添加-osd-节点的硬盘"><span>添加 osd 节点的硬盘</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># 查看硬盘类型</span></span>
<span class="line">lsblk <span class="token parameter variable">-d</span> <span class="token parameter variable">-o</span> name,rota</span>
<span class="line"></span>
<span class="line">NAME ROTA</span>
<span class="line">sda     <span class="token number">0</span></span>
<span class="line">sdb     <span class="token number">0</span></span>
<span class="line">sdc     <span class="token number">0</span></span>
<span class="line">sdd     <span class="token number">0</span></span>
<span class="line">sde     <span class="token number">1</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编辑-osds-yml-1" tabindex="-1"><a class="header-anchor" href="#编辑-osds-yml-1"><span>编辑 osds.yml</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">vim</span> /opt/ceph/ceph-ansible/group_vars/osds.yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 添加内容</span></span>
<span class="line">devices:</span>
<span class="line">  - /dev/sdc</span>
<span class="line">  - /dev/sdd</span>
<span class="line"></span>
<span class="line">lvm_volumes:</span>
<span class="line">  - data: /dev/sde</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署-1" tabindex="-1"><a class="header-anchor" href="#部署-1"><span>部署</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 验证连通性</span></span>
<span class="line">ansible <span class="token parameter variable">-i</span> hosts all <span class="token parameter variable">-m</span> <span class="token function">ping</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">ansible-playbook <span class="token parameter variable">-i</span> hosts site-container.yml <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/usr/bin/python2 <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">-vvv</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),p=[i];function c(t,r){return n(),a("div",null,p)}const o=s(l,[["render",c],["__file","Ceph-Ansible扩充osd节点.html.vue"]]),v=JSON.parse('{"path":"/md/article/middleware/ceph/Ceph-Ansible%E6%89%A9%E5%85%85osd%E8%8A%82%E7%82%B9.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"扩充 osd 节点","slug":"扩充-osd-节点","link":"#扩充-osd-节点","children":[{"level":3,"title":"激活虚拟环境","slug":"激活虚拟环境","link":"#激活虚拟环境","children":[]},{"level":3,"title":"编辑 osds.yml","slug":"编辑-osds-yml","link":"#编辑-osds-yml","children":[]},{"level":3,"title":"部署","slug":"部署","link":"#部署","children":[]}]},{"level":2,"title":"添加 osd 节点的硬盘","slug":"添加-osd-节点的硬盘","link":"#添加-osd-节点的硬盘","children":[{"level":3,"title":"编辑 osds.yml","slug":"编辑-osds-yml-1","link":"#编辑-osds-yml-1","children":[]},{"level":3,"title":"部署","slug":"部署-1","link":"#部署-1","children":[]}]}],"git":{"updatedTime":1718025146000,"contributors":[{"name":"hyfly233","email":"hyfly233@outlook.com","commits":1}]},"filePathRelative":"md/article/middleware/ceph/Ceph-Ansible扩充osd节点.md"}');export{o as comp,v as data};
