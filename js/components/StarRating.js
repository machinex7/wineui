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
 * @param {number} [rating] - value from 0 to maxRating. May be omitted/undefined for an unrated editable widget.
 * @param {{maxRating?: number, showValue?: boolean, editable?: boolean, onRate?: (value: number) => void, label?: string}} [options]
 * @returns {HTMLElement}
 */
export function createStarRating(rating, options = {}) {
	const { maxRating = STAR_COUNT, showValue = true, editable = false, onRate, label = "Rating" } = options;

	return editable
		? createEditableStarRating(rating, { maxRating, onRate, label })
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
 * @param {{maxRating: number, onRate?: (value: number) => void, label: string}} options
 */
function createEditableStarRating(rating, { maxRating, onRate, label }) {
	let value = rating ? Math.round(rating) : 0;
	let previewValue = 0;

	const wrapper = document.createElement("div");
	wrapper.className = "star-rating star-rating-editable";
	wrapper.setAttribute("role", "radiogroup");
	wrapper.setAttribute("aria-label", label);

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
		value = i;
		previewValue = 0;
		render();
		if (onRate) {
			onRate(value);
		}
	}

	function render() {
		const activeValue = previewValue || value;
		buttons.forEach((button, index) => {
			const starValue = index + 1;
			const isFilled = starValue <= activeValue;
			button.textContent = isFilled ? FULL_STAR : EMPTY_STAR;
			button.classList.toggle("is-filled", isFilled);
			button.setAttribute("aria-checked", String(starValue === value));
			button.tabIndex = starValue === (value || 1) ? 0 : -1;
			button.setAttribute("aria-label", `${starValue} star${starValue > 1 ? "s" : ""}`);
		});
	}

	render();

	return wrapper;
}
