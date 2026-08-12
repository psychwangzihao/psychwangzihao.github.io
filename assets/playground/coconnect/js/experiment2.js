/* COCOnnect — Exp 2: 单长度节律辅助测试（v5.4-B）
   每条件固定 12 试次；固定序列清单消费（网页演示版滤掉丁鼐 EEG 条件）。
   会话1：对照 → 呈现速率(0.5/1/2/4/6Hz) → 听觉节拍；会话2：听觉/呈现速率 ABAB。
*/
'use strict';

const EXP2_COLUMNS = [
  'participant', 'date', 'session', 'condition', 'assist', 'freq', 'segment',
  'family', 'trial', 'image_id', 'image_duration', 'text_level', 'text_nchar',
  'text', 'text_duration', 'swap_pos', 'correct_answer', 'subject_key',
  'response_type', 'accuracy', 'rt', 'time_on_task',
];

function exp2Hint(spec) {
  const t = spec.type;
  if (t === 'control') return '没有声音，文字整句出现。能判断就按';
  if (t === 'abab_a') return '这一部分没有辅助，整句出现，按你自己的节奏读';
  const pres = spec.presentation || t;
  if (pres === 'rsvp_simple') return `文字会逐字出现（${spec.freq} Hz 节奏）。看着它，能判断就按`;
  if (pres === 'auditory') return `整句出现，同时有节拍器声音（${spec.freq} Hz）。能判断就按`;
  return `这一部分有辅助（${spec.label}），读完后判断`;
}

async function runExp2(cfg) {
  // cfg: { subject, session, targetLevel }
  const subject = cfg.subject;
  const session = cfg.session || 1;
  const level = cfg.targetLevel || CONFIG.EXP2_TARGET_LEVEL;
  window.__taskStart = performance.now();

  // VAS_PRE"平时"只问一遍
  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PRE) {
    if ((await showVas('开始前，你平时默读时，头脑里会有"声音"吗？', [0, 10], ['没有声音', '很清楚'])).quit) return;
  }
  Stage.show(`<div class="screen center panel"><div class="instr-title">正在加载素材…</div><div class="instr-extra">首次约需几秒，请稍候</div></div>`);
  try { await SessionPool.load(); } catch (e) { /* 练习需要池子 */ }
  await runPractice(subject);

  // 加载固定序列清单
  let manifest;
  try { manifest = await Manifest.loadExp2(level, session); }
  catch (e) {
    await showCompletion('清单加载失败', e.message);
    return;
  }
  const conditions = manifest.conditions;

  if (await showInstruction(`实验二（会话 ${session}）`,
      '和之前一样：看图、记住、判断是否一致<br>' +
      '一致按 Y（或 1），不一致按 N（或 2），读不了就选 D（或 3）不知道<br><br>' +
      '有的部分有声音，有的部分文字逐字出现<br>' +
      '能判断就按，慢慢来')) return;

  const stem = `${subject}_EXP2_S${session}_b00_${level}_${timestamp()}`;
  DataLog.reset(stem, EXP2_COLUMNS);
  const date = dateStr();
  let aborted = false;
  let warmShown = false;

  for (let ci = 0; ci < conditions.length; ci++) {
    const spec = conditions[ci];

    // RSVP 熟悉练习：会话1 首次 rsvp_simple 前，3 个 4Hz 热身（不记录）
    if (session === 1 && spec.presentation === 'rsvp_simple' && !warmShown && !aborted) {
      warmShown = true;
      if (await showInstruction('先熟悉一下逐字呈现',
          '接下来文字会逐字出现。先练习 3 个题（不计分）：<br>' +
          '看着字蹦出来，能判断就按（Y/N/D 或 1/2/3）')) { aborted = true; break; }
      const warm = SessionPool.exp2Trials(subject, level, 3, 999);
      const warmShownIds = [];
      for (const t of warm) {
        const r = await runConditionTrial({
          image_id: t.im.id, path: t.im.path, text: t.text, answer: t.answer,
          spec: { type: 'rsvp_simple', freq: 4.0, presentation: 'rsvp_simple', assist: 'rsvp' },
        });
        if (r.resp !== 'quit' && r.row.image_id) warmShownIds.push(r.row.image_id);
        if (r.resp === 'quit') { aborted = true; break; }
      }
      SessionPool.markShown(subject, warmShownIds);
      if (aborted) break;
    }

    // 条件间休息
    if (ci > 0) {
      if (await showInBlockBreak(ci, conditions.length) === 'quit') { aborted = true; break; }
    }
    if (await showInstruction(spec.label,
        exp2Hint(spec) + '<br><br>按空格键开始这一部分',
        `这一部分 ${spec.trials.length} 道题`)) { aborted = true; break; }

    for (let ti = 0; ti < spec.trials.length; ti++) {
      const t = spec.trials[ti];
      const tn = ci * spec.trials.length + ti + 1;
      const r = await runConditionTrial({
        image_id: t.image_id, path: t.path, text: t.text, answer: t.answer, spec,
      });
      const row = r.row;
      row.participant = subject;
      row.date = date;
      row.session = session;
      row.condition = spec.type;
      row.assist = spec.assist;
      row.freq = (spec.freq == null ? '' : spec.freq);
      row.segment = spec.segment;
      row.family = spec.family;
      row.trial = tn;
      row.text_level = level;
      row.swap_pos = (t.swap_pos == null || t.swap_pos === '' ? '' : t.swap_pos);
      DataLog.add(row);
      if (r.resp === 'quit') { aborted = true; break; }
    }
    if (aborted) break;

    // 每条件 VAS：听觉/ABAB-B → Q3（节拍器作用），否则 Q1（内语感）
    if (CONFIG.ENABLE_VAS && CONFIG.VAS_PER_BLOCK) {
      const isAudCond = (spec.assist === 'auditory' || spec.type === 'abab_b');
      if (isAudCond) {
        await showVas('Q3 · 刚才的节拍器声音，你觉得是帮你、干扰你，还是没感觉？', [-5, 5], ['很干扰', '很有帮助']);
      } else {
        await showVas('Q1 · 刚才做题读文字时，头脑里有"声音"在帮你读吗？', [0, 10], ['没有声音', '很清楚']);
      }
    }
  }

  if (CONFIG.ENABLE_VAS && CONFIG.VAS_POST) {
    await showVas('结束后回想：刚才这些部分，头脑里有"声音"在帮你吗？', [0, 10], ['没有声音', '很清楚']);
  }

  showDoneScreen(
    `实验二·会话 ${session} ${aborted ? '（提前结束）' : '完成'}`,
    `共完成 ${DataLog.count()} 试次。`,
    stem + '.csv',
    `<div class="done-summary">完成 ${DataLog.count()} 试次 · 目标等级 ${level}</div>`,
  );
}
