import{_ as s,c as n,o as a,e}from"./app-B9NuXgA3.js";const l={},i=e(`<h2 id="迁移步骤" tabindex="-1"><a class="header-anchor" href="#迁移步骤"><span>迁移步骤</span></a></h2><h3 id="安装-ovftools-工具" tabindex="-1"><a class="header-anchor" href="#安装-ovftools-工具"><span>安装 ovftools 工具</span></a></h3><p>在 <a href="https://customerconnect.vmware.com/cn/downloads/search?query=ovftool" target="_blank" rel="noopener noreferrer">ovftool 下载</a> 下载对应的 ovftool 文件，如 VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle，上传到相应的文件夹中，执行</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line"><span class="token function">sh</span> VMware-ovftool-4.4.0-15722219-lin.x86_64.bundle</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 验证</span></span>
<span class="line">ovftool <span class="token parameter variable">-v</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 导出远程ESXI中虚拟机的OVF模板到本地，密码如果存在特殊字符需要进行 url 编码</span></span>
<span class="line">ovftool <span class="token parameter variable">--X:logFile</span><span class="token operator">=</span>./ovftool.log <span class="token punctuation">\\</span></span>
<span class="line">	vi://root:password%40123@127.0.0.1/source <span class="token punctuation">\\</span></span>
<span class="line">	./source.ovf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4</span></span>
<span class="line">ll</span>
<span class="line"></span>
<span class="line">source.vmdk</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="转换镜像" tabindex="-1"><a class="header-anchor" href="#转换镜像"><span>转换镜像</span></a></h3><h4 id="方式1-转换为-qcow2-格式" tabindex="-1"><a class="header-anchor" href="#方式1-转换为-qcow2-格式"><span>方式1：转换为 QCOW2 格式</span></a></h4><p>在 ESXi 中运行的虚拟机可以转换为 OpenStack 支持的 QCOW2 镜像格式</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">yum <span class="token function">install</span> qemu-img <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 转换镜像</span></span>
<span class="line">qemu-img convert <span class="token parameter variable">-f</span> vmdk <span class="token parameter variable">-O</span> qcow2 <span class="token punctuation">\\</span></span>
<span class="line">	/path/to/source.vmdk <span class="token punctuation">\\</span></span>
<span class="line">	/path/to/destination.qcow2</span>
<span class="line">	</span>
<span class="line"><span class="token comment"># step.3 修改密码（可选）</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">LIBGUESTFS_BACKEND</span><span class="token operator">=</span>direct</span>
<span class="line"></span>
<span class="line">virt-customize <span class="token parameter variable">-a</span> /path/to/destination.qcow2 <span class="token punctuation">\\</span></span>
<span class="line">  --root-password password:123456</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 登录 openstack</span></span>
<span class="line"><span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5 创建镜像</span></span>
<span class="line">openstack image create <span class="token string">&quot;test-image&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--property</span> <span class="token assign-left variable">hw_disk_bus</span><span class="token operator">=</span>ide <span class="token punctuation">\\</span></span>
<span class="line">	--disk-format qcow2 <span class="token punctuation">\\</span></span>
<span class="line">	--container-format bare <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">--file</span> ./destination.qcow2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.6</span></span>
<span class="line">openstack image list</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式2-转换为-raw-格式" tabindex="-1"><a class="header-anchor" href="#方式2-转换为-raw-格式"><span>方式2：转换为 RAW 格式</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1</span></span>
<span class="line">yum <span class="token function">install</span> qemu-img <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 转换镜像</span></span>
<span class="line">qemu-img convert <span class="token parameter variable">-f</span> vmdk <span class="token parameter variable">-O</span> raw <span class="token punctuation">\\</span></span>
<span class="line">	/path/to/source.vmdk <span class="token punctuation">\\</span></span>
<span class="line">	/path/to/destination.raw</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3 登录 openstack</span></span>
<span class="line"><span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.4 创建镜像</span></span>
<span class="line">openstack image create <span class="token string">&quot;test-image&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--property</span> <span class="token assign-left variable">hw_disk_bus</span><span class="token operator">=</span>ide <span class="token punctuation">\\</span></span>
<span class="line">	--disk-format raw <span class="token punctuation">\\</span></span>
<span class="line">	--container-format bare <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">--file</span> ./destination.raw</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.5</span></span>
<span class="line">openstack image list</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式3-直接使用-vmdk-格式" tabindex="-1"><a class="header-anchor" href="#方式3-直接使用-vmdk-格式"><span>方式3：直接使用 VMDK 格式</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># step.1 登录 openstack</span></span>
<span class="line"><span class="token builtin class-name">source</span> /etc/kolla/admin-openrc.sh</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.2 创建镜像</span></span>
<span class="line">openstack image create <span class="token string">&quot;test-vmdk&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">--property</span> <span class="token assign-left variable">hw_disk_bus</span><span class="token operator">=</span>ide <span class="token punctuation">\\</span></span>
<span class="line">	--disk-format vmdk <span class="token punctuation">\\</span></span>
<span class="line">	--container-format bare <span class="token punctuation">\\</span></span>
<span class="line">	<span class="token parameter variable">--file</span> ./destination.vmdk</span>
<span class="line"></span>
<span class="line"><span class="token comment"># step.3</span></span>
<span class="line">openstack image list</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h3><ul><li>https://www.51cto.com/article/618604.html</li><li>https://blog.csdn.net/jmh1996/article/details/102815195</li><li>https://blog.51cto.com/qsyj/6066745</li></ul>`,14),p=[i];function t(c,o){return a(),n("div",null,p)}const d=s(l,[["render",t],["__file","ESXI虚机迁移至OpenStack.html.vue"]]),v=JSON.parse('{"path":"/md/article/cloud/openstack/ESXI%E8%99%9A%E6%9C%BA%E8%BF%81%E7%A7%BB%E8%87%B3OpenStack.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"迁移步骤","slug":"迁移步骤","link":"#迁移步骤","children":[{"level":3,"title":"安装 ovftools 工具","slug":"安装-ovftools-工具","link":"#安装-ovftools-工具","children":[]},{"level":3,"title":"转换镜像","slug":"转换镜像","link":"#转换镜像","children":[]},{"level":3,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}]}],"git":{"updatedTime":1718025146000,"contributors":[{"name":"hyfly233","email":"hyfly233@outlook.com","commits":1}]},"filePathRelative":"md/article/cloud/openstack/ESXI虚机迁移至OpenStack.md"}');export{d as comp,v as data};
