/* ============================================================
   script.js — หลักการทำงานของคอมพิวเตอร์
   Interactive: Loading · Circuit Canvas · Particles · Nav
                Tabs · Accordions · Flow Diagram · Quiz
                Scroll Reveal · Back-to-Top · Ripple
   ============================================================ */

'use strict';

/* ── 1. Loading Screen ─────────────────────────────────────── */
window.addEventListener('load', () => {
  const screen = document.getElementById('loading-screen');
  setTimeout(() => {
    screen.classList.add('hidden');
    // Start animations after load
    initParticles();
    initCircuitCanvas();
    initScrollReveal();
  }, 2400);
});

/* ── 2. Circuit Board Canvas ───────────────────────────────── */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = [];
  const NODE_COUNT = 40;

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function drawCircuit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0,245,255,0.06)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Update and draw nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.02;

      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      const alpha = 0.5 + 0.5 * Math.sin(n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${alpha * 0.8})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          // L-shaped circuit lines
          if (Math.random() > 0.5) {
            ctx.lineTo(nodes[i].x, nodes[j].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          } else {
            ctx.lineTo(nodes[j].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Junction dot
          ctx.beginPath();
          ctx.arc(nodes[i].x, nodes[j].y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,245,255,${alpha})`;
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(drawCircuit);
  }
  drawCircuit();
}

/* ── 3. Floating Particles ─────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#00f5ff', '#3b82f6', '#a78bfa', '#f0abfc'];
  const COUNT = 30;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      box-shadow: 0 0 ${size * 3}px currentColor;
    `;
    container.appendChild(p);
  }
}

/* ── 4. Sticky Navbar ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
  toggleBackTop();
});

// Hamburger menu
const navToggle = document.getElementById('nav-toggle');
const navDrawer = document.getElementById('nav-drawer');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navDrawer.classList.toggle('open');
});

// Close drawer when link clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navDrawer.classList.remove('open');
  });
});

// Active nav on scroll
function updateActiveNav() {
  const sections = ['hero', 'components', 'how-it-works', 'quiz-section', 'author'];
  const scrollPos = window.scrollY + 100;

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(l => l.classList.add('active'));
    }
  });
}

/* ── 5. Back to Top ────────────────────────────────────────── */
const backTop = document.getElementById('back-top');

function toggleBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 400);
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 6. Scroll Reveal ──────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

/* ── 7. Hardware / Software Tabs ───────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

/* ── 8. Read More Toggle ───────────────────────────────────── */
document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const isOpen = content.classList.toggle('open');
    btn.innerHTML = isOpen
      ? '<span>▲</span> ย่อลง'
      : '<span>▼</span> อ่านเพิ่มเติม';
  });
});

/* ── 9. Software Accordion ─────────────────────────────────── */
document.querySelectorAll('.sw-category-header').forEach(header => {
  header.addEventListener('click', () => {
    const cat = header.closest('.sw-category');
    const isOpen = cat.classList.toggle('open');
    header.querySelector('.sw-cat-arrow').textContent = isOpen ? '▲' : '▼';
  });
});

/* ── 10. Flow Diagram ──────────────────────────────────────── */
document.querySelectorAll('.flow-node').forEach(node => {
  node.addEventListener('click', () => {
    const step = node.closest('.flow-step');
    const panel = step.querySelector('.flow-detail-panel');

    // Toggle active
    const wasActive = node.classList.contains('active');
    document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.flow-detail-panel').forEach(p => p.classList.remove('active'));

    if (!wasActive) {
      node.classList.add('active');
      panel.classList.add('active');
    }
  });
});

