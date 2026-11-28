function isOperand(c)  { return /[a-zA-Z0-9]/.test(c); }
function isOperator(c) { return '+-*/^'.includes(c); }

function cekInfix(input) {
  const ekspresi = input.replace(/\s/g, ''); // hapus spasi
  let state = 'q0';                          // state awal
  const stack = ['Z0'];                      // stack awal berisi Z0

  for (const c of ekspresi) {
    const top = stack[stack.length - 1];     // puncak stack

    if (state === 'q0') {                    // q0: menunggu operan atau '('
      if (c === '(') {
        stack.push('(');                     // aturan 1 & 2: push '('
      } else if (isOperand(c)) {
        state = 'q1';                        // aturan 3 & 4: pindah ke q1
      } else {
        return 'INVALID: operator/kurung tutup di posisi salah';
      }

    } else if (state === 'q1') {             // q1: menunggu operator atau ')'
      if (isOperator(c)) {
        state = 'q0';                        // aturan 5 & 6: kembali ke q0
      } else if (c === ')' && top === '(') {
        stack.pop();                         // aturan 7: pop '('
      } else if (c === ')') {
        return 'INVALID: kurung tutup tanpa pasangan';
      } else {
        return 'INVALID: kurang operator';
      }
    }

    console.log(`  baca '${c}' → state ${state}, stack [${stack.join(', ')}]`);
  }

  // aturan 8: input habis, harus di q1 dan stack tinggal Z0
  if (state === 'q0') return 'INVALID: ekspresi belum lengkap';
  if (stack.length > 1) return 'INVALID: kurung buka belum ditutup';
  return 'VALID';
}

// ===== Pengujian =====
const contoh = ['(a+b)*c', '((3+4)*2)^5', '(a+b', 'a+b)', 'a++b', 'ab', ''];

for (const input of contoh) {
  console.log(`\nInput: "${input}"`);
  console.log('Hasil:', cekInfix(input));
}
