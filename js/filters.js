import { renderFilteredPhotos } from './gallery.js';

const FilterType = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filterContainer = document.querySelector('.img-filters');
const filterButtons = filterContainer.querySelectorAll('.img-filters__button');

// Функция для устранения дребезга
const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Функции фильтрации
const filterDefault = (photos) => [...photos];

const filterRandom = (photos) => {
  // Создаем копию массива и перемешиваем
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  // Возвращаем первые 10 уникальных фотографий
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const filterDiscussed = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

// Объект с функциями фильтрации
const filterFunctions = {
  [FilterType.DEFAULT]: filterDefault,
  [FilterType.RANDOM]: filterRandom,
  [FilterType.DISCUSSED]: filterDiscussed,
};

let currentFilter = FilterType.DEFAULT;
let originalPhotos = [];

// Применение фильтра и отрисовка
const applyFilter = () => {
  const filteredPhotos = filterFunctions[currentFilter](originalPhotos);
  renderFilteredPhotos(filteredPhotos);
};

// Debounced версия функции применения фильтра
const debouncedApplyFilter = debounce(applyFilter);

// Обновление активной кнопки фильтра
const updateActiveFilterButton = (newFilterType) => {
  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  const activeButton = document.querySelector(`#filter-${newFilterType}`);
  if (activeButton) {
    activeButton.classList.add('img-filters__button--active');
  }
};

// Обработчик клика на кнопки фильтров
const onFilterButtonClick = (evt) => {
  if (!evt.target.classList.contains('img-filters__button')) {
    return;
  }

  const newFilterType = evt.target.id.replace('filter-', '');

  if (newFilterType === currentFilter) {
    return;
  }

  currentFilter = newFilterType;
  updateActiveFilterButton(newFilterType);
  debouncedApplyFilter();
};

// Показ блока фильтров
const showFilters = () => {
  filterContainer.classList.remove('img-filters--inactive');
};

// Инициализация фильтров
const initFilters = (photos) => {
  originalPhotos = photos;

  // Показываем блок фильтров
  showFilters();

  // Устанавливаем обработчик на все кнопки фильтров
  filterButtons.forEach((button) => {
    button.addEventListener('click', onFilterButtonClick);
  });

  // Устанавливаем фильтр по умолчанию
  updateActiveFilterButton(FilterType.DEFAULT);
};

export { initFilters, FilterType };
