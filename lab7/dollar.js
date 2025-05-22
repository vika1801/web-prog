function showExchange() {
    const table = document.getElementById('dollar-table');
    const detail = document.getElementById('detail');
    const stats = document.getElementById('stats');
    const button = document.querySelector('button');

     table.innerHTML = '';
    detail.innerHTML = '';
    stats.innerHTML = '';

    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>День</th><th>Курс, руб</th>';
    
    exchange.forEach((rate, index) => {
        const row = table.insertRow();
        row.innerHTML = `<td>День ${index + 1}</td><td>${rate.toFixed(4)}</td>`;
    });

    const average = exchange.reduce((a, b) => a + b, 0) / exchange.length;

     detail.innerHTML = `
        <div class="summary">
            <h3>Средний курс:</h3>
            <p class="average-value">${average.toFixed(4)} руб</p>
        </div>
    `;
   const min = Math.min(...exchange);
    const max = Math.max(...exchange);
    
    stats.innerHTML = `
        <div class="stats-box">
            <p>Минимальный курс: <span class="min-value">${min.toFixed(4)}</span></p>
            <p>Максимальный курс: <span class="max-value">${max.toFixed(4)}</span></p>
        </div>
    `;
    
     button.style.display = 'none'; // Альтернатива: button.remove()
}