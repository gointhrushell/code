import {Dashboard} from '../components/Dashboard.jsx';
import {LadderHistory} from '../components/LadderHistory.jsx';
import {Request} from "../components/Request";

class MatchSummary {

	static refreshMatchDetailPage(){
		let currentMatch = CachedDispute.getCurrentMatch();
		let matchId = currentMatch.getMatchId();
		if(MatchSummary.currentRefresh && MatchSummary.currentRefresh.matchId)
		{
			if(MatchSummary.currentRefresh.matchId != matchId)
			{
				console.error('On a different match from the "Refreshing" page');
				return; //We're on a whole new match now
			}
		}

		if(MatchSummary.currentRefresh.xhr)
		{
			console.log('Clearing last XHR');
			MatchSummary.currentRefresh.xhr.abort();
			MatchSummary.resetCurrentRefresh();
		}

		MatchSummary.currentRefresh.matchId = matchId;
		MatchSummary.currentRefresh.xhr =
			$.get(retrieveMatchUrl(matchId), {json_page: 1}, function(response){
				if(response.html)
				{
					currentMatch = CachedDispute.getCurrentMatch();

					let updatedPage = CachedDispute.create($(response.html));
					if(updatedPage.getMatchId() != currentMatch.getMatchId())
					{
						console.error('On a different match from the "Refreshing" page');
						return; //We're on a whole new match now
					}
					updatedPage.activate();
				}
				MatchSummary.resetCurrentRefresh();
			}).error(function(){
				MatchSummary.resetCurrentRefresh();
			});
	}

	static openMatchInNewWindow(id)
	{
		window.open(siteUrl+'/match/view/'+id,'_blank');
	}

	static resetCurrentRefresh(){
		MatchSummary.currentRefresh = {
			xhr: null,
			matchId: null,
		};
	}

	static resetCurrentCaching(){
		MatchSummary.currentlyCaching = {
			xhr: null,
			matchId: null,
		};
	}

	static cacheNextDispute(matchId){
		if(CachedDispute.retrieve(matchId) && CachedDispute.retrieve(matchId).isReady())
		{
			return;
		}
		MatchSummary.resetCurrentCaching();
		let xhr = $.get(retrieveMatchUrl(matchId), {json_page : 1})
			.done(function(response){
				if(response.html)
				{
					CachedDispute.create($(response.html))
				}
			}).always(function(){
				MatchSummary.resetCurrentCaching();
			});
		MatchSummary.currentlyCaching.matchId = matchId;
		MatchSummary.currentlyCaching.xhr = xhr;
	}

	static isCurrentlyCaching(matchId)
	{
		if(!MatchSummary.currentlyCaching)
		{
			return false;
		}
		return MatchSummary.currentlyCaching.matchId == matchId;
	}

