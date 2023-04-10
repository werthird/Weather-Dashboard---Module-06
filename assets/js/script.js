/* ===================================================================================
---------------       GRAB ELEMENTS FROM PAGE         ---------------
====================================================================================*/
// Button to look up city
const searchButton = document.querySelector('#searchButton');

/* ===================================================================================
---------------       GLOBAL VARIABLES         ---------------
====================================================================================*/
let cityName = '';
let currentUrl = '';
let futureUrl = '';

/* ===================================================================================
---------------       API KEY AND URL         ---------------
====================================================================================*/
const apiKey = '&appid=3be2b2b6acc21e3760901d15acf91f72';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&cnt=6&q=';

/* ===================================================================================
---------------       CLOCK FUNCTION         ---------------
====================================================================================*/
$(document).ready(function() {
  setInterval(function () {
    let clock = dayjs().format('h:mma - dddd, MMM DD, YYYY');
    $('#todayDate').text(clock);
  }, 1000);
});

/* ===================================================================================
---------------       SEARCH TRACK FUNCTION         ---------------
====================================================================================*/

let array;
let duplicateTracker = false;


// ==================== UPDATE FROM LOCAL STORAGE ====================
// Checks if local storage already has searches stored
if ( localStorage.getItem('searches') ) {
  const stringArray = localStorage.getItem('searches');
  array = JSON.parse(stringArray);
} else {
  array = [];
};


// ==================== SEND TO LOCAL STORAGE FUNCTION ====================
function track () {
  //grab value of input
  const searchInput = $('#searchInput').val();
  //put input into object
  let preSearch = {
    city: searchInput,
  }
  // ====== Loop through the array to check if there is any match to previousSearch
  for (let i=0; i<array.length; i++) {
    if (array[i].city === preSearch.city) {
  // ====== Replace the existing object with 
      array[i] = preSearch;
  // ====== Update tracker so that task array can be pushed
      duplicateTracker = true;
      break;
    };
  };
  // ====== Push task object into array if tracker is true
  if (!duplicateTracker) {
    array.push(preSearch);
  };
  // ====== Change array into string
  const arrayString = JSON.stringify(array);
  // ====== Send arrayString into local storage
  localStorage.setItem('searches', arrayString);
};





/* ============= CLICK FUNCTION  - Run Code =============== */
searchButton.addEventListener('click', function() {
  let searchInput = $('#searchInput').val();
  cityName = searchInput.toLowerCase().replaceAll(' ', '+');
  currentUrl = `${weatherUrl}${cityName}${apiKey}`;

  searchHistory();
  checkCurrentWeather();
});


/* ============= PREVIOUS SEARCH FUNCTION =============== */
function searchHistory () {
  //grab value of input
  const searchInput = $('#searchInput').val();
  //build p and button and append to page
  let p = $('<p>');
  let button = $('<button>').text(searchInput).attr('id', 'preSearch');
  p.append(button);
  $('#previousSearchDiv').prepend(p);

  searchAgain();
};

function searchAgain() {
  let reload = document.querySelector('#preSearch');
  reload.addEventListener('click', function() {
    $('#searchInput').val(searchInput);
    checkCurrentWeather();
  });
};


/* ============= CURRENT WEATHER FUNCTION =============== */
async function checkCurrentWeather() {
  //grab data from api
  const response = await fetch(currentUrl);
  let data = await response.json();

  //append data to current section
  $('#temp h1').text(data.list[0].temp.day.toFixed(0) + '\u00B0');
  $('#inputLocationResult').text(data.city.name);
  $('#humidity').text(data.list[0].humidity + '%');
  $('#cloudy').text(data.list[0].weather[0].description);
  $('#wind').text(data.list[0].speed.toFixed(1) + ' MPH');
  // icon
  let iconCode = data.list[0].weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  let icon = $('<img>').attr('src', iconUrl);
  $('.currentIcon').html(icon);

  // append data to forecast section
  for (let i=1; i<6; i++) {
    // day of week
    let timeStamp = data.list[i].dt;
    $(`#dayPlus${i} .futDay`).text(dayjs.unix(timeStamp).format('dddd'));
    timeStamp = '';
    // weather data
    $(`#dayPlus${i} .futTemp`).text(data.list[i].temp.day.toFixed(0));
    $(`#dayPlus${i} .futWind`).text(data.list[i].speed.toFixed(1));
    $(`#dayPlus${i} .futHum`).text(data.list[i].humidity);
    // icon
    let iconCode = data.list[i].weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    let icon = $('<img>').attr('src', iconUrl);
    $(`#dayPlus${i} .icon`).html(icon);
  };

  //clear input text field
  let searchInput = $('#searchInput').val('');

  track();
};



/*
To Do:
  - allow only five previous seraches in previous search div
  - load previous search div into local storage
  - clean up code and comments
  - build readme
  - clean up css and html files
  - delete pseudocode
  - take screen shot
  - add function to change background depending on weather
  - 
*/