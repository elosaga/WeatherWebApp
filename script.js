// API URL and Key
const url = 'https://api.openweathermap.org/data/2.5/';
const key = '4c9c30fa839be8a08d151af1edc92af1';

// Set query when Enter key is pressed
const setQuery = (e) => {
  if (e.keyCode == '13') {
    getResult(searchBar.value);
  }
};

// Fetch weather and forecast data for the given city
const getResult = (cityName) => {
  if (!cityName) {
    alert("Please enter a city name.");
    return;
  }
  
  let weatherQuery = `${url}weather?q=${cityName}&appid=${key}&units=metric&lang=en`;
  let forecastQuery = `${url}forecast?q=${cityName}&appid=${key}&units=metric&lang=en`;

  fetch(weatherQuery)
    .then(weather => weather.json())
    .then(displayWeatherResult)
    .catch(error => console.error('Error fetching the weather data:', error));

  fetch(forecastQuery)
    .then(forecast => forecast.json())
    .then(displayForecastResult)
    .catch(error => console.error('Error fetching the forecast data:', error));
};

// Display weather data
const displayWeatherResult = (result) => {
  if (result.cod !== 200) {
    alert("City not found. Please enter a valid city name.");
    return;
  }

  let city = document.querySelector('.city');
  city.innerText = `${result.name}, ${result.sys.country}`;

  let temp = document.querySelector('.temp');
  temp.innerText = `${Math.round(result.main.temp)}°C`;

  let desc = document.querySelector('.desc');
  desc.innerHTML = `${getWeatherIcon(result.weather[0].icon)} ${result.weather[0].description}`;

  let minmax = document.querySelector('.minmax');
  minmax.innerText = `${Math.round(result.main.temp_min)}°C / ${Math.round(result.main.temp_max)}°C`;

  setBackground(result.weather[0].main);

  // Save the city name in localStorage
  localStorage.setItem('lastCity', result.name);
};

// Display 5-day forecast data
const displayForecastResult = (result) => {
  const forecastContainer = document.querySelector('.forecast');
  forecastContainer.innerHTML = ''; // Clear previous forecast

  result.list.forEach((forecast, index) => {
    if (index % 8 === 0) { // Get data for every 24 hours (8 * 3-hour intervals = 24 hours)
      const forecastElem = document.createElement('div');
      forecastElem.classList.add('forecast-item');

      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const temp = `${Math.round(forecast.main.temp)}°C`;
      const desc = forecast.weather[0].description;
      const icon = getWeatherIcon(forecast.weather[0].icon);

      forecastElem.innerHTML = `
        <div class="forecast-day">${day}</div>
        <div class="forecast-temp">${temp}</div>
        <div class="forecast-desc">${icon} ${desc}</div>
      `;

      forecastContainer.appendChild(forecastElem);
    }
  });
};

// Get weather icon based on icon code
const getWeatherIcon = (iconCode) => {
  switch (iconCode) {
    case '01d': return '<i class="fas fa-sun"></i>';
    case '01n': return '<i class="fas fa-moon"></i>';
    case '02d': return '<i class="fas fa-cloud-sun"></i>';
    case '02n': return '<i class="fas fa-cloud-moon"></i>';
    case '03d': case '03n': return '<i class="fas fa-cloud"></i>';
    case '04d': case '04n': return '<i class="fas fa-cloud-meatball"></i>';
    case '09d': case '09n': return '<i class="fas fa-cloud-showers-heavy"></i>';
    case '10d': return '<i class="fas fa-cloud-sun-rain"></i>';
    case '10n': return '<i class="fas fa-cloud-moon-rain"></i>';
    case '11d': case '11n': return '<i class="fas fa-poo-storm"></i>';
    case '13d': case '13n': return '<i class="fas fa-snowflake"></i>';
    case '50d': case '50n': return '<i class="fas fa-smog"></i>';
    default: return '<i class="fas fa-question"></i>';
  }
};

// Set background based on weather condition
const setBackground = (weatherMain) => {
  let body = document.querySelector('body');
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      body.style.backgroundImage = "url('clear.jpg')";
      break;
    case 'clouds':
      body.style.backgroundImage = "url('clouds.jpg')";
      break;
    case 'rain':
      body.style.backgroundImage = "url('rain.jpg')";
      break;
    case 'drizzle':
      body.style.backgroundImage = "url('drizzle.jpg')";
      break;
    case 'thunderstorm':
      body.style.backgroundImage = "url('thunderstorm.jpg')";
      break;
    case 'snow':
      body.style.backgroundImage = "url('snow.jpg')";
      break;
    case 'mist':
    case 'fog':
    case 'haze':
      body.style.backgroundImage = "url('mist.jpg')";
      break;
    default:
      body.style.backgroundImage = "url('default.jpg')";
      break;
  }
};

// Check localStorage for the last searched city
window.onload = () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    getResult(lastCity);
  }
};

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keypress', setQuery);
