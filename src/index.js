import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = "https://pixabay.com/api/";
const MY_KEY = "35784631-ba5c8985f27dc4b55b0d6e182";

const inputForm = document.querySelector("#search-form");
const gallery = document.querySelector('.gallery');
inputForm.addEventListener('submit', onSearch);
const target = document.querySelector(".js-guard");

let options = { rootMargin: "400px" };
let observer = new IntersectionObserver(onLoad, options);
const refs = {
    newpage: 1,
    search: '',
    massive: 0,
    totalArrey: 0,
};


async function onSearch(evn) {
        
    refs.search = evn.target.elements.searchQuery.value.trim();
    if (!refs.search) return Notify.warning('Type something!');
    // console.dir(search); 
    
  try { 
      evn.preventDefault();
      clearGallery();  
      const axiosResult = await axiosSearch(refs.search)      
        if (!axiosResult) {
            throw new Error();
      }
      refs.massive = axiosResult.hits.length;
      refs.totalArrey = axiosResult.total;

      createMarkup(axiosResult.hits);
      Notify.success(`Hooray, we found ${axiosResult.total} images`);
      observer.observe(target);
    }
    
   catch (error) { Notify.failure('Sorry, there are no images matching your search query. Try something else!')}
            
}

async function axiosSearch(value, page=1) {
    const response = await  axios.get(`${BASE_URL}/?key=${MY_KEY}&q=${value}
       &image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    ); 
    if (!response.data.hits.length) {
        // throw new Error('Немає зображень');
        return 
    };
    return response.data;
};



function createMarkup(array) {
    const markup = array.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card gallery__item">
            <a class="gallery__link" href="${largeImageURL}">
                <img
                    class="gallery__image"
                    src="${webformatURL}"
                    alt="${tags}" loading="lazy"
                />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b> ${likes}</p>
                <p class="info-item"><b>Views</b>  ${views}</p>
                <p class="info-item"><b>Comments</b> ${comments}</p>
                <p class="info-item"><b>Downloads</b> ${downloads}</p>
            </div>
        </div>`
    ).join('');
    
    gallery.insertAdjacentHTML('beforeend', markup);

    const lightbox = new SimpleLightbox('.gallery__link');
    lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function baletScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
} 

function onLoad (entries, observer) {
     entries.forEach  ( async (element) => {
        
        if (element.isIntersecting) {
            if (refs.massive < 40 || refs.totalArrey <=40 ) {
                observer.unobserve(target);
                refs.newpage = 1;
                refs.massive = 0;
                refs.totalArrey = 0;
                Notify.warning('We are sorry, but you have reached the end of search results.');
                return;
            }
            refs.newpage += 1;
            try {
                const axiosResult = await axiosSearch(refs.search, refs.newpage)  
                if (!axiosResult) { throw new Error(); }
                refs.totalArrey -= axiosResult.hits.length;
                // console.log( 'total', refs.totalArrey)
                createMarkup(axiosResult.hits);
                baletScroll();
            }
            catch (error) {
                Notify.failure(`Sorry, we have a problem ${error}!`);
                observer.unobserve(target);
            }
        } 
    });
}