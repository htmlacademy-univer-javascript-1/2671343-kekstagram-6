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

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const createComments = () => {
  const comments = [];

  for (let i = 0; i < getRandomInteger(0, 30); i++) {
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
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
      message: message,
      name: COMMENT_NAMES[getRandomInteger(0, COMMENT_NAMES.length - 1)]
    });
  }
  return comments;
};

const createPhotoObject = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTS[getRandomInteger(0, DESCRIPTS.length - 1)],
  likes: getRandomInteger(15, 200),
  comments: createComments()
});

const generatePhotosArray = (n) => {
  const photos = [];

  for (let i = 0; i < n; i++) {
    photos.push(createPhotoObject(i));
  }
  return photos;
};

const photosArray = generatePhotosArray(25);

// console.log(photosArray);
