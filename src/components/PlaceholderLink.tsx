import * as React from "react";

interface Props {
    text: string
}
export default (props: Props) => <a href="#">{props.text}</a>