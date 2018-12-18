import * as React from "react";
import { connect } from "react-redux";

import JoomlaMainPage from "../../components/JoomlaMainPage";
import { RootState } from "../../reducer/rootReducer";
import JoomlaArticleRegion from "../../components/JoomlaArticleRegion";
import PlaceholderLink from "../../components/PlaceholderLink";
import { Link } from "redux-little-router";

interface StateProps {

}

interface DispatchProps {

}

interface StaticProps { }

type Props = StateProps & DispatchProps & StaticProps

class Gatekeeper extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		const body = <div>
			Junior Program applications can only be completed by a parent or legal guardian; by continuing you affirm that you are a parent or legal guardian of any and all juniors for whom you submit an application.<br />
			<br />
			If you would like to pay for the membership of a child for whom you are not the parent or legal guardian, please call the boathouse at 617-523-1038 and inquire about purchasing a gift certificate.<br />
			<br />
			<ul>
				<li><Link href="/create-acct">
				I am a parent/legal guardian of all juniors I am about to register (or have registered) under my name.
					</Link></li>
				<li><PlaceholderLink text="I'm in the wrong place!  Please take me to Adult Program signups."></PlaceholderLink></li>
			</ul>
		</div>

		return <JoomlaMainPage>
			<JoomlaArticleRegion title="You must be the parent or legal guardian.">
				{body}
			</JoomlaArticleRegion>
			</JoomlaMainPage>
	}
}

export default connect<StateProps, DispatchProps, StaticProps, RootState>(
	state => ({

	}),
	dispatch => ({

	})
)(Gatekeeper)