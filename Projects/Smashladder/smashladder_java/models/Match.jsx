import {matchModeManager} from "models/MatchModeManager.jsx";
import {MatchModeManager} from "models/MatchModeManager.jsx";
import {User} from "../models/User.jsx";
import {Users} from "app/matchmaking.jsx";
import {LadderDistance} from "../components/LadderDistance.jsx";
import {Request} from "components/Request.jsx";
import {BrowserNotification} from "components/BrowserNotification.jsx";
import {MatchSounds} from "components/MatchSounds.jsx";
import {LadderInfo} from "components/LadderInfo.jsx";
import {Timer} from "components/Timer.jsx";
import {Dashboard} from "components/Dashboard.jsx";
import {UserCollection} from "./UserCollection";

export var Match = function(matchData){
    var match = matchData;
    for(var k in matchData){
        if(matchData.hasOwnProperty(k))
        {
            this[k]=matchData[k];
        }
    }
    this.matchContainer = null;
    this.playerList = null;
    this.isFirst = true;
    this.matchReference = match;
    this.perspectivePlayer = null;
};

Match.prototype.report = function(result, disputeMessage, buttons){
    var data = {won:result,message:disputeMessage,match_id:this.id};
    if(buttons)
    {
        buttons.prop('disabled',true).addClass('disabled');
    }
    Request.send(data,'report_match').done(function(response){

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
        return true;
    }).always(function(){
        if(buttons)
        {
            buttons.prop('disabled',false).removeClass('disabled');
        }
    }).fail(function(){
        alert("There was a server side error");
    });
    addGaEvent('matchmaking','report-match');
};
Match.prototype.updateChanges = function(newMatch){
    var currentMatch = this;
    if(newMatch == currentMatch)
    {
        return newMatch;
    }
    newMatch.isFirst = false;
    newMatch.setMatchContainer(this.matchContainer);
    newMatch.playerList = this.playerList;

    if(true)//Currently doesn't do anything...
    {
        //Check match players
        $.each(this.players,function(i,player){
            if(player.match.still_chatting)
            {
                if(newMatch.players[i] && newMatch.players[i].match && !newMatch.players[i].match.still_chatting)
                {
                    //currentMatch.postNotification(player.player.username+' left the match chat.');
                }
            }
        });

    }
    //Check match lobby
    return newMatch;
};
Match.prototype.setPerspectivePlayer = function(player){
    this.perspectivePlayer = player;
};
Match.prototype.getOtherPlayerElements = function(){
    var otherPlayers = this.getOtherPlayers();
    return UserCollection.convertListToElements(otherPlayers);
};
Match.prototype.getPlayers = function(){
    var playerList = [];
    if(this.players) //Primary list
    {
        $.each(this.players,(i,player) =>
        {
            player = player.player;
            playerList.push(Users.update(player));
        });
    }
    return playerList;
};
Match.prototype.getOtherPlayers = function(){
    var playerList = [];
    if(!this.perspectivePlayer)
    {
        throw 'setPerspectivePlayer(player) needs to be used in order to call this function';
    }
    if(this.isSingles())
    {
        if(this.player1.id != this.perspectivePlayer.id)
        {
            playerList.push(Users.update(this.player1));
        }
        if(this.player2.id != this.perspectivePlayer.id)
        {
            playerList.push(Users.update(this.player2));
        }
        return playerList;
    }
    if(this.players) //Primary list
    {
        $.each(this.players,(i,player) =>
        {
            player = player.player;
            if(player.id != this.perspectivePlayer.id)
            {
                playerList.push(Users.update(player));
            }
        });
        return playerList;
    }
    if(this.lobby)
    {
        $.each(this.lobby.players,(i,player) => {
            if(player.id != this.perspectivePlayer.id)
            {
                playerList.push(Users.update(player));
            }
        });
        return playerList;
    }
};
Match.prototype.postNotification = function(message, callback){
    if(this.matchContainer.data('chat_container'))
    {
        this.matchContainer.data('chat_container').trigger('postNotification',[message, callback]);
    }
    else
    {
        console.log('Could not post notification:', message);
    }
};
Match.prototype.scrollToBottom = function(message, callback){
    if(this.matchContainer.data('chat_container') && this.matchContainer.data('chat_container').data('reScroll'))
    {
        this.matchContainer.data('chat_container').data('reScroll')()
    }
};
Match.prototype.setMatchContainer = function(container){
    this.matchContainer = container;
};
Match.prototype.containsPlayer = function(player){
    if(this.player1 && this.player1.id == player.id || this.player2 && this.player2.id == player.id)
    {
        return true;
    }
    if(this.players)
    {
        return !!this.players[player.id];
    }
    return false;
};
Match.prototype.lobbyIsOpenOnMyScreen = function(){
    return $('#match_container_'+this.id).length > 0;
};
Match.prototype.containsMe = function(){
    return this.containsPlayerInLobby(myUser);
};
Match.prototype.containsPlayerInLobby = function(player){
    if(this.lobby && this.lobby.players)
    {
        return !!this.lobby.players[player.id];
    }
    return false;
};
Match.prototype.getMatchPlayerCount = function(){
    var count = 0;
    $.each(this.players,function(i,player){
        if(player.match && player.match.still_chatting)
        {
            count++;
        }
    });
    return count;
};
Match.prototype.atLeastOneOtherPlayerIsChatting = function(){
    return this.getMatchPlayerCount() > 1;
};
Match.prototype.isSingles = function(){
    return this.team_size == 1;
};
Match.prototype.isDoubles = function(){
    return this.team_size == 2;
};
Match.prototype.usesTeamList = function(){
    return this.playerList !== null;
};
Match.prototype.setTitleElement = function(){
    this.matchContainer;
};
Match.prototype.getUrl = function(){
    return siteUrl+'/match/view/'+this.id;
};
Match.summaryTemplate = null;
Match.prototype.generateSummary = function(){
    if(!Match.summaryTemplate)
    {
        Match.summaryTemplate = $('.summary_template.template').remove().clone().removeClass('template')
    }
};
Match.prototype.populateCharacters = function(){
    var match = this;
    var characters = match.characters;
    var characterTemplate = $('#character_template').find('.character');
    var characterPicks = this.matchContainer.find('.character_picks');

    $.each(characters,function(i,character){
        var element = characterTemplate.clone();
        element.removeClass('character_for_game_')
            .addClass('character_for_game_'+match.game_slug)
            .addClass('character_name_'+character.slug_name)
            .addClass('character_id_'+character.id)
        ;
        element.attr('title',character.name);
        element.find('input[name=character_id]').val(character.id);
        element.find('input[name=name]').val(character.name);
        element.find('.name').text(character.name);
        element.data('name',character.name);
        element.data('id',character.id);
        element.css('background-image','url('+character.image_url+')');
        element.appendTo(characterPicks);
    });

};
Match.prototype.populateStages = function(){
    var match = this;
    var stages = match.stages;
    var stageTemplate = $('#stage_template').find('.stage');
    var stagePicks = this.matchContainer.find('.stage_picks');
    $.each(stages,function(i,stage){
        var element = stageTemplate.clone();
        element.removeClass('stage_for_game_').
        addClass('stage_for_game_'+match.game_slug);
        element.css('background-image','url('+stage.image_url+')');
        element.attr('title',stage.name);
        element.find('input[name=stage_id]').val(stage.id);
        element.find('input[name=name]').val(stage.name);
        element.find('.name').text(stage.name);
        element.data('name',stage.name);
        element.appendTo(stagePicks);
    });
};
Match.prototype.getTeamCount = function(){
    var teams = {};
    var total = 0;
    var match = this;
    $.each(this.players,function(i,player){
        match.players[i].player = Users.update(player.player);
        if(!teams[player.team_number])
        {
            total++;
            teams[player.team_number] = 1;
        }
    });
    return total;
};
Match.prototype.updateTeamLists = function(){
    var teamListTemplate = this.matchContainer.find('.team_list.template');
    if(!this.lobby.invited)
    {
        this.lobby.invited = {};
    }
    if(this.team_size == 1)
    {
        return;
    }
    if(!this.playerList)
    {
        this.playerList = {
            element:null,
            userlist:null,
            players:{}
        };
        this.playerList.element = teamListTemplate.removeClass('template');
        this.playerList.userlist = this.playerList.element.find('.userlist');
    }
    var match = this;

    // alert('update lists');
    $.each(this.lobby.players, function(i, player){ match.addToLobbyList(i, player) });
    $.each(this.lobby.invited, function(i, player){ match.addToLobbyList(i, player) });


    $.each(this.playerList.players,function(i,player){
        if(!match.lobby.players[i] && !match.lobby.invited[i])
        {
            match.removePlayerFromPlayerList(player);
            return true;
        }
    });
};

Match.prototype.addToLobbyList = function(i, player){
    var match = this;
    var isInMatch = !!match.players[i];
    var addedElement;
    addedElement = match.playerList.players[i];
    if(addedElement)
    {
        //Already exists... Update the player I suppose? Perhaps match them to their match team and such, etc
        addedElement = addedElement.element;
    }
    else
    {
        addedElement = match.addPlayerToPlayerList(player);
    }

    if(match.lobby.players[player.id])
    {
        addedElement.joined = true;
    }
    if(addedElement.joined && !addedElement.joinedAnnounced)
    {
        if(!match.isFirst)
        {
            match.postNotification(player.username + ' has joined the match.');
            MatchSounds.playJingles();
            BrowserNotification.showNotification(
                'New Player!',
                {
                    body: player.username + ' has joined the match.'
                }
                /*challengeNotificationOptions*/ );
        }
        addedElement.joinedAnnounced = true;
    }
    if(player.id == myUser.id)
    {
        addedElement.addClass('is_me');
    }

    if(match.lobby.invited[i])
    {
        addedElement.addClass('invited');
        addedElement.removeClass('pending');
        addedElement.removeClass('accepted');

    }
    else
    {
        addedElement.removeClass('invited');
        if(match.players[i])
        {
            addedElement.addClass('accepted');
            addedElement.removeClass('pending');
            if(match.players[i].match && match.players[i].match.team_number)
            {
                if(match.players[i].match.team_number === 1)
                {
                    addedElement.data('selected_team', 1);
                }
                else if(match.players[i].match.team_number === 2)
                {
                    addedElement.data('selected_team', 2);
                }
                if(addedElement.data('selected_team'))
                {
                    var changeSelectedTeamTo = addedElement.data('selected_team');
                    if(addedElement.data('selected_team') != addedElement.data('set_selected_team'))
                    {
                        addedElement.data('set_selected_team', changeSelectedTeamTo);

                        var buttons = addedElement.find('.select_team_button');
                        var selectedButton = buttons.filter('[data-team_number='+changeSelectedTeamTo+']');
                        buttons.removeClass('active');
                        selectedButton.addClass('active');
                    }
                }
                else
                {
                    addedElement.find('.select_team_button').removeClass('active');
                }
            }
        }
        else
        {
            addedElement.removeClass('accepted');
            addedElement.addClass('pending');
        }
    }
};
Match.prototype.addPlayerToPlayerList = function(player){
    var match = this;
    var userlistElement = Match.createUserlistElement();

    var acceptButton = userlistElement.find('.accept_player');
    var declineButton = userlistElement.find('.decline_player');
    var uninviteButton = userlistElement.find('.invited_pending');
    var selectTeamButton = userlistElement.find('.select_team_button');
    var disableButtons = function(){
        acceptButton.add(declineButton).add(uninviteButton).prop('disabled',true);
    };
    var enableButtons = function(){
        acceptButton.add(declineButton).add(uninviteButton).prop('disabled',false);
    };


    selectTeamButton.on('click', function(e){
        e.stopImmediatePropagation();
        var button = $(this);
        if(!button.closest('.is_me').length)
        {
            return;
        }
        var teamNumber = button.data('team_number');
        selectTeamButton.prop('disabled', true);
        var data = {};
        data.match_id = match.id;
        data.team_number = teamNumber;

        $.post(siteUrl+'/match/select_team_number', data).done(function(response){
            selectTeamButton.removeClass('active');
            if(response.success)
            {
                button.addClass('active');
            }
            else
            {

            }
            if(response.error)
            {
                alert(response.error);
            }
        }).always(function(){
           selectTeamButton.prop('disabled', false);
        });
    });


    uninviteButton.on('click', function(e){
        e.stopImmediatePropagation();
        disableButtons();
        var data = {
            player_id:player.id,
            match_id:match.id,
            uninvite:1
        };
        $.post(siteUrl+'/matchmaking/modify_player_for_match',data,function(response){

        });
    });
    acceptButton.on('click',function(e){
        e.stopImmediatePropagation();
        var data = {
            player_id:player.id,
            match_id:match.id,
            accept:1
        };
        disableButtons();
        $.post(siteUrl+'/matchmaking/modify_player_for_match',data,function(response){
            if(response.error)
            {
                alert(response.error);
            }
            enableButtons();
        }).error(function(){
            enableButtons();
        });
    });
    declineButton.on('click',function(e){
        e.stopImmediatePropagation();
        var data = {
            player_id:player.id,
            match_id:match.id,
            decline:1
        };
        disableButtons();
        $.post(siteUrl+'/matchmaking/modify_player_for_match',data,function(response){
            if(response.error)
            {
                alert(response.error);
            }
            enableButtons();
        }).error(function(){
            enableButtons();
        });
    });

    var user = userlistElement.find('.username');

    userlistElement.data('id',player.id);
    userlistElement.data('username',player.username);
    if(!(player instanceof User))
    {
        player = Users.update(player);
    }
    if(this.lobby.players[player.id] && !(this.lobby.players[player.id] instanceof User))
    {
        this.lobby.players[player.id] = player;
    }
    player.updateUserElements(user);
    var locationElement = userlistElement.find('.location');
    LadderDistance.setDescription(locationElement,player.location,myUser.location);
    locationElement.text(player.location.relativeLocation());

    this.playerList.players[player.id] = {
        player:player,
        element:userlistElement
    };

    userlistElement.appendTo(this.playerList.userlist);
    return userlistElement;
};
Match.prototype.closeMatch = function(){
    this.matchContainer.find('.control-buttons .closing_x').click();
    matchModeManager.changeViewMode(MatchModeManager.modes.SEARCH);
};
Match.prototype.removePlayerFromPlayerList = function(player){
    var playerListPlayer = this.playerList.players[player.player.id];
    if(playerListPlayer)
    {
        playerListPlayer.element.remove();
        if(playerListPlayer.player.id == myUser.id)
        {
            this.closeMatch();
        }
        this.postNotification(playerListPlayer.player.username + ' has left the match.');
        delete this.playerList.players[player.player.id];
    }
};
Match.prototype.setDoublesViewAsPriorityIfNeeded = function(){
    if(this.containsPlayerInLobby(myUser) || this.lobbyIsOpenOnMyScreen())
    {
        if(this.team_size > 1)
        {
            var tempMatchesList = {};
            tempMatchesList[this.id] = this;
            var reference = LadderInfo.retrieveReference('currentMatches');
            delete reference.callbacks.preventReadd[this.id];
            LadderInfo.parseChanges('currentMatches',tempMatchesList);
            matchModeManager.changeBattleMode(MatchModeManager.battleModes.MATCH_DOUBLES);
        }
        if(!this.containsPlayerInLobby(myUser))
        {
            matchModeManager.changeViewMode(MatchModeManager.modes.SEARCH);
        }
    }
};
Match.prototype.setupCountdown = function(mainElement, countdownElement, finishedCallback){

    if(this.search_time_remaining === true)
    {
        countdownElement.addClass('infinite');
    }
    else
    {
        var timer = new Timer(countdownElement, this.search_time_remaining, () =>{
            setTimeout(finishedCallback,1);
        }, function(){
            var shouldTick = Dashboard.matchmakingTab.data('paneActive');
            return shouldTick;
        });
        mainElement.data('attachedCountdown',timer);
    }
};
Match.createUserlistElement = function(){
    return $(
        '<li class="online_user">' +
        '<button class="accept_player btn-xs btn btn-success search_only">Accept</button>' +
        '<button class="decline_player btn-xs btn btn-danger search_only">Decline</button>' +
        '<button class="invited_pending btn-xs btn-clear">Remove Invitation</button>' +
        '<span class="invited_text">Invited</span>' +
        '<span class="username"></span> <span class="location"></span> ' +
        '<span class="team">None</span>  ' +
            '<div class="select_team">' +
                '<button data-team_number="1" class="btn-xs btn btn-success select_team_button search_only">Team 1</button>' +
                '<button data-team_number="2" class="btn-xs btn btn-success select_team_button search_only">Team 2</button>' +
            '</div>' +
            '<div class="team_announcement"></div>' +
        '</li>');
};
Match.stickySearches = {};
Match.hasSimilarSticky = function(newSearch){
    
};
Match.prototype.isSimilarTo = function(otherSearch){
    if(this.is_ranked != otherSearch.is_ranked)
        return false;
    if(this.ladder_id != otherSearch.ladder_id)
        return false;
    if(this.team_size != otherSearch.team_size)
        return false;
    if(this.match_count != otherSearch.match_count)
        return false;
    return true;
};
Match.prototype.wantsToPlayRankedText = function(){
    return this.player2.username+ ' ('+(this.player2.location.relativeLocation())+')'+ ' wants to play a ranked match!';
};
Match.prototype.wantsToPlayFriendliesText = function(){
    return this.player2.username+ ' ('+(this.player2.location.relativeLocation())+')'+ ' wants to play friendlies!'
};
Match.prototype.showWantsToPlayNotification = function(notification, searchElement){
    var text;
    var withinRange = true;
    if(this.location)
    {
        if(!this.location.isWithinPreferredRange() && this.gameData && this.gameData.preferred_distance_matters)
        {
            withinRange = false;
            notification.body = this.player2.username + ' is outside of your preferred range';
        }
    }

    var inChatNotification = BrowserNotification.showNotification(notification.title, notification, true)
        .showInChatAlso(true);
    if(inChatNotification)
    {
        inChatNotification.find('.message').html(this.player2.createUsernameElement())
            .append(' ').append(this.player2.location.createLocationElement())
            .append(' wants to play '+this.ladder.name+ ' ' + (this.team_size == 1?' singles' : ' doubles')+ '!').append(withinRange?'':'<span class="error"> (Out of your preferred range)</span>');

        inChatNotification.addClass('match_notification_shortcut').attr('title', 'Click to show challenge anyway');
        inChatNotification.data('match_id',this.id);
        inChatNotification.data('searchElement', searchElement);
    }

    MatchSounds.playMatchRequestNotification();
};
Match.prototype.browserNotification = function(title,text,showInChat){
    return BrowserNotification.showNotification(
        title,
        {
            body: text
        },
        this.getBrowserNotificationOptions()
        )
        .showInChatAlso(showInChat);
};
Match.prototype.summaryDescription = function(){

};
Match.prototype.showSimilarSearchBrowserNotification = function(searchElement){
    if(!(this.player1 instanceof User))
    {
        this.player1 = Users.update(this.player1);
    }
    var title = this.player1.username;
    var locationInformation = ' ('+(this.player1.location.relativeLocation())+')';

    var matchInformation = ' started a '+this.ladder.name+ ' search';


    title = title + ' ' + locationInformation + ' ' + matchInformation;

    var type = this.is_ranked ? 'Ranked' : 'Friendlies';
    var totalMatches;
    if(this.match_count == 0)
    {
        totalMatches = 'Endless';
    }
    else
    {
        totalMatches = 'Best of '+ this.match_count;
    }


    var inChatNotification = this.browserNotification(title,
        totalMatches + ' ' + type, true);
    if(inChatNotification)
    {
        inChatNotification.on('click',function(){
            inChatNotification.remove();
        });
        setTimeout(function(){
           inChatNotification.remove();
        },1000*60*5);
        var locationElement = this.player1.location.createLocationElement();
        inChatNotification.html(this.player1.createUsernameElement())
            .append(' ').append(locationElement)
            .append(matchInformation);
    }
    MatchSounds.playStickiedMatch();
};
Match.prototype.getMyCurrentCharacterId = function(){
      if(this.game && this.game.players && this.game.players[myUser.id])
      {
          return this.game.players[myUser.id].character;
      }
    return null;
};
Match.prototype.addSearchPopover = function(popoverElement, player){
    let search = this;
    var builds = player.preferred_builds.getPreferredBuildsFor(search.ladder_id);
    let popoverContent = null;
    if(builds.length)
    {
        popoverContent = $('<div>').addClass('match_popover_content');
        var list = $('<ul class="build_list"></ul>');
        $.each(builds, function(i, build){
            if(!build.active)
            {
                return;
            }
            list.append($('<li class="build">'+build.name+'</li>'));
        });
        popoverContent.append(list);
    }

    if(player.hasToxicWarning())
    {
        if(!popoverContent)
        {
            popoverContent = $('<div>').addClass('match_popover_content');
        }
        let warningMessage = null;
        let warning = $('<div>').addClass('reported_match_behavior_warning');
        if(player.getToxicCount() == 1 || player.getToxicCount() == 2)
        {
            warningMessage = 'Warning: Reported for toxic behavior';
        }
        else if(player.getToxicCount() > 4)
        {
            warningMessage = 'Warning: Has more than ' + (player.getToxicCount() - 1) + ' toxic reports. Please avoid if this behavior bothers you.';
            warning.addClass('toxic_waste');
        }
        else
        {
            warningMessage = 'Warning: Reported multiple times for toxic behavior';
            warning.addClass('toxic_radioactive');
        }
        warning.append(warningMessage);
        popoverContent.append(warning);
    }

    if(popoverContent)
    {
        let popoverItem = popoverElement.popover({
            html: true,
            content: popoverContent,
            trigger: 'hover',
            placement: 'top',
            container: Dashboard.dashboard
        });
    }
};
Match.prototype.getBrowserNotificationOptions = function(){
    var challengeNotificationOptions = {};
    if(this.ladder && this.ladder.small_image)
    {
        challengeNotificationOptions.icon = this.ladder.small_image;
    }
    return challengeNotificationOptions;
};
Match.prototype.containsMeAsPlayer = function(){
  return !!this.players[myUser.id];
};
Match.prototype.getMyTeamNumber = function(){
    if(!this.players[myUser.id])
    {
        return 1;
    }
    if(this.players[myUser.id].match && !this.players[myUser.id].match.team_number)
    {
        return 1; //Erm
    }
    if(!this.players[myUser.id].match)
    {
        return 1;
    }
    return this.players[myUser.id].match.team_number;
};
Match.prototype.getOtherTeamNumber = function(){
    var otherTeamNumber = this.getMyTeamNumber();
    if(otherTeamNumber === null)
    {
        return 2;
    }

    return otherTeamNumber == 1 ? 2: 1;
};
Match.prototype.getMyTeamNameElement = function(){
    if(this.isSingles())
    {
        return myUser.createUsernameElement().prop('outerHTML');
    }
    else if(this.isDoubles())
    {
        return 'Your Team';
    }
};
Match.prototype.getOtherTeamNameElement = function(){
    if(this.isSingles())
    {
        return this.getOtherPlayers()[0].createUsernameElement().prop('outerHTML');
    }
    else if(this.isDoubles())
    {
        return 'The Other Team';
    }
};

$('#main_chat_area').on('click','.match_notification_shortcut',function(e){
   var searchId = $(this).data('match_id');
    if($(this).data('searchElement'))
    {
        $(this).data('searchElement').addClass('show_by_exception');
        $(this).remove();
    }
});


/** WEBPACK FOOTER **
 ** ./../models/Match.jsx
 **/