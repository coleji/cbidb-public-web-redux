import * as React from "react";
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

export const formName = "classType"

export const path = "/class/:personId"

export interface Form {

}

const mapStateToProps = (state: RootState) => ({
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

class FormRadio extends RadioGroup<Form> { }


type StaticProps = {
	personId: number,
	goNext: () => void,
	goPrev: () => void,
	breadcrumb: Breadcrumb
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps

class SelectClassType extends React.PureComponent {
	render() {
		const self = this;

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