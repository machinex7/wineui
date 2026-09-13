import { createStarRating } from "./components/StarRating.js";
import { createWineItem } from "./components/WineItem.js";
import {
	mockRecentWineRatings,
	mockRecentWineryRatings,
	mockFriendActivity,
	mockWineryPosts,
	mockWineries,
} from "./mockData.js";
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

/**
 * @param {number} id
 */
function goToWinery(id) {
	window.location.href = `winery.html?id=${id}`;
}

function goToCurrentWinery() {
	if (currentWineryId !== undefined) {
		goToWinery(currentWineryId);
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
//
// Wine and winery ratings are merged into a single feed, sorted newest
// first. Wine cards show a wine symbol on the left; winery cards show a
// winery symbol on the right, so the two stay visually distinct at a glance.

const recentRatingsEl = document.getElementById("recent-ratings");

function renderRecentRatings() {
	recentRatingsEl.innerHTML = "";

	const entries = [
		...mockRecentWineRatings.map((entry) => ({ type: "wine", entry })),
		...mockRecentWineryRatings.map((entry) => ({ type: "winery", entry })),
	].sort((a, b) => new Date(b.entry.ratedOn) - new Date(a.entry.ratedOn));

	if (entries.length === 0) {
		recentRatingsEl.appendChild(buildEmptyState("Rate a wine or winery to see it here."));
		return;
	}

	entries.forEach(({ type, entry }) => {
		recentRatingsEl.appendChild(type === "wine" ? buildWineCard(entry) : buildWineryCard(entry));
	});
}

/**
 * @param {import('./mockData').mockRecentWineRatings[number]} entry
 */
function buildWineCard(entry) {
	const card = document.createElement("div");
	card.className = "rating-card rating-card-wine card";

	const icon = document.createElement("span");
	icon.className = "rating-card-icon";
	icon.setAttribute("aria-hidden", "true");
	icon.textContent = "\u{1F377}"; // wine glass

	const body = document.createElement("div");
	body.className = "rating-card-body";

	const subtitle = document.createElement("div");
	subtitle.className = "rating-card-subtitle";
	subtitle.textContent = entry.winery;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = `Rated ${formatDate(entry.ratedOn)}`;

	body.appendChild(createWineItem({ product: entry.product, rating: entry.rating }));
	body.appendChild(subtitle);
	body.appendChild(date);

	card.appendChild(icon);
	card.appendChild(body);

	// Ratings aren't editable here - tapping the card takes the user to the
	// winery page, where they can update it.
	const winery = mockWineries.find((w) => w.id_company === entry.product.id_company);
	if (winery) {
		makeCardLinkToWinery(card, winery.id_location, `Update your rating for ${entry.product.product_name} at ${entry.winery}`);
	}

	return card;
}

/**
 * @param {import('./mockData').mockRecentWineryRatings[number]} entry
 */
function buildWineryCard(entry) {
	const card = document.createElement("div");
	card.className = "rating-card rating-card-winery card";

	const icon = document.createElement("span");
	icon.className = "rating-card-icon";
	icon.setAttribute("aria-hidden", "true");
	icon.textContent = "\u{1F347}"; // grapes

	const body = document.createElement("div");
	body.className = "rating-card-body";

	const title = document.createElement("div");
	title.className = "rating-card-title";
	title.textContent = entry.winery;

	const subtitle = document.createElement("div");
	subtitle.className = "rating-card-subtitle";
	subtitle.textContent = entry.location;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = `Rated ${formatDate(entry.ratedOn)}`;

	body.appendChild(title);
	body.appendChild(subtitle);
	body.appendChild(createStarRating(entry.rating));
	body.appendChild(date);

	card.appendChild(icon);
	card.appendChild(body);

	// Ratings aren't editable here - tapping the card takes the user to the
	// winery page, where they can update it.
	makeCardLinkToWinery(card, entry.id_location, `Update your rating for ${entry.winery}`);

	return card;
}

// --- Friends & wineries you follow ----------------------------------------
//
// Placeholder feed combining friends' recent ratings with posts from
// wineries the user follows. Backed by mock data for now - the real
// friends/following API definitions are still to come.

const friendFeedEl = document.getElementById("friend-feed");

function renderFriendFeed() {
	friendFeedEl.innerHTML = "";

	const items = [
		...mockFriendActivity.map((entry) => ({ kind: "friend-rating", entry, date: entry.ratedOn })),
		...mockWineryPosts.map((entry) => ({ kind: "winery-post", entry, date: entry.postedOn })),
	].sort((a, b) => new Date(b.date) - new Date(a.date));

	if (items.length === 0) {
		friendFeedEl.appendChild(buildEmptyState("Follow friends and wineries to see their activity here."));
		return;
	}

	items.forEach(({ kind, entry }) => {
		friendFeedEl.appendChild(kind === "friend-rating" ? buildFriendRatingCard(entry) : buildWineryPostCard(entry));
	});
}

/**
 * @param {import('./mockData').mockFriendActivity[number]} entry
 */
function buildFriendRatingCard(entry) {
	const card = document.createElement("div");
	card.className = "rating-card card";

	const icon = document.createElement("span");
	icon.className = "rating-card-icon";
	icon.setAttribute("aria-hidden", "true");
	icon.textContent = "\u{1F464}"; // person silhouette

	const body = document.createElement("div");
	body.className = "rating-card-body";

	const title = document.createElement("div");
	title.className = "rating-card-title";
	title.textContent = entry.friendName;

	const subtitle = document.createElement("div");
	subtitle.className = "rating-card-subtitle";
	subtitle.textContent = entry.type === "wine" ? `Rated ${entry.productName} at ${entry.winery}` : `Rated ${entry.winery}`;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = `Rated ${formatDate(entry.ratedOn)}`;

	body.appendChild(title);
	body.appendChild(subtitle);
	body.appendChild(createStarRating(entry.rating));
	body.appendChild(date);

	card.appendChild(icon);
	card.appendChild(body);

	makeCardLinkToWinery(card, entry.id_location, `View ${entry.winery}`);

	return card;
}

/**
 * @param {import('./mockData').mockWineryPosts[number]} entry
 */
function buildWineryPostCard(entry) {
	const card = document.createElement("div");
	card.className = "rating-card card";

	const icon = document.createElement("span");
	icon.className = "rating-card-icon";
	icon.setAttribute("aria-hidden", "true");
	icon.textContent = "\u{1F4E3}"; // megaphone

	const body = document.createElement("div");
	body.className = "rating-card-body";

	const title = document.createElement("div");
	title.className = "rating-card-title";
	title.textContent = entry.winery;

	const message = document.createElement("div");
	message.className = "rating-card-subtitle";
	message.textContent = entry.message;

	const date = document.createElement("div");
	date.className = "rating-card-date";
	date.textContent = formatDate(entry.postedOn);

	body.appendChild(title);
	body.appendChild(message);
	body.appendChild(date);

	card.appendChild(icon);
	card.appendChild(body);

	makeCardLinkToWinery(card, entry.id_location, `View ${entry.winery}`);

	return card;
}

/**
 * Makes a recent-ratings card navigate to the given winery's page on click
 * or keyboard activation.
 * @param {HTMLElement} card
 * @param {number} wineryId
 * @param {string} title
 */
function makeCardLinkToWinery(card, wineryId, title) {
	card.setAttribute("role", "button");
	card.tabIndex = 0;
	card.title = title;
	card.addEventListener("click", () => goToWinery(wineryId));
	card.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			goToWinery(wineryId);
		}
	});
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

renderRecentRatings();
renderFriendFeed();
