import * as React from "react";
import * as t from 'io-ts'
import { connect } from "react-redux";
import { RootState } from '../reducer/rootReducer';
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActions";
import NavBarLogoutOnly from "../components/NavBarLogoutOnly"
import {apiw, validator} from "../async/endpoints/member-welcome"
import APIBlockedComponent from "../form/APIBlockedComponent";

export type Form = t.TypeOf<typeof validator>

export const formName = "homePageForm"

const mapStateToProps = (state: RootState) => ({
	homePageData: state.homePageForm.data,
	selfServerParams: state.staticState.selfServerParams
})

type Props = ReturnType<typeof mapStateToProps> 

class HomePage extends APIBlockedComponent<Props, Form, typeof validator> {
	formName = formName
	getApiWrapper = () => apiw
	apiToForm = (x: t.TypeOf<typeof validator>) => x
	formToAPI = (x: Form) => x
	getData = () => this.props.homePageData
	renderPlaceholder() {
		console.log("rendering placeholder")
		return <span>whatever</span> // TODO
	}
	renderComponent(homePageData: Form) {
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
			<JoomlaReport headers={["Name", "Status", "Actions"]} rows={rowData.map(r => [r.name, r.status, r.actions])}/>
		</JoomlaArticleRegion>

		return <JoomlaMainPage navBar={NavBarLogoutOnly()}>
			{mainTable}
		</JoomlaMainPage>
	}
}

export default connect(mapStateToProps, () => {})(HomePage)