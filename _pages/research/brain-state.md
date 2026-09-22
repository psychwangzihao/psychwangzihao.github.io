---
layout: rpage
title: 脑状态测量工具包
permalink: /research/brain-state/
nav: false
rnode: brainstate
---

<style>
  /* 这一页是「默认一屏 + 细节折叠」。默认状态下屏幕上只有：
     标题 / 目标 / 三个台阶 / 汇报节奏 —— 组会投影打开就是这个。
     展开块里放的是参考文档性质的内容。 */
  .bs-note {
    font-size: .93rem; line-height: 1.68;
    max-width: 56rem; margin: 0;
  }
  /* 三个 h2 各收一点，加起来省掉小半屏 */
  .r-body h2 { margin: .55em 0 .35em; }
  /* 副标题和徽标并成一行，省掉一整行的高度 */
  .bs-meta {
    display: flex; flex-wrap: wrap; align-items: baseline;
    gap: .3rem 1rem; max-width: 56rem; margin: 0 0 .6rem;
  }
  .bs-meta .bs-desc {
    font-size: 1rem; line-height: 1.55; margin: 0;
    color: var(--global-text-color);
  }
  .bs-meta .bs-tag {
    font-size: .72rem; background: #3d9970; color: #fff;
    padding: .15rem .5rem; border-radius: 12px; white-space: nowrap;
  }

  .stages { width: 100%; max-width: 60rem; border-collapse: collapse; font-size: .89rem; }
  .stages th {
    text-align: left; padding: .38rem .6rem; font-weight: 600;
    border-bottom: 2px solid var(--global-divider-color);
  }
  .stages td {
    padding: .36rem .6rem; vertical-align: top;
    border-bottom: 1px solid var(--global-divider-color); line-height: 1.45;
  }
  .stages .s-k { white-space: nowrap; font-weight: 600; }
  .stages tr[data-p="1"] .s-k { color: #6a7f9c; }
  .stages tr[data-p="2"] .s-k { color: #3d9970; }
  .stages tr[data-p="3"] .s-k { color: #d97a00; }
  .stages .s-t {
    white-space: nowrap; font-family: var(--font-mono, monospace);
    font-size: .8rem; color: var(--global-text-color-light);
  }
  /* 产出跟在「做什么」后面同行排 —— 换行的话每行多占一整行，
     三行表就多出 100 多像素。 */
  .stages .s-o { font-size: .84rem; color: var(--global-text-color-light); }
  .stages .s-o::before { content: ' → '; }

  /* 展开块：研究背景 / 逐周计划 / 材料 / 汇报议程 */
  /* 折叠块平时 2x2 并排，展开的那一个自动占满整行 —— 既不浪费
     高度，展开后正文也还是正常宽度。 */
  .folds {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: .4rem; max-width: 60rem;
  }
  .folds .fold[open] { grid-column: 1 / -1; }
  @media (max-width: 900px) { .folds { grid-template-columns: 1fr; } }

  .fold {
    border: 1px solid var(--global-divider-color);
    border-left: 3px solid #6a7f9c;
    border-radius: 6px; background: var(--global-card-bg-color);
    max-width: 60rem;
  }
  .fold > summary {
    cursor: pointer; list-style: none; padding: .42rem .95rem;
    display: flex; flex-wrap: wrap; align-items: baseline; gap: .65rem;
    font-size: .9rem;
  }
  .fold > summary::-webkit-details-marker { display: none; }
  .fold > summary::after {
    content: '+'; margin-left: auto; color: var(--global-text-color-light);
  }
  .fold[open] > summary::after { content: '−'; }
  .fold-h { font-weight: 600; color: var(--global-text-color); }
  .fold-l { font-size: .84em; color: var(--global-text-color-light); }
  .fold-body {
    border-top: 1px solid var(--global-divider-color);
    padding: .85rem 1rem 1rem; font-size: .9em; line-height: 1.7;
  }
  .fold-body h4 {
    margin: 1.1rem 0 .5rem; font-size: 1em; font-weight: 600;
    color: var(--global-text-color-light); letter-spacing: .02em;
  }
  .fold-body h4:first-child { margin-top: 0; }
  .fold-body p { margin: 0 0 .7rem; }
  .fold-body p:last-child { margin-bottom: 0; }

  .wk { width: 100%; border-collapse: collapse; font-size: .87rem; }
  .wk th {
    text-align: left; padding: .45rem .55rem; font-weight: 600;
    border-bottom: 2px solid var(--global-divider-color);
  }
  .wk td {
    padding: .5rem .55rem; vertical-align: top;
    border-bottom: 1px solid var(--global-divider-color); line-height: 1.55;
  }
  .wk .w-t {
    white-space: nowrap; font-family: var(--font-mono, monospace);
    font-size: .78rem; color: var(--global-text-color-light);
  }
  .wk .w-k { white-space: nowrap; font-weight: 600; }
  .wk tr[data-p="1"] .w-k { color: #6a7f9c; }
  .wk tr[data-p="2"] .w-k { color: #3d9970; }
  .wk tr[data-p="3"] .w-k { color: #d97a00; }
  .wk .w-r { color: var(--global-theme-color); white-space: nowrap; font-size: .8rem; }
  .wk tr[data-off] td { color: var(--global-text-color-light); }
</style>

<a href="/research/consciousness/state/" style="display: inline-block; font-size: .875rem; line-height: 1.25; margin: 0 0 .2rem; color: var(--global-theme-color);">← State</a>

<div class="bs-meta" style="margin-top: .55rem;">
  <p class="bs-desc">通过多指标计算建模，开发基于静息态功能磁共振影像数据的脑状态测量工具包</p>
  <span class="bs-tag">Active · In prep</span>
</div>

<h2>目标</h2>

<p class="bs-note" style="margin-bottom: .25rem;">
  <strong>11 月 25 日前，在思想与实操上 follow up 上高晓卿老师课题组脑状态研究的水准。</strong>
</p>

<ul class="bs-note" style="margin-top: 0;">
  <li><strong>思想</strong>：完整理解该组已发表的脑状态工作，讲得清每条结论怎么来的、边界在哪。</li>
  <li><strong>实操</strong>：独立跑通同一套分析——滑窗构造动态指标、聚类得到脑状态、计算状态动态量。</li>
</ul>

<h2>三个台阶</h2>

<table class="stages">
  <thead>
    <tr>
      <th style="width: 8.5rem;">台阶</th>
      <th style="width: 8.5rem;">时间</th>
      <th>做什么 · 关键产出</th>
    </tr>
  </thead>
  <tbody>
    <tr data-p="1">
      <td class="s-k">一 · 建立判断力</td>
      <td class="s-t">9/22 – 10/11</td>
      <td>先知道什么叫一个好的脑状态指标，再学工具<span class="s-o">能把每个术语讲清楚，知道它凭什么可信</span></td>
    </tr>
    <tr data-p="2">
      <td class="s-k">二 · 读透并跑通</td>
      <td class="s-t">10/12 – 11/8</td>
      <td>两篇核心各读两遍，同时把流程亲手跑一遍<span class="s-o">能复现出该组的核心分析</span></td>
    </tr>
    <tr data-p="3">
      <td class="s-k">三 · 定位与收口</td>
      <td class="s-t">11/9 – 11/25</td>
      <td>知道这套东西在领域里处于什么位置，写成报告<span class="s-o">一份能讲的学习报告</span></td>
    </tr>
  </tbody>
</table>

<p class="bs-note" style="margin-top: .7rem;">
  每天 30 分钟读书 + 4 个动手块。每两周一次，周一 9:00–9:30 向高老师汇报，共 5 次。
</p>

<div class="folds">

<details class="fold">
<summary><span class="fold-h">研究背景</span></summary>
<div class="fold-body">
<p>
  现有方法大多用某个单一指标描述脑状态，我们尝试<strong>把多个指标放进一个计算模型里（多指标计算建模），
  通过聚类分析</strong>得到脑状态分级。输入是静息态功能磁共振数据，输出是脑状态。
</p>
<p>
  该组这条线一共 6 篇，由辛晓阳（Xin Xiaoyang）一作完成，方法一脉相承：滑窗构造动态脑熵，
  再用 k-means 聚出可重复的脑状态，最后用状态的出现率与驻留时间刻画个体差异。
  核心是 2024 与 2026 两篇，其余四篇是同一套范式换病种、换指标。
</p>
</div>
</details>

<details class="fold">
<summary>
  <span class="fold-h">逐周计划</span>
  <span class="fold-l">10 周 · 每天 30 分钟 + 4 个动手块</span>
</summary>
<div class="fold-body">
<p>动手块每块 90–120 分钟——代码需要连续时间，塞不进 30 分钟的日课。</p>
<table class="wk">
  <thead>
    <tr>
      <th style="width: 3rem;">周</th>
      <th style="width: 7.6rem;">日期</th>
      <th>读</th>
      <th style="width: 10.5rem;">动手</th>
    </tr>
  </thead>
  <tbody>
    <tr data-p="1">
      <td class="w-k">一</td><td class="w-t">9/22 – 9/27</td>
      <td>本组 2021 综述；上游 Luppi 2024</td><td>—</td>
    </tr>
    <tr data-p="1">
      <td class="w-k">一</td><td class="w-t">9/28 – 10/4</td>
      <td>本组 2024（第一遍）；上游 Hutchison 2013</td>
      <td><span class="w-r">9/28 汇报①</span></td>
    </tr>
    <tr data-p="1" data-off>
      <td class="w-k">一</td><td class="w-t">10/5 – 10/11</td>
      <td>本组 2024（补完第一遍）</td>
      <td>国庆</td>
    </tr>
    <tr data-p="2">
      <td class="w-k">二</td><td class="w-t">10/12 – 10/18</td>
      <td>本组 2024（第二遍：方法）；上游 Allen 2014</td>
      <td>动手块① 装环境、取公开数据<br><span class="w-r">10/12 汇报②</span></td>
    </tr>
    <tr data-p="2">
      <td class="w-k">二</td><td class="w-t">10/19 – 10/25</td>
      <td>本组 2026（第一遍）；上游 Hindriks 2016</td>
      <td>动手块② 自己算一遍动态脑熵</td>
    </tr>
    <tr data-p="2">
      <td class="w-k">二</td><td class="w-t">10/26 – 11/1</td>
      <td>本组 2026（第二遍）；上游 Wang 2014</td>
      <td>动手块③ 聚类得到脑状态<br><span class="w-r">10/26 汇报③</span></td>
    </tr>
    <tr data-p="2">
      <td class="w-k">二</td><td class="w-t">11/2 – 11/8</td>
      <td>本组 2023、2025；上游 Lurie 2020</td>
      <td>动手块④ 算状态动态量并对表</td>
    </tr>
    <tr data-p="3">
      <td class="w-k">三</td><td class="w-t">11/9 – 11/15</td>
      <td>本组 2022；下游 Varley 2023</td>
      <td>把指标套到自己的问题上<br><span class="w-r">11/9 汇报④</span></td>
    </tr>
    <tr data-p="3">
      <td class="w-k">三</td><td class="w-t">11/16 – 11/22</td>
      <td>查漏；下游 Nozari 2023</td>
      <td>写学习报告初稿</td>
    </tr>
    <tr data-p="3">
      <td class="w-k">三</td><td class="w-t">11/23 – 11/25</td>
      <td>—</td>
      <td>报告定稿<br><span class="w-r">11/23 汇报⑤ 验收</span></td>
    </tr>
  </tbody>
</table>
</div>
</details>

<details class="fold">
<summary>
  <span class="fold-h">每次汇报要解决什么</span>
  <span class="fold-l">5 次 · 每次带一个明确的问题去</span>
</summary>
<div class="fold-body">
<p><strong>① 9/28</strong>　确认边界：这条线读到什么程度算够；能否拿到数据与代码；需要什么工具与环境。</p>
<p><strong>② 10/12</strong>　讲清范式：滑窗、动态脑熵、聚类这三件事分别怎么定义、为什么这么做；带动手块①的进展。</p>
<p><strong>③ 10/26</strong>　讲清「重现任脑状态」与认知能力的对应，以及脑熵与功能连接的整合—分离关系；带动手块②③ 的结果。</p>
<p><strong>④ 11/9</strong>　讲清同一套范式换到抽动症、ADHD 后哪些量变了、哪些没变，以及多变量分类那条支线；提出自己的疑问与延伸方向。</p>
<p><strong>⑤ 11/23</strong>　验收：能否回答参数选择与出错来源一类的问题。</p>
<p style="margin-top: .8rem; color: var(--global-text-color-light); font-size: .93em;">两次汇报之间的疑问先记下来，下次一并带来。</p>
</div>
</details>

<details class="fold">
<summary>
  <span class="fold-h">材料与参考文献</span>
  <span class="fold-l">本组 6 篇 · 上游 6 篇 · 下游 3 篇</span>
</summary>
<div class="fold-body">

<h4>本组</h4>

<p>
  Xin, X., Long, S., Sun, M., &amp; Gao, X. (2021). The Application of Complexity Analysis in
  Brain Blood-Oxygen Signal. <em>Brain Sciences</em>, 11(11), 1415.
  <a href="https://doi.org/10.3390/brainsci11111415">10.3390/brainsci11111415</a>
</p>

<p>
  Xin, X., Feng, Y., Zang, Y., Lou, Y., Yao, K., &amp; Gao, X. (2022). Multivariate Classification
  of Brain Blood-Oxygen Signal Complexity for the Diagnosis of Children with Tourette Syndrome.
  <em>Molecular Neurobiology</em>, 59(2), 1249–1261.
  <a href="https://doi.org/10.1007/s12035-021-02707-0">10.1007/s12035-021-02707-0</a>
</p>

<p>
  Xin, X., Feng, Y., Lou, Y., Feng, J., &amp; Gao, X. (2023). Abnormal dynamics of brain functional
  networks in children with Tourette syndrome. <em>Journal of Psychiatric Research</em>, 159, 249–257.
  <a href="https://doi.org/10.1016/j.jpsychires.2023.01.046">10.1016/j.jpsychires.2023.01.046</a>
</p>

<p>
  Xin, X., Yu, J., &amp; Gao, X. (2024). The brain entropy dynamics in resting state.
  <em>Frontiers in Neuroscience</em>, 18, 1352409.
  <a href="https://doi.org/10.3389/fnins.2024.1352409">10.3389/fnins.2024.1352409</a>
</p>

<p>
  Xin, X., Gu, S., Wang, C., &amp; Gao, X. (2025). Abnormal brain entropy dynamics in ADHD.
  <em>Journal of Affective Disorders</em>, 369, 1099–1107.
  <a href="https://doi.org/10.1016/j.jad.2024.10.066">10.1016/j.jad.2024.10.066</a>
</p>

<p>
  Xin, X., Yu, J., Wang, C., &amp; Gao, X. (2026). The dynamic interplay between brain entropy and
  functional connectivity. <em>NeuroImage</em>, 332, 121919.
  <a href="https://doi.org/10.1016/j.neuroimage.2026.121919">10.1016/j.neuroimage.2026.121919</a>
</p>

<h4>上游（这条线所依赖的）</h4>

<p>
  Wang, Z., Li, Y., Childress, A. R., &amp; Detre, J. A. (2014). Brain Entropy Mapping Using fMRI.
  <em>PLoS ONE</em>, 9(3), e89948.
  <a href="https://doi.org/10.1371/journal.pone.0089948">10.1371/journal.pone.0089948</a>
</p>

<p>
  Hutchison, R. M., et al. (2013). Dynamic functional connectivity: Promise, issues, and
  interpretations. <em>NeuroImage</em>, 80, 360–378.
  <a href="https://doi.org/10.1016/j.neuroimage.2013.05.079">10.1016/j.neuroimage.2013.05.079</a>
</p>

<p>
  Allen, E. A., et al. (2014). Tracking Whole-Brain Connectivity Dynamics in the Resting State.
  <em>Cerebral Cortex</em>, 24(3), 663–676.
  <a href="https://doi.org/10.1093/cercor/bhs352">10.1093/cercor/bhs352</a>
</p>

<p>
  Hindriks, R., et al. (2016). Can sliding-window correlations reveal dynamic functional
  connectivity in resting-state fMRI? <em>NeuroImage</em>, 127, 242–256.
  <a href="https://doi.org/10.1016/j.neuroimage.2015.11.055">10.1016/j.neuroimage.2015.11.055</a>
</p>

<p>
  Lurie, D. J., et al. (2020). Questions and controversies in the study of time-varying functional
  connectivity in resting fMRI. <em>Network Neuroscience</em>, 4(1), 30–69.
  <a href="https://doi.org/10.1162/netn_a_00116">10.1162/netn_a_00116</a>
</p>

<p>
  Luppi, A. I. (2024). What anaesthesia reveals about human brains and consciousness.
  <em>Nature Human Behaviour</em>, 8, 1227–1228.
  <a href="https://doi.org/10.1038/s41562-024-01860-5">10.1038/s41562-024-01860-5</a>
</p>

<h4>下游（引用它的）</h4>

<p>
  Varley, T. F., Pope, M., Faskowitz, J., &amp; Sporns, O. (2023). Partial entropy decomposition
  reveals higher-order information structures in human brain activity. <em>PNAS</em>, 120(30),
  e2300888120.
  <a href="https://doi.org/10.1073/pnas.2300888120">10.1073/pnas.2300888120</a>
</p>

<p>
  Nozari, E., et al. (2023). Macroscopic resting-state brain dynamics are best described by linear
  models. <em>Nature Biomedical Engineering</em>, 8, 68–84.
  <a href="https://doi.org/10.1038/s41551-023-01117-y">10.1038/s41551-023-01117-y</a>
</p>

<p>
  Fagerholm, E. D., et al. (2023). A primer on entropy in neuroscience.
  <em>Neuroscience &amp; Biobehavioral Reviews</em>, 146, 105070.
  <a href="https://doi.org/10.1016/j.neubiorev.2023.105070">10.1016/j.neubiorev.2023.105070</a>
</p>

</div>
</details>
</div>
