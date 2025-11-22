import { generatePhotosArray } from './photos-gen.js';
import { initGallery } from './gallery.js';

const photosArray = generatePhotosArray();
const picturesContainer = document.querySelector('.pictures');

const gallery = initGallery(photosArray, picturesContainer);

export { photosArray };
