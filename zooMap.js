document.addEventListener('DOMContentLoaded', () => {
    const mapImage = document.querySelector('.map-img');
    const mainContainer = document.getElementById('main-home');
    let currentScale = 1;
    const minScale = 0.5;
    const maxScale = 3;
    const scaleStep = 0.25;

    // Create zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.className = 'map-controls';
    zoomControls.innerHTML = `
        <button id="zoom-in" aria-label="Zoom In">+</button>
        <button id="zoom-out" aria-label="Zoom Out">-</button>
        <button id="reset-map" aria-label="Reset Map">⟲</button>
    `;
    mainContainer.appendChild(zoomControls);

    // Set initial transform origin
    mapImage.style.transformOrigin = 'center center';

    // Define the updateZoom function
    function updateZoom() {
        mapImage.style.transform = `scale(${currentScale})`;
        zoomControls.querySelector('#zoom-out').disabled = currentScale <= minScale;
        zoomControls.querySelector('#zoom-in').disabled = currentScale >= maxScale;

        // Adjust container size for proper scrolling
        const scaledWidth = mapImage.naturalWidth * currentScale;
        const scaledHeight = mapImage.naturalHeight * currentScale;
        mainContainer.style.minWidth = `${scaledWidth}px`;
        mainContainer.style.minHeight = `${scaledHeight}px`;
    }

    // Add this after selecting mapImage:
    if (!mapImage.complete) {
        mapImage.onload = () => {
            mainContainer.style.minWidth = `${mapImage.naturalWidth}px`;
            mainContainer.style.minHeight = `${mapImage.naturalHeight}px`;
        };
    } else {
        mainContainer.style.minWidth = `${mapImage.naturalWidth}px`;
        mainContainer.style.minHeight = `${mapImage.naturalHeight}px`;
    }

    // Button event handlers
    zoomControls.querySelector('#zoom-in').addEventListener('click', () => {
        if (currentScale < maxScale) {
            currentScale = Math.min(maxScale, currentScale + scaleStep);
            updateZoom();
        }
    });

    zoomControls.querySelector('#zoom-out').addEventListener('click', () => {
        if (currentScale > minScale) {
            currentScale = Math.max(minScale, currentScale - scaleStep);
            updateZoom();
        }
    });

    zoomControls.querySelector('#reset-map').addEventListener('click', () => {
        currentScale = 1;
        updateZoom();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '+' || e.key === '=') {
            zoomControls.querySelector('#zoom-in').click();
            e.preventDefault();
        } else if (e.key === '-' || e.key === '_') {
            zoomControls.querySelector('#zoom-out').click();
            e.preventDefault();
        } else if (e.key === '0') {
            zoomControls.querySelector('#reset-map').click();
            e.preventDefault();
        }
    });

    // Touch gestures (pinch zoom)
    let initialDistance = null;

    function getTouchDistance(e) {
        return Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }

    mapImage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = getTouchDistance(e);
        }
    });

    mapImage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialDistance !== null) {
            const newDistance = getTouchDistance(e);
            const scale = newDistance / initialDistance;
            currentScale = Math.min(maxScale, Math.max(minScale, currentScale * scale));
            updateZoom();
            initialDistance = newDistance;
            e.preventDefault();
        }
    });

    // Initialize zoom controls
    updateZoom();
});
