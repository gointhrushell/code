import {Ladder} from "./Ladder";
import {Dashboard} from "./Dashboard";
import {matchModeManager} from "../models/MatchModeManager";
import {MatchModeManager} from "../models/MatchModeManager";
import {Request} from "./Request";
import {LadderInfo} from "./LadderInfo";
import {ChatActions} from "./ChatActions";

var lastOptionalDescription = null;
export var MatchmakingPopup = function(popup, gameId, keepPopup){
	if(!gameId)
	{
		alert('game id required');
		return;
	}

	if(Dashboard.startMatchWithPlayer)
	{
		Dashboard.closeDeclickables();
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

	popup.find('.game_settings_link').data('ladder_id', gameId);
	if(game.data('has_bo3'))
	{
		popup.find('.game_settings_selection[data-match_count!=0]').show();
	}
	else
	{
		popup.find('.game_settings_selection[data-match_count!=0]').hide();
	}

	if(game.data('max_friendly_team_size') == 1)
	{
		popup.find('.game_settings_selection[data-team_size="2"]').hide();
		popup.find('.doubles_area').hide();
	}
	else
	{
		popup.find('.game_settings_selection[data-team_size="2"]').show();

		if(game.data('has_doubles_picks'))
		{
			popup.find('.doubles_area .game_settings_selection[data-team_size=2][data-match_count!=0]').show()
		}
		else
		{
			popup.find('.doubles_area .game_settings_selection[data-team_size=2][data-match_count!=0]').hide()
		}
		if(game.data('has_ranked_doubles'))
		{
			popup.find('.doubles_area.ranked').show()
		}
		else
		{
			popup.find('.doubles_area.ranked').hide()
		}
	}


	if(game.data('has_ranked') == 0 /*||  game.data('can_play_ranked') == 0 ||game.data('other_can_play_ranked') == 0 */ )
	{
		popup.find('.game_settings_selection[data-ranked="1"]').hide();
	}
	else
	{
		popup.find('.game_settings_selection[data-ranked="1"]').show();
	}

	var buildsByLadder = myUser.preferred_builds.getBuildsByLadder(gameId);
	popup.find('.build_preferences .build').removeClass('active');
	if(buildsByLadder && buildsByLadder.length)
	{
		var currentBuild = popup.find('#build_preference_'+gameId).addClass('active');
		$.each(currentBuild.find('.build'), function(i, build){
			build = $(build);
			var id = build.data('build_preference_id');
			var userBuild = myUser.preferred_builds.getBuildById(id);
			if(userBuild && userBuild.active)
			{
				build.addClass('selected').removeClass('unselected');
				build.find('input[name=build_active]').prop('checked', true);
			}
			else
			{
				build.addClass('unselected').removeClass('selected');
				build.find('input[name=build_active]').prop('checked', false);
			}
		});
		$.each(buildsByLadder, function(i, build){
			popup.find('.build[data-build_preference_id='+build.id+']').appendTo(currentBuild);
		});

		if(!popup.data('eventsAttached'))
		{
			popup.data('eventsAttached', true);
			var updateBuild = (build)=>{
				var checkbox = build.find('input[name=build_active]');
				var changeTo = checkbox.is(':checked') ? 1: 0;
				if(changeTo)
				{
					build.removeClass('unselected').addClass('selected');
				}
				else
				{
					build.removeClass('selected').addClass('unselected');
				}
				var undo = function(){
					if(changeTo)
					{
						build.removeClass('selected').addClass('unselected');
					}
					else
					{
						build.removeClass('unselected').addClass('selected');
					}
				};

				var data = {
					build_preference_id: build.data('build_preference_id'),
					active: changeTo
				};
				$.post(siteUrl+'/apiv1/update_build_preference_active', data, function(response){
					if(response.success)
					{
						myUser.setProperties({preferred_builds:response.preferred_builds});
						Dashboard.updateSearchesByBuildPreference(Dashboard.recentMatchSearchers.find('.recent_match_searcher').not('.template'));
					}
					else
					{
						undo();
					}
				}).error(function(){
					undo();
				});
			};
			popup.on('change','.build input[name=build_active]', function(e){
				var build = $(this).closest('.build');
				// var modal = $('#bootstrap-modal').modal(title, content);
				updateBuild(build);
			});
		}
		var currentBuildData = myUser.preferred_builds
	}
	else
	{
		popup.find('.build_preference_set').removeClass('active');
	}

	if(!popup.data('playEvents'))
	{
		popup.data('playEvents', true);
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

	this.optionalDescription = popup.find('.optional_description').val(lastOptionalDescription);

	var finishedMenu = function(goBackToMenuTab){
		$('#matchmaking_popup_loading').addClass('active');
		$('#matchmaking_popup_error_message').hide();
		var visibleDescription = that.optionalDescription.filter(':visible');
		var ranked = that.selectedOptions.ranked;

		if(Dashboard.startMatchWithPlayer)
		{
			return MatchmakingPopup.challengeSearch(Dashboard.startMatchWithPlayer,that.selectedOptions,null,null,null,endSelectOption);
		}
		else
		{

		}

		var data = that.selectedOptions;

		lastOptionalDescription = that.selectedOptions.title;
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
	if(match){
		var player_id = player.data('match').player1.id;
	}
	else{
		player_id = player.find('input[name=player_id]').val();
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