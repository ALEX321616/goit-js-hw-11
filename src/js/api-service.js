import Notiflix from 'notiflix';
import axios from 'axios';
const options = {
  headers: {
    API_KEY: '24727962-734988bb0b03b5b4e85a70964',
    BASE_URL: 'https://pixabay.com/api/',
  },
};

export default class ApiService {
  constructor() {
    this.searchText = null;
    this.pageURL = 1;
    this.perPage = 40;
    this.totalHits = null;
    this.endPage = false;
    this.safeSearch = true;
    this.imageType = 'photo';
    this.orientation = 'horizontal';
  }

  async fetchArticles() {
    const URL = `${options.headers.BASE_URL}?key=${options.headers.API_KEY}&q=${this.searchText}&image_type=${this.imageType}&page=${this.pageURL}&per_page=${this.perPage}&orientation=${this.orientation}&safesearch=${this.safeSearch}`;

    return await axios
      .get(URL)
      .then(response => {
        return response.data;
      })
      .then(({ hits, totalHits }) => {
        if (totalHits === 0) {
          this.resetPage();
          Notiflix.Notify.info(
            'Sorry, there are no images matching your search query. Please try again.',
          );
          throw new Error();
        }

        if (this.pageURL === 1) {
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
        }
        if (this.perPage >= totalHits / this.pageURL) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          this.endPage = true;
        }

        this.incrementPage();
        return hits;
      })
      .catch(error => {
        return error();
      });
  }
  incrementPage() {
    this.pageURL += 1;
  }

  resetPage() {
    this.pageURL = 1;
    this.endPage = false;
  }

  get textQuery() {
    return this.searchText;
  }
  set textQuery(newQuery) {
    this.searchText = newQuery;
  }
}
