const body = document.querySelector('body');
const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCount = bigPictureElement.querySelector('.likes-count');
const commentsCount = bigPictureElement.querySelector('.comments-count');
const socialCommentElement = bigPictureElement.querySelector('.social__comments');
const socialCaption = bigPictureElement.querySelector('.social__caption');
const commentCountBlock = bigPictureElement.querySelector('.social__comment-count');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');
const cancelButton = bigPictureElement.querySelector('.big-picture__cancel');

let currentComments = [];
let commentsShown = 0;
const COMMENTS_PER_PORTION = 5;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const commentImage = document.createElement('img');
  commentImage.classList.add('social__picture');
  commentImage.src = comment.avatar;
  commentImage.alt = comment.name;
  commentImage.width = 35;
  commentImage.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.append(commentImage, commentText);
  return commentElement;
};

const renderCommentsPortion = () => {
  const commentsToShow = Math.min(commentsShown + COMMENTS_PER_PORTION, currentComments.length);

  for (let i = commentsShown; i < commentsToShow; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    socialCommentElement.appendChild(commentElement);
  }

  commentsShown = commentsToShow;
  commentCountBlock.textContent = `${commentsShown} из ${currentComments.length} комментариев`;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

const closeFullscreenPhoto = () => {
  bigPictureElement.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  cancelButton.removeEventListener('click', onCancelButtonClick);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullscreenPhoto();
  }
};

const onCancelButtonClick = () => {
  closeFullscreenPhoto();
};

const renderComments = (comments) => {
  currentComments = comments;
  commentsShown = 0;
  socialCommentElement.innerHTML = '';
  commentsLoader.classList.remove('hidden');

  renderCommentsPortion();
};

const openFullscreenPhoto = (photoData) => {
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderComments(photoData.comments);

  bigPictureElement.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', onCancelButtonClick);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

export { openFullscreenPhoto };
