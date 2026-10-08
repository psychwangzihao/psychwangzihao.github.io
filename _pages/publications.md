---
layout: page
permalink: /publications/
title: publications
description: Peer-reviewed publications and preprints.
# 还没有正式产出，先不挂到导航上 —— 一个空页面挂在导航里比没有更难解释。
# 有了第一篇文章，把 nav 改回 true 即可。
nav: false
nav_order: 4
---

<!-- 加了第一篇论文之后：删掉下面这一段占位文字，并把 front matter 的 nav 改成 true -->

<p class="pub-empty">
  Nothing here yet. The first manuscript is in preparation; this page fills in
  as it is submitted.
</p>

{% include bib_search.liquid %}

<div class="publications">
  {% bibliography %}
</div>
