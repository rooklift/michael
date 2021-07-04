"use strict";

function stringify(msg) {

	// Given anything, create a string from it.

	try {

		if (msg instanceof Error) {
			msg = msg.toString();
		}
		if (typeof msg === "object") {
			msg = JSON.stringify(msg);
		}
		if (typeof msg === "undefined") {
			msg = "undefined";
		}
		msg = msg.toString().trim();
		return msg;

	} catch (err) {

		return "stringify() failed";

	}
}

function distance_from_object(o, arg1, arg2) {

	// 2 ways to call:
	//		distance_from_object(source_object, target_object)
	//		distance_from_object(source_object, x, y)

	let x; let y;

	if (typeof arg1 === "object" && typeof arg2 === "undefined") {
		x = arg1.x; y = arg1.y;
	} else if (typeof arg1 === "number" && typeof arg2 === "number") {
		x = arg1; y = arg2;
	} else {
		throw "bad call";
	}

	return Math.abs(x - o.x) + Math.abs(y - o.y);
}



module.exports = {stringify, distance_from_object};
