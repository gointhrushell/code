"use strict";

import {Match} from "models/Match";
import {DateFormat} from "components/DateFormat";

export var Infraction = function(infraction, player){
    this.public_message = null;
    this.match = null;
    this.timestamp = null;
    this.player  = null;

    if(!player)
    {
        player = infraction.player;
        delete infraction.player;
    }

    this.player = player;
    this.setProperties(infraction);
};
Infraction.prototype.setProperties = function(data){
    for(var i in data)
    {
        if(data.hasOwnProperty(i))
        {
            this[i] = data[i];
        }
    }
};
Infraction.prototype.matchSummary = function(){

    if(!this.match)
    {
        
    }
    if(!(this.match instanceof Match))
    {
        this.match = new Match(this.match);
    }
    var element = $('<div>').addClass('infraction_summary').data('match_id', this.match.id);
    var when = $('<span>').addClass('infraction_when');
    var description = $('<span>').addClass('infraction_public');

    element.append(when).append(description);

    when.text(DateFormat.smart(this.timestamp));
    description.text(this.public_message);

    return element;
    
};
Infraction.convert = function(infractions, user){
  var list = [];
    $.each(infractions,function(i,infraction){
        list.push(new Infraction(infraction, user));
    });
    return list;
};


/** WEBPACK FOOTER **
 ** ./../models/Infraction.jsx
 **/