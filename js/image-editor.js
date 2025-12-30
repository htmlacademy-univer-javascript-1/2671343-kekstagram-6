const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const preview = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const fileInput = document.querySelector('.img-upload__input');

// Настройки масштаба
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
let currentScale = 100;

// Настройки эффектов согласно ТЗ
const EFFECTS = {
  none: {
    name: 'none',
    className: 'effects__preview--none',
    min: 0,
    max: 100,
    step: 1
  },
  chrome: {
    name: 'grayscale',
    className: 'effects__preview--chrome',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    name: 'sepia',
    className: 'effects__preview--sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    name: 'invert',
    className: 'effects__preview--marvin',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    name: 'blur',
    className: 'effects__preview--phobos',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    name: 'brightness',
    className: 'effects__preview--heat',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
};

let currentEffect = 'none';
let slider = null;

// Преобразование значения слайдера (0-100) в значение эффекта
const calculateEffectValue = (effectName, sliderValue) => {
  switch (effectName) {
    case 'chrome':
      return (sliderValue / 100).toFixed(1);
    case 'sepia':
      return (sliderValue / 100).toFixed(1);
    case 'marvin':
      return Math.round(sliderValue);
    case 'phobos':
      return (sliderValue * 0.03).toFixed(1);
    case 'heat':
      return (1 + sliderValue * 0.02).toFixed(1);
    default:
      return sliderValue;
  }
};

// Применение эффекта
const applyEffect = (sliderValue) => {
  const effect = EFFECTS[currentEffect];

  if (currentEffect === 'none') {
    preview.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  const effectValue = calculateEffectValue(currentEffect, sliderValue);
  const effectString = `${effect.name}(${effectValue}${effect.unit})`;

  preview.style.filter = effectString;
  effectLevelValue.value = effectValue;
};

// Инициализация слайдера
const initSlider = () => {
  // Проверяем, не инициализирован ли слайдер уже
  if (slider) {
    slider.destroy();
  }

  slider = noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => parseFloat(value)
    }
  });

  slider.on('update', () => {
    const sliderValue = slider.get();
    applyEffect(sliderValue);
  });
};

// Обновление масштаба
const updateScale = () => {
  scaleControl.setAttribute('value', `${currentScale}%`);
  preview.style.transform = `scale(${currentScale / 100})`;
};

// Уменьшение масштаба
const onScaleSmallerClick = () => {
  if (currentScale > SCALE_MIN) {
    currentScale -= SCALE_STEP;
    updateScale();
  }
};

// Увеличение масштаба
const onScaleBiggerClick = () => {
  if (currentScale < SCALE_MAX) {
    currentScale += SCALE_STEP;
    updateScale();
  }
};

// Смена эффекта
const onEffectChange = (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;
    const effect = EFFECTS[currentEffect];

    // Обновляем классы превью
    preview.className = '';
    preview.classList.add(effect.className);

    if (currentEffect === 'none') {
      // Скрываем слайдер для эффекта "Оригинал"
      effectLevel.classList.add('hidden');
      preview.style.filter = 'none';
      effectLevelValue.value = '';
    } else {
      // Показываем слайдер для других эффектов
      effectLevel.classList.remove('hidden');

      // Обновляем настройки слайдера
      slider.updateOptions({
        range: {
          min: 0,
          max: 100
        },
        start: 100,
        step: 1
      });

      // Применяем эффект с максимальной интенсивностью
      applyEffect(100);
    }
  }
};

// Загрузка изображения в превью
const loadImagePreview = () => {
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = (e) => {
      preview.src = e.target.result;

      // Обновляем превью эффектов
      const effectPreviews = document.querySelectorAll('.effects__preview');
      effectPreviews.forEach((previewElement) => {
        previewElement.style.backgroundImage = `url(${e.target.result})`;
      });
    };

    reader.readAsDataURL(file);
  }
};

// Инициализация редактора изображений
const initImageEditor = () => {
  // Загружаем выбранное изображение
  loadImagePreview();

  // Инициализация слайдера
  initSlider();

  // Настройка масштаба
  updateScale();
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);

  // Настройка эффектов
  effectsList.addEventListener('change', onEffectChange);

  // Скрываем слайдер по умолчанию (для эффекта "Оригинал")
  effectLevel.classList.add('hidden');

  // Сбрасываем значение эффекта
  effectLevelValue.setAttribute('value', '');

  // Убедимся, что выбран эффект "Оригинал"
  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }
};

// Сброс редактора
const resetImageEditor = () => {
  // Сброс масштаба
  currentScale = 100;
  scaleControl.setAttribute('value', '100%');
  preview.style.transform = 'scale(1)';

  // Сброс эффектов
  currentEffect = 'none';
  const noneEffect = effectsList.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  preview.style.filter = 'none';
  preview.className = '';
  effectLevel.classList.add('hidden');
  effectLevelValue.value = '';

  // Сброс слайдера
  if (slider) {
    slider.set(100);
  }

  // Восстановление дефолтного изображения
  preview.src = 'img/upload-default-image.jpg';

  // Сброс превью эффектов
  const effectPreviews = document.querySelectorAll('.effects__preview');
  effectPreviews.forEach((previewElement) => {
    previewElement.style.backgroundImage = '';
  });

  // Сброс file input
  fileInput.value = '';
};

export { initImageEditor, resetImageEditor };
