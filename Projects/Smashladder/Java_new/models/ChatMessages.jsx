import {ChatActions} from "../components/ChatActions.jsx";
import {Request} from "../components/Request";
import {Dashboard} from "../components/Dashboard";

export var ChatMessages = function($chatMessageList){
    this.messages = [];
    this.chatMessageList = $chatMessageList;//jQuery element
    this.currentlyVisible = false;
};
ChatMessages.prototype.addMessage = function(message){
    if(!message.time)
    {
        message.time = Date.now();
    }
    var insertPosition = this.binaryFind(message.time);
    if(insertPosition.found)
    {
        insertPosition.index++;
    }
    this.messages.splice(insertPosition.index,0,message);
    if(this.currentlyVisible)
    {
        this.chatMessageList.find('li').eq(insertPosition.index).after(message.renderChatElement());
    }
    return this.messages;
};
ChatMessages.prototype.showMessages = function(){
    this.currentlyVisible = true;
    for(var i in this.messages)
    {
        this.chatMessageList.insert(this.messages[i].renderChatElement());
    }
};
ChatMessages.prototype.binaryFind = function(searchTimestamp){
    var minIndex = 0;
    var maxIndex = this.messages.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this.messages[currentIndex];

        if (currentElement.time < searchTimestamp) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement.time> searchTimestamp) {
            maxIndex = currentIndex - 1;
        }
        else {
            return { // Modification
                found: true,
                index: currentIndex
            };
        }
    }
    return { // Modification
        found: false,
        index: currentElement && (currentElement.time < searchTimestamp) ? currentIndex + 1 : currentIndex
    };
};
ChatMessages.compareMessages = function (message1,message2){ //TO BE DEPRECATED
    if(!message2.length)
    {
        return 1;
    }
    if(message1.data('time') == message2.data('time'))
    {
        if(message1.data('message_id') > message2.data('message_id'))
        {
            return 1;
        }
        else if(message1.data('message_id') < message2.data('message_id'))
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
    if(message1.data('time') > message2.data('time'))
    {
        return 1;
    }
    if(message1.data('time') < message2.data('time'))
    {
        return -1;
    }
};
ChatMessages.assignFirstAndLast = function(chatHolder) {
    //TODO: write this in a way that isn't halfasssed
    return;

    var currentMessages = chatHolder.data('messages').items;
    var first = null;
    var last = null;
    var firstMessage = {position:null,message:null};
    var lastMessage = {position:null,message:null};
    $.each(currentMessages,function(i,message){
        var timestamp = data.time;
        if(firstMessage.position === null)
        {

        }
    });
};
ChatMessages.attachChatEvents = function(chatHolder){
    if(chatHolder.data('chatEventsAttached'))
    {
        return;
    }
    else
    {
        chatHolder.data('chatEventsAttached',true);
    }

    chatHolder.on('click','.streamlink',function(e){
        e.preventDefault();
        var button = $(this);
        ChatActions.onStreamlinkClick(button,e);
    });

    chatHolder.on('mouseover','.youtubelink:not(.coolhover)',function(){
        ChatActions.onYoutubelinkHover($(this));
    });


    chatHolder.on('click','.time_holder',function(e){
        e.stopImmediatePropagation();
        var message = $(this).closest('.chat_message');
        chatHolder.data('messages').callbacks.timeOptionsClick(e,message);
    });
    
    chatHolder.on('click','.delete_holder',function(e){
        e.stopImmediatePropagation();
        var element = $(this);
        var message = element.closest('.chat_message');
        if(message.data('message').deleted)
        {
            message.trigger('undeleteMessage');
        }
        else
        {
            message.trigger('deleteMessage');
        }
    });

    chatHolder.on('startEditMessage','.chat_message.normal_message',function(e){
        let message = $(this);
        let chatContainer = $(this).data('chatContainer');
        console.log(message.data('chatContainer'));
        if(chatContainer)
        {
            console.log(chatContainer);
            console.log(chatContainer.data());
        }
        if(chatContainer.data('chatInput'))
        {
            ChatActions.startEditOnMessage(message, chatContainer.data('chatInput'));
        }
        else
        {
            alert('Could not edit this message');
        }
    });

    // chatHolder.on('mouseenter','.username.sender', function(e){
    //     var usernameArea = $(this);
    //     return;
    //     if(!usernameArea.data('display_name'))
    //     {
    //         return;
    //     }
    //     usernameArea.css('min-width',usernameArea.width());
    //     usernameArea.css('display','inline-block');
    //     usernameArea.text(usernameArea.data('username'));
    // }).on('mouseleave','.username.sender',function(e){
    //     var usernameArea = $(this);
    //     if(!usernameArea.data('display_name'))
    //     {
    //         return;
    //     }
    //     usernameArea.text(usernameArea.data('display_name')).css('min-width','0').css('display','inline');
    // });


    chatHolder.on('undeleteMessage','.chat_message.normal_message',function(e){
        var element = $(this);
        var message = element.data('message');
        var isModOfMessage = element.data('isModOfMessage');
        if(isModOfMessage)
        {
            //activeDeleteButton.add($element.find('.time'));
            if(!element.hasClass('deleted'))
            {
                return;
            }
            element.addClass('update_action');

            Request.send({message_id:message.id,undelete:1}, 'delete_message', function(){
                element.removeClass('update_action');
                return true;
            });
        }
    });
    chatHolder.on('deleteMessage','.chat_message.normal_message',function(e,remove){
        var data;
        var element = $(this);
        var message = element.data('message');
        var isModOfMessage = element.data('isModOfMessage');
        if((message.player.id == myUser.id || isModOfMessage))
        {
            if(remove)
            {
                if(message.is_shadow_muted)
                {
                    return;
                }
            }
            else
            {
                if(message.deleted)
                {
                    return;
                }
            }
            element.addClass('update_action');
            Request.send({message_id:message.id,remove:remove?1:0}, 'delete_message', function(){
                element.removeClass('update_action');
                return true;
            });
        }

    });
    chatHolder.on('unshadowMuteMessage','.chat_message.normal_message',function(e){
        var message = $(this).data('message');
        Request.send({message_id:message.id},'show_shadow_message');
        $(this).trigger('unshadowMute');
    });
    chatHolder.on('unshadowMute','.chat_message.normal_message',function(e){
        $(this).removeClass('is_shadow_muted');
    });
};
ChatMessages.findPositionForMessage = function(placedMessages,$newElement)
{
    if(ChatMessages.compareMessages($newElement,placedMessages.first()) < 0)
    {
        return 0;
    }
    if(ChatMessages.compareMessages($newElement,placedMessages.last()) > 0)
    {
        return null;
    }
    var positionMessage = ChatMessages.findPosition(placedMessages,$newElement);
    if(positionMessage)
    {
        return positionMessage;
    }
    else
    {
        return null;
    }
};
ChatMessages.findPosition = function(placedMessages,message, previous){
    var mid = Math.floor(placedMessages.length / 2);

    if(placedMessages.length === 0 )
    {
        return mid;
    }

    var currentComparisonMessage = $(placedMessages[mid]);

    var comparisonResult = ChatMessages.compareMessages(message, currentComparisonMessage);

    if(placedMessages.length === 1)
    {
        if(comparisonResult > 0)
        {
            return currentComparisonMessage;
        }
        else
        {
            return currentComparisonMessage.data('usePrevious',true);
        }
    }
    if (comparisonResult === 0) {
        //May need to be adjusted...
        return currentComparisonMessage;
    } else if (comparisonResult < 0) {
        return ChatMessages.findPosition(placedMessages.slice(0, mid), message, currentComparisonMessage);


    } else if (comparisonResult > 0) {
        return ChatMessages.findPosition(placedMessages.slice(mid, Number.MAX_VALUE), message, currentComparisonMessage);
    } else {
        return null;
    }
};


/** WEBPACK FOOTER **
 ** ./../models/ChatMessages.jsx
 **/