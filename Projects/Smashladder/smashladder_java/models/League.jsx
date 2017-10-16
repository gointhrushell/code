export var League = function(data){
    this.setProperties(data);
    return this;
};
League.prototype.setProperties = function(data) {
    var i;
    for(i in data)
    {
        if (data.hasOwnProperty(i))
        {
            this[i] = data[i];
        }
    }
};
League.prototype.createElement = function(element){
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
};
League.prototype.getTemplate = function(){
  if(League.templateElement)
  {
      return League.templateElement.clone();
  }
  else
  {
      League.templateElement = $('.user_info .game_info.template .league').clone();
      return League.templateElement;
  }
};
League.prototype.meetsRankedRequirements = function(){
    if(!this.season || !this.stats)
    {
        return false;
    }
    return this.stats.ranked_played >= this.season.games_required_for_ladder &&
      this.stats.unique_opponents >= this.season.opponents_required_for_ladder;
};
League.prototype.isGreaterOrEqualTo = function(otherLeague){
    if(!otherLeague)
    {
        // alert('There was an error, you should contact anther');
        return false;
    }
    return this.tier_rank >= otherLeague.tier_rank;
};
League.prototype.isLessOrEqualTo = function(otherLeague){
    if(!otherLeague)
    {
        // alert('There was an error, you should contact anther');
        return true;
    }
    return this.tier_rank <= otherLeague.tier_rank;
};
League.prototype.hasPlayed = function(){
    if(!this.season || !this.stats)
    {
        return false;
    }
    return this.stats.ranked_played || this.stats.unique_opponents;
};
League.prototype.isUnranked = function(){
  return this.name == 'Unranked';
};
League.prototype.isRanked = function(){
  return !this.isUnranked();
};
League.prototype.getClassName = function(){
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
};



/** WEBPACK FOOTER **
 ** ./../models/League.jsx
 **/