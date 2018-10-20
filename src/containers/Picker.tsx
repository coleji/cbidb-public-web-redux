import * as React from "react";
import { Link } from 'redux-little-router'

class Picker extends React.PureComponent {
	render(): React.ReactNode {
		return <div>
			<Link href="/counter/0">Counter</Link>
		</div>
	}
}

export default Picker