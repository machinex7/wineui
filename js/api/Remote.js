import axios from "axios";
import { WaitScreenManager } from "./WaitScreen";
import { ErrorPopupManager } from "./ErrorView";

/**
 * Helper object to simplify remote API calls.
 *
 * TODO cached GET calls
 * TODO hold on to certain updates if internet goes down and retry them periodically.
 * TODO generate mock data for testing without a server.
 *
 */
const Remote = {
	_callCount: 0, //how many pending calls are there
	_baseUrl: "http://localhost:8080/api", //base api url we want to hit
	_message: "", //wait message we want to display

	/**
	 * Set the message to display on the wait screen.
	 * @param {string} msg
	 */
	set message(msg) {
		Remote._message = msg;
		if (Remote._callCount > 0) {
			WaitScreenManager.show(msg);
		}
	},

	/**
	 * This is called when an api call completes.
	 */
	_endCall: function () {
		Remote._callCount--;
		if (Remote._callCount <= 0) {
			Remote._callCount = 0;
			WaitScreenManager.hide();
			Remote.message = "";
		}
	},

	/**
	 * This is called when an api call starts.
	 */
	_startCall: function () {
		Remote._callCount++;
		WaitScreenManager.show(Remote._message);
	},

	/**
	 * Error handler for for when api calls fail.
	 * @param {any} result
	 * @private
	 */
	_failCallback: function (result) {
		Remote._endCall();
		console.log(result);
		if (result.response?.data) {
			if (result.response?.data) {
				ErrorPopupManager.show(result.response?.data);
			} else {
				ErrorPopupManager.show(result.message);
			}
		}
		if (result instanceof Error) {
			ErrorPopupManager.show(result.name + ": " + result.message);
		} else {
			ErrorPopupManager.show(result.toString());
		}
	},

	/**
	 * Performs an axios api request.
	 * @param {string} url
	 * @param {string} method
	 * @param {any} [data]
	 * @private
	 * @returns {Promise<any>}
	 */
	_request: async function (url, method, data) {
		Remote._startCall();
		return new Promise((resolve) => {
			axios
				.request({
					method: method,
					url: Remote._baseUrl + url,
					data: data,
					withCredentials: true,
				})
				.then((result) => {
					Remote._endCall();
					if (result.status >= 200 && result.status < 300) {
						resolve(result.data);
					} else {
						ErrorPopupManager.show(JSON.stringify(result.data));
					}
				})
				.catch((error) => Remote._failCallback(error));
		});
	},
};

export default Remote;
