// Прокрутка наверх
document.getElementById('scrollToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Подсветка активного пункта меню
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = location.pathname.split('/').pop();
  const links = document.querySelectorAll('nav a');
  
  links.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});
// Обработка новостей
document.addEventListener('DOMContentLoaded', function() {
    // Показ полного текста новости
    const showMoreButtons = document.querySelectorAll('.show-more');
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fullText = this.getAttribute('data-fulltext');
            const paragraph = this.previousElementSibling;
            
            if (this.textContent === 'Показать полностью') {
                paragraph.textContent = fullText;
                this.textContent = 'Свернуть';
            } else {
                const shortText = fullText.substring(0, 100) + '...';
                paragraph.textContent = shortText;
                this.textContent = 'Показать полностью';
            }
        });
    });
    
    // Кнопка "Наверх" для всех страниц
    const topButton = document.querySelector('.to-top');
    if (topButton) {
        topButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Для currency.html (если не добавлено ранее)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('currencyChart')) {
        // Загрузка курса с API ЦБ
        fetch('https://www.cbr-xml-daily.ru/daily_json.js')
            .then(response => response.json())
            .then(data => {
                const egpRate = data.Valute.EGP.Value;
                document.getElementById('current-rate').textContent = egpRate.toFixed(4);
                
                // Калькулятор RUB → EGP
                document.getElementById('convert-rub').addEventListener('click', () => {
                    const rub = parseFloat(document.getElementById('rub-input').value);
                    if (!isNaN(rub)) {
                        const result = rub / egpRate;
                        document.getElementById('egp-output').value = result.toFixed(2);
                    }
                });
                
                // Калькулятор EGP → RUB
                document.getElementById('convert-egp').addEventListener('click', () => {
                    const egp = parseFloat(document.getElementById('egp-input').value);
                    if (!isNaN(egp)) {
                        const result = egp * egpRate;
                        document.getElementById('rub-output').value = result.toFixed(2);
                    }
                });
                
                // Построение графика
                const ctx = document.getElementById('currencyChart').getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['1 мая', '5 мая', '10 мая', '15 мая', '20 мая', '25 мая', '30 мая'],
                        datasets: [{
                            label: 'EGP/RUB',
                            data: [3.15, 3.18, 3.22, 3.19, 3.25, 3.28, 3.30],
                            backgroundColor: '#3b82f6',
                            borderColor: '#2563eb',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false
                            }
                        },
                        onClick: (e, elements) => {
                            if (elements.length) {
                                const index = elements[0].index;
                                const date = chart.data.labels[index];
                                const rate = chart.data.datasets[0].data[index];
                                alert(`Дата: ${date}\nКурс: 1 EGP = ${rate} RUB`);
                            }
                        }
                    }
                });
            });
    }
});
// Функция для работы с новостями
function setupNewsPage() {
    const showMoreButtons = document.querySelectorAll('.show-more');
    
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newsCard = this.closest('.news-card');
            const preview = newsCard.querySelector('.news-preview');
            const fullText = newsCard.querySelector('.news-full');
            
            if (fullText.style.display === 'none' || !fullText.style.display) {
                fullText.style.display = 'block';
                preview.style.display = 'none';
                this.textContent = 'Свернуть';
            } else {
                fullText.style.display = 'none';
                preview.style.display = 'block';
                this.textContent = 'Показать полностью';
            }
        });
    });
}

// В основном обработчике DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Кнопка "Наверх"
    const toTopBtn = document.querySelector('.to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            toTopBtn.style.display = 'flex';
        } else {
            toTopBtn.style.display = 'none';
        }
    });
    
    toTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Подсветка активного пункта меню
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Инициализация новостей, если на странице
    if (document.querySelector('.news-grid')) {
        setupNewsPage();
    }
});
// Общие функции
// ... (код из предыдущих страниц)

