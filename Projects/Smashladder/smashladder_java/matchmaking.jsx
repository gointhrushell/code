"use strict";

var LadderInfoGlobal, unreadMessageCount, Users;

import {UserCollection} from "models/UserCollection";
import {matchModeManager} from "models/MatchModeManager.jsx";
import {MatchModeManager} from "models/MatchModeManager.jsx";
import {Match} from "models/Match.jsx";
import {Location} from "models/Location";
import {League} from "models/League.jsx";
import {User} from "models/User";
import {Flair} from "models/Flair";
import {Character} from "../models/Character.jsx";


import {ChatNotification} from "models/ChatNotification";
import {LadderHistory} from "components/LadderHistory";
import {ChatMessages} from "models/ChatMessages";
import {ChatMessage} from "models/ChatMessage";
import {ChatRoom} from "models/ChatRoom.jsx";
import {MatchSummary} from "models/MatchSummary.jsx";


import {ChatActions} from "components/ChatActions";
import {ElementUpdate} from "components/ElementUpdate";
import {Request} from "components/Request";
import {DisplayUpdater} from "components/DisplayUpdater";
import {LadderInfo} from "components/LadderInfo";
import {Settings} from "components/Settings";
import {Popups} from "components/Popups";
import {SiteLinker} from "components/SiteLinker";
import {UserInfo} from "components/UserInfo.jsx";
import {AdvancedMatchHistory} from "components/AdvancedMatchHistory.jsx";


import {UserlistElement} from "models/UserlistElement";
import {BrowserNotification} from 'components/BrowserNotification';
import {MatchEndNotification} from 'components/MatchEndNotification';
import {Timer} from 'components/Timer.jsx';
window.MatchEndNotification = MatchEndNotification; //For the test page
window.AdvancedMatchHistory = AdvancedMatchHistory;

import {Html} from "components/Html";
import {LadderDistance} from "components/LadderDistance";
import {PrivateChatLoader} from "components/PrivateChatLoader";


import {Dashboard} from "components/Dashboard.jsx";
import {getOrdinal} from "functions/getOrdinal";
import {DateFormat} from "components/DateFormat";
import {Ladder} from "components/Ladder";
import {ladder} from "components/Ladder";
import {LadderLinker} from "components/LadderLinker";
import {PlayerUpdater} from "components/PlayerUpdater";
import {MatchSounds} from "components/MatchSounds";
import {Infraction} from "models/Infraction";
import {ladderLocalStorage} from "components/Ladder.jsx";
import {PostManager} from '../components/PostManager.jsx';
import {SocketConnection} from '../components/SocketConnection.jsx';
import {MatchmakingPopup} from '../components/MatchmakingPopup.jsx';
import '../components/Rankings.jsx';

$.fn.applyUsernameClasses = function (user) {
    var $this = this;
    return $this.each(function(){
        $(this).removeClass(Users.possibleUsernameClasses).addClass(user.cssUsername().join(' '));
    });
};

$.fn.timestampUpdate = function (timestamp){
    var $this = this;
    return $this.each(function(){
        var element = $(this);
        if(typeof timestamp !== 'undefined')
        {
            element.data('timestamp',timestamp);
        }
        if(element.data('timestamp'))
        {
            element.text(DateFormat.smart(element.data('timestamp')));
        }
        else
        {
            element.text('');
        }
    });
};


Users = new UserCollection();
export {Users};

myUser = Users.update(myUser);
LadderInfoGlobal = null;
unreadMessageCount = 0;

// emotify.emoticons(siteUrl+'/images/smilies/',{
//     "FrankerZ":	[ 'FrankerZ.png','Arf arf' ]
// });


var dashboard = Dashboard.dashboard;
Dashboard.playedSoundEffect = true;

// var challengeButtonOptionsOnlineUser = {showPlayButtons:true,showOnline:false,showOffline:false,showAway:false};
// var challengeButtonOptionsMatchmaking = {showPlayButtons:true,showOnline:false,showOffline:false,showAway:false,showMatchSpecificOptions:true};
// var challengeButtonOptionsMessages = {showPlayButtons:false,showOnline:true,showOffline:true,showAway:false};
// var challengeButtonOptionsFriends = {showPlayButtons:true,showOnline:false,showOffline:true,showAway:false};
// var challengeButtonOptionsUserInfo = {showPlayButtons:true,showOnline:false,showOffline:true,showAway:false,inviteToMatch:true};
// var challengeButtonOptionsUsersOnly = {showPlayButtons:false,showOnline:false,showOffline:false,showAway:false};

if(isInLadder)
{
    $('a').not('.logout').attr("target", "_blank");
    $('.matchmaking_link').click(function(e){
        e.preventDefault();
    });
}


$(document).on('click', function(event) {
    checkDeclickables(event);
});

$('.chat_rules').click(function(e){
    let chatRules = $(this);
    let rules = null;
    if(chatRules.data('rules'))
    {
        rules = chatRules.data('rules');
    }
    else
    {
        rules = $('.chat-rules-popout.template').remove().removeClass('template');
        chatRules.data('rules', rules);
    }
    Dashboard.ladderPopup(rules.clone(), 'Chat Rules');
});

$('#user_list_information').data('countElement',$('#user_list_information').find('.online_user_count'));

$('#main_chat_area').on('click', '.chat_room_description .closing_x', function(e){
    var description = $(this).closest('.chat_room_description');
    if(description.length)
    {
        description.hide();
        var descriptionKey;
        if(description.data('descriptionId') && description.data('chatRoomId'))
        {
            var chatRooms = ladderLocalStorage.getItem('chat_rooms');
            if(!chatRooms)
            {
                chatRooms = {};
                chatRooms.chats = {};
            }
            if(!chatRooms.chats[description.data('chatRoomId')])
            {
                chatRooms.chats[description.data('chatRoomId')] = {};
            }
            if(chatRooms.chats[description.data('chatRoomId')].last_motd_id !=
                description.data('descriptionId'))
            {
                chatRooms.chats[description.data('chatRoomId')].last_motd_times_closed = 0;
            }
            chatRooms.chats[description.data('chatRoomId')].last_motd_times_closed++;
            chatRooms.chats[description.data('chatRoomId')].last_motd_id = description.data('descriptionId');

            ladderLocalStorage.setItem('chat_rooms',chatRooms);
        }
        
    }
    
});

$('.search_dropdown_button').click(function(e){
    var button = $(this);
    var dropdown = button.next('.dropdown-menu');
    dropdown.data('canBeUnclicked',true);

    if(dropdown.is(':visible'))
    {
        button.trigger('notClicked');
    }
    else
    {
        Ladder.declickables.push(dropdown);
        dropdown.off('notClicked').on('notClicked',function(){
            if(dropdown.data('removeFromDeclickables'))
            {
                button.trigger('notClicked');
                dropdown.data('removeFromDeclickables',false);
            }
            else
            {
                dropdown.data('removeFromDeclickables',true);
            }
        });
        dropdown.show().find('input:first').focus()
            .off('keyup').on('keyup',function(e){
            if(e.keyCode == 27)
            {
                e.preventDefault();
                $(this).val('');
                button.trigger('notClicked');
            }
        });
    }
}).on('notClicked',function(e){
    $(this).next('.dropdown-menu').hide();
});


$('.latest_subscribers').on('addUser',function(e,user){
    var latestSubsContainer = $(this).find('.sub_area');
    var latestSub = $('.latest_subscribers .latest_sub.template').clone();
    latestSub.removeClass('template');
    latestSub.find('.username').text(user.username);
    var date = new Date();
    latestSub.find('.date').text(new Date().format('M d'));
    var subsList = latestSubsContainer.find('.subs_list');
    latestSub.hide();
    latestSub.fadeIn();

    latestSub.prependTo(subsList);
    var users = subsList.find('.latest_sub').not('.template');
    if(users.length > 3)
    {
        users.last().fadeOut('slow',function(){
            $(this).remove();
        });
    }
});

Dashboard.friendListButton.on('updateFriend',function(e,friend){
    var list = $(this).data('list');
    friend = Users.update(friend);
    var element;
    var friendData = friend.friend;

    if(friendData)
    {
        if(myFriends[friend.id])
        {
            if(!friendData.is_friend && !friendData.request_sent && !friendData.waiting_response)
            {
                element = myFriends[friend.id].elements.friendlistElement;
                if(element)
                {
                    element.remove();
                }
                delete myFriends[friend.id];
                return;
            }
        }
    }


    if(myFriends[friend.id])
    {
        element = myFriends[friend.id].elements.friendlistElement;
        if(element)
        {
            element = element.element;
        }
        if(friend.is_online)
        {
            if(myFriends[friend.id].waitTimer && myFriends[friend.id].waitTimer.getTime() > new Date().getTime())
            {
            }
            else
            {
                var usernameElement = friend.createUsernameElement();
                var notificationMessage = $('<span>');
                notificationMessage.append('Your friend ').append(usernameElement).append(' is online.');
                var addedMessage = ChatActions.addNotificationToChat(null,notificationMessage);
                var newDateObj = new Date();
                newDateObj.setTime(newDateObj.getTime() + (10 * 60 * 1000));
                myFriends[friend.id].waitTimer = newDateObj;
                setTimeout(function(){
                    addedMessage.remove();
                }, 120000);
            }
            if(element)
            {
                element.removeClass('is_offline').addClass('is_online');
            }
        }
        else
        {
            if(element)
            {
                element.removeClass('is_online').addClass('is_offline');
            }
            myFriends[friend.id].is_online = false;
        }
    }
    else
    {
        element = UserlistElement.newElement();
        element.data('challengeButtonOptions',UserlistElement.displayOptions.challengeButtonOptionsFriends);
        element.find('.rating_container').hide();
        ElementUpdate.user(element,friend);
        friend.elements.friendlistElement = new UserlistElement(element,friend);
        list.append(element);
        myFriends[friend.id] = friend;
    }
    if(element && friendData)
    {

        var all = ['friend_request_blocked','friend_waiting_response','friend_request_sent', 'friend_request_null'];
        element.removeClass(all.join(' '));
        if(!friendData)
        {
            // alert('no friend data');
        }
        else if(friendData && friendData.blocked_friend_request)
        {
            // alert('blocked');
            element.addClass('friend_request_blocked');
        }
        else if(friendData.waiting_response)
        {
            // alert('waiting response');
            element.addClass('friend_waiting_response');
        }
        else if(friendData.request_sent)
        {
            // alert('request sent');
            element.addClass('friend_request_sent');
        }
        else
        {
            // alert('null');
            element.addClass('friend_request_null');
        }


    }
}).on('activated',function(e){
    var button = $(this);
    var list = button.data('list').addClass('active');

    Dashboard.activeRegionButton = button;

    var hiddenLists = $('.user_lists .list_container').not(list).removeClass('active');

    list.html('');
    list.append($('#loading_list').clone().removeAttr('id').removeClass('template'));
    ChatActions.resizeOpenChats();
    Request.post(siteUrl+'/matchmaking/friend_list',{},function(response){

        list.empty();
        myFriends = {};
        if(response.friends && response.friends.length === 0)
        {
            var emptyList = $('<li>').addClass('empty_result').text('Your friend list is empty!');
            emptyList.appendTo(list);
        }
        else
        {
            $.each(response.friends,function(i,player){
                button.trigger('updateFriend',[player]);
            });
        }

    });
}).on('deactivated',function(){
    $(this).data('list').removeClass('active');
}).data('list',$('#friend_list'));

$('#ignore_list_button').on('activated',function(s){
    var button = $(this);
    var list = button.data('list').addClass('active');

    var hiddenLists = $('.user_lists .list_container').not(list).removeClass('active');

    list.html('');
    list.append($('#loading_list').clone().removeAttr('id').removeClass('template'));
    ChatActions.resizeOpenChats();
    Request.post(siteUrl+'/matchmaking/ignore_list',{},function(response){

        list.html('');
        if(response.ignores && response.ignores.length === 0)
        {
            var emptyList = $('<li>').addClass('empty_result').text('You like listening to everybody!');
            emptyList.appendTo(list);
        }
        else
        {
            $.each(response.ignores,function(i,player){
                var element = User.getOnlineUserTemplate();
                element.removeClass('template');
                element.find('.rating_container').hide();
                element.data('challengeButtonOptions',UserlistElement.displayOptions.challengeButtonOptionsUsersOnly);
                ElementUpdate.user(element,player);
                list.append(element);
            });
        }

    });
}).on('deactivated',function(){
    $(this).data('list').hide();
}).data('list',$('#ignored_users'));

$('.rank_filters').on('click','.tier',function(e){
    var button = $(this);
    var data = {tier_name:button.data('tier_name')};
    if(button.hasClass('enabled'))
    {
        data.enabled = 0;
        button.removeClass('enabled');
    }
    else
    {
        data.enabled = 1;
        button.addClass('enabled');
    }
    var elements = $('.recent_match_searcher.'+data.tier_name);
    if(data.enabled)
    {
        elements.removeClass('hidden_by_rank');
    }
    else
    {
        elements.addClass('hidden_by_rank');
    }
    Request.send(data,'toggle_filter',function(response){

    });
});

Dashboard.activityView.on('switchChange.bootstrapSwitch', 'input[name=show_matches_in_search]', function(event, state){
    var ladderId = $(this).data('ladder_id');
    var button = $('#preferred_game_filter_'+ladderId);
    if(button.data('enabled'))
    {
        Dashboard.changeGameFilter(ladderId, false);
    }
    else
    {
        Dashboard.changeGameFilter(ladderId, true);
    }
});

Dashboard.changeGameFilter = function(ladderId, activate){
    var button = $('#preferred_game_filter_'+ladderId);
    if(activate)
    {
        button.addClass('on');
        button.data('enabled',true);
        $('.recent_match_searcher.game_ladder_id_'+ladderId).removeClass('hidden_by_game');
        $.post(siteUrl+'/matchmaking/game_filter_change',{game_id:ladderId,enabled:1});
    }
    else
    {
        Dashboard.playMatchContainer.removeClass('no_games');
        button.data('enabled',false);
        button.removeClass('on');
        $('.recent_match_searcher.game_ladder_id_'+ladderId).addClass('hidden_by_game');
        $.post(siteUrl+'/matchmaking/game_filter_change',{game_id:ladderId,enabled:0});
    }
};

Dashboard.matchmakingPane.on('change', '.player_preferred_restrictions .restriction input[type=checkbox]', function(e){
    e.preventDefault();
    let button = $(this);
    let setting = button.closest('.restriction');
    console.log(setting);

    let data = {
        ladder_id : setting.data('ladder_id'),
        setting : button.attr('name'),
        value : button.is(':checked')? 1 : 0
    };

    $.post(siteUrl+'/apiv1/update_match_search_restrictions', data, function(response){
         

    });

});

Dashboard.matchmakingPane.on('click', '.acceptable_tiers .tier_select', function(e){
    e.preventDefault();
    var button = $(this).find('input[name=tier_select]');
    var ladderId = button.data('ladder_id');
    var tierId = button.val();
    var direction = button.data('direction');
    var container = $(this).closest('.setting');
    var allLabels = container.find('label');
    var label = $(this);
    if(container.hasClass('disabled'))
    {
        return;
    }

    if(label.hasClass('selected'))
    {
        label.removeClass('selected');
        label.find(':input').removeClass('selected');
        tierId = null;
    }
    else
    {
        allLabels.removeClass('selected');
        allLabels.find(':input').removeClass('selected');
        label.addClass('selected');
        label.find(':input').addClass('selected');
    }

    container.addClass('disabled');
    $.post(siteUrl+'/match/match_tier_settings/'+ladderId,{action:'tier_preference',value:tierId, direction:direction})
        .done(function(response){
            if(response.success)
            {
            }
            else
            {
                alert('Error Saving');
            }
        }).fail(function(){
            alert('Error saving');
    }).always(function(){
        container.removeClass('disabled');
    });
});

Dashboard.activityView.on('click','.stats',function(e){
    e.preventDefault();
    var button = $(this);
    var ladderId = $(this).data('ladder_id');
    var url = siteUrl+'/match/activity/'+ladderId;

    var activityView = Dashboard.activityView;
    if(!activityView.data('eventsSet'))
    {
        activityView.data('eventsSet', true);
        activityView.on('click', '.back', function(e){
            e.preventDefault();
            matchModeManager.changeViewMode(MatchModeManager.modes.SEARCH);
            ChatActions.resizeOpenChats();
        });
    }
    if(button.hasClass('loading'))
    {
        return;
    }
    button.addClass('loading');
    var finished = function(){
        button.removeClass('loading');
    };
    $.post(url, {}).done(function(response){
        if(response.html)
        {
            if(matchModeManager.getCurrentViewMode() == MatchModeManager.modes.SEARCH ||
                matchModeManager.getCurrentViewMode() == MatchModeManager.modes.ACTIVITY_MODE
             )
            {
                matchModeManager.changeViewMode(MatchModeManager.modes.ACTIVITY_MODE);
                activityView.html(response.html);
            }
        }
    });
});

Dashboard.matchmakingPane.on('click', '.play', function(e){
    return;
    var gameFilters = Dashboard.gameFilters;
    if(gameFilters.hasClass('disabled'))
    {
        return;
    }
    if($(this).is(':animated'))
    {
        return;
    }
    $(this).fadeTo(500, 0, function(){
        $(this).fadeTo(500, 1);
    });
    gameFilters.addClass('game_select_mode');
});

Dashboard.gameFilters.on('click','.preferred_game_filter',function(e){
    Dashboard.startMatchWithPlayer = null;
    if(Dashboard.gameFilters.hasClass('disabled'))
    {
        alert('You are currently disconnected from the server');
        return;
    }
    // Dashboard.gameFilters.removeClass('game_select_mode');

    var myFilter = $(this).closest('.preferred_game_filter');

    if(e.which == 1)
    {
        MatchmakingPopup.showMatchSelectDialog(myFilter.data('id')).then(()=>{
            $.post(siteUrl+'/match/match_tier_settings/'+myFilter.data('id'), function(response){
                $('#match_settings_holder').append(response.html);
            });
        });
    }
    else if(e.which == 2)
    {
        // Dashboard.changeGameFilter(myFilter.data('id'), !myFilter.hasClass('on'));
    }

});
Dashboard.playMatchContainer.on('click', '.edit_preferred_games', function(e){
    e.preventDefault();
    Dashboard.retrieveNamedTab('game_preferences').trigger('activate');
});

$('#game_preferences_container').on('click', '.back_button', function(e){
    Dashboard.retrieveNamedTab('matchmaking').trigger('activate');
});


Dashboard.retrieveNamedTab('game_preferences').on('activate', function(e){
    var container = $('#game_preferences_container');
    container.addClass('loading');
    var finished = ()=>{
        container.removeClass('loading');
    };
    $.get(siteUrl+'/account/game-preferences', function(response){
        var data = $(response);
        var games = data.find('.preferred_games_container .game');
        $('#game_preferences_content').html(games)
        
        finished();
    },'html').error(function(){
        finished();
    })

});

$('#game_preferences_content').on('change', '.game_selection', function(e){
    
    var ladders = $('#game_preferences_content').find(':input');
    var data = ladders.serializeArray();
    data.push({'name':'json',value:1});
    data.push({'name':'update_preferred_games',value:1});
    Request.generalSend(data, siteUrl+'/account/game-preferences', function(response){


        return true;
    });
});

