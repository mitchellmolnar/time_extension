let startTime;
let isRunning = false;
let totalTime = 0;

const currentTimerElement = document.getElementById('current-timer');
const totalTimerElement = document.getElementById('total-timer');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');

function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function formatTotalTime(time) {
  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${padZero(days)}:${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}

function updateDisplay() {
  chrome.storage.local.get(['currentTime', 'totalTime', 'isRunning'], (result) => {
    if (result.currentTime !== undefined) {
      currentTimerElement.textContent = formatTime(result.currentTime);
    }
    if (result.totalTime !== undefined) {
      totalTime = result.totalTime;
      totalTimerElement.textContent = formatTotalTime(totalTime);
    }
    if (result.isRunning !== undefined) {
      isRunning = result.isRunning;
      startStopButton.textContent = isRunning ? 'Stop' : 'Start';
    }
  });
}

function startTimer() {
  chrome.runtime.sendMessage({ action: 'start' });
  isRunning = true;
  startStopButton.textContent = 'Stop';
}

function stopTimer() {
  chrome.runtime.sendMessage({ action: 'stop' });
  isRunning = false;
  startStopButton.textContent = 'Start';
}

startStopButton.addEventListener('click', () => {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'reset' });
  currentTimerElement.textContent = '00:00:00';
  totalTimerElement.textContent = '00:00:00:00';
  isRunning = false;
  startStopButton.textContent = 'Start';
});

// Update display every second
setInterval(updateDisplay, 1000);

// Initial display update
updateDisplay();