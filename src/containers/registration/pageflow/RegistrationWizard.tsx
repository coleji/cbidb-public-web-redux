import * as React from "react";
import * as t from 'io-ts'
import { RootState } from "../../../rootReducer";
import { Dispatch } from "redux";
import WizardPageflow, { WizardNode, ElementDLL } from "../../../core/WizardPageflow";
import JoomlaMainPage from "../../../theme/joomla/JoomlaMainPage";
import HomePage from "../../HomePage";
import RequiredInfo from "../RequiredInfo";
import EmergencyContact from "../EmergencyContact";
import SwimProof from "../SwimProof";
import SurveyInfo from "../SurveyInfo";
import getPersonIdFromPath from "../../../util/getPersonIdFromPath";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State } from "../../../core/Breadcrumb";
import Scholarship from "../../Scholarship";
import { none, some } from "fp-ts/lib/Option";
import TermsConditions from "../TermsConditions";
import { History } from "history";
import PageWrapper from "../../../components/Page/PageWrapper";
import ScholarshipPage from "../../Scholarship";
import Currency from "../../../util/Currency";
import { AutoResolver } from "../../../routing";
import {getWrapper as requiredInfoAPI, validator as requiredInfoValidator} from  "../../../async/junior/required"
import {getWrapper as emergContactAPI, validator as emergContactValidator} from "../../../async/junior/emerg-contact"
import {getWrapper as surveyAPI, validator as surveyValidator} from "../../../async/junior/survey"

export const path = "/reg/:personId"

export const formName = "registrationWizard"

const mapElementToBreadcrumbState: (element: WizardNode) => State = e => ({
	path: null,
	display: e.breadcrumbHTML
})

export default (props: {history: History<any>, personId: number, hasEIIResponse: boolean, asyncResolver: AutoResolver}) => {
	const getComponentProps = (personId: number) => (goNext: () => void, goPrev: () => void, prevNodes: WizardNode[], currNode: WizardNode, nextNodes: WizardNode[]) => {
		return {
			personId,
			goPrev,
			goNext,
			breadcrumb: (<ProgressThermometer
				prevStates={prevNodes.map(mapElementToBreadcrumbState)}
				currState={mapElementToBreadcrumbState(currNode)}
				nextStates={nextNodes.map(mapElementToBreadcrumbState)}
			/>)
		}
	}

	const maybeScholarship = props.hasEIIResponse ? [] : [{
		clazz: () => <PageWrapper
			component={() => <ScholarshipPage
				history={props.history}
				parentPersonId={188911} //TODO: replace with app state
				currentSeason={2018}
				jpPrice={Currency.dollars(300)}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			asyncResolver={props.asyncResolver}
		/>,
		breadcrumbHTML: <React.Fragment>Family<br />Information</React.Fragment>
	}]

	const otherNodes = [{
		clazz: () => <PageWrapper
			component={(urlProps: {personId: number}, async: t.TypeOf<typeof requiredInfoValidator>) => <RequiredInfo
				history={props.history}
				initialFormData={async}
				{...urlProps}
			/>}
			urlProps={{personId: props.personId}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {personId: number}) => {
				return requiredInfoAPI(urlProps.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			asyncResolver={props.asyncResolver}
		/>,
		breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
	}, {
		clazz: () => <PageWrapper
			component={(urlProps: {personId: number}, async: t.TypeOf<typeof emergContactValidator>) => <EmergencyContact
				history={props.history}
				initialFormData={async}
				{...urlProps}
			/>}
			urlProps={{personId: props.personId}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {personId: number}) => {
				return emergContactAPI(urlProps.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			asyncResolver={props.asyncResolver}
		/>,
		breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
	}, /*{
		clazz: SwimProof,
		breadcrumbHTML: <React.Fragment>Swim<br />Proof</React.Fragment>
	}, */{
		clazz: () => <PageWrapper
			component={(urlProps: {personId: number}, async: t.TypeOf<typeof surveyValidator>) => <SurveyInfo
				history={props.history}
				initialFormData={async}
				{...urlProps}
			/>}
			urlProps={{personId: props.personId}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {personId: number}) => {
				return surveyAPI(urlProps.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			asyncResolver={props.asyncResolver}
		/>,
		breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
	}, {
		clazz: () => <PageWrapper
			component={() => <TermsConditions
				history={props.history}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			asyncResolver={props.asyncResolver}
		/>,
		breadcrumbHTML: <React.Fragment>Terms and <br />Conditions</React.Fragment>
	}]

	const nodes = maybeScholarship.concat(otherNodes)

	console.log("returning class")
	return <WizardPageflow 
		history={props.history}
		config={{
			formName,
			placeholder: <JoomlaMainPage />,
			getComponentProps: getComponentProps(props.personId),
			nodes,
			start: "/",
			end: "/"
		}}
	/>
}