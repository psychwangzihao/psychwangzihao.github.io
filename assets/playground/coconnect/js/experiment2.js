/* COCOnnect — Exp 2: 单长度节律辅助测试（v4.0 K2）
   会话 1：对照 → 简单RSVP(0.5-8Hz) → 丁鼐RSVP(4/2/1Hz) → 听觉节拍(0.5-8Hz)
   会话 2：听觉/简单RSVP/丁鼐RSVP 各 ABAB（A1-B1-A2-B2）
*/
'use strict';

const EXP2_COLUMNS = [
  'participant', 'date', 'session', 'condition', 'assist', 'freq', 'segment',
  'family', 'trial', 'image_id', 'text_level', 'text_nchar', 'text',
  'correct_answer', 'subject_key', 'accuracy', 'rt',
];

function exp2ConditionSequence(session) {
  const c = (type, freq, label, assist, presentation, segment, family) => ({
    type, freq, label, assist, presentation: presentation || type, segment: segment || '', family: family || '',
  });
  const seq = [];
  if (session === 1) {
    seq.push(c('control', null, '无辅助对照', 'none', 'whole'));
    for (const f of CONFIG.EXP2_FREQS) {
      seq.push(c('rsvp_simple', f, `简单RSVP ${f}g Hz`, 'rsvp', 'rsvp_simple'));
    }
    seq.push(c('rsvp_ding', CONFIG.EXP2_DING_CHAR_RATE, '丁鼐RSVP 4/2/1Hz', 'rsvp', 'rsvp_ding'));
    for (const f of CONFIG.EXP2_FREQS) {
      seq.push(c('auditory', f, `听觉节拍 ${f}g Hz`, 'auditory', 'auditory'));
    }
  } else {
    const fams = [
      ['auditory', '听觉', 'auditory'],
      ['rsvp_simple', '简单RSVP', 'rsvp_simple'],
      ['rsvp_ding', '丁鼐RSVP', 'rsvp_ding'],
    ];
    for (const [assist, label, pres] of fams) {
      const freqB = (pres === 'rsvp_ding' ? CONFIG.EXP2_DING_CHAR_RATE : 4.0);
      seq.push(c('abab_a', null, `ABAB-${label} A1`, 'none', 'whole', 'A1', pres));
      seq.push(c('abab_b', freqB, `ABAB-${label} B1`, assist, pres, 'B1', pres));
      seq.push(c('abab_a', null, `ABAB-${label} A2`, 'none', 'whole', 'A2', pres));
      seq.push(c('abab_b', freqB, `ABAB-${label} B2`, assist, pres, 'B2', pres));
    }
  }
  return seq;
}

function exp2Hint(spec) {
  const t = spec.type;
  if (t === 'control') return '这一部分没有声音、文字整句出现，按你自己的节奏默读';
  if (t === 'abab_a') return '这一部分没有辅助，整句出现，按你自己的节奏读';
  const pres = spec.presentation || t;
  if (pres === 'rsvp_simple') return `这一部分文字会逐字出现（${spec.freq} Hz 节奏）<br>看着字蹦出来，能判断就按`;
  if (pres === 'rsvp_ding') return '这一部分文字逐字出现（4Hz），词和短语处有标记<br>看着字蹦出来，能判断就按';
  if (pres === 'auditory') return `这一部分整句出现，同时有节拍器声音（${spec.freq} Hz）<br>声音只在读文字时有，边听边读`;
  return `这一部分有辅助（${spec.label}），读完后判断`;
}

async function runExp2(cfg) {
  // cfg: { subject, session, targetLevel }
  const subject = cfg.subject;
  const session = cfg.session || 1;
  const level = cfg.targetLevel || CONFIG.EXP2_TARGET_LEVEL;
  const n = CONFIG.EXP2_TRIALS_PER_CONDITION;

  if (await showInstruction(`实验二（会话 ${session}）`,
      '和之前一样：看图 → 记住 → 判断文字是否一致<br>' +
      '一致按 Y，不一致按 N<br><br>' +
      '有的部分会有节拍器声音，有的部分文字会逐字出现<br>' +
      '读到能判断就按，尽力就好')) return;

  if (CONFIG.ENABLE_VAS && CONFIG.VAS_PRE) {
    const vas = await showVas('开始前，你平时默读时，头脑里会有"声音"吗？', [0, 10], ['没有声音', '很清楚']);
    if (vas.quit) return;
  }

  try { await SessionPool.load(); } catch (e) {
    await showCompletion('数据加载失败', e.message);
    return;
  }

  const seq = exp2ConditionSequence(session);
  const stem = `${subject}_EXP2_S${session}_b00_${level}_${timestamp()}`;
  DataLog.reset(stem, EXP2_COLUMNS);
  const date = dateStr();
  let aborted = false;

  for (let ci = 0; ci < seq.length; ci++) {
    const spec = seq[ci];
    // 每条件间休息
    if (ci > 0) {
      const br = await showInBlockBreak(ci, seq.length);
      if (br === 'quit') { aborted = true; break; }
    }
    if (await showInstruction(spec.label,
        exp2Hint(spec) + '<br><br>按空格键开始这一部分',
        `这一部分 ${n} 道题`)) { aborted = true; break; }

    let trials;
    try {
      trials = SessionPool.exp2Trials(subject, level, n, 1000 + ci + session * 100);
    } catch (e) {
      await showCompletion('无法开始这一部分', e.message);
      aborted = true;
      break;
    }

    const drawn = [];
    for (let ti = 0; ti < trials.length; ti++) {
      const t = trials[ti];
      const tn = ci * n + ti + 1;
      const r = await runConditionTrial({ im: t.im, text: t.text, answer: t.answer, spec, session });
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
      DataLog.add(row);
      if (row.image_id) drawn.push(row.image_id);
      if (r.resp === 'quit') { aborted = true; break; }
    }
    SessionPool.markShown(subject, drawn);
    if (aborted) break;
  }

  if (CONFIG.ENABLE_VAS && CONFIG.VAS_POST) {
    const vas = await showVas('结束后回想：刚才这些部分，头脑里有"声音"在帮你吗？', [0, 10], ['没有声音', '很清楚']);
    if (vas.quit) return;
  }

  showDoneScreen(
    `实验二·会话 ${session} ${aborted ? '（提前结束）' : '完成'}`,
    `共完成 ${DataLog.count()} 试次。`,
    stem + '.csv',
    `<div class="done-summary">完成 ${DataLog.count()} 试次</div>`,
  );
}
