// Array to store all the stopwatch data
let hours = new Array(3).fill(0);
let minutes = new Array(3).fill(0);
let seconds = new Array(3).fill(0);
let counts = new Array(3).fill(0);

// Create a Web Worker for the stopwatches
let worker = new Worker('stopwatch-worker.js');

// Function to save the stopwatch data to local storage
function saveStopwatchData(stopwatchNumber) {
  localStorage.setItem(`stopwatch${stopwatchNumber}_hours`, hours[stopwatchNumber]);
  localStorage.setItem(`stopwatch${stopwatchNumber}_minutes`, minutes[stopwatchNumber]);
  localStorage.setItem(`stopwatch${stopwatchNumber}_seconds`, seconds[stopwatchNumber]);
  localStorage.setItem(`stopwatch${stopwatchNumber}_counts`, counts[stopwatchNumber]);
}

// Function to retrieve the stopwatch data from local storage on page load
window.addEventListener('load', function () {
  for (let i = 0; i < 3; i++) {
    hours[i] = parseInt(localStorage.getItem(`stopwatch${i}_hours`) || '0', 10);
    minutes[i] = parseInt(localStorage.getItem(`stopwatch${i}_minutes`) || '0', 10);
    seconds[i] = parseInt(localStorage.getItem(`stopwatch${i}_seconds`) || '0', 10);
    counts[i] = parseInt(localStorage.getItem(`stopwatch${i}_counts`) || '0', 10);
    updateDisplay(i);
  }
});

// Function to update the stopwatch display
function updateDisplay(stopwatchNumber) {
  document.getElementById(`hr${stopwatchNumber}`).innerText = String(hours[stopwatchNumber]).padStart(2, '0');
  document.getElementById(`min${stopwatchNumber}`).innerText = String(minutes[stopwatchNumber]).padStart(2, '0');
  document.getElementById(`sec${stopwatchNumber}`).innerText = String(seconds[stopwatchNumber]).padStart(2, '0');
  document.getElementById(`count${stopwatchNumber}`).innerText = String(counts[stopwatchNumber]).padStart(2, '0');
}

// Function to update the stopwatch time
function updateStopwatch(stopwatchNumber) {
  counts[stopwatchNumber]++;

  if (counts[stopwatchNumber] === 100) {
    seconds[stopwatchNumber]++;
    counts[stopwatchNumber] = 0;
  }

  if (seconds[stopwatchNumber] === 60) {
    minutes[stopwatchNumber]++;
    seconds[stopwatchNumber] = 0;
  }

  if (minutes[stopwatchNumber] === 60) {
    hours[stopwatchNumber]++;
    minutes[stopwatchNumber] = 0;
    seconds[stopwatchNumber] = 0;
  }

  updateDisplay(stopwatchNumber);
  saveStopwatchData(stopwatchNumber);
}

// Function to start the stopwatch using Web Workers
function startStopwatch(stopwatchNumber) {
  worker.postMessage({ type: 'start', stopwatchNumber });
}

// Function to stop the stopwatch using Web Workers
function stopStopwatch(stopwatchNumber) {
  worker.postMessage({ type: 'stop', stopwatchNumber });
}

// Function to reset the stopwatch using Web Workers
function resetStopwatch(stopwatchNumber) {
  worker.postMessage({ type: 'reset', stopwatchNumber });

  hours[stopwatchNumber] = 0;
  minutes[stopwatchNumber] = 0;
  seconds[stopwatchNumber] = 0;
  counts[stopwatchNumber] = 0;
  updateDisplay(stopwatchNumber);
  saveStopwatchData(stopwatchNumber);
}

// Listen to messages from the Web Worker
worker.onmessage = function (event) {
  const { type, stopwatchNumber } = event.data;
  if (type === 'update') {
    updateStopwatch(stopwatchNumber);
  } else if (type === 'reset') {
    saveStopwatchData(stopwatchNumber);
  }
};

// Event listeners for each stopwatch
const startButtons = document.querySelectorAll('.start-btn');
const stopButtons = document.querySelectorAll('.stop-btn');
const resetButtons = document.querySelectorAll('.reset-btn');

startButtons.forEach(button => {
  button.addEventListener('click', function () {
    const stopwatchNumber = parseInt(button.getAttribute('data-id')) - 1;
    startStopwatch(stopwatchNumber);
  });
});

stopButtons.forEach(button => {
  button.addEventListener('click', function () {
    const stopwatchNumber = parseInt(button.getAttribute('data-id')) - 1;
    stopStopwatch(stopwatchNumber);
  });
});

resetButtons.forEach(button => {
  button.addEventListener('click', function () {
    const stopwatchNumber = parseInt(button.getAttribute('data-id')) - 1;
    resetStopwatch(stopwatchNumber);
  });
});
