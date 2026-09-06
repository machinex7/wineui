/**
 * Renders a 5-star rating display (supports half stars) as a DOM element.
 */

const FULL_STAR = "★"; // ★
const STAR_COUNT = 5;

/**
 * @param {number} rating - value from 0 to maxRating
 * @param {{maxRating?: number, showValue?: boolean}} [options]
 * @returns {HTMLElement}
 */
export function createStarRating(rating, options = {}) {
	const { maxRating = STAR_COUNT, showValue = true } = options;
	const clamped = Math.max(0, Math.min(rating, maxRating));
	const percent = (clamped / maxRating) * 100;

	const wrapper = document.createElement("span");
	wrapper.className = "star-rating";
	wrapper.setAttribute("role", "img");
	wrapper.setAttribute("aria-label", `Rated ${clamped} out of ${maxRating} stars`);

	const back = document.createElement("span");
	back.className = "stars-back";
	back.textContent = FULL_STAR.repeat(maxRating);
	back.setAttribute("aria-hidden", "true");

	const front = document.createElement("span");
	front.className = "stars-front";
	front.style.width = percent + "%";
	front.textContent = FULL_STAR.repeat(maxRating);
	front.setAttribute("aria-hidden", "true");

	wrapper.appendChild(back);
	wrapper.appendChild(front);

	if (showValue) {
		const value = document.createElement("span");
		value.className = "star-rating-value";
		value.textContent = clamped.toFixed(1);
		wrapper.appendChild(value);
	}

	return wrapper;
}
