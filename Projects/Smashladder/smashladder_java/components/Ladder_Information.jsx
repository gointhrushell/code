import {League} from "models/League";

export var Ladder_Information = function(data){
    this.games = {};
    this.extend(data);
};
Ladder_Information.prototype.extend = function(games){
    if(games instanceof Ladder_Information)
    {
        games = games.games;
    }
    if(games)
    {
        $.extend(this.games, games);
    }
};
Ladder_Information.prototype.getLeagueForLadder = function(ladderId){
  if(this.games[ladderId] && this.games[ladderId].league)
  {
      if(!(this.games[ladderId].league instanceof League))
      {
          this.games[ladderId].league = new League(this.games[ladderId].league);
      }
      return this.games[ladderId].league;
  }
    return null;
};
Ladder_Information.prototype.getCharactersForLadder = function(ladderId){
    if(this.games[ladderId] && this.games[ladderId].characters)
    {
        return this.games[ladderId].characters;
    }
    return [];
};
Ladder_Information.prototype.hasCharactersForLadder = function(ladderId){
    return this.getCharactersForLadder(ladderId).length != 0;
};
Ladder_Information.prototype.hasLadders = function(){
    for(var i in this.games) {
        if (this.games.hasOwnProperty(i)) {
            return true;
        }
    }
    return false;
};
Ladder_Information.prototype.getLadders = function(){
    return this.games;
};
Ladder_Information.prototype.getLaddersInOrder = function(){
    var games = [];
    $.each(this.games, function(i, game){
       games.push(game);
    });
    games.sort(function(a,b){
       return a.order > b.order;
    });
    return games;
};


/** WEBPACK FOOTER **
 ** ./../components/Ladder_Information.jsx
 **/