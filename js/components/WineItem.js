/**
 * Renders a single wine as a badge + name + rating row. Reusable anywhere a
 * wine is listed (a winery's wine list, recent-ratings cards, etc).
 */
import { createStarRating } from "./StarRating.js";

/**
 * @param {{product: import('../api/models').ProductDTO, rating?: number}} wine
 *   `rating`, when present, is the current user's own rating for this wine.
 *   When absent (and not editable), the wine's overall rating
 *   (`product.rating`) is shown instead, visually marked as not the user's
 *   own score.
 * @param {{editable?: boolean, onRate?: (value: number) => void}} [options]
 *   Pass `editable: true` to let the user tap to set/change their own
 *   rating; `onRate` is called with the new value.
 * @returns {HTMLElement}
 */
export function createWineItem(wine, options = {}) {
	const { product, rating } = wine;
	const { editable = false, onRate } = options;
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
	ratingBox.className = "wine-item-rating" + (hasUserRating || editable ? "" : " is-community");

	if (editable) {
		ratingBox.appendChild(
			createStarRating(rating, {
				editable: true,
				label: `Your rating for ${product.product_name}`,
				onRate,
			})
		);
	} else {
		ratingBox.appendChild(createStarRating(hasUserRating ? rating : product.rating, { showValue: false }));
	}

	const ratingLabel = document.createElement("span");
	ratingLabel.className = "wine-item-rating-label";
	ratingLabel.textContent = hasUserRating || editable ? "Your rating" : "Overall rating";
	ratingBox.appendChild(ratingLabel);

	if (editable && !hasUserRating) {
		const overallHint = document.createElement("span");
		overallHint.className = "wine-item-rating-hint";
		overallHint.textContent = `Overall ${product.rating.toFixed(1)}`;
		ratingBox.appendChild(overallHint);
	}

	item.appendChild(header);
	item.appendChild(ratingBox);

	return item;
}
