import { generatePhotosArray } from './photos-gen.js';
import { initGallery } from './gallery.js';
import { initForm } from './upload-validator.js';
import { initImageEditor } from './image-editor.js';

const photosArray = generatePhotosArray();
const picturesContainer = document.querySelector('.pictures');

initGallery(photosArray, picturesContainer);

initForm();

const fileInput = document.querySelector('.img-upload__input');
fileInput.addEventListener('change', initImageEditor);

export { photosArray };
