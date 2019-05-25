import * as React from "react";
import Breadcrumb, {Props as BreadcrumbProps} from "../core/Breadcrumb";

// TODO
export default class ProgressThermometer extends Breadcrumb {
	renderStates() {
		const self = this
		return (
			<div className="wizardProgress">
				<ul>
					{this.props.prevStates.map((state, i) => {
						if (i == 0){
							return <li className="first-non-current"><span className="pastCurrent">{state.display}</span></li>
						} else {
							return <li className="non-current"><span className="pastCurrent">{state.display}</span></li>
						}
					})}
					{(function() {
						if (self.props.prevStates.length == 0) {
							return <li className="first-current"><span className="Current">{self.props.currState.display}</span></li>
						} else if (self.props.nextStates.length == 0) {
							return <li className="last-current"><span>{self.props.currState.display}</span></li>
						} else {
							return <li className="current"><span>{self.props.currState.display}</span></li>
						}
					}())}
					{this.props.nextStates.map((state, i, arr) => {
						if (i == arr.length-1) {
							return <li className="last-non-current"><span>{state.display}</span></li>
						} else {
							return <li className="non-current"><span>{state.display}</span></li>
						}
					})}
				</ul>
			</div>
		)
	}
}
