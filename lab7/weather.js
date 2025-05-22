// weather.js
function loadWeather() {
    const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=55.0415&longitude=82.9346&hourly=temperature_2m&timezone=Asia%2FBangkok&forecast_days=1";
    const output = document.getElementById("weather-data");
    
    output.innerHTML = '<div class="loading">⏳ Загрузка данных...</div>';
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Ошибка: " + response.status);
            return response.json();
        })
        .then(data => {
            console.log("Ответ API:", data); // Для отладки
            
            if (!data.hourly?.time || !data.hourly?.temperature_2m) {
                throw new Error("Некорректные данные от сервера");
            }
            
            const times = data.hourly.time;
            const temps = data.hourly.temperature_2m;
            const currentDate = new Date().toISOString().split("T")[0];
            
            // Все доступные часы (для демонстрации)
            let html = "<h2>🌡️ Температура в Новосибирске:</h2><ul>";
            let hasData = false;
            
            times.forEach((time, index) => {
                const [date, fullHour] = time.split("T");
                const hour = fullHour.slice(0, 5);
                
                if (date === currentDate) {
                    html += `
                        <li>
                            <span class="time">🕒 ${hour}</span>
                            <span class="temp">${temps[index]}°C</span>
                        </li>
                    `;
                    hasData = true;
                }
            });
            
            html += "</ul>";
            
            if (!hasData) html = "<p>❌ Данные за сегодня отсутствуют.</p>";
            output.innerHTML = html;
        })
        .catch(error => {
            console.error("Ошибка:", error); 
            output.innerHTML = `<p class="error">⚠️ ${error.message}</p>`;
        });
}