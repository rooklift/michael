"use strict";

module.exports = function(frame, team, id, x, y, cd) {
	let house = Object.create(house_prototype);
	Object.assign(house, {frame, team, id, x, y, cd});
	house.cmd = {};
	return house;
};

// ------------------------------------------------------------------------------------------------

let house_prototype = Object.assign(Object.create(require("./object")), {

	is_house: true,

	city() {
		return this.frame.city_by_id(this.id);
	},

	needy() {
		return !this.city().will_survive_night();
	},

	order_worker() {
		this.command(`bw ${this.x} ${this.y}`);
	},

	order_cart() {
		this.command(`bc ${this.x} ${this.y}`);
	},

	order_research() {
		this.command(`r ${this.x} ${this.y}`);
	},

});