import {LadderInfo} from "../components/LadderInfo";
import {ChatMessages} from "../models/ChatMessages";


export var Populate = {
    disputes: function(response)
    {

    },
    pendingReplies: function(response)
    {

    },
    chat: function(response,chatMessagesHolder,loadingAllMessages){
        loadingAllMessages = loadingAllMessages || false;
        chatMessagesHolder.data('loadingAllMessages', loadingAllMessages);
        if(!response)
        {
            return;
        }
        if(chatMessagesHolder.data('chat'))
        {
            if(!chatMessagesHolder.data('userlistData'))
            {
                chatMessagesHolder.data('userlistData',{container:chatMessagesHolder,callbackName:'userlists'});
            }
            chatMessagesHolder.data('isPopulated',true);

            var userlistData = chatMessagesHolder.data('userlistData');
            var theUserlist = chatMessagesHolder.data('userlist');
            if(theUserlist && theUserlist.data('loadingAll') && userlistData.items)
            {
                //If loading all we need to manually add players that are removed to the userlist changes
                $.each(userlistData.items, function(playerId, userlistItemData){
                    if(!response.userlist[playerId])
                    {
                        userlistItemData.status = LadderInfo.STATUS_REMOVED;
                        response.userlist[playerId] = {is_removed: true};
                    }
                });
            }

            LadderInfo.parseChanges(chatMessagesHolder.data('userlistData'),response.userlist);
        }
        if(response.html || chatMessagesHolder.data('isIrc'))
        {
            if(!chatMessagesHolder.data('isIrc'))
                chatMessagesHolder.data('isIrc',response.html);

            chatMessagesHolder.data('reveal', function(){
                if(!chatMessagesHolder.data('last_update') && chatMessagesHolder.is(':visible'))
                {
                    chatMessagesHolder.html(chatMessagesHolder.data('isIrc'));

                    chatMessagesHolder.data('last_update',1);
                    if(chatMessagesHolder.data('chat'))
                        chatMessagesHolder.data('chat').find('.chat_input').hide();
                }
            });
            if(chatMessagesHolder.data('switchTo'))
            {
                chatMessagesHolder.data('reveal')();
            }
            return;
        }
        var messages = response.chat_messages;
        chatMessagesHolder.data('newMessagesAdded',false);
        if(!chatMessagesHolder.data('messages'))
        {
            ChatMessages.attachChatEvents(chatMessagesHolder);
            chatMessagesHolder.data('messages',{container:chatMessagesHolder,callbackName:'chatMessages'});
        }

        if(messages && (messages.length == undefined || messages[0]/* comes in as an array sometimes */)  ) //Objects have no length property
        {
            LadderInfo.parseChanges(chatMessagesHolder.data('messages'),messages);
            if(messages[0])
            {
                chatMessagesHolder.data('newMessagesAdded',false);
            }
        }
        return chatMessagesHolder.data('newMessagesAdded');
    },
    onlineUsers: function(chat,userlistResponse)
    {

    },
    matchSearches: function(response)
    {

    }
};



/** WEBPACK FOOTER **
 ** ./../components/Populate.jsx
 **/