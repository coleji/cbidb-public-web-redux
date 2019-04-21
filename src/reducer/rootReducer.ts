import { Action, combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

import {FormState, formReducer} from "../form/form"
import {LoginState, loginReducer} from "./loginStateReducer"

import {loginFormReducer, Form as LoginForm} from "../containers/LoginPage"
import {Form as RegistrationRequiredInfoForm, FORM_NAME as registrationRequiredInfoFormName} from "../containers/registration/RequiredInfo"
import {Form as EmergencyContactForm, FORM_NAME as emergencyContactFormName} from "../containers/registration/EmergencyContact"
import {Form as SwimProofForm, FORM_NAME as swimProofFormName} from "../containers/registration/SwimProof"
import {Form as SurveyInfoForm, FORM_NAME as surveyInfoFormName} from "../containers/registration/SurveyInfo"
import {Form as CreateAccountForm, FORM_NAME as createAccountFormName} from "../containers/create-acct/CreateAccount"
import {Form as HomePageForm, formName as homePageFormName, formDefault as homePageDefault} from "../containers/HomePage"
import {Form as ScholarshipForm, FORM_NAME as scholarshipFormName} from "../containers/Scholarship"
import * as moment from "moment";
import Currency from "../util/Currency";
import {ServerConfig} from "../server/config"
import { ServerParams } from "../async/APIWrapper";

export interface StaticState {
	getMoment: () => moment.Moment,
	isServer: boolean,
	jpDirectorNameFirst: string,
	jpDirectorNameLast: string,
	jpDirectorEmail: string,
	jpPriceCents: number,
	currentSeason: number,
	apiServerParams: ServerParams,
	selfServerParams: ServerParams,
	serverConfig: ServerConfig
}

export interface RootState {
	staticState: StaticState,
	login: LoginState,
	router: any,
	loginForm: FormState<LoginForm>,
	createAcctForm: FormState<CreateAccountForm>,
	registrationRequiredInfoForm: FormState<RegistrationRequiredInfoForm>,
	emergencyContactForm: FormState<EmergencyContactForm>,
	swimProofForm: FormState<SwimProofForm>,
	surveyInfoForm: FormState<SurveyInfoForm>,
	scholarshipForm: FormState<ScholarshipForm>,
	homePageForm: FormState<HomePageForm>
}

export type RootReducer = (state: RootState, action: Action) => RootState

export const makeRootReducer: (history: any, staticState: StaticState) => RootReducer = 
(history, staticState) => {
	return combineReducers({
		router: connectRouter(history),
		staticState: () => staticState,
		login: loginReducer,
		loginForm: loginFormReducer,
		createAcctForm: formReducer<CreateAccountForm>(createAccountFormName, <any>{}),
		registrationRequiredInfoForm: formReducer<RegistrationRequiredInfoForm>(registrationRequiredInfoFormName, <any>{}),
		emergencyContactForm: formReducer<EmergencyContactForm>(emergencyContactFormName, <any>{}),
		swimProofForm: formReducer<SwimProofForm>(swimProofFormName, <any>{}),
		surveyInfoForm: formReducer<SurveyInfoForm>(surveyInfoFormName, <any>{}),
		scholarshipForm: formReducer<ScholarshipForm>(scholarshipFormName, <any>{}),
		homePageForm: formReducer<HomePageForm>(homePageFormName, homePageDefault),
	})	
}
