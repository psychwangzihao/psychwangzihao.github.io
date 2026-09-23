---
layout: rpage
title: 脑状态测量工具包
permalink: /research/brain-state/
nav: false
rnode: brainstate
---

<style>
  /* 这一页只放三段：我要做什么 / 我已经做了什么 / 我现在正在做什么。
     组会投影打开就是一屏，不需要滚动。 */
  .bs-meta {
    display: flex; flex-wrap: wrap; align-items: baseline;
    gap: .3rem 1rem; max-width: 56rem; margin: 0 0 .35rem;
  }
  .bs-meta .bs-desc {
    font-size: 1rem; line-height: 1.55; margin: 0;
    color: var(--global-text-color);
  }
  .bs-meta .bs-tag {
    font-size: .72rem; background: #3d9970; color: #fff;
    padding: .15rem .5rem; border-radius: 12px; white-space: nowrap;
  }
  .r-body h2 { margin: .55em 0 .22em; }
  .bs-note {
    font-size: .95rem; line-height: 1.7; max-width: 58rem; margin: 0 0 .4rem;
  }
  .bs-note:last-child { margin-bottom: 0; }
  .bs-dir {
    font-size: .9rem; line-height: 1.7; max-width: 58rem;
    color: var(--global-text-color-light); margin: .55rem 0 0;
  }
  /* 第三段：第一阶段的 6 篇核心文章。排成 3 行 × 2 列 —— 单列六行
     会多占一整屏的高度，双列正好装下。 */
  .bs-read {
    width: 100%; max-width: 66rem; border-collapse: collapse; font-size: .85rem;
  }
  .bs-read td {
    width: 50%; padding: .17rem .6rem .17rem 0; vertical-align: top;
    border-bottom: 1px solid var(--global-divider-color); line-height: 1.35;
  }
  .bs-read tr:last-child td { border-bottom: 0; }
  .bs-read .rd-n {
    display: inline-block; width: 1.15rem; text-align: center;
    color: var(--global-text-color-light); font-size: .8rem; font-weight: 400;
    font-family: var(--font-mono, monospace);
  }
  .bs-read .rd-y {
    display: inline-block; width: 3.4rem; margin-right: .15rem;
    font-weight: 600; font-family: var(--font-mono, monospace); font-size: .82rem;
  }
  .bs-read .rd-w { color: var(--global-text-color-light); }
  .bs-ddl {
    display: inline-block; font-size: .72rem; font-family: var(--font-mono, monospace);
    background: #d97a00; color: #fff; padding: .15rem .55rem;
    border-radius: 12px; margin-left: .6rem; vertical-align: middle;
  }
</style>

<a href="/research/consciousness/state/" style="display: inline-block; font-size: .875rem; line-height: 1.25; margin: 0 0 .2rem; color: var(--global-theme-color);">← State</a>

<div class="bs-meta" style="margin-top: .55rem;">
  <p class="bs-desc">通过多指标计算建模，开发基于静息态功能磁共振影像数据的脑状态测量工具包</p>
  <span class="bs-tag">Active · In prep</span>
</div>

<h2>我要做什么</h2>

<p class="bs-note">
  <strong>11 月 25 日前，在思想与实操上 follow up 上高晓卿老师课题组脑状态研究的水准。</strong>
</p>

<ul class="bs-note">
  <li><strong>思想</strong>：完整理解该组已发表的脑状态工作，讲得清每条结论怎么来的、边界在哪。</li>
  <li><strong>实操</strong>：独立跑通同一套分析——滑窗构造动态指标、聚类得到脑状态、计算状态动态量。</li>
</ul>

<p class="bs-dir">
  大方向：滑窗构造动态脑熵 → k-means 聚出重现任脑状态 → 用出现率与驻留时间刻画个体差异。11/25 收口，之后接该组前沿工作。
</p>

<h2>我已经做了什么</h2>

<p class="bs-note">
  与高老师初步讨论，明确了学习目标——即在思想与实操上 follow up 上该组脑状态研究的水准。
</p>

<h2>我现在正在做什么<span class="bs-ddl">ddl 10/12</span></h2>

<p class="bs-note" style="margin-bottom: .3rem;">
  第一阶段读高老师指定的 6 篇核心文章——该组脑状态这条线的全部正式产出。按方法长出来的顺序读：
</p>

<table class="bs-read">
  <tbody>
    <tr>
      <td><b class="rd-n">1</b><b class="rd-y">2021</b>BOLD 信号复杂度分析综述<span class="rd-w">— 方法学总纲</span></td>
      <td><b class="rd-n">4</b><b class="rd-y">2024</b>静息态脑熵动态<span class="rd-w">— 范式奠基 ★</span></td>
    </tr>
    <tr>
      <td><b class="rd-n">2</b><b class="rd-y">2022</b>抽动症复杂度多变量分类<span class="rd-w">— 把复杂度做成判别器</span></td>
      <td><b class="rd-n">5</b><b class="rd-y">2025</b>ADHD 脑熵动态异常<span class="rd-w">— 同一范式换病种</span></td>
    </tr>
    <tr>
      <td><b class="rd-n">3</b><b class="rd-y">2023</b>抽动症脑功能网络动态异常<span class="rd-w">— 转向动态</span></td>
      <td><b class="rd-n">6</b><b class="rd-y">2026</b>脑熵与功能连接的动态互作<span class="rd-w">— 集大成 ★</span></td>
    </tr>
  </tbody>
</table>

<p class="bs-dir" style="margin-top: .5rem;">
  10/12 要做到的：按这个顺序把 6 篇串成一个故事——每一篇解决了前一篇留下的什么问题。
</p>
