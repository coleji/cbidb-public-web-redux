import * as React from "react";
import JoomlaTwoColumns from "../components/JoomlaTwoColumns";

import PlaceholderLink from "../components/PlaceholderLink"
import JoomlaArticleRegion from "../components/JoomlaArticleRegion";
import Currency from "../util/Currency"

interface LoginPageProps {
    jpPrice: Currency,
    lastSeason: number
}

class LoginPage extends React.PureComponent<LoginPageProps> {
	render() {
        const self = this;

        // left column 


        const welcomeRegion = (function() {
            const body = <div>
                If you are new to Community Boating and would like to purchase a Junior Program membership for your child, 
                <b>{" click on the first option "}</b>
                {"to the right.  Once your child's registration is complete you can return here to sign him/her up "}
                for classes and view his/her progression throughout the summer.
                <br />
                <br />
                If you were looking for <b>{"Adult Program"}</b> registration, please <PlaceholderLink text={"click here!"}/>
            </div>
            return <JoomlaArticleRegion title={<span>Welcome to CBI Online!<br />-  Junior Program  -</span>} body={body} />
        }())

        const scholarshipRegion = (function() {
            const body = `
                The price of a Junior Program membership is ${self.props.jpPrice.format(true)}.
                Community Boating Inc. provides scholarships for families in need
                so that every child has an opportunity to enroll in the Junior Program.
                To find out if you qualify for a scholarship,
                please create an account and fill out the scholarship form.
            `
            return <JoomlaArticleRegion title="Scholarships are available to provide sailing for all." body={body} />
        }())


        // right columns 

        const newAcctRegion = (function() {
            const body = <div>
                <ul style={{fontSize: "0.92em", marginLeft: "20px"}}>
                    <li><PlaceholderLink text={"Click here to create a parent account."}/></li>
                </ul>
                <br />
                {`If your child was a member in ${self.props.lastSeason}, please use your email and password from last season, rather than creating a new account.`}
            </div>
            return <JoomlaArticleRegion title="My child and I are new to Community Boating." body={body} />
        }())

        const leftColumn = <div>
            {welcomeRegion}
            {scholarshipRegion}
        </div>
        return <JoomlaTwoColumns left={leftColumn} right={newAcctRegion}></JoomlaTwoColumns>
    }
}

export default LoginPage