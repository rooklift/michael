"use strict";

module.exports = function(frame, x, y, type, amount, road) {
	return Object.assign(Object.create(cell_prototype), {frame, x, y, type, amount, road});
};

// ------------------------------------------------------------------------------------------------

let cell_prototype = Object.assign(Object.create(require("./object")), {

	is_cell: true,

});
