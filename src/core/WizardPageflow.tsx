import * as React from "react";
import { RootState } from '../rootReducer';
import { Dispatch } from "redux";
import { DoublyLinkedList } from "../util/DoublyLinkedList";
import { set } from "../core/form/form";
import { Option } from "fp-ts/lib/Option";
import { connect } from "react-redux";
import { push } from "connected-react-router";

interface Config {
	formName: string,
	placeholder: JSX.Element,
	getDLL: (state: RootState) =>  Option<DoublyLinkedList<JSX.Element>>,
	pages: (goNext: () => void, goPrev: () => void) => JSX.Element[],
	start: string,
	end: string
}

const mapStateToProps = (state: RootState) => ({
	state
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatch
})

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export default (config: Config) => {
	class WizardPageflow<T> extends React.PureComponent<T & Props> {
		personId: number
		placeholder: JSX.Element
		goNext: () => void
		goPrev: () => void
		dll: DoublyLinkedList<JSX.Element>
		constructor(props: T & Props) {
			console.log("in wizard pageflow constructor")
			super(props)
			const self = this
			class Placeholder extends React.Component {
				render() {
					return config.placeholder
				}
			}
	
			this.placeholder = <Placeholder />
			this.dll = config.getDLL(self.props.state).getOrElse(DoublyLinkedList.from([this.placeholder]))
			console.log("wizard constructor: setting this.dll ", this.dll)
			this.goNext = () => {
				console.log("pushed goNext!")
				if (self.dll.hasNext()) {
					set(self.props.dispatch, config.formName, this.dll.next())
				} else {
					console.log("going back to start: ", config.end)
					self.props.dispatch(push(config.end))
				}
				
			}
			this.goPrev = () => {
				console.log("pushed goPrev!")
				if (self.dll.hasPrev()) {
					set(self.props.dispatch, config.formName, this.dll.prev())
				} else {
					console.log("going back to start: ", config.start)
					self.props.dispatch(push(config.start))
				}
				
			}
	
			const pages = DoublyLinkedList.from(config.pages(
				this.goNext,
				this.goPrev
			))
	
			console.log("about to set DLL in redux:  ", pages)
			this.dll = pages
			set(self.props.dispatch, config.formName, pages)
		}
		componentWillReceiveProps(props: Props) {
			this.dll = config.getDLL(props.state).getOrElse(DoublyLinkedList.from([this.placeholder]))
			console.log("in wizard CDU, updating this.dll", this.dll)
		}
		render() {
			console.log("rendering.....")
			console.log(this.dll)
			//return <RequiredInfo goNext={this.props.goNext} />
			return this.dll.curr
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(WizardPageflow)
}

