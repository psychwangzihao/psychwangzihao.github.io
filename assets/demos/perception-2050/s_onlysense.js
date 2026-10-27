/* ============================================================
 * 场景：只拥有感  (id: onlysense · 2 个状态)
 *
 * 「我们知道什么」这一节的开头。屏幕上只放词，判断留给讲者。
 *
 * 3.1 那两句必须**同时在场** —— 分两屏就把「同时」讲丢了。
 * 3.2 是全篇唯一一处把问题指向机器的地方，只问不答。
 * ============================================================ */
PERCEPTION.css('scene-onlysense', `
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
            <div class="title step">无知的意味</div>
            <div class="title step">感本身的意义</div>
          </div>
        </div>
      `);
      ctx.steps();
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
