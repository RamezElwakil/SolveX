const flashcards = [
  { q: "What is the goal of Week 8?", a: "To connect your research or prototype to real-world problems and users." },
  { q: "What does \"impact\" mean in research?", a: "Making a meaningful difference in the real world." },
  { q: "Why should you refine your message?", a: "So others can quickly understand and support your idea." }
];

const quizAnswers = {
  q1: 'C',
  q2: 'C',
  q3: 'A'
};

const SECTIONS = ['explanation', 'quiz', 'flashcards', 'tasks'];
let lastPercent = 0;

function renderFlashcards(current = 0) {
  const container = document.getElementById('flashcards-container');
  container.innerHTML = '';
  const card = flashcards[current];
  const cardDiv = document.createElement('div');
  cardDiv.className = 'flashcard';
  cardDiv.tabIndex = 0;
  cardDiv.setAttribute('aria-label', 'Flashcard');
  cardDiv.innerHTML = `
    <div class="flashcard-inner">
      <div class="flashcard-front">${card.q}</div>
      <div class="flashcard-back">${card.a}</div>
    </div>
  `;
  cardDiv.addEventListener('click', () => cardDiv.classList.toggle('flipped'));
  cardDiv.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') cardDiv.classList.toggle('flipped'); });
  container.appendChild(cardDiv);

  // Add navigation arrows below the card
  const navDiv = document.createElement('div');
  navDiv.className = 'flashcard-arrows';
  const prevBtn = document.createElement('button');
  prevBtn.className = 'flashcard-arrow neon-glow';
  prevBtn.innerHTML = '&#8592;';
  prevBtn.disabled = current === 0;
  prevBtn.onclick = () => renderFlashcards(current - 1);
  const nextBtn = document.createElement('button');
  nextBtn.className = 'flashcard-arrow neon-glow';
  nextBtn.innerHTML = '&#8594;';
  nextBtn.disabled = current === flashcards.length - 1;
  nextBtn.onclick = () => renderFlashcards(current + 1);
  navDiv.appendChild(prevBtn);
  navDiv.appendChild(nextBtn);
  container.appendChild(navDiv);

  // Progress indicator
  const progress = document.createElement('div');
  progress.className = 'flashcard-progress';
  progress.textContent = `Card ${current + 1} of ${flashcards.length}`;
  container.appendChild(progress);
}

function handleQuizSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let correct = 0;
  let feedback = '';
  for (let i = 1; i <= 3; i++) {
    const qName = 'q' + i;
    const userAns = form[qName].value;
    const correctAns = quizAnswers[qName];
    // Highlight correct/incorrect
    form.querySelectorAll(`[name="${qName}"]`).forEach(radio => {
      radio.parentElement.style.color = '';
      radio.parentElement.style.fontWeight = '';
    });
    if (userAns === correctAns) {
      correct++;
      form.querySelector(`[name="${qName}"][value="${userAns}"]`).parentElement.style.color = '#00fff1';
      form.querySelector(`[name="${qName}"][value="${userAns}"]`).parentElement.style.fontWeight = '700';
    } else {
      if (userAns) {
        form.querySelector(`[name="${qName}"][value="${userAns}"]`).parentElement.style.color = '#ff2d55';
        form.querySelector(`[name="${qName}"][value="${userAns}"]`).parentElement.style.fontWeight = '700';
      }
      form.querySelector(`[name="${qName}"][value="${correctAns}"]`).parentElement.style.color = '#00fff1';
      form.querySelector(`[name="${qName}"][value="${correctAns}"]`).parentElement.style.fontWeight = '700';
    }
    feedback += `<div>Q${i}: Correct answer is <b>${correctAns}</b></div>`;
  }
  document.getElementById('quiz-feedback').innerHTML =
    `<div style=\"margin-bottom:0.7em;\">You got <b>${correct}/3</b> correct.</div>${feedback}`;
}

function getProgress() {
  const data = JSON.parse(localStorage.getItem('week8_progress') || '{}');
  return SECTIONS.map(s => !!data[s]);
}

function setProgress(section) {
  const data = JSON.parse(localStorage.getItem('week8_progress') || '{}');
  if (!data[section]) {
    data[section] = true;
    localStorage.setItem('week8_progress', JSON.stringify(data));
  }
}

function updateProgressBar() {
  const progressArr = getProgress();
  const doneCount = progressArr.filter(Boolean).length;
  const percent = Math.round((doneCount / SECTIONS.length) * 100);
  animateProgressBar(percent);
}

function animateProgressBar(targetPercent) {
  const bar = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  let start = lastPercent;
  let startTime = null;
  function animate(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const duration = 1000; // 1s
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(start + (targetPercent - start) * progress);
    if (bar) bar.style.width = current + '%';
    if (label) label.textContent = current + '% Complete';
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      lastPercent = targetPercent;
      if (targetPercent === 100) {
        showCelebration();
      }
    }
  }
  requestAnimationFrame(animate);
}

