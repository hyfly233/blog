import{_ as n,c as a,f as l,o as p}from"./app-BOK5XMKI.js";const e={};function o(r,s){return p(),a("div",null,s[0]||(s[0]=[l(`<h1 id="冒泡排序" tabindex="-1"><a class="header-anchor" href="#冒泡排序"><span>冒泡排序</span></a></h1><h2 id="描述" tabindex="-1"><a class="header-anchor" href="#描述"><span>描述</span></a></h2><ul><li><strong>描述</strong>：冒泡排序（Bubble Sort），重复地遍历要排序的列表，比较相邻的元素并交换顺序，直到没有需要交换的元素为止</li><li><strong>时间复杂度</strong>：O(n^2)</li><li><strong>空间复杂度</strong>：O(1)</li><li><strong>稳定性</strong>：稳定</li></ul><h2 id="java" tabindex="-1"><a class="header-anchor" href="#java"><span>Java</span></a></h2><div class="language-java line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="java" data-title="java"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-java;"><code><span class="line"><span class="line"><span style="color:#81A1C1;">public</span><span style="color:#81A1C1;"> class</span><span style="color:#8FBCBB;"> BubbleSort</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    public</span><span style="color:#81A1C1;"> static</span><span style="color:#81A1C1;"> void</span><span style="color:#88C0D0;"> bubbleSort</span><span style="color:#ECEFF4;">(</span><span style="color:#81A1C1;">int</span><span style="color:#ECEFF4;">[]</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        int</span><span style="color:#D8DEE9;"> n</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">.</span><span style="color:#D8DEE9;">length</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        for</span><span style="color:#ECEFF4;"> (</span><span style="color:#81A1C1;">int</span><span style="color:#D8DEE9;"> i</span><span style="color:#81A1C1;"> =</span><span style="color:#B48EAD;"> 0</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9FF;"> i </span><span style="color:#81A1C1;">&lt;</span><span style="color:#D8DEE9FF;"> n </span><span style="color:#81A1C1;">-</span><span style="color:#B48EAD;"> 1</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9FF;"> i</span><span style="color:#81A1C1;">++</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">            for</span><span style="color:#ECEFF4;"> (</span><span style="color:#81A1C1;">int</span><span style="color:#D8DEE9;"> j</span><span style="color:#81A1C1;"> =</span><span style="color:#B48EAD;"> 0</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9FF;"> j </span><span style="color:#81A1C1;">&lt;</span><span style="color:#D8DEE9FF;"> n </span><span style="color:#81A1C1;">-</span><span style="color:#D8DEE9FF;"> i </span><span style="color:#81A1C1;">-</span><span style="color:#B48EAD;"> 1</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9FF;"> j</span><span style="color:#81A1C1;">++</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">                if</span><span style="color:#ECEFF4;"> (</span><span style="color:#D8DEE9FF;">arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> &gt;</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j </span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">])</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">                    int</span><span style="color:#D8DEE9;"> temp</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">                    arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j </span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">                    arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j </span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9FF;"> temp</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">                }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">            }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    }</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    public</span><span style="color:#81A1C1;"> static</span><span style="color:#81A1C1;"> void</span><span style="color:#88C0D0;"> main</span><span style="color:#ECEFF4;">(</span><span style="color:#8FBCBB;">String</span><span style="color:#ECEFF4;">[]</span><span style="color:#D8DEE9;"> args</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        int</span><span style="color:#ECEFF4;">[]</span><span style="color:#D8DEE9;"> arr</span><span style="color:#81A1C1;"> =</span><span style="color:#ECEFF4;"> {</span><span style="color:#B48EAD;">64</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 34</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 25</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 12</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 22</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 11</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 90</span><span style="color:#ECEFF4;">}</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">        bubbleSort</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">arr</span><span style="color:#ECEFF4;">)</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">        System</span><span style="color:#ECEFF4;">.</span><span style="color:#D8DEE9;">out</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">println</span><span style="color:#ECEFF4;">(</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">Sorted array: </span><span style="color:#ECEFF4;">&quot;</span><span style="color:#81A1C1;"> +</span><span style="color:#D8DEE9;"> Arrays</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">toString</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">arr</span><span style="color:#ECEFF4;">))</span><span style="color:#81A1C1;">;</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">}</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="python" tabindex="-1"><a class="header-anchor" href="#python"><span>Python</span></a></h2><div class="language-python line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-python;"><code><span class="line"><span class="line"><span style="color:#81A1C1;">def</span><span style="color:#88C0D0;"> bubble_sort</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9;">arr</span><span style="color:#ECEFF4;">):</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">    n </span><span style="color:#81A1C1;">=</span><span style="color:#88C0D0;"> len</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">arr</span><span style="color:#ECEFF4;">)</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    for</span><span style="color:#D8DEE9FF;"> i </span><span style="color:#81A1C1;">in</span><span style="color:#88C0D0;"> range</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">n </span><span style="color:#81A1C1;">-</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">):</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        for</span><span style="color:#D8DEE9FF;"> j </span><span style="color:#81A1C1;">in</span><span style="color:#88C0D0;"> range</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">n </span><span style="color:#81A1C1;">-</span><span style="color:#D8DEE9FF;"> i </span><span style="color:#81A1C1;">-</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">):</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">            if</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> &gt;</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j </span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">]:</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">                arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j</span><span style="color:#ECEFF4;">],</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j </span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j </span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;"> 1</span><span style="color:#ECEFF4;">],</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9FF;">j</span><span style="color:#ECEFF4;">]</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9FF;">arr </span><span style="color:#81A1C1;">=</span><span style="color:#ECEFF4;"> [</span><span style="color:#B48EAD;">64</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 34</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 25</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 12</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 22</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 11</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 90</span><span style="color:#ECEFF4;">]</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">bubble_sort</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9FF;">arr</span><span style="color:#ECEFF4;">)</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">print</span><span style="color:#ECEFF4;">(</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">Sorted array:</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#ECEFF4;">,</span><span style="color:#D8DEE9FF;"> arr</span><span style="color:#ECEFF4;">)</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="go" tabindex="-1"><a class="header-anchor" href="#go"><span>Go</span></a></h2><div class="language-go line-numbers-mode line-numbers-mode" data-highlighter="prismjs" data-ext="go" data-title="go"><pre class="shiki nord vp-code" style="background-color:#2e3440ff;color:#d8dee9ff language-go;"><code><span class="line"><span class="line"><span style="color:#81A1C1;">package</span><span style="color:#D8DEE9FF;"> main</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">import</span><span style="color:#ECEFF4;"> &quot;</span><span style="color:#A3BE8C;">fmt</span><span style="color:#ECEFF4;">&quot;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">func</span><span style="color:#88C0D0;"> bubbleSort</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9;">arr</span><span style="color:#ECEFF4;"> []</span><span style="color:#81A1C1;">int</span><span style="color:#ECEFF4;">)</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">    n</span><span style="color:#81A1C1;"> :=</span><span style="color:#88C0D0;"> len</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9;">arr</span><span style="color:#ECEFF4;">)</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">    for</span><span style="color:#D8DEE9;"> i</span><span style="color:#81A1C1;"> :=</span><span style="color:#B48EAD;"> 0</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9;"> i</span><span style="color:#81A1C1;"> &lt;</span><span style="color:#D8DEE9;"> n</span><span style="color:#81A1C1;">-</span><span style="color:#B48EAD;">1</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9;"> i</span><span style="color:#81A1C1;">++</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">        for</span><span style="color:#D8DEE9;"> j</span><span style="color:#81A1C1;"> :=</span><span style="color:#B48EAD;"> 0</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9;"> j</span><span style="color:#81A1C1;"> &lt;</span><span style="color:#D8DEE9;"> n</span><span style="color:#81A1C1;">-</span><span style="color:#D8DEE9;">i</span><span style="color:#81A1C1;">-</span><span style="color:#B48EAD;">1</span><span style="color:#81A1C1;">;</span><span style="color:#D8DEE9;"> j</span><span style="color:#81A1C1;">++</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">            if</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9;">j</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> &gt;</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9;">j</span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;">1</span><span style="color:#ECEFF4;">]</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">                arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9;">j</span><span style="color:#ECEFF4;">],</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9;">j</span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;">1</span><span style="color:#ECEFF4;">]</span><span style="color:#81A1C1;"> =</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9;">j</span><span style="color:#81A1C1;">+</span><span style="color:#B48EAD;">1</span><span style="color:#ECEFF4;">],</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">[</span><span style="color:#D8DEE9;">j</span><span style="color:#ECEFF4;">]</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">            }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">        }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#81A1C1;">func</span><span style="color:#88C0D0;"> main</span><span style="color:#ECEFF4;">()</span><span style="color:#ECEFF4;"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">    arr</span><span style="color:#81A1C1;"> :=</span><span style="color:#ECEFF4;"> []</span><span style="color:#81A1C1;">int</span><span style="color:#ECEFF4;">{</span><span style="color:#B48EAD;">64</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 34</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 25</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 12</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 22</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 11</span><span style="color:#ECEFF4;">,</span><span style="color:#B48EAD;"> 90</span><span style="color:#ECEFF4;">}</span></span></span>
<span class="line"><span class="line"><span style="color:#88C0D0;">    bubbleSort</span><span style="color:#ECEFF4;">(</span><span style="color:#D8DEE9;">arr</span><span style="color:#ECEFF4;">)</span></span></span>
<span class="line"><span class="line"><span style="color:#D8DEE9;">    fmt</span><span style="color:#ECEFF4;">.</span><span style="color:#88C0D0;">Println</span><span style="color:#ECEFF4;">(</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#A3BE8C;">Sorted array:</span><span style="color:#ECEFF4;">&quot;</span><span style="color:#ECEFF4;">,</span><span style="color:#D8DEE9;"> arr</span><span style="color:#ECEFF4;">)</span></span></span>
<span class="line"><span class="line"><span style="color:#ECEFF4;">}</span></span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9)]))}const i=n(e,[["render",o],["__file","bubble_sort.html.vue"]]),t=JSON.parse('{"path":"/md/article/algorithm/sort/bubble_sort.html","title":"冒泡排序","lang":"en-US","frontmatter":{"title":"冒泡排序"},"headers":[{"level":2,"title":"描述","slug":"描述","link":"#描述","children":[]},{"level":2,"title":"Java","slug":"java","link":"#java","children":[]},{"level":2,"title":"Python","slug":"python","link":"#python","children":[]},{"level":2,"title":"Go","slug":"go","link":"#go","children":[]}],"git":{"updatedTime":1735987270000,"contributors":[{"name":"hyfly233","username":"hyfly233","email":"hyfly233@outlook.com","commits":1,"url":"https://github.com/hyfly233"}]},"filePathRelative":"md/article/algorithm/sort/bubble_sort.md"}');export{i as comp,t as data};
