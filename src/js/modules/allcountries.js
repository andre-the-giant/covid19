import appVars from '../modules/var.js'
import SuperRepo from 'super-repo';

const mainContainer = document.querySelector('main');

// set up SuperRepo to cache data in LocalStorage
const CovidData = new SuperRepo({
  request: () => fetch(appVars.API_URL + appVars.ENDPOINT_LIST).then(r => r.json()),
  storage: appVars.STORAGE,
  name: 'CovidData',
  outOfDateAfter: 6 * 60 * 60 * 1000, // 6 hours
})

// function to initialize the table HTML
function _tableInit(el) {
  el.innerHTML = `
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
  </div>
  `;
}
// function to add a row the the results table. Using template litterals makes it easy
function _tableRowHtml(countryData) {
  return `
  <tr class="results__row">
    <td data-countrycode="${countryData.CountryCode}" data-slug="${countryData.Slug}">${countryData.Country}</td>
    <td class="results__number">
      ${countryData.TotalConfirmed.toLocaleString(appVars.LOCALE_STRING)}
      ${countryData.NewConfirmed>0?`<span class="results__evolution">(+${countryData.NewConfirmed.toLocaleString(appVars.LOCALE_STRING)})</span>`:`<span class="results__evolution results__evolution--positive">(-${countryData.NewConfirmed.toLocaleString(appVars.LOCALE_STRING)})</span>`}
    </td>
    <td class="results__number">${countryData.TotalDeaths.toLocaleString(appVars.LOCALE_STRING)}</td>
    <td class="results__number">${countryData.TotalRecovered.toLocaleString(appVars.LOCALE_STRING)}</td>
  </tr>
  `;
}

let allCountries = {
  init: function () {
    return CovidData
      .getData()
      .catch(function (error) {
        mainContainer.innerHTML = "Eror while retrieving data from the API.<br>Please try again later";
      })
      .then(data => {
        // sort data by TotalConfirmed
        const countriesSorted = data.Countries.sort((a, b) => parseInt(b.TotalConfirmed) - parseInt(a.TotalConfirmed));
        // table init
        _tableInit(mainContainer);
        // feed the table all rows at once to minimize DOM access
        const table = document.querySelector('tbody');
        let htmlToAppend = '';
        for (let i = 0; i < 10; i++) {
          htmlToAppend += _tableRowHtml(countriesSorted[i]);
        }
        table.innerHTML = htmlToAppend;
      })
  }
}

export default allCountries