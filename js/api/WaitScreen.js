/**
 * Interface that can be called to hide or show the wait screen.
 * This is managed automatically by the Remote class.
 */
export const WaitScreenManager = {
	_overlay: undefined,
	_messageEl: undefined,

	/**
	 * Shows the wait screen with the optional message.
	 * @param {string} [message]
	 */
	show: function (message = "") {
		ensureWaitScreen();
		WaitScreenManager._messageEl.textContent = message;
		WaitScreenManager._overlay.style.display = "flex";
	},

	/**
	 * Hide the wait screen.
	 */
	hide: function () {
		ensureWaitScreen();
		WaitScreenManager._overlay.style.display = "none";
	},
};

/**
 * Lazily builds the wait screen overlay and appends it to the document body.
 */
function ensureWaitScreen() {
	if (WaitScreenManager._overlay) {
		return;
	}
	const overlay = document.createElement("div");
	overlay.className = "wait-screen-overlay";
	overlay.style.display = "none";

	const messageEl = document.createElement("div");
	messageEl.className = "wait-screen-message";

	const waitingEl = document.createElement("div");
	waitingEl.className = "wait-screen-waiting";
	waitingEl.textContent = "Please Wait...";

	overlay.appendChild(messageEl);
	overlay.appendChild(waitingEl);
	document.body.appendChild(overlay);

	WaitScreenManager._overlay = overlay;
	WaitScreenManager._messageEl = messageEl;
}
