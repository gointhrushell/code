import {Ladder} from "./Ladder";
import {Dashboard} from "./Dashboard";
import {matchModeManager} from "../models/MatchModeManager";
import {MatchModeManager} from "../models/MatchModeManager";
import {Request} from "./Request";
import {LadderInfo} from "./LadderInfo";
import {ChatActions} from "./ChatActions";
import {declickables} from "./Declickables";

export var MatchmakingPopup = function(popup, gameId, keepPopup){
	if(!gameId)
	{
		alert('game id required');
		return;
	}

	if(Dashboard.startMatchWithPlayer)
	{
		declickables.closeDeclickables();
	}
	else
	{
	}
	this.teamSize = null;
	this.hasRanked = null;
	this.hasBo3 = null;
	this.canPlayRanked = null;
	this.matchSystem = null;

	var reference = this;
	var that = this;

	this.selectedOptions = {
		team_size:null,
		game_id:null,
		match_count:null,
		title:null,
		ranked:null
	};

	var game = popup.find('.request_match_option[data-game_id='+gameId+']');
	var gameAppend = game.find('.game_image').clone();
	gameAppend.appendTo(popup.find('.game_append').empty());

	popup.find('.ladder_stats').data('ladder_id', gameId);
	if(popup.hasClass('matchmaking_popup'))
	{
		popup.find('.game_setting[data-match_count!=0]').toggle(!!game.data('has_bo3'));
		popup.find('.ranked_selections').toggle(!!game.data('has_ranked'));

		if(game.data('max_friendly_team_size') == 1)
		{
			popup.find('.game_setting[data-team_size="2"]').hide();
			popup.find('.doubles_area').hide();
		}
		else
		{
			popup.find('.game_setting[data-team_size="2"]').show();

			popup.find('.doubles_area .game_setting[data-team_size=2][data-match_count!=0]').toggle(!!game.data('has_doubles_picks'))
			popup.find('.doubles_area.ranked').toggle(!!game.data('has_ranked_doubles'))
		}
	}

	popup.find('.selection_stuffer .notifications').each(function(i, notification){
		notification = $(notification);
		notification.data('ladder_id', gameId);
		let data = notification.data();
		data.ladder_id = gameId;
		if(myUser.getSearchNotifications().hasNotification(data))
		{
			notification.addClass('active');
		}
		else
		{
			notification.removeClass('active');
		}
	});


	if(game.data('has_ranked') == 0 /*||  game.data('can_play_ranked') == 0 ||game.data('other_can_play_ranked') == 0 */ )
	{
		popup.find('.game_settings_selection[data-ranked="1"]').hide();
	}
	else
	{
		popup.find('.game_settings_selection[data-ranked="1"]').show();
	}

	if(!popup.data('playEvents'))
	{
		popup.data('playEvents', true);
		popup.on('click', '.selection_stuffer .notifications', function(e){
			let button = $(this);
			button.prop('disabled', true);
			let add = button.hasClass('active') ? 0: 1;
			let data = button.data();

			if(button.hasClass('active'))
			{
				alert('You will no longer receive notifications when someone is searching for this type of match');
			}
			else
			{
				alert('You will receive a notifications when someone is searching for this type of match within your preferred distance');
			}

			button.toggleClass('active');
			data.add = add;
			$.post(siteUrl+'/apiv1/sticky_search', data, function(response){
				if(response.success)
				{
					if(response.search_notifications)
					{
						let searchNotifications = response.search_notifications;
						myUser.getSearchNotifications().updateAll(searchNotifications);
					}
				}
				else
				{
					button.toggleClass('active');
				}
				button.prop('disabled', false);
			}).error(function(){
				button.toggleClass('active');
				button.prop('disabled', false);
			});
		});
		popup.on('click','.game_settings_selection', function(e){

			var button = $(this);
			if(button.hasClass('disabled'))
			{
				return;
			}
			button.addClass('disabled');

			that.selectedOptions.team_size = button.data('team_size');
			that.selectedOptions.ranked = button.data('ranked');
			that.selectedOptions.match_count = button.data('match_count');
			that.selectedOptions.game_id = gameId;


			that.selectedOptions.title = $('#match_options_optional_description').val();
			that.clickable = false;
			$('#matchmaking_popup_error_message').hide();
			finishedMenu($('#matchmaking_popup_game')).then((response)=>{
				if(response && response.error)
				{
					alert(response.error);
				}
				button.removeClass('disabled');
			});
		});
	}
	popup.find('.game_settings_selection').removeClass('disabled');

	var endSelectOption = function(){
		matchModeManager.changeViewMode(MatchModeManager.modes.SEARCH);
		if(!keepPopup)
		{
			popup.remove();
		}
	};

	popup.find('#matchmaking_popup_back_button').click(function(e){
		e.preventDefault();
		endSelectOption();
	});

	if(!myUser.previous_titles)
	{
		myUser.previous_titles = {};
	}
	if(myUser.previous_titles && myUser.previous_titles[gameId])
	{
		this.optionalDescription = popup.find('#match_options_optional_description').val(myUser.previous_titles[gameId].title);
	}


	var finishedMenu = function(goBackToMenuTab){
		$('#matchmaking_popup_loading').addClass('active');
		$('#matchmaking_popup_error_message').hide();
		var ranked = that.selectedOptions.ranked;

		if(Dashboard.startMatchWithPlayer)
		{
			return MatchmakingPopup.challengeSearch(Dashboard.startMatchWithPlayer,that.selectedOptions,null,null,null,endSelectOption);
		}
		else
		{

		}

		var data = that.selectedOptions;

		if(myUser.previous_titles)
		{
			myUser.previous_titles[gameId] = {title: that.selectedOptions.title};
		}
		data.host_code = Dashboard.retrieveHostCode();
		let activeChatContainer = ChatActions.getActiveChatContainer();
		if(activeChatContainer && activeChatContainer.length)
		{
			data.chat_room_id = activeChatContainer.data('chat').data('chat_room_id');
		}
		addGaEvent('matchmaking','seeking');

		return new Promise((resolve, reject)=>{
			Request.send(data,'begin_matchmaking',function(response){
				$('#matchmaking_popup_loading').removeClass('active');
				if(response.success)
				{
					endSelectOption();
					if(response.message)
					{
						alert(response.message);
					}
				}
				else
				{
					goBackToMenuTab.click();
					if(response.message)
						$('#matchmaking_popup_error_message').text(response.message).show();
					if(response.error)
						$('#matchmaking_popup_error_message').text(response.error).show();
				}
				resolve(response);
				return true;
			})
		});

	};

};

