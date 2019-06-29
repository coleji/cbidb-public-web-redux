import * as React from "react";

type ComponentWrapper<T_Static, T_Async> = React.ComponentType<T_Static & T_Async>;

export default ComponentWrapper;