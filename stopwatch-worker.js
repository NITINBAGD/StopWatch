let timerIntervals = new Array(3).fill(null);

function updateStopwatch(stopwatchNumber) {
  postMessage({ type: 'update', stopwatchNumber });
}

self.onmessage = function (event) {
  const { type, stopwatchNumber } = event.data;
  if (type === 'start') {
    if (!timerIntervals[stopwatchNumber]) {
      timerIntervals[stopwatchNumber] = setInterval(() => updateStopwatch(stopwatchNumber), 10);
    }
  } else if (type === 'stop') {
    if (timerIntervals[stopwatchNumber]) {
      clearInterval(timerIntervals[stopwatchNumber]);
      timerIntervals[stopwatchNumber] = null;
    }
  } else if (type === 'reset') {
    if (timerIntervals[stopwatchNumber]) {
      clearInterval(timerIntervals[stopwatchNumber]);
      timerIntervals[stopwatchNumber] = null;
    }
    postMessage({ type: 'reset', stopwatchNumber });
  }
};
