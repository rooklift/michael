"use strict";

function new_move_info(x1, y1, direction) {

	// Stores information about a single move, i.e. a move of distance 1 (or 0).

	let ret = {x1, y1, direction};

	ret.x2 = x1;
	ret.y2 = y1;

	if (direction === "n") {
		ret.y2--;
	} else if (direction === "e") {
		ret.x2++;
	} else if (direction === "s") {
		ret.y2++;
	} else if (direction === "w") {
		ret.x2--;
	} else {
		ret.direction = "c";
	}

	return ret;
}



module.exports = new_move_info;
