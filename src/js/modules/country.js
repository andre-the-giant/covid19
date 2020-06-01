import appVars from '../modules/var.js'
import SuperRepo from 'super-repo';

const cData = {};

function _addButtons() {
  const tableRows = document.querySelectorAll('.results__row>td:first-child')
  tableRows.forEach(function (row) {
    row.innerHTML = `<button class="results__button" type="button">${row.innerHTML}<span class="sr-only">Click for more information about COVID-19 case in ${row.innerHTML}</span></button>`
  });
}

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

//const txt = ;


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
        mainContainer.innerHTML = "Eror while retrieving Country data.<br>Please try again later";
      })
      .then(data => {
        console.log(data)
      })
  } else {
    return false
  }
}
// add Click
// const group = document.querySelector('.results');
// document.addEventListener('click', showCountryData, false);


let countryData = {
  init: function () {
    _addButtons();
    const group = document.querySelector('.results');
    document.addEventListener('click', _showCountryData, false);
  }
}

export default countryData