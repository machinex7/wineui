import { createStarRating } from "./components/StarRating.js";
import { createWineItem } from "./components/WineItem.js";
import { mockRecentWineRatings, mockRecentWineryRatings } from "./mockData.js";
import { getLastWinery, findNearestWinery } from "./winery.js";

const sessionUser = JSON.parse(sessionStorage.getItem("wineui.user") || "null");
if (!sessionUser) {
	window.location.href = "index.html";
}

// --- Current winery ------------------------------------------------------

const GEOLOCATION_TIMEOUT_MS = 6000;

const filledEl = document.getElementById("current-winery-filled");
const nameEl = document.getElementById("current-winery-name");
const emptyForm = document.getElementById("current-winery-search-form");
const emptySearchInput = document.getElementById("current-winery-search-input");

/** @type {number|undefined} */
let currentWineryId;

/**
 * @param {import('./mockData').mockWineries[number]|undefined} winery
 */
function setCurrentWinery(winery) {
	if (!winery) {
		currentWineryId = undefined;
		filledEl.hidden = true;
		emptyForm.hidden = false;
		return;
	}

	currentWineryId = winery.id_location;
	nameEl.textContent = winery.loc_name;
	filledEl.title = `View ${winery.loc_name}`;
	filledEl.setAttribute("aria-label", `View ${winery.loc_name}`);
	filledEl.hidden = false;
	emptyForm.hidden = true;
}

function goToCurrentWinery() {
	if (currentWineryId !== undefined) {
		window.location.href = `winery.html?id=${currentWineryId}`;
	}
}

filledEl.addEventListener("click", goToCurrentWinery);
filledEl.addEventListener("keydown", (event) => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		goToCurrentWinery();
	}
});

function initCurrentWinery() {
	// A winery the user already checked in to takes priority over a fresh location lookup.
	const last = getLastWinery();
	if (last) {
		setCurrentWinery(last);
		return;
	}

	if (!("geolocation" in navigator)) {
		setCurrentWinery(undefined);
		return;
	}

	navigator.geolocation.getCurrentPosition(
		(position) => {
			const nearest = findNearestWinery(position.coords.latitude, position.coords.longitude);
			setCurrentWinery(nearest);
		},
		() => {
			setCurrentWinery(undefined);
		},
		{ timeout: GEOLOCATION_TIMEOUT_MS }
	);
}

initCurrentWinery();

emptyForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const query = emptySearchInput.value.trim();
	window.location.href = query ? `search.html?q=${encodeURIComponent(query)}` : "search.html";
});

// --- Recent ratings ------------------------------------------------------

const recentWinesEl = document.getElementById("recent-wines");
const recentWineriesEl = document.getElementById("recent-wineries");

function renderRecentWines() {
	recentWinesEl.innerHTML = "";

	if (mockRecentWineRatings.length === 0) {
		recentWinesEl.appendChild(buildEmptyState("Rate a wine to see it here."));
		return;
	}

	mockRecentWineRatings.forEach((entry) => {
		recentWinesEl.appendChild(buildWineCard(entry));
	});
}

function renderRecentWineries() {
	recentWineriesEl.innerHTML = "";

	if (mockRecentWineryRatings.length === 0) {
		recentWineriesEl.appendChild(buildEmptyState("Rate a winery to see it here."));
		return;
	}

	mockRecentWineryRatings.forEach((entry) => {
		recentWineriesEl.appendChild(buildWineryCard(entry));
	});
}

/**
 * @param {import('./mockData').mockRecentWineRatings[number]} entry
 */
function buildWineCard(entry) {
	const card = document.createElement("div");
	card.className = "rating-card card";

	const subtitle = document.createElement("div");
	subtitle.className = "rating-card-subtitle";
	subtitle.textContent = entry.winery;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = `Rated ${formatDate(entry.ratedOn)}`;

	card.appendChild(createWineItem({ product: entry.product, rating: entry.rating }));
	card.appendChild(subtitle);
	card.appendChild(date);

	return card;
}

/**
 * @param {import('./mockData').mockRecentWineryRatings[number]} entry
 */
function buildWineryCard(entry) {
	const card = document.createElement("div");
	card.className = "rating-card card";

	const title = document.createElement("div");
	title.className = "rating-card-title";
	title.textContent = entry.winery;

	const subtitle = document.createElement("div");
	subtitle.className = "rating-card-subtitle";
	subtitle.textContent = entry.location;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = `Rated ${formatDate(entry.ratedOn)}`;

	card.appendChild(title);
	card.appendChild(subtitle);
	card.appendChild(createStarRating(entry.rating));
	card.appendChild(date);

	return card;
}

/**
 * @param {string} message
 */
function buildEmptyState(message) {
	const el = document.createElement("div");
	el.className = "empty-state";
	el.textContent = message;
	return el;
}

/**
 * @param {string} isoDate
 */
function formatDate(isoDate) {
	const date = new Date(isoDate);
	return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

renderRecentWines();
renderRecentWineries();
