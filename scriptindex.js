
const API_KEY = "85d85292f0451bf371fb5829c79d0d3e";
const CITY = "Tampere";

const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}`;

const weatherTable = document.getElementById("weather-table");
const weatherTableBody = weatherTable.querySelector("tbody");

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const forecasts = data.list.slice(-50);
    forecasts.forEach(forecast => {
      const date = new Date(forecast.dt_txt);
      const temperature = (forecast.main.temp - 273.15).toFixed(1);
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed.toFixed(1);
      
      //html table 
      const row = `
        <tr>
          <td>${date.toLocaleString()}</td>
          <td>${temperature}</td>
          <td>${humidity}</td>
          <td>${windSpeed}</td>
        </tr>`;

      //put the row into the weather table
      weatherTableBody.insertAdjacentHTML("beforeend", row);
    });
  })
  .catch(error => {
    console.error("Error fetching weather data:", error);
  });

