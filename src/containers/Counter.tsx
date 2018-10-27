import * as React from "react";
import { connect } from "react-redux";

interface TestCompPropsFromState {
	counter: number
}

interface TestCompPropsFromDispatch {
	increment: () => any,
	decrement: () => any
}

interface TestCompPropsFromSelf {
	blah: string
}

type TestCompProps = TestCompPropsFromState & TestCompPropsFromDispatch & TestCompPropsFromSelf

interface CounterState {
	currentCount: number
}

class Counter extends React.PureComponent<TestCompProps> {
	render(): React.ReactNode {
		return <div>
			{this.props.blah}: {this.props.counter}
			<span onClick={this.props.increment}>+</span>&nbsp;&nbsp;&nbsp;&nbsp;
			<span onClick={this.props.decrement}>--</span>
		</div>
	}
}

export default connect<TestCompPropsFromState, TestCompPropsFromDispatch, TestCompPropsFromSelf, GlobalState>(
	state => ({
		counter: state.counter.currentCount
	}),
	dispatch => ({
		increment: () => {
			console.log("+")
			dispatch({
				type: "INCREMENT"
			})
		},
		decrement: () => {
			console.log("-")
			dispatch({
				type: "DECREMENT"
			})
		},
	})
)(Counter)