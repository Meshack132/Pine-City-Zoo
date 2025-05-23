class WeatherWidget {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.widgetContainer = document.getElementById('weather-widget');
        this.mobileWidget = document.getElementById('weather-widget-mobile');
        this.cacheTTL = 10 * 60 * 1000; // 10 minutes cache
        
        this.initializeWidget();
    }

    async initializeWidget() {
        try {
            const position = await this.getGeolocation();
            await this.getWeatherData(position.coords);
            this.setupAutoRefresh();
        } catch (error) {
            this.handleError(error);
        }
    }

    getGeolocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => reject(error),
                { timeout: 5000 }
            );
        });
    }

    async getWeatherData(coords) {
        const cacheKey = `weather_${coords.latitude}_${coords.longitude}`;
        const cachedData = this.getCachedWeather(cacheKey);

        if (cachedData) {
            this.updateWeatherDisplay(cachedData);
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${this.apiKey}`
            );

            if (!response.ok) throw new Error('Weather data unavailable');
            
            const data = await response.json();
            this.cacheWeatherData(cacheKey, data);
            this.updateWeatherDisplay(data);
        } catch (error) {
            throw new Error(`Failed to fetch weather: ${error.message}`);
        }
    }

    updateWeatherDisplay(data) {
        const template = this.createWeatherTemplate(data);
        
        if (this.widgetContainer) {
            this.widgetContainer.innerHTML = template;
        }
        
        if (this.mobileWidget) {
            this.mobileWidget.innerHTML = template;
        }
    }

    createWeatherTemplate(data) {
        return `
            <div class="weather-content">
                <h3 aria-label="Current weather">${data.name}</h3>
                <div class="weather-main">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
                         alt="${data.weather[0].description}" 
                         class="weather-icon">
                    <div class="weather-temp">
                        <span class="temp-value">${Math.round(data.main.temp)}</span>
                        <span class="temp-unit">°C</span>
                    </div>
                </div>
                <div class="weather-details">
                    <p class="weather-description">${data.weather[0].main}</p>
                    <div class="weather-stats">
                        <div class="stat-item">
                            <span class="stat-label">Feels like</span>
                            <span class="stat-value">${Math.round(data.main.feels_like)}°C</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Humidity</span>
                            <span class="stat-value">${data.main.humidity}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Wind</span>
                            <span class="stat-value">${data.wind.speed} m/s</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCachedWeather(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp > this.cacheTTL) return null;

        return data;
    }

    cacheWeatherData(key, data) {
        const cache = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(cache));
    }

    setupAutoRefresh() {
        // Refresh every 5 minutes
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                position => this.getWeatherData(position.coords),
                error => console.error('Geolocation error:', error)
            );
        }, 5 * 60 * 1000);
    }

    handleError(error) {
        console.error('Weather Widget Error:', error);
        const errorMessage = `
            <div class="weather-error">
                <p>Weather data unavailable</p>
                <button class="retry-btn">Retry</button>
            </div>
        `;

        if (this.widgetContainer) {
            this.widgetContainer.innerHTML = errorMessage;
        }
        
        if (this.mobileWidget) {
            this.mobileWidget.innerHTML = errorMessage;
        }

        document.querySelector('.retry-btn')?.addEventListener('click', () => {
            this.initializeWidget();
        });
    }
}

// Initialize the weather widget
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('weather-widget') || document.getElementById('weather-widget-mobile')) {
        // Use your OpenWeatherMap API key here
        const apiKey = '5ab84bd2085862553b001857e271201f';
        new WeatherWidget(apiKey);
    }
});