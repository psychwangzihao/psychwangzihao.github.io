# 感觉在哪里？ / Where Do Senses Live

於潜中学心理学科普讲座的交互式演示。13 个场景、53 个状态，
不是幻灯片 —— 每一幕是一个可以动手玩的小实验。

- 线上地址：<https://psychwangzihao.github.io/demos/perception/>
- 直接访问静态包：`/assets/demos/perception/`

**不需要任何外部素材**：校徽和院系标识已经打进 `media/`，其余全是代码画的
（SVG / Canvas），没有视频、没有二维码、没有需要打印的东西。

## 现场怎么用

开场是两扇合拢的浙大蓝幕布，中间一枚校徽 —— **点一下校徽开始上课**，
幕布向两侧滑开，露出标题。最后下课的时候幕布再合拢，回到同一枚校徽。

| 按键 | 作用 |
|---|---|
| `→` / `空格` / `Enter` | 下一状态（也支持点击屏幕空白处；盲点、贴标签两幕除外） |
| `←` | 上一状态 |
| `↑` / `↓` | 上一 / 下一场景 |
| `1`–`9` | 跳到第 1–9 个场景 |
| `0` | 跳到「收束」那一幕 |
| `Home` | 回到开场 |
| `B` | 黑屏（临时遮挡，再按恢复） |
| `F` | 全屏 |
| `D` | 调试面板（也可以直接用 `?debug=1` 打开） |
| `?` | 显示快捷键提示 |
| `R` | 只在「树倒悖论」那一幕有效：清空举手票数 |

鼠标移到屏幕底部会浮出场景圆点，可以直接跳场景；3 秒不动会自动隐藏。

链接可以带参数直接跳到某处，方便排练：

```
index.html?scene=blindspot&state=2
index.html?scene=eeg
index.html?debug=1
```

## 场景一览

| # | id | 场景 | 状态数 | 备注 |
|---|---|---|---|---|
| 0 | `title` | 开场（校徽幕布） | 2 | 点校徽开始 |
| 1 | `illusion` | 闪烁网格 | 2 | 冷开场，全场先看自己的眼睛骗自己 |
| 2 | `tree` | 树倒悖论 | 4 | 举手投票，票数会存下来 |
| 3 | `blindspot` | 盲点测试 | 4 | 见下方「后排怎么办」 |
| 4 | `brain` | 大脑模型 | 5 | 贴标签 + 幻肢痛 + 平衡觉 |
| 5 | `aphantasia` | 心盲症与想象 | 5 | 举手 → 对比 |
| 6 | `stratton` | 斯特拉顿眼镜 | 7 | 先猜一猜 → 画面真的会颠倒 |
| 7 | `eagleman` | Eagleman 背心 | 7 | 先猜一猜 → 波形驱动背心 |
| 8 | `eeg` | 脑电波演示 | 6 | 暗色场景 |
| 9 | `bci` | 脑机接口 | 3 | 四种接口并排一屏 |
| 10 | `closing` | 收束 | 3 | |
| 11 | `awe` | 回响（回到那棵树） | 4 | |
| 12 | `curtain` | 下课（幕布合拢） | 1 | 全场结束 |

### 时间不够时砍哪几幕

必讲：`title` → `illusion` → `tree` → `blindspot` → `aphantasia` →
`stratton` → `eeg` → `closing` → `awe` → `curtain`（约 35 分钟）

可跳：`brain`（只放 `brain.0` 给大家看一眼那张图；`brain.3` 的平衡觉活动
也可以跳）、`eagleman`、`bci`（只放 `bci.0` 和 `bci.2`）。
两个「先猜一猜」（`stratton.0`、`eagleman.0`）各只要 20 秒，
但如果时间紧，直接按 → 两次就能越过（第一次揭晓、第二次翻页）。

### 几处需要留意的地方

- **`tree.0` 真的投一次票**（点按钮计数）。第 11 幕 `awe.0` 会把票数原样搬回来
  对照开场；没投过它会自动换成一句「开场时我们举过手」，不会显示 0 票。
- **`aphantasia.0 → 1`** 是「闭眼想象 → 睁眼举手」。举完手环顾全场的那一下
  是这一幕的重点，别急着按下一张。
- **`brain.3`** 会让全场站起来单脚站 10 秒。前面连着三幕都在坐着听，这里换口气。
- **`illusion` 是冷开场，别跳过。** 全班先亲眼看一次「自己的眼睛在骗自己」，
  后面所有道理才有落点。这一屏对投影的对比度有要求 —— 黑要够黑、白要够白；
  如果现场投影发灰、闪烁效应出不来，就直说「有人看到了、有人没看到」，
  那本身也是这句台词的一部分。`eeg.4` 会把这句接回来。
- **`blindspot` 后排怎么办**：投影仪上这个实验对后排是无效的（离屏幕太远，
  两点间距需要拉到一米以上）。所以那一幕额外给了「用自己两根拇指做」的做法
  （`#bsHands` 那张卡），全场都能做，不依赖屏幕。
- **`closing` 原来那一屏「求索卡」已经去掉**（要印卡片 + 两个二维码）。
  「有问题，来教室外面找我」这句挪到了第 12 幕的幕布上。

## 文件结构

```
index.html          外壳：舞台、进度条、导航圆点、黑屏层、调试面板
style.css           设计系统（色彩/字号/间距/圆角/阴影/动效 token + 通用组件）
icons.js            线性图标集（ICON.sun('ico lg c-blue') 这样用）
core.js             场景注册、状态机、导航、键盘、URL 同步
door.js             开场的校徽幕布 / 收场的合幕
quiz.js             「先猜一猜」组件（QUIZ.html + QUIZ.mount）
media/              校徽、院系标识（webp + png 双份）
s00_title.js …      每个场景一个文件，各自注册进 PERCEPTION
```
文件名的编号只是标签，**真正的顺序由 `index.html` 里 `<script>` 的先后决定**。

