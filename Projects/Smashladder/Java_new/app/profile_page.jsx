import {Dashboard} from '../components/Dashboard.jsx';
import {Character} from '../models/Character.jsx';
$(function(){
	let profilePageTabs = $('#profile_page_tabs');
	if(profilePageTabs.length)
	{
		ProfilePage.initSummaries(profilePageTabs);
		ProfilePage.initInlineEdits(profilePageTabs);
	}
});

var ProfilePage = {};
ProfilePage.initInlineEdits = function(profilePageTabs){
	profilePageTabs.on('click','.editable',function () {
		var holder = $(this).closest('.editable-holder').find('.specific_code_form').trigger('startEditing');
	}).on('startEditing','.specific_code_form',function (e) {
		var holder = $(this).closest('.editable-holder');
		holder.find('.editing').show();
		holder.find('.viewing').hide();
	}).on('endEditing','.specific_code_form',function (e) {
		var holder = $(this).closest('.editable-holder');
		holder.find('.editing').hide();
		holder.find('.viewing').show();
	}).on('keydown','.specific_code_form input[type=text]',function (e) {
		if(e.which == Dashboard.keyCodes.ESCAPE)
		{
			$(this).closest('.specific_code_form').trigger('endEditing');
		}
	}).on('change','.specific_code_form select',function (e) {
		$(this).closest('form').submit();
	}).on('submit', '.specific_code_form', function (e) {
		e.preventDefault();
		var form = $(this);
		var data = form.serializeArray();
		var holder = form.closest('.editable-holder');
		var spinnerHolder = form.closest('.panel-body');
		var hasSelect = holder.find('select').length > 0;
		var inputs = form.find(':input');
		inputs.prop('disabled', true);
		$.post('', data).done(function (response) {
			var field = form.closest('.specific_field');
			if (response.success) {
				holder.find('input[name=specific_code]').val(response.value);
				if (hasSelect) {
				}
				else
				{
					holder.find('.viewing').text(response.value);
					form.trigger('endEditing');
				}
			}
			if (response.error) {
				alert(response.error);
			}
		}).fail(function(){

		}).always(function(){
			inputs.prop('disabled', false);
		});

	});

	profilePageTabs.on('click', '#tab-pane-match-history .toggle_feedback_form', function (e) {
		e.preventDefault();
		var data = $(this).serializeArray();
		var feedbackText = $(this).find('.feedback_text');
		feedbackText.fadeTo('fast', .5);
		$.post(siteUrl + '/match/toggle_feedback_visibility', data, function (response) {
			if (response.success) {
				feedbackText.text(response.text);
			}
			feedbackText.fadeTo('fast', 1);
		});
	});
}
ProfilePage.initSummaries = function(profilePageTabs){
	profilePageTabs.on('click', '.ladder_tab .logo_box', function(){
		let button = $(this);
		let otherButtons = button.closest('.ladders').find('.logo_box').not(button);
		otherButtons.trigger('deactivate');
		button.trigger('activate');
	});

	profilePageTabs.on('activate', '.ladder_tab', function(){
		let button = $(this);
		if(button.hasClass('active'))
		{
			button.trigger('deactivate');
			return;
		}
		let summariesContainer = profilePageTabs.find('.player_stat_summaries');

		summariesContainer.addClass('active');
		button.addClass('active');
		let currentStatsContainer = $('#player_game_stats_'+button.data('ladder_id')).addClass('active');


		let activeSeason = currentStatsContainer.find('.season_option.active');
		if(!activeSeason.length)
		{
			currentStatsContainer.find('.season_option:first').trigger('click');
		}

		$('html, body').animate({
			scrollTop: $("#player_stat_summaries").offset().top - 100
		}, 400);
	});
	profilePageTabs.on('deactivate', '.ladder_tab', function(){
		let button = $(this);
		if(!button.hasClass('active'))
		{
			return;
		}
		let summariesContainer = profilePageTabs.find('.player_stat_summaries');
		summariesContainer.removeClass('active');
		button.removeClass('active');
		$('#player_game_stats_'+button.data('ladder_id')).removeClass('active');
	});

	profilePageTabs.find('.player_notes, .about_me_container')
		.inlineEditable();

	profilePageTabs.on('submit', '.reset_player_season_form', function(e){
		var result = confirm('This will reset the user back to 0 and remove all achievements for this season (In theory). Are you sure?');
		if(!result)
		{
			e.preventDefault();
			return false;
		}
	});
	profilePageTabs.on('submit', '.player_game_stats .suspend_from_season_form',function(e){
		var button = $(this);
		if(!confirm($.trim(button.text())))
		{
			e.preventDefault();
			return false;
		}

	});

	profilePageTabs.on('click','.player_stat_summaries .season_option', function(){
		var data = {};
		var button = $(this);
		if(button.hasClass('active'))
		{
			return;
		}

		var container = $(this).closest('.player_game_stats');
		var others = container.find('.season_option').not(button);
		container.addClass('loading');
		data.season_id = button.data('season_id');
		var ladder = button.closest('.player_season_select');

		data.ladder_id = ladder.data('ladder_id');

		others.removeClass('active');
		button.addClass('active');

		$.get(button.data('profile_url'),data,function(response){
			if(response.success)
			{
				container.removeClass('loading');
				container.html(response.html);
			}
			else
			{
				container.removeClass('loading');
			}
		});

	});

	profilePageTabs.on('click', '.edit_mains', function(e){
		let button = $(this);
		e.preventDefault();
		e.stopImmediatePropagation();
		let url = button.data('href');
		let data = {
			html:1
		};
		let gameId = button.data('game_id');

		let popup = Dashboard.ladderPopup(null, 'Change Your '+button.data('game_name') + ' Mains' ).showLoader();

		$.get(url, data, function(response){
			let responseContent = $($.trim(response.html));
			popup.updateContent(responseContent);
			responseContent.on('click', '.character_selection_holder', function(e){
				e.preventDefault();
				var data = {};
				var clicked = $(this);
				var character = clicked.find('.character');
				data.character_id = character.data('id');
				data.change_to = clicked.hasClass('selected') ? 0: 1;

				clicked.toggleClass('selected');

				var loading = clicked.find('.loading');
				var finished = function(){
					loading.removeClass('active');
				};
				$.post(url, data, function(response){
					let characters = [];
					if(response.characters)
					{
						$.each(response.characters, (id,character)=>{
							characters.push(Character.retrieve(character));
						});
						if(gameId)
						{
							let gameContainer = $('#game_mains_'+gameId+' .characters');
							gameContainer.empty();
							for(let character of characters)
							{
								character.generateElement().appendTo(gameContainer);
							}
							gameContainer.closest('.edit_mains').toggleClass('has_mains', !!response.characters.length);
						}
					}
					if(response.success)
					{

					}
					else
					{

					}
					finished();
				}).error(function(){
					finished();
				});
			});
		});
	});
};


/** WEBPACK FOOTER **
 ** ./../app/profile_page.jsx
 **/