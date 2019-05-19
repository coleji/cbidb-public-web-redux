import * as React from "react";
import { RootState } from "../../rootReducer";
import { Dispatch } from "redux";
import WizardPageflow from "../../core/WizardPageflow";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import HomePage from "../HomePage";
import RequiredInfo from "./RequiredInfo";
import EmergencyContact from "./EmergencyContact";
import SwimProof from "./SwimProof";
import SurveyInfo from "./SurveyInfo";
import getPersonIdFromPath from "../../util/getPersonIdFromPath";

export const path = "/required/:personId"

export const formName = "registrationWizard"

export default (state: RootState) => {
	const pages = (personId: number) => (goNext: () => void, goPrev: () => void) => {
		const pageProps = {
			personId,
			goNext,
			goPrev
		}

		console.log("Inside Reg wizard function.  personId is ", personId)

		return [
			<HomePage />,
			<RequiredInfo {...pageProps} />,
			<EmergencyContact {...pageProps} />,
			<SwimProof {...pageProps} />,
	//		<SurveyInfo {...pageProps} />,
			<HomePage />
		];
	}

	console.log("returning class")
	return WizardPageflow({
		formName,
		getDLL: (state: RootState) => state.registrationWizard.data,
		placeholder: <JoomlaMainPage />,
		pages: pages(getPersonIdFromPath(path, state.router.location.pathname))
	})
}