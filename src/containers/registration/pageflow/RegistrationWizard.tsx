import * as React from "react";
import * as t from 'io-ts'
import { RootState } from "../../../rootReducer";
import { Dispatch } from "redux";
import WizardPageflow, { WizardNode, ElementDLL, ComponentPropsFromWizard } from "../../../core/WizardPageflow";
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
import { AutoResolver } from "../../../app/routing";
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
	const staticComponentProps = {
		history: props.history,
		personId: props.personId,
	}

	const mapWizardProps = (fromWizard: ComponentPropsFromWizard) => ({
		goPrev: fromWizard.goPrev,
		goNext: fromWizard.goNext,
		breadcrumb: (<ProgressThermometer
			prevStates={fromWizard.prevNodes.map(mapElementToBreadcrumbState)}
			currState={mapElementToBreadcrumbState(fromWizard.currNode)}
			nextStates={fromWizard.nextNodes.map(mapElementToBreadcrumbState)}
		/>)
	})

	const pageWrapperProps = {
		urlProps: {},
		shadowComponent: <span>hi!</span>,
		asyncResolver: props.asyncResolver
	}

	const maybeScholarship = props.hasEIIResponse ? [] : [{
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="ScholarshipPage"
			component={() => <ScholarshipPage
				parentPersonId={188911} //TODO: replace with app state
				currentSeason={2018}
				jpPrice={Currency.dollars(300)}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Family<br />Information</React.Fragment>
	}]

	const otherNodes = [{
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="RequiredInfo"
			component={(urlProps: {}, async: t.TypeOf<typeof requiredInfoValidator>) => <RequiredInfo
				initialFormData={async}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			getAsyncProps={(urlProps: {}) => {
				console.log("in getAsyncProps for requiredInfo")
				return requiredInfoAPI(props.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
	}, {
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="EmergencyContact"
			component={(urlProps: {}, async: t.TypeOf<typeof emergContactValidator>) => <EmergencyContact
				initialFormData={async}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			getAsyncProps={(urlProps: {}) => {
				return emergContactAPI(props.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
	}, /*{
		clazz: SwimProof,
		breadcrumbHTML: <React.Fragment>Swim<br />Proof</React.Fragment>
	}, */{
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="SurveyInfo"
			component={(urlProps: {}, async: t.TypeOf<typeof surveyValidator>) => <SurveyInfo
				initialFormData={async}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			getAsyncProps={(urlProps: {}) => {
				return surveyAPI(props.personId).do().catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
	}, {
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="TermsConditions"
			component={() => <TermsConditions
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Terms and <br />Conditions</React.Fragment>
	}]

	const nodes = maybeScholarship.concat(otherNodes)

	console.log("returning class")
	return <WizardPageflow 
		history={props.history}
		formName={formName}
		start="/"
		end="/"
		nodes={nodes}
	/>
}