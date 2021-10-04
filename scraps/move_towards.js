	move_towards(a, b) {		// DWIM, accepts an object. Returns a move_info object with {x1, y1, x2, y2, direction}

		let x; let y;

		if (typeof a === "object" && typeof b === "undefined") {
			x = a.x; y = a.y;
		} else if (typeof a === "number" && typeof b === "number") {
			x = a; y = b;
		} else {
			throw "bad call";
		}

		if (x === this.x && y === this.y) {
			return new_move_info(this.x, this.y, "c");
		}

		let dx_abs = Math.abs(this.x - x);
		let dy_abs = Math.abs(this.y - y);

		if (dx_abs > dy_abs) {
			return this.x - x > 0 ? new_move_info(this.x, this.y, "w") : new_move_info(this.x, this.y, "e");
		} else {
			return this.y - y > 0 ? new_move_info(this.x, this.y, "n") : new_move_info(this.x, this.y, "s");
		}
	},
