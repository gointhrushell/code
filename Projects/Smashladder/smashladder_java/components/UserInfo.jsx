import {Popups} from "../components/Popups";
import {ElementUpdate} from "../components/ElementUpdate";
import {DateFormat} from "../components/DateFormat.jsx";
import {LadderDistance} from "../components/LadderDistance.jsx";
import {ChatActions} from "../components/ChatActions";
import {Dashboard} from "../components/Dashboard";
import {SiteLinker} from "../components/SiteLinker";
import {Html} from "../components/Html";

import {UserlistElement} from "../models/UserlistElement";
import {League} from "../models/League.jsx";
import {Character} from "../models/Character.jsx";
import {Match} from "../models/Match.jsx";
import {Infraction} from "../models/Infraction.jsx";

export var UserInfo = function(infoContainer){
    this.infoContainer = infoContainer;
    this.currentUser = null;
    this.currentData = {};
};
UserInfo.prototype.updateContainer = function(user, contextData){
    var infoContainer = this.infoContainer;
    this.currentUser = user;
    this.currentData = contextData;

    infoContainer.data('user',user);

    this.updateGames();

    infoContainer.findCache('.report_user').data('context',{
        player_id:user.id,
        chat_room_id:contextData.chat_room_id,
        message_id:contextData.message_id,
        match_id:contextData.match_id
    });


    if(user.local_time)
    {
        infoContainer.findCache('.local_time').text(user.local_time);
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


    if(user.has_dolphin_launcher)
    {
        infoContainer.addClass('has_dolphin_launcher');
    }
    else
    {
        infoContainer.removeClass('has_dolphin_launcher');
    }
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
    if(user.is_online)
    {
        profileLink.findCache('.is_offline').hide();
        profileLink.findCache('.is_online').show();
    }
    else
    {
        profileLink.findCache('.is_offline').show();
        profileLink.findCache('.is_online').hide();
        // challengeHolder.hide();
    }

    if(this.isMyInfo())
    {
        infoContainer.addClass('my_info');
    }
    else
    {
        infoContainer.removeClass('my_info');
    }

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

    if(showChatControls)
    {
        infoContainer.findCache('.toggle_controls').show();
    }
    else
    {
        infoContainer.findCache('.toggle_controls').hide();
    }

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

    }
    else
    {
        infoContainer.findCache('.user_notes_container').add(userNotes).removeClass('has_notes');
        infoContainer.findCache('.user_notes_container .the_notes').hide();
    }

    if(user.member_since)
    {
        infoContainer.findCache('.member_for_text').text(user.member_since.courtesy);
        infoContainer.findCache('.member_for').show();
    }
    else
    {
        infoContainer.findCache('.member_for').show();
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
        infoContainer.findCache('.location_container').show();
    }
    else
    {
        infoContainer.findCache('.location_container').hide();
    }
    if(user.id == myUser.id)
    {
        infoContainer.findCache('.location_edit').show();
    }
    else
    {
        infoContainer.findCache('.location_edit').hide();
    }

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

    if(user.display_name)
    {
        infoContainer.findCache('.display_name').show();
        infoContainer.findCache('.display_name .value').text(user.display_name);
    }
    else
    {
        infoContainer.findCache('.display_name').hide();
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
        if(!user.away_message.length)
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

    if(this.currentUser.most_recent_match)
    {
        if(!this.currentUser.most_recent_match instanceof Match)
        {
            this.currentUser.most_recent_match = new Match(this.currentUser.most_recent_match);
        }
        var historyContainer = infoContainer.findCache('.my_history_with_other');
        historyContainer.show();
        historyContainer.findCache('.last_play_date').text(DateFormat.smart(this.currentUser.most_recent_match.start_time));
        historyContainer.findCache('input[name=match_id]').val(this.currentUser.most_recent_match.id);
        ElementUpdate.updateMatchCount(this.currentUser.most_recent_match,historyContainer.findCache('.match_count'), true);
        // historyContainer.find('.match').attr('href',siteUrl+'/match/view/'+response.most_recent_match.id);
    }
    else
    {
        infoContainer.findCache('.my_history_with_other').hide();
    }


    if(user.hasToxicWarning())
    {
        var infractions = Infraction.convert(user.reported_match_behavior, user);
        infoContainer.addClass('standing_toxic');
        infoContainer.findCache('.reported_match_behavior').addClass('toxic');
        infoContainer.findCache('.has_reported_match_behavior').addClass('active');

        var reportedMatchBehaviorList = infoContainer.findCache('.reported_match_behavior_list').empty();

        $.each(infractions,function(i, infraction){
            infraction.matchSummary().appendTo(reportedMatchBehaviorList);
        });
    }
    else if(user.total_matches_played > 20 || user.total_matches_played_recently > 20)
    {
        infoContainer.removeClass('standing_toxic');
        infoContainer.findCache('.reported_match_behavior').addClass('good');
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

        nowPlaying.show();
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
    }
    else
    {
        nowPlaying.hide();
    }
    
};
UserInfo.prototype.isMyInfo = function(){
    return this.currentUser === myUser;
};
UserInfo.prototype.loadSuccess = function(){
    var infoContainer = this.infoContainer;
    infoContainer.findCache('.failed_request').hide();
};
UserInfo.prototype.populateModControls = function(response){
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
UserInfo.prototype.populateChatRoomControls = function(response,showChatControls)
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

UserInfo.prototype.updateGames = function(){
    var infoContainer = this.infoContainer;
    var icons = $();
    var user = this.currentUser;
    var response = this.currentData;
    if(infoContainer.findCache('.game_info_holder').data('populated') == true)
    {
        return; //Prevent double population
    }
    if(user.ladder_information.hasLadders())
    {
        infoContainer.findCache('.game_info_holder').empty().data('populated', true);
        var gameInfoTemplate = infoContainer.findCache('.game_info.template').clone();
        $.each(user.ladder_information.getLaddersInOrder() ,(i,game) => {
            game.league = new League(game.league);
            var container = gameInfoTemplate.clone().removeClass('template');

            container.on('click','.extra_data',function(e){
                var extra = $(this);
                if(!(user.id == myUser.id && (extra.data('type') != 1 && extra.data('type') != 2)))
                {
                    return;
                }
                e.preventDefault();
                var data= {
                    game_id:extra.data('game').id,
                    field_name:extra.data('name')
                };
                Dashboard.closeDeclickables();
                Popups.ajax(siteUrl+'/matchmaking/edit_game_specific_field',data,function(response,content){
                    var form = content.find('form');
                    form.submit(function(e){
                        e.preventDefault();
                        var data = form.serializeArray();
                        var inputs = form.find(':input');
                        inputs.prop('disabled', true);
                        $.post(form.attr('action'),data).success(function(response){

                            if(response.success)
                            {
                                $.fancybox.close();
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
            container.find('.title_value').text(game.name);
            ElementUpdate.league(container.find('.league'),game.league);

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
            if(game.league.meetsRankedRequirements() && game.league && game.league.image_url)
            {
                miniTierIcon.attr('src',game.league.image_url);
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
            if(game.extra)
            {
                var extraDataHolder = container.find('.extra_data_holder');
                $.each(game.extra,(name,data) => {
                    var type = data.type;
                    var value = data.value;
                    var extra = container.find('.extra_data.template:first').clone().removeClass('template');
                    extra.find('.field_name').text(name);
                    extra.data('type',type);
                    extra.data('name',name);
                    extra.data('game',game);
                    if(value)
                    {
                        extra.find('.field_value').removeClass('empty').text(value);
                    }
                    else
                    {
                        extra.find('.field_value').addClass('empty').text('Not Set');
                    }
                    if(this.isMyInfo() && type != 1 && type != 2)
                    {
                        extra.addClass('editable');
                    }
                    else
                    {
                        extra.removeClass('editable');
                    }
                    extra.appendTo(extraDataHolder);
                });

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
                    placement:'top'
                });
            }
            else
            {
                selectables.popover({html:true,trigger:'manual',placement:'top'});
            }

            //New code cannot be placed below the detach
            container.appendTo(infoContainer.findCache('.game_info_holder'));


        });
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
};


/** WEBPACK FOOTER **
 ** ./../components/UserInfo.jsx
 **/