import * as React from "react";
import ComponentWrapper from "./ComponentWrapper";

interface Props<T_Async> {
    component: (asyncProps: T_Async) => JSX.Element
    getAsyncProps?: () => Promise<T_Async>,
    shadowComponent?: JSX.Element
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
        
        if (this.props.getAsyncProps != undefined) {
            this.state = {
                readyToRender: false,
                componentAsyncProps: null
            }
            this.props.getAsyncProps().then(asyncProps => {
                console.log("about to set state: ", asyncProps)
                self.setState({
                    readyToRender: true,
                    componentAsyncProps: asyncProps
                });  
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
        if (this.state.readyToRender) {
            return this.props.component(this.state.componentAsyncProps)
        } else {
            return this.props.shadowComponent
        }
    }
}