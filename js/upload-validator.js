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

// Хранение данных формы
let savedFormData = {
  hashtags: '',
  description: '',
  file: null,
  scale: 100,
  effect: 'none'
};

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

// Сохранение данных формы
const saveFormData = () => {
  savedFormData = {
    hashtags: hashtagInput.value,
    description: commentInput.value,
    file: fileInput.files[0],
    // Сохраняем текущий масштаб и эффект из image-editor.js
    scale: parseInt(document.querySelector('.scale__control--value').value, 10),
    effect: document.querySelector('input[name="effect"]:checked').value
  };
};

// Восстановление данных формы
const restoreFormData = () => {
  if (savedFormData.file) {
    // Создаем новый FileList с сохраненным файлом
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(savedFormData.file);
    fileInput.files = dataTransfer.files;

    // Обновляем превью изображения
    const preview = document.querySelector('.img-upload__preview img');
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(savedFormData.file);
  }

  hashtagInput.value = savedFormData.hashtags;
  commentInput.value = savedFormData.description;

  // Восстанавливаем масштаб и эффект (это вызовет соответствующие функции в image-editor.js)
  const scaleControl = document.querySelector('.scale__control--value');
  scaleControl.value = `${savedFormData.scale}%`;

  const effectInput = document.querySelector(`#effect-${savedFormData.effect}`);
  if (effectInput) {
    effectInput.checked = true;
  }

  pristine.validate();
};

// Функции для закрытия сообщений
const createCloseSuccessMessageHandlers = (successElement) => {
  // Создаем замыкание для хранения обработчиков
  let onSuccessEscape = '';
  let onSuccessClick = '';

  const removeEventListeners = () => {
    document.removeEventListener('keydown', onSuccessEscape);
    successElement.removeEventListener('click', onSuccessClick);
  };

  onSuccessEscape = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      successElement.remove();
      removeEventListeners();
    }
  };

  onSuccessClick = (evt) => {
    if (evt.target === successElement || evt.target.closest('.success__button')) {
      successElement.remove();
      removeEventListeners();
    }
  };

  return { onSuccessEscape, onSuccessClick };
};

const createCloseErrorMessageHandlers = (errorElement, onCloseCallback = null) => {
  // Создаем замыкание для хранения обработчиков
  let onErrorEscape= '';
  let onErrorClick = '';

  const removeEventListeners = () => {
    document.removeEventListener('keydown', onErrorEscape);
    errorElement.removeEventListener('click', onErrorClick);
    if (onCloseCallback) {
      onCloseCallback();
    }
  };

  onErrorEscape = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      errorElement.remove();
      removeEventListeners();
    }
  };

  onErrorClick = (evt) => {
    if (evt.target === errorElement || evt.target.closest('.error__button')) {
      errorElement.remove();
      removeEventListeners();
    }
  };

  return { onErrorEscape, onErrorClick };
};

// Показ сообщения об успешной отправке
const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (successTemplate) {
    const successClone = successTemplate.content.cloneNode(true);
    const successElement = successClone.querySelector('.success');
    const successButton = successElement.querySelector('.success__button');

    document.body.appendChild(successElement);

    const { onSuccessEscape, onSuccessClick } = createCloseSuccessMessageHandlers(successElement);

    const handleSuccessButtonClick = () => {
      successElement.remove();
      document.removeEventListener('keydown', onSuccessEscape);
      successElement.removeEventListener('click', onSuccessClick);
      successButton.removeEventListener('click', handleSuccessButtonClick);
    };

    successButton.addEventListener('click', handleSuccessButtonClick);
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

    // Функция для повторного открытия формы с сохраненными данными
    const reopenFormWithSavedData = () => {
      // Восстанавливаем данные формы
      restoreFormData();
      // Снова открываем форму
      overlay.classList.remove('hidden');
      document.body.classList.add('modal-open');
      // Возвращаем фокус
      submitButton.focus();
    };

    const { onErrorEscape, onErrorClick } = createCloseErrorMessageHandlers(errorElement, reopenFormWithSavedData);

    const handleErrorButtonClick = () => {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorEscape);
      errorElement.removeEventListener('click', onErrorClick);
      errorButton.removeEventListener('click', handleErrorButtonClick);
      // После закрытия ошибки открываем форму с сохраненными данными
      reopenFormWithSavedData();
    };

    errorButton.addEventListener('click', handleErrorButtonClick);
    errorElement.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorEscape);
  }
};

// Закрытие формы
const closeForm = (resetData = true) => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  if (resetData) {
    form.reset();
    pristine.reset();
    resetImageEditor();
    savedFormData = {
      hashtags: '',
      description: '',
      file: null,
      scale: 100,
      effect: 'none'
    };
  }

  hashtagInput.removeEventListener('keydown', onHashtagKeydown);
  commentInput.removeEventListener('keydown', onCommentKeydown);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  // Сохраняем данные формы перед отправкой
  saveFormData();

  // Блокируем кнопку отправки
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';

  // Подготавливаем данные формы
  const formData = new FormData(form);

  // Реальная отправка данных на сервер
  sendData(formData)
    .then(() => {
      // Успешная отправка
      closeForm(true); // Сбрасываем данные
      showSuccessMessage();
    })
    .catch(() => {
      // Ошибка отправки - закрываем форму, но сохраняем данные
      closeForm(false); // НЕ сбрасываем данные
      showErrorMessage();
    })
    .finally(() => {
      // Разблокируем кнопку в любом случае
      submitButton.disabled = false;
      submitButton.textContent = 'Опубликовать';
    });
};

// Открытие формы
const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  hashtagInput.addEventListener('keydown', onHashtagKeydown);
  commentInput.addEventListener('keydown', onCommentKeydown);
};

const onFileInputChange = () => {
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    openForm();
  }
};

const onCancelButtonClick = () => {
  closeForm(true); // При отмене сбрасываем данные
};

const onDocumentKeydown = (evt) => {
  // Проверяем, нет ли открытого сообщения об ошибке или успехе
  const errorMessage = document.querySelector('.error');
  const successMessage = document.querySelector('.success');

  // Если есть открытое сообщение, не закрываем форму
  if (errorMessage || successMessage) {
    return;
  }

  if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
    evt.preventDefault();
    closeForm(true); // При Escape сбрасываем данные
  }
};

const initForm = () => {
  fileInput.addEventListener('change', onFileInputChange);
  form.addEventListener('submit', onFormSubmit);
  cancelButton.addEventListener('click', onCancelButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

export { initForm };
