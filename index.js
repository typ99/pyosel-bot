import TelegramBot from 'node-telegram-bot-api';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const { TELEGRAM_BOT_TOKEN, UNSPLASH_TOKEN } = process.env;

const unsplash = createApi({
  accessKey: UNSPLASH_TOKEN,
  fetch: nodeFetch,
});

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const keyboard = [
  [
    {
      text: 'Пёсель!',
      callback_data: 'dog',
    },
  ],
];

const getImage = () => {
  unsplash.photos.getRandom({
    query: 'happy dog',
  })
    .then((result) => {
      if (result.type === 'success') {
        const data = result.response;
        fs.writeFileSync('photo.txt', data.urls.regular);
      }
    });
  const photoOfDog = fs.readFileSync('photo.txt', 'utf-8');
  return photoOfDog;
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Привет, я рад тебя видеть! Чтобы начать, нажми на кнопку 'Пёсель!' и получи заряд радости :)", {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  bot.sendPhoto(
    chatId,
    getImage(),
    {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    },
  );
});
