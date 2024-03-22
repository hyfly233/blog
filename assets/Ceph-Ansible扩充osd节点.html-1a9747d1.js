import{_ as i,M as l,p as r,q as d,R as a,t as n,N as e,a1 as t}from"./framework-39bdc1ba.js";const c={},p={href:"https://access.redhat.com/documentation/zh-cn/red_hat_ceph_storage/4/html/operations_guide/ceph-osds-ops",target:"_blank",rel:"noopener noreferrer"},o={href:"https://www.cnblogs.com/lvzhenjiang/p/14908195.html",target:"_blank",rel:"noopener noreferrer"},v=t(`<h2 id="扩充-osd-节点" tabindex="-1"><a class="header-anchor" href="#扩充-osd-节点" aria-hidden="true">#</a> 扩充 osd 节点</h2><h3 id="激活虚拟环境" tabindex="-1"><a class="header-anchor" href="#激活虚拟环境" aria-hidden="true">#</a> 激活虚拟环境</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 激活虚拟环境</span>
<span class="token builtin class-name">source</span> /opt/venv/ceph/bin/activate


<span class="token builtin class-name">source</span> /opt/venv/ceph-2/bin/activate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编辑-osds-yml" tabindex="-1"><a class="header-anchor" href="#编辑-osds-yml" aria-hidden="true">#</a> 编辑 osds.yml</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /opt/ceph/ceph-ansible/group_vars/osds.yml

<span class="token comment"># 添加内容</span>
devices:
  - /dev/sdc
  - /dev/sdd
  - /dev/sde
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署" tabindex="-1"><a class="header-anchor" href="#部署" aria-hidden="true">#</a> 部署</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible

ansible <span class="token parameter variable">-i</span> hosts all <span class="token parameter variable">-m</span> <span class="token function">ping</span>

ansible-playbook <span class="token parameter variable">-i</span> hosts infrastructure-playbooks/add-osd.yml <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/usr/bin/python2 <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="添加-osd-节点的硬盘" tabindex="-1"><a class="header-anchor" href="#添加-osd-节点的硬盘" aria-hidden="true">#</a> 添加 osd 节点的硬盘</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 查看硬盘类型</span>
lsblk <span class="token parameter variable">-d</span> <span class="token parameter variable">-o</span> name,rota

NAME ROTA
sda     <span class="token number">0</span>
sdb     <span class="token number">0</span>
sdc     <span class="token number">0</span>
sdd     <span class="token number">0</span>
sde     <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编辑-osds-yml-1" tabindex="-1"><a class="header-anchor" href="#编辑-osds-yml-1" aria-hidden="true">#</a> 编辑 osds.yml</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /opt/ceph/ceph-ansible/group_vars/osds.yml

<span class="token comment"># 添加内容</span>
devices:
  - /dev/sdc
  - /dev/sdd

lvm_volumes:
  - data: /dev/sde
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署-1" tabindex="-1"><a class="header-anchor" href="#部署-1" aria-hidden="true">#</a> 部署</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token builtin class-name">cd</span> /opt/ceph/ceph-ansible

<span class="token comment"># step.2 验证连通性</span>
ansible <span class="token parameter variable">-i</span> hosts all <span class="token parameter variable">-m</span> <span class="token function">ping</span>

<span class="token comment"># step.3</span>
ansible-playbook <span class="token parameter variable">-i</span> hosts site-container.yml <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">ansible_python_interpreter</span><span class="token operator">=</span>/usr/bin/python2 <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_package_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_service_name</span><span class="token operator">=</span>docker-ce <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable">container_binding_name</span><span class="token operator">=</span>python-docker-py <span class="token punctuation">\\</span>
	<span class="token parameter variable">-vvv</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13);function m(b,u){const s=l("ExternalLinkIcon");return r(),d("div",null,[a("ul",null,[a("li",null,[a("a",p,[n("https://access.redhat.com/documentation/zh-cn/red_hat_ceph_storage/4/html/operations_guide/ceph-osds-ops"),e(s)])]),a("li",null,[a("a",o,[n("https://www.cnblogs.com/lvzhenjiang/p/14908195.html"),e(s)])])]),v])}const k=i(c,[["render",m],["__file","Ceph-Ansible扩充osd节点.html.vue"]]);export{k as default};
