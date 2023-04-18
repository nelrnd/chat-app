export function getChatId(usersId) {
  return usersId.sort().join('-');
}

export function getUsersId(chatId) {
  return chatId.split('-');
}

export function getFormattedElapsedTime(time, currentTime) {
  const elapsedTimeInSeconds = Math.floor((currentTime - time) / 1000);
  const SECS_IN_YEAR = 31540000;
  const SECS_IN_MONTH = 2628000;
  const SECS_IN_WEEK = 604800;
  const SECS_IN_DAY = 86400;
  const SECS_IN_HOUR = 3600;
  const SECS_IN_MINUTE = 60;

  if (elapsedTimeInSeconds >= SECS_IN_YEAR) {
    return Math.floor(elapsedTimeInSeconds / SECS_IN_YEAR) + 'y';
  } else if (elapsedTimeInSeconds >= SECS_IN_MONTH) {
    return Math.floor(elapsedTimeInSeconds / SECS_IN_MONTH) + 'm';
  } else if (elapsedTimeInSeconds >= SECS_IN_WEEK) {
    return Math.floor(elapsedTimeInSeconds / SECS_IN_WEEK) + 'w';
  } else if (elapsedTimeInSeconds >= SECS_IN_DAY) {
    return Math.floor(elapsedTimeInSeconds / SECS_IN_DAY) + 'd';
  } else if (elapsedTimeInSeconds >= SECS_IN_HOUR) {
    return Math.floor(elapsedTimeInSeconds / SECS_IN_HOUR) + 'h';
  } else if (elapsedTimeInSeconds >= SECS_IN_MINUTE) {
    return Math.floor(elapsedTimeInSeconds / SECS_IN_MINUTE) + 'm';
  } else {
    return elapsedTimeInSeconds + 's';
  }
}
