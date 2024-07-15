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
let breakTime = 5 * 60;
let isWorkTime = true;
let timeLeft = workTime;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const saveSettingsButton = document.getElementById('save-settings');
const notificationSound = document.getElementById('notification-sound');
const alarmSound = document.getElementById('alarm-sound'); // Tambahkan ini
const stopAlarmButton = document.getElementById('stop-alarm'); // Tambahkan ini

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
            if (isWorkTime) {
                notificationSound.play();
            } else {
                startAlarm();
            }
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workTime : breakTime;
            startTimer();
        }
    }, 1000);
}

function startAlarm() {
    alarmSound.loop = true; // Mengatur alarm agar loop
    alarmSound.play();
    stopAlarmButton.style.display = 'block'; // Tampilkan tombol stop alarm
}

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset waktu alarm
    stopAlarmButton.style.display = 'none'; // Sembunyikan tombol stop alarm
}

function resetTimer() {
    clearInterval(countdown);
    isWorkTime = true;
    timeLeft = workTime;
    displayTime(timeLeft);
    stopAlarm(); // Pastikan alarm berhenti saat reset
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

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
saveSettingsButton.addEventListener('click', saveSettings);
stopAlarmButton.addEventListener('click', stopAlarm); // Tambahkan event listener untuk tombol stop alarm

displayTime(timeLeft);
