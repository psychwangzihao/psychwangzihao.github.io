---
layout: page
title: COCOnnect
permalink: /playground/coconnect/
nav: false
---

<a href="/playground/" style="font-size: 0.9rem; color: var(--global-theme-color);">← Back to Playground</a>

<div style="margin-bottom: 0.5rem; margin-top: 1rem;">
  <span style="font-size: 0.75rem; background: #d9a400; color: #fff; padding: 0.15rem 0.5rem; border-radius: 12px;">In development</span>
  <span style="font-size: 0.85rem; color: var(--global-text-color-light); margin-left: 0.5rem;">Reading & Language</span>
</div>

**Project Contact:** <a href="mailto:psychwangzihao@zju.edu.cn">Zihao Wang</a><br>
**Built on:** <a href="https://cocodataset.org/">MS COCO 2017</a> (public dataset)<br>
**Interface language:** Chinese (Y/N responses)<br>

<div style="margin: 1.2rem 0;">
  <span style="font-size: 0.82rem; color: var(--global-text-color-light);">An interactive browser version is in development and will be published on this page when ready.</span>
</div>

---

## About

COCOnnect is a picture–text matching experiment. Each trial shows a natural-scene image (for example a kitchen, a street, or a park), followed by a short Chinese description. The task is simply to judge whether the description matches the image — press **Yes** or **No**.

## Paradigm

A trial runs as follows:

1. A natural-scene image is presented briefly.
2. A Chinese sentence describing (or deliberately mismatching) the scene is shown.
3. The participant responds **Yes** (match) or **No** (mismatch).
4. The next trial begins.

## Key manipulation

The descriptions vary in length from **1 to 40 Chinese characters**, arranged across **19 discrete length levels (L1–L19)**. This systematic variation makes it possible to measure how reading accuracy changes as the amount of to-be-read text grows.

## Research questions

- How does silent-reading / reading-comprehension accuracy scale with text length?
- Does rhythmic auditory support — a metronome pacing the reading — change the shape of that accuracy-by-length curve?

## Stimuli

Images are drawn from the **Microsoft COCO 2017** dataset, a large, publicly available collection widely used for object recognition and scene understanding. The stimulus text is written in Chinese.

## Status

**In development.** The experiment is built with PsychoPy and is currently being validated. When ready, an interactive version will run entirely in the browser — no server, no account — and participants will be able to download their own results locally (CSV/JSON). No personal information is collected.
