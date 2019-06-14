import * as React from "react";
import { connect } from "react-redux";
import { RadioGroup } from "../../components/InputGroup";
import { RootState } from '../../rootReducer';
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Dispatch } from "redux";
import Breadcrumb from "../../core/Breadcrumb";
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";

export const formName = "classType"

export const path = "/class/:personId"

export interface Form {

}

const mapStateToProps = (state: RootState) => ({
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({

})

class FormRadio extends RadioGroup<Form> {}


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

        const noProofRegion = (<JoomlaNotitleRegion>
            <div style={({padding: "8px 50px", border: "1px solid #999", margin: "0px 30px"})}>
                Getting written proof of swimming ability is easy and can be done at any YMCA or local pool.   <a href="http://www.ymcaboston.org/find-your-y" target="_blank">Click here</a> to
                find your local YMCA.
                You can schedule your test by appointment for $5 or less. Simply let the Y know that your child needs to be tested to swim 50 yards without stopping,
                and that you require a signed letter at the completion of your test. Taking the test at the Y will give you the "written proof of swimming
                ability on Pool Letterhead" swim proof option for your child.
            </div>
        </JoomlaNotitleRegion>)

	
		return <Joomla8_4 main={noProofRegion} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClassType)