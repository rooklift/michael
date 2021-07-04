"use strict";

const utils = require("./utils");

function new_cell(frame, x, y, type, amount, road) {

	let cell = Object.create(cell_props);
	Object.assign(cell, {frame, x, y, type, amount, road});
	return cell;

}

let cell_props = {

	is_cell: true,

	distance(arg1, arg2) {
		return utils.distance_from_object(arg1, arg2);
	},

	cell() {				// Just for consistency, meh.
		return this;
	},

};



module.exports = new_cell;
