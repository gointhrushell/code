class CacheableDataObject
{
	constructor(data){
		this.update(data);
	}

	static create(data){
		return this.newInstance().update(data);
	}

	update(data){
		for(var i in data){
			if(!data.hasOwnProperty(i))
			{
				continue;
			}
			if(this.dataLocationParsers[i])
			{
				this.dataLocationParsers[i](this, data);
			}
			else
			{
				this[i] = data[i];
			}
		}
		return this;
	}

	static retrieveById(id){
		//TODO: Update this to be able to use dynamic id fields
		return this.retrieve({id: id});
	}

	static retrieve(data, idToSave){
		let className = this.name;
		let id = null;

		if(idToSave)
		{
			id = idToSave;
		}
		else
		{
			id = data.id;
		}
		if(!CacheableDataObject.cache[className])
		{
			CacheableDataObject.cache[className] = {};
		}
		if(CacheableDataObject.cache[className][id])
		{
			return CacheableDataObject.cache[className][id].update(data);
		}
		else
		{
			let newInstance = this.create(data);
			if(id)
			{
				CacheableDataObject.cache[className][id] = newInstance;
			}
			return newInstance;
		}
	}

	static newInstance(){
		throw new Error('static newInstance needs to be defined in ' + this.name);
	}
}
CacheableDataObject.cache = {};
CacheableDataObject.prototype.dataLocationParsers = {

};

if(window)
{
	window.CacheableDataObject = CacheableDataObject;
}

export {CacheableDataObject};


/** WEBPACK FOOTER **
 ** ./../models/CacheableDataObject.jsx
 **/