import {CacheableDataObject} from "./CacheableDataObject";

class Country extends CacheableDataObject
{

}
Country.cache = {};
Country.retrieve = function(data){
	if(Country.cache[data.id])
	{
		return Country.cache[data.id].update(data);
	}
	else
	{
		let country = new Country(data);
		if(data.id)
		{
			Country.cache[data.id] = country;
		}
		return country;
	}
};

export {Country};


/** WEBPACK FOOTER **
 ** ./../models/Country.jsx
 **/