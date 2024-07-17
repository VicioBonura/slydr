/**
 * @file main.js
 * @author Vincenzo Bonura
 * @date 29/06/2024
 *
 * this script handles the main logic for the application
 */

document.addEventListener('DOMContentLoaded', () => {
    includeSlides(() => {
        initKeyboardListener();
        initMap();
        inPageScripts();
    });
});