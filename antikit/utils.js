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

function shuffle_first_two_elements(arr) {

	if (arr.length < 2 || random() < 0.5) {
		return;
	}

	let tmp = arr[0];
	arr[0] = arr[1];
	arr[1] = tmp;
}

// ------------------------------------------------------------------------------------------------

module.exports = {stringify, resolve_dwim_args, shuffle_first_two_elements};
