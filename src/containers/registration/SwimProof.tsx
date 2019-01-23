import * as React from "react";
import { connect } from "react-redux";
import * as moment from "moment";

import { RootState } from '../../reducer/rootReducer'
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import ProgressThermometer from "../../components/ProgressThermometer";
import TextInput from "../../components/TextInput";
import {formReducer, dispatchFormUpdate} from "../../form/form"
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import {KeyAndDisplay, Select} from "../../components/Select"
import range from "../../util/range"
import DateTriPicker, {DateTriPickerProps} from "../../components/DateTriPicker"
import {states, countries} from "../../lov"
import PhoneTriBox, {PhoneTriBoxProps} from "../../components/PhoneTriBox";
import TextArea from "../../components/TextArea";
import  RadioGroup  from "../../components/RadioGroup";

export const FORM_NAME = "swimProofForm"

export interface Form {
    swimProofID: string
}

class FormRadio extends RadioGroup<Form> {}

interface StateProps {
	form: Form
}

interface DispatchProps {
	updateField: (name: keyof Form, value: string) => void
}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps;

class SwimProof extends React.PureComponent<Props> {
	render() {
		const self = this;
        const reduxAction = self.props.updateField;
        
        const bodyText = `All juniors are required to be able to swim 50 yards, and parents are required to possess a written proof of their child's swimming ability.
                    You do not need to present this proof unless asked by Community Boating, however failure to present acceptable proof upon request
                     may result in suspension of membership until adequate proof can be obtained.`

        const swimProofValues = [{
            key: "",
            display: "None"
        }, {
            key: "1",
            display: "YMCA: Certificate of Completion for Fish Level or above"
        }, {
            key: "2",
            display: "Red Cross: Certificate of Completion for Level V or above"
        }, {
            key: "3",
            display: "Boy/Girl Scouts: Swimming or Lifesaving Merit Badge"
        }, {
            key: "4",
            display: "Letter stating swimming ability signed by lifeguard on pool letterhead, or school swim coach on school letterhead"
        }]

        const noProofRegion = (<JoomlaNotitleRegion>
            <div>
                Getting written proof of swimming ability is easy and can be done at any YMCA or local pool.
                <a href="http://www.ymcaboston.org/find-your-y" target="_blank">Click here</a> to find your local YMCA.
                You can schedule your test by appointment for $5 or less. Simply let the Y know that your child needs to be tested to swim 50 yards without stopping,
                and that you require a signed letter at the completion of your test. Taking the test at the Y will give you the "written proof of swimming
                ability on Pool Letterhead" swim proof option for your child.
            </div>
        </JoomlaNotitleRegion>)

        console.log("swim proof id is " + self.props.form.swimProofID)

		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				<ProgressThermometer />
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Please select your form of swim proof.">
                {bodyText}
                <br /><br />
                {"Which of these do you possess?"}
                <br /><br />
                <FormRadio id="swimProofID" values={swimProofValues} reduxAction={reduxAction} value={self.props.form.swimProofID}/>
			</JoomlaArticleRegion>
            {self.props.form.swimProofID == "" ? noProofRegion : ""}
		</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
		form: {
            ...state.swimProofForm
		}
	}),
	dispatch => ({
		updateField: (name: keyof Form, value: string) => {
			console.log("updating field!")
			dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
		}
	})
)(SwimProof)