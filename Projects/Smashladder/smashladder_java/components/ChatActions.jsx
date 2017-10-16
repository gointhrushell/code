import {Dashboard} from "components/Dashboard";
import {Users} from "app/matchmaking.jsx";
import {ElementUpdate} from "components/ElementUpdate";
import {LadderLinker} from "components/LadderLinker";
import {ladderLocalStorage} from "components/Ladder";
import {DateFormat} from "components/DateFormat";
import {Request} from "components/Request";
import {Populate} from "components/Populate";
import {ScrollPosition} from "components/ScrollPosition";

import {User} from "models/User";
import {ChatMessages} from "models/ChatMessages";
import {ChatMessage} from "models/ChatMessage";
import {ChatRoom} from "models/ChatRoom.jsx";

import {TokensManager} from "components/TokensManager.jsx";
import {StringHelpers} from "components/StringHelpers";
import {MatchmakingPopup} from "components/MatchmakingPopup";
import {Html} from "components/Html";
import {Settings} from "./Settings";

export var ChatActions = {};
ChatActions.getUsernameLink = function (user) {
    if (user.username && user.id) {
        return siteUrl + '/player/' + user.id;
    }
};
ChatActions.previousHostCodeFollow = null;
ChatActions.hostCodeMouseMoveActive = false;
ChatActions.hostCodeFollow = function(message){
    if(ChatActions.previousHostCodeFollow)
    {
        ChatActions.previousHostCodeFollow.remove();
    }

    if(message === null)
    {
        ChatActions.previousHostCodeFollow = null;
        return;
    }

    ChatActions.previousHostCodeFollow = message.closest('.host_code_notification').appendTo(Dashboard.body);
    if(!ChatActions.hostCodeMouseMoveActive)
    {
        ChatActions.hostCodeMouseMoveActive = true;
        $(document).on('mousemove',function(e){
            if(ChatActions.previousHostCodeFollow)
            {
                var width = ChatActions.previousHostCodeFollow.width();
                var height = ChatActions.previousHostCodeFollow.height();
                ChatActions.previousHostCodeFollow.css({left:e.pageX - (width/2), top: e.pageY - (height/2)});
            }
        });
    }
};
ChatActions.addAutocompleteElementsForUser = function(autocompleteList, user){
    if(user.autoCompleteElement || user.autoCompleteElementSecondary)
    {
        if(user.autoCompleteElement)
        {
            autocompleteList.push(user.autoCompleteElement);
        }
        if(user.autoCompleteElementSecondary)
        {
            autocompleteList.push(user.autoCompleteElementSecondary);
        }
    }
    else
    {
        if(user.display_name)
        {
            var displayed = $('<span class="username unclickable">');
            displayed.append(Html.encode(user.display_name))
                .append(' (')
                .append(user.createUsernameElement().addClass('unclickable'))
                .append(')');
            user.autoCompleteElementSecondary = {
                label:displayed,
                value:user.username,
                searchValue:user.display_name +user.username,
                isUsername: true
            };
            autocompleteList.push(user.autoCompleteElementSecondary);
        }
        user.autoCompleteElement = {
            label: user.createUsernameElement().addClass('unclickable'),
            value: user.username,
            searchValue: user.username,
            isUsername: true
        };
        autocompleteList.push(user.autoCompleteElement);
    }
};
ChatActions.onYoutubelinkHover = function (button) {
    if (!button.data('id')) {
        return;
    }
    button.addClass('coolhover');
    var error = function () {
        button.removeClass('coolhover');
    };
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/videos?id=' + button.data('id') + '&key=' + youtubeBrowserApiKey + '&fields=items(snippet(title))&part=snippet',
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function (response) {
            if (response.items) {
                var first = response.items.pop();
                var title = first.snippet.title;
                if (title.length > 80) {
                    title = title.substring(0, 80) + '...';
                }
                if (title.length != 0) {
                    button.text(title).attr('title', first.snippet.title);
                }
            }
            else {
                error();
            }
        },
        error: function () {
            error();
        }
    });
};
ChatActions.onStreamlinkClick = function (button, e) {
    var x = e.pageX;
    var y = e.pageY;
    var streamAction = $('#stream_action');
    streamAction.data('canBeUnclicked', true);
    streamAction.find('.stream_link_preview').text(button.text());
    $('#stream_action .stream_follow_link').attr('href', button.attr('href'));
    streamAction.find('.stream_open_embed').data('literal', button.data('literal'));
    streamAction.find('.stream_open_embed').data('params', button.data('params'));
    streamAction.data('justOpened', true);
    var stream = button.data('stream');
    var advancedPreview = streamAction.find('.stream_link_advanced_preview').empty();
    var advancedPreviewImage = streamAction.find('.stream_link_advanced_preview_thumb').attr('src', '');
    if (button.hasClass('imagelink')) {
        streamAction.find('.stream_open_embed').hide();
    }
    else {
        streamAction.find('.stream_open_embed').show();
    }

    if (button.hasClass('imagelink')) {
        var url = button.attr('href');
        if(button.data('preview'))
        {
            url = button.data('preview');
        }
        if(url.match('^http://')){
            url = url.replace("http://","https://")
        }
        advancedPreviewImage.attr('src', url);
    }
    if (button.hasClass('youtubelink') && button.data('id')) {
        advancedPreview.show().addClass('spinner');
        var error = function () {
            advancedPreview.hide();
            //advancedPreviewImage.hide();
        };
        advancedPreviewImage.attr('src',
            'https://img.youtube.com/vi/' + button.data('id') + '/0.jpg');
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/videos?id=' + button.data('id') + '&key=' + youtubeBrowserApiKey + '&fields=items(snippet(title))&part=snippet',
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function (response) {
                if (response.items) {
                    var first = response.items.pop();
                    advancedPreview.removeClass('spinner').text(first.snippet.title);
                    //button.find('.stream_link_advanced_preview_time').text(response);
                    //advancedPreviewImage.attr('src',
                    //	response.data.thumbnail.sqDefault);
                }
                else {
                    error();
                }
            },
            error: function () {
                error();
            }
        });
    }
    else {
        if (stream) {
            if (stream.preview_url) {
                advancedPreviewImage.attr('src', stream.preview_url);
            }
            if (stream.channel_name) {
                var titleText = stream.title ? ' - ' + stream.title : '';
                advancedPreview.text(stream.channel_name + titleText);
            }
        }
        else {
            advancedPreview.hide();
        }
    }
    $('#stream_action').show();
    Dashboard.keepContainerOnScreen($('#stream_action'), {x: x, y: y});
};

ChatActions.sendChat = function ($input) {
    if ($input.hasClass('disabled')) {
        return false;
    }
    if(!$input.data('chatHolder'))
    {
        $input.data('chatHolder', $input.closest('.chat_holder'));
    }
    var chatHolder = $input.data('chatHolder');
    var chatInput = chatHolder.findCache('.chat_input');
    var chatContainer = chatHolder.findCache('.chat_container');

    var message = chatInput.val();
    if(typeof $input.data('match_id') === 'undefined')
    {
        var match_id = $input.closest('.private_chat_area').find('input[name=match_id]').val();
        $input.data('match_id', match_id ? match_id : null);
    }
    if(typeof $input.data('to_user_id') === 'undefined')
    {
        var privateChatArea = $input.closest('.private_chat_area');
        if(privateChatArea.length && privateChatArea.data('chat') && privateChatArea.data('chat').data('player_id'))
        {
            var to_user_id = privateChatArea.data('chat').data('player_id');
        }
        $input.data('to_user_id', to_user_id ? to_user_id : null);
    }
    match_id = $input.data('match_id');
    to_user_id = $input.data('to_user_id');


    var chat_room_id = null;
    if (chatHolder.data('chat_room_id')) {
        chat_room_id = chatHolder.data('chat_room_id');
    }
    if (!chatHolder.data('send_id')) {
        chatHolder.data('send_id', 1);
    }
    chatHolder.data('send_id', chatHolder.data('send_id') + 1);

    var data = {
        chat_room_id: chat_room_id,
        to_user_id: to_user_id,
        message: message,
        match_id: match_id,
        send_id: chatHolder.data('send_id')
    };
    if($input.data('response_id'))
    {
        data.response_id = $input.data('response_id');
        message = $input.text();
    }
    // chatInput.prop('disabled',true);

    if ($.trim(message).length == 0 && !data.response_id) {
        return;
    }

    if (message.charAt(0) == '/') {
        var result = TokensManager.parseCommand(message);
        if (result === true) {
            chatInput.val('');
            return;
        }
        else if (result === false) {

        }
        else if (result instanceof String || typeof result === 'string') {
            chatInput.val('');
            ChatActions.addNotificationToChat(chatContainer, result);
            return;
        }
        else {
            $.extend(data, result);
        }
    }
    if (message.substring(0, 3) == "!mm") {
        // chatInput.val('');
        Dashboard.startMatchWithPlayer = null;
        MatchmakingPopup.showMatchSelectDialog();
        // return;
    }
    var tempMessage = ChatActions.getChatMessageTemplate();
    var chatMessage = new ChatMessage({player: myUser, message: message});

    ChatActions.updateChatMessage(tempMessage, chatMessage);
    var usernameElement = myUser.updateUserElements(tempMessage.find('.username'));

    var parsedMessage = LadderLinker.autolinkMessage({player: myUser, message: message});
    tempMessage.find('.message').html(parsedMessage);
    tempMessage.find('.time').text('sending...').data('timestamp', Math.round(new Date().getTime() / 1000));
    tempMessage.addClass('is_me my_temp_message normal_message');
    tempMessage.data('time', Math.round(new Date().getTime() / 1000));
    tempMessage.data('send_id', chatHolder.data('send_id'));

    if (BrowserHelper.isPhone) {
        //tempMessage.show();
    }
    else {
        tempMessage.fadeIn();
    }

    // ElementUpdate.flair(tempMessage.find('.sender'), myUser);

    ChatActions.addMessageToChat(chatContainer, tempMessage);
    ChatActions.scrollToBottom(chatContainer);

    chatInput.val('');
    chatInput.blur();
    chatInput.trigger('focus');

    addGaEvent('matchmaking', 'sendingMessage');

    var sendOffIntoTheWilderness = function () {
        tempMessage.removeClass('send_failed');
        Request.send(data, 'send_chat', function (response) {
            if (response.success === false) {
                if (response.error) {
                    ChatActions.addNotificationToChat(chatContainer, response.error);
                }
                if (response.rate_limit == true) {
                    ChatActions.addNotificationToChat(chatContainer, 'Your last message was not sent, you are sending messages too quickly.');
                }
                tempMessage.find('.time').text('failed').removeClass('my_temp_message').attr('title', 'Click to resend');
                tempMessage.addClass('send_failed');
                tempMessage.click(function () {
                    tempMessage.off('click');
                    sendOffIntoTheWilderness();
                });
            }
            return true;
        });
    };

    sendOffIntoTheWilderness();
};

