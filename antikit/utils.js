"use strict";

const random = require("./random");

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

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		let t = Math.floor(random() * (i + 1));
		let tmp = arr[t];
		arr[t] = arr[i];
		arr[i] = tmp;
	}
	return arr;
}

// ------------------------------------------------------------------------------------------------

module.exports = {stringify, resolve_dwim_args, shuffle};
