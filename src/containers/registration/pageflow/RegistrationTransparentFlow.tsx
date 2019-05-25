import * as React from "react";
import { Route, RouteComponentProps, StaticContext } from 'react-router';
import RequiredInfo from '../../registration/RequiredInfo';
import EmergencyContact from '../../registration/EmergencyContact';
import SwimProof from '../../registration/SwimProof';
import SurveyInfo from '../../registration/SurveyInfo';
import TransparentPageflow, { Config, TransparentPageflowElement } from "../../../core/TransparentPageflow";
import { Dispatch } from "redux";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State } from "../../../core/Breadcrumb";

const personIdParam = "personId"

const makeConcretePath = (path: string) => (personId: string) => path.replace(":"+personIdParam, personId)

const mapElementToBreadcrumbState: (element: TransparentPageflowElement) => State = e => ({
	path: e.path,
	display: e.breadcrumbHTML
})

export default (dispatch: Dispatch) => {
	const config: Config = {
		dispatch,
		start: "/",
		end: "/",
		elements: [{
			path: `/required/:${personIdParam}`,
			clazz: RequiredInfo,
			breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
		}, {
			path: `/emerg/:${personIdParam}`,
			clazz: EmergencyContact,
			breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
		}, {
			path: `/swimproof/:${personIdParam}`,
			clazz: SwimProof,
			breadcrumbHTML: <React.Fragment>Swim<br />Proof</React.Fragment>
		}, {
			path: `/survey/:${personIdParam}`,
			clazz: SurveyInfo,
			breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
		}]
	}


	const mapRouteToComponentProps = (routeProps: RouteComponentProps<any, StaticContext, any>) => (config: Config) => {
		const personIdString = routeProps.match.params[personIdParam]
		console.log("routeProps:  ", routeProps)
		console.log("personIdString: ", personIdString)
		const personId = Number(personIdString)
		const index = config.elements.findIndex(e => {
			const concretePath = makeConcretePath(e.path)(personIdString)
			return concretePath == routeProps.location.pathname
		})

		const [prevStates, currAndNext] = config.elements.map(mapElementToBreadcrumbState).splitAt(index);

		return {
			personId,
			breadcrumb: (<ProgressThermometer
				prevStates={prevStates}
				currState={currAndNext[0]}
				nextStates={currAndNext.slice(1)}
			/>)
		}
	}

	return new TransparentPageflow(
		config,
		mapRouteToComponentProps,
		(path: string) => (componentProps) => makeConcretePath(path)(String(componentProps.personId))
	)
}