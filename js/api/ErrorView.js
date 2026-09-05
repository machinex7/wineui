/**
 * Call the show function here to add an error message to the error stack.
 */
export const ErrorPopupManager = {
	_errorStack: [],
	_overlay: undefined,
	_messageEl: undefined,

	/**
	 * Adds an error message to the error stack and displays it.
	 * @param {string} err
	 */
	show: function (err) {
		ErrorPopupManager._errorStack.push(err);
		ErrorPopupManager._render();
	},

	/**
	 * Removes the currently displayed error and shows the next one, if any.
	 */
	_dismiss: function () {
		ErrorPopupManager._errorStack.shift();
		ErrorPopupManager._render();
	},

	/**
	 * Updates the DOM to reflect the current error stack.
	 */
	_render: function () {
		ensureErrorPopup();
		if (ErrorPopupManager._errorStack.length <= 0) {
			ErrorPopupManager._overlay.style.display = "none";
			return;
		}
		ErrorPopupManager._messageEl.textContent = ErrorPopupManager._errorStack[0];
		ErrorPopupManager._overlay.style.display = "flex";
	},
};

/**
 * Lazily builds the error popup overlay and appends it to the document body.
 */
function ensureErrorPopup() {
	if (ErrorPopupManager._overlay) {
		return;
	}
	const overlay = document.createElement("div");
	overlay.className = "error-popup-overlay";
	overlay.style.display = "none";

	const titleEl = document.createElement("div");
	titleEl.className = "error-popup-title";
	titleEl.textContent = "Sorry, we encountered a problem.";

	const messageEl = document.createElement("div");
	messageEl.className = "error-popup-message";

	const closeButton = document.createElement("button");
	closeButton.className = "error-popup-close";
	closeButton.textContent = "Close";
	closeButton.addEventListener("click", ErrorPopupManager._dismiss);

	overlay.appendChild(titleEl);
	overlay.appendChild(messageEl);
	overlay.appendChild(closeButton);
	document.body.appendChild(overlay);

	ErrorPopupManager._overlay = overlay;
	ErrorPopupManager._messageEl = messageEl;
}
