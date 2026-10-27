/* ============================================================
 * 场景：心在哪里  (id: mind · 5 个状态)
 * 位置：心盲之后、大脑之前。
 *
 * 这一幕是全场的一个枢纽：前面三幕已经让观众相信「世界在我心中」，
 * 这里把问题收成一句话 —— 那个在感受、在想象、在决定的东西，
 * 到底在哪里？然后从科学史的角度给出答案。
 *
 * 内容取自作者 2050 大会的讲稿《心在哪里》：
 * 从「心脏中心说」到「脑中心说」的转变，是科学史上的一次真正的进步 ——
 * 而推动这次进步的，不是更聪明的思辨，是**数据**。
 * 这一点正好是整场讲座的论点，所以放在这里最合适。
 * ============================================================ */
PERCEPTION.scene({
  id: 'mind',
  label: '心在哪里',
  states: [

    /* ---- 0：顺着日常语言发问 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl" style="max-width:72vw">
          <h1 class="title center anim" style="--d:0s">
            我们都说「<b class="c-pink">心里</b>想」、「<b class="c-pink">心里</b>难受」。
          </h1>

          <h1 class="hero center anim" style="--d:1s">
            可是，「心」在哪里呢？
          </h1>
        </div>
      `);
    },

    /* ---- 1：心脏中心说 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="max-width:74vw">
          <h1 class="title center anim" style="--d:0s">
            在历史上很长一段时间里，人们相信：
          </h1>

          <h1 class="hero center anim" style="--d:.9s;color:var(--accent-pink)">
            人是用心脏思考的。
          </h1>

          <p class="body center muted anim fade" style="--d:1.6s;max-width:64vw">
            它的依据是：思考会发热，心脏把滚烫的血送到大脑 ——
            大脑表面的褶皱其实是<b>散热片</b>，
            让血冷却之后再流回心脏。
          </p>
        </div>
      `);
    },

    /* ---- 2：这套说法为什么有说服力 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="max-width:72vw">
          <h1 class="title center anim" style="--d:0s">
            这套理论完美自洽，而且符合日常经验。
          </h1>

          <div class="card tight anim" style="--d:.8s;background:var(--accent-pink-light);text-align:left;max-width:56vw">
            <div class="body">紧张的时候，心跳会加速。</div>
          </div>

          <div class="step card tight" style="background:var(--accent-pink-light);text-align:left;max-width:56vw">
            <div class="body">伤心的时候，胸口会发闷。</div>
          </div>

          <div class="step card tight" style="background:var(--accent-pink-light);text-align:left;max-width:56vw">
            <div class="body">
              人要是没了心脏 —— 还有感觉吗？还有情感吗？还有意识吗？<br>
              全都没有了。
            </div>
          </div>

          <p class="step body center muted" style="max-width:56vw">
            它解释得通，也符合直觉 —— 因此统治了两千多年。
          </p>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 3：反驳 —— 靠的不是更聪明的思辨，是数据 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="max-width:74vw">
          <div class="title center anim" style="--d:0s">
            来看两组数据。
          </div>

          <div class="card tight anim" style="--d:.7s;background:var(--accent-blue-light);text-align:left;max-width:60vw">
            <div class="body">
              人在思考的时候，<b>心脏的放电几乎没有变化</b>；
              大脑的活动却天差地别。反过来，用某些手段抑制大脑某一处的放电，
              人的某种感觉会立刻被改写。
            </div>
          </div>

          <div class="step card tight" style="background:var(--accent-blue-light);text-align:left;max-width:60vw">
            <div class="body">
              再看阿尔茨海默病患者：他们的<b>心脏和同龄人几乎没有差别</b>，
              可大脑里出现了大量空洞 —— 那些空洞所在的地方，
              原本可能就是他们的记忆。
            </div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 4：转折：心理学凭什么独立出来 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg" style="max-width:74vw">
          <div class="title center anim" style="--d:0s">
            心理学能从哲学里独立出来，靠的正是这一点：
          </div>

          <div class="title center anim" style="--d:.9s;color:var(--accent-blue)">
            它不再只跟「日常经验」讲道理，<br>而是跟<b>数据</b>讲道理。
          </div>

          <p class="step body center muted" style="max-width:60vw">
            否则，我们会永远困在那套「散热片」的完美逻辑里 ——
            它那么自洽，那么符合直觉，却完全是错的。
          </p>

          <div class="step subtitle center" style="color:var(--accent-purple)">
            下面，我们来看看这颗大脑。
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
