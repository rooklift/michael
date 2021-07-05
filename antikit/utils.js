"use strict";

function stringify(msg) {		// Given anything, create a string from it.
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

function resolve_dwim_args(arg1, arg2) {
	if (typeof arg1 === "object" && typeof arg2 === "undefined") {
		return [arg1.x, arg1.y];
	} else if (typeof arg1 === "number" && typeof arg2 === "number") {
		return [arg1, arg2];
	} else {
		throw "bad call";
	}
}

// ------------------------------------------------------------------------------------------------

module.exports = {stringify, resolve_dwim_args};
