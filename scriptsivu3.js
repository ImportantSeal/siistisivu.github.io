const API_KEY = "85d85292f0451bf371fb5829c79d0d3e";
const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Tampere&appid=${API_KEY}`;


const ctx = document.getElementById("humidity-chart").getContext("2d");
const chartConfig = {
  type: "bar", 
  data: {
    labels: [],
    datasets: [
      {
        label: "Ilmankosteus (%)",
        data: [],
        backgroundColor: "rgba(219,197,0, 0.8)", //bar color and stuff
        borderColor: "rgb(219,197,0)",
        borderWidth: 0.1,
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
          color: "rgba(128, 128, 128, 0.2)",
          borderWidth: 1,
        },
      },
    },
  }
};

const chart = new Chart(ctx, chartConfig);

let prevDate = "";  
const today = new Date();

setInterval(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const hourlyData = data.list;
        const humidityData = [];
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
            break; // stop after 20 hours
          }
          const humidity = hourlyData[i].main.humidity;
          humidityData.push(humidity);
          labels.push(label);
          numHours++;
        }
        chartConfig.data.datasets[0].data = humidityData;
        chartConfig.data.labels = labels;
        chart.update();
      })
      .catch((error) => console.log(error));
  }, 600); // update 10min


  const CITY_NAME = "Tampere";
const NUM_RECORDS = 20;


fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const records = data.list
      .map(record => ({
        date: new Date(record.dt_txt).toLocaleString(),
        humidity: record.main.humidity.toFixed(0),
      }))
      .slice(0, NUM_RECORDS);

    const tbody = document.querySelector("tbody");
    records.forEach(record => {
      const row = document.createElement("tr");
      const dateCell = document.createElement("td");
      dateCell.textContent = record.date;
      row.appendChild(dateCell);
      const humidityCell = document.createElement("td");
      humidityCell.textContent = record.humidity;
      row.appendChild(humidityCell);
      tbody.appendChild(row);
    });



    const humidities = records.map(record => record.humidity);

    //mean
    const sum = humidities.reduce((total, humidity) => total + parseFloat(humidity), 0);
    const mean = sum / humidities.length;
    document.querySelector("#mean").textContent = mean.toFixed(2);



    //mode
    const mode = humidities.reduce((a, b, i, arr) => {
      const occurrences = arr.filter(v => v === b).length;
      if (occurrences > arr.filter(v => v === a).length) {
        return b;
      } else {
        return a;
      }
    }, null);
    document.querySelector("#mode").textContent = mode;



    //mediaani
    const sortedHumidities = humidities.sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedHumidities.length / 2);
    let median;
    if (sortedHumidities.length % 2 === 0) {
      median = (parseFloat(sortedHumidities[middleIndex - 1]) + parseFloat(sortedHumidities[middleIndex])) / 2;
    } else {
      median = parseFloat(sortedHumidities[middleIndex]);
    }
    document.querySelector("#median").textContent = median.toFixed(1);





    //keskihajonta
    const meanDiffSquared = humidities.map(humidity => Math.pow(humidity - mean, 2));
    const variance = meanDiffSquared.reduce((total, diff) => total + diff, 0) / meanDiffSquared.length;
    const standardDeviation = Math.sqrt(variance);
    document.querySelector("#standard-deviation").textContent = standardDeviation.toFixed(1);



    //range
    const min = Math.min(...humidities);
    const max = Math.max(...humidities);
    const range = max - min;
    document.querySelector("#range").textContent = `${min}-${max} (${range})`;
  })
  .catch(error => {
    console.error(error);
  });


