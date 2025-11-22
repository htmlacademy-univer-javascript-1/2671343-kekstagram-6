import { getRandomInteger } from './utils.js';
import { createComments } from './comments-gen.js';

const PHOTOS_AMOUNT = 25;
const LIKES_MIN = 15;
const LIKES_MAX = 200;

const DESCRIPTS = [
  'Горный пейзаж',
  'Уютный вечер',
  'Прекрасный закат',
  'Прогулка по лесу',
  'Кофе в любимой кофейне',
  'Уличное искусство и граффити',
  'Городские огни ночью',
  'Спортивные достижения и тренировки',
  'Творческий процесс в мастерской',
  'Отдых на природе с друзьями',
  'Кулинарные эксперименты',
  'Вечер с гитарой',
  'Морской берег',
  'Раннее утро в городе',
  'Путешествие по стране на машине',
  'Фестиваль и праздничное настроение',
  'Спокойный день на даче',
];

export const createPhotoObject = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTS[getRandomInteger(0, DESCRIPTS.length - 1)],
  likes: getRandomInteger(LIKES_MIN, LIKES_MAX),
  comments: createComments()
});

export const generatePhotosArray = () => {
  const photos = [];

  for (let i = 0; i < PHOTOS_AMOUNT; i++) {
    photos.push(createPhotoObject(i));
  }
  return photos;
};
