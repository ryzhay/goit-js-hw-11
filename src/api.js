import axios from 'axios';

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
}
export {getImage}