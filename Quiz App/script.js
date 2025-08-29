const originalQuestions = [
  {
    question: "What does HTML stand for?",
    choices: [
      "HyperText Markup Language",
      "Hyperlink Text Management Language",
      "Home Tool Markup Language",
      "Hyper Transfer Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which CSS property controls text size?",
    choices: ["font-size", "text-style", "text-size", "font-weight"],
    answer: 0
  },
  {
    question: "Inside which HTML element do we put JavaScript?",
    choices: ["<script>", "<js>", "<javascript>", "<code>"],
    answer: 0
  },
  {
    question: "Which company developed JavaScript?",
    choices: ["Microsoft", "Sun Microsystems", "Netscape", "Oracle"],
    answer: 2
  },
  {
    question: "Which symbol is used for single-line comments in JavaScript?",
    choices: ["//", "/* */", "#", "<!-- -->"],
    answer: 0
  }
];

// Utility: shuffle copy of array
function shuffledCopy(arr){
  return arr
    .map(v=>({v, r:Math.random()}))
    .sort((a,b)=>a.r-b.r)
    .map(x=>x.v);
}

// Build quizData where each question has shuffled choices and correctIndex mapped to the new order
function buildQuizData(){
  const shuffledQuestions = shuffledCopy(originalQuestions);
  return shuffledQuestions.map(q=>{
    const originalCorrectText = q.choices[q.answer];
    const shuffledChoices = shuffledCopy(q.choices);
    const correctIndex = shuffledChoices.findIndex(c => c === originalCorrectText);
    return {
      question: q.question,
      choices: shuffledChoices,
      correctIndex
    };
  });
}

// App state
let quizData = buildQuizData();
let current = 0;
let userAnswers = Array(quizData.length).fill(null); // index chosen or null
let score = 0;
let timerId = null;
const TIME_PER_QUESTION = 10;

const questionEl = document.getElementById('question-container');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('next-btn');
const qNumberEl = document.getElementById('q-number');
const qTotalEl = document.getElementById('q-total');
const timerEl = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const resultSection = document.getElementById('result');
const quizSection = document.getElementById('quiz');
const scoreEl = document.getElementById('score');
const summaryEl = document.getElementById('summary');
const restartBtn = document.getElementById('restart-btn');

qTotalEl.textContent = quizData.length;

// Start / Restart
function startQuiz(){
  quizData = buildQuizData();
  userAnswers = Array(quizData.length).fill(null);
  current = 0;
  score = 0;
  resultSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  nextBtn.textContent = 'Next';
  renderQuestion();
  updateProgress();
}

function renderQuestion(){
  clearTimer();
  const q = quizData[current];
  qNumberEl.textContent = current + 1;
  questionEl.textContent = q.question;
  choicesEl.innerHTML = '';
  q.choices.forEach((choiceText, idx)=>{
    const li = document.createElement('li');
    li.className = 'choice';
    li.setAttribute('role','button');
    li.tabIndex = 0;
    li.textContent = choiceText;
    li.onclick = () => onSelect(idx, li);
    li.onkeydown = (e) => { if(e.key === 'Enter' || e.key === ' ') onSelect(idx, li); };
    choicesEl.appendChild(li);
  });

  // If user already answered (in review after timeout), reflect it
  if(userAnswers[current] !== null){
    const selectedIndex = userAnswers[current];
    const children = choicesEl.children;
    for(let i=0;i<children.length;i++){
      children[i].onclick = null; // prevent change
      if(i === quizData[current].correctIndex) children[i].classList.add('correct');
      if(i === selectedIndex && i !== quizData[current].correctIndex) children[i].classList.add('incorrect');
      if(i === selectedIndex) children[i].classList.add('selected');
    }
  } else {
    // start timer only if not already answered
    startTimer(TIME_PER_QUESTION);
  }

  // update next button label for last question
  if(current === quizData.length - 1){
    nextBtn.textContent = 'View Results';
  } else {
    nextBtn.textContent = 'Next';
  }

  updateProgress();
}

function onSelect(choiceIndex, element){
  // prevent multiple selection
  if(userAnswers[current] !== null) return;

  // stop timer
  clearTimer();

  const q = quizData[current];
  userAnswers[current] = choiceIndex;

  // mark choices correct/incorrect and disable
  Array.from(choicesEl.children).forEach((child, idx) => {
    child.onclick = null;
    child.onkeydown = null;
    if(idx === q.correctIndex) child.classList.add('correct');
    if(idx === choiceIndex && idx !== q.correctIndex) child.classList.add('incorrect');
    if(idx === choiceIndex) child.classList.add('selected');
  });

  // update score
  if(choiceIndex === q.correctIndex) score++;
}

function startTimer(seconds){
  let timeLeft = seconds;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  timerId = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if(timeLeft <= 0){
      clearTimer();
      // no answer recorded -> move on
      userAnswers[current] = null;
      revealCorrectAfterTimeout();
      setTimeout(()=> {
        // proceed to next question
        goNext();
      }, 800);
    }
  }, 1000);
}

function revealCorrectAfterTimeout(){
  const q = quizData[current];
  Array.from(choicesEl.children).forEach((child, idx)=>{
    child.onclick = null;
    child.onkeydown = null;
    if(idx === q.correctIndex) child.classList.add('correct');
  });
}

function clearTimer(){
  if(timerId) { clearInterval(timerId); timerId = null; }
  timerEl.textContent = `Time Left: ${TIME_PER_QUESTION}s`;
}

function goNext(){
  // if user didn't answer and not last, just goto next
  if(current < quizData.length - 1){
    current++;
    renderQuestion();
  } else {
    // finished
    showResults();
  }
}

function updateProgress(){
  const percent = (current / quizData.length) * 100;
  progressBar.style.width = percent + '%';
}

function showResults(){
  clearTimer();
  // ensure any remaining unanswered after last question are accounted
  // score already incremented on selection
  quizSection.classList.add('hidden');
  resultSection.classList.remove('hidden');

  scoreEl.textContent = `You scored ${score} out of ${quizData.length}`;

  summaryEl.innerHTML = '';
  quizData.forEach((q, idx) => {
    const item = document.createElement('div');
    item.className = 'item';
    const yourIdx = userAnswers[idx];
    const yourText = yourIdx === null ? '<em>No answer</em>' : q.choices[yourIdx];
    const correctText = q.choices[q.correctIndex];
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<strong>Q${idx+1}:</strong> ${q.question}`;
    const your = document.createElement('div');
    your.style.marginTop = '8px';
    your.innerHTML = `<span class="answer-label ${yourIdx === q.correctIndex ? 'correct-label' : 'incorrect-label'}">Your answer: ${yourText}</span>
                      <span style="margin-left:8px" class="answer-label correct-label">Correct: ${correctText}</span>`;
    item.appendChild(meta);
    item.appendChild(your);
    summaryEl.appendChild(item);
  });
}

// Event binding
nextBtn.addEventListener('click', () => {
  // If user hasn't answered, and not last, allow skipping (treated as no answer)
  if(userAnswers[current] === null){
    // stop timer and reveal correct then move next
    clearTimer();
    revealCorrectAfterTimeout();
    setTimeout(()=> goNext(), 400);
  } else {
    goNext();
  }
});

restartBtn.addEventListener('click', startQuiz);

// initial start
startQuiz();
