"use strict";

function new_house(game, team, id, x, y, cd) {
	let house = {game, team, id, x, y, cd};
	Object.assign(house, house_props);
	return house;
}

let house_props = {

	is_house: true,

	city() {
		return this.game.city_from_house(this);
	},

	needy() {
		return !this.city().will_survive_night();
	}

};



module.exports = new_house;
