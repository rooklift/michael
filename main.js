"use strict";

global.LOG_ENABLED = true;

const fs = require("fs");
const readline = require("readline");

const new_frame = require("./antikit/frame");
const utils = require("./antikit/utils");

const ai = require("./ai");

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

	log(o) {
		if (!global.LOG_ENABLED || this.team === null) {
			return;
		}
		if (!this.logstream) {
			try {
				this.logstream = fs.createWriteStream(`_michael_${new Date().getTime()}_${this.team}.log`);
			} catch (err) {
				global.LOG_ENABLED = false;
				return;
			}
		}
		this.logstream.write(utils.stringify(o));
		this.logstream.write("\n");
	},

	send(s) {
		console.log(s);
	},

	handle_line(s) {

		let fields = s.split(" ");

		if (this.team === null) {						// This will be true when receiving 1st line.

			this.team = parseInt(fields[0], 10);

		} else if (this.frame === null) {				// This will be true when receiving 2nd line.

			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.frame = new_frame(width, height, 0);

		} else if (fields[0] !== "D_DONE") {

			this.frame.parse(fields);

		} else {

			this.frame.finish_parse();
			ai(this.frame, this.team);																// Sends all needed output.
			this.frame = new_frame(this.frame.width, this.frame.height, this.frame.turn + 1);		// Reset the world for next round of input.

		}

	},

};

// ------------------------------------------------------------------------------------------------

global.send = bot.send.bind(bot);
global.log = bot.log.bind(bot);

bot.startup();
