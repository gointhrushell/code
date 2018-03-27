import {ElementUpdate} from "../components/ElementUpdate";
import {DateFormat} from "../components/DateFormat.jsx";
import {LadderDistance} from "../components/LadderDistance.jsx";
import {ChatActions} from "../components/ChatActions";
import {Dashboard} from "../components/Dashboard";
import {SiteLinker} from "../components/SiteLinker";
import {Html} from "../components/Html";

import {UserlistElement} from "../models/UserlistElement";
import {Character} from "../models/Character.jsx";
import {Match} from "../models/Match.jsx";
import {Infraction} from "../models/Infraction.jsx";
import {declickables, Declickables} from "components/Declickables";
import {ladderHistory} from "components/LadderHistory";
import {MatchmakingPopup} from "components/MatchmakingPopup.jsx";
import {Request} from "components/Request.jsx";
import {PrivateChatLoader} from "components/PrivateChatLoader.jsx";
import {GameRoom} from "../models/GameRoom";

class UserInfo
{

    constructor(infoContainer){
        this.infoContainer = infoContainer;
        this.currentUser = null;
        this.currentData = {};
        this.lastPosition = {x:0,y:0};
        this.lasClickedElement = null;
    }

    setUserCollection(userCollection){
        this.userCollection = userCollection;
    }



    loadProfile(requestData, position){
        let user = null;
        this.requestData = requestData;
        let infoContainer = this.infoContainer;
        if(requestData.id)
        {
            user = this.userCollection.retrieveById(requestData.id);
        }
        else if(requestData.username)
        {
            user = this.userCollection.retrieveByUsername(requestData.username);
        }
        else
        {
            alert(' no user found');
        }

        // let tempUser = new User({
        //     id:user.id,
        //     username:user.username,
        //     location: user.location
        // });
        // tempUser = user;
        this.initializeContainer(user);
        if(position)
        {
            this.lastPosition = position;
        }

        Dashboard.UserInfo.updateContainer(user, requestData);
        ladderHistory.updateProfileCard(requestData);
        declickables.add(infoContainer);

        var userInfoXhr = $.get(siteUrl+'/matchmaking/user',requestData,(response)=>{
            if(response.success)
            {
                if(response.ladders)
                {
                    for(let id in response.ladders)
                    {
                        if(!response.ladders.hasOwnProperty(id))
                        {
                            continue;
                        }
                        let retrieved = GameRoom.retrieve(response.ladders[id]);
                    }
                }
                user = this.userCollection.update(response.user);
                if(userInfoXhr.cancelled)
                {
                    return;
                }

                user.hasCompletelyLoadedProfile = true;
                // button.data('username', user.username);
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
                    if(ChatActions.getActiveChatContainer())
                    {
                        holdsChatIdData.data('chat', ChatActions.getActiveChatContainer());
                    }
                }
                else
                {
                    infoContainer.findCache('.holds_chat_id_data').data('chat-id',null);
                }

                Dashboard.mainUserInfo.addClass('visible');
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

            Dashboard.keepContainerOnScreen(infoContainer, this.lastPosition);
        });
        userInfoXhr.realAbort = userInfoXhr.abort;
        userInfoXhr.abort = function(){
            userInfoXhr.cancelled = true;
        };
        infoContainer.data('request',userInfoXhr);
    }

