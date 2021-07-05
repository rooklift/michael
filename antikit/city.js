"use strict";

module.exports = function(frame, team, id, fuel, upkeep) {
	let city = Object.create(city_prototype);
	Object.assign(city, {frame, team, id, fuel, upkeep});
	return city;
};

// ------------------------------------------------------------------------------------------------

let city_prototype = {

	is_city: true,

	needy() {
		return this.fuel < this.upkeep * 10;
	},

	houses() {
		return this.frame.houses_by_city_id(this.id);
	},

};
