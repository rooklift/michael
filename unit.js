"use strict";

function new_unit(game, type, team, id, x, y, cd, wood, coal, uranium) {
	let unit = {game, type, team, id, x, y, cd, wood, coal, uranium};
	Object.assign(unit, unit_props);
	return unit;
}

let unit_props = {

};



module.exports = new_unit;
