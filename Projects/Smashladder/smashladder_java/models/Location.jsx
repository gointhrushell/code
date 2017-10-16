import {LadderDistance} from "../components/LadderDistance.jsx";
import {Dashboard} from "../components/Dashboard";

export var Location = function(location){
    var i;
    this.distanceFromUser = null;
    this.setProperties(location);
};
Location.prototype.setProperties = function(location){
    for(var i in location)
    {
        if(location.hasOwnProperty(i))
        {
            this[i] = location[i];
            if(i == 'coordinates')
            {
                if(myUser.location)
                {
                    this.distanceFromUser = this.distanceFromLocation(this,myUser.location);
                }
            }
        }
    }
};
Location.prototype.distanceFromLocation = function(location){
    return LadderDistance.getDistanceFromLocations(myUser.location,location);
};
Location.prototype.isWithinPreferredRange = function(gameId){
    return this.distanceFromUser &&
        Dashboard.getPreferredDistanceSeverity() >= this.distanceFromUser.getDistanceSeverity();
};
Location.prototype.createLocationElement = function(){
    var text = this.relativeLocation();
    var element = $('<span>').text(text).attr('title', text);
    let distanceFromLocation = this.distanceFromLocation(this);
    if(distanceFromLocation)
    {
        distanceFromLocation = distanceFromLocation.getDistanceSeverity();
    }
    else
    {
        distanceFromLocation = 0
    }
    element.addClass('location distance_severity distance_severity_'
        +distanceFromLocation);
    return element;
};
Location.prototype.relativeLocation = function(){
    var country;
    var state;
    var locality;
    var localLocation = myUser.location;
    var location = this;
    if(location.country && localLocation.country && location.country.id != localLocation.country.id)
        country = location.country.name;
    if(location.state)
        state = location.state;
    if(location.locality)
        locality = location.locality;
    if(locality && state && country)
    {
        return locality+', '+state+' ('+country+')';
    }
    if(locality && state)
    {
        return locality+', '+state;
    }
    if(state && country)
    {
        return state+', '+country;
    }
    if(state)
    {
        return state;
    }
    if(country)
    {
        return country;
    }
    if(location.country)
    {
        return location.country.name;
    }
    return 'Not Set';
};


/** WEBPACK FOOTER **
 ** ./../models/Location.jsx
 **/