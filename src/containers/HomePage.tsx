import * as React from "react";
import { connect } from "react-redux";

import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import Currency from "../util/Currency"
import { RootState } from '../reducer/rootReducer'
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import PlaceholderLink from "../components/PlaceholderLink";

interface StateProps {

}

interface DispatchProps {

}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

//TODO
const rowData: {
	name: string,
	status: React.ReactNode,
	actions: React.ReactNode
}[] = [{
	name: "Kid 1 Family",
	status: <span style={({color: "blue", fontWeight: "bold"})}>Member - 2019 Season</span>,
	actions: <ul style={({fontSize: "0.8em"})}>
		<li><PlaceholderLink >Edit Information</PlaceholderLink></li>
		<li><PlaceholderLink >View Ratings</PlaceholderLink></li>
		<li><PlaceholderLink >Signup for Summer Classes</PlaceholderLink></li>
	</ul>
}]

class HomePage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const self = this;

		const mainTable = <JoomlaArticleRegion title="My Junior Program Memberships">
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])}/>
		</JoomlaArticleRegion>
		
		return <JoomlaMainPage>
			{mainTable}
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({

	}),
	dispatch => ({

	})
)(HomePage)