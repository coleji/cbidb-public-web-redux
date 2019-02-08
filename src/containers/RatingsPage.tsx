import * as React from "react";
import { connect } from "react-redux";
import { matchPath } from 'react-router-dom';

import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import Currency from "../util/Currency"
import { RootState } from '../reducer/rootReducer'
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import PlaceholderLink from "../components/PlaceholderLink";
import { WelcomePackageState } from "../reducer/welcomePackageReducer";
import homePageActions from "./HomePageActions";

interface StateProps {
	welcomePackage: WelcomePackageState,
	router: any
}

interface DispatchProps {

}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

export const path = '/ratings/:personId'

class RatingsPage extends React.PureComponent<Props> {
	render() {
		const self = this;

		// TODO: typesafe? 
		const match = matchPath(
			self.props.router.location.pathname,
			{ path }
		  ) || {params: {}};
		const personId = (match.params as any).personId;

		console.log("scraped from the url: " + personId)

		const kid = this.props.welcomePackage.children.find(e => e.personId == personId)

		// TODO: specific kid.  Also welcome package seems to sometimes be empty
		const ratings = kid ? kid.ratings : "<span></span>"

		// TODO: grab specific child based on url
		return <JoomlaMainPage>
			<JoomlaArticleRegion title="Ratings">
				<span dangerouslySetInnerHTML={{__html: ratings}}/>
				<p>
					<span style={{fontWeight: "bold", color:"red"}}>Acquired Rating</span>
					<br />
					<span style={{color: "#cc0", fontStyle: "italic", fontWeight: "bold"}}>Expired Rating*</span>
					<br />
					Unacquired Rating
				</p>
				<p style={{fontSize: "0.9em", color: "#777", fontStyle: "italic"}}>
					*Expired ratings can be renewed in the first days of your class
				</p>
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}


export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({
		welcomePackage: state.welcomePackage,
		router: state.router
	}),
	dispatch => ({

	})
)(RatingsPage)