/**
 * @file init.js
 * @author Vincenzo Bonura
 * @date 29/06/2024
 *
 * This script contains the application initialization functions
 */

/*define global constants*/
const menuToggle = document.getElementById("menuToggle");
const footer = document.getElementsByTagName("footer")[0];
const navMap = {
	nav: {},
	current: [],
};
const args = arguments;
const animationDuration = 300;

/*define global variables*/
let disableKey = false;

/**
 * This function creates the structure of the presentation
 * @param {Object} arguments - the config data
 */
function initStructure(arguments) {
	/*create the Title page*/
	const s0 = document.createElement("section");
	const a0 = document.createElement("article");
	const h1 = document.createElement("h1");
	const ul = document.createElement("ul");
	s0.id = "s0";
	a0.id = "s0p0";
	h1.classList.add("pageTitle");
	h1.textContent = arguments.title;
	const subtle = document.createElement("p");
	if (args.hasOwnProperty("subtitle") && args.subtitle.length) {
		subtle.classList.add("subtle");
		subtle.textContent = arguments.subtitle;
	}
	let sectionCounter = 1;
	arguments.sections.forEach(section => {
		let li = document.createElement("li");
		let a = document.createElement("a");
		a.href = "./#s" + sectionCounter + "p0";
		a.textContent = section.title;
		li.appendChild(a);
		ul.appendChild(li);
		sectionCounter++;
	});
	a0.append(h1);
	console.log(subtle.textContent.length);
	if (subtle.textContent.length > 0) a0.append(subtle);
	a0.append(ul);
	s0.append(a0);
	document.getElementById("legend").after(s0);

	/* create sections structure */
	sectionCounter = 1;
	arguments.sections.forEach(section => {
		let s = document.createElement("section");
		s.id = "s" + sectionCounter;

		/* create section cover page */
		let p = document.createElement("article");
		p.id = "s" + sectionCounter + "p0";
		p.className = "page";
		let h2 = document.createElement("h2");
		h2.classList.add("pageTitle");
		h2.textContent = section.title;
		p.appendChild(h2);
		s.appendChild(p);

		/* create pages structure */
		for (let i = 1; i <= section.slides; i++) {
			let p = document.createElement("article");
			p.id = "s" + sectionCounter + "p" + i;
			p.className = "page";
			p.dataset.slide = section.title.toLowerCase().replace(/\s/g, "") + "-" + i;
			s.appendChild(p);
		}

		footer.before(s);
		sectionCounter++;
	});

	/* Create Thanks page */
	if (args.defaultThanksPage) {
		let s = document.createElement("section");
		s.id = "s" + sectionCounter;
		let p = document.createElement("article");
		p.id = "s" + sectionCounter + "p0";
		p.className = "page";
		let h2 = document.createElement("h2");
		h2.classList.add("pageTitle");
		h2.textContent = "Thanks for watching!";
		p.appendChild(h2);
		s.appendChild(p);
		footer.before(s);
	} else {
		//TODO: insert custom thanks page from args.customThanksPageUrl
	}
}

/**
 * This function adds the name of the author and the creation date to the footer,
 * getting data from config file
 */
function credits(args) {
	let credits = document.createElement("p");
	credits.textContent = "\u00A9" + new Date(args.date).getFullYear() + " " + args.author;
	footer.appendChild(credits);
}

/**
 * This function include HTML code from external files using AJAX
 */
function includeSlides(callback) {
	const slidesProgress = document.getElementById("initProgress");
	/**
	 * Updates the loading status of the slides
	 * @param {Number} state - The current state of the progress
	 * @param {Number} total - The total number of the progress
	 */
	function progress(state, total) {
		let percentage = (state / total) * 100;
		if (percentage < 100) {
			slidesProgress.children[0].style.width = percentage + "%";
		} else {
			slidesProgress.remove();
		}
	}

	initStructure(args);
	credits(args);

	const slides = document.querySelectorAll("article[data-slide]");
	let loadedSlides = 0;
	for (let i = 0; i < slides.length; i++) {
		let slide = slides[i];
		let slideId = slide.getAttribute("id") + "-" + slide.getAttribute("data-slide");

		fetch("./slides/" + slideId + ".html")
			.then(response => response.text())
			.then(data => {
				slide.innerHTML = data;
				loadedSlides++;
				progress(loadedSlides, slides.length);
				if (loadedSlides === slides.length) {
					callback();
				}
			});
	}
}

/**
 * Initialize the navigation map getting fragment ids from every page,
 * and set the current position based on the hash
 */
function initMap() {
	/*create the map*/
	const sections = document.getElementsByTagName("section");
	for (let i = 0; i < sections.length; i++) {
		let pages = sections[i].getElementsByClassName("page");
		navMap.nav[i] = {};
		for (let j = 0; j < pages.length; j++) {
			navMap.nav[i][j] = pages[j].id;
		}
	}

	/*set current position*/
	if (window.location.hash) {
		updateCurrentPosition(window.location.hash);
	} else {
		navMap.current[0] = 0;
		navMap.current[1] = 0;
	}

	/*create the navigation menu*/
	initNav(sections);

	/*create inPage navigation*/
	initInPageNav(sections);
}

