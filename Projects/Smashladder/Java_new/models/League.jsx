import {CacheableDataObject} from "./CacheableDataObject";
import {Season} from "./Season";

class League extends CacheableDataObject {

    createMiniElement(){
        let element = $('<div>').addClass('tier_mini');
        let tierIcon = $('<img>').addClass('mini_tier_icon');
        if(this.meetsRankedRequirements())
        {
            element.addClass('has_league');
        }
        else
        {
            element.addClass('no_league');
        }
        if(this.image_url)
        {
            tierIcon.attr('src', this.image_url);
        }
        return element;
    }

    createElement(element){
        let league = this;
        if(!element)
        {
            element = this.getTemplate();
        }
        var leagueContainer = element.find('.leagued');
        var unleagued = element.find('.unleagued');
        if(league && (league.name || league.points))
        {
            element.addClass('has_league').removeClass('no_league');
            element.attr('title', league.name + ' ' + league.points);
            element.find('.ranked_requirements').hide();
            leagueContainer.show();
            unleagued.hide();
            if(!leagueContainer.length)
            {
                leagueContainer = element;
            }
            if(league.division === null) //Just numbers
            {
                leagueContainer.hide('.name');
                leagueContainer.hide('.division');
                leagueContainer.find('.rating_text').show();
                leagueContainer.find('.points').text(league.points);
            }
            else
            {
                leagueContainer.find('.ranked_played').hide();
                leagueContainer.find('.name').text(league.name);
                leagueContainer.find('.league_icon').attr('src',league.image_url);
                leagueContainer.find('.division').text(league.division);
                leagueContainer.find('.rating_text').hide();
            }

        }
        else
        {
            element.removeClass('has_league').addClass('no_league');
            leagueContainer.hide();
            if(!unleagued.length)
            {
                element.hide();
            }
        }
        if(league.season && element.find('.ranked_requirements').length && !league.meetsRankedRequirements() && league.hasPlayed())
        {
            unleagued.hide();
            element.find('.ranked_requirements').show();

            element.find('.ranked_played .total').text(league.stats.ranked_played)
                .addClass(league.stats.ranked_played >= league.season.games_required_for_ladder ? 'met' : 'unmet');
            element.find('.ranked_played .required').text(league.season.games_required_for_ladder);

            element.find('.unique_opponents .total').text(league.stats.unique_opponents)
                .addClass(league.stats.unique_opponents >= league.season.opponents_required_for_ladder ? 'met' : 'unmet');
            element.find('.unique_opponents .required').text(league.season.opponents_required_for_ladder);
        }
        else
        {
            unleagued.show();
            element.find('.ranked_requirements').hide();
        }
        return element;
    }

    getTemplate(){
      if(League.templateElement)
      {
          return League.templateElement.clone();
      }
      else
      {
          League.templateElement = $('.user_info .game_info.template .league').clone();
          return League.templateElement;
      }
    }

    meetsRankedRequirements(){
        if(!this.season || !this.stats)
        {
            return false;
        }
        return this.stats.ranked_played >= this.season.games_required_for_ladder &&
          this.stats.unique_opponents >= this.season.opponents_required_for_ladder;
    }

    isGreaterOrEqualTo(otherLeague){
        if(!otherLeague)
        {
            // alert('There was an error, you should contact anther');
            return false;
        }
        return this.tier_rank >= otherLeague.tier_rank;
    }

    isLessOrEqualTo(otherLeague){
        if(!otherLeague)
        {
            // alert('There was an error, you should contact anther');
            return true;
        }
        return this.tier_rank <= otherLeague.tier_rank;
    }

    hasPlayed(){
        if(!this.season || !this.stats)
        {
            return false;
        }
        return this.stats.ranked_played || this.stats.unique_opponents;
    }

    isUnranked(){
      return this.name == 'Unranked';
    }

    isRanked(){
      return !this.isUnranked();
    }

    getClassName(){
        var string = 'Ladder_League_';
      if(this.name)
      {
          string += this.name.replace(/ /g,"_");

      }
      else
      {
          string += "Unranked";
      }
        return string;
    }

}
League.prototype.dataLocationParsers = {
    season: function(object, data){
        if(data.season.id){
            object.season = Season.retrieve(data.season);
        }
    }
};

export {League};


/** WEBPACK FOOTER **
 ** ./../models/League.jsx
 **/