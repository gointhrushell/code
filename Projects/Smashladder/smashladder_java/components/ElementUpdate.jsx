import {Users} from "../app/matchmaking.jsx";
import {Flair} from "../models/Flair.jsx";
import {League} from "../models/League";
import {Character} from "../models/Character";

import {DateFormat} from "../components/DateFormat";
import {ChatActions} from "../components/ChatActions";
import {LadderInfo} from "../components/LadderInfo";
import {Populate} from "../components/Populate";
import {Match} from "../models/Match";
import {Dashboard} from "../components/Dashboard";
import {Timer} from "../components/Timer";

import {getOrdinal} from "../functions/getOrdinal";
import {MatchSounds} from "../components/MatchSounds";
import {BrowserNotification} from "../components/BrowserNotification";
import {GameInfoHelper} from "../components/GameInfoHelper";
import {Request} from "../components/Request.jsx";
import {Settings} from "./Settings";
import {MatchmakingPopup} from "./MatchmakingPopup";

export var ElementUpdate = {
    mains: function(mainsContainer, player, match){
        if(match.is_ranked)
        {
            return ElementUpdate.rankedMains(mainsContainer, player, match);
        }
        else
        {
        }

        if(player.mains && player.mains[match.ladder.id])
        {
        }
        else
        {
            return;
        }
        if(mainsContainer.data('populated'))
        {

        }
        else
        {
            mainsContainer.data('populated',true);
            var mains = player.mains[match.ladder.id];
            $.each(mains,function(i,main){
                main = new Character(main);
                mainsContainer.append(main.generateElement());
            });
        }
    },
    rankedMains: function(mainsContainer, player, match){
        if(player.ladder_information.hasCharactersForLadder(match.ladder.id))
        {

        }
        else
        {
            return;
        }
        if(mainsContainer.data('populated'))
        {

        }
        else
        {
            mainsContainer.data('populated',true);
            $.each(player.ladder_information.getCharactersForLadder(match.ladder.id),function(i,main){
                if(main.percent < 5)
                {
                    return true;
                }
                main = new Character(main);
                mainsContainer.append(main.generateElement());
            });
        }
    },
    locationString:function(location){
        var user = myUser;
        var country, state, locality;
        var localLocation = user.location;
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
    },
    league:function(element,league){
        league = new League(league);
        return league.createElement(element);
    },
    userTypes:function(element,player){
        if(player.is_ignored)
            element.addClass('is_ignored');
        if(player.is_donator)
            element.addClass('is_donator').attr('title','Is a Donator to Smashladder');
        if(player.is_subscribed)
            element.addClass('is_subscribed').attr('title','Is Subscribed to Smashladder');
        if(player.is_mod)
            element.addClass('is_mod').attr('title','Is a Moderator');
        if(player.is_admin)
            element.addClass('is_admin').attr('title','Is an Administrator');
        if(player.is_top_player)
        {
            element.addClass('is_top_player');
            if(player.is_top_player.rank)
            {
                var ordinal = getOrdinal(player.is_top_player.rank);
                element.addClass('top_player_'+player.is_top_player.rank)
            }
            if(player.is_top_player.ladder_name)
            {
                element.attr('title','Is '+ordinal+' in '+player.is_top_player.ladder_name)
            }
        }
    },
    flair:function(element,player)
    {
        player = Users.create(player);
        player.addFlair(element);
    },
    dispute:function(disputeContainer,dispute)
    {
        if(dispute.ladder && dispute.ladder.small_image)
        {
            disputeContainer.find('.game_image img').attr('src',dispute.ladder.small_image);
        }
        else
        {
            disputeContainer.find('.game_image img').addClass('hidden');
        }
        disputeContainer.data('id', dispute.id);
        disputeContainer.find('.match_link').attr('href',dispute.getUrl()).attr('title', DateFormat.full(dispute.start_time));
        let description = disputeContainer.find('.match_description');
        if(dispute.is_ranked)
        {
            description.addClass('match_ranked');
            disputeContainer.find('.shortcut_ranked').text('Ranked');
        }
        else
        {
            description.addClass('match_unranked');
            disputeContainer.find('.shortcut_ranked').text('Unranked');
        }
        if(dispute.match_count)
        {
            disputeContainer.find('.best_of_text').text('Best Of ' + dispute.match_count);
            disputeContainer.find('.best_of_small').text('Bo' + dispute.match_count);
            disputeContainer.find('.best_of_endless').hide();
        }
        else
        {
            disputeContainer.find('.best_of_text').hide();
            disputeContainer.find('.best_of_small').hide();
            disputeContainer.find('.best_of_endless').show();
        }
        if(dispute.team_size == 1)
        {
            disputeContainer.find('.shortcut_team_size').text('Singles');
        }
        else
        {
            disputeContainer.find('.shortcut_team_size').text('Doubles');
        }
        disputeContainer.find('.match_description_season_link').hide();
        disputeContainer.find('.emphasized_time').text(DateFormat.full(dispute.start_time));


        dispute.setPerspectivePlayer(myUser);
        var players = dispute.getPlayers();
        var playersContainer = disputeContainer.find('.players').empty();
        $.each(players, function(i, player){
            player = Users.update(player);
            let div = $('<div>').addClass('player');
            let userRankElement = player.createUsernameRankElement();
            div.append(userRankElement.html());
            playersContainer.append(div);
        });
    },
    matchContainer: function(matchContainer,match,isNew)
    {
        if(!(match instanceof Match))
        {
            match = new Match(match);
        }
        var myPlayer;
        var currentPlayer, otherPlayer;
        var myTeamNumber, otherTeamNumber;
        var isMatchHost = false;
        match.setMatchContainer(matchContainer);
        match.setPerspectivePlayer(myUser);
        if(matchContainer.data('match'))
        {
            matchContainer.data('match').updateChanges(match);
        }
        match.updateTeamLists();

        matchContainer.data('match',match);
        //Determine Player
        var otherPlayers = {};
        $.each(match.players, function(id, player){
            match.players[id].player = Users.update(player.player);
            if(id == myUser.id)
            {
                myPlayer = match.players[id];
                myTeamNumber = myPlayer.match.team_number;
                currentPlayer = myPlayer.player;
                return;
            }
            otherPlayer = player.player;//Just in case there is only one...
        });
        Dashboard.sleep(25).then(() => {
              match.scrollToBottom();
        });

        if(match.player1.id == myUser.id)
        {
            isMatchHost = true;
            matchContainer.addClass('match_hoster');
        }
        var matchChatContainer = matchContainer.find('.chat_container');
        var newMessagesAdded = Populate.chat(match.chat,matchChatContainer);
        if(!matchContainer.hasClass('game_type_'+match.game_slug))
        {
            matchContainer.addClass('game_type_'+match.game_slug);
        }


        var dolphinLauncherContainer = matchContainer.findCache('.dolphin_launcher_container');
        var hostDolphin = matchContainer.findCache('.host_dolphin');
        var readyToLaunch = matchContainer.findCache('.ready_to_launch');
        var hasDolphinHost = null;
        var allHaveDolphinLauncher = true;
        if(match.host_code && match.host_code.code)
        {
            hasDolphinHost = match.host_code;
        }
        $.each(match.players, function(id, player){
            if(!player.match)
            {
                return;
            }
            if(!player.match.dolphin_launcher)
            {
                allHaveDolphinLauncher = false;
            }
        });

        if(hasDolphinHost)
        {
            dolphinLauncherContainer.addClass('match_is_hosted');
            if((hasDolphinHost && hasDolphinHost.insert_player_id == myUser.id))
            {
                dolphinLauncherContainer.addClass('self_hosting');
                readyToLaunch.addClass('not_available');
                hostDolphin.removeClass('not_available').addClass('waiting').removeClass('pending');
            }
            else
            {
                dolphinLauncherContainer.removeClass('self_hosting');
                readyToLaunch.removeClass('not_available');
                hostDolphin.addClass('not_available').removeClass('pending');

            }
        }
        else
        {
            dolphinLauncherContainer.removeClass('match_is_hosted self_hosting');
            readyToLaunch.addClass('not_available');
            hostDolphin.removeClass('waiting being_hosted not_available');
        }
        if(myPlayer && myPlayer.match.ready_to_launch)
        {
            readyToLaunch.addClass('waiting');
        }
        else
        {
            readyToLaunch.removeClass('waiting');
        }

        if(allHaveDolphinLauncher)
        {
        }
        else
        {
        }
        if(myPlayer && myPlayer.match)
        {
            if(myPlayer.match.is_automatic)
            {
                matchContainer.findCache('.host_code').addClass('is_smart_dolphin').removeClass('is_dumb_dolphin');
            }
            else
            {
                matchContainer.findCache('.host_code').addClass('is_dumb_dolphin').removeClass('is_smart_dolphin');
            }
            if(myPlayer.match.dolphin_launcher)
            {
                matchContainer.findCache('.host_code').addClass('dolphin_launcher');
                dolphinLauncherContainer.addClass('enabled');
            }
            else
            {
                dolphinLauncherContainer.removeClass('enabled');
                matchContainer.findCache('.host_code').removeClass('dolphin_launcher');
            }

        }

        // setPreferredBuild();
        function setPreferredBuild(){
            if(match.preferred_build && match.preferred_build.id != matchContainer.data('preferred_build_id'))
            {
                var dolphinVersion = matchContainer.findCache('.dolphin_version').addClass('active');
                matchContainer.data('preferred_build_id', match.preferred_build.id);

                var preferredBuild = match.preferred_build;
                if(preferredBuild)
                {
                    dolphinVersion.findCache('.version_text').text(preferredBuild.name);
                    dolphinVersion.addClass('special_preferred_build');
                    if(preferredBuild.icon_directory)
                    {
                        dolphinVersion
                            .findCache('.dolphin_logo')
                            .addClass('square_logo')
                            .attr('src', siteUrl +preferredBuild.icon_directory +'/96x96.png');
                    }
                    if(preferredBuild.download_link)
                    {
                        dolphinVersion.attr('href', preferredBuild.download_link);
                    }
                }
            }
            else
            {
                matchContainer.findCache('.dolphin_version').removeClass('active');
            }
        }


        if(match.match_muted && !matchContainer.data('responses_populated'))
        {
            matchContainer.data('responses_populated',true);
            var premadeResponses = matchContainer.find('.premade_responses');
            premadeResponses.addClass('visible');
            matchContainer.addClass('premade_responses_visible');
            var premadeTemplate = premadeResponses.find('.template').remove().removeClass('template');
            $.each(match.match_muted, function(i, response){
                var responseElement = premadeTemplate.clone();
                responseElement.data('response_id', response.id);
                responseElement.text(response.response);
                responseElement.appendTo(premadeResponses);
            });
        }




        if(newMessagesAdded && newMessagesAdded.player.id != myUser.id)
        {
            MatchSounds.playPrivateMessageSoundEffect();
            BrowserNotification.titleNotification("Received a message on your match with "+newMessagesAdded.player.username+"!",0,2);

            var icon = null;
            if(newMessagesAdded.player.selected_flair)
            {
                icon = Flair.retrieve(newMessagesAdded.player.selected_flair).fullUrl;
            }else if(match.ladder && match.ladder.small_image)
            {
                icon = match.ladder.small_image;
            }
            else
            {
                icon = undefined;
            }
            var notification = BrowserNotification.showNotification("Match message from "+newMessagesAdded.player.username,
                {
                    body: newMessagesAdded.message,
                    icon:icon,
                    onClick: function(){
                        Dashboard.battleTab.trigger('activate');
                    }
                });

            if(Dashboard.battlePaneShouldGetFocus())
            {
                var chatUpdateMessage = notification.showInChatAlso(true);
                Dashboard.battleTab.addClass('notification');
                if(chatUpdateMessage)
                {
                    var messagePart = chatUpdateMessage.find('.message');
                    chatUpdateMessage.click(function(e){
                        e.stopImmediatePropagation();
                        Dashboard.battleTab.trigger('activate');
                    });
                    var username = $('<span>').addClass('username').text(newMessagesAdded.player.username)
                        .data('username',newMessagesAdded.player.username);
                    messagePart.empty();
                    messagePart.append( $('<span>').addClass('chatlink').text('Match Message From '));
                    messagePart.append(username);
                    var messageText = $('<span>').addClass('chatlink');
                    messageText.text(' '+newMessagesAdded.message);
                    messagePart.append(messageText).addClass('chatlink');

                    if(chatUpdateMessage.data('chatConatiner') && chatUpdateMessage.data('chatConatiner').data('reScroll'))
                    {
                        chatUpdateMessage.data('chatConatiner').trigger('reScroll');
                    }
                }
            }

        }

        if(isNew && !Dashboard.firstCheck && !isMatchHost)
        {
            MatchSounds.playMatchRequestNotification();
        }
        if(match.id)
        {
            matchContainer.find('input[name=match_id]').val(match.id);
        }

        var timeout = matchContainer.find('.timeout');
        var timeoutCountdown = timeout.find('.countdown');
        var matchExpired = function(){
            timeout.addClass('expired');
            timeoutCountdown.text('This match is no longer visible for searching.');
        };
        var startMatchExpirationTimer = function(){
            if(match.expiration && match.search_time_remaining > 0)
            {
                timeout.removeClass('expired');
                var countdown = timeoutCountdown.text('0');
                var timer = new Timer(countdown,match.search_time_remaining,function(){
                    matchExpired();
                });
            }
        };

        if(match.search_time_remaining)
        {
            if(timeout.hasClass('expired'))
            {
                startMatchExpirationTimer();
            }
            else
            {
                if(match.search_time_remaining <= 0)
                {
                    matchExpired();
                }
                else
                {
                    if(timeoutCountdown.data('attachedCountdown'))
                    {
                        timeoutCountdown.data('attachedCountdown').changeTimeRemaining(match.search_time_remaining);

                    }
                }
            }
            delete match.matchReference.search_time_remaining; //So that future updates will not update the thingy
        }

        if(!matchContainer.data('host_code'))
        {
            matchContainer.data('host_code', matchContainer.find('.host_code'));
            matchContainer.data('host_code_input',
                matchContainer.data('host_code').find('input')
            );
        }

        applyHostCode();
        function applyHostCode()
        {
            if(match.isDoubles())
            {
                if(match.containsPlayer(myUser))
                {

                }
                else
                {
                    return;
                }
            }

            if(match.host_code)
            {
                var currentInput = matchContainer.data('host_code').findCache('input');
                currentInput.data('timestamp',match.host_code.timestamp);
                var currentInputValue = currentInput.val();

                //We can assume that this is redundant information
                if(matchContainer.data('host_code_player') !== match.host_code.insert_player_id && match.host_code.insert_player_id)
                {
                    matchContainer.data('host_code').removeClass('updating');

                    matchContainer.data('host_code_player',match.host_code.insert_player_id);
                    let hostCodePlayer = Users.retrieveById(match.host_code.insert_player_id);
                    if(hostCodePlayer && match.host_code.code)
                    {
                        matchContainer.data('host_code').addClass('has_code');
                        matchContainer.find('.host_coder_user').empty().append(hostCodePlayer.createUsernameElement());
                    }
                    else
                    {
                        matchContainer.data('host_code').removeClass('has_code');
                        matchContainer.find('.host_coder_user').empty();
                    }
                }
                else if(!match.host_code.insert_player_id)
                {
                    ChatActions.hostCodeFollow(null);
                    matchContainer.data('host_code').removeClass('updating');
                    currentInput.val('');
                    matchContainer.data('host_code').removeClass('has_code');
                    matchContainer.find('.host_coder_user').empty();
                }

                if(currentInputValue && match.host_code.insert_player_id == myUser.id
                    && match.host_code.code == currentInput.data('timestamp'))
                {


                }
                else
                {
                    if(!match.host_code.insert_player_id)
                    {

                    }
                    if(currentInputValue != match.host_code.code && match.host_code.code)
                    {
                        if(match.host_code.insert_player_id != myUser.id || myPlayer.match.dolphin_launcher)
                        {
                            let hostCodePlayer = Users.retrieveById(match.host_code.insert_player_id);
                            var message =
                                $('<span>'+hostCodePlayer.createUsernameElement().prop('outerHTML')
                                    + ' is hosting @ '
                                    + '<span class="inline_host_code">' + match.host_code.code +'</span>'
                                    + '<span class="copied_to_clipboard">' + "Copied to Clipboard" +'</span>'
                                    + '</span>'
                                );
                            match.postNotification(message, function(message){
                                matchContainer.data('chat_container').find('.host_code_notification.following').removeClass('following');

                                message.data('host_code', message.find('.inline_host_code').text());
                                message.on('click', function(e){
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    if(myPlayer.match.dolphin_launcher && dolphinLauncherContainer && dolphinLauncherContainer.length)
                                    {
                                        dolphinLauncherContainer.findCache('.ready_to_launch').trigger('click');
                                    }
                                    else
                                    {
                                        copyToClipboard(message.data('host_code'));
                                        message.addClass('copied');
                                        setTimeout(function(){
                                            message.remove();
                                        },600);
                                    }


                                    ChatActions.previousHostCodeFollow = null;
                                });
                                setTimeout(function(){
                                   message.remove();
                                }, 120000); //If for some reason the message hasn't been removed after two minutes

                                message.addClass('host_code_notification');
                                if(Dashboard.battlePaneIsVisible())
                                {
                                    if(Settings.isChecked('host_code_clipboard_helper') &&
                                        !matchContainer.data('host_code').hasClass('dolphin_launcher'))
                                    {
                                        message.addClass('following');
                                        ChatActions.hostCodeFollow(message);
                                    }
                                }

                            });
                        }

                        currentInputValue = currentInput.val(match.host_code.code);
                        matchContainer.data('host_code').removeClass('updating')
                            .data('lastValidCode',match.host_code.code);
                    }
                }
                matchContainer.data('host_code').removeClass('updating');

            }
        }


        if(!matchContainer.data('characters_populated') && match.characters)
        {
            matchContainer.data('characters_populated', true);
            match.populateCharacters();
        }
        if(!matchContainer.data('stages_populated') && match.stages)
        {
            matchContainer.data('stages_populated', true);
            match.populateStages();
        }

        let buildNotification = matchContainer.findCache('.match_build_preference');
        if(typeof match.preferred_build != 'undefined')
        {
            buildNotification.addClass('active');
            if(match.preferred_build && matchContainer.data('preferredBuildId') != match.preferred_build.id)
            {
                if(match.preferred_build && match.preferred_build.id)
                {
                    matchContainer.data('preferredBuildId', match.preferred_build.id);
                    buildNotification.addClass('has_build').removeClass('no_build');
                    buildNotification.findCache('.build_name').text(match.preferred_build.name);
                }
            }
            if(!match.preferred_build || !match.preferred_build.id)
            {
                matchContainer.data('preferredBuildId', null);
                buildNotification.addClass('no_build').removeClass('has_build');
            }

        }
        else
        {
            buildNotification.removeClass('active')
        }

        if(match.dolphin_status)
        {
            let dolphinStatusInformation = match.dolphin_status;
            if(dolphinStatusInformation.players)
            {
                if(!matchContainer.data('dolphinPlayers'))
                {
                    matchContainer.data('dolphinPlayers', {});
                }
                let cachedDolphinPlayers = matchContainer.data('dolphinPlayers');

                for(let slotNumber in cachedDolphinPlayers)
                {
                    cachedDolphinPlayers[slotNumber].touched = false;
                }

                for(let slotNumber in dolphinStatusInformation.players)
                {
                    if(!dolphinStatusInformation.players.hasOwnProperty(slotNumber))
                    {
                        continue;
                    }
                    let player = dolphinStatusInformation.players[slotNumber];
                    if(!cachedDolphinPlayers[slotNumber])
                    {
                        cachedDolphinPlayers[slotNumber] = {};
                        cachedDolphinPlayers[slotNumber].joined = false;
                        cachedDolphinPlayers[slotNumber].confirmed = false;
                    }
                    cachedDolphinPlayers[slotNumber].data = player;
                    let dolphinPlayer = cachedDolphinPlayers[slotNumber];
                    dolphinPlayer.touched = true;

                    if(player.username)
                    {
                        let confirmed = null;
                        let message = $('<span>').addClass('dolphin_update dolphin_join');
                        let dolphinUsername = null;
                        let requiresUpdate = false;
                        let justJoined = false;
                        if(!dolphinPlayer.joined)
                        {
                            requiresUpdate = true;
                            dolphinPlayer.joined = true;
                            justJoined = true;
                        }
                        if(player.player)
                        {
                            player.player = Users.update(player.player);
                            confirmed = true;
                            if(player.player.id == myUser.id)
                            {
                                message.data('isMe', true);
                            }
                            if(player.username.toLowerCase() != player.player.username.toLowerCase())
                            {
                                dolphinUsername = player.username;
                            }
                            if(!dolphinPlayer.confirmed)
                            {
                                requiresUpdate = true;
                                dolphinPlayer.confirmed = true;
                            }
                        }
                        else
                        {
                            if(dolphinPlayer.confirmed)
                            {
                                requiresUpdate = true;
                                dolphinPlayer.confirmed = false;
                            }
                            confirmed = false;
                        }

                        if(requiresUpdate)
                        {
                            if(confirmed && !justJoined)
                            {
                                message.append(player.player.createUsernameElement()).append(' confirmed in slot ' +slotNumber);
                            }
                            else if(confirmed)
                            {
                                message.append(player.username);
                                message.append(' joined dolphin in slot ' + player.slot);
                                message.append(' (').append(player.player.createUsernameElement()).append(') ');
                            }
                            else
                            {
                                message.append(player.username);
                                message.append(' joined dolphin in slot ' + player.slot);
                                message.append(' (CLICK HERE to set player for match reporting) ');
                                message.data('confirmUsername', player.username);
                            }
                            message.data('slot', player.slot);
                            match.postNotification(message);
                        }
                    }
                    else
                    {
                        dolphinPlayer.joined = false;
                        dolphinPlayer.confirmed = false;

                        let message = $('<span>').addClass('dolphin_update dolphin_leave');
                        message.append(player.previous_username +' exited the dolphin lobby!');
                        match.postNotification(message);
                    }

                    // console.log(dolphinPlayer);
                    if(dolphinPlayer.joined)
                    {
                        if(!dolphinPlayer.matchElement)
                        {
                            dolphinPlayer.matchElement = $('<li>').addClass('dolphin_user_holder');

                            let dolphinUserElement = $('<a>').addClass('dolphin_update');
                            dolphinPlayer.matchElement.append(dolphinUserElement);
                            dolphinPlayer.matchElement.append($('<span>').addClass('not_confirmed').text('(CLICK HERE TO SET PLAYER)'));
                            dolphinPlayer.matchElement.append($('<span>').addClass('alternate_username').text(''));
                            dolphinPlayer.matchElement.appendTo(matchContainer.findCache('.dolphin_players'));

                            dolphinUserElement.data('slot', dolphinPlayer.data.slot);

                        }
                        let dolphinUserElement = dolphinPlayer.matchElement.findCache('.dolphin_update')

                        dolphinUserElement.data('confirmUsername', dolphinPlayer.data.username);
                        dolphinUserElement.text(dolphinPlayer.data.username);
                        if(dolphinPlayer.confirmed)
                        {
                            dolphinPlayer.matchElement.addClass('confirmed');
                            if(dolphinPlayer.data.player && dolphinPlayer.data.username && dolphinPlayer.data.username != dolphinPlayer.data.player.username)
                            {
                                if(!dolphinPlayer.matchElement.hasClass('alternate_username'))
                                {
                                    dolphinPlayer.matchElement.addClass('alternate_username');
                                    dolphinPlayer.matchElement.findCache('.alternate_username').html(dolphinPlayer.data.player.createUsernameElement());
                                }
                            }
                            else
                            {
                                dolphinPlayer.matchElement.removeClass('alternate_username');
                            }
                        }
                        else
                        {
                            dolphinPlayer.matchElement.removeClass('confirmed');
                            dolphinPlayer.matchElement.removeClass('alternate_username');

                        }
                    }
                    else
                    {
                        if(dolphinPlayer.matchElement)
                        {
                            alert('removing');
                            dolphinPlayer.matchElement.remove();
                            dolphinPlayer.matchElement = null;
                        }
                    }
                }

            }
        }

        if(!matchContainer.hasClass('assets_populated'))
        {
            matchContainer.on('click', '.dolphin_update', function(){
                let button = $(this);
                if(button.data('isMe'))
                {
                    return Dashboard.ladderPopup('You are using dolphin slot '+button.data('slot'), 'This is you!');
                }
                if(!button.data('confirmUsername'))
                {
                    return;
                }
                let players = match.getPlayers();
                let list = $('<div>').addClass('dolphin_player_select_list');

                let dolphinPlayers = matchContainer.data('dolphinPlayers');
                let dolphinPlayersWithPlayers = {};
                for(let slot in dolphinPlayers)
                {
                    let dolphinPlayer = dolphinPlayers[slot];
                    if(dolphinPlayer.data.player)
                    {
                        dolphinPlayersWithPlayers[dolphinPlayer.data.player.id] = true;
                    }
                }
                for(let i = 0; i < players.length; i++)
                {
                    let player = players[i];
                    if(dolphinPlayersWithPlayers[player.id])
                    {
                        continue;
                    }
                    list.append(player.createUsernameElement());
                }
                let popup = Dashboard.ladderPopup(list, 'Who is the player in slot '+button.data('slot'));
                list.on('click', '.username', function(e){
                    e.stopImmediatePropagation();
                    let player = $(this);
                    let data = {};
                    data.player_id = player.data('id');
                    data.slot = button.data('slot');
                    Request.api(data, 'dolphin_slot_update', function(e){

                    });
                    popup.dismiss();
                });
            });
            matchContainer.findCache('.dolphin_launcher_container').on('click','.ready_to_launch', function(e){
                var button = $(this);
                button.prop('disabled', true);
                var finished = function(failed){
                    button.prop('disabled', false);
                    if(failed)
                    {
                        button.toggleClass('waiting');
                    }
                };
                var data = {};
                if(button.hasClass('waiting'))
                {
                    data.ready = 0;
                }
                else
                {
                    alert('Launching...');
                    data.ready = 1;
                }
                button.toggleClass('waiting');
               $.post(siteUrl+'/matchmaking/ready_to_launch', data, function(response){
                   finished(!response.success);
               }).error(function(){
                   finished(true);
               });
            }).on('click','.close_host', function(e){
                hostDolphinClickFunction($(this), false);

            }).on('click','.host_dolphin', function(e){
                hostDolphinClickFunction($(this), true);
            }).on('click', '.do_not_have_launcher', function(e){
                    var button = $(this);
                    button.prop('disabled', true);
                    var finished = function(){
                        button.prop('disabled', false);
                    };
                    Request.api(null, 'disable_launchers', finished, finished);
            }).on('click', '.start_game', function(e){
                var button = $(this);
                button.prop('disabled', true);
                var finished = function(){
                    button.prop('disabled', false);
                };
                Request.api(null, 'start_game', finished, finished);
            });
            var hostDolphinClickFunction = function(button, openDolphin){
                button.prop('disabled', true);
                var finished = function(failed){
                    button.prop('disabled', false);
                    if(failed)
                    {
                        button.toggleClass('waiting');
                    }
                };
                var data ={};
                if(!openDolphin)
                {
                    data.ready = 0;
                }
                else
                {
                    button.addClass('pending');
                    data.ready = 1;
                }
                button.toggleClass('waiting');
                $.post(siteUrl+'/matchmaking/host_dolphin', data, function(response){
                    finished(!response.success);
                }).error(function(){
                    finished(true);
                });
            };

            matchContainer.findCache('.dispute_update').on('click','.result_change', function(e){
                var button = $(this);
                var submitValue = button.val();
                var form = button.closest('.dispute_update');
                var message = button.closest('.dispute_update').find('.cancel_reason').val();

                var buttons = form.find(':input').prop('disabled',true);
                var enable = function(){
                    buttons.prop('disabled',false);
                };
                var data = {match_id: match.id, result_change: submitValue, dispute_message: message};
                $.post(siteUrl+'/matchmaking/user_intervention', data).always(function(){
                    enable();
                }).fail(function(){
                   alert('There was a server error submitting your result');
                });
            }).on('click', '.update_dispute_reason', function(e){
                var button = $(this);
                var form = button.closest('.dispute_update');
                var message = button.closest('.dispute_update').find('.cancel_reason').val();
                var buttons = form.find(':input').prop('disabled',true);
                var enable = function(){
                    buttons.prop('disabled',false);
                };
                updateDisputeReason(message, enable);
            });
            function updateDisputeReason(message, finishedCallback){
                var data = {match_id: match.id, dispute_message: message};
                $.post(siteUrl+'/matchmaking/update_dispute_message', data).always(function(){
                    if(finishedCallback)
                    {
                        finishedCallback();
                    }
                }).fail(function(){
                    alert('There was a server error saving the dispute message');
                });
            };

            matchContainer.on('click', '.build_notification', function(){
                MatchmakingPopup.showMatchSelectDialog(match.ladder_id, false).then(()=>{
                    let preference = $('#build_preference_'+match.ladder_id).clone().attr('id','');
                    if(!preference.length)
                    {
                        console.error('Could not load preference for this ladder');
                        return;
                    }
                    preference.addClass('build_changer build_preferences');

                    let popup = Dashboard.ladderPopup(preference, 'Change Preferred Build? (For Dolphin Launcher)');

                    preference.on('click', '.build', function(){

                        let build = $(this);
                        if(build.hasClass('disabled'))
                        {
                            return;
                        }

                        let buildPreferenceId = build.data('build_preference_id');

                        build.addClass('loading');
                        preference.find('.build').addClass('disabled');

                        $.post(siteUrl+'/matchmaking/change_match_build_preference', {match_id: match.id, build_preference_id: buildPreferenceId},
                            function(response){

                                popup.dismiss();
                            }
                        ).error(function(){
                            alert('There was an error updating the build preference');

                        });

                    });
                });
            });

            matchContainer.on('change', '.host_code_popup input[name="host_code_clipboard_helper"]', function(e){
                Settings.getSetting('host_code_clipboard_helper')
                    .prop('checked',$(this).is(':checked')?1:0).trigger('change');
            });
            
            var clipboard = new Clipboard(matchContainer.findCache('.copy_to_clipboard')[0],{
                text: function(trigger){
                    if(matchContainer.data('host_code_input').data('tempHostCode'))
                    {
                        var value = matchContainer.data('host_code_input').data('tempHostCode');
                        matchContainer.data('host_code_input').data('tempHostCode', null);
                        return value;
                    }
                    else
                    {
                        return matchContainer.data('host_code_input').val().trim();
                    }
                }
            }).on('success',function(e){
                // alert('"'+ e.text+'" Has been copied to your clipboard!');
                matchContainer.findCache('.chat_input').focus().trigger('focus');
            }).on('error',function(e){
                alert('There was an error copying to your clipboard!');
            });

            matchContainer.findCache('.chat_input').on('keydown', function(e){
                if(e.which == Dashboard.keyCodes.UP && !e.shiftKey)
                {
                    e.preventDefault();
                    matchContainer.findCache('.copy_to_clipboard').trigger('click');
                }
            });

            var hostCode = matchContainer.data('host_code');
            if(match.host_code)
            {

                matchContainer.data('host_code_input').bindWithDelay('keyup',function(){
                    hostCode.addClass('updating');
                    var input = matchContainer.data('host_code_input').val();
                    if(match.host_code.code == input)
                    {
                        return;//No change
                    }
                   Request.api({host_code:input},
                       'set_host_code',function(response){
                           if(response.success)
                           {
                               match.host_code = response.host_code;
                           }
                           else
                           {
                               matchContainer.data('host_code_input').val(matchContainer.data('host_code').data('lastValidCode'));
                           }
                           hostCode.removeClass('updating');
                       });
                },1000).on('keyup',function(){
                    hostCode.addClass('updating');
                });
            }
            else
            {
                hostCode.remove();
            }


            matchContainer.addClass('assets_populated');

            startMatchExpirationTimer();

            matchContainer.find('.start_team_match').on('click',function(){
                var button = $(this);
                var disableButton = function(){
                    button.prop('disabled',true);
                };
                var enableButton = function(){
                    button.prop('disabled',false);
                };
                disableButton();
                $.post(siteUrl+'/matchmaking/start_match',{match_id:match.id},function(response){
                    enableButton();
                    if(response.error)
                    {
                        match.postNotification(response.error);
                    }
                }).error(function(){
                    enableButton();
                });
            });

            matchContainer.on('click','.match_void',function(e){
               var button = $(this);
                button.prop('disabled',true);
                var enableButton = function(){
                    button.prop('disabled',false);
                };
                $.post(siteUrl+'/matchmaking/match_void',{match_id:match.id}, function(response){
                    if(response.success)
                    {
                        match.postNotification('Match Removed from your History');
                    }
                    else
                    {
                        match.postNotification('There was an error removing the match from your history!');
                        enableButton();
                    }
                }).error(function(){
                    alert('There was an error!');
                    enableButton();
                });
            });

            matchContainer.on('click','.rematch', function(e){
                var button = $(this);
                button.prop('disabled',true);
                var enableButton = function(){
                    button.prop('disabled',false);
                };
                $.post(siteUrl+'/matchmaking/rematch',{match_id:match.id}, function(response){
                    var data;
                    if(response.success)
                    {
                        match.closeMatch();//Close match so that new one can take over
                    }
                    else
                    {
                        match.postNotification(response.error);
                        enableButton();
                    }
                }).error(function(){
                    alert('There was an error!');
                    enableButton();
                });
            });
            matchContainer.on('click','.rehost_reinvite', function(e){
                var button = $(this);
                button.prop('disabled',true);
                var enableButton = function(){
                    button.prop('disabled',false);
                };
                $.post(siteUrl+'/matchmaking/rehost_reinvite',{match_id:match.id}, function(response){
                    var data;
                    if(response.success)
                    {
                        if(response.player_ids && response.match_id)
                        {
                            data = {};
                            data.match_id = response.match_id;
                            data.player_ids = response.player_ids;
                            //TODO this is a mistake, server should take care of this ;)
                            $.post(siteUrl+'/chats/invite_players',data,function(response){

                            });
                        }
                        match.closeMatch();//Close match so that new one can take over

                        if(response.searches)
                        {
                            data = {searches:response.searches};
                            Dashboard.performOpenSearchUpdate(data);
                        }
                    }
                    else
                    {
                        match.postNotification(response.error);
                        enableButton();
                    }
                }).error(function(){
                    alert('There was an error!');
                    enableButton();
                });
            });

            if(match.isDoubles())
            {
                matchContainer.find('.main_opponent_username').remove();
                matchContainer.find('.main_match_title').text(match.ladder_name+' Doubles')
                    .off('click').on('click',function(){
                    window.open(siteUrl+'/match/view/'+match.id)
                });
                matchContainer.find('.restart_search_timer').on('click',function(e){
                    var button = $(this);
                    button.prop('disabled',true);
                    $.post(siteUrl+'/matchmaking/restart_search_timer',{match_id:match.id},function(response){
                        button.prop('disabled',false);
                    }).error(function(){
                        button.prop('disabled',false);
                    });
                });
            }
            else
            {
                matchContainer.find('.main_opponent_username').html(match.getOtherPlayerElements()[0]);
            }
        }

        var matchIsActive = true;
        if(match.end_phase || match.is_disputed || (match.game && match.game.current_action === null))
        {
            if(match.is_disputed && !match.is_completed)
            {
                matchContainer.addClass('is_disputed');
                //var popup = $('.match_disputed.template').clone().removeClass('template');
            }
            else if(match.is_completed && !match.is_disputed)
            {
                matchContainer.removeClass('is_disputed');
                //Popups.matchFeedback(match.id,matchContainer.find('.username').first().text());
            }
            matchContainer.addClass('ended');
            if(match.short_match)
            {
                matchContainer.addClass('short_match')
            }
            else
            {
                matchContainer.removeClass('short_match');
            }
            if(match.is_cancelled)
            {
                matchContainer.addClass('match_cancelled');
                matchContainer.removeClass('is_disputed');
            }

            matchContainer.find('.picks_container, .controls, .code, .netplay_code_container').css('display','');
            if(match.player_report && match.player_report[match.getMyTeamNumber()])
            {
                var myReport = match.player_report[match.getMyTeamNumber()];
                var disputeContainer = matchContainer.find('.match_disputed');
                var cancel = disputeContainer.find('.cancel');
                var win = disputeContainer.find('.win');
                var loss = disputeContainer.find('.loss');
                var dispute = disputeContainer.find('.dispute_match');
                var undispute = disputeContainer.find('.undispute_match');
                var reportedSomething = false;
                if(myReport.reported_cancel)
                {
                    cancel.hide();
                    reportedSomething = true;
                }
                else
                {
                    cancel.show();
                }
                if(myReport.reported_dispute)
                {
                    dispute.hide();
                    reportedSomething = true;
                }
                else
                {
                    dispute.show();
                }
                if(myReport.reported_loss)
                {
                    loss.hide();
                    reportedSomething = true;
                }
                else
                {
                    loss.show();
                }
                if(myReport.reported_win)
                {
                    win.hide();
                    reportedSomething = true;
                }
                else
                {
                    win.show();
                }
                if(reportedSomething)
                {
                    undispute.show();
                }
                else
                {
                    undispute.hide();
                }
                let reportReasons = function(){
                    var disputeReasons = [];
                    if(!match.player_report)
                    {
                        disputeReasons.push('No results reported...?');
                        return disputeReasons;
                    }
                    if(!match.player_report[1] || !match.player_report[2])
                    {
                        return disputeReasons;
                    }
                    let reason1 = match.player_report[match.getMyTeamNumber()];
                    let reason2 = match.player_report[match.getOtherTeamNumber()];
                    if(!reason1 || !reason2)
                    {
                        return disputeReasons;
                    }
                    
                    
                    reason1.player = match.getMyTeamNameElement();
                    reason2.player = match.getOtherTeamNameElement();
                    
                    var independentReasons = function(reason){
                        if(reason.reported_cancel)
                        {
                            disputeReasons.push(reason.player+' wants to cancel the match.');
                        }
                        if(reason.reported_dispute)
                        {
                            disputeReasons.push(reason.player+' is disputing the match.');
                        }
                    };
                    $.each(match.player_report, function(i,reason){
                        independentReasons(reason);
                    });
                    if(reason1.reported_win && reason2.reported_win)
                    {
                        disputeReasons.push('Both reported the match as a win, you can clear your result to continue the match');
                    }
                    else if(reason1.reported_loss && reason2.reported_loss)
                    {
                        disputeReasons.push('Both reported the match as a loss, you can clear your result to continue the match');
                    }
                    else if(reason1.reported_cancel && reason2.reported_cancel)
                    {
                        matchContainer.findCache('.dispute_reasons').addClass('success');
                        disputeReasons.push('Match Successfully Cancelled');
                    }
                    else
                    {
                        var independentWinReasons = function(reason){
                            if(reason.reported_win)
                                disputeReasons.push(reason.player+' reported a win.');
                            if(reason.reported_loss)
                                disputeReasons.push(reason.player+' reported a loss.');
                        };
                        $.each(match.player_report, function(i,reason){
                            independentWinReasons(reason);
                        });
                    }
                    return disputeReasons;
                };
                var disputeReasons = reportReasons(disputeReasons);
                matchContainer.findCache('.dispute_reasons').empty();
                if(disputeReasons.length)
                {
                    $.each(disputeReasons, function(i, reason){
                        matchContainer.findCache('.dispute_reasons').append($('<li>'+reason+'</li>'));
                    });
                }
                else
                {
                    matchContainer.findCache('.dispute_reasons').text('Unknown Dispute Reason');
                }

                if(myReport.dispute_message && myReport.dispute_message
                    != matchContainer.findCache('.cancel_reason').val()
                    && !matchContainer.findCache('.cancel_reason').data('set'))
                {
                    matchContainer.findCache('.cancel_reason').val(myReport.dispute_message).data('set', true);
                }
            }
            if(match.atLeastOneOtherPlayerIsChatting())
            {

            }
            else
            {
                if(!matchContainer.data('chat_disabled'))
                {
                    if(!match.game || !match.rps_game)
                    {
                        ChatActions.addNotificationToChat(matchContainer.find('.chat_container'),'This chat has been closed.');
                    }
                }
                matchContainer.data('chat_disabled',true);
                matchContainer.find('.chat_input').addClass('disabled');
                matchContainer.find('.send_chat_button').prop('disabled',true);
            }
            matchContainer.find('.rock_paper_scissors').hide();
            matchIsActive = false;
        }
        else
        {
            if(matchContainer.hasClass('ended'))
            {
                matchContainer.removeClass('ended');
                matchContainer.removeClass('is_disputed');
                matchContainer.find('.controls').show();//Could be a hack
                matchContainer.data('chat_disabled',false);
                matchContainer.findCache('.chat_input').removeClass('disabled');
                matchContainer.find('.send_chat_button').prop('disabled',false);
                ChatActions.addNotificationToChat(matchContainer.find('.chat_container'),'Match has been reopened.');
            }
        }

        if(match.is_ranked)
        {
            matchContainer.addClass('is_ranked_match');
        }
        else
        {
            matchContainer.addClass('is_unranked_match');
        }
        if(match.expiration)
        {
            matchContainer.addClass('search_is_active');
            matchContainer.removeClass('match_active');
        }
        else
        {
            matchContainer.addClass('match_active');
            matchContainer.removeClass('search_is_active');
        }
        if(!match.containsMeAsPlayer())
        {
            matchContainer.addClass('spectating_match');
        }
        if(match.usesTeamList())
        {
            matchContainer.addClass('is_teams_match');
            if(match.match_count > 0)
            {
                matchContainer.addClass('assigned_teams');
            }
        }
        else
        {
            matchContainer.addClass('is_singles_match');
            if(otherPlayer.specific_code_1)
            {
                var codes = matchContainer.find('.opponent_codes');
                if(!codes.data('set'))
                {
                    codes.addClass('active');
                    codes.find('.user').html(otherPlayer.createUsernameElement());
                    codes.find('.field_name').text(otherPlayer.specific_code_1.name);
                    if(otherPlayer.specific_code_1.value)
                    {
                        codes.find('.field_value').removeClass('unknown').text(otherPlayer.specific_code_1.value);
                    }
                    else
                    {
                        codes.find('.field_value').addClass('unknown').text('Unknown');
                    }
                    codes.data('set',true);
                }

            }
            else
            {
                matchContainer.find('.opponent_codes').hide();
            }

        }

        ElementUpdate.updateMatchCount(match,matchContainer.find('.opponent .match_count'));

        if(match.rps_game && matchIsActive && false)
        {
            alert('no');
            if(match.is_ranked)
            {
                matchContainer.find('.ranked_controls .cancel, .ranked_controls_only').show();
                matchContainer.find('.friendlies_controls').hide();
            }
            else
            {
                matchContainer.find('.ranked_controls .cancel, .ranked_controls_only').hide();
                matchContainer.find('.friendlies_controls').show();
            }
        }

        if(match.set_score)
        {
            var setScoreContainer = matchContainer.find('.set_score');
            if(match.getMyTeamNumber() == 1)
            {
                setScoreContainer.find('.wins').text(match.set_score.p1wins);
                setScoreContainer.find('.losses').text(match.set_score.p2wins);
                setScoreContainer.find('.draws').text(match.set_score.draws);
            }
            else
            {
                setScoreContainer.find('.wins').text(match.set_score.p2wins);
                setScoreContainer.find('.losses').text(match.set_score.p1wins);
                setScoreContainer.find('.draws').text(match.set_score.draws);
            }
        }

        if(match.rps_game)
        {
            matchContainer.addClass('rock_paper_scissors_mode');
            var rpsContainer = matchContainer.find('.rock_paper_scissors');
            var rpsConstants = {
                1:{name:'Rock',beats:3,loses:2,winTerm:'smashes',loseTerm:'is obliterated by'},
                2:{name:'Paper',beats:1,loses:3,winTerm:'obliterates',loseTerm:'is sliced by'},
                3:{name:'Scissors',beats:2,loses:1,winTerm:'slices through',loseTerm:'is smashed by'}
            };

            var getRpsSelection = function(rpsMatch) {
                if (rpsMatch.players && rpsMatch.players[myUserId] && rpsMatch.players[myUserId].selection)
                {
                    return rpsMatch.players[myUserId].selection;
                }
                return null;
            };
            var myRpsSelection = getRpsSelection(match.rps_game);

            var isLastMatch;
            var lastGame = rpsContainer.data('lastGame');
            if(match.rps_game.winner && rpsContainer.data('lastGame') == match.rps_game.game_number)
                isLastMatch = true;
            else
                isLastMatch = false;
            if(match.rps_game.game_number > 1 && match.rps_game.game_number > rpsContainer.data('lastGame') || isLastMatch)
            {
                var	previousRpsGame;
                if(isLastMatch)
                {
                    previousRpsGame = match.rps_game;
                    rpsContainer.data('lastGame',match.rps_game.game_number + 1);
                }
                else
                {
                    previousRpsGame  = match.rps_game.rps_previous_game;

                }
                if(previousRpsGame)
                {
                    var previousSelection = getRpsSelection(previousRpsGame);
                    if(previousSelection && previousRpsGame.winner == 'draw')
                    {
                        match.postNotification('Draw! You both picked '+rpsConstants[previousSelection].name+'!');
                    }
                    else if(previousSelection && previousRpsGame.winner)
                    {
                        if(previousRpsGame.winner == myUserId)
                        {
                            match.postNotification('You Won! '+ rpsConstants[previousSelection].name + ' ' + rpsConstants[previousSelection].winTerm + ' ' +rpsConstants[rpsConstants[previousSelection].beats].name +'!');
                        }
                        else
                        {
                            match.postNotification('You Lost! '+ rpsConstants[previousSelection].name +' ' + rpsConstants[previousSelection].loseTerm + ' ' +rpsConstants[rpsConstants[previousSelection].loses].name +'!');
                        }
                    }
                }
                //Announce last result
            }
            if(!rpsContainer.data('lastGame') || rpsContainer.data('lastGame') < match.rps_game.game_number)
            {
                rpsContainer.data('lastGame',match.rps_game.game_number);
            }

            if(myRpsSelection)
            {
                rpsContainer.find('.selection').prop('disabled',true).removeClass('player_selected');
                rpsContainer.find('.selection[value='+myRpsSelection+']').addClass('player_selected');
            }
            else
            {
                rpsContainer.find('.selection').prop('disabled',false).removeClass('player_selected');
            }
        }

        var matchContainerViewModes = [
            'character_pick_main',

            'blind_wait',
            'blind_choose',

            'choose_character',
            'wait_for_choose_character',

            'choose_stage',
            'wait_for_choose_stage',

            'stage_pick_main',
            'strike_stage',
            'wait_for_strike',
            'play_match',
        ];

        // if(match.game.current_action == ACTION_FRIENDLY_PLAY_GAME && match.previous_game)
        // {
        //     // match.game = match.previous_game;
        // }
        if(match.game && !(match.game.current_action == ACTION_FRIENDLY_REPORT && match.game.current_action == ACTION_FRIENDLY_PLAY_GAME))
        {
            function changeMatchView(mode)
            {
                matchContainer.removeClass(matchContainerViewModes.join(' ')).addClass(mode);

            }
            var selectedCharactersContainer = matchContainer.findCache('.selected_characters');
            var game = match.game;
            var picksContainer = matchContainer.findCache('.picks_container');

            picksContainer.data('currentAction', game.current_action);
            picksContainer.data('myPlayerNumber', myTeamNumber);

            otherPlayer = Users.update(otherPlayer);

            var currentInstructions = matchContainer.findCache('.current_instructions');

            picksContainer.findCache('.other_username').html(match.getOtherTeamNameElement());
            picksContainer.findCache('.my_username').html(match.getMyTeamNameElement());
            picksContainer.findCache('.game_number').text(game.game_number);
            matchContainer.findCache('.character.opponent_selected').removeClass('opponent_selected');
            matchContainer.findCache('.character.player_selected').removeClass('player_selected');

            if(game.current_action == ACTION_PLAYERS_BLIND_PICK_CHARACTERS
                || game.current_action == ACTION_PLAYER_1_PICK_CHARACTER
                || game.current_action == ACTION_PLAYER_2_PICK_CHARACTER
            )
            {
                changeMatchView('character_pick_main');

                matchContainer.find('.character').removeClass('waiting_active');
                matchContainer.find('.character_for_game_'+match.game_slug).addClass('waiting_active');
                GameInfoHelper.setContainerToStage(matchContainer.find('.stage_selected'),game.stage);


                //Populate waiting on display
                var waitingOn = matchContainer.findCache('.waiting_on');
                $.each(game.players, function(id, player){
                    var user = Users.retrieveById(id);
                    var waitingOnElement = user.createUsernameElement();
                    var idClass = 'waiting_user_'+user.id;
                    if(player.character === null &&
                        game.current_action == ACTION_PLAYERS_BLIND_PICK_CHARACTERS )
                    {
                        if(!waitingOn.find('.' + idClass).length)
                        {
                            waitingOnElement.addClass(idClass);
                            waitingOnElement.appendTo(waitingOn);
                        }
                    }
                    else
                    {
                        waitingOn.find('.' + idClass).remove();
                    }

                });

                GameInfoHelper.updateCharacters(matchContainer, match);
                if(game.current_action == ACTION_PLAYER_1_PICK_CHARACTER && myTeamNumber == 1
                    || game.current_action == ACTION_PLAYER_2_PICK_CHARACTER && myTeamNumber == 2)
                {
                    currentInstructions.addClass('active');

                    changeMatchView('character_pick_main choose_character');

                    if(otherPlayer.character)
                    {
                        let characterSelection = GameInfoHelper.characterElement(matchContainer,otherPlayer.character);

                        characterSelection.addClass('opponent_selected');
                    }
                }
                else if(game.current_action == ACTION_PLAYER_1_PICK_CHARACTER && myTeamNumber == 2
                    || game.current_action == ACTION_PLAYER_2_PICK_CHARACTER && myTeamNumber == 1)
                {
                    currentInstructions.removeClass('active');

                    changeMatchView('character_pick_main wait_for_choose_character');
                }else{
                    matchContainer.find('.character').removeClass('player_selected opponent_selected');
                }

                if(match.getMyCurrentCharacterId())
                {
                    let characterSelection = GameInfoHelper.characterElement(matchContainer,match.getMyCurrentCharacterId());
                    currentInstructions.removeClass('active');
                    characterSelection.addClass('player_selected');
                }

                if(game.current_action == ACTION_PLAYERS_BLIND_PICK_CHARACTERS)
                {
                    if(match.game.players[myUser.id] && match.game.players[myUser.id].character != null)
                    {
                        changeMatchView('character_pick_main blind_wait');
                        currentInstructions.removeClass('active');
                    }
                    else
                    {
                        changeMatchView('character_pick_main blind_choose');
                        currentInstructions.addClass('active');
                    }

                }
            }

            if(game.current_action == ACTION_PLAYER_1_STRIKE_STAGE ||game.current_action == ACTION_PLAYER_2_STRIKE_STAGE
                || game.current_action == ACTION_PLAYER_1_PICK_STAGE || game.current_action == ACTION_PLAYER_2_PICK_STAGE
                || game.current_action == ACTION_PLAYER_1_BAN_STAGE || game.current_action == ACTION_PLAYER_2_BAN_STAGE
            )
            {
                changeMatchView('stage_pick_main');


                GameInfoHelper.updateCharacters(matchContainer, match);


                if((myTeamNumber == 1 && (game.current_action == ACTION_PLAYER_1_STRIKE_STAGE))
                    || (myTeamNumber == 2 && (game.current_action == ACTION_PLAYER_2_STRIKE_STAGE)))
                {
                    currentInstructions.addClass('active');
                    changeMatchView('stage_pick_main strike_stage');
                }
                if((myTeamNumber == 2 && (game.current_action == ACTION_PLAYER_1_STRIKE_STAGE))
                    || (myTeamNumber == 1 && (game.current_action == ACTION_PLAYER_2_STRIKE_STAGE)))
                {
                    currentInstructions.removeClass('active');
                    changeMatchView('stage_pick_main wait_for_strike');
                }
                if((myTeamNumber == 1 && (game.current_action == ACTION_PLAYER_1_BAN_STAGE))
                    || (myTeamNumber == 2 && (game.current_action == ACTION_PLAYER_2_BAN_STAGE)))
                {
                    currentInstructions.addClass('active');
                    changeMatchView('stage_pick_main strike_stage');
                }
                if((myTeamNumber == 2 && (game.current_action == ACTION_PLAYER_1_BAN_STAGE))
                    || (myTeamNumber == 1 && (game.current_action == ACTION_PLAYER_2_BAN_STAGE)))
                {
                    currentInstructions.removeClass('active');
                    changeMatchView('stage_pick_main wait_for_strike');
                }



                if(( game.current_action == ACTION_PLAYER_1_PICK_STAGE && myTeamNumber == 1 )
                    || ( game.current_action == ACTION_PLAYER_2_PICK_STAGE && myTeamNumber == 2 ))
                {
                    currentInstructions.addClass('active');
                    changeMatchView('stage_pick_main choose_stage');
                }
                if(( game.current_action == ACTION_PLAYER_1_PICK_STAGE && myTeamNumber == 2 )
                    || ( game.current_action == ACTION_PLAYER_2_PICK_STAGE && myTeamNumber == 1 ))
                {
                    currentInstructions.removeClass('active');
                    changeMatchView('stage_pick_main wait_for_choose_stage');
                }

                var $stages = matchContainer.find('.stage_picks .stage');
                var visibleStages = 0;
                $stages.each(function(){
                    var stage = $(this);
                    var stageId = $(this).find('input[name=stage_id]').val();
                    if(game.visible_stages[stageId])
                    {
                        visibleStages++;
                        stage.removeClass('player_selected opponent_selected pending_selection');
                    }
                    else
                    {
                        if(game.all_stages[stageId] == myUser.id)
                        {
                            stage.addClass('player_selected');
                        }
                        else if(game.all_stages[stageId] !== true)
                        {
                            stage.addClass('opponent_selected');
                        }
                    }
                    if(game.all_stages[stageId])
                    {
                        stage.addClass('active');
                    }
                    else
                    {
                        stage.removeClass('active');
                    }
                });
                if(game.strikes_remaining >= visibleStages)
                    matchContainer.find('.strikes_remaining').text(visibleStages - 1);
                else
                    matchContainer.find('.strikes_remaining').text(game.strikes_remaining);


            }
            if(game.current_action == ACTION_PLAYERS_PLAY_GAME ||
                game.current_action == ACTION_FRIENDLY_REPORT || game.current_action == ACTION_FRIENDLY_PLAY_GAME)
            {
                currentInstructions.addClass('active');

                changeMatchView('play_match');
                if(game.stage_data)
                {
                    matchContainer.addClass('stage_selected');
                }
                else
                {
                    matchContainer.removeClass('stage_selected');
                }

                GameInfoHelper.setContainerToStage(matchContainer.findCache('.stage_selected'),game.stage_data?game.stage_data:game.stage);

                var myCharacter = selectedCharactersContainer.find('.my_character');
                var otherCharacter = selectedCharactersContainer.find('.other_character');

                GameInfoHelper.updateCharacters(matchContainer, match);
            }

            if(game.current_action == ACTION_FRIENDLY_REPORT || game.current_action == ACTION_FRIENDLY_PLAY_GAME)
            {
                matchContainer.addClass('auto_reported');
            }

            matchContainer.removeClass('no_game_picks').addClass('has_game_picks');
        }
        else
        {
            matchContainer.addClass('no_game_picks').removeClass('has_game_picks');
        }

        matchContainer.find('.result_display_sentence').hide();

        if(match.game && match.game.teams[1] && match.game.teams[2])
        {
            var myTeam = match.game.teams[match.getMyTeamNumber()];
            var otherTeam = match.game.teams[match.getOtherTeamNumber()];

            matchContainer.find('.opponent .username, .opponent.username').text(otherPlayer.username);
            matchContainer.find('.results_display .username').text(otherPlayer.username);
            matchContainer.find('.opponent .netplay_code').text((otherPlayer.netplay_code)?otherPlayer.netplay_code:'');
            matchContainer.find('.opponent .match_start_time .time').text(DateFormat.hourMinutes(match.start_time));

            if(myTeam.match_report == LOSE_MATCH)
            {
                matchContainer.addClass('self_reported_loss');
            }
            else
            {
                matchContainer.removeClass('self_reported_loss');
            }
            if(myTeam.match_report == WIN_MATCH)
            {
                matchContainer.addClass('self_reported_win');
            }
            else
            {
                matchContainer.removeClass('self_reported_win');
            }

            if(otherTeam.match_report == LOSE_MATCH)
            {
                matchContainer.addClass('other_reported_loss');
            }
            else
            {
                matchContainer.removeClass('other_reported_loss');
            }
            if(otherTeam.match_report == WIN_MATCH)
            {
                matchContainer.addClass('other_reported_win');
            }
            else
            {
                matchContainer.removeClass('other_reported_win');
            }
        }

        return matchContainer;
    },
    /** Also calls ElementUpdate.Flair and ElementUpdate.userTypes */
    user: function(element,user)
    {
        if(!user.id)
        {
            return; //Error...
        }
        // element.find('input[name=player_id]').val(user.id);
        user = Users.create(user);
        if(user.id == myUser.id)
        {
            element.addClass('is_me');
        }
        ElementUpdate.flair(element,user);
        var usernameElement = element.find('.username').text(user.getDisplayedName());
        if(usernameElement.length)
        {
            ElementUpdate.userTypes(usernameElement,user);
        }
        else
        {
            ElementUpdate.userTypes(element,user);
        }
        element.data('username',user.username);
        element.data('usernameLowercase',new String(user.username).toLowerCase());

        if(user.location)
        {
            element.find('.location').text(user.location.relativeLocation());
        }

        if(user.is_online === false)
        {
            element.addClass('offline');
        }
        else
        {
            if(user.away_message)
            {
                element.find('.title').text(user.away_message);
            }
        }
        if(user.wants_to_play && element.hasClass('away'))
        {
            element.removeClass('away');
        }


        if(typeof user.league != 'undefined')
        {
            ElementUpdate.league(element.find('.league'),user.league);
            element.data('league',user.league);
        }
        if(user.is_playing)
            element.addClass('playing');
        else
            element.removeClass('playing');

        if(user.message && user.message.update_time)
        {
            var message = user.message;
            var date = new Date(message.update_time*1000);
            element.find('.last_message_time').text(date.format('M j, g:ia')).data('timestamp',message.update_time);
        }
        if(user.id)
        {
            element.data('id',user.id);
        }
        if(user.username && usernameElement.length)
        {
            var link = ChatActions.getUsernameLink(user);
            if(link)
            {
                usernameElement.attr('href',ChatActions.getUsernameLink(user));
            }
            usernameElement.data('id',user.id);
            usernameElement.data('useranme',user.username);
        }
        ElementUpdate.updateChallengeButtons(user,element);
    }
};
ElementUpdate.updateChallengeButtons = function(user,elements,userOptions)
{
    var defaultOptions ={
        showOffline:false,
        showOnline:false,
        showPlayButtons:true //Play, Specific Challenges, Away
    };
    elements.each(function(){
        var element = $(this);
        var userOptions = element.data('challengeButtonOptions');
        var options = null;

        if(userOptions)
        {
            options = $.extend(defaultOptions,userOptions);
        }
        else
        {
            var onlineUser = element.closest('.online_user');
            if(onlineUser.length)
            {
                userOptions = onlineUser.data('challengeButtonOptions');
                if(userOptions)
                {
                    element.data('challengeButtonOptions',userOptions);//Steal the parent's options
                }
                options = $.extend(defaultOptions,userOptions);
            }
            else
            {
                options = defaultOptions;
            }
        }

        var challenge = element.find('.challenge');
        var challenged = element.find('.challenged');
        var noChallenges = element.find('.no_challenges');
        var nowPlaying = element.find('.now_playing');
        var online = element.find('.is_online');
        var offline = element.find('.is_offline');
        var invite = element.find('.invite');
        var allButtons = challenge
            .add(challenged)
            .add(noChallenges)
            .add(nowPlaying)
            .add(online)
            .add(invite);


        allButtons.hide();

        if(user.is_browser_idle)
        {
            element.addClass('browser_idle');
        }
        else
        {
            element.removeClass('browser_idle');
        }

        if(options.showOffline && options.showOnline)
        {
            if(user.is_online)
            {
                element.addClass('is_online');
                element.removeClass('is_offline');
            }
            else //we just assume the worst of this person
            {
                element.addClass('is_offline');
                element.removeClass('is_online');
            }
            return;
        }
        if(options.showOffline && !options.showOnline)
        {
            if(!user.is_online)
            {
                element.addClass('is_offline');
                element.removeClass('is_online');
                //If this isn't the case, then we'll show normal play buttons
                return;
            }
            else
            {
                element.addClass('is_online');
                element.removeClass('is_offline');

            }
        }

        if(options.showPlayButtons)
        {
            var challenges = LadderInfo.retrieveReference('openChallenges');

            if(!challenges.extraData.users)
                challenges.extraData.users = {};

            if(challenges.extraData.users[user.id])
            {
                element.removeClass('away');
                challenged.show();
                return;
            }
            // if(options.showAway)
            // {
            //     if(user.wants_to_play !== null && !user.wants_to_play)
            //     {
            //         element.addClass('away');
            //         noChallenges.show();
            //         return;
            //     }
            // }
            if(user.is_playing)
            {
                element.removeClass('away');
                nowPlaying.show();
                return;
            }

            if(options.showMatchSpecificOptions && user.match && user.match.expiration)
            {
                challenge.addClass('active').show();
                ElementUpdate.updateMatchCount(user.match,challenge);
                if(user.match.is_ranked)
                {
                    challenge.removeClass('friendlies');
                    challenge.addClass('ranked');
                }
                else
                {
                    challenge.removeClass('ranked');
                    challenge.addClass('friendlies');
                }
                return;
            }


            if(options.inviteToMatch && Dashboard.currentMatch && Dashboard.currentMatch.isDoubles())
            {
                invite.data('match_id',Dashboard.currentMatch.id);
                invite.show();
                return;
            }
            if(user.id != myUser.id)
            {
                challenge.show();
            }

        }
        challenge.text('Play').removeClass('active').removeClass('friendlies ranked').attr('title','Click to ask for a match!');
    });
};
ElementUpdate.updateMatchCount = function(match,$container, updateAnyway)
{
    if(!(match instanceof Match))
    {
        match = new Match(match);
    }
    var matchCount = match.match_count;
    var ranked = match.is_ranked;
    var gameType = match.game_type;

    var gameName = $('<span>').addClass('game_name');
    var textString = '';
    if(!updateAnyway && $container.hasClass('game_name_added'))
    {
        return;
    }
    $container.addClass('game_name_added');
    $container.empty();
    if((match.game_type && !$container.hasClass('game-'+match.game_slug)) || updateAnyway)
    {
        $container.addClass('game-'+match.game_slug);
        if($container.hasClass('show_image') && match.ladder && match.ladder.small_image && !gameName.hasClass('image_added'))
        {
            gameName.addClass('image_added');
            var image = $('<img>').attr('src',match.ladder.small_image);
            image.prependTo(gameName);
        }
        else
        {
            gameName.text(match.ladder_name+' ');
        }
        textString += gameName.text();
        $container.append(gameName);
    }

    var matchCountText = $('<span>').addClass('match_count_text');
    if(matchCount)
    {
        matchCountText.text('Best of '+matchCount);
    }
    else
    {
        matchCountText.text('Endless');
    }
    textString += matchCountText.text();
    $container.append(matchCountText);
    if(match.isDoubles())
    {
        var doublesText = $('<span>').addClass('is_doubles');
        doublesText.text(' Doubles');
        $container.append(doublesText);
    }
    if($container.is('button'))
    {
//			$container.text('');
    }
    else
    {
        var matchType = $('<span>').addClass('match_type');
        if(ranked)
        {
            matchType.text(' Ranked');
        }
        else
        {
            matchType.text(' Friendlies');
        }
        $container.append(matchType);
    }
    return textString;
};


/** WEBPACK FOOTER **
 ** ./../components/ElementUpdate.jsx
 **/