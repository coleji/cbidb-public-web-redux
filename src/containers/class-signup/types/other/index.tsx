import * as React from "react";
import { asDiv } from "../../class-description";
import mercFastTrack from "./merc-fast-track"
import mainsail from "./mainsail"
import mercClinic from "./merc-clinic"
import sup from "./sup"
import paddleAdventure from "./paddle-adventure"
import ws from "./ws"
import advWSClinic from "./advanced-ws-clinic"
import wsRacingClinic from "./ws-racing-clinic"
import envSci from "./env-sci"
import raceTeam from "./race-team"
import robosail from "./robosail"
import funGames from "./fun-games"


export default (
	<React.Fragment>
		{asDiv(mercFastTrack)}
		{asDiv(mainsail)}
		{asDiv(mercClinic)}
		{asDiv(sup)}
		{asDiv(paddleAdventure)}
		{asDiv(ws)}
		{asDiv(advWSClinic)}
		{asDiv(wsRacingClinic)}
		{asDiv(envSci)}
		{asDiv(raceTeam)}
		{asDiv(robosail)}
		{asDiv(funGames)}
	</React.Fragment>
);