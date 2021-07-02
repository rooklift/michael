"use strict";

const fs = require("fs");
const readline = require("readline");

const new_game = require("./game");
const ai = require("./ai");
const reports = require("./reports");
const stringify = require("./stringify");

const LOG = true;

// ------------------------------------------------------------------------------------------------

let bot = {

	startup() {
		this.team = null;
		this.game = null;
		this.start_scan();
	},

	start_scan() {
		this.linenum = -1;
		this.scanner = readline.createInterface({
			input: process.stdin,
			output: undefined,
			terminal: false
		});
		this.scanner.on("line", (line) => {
			this.linenum++;
			this.handle_line(line, this.linenum);
		});
	},

	start_log(filename) {
		if (!LOG) {
			return;
		}
		this.logstream = fs.createWriteStream(filename);
	},

	// --------------------------------------------------------------------------------------------

	send(s) {
		this.log("> " + s);
		console.log(s);
	},

	log(o) {
		if (!LOG || !this.logstream) {
			return;
		}
		this.logstream.write(stringify(o));
		this.logstream.write("\n");
	},

	// --------------------------------------------------------------------------------------------

	handle_line(s, linenum) {

		this.log(s);

		let fields = s.split(" ");

		// The first 2 lines we ever receive are special...

		if (linenum === 0) {

			this.team = parseInt(fields[0], 10);
			this.start_log(`_michael_${new Date().getTime()}_${this.team}.log`);
			this.log(s);						// Because the call at top will have failed.

		} else if (linenum === 1) {

			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.game = new_game(width, height);

		} else if (fields[0] === "D_DONE") {

			this.game.turn = typeof this.game.turn === "number" ? this.game.turn + 1 : 0;
			ai(this, this.game, this.team);
			this.game.reset();					// Dunno if this is worth doing, but the whole world is sent each turn, also the default kits do this.

		} else {

			this.game.parse(fields);

		}

	},

};

// ------------------------------------------------------------------------------------------------

global.log = bot.log.bind(bot);
bot.startup();
