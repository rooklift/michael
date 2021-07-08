"use strict";

const fs = require("fs");
const readline = require("readline");

const new_frame = require("./frame");
const utils = require("./utils");

// ------------------------------------------------------------------------------------------------

function new_bot(name, ai_function) {
	let bot = Object.create(bot_prototype);
	bot.startup(name, ai_function);
	global.log = bot.log.bind(bot);
	global.LOG_ENABLED = true;
	return bot;
}

// ------------------------------------------------------------------------------------------------

let bot_prototype = {

	startup(name, ai_function) {
		this.name = name;
		this.ai_function = ai_function;
		this.team = null;
		this.frame = null;
		this.early_log_messages = [];			// For log messages that come before team is known.
		this.start_scan();
	},

	start_scan() {
		this.scanner = readline.createInterface({
			input: process.stdin,
			output: undefined,
			terminal: false
		});
		this.scanner.on("line", (line) => {
			this.handle_line(line);
		});
	},

	log(o) {

		if (!global.LOG_ENABLED) {
			return;
		}
		if (this.team === null) {
			this.early_log_messages.push(utils.stringify(o));
			return;
		}
		if (!this.logstream) {
			try {
				this.logstream = fs.createWriteStream(`_${this.name}_${new Date().getTime()}_${this.team}.log`);
			} catch (err) {
				global.LOG_ENABLED = false;
				return;
			}
		}
		this.logstream.write(utils.stringify(o));
		this.logstream.write("\n");
	},

	handle_line(s) {

		let fields = s.split(" ");

		if (this.team === null) {						// This will be true when receiving 1st line.

			this.team = parseInt(fields[0], 10);

			for (let msg of this.early_log_messages) {
				this.log(msg);
			}

		} else if (this.frame === null) {				// This will be true when receiving 2nd line.

			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.frame = new_frame(width, height, 0);

		} else if (fields[0] !== "D_DONE") {

			this.frame.parse(fields);

		} else {

			let ai = this.ai_function;
			ai(this.frame, this.team);
			this.frame.send_orders();

			this.frame = new_frame(this.frame.width, this.frame.height, this.frame.turn + 1);		// Reset the world for next round of input.

		}

	},

};

// ------------------------------------------------------------------------------------------------

module.exports = new_bot;
