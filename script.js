const apiKey = "eed7d172a7119db99e04af8684a79a22"; 

function showLoader(show) {
  document.getElementById('loader').style.display = show ? 'block' : 'none';
}

function displayWeather(data) {
  const weatherResult = document.getElementById('weatherResult');
  const timezoneOffset = data.timezone; 
  const localTime = new Date(new Date().getTime() + timezoneOffset * 1000).toUTCString().slice(17, 22);

  weatherResult.classList.remove('hidden');
  weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].main} - ${data.weather[0].description}</p>
    <p>🌡️ ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    <p>🕒 Local Time: ${localTime}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
  `;
}

function getWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Please enter a city name.");
  showLoader(true);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      showLoader(false);
      if (data.cod !== 200) throw new Error(data.message);
      displayWeather(data);
    })
    .catch(err => {
      showLoader(false);
      alert("Error: " + err.message);
    });
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    showLoader(true);
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          showLoader(false);
          displayWeather(data);
        })
        .catch(err => {
          showLoader(false);
          alert("Error: " + err.message);
        });
    }, () => {
      showLoader(false);
      alert("Location permission denied.");
    });
  } else {
    alert("Geolocation not supported.");
  }
}
