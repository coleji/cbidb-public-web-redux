import * as React from "react";

interface Props {
    id: string,
    label?: string,
    value: string,
    isPassword: boolean,
    extraCells?: React.ReactNode
}

export default (props: Props) => 
    <tr>
        <td style={{textAlign: "right"}}>
            <label id={props.id+"_LABEL"} htmlFor={props.id}>
                <span className="optional">{props.label || ""}</span>
            </label>
        </td>
        <td style={{textAlign: "left"}}>
            <input id={props.id} className="text_field apex-item-text" type={props.isPassword ? "password" : "text"} name={props.id} size={25} maxLength={100} defaultValue={props.value} />
        </td>
        {props.extraCells}
    </tr>
