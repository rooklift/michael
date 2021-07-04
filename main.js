"use strict";

const fs = require("fs");
const readline = require("readline");

const new_frame = require("./frame");
const ai = require("./ai");
const stringify = require("./stringify");

global.LOG = false;

// ------------------------------------------------------------------------------------------------

let bot = {

	startup() {
		this.team = null;
		this.frame = null;
		this.start_scan();
	},

	start_scan() {
		this.scanner = readline.createInterface({
			input: process.stdin,
			output: undefined,
			terminal: false
		});
		this.scanner.on("line", (line) => {
			this.linenum++;
			this.handle_line(line);
		});
	},

	// --------------------------------------------------------------------------------------------

	send(s) {
		this.log("> " + s);
		console.log(s);
	},

	log(o) {
		if (!global.LOG) {
			return;
		}
		if (!this.logstream) {
			try {
				this.logstream = fs.createWriteStream(`_michael_${new Date().getTime()}_${this.team}.log`);
			} catch (err) {
				global.LOG = false;
				return;
			}
		}
		this.logstream.write(stringify(o));
		this.logstream.write("\n");
	},

	// --------------------------------------------------------------------------------------------

	handle_line(s) {

		let fields = s.split(" ");

		// The first 2 lines we ever receive are special...

		if (this.team === null) {

			this.team = parseInt(fields[0], 10);

		} else if (this.frame === null) {

			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.frame = new_frame(width, height, 0);

		} else if (fields[0] !== "D_DONE") {

			this.frame.parse(fields);

		} else {

			ai(this, this.frame, this.team);														// Sends all needed output.
			this.frame = new_frame(this.frame.width, this.frame.height, this.frame.turn + 1);		// Reset the world for next round of input.

		}

	},

};

// ------------------------------------------------------------------------------------------------

global.log = bot.log.bind(bot);
bot.startup();
