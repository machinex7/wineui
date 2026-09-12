/**
 * Renders a 5-star rating widget as a DOM element.
 *
 * Read-only by default (supports half-star display, e.g. a 3.5 average).
 * Pass `editable: true` to get a touch-friendly widget of tappable stars
 * that calls `onRate(value)` with a whole-star value when the user sets
 * their own rating.
 */

const FULL_STAR = "★";
const EMPTY_STAR = "☆";
const STAR_COUNT = 5;

/**
 * @param {number} [rating] - the user's own rating, from 0 to maxRating. Omit/undefined if they haven't rated it.
 * @param {{maxRating?: number, showValue?: boolean, editable?: boolean, onRate?: (value: number) => void, label?: string, averageRating?: number}} [options]
 *   `averageRating`, for an editable widget with no `rating` yet, is shown as
 *   gray filled stars (instead of gold) so it reads as "not your rating".
 * @returns {HTMLElement}
 */
export function createStarRating(rating, options = {}) {
	const { maxRating = STAR_COUNT, showValue = true, editable = false, onRate, label = "Rating", averageRating } = options;

	return editable
		? createEditableStarRating(rating, { maxRating, onRate, label, averageRating })
		: createReadOnlyStarRating(rating, { maxRating, showValue });
}

/**
 * @param {number} rating
 * @param {{maxRating: number, showValue: boolean}} options
 */
function createReadOnlyStarRating(rating, { maxRating, showValue }) {
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

/**
 * @param {number|undefined} rating
 * @param {{maxRating: number, onRate?: (value: number) => void, label: string, averageRating?: number}} options
 */
function createEditableStarRating(rating, { maxRating, onRate, label, averageRating }) {
	let hasOwnRating = rating !== undefined && rating !== null;
	let value = hasOwnRating ? Math.round(rating) : Math.round(averageRating || 0);
	let previewValue = 0;

	const wrapper = document.createElement("div");
	wrapper.className = "star-rating star-rating-editable";
	wrapper.setAttribute("role", "radiogroup");

	/** @type {HTMLButtonElement[]} */
	const buttons = [];
	for (let i = 1; i <= maxRating; i++) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "star-rating-star";
		button.setAttribute("role", "radio");

		button.addEventListener("click", () => commit(i));
		button.addEventListener("mouseenter", () => setPreview(i));
		button.addEventListener("focus", () => setPreview(i));

		buttons.push(button);
		wrapper.appendChild(button);
	}

	wrapper.addEventListener("mouseleave", () => setPreview(0));
	wrapper.addEventListener(
		"blur",
		() => setPreview(0),
		true
	);
	wrapper.addEventListener("keydown", (event) => {
		let next;
		if (event.key === "ArrowRight" || event.key === "ArrowUp") {
			next = Math.min(maxRating, (value || 0) + 1);
		} else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
			next = Math.max(1, (value || 1) - 1);
		} else if (event.key === "Home") {
			next = 1;
		} else if (event.key === "End") {
			next = maxRating;
		} else {
			return;
		}
		event.preventDefault();
		commit(next);
		buttons[next - 1].focus();
	});

	/**
	 * @param {number} i
	 */
	function setPreview(i) {
		previewValue = i;
		render();
	}

	/**
	 * @param {number} i
	 */
	function commit(i) {
		hasOwnRating = true;
		value = i;
		previewValue = 0;
		render();
		if (onRate) {
			onRate(value);
		}
	}

	function render() {
		const isPreviewing = previewValue > 0;
		const activeValue = previewValue || value;
		// Gold means "this is your rating" (or a preview of what tapping would
		// set); gray means these stars are just showing the average so far.
		const isGold = hasOwnRating || isPreviewing;

		buttons.forEach((button, index) => {
			const starValue = index + 1;
			const isFilled = starValue <= activeValue;
			button.textContent = isFilled ? FULL_STAR : EMPTY_STAR;
			button.classList.toggle("is-filled", isFilled);
			button.classList.toggle("is-average", isFilled && !isGold);
			button.setAttribute("aria-checked", String(hasOwnRating && starValue === value));
			button.tabIndex = starValue === (value || 1) ? 0 : -1;
			button.setAttribute("aria-label", `${starValue} star${starValue > 1 ? "s" : ""}`);
		});

		wrapper.setAttribute(
			"aria-label",
			hasOwnRating ? label : `${label} - not yet rated, showing the average of ${value} out of ${maxRating}`
		);
	}

	render();

	return wrapper;
}
