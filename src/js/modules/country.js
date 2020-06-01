import appVars from '../modules/var.js'
//import Chart from 'chart.js';
import SuperRepo from 'super-repo';

const cData = {};

function _formatDate(str) {
  var dt = new Date(str);
  return dt.toLocaleDateString(appVars.LOCALE_STRING);
}

// replace country name with a button to call the API for country data
function _addButtons() {
  const tableRows = document.querySelectorAll('.results__row>td:first-child')
  tableRows.forEach(function (row) {
    row.innerHTML = `<button class="results__button" type="button">${row.innerHTML}<span class="sr-only">Click for more information about COVID-19 case in ${row.innerHTML}</span></button>`
  });

}

// function to store and retrieve a country data by slug
function _countrySR(countrySlug) {
  if (!(countrySlug in countryData)) {
    cData[countrySlug] = new SuperRepo({
      request: () => fetch(appVars.API_URL + appVars.ENDPOINT_COUNTRY + '/' + countrySlug).then(r => r.json()),
      storage: appVars.STORAGE,
      name: 'CovidData_' + countrySlug,
      outOfDateAfter: 6 * 60 * 60 * 1000, // 6 hours
    })
  }
  return cData[countrySlug]
}

function _showCountryChart(data) {
  const chartContainer = document.querySelector('.country__chart');
  var myChart = new Chart(chartContainer, {
    type: 'bar',
    data: {
      labels: data.map(d => _formatDate(d.Date)),
      datasets: [{
        label: 'Confirmed case',
        data: data.map(d => d.Confirmed),
        backgroundColor: '#ff8787'
      }, {
        label: 'Death',
        data: data.map(d => d.Deaths),
        backgroundColor: '#000000'
      }, {
        label: 'Recovered',
        data: data.map(d => d.Deaths),
        backgroundColor: '#87ffb0'
      }]
    }
  });
}
// function to handle the click event
function _showCountryData(e) {
  const {
    parentNode,
    className,
    dataset
  } = e.target;
  if (className === 'results__button' && !!parentNode.dataset.slug) {
    _countrySR(parentNode.dataset.slug)
      .getData()
      .catch(function (error) {
        appVars.mainContainer.innerHTML = "Eror while retrieving Country data.<br>Please try again later";
      })
      .then(data => {
        const countryContainer = document.querySelector('.country');
        countryContainer.innerHTML = `
          <h2>${data[0].Country}</h2>
          <canvas class="country__chart"></canvas>
          `;
        System.import("chart.js").then(function () {
          _showCountryChart(data);
        })
      })
  } else {
    return false;
  }
}

let countryData = {
  init: function () {
    _addButtons();
    const group = document.querySelector('.results');
    document.addEventListener('click', _showCountryData, false);
  }
}

export default countryData