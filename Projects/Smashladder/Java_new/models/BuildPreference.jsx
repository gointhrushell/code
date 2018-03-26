class BuildPreference
{
	constructor(data){
		this.update(data);
		if(!this.hasOwnProperty('active'))
		{
			throw 'Invalid build preference';
		}
	}

	update(data){
		for(var i in data){
			if(!data.hasOwnProperty(i))
			{
				continue;
			}
			this[i] = data[i];
		}
		return this;
	}

	createElement(){
		let element = BuildPreference.template.clone();
		element.data('build_preference_id', this.id);
		element.toggleClass('selected', this.active).toggleClass('unselected', !this.active);
		element.find('input[name=build_active]').prop('checked', this.active);
		let dolphinLogo = element.find('.dolphin_logo');
		if(this.icon_directory)
		{
			dolphinLogo.attr('src', siteUrl+this.icon_directory+'/48x48.png');
		}
		else
		{
			dolphinLogo.remove();
		}
		if(this.name)
		{
			element.find('.title_text').text(this.name);
		}
		else
		{
			element.find('.title_text').remove();
		}
		let detailUrl = element.find('.detail_url');

		if(this.detail_url)
		{
			detailUrl.attr('href', this.detail_url);
		}
		else
		{
			detailUrl.remove();
		}
		if(this.description)
		{
			element.find('.description').text(this.description);
		}
		else
		{
			element.find('.description').remove();
		}
		return element;
	}

}
BuildPreference.generalCache = {};
BuildPreference.retrieve = function(data){
	if(!data)
	{
		return null;
	}
	if(BuildPreference.generalCache[data.id])
	{
		return BuildPreference.generalCache[data.id].update(data);
	}
	else
	{
		let buildPreference = new BuildPreference(data);
		if(data.id)
		{
			BuildPreference.generalCache[data.id] = buildPreference;
		}
		return buildPreference;
	}
};
BuildPreference.template = $('#build_preference_template').detach().attr('id','');

export {BuildPreference};


/** WEBPACK FOOTER **
 ** ./../models/BuildPreference.jsx
 **/