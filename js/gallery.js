import { renderThumbnails } from './photos-render.js';
import { openFullscreenPhoto } from './fullscreen-photo.js';

const onThumbnailClick = (photosArray, evt) => {
  const thumbnail = evt.target.closest('.picture');

  if (thumbnail && thumbnail.dataset.index) {
    const index = parseInt(thumbnail.dataset.index, 10);
    openFullscreenPhoto(photosArray[index]);
  }
};

const initGallery = (photosArray, picturesContainer) => {
  renderThumbnails(photosArray, picturesContainer);

  picturesContainer.addEventListener('click', (evt) => {
    onThumbnailClick(photosArray, evt);
  });
};

export { initGallery };
