import * as t from 'io-ts';
import * as React from "react";
import { connect } from "react-redux";
import { matchPath } from "react-router";
import { Dispatch } from "redux";
import JpClassesAvailTable from "../../components/JpClassesAvailTable";
import APIBlockedComponent from "../../core/form/APIBlockedComponent";
import { RootState } from '../../rootReducer';
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";
import {getWrapper, validator} from '../../async/junior/get-class-instances'

export const formName = "selectClassTime"

export const path = "/class-time/:personId/:typeId"

export type Form = t.TypeOf<typeof validator>

const mapStateToProps = (state: RootState) => ({
	form: state.selectClassTimeForm,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

type StaticProps = {

}


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps


class SelectClassTime extends APIBlockedComponent<Props, Form, typeof validator> {
	personId: number
	typeId: number
	formName = formName
	getApiWrapper = () => getWrapper(this.typeId, this.personId)
	apiToForm = (x: t.TypeOf<typeof validator>) => x
	formToAPI = (x: Form) => x
	getData = () => this.props.form.data
	constructor(props: Props) {
		super(props);
		// TODO: typesafe? 
		const match = matchPath(
			this.props.router.location.pathname,
			{ path }
			) || {params: {}};
		this.personId = (match.params as any).personId;
		this.typeId = (match.params as any).typeId;

		console.log("scraped from the url: " + this.personId)
	}
	renderPlaceholder() {
		return <span>whatever</span>
	}
	renderComponent(data: Form) {
		const self = this;
		console.log("%#$%#$%#$%    ", data)

        const allRegions = (
            <JoomlaArticleRegion title="Class Availability">
                <JpClassesAvailTable classes={data} />
            </JoomlaArticleRegion>
		);

		return (
			<Joomla8_4 main={allRegions} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClassTime)