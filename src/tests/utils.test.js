import { getChatId, getUsersId } from '../utils';

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
