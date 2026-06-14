const state = {
  selectedProfile: null,
  correctAnswerIndex: null
};

const els = {
  profileCards: document.querySelectorAll('.profile-card'),
  topicInput: document.getElementById('topicInput'),
  generateBtn: document.getElementById('generateBtn'),
  statusText: document.getElementById('statusText'),
  loading: document.getElementById('loading'),
  errorBox: document.getElementById('errorBox'),
  result: document.getElementById('result'),
  modeBadge: document.getElementById('modeBadge'),
  explanation: document.getElementById('explanation'),
  quiz: document.getElementById('quiz'),
  quizQuestion: document.getElementById('quizQuestion'),
  quizOptions: document.getElementById('quizOptions'),
  quizFeedback: document.getElementById('quizFeedback')
};

function init() {
  els.profileCards.forEach(card => {
    card.addEventListener('click', () => selectProfile(card.dataset.profile));
  });

  document.querySelectorAll('[data-topic]').forEach(button => {
    button.addEventListener('click', () => {
      els.topicInput.value = button.dataset.topic;
      updateReadyState();
      els.topicInput.focus();
    });
  });

  els.topicInput.addEventListener('input', updateReadyState);
  els.generateBtn.addEventListener('click', generateExplanation);
  updateReadyState();
}

function selectProfile(profileName) {
  state.selectedProfile = profileName;
  const profile = window.PROFILES[profileName];

  document.documentElement.style.setProperty('--accent', profile.color);
  document.documentElement.style.setProperty('--accent-light', profile.light);
  document.documentElement.style.setProperty('--accent-dark', profile.dark);

  els.profileCards.forEach(card => {
    card.classList.toggle('selected', card.dataset.profile === profileName);
  });

  updateReadyState();
}

function updateReadyState() {
  const hasProfile = Boolean(state.selectedProfile);
  const hasTopic = Boolean(els.topicInput.value.trim());
  const ready = hasProfile && hasTopic;

  els.generateBtn.disabled = !ready;

  if (!hasProfile && !hasTopic) els.statusText.textContent = 'Select a profile and enter a topic to continue.';
  else if (!hasProfile) els.statusText.textContent = 'Select a learner profile first.';
  else if (!hasTopic) els.statusText.textContent = 'Enter a STEM topic or pick an example.';
  else els.statusText.textContent = 'Ready. Click the button to generate.';
}

async function generateExplanation() {
  const topic = els.topicInput.value.trim();
  const profile = window.PROFILES[state.selectedProfile];

  hide(els.errorBox);
  hide(els.result);
  hide(els.quiz);
  show(els.loading);
  els.generateBtn.disabled = true;

  try {
    const data = await callXAI(topic, profile.systemPrompt);
    renderResult(data, profile);
  } catch (error) {
    showError(error.message);
  } finally {
    hide(els.loading);
    updateReadyState();
  }
}

async function callXAI(topic, systemPrompt) {
  const response = await fetch(window.APP_CONFIG.XAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: window.APP_CONFIG.XAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Explain this STEM topic: ${topic}` }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    const message = details.error?.message || `xAI API error ${response.status}`;
    throw new Error(message);
  }

  const apiData = await response.json();
  const rawText = apiData.choices?.[0]?.message?.content;

  if (!rawText) throw new Error('xAI returned an empty response.');

  return parseJSON(rawText);
}

function parseJSON(rawText) {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        throw new Error('The AI response was not valid JSON. Try again.');
      }
    }
    throw new Error('The AI response was not valid JSON. Try again.');
  }
}

function renderResult(data, profile) {
  const explanationText = data.explanation || 'No explanation returned.';
  const quiz = data.quiz;

  els.modeBadge.textContent = profile.label;
  els.modeBadge.style.backgroundColor = profile.light;
  els.modeBadge.style.color = profile.dark;

  els.explanation.className = profile.contentClass;
  els.explanation.innerHTML = markdownToHTML(explanationText);
  show(els.result);

  if (quiz) renderQuiz(quiz);
}

function renderQuiz(quiz) {
  state.correctAnswerIndex = Number(quiz.correct);
  els.quizQuestion.textContent = quiz.question || 'Quick question';
  els.quizOptions.innerHTML = '';
  hide(els.quizFeedback);

  (quiz.options || []).forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(index));
    els.quizOptions.appendChild(button);
  });

  show(els.quiz);
}

function checkAnswer(selectedIndex) {
  const buttons = els.quizOptions.querySelectorAll('button');

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === state.correctAnswerIndex) button.classList.add('correct');
    if (index === selectedIndex && index !== state.correctAnswerIndex) button.classList.add('wrong');
  });

  const isCorrect = selectedIndex === state.correctAnswerIndex;
  els.quizFeedback.textContent = isCorrect
    ? '🎉 Correct! Great understanding.'
    : `Not quite. The correct answer is ${String.fromCharCode(65 + state.correctAnswerIndex)}.`;

  els.quizFeedback.className = `feedback ${isCorrect ? 'good' : 'bad'}`;
  show(els.quizFeedback);
}

function markdownToHTML(text) {
  return escapeHTML(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split(/\n{2,}/)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}

function showError(message) {
  els.errorBox.textContent = message;
  show(els.errorBox);
}

init();
