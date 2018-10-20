import * as React from "react";
import { Link } from 'react-router-dom'

class Picker extends React.PureComponent {
	render(): React.ReactNode {
		return <div>
			<Link to="/counter/0">Counter</Link>
		</div>
	}
}

export default Picker