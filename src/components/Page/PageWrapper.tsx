import * as React from "react";
import { AutoResolver } from "../../routing";

interface Props<T_URL, T_Async> {
    key: string,
	urlProps: T_URL
    component: (urlProps: T_URL, asyncProps: T_Async) => JSX.Element
    getAsyncProps?: (urlProps: T_URL) => Promise<T_Async>,
    shadowComponent?: JSX.Element,
    asyncResolver?: AutoResolver
}

interface State<T> {
    readyToRender: boolean,
    componentAsyncProps: T
}

export default class PageWrapper<T_URL, T_Async> extends React.Component<Props<T_URL, T_Async>, State<T_Async>> {
    constructor(props: Props<T_URL, T_Async>) {
        super(props);
        console.log("constructing a PageWrapper")
        const self = this
        
        if (this.props.getAsyncProps != undefined) {
            if (this.props.asyncResolver.clientSideAsyncResult == null) {
				// This is an API-dependent component and we don't have an API result on hand.
				// stomp on that autoResolve cuz we're gonna render the shadowComponent while we wait for API
				this.props.asyncResolver.autoResolve = () => {
					console.log("intercepted attempt to autoresolve; we got a live one here")
				};

                this.state = {
                    readyToRender: false,
                    componentAsyncProps: null
				}
				// When API comes back, manually trigger `serverSideResolveOnAsyncComplete`
				// (if this is clientside, that fn will not do anything and that's fine)
                this.props.getAsyncProps(this.props.urlProps).then(asyncProps => {
                    console.log("$$$$$$$$$$$$$$$$   about to set state, has stuff?: ", asyncProps != null)
                    self.setState({
                        readyToRender: true,
                        componentAsyncProps: asyncProps
                    });
                    this.props.asyncResolver.serverSideResolveOnAsyncComplete(asyncProps)
                })
            } else {
                console.log("ready for that real render")
                this.state = {
                    readyToRender: true,
                    componentAsyncProps: this.props.asyncResolver.clientSideAsyncResult
                }
            }
            
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
            return this.props.component(this.props.urlProps, this.state.componentAsyncProps)
        } else {
            console.log(".... rendering the crap")
            return this.props.shadowComponent
        }
    }
}