    updateContainer(user, contextData){
        var infoContainer = this.infoContainer;

        this.currentUser = user;
        this.currentData = contextData;

        infoContainer.data('user',user);

        this.updateGames();

        infoContainer.toggleClass('has_complete_load', !!user.hasCompletelyLoadedProfile);


        infoContainer.findCache('.report_user').data('context',{
            player_id:user.id,
            chat_room_id:contextData.chat_room_id,
            message_id:contextData.message_id,
            match_id:contextData.match_id
        });

        if(!infoContainer.data('popoverEventsAttached'))
        {
            infoContainer.data('popoverEventsAttached', true);
            infoContainer.on('click','.extra_data',function(e){
                var extra = $(this);
                let field = extra.data('field');
                if(user.id != myUser.id)
                {
                    return;
                }
                if(!field.isEditable())
                {
                    return;
                }
                e.preventDefault();
                var data= {
                    field: field.type
                };
                declickables.closeDeclickables();
                let popup = Dashboard
                    .ladderPopup(null,'Edit your '+field.name)
                    .showLoader();
                $.get(siteUrl+'/matchmaking/edit_game_specific_field', data, function(response){
                    let content = $(response.html);
                    popup.updateContent(content);
                    var form = content.find('form');
                    form.submit(function(e){
                        e.preventDefault();
                        let form = $(this);
                        var data = form.serializeArray();
                        var inputs = form.find(':input');
                        inputs.prop('disabled', true);
                        $.post(form.attr('action'),data).success(function(response){

                            if(response.success)
                            {
                                popup.dismiss()
                            }
                            else
                            {
                                if(response.error)
                                {
                                    alert(response.error);
                                }
                                else
                                {
                                    alert('There was an error');
                                }
                            }
                        }).fail(function(){
                            alert('There was a server side error');
                        }).always(function(){
                            inputs.prop('disabled', false);
                        });
                    });
                });
            });
        }

        infoContainer.find('.popover').remove();


        if(user.local_time)
        {
            infoContainer.findCache('.location');
            infoContainer.findCache('.location').popover({
                html:true,
                trigger:'hover',
                placement:'top',
                container: infoContainer,
                content: '<div>'+DateFormat.small(user.local_time.timestamp)+'</div>',
                title: '',

            });

            // infoContainer.findCache('.local_time').text(user.local_time);
        }
        if(user.username)
        {
            infoContainer.find('.flairy_holder, .ceo-flair').remove();
            var myUsernameElements = infoContainer.findCache('.username')
                .not('.other_username')
                .not('.exempt');

            user.updateUserElements(myUsernameElements);
            myUsernameElements.text(user.getStyledUsername());
            ElementUpdate.flair(myUsernameElements,user);

        }


        infoContainer.toggleClass('has_dolphin_launcher', !!user.has_dolphin_launcher);

        if(user.subscription_streak)
        {
            infoContainer.findCache('.subscription_streak').addClass('active');
            infoContainer.findCache('.subscription_streak .count').text(user.subscription_streak);
            if(user.subscription_streak == 1)
            {
                infoContainer.findCache('.subscription_streak .subbed_once').addClass('active');
                infoContainer.findCache('.subscription_streak .resubbed').removeClass('active');
            }
            else
            {
                infoContainer.findCache('.subscription_streak .subbed_once').removeClass('active');
                infoContainer.findCache('.subscription_streak .resubbed').addClass('active');
            }
        }
        else
        {
            infoContainer.findCache('.subscription_streak').removeClass('active');
        }

        var profileLink = infoContainer.findCache('.profile_link');
        var challengeHolder = infoContainer.findCache('.challenge_holder');
        challengeHolder.show();

        if(user.is_online === undefined)
        {
            profileLink.toggleClass('is_online', false).toggleClass('is_offline', false);
        }
        else
        {
            profileLink.toggleClass('is_online', !!user.is_online).toggleClass('is_offline', !user.is_online);
        }

        infoContainer.toggleClass('my_info', this.isMyInfo());

        var showChatControls = false;
        if(myUser.is_mod)
        {
            showChatControls = true;
        }
        this.populateModControls(contextData);
        if(contextData.chat_room)
        {
            showChatControls = this.populateChatRoomControls(contextData,showChatControls);
        }
        else
        {
            infoContainer.findCache('.chat_mod_controls').hide();
            infoContainer.findCache('.chat_admin_controls').hide();
        }

        infoContainer.findCache('.toggle_controls').toggle(!!showChatControls);

        if(user.id)
        {
            infoContainer.findCache('.open_private_chat')
                .removeClass('disabled', false)
                .attr('href', siteUrl+'/netplay?send_message='+user.id)
                .findCache('button').prop('disabled', false);
            infoContainer.findCache('.holds_player_id_data').prop('disabled',false).data('player-id',user.id);
        }
        else
        {
            infoContainer.findCache('.open_private_chat')
                .addClass('disabled')
                .attr('href', '')
                .findCache('button').prop('disabled', true);
            infoContainer.findCache('.holds_player_id_data').prop('disabled',true);
        }

        var userNotes = infoContainer.findCache('.user_notes');
        if(user.notes && user.notes.length)
        {
            infoContainer.findCache('.user_notes_container').add(userNotes).addClass('has_notes');
            infoContainer.findCache('.user_notes_container .when').text(DateFormat.monthDayYear(user.notes[0].time.timestamp));
            infoContainer.findCache('.user_notes_container .the_notes')
                .show()
                .text(user.notes[0].content);
            infoContainer.findCache('.notes_count').addClass('active').text(user.notes.length);
        }
        else
        {
            infoContainer.findCache('.user_notes_container').add(userNotes).removeClass('has_notes');
            infoContainer.findCache('.user_notes_container .the_notes').hide();
            infoContainer.findCache('.notes_count').removeClass('active');
        }

        if(user.member_since)
        {
            infoContainer.findCache('.member_for_text').text(user.member_since.courtesy);
        }
        else
        {
            infoContainer.findCache('.member_for_text').text('...');
        }
        var distanceContainer = infoContainer.findCache('.distance_container');
        if(user.location || user.id == myUser.id)
        {
            distanceContainer.show();
            // LadderDistance.setDescription(distanceContainer.findCache('.distance_description'),user.location,myUser.location);
            infoContainer.findCache('.location').removeClass(Distance.getAllDistanceClasses());
            LadderDistance.setDistanceCssClasses(infoContainer.findCache('.location'),user.location,myUser.location)
                .text(user.location.relativeLocation());
            infoContainer.findCache('.location_container').addClass('active');
        }
        else
        {
            infoContainer.findCache('.location_container').removeClass('active');
        }

        infoContainer.findCache('.location_edit').toggle(user.id == myUser.id);

        if(ignoreList[user.id])
        {
            infoContainer.findCache('.unignore_user').show();
            infoContainer.findCache('.ignore_user').hide();
        }
        else
        {
            infoContainer.findCache('.ignore_user').show();
            infoContainer.findCache('.unignore_user').hide();
        }

        if(user.profile_url)
        {
            infoContainer.findCache('.profile_link').attr('href',user.profile_url);
        }

        infoContainer.findCache('input[name=player_id]').val(user.id);
        infoContainer.findCache('input[name=to_user_id]').val(user.id);


        infoContainer.findCache('.display_name').toggleClass('active', !!user.display_name);
        if(user.display_name)
        {
            infoContainer.findCache('.display_name .value').text(user.display_name);
        }
        else
        {
            infoContainer.findCache('.display_name .value').text('');
        }

        var awayMessageContainer = infoContainer.findCache('.away_message');
        awayMessageContainer.removeClass('blocked');
        if(user.away_message)
        {
            var finalText;
            if(user.id == myUser.id)
            {
                finalText = Html.encode(user.away_message);
            }
            else
            {
                finalText = SiteLinker.link(Html.encode(user.away_message));
                if(user.bio_banned)
                {
                    awayMessageContainer.addClass('blocked');
                }
            }
            awayMessageContainer.addClass('active').html(finalText);
        }
        else
        {
            awayMessageContainer.text('');
            awayMessageContainer.removeClass('active');
        }
        if(this.isMyInfo())
        {
            if(!$.trim(user.away_message).length)
            {
                awayMessageContainer.addClass('active').text('[Click here to edit your status message]');
            }
        }

        challengeHolder.data('challengeButtonOptions',
            UserlistElement.displayOptions.challengeButtonOptionsUserInfo);
        ElementUpdate.updateChallengeButtons(user,challengeHolder);

        var inviteButton = challengeHolder.findCache('.invite');
        if(inviteButton && Dashboard.currentMatch && Dashboard.currentMatch.matchContainer)
        {

            var matchContainer = Dashboard.currentMatch.matchContainer;
            inviteButton.off('click').on('click',function(e){
                e.preventDefault();
                var button = $(this);
                var data = {};
                data.player_id = user.id;
                data.match_id  = button.data('match_id');
                var chatHolder = matchContainer.data('chatHolder');
                $.post(siteUrl+'/chats/invite_player',data,function(response){
                    if(response.invite && response.invite.error)
                    {
                        ChatActions.inviteErrorMessageGenerator(user.id,response.invite, matchContainer.data('chat_container'));
                    }
                });
            });
        }

        if(myFriends[user.id])
        {
            infoContainer.findCache('.add_friend').hide();
            infoContainer.findCache('.remove_friend').show();
        }
        else
        {
            infoContainer.findCache('.add_friend').show();
            infoContainer.findCache('.remove_friend').hide();
        }

        // infoContainer.findCache('.matches_played').text(user.matches_played);
        if(typeof user.total_matches_played_recently !== 'undefined')
        {
            infoContainer.findCache('.friendlies_played_recently_container').show();
            infoContainer.findCache('.friendlies_played_recently').text(user.total_matches_played_recently);
        }
        else
        {
            infoContainer.findCache('.friendlies_played_recently_container').hide();
        }
        if(typeof user.total_matches_played_recently == 'undefined' && typeof user.total_matches_played !== 'undefined')
        {
            infoContainer.findCache('.friendlies_played_container').show();
            infoContainer.findCache('.friendlies_played').text(user.total_matches_played);
        }
        else
        {
            infoContainer.findCache('.friendlies_played_container').hide();
            infoContainer.findCache('.friendlies_played').text('...');
        }

        let historyContainer = infoContainer.findCache('.my_history_with_other');
        if(this.currentUser.most_recent_match)
        {
            if(!(this.currentUser.most_recent_match instanceof Match))
            {
                this.currentUser.most_recent_match = new Match(this.currentUser.most_recent_match);
            }
            let html = this.currentUser.most_recent_match.summaryDescription();

            historyContainer.data('matchId', this.currentUser.most_recent_match.id);
            historyContainer.find('.last_match').html(this.currentUser.most_recent_match.generateSummary({
                matchLink: false
            }));
            historyContainer.findCache('.last_play_date').text(DateFormat.fullNoSeconds(this.currentUser.most_recent_match.start_time));
            let duration = historyContainer.find('.last_played .duration').toggleClass('active', !!this.currentUser.most_recent_match.duration);
            duration.findCache('.text').text(this.currentUser.most_recent_match.duration ? this.currentUser.most_recent_match.duration : '');
            // ElementUpdate.updateMatchCount(this.currentUser.most_recent_match,historyContainer.findCache('.match_count'), true);
            // historyContainer.find('.match').attr('href',siteUrl+'/match/view/'+response.most_recent_match.id);
            historyContainer.addClass('active');
        }
        else
        {
            historyContainer.removeClass('active');
        }


        if(user.hasToxicWarning())
        {
            let infractions = user.reported_match_behavior;
            infoContainer.addClass('standing_toxic');
            infoContainer.findCache('.reported_match_behavior').addClass('toxic');
            infoContainer.findCache('.has_reported_match_behavior').addClass('active');

            var reportedMatchBehaviorList = infoContainer.findCache('.reported_match_behavior_list').empty();

            $.each(infractions,function(i, infraction){
                infraction.matchSummary().appendTo(reportedMatchBehaviorList);
            });
        }
        else if(user.behavior_description && user.behavior_description.type)
        {
            infoContainer.removeClass('standing_toxic');
            infoContainer.findCache('.reported_match_behavior')
                .addClass('general');

            infoContainer.findCache('.reported_match_behavior .description .text')
                .removeClass(UserInfo.behaviorClasses)
                .addClass(user.behavior_description.type)
                .text(user.behavior_description.description);

        }
        else
        {
            infoContainer.removeClass('standing_toxic');
        }

        var nowPlaying = infoContainer.findCache('.now_playing_container');
        if(this.currentData.now_playing || this.currentData.now_playing === null)
        {
            this.currentUser.now_playing = this.currentData.now_playing;
        }
        if(this.currentUser.now_playing)
        {
            var match = new Match(this.currentUser.now_playing);
            if(match.isSingles())
            {
                nowPlaying.addClass('singles');
            }
            else
            {
                nowPlaying.removeClass('singles');
            }

            nowPlaying.findCache('.match').attr('href',siteUrl+'/match/view/'+match.id);
            ElementUpdate.updateMatchCount(match,nowPlaying.findCache('.match_count'), true);

            var usersContainer = nowPlaying.findCache('.with_players').empty();
            match.setPerspectivePlayer(user);
            let otherPlayers = match.getOtherPlayerElements();
            if(otherPlayers)
            {
                nowPlaying.findCache('.with').hide();
                $.each(otherPlayers,function(i,player){
                    player.appendTo(usersContainer);
                });
            }
            else
            {
                nowPlaying.findCache('.with').show();
            }
            nowPlaying.data('match_id',match.id);
            // nowPlaying.find('.time').text(DateFormat.small(match.start_time)).data('timestamp',match.start_time);
            nowPlaying.addClass('active');
        }
        else
        {
            nowPlaying.removeClass('active');
        }

    };
    isMyInfo(){
        return this.currentUser === myUser || this.currentUser.id == myUser.id;
    };
    loadSuccess(){
        var infoContainer = this.infoContainer;
        infoContainer.findCache('.failed_request').hide();
    };
    populateModControls(response){
        var user = response.user;
        if(!user)
        {
            return;
        }
        var infoContainer = this.infoContainer;
        if(user.is_mod)
        {
            infoContainer.findCache('.remove_as_mod').show();
            infoContainer.findCache('.set_as_mod').hide();
        }
        else
        {
            infoContainer.findCache('.remove_as_mod').hide();
            infoContainer.findCache('.set_as_mod').show();
        }
        if(user.is_muted)
        {
            infoContainer.findCache('.mute_player').hide();
            infoContainer.findCache('.unmute_player').show().attr('title', 'Muted until ' + DateFormat.full(user.is_muted));
        }
        else
        {
            infoContainer.findCache('.mute_player').show();
            infoContainer.findCache('.unmute_player').hide();
        }
        if(user.is_shadow_muted)
        {
            infoContainer.findCache('.shadowban').hide();
            infoContainer.findCache('.unshadowban').show();
        }
        else
        {
            infoContainer.findCache('.shadowban').show();
            infoContainer.findCache('.unshadowban').hide();
        }
        if(user.is_link_restricted)
        {
            infoContainer.findCache('.link_ban').hide();
            infoContainer.findCache('.unlink_ban').show().attr('title', 'Link Banned until ' + DateFormat.full(user.is_link_restricted));
        }
        else
        {
            infoContainer.findCache('.link_ban').show();
            infoContainer.findCache('.unlink_ban').hide();
        }
    };
    populateChatRoomControls(response,showChatControls)
    {
        var infoContainer = this.infoContainer;
        var user = response.user;
        var current_user_room = response.chat_room.current_user_room;
        var other_user_room = response.chat_room.other_user_room;
        if(other_user_room && current_user_room.is_mod)
        {
            showChatControls = true;
            var modControls = infoContainer.findCache('.chat_mod_controls').show();
            if(other_user_room.muted)
            {
                modControls.findCache('.chat_mute_player').hide();
                modControls.findCache('.chat_unmute_player').show().attr('title','Muted ' + DateFormat.full(other_user_room.muted));
            }
            else
            {
                modControls.findCache('.chat_mute_player').show();
                modControls.findCache('.chat_unmute_player').hide();
            }
            if(other_user_room.kicked)
            {
                modControls.findCache('.kick_player').hide();
                modControls.findCache('.unkick_player').show().attr('title','Kicked until ' + DateFormat.full(other_user_room.kicked));
            }
            else
            {
                modControls.findCache('.kick_player').show();
                modControls.findCache('.unkick_player').hide();
            }
            if(other_user_room.banned)
            {
                modControls.findCache('.ban_player').hide();
                modControls.findCache('.unban_player').show();
            }
            else
            {
                modControls.findCache('.ban_player').show();
                modControls.findCache('.unban_player').hide();
            }
            if(other_user_room.hyperlinks_enabled)
            {
                modControls.findCache('.chat_link_ban').show();
                modControls.findCache('.chat_unlink_ban').hide();
            }
            else
            {
                modControls.findCache('.chat_link_ban').hide();
                modControls.findCache('.chat_unlink_ban').show();
            }
        }
        else
        {
            infoContainer.findCache('.chat_mod_controls').hide();
        }
        if(other_user_room && current_user_room.is_admin)
        {
            var adminControls = infoContainer.findCache('.chat_admin_controls').show();
            if(other_user_room.is_admin)
            {
                adminControls.findCache('.remove_admin').show();
                adminControls.findCache('.add_admin').hide();
            }
            else
            {
                adminControls.findCache('.remove_admin').hide();
                adminControls.findCache('.add_admin').show();
            }
            if(other_user_room.is_mod)
            {
                adminControls.findCache('.remove_mod').show();
                adminControls.findCache('.add_mod').hide();
            }
            else
            {
                adminControls.findCache('.remove_mod').hide();
                adminControls.findCache('.add_mod').show();
            }
        }
        else
        {
            infoContainer.findCache('.chat_admin_controls').hide();
        }

        if(other_user_room)
        {
            infoContainer.findCache('.invite_controls').hide();
        }
        else
        {
            infoContainer.findCache('.invite_controls').show();
        }

        if(showChatControls)
        {
            infoContainer.findCache('.cool_chat_controls').show();
        }
        else
        {
            infoContainer.findCache('.cool_chat_controls').hide();
        }
        return showChatControls;
    };

