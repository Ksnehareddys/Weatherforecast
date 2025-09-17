// 🚨 Replace this with your OpenWeatherMap API key
const API_KEY = "da17e7241a82eeb5df6ee7dc849e73c3";  

const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

locBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (err) {
    weatherDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Location not found");
    const data = await res.json();
    displayWeather(data);
    fetchForecast(lat, lon);
  } catch (err) {
    weatherDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  weatherDiv.innerHTML = `
    <h2>${name}</h2>
    <img src="${icon}" alt="${weather[0].description}" />
    <p>${weather[0].description}</p>
    <p><strong>${main.temp}°C</strong> (Feels like ${main.feels_like}°C)</p>
    <p>Min: ${main.temp_min}°C | Max: ${main.temp_max}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind: ${wind.speed} m/s</p>
  `;
}

async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Forecast unavailable");
    const data = await res.json();
    displayForecast(data);
  } catch (err) {
    forecastDiv.innerHTML = `<p style="color:red;">Forecast unavailable</p>`;
  }
}

function displayForecast(data) {
  forecastDiv.innerHTML = "";
  const daily = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  Object.keys(daily).slice(0, 6).forEach(date => {
    const item = daily[date];
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <h4>${date}</h4>
        <img src="${icon}" alt="${item.weather[0].description}" />
        <p>${item.main.temp}°C</p>
      </div>
    `;
  });
}