function showCelebration() {
  // Confetti effect (simple SVG burst)
  const main = document.querySelector('.week-main');
  if (!main) return;
  let confetti = document.createElement('div');
  confetti.innerHTML = `<svg width="220" height="120" style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;pointer-events:none;">
    <g>
      <circle cx="30" cy="60" r="8" fill="#00fff1"/>
      <circle cx="60" cy="30" r="6" fill="#a259ff"/>
      <circle cx="110" cy="50" r="10" fill="#ff2df7"/>
      <circle cx="170" cy="40" r="7" fill="#00fff1"/>
      <circle cx="200" cy="80" r="8" fill="#a259ff"/>
      <circle cx="80" cy="100" r="7" fill="#ff2df7"/>
      <circle cx="150" cy="100" r="6" fill="#00fff1"/>
    </g>
  </svg>`;
  confetti.style.position = 'fixed';
  confetti.style.top = '0';
  confetti.style.left = '0';
  confetti.style.width = '100vw';
  confetti.style.height = '100vh';
  confetti.style.pointerEvents = 'none';
  confetti.style.zIndex = '9999';
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1800);

  // Show animated, pulsing message
  let msg = document.createElement('div');
  msg.innerHTML = `
    <div id="celebrate-popup" style="position:fixed;top:120px;left:50%;transform:translateX(-50%) scale(0.8);z-index:10000;background:rgba(30,32,60,0.97);color:#00fff1;padding:2rem 2.5rem;border-radius:18px;box-shadow:0 0 32px #00fff1,0 0 64px #a259ff;font-size:1.3rem;font-weight:700;text-align:center;opacity:0;animation:popInPulse 0.7s cubic-bezier(.23,1,.32,1) forwards;">
      <button id="close-celebrate" style="position:absolute;top:10px;right:14px;background:none;border:none;color:#00fff1;font-size:1.5rem;cursor:pointer;opacity:0.7;">&times;</button>
      🎉 Congratulations! You completed Week 8 and the entire program!<br><br>
      <button id="to-overview" style="margin-top:1.2rem;padding:0.7rem 2.2rem;font-size:1.1rem;font-weight:700;border:none;border-radius:12px;background:linear-gradient(90deg,#00fff1 0%,#a259ff 100%);color:#23243a;box-shadow:0 0 12px #00fff1,0 0 24px #a259ff;cursor:pointer;">Go to Overview</button>
    </div>
    <style>
      @keyframes popInPulse {
        0% { opacity: 0; transform: translateX(-50%) scale(0.8); box-shadow: 0 0 0 #00fff1; }
        60% { opacity: 1; transform: translateX(-50%) scale(1.08); box-shadow: 0 0 48px #00fff1,0 0 96px #a259ff; }
        80% { transform: translateX(-50%) scale(0.97); }
        100% { opacity: 1; transform: translateX(-50%) scale(1); box-shadow: 0 0 32px #00fff1,0 0 64px #a259ff; }
      }
      #celebrate-popup {
        animation: popInPulse 0.7s cubic-bezier(.23,1,.32,1) forwards, pulseLight 1.2s infinite alternate;
      }
      @keyframes pulseLight {
        0% { box-shadow: 0 0 32px #00fff1,0 0 64px #a259ff; }
        100% { box-shadow: 0 0 64px #00fff1,0 0 128px #a259ff; }
      }
      #close-celebrate:hover { opacity: 1; }
    </style>
  `;
  document.body.appendChild(msg);
  document.getElementById('to-overview').onclick = () => {
    window.location.href = 'overview.html';
  };
  document.getElementById('close-celebrate').onclick = () => {
    if (msg) msg.remove();
  };
  setTimeout(() => { if (msg && document.body.contains(msg)) msg.remove(); }, 8000);
}

function clearProgress() {
  localStorage.removeItem('week8_progress');
  lastPercent = 0;
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFlashcards(0);
  updateProgressBar();
  const quizForm = document.getElementById('quiz-form');
  if (quizForm) quizForm.onsubmit = handleQuizSubmit;

  document.querySelectorAll('.section-done-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const section = btn.getAttribute('data-section');
      setProgress(section);
      updateProgressBar();
      const bar = document.querySelector('.week-progress');
      if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Add clear progress button
  const weekMain = document.querySelector('.week-main');
  if (weekMain) {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Progress';
    clearBtn.className = 'section-done-btn neon-glow';
    clearBtn.style.margin = '2.5rem auto 0 auto';
    clearBtn.style.display = 'block';
    clearBtn.onclick = clearProgress;
    weekMain.appendChild(clearBtn);
  }
});
