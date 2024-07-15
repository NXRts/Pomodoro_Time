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
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');

function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
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
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workTime : breakTime;
            startTimer();  // Automatically start the next session
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
    workTime = parseInt(workTimeInput.value) * 60;
    breakTime = parseInt(breakTimeInput.value) * 60;
    resetTimer();
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
saveSettingsButton.addEventListener('click', saveSettings);

displayTime(timeLeft);
