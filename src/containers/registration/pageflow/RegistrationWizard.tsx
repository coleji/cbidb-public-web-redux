import * as React from "react";
import { RootState } from "../../../rootReducer";
import { Dispatch } from "redux";
import WizardPageflow, { WizardNode } from "../../../core/WizardPageflow";
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

export const path = "/reg/:personId"

export const formName = "registrationWizard"

const mapElementToBreadcrumbState: (element: WizardNode) => State = e => ({
	path: null,
	display: e.breadcrumbHTML
})

export default (state: RootState) => {
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

	const maybeScholarship: WizardNode[] = (state.homePageForm.data.getOrElse({} as any).hasEIIResponse ? [] : [{
		clazz: Scholarship,
		breadcrumbHTML: <React.Fragment>Family<br />Information</React.Fragment>
	}])

	const nodes: WizardNode[] = maybeScholarship.concat([{
		clazz: RequiredInfo,
		breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
	}, {
		clazz: EmergencyContact,
		breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
	}, {
		clazz: SwimProof,
		breadcrumbHTML: <React.Fragment>Swim<br />Proof</React.Fragment>
	}, {
		clazz: SurveyInfo,
		breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
	}])

	console.log("returning class")
	return WizardPageflow({
		formName,
		nodes,
		getDLL: (state: RootState) => state.registrationWizard.data,
		placeholder: <JoomlaMainPage />,
		getComponentProps: getComponentProps(getPersonIdFromPath(path, state.router.location.pathname)),
		start: "/",
		end: "/"
	})
}