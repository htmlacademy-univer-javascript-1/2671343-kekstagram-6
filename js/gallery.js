import { renderThumbnails } from './photos-render.js';
import { openFullscreenPhoto } from './fullscreen-photo.js';

const initGallery = (photosArray, picturesContainer) => {

  renderThumbnails(photosArray, picturesContainer);

  const onThumbnailClick = (evt) => {
    const thumbnail = evt.target.closest('.picture');

    if (thumbnail && thumbnail.dataset.index) {
      const index = parseInt(thumbnail.dataset.index, 10);

      if (!isNaN(index) && index >= 0 && index < photosArray.length) {
        openFullscreenPhoto(photosArray[index]);
      }
    }
  };

  picturesContainer.addEventListener('click', onThumbnailClick);
};

export { initGallery };
