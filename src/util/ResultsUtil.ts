const getFormattedTime = (timeInMs: number): string => {
  const hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
  const seconds = Math.floor((timeInMs / 1000) % 60);
  const centisecond = Math.floor((timeInMs / 10) % 100);

  let timeString = '';

  if (hours > 0) timeString += `${hours}:`;

  if (minutes < 10 && minutes >= 0) {
    if (hours > 0) timeString += '0';
    timeString += `${minutes}`;
  } else {
    timeString += minutes;
  }

  if (seconds < 10 && seconds >= 0) {
    timeString += `:0${seconds}`;
  } else {
    timeString += `:${seconds}`;
  }

  if (centisecond < 10 && centisecond >= 0) {
    timeString += `.0${centisecond}`;
  } else {
    timeString += `.${centisecond}`;
  }

  return timeString;
};

export default getFormattedTime;
