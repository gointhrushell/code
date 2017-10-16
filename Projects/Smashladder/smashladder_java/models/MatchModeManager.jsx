export var MatchModeManager = function(){
    this.currentMode = MatchModeManager.modes.SEARCH;
    this.currentBattleMode = MatchModeManager.battleModes.NO_MATCH;
};
MatchModeManager.prototype.changeBattleMode = function(mode){
    if(!this.battleContainer)
    {
        this.battleContainer = $('#tab-pane-battle');
    }
    if(this.currentBattleMode == mode)
    {
        return; //Already good
    }
    this.currentBattleMode = mode;
    $.each(MatchModeManager.battleModes,(i,otherMode) => {
        if(otherMode != mode)
            this.battleContainer.removeClass(otherMode);
    });
    this.battleContainer.addClass(mode);
};
MatchModeManager.prototype.changeViewMode = function(mode){
    if(!this.container)
    {
        this.container = $('#tab-pane-matchmaking');
    }
    if(this.currentMode == mode)
    {
        return; //Already good
    }
    this.currentMode = mode;
    $.each(MatchModeManager.modes,(i,otherMode) => {
        if(otherMode != mode)
            this.container.removeClass(otherMode);
    });
    this.container.addClass(mode);
};
MatchModeManager.prototype.getCurrentViewMode = function(){
    return this.currentMode;
};
MatchModeManager.prototype.getCurrentBattleMode = function(){
    return this.currentBattleMode;
};
MatchModeManager.prototype.viewModeIs = function(viewMode) {
    return this.getCurrentViewMode() == viewMode;
};
MatchModeManager.prototype.battleModeIs = function(viewMode) {
    return this.getCurrentBattleMode() == viewMode;
};

MatchModeManager.modes = {
    SELECT_OPTIONS:'select_options',
    SEARCH:'search_mode',
    ACTIVITY_MODE:'activity_mode'
};
MatchModeManager.battleModes = {
    NO_MATCH:'no_match',
    MATCH_SINGLES:'match_singles',
    MATCH_DOUBLES:'match_doubles'
};

export var matchModeManager = new MatchModeManager();


/** WEBPACK FOOTER **
 ** ./../models/MatchModeManager.jsx
 **/