// Функции для страницы курса валют
async function loadCurrencyData() {
    try {
        // Загрузка текущего курса
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        
        // Получаем курс EGP (Египетский фунт)
        const egpRate = data.Valute.EGP.Value;
        const prevRate = data.Valute.EGP.Previous;
        
        // Обновляем интерфейс
        document.getElementById('current-rate').textContent = egpRate.toFixed(2);
        
        // Рассчитываем изменение
        const change = egpRate - prevRate;
        const changePercent = ((change / prevRate) * 100).toFixed(1);
        
        const changeElement = document.getElementById('rate-change');
        changeElement.querySelector('span').textContent = 
            `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
        
        // Обновляем иконку
        const icon = changeElement.querySelector('i');
        icon.className = change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        
        // Время обновления
        const updateDate = new Date(data.Date);
        document.getElementById('update-time').textContent = 
            `Сегодня, ${updateDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`;
        
        // Инициализация калькулятора
        setupCurrencyCalculator(egpRate);
        
        // Загрузка данных для графика
        loadHistoricalData(30);
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные о курсе валют. Пожалуйста, попробуйте позже.');
    }
}

function setupCurrencyCalculator(egpRate) {
    const rubInput = document.getElementById('rub-input');
    const egpOutput = document.getElementById('egp-output');
    const egpInput = document.getElementById('egp-input');
    const rubOutput = document.getElementById('rub-output');
    
    // Рубли → Египетские фунты
    rubInput.addEventListener('input', () => {
        const rub = parseFloat(rubInput.value) || 0;
        egpOutput.value = (rub / egpRate).toFixed(2);
    });
    
    // Египетские фунты → Рубли
    egpInput.addEventListener('input', () => {
        const egp = parseFloat(egpInput.value) || 0;
        rubOutput.value = (egp * egpRate).toFixed(2);
    });
    
    // Инициализация первого расчета
    rubInput.dispatchEvent(new Event('input'));
}

async function loadHistoricalData(days) {
    try {
        // Создаем массив дат за последние N дней
        const dates = [];
        const today = new Date();
        
        for (let i = days; i >= 1; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            dates.push(date);
        }
        
        // Собираем данные о курсе
        const rates = [];
        const labels = [];
        
        for (const date of dates) {
            const formattedDate = date.toISOString().split('T')[0];
            const url = `https://www.cbr-xml-daily.ru/archive/${date.getFullYear()}/${String(date.getMonth()+1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/daily_json.js`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) continue; // Пропускаем если нет данных
                
                const data = await response.json();
                if (data.Valute && data.Valute.EGP) {
                    rates.push(data.Valute.EGP.Value);
                    labels.push(moment(date).format('DD MMM'));
                }
            } catch (error) {
                console.warn(`Ошибка загрузки данных за ${formattedDate}:`, error);
            }
        }
        
        // Рассчитываем статистику
        const minRate = Math.min(...rates).toFixed(2);
        const maxRate = Math.max(...rates).toFixed(2);
        const avgRate = (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2);
        
        document.getElementById('min-rate').textContent = `${minRate} ₽`;
        document.getElementById('max-rate').textContent = `${maxRate} ₽`;
        document.getElementById('avg-rate').textContent = `${avgRate} ₽`;
        
        // Строим график
        renderCurrencyChart(labels, rates);
        
    } catch (error) {
        console.error('Ошибка загрузки исторических данных:', error);
    }
}

function renderCurrencyChart(labels, rates) {
    const ctx = document.getElementById('currency-chart').getContext('2d');
    
    // Удаляем предыдущий график если был
    if (window.currencyChart) {
        window.currencyChart.destroy();
    }
    
    window.currencyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Курс EGP (руб)',
                data: rates,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Курс: ${context.parsed.y.toFixed(2)} ₽`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Рублей за 1 EGP'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Дата'
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const date = labels[index];
                    const rate = rates[index].toFixed(2);
                    
                    // Сбрасываем выделение
                    window.currencyChart.data.datasets[0].backgroundColor = 
                        window.currencyChart.data.datasets[0].backgroundColor.map(() => 'rgba(59, 130, 246, 0.7)');
                    
                    // Выделяем выбранный столбец
                    window.currencyChart.data.datasets[0].backgroundColor[index] = 'rgba(16, 185, 129, 0.9)';
                    window.currencyChart.update();
                    
                    alert(`Курс EGP на ${date}: ${rate} рублей`);
                }
            }
        }
    });
}

function setupChartButtons() {
    const buttons = document.querySelectorAll('.chart-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Загружаем данные за выбранный период
            const days = parseInt(this.dataset.period);
            loadHistoricalData(days);
        });
    });
}

// В основном обработчике DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... (код из предыдущих страниц)
    
    // Инициализация страницы курса валют
    if (document.getElementById('currency-chart')) {
        // Загрузка данных будет инициирована через loadCurrencyData()
    }
});