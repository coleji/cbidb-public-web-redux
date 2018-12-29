import * as React from "react";
import { connect } from "react-redux";

import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import Currency from "../util/Currency"
import { RootState } from '../reducer/rootReducer'
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../theme/joomla/JoomlaReport";

interface StateProps {

}

interface DispatchProps {

}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

class HomePage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const self = this;

		const mainTable = <JoomlaArticleRegion title="My Junior Program Memberships">
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={[["a", "b", "c"], ["a", "b", "c"], ["a", "b", "c"]]}/>
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