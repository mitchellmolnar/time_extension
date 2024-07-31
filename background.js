let startTime;
let totalTime = 0;
let isRunning = false;

function updateTimer() {
  if (isRunning) {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    chrome.storage.local.set({ currentTime, totalTime, isRunning, startTime });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'start':
      if (!isRunning) {
        isRunning = true;
        startTime = Date.now();
        chrome.storage.local.set({ isRunning, startTime });
      }
      break;
    case 'stop':
      if (isRunning) {
        isRunning = false;
        const sessionTime = Math.floor((Date.now() - startTime) / 1000);
        totalTime += sessionTime;
        chrome.storage.local.set({ isRunning, totalTime });
      }
      break;
    case 'reset':
      isRunning = false;
      totalTime = 0;
      chrome.storage.local.set({ isRunning, totalTime, currentTime: 0 });
      break;
  }
  sendResponse({ success: true });
});

setInterval(updateTimer, 1000);

// Load saved state
chrome.storage.local.get(['isRunning', 'startTime', 'totalTime'], (result) => {
  if (result.isRunning) {
    isRunning = result.isRunning;
    startTime = result.startTime;
  }
  if (result.totalTime) {
    totalTime = result.totalTime;
  }
});