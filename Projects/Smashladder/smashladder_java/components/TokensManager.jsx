import {ChatActions} from "../components/ChatActions";
import {PrivateChatLoader} from "../components/PrivateChatLoader";
import {Users} from "../app/matchmaking";
import {Dashboard} from "./Dashboard";

export var TokensManager = function(string){
    //var msg = string;
    var msg = string.replace(/^\s*\//, "");
    this.filteredString = msg;
    var regex = /^ *(?:(?!")([^ ]+)|"((?:[^\\"]|\\[\\"])*)")/;
    this.string = string;
    this.tokens = [];
    var that = this;

    var arr;
    while ((arr = msg.match(regex)) !== null) {
        if (arr[1] !== void 0) {
            // Non-space token
            this.tokens.push(arr[1]);
        } else {
            // Quoted token, needs extra processing to
            // convert escaped character back
            this.tokens.push(arr[2].replace(/\\([\\"])/g, '$1'));
        }
        msg = msg.substring(arr[0].length);
    }
    for(var i = this.tokens.length - 1; i >= 0; --i)
    {
        if(this.tokens[i].trim().length === 0)
        {
            if((i+1) in this.tokens)
            {
                that.tokens[i+1] = " "+that.tokens[i+1];
                that.tokens.splice(i,1);
            }
        }
    }
    this.get = function(key){
        return that.tokens[key];
    };
    this.command = this.get(0);
    this.getStringAfterKey = function(key){
        return Array.prototype.slice.call(that.tokens, key).join(' ');
    };
    this.getMessage = function(){
        return this.getStringAfterKey(1);
    };
    return this;
};
TokensManager.parseData = function(data)
{
    $.each(data, function(command, data){
        if(TokensManager.parseData.commands[command])
        {
            TokensManager.parseData.commands[command](data);
        }
    });
};
TokensManager.parseData.commands = {
    private_chat: function(data){
        PrivateChatLoader.openPrivateChat(
            {
                username: data.username,
                id: data.id
            }).load(function(){

        });
    },
    view_tab: function(data){
        var tab = Dashboard.namedTabList[data.tab];
        if(tab)
        {
            if(!tab.hasClass('active'))
            {
                tab.trigger('activate');
            }
        }
    }
};

TokensManager.parseCommand = function(msg)
{
    var tokens = new TokensManager(msg);
    if(!tokens.command)
    {
        tokens.command = 'help';
    }
    var data;
    if(tokens.command)
    {
        if(tokens.command == 'join')
        {
            if(tokens.get(1))
            {
                ChatActions.joinChatRoom(tokens.getStringAfterKey(1),null,true);
                return true;
            }
        }
        if(tokens.command == 'away')
        {
            changeWantsToPlay(0);
            return true;
        }
        if(tokens.command == 'back')
        {
            changeWantsToPlay(1);
            return true;
        }
        if(tokens.command == 'private_chat')
        {
            // private_chat [id] [username]
            PrivateChatLoader.openPrivateChat(
                {
                    username: tokens.get(2),
                    id: tokens.get(1)
            }).load(function(){

            });
            return true;
        }
        if(false && tokens.command == 'w' || tokens.command == 'msg') //Did not work as planned
        {
            data = {};
            if(!tokens.get(1))
            {
                return 'Username is required!';
            }
            var user = Users.retrieveByUsername(tokens.get(1));
            user = Users.retrieveByUsername(tokens.get(1));

            data.message = tokens.getStringAfterKey(2);
            PrivateChatLoader.openPrivateChat(user,true).load(function(chatHolder,response){
                var input = chatHolder.find('.chat_input').val(data.message);
                sendChat(input);
            });
        }
        var currentChat = ChatActions.getActiveChatContainer();
        if(currentChat)
        {
            currentChat = currentChat.data('chat');
            var chatRoomId = currentChat.data('chat_room_id');
            if(tokens.command == 'exit' || tokens.command == 'leave')
            {
                ChatActions.exitCurrentChat();
                return true;
            }
            if(tokens.command == 'uninvite')
            {
                data = {};
                data.type = 'remove_invite';
                data.chat_room_id = chatRoomId;
                data.username = tokens.get(1);
                $.post(siteUrl+'/matchmaking/chat_controls',data,function(response){
                    if(response.success)
                    {
                        ChatActions.addNotificationToChat(null,data.username,' has been uninvited.');
                    }
                    else
                    {
                        ChatActions.addNotificationToChat(null,response.message);
                    }
                });
                return true;
            }
            if(currentChat && tokens.command == 'all')
            {
                var notifyAll = false;
                if(!currentChat.data('chat').data('isChatMod'))
                {
                    alert('You have to be a moderator of this chatroom in order to use this command');
                    return true;
                }
                if(currentChat.data('button').data('has_ladder'))
                {
                    notifyAll = false;
                    alert('This command is disabled in ladder chat rooms currently');
                }
                else
                {
                    notifyAll = confirm('This will send a notification to all users with notifications turned on in '+currentChat.data('name'));
                }
                return !notifyAll;
            }
            if(currentChat && tokens.command == 'mods')
            {
                var modsCommandConfirmed = false;
                if(currentChat.data('button'))
                {
                    if(currentChat.data('button').data('has_ladder'))
                    {
                        modsCommandConfirmed =
                            confirm('This will alert every moderator of this room to chat issues in the ladder chat '+currentChat.data('name')+'. Unrelated alerts in a ladder chat can result in being muted or kicked.  Use disputes and reports for other issues.');
                    }
                    else
                    {
                        modsCommandConfirmed = confirm('This will alert every moderator of '+currentChat.data('name'));
                    }
                }
                else
                {
                    modsCommandConfirmed = false;
                }
                if(modsCommandConfirmed)
                {
                    return {for_chat_mods:1};
                }
                else
                {
                    return true;
                }
            }
            if(tokens.command == 'motd')
            {
                currentChat.find('.chat_room_description').show();
                return true;
            }
            if(tokens.command == 'invite')
            {
                data = {name: theSecretField, value: theSecret};
                data.chat_id = chatRoomId;
                data.invite_player = tokens.get(1);
                $.post(siteUrl + '/chats/invite_player', data, function (response) {
                    if(response.invite && response.invite.error)
                    {
                        ChatActions.inviteErrorMessageGenerator(tokens.get(1), response.invite);
                    }
                    if(response.success)
                    {
                        var invited = Users.update(response.user);
                        ChatActions.addNotificationToChat(null,invited.createUsernameElement(), ' has been invited to ',
                            $('<span>').addClass('chatlink').data('chatlink',currentChat.data('name')).text(currentChat.data('name')+'.'));
                    }
                });
                return true;
            }
            if(tokens.command == 'help')
            {
                var commands = [];
                commands.push('/mods &lt;message&gt; alerts every user that is a moderator of that chat room');
                commands.push('/join &lt;chat room name&gt; Joins a Chat Room');
                commands.push('/leave Exits the current Chat Room');
                commands.push('/away You will not receive challenge notification sounds');
                commands.push('/back Re-enables challenge notification sounds');
                commands.push('/invite &lt;username&gt; Invites a user to join the current chat room');
                commands.push('/uninvite &lt;username&gt; Removes an invite for a user in the current chat room');
                //commands.push('/w, /msg <username> <message> Opens a direct chat with another user');
                commands.push('/exit Leaves the active chat room');
                commands.push('/leave Exits the active chat room');
                commands.push('/motd Reopens the Message of the Day for the current chat room');
                commands.push('/all (In Non Ladder Chats) Broadcasts a notification to everyone in the room');

                var helpString = 'Chat Commands<br>';
                $.each(commands,function(i,command){
                    helpString += command + "<br>";
                });
                return helpString;
                //Add commands
            }
        }
    }
    if(tokens.command)
    {
        return false;
        return 'Command not found: '+tokens.command;
    }
}


/** WEBPACK FOOTER **
 ** ./../components/TokensManager.jsx
 **/