MatchmakingPopup.showChangeBuildPreferenceDialog = function(match){
	let popup = Dashboard.showSearchRestrictionsDialog(match.ladder_id);
	popup.changeTitleText('Change Match Build / Update Settings');

	let preference = popup.popup;
	preference.addClass('build_changer build_preference_set');
	if(match.start_time)
	{
		preference.addClass('match_set_build');
	}

	// preference.on('change','.build input[name=build_active]', function(e){
	// 	var build = $(this).closest('.build');
	// 	Dashboard.updateBuildAction(build);
	// });

	preference.on('click', '.change_match_build', function(){

		let build = $(this).closest('.build');
		if(build.hasClass('disabled'))
		{
			return;
		}

		let buildPreferenceId = build.data('build_preference_id');

		build.addClass('loading');
		preference.find('.build').addClass('disabled');

		let buildActive = build.find('input[name=build_active]');
		if(buildActive.is(':checked'))
		{
			return changeMatchBuild();
		}
		else
		{
			buildActive.prop('checked', true);
			return Dashboard.updateBuildAction(build)
				.then(()=>{
					changeMatchBuild();
				});
		}
		function changeMatchBuild()
		{
			return new Promise((resolve, reject) =>{
				$.post(siteUrl+'/matchmaking/change_match_build_preference', {match_id: match.id, build_preference_id: buildPreferenceId},
					function(response){

						popup.dismiss();
						resolve();
					}
				).error(function(){
					alert('There was an error updating the build preference');
					reject();

				});
			});
		}
	});
};

