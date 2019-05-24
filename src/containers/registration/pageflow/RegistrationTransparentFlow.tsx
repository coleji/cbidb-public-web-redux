import * as React from "react";
import { Route } from 'react-router';
import RequiredInfo from '../../registration/RequiredInfo';
import EmergencyContact from '../../registration/EmergencyContact';
import SwimProof from '../../registration/SwimProof';
import SurveyInfo from '../../registration/SurveyInfo';

const personIdParam = "personId"

export const requiredInfoPath = `/required/:${personIdParam}`
export const emergencyContactPath = `/emerg/:${personIdParam}`
export const swimProofPath = `/swimproof/:${personIdParam}`
export const surveyPath = `/survey/:${personIdParam}`

export const routes = [
	<Route
		key={requiredInfoPath}
		path={requiredInfoPath}
		render={(props) => <RequiredInfo personId={props.match.params[personIdParam]} goNext = {() => {}} goPrev={() => {}}/>}
	/>,
	<Route
		key={emergencyContactPath}
		path={emergencyContactPath}
		render={(props) => <EmergencyContact personId={props.match.params[personIdParam]} goNext = {() => {}} goPrev={() => {}}/>}
	/>,
	<Route
		key={swimProofPath}
		path={swimProofPath}
		render={(props) => <SwimProof personId={props.match.params[personIdParam]} goNext = {() => {}} goPrev={() => {}}/>}
	/>,
	<Route
		key={surveyPath}
		path={surveyPath}
		render={(props) => <SurveyInfo personId={props.match.params[personIdParam]} goNext = {() => {}} goPrev={() => {}}/>}
	/>,
]