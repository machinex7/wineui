//TODO This is a TS file that needs to be converted to JS

import axios, { AxiosError, Method } from "axios";
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
	 * @param msg
	 */
	set message(msg: string) {
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
	 * @param result
	 * @private
	 */
	_failCallback: function (result: any) {
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
			/*} else if (result.config && result.isAxiosError !== undefined) {
			let im: InControlMessage = result.response.data as InControlMessage;
			if (im.report_xmlText !== null) {
				ErrorPopupManager.show(im);
			} else {
				ErrorPopupManager.show((result as AxiosError).message);
			}*/
		} else {
			ErrorPopupManager.show(result.toString());
		}
	},

	/**
	 * Performs an axios api request.
	 * @param url
	 * @param method
	 * @param data
	 * @private
	 */
	_request: async function <T>(url: string, method: Method, data?: any): Promise<T> {
		Remote._startCall();
		return new Promise<T>((resolve) => {
			axios
				.request<T>({
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
