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
import { arch } from "os";
import {ClassType} from "./class-description"

export const formName = "selectClassType"

export const path = "/class/:personId"

type ClassIDHash = {[K: string]: boolean};

export type Form = {
	classTypes: t.TypeOf<typeof validator>,
	classTypesHash: ClassIDHash
}

const mapStateToProps = (state: RootState) => ({
	form: state.selectClassTypeForm,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

type StaticProps = {
}

const classTypesArrayToHash: (arr: t.TypeOf<typeof validator>) => ClassIDHash = arr => arr.filter(e => e.canSee).reduce((hash, e) => {
	hash[String(e.typeId)] = e.canSee;
	return hash;
}, {} as ClassIDHash);

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps


class SelectClassType extends APIBlockedComponent<Props, Form, typeof validator> {
	personId: number
	formName = formName
	getApiWrapper = () => getWrapper(this.personId)
	apiToForm = (apiResultArray: t.TypeOf<typeof validator>) => ({
		classTypes: apiResultArray,
		classTypesHash: classTypesArrayToHash(apiResultArray)
	})
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

		const canSeeClass = (c: ClassType) => !!data.classTypesHash[String(c.typeId)];

		const beginnerRegion = (canSeeClass(beginner)
			? (
				<JoomlaArticleRegion title={<React.Fragment>First Step: <i>Beginner Sailing</i></React.Fragment>}>
					{asFragment(beginner)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const intermediateRegion = (canSeeClass(intermediate)
			? (
				<JoomlaArticleRegion title={<React.Fragment>Next Step: <i>Intermediate Sailing</i></React.Fragment>}>
					{asFragment(intermediate)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const advancedCanSee = advanced.filter(canSeeClass)
		const advancedRegion = (advancedCanSee.length > 0
			? (
				<JoomlaArticleRegion title={<React.Fragment>Next Step: Advanced Classes</React.Fragment>}>
					{advancedCanSee.map(asDiv)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const otherCanSee = other.filter(canSeeClass);
		const otherRegion = (otherCanSee.length > 0
			? (
				<JoomlaArticleRegion title="Other Available Classes">
					{otherCanSee.map(asDiv)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const allRegions = (
			<React.Fragment>
				{beginnerRegion}
				{intermediateRegion}
				{advancedRegion}
				{otherRegion}
			</React.Fragment>
		);

		return (
			<Joomla8_4 main={allRegions} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClassType)