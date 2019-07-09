import * as React from "react";
import * as t from 'io-ts'
import { connect } from "react-redux";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import homePageActions from "./HomePageActions";
import NavBarLogoutOnly from "../components/NavBarLogoutOnly"
import {apiw, validator} from "../async/member-welcome"

export type Form = t.TypeOf<typeof validator>;

type Props = {
	data: Form
}

export default class HomePage extends React.Component<Props> {
	render() {
		const rowData: {
			personId: number,
			name: string,
			status: React.ReactNode,
			actions: React.ReactNode
		}[] = this.props.data.children.map((c: any) => ({
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