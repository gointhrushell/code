import {Location} from "../models/Location.jsx";
import {Ladder_Information} from "../components/Ladder_Information.jsx";
import {User_Chat_Rooms} from "../components/User_Chat_Rooms.jsx";
import {League} from "../models/League.jsx";
import {UserlistElement} from "../models/UserlistElement.jsx";
import {PreferredBuilds} from "models/PreferredBuilds.jsx";

import {getOrdinal} from "../functions/getOrdinal.jsx";
import {Flair} from "./Flair";
import {Dashboard} from "../components/Dashboard.jsx";

export var User = function(data){
    this.application = {};
    this.ladder_information = new Ladder_Information();
    this.chat_rooms = new User_Chat_Rooms();
    this.preferred_builds = new PreferredBuilds();
    this.elements = {
        friendlistElement:null,
        userlistElements:[],
        privateChatElement:null,
        hasRemovals:false
    };
    this.setProperties(data);
};
User.prototype.hasToxicWarning = function(countThreshold){
    if(!countThreshold)
    {
        countThreshold = 1;
    }
    let count = this.getToxicCount();
    if(!count)
    {
        return false;
    }
    return count >= countThreshold;
};
User.prototype.getToxicCount = function(){
    if(!this.reported_match_behavior){
        return 0;
    }
    return this.reported_match_behavior.length;
};
User.prototype.showToxicWarning = function(){
    let user = this;
    return new Promise(function(resolve, reject){
        let content = $('<ul>').addClass('reported_match_behavior warning_popup');
        content.append('<h3>'+'Reported Behavior'+'</h3>');
        $.each(user.reported_match_behavior, function(i, message){
            content.append('<li>'+message.public_message+'</li>');
        });
        let popup = Dashboard.ladderPopup(content, user.username + ' has multiple reports, are you sure?', {
            buttons: [
                {
                    text: 'Close',
                    dismiss: true,
                    click: (popup)=>{
                        reject();
                    }
                },
                {
                    text: 'I have been warned and accept anyway',
                    dismiss: false,
                    click: (popup)=>{
                        resolve();
                        popup.dismiss();
                    }
                }
            ]
        });
        popup.onDismiss = function(){
            reject();//Hmm.. might happen after other events ^.^
        };
    });
};
User.prototype.updateElements = function(){
    if(this.elements.friendlistElement)
    {
        this.elements.friendlistElement.update();
    }
    var userlistElements = this.getUserlistElements();
    for(var i in userlistElements)
    {
        userlistElements[i].update();
    }
    if(this.elements.privateChatElement)
    {
        this.elements.privateChatElement.update();
    }
};
User.prototype.setProperties = function(data) {
    var i;
    for(i in data)
    {
        if (data.hasOwnProperty(i))
        {
            if(i == 'location')
            {
                if(data.location instanceof Location)
                {
                    this.location = data.location;
                }
                else
                {
                    if(this.location && data.location && data.location.coordinates && this.location.coordinates &&
                        data.location.coordinates[0] == this.location.coordinates[0]
                    )
                    {
                    }
                    else
                    {
                        this.location = new Location(data.location);
                    }
                }
            }
            else if(i == 'chat_rooms')
            {
                this.chat_rooms = new User_Chat_Rooms(data.chat_rooms);
            }
            else if(i == 'league')
            {
                this.league = new League(data.league);
            }
            else if(i == 'ladder_information')
            {
                this.ladder_information.extend(data.ladder_information);
            }
            else if(i == 'preferred_builds')
            {
                this.preferred_builds.extend(data.preferred_builds);
            }
            else
            {
                this[i] = data[i];
            }
        }
    }
    if(this.league && this.league.ladder_id ) //Make sure league information is set in the proper location
    {
        if(!this.ladder_information[this.league.ladder_id])
        {
            this.ladder_information[this.league.ladder_id] = {};
        }
        this.ladder_information[this.league.ladder_id].league = this.league;
    }
};
User.prototype.getUserlistElements = function(){
    if(this.elements.hasRemovals)//Garbage collection of removed elements
    {
        for (var i=this.elements.userlistElements.length-1; i>=0; i--)
        {
            var element = this.elements.userlistElements[i];
            if(element.isRemoved)
            {
                this.elements.userlistElements.splice(i,1);
                //delete this.elements.userlistElements[i];
            }
        }
        this.elements.hasRemovals = false;
    }
    var elements = this.elements.userlistElements.slice();
    if(this.elements.friendListElement)
    {
        elements.push(this.elements.friendListElement);
    }
    return elements;
};
User.prototype.addNewUserlistElement = function(element)
{
    if(!element)
        element = null;
    var userlistElement = new UserlistElement(element,this);
    this.elements.userlistElements.push(userlistElement);
    return userlistElement;
};
User.prototype.cssOnlineStatus = function(){
    var classes = [];
    if(this.is_online)
    {
        classes.push('is_online');
    }
    else
    {
        classes.push('is_offline');
    }
    //if(this.data.is_browser_idle)
    //{
    //	classes.push('browser_idle');
    //}


    return classes;
};
User.prototype.addFlair = function(element){
    // console.trace('wat wat');
    var flairUrl, flairIcons;
    let player = this;
    if(player.selected_flair)
    {
        if(!(player.selected_flair instanceof Flair))
        {
            player.selected_flair = Flair.retrieve(player.selected_flair);
        }

        let retrieveFlairData = function(element){
            let flairData = null;
            if(element.data('flairData'))
            {
                flairData = element.data('flairData');
            }
            else
            {
                flairData = {};
                flairData.parent = element.parent();

                let flairyHolder = $('<span>').addClass('flairy_holder');
                let afterFlairy = $('<span>').addClass('front_flairy_holder');
                flairyHolder.insertBefore(element);
                afterFlairy.insertAfter(element);

                flairData.icons = new Map();
                flairData.afterIcons = new Map();
                flairData.flairyHolder = flairyHolder;
                flairData.afterFlairyHolder = afterFlairy;
                element.data('flairData', flairData);
            }
            return flairData;
        };

        element.each(function(i,currentElement){
            let element = currentElement;
            element = $(element);
            element.addClass('wearing_flair');
            let flairData = retrieveFlairData(element);


            if(!flairData.icons.has(player.selected_flair))
            {
                player.selected_flair.createElement().appendTo(flairData.flairyHolder);
                flairData.icons.set(player.selected_flair, true);
            }

            let afterFlair = null;
            if(player.is_top_monthly_donator)
            {
                afterFlair = Flair.retrieve({
                    name: 'dolla',
                    safe_url: "/images/smilies/ceo.png",
                });
            }

            if(afterFlair && !flairData.afterIcons.has(afterFlair))
            {
                afterFlair.createElement().appendTo(flairData.afterFlairyHolder);
                flairData.afterIcons.set(afterFlair, true);
            }


        });
    }
};
User.prototype.updateUserElements = function(jqueryElements){
    jqueryElements.applyUsernameClasses(this)
        .data('username',this.username).data('id', this.id ? this.id : null);
    if(!this.username)
    {
        return;
    }
    jqueryElements.data('username', this.username);
    jqueryElements.data('usernameLowercase', this.username.toLowerCase());
    jqueryElements.each((i, element) => {
        element = $(element);
        if(element.prop("tagName") == "A")
        {
            element.attr('href', this.getProfileUrl());
        }
        if(this.display_name)
        {
            if(!jqueryElements.data('displayNameSplit'))
            {
                jqueryElements.data('displayNameSplit', true)
                let displayName = $('<span>').addClass('display_name');
                displayName.text(this.display_name);
                displayName.appendTo(element);
                let usernameElement = $('<span>').addClass('gangster_name');
                usernameElement.text(this.getStyledUsername());
                usernameElement.appendTo(element);
            }
            jqueryElements.addClass('has_display_name');

            jqueryElements.data('display_name', this.display_name);
        }
        else
        {
            if(jqueryElements.data('displayNameSplit'))
            {
                jqueryElements.empty();
                jqueryElements.removeClass('has_display_name');
                jqueryElements.data('display_name', null);
                jqueryElements.data('displayNameSplit', false);
            }
            element.text(this.getStyledUsername());
        }
    });

};
User.prototype.getStyledUsername = function(){
  return this.username.replace(/_/g, ' ');
};
User.prototype.getDisplayedName = function(){
    return this.display_name ? this.display_name : this.getStyledUsername();
};
User.prototype.createUsernameElement = function(){
    var element = $('<span>');
    this.updateUserElements(element);
    // if(this.id)
    // {
    //     element.data('id', this.id);
    // }
    if(showGlowColors && this.glow_color && this.is_subscribed)
    {
        element.css('text-shadow',this.getTextShadowStyle());
    }
    return element;
};
User.prototype.createUsernameRankElement = function(ladderId){
    let userElement = $('<div>').addClass('advanced_user_element');

    var league = this.ladder_information.getLeagueForLadder(ladderId);
    if(league)
    {
        league.createElement();
        league.appendTo(userElement);
    }
    userElement.append(this.createUsernameElement());
    if(this.location)
    {
        userElement.append(this.location.createLocationElement());
    }
    return userElement;
};
$.fn.setTextShadowColors = function(user){
    var textShadowColors = user.getTextShadowColors();
    if(textShadowColors)
    {
        $(this).css('text-shadow',user.getTextShadowColors());
    }
};
User.prototype.getTextShadowStyle = function(){
    if(showGlowColors && this.glow_color && this.is_subscribed)
    {
        return '-1px 1px 8px '+this.glow_color+', 1px -1px 8px '+this.glow_color;
    }
    return '';
};
User.prototype.getProfileUrl = function(){
    if(this.id)
    {
        return siteUrl+'/player/'+this.id;
    }
    else if(this.username)
    {
        return siteUrl+'/player/'+this.username;
    }
    else{
        return '';
    }
};
User.prototype.cssUsername = function() {
    var classes = [];
    classes.push('username');
    if(this.is_mod)//Is a moderator
        classes.push('is_mod');
    if(this.is_admin)
        classes.push('is_admin');//.attr('title','Is an Administrator');
    if(this.is_subscribed)
        classes.push('is_subscribed');//.attr('title','Is Subscribed to Smashladder');
    if(this.is_ignored)
        classes.push('is_ignored');
    if(this.is_donator)
        classes.push('is_donator');//.attr('title','Is a Donator to Smashladder');
    if(this.is_top_player)
    {
        classes.push('is_top_player');
        if(this.is_top_player.rank)
        {
            var ordinal = getOrdinal(this.is_top_player.rank);
            classes.push('top_player_'+this.is_top_player.rank)
        }
        if(this.is_top_player.ladder_name)
        {
            //element.attr('title','Is '+ordinal+' in '+this.is_top_player.ladder_name)
        }
    }

    return classes;
};
User.onlineUserTemplate = null;
User.getOnlineUserTemplate = function(){
    if(!User.onlineUserTemplate)
    {
        User.onlineUserTemplate = $('.online_user.template').detach().removeClass('template');
    }
    return User.onlineUserTemplate.clone();
};


/** WEBPACK FOOTER **
 ** ./../models/User.jsx
 **/