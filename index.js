const TelegramBotApi = require('node-telegram-bot-api');

const token = '7942818737:AAE3KJmpqW8wLIxsNhrg8EC3Sp_dPALwot4';

const bot = new TelegramBotApi(token, { polling: true });

const chats = {};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '0', callback_data: '0' },
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
      ],
      [
        { text: '3', callback_data: '3' },
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
      ],
      [
        { text: '6', callback_data: '6' },
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
      ],
      [{ text: '9', callback_data: '9' }],
    ],
  }),
};

const againOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: 'Играть ещё раз', callback_data: '/again' }]],
  }),
};

const startGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(
    chatId,
    'Отгадывай случайную цифру, которую я загадал.',
    gameOptions
  );
};

const start = () => {
  bot.setMyCommands([
    {
      command: '/start',
      description: 'Начальное приветствие и список команд.',
    },
    { command: '/info', description: 'Получить информацию о пользователе.' },
    { command: '/game', description: 'Игра "Угадай цифру".' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://sl.combot.org/line27017551f541_by_moe_sticker_bot/webp/0xe2ad90.webp'
      );
      return bot.sendMessage(
        chatId,
        'Приветствую! Ознакомься с моими командами.'
      );
    }

    if (text === '/info') {
      const lastName = msg.from.last_name || '';
      return bot.sendMessage(
        chatId,
        `Тебя зовут: ${msg.from.first_name} ${lastName}`
      );
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Попробуй одну из существующих команд.');
  });

  bot.on('callback_query', async (msg) => {
    const data = parseInt(msg.data, 10);
    const chatId = msg.message.chat.id;

    if (msg.data === '/again') {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}!`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению, бот загадал ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
