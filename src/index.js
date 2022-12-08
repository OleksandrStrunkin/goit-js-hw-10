import './css/styles.css';
import { fetchCountries } from './fetchCountries'
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
var debounce = require('lodash.debounce');


const getItemTemplate = ({ name, flags}) => `
<li class="list-item"><img src="${flags.svg}"alt="" width="50" height="30">${name.official}</li>
`;

const getItemCountry = ({ name, flags, capital, population, languages}) => `
<ul> <li><img src="${flags.svg}" alt="" width="65" height="50" /><span class="title-country">${name.official}</span></li>
        <li>Caption:<span>${capital}</span></li>
        <li>Population:<span>${population}</span></li>
        <li>Language:<span>${Object.values(languages)}</span></li>
      </ul>
`;

const refs = {
    inputForm: document.querySelector(`input#search-box`),
    articlesContainer: document.querySelector(`.country-list`),
    boxCountry: document.querySelector(`.country-info`),
}

refs.inputForm.addEventListener(`input`, debounce(onSearch, DEBOUNCE_DELAY));

let items = [];

const renderList = () => {
    const list = items.map(getItemTemplate);

    refs.boxCountry.innerHTML = '';
    refs.articlesContainer.innerHTML = '';
    refs.articlesContainer.insertAdjacentHTML('beforeend', list.join(''));
};

const renderCountry = () => {
    const list = items.map(getItemCountry);

    refs.boxCountry.innerHTML = '';
    refs.articlesContainer.innerHTML = '';
    refs.boxCountry.insertAdjacentHTML('beforeend', list.join(''));
}

function onSearch(e) {
    e.preventDefault();

    const name = refs.inputForm.value.trim();
    // console.log(name.trim())
    if (name === "") {
        return
    }

    fetchCountries(name)
        .then(data => {
           
           items = data;
        
           if (items.length === 1) {
               renderCountry();
           } else if (items.length < 10){
               renderList();
           } else if (data.status === 404) {
               Notiflix.Notify.failure("Oops, there is no country with that name");
               refs.articlesContainer.innerHTML = '';
               
           } else {
               Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
               refs.articlesContainer.innerHTML = '';
             
           }
           
       });
}