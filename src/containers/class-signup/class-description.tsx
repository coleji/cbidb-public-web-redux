import * as React from "react";
import PlaceholderLink from "../../components/PlaceholderLink";

interface ClassType {
    typeId: number,
    typeName: string,
    prereqRatingName: string,
    sessionCt: number,
    sessionLength: number,
    classSize: number,
    description: string
}

export default (ct: ClassType) => (
    <div className="indent_class">
        <h3><i>Advanced Windsurfing Clinic</i></h3>
        <i>Prerequisite: {ct.prereqRatingName} Rating.  Duration: {ct.sessionCt} days; {ct.sessionLength} hours/day.  Class Size: {ct.classSize}.</i>
        <br />
        {ct.description}
        <br /><br />
        <PlaceholderLink>Click here to sign up!</PlaceholderLink>
        <br /><br />
    </div>
);


