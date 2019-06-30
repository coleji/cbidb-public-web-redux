import * as React from "react";
import { AutoResolver } from "../../routing";

interface Props<T_Async> {
    component: (asyncProps: T_Async) => JSX.Element
    getAsyncProps?: () => Promise<T_Async>,
    shadowComponent?: JSX.Element,
    asyncResolver?: AutoResolver
}

interface State<T> {
    readyToRender: boolean,
    componentAsyncProps: T
}

export default class PageWrapper<T_Async> extends React.Component<Props<T_Async>, State<T_Async>> {
    constructor(props: Props<T_Async>) {
        super(props);
        console.log("constructing a PageWrapper")
        const self = this

        this.props.asyncResolver.autoResolve = () => {
            console.log("intercepted attempt to autoresolve; we got a live one here")
        };
        
        if (this.props.getAsyncProps != undefined) {
            this.state = {
                readyToRender: false,
                componentAsyncProps: null
            }
            this.props.getAsyncProps().then(asyncProps => {
                console.log("$$$$$$$$$$$$$$$$   about to set state, has stuff?: ", asyncProps != null)
                self.setState({
                    readyToRender: true,
                    componentAsyncProps: asyncProps
                });
                this.props.asyncResolver.resolveOnAsyncComplete()
            })
        } else {
            this.state = {
                readyToRender: true,
                componentAsyncProps: {} as T_Async
            }
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        console.log("in PageWrapper render ....")
        console.log(this.state)
        if (this.state.readyToRender) {
            console.log(".... rendering the real deal")
            return this.props.component(this.state.componentAsyncProps)
        } else {
            console.log(".... rendering the crap")
            return this.props.shadowComponent
        }
    }
}