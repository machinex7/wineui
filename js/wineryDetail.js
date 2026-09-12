import { createStarRating } from "./components/StarRating.js";
import { createWineItem } from "./components/WineItem.js";
import { mockWineries, mockWineryWines } from "./mockData.js";

const sessionUser = JSON.parse(sessionStorage.getItem("wineui.user") || "null");
if (!sessionUser) {
	window.location.href = "index.html";
}

const titleEl = document.getElementById("winery-page-title");
const nameEl = document.getElementById("winery-name");
const locationEl = document.getElementById("winery-location");
const ratingEl = document.getElementById("winery-rating");
const userRatingEl = document.getElementById("winery-user-rating-stars");
const photoEl = document.getElementById("winery-photo");
const winesListEl = document.getElementById("winery-wines-list");

const id = Number(new URLSearchParams(window.location.search).get("id"));
// TODO: replace with a RemoteWineryServlet lookup once the backend is wired up.
const winery = mockWineries.find((w) => w.id_location === id);

if (winery) {
	renderWinery(winery);
} else {
	renderNotFound();
}

/**
 * @param {import('./mockData').mockWineries[number]} winery
 */
function renderWinery(winery) {
	document.title = `${winery.loc_name} — Cellar Notes`;
	titleEl.textContent = winery.loc_name;
	nameEl.textContent = winery.loc_name;
	locationEl.textContent = `${winery.loc_type} · ${winery.city}, ${winery.state}`;
	ratingEl.appendChild(createStarRating(winery.rating));
	userRatingEl.appendChild(
		createStarRating(winery.userRating, {
			editable: true,
			label: `Your rating for ${winery.loc_name}`,
			onRate: (value) => {
				// TODO: replace with a winery-rating remote call once the backend is wired up.
				winery.userRating = value;
			},
		})
	);

	if (winery.photo) {
		const img = document.createElement("img");
		img.src = winery.photo;
		img.alt = winery.loc_name;
		photoEl.innerHTML = "";
		photoEl.appendChild(img);
	}

	renderWines(winery.id_company);
}

/**
 * @param {number} companyId
 */
function renderWines(companyId) {
	// TODO: replace with RemoteWineryServlet.getProductsForCompanyWithReview() once the backend is wired up.
	const wines = mockWineryWines[companyId] || [];

	if (wines.length === 0) {
		winesListEl.appendChild(buildEmptyState("No wines listed for this winery yet."));
		return;
	}

	wines.forEach((wine) => {
		winesListEl.appendChild(
			createWineItem(wine, {
				editable: true,
				onRate: (value) => {
					// TODO: replace with RemoteProductServlet.rateProduct() once the backend is wired up.
					wine.rating = value;
				},
			})
		);
	});
}

function renderNotFound() {
	titleEl.textContent = "Winery not found";
	winesListEl.appendChild(buildEmptyState("We couldn't find that winery."));
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
