import { resetImageEditor } from './image-editor.js';
import { sendData } from './api.js';

const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error-text'
});

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    return false;
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return false;
    }

    if (hashtag.length === 1) {
      return false;
    }

    if (hashtag.length > 20) {
      return false;
    }

    if (!/^#[a-zа-яё0-9]+$/i.test(hashtag)) {
      return false;
    }
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return true;
};

const getHashtagErrorMessage = (value) => {
  if (value.trim() === '') {
    return '';
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    return 'Не более 5 хэш-тегов';
  }

  for (const hashtag of hashtags) {
    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с #';
    }
    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из #';
    }
    if (hashtag.length > 20) {
      return 'Максимальная длина хэш-тега 20 символов';
    }
    if (!/^#[a-zа-яё0-9]+$/i.test(hashtag)) {
      return 'Хэш-тег может содержать только буквы и цифры';
    }
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  return '';
};

const validateComment = (value) => (value.length <= 140);

pristine.addValidator(hashtagInput, validateHashtags, getHashtagErrorMessage);
pristine.addValidator(commentInput, validateComment, 'Длина комментария не должна превышать 140 символов');

const onHashtagKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

const onCommentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

// Показ сообщения об успешной отправке
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (successTemplate) {
    const successClone = successTemplate.content.cloneNode(true);
    const successElement = successClone.querySelector('.success');
    const successButton = successElement.querySelector('.success__button');

    document.body.appendChild(successElement);

    const closeSuccessMessage = () => {
      successElement.remove();
      document.removeEventListener('keydown', onSuccessEscape);
      successElement.removeEventListener('click', onSuccessClick);
    };

    const onSuccessEscape = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeSuccessMessage();
      }
    };

    const onSuccessClick = (evt) => {
      if (evt.target === successElement || evt.target === successButton) {
        closeSuccessMessage();
      }
    };

    successButton.addEventListener('click', closeSuccessMessage);
    successElement.addEventListener('click', onSuccessClick);
    document.addEventListener('keydown', onSuccessEscape);
  }
};

// Показ сообщения об ошибке отправки
const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error');
  if (errorTemplate) {
    const errorClone = errorTemplate.content.cloneNode(true);
    const errorElement = errorClone.querySelector('.error');
    const errorButton = errorElement.querySelector('.error__button');

    document.body.appendChild(errorElement);

    const closeErrorMessage = () => {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorEscape);
      errorElement.removeEventListener('click', onErrorClick);
    };

    const onErrorEscape = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeErrorMessage();
      }
    };

    const onErrorClick = (evt) => {
      if (evt.target === errorElement || evt.target === errorButton) {
        closeErrorMessage();
      }
    };

    errorButton.addEventListener('click', closeErrorMessage);
    errorElement.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorEscape);
  }
};

// Открытие формы
const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  hashtagInput.addEventListener('keydown', onHashtagKeydown);
  commentInput.addEventListener('keydown', onCommentKeydown);
};

// Закрытие формы
const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  form.reset();
  pristine.reset();
  fileInput.value = '';

  resetImageEditor();

  hashtagInput.removeEventListener('keydown', onHashtagKeydown);
  commentInput.removeEventListener('keydown', onCommentKeydown);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  // Блокируем кнопку отправки
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';

  // Подготавливаем данные формы
  const formData = new FormData(form);

  // Реальная отправка данных на сервер
  sendData(formData)
    .then(() => {
      // Успешная отправка
      closeForm();
      showSuccessMessage();
    })
    .catch(() => {
      // Ошибка отправки
      showErrorMessage();
    })
    .finally(() => {
      // Разблокируем кнопку в любом случае
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    });
};

const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    openForm();
  }
};

const onCancelButtonClick = () => {
  closeForm();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
    evt.preventDefault();
    closeForm();
  }
};

const initForm = () => {
  fileInput.addEventListener('change', onFileInputChange);
  form.addEventListener('submit', onFormSubmit);
  cancelButton.addEventListener('click', onCancelButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

export { initForm };
