import * as React from "react";
import { connect } from "react-redux";
import { RootState } from '../reducer/rootReducer';
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActions";
import {FormState, get, getWithDefault} from "../form/form"
import { getReduxState } from "../reducer/store";
import NavBarLogoutOnly from "../components/NavBarLogoutOnly"
import {apiw} from "../async/endpoints/member-welcome"
import { ServerParams } from "../async/APIWrapper";

interface ChildrenData {
	personId: number,
	nameFirst: string,
	nameLast: string,
	status: string,
	actions: string,
	ratings: string
}

export const formDefault = {
	parentPersonId: null as number,
	userName: null as string,
	children: [] as ChildrenData[]
}

export type Form = typeof formDefault

export const formName = "homePageForm"

interface StateProps {
	homePageData: typeof formDefault,
	selfServerParams: ServerParams
}

interface DispatchProps { }

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

class HomePage extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
		console.log("home page doing get")
		console.log(getReduxState())
		getWithDefault(formName, apiw, x => x, formDefault)
		console.log("home page did get")
	}
	render() {
		//const self = this;

		console.log(this.props.homePageData)

		//TODO
		const rowData: {
			personId: number,
			name: string,
			status: React.ReactNode,
			actions: React.ReactNode
		}[] = this.props.homePageData.children.map((c: any) => ({
			personId: c.personId,
			name: c.nameFirst + " " + c.nameLast,
			status: <span dangerouslySetInnerHTML={{__html: c.status}}/>,
			actions: <ul>{homePageActions(Number(c.actions), c.personId)}</ul>,
		}))

		const mainTable = <JoomlaArticleRegion title="My Junior Program Memberships">
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])}/>
		</JoomlaArticleRegion>

		return <JoomlaMainPage navBar={NavBarLogoutOnly()}>
			{mainTable}
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
		homePageData: state.homePageForm.data,
		selfServerParams: state.staticState.selfServerParams
	}),
	() => ({

	})
)(HomePage)