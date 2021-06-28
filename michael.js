"use strict";

const fs = require("fs");
const readline = require("readline");

const LOG = true;

// ------------------------------------------------------------------------------------------------

let bot = {

	startup: function() {
		this.linecount = -1;
		this.start_scan();
	},

	start_log: function(filename) {
		if (!LOG) {
			return;
		}
		this.logstream = fs.createWriteStream(filename, {flags: "a"});
		this.log("==============================================================================");
		this.log(`Michael startup at ${new Date().toUTCString()}`);
	},

	start_scan: function() {
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

	// --------------------------------------------------------------------------------------------

	send: function(s) {
		console.log(s);
		this.log("> " + s);
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

		let fields = s.split(" ");
		this.log("< " + s);					// Fails for first line because log doesn't exist yet.

		// The first 2 lines we ever receive are special...

		if (lineno === 0) {
			this.start_log(`michael_${this.id}.log`);
			this.log("< " + s);
			this.id = parseInt(fields[0], 10);
			return;
		}

		if (lineno === 1) {
			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.state = NewGameState(width, height);
			return;
		}

		// Other lines...

		if (fields[0] === "c") {
			return;
		}

		if (fields[0] === "ccd") {
			return;
		}

		if (fields[0] === "ct") {
			return;
		}

		if (fields[0] === "r") {
			let type = fields[1][0];			// should be "w" / "c" / "u"
			let x = parseInt(fields[2], 10);
			let y = parseInt(fields[3], 10);
			let val = parseInt(fields[4], 10);
			this.state.map[x][y].type = type;
			this.state.map[x][y].val = val;
			return;
		}

		if (fields[0] === "rp") {
			return;
		}

		if (fields[0] === "u") {
			return;
		}

		if (fields[0] === "D_DONE") {
			this.ai();
			this.state.reset();					// Must reset the map for the next turn. (?)
			return;
		}

	},

	ai: function() {
		this.send("D_FINISH");
	},

};

// ------------------------------------------------------------------------------------------------

function NewGameState(width, height) {
	let game = Object.assign({}, game_state_props);
	game.reset(width, height);
	return game;
}

let game_state_props = {

	reset: function(width, height) {

		if (width) this.width = width;
		if (height) this.height = height;

		if (!this.map) {
			this.map = [];
			for (let x = 0; x < this.width; x++) {
				this.map.push([]);
				for (let y = 0; y < this.height; y++) {
					this.map[x].push({});
				}
			}
		}

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.map[x][y].type = "";
				this.map[x][y].val = 0;
			}
		}
	}
};

// ------------------------------------------------------------------------------------------------

bot.startup();
