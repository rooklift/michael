"use strict";

const fs = require("fs");
const readline = require("readline");

const new_game = require("./game");
const ai = require("./ai");
const reports = require("./reports");

const LOG = true;

// ------------------------------------------------------------------------------------------------

let bot = {

	startup: function() {
		this.team = null;
		this.game = null;
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
			this.start_log(`_michael_${this.team}.log`);

		} else if (lineno === 1) {

			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.game = new_game(width, height);

		} else if (fields[0] === "D_DONE") {

			this.game.turn = typeof this.game.turn === "number" ? this.game.turn + 1 : 0;
			this.log(reports.objects(this.game));
			ai(this, this.game, this.team);
			this.game.reset();					// Dunno if this is worth doing, but the whole world is sent each turn, also the default kits do this.

		} else {

			this.game.parse(fields);

		}

	},

};

// ------------------------------------------------------------------------------------------------

bot.startup();
