import * as React from "react";
import { connect } from "react-redux";
import * as t from 'io-ts'
import { RadioGroup } from "../../components/InputGroup";
import ProgressThermometer from "../../components/ProgressThermometer";
import { dispatchFormUpdate, get, post } from "../../form/form";
import { RootState } from '../../reducer/rootReducer';
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import { Option, none, Some, some } from "fp-ts/lib/Option";
import { Dispatch } from "redux";
import { push } from "connected-react-router";
import { matchPath } from "react-router";
import {getWrapper, postWrapper, validator} from "../../async/endpoints/junior/swim-proof"
import Button from "../../components/Button";
import {path as emergContactPath} from "./EmergencyContact"


export const FORM_NAME = "swimProofForm"

export const path = '/swimproof/:personId'

type API = t.TypeOf<typeof validator>

export interface Form {
	swimProofId: Option<string>
}

const mapStateToProps = (state: RootState) => ({
	form: state.swimProofForm,
	jpDirectorNameFirst: state.staticState.jpDirectorNameFirst,
	jpDirectorNameLast: state.staticState.jpDirectorNameLast,
	jpDirectorEmail: state.staticState.jpDirectorEmail,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	updateField: (name: keyof Form, value: string) => {
		console.log("updating field!")
		dispatchFormUpdate(dispatch, FORM_NAME)(name, value)
	},
	goBack: (personId: number) => dispatch(push(emergContactPath.replace(":personId", personId.toString()))),	// TODO
	goNext: () => dispatch(push('/')),	// TODO
})

class FormRadio extends RadioGroup<Form> {}

interface StaticProps { }

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & StaticProps;

class SwimProof extends React.PureComponent<Props> {
	personId: number
	constructor(props: Props) {
		super(props)
		console.log("constructor!!!")
		// TODO: typesafe? 
		const match = matchPath(
			props.router.location.pathname,
			{ path }
			) || {params: {}};
		this.personId = Number((match.params as any).personId);

		console.log("scraped from the url: " + this.personId)
		
		get(FORM_NAME, getWrapper(this.personId), (api: API) => ({
			...api,
			swimProofId: api.swimProofId.map(n => n.toString())
		}))
	}
	render() {
		const self = this;
        const reduxAction = self.props.updateField;
        
        const bodyText = `All juniors are required to be able to swim 50 yards, and parents are required to possess a written proof of their child's swimming ability.
                    You do not need to present this proof unless asked by Community Boating, however failure to present acceptable proof upon request
                     may result in suspension of membership until adequate proof can be obtained.`

        const swimProofValues = [{
            key: "-1",
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
            <div style={({padding: "8px 50px", border: "1px solid #999", margin: "0px 30px"})}>
                Getting written proof of swimming ability is easy and can be done at any YMCA or local pool.   <a href="http://www.ymcaboston.org/find-your-y" target="_blank">Click here</a> to
                find your local YMCA.
                You can schedule your test by appointment for $5 or less. Simply let the Y know that your child needs to be tested to swim 50 yards without stopping,
                and that you require a signed letter at the completion of your test. Taking the test at the Y will give you the "written proof of swimming
                ability on Pool Letterhead" swim proof option for your child.
            </div>
        </JoomlaNotitleRegion>)

		const mailto = "mailto:" + self.props.jpDirectorEmail
	
		return <JoomlaMainPage>
			<JoomlaNotitleRegion>
				<ProgressThermometer />
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Please select your form of swim proof.">
                {bodyText}
                <br /><br />
                {"Which of these do you possess?"}
                <br /><br />
                <FormRadio
					id="swimProofId"
					justElement={true}
					values={swimProofValues}
					reduxAction={reduxAction}
					value={(self.props.form.data.swimProofId || none).map(n => n.toString())}
				/>
			</JoomlaArticleRegion>
            {(self.props.form.data.swimProofId || none).getOrElse(null) == "-1" ? noProofRegion : ""}
            <JoomlaNotitleRegion>
                <span>
                If you believe you have a proof of swimming ability not on the above list,
                <br />
                please email {self.props.jpDirectorNameFirst} {self.props.jpDirectorNameLast} at <a href={mailto}>{self.props.jpDirectorEmail}</a>.
                </span>
			</JoomlaNotitleRegion>
			<Button text="< Back" onClick={this.props.goBack}/>
			<Button text="Next >" onClick={() => {
				post(FORM_NAME, postWrapper(this.personId))({
					...this.props.form.data,
					swimProofId: this.props.form.data.swimProofId.map(s => Number(s))
				}).then(this.props.goNext)
			}}/>
		</JoomlaMainPage>
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SwimProof)