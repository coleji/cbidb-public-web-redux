import * as React from "react";

// TODO
export default class ProgressThermometer extends React.PureComponent {
	render() {
		return (
			<div className="wizardProgress">
				<ul>
				<li className="first-non-current"><span className="pastCurrent">Scholarship<br />Application</span></li>
				<li className="non-current"><span className="pastCurrent">Required<br />Information</span></li>
				<li className="current"><span>Emergency<br />Contact</span></li>
				<li className="non-current"><span>Swim<br />Proof</span></li>
				<li className="non-current"><span>Survey<br />Information</span></li>
				<li className="last-non-current"><span>Terms and<br />Conditions</span></li>
				</ul>
			</div>
		)
	}
}
