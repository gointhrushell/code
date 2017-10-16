import {Users} from "../app/matchmaking";

export var PlayerUpdater = {
    setPlayerToWaitingForReply: function(playerId,match){
        var playerElement = PlayerUpdater.getPlayerInUserList(playerId);
        var challenge = playerElement.find('.challenge');

        if(playerId == myUser.id)
        {
            updateMatchCount(match,playerElement.find('.match_count'));
        }
    },
    getPlayerInUserList: function(playerId){
        console.trace('when and why');
        return $('.user_lists .online_user input[name=player_id][value='+playerId+']').closest('.online_user');
    },
    getPlayerListElementsByPlayerId: function(playerId){
        var user = Users.findById(playerId);

        var userlistElements = user.getUserlistElements();
        var elements = $();
        $.each(userlistElements,function(i,userlistElement){
            if(userlistElement.element)
            {
                elements = elements.add(userlistElement.element);
            }
        });
        return elements;
    }
};


/** WEBPACK FOOTER **
 ** ./../components/PlayerUpdater.jsx
 **/