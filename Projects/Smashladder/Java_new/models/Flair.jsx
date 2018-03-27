class Flair{

    constructor(data){
        this.setProperties(data);
    }

    setProperties(data) {
        var i;
        for(i in data)
        {
            if (data.hasOwnProperty(i))
            {
                this[i] = data[i];
            }
        }
        if(imageUrl)
        {
            this.fullUrl = '//'+imageUrl+ data.safe_url;
        }
        else
        {
            this.fullUrl = siteUrl + '/' + data.safe_url;
        }
        if(this.name)
        {
            Flair.cachedFlairs[this.name] = this;
        }
    }


    createElement(){
        let img = $('<img>');
        let flairClass = 'flair-'+ this.name;
        img = img.addClass('flairy').addClass(flairClass).attr('src',this.fullUrl);
        return img;
    }
}
Flair.cachedFlairs = {};
Flair.retrieve = function(data){
    if(Flair.cachedFlairs[data.name])
    {
        return Flair.cachedFlairs[data.name];
    }
    else
    {
        return new Flair(data);
    }
};
export {Flair};


/** WEBPACK FOOTER **
 ** ./../models/Flair.jsx
 **/