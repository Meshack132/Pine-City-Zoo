// Initialize all modules
import { AnimalGallery } from './animalGallery.js';
import { WeatherWidget } from './weatherWidget.js';
import { initZooMap } from './zooMap.js';
import { optimizeApp } from './optimizations.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    new AnimalGallery();
    new WeatherWidget('YOUR_OPENWEATHER_API_KEY');
    initZooMap();
    optimizeApp();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    }
});