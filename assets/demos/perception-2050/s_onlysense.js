/* ============================================================
 * 场景：只拥有感  (id: onlysense · 3 个状态)
 *
 * 「我们知道什么」这一节的开头。屏幕上只放词，判断留给讲者。
 *
 * 3.1 那两句必须**同时在场** —— 分两屏就把「同时」讲丢了。
 * 3.2 是全篇唯一一处把问题指向机器的地方，只问不答。
 * ============================================================ */
PERCEPTION.css('scene-onlysense', `
#soBoth{display:flex;flex-direction:column;align-items:center;gap:var(--space-md);}
#soBoth .s{font-size:var(--fs-title);font-weight:var(--fw-bold);line-height:1.3;}
#soBoth .ln{width:14vw;height:1px;background:var(--border-subtle);}
`);

PERCEPTION.scene({
  id: 'onlysense',
  label: '只拥有感',
  part: '我们知道什么',
  dark: false,
  states: [

    /* ---- 退一步 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="stack gap-lg">
            <div class="title step">审慎</div>
            <div class="title step">退一步</div>
            <div class="title step">只剩下感</div>
            <div class="subtitle muted step">感本身，就是一种意义</div>
          </div>
        </div>
      `);
      ctx.steps();
    },

    /* ---- 同时 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-xl">
          <div id="soBoth">
            <div class="s c-blue anim" style="--d:.1s">无比真实</div>
            <div class="ln anim fade" style="--d:.35s"></div>
            <div class="s c-orange anim" style="--d:.55s">无比虚假</div>
          </div>
        </div>
      `);
    },

    /* ---- 转向机器 ---- */
    function (ctx) {
      ctx.set(`
        <div class="stack gap-lg">
          <div class="card anim" style="--d:0s;max-width:56vw;text-align:center">
            <p class="subtitle step" style="margin:0 0 var(--space-sm)">机器有「知」</p>
            <p class="subtitle step c-purple">它有「感」吗</p>
          </div>
        </div>
      `);
      ctx.steps();
    },

  ],
});
