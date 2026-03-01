// Pomodoro Timer Logic
let countdown;

// Default Times (in seconds)
const DEFAULT_WORK = 25 * 60;
const DEFAULT_SHORT_BREAK = 5 * 60;
const DEFAULT_LONG_BREAK = 15 * 60;

// State Variables
let workTime = DEFAULT_WORK;
let shortBreakTime = DEFAULT_SHORT_BREAK;
let longBreakTime = DEFAULT_LONG_BREAK;
let timeLeft = workTime;

const MODES = {
  WORK: 'work',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break'
};
let currentMode = MODES.WORK;

const TIMER_STATE = {
  STOPPED: 'STOPPED',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED'
};
let currentTimerState = TIMER_STATE.STOPPED;
let isDarkTheme = false;

// DOM Elements
const timerDisplay = document.getElementById("timer");
const modeLabel = document.getElementById("mode-label");
const statusBadge = document.getElementById("status-badge");
const alertMessage = document.getElementById("alert-message");

// Buttons Container Elements
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const stopAlarmBtn = document.getElementById("stop-alarm");
const workModeBtn = document.getElementById("work-mode");
const shortBreakBtn = document.getElementById("short-break");
const longBreakBtn = document.getElementById("long-break");
const themeToggleBtn = document.getElementById("darkmode");
const settingsToggleBtn = document.getElementById("toggle-settings");
const settingsContent = document.querySelector(".settings-content");
const saveSettingsBtn = document.getElementById("save-settings");

// Audio
const alarmSound = document.getElementById("alarm-sound");

// Settings Inputs
const workDurationInput = document.getElementById("work-duration");
const shortBreakDurationInput = document.getElementById("short-break-duration");
const longBreakDurationInput = document.getElementById("long-break-duration");

// SVG Ring Elements
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

// Initialize SVG Ring
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Update Title and Timer Display
function updateDisplayTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  timerDisplay.textContent = formattedTime;

  // Update Document title
  let modeText = 'Work';
  if (currentMode === MODES.SHORT_BREAK) modeText = 'Short Break';
  if (currentMode === MODES.LONG_BREAK) modeText = 'Long Break';

  document.title = `(${formattedTime}) ${modeText} - Pomodoro`;
}

function getTotalTimeForCurrentMode() {
  switch (currentMode) {
    case MODES.WORK: return workTime;
    case MODES.SHORT_BREAK: return shortBreakTime;
    case MODES.LONG_BREAK: return longBreakTime;
    default: return workTime;
  }
}

function updateRing() {
  const total = getTotalTimeForCurrentMode();
  const percent = (timeLeft / total) * 100;
  setProgress(percent);
}

function changeMode(mode) {
  if (currentTimerState === TIMER_STATE.RUNNING) {
    alertMessage.style.display = "flex";
    setTimeout(() => alertMessage.style.display = "none", 3000);
    return;
  }

  currentMode = mode;
  timeLeft = getTotalTimeForCurrentMode();
  updateDisplayTime(timeLeft);
  updateRing();

  // Update UI Labels
  const modeBtns = [workModeBtn, shortBreakBtn, longBreakBtn];
  modeBtns.forEach(btn => btn.classList.remove('active'));

  if (mode === MODES.WORK) {
    statusBadge.textContent = "Session: Work";
    modeLabel.textContent = "Focus";
    workModeBtn.classList.add('active');
  } else if (mode === MODES.SHORT_BREAK) {
    statusBadge.textContent = "Session: Short Break";
    modeLabel.textContent = "Relax";
    shortBreakBtn.classList.add('active');
  } else if (mode === MODES.LONG_BREAK) {
    statusBadge.textContent = "Session: Long Break";
    modeLabel.textContent = "Rest";
    longBreakBtn.classList.add('active');
  }
}

