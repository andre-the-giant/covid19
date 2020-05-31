import '../scss/main.scss';
import SuperRepo from 'super-repo';

const API_URL = 'https://api.covid19api.com';
const ENDPOINT = '/summary';
const LOCALE_STRING = 'us-US';

const tagMain = document.querySelector('main');

// set up SuperRepo to cache data in the LocalStorage
const CovidData = new SuperRepo({
  request: () => fetch(API_URL + ENDPOINT).then(r => r.json()).catch(function (error) {
    tagMain.innerHTML = "Eror while retrieving data from the API.<br>Please try again later";
    return false;
  }),
  storage: 'LOCAL_STORAGE',
  name: 'CovidData',
  outOfDateAfter: 6 * 60 * 60 * 1000 // 6 hours
})

// function to add a row the the results table. Using template litterals makes it easy
const countryRow = countryData => `
<tr>
  <td><button class="results__button" type="button" data-countrycode="${countryData.CountryCode}" data-slug="${countryData.Slug}">${countryData.Country} <span class="sr-only">Click for more information about COVID-19 case in ${countryData.Country}</span></button></td>
  <td class="results__number">
    ${countryData.TotalConfirmed.toLocaleString(LOCALE_STRING)}
    ${countryData.NewConfirmed>0?`<span class="results__evolution">(+${countryData.NewConfirmed.toLocaleString(LOCALE_STRING)})</span>`:`<span class="results__evolution results__evolution--positive">(-${countryData.NewConfirmed.toLocaleString(LOCALE_STRING)})</span>`}
  </td>
  <td class="results__number">${countryData.TotalDeaths.toLocaleString(LOCALE_STRING)}</td>
  <td class="results__number">${countryData.TotalRecovered.toLocaleString(LOCALE_STRING)}</td>
</tr>
`;

// get the data, then process it
CovidData.getData().then(data => {
  if (!('Countries' in data)) {
    tagMain.innerHTML = "Eror with the API (enexpected data)<br>Please try again later";
    return false;
  }
  // sort data by TotalConfirmed
  const countriesSorted = data.Countries.sort((a, b) => parseInt(b.TotalConfirmed) - parseInt(a.TotalConfirmed));

  // insert the table to replace the spinner
  tagMain.innerHTML = `
<div class="responsive-table">
  <table class="results">
    <caption class="result__caption">The 10 countries with most COVID-19 cases in the World</caption>
    <thead>
      <tr>
        <th class="results__header">Country</th>
        <th class="results__header">Confirmed Case</th>
        <th class="results__header">Death</th>
        <th class="results__header">Recovered</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>`;
  // feed the table
  const table = document.querySelector('tbody');
  let htmlToAppend = '';
  for (let i = 0; i < 10; i++) {
    console.log(countriesSorted[i])
    htmlToAppend += countryRow(countriesSorted[i]);
  }
  table.innerHTML = htmlToAppend;
});