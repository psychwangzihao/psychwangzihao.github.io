/* COCOnnect — data logging + CSV download
   逐试次记录；CSV 带 UTF-8 BOM（Excel 中文不乱码）；localStorage 备份防丢。
*/
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
    for (const c of this.columns) r[c] = (row[c] !== undefined && row[c] !== null ? row[c] : '');
    this.rows.push(r);
    this._backup();
  },

  _backup() {
    try {
      localStorage.setItem('coconnect_log_backup',
        JSON.stringify({ stem: this.fileStem, cols: this.columns, rows: this.rows }));
    } catch (e) { /* quota exceeded — ignore, CSV still downloadable in-session */ }
  },

  _esc(v) {
    const s = String(v === undefined || v === null ? '' : v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  },

  csvString() {
    const cols = this.columns || (this.rows.length ? Object.keys(this.rows[0]) : []);
    const lines = [cols.map(c => this._esc(c)).join(',')];
    for (const r of this.rows) lines.push(cols.map(c => this._esc(r[c])).join(','));
    return '﻿' + lines.join('\r\n');   // UTF-8 BOM
  },

  download(filename) {
    const blob = new Blob([this.csvString()], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || (this.fileStem + '_' + Date.now() + '.csv');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
  },

  count() { return this.rows.length; },
};
