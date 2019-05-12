// start off with only linear flows.  Maybe we'll need something less linear in the future
export class PageFlowStateMachine {
	routes: string[]
	position: number
	constructor(routes: string[], position: number) {
		this.routes = routes
		this.position = position
	}
	static fromRoutes(routes: string[]): PageFlowStateMachine {
		return new PageFlowStateMachine(routes, 0)
	}
	next(): PageFlowStateMachine {
		if (this.position < this.routes.length-1) {
			return new PageFlowStateMachine(this.routes, this.position+1)
		} else {
			return this.home()
		}
	}
	prev(): PageFlowStateMachine {
		if (this.position > 0 && this.position < this.routes.length) {
			return new PageFlowStateMachine(this.routes, this.position-1)
		} else {
			return this.home()
		}
	}
	home(): PageFlowStateMachine {
		return new PageFlowStateMachine(this.routes, 0)
	}
}