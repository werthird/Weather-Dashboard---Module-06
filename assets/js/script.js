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
---------------       WEATHER VARIABLES         ---------------
====================================================================================*/
const apiKey = '&appid=22b97e12deae4f08e623737be9a71ec0';
const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=';
const futureWeatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&'


/* ===================================================================================
---------------       COORDINATES VARIABLES         ---------------
====================================================================================*/
let lon = '';
let lat = '';



/* ===================================================================================
---------------       CLICK FUNCTION         ---------------
====================================================================================*/
/* Each time the searchButton is clicked:
    - Grab the value of the searchInput
    - Change it to lower case, replace all spaces with a +, then assign it to empty string of cityName
    - Build the url from the apiUrl, apiKey, and cityName
*/
searchButton.addEventListener('click', function() {
  const searchInput = $('#searchInput').val();
  cityName = searchInput.toLowerCase().replaceAll(' ', '+');
  currentUrl = `${currentWeatherUrl}${cityName}${apiKey}`

  checkCurrentWeather();
});


/* ===================================================================================
---------------       CURRENT WEATHER FUNCTION         ---------------
====================================================================================*/
/* This function will:
    - Fetch the url and put it in a response variable
    - Change that response to json and store in variable data
    - Change the text content of the temp h1
    - Change the text content of the location p
*/
async function checkCurrentWeather() {
  //grab data from api
  const response = await fetch(currentUrl);
  let data = await response.json();

  //append date to page
  $('#temp h1').text(data.main.temp.toFixed(0) + '\u00B0');
  $('#inputLocationResult').text(data.name);
  $('#humidity').text(data.main.humidity + '%');
  $('#cloudy').text(data.weather[0].description);
  $('#wind').text(data.wind.speed.toFixed(1) + ' MPH');

  // add lat and lon to variable; change to strings
  lon = data.coord.lon.toString();
  lat = data.coord.lat.toString();

  //construct furtureUrl
  futureUrl = `${futureWeatherUrl}lat=${lat}&lon=${lon}${apiKey}`
  console.log(futureUrl);

  checkFutureWeather();
};




/* ===================================================================================
---------------       FUTURE WEATHER FUNCTION         ---------------
====================================================================================*/
async function checkFutureWeather() {
  //grab data from api
  const response = await fetch(futureUrl);
  let data = await response.json();

  //loop through each future day div and append weather
  for (let i=0; i<6; i++) {
    let timeStamp = data.list[i].dt_txt;
    // console.log(dayjs(timeStamp).format('dddd'));


    $(`#dayPlus${i} .futDay`).text(dayjs(timeStamp).format('dddd'));
    $(`#dayPlus${i} .futTemp`).text(data.list[i].main.temp.toFixed(0));
    $(`#dayPlus${i} .futWind`).text(data.list[i].wind.speed.toFixed(1));
    $(`#dayPlus${i} .futHum`).text(data.list[i].main.humidity);
  }
}



