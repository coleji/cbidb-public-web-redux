import * as React from "react";
import JoomlaReport from "../theme/joomla/JoomlaReport";


export default class JpClassesAvailTable extends React.PureComponent {
	render() {
		return (
			<JoomlaReport
				headers={["Class Name", "First Day", "Last Day", "Class Time", "Spots Left", "Notes"]}
				rows={[[
					"Beginner Sailing",
					"Monday 06/17/2019",
					"Friday 06/28/2019",
					"08:30AM - 11:30AM",
					<b><span style={{color: "red"}}>FULL</span><br />(17&nbsp;Waiting)</b>,
					"-"
				]]}
				cellStyles={[
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"}
				]}
			/>
		);
	}
}