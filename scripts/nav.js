/**
 * @file nav.js
 * @author Vincenzo Bonura
 * @date 29/06/2024
 *
 * This script handles the navigation logic for the application
 */

/**
 * Handle the keyboard press
 * @param {KeyboardEvent} e - the keyboard event
 */
function kPress(e) {
	/**
	 * Get the max number of sections
	 * @returns {number}
	 */
	function maxSections() {
		return Object.keys(navMap.nav).length - 1;
	}

	/**
	 * Get the max number of pages in the current section
	 * @returns {number}
	 */
	function maxPages() {
		return navMap.current[0] === 0 ? 0 : Object.keys(navMap.nav[navMap.current[0]]).length - 1;
	}

	switch (e.key) {
		case "\\": //toggle legend
        /* fall-through */
        case "q":
			document.querySelector("#legend").classList.toggle("hidden");
			break;
		case "i": //toggle inpage navigation
			document.body.classList.toggle("showInPageNav");
			break;
		case "m": //toggle menu
			menuToggle.click();
			break;
		case "j":
		/* fall-through */
		case "ArrowDown":
			navMap.current[0] = navMap.current[0] === maxSections() ? maxSections() : navMap.current[0] + 1;
			navMap.current[1] = 0;
			navigateTo(navMap.current[0], navMap.current[1]);
			break;
		case "k":
		/* fall-through */
		case "ArrowUp":
			navMap.current[0] = navMap.current[0] === 0 ? 0 : navMap.current[0] - 1;
			navMap.current[1] = 0;
			navigateTo(navMap.current[0], navMap.current[1]);
			break;
		case "l":
		/* fall-through */
		case "ArrowRight":
			if (navMap.current[1] === maxPages() || navMap.current[0] === 0) {
				navMap.current[0]++;
				navMap.current[1] = 0;
			} else {
				navMap.current[1]++;
			}
			navigateTo(navMap.current[0], navMap.current[1]);
			break;
		case "h":
		/* fall-through */
		case "ArrowLeft":
			if (navMap.current[1] === 0) {
				navMap.current[0] = navMap.current[0] === 0 ? 0 : navMap.current[0] - 1;
				navMap.current[1] = maxPages();
			} else {
				navMap.current[1]--;
			}
			navigateTo(navMap.current[0], navMap.current[1]);
			break;
		default:
			break;
	}
}

/**
 * Navigate to a specific section and page
 * @param {Number} section - The section of the application
 * @param {Number} page - The page of the section
 */
function navigateTo(section, page) {
	window.location.hash = "#s" + section + "p" + page;
}
