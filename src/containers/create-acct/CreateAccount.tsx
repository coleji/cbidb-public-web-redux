import * as React from "react";
import { connect } from "react-redux";

import JoomlaMainPage from "../../components/JoomlaMainPage";
import { RootState } from "../../reducer/rootReducer";
import JoomlaArticleRegion from "../../components/JoomlaArticleRegion";
import PlaceholderLink from "../../components/PlaceholderLink";
import Joomla8_4 from "../../components/Joomla8_4";
import JoomlaSidebarRegion from "../../components/JoomlaSidebarRegion";

interface StateProps {

}

interface DispatchProps {

}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

class CreateAccount extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const body = <div>
			Please supply an email address and password for your online account. Your account will allow you to register child(ren) for classes, renew their memberships, and sign them up for special Junior Program events.<br />
			<br />
			If you start the registration process and don't complete it, you can use this email/password to continue from where you left off.
		</div>
		return <Joomla8_4 main={<div>hi</div>} right={<JoomlaSidebarRegion title="INFO" body={body} />} />
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({

	}),
	dispatch => ({

	})
)(CreateAccount)