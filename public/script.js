/* 
| Selamat datang di web Pomodoro Timer! saya
| membuat ini untuk membantu Anda mengatur waktu
| bekerja dan istirahat dengan lebih efisien.
| 
    @NXRts
*/

let timer;
let countdown;
let workTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;
let breakTime = shortBreakTime;
let isWorkTime = true;
let timeLeft = workTime;
const TIMER_STATE = {
    STOPPED: 'STOPPED',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED'
};
let currentTimerState = TIMER_STATE.STOPPED;
let darkmode = false;

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const saveSettingsButton = document.getElementById("save-settings");
const notificationSound = document.getElementById("notification-sound");
const alarmSound = document.getElementById("alarm-sound");
const stopAlarmButton = document.getElementById("stop-alarm");
const shortBreakButton = document.getElementById("short-break");
const longBreakButton = document.getElementById("long-break");
const darkmodeButton = document.getElementById("darkmode");
const alertMessage = document.getElementById("alert-message");

const workHoursInput = document.getElementById("work-hours");
const workMinutesInput = document.getElementById("work-minutes");
const workSecondsInput = document.getElementById("work-seconds");
const breakHoursInput = document.getElementById("break-hours");
const breakMinutesInput = document.getElementById("break-minutes");
const breakSecondsInput = document.getElementById("break-seconds");

function displayTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  timerDisplay.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
}

function startTimer() {
  // If timer is already running, do nothing
  if (currentTimerState === TIMER_STATE.RUNNING) {
    return;
  }

  // Clear any existing interval to be safe
  clearInterval(countdown);
  
  currentTimerState = TIMER_STATE.RUNNING;

  const now = Date.now();
  // Calculate the target end time based on current timeLeft
  const then = now + timeLeft * 1000;

  // Display immediately
  displayTime(timeLeft);

  countdown = setInterval(() => {
    const secondsLeft = Math.ceil((then - Date.now()) / 1000);

    // Check if time is up
    if (secondsLeft < 0) {
      clearInterval(countdown);
      countdown = null;
      currentTimerState = TIMER_STATE.STOPPED;
      alarmSound.play();
      if (navigator.vibrate) {
        navigator.vibrate([500, 500, 500]);
      }

      // Toggle mode
      isWorkTime = !isWorkTime;
      timeLeft = isWorkTime ? workTime : breakTime;
      
      // Auto-start next session
      startTimer();
      return;
    }

    timeLeft = secondsLeft;
    displayTime(timeLeft);
  }, 1000);
}

function pauseTimer() {
    if (currentTimerState === TIMER_STATE.RUNNING) {
        currentTimerState = TIMER_STATE.PAUSED;
        clearInterval(countdown);
        countdown = null;
    }
}

function saveSettings() {
  // Stop the timer before applying settings to prevent conflicts
  if (currentTimerState !== TIMER_STATE.STOPPED) {
      stopAlarm(); // Uses stop logic to reset state
  }

  // Validate inputs (prevent negative numbers)
  let wHours = parseInt(workHoursInput.value) || 0;
  let wMinutes = parseInt(workMinutesInput.value) || 0; 
  let wSeconds = parseInt(workSecondsInput.value) || 0;
  if(wHours < 0) wHours = 0;
  if(wMinutes < 0) wMinutes = 0;
  if(wSeconds < 0) wSeconds = 0;
  
  // Default to 25 mins if everything is 0
  if (wHours === 0 && wMinutes === 0 && wSeconds === 0) {
      wMinutes = 25;
      workMinutesInput.value = 25;
  }

  workTime = wHours * 3600 + wMinutes * 60 + wSeconds;

  let bHours = parseInt(breakHoursInput.value) || 0;
  let bMinutes = parseInt(breakMinutesInput.value) || 0;
  let bSeconds = parseInt(breakSecondsInput.value) || 0;
  if(bHours < 0) bHours = 0;
  if(bMinutes < 0) bMinutes = 0;
  if(bSeconds < 0) bSeconds = 0;

  // Default brake to 5 min if 0
  if (bHours === 0 && bMinutes === 0 && bSeconds === 0) {
      bMinutes = 5;
      breakMinutesInput.value = 5;
  }

  breakTime = bHours * 3600 + bMinutes * 60 + bSeconds;

  // Update timeLeft based on current mode
  timeLeft = isWorkTime ? workTime : breakTime;
  displayTime(timeLeft);
}

function stopAlarm() {
  clearInterval(countdown);
  currentTimerState = TIMER_STATE.STOPPED;
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopAlarmButton.style.display = "none";
}

function setShortBreak() {
  if (currentTimerState !== TIMER_STATE.RUNNING) {
    breakTime = shortBreakTime;
    isWorkTime = false;
    timeLeft = breakTime;
    displayTime(timeLeft);
    currentTimerState = TIMER_STATE.STOPPED; // Ensure state is reset
  } else {
    alertMessage.style.display = "block";
  }
}

function setLongBreak() {
  if (currentTimerState !== TIMER_STATE.RUNNING) {
    breakTime = longBreakTime;
    isWorkTime = false;
    timeLeft = breakTime;
    displayTime(timeLeft);
    currentTimerState = TIMER_STATE.STOPPED; // Ensure state is reset
  } else {
    alertMessage.style.display = "block";
  }
}

function toggleDarkmode() {
  darkmode = !darkmode;
  document.body.classList.toggle("darkmode", darkmode);
  document.getElementById("app").classList.toggle("darkmode", darkmode);
}

function setActiveButton(button) {
  const buttons = [
    startButton,
    pauseButton,
    saveSettingsButton,
    shortBreakButton,
    longBreakButton,
    darkmodeButton,
  ];
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

startButton.addEventListener("click", () => {
  startTimer();
  setActiveButton(startButton);
});
pauseButton.addEventListener("click", () => {
  pauseTimer();
  setActiveButton(pauseButton);
});
saveSettingsButton.addEventListener("click", () => {
  saveSettings();
  setActiveButton(saveSettingsButton);
});
stopAlarmButton.addEventListener("click", () => {
  stopAlarm();
  setActiveButton(stopAlarmButton);
});
shortBreakButton.addEventListener("click", () => {
  setShortBreak();
  setActiveButton(shortBreakButton);
});
longBreakButton.addEventListener("click", () => {
  setLongBreak();
  setActiveButton(longBreakButton);
});
darkmodeButton.addEventListener("click", toggleDarkmode);

displayTime(timeLeft);
