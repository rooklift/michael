"use strict";

const fs = require("fs");
const readline = require("readline");

const new_game_state = require("./game_state");
const ai = require("./ai");

const LOG = true;

// ------------------------------------------------------------------------------------------------

let bot = {

	startup: function() {
		this.team = null;
		this.state = null;
		this.start_scan();
	},

	start_scan: function() {
		this.linecount = -1;
		this.scanner = readline.createInterface({
			input: process.stdin,
			output: undefined,
			terminal: false
		});
		this.scanner.on("line", (line) => {
			this.linecount++;
			this.handle_line(line, this.linecount);
		});
	},

	start_log: function(filename) {
		if (!LOG) {
			return;
		}
		this.logstream = fs.createWriteStream(filename, {flags: "a"});
		this.log("==============================================================================");
		this.log(`Michael startup at ${new Date().toUTCString()}`);
	},

	// --------------------------------------------------------------------------------------------

	send: function(s) {
		// this.log("> " + s);
		console.log(s);
	},

	log: function(s) {
		if (!LOG || !this.logstream) {
			return;
		}
		this.logstream.write(s);
		this.logstream.write("\n");
	},

	// --------------------------------------------------------------------------------------------

	handle_line: function(s, lineno) {

		// this.log("< " + s);

		let fields = s.split(" ");

		// The first 2 lines we ever receive are special...

		if (lineno === 0) {

			this.team = parseInt(fields[0], 10);
			this.start_log(`michael_${this.team}.log`);

		} else if (lineno === 1) {

			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.state = new_game_state(width, height);

		} else if (fields[0] === "D_DONE") {

			// this.log(this.state.string());

			ai(this, this.state, this.team);
			this.state.reset();					// Must reset the map for the next turn. (?)

		} else {

			this.state.parse(fields);

		}

	},

};

// ------------------------------------------------------------------------------------------------

bot.startup();