Dashboard.matchmakingPane.on('click','.game_settings_link',function(e){
    e.preventDefault();
    var button = $(this);
    var ladderId = button.data('ladder_id');
    var url = siteUrl+'/match/settings/'+ladderId;

    var activityView = Dashboard.activityView;
    if(!activityView.data('eventsSet'))
    {
        activityView.data('eventsSet', true);
        activityView.on('click', '.back', function(e){
            e.preventDefault();
            matchModeManager.changeViewMode(MatchModeManager.modes.SEARCH);
            ChatActions.resizeOpenChats();
        });
    }
    if(button.hasClass('loading'))
    {
        return;
    }
    button.add(container).addClass('loading');
    var finished = function(){
        button.add(container).removeClass('loading');
    };
    $.post(url, {}).done(function(response){
        if(response.html)
        {
            if(matchModeManager.getCurrentViewMode() == MatchModeManager.modes.SEARCH
            || matchModeManager.getCurrentViewMode() == MatchModeManager.modes.SELECT_OPTIONS)
            {
                matchModeManager.changeViewMode(MatchModeManager.modes.ACTIVITY_MODE);
                activityView.html(response.html);
            }
        }
        finished();
    }).fail(function(){
        finished();
    });

});

$('#visible_stream').draggable({
    axis:'x',
    handle:'.name',
    start: function(event, ui) {
        $(this).addClass('noclick');

    },
    stop: function(event, ui){
        $(this).removeClass('noclick');
    },
    drag: function( event, ui ) {
    }
}).resizable({
        ghost: true,
        handles: 'n, e, w, ne, nw',
        start: function(e, ui){
            $('#visible_stream').css({
                position: "relative !important",
                top: "0 !important",
                left: "0 !important"
            });
        },
        stop: function(e, ui){
            $('#visible_stream').css({
                position: "",
                top: "",
                left: ""
            });
        }
    }
);

