// Method A
// for APIs requiring the API key as an url parameter

const MY_API_KEY = "80d1993378fa9e47ffc9c7fec53fe1d2" // here add your API key
const API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=45.9&lon=8.96&units=metric&appid=" + MY_API_KEY

fetch(API_URL)
  .then(response => response.json()) 
  .then(data => display.Data (data))
  .catch(error => displayError(error))

  function displayData(data) {
    console.log(data)

    const FORECAST = data.list
    console.log(FORECAST)

    for (let item of FORECAST) {
      const DATE = item .dt_txt;
      const TEMP = item.main.temp;

    }