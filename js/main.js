import { createStarRating } from "./components/StarRating.js";
import { mockWineries, mockRecentWineRatings, mockRecentWineryRatings } from "./mockData.js";

const sessionUser = JSON.parse(sessionStorage.getItem("wineui.user") || "null");
if (!sessionUser) {
	window.location.href = "index.html";
}

document.getElementById("logout-btn").addEventListener("click", () => {
	sessionStorage.removeItem("wineui.user");
	window.location.href = "index.html";
});

// --- Current winery ------------------------------------------------------

const LAST_WINERY_KEY = "wineui.lastWineryId";
const GEOLOCATION_TIMEOUT_MS = 6000;

const currentWineryEl = document.getElementById("current-winery");
const currentWineryNameEl = document.getElementById("current-winery-name");
const currentWineryLocationEl = document.getElementById("current-winery-location");

/**
 * @param {import('./mockData').mockWineries[number]|undefined} winery
 */
function setCurrentWinery(winery) {
	if (!winery) {
		currentWineryEl.classList.add("is-empty");
		currentWineryNameEl.textContent = "No winery yet";
		currentWineryLocationEl.textContent = "Search below to check in somewhere.";
		return;
	}

	currentWineryEl.classList.remove("is-empty");
	currentWineryNameEl.textContent = winery.loc_name;
	currentWineryLocationEl.textContent = `${winery.city}, ${winery.state}`;
	localStorage.setItem(LAST_WINERY_KEY, String(winery.id_location));
}

/**
 * @returns {import('./mockData').mockWineries[number]|undefined}
 */
function getLastWinery() {
	const lastId = Number(localStorage.getItem(LAST_WINERY_KEY));
	return mockWineries.find((winery) => winery.id_location === lastId);
}

/**
 * Haversine distance between two lat/lng points, in kilometers.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 */
function distanceKm(lat1, lng1, lat2, lng2) {
	const toRad = (deg) => (deg * Math.PI) / 180;
	const earthRadiusKm = 6371;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * @param {number} lat
 * @param {number} lng
 * @returns {import('./mockData').mockWineries[number]}
 */
function findNearestWinery(lat, lng) {
	// TODO: replace with RemoteWineryServlet.findClosestWinery() once the backend is wired up.
	return mockWineries.reduce((closest, winery) =>
		distanceKm(lat, lng, winery.lat, winery.lng) < distanceKm(lat, lng, closest.lat, closest.lng) ? winery : closest
	);
}

function initCurrentWinery() {
	if (!("geolocation" in navigator)) {
		setCurrentWinery(getLastWinery());
		return;
	}

	navigator.geolocation.getCurrentPosition(
		(position) => {
			const nearest = findNearestWinery(position.coords.latitude, position.coords.longitude);
			setCurrentWinery(nearest);
		},
		() => {
			// Location sharing denied or unavailable - fall back to the last winery the user checked in at.
			setCurrentWinery(getLastWinery());
		},
		{ timeout: GEOLOCATION_TIMEOUT_MS }
	);
}

initCurrentWinery();

// --- Winery search -----------------------------------------------------

const searchForm = document.getElementById("winery-search-form");
const searchInput = document.getElementById("winery-search-input");
const resultsList = document.getElementById("winery-results");
const locateBtn = document.getElementById("locate-btn");

/**
 * @param {string} query
 */
function renderWineryResults(query) {
	resultsList.innerHTML = "";

	const trimmed = query.trim().toLowerCase();
	if (!trimmed) {
		return;
	}

	// TODO: replace with RemoteWineryServlet.searchWineries() once the backend is wired up.
	const matches = mockWineries.filter((winery) => {
		return (
			winery.loc_name.toLowerCase().includes(trimmed) ||
			winery.city.toLowerCase().includes(trimmed) ||
			winery.state.toLowerCase().includes(trimmed)
		);
	});

	if (matches.length === 0) {
		const empty = document.createElement("li");
		empty.className = "empty-state";
		empty.textContent = `No wineries found for "${query}".`;
		resultsList.appendChild(empty);
		return;
	}

	matches.forEach((winery) => {
		resultsList.appendChild(buildWineryResultItem(winery));
	});
}

/**
 * @param {import('./mockData').mockWineries[number]} winery
 */
function buildWineryResultItem(winery) {
	const item = document.createElement("li");
	item.className = "winery-result card";
	item.tabIndex = 0;
	item.setAttribute("role", "button");
	item.title = `Check in at ${winery.loc_name}`;

	const info = document.createElement("div");
	info.className = "winery-result-info";

	const title = document.createElement("h4");
	title.textContent = winery.loc_name;

	const subtitle = document.createElement("p");
	subtitle.textContent = `${winery.loc_type} · ${winery.city}, ${winery.state}`;

	info.appendChild(title);
	info.appendChild(subtitle);

	item.appendChild(info);
	item.appendChild(createStarRating(winery.rating, { showValue: false }));

	const checkIn = () => setCurrentWinery(winery);
	item.addEventListener("click", checkIn);
	item.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			checkIn();
		}
	});

	return item;
}

searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	renderWineryResults(searchInput.value);
});

locateBtn.addEventListener("click", () => {
	// TODO: use RemoteWineryServlet.findClosestWinery() with the browser geolocation API once available.
	searchInput.value = "";
	renderWineryResults(mockWineries[0].loc_name);
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

	const badge = document.createElement("span");
	badge.className = `wine-badge color-${entry.product.wine_color}`;
	badge.textContent = entry.product.wine_color;

	const title = document.createElement("div");
	title.className = "rating-card-title";
	title.textContent = entry.product.product_name;

	const subtitle = document.createElement("div");
	subtitle.className = "rating-card-subtitle";
	subtitle.textContent = entry.winery;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = `Rated ${formatDate(entry.ratedOn)}`;

	card.appendChild(badge);
	card.appendChild(title);
	card.appendChild(subtitle);
	card.appendChild(createStarRating(entry.rating));
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
