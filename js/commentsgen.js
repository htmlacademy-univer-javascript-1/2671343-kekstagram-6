import { getRandomInteger } from './utils.js';

const MESSAGE_MAX = 30;
const IMG_ID_MAX = 6;

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const COMMENT_NAMES = [
  'Александр', 'Иван', 'Алексей', 'Максим', 'Дмитрий',
  'Михаил', 'Сергей', 'Ольга', 'Артём', 'Наталья',
  'Ирина', 'Елена', 'Андрей', 'Светлана', 'Ксения',
];

export const createComments = () => {
  const comments = [];

  for (let i = 0; i < getRandomInteger(0, MESSAGE_MAX); i++) {
    const messageCount = getRandomInteger(1, 2);
    let message = '';

    for (let j = 0; j < messageCount; j++) {
      const randomMessageIndex = getRandomInteger(0, MESSAGES.length - 1);
      message += MESSAGES[randomMessageIndex];
      if (j < messageCount - 1) {
        message += ' ';
      }
    }

    comments.push({
      id: i + 1,
      avatar: `img/avatar-${getRandomInteger(1, IMG_ID_MAX)}.svg`,
      message: message,
      name: COMMENT_NAMES[getRandomInteger(0, COMMENT_NAMES.length - 1)]
    });
  }
  return comments;
};
