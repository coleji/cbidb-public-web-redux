import * as React from "react";
import { RootState } from '../rootReducer';
import { Dispatch } from "redux";
import { DoublyLinkedList } from "../util/DoublyLinkedList";
import { set } from "../core/form/form";

interface Props {
	dispatch: Dispatch,
	state: RootState,
	formName: string,
	dll: DoublyLinkedList<JSX.Element>
	placeholder: JSX.Element,
	pages: (goNext: () => void, goPrev: () => void) => JSX.Element[],
}

export default abstract class WizardPageflow extends React.PureComponent<Props> {
	personId: number
	placeholder: JSX.Element
	goNext: () => void
	goPrev: () => void
	constructor(props: Props) {
		super(props)
		const self = this
		this.goNext = () => {
			console.log("pushed goNext!")
			set(this.props.dispatch, this.props.formName, this.props.dll.next())
		}
		this.goPrev = () => {
			set(this.props.dispatch, this.props.formName, this.props.dll.prev())
		}

		const pages = DoublyLinkedList.from(this.props.pages(
			this.goNext,
			this.goPrev
		))

		class Placeholder extends React.Component {
			render() {
				return self.props.placeholder
			}
		}

		this.placeholder = <Placeholder />

		set(props.dispatch, this.props.formName, pages.next())
	}
	render() {
		console.log("rendering.....")
		console.log(this.props.dll)
		//return <RequiredInfo goNext={this.props.goNext} />
		return this.props.dll.curr
	}
}