ChatActions.addMessageToChat = function(chatContainer, message, replaceMessage, rescrollNow)
{
    var hasToScroll = !chatContainer.hasClass('scrolled_up');

    var newMessageTime = message.findCache('.time').data('timestamp');

    if(replaceMessage)
    {
        replaceMessage.replaceWith(message);
    }
    else
    {
        message.appendTo(chatContainer);
    }

    message.data('chatContainer',chatContainer);

    var previousMessage = message.prev();
    if(!previousMessage.length || (previousMessage.length && !previousMessage.hasClass('chat_notification')))
    {
        if(previousMessage.length)
        {
            var previousMessageTime = previousMessage.findCache('.time').data('timestamp');
        }
        //Compare to timestamp of previous message
        var notificationMessage = null;
        if(!message.find('.chat_notification_message').length && !replaceMessage)
        {
            var showMessageDate = false;
            if(!previousMessage.length)
            {
                showMessageDate = true;
            }
            if(newMessageTime && previousMessageTime)
            {
                var dayOne = DateFormat.custom(previousMessageTime,'mdy');
                var dayTwo = DateFormat.custom(newMessageTime,'mdy');
                if(dayTwo != dayOne)
                {
                    showMessageDate = true;
                }
            }
            else if(!previousMessageTime)
            {
                showMessageDate = true;
            }
            if(showMessageDate && newMessageTime)
            {
                notificationMessage = ChatActions.addNotificationToChat(chatContainer,' '+DateFormat.monthDayYear(newMessageTime)+' ');
                notificationMessage.insertBefore(message);
                notificationMessage.addClass('date_change_notification');
                notificationMessage.find('.time_holder').remove();
            }
        }

        if(!notificationMessage && previousMessage.length)
        {
            if(!previousMessage.data('combo'))
            {
                previousMessage.data('combo', 0);
            }
            if(!previousMessageTime)
            {
                previousMessageTime = previousMessage.findCache('.time').data('timestamp');
            }
            var lessThanFiveMinutes = newMessageTime - previousMessageTime < 300;
            if(
                lessThanFiveMinutes &&
                previousMessage.data('combo') < 8 &&
                ChatActions.chatMessagesHaveSamePlayer(previousMessage, message))
            {
                message.addClass('same_player_as_previous');
                message.data('combo', previousMessage.data('combo') + 1);
            }
            else
            {
                message.removeClass('same_player_as_previous');
                var next = message.next();
                if(!ChatActions.chatMessagesHaveSamePlayer(next, message))
                {
                    next.removeClass('same_player_as_previous');
                }
            }
        }
    }

    chatContainer.data('reScroll',function(e){
        if(hasToScroll || chatContainer.data('loadingAllMessages') )
        {
            chatContainer.data('shouldScrollToBottom', true);
            // chatContainer.scrollTop(chatContainer[0].scrollHeight);
            ChatActions.removeHasNewMessagesClass(chatContainer);
        }
        else
        {
            ChatActions.applyHasNewMessagesClass(chatContainer);
        }
    });
    chatContainer.data('reScroll')();
    if(rescrollNow && chatContainer.data('shouldScrollToBottom'))
    {
        chatContainer.data('shouldScrollToBottom', false);
        ChatActions.scrollToBottom(chatContainer);
    }
    chatContainer.data('addMessageScroll', true);
};
ChatActions.chatMessagesHaveSamePlayer = function(message1, message2){
    return message1.data('message') && message1.data('message').player
        && message2.data('message') && message2.data('message').player &&
        message2.data('message').player === message1.data('message').player;
};
ChatActions.chatMessageTemplate = null;
ChatActions.getChatMessageTemplate = function(){
    if(ChatActions.chatMessageTemplate)
    {
        return ChatActions.chatMessageTemplate.clone();
    }
    else
    {
        ChatActions.chatMessageTemplate = $('.chat_message.template').remove().removeClass('template');
        return ChatActions.getChatMessageTemplate();
    }
};
ChatActions.addNotificationToChat = function(chatContainer, notificationMessage)
{
    var args = Array.prototype.slice.call(arguments, 1);
    if(args.length > 1)
    {
        var builtMessage = $('<span>');
        for(var i = 0; i < args.length; i++)
        {
            builtMessage.append(args[i]);
        }
        notificationMessage = builtMessage;
    }
    if(chatContainer === null)
    {
        chatContainer = ChatActions.getActiveChatContainer();
        if(!chatContainer)
        {
            return;
        }
    }
    var updateMessage = ChatActions.getChatMessageTemplate();
    updateMessage.addClass('chat_notification');
    updateMessage.hide();
    updateMessage.find('.username').remove();
    var now = Math.round(new Date().getTime() / 1000);
    updateMessage.find('.time').text(DateFormat.hourMinutes(now)).data('timestamp',now);
    updateMessage.find('.delete_holder').css('visibility','hidden');
    updateMessage.find('.colon').remove();

    var notificationWrapper = $('<span class="chat_notification_message">');
    notificationWrapper.append(notificationMessage);
    updateMessage.find('.message').html(notificationWrapper);
    updateMessage.show();

    ChatActions.addMessageToChat(chatContainer,updateMessage, null, true);

    return updateMessage;
};

ChatActions.getActiveChatContainer = function()
{
    // var mainChats = $('#chat_tabs').find('.chat_tab.active').data('chat');
    var mainChats;
    var button = ChatActions.activeChatButton;
    if(button)
    {
        mainChats = button.data('chat');
    }
    else
    {
        mainChats = $();
    }
    if(mainChats && mainChats.length)
    {
        return mainChats.data('chat');
    }
    else
    {
        return Dashboard.mainChatHolderTemplate.data('chat');
    }
};

ChatActions.getActiveChatContainerUserlist = function() {
    var container = ChatActions.getActiveChatContainer();
    if(container)
    {
        return container.data('userlist');
    }
    return null;
};

