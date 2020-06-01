import '../scss/main.scss';

import allCountries from './modules/allcountries.js';
import countryData from './modules/country.js';

allCountries
  .init()
  .then(function () {
    countryData.init()
  });