import * as React from "react";
import { connect } from "react-redux";
import { RootState } from '../reducer/rootReducer';
import { WelcomePackageState } from "../reducer/welcomePackageReducer";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActions";


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
		//const self = this;

		//TODO
		const rowData: {
			personId: number,
			name: string,
			status: React.ReactNode,
			actions: React.ReactNode
		}[] = this.props.welcomePackage.children.map(c => ({
			personId: c.personId,
			name: c.nameFirst + " " + c.nameLast,
			status: <span dangerouslySetInnerHTML={{__html: c.status}}/>,
			actions: <ul>{homePageActions(Number(c.actions), c.personId)}</ul>,
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
	() => ({

	})
)(HomePage)