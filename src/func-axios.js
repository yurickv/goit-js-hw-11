import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const MY_KEY = "35784631-ba5c8985f27dc4b55b0d6e182";

export default async function axiosSearch(value, page=1) {
    const response = await  axios.get(`${BASE_URL}/?key=${MY_KEY}&q=${value}
       &image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    ); 
    if (!response.data.hits.length) {
        // throw new Error('Немає зображень');
        return 
    };
    return response.data;
};
