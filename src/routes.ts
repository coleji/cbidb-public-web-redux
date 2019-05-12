import { PageFlowStateMachine } from "./core/PageFlowStateMachine";
import {path as requiredInfoPath} from "./containers/registration/RequiredInfo"
import {path as emergPath } from "./containers/registration/EmergencyContact"
import {path as swimPath} from "./containers/registration/SwimProof"
import {path as surveyPath} from "./containers/registration/SurveyInfo"

const replacePersonId = (personId: number) => (path: string) => requiredInfoPath.replace(/:personId/, personId.toString())

export const editInfo: (personId: number) => PageFlowStateMachine = (personId: number) => PageFlowStateMachine.fromRoutes([
	"/",
	replacePersonId(personId)(requiredInfoPath),
	replacePersonId(personId)(emergPath),
	replacePersonId(personId)(swimPath),
	replacePersonId(personId)(surveyPath)
])