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
let isPaused = false;
let darkmode = false;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const saveSettingsButton = document.getElementById('save-settings');
const notificationSound = document.getElementById('notification-sound');
const alarmSound = document.getElementById('alarm-sound');
const stopAlarmButton = document.getElementById('stop-alarm');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const darkmodeButton = document.getElementById('darkmode');
const alertMessage = document.getElementById('alert-message');

const workHoursInput = document.getElementById('work-hours');
const workMinutesInput = document.getElementById('work-minutes');
const workSecondsInput = document.getElementById('work-seconds');
const breakHoursInput = document.getElementById('break-hours');
const breakMinutesInput = document.getElementById('break-minutes');
const breakSecondsInput = document.getElementById('break-seconds');

function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        return;
    }

    const now = Date.now();
    const then = now + timeLeft * 1000;
    displayTime(timeLeft);

    countdown = setInterval(() => {
        if (isPaused) {
            clearInterval(countdown);
            return;
        }

        timeLeft = Math.round((then - Date.now()) / 1000);
        displayTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            alarmSound.play();
            if (navigator.vibrate) {
                navigator.vibrate([500, 500, 500]);
            }

            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workTime : breakTime;
            startTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
}

function saveSettings() {
    const workHours = parseInt(workHoursInput.value) || 0;
    const workMinutes = parseInt(workMinutesInput.value) || 25;
    const workSeconds = parseInt(workSecondsInput.value) || 0;
    workTime = (workHours * 3600) + (workMinutes * 60) + workSeconds;

    const breakHours = parseInt(breakHoursInput.value) || 0;
    const breakMinutes = parseInt(breakMinutesInput.value) || 5;
    const breakSeconds = parseInt(breakSecondsInput.value) || 0;
    breakTime = (breakHours * 3600) + (breakMinutes * 60) + breakSeconds;

    timeLeft = workTime;
    displayTime(timeLeft);
}

function stopAlarm() {
    clearInterval(countdown);
    alarmSound.pause();
    alarmSound.currentTime = 0;
    stopAlarmButton.style.display = "none";
}

function setShortBreak() {
    if (isPaused) {
        breakTime = shortBreakTime;
        isWorkTime = false;
        timeLeft = breakTime;
        displayTime(timeLeft);
    } else {
        alertMessage.style.display = "block";
    }
}

function setLongBreak() {
    if (isPaused) {
        breakTime = longBreakTime;
        isWorkTime = false;
        timeLeft = breakTime;
        displayTime(timeLeft);
    } else {
        alertMessage.style.display = "block";
    }
}

function toggleDarkmode() {
    darkmode = !darkmode;
    document.body.classList.toggle('darkmode', darkmode);
    document.getElementById('app').classList.toggle('darkmode', darkmode);
}

function setActiveButton(button) {
    const buttons = [startButton, pauseButton, saveSettingsButton, shortBreakButton, longBreakButton, darkmodeButton];
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

startButton.addEventListener('click', () => {
    startTimer();
    setActiveButton(startButton);
});
pauseButton.addEventListener('click', () => {
    pauseTimer();
    setActiveButton(pauseButton);
});
saveSettingsButton.addEventListener('click', () => {
    saveSettings();
    setActiveButton(saveSettingsButton);
});
stopAlarmButton.addEventListener('click', () => {
    stopAlarm();
    setActiveButton(stopAlarmButton);
});
shortBreakButton.addEventListener('click', () => {
    setShortBreak();
    setActiveButton(shortBreakButton);
});
longBreakButton.addEventListener('click', () => {
    setLongBreak();
    setActiveButton(longBreakButton);
});
darkmodeButton.addEventListener('click', toggleDarkmode);

displayTime(timeLeft);
