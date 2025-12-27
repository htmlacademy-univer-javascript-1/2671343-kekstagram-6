import { initGallery } from './gallery.js';
import { initForm } from './upload-validator.js';
import { initImageEditor } from './image-editor.js';
import { getData } from './api.js';

const picturesContainer = document.querySelector('.pictures');

// Показ сообщения об ошибке загрузки
const showLoadErrorMessage = (message) => {
  const errorTemplate = document.querySelector('#error');
  if (errorTemplate) {
    const errorClone = errorTemplate.content.cloneNode(true);
    const errorElement = errorClone.querySelector('.error');
    const errorTitle = errorElement.querySelector('.error__title');
    const errorButton = errorElement.querySelector('.error__button');

    errorTitle.textContent = message;
    errorButton.textContent = 'Попробовать ещё раз';

    // Обработчик повторной попытки
    errorButton.addEventListener('click', () => {
      errorElement.remove();
      location.reload();
    });

    // Закрытие по клику вне блока
    errorElement.addEventListener('click', (evt) => {
      if (evt.target === errorElement) {
        errorElement.remove();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        errorElement.remove();
      }
    });

    document.body.appendChild(errorElement);
  }
};

// Загрузка данных с сервера
getData()
  .then((photosArray) => {
    initGallery(photosArray, picturesContainer);
  })
  .catch((error) => {
    showLoadErrorMessage(error.message);
  });

// Инициализация формы загрузки
initForm();

// Инициализация редактора изображений при выборе файла
const fileInput = document.querySelector('.img-upload__input');
fileInput.addEventListener('change', initImageEditor);

// Экспорт для тестирования (если нужно)
export { showLoadErrorMessage };