    updateGames(){
        var infoContainer = this.infoContainer;
        var icons = $();
        var user = this.currentUser;
        var response = this.currentData;
        let gameInfoHolder = infoContainer.findCache('.game_info_holder');
        if(gameInfoHolder.data('populated') == true)
        {
            return; //Prevent double population
        }
        if(user.ladder_information.hasLadders())
        {
            gameInfoHolder.data('populated', true);
            infoContainer.findCache('.game_info_holder .the_games').empty();
            var gameInfoTemplate = infoContainer.findCache('.game_info.template').clone();
            for(let [key, game] of user.ladder_information.getLaddersInOrder()){
                let league = user.ladder_information.getLeagueForLadder(game.id);
                var container = gameInfoTemplate.clone().removeClass('template');

                container.find('.title_value').text(game.name);
                ElementUpdate.league(container.find('.league'), league);

                var characterImage;
                var characterContainer = container.find('.characters');
                $.each(game.characters,function(i,character){
                    character = new Character(character);
                    characterContainer.append(character.generateElement());
                });

                var icon;
                var gameIconContainer = container.find('.game_icon');
                if(game.image_url)
                {
                    gameIconContainer.attr('src',game.image_url);
                }
                else
                {
                    gameIconContainer.remove();
                }

                var miniTierIcon = container.find('.mini_tier_icon');
                if(league && league.meetsRankedRequirements() && league.image_url)
                {
                    miniTierIcon.attr('src',league.image_url);
                }
                else
                {
                    miniTierIcon.remove();
                }
                var buildsContainer = container.find('.builds');
                container.find('.game_display').data('game', game);
                if(game.builds && game.builds.length)
                {
                    var buildsTemplate = buildsContainer.find('.build.template').clone();
                    buildsTemplate.removeClass('template');
                    var hasOne = false;
                    $.each(game.builds, function(i, build){
                        if(!build.active)
                        {
                            return;
                        }
                        hasOne = true;
                        var buildElement = buildsTemplate.clone();
                        buildElement.text(build.name).attr('title',build.description);
                        buildElement.appendTo(buildsContainer);
                    });
                    if(!hasOne)
                    {
                        buildsContainer.remove();
                    }
                }
                else
                {
                    buildsContainer.remove();
                }
                let ladder = game.getLadder();
                var extraDataHolder = container.find('.extra_data_holder');

                for(let field of ladder.connected_field_types)
                {
                    let data = field.pullFieldFromPlayer(user);

                    let value = data.primary_value;
                    let name = field.name;

                    var extra = container.find('.extra_data.template:first').clone().removeClass('template');
                    extra.find('.field_name').text(name);
                    extra.data('type',field.type);
                    extra.data('name',field.name);
                    extra.data('field', field);
                    extra.data('game', game);
                    if(value)
                    {
                        extra.find('.field_value').removeClass('empty').text(value);
                    }
                    else
                    {
                        extra.find('.field_value').addClass('empty').text('Not Set');
                    }
                    if(field.icon_classes)
                    {
                        extra.find('.icon').addClass(field.icon_classes+' active');
                    }
                    if(this.isMyInfo())
                    {
                        if(field.isEditable())
                        {
                            extra.addClass('editable');
                        }
                        else if(field.hasConnectUrl())
                        {
                            if(!value)
                            {
                                extra.find('.connect').addClass('active').text('Connect to '+field.name)
                                    .attr('href', field.connect_url);
                            }
                        }
                    }
                    else
                    {
                        extra.removeClass('editable');
                    }
                    extra.appendTo(extraDataHolder);
                }
                var textInfo = container.find('.text_info');
                var selectables = container.find('.game_display');


                selectables.data('content',textInfo);
                icons = icons.add(selectables);

                textInfo.detach();
                if(user.id == myUser.id)
                {
                    selectables.popover({
                        html:true,
                        trigger:'manual',
                        placement:'top',
                        container: infoContainer,
                    });
                }
                else
                {
                    selectables.popover({
                        html:true,
                        trigger:'manual',
                        placement:'top',
                        container: infoContainer,
                    });
                }

                //New code cannot be placed below the detach
                container.appendTo(infoContainer.findCache('.game_info_holder .the_games'));


            }
        }
        else
        {
        }

        $.each(icons,function(i,icon){
            icon = $(icon);
            icon.data('holdOpen',false);
            icon.on('click',function(e){
                icon.data('holdOpen',true);
            });
            icon.on('focus click mouseenter',function(e){
                if(icon.data('holdOpen') && user.id !== myUser.id)
                {
                    return;
                }
                icon.popover('show');
                icons.not(icon).popover('hide').data('holdOpen',false);
            });
            icon.on('mouseleave',function(e){
                if(!icon.data('holdOpen'))
                {
                    icon.popover('hide');
                }
            });
        });
        infoContainer.data('gameIcons',icons);
    }

