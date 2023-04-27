import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = "https://pixabay.com/api/";
const MY_KEY = "35784631-ba5c8985f27dc4b55b0d6e182";

const inputForm = document.querySelector("#search-form")
const gallery = document.querySelector('.gallery')
inputForm.addEventListener('submit', onSearch)
let page = 1;

// function makeAll() {
//     onSearch().then(data =>{ gallery.insertAdjacentElement('beforeend', createMarkup(data.hits)) })
      
// }


async function onSearch(evn) {
        
    let search = evn.target.elements.searchQuery.value.trim();
    if (!search) return Notify.warning('Type something!');
    console.dir(search); 
    
  try { 
      evn.preventDefault();
      clearGallery();  
      const axiosResult = await axiosSearch(search)      
      console.dir(axiosResult); 

      createMarkup(axiosResult.hits);
      Notify.success(`Hooray, we found ${axiosResult.total} images`);
  
    }
    
   catch (error) {  console.error(error); }
    page += 1;
        
}

async function axiosSearch(value) {
    const response = await  axios.get(`${BASE_URL}/?key=${MY_KEY}&q=${value}
       &image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    ); 
    if (!response.data.hits.length) {
        throw new Error(Notify.warning('Sorry, there are no images matching your search query. Try something else!'));
    };
    return response.data;
};



function createMarkup(array) {
    const markup = array.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
       <div class="info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b>  ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
        </div>
    </div>`
    ).join('');
    
    gallery.insertAdjacentHTML('beforeend', markup);

    const lightbox = new SimpleLightbox('.gallery__item');
    lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}