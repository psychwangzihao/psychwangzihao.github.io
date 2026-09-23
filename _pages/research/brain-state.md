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
    gap: .3rem 1rem; max-width: 56rem; margin: 0 0 .5rem;
  }
  .bs-meta .bs-desc {
    font-size: 1rem; line-height: 1.55; margin: 0;
    color: var(--global-text-color);
  }
  .bs-meta .bs-tag {
    font-size: .72rem; background: #3d9970; color: #fff;
    padding: .15rem .5rem; border-radius: 12px; white-space: nowrap;
  }
  .r-body h2 { margin: .8em 0 .35em; }
  .bs-note {
    font-size: .95rem; line-height: 1.7; max-width: 58rem; margin: 0 0 .4rem;
  }
  .bs-note:last-child { margin-bottom: 0; }
  .bs-dir {
    font-size: .9rem; line-height: 1.7; max-width: 58rem;
    color: var(--global-text-color-light); margin: .55rem 0 0;
  }
  /* 第三段：正在做的事还没定，用虚线框留位 */
  .bs-now {
    border: 2px dashed rgba(128, 128, 128, .48);
    border-radius: 8px; padding: 1rem 1.15rem;
    max-width: 58rem; margin-top: .2rem;
    color: var(--global-text-color-light);
    font-size: .95rem; line-height: 1.7;
  }
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
  大方向：该组这条线一共 6 篇，方法一脉相承——滑窗构造动态脑熵，再用 k-means 聚出可重复的脑状态，
  最后用状态的出现率与驻留时间刻画个体差异。核心是 2024 与 2026 两篇，其余四篇是同一套范式换病种、换指标。
  11 月 25 日收口，11 月 29 日之后接该组的前沿工作。
</p>

<h2>我已经做了什么</h2>

<p class="bs-note">
  与高老师初步讨论，明确了学习目标——即在思想与实操上 follow up 上该组脑状态研究的水准。
</p>

<h2>我现在正在做什么<span class="bs-ddl">ddl 10/12</span></h2>

<div class="bs-now">
  待高老师回复后填写。
</div>
