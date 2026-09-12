import { WaitScreenManager } from "./api/WaitScreen.js";
import { MOCK_CREDENTIALS, mockLoginResponse } from "./mockData.js";

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorEl = document.getElementById("login-error");

// If a session already exists, skip straight to the main page.
if (sessionStorage.getItem("wineui.user")) {
	window.location.href = "main.html";
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	errorEl.textContent = "";

	const username = usernameInput.value.trim();
	const password = passwordInput.value;

	if (!username || !password) {
		errorEl.textContent = "Please enter both a username and password.";
		return;
	}

	// TODO: replace with RemoteSessionServlet.login() once the backend is wired up.
	WaitScreenManager.show("Signing in...");
	setTimeout(() => {
		WaitScreenManager.hide();

		if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
			sessionStorage.setItem("wineui.user", JSON.stringify(mockLoginResponse));
			window.location.href = "main.html";
		} else {
			errorEl.textContent = "Invalid username or password.";
		}
	}, 400);
});
