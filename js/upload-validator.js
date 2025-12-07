import { resetImageEditor } from './image-editor.js';

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

  setTimeout(() => {
    closeForm();
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';

    const successTemplate = document.querySelector('#success');
    if (successTemplate) {
      const successClone = successTemplate.content.cloneNode(true);
      document.body.appendChild(successClone);

      setTimeout(() => {
        const successElement = document.querySelector('.success');
        if (successElement) {
          successElement.remove();
        }
      }, 3000);
    }
  }, 1000);
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
