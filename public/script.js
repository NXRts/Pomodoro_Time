let timer;
let countdown;
let workTime = 25 * 60;
let breakTime = 5 * 60;
let isWorkTime = true;
let timeLeft = workTime;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const saveSettingsButton = document.getElementById('save-settings');
const notificationSound = document.getElementById('notification-sound');
const alarmSound = document.getElementById('alarm-sound');
const stopAlarmButton = document.getElementById('stop-alarm');

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
    const now = Date.now();
    const then = now + timeLeft * 1000;
    displayTime(timeLeft);

    countdown = setInterval(() => {
        timeLeft = Math.round((then - Date.now()) / 1000);
        displayTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            alarmSound.play();
            // Getaran saat alarm berbunyi
            if (navigator.vibrate) {
                navigator.vibrate([500, 500, 500]); // Getar 3 kali
            }
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workTime : breakTime;
            startTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(countdown);
    isWorkTime = true;
    timeLeft = workTime;
    displayTime(timeLeft);
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

    resetTimer();
}

function stopAlarm() {
    clearInterval(countdown);
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset suara alarm
    stopAlarmButton.style.display = "none"; // Sembunyikan tombol stop
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
saveSettingsButton.addEventListener('click', saveSettings);
stopAlarmButton.addEventListener('click', stopAlarm);

displayTime(timeLeft);