/* ── 11. Quiz Engine ───────────────────────────────────────── */
const quizBank = [
  {
    q: 'อุปกรณ์ใดต่อไปนี้จัดเป็น Input Device?',
    opts: ['Monitor', 'Speaker', 'Keyboard', 'Printer'],
    ans: 2,
    exp: 'Keyboard (แป้นพิมพ์) เป็นอุปกรณ์รับข้อมูลเข้า (Input Device) ที่ใช้พิมพ์ข้อความ คำสั่ง หรือตัวเลขเข้าสู่คอมพิวเตอร์ ส่วน Monitor, Speaker และ Printer เป็น Output Device'
  },
  {
    q: 'CPU ย่อมาจากอะไร?',
    opts: ['Central Processing Unit', 'Computer Power Unit', 'Central Power Unit', 'Computer Processing Unit'],
    ans: 0,
    exp: 'CPU ย่อมาจาก Central Processing Unit หรือ "หน่วยประมวลผลกลาง" ทำหน้าที่ประมวลผลคำสั่งและควบคุมการทำงานของระบบคอมพิวเตอร์ทั้งหมด'
  },
  {
    q: 'RAM มีคุณสมบัติอย่างไร?',
    opts: ['เก็บข้อมูลถาวร ไม่สูญหายเมื่อปิดเครื่อง', 'เก็บข้อมูลชั่วคราว ข้อมูลหายเมื่อปิดเครื่อง', 'ใช้สำหรับเก็บ Firmware', 'อ่านข้อมูลได้อย่างเดียว แก้ไขไม่ได้'],
    ans: 1,
    exp: 'RAM (Random Access Memory) เป็นหน่วยความจำหลักชั่วคราว (Volatile Memory) ข้อมูลจะสูญหายทันทีเมื่อปิดคอมพิวเตอร์ ต่างจาก ROM ที่เก็บข้อมูลถาวร'
  },
  {
    q: 'SSD ดีกว่า HDD ในด้านใด?',
    opts: ['ราคาถูกกว่า', 'ความจุสูงกว่า', 'ความเร็วในการอ่าน/เขียนสูงกว่า', 'ทนทานต่อความร้อนมากกว่า'],
    ans: 2,
    exp: 'SSD (Solid State Drive) ใช้ชิปหน่วยความจำแบบ Flash ทำให้มีความเร็วในการอ่าน/เขียนข้อมูลสูงกว่า HDD มาก (ประมาณ 3–20 เท่า) เนื่องจากไม่มีส่วนที่เคลื่อนไหวทางกลไก'
  },
  {
    q: 'ซอฟต์แวร์ใดจัดเป็น System Software?',
    opts: ['Microsoft Word', 'Google Chrome', 'Windows 11', 'Adobe Photoshop'],
    ans: 2,
    exp: 'Windows 11 เป็นระบบปฏิบัติการ (Operating System) ซึ่งจัดเป็น System Software ทำหน้าที่จัดการทรัพยากรฮาร์ดแวร์และควบคุมการทำงานของซอฟต์แวร์ประยุกต์ทั้งหมด'
  },
  {
    q: 'ลำดับการทำงานของคอมพิวเตอร์ตามหลัก IPO ได้แก่อะไร?',
    opts: ['Input → Output → Process', 'Process → Input → Output', 'Input → Process → Output', 'Output → Process → Input'],
    ans: 2,
    exp: 'หลักการทำงานพื้นฐานคือ Input → Process → Output กล่าวคือ รับข้อมูลเข้า → ประมวลผล → แสดงผลลัพธ์ออก ซึ่งเป็นวงจรหลักของการทำงานในทุกระบบคอมพิวเตอร์'
  },
  {
    q: 'GPU ถูกออกแบบมาเพื่อทำงานด้านใดเป็นหลัก?',
    opts: ['จัดการหน่วยความจำ', 'ประมวลผลกราฟิกและภาพ', 'ควบคุมอุปกรณ์ I/O', 'จัดการระบบไฟล์'],
    ans: 1,
    exp: 'GPU (Graphics Processing Unit) ถูกออกแบบมาเพื่อประมวลผลกราฟิก ภาพ และวิดีโอโดยเฉพาะ มีหน่วยประมวลผลจำนวนมากทำงานพร้อมกัน ปัจจุบันยังใช้ใน AI และ Machine Learning ด้วย'
  },
  {
    q: 'Cloud Storage แตกต่างจาก External HDD อย่างไร?',
    opts: ['Cloud Storage เก็บข้อมูลบน Server ผ่านอินเทอร์เน็ต', 'Cloud Storage มีความเร็วสูงกว่าเสมอ', 'Cloud Storage ใช้งานแบบออฟไลน์ได้เสมอ', 'Cloud Storage มีราคาถูกกว่าเสมอ'],
    ans: 0,
    exp: 'Cloud Storage เก็บข้อมูลบน Server ของผู้ให้บริการผ่านอินเทอร์เน็ต เช่น Google Drive, OneDrive ต้องการการเชื่อมต่ออินเทอร์เน็ต ในขณะที่ External HDD เก็บข้อมูลในอุปกรณ์ฮาร์ดแวร์จริงที่ถือติดตัวได้'
  },
  {
    q: 'Firmware คืออะไร?',
    opts: ['โปรแกรมสำนักงานที่ใช้ทั่วไป', 'ซอฟต์แวร์ที่บันทึกถาวรในชิปฮาร์ดแวร์', 'ระบบป้องกันไวรัส', 'โปรแกรมสำหรับออกแบบกราฟิก'],
    ans: 1,
    exp: 'Firmware คือซอฟต์แวร์ขนาดเล็กที่บันทึกถาวรอยู่ในชิป ROM หรือ Flash Memory ของฮาร์ดแวร์ เช่น BIOS/UEFI ในเมนบอร์ด ทำหน้าที่ควบคุมการทำงานพื้นฐานของอุปกรณ์นั้น ๆ'
  },
  {
    q: 'อุปกรณ์ใดต่อไปนี้เป็น Output Device?',
    opts: ['Webcam', 'Microphone', 'Scanner', 'Projector'],
    ans: 3,
    exp: 'Projector (โปรเจกเตอร์) เป็น Output Device ทำหน้าที่แสดงภาพจากคอมพิวเตอร์บนจอใหญ่หรือผนัง ส่วน Webcam, Microphone และ Scanner เป็น Input Device ทั้งหมด'
  },
];