## 怎么加一个新场景

1. 写 `s13_xxx.js`（照抄 `s01_tree.js` 的结构）：

```js
PERCEPTION.css('scene-xxx', `/* 这个场景专属的 CSS */`);

PERCEPTION.scene({
  id: 'xxx',
  label: '场景名',
  noClick: false,      // true = 禁止「点空白处前进」
  dark: false,         // true = 暗色背景（也可以给状态元素加 data-dark）
  states: [
    function (ctx) {
      ctx.set(`<h1 class="hero anim">你好</h1>`);
      ctx.after(2000, () => ctx.next());
    },
  ],
});
```

2. 在 `index.html` 里加一行 `<script src="./s13_xxx.js"></script>`（顺序就是场景顺序）。

`ctx` 提供 `set / add / q / qa / on / each / raf / frame / after / every / soon /
wordby / stagger / autoNext / holdNext / next / prev / goto / toast`，
**所有监听器、定时器、动画帧都会在切换场景时自动清理**，
所以来回跳不会泄漏。详细说明见 `core.js` 顶部的注释。

### ⚠️ 场景 CSS 是全局的 —— 新类的名字一定要带场景前缀

`PERCEPTION.css()` 把样式注入到 `<head>`，**不是** scoped 的。
所以两个场景里如果出现同名类，样式会互相污染。
真实踩过的坑：曾经有个场景的播放三角用了 `.tri`，而树倒场景里的
「三张卡片一行」也叫 `.tri`（带 `padding: 1vw 2vw`）——
结果播放三角被撑到 0 宽，整个按钮变成一个纯白圆点，排查了很久。
（那个场景后来删了，但坑还在。）

规则：**每个场景自己的类名，一律加场景前缀**（`.mp-play`、`.tag-ghost`、
`.cl-…`、`.aw-…`），只有在明确要复用设计系统里的通用类时才用裸名
（`.card`、`.btn`、`.pill`、`.anim`）。改完可以用下面这段快速查重名：

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

入口页 `_pages/perception.html` 是一条跳转，把 `/demos/perception/` 指到
`/assets/demos/perception/`。用 `python3 ~/deploy.py pp` 部署（GFW 环境下
git push 不通）。**注意 deploy.py 会跳过 ≥5 MB 的文件。**

## 技术说明

- 纯原生 JS，无依赖、无构建、无 CDN，离线可用。
- 字体走系统栈（PingFang SC / 微软雅黑 / Noto Sans SC）。
- **大脑用的是 Gray's Anatomy 的矢量线稿**，不是画出来的：
  公有领域（PD Mark 1.0），原图是 1918 年 Gray 解剖学第 728 图，
  由 Wikimedia Commons 用户 Mysid 矢量化。数据放在 `brain-art.js`，
  几何一点没改，只做了两件事：把原图的四色分区改成透明的可点击脑叶、
  把线条上色成 `--brain-ink`。
  **为什么不再自己画**：我先后试过四轮程序生成脑回 ——
  一排行波（像等高线/木纹）、沿方向场积分的流线（频率低是顺毛、
  频率高是树根）、等值线配 6 条正弦（围着峰绕成同心环，又变回等高线）、
  等值线配 18 条宽带正弦（最接近，但还是「像」而不是「是」）。
  手绘解剖图生成不出来，这条路一开始就不该走。
- 脑叶做成**透明的可点击区域**（`pointer-events:all`，因为 `fill:none`
  的元素默认不接指针），画在线稿**下面** —— 于是高亮时蓝色是
  「从褶皱下面透出来」的，而不是盖上去一块贴纸。
- 两个图上没有、但讲稿要用的区域是补出来的：**前额叶**用 `clipPath`
  把额叶切一刀（裁剪，不是重画）；**边缘叶**是内侧面结构、外侧观看不见，
  用虚线 C 带表示 —— 原图本来就用虚线画被遮住的部位，是同一套语言。
  顺便还能讲一句「情绪的核心结构在大脑内侧面，从外面看不见」。

## 自测

改完之后跑一遍全量体检（仓库里没有，脚本在 `/tmp`，需要时重建）：
遍历所有场景 × 状态、四种投影分辨率查溢出、截图、收集 console 异常，
外加「一路倒着按 ←」「连按 60 次 →」「直接跳进每个场景的末状态」三项压力测试。

**注意**：`goto()` 有 300 ms 防抖，测试里跳转后 **至少等 400 ms**，
否则一半跳转会被静默吞掉，读到的是上一个状态的数据，看起来像不存在的 bug。
（我自己就因为这个「发现」过一个根本不存在的暗色配色 bug。）

### 想加更多「先猜一猜」

`quiz.js` 是个通用组件，加一屏只要两步：

```js
function (ctx) {
  ctx.set(QUIZ.html({
    q: '问题',
    options: ['选项一', '选项二', '选项三'],
    answer: 1,                 // 哪一个是「结果」，会打勾
    note: '揭晓之后补一句。'
  }));
  QUIZ.mount(ctx, { answer: 1 });
}
```

`ctx.holdNext()` 是配套的机制：讲者如果没点选项、直接按 →，
第一次只揭晓、不翻页；再按才走。这一条对现场很重要 ——
否则一紧张按快了，答案还没出来就翻过去了。
