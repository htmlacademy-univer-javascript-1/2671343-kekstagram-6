
const createThumbnail = (pictureData, index) => {
  const pictureTemplate = document.querySelector('#picture');
  const thumbnailElement = pictureTemplate.content.querySelector('.picture').cloneNode(true);

  const thumbImg = thumbnailElement.querySelector('.picture__img');
  thumbImg.src = pictureData.url;
  thumbImg.alt = pictureData.description;

  const thumbComments = thumbnailElement.querySelector('.picture__comments');
  thumbComments.textContent = pictureData.comments.length;

  const thumbLikes = thumbnailElement.querySelector('.picture__likes');
  thumbLikes.textContent = pictureData.likes;

  thumbnailElement.dataset.index = index;

  return thumbnailElement;
};

const renderThumbnails = (picturesList, picturesContainer) => {
  const renderFragment = document.createDocumentFragment();

  picturesList.forEach((pictureItem, index) => {
    const thumbnail = createThumbnail(pictureItem, index);
    renderFragment.appendChild(thumbnail);
  });

  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(renderFragment);
};

export { renderThumbnails };
