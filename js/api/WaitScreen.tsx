import * as React from "react";
import { Modal, View, Text } from "react-native";

interface State {
	isOpen: boolean;
	message: string;
}

/**
 * Interface that can be called to hide or show the wait screen.
 * This is managed automatically by the Remote class.
 */
export const WaitScreenManager = {
	instance: undefined as WaitScreen | undefined,

	/**
	 * Shows the wait screen with the optional message.
	 * @param message
	 */
	show: function (message: string = "") {
		this.instance!.update(true, message);
	},

	/**
	 * Hide the wait screen with the optional message.
	 */
	hide: function () {
		this.instance!.update(false);
	},
};

/**
 * A high level component to have a wait screen.
 * This is managed automatically by the Remote class.
 */
class WaitScreen extends React.Component<any, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			isOpen: false,
			message: "",
		};
		WaitScreenManager.instance = this;
	}

	/**
	 * hides or shows the wait screen and sets the given message.
	 * This should not be called directly. Instead, use the WaitScreenManager
	 * @param shouldBeOpen
	 * @param msg
	 */
	update(shouldBeOpen: boolean, msg: String = "") {
		this.setState({
			isOpen: shouldBeOpen,
			message: msg,
		} as State);
	}

	render() {
		if (!this.state.isOpen) {
			return null;
		}
		return (
			<Modal>
				<View
					/*style={{
						top: 0,
						left: "calc(50vw - 200px)",
						margin: "10vh 0",
						width: 400,
					}}*/
				>
					<Text>{this.state.message}</Text>
					<Text>Please Wait...</Text>
				</View>
			</Modal>
		);
	}
}
export default WaitScreen;
