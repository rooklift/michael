"use strict";

// This exists as a convenient way to ensure things have at most 1 command.
// Also, it was necessary to store stuff in an object so we could freeze
// everything else while not freezing this.

function new_command_holder() {
	return Object.create(command_prototype);
}

let command_prototype = {

	set(s) {
		this.val = s;
	},

	clear() {
		delete this.val;
	},

	transmit() {
		if (this.val) {
			send(this.val);
		}
	},

};



module.exports = new_command_holder;