var playOptionsHtml = null;
MatchmakingPopup.showMatchSelectDialog = function(ladderId, launchPopup)
{
	if(typeof launchPopup == 'undefined')
	{
		launchPopup = true;
	}
	$('#match_settings_holder').empty();
	return new Promise((resolve, reject) =>{
		if(!ladderId)
		{
			let errorMessage = new Error('A game needs to be specified!');
			alert(errorMessage);
			reject(errorMessage);
			return;
		}
		var data;
		var specificPlayer = null;
		if(Dashboard.startMatchWithPlayer)
		{
			specificPlayer = true;
			data = {other:Dashboard.startMatchWithPlayer.data('username')};
		}
		else
		{
			data = {};
		}
		data.ladder_id = ladderId;

		if(Dashboard.currentMatch && launchPopup)
		{
			let errorMessage = new Error('You cannot challenge another player while you are still in a match!');
			Dashboard.battleTab.trigger('activate');
			reject(errorMessage);
			Ladder.coolAlert(errorMessage);
			return;
		}

		var openPopupWithData = function(innerHtml){
			var matchPlayOptions = $('#match_play_options').html(innerHtml);

			if(launchPopup)
			{
				matchModeManager.changeViewMode(MatchModeManager.modes.SELECT_OPTIONS);
			}
			var popup = new MatchmakingPopup($('#matchmaking_popup'), data.ladder_id);
			resolve();
		};
		if(launchPopup)
		{
			Dashboard.matchmakingPaneShouldGetFocusIfNeeded();
		}
		if(!specificPlayer && playOptionsHtml)
		{
			openPopupWithData(playOptionsHtml);
		}
		else
		{
			$('#play_options_loading').addClass('active');
			$.post(siteUrl+'/matchmaking/play_options',data,function(response){
				if(response.success)
				{
					var html = response.html;
					if(response.previous_titles)
					{
						myUser.previous_titles = response.previous_titles;
					}
					if(!specificPlayer && !response.error_message)
					{
						playOptionsHtml = html;
					}
					openPopupWithData(response.html);
				}
				else
				{

				}
				$('#play_options_loading').removeClass('active');
			}).error(function(){
				reject(new Error('Server Error'));
			});
		}
	});
}

MatchmakingPopup.challengeSearch = function(playerInfo,game,match_count,ranked,matchId,finishedCallback){
	var player = playerInfo;
	var match = player.data('match');
	var player_id;
	if(player.data && player.data('user'))
	{
		player_id = player.data('user').id;
	}
	else if(match){
		player_id = player.data('match').player1.id;
	}
	else
	{
		throw 'Unable to get player id';
	}

	if(player.data('user')){
		let user = player.data('user');
		if(user.getToxicCount() >= 2)
		{

			return user.showToxicWarning().then(function(){
				return sendTheChallenge();
			}).catch(function(){

			});
		}
	}
	return sendTheChallenge();

	function sendTheChallenge(resolver)
	{
		var data;
		if(game)
		{
			data = game;
		}
		else
		{
			data = {};
		}
		data.challenge_player_id = player_id;
		data.match_id = matchId;

		if(matchId)
		{
			var reference = LadderInfo.retrieveReference('currentMatches');
			delete reference.callbacks.preventReadd[matchId];
		}
		var challenge = player.find('.challenge');
		var challenged = player.find('.challenged');

		challenge.removeClass('active').hide();
		challenged.addClass('active').show();

		return new Promise(function(resolve, reject){

			Request.send(data,'challenge_search',function(response){
				if(response.success)
				{
					if(finishedCallback)
					{
						finishedCallback();
					}
					if(response.challenged)
					{
						challenged.addClass('active').show();
						challenge.removeClass('active').hide();
						player.find('.no_challenges').hide();
					}
					else
					{
						challenge.addClass('active').show();
						challenged.removeClass('active').hide();
					}
					if(response.error)
					{
						alert(response.error);
					}
					if(response.message)
					{
					}
					resolve();
					if(resolver)
					{
						resolver();
					}
				}
				else
				{
					if(response.error)
					{
						$('#matchmaking_popup_match_count').click();
						if(response.message)
							$('#matchmaking_popup_error_message').text(response.message).show();
						if(response.error)
							$('#matchmaking_popup_error_message').text(response.error).show();
						alert(response.error);
					}
					challenge.addClass('active').show();
					challenged.removeClass('active').hide();
					reject(response);
				}


				return true;//Ccontinue message response parsing
			});

		});
		addGaEvent('matchmaking','challenging');

	}

}



/** WEBPACK FOOTER **
 ** ./../components/MatchmakingPopup.jsx
 **/