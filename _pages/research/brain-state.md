---
layout: page
title: Brain-state toolkit
permalink: /research/brain-state/
nav: false
---

<a href="/research/consciousness/state/" style="font-size: .875rem; color: var(--global-theme-color);">← State</a>

<h1 style="margin-top: 1rem;">脑状态测量工具包</h1>

<p style="font-size: 1rem; line-height: 1.7; max-width: 52rem; color: var(--global-text-color);">
  通过多指标计算建模，开发基于静息态功能磁共振影像数据的脑状态测量工具包
</p>

<div style="margin-bottom: 1rem;">
  <span style="font-size: .72rem; background: #3d9970; color: #fff; padding: .15rem .5rem; border-radius: 12px;">Active</span>
  <span style="font-size: .82rem; color: var(--global-text-color-light); margin-left: .5rem;">前期学习与准备阶段</span>
</div>

## 要做什么

<p style="font-size: .92rem; line-height: 1.75; max-width: 52rem;">
  现有做法大多用某个单一指标给「脑状态」打分——某个网络的连接强度、某个熵值、某个复杂度。
  这些指标各自都有用，但测的其实是同一件事的不同侧面，而且很容易受扫描时长、头动、预处理选择的影响。
</p>

<p style="font-size: .92rem; line-height: 1.75; max-width: 52rem;">
  这个工具包想做的是：<strong>把多个指标放进一个计算模型里（多指标计算建模），让它们互相约束</strong>，
  从而得到一个对单一指标选择不那么敏感的脑状态读数。输入是静息态功能磁共振数据，输出是可比较的脑状态测量。
</p>

## 目前阶段

<p style="font-size: .92rem; line-height: 1.75; max-width: 52rem;">
  <strong>前期学习与准备。</strong>已经做完的是把参考工作与可用指标读清楚（下节）；
  接下来要做的是确定指标集合与建模路线，再用公开数据集（HCP 一类）先验证这套组合能不能稳定复现状态划分。
  这一步没有跑通之前，不会进入正式的数据分析。
</p>

## 参考工作

<p style="font-size: .92rem; line-height: 1.75; max-width: 52rem;">
  浙江大学 <strong>Xin &amp; Gao 的脑熵动态</strong>这条线，是目前最贴近「多指标、状态依赖」这个思路的工作。
  它用滑动窗口的脑熵（brain entropy）做聚类，得到了可重复出现的若干脑状态，并进一步刻画了这些状态与功能连接之间的耦合。
</p>

<p style="font-size: .88rem; line-height: 1.7; max-width: 52rem; color: var(--global-text-color-light);">
  ⚠️ 归属提醒：这条线的一作是 <strong>Xiaoyang Xin</strong>，高晓卿为通讯作者。
  高老师课题组的主线是视觉神经科学（面孔知觉、先天性白内障、脑可塑性），
  并不存在一个名为「脑状态测量」的独立项目——引用时按「Xin &amp; Gao 的脑熵动态工作」写，不要写成「高晓卿组的脑状态测量程序」。
</p>

<div style="max-width: 52rem; font-size: .87rem; line-height: 1.85;">

<p style="margin: 0 0 .7rem;">
  Xin, X., Yu, J., Wang, C., &amp; Gao, X. (2026). The dynamic interplay between brain entropy and
  functional connectivity. <em>NeuroImage</em>, 332, 121919.
  <a href="https://doi.org/10.1016/j.neuroimage.2026.121919">10.1016/j.neuroimage.2026.121919</a>
  <br><span style="color: var(--global-text-color-light); font-size: .82rem;">脑熵与功能连接的状态依赖耦合；图论的分离/整合跨熵状态变化 —— <strong>最贴工具包的一篇</strong></span>
</p>

<p style="margin: 0 0 .7rem;">
  Xin, X., Yu, J., &amp; Gao, X. (2024). The brain entropy dynamics in resting state.
  <em>Frontiers in Neuroscience</em>, 18, 1352409.
  <a href="https://doi.org/10.3389/fnins.2024.1352409">10.3389/fnins.2024.1352409</a>
  <br><span style="color: var(--global-text-color-light); font-size: .82rem;">滑动窗口脑熵 + k-means 得到 4 个可重复的脑状态；停留时间与认知灵活性、抑制控制、加工速度相关（HCP, N = 812）</span>
</p>

<p style="margin: 0 0 .7rem;">
  Xin, X., Feng, Y., Zang, Y., Lou, Y., Yao, K., &amp; Gao, X. (2022). Multivariate classification of
  brain blood-oxygen signal complexity for the diagnosis of children with Tourette syndrome.
  <em>Molecular Neurobiology</em>, 59(2), 1249–1261.
  <a href="https://doi.org/10.1007/s12035-021-02707-0">10.1007/s12035-021-02707-0</a>
  <br><span style="color: var(--global-text-color-light); font-size: .82rem;">多尺度熵 + 多变量搜索光分类（准确率 .94、AUC .95）—— 建模路线上的参照</span>
</p>

<p style="margin: 0;">
  Xin, X., Feng, Y., Lou, Y., Feng, J., &amp; Gao, X. (2023). Abnormal dynamics of brain functional
  networks in children with Tourette syndrome. <em>Journal of Psychiatric Research</em>, 159, 249–257.
  <a href="https://doi.org/10.1016/j.jpsychires.2023.01.046">10.1016/j.jpsychires.2023.01.046</a>
  <br><span style="color: var(--global-text-color-light); font-size: .82rem;">静息态下的时变功能网络状态</span>
</p>

</div>
