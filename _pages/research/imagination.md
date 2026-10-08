---
layout: rpage
title: 心盲症视觉想象的意识通达机制
permalink: /research/imagination/
nav: false
---

<a href="/research/consciousness/content/" style="font-size: .875rem; color: var(--global-theme-color);">← Content</a>

<style>
  /* Consciousness 板块统一版式：只用这几个类，不再到处写 inline style。 */
  .im-tags { margin: .6rem 0 1.5rem; }
  .im-tag { font-size: .72rem; padding: .15rem .55rem; border-radius: 12px; color: #fff; }
  .im-tag + .im-tag { margin-left: .35rem; }
  .im-tag--on { background: #3d9970; }
  .im-tag--now { background: #d97a00; }
  .im-tag--off { background: #b9b3aa; }

  .r-body h2.im-h2 { margin: 1.6em 0 .5em; }

  .im-p {
    font-size: .95rem; line-height: 1.8; max-width: 52rem;
    color: var(--global-text-color); margin: 0 0 .55rem;
  }
  .im-p:last-child { margin-bottom: 0; }
  .im-p--lead { font-size: 1rem; }

  /* 进展 / 任务卡片 */
  .im-box {
    border: 1px solid var(--global-divider-color);
    border-left: 3px solid var(--im-c, #6a7f9c);
    border-radius: 8px; background: var(--global-card-bg-color);
    padding: 1rem 1.15rem; max-width: 52rem; margin: .9rem 0 1.2rem;
  }
  .im-box--done { --im-c: #3d9970; }
  .im-box--now  { --im-c: #d97a00; }
  .im-box h3 {
    font-size: .95rem; font-weight: 600; margin: 0 0 .55rem;
    color: var(--global-text-color);
  }
  .im-box h3 .im-when {
    font-family: var(--font-mono, monospace); font-size: .78rem; font-weight: 400;
    color: var(--global-text-color-light); margin-left: .5rem;
  }
  .im-box ul { margin: 0; padding-left: 1.15rem; font-size: .9rem; line-height: 1.75; }
  .im-box li { margin-bottom: .28rem; }
  .im-box li:last-child { margin-bottom: 0; }
  .im-box p { font-size: .9rem; line-height: 1.75; margin: 0; }
  .im-box p + p { margin-top: .5rem; }

  /* 时间轴 */
  .tl { position: relative; margin: 1.2rem 0 1rem; padding-left: 1.6rem; max-width: 54rem; }
  .tl::before {
    content: ''; position: absolute; left: .34rem; top: .5rem; bottom: .5rem;
    width: 2px; background: var(--global-divider-color);
  }
  .tl-item { position: relative; margin-bottom: 1.1rem; }
  .tl-item::before {
    content: ''; position: absolute; left: -1.6rem; top: .95rem;
    width: .72rem; height: .72rem; border-radius: 50%;
    background: var(--tl-c, #6a7f9c); border: 2px solid var(--global-bg-color, #fff);
    box-sizing: content-box;
  }
  .tl-item[data-t="done"]  { --tl-c: #cfcabf; }
  .tl-item[data-t="rift"]  { --tl-c: #3d9970; }
  .tl-item[data-t="now"]   { --tl-c: #d97a00; }
  .tl-item[data-t="end"]   { --tl-c: #d97a00; }
  html[data-theme="dark"] .tl-item::before { border-color: var(--global-bg-color, #1c1c1c); }

  .tl details {
    border: 1px solid var(--global-divider-color);
    border-left: 3px solid var(--tl-c, #6a7f9c);
    border-radius: 6px; background: var(--global-card-bg-color);
    transition: background .15s;
  }
  .tl details[open] { background: rgba(0,0,0,.015); }
  html[data-theme="dark"] .tl details       { background: rgba(255,255,255,.025); }
  html[data-theme="dark"] .tl details[open] { background: rgba(255,255,255,.05); }
  .tl summary {
    cursor: pointer; padding: .8rem 1rem; list-style: none;
    display: flex; flex-wrap: wrap; align-items: baseline; gap: .6rem;
  }
  .tl summary::-webkit-details-marker { display: none; }
  .tl summary::after {
    content: '+'; margin-left: auto; color: var(--global-text-color-light);
    font-size: 1rem; font-weight: 400;
  }
  .tl details[open] summary::after { content: '−'; }
  .tl-when {
    font-family: var(--font-mono, monospace); font-size: .78rem;
    color: var(--global-text-color-light); white-space: nowrap; flex: none;
  }
  .tl-h { font-size: .97rem; font-weight: 600; color: var(--global-text-color); }
  .tl-flag {
    font-size: .68rem; padding: .06rem .42rem; border-radius: 9px;
    border: 1px solid var(--tl-c, #b9b3aa); color: var(--tl-c, #8a857d);
    white-space: nowrap; flex: none;
  }
  .tl-detail {
    padding: .8rem 1rem 1rem; font-size: .89rem; line-height: 1.7;
    color: var(--global-text-color); border-top: 1px solid var(--global-divider-color);
  }
  .tl-detail ul { margin: 0; padding-left: 1.1rem; }
  .tl-detail li { margin-bottom: .35rem; }
  .tl-detail li:last-child { margin-bottom: 0; }
  .tl-detail p { margin: 0; }
  .tl-item[data-t="rift"] { margin-left: 1.6rem; }
  .tl-item[data-t="rift"]::before { left: -3.2rem; }
</style>

<div class="im-tags">
  <span class="im-tag im-tag--on">Active</span>
  <span class="im-tag im-tag--now">第一轮完成</span>
</div>

<h2 class="im-h2">科学问题</h2>

<p class="im-p im-p--lead">
  心盲症（aphantasia）指清醒状态下缺乏视觉心理意象的体验。<strong>想象任务中视觉皮层的激活强度与对照组并无差异</strong>，
  但<strong>想象与感知的神经表征相关缺失</strong>，且<strong>左侧前额叶与视觉皮层的功能连接降低</strong>。
</p>

<p class="im-p">
  据此我们提出<strong>「生成—整合—放大」三步模型</strong>：视觉想象先在视觉皮层生成基础特征，继而整合为物体水平的表征，
  最终经前额叶通路放大、进入全局工作空间，形成有意识的体验。
  本项目要回答的是：心盲者的缺失发生在哪一步——是<strong>表征未被整合</strong>，还是<strong>整合之后未能通达</strong>。
</p>

<h2 class="im-h2">进展</h2>

<div class="im-box im-box--done">
  <h3>第一轮行为实验完成<span class="im-when">2026-10</span></h3>
  <ul>
    <li><strong>采集</strong>：国庆假期 7 天连续施测，33 人完成，每人约 2 小时。</li>
    <li><strong>样本</strong>：30 人可用——老设计 10 人，新设计 20 人（其中对照 18 人、心盲 2 人）。
        排除判据在看数据之前即已确定，且与假设方向无关。</li>
    <li><strong>分析</strong>：全套分析已完成，直读原始数据重算，三轮交叉核对零差异。</li>
    <li><strong>结果</strong>：<strong>对照组中，想象与感知之间存在稳健的一致性效应</strong>——
        在有呈现试次上，与提示想象朝向一致的判断正确率比不一致高出约 16 个百分点
        （<em>t</em>(17) = 4.69，<em>p</em> = .0002，效应量 <em>d</em><sub>z</sub> = 1.11）。
        该效应在去掉天花板被试后更强，方向不变。</li>
    <li><strong>待补</strong>：心盲组目前仅 2 人且方向相反，<strong>核心对比尚无结果</strong>——
        样本补齐之前不能回答「心盲者是否缺失该效应」。</li>
  </ul>
</div>

<div class="im-box">
  <h3>我承担的工作</h3>
  <ul>
    <li>实验程序的汉化与本地化，以及实验室环境下的调试与校准</li>
    <li>主试施测、被试招募与数据采集（本轮 33 人全部由本人完成）</li>
    <li>搭建分析管线：直读原始数据，不经过中间表格；建立三轮交叉核对流程</li>
    <li>全量统计分析、被试内稳健性检查（留一法）与结果整理</li>
    <li>方法学专题：判断标准与敏感度指标在本设计中的关系（本轮独立成篇）</li>
  </ul>
</div>

<h2 class="im-h2">下一步</h2>

<div class="im-box im-box--now">
  <h3>第二轮：把「想象」与「照提示作答」分开</h3>
  <ul>
    <li>加入<strong>「提示但不想象」的对照区组</strong>——这是目前唯一已知的分离办法。
        现有设计里两种机制预测完全相同，信号检测论也分不开。</li>
    <li>平衡生动度评分与作答的先后顺序（本轮评分恒在作答之后，会污染主观报告的解释）。</li>
    <li>继续招募<strong>心盲被试</strong>，补齐核心对比所需样本；对照样本按现有规模收口即可。</li>
  </ul>
</div>

<h2 class="im-h2">时间轴</h2>

<div class="tl">

<div class="tl-item" data-t="done">
<details>
<summary>
  <span class="tl-when">5/28 – 9/21</span>
  <span class="tl-h">前期讨论与准备</span>
  <span class="tl-flag">已完成</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>提出假设，确定 Gabor 感知—想象交互范式</li>
    <li>完成伦理申请</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item" data-t="done">
<details>
<summary>
  <span class="tl-when">9/21 – 10/8</span>
  <span class="tl-h">行为实验第一轮</span>
  <span class="tl-flag">已完成</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>程序调试与预实验，随后正式采集</li>
    <li>国庆假期 7 天连续施测：33 人完成（每人约 2 小时），30 人可用</li>
    <li>已完成全量分析、稳健性检查与方法学专题</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item">
<details>
<summary>
  <span class="tl-when">10/12 – 11/8</span>
  <span class="tl-h">招募心盲被试 + 常模 TMS 数据采集</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>采集常模 TMS 数据</li>
    <li>招募心盲被试并采集其行为数据</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item">
<details>
<summary>
  <span class="tl-when">11/9 – 11/29</span>
  <span class="tl-h">数据分析</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>TMS 与行为数据分析</li>
    <li>参加中国认知科学学会意识科学分会 2026 学术年会</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item" data-t="rift">
<details>
<summary>
  <span class="tl-when">9/21 – 11/29</span>
  <span class="tl-h">并行线</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>学习脑状态分析</li>
    <li>RIFT 环境搭建（若成功，则后续以 RIFT 范式为主；若不成功，则后续以 fMRI-EEG 范式为主）</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item" data-t="end">
<details>
<summary>
  <span class="tl-when">11/30 – 12/27</span>
  <span class="tl-h">论文写作与后续研究</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>论文写作与投稿</li>
    <li>后续研究方案确定与对应预实验，据此制定寒假研究计划</li>
  </ul>
</div>
</details>
</div>

</div>

<h2 class="im-h2">参考文献</h2>

<div style="font-size: .87rem; line-height: 1.9; max-width: 52rem;">

<p style="margin-bottom: .8rem;">
  Zeman, A., Dewar, M., &amp; Della Sala, S. (2015). Lives without imagery – Congenital aphantasia.
  <em>Cortex</em>, 73, 378–380.
  <a href="https://doi.org/10.1016/j.cortex.2015.05.019">10.1016/j.cortex.2015.05.019</a>
</p>

<p style="margin-bottom: .8rem;">
  Pearson, J. (2019). The human imagination: the cognitive neuroscience of visual mental imagery.
  <em>Nature Reviews Neuroscience</em>, 20, 624–634.
  <a href="https://doi.org/10.1038/s41583-019-0202-9">10.1038/s41583-019-0202-9</a>
</p>

<p style="margin-bottom: .8rem;">
  Dijkstra, N., &amp; Fleming, S. M. (2023). Subjective signal strength distinguishes reality from imagination.
  <em>Nature Communications</em>, 14, 1627.
  <a href="https://doi.org/10.1038/s41467-023-37322-1">10.1038/s41467-023-37322-1</a>
</p>

<p>
  Dehaene, S., Changeux, J.-P., Naccache, L., Sackur, J., &amp; Sergent, C. (2006). Conscious, preconscious,
  and subliminal processing: a testable taxonomy. <em>Trends in Cognitive Sciences</em>, 10(5), 204–211.
  <a href="https://doi.org/10.1016/j.tics.2006.03.007">10.1016/j.tics.2006.03.007</a>
</p>

</div>
