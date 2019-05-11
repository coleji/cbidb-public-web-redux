import * as React from "react";
import * as t from 'io-ts'
import { connect } from "react-redux";
import { RootState } from '../reducer/rootReducer';
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActions";
import {FormState, get} from "../form/form"
import { getReduxState } from "../reducer/store";
import NavBarLogoutOnly from "../components/NavBarLogoutOnly"
import {apiw, validator} from "../async/endpoints/member-welcome"
import APIWrapper, { ServerParams } from "../async/APIWrapper";
import OneWayDataComponent from "../form/OneWayDataComponent";
import makeDefault from "../util/getOptionDefault";
import { Option } from "fp-ts/lib/Option";

interface ChildrenData {
	personId: number,
	nameFirst: string,
	nameLast: string,
	status: string,
	actions: string,
	ratings: string
}

export const formDefault = makeDefault(validator)
export type Form = t.TypeOf<typeof validator>

export const formName = "homePageForm"

interface StateProps {
	homePageData: Option<typeof formDefault>,
	selfServerParams: ServerParams
}

interface DispatchProps { }

interface StaticProps {

}

type Props = StateProps & DispatchProps & StaticProps

class HomePage extends OneWayDataComponent<Props, Form, typeof validator> {
	formName = formName
	getApiWrapper = apiw
	apiToForm = (x: t.TypeOf<typeof validator>) => x
	formToAPI = (x: Form) => x
	getData: () => Option<Form>
	constructor(props: Props) {
		super(props);
		this.getData = () => this.props.homePageData
		console.log("home page doing get")
		console.log(getReduxState())
		get(formName, formDefault, apiw, x => x)
		console.log("home page did get")
	}
	renderPlaceholder() {
		console.log("rendering placeholder")
		return <span>whatever</span>
	}
	renderComponent(homePageData: typeof formDefault) {
		//TODO
		console.log("rendering component")
		console.log(this.props.homePageData)
		console.log(homePageData)
		const rowData: {
			personId: number,
			name: string,
			status: React.ReactNode,
			actions: React.ReactNode
		}[] = homePageData.children.map((c: any) => ({
			personId: c.personId,
			name: c.nameFirst + " " + c.nameLast,
			status: <span dangerouslySetInnerHTML={{__html: c.status}}/>,
			actions: <ul>{homePageActions(Number(c.actions), c.personId)}</ul>,
		}))

		const mainTable = <JoomlaArticleRegion title="My Junior Program Memberships">
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])} waitingOnAPI={homePageData.parentPersonId == null}/>
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