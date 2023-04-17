export function getChatId(usersId) {
  return usersId.sort().join('-');
}

export function getUsersId(chatId) {
  return chatId.split('-');
}
