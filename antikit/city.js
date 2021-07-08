"use strict";

function new_city(frame, team, id, fuel, upkeep) {
	return Object.assign(Object.create(city_prototype), {frame, team, id, fuel, upkeep});
}

// ------------------------------------------------------------------------------------------------

let city_prototype = {

	is_city: true,

	copy() {
		return new_city(this.frame, this.team, this.id, this.fuel, this.upkeep);
	},

	needy() {
		return this.fuel < this.upkeep * 10;
	},

	houses() {
		return this.frame.houses_by_city_id(this.id);
	},

};

// ------------------------------------------------------------------------------------------------

module.exports = new_city;
