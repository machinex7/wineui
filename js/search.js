import { createStarRating } from "./components/StarRating.js";
import { mockWineries } from "./mockData.js";
import { checkIn, findNearestWinery } from "./winery.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsList = document.getElementById("search-results");
const mapEl = document.getElementById("search-map");
const locateMeBtn = document.getElementById("locate-me-btn");

const MAP_PADDING_PERCENT = 12;

/** @type {Map<number, HTMLElement>} */
const pinsById = new Map();
/** @type {Map<number, HTMLElement>} */
const resultsById = new Map();

const bounds = computeBounds(mockWineries);
renderMapPins();

// Pre-fill from a ?q= query param (e.g. arriving from the header's quick search).
const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
searchInput.value = initialQuery;
renderResults(initialQuery);

searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	renderResults(searchInput.value);
});

searchInput.addEventListener("input", () => {
	renderResults(searchInput.value);
});

locateMeBtn.addEventListener("click", () => {
	if (!("geolocation" in navigator)) {
		return;
	}
	navigator.geolocation.getCurrentPosition((position) => {
		const { latitude, longitude } = position.coords;
		placeYouAreHere(latitude, longitude);
		const nearest = findNearestWinery(latitude, longitude);
		highlightWinery(nearest.id_location);
	});
});

/**
 * @param {string} query
 */
function renderResults(query) {
	resultsList.innerHTML = "";
	resultsById.clear();

	const trimmed = query.trim().toLowerCase();
	// TODO: replace with RemoteWineryServlet.searchWineries() once the backend is wired up.
	const matches = trimmed
		? mockWineries.filter(
				(winery) =>
					winery.loc_name.toLowerCase().includes(trimmed) ||
					winery.city.toLowerCase().includes(trimmed) ||
					winery.state.toLowerCase().includes(trimmed)
			)
		: mockWineries;

	if (matches.length === 0) {
		const empty = document.createElement("li");
		empty.className = "empty-state";
		empty.textContent = `No wineries found for "${query}".`;
		resultsList.appendChild(empty);
		return;
	}

	matches.forEach((winery) => {
		const item = buildWineryResultItem(winery);
		resultsById.set(winery.id_location, item);
		resultsList.appendChild(item);
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

	item.addEventListener("mouseenter", () => setActivePin(winery.id_location));
	item.addEventListener("mouseleave", () => setActivePin(undefined));

	const select = () => selectWinery(winery);
	item.addEventListener("click", select);
	item.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			select();
		}
	});

	return item;
}

/**
 * @param {import('./mockData').mockWineries[number]} winery
 */
function selectWinery(winery) {
	checkIn(winery);
	window.location.href = "main.html";
}

function renderMapPins() {
	mockWineries.forEach((winery) => {
		const pin = document.createElement("button");
		pin.type = "button";
		pin.className = "map-pin";
		pin.style.left = projectToPercent(winery.lng, bounds.minLng, bounds.maxLng) + "%";
		pin.style.top = 100 - projectToPercent(winery.lat, bounds.minLat, bounds.maxLat) + "%";
		pin.title = winery.loc_name;

		const label = document.createElement("span");
		label.className = "map-pin-label";
		label.textContent = winery.loc_name;

		pin.textContent = "\u{1F4CD}";
		pin.appendChild(label);

		pin.addEventListener("mouseenter", () => setActivePin(winery.id_location));
		pin.addEventListener("mouseleave", () => setActivePin(undefined));
		pin.addEventListener("click", () => selectWinery(winery));

		pinsById.set(winery.id_location, pin);
		mapEl.appendChild(pin);
	});
}

/**
 * @param {number} lat
 * @param {number} lng
 */
function placeYouAreHere(lat, lng) {
	const existing = mapEl.querySelector(".map-you-are-here");
	if (existing) {
		existing.remove();
	}

	const dot = document.createElement("div");
	dot.className = "map-you-are-here";
	dot.title = "You are here";
	dot.style.left = clampPercent(projectToPercent(lng, bounds.minLng, bounds.maxLng)) + "%";
	dot.style.top = clampPercent(100 - projectToPercent(lat, bounds.minLat, bounds.maxLat)) + "%";
	mapEl.appendChild(dot);
}

/**
 * @param {number|undefined} id
 */
function setActivePin(id) {
	pinsById.forEach((pin, pinId) => pin.classList.toggle("is-active", pinId === id));
	resultsById.forEach((item, itemId) => item.classList.toggle("is-active", itemId === id));
}

/**
 * @param {number} id
 */
function highlightWinery(id) {
	setActivePin(id);
	const item = resultsById.get(id);
	if (item) {
		item.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}
}

/**
 * @param {Array<{lat: number, lng: number}>} wineries
 */
function computeBounds(wineries) {
	const lats = wineries.map((w) => w.lat);
	const lngs = wineries.map((w) => w.lng);
	return {
		minLat: Math.min(...lats),
		maxLat: Math.max(...lats),
		minLng: Math.min(...lngs),
		maxLng: Math.max(...lngs),
	};
}

/**
 * Projects a coordinate into a 0-100 percent range within the map bounds, with padding.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function projectToPercent(value, min, max) {
	const span = max - min || 1;
	const usable = 100 - MAP_PADDING_PERCENT * 2;
	return MAP_PADDING_PERCENT + ((value - min) / span) * usable;
}

/**
 * @param {number} percent
 */
function clampPercent(percent) {
	return Math.max(2, Math.min(98, percent));
}
