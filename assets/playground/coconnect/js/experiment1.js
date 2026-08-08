/* COCOnnect — Exp 1: 精细阅读能力曲线（v4.0 K1）
   无辅助、非 RSVP、整句、4Hz 计时；19 级 × 10 试次/轮；两轮 exp1.1 / exp1.2。
*/
'use strict';

const EXP1_COLUMNS = [
  'participant', 'date', 'mode', 'subset_id', 'block_type', 'rhythm_freq',
  'rsvp', 'block_num', 'trial', 'image_id', 'text_level', 'text_nchar',
  'text', 'run', 'correct_answer', 'subject_key', 'accuracy', 'rt', 'trial_type',
];

async function runExp1(cfg) {
  // cfg: { subject, run }
  const subject = cfg.subject;
  const runLabel = cfg.run || 'exp1.1';
  const runTxt = { 'exp1.1': '第一轮', 'exp1.2': '第二轮' }[runLabel] || '';

  if (await showInstruction(`实验一：阅读能力测试${runTxt}`,
      '屏幕上先出现一张图片，请记住它<br>' +
      '接着出现一段文字，请判断文字描述与图片是否一致<br>' +
      '一致按 Y，不一致按 N<br><br>' +
      '文字按固定时长显示，读到能判断就按<br>不用着急，尽力就好')) return;

  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PRE) {
    const vas = await showVas('开始前，你平时默读时，头脑里会有"声音"吗？', [0, 10], ['没有声音', '很清楚']);
    if (vas.quit) return;
  }

  try { await SessionPool.load(); } catch (e) {
    await showCompletion('数据加载失败', e.message);
    return;
  }

  const freq = CONFIG.FINE_CURVE_FREQ;               // 4 Hz（无节拍器，仅计时）
  const seed = Math.floor(freq * 1000);              // 移植 int(freq*1000)
  let trials;
  try {
    trials = SessionPool.fineCurveTrials(subject, CONFIG.TRIALS_PER_LENGTH, seed);
  } catch (e) {
    await showCompletion('无法开始', e.message);
    return;
  }

  const stem = `${subject}_EXP1_b00_finecurve_${runLabel}_${timestamp()}`;
  DataLog.reset(stem, EXP1_COLUMNS);
  const date = dateStr();
  let n = 0;
  let accs = [];
  const shown = [];

  for (const t of trials) {
    n++;
    const row = await runMatchTrial({ im: t.im, text: t.text, answer: t.answer, freq, rsvp: false });
    row.participant = subject;
    row.date = date;
    row.mode = 'EXP1';
    row.subset_id = '';
    row.block_type = 'finecurve';
    row.rhythm_freq = 0;
    row.rsvp = false;
    row.block_num = 0;
    row.trial = n;
    row.text_level = t.level;
    row.run = runLabel;
    row.trial_type = t.answer === 'yes' ? 'correct' : 'wrong';
    DataLog.add(row);
    if (row.image_id) shown.push(row.image_id);
    if (row.accuracy !== '') accs.push(row.accuracy);
    if (row.subject_key === 'quit') break;
    if (n % CONFIG.IN_BLOCK_BREAK_EVERY === 0 && n < trials.length) {
      const br = await showInBlockBreak(n, trials.length);
      if (br === 'quit') break;
    }
  }

  SessionPool.markShown(subject, shown);

  const meanAcc = accs.length
    ? ((accs.reduce((a, b) => a + b, 0) / accs.length) * 100).toFixed(1)
    : null;
  const summary = meanAcc != null
    ? `<div class="done-summary">完成 ${n} 试次 · 总正确率 <b>${meanAcc}%</b></div>`
    : `<div class="done-summary">完成 ${n} 试次</div>`;
  showDoneScreen(`实验一${runTxt}完成`, `这一轮共 ${n} 试次。`, stem + '.csv', summary);
}
