
const createThumbnail = (pictureData) => {
  const pictureTemplate = document.querySelector('#picture');
  const thumbnailElement = pictureTemplate.content.querySelector('.picture').cloneNode(true);

  const thumbImg = thumbnailElement.querySelector('.picture__img');
  thumbImg.src = pictureData.url;
  thumbImg.alt = pictureData.description;

  const thumbComments = thumbnailElement.querySelector('.picture__comments');
  thumbComments.textContent = pictureData.comments.length;

  const thumbLikes = thumbnailElement.querySelector('.picture__likes');
  thumbLikes.textContent = pictureData.likes;

  return thumbnailElement;
};

const renderThumbnails = (picturesList, picturesContainer) => {
  const renderFragment = document.createDocumentFragment();

  picturesList.forEach((pictureItem) => {
    const thumbnail = createThumbnail(pictureItem);
    renderFragment.appendChild(thumbnail);
  });

  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(renderFragment);
};

export { renderThumbnails };
