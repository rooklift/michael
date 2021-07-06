"use strict";

module.exports = function(frame, team, id, fuel, upkeep) {
	return Object.assign(Object.create(city_prototype), {frame, team, id, fuel, upkeep});
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
