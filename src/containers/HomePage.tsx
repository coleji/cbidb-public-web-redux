import * as React from "react";
import { connect } from "react-redux";

import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import Currency from "../util/Currency"
import { RootState } from '../reducer/rootReducer'
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import PlaceholderLink from "../components/PlaceholderLink";
import { WelcomePackageState } from "../reducer/welcomePackageReducer";
import { Fragment } from "redux-little-router";

interface StateProps {
	welcomePackage: WelcomePackageState
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

		//TODO
		const rowData: {
			name: string,
			status: React.ReactNode,
			actions: React.ReactNode
		}[] = this.props.welcomePackage.children.map(c => ({
			name: c.nameFirst + " " + c.nameLast,
			status: <span dangerouslySetInnerHTML={{__html: c.status}}/>,
			actions: <span dangerouslySetInnerHTML={{__html: c.actions}}/>,
		}))

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
		welcomePackage: state.welcomePackage
	}),
	dispatch => ({

	})
)(HomePage)