	static openMatchInline(matchId, loadingContainer){
		if(!matchId) //How the eff would we know what to open!?
		{
			console.log('wtf!');
			return;
		}

		var url = retrieveMatchUrl(matchId);
		if(!loadingContainer)
		{
			loadingContainer = $();
		}

		var finish = function(){
			loadingContainer.removeClass('loading');
			disputesContainer.removeClass('loading');
			disputesContainer.data('xhr',null);
			disputesContainer.data('loading',null);
		};
		if(disputesContainer.data('loading'))
		{
			if(disputesContainer.data('loading') == matchId)
			{
				return;
			}
			else
			{
				disputesContainer.data('xhr').abort();
				finish();
			}
		}

		disputesContainer.data('loading', matchId);
		disputesContainer.addClass('loading');
		loadingContainer.addClass('loading');


		let cached = CachedDispute.retrieve(matchId);
		if(cached && cached.isReady())
		{
			cached.activate(); //parsenewmatchdata
			finish();
		}
		else
		{
			let processResponse = function(response){
				if(response.html)
				{
					let match = CachedDispute.create($(response.html));
					match.activate();
				}
				finish();
			};
			if(MatchSummary.isCurrentlyCaching(matchId))
			{
				MatchSummary.currentlyCaching.xhr.done(processResponse)
					.error(function(){
						finish();
					});
			}
			else
			{
				let xhr = $.get(retrieveMatchUrl(matchId),{json_page : 1},processResponse)
					.error(function(){
						finish();
					});
				disputesContainer.data('xhr', xhr);
			}
		}
	}
}
MatchSummary.currentlyCaching = null;
class CachedDispute
{
	constructor(matchSummary, skipCache){
		this.matchSummary = matchSummary;
		this.matchId = matchSummary.data('match_id');
		this.readyToActivate = true;

		if(this.matchSummary.length)
		{
			let totalDisputes = this.matchSummary.find('.next-dispute').find('.badge').text();
			if(Number.isInteger(totalDisputes))
			{
				if(totalDisputes != CachedDispute.totalDisputes && CachedDispute.totalDisputes !== null)
				{
					CachedDispute.totalDisputes = parseInt(totalDisputes);
					CachedDispute.getCurrentMatch().matchSummary.find('.next-dispute').find('.badge').text(CachedDispute.totalDisputes);
				}
			}
		}
		if(!skipCache)
		{
			this.updateCache();
		}
	}

	replaceKeepNotes(newMatchSummary){
		if(newMatchSummary.matchSummary.length){

			if(this.matchSummary)
			{
				var oldNotes = this.matchSummary.find('#merit_form_');
				var newNotes = newMatchSummary.matchSummary.find('#merit_form_');

				oldNotes.off('submit');
				oldNotes.detach();
				newNotes.replaceWith(oldNotes);
			}
			if(CachedDispute.getCurrentMatch() === this)
			{
				CachedDispute.currentMatchSummary = newMatchSummary;
			}
			this.replaceContent(newMatchSummary);

			delete CachedDispute.cache[this.getMatchId()];
		}
	}

	replaceContent(newMatchSummary){
		let oldMatchSummaryElement = null;
		if(this === newMatchSummary)
		{
			console.log("DEFAULT CASE");
			console.log(newMatchSummary.matchSummary.children());
			oldMatchSummaryElement = $('.match_summary');
		}
		else
		{
			oldMatchSummaryElement = this.matchSummary;
		}
		oldMatchSummaryElement.empty().append(newMatchSummary.matchSummary.children());

		oldMatchSummaryElement.attr('class', newMatchSummary.matchSummary.attr('class'));
		oldMatchSummaryElement.data('match_id', newMatchSummary.getMatchId());
		newMatchSummary.matchSummary.find('.next-dispute').prop('disabled', false);
		if(CachedDispute.totalDisputes !== null)
		{
			newMatchSummary.matchSummary.find('.next-dispute .badge').text(CachedDispute.totalDisputes);
		}
		newMatchSummary.matchSummary = oldMatchSummaryElement;
		this.readyToActivate = false;
		if(this !== newMatchSummary)
		{
			this.matchSummary = null;//Is now replaced
		}

		newMatchSummary.readyToActivate = false;
	}

	replace(newMatchSummary){
		if(newMatchSummary.getMatchId() == this.getMatchId())
		{
			return this.replaceKeepNotes(newMatchSummary);
		}
		if(CachedDispute.getCurrentMatch() === this)
		{
			CachedDispute.currentMatchSummary = newMatchSummary;
		}
		this.replaceContent(newMatchSummary);

		delete CachedDispute.cache[this.getMatchId()];
	}

	static retrieve(matchId){
		return CachedDispute.cache[matchId];
	}

	static create(matchSummary){
		let summary = new CachedDispute(matchSummary);
		return summary;
	}

	cacheNextDispute(){
		let nextDisputeButton = this.getNextDisputeButton();
		if(!nextDisputeButton)
		{
			return false;
		}
		MatchSummary.cacheNextDispute(nextDisputeButton.data('next_match_id'));
	}