$('.play_match_container, #current_matches_holder').on('click','.match_popout',function(e){
    e.preventDefault();
    var w = 600;
    var h = 800;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    closeMatchmakingArea();
    var newWindow = window.open(siteUrl+'/netplay?match_only&tab=battle', 'match_popup', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    newWindow.onbeforeunload = function(){
        $('.open_matchmaking_area').trigger('click');
    };
});

function closeMatchmakingArea(){
    Dashboard.battleTab.trigger('deactivate');
}

function openMatchmakingArea(){
    Dashboard.battleTab.trigger('activate');
};
$('#private_chats').draggable({
    axis:'x',
    start: function(event, ui) {
        $(this).addClass('noclick');
    },
    stop: function(event, ui){
        $(this).removeClass('noclick');
    },
    drag: function( event, ui ) {
        var displayedChat = $('.private_chat_area.float_displayed');
        var newTop = ui.position.top;
        var newLeft = ui.position.left;
        if(ui.position.left < 0)
        {
            newLeft = 0;
        }
        ui.position.left = newLeft;
        if(displayedChat.length)
            PrivateChatLoader.positionPrivateChat(displayedChat.data('chat'));

    }
}).data('default-height',280).data('default-width',320);

$('#faqs_link').click(function(){
    Popups.ajax(siteUrl+'/matchmaking/faq');
});

$('#release_notes').click(function(){
    Popups.ajax(siteUrl+'/matchmaking/release_notes');
});

$('.add_tournament').click(function(){
    Popups.ajax(siteUrl+'/matchmaking/edit_tournament',null,function(response){
    });
});

$('.start_donation_button button').click(function(){
    Popups.ajax(siteUrl+'/matchmaking/donate',null,function(response){
    });
});

Dashboard.playMatchContainer.on('click','.watch_stream',function(e){
    e.preventDefault();
    var button = $(this);
    if($(e.target).hasClass('username'))
    {
        return;
    }
    ChatActions.onStreamlinkClick(button.data('streamlink'),e);
});

$('.stream_container').on('updateStreams',function(e,streams, removeMissing){
    if(typeof removeMissing =='undefined')
    {
        removeMissing = false;
    }
    var container = $(this);
    var previousStreams = $('#stream_container ').find('.active_stream').not('.template');
    var streamHash = {};
    previousStreams.each(function(i,otherStream){
        otherStream = $(otherStream);
        if(!streamHash[otherStream.data('stream_id')])
        {
            streamHash[otherStream.data('stream_id')] = {};
        }
        streamHash[otherStream.data('stream_id')]['element'] = otherStream;
        streamHash[otherStream.data('stream_id')]['active'] = 0;
    });
    $.each(streams,function(i,stream){
        if(stream.is_online)
        {
            if(!streamHash[i])
            {
                streamHash[i] = {};
            }
            streamHash[i].active = 1;
        }
        container.trigger('updateStream',[stream]);
    });

    $.each(streamHash,function(i,stream){
        if(!stream.active)
        {
            var element = $(stream.element);
            element.remove();
        }
    });
    if(!container.is('#stream_container'))
    {
        return;
    }
    var activeStreams = container.find('.active_stream.is_online');
    if(activeStreams.length == 0)
    {
        container.removeClass('streams_visible');
        container.removeClass('count_visible');
    }
    else
    {
        container.findCache('.heading .count').val(activeStreams.length);
        container.addClass('streams_visible');
    }
}).trigger('updateStreams',[[]])
    .on('updateStream',function(e,stream){
    var container = $(this);
    var streamButton;
    var streamContainer = container.find('.active_stream_id_'+stream.id);
    if(streamContainer.length)
    {
        streamButton = streamContainer.find('.watch_stream');
    }
    else
    {
        streamContainer = $('.active_stream.template').clone();
        if(stream.loadStreamGameData)
        {
            streamContainer.data('loadStreamGameData', stream.loadStreamGameData);
        }
        streamContainer.removeClass('template');
        streamContainer.appendTo(container.find('.active_streams'));
        streamContainer.addClass('active_stream_id_'+stream.id);
        streamContainer.data('stream_id',stream.id);
        streamButton = streamContainer.find('.watch_stream');
        streamButton.data('stream_id',stream.id);

        var channelName = streamContainer.find('.channel_name');
        channelName.data('channel_name',stream.channel_name);
        channelName.text(stream.channel_name);
        if(stream.viewers)
        {
            streamContainer.find('.viewers').show().find('.count').text(stream.viewers);
            streamContainer.data('viewers',stream.viewers);
        }
        else
        {
            streamContainer.find('.viewers').hide();
        }
        if(stream.game_logo)
        {
            var image = streamContainer.find('.game_logo');
            image.attr('src',stream.game_logo);
            streamContainer.find('.game').show();
        }
        else
        {
            if(stream.game_title)
            {
                streamContainer.find('.game').show().find('.name').text(stream.game_title);
            }
            else
            {
                streamContainer.find('.game').hide();
            }
        }
    }
    if(stream.site_sponsored)
    {
        streamContainer.addClass('site_sponsored');
    }
    var streamlink = $('<a>').addClass('streamlink').attr('href','http://twitch.tv/'+stream.channel_name)
        .text('http://twitch.tv/'+stream.channel_name).data('stream',stream).data('literal','t~'+stream.channel_name);
    streamButton.data('streamlink',streamlink);
    streamButton.find('.stream_title').text(stream.title);
    var imageContainer = streamButton.find('.image_container');

    if(stream.player)
    {
        var user = Users.update(stream.player);
        streamButton.find('.user').html(user.createUsernameElement());
    }
    if(stream.preview_url)
    {
        imageContainer.removeClass('no_image');
        streamButton.find('.stream_logo').attr('src',stream.preview_url);
    }
    else
    {
        imageContainer.addClass('no_image');
    }
    if(stream.is_online)
    {
        streamContainer.addClass('is_online').removeClass('is_offline');
    }
    else
    {
        streamContainer.addClass('is_offline').removeClass('is_online');
    }
});

$('.stream_information').on('click', '.minimize', function(e){
    $(this).closest('#visible_stream').addClass('minimized');
}).on('click', '.restore', function(e){
    $(this).closest('#visible_stream').removeClass('minimized');
}).on('click', '.closing_x', function(e){
    var stream = $('#visible_stream');
    $('#bottom_dock').removeClass('streaming');

    stream.hide();
    stream.find('.embed_holder').empty();
    stream.find('.name').empty();
    stream.find('.stream_title').empty();
});

function activateStreamView(streamData)
{
    var response = streamData;
    var stream = $('#visible_stream');
    stream.show();
    $('#bottom_dock').addClass('streaming');
    if(response.channel_name)
    {
        stream.find('.name').text(response.channel_name);
    }
    else
    {
        stream.find('.name').text(response.channel_id);
    }
    stream.find('.stream_title').text(response.title);
    stream.find('.embed_holder').html(response.embed);
}

function loadStream(data)
{
    var stream = $('#visible_stream');
    $('#bottom_dock').addClass('streaming');
    stream.show();
    stream.addClass('loading');
    $.post(siteUrl+'/matchmaking/fetch_stream', data, function(response){
        stream.removeClass('loading');
        if(response.success)
        {
            activateStreamView(response.stream);
        }
    }).error(function(){
        $('#bottom_dock').removeClass('streaming');
        alert('There was an error loading the stream!');
        stream.removeClass('loading');
        stream.hide();
    });
}
if(top!=self){
    top.location.replace(document.location);
    alert("For security reasons, framing is not allowed; click OK to remove the frames.")
}

$('#stream_action').on('click', '.stream_open_embed', function(e){
    e.preventDefault();
    Dashboard.closeDeclickables();
    var literal = $(this).data('literal');
    var params = $(this).data('params');
    var data = {literal:literal,params:params};
    loadStream(data);
}).on('click', '.stream_follow_link', function(e){
    Dashboard.closeDeclickables();
});

dashboard.find('.tab_list').on('activate',function(){
    // ChatActions.resizeOpenChats();
});
Dashboard.allTabs.on('activate',function(){
    $(this).removeClass('notification');
});


var groupsTab = Dashboard.retrieveNamedTab('groups').on('activate',function() {
    var container = $(this).data('paneContainer');
    container.findCache('.group_content').empty();
    var loading = container.findCache('.loading').show();
    var finished = function(){
        loading.hide();
    };
    $.post(siteUrl+'/chats/groups',{},function(response){
        finished();
        if(response.html)
        {
            var content = container.findCache('.group_content').html(response.html);
            // ChatActions.resizeOpenChats();

        }
    }).error(function(){
        finished();
        alert('There was a loading error!');
    });
});

var streamsTab = Dashboard.retrieveNamedTab('streams').on('activate',function(){
    var container = $('.active_twitch_streams');
    container.find('.active_streams').empty();
    var loadingIndicator = container.find('.loading').css('opacity',1);
    var games = [
        {game:'Project M',logo:siteUrl+'/images/logos/game-filter-logos/project-m-mini.png'},
        {game:'Super Smash Bros. Brawl',logo:siteUrl+'/images/logos/game-filter-logos/brawl-mini.png'},
        {game:'Super Smash Bros. Melee',logo:siteUrl+'/images/logos/game-filter-logos/melee-mini.png'},
        {game:'Super Smash Bros. for Wii U',logo:siteUrl+'/images/logos/game-filter-logos/smash-wii-u-mini.png'},
        {game:'Super Smash Bros. for Nintendo 3DS',logo:siteUrl+'/images/logos/game-filter-logos/smash-3ds-mini.png'}
    ];


    var hitboxFilters = {
          liveonly:true,
        showHidden:false,
        game: 50024
    };

    // $.ajax({
    //     type: "GET",
    //     dataType: "json",
    //     data: hitboxFilters,
    //     crossDomain: true,
    //     url: 'https://api.hitbox.tv/media/live/list'
    // }).done(function(data){
    //     console.log('rawr');
    //     alert('rawr');
    // }).fail(function(data){
    //     alert(data);
    // });;
    var actions = [];

    var streamFilters = $('#stream_filters').empty();
    if(!streamFilters.data('events_loaded'))
    {
        
        $('.active_twitch_streams .active_streams').on('click','.active_stream',function(e){
            var watchStream = $(this).find('.watch_stream');
            ChatActions.onStreamlinkClick(watchStream.data('streamlink'),e);
        });
        streamFilters.data('events_loaded', true);
        streamFilters.on('click', '.stream_filter img', function(e){
           var filter = $(this).closest('.stream_filter');
            var streams = $('#tab-pane-streams .active_stream');
            var filtersStreams = $();
            streams.each(function(i, stream){
               stream = $(stream);
                if(stream.data('loadStreamGameData') == filter.data('loadStreamGameData'))
               {
                   filtersStreams = filtersStreams.add(stream);
               }
            });
            if(filter.hasClass('active'))
            {
                filter.removeClass('active');
                filtersStreams.hide();
            }
            else
            {
                filtersStreams.show();
                filter.addClass('active');
            }
        });
    }

    $.each(games,function(i,gameData){
        actions.push(gameData);
        $.ajax({
            url:'https://api.twitch.tv/kraken/streams',
            data:{game:gameData.game,client_id:'c06zk6927p510rjnvojnf89zhm754kg'},
            dataType: 'jsonp'
        }).done(function(response){
            var streams = response.streams;
            actions.pop();
            if(!actions.length)
            {
                loadingIndicator.css('opacity',0);
            }
            if(!streams.length)
            {
                return;
            }
            var filter = $('.stream_filter.template').clone().removeClass('template');
            filter.find('.game_logo').attr('src', gameData.logo);
            filter.appendTo('#stream_filters');
            filter.data('loadStreamGameData', gameData);
            filter.addClass('active');
            filter.find('.count').text(streams.length);


            $.each(streams,function(i,stream){
                var game = stream.game;
                var channel = stream.channel;
                var streamData = {};
                streamData.channel_name = channel.name;
                if(channel.logo)
                {
                    streamData.preview_url = channel.logo;
                }
                else
                {
                    streamData.preview_url = stream.medium;
                }
                streamData.title  = channel.status;
                streamData.id = channel.name;
                streamData.is_online = true;
                streamData.viewers = stream.viewers;
                streamData.game_title = stream.game;
                streamData.game_logo = gameData.logo;

                streamData.loadStreamGameData = gameData;

                container.trigger('updateStream',[streamData]);
                //sort

                return;
            });
            streams = container.find('.active_stream');
            container.addClass('streams_visible');
            streams.tsort({data:'viewers',order:'desc'});
        }).fail(function(response){
        });
    });
});


$('.fetch_stream').submit(function(e){
    e.preventDefault();
    var form = $(this);
    var data = {name:form.find('input[name=name]').val(),type:form.find('input[name=type]').val()};
    loadStream(data);
});

$('.close_current_chat').click(function(){
    let chat = ChatActions.getActiveChatContainer();
    if(!chat.data('chat'))
    {
        return;
    }
    let chatData = chat.data('chat').data();
    if(!chatData.name)
    {
        return;
    }
    Dashboard.ladderPopup('', 'Leave '+ Html.encode(chatData.name), {
        buttons: [
            {
                text: 'No',
                dismiss: true
            },
            {
                text: 'Leave',
                dismiss: true,
                click: (popup)=>{
                    ChatActions.exitCurrentChat();
                }
            }
        ]
    });


});

$('#chat_groups').on('click','.chat_tab .closing_x',function(e){
    e.stopPropagation();
    ChatActions.leaveChatRoom($(this).closest('.chat_tab').data('chat'));
}).on('scroll', function(e){
   loadFeaturedChats($(this));
});

$('#chat_tabs').on('scroll', function(e){

});

function loadFeaturedChats(chatGroups){
    if(!chatGroups)
    {
        chatGroups = $('#chat_groups');
    }
    if(!chatGroups.length || chatGroups.data('scrollLoading') || chatGroups.data('scrollLoaded'))
    {
        return;
    }
    chatGroups.data('scrollLoading', true);
    $.post(siteUrl+'/chats/featured-chats', function(response){
        if(response.featured_chats)
        {
            $.each(response.featured_chats, function(index, chatInfo){
                let chat = new ChatRoom(chatInfo);
                chat.addToFeaturedList();
            });
        }
        if(response.ladder_chats)
        {
            console.log("has ladder chats");
            $.each(response.ladder_chats, function(index, chatInfo){
                let chat = new ChatRoom(chatInfo);
                chat.addToFeaturedList();
            });
        }

    });
}

var body = $('body');
$('.change_chat, #chat_select').on('click', function(e){
    body.toggleClass('sidebar-open');
}).swipe({
    swipeStatus:function(event, phase, direction, distance, duration, fingers)
    {
        if(direction == "up" || direction == "down")
        {
            return false;
        }
        if(distance > 40 && phase == "move")
        {
            if(direction == "left")
            {
                ChatActions.changeMainChatRight();
            }
            if(direction == "right")
            {
                ChatActions.changeMainChatLeft();
            }
            return false;
        }
    }
});
$("#sidebar").swipe({
    swipeStatus:function(event, phase, direction, distance, duration, fingers)
    {
        if(direction == "up" || direction == "down")
        {
            return false;
        }
        if(distance > 40 && phase == "move")
        {
            if(direction == "right")
            {
                body.addClass("sidebar-open");
            }
            if(direction == "left")
            {
                body.removeClass("sidebar-open");
            }
            return false;
        }
    }
});

if(isInLadder && !matchOnlyMode)
{
    Dashboard.mainChatHolderTemplate.data('chat',Dashboard.mainChatHolderTemplate.find('.chat_container').data('chat',Dashboard.mainChatHolderTemplate.find('.chat_container'))      );
    Dashboard.mainChatHolderTemplate.data('userlist',Dashboard.userlistSide.find('.chat_room_user_list.template_visible')   ) ;
    Dashboard.mainChatHolderTemplate.data('userlist',Dashboard.mainChatHolderTemplate.data('chat').data('userlist'));
    Dashboard.mainChatHolderTemplate.data('chat').data('userlist',Dashboard.mainChatHolderTemplate.data('userlist'));
}

$('#chat_select').change(function(e){
    var selected = $(this).find(':selected');
    ChatActions.changeMainChat(selected.data('button'));
});


$('.user_search_form').submit(function(e){
    e.preventDefault();
    var action = $(this).attr('action');
    var searchName = $(this).find('input[name=search]').val();
    var data = $(this).serializeArrayCsrf();
    if(myUser.is_mod)
    {
        data.push({name:'banned_users',value:1});
    }
    data.push({name:'json',value:1});
    var formResults = $(this).closest('.search_dropdown').find('.results_area');
    var loading = $(this).closest('.search_dropdown').find('.loading').show();
    formResults.hide();

    $.get(action,data,function(response){
        if(response.success)
        {
            formResults.html(response.html);
            formResults.show();
        }
        loading.hide();
    }).error(function(){
        loading.hide();
    });
});


function getListLoader()
{
    return $('#loading_list').clone().removeAttr('id').removeClass('template');
}

$('#bottom_dock_left').on('click','.private_window',function(e){
    if(!$(this).closest('noclick').length)
    {
        e.stopPropagation();
        return PrivateChatLoader.togglePrivateChat($(this));
    }
}).on('click','.private_window .closing_x',function(e){
    e.stopPropagation();
    PrivateChatLoader.removePrivateChat($(this).closest('.private_window'));
});
$('#private_chat_listing').on('click','.private_chat_listing',function(){
    return PrivateChatLoader.togglePrivateChat($(this));
});




$('.update_list').on('mouseenter','.time',function(){
    var timestamp = $(this).data('timestamp');
    $(this).text(DateFormat.daySmall(timestamp));
}).on('mouseleave','.time',function(){
    var timestamp = $(this).data('timestamp');
    $(this).text(DateFormat.small(timestamp));
});

Dashboard.mainUserInfo.on('click','.my_history_with_other',function(e){
        var playerId = $(this).closest('.my_history_with_other').find('input[name=player_id]').val();
        var url = siteUrl+'/match/against/'+playerId;
        $(this).trigger('matchHistory',[url]);

    }).on('click','.recent_matches',function(){
        var playerId = $(this).find('input[name=player_id]').val();
        var url = siteUrl+'/match/recent_matches/id/'+playerId;
        $(this).trigger('matchHistory',[url]);

}).data('views',[
    'match_history_view',
    'chat_controls_view',
    'summary_view',
    'notes_view'
]).on('switchView',function(e,newView){
    var container = $(this);
    e.stopImmediatePropagation();
    container.removeClass(container.data('views').join(' ')).addClass(newView);
}).on('click','.toggle_controls', function(e){
    e.preventDefault();
    Dashboard.mainUserInfo.trigger('switchView','chat_controls_view');
}).on('click','.back_to_summary',function(){
    Dashboard.mainUserInfo.trigger('switchView','summary_view');
}).on('click','.user_notes', function(){
    Dashboard.mainUserInfo.trigger('switchView','notes_view');
    var container = Dashboard.mainUserInfo.findCache('.notes_display');
    container.addClass('loading');

    Dashboard.mainUserInfo.findCache('.notes_content').empty();
    $.post(siteUrl+'/matchmaking/render_notes/'+$(this).data('player-id'))
    .done(function(response){
        if(response.html)
        {
            var notesContent = Dashboard.mainUserInfo.findCache('.notes_content').html(response.html);
            notesContent.find('textarea').first().focus();
            new PostManager(notesContent.find('.dynamic-posts'));

        }
    })
    .fail(function(){
        alert('Error loading notes');
    })
    .always(function(){
        container.removeClass('loading');
    });
}).on('matchHistory',function(e,url){
    Dashboard.mainUserInfo.trigger('switchView',['match_history_view']);

    var matchHistoryDisplay = $('#match_history_display');
    matchHistoryDisplay.slideDown();
    matchHistoryDisplay.removeClass('displayed');
    matchHistoryDisplay.addClass('loading');
    matchHistoryDisplay.find('.history_content').empty();

    $.post(url,function(response){
        if(response.success)
        {
            matchHistoryDisplay.removeClass('loading');
            matchHistoryDisplay.addClass('displayed');
            matchHistoryDisplay.find('.history_content').html(response.html);

            if(myUser.is_subscribed)
            {
                matchHistoryDisplay.find('.match-history-table').loadMoreable({parent : matchHistoryDisplay});
            }
            setTimeout(function(){

                if(!Dashboard.isTiny())
                {
                    Dashboard.keepContainerOnScreen(Dashboard.userInfoContainer);
                }
            },601);
        }
        else
        {
            matchHistoryDisplay.removeClass('loading').addClass('error');
        }
    }).error(function(){
        matchHistoryDisplay.removeClass('loading').addClass('error');
    });
});


var disputesContainer = Dashboard.disputesContainer;
disputesContainer.on('click','.back_button',function(e){
    disputesContainer.removeClass('loading match_detail_view');
});

$('.user_info').on('click','.match',function(){
    if(!isInLadder)
    {
        return;
    }
    var matchId = $(this).find('input[name=match_id]').val();
    if($(this).is('a'))
        return;
    if(!matchId)
    {
        matchId = $(this).parent().find('input[name=match_id]').val();
    }
    if(!matchId)
    {
        return;
        // alert('fail');
    }
    MatchSummary.openMatchInNewWindow(matchId);
});

$('#disputes, .match_summary').on('click','.selectable.feedback',function(e){
    var summary = $(this).closest('.match_summary');
    var matchId = summary.find('input[name=match_id]').val();
    alert('Remind anther to fix this');
});

$('#current_matches_holder, .match_summary').on('click','form.button_talker button',function() {
    $(this).addClass("clicked", true);
});

Dashboard.userInfoContainer.on('click', '.closing_x', function(){
    var container = $(this);
    
    if(container.closest('#user_info_pane').length)
    {
        LadderHistory.history.back();
        return;
    }
    Dashboard.userInfoContainer.trigger('notClicked');
});

let currentMatchesHolder = $('#current_matches_holder');
ChatActions.attachUniversalChatActions(currentMatchesHolder);

currentMatchesHolder.on('click','.current_match_container .control-buttons .closing_x',function(){
    var matchContainer = $(this).closest('.current_match_container');
    var matchId = matchContainer.find('input[name=match_id]').val();
    var data = {match_id:matchId};
    Request.send(data,'finished_chatting_with_match');
    LadderInfo.forceRemove('currentMatches',matchId);
}).on('keyup','.chat_input', function(e){
    var chatInput = $(this);
    var text = chatInput.val();
    var isTyping = chatInput.data('typing');
    if(chatInput.data('typing') && !text.length)
    {
        chatInput.data('typing',false);
        ChatActions.sendChatState(chatInput);
    }
    else if(!chatInput.data('typing') && text.length)
    {
        chatInput.data('typing',true);
        ChatActions.sendChatState(chatInput);
    }
}).on('click', '.premade_response', function(e){
    var button = $(this);
    button.prop('disabled', true);
    Dashboard.sleep(300).then(()=>{
        button.prop('disabled', false);
    });
    ChatActions.sendChat($(this));
});

$(document).on('click','.chatlink',function(e){
    var button = $(this);
    if(button.hasClass('unclickable'))
    {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    var chat = null;
    if(button.data('chatlink'))
        chat = button.data('chatlink');
    else
        chat = $(this).text();

    console.log(chat);
    if(chat)
        ChatActions.joinChatRoom(chat,null,true);
});

var userInfoDeclickableFunction = function(e){
    var container = $(this);
    container.hide().data('canBeUnclicked',false);
    container.trigger('declick');
    if(container.data('user'))
    {
        var user = container.data('user');
        if(user.peer)
        {
            user.peer = null;
        }
    }
    if(container.data('request'))
    {
        container.data('request').abort();
    }
};
Ladder.declickables.push(Dashboard.userInfoContainer.on('notClicked',userInfoDeclickableFunction));
Ladder.declickables.push($('#chat_popup_card').on('notClicked',userInfoDeclickableFunction));
Ladder.declickables.push(
    $('#stream_action').on('notClicked',function(e){
        var element = $(this);
        if(element.data('justOpened'))
        {
            element.data('justOpened',false);
        }
        else
        {
            element.data('canBeUnclicked',false);
            element.fadeOut('fast');
        }
    })
);
Ladder.declickables.push(
    $('#sidebar').on('notClicked', function(e, original){
        if(original)
        {
            var originalTarget = $(original.target);
            if(originalTarget.hasClass('change_chat') || originalTarget.hasClass('change_chat_bars')
                || originalTarget.is('#chat_select'))
            {
                return;
            }
        }
        body.removeClass('sidebar-open');
    }).data('canBeUnclicked', true)

);
Dashboard.usernameClick = function(button,e,clickedPosition)
{
    var username;
    if(button.data('username'))
        username = button.data('username');
    else
        username = button.text();
    var openChat = false;

    openChat = true;

    var data={username:username};
    if(button.data('id'))
    {
        data.id = button.data('id');
    }

    var infoContainer = Dashboard.userInfoContainer;
    var myInfo;

    infoContainer.css('display','');
    infoContainer.addClass('loading visible');
    infoContainer.detach();
    if(Dashboard.isTiny())
    {
        infoContainer.addClass('is_tiny');
    }
    else
    {
        infoContainer.removeClass('is_tiny');
    }

    var user;
    if(data.id)
    {
        user = Users.retrieveById(data.id);
    }
    else
    {
        user = Users.retrieveByUsername(username);
        if(!user.username)
        {
            user.username = username;
        }
    }
    if(!user.username && data.username)
    {
        user.username = data.username;
    }


    if(user === myUser)
    {
        myInfo = true;
        infoContainer.addClass('my_info');
    }
    else
    {
        myInfo = false;
        infoContainer.removeClass('my_info');
    }

    var mainInfoContainer = Dashboard.mainUserInfo.addClass('visible');//.removeClass('visible');

    mainInfoContainer.trigger('switchView',['summary_view']);

    var profileLink = infoContainer.findCache('.profile_link').attr('href', user.getProfileUrl());

    profileLink.toggleClass('is_subscribed', user.is_subscribed);

    var usernameContainer = user.updateUserElements(infoContainer.findCache('.username'));

    infoContainer.findCache('.rating_container').hide();
    infoContainer.findCache('.matches_played').text('loading...');
    infoContainer.findCache('.location').text('loading...');
    infoContainer.findCache('.chat_holder').hide();
    infoContainer.findCache('.recent_disputes').hide();
    infoContainer.findCache('.now_playing_container').hide();
    
    infoContainer.findCache('.distance_container').hide();
    infoContainer.findCache('.away_message').removeClass('active');
    infoContainer.findCache('.display_name').hide();
    infoContainer.findCache('.the_notes').text('');
    infoContainer.findCache('.local_time').text('');
    infoContainer.findCache('.has_reported_match_behavior').removeClass('active toxic');
    infoContainer.findCache('.reported_match_behavior').removeClass('toxic good');


    infoContainer.findCache('.failed_request').hide();
    var gameInfoHolder = infoContainer.findCache('.game_info_holder').data('populated',false).empty()
        .removeClass('game_select_mode');

    if(!gameInfoHolder.data('clickEvents'))
    {
        gameInfoHolder.data('clickEvents', true);
        gameInfoHolder.on('click', '.game_display', function(e){
            if(infoContainer.hasClass('my_info') || !gameInfoHolder.hasClass('game_select_mode'))
            {
                return;
            }
            var ladderId = $(this).data('game').id;
            MatchmakingPopup.showMatchSelectDialog(ladderId);
            Dashboard.matchmakingPaneShouldGetFocusIfNeeded();
            Dashboard.closeDeclickables();
        });
    }

    var x = e.pageX;
    var y = e.pageY;


    var infoContainerPageView = null;

    if(user.id)
    {
        infoContainer.addClass('has_user_id');
    }
    else
    {
        infoContainer.removeClass('has_user_id');
    }

    var reappend = function(){};

    if(false && isInLadder && Dashboard.isTiny())
    {
        infoContainerPageView = true;
        infoContainer.css('left','');
        infoContainer.css('top','');
        reappend = function(){
            infoContainer.appendTo($('#user_info_pane'));
        };
        $('#user_info_button').trigger('click');
        infoContainer.data('canBeUnclicked',false);
    }
    else
    {
        infoContainerPageView = false;
        reappend = function(){
            infoContainer.appendTo($('body'));
        };
        // LadderHistory.history.pushState({'action':'closeDeclickables',type:'userAction'},null,'?user_info_popup');
        infoContainer.data('canBeUnclicked',true);
    }

    infoContainer.data('username',username);


    var challengeHolder = infoContainer.findCache('.challenge_holder').hide();
    if(infoContainer.data('request'))
    {
        var requestObject = infoContainer.data('request');
        infoContainer.data('request',null);
        requestObject.abort();
    }
    var chatMessage = button.closest('.chat_message');
    if(chatMessage.length)
    {
        if(chatMessage.data('message_id'))
        {
            data.message_id = chatMessage.data('message_id');
        }

    }
    var chat = ChatActions.getActiveChatContainer();
    if(chat)
    {
        if(chat.data('chat').data('chat_room_id'))
        {
            data.chat_room_id = chat.data('chat').data('chat_room_id');
        }
    }
    if(!data.chat_room_id && button.data('chat_room_id'))
    {
        data.chat_room_id = button.data('chat_room_id');
    }
    var chatControlButtons = infoContainer.findCache('.cool_chat_controls').findCache('button');
    var chatControlsReasonForm = infoContainer.findCache('.chat_controls_reason');

    var endChatControls = function(){
        chatControlButtons.prop('disabled',false).removeClass('active');
        chatControlsReasonForm.removeClass('active');
    };
    endChatControls();

    if(!infoContainer.data('basicClickEvents'))
    {
        infoContainer.data('basicClickEvents',true);
        infoContainer.on('click', '.user_notes_profile', function(e){
           e.preventDefault();
        });
        infoContainer.find('.relationship_buttons').on('click',
            '.chat_mod_controls button, .chat_admin_controls button, .modship_button, .mod_controls .btn, .relationship_button',function(e){
                var button = $(this);
                var id = button.data('player-id');
                var type = button.data('type');
                var chat_id = button.data('chat-id');
                var chat = button.data('chat');
                var chatContainer = button.data();
                var data = {player:id,chat_room_id:chat_id,type:type};

                var controlsType = button.closest('.chat_mod_controls, .chat_admin_controls').length?'chat_controls':'mod_controls';

                var muteTimer;
                var showTimerOptions = function(timerField,data){
                    chatControlButtons.removeClass('active');
                    button.addClass('active');
                    chatControlsReasonForm.addClass('active');
                    chatControlsReasonForm.off('submit');

                    var units = {
                      days: chatControlsReasonForm.findCache('input[name=days]').val(0),
                      hours: chatControlsReasonForm.findCache('input[name=hours]').val(0),
                      minutes: chatControlsReasonForm.findCache('input[name=minutes]').val(5),
                      seconds: chatControlsReasonForm.findCache('input[name=seconds]').val(0)
                    };

                    var reason = chatControlsReasonForm.find('input[name=reason]');
                    chatControlsReasonForm.on('submit',function(e){
                        e.preventDefault();
                        data[timerField] = units;
                        data.reason = reason.val()?reason.val():'';

                        $.each(units, function(i, unit){
                            units[i] = $(unit).val();
                        });

                        reason.val('');
                        button.removeClass('active');
                        chatControlsReasonForm.removeClass('active');
                        chatControlButtons.prop('disabled',true);
                        sendChatCommand(data);
                    });
                };
                if(button.data('timer_field'))
                {
                    return showTimerOptions(button.data('timer_field'),data);
                }
                else
                {
                    sendChatCommand(data);
                }
                function sendChatCommand(data){
                    Request.send(data,controlsType,function(response){
                        endChatControls();
                        if(response.success)
                        {
                            var opposite;
                            if(controlsType == 'chat_controls')
                            {
                                opposite = button.closest('.chat_mod_controls, .chat_admin_controls').find('.'+button.data('opposite'));
                            }
                            else if(controlsType == 'mod_controls')
                            {
                                opposite = button.closest('.modship, .mod_controls, .relationship').find('.'+button.data('opposite'));
                            }
                            else
                            {
                                alert('O.O..');
                            }
                            opposite.show();
                            if(type == 'ignore_user')
                                ignoreList[id] = true;
                            else if(type == 'unignore_user')
                                delete ignoreList[id];

                            if(type == 'add_friend' || type == 'remove_friend')
                            {
                                Dashboard.friendListButton.trigger('updateFriend',[response.friend]);
                            }
                            button.hide();
                            if(response.message)
                            {
                                ChatActions.addNotificationToChat(null,response.message);
                            }
                        }
                        else
                        {
                            if(response.message)
                            {
                                alert(response.message);
                                ChatActions.addNotificationToChat(null,response.message);
                            }
                            else
                            {
                                alert('Whatever happened was not allowed!');
                            }
                        }
                    });
                }
            });

        infoContainer.findCache('.report_user').click(function(e){
            Dashboard.closeDeclickables();
            /* Get chat context */
            reportToMods('Reporting '+$(this).data('username'),null,$(this).data('context'));
        });

    }

    infoContainer.findCache('.open_private_chat').on('click',function(e){
        e.preventDefault();
        var id = $(this).data('player-id');
        var username = $(this).data('username');
        var payload = {username:username, id:id};
        if(!id)
        {
            alert('id not found for some reason..');
            return;
        }
        if(isInLadder)
        {
            PrivateChatLoader.openPrivateChat(payload).load();
            Dashboard.closeDeclickables();
        }
        else
        {
            window.location = siteUrl+'/netplay?send_message='+id;
        }
    });

    Dashboard.UserInfo.updateContainer(user, data);
    reappend();
    if(!infoContainerPageView)
    {
        if(Dashboard.mainUserInfo.hasClass('summary_view'))
        {
            Dashboard.keepContainerOnScreen(infoContainer,{x:x,y:y});

        }

    }
    //Find context information
    var userInfoXhr = Request.post(siteUrl+'/matchmaking/user',data,function(response){
        if(response.success)
        {
            var user = Users.update(response.user);
            if(userInfoXhr.cancelled)
            {
                return;
            }
            button.data('username', user.username);
            infoContainer.findCache('.game_info_holder').data('populated', false);


            infoContainer.removeClass('loading');
            $('#ping_test_result').removeClass('visible');

            Dashboard.UserInfo.updateContainer(user, response);


            if(false && isInLadder && user.id != myUser.id)
            {
                var initPingTest = {
                    ping_player:{
                        player_id:user.id
                    }
                };
                Dashboard.performOpenSearchUpdate(initPingTest);
            }

            infoContainer.findCache('.data-username').data('username',user.username);

            if(response.chat_room)
            {
                var holdsChatIdData = infoContainer.findCache('.holds_chat_id_data');
                holdsChatIdData.data('chat-id',response.chat_room.id);
                if(chat)
                {
                    holdsChatIdData.data('chat',chat);
                }
            }
            else
                infoContainer.findCache('.holds_chat_id_data').data('chat-id',null);

            mainInfoContainer.addClass('visible');
            if(!infoContainerPageView)
            {
                Dashboard.keepContainerOnScreen(infoContainer,{x:x,y:y});
            }
        }
        else
        {
            if(userInfoXhr.cancelled)
            {
                return;
            }
            if(response.serverError)
            {
                //closeDeclickables();
            }
            else
            {
            }
            if(infoContainer.data('request')) //Request failed without the user cancelling it
            {
                infoContainer.removeClass('loading');
                Dashboard.mainUserInfo.removeClass('visible');
            }
            if(response.user === false)
            {
                infoContainer.findCache('.failed_request').show();
            }
            ElementUpdate.flair(infoContainer,{});
        }
    });
    userInfoXhr.realAbort = userInfoXhr.abort;
    userInfoXhr.abort = function(){
      userInfoXhr.cancelled = true;
    };
    infoContainer.data('request',userInfoXhr);
};

$(document).on('click','.username, .online_user',function(e,clickedPosition){
    var button = $(this);
    if(button.hasClass('unclickable'))
    {
        return;
    }
    if(button.data('userElement'))
    {
        button = button.data('userElement');
    }
    else if(button.hasClass('online_user'))
    {
        var innerButton = button.find('.username');
        if(innerButton.length)
        {
            button.data('userElement', innerButton);
            if(!innerButton.data('username'))
            {
                innerButton.data('username',innerButton.text());
            }
            button = innerButton;
        }
    }
    if(!button.data('username'))
    {
        button.data('username', button.text());
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    if(clickedPosition){
        e.pageX = clickedPosition.x;
        e.pageY = clickedPosition.y;
    }

    Dashboard.sleep(25).then(() => {
        return Dashboard.usernameClick(button,e,clickedPosition);
    });
});

$(document).on('mouseenter','.username',function(e){
    var element = $(this);
    var username = element.data('username');
    if(!username)
    {
        return;
    }
    if(username)
    {
        ChatActions.highlightUsernameInChats(username);
        element.on('mouseleave',function(e){
            ChatActions.removeUsernameHighlightInChat(username);
        });
    }
});

Dashboard.recentMatchSearchers.data('lastActiveSelection', null);
Dashboard.recentMatchSearchers.on('click', '.recent_match_searcher', function(e){
    let bypassTargets = ['clickable_logo', 'sticky_search'];
    let target = $(e.target);
    let recentMatchSearcher = $(this);
    if(!target.length)
    {
        return;
    }
    for(let i = 0; i < bypassTargets.length; i++)
    {
        if(target.hasClass(bypassTargets[i]))
        {
            return;
        }
    }

    if(target.parent().hasClass('click_shortcuts'))
    {
        var player = $(this).closest('.player,.online_user,.other_user_info');
        var match = player.data('match');
        if(!match)
        {
            alert('Error!');
        }
        var player_id = match.player1.id;
        var match_id = match.id;

        if(target.hasClass('cancel_shortcut'))
        {
            recentMatchSearcher.addClass('loading');
            target.prop('disabled', true);
            endMatchmaking(match_id).then(function(response){
                target.prop('disabled', false);
                recentMatchSearcher.removeClass('loading');
            });
        }
        if(target.hasClass('challenge_shortcut'))
        {
            recentMatchSearcher.addClass('loading');
            target.prop('disabled', true);
            MatchmakingPopup.challengeSearch(player,null,null,null,match_id).then(function(){
                target.prop('disabled', false);
                recentMatchSearcher.removeClass('loading');
            }).catch(function(response){
                target.prop('disabled', false);
                recentMatchSearcher.removeClass('loading');
            });
        }
        if(target.hasClass('profile_shortcut'))
        {
            Dashboard.usernameClick(recentMatchSearcher.find('.user_information_wrapper .username:first'),e);


        }
        e.stopImmediatePropagation();
        return;
    }


    if(!Dashboard.recentMatchSearchers.data('lastActiveSelection'))
    {
        recentMatchSearcher.addClass('click_shortcuts_active');
        Dashboard.recentMatchSearchers.data('lastActiveSelection', recentMatchSearcher);
    }
    else
    {
        Dashboard.recentMatchSearchers.data('lastActiveSelection').removeClass('click_shortcuts_active');

        if(Dashboard.recentMatchSearchers.data('lastActiveSelection')[0] === recentMatchSearcher[0])
        {
            Dashboard.recentMatchSearchers.data('lastActiveSelection', null);
            // Dashboard.recentMatchSearchers.data('lastActiveSelection').removeClass('click_shortcuts_active');
            // Dashboard.recentMatchSearchers.data('lastActiveSelection', null);
        }
        else
        {
            recentMatchSearcher.addClass('click_shortcuts_active');
            Dashboard.recentMatchSearchers.data('lastActiveSelection', recentMatchSearcher);
        }
    }
    // e.stopImmediatePropagation();
});

Dashboard.recentMatchSearchers.on('click','.challenged',function(){
    var player = $(this).closest('.player,.online_user,.request,.other_user_info');
    var player_id = player.find('input[name=player_id]').val();
    var data = {json:1,other_player_id:player_id};

    var challenge = player.find('.challenge');
    var challenged = player.find('.challenged');
    var parent = $(this).closest('.challenge_holder_parent');
    challenge.addClass('active').show();
    challenged.removeClass('active').hide();

    Request.send(data,'cancel_challenge',function(response){
        if(response.success)
        {
            if(response.challenges_removed)
            {
                $.each(response.challenges_removed,function(i,challenge_id){
                    LadderInfo.forceRemove('awaitingReplies',challenge_id);
                });
            }
            $('.pending_reply').not('.template').each(function(i,element){
                var id = $(element).find('input[name=player_id]');
                var match_id = $(element).find('input[name=match_id]');
                if(id == player_id)
                {
                    LadderInfo.forceRemove('awaitingReplies',match_id);
                }
            });
            if(response.error)
            {
                alert(response.error);
                challenge.removeClass('active').hide();
                challenged.addClass('active').show();
            }
            else
            {
            }
            if(response.message)
            {
            }
        }
        else
        {
            challenge.removeClass('active').hide();
            challenged.addClass('active').show();
        }
        return;
    });
    addGaEvent('matchmaking','unchallenging');
});


$.fn.siteLinker = function(){
    var $this = this;
    return $this.each(function(){
        $(this).html(SiteLinker.link($(this).html()));
    });
};


$('#report_to_mods_popup_button').click(function(e){
    e.preventDefault();
    reportToMods();
});

function reportToMods(title,description,extraData){
    var href = siteUrl+'/bugs/submit?type=4';
    extraData.json = true;
    if(title)
    {
        href+='&title='+title;
    }
    Popups.ajax(href,extraData,function(response,content){
        var form = content.find('form');
        form.submit(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            var data = form.serializeArray();
            var submitButtons = form.find(':submit');
            submitButtons.prop('disabled',true);
            var success = function(){
                submitButtons.prop('disabled',false);
            };
            var fail = function(response){
                submitButtons.prop('disabled',false);
                if(response.error)
                {
                    alert(response.error);
                }
            };
            data.push({name:'json',value:'1'});
            $.post(form.attr('action'),data,function(response){
                if(response.success)
                {
                    openPopup($(response.html));
                    success();
                }
                else
                {
                    fail(response);
                }
            });
        });
    });
}

$('#region_link').on('click',function(e){
    e.preventDefault();
    showRegionsDialog();
});

function fancyConfirm($content,title,callback) {
    var ret = false;
    var fancyboxContent = null;
    $.fancybox({
        title: title,
        modal : false,
        content : $content.html(),
        onComplete : function() {
            fancyboxContent = $('#fancybox-content');
            $('#fancybox-content .cancel').click(function() {
                ret = false;
                jQuery.fancybox.close();
            });
            $('#fancybox-content .confirm').click(function() {
                ret = true;
                jQuery.fancybox.close();
            });
        },
        onClosed : function() {
            callback(fancyboxContent,ret);
        }
    });
}

$('#profile_link').click(function(){
    openPopup($('.popups .profile_popup').clone(),null,true);
});

$('.main_info input[name=location]').on('input',function(){
    $(this).addClass('unsaved');
});

$('.edit_away_message').click(function(){
    Dashboard.closeDeclickables();
    var popup = $('.popups .away_message_popup').clone();
    let input = popup.find('input[name=away_message]');
    Dashboard.ladderPopup(popup, 'Set Your Status', {
        buttons: [
            {
                text: 'Close',
                dismiss: true
            },
            {
                text: 'Update',
                dismiss: false,
                click: (popup)=>{
                    var message = input.val();
                    $('.popups .away_message_popup').find('input[name=away_message]').val(message);
                    var data = {away_message:message};
                    Request.send(data,'change_wants_to_play',function(response){});
                    popup.dismiss('Changes Saved!');
                }
            }
        ]
    });
});

function endMatchmaking(matchId){
    var data = {match_id:matchId};
    return Request.send(data,'end_matchmaking',function(){
//			return true;
    });
}


if(stupidMatchmakingOverride)
{
    new MatchmakingPopup(Dashboard.gameFilters,2, true);
}

Dashboard.userInfoContainer.on('click',function(e){

    if($(this).data('gameIcons'))
    {
        var target = $(e.target);
        if(target.hasClass('game_icon'))
        {
            return;
        }
        else
        {
        }
        $(this).data('gameIcons').popover('hide');
    }
});

$('.request_list, .other_user_info').on('click','.challenge, .no_challenges',function(e){
    e.stopImmediatePropagation();
    var player = $(this).closest('.player,.online_user,.other_user_info');
    var match = player.data('match');
    if(match)
    {
        var player_id = match.player1.id;
        var match_id = match.id;
    }
    else
    {
        player_id = $(this).find('input[name=player_id]').val();
    }
    var parent = $(this).closest('.challenge_holder_parent');
    if(player_id == myUser.id)
    {
        parent.addClass('loading');
        endMatchmaking(match_id).then(function(response){
            parent.removeClass('loading');
        });
        return;
    }

    var button = $(this);

    if(!$(this).hasClass('active') && ( player.hasClass('online_user') || player.hasClass('other_user_info') ) )
    {
        Dashboard.startMatchWithPlayer = player;
        $('.matchmaking_popup .matchmaking_message').hide();
        if($(this).closest('#user_info').length)
        {
            var gameInfoHolder = Dashboard.userInfoContainer.find('.game_info_holder');
            if(!gameInfoHolder.hasClass('game_select_mode'))
            {
                gameInfoHolder.prepend('<span class="heading">Select A Game</span>');
                gameInfoHolder.addClass('game_select_mode');
            }
            if(gameInfoHolder.find('.game_display').length == 1)
            {
                gameInfoHolder.find('.game_display').trigger('click');
                return;
            }
            return;
        }
        return;
    }
    else
    {
        parent.addClass('loading');

        MatchmakingPopup.challengeSearch(player,null,null,null,match_id).then(function(){
            parent.removeClass('loading');
        }).catch(function(){
            parent.removeClass('loading');
        });
    }
});

function openPopup($innerContent,title,showCloseButton,callback)
{
    if (showCloseButton == null)
    {
        showCloseButton = true;
    }
    $.fancybox({
        'content' : $innerContent,
        'showCloseButton' :showCloseButton,
        'onComplete':function(element){
            var input = $('#fancybox-content').find('input[type=text]:first');
            if(input.length)
            {
                input.focus();
            }
            if(callback)
            {
                callback(element);
            }
        }
    });
}

setInterval(function(){
    if(Dashboard.directChatsTab.hasClass('active'))
    {
        Dashboard.directChatsTab.trigger('timestampUpdate');
    }
    if(BrowserNotification.browserHasFocus)
    {
        var userlist = ChatActions.getActiveChatContainerUserlist();
        if(userlist)
        {
            userlist.trigger('updateUserlistOrder');
        }
    }
},60000);

Dashboard.userlistSide.on('updateUserlistOrder','.chat_room_user_list',function(e){
    var userlist = $(this);
    if(userlist.length)
    {
        var users = userlist.data('userMap');
        if(!users)
        {
            return;
        }
        if(userlist.data('sections'))
        {
            $.each(userlist.data('sections'), function(i, section){
                var nodes = [];
                $.each(section.users,function(i,userlistElement){
                    if(userlistElement.element)
                    {
                        nodes.push(userlistElement.element[0])
                    }
                });
                if(nodes.length)
                {
                    ChatActions.sortUserList(nodes);
                }
            });
        }



    }
});


Dashboard.activeRegionButton = null;
Dashboard.showAllRegionButton = null;

Dashboard.getActiveRegionButton = function(){
    if(Dashboard.activeRegionButton)
    {
        return Dashboard.activeRegionButton;
    }
    else
    {
        return Dashboard.activeRegionButton = $('#user_list_side').find('.region_button.active');
    }
};
function clickedRegionListButton($button)
{
    if(!Dashboard.showAllRegionButton)
    {
        Dashboard.showAllRegionButton = $('.region_button.show_all');
    }
    if($button.hasClass('active') && !$button[0] === Dashboard.showAllRegionButton)
    {
        $button.removeClass('active');
        Dashboard.showAllRegionButton.addClass('active').trigger('activated');
    }
    else
    {
        Dashboard.getActiveRegionButton().removeClass('active');
        $button.addClass('active').trigger('activated');
    }
}

Dashboard.midsideContainer.on('click', '.region_button', function(){
    clickedRegionListButton($(this));
}).on('activated', '.region_button', function(){
    var regionButton = $(this);
    Dashboard.activeRegionButton = regionButton;
    if(regionButton.hasClass('fake_region_list_button'))
    {
        return;
    }
    var chat = ChatActions.getActiveChatContainer();
    var userlist = chat.data('userlist');
    userlist.addClass('active');
    $('#friend_list, #ignored_users').removeClass('active');
}).on('click', '.toggle_userlist', function(e){
    var button = $(this);
    if(!Dashboard.midsideContainer.data('toggle_userlist_buttons'))
    {
        Dashboard.midsideContainer.data('toggle_userlist_buttons', Dashboard.midsideContainer.find('.toggle_userlist'));
    }
    var userlistButtons = Dashboard.midsideContainer.data('toggle_userlist_buttons');
    if(button.hasClass('btn-success'))
    {
        Dashboard.midsideContainer.addClass('userlist_showing');
        userlistButtons.addClass('btn-danger').removeClass('btn-success');
        var active = ChatActions.getActiveChatContainer();
        if(active.length)
        {
            active.data('userlist').trigger('retrieveUserlist');
        }
    }
    else
    {
        Dashboard.midsideContainer.removeClass('userlist_showing');
        userlistButtons.removeClass('btn-danger').addClass('btn-success');
    }
    ChatActions.resizeUserlists();
});


Dashboard.friendList.on('click','.accept_friend, .decline_friend, .cancel_request',function(e){
    e.stopImmediatePropagation();
    var button = $(this);
    var type = button.data('type');
    var container = button.closest('.online_user');
    if(container.hasClass('updating'))
    {
        return;
    }

    var finished = function(){
      inputs.prop('disabled',false);
        container.removeClass('updating');
    };
    container.addClass('updating');
    var inputs = container.find(':input').prop('disabled',true);
    var player = container.data('id');



    var data = {
        type:type,
        player: player
    };
    $.post(siteUrl+'/matchmaking/friend',data,function(response){
        if(response.friend)
        {
            Dashboard.friendListButton.trigger('updateFriend',[response.friend]);
        }
        finished();
    }).error(function(){
        finished();
    });
});

function getActiveUserRegions()
{
    var preferred = $('.my_regions .regions input[name=region]');
    var values = {};
    $.each(preferred,function(key,checkbox){
        var $checkbox = $(checkbox);
        if($checkbox.is(':checked'))
        {
            values[$checkbox.val()] = values[$checkbox.val()];
        }
    });
    return values;
}

function getActivePreferredRegions()
{
    var preferred = $('.preferred_regions input[name=region]');
    var values = {};
    $.each(preferred,function(key,checkbox){
        var $checkbox = $(checkbox);
        if($checkbox.is(':checked'))
        {
            values[$checkbox.val()] = values[$checkbox.val()];
        }
    });
    return values;
}

function getActiveUserListRegions()
{
    var activeRegions = {};
    var activeButton = $('.region_button.active');
    $(activeButton.find('input[name=region_id]').each(function(){
        var inputValue = $(this).val();
        activeRegions[inputValue] = inputValue;
    }));
    return activeRegions;
}

function getChatData(data)
{
    var privateChatsOpen = $('#private_chats .private_window.opened');
    if(privateChatsOpen.length)
    {
        data['private_chats'] = {};
        privateChatsOpen.each(function(){
            var chat = $(this);
            var privateChatHolder = chat.data('chatHolder');
            var chatId = chat.data('id');
            data.private_chats[chatId] = {};
            data.private_chats[chatId].id = chatId;
        });
    }
    var mainChats = $('#main_chat_area').find('.chat_holder:not(.template)').not('template');
    data['chats'] = {};
    mainChats.each(function(){
        var mainChat = $(this);
        var mainChatHolder = mainChat.find('.chat_container');

        if(mainChat.data('chat_room_id'))
        {
            var type = 'chat_room';
            var chatId = mainChat.data('chat_room_id');
        }
        else if(mainChat.data('ladder_id'))
        {
            var type = 'ladder';
            var chatId = mainChat.data('ladder_id');
        }
        else
        {
            ladder.log('chat type error');
            return;
        }
        if(!data.chats[type])
        {
            data.chats[type] = {};
        }
        data.chats[type][chatId] = {};

        //Let the server know what users I see
        data.chats[type][chatId].userlist = {};
        mainChat.data('userlist').find('li').each(function(){
            var userId = $(this).find('input[name=player_id]').val();
            data.chats[type][chatId].userlist[userId] = 1;
        });
    });
    $('.current_match_container .current_match').each(function(){
        var match = $(this);
        var chatContainer = match.find('.chat_container');
        var matchId = match.find('input[name=match_id]').val();
        if(!matchId)
            return 'continue';
        if(!data['match_chats'])
        {
            data['match_chats'] = {};
        }
        if(!data['match_chats'][matchId])
        {
            data['match_chats'][matchId] = {};
        }
    });
    return data;
}


function updateSearchesByTeamsPreference($searches)
{
    var selected = $('#show_doubles_searches').find('input').is(':checked');
    $searches.each(function(i,search){
        search = $(search);
        if(selected)
        {
            if(search.data('match').isDoubles())
            {
                search.removeClass('hidden_by_team_size');
            }
            else
            {

            }
        }
        else
        {
            if(search.data('match').isDoubles())
            {
                search.addClass('hidden_by_team_size');
            }
        }
    });
}

$('.wants_to_play').click(function(){
    var button = $(this);
    var changeTo = button.val();
    changeWantsToPlay(changeTo);
});

function changeWantsToPlay(changeTo)
{
    var disable = $('.disable_challenges');
    var enable = $('.enable_challenges');
    var controls = $('.main_info .status_visibility');

    var toggle = function(){
        if(controls.hasClass('is_visible'))
        {
            controls.removeClass('is_visible').addClass('is_invisible');
        }
        else
        {
            controls.removeClass('is_invisible').addClass('is_visible');
        }
    };

    toggle();
    var data={is_visible:changeTo};
    Request.send(data,'change_wants_to_play',function(response){
        if(response.success)
        {
            var title = 'Status Changed';
            if(changeTo == 1)
            {
                Ladder.alert('You will appear online', title);
            }
            else
            {
                Ladder.alert('You will appear offline and not receive random challenges' , title);
            }
        }
        else
        {
            toggle();
        }
        return true;
    }, function(){
        toggle();

    });
}

$('#show_doubles_searches').find('input[name=show_team_searches]').change(function(){
    updateSearchesByTeamsPreference($('.recent_match_searcher').not('.template'));
    $.post(siteUrl+'/matchmaking/show_team_searches',{show_team_searches:$(this).is(':checked')?1:0},function(response){

    });
});

Dashboard.preferredDistanceSeverityElement.change(function(){
    var button = $(this);
    var value = button.find(':selected').data('distance');
    var severityId = button.find(':selected').val();
    button.data('selected', severityId);
    var searches = $('.recent_match_searcher').not('.template');
    var preferredTab = $('#show_preferred_users');
    button.prop('disabled',true);

    searches = searches.add($('#open_challenges').find('.request'));


    searches.each(function(i,search){
        search = $(search);
        var match = search.data('match');
        if(match.location &&
            match.gameData.preferred_distance_matters &&
            !match.location.isWithinPreferredRange())
        {
            search.addClass('hidden_by_distance');
        }
        else
        {
            search.removeClass('hidden_by_distance');
            // openChallengesCallbacks.challengesContainer.addClass('has_challenges');
        }
    });
    preferredDistanceSeverity = parseInt(severityId);
    if(preferredDistanceSeverity == 5)
    {
        preferredTab.hide();
    }
    else
    {
        preferredTab.show();
    }
    $.post(siteUrl+'/account/set_preferred_distance',{preferred_distance_severity_id:severityId},function(response){
        button.prop('disabled',false).focus();
    }).error(function(){
        button.prop('disabled',false).focus();
    });

});

function updateMatchSearch(element,search)
{
    if(!element)
    {
        return;
    }
    if(element.data('attachedCountdown'))
    {
        element.data('attachedCountdown').changeTimeRemaining(search.search_time_remaining);
    }
    search.player1.match = search;
    var user = search.player1;
    var userObject = Users.update(user);

    // element.find('input[name=player_id]').val(user.id);
    // element.find('input[name=match_id]').val(search.id);
    element.data('user',userObject);

    element.addClass('game_type_'+search.game_slug+' game_ladder_id_'+search.ladder.id);

    userObject.updateUserElements(element.find('.username'));
    var league = userObject.ladder_information.getLeagueForLadder(search.ladder.id);

    if(!search.is_ranked && league && search.player1.show_rank_for_friendlies === false)
    {
        ElementUpdate.league(element.find('.user_information_wrapper .league'),{});
    }
    else
    {
        ElementUpdate.league(element.find('.user_information_wrapper .league'),league);
    }

    var mainsContainer;
    var mains;

    if(!(search.player1 instanceof User))
    {
        search.player1 = Users.update(search.player1);
    }
    ElementUpdate.mains(element.find('.friendlies_mains'), search.player1,search);

    if(search.team_size > 1)
    {
        element.addClass('team_search');
        if(search.lobby)
        {
            var lobby = element.find('.lobby_players');
            lobby.find('.total_players').text(search.lobby.total_players);
            lobby.find('.required_players').text(search.lobby.required_players);
        }
    }

    search.setDoublesViewAsPriorityIfNeeded();

    var locationElement = element.find('.location');
    LadderDistance.setDescription(locationElement,user.location,myUser.location).text(userObject.location.relativeLocation());

    if(search.gameData)
    {

    }
    if(
        locationElement.data('distance') &&
        search.gameData.preferred_distance_matters &&
        Dashboard.getPreferredDistanceSeverity() < locationElement.data('distance').getDistanceSeverity())
    {
        element.addClass('hidden_by_distance');

    }
    element.data('match',search);

    Dashboard.updateSearchesByBuildPreference(element);

    updateSearchesByTeamsPreference(element);

    // ladder.log('Update userlist elements here');

    // var playerInUserList = PlayerUpdater.getPlayerInUserList(user.id);
    // if(playerInUserList.length)
    // {
    //     element = element.add(playerInUserList);
    // }

    ElementUpdate.updateChallengeButtons(user,element,UserlistElement.displayOptions.challengeButtonOptionsMatchmaking);
    return ElementUpdate.updateMatchCount(search,element.find('.match_count')); //Returns a string
}



var serverConnection = new SocketConnection();
Dashboard.serverConnection = serverConnection;
serverConnection.setStatus('.connecting-0','loading');
Dashboard.autoOpenPrivateChat = null;
if(getUrlParameter('send_message'))
{
    Dashboard.autoOpenPrivateChat = getUrlParameter('send_message');
}
var autoSelectTab = function(parameter){
    if(!parameter)
    {
        parameter = getUrlParameter('tab');
    }
    if(!parameter)
    {
        return;
    }
    var selected = Dashboard.retrieveNamedTab(parameter);
    if(selected)
    {
        selected.trigger('activate');
    }
    else
    {
        console.log('SELECTED TAB DOES NOT EXIST ' + parameter);
    }
};
autoSelectTab();

function getUrlParameter(parameter){
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === parameter) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

Dashboard.canCallGetUserGoingAgain = true;
Dashboard.chatMessagesFirstTime = true;
var StartupEventManager = function() {
    this.eventList = [];
    this.addedEvents = {};
};
StartupEventManager.prototype.addEvent = function(name){
    if(startupEvents[name])
    {
        if(!this.addedEvents[name])
        {
            this.addedEvents[name] = 1;
            this.eventList.push({name:name, event: startupEvents[name]});
        }
    }
    else
    {
        throw 'Invalid event specified '+ name;
    }
};
StartupEventManager.prototype.runEvents = function(){
    for (var key in startupEvents) {
        if (!this.addedEvents.hasOwnProperty(key)) {
            this.addEvent(key);
        }
    }
    this.executeEvents();
    console.log('[RUN EVENTS]', Object.keys(this.addedEvents));
};
StartupEventManager.prototype.executeEvents = function(){
    var event = this.eventList.shift();
    if(event)
    {
        var result = event.event();
        return result.then(() => {
            return this.executeEvents();
        });
    }
    else
    {
        return false;
    }
};
Dashboard.initialChat = null;
var startupEvents = {};
startupEvents.getChatRooms = function(){
    if(isInLadder && !matchOnlyMode)
    {
        return Request.send(Dashboard.baseState,'get_chat_rooms', function(response){
            if(response.success)
            {
                Dashboard.chatRoomsLoaded = true;
            }
            if(!response.chat_rooms)
            {
                return true;//do open search update stuff
                return;
            }
            var responseChatRooms = response.chat_rooms;
            delete response.chat_rooms;
            var lowestOrder = null;
            $.each(responseChatRooms.chat_room, function(i,chat_room){
                if(chat_room.last_active)
                {
                    lowestOrder = chat_room;
                    Dashboard.initialChat = chat_room.id
                    ChatActions.chatFocus(i, true);
                    return false;
                }
            });
            if(lowestOrder)
            {
                var chatRoomObject = {};
                chatRoomObject[lowestOrder.id] = lowestOrder;
                preferredChat = lowestOrder.id;
                Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room: chatRoomObject, initial_load:true}});

                ChatActions.setChatLoadingState(lowestOrder.id, true);

                delete responseChatRooms.chat_room[lowestOrder.id];
            }

            $.each(responseChatRooms.chat_room, function(i,chat_room){
                var chatRoomObject = {};
                chatRoomObject[i] = chat_room;

                Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room: chatRoomObject}}); //Loads with no messages
                ChatActions.setChatLoadingState(i, true);
            });

        });
    }
    return new Promise(function(resolve){ resolve() });
};
startupEvents.getChatMessages = function(){
    if(isInLadder && !matchOnlyMode)
    {
        return ChatActions.getChatMessages(Dashboard.initialChat).then(function(){
            Dashboard.initialChat = null;
        });
    }
    return new Promise(function(resolve){ resolve() });
};
startupEvents.getPrivateMessages = function(){
    if(!isInLadder)
    {
        return new Promise(function(resolve){ resolve() });
    }
    return Request.send(Dashboard.baseState,'get_private_messages', function(response){

        Dashboard.performOpenSearchUpdate({private_chat:response.recent_private_chats},'private_chat');
        Dashboard.performOpenSearchUpdate({recent_private_chats:response.private_chat},'recent_private_chats');

        Dashboard.performOpenSearchUpdate(response,'private_chat');
        if(Dashboard.autoOpenPrivateChat)
        {
            let chat = PrivateChatLoader.openPrivateChat({id: Dashboard.autoOpenPrivateChat});
            if(chat)
            {
                chat.load();
            }
            Dashboard.autoOpenPrivateChat = null;
        }
        Dashboard.performOpenSearchUpdate(response,'recent_private_chats');
    });
}
startupEvents.getMatches = function(){
    if(!isInLadder)
    {
        return new Promise(function(resolve){ resolve() });
    }
    return Request.send(Dashboard.baseState,'get_matches',function(response){
        Dashboard.performOpenSearchUpdate(response);
    });
};
startupEvents.getUserGoing = function(){
    return Request.send(Dashboard.baseState,'get_user_going',function(response){
        if(!response.success)
        {
            return;
        }

        myFriends = Users.convertCollection(myFriends);

        $('#private_chat_listing').find('.private_chat_listing').tsort('.time',{data:'timestamp',order:'desc'})
        $('#private_chats').find('.private_window').tsort('.time',{data:'timestamp',order:'asc'});


        if(dashboard.hasClass('inactive'))
        {
            dashboard.addClass('active').removeClass('inactive');
            dashboard.data('isReady', true);
            dashboard.trigger('ready');
            let min = 5;
            let max = 10;
            var randomFeaturedChatInterval = Math.floor(Math.random() * (max - min + 1) + min);
            setTimeout(function(){
                loadFeaturedChats();

            }, randomFeaturedChatInterval * 1000)
        }
        Dashboard.performOpenSearchUpdate(response);

        serverConnection.setStatus('.connecting-0','success');
        Dashboard.reconnectionTimeout = 5000;
    });
};
Dashboard.getUserGoing = function(){
    if(!Dashboard.canCallGetUserGoingAgain)
    {
        console.log('rate limiting data retrieval');
        return;
    }
    Dashboard.canCallGetUserGoingAgain = false;
    setTimeout(function() {
        Dashboard.canCallGetUserGoingAgain = true
    }, Dashboard.reconnectionTimeout - 1000);

    var checkProperties = {
        is_mod : 'is_mod',
        is_ladder_mod: 'is_ladder_mod',
        is_subscribed: 'subscribed_user',
        is_real_subscribed: ['is_real_subscribed','is_unsubscribed'],
        is_monthly_subscribed: 'is_monthly_subscribed'
    };
    $.each(checkProperties, function(property, classValue){
        if(!(property in myUser))
        {
           throw 'Property '+property+' for user not loaded!';
        }

        if(classValue.constructor === Array)
        {
            (myUser[property]) ? Dashboard.dashboard.addClass(classValue[0]) : Dashboard.dashboard.removeClass(classValue[0]);
            (myUser[property]) ? Dashboard.dashboard.removeClass(classValue[1]) : Dashboard.dashboard.addClass(classValue[1]);
        }
        else
        {
            (myUser[property]) ? Dashboard.dashboard.addClass(classValue) : Dashboard.dashboard.removeClass(classValue);
        }
    });

    if(myUser.latest_subscription)
    {
        var subscription = myUser.latest_subscription;
        var donateContainer = $('#donate');
        donateContainer.find('.days_remaining').text(subscription.days_remaining);
        var theS = donateContainer.find('.days_s');
        (subscription.days_remaining == 1) ? theS.hide() : theS.show();
        (subscription.amount_paid >= 40) ? donateContainer.find('.many_monies_heart').show() :donateContainer.find('.many_monies_heart').hide();
    }

    var emailValidationNotification = $('#email_validation_notification');
    (myUser.email_validated) ? emailValidationNotification.removeClass('email_not_validated') : emailValidationNotification.addClass('email_not_validated');
    if(!myUser.email_validated )
    {
        emailValidationNotification.on('email_validated', function (e) {
            $(this).fadeOut();
            alert('Your email has been validated!');
        }).on('submit', 'form', function(e){
            e.preventDefault();
            var form = $(this);
            if (form.data('sending')) {
                return;
            }
            var button = form.find('button').text('Sending...');
            form.data('sending', true);
            $.post(form.attr('action'), null, function (response) {
                if (response.success) {
                    if (response.already_validated) {
                        emailValidationNotification.trigger('email_validated');
                    }
                    button.text('Email sent to ' + response.email_address);
                }
                else {
                    button.text('Error, try again later.');
                }
            }).error(function () {
                form.data('sending', false);
                button.removeClass('btn-success').addClass('btn-danger').text('A server error occurred, try again later');
            });
        });

    }

    if(isInLadder)
    {
        serverConnection.connect();
    }

    var allEvents = Object.keys(startupEvents);
    var startupEventManager = new StartupEventManager();
    if(isInLadder)
    {
        if(Dashboard.autoOpenPrivateChat || Dashboard.directChatsTab.hasClass('active'))
        {
            startupEventManager.addEvent('getPrivateMessages');
        }
        startupEventManager.addEvent('getMatches');
        if(matchOnlyMode || Dashboard.battleTab.hasClass('active'))
        {
            startupEventManager.addEvent('getUserGoing');
        }
        if(Dashboard.isTiny())
        {
            startupEventManager.addEvent('getChatRooms');
            startupEventManager.addEvent('getChatMessages');
        }
        startupEventManager.addEvent('getChatRooms');
        startupEventManager.addEvent('getChatMessages');
    }
    else
    {
        startupEventManager.addEvent('getUserGoing');
    }

    startupEventManager.runEvents();

};
Dashboard.reconnectionTimeout = 5000;
Dashboard.getUserGoing();



$('.change_icon').click(function(){
    Dashboard.closeDeclickables();
    var changeIconPopup = $('.popups .change_icon_popup').clone();
    var url = 'view_icons';
    return Popups.matchmakingAjax(null,url,function(response,content){
        var flairs = content.on('click','.flaired',function(e){
            var data={icon:$(this).data('flair_id')};
            if($(this).hasClass('disabled'))
            {
                return;
            }
            content.find('.flaired').addClass('disabled');
            Request.send(data,'change_icon',function(response){
                if(response.success)
                {
                    $.fancybox.close();
                    DisplayUpdater.update();
                }
                else
                {
                    $.fancybox({
                        content:'There was an error changing your icon!'
                    });
                }
                return true;
            });
        });
    });
});

DisplayUpdater.update();

if(streamsTab.hasClass('active'))
{
    streamsTab.trigger('activate');
}

var ElementPosition = {
    isInView: function(elem){
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
};

var openChallengesCallbacks = {};
openChallengesCallbacks.challengesContainer = $('.open_challenges_container');

openChallengesCallbacks.challengesContainer.on('click', '.accept, .decline', function(e){
    e.preventDefault();
    var request = $(this).closest('.request');
    var challenge = request.data('match');
    var match_id = challenge.id;
    var button = $(this);

    button.popover('hide');

    var buttons = request.find('button');
    buttons.prop('disabled',true);

    var accept = button.hasClass('accept')?1:0;

    var data = {
        accept:accept,
        match_id:match_id,
        host_code: Dashboard.retrieveHostCode()
    };

    var url = 'reply_to_match';
    if(challenge.isDoubles())
    {
        url = 'challenge_search';
        data.challenge_player_id = challenge.player2.id; //To match the API of this crazy call
    }
    else
    {
        if(challenge.player2.getToxicCount() >= 2)
        {
            return challenge.player2.showToxicWarning().then(function(){
                return sendReply();
            }).catch(()=>{
                buttons.prop('disabled', false);
            });
        }
    }

    return sendReply();
    function sendReply(){
        Request.send(data,url,function(response){
            if(response.success)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                if(response.message)
                {
                    // alert(response.message);
                }
            }
            else
            {
                buttons.prop('disabled',false);
                if(response.message)
                {
                    alert(response.message);
                }
                else
                {
                    alert('There was an error ');
                }
            }
            return true;
        });
        if(accept)
            addGaEvent('matchmaking','accepting');
        else
            addGaEvent('matchmaking','declining');
    }

});
openChallengesCallbacks.challengeRequestTemplate = null;
openChallengesCallbacks.onNew = function(id,challenge){

    if(ignoreList[challenge.player2.id])
    {
        return; //You know what it is
    }
    challenge = new Match(challenge);

    if(!openChallengesCallbacks.challengeRequestTemplate)
    {
        openChallengesCallbacks.challengeRequestTemplate = $('.challenge_request.template').detach().removeClass('template');
    }

    var $newElement = openChallengesCallbacks.challengeRequestTemplate.clone();
    challenge.gameData = Dashboard.getDataForGame(challenge.game_id);
    $newElement.removeClass('challenge_request');
    $newElement.addClass('request');
    $newElement.data('match',challenge);
    $newElement.attr('id','challenge-'+challenge.id);

    challenge.setupCountdown($newElement, $newElement.find('.countdown'), function(){
        LadderInfo.forceRemove('openChallenges',id);
    });


    var challenges = LadderInfo.retrieveReference('openChallenges');
    if(!challenges.extraData.users)
    {
        challenges.extraData.users = {};
    }
    challenge.player2 = Users.update(challenge.player2);
    challenges.extraData.users[challenge.player2.id] = true;

    //Player 1 is always the current player for open challenges
    ElementUpdate.mains($newElement.find('.friendlies_mains'), challenge.player2 ,challenge);

    ElementUpdate.updateMatchCount(challenge,$newElement.find('.match_count'));

    challenge.addSearchPopover($newElement.findCache('.accept'), challenge.player2);

    if(challenge.player2.hasToxicWarning(1))
    {
        $newElement.addClass('toxic_behavior');
    }

    var miniImageUrl = siteUrl+'/images/logos/game-filter-logos/'+challenge.ladder_slug+'-mini.png';
    $newElement.find('.game_mini_indicator').css('background-image','url('+miniImageUrl+')').attr('title',challenge.ladder_name);
    Dashboard.matchmakingTab.trigger('showNotified');

    challenge.player2 = Users.update(challenge.player2);
    challenge.location = challenge.player2.location;


    if(challenge.notification)
    {
        challenge.showWantsToPlayNotification(challenge.notification, $newElement);
    }

    challenge.player2.updateUserElements($newElement.find('.username'));

    var locationElement = $newElement.find('.location');
    LadderDistance.setDescription(locationElement,challenge.player2.location,myUser.location).text(challenge.player2.location.relativeLocation());


    if(!challenge.location.isWithinPreferredRange() && challenge.gameData && challenge.gameData.preferred_distance_matters)
    {
        $newElement.addClass('hidden_by_distance');
    }

    ElementUpdate.league($newElement.find('.user_information_wrapper .league'),challenge.player2.league);

    if(challenge.player2.hasToxicWarning())
    {
        var infractions = Infraction.convert(challenge.player2.reported_match_behavior);
        if(infractions.length >= 2)
        {
            $newElement.addClass('toxic_behavior');
        }
    }

    $newElement.appendTo('#open_challenges');
    return $newElement;
};
openChallengesCallbacks.onRemove = function(id,challenge,element){
    var challenges = LadderInfo.retrieveReference('openChallenges');
    if(element)
    {
        Timer.endCountdown(element.find('.countdown'));
        element.fadeOut('fast',function(){$(this).remove();});
    }
    if(challenge.player2)
    {
        ElementUpdate.user(PlayerUpdater.getPlayerListElementsByPlayerId(challenge.player2.id),{id:challenge.player2.id});
        delete challenges.extraData.users[challenge.player2.id];
    }
};
openChallengesCallbacks.onUpdate = function(id,challenge,element){
    ElementUpdate.user(PlayerUpdater.getPlayerListElementsByPlayerId(challenge.player2.id),{id:challenge.player2.id});
};
openChallengesCallbacks.onPopulate = function(allElements){
    $.each(allElements,function(i, element){
        if(!element.element)
        {
            return;
        }
       if(!$(element.element).hasClass('hidden_by_distance'))
       {
           openChallengesCallbacks.challengesContainer.addClass('has_challenges');
           return false;
       }
    });
};
openChallengesCallbacks.onEmpty = function(){
    openChallengesCallbacks.challengesContainer.removeClass('has_challenges');
};
LadderInfo.setCallbacks('openChallenges',openChallengesCallbacks);


