import * as React from "react";
import { connect } from "react-redux";
import { RootState } from '../../rootReducer';
import { Dispatch, Action } from "redux";
import { DoublyLinkedList } from "../../util/DoublyLinkedList";
import { set } from "../../core/form/form";
import RequiredInfo from "./RequiredInfo";
import EmergencyContact from "./EmergencyContact";
import SwimProof from "./SwimProof";
import SurveyInfo from "./SurveyInfo";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import getPersonIdFromPath from "../../util/getPersonIdFromPath";
import HomePage from "../HomePage";

export const formName = "registrationWizard"

export const path = "/required/:personId"

const mapStateToProps = (state: RootState) => ({
	dll: state.registrationWizard.data,
	router: state.router
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	goNext: (dll: DoublyLinkedList<JSX.Element>) => {
		console.log("pushed goNext!")
		set(dispatch, formName, dll.next())
	},
	goPrev: (dll: DoublyLinkedList<JSX.Element>) => {
		set(dispatch, formName, dll.prev())
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
	personId: number
	constructor(props: Props) {
		super(props)
		this.personId = getPersonIdFromPath(path, props.router.location.pathname)
		const pageProps = {
			personId: this.personId,
			goNext: () => this.props.goNext(this.props.dll.getOrElse(null)),
			goPrev: () => this.props.goPrev(this.props.dll.getOrElse(null))
		}

		const pages = DoublyLinkedList.from([
			<HomePage />,
			<RequiredInfo {...pageProps} />,
			<EmergencyContact {...pageProps} />,
			<SwimProof {...pageProps} />,
			<SurveyInfo {...pageProps} />,
			<HomePage />
		])

		set(props.dispatch, formName, pages.next())
	}
	componentDidMount() {
		console.log("wizard cdm")
	}
	render() {
		console.log("rendering.....")
		console.log(this.props.dll)
		//return <RequiredInfo goNext={this.props.goNext} />
		return this.props.dll.getOrElse(DoublyLinkedList.from([<Placeholder />])).curr
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationWizard)