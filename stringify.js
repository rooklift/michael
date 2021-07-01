"use strict";

// Given anything, create a string from it.

module.exports = (msg) => {

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
};
