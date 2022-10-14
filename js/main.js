import { FavoritesView } from './Favorites.js';

new FavoritesView('#app');

const favoriteButton = document.querySelector('#button-add');

favoriteButton.onmouseover = () => {
  favoriteButton.classList.toggle('button-add-start-hover');
};
