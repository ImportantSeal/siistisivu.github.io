const API_KEY = "85d85292f0451bf371fb5829c79d0d3e";
const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Tampere&appid=${API_KEY}`;

const ctx = document.getElementById("wind-speed-chart").getContext("2d");
const chartConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Tuulennopeus (m/s)",
        data: [],
        borderColor: "rgb(219,197,0)",
        tension: 0.3,
      },
    ],
  },
  options: {
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 10,
        grid: {
          color: "rgba(128, 128, 128, 0.9)",
          borderWidth: 2,
        },
      },
      x: {
        grid: {
          color: "rgba(128, 128, 128, 0.6)",
          borderWidth: 2,
        },
      },
    },
  },
};
const chart = new Chart(ctx, chartConfig);


let prevDate = "";
const today = new Date();

setInterval(() => {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const hourlyData = data.list;
      const windSpeedData = [];
      const labels = [];
      let numHours = 0;
      for (let i = 0; i < hourlyData.length; i++) {
        const date = new Date(hourlyData[i].dt * 1000);
        const hours = date.getHours();
        const day = date.getDay();
        const dateDiff = day - today.getDay();
        const labelDate = new Date(today.getTime() + (dateDiff * 24 * 60 * 60 * 1000));
        const label = `${hours}:00 ${labelDate.toLocaleDateString(undefined, { weekday: "short"  })}`;
        if (numHours >= 20) {
          break; // stop after retrieving 20 hours of data
        }
        const windSpeed = hourlyData[i].wind.speed;
        windSpeedData.push(windSpeed);
        labels.push(label);
        numHours++;
      }
      chartConfig.data.datasets[0].data = windSpeedData;
      chartConfig.data.labels = labels;
      chart.update();
    })
    .catch((error) => console.log(error));
}, 600); // update

const CITY_NAME = "Tampere";
const NUM_RECORDS = 20;

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const records = data.list
      .map(record => ({
        date: new Date(record.dt_txt).toLocaleString(),
        windspeed: record.wind.speed.toFixed(0),
      }))
      .slice(0, NUM_RECORDS);

    // Add rows to the table
    // Add the records to the table
const tbody = document.querySelector("tbody");
records.forEach(record => {
  const row = document.createElement("tr");
  const dateCell = document.createElement("td");
  dateCell.textContent = record.date;
  row.appendChild(dateCell);
  const windspeedCell = document.createElement("td");
  windspeedCell.textContent = record.windspeed;
  row.appendChild(windspeedCell);
  tbody.appendChild(row);
});

// Calculate and add the mean, mode, median, standard deviation, and range to the table
const windspeeds = records.map(record => record.windspeed);
const sum = windspeeds.reduce((total, windspeed) => total + parseFloat(windspeed), 0);
const mean = sum / windspeeds.length;
document.querySelector("#mean").textContent = mean.toFixed(2);

const mode = windspeeds.reduce((a, b, i, arr) => {
  const occurrences = arr.filter(v => v === b).length;
  if (occurrences > arr.filter(v => v === a).length) {
    return b;
  } else {
    return a;
  }
}, null);
document.querySelector("#mode").textContent = mode;

const sortedWindspeeds = windspeeds.sort((a, b) => a - b);
const middleIndex = Math.floor(sortedWindspeeds.length / 2);
let median;
if (sortedWindspeeds.length % 2 === 0) {
  median = (parseFloat(sortedWindspeeds[middleIndex - 1]) + parseFloat(sortedWindspeeds[middleIndex])) / 2;
} else {
  median = parseFloat(sortedWindspeeds[middleIndex]);
}
document.querySelector("#median").textContent = median.toFixed(2);

const meanDiffSquared = windspeeds.map(windspeed => Math.pow(windspeed - mean, 2));
const variance = meanDiffSquared.reduce((total, diff) => total + diff, 0) / meanDiffSquared.length;
const standardDeviation = Math.sqrt(variance);
document.querySelector("#standard-deviation").textContent = standardDeviation.toFixed(2);

const min = Math.min(...windspeeds);
const max = Math.max(...windspeeds);
const range = max - min;
document.querySelector("#range").textContent = `${min}-${max} (${range})`;
  })
  .catch(error => {
    console.error(error);
  });


