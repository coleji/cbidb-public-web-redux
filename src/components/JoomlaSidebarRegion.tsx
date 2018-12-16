import * as React from "react";

interface JoomlaSidebarRegionProps {
	title: React.ReactNode
}

export default class JoomlaSidebarRegion extends React.Component<JoomlaSidebarRegionProps> {
	render() {
		return (
			<div className="title3">
				<div className="block-shadow">
					<div className="rt-block">
						<div className="module-title" style={({ margin: "-15px -15px 15px -15px", backgroundColor: "#2358A6" })}>
							<div className="module-title2"><div className="module-title3">
								<h2 className="title" style={({ visibility: "visible", padding: "10px 15px", color: "white", fontSize: "170%" })}>
									{this.props.title}
								</h2><div className="accent" style={({
									borderTop: "12px solid",
									borderLeft: "12px solid transparent !important",
									borderRight: "12px solid transparent !important",
									height: 0,
									width: 0,
									position: "absolute",
									left: "30px",
									top: "42px",
									borderColor: "#2358A6"
								})}></div></div></div></div>
						<div className="module-content" style={({ fontSize: "1.2em" })}>
							{this.props.children}
							<div className="clear"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
