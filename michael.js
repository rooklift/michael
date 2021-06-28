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

	create_map: function(width, height) {

		this.width = width;
		this.height = height;

		this.map = [];

		for (let x = 0; x < width; x++) {
			this.map.push([]);
			for (let y = 0; y < height; y++) {
				this.map[x].push({
					type: "",
					val: 0,
				});
			}
		}
	},

	// --------------------------------------------------------------------------------------------

	handle_line: function(s, lineno) {

		this.log("< " + s);
		let fields = s.split(" ");

		if (lineno === 0) {
			this.id = parseInt(fields[0], 10);
			this.start_log(`michael_${this.id}.log`);
			this.log("< " + s);
			return;
		}

		if (lineno === 1) {
			let width = parseInt(fields[0], 10);
			let height = parseInt(fields[1], 10);
			this.create_map(width, height);
			return;
		}

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
			this.map[x][y].type = type;
			this.map[x][y].val = val;
			return;
		}

		if (fields[0] === "rp") {
			return;
		}

		if (fields[0] === "u") {
			return;
		}

		if (fields[0] === "D_DONE") {
			this.send("D_FINISH");
			return;
		}

	},

};

// ------------------------------------------------------------------------------------------------

bot.startup();
