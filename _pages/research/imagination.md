---
layout: page
title: Imagination
permalink: /research/imagination/
nav: false
---

<a href="/research/consciousness/content/" style="font-size: .875rem; color: var(--global-theme-color);">← Content</a>

<h1 style="margin-top: 1rem;">心盲症视觉想象的意识通达机制</h1>

<div style="margin-bottom: 1.6rem;">
  <span style="font-size: .72rem; background: #3d9970; color: #fff; padding: .15rem .5rem; border-radius: 12px;">Active</span>
  <span style="font-size: .72rem; background: #d97a00; color: #fff; padding: .15rem .5rem; border-radius: 12px; margin-left: .35rem;">Current</span>
</div>

<h2>科学问题</h2>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem;">
  心盲症（aphantasia）指清醒状态下缺乏视觉心理意象的体验。过往研究发现：<strong>想象任务中视觉皮层的激活强度与对照组没有差异</strong>；
  但<strong>想象与感知的神经表征相关缺失</strong>（对照组显著为正）；且<strong>左侧前额叶与视觉皮层的功能连接显著降低</strong>，
  右侧腹侧注意网络功能连接反而增强。弥散张量成像进一步显示钩状束各向异性降低、内侧颞叶皮层增厚。
</p>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem;">
  据此，我们提出<strong>「生成—整合—放大」三步模型</strong>：视觉想象先在视觉皮层生成基础特征，继而整合为物体水平的表征，
  最终经前额叶通路放大并进入全局工作空间、形成有意识的体验。
</p>

<div style="margin: 1.6rem 0; overflow-x: auto;">
<table style="width: 100%; max-width: 52rem; border-collapse: collapse; font-size: .88rem;">
  <thead>
    <tr style="border-bottom: 2px solid var(--global-divider-color);">
      <th style="text-align: left; padding: .5rem .6rem;">假设</th>
      <th style="text-align: left; padding: .5rem .6rem;">机制</th>
      <th style="text-align: left; padding: .5rem .6rem;">行为预测</th>
      <th style="text-align: left; padding: .5rem .6rem;">RIFT / EEG 预测</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid var(--global-divider-color);">
      <td style="padding: .55rem .6rem;"><strong>H1 无信号</strong></td>
      <td style="padding: .55rem .6rem;">生成或整合失败</td>
      <td style="padding: .55rem .6rem;">无一致—不一致效应</td>
      <td style="padding: .55rem .6rem;">RIFT 无想象调制；baseline 可能正常</td>
    </tr>
    <tr style="border-bottom: 1px solid var(--global-divider-color);">
      <td style="padding: .55rem .6rem;"><strong>H2 通达失败</strong></td>
      <td style="padding: .55rem .6rem;">信号在，但左前额叶放大失败</td>
      <td style="padding: .55rem .6rem;">无行为效应</td>
      <td style="padding: .55rem .6rem;">RIFT 信号与正常人相同</td>
    </tr>
    <tr>
      <td style="padding: .55rem .6rem;"><strong>H3 增益不足</strong></td>
      <td style="padding: .55rem .6rem;">信号偏弱</td>
      <td style="padding: .55rem .6rem;">效应弱</td>
      <td style="padding: .55rem .6rem;">调制弱、幅度降低</td>
    </tr>
  </tbody>
</table>
</div>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem;">
  关键在「视觉皮层激活强度大体正常」——那说明生成环节大体完好；而「想象与感知表征相关缺失」与「额—视觉连接降低」
  共同指向<strong>表征整合</strong>与<strong>视觉—前额叶耦合</strong>。
  本研究的目标是在行为与脑电层面把「表征未整合」和「整合后未能通达」这两种可能分开。
</p>

<h2>时间轴</h2>

<style>
  .tl { position: relative; margin: 1.6rem 0 1rem; padding-left: 1.6rem; max-width: 54rem; }
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
  .tl-item[data-t="done"]  { --tl-c: #cfcabf; }   /* 已完成 */
  .tl-item[data-t="rift"]  { --tl-c: #3d9970; }   /* 并行的那条 */
  .tl-item[data-t="end"]   { --tl-c: #d97a00; }   /* 收口 */
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
  /* 并行的那条：往右缩进，视觉上表示它和主线并排跑 */
  .tl-item[data-t="rift"] { margin-left: 1.6rem; }
  .tl-item[data-t="rift"]::before { left: -3.2rem; }
</style>

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
    <li>提出假设</li>
    <li>确定 Gabor 感知—想象交互范式、480 Hz 显示器、逐帧掉帧监测且掉帧率 &lt;5%、MATLAB + Psychtoolbox、眼动控制</li>
    <li>完成伦理申请</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item">
<details>
<summary>
  <span class="tl-when">9/21 – 9/24</span>
  <span class="tl-h">调试行为实验</span>
</summary>
<div class="tl-detail">
  <p>全流程跑通，完成小样本预实验。</p>
</div>
</details>
</div>

<div class="tl-item">
<details>
<summary>
  <span class="tl-when">9/25 – 10/11</span>
  <span class="tl-h">采集正常被试行为数据 + 学习并确认 TMS 靶点</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>正常被试行为数据开始采集</li>
    <li>学习 TMS 操作，确认定位方案并跑通</li>
    <li>准备招募心盲被试</li>
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
    <li>进行 TMS、行为数据的数据分析</li>
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
  <span class="tl-h">行为 / TMS 论文写作 + 后续研究</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>论文写作与投稿</li>
    <li>后续研究方案确定以及对应预实验完成，并根据情况制定寒假研究计划</li>
  </ul>
</div>
</details>
</div>

</div>

<h2>参考文献</h2>

<div style="font-size: .87rem; line-height: 1.9; max-width: 52rem;">

<p style="margin-bottom: .8rem;">
  Çelik, Ü. G., Arora, K., Kenemans, J. L., Van der Stigchel, S., Gayet, S., &amp; Chota, S. (2025).
  Tracking attention using RIFT with a consumer-monitor setup. <em>bioRxiv</em>.
  <a href="https://doi.org/10.1101/2025.10.03.680199">10.1101/2025.10.03.680199</a>
</p>

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