	getNextDisputeButton(){
		if(!this.matchSummary)
		{
			return null;
		}
		let nextDispute = this.matchSummary.find('.next-dispute');
		if(nextDispute.length)
		{
			return nextDispute;
		}
		return null;
	}

	activate(){
		let current = CachedDispute.getCurrentMatch();
		if(disputesContainer.length)
		{
			disputesContainer.addClass('match_detail_view');
		}
		else
		{
			LadderHistory.history.pushState(
				{
				matchId: this.getMatchId()},
				document.title,
				retrieveMatchUrl(this.getMatchId())
			);
		}
		console.log('activing ' + this.getMatchId());
		current.replace(this);

		this.readyToActivate = false;
		this.cacheNextDispute();

		delete CachedDispute.cache[this.matchId];
	}

	isReady(){
		return this.readyToActivate;
	}

	updateCache(){
		if(this.matchId)
		{
			if(!CachedDispute.currentMatchSummary)
			{
				console.log('setting first match summary');
				let previousPageSummary = $('.match_summary');
				if(previousPageSummary.length)
				{
					CachedDispute.currentMatchSummary = new CachedDispute(previousPageSummary, true);
				}
				CachedDispute.cache = {};
			}
			CachedDispute.cache[this.matchId] = this;
		}
		else
		{
			console.error('No match id somehow');
		}
	}

	getMatchId(){
		return this.matchId;
	}

	static getCurrentMatch(){
		if(CachedDispute.currentMatchSummary)
		{
			return CachedDispute.currentMatchSummary;
		}
		else
		{
			let matchSummary = $('.match_summary');
			return CachedDispute.currentMatchSummary = new CachedDispute(matchSummary);
		}
	}

	static parseNewMatchData(response){

		if(response.success)
		{

		}
		else
		{
			MatchSummary.openMatchInNewWindow(match.id);
		}
	}
}
CachedDispute.cache = {};
CachedDispute.currentMatchSummary = null;
CachedDispute.totalDisputes = null;

MatchSummary.resetCurrentRefresh();

var disputesContainer = Dashboard.disputesContainer;

