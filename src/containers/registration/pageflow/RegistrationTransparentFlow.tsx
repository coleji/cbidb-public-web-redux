import * as React from "react";
import { Route, RouteComponentProps, StaticContext } from 'react-router';
import RequiredInfo from '../../registration/RequiredInfo';
import EmergencyContact from '../../registration/EmergencyContact';
import SwimProof from '../../registration/SwimProof';
import SurveyInfo from '../../registration/SurveyInfo';
import TransparentPageflow from "../../../core/TransparentPageflow";
import { Dispatch } from "redux";

const personIdParam = "personId"

const componentProps = (routeProps: RouteComponentProps<any, StaticContext, any>) => ({personId: Number(routeProps.match.params[personIdParam])})

export default (dispatch: Dispatch) => new TransparentPageflow({
	dispatch,
	start: "/",
	end: "/",
	componentProps,
	elements: [{
		path: `/required/:${personIdParam}`,
		clazz: RequiredInfo
	}, {
		path: `/emerg/:${personIdParam}`,
		clazz: EmergencyContact
	}, {
		path: `/swimproof/:${personIdParam}`,
		clazz: SwimProof
	}, {
		path: `/survey/:${personIdParam}`,
		clazz: SurveyInfo
	}]
})