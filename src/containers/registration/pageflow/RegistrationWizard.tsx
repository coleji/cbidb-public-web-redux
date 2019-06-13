import * as React from "react";
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

	const otherNodes = [{
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
	}, {
		clazz: TermsConditions,
		breadcrumbHTML: <React.Fragment>Terms and <br />Conditions</React.Fragment>
	}]

	const nodes: WizardNode[] = maybeScholarship.concat(otherNodes)

	console.log("returning class")
	return WizardPageflow({
		formName,
		nodes,
		getDLL: (state: RootState) => state.registrationWizard.data,
		placeholder: <JoomlaMainPage />,
		getComponentProps: getComponentProps(getPersonIdFromPath(path, state.router.location.pathname)),
		start: "/",
		end: "/",
		getNextDLL: some((dll: ElementDLL) => {
			// if left has exactly one element and right has otherNodes.length-1, then the one thing in left is the scholarship page.  Drop it
			const ret = dll.next();
			ret.left = ret.left.filter((e, i, arr) => !(arr.length == 1 && ret.right.length == otherNodes.length-1))
			return ret
		}),
		getPrevDLL: none
	})
}