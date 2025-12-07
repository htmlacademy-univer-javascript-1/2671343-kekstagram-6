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

// Настройки эффектов
const EFFECTS = {
  none: { filter: 'none', min: 0, max: 0, step: 0, unit: '' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '' }
};

let currentEffect = 'none';
let slider = null;

// Применение эффекта
const applyEffect = (value) => {
  const effect = EFFECTS[currentEffect];

  if (currentEffect === 'none') {
    preview.style.filter = 'none';
    return;
  }

  const actualValue = effect.min + (value / 100) * (effect.max - effect.min);
  preview.style.filter = `${effect.filter}(${actualValue}${effect.unit})`;
};

// Инициализация слайдера
const initSlider = () => {
  slider = noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1),
      from: (value) => parseFloat(value)
    }
  });

  slider.on('update', () => {
    const value = slider.get();
    effectLevelValue.value = value;
    applyEffect(value);
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

    if (currentEffect === 'none') {
      effectLevel.classList.add('hidden');
      preview.style.filter = 'none';
    } else {
      effectLevel.classList.remove('hidden');
      applyEffect(100);
      slider.set(100);
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

  // Скрываем слайдер по умолчанию
  effectLevel.classList.add('hidden');
};

// Сброс редактора
const resetImageEditor = () => {
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
  effectLevel.classList.add('hidden');

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
};

export { initImageEditor, resetImageEditor };
