/* COCOnnect — Exp 1: 精细阅读能力曲线（2026-08-10）
   无辅助、整句、作答即结束、图片自翻页；两轮 exp1.1/exp1.2。
*/
'use strict';

const EXP1_COLUMNS = [
  'participant', 'date', 'mode', 'subset_id', 'block_type', 'rhythm_freq',
  'rsvp', 'block_num', 'trial', 'image_id', 'image_duration', 'text_level',
  'text_nchar', 'text', 'text_duration', 'correct_answer', 'subject_key',
  'accuracy', 'rt', 'run', 'swap_pos', 'trial_type',
];

async function runExp1(cfg) {
  // cfg: { subject, run }
  const subject = cfg.subject;
  const runLabel = cfg.run || 'exp1.1';
  const runTxt = { 'exp1.1': '第一轮', 'exp1.2': '第二轮' }[runLabel] || '';

  // VAS_PRE"平时"只问一遍（最开头）
  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PRE) {
    if ((await showVas('开始前，你平时默读时，头脑里会有"声音"吗？', [0, 10], ['没有声音', '很清楚'])).quit) return;
  }
  try { await SessionPool.load(); } catch (e) {
    await showCompletion('数据加载失败', e.message);
    return;
  }
  await runPractice(subject);

  // Exp1 轮次引导（含"请你尽快作答"）
  if (await showInstruction(`实验一${runTxt}`,
      '看图，记住它，看完按空格继续<br>' +
      '看文字，判断和图片是否一致<br>' +
      '一致按 Y（或 1），不一致按 N（或 2）<br><br>' +
      '请你尽快作答，答完马上进入下一题')) return;

  const seed = 4000;
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
  const accs = [];
  const shown = [];

  for (const t of trials) {
    n++;
    const row = await runMatchTrial({ im: t.im, text: t.text, answer: t.answer });
    row.participant = subject;
    row.date = date;
    row.mode = 'EXP1';
    row.subset_id = '';
    row.block_type = 'finecurve';
    row.rhythm_freq = 0;
    row.rsvp = '';
    row.block_num = 0;
    row.trial = n;
    row.text_level = t.level;
    row.run = runLabel;
    row.swap_pos = (t.swapPos == null ? '' : t.swapPos);
    row.trial_type = t.answer === 'yes' ? 'correct' : 'wrong';
    DataLog.add(row);
    if (row.image_id) shown.push(row.image_id);
    if (row.accuracy !== '') accs.push(row.accuracy);
    if (row.subject_key === 'quit') break;
    if (n % 38 === 0 && n < trials.length) {
      if (await showInBlockBreak(n, trials.length) === 'quit') break;
    }
  }

  SessionPool.markShown(subject, shown);

  // 每轮 VAS：Q1 内语感 + Q2 费力
  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PER_BLOCK) {
    await showVas('Q1 · 刚才做题读文字时，头脑里有"声音"在帮你读吗？', [0, 10], ['没有声音', '很清楚']);
    await showVas('Q2 · 刚才做题时，你觉得费力吗？', [0, 10], ['毫不费力', '非常费力']);
  }

  const meanAcc = accs.length ? ((accs.reduce((a, b) => a + b, 0) / accs.length) * 100).toFixed(1) : null;
  const summary = meanAcc != null
    ? `<div class="done-summary">完成 ${n} 试次 · 总正确率 <b>${meanAcc}%</b></div>`
    : `<div class="done-summary">完成 ${n} 试次</div>`;
  showDoneScreen(`实验一${runTxt}完成`, `这一轮共 ${n} 试次。`, stem + '.csv', summary);
}
