import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import LoadMoreBtn from './js/load-more-btn';
import ApiService from './js/api-service';
import cardImgTpl from './templates/card-img.hbs';

const apiService = new ApiService();
let lightBox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionPosition: 'bottom',
  captionDelay: 250,
  captionsData: 'alt',
  doubleTapZoom: 1,
  docClose: true,
});

const refs = {
  searchForm: document.getElementById('search-form'),
  imgGalleryList: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: `[data-action= "load-more"]`,
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();

  apiService.searchText = e.currentTarget.elements.searchQuery.value;
  e.currentTarget.elements.searchQuery.value = '';
  clearImgContainer();
  loadMoreBtn.show();

  apiService.resetPage();
  if (apiService.searchText === '') {
    loadMoreBtn.hide();
    return Notiflix.Notify.failure('No data to search.');
  }

  fetchArticles();
}

function fetchArticles() {
  loadMoreBtn.disable();
  apiService
    .fetchArticles()
    .then(hits => {
      appendImgMarkup(hits);
      loadMoreBtn.enable();
      if (apiService.endPage) {
        loadMoreBtn.hide();
      }
    })
    .catch(error => loadMoreBtn.hide());
}

function appendImgMarkup(hits) {
  refs.imgGalleryList.insertAdjacentHTML('beforeend', cardImgTpl(hits));
  lightBox.refresh();
}

function clearImgContainer() {
  refs.imgGalleryList.innerHTML = '';
}