let quizData = [];
let currentQ = 0;
let score = 0;
let answered = false;

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function initQuiz() {
  quizData = shuffleArray(quizBank);
  currentQ = 0;
  score = 0;
  answered = false;
  document.querySelector('.quiz-result').classList.remove('show');
  document.getElementById('quiz-body').style.display = '';
  renderQuestion();
}

function renderQuestion() {
  const q = quizData[currentQ];
  const total = quizData.length;

  // Progress
  document.getElementById('quiz-progress-bar').style.width = `${(currentQ / total) * 100}%`;
  document.getElementById('quiz-current').textContent = currentQ + 1;
  document.getElementById('quiz-total').textContent = total;
  document.getElementById('quiz-score-display').textContent = `คะแนน: ${score}/${total}`;

  // Question
  document.getElementById('quiz-qnum').textContent = `คำถามที่ ${currentQ + 1} / ${total}`;
  document.getElementById('quiz-question').textContent = q.q;

  // Options
  const optContainer = document.getElementById('quiz-options');
  optContainer.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="quiz-option-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener('click', () => handleAnswer(i, q.ans, q.exp));
    optContainer.appendChild(btn);
  });

  // Explanation hidden
  const exp = document.getElementById('quiz-explanation');
  exp.classList.remove('show');
  exp.innerHTML = '';

  // Next button
  answered = false;
  document.getElementById('quiz-next').style.display = 'none';
}

function handleAnswer(chosen, correct, explanation) {
  if (answered) return;
  answered = true;

  const options = document.querySelectorAll('.quiz-option');
  options.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === correct) btn.classList.add('correct');
    else if (i === chosen) btn.classList.add('wrong');
  });

  if (chosen === correct) score++;

  // Show explanation
  const exp = document.getElementById('quiz-explanation');
  exp.innerHTML = `<strong>💡 คำอธิบาย:</strong> ${explanation}`;
  exp.classList.add('show');

  document.getElementById('quiz-next').style.display = 'flex';
  document.getElementById('quiz-score-display').textContent = `คะแนน: ${score}/${quizData.length}`;
}

document.getElementById('quiz-next').addEventListener('click', () => {
  currentQ++;
  if (currentQ < quizData.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById('quiz-body').style.display = 'none';
  const result = document.querySelector('.quiz-result');
  result.classList.add('show');

  const pct = Math.round((score / quizData.length) * 100);
  document.getElementById('result-score').textContent = `${score} / ${quizData.length}`;
  document.getElementById('result-pct').textContent = `คะแนน ${pct}%`;

  let emoji, gradeClass, gradeText, msg;
  if (pct >= 90)      { emoji='🏆'; gradeClass='grade-a'; gradeText='ยอดเยี่ยม!'; msg='คุณเข้าใจหลักการทำงานของคอมพิวเตอร์เป็นอย่างดีมาก!'; }
  else if (pct >= 70) { emoji='🎉'; gradeClass='grade-b'; gradeText='ดีมาก!'; msg='ผลลัพธ์ดีเยี่ยม มีพื้นฐานที่แข็งแกร่งมาก'; }
  else if (pct >= 50) { emoji='👍'; gradeClass='grade-c'; gradeText='ผ่าน'; msg='ทำได้ดี ลองทบทวนเนื้อหาเพื่อให้ได้คะแนนสูงขึ้น'; }
  else                { emoji='📚'; gradeClass='grade-d'; gradeText='ต้องพัฒนา'; msg='ลองศึกษาเนื้อหาเพิ่มเติมแล้วทำแบบทดสอบอีกครั้ง'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-grade').className = `result-grade ${gradeClass}`;
  document.getElementById('result-grade').textContent = gradeText;
  document.getElementById('result-msg').textContent = msg;
}

document.getElementById('quiz-restart').addEventListener('click', initQuiz);

// Init quiz on page load
initQuiz();

/* ── 12. Ripple Effect ─────────────────────────────────────── */
document.querySelectorAll('.ripple-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ── 13. Smooth Scroll for anchors ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── 14. CPU Pin Animation stagger ────────────────────────── */
document.querySelectorAll('.pin').forEach((pin, i) => {
  pin.style.animationDelay = `${i * 0.2}s`;
});