function startTimer() {
  if (currentTimerState === TIMER_STATE.RUNNING) return;

  clearInterval(countdown);
  currentTimerState = TIMER_STATE.RUNNING;

  startBtn.disabled = true;
  pauseBtn.disabled = false;

  const now = Date.now();
  const then = now + timeLeft * 1000;

  countdown = setInterval(() => {
    const secondsLeft = Math.ceil((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      currentTimerState = TIMER_STATE.STOPPED;

      startBtn.disabled = false;
      pauseBtn.disabled = true;

      playAlarm();

      // Auto Switch Mode
      if (currentMode === MODES.WORK) {
        changeMode(MODES.SHORT_BREAK);
      } else {
        changeMode(MODES.WORK);
      }
      return;
    }

    timeLeft = secondsLeft;
    updateDisplayTime(timeLeft);
    updateRing();
  }, 1000);
}

function pauseTimer() {
  if (currentTimerState === TIMER_STATE.RUNNING) {
    clearInterval(countdown);
    currentTimerState = TIMER_STATE.PAUSED;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
}

function playAlarm() {
  alarmSound.currentTime = 0;
  alarmSound.play().catch(e => console.log("Audio play blocked", e));
  stopAlarmBtn.classList.remove("hide");
  if (navigator.vibrate) navigator.vibrate([500, 500, 500]);
}

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopAlarmBtn.classList.add("hide");
}

function toggleOptions() {
  settingsContent.classList.toggle("hide");
}

function loadSettings() {
  const saved = localStorage.getItem('pomodoroSettings');
  if (saved) {
    const data = JSON.parse(saved);
    workTime = (data.work || 25) * 60;
    shortBreakTime = (data.shortBreak || 5) * 60;
    longBreakTime = (data.longBreak || 15) * 60;
    isDarkTheme = data.darkmode || false;

    workDurationInput.value = data.work || 25;
    shortBreakDurationInput.value = data.shortBreak || 5;
    longBreakDurationInput.value = data.longBreak || 15;
  }

  applyTheme();
  // Ensure mode is reapplied with loaded times
  changeMode(currentMode);
}

function saveSettings() {
  if (currentTimerState !== TIMER_STATE.STOPPED) {
    pauseTimer();
  }

  const w = parseInt(workDurationInput.value) || 25;
  const sb = parseInt(shortBreakDurationInput.value) || 5;
  const lb = parseInt(longBreakDurationInput.value) || 15;

  workTime = w * 60;
  shortBreakTime = sb * 60;
  longBreakTime = lb * 60;

  localStorage.setItem('pomodoroSettings', JSON.stringify({
    work: w,
    shortBreak: sb,
    longBreak: lb,
    darkmode: isDarkTheme
  }));

  changeMode(currentMode); // Reset with new time
  toggleOptions();
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();

  // Save to local storage
  const saved = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
  saved.darkmode = isDarkTheme;
  localStorage.setItem('pomodoroSettings', JSON.stringify(saved));
}

function applyTheme() {
  if (isDarkTheme) {
    document.body.classList.add("darkmode");
    themeToggleBtn.innerHTML = '<i data-feather="sun"></i>';
  } else {
    document.body.classList.remove("darkmode");
    themeToggleBtn.innerHTML = '<i data-feather="moon"></i>';
  }
  // Re-render feather icons since we replaced innerHTML
  if (window.feather) { feather.replace(); }
}

// Event Listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
stopAlarmBtn.addEventListener("click", stopAlarm);

workModeBtn.addEventListener("click", () => changeMode(MODES.WORK));
shortBreakBtn.addEventListener("click", () => changeMode(MODES.SHORT_BREAK));
longBreakBtn.addEventListener("click", () => changeMode(MODES.LONG_BREAK));

themeToggleBtn.addEventListener("click", toggleTheme);
settingsToggleBtn.addEventListener("click", toggleOptions);
saveSettingsBtn.addEventListener("click", saveSettings);

// Initialization
loadSettings();

