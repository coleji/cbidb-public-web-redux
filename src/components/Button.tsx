import * as React from "react";

interface Props {
    text: string
}

export default (props: Props) => 
    <a className="readon" style={{margin: "0 5px"}}>
        <span>{props.text}</span>
    </a>
