import{_ as e,M as i,p as t,q as l,R as n,t as s,N as c,a1 as o}from"./framework-39bdc1ba.js";const r={},d=n("h2",{id:"迁移步骤",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#迁移步骤","aria-hidden":"true"},"#"),s(" 迁移步骤")],-1),p=n("h3",{id:"安装-ovftools-工具",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装-ovftools-工具","aria-hidden":"true"},"#"),s(" 安装 ovftools 工具")],-1),v={href:"https://customerconnect.vmware.com/cn/downloads/search?query=ovftool",target:"_blank",rel:"noopener noreferrer"},m=o(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
<span class="token function">sh</span> VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle

<span class="token comment"># step.2 验证</span>
ovftool <span class="token parameter variable">-v</span>

<span class="token comment"># step.3 导出远程ESXI中虚拟机的OVF模板到本地，密码如果存在特殊字符需要进行 url 编码</span>
ovftool <span class="token parameter variable">--X:logFile</span><span class="token operator">=</span>./ovftool.log <span class="token punctuation">\\</span>
	vi://root:password%40123@127.0.0.1/source <span class="token punctuation">\\</span>
	./source.ovf

<span class="token comment"># step.4</span>
ll

source.vmdk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="转换镜像" tabindex="-1"><a class="header-anchor" href="#转换镜像" aria-hidden="true">#</a> 转换镜像</h3><h4 id="方式1-转换为-qcow2-格式" tabindex="-1"><a class="header-anchor" href="#方式1-转换为-qcow2-格式" aria-hidden="true">#</a> 方式1：转换为 QCOW2 格式</h4><p>在 ESXi 中运行的虚拟机可以转换为 OpenStack 支持的 QCOW2 镜像格式</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
yum <span class="token function">install</span> qemu-img <span class="token parameter variable">-y</span>

<span class="token comment"># step.2 转换镜像</span>
qemu-img convert <span class="token parameter variable">-f</span> vmdk <span class="token parameter variable">-O</span> qcow2 <span class="token punctuation">\\</span>
	/path/to/source.vmdk <span class="token punctuation">\\</span>
	/path/to/destination.qcow2
	
<span class="token comment"># step.3 修改密码（可选）</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">LIBGUESTFS_BACKEND</span><span class="token operator">=</span>direct

virt-customize <span class="token parameter variable">-a</span> /path/to/destination.qcow2 <span class="token punctuation">\\</span>
  --root-password password:123456

<span class="token comment"># step.4 登录 openstack</span>
<span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh

<span class="token comment"># step.5 创建镜像</span>
openstack image create <span class="token string">&quot;test-image&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--property</span> <span class="token assign-left variable">hw_disk_bus</span><span class="token operator">=</span>ide <span class="token punctuation">\\</span>
	--disk-format qcow2 <span class="token punctuation">\\</span>
	--container-format bare <span class="token punctuation">\\</span>
	<span class="token parameter variable">--file</span> ./destination.qcow2

<span class="token comment"># step.6</span>
openstack image list
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式2-转换为-raw-格式" tabindex="-1"><a class="header-anchor" href="#方式2-转换为-raw-格式" aria-hidden="true">#</a> 方式2：转换为 RAW 格式</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1</span>
yum <span class="token function">install</span> qemu-img <span class="token parameter variable">-y</span>

<span class="token comment"># step.2 转换镜像</span>
qemu-img convert <span class="token parameter variable">-f</span> vmdk <span class="token parameter variable">-O</span> raw <span class="token punctuation">\\</span>
	/path/to/source.vmdk <span class="token punctuation">\\</span>
	/path/to/destination.raw

<span class="token comment"># step.3 登录 openstack</span>
<span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh

<span class="token comment"># step.4 创建镜像</span>
openstack image create <span class="token string">&quot;test-image&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--property</span> <span class="token assign-left variable">hw_disk_bus</span><span class="token operator">=</span>ide <span class="token punctuation">\\</span>
	--disk-format raw <span class="token punctuation">\\</span>
	--container-format bare <span class="token punctuation">\\</span>
	<span class="token parameter variable">--file</span> ./destination.raw

<span class="token comment"># step.5</span>
openstack image list
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式3-直接使用-vmdk-格式" tabindex="-1"><a class="header-anchor" href="#方式3-直接使用-vmdk-格式" aria-hidden="true">#</a> 方式3：直接使用 VMDK 格式</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># step.1 登录 openstack</span>
<span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh

<span class="token comment"># step.2 创建镜像</span>
openstack image create <span class="token string">&quot;test-vmdk&quot;</span> <span class="token punctuation">\\</span>
	<span class="token parameter variable">--property</span> <span class="token assign-left variable">hw_disk_bus</span><span class="token operator">=</span>ide <span class="token punctuation">\\</span>
	--disk-format vmdk <span class="token punctuation">\\</span>
	--container-format bare <span class="token punctuation">\\</span>
	<span class="token parameter variable">--file</span> ./destination.vmdk

<span class="token comment"># step.3</span>
openstack image list
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h3><ul><li>https://www.51cto.com/article/618604.html</li><li>https://blog.csdn.net/jmh1996/article/details/102815195</li><li>https://blog.51cto.com/qsyj/6066745</li></ul>`,11);function u(b,k){const a=i("ExternalLinkIcon");return t(),l("div",null,[d,p,n("p",null,[s("在 "),n("a",v,[s("ovftool 下载"),c(a)]),s(" 下载对应的 ovftool 文件，如 VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle，上传到相应的文件夹中，执行")]),m])}const f=e(r,[["render",u],["__file","ESXI虚机迁移至OpenStack.html.vue"]]);export{f as default};
