/* ============================================================
 * COCOnnect — 主流程（run_group 的网页移植）
 *
 * 逐行对应 experiment.py 的 run_group / _run_one_trial / _make_row：
 *   · 逐级递增 1→10 字，每级 10 试次
 *   · 前 5 条固定含 2–3 条错误试次（正误两种能力都测到）
 *   · **快速晋级**：前 5 全对 → 跳过本级后 5 条
 *   · 连过两级 / 跑满一级 → 一个休息页
 *   · 级末正确率 ≤6/10 → 提示"已接近读不了的长度"
 *   · 有节拍的组先做音量测试，再静默 10 秒
 * 这些不是网页版的取舍，是实验设计本身 —— 改这里等于改实验。
 * ============================================================ */
'use strict';

/* 一个试次：注视 → 刺激（图+文字同时出现）→ 反应。
   节拍在图片出现的那一刻起拍（注视点阶段不响），反应后停。 */
async function runTrial(t, hz, imgs) {
  const img = imgs.get(t.path);

  await Screens.fixate();
  /* 对应 collect() 开头的 event.clearEvents()：注视点阶段按下的键一律作废。
     注意要放在**画刺激之前** —— 放到画完之后，从图片上屏到 clear() 之间
     还有一帧多的窗口，那期间真按下的键会被误丢。 */
  Input.clear();

  const onset = await Screens.stimulus(img, t.text);
  if (hz) Metronome.start(hz);

  const keys = [CONFIG.KEY_YES, CONFIG.KEY_NO, CONFIG.KEY_D,
                CONFIG.KEY_YES_ALT, CONFIG.KEY_NO_ALT, CONFIG.KEY_D_ALT,
                CONFIG.KEY_QUIT];
  const ALT = { '1': CONFIG.KEY_YES, '2': CONFIG.KEY_NO, '3': CONFIG.KEY_D };

  let k = await Promise.race([
    Input.wait(keys),
    new Promise((r) => setTimeout(() => r('__timeout__'), CONFIG.SOFT_CAP * 1000)),
  ]);
  /* 中途超时是软的：仍等一个真正的按键，只是把 rt 记成空。
     （Python 是直接记 timeout 走人，这里对网页访客宽容一点，
      但 resp/accuracy 的语义完全一致 —— timeout 不计分。） */
  let rt = (performance.now() - onset) / 1000;
  let timedOut = false;
  if (k === '__timeout__') {
    timedOut = true;
    k = await Input.wait(keys);
    rt = null;
  }

  if (hz) Metronome.stop();
  if (ALT[k]) k = ALT[k];

  const resp = (k === CONFIG.KEY_QUIT) ? 'quit' : k;
  const answered = (resp === CONFIG.KEY_YES || resp === CONFIG.KEY_NO);
  const correct = (t.answer === 'yes') ? (resp === CONFIG.KEY_YES)
                                       : (resp === CONFIG.KEY_NO);
  return {
    resp, rt: timedOut ? null : rt,
    correct: answered && correct,
    scored: answered,
  };
}

/* 一行数据（字段和顺序都对齐 _make_row） */
function makeRow(subject, group, index, t, r, fastPass, volume) {
  return {
    subject: subject,
    task: group,
    condition: group,
    trial_index: index,
    level: t.level,
    text: t.text,
    image_id: t.image_id,
    correct_answer: t.answer,
    fast_pass: fastPass,                       // 先占位，级末统一回填 0/1
    volume: volume,
    resp: r.resp === 'quit' ? 'quit' : (r.resp || 'timeout'),
    accuracy: r.scored ? (r.correct ? 1 : 0) : 0,
    rt: (r.rt === null || r.rt === undefined) ? '' : Math.round(r.rt * 1000) / 1000,
  };
}

