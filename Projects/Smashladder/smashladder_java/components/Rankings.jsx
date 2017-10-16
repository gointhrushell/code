
import {LadderHistory} from '../components/LadderHistory.jsx'

class RankingsPage
{
	constructor(){
		this.rankingsPage = $('#rankings_page');
		if(!this.rankingsPage.length)
		{
			return;
		}
		LadderHistory.history.Adapter.bind(window, 'statechange', ()=> {
			var state = LadderHistory.history.getState();
			var path = state.data.path;
			if(this.resultsCache[state.url])
			{
				return this.processResults(this.resultsCache[state.url]);
			}
			else
			{

			}
		});
		var requesting = false;
		let parent = this;
		this.rankingsPage.on('click', '.pagination_button', function(e){
			parent.processPagination($(this), e);
		});
		this.resultsCache = {};
		let initialState = this.createStateFromCurrentStage();
		this.resultsCache[initialState.current_url] = initialState;
	}

	createStateFromCurrentStage(){
		let data = {};
		data.current_url = this.getRankingsList().find('.rankings_content').data('current_url');
		data.elements = {};
		$.each(this.pageStateContentElements(),(i,element)=>{
			data.elements[element] = this.rankingsPage.find(element);
		});
		data.success = true;
		return data;
	}

	pageStateContentElements(){
		return [
			'.first_page_button',
			'.next_page_button',
			'.previous_page_button',
			'.rankings_content',
			'.pagination_links_container ul'
		];
	}

	processResults(response){
		if(response.success)
		{
			this.resultsCache[response.current_url] = response;
			if(response.current_url)
			{
				LadderHistory.history.pushState(
					{},
					document.title,
					response.current_url
				);
			}
			var thingsToReplace = this.pageStateContentElements();
			$.each(thingsToReplace,(i,element)=>{
				var current = this.rankingsPage.find(element);
				var replacement = response.elements[element];
				if(replacement.length)
				{
					current.replaceWith(replacement);
				}
			});
			this.finished();
		}
		else
		{
			this.error();
		}
	}

	processPagination(clickedButton, event){
		if(this.requesting)
		{
			return;
		}
		if(clickedButton.is('disabled'))
		{
			return;
		}


		event.preventDefault();
		let rankingsList = this.getRankingsList();
		let page = clickedButton.data('page');
		let url = clickedButton.attr('href');
		rankingsList.addClass('loading');
		this.requesting = true;
		if(this.resultsCache[url])
		{
			this.processResults(this.resultsCache[url]);
		}
		else
		{
			$.post(url, {content_only:true},(response)=>{
				if(response.html)
				{
					var html = $($.trim(response.html));
					response.elements = {};
					$.each(this.pageStateContentElements(),(i,element) => {
						response.elements[element] = html.find(element);
					});
				}
				this.processResults(response);
			},'json').error((e)=>{
				this.error();
			});
		}
	}

	getRankingsList(){
		return this.rankingsPage.find('.ranking_list_container');
	}

	finished(){
		this.requesting = false;
		this.getRankingsList().removeClass('loading');
	}

	error(){
		this.finished();
	}
}

new RankingsPage();




/** WEBPACK FOOTER **
 ** ./../components/Rankings.jsx
 **/