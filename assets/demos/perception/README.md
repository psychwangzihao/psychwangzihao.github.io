# 感觉在哪里？ / Where Do Senses Live

於潜中学心理学科普讲座的交互式演示。12 个场景、53 个状态，
不是幻灯片 —— 每一幕是一个可以动手玩的小实验。

- 线上地址：<https://psychwangzihao.github.io/demos/perception/>
- 直接访问静态包：`/assets/demos/perception/`

## 现场怎么用

| 按键 | 作用 |
|---|---|
| `→` / `空格` / `Enter` | 下一状态（也支持点击屏幕空白处；盲点/McGurk/贴标签三幕除外） |
| `←` | 上一状态 |
| `↑` / `↓` | 上一 / 下一场景 |
| `1`–`9` | 跳到第 1–9 个场景 |
| `0` | 跳到第 10 个场景 |
| `Home` | 回到标题 |
| `B` | 黑屏（临时遮挡，再按恢复） |
| `F` | 全屏 |
| `D` | 调试面板（也可以直接用 `?debug=1` 打开） |
| `?` | 显示快捷键提示 |

鼠标移到屏幕底部会浮出场景圆点，可以直接跳场景；3 秒不动会自动隐藏。

链接可以带参数直接跳到某处，方便排练：

```
index.html?scene=blindspot&state=2
index.html?scene=eeg
index.html?debug=1
```

## 场景一览

| # | id | 场景 | 状态数 |
|---|---|---|---|
| 0 | `title` | 标题 | 1 |
| 1 | `tree` | 树倒悖论 | 4 |
| 2 | `blindspot` | 盲点测试 | 4 |
| 3 | `mcgurk` | McGurk 效应 | 4 |
| 4 | `brain` | 大脑模型 | 4 |
| 5 | `aphantasia` | 心盲症与想象 | 4 |
| 6 | `stratton` | 斯特拉顿眼镜 | 6 |
| 7 | `eagleman` | Eagleman 背心 | 6 |
| 8 | `eeg` | 脑电波演示 | 6 |
| 9 | `bci` | 脑机接口 | 6 |
| 10 | `closing` | 收束与求索卡 | 4 |
| 11 | `awe` | 回响（回到那棵树 / 保持敬畏） | 4 |

> 第 11 幕是全场的落点：回到开场那棵树，说清楚「这道题的答案是**不知道**」——
> 我们判断别的东西有没有心灵，靠的只是「它像不像我」。最后停在两个问句上：
> **砍树的时候，树会痛吗？小鸟也有意识吗？**
> 文案的落点两句按你自己的语气改就行，都在 `s11_awe.js` 里。

**排练小抄**：`11.0` 会把开场那一幕（`1.0`）的举手票数原样搬回来对照 ——
所以讲的时候记得在第 1 幕真投一下（点按钮计数），第 11 幕才有东西可比。
没投的话它会自动换成一句「开场时我们举过手」，不会显示 0 票。

## 需要你自己补的两个东西

见 [`media/README.md`](media/README.md)：McGurk 视频，以及两个二维码。

## 文件结构

```
index.html          外壳：舞台、进度条、导航圆点、黑屏层、调试面板
style.css           设计系统（色彩/字号/间距/圆角/阴影/动效 token + 通用组件）
icons.js            线性图标集（ICON.sun('ico lg c-blue') 这样用）
core.js             场景注册、状态机、导航、键盘、URL 同步
s00_title.js …      每个场景一个文件，各自注册进 PERCEPTION
```

## 怎么加一个新场景

1. 写 `s11_xxx.js`（照抄 `s01_tree.js` 的结构）：

```js
PERCEPTION.css('scene-xxx', `/* 这个场景专属的 CSS */`);

PERCEPTION.scene({
  id: 'xxx',
  label: '场景名',
  noClick: false,      // true = 禁止「点空白处前进」
  dark: false,         // true = 暗色背景
  states: [
    function (ctx) {
      ctx.set(`<h1 class="hero anim">你好</h1>`);
      ctx.after(2000, () => ctx.next());
    },
  ],
});
```

2. 在 `index.html` 里加一行 `<script src="./s11_xxx.js"></script>`（顺序就是场景顺序）。

`ctx` 提供 `set / q / qa / on / each / raf / frame / after / every / soon /
wordby / stagger / autoNext / next / prev / goto / toast`，
**所有监听器、定时器、动画帧都会在切换场景时自动清理**，
所以来回跳不会泄漏。详细说明见 `core.js` 顶部的注释。

### ⚠️ 场景 CSS 是全局的 —— 新类的名字一定要带场景前缀

`PERCEPTION.css()` 把样式注入到 `<head>`，**不是** scoped 的。
所以两个场景里如果出现同名类，样式会互相污染。
真实踩过的坑：McGurk 场景的播放三角用了 `.tri`，而树倒场景里的
「三张卡片一行」也叫 `.tri`（带 `padding: 1vw 2vw`）——
结果播放三角被撑到 0 宽，整个按钮变成一个纯白圆点，排查了很久。

规则：**每个场景自己的类名，一律加场景前缀**（`.mp-play`、`.tag-ghost`、
`.cl-…`），只有在明确要复用设计系统里的通用类时才用裸名（`.card`、`.btn`、
`.pill`、`.anim`）。改完可以用下面这段快速查重名：

```bash
cd assets/demos/perception && python3 - <<'PY'
import re, glob, collections
pat = re.compile(r"PERCEPTION\.css\(\s*'([^']+)'\s*,\s*`(.*?)`\s*\)", re.S)
owner = collections.defaultdict(set)
for f in sorted(glob.glob('s*.js')):
    m = pat.search(open(f).read())
    css = re.sub(r'/\*.*?\*/', '', m.group(2), flags=re.S)
    for cls in re.findall(r'\.([a-zA-Z][\w-]*)', css):
        owner[cls].add(m.group(1))
for c, k in sorted(owner.items()):
    if len(k) > 1: print(f'.{c}  <-  {", ".join(sorted(k))}')
PY
```

（重名不一定是错——`.card`、`.ico`、`.on` 这类复用是故意的。
要看的是「某个场景新造了一个通用名的类」。）

## 部署

本站是 al-folio（Jekyll），这个演示是一坨纯静态文件，
所以只要 `assets/demos/perception/` 传上去就能跑，不需要 Jekyll 处理、不需要构建。

入口页 `_pages/perception.html` 是一条跳转，把 `/demos/perception/` 指到 `/assets/demos/perception/`。

用 `python3 ~/deploy.py pp` 部署（GFW 环境下 git push 不通）。
注意 deploy.py 会跳过 ≥5 MB 的文件 —— 所以 McGurk 视频要压在 5 MB 以内。

## 技术说明

- 纯原生 JS，无依赖、无构建、无 CDN，离线可用。
- 字体走系统栈（PingFang SC / 微软雅黑 / Noto Sans SC）。
- 3D 大脑改成了手绘 SVG 侧视图 —— 原设计写的是 Three.js + GLB，
  但那个方案需要外部依赖和模型文件，和「无依赖、离线可用」冲突。