/* 跑一整组。cfg = { subject, groupId }；返回是否正常跑完。 */
async function runGroup(cfg, onProgress) {
  const subject = cfg.subject;
  const group = cfg.groupId;
  const gcfg = CONFIG.GROUPS.filter((g) => g.id === group)[0];
  const hz = gcfg ? gcfg.hz : null;
  const man = MANIFESTS.groups.filter((g) => g.id === group)[0];
  if (!man) throw new Error('找不到组：' + group);

  const trials = man.trials;
  const byId = {};
  for (const t of trials) byId[t.image_id] = t;
  const levels = man.levels.slice().sort((a, b) => a - b);
  const pres = man.presentation;

  /* ---- 预加载本组 100 张图：不让解码时间混进反应时 ---- */
  const imgs = await preloadImages(trials.map((t) => t.path), (n, total) => {
    if (onProgress) onProgress(n, total);
  });

  /* ---- 指导页（原文照搬） ---- */
  const beatNote = hz
    ? '\n图片出现后会有节拍声，跟着节拍的节奏读文字\n注视点出现时没有节拍'
    : '';
  const intro = await Screens.instruction(
    '实验：看图判断',
    '屏幕会出现一张图和一段文字（文字由短到长）\n'
    + '判断：文字说的内容在不在图里\n'
    + '在（哪怕文字只描述图的一部分）→ 一致\n'
    + '图里没有文字说的东西 → 不一致\n'
    + '一致按 Y(1)；不一致按 N(2)；读不了按 D(3)\n'
    + '读不了就选 D，不要硬猜'
    + beatNote + '\n\n按你自己的节奏来',
    '按空格键开始（Esc 随时退出，已有数据会保留）',
    [' ', 'Escape']);
  if (intro === 'Escape') return false;

  /* ---- 有节拍的组：先调音量，再静默 10 秒 ---- */
  let vol = CONFIG.METRONOME_GAIN_DEFAULT;
  if (hz) {
    const g = await Screens.audioTest(hz);
    if (g === null) return false;
    Metronome.setGain(g);
    vol = g;
    if (!(await Screens.silentWait(CONFIG.SILENT_AFTER_AUDIO_TEST))) return false;
  }

  /* ---- 主体 ---- */
  DataLog.reset(`${subject}_${group}_${timestamp()}`, CONFIG.CSV_COLUMNS);

  let done = 0, totalCorrect = 0, fastSinceRest = 0;
  const maxLevel = Math.max.apply(null, levels);
  let quit = false;

  /* 把本级的行定稿并写进 DataLog（先回填 fast_pass） */
  const commit = (rows, fastPass) => {
    for (const r of rows) if (r.fast_pass === '') r.fast_pass = fastPass;
    for (const r of rows) DataLog.add(r);
  };

  for (const lev of levels) {
    if (quit) break;
    const seg = pres[String(lev)];
    const first5 = seg.first5.map((id) => byId[id]);
    const last5 = seg.last5.map((id) => byId[id]);

    const levelRows = [];
    let firstCorrect = 0;
    let broken = false;

    /* -- 前 5 条 -- */
    for (const t of first5) {
      done++;
      const r = await runTrial(t, hz, imgs);
      if (r.resp === 'quit') { broken = true; break; }
      if (r.scored && r.correct) { totalCorrect++; firstCorrect++; }
      levelRows.push(makeRow(subject, group, done, t, r, '', vol));
    }
    if (broken) { commit(levelRows, 0); quit = true; break; }

    /* -- 快速晋级：前 5 全对就不跑后 5 条 -- */
    if (firstCorrect === 5) {
      commit(levelRows, 1);
      fastSinceRest++;
      if (fastSinceRest >= 2) {
        if (await Screens.instruction('休息一下', `已完成 ${done} 试次。`, '按空格键继续',
                                      [' ', 'Escape']) === 'Escape') { quit = true; break; }
        fastSinceRest = 0;
      }
      continue;
    }

    /* -- 前 5 有错 → 跑满 10 条，拿准本级正确率 -- */
    let levelCorrect = firstCorrect;
    for (const t of last5) {
      done++;
      const r = await runTrial(t, hz, imgs);
      if (r.resp === 'quit') { broken = true; break; }
      if (r.scored && r.correct) { totalCorrect++; levelCorrect++; }
      levelRows.push(makeRow(subject, group, done, t, r, 0, vol));
    }
    commit(levelRows, 0);
    if (broken) { quit = true; break; }

    fastSinceRest = 0;
    if (levelCorrect <= 6 && lev < maxLevel) {
      const k = await Screens.instruction(
        `休息一下（第 ${lev} 级完成）`,
        `第 ${lev} 级（${lev} 字）正确 ${levelCorrect}/10，已接近读不了的长度。\n`
        + `累计 ${done} 试次。`,
        '按空格继续下一级；按 Esc 提前退出',
        [' ', 'Escape']);
      if (k === 'Escape') { quit = true; break; }
    } else if (await Screens.instruction('休息一下', `已完成 ${done} 试次。`,
                                         '按空格键继续', [' ', 'Escape']) === 'Escape') {
      quit = true; break;
    }
  }

  const pct = done ? Math.round(totalCorrect / done * 100) : 0;
  return { done, totalCorrect, pct, quit, hz, subject, group };
}
