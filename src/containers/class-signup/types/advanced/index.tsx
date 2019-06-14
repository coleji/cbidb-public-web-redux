import * as React from "react";
import { asDiv } from "../../class-description";
import laser from "./laser"
import ct_420 from "./420"
import keelboat from "./keelboat"
import advLaser from "./advanced-laser-clinic"
import adv420 from "./advanced-420-clinic"
import advKeelboat from "./advanced-keelboat-clinic"

export default (
	<React.Fragment>
		{asDiv(laser)}
		{asDiv(ct_420)}
		{asDiv(keelboat)}
		{asDiv(advLaser)}
		{asDiv(adv420)}
		{asDiv(advKeelboat)}
	</React.Fragment>
);