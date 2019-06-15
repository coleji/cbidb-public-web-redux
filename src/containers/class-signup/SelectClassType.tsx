import * as React from "react";
import * as t from 'io-ts'
import { connect } from "react-redux";
import { RadioGroup } from "../../components/InputGroup";
import { RootState } from '../../rootReducer';
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Dispatch } from "redux";
import Breadcrumb from "../../core/Breadcrumb";
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";
import { asDiv, asFragment } from "./class-description"
import beginner from "./types/beginner";
import intermediate from "./types/intermediate";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import advanced from "./types/advanced"
import other from './types/other'
import APIBlockedComponent from "../../core/form/APIBlockedComponent";
import {getWrapper,  validator} from "../../async/junior/see-types"
import { matchPath } from "react-router";

export const formName = "selectClassType"

export const path = "/class/:personId"

export type Form = {
	classTypes: t.TypeOf<typeof validator>
}

const mapStateToProps = (state: RootState) => ({
	form: state.selectClassTypeForm,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

type StaticProps = {
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps

class SelectClassType extends APIBlockedComponent<Props, Form, typeof validator> {
	personId: number
	formName = formName
	getApiWrapper = () => getWrapper(this.personId)
	apiToForm = (x: t.TypeOf<typeof validator>) => ({classTypes: x})
	formToAPI = (x: Form) => x.classTypes
	getData = () => this.props.form.data
	constructor(props: Props) {
		super(props);
		// TODO: typesafe? 
		const match = matchPath(
			this.props.router.location.pathname,
			{ path }
			) || {params: {}};
		this.personId = (match.params as any).personId;

		console.log("scraped from the url: " + this.personId)
	}
	renderPlaceholder() {
		return <span>whatever</span>
	}
	renderComponent(data: Form) {
		const self = this;
		console.log(data)

		const noProofRegion = (
			<React.Fragment>
				<JoomlaArticleRegion title={<React.Fragment>First Step: <i>Beginner Sailing</i></React.Fragment>}>
					{asFragment(beginner)}
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title={<React.Fragment>Next Step: <i>Intermediate Sailing</i></React.Fragment>}>
					{asFragment(intermediate)}
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title={<React.Fragment>Next Step: Advanced Classes</React.Fragment>}>
					{advanced}
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title="Other Available Classes">
					{other}
				</JoomlaArticleRegion>
			</React.Fragment>
		);

		return (
			<Joomla8_4 main={noProofRegion} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClassType)