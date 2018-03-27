
import {User} from '../models/User.jsx';
import "../models/UserCollection.jsx";
import {Users} from "app/matchmaking.jsx";

export var UserCollection = function(){
    this.list = {};
    this.usernameList = {};
};
UserCollection.prototype.convertCollection = function(collection){
    var i;
    for(i in collection)
    {
        if(collection.hasOwnProperty(i))
        {
            collection[i] = this.update(collection[i]);
        }
    }
    return collection;
};
UserCollection.prototype.possibleUsernameClasses = 'is_subscribed is_mod is_top_player is_admin has_dolla wearing_flair';
UserCollection.convertListToElements = function(playerArray){
    var elements = [];
    $.each(playerArray,function(i,player){
        player = Users.update(player);
        var element = player.createUsernameElement();
        elements.push(element);
    });
    return elements;
};
UserCollection.prototype.create = function(element){
    if(element && element.id)
    {
        if(this.list[element.id])
        {
            var previous = this.list[element.id];
            if(element.location && !previous.location)
            {
                previous.setProperties({location:element.location});
            }
            return previous;
        }
        this.list[element.id] = new User(element);
        if(element.username)
        {
            this.usernameList[element.username.toLowerCase()] = this.list[element.id];
        }
        return this.list[element.id];
    }
    else
    {
        return new User();
    }
};
UserCollection.prototype.update = function(data){
    var user = this.create(data);
    if(user)
    {
        user.setProperties(data);
        return user;
    }
};
UserCollection.prototype.retrieveByUsername = function(username){
    let user = new User({username: username});

    if(this.usernameList[user.usernameLowercase])
        return this.usernameList[user.usernameLowercase];
    return user;
};
UserCollection.prototype.retrieveById = function(userId){
    var user = this.findById(userId);
    if(!user)
        return new User();
    return user;
};
UserCollection.prototype.findById = function(userId){
    if(this.list[userId])
        return this.list[userId];
    return null;
};



/** WEBPACK FOOTER **
 ** ./../models/UserCollection.jsx
 **/