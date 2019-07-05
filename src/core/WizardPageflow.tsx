import * as React from "react";
import { RootState } from '../rootReducer';
import { Dispatch } from "redux";
import { DoublyLinkedList } from "../util/DoublyLinkedList";
import { set } from "../core/form/form";
import { Option } from "fp-ts/lib/Option";
import { connect, ConnectedComponentClass } from "react-redux";
import { push } from "connected-react-router";
import { History } from "history";

export interface WizardNode {
	clazz: React.ComponentType,
	breadcrumbHTML: JSX.Element
}

export type ElementDLL = DoublyLinkedList<JSX.Element>

interface Config<T_CompProps> {
	formName: string,
	placeholder: JSX.Element,
	// getDLL: (state: RootState) =>  Option<ElementDLL>,
	getComponentProps: (goNext: () => void, goPrev: () => void, prevNodes: WizardNode[], currNode: WizardNode, nextNodes: WizardNode[]) => T_CompProps,
	nodes: WizardNode[],
	start: string,
	end: string,
	// getNextDLL: Option<(dll: ElementDLL) => ElementDLL>,
	// getPrevDLL: Option<(dll: ElementDLL) => ElementDLL>
}

// const mapStateToProps = (state: RootState) => ({
// 	state
// })

// const mapDispatchToProps = (dispatch: Dispatch) => ({
// 	dispatch
// })

interface Props<T_CompProps> {
	history: History<any>,
	config: Config<T_CompProps>
}

interface State {
	dll: ElementDLL
}

export default class WizardPageflow<T_CompProps> extends React.Component<Props<T_CompProps>, State> {
	// personId: number
	placeholder: JSX.Element
	goNext: () => void
	goPrev: () => void
	static getNextDLL: (dll: ElementDLL) => ElementDLL = dll => dll.next()
	static getPrevDLL: (dll: ElementDLL) => ElementDLL = dll => dll.prev()
	constructor(props: Props<T_CompProps>) {
		console.log("in wizard pageflow constructor")
		super(props)
		const self = this
		const config = this.props.config;
		class Placeholder extends React.Component {
			render() {
				return config.placeholder
			}
		}

		this.placeholder = <Placeholder />
		// this.state = {
		// 	dll: DoublyLinkedList.from([this.placeholder])
		// };



		const nodes = config.nodes.map((node, i, arr) => {
			const prevNodes = arr.filter((ee, ii) => ii < i)
			const nextNodes = arr.filter((ee, ii) => ii > i)
			const Clazz = node.clazz
			return <Clazz 
				{...config.getComponentProps(self.goNext, self.goPrev, prevNodes, node, nextNodes)}
			/>
		})

		this.state = {
			dll: DoublyLinkedList.from(nodes)
		}

		console.log("wizard constructor: setting this.dll ", this.state.dll)
		this.goNext = () => {
			console.log("pushed goNext!")
			if (self.state.dll.hasNext()) {
				self.setState({
					...self.state,
					dll: self.state.dll.next()
				})
			} else {
				console.log("going to end: ", config.end)
				history.back()
				//self.props.dispatch(push(config.end))
			}
			
		}
		this.goPrev = () => {
			console.log("pushed goPrev!")
			if (self.state.dll.hasPrev()) {
				self.setState({
					...self.state,
					dll: self.state.dll.prev()
				})
			} else {
				console.log("going back to start: ", config.start)
				history.back()
				//self.props.dispatch(push(config.start))
			}
			
		}

		// console.log("about to set DLL in redux:  ", dll)
		// this.dll = dll
		// set(self.props.dispatch, config.formName, dll)
	}
	// componentWillReceiveProps(props: Props) {
	// 	// this.dll = config.getDLL(props.state).getOrElse(DoublyLinkedList.from([this.placeholder]))
	// 	// console.log("in wizard CDU, updating this.dll", this.dll)
	// }
	render() {
		console.log("rendering.....")
		console.log(this.state.dll)
		return this.state.dll.curr
	}
}
