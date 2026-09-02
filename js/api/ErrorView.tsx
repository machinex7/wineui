import * as React from "react";
import { Button, Modal, Text, View } from "react-native";

/**
 * Call the show function here to add an error message to the error stack.
 */
export const ErrorPopupManager = {
	instance: undefined as ErrorPopup | undefined,

	show: function (err: string) {
		this.instance?.addError(err);
	}
};

interface State {
	errorStack: string[];
}

/**
 * This component renders/manages an error popup.
 * You should include this at the root of your application so it can be used anywhere.
 */
export class ErrorPopup extends React.Component<any, State> {
	constructor(props: any) {
		super(props);
		this.state = { errorStack: [] };
		ErrorPopupManager.instance = this;
	}

	addError(err: string): void {
		this.setState((oldState) => {
			return { errorStack: oldState.errorStack.concat(err) };
		});
	}

	render() {
		if (this.state.errorStack.length <= 0) {
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
					<Text>Sorry, we encountered a problem.</Text>
					<Text>{this.state.errorStack[0]}</Text>
					<Button
						title={"Close"}
						onPress={() => {
							this.setState({
								errorStack: this.state.errorStack.slice(1),
							});
						}}
					/>
				</View>
			</Modal>
		);
	}
}
