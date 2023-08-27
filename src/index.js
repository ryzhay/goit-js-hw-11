import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39087193-ce55181815bd20642011f6dde';

async function getImage(page = 1, value) {
    axios.defaults.params = {
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal', 
        safesearch: true, 
        page,
        per_page: 40,
    };
    const response = await axios.get(BASE_URL);
    return response.data;
};

const refs = {
    form: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    // loadMore: document.querySelector('.load-more'),

}

function createMarkup(markup) {
    return markup.map((
        {webformatURL, largeImageURL, tags, likes, views, comments, downloads}
    ) => `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`)
     .join('');
}