var currentMatchesCallbacks = {};
currentMatchesCallbacks.matchTemplate = null;
currentMatchesCallbacks.onNew = function(id,match){
    if(!currentMatchesCallbacks.matchTemplate)
    {
        currentMatchesCallbacks.matchTemplate = $('#tab-pane-battle').find('.current_match_container.template').remove().removeClass('template');
    }
    var currentMatchContainer = currentMatchesCallbacks.matchTemplate.clone();


    match = new Match(match);
    //Show team lists
    match.setMatchContainer(currentMatchContainer);


    currentMatchContainer.attr('id','match_container_'+match.id);
    currentMatchContainer.data('id',match.id);
    currentMatchContainer.data('chat_container',currentMatchContainer.find('.chat_container'));
    currentMatchContainer.data('chat_container').on('click','.streamlink',function(e){
        e.preventDefault();
        var button = $(this);
        ChatActions.onStreamlinkClick(button,e);
    }).on('postNotification',function(e,message, callback){
        message = ChatActions.addNotificationToChat($(this),message);
        if(callback)
        {
            return callback(message)
        }

    });

    if(match.is_ranked && match.season.match_system_id != 3)
    {
        match.postNotification('Be sure to do a lag test before playing your first game!', function(message){
            message.addClass('lag_test_notification');
        });
    }

    var chatInput = currentMatchContainer.find('.chat_input').addClass('chat_autocomplete');;;
        //.elastic();


    chatInput.data('chatContainer',currentMatchContainer.data('chat_container'));

    if(match.players)
    {
        $.each(match.players, function(id, player){
            if(player.match && player.match.match_muted)
            {
                var notificationMessage = 'Chat Restricted';

                Dashboard.sleep(25).then(() => {
                    match.postNotification(notificationMessage, function(message){
                        message.empty();
                        if(player.id == myUser.id)
                        {
                            message.append('You ').append(' are chat restricted');
                        }
                        else
                        {
                            message.append(player.player.createUsernameElement())
                                .append(' is chat restricted and can only use predefined messages (Click to remove)');
                            message.click(function(){
                               Dashboard.ladderPopup('Enable match chat restricted players to chat?', 'Disable Match Chat Restriction?',
                                   {
                                       buttons: [
                                           {
                                               text: 'No',
                                               dismiss: true
                                           },
                                           {
                                               text: 'Yes',
                                               dismiss: true,
                                               click: (popup)=>{
                                                   $.post(siteUrl+'/matchmaking/end-chat-restriction', {match_id:match.id}, function(response){
                                                        if(response.success)
                                                        {
                                                            message.text('Chat Restriction Removed').addClass('restriction_removed');
                                                        }
                                                        else if(response.error)
                                                        {
                                                           match.postNotification(response.error);
                                                        }
                                                   });
                                               }
                                           }
                                       ]
                                   });
                            });
                        }
                        message.addClass('chat_restricted_notification');
                    });
                });
            }
        });
    }

    currentMatchContainer.find('.match_feedback :input').change(function(e){
        e.stopImmediatePropagation();
        var feedbackUrl = siteUrl+'/matchmaking/update_feedback';
        var form = $(this).closest('.match_feedback');
        var data = form.find(':input').serializeArray();
        data.push({name:'version',value:2});
        $.post(feedbackUrl,data,function(){

        });
    });
    currentMatchContainer.find('.match_disputed button').click(function(e){
        if($(e.target).hasClass('undispute_match'))
        {

        }
        else
        {
            e.preventDefault();
        }
    });
    currentMatchContainer.find('.feedback_thumbs').on('click','.selection_area', function(e,save){
        if(typeof save == 'undefined')
        {
            save = true;
        }
        var selected = $(this);
        var container = selected.closest('.rating_container');
        var both = container.find('.selection_area');
        var other = both.not(selected);
        other.removeClass('selected');
        var input = container.find('input');
        if(selected.hasClass('selected'))
        {
            selected.removeClass('selected');
            input.val(0);
        }
        else
        {
            selected.addClass('selected');
            input.val(selected.data('value'));
        }
        if(save)
        {
            input.trigger('change');
        }

    });

    if(match.player_feedback && match.player_feedback[myUser.id])
    {
        var feedback = match.player_feedback[myUser.id];
        var feedbackContainer = currentMatchContainer.find('.match_feedback');
        feedbackContainer.find('textarea[name=feedback]').val(feedback.message);
        if(feedback.connection_feedback == 1)
        {
            feedbackContainer.find('.connection_rating_container .positive_area').trigger('click',[false]);
        }
        if(feedback.connection_feedback == -1)
        {
            feedbackContainer.find('.connection_rating_container .negative_area').trigger('click',[false]);
        }
        if(feedback.salt_feedback == 1)
        {
            feedbackContainer.find('.salt_rating_container .positive_area').trigger('click',[false]);
        }
        if(feedback.salt_feedback == -1)
        {
            feedbackContainer.find('.salt_rating_container .negative_area').trigger('click',[false]);
        }
    }

    match.player1 = Users.update(match.player1);
    match.player2 = Users.update(match.player2);

    if(match.rps_game)
    {
        currentMatchContainer.find('.rock_paper_scissors').on('click','.selection',function(e){
            var button = $(this);
            var selection = button.val();
            var data = {selection:selection,match_id:currentMatchContainer.data('id')};
            var rpsContainer = button.closest('.rock_paper_scissors');
            rpsContainer.find('.selection').removeClass('player_selected').prop('disabled',true);
            button.addClass('player_selected');
            rpsContainer.addClass('waiting');
            Request.send(data,'rps_selection',function(response){
                if(response.error)
                {
                    rpsContainer.removeClass('waiting');
                    rpsContainer.find('.selection').prop('disabled',false);
                    alert(response.error);
                }
            });
        });
    }
    else
    {
        currentMatchContainer.find('.rock_paper_scissors').hide();
    }

    currentMatchContainer.find('.character_picks').on('click','.character',function(e){
        if(!match.containsMeAsPlayer())
        {
            return;
        }
        var button = $(this);
        var characterId = button.data('id');
        var matchId = match.id;
        var data = {character_id:characterId, match_id:currentMatchContainer.data('id')};

        var picksContainer = button.closest('.picks_container');
        var previousSelection = picksContainer.find('.player_selected');



        var currentAction = picksContainer.data('currentAction');
        var myPlayerNumber = picksContainer.data('myPlayerNumber');
        var otherPlayerUsername = picksContainer.find('.other_username').first().text();

        if((currentAction == ACTION_PLAYER_1_PICK_CHARACTER && myPlayerNumber == 2)
            || (currentAction == ACTION_PLAYER_2_PICK_CHARACTER && myPlayerNumber == 1))
        {
            openPopup("It's "+otherPlayerUsername+'\'s turn to pick their character.');
            return false;
        }
        var bg = button.css('background-image');

        var characterName = button.find('input[name=name]').val();
        var pickCharacterText = 'Pick '+characterName+'?';

        button.addClass('confirming').addClass('character_holder');
        var characterPicks = button.closest('.character_picks').addClass('confirming');
        characterPicks.find('.selected_character').text(characterName);

        var timeOut = null;

        var removeSelectionState = function(){
            characterPicks.removeClass('confirming');
            button.removeClass('character_holder confirming').off('click');
            clearTimeout(timeOut);
        };
        characterPicks.find('.cancel_selection').prop('disabled',false).off('click').on('click',function(){
            removeSelectionState();
        });
        button.on('click',function(e){
            e.stopImmediatePropagation();
            removeSelectionState();
        });

        function sendCharacterSelection(){
            characterPicks.find('.cancel_selection').prop('disabled',true);

            picksContainer.find('.character').removeClass('player_selected');
            button.addClass('player_selected');

            Request.send(data,'select_character',function(response){
                removeSelectionState();
                if(response.error)
                {
                    alert(response.error);
                }
            });
        }

        if(currentAction == ACTION_PLAYERS_BLIND_PICK_CHARACTERS && previousSelection.length)
        {
            sendCharacterSelection();
            removeSelectionState();
            return;
        }
        timeOut = setTimeout(function(){
            sendCharacterSelection();
        }, e.shiftKey ?400000: 4000);
    });

    currentMatchContainer.find('.stage_picks').on('click','.stage',function(){
        if(!match.containsMeAsPlayer())
        {
            return;
        }
        var button = $(this);
        var stageId = button.find('input[name=stage_id]').val();
        let instructions = currentMatchContainer.findCache('.current_instructions');
        let highlightInstructions = function(){
            clearTimeout(instructions.data('timeout'));
            let timeout = instructions.addClass('error_highlight');
            setTimeout(()=>{
                instructions.removeClass('error_highlight');
            },3000);
            instructions.data('timeout', timeout);
        };
        var matchId = currentMatchContainer.data('id');
        var data = {stage_id:stageId,match_id:matchId};

        var picksContainer = $(this).closest('.picks_container');
        var currentAction = picksContainer.data('currentAction');
        var myPlayerNumber = picksContainer.data('myPlayerNumber');
        var otherPlayerUsername = picksContainer.find('.other_username').first().text();

        if((currentAction == ACTION_PLAYER_1_STRIKE_STAGE && myPlayerNumber == 2)
            || (currentAction == ACTION_PLAYER_2_STRIKE_STAGE && myPlayerNumber == 1))
        {
            highlightInstructions();
            return false;
        }

        if((currentAction == ACTION_PLAYER_1_BAN_STAGE && myPlayerNumber == 2)
            || (currentAction == ACTION_PLAYER_2_BAN_STAGE && myPlayerNumber == 1))
        {
            highlightInstructions();
            return false;
        }

        if((currentAction == ACTION_PLAYER_1_PICK_STAGE && myPlayerNumber == 2)
            || (currentAction == ACTION_PLAYER_2_PICK_STAGE && myPlayerNumber == 1))
        {
            highlightInstructions();
            return false;
        }

        button.addClass('pending_selection');

        Request.send(data,'select_stage',function(response){
            button.removeClass('pending_selection');
            if(response.error)
            {
                alert(response.error);
            }
        });
    });

    var matchResultChangeButtons = currentMatchContainer.find(
        '.cancel, .finished, .dispute_match'
    );

    currentMatchContainer.find('.selected_characters').on('click','.character_holder:not(.disabled)',function(e){
        var selectedResult = null;
        if(!currentMatchContainer.hasClass('play_match'))
        {
            return;
        }
        if(currentMatchContainer.hasClass('auto_reported'))
        {
            return;
        }
        if(!match.containsMeAsPlayer())
        {
            return;
        }
        if($(this).closest('.my_team').length)
        {
            selectedResult = WIN_MATCH;
            //Selected win
        }
        else if($(this).closest('.other_team').length)
        {
            selectedResult = LOSE_MATCH;
            //Selected lose
        }
        else {
            alert('Error?');
            return;
        }
        var buttons = matchResultChangeButtons.add(currentMatchContainer.find('.selected_characters .player_character'));
        match.report(selectedResult,null,buttons);
    });
    matchResultChangeButtons.click(function(){
        var message;
        var selectedResult;
        var button = $(this);
        var player = button.closest('.current_match');
        var match_id = match.id;

        if(button.closest('.dispute_update').length)
        {
            return;
        }
        if(button.hasClass('win'))
            selectedResult = WIN_MATCH;
        else if(button.hasClass('loss'))
            selectedResult = LOSE_MATCH;
        else if(button.hasClass('cancel'))
            selectedResult = CANCEL_MATCH;
        else if(button.hasClass('finished'))
            selectedResult = FINISH_MATCH;
        else if(button.hasClass('dispute_match'))
            selectedResult = DISPUTE_MATCH;

        return match.report(selectedResult,null,matchResultChangeButtons.add(currentMatchContainer.find('.selected_characters .player_character')));
    });

    //currentMatchContainer.find('.stage, .character, button.cancel').tooltip();
    //currentMatchContainer.find('.stage, .character, button.finished').tooltip();
    currentMatchContainer.removeClass('template');
    var ladderStorage = ladderLocalStorage.getItem('ladders');
    if(!ladderStorage)
    {
        ladderStorage = {};

    }
    if(!ladderStorage[match.ladder.id])
    {
        ladderStorage[match.ladder.id] = {};
    }
    if(ladderStorage[match.ladder.id].last_update_timestamp !=
        match.ladder.last_modified)
    {
        ladderStorage[match.ladder.id].last_motd_times_closed = 0;
    }
    ladderStorage[match.ladder.id].last_update_timestamp = match.ladder.last_modified;
    if(match.ladder.last_modified && ladderStorage[match.ladder.id].last_motd_times_closed > 0)
    {
        var skipMotd = true;
    }
    if(match.ladder && match.ladder.motd && !skipMotd)
    {
        var chatRoomDescription = currentMatchContainer.find('.chat_room_description');

        chatRoomDescription.addClass('shown')
            .find('.description_message')
            .html(match.ladder.motd);
        chatRoomDescription.find('.closing_x').click(function(){
            if(match.ladder.last_modified)
            {
                ladderStorage[match.ladder.id].last_motd_times_closed++;
                ladderLocalStorage.setItem('ladders', ladderStorage);
            }
            chatRoomDescription.hide();
            ChatActions.resizeOpenChats();
        }).find('a').attr('target','_blank');
    }
    else
    {
        currentMatchContainer.find('.chat_room_description').remove();
    }

    if(!match.can_have_disputes)
    {
        currentMatchContainer.find('.dispute_match').remove();
    }

    ElementUpdate.matchContainer(currentMatchContainer,match,true);

    Dashboard.closeDeclickables();//Info box is closed upon starting a match!
    currentMatchContainer.appendTo('#current_matches_holder');
//		popupContent.appendTo(currentMatchContainer);
    currentMatchContainer.fadeIn();
    ChatActions.resizeOpenChats();
    Dashboard.currentMatch = match;
    if(Dashboard.hostCodePopup.popup)
    {
        Dashboard.hostCodePopup.popup.remove();
        Dashboard.hostCodePopup.popup = null;
    }
    return currentMatchContainer;
};
currentMatchesCallbacks.onRemove = function(id,info,element){
    element.remove();
};
currentMatchesCallbacks.onUpdate = function(id,match,element){
    ElementUpdate.matchContainer(element,new Match(match),false);
};
currentMatchesCallbacks.onPopulate = function(allElements){
    matchModeManager.changeBattleMode(MatchModeManager.battleModes.MATCH_SINGLES);
    if(Dashboard.matchmakingTab.hasClass('active'))
    {
        Dashboard.battleTab.trigger('activate');
    }
    else
    {
        Dashboard.battleTab.trigger('showNotified');
    }
    ChatActions.resizeOpenChats();
};
currentMatchesCallbacks.onEmpty = function(id,info,element){
    if(Dashboard.matchmakingTab.hasClass('active'))
    {
        ChatActions.resizeOpenChats();
    }
    matchModeManager.changeBattleMode(MatchModeManager.battleModes.NO_MATCH);
    if(Dashboard.battleTab.hasClass('active'))
    {
        Dashboard.matchmakingTab.trigger('activate');
    }
    Dashboard.currentMatch = null;
};
currentMatchesCallbacks.preventReadd = {};
LadderInfo.setCallbacks('currentMatches',currentMatchesCallbacks);



var friendsCallbacks = {};
friendsCallbacks.templateElement = null;
friendsCallbacks.friendList = null;
friendsCallbacks.onNew = function(id,friend){
    if(!this.friendList)
    {
        this.friendList = $('.user_lists .friends');
    }
    var friendList = this.friendList;
    if(!this.templateElement)
    {
        this.templateElement = User.getOnlineUserTemplate();
    }
    var element = this.templateElement.clone();

    element.prependTo(friendList);
    element.removeClass('template');
    ElementUpdate.user(element.find('.username'),friend);
    ElementUpdate.userTypes(element.find('.username'),friend);
    return element;
};
friendsCallbacks.onRemove = function(id,info,element){
    element.addClass('removing').fadeOut('fast',function(){$(this).remove();});
};
friendsCallbacks.onUpdate = function(id,info,element){
};
friendsCallbacks.onPopulate = function(allElements){
};
friendsCallbacks.onEmpty = function(id,info,element){
};
LadderInfo.setCallbacks('friends',friendsCallbacks);


function toggleLocationsContinuously()
{
    var showLocations = function(){
        Dashboard.recentMatchSearchers.addClass('show_locations');
        Dashboard.recentMatchSearchers.removeClass('show_titles');
        setTimeout(hideLocations,10000);
    };
    var hideLocations = function(){
        Dashboard.recentMatchSearchers.addClass('show_titles');
        Dashboard.recentMatchSearchers.removeClass('show_locations');
        setTimeout(showLocations,5000);
    };
    setTimeout(function(){
        showLocations();
    },10000);
}
if(Dashboard.recentMatchSearchers.length)
{
    // toggleLocationsContinuously();
}

Dashboard.battleTab.on('viewportActive', function(){
    if(matchModeManager.battleModeIs(MatchModeManager.battleModes.MATCH_SINGLES) || matchModeManager.battleModeIs(MatchModeManager.battleModes.MATCH_DOUBLES))
    {
        setTimeout(function(){
            if(Dashboard.currentMatch)
            {
                Dashboard.currentMatch.matchContainer.find('.chat_input').focus();
            }
        },5);
    }
});
Dashboard.matchmakingTab.on('deactivate', function(){
    var container = Dashboard.matchmakingTab.data('paneContainer');
    // var searches = container.find('.recent_match_searcher');
    // $.each(searches, function(i, search){
    //     search = $(search);
    //     var match = search.data('match');
    //     if(!match.containsMe())
    //     {
    //         if(search.data('attachedCountdown'))
    //         {
    //             Timer.endCountdown(search);
    //         }
    //     }
    // });
    
    
    //At this point we can remove all old timers?
    return;

});

callbacks = {};
callbacks.templateElement = null;
callbacks.onNew = function(id,search){
    var isMine = false;
    if(!this.templateElement)
    {
        this.templateElement = $('.recent_match_searcher.template').detach().removeClass('template');
    }
    var $newElement = this.templateElement.clone();
    $newElement.data('id',search.id);
    $newElement.data('player_id',search.player1.id);

    if(ignoreList[search.player1.id])
    {
        return; //You know what it is
    }

    search = new Match(search);

    search.setDoublesViewAsPriorityIfNeeded();

    if(search.search_time_remaining <= 0)
    {
        return;
    }

    if(!(search.player1 instanceof User)){
        search.player1 = Users.update(search.player1);
    }

    var filter = $('#preferred_game_filter_'+search.ladder_id);
    search.gameData = filter.data();
    var ladderInformation = search.player1.ladder_information;
    if(ladderInformation &&
        ladderInformation.getLeagueForLadder(search.ladder_id))
    {

        var rankFilter = $('#tier_filter_'+ladderInformation.getLeagueForLadder(search.ladder_id).getClassName());
    }
    else
    {
        rankFilter = $();
    }

    if(search.tier_restriction)
    {
        $newElement.addClass('has_tier_restrictions');
        var medal = search.tier_restriction.tier = new League(search.tier_restriction.tier);
        search.tier_restriction.tier.division = 1;
        if(search.tier_restriction.direction == 1)
        {
            $newElement.addClass('tier_restriction_up');
            if(search.tier_restriction.tier.isLessOrEqualTo(myUser.ladder_information.getLeagueForLadder(search.ladder_id)))
            {
                $newElement.addClass('tier_can_challenge');
            }
        }
        if(search.tier_restriction.direction == -1)
        {
            $newElement.addClass('tier_restriction_down');
            if(search.tier_restriction.tier.isGreaterOrEqualTo(myUser.ladder_information.getLeagueForLadder(search.ladder_id)))
            {
                $newElement.addClass('tier_can_challenge');
            }
        }
        ElementUpdate.league($newElement.find('.tier_restriction .league').addClass('show_image'), search.tier_restriction.tier);
    }
    else
    {

        $newElement.addClass('no_tier_restriction');
    }

    if(search.player1.id == myUser.id)
    {
        var mySearchPlayer = search.players[myUser.id];
        $newElement.addClass('is_my_search');
        if(!filter.data('enabled') && Dashboard.is)
        {
            Dashboard.changeGameFilter(search.ladder.id, true);
        }

        if(search.ladder.has_host_code && mySearchPlayer && mySearchPlayer.match)
        {
            if(!Dashboard.hostCodePopup.popup && !mySearchPlayer.match.dolphin_launcher && Settings.isChecked('show_host_code_popup_user_entry'))
            {
                var notificationContent = $('#host_code_notice');
                Dashboard.hostCodePopup.popup = new PNotify({
                    title: null,
                    text: notificationContent.html(),
                    buttons:{
                        sticker: false
                    },
                    icon: false,
                    insert_brs: false,
                    animate_speed: 0,
                    hide: false,
                    before_close: function(notice){
                        $('#host_code_notice').html(notice.text_container.html());
                    }
                });
                if(search.host_code.code || Dashboard.hostCodePopup.code)
                {
                    var codeToUse;
                    if(Dashboard.hostCodePopup.code)
                    {
                        codeToUse = Dashboard.hostCodePopup.code;
                    }
                    else
                    {
                        codeToUse = search.host_code.code;
                    }
                    Dashboard.hostCodePopup.popup.get().find('input').val(codeToUse);
                }
                Dashboard.hostCodePopup.popup.get().find('input').on('keypress',function(e){
                    if(e.keyCode == Dashboard.keyCodes.ENTER)
                    {
                        e.preventDefault();
                    }
                    else
                    {
                        return;
                    }
                    var popup = Dashboard.hostCodePopup.popup.get();
                    var holder = popup.findCache('.host_code_notice_holder');
                    var input = $(this);
                    var value = input.val();

                    if(search.host_code.code == value)
                    {
                        return;//No change
                    }
                    holder.addClass('saving');
                    input.prop('disabled', true);
                    function finished(){
                        input.prop('disabled', false);
                        holder.removeClass('saving');
                    }
                    Dashboard.hostCodePopup.code = value;
                    Request.api({host_code:value}, 'set_host_code')
                        .then(function(response){
                            finished();
                            if(response.error)
                            {

                            }
                        }, function(){
                            alert('error saving');
                            finished();
                        })
                });
            }
            if(Dashboard.hostCodePopup.popup && !Dashboard.hostCodePopup.popup.get().is(':visible'))
            {
                Dashboard.hostCodePopup.popup.open();
            }

        }

        var stickySearch = $newElement.find('.sticky_search');
        stickySearch.on('click',function(e){
            if(search.isSticky)
            {
                search.isSticky.remove();
                var entry = Match.stickySearches[search.id];
                delete Match.stickySearches[search.id];
                search.isSticky = null;

                stickySearch.removeClass('locked');
                stickySearch.addClass('unlocked');

                if(entry.countdownExpired)
                {
                    $newElement.remove();
                    LadderInfo.forceRemove('matchSearches',id, true);
                }
            }
            else
            {
                var valid = true;
                $.each(Match.stickySearches,function(id,stickied) {
                    if (search.isSimilarTo(stickied.match)) {
                        alert('A sticky the same as this match is already active, '+
                            'you do not need to sticky it again.');
                        valid = false;
                        return false;
                    }
                });
                if(!valid)
                {
                    return;
                }
                var content = $('#match_sticky_notice');
                var preferredDistance = $('#preferred_distance_severity');
                var distanceSeverity = preferredDistance.html();
                var notificationContent = content.clone();
                notificationContent.find('.preferred_distance').html(distanceSeverity);
                search.isSticky = new PNotify({
                    title: 'Match Stickied',
                    text: notificationContent.html(),
                    buttons:{
                        sticker: false
                    },
                    icon: false,
                    insert_brs: false,
                    animate_speed: 0,
                    hide: false
                });



                search.isSticky.get().find('.preferred_distance').on('change',function(){
                    Match.stickySearches[search.id].distanceSeverity = $(this).val();
                }).val(preferredDistance.val());

                Match.stickySearches[search.id] = {
                    match:search,
                    distanceSeverity: preferredDistance.val()
                };
                stickySearch.removeClass('unlocked');
                stickySearch.addClass('locked');
            }
        });

        isMine = true;
    }
    else
    {
    }
    search.setupCountdown($newElement, $newElement.find('.countdown'), function(){
        if(Match.stickySearches[id])
        {
            Match.stickySearches[id].countdownExpired = true;
        }
        else
        {
            LadderInfo.forceRemove('matchSearches',id, true);
        }
    });
    $.each(Match.stickySearches,function(id,stickied){
        if(!Dashboard.currentMatch && search.isSimilarTo(stickied.match))
        {
            if(search.player1 && !(search.player1 instanceof User))
            {
                search.player1 = Users.update(search.player1);
            }
            if(search.player1.id == myUser.id)
            {
                return;
            }
            if(!search.player1.location)
            {
                return;
            }
            if(!search.player1.location.distanceFromUser)
            {
                return;
            }

            if(search.player1.location.distanceFromUser.getDistanceSeverity() <= stickied.distanceSeverity)//Allowed
            {
                search.showSimilarSearchBrowserNotification($newElement);
            }
        }
    });
    if(!Dashboard.matchmakingTab.data('paneContainer').hasClass('active'))
    {
        LadderInfo.forceRemove('matchSearches',id, true);
        return;
    }


    $newElement.attr('id','match_search_'+search.id);

    if(rankFilter.length)
    {
        if(search.is_ranked && rankFilter.data('enabled'))
        {
            alert('shown by rank');
            $newElement.removeClass('hidden_by_rank');
        }
        else
        {
            alert('hidden by rank');
            $newElement.addClass('hidden_by_rank');
        }
    }

    if(search.player1.hasToxicWarning())
    {
        var infractions = Infraction.convert(search.player1.reported_match_behavior);
        if(infractions.length >= 2)
        {
            $newElement.addClass('toxic_behavior');
        }
    }

    if(filter.length)
    {
        if(filter.data('enabled'))
        {
            $newElement.removeClass('hidden_by_game');
        }
        else
        {
            $newElement.addClass('hidden_by_game');
        }
    }
    else
    {
        return false;//Just striaght up do not even populate this thing
    }

    $newElement.data('challengeButtonOptions',UserlistElement.displayOptions.challengeButtonOptionsMatchmaking);

    $newElement.data('parentToCountdown',$newElement.find('.countdown'));

    if(search.team_size > 1)
    {
        $newElement.addClass('team_search');
    }

    var bestOfText = updateMatchSearch($newElement,search);
    if(bestOfText === false)//Should not add the match for various reasons
    {
        return;
    }

    search.location = search.player1.location;


    $newElement.addClass('best_of_'+search.match_count);
    var rankedText = search.is_ranked?'Ranked':'Unranked';
    $newElement.addClass('is_ranked_'+(search.is_ranked?'ranked':'unranked'));

    if(ladderInformation.getLeagueForLadder(search.ladder_id))
    {
        $newElement.addClass(ladderInformation.getLeagueForLadder(search.ladder_id).getClassName());
    }
    else
    {
        $newElement.addClass((new League()).getClassName());
    }

    if(search.player1 && search.player1.location)
    {
        $newElement.data('distance', search.player1.location.distanceFromUser.distance);
    }
    else
    {
        $newElement.data('distance', 90000);
    }

    var currentList;
    if(search.is_ranked)
    {
        currentList = Dashboard.recentMatchSearchers.data('ranked_list');
    }
    else
    {
        currentList = Dashboard.recentMatchSearchers.data('friendlies_list');
    }
    $newElement.appendTo(currentList);
    currentList.data('needsSort', true);


    var miniImageUrl = siteUrl+'/images/logos/game-filter-logos/'+search.ladder_slug+'-mini.png';
    $newElement.find('.game_mini_indicator').css('background-image','url('+miniImageUrl+')');

    var challengeHover = $newElement.find('.main_challenge_info_hover');
    if(search.title)
    {
        $newElement.addClass('has_title');
        challengeHover.text(search.title);
    }
    else
    {
        $newElement.addClass('no_title');
        challengeHover.text(rankedText+' '+bestOfText);
    }


    var indicatorButtons = $newElement.find('.game_mini_indicator_hover,.game_mini_indicator');
        indicatorButtons.data('active_button', $newElement.find('.challenge'));
    if(isMine)
    {
        indicatorButtons.attr('title','Click here to cancel');
    }
    else
    {
        search.addSearchPopover(indicatorButtons, search.player1);
        indicatorButtons.attr('title','Click here to challenge '+search.player1.username);
    }

    Dashboard.sortSearchLists();
    return $newElement;
};
Dashboard.recentMatchSearchers.on('click', '.clickable_logo',function(e){
    e.stopImmediatePropagation();
    $(this).data('active_button').trigger('click');
});

Dashboard.recentMatchSearchers.on('click', '.recent_match_searcher .timeout',function(e){
    e.stopImmediatePropagation();
    var timeout = $(this);
    var matchId = $(this).closest('.recent_match_searcher').data('id');
    timeout.addClass('loading');
    $.post(siteUrl+'/matchmaking/stop_matchmaking', {match_id: matchId}).done(function(response){
        if(!response.confirm)
        {
            return;
        }
        var confirmed = confirm('Remove Search?');
        if(!confirmed)
        {
            return;
        }
        $.post(siteUrl+'/matchmaking/stop_matchmaking', {match_id: matchId, confirm: 1}).done(function(){

        });
    }).always(function(){
        timeout.removeClass('loading');
    });
});

callbacks.onRemove = function(id,search,element){
    if(!element)
    {
        //Make sure challenges are also removed
        LadderInfo.forceRemove('openChallenges', id);
        return;
    }

    if(Match.stickySearches[id])
    {
        return;
    }

    var user = search.player1;
    Timer.endCountdown(element.find('.countdown'));
    if(user.match)
    {
        user.match.expiration = null;
        user = Users.create(user);
    }
    var playerInUserList = PlayerUpdater.getPlayerListElementsByPlayerId(user.id);
    if(playerInUserList.length)
    {
        ElementUpdate.updateChallengeButtons(user,playerInUserList.find('.challenge_holder'));
    }
    if(search.accepted_players)
    {
        element.addClass('has_accepted_players');
        var acceptedPlayers = element.find('.accepted_players');
        var playerElements = UserCollection.convertListToElements(search.accepted_players);

        $.each(playerElements, function(i, player){
            acceptedPlayers.append(playerElements);
        });
    }
    if(Dashboard.recentMatchSearchers.hasClass('hard_focus'))
    {
        element.addClass('removing');
        Dashboard.recentMatchSearchers.data('elementsToRemoveOnUnFocus').push(element);
    }
    else
    {
        element.addClass('removing');
        setTimeout(function(){
           element.remove();
        }, 2000);
    }
};
callbacks.onUpdate = function(id,search,element){
    search = new Match(search);
    search.setDoublesViewAsPriorityIfNeeded();
    updateMatchSearch(element,search);
};
callbacks.onPopulate = function(allElements){
    //Fade in now happens in onNew
    Dashboard.sortSearchLists();
};
callbacks.onEmpty = function(id,search,element){
    // $('.recent_match_searchers_container').addClass('emptied');
};
LadderInfo.setCallbacks('matchSearches',callbacks);

var callbacks = {};
callbacks.onNew = function(id,reply){
    var $newElement = $('.pending_reply.template').clone();
    $newElement.removeClass('template');
    $newElement.find('input[name=match_id]').val(reply.id);
    $newElement.find('input[name=player_id]').val(reply.player1.id);

    //Player 2 is always the current player for pending replies
    reply = new Match(reply);
    reply.player1 = Users.update(reply.player1);

    reply.player1.updateUserElements($newElement.find('.username'));
    $newElement.data('challengeButtonOptions',UserlistElement
        .displayOptions.challengeButtonOptionsMatchmaking);

    reply.setupCountdown($newElement, $newElement.find('.countdown'), function(){
        LadderInfo.forceRemove('awaitingReplies',id);
    });

    //
    ElementUpdate.updateMatchCount(reply,$newElement.find('.match_count'));
    var miniImageUrl = siteUrl+'/images/logos/game-filter-logos/'+reply.ladder_slug+'-mini.png';
    $newElement.find('.game_mini_indicator').css('background-image','url('+miniImageUrl+')').attr('title',reply.ladder_name);

    // PlayerUpdater.setPlayerToWaitingForReply(reply.player1.id,reply);

    $newElement.find('.challenged').on('click',function(){
        var player = $(this).closest('.player,.online_user,.request,.other_user_info');
        var player_id = player.find('input[name=player_id]').val();
        var data = {json:1,other_player_id:player_id};

        var challenge = player.find('.challenge');
        var challenged = player.find('.challenged');
        var parent = $(this).closest('.challenge_holder_parent');
        challenge.addClass('active').show();
        challenged.removeClass('active').hide();

        Request.send(data,'cancel_challenge',function(response){
            if(response.success)
            {
                if(response.challenges_removed)
                {
                    $.each(response.challenges_removed,function(i,challenge_id){
                        LadderInfo.forceRemove('awaitingReplies',challenge_id);
                    });
                }
                $('.pending_reply').not('.template').each(function(i,element){
                    var id = $(element).find('input[name=player_id]');
                    var match_id = $(element).find('input[name=match_id]');
                    if(id == player_id)
                    {
                        LadderInfo.forceRemove('awaitingReplies',match_id);
                    }
                });
                if(response.error)
                {
                    alert(response.error);
                    challenge.removeClass('active').hide();
                    challenged.addClass('active').show();
                }
                else
                {
                }
                if(response.message)
                {
                }
            }
            else
            {
                challenge.removeClass('active').hide();
                challenged.addClass('active').show();
            }
            return;
        });
        addGaEvent('matchmaking','unchallenging');
    });

    ElementUpdate.league($newElement.find('.user_information_wrapper .league'),
        reply.player1.ladder_information.getLeagueForLadder(reply.ladder_id));

    $newElement.appendTo('#awaiting_replies');
    return $newElement;
};
callbacks.onRemove = function(id,info,element){
    if(element && element.length)
    {
        element.remove();
    }
};
callbacks.onUpdate = function(id,info,element){
};
callbacks.onPopulate = function(allElements){
    $('.awaiting_replies_container').addClass('has_challenges');
};
callbacks.onEmpty = function(id,info,element){
    $('.awaiting_replies_container').removeClass('has_challenges');
};
LadderInfo.setCallbacks('awaitingReplies',callbacks);

callbacks = {};
callbacks.templateElement = null;
callbacks.onNew = function(id,user){
    var element;
    var newInboxMessages = $();
    element = PrivateChatLoader.getPrivateChat(user, false);
    if(user.message.unread)
    {
        unreadMessageCount++;
        element = PrivateChatLoader.getPrivateChat(user);
        if(element)
        {
            // element.show();
        }
        else
        {
            unreadMessageCount--;
            console.error(user);
            element = $();
        }
    }

    if(!element)
    {
        element = $();
    }

    if(false)
    {
        if(unreadMessageCount == 1)
        {
            $('#new_message_count_container').find('.the_s').hide();
        }
        else
        {
            $('#new_message_count_container').find('.the_s').show();
        }
        if(unreadMessageCount)
        {
            newInboxMessages.text(unreadMessageCount);
            // newInboxMessages.filter('.badge').show(0);
        }
        else
        {
            // newInboxMessages.text('no');
            // newInboxMessages.filter('.badge').hide(0);
        }
        if(!element.data('listElement'))
        {
            if(!this.templateElement)
            {
                this.templateElement = $('.template.inbox_message').clone().removeClass('template');
            }

            var secondElement = this.templateElement.clone();
            secondElement.removeClass('template');
            secondElement.find('.url_to_inbox_message').attr('href',user.message.inbox_url);
            secondElement.find('.from').text(user.username);
            secondElement.find('.time').text(DateFormat.full(user.message.update_time))
                .data('timestamp',user.message.update_time);
            secondElement.find('.message').text(user.message.message);
            secondElement.data('id',id);

            secondElement.insertAfter('#new_message_count_container');

            if(isInLadder)
            {
                secondElement.click(function(e){
                    e.preventDefault();
                    PrivateChatLoader.openPrivateChat({username:secondElement.find('.username').text(),id:secondElement.data('id')}).load();
                });
            }
            element.data('listElement',secondElement);
        }
    }
    if(user.username)
    {
        element.data('username', user.username);
    }

    // user.updateUserElements(element.find('.user'));


    var directChatsElement = element.data('listing');
    if(directChatsElement && user.message.message)
    {
        directChatsElement.findCache('.message_summary').text(user.message.message).attr('title',user.message.message).removeClass('no_messages');
        directChatsElement.findCache('.time').add(element.find('.time')).timestampUpdate(user.message.date);
    }
    if(user.message.unread)
    {
        MatchSounds.playPrivateMessageSoundEffect();
        element.data('update_time',user.message.update_time);
        element.addClass('has_new_messages');
        if(directChatsElement)
        {
            directChatsElement.addClass('has_new_messages');
        }
    }
    else
    {

    }
    PrivateChatLoader.updateUnreadPrivateMessageCount();

    return element;
};
callbacks.onRemove = function(id,info,element){
    element.addClass('removing').fadeOut('fast',function(){$(this).remove();});
};
callbacks.onUpdate = function(id,user,element){
    var message = user.message;
    if(message.unread)
    {
        var listElement = element.data('listElement');
        if(listElement && listElement.length)
        {
            ElementUpdate.user(listElement,user);
        }
        if(element.data('update_time') == undefined || message.update_time > element.data('update_time'))
        {
            element.data('update_time',message.update_time);
            if(!element.hasClass('opened'))
            {
                element.addClass('has_new_messages');
            }
            MatchSounds.playPrivateMessageSoundEffect();
        }
    }
};
callbacks.onPopulate = function(allElements){
    $('#private_chat_listing').find('.private_chat_listing').tsort('.time',{data:'timestamp',order:'desc'});
};
callbacks.onEmpty = function(id,info,element){
};
LadderInfo.setCallbacks('recentPrivateMessages',callbacks);


callbacks = {};
callbacks.disputeContainer = $('#disputes');
callbacks.onNew = function(id,match){
    var $newElement;
    match = new Match(match);
    $newElement = $('.disputed_match.template').clone();

    $newElement.data('match',new Match(match));
    $newElement.removeClass('template');

    ElementUpdate.dispute($newElement,match);

    var disputesContainer = $('#disputes').find('.has_disputes');
    $newElement.appendTo(disputesContainer);
    return $newElement;
};
callbacks.onAlways = function(allElements){
    var disputesContainer = $('#disputes');
    var disputeCount = disputesContainer.find('.has_disputes li').not('.removing').length;
    $('.dispute_tab_button').find('.count').text(disputeCount);
};
callbacks.onRemove = function(id,info,element){
    element.addClass('removing').fadeOut(0,function(){
        $(this).remove();
    });
};
callbacks.onUpdate = function(id,info,element){
};
callbacks.onPopulate = function(allElements){
    this.disputeContainer.find('.has_disputes').show();
    this.disputeContainer.addClass('notification');
    this.disputeContainer.find('.no_disputes').hide();
    Dashboard.disputesTab.addClass('has_disputes');
    Dashboard.disputesTab.removeClass('no_disputes');
};
callbacks.onEmpty = function(id,info,element){
    this.disputeContainer.find('.no_disputes').show();
    this.disputeContainer.removeClass('notification');
    this.disputeContainer.find('.has_disputes').hide();
    Dashboard.disputesTab.addClass('no_disputes');
    Dashboard.disputesTab.removeClass('has_disputes');
};
LadderInfo.setCallbacks('disputedMatches',callbacks);

