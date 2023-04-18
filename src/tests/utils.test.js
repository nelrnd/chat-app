import {
  getChatId,
  getUsersId,
  getFormattedElapsedTime,
  getFormattedDate,
} from '../utils';

describe('getChatId', () => {
  it('gets chat Id from users Id (1)', () => {
    expect(getChatId(['a', 'b'])).toBe('a-b');
  });
  it('gets chat Id from users Id (2)', () => {
    expect(getChatId(['b', 'a'])).toBe('a-b');
  });
  it('gets chat Id from users Id (3)', () => {
    const uid1 = 'zPnA9VsqrwWqSpONE7JkyZfhO2y2';
    const uid2 = 'jphMUrQdRhgULMsmUEoi9S478FG2';
    const result = 'jphMUrQdRhgULMsmUEoi9S478FG2-zPnA9VsqrwWqSpONE7JkyZfhO2y2';
    expect(getChatId([uid1, uid2])).toBe(result);
  });
});

describe('getUsersId', () => {
  it('gets users Id from chatId (1)', () => {
    expect(getUsersId('abc-def')).toEqual(['abc', 'def']);
  });
  it('gets users Id from chatId (2)', () => {
    const chatId = 'jphMUrQdRhgULMsmUEoi9S478FG2-zPnA9VsqrwWqSpONE7JkyZfhO2y2';
    const uid1 = 'jphMUrQdRhgULMsmUEoi9S478FG2';
    const uid2 = 'zPnA9VsqrwWqSpONE7JkyZfhO2y2';
    expect(getUsersId(chatId)).toEqual([uid1, uid2]);
  });
});

describe('Get formatted elapsed time', () => {
  const currentTime = 1681814821848;
  it('returns 3 years', () => {
    const time = new Date('03/04/2001').getTime();
    const result = '22y';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
  it('returns 4 months', () => {
    const time = new Date('12/17/2022').getTime();
    const result = '4m';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
  it('returns 2 weeks', () => {
    const time = new Date('04/04/2023').getTime();
    const result = '2w';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
  it('returns 6 days', () => {
    const time = new Date('04/12/2023').getTime();
    const result = '6d';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
  it('returns 2 hours', () => {
    const time = 1681807621848;
    const result = '2h';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
  it('returns 3 minutes', () => {
    const time = 1681814641848;
    const result = '3m';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
  it('returns 6 seconds', () => {
    const time = 1681814815848;
    const result = '6s';
    expect(getFormattedElapsedTime(time, currentTime)).toBe(result);
  });
});

describe('Get formatted date', () => {
  const currentTime = 1681818323375;
  it('returns date in MM:DD:YYYY if day is not today', () => {
    const time = new Date('04/12/2023');
    const result = '04/12/2023';
    expect(getFormattedDate(time, currentTime)).toBe(result);
  });
  it('returns date in HH:MMPM format', () => {
    const time = currentTime;
    const result = '01:45PM';
    expect(getFormattedDate(time, currentTime)).toBe(result);
  });
  it('returns date in HH:MMAM format', () => {
    const time = currentTime - 3600 * 3 * 1000;
    const result = '10:45AM';
    expect(getFormattedDate(time, currentTime)).toBe(result);
  });
});
