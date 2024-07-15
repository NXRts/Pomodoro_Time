let timer;
let countdown;
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
let timeLeft = 25 * 60;

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
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(countdown);
    timeLeft = 25 * 60;
    displayTime(timeLeft);
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

displayTime(timeLeft);
