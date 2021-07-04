"use strict";

const object_prototype = require("./__object_prototype");
const new_command_holder = require("./__command_holder");

function new_cell(frame, x, y, type, amount, road) {

	let cell = Object.create(cell_prototype);
	Object.assign(cell, {frame, x, y, type, amount, road});
	cell.cmd = new_command_holder();
	return cell;

}

let cell_prototype = Object.assign(Object.create(object_prototype), {

	is_cell: true,

});



module.exports = new_cell;