ChatActions.updateChatMessage = function($element,message,loadingAllMessages)
{
    loadingAllMessages = loadingAllMessages || false;

    var chatContainer = $element.data('chatContainer');

    $element.data('message',message);

    var $sender = $element.find('.sender');
    message.player = Users.update(message.player);
    if(!$element)
        return; //Bug workaround?!

    var isModOfMessage = false;
    var isMyMessage = myUser.id == message.player.id;

    message.player.updateUserElements($sender);
    // $sender.data('id',message.player.id);
    // $sender.data('username',message.player.username);
    message.is_chat_mod = message.player.is_chat_mod || message.is_chat_mod;
    message.is_chat_admin = message.player.is_chat_admin || message.is_chat_admin;

    if(message.player.username)
    {
        $element.addClass('user_listed_'+message.player.username.toLowerCase());
        $element.addClass('user_id_'+message.player.id);
        $element.addClass('message_id_'+message.id);
    }
    if(message.player.is_birthday)
    {
        $element.addClass('is_birthday');
    }

    if(chatContainer)
    {
        if(isMyMessage)
        {
            //Make sure I KNOW that I am a mod of this chat room
            if(message.is_chat_mod)
            {
                chatContainer.data('isChatMod',true);
            }
            if(message.is_chat_admin)
            {
                chatContainer.data('isChatAdmin',true);
            }
        }
        if(message.is_chat_mod) //To show that a particular user is mod of a chat room
        {
            $sender.add($element).addClass('is_chat_mod');
            if(chatContainer.data('chat') && chatContainer.data('chat').data('name'))
            {
                $sender.attr('title','Is a moderator for '+ chatContainer.data('chat').data('name'));
            }
        }
        if(message.is_chat_admin)
        {
            if(chatContainer.data('chat') && chatContainer.data('chat').data('name'))
            {
                $sender.attr('title','Is an admin for '+ chatContainer.data('chat').data('name'));
            }
            $sender.add($element).addClass('is_chat_admin');
        }

        if(myUser.is_mod || chatContainer.data('isChatMod') || chatContainer.data('isChatAdmin'))
        {
            isModOfMessage = true;
        }
    }

    ElementUpdate.flair($sender,message.player);
    ElementUpdate.userTypes($sender.add($element),message.player);
    $element.attr('title','');

    if(message.is_shadow_muted)
    {
        if(isModOfMessage)
        {
            $element.addClass('is_shadow_muted');
            $element.data('shadowMuted',true);
        }
        else
        {
            if(message.player.id != myUser.id)
            {
                if(myUser.is_shadow_muted  || (message.ip_id == myUser.ip_id && !IS_LOCALHOST))
                {
                }
                else
                {
                    $element.remove();
                    return false;
                }
            }
        }
    }
    if(isModOfMessage || isMyMessage)
    {
        $element.addClass('is_mod_of_message');
    }
    if(message.is_muted)
    {
        if(isModOfMessage)
        {
            if(ignoreList[message.player.id])
            {
                $element.addClass('is_ignored');
            }
            else if(message.player.id != myUser.id)
            {
                //$newElement.addClass('is_muted');
                $element.remove();
                return false;
            }else{
                $element.addClass('is_muted');
            }
        }
        else
        {
            if(message.player.id != myUser.id)
            {
                $element.remove();
                return false;
            }
        }
    }


    // if(message.player.display_name && myUser.view_display_names)
    // {
    //     let usernameArea = $sender.text(message.player.display_name);
    //     usernameArea.data('username',message.player.username);
    //     usernameArea.data('display_name',message.player.display_name);
    //     usernameArea.addClass('is_undercover');
    // }
    // else
    // {
    //     $sender.text(message.player.username);
    // }
    var messageText = $element.find('.message');
    var clearStateMessages = function(playerId){
        if(!chatContainer)
        {
            return;
        }
        var previousElement = ChatActions.retrieveChatHolder(chatContainer).find('.state_message_'+playerId);
        previousElement.remove();

        if(!ChatActions.retrieveChatHolder(chatContainer).find('.stage_message').length)
        {
            chatContainer.removeClass('has_state_messages');
        }
    };
    if(message.state_message)
    {
        if(message.player.id == myUser.id)
        {
            return false;
        }
        chatContainer.addClass('has_state_messages');
        var typing = message.state_message.typing;
        $element.addClass('state_text_only').removeClass('normal_message');
        $element.addClass('state_message_'+message.player.id+' state_message');

        if(typing)
        {
            clearStateMessages(message.player.id)
            messageText.text('is typing');
        }
        else
        {
            $element.remove();//Destroy element, find previous
            clearStateMessages(message.player.id);
            return false;
        }
        $element.find('.delete_holder').remove();
        $element.find('.time_holder').remove();
        $element.find('.flairy_holder').remove();
        $element.find('.time').remove();
        $element.addClass('chat_notification');
        var stateMessages = ChatActions.retrieveChatHolder(chatContainer).find('.state_messages');
        if(!stateMessages.length)
        {
            stateMessages = $('<div>').addClass('state_messages');
            ChatActions.retrieveChatHolder(chatContainer).append(stateMessages);
        }
        $element.appendTo(stateMessages);
        return;
    }
    else
    {
        if(message.deleted)
        {
            $element.addClass('deleted');
            messageText.addClass('deleted');
            if(message.player.id == message.deleted_by)
            {
                if(isModOfMessage && messageText.text())
                {
                    messageText.attr('title',messageText.text());
                }
                else
                {
                    messageText.text('...');
                    messageText.text('Self_PikaCHEWED');
                }
            }
            else
            {
                messageText.addClass('mod_deleted');
                if(isModOfMessage && messageText.text())
                {
                    messageText.attr('title',messageText.text());
                }
                else
                {
                    messageText.text('message_pikaCHEWED');
                }
            }
        }
        else
        {
            clearStateMessages(message.player.id);
            var messageContainer = messageText;
            $element.removeClass('deleted');
            messageText.removeClass('deleted');
            messageText.removeClass('mod_deleted');


            if((!message.is_muted) || (message.player.id == myUser.id))
            {
                if(message.message && message.message.charAt(0) == '/')
                {
                    var elementToUse = loadingAllMessages?null:$element;
                    var commandParser = new TokensManager(message.message);
                    var isMod = false;
                    if(commandParser.command == 'all')
                    {
                        if(!ChatActions.chatContainerHasLadder(chatContainer) && message.isChatMod())
                        {
                            LadderLinker.usernameFoundCallback(message.player.username,message,chatContainer,elementToUse,commandParser,!loadingAllMessages);
                        }
                        else
                        {

                        }
                    }
                    else
                    {
                        if(commandParser.command == 'mods')
                        {
                            if(chatContainer && !chatContainer.data('isChatMod') && !(message.player.id == myUser.id))
                            {
                                return false;
                            }
                            LadderLinker.usernameFoundCallback(message.player.username,message,chatContainer,elementToUse,commandParser,!loadingAllMessages);
                        }
                    }
                    if(commandParser.command == 'me')
                    {
                        $element.addClass('me_texted');
                        message.message = commandParser.getMessage();
                    }
                }
                messageContainer.html(LadderLinker.autolinkMessage(message,loadingAllMessages,$element.data('chatContainer'),$element));
            }
            else
            {
                messageContainer.text(message.message);
            }
        }
        $element.find('.time').text(DateFormat.hourMinutes(message.time)).attr('title',DateFormat.full(message.time)).data('timestamp',message.time);
    }
//		$element.find('input[name=message_id]').val(message.id);
    $element.data('message_id',message.id);

    if(!$element.data('hasEvents'))
    {
        $element.data('isModOfMessage',isModOfMessage);//For Chat Holder event attachments
        $element.data('hasEvents',true);
    }


    if(message.player.id == myUser.id)
    {
        $element.addClass('is_me');
    }
    else
    {
        if(message.is_muted)
        {
            return;
            $element.addClass('is_muted');
        }
        if(loadingAllMessages)
        {

            
        }
        else
        {
            if(BrowserHelper.isPhone)
            {


            }
            else
            {
                //$element.fadeIn('fast');
            }
        }
    }
};

ChatActions.sortUserList = function(userList)
{
    tinysort(userList,{
        sortFunction:function(a,b){
            a = $(a.elm);
            b = $(b.elm);

            var aData = a.data();
            var bData = b.data();

            //ALWAYS ON TOP
            if(aData.user === myUser)
                return -1;
            if(bData.user === myUser)
                return 1;

            if(
                aData.user && bData.user &&
                aData.user.location && bData.user.location &&
                aData.user.location.distanceFromUser && bData.user.location.distanceFromUser &&
                aData.user.location.distanceFromUser.distance && bData.user.location.distanceFromUser.distance)
            {
                return aData.user.location.distanceFromUser.distance > bData.user.location.distanceFromUser.distance?1:-1;
            }else
            {

            }

            return (a.data('usernameLowercase') > b.data('usernameLowercase'))?1:-1;
        }
    });
};

ChatActions.updateChatsFromInfo = function(response,completeCallback,switchToChat)
{
    if(matchOnlyMode || !isInLadder)
    {
        return;
    }
    var completeCalled = false;
    if(!response.chat_rooms || !response.chat_rooms.chat_room)
    {
        return;
    }
    var checkException = response.chat_rooms.initial_load;
    var lowestOrder = null;
    $.each(response.chat_rooms.chat_room,function(i,chat){
        var button;
        if(!chatRooms[i])
        {
            if(!chat.id)
            {
                return; //Not enough info to create a chat tab, so throw this away! (Might've closed tab and receieved a message before the server figured it out)
            }
            if(Dashboard.waitForChat == i)//User JUST explicitly joined this chat room
            {
                switchToChat = true;
            }
            if(checkException)
            {
                if(lowestOrder === null || lowestOrder > chat.order)
                {
                    switchToChat = true;
                    lowestOrder = chat.order;
                }
                else
                {
                    switchToChat = false;
                }
            }
            button = ChatActions.makeChatButton(chat,completeCallback,switchToChat);

            completeCalled = true;
            ChatActions.getChatTabs().tsort({data:'order',order:'asc'});
        }

        var chatContainer = chatRooms[i];
        if(!chatContainer)
        {
            return;
        }
        chatContainer = chatContainer.find('.chat_container');

        if(chat.loading_previous_messages)
        {
            chatContainer.data('isPopulated',false);//So that notifications will not pop up
        }

        if(typeof chat.is_chat_mod != 'undefined')
        {
            chatContainer.data('isChatMod', chat.is_chat_mod);
        }
        if(typeof chat.is_chat_admin != 'undefined')
        {
            chatContainer.data('isChatAdmin', chat.is_chat_admin);
        }
        var isPopulated = chatContainer.data('isPopulated');
        chatContainer.data('switchTo',switchToChat);
        var newMessage = Populate.chat(chat,chatContainer,!isPopulated);
        chatContainer.data('loadingAllMessages', false); //set this flag to false after initial load
        chat = chatContainer.data('chat');
        button = chat.data('button');
        if(newMessage && isPopulated)
        {
            if(!button.hasClass('active'))
            {
                button.addClass('has_new_messages');
                ChatActions.setHasNewMessages(button);
                $('#chat_selector').addClass('has_new_messages');
            }
        }
        if(!isPopulated)
        {
            button.trigger('afterPopulate');
            button.off('afterPopulate');
        }
        if(!completeCalled && completeCallback)
        {
            completeCallback();
        }
    });
};
ChatActions.hasNewMessagesCollection = new Map();

