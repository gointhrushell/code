import {User} from "./User";
export var UserlistElement = function(jqueryElement, user){
    this.user = user;
    this.element = jqueryElement;
    this.isRemoved = false;
    this.displayOptions = UserlistElement.displayOptions.challengeButtonOptionsOnlineUser;
    this.isFirstUpdate = true;
};
UserlistElement.prototype.remove = function(){
    if(this.element)
    {
        this.element.remove();
    }
    this.isRemoved = true; //Mark for garbage collection next time the list is retrieved
    this.user.elements.hasRemovals = true;
};
UserlistElement.prototype.updateAttribute = function(attribute){
    if(this.settables[attribute] && this.user[attribute])
    {
        this.settables[attribute](this.user[attribute]);
    }
};
UserlistElement.prototype.update = function(){
    if(!this.element)
    {
        return;
    }
    let userlistElement = this.element.data().usernameElement;
    this.user.updateUserElements(userlistElement);
    if(this.isFirstUpdate)
    {
        userlistElement.applyUsernameClasses(this.user);
    }
    if(this.user.location)
    {
        this.element.data().locationElement.text(this.user.location.relativeLocation());
    }
    this.element.data().statusElement.text(this.user.away_message);
    if(this.user.is_browser_idle)
    {
        this.element.addClass('browser_idle');
    }
    else
    {
        this.element.removeClass('browser_idle');
    }

    if(this.user.wants_to_play !== null && typeof this.user.wants_to_play !== 'undefined')
    {
        if(this.user.wants_to_play)
        {
            this.element.removeClass('away');
        }
        else
        {
            this.element.addClass('away')
        }
    }
    else
    {
    }
    if(this.user.is_online)
    {
        this.element.addClass('is_online');
        this.element.removeClass('is_offline');
    }
    else
    {
        this.element.removeClass('is_online');
        this.element.addClass('is_offline');
    }
    if(this.user.is_playing)
    {
        this.element.addClass('playing');
    }
    else
    {
        this.element.removeClass('playing');
    }
    //OLD STUFF
    if(this.user.is_browser_idle)
    {
        this.element.addClass('browser_idle');
    }
    else
    {
        this.element.removeClass('browser_idle');
    }

    if(this.displayOptions.showOffline && this.displayOptions.showOnline)
    {
        if(this.user.is_online)
        {
            this.element.addClass('is_online');
            this.element.removeClass('is_offline');
        }
        else //we just assume the worst of this person
        {
            this.element.addClass('is_offline');
            this.element.removeClass('is_online');
        }
        return;
    }
    if(this.displayOptions.showOffline && !this.displayOptions.showOnline)
    {
        if(!this.user.is_online)
        {
            this.element.addClass('is_offline');
            this.element.removeClass('is_online');
            //If this isn't the case, then we'll show normal play buttons
            return;
        }
        else
        {
            this.element.addClass('is_online');
            this.element.removeClass('is_offline');
        }
    }

    if(this.displayOptions.showPlayButtons)
    {
        //var challenges =LadderInfo.retrieveReference('openChallenges');
        //
        //if(!challenges.extraData.users)
        //	challenges.extraData.users = {};
        //
        //if(challenges.extraData.users[user.id])
        //{
        //	element.removeClass('away');
        //	challenged.show();
        //	return;
        //}
        //if(this.displayOptions.showAway)
        //{
        //	if(user.wants_to_play !== null && !user.wants_to_play)
        //	{
        //		element.addClass('away');
        //		noChallenges.show();
        //		return;
        //	}
        //}
        //if(user.is_playing)
        //{
        //	element.removeClass('away');
        //	nowPlaying.show();
        //	return;
        //}

        //if(this.user.match && this.user.match.expiration)
        //{
        //	challenge.addClass('active').show();
        //	updateMatchCount(user.match,challenge);
        //	if(user.match.is_ranked)
        //	{
        //		challenge.removeClass('friendlies');
        //		challenge.addClass('ranked');
        //	}
        //	else
        //	{
        //		challenge.removeClass('ranked');
        //		challenge.addClass('friendlies');
        //	}
        //	return;
        //}
        //
        //if(user.id != myUser.id)
        //{
        //	challenge.show();
        //}
    }
    this.isFirstUpdate = false;
    //challenge.text('Play').removeClass('active').removeClass('friendlies ranked').attr('title','Click to ask for a match!');
};
UserlistElement.newElement = function(){
    var element =  User.getOnlineUserTemplate();
    element.data('usernameElement',element.find('.username'));
    element.data('locationElement',element.find('.location'));
    element.data('statusElement',element.find('.title'));

    return element;
};
UserlistElement.displayOptions = {
    challengeButtonOptionsMatchmaking:{showPlayButtons:true,showOnline:false,showOffline:false,showAway:false},
    challengeButtonOptionsMessages:{showPlayButtons:false,showOnline:true,showOffline:true,showAway:false},
    challengeButtonOptionsFriends:{showPlayButtons:true,showOnline:false,showOffline:true,showAway:false},
    challengeButtonOptionsUserInfo:{showPlayButtons:true,showOnline:false,showOffline:false,inviteToMatch:true},
    challengeButtonOptionsUsersOnly:{showPlayButtons:false,showOnline:false,showOffline:false,showAway:false},
    challengeButtonOptionsOnlineUser:{showPlayButtons:true,showOnline:false,showOffline:false,showAway:true}
};


/** WEBPACK FOOTER **
 ** ./../models/UserlistElement.jsx
 **/