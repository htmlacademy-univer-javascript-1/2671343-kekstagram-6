import { renderThumbnails } from './photos-render.js';
import { openFullscreenPhoto } from './fullscreen-photo.js';

let originalPhotos = [];
const picturesContainer = document.querySelector('.pictures');

const onThumbnailClick = (evt) => {
  const thumbnail = evt.target.closest('.picture');

  if (thumbnail && thumbnail.dataset.id) {
    const id = parseInt(thumbnail.dataset.id, 10);
    // Ищем фотографию по ID в исходном массиве
    const photoData = originalPhotos.find((photo) => photo.id === id);
    if (photoData) {
      openFullscreenPhoto(photoData);
    }
  }
};

// Инициализация галереи с исходными фотографиями
const initGallery = (photosArray) => {
  originalPhotos = photosArray;

  renderThumbnails(photosArray, picturesContainer);
  picturesContainer.addEventListener('click', onThumbnailClick);
};

// Рендер отфильтрованных фотографий
const renderFilteredPhotos = (filteredPhotos) => {
  renderThumbnails(filteredPhotos, picturesContainer);
};

export { initGallery, renderFilteredPhotos };
