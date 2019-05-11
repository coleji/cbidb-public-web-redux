import * as React from "react";
import * as t from 'io-ts'
import APIWrapper from "../async/APIWrapper";
import {Props as OneWayProps} from "./OneWayDataComponent"

export type Props<T_Form, T_APIProps extends t.Props, T_APIValidator extends t.TypeC<T_APIProps>> = OneWayProps<T_Form, T_APIProps, T_APIValidator> & {

}

