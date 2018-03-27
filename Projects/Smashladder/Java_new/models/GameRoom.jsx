import {CacheableDataObject} from "./CacheableDataObject";
import {Season} from "./Season";
/**
 * Alias for a Ladder. I created a Ladder file a long time ago and don't want to refactor it.
 */
class GameRoom extends CacheableDataObject
{

	constructor(data){
		super(data);
		if(!this.connected_field_types)
		{
			this.connected_field_types = [];
		}
	}

	static newInstance(){
		return new GameRoom();
	}

}
GameRoom.prototype.dataLocationParsers = {
	connected_field_types: function(object, data){
		object.connected_field_types = [];
		for(let i = 0; i < data.connected_field_types.length; i++)
		{
			let field = data.connected_field_types[i];
			object.connected_field_types[i] = ConnectedField.retrieve(field, field.type);
		}
	},
	season: function(object, data){
		if(!object.seasons)
		{
			object.seasons = {};
		}
		if(data.season.id)
		{
			object.seasons[data.season.id] = Season.retrieve(data.season);
		}
		else
		{
			object.seasons['default'] = data.season;
		}
	}
};
class ConnectedField extends CacheableDataObject{

	pullFieldFromPlayer(player){
		let data = player.connected_fields[this.type];
		if(data)
		{
			return data;
		}
		return {};
	}

	hasClickableLink(){
		return !!this.link
	}

	isNormalDisplayed(){
		return this.input == 2 || this.input == 3;
	}

	hasConnectUrl(){
		return this.input == 1 && this.connect_url;
	}

	isEditable(){
		return this.input == 2 || this.input == 3;
	}

	static newInstance(){
		return new ConnectedField();
	}

}

export {GameRoom};


/** WEBPACK FOOTER **
 ** ./../models/GameRoom.jsx
 **/