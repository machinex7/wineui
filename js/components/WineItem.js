/**
 * Renders a single wine as a badge + name + rating row. Reusable anywhere a
 * wine is listed (a winery's wine list, recent-ratings cards, etc).
 */
import { createStarRating } from "./StarRating.js";

/**
 * @param {{product: import('../api/models').ProductDTO, rating?: number}} wine
 *   `rating`, when present, is the current user's own rating for this wine.
 *   When absent, the wine's overall rating (`product.rating`) is shown
 *   instead, visually marked as not the user's own score.
 * @returns {HTMLElement}
 */
export function createWineItem(wine) {
	const { product, rating } = wine;
	const hasUserRating = rating !== undefined && rating !== null;

	const item = document.createElement("div");
	item.className = "wine-item";

	const badge = document.createElement("span");
	badge.className = `wine-badge color-${product.wine_color}`;
	badge.textContent = product.wine_color;

	const name = document.createElement("div");
	name.className = "wine-item-name";
	name.textContent = product.product_name;

	const header = document.createElement("div");
	header.className = "wine-item-header";
	header.appendChild(badge);
	header.appendChild(name);

	const ratingBox = document.createElement("div");
	ratingBox.className = "wine-item-rating" + (hasUserRating ? "" : " is-community");
	ratingBox.appendChild(createStarRating(hasUserRating ? rating : product.rating, { showValue: false }));

	const ratingLabel = document.createElement("span");
	ratingLabel.className = "wine-item-rating-label";
	ratingLabel.textContent = hasUserRating ? "Your rating" : "Overall rating";
	ratingBox.appendChild(ratingLabel);

	item.appendChild(header);
	item.appendChild(ratingBox);

	return item;
}