ChatActions.scrollToBottom = function(chatInnerHolder){
    // let holder = ChatActions.retrieveChatHolder(chatInnerHolder);
    chatInnerHolder.scrollTop(chatInnerHolder[0].scrollHeight);
};
ChatActions.retrieveChatHolder = function(chatInnerHolder){
    let outerContainer = chatInnerHolder.data('outerContainer');
    if(!outerContainer)
    {
        outerContainer = chatInnerHolder.closest('.chat_container_outer_holder');
        chatInnerHolder.data('outerContainer', outerContainer);
    }
    return outerContainer;
};
ChatActions.applyHasNewMessagesClass = function(chatInnerHolder){
    chatInnerHolder.addClass('has_unseen_messages');
    ChatActions.retrieveChatHolder(chatInnerHolder).addClass('has_unseen_messages');
};
ChatActions.removeHasNewMessagesClass = function(chatInnerHolder){
    chatInnerHolder.removeClass('has_unseen_messages');
    ChatActions.retrieveChatHolder(chatInnerHolder).removeClass('has_unseen_messages');
};
ChatActions.setHasNewMessages = function(element){
    let id = element.data('chatInfo').id;
    if(ChatActions.hasNewMessagesCollection.has(id))
    {
        return false;
    }
    else
    {
        ChatActions.hasNewMessagesCollection.set(id, true);
        return true;
    }
};
ChatActions.aChatHasNewMessages = function(){
    return !!ChatActions.hasNewMessagesCollection.size;
};
ChatActions.removeHasNewMessages = function(element){
    ChatActions.hasNewMessagesCollection.delete(element.data('chatInfo').id)
};

ChatActions.setScrollTimer = function(container){
    if(container.data('scrollTimer'))
    {
        return;
    }
    var timer = setTimeout(function(){
        container.data('processScroll',true);
        container.trigger('scroll');
        container.data('scrollTimer',null);
    },500);
    container.data('scrollTimer',timer);
};





ChatActions.chatScroll = function(e){
    var container = $(this);
    //TODO: use ChatMessages Object to determine whether or not messages have already been added
    if(container.data('loadingPreviousMessages'))
    {
        return;
    }
    if(!container.data('scrollTimer'))
    {
        container.data('processScroll',true);
        ChatActions.setScrollTimer(container);
    }
    if(container.data('processScroll') === true)
    {
    }
    else
    {
        ChatActions.setScrollTimer(container);
        return;
    }
    container.data('processScroll',false);

    var scrollTop = container.scrollTop();
    if(scrollTop < 240 && !container.data('loadedAll')){
        var firstMessage = container.find('.normal_message:first');
        if(!firstMessage)
        {
            return;//This chat has no messages anyway!
        }
        var currentChatPosition = null;
        if(firstMessage && firstMessage.length)
        {
            firstMessage = firstMessage.data('message_id');
        }
        else
        {
            firstMessage = null;
        }
        var data = {};
        data.top_message = firstMessage;
        if(container.hasClass('private'))
        {
            var privateChatContainer = container.closest('.private_chat_area');
            if(privateChatContainer.hasClass('loading'))
            {
                return;
            }
            data.other_user_id = privateChatContainer.data('chat').data('player_id');
        }
        var start = function(){
            container.addClass('loading_previous_messages');
            if(container.data('chat'))
            {
                container.data('chat').addClass('loading_previous_messages');
            }
            if(privateChatContainer && privateChatContainer.data('chat') && privateChatContainer.data('chat').data('chatHolder'))
            {
                privateChatContainer.data('chat').data('chatHolder').addClass('loading_previous_messages')
            }
            container.data('loadingPreviousMessages',true);
        };
        var finish = function(){
            if(container.data('chat'))
            {
                container.data('chat').removeClass('loading_previous_messages');
            }
            if(privateChatContainer && privateChatContainer.data('chat') && privateChatContainer.data('chat').data('chatHolder'))
            {
                privateChatContainer.data('chat').data('chatHolder').removeClass('loading_previous_messages')
            }
            container.removeClass('loading_previous_messages');
            container.data('loadingPreviousMessages',false);
        };
        start();
        Request.send(data,'previous_messages').done(function(response){
            ChatActions.loadPreviousMessages(container, response);
            finish();
        }).fail(function(){
            finish();

        });
        return;
    }

    if(ChatActions.isScrolledToBottom(container))
    {
        container.removeClass('scrolled_up');
        ChatActions.removeHasNewMessagesClass(container);
        if(container.data('hasMore'))
        {
            container.data('hasMore').remove();
            container.data('hasMore',null);
        }
    }
    else
    {
        if(container.data('addMessageScroll'))
        {
            container.data('addMessageScroll', false);
        }
        else
        {
            container.addClass('scrolled_up');
        }
    }
};
ChatActions.testHasAllMessages = function(chatRoomArray,responseArray){
    var hasAllMessages = true;
    $.each(responseArray,function(i,message){
        if(!chatRoomArray[i])
        {
            hasAllMessages = false;
            return false;
        }
    });
    return hasAllMessages;
};
ChatActions.loadPreviousMessages = function(container, response){
    if(response.loaded_all)
    {
        container.data('loadedAll',true);
        return;
    }
    if(response && response.success === false)
    {
        container.data('loadedAll',true);
        return;
    }
    var cutoff = container.scrollTop();
    var hasUnseen = container.hasClass('has_unseen_messages');

    var position = new ScrollPosition(container[0]);
    position.prepareFor('up');

    if(container.hasClass('private'))
    {
        if(ChatActions.testHasAllMessages(container.data('messages').items,
                response.private_chat.chat_messages))
        {
            container.data('loadedAll',true);
            return;
        }
        Populate.chat(response.private_chat,container);
    }
    else
    {
        //Verify messages do not all already exist
        if(container.data('chat'))
        {
            var chatRoomId = container.data('chat').data().chat_room_id;
            if(response.chat_rooms && response.chat_rooms.chat_room[chatRoomId])
            {
                if(ChatActions.testHasAllMessages(container.data('messages').items,response.chat_rooms.chat_room[chatRoomId].chat_messages))
                {
                    container.data('loadedAll',true);
                    return;
                }
            }
        }

        container.data('isPopulated',false);

        ChatActions.updateChatsFromInfo(response,function(){

        });
        container.data('isPopulated',true);
    }
    if(!hasUnseen)//There's currently no way to tell the container to not activate the unseen message indicator for newly loaded messages
    {
        ChatActions.removeHasNewMessagesClass(container);
    }

    position.restore();
    container.data('loadingPreviousMessages',false);
};
ChatActions.isScrolledToBottom = function(element){
    var top = element.scrollTop();

    var height = element.innerHeight();
    var scrollHeight = element[0].scrollHeight;

    return top + height >= scrollHeight - 10;
};

ChatActions.objectCache = {};

ChatActions.chatHolderTemplate = null;
ChatActions.getChatHolderTemplate = function(){
    if(!ChatActions.chatHolderTemplate)
    {
        ChatActions.chatHolderTemplate = Dashboard.mainChatHolderTemplate.removeClass('active');
    }
    return ChatActions.chatHolderTemplate.clone().removeClass('active template_visible');
};
ChatActions.getChatUserlistTemplate = function(){
    if(!ChatActions.chatUserlistTemplate)
    {
        ChatActions.chatUserlistTemplate = Dashboard.mainChatHolderTemplate.data('userlist');
    }
    return ChatActions.chatUserlistTemplate.clone().removeClass('active template_visible');
};

ChatActions.setUpChatTemplates = function(){
    if(!ChatActions.objectCache.chatTabMover)
    {
        ChatActions.objectCache.chatTabMover = $('#chat_tab_mover');
        ChatActions.objectCache.chatGroups = $('#chat_groups');
    }
    if(!ChatActions.objectCache.chatTabTemplate)
    {
        ChatActions.objectCache.chatTabTemplate = ChatActions.objectCache.chatGroups.find('.chat_tab.template').remove().removeClass('template');
        ChatRoom.setChatTabTemplate(ChatActions.objectCache.chatTabTemplate.clone());
    }

    if(!ChatActions.objectCache.chatGroups.data('tabClickEventsActive'))
    {
        ChatActions.objectCache.chatGroups.data('tabClickEventsActive', true);
        ChatActions.objectCache.chatGroups.on('click', '.chat_tab:not(.control_tab)', function(e){
            e.preventDefault();
            var button = $(this);
            if(e.which == 2)
            {
                ChatActions.leaveChatRoom(button.data('chat'));
            }
            else
            {
                ChatActions.changeMainChat(button);
            }
        }).on('click', '.create_chat', function(){
            var chatPopup = $('.popups .create_chat_popup').clone();
            Dashboard.ladderPopup(chatPopup, 'Join Chat Room', {
                buttons: [
                    {
                        text: 'Close',
                        dismiss: true
                    },
                    {
                        text: 'Join',
                        dismiss: false,
                        click: (popup)=>{
                            ChatActions.joinChatRoom(chatPopup.find('input[name="name"]').val(),function(response){
                                if(response === true)
                                {

                                }
                                else
                                {

                                }
                                popup.dismiss();
                            },true);
                        }
                    }
                ]
            });
        });

        ChatActions.objectCache.chatGroups.on('mentioned', '.chat_tab', function(e,by,where,$element){
            var button = $(this);
            if(!button.hasClass('active'))
            {
                button.addClass('you_were_mentioned');
                button.find('.mentioned').attr('title',
                    by +' mentioned you in ' + where);
            }
        });
    }
}
ChatActions.setUpChatTemplates();

ChatActions.makeChatButton = function(chatInfo,completeCallback,switchToChat)
{
    if(chatRooms[chatInfo.id])
    {
        return chatRooms[chatInfo.id].data('button');
    }
    if(completeCallback)
        completeCallback(chatInfo);

    if(!(chatInfo instanceof ChatRoom))
    {
        chatInfo = new ChatRoom(chatInfo);

    }

    let button = chatInfo.addToActiveList();

    ChatActions.objectCache.chatTabMover.sortable({
        axis:'y',
        tolerance: "pointer",
        items: ".chat_tab",
        update: function(e,ui){
            var ul = $(ui.item).closest('.chat_tab_mover');
            var elements = ul.find('.chat_tab').not('.template');
            var ids = [];
            elements.each(function(){
                var element = $(this);
                var chat = element.data('chat').data('chat_room_id');
                ids.push(chat);
            });
            var data = {tab_ids:ids};
            $.post(siteUrl+'/matchmaking/save_chat_tab_order',data);
        }
    });

    var chat = ChatActions.getChatHolderTemplate();

    chat.data('chat_room_id',chatInfo.id);
    chat.data('name',chatInfo.name);

    var userlist = ChatActions.getChatUserlistTemplate();
    userlist.addClass(chatInfo.has_ladder?'has_ladder':'has_no_ladder');


    chat.data('userlist',userlist);
    var chatContainer = chat.find('.chat_container');
    chatContainer.data('chat',chat);
    chatContainer.data('userlist',userlist);

    userlist.appendTo('.user_lists');
    userlist.data('pendingUserlistLoad',chatInfo.userlist?false:true);

    userlist.on('retrieveUserlist',function(){
        if(!Dashboard.userlistIsVisible())
        {
            return;
        }
        var userlist = $(this);
        if(userlist.data('loading') || !userlist.data('pendingUserlistLoad'))
        {
            return;
        }
        userlist.data('loading',true);
        userlist.addClass('loading');
        $.post(siteUrl+'/matchmaking/retrieve_userlist',{id:chatInfo.id},function(response){
            
            userlist.data('pendingUserlistLoad',true);//Set to false to block userlist reloading
            userlist.removeClass('loading');

            userlist.data('loadingAll', true);
            Dashboard.performOpenSearchUpdate(response);
            userlist.data('loadingAll', false);

        }).always(function(){
            userlist.data('loading',false);
        });

    });
    //userlist.hide();

    button.data('chat', chat);

    chat.data('button',button);
    chat.data('chat',chatContainer);

//		chatContainer.scrollLock();
    chatContainer.on('scroll',ChatActions.chatScroll);

    if(typeof chatInfo.is_chat_mod != 'undefined')
    {
        chatContainer.data('isChatMod', chatInfo.is_chat_mod);
    }
    if(typeof chatInfo.is_chat_admin != 'undefined')
    {
        chatContainer.data('isChatAdmin', chatInfo.is_chat_admin);
    }

    var chatRoomDescription = chat.find('.chat_room_description');
    button.on('afterPopulate',function(e){
        chatRoomDescription.data('descriptionId', chatInfo.description_id);
        chatRoomDescription.data('chatRoomId', chatInfo.id);
        if(chatInfo.description)
        {
            chatRoomDescription.find('.description_message').html(chatInfo.description);
        }
        else
        {
            chatRoomDescription.hide();
        }
        var chatRooms = ladderLocalStorage.getItem('chat_rooms');
        if(chatRooms && chatRooms.chats && chatRooms.chats[chatInfo.id] &&
            chatRooms.chats[chatInfo.id].last_motd_id == chatInfo.description_id &&
            chatRooms.chats[chatInfo.id].last_motd_times_closed > 0)
        {
            chatRoomDescription.hide();
        }
        chat.find('.chat_name_overlay .chat_name').text(chatInfo.name);
    });



    chat.appendTo('#main_chat_area');
    chatRooms[chatInfo.id] = chat;
    chatRoomNames[chatInfo.name.toLowerCase()] = chat;
    if(switchToChat || chatInfo.id == preferredChat)
    {
        ChatActions.changeMainChat(button);
    }
    chat.find('.send_chat_button').prop('disabled',false);
    var chatInput = chat.findCache('.chat_input');//.elastic();
    chatInput.attr('placeholder','Message ' + chatInfo.name);
    chat.data('chatInput',chatInput);
    chatContainer.data('chatInput',chatInput);
    chatInput.prop('disabled',false);

    button.data('ChatMessages',new ChatMessages(chatContainer));

    return button;
};
ChatActions.getAllMainChatHolders = function(){
    return $('#main_chat_area').find('.chat_holder');
};
ChatActions.changeMainChatRight = function(){
    var next = ChatActions.objectCache.chatGroups.find('.chat_tab.active').nextAll('.chat_tab').not('.create_chat').first();
    if(!next.length || next.hasClass('template'))
    {
        next = ChatActions.objectCache.chatGroups.find('.chat_tab:not(.control_tab)').first();
    }

    if(next.length)
    {
        ChatActions.changeMainChat(next);
    }
};
ChatActions.changeMainChatLeft = function(){
    var next = ChatActions.objectCache.chatGroups.find('.chat_tab.active').prevAll('.chat_tab').not('.create_chat').first();
    if(!next.length || next.hasClass('template'))
    {
        next = ChatActions.objectCache.chatGroups.find('.chat_tab:not(.control_tab)').last();
    }
    if(next.length)
    {
        ChatActions.changeMainChat(next);
    }
};
ChatActions.attachChatInputActions = function(){
    Dashboard.mainChatArea.data('chatInputEvents', true);
    Dashboard.mainChatArea.on('keydown', '.chat_input', function(e){
        var chatInput = $(this);
        if(e.which == Dashboard.keyCodes.TAB)
        {
            e.preventDefault();
            if(chatInput.data('autocompleteUsed'))
            {
                chatInput.data('autocompleteUsed', false);
                return;
            }
            if(e.shiftKey)
            {
                return ChatActions.changeMainChatLeft();

            }
            else
            {
                return ChatActions.changeMainChatRight();
            }
        }
    }).on('focus', '.chat_input', function(e){
        $('#bottom_dock').addClass('main_chat_focused');
    }).on('blur', '.chat_input', function(e){
        $('#bottom_dock').removeClass('main_chat_focused');
    });
    ChatActions.attachUniversalChatActions(Dashboard.mainChatArea);
};
ChatActions.attachUniversalChatActions = function(element){
    element.on('click','.send_chat_button', function(e){
        ChatActions.sendChat($(this));
    }).on('click', '.unseen_messages_popup', function(e){
        let chatContainer = $(this).closest('.chat_container_outer_holder').find('.chat_container');
        ChatActions.scrollToBottom(chatContainer);
    }).on('keypress', '.chat_input', function(e){
        if(e.which == 13)
        {
            e.preventDefault();
            ChatActions.sendChat($(this));
        }
    })
};
ChatActions.previousActiveChatContainer = null;
ChatActions.changeMainChat = function(button)
{
    var chat = button.data('chat');
    Dashboard.body.removeClass('sidebar-open');
    ChatActions.previousActiveChatContainer = ChatActions.getActiveChatContainer();
    var previousActiveChatTab = ChatActions.getPreviousActiveChatTab();
    if(previousActiveChatTab.length
        && previousActiveChatTab.data('chat')
        && previousActiveChatTab.data('chat').length
        && chat
        && chat.length
        && previousActiveChatTab.data('chat')[0] === chat[0])
    {
        ChatActions.previousActiveChatContainer = null;
    }
    else
    {
    }

    if(!chat)
    {
        return;
    }

    ChatActions.activeChatButton = button;

    var chatSelect = $('#chat_select');
    var mobileChatSelector = $('#chat_selector');



    button.removeClass('you_were_mentioned has_new_messages');
    button.addClass('active');
    chat.addClass('active');


    if(!Dashboard.mainChatArea.data('chatInputEvents'))
    {
        ChatActions.attachChatInputActions();
    }
    else
    {
        //Switch to chat view... This is to prevent initial change from changing the tab
        if(!Dashboard.chatsTab.hasClass('active'))
        {
            Dashboard.chatsTab.trigger('activate');
        }
    }

    if(ChatActions.previousActiveChatContainer)
    {
        ChatActions.previousActiveChatContainer.each(function(i,otherChat){
            otherChat = $(otherChat);
            otherChat.removeClass('active');
        });
    }

    var activeRegionButton = Dashboard.getActiveRegionButton();
    var keepCurrentListVisible = false;
    if(activeRegionButton.length && activeRegionButton.hasClass('fake_region_list_button'))
    {
        keepCurrentListVisible = true;
    }
    var userlist = ChatActions.switchToChatUserlist(button,keepCurrentListVisible);



    ChatActions.removeHasNewMessages(button);

    if(!ChatActions.aChatHasNewMessages())
    {
        mobileChatSelector.removeClass('has_new_messages');
    }


    var chatRoomDescription = chat.findCache('.chat_room_description').removeClass('shown');
    var chatOverlay = chat.findCache('.chat_name_overlay').removeClass('done');
    setTimeout(function(){
        chatOverlay.addClass('done');
        chatRoomDescription.addClass('shown');
    },1200);

    ChatActions.resizeUserlists();
    var chatInput = chat.findCache('.chat_input');
    chatInput.addClass('chat_autocomplete');
    if(BrowserHelper.isPhone)
    {

    }
    else
    {
        chatInput.trigger('focus');
    }

    chatInput.data('chatContainer',chat.data('chat'));
    var holder = chat.data('chat');
    $('#user_list_information').data('countElement').text(chat.data('userlist').data('users'));
    if(holder && holder.data('isIrc') && holder.data('reveal'))
    {
        holder.data('reveal')();
    }
    else
    {
        if(button.data('waitingMention') && button.data('waitingMention').length)
        {
        }
        else if(holder)
        {
            ChatActions.scrollToBottom(holder);
        }
    }
    var settingsAdmin = $('#chat_settings_admin');
    var chatData = chat.data('chat');
    chatSelect.text(chat.data('name'));

    if(!chatData)
    {
        settingsAdmin.hide();
        return;
    }

    if(chatData.data('isChatMod') || chatData.data('isChatAdmin'))
    {
        settingsAdmin.show();
    }
    else
    {
        settingsAdmin.hide();
    }

    settingsAdmin.attr('href',siteUrl+'/chats/edit/'+button.data('chat').data('chat_room_id'));
    ChatActions.chatFocus(button.data('chat').data('chat_room_id'));
    if(chat.hasClass('loading'))
    {
        ChatActions.getChatMessages(button.data('chat').data('chat_room_id'));
    }

};
ChatActions.chatFocus = function(chatId, socketOnly){
    Dashboard.serverConnection.send({action:'chat_focus',data:{
        id:chatId,
        userlist_visible: Dashboard.userlistIsVisible()
    }});
    if(!socketOnly)
    {
        Request.send({id:chatId},'chat_focus');
    }
};

