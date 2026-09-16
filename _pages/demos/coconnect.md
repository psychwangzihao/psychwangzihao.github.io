---
layout: page
title: COCOnnect
permalink: /demos/coconnect/
nav: false
---

<a href="/demos/" style="font-size: 0.9rem; color: var(--global-theme-color);">← 回到 demos</a>

<div style="margin-bottom: 0.5rem; margin-top: 1rem;">
  <span style="font-size: 0.75rem; background: #d97a00; color: #fff; padding: 0.15rem 0.5rem; border-radius: 12px;">Active</span>
  <span style="font-size: 0.85rem; color: var(--global-text-color-light); margin-left: 0.5rem;">Reading &amp; Language</span>
</div>

**联系**：<a href="mailto:psychwangzihao@zju.edu.cn">Zihao Wang</a><br>
**图片素材**：<a href="https://cocodataset.org/">MS COCO 2017</a>（公开数据集）<br>
**界面语言**：中文（Y / N / D 三选作答）<br>

<div style="margin: 1.2rem 0;">
  <a href="/assets/demos/coconnect/" style="display: inline-block; padding: 0.65rem 1.8rem; font-size: 0.95rem; font-weight: 600; background: #d97a00; color: #fff; border-radius: 7px; text-decoration: none;">开始实验 →</a>
  <span style="font-size: 0.82rem; color: var(--global-text-color-light); margin-left: 0.6rem;">全部在浏览器里跑 · 数据在本地下载</span>
</div>

---

## 这是做什么的

屏幕上先出现一张自然场景的照片，接着出现一段中文描述。你要判断的是：**这段话说的东西，在不在图里。**

- 在 —— 哪怕只描述了图的一部分 —— 按 **Y**（或 **1**）
- 图里没有它说的东西 —— 按 **N**（或 **2**）
- 读不下来 —— 按 **D**（或 **3**）。读不了就选 D，不要硬猜

描述长度从 **1 个字逐级加到 10 个字**，共 10 级，每级 10 个试次。
某一级的前 5 个试次如果全对，说明它对你太容易，直接进入下一级。

## 问的是什么

**一个人读到多长就读不下去了？** 阅读困难在临床上很难量化：说一个人「读得慢」，
既没有刻度，也无法比较。以文字长度为自变量逐级递增，就可以画出**一条曲线** ——
正确率从哪一个字长处开始下降。这条曲线就是这个人阅读能力的刻度。

节律辅助是第二个自变量。**4 / 2 / 1 / 0.5 Hz 的节拍**在图片出现的那一刻起拍，
用固定的节奏为阅读提供一个外部的时间骨架。要问的是：一个稳定的节拍，
能否抬高这条曲线、或把它推后？也就是说，节律能否代偿一部分阅读能力。

这个实验已在浙江大学心理与行为科学系的实验室完成（PsychoPy 版）。
网页版与它共用同一份配置：试次顺序、快速晋级、休息页、注视时长、
图片尺寸与位置、字号、反应时限、按键，逐条一致。

## 五个条件

开始前任选一个。**无辅助**是基准；另外四个是节律辅助，频率不同。

| 条件 | 节拍 |
|---|---|
| 无辅助 | 没有节拍，按自己的节奏读 |
| 4 Hz | 每 250 毫秒一拍，接近自然朗读的字率 |
| 2 Hz | 每 500 毫秒一拍 |
| 1 Hz | 每秒一拍 |
| 0.5 Hz | 每两秒一拍 |

选有节拍的条件时，先调音量到合适的大小，再静默 10 秒才开始正式试次 ——
连续的滴答声需要一点时间从耳朵里消退，否则会带进试次。

## 一次大概多久

无辅助组通常 5 分钟左右，取决于你在哪一级开始出错；一路全对只需 50 个试次。
全程随时可按 **Esc** 退出，**已经做过的部分会保留**。

## 数据

做完后下载一个 CSV，字段与实验室版逐列一致：被试、条件、试次序号、等级、文字、
图片编号、正确答案、是否快速晋级、音量、反应、正确与否、反应时。

**数据只存在你自己的电脑上。** 这个页面没有服务器，不上传任何东西；
按 Esc 或刷新页面会丢掉尚未下载的数据，请做完后及时下载。

## 与实验室版的差别

- 实验室版用命令行参数选条件（`--task unassisted / rhythm4 / …`），网页版在开始页选
- 实验室版的音量测试另存为 `audio_settings_<被试>.csv`，网页版记在每行的 `volume` 列里
- 其余部分（试次顺序、快速晋级、休息页、注视时长、图片尺寸与位置、字号、
  反应时限、按键）都取自同一份配置，可逐条对照

## 状态

**Active。** 网页版与实验室版并行维护，源文件在同一处。