var chatMessageCallbacks = {};
chatMessageCallbacks.templateElement = null;
$('#chat_popup_card').on('notClicked',function(){
    $(this).data('currentElement').removeClass('delete_highlight');
});
chatMessageCallbacks.timeOptionsClick = function(e,element){
    var card = $('#chat_popup_card');
    var message = element.data('message');

    if(card.data('currentElement'))
    {
        card.data('currentElement').removeClass('delete_highlight');
    }
    card.data('currentElement',element);

    card.removeClass('can_delete is_me is_not_moderator is_moderator');

    card.find('.delete').off('click').on('click',function(){
        element.trigger('deleteMessage');
        card.trigger('notClicked');
    });
    card.find('.remove').off('click').on('click',function(){
        element.trigger('deleteMessage',[true]);
        card.trigger('notClicked');
    });
    card.find('.undelete').off('click').on('click',function(){
        if(message.is_shadow_muted)
        {
            element.trigger('unshadowMuteMessage');
        }
        else
        {
            element.trigger('undeleteMessage');
        }
        card.trigger('notClicked');
    });
    card.find('.purge').off('click').on('click',function(){
        if(!confirm('Delete all visible messages posted by '+message.player.username+'?'))
        {
            return;
        }
        card.data('findOtherUserMessages')(message.player.id).each(function(i,message){
            $(message).trigger('deleteMessage',[false]);
        });
        card.trigger('notClicked');
    });
    card.find('.scorch').off('click').on('click',function(){
        if(!confirm('REMOVE all visible messages posted by '+message.player.username+'?'))
        {
            return;
        }
        card.data('findOtherUserMessages')(message.player.id).each(function(i,message){
            $(message).trigger('deleteMessage',[true]);
        });
        card.trigger('notClicked');
    });
    card.find('.report').off('click').on('click',function(){
        Dashboard.closeDeclickables();
        reportToMods('Reporting '+message.player.username,null,message.getContext());
    });
    card.find('.purge, .scorch').off('mouseenter').on('mouseenter',function(){
        card.data('findOtherUserMessages')(message.player.id).addClass('delete_highlight');
    }).on('mouseleave',function(){
        card.data('findOtherUserMessages')(message.player.id).not(element).removeClass('delete_highlight');
    });

    card.data('findOtherUserMessages',function(id){
        return element.data('chatContainer').find('.chat_message.user_id_'+message.player.id);
    });


    var chatContainer = element.data('chatContainer');
    if(!chatContainer)
    {
        chatContainer = $();
    }
    if(myUser.is_mod ||  chatContainer.data('isChatMod') || chatContainer.data('isChatAdmin'))
    {
        card.addClass('is_moderator').addClass('can_delete');
    }
    else
    {
        card.addClass('is_not_moderator');
    }
    if(myUser.id == message.player.id && !message.deleted)
    {
        card.addClass('is_me');
        if(!message.deleted)
        {
            card.addClass('can_delete');
        }
    }



    card.data('canBeUnclicked',false);

    setTimeout(function(){
        card.data('canBeUnclicked',true);
    },10);
    var clonedElement = element.clone();

    element.addClass('delete_highlight');

    clonedElement.find('.time_holder').removeClass('clickable');
    clonedElement.find('.username').addClass('unclickable');
    clonedElement.find('.message').attr('title',clonedElement.find('.message').text());
    var previewArea = card.find('.message_preview').empty().append(clonedElement);




    var data = {};
    data.id = message.player.id;
    if(element.data('chatContainer') && element.data('chatContainer').data('chat') && element.data('chatContainer').data('chat').data('chat_room_id'))
    {
        data.chat_room_id = element.data('chatContainer').data('chat').data('chat_room_id');
    }

    card.show();
    // if(data.chat_room_id)
    // {
    //     card.addClass('loading');
    // }

    message.deleted ? card.addClass('message_deleted') : card.removeClass('message_deleted');
    message.is_shadow_muted ? card.addClass('message_removed') : card.removeClass('message_removed');

    message.deleted || message.is_shadow_muted ? card.removeClass('cannot_undelete') :card.addClass('cannot_undelete');


    var timeHolder = element.find('.time_holder');
    var rightOfTimeHolder =  (timeHolder.offset().left + timeHolder.outerWidth());
    Dashboard.keepContainerOnScreen(card,{x: rightOfTimeHolder ,y: e.pageY-40});
};
chatMessageCallbacks.onNew = function(id,message,container){
    var callbacks = this;
    var loadingAllMessages = container.data('loadingAllMessages');
    var chatMessagesHolder = container;

    if(!this.templateElement)
    {
        this.templateElement = ChatActions.getChatMessageTemplate()
            .addClass('normal_message');
        this.templateElement.find('.time_holder').addClass('clickable');
    }
    var $newElement = this.templateElement.clone();
    var chatContainer = $newElement.data('chatContainer',container);
    $newElement.data('time',message.time);

    message = new ChatMessage(message);
    $newElement.data('message',message);


    if( (message.player && ignoreList[message.player.id]) && !isMod && !message.is_chat_mod && !myUser.is_chat_mod)
    {
        return;
    }
    if(ignoreList[message.player.id])
    {
        $newElement.addClass('is_ignored');
    }



    if(ChatActions.updateChatMessage($newElement,message,loadingAllMessages) === false)
    {
        return null;
    }

    if(myUser.is_ladder_mod)
    {
        if(message.behavior_issues)
        {
            $newElement.addClass('is_hitlisted');
        }
    }

    if(message.is_muted && message.player.id == myUser.id)
    {
        var until = DateFormat.hourMinutes(message.is_muted);
        if(loadingAllMessages)
        {
            return;
            ChatActions.addNotificationToChat(chatMessagesHolder,'This message was blocked from being sent.');
        }
        else
        {
            ChatActions.addNotificationToChat(chatMessagesHolder,'You are muted until '+until+'. Circumventing this by logging into alt accounts is grounds for long term suspension.');
        }
    }

    var orderItem = {element:$newElement,id:id,time:message.time};
    var items = container.data('messages').items;

    var insertMessage = null;

    var placedMessages = chatMessagesHolder.find('.chat_message.normal_message');
    // var placedMessages = chatMessagesHolder.items;


    var insertIndex = ChatMessages.findPositionForMessage(placedMessages,$newElement);

    // var insertIndex = null;

    if(insertIndex instanceof jQuery)
    {
        insertMessage = insertIndex;
        if(!insertMessage.data('usePrevious'))
        {
            insertMessage.data('usePrevious',null);
            var next = insertMessage.next();
            if(next.length)
            {
                insertMessage = next;
            }
        }
        insertMessage.data('usePrevious',null);
    }
    else if(insertIndex !== null)
    {
        insertMessage = $(placedMessages.get(insertIndex));
    }
    else
    {
        insertMessage = null;
    }

    var sender = $newElement.find('.sender');
    if(message.player.id)
    {
        // ElementUpdate.user($newElement.find('.'),message.player);
        // var user = message.player;
        // ElementUpdate.flair(sender,user);
    }
    if(showGlowColors && message.player.glow_color && message.player.is_subscribed)
    {
        sender.css('text-shadow','-1px 1px 8px '+message.player.glow_color+', 1px -1px 8px '+message.player.glow_color);
    }
    if(message.player.id == myUser.id && !loadingAllMessages)
    {
        //Doesn't count as a new message, just confirming that the message was received
        var tempMessages = chatMessagesHolder.find('.chat_message.my_temp_message');
        var replaceMessage = null;
        tempMessages.each(function(){
            var tempMessage = $(this);
            if(tempMessage.data('send_id') == message.send_id)
            {
                replaceMessage = tempMessage;
                return null;
            }
        });
    }

    if(!replaceMessage)
    {
        chatMessagesHolder.data('newMessagesAdded',message);
        if(insertMessage)
        {
            var temp = $('<div>')

            var previousMessage = insertMessage.prev();

            if(insertMessage.prev().hasClass('chat_notification'))
            {
                temp.insertBefore(insertMessage.prev());
            }
            else
            {
                temp.insertBefore(insertMessage);
            }
            replaceMessage = temp;
        }
        else
        {
            var replaceMessage = null;
        }
    }
    if(!$newElement.hasClass('state_message'))
    {
        ChatActions.addMessageToChat(chatMessagesHolder,$newElement,replaceMessage);
    }
    if(!loadingAllMessages && !container.hasClass('scrolled_up'))
    {
        ChatActions.removeExtraMessagesFromChatContainer(chatMessagesHolder, container, placedMessages);
    }
    return $newElement;
};
ChatActions.removeExtraMessagesFromChatContainer = function(chatMessagesHolder, container, placedMessages){
    var limit = null;
    if(BrowserHelper.isPhone)
    {
        limit = 40;
    }
    else
    {
        limit = 45;
    }

    var deletionSafeIterations = 10;
    if(typeof chatMessagesHolder.data('checkForDeletions') == 'undefined' )
    {
        chatMessagesHolder.data('checkForDeletions',deletionSafeIterations);
        return;
    }
    if(chatMessagesHolder.data('checkForDeletions') > 0)
    {
        chatMessagesHolder.data().checkForDeletions--;
        return;
    }
    if(chatMessagesHolder.data('checkForDeletions') <= 0)
    {
        chatMessagesHolder.data().checkForDeletions = deletionSafeIterations;
    }
    var chatElements;
    if(false && placedMessages)
    {
        chatElements = placedMessages;
    }
    else
    {
        chatElements = container.children();
    }
    var totalElements = chatElements.length;
    if(totalElements > limit)
    {
        limit = limit + 10; //Jus tos that it does not need to happen for another 10 messages
        var current = 0;
        var deleteTopFew = false;

        chatElements.each(function(i,message){
            var position = totalElements - current;
            if(position > limit)
            {
                var messageElement = $(message);
                if(messageElement.hasClass('chat_notification'))
                {
                    messageElement.remove();
                    current++;
                    return;
                }
                if(container.data('loadedAll'))
                {
                    container.data('loadedAll',false)
                }
                var data = $(message).data();
                LadderInfo.forceRemove(container.data('messages'),data.message_id,true);
                if(messageElement)
                {
                    messageElement.remove(); //Just in case?
                }
                deleteTopFew = true;
            }
            else
            {
                return false;//Break out
            }
            current++;
        });
        if(deleteTopFew)
        {

        }

    }
};
chatMessageCallbacks.onAlways = function(allElements, container){
    if(container)
    {
        // console.log('[should scroll]', container.data('shouldScrollToBottom'));
        if(container.data('shouldScrollToBottom'))
        {
            ChatActions.scrollToBottom(container);
            container.data('shouldScrollToBottom', false);
        }
    }
};
chatMessageCallbacks.onRemove = function(id,info,element){
    if(element)
    {
        element.remove();
    }
};
chatMessageCallbacks.onUpdate = function(id,info,element,container){
    if(element)
    {
        info = new ChatMessage(info);
        element.data('message',info);
        ChatActions.updateChatMessage(element,info,container.data('isPopulated'));
    }
    else
    {
        return this.onNew(id,info,container);
    }
    if(element.data('shadowMuted') && !info.is_shadow_muted)
    {
        element.trigger('unshadowMute');
    }
};
chatMessageCallbacks.onPopulate = function(allElements){
};
chatMessageCallbacks.onEmpty = function(id,info,element){
};
LadderInfo.setCallbacks('chatMessages',chatMessageCallbacks);

var userlistCallbacks = {};

var UserlistSection = function(name){
    this.element = $('<div>',{class:'userlist_section'});
    this.name = name;
    this.heading = $('<h4>',{class:'heading'}).text(name);
    this.heading.appendTo(this.element);
    this.listElement = $('<ul>',{class:'section_list'});

    this.listElement.appendTo(this.element);


    this.userlistElement = null;
    this.users = {};
    this.length = 0;
    return this;
};
UserlistSection.prototype.addSectionToUserlist = function(list){
    this.userlistElement = list;
    this.element.appendTo(list);
};
UserlistSection.prototype.addUserToSection = function(userElement){
    if(this.users[userElement.user.ud])
    {
       return;
    }
    if(!this.length)
    {
        this.element.addClass('active');
    }
    this.length++;
    userElement.element.appendTo(this.listElement);
    this.users[userElement.user.id] = userElement;
};
UserlistSection.prototype.removeUserFromSection = function(user){
    if(this.users[user.id])
    {
        this.length--;
        this.users[user.id].remove();
        delete this.users[user.id];
    }
    if(!this.length)
    {
        this.element.removeClass('active');
    }
};
userlistCallbacks.templateElement = null;
userlistCallbacks.refreshDisplay = function(){

};
userlistCallbacks.skipExtendOnUpdate = true;
userlistCallbacks.addUserToList = function(id,userlistElement,container){
    var chatMessagesHolder = container;
    var chat = chatMessagesHolder.data('chat');
    var userlist = chat.data('userlist');
    var user = userlistElement.user;

    user.getUserlistElements(UserlistElement.displayOptions.challengeButtonOptionsOnlineUser);

    var $newElement = UserlistElement.newElement();
    userlistElement.element = $newElement;
    userlistElement.displayOptions = UserlistElement.displayOptions.challengeButtonOptionsOnlineUser;
    //$newElement.find('.last_message_time').remove();

    //$newElement.data('challengeButtonOptions',challengeButtonOptionsOnlineUser);
    $newElement.data('id',user.id);
    if(user)
    {
        $newElement.data('user',user);
    }


    user.is_online = true;
    user.rating = null;
    if(chat.data('button'))
    {
        if(chat.data('button').data('ladder_id'))
        {
            if(user.rankings)
            {
                var ranking = user.rankings[chat.data('button').data('ladder_id')];
                if(ranking && ranking.rating)
                {
                    user.rating = ranking.rating;
                }
            }
        }
    }

    if(user.id == myUser.id)
    {
        if(user.is_chat_mod)
        {
            myUser.is_chat_mod = true;
            chatMessagesHolder.data('isChatMod',true);
        }
        if(user.is_chat_admin)
        {
            chatMessagesHolder.data('isChatAdmin',true);
        }
    }
    userlistElement.update();

    if(!userlist.data('sections'))
    {
        userlist.data('sections',[
            new UserlistSection('Chat Admin'),
            new UserlistSection('Mods'),
            new UserlistSection('Players')
        ]);
        $.each(userlist.data('sections'), function(id, section){
            section.addSectionToUserlist(userlist);
        })
    }
    var sections = userlist.data('sections');

    /** Section selection */
    if(user.chat_rooms.isAdmin(chat.data('chat_room_id')) || user.is_mod)
    {
        sections[0].addUserToSection(userlistElement);
    }
    else if(user.chat_rooms.isMod(chat.data('chat_room_id')))
    {
        sections[1].addUserToSection(userlistElement);
    }
    else
    {
        sections[2].addUserToSection(userlistElement);
    }

    //ElementUpdate.user($newElement,user);
    //ElementUpdate.userTypes($newElement.find('.username'),user);

    //Change user's status in pm list and friends list
    user.is_online = true;

    $newElement.data('userlist',userlist);
    $newElement.data('chatMessagesHolder',container);
    return $newElement;
};
userlistCallbacks.onNew = function(id,user,container){
    var chatMessagesHolder = container;
    var userOriginal = user;
    user = Users.create(user);
    user.setProperties({chat_rooms:userOriginal.chat_rooms});//just in case this is not set by the create
    var chat = chatMessagesHolder.data('chat');
    var userlist = chat.data('userlist');
    var button = chat.data('button');
    //TODO: finish this
    //if(!$('#show_online_users').hasClass('active') && !$('#show_preferred_users').hasClass('active'))
    //{
    //    return;
    //}

    var callbacks = this;

    if(userlist)
    {
        if(!userlist.data('users'))
            userlist.data('users',0);
        userlist.data('users', userlist.data('users')+1);
        if(!userlist.data('userMap'))
        {
            userlist.data('button',button);
            userlist.data('userMap',{});
            userlist.data('pendingUserMap',{});
            userlist.on('refreshDisplay',function(e){
                var list = $(this);
                var pending = list.data('pendingUserMap');
                $.each(pending,function(id,useless){
                    var newElement = callbacks.addUserToList(id,list.data('userMap')[id],chatMessagesHolder);
                    delete pending[id];
                });
                ChatActions.sortUserList(list)
            });

            userlist.data('refreshSoon',function(customTimeout){
                if(customTimeout)
                {

                }
                else
                {
                    customTimeout = 10000+(userlist.data('users')*100);
                }
                if(userlist.data('currentTimeout'))
                {
                    return;
                }
                userlist.data('currentTimeout',setTimeout(function(){
                        if(button.hasClass('active'))
                        {
                            userlist.trigger('refreshDisplay');
                        }
                        userlist.data('currentTimeout',null);
                    },customTimeout)
                )
            });
            if(button && button.hasClass('active'))
            {
                userlist.data('refreshSoon')(1000);
            }
            else
            {
                //userlist.data('refreshSoon');
            }
        }
        var userMap = userlist.data('userMap');
        var pendingUserMap = userlist.data('pendingUserMap');
        userMap[user.id] = user.addNewUserlistElement(null);
        pendingUserMap[user.id] = true;

        if(button && button.hasClass('active'))
        {
            userlist.data('refreshSoon')();
        }
        return userlist;
    }
    return;
};
userlistCallbacks.onAlways = function(allElements,container){
    if(!container)
    {
        return;
    }
    var chat = container.data('chat');
    var userlist = chat.data('userlist');
    var totalUsers = userlist.data('users');
    if(chat.data('button'))
    {
        if(userlist.hasClass('active'))
        {
            $('#user_list_information').data('countElement').text(userlist.data('users'));
        }
    }
};
userlistCallbacks.onRemove = function(id,userlistResponse,userlist){
    if(userlistResponse.is_removed)
    {
        // var notificationMessage = '<span class="username">'+userlistResponse.username +'</span> left.';
    }
    else
    {
        ladder.log('cannot do this function');
    }
    if(userlist)
    {
        var map = userlist.data('userMap');
        var pending = userlist.data('pendingUserMap');
        var userlistElement = map[id];
        if(userlistElement)
        {
            var element = userlistElement.remove();
            if(userlist.data('sections'))
            {
                $.each(userlist.data('sections'), function(i, section){
                   section.removeUserFromSection({id:id});
                });

            }
        }
        delete map[id];
        delete pending[id];
        userlist.data('users', userlist.data('users')-1);
    }
};
userlistCallbacks.onUpdate = function(id,info,userlist){
    var  map = userlist.data('userMap');
    if(map && map[id])
    {
        var userlistElement = map[id];
        if(userlistElement.element)
        {
            //Disable updating the element :3
            //ElementUpdate.user(userlistElement.element,info);
        }
    }
};
userlistCallbacks.onPopulate = function(allElements){
//		ladder.log('Update to add message date timestamps');
};
userlistCallbacks.onEmpty = function(id,info,element){
};
LadderInfo.setCallbacks('userlists',userlistCallbacks);

LadderHistory.popUserActionState = function(){
    var state = LadderHistory.history.getState();
    var data = state.data;
    if(data.type && data.type == 'userAction')
    {
        console.log(data);
        alert('here');
        return LadderHistory.history.back();
    }
    return false;
};
LadderHistory.checkUserActionState = function(){
    var state = LadderHistory.popUserActionState();
    console.log(state);
    if(state)
    {
        window[data.action]();
    }
};
function checkDeclickables(event)
{
    var declicked = false;
    if(Ladder.declickables.length)
    {
        Ladder.declickables = $.grep(Ladder.declickables,function(declick, i){
            if(!declick.data('canBeUnclicked'))
            {
                return true;
            }
            if(!event || ( event.target !== declick[0] && !declick.has($(event.target)).length ) )
            {

                declicked = true;
                var removeAfter = declick.data('removeFromDeclickables');
                declick.trigger('notClicked',[event]);
                if(removeAfter)
                {
                    return false;
                }
            }
            return true;
        });
    }
    return declicked;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function PingAverage(){
    var pingList = [];
    var pingAverage = null;
    var pingListSize = 10;
    var actualAverage = null;
    var that = this;
    this.getAverage = function(){
        return actualAverage;
    };
    this.add = function(amount){
        var total = 0;
        pingList.push(amount);
        if(pingList.length > 10)
        {
            pingList.shift();
        }
        for(var i = 0; i < pingList.length; i++)
        {
            total += pingList[i];
        }
        if(total > 0)
        {
            actualAverage = total / pingList.length;
        }
        else
        {
            actualAverage = 0;
        }
        return that;
    }
}

(function( $ ) {

    var proto = $.ui.autocomplete.prototype,
        initSource = proto._initSource;

    function filter( array, term ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
        return $.grep( array, function(value) {
            return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
        });
    }

    $.extend( proto, {
        _initSource: function() {
            if ( this.options.html && $.isArray(this.options.source) ) {
                this.source = function( request, response ) {
                    response( filter( this.options.source, request.term ) );
                };
            } else {
                initSource.call( this );
            }
        },

        _renderItem: function( ul, item) {
            return $( "<li></li>" )
                .data( "item.autocomplete", item )
                .append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
                .appendTo( ul );
        }
    });

})( jQuery );

setInterval(BrowserNotification.checkBrowserFocus,8000);



/** WEBPACK FOOTER **
 ** ./../app/matchmaking.jsx
 **/