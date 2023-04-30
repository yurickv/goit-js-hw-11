import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkup } from './func-murkup'
import axiosSearch from './func-axios'
import SimpleLightbox from "simplelightbox";

const lightbox = new SimpleLightbox('.gallery__link');


const target = document.querySelector(".js-guard");

let options = { rootMargin: "400px" };
let observer = new IntersectionObserver(onLoad, options);
const refs = {
    newpage: 0,
    search: '',
    massive: 0,
    totalArrey: 0,
};

const buttonUp = document.querySelector('.button-up')
function onLoad (entries, observer) {
     entries.forEach  ( async (element) => {
        
        if (element.isIntersecting) {
            if (refs.massive < 40 || refs.totalArrey <=40 ) {
                observer.unobserve(target);
                refs.newpage = 1;
                refs.massive = 0;
                refs.totalArrey = 0;
                buttonUp.style.display = 'inline-block';
                setTimeout(() => {Notify.warning('We are sorry, but you have reached the end of search results.');  }, 2000);
                
                return;
            }
            refs.newpage += 1;
            try {
                const axiosResult = await axiosSearch(refs.search, refs.newpage)  
                if (!axiosResult) { throw new Error(); }
                refs.totalArrey -= axiosResult.hits.length;
                // console.log( 'total', refs.totalArrey)
                createMarkup(axiosResult.hits);
                lightbox.refresh();
                baletScroll();
                buttonUp.style.display = 'inline-block';
            }
            catch (error) {
                Notify.failure(`Sorry, we have a problem ${error}!`);
                observer.unobserve(target);
            }
        } 
    });
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

export {target, observer, buttonUp, refs}