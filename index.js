// Замените 'YOUR_API_KEY' на ваш собственный ключ с OpenWeatherMap
const apiKey = '48f6474e55bb773cca24b29812550d23';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка получения данных о погоде', error);
        throw new Error('Не удалось получить данные о погоде. Пожалуйста, попробуйте еще раз.');
    }
}

function updateUI(weatherData, containerId) {
    const container = document.getElementById(`weather-container-${containerId}`);
    container.innerHTML = `
        <h1>${weatherData.name}</h1>
        <div id="weather-icon-${containerId}"></div>
        <p id="temperature-${containerId}">${Math.round(weatherData.main.temp)}°C</p>
        <p id="description-${containerId}">${weatherData.weather[0].description}</p>
    `;

    document.getElementById(`weather-icon-${containerId}`).innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="Weather Icon">`;
}

async function searchWeather() {
    const cities = JSON.parse(localStorage.getItem('savedCities')) || [];

    if (cities.length === 0) {
        for (let i = 1; i <= 3; i++) {
            const cityInput = prompt(`Введите название города ${i}:`);
            cities.push(cityInput);
        }

        localStorage.setItem('savedCities', JSON.stringify(cities));
    }

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];

        try {
            const weatherData = await getWeather(city);

            const container = document.createElement('div');
            container.className = 'weather-container';
            container.id = `weather-container-${i}`;
            document.getElementById('app').appendChild(container);

            updateUI(weatherData, i);
        } catch (error) {
            console.error(`Error getting weather data for ${city}`, error);
            alert(`Could not get weather data for ${city}. Please try again.`);
        }
    }
}

searchWeather();