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