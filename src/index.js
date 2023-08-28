
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImage } from './api';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  spanLimit: document.querySelector('.span-js'),
};

refs.form.addEventListener('submit', onSubmit);

let page = 1;
let value = '';
let totalHitsImg = 0;

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  clearContent();

  value = e.currentTarget.elements.searchQuery.value.trim();
  if (!value)
    return Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );

  takeImage();
};

function clearContent() {
  totalHitsImg = 0;
  refs.gallery.innerHTML = '';
  refs.spanLimit.textContent = '';
}

async function takeImage() {
  try {
    const response = await getImage(page, value);
    refs.form.reset();

    if (response.totalHits) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
    }
    if (response.totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    };

    for (let i = 0; i < response.hits.length; i++) {
      const newImage = createMarkup([response.hits[i]]);
      refs.gallery.insertAdjacentHTML('beforeend', newImage);
      lightbox.refresh();
    }
    page += 1;
    totalHitsImg += response.hits.length;

    if (totalHitsImg >= response.totalHits) {
      refs.spanLimit.textContent =
        "We're sorry, but you've reached the end of search results.";
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
function createMarkup(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes:</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views:</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments:</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads:</b>
        ${downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
};

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    takeImage();
  };
});

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});


