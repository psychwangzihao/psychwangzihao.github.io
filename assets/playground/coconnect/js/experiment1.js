/* COCOnnect — Exp 1: 精细阅读能力曲线（v5.4-B）
   每级 8 试次（152/轮）、两轮；固定序列清单消费；D 键三选；自定步调。
*/
'use strict';

const EXP1_COLUMNS = [
  'participant', 'date', 'mode', 'subset_id', 'block_type', 'rhythm_freq',
  'rsvp', 'block_num', 'trial', 'image_id', 'image_duration', 'text_level',
  'text_nchar', 'text', 'text_duration', 'run', 'swap_pos', 'correct_answer',
  'subject_key', 'response_type', 'accuracy', 'rt', 'time_on_task', 'trial_type',
];

async function runExp1(cfg) {
  // cfg: { subject, run }
  const subject = cfg.subject;
  const runLabel = cfg.run || 'exp1.1';
  const runTxt = { 'exp1.1': '第一轮', 'exp1.2': '第二轮' }[runLabel] || '';
  window.__taskStart = performance.now();

  // VAS_PRE"平时"只问一遍（最开头）
  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PRE) {
    if ((await showVas('开始前，你平时默读时，头脑里会有"声音"吗？', [0, 10], ['没有声音', '很清楚'])).quit) return;
  }
  try { await SessionPool.load(); } catch (e) { /* 练习需要池子 */ }
  await runPractice(subject);

  // 加载固定序列清单
  let manifest;
  try { manifest = await Manifest.loadExp1(runLabel); }
  catch (e) {
    await showCompletion('清单加载失败', e.message);
    return;
  }
  const trials = manifest.trials;

  // Exp1 轮次引导（含 D 键说明）
  if (await showInstruction(`实验一${runTxt}`,
      '看图，记住它，看完按空格继续<br>' +
      '看文字，判断和图片是否一致<br>' +
      '一致按 Y（或 1），不一致按 N（或 2），读不了就选 D（或 3）不知道<br><br>' +
      '请你尽快作答，答完马上进入下一题')) return;

  const stem = `${subject}_EXP1_b00_finecurve_${runLabel}_${timestamp()}`;
  DataLog.reset(stem, EXP1_COLUMNS);
  const date = dateStr();
  let n = 0;
  const accs = [];

  for (const t of trials) {
    n++;
    const row = await runMatchTrial({
      image_id: t.image_id, path: t.path, text: t.text, answer: t.answer,
    });
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
    row.swap_pos = (t.swap_pos == null || t.swap_pos === '' ? '' : t.swap_pos);
    row.trial_type = t.answer === 'yes' ? 'correct' : 'wrong';
    DataLog.add(row);
    if (row.accuracy !== '') accs.push(row.accuracy);
    if (row.subject_key === 'quit') break;
    if (n % 38 === 0 && n < trials.length) {
      if (await showInBlockBreak(n, trials.length) === 'quit') break;
    }
  }

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
