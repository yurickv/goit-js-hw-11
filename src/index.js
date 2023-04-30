import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import axiosSearch from './func-axios'
import {createMarkup, clearGallery} from './func-murkup'
import {target, observer, buttonUp, refs} from './func-scroll'

const lightbox = new SimpleLightbox('.gallery__link');
// let options = { rootMargin: "400px" };
// let observer = new IntersectionObserver(onLoad, options);

const inputForm = document.querySelector("#search-form");
inputForm.addEventListener('submit', onSearch);


async function onSearch(evn) {
        
    refs.search = evn.target.elements.searchQuery.value.trim();
    if (!refs.search) return Notify.warning('Type something!');
    // console.dir(search); 
    
  try { 
      evn.preventDefault();
      clearGallery();  
      buttonUp.style.display = 'none';
      observer.unobserve(target);

      const axiosResult = await axiosSearch(refs.search)      
        if (!axiosResult) {
            throw new Error();
      }
      refs.massive = axiosResult.hits.length;
      refs.totalArrey = axiosResult.total;

      createMarkup(axiosResult.hits);
      lightbox.refresh();
      Notify.success(`Hooray, we found ${axiosResult.total} images`);
      observer.observe(target);
      refs.newpage = 1;
    }
    
   catch (error) { Notify.failure('Sorry, there are no images matching your search query. Try something else!')}
            
}

