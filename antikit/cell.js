"use strict";

module.exports = function(frame, x, y, type, amount, road) {
	let cell = Object.create(cell_prototype);
	Object.assign(cell, {frame, x, y, type, amount, road});
	cell.cmd = {};
	return cell;
};

// ------------------------------------------------------------------------------------------------

let cell_prototype = Object.assign(Object.create(require("./__object_prototype")), {

	is_cell: true,

});
