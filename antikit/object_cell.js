"use strict";

module.exports = function(frame, x, y, type, amount, road) {
	let cell = Object.create(cell_prototype);
	Object.assign(cell, {frame, x, y, type, amount, road});
	return cell;
};

// ------------------------------------------------------------------------------------------------

let cell_prototype = Object.assign(Object.create(require("./object")), {

	is_cell: true,

});
