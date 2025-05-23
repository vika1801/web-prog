async function loadWeatherData() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=55.0415&longitude=82.9346&hourly=temperature_2m,surface_pressure&current_weather=true';

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Текущие данные
    const currentTemp = data.current_weather.temperature;
    const currentPressure = data.hourly.surface_pressure[0];
    document.getElementById('currentWeather').innerHTML = `
      <p>Текущая температура: ${currentTemp}°C</p>
      <p>Текущее давление: ${currentPressure} hPa</p>
    `;

    // Данные для гистограммы (прогноз на сегодня)
    const today = new Date().toISOString().split('T')[0];
    const todayData = data.hourly.time
      .map((time, index) => ({ 
        time, 
        temp: data.hourly.temperature_2m[index], 
        pressure: data.hourly.surface_pressure[index] 
      }))
      .filter(item => item.time.startsWith(today));

    // Построение гистограмм
    renderChart('temperatureChart', 'Температура (°C)', todayData.map(item => item.temp), 'rgba(255, 99, 132, 0.5)');
    renderChart('pressureChart', 'Давление (hPa)', todayData.map(item => item.pressure), 'rgba(54, 162, 235, 0.5)');
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

function renderChart(canvasId, label, data, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from({ length: data.length }, (_, i) => `${i}:00`),
      datasets: [{
        label: label,
        data: data,
        backgroundColor: color,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}