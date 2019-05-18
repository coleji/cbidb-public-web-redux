import * as React from "react";
import { connect } from "react-redux";
import { RootState } from '../../rootReducer';
import { Dispatch, Action } from "redux";
import { DoublyLinkedList } from "../../util/DoublyLinkedList";
import { dispatchFormUpdate, success } from "../../core/form/form";
import RequiredInfo from "./RequiredInfo";
import EmergencyContact from "./EmergencyContact";
import SwimProof from "./SwimProof";
import SurveyInfo from "./SurveyInfo";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import { any } from "io-ts";
import { some } from "fp-ts/lib/Option";

export const formName = "registrationWizard"

const mapStateToProps = (state: RootState) => ({
	dll: state.registrationWizard.data
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	goNext: (dll: DoublyLinkedList<JSX.Element>) => {
		console.log("pushed goNext!")
		dispatchFormUpdate(dispatch, formName)("state", dll.next())
	},
	goPrev: (dll: DoublyLinkedList<JSX.Element>) => {
		dispatchFormUpdate(dispatch, formName)("state", dll.prev())
	},
	dispatch
})

class Placeholder extends React.Component {
	render() {
		return <JoomlaMainPage />
	}
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

class RegistrationWizard extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props)
		const pages = DoublyLinkedList.from([
			<RequiredInfo goNext={() => this.props.goNext(this.props.dll.getOrElse({state: null}).state.getOrElse(null))} />,
			<EmergencyContact />,
			<SwimProof />,
			<SurveyInfo />
		])
		success(props.dispatch, formName, {state: some(pages)})
	}
	render() {
		console.log("rendering.....")
		console.log(this.props.dll)
		//return <RequiredInfo goNext={this.props.goNext} />
		return this.props.dll.getOrElse({state: some(DoublyLinkedList.from([<Placeholder />]))}).state.getOrElse(null).curr
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(RegistrationWizard)