ChatActions.autoCompleteCache = null;
var availableTags = function(sublistOfPresortedChatters){
    if(ChatActions.autoCompleteCache)
    {
        return ChatActions.autoCompleteCache;
    }
    var autocompleteList = [];
    function sortObject(obj) {
        var arr = [];
        for (var id in obj) {
            arr.push(obj[id]);
        }
        arr.sort(function(a, b) { return a.username > b.username; });
        //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
        return arr; // returns array
    }
    var usersToIgnore = {};
    $.each(sublistOfPresortedChatters, function(i, player){
        usersToIgnore[player.id] = player;
        ChatActions.addAutocompleteElementsForUser(autocompleteList, player);
    });
    var compiledList = sortObject(Users.list);
    $.each(compiledList,function(id,player){
        if(usersToIgnore[player.id])
        {
            return;
        }
        ChatActions.addAutocompleteElementsForUser(autocompleteList, player);
    });
    ChatActions.autoCompleteCache = autocompleteList;
    return autocompleteList;
};

ChatActions.switchToChatUserlist = function(button, keepCurrentListVisible)
{
    var chat = button.data('chat');
    var activeUserlist = chat.data('userlist');
    var previousActiveChat = ChatActions.getPreviousActiveChatContainer();
    if(previousActiveChat)
    {
        previousActiveChat.each(function(i, previousChat){
            previousChat = $(previousChat);
            button = previousChat.data('button');
            button = $(button);
            previousChat.removeClass('active');
            button.removeClass('active');
            if(button.data('option_select'))
            {
                button.data('option_select').removeClass('active');
            }

            if(!keepCurrentListVisible)
            {
                previousChat.data('userlist').removeClass('active');
            }

        });
    }
    else
    {
    }
    if(!keepCurrentListVisible)
    {
        var userlist = chat.data('userlist').addClass('active');
        if(userlist.data('refreshSoon'))
        {
            userlist.data('refreshSoon')(100);
        }
    }
    if(activeUserlist.data('pendingUserlistLoad'))
    {
        activeUserlist.trigger('retrieveUserlist');
    }



    return activeUserlist;
};

ChatActions.getChatTabs = function(){
    return $('#chat_groups').find('.chat_tab_mover .chat_tab');
};

ChatActions.getPreviousActiveChatContainer = function(){
    var chat = ChatActions.previousActiveChatContainer;
    if(chat)
    {
        if(chat.data('chat'))
        {
            return chat.data('chat');
        }
        return $();
    }
};
ChatActions.getPreviousActiveChatTab = function(){
    var chat = ChatActions.previousActiveChatContainer;
    if(chat)
    {
        if(chat.data('chat') && chat.data('chat').data('button'))
        {
            return chat.data('chat').data('button');
        }
        return $();
    }
};
ChatActions.getActiveChatTab = function(){
    var chat = ChatActions.getActiveChatContainer();
    if(chat.data('chat') && chat.data('chat').data('button'))
    {
        return chat.data('chat').data('button');
    }
    //No active tabs... just make a dummy tab
    return $();
};

ChatActions.activeChatButton = null;

