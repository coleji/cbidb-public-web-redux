import * as React from "react";

export default class PlaceholderLink extends React.PureComponent {
	render() {
		return <a href="#">{this.props.children}</a>
	}	
}
export const placeholderAction = () => console.log("placeholder!")
