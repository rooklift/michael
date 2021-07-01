"use strict";

function new_city(game, team, id, fuel, lk) {
	let city = {game, team, id, fuel, lk};
	Object.assign(city, city_props);
	return city;
}

let city_props = {

	is_city: true,

	will_survive_night() {
		return this.fuel >= this.lk * 10;
	}
};



module.exports = new_city;