/**
 * Check if the requested page exists
 * @param {Number} section - The section of the application
 * @param {Number} page - The page of the section
 * @returns {Boolean} - True if the page exists, false otherwise
 */
function checkPageExists(section, page) {
	if (navMap.nav[section]) {
		if (navMap.nav[section][page]) {
			return true;
		}
	}
	return false;
}

/**
 * Add a listener for the keyboard events
 */
function initKeyboardListener() {
	window.addEventListener("keydown", function (event) {
		if (!disableKey) {
			disableKey = true;
			kPress(event);
			setTimeout(() => {
				disableKey = false;
			}, animationDuration);
		}
	});
	window.addEventListener("hashchange", function (event) {
		updateCurrentPosition(window.location.hash);
	});
}

/**
 * Update the current position in the navigation map based on the hash
 * @param {String} hash - The hash of the page
 */
function updateCurrentPosition(hash) {
	let frag = hash.slice(2);
	navMap.current[0] = parseInt(frag.split("p")[0]);
	navMap.current[1] = parseInt(frag.split("p")[1]);
}

/**
 * Initialize the navigation menu
 * @param {Array} sections - The sections of the application
 */
function initNav(sections) {
	const navTitle = document.querySelector("nav h4");
	const nav = document.querySelector("nav ul");

	/*set the menu title*/
	navTitle.textContent = args.title;

	/*create the nemu items based on the navMap*/
	for (let i = 1; i < sections.length - 1; i++) {
		// bypass section 0 and thanks slide

		/*first level: main page of section*/
		let li = document.createElement("li");
		let a = document.createElement("a");
		let pages = sections[i].getElementsByClassName("page");
		a.href = "./#" + pages[0].id;
		a.textContent = pages[0].getElementsByTagName("h2")[0].textContent;
		li.appendChild(a);

		/*second level: inner pages of section*/
		if (pages.length > 1) {
			let ul = document.createElement("ul");
			for (let j = 1; j < pages.length; j++) {
				//j = 1: bypass cover page for each section

				let subli = document.createElement("li");
				let a = document.createElement("a");
				a.href = "./#" + pages[j].id;
				a.textContent = pages[j].getElementsByTagName("h3")[0] ? pages[j].getElementsByTagName("h3")[0].textContent : "...";
				subli.appendChild(a);
				ul.appendChild(subli);
			}
			li.appendChild(ul);
		}
		nav.appendChild(li);
	}

	let navItems = document.querySelectorAll("nav ul li a");
	navItems.forEach(item => {
		item.addEventListener("click", function (event) {
			menuToggle.checked = false;
		});
	});
}

/**
 * Initialize the inPageNavigation
 * @param {Array} sections - The sections of the application
 */
function initInPageNav(sections) {
	let pageCounter = 0;
	for (let i = 1; i < sections.length; i++) {
		//i = 1: bypass section 0
		let pages = sections[i].getElementsByClassName("page");
		for (let j = 0; j < pages.length; j++) {
			/*display page number*/
			pageCounter++;
			pages[j].setAttribute("data-page", pageCounter);

			/*goUp*/
			if (i > 1 && checkPageExists(i - 1, 0)) {
				let goUp = document.createElement("a");
				goUp.href = "./#" + navMap.nav[i - 1][0];
				goUp.className = "inPageNav goUp";
				goUp.textContent = sections[i - 1].getElementsByClassName("pageTitle")[0].textContent;
				pages[j].appendChild(goUp);
			}

			/*goDown*/
			if (i < sections.length - 1 && checkPageExists(i + 1, 0)) {
				let goDown = document.createElement("a");
				goDown.href = "./#" + navMap.nav[i + 1][0];
				goDown.className = "inPageNav goDown";
				goDown.textContent = sections[i + 1].getElementsByClassName("pageTitle")[0].textContent;
				pages[j].appendChild(goDown);
			}

			/*goRight*/
			if (j < pages.length - 1 && checkPageExists(i, j + 1)) {
				let goRight = document.createElement("a");
				goRight.href = "./#" + navMap.nav[i][j + 1];
				goRight.className = "inPageNav goRight";
				goRight.textContent = pages[j + 1].getElementsByClassName("pageTitle")[0]
					? pages[j + 1].getElementsByClassName("pageTitle")[0].textContent
					: "...";
				pages[j].appendChild(goRight);
			}

			/*goLeft*/
			if (j > 0 && checkPageExists(i, j - 1)) {
				let goLeft = document.createElement("a");
				goLeft.href = "./#" + navMap.nav[i][j - 1];
				goLeft.className = "inPageNav goLeft";
				goLeft.textContent = pages[j - 1].getElementsByClassName("pageTitle")[0]
					? pages[j - 1].getElementsByClassName("pageTitle")[0].textContent
					: "...";
				pages[j].appendChild(goLeft);
			}
		}
	}
}