    initializeContainer(user){
        let infoContainer = this.infoContainer;

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

        infoContainer.toggleClass('my_info', user === myUser);
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

        infoContainer.findCache('.distance_container').hide();
        infoContainer.findCache('.away_message').removeClass('active');
        infoContainer.findCache('.display_name').hide();
        infoContainer.findCache('.the_notes').text('');
        infoContainer.findCache('.local_time').text('');
        infoContainer.findCache('.has_reported_match_behavior').removeClass('active toxic');
        infoContainer.findCache('.reported_match_behavior')
            .removeClass(UserInfo.behaviorClasses);
        infoContainer.findCache('.summary_information_area').removeClass(UserInfo.displayStateClasses);


        infoContainer.findCache('.failed_request').hide();
        var gameInfoHolder = infoContainer.findCache('.game_info_holder').data('populated',false)
            .removeClass('game_select_mode');
        infoContainer.findCache('.games_general').removeClass('game_select_mode');
        gameInfoHolder.findCache('.the_games').empty();

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
                declickables.closeDeclickables();
            });
        }




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
            infoContainer.data('canBeUnclicked',true);
        }
        reappend();


        var challengeHolder = infoContainer.findCache('.challenge_holder').hide();
        if(infoContainer.data('request'))
        {
            var requestObject = infoContainer.data('request');
            infoContainer.data('request',null);
            requestObject.abort();
        }

        var chat = ChatActions.getActiveChatContainer();
        if(chat)
        {
            if(chat.data('chat').data('chat_room_id'))
            {
                this.requestData.chat_room_id = chat.data('chat').data('chat_room_id');
            }
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
            infoContainer.on('notClicked', Declickables.userInfoDeclickable);
            infoContainer.on('notClicked', ()=>{
                this.lastClickedElement = null;
            });
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
                declickables.closeDeclickables();
                /* Get chat context */
                ChatActions.reportToMods('Reporting '+$(this).data('username'),null,$(this).data('context'));
            });

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
                    declickables.closeDeclickables();
                }
                else
                {
                    window.location = siteUrl+'/netplay?send_message='+id;
                }
            });
        }
    }
}

UserInfo.behaviorClasses = 'general active questionable toxic neutral good positive new';
UserInfo.displayStateClasses = 'game_select_mode';

export {UserInfo}


/** WEBPACK FOOTER **
 ** ./../components/UserInfo.jsx
 **/