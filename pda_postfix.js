const R = [
  ['q0', 'opd', 'Z0', 'q0', ['X', 'Z0']],  // 1
  ['q0', 'opd', 'X',  'q0', ['X', 'X']],   // 2
  ['q0', 'opr', 'X',  'q1', []],           // 3
  ['q1', null,  'X',  'q0', ['X']],        // 4
  ['q0', 'end', 'X',  'q2', []],           // 5 (hanya saat input habis)
  ['q2', null,  'Z0', 'qa', ['Z0']],       // 6 -> q_accept
];
const kind = (c) => (!c ? null : /^[a-zA-Z0-9]$/.test(c) ? 'opd' : '+-*/^'.includes(c) ? 'opr' : null);

function cek(s) {
  s = s.replace(/\s+/g, '');
  const bad = [...s].find((c) => !kind(c));
  if (!s || bad) return { ok: false, log: [`q0 | ${s || 'ε'} | [Z0]`], why: s ? `karakter '${bad}' di luar Σ` : 'input kosong' };
  let cur = [{ q: 'q0', i: 0, st: ['Z0'], log: [`q0 | ${s} | [Z0]`] }], last = cur[0];
  while (cur.length) {
    const c = cur.pop();
    if (c.q === 'qa' && c.i === s.length) return { ok: true, log: c.log, why: 'stack = [Z0] di q_accept' };
    if (c.log.length >= last.log.length) last = c;
    for (const [q, inp, pop, to, push] of R) {
      if (q !== c.q || pop !== c.st[0]) continue;
      const eps = inp === null || inp === 'end';
      if (inp === 'end' && c.i < s.length) continue;
      if (!eps && inp !== kind(s[c.i] || '')) continue;
      const i = eps ? c.i : c.i + 1, st = [...push, ...c.st.slice(1)];
      cur.push({ q: to, i, st, log: [...c.log, `${to} | ${s.slice(i) || 'ε'} | [${st}]`] });
    }
  }
  return { ok: false, log: last.log, why: `macet di ${last.log.at(-1)}` };
}

const tampil = (s) => {
  const r = cek(s);
  console.log(`\n"${s}"\nstate | sisa | stack\n${r.log.join('\n')}\n=> ${r.ok ? 'VALID' : 'INVALID'} (${r.why})`);
};

// Daftar ekspresi yang diperiksa (ubah/tambah sesuai kebutuhan)
const DAFTAR = ['ab+', '34*2+', 'abc*+', 'a', 'ab++', 'abc+', '+', '', '(ab+)'];

if (require.main === module) {
  const a = process.argv.slice(2);
  (a.length ? a : DAFTAR).forEach(tampil);
}
module.exports = { cek };