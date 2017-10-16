import {ChatActions} from "./ChatActions";
import {LadderInfo} from "./LadderInfo";
import {Dashboard} from "./Dashboard";
import {Settings} from "./Settings";
import {ladder} from "./Ladder";

export var SocketConnection = function(){
    var connection = null;
    var reference = this;
    var messageQueue = [];
    var allStatuses = $('#connection_status').find('.status');
    var newDisconnection = false;
    this.authenticationFail = false;

    allStatuses.each(function(){
        var pendingImage = $('<img>').attr('src',siteUrl+'/images/ajax-loader.gif');
        var pending = $('<span>').addClass('pending');
        var success = $('<span>').addClass('success');
        var fail = $('<span>').addClass('fail');
    });

    this.setStatus = function(status,changeTo){
        status = allStatuses.filter(status);
        status.removeClass('success error');
        if(changeTo == 'success')
        {
            this.setStatusError(null);
        }
        if(changeTo)
        {
            status.addClass(changeTo);
        }
    };

    this.endConnectionState = function(){
        Dashboard.loadingDashboard.addClass('not_loading');
    };
    this.setStatusError = function(error){
        if(!Dashboard.loadingDashboard)
        {
            return;
        }
        if(error)
        {
            Dashboard.loadingDashboard.findCache('.server_message').addClass('active').text(error);
        }
        else
        {
            Dashboard.loadingDashboard.findCache('.server_message').removeClass('active').empty();
        }
    };

    this.connect = function(connectData){
        if(this.connection &&
            (this.connection.readyState ===  0 ||this.connection.readyState === 1))
        {
            return;
        }
        else
        {
        }

        ladder.log('Attempting connection');
        this.setStatus('.connecting-0','active');
        var type = SocketConnection.types.LADDER;
        if(!isInLadder)
            type = SocketConnection.types.GENERAL_PAGE;
        else if(typeof matchOnlyMode != 'undefined' && matchOnlyMode)
            type = SocketConnection.types.MATCH_ONLY_MODE;

        if(!connectData)
        {
            connectData = {};
            var chatContainer = ChatActions.getActiveChatContainer();
            if(chatContainer && chatContainer.data('chat'))
            {
                connectData.chat_focus_id = chatContainer.data('chat').data('chat_room_id');
            }
        }

        if(window.isDolphin)
        {
            type = SocketConnection.types.DOLPHIN;
            connectData.session_key = isDolphin.session_id;
            connectData.player_id = isDolphin.player_id;
        }
        connectData.type = type;
        connectData.version = LadderInfo.version;
        connectData.userlist_visible = Dashboard.userlistIsVisible();

        this.connection = new WebSocket(socketServerUrl+'?' + $.param(connectData));
        this.connection.onopen = function(e){
            // ladder.log('Connection Established!',true);
            reference.setStatus('.connecting-0','success');
            Dashboard.loadingDashboard.removeClass('chat_server_error');
            if(reference.newDisconnection)
            {
                reference.newDisconnection = false;
                Dashboard.getUserGoing();
            }
            //reference.send({version:LadderInfo.version});//Send current chat version!
        };
        this.connection.onmessage = function(e){
            // ladder.log('Received Socket Message');
            if(Dashboard.loadingDashboard.hasClass('active'))
                Dashboard.loadingDashboard.removeClass('active');
            if(!e.data)
            {
                ladder.log('message was blank...');
                return;
            }
            var message = $.parseJSON(e.data);
            Dashboard.parseGeneralData(message);
        };
        this.connection.onclose = function(e){
            reference.setStatus('.connecting-0','error');

            Dashboard.loadingDashboard.addClass('active').addClass('chat_server_error');

            if(!Dashboard.dashboard.data('search_disabled'))
            {
                Settings.disableAll();
                Dashboard.dashboard.data('search_disabled',true);
                if(Dashboard.matchmakingTab && Dashboard.matchmakingTab.data('paneContainer'))
                {
                    Dashboard.gameFilters.addClass('disabled');
                }
            }


            console.error('Connection to the chat server has been lost or rejected',true);

            if(reference.authenticationFail)
            {
                showConnectionIssue();
                console.error('Could not verify user');
                if(isInLadder)
                {
                    setTimeout(function(){
                        ladder.log('Attempting reconnection....',true);
                        reference.connect();
                    },5000);
                }
            }
            else
            {
                showConnectionIssue();
                reference.newDisconnection = true;
                console.log('... attempting reconnection');
                reference.send();
            }
        };
    };
    this.send = function(data,action,responseToActionCallback){
        if(!data)
            data = {};
        if(this.connection.readyState == 3) //Closed or could not be opened, reattempt every 5 seconds
        {
            ladder.log('Connection failed for some reason',true);
            setTimeout(function(){
                ladder.log('Attempting reconnection....',true);
                reference.connect();
            },isInLadder?15000:60000);
        }
        else if(this.connection.readyState == 1)
        {
            if(action)
            {
                data.action = action;
            }
            this.connection.send(JSON.stringify(data));
            var xhrLikeThing = {
                error:function(callback){
                    xhrLikeThing.onErrorCallback = callback;
                },
                onErrorCallback:null
            };
            return xhrLikeThing;
        }
    };
    return this;
};
SocketConnection.types = {};
SocketConnection.types.LADDER = 1;
SocketConnection.types.GENERAL_PAGE = 2;
SocketConnection.types.MATCH_ONLY_MODE = 3;
SocketConnection.types.DOLPHIN = 5;

function showConnectionIssue(response)
{
    var loadingDashboard = Dashboard.loadingDashboard;
    if(response && response.logged_in == 0)
    {
        window.location.href = siteUrl+'/log-in';
    }
    if(response && response.authentication === false)
    {
        dashboard.find('input').prop('disabled',true);
        loadingDashboard.addClass('active');
        loadingDashboard.findCache('.bug_reort').show(0);
        return;
    }

    loadingDashboard.addClass('active');
}


/** WEBPACK FOOTER **
 ** ./../components/SocketConnection.jsx
 **/