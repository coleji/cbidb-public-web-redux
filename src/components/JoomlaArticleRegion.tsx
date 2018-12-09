import * as React from "react";

interface JoomlaArticleRegionProps {
    title: React.ReactNode,
    body: React.ReactNode
}

export default class JoomlaArticleRegion extends React.Component<JoomlaArticleRegionProps> {
    render() {
        return (
            <div className="rt-article">
                <div className="article-header">
                    <h2>{this.props.title}</h2>
                </div>
                <div className="article-body">{this.props.body}</div>
                <div className="article-buttons" style={{marginTop: "15px"}}></div>
            </div>
        )
    }
}