ChatActions.calculateWindowHeight = function(){
    var dashboard = Dashboard.dashboard;

    Dashboard.CHAT_INPUT_OFFSET = 35;
    Dashboard.TAB_CONTAINER_OFFSET = 142;
    Dashboard.HIDE_TAB_CONTAINER_HEIGHT = -200;

    var windowElement = $(window);
    var windowHeight = windowElement.height();
    var windowWidth = windowElement.width();

    windowHeight = windowHeight - 184; //Extra space

    Dashboard.CHAT_INPUT_OFFSET = 35;
    Dashboard.TAB_CONTAINER_OFFSET = 142;
    Dashboard.HIDE_TAB_CONTAINER_HEIGHT = -200;

    dashboard = dashboard.add(Dashboard.body);

    if(windowWidth >= 1200)
    {
        dashboard.addClass('dashboard-lg dashboard-md dashboard-sm dashboard-xs');
        Dashboard.userlistSide.removeClass('toggleable');
    }
    else if(windowWidth >= 992)
    {
        dashboard.addClass('dashboard-md dashboard-sm dashboard-xs');
        dashboard.removeClass('dashboard-lg');
        Dashboard.userlistSide.removeClass('toggleable');
    }
    else if(windowWidth >= 768)
    {
        dashboard.addClass('dashboard-sm dashboard-xs');
        dashboard.removeClass('dashboard-lg dashboard-md');
        Dashboard.userlistSide.addClass('toggleable');
    }
    else
    {
        dashboard.addClass('dashboard-xs');
        dashboard.removeClass('dashboard-lg dashboard-md dashboard-sm');
        Dashboard.userlistSide.addClass('toggleable');
    }

    if(dashboard.hasClass('dashboard-md'))
    {
        ChatActions.repositionChatTabs('#chat_tabs');
    }
    else
    {
        ChatActions.repositionChatTabs('#sidebar');
    }

    if(dashboard.hasClass('dashboard-sm'))
    {
        windowHeight = windowHeight - 32;//MORE PADDING FOR TALL WINDOWS
    }
    else
    {
        windowHeight = windowHeight + 0;
    }

    if(windowHeight < Dashboard.HIDE_TAB_CONTAINER_HEIGHT)
    {
        Dashboard.body.addClass('dashboard-short');
    }
    else
    {
        Dashboard.body.removeClass('dashboard-short');
    }
    return ChatActions.lastWindowHeightValue = windowHeight;
};
ChatActions.repositionChatTabs = function(location){
    let chatGroups = $('#chat_groups');
    if(chatGroups.data('sittingOn') != location)
    {
        chatGroups.data('sittingOn', location);
        chatGroups.appendTo(location);
    }
};
ChatActions.lastWindowHeightValue = null;
ChatActions.lastWindowHeight = function(){
  if(ChatActions.lastWindowHeightValue !== null)
  {
      return ChatActions.lastWindowHeightValue;
  }
    return ChatActions.calculateWindowHeight();
};
ChatActions.resizeUserlists = function(){

    var windowHeight = ChatActions.lastWindowHeight();
    var mainChats = ChatActions.getActiveChatContainer(); //Optimized by cache
    if(!mainChats)
    {
        mainChats = $();
    }
    if(!Dashboard.otherUserLists)
    {
        Dashboard.otherUserLists = $();
    }
    var userlist = Dashboard.otherUserLists.add(mainChats.data('userlist'));
    if(!Dashboard.midsideContainer.hasClass('flex') && userlist)
    {
        userlist.each(function(){
            var newHeight;
            if(windowHeight < Dashboard.HIDE_TAB_CONTAINER_HEIGHT)
            {
                newHeight = windowHeight + Dashboard.TAB_CONTAINER_OFFSET;
            }
            else
            {
                newHeight = windowHeight;
            }
            $(this).css('height',newHeight + Dashboard.CHAT_INPUT_OFFSET - 230);
        });
    }
};
ChatActions.resizeMainChats = function(){
    var windowHeight = ChatActions.calculateWindowHeight();

    var mainChats = ChatActions.getActiveChatContainer(); //Optimized by cache
    if(!mainChats)
    {
        return;
    }
    mainChats.each(function(){
        // alert('resizing a chat');
        var newHeight;
        if(windowHeight < Dashboard.HIDE_TAB_CONTAINER_HEIGHT)
        {
            newHeight = windowHeight + Dashboard.TAB_CONTAINER_OFFSET;
        }
        else
        {
            newHeight = windowHeight;
        }
        var chat = $(this);
        // chat.css('height',newHeight);
        var input = chat.data('chatInput');
        var chatWindow = chat.data('chat').data('chat');
        ChatActions.scrollToBottom(chatWindow);
        if(input && input.length && input.is(':focus'))
        {
            input.focus();
            input.click();
        }
    });
};
ChatActions.resizeOpenChats = function(specialContainer)
{
    var windowHeight = ChatActions.lastWindowHeight();

    ChatActions.resizeMainChats();
    ChatActions.resizeUserlists();


    if(specialContainer)
    {
        specialContainer.css('height',windowHeight);
    }

    if(Dashboard.userInfoTab.hasClass('active'))
    {
        $('#user_info_pane').css('height',windowHeight + 86);
    }

    var dashboard = Dashboard.dashboard;
    if(Dashboard.directChatsTab.hasClass('active'))
    {
        var privateChatHolder = $('#big_private_chat').find('.chat_holder')
            .add('#tab-pane-direct_messages .active_chats');
        privateChatHolder.each(function(){
            var newHeight;
            if(windowHeight < Dashboard.HIDE_TAB_CONTAINER_HEIGHT)
            {
                newHeight = windowHeight + Dashboard.TAB_CONTAINER_OFFSET;
            }
            else
            {
                newHeight = windowHeight;
                if(dashboard.hasClass('dashboard-sm'))
                {
                    newHeight += 56;
                }
                else
                {
                    newHeight += 108;
                }
            }
            var chat = $(this);
            // chat.css('height',newHeight - 24);
            var chatWindow = chat.data('chat');

            if(chatWindow)
            {
                ChatActions.scrollToBottom(chatWindow);
            }
            var container = chat.find('.chat_container');
            if(container.length)
            {
                ChatActions.scrollToBottom(container);
            }
            //var input = chat.data('chatInput');
            //if(input && input.length && input.is(':focus'))
            //{
            //	input.focus();
            //	input.click();
            //}
        });
    }
    return windowHeight;
};

ChatActions.getRecentChattersSorted = function(messageList){
    var messages = messageList;
    var playerList = {};
    var sortedList = [];
    var reversedMessages = [];
    $.each(messages, function(i, message){
        reversedMessages.unshift(message);
    });
    $.each(reversedMessages, function(i, message){
        var messageData = message.data;
        if(!messageData)
        {
            return;
        }
        if(!messageData.player)
        {
            return;
        }
        if(playerList[messageData.player.id])
        {
            return;
        }
        if(messageData.player.id == myUser.id)
        {
            return;
        }
        if(!(messageData.player instanceof User))
        {
            messageData.player = Users.update(messageData.player);
        }
        messageList[messageData.id].data.player = messageData.player; //Update original
        playerList[messageData.player.id] = messageData.player;
        sortedList.push(messageData.player);
    });
    return sortedList;
};

ChatActions.spaceIsAfterTerm = function(termIndex,string){
    return string.lastIndexOf(' ') > termIndex;
};

ChatActions.chatAutocompleteOptions = {
    html:true,
    delay:50,
    autoFocus:true,
    minLength: 0,
    source: function(request, response) {
        var term = request.term,
            results = [];

        var triggerIndex;
        var matcher;
        var list;
        if(!term.length)
        {
            response();
            return;
        }

        triggerIndex = term.lastIndexOf('*');
        if(triggerIndex >= 0 && !ChatActions.spaceIsAfterTerm(triggerIndex, term))
        {
            term = request.term.split(/(\s+)/).pop();
            matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");

            response($.grep(LadderLinker.getEmoteShortcuts(), function(item) {
                return matcher.test(item.value);
            }));
            return;
        }

        triggerIndex = term.lastIndexOf('::');
        if(triggerIndex >= 0 && !ChatActions.spaceIsAfterTerm(triggerIndex, term))
        {
            term = request.term.split(/(\s+)/).pop();

            matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
            response($.grep(LadderLinker.getGuideShortcuts(), function(item) {
                return matcher.test(item);
            }));
            return;
        }


        triggerIndex = term.lastIndexOf('@');
        if (triggerIndex >= 0 && !ChatActions.spaceIsAfterTerm(triggerIndex, term))
        {
            var chatContainer = this.element.data('chatContainer');
            var chatters = [];
            if(chatContainer.data('messages') && chatContainer.data('messages').items)
            {
                chatters = ChatActions.getRecentChattersSorted(chatContainer.data('messages').items);
            }
            term = StringHelpers.extractLast(request.term);
            if (term.length > 0)
            {
                matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
                response($.grep(availableTags(chatters), function(item) {
                    return matcher.test(item.searchValue)
                }));
                return;
            }
            else
            {
                var autocompleteList = [];
                $.each(chatters, function(i, player){
                    ChatActions.addAutocompleteElementsForUser(autocompleteList, player);
                });
                return response(autocompleteList);
            }
        }
        response();
        return;
    },
    open: function (event, ui) {
        var $input = $(event.target);
        $input.data('autocompleteOpen',true);
        var $results = $input.autocomplete("widget");
        var scrollTop = $(window).scrollTop();
        var top = $results.position().top;
        var height = $results.outerHeight();
        if (true || top + height > $(window).innerHeight() + scrollTop) {
            var newTop = top - height - $input.outerHeight();
            if (newTop > scrollTop)
                $results.css("top", newTop + "px");
        }
    },
    focus: function(event, ui) {
        if(!ui.item || !ui.item.isUsername)
        {
            return false;
        }
        if(ui.item && ui.item.value)
        {
            ChatActions.highlightUsernameInChats(ui.item.value);
        }
        else
        {
            ChatActions.removeUsernameHighlightInChat(true);
        }
        // prevent value inserted on focus
        return false;
    },
    close: function(event, ui){
        $(event.target).data('autocompleteOpen',false);
        $(event.target).data('autocompleteUsed',true);
        ChatActions.removeUsernameHighlightInChat(true);
    },
    select: function(event, ui) {
        var terms = this.value.split(" ");
        // remove the current input
        terms.pop();
        // add the selected item
        if(ui.item.isUsername)
        {
            terms.push("@"+ui.item.value);
        }
        else
        {
            terms.push(ui.item.value);
        }
        // add placeholder to get the comma-and-space at the end

        var input = $(this);
        input.val(terms.join(' ') +" ");

        input.focus().trigger('focus');;
        input.trigger('keypress');
        $.event.trigger({ type : 'keypress' });


        return false;
    }
};
ChatActions.sendChatState = function($input){
    var isTyping = $input.data('typing');
    var chatHolder = $input.closest('.chat_holder');
    var chatInput = $input;
    var chatContainer = chatHolder.find('.chat_container');

    var match_id = $input.closest('.private_chat_area').find('input[name=match_id]').val();
    var to_user_id = $input.closest('.private_chat_area').find('input[name=to_user_id]').val();

    var chat_room_id = null;
    if(chatHolder.data('chat_room_id'))
    {
        chat_room_id = chatHolder.data('chat_room_id');
    }
    if(!chatHolder.data('send_id'))
    {
        chatHolder.data('send_id',1);
    }
    chatHolder.data('send_id',chatHolder.data('send_id')+1);

    var data={chat_room_id:chat_room_id,
        to_user_id:to_user_id,
        match_id:match_id,
        is_typing:chatInput.data('typing')?1:0
    };

    Request.send(data,'update_chat_state',function(response) {

    });
};

