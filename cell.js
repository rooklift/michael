"use strict";

function new_cell(game, x, y, type, amount, road) {

	let cell = Object.create(cell_props);
	Object.assign(cell, {game, x, y, type, amount, road});
	return cell;

}

let cell_props = {

	is_cell: true,

};



module.exports = new_cell;
