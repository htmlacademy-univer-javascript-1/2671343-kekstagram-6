import { generatePhotosArray } from './photos-gen.js';
import { renderThumbnails } from './photos-render.js';

const photosArray = generatePhotosArray();
const picturesContainer = document.querySelector('.pictures');

renderThumbnails(photosArray, picturesContainer);

export { photosArray };
