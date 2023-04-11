// ==================== GRAB ELEMENTS FROM PAGE ====================
const searchButton = document.querySelector('#searchButton');

// ==================== GLOBAL VARIABLES ====================
let cityName = '';
let currentUrl = '';
let futureUrl = '';

// ==================== API KEY AND URL  ====================
const apiKey = '&appid=3be2b2b6acc21e3760901d15acf91f72';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&cnt=6&q=';


// ==================== CLOCK FUNCTION ====================
$(function() {
  setInterval(function () {
    let clock = dayjs().format('h:mma - dddd, MMM DD, YYYY');
    $('#todayDate').text(clock);
  }, 1000);
});


// ==================== SEARCH TRACK FUNCTION  ====================
let array;
let duplicateTracker = false;

// ==================== UPDATE FROM LOCAL STORAGE
// Checks if local storage already has searches stored
if ( localStorage.getItem('searches') ) {
  const stringArray = localStorage.getItem('searches');
  array = JSON.parse(stringArray);
} else {
  array = [];
};


// ==================== SEND TO LOCAL STORAGE FUNCTION
function track () {
  //make object
  let preSearch = {
    city: cityName,
  }
  //loop through the array to check if there is any match to previousSearch
  for (let i=0; i<array.length; i++) {
    if (array[i].city === preSearch.city) {
      array[i] = preSearch;
      //update tracker so that array can be pushed
      duplicateTracker = true;
      break;
    };
  };
  //push preSearch object into array if tracker is true
  if (!duplicateTracker) {
    array.unshift(preSearch);
  };
  //reset duplicateTracker
  duplicateTracker = false;
  const arrayString = JSON.stringify(array);
  localStorage.setItem('searches', arrayString);
};

// ==================== BUILD PREVIOUS SEARCH FROM STORAGE
$(function() {
  array.forEach(function(item){
    cityName = item.city.replaceAll('+', ' ');
    searchHistory();
  });
});


/* ============= CLICK FUNCTION  - Run Code =============== */
searchButton.addEventListener('click', function() {
  let searchInput = $('#searchInput').val();
  cityName = searchInput.toLowerCase().replaceAll(' ', '+');
  currentUrl = `${weatherUrl}${cityName}${apiKey}`;

  searchHistory();
  checkCurrentWeather();
});


/* ============= BUILD PREVIOUS SEARCH FUNCTION =============== */
function searchHistory () {
    //build p and button, assign value and append to page
    let p = $('<p>');
    let button = $('<button>').text(cityName).attr('class', 'preSearch');
    p.append(button);
    $('#previousSearchDiv').prepend(p);

    let reload = document.querySelector('.preSearch');
    reload.addEventListener('click', searchAgain);

    searchLimit();
};

/* ============= LIMIT SEARCH HISTORY FUNCTION =============== */
function searchLimit() {
  let preSearchDiv = document.getElementById('previousSearchDiv');
  let numPTags = preSearchDiv.getElementsByTagName('p').length;
  if (numPTags >= 5) {
    preSearchDiv.removeChild(preSearchDiv.lastChild)
  }
};


/* ============= RUN PREVIOUS SEARCH FUNCTION =============== */
function searchAgain(event) {
  let preSearch = event.target.textContent;
  cityName = preSearch.replaceAll(' ', '+');
  currentUrl = `${weatherUrl}${cityName}${apiKey}`;
  checkCurrentWeather();
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

  track();

  //clear input text field
  let searchInput = $('#searchInput').val('');
};



/*
To Do:
  - build readme
  - delete pseudocode
  - take screen shot
  - add function to change background depending on weather
  - 
*/