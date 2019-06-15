import * as React from "react";
import PlaceholderLink from "../../components/PlaceholderLink";
import { Option } from "fp-ts/lib/Option";

export interface ClassType {
	typeId: number,
	typeName: string,
	prereq: string,
	sessionCt: number,
	sessionLength: number,
	classSize: number,
	description: JSX.Element
}

export const asFragment = (ct: ClassType) => (
	<React.Fragment>
		<i>Prerequisite: {ct.prereq}.  Duration: {ct.sessionCt} days; {ct.sessionLength} hours/day.  Class Size: {ct.classSize == 0 ? "No Limit" : String(ct.classSize)}.</i>
		<br />
		{ct.description}
		<br /><br />
		<PlaceholderLink>Click here to sign up!</PlaceholderLink>
		<br /><br />
	</React.Fragment>
)


export const asDiv = (ct: ClassType) => (
	<div style={{ paddingLeft: "40px"}}>
		<h3 style={{ textTransform: "none", fontSize: "1.4em" }}><span style={{ fontStyle: "italic" }}>{ct.typeName}</span></h3>
		{asFragment(ct)}
	</div>
)