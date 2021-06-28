"use strict";

const fs = require("fs");
const readline = require("readline");

const new_game_state = require("./game_state");
const ai = require("./ai");

const LOG = true;
const LOG_INPUT = false;
const LOG_OUTPUT = true;
const LOG_STATES = false;

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
		console.log(s);
		if (LOG_OUTPUT) this.log("> " + s);
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

		if (LOG_INPUT) this.log("< " + s);
		let fields = s.split(" ");

		// The first 2 lines we ever receive are special...

		if (lineno === 0) {
			this.team = parseInt(fields[0], 10);
			this.start_log(`michael_${this.team}.log`);
			if (LOG_INPUT) this.log("< " + s);
			return;
		}

		if (lineno === 1) {
			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.state = new_game_state(width, height);
			return;
		}

		if (fields[0] === "c") {				// c t city_id f lk

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let fuel = parseInt(fields[3], 10);
			let lk = parseInt(fields[4], 10);

			this.state.cities.push({team, id, fuel, lk});
			return;
		}

		if (fields[0] === "ccd") {				// ccd x y cd

			let x = parseInt(fields[1], 10);
			let y = parseInt(fields[2], 10);
			let cd = parseInt(fields[3], 10);

			this.state.map[x][y].cd = cd;
			return;
		}

		if (fields[0] === "ct") {				// ct t city_id x y cd

			let team = parseInt(fields[1], 10);
			let id = fields[2];
			let x = parseInt(fields[3], 10);
			let y = parseInt(fields[4], 10);
			let cd = parseInt(fields[5], 10);

			this.state.tiles.push({team, id, x, y, cd});
			return;
		}

		if (fields[0] === "r") {				// r resource_type x y amount

			let type = fields[1][0];
			let x = parseInt(fields[2], 10);
			let y = parseInt(fields[3], 10);
			let amount = parseInt(fields[4], 10);

			this.state.map[x][y].type = type;
			this.state.map[x][y].amount = amount;
			return;
		}

		if (fields[0] === "rp") {				// rp t points

			let team = parseInt(fields[1], 10);
			let points = parseInt(fields[2], 10);

			this.state.rp[team] = points;
			return;
		}

		if (fields[0] === "u") {				// u unit_type t unit_id x y cd w c u

			let type = parseInt(fields[1], 10);
			let team = parseInt(fields[2], 10);
			let id = fields[3];
			let x = parseInt(fields[4], 10);
			let y = parseInt(fields[5], 10);
			let cd = parseInt(fields[6], 10);
			let wood = parseInt(fields[7], 10);
			let coal = parseInt(fields[8], 10);
			let uranium = parseInt(fields[9], 10);

			this.state.units.push({type, team, id, x, y, cd, wood, coal, uranium});
			return;
		}

		if (fields[0] === "D_DONE") {
			if (LOG_STATES) {
				this.log(this.state.string());
				this.log("-".repeat(this.state.width));
			}
			ai(this, this.state, this.team);
			this.state.reset();					// Must reset the map for the next turn. (?)
			return;
		}

	},

};

// ------------------------------------------------------------------------------------------------

bot.startup();
