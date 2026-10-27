/* ============================================================
 * COCOnnect — 数据记录与 CSV 下载
 *
 * 逐试次记录；CSV 带 UTF-8 BOM（Excel 打开中文不乱码）；
 * localStorage 备份一份，防止误关页面丢数据。
 * 结果只在浏览器本地下载，不上传任何信息。
 * ============================================================ */
'use strict';

const DataLog = {
  rows: [],
  columns: null,
  fileStem: '',

  reset(stem, columns) {
    this.rows = [];
    this.columns = columns || null;
    this.fileStem = stem || '';
  },

  add(row) {
    if (!this.columns) this.columns = Object.keys(row);
    const r = {};
    for (const c of this.columns) {
      r[c] = (row[c] !== undefined && row[c] !== null) ? row[c] : '';
    }
    this.rows.push(r);
    this._backup();
  },

  /* 试次跑完后回填 fast_pass（Python 那边也是先写 None 再统一回填）。 */
  patch(field, value) {
    for (const r of this.rows) if (r[field] === '') r[field] = value;
    this._backup();
  },

  _backup() {
    try {
      localStorage.setItem('coconnect_log_backup',
        JSON.stringify({ stem: this.fileStem, cols: this.columns, rows: this.rows }));
    } catch (e) { /* 超配额就算了，本次会话里照样能下载 */ }
  },

  _esc(v) {
    const s = String(v === undefined || v === null ? '' : v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  },

  csvString() {
    const cols = this.columns || (this.rows.length ? Object.keys(this.rows[0]) : []);
    const lines = [cols.map((c) => this._esc(c)).join(',')];
    for (const r of this.rows) lines.push(cols.map((c) => this._esc(r[c])).join(','));
    return '﻿' + lines.join('\r\n');    // UTF-8 BOM
  },

  download(filename) {
    const blob = new Blob([this.csvString()], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || (this.fileStem + '.csv');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
  },

  count() { return this.rows.length; },
};

/* 时间戳：{subject}_{task}_{YYYYmmdd_HHMMSS}.csv（同 save_rows） */
function timestamp() {
  const d = new Date(), p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_` +
         `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