let matchSummaryContainer = $('.match_summary');
matchSummaryContainer.on('submit', 'form.http_save', function(e){
	e.preventDefault();
	var form = $(this);
	var url = form.attr('action');
	var data;
	if(form.hasClass('button_talker')){
		var button = $(this).find('button.clicked');
		var buttonName = button.attr('name');
		var buttonValue = button.val();
		data = {};
		data[buttonName] = buttonValue;
		var hiddenInputs = form.find('input[type=hidden]');
		hiddenInputs.each(function(){
			var input = $(this);
			data[input.attr('name')] = input.val();
		});
	}
	else{
		data = form.serializeJSON();
	}
	var buttons = form.find('button');
	buttons.removeClass('clicked').prop('disabled', true);
	var saveType = null;
	if($(this).hasClass('http_save') || true){
		saveType = Request;
	}
	else{
		saveType = serverConnection;
	}
	//TODO: update dispute_message to go through http
	saveType.send(data, url, function(response){
		if(response.success){
			if(response.message){
				if(response.keep_open){
					Dashboard.ladderPopup(response.message, 'Match Updated');
				}
				else
				{
					Dashboard.ladderPopup(response.message, 'Match Updated');
				}
			}
			else{
				Dashboard.ladderPopup('','Match Updated');
			}
		}
		else{
			Dashboard.ladderPopup(response.message, 'Error');
		}
		buttons.prop('disabled', false);
		return true;
	});
}).on('click', '.team_characters .character', function(e){
	let currentMatch = CachedDispute.getCurrentMatch();
	let matchId = currentMatch.getMatchId();

	var button = $(this).closest('.character_pick');
	var changeVictor = button.hasClass('victorious');

	var data = {
		game_id: button.data('game_id'),
		team_number: button.data('team_number'),
		game_intervention: 1,
		win: changeVictor ? 0 : 1,
		match_id: matchId
	};
	var game = button.closest('.game').addClass('disabled');
	$.post(siteUrl + '/matchmaking/mod_intervention', data).done(function(response){
		if(response.success){
			return MatchSummary.refreshMatchDetailPage(matchId);
		}
		else{
			game.removeClass('disabled');
			alert('Something went wrong!');
		}
	}).fail(function(){
		game.removeClass('disabled');
		alert('Something went very wrong!');
	}).always(function(){
	});
}).on('click', '.mod_intervention button', function(e){
	e.preventDefault();
	var buttons = $('.mod_intervention button');
	var button = $(this);
	var form = $(this).closest('form');
	var matchId = form.data('match_id');
	var result;
	if(button.hasClass('undo_result')){
		result = confirm('Undo match result!?!??!');
		if(!result){
			return false;
		}
	}
	var faultButtonsClicked = false;
	if(button.hasClass('fault_button')){
		faultButtonsClicked = true;
		//Do not disable the
	}
	if(button.hasClass('p1win') || button.hasClass('p2win')){

	}
	if(faultButtonsClicked){
		form.find('.fault_button').prop('disabled', true);
	}
	else{
		form.find('button').not('.fault_button').prop('disabled', true);
	}

	form.addClass('submitting');
	var data = {};
	data[button.attr('name')] = button.val();
	data['match_id'] = matchId;
	data['announce_results'] = form.find('input[name=announce_results]').is(':checked') ? 1 : 0;
	$.post(form.attr('action'), data, function(response){
		if(response.success){
			return MatchSummary.refreshMatchDetailPage(matchId);
		}
		form.removeClass('submitting');
		form.addClass('completed');
		if(faultButtonsClicked){
			form.removeClass('completed');
			form.find('.fault_button').prop('disabled', false);
			if(button.val() == 0){
				button.closest('.fault_buttons').removeClass('player_at_fault').addClass('player_not_at_fault');
			}
			else{
				button.closest('.fault_buttons').addClass('player_at_fault').removeClass('player_not_at_fault');
			}
		}
		form.find('.fault_buttons button').prop('disabled', false);
		var submitted = form.find('.submitted');
		if(response.success){
			submitted.text('Results Saved');
		}
		if(response.message){
			submitted.text(response.message);
		}
	}).error(function(e){

	});
}).on('success', '#merit_form_', function(){
	MatchSummary.refreshMatchDetailPage();
}).on('click','.next-dispute', function(e){
	e.preventDefault();
	let button = $(this);
	button.prop('disabled', true);
	let matchId = $(this).data('next_match_id');
	console.log('Hmm');
	MatchSummary.openMatchInline(matchId);
}).on('change', '.display_events input', function(e){
	var input = $(this);
	if(input.is(':checked'))
	{
		matchSummaryContainer.find('.chat_container').addClass(input.data('items'));
	}
	else
	{
		matchSummaryContainer.find('.chat_container').removeClass(input.data('items'));
	}
});

function retrieveMatchUrl(matchId){
	return siteUrl+'/match/view/'+matchId;
}

let cachedDispute = {
	id: null,
	content: null
};

disputesContainer.on('click','.match',function(e){
	e.preventDefault();
	var match = $(this).data('match');
	if($(e.target).hasClass('username'))
	{
		return;
	}
	var matchContainer = $(this);
	MatchSummary.openMatchInline(match.id, matchContainer);
	return;
});

if($('#page_match').length)
{
	let currentMatch = CachedDispute.getCurrentMatch();
	if(currentMatch)
	{
		currentMatch.cacheNextDispute();
	}
	window.onpopstate = function(event) {
		if(event.state)
		{
			alert('reloading');
			return;
			//is probably a back event
			window.location.reload();
		}
	};
}

export {MatchSummary};


/** WEBPACK FOOTER **
 ** ./../models/MatchSummary.jsx
 **/