ChatActions.exitCurrentChat = function(){
    ChatActions.leaveChatRoom(ChatActions.getActiveChatTab().data('chat'));
};

ChatActions.leaveChatRoom = function(chat)
{
    chat = $(chat);
    var data = {chat_room_id:chat.data('chat_room_id')};
    var button = $(chat.data('button'));

    $('#chat_select').find('option[value='+data.chat_room_id+']').remove();
    if(button.hasClass('active'))
    {
        var prevButton = button.prevAll('.chat_tab').not('.create_chat, .template').first();
        if(prevButton.length)
        {
            prevButton.trigger('click');
        }
        else
        {
            var aChat = $('#chat_tabs').find('.chat_tab').not('.template').not(button).not('.control_tab').first();
            if(aChat.length)
            {
                aChat.click();
            }
            else
            {
                $('.donate.special_buttons').find('p').text('MONTHLY SUBSCRIBE TO HELP FIX THIS AND CURE HUNGER. SECRETS PLS.');
                alert("DON'T EXPOSE MY EMBARRASSMENT ;~;!");
            }
        }
    }
    chat.data('userlist').remove();

    button.data('chatInfo').removeFromList();

    delete chatRooms[chat.data('chat_room_id')];
    delete chatRoomNames[chat.data('name').toLowerCase()];
    chat.remove();

    Request.send(data,'leave_chat');
};

ChatActions.chatContainerHasLadder = function(chatContainer){
    if(!chatContainer)
    {
        return null;
    }
    return chatContainer && chatContainer.data('chat') && chatContainer.data('chat').data('button') && chatContainer.data('chat').data('button').data('has_ladder');
};
ChatActions.getChatMessages = function(chatRoomId){
    var data = {};
    if(chatRoomId)
    {
        data.chat_room_id = chatRoomId;
        var chatRoomElement = chatRooms[chatRoomId];
        if(chatRoomElement)
        {
            if(chatRoomElement.data('loading_beginning_state'))
            {
                return;
            }
            chatRoomElement.data('loading_beginning_state', true);
        }
    }
    return Request.send(data, 'get_chat_messages', function(response){
        if(chatRoomElement && chatRoomElement.data('loading_beginning_state'))
        {
            chatRoomElement.data('loading_beginning_state', false);
        }
        if(!response.chat_rooms)
        {
            return;
        }

        var chatRooms = response.chat_rooms;
        delete response.chat_rooms;

        var timeout = 0;
        var orderedChats = [];

        for (var chatRoom in chatRooms.chat_room)
        {
            chatRoom = chatRooms.chat_room[chatRoom];
            orderedChats.push(chatRoom);
        }

        orderedChats.sort(function(a,b) {
            if(a.last_active)
            {
                return -1;
            }
            if(b.last_active)
            {
                return 1;
            }
            return a.order > b.order ? 1 : -1;
        });

        $.each(orderedChats, function(index,chat_room){
            var i = chat_room.id;
            var chatRoomObject = {};
            chatRoomObject[i] = chat_room;
            var chatMessages = chat_room.chat_messages;
            // delete chatRoomObject[i].chat_messages;
            // Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room: chatRoomObject}}); //Loads with no messages
            ChatActions.setChatLoadingState(i, true);

            setTimeout(function(){
                ChatActions.setChatLoadingState(i, false);
                chatRoomObject[i].chat_messages = chatMessages;
                chatRoomObject[i].loading_previous_messages = true;
                Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room: chatRoomObject}});
            },timeout);
            timeout += 1000;
        });



        var activeChat = ChatActions.getActiveChatContainer();
    });


};
ChatActions.setChatLoadingState = function(id, state){
    if(state)
    {
        chatRooms[id] ? chatRooms[id].addClass('loading beginning_state') : null;
    }
    else
    {
        chatRooms[id] ? chatRooms[id].removeClass('loading beginning_state') : null;
    }
    if(chatRooms[id])
    {
        return chatRooms[id];
    }
    else
    {
        return $();
    }
}
ChatActions.joinChatRoom = function(name,completeCallback,switchToChat,isIrc)
{
    if(!name)
    {
        return false;
    }
    name = String(name);
    var data = {name:name,is_irc:(name.substring(0,1) == '#')?1:0};
    if(chatRoomNames[name.toLowerCase()])
    {
        var chat = chatRoomNames[name.toLowerCase()];
        var button = chat.data('button');
        // button.insertAfter($('#main_chat_button'));
        button.trigger('click');
        if(completeCallback)
        {
            completeCallback(true);
        }
        return;
    }
    Request.send(data,'join_chat',function(response){
        if(completeCallback)
        {
            completeCallback(response);
        }
        if(response.success)
        {
            Dashboard.waitForChat = response.chat_id;
            return true;
        }
        else
        {
            alert('Could not join that room!');
            return false;
        }
    });
};

ChatActions.highlightUsernameInChats = function(username) {
    if(typeof username !== 'string')
    {
        return;
    }
    var currentChat;
    if(!isInLadder)
    {
        currentChat  = $(document);
    }
    else
    {
        currentChat = ChatActions.getActiveChatContainer();
    }
    username = username.toLowerCase();
    if(!currentChat || !currentChat.length)
    {
        return;
    }
    currentChat.find('.chat_message.user_listed_'+username).addClass('hover_highlight');
};
ChatActions.retrieveUserElementFromId = function(id, backupUsername){
    var theUser = Users.findById(id);
    var element;
    if(theUser)
    {
        element = theUser.createUsernameElement();
    }
    else
    {
        element = $('<span>').addClass('username').text(backupUsername);
    }
    return element;
};
ChatActions.inviteErrorMessageGenerator = function(invitee, inviteData, chatTarget){
    var usernameElement = ChatActions.retrieveUserElementFromId(inviteData.player_id, inviteData.username);
    if(!chatTarget)
    {
        chatTarget = null;
    }
    var errorTypes = {
        player_no_exist:function(){
            ChatActions.addNotificationToChat(chatTarget,usernameElement,' does not exist.');
        },
        no_permission:function(){
            ChatActions.addNotificationToChat(chatTarget,'You do not have permission to invite ',usernameElement, ' to this chat.');
        },
        already_invited:function(){
            ChatActions.addNotificationToChat(chatTarget,usernameElement, ' is already invited.');
        },
        in_there:function(){
            ChatActions.addNotificationToChat(chatTarget,usernameElement, ' has already joined this chat.');
        }
    };
    if(errorTypes[inviteData.error_type])
    {
        errorTypes[inviteData.error_type]();
    }
    else
    {
        ChatActions.addNotificationToChat(chatTarget,inviteData.error);
    }
};

ChatActions.removeUsernameHighlightInChat = function(username)
{
    var currentChat;
    if(!isInLadder)
    {
        currentChat  = $(document);
    }
    else
    {
        currentChat = ChatActions.getActiveChatContainer();
    }
    if(!currentChat || !currentChat.length)
    {
        return;
    }
    if(username === true)
    {
        currentChat.find('.chat_message').removeClass('hover_highlight');
    }
    else if(typeof username === 'string')
    {
        username = username.toLowerCase();
        currentChat.find('.chat_message.user_listed_'+username).removeClass('hover_highlight');
    }
};

$.fn.autolinkerDefault = function() {

    return $(this).each(function(){
        var input = $(this);
        var result = Autolinker.link(input.html(), LadderLinker.autolinkerOptions);
        input.html(result);
    });
};

$.fn.usernameAutocompleteMod = function(extraData){
    return $(this).each(function(){
        var options = $.extend({}, usernameAutocompleteModOptions, extraData);
        $(this).autocomplete(options)
    });
};
$.fn.usernameAutocomplete = function(extraData){
    return $(this).each(function(){
        var options = $.extend({}, usernameAutocompleteOptions, extraData);
        $(this).autocomplete(options)
    });
};

var usernameAutocompleteModOptions = {
    html:true,
    source: function (request, response) {
        $.get(siteUrl + '/search', {
            autocomplete: 1,
            json: 1,
            search: request.term,
            banned_users:1
        }, function (result) {
            var autocompleteList = [];
            $.each(result.users, function (i, user) {
                user = Users.update(user);
                ChatActions.addAutocompleteElementsForUser(autocompleteList, user);
            });
            response(autocompleteList);
        }).error(function () {
        });
    },
    minLength: 1,
    select: function (event, ui) {
        $(this).val(ui.item.value);
    }
};
var usernameAutocompleteOptions = {
    source: function (request, response) {
        $.get(siteUrl + '/search', {
            autocomplete: 1,
            json: 1,
            search: request.term,
        }, function (result) {
            var autocompleteList = [];
            $.each(result.users, function (i, user) {
                user = Users.update(user);
                ChatActions.addAutocompleteElementsForUser(autocompleteList, user);
            });
            response(autocompleteList);
        }).error(function () {
        });
    },
    html:true,
    minLength: 1,
    select: function (event, ui) {
        $(this).val(ui.item.value);
    }
};


/** WEBPACK FOOTER **
 ** ./../components/ChatActions.jsx
 **/