export function getChatId(userIds) {
  return userIds.sort().join('-');
}

export function getUserIds(chatId) {
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
  } else if (elapsedTimeInSeconds > 0) {
    return elapsedTimeInSeconds + 's';
  } else {
    return 'now';
  }
}

export function getFormattedDate(time, currentTime) {
  const date = new Date(time);
  const currentDate = new Date(currentTime);

  if (currentDate.getDate() > date.getDate()) {
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    return [mm, dd, yyyy].join('/');
  } else {
    let hh = date.getHours();
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12;
    hh = hh ? hh : 12;
    hh = hh.toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}${ampm}`;
  }
}
