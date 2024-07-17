/**
 * @file presentation.js
 * @author Vincenzo Bonura
 * @date 15/07/2024
 *
 * This script handles the presentation logic for the application
 */

/**
 * This function contains the scripts functional to the content of the slides, not necessary for the platform to function
 */
function inPageScripts() {
    /* PAGE: Transformation in action: Cube */
    let cube = document.getElementById("cube");
    document.querySelectorAll("input[name=cubeRotation").forEach(btn => btn.addEventListener("change", function(){
        cube.classList.remove(...cube.classList);
        cube.classList.add(this.value);
    }));

    let cubeContainer = document.getElementById("cubeContainer");
    document.getElementById("togglePerspective").addEventListener("change", function(){
        cubeContainer.classList.toggle("perspective");
    });
}