/* COCOnnect — Exp 2: 单长度节律辅助测试（2026-08-10）
   会话 1：对照 → 呈现速率(0.5/1/2/4/6Hz) → 听觉节拍(0.5/1/2/4/6Hz)
   会话 2：听觉/呈现速率 各 ABAB；整句 3 字/秒、作答即结束；图片自翻页。
*/
'use strict';

const EXP2_COLUMNS = [
  'participant', 'date', 'session', 'condition', 'assist', 'freq', 'segment',
  'family', 'trial', 'image_id', 'image_duration', 'text_level', 'text_nchar',
  'text', 'text_duration', 'swap_pos', 'correct_answer', 'subject_key',
  'accuracy', 'rt',
];

function exp2ConditionSequence(session) {
  const c = (type, freq, label, assist, presentation, segment, family) => ({
    type, freq, label, assist, presentation: presentation || type, segment: segment || '', family: family || '',
  });
  const seq = [];
  if (session === 1) {
    seq.push(c('control', null, '无辅助对照', 'none', 'whole'));
    for (const f of CONFIG.EXP2_FREQS) {
      seq.push(c('rsvp_simple', f, `呈现速率 ${f}g Hz`, 'rsvp', 'rsvp_simple'));
    }
    for (const f of CONFIG.EXP2_FREQS) {
      seq.push(c('auditory', f, `听觉节拍 ${f}g Hz`, 'auditory', 'auditory'));
    }
  } else {
    const fams = [
      ['auditory', '听觉', 'auditory'],
      ['rsvp_simple', '呈现速率', 'rsvp_simple'],
    ];
    for (const [assist, label, pres] of fams) {
      seq.push(c('abab_a', null, `ABAB-${label} A1`, 'none', 'whole', 'A1', pres));
      seq.push(c('abab_b', CONFIG.EXP2_ABAB_B_FREQ, `ABAB-${label} B1`, assist, pres, 'B1', pres));
      seq.push(c('abab_a', null, `ABAB-${label} A2`, 'none', 'whole', 'A2', pres));
      seq.push(c('abab_b', CONFIG.EXP2_ABAB_B_FREQ, `ABAB-${label} B2`, assist, pres, 'B2', pres));
    }
  }
  return seq;
}

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

  // VAS_PRE"平时"只问一遍
  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PRE) {
    if ((await showVas('开始前，你平时默读时，头脑里会有"声音"吗？', [0, 10], ['没有声音', '很清楚'])).quit) return;
  }
  Stage.show(`<div class="screen center panel"><div class="instr-title">正在加载素材…</div><div class="instr-extra">首次约需几秒，请稍候</div></div>`);
  try { await SessionPool.load(); } catch (e) {
    await showCompletion('数据加载失败', e.message);
    return;
  }
  await runPractice(subject);

  if (await showInstruction(`实验二（会话 ${session}）`,
      '和之前一样：看图、记住、判断是否一致<br>' +
      '一致按 Y（或 1），不一致按 N（或 2）<br><br>' +
      '有的部分有声音，有的部分文字逐字出现<br>' +
      '能判断就按，慢慢来')) return;

  const seq = exp2ConditionSequence(session);
  const nTotal = exp2ConditionSequence(1).length + exp2ConditionSequence(2).length;
  let n;
  try {
    n = SessionPool.computeDynamicN(subject, level, nTotal);
  } catch (e) {
    await showCompletion('无法计算试次数', e.message);
    return;
  }

  const stem = `${subject}_EXP2_S${session}_b00_${level}_${timestamp()}`;
  DataLog.reset(stem, EXP2_COLUMNS);
  const date = dateStr();
  let aborted = false;

  for (let ci = 0; ci < seq.length; ci++) {
    const spec = seq[ci];

    // RSVP 熟悉练习：会话1 首次 rsvp_simple 前，3 个 4Hz 热身（不记录）
    if (session === 1 && spec.presentation === 'rsvp_simple' && !aborted
        && !seq.slice(0, ci).some((s) => s.presentation === 'rsvp_simple')) {
      if (await showInstruction('先熟悉一下逐字呈现',
          '接下来文字会逐字出现。先练习 3 个题：<br>' +
          '看着字蹦出来，能判断就按（Y/N 或 1/2）')) { aborted = true; break; }
      const warm = SessionPool.exp2Trials(subject, level, 3, 999);
      const warmShown = [];
      for (const t of warm) {
        const r = await runConditionTrial({ im: t.im, text: t.text, answer: t.answer, spec: { type: 'rsvp_simple', freq: 4.0, presentation: 'rsvp_simple', assist: 'rsvp' } });
        if (r.resp !== 'quit' && r.row.image_id) warmShown.push(r.row.image_id);
        if (r.resp === 'quit') { aborted = true; break; }
      }
      SessionPool.markShown(subject, warmShown);
      if (aborted) break;
    }

    // 条件间休息
    if (ci > 0) {
      if (await showInBlockBreak(ci, seq.length) === 'quit') { aborted = true; break; }
    }
    if (await showInstruction(spec.label,
        exp2Hint(spec) + '<br><br>按空格键开始这一部分',
        `这一部分 ${n} 道题`)) { aborted = true; break; }

    let trials;
    try {
      trials = SessionPool.exp2Trials(subject, level, n, 1000 + ci + session * 100);
    } catch (e) {
      await showCompletion('图片不够了', e.message);
      aborted = true;
      break;
    }

    const shownHere = [];
    for (let ti = 0; ti < trials.length; ti++) {
      const t = trials[ti];
      const tn = ci * n + ti + 1;
      const r = await runConditionTrial({ im: t.im, text: t.text, answer: t.answer, spec });
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
      row.swap_pos = (t.swapPos == null ? '' : t.swapPos);
      DataLog.add(row);
      if (r.resp !== 'quit' && row.image_id) shownHere.push(row.image_id);
      if (r.resp === 'quit') { aborted = true; break; }
    }
    SessionPool.markShown(subject, shownHere);
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
