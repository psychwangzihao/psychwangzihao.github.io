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
  <span style="font-size: .85rem; color: var(--global-text-color-light); margin-left: .6rem;">合作者：刘江豪（巴黎脑科学院）</span>
</div>

<h2>科学问题</h2>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem;">
  心盲症（aphantasia）指清醒状态下缺乏视觉心理意象的体验。合作方基于 7T 功能磁共振的单被试水平分析
  （10 名心盲者、10 名对照）发现：<strong>想象任务中视觉皮层的激活强度与对照组没有差异</strong>；
  但<strong>想象与感知的神经表征相关缺失</strong>（对照组显著为正）；且<strong>左侧前额叶与视觉皮层的功能连接显著降低</strong>，
  右侧腹侧注意网络功能连接反而增强。弥散张量成像进一步显示钩状束各向异性降低、内侧颞叶皮层增厚。
</p>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem;">
  据此，合作方提出<strong>「生成—整合—放大」三步模型</strong>：视觉想象先在视觉皮层生成基础特征，继而整合为物体水平的表征，
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
    background: var(--tl-c, #b9b3aa); border: 2px solid var(--global-bg-color, #fff);
    box-sizing: content-box;
  }
  .tl-item[data-track="behaviour"] { --tl-c: #6a7f9c; }
  .tl-item[data-track="tms"]       { --tl-c: #8b6fb0; }
  .tl-item[data-track="rift"]      { --tl-c: #3d9970; }
  .tl-item[data-track="gate"]      { --tl-c: #d97a00; }
  .tl-item[data-track="done"]      { --tl-c: #cfcabf; }
  html[data-theme="dark"] .tl-item::before { border-color: var(--global-bg-color, #1c1c1c); }

  .tl details {
    border: 1px solid var(--global-divider-color);
    border-left: 3px solid var(--tl-c, #b9b3aa);
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
  .tl-track {
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
  .tl-detail p { margin: 0 0 .6rem; }
  .tl-detail p:last-child { margin-bottom: 0; }
  /* 并行的那条：往右缩进，视觉上表示它和主线并排跑 */
  .tl-item[data-track="rift"] { margin-left: 1.6rem; }
  .tl-item[data-track="rift"]::before { left: -3.2rem; }
</style>

<div class="tl">

<div class="tl-item" data-track="done">
<details>
<summary>
  <span class="tl-when">5/28 – 9/21</span>
  <span class="tl-h">前期讨论与准备</span>
  <span class="tl-track">已完成</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>与合作方确定机制与模型假设</li>
    <li>讨论确定 Gabor 感知—想象交互范式（一致 / 不一致 90°）、480 Hz 显示器、逐帧掉帧监测且掉帧率 &lt;5%、MATLAB + Psychtoolbox、眼动控制</li>
    <li>完成伦理材料：申请表、研究方案与项目摘要、行为与脑电版及 TMS 版两份知情同意书、量表与筛查表</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item" data-track="behaviour">
<details>
<summary>
  <span class="tl-when">9/21 – 9/24</span>
  <span class="tl-h">调试行为实验</span>
  <span class="tl-track">行为线</span>
</summary>
<div class="tl-detail">
  <p>线下与线上全流程跑通。程序、显示器、按键与记录链路在真机上走完一遍。</p>
</div>
</details>
</div>

<div class="tl-item" data-track="tms">
<details>
<summary>
  <span class="tl-when">9/25 – 10/7</span>
  <span class="tl-h">采集正常被试行为数据 + 学习并确认 TMS 靶点</span>
  <span class="tl-track">行为 + TMS</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>正常被试行为数据开始采集（近阈限 Gabor 检测 + 想象任务，d′ 与 criterion）</li>
    <li>学习 TMS 操作，确认定位方案</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item" data-track="tms">
<details>
<summary>
  <span class="tl-when">10/8 – 10/11</span>
  <span class="tl-h">调试 TMS + 行为数据分析</span>
  <span class="tl-track">TMS + 分析</span>
</summary>
<div class="tl-detail">
  <p>TMS 线下跑通（导航、rMT 测定、刺激参数、安全流程），同时开始分析前一段的行为数据。</p>
</div>
</details>
</div>

<div class="tl-item" data-track="behaviour">
<details>
<summary>
  <span class="tl-when">10/12 – 11/4</span>
  <span class="tl-h">招募心盲被试 + 常模 TMS 数据采集</span>
  <span class="tl-track">行为 + TMS</span>
</summary>
<div class="tl-detail">
  <ul>
    <li><strong>计划与中国美院、浙大科普中心合作</strong>，通过合作艺术展出、科普宣讲等方式，找到<strong>约 100 位心盲被试</strong>并建立心盲被试联络群</li>
    <li>常模的 TMS 数据开始采集</li>
  </ul>
</div>
</details>
</div>

<div class="tl-item" data-track="rift">
<details>
<summary>
  <span class="tl-when">9/21 – 11/4</span>
  <span class="tl-h">RIFT 环境搭建</span>
  <span class="tl-track">并行线</span>
</summary>
<div class="tl-detail">
  <p>与上面三条线并行。目标是在 480 Hz 显示器上稳定复现 RIFT 信号，确定正式实验可用的参数取值范围（信噪比、掉帧率、刺激大小）。</p>
  <p><strong>如果在这个窗口内确认 RIFT 做不了，就及时放弃</strong>。</p>
</div>
</details>
</div>

<div class="tl-item" data-track="behaviour">
<details>
<summary>
  <span class="tl-when">11/5 – 11/25</span>
  <span class="tl-h">行为实验全部数据采集完成（正常 + 心盲）</span>
  <span class="tl-track">全线</span>
</summary>
<div class="tl-detail">
  <ul>
    <li>完成行为实验的<strong>全部</strong>数据采集（正常与心盲）</li>
    <li>主要精力放在 <strong>RIFT 的 baseline</strong></li>
    <li>同步进行 TMS、行为数据的数据分析</li>
  </ul>
  <p><strong>寒假开始前</strong>：至少要完成 RIFT 的验证，最好能完成 RIFT 的 baseline 实验。</p>
  <p><strong>寒假结束前</strong>：至少要完成行为、TMS 的数据采集，最好能完成采集和数据分析。</p>
</div>
</details>
</div>

<div class="tl-item" data-track="gate">
<details>
<summary>
  <span class="tl-when">最快 11/30，最慢下学期初</span>
  <span class="tl-h">正式开始 RIFT 实验</span>
  <span class="tl-track">闸门</span>
</summary>
<div class="tl-detail">
  <p>条件是：</p>
  <ul>
    <li>行为实验<strong>已完成数据采集和分析</strong></li>
    <li>TMS <strong>已完成数据采集和分析</strong></li>
    <li>RIFT 的 <strong>baseline 实验通过</strong></li>
  </ul>
</div>
</details>
</div>

</div>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem; margin-top: 1.2rem;">
  RIFT 在我系实验室尚处于建立阶段，文献里也只有约一半被试能产生稳定的标记信号。如果 RIFT 无法实现，
  就<strong>用非 RIFT 的行为范式结合核磁—脑电范式推进心盲症研究</strong>。
</p>

<h2>后续研究目标</h2>

<p style="font-size: .93rem; line-height: 1.75; max-width: 52rem;">
  如果 RIFT 能跑通，后续就可以用它进一步追问「想象」到底如何发生。最终目标是提出一个<strong>计算模型</strong>
  来解释人脑想象的神经科学原理——目前的猜想是<strong>扩散生成模型</strong>。
</p>

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
