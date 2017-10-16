/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var models = __webpack_require__(1);
	var components = __webpack_require__(61);
	
	__webpack_require__(67);
	var commonScripts = __webpack_require__(68);
	__webpack_require__(69);
	__webpack_require__(39);
	__webpack_require__(70);
	__webpack_require__(71);
	__webpack_require__(72);
	
	var flairManager = __webpack_require__(64);
	
	var main = __webpack_require__(10);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./Character": 2,
		"./Character.jsx": 2,
		"./ChatMessage": 3,
		"./ChatMessage.jsx": 3,
		"./ChatMessages": 34,
		"./ChatMessages.jsx": 34,
		"./ChatNotification": 32,
		"./ChatNotification.jsx": 32,
		"./ChatRoom": 35,
		"./ChatRoom.jsx": 35,
		"./Flair": 21,
		"./Flair.jsx": 21,
		"./Infraction": 48,
		"./Infraction.jsx": 48,
		"./League": 16,
		"./League.jsx": 16,
		"./Location": 13,
		"./Location.jsx": 13,
		"./Match": 23,
		"./Match.jsx": 23,
		"./MatchModeManager": 22,
		"./MatchModeManager.jsx": 22,
		"./MatchSummary": 36,
		"./MatchSummary.jsx": 36,
		"./PreferredBuilds": 19,
		"./PreferredBuilds.jsx": 19,
		"./PreferredGame": 58,
		"./PreferredGame.jsx": 58,
		"./User": 12,
		"./User.jsx": 12,
		"./UserCollection": 11,
		"./UserCollection.jsx": 11,
		"./UserlistElement": 18,
		"./UserlistElement.jsx": 18,
		"./UsernameElement": 54,
		"./UsernameElement.jsx": 54
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Character = exports.Character = function Character(data) {
	    this.data = data;
	};
	
	Character.prototype.generateElement = function () {
	    var character = this.data;
	
	    var characterImage = $('<div>').addClass('character').addClass('character_for_game_' + character.game_slug).addClass('character_name_' + character.slug_name).addClass('character_id_' + character.id).attr('title', character.name).css('background-image', 'url(' + character.image_url + ')');
	    if (character.percent) {
	        var percentage = $('<span>').addClass('badge percentage').text(character.percent);
	        percentage.appendTo(characterImage);
	    }
	    return characterImage;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ChatMessage = undefined;
	
	var _ChatActions = __webpack_require__(4);
	
	var ChatMessage = exports.ChatMessage = function ChatMessage(data) {
	    this.sender = null;
	    this.timestamp = null;
	    this.element = null;
	    this.inserted = false;
	    this.setProperties(data);
	};
	ChatMessage.prototype.getContext = function () {
	    return {
	        player_id: this.player.id,
	        chat_room_id: this.chat_room_id,
	        message_id: this.id,
	        match_id: this.match_id
	    };
	};
	ChatMessage.prototype.setProperties = function (data) {
	    var i;
	    for (i in data) {
	        if (data.hasOwnProperty(i)) {
	            this[i] = data[i];
	        }
	    }
	};
	ChatMessage.prototype.renderChatElement = function () {
	    if (this.element) {
	        return this.element;
	    }
	    this.element = ChatMessage.newElement();
	    this.element.data('message', this.message);
	    this.element.data('senderElement').applyUsernameClasses(this.sender).text(this.sender.username);
	    this.element.data('message').text(this.message.message);
	    this.element.data('timeElement').text(this.message.time);
	};
	ChatMessage.newElement = function () {
	    var element = _ChatActions.ChatActions.getChatMessageTemplate();
	    element.data('controlsElement', element.find('.delete_holder'));
	    element.data('timeHolderElement', element.find('.time_holder'));
	    element.data('timeElement', element.find('.time'));
	    element.data('senderElement', element.find('.sender'));
	    element.data('message', null);
	    return element;
	};
	ChatMessage.prototype.isChatMod = function () {
	    return this.is_chat_mod || this.is_chat_admin;
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ChatActions = undefined;
	
	var _Dashboard = __webpack_require__(5);
	
	var _matchmaking = __webpack_require__(10);
	
	var _ElementUpdate = __webpack_require__(37);
	
	var _LadderLinker = __webpack_require__(45);
	
	var _Ladder = __webpack_require__(26);
	
	var _DateFormat = __webpack_require__(38);
	
	var _Request = __webpack_require__(7);
	
	var _Populate = __webpack_require__(40);
	
	var _ScrollPosition = __webpack_require__(59);
	
	var _User = __webpack_require__(12);
	
	var _ChatMessages = __webpack_require__(34);
	
	var _ChatMessage = __webpack_require__(3);
	
	var _ChatRoom = __webpack_require__(35);
	
	var _TokensManager = __webpack_require__(28);
	
	var _StringHelpers = __webpack_require__(60);
	
	var _MatchmakingPopup = __webpack_require__(42);
	
	var _Html = __webpack_require__(27);
	
	var _Settings = __webpack_require__(25);
	
	var ChatActions = exports.ChatActions = {};
	ChatActions.getUsernameLink = function (user) {
	    if (user.username && user.id) {
	        return siteUrl + '/player/' + user.id;
	    }
	};
	ChatActions.previousHostCodeFollow = null;
	ChatActions.hostCodeMouseMoveActive = false;
	ChatActions.hostCodeFollow = function (message) {
	    if (ChatActions.previousHostCodeFollow) {
	        ChatActions.previousHostCodeFollow.remove();
	    }
	
	    if (message === null) {
	        ChatActions.previousHostCodeFollow = null;
	        return;
	    }
	
	    ChatActions.previousHostCodeFollow = message.closest('.host_code_notification').appendTo(_Dashboard.Dashboard.body);
	    if (!ChatActions.hostCodeMouseMoveActive) {
	        ChatActions.hostCodeMouseMoveActive = true;
	        $(document).on('mousemove', function (e) {
	            if (ChatActions.previousHostCodeFollow) {
	                var width = ChatActions.previousHostCodeFollow.width();
	                var height = ChatActions.previousHostCodeFollow.height();
	                ChatActions.previousHostCodeFollow.css({ left: e.pageX - width / 2, top: e.pageY - height / 2 });
	            }
	        });
	    }
	};
	ChatActions.addAutocompleteElementsForUser = function (autocompleteList, user) {
	    if (user.autoCompleteElement || user.autoCompleteElementSecondary) {
	        if (user.autoCompleteElement) {
	            autocompleteList.push(user.autoCompleteElement);
	        }
	        if (user.autoCompleteElementSecondary) {
	            autocompleteList.push(user.autoCompleteElementSecondary);
	        }
	    } else {
	        if (user.display_name) {
	            var displayed = $('<span class="username unclickable">');
	            displayed.append(_Html.Html.encode(user.display_name)).append(' (').append(user.createUsernameElement().addClass('unclickable')).append(')');
	            user.autoCompleteElementSecondary = {
	                label: displayed,
	                value: user.username,
	                searchValue: user.display_name + user.username,
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
	    var _error = function _error() {
	        button.removeClass('coolhover');
	    };
	    $.ajax({
	        url: 'https://www.googleapis.com/youtube/v3/videos?id=' + button.data('id') + '&key=' + youtubeBrowserApiKey + '&fields=items(snippet(title))&part=snippet',
	        type: 'GET',
	        crossDomain: true,
	        dataType: 'jsonp',
	        success: function success(response) {
	            if (response.items) {
	                var first = response.items.pop();
	                var title = first.snippet.title;
	                if (title.length > 80) {
	                    title = title.substring(0, 80) + '...';
	                }
	                if (title.length != 0) {
	                    button.text(title).attr('title', first.snippet.title);
	                }
	            } else {
	                _error();
	            }
	        },
	        error: function error() {
	            _error();
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
	    } else {
	        streamAction.find('.stream_open_embed').show();
	    }
	
	    if (button.hasClass('imagelink')) {
	        var url = button.attr('href');
	        if (button.data('preview')) {
	            url = button.data('preview');
	        }
	        if (url.match('^http://')) {
	            url = url.replace("http://", "https://");
	        }
	        advancedPreviewImage.attr('src', url);
	    }
	    if (button.hasClass('youtubelink') && button.data('id')) {
	        advancedPreview.show().addClass('spinner');
	        var _error2 = function _error2() {
	            advancedPreview.hide();
	            //advancedPreviewImage.hide();
	        };
	        advancedPreviewImage.attr('src', 'https://img.youtube.com/vi/' + button.data('id') + '/0.jpg');
	        $.ajax({
	            url: 'https://www.googleapis.com/youtube/v3/videos?id=' + button.data('id') + '&key=' + youtubeBrowserApiKey + '&fields=items(snippet(title))&part=snippet',
	            type: 'GET',
	            crossDomain: true,
	            dataType: 'jsonp',
	            success: function success(response) {
	                if (response.items) {
	                    var first = response.items.pop();
	                    advancedPreview.removeClass('spinner').text(first.snippet.title);
	                    //button.find('.stream_link_advanced_preview_time').text(response);
	                    //advancedPreviewImage.attr('src',
	                    //	response.data.thumbnail.sqDefault);
	                } else {
	                        _error2();
	                    }
	            },
	            error: function error() {
	                _error2();
	            }
	        });
	    } else {
	        if (stream) {
	            if (stream.preview_url) {
	                advancedPreviewImage.attr('src', stream.preview_url);
	            }
	            if (stream.channel_name) {
	                var titleText = stream.title ? ' - ' + stream.title : '';
	                advancedPreview.text(stream.channel_name + titleText);
	            }
	        } else {
	            advancedPreview.hide();
	        }
	    }
	    $('#stream_action').show();
	    _Dashboard.Dashboard.keepContainerOnScreen($('#stream_action'), { x: x, y: y });
	};
	
	ChatActions.sendChat = function ($input) {
	    if ($input.hasClass('disabled')) {
	        return false;
	    }
	    if (!$input.data('chatHolder')) {
	        $input.data('chatHolder', $input.closest('.chat_holder'));
	    }
	    var chatHolder = $input.data('chatHolder');
	    var chatInput = chatHolder.findCache('.chat_input');
	    var chatContainer = chatHolder.findCache('.chat_container');
	
	    var message = chatInput.val();
	    if (typeof $input.data('match_id') === 'undefined') {
	        var match_id = $input.closest('.private_chat_area').find('input[name=match_id]').val();
	        $input.data('match_id', match_id ? match_id : null);
	    }
	    if (typeof $input.data('to_user_id') === 'undefined') {
	        var privateChatArea = $input.closest('.private_chat_area');
	        if (privateChatArea.length && privateChatArea.data('chat') && privateChatArea.data('chat').data('player_id')) {
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
	    if ($input.data('response_id')) {
	        data.response_id = $input.data('response_id');
	        message = $input.text();
	    }
	    // chatInput.prop('disabled',true);
	
	    if ($.trim(message).length == 0 && !data.response_id) {
	        return;
	    }
	
	    if (message.charAt(0) == '/') {
	        var result = _TokensManager.TokensManager.parseCommand(message);
	        if (result === true) {
	            chatInput.val('');
	            return;
	        } else if (result === false) {} else if (result instanceof String || typeof result === 'string') {
	            chatInput.val('');
	            ChatActions.addNotificationToChat(chatContainer, result);
	            return;
	        } else {
	            $.extend(data, result);
	        }
	    }
	    if (message.substring(0, 3) == "!mm") {
	        // chatInput.val('');
	        _Dashboard.Dashboard.startMatchWithPlayer = null;
	        _MatchmakingPopup.MatchmakingPopup.showMatchSelectDialog();
	        // return;
	    }
	    var tempMessage = ChatActions.getChatMessageTemplate();
	    var chatMessage = new _ChatMessage.ChatMessage({ player: myUser, message: message });
	
	    ChatActions.updateChatMessage(tempMessage, chatMessage);
	    var usernameElement = myUser.updateUserElements(tempMessage.find('.username'));
	
	    var parsedMessage = _LadderLinker.LadderLinker.autolinkMessage({ player: myUser, message: message });
	    tempMessage.find('.message').html(parsedMessage);
	    tempMessage.find('.time').text('sending...').data('timestamp', Math.round(new Date().getTime() / 1000));
	    tempMessage.addClass('is_me my_temp_message normal_message');
	    tempMessage.data('time', Math.round(new Date().getTime() / 1000));
	    tempMessage.data('send_id', chatHolder.data('send_id'));
	
	    if (BrowserHelper.isPhone) {
	        //tempMessage.show();
	    } else {
	            tempMessage.fadeIn();
	        }
	
	    // ElementUpdate.flair(tempMessage.find('.sender'), myUser);
	
	    ChatActions.addMessageToChat(chatContainer, tempMessage);
	    ChatActions.scrollToBottom(chatContainer);
	
	    chatInput.val('');
	    chatInput.blur();
	    chatInput.trigger('focus');
	
	    addGaEvent('matchmaking', 'sendingMessage');
	
	    var sendOffIntoTheWilderness = function sendOffIntoTheWilderness() {
	        tempMessage.removeClass('send_failed');
	        _Request.Request.send(data, 'send_chat', function (response) {
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
	
	ChatActions.addMessageToChat = function (chatContainer, message, replaceMessage, rescrollNow) {
	    var hasToScroll = !chatContainer.hasClass('scrolled_up');
	
	    var newMessageTime = message.findCache('.time').data('timestamp');
	
	    if (replaceMessage) {
	        replaceMessage.replaceWith(message);
	    } else {
	        message.appendTo(chatContainer);
	    }
	
	    message.data('chatContainer', chatContainer);
	
	    var previousMessage = message.prev();
	    if (!previousMessage.length || previousMessage.length && !previousMessage.hasClass('chat_notification')) {
	        if (previousMessage.length) {
	            var previousMessageTime = previousMessage.findCache('.time').data('timestamp');
	        }
	        //Compare to timestamp of previous message
	        var notificationMessage = null;
	        if (!message.find('.chat_notification_message').length && !replaceMessage) {
	            var showMessageDate = false;
	            if (!previousMessage.length) {
	                showMessageDate = true;
	            }
	            if (newMessageTime && previousMessageTime) {
	                var dayOne = _DateFormat.DateFormat.custom(previousMessageTime, 'mdy');
	                var dayTwo = _DateFormat.DateFormat.custom(newMessageTime, 'mdy');
	                if (dayTwo != dayOne) {
	                    showMessageDate = true;
	                }
	            } else if (!previousMessageTime) {
	                showMessageDate = true;
	            }
	            if (showMessageDate && newMessageTime) {
	                notificationMessage = ChatActions.addNotificationToChat(chatContainer, ' ' + _DateFormat.DateFormat.monthDayYear(newMessageTime) + ' ');
	                notificationMessage.insertBefore(message);
	                notificationMessage.addClass('date_change_notification');
	                notificationMessage.find('.time_holder').remove();
	            }
	        }
	
	        if (!notificationMessage && previousMessage.length) {
	            if (!previousMessage.data('combo')) {
	                previousMessage.data('combo', 0);
	            }
	            if (!previousMessageTime) {
	                previousMessageTime = previousMessage.findCache('.time').data('timestamp');
	            }
	            var lessThanFiveMinutes = newMessageTime - previousMessageTime < 300;
	            if (lessThanFiveMinutes && previousMessage.data('combo') < 8 && ChatActions.chatMessagesHaveSamePlayer(previousMessage, message)) {
	                message.addClass('same_player_as_previous');
	                message.data('combo', previousMessage.data('combo') + 1);
	            } else {
	                message.removeClass('same_player_as_previous');
	                var next = message.next();
	                if (!ChatActions.chatMessagesHaveSamePlayer(next, message)) {
	                    next.removeClass('same_player_as_previous');
	                }
	            }
	        }
	    }
	
	    chatContainer.data('reScroll', function (e) {
	        if (hasToScroll || chatContainer.data('loadingAllMessages')) {
	            chatContainer.data('shouldScrollToBottom', true);
	            // chatContainer.scrollTop(chatContainer[0].scrollHeight);
	            ChatActions.removeHasNewMessagesClass(chatContainer);
	        } else {
	            ChatActions.applyHasNewMessagesClass(chatContainer);
	        }
	    });
	    chatContainer.data('reScroll')();
	    if (rescrollNow && chatContainer.data('shouldScrollToBottom')) {
	        chatContainer.data('shouldScrollToBottom', false);
	        ChatActions.scrollToBottom(chatContainer);
	    }
	    chatContainer.data('addMessageScroll', true);
	};
	ChatActions.chatMessagesHaveSamePlayer = function (message1, message2) {
	    return message1.data('message') && message1.data('message').player && message2.data('message') && message2.data('message').player && message2.data('message').player === message1.data('message').player;
	};
	ChatActions.chatMessageTemplate = null;
	ChatActions.getChatMessageTemplate = function () {
	    if (ChatActions.chatMessageTemplate) {
	        return ChatActions.chatMessageTemplate.clone();
	    } else {
	        ChatActions.chatMessageTemplate = $('.chat_message.template').remove().removeClass('template');
	        return ChatActions.getChatMessageTemplate();
	    }
	};
	ChatActions.addNotificationToChat = function (chatContainer, notificationMessage) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    if (args.length > 1) {
	        var builtMessage = $('<span>');
	        for (var i = 0; i < args.length; i++) {
	            builtMessage.append(args[i]);
	        }
	        notificationMessage = builtMessage;
	    }
	    if (chatContainer === null) {
	        chatContainer = ChatActions.getActiveChatContainer();
	        if (!chatContainer) {
	            return;
	        }
	    }
	    var updateMessage = ChatActions.getChatMessageTemplate();
	    updateMessage.addClass('chat_notification');
	    updateMessage.hide();
	    updateMessage.find('.username').remove();
	    var now = Math.round(new Date().getTime() / 1000);
	    updateMessage.find('.time').text(_DateFormat.DateFormat.hourMinutes(now)).data('timestamp', now);
	    updateMessage.find('.delete_holder').css('visibility', 'hidden');
	    updateMessage.find('.colon').remove();
	
	    var notificationWrapper = $('<span class="chat_notification_message">');
	    notificationWrapper.append(notificationMessage);
	    updateMessage.find('.message').html(notificationWrapper);
	    updateMessage.show();
	
	    ChatActions.addMessageToChat(chatContainer, updateMessage, null, true);
	
	    return updateMessage;
	};
	
	ChatActions.getActiveChatContainer = function () {
	    // var mainChats = $('#chat_tabs').find('.chat_tab.active').data('chat');
	    var mainChats;
	    var button = ChatActions.activeChatButton;
	    if (button) {
	        mainChats = button.data('chat');
	    } else {
	        mainChats = $();
	    }
	    if (mainChats && mainChats.length) {
	        return mainChats.data('chat');
	    } else {
	        return _Dashboard.Dashboard.mainChatHolderTemplate.data('chat');
	    }
	};
	
	ChatActions.getActiveChatContainerUserlist = function () {
	    var container = ChatActions.getActiveChatContainer();
	    if (container) {
	        return container.data('userlist');
	    }
	    return null;
	};
	
	ChatActions.updateChatMessage = function ($element, message, loadingAllMessages) {
	    loadingAllMessages = loadingAllMessages || false;
	
	    var chatContainer = $element.data('chatContainer');
	
	    $element.data('message', message);
	
	    var $sender = $element.find('.sender');
	    message.player = _matchmaking.Users.update(message.player);
	    if (!$element) return; //Bug workaround?!
	
	    var isModOfMessage = false;
	    var isMyMessage = myUser.id == message.player.id;
	
	    message.player.updateUserElements($sender);
	    // $sender.data('id',message.player.id);
	    // $sender.data('username',message.player.username);
	    message.is_chat_mod = message.player.is_chat_mod || message.is_chat_mod;
	    message.is_chat_admin = message.player.is_chat_admin || message.is_chat_admin;
	
	    if (message.player.username) {
	        $element.addClass('user_listed_' + message.player.username.toLowerCase());
	        $element.addClass('user_id_' + message.player.id);
	        $element.addClass('message_id_' + message.id);
	    }
	    if (message.player.is_birthday) {
	        $element.addClass('is_birthday');
	    }
	
	    if (chatContainer) {
	        if (isMyMessage) {
	            //Make sure I KNOW that I am a mod of this chat room
	            if (message.is_chat_mod) {
	                chatContainer.data('isChatMod', true);
	            }
	            if (message.is_chat_admin) {
	                chatContainer.data('isChatAdmin', true);
	            }
	        }
	        if (message.is_chat_mod) //To show that a particular user is mod of a chat room
	            {
	                $sender.add($element).addClass('is_chat_mod');
	                if (chatContainer.data('chat') && chatContainer.data('chat').data('name')) {
	                    $sender.attr('title', 'Is a moderator for ' + chatContainer.data('chat').data('name'));
	                }
	            }
	        if (message.is_chat_admin) {
	            if (chatContainer.data('chat') && chatContainer.data('chat').data('name')) {
	                $sender.attr('title', 'Is an admin for ' + chatContainer.data('chat').data('name'));
	            }
	            $sender.add($element).addClass('is_chat_admin');
	        }
	
	        if (myUser.is_mod || chatContainer.data('isChatMod') || chatContainer.data('isChatAdmin')) {
	            isModOfMessage = true;
	        }
	    }
	
	    _ElementUpdate.ElementUpdate.flair($sender, message.player);
	    _ElementUpdate.ElementUpdate.userTypes($sender.add($element), message.player);
	    $element.attr('title', '');
	
	    if (message.is_shadow_muted) {
	        if (isModOfMessage) {
	            $element.addClass('is_shadow_muted');
	            $element.data('shadowMuted', true);
	        } else {
	            if (message.player.id != myUser.id) {
	                if (myUser.is_shadow_muted || message.ip_id == myUser.ip_id && !IS_LOCALHOST) {} else {
	                    $element.remove();
	                    return false;
	                }
	            }
	        }
	    }
	    if (isModOfMessage || isMyMessage) {
	        $element.addClass('is_mod_of_message');
	    }
	    if (message.is_muted) {
	        if (isModOfMessage) {
	            if (ignoreList[message.player.id]) {
	                $element.addClass('is_ignored');
	            } else if (message.player.id != myUser.id) {
	                //$newElement.addClass('is_muted');
	                $element.remove();
	                return false;
	            } else {
	                $element.addClass('is_muted');
	            }
	        } else {
	            if (message.player.id != myUser.id) {
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
	    var clearStateMessages = function clearStateMessages(playerId) {
	        if (!chatContainer) {
	            return;
	        }
	        var previousElement = ChatActions.retrieveChatHolder(chatContainer).find('.state_message_' + playerId);
	        previousElement.remove();
	
	        if (!ChatActions.retrieveChatHolder(chatContainer).find('.stage_message').length) {
	            chatContainer.removeClass('has_state_messages');
	        }
	    };
	    if (message.state_message) {
	        if (message.player.id == myUser.id) {
	            return false;
	        }
	        chatContainer.addClass('has_state_messages');
	        var typing = message.state_message.typing;
	        $element.addClass('state_text_only').removeClass('normal_message');
	        $element.addClass('state_message_' + message.player.id + ' state_message');
	
	        if (typing) {
	            clearStateMessages(message.player.id);
	            messageText.text('is typing');
	        } else {
	            $element.remove(); //Destroy element, find previous
	            clearStateMessages(message.player.id);
	            return false;
	        }
	        $element.find('.delete_holder').remove();
	        $element.find('.time_holder').remove();
	        $element.find('.flairy_holder').remove();
	        $element.find('.time').remove();
	        $element.addClass('chat_notification');
	        var stateMessages = ChatActions.retrieveChatHolder(chatContainer).find('.state_messages');
	        if (!stateMessages.length) {
	            stateMessages = $('<div>').addClass('state_messages');
	            ChatActions.retrieveChatHolder(chatContainer).append(stateMessages);
	        }
	        $element.appendTo(stateMessages);
	        return;
	    } else {
	        if (message.deleted) {
	            $element.addClass('deleted');
	            messageText.addClass('deleted');
	            if (message.player.id == message.deleted_by) {
	                if (isModOfMessage && messageText.text()) {
	                    messageText.attr('title', messageText.text());
	                } else {
	                    messageText.text('...');
	                    messageText.text('Self_PikaCHEWED');
	                }
	            } else {
	                messageText.addClass('mod_deleted');
	                if (isModOfMessage && messageText.text()) {
	                    messageText.attr('title', messageText.text());
	                } else {
	                    messageText.text('message_pikaCHEWED');
	                }
	            }
	        } else {
	            clearStateMessages(message.player.id);
	            var messageContainer = messageText;
	            $element.removeClass('deleted');
	            messageText.removeClass('deleted');
	            messageText.removeClass('mod_deleted');
	
	            if (!message.is_muted || message.player.id == myUser.id) {
	                if (message.message && message.message.charAt(0) == '/') {
	                    var elementToUse = loadingAllMessages ? null : $element;
	                    var commandParser = new _TokensManager.TokensManager(message.message);
	                    var isMod = false;
	                    if (commandParser.command == 'all') {
	                        if (!ChatActions.chatContainerHasLadder(chatContainer) && message.isChatMod()) {
	                            _LadderLinker.LadderLinker.usernameFoundCallback(message.player.username, message, chatContainer, elementToUse, commandParser, !loadingAllMessages);
	                        } else {}
	                    } else {
	                        if (commandParser.command == 'mods') {
	                            if (chatContainer && !chatContainer.data('isChatMod') && !(message.player.id == myUser.id)) {
	                                return false;
	                            }
	                            _LadderLinker.LadderLinker.usernameFoundCallback(message.player.username, message, chatContainer, elementToUse, commandParser, !loadingAllMessages);
	                        }
	                    }
	                    if (commandParser.command == 'me') {
	                        $element.addClass('me_texted');
	                        message.message = commandParser.getMessage();
	                    }
	                }
	                messageContainer.html(_LadderLinker.LadderLinker.autolinkMessage(message, loadingAllMessages, $element.data('chatContainer'), $element));
	            } else {
	                messageContainer.text(message.message);
	            }
	        }
	        $element.find('.time').text(_DateFormat.DateFormat.hourMinutes(message.time)).attr('title', _DateFormat.DateFormat.full(message.time)).data('timestamp', message.time);
	    }
	    //		$element.find('input[name=message_id]').val(message.id);
	    $element.data('message_id', message.id);
	
	    if (!$element.data('hasEvents')) {
	        $element.data('isModOfMessage', isModOfMessage); //For Chat Holder event attachments
	        $element.data('hasEvents', true);
	    }
	
	    if (message.player.id == myUser.id) {
	        $element.addClass('is_me');
	    } else {
	        if (message.is_muted) {
	            return;
	            $element.addClass('is_muted');
	        }
	        if (loadingAllMessages) {} else {
	            if (BrowserHelper.isPhone) {} else {
	                //$element.fadeIn('fast');
	            }
	        }
	    }
	};
	
	ChatActions.sortUserList = function (userList) {
	    tinysort(userList, {
	        sortFunction: function sortFunction(a, b) {
	            a = $(a.elm);
	            b = $(b.elm);
	
	            var aData = a.data();
	            var bData = b.data();
	
	            //ALWAYS ON TOP
	            if (aData.user === myUser) return -1;
	            if (bData.user === myUser) return 1;
	
	            if (aData.user && bData.user && aData.user.location && bData.user.location && aData.user.location.distanceFromUser && bData.user.location.distanceFromUser && aData.user.location.distanceFromUser.distance && bData.user.location.distanceFromUser.distance) {
	                return aData.user.location.distanceFromUser.distance > bData.user.location.distanceFromUser.distance ? 1 : -1;
	            } else {}
	
	            return a.data('usernameLowercase') > b.data('usernameLowercase') ? 1 : -1;
	        }
	    });
	};
	
	ChatActions.updateChatsFromInfo = function (response, completeCallback, switchToChat) {
	    if (matchOnlyMode || !isInLadder) {
	        return;
	    }
	    var completeCalled = false;
	    if (!response.chat_rooms || !response.chat_rooms.chat_room) {
	        return;
	    }
	    var checkException = response.chat_rooms.initial_load;
	    var lowestOrder = null;
	    $.each(response.chat_rooms.chat_room, function (i, chat) {
	        var button;
	        if (!chatRooms[i]) {
	            if (!chat.id) {
	                return; //Not enough info to create a chat tab, so throw this away! (Might've closed tab and receieved a message before the server figured it out)
	            }
	            if (_Dashboard.Dashboard.waitForChat == i) //User JUST explicitly joined this chat room
	                {
	                    switchToChat = true;
	                }
	            if (checkException) {
	                if (lowestOrder === null || lowestOrder > chat.order) {
	                    switchToChat = true;
	                    lowestOrder = chat.order;
	                } else {
	                    switchToChat = false;
	                }
	            }
	            button = ChatActions.makeChatButton(chat, completeCallback, switchToChat);
	
	            completeCalled = true;
	            ChatActions.getChatTabs().tsort({ data: 'order', order: 'asc' });
	        }
	
	        var chatContainer = chatRooms[i];
	        if (!chatContainer) {
	            return;
	        }
	        chatContainer = chatContainer.find('.chat_container');
	
	        if (chat.loading_previous_messages) {
	            chatContainer.data('isPopulated', false); //So that notifications will not pop up
	        }
	
	        if (typeof chat.is_chat_mod != 'undefined') {
	            chatContainer.data('isChatMod', chat.is_chat_mod);
	        }
	        if (typeof chat.is_chat_admin != 'undefined') {
	            chatContainer.data('isChatAdmin', chat.is_chat_admin);
	        }
	        var isPopulated = chatContainer.data('isPopulated');
	        chatContainer.data('switchTo', switchToChat);
	        var newMessage = _Populate.Populate.chat(chat, chatContainer, !isPopulated);
	        chatContainer.data('loadingAllMessages', false); //set this flag to false after initial load
	        chat = chatContainer.data('chat');
	        button = chat.data('button');
	        if (newMessage && isPopulated) {
	            if (!button.hasClass('active')) {
	                button.addClass('has_new_messages');
	                ChatActions.setHasNewMessages(button);
	                $('#chat_selector').addClass('has_new_messages');
	            }
	        }
	        if (!isPopulated) {
	            button.trigger('afterPopulate');
	            button.off('afterPopulate');
	        }
	        if (!completeCalled && completeCallback) {
	            completeCallback();
	        }
	    });
	};
	ChatActions.hasNewMessagesCollection = new Map();
	
	ChatActions.scrollToBottom = function (chatInnerHolder) {
	    // let holder = ChatActions.retrieveChatHolder(chatInnerHolder);
	    chatInnerHolder.scrollTop(chatInnerHolder[0].scrollHeight);
	};
	ChatActions.retrieveChatHolder = function (chatInnerHolder) {
	    var outerContainer = chatInnerHolder.data('outerContainer');
	    if (!outerContainer) {
	        outerContainer = chatInnerHolder.closest('.chat_container_outer_holder');
	        chatInnerHolder.data('outerContainer', outerContainer);
	    }
	    return outerContainer;
	};
	ChatActions.applyHasNewMessagesClass = function (chatInnerHolder) {
	    chatInnerHolder.addClass('has_unseen_messages');
	    ChatActions.retrieveChatHolder(chatInnerHolder).addClass('has_unseen_messages');
	};
	ChatActions.removeHasNewMessagesClass = function (chatInnerHolder) {
	    chatInnerHolder.removeClass('has_unseen_messages');
	    ChatActions.retrieveChatHolder(chatInnerHolder).removeClass('has_unseen_messages');
	};
	ChatActions.setHasNewMessages = function (element) {
	    var id = element.data('chatInfo').id;
	    if (ChatActions.hasNewMessagesCollection.has(id)) {
	        return false;
	    } else {
	        ChatActions.hasNewMessagesCollection.set(id, true);
	        return true;
	    }
	};
	ChatActions.aChatHasNewMessages = function () {
	    return !!ChatActions.hasNewMessagesCollection.size;
	};
	ChatActions.removeHasNewMessages = function (element) {
	    ChatActions.hasNewMessagesCollection.delete(element.data('chatInfo').id);
	};
	
	ChatActions.setScrollTimer = function (container) {
	    if (container.data('scrollTimer')) {
	        return;
	    }
	    var timer = setTimeout(function () {
	        container.data('processScroll', true);
	        container.trigger('scroll');
	        container.data('scrollTimer', null);
	    }, 500);
	    container.data('scrollTimer', timer);
	};
	
	ChatActions.chatScroll = function (e) {
	    var container = $(this);
	    //TODO: use ChatMessages Object to determine whether or not messages have already been added
	    if (container.data('loadingPreviousMessages')) {
	        return;
	    }
	    if (!container.data('scrollTimer')) {
	        container.data('processScroll', true);
	        ChatActions.setScrollTimer(container);
	    }
	    if (container.data('processScroll') === true) {} else {
	        ChatActions.setScrollTimer(container);
	        return;
	    }
	    container.data('processScroll', false);
	
	    var scrollTop = container.scrollTop();
	    if (scrollTop < 240 && !container.data('loadedAll')) {
	        var firstMessage = container.find('.normal_message:first');
	        if (!firstMessage) {
	            return; //This chat has no messages anyway!
	        }
	        var currentChatPosition = null;
	        if (firstMessage && firstMessage.length) {
	            firstMessage = firstMessage.data('message_id');
	        } else {
	            firstMessage = null;
	        }
	        var data = {};
	        data.top_message = firstMessage;
	        if (container.hasClass('private')) {
	            var privateChatContainer = container.closest('.private_chat_area');
	            if (privateChatContainer.hasClass('loading')) {
	                return;
	            }
	            data.other_user_id = privateChatContainer.data('chat').data('player_id');
	        }
	        var start = function start() {
	            container.addClass('loading_previous_messages');
	            if (container.data('chat')) {
	                container.data('chat').addClass('loading_previous_messages');
	            }
	            if (privateChatContainer && privateChatContainer.data('chat') && privateChatContainer.data('chat').data('chatHolder')) {
	                privateChatContainer.data('chat').data('chatHolder').addClass('loading_previous_messages');
	            }
	            container.data('loadingPreviousMessages', true);
	        };
	        var finish = function finish() {
	            if (container.data('chat')) {
	                container.data('chat').removeClass('loading_previous_messages');
	            }
	            if (privateChatContainer && privateChatContainer.data('chat') && privateChatContainer.data('chat').data('chatHolder')) {
	                privateChatContainer.data('chat').data('chatHolder').removeClass('loading_previous_messages');
	            }
	            container.removeClass('loading_previous_messages');
	            container.data('loadingPreviousMessages', false);
	        };
	        start();
	        _Request.Request.send(data, 'previous_messages').done(function (response) {
	            ChatActions.loadPreviousMessages(container, response);
	            finish();
	        }).fail(function () {
	            finish();
	        });
	        return;
	    }
	
	    if (ChatActions.isScrolledToBottom(container)) {
	        container.removeClass('scrolled_up');
	        ChatActions.removeHasNewMessagesClass(container);
	        if (container.data('hasMore')) {
	            container.data('hasMore').remove();
	            container.data('hasMore', null);
	        }
	    } else {
	        if (container.data('addMessageScroll')) {
	            container.data('addMessageScroll', false);
	        } else {
	            container.addClass('scrolled_up');
	        }
	    }
	};
	ChatActions.testHasAllMessages = function (chatRoomArray, responseArray) {
	    var hasAllMessages = true;
	    $.each(responseArray, function (i, message) {
	        if (!chatRoomArray[i]) {
	            hasAllMessages = false;
	            return false;
	        }
	    });
	    return hasAllMessages;
	};
	ChatActions.loadPreviousMessages = function (container, response) {
	    if (response.loaded_all) {
	        container.data('loadedAll', true);
	        return;
	    }
	    if (response && response.success === false) {
	        container.data('loadedAll', true);
	        return;
	    }
	    var cutoff = container.scrollTop();
	    var hasUnseen = container.hasClass('has_unseen_messages');
	
	    var position = new _ScrollPosition.ScrollPosition(container[0]);
	    position.prepareFor('up');
	
	    if (container.hasClass('private')) {
	        if (ChatActions.testHasAllMessages(container.data('messages').items, response.private_chat.chat_messages)) {
	            container.data('loadedAll', true);
	            return;
	        }
	        _Populate.Populate.chat(response.private_chat, container);
	    } else {
	        //Verify messages do not all already exist
	        if (container.data('chat')) {
	            var chatRoomId = container.data('chat').data().chat_room_id;
	            if (response.chat_rooms && response.chat_rooms.chat_room[chatRoomId]) {
	                if (ChatActions.testHasAllMessages(container.data('messages').items, response.chat_rooms.chat_room[chatRoomId].chat_messages)) {
	                    container.data('loadedAll', true);
	                    return;
	                }
	            }
	        }
	
	        container.data('isPopulated', false);
	
	        ChatActions.updateChatsFromInfo(response, function () {});
	        container.data('isPopulated', true);
	    }
	    if (!hasUnseen) //There's currently no way to tell the container to not activate the unseen message indicator for newly loaded messages
	        {
	            ChatActions.removeHasNewMessagesClass(container);
	        }
	
	    position.restore();
	    container.data('loadingPreviousMessages', false);
	};
	ChatActions.isScrolledToBottom = function (element) {
	    var top = element.scrollTop();
	
	    var height = element.innerHeight();
	    var scrollHeight = element[0].scrollHeight;
	
	    return top + height >= scrollHeight - 10;
	};
	
	ChatActions.objectCache = {};
	
	ChatActions.chatHolderTemplate = null;
	ChatActions.getChatHolderTemplate = function () {
	    if (!ChatActions.chatHolderTemplate) {
	        ChatActions.chatHolderTemplate = _Dashboard.Dashboard.mainChatHolderTemplate.removeClass('active');
	    }
	    return ChatActions.chatHolderTemplate.clone().removeClass('active template_visible');
	};
	ChatActions.getChatUserlistTemplate = function () {
	    if (!ChatActions.chatUserlistTemplate) {
	        ChatActions.chatUserlistTemplate = _Dashboard.Dashboard.mainChatHolderTemplate.data('userlist');
	    }
	    return ChatActions.chatUserlistTemplate.clone().removeClass('active template_visible');
	};
	
	ChatActions.setUpChatTemplates = function () {
	    if (!ChatActions.objectCache.chatTabMover) {
	        ChatActions.objectCache.chatTabMover = $('#chat_tab_mover');
	        ChatActions.objectCache.chatGroups = $('#chat_groups');
	    }
	    if (!ChatActions.objectCache.chatTabTemplate) {
	        ChatActions.objectCache.chatTabTemplate = ChatActions.objectCache.chatGroups.find('.chat_tab.template').remove().removeClass('template');
	        _ChatRoom.ChatRoom.setChatTabTemplate(ChatActions.objectCache.chatTabTemplate.clone());
	    }
	
	    if (!ChatActions.objectCache.chatGroups.data('tabClickEventsActive')) {
	        ChatActions.objectCache.chatGroups.data('tabClickEventsActive', true);
	        ChatActions.objectCache.chatGroups.on('click', '.chat_tab:not(.control_tab)', function (e) {
	            e.preventDefault();
	            var button = $(this);
	            if (e.which == 2) {
	                ChatActions.leaveChatRoom(button.data('chat'));
	            } else {
	                ChatActions.changeMainChat(button);
	            }
	        }).on('click', '.create_chat', function () {
	            var chatPopup = $('.popups .create_chat_popup').clone();
	            _Dashboard.Dashboard.ladderPopup(chatPopup, 'Join Chat Room', {
	                buttons: [{
	                    text: 'Close',
	                    dismiss: true
	                }, {
	                    text: 'Join',
	                    dismiss: false,
	                    click: function click(popup) {
	                        ChatActions.joinChatRoom(chatPopup.find('input[name="name"]').val(), function (response) {
	                            if (response === true) {} else {}
	                            popup.dismiss();
	                        }, true);
	                    }
	                }]
	            });
	        });
	
	        ChatActions.objectCache.chatGroups.on('mentioned', '.chat_tab', function (e, by, where, $element) {
	            var button = $(this);
	            if (!button.hasClass('active')) {
	                button.addClass('you_were_mentioned');
	                button.find('.mentioned').attr('title', by + ' mentioned you in ' + where);
	            }
	        });
	    }
	};
	ChatActions.setUpChatTemplates();
	
	ChatActions.makeChatButton = function (chatInfo, completeCallback, switchToChat) {
	    if (chatRooms[chatInfo.id]) {
	        return chatRooms[chatInfo.id].data('button');
	    }
	    if (completeCallback) completeCallback(chatInfo);
	
	    if (!(chatInfo instanceof _ChatRoom.ChatRoom)) {
	        chatInfo = new _ChatRoom.ChatRoom(chatInfo);
	    }
	
	    var button = chatInfo.addToActiveList();
	
	    ChatActions.objectCache.chatTabMover.sortable({
	        axis: 'y',
	        tolerance: "pointer",
	        items: ".chat_tab",
	        update: function update(e, ui) {
	            var ul = $(ui.item).closest('.chat_tab_mover');
	            var elements = ul.find('.chat_tab').not('.template');
	            var ids = [];
	            elements.each(function () {
	                var element = $(this);
	                var chat = element.data('chat').data('chat_room_id');
	                ids.push(chat);
	            });
	            var data = { tab_ids: ids };
	            $.post(siteUrl + '/matchmaking/save_chat_tab_order', data);
	        }
	    });
	
	    var chat = ChatActions.getChatHolderTemplate();
	
	    chat.data('chat_room_id', chatInfo.id);
	    chat.data('name', chatInfo.name);
	
	    var userlist = ChatActions.getChatUserlistTemplate();
	    userlist.addClass(chatInfo.has_ladder ? 'has_ladder' : 'has_no_ladder');
	
	    chat.data('userlist', userlist);
	    var chatContainer = chat.find('.chat_container');
	    chatContainer.data('chat', chat);
	    chatContainer.data('userlist', userlist);
	
	    userlist.appendTo('.user_lists');
	    userlist.data('pendingUserlistLoad', chatInfo.userlist ? false : true);
	
	    userlist.on('retrieveUserlist', function () {
	        if (!_Dashboard.Dashboard.userlistIsVisible()) {
	            return;
	        }
	        var userlist = $(this);
	        if (userlist.data('loading') || !userlist.data('pendingUserlistLoad')) {
	            return;
	        }
	        userlist.data('loading', true);
	        userlist.addClass('loading');
	        $.post(siteUrl + '/matchmaking/retrieve_userlist', { id: chatInfo.id }, function (response) {
	
	            userlist.data('pendingUserlistLoad', true); //Set to false to block userlist reloading
	            userlist.removeClass('loading');
	
	            userlist.data('loadingAll', true);
	            _Dashboard.Dashboard.performOpenSearchUpdate(response);
	            userlist.data('loadingAll', false);
	        }).always(function () {
	            userlist.data('loading', false);
	        });
	    });
	    //userlist.hide();
	
	    button.data('chat', chat);
	
	    chat.data('button', button);
	    chat.data('chat', chatContainer);
	
	    //		chatContainer.scrollLock();
	    chatContainer.on('scroll', ChatActions.chatScroll);
	
	    if (typeof chatInfo.is_chat_mod != 'undefined') {
	        chatContainer.data('isChatMod', chatInfo.is_chat_mod);
	    }
	    if (typeof chatInfo.is_chat_admin != 'undefined') {
	        chatContainer.data('isChatAdmin', chatInfo.is_chat_admin);
	    }
	
	    var chatRoomDescription = chat.find('.chat_room_description');
	    button.on('afterPopulate', function (e) {
	        chatRoomDescription.data('descriptionId', chatInfo.description_id);
	        chatRoomDescription.data('chatRoomId', chatInfo.id);
	        if (chatInfo.description) {
	            chatRoomDescription.find('.description_message').html(chatInfo.description);
	        } else {
	            chatRoomDescription.hide();
	        }
	        var chatRooms = _Ladder.ladderLocalStorage.getItem('chat_rooms');
	        if (chatRooms && chatRooms.chats && chatRooms.chats[chatInfo.id] && chatRooms.chats[chatInfo.id].last_motd_id == chatInfo.description_id && chatRooms.chats[chatInfo.id].last_motd_times_closed > 0) {
	            chatRoomDescription.hide();
	        }
	        chat.find('.chat_name_overlay .chat_name').text(chatInfo.name);
	    });
	
	    chat.appendTo('#main_chat_area');
	    chatRooms[chatInfo.id] = chat;
	    chatRoomNames[chatInfo.name.toLowerCase()] = chat;
	    if (switchToChat || chatInfo.id == preferredChat) {
	        ChatActions.changeMainChat(button);
	    }
	    chat.find('.send_chat_button').prop('disabled', false);
	    var chatInput = chat.findCache('.chat_input'); //.elastic();
	    chatInput.attr('placeholder', 'Message ' + chatInfo.name);
	    chat.data('chatInput', chatInput);
	    chatContainer.data('chatInput', chatInput);
	    chatInput.prop('disabled', false);
	
	    button.data('ChatMessages', new _ChatMessages.ChatMessages(chatContainer));
	
	    return button;
	};
	ChatActions.getAllMainChatHolders = function () {
	    return $('#main_chat_area').find('.chat_holder');
	};
	ChatActions.changeMainChatRight = function () {
	    var next = ChatActions.objectCache.chatGroups.find('.chat_tab.active').nextAll('.chat_tab').not('.create_chat').first();
	    if (!next.length || next.hasClass('template')) {
	        next = ChatActions.objectCache.chatGroups.find('.chat_tab:not(.control_tab)').first();
	    }
	
	    if (next.length) {
	        ChatActions.changeMainChat(next);
	    }
	};
	ChatActions.changeMainChatLeft = function () {
	    var next = ChatActions.objectCache.chatGroups.find('.chat_tab.active').prevAll('.chat_tab').not('.create_chat').first();
	    if (!next.length || next.hasClass('template')) {
	        next = ChatActions.objectCache.chatGroups.find('.chat_tab:not(.control_tab)').last();
	    }
	    if (next.length) {
	        ChatActions.changeMainChat(next);
	    }
	};
	ChatActions.attachChatInputActions = function () {
	    _Dashboard.Dashboard.mainChatArea.data('chatInputEvents', true);
	    _Dashboard.Dashboard.mainChatArea.on('keydown', '.chat_input', function (e) {
	        var chatInput = $(this);
	        if (e.which == _Dashboard.Dashboard.keyCodes.TAB) {
	            e.preventDefault();
	            if (chatInput.data('autocompleteUsed')) {
	                chatInput.data('autocompleteUsed', false);
	                return;
	            }
	            if (e.shiftKey) {
	                return ChatActions.changeMainChatLeft();
	            } else {
	                return ChatActions.changeMainChatRight();
	            }
	        }
	    }).on('focus', '.chat_input', function (e) {
	        $('#bottom_dock').addClass('main_chat_focused');
	    }).on('blur', '.chat_input', function (e) {
	        $('#bottom_dock').removeClass('main_chat_focused');
	    });
	    ChatActions.attachUniversalChatActions(_Dashboard.Dashboard.mainChatArea);
	};
	ChatActions.attachUniversalChatActions = function (element) {
	    element.on('click', '.send_chat_button', function (e) {
	        ChatActions.sendChat($(this));
	    }).on('click', '.unseen_messages_popup', function (e) {
	        var chatContainer = $(this).closest('.chat_container_outer_holder').find('.chat_container');
	        ChatActions.scrollToBottom(chatContainer);
	    }).on('keypress', '.chat_input', function (e) {
	        if (e.which == 13) {
	            e.preventDefault();
	            ChatActions.sendChat($(this));
	        }
	    });
	};
	ChatActions.previousActiveChatContainer = null;
	ChatActions.changeMainChat = function (button) {
	    var chat = button.data('chat');
	    _Dashboard.Dashboard.body.removeClass('sidebar-open');
	    ChatActions.previousActiveChatContainer = ChatActions.getActiveChatContainer();
	    var previousActiveChatTab = ChatActions.getPreviousActiveChatTab();
	    if (previousActiveChatTab.length && previousActiveChatTab.data('chat') && previousActiveChatTab.data('chat').length && chat && chat.length && previousActiveChatTab.data('chat')[0] === chat[0]) {
	        ChatActions.previousActiveChatContainer = null;
	    } else {}
	
	    if (!chat) {
	        return;
	    }
	
	    ChatActions.activeChatButton = button;
	
	    var chatSelect = $('#chat_select');
	    var mobileChatSelector = $('#chat_selector');
	
	    button.removeClass('you_were_mentioned has_new_messages');
	    button.addClass('active');
	    chat.addClass('active');
	
	    if (!_Dashboard.Dashboard.mainChatArea.data('chatInputEvents')) {
	        ChatActions.attachChatInputActions();
	    } else {
	        //Switch to chat view... This is to prevent initial change from changing the tab
	        if (!_Dashboard.Dashboard.chatsTab.hasClass('active')) {
	            _Dashboard.Dashboard.chatsTab.trigger('activate');
	        }
	    }
	
	    if (ChatActions.previousActiveChatContainer) {
	        ChatActions.previousActiveChatContainer.each(function (i, otherChat) {
	            otherChat = $(otherChat);
	            otherChat.removeClass('active');
	        });
	    }
	
	    var activeRegionButton = _Dashboard.Dashboard.getActiveRegionButton();
	    var keepCurrentListVisible = false;
	    if (activeRegionButton.length && activeRegionButton.hasClass('fake_region_list_button')) {
	        keepCurrentListVisible = true;
	    }
	    var userlist = ChatActions.switchToChatUserlist(button, keepCurrentListVisible);
	
	    ChatActions.removeHasNewMessages(button);
	
	    if (!ChatActions.aChatHasNewMessages()) {
	        mobileChatSelector.removeClass('has_new_messages');
	    }
	
	    var chatRoomDescription = chat.findCache('.chat_room_description').removeClass('shown');
	    var chatOverlay = chat.findCache('.chat_name_overlay').removeClass('done');
	    setTimeout(function () {
	        chatOverlay.addClass('done');
	        chatRoomDescription.addClass('shown');
	    }, 1200);
	
	    ChatActions.resizeUserlists();
	    var chatInput = chat.findCache('.chat_input');
	    chatInput.addClass('chat_autocomplete');
	    if (BrowserHelper.isPhone) {} else {
	        chatInput.trigger('focus');
	    }
	
	    chatInput.data('chatContainer', chat.data('chat'));
	    var holder = chat.data('chat');
	    $('#user_list_information').data('countElement').text(chat.data('userlist').data('users'));
	    if (holder && holder.data('isIrc') && holder.data('reveal')) {
	        holder.data('reveal')();
	    } else {
	        if (button.data('waitingMention') && button.data('waitingMention').length) {} else if (holder) {
	            ChatActions.scrollToBottom(holder);
	        }
	    }
	    var settingsAdmin = $('#chat_settings_admin');
	    var chatData = chat.data('chat');
	    chatSelect.text(chat.data('name'));
	
	    if (!chatData) {
	        settingsAdmin.hide();
	        return;
	    }
	
	    if (chatData.data('isChatMod') || chatData.data('isChatAdmin')) {
	        settingsAdmin.show();
	    } else {
	        settingsAdmin.hide();
	    }
	
	    settingsAdmin.attr('href', siteUrl + '/chats/edit/' + button.data('chat').data('chat_room_id'));
	    ChatActions.chatFocus(button.data('chat').data('chat_room_id'));
	    if (chat.hasClass('loading')) {
	        ChatActions.getChatMessages(button.data('chat').data('chat_room_id'));
	    }
	};
	ChatActions.chatFocus = function (chatId, socketOnly) {
	    _Dashboard.Dashboard.serverConnection.send({ action: 'chat_focus', data: {
	            id: chatId,
	            userlist_visible: _Dashboard.Dashboard.userlistIsVisible()
	        } });
	    if (!socketOnly) {
	        _Request.Request.send({ id: chatId }, 'chat_focus');
	    }
	};
	
	ChatActions.autoCompleteCache = null;
	var availableTags = function availableTags(sublistOfPresortedChatters) {
	    if (ChatActions.autoCompleteCache) {
	        return ChatActions.autoCompleteCache;
	    }
	    var autocompleteList = [];
	    function sortObject(obj) {
	        var arr = [];
	        for (var id in obj) {
	            arr.push(obj[id]);
	        }
	        arr.sort(function (a, b) {
	            return a.username > b.username;
	        });
	        //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
	        return arr; // returns array
	    }
	    var usersToIgnore = {};
	    $.each(sublistOfPresortedChatters, function (i, player) {
	        usersToIgnore[player.id] = player;
	        ChatActions.addAutocompleteElementsForUser(autocompleteList, player);
	    });
	    var compiledList = sortObject(_matchmaking.Users.list);
	    $.each(compiledList, function (id, player) {
	        if (usersToIgnore[player.id]) {
	            return;
	        }
	        ChatActions.addAutocompleteElementsForUser(autocompleteList, player);
	    });
	    ChatActions.autoCompleteCache = autocompleteList;
	    return autocompleteList;
	};
	
	ChatActions.switchToChatUserlist = function (button, keepCurrentListVisible) {
	    var chat = button.data('chat');
	    var activeUserlist = chat.data('userlist');
	    var previousActiveChat = ChatActions.getPreviousActiveChatContainer();
	    if (previousActiveChat) {
	        previousActiveChat.each(function (i, previousChat) {
	            previousChat = $(previousChat);
	            button = previousChat.data('button');
	            button = $(button);
	            previousChat.removeClass('active');
	            button.removeClass('active');
	            if (button.data('option_select')) {
	                button.data('option_select').removeClass('active');
	            }
	
	            if (!keepCurrentListVisible) {
	                previousChat.data('userlist').removeClass('active');
	            }
	        });
	    } else {}
	    if (!keepCurrentListVisible) {
	        var userlist = chat.data('userlist').addClass('active');
	        if (userlist.data('refreshSoon')) {
	            userlist.data('refreshSoon')(100);
	        }
	    }
	    if (activeUserlist.data('pendingUserlistLoad')) {
	        activeUserlist.trigger('retrieveUserlist');
	    }
	
	    return activeUserlist;
	};
	
	ChatActions.getChatTabs = function () {
	    return $('#chat_groups').find('.chat_tab_mover .chat_tab');
	};
	
	ChatActions.getPreviousActiveChatContainer = function () {
	    var chat = ChatActions.previousActiveChatContainer;
	    if (chat) {
	        if (chat.data('chat')) {
	            return chat.data('chat');
	        }
	        return $();
	    }
	};
	ChatActions.getPreviousActiveChatTab = function () {
	    var chat = ChatActions.previousActiveChatContainer;
	    if (chat) {
	        if (chat.data('chat') && chat.data('chat').data('button')) {
	            return chat.data('chat').data('button');
	        }
	        return $();
	    }
	};
	ChatActions.getActiveChatTab = function () {
	    var chat = ChatActions.getActiveChatContainer();
	    if (chat.data('chat') && chat.data('chat').data('button')) {
	        return chat.data('chat').data('button');
	    }
	    //No active tabs... just make a dummy tab
	    return $();
	};
	
	ChatActions.activeChatButton = null;
	
	ChatActions.calculateWindowHeight = function () {
	    var dashboard = _Dashboard.Dashboard.dashboard;
	
	    _Dashboard.Dashboard.CHAT_INPUT_OFFSET = 35;
	    _Dashboard.Dashboard.TAB_CONTAINER_OFFSET = 142;
	    _Dashboard.Dashboard.HIDE_TAB_CONTAINER_HEIGHT = -200;
	
	    var windowElement = $(window);
	    var windowHeight = windowElement.height();
	    var windowWidth = windowElement.width();
	
	    windowHeight = windowHeight - 184; //Extra space
	
	    _Dashboard.Dashboard.CHAT_INPUT_OFFSET = 35;
	    _Dashboard.Dashboard.TAB_CONTAINER_OFFSET = 142;
	    _Dashboard.Dashboard.HIDE_TAB_CONTAINER_HEIGHT = -200;
	
	    dashboard = dashboard.add(_Dashboard.Dashboard.body);
	
	    if (windowWidth >= 1200) {
	        dashboard.addClass('dashboard-lg dashboard-md dashboard-sm dashboard-xs');
	        _Dashboard.Dashboard.userlistSide.removeClass('toggleable');
	    } else if (windowWidth >= 992) {
	        dashboard.addClass('dashboard-md dashboard-sm dashboard-xs');
	        dashboard.removeClass('dashboard-lg');
	        _Dashboard.Dashboard.userlistSide.removeClass('toggleable');
	    } else if (windowWidth >= 768) {
	        dashboard.addClass('dashboard-sm dashboard-xs');
	        dashboard.removeClass('dashboard-lg dashboard-md');
	        _Dashboard.Dashboard.userlistSide.addClass('toggleable');
	    } else {
	        dashboard.addClass('dashboard-xs');
	        dashboard.removeClass('dashboard-lg dashboard-md dashboard-sm');
	        _Dashboard.Dashboard.userlistSide.addClass('toggleable');
	    }
	
	    if (dashboard.hasClass('dashboard-md')) {
	        ChatActions.repositionChatTabs('#chat_tabs');
	    } else {
	        ChatActions.repositionChatTabs('#sidebar');
	    }
	
	    if (dashboard.hasClass('dashboard-sm')) {
	        windowHeight = windowHeight - 32; //MORE PADDING FOR TALL WINDOWS
	    } else {
	            windowHeight = windowHeight + 0;
	        }
	
	    if (windowHeight < _Dashboard.Dashboard.HIDE_TAB_CONTAINER_HEIGHT) {
	        _Dashboard.Dashboard.body.addClass('dashboard-short');
	    } else {
	        _Dashboard.Dashboard.body.removeClass('dashboard-short');
	    }
	    return ChatActions.lastWindowHeightValue = windowHeight;
	};
	ChatActions.repositionChatTabs = function (location) {
	    var chatGroups = $('#chat_groups');
	    if (chatGroups.data('sittingOn') != location) {
	        chatGroups.data('sittingOn', location);
	        chatGroups.appendTo(location);
	    }
	};
	ChatActions.lastWindowHeightValue = null;
	ChatActions.lastWindowHeight = function () {
	    if (ChatActions.lastWindowHeightValue !== null) {
	        return ChatActions.lastWindowHeightValue;
	    }
	    return ChatActions.calculateWindowHeight();
	};
	ChatActions.resizeUserlists = function () {
	
	    var windowHeight = ChatActions.lastWindowHeight();
	    var mainChats = ChatActions.getActiveChatContainer(); //Optimized by cache
	    if (!mainChats) {
	        mainChats = $();
	    }
	    if (!_Dashboard.Dashboard.otherUserLists) {
	        _Dashboard.Dashboard.otherUserLists = $();
	    }
	    var userlist = _Dashboard.Dashboard.otherUserLists.add(mainChats.data('userlist'));
	    if (!_Dashboard.Dashboard.midsideContainer.hasClass('flex') && userlist) {
	        userlist.each(function () {
	            var newHeight;
	            if (windowHeight < _Dashboard.Dashboard.HIDE_TAB_CONTAINER_HEIGHT) {
	                newHeight = windowHeight + _Dashboard.Dashboard.TAB_CONTAINER_OFFSET;
	            } else {
	                newHeight = windowHeight;
	            }
	            $(this).css('height', newHeight + _Dashboard.Dashboard.CHAT_INPUT_OFFSET - 230);
	        });
	    }
	};
	ChatActions.resizeMainChats = function () {
	    var windowHeight = ChatActions.calculateWindowHeight();
	
	    var mainChats = ChatActions.getActiveChatContainer(); //Optimized by cache
	    if (!mainChats) {
	        return;
	    }
	    mainChats.each(function () {
	        // alert('resizing a chat');
	        var newHeight;
	        if (windowHeight < _Dashboard.Dashboard.HIDE_TAB_CONTAINER_HEIGHT) {
	            newHeight = windowHeight + _Dashboard.Dashboard.TAB_CONTAINER_OFFSET;
	        } else {
	            newHeight = windowHeight;
	        }
	        var chat = $(this);
	        // chat.css('height',newHeight);
	        var input = chat.data('chatInput');
	        var chatWindow = chat.data('chat').data('chat');
	        ChatActions.scrollToBottom(chatWindow);
	        if (input && input.length && input.is(':focus')) {
	            input.focus();
	            input.click();
	        }
	    });
	};
	ChatActions.resizeOpenChats = function (specialContainer) {
	    var windowHeight = ChatActions.lastWindowHeight();
	
	    ChatActions.resizeMainChats();
	    ChatActions.resizeUserlists();
	
	    if (specialContainer) {
	        specialContainer.css('height', windowHeight);
	    }
	
	    if (_Dashboard.Dashboard.userInfoTab.hasClass('active')) {
	        $('#user_info_pane').css('height', windowHeight + 86);
	    }
	
	    var dashboard = _Dashboard.Dashboard.dashboard;
	    if (_Dashboard.Dashboard.directChatsTab.hasClass('active')) {
	        var privateChatHolder = $('#big_private_chat').find('.chat_holder').add('#tab-pane-direct_messages .active_chats');
	        privateChatHolder.each(function () {
	            var newHeight;
	            if (windowHeight < _Dashboard.Dashboard.HIDE_TAB_CONTAINER_HEIGHT) {
	                newHeight = windowHeight + _Dashboard.Dashboard.TAB_CONTAINER_OFFSET;
	            } else {
	                newHeight = windowHeight;
	                if (dashboard.hasClass('dashboard-sm')) {
	                    newHeight += 56;
	                } else {
	                    newHeight += 108;
	                }
	            }
	            var chat = $(this);
	            // chat.css('height',newHeight - 24);
	            var chatWindow = chat.data('chat');
	
	            if (chatWindow) {
	                ChatActions.scrollToBottom(chatWindow);
	            }
	            var container = chat.find('.chat_container');
	            if (container.length) {
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
	
	ChatActions.getRecentChattersSorted = function (messageList) {
	    var messages = messageList;
	    var playerList = {};
	    var sortedList = [];
	    var reversedMessages = [];
	    $.each(messages, function (i, message) {
	        reversedMessages.unshift(message);
	    });
	    $.each(reversedMessages, function (i, message) {
	        var messageData = message.data;
	        if (!messageData) {
	            return;
	        }
	        if (!messageData.player) {
	            return;
	        }
	        if (playerList[messageData.player.id]) {
	            return;
	        }
	        if (messageData.player.id == myUser.id) {
	            return;
	        }
	        if (!(messageData.player instanceof _User.User)) {
	            messageData.player = _matchmaking.Users.update(messageData.player);
	        }
	        messageList[messageData.id].data.player = messageData.player; //Update original
	        playerList[messageData.player.id] = messageData.player;
	        sortedList.push(messageData.player);
	    });
	    return sortedList;
	};
	
	ChatActions.spaceIsAfterTerm = function (termIndex, string) {
	    return string.lastIndexOf(' ') > termIndex;
	};
	
	ChatActions.chatAutocompleteOptions = {
	    html: true,
	    delay: 50,
	    autoFocus: true,
	    minLength: 0,
	    source: function source(request, response) {
	        var term = request.term,
	            results = [];
	
	        var triggerIndex;
	        var matcher;
	        var list;
	        if (!term.length) {
	            response();
	            return;
	        }
	
	        triggerIndex = term.lastIndexOf('*');
	        if (triggerIndex >= 0 && !ChatActions.spaceIsAfterTerm(triggerIndex, term)) {
	            term = request.term.split(/(\s+)/).pop();
	            matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
	
	            response($.grep(_LadderLinker.LadderLinker.getEmoteShortcuts(), function (item) {
	                return matcher.test(item.value);
	            }));
	            return;
	        }
	
	        triggerIndex = term.lastIndexOf('::');
	        if (triggerIndex >= 0 && !ChatActions.spaceIsAfterTerm(triggerIndex, term)) {
	            term = request.term.split(/(\s+)/).pop();
	
	            matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
	            response($.grep(_LadderLinker.LadderLinker.getGuideShortcuts(), function (item) {
	                return matcher.test(item);
	            }));
	            return;
	        }
	
	        triggerIndex = term.lastIndexOf('@');
	        if (triggerIndex >= 0 && !ChatActions.spaceIsAfterTerm(triggerIndex, term)) {
	            var chatContainer = this.element.data('chatContainer');
	            var chatters = [];
	            if (chatContainer.data('messages') && chatContainer.data('messages').items) {
	                chatters = ChatActions.getRecentChattersSorted(chatContainer.data('messages').items);
	            }
	            term = _StringHelpers.StringHelpers.extractLast(request.term);
	            if (term.length > 0) {
	                matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
	                response($.grep(availableTags(chatters), function (item) {
	                    return matcher.test(item.searchValue);
	                }));
	                return;
	            } else {
	                var autocompleteList = [];
	                $.each(chatters, function (i, player) {
	                    ChatActions.addAutocompleteElementsForUser(autocompleteList, player);
	                });
	                return response(autocompleteList);
	            }
	        }
	        response();
	        return;
	    },
	    open: function open(event, ui) {
	        var $input = $(event.target);
	        $input.data('autocompleteOpen', true);
	        var $results = $input.autocomplete("widget");
	        var scrollTop = $(window).scrollTop();
	        var top = $results.position().top;
	        var height = $results.outerHeight();
	        if (true) {
	            var newTop = top - height - $input.outerHeight();
	            if (newTop > scrollTop) $results.css("top", newTop + "px");
	        }
	    },
	    focus: function focus(event, ui) {
	        if (!ui.item || !ui.item.isUsername) {
	            return false;
	        }
	        if (ui.item && ui.item.value) {
	            ChatActions.highlightUsernameInChats(ui.item.value);
	        } else {
	            ChatActions.removeUsernameHighlightInChat(true);
	        }
	        // prevent value inserted on focus
	        return false;
	    },
	    close: function close(event, ui) {
	        $(event.target).data('autocompleteOpen', false);
	        $(event.target).data('autocompleteUsed', true);
	        ChatActions.removeUsernameHighlightInChat(true);
	    },
	    select: function select(event, ui) {
	        var terms = this.value.split(" ");
	        // remove the current input
	        terms.pop();
	        // add the selected item
	        if (ui.item.isUsername) {
	            terms.push("@" + ui.item.value);
	        } else {
	            terms.push(ui.item.value);
	        }
	        // add placeholder to get the comma-and-space at the end
	
	        var input = $(this);
	        input.val(terms.join(' ') + " ");
	
	        input.focus().trigger('focus');;
	        input.trigger('keypress');
	        $.event.trigger({ type: 'keypress' });
	
	        return false;
	    }
	};
	ChatActions.sendChatState = function ($input) {
	    var isTyping = $input.data('typing');
	    var chatHolder = $input.closest('.chat_holder');
	    var chatInput = $input;
	    var chatContainer = chatHolder.find('.chat_container');
	
	    var match_id = $input.closest('.private_chat_area').find('input[name=match_id]').val();
	    var to_user_id = $input.closest('.private_chat_area').find('input[name=to_user_id]').val();
	
	    var chat_room_id = null;
	    if (chatHolder.data('chat_room_id')) {
	        chat_room_id = chatHolder.data('chat_room_id');
	    }
	    if (!chatHolder.data('send_id')) {
	        chatHolder.data('send_id', 1);
	    }
	    chatHolder.data('send_id', chatHolder.data('send_id') + 1);
	
	    var data = { chat_room_id: chat_room_id,
	        to_user_id: to_user_id,
	        match_id: match_id,
	        is_typing: chatInput.data('typing') ? 1 : 0
	    };
	
	    _Request.Request.send(data, 'update_chat_state', function (response) {});
	};
	
	ChatActions.exitCurrentChat = function () {
	    ChatActions.leaveChatRoom(ChatActions.getActiveChatTab().data('chat'));
	};
	
	ChatActions.leaveChatRoom = function (chat) {
	    chat = $(chat);
	    var data = { chat_room_id: chat.data('chat_room_id') };
	    var button = $(chat.data('button'));
	
	    $('#chat_select').find('option[value=' + data.chat_room_id + ']').remove();
	    if (button.hasClass('active')) {
	        var prevButton = button.prevAll('.chat_tab').not('.create_chat, .template').first();
	        if (prevButton.length) {
	            prevButton.trigger('click');
	        } else {
	            var aChat = $('#chat_tabs').find('.chat_tab').not('.template').not(button).not('.control_tab').first();
	            if (aChat.length) {
	                aChat.click();
	            } else {
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
	
	    _Request.Request.send(data, 'leave_chat');
	};
	
	ChatActions.chatContainerHasLadder = function (chatContainer) {
	    if (!chatContainer) {
	        return null;
	    }
	    return chatContainer && chatContainer.data('chat') && chatContainer.data('chat').data('button') && chatContainer.data('chat').data('button').data('has_ladder');
	};
	ChatActions.getChatMessages = function (chatRoomId) {
	    var data = {};
	    if (chatRoomId) {
	        data.chat_room_id = chatRoomId;
	        var chatRoomElement = chatRooms[chatRoomId];
	        if (chatRoomElement) {
	            if (chatRoomElement.data('loading_beginning_state')) {
	                return;
	            }
	            chatRoomElement.data('loading_beginning_state', true);
	        }
	    }
	    return _Request.Request.send(data, 'get_chat_messages', function (response) {
	        if (chatRoomElement && chatRoomElement.data('loading_beginning_state')) {
	            chatRoomElement.data('loading_beginning_state', false);
	        }
	        if (!response.chat_rooms) {
	            return;
	        }
	
	        var chatRooms = response.chat_rooms;
	        delete response.chat_rooms;
	
	        var timeout = 0;
	        var orderedChats = [];
	
	        for (var chatRoom in chatRooms.chat_room) {
	            chatRoom = chatRooms.chat_room[chatRoom];
	            orderedChats.push(chatRoom);
	        }
	
	        orderedChats.sort(function (a, b) {
	            if (a.last_active) {
	                return -1;
	            }
	            if (b.last_active) {
	                return 1;
	            }
	            return a.order > b.order ? 1 : -1;
	        });
	
	        $.each(orderedChats, function (index, chat_room) {
	            var i = chat_room.id;
	            var chatRoomObject = {};
	            chatRoomObject[i] = chat_room;
	            var chatMessages = chat_room.chat_messages;
	            // delete chatRoomObject[i].chat_messages;
	            // Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room: chatRoomObject}}); //Loads with no messages
	            ChatActions.setChatLoadingState(i, true);
	
	            setTimeout(function () {
	                ChatActions.setChatLoadingState(i, false);
	                chatRoomObject[i].chat_messages = chatMessages;
	                chatRoomObject[i].loading_previous_messages = true;
	                _Dashboard.Dashboard.performOpenSearchUpdate({ chat_rooms: { chat_room: chatRoomObject } });
	            }, timeout);
	            timeout += 1000;
	        });
	
	        var activeChat = ChatActions.getActiveChatContainer();
	    });
	};
	ChatActions.setChatLoadingState = function (id, state) {
	    if (state) {
	        chatRooms[id] ? chatRooms[id].addClass('loading beginning_state') : null;
	    } else {
	        chatRooms[id] ? chatRooms[id].removeClass('loading beginning_state') : null;
	    }
	    if (chatRooms[id]) {
	        return chatRooms[id];
	    } else {
	        return $();
	    }
	};
	ChatActions.joinChatRoom = function (name, completeCallback, switchToChat, isIrc) {
	    if (!name) {
	        return false;
	    }
	    name = String(name);
	    var data = { name: name, is_irc: name.substring(0, 1) == '#' ? 1 : 0 };
	    if (chatRoomNames[name.toLowerCase()]) {
	        var chat = chatRoomNames[name.toLowerCase()];
	        var button = chat.data('button');
	        // button.insertAfter($('#main_chat_button'));
	        button.trigger('click');
	        if (completeCallback) {
	            completeCallback(true);
	        }
	        return;
	    }
	    _Request.Request.send(data, 'join_chat', function (response) {
	        if (completeCallback) {
	            completeCallback(response);
	        }
	        if (response.success) {
	            _Dashboard.Dashboard.waitForChat = response.chat_id;
	            return true;
	        } else {
	            alert('Could not join that room!');
	            return false;
	        }
	    });
	};
	
	ChatActions.highlightUsernameInChats = function (username) {
	    if (typeof username !== 'string') {
	        return;
	    }
	    var currentChat;
	    if (!isInLadder) {
	        currentChat = $(document);
	    } else {
	        currentChat = ChatActions.getActiveChatContainer();
	    }
	    username = username.toLowerCase();
	    if (!currentChat || !currentChat.length) {
	        return;
	    }
	    currentChat.find('.chat_message.user_listed_' + username).addClass('hover_highlight');
	};
	ChatActions.retrieveUserElementFromId = function (id, backupUsername) {
	    var theUser = _matchmaking.Users.findById(id);
	    var element;
	    if (theUser) {
	        element = theUser.createUsernameElement();
	    } else {
	        element = $('<span>').addClass('username').text(backupUsername);
	    }
	    return element;
	};
	ChatActions.inviteErrorMessageGenerator = function (invitee, inviteData, chatTarget) {
	    var usernameElement = ChatActions.retrieveUserElementFromId(inviteData.player_id, inviteData.username);
	    if (!chatTarget) {
	        chatTarget = null;
	    }
	    var errorTypes = {
	        player_no_exist: function player_no_exist() {
	            ChatActions.addNotificationToChat(chatTarget, usernameElement, ' does not exist.');
	        },
	        no_permission: function no_permission() {
	            ChatActions.addNotificationToChat(chatTarget, 'You do not have permission to invite ', usernameElement, ' to this chat.');
	        },
	        already_invited: function already_invited() {
	            ChatActions.addNotificationToChat(chatTarget, usernameElement, ' is already invited.');
	        },
	        in_there: function in_there() {
	            ChatActions.addNotificationToChat(chatTarget, usernameElement, ' has already joined this chat.');
	        }
	    };
	    if (errorTypes[inviteData.error_type]) {
	        errorTypes[inviteData.error_type]();
	    } else {
	        ChatActions.addNotificationToChat(chatTarget, inviteData.error);
	    }
	};
	
	ChatActions.removeUsernameHighlightInChat = function (username) {
	    var currentChat;
	    if (!isInLadder) {
	        currentChat = $(document);
	    } else {
	        currentChat = ChatActions.getActiveChatContainer();
	    }
	    if (!currentChat || !currentChat.length) {
	        return;
	    }
	    if (username === true) {
	        currentChat.find('.chat_message').removeClass('hover_highlight');
	    } else if (typeof username === 'string') {
	        username = username.toLowerCase();
	        currentChat.find('.chat_message.user_listed_' + username).removeClass('hover_highlight');
	    }
	};
	
	$.fn.autolinkerDefault = function () {
	
	    return $(this).each(function () {
	        var input = $(this);
	        var result = Autolinker.link(input.html(), _LadderLinker.LadderLinker.autolinkerOptions);
	        input.html(result);
	    });
	};
	
	$.fn.usernameAutocompleteMod = function (extraData) {
	    return $(this).each(function () {
	        var options = $.extend({}, usernameAutocompleteModOptions, extraData);
	        $(this).autocomplete(options);
	    });
	};
	$.fn.usernameAutocomplete = function (extraData) {
	    return $(this).each(function () {
	        var options = $.extend({}, usernameAutocompleteOptions, extraData);
	        $(this).autocomplete(options);
	    });
	};
	
	var usernameAutocompleteModOptions = {
	    html: true,
	    source: function source(request, response) {
	        $.get(siteUrl + '/search', {
	            autocomplete: 1,
	            json: 1,
	            search: request.term,
	            banned_users: 1
	        }, function (result) {
	            var autocompleteList = [];
	            $.each(result.users, function (i, user) {
	                user = _matchmaking.Users.update(user);
	                ChatActions.addAutocompleteElementsForUser(autocompleteList, user);
	            });
	            response(autocompleteList);
	        }).error(function () {});
	    },
	    minLength: 1,
	    select: function select(event, ui) {
	        $(this).val(ui.item.value);
	    }
	};
	var usernameAutocompleteOptions = {
	    source: function source(request, response) {
	        $.get(siteUrl + '/search', {
	            autocomplete: 1,
	            json: 1,
	            search: request.term
	        }, function (result) {
	            var autocompleteList = [];
	            $.each(result.users, function (i, user) {
	                user = _matchmaking.Users.update(user);
	                ChatActions.addAutocompleteElementsForUser(autocompleteList, user);
	            });
	            response(autocompleteList);
	        }).error(function () {});
	    },
	    html: true,
	    minLength: 1,
	    select: function select(event, ui) {
	        $(this).val(ui.item.value);
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Dashboard = undefined;
	
	var _DisplayUpdater = __webpack_require__(6);
	
	var _ServerMessageController = __webpack_require__(8);
	
	var _LadderHistory = __webpack_require__(33);
	
	var _PrivateChatLoader = __webpack_require__(9);
	
	var _UserInfo = __webpack_require__(47);
	
	var _MatchModeManager = __webpack_require__(22);
	
	var _Ladder = __webpack_require__(26);
	
	var _ChatActions = __webpack_require__(4);
	
	var _Settings = __webpack_require__(25);
	
	var _Request = __webpack_require__(7);
	
	$.fn.findCache = function (selector) {
	    var element = this;
	
	    if (!this.data('findCache')) {
	        this.data('findCache', {});
	    }
	    if (!this.data('findCache')) {
	        console.error('UNDEFINED ELEMENT');
	        return $();
	    }
	    if (this.data('findCache')[selector]) {
	        return this.data('findCache')[selector];
	    } else {
	        var result = this.find(selector);
	        this.data('findCache')[selector] = result;
	        return result;
	    }
	};
	
	$.fn.ladderSortable = function (options) {
	    var list = $(this);
	
	    if (!options.items) {
	        throw new Error('items is a required option');
	    }
	    var defaultOptions = {
	        axis: 'y',
	        tolerance: "pointer",
	        items: null,
	        idDataElement: "id",
	        updateUrl: '',
	        urlListKey: 'ids',
	        update: function update(e, ui) {
	            var elements = list.find(defaultOptions.items).not('.template');
	            var ids = [];
	            elements.each(function () {
	                var element = $(this);
	                var chat = element.data(defaultOptions.idDataElement);
	                ids.push(chat);
	            });
	            var data = {};
	            data[defaultOptions.urlListKey] = ids;
	            $.post(defaultOptions.updateUrl, data);
	        }
	    };
	
	    $.extend(defaultOptions, options);
	
	    console.log(options);
	    console.log(defaultOptions);
	    list.sortable(defaultOptions);
	};
	var Dashboard = exports.Dashboard = {};
	Dashboard.ladderPopupDismiss = function () {
	    $('#bootstrap-modal').modal('hide');
	};
	Dashboard.setupLadderPopupAutoSubmit = function (modal) {
	    modal.data('submitButton', null);
	    if (modal.data('autoSubmit')) {
	        return;
	    }
	    modal.data('autoSubmit', true);
	    modal.on('submit', function (e) {
	        e.preventDefault();
	        if (modal.data('submitButton')) {
	            modal.data('submitButton').click();
	        }
	    });
	};
	Dashboard.ladderPopup = function (content, title, options) {
	    var modal = $('#bootstrap-modal').modal(options);
	    Dashboard.setupLadderPopupAutoSubmit(modal);
	    if (!modal.data('buttonTemplate')) {
	        modal.data('buttonTemplate', modal.find('button.template').attr('data-dismiss', null).removeClass('template').remove());
	    }
	    var footer = modal.findCache('.modal-footer').show();
	    footer.empty();
	    if (!options) {
	        options = {};
	    }
	    if (options.buttons) {
	        if (options.buttons === true) {
	            options.buttons = [{
	                dismiss: false,
	                text: 'Hate'
	            }, {
	                dismiss: true,
	                text: 'Love'
	            }];
	        }
	
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	            var _loop = function _loop() {
	                var buttonData = _step.value;
	
	                var buttonItem = modal.data('buttonTemplate').clone();
	                if (buttonData.dismiss) {
	                    buttonItem.attr('data-dismiss', 'modal');
	                }
	                if (buttonData.click) {
	                    buttonItem.on('click', function () {
	                        buttonData.click(modalPopupCallbackData);
	                    });
	                    if (!modal.data('submitButton') || buttonData.defaultSubmit) {
	                        //Default to setting a button with a click event as the auto submit button
	                        modal.data('submitButton', buttonItem);
	                    }
	                }
	                buttonItem.text(buttonData.text);
	                buttonItem.appendTo(footer);
	            };
	
	            for (var _iterator = options.buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                _loop();
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	    } else {
	        modal.findCache('.modal-footer').hide();
	    }
	    delete options.buttons;
	
	    modal.findCache('.modal-body').html(content).show();
	    if (title) {
	        modal.findCache('.modal-header').show();
	        modal.findCache('.modal-title').html(title);
	    } else {
	        modal.findCache('.modal-header').hide();
	    }
	
	    var modalPopupCallbackData = {
	        popup: modal,
	        dismiss: function dismiss(exitMessage) {
	            if (exitMessage) {
	                modal.findCache('.modal-header').show();
	                modal.findCache('.modal-title').html(exitMessage);
	
	                modal.findCache('.modal-footer').hide();
	                modal.findCache('.modal-body').hide();
	
	                setTimeout(function () {
	                    Dashboard.ladderPopupDismiss();
	                }, 1500);
	            } else {
	                Dashboard.ladderPopupDismiss();
	            }
	        },
	        onDismiss: function onDismiss() {}
	    };
	
	    modal.off('hidden.bs.modal').on("hidden.bs.modal", function () {
	        modalPopupCallbackData.onDismiss(modal);
	    });
	    return modalPopupCallbackData;
	};
	Dashboard.playedSoundEffect = true;
	Dashboard.firstCheck = true;
	Dashboard.waitForChat = null;
	Dashboard.dashboard = $('#dashboard');
	Dashboard.loadingDashboard = $('#loading_dashboard');
	Dashboard.chatRoomsLoaded = false;
	
	Dashboard.baseState = {
	    is_in_ladder: isInLadder ? 1 : 0,
	    match_only_mode: matchOnlyMode ? 1 : 0
	};
	
	Dashboard.startMatchWithPlayer = null;
	Dashboard.hostCodePopup = { popup: null, value: null };
	Dashboard.attachedTabEvents = false;
	Dashboard.retrieveHostCode = function () {
	    var value = null;
	    if (Dashboard.hostCodePopup.popup) {
	        value = Dashboard.hostCodePopup.popup.get().find('input').val();
	    }
	    return value;
	};
	
	Dashboard.closeDeclickables = function () {
	    if (_Ladder.Ladder.declickables.length) {
	        $.each(_Ladder.Ladder.declickables, function (i, declick) {
	            if (!declick.data('canBeUnclicked')) {
	                return;
	            }
	            declick.trigger('notClicked');
	        });
	    }
	};
	Dashboard.parseGeneralData = function (message) {
	    if (message && message.authentication === false) {
	        Dashboard.serverConnection.authenticationFail = true;
	        if (message.error) {
	            // console.log(message.error);
	            Dashboard.serverConnection.setStatusError(message.error);
	        }
	    }
	    if (Dashboard.dashboard.data('search_disabled')) {
	        Dashboard.dashboard.data('search_disabled', false);
	        if (Dashboard.matchmakingTab.data('paneContainer')) {
	            Dashboard.matchmakingTab.data('paneContainer').find('.game_filters').removeClass('disabled');
	        }
	        _Settings.Settings.enableAll();
	
	        // ChatActions.resizeOpenChats();
	    }
	    if (Dashboard.dashboard.data('isReady')) {
	        Dashboard.performOpenSearchUpdate(message);
	    } else {
	        Dashboard.serverMessageQueue.push(message);
	    }
	};
	Dashboard.dashboard.on('ready', function () {
	    do {
	        var message = Dashboard.serverMessageQueue.shift();
	
	        Dashboard.parseGeneralData(message);
	    } while (message);
	});
	Dashboard.serverMessageQueue = [];
	Dashboard.keepContainerOnScreen = function (container, startPoint) {
	    if (!startPoint) {
	        startPoint = {};
	        startPoint.x = container.offset().left;
	        startPoint.y = container.offset().top;
	    }
	
	    var $window = $(window);
	    var windowTop = $window.scrollTop();
	    var windowBottom = $window.scrollTop() + $window.height();
	    var windowLeft = $window.scrollLeft();
	    var windowRight = $window.scrollLeft() + $window.width();
	
	    var containerRight = startPoint.x + container.width();
	    var containerBottom = startPoint.y + container.height();
	
	    var minHeight = container.height() + 60;
	
	    if (startPoint.y + minHeight > windowBottom) startPoint.y = windowBottom - minHeight;
	
	    if (startPoint.y < windowTop) startPoint.y = windowTop + 20;
	
	    if (startPoint.x < windowLeft) startPoint.x = windowLeft;
	
	    if (containerRight > windowRight) startPoint.x = windowRight - container.width() - 40;
	
	    container.css('left', startPoint.x);
	    container.css('top', startPoint.y);
	    // container.css('display','inline-block');
	    // container.css('position','absolute');
	};
	Dashboard.mainChatHolderTemplate = $('.chat_holder.template_visible');
	
	Dashboard.performOpenSearchUpdate = function (response, extract) {
	    if (extract) {
	        var replacement = {};
	        if (!response[extract]) {
	            return;
	        }
	        replacement[extract] = response[extract];
	        delete response[extract];
	        response = replacement;
	    }
	    for (var key in response) {
	        if (response.hasOwnProperty(key) && _ServerMessageController.ServerMessage[key] instanceof Function) {
	            if (_ServerMessageController.ServerMessage[key](response) === false) {
	                break;
	            }
	        }
	    }
	    Dashboard.firstCheck = false;
	    _DisplayUpdater.DisplayUpdater.reset();
	};
	
	var body = Dashboard.body = $('body');
	Dashboard.subList = $('.donate_area .subs_list');
	Dashboard.friendList = $('#friend_list');
	Dashboard.userInfoContainer = $('#user_info');
	Dashboard.mainUserInfo = $('.main_info');
	
	Dashboard.friendListButton = $('#friends_list_button');
	Dashboard.pendingFriendRequests = {};
	Dashboard.friendRequestNotification = $('#friend_requests_notification');
	Dashboard.mainChatArea = $('#main_chat_area');
	
	var otherUserLists = Dashboard.otherUserLists = Dashboard.friendList.add('#ignored_users');
	
	var allTabs = $('.mobile_view_tabs .tab_button');
	Dashboard.namedTabList = {};
	Dashboard.playMatchContainer = $('.play_match_container');
	Dashboard.retrieveNamedTab = function (name) {
	    return Dashboard.namedTabList[name] || $();
	};
	allTabs.each(function (i, tab) {
	    tab = $(tab);
	    Dashboard.namedTabList[tab.data('pane')] = tab;
	    if (tab.is('.disabled')) {
	        allTabs = allTabs.not(tab);
	    }
	});
	Dashboard.allTabs = allTabs;
	
	var chatsTab = Dashboard.chatsTab = Dashboard.retrieveNamedTab('chat');
	var directChatsTab = Dashboard.directChatsTab = Dashboard.retrieveNamedTab('direct_messages');
	var matchmakingTab = Dashboard.matchmakingTab = Dashboard.retrieveNamedTab('matchmaking');
	Dashboard.battleTab = Dashboard.retrieveNamedTab('battle');
	var groupsTab = Dashboard.groupsTab = Dashboard.retrieveNamedTab('groups');
	var matchmakingPane = Dashboard.matchmakingPane = $('#tab-pane-matchmaking');
	var disputesTab = Dashboard.disputesTab = Dashboard.retrieveNamedTab('disputes');
	var gameFilters = Dashboard.gameFilters = $('.game_filters');
	var matchmakingContainers = Dashboard.matchmakingContainers = $('#tab-pane-matchmaking').find('.ladder_game_list');
	
	Dashboard.disputesContainer = $('#disputes');
	
	Dashboard.activityView = $('#tab-pane-matchmaking').find('.activity_view');
	Dashboard.userlistSide = $('#user_list_side');
	Dashboard.midsideContainer = $('#tab-pane-chat');
	Dashboard.chatDrawerSelect = $('#chat_drawer_select');
	Dashboard.userlistIsVisible = function () {
	    if (!Dashboard.chatsTab.hasClass('active')) {
	        return false;
	    }
	    if (Dashboard.dashboard.hasClass('dashboard-md')) {
	        return true;
	    }
	    if (Dashboard.userlistSide.hasClass('toggleable') && !Dashboard.midsideContainer.hasClass('userlist_showing')) {
	        return false;
	    }
	    return true;
	};
	
	Dashboard.userInfoTab = $('#user_info_button');
	
	Dashboard.recentMatchSearchers = $('#recent_match_searchers');
	Dashboard.sortSearchLists = function () {
	    Dashboard.sortSearchList(Dashboard.recentMatchSearchers.data('friendlies_list'));
	    Dashboard.sortSearchList(Dashboard.recentMatchSearchers.data('ranked_list'));
	};
	Dashboard.sortSearchList = function (currentList) {
	    if (currentList.data('needsSort') && !Dashboard.recentMatchSearchers.hasClass('hard_focus')) {
	        currentList.data('needsSort', false);
	        currentList.find('.recent_match_searcher').tsort({ data: 'distance', order: 'asc' });
	    }
	};
	Dashboard.recentMatchSearchers.data('friendlies_list', Dashboard.recentMatchSearchers.find('.friendlies_search .ladder_game_list'));
	Dashboard.recentMatchSearchers.data('ranked_list', Dashboard.recentMatchSearchers.find('.ranked_search .ladder_game_list'));
	Dashboard.recentMatchSearchers.data('elementsToRemoveOnUnFocus', []);
	
	Dashboard.userInfoContainer.on('click', 'a', function (e) {
	    var link = $(this);
	    if (isInLadder && link.attr('target') != '_blank') {
	        if (link.hasClass('username') && link.closest('.opponent')) {
	            return;
	        }
	        e.preventDefault();
	        window.open(link.attr('href'), '_blank');
	    }
	});
	Dashboard.UserInfo = new _UserInfo.UserInfo(Dashboard.userInfoContainer);
	
	Dashboard.recentMatchSearchers.on('mouseenter', function () {
	    $(this).addClass('hard_focus');
	}).on('mouseleave', function () {
	    $(this).removeClass('hard_focus');
	    var popped = null;
	    do {
	        popped = Dashboard.recentMatchSearchers.data('elementsToRemoveOnUnFocus').pop();
	        if (popped) {
	            popped.remove();
	        }
	    } while (popped);
	    Dashboard.sortSearchLists();
	});
	Dashboard.battleTab.on('activate', function () {
	    if (!Dashboard.battleTab.data('paneContainer')) {
	        return;
	    }
	    if (!Dashboard.battleTab.data('eventsAdded')) {
	        Dashboard.battleTab.data('eventsAdded', true);
	        Dashboard.battleTab.data('paneContainer').on('click', '.match_search_link', function () {
	            Dashboard.matchmakingTab.trigger('activate');
	        });
	    }
	    if (Dashboard.battleTab.data('paneContainer')) {
	        var chatWindow = Dashboard.battleTab.data('paneContainer').find('.chat_container');
	        if (chatWindow.length) {
	            _ChatActions.ChatActions.scrollToBottom(chatWindow);
	        }
	    }
	});
	Dashboard.matchmakingTab.on('activate', function () {
	
	    if (_MatchModeManager.matchModeManager.viewModeIs(_MatchModeManager.MatchModeManager.modes.SEARCH)) {
	        if (!Dashboard.matchmakingTab.data('paneContainer')) {
	            return;
	        }
	        if (Dashboard.matchmakingTab.data('paneContainer').hasClass('loading')) {
	            return;
	        } else {}
	        Dashboard.matchmakingTab.data('paneContainer').addClass('loading');
	        _Request.Request.send({}, 'retrieve_match_searches', function () {
	            Dashboard.matchmakingTab.data('paneContainer').removeClass('loading');
	            return true;
	        });
	    }
	}).on('viewportActive', function () {
	    _MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SEARCH);
	    // ChatActions.resizeOpenChats();
	});
	matchmakingTab.on('activate', function () {
	    if (!matchmakingTab) {
	        return;
	    }
	    if (!matchmakingTab.data('paneContainer')) {
	        return;
	    }
	    if (matchmakingTab.data('paneContainer')) {
	        var chatWindow = matchmakingTab.data('paneContainer').find('.chat_container');
	        if (chatWindow.length) {
	            _ChatActions.ChatActions.scrollToBottom(chatWindow);
	        }
	    }
	
	    if (!matchmakingTab.data('paneContainer').data('maximize_events_set')) {
	        var toggleMaximize = function toggleMaximize(container, name) {
	            var toggle;
	            if (container.hasClass('maximized')) {
	                container.removeClass('maximized');
	                toggle = 0;
	            } else {
	                container.addClass('maximized');
	                toggle = 1;
	            }
	            $.post(siteUrl + '/account/toggle_matchmaking_display', { name: name, toggle: toggle });
	        };
	
	        matchmakingTab.data('paneContainer').data('maximize_events_set', true);
	        matchmakingTab.data('paneContainer').on('click', '.maximizable_container .heading', function (e) {
	            var container = $(this).closest('.maximizable_container');
	            toggleMaximize(container, container.data('name'));
	        });
	    }
	});
	directChatsTab.on('activate', function () {
	    $(this).trigger('updateTimestamps');
	    var currentActivePrivateChat = _PrivateChatLoader.PrivateChatLoader.getActivePrivateChat();
	    if (directChatsTab.data('paneContainer')) {
	        if (!directChatsTab.data('paneContainer').data('eventsAttached')) {
	            directChatsTab.data('paneContainer').data('eventsAttached', true);
	            directChatsTab.data('paneContainer').on('click', '.back_button', function () {
	                _PrivateChatLoader.PrivateChatLoader.minimizeAllPrivateChats();
	            }).on('click', '.close_button', function () {
	                _PrivateChatLoader.PrivateChatLoader.removePrivateChat($('.private_window.opened'));
	            });
	        }
	    }
	    if (currentActivePrivateChat) {
	        setTimeout(function () {
	            _PrivateChatLoader.PrivateChatLoader.minimizeAllPrivateChats();
	            _PrivateChatLoader.PrivateChatLoader.openPrivateChat(currentActivePrivateChat.data('user')).finished();
	        }, 1);
	    }
	});
	directChatsTab.on('timestampUpdate', function () {
	    if ($(this).data('paneContainer')) {
	        $(this).data('paneContainer').find('.private_chat_listing .time').timestampUpdate();
	    }
	});
	
	directChatsTab.on('deactivate', function () {
	    var currentActivePrivateChat = _PrivateChatLoader.PrivateChatLoader.getActivePrivateChat();
	    if (currentActivePrivateChat && Dashboard.isMediumOrLarger()) {
	        setTimeout(function () {
	            _PrivateChatLoader.PrivateChatLoader.minimizeAllPrivateChats();
	            var chat = _PrivateChatLoader.PrivateChatLoader.openPrivateChat(currentActivePrivateChat.data('user'));
	            if (chat.finished) {
	                chat.finished();
	            } else {
	                console.log(chat);
	            }
	        }, 1);
	    }
	});
	Dashboard.isTiny = function () {
	    return !Dashboard.dashboard.hasClass('dashboard-sm');
	};
	Dashboard.isMediumOrSmaller = function () {
	    return !Dashboard.dashboard.hasClass('dashboard-lg');
	};
	Dashboard.isLarge = function () {
	    return Dashboard.dashboard.hasClass('dashboard-lg');
	};
	Dashboard.isMediumOrLarger = function () {
	    return Dashboard.dashboard.hasClass('dashboard-md');
	};
	
	Dashboard.preferredDistanceSeverityElement = $('#preferred_distance_severity');
	Dashboard.getPreferredDistanceSeverity = function () {
	    var element = Dashboard.preferredDistanceSeverityElement;
	    if (typeof element.data('selected') == 'undefined') {
	        element.data('selected', element.find(':selected').val());
	    }
	    return element.data('selected');
	};
	Dashboard.getDataForGame = function (gameId) {
	    var element = $('#preferred_game_filter_' + gameId);
	    if (!element.length) {
	        return {};
	    }
	    return element.data();
	};
	
	var tabChanger = new TabChanger(allTabs);
	TabChanger.tabChangeDelay = 10;
	function TabChanger(tabs) {
	    this.allTabs = tabs;
	    var allTabs = this.allTabs;
	    allTabs.data('keepOthersActive', true);
	    allTabs.on('reactivate', function (e) {
	        var button = $(this);
	        if (button.hasClass('active')) {
	            var currentlyActive = allTabs.filter('.active').length;
	            if (currentlyActive > 1) {
	                button.trigger('deactivate');
	                return;
	            }
	        }
	    });
	
	    allTabs.on('activate', function (e) {
	        var button = $(this);
	        if (!button.data('paneContainer')) {
	            return;
	        }
	
	        var pane = button.data('paneContainer'); //.css('display','block');
	
	        var activeTabs = allTabs.filter('.active');
	        var maxOpenTabs = TabChanger.getMaximumNumberOfOpenTabs();
	        if (activeTabs.length >= maxOpenTabs) {
	            // Dashboard.sleep(TabChanger.tabChangeDelay).then(() =>
	            {
	
	                if (maxOpenTabs == 1) {
	                    activeTabs.not(button).trigger('deactivate');
	                } else {
	                    var selectedTabPosition = getPositionInList(button[0]);
	                    var others = activeTabs.not(button);
	                    var first = others[0];
	                    var second = others[1];
	
	                    $(second).trigger('deactivate');
	                }
	            }
	        }
	        function getPositionInList(compareTab) {
	            var position = 0;
	            allTabs.each(function (i, tab) {
	                if (tab === compareTab) {
	                    position = i;
	                    return false;
	                }
	            });
	            return position;
	        }
	    });
	    allTabs.on('deactivate', function (e) {
	        var button = $(this);
	        // button.data('paneContainer').hide();
	    });
	}
	TabChanger.prototype.initialize = function () {};
	TabChanger.getMaximumNumberOfOpenTabs = function () {
	    if (Dashboard.dashboard.hasClass('dashboard-sm')) {
	        return 2;
	    } else {
	        return 1;
	    }
	};
	
	$(window).resize(function () {
	    _ChatActions.ChatActions.calculateWindowHeight();
	    _ChatActions.ChatActions.resizeOpenChats();
	}).trigger('resize');
	
	attachTabEvents(allTabs);
	
	function attachTabEvents(allTabs) {
	    if (Dashboard.attachedTabEvents) {
	        return;
	    }
	    var initialActive = null;
	    if (!allTabs) {
	        allTabs = $('.tab_list .tab_button:not(.disabled)');
	    }
	    if (!allTabs.length) {
	        return;
	    }
	    Dashboard.attachedTabEvents = true;
	    allTabs.each(function (e) {
	        var paneName = '#tab-pane-' + $(this).data('pane');
	        var pane = $(paneName);
	        var tab = $(this);
	        pane.data('button', tab);
	        tab.data('paneContainer', pane);
	        if (!pane.data('tabContent')) {
	            pane.data('tabContent', pane.closest('.tab-content'));
	            pane.data('tabList', tab.closest('.tab_list').find('.tab_button'));
	        }
	        if (!tab.data('pane')) {
	            return;
	        }
	        tab.data('tabContent', pane.data('tabContent'));
	        tab.data('otherTabs', tab.closest('.tab_list').find('.tab_button'));
	        tab.data('otherPanes', tab.data('tabContent').find('.tab-pane').not(pane));
	        tab.data('link', tab.find('a'));
	
	        if (tab.hasClass('active')) {
	            initialActive = paneName;
	            tab.data('tabContent').attr('data-selected-tab', paneName);
	        }
	    });
	    allTabs.click(function (e) {
	        e.preventDefault();
	        var tab = $(this);
	        if (!tab.data('pane')) {
	            return;
	        }
	        var paneName = '#tab-pane-' + tab.data('pane');
	        _LadderHistory.LadderHistory.actions.activatePane(paneName, true);
	    });
	    allTabs.on('deactivate', function () {
	        var button = $(this);
	        button.removeClass('active').data('paneActive', false);
	        if (button.data('paneContainer')) {
	            button.data('paneContainer').removeClass('active').data('paneActive', false);
	        }
	    });
	    allTabs.on('activate', function (e, changeHistory) {
	        var button = $(this);
	        var pane = button.data('paneContainer');
	        var paneName = '#' + pane.attr('id');
	
	        var link;
	        var clicked = pane.data('button');
	        if (!clicked.data('pane')) {
	            return;
	        }
	
	        var others = pane.data('tabList');
	
	        var tabContent = pane.data('tabContent');
	        var otherPanes = clicked.data('otherPanes');
	
	        tabContent.attr('data-selected-tab', paneName);
	
	        if (pane.hasClass('active')) {
	            if (button.hasClass('active') && changeHistory) {
	                button.trigger('reactivate');
	                return;
	            }
	            return;
	        }
	
	        clicked.addClass('active').data('paneActive', true);
	        pane.data('paneActive', true);
	
	        // Dashboard.sleep(TabChanger.tabChangeDelay).then(() =>
	        {
	            if (button.data('keepOthersActive') !== true) {
	                others.not(clicked).trigger('deactivate');
	            }
	            clicked.addClass('active').data('paneActive', true);
	            pane.addClass('active').data('paneActive', true);
	            button.trigger('viewportActive');
	            // Do something after the sleep!
	            link = clicked.data('link');
	            if (pane.hasClass('reload-pane')) {
	                if (pane.data('paneXhr')) {
	                    return;
	                }
	                pane.empty();
	                pane.addClass('loading-content');
	                pane.append(Dashboard.getCircleLoaderElement());
	                var paneXhr = $.post(link.attr('href'), {
	                    pane_reload: paneName,
	                    pane_name: clicked.data('pane')
	                }, function (response) {
	                    var content;
	                    if (pane.hasClass('load-pane-once')) {
	                        pane.removeClass('reload-pane');
	                    }
	                    pane.data('paneXhr', null);
	                    if (response.success) {
	                        content = response.content;
	                        pane.html(response.content);
	                    } else {
	                        content = $(response);
	                        pane.html(content.find(paneName).html());
	                    }
	                    pane.removeClass('loading-content');
	                }).error(function () {
	                    pane.removeClass('loading-content');
	                    pane.text('There was an error loading the content');
	                });
	                pane.data('paneXhr', paneXhr);
	            }
	            if (changeHistory && link.length) {
	                var historyData = {
	                    pane: paneName,
	                    _index: History.getCurrentIndex()
	                };
	                _LadderHistory.LadderHistory.history.pushState(historyData, document.title, link.attr('href'));
	            }
	        }
	    });
	    _LadderHistory.LadderHistory.actions.activatePane = function (paneId, changeHistory) {
	        var pane = $(paneId);
	        var button = pane.data('button');
	        if (button) {
	            if (button.data('activatedBeforeStateChange')) //Prevent state chang efrom triggering twice
	                {
	                    return;
	                }
	            if (button.hasClass('active')) {
	                button.trigger('reactivate');
	                return;
	            }
	            button.data('activatedBeforeStateChange', true);
	
	            button.trigger('activate', [changeHistory]);
	        } else {
	            console.error('Container not found for ' + paneId);
	        }
	    };
	    if (_LadderHistory.LadderHistory.history.Adapter) {
	        _LadderHistory.LadderHistory.history.Adapter.bind(window, 'statechange', function () {
	            var state = _LadderHistory.LadderHistory.history.getState();
	            var paneId = state.data.pane;
	
	            var currentIndex = History.getCurrentIndex();
	            var internal = state.data._index == currentIndex - 1;
	            if (internal && !paneId) {
	
	                if (initialActive) {
	                    paneId = initialActive;
	                    if (!paneId) {
	                        return;
	                    }
	                } else {
	                    return;
	                }
	            }
	            if (typeof state.data._index == 'undefined') {
	                paneId = initialActive;
	            }
	
	            // console.log(currentIndex);
	            // console.log(state.data._index);
	
	            if (paneId) {
	                _LadderHistory.LadderHistory.actions.activatePane(paneId, false);
	            } else {
	                //LadderHistory.checkUserActionState();
	            }
	            allTabs.data('activatedBeforeStateChange', false);
	        });
	    }
	    allTabs.filter('.active').trigger('activate');
	    if (chatsTab.hasClass('active') && Dashboard.dashboard.hasClass('dashboard-sm')) {
	        Dashboard.matchmakingTab.trigger('activate');
	    }
	}
	
	$(function () {
	    attachTabEvents();
	});
	
	matchmakingTab.on('showNotified', function () {
	    if (!matchmakingTab.hasClass('active') && !matchmakingTab.data('paneContainer').is(':visible')) {
	        matchmakingTab.addClass('notification');
	    }
	});
	Dashboard.battleTab.on('showNotified', function () {
	    if (!Dashboard.battlePaneIsVisible()) {
	        Dashboard.battleTab.addClass('notification');
	    }
	});
	
	Dashboard.sleep = function (time) {
	    return new Promise(function (resolve) {
	        return setTimeout(resolve, time);
	    });
	};
	Dashboard.matchmakingPaneIsVisible = function () {
	    return Dashboard.matchmakingTab.data('paneContainer').is(':visible');
	};
	Dashboard.matchmakingPaneShouldGetFocus = function () {
	    return !Dashboard.matchmakingPaneIsVisible();
	};
	Dashboard.matchmakingPaneShouldGetFocusIfNeeded = function () {
	    if (Dashboard.matchmakingPaneShouldGetFocus()) {
	        Dashboard.matchmakingTab.trigger('click');
	    }
	};
	Dashboard.battlePaneIsVisible = function () {
	    return Dashboard.battleTab.hasClass('active') && Dashboard.battleTab.data('paneContainer').is(':visible');
	};
	Dashboard.battlePaneShouldGetFocus = function () {
	    return !Dashboard.battlePaneIsVisible();
	};
	Dashboard.battlePaneShouldGetFocusIfNeeded = function () {
	    if (Dashboard.battlePaneShouldGetFocus()) {
	        Dashboard.battleTab.trigger('click');
	    }
	};
	
	Dashboard.updateSearchesByBuildPreference = function ($searches) {
	    $searches.each(function (i, search) {
	        var element = $(search);
	        search = element.data('match');
	        var userObject = search.player1;
	        if (!userObject) {
	            return;
	        }
	        if (userObject.id == myUser.id) {
	            return;
	        }
	        if (userObject.preferred_builds.hasPreferredBuildsFor && userObject.preferred_builds.hasPreferredBuildsFor(search.ladder.id) && myUser.preferred_builds) {
	            var result = userObject.preferred_builds.getBestBuildHostPerspective(myUser.preferred_builds, search.ladder.id);
	            if (result === null) {
	                element.addClass('no_matching_builds').removeClass('has_matching_builds');
	            } else {
	                element.addClass('has_matching_builds').removeClass('no_matching_builds');
	            }
	        } else {}
	    });
	};
	
	Dashboard.dashboard.on('ready', function (e) {
	    var steps = [];
	    var runTours = window.runTours;
	    if (runTours && Dashboard.dashboard.hasClass('dashboard-sm')) {
	        if (runTours[1]) {
	            Tours.siteIntroTour(steps);
	        }
	        if (runTours[2]) {
	            if (Dashboard.matchmakingTab.hasClass('active') && _MatchModeManager.matchModeManager.viewModeIs(_MatchModeManager.MatchModeManager.modes.SEARCH)) {
	                Tours.gameSpecificSettingsTour(steps);
	            }
	        }
	        if (runTours[3]) {
	            Tours.fasterMeleeTour(steps);
	        }
	    }
	    if (steps.length) {
	        var intro = introJs();
	        intro.setOptions({
	            exitOnOverlayClick: false,
	            exitOnEsc: false,
	            steps: steps,
	            showBullets: false
	        });
	        intro.start();
	        $('.introjs-overlay').on('click', function (e) {
	            if ($(this).data('finished')) {
	                return;
	            }
	            intro.nextStep();
	        });
	
	        intro.oncomplete(function () {
	            $('.introjs-overlay').data('finished', true);
	            $.post(siteUrl + '/finished_tour', { tours: runTours }).done(function (response) {});
	        });
	    }
	}).on('ready', function () {});
	var Tours = {
	    siteIntroTour: function siteIntroTour(steps) {
	        steps.push({
	            intro: "Welcome to SmashLadder!"
	        });
	        steps.push({
	            element: $('.game_filters')[0],
	            intro: "Click a logo to start searching for challengers of the game you want to play!"
	        });
	        steps.push({
	            element: $('#recent_match_searchers')[0],
	            intro: "Others searching for matches will appear here. Click the logo next to their search to request to start playing",
	            position: 'top'
	        });
	    },
	    gameSpecificSettingsTour: function gameSpecificSettingsTour(steps) {
	        steps.push({
	            element: $('.game_filters:first')[0],
	            intro: "You can change specific search settings for each game by clicking its icon."
	        });
	        var meleeFilter = $('#preferred_game_filter_2');
	        if (meleeFilter.length) {
	            steps.push({
	                element: meleeFilter[0],
	                intro: "You can set <em>Faster Melee</em> preferences by clicking into " + '<img class="logo" src="' + siteUrl + '/images/logos/game-filter-logos/melee-on.png">' + " settings"
	            });
	        }
	    },
	    fasterMeleeTour: function fasterMeleeTour(steps) {
	        var meleeFilter = $('#preferred_game_filter_2');
	        if (meleeFilter.length && meleeFilter.is(':visible')) {
	            steps.push({
	                element: meleeFilter[0],
	                intro: '<a target="_blank" href="https://www.smashladder.com/guides/view/272o/melee-dolphin-build-fastermelee-5-fm5">' + '<img style="display: block; margin: 0 auto;" class="logo" src="' + siteUrl + '/images/logos/dolphin/ishiiruka/48x48.png">' + '</a>' + "Faster Melee " + "is now the default dolphin build, if you cannot run it please click the" + '<br> <img class="logo" src="' + siteUrl + '/images/logos/game-filter-logos/melee-on.png">' + ' icon to change your preferences'
	            });
	        }
	    }
	};
	
	Dashboard.activeAutoComplete = null;
	$(document).on('focus', '.chat_input.chat_autocomplete', function () {
	    Dashboard.setAutocomplete(this);
	}).on('elastic:resized', '.chat_input', function (e, rawr) {
	    var input = $(this);
	    console.log(input.css('height'));
	    console.log('resized!');
	    console.log(e, rawr);
	});
	
	Dashboard.setAutocomplete = function (chatInput) {
	    chatInput = $(chatInput);
	    if (Dashboard.activeAutoComplete) {
	        if (chatInput[0] === Dashboard.activeAutoComplete[0]) {
	            return;
	        }
	        if (Dashboard.activeAutoComplete.data('ui-autocomplete') != undefined) {
	            Dashboard.activeAutoComplete.autocomplete('destroy');
	        }
	    }
	    _ChatActions.ChatActions.autoCompleteCache = null;
	    Dashboard.activeAutoComplete = chatInput;
	    Dashboard.activeAutoComplete.autocomplete(_ChatActions.ChatActions.chatAutocompleteOptions);
	};
	
	Dashboard.circleLoaderElement = null;
	Dashboard.getCircleLoaderElement = function () {
	    if (Dashboard.circleLoaderElement) {
	        return Dashboard.circleLoaderElement.clone();
	    } else {
	        return Dashboard.circleLoaderElement = $('#circle_loader_element').remove().attr('id', '').removeClass('template');
	    }
	};
	
	Dashboard.keyCodes = {
	    BACKSPACE: 8,
	    TAB: 9,
	    ENTER: 13,
	    SHIFT: 16,
	    CTRL: 17,
	    ALT: 18,
	    PAUSE: 19,
	    CAPS_LOCK: 20,
	    ESCAPE: 27,
	    SPACE: 32,
	    PAGE_UP: 33,
	    PAGE_DOWN: 34,
	    END: 35,
	    HOME: 36,
	    LEFT_ARROW: 37,
	    UP_ARROW: 38,
	    RIGHT_ARROW: 39,
	    DOWN_ARROW: 40,
	    INSERT: 45,
	    DELETE: 46,
	    KEY_0: 48,
	    KEY_1: 49,
	    KEY_2: 50,
	    KEY_3: 51,
	    KEY_4: 52,
	    KEY_5: 53,
	    KEY_6: 54,
	    KEY_7: 55,
	    KEY_8: 56,
	    KEY_9: 57,
	    KEY_A: 65,
	    KEY_B: 66,
	    KEY_C: 67,
	    KEY_D: 68,
	    KEY_E: 69,
	    KEY_F: 70,
	    KEY_G: 71,
	    KEY_H: 72,
	    KEY_I: 73,
	    KEY_J: 74,
	    KEY_K: 75,
	    KEY_L: 76,
	    KEY_M: 77,
	    KEY_N: 78,
	    KEY_O: 79,
	    KEY_P: 80,
	    KEY_Q: 81,
	    KEY_R: 82,
	    KEY_S: 83,
	    KEY_T: 84,
	    KEY_U: 85,
	    KEY_V: 86,
	    KEY_W: 87,
	    KEY_X: 88,
	    KEY_Y: 89,
	    KEY_Z: 90,
	    LEFT_META: 91,
	    RIGHT_META: 92,
	    SELECT: 93,
	    NUMPAD_0: 96,
	    NUMPAD_1: 97,
	    NUMPAD_2: 98,
	    NUMPAD_3: 99,
	    NUMPAD_4: 100,
	    NUMPAD_5: 101,
	    NUMPAD_6: 102,
	    NUMPAD_7: 103,
	    NUMPAD_8: 104,
	    NUMPAD_9: 105,
	    MULTIPLY: 106,
	    ADD: 107,
	    SUBTRACT: 109,
	    DECIMAL: 110,
	    DIVIDE: 111,
	    F1: 112,
	    F2: 113,
	    F3: 114,
	    F4: 115,
	    F5: 116,
	    F6: 117,
	    F7: 118,
	    F8: 119,
	    F9: 120,
	    F10: 121,
	    F11: 122,
	    F12: 123,
	    NUM_LOCK: 144,
	    SCROLL_LOCK: 145,
	    SEMICOLON: 186,
	    EQUALS: 187,
	    COMMA: 188,
	    DASH: 189,
	    PERIOD: 190,
	    FORWARD_SLASH: 191,
	    GRAVE_ACCENT: 192,
	    OPEN_BRACKET: 219,
	    BACK_SLASH: 220,
	    CLOSE_BRACKET: 221,
	    SINGLE_QUOTE: 222
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DisplayUpdater = undefined;
	
	var _Request = __webpack_require__(7);
	
	var _Dashboard = __webpack_require__(5);
	
	var idleSpeed = 120000;
	//	var idleSpeed = 10000;
	var slowSpeed = 15000;
	var defaultSpeed = 3000;
	var highSpeed = 2000;
	
	var refreshTimeout;
	var lastUpdateInterval = 5000;
	var gaUpdate = 0;
	var chatUpdate = 0;
	var userActive = 5;
	
	var updateXhr = null;
	var DisplayUpdater = exports.DisplayUpdater = {
	    pause: function pause() {
	        if (refreshTimeout) {
	            clearTimeout(refreshTimeout);
	        }
	        refreshTimeout = null;
	    },
	    reset: function reset(time) {
	        if (!time) time = lastUpdateInterval;
	        lastUpdateInterval = time;
	        if (!lastUpdateInterval) lastUpdateInterval = highSpeed;
	
	        if (refreshTimeout) clearTimeout(refreshTimeout);
	
	        if (userActive) {
	            //Check more frequently if the user has been active
	            lastUpdateInterval = highSpeed;
	            userActive--;
	            gaUpdate = 1;
	        } else if (DisplayUpdater.isIdle()) {
	            //Check every minute and a half give or take if a user is idle
	            var randomInterval = Math.round(Math.random() * 10000);
	            lastUpdateInterval = idleSpeed + randomInterval;
	        } else if (DisplayUpdater.isSlow()) {
	            lastUpdateInterval = slowSpeed;
	        } else {
	            lastUpdateInterval = defaultSpeed;
	        }
	        _Dashboard.Dashboard.playedSoundEffect = false;
	        refreshTimeout = setTimeout(DisplayUpdater.update, lastUpdateInterval);
	    },
	    cancel: function cancel() {
	        if (updateXhr) {
	            updateXhr.abort();
	        }
	    },
	    update: function update() {
	        DisplayUpdater.reset();
	
	        _Dashboard.Dashboard.playedSoundEffect = false;
	    },
	    userIsActive: function userIsActive(count) {
	        count = count || 10;
	        userActive = count; //10 fast requests ;]
	    },
	    userIsNotIdle: function userIsNotIdle() {
	        if (DisplayUpdater.isIdle() /* && instanceCode !== false */) {
	                //				addNotificationToChat($('.chat_container.main'),'You are no longer idle.');
	                return;
	                _Request.Request.send({ idle: 0 }, 'idle');
	            }
	        idleTime = 0;
	    },
	    idleTimer: function idleTimer() {
	        idleTime++;
	        //Every idletime is = 10 seconds
	        if (DisplayUpdater.justBecameIdle()) {
	            return;
	            //				addNotificationToChat($('.chat_container.main'),'You are now idle.');
	            _Request.Request.send({ idle: 1 }, 'idle');
	        }
	    },
	    isSlow: function isSlow() {
	        return idleTime >= isSlowLimit;
	    },
	    isIdle: function isIdle() {
	        return idleTime >= isIdleLimit;
	    },
	    justBecameIdle: function justBecameIdle() {
	        return idleTime == isIdleLimit;
	    }
	
	};
	
	var isIdleLimit = 30; // 5 minutes = 30
	var isSlowLimit = 4; // 1 minute = 6
	var idleTime = 0;
	var idleInterval = setInterval(DisplayUpdater.idleTimer, 10000);
	
	//$(window).mousemove(function(e){
	//	DisplayUpdater.userIsNotIdle();
	//});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Request = undefined;
	
	var _Dashboard = __webpack_require__(5);
	
	var Request = exports.Request = {
	    post: function post(url, data, callback) {
	        if (!data) data = {};
	        //			data.ladder_id = gameId;
	        return $.post(url, data, callback).error(function () {
	            callback({ success: false, serverError: true });
	        });
	    },
	    generalSend: function generalSend(data, url, callback, errorCallback) {
	        return Request.post(url, data, function (response) {
	
	            if (callback) {
	                var result = callback(response);
	                if (result === true) {
	                    _Dashboard.Dashboard.performOpenSearchUpdate(response);
	                }
	            }
	        }).then(null, function () {
	            if (errorCallback) {
	                errorCallback();
	            }
	        });
	    },
	    api: function api(data, action, callback, errorCallback) {
	        return Request.generalSend(data, siteUrl + '/apiv1/' + action, callback, errorCallback);
	    },
	    send: function send(data, action, callback, errorCallback) {
	        return Request.generalSend(data, siteUrl + '/matchmaking/' + action, callback, errorCallback);
	    },
	    socket: function socket(data, callback, errorCallback) {
	        _Dashboard.Dashboard.serverConnection.send(data);
	        alert('sending?!');
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ServerMessage = undefined;
	
	var _PrivateChatLoader = __webpack_require__(9);
	
	var _DateFormat = __webpack_require__(38);
	
	var _matchmaking = __webpack_require__(10);
	
	var _Request = __webpack_require__(7);
	
	var _ChatActions = __webpack_require__(4);
	
	var _LadderInfo = __webpack_require__(30);
	
	var _Populate = __webpack_require__(40);
	
	var _MatchSounds = __webpack_require__(29);
	
	var _Ladder = __webpack_require__(26);
	
	var _Settings = __webpack_require__(25);
	
	var _BrowserNotification = __webpack_require__(24);
	
	var _Flair = __webpack_require__(21);
	
	var _Dashboard = __webpack_require__(5);
	
	var _UserNotificationQueueItem = __webpack_require__(57);
	
	var _PreferredGame = __webpack_require__(58);
	
	var ServerMessageController = function ServerMessageController() {
	    this.restartingComputer = false;
	};
	
	ServerMessageController.prototype.restart_computer = function () {
	    if (!this.restartingComputer) {
	        this.restartingComputer = true;
	        $('.restarting_computer').show();
	        var time = 5;
	        var maxTime = 5;
	        var countDown = $('.restarting_computer .countdown');
	        var timer = new Timer(countDown, 5, function () {
	            location.reload(true);
	        });
	        countDown.text(time);
	    }
	};
	ServerMessageController.prototype.success = function (response) {
	    if (response.authentication === false) {
	        showConnectionIssue(response);
	        return false;
	    }
	};
	ServerMessageController.prototype.authentication = ServerMessageController.success;
	ServerMessageController.prototype.ladder_error_banned = function (response) {
	    var url = window.location.href;
	
	    var lastSegment = url.split('/').pop();
	    if (lastSegment == 'netplay') {
	        window.location = siteUrl;
	    }
	};
	ServerMessageController.prototype.ping_player = function (pingPlayerData) {
	    if (!_BrowserNotification.BrowserNotification.checkBrowserFocus() || IS_LOCALHOST) {
	        console.log('Browser tab does not have focus, do not start a ping test');
	        return;
	    }
	    var pingPlayer = pingPlayerData.ping_player;
	    var peerToConnectTo = pingPlayer.peer_id;
	
	    var peer = new Peer({ key: 'syic4as01jvvaemi' });
	    var dataConnection = null;
	
	    var isHost = false;
	    var connectionEstablished = false;
	    var otherUser = _matchmaking.Users.retrieveById(pingPlayer.player_id);
	    if (!otherUser) {
	        return null;
	    }
	    if (!otherUser.peer) {
	        otherUser.peer = {
	            id: null,
	            ping: new PingAverage()
	        };
	    }
	    var destroyPeer = function destroyPeer() {
	        console.trace('DESTRUCTION');
	        peer.destroy();
	    };
	    otherUser.peer.id = pingPlayer.peer_id;
	    peer.on('open', function (id) {
	        console.log('my peer id', id);
	        //Peer connections will be fire and forget since a long term connection should not be necessary
	        if (!myUser.peer) {
	            myUser.peer = {};
	        }
	        myUser.peer.id = id;
	
	        if (pingPlayer.peer_id) {
	            console.log('attempting connection to ', pingPlayer.peer_id);
	            dataConnection = peer.connect(pingPlayer.peer_id);
	            isHost = false;
	            dataConnectionEventBinder(dataConnection, otherUser);
	            connectionEstablished = !!dataConnection;
	            console.log(dataConnection);
	            console.log(connectionEstablished);
	        } else {
	            peer.on('connection', function (conn) {
	                dataConnection = conn;
	                console.log('CONNECTION ESTABLISHED');
	                otherUser.peer.id = dataConnection.peer;
	                isHost = true;
	                dataConnectionEventBinder(dataConnection, otherUser);
	            });
	            $.post(siteUrl + '/matchmaking/ping_player', { peer_id: myUser.peer.id, player_id: pingPlayer.player_id }, function (response) {
	                if (!response.success) {
	                    destroyPeer();
	                    throw "Error establishing user to connect to";
	                } else {
	                    console.log('Success, it should only be a matter of time now...');
	                }
	            });
	            //We're just going to wait for a connection
	        }
	        setTimeout(function () {
	            //After a while, if no dataconnection is bound, we'll kill this to prevent a memory leak
	            if (dataConnection) {
	                return;
	            }
	            destroyPeer();
	        }, 10000);
	
	        //Since we were requested to connect to the peer, we'll request a connection to the other browser
	    });
	    peer.on('error', function (err) {
	        console.log(':(');
	        console.log(err);
	        destroyPeer();
	    });
	
	    function dataConnectionEventBinder(dataConnection, otherUser) {
	        if (!dataConnection) {
	            destroyPeer();
	            throw "The peer data connection was not initialized";
	        } else {
	            console.log('');
	            //peer.disconnect();
	        }
	        if (isHost) {
	            var timeOutInterval = 1000;
	            var sendPing = function sendPing() {
	                console.log('sending PING');
	                if (dataConnection && otherUser.peer && otherUser.peer.id) {
	                    var test = new PingTester();
	                    var measure = test.measure;
	                    dataConnection.send({
	                        type: 'ping',
	                        test: { uid: 1, id: measure.id, key: measure.key }
	                    });
	                    setTimeout(sendPing, timeOutInterval);
	                } else {
	                    destroyPeer();
	                    dataConnection = null;
	                }
	            };
	            setTimeout(sendPing, 1000);
	        }
	        dataConnection.on('data', function (data) {
	            console.log('Received', data);
	            if (data.type == 'ping') {
	                console.log('Sending PING');
	                dataConnection.send({
	                    type: 'pong',
	                    reply: data.test
	                });
	            }
	            if (data.type == 'pong') {
	                if (data.reply) {
	                    if (PingTester.pingTests[data.reply.id]) {
	                        var result = PingTester.pingTests[data.reply.id].finished(data.reply);
	                        if (result !== null) {
	                            otherUser.peer.ping.add(result);
	                        }
	
	                        $('#ping_test_result').addClass('visible').find('.number').text(otherUser.peer.ping.getAverage());
	                    } else {
	                        console.log('Invalid reply', data.reply);
	                    }
	                }
	            }
	        });
	    }
	
	    function PingMeasure(finishedCallback) {
	        this.id = PingMeasure.currentId++;
	        this.key = getRandomInt(1, 10000000);
	        var that = this;
	        var date = new Date();
	        this.startTime = date.getTime();
	        this.endTime = null;
	        this.timedOut = false;
	        this.totalTime = null;
	        var finishPingMeasure = function finishPingMeasure() {
	            finishedCallback();
	            finishedCallback = null;
	        };
	        setTimeout(function () {
	            if (!finishedCallback) {
	                return;
	            }
	            that.timedOut = true;
	            finishPingMeasure();
	        }, 5000);
	        this.reply = function () {};
	        this.end = function () {
	            var date = new Date();
	            this.endTime = date.getTime();
	            if (finishedCallback) {
	                finishPingMeasure();
	            }
	            return that.totalTime = that.endTime - that.startTime;
	        };
	    }
	    PingMeasure.currentId = 1;
	
	    function PingTester(pingtestFinished) {
	        var finishedCallback = function finishedCallback() {};
	        var test = new PingMeasure(finishedCallback);
	        this.measure = test;
	        var tests = PingTester.pingTests;
	        tests[test.id] = this;
	        this.finished = function (reply) {
	            if (reply.id == test.id && reply.key == test.key) {
	                console.log(test);
	                return test.end();
	            } else {
	                throw 'Error this test did not belong to this reply';
	            }
	        };
	        finishedCallback = function finishedCallback() {
	            pingtestFinished(test);
	            delete PingTester.pingTests[test.id];
	            return test;
	        };
	    }
	    PingTester.pingTests = {};
	};
	
	ServerMessageController.prototype.preferred_games = function (response) {
	    if (response.preferred_games) {
	        var rerunList = function rerunList(name) {
	            //Hack to not get items blacklisted...
	            var list = _LadderInfo.LadderInfo.retrieveReference(name);
	            if (list.items) {
	                for (var i in list.items) {
	                    if (!list.items.hasOwnProperty(i)) {
	                        continue;
	                    }
	                    var item = list.items[i];
	                    if (item.element !== false) {
	                        continue;
	                    }
	                    _LadderInfo.LadderInfo.forceRemove(name, i, true);
	                    var newItem = {};
	                    newItem[i] = item.data;
	                    _LadderInfo.LadderInfo.parseChanges(name, newItem);
	                }
	            }
	        };
	
	        _Dashboard.Dashboard.gameFilters.findCache('.dynamic_preferred_games_holder').find('.preferred_game_filter').remove();
	        $.each(response.preferred_games, function (i, preferred_game) {
	            preferred_game = new _PreferredGame.PreferredGame(preferred_game);
	            var element = preferred_game.getElement();
	            element.appendTo(_Dashboard.Dashboard.gameFilters.findCache('.dynamic_preferred_games_holder'));
	        });
	
	        rerunList('matchSearches');
	        rerunList('awaitingReplies');
	        rerunList('openChallenges');
	
	        _Dashboard.Dashboard.gameFilters.findCache('.dynamic_preferred_games_holder').find('.preferred_game_filter').add(_Dashboard.Dashboard.gameFilters.find('.game_settings_selection')).tsort({ data: 'order_by', order: 'asc' });
	
	        _Dashboard.Dashboard.gameFilters.sortable({
	            axis: 'x',
	            containment: "parent",
	            tolerance: "pointer",
	            items: ".preferred_game_filter",
	            update: function update(e, ui) {
	                var ul = _Dashboard.Dashboard.gameFilters.findCache('.dynamic_preferred_games_holder');
	                var elements = ul.find('.preferred_game_filter').not('.template');
	                var ids = [];
	                elements.each(function () {
	                    var element = $(this);
	                    var chat = element.data('id');
	                    ids.push(chat);
	                });
	                var data = {
	                    ids: ids
	                };
	                $.post(siteUrl + '/matchmaking/update_game_preference_order', data);
	            }
	        });
	
	        var filters = _Dashboard.Dashboard.gameFilters.findCache('.dynamic_preferred_games_holder').find('.preferred_game_filter');
	        var onFilters = _Dashboard.Dashboard.gameFilters.findCache('.dynamic_preferred_games_holder').find('.preferred_game_filter.on');
	
	        if (filters.length == 1) {
	            $('#no_game_filters').hide();
	            _Dashboard.Dashboard.playMatchContainer.addClass('one_truth').removeClass('no_games many_games');
	            console.log(filters.first().data());
	            $('#one_game_one_truth').find('.game').data(filters.first().data());
	        } else if (onFilters.length == 0) {
	            $('#no_game_filters').show();
	            _Dashboard.Dashboard.playMatchContainer.removeClass('one_truth many_games').addClass('no_games');
	        } else //if(filters.length)
	            {
	                $('#no_game_filters').hide();
	                _Dashboard.Dashboard.playMatchContainer.removeClass('one_truth no_games').addClass('many_games');
	            }
	    }
	};
	ServerMessageController.prototype.chat_motd_update = function (response) {
	    var updated = response.chat_motd_update;
	    if (chatRooms[updated.chat_room_id]) {
	        var chat = chatRooms[updated.chat_room_id];
	        var description = chat.find('.chat_room_description');
	        description.data('descriptionId', updated.description_id);
	        if (updated.motd) {
	            description.show();
	            description.find('.description_message').html(updated.motd);
	        } else {
	            description.hide();
	        }
	    }
	};
	ServerMessageController.prototype.notification_queue = function (response) {
	    $.each(response.notification_queue, function (id, notification) {
	        var item = new _UserNotificationQueueItem.UserNotificationQueueItem(notification);
	        if (item && item.display) {
	            item.display();
	        }
	    });
	};
	ServerMessageController.prototype.my_user = function (response) {
	    _matchmaking.Users.update(response.my_user); //TODO: Verify that this is updating myUser....
	};
	ServerMessageController.prototype.friend_requests = function (response) {
	    if (response.friend_requests.count > 0) {
	        _Dashboard.Dashboard.friendListButton.addClass('has_notifications');
	    } else {
	        _Dashboard.Dashboard.friendListButton.removeClass('has_notifications');
	    }
	    if (response.friend_requests.new) {
	        $.each(response.friend_requests.new, function (id, friendRequest) {
	            if (!_Dashboard.Dashboard.pendingFriendRequests[id]) {
	                _BrowserNotification.BrowserNotification.showNotification('Friend Request!', {
	                    body: friendRequest.username + ' wants to be friends!',
	                    icon: friendRequest.selected_flair ? _Flair.Flair.retrieve(friendRequest.selected_flair).fullUrl : undefined
	                });
	
	                var message = $('<span>');
	                friendRequest = _matchmaking.Users.update(friendRequest);
	                message = message.append(friendRequest.createUsernameElement()).append(' wants to be friends!');
	
	                _ChatActions.ChatActions.addNotificationToChat(null, message);
	                _Dashboard.Dashboard.pendingFriendRequests[id] = true;
	            }
	        });
	    }
	    if (response.friend_requests.accepted) {
	        var friend = _matchmaking.Users.update(response.friend_requests.accepted.player);
	        var message = $('<span>');
	        message = message.append(friend.createUsernameElement()).append(' accepted your friend request!');
	
	        _BrowserNotification.BrowserNotification.showNotification('New Friend!', {
	            body: friend.username + ' accepted your friend request!'
	        });
	
	        _ChatActions.ChatActions.addNotificationToChat(null, message);
	    }
	};
	ServerMessageController.prototype.friend_online = function (response) {
	    $.each(response.friend_online, function (id, friend) {
	        _Dashboard.Dashboard.friendListButton.trigger('updateFriend', [friend]);
	    });
	};
	ServerMessageController.prototype.disputed_matches = function (response) {
	    _LadderInfo.LadderInfo.parseChanges('disputedMatches', response.disputed_matches);
	};
	ServerMessageController.prototype.searches = function (response) {
	    if (!matchmakingDisabled && isInLadder) {
	        _LadderInfo.LadderInfo.parseChanges('matchSearches', response.searches);
	    }
	};
	ServerMessageController.prototype.email_validated = function (response) {
	    if (response.email_validated) {
	        $('.email_validation_notification').trigger('email_validated');
	    }
	};
	ServerMessageController.prototype.new_notification = function (response) {
	    if (response.new_notification.achievement) {
	        return;
	        var achievement = response.new_notification.achievement;
	        alert(achievement.title + ' - ' + achievement.description);
	    } else {
	        var notification = response.new_notification.notification;
	        var unread = response.new_notification.unread;
	        var append = $('#header_notification_bar .notification_bar_message.template').clone();
	        append.removeClass('template');
	        var otherContent = append.clone().html();
	        append.html(notification.notification_text);
	        append.append(otherContent);
	        append.insertAfter($('#header_notification_bar .new_notifications_count'));
	        $('.notification_bar_message').data('notification_id', notification.id);
	
	        $('#header_notification_bar').trigger('updateUnreadCount', [unread]);
	        var allMessages = $('#header_notification_bar .notification_bar_message').not('.template');
	        if (allMessages.length > 5) {
	            allMessages.last().remove();
	        }
	    }
	};
	ServerMessageController.prototype.top_donators = function (response) {
	    var donators = response.top_donators;
	    _Dashboard.Dashboard.subList.empty();
	    $.each(donators, function (i, donator) {
	        donator = _matchmaking.Users.update(donator);
	        var element = $('<div>').addClass('latest_sub').append(donator.createUsernameElement());
	        var amount = $('<span>').addClass('amount');
	        element.append(amount);
	        amount.text(donator.total);
	        if (!donator.total) {
	            amount.remove();
	        }
	        element.appendTo(_Dashboard.Dashboard.subList);
	    });
	};
	ServerMessageController.prototype.sub_hype = function (response) {
	    if (!isInLadder) {
	        return;
	    }
	    var hype = response.sub_hype;
	    var user = hype.user;
	    var playSound = false;
	    if (hype.type == 'donation') {
	        playSound = hype.play_sound;
	        var love = '<3';
	        if ((hype.amount % 1).toFixed(2) == .69) {
	            love = 'ヽ( ͡°╭​͜ʖ╮​͡° )ﾉ';
	        }
	        if (hype.amount >= 1) {
	            playSound = true;
	            _BrowserNotification.BrowserNotification.showNotificationBar('Donation hype from ' + user.username + '! $' + hype.amount.toFixed(2) + ', ' + love + '.');
	        } else {
	            _BrowserNotification.BrowserNotification.showNotificationBar('Very low so no sound Donation hype from ' + user.username + '! $' + hype.amount.toFixed(2) + ', ' + love + '.');
	        }
	    } else if (hype.type == 'subscription') {
	        playSound = true;
	        if (hype.is_latest_subscriber) {
	            $('.latest_subscribers').trigger('addUser', [user]);
	        }
	        if (hype.user && hype.user.id == myUser.id) {
	            alert('A Sub! That is you!');
	            $('.donate.special_buttons').addClass('new_subscriber');
	        }
	        if (hype.message) {
	            _BrowserNotification.BrowserNotification.showNotificationBar(hype.message);
	        } else {
	            if (hype.gift_user) {
	                _BrowserNotification.BrowserNotification.showNotificationBar(hype.gift_user.username + ' Gifted Sub Hype for ' + user.username + '!');
	            } else {
	                if (hype.amount >= 50) {
	                    _BrowserNotification.BrowserNotification.showNotificationBar('Year Long Sub Hype! ' + user.username + '! O.O!');
	                } else {
	                    _BrowserNotification.BrowserNotification.showNotificationBar('Sub Hype! ' + user.username + '! A New Pikachu Warrior is Born!');
	                }
	            }
	        }
	    } else if (hype.type == 'message') {
	        playSound = hype.play_sound;
	        _BrowserNotification.BrowserNotification.showNotificationBar(hype.message);
	    }
	
	    if (!_Settings.Settings.isChecked('sub_hype_notification_sound')) {
	        return;
	    }
	    if (playSound && hype.amount >= 50 || hype.is_super_hype) {
	        _MatchSounds.MatchSounds.playSubHypeSoundEffect('bumped');
	    } else if (playSound) {
	        _MatchSounds.MatchSounds.playSubHypeSoundEffect();
	    }
	};
	ServerMessageController.prototype.rank_change = function (response) {
	    if (!isInLadder) {
	        return;
	    }
	    var notification = new MatchEndNotification($('.match_result_notification.template').clone().removeClass('template'), response.rank_change);
	    var popup = $.fancybox({
	        content: notification.getContent()
	    });
	    notification.start();
	};
	ServerMessageController.prototype.bug_notifications = function (response) {
	    var notification = response.bug_notifications;
	    var element = $('#header_bug_notification .new_bug_notification').text(notification.count);
	
	    if (notification.count) element.show();else element.hide();
	};
	ServerMessageController.prototype.flagged_matches = function (response) {
	    var notification = response.flagged_matches;
	    if (typeof response.flagged_matches.count != 'undefined') {
	        var element = $('#flagged_matches_notification_count').text(response.flagged_matches.count);
	        if (notification.count) element.show();else element.hide();
	    }
	};
	ServerMessageController.prototype.featured_streams = function (response) {
	    var streamContainer = $('#stream_container');
	    streamContainer.trigger('updateStreams', [response.featured_streams]);
	};
	ServerMessageController.prototype.mod_ban_notification = function (response) {
	    var notification = response.mod_ban_notification;
	    var count = notification.count;
	    var element = $('#ban_appeal_notifications_count');
	
	    if (typeof count != 'undefined') {
	        if (count) {
	            element.show();
	        } else {
	            element.hide();
	        }
	        element.text(count);
	    }
	    if (notification.is_new) {
	        var notificationUser = _matchmaking.Users.update(notification.bug.submitter);
	        var chatNotification = _BrowserNotification.BrowserNotification.showNotification(notificationUser.username + ' Ban Discussion', {
	            body: notification.bug.description,
	            icon: siteUrl + '/images/random/BibleThump.jpg',
	            onClick: function onClick() {
	                window.open(notification.bug.url);
	            }
	        }).showInChatAlso(true);
	
	        var usernameElement = notificationUser.createUsernameElement();
	        var chatNotificationTitle = $('<span>').addClass('chat_notification_title').text(' (Ban Discussion) ');
	        chatNotification.empty();
	
	        var link = $('<a>').attr('href', notification.bug.url).attr('target', '_blank');
	        chatNotification.append(link);
	        var lengthOfDescription = 70;
	        var textSummaryString = notification.bug.description.length > lengthOfDescription ? notification.bug.description.substring(0, lengthOfDescription) + '...' : notification.bug.description;
	        link.append(usernameElement).append(chatNotificationTitle).append(' - ').append($('<span>').addClass('description_summary').text(textSummaryString)).attr('title', notification.bug.description);
	
	        if (chatNotification.data('chatConatiner') && chatNotification.data('chatConatiner').data('reScroll')) {
	            chatNotification.data('chatConatiner').trigger('reScroll');
	        }
	    }
	};
	ServerMessageController.prototype.mod_notifications = function (response) {
	    var notification = response.mod_notifications;
	    var container = $('#header_mod_notification');
	    var element = container.find('.new_mod_notification').text(notification.count);
	
	    if (notification.count) {
	        container.addClass('has_notifications');
	        element.show();
	    } else {
	        element.hide();
	    }
	
	    if (notification.is_new) {
	        var notificationUser = _matchmaking.Users.update(notification.bug.submitter);
	        var chatNotification = _BrowserNotification.BrowserNotification.showNotification(notification.bug.title + ' Mod Notification', {
	            body: notification.bug.description,
	            icon: siteUrl + '/images/random/BibleThump.jpg',
	            onClick: function onClick() {
	                window.open(notification.bug.url);
	            }
	        }).showInChatAlso(true);
	        if (chatNotification) {
	            var usernameElement = notificationUser.createUsernameElement();
	            var chatNotificationTitle = $('<span>').addClass('chat_notification_title').text(' (Report To Mods) ' + notification.bug.title + ' ');
	            chatNotification.empty();
	
	            var link = $('<a>').attr('href', notification.bug.url).attr('target', '_blank');
	            chatNotification.append(link);
	            var lengthOfDescription = 70;
	            var textSummaryString = notification.bug.description.length > lengthOfDescription ? notification.bug.description.substring(0, lengthOfDescription) + '...' : notification.bug.description;
	            link.append(usernameElement).append(chatNotificationTitle).append(' - ').append($('<span>').addClass('description_summary').text(textSummaryString)).attr('title', notification.bug.description);
	
	            if (chatNotification.data('chatConatiner') && chatNotification.data('chatConatiner').data('reScroll')) {
	                chatNotification.data('chatConatiner').trigger('reScroll');
	            }
	        }
	        _MatchSounds.MatchSounds.playModNotification();
	    } else {
	        if (notification.bug) {
	            var bug = notification.bug;
	            if (!bug.modified_by) {
	                bug.modified_by = {};
	            }
	            if (bug.fixed) {
	                _BrowserNotification.BrowserNotification.showNotification(bug.title, {
	                    body: 'Marked resolved by ' + bug.modified_by.username
	                });
	            } else {
	                _BrowserNotification.BrowserNotification.showNotification('Reopened Notification from ' + bug.submitter.username + ': ' + bug.title, { body: 'Opened by ' + bug.modified_by.username });
	            }
	        }
	    }
	};
	ServerMessageController.prototype.kicked_from_chat = function (response) {
	    $('.chat_tab:not(.template)').each(function (i, tab) {
	        if ($(tab).data('chat') && $(tab).data('chat').data('chat_room_id') == response.kicked_from_chat.id) {
	            _ChatActions.ChatActions.leaveChatRoom($(tab).data('chat'));
	            //alert("You've been kicked from "+response.kicked_from_chat.name);
	        }
	    });
	};
	ServerMessageController.prototype.muted_from_chat = function (response) {
	    if (response.muted_from_chat.id) {
	        _ChatActions.ChatActions.addNotificationToChat(null, "You've been muted in " + response.muted_from_chat.name + " until " + _DateFormat.DateFormat.full(response.muted_from_chat.until) + (response.muted_from_chat.reason ? " Reason: " + $('<div>').text(response.muted_from_chat.reason).text() : ''));
	    } else {
	        _ChatActions.ChatActions.addNotificationToChat(null, "You've been muted from chatting until " + _DateFormat.DateFormat.full(response.muted_from_chat.until) + (response.muted_from_chat.reason ? " Reason: " + $('<div>').text(response.muted_from_chat.reason).text() : ''));
	    }
	};
	ServerMessageController.prototype.acceptedAChallenge = function (response) {
	    if (!matchmakingDisabled && isInLadder) {
	        var searches = _LadderInfo.LadderInfo.retrieveReference('matchSearches');
	        $.each(response.userChanges, function (i, user) {
	            var userId = user.id;
	            $.each(searches.items, function (i, item) {
	                if (item.data.player1.id == userId) {
	                    _LadderInfo.LadderInfo.forceRemove('matchSearches', item.data.id);
	                }
	            });
	        });
	    }
	};
	ServerMessageController.prototype.chat_rooms = function (response) {
	    _ChatActions.ChatActions.updateChatsFromInfo(response);
	};
	ServerMessageController.prototype.private_chat = function (response) {
	    var newMessages = [];
	    $.each(response.private_chat, function (userId, chat) {
	        var pmWindow;
	        if (!chat.id) {
	            chat.id = userId;
	        }
	        pmWindow = _PrivateChatLoader.PrivateChatLoader.getPrivateChat({ id: chat.id, username: chat.username, chat: chat });
	
	        if (!pmWindow) {
	            return; //Window might not be initialized yet
	        }
	        var newMessage = _Populate.Populate.chat(chat, pmWindow.data('chatHolder').find('.chat_container'));
	        if (newMessage) {
	            if (!pmWindow.hasClass('opened')) {
	                pmWindow.addClass('has_new_messages');
	            } else {
	                _Request.Request.send({ from_user: userId }, 'read_all_private_messages');
	            }
	            var directChatsElement = pmWindow.data('listing');
	            if (directChatsElement) {
	                directChatsElement.addClass('has_new_messages');
	                var quickSummaryMessage;
	                if (newMessage.player && newMessage.player.username) {
	                    quickSummaryMessage = newMessage.player.username + ' - ' + newMessage.message;
	                } else {
	                    quickSummaryMessage = newMessage.message;
	                }
	                directChatsElement.find('.message_summary').text(quickSummaryMessage).attr('title', newMessage.message).removeClass('no_messages');
	                directChatsElement.prependTo('#private_chat_listing');
	                directChatsElement.find('.time').add(pmWindow.find('.time')).timestampUpdate(newMessage.time);
	            }
	            if (chat.username) {
	                if (chat.notification) {
	                    var chatUpdateMessage = _BrowserNotification.BrowserNotification.showNotification(chat.notification.title, chat.notification);
	                }
	                if (pmWindow.hasClass('opened')) {
	                    chatUpdateMessage = null;
	                }
	                if (chatUpdateMessage) {
	                    chatUpdateMessage = chatUpdateMessage.showInChatAlso(true);
	                    chatUpdateMessage.click(function (e) {
	                        if ($(e.target).hasClass('username')) {
	                            return;
	                        }
	                        e.stopImmediatePropagation();
	
	                        _PrivateChatLoader.PrivateChatLoader.openPrivateChat({ username: chat.username, id: chat.id }).load();
	                    });
	                    setTimeout(function () {
	                        if (chat.notification && chat.notification.tag) {
	                            _BrowserNotification.BrowserNotification.clearTag(chat.notification.tag);
	                        }
	                    }, 60000);
	                    chatUpdateMessage.addClass('direct_chat_notification');
	                    var messagePart = chatUpdateMessage.find('.message');
	                    var username = $('<span>').addClass('username').text(chat.username).data('username', chat.username);
	                    messagePart.empty();
	                    messagePart.append($('<span>').addClass('chatlink').text('Direct Chat From '));
	                    messagePart.append(username);
	                    var messageText = $('<span>').addClass('chatlink');
	                    messageText.text(' ' + newMessage.message);
	                    messagePart.append(messageText).addClass('chatlink');
	
	                    if (chatUpdateMessage.data('chatConatiner') && chatUpdateMessage.data('chatConatiner').data('reScroll')) {
	                        chatUpdateMessage.data('chatConatiner').trigger('reScroll');
	                    }
	                }
	            }
	            _PrivateChatLoader.PrivateChatLoader.appendChatElements(pmWindow);
	            newMessages.push(newMessage);
	        }
	        _PrivateChatLoader.PrivateChatLoader.updateUnreadPrivateMessageCount();
	    });
	    if (newMessages.length) {
	        $.each(newMessages, function (i, message) {
	            if (message.player && message.player.id != myUserId) {
	                _MatchSounds.MatchSounds.playPrivateMessageSoundEffect();
	                return false;
	            }
	        });
	    }
	};
	ServerMessageController.prototype.current_matches = function (response) {
	    if (matchmakingDisabled || !isInLadder) return;
	    _LadderInfo.LadderInfo.parseChanges('currentMatches', response.current_matches);
	};
	ServerMessageController.prototype.open_challenges = function (response) {
	    if (matchmakingDisabled || !isInLadder) return;
	    _LadderInfo.LadderInfo.parseChanges('openChallenges', response.open_challenges);
	};
	ServerMessageController.prototype.awaiting_replies = function (response) {
	    if (matchmakingDisabled || !isInLadder) return;
	    _LadderInfo.LadderInfo.parseChanges('awaitingReplies', response.awaiting_replies);
	};
	ServerMessageController.prototype.userChanges = function (response) {
	    var matches = _LadderInfo.LadderInfo.retrieveReference('currentMatches');
	    $.each(response.userChanges, function (i, user) {
	        user = _matchmaking.Users.update(user);
	        user.updateElements();
	        //var elements = PlayerUpdater.getPlayerListElementsByPlayerId(user.id);
	        //elements.each(function(){
	        //	var element = $(this);
	        //	ElementUpdate.user(element,user);
	        //});
	
	        _Ladder.ladder.log(matches);
	        //$.each(matches.items,function(i,container){
	        //	container = container.element;
	        //	ladder.log('container to update');
	        //	ladder.log(container);
	        //
	        //});
	    });
	};
	ServerMessageController.prototype.recent_private_chats = function (response) {
	    _LadderInfo.LadderInfo.parseChanges('recentPrivateMessages', response.recent_private_chats);
	};
	ServerMessageController.prototype.chat_events = function (response) {
	    if (response.chat_events) {
	        var events = response.chat_events;
	        if (events.invited) {
	            $.each(events.invited, function (chatId, event) {
	                var chat = event.chat;
	                var invitee = _matchmaking.Users.update(event.by);
	
	                var container = $('<span>');
	                var usernameElement = invitee.createUsernameElement();
	                var chatElement = $('<span>').addClass('chatlink').text("You've been invited to " + chat.name + " by ").data('chatlink', chat.name);
	                container.append(chatElement).append(usernameElement);
	                _ChatActions.ChatActions.addNotificationToChat(null, container);
	            });
	        }
	    }
	    /**
	     * Socket_Pusher::send_to_user($invite_player,array('chat_events'=>array('invited'=>array(
	     $chat->id=>array(
	     'chat'=>$chat->array_serialize(),
	     'by'=>$invite_player->array_serialize())
	     ))
	     )
	     */
	};
	ServerMessageController.prototype.stub = function (response) {};
	
	var ServerMessage = exports.ServerMessage = new ServerMessageController();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PrivateChatLoader = undefined;
	
	var _matchmaking = __webpack_require__(10);
	
	var _ChatActions = __webpack_require__(4);
	
	var _Populate = __webpack_require__(40);
	
	var _Dashboard = __webpack_require__(5);
	
	var _PlayerUpdater = __webpack_require__(51);
	
	var _Ladder = __webpack_require__(26);
	
	var _PrivateChatLoader = function PrivateChatLoader() {
	    var _this = this;
	
	    var self = this;
	    this.currentTimeout = null;
	    this.activePrivateChat = null;
	    this.privateWindowsById = {};
	    this.getActivePrivateChat = function () {
	        if (_this.activePrivateChat) {
	            return _this.activePrivateChat;
	        } else {
	            return null;
	        }
	    };
	    this.load = function () {};
	    this.delayLoad = function () {
	        self.load();
	        self.currentTimeout = setTimeout(function () {}, 1200);
	    };
	    this.openPrivateChat = function (user) {
	        if (self.currentTimeout) {
	            clearTimeout(self.currentTimeout);
	        }
	
	        var chat = self.getPrivateChat(user);
	
	        self.minimizeAllPrivateChats(chat);
	
	        if (!chat) {
	            return null; //Chat failed to be initialized
	        }
	        if (chat.hasClass('opened')) {
	            self.positionPrivateChat(chat);
	            self.updateUnreadPrivateMessageCount();
	            return chat;
	        }
	        chat.addClass('opened');
	
	        var data = {
	            username: user.username
	        };
	        var privateChatHolder = chat.findCache('.chat_container');
	
	        //Retrieves and appends chat to appropriate container
	        var chatHolder = privateChatHolder.closest('.chat_holder');
	
	        var updateHistory = !_Dashboard.Dashboard.dashboard.hasClass('dashboard-md') || _Dashboard.Dashboard.directChatsTab.hasClass('active');
	        if (updateHistory) {
	            _Dashboard.Dashboard.directChatsTab.trigger('activate');
	            var directChatContent = _Dashboard.Dashboard.directChatsTab.data('paneContainer');
	            directChatContent.addClass('chatting');
	            chatHolder.appendTo($('#big_private_chat').findCache('.private_chat_holder'));
	            chatHolder.css({ height: '', left: '', width: '' });
	        } else {
	            var privateChatsHolder = $('#private_chats');
	            chatHolder.appendTo($('#bottom_dock').findCache('.private_chat_holder')).addClass('float_displayed').css({ height: privateChatsHolder.data('default-height'),
	                width: privateChatsHolder.data('default-width') });
	            self.positionPrivateChat(chat);
	        }
	
	        chat.data('chatHolder', chatHolder);
	        chatHolder.data('chat', chat);
	
	        _ChatActions.ChatActions.resizeOpenChats();
	
	        if (chat.is(':visible')) chat.stop().fadeTo(0, 1);
	
	        if (chat.data('listing')) {
	            chat.data('listing').removeClass('has_new_messages').removeClass('closed_chat');
	        }
	        _PrivateChatLoader.updateUnreadPrivateMessageCount();
	        if (chat.data('player_id')) {
	            data.id = chat.data('player_id');
	            // chatHolder.show();
	        }
	
	        var chatContainer = chatHolder.find('.chat_container');
	        _ChatActions.ChatActions.scrollToBottom(chatContainer);
	
	        if (chatHolder.is(':visible')) chatHolder.find('.chat_input').focus().trigger('focus');
	
	        //Chat was opened before so the chat window exists already
	
	        // var loader = getListLoader();
	        if (chat.data('privateXhr')) {
	            chat.data('privateXhr').abort();
	        }
	        chatHolder.addClass('loading');
	
	        self.finished = function () {
	            chatHolder.removeClass('loading');
	            chatHolder.removeClass('loading_error');
	        };
	
	        self.activePrivateChat = chat;
	        self.load = function (loadCallback) {
	            //So that it may be called later
	            var xhr = $.post(siteUrl + '/matchmaking/private_chat', data);
	            chat.data('privateXhr', xhr);
	            xhr.then(function (response) {
	                if (loadCallback) {
	                    loadCallback(chatHolder, response);
	                }
	                if (response.success) {
	                    chat.removeClass('has_new_messages');
	                    _PrivateChatLoader.updateUnreadPrivateMessageCount();
	                    chatHolder.removeClass('loading');
	                    chatHolder.removeClass('loading_error');
	                    if (response.private_chat_user) {
	                        if (response.friendship_required) {
	                            chatHolder.addClass('friendship_required');
	                        }
	                        //chat.show();
	                        //chatHolder.show();
	                        user = _matchmaking.Users.update(response.private_chat_user);
	                        chatHolder.addClass('user_pm_' + (user.username ? user.username.toLowerCase() : ''));
	                        chat.data('player_id', user.id);
	
	                        user.updateUserElements(chatHolder.findCache('.chat_title.user'));
	                        chatHolder.resizable({
	                            ghost: true,
	                            handles: 'n, e, w, ne, nw',
	                            start: function start(event, ui) {
	                                chatHolder.css({
	                                    position: "relative !important"
	                                });
	                            },
	                            stop: function stop(event, ui) {
	                                $('#private_chats').data('default-height', ui.size.height).data('default-width', ui.size.width);
	                                chatHolder.css({
	                                    position: "",
	                                    top: ""
	                                });
	                            }
	                        });
	                        chatHolder.find('.title_area').off('click').on('click', function (e) {
	                            if ($(e.target).hasClass('closing_x')) {
	                                return;
	                            }
	                            e.stopImmediatePropagation();
	                            return _PrivateChatLoader.togglePrivateChat(chat);
	                        });
	                        //					chatHolder.show();
	                        chat.removeClass('pending');
	                        chat.data('username', user.username);
	                        self.cacheChat(chat);
	                        chat.data('player_id', user.id);
	
	                        user.updateUserElements(chat.find('.chat_title'));
	
	                        if (user.private_chat) {
	                            _Populate.Populate.chat(user.private_chat, privateChatHolder, false); //TODO: Used to be true.. let's see what happens...
	                            _PlayerUpdater.PlayerUpdater.getPlayerListElementsByPlayerId(user.id).removeClass('has_new_messages');
	                        }
	                    }
	                } else {
	                    if (!response.serverError) {
	                        self.unCacheChat(chat);
	                        chat.data('chatHolder').remove();
	                        chat.remove();
	                    }
	                    // loader.remove();
	                }
	                return null;
	            });
	        };
	        return self;
	    };
	
	    this.minimizeAllPrivateChats = function (exceptions) {
	        if (self.activePrivateChat) {
	            if (exceptions && self.activePrivateChat[0] === exceptions[0]) {
	                return;
	            }
	            self.activePrivateChat.each(function () {
	                self.closePrivateChat($(this));
	            });
	        }
	    };
	};
	_PrivateChatLoader.prototype.cacheChat = function (chat) {
	    if (chat.data('player_id')) {
	        this.privateWindowsById[chat.data('player_id')] = chat;
	    }
	};
	_PrivateChatLoader.prototype.unCacheChat = function (chat) {
	    if (chat.data('player_id')) {
	        delete this.privateWindowsById[chat.data('player_id')];
	    }
	};
	_PrivateChatLoader.prototype.closePrivateChat = function (chat) {
	    if (chat.data('privateXhr')) {
	        chat.data('privateXhr').abort();
	    }
	    if (this.activePrivateChat && chat[0] === this.activePrivateChat[0]) {
	        this.activePrivateChat = null;
	    }
	    var userId = chat.data('player_id');
	    var pmArea = chat.data('chatHolder');
	
	    pmArea.appendTo(chat.findCache('.private_window_display'));
	    pmArea.removeClass('float_displayed');
	    chat.removeClass('opened');
	
	    _Dashboard.Dashboard.directChatsTab.data('paneContainer').removeClass('chatting');
	    return chat;
	};
	
	_PrivateChatLoader.prototype.positionPrivateChat = function (chat) {
	
	    if (!_Dashboard.Dashboard.dashboard.hasClass('dashboard-sm') || _Dashboard.Dashboard.directChatsTab.hasClass('active')) {
	        return;
	    }
	    var privateChatHolder = chat.data('chatHolder');
	
	    var windowLeft = $(window).scrollLeft();
	    var windowRight = $(window).scrollLeft() + $(window).width();
	
	    var chatRight = chat.offset().left + privateChatHolder.width();
	    var chatLeft = chat.offset().left + 16;
	
	    if (chatLeft < windowLeft) chatLeft = windowLeft + 16;
	    if (chatRight > windowRight) chatLeft = windowRight - privateChatHolder.width();
	
	    var chatHolder = privateChatHolder.closest('.chat_holder').css('left', chatLeft);
	};
	
	_PrivateChatLoader.prototype.updateUnreadPrivateMessageCount = function () {
	    var unread = $('.private_window.has_new_messages').length;
	    if (unread > 0) {
	        $('#header_inbox_bar').find('.badge').text(unread);
	        $('#direct_message_count').text(unread).show();
	    } else {
	        $('#header_inbox_bar').find('.badge').empty();
	        $('#direct_message_count').hide();
	    }
	};
	_PrivateChatLoader.prototype.togglePrivateChat = function (chat) {
	    if (chat.hasClass('opened')) {
	        _PrivateChatLoader.closePrivateChat(chat);
	    } else {
	        var username, id;
	        if (chat.data('username')) {
	            username = chat.data('username');
	        } else {
	            username = chat.find('.user:first').text();
	        }
	        if (chat.data('player_id')) {
	            id = chat.data('player_id');
	        }
	        var loader = this.openPrivateChat({ username: username, id: id });
	        if (false) {
	            chat.data('delayLoad', false);
	            loader.delayLoad();
	        } else {
	            loader.load();
	        }
	    }
	};
	
	var privateChatWindowTemplate;
	var privateChatListingTemplate;
	_PrivateChatLoader.prototype.getPrivateChat = function (user, autoCreate) {
	    var _this2 = this;
	
	    if (typeof autoCreate == 'undefined') {
	        autoCreate = true;
	    }
	    var chat;
	    var userChat = user.chat;
	
	    if (user.id == myUser.id || user.username == myUser.username) {
	        return;
	    }
	
	    if (user.id) {
	        user = _matchmaking.Users.create(user);
	        chat = this.privateWindowsById[user.id];
	    } else {
	        alert('not enough info!');
	        _Ladder.ladder.log('Not enough info to retrieve chat');
	        _Ladder.ladder.log(user);
	        return;
	    }
	
	    if (chat && chat.length) {
	        return chat;
	    } else if (autoCreate) {
	        if ($('.private_window.pending').length) {
	            return null;
	        }
	        if (!privateChatWindowTemplate) {
	            privateChatWindowTemplate = $('.private_window.template').remove().removeClass('template');
	        }
	        //Start a new chat
	        chat = privateChatWindowTemplate.clone();
	        chat.data('user', user);
	
	        var listing = _PrivateChatLoader.getListingForChat(chat);
	
	        var chatAndListing = chat.add(listing);
	        user.updateUserElements(chatAndListing.find('.user'));
	
	        var chatContainer = chat.find('.chat_container').on('click', '.streamlink', function (e) {
	            e.preventDefault();
	            var button = $(this);
	            _ChatActions.ChatActions.onStreamlinkClick(button, e);
	        });
	        chatContainer.on('scroll', _ChatActions.ChatActions.chatScroll);
	
	        if (!_PrivateChatLoader.hasEventsSet) {
	            _PrivateChatLoader.hasEventsSet = true;
	            _ChatActions.ChatActions.attachUniversalChatActions($('.private_chat_holder'));
	        }
	
	        chat.find('.send_chat_button').prop('disabled', false);
	
	        var input = chat.find('.chat_input').keydown(function (e) {
	            var goToNext = false;
	            var next;
	            if (e.which == _Dashboard.Dashboard.keyCodes.ESCAPE) {
	                goToNext = true;
	            }
	            if (e.which == _Dashboard.Dashboard.keyCodes.TAB && e.shiftKey) {
	                e.preventDefault();
	                next = chat.prevAll('.private_window').not('.template').first();
	                if (!next || !next.length || next.hasClass('template')) {
	                    next = $('.private_window').last();
	                }
	                if (next.length && next[0] !== chat[0]) {
	                    next.data('delayLoad', true);
	                    next.trigger('click');
	                }
	                return;
	            }
	
	            if (e.which == _Dashboard.Dashboard.keyCodes.ESCAPE) {
	                next = chat.nextAll('.private_window').first();
	                _this2.removePrivateChat(chat);
	            }
	            if (e.which == _Dashboard.Dashboard.keyCodes.TAB || goToNext) {
	                e.preventDefault();
	                if (!next || !next.length) {
	                    next = chat.nextAll('.private_window').first();
	                }
	                if (!next.length || next.hasClass('template')) {
	                    if (e.which == _Dashboard.Dashboard.keyCodes.ESCAPE) {
	                        next = $('.private_window').last();
	                    } else {
	                        next = $('.private_window').first();
	                    }
	                }
	                if (next.length && next[0] !== chat[0]) {
	                    if (e.which != _Dashboard.Dashboard.keyCodes.ESCAPE) {
	                        next.data('delayLoad', true);
	                    }
	                    next.trigger('click');
	                    _Dashboard.Dashboard.directChatsTab.data('paneContainer').addClass('chatting');
	                } else {
	                    _Dashboard.Dashboard.directChatsTab.data('paneContainer').removeClass('chatting');
	                }
	                return;
	            }
	        }).addClass('chat_autocomplete');
	        input.data('chatContainer', chatContainer);
	
	        chat.find('.closing_x').click(function (e) {
	            e.stopPropagation();
	            _PrivateChatLoader.removePrivateChat(chat);
	        });
	
	        if (!user.username || !user.id) {
	            chat.addClass('pending');
	        } else {
	            //				chat.css('display','table-cell');
	        }
	
	        if (userChat && userChat.message && userChat.message.message) {
	            var quickSummaryMessage;
	            if (userChat.message.username) {
	                quickSummaryMessage = userChat.message.username + ' - ' + userChat.message.message;
	            } else {
	                quickSummaryMessage = userChat.message.message;
	            }
	            listing.find('.message_summary').text(quickSummaryMessage).attr('title', userChat.message.message).removeClass('no_messages');
	            listing.find('.time').add(chat.find('.time')).timestampUpdate(userChat.message.date);
	        } else {
	            listing.find('.message_summary').addClass('no_messages');
	        }
	
	        chatAndListing = chat.add(listing); //So that we can copy the attributes to the listing
	        chatAndListing.attr('title', user.username);
	        // chatAndListing.find('input[name=username]').val(user.username);
	        chatAndListing.data('player_id', user.id);
	        chatAndListing.data('chatHolder', chat.find('.chat_holder'));
	
	        this.cacheChat(chat);
	        var chatHolder = chat.data('chatHolder');
	
	        var privateChatListings = $('#private_chat_listing');
	        if (!privateChatListings.find('.private_chat_' + user.id).length) {
	            listing.addClass('private_chat_' + user.id).prependTo('#private_chat_listing');
	            if (userChat && userChat.message && userChat.message.is_open === false) {
	                listing.addClass('closed_chat');
	            }
	        }
	
	        if (userChat && userChat.message && userChat.message.is_open === false) {
	            //Don't append, just let it float out in the wilderness..?
	            chat.addClass('detached');
	        } else {
	            chat.appendTo('#private_chats');
	            $('#bottom_dock').addClass('has_direct_messages');
	            $('#dashboard').addClass('has_direct_messages');
	        }
	        return chat;
	    }
	};
	function getPrivateChatListingTemplate() {
	    if (!privateChatListingTemplate) {
	        privateChatListingTemplate = $('.private_chat_listing.template').remove().removeClass('template');
	    }
	    return privateChatListingTemplate.clone();
	}
	_PrivateChatLoader.prototype.getListingForChat = function (chat) {
	    var listing;
	    var user = chat.data('user');
	    if (chat.data('listing')) {
	        return chat.data('listing');
	    }
	    // if(user.id)
	    // {
	    //     console.log('[ATTEMPTING FIND LISTING]');
	    //     //Attempt to find preexisting listing and attach it
	    //     var preexistingListing = $('#private_chat_listing').find('.private_chat_'+user.id);
	    //     if(preexistingListing.length)
	    //     {
	    //         console.log(' [NOT WASTED]');
	    //         listing = preexistingListing.removeClass('closed_chat');
	    //     }
	    //     else
	    //     {
	    //         console.log(' [WASTED]');
	    //     }
	    // }
	    if (!listing) {
	        listing = getPrivateChatListingTemplate();
	    }
	    chat.data('listing', listing);
	    return listing;
	};
	_PrivateChatLoader.prototype.appendChatElements = function (chat) {
	    if (chat.data('listing').hasClass('closed_chat')) {
	        chat.data('listing').removeClass('closed_chat');
	    }
	
	    if (chat.hasClass('detached')) {
	        chat.removeClass('detached');
	        chat.appendTo('#private_chats');
	    }
	};
	_PrivateChatLoader.prototype.removePrivateChat = function (chat) {
	    var userId = chat.data('player_id');
	    $.post(siteUrl + '/matchmaking/close_private_chat', { player_id: userId });
	    this.unCacheChat(chat);
	    this.closePrivateChat(chat);
	    chat.detach();
	    chat.addClass('detached');
	    chat.data('listing').addClass('closed_chat'); //Don't worry about removing the listing
	};
	
	exports.PrivateChatLoader = _PrivateChatLoader = new _PrivateChatLoader();
	exports.PrivateChatLoader = _PrivateChatLoader;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.Users=undefined;var _UserCollection=__webpack_require__(11);var _MatchModeManager=__webpack_require__(22);var _Match=__webpack_require__(23);var _Location=__webpack_require__(13);var _League=__webpack_require__(16);var _User=__webpack_require__(12);var _Flair=__webpack_require__(21);var _Character=__webpack_require__(2);var _ChatNotification=__webpack_require__(32);var _LadderHistory=__webpack_require__(33);var _ChatMessages=__webpack_require__(34);var _ChatMessage=__webpack_require__(3);var _ChatRoom=__webpack_require__(35);var _MatchSummary=__webpack_require__(36);var _ChatActions=__webpack_require__(4);var _ElementUpdate=__webpack_require__(37);var _Request=__webpack_require__(7);var _DisplayUpdater=__webpack_require__(6);var _LadderInfo=__webpack_require__(30);var _Settings=__webpack_require__(25);var _Popups=__webpack_require__(43);var _SiteLinker=__webpack_require__(44);var _UserInfo=__webpack_require__(47);var _AdvancedMatchHistory=__webpack_require__(49);var _UserlistElement=__webpack_require__(18);var _BrowserNotification=__webpack_require__(24);var _MatchEndNotification=__webpack_require__(50);var _Timer=__webpack_require__(31);var _Html=__webpack_require__(27);var _LadderDistance=__webpack_require__(14);var _PrivateChatLoader=__webpack_require__(9);var _Dashboard=__webpack_require__(5);var _getOrdinal=__webpack_require__(20);var _DateFormat=__webpack_require__(38);var _Ladder=__webpack_require__(26);var _LadderLinker=__webpack_require__(45);var _PlayerUpdater=__webpack_require__(51);var _MatchSounds=__webpack_require__(29);var _Infraction=__webpack_require__(48);var _Ladder2=__webpack_require__(26);var _PostManager=__webpack_require__(52);var _SocketConnection=__webpack_require__(55);var _MatchmakingPopup=__webpack_require__(42);__webpack_require__(56);var LadderInfoGlobal,unreadMessageCount,Users;window.MatchEndNotification=_MatchEndNotification.MatchEndNotification; //For the test page
	window.AdvancedMatchHistory=_AdvancedMatchHistory.AdvancedMatchHistory;$.fn.applyUsernameClasses=function(user){var $this=this;return $this.each(function(){$(this).removeClass(Users.possibleUsernameClasses).addClass(user.cssUsername().join(' '));});};$.fn.timestampUpdate=function(timestamp){var $this=this;return $this.each(function(){var element=$(this);if(typeof timestamp!=='undefined'){element.data('timestamp',timestamp);}if(element.data('timestamp')){element.text(_DateFormat.DateFormat.smart(element.data('timestamp')));}else {element.text('');}});};exports.Users=Users=new _UserCollection.UserCollection();exports.Users=Users;myUser=Users.update(myUser);LadderInfoGlobal=null;unreadMessageCount=0; // emotify.emoticons(siteUrl+'/images/smilies/',{
	//     "FrankerZ":	[ 'FrankerZ.png','Arf arf' ]
	// });
	var dashboard=_Dashboard.Dashboard.dashboard;_Dashboard.Dashboard.playedSoundEffect=true; // var challengeButtonOptionsOnlineUser = {showPlayButtons:true,showOnline:false,showOffline:false,showAway:false};
	// var challengeButtonOptionsMatchmaking = {showPlayButtons:true,showOnline:false,showOffline:false,showAway:false,showMatchSpecificOptions:true};
	// var challengeButtonOptionsMessages = {showPlayButtons:false,showOnline:true,showOffline:true,showAway:false};
	// var challengeButtonOptionsFriends = {showPlayButtons:true,showOnline:false,showOffline:true,showAway:false};
	// var challengeButtonOptionsUserInfo = {showPlayButtons:true,showOnline:false,showOffline:true,showAway:false,inviteToMatch:true};
	// var challengeButtonOptionsUsersOnly = {showPlayButtons:false,showOnline:false,showOffline:false,showAway:false};
	if(isInLadder){$('a').not('.logout').attr("target","_blank");$('.matchmaking_link').click(function(e){e.preventDefault();});}$(document).on('click',function(event){checkDeclickables(event);});$('.chat_rules').click(function(e){var chatRules=$(this);var rules=null;if(chatRules.data('rules')){rules=chatRules.data('rules');}else {rules=$('.chat-rules-popout.template').remove().removeClass('template');chatRules.data('rules',rules);}_Dashboard.Dashboard.ladderPopup(rules.clone(),'Chat Rules');});$('#user_list_information').data('countElement',$('#user_list_information').find('.online_user_count'));$('#main_chat_area').on('click','.chat_room_description .closing_x',function(e){var description=$(this).closest('.chat_room_description');if(description.length){description.hide();var descriptionKey;if(description.data('descriptionId')&&description.data('chatRoomId')){var chatRooms=_Ladder2.ladderLocalStorage.getItem('chat_rooms');if(!chatRooms){chatRooms={};chatRooms.chats={};}if(!chatRooms.chats[description.data('chatRoomId')]){chatRooms.chats[description.data('chatRoomId')]={};}if(chatRooms.chats[description.data('chatRoomId')].last_motd_id!=description.data('descriptionId')){chatRooms.chats[description.data('chatRoomId')].last_motd_times_closed=0;}chatRooms.chats[description.data('chatRoomId')].last_motd_times_closed++;chatRooms.chats[description.data('chatRoomId')].last_motd_id=description.data('descriptionId');_Ladder2.ladderLocalStorage.setItem('chat_rooms',chatRooms);}}});$('.search_dropdown_button').click(function(e){var button=$(this);var dropdown=button.next('.dropdown-menu');dropdown.data('canBeUnclicked',true);if(dropdown.is(':visible')){button.trigger('notClicked');}else {_Ladder.Ladder.declickables.push(dropdown);dropdown.off('notClicked').on('notClicked',function(){if(dropdown.data('removeFromDeclickables')){button.trigger('notClicked');dropdown.data('removeFromDeclickables',false);}else {dropdown.data('removeFromDeclickables',true);}});dropdown.show().find('input:first').focus().off('keyup').on('keyup',function(e){if(e.keyCode==27){e.preventDefault();$(this).val('');button.trigger('notClicked');}});}}).on('notClicked',function(e){$(this).next('.dropdown-menu').hide();});$('.latest_subscribers').on('addUser',function(e,user){var latestSubsContainer=$(this).find('.sub_area');var latestSub=$('.latest_subscribers .latest_sub.template').clone();latestSub.removeClass('template');latestSub.find('.username').text(user.username);var date=new Date();latestSub.find('.date').text(new Date().format('M d'));var subsList=latestSubsContainer.find('.subs_list');latestSub.hide();latestSub.fadeIn();latestSub.prependTo(subsList);var users=subsList.find('.latest_sub').not('.template');if(users.length>3){users.last().fadeOut('slow',function(){$(this).remove();});}});_Dashboard.Dashboard.friendListButton.on('updateFriend',function(e,friend){var list=$(this).data('list');friend=Users.update(friend);var element;var friendData=friend.friend;if(friendData){if(myFriends[friend.id]){if(!friendData.is_friend&&!friendData.request_sent&&!friendData.waiting_response){element=myFriends[friend.id].elements.friendlistElement;if(element){element.remove();}delete myFriends[friend.id];return;}}}if(myFriends[friend.id]){element=myFriends[friend.id].elements.friendlistElement;if(element){element=element.element;}if(friend.is_online){if(myFriends[friend.id].waitTimer&&myFriends[friend.id].waitTimer.getTime()>new Date().getTime()){}else {var usernameElement=friend.createUsernameElement();var notificationMessage=$('<span>');notificationMessage.append('Your friend ').append(usernameElement).append(' is online.');var addedMessage=_ChatActions.ChatActions.addNotificationToChat(null,notificationMessage);var newDateObj=new Date();newDateObj.setTime(newDateObj.getTime()+10*60*1000);myFriends[friend.id].waitTimer=newDateObj;setTimeout(function(){addedMessage.remove();},120000);}if(element){element.removeClass('is_offline').addClass('is_online');}}else {if(element){element.removeClass('is_online').addClass('is_offline');}myFriends[friend.id].is_online=false;}}else {element=_UserlistElement.UserlistElement.newElement();element.data('challengeButtonOptions',_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsFriends);element.find('.rating_container').hide();_ElementUpdate.ElementUpdate.user(element,friend);friend.elements.friendlistElement=new _UserlistElement.UserlistElement(element,friend);list.append(element);myFriends[friend.id]=friend;}if(element&&friendData){var all=['friend_request_blocked','friend_waiting_response','friend_request_sent','friend_request_null'];element.removeClass(all.join(' '));if(!friendData){ // alert('no friend data');
	}else if(friendData&&friendData.blocked_friend_request){ // alert('blocked');
	element.addClass('friend_request_blocked');}else if(friendData.waiting_response){ // alert('waiting response');
	element.addClass('friend_waiting_response');}else if(friendData.request_sent){ // alert('request sent');
	element.addClass('friend_request_sent');}else { // alert('null');
	element.addClass('friend_request_null');}}}).on('activated',function(e){var button=$(this);var list=button.data('list').addClass('active');_Dashboard.Dashboard.activeRegionButton=button;var hiddenLists=$('.user_lists .list_container').not(list).removeClass('active');list.html('');list.append($('#loading_list').clone().removeAttr('id').removeClass('template'));_ChatActions.ChatActions.resizeOpenChats();_Request.Request.post(siteUrl+'/matchmaking/friend_list',{},function(response){list.empty();myFriends={};if(response.friends&&response.friends.length===0){var emptyList=$('<li>').addClass('empty_result').text('Your friend list is empty!');emptyList.appendTo(list);}else {$.each(response.friends,function(i,player){button.trigger('updateFriend',[player]);});}});}).on('deactivated',function(){$(this).data('list').removeClass('active');}).data('list',$('#friend_list'));$('#ignore_list_button').on('activated',function(s){var button=$(this);var list=button.data('list').addClass('active');var hiddenLists=$('.user_lists .list_container').not(list).removeClass('active');list.html('');list.append($('#loading_list').clone().removeAttr('id').removeClass('template'));_ChatActions.ChatActions.resizeOpenChats();_Request.Request.post(siteUrl+'/matchmaking/ignore_list',{},function(response){list.html('');if(response.ignores&&response.ignores.length===0){var emptyList=$('<li>').addClass('empty_result').text('You like listening to everybody!');emptyList.appendTo(list);}else {$.each(response.ignores,function(i,player){var element=_User.User.getOnlineUserTemplate();element.removeClass('template');element.find('.rating_container').hide();element.data('challengeButtonOptions',_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsUsersOnly);_ElementUpdate.ElementUpdate.user(element,player);list.append(element);});}});}).on('deactivated',function(){$(this).data('list').hide();}).data('list',$('#ignored_users'));$('.rank_filters').on('click','.tier',function(e){var button=$(this);var data={tier_name:button.data('tier_name')};if(button.hasClass('enabled')){data.enabled=0;button.removeClass('enabled');}else {data.enabled=1;button.addClass('enabled');}var elements=$('.recent_match_searcher.'+data.tier_name);if(data.enabled){elements.removeClass('hidden_by_rank');}else {elements.addClass('hidden_by_rank');}_Request.Request.send(data,'toggle_filter',function(response){});});_Dashboard.Dashboard.activityView.on('switchChange.bootstrapSwitch','input[name=show_matches_in_search]',function(event,state){var ladderId=$(this).data('ladder_id');var button=$('#preferred_game_filter_'+ladderId);if(button.data('enabled')){_Dashboard.Dashboard.changeGameFilter(ladderId,false);}else {_Dashboard.Dashboard.changeGameFilter(ladderId,true);}});_Dashboard.Dashboard.changeGameFilter=function(ladderId,activate){var button=$('#preferred_game_filter_'+ladderId);if(activate){button.addClass('on');button.data('enabled',true);$('.recent_match_searcher.game_ladder_id_'+ladderId).removeClass('hidden_by_game');$.post(siteUrl+'/matchmaking/game_filter_change',{game_id:ladderId,enabled:1});}else {_Dashboard.Dashboard.playMatchContainer.removeClass('no_games');button.data('enabled',false);button.removeClass('on');$('.recent_match_searcher.game_ladder_id_'+ladderId).addClass('hidden_by_game');$.post(siteUrl+'/matchmaking/game_filter_change',{game_id:ladderId,enabled:0});}};_Dashboard.Dashboard.matchmakingPane.on('change','.player_preferred_restrictions .restriction input[type=checkbox]',function(e){e.preventDefault();var button=$(this);var setting=button.closest('.restriction');console.log(setting);var data={ladder_id:setting.data('ladder_id'),setting:button.attr('name'),value:button.is(':checked')?1:0};$.post(siteUrl+'/apiv1/update_match_search_restrictions',data,function(response){});});_Dashboard.Dashboard.matchmakingPane.on('click','.acceptable_tiers .tier_select',function(e){e.preventDefault();var button=$(this).find('input[name=tier_select]');var ladderId=button.data('ladder_id');var tierId=button.val();var direction=button.data('direction');var container=$(this).closest('.setting');var allLabels=container.find('label');var label=$(this);if(container.hasClass('disabled')){return;}if(label.hasClass('selected')){label.removeClass('selected');label.find(':input').removeClass('selected');tierId=null;}else {allLabels.removeClass('selected');allLabels.find(':input').removeClass('selected');label.addClass('selected');label.find(':input').addClass('selected');}container.addClass('disabled');$.post(siteUrl+'/match/match_tier_settings/'+ladderId,{action:'tier_preference',value:tierId,direction:direction}).done(function(response){if(response.success){}else {alert('Error Saving');}}).fail(function(){alert('Error saving');}).always(function(){container.removeClass('disabled');});});_Dashboard.Dashboard.activityView.on('click','.stats',function(e){e.preventDefault();var button=$(this);var ladderId=$(this).data('ladder_id');var url=siteUrl+'/match/activity/'+ladderId;var activityView=_Dashboard.Dashboard.activityView;if(!activityView.data('eventsSet')){activityView.data('eventsSet',true);activityView.on('click','.back',function(e){e.preventDefault();_MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SEARCH);_ChatActions.ChatActions.resizeOpenChats();});}if(button.hasClass('loading')){return;}button.addClass('loading');var finished=function finished(){button.removeClass('loading');};$.post(url,{}).done(function(response){if(response.html){if(_MatchModeManager.matchModeManager.getCurrentViewMode()==_MatchModeManager.MatchModeManager.modes.SEARCH||_MatchModeManager.matchModeManager.getCurrentViewMode()==_MatchModeManager.MatchModeManager.modes.ACTIVITY_MODE){_MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.ACTIVITY_MODE);activityView.html(response.html);}}});});_Dashboard.Dashboard.matchmakingPane.on('click','.play',function(e){return;var gameFilters=_Dashboard.Dashboard.gameFilters;if(gameFilters.hasClass('disabled')){return;}if($(this).is(':animated')){return;}$(this).fadeTo(500,0,function(){$(this).fadeTo(500,1);});gameFilters.addClass('game_select_mode');});_Dashboard.Dashboard.gameFilters.on('click','.preferred_game_filter',function(e){_Dashboard.Dashboard.startMatchWithPlayer=null;if(_Dashboard.Dashboard.gameFilters.hasClass('disabled')){alert('You are currently disconnected from the server');return;} // Dashboard.gameFilters.removeClass('game_select_mode');
	var myFilter=$(this).closest('.preferred_game_filter');if(e.which==1){_MatchmakingPopup.MatchmakingPopup.showMatchSelectDialog(myFilter.data('id')).then(function(){$.post(siteUrl+'/match/match_tier_settings/'+myFilter.data('id'),function(response){$('#match_settings_holder').append(response.html);});});}else if(e.which==2){ // Dashboard.changeGameFilter(myFilter.data('id'), !myFilter.hasClass('on'));
	}});_Dashboard.Dashboard.playMatchContainer.on('click','.edit_preferred_games',function(e){e.preventDefault();_Dashboard.Dashboard.retrieveNamedTab('game_preferences').trigger('activate');});$('#game_preferences_container').on('click','.back_button',function(e){_Dashboard.Dashboard.retrieveNamedTab('matchmaking').trigger('activate');});_Dashboard.Dashboard.retrieveNamedTab('game_preferences').on('activate',function(e){var container=$('#game_preferences_container');container.addClass('loading');var finished=function finished(){container.removeClass('loading');};$.get(siteUrl+'/account/game-preferences',function(response){var data=$(response);var games=data.find('.preferred_games_container .game');$('#game_preferences_content').html(games);finished();},'html').error(function(){finished();});});$('#game_preferences_content').on('change','.game_selection',function(e){var ladders=$('#game_preferences_content').find(':input');var data=ladders.serializeArray();data.push({'name':'json',value:1});data.push({'name':'update_preferred_games',value:1});_Request.Request.generalSend(data,siteUrl+'/account/game-preferences',function(response){return true;});});_Dashboard.Dashboard.matchmakingPane.on('click','.game_settings_link',function(e){e.preventDefault();var button=$(this);var ladderId=button.data('ladder_id');var url=siteUrl+'/match/settings/'+ladderId;var activityView=_Dashboard.Dashboard.activityView;if(!activityView.data('eventsSet')){activityView.data('eventsSet',true);activityView.on('click','.back',function(e){e.preventDefault();_MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SEARCH);_ChatActions.ChatActions.resizeOpenChats();});}if(button.hasClass('loading')){return;}button.add(container).addClass('loading');var finished=function finished(){button.add(container).removeClass('loading');};$.post(url,{}).done(function(response){if(response.html){if(_MatchModeManager.matchModeManager.getCurrentViewMode()==_MatchModeManager.MatchModeManager.modes.SEARCH||_MatchModeManager.matchModeManager.getCurrentViewMode()==_MatchModeManager.MatchModeManager.modes.SELECT_OPTIONS){_MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.ACTIVITY_MODE);activityView.html(response.html);}}finished();}).fail(function(){finished();});});$('#visible_stream').draggable({axis:'x',handle:'.name',start:function start(event,ui){$(this).addClass('noclick');},stop:function stop(event,ui){$(this).removeClass('noclick');},drag:function drag(event,ui){}}).resizable({ghost:true,handles:'n, e, w, ne, nw',start:function start(e,ui){$('#visible_stream').css({position:"relative !important",top:"0 !important",left:"0 !important"});},stop:function stop(e,ui){$('#visible_stream').css({position:"",top:"",left:""});}});$('.play_match_container, #current_matches_holder').on('click','.match_popout',function(e){e.preventDefault();var w=600;var h=800;var left=screen.width/2-w/2;var top=screen.height/2-h/2;closeMatchmakingArea();var newWindow=window.open(siteUrl+'/netplay?match_only&tab=battle','match_popup','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);newWindow.onbeforeunload=function(){$('.open_matchmaking_area').trigger('click');};});function closeMatchmakingArea(){_Dashboard.Dashboard.battleTab.trigger('deactivate');}function openMatchmakingArea(){_Dashboard.Dashboard.battleTab.trigger('activate');};$('#private_chats').draggable({axis:'x',start:function start(event,ui){$(this).addClass('noclick');},stop:function stop(event,ui){$(this).removeClass('noclick');},drag:function drag(event,ui){var displayedChat=$('.private_chat_area.float_displayed');var newTop=ui.position.top;var newLeft=ui.position.left;if(ui.position.left<0){newLeft=0;}ui.position.left=newLeft;if(displayedChat.length)_PrivateChatLoader.PrivateChatLoader.positionPrivateChat(displayedChat.data('chat'));}}).data('default-height',280).data('default-width',320);$('#faqs_link').click(function(){_Popups.Popups.ajax(siteUrl+'/matchmaking/faq');});$('#release_notes').click(function(){_Popups.Popups.ajax(siteUrl+'/matchmaking/release_notes');});$('.add_tournament').click(function(){_Popups.Popups.ajax(siteUrl+'/matchmaking/edit_tournament',null,function(response){});});$('.start_donation_button button').click(function(){_Popups.Popups.ajax(siteUrl+'/matchmaking/donate',null,function(response){});});_Dashboard.Dashboard.playMatchContainer.on('click','.watch_stream',function(e){e.preventDefault();var button=$(this);if($(e.target).hasClass('username')){return;}_ChatActions.ChatActions.onStreamlinkClick(button.data('streamlink'),e);});$('.stream_container').on('updateStreams',function(e,streams,removeMissing){if(typeof removeMissing=='undefined'){removeMissing=false;}var container=$(this);var previousStreams=$('#stream_container ').find('.active_stream').not('.template');var streamHash={};previousStreams.each(function(i,otherStream){otherStream=$(otherStream);if(!streamHash[otherStream.data('stream_id')]){streamHash[otherStream.data('stream_id')]={};}streamHash[otherStream.data('stream_id')]['element']=otherStream;streamHash[otherStream.data('stream_id')]['active']=0;});$.each(streams,function(i,stream){if(stream.is_online){if(!streamHash[i]){streamHash[i]={};}streamHash[i].active=1;}container.trigger('updateStream',[stream]);});$.each(streamHash,function(i,stream){if(!stream.active){var element=$(stream.element);element.remove();}});if(!container.is('#stream_container')){return;}var activeStreams=container.find('.active_stream.is_online');if(activeStreams.length==0){container.removeClass('streams_visible');container.removeClass('count_visible');}else {container.findCache('.heading .count').val(activeStreams.length);container.addClass('streams_visible');}}).trigger('updateStreams',[[]]).on('updateStream',function(e,stream){var container=$(this);var streamButton;var streamContainer=container.find('.active_stream_id_'+stream.id);if(streamContainer.length){streamButton=streamContainer.find('.watch_stream');}else {streamContainer=$('.active_stream.template').clone();if(stream.loadStreamGameData){streamContainer.data('loadStreamGameData',stream.loadStreamGameData);}streamContainer.removeClass('template');streamContainer.appendTo(container.find('.active_streams'));streamContainer.addClass('active_stream_id_'+stream.id);streamContainer.data('stream_id',stream.id);streamButton=streamContainer.find('.watch_stream');streamButton.data('stream_id',stream.id);var channelName=streamContainer.find('.channel_name');channelName.data('channel_name',stream.channel_name);channelName.text(stream.channel_name);if(stream.viewers){streamContainer.find('.viewers').show().find('.count').text(stream.viewers);streamContainer.data('viewers',stream.viewers);}else {streamContainer.find('.viewers').hide();}if(stream.game_logo){var image=streamContainer.find('.game_logo');image.attr('src',stream.game_logo);streamContainer.find('.game').show();}else {if(stream.game_title){streamContainer.find('.game').show().find('.name').text(stream.game_title);}else {streamContainer.find('.game').hide();}}}if(stream.site_sponsored){streamContainer.addClass('site_sponsored');}var streamlink=$('<a>').addClass('streamlink').attr('href','http://twitch.tv/'+stream.channel_name).text('http://twitch.tv/'+stream.channel_name).data('stream',stream).data('literal','t~'+stream.channel_name);streamButton.data('streamlink',streamlink);streamButton.find('.stream_title').text(stream.title);var imageContainer=streamButton.find('.image_container');if(stream.player){var user=Users.update(stream.player);streamButton.find('.user').html(user.createUsernameElement());}if(stream.preview_url){imageContainer.removeClass('no_image');streamButton.find('.stream_logo').attr('src',stream.preview_url);}else {imageContainer.addClass('no_image');}if(stream.is_online){streamContainer.addClass('is_online').removeClass('is_offline');}else {streamContainer.addClass('is_offline').removeClass('is_online');}});$('.stream_information').on('click','.minimize',function(e){$(this).closest('#visible_stream').addClass('minimized');}).on('click','.restore',function(e){$(this).closest('#visible_stream').removeClass('minimized');}).on('click','.closing_x',function(e){var stream=$('#visible_stream');$('#bottom_dock').removeClass('streaming');stream.hide();stream.find('.embed_holder').empty();stream.find('.name').empty();stream.find('.stream_title').empty();});function activateStreamView(streamData){var response=streamData;var stream=$('#visible_stream');stream.show();$('#bottom_dock').addClass('streaming');if(response.channel_name){stream.find('.name').text(response.channel_name);}else {stream.find('.name').text(response.channel_id);}stream.find('.stream_title').text(response.title);stream.find('.embed_holder').html(response.embed);}function loadStream(data){var stream=$('#visible_stream');$('#bottom_dock').addClass('streaming');stream.show();stream.addClass('loading');$.post(siteUrl+'/matchmaking/fetch_stream',data,function(response){stream.removeClass('loading');if(response.success){activateStreamView(response.stream);}}).error(function(){$('#bottom_dock').removeClass('streaming');alert('There was an error loading the stream!');stream.removeClass('loading');stream.hide();});}if(top!=self){top.location.replace(document.location);alert("For security reasons, framing is not allowed; click OK to remove the frames.");}$('#stream_action').on('click','.stream_open_embed',function(e){e.preventDefault();_Dashboard.Dashboard.closeDeclickables();var literal=$(this).data('literal');var params=$(this).data('params');var data={literal:literal,params:params};loadStream(data);}).on('click','.stream_follow_link',function(e){_Dashboard.Dashboard.closeDeclickables();});dashboard.find('.tab_list').on('activate',function(){ // ChatActions.resizeOpenChats();
	});_Dashboard.Dashboard.allTabs.on('activate',function(){$(this).removeClass('notification');});var groupsTab=_Dashboard.Dashboard.retrieveNamedTab('groups').on('activate',function(){var container=$(this).data('paneContainer');container.findCache('.group_content').empty();var loading=container.findCache('.loading').show();var finished=function finished(){loading.hide();};$.post(siteUrl+'/chats/groups',{},function(response){finished();if(response.html){var content=container.findCache('.group_content').html(response.html); // ChatActions.resizeOpenChats();
	}}).error(function(){finished();alert('There was a loading error!');});});var streamsTab=_Dashboard.Dashboard.retrieveNamedTab('streams').on('activate',function(){var container=$('.active_twitch_streams');container.find('.active_streams').empty();var loadingIndicator=container.find('.loading').css('opacity',1);var games=[{game:'Project M',logo:siteUrl+'/images/logos/game-filter-logos/project-m-mini.png'},{game:'Super Smash Bros. Brawl',logo:siteUrl+'/images/logos/game-filter-logos/brawl-mini.png'},{game:'Super Smash Bros. Melee',logo:siteUrl+'/images/logos/game-filter-logos/melee-mini.png'},{game:'Super Smash Bros. for Wii U',logo:siteUrl+'/images/logos/game-filter-logos/smash-wii-u-mini.png'},{game:'Super Smash Bros. for Nintendo 3DS',logo:siteUrl+'/images/logos/game-filter-logos/smash-3ds-mini.png'}];var hitboxFilters={liveonly:true,showHidden:false,game:50024}; // $.ajax({
	//     type: "GET",
	//     dataType: "json",
	//     data: hitboxFilters,
	//     crossDomain: true,
	//     url: 'https://api.hitbox.tv/media/live/list'
	// }).done(function(data){
	//     console.log('rawr');
	//     alert('rawr');
	// }).fail(function(data){
	//     alert(data);
	// });;
	var actions=[];var streamFilters=$('#stream_filters').empty();if(!streamFilters.data('events_loaded')){$('.active_twitch_streams .active_streams').on('click','.active_stream',function(e){var watchStream=$(this).find('.watch_stream');_ChatActions.ChatActions.onStreamlinkClick(watchStream.data('streamlink'),e);});streamFilters.data('events_loaded',true);streamFilters.on('click','.stream_filter img',function(e){var filter=$(this).closest('.stream_filter');var streams=$('#tab-pane-streams .active_stream');var filtersStreams=$();streams.each(function(i,stream){stream=$(stream);if(stream.data('loadStreamGameData')==filter.data('loadStreamGameData')){filtersStreams=filtersStreams.add(stream);}});if(filter.hasClass('active')){filter.removeClass('active');filtersStreams.hide();}else {filtersStreams.show();filter.addClass('active');}});}$.each(games,function(i,gameData){actions.push(gameData);$.ajax({url:'https://api.twitch.tv/kraken/streams',data:{game:gameData.game,client_id:'c06zk6927p510rjnvojnf89zhm754kg'},dataType:'jsonp'}).done(function(response){var streams=response.streams;actions.pop();if(!actions.length){loadingIndicator.css('opacity',0);}if(!streams.length){return;}var filter=$('.stream_filter.template').clone().removeClass('template');filter.find('.game_logo').attr('src',gameData.logo);filter.appendTo('#stream_filters');filter.data('loadStreamGameData',gameData);filter.addClass('active');filter.find('.count').text(streams.length);$.each(streams,function(i,stream){var game=stream.game;var channel=stream.channel;var streamData={};streamData.channel_name=channel.name;if(channel.logo){streamData.preview_url=channel.logo;}else {streamData.preview_url=stream.medium;}streamData.title=channel.status;streamData.id=channel.name;streamData.is_online=true;streamData.viewers=stream.viewers;streamData.game_title=stream.game;streamData.game_logo=gameData.logo;streamData.loadStreamGameData=gameData;container.trigger('updateStream',[streamData]); //sort
	return;});streams=container.find('.active_stream');container.addClass('streams_visible');streams.tsort({data:'viewers',order:'desc'});}).fail(function(response){});});});$('.fetch_stream').submit(function(e){e.preventDefault();var form=$(this);var data={name:form.find('input[name=name]').val(),type:form.find('input[name=type]').val()};loadStream(data);});$('.close_current_chat').click(function(){var chat=_ChatActions.ChatActions.getActiveChatContainer();if(!chat.data('chat')){return;}var chatData=chat.data('chat').data();if(!chatData.name){return;}_Dashboard.Dashboard.ladderPopup('','Leave '+_Html.Html.encode(chatData.name),{buttons:[{text:'No',dismiss:true},{text:'Leave',dismiss:true,click:function click(popup){_ChatActions.ChatActions.exitCurrentChat();}}]});});$('#chat_groups').on('click','.chat_tab .closing_x',function(e){e.stopPropagation();_ChatActions.ChatActions.leaveChatRoom($(this).closest('.chat_tab').data('chat'));}).on('scroll',function(e){loadFeaturedChats($(this));});$('#chat_tabs').on('scroll',function(e){});function loadFeaturedChats(chatGroups){if(!chatGroups){chatGroups=$('#chat_groups');}if(!chatGroups.length||chatGroups.data('scrollLoading')||chatGroups.data('scrollLoaded')){return;}chatGroups.data('scrollLoading',true);$.post(siteUrl+'/chats/featured-chats',function(response){if(response.featured_chats){$.each(response.featured_chats,function(index,chatInfo){var chat=new _ChatRoom.ChatRoom(chatInfo);chat.addToFeaturedList();});}if(response.ladder_chats){console.log("has ladder chats");$.each(response.ladder_chats,function(index,chatInfo){var chat=new _ChatRoom.ChatRoom(chatInfo);chat.addToFeaturedList();});}});}var body=$('body');$('.change_chat, #chat_select').on('click',function(e){body.toggleClass('sidebar-open');}).swipe({swipeStatus:function swipeStatus(event,phase,direction,distance,duration,fingers){if(direction=="up"||direction=="down"){return false;}if(distance>40&&phase=="move"){if(direction=="left"){_ChatActions.ChatActions.changeMainChatRight();}if(direction=="right"){_ChatActions.ChatActions.changeMainChatLeft();}return false;}}});$("#sidebar").swipe({swipeStatus:function swipeStatus(event,phase,direction,distance,duration,fingers){if(direction=="up"||direction=="down"){return false;}if(distance>40&&phase=="move"){if(direction=="right"){body.addClass("sidebar-open");}if(direction=="left"){body.removeClass("sidebar-open");}return false;}}});if(isInLadder&&!matchOnlyMode){_Dashboard.Dashboard.mainChatHolderTemplate.data('chat',_Dashboard.Dashboard.mainChatHolderTemplate.find('.chat_container').data('chat',_Dashboard.Dashboard.mainChatHolderTemplate.find('.chat_container')));_Dashboard.Dashboard.mainChatHolderTemplate.data('userlist',_Dashboard.Dashboard.userlistSide.find('.chat_room_user_list.template_visible'));_Dashboard.Dashboard.mainChatHolderTemplate.data('userlist',_Dashboard.Dashboard.mainChatHolderTemplate.data('chat').data('userlist'));_Dashboard.Dashboard.mainChatHolderTemplate.data('chat').data('userlist',_Dashboard.Dashboard.mainChatHolderTemplate.data('userlist'));}$('#chat_select').change(function(e){var selected=$(this).find(':selected');_ChatActions.ChatActions.changeMainChat(selected.data('button'));});$('.user_search_form').submit(function(e){e.preventDefault();var action=$(this).attr('action');var searchName=$(this).find('input[name=search]').val();var data=$(this).serializeArrayCsrf();if(myUser.is_mod){data.push({name:'banned_users',value:1});}data.push({name:'json',value:1});var formResults=$(this).closest('.search_dropdown').find('.results_area');var loading=$(this).closest('.search_dropdown').find('.loading').show();formResults.hide();$.get(action,data,function(response){if(response.success){formResults.html(response.html);formResults.show();}loading.hide();}).error(function(){loading.hide();});});function getListLoader(){return $('#loading_list').clone().removeAttr('id').removeClass('template');}$('#bottom_dock_left').on('click','.private_window',function(e){if(!$(this).closest('noclick').length){e.stopPropagation();return _PrivateChatLoader.PrivateChatLoader.togglePrivateChat($(this));}}).on('click','.private_window .closing_x',function(e){e.stopPropagation();_PrivateChatLoader.PrivateChatLoader.removePrivateChat($(this).closest('.private_window'));});$('#private_chat_listing').on('click','.private_chat_listing',function(){return _PrivateChatLoader.PrivateChatLoader.togglePrivateChat($(this));});$('.update_list').on('mouseenter','.time',function(){var timestamp=$(this).data('timestamp');$(this).text(_DateFormat.DateFormat.daySmall(timestamp));}).on('mouseleave','.time',function(){var timestamp=$(this).data('timestamp');$(this).text(_DateFormat.DateFormat.small(timestamp));});_Dashboard.Dashboard.mainUserInfo.on('click','.my_history_with_other',function(e){var playerId=$(this).closest('.my_history_with_other').find('input[name=player_id]').val();var url=siteUrl+'/match/against/'+playerId;$(this).trigger('matchHistory',[url]);}).on('click','.recent_matches',function(){var playerId=$(this).find('input[name=player_id]').val();var url=siteUrl+'/match/recent_matches/id/'+playerId;$(this).trigger('matchHistory',[url]);}).data('views',['match_history_view','chat_controls_view','summary_view','notes_view']).on('switchView',function(e,newView){var container=$(this);e.stopImmediatePropagation();container.removeClass(container.data('views').join(' ')).addClass(newView);}).on('click','.toggle_controls',function(e){e.preventDefault();_Dashboard.Dashboard.mainUserInfo.trigger('switchView','chat_controls_view');}).on('click','.back_to_summary',function(){_Dashboard.Dashboard.mainUserInfo.trigger('switchView','summary_view');}).on('click','.user_notes',function(){_Dashboard.Dashboard.mainUserInfo.trigger('switchView','notes_view');var container=_Dashboard.Dashboard.mainUserInfo.findCache('.notes_display');container.addClass('loading');_Dashboard.Dashboard.mainUserInfo.findCache('.notes_content').empty();$.post(siteUrl+'/matchmaking/render_notes/'+$(this).data('player-id')).done(function(response){if(response.html){var notesContent=_Dashboard.Dashboard.mainUserInfo.findCache('.notes_content').html(response.html);notesContent.find('textarea').first().focus();new _PostManager.PostManager(notesContent.find('.dynamic-posts'));}}).fail(function(){alert('Error loading notes');}).always(function(){container.removeClass('loading');});}).on('matchHistory',function(e,url){_Dashboard.Dashboard.mainUserInfo.trigger('switchView',['match_history_view']);var matchHistoryDisplay=$('#match_history_display');matchHistoryDisplay.slideDown();matchHistoryDisplay.removeClass('displayed');matchHistoryDisplay.addClass('loading');matchHistoryDisplay.find('.history_content').empty();$.post(url,function(response){if(response.success){matchHistoryDisplay.removeClass('loading');matchHistoryDisplay.addClass('displayed');matchHistoryDisplay.find('.history_content').html(response.html);if(myUser.is_subscribed){matchHistoryDisplay.find('.match-history-table').loadMoreable({parent:matchHistoryDisplay});}setTimeout(function(){if(!_Dashboard.Dashboard.isTiny()){_Dashboard.Dashboard.keepContainerOnScreen(_Dashboard.Dashboard.userInfoContainer);}},601);}else {matchHistoryDisplay.removeClass('loading').addClass('error');}}).error(function(){matchHistoryDisplay.removeClass('loading').addClass('error');});});var disputesContainer=_Dashboard.Dashboard.disputesContainer;disputesContainer.on('click','.back_button',function(e){disputesContainer.removeClass('loading match_detail_view');});$('.user_info').on('click','.match',function(){if(!isInLadder){return;}var matchId=$(this).find('input[name=match_id]').val();if($(this).is('a'))return;if(!matchId){matchId=$(this).parent().find('input[name=match_id]').val();}if(!matchId){return; // alert('fail');
	}_MatchSummary.MatchSummary.openMatchInNewWindow(matchId);});$('#disputes, .match_summary').on('click','.selectable.feedback',function(e){var summary=$(this).closest('.match_summary');var matchId=summary.find('input[name=match_id]').val();alert('Remind anther to fix this');});$('#current_matches_holder, .match_summary').on('click','form.button_talker button',function(){$(this).addClass("clicked",true);});_Dashboard.Dashboard.userInfoContainer.on('click','.closing_x',function(){var container=$(this);if(container.closest('#user_info_pane').length){_LadderHistory.LadderHistory.history.back();return;}_Dashboard.Dashboard.userInfoContainer.trigger('notClicked');});var currentMatchesHolder=$('#current_matches_holder');_ChatActions.ChatActions.attachUniversalChatActions(currentMatchesHolder);currentMatchesHolder.on('click','.current_match_container .control-buttons .closing_x',function(){var matchContainer=$(this).closest('.current_match_container');var matchId=matchContainer.find('input[name=match_id]').val();var data={match_id:matchId};_Request.Request.send(data,'finished_chatting_with_match');_LadderInfo.LadderInfo.forceRemove('currentMatches',matchId);}).on('keyup','.chat_input',function(e){var chatInput=$(this);var text=chatInput.val();var isTyping=chatInput.data('typing');if(chatInput.data('typing')&&!text.length){chatInput.data('typing',false);_ChatActions.ChatActions.sendChatState(chatInput);}else if(!chatInput.data('typing')&&text.length){chatInput.data('typing',true);_ChatActions.ChatActions.sendChatState(chatInput);}}).on('click','.premade_response',function(e){var button=$(this);button.prop('disabled',true);_Dashboard.Dashboard.sleep(300).then(function(){button.prop('disabled',false);});_ChatActions.ChatActions.sendChat($(this));});$(document).on('click','.chatlink',function(e){var button=$(this);if(button.hasClass('unclickable')){return;}e.preventDefault();e.stopPropagation();var chat=null;if(button.data('chatlink'))chat=button.data('chatlink');else chat=$(this).text();console.log(chat);if(chat)_ChatActions.ChatActions.joinChatRoom(chat,null,true);});var userInfoDeclickableFunction=function userInfoDeclickableFunction(e){var container=$(this);container.hide().data('canBeUnclicked',false);container.trigger('declick');if(container.data('user')){var user=container.data('user');if(user.peer){user.peer=null;}}if(container.data('request')){container.data('request').abort();}};_Ladder.Ladder.declickables.push(_Dashboard.Dashboard.userInfoContainer.on('notClicked',userInfoDeclickableFunction));_Ladder.Ladder.declickables.push($('#chat_popup_card').on('notClicked',userInfoDeclickableFunction));_Ladder.Ladder.declickables.push($('#stream_action').on('notClicked',function(e){var element=$(this);if(element.data('justOpened')){element.data('justOpened',false);}else {element.data('canBeUnclicked',false);element.fadeOut('fast');}}));_Ladder.Ladder.declickables.push($('#sidebar').on('notClicked',function(e,original){if(original){var originalTarget=$(original.target);if(originalTarget.hasClass('change_chat')||originalTarget.hasClass('change_chat_bars')||originalTarget.is('#chat_select')){return;}}body.removeClass('sidebar-open');}).data('canBeUnclicked',true));_Dashboard.Dashboard.usernameClick=function(button,e,clickedPosition){var username;if(button.data('username'))username=button.data('username');else username=button.text();var openChat=false;openChat=true;var data={username:username};if(button.data('id')){data.id=button.data('id');}var infoContainer=_Dashboard.Dashboard.userInfoContainer;var myInfo;infoContainer.css('display','');infoContainer.addClass('loading visible');infoContainer.detach();if(_Dashboard.Dashboard.isTiny()){infoContainer.addClass('is_tiny');}else {infoContainer.removeClass('is_tiny');}var user;if(data.id){user=Users.retrieveById(data.id);}else {user=Users.retrieveByUsername(username);if(!user.username){user.username=username;}}if(!user.username&&data.username){user.username=data.username;}if(user===myUser){myInfo=true;infoContainer.addClass('my_info');}else {myInfo=false;infoContainer.removeClass('my_info');}var mainInfoContainer=_Dashboard.Dashboard.mainUserInfo.addClass('visible'); //.removeClass('visible');
	mainInfoContainer.trigger('switchView',['summary_view']);var profileLink=infoContainer.findCache('.profile_link').attr('href',user.getProfileUrl());profileLink.toggleClass('is_subscribed',user.is_subscribed);var usernameContainer=user.updateUserElements(infoContainer.findCache('.username'));infoContainer.findCache('.rating_container').hide();infoContainer.findCache('.matches_played').text('loading...');infoContainer.findCache('.location').text('loading...');infoContainer.findCache('.chat_holder').hide();infoContainer.findCache('.recent_disputes').hide();infoContainer.findCache('.now_playing_container').hide();infoContainer.findCache('.distance_container').hide();infoContainer.findCache('.away_message').removeClass('active');infoContainer.findCache('.display_name').hide();infoContainer.findCache('.the_notes').text('');infoContainer.findCache('.local_time').text('');infoContainer.findCache('.has_reported_match_behavior').removeClass('active toxic');infoContainer.findCache('.reported_match_behavior').removeClass('toxic good');infoContainer.findCache('.failed_request').hide();var gameInfoHolder=infoContainer.findCache('.game_info_holder').data('populated',false).empty().removeClass('game_select_mode');if(!gameInfoHolder.data('clickEvents')){gameInfoHolder.data('clickEvents',true);gameInfoHolder.on('click','.game_display',function(e){if(infoContainer.hasClass('my_info')||!gameInfoHolder.hasClass('game_select_mode')){return;}var ladderId=$(this).data('game').id;_MatchmakingPopup.MatchmakingPopup.showMatchSelectDialog(ladderId);_Dashboard.Dashboard.matchmakingPaneShouldGetFocusIfNeeded();_Dashboard.Dashboard.closeDeclickables();});}var x=e.pageX;var y=e.pageY;var infoContainerPageView=null;if(user.id){infoContainer.addClass('has_user_id');}else {infoContainer.removeClass('has_user_id');}var reappend=function reappend(){};if(false){infoContainerPageView=true;infoContainer.css('left','');infoContainer.css('top','');reappend=function reappend(){infoContainer.appendTo($('#user_info_pane'));};$('#user_info_button').trigger('click');infoContainer.data('canBeUnclicked',false);}else {infoContainerPageView=false;reappend=function reappend(){infoContainer.appendTo($('body'));}; // LadderHistory.history.pushState({'action':'closeDeclickables',type:'userAction'},null,'?user_info_popup');
	infoContainer.data('canBeUnclicked',true);}infoContainer.data('username',username);var challengeHolder=infoContainer.findCache('.challenge_holder').hide();if(infoContainer.data('request')){var requestObject=infoContainer.data('request');infoContainer.data('request',null);requestObject.abort();}var chatMessage=button.closest('.chat_message');if(chatMessage.length){if(chatMessage.data('message_id')){data.message_id=chatMessage.data('message_id');}}var chat=_ChatActions.ChatActions.getActiveChatContainer();if(chat){if(chat.data('chat').data('chat_room_id')){data.chat_room_id=chat.data('chat').data('chat_room_id');}}if(!data.chat_room_id&&button.data('chat_room_id')){data.chat_room_id=button.data('chat_room_id');}var chatControlButtons=infoContainer.findCache('.cool_chat_controls').findCache('button');var chatControlsReasonForm=infoContainer.findCache('.chat_controls_reason');var endChatControls=function endChatControls(){chatControlButtons.prop('disabled',false).removeClass('active');chatControlsReasonForm.removeClass('active');};endChatControls();if(!infoContainer.data('basicClickEvents')){infoContainer.data('basicClickEvents',true);infoContainer.on('click','.user_notes_profile',function(e){e.preventDefault();});infoContainer.find('.relationship_buttons').on('click','.chat_mod_controls button, .chat_admin_controls button, .modship_button, .mod_controls .btn, .relationship_button',function(e){var button=$(this);var id=button.data('player-id');var type=button.data('type');var chat_id=button.data('chat-id');var chat=button.data('chat');var chatContainer=button.data();var data={player:id,chat_room_id:chat_id,type:type};var controlsType=button.closest('.chat_mod_controls, .chat_admin_controls').length?'chat_controls':'mod_controls';var muteTimer;var showTimerOptions=function showTimerOptions(timerField,data){chatControlButtons.removeClass('active');button.addClass('active');chatControlsReasonForm.addClass('active');chatControlsReasonForm.off('submit');var units={days:chatControlsReasonForm.findCache('input[name=days]').val(0),hours:chatControlsReasonForm.findCache('input[name=hours]').val(0),minutes:chatControlsReasonForm.findCache('input[name=minutes]').val(5),seconds:chatControlsReasonForm.findCache('input[name=seconds]').val(0)};var reason=chatControlsReasonForm.find('input[name=reason]');chatControlsReasonForm.on('submit',function(e){e.preventDefault();data[timerField]=units;data.reason=reason.val()?reason.val():'';$.each(units,function(i,unit){units[i]=$(unit).val();});reason.val('');button.removeClass('active');chatControlsReasonForm.removeClass('active');chatControlButtons.prop('disabled',true);sendChatCommand(data);});};if(button.data('timer_field')){return showTimerOptions(button.data('timer_field'),data);}else {sendChatCommand(data);}function sendChatCommand(data){_Request.Request.send(data,controlsType,function(response){endChatControls();if(response.success){var opposite;if(controlsType=='chat_controls'){opposite=button.closest('.chat_mod_controls, .chat_admin_controls').find('.'+button.data('opposite'));}else if(controlsType=='mod_controls'){opposite=button.closest('.modship, .mod_controls, .relationship').find('.'+button.data('opposite'));}else {alert('O.O..');}opposite.show();if(type=='ignore_user')ignoreList[id]=true;else if(type=='unignore_user')delete ignoreList[id];if(type=='add_friend'||type=='remove_friend'){_Dashboard.Dashboard.friendListButton.trigger('updateFriend',[response.friend]);}button.hide();if(response.message){_ChatActions.ChatActions.addNotificationToChat(null,response.message);}}else {if(response.message){alert(response.message);_ChatActions.ChatActions.addNotificationToChat(null,response.message);}else {alert('Whatever happened was not allowed!');}}});}});infoContainer.findCache('.report_user').click(function(e){_Dashboard.Dashboard.closeDeclickables(); /* Get chat context */reportToMods('Reporting '+$(this).data('username'),null,$(this).data('context'));});}infoContainer.findCache('.open_private_chat').on('click',function(e){e.preventDefault();var id=$(this).data('player-id');var username=$(this).data('username');var payload={username:username,id:id};if(!id){alert('id not found for some reason..');return;}if(isInLadder){_PrivateChatLoader.PrivateChatLoader.openPrivateChat(payload).load();_Dashboard.Dashboard.closeDeclickables();}else {window.location=siteUrl+'/netplay?send_message='+id;}});_Dashboard.Dashboard.UserInfo.updateContainer(user,data);reappend();if(!infoContainerPageView){if(_Dashboard.Dashboard.mainUserInfo.hasClass('summary_view')){_Dashboard.Dashboard.keepContainerOnScreen(infoContainer,{x:x,y:y});}} //Find context information
	var userInfoXhr=_Request.Request.post(siteUrl+'/matchmaking/user',data,function(response){if(response.success){var user=Users.update(response.user);if(userInfoXhr.cancelled){return;}button.data('username',user.username);infoContainer.findCache('.game_info_holder').data('populated',false);infoContainer.removeClass('loading');$('#ping_test_result').removeClass('visible');_Dashboard.Dashboard.UserInfo.updateContainer(user,response);if(false){var initPingTest={ping_player:{player_id:user.id}};_Dashboard.Dashboard.performOpenSearchUpdate(initPingTest);}infoContainer.findCache('.data-username').data('username',user.username);if(response.chat_room){var holdsChatIdData=infoContainer.findCache('.holds_chat_id_data');holdsChatIdData.data('chat-id',response.chat_room.id);if(chat){holdsChatIdData.data('chat',chat);}}else infoContainer.findCache('.holds_chat_id_data').data('chat-id',null);mainInfoContainer.addClass('visible');if(!infoContainerPageView){_Dashboard.Dashboard.keepContainerOnScreen(infoContainer,{x:x,y:y});}}else {if(userInfoXhr.cancelled){return;}if(response.serverError){ //closeDeclickables();
	}else {}if(infoContainer.data('request')) //Request failed without the user cancelling it
	{infoContainer.removeClass('loading');_Dashboard.Dashboard.mainUserInfo.removeClass('visible');}if(response.user===false){infoContainer.findCache('.failed_request').show();}_ElementUpdate.ElementUpdate.flair(infoContainer,{});}});userInfoXhr.realAbort=userInfoXhr.abort;userInfoXhr.abort=function(){userInfoXhr.cancelled=true;};infoContainer.data('request',userInfoXhr);};$(document).on('click','.username, .online_user',function(e,clickedPosition){var button=$(this);if(button.hasClass('unclickable')){return;}if(button.data('userElement')){button=button.data('userElement');}else if(button.hasClass('online_user')){var innerButton=button.find('.username');if(innerButton.length){button.data('userElement',innerButton);if(!innerButton.data('username')){innerButton.data('username',innerButton.text());}button=innerButton;}}if(!button.data('username')){button.data('username',button.text());}e.preventDefault();e.stopImmediatePropagation();if(clickedPosition){e.pageX=clickedPosition.x;e.pageY=clickedPosition.y;}_Dashboard.Dashboard.sleep(25).then(function(){return _Dashboard.Dashboard.usernameClick(button,e,clickedPosition);});});$(document).on('mouseenter','.username',function(e){var element=$(this);var username=element.data('username');if(!username){return;}if(username){_ChatActions.ChatActions.highlightUsernameInChats(username);element.on('mouseleave',function(e){_ChatActions.ChatActions.removeUsernameHighlightInChat(username);});}});_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection',null);_Dashboard.Dashboard.recentMatchSearchers.on('click','.recent_match_searcher',function(e){var bypassTargets=['clickable_logo','sticky_search'];var target=$(e.target);var recentMatchSearcher=$(this);if(!target.length){return;}for(var i=0;i<bypassTargets.length;i++){if(target.hasClass(bypassTargets[i])){return;}}if(target.parent().hasClass('click_shortcuts')){var player=$(this).closest('.player,.online_user,.other_user_info');var match=player.data('match');if(!match){alert('Error!');}var player_id=match.player1.id;var match_id=match.id;if(target.hasClass('cancel_shortcut')){recentMatchSearcher.addClass('loading');target.prop('disabled',true);endMatchmaking(match_id).then(function(response){target.prop('disabled',false);recentMatchSearcher.removeClass('loading');});}if(target.hasClass('challenge_shortcut')){recentMatchSearcher.addClass('loading');target.prop('disabled',true);_MatchmakingPopup.MatchmakingPopup.challengeSearch(player,null,null,null,match_id).then(function(){target.prop('disabled',false);recentMatchSearcher.removeClass('loading');}).catch(function(response){target.prop('disabled',false);recentMatchSearcher.removeClass('loading');});}if(target.hasClass('profile_shortcut')){_Dashboard.Dashboard.usernameClick(recentMatchSearcher.find('.user_information_wrapper .username:first'),e);}e.stopImmediatePropagation();return;}if(!_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection')){recentMatchSearcher.addClass('click_shortcuts_active');_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection',recentMatchSearcher);}else {_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection').removeClass('click_shortcuts_active');if(_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection')[0]===recentMatchSearcher[0]){_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection',null); // Dashboard.recentMatchSearchers.data('lastActiveSelection').removeClass('click_shortcuts_active');
	// Dashboard.recentMatchSearchers.data('lastActiveSelection', null);
	}else {recentMatchSearcher.addClass('click_shortcuts_active');_Dashboard.Dashboard.recentMatchSearchers.data('lastActiveSelection',recentMatchSearcher);}} // e.stopImmediatePropagation();
	});_Dashboard.Dashboard.recentMatchSearchers.on('click','.challenged',function(){var player=$(this).closest('.player,.online_user,.request,.other_user_info');var player_id=player.find('input[name=player_id]').val();var data={json:1,other_player_id:player_id};var challenge=player.find('.challenge');var challenged=player.find('.challenged');var parent=$(this).closest('.challenge_holder_parent');challenge.addClass('active').show();challenged.removeClass('active').hide();_Request.Request.send(data,'cancel_challenge',function(response){if(response.success){if(response.challenges_removed){$.each(response.challenges_removed,function(i,challenge_id){_LadderInfo.LadderInfo.forceRemove('awaitingReplies',challenge_id);});}$('.pending_reply').not('.template').each(function(i,element){var id=$(element).find('input[name=player_id]');var match_id=$(element).find('input[name=match_id]');if(id==player_id){_LadderInfo.LadderInfo.forceRemove('awaitingReplies',match_id);}});if(response.error){alert(response.error);challenge.removeClass('active').hide();challenged.addClass('active').show();}else {}if(response.message){}}else {challenge.removeClass('active').hide();challenged.addClass('active').show();}return;});addGaEvent('matchmaking','unchallenging');});$.fn.siteLinker=function(){var $this=this;return $this.each(function(){$(this).html(_SiteLinker.SiteLinker.link($(this).html()));});};$('#report_to_mods_popup_button').click(function(e){e.preventDefault();reportToMods();});function reportToMods(title,description,extraData){var href=siteUrl+'/bugs/submit?type=4';extraData.json=true;if(title){href+='&title='+title;}_Popups.Popups.ajax(href,extraData,function(response,content){var form=content.find('form');form.submit(function(e){e.preventDefault();e.stopImmediatePropagation();var data=form.serializeArray();var submitButtons=form.find(':submit');submitButtons.prop('disabled',true);var success=function success(){submitButtons.prop('disabled',false);};var fail=function fail(response){submitButtons.prop('disabled',false);if(response.error){alert(response.error);}};data.push({name:'json',value:'1'});$.post(form.attr('action'),data,function(response){if(response.success){openPopup($(response.html));success();}else {fail(response);}});});});}$('#region_link').on('click',function(e){e.preventDefault();showRegionsDialog();});function fancyConfirm($content,title,callback){var ret=false;var fancyboxContent=null;$.fancybox({title:title,modal:false,content:$content.html(),onComplete:function onComplete(){fancyboxContent=$('#fancybox-content');$('#fancybox-content .cancel').click(function(){ret=false;jQuery.fancybox.close();});$('#fancybox-content .confirm').click(function(){ret=true;jQuery.fancybox.close();});},onClosed:function onClosed(){callback(fancyboxContent,ret);}});}$('#profile_link').click(function(){openPopup($('.popups .profile_popup').clone(),null,true);});$('.main_info input[name=location]').on('input',function(){$(this).addClass('unsaved');});$('.edit_away_message').click(function(){_Dashboard.Dashboard.closeDeclickables();var popup=$('.popups .away_message_popup').clone();var input=popup.find('input[name=away_message]');_Dashboard.Dashboard.ladderPopup(popup,'Set Your Status',{buttons:[{text:'Close',dismiss:true},{text:'Update',dismiss:false,click:function click(popup){var message=input.val();$('.popups .away_message_popup').find('input[name=away_message]').val(message);var data={away_message:message};_Request.Request.send(data,'change_wants_to_play',function(response){});popup.dismiss('Changes Saved!');}}]});});function endMatchmaking(matchId){var data={match_id:matchId};return _Request.Request.send(data,'end_matchmaking',function(){ //			return true;
	});}if(stupidMatchmakingOverride){new _MatchmakingPopup.MatchmakingPopup(_Dashboard.Dashboard.gameFilters,2,true);}_Dashboard.Dashboard.userInfoContainer.on('click',function(e){if($(this).data('gameIcons')){var target=$(e.target);if(target.hasClass('game_icon')){return;}else {}$(this).data('gameIcons').popover('hide');}});$('.request_list, .other_user_info').on('click','.challenge, .no_challenges',function(e){e.stopImmediatePropagation();var player=$(this).closest('.player,.online_user,.other_user_info');var match=player.data('match');if(match){var player_id=match.player1.id;var match_id=match.id;}else {player_id=$(this).find('input[name=player_id]').val();}var parent=$(this).closest('.challenge_holder_parent');if(player_id==myUser.id){parent.addClass('loading');endMatchmaking(match_id).then(function(response){parent.removeClass('loading');});return;}var button=$(this);if(!$(this).hasClass('active')&&(player.hasClass('online_user')||player.hasClass('other_user_info'))){_Dashboard.Dashboard.startMatchWithPlayer=player;$('.matchmaking_popup .matchmaking_message').hide();if($(this).closest('#user_info').length){var gameInfoHolder=_Dashboard.Dashboard.userInfoContainer.find('.game_info_holder');if(!gameInfoHolder.hasClass('game_select_mode')){gameInfoHolder.prepend('<span class="heading">Select A Game</span>');gameInfoHolder.addClass('game_select_mode');}if(gameInfoHolder.find('.game_display').length==1){gameInfoHolder.find('.game_display').trigger('click');return;}return;}return;}else {parent.addClass('loading');_MatchmakingPopup.MatchmakingPopup.challengeSearch(player,null,null,null,match_id).then(function(){parent.removeClass('loading');}).catch(function(){parent.removeClass('loading');});}});function openPopup($innerContent,title,showCloseButton,callback){if(showCloseButton==null){showCloseButton=true;}$.fancybox({'content':$innerContent,'showCloseButton':showCloseButton,'onComplete':function onComplete(element){var input=$('#fancybox-content').find('input[type=text]:first');if(input.length){input.focus();}if(callback){callback(element);}}});}setInterval(function(){if(_Dashboard.Dashboard.directChatsTab.hasClass('active')){_Dashboard.Dashboard.directChatsTab.trigger('timestampUpdate');}if(_BrowserNotification.BrowserNotification.browserHasFocus){var userlist=_ChatActions.ChatActions.getActiveChatContainerUserlist();if(userlist){userlist.trigger('updateUserlistOrder');}}},60000);_Dashboard.Dashboard.userlistSide.on('updateUserlistOrder','.chat_room_user_list',function(e){var userlist=$(this);if(userlist.length){var users=userlist.data('userMap');if(!users){return;}if(userlist.data('sections')){$.each(userlist.data('sections'),function(i,section){var nodes=[];$.each(section.users,function(i,userlistElement){if(userlistElement.element){nodes.push(userlistElement.element[0]);}});if(nodes.length){_ChatActions.ChatActions.sortUserList(nodes);}});}}});_Dashboard.Dashboard.activeRegionButton=null;_Dashboard.Dashboard.showAllRegionButton=null;_Dashboard.Dashboard.getActiveRegionButton=function(){if(_Dashboard.Dashboard.activeRegionButton){return _Dashboard.Dashboard.activeRegionButton;}else {return _Dashboard.Dashboard.activeRegionButton=$('#user_list_side').find('.region_button.active');}};function clickedRegionListButton($button){if(!_Dashboard.Dashboard.showAllRegionButton){_Dashboard.Dashboard.showAllRegionButton=$('.region_button.show_all');}if($button.hasClass('active')&&!$button[0]===_Dashboard.Dashboard.showAllRegionButton){$button.removeClass('active');_Dashboard.Dashboard.showAllRegionButton.addClass('active').trigger('activated');}else {_Dashboard.Dashboard.getActiveRegionButton().removeClass('active');$button.addClass('active').trigger('activated');}}_Dashboard.Dashboard.midsideContainer.on('click','.region_button',function(){clickedRegionListButton($(this));}).on('activated','.region_button',function(){var regionButton=$(this);_Dashboard.Dashboard.activeRegionButton=regionButton;if(regionButton.hasClass('fake_region_list_button')){return;}var chat=_ChatActions.ChatActions.getActiveChatContainer();var userlist=chat.data('userlist');userlist.addClass('active');$('#friend_list, #ignored_users').removeClass('active');}).on('click','.toggle_userlist',function(e){var button=$(this);if(!_Dashboard.Dashboard.midsideContainer.data('toggle_userlist_buttons')){_Dashboard.Dashboard.midsideContainer.data('toggle_userlist_buttons',_Dashboard.Dashboard.midsideContainer.find('.toggle_userlist'));}var userlistButtons=_Dashboard.Dashboard.midsideContainer.data('toggle_userlist_buttons');if(button.hasClass('btn-success')){_Dashboard.Dashboard.midsideContainer.addClass('userlist_showing');userlistButtons.addClass('btn-danger').removeClass('btn-success');var active=_ChatActions.ChatActions.getActiveChatContainer();if(active.length){active.data('userlist').trigger('retrieveUserlist');}}else {_Dashboard.Dashboard.midsideContainer.removeClass('userlist_showing');userlistButtons.removeClass('btn-danger').addClass('btn-success');}_ChatActions.ChatActions.resizeUserlists();});_Dashboard.Dashboard.friendList.on('click','.accept_friend, .decline_friend, .cancel_request',function(e){e.stopImmediatePropagation();var button=$(this);var type=button.data('type');var container=button.closest('.online_user');if(container.hasClass('updating')){return;}var finished=function finished(){inputs.prop('disabled',false);container.removeClass('updating');};container.addClass('updating');var inputs=container.find(':input').prop('disabled',true);var player=container.data('id');var data={type:type,player:player};$.post(siteUrl+'/matchmaking/friend',data,function(response){if(response.friend){_Dashboard.Dashboard.friendListButton.trigger('updateFriend',[response.friend]);}finished();}).error(function(){finished();});});function getActiveUserRegions(){var preferred=$('.my_regions .regions input[name=region]');var values={};$.each(preferred,function(key,checkbox){var $checkbox=$(checkbox);if($checkbox.is(':checked')){values[$checkbox.val()]=values[$checkbox.val()];}});return values;}function getActivePreferredRegions(){var preferred=$('.preferred_regions input[name=region]');var values={};$.each(preferred,function(key,checkbox){var $checkbox=$(checkbox);if($checkbox.is(':checked')){values[$checkbox.val()]=values[$checkbox.val()];}});return values;}function getActiveUserListRegions(){var activeRegions={};var activeButton=$('.region_button.active');$(activeButton.find('input[name=region_id]').each(function(){var inputValue=$(this).val();activeRegions[inputValue]=inputValue;}));return activeRegions;}function getChatData(data){var privateChatsOpen=$('#private_chats .private_window.opened');if(privateChatsOpen.length){data['private_chats']={};privateChatsOpen.each(function(){var chat=$(this);var privateChatHolder=chat.data('chatHolder');var chatId=chat.data('id');data.private_chats[chatId]={};data.private_chats[chatId].id=chatId;});}var mainChats=$('#main_chat_area').find('.chat_holder:not(.template)').not('template');data['chats']={};mainChats.each(function(){var mainChat=$(this);var mainChatHolder=mainChat.find('.chat_container');if(mainChat.data('chat_room_id')){var type='chat_room';var chatId=mainChat.data('chat_room_id');}else if(mainChat.data('ladder_id')){var type='ladder';var chatId=mainChat.data('ladder_id');}else {_Ladder.ladder.log('chat type error');return;}if(!data.chats[type]){data.chats[type]={};}data.chats[type][chatId]={}; //Let the server know what users I see
	data.chats[type][chatId].userlist={};mainChat.data('userlist').find('li').each(function(){var userId=$(this).find('input[name=player_id]').val();data.chats[type][chatId].userlist[userId]=1;});});$('.current_match_container .current_match').each(function(){var match=$(this);var chatContainer=match.find('.chat_container');var matchId=match.find('input[name=match_id]').val();if(!matchId)return 'continue';if(!data['match_chats']){data['match_chats']={};}if(!data['match_chats'][matchId]){data['match_chats'][matchId]={};}});return data;}function updateSearchesByTeamsPreference($searches){var selected=$('#show_doubles_searches').find('input').is(':checked');$searches.each(function(i,search){search=$(search);if(selected){if(search.data('match').isDoubles()){search.removeClass('hidden_by_team_size');}else {}}else {if(search.data('match').isDoubles()){search.addClass('hidden_by_team_size');}}});}$('.wants_to_play').click(function(){var button=$(this);var changeTo=button.val();changeWantsToPlay(changeTo);});function changeWantsToPlay(changeTo){var disable=$('.disable_challenges');var enable=$('.enable_challenges');var controls=$('.main_info .status_visibility');var toggle=function toggle(){if(controls.hasClass('is_visible')){controls.removeClass('is_visible').addClass('is_invisible');}else {controls.removeClass('is_invisible').addClass('is_visible');}};toggle();var data={is_visible:changeTo};_Request.Request.send(data,'change_wants_to_play',function(response){if(response.success){var title='Status Changed';if(changeTo==1){_Ladder.Ladder.alert('You will appear online',title);}else {_Ladder.Ladder.alert('You will appear offline and not receive random challenges',title);}}else {toggle();}return true;},function(){toggle();});}$('#show_doubles_searches').find('input[name=show_team_searches]').change(function(){updateSearchesByTeamsPreference($('.recent_match_searcher').not('.template'));$.post(siteUrl+'/matchmaking/show_team_searches',{show_team_searches:$(this).is(':checked')?1:0},function(response){});});_Dashboard.Dashboard.preferredDistanceSeverityElement.change(function(){var button=$(this);var value=button.find(':selected').data('distance');var severityId=button.find(':selected').val();button.data('selected',severityId);var searches=$('.recent_match_searcher').not('.template');var preferredTab=$('#show_preferred_users');button.prop('disabled',true);searches=searches.add($('#open_challenges').find('.request'));searches.each(function(i,search){search=$(search);var match=search.data('match');if(match.location&&match.gameData.preferred_distance_matters&&!match.location.isWithinPreferredRange()){search.addClass('hidden_by_distance');}else {search.removeClass('hidden_by_distance'); // openChallengesCallbacks.challengesContainer.addClass('has_challenges');
	}});preferredDistanceSeverity=parseInt(severityId);if(preferredDistanceSeverity==5){preferredTab.hide();}else {preferredTab.show();}$.post(siteUrl+'/account/set_preferred_distance',{preferred_distance_severity_id:severityId},function(response){button.prop('disabled',false).focus();}).error(function(){button.prop('disabled',false).focus();});});function updateMatchSearch(element,search){if(!element){return;}if(element.data('attachedCountdown')){element.data('attachedCountdown').changeTimeRemaining(search.search_time_remaining);}search.player1.match=search;var user=search.player1;var userObject=Users.update(user); // element.find('input[name=player_id]').val(user.id);
	// element.find('input[name=match_id]').val(search.id);
	element.data('user',userObject);element.addClass('game_type_'+search.game_slug+' game_ladder_id_'+search.ladder.id);userObject.updateUserElements(element.find('.username'));var league=userObject.ladder_information.getLeagueForLadder(search.ladder.id);if(!search.is_ranked&&league&&search.player1.show_rank_for_friendlies===false){_ElementUpdate.ElementUpdate.league(element.find('.user_information_wrapper .league'),{});}else {_ElementUpdate.ElementUpdate.league(element.find('.user_information_wrapper .league'),league);}var mainsContainer;var mains;if(!(search.player1 instanceof _User.User)){search.player1=Users.update(search.player1);}_ElementUpdate.ElementUpdate.mains(element.find('.friendlies_mains'),search.player1,search);if(search.team_size>1){element.addClass('team_search');if(search.lobby){var lobby=element.find('.lobby_players');lobby.find('.total_players').text(search.lobby.total_players);lobby.find('.required_players').text(search.lobby.required_players);}}search.setDoublesViewAsPriorityIfNeeded();var locationElement=element.find('.location');_LadderDistance.LadderDistance.setDescription(locationElement,user.location,myUser.location).text(userObject.location.relativeLocation());if(search.gameData){}if(locationElement.data('distance')&&search.gameData.preferred_distance_matters&&_Dashboard.Dashboard.getPreferredDistanceSeverity()<locationElement.data('distance').getDistanceSeverity()){element.addClass('hidden_by_distance');}element.data('match',search);_Dashboard.Dashboard.updateSearchesByBuildPreference(element);updateSearchesByTeamsPreference(element); // ladder.log('Update userlist elements here');
	// var playerInUserList = PlayerUpdater.getPlayerInUserList(user.id);
	// if(playerInUserList.length)
	// {
	//     element = element.add(playerInUserList);
	// }
	_ElementUpdate.ElementUpdate.updateChallengeButtons(user,element,_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsMatchmaking);return _ElementUpdate.ElementUpdate.updateMatchCount(search,element.find('.match_count')); //Returns a string
	}var serverConnection=new _SocketConnection.SocketConnection();_Dashboard.Dashboard.serverConnection=serverConnection;serverConnection.setStatus('.connecting-0','loading');_Dashboard.Dashboard.autoOpenPrivateChat=null;if(getUrlParameter('send_message')){_Dashboard.Dashboard.autoOpenPrivateChat=getUrlParameter('send_message');}var autoSelectTab=function autoSelectTab(parameter){if(!parameter){parameter=getUrlParameter('tab');}if(!parameter){return;}var selected=_Dashboard.Dashboard.retrieveNamedTab(parameter);if(selected){selected.trigger('activate');}else {console.log('SELECTED TAB DOES NOT EXIST '+parameter);}};autoSelectTab();function getUrlParameter(parameter){var sPageURL=decodeURIComponent(window.location.search.substring(1)),sURLVariables=sPageURL.split('&'),sParameterName,i;for(i=0;i<sURLVariables.length;i++){sParameterName=sURLVariables[i].split('=');if(sParameterName[0]===parameter){return sParameterName[1]===undefined?true:sParameterName[1];}}}_Dashboard.Dashboard.canCallGetUserGoingAgain=true;_Dashboard.Dashboard.chatMessagesFirstTime=true;var StartupEventManager=function StartupEventManager(){this.eventList=[];this.addedEvents={};};StartupEventManager.prototype.addEvent=function(name){if(startupEvents[name]){if(!this.addedEvents[name]){this.addedEvents[name]=1;this.eventList.push({name:name,event:startupEvents[name]});}}else {throw 'Invalid event specified '+name;}};StartupEventManager.prototype.runEvents=function(){for(var key in startupEvents){if(!this.addedEvents.hasOwnProperty(key)){this.addEvent(key);}}this.executeEvents();console.log('[RUN EVENTS]',Object.keys(this.addedEvents));};StartupEventManager.prototype.executeEvents=function(){var _this=this;var event=this.eventList.shift();if(event){var result=event.event();return result.then(function(){return _this.executeEvents();});}else {return false;}};_Dashboard.Dashboard.initialChat=null;var startupEvents={};startupEvents.getChatRooms=function(){if(isInLadder&&!matchOnlyMode){return _Request.Request.send(_Dashboard.Dashboard.baseState,'get_chat_rooms',function(response){if(response.success){_Dashboard.Dashboard.chatRoomsLoaded=true;}if(!response.chat_rooms){return true; //do open search update stuff
	return;}var responseChatRooms=response.chat_rooms;delete response.chat_rooms;var lowestOrder=null;$.each(responseChatRooms.chat_room,function(i,chat_room){if(chat_room.last_active){lowestOrder=chat_room;_Dashboard.Dashboard.initialChat=chat_room.id;_ChatActions.ChatActions.chatFocus(i,true);return false;}});if(lowestOrder){var chatRoomObject={};chatRoomObject[lowestOrder.id]=lowestOrder;preferredChat=lowestOrder.id;_Dashboard.Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room:chatRoomObject,initial_load:true}});_ChatActions.ChatActions.setChatLoadingState(lowestOrder.id,true);delete responseChatRooms.chat_room[lowestOrder.id];}$.each(responseChatRooms.chat_room,function(i,chat_room){var chatRoomObject={};chatRoomObject[i]=chat_room;_Dashboard.Dashboard.performOpenSearchUpdate({chat_rooms:{chat_room:chatRoomObject}}); //Loads with no messages
	_ChatActions.ChatActions.setChatLoadingState(i,true);});});}return new Promise(function(resolve){resolve();});};startupEvents.getChatMessages=function(){if(isInLadder&&!matchOnlyMode){return _ChatActions.ChatActions.getChatMessages(_Dashboard.Dashboard.initialChat).then(function(){_Dashboard.Dashboard.initialChat=null;});}return new Promise(function(resolve){resolve();});};startupEvents.getPrivateMessages=function(){if(!isInLadder){return new Promise(function(resolve){resolve();});}return _Request.Request.send(_Dashboard.Dashboard.baseState,'get_private_messages',function(response){_Dashboard.Dashboard.performOpenSearchUpdate({private_chat:response.recent_private_chats},'private_chat');_Dashboard.Dashboard.performOpenSearchUpdate({recent_private_chats:response.private_chat},'recent_private_chats');_Dashboard.Dashboard.performOpenSearchUpdate(response,'private_chat');if(_Dashboard.Dashboard.autoOpenPrivateChat){var chat=_PrivateChatLoader.PrivateChatLoader.openPrivateChat({id:_Dashboard.Dashboard.autoOpenPrivateChat});if(chat){chat.load();}_Dashboard.Dashboard.autoOpenPrivateChat=null;}_Dashboard.Dashboard.performOpenSearchUpdate(response,'recent_private_chats');});};startupEvents.getMatches=function(){if(!isInLadder){return new Promise(function(resolve){resolve();});}return _Request.Request.send(_Dashboard.Dashboard.baseState,'get_matches',function(response){_Dashboard.Dashboard.performOpenSearchUpdate(response);});};startupEvents.getUserGoing=function(){return _Request.Request.send(_Dashboard.Dashboard.baseState,'get_user_going',function(response){if(!response.success){return;}myFriends=Users.convertCollection(myFriends);$('#private_chat_listing').find('.private_chat_listing').tsort('.time',{data:'timestamp',order:'desc'});$('#private_chats').find('.private_window').tsort('.time',{data:'timestamp',order:'asc'});if(dashboard.hasClass('inactive')){dashboard.addClass('active').removeClass('inactive');dashboard.data('isReady',true);dashboard.trigger('ready');var min=5;var max=10;var randomFeaturedChatInterval=Math.floor(Math.random()*(max-min+1)+min);setTimeout(function(){loadFeaturedChats();},randomFeaturedChatInterval*1000);}_Dashboard.Dashboard.performOpenSearchUpdate(response);serverConnection.setStatus('.connecting-0','success');_Dashboard.Dashboard.reconnectionTimeout=5000;});};_Dashboard.Dashboard.getUserGoing=function(){if(!_Dashboard.Dashboard.canCallGetUserGoingAgain){console.log('rate limiting data retrieval');return;}_Dashboard.Dashboard.canCallGetUserGoingAgain=false;setTimeout(function(){_Dashboard.Dashboard.canCallGetUserGoingAgain=true;},_Dashboard.Dashboard.reconnectionTimeout-1000);var checkProperties={is_mod:'is_mod',is_ladder_mod:'is_ladder_mod',is_subscribed:'subscribed_user',is_real_subscribed:['is_real_subscribed','is_unsubscribed'],is_monthly_subscribed:'is_monthly_subscribed'};$.each(checkProperties,function(property,classValue){if(!(property in myUser)){throw 'Property '+property+' for user not loaded!';}if(classValue.constructor===Array){myUser[property]?_Dashboard.Dashboard.dashboard.addClass(classValue[0]):_Dashboard.Dashboard.dashboard.removeClass(classValue[0]);myUser[property]?_Dashboard.Dashboard.dashboard.removeClass(classValue[1]):_Dashboard.Dashboard.dashboard.addClass(classValue[1]);}else {myUser[property]?_Dashboard.Dashboard.dashboard.addClass(classValue):_Dashboard.Dashboard.dashboard.removeClass(classValue);}});if(myUser.latest_subscription){var subscription=myUser.latest_subscription;var donateContainer=$('#donate');donateContainer.find('.days_remaining').text(subscription.days_remaining);var theS=donateContainer.find('.days_s');subscription.days_remaining==1?theS.hide():theS.show();subscription.amount_paid>=40?donateContainer.find('.many_monies_heart').show():donateContainer.find('.many_monies_heart').hide();}var emailValidationNotification=$('#email_validation_notification');myUser.email_validated?emailValidationNotification.removeClass('email_not_validated'):emailValidationNotification.addClass('email_not_validated');if(!myUser.email_validated){emailValidationNotification.on('email_validated',function(e){$(this).fadeOut();alert('Your email has been validated!');}).on('submit','form',function(e){e.preventDefault();var form=$(this);if(form.data('sending')){return;}var button=form.find('button').text('Sending...');form.data('sending',true);$.post(form.attr('action'),null,function(response){if(response.success){if(response.already_validated){emailValidationNotification.trigger('email_validated');}button.text('Email sent to '+response.email_address);}else {button.text('Error, try again later.');}}).error(function(){form.data('sending',false);button.removeClass('btn-success').addClass('btn-danger').text('A server error occurred, try again later');});});}if(isInLadder){serverConnection.connect();}var allEvents=Object.keys(startupEvents);var startupEventManager=new StartupEventManager();if(isInLadder){if(_Dashboard.Dashboard.autoOpenPrivateChat||_Dashboard.Dashboard.directChatsTab.hasClass('active')){startupEventManager.addEvent('getPrivateMessages');}startupEventManager.addEvent('getMatches');if(matchOnlyMode||_Dashboard.Dashboard.battleTab.hasClass('active')){startupEventManager.addEvent('getUserGoing');}if(_Dashboard.Dashboard.isTiny()){startupEventManager.addEvent('getChatRooms');startupEventManager.addEvent('getChatMessages');}startupEventManager.addEvent('getChatRooms');startupEventManager.addEvent('getChatMessages');}else {startupEventManager.addEvent('getUserGoing');}startupEventManager.runEvents();};_Dashboard.Dashboard.reconnectionTimeout=5000;_Dashboard.Dashboard.getUserGoing();$('.change_icon').click(function(){_Dashboard.Dashboard.closeDeclickables();var changeIconPopup=$('.popups .change_icon_popup').clone();var url='view_icons';return _Popups.Popups.matchmakingAjax(null,url,function(response,content){var flairs=content.on('click','.flaired',function(e){var data={icon:$(this).data('flair_id')};if($(this).hasClass('disabled')){return;}content.find('.flaired').addClass('disabled');_Request.Request.send(data,'change_icon',function(response){if(response.success){$.fancybox.close();_DisplayUpdater.DisplayUpdater.update();}else {$.fancybox({content:'There was an error changing your icon!'});}return true;});});});});_DisplayUpdater.DisplayUpdater.update();if(streamsTab.hasClass('active')){streamsTab.trigger('activate');}var ElementPosition={isInView:function isInView(elem){var docViewTop=$(window).scrollTop();var docViewBottom=docViewTop+$(window).height();var elemTop=$(elem).offset().top;var elemBottom=elemTop+$(elem).height();return elemBottom<=docViewBottom&&elemTop>=docViewTop;}};var openChallengesCallbacks={};openChallengesCallbacks.challengesContainer=$('.open_challenges_container');openChallengesCallbacks.challengesContainer.on('click','.accept, .decline',function(e){e.preventDefault();var request=$(this).closest('.request');var challenge=request.data('match');var match_id=challenge.id;var button=$(this);button.popover('hide');var buttons=request.find('button');buttons.prop('disabled',true);var accept=button.hasClass('accept')?1:0;var data={accept:accept,match_id:match_id,host_code:_Dashboard.Dashboard.retrieveHostCode()};var url='reply_to_match';if(challenge.isDoubles()){url='challenge_search';data.challenge_player_id=challenge.player2.id; //To match the API of this crazy call
	}else {if(challenge.player2.getToxicCount()>=2){return challenge.player2.showToxicWarning().then(function(){return sendReply();}).catch(function(){buttons.prop('disabled',false);});}}return sendReply();function sendReply(){_Request.Request.send(data,url,function(response){if(response.success){if(response.error){alert(response.error);}if(response.message){ // alert(response.message);
	}}else {buttons.prop('disabled',false);if(response.message){alert(response.message);}else {alert('There was an error ');}}return true;});if(accept)addGaEvent('matchmaking','accepting');else addGaEvent('matchmaking','declining');}});openChallengesCallbacks.challengeRequestTemplate=null;openChallengesCallbacks.onNew=function(id,challenge){if(ignoreList[challenge.player2.id]){return; //You know what it is
	}challenge=new _Match.Match(challenge);if(!openChallengesCallbacks.challengeRequestTemplate){openChallengesCallbacks.challengeRequestTemplate=$('.challenge_request.template').detach().removeClass('template');}var $newElement=openChallengesCallbacks.challengeRequestTemplate.clone();challenge.gameData=_Dashboard.Dashboard.getDataForGame(challenge.game_id);$newElement.removeClass('challenge_request');$newElement.addClass('request');$newElement.data('match',challenge);$newElement.attr('id','challenge-'+challenge.id);challenge.setupCountdown($newElement,$newElement.find('.countdown'),function(){_LadderInfo.LadderInfo.forceRemove('openChallenges',id);});var challenges=_LadderInfo.LadderInfo.retrieveReference('openChallenges');if(!challenges.extraData.users){challenges.extraData.users={};}challenge.player2=Users.update(challenge.player2);challenges.extraData.users[challenge.player2.id]=true; //Player 1 is always the current player for open challenges
	_ElementUpdate.ElementUpdate.mains($newElement.find('.friendlies_mains'),challenge.player2,challenge);_ElementUpdate.ElementUpdate.updateMatchCount(challenge,$newElement.find('.match_count'));challenge.addSearchPopover($newElement.findCache('.accept'),challenge.player2);if(challenge.player2.hasToxicWarning(1)){$newElement.addClass('toxic_behavior');}var miniImageUrl=siteUrl+'/images/logos/game-filter-logos/'+challenge.ladder_slug+'-mini.png';$newElement.find('.game_mini_indicator').css('background-image','url('+miniImageUrl+')').attr('title',challenge.ladder_name);_Dashboard.Dashboard.matchmakingTab.trigger('showNotified');challenge.player2=Users.update(challenge.player2);challenge.location=challenge.player2.location;if(challenge.notification){challenge.showWantsToPlayNotification(challenge.notification,$newElement);}challenge.player2.updateUserElements($newElement.find('.username'));var locationElement=$newElement.find('.location');_LadderDistance.LadderDistance.setDescription(locationElement,challenge.player2.location,myUser.location).text(challenge.player2.location.relativeLocation());if(!challenge.location.isWithinPreferredRange()&&challenge.gameData&&challenge.gameData.preferred_distance_matters){$newElement.addClass('hidden_by_distance');}_ElementUpdate.ElementUpdate.league($newElement.find('.user_information_wrapper .league'),challenge.player2.league);if(challenge.player2.hasToxicWarning()){var infractions=_Infraction.Infraction.convert(challenge.player2.reported_match_behavior);if(infractions.length>=2){$newElement.addClass('toxic_behavior');}}$newElement.appendTo('#open_challenges');return $newElement;};openChallengesCallbacks.onRemove=function(id,challenge,element){var challenges=_LadderInfo.LadderInfo.retrieveReference('openChallenges');if(element){_Timer.Timer.endCountdown(element.find('.countdown'));element.fadeOut('fast',function(){$(this).remove();});}if(challenge.player2){_ElementUpdate.ElementUpdate.user(_PlayerUpdater.PlayerUpdater.getPlayerListElementsByPlayerId(challenge.player2.id),{id:challenge.player2.id});delete challenges.extraData.users[challenge.player2.id];}};openChallengesCallbacks.onUpdate=function(id,challenge,element){_ElementUpdate.ElementUpdate.user(_PlayerUpdater.PlayerUpdater.getPlayerListElementsByPlayerId(challenge.player2.id),{id:challenge.player2.id});};openChallengesCallbacks.onPopulate=function(allElements){$.each(allElements,function(i,element){if(!element.element){return;}if(!$(element.element).hasClass('hidden_by_distance')){openChallengesCallbacks.challengesContainer.addClass('has_challenges');return false;}});};openChallengesCallbacks.onEmpty=function(){openChallengesCallbacks.challengesContainer.removeClass('has_challenges');};_LadderInfo.LadderInfo.setCallbacks('openChallenges',openChallengesCallbacks);var currentMatchesCallbacks={};currentMatchesCallbacks.matchTemplate=null;currentMatchesCallbacks.onNew=function(id,match){if(!currentMatchesCallbacks.matchTemplate){currentMatchesCallbacks.matchTemplate=$('#tab-pane-battle').find('.current_match_container.template').remove().removeClass('template');}var currentMatchContainer=currentMatchesCallbacks.matchTemplate.clone();match=new _Match.Match(match); //Show team lists
	match.setMatchContainer(currentMatchContainer);currentMatchContainer.attr('id','match_container_'+match.id);currentMatchContainer.data('id',match.id);currentMatchContainer.data('chat_container',currentMatchContainer.find('.chat_container'));currentMatchContainer.data('chat_container').on('click','.streamlink',function(e){e.preventDefault();var button=$(this);_ChatActions.ChatActions.onStreamlinkClick(button,e);}).on('postNotification',function(e,message,callback){message=_ChatActions.ChatActions.addNotificationToChat($(this),message);if(callback){return callback(message);}});if(match.is_ranked&&match.season.match_system_id!=3){match.postNotification('Be sure to do a lag test before playing your first game!',function(message){message.addClass('lag_test_notification');});}var chatInput=currentMatchContainer.find('.chat_input').addClass('chat_autocomplete');;; //.elastic();
	chatInput.data('chatContainer',currentMatchContainer.data('chat_container'));if(match.players){$.each(match.players,function(id,player){if(player.match&&player.match.match_muted){var notificationMessage='Chat Restricted';_Dashboard.Dashboard.sleep(25).then(function(){match.postNotification(notificationMessage,function(message){message.empty();if(player.id==myUser.id){message.append('You ').append(' are chat restricted');}else {message.append(player.player.createUsernameElement()).append(' is chat restricted and can only use predefined messages (Click to remove)');message.click(function(){_Dashboard.Dashboard.ladderPopup('Enable match chat restricted players to chat?','Disable Match Chat Restriction?',{buttons:[{text:'No',dismiss:true},{text:'Yes',dismiss:true,click:function click(popup){$.post(siteUrl+'/matchmaking/end-chat-restriction',{match_id:match.id},function(response){if(response.success){message.text('Chat Restriction Removed').addClass('restriction_removed');}else if(response.error){match.postNotification(response.error);}});}}]});});}message.addClass('chat_restricted_notification');});});}});}currentMatchContainer.find('.match_feedback :input').change(function(e){e.stopImmediatePropagation();var feedbackUrl=siteUrl+'/matchmaking/update_feedback';var form=$(this).closest('.match_feedback');var data=form.find(':input').serializeArray();data.push({name:'version',value:2});$.post(feedbackUrl,data,function(){});});currentMatchContainer.find('.match_disputed button').click(function(e){if($(e.target).hasClass('undispute_match')){}else {e.preventDefault();}});currentMatchContainer.find('.feedback_thumbs').on('click','.selection_area',function(e,save){if(typeof save=='undefined'){save=true;}var selected=$(this);var container=selected.closest('.rating_container');var both=container.find('.selection_area');var other=both.not(selected);other.removeClass('selected');var input=container.find('input');if(selected.hasClass('selected')){selected.removeClass('selected');input.val(0);}else {selected.addClass('selected');input.val(selected.data('value'));}if(save){input.trigger('change');}});if(match.player_feedback&&match.player_feedback[myUser.id]){var feedback=match.player_feedback[myUser.id];var feedbackContainer=currentMatchContainer.find('.match_feedback');feedbackContainer.find('textarea[name=feedback]').val(feedback.message);if(feedback.connection_feedback==1){feedbackContainer.find('.connection_rating_container .positive_area').trigger('click',[false]);}if(feedback.connection_feedback==-1){feedbackContainer.find('.connection_rating_container .negative_area').trigger('click',[false]);}if(feedback.salt_feedback==1){feedbackContainer.find('.salt_rating_container .positive_area').trigger('click',[false]);}if(feedback.salt_feedback==-1){feedbackContainer.find('.salt_rating_container .negative_area').trigger('click',[false]);}}match.player1=Users.update(match.player1);match.player2=Users.update(match.player2);if(match.rps_game){currentMatchContainer.find('.rock_paper_scissors').on('click','.selection',function(e){var button=$(this);var selection=button.val();var data={selection:selection,match_id:currentMatchContainer.data('id')};var rpsContainer=button.closest('.rock_paper_scissors');rpsContainer.find('.selection').removeClass('player_selected').prop('disabled',true);button.addClass('player_selected');rpsContainer.addClass('waiting');_Request.Request.send(data,'rps_selection',function(response){if(response.error){rpsContainer.removeClass('waiting');rpsContainer.find('.selection').prop('disabled',false);alert(response.error);}});});}else {currentMatchContainer.find('.rock_paper_scissors').hide();}currentMatchContainer.find('.character_picks').on('click','.character',function(e){if(!match.containsMeAsPlayer()){return;}var button=$(this);var characterId=button.data('id');var matchId=match.id;var data={character_id:characterId,match_id:currentMatchContainer.data('id')};var picksContainer=button.closest('.picks_container');var previousSelection=picksContainer.find('.player_selected');var currentAction=picksContainer.data('currentAction');var myPlayerNumber=picksContainer.data('myPlayerNumber');var otherPlayerUsername=picksContainer.find('.other_username').first().text();if(currentAction==ACTION_PLAYER_1_PICK_CHARACTER&&myPlayerNumber==2||currentAction==ACTION_PLAYER_2_PICK_CHARACTER&&myPlayerNumber==1){openPopup("It's "+otherPlayerUsername+'\'s turn to pick their character.');return false;}var bg=button.css('background-image');var characterName=button.find('input[name=name]').val();var pickCharacterText='Pick '+characterName+'?';button.addClass('confirming').addClass('character_holder');var characterPicks=button.closest('.character_picks').addClass('confirming');characterPicks.find('.selected_character').text(characterName);var timeOut=null;var removeSelectionState=function removeSelectionState(){characterPicks.removeClass('confirming');button.removeClass('character_holder confirming').off('click');clearTimeout(timeOut);};characterPicks.find('.cancel_selection').prop('disabled',false).off('click').on('click',function(){removeSelectionState();});button.on('click',function(e){e.stopImmediatePropagation();removeSelectionState();});function sendCharacterSelection(){characterPicks.find('.cancel_selection').prop('disabled',true);picksContainer.find('.character').removeClass('player_selected');button.addClass('player_selected');_Request.Request.send(data,'select_character',function(response){removeSelectionState();if(response.error){alert(response.error);}});}if(currentAction==ACTION_PLAYERS_BLIND_PICK_CHARACTERS&&previousSelection.length){sendCharacterSelection();removeSelectionState();return;}timeOut=setTimeout(function(){sendCharacterSelection();},e.shiftKey?400000:4000);});currentMatchContainer.find('.stage_picks').on('click','.stage',function(){if(!match.containsMeAsPlayer()){return;}var button=$(this);var stageId=button.find('input[name=stage_id]').val();var instructions=currentMatchContainer.findCache('.current_instructions');var highlightInstructions=function highlightInstructions(){clearTimeout(instructions.data('timeout'));var timeout=instructions.addClass('error_highlight');setTimeout(function(){instructions.removeClass('error_highlight');},3000);instructions.data('timeout',timeout);};var matchId=currentMatchContainer.data('id');var data={stage_id:stageId,match_id:matchId};var picksContainer=$(this).closest('.picks_container');var currentAction=picksContainer.data('currentAction');var myPlayerNumber=picksContainer.data('myPlayerNumber');var otherPlayerUsername=picksContainer.find('.other_username').first().text();if(currentAction==ACTION_PLAYER_1_STRIKE_STAGE&&myPlayerNumber==2||currentAction==ACTION_PLAYER_2_STRIKE_STAGE&&myPlayerNumber==1){highlightInstructions();return false;}if(currentAction==ACTION_PLAYER_1_BAN_STAGE&&myPlayerNumber==2||currentAction==ACTION_PLAYER_2_BAN_STAGE&&myPlayerNumber==1){highlightInstructions();return false;}if(currentAction==ACTION_PLAYER_1_PICK_STAGE&&myPlayerNumber==2||currentAction==ACTION_PLAYER_2_PICK_STAGE&&myPlayerNumber==1){highlightInstructions();return false;}button.addClass('pending_selection');_Request.Request.send(data,'select_stage',function(response){button.removeClass('pending_selection');if(response.error){alert(response.error);}});});var matchResultChangeButtons=currentMatchContainer.find('.cancel, .finished, .dispute_match');currentMatchContainer.find('.selected_characters').on('click','.character_holder:not(.disabled)',function(e){var selectedResult=null;if(!currentMatchContainer.hasClass('play_match')){return;}if(currentMatchContainer.hasClass('auto_reported')){return;}if(!match.containsMeAsPlayer()){return;}if($(this).closest('.my_team').length){selectedResult=WIN_MATCH; //Selected win
	}else if($(this).closest('.other_team').length){selectedResult=LOSE_MATCH; //Selected lose
	}else {alert('Error?');return;}var buttons=matchResultChangeButtons.add(currentMatchContainer.find('.selected_characters .player_character'));match.report(selectedResult,null,buttons);});matchResultChangeButtons.click(function(){var message;var selectedResult;var button=$(this);var player=button.closest('.current_match');var match_id=match.id;if(button.closest('.dispute_update').length){return;}if(button.hasClass('win'))selectedResult=WIN_MATCH;else if(button.hasClass('loss'))selectedResult=LOSE_MATCH;else if(button.hasClass('cancel'))selectedResult=CANCEL_MATCH;else if(button.hasClass('finished'))selectedResult=FINISH_MATCH;else if(button.hasClass('dispute_match'))selectedResult=DISPUTE_MATCH;return match.report(selectedResult,null,matchResultChangeButtons.add(currentMatchContainer.find('.selected_characters .player_character')));}); //currentMatchContainer.find('.stage, .character, button.cancel').tooltip();
	//currentMatchContainer.find('.stage, .character, button.finished').tooltip();
	currentMatchContainer.removeClass('template');var ladderStorage=_Ladder2.ladderLocalStorage.getItem('ladders');if(!ladderStorage){ladderStorage={};}if(!ladderStorage[match.ladder.id]){ladderStorage[match.ladder.id]={};}if(ladderStorage[match.ladder.id].last_update_timestamp!=match.ladder.last_modified){ladderStorage[match.ladder.id].last_motd_times_closed=0;}ladderStorage[match.ladder.id].last_update_timestamp=match.ladder.last_modified;if(match.ladder.last_modified&&ladderStorage[match.ladder.id].last_motd_times_closed>0){var skipMotd=true;}if(match.ladder&&match.ladder.motd&&!skipMotd){var chatRoomDescription=currentMatchContainer.find('.chat_room_description');chatRoomDescription.addClass('shown').find('.description_message').html(match.ladder.motd);chatRoomDescription.find('.closing_x').click(function(){if(match.ladder.last_modified){ladderStorage[match.ladder.id].last_motd_times_closed++;_Ladder2.ladderLocalStorage.setItem('ladders',ladderStorage);}chatRoomDescription.hide();_ChatActions.ChatActions.resizeOpenChats();}).find('a').attr('target','_blank');}else {currentMatchContainer.find('.chat_room_description').remove();}if(!match.can_have_disputes){currentMatchContainer.find('.dispute_match').remove();}_ElementUpdate.ElementUpdate.matchContainer(currentMatchContainer,match,true);_Dashboard.Dashboard.closeDeclickables(); //Info box is closed upon starting a match!
	currentMatchContainer.appendTo('#current_matches_holder'); //		popupContent.appendTo(currentMatchContainer);
	currentMatchContainer.fadeIn();_ChatActions.ChatActions.resizeOpenChats();_Dashboard.Dashboard.currentMatch=match;if(_Dashboard.Dashboard.hostCodePopup.popup){_Dashboard.Dashboard.hostCodePopup.popup.remove();_Dashboard.Dashboard.hostCodePopup.popup=null;}return currentMatchContainer;};currentMatchesCallbacks.onRemove=function(id,info,element){element.remove();};currentMatchesCallbacks.onUpdate=function(id,match,element){_ElementUpdate.ElementUpdate.matchContainer(element,new _Match.Match(match),false);};currentMatchesCallbacks.onPopulate=function(allElements){_MatchModeManager.matchModeManager.changeBattleMode(_MatchModeManager.MatchModeManager.battleModes.MATCH_SINGLES);if(_Dashboard.Dashboard.matchmakingTab.hasClass('active')){_Dashboard.Dashboard.battleTab.trigger('activate');}else {_Dashboard.Dashboard.battleTab.trigger('showNotified');}_ChatActions.ChatActions.resizeOpenChats();};currentMatchesCallbacks.onEmpty=function(id,info,element){if(_Dashboard.Dashboard.matchmakingTab.hasClass('active')){_ChatActions.ChatActions.resizeOpenChats();}_MatchModeManager.matchModeManager.changeBattleMode(_MatchModeManager.MatchModeManager.battleModes.NO_MATCH);if(_Dashboard.Dashboard.battleTab.hasClass('active')){_Dashboard.Dashboard.matchmakingTab.trigger('activate');}_Dashboard.Dashboard.currentMatch=null;};currentMatchesCallbacks.preventReadd={};_LadderInfo.LadderInfo.setCallbacks('currentMatches',currentMatchesCallbacks);var friendsCallbacks={};friendsCallbacks.templateElement=null;friendsCallbacks.friendList=null;friendsCallbacks.onNew=function(id,friend){if(!this.friendList){this.friendList=$('.user_lists .friends');}var friendList=this.friendList;if(!this.templateElement){this.templateElement=_User.User.getOnlineUserTemplate();}var element=this.templateElement.clone();element.prependTo(friendList);element.removeClass('template');_ElementUpdate.ElementUpdate.user(element.find('.username'),friend);_ElementUpdate.ElementUpdate.userTypes(element.find('.username'),friend);return element;};friendsCallbacks.onRemove=function(id,info,element){element.addClass('removing').fadeOut('fast',function(){$(this).remove();});};friendsCallbacks.onUpdate=function(id,info,element){};friendsCallbacks.onPopulate=function(allElements){};friendsCallbacks.onEmpty=function(id,info,element){};_LadderInfo.LadderInfo.setCallbacks('friends',friendsCallbacks);function toggleLocationsContinuously(){var showLocations=function showLocations(){_Dashboard.Dashboard.recentMatchSearchers.addClass('show_locations');_Dashboard.Dashboard.recentMatchSearchers.removeClass('show_titles');setTimeout(hideLocations,10000);};var hideLocations=function hideLocations(){_Dashboard.Dashboard.recentMatchSearchers.addClass('show_titles');_Dashboard.Dashboard.recentMatchSearchers.removeClass('show_locations');setTimeout(showLocations,5000);};setTimeout(function(){showLocations();},10000);}if(_Dashboard.Dashboard.recentMatchSearchers.length){ // toggleLocationsContinuously();
	}_Dashboard.Dashboard.battleTab.on('viewportActive',function(){if(_MatchModeManager.matchModeManager.battleModeIs(_MatchModeManager.MatchModeManager.battleModes.MATCH_SINGLES)||_MatchModeManager.matchModeManager.battleModeIs(_MatchModeManager.MatchModeManager.battleModes.MATCH_DOUBLES)){setTimeout(function(){if(_Dashboard.Dashboard.currentMatch){_Dashboard.Dashboard.currentMatch.matchContainer.find('.chat_input').focus();}},5);}});_Dashboard.Dashboard.matchmakingTab.on('deactivate',function(){var container=_Dashboard.Dashboard.matchmakingTab.data('paneContainer'); // var searches = container.find('.recent_match_searcher');
	// $.each(searches, function(i, search){
	//     search = $(search);
	//     var match = search.data('match');
	//     if(!match.containsMe())
	//     {
	//         if(search.data('attachedCountdown'))
	//         {
	//             Timer.endCountdown(search);
	//         }
	//     }
	// });
	//At this point we can remove all old timers?
	return;});callbacks={};callbacks.templateElement=null;callbacks.onNew=function(id,search){var isMine=false;if(!this.templateElement){this.templateElement=$('.recent_match_searcher.template').detach().removeClass('template');}var $newElement=this.templateElement.clone();$newElement.data('id',search.id);$newElement.data('player_id',search.player1.id);if(ignoreList[search.player1.id]){return; //You know what it is
	}search=new _Match.Match(search);search.setDoublesViewAsPriorityIfNeeded();if(search.search_time_remaining<=0){return;}if(!(search.player1 instanceof _User.User)){search.player1=Users.update(search.player1);}var filter=$('#preferred_game_filter_'+search.ladder_id);search.gameData=filter.data();var ladderInformation=search.player1.ladder_information;if(ladderInformation&&ladderInformation.getLeagueForLadder(search.ladder_id)){var rankFilter=$('#tier_filter_'+ladderInformation.getLeagueForLadder(search.ladder_id).getClassName());}else {rankFilter=$();}if(search.tier_restriction){$newElement.addClass('has_tier_restrictions');var medal=search.tier_restriction.tier=new _League.League(search.tier_restriction.tier);search.tier_restriction.tier.division=1;if(search.tier_restriction.direction==1){$newElement.addClass('tier_restriction_up');if(search.tier_restriction.tier.isLessOrEqualTo(myUser.ladder_information.getLeagueForLadder(search.ladder_id))){$newElement.addClass('tier_can_challenge');}}if(search.tier_restriction.direction==-1){$newElement.addClass('tier_restriction_down');if(search.tier_restriction.tier.isGreaterOrEqualTo(myUser.ladder_information.getLeagueForLadder(search.ladder_id))){$newElement.addClass('tier_can_challenge');}}_ElementUpdate.ElementUpdate.league($newElement.find('.tier_restriction .league').addClass('show_image'),search.tier_restriction.tier);}else {$newElement.addClass('no_tier_restriction');}if(search.player1.id==myUser.id){var mySearchPlayer=search.players[myUser.id];$newElement.addClass('is_my_search');if(!filter.data('enabled')&&_Dashboard.Dashboard.is){_Dashboard.Dashboard.changeGameFilter(search.ladder.id,true);}if(search.ladder.has_host_code&&mySearchPlayer&&mySearchPlayer.match){if(!_Dashboard.Dashboard.hostCodePopup.popup&&!mySearchPlayer.match.dolphin_launcher&&_Settings.Settings.isChecked('show_host_code_popup_user_entry')){var notificationContent=$('#host_code_notice');_Dashboard.Dashboard.hostCodePopup.popup=new PNotify({title:null,text:notificationContent.html(),buttons:{sticker:false},icon:false,insert_brs:false,animate_speed:0,hide:false,before_close:function before_close(notice){$('#host_code_notice').html(notice.text_container.html());}});if(search.host_code.code||_Dashboard.Dashboard.hostCodePopup.code){var codeToUse;if(_Dashboard.Dashboard.hostCodePopup.code){codeToUse=_Dashboard.Dashboard.hostCodePopup.code;}else {codeToUse=search.host_code.code;}_Dashboard.Dashboard.hostCodePopup.popup.get().find('input').val(codeToUse);}_Dashboard.Dashboard.hostCodePopup.popup.get().find('input').on('keypress',function(e){if(e.keyCode==_Dashboard.Dashboard.keyCodes.ENTER){e.preventDefault();}else {return;}var popup=_Dashboard.Dashboard.hostCodePopup.popup.get();var holder=popup.findCache('.host_code_notice_holder');var input=$(this);var value=input.val();if(search.host_code.code==value){return; //No change
	}holder.addClass('saving');input.prop('disabled',true);function finished(){input.prop('disabled',false);holder.removeClass('saving');}_Dashboard.Dashboard.hostCodePopup.code=value;_Request.Request.api({host_code:value},'set_host_code').then(function(response){finished();if(response.error){}},function(){alert('error saving');finished();});});}if(_Dashboard.Dashboard.hostCodePopup.popup&&!_Dashboard.Dashboard.hostCodePopup.popup.get().is(':visible')){_Dashboard.Dashboard.hostCodePopup.popup.open();}}var stickySearch=$newElement.find('.sticky_search');stickySearch.on('click',function(e){if(search.isSticky){search.isSticky.remove();var entry=_Match.Match.stickySearches[search.id];delete _Match.Match.stickySearches[search.id];search.isSticky=null;stickySearch.removeClass('locked');stickySearch.addClass('unlocked');if(entry.countdownExpired){$newElement.remove();_LadderInfo.LadderInfo.forceRemove('matchSearches',id,true);}}else {var valid=true;$.each(_Match.Match.stickySearches,function(id,stickied){if(search.isSimilarTo(stickied.match)){alert('A sticky the same as this match is already active, '+'you do not need to sticky it again.');valid=false;return false;}});if(!valid){return;}var content=$('#match_sticky_notice');var preferredDistance=$('#preferred_distance_severity');var distanceSeverity=preferredDistance.html();var notificationContent=content.clone();notificationContent.find('.preferred_distance').html(distanceSeverity);search.isSticky=new PNotify({title:'Match Stickied',text:notificationContent.html(),buttons:{sticker:false},icon:false,insert_brs:false,animate_speed:0,hide:false});search.isSticky.get().find('.preferred_distance').on('change',function(){_Match.Match.stickySearches[search.id].distanceSeverity=$(this).val();}).val(preferredDistance.val());_Match.Match.stickySearches[search.id]={match:search,distanceSeverity:preferredDistance.val()};stickySearch.removeClass('unlocked');stickySearch.addClass('locked');}});isMine=true;}else {}search.setupCountdown($newElement,$newElement.find('.countdown'),function(){if(_Match.Match.stickySearches[id]){_Match.Match.stickySearches[id].countdownExpired=true;}else {_LadderInfo.LadderInfo.forceRemove('matchSearches',id,true);}});$.each(_Match.Match.stickySearches,function(id,stickied){if(!_Dashboard.Dashboard.currentMatch&&search.isSimilarTo(stickied.match)){if(search.player1&&!(search.player1 instanceof _User.User)){search.player1=Users.update(search.player1);}if(search.player1.id==myUser.id){return;}if(!search.player1.location){return;}if(!search.player1.location.distanceFromUser){return;}if(search.player1.location.distanceFromUser.getDistanceSeverity()<=stickied.distanceSeverity) //Allowed
	{search.showSimilarSearchBrowserNotification($newElement);}}});if(!_Dashboard.Dashboard.matchmakingTab.data('paneContainer').hasClass('active')){_LadderInfo.LadderInfo.forceRemove('matchSearches',id,true);return;}$newElement.attr('id','match_search_'+search.id);if(rankFilter.length){if(search.is_ranked&&rankFilter.data('enabled')){alert('shown by rank');$newElement.removeClass('hidden_by_rank');}else {alert('hidden by rank');$newElement.addClass('hidden_by_rank');}}if(search.player1.hasToxicWarning()){var infractions=_Infraction.Infraction.convert(search.player1.reported_match_behavior);if(infractions.length>=2){$newElement.addClass('toxic_behavior');}}if(filter.length){if(filter.data('enabled')){$newElement.removeClass('hidden_by_game');}else {$newElement.addClass('hidden_by_game');}}else {return false; //Just striaght up do not even populate this thing
	}$newElement.data('challengeButtonOptions',_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsMatchmaking);$newElement.data('parentToCountdown',$newElement.find('.countdown'));if(search.team_size>1){$newElement.addClass('team_search');}var bestOfText=updateMatchSearch($newElement,search);if(bestOfText===false) //Should not add the match for various reasons
	{return;}search.location=search.player1.location;$newElement.addClass('best_of_'+search.match_count);var rankedText=search.is_ranked?'Ranked':'Unranked';$newElement.addClass('is_ranked_'+(search.is_ranked?'ranked':'unranked'));if(ladderInformation.getLeagueForLadder(search.ladder_id)){$newElement.addClass(ladderInformation.getLeagueForLadder(search.ladder_id).getClassName());}else {$newElement.addClass(new _League.League().getClassName());}if(search.player1&&search.player1.location){$newElement.data('distance',search.player1.location.distanceFromUser.distance);}else {$newElement.data('distance',90000);}var currentList;if(search.is_ranked){currentList=_Dashboard.Dashboard.recentMatchSearchers.data('ranked_list');}else {currentList=_Dashboard.Dashboard.recentMatchSearchers.data('friendlies_list');}$newElement.appendTo(currentList);currentList.data('needsSort',true);var miniImageUrl=siteUrl+'/images/logos/game-filter-logos/'+search.ladder_slug+'-mini.png';$newElement.find('.game_mini_indicator').css('background-image','url('+miniImageUrl+')');var challengeHover=$newElement.find('.main_challenge_info_hover');if(search.title){$newElement.addClass('has_title');challengeHover.text(search.title);}else {$newElement.addClass('no_title');challengeHover.text(rankedText+' '+bestOfText);}var indicatorButtons=$newElement.find('.game_mini_indicator_hover,.game_mini_indicator');indicatorButtons.data('active_button',$newElement.find('.challenge'));if(isMine){indicatorButtons.attr('title','Click here to cancel');}else {search.addSearchPopover(indicatorButtons,search.player1);indicatorButtons.attr('title','Click here to challenge '+search.player1.username);}_Dashboard.Dashboard.sortSearchLists();return $newElement;};_Dashboard.Dashboard.recentMatchSearchers.on('click','.clickable_logo',function(e){e.stopImmediatePropagation();$(this).data('active_button').trigger('click');});_Dashboard.Dashboard.recentMatchSearchers.on('click','.recent_match_searcher .timeout',function(e){e.stopImmediatePropagation();var timeout=$(this);var matchId=$(this).closest('.recent_match_searcher').data('id');timeout.addClass('loading');$.post(siteUrl+'/matchmaking/stop_matchmaking',{match_id:matchId}).done(function(response){if(!response.confirm){return;}var confirmed=confirm('Remove Search?');if(!confirmed){return;}$.post(siteUrl+'/matchmaking/stop_matchmaking',{match_id:matchId,confirm:1}).done(function(){});}).always(function(){timeout.removeClass('loading');});});callbacks.onRemove=function(id,search,element){if(!element){ //Make sure challenges are also removed
	_LadderInfo.LadderInfo.forceRemove('openChallenges',id);return;}if(_Match.Match.stickySearches[id]){return;}var user=search.player1;_Timer.Timer.endCountdown(element.find('.countdown'));if(user.match){user.match.expiration=null;user=Users.create(user);}var playerInUserList=_PlayerUpdater.PlayerUpdater.getPlayerListElementsByPlayerId(user.id);if(playerInUserList.length){_ElementUpdate.ElementUpdate.updateChallengeButtons(user,playerInUserList.find('.challenge_holder'));}if(search.accepted_players){element.addClass('has_accepted_players');var acceptedPlayers=element.find('.accepted_players');var playerElements=_UserCollection.UserCollection.convertListToElements(search.accepted_players);$.each(playerElements,function(i,player){acceptedPlayers.append(playerElements);});}if(_Dashboard.Dashboard.recentMatchSearchers.hasClass('hard_focus')){element.addClass('removing');_Dashboard.Dashboard.recentMatchSearchers.data('elementsToRemoveOnUnFocus').push(element);}else {element.addClass('removing');setTimeout(function(){element.remove();},2000);}};callbacks.onUpdate=function(id,search,element){search=new _Match.Match(search);search.setDoublesViewAsPriorityIfNeeded();updateMatchSearch(element,search);};callbacks.onPopulate=function(allElements){ //Fade in now happens in onNew
	_Dashboard.Dashboard.sortSearchLists();};callbacks.onEmpty=function(id,search,element){ // $('.recent_match_searchers_container').addClass('emptied');
	};_LadderInfo.LadderInfo.setCallbacks('matchSearches',callbacks);var callbacks={};callbacks.onNew=function(id,reply){var $newElement=$('.pending_reply.template').clone();$newElement.removeClass('template');$newElement.find('input[name=match_id]').val(reply.id);$newElement.find('input[name=player_id]').val(reply.player1.id); //Player 2 is always the current player for pending replies
	reply=new _Match.Match(reply);reply.player1=Users.update(reply.player1);reply.player1.updateUserElements($newElement.find('.username'));$newElement.data('challengeButtonOptions',_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsMatchmaking);reply.setupCountdown($newElement,$newElement.find('.countdown'),function(){_LadderInfo.LadderInfo.forceRemove('awaitingReplies',id);}); //
	_ElementUpdate.ElementUpdate.updateMatchCount(reply,$newElement.find('.match_count'));var miniImageUrl=siteUrl+'/images/logos/game-filter-logos/'+reply.ladder_slug+'-mini.png';$newElement.find('.game_mini_indicator').css('background-image','url('+miniImageUrl+')').attr('title',reply.ladder_name); // PlayerUpdater.setPlayerToWaitingForReply(reply.player1.id,reply);
	$newElement.find('.challenged').on('click',function(){var player=$(this).closest('.player,.online_user,.request,.other_user_info');var player_id=player.find('input[name=player_id]').val();var data={json:1,other_player_id:player_id};var challenge=player.find('.challenge');var challenged=player.find('.challenged');var parent=$(this).closest('.challenge_holder_parent');challenge.addClass('active').show();challenged.removeClass('active').hide();_Request.Request.send(data,'cancel_challenge',function(response){if(response.success){if(response.challenges_removed){$.each(response.challenges_removed,function(i,challenge_id){_LadderInfo.LadderInfo.forceRemove('awaitingReplies',challenge_id);});}$('.pending_reply').not('.template').each(function(i,element){var id=$(element).find('input[name=player_id]');var match_id=$(element).find('input[name=match_id]');if(id==player_id){_LadderInfo.LadderInfo.forceRemove('awaitingReplies',match_id);}});if(response.error){alert(response.error);challenge.removeClass('active').hide();challenged.addClass('active').show();}else {}if(response.message){}}else {challenge.removeClass('active').hide();challenged.addClass('active').show();}return;});addGaEvent('matchmaking','unchallenging');});_ElementUpdate.ElementUpdate.league($newElement.find('.user_information_wrapper .league'),reply.player1.ladder_information.getLeagueForLadder(reply.ladder_id));$newElement.appendTo('#awaiting_replies');return $newElement;};callbacks.onRemove=function(id,info,element){if(element&&element.length){element.remove();}};callbacks.onUpdate=function(id,info,element){};callbacks.onPopulate=function(allElements){$('.awaiting_replies_container').addClass('has_challenges');};callbacks.onEmpty=function(id,info,element){$('.awaiting_replies_container').removeClass('has_challenges');};_LadderInfo.LadderInfo.setCallbacks('awaitingReplies',callbacks);callbacks={};callbacks.templateElement=null;callbacks.onNew=function(id,user){var element;var newInboxMessages=$();element=_PrivateChatLoader.PrivateChatLoader.getPrivateChat(user,false);if(user.message.unread){unreadMessageCount++;element=_PrivateChatLoader.PrivateChatLoader.getPrivateChat(user);if(element){ // element.show();
	}else {unreadMessageCount--;console.error(user);element=$();}}if(!element){element=$();}if(false){if(unreadMessageCount==1){$('#new_message_count_container').find('.the_s').hide();}else {$('#new_message_count_container').find('.the_s').show();}if(unreadMessageCount){newInboxMessages.text(unreadMessageCount); // newInboxMessages.filter('.badge').show(0);
	}else { // newInboxMessages.text('no');
	// newInboxMessages.filter('.badge').hide(0);
	}if(!element.data('listElement')){if(!this.templateElement){this.templateElement=$('.template.inbox_message').clone().removeClass('template');}var secondElement=this.templateElement.clone();secondElement.removeClass('template');secondElement.find('.url_to_inbox_message').attr('href',user.message.inbox_url);secondElement.find('.from').text(user.username);secondElement.find('.time').text(_DateFormat.DateFormat.full(user.message.update_time)).data('timestamp',user.message.update_time);secondElement.find('.message').text(user.message.message);secondElement.data('id',id);secondElement.insertAfter('#new_message_count_container');if(isInLadder){secondElement.click(function(e){e.preventDefault();_PrivateChatLoader.PrivateChatLoader.openPrivateChat({username:secondElement.find('.username').text(),id:secondElement.data('id')}).load();});}element.data('listElement',secondElement);}}if(user.username){element.data('username',user.username);} // user.updateUserElements(element.find('.user'));
	var directChatsElement=element.data('listing');if(directChatsElement&&user.message.message){directChatsElement.findCache('.message_summary').text(user.message.message).attr('title',user.message.message).removeClass('no_messages');directChatsElement.findCache('.time').add(element.find('.time')).timestampUpdate(user.message.date);}if(user.message.unread){_MatchSounds.MatchSounds.playPrivateMessageSoundEffect();element.data('update_time',user.message.update_time);element.addClass('has_new_messages');if(directChatsElement){directChatsElement.addClass('has_new_messages');}}else {}_PrivateChatLoader.PrivateChatLoader.updateUnreadPrivateMessageCount();return element;};callbacks.onRemove=function(id,info,element){element.addClass('removing').fadeOut('fast',function(){$(this).remove();});};callbacks.onUpdate=function(id,user,element){var message=user.message;if(message.unread){var listElement=element.data('listElement');if(listElement&&listElement.length){_ElementUpdate.ElementUpdate.user(listElement,user);}if(element.data('update_time')==undefined||message.update_time>element.data('update_time')){element.data('update_time',message.update_time);if(!element.hasClass('opened')){element.addClass('has_new_messages');}_MatchSounds.MatchSounds.playPrivateMessageSoundEffect();}}};callbacks.onPopulate=function(allElements){$('#private_chat_listing').find('.private_chat_listing').tsort('.time',{data:'timestamp',order:'desc'});};callbacks.onEmpty=function(id,info,element){};_LadderInfo.LadderInfo.setCallbacks('recentPrivateMessages',callbacks);callbacks={};callbacks.disputeContainer=$('#disputes');callbacks.onNew=function(id,match){var $newElement;match=new _Match.Match(match);$newElement=$('.disputed_match.template').clone();$newElement.data('match',new _Match.Match(match));$newElement.removeClass('template');_ElementUpdate.ElementUpdate.dispute($newElement,match);var disputesContainer=$('#disputes').find('.has_disputes');$newElement.appendTo(disputesContainer);return $newElement;};callbacks.onAlways=function(allElements){var disputesContainer=$('#disputes');var disputeCount=disputesContainer.find('.has_disputes li').not('.removing').length;$('.dispute_tab_button').find('.count').text(disputeCount);};callbacks.onRemove=function(id,info,element){element.addClass('removing').fadeOut(0,function(){$(this).remove();});};callbacks.onUpdate=function(id,info,element){};callbacks.onPopulate=function(allElements){this.disputeContainer.find('.has_disputes').show();this.disputeContainer.addClass('notification');this.disputeContainer.find('.no_disputes').hide();_Dashboard.Dashboard.disputesTab.addClass('has_disputes');_Dashboard.Dashboard.disputesTab.removeClass('no_disputes');};callbacks.onEmpty=function(id,info,element){this.disputeContainer.find('.no_disputes').show();this.disputeContainer.removeClass('notification');this.disputeContainer.find('.has_disputes').hide();_Dashboard.Dashboard.disputesTab.addClass('no_disputes');_Dashboard.Dashboard.disputesTab.removeClass('has_disputes');};_LadderInfo.LadderInfo.setCallbacks('disputedMatches',callbacks);var chatMessageCallbacks={};chatMessageCallbacks.templateElement=null;$('#chat_popup_card').on('notClicked',function(){$(this).data('currentElement').removeClass('delete_highlight');});chatMessageCallbacks.timeOptionsClick=function(e,element){var card=$('#chat_popup_card');var message=element.data('message');if(card.data('currentElement')){card.data('currentElement').removeClass('delete_highlight');}card.data('currentElement',element);card.removeClass('can_delete is_me is_not_moderator is_moderator');card.find('.delete').off('click').on('click',function(){element.trigger('deleteMessage');card.trigger('notClicked');});card.find('.remove').off('click').on('click',function(){element.trigger('deleteMessage',[true]);card.trigger('notClicked');});card.find('.undelete').off('click').on('click',function(){if(message.is_shadow_muted){element.trigger('unshadowMuteMessage');}else {element.trigger('undeleteMessage');}card.trigger('notClicked');});card.find('.purge').off('click').on('click',function(){if(!confirm('Delete all visible messages posted by '+message.player.username+'?')){return;}card.data('findOtherUserMessages')(message.player.id).each(function(i,message){$(message).trigger('deleteMessage',[false]);});card.trigger('notClicked');});card.find('.scorch').off('click').on('click',function(){if(!confirm('REMOVE all visible messages posted by '+message.player.username+'?')){return;}card.data('findOtherUserMessages')(message.player.id).each(function(i,message){$(message).trigger('deleteMessage',[true]);});card.trigger('notClicked');});card.find('.report').off('click').on('click',function(){_Dashboard.Dashboard.closeDeclickables();reportToMods('Reporting '+message.player.username,null,message.getContext());});card.find('.purge, .scorch').off('mouseenter').on('mouseenter',function(){card.data('findOtherUserMessages')(message.player.id).addClass('delete_highlight');}).on('mouseleave',function(){card.data('findOtherUserMessages')(message.player.id).not(element).removeClass('delete_highlight');});card.data('findOtherUserMessages',function(id){return element.data('chatContainer').find('.chat_message.user_id_'+message.player.id);});var chatContainer=element.data('chatContainer');if(!chatContainer){chatContainer=$();}if(myUser.is_mod||chatContainer.data('isChatMod')||chatContainer.data('isChatAdmin')){card.addClass('is_moderator').addClass('can_delete');}else {card.addClass('is_not_moderator');}if(myUser.id==message.player.id&&!message.deleted){card.addClass('is_me');if(!message.deleted){card.addClass('can_delete');}}card.data('canBeUnclicked',false);setTimeout(function(){card.data('canBeUnclicked',true);},10);var clonedElement=element.clone();element.addClass('delete_highlight');clonedElement.find('.time_holder').removeClass('clickable');clonedElement.find('.username').addClass('unclickable');clonedElement.find('.message').attr('title',clonedElement.find('.message').text());var previewArea=card.find('.message_preview').empty().append(clonedElement);var data={};data.id=message.player.id;if(element.data('chatContainer')&&element.data('chatContainer').data('chat')&&element.data('chatContainer').data('chat').data('chat_room_id')){data.chat_room_id=element.data('chatContainer').data('chat').data('chat_room_id');}card.show(); // if(data.chat_room_id)
	// {
	//     card.addClass('loading');
	// }
	message.deleted?card.addClass('message_deleted'):card.removeClass('message_deleted');message.is_shadow_muted?card.addClass('message_removed'):card.removeClass('message_removed');message.deleted||message.is_shadow_muted?card.removeClass('cannot_undelete'):card.addClass('cannot_undelete');var timeHolder=element.find('.time_holder');var rightOfTimeHolder=timeHolder.offset().left+timeHolder.outerWidth();_Dashboard.Dashboard.keepContainerOnScreen(card,{x:rightOfTimeHolder,y:e.pageY-40});};chatMessageCallbacks.onNew=function(id,message,container){var callbacks=this;var loadingAllMessages=container.data('loadingAllMessages');var chatMessagesHolder=container;if(!this.templateElement){this.templateElement=_ChatActions.ChatActions.getChatMessageTemplate().addClass('normal_message');this.templateElement.find('.time_holder').addClass('clickable');}var $newElement=this.templateElement.clone();var chatContainer=$newElement.data('chatContainer',container);$newElement.data('time',message.time);message=new _ChatMessage.ChatMessage(message);$newElement.data('message',message);if(message.player&&ignoreList[message.player.id]&&!isMod&&!message.is_chat_mod&&!myUser.is_chat_mod){return;}if(ignoreList[message.player.id]){$newElement.addClass('is_ignored');}if(_ChatActions.ChatActions.updateChatMessage($newElement,message,loadingAllMessages)===false){return null;}if(myUser.is_ladder_mod){if(message.behavior_issues){$newElement.addClass('is_hitlisted');}}if(message.is_muted&&message.player.id==myUser.id){var until=_DateFormat.DateFormat.hourMinutes(message.is_muted);if(loadingAllMessages){return;_ChatActions.ChatActions.addNotificationToChat(chatMessagesHolder,'This message was blocked from being sent.');}else {_ChatActions.ChatActions.addNotificationToChat(chatMessagesHolder,'You are muted until '+until+'. Circumventing this by logging into alt accounts is grounds for long term suspension.');}}var orderItem={element:$newElement,id:id,time:message.time};var items=container.data('messages').items;var insertMessage=null;var placedMessages=chatMessagesHolder.find('.chat_message.normal_message'); // var placedMessages = chatMessagesHolder.items;
	var insertIndex=_ChatMessages.ChatMessages.findPositionForMessage(placedMessages,$newElement); // var insertIndex = null;
	if(insertIndex instanceof jQuery){insertMessage=insertIndex;if(!insertMessage.data('usePrevious')){insertMessage.data('usePrevious',null);var next=insertMessage.next();if(next.length){insertMessage=next;}}insertMessage.data('usePrevious',null);}else if(insertIndex!==null){insertMessage=$(placedMessages.get(insertIndex));}else {insertMessage=null;}var sender=$newElement.find('.sender');if(message.player.id){ // ElementUpdate.user($newElement.find('.'),message.player);
	// var user = message.player;
	// ElementUpdate.flair(sender,user);
	}if(showGlowColors&&message.player.glow_color&&message.player.is_subscribed){sender.css('text-shadow','-1px 1px 8px '+message.player.glow_color+', 1px -1px 8px '+message.player.glow_color);}if(message.player.id==myUser.id&&!loadingAllMessages){ //Doesn't count as a new message, just confirming that the message was received
	var tempMessages=chatMessagesHolder.find('.chat_message.my_temp_message');var replaceMessage=null;tempMessages.each(function(){var tempMessage=$(this);if(tempMessage.data('send_id')==message.send_id){replaceMessage=tempMessage;return null;}});}if(!replaceMessage){chatMessagesHolder.data('newMessagesAdded',message);if(insertMessage){var temp=$('<div>');var previousMessage=insertMessage.prev();if(insertMessage.prev().hasClass('chat_notification')){temp.insertBefore(insertMessage.prev());}else {temp.insertBefore(insertMessage);}replaceMessage=temp;}else {var replaceMessage=null;}}if(!$newElement.hasClass('state_message')){_ChatActions.ChatActions.addMessageToChat(chatMessagesHolder,$newElement,replaceMessage);}if(!loadingAllMessages&&!container.hasClass('scrolled_up')){_ChatActions.ChatActions.removeExtraMessagesFromChatContainer(chatMessagesHolder,container,placedMessages);}return $newElement;};_ChatActions.ChatActions.removeExtraMessagesFromChatContainer=function(chatMessagesHolder,container,placedMessages){var limit=null;if(BrowserHelper.isPhone){limit=40;}else {limit=45;}var deletionSafeIterations=10;if(typeof chatMessagesHolder.data('checkForDeletions')=='undefined'){chatMessagesHolder.data('checkForDeletions',deletionSafeIterations);return;}if(chatMessagesHolder.data('checkForDeletions')>0){chatMessagesHolder.data().checkForDeletions--;return;}if(chatMessagesHolder.data('checkForDeletions')<=0){chatMessagesHolder.data().checkForDeletions=deletionSafeIterations;}var chatElements;if(false){chatElements=placedMessages;}else {chatElements=container.children();}var totalElements=chatElements.length;if(totalElements>limit){limit=limit+10; //Jus tos that it does not need to happen for another 10 messages
	var current=0;var deleteTopFew=false;chatElements.each(function(i,message){var position=totalElements-current;if(position>limit){var messageElement=$(message);if(messageElement.hasClass('chat_notification')){messageElement.remove();current++;return;}if(container.data('loadedAll')){container.data('loadedAll',false);}var data=$(message).data();_LadderInfo.LadderInfo.forceRemove(container.data('messages'),data.message_id,true);if(messageElement){messageElement.remove(); //Just in case?
	}deleteTopFew=true;}else {return false; //Break out
	}current++;});if(deleteTopFew){}}};chatMessageCallbacks.onAlways=function(allElements,container){if(container){ // console.log('[should scroll]', container.data('shouldScrollToBottom'));
	if(container.data('shouldScrollToBottom')){_ChatActions.ChatActions.scrollToBottom(container);container.data('shouldScrollToBottom',false);}}};chatMessageCallbacks.onRemove=function(id,info,element){if(element){element.remove();}};chatMessageCallbacks.onUpdate=function(id,info,element,container){if(element){info=new _ChatMessage.ChatMessage(info);element.data('message',info);_ChatActions.ChatActions.updateChatMessage(element,info,container.data('isPopulated'));}else {return this.onNew(id,info,container);}if(element.data('shadowMuted')&&!info.is_shadow_muted){element.trigger('unshadowMute');}};chatMessageCallbacks.onPopulate=function(allElements){};chatMessageCallbacks.onEmpty=function(id,info,element){};_LadderInfo.LadderInfo.setCallbacks('chatMessages',chatMessageCallbacks);var userlistCallbacks={};var UserlistSection=function UserlistSection(name){this.element=$('<div>',{class:'userlist_section'});this.name=name;this.heading=$('<h4>',{class:'heading'}).text(name);this.heading.appendTo(this.element);this.listElement=$('<ul>',{class:'section_list'});this.listElement.appendTo(this.element);this.userlistElement=null;this.users={};this.length=0;return this;};UserlistSection.prototype.addSectionToUserlist=function(list){this.userlistElement=list;this.element.appendTo(list);};UserlistSection.prototype.addUserToSection=function(userElement){if(this.users[userElement.user.ud]){return;}if(!this.length){this.element.addClass('active');}this.length++;userElement.element.appendTo(this.listElement);this.users[userElement.user.id]=userElement;};UserlistSection.prototype.removeUserFromSection=function(user){if(this.users[user.id]){this.length--;this.users[user.id].remove();delete this.users[user.id];}if(!this.length){this.element.removeClass('active');}};userlistCallbacks.templateElement=null;userlistCallbacks.refreshDisplay=function(){};userlistCallbacks.skipExtendOnUpdate=true;userlistCallbacks.addUserToList=function(id,userlistElement,container){var chatMessagesHolder=container;var chat=chatMessagesHolder.data('chat');var userlist=chat.data('userlist');var user=userlistElement.user;user.getUserlistElements(_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsOnlineUser);var $newElement=_UserlistElement.UserlistElement.newElement();userlistElement.element=$newElement;userlistElement.displayOptions=_UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsOnlineUser; //$newElement.find('.last_message_time').remove();
	//$newElement.data('challengeButtonOptions',challengeButtonOptionsOnlineUser);
	$newElement.data('id',user.id);if(user){$newElement.data('user',user);}user.is_online=true;user.rating=null;if(chat.data('button')){if(chat.data('button').data('ladder_id')){if(user.rankings){var ranking=user.rankings[chat.data('button').data('ladder_id')];if(ranking&&ranking.rating){user.rating=ranking.rating;}}}}if(user.id==myUser.id){if(user.is_chat_mod){myUser.is_chat_mod=true;chatMessagesHolder.data('isChatMod',true);}if(user.is_chat_admin){chatMessagesHolder.data('isChatAdmin',true);}}userlistElement.update();if(!userlist.data('sections')){userlist.data('sections',[new UserlistSection('Chat Admin'),new UserlistSection('Mods'),new UserlistSection('Players')]);$.each(userlist.data('sections'),function(id,section){section.addSectionToUserlist(userlist);});}var sections=userlist.data('sections'); /** Section selection */if(user.chat_rooms.isAdmin(chat.data('chat_room_id'))||user.is_mod){sections[0].addUserToSection(userlistElement);}else if(user.chat_rooms.isMod(chat.data('chat_room_id'))){sections[1].addUserToSection(userlistElement);}else {sections[2].addUserToSection(userlistElement);} //ElementUpdate.user($newElement,user);
	//ElementUpdate.userTypes($newElement.find('.username'),user);
	//Change user's status in pm list and friends list
	user.is_online=true;$newElement.data('userlist',userlist);$newElement.data('chatMessagesHolder',container);return $newElement;};userlistCallbacks.onNew=function(id,user,container){var chatMessagesHolder=container;var userOriginal=user;user=Users.create(user);user.setProperties({chat_rooms:userOriginal.chat_rooms}); //just in case this is not set by the create
	var chat=chatMessagesHolder.data('chat');var userlist=chat.data('userlist');var button=chat.data('button'); //TODO: finish this
	//if(!$('#show_online_users').hasClass('active') && !$('#show_preferred_users').hasClass('active'))
	//{
	//    return;
	//}
	var callbacks=this;if(userlist){if(!userlist.data('users'))userlist.data('users',0);userlist.data('users',userlist.data('users')+1);if(!userlist.data('userMap')){userlist.data('button',button);userlist.data('userMap',{});userlist.data('pendingUserMap',{});userlist.on('refreshDisplay',function(e){var list=$(this);var pending=list.data('pendingUserMap');$.each(pending,function(id,useless){var newElement=callbacks.addUserToList(id,list.data('userMap')[id],chatMessagesHolder);delete pending[id];});_ChatActions.ChatActions.sortUserList(list);});userlist.data('refreshSoon',function(customTimeout){if(customTimeout){}else {customTimeout=10000+userlist.data('users')*100;}if(userlist.data('currentTimeout')){return;}userlist.data('currentTimeout',setTimeout(function(){if(button.hasClass('active')){userlist.trigger('refreshDisplay');}userlist.data('currentTimeout',null);},customTimeout));});if(button&&button.hasClass('active')){userlist.data('refreshSoon')(1000);}else { //userlist.data('refreshSoon');
	}}var userMap=userlist.data('userMap');var pendingUserMap=userlist.data('pendingUserMap');userMap[user.id]=user.addNewUserlistElement(null);pendingUserMap[user.id]=true;if(button&&button.hasClass('active')){userlist.data('refreshSoon')();}return userlist;}return;};userlistCallbacks.onAlways=function(allElements,container){if(!container){return;}var chat=container.data('chat');var userlist=chat.data('userlist');var totalUsers=userlist.data('users');if(chat.data('button')){if(userlist.hasClass('active')){$('#user_list_information').data('countElement').text(userlist.data('users'));}}};userlistCallbacks.onRemove=function(id,userlistResponse,userlist){if(userlistResponse.is_removed){ // var notificationMessage = '<span class="username">'+userlistResponse.username +'</span> left.';
	}else {_Ladder.ladder.log('cannot do this function');}if(userlist){var map=userlist.data('userMap');var pending=userlist.data('pendingUserMap');var userlistElement=map[id];if(userlistElement){var element=userlistElement.remove();if(userlist.data('sections')){$.each(userlist.data('sections'),function(i,section){section.removeUserFromSection({id:id});});}}delete map[id];delete pending[id];userlist.data('users',userlist.data('users')-1);}};userlistCallbacks.onUpdate=function(id,info,userlist){var map=userlist.data('userMap');if(map&&map[id]){var userlistElement=map[id];if(userlistElement.element){ //Disable updating the element :3
	//ElementUpdate.user(userlistElement.element,info);
	}}};userlistCallbacks.onPopulate=function(allElements){ //		ladder.log('Update to add message date timestamps');
	};userlistCallbacks.onEmpty=function(id,info,element){};_LadderInfo.LadderInfo.setCallbacks('userlists',userlistCallbacks);_LadderHistory.LadderHistory.popUserActionState=function(){var state=_LadderHistory.LadderHistory.history.getState();var data=state.data;if(data.type&&data.type=='userAction'){console.log(data);alert('here');return _LadderHistory.LadderHistory.history.back();}return false;};_LadderHistory.LadderHistory.checkUserActionState=function(){var state=_LadderHistory.LadderHistory.popUserActionState();console.log(state);if(state){window[data.action]();}};function checkDeclickables(event){var declicked=false;if(_Ladder.Ladder.declickables.length){_Ladder.Ladder.declickables=$.grep(_Ladder.Ladder.declickables,function(declick,i){if(!declick.data('canBeUnclicked')){return true;}if(!event||event.target!==declick[0]&&!declick.has($(event.target)).length){declicked=true;var removeAfter=declick.data('removeFromDeclickables');declick.trigger('notClicked',[event]);if(removeAfter){return false;}}return true;});}return declicked;}function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}function PingAverage(){var pingList=[];var pingAverage=null;var pingListSize=10;var actualAverage=null;var that=this;this.getAverage=function(){return actualAverage;};this.add=function(amount){var total=0;pingList.push(amount);if(pingList.length>10){pingList.shift();}for(var i=0;i<pingList.length;i++){total+=pingList[i];}if(total>0){actualAverage=total/pingList.length;}else {actualAverage=0;}return that;};}(function($){var proto=$.ui.autocomplete.prototype,initSource=proto._initSource;function filter(array,term){var matcher=new RegExp($.ui.autocomplete.escapeRegex(term),"i");return $.grep(array,function(value){return matcher.test($("<div>").html(value.label||value.value||value).text());});}$.extend(proto,{_initSource:function _initSource(){if(this.options.html&&$.isArray(this.options.source)){this.source=function(request,response){response(filter(this.options.source,request.term));};}else {initSource.call(this);}},_renderItem:function _renderItem(ul,item){return $("<li></li>").data("item.autocomplete",item).append($("<a></a>")[this.options.html?"html":"text"](item.label)).appendTo(ul);}});})(jQuery);setInterval(_BrowserNotification.BrowserNotification.checkBrowserFocus,8000);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UserCollection = undefined;
	
	var _User = __webpack_require__(12);
	
	__webpack_require__(11);
	
	var _matchmaking = __webpack_require__(10);
	
	var UserCollection = exports.UserCollection = function UserCollection() {
	    this.list = {};
	    this.usernameList = {};
	};
	UserCollection.prototype.convertCollection = function (collection) {
	    var i;
	    for (i in collection) {
	        if (collection.hasOwnProperty(i)) {
	            collection[i] = this.update(collection[i]);
	        }
	    }
	    return collection;
	};
	UserCollection.prototype.possibleUsernameClasses = 'is_subscribed is_mod is_top_player is_admin has_dolla wearing_flair';
	UserCollection.convertListToElements = function (playerArray) {
	    var elements = [];
	    $.each(playerArray, function (i, player) {
	        player = _matchmaking.Users.update(player);
	        var element = player.createUsernameElement();
	        elements.push(element);
	    });
	    return elements;
	};
	UserCollection.prototype.create = function (element) {
	    if (element && element.id) {
	        if (this.list[element.id]) {
	            var previous = this.list[element.id];
	            if (element.location && !previous.location) {
	                previous.setProperties({ location: element.location });
	            }
	            return previous;
	        }
	        this.list[element.id] = new _User.User(element);
	        if (element.username) {
	            this.usernameList[element.username.toLowerCase()] = this.list[element.id];
	        }
	        return this.list[element.id];
	    } else {
	        return new _User.User();
	    }
	};
	UserCollection.prototype.update = function (data) {
	    var user = this.create(data);
	    if (user) {
	        user.setProperties(data);
	        return user;
	    }
	};
	UserCollection.prototype.retrieveByUsername = function (username) {
	    username = username.toString();
	    username = username.toLowerCase();
	
	    if (this.usernameList[username]) return this.usernameList[username];
	    return new _User.User();
	};
	UserCollection.prototype.retrieveById = function (userId) {
	    var user = this.findById(userId);
	    if (!user) return new _User.User();
	    return user;
	};
	UserCollection.prototype.findById = function (userId) {
	    if (this.list[userId]) return this.list[userId];
	    return null;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.User = undefined;
	
	var _Location = __webpack_require__(13);
	
	var _Ladder_Information = __webpack_require__(15);
	
	var _User_Chat_Rooms = __webpack_require__(17);
	
	var _League = __webpack_require__(16);
	
	var _UserlistElement = __webpack_require__(18);
	
	var _PreferredBuilds = __webpack_require__(19);
	
	var _getOrdinal = __webpack_require__(20);
	
	var _Flair = __webpack_require__(21);
	
	var _Dashboard = __webpack_require__(5);
	
	var User = exports.User = function User(data) {
	    this.application = {};
	    this.ladder_information = new _Ladder_Information.Ladder_Information();
	    this.chat_rooms = new _User_Chat_Rooms.User_Chat_Rooms();
	    this.preferred_builds = new _PreferredBuilds.PreferredBuilds();
	    this.elements = {
	        friendlistElement: null,
	        userlistElements: [],
	        privateChatElement: null,
	        hasRemovals: false
	    };
	    this.setProperties(data);
	};
	User.prototype.hasToxicWarning = function (countThreshold) {
	    if (!countThreshold) {
	        countThreshold = 1;
	    }
	    var count = this.getToxicCount();
	    if (!count) {
	        return false;
	    }
	    return count >= countThreshold;
	};
	User.prototype.getToxicCount = function () {
	    if (!this.reported_match_behavior) {
	        return 0;
	    }
	    return this.reported_match_behavior.length;
	};
	User.prototype.showToxicWarning = function () {
	    var user = this;
	    return new Promise(function (resolve, reject) {
	        var content = $('<ul>').addClass('reported_match_behavior warning_popup');
	        content.append('<h3>' + 'Reported Behavior' + '</h3>');
	        $.each(user.reported_match_behavior, function (i, message) {
	            content.append('<li>' + message.public_message + '</li>');
	        });
	        var popup = _Dashboard.Dashboard.ladderPopup(content, user.username + ' has multiple reports, are you sure?', {
	            buttons: [{
	                text: 'Close',
	                dismiss: true,
	                click: function click(popup) {
	                    reject();
	                }
	            }, {
	                text: 'I have been warned and accept anyway',
	                dismiss: false,
	                click: function click(popup) {
	                    resolve();
	                    popup.dismiss();
	                }
	            }]
	        });
	        popup.onDismiss = function () {
	            reject(); //Hmm.. might happen after other events ^.^
	        };
	    });
	};
	User.prototype.updateElements = function () {
	    if (this.elements.friendlistElement) {
	        this.elements.friendlistElement.update();
	    }
	    var userlistElements = this.getUserlistElements();
	    for (var i in userlistElements) {
	        userlistElements[i].update();
	    }
	    if (this.elements.privateChatElement) {
	        this.elements.privateChatElement.update();
	    }
	};
	User.prototype.setProperties = function (data) {
	    var i;
	    for (i in data) {
	        if (data.hasOwnProperty(i)) {
	            if (i == 'location') {
	                if (data.location instanceof _Location.Location) {
	                    this.location = data.location;
	                } else {
	                    if (this.location && data.location && data.location.coordinates && this.location.coordinates && data.location.coordinates[0] == this.location.coordinates[0]) {} else {
	                        this.location = new _Location.Location(data.location);
	                    }
	                }
	            } else if (i == 'chat_rooms') {
	                this.chat_rooms = new _User_Chat_Rooms.User_Chat_Rooms(data.chat_rooms);
	            } else if (i == 'league') {
	                this.league = new _League.League(data.league);
	            } else if (i == 'ladder_information') {
	                this.ladder_information.extend(data.ladder_information);
	            } else if (i == 'preferred_builds') {
	                this.preferred_builds.extend(data.preferred_builds);
	            } else {
	                this[i] = data[i];
	            }
	        }
	    }
	    if (this.league && this.league.ladder_id) //Make sure league information is set in the proper location
	        {
	            if (!this.ladder_information[this.league.ladder_id]) {
	                this.ladder_information[this.league.ladder_id] = {};
	            }
	            this.ladder_information[this.league.ladder_id].league = this.league;
	        }
	};
	User.prototype.getUserlistElements = function () {
	    if (this.elements.hasRemovals) //Garbage collection of removed elements
	        {
	            for (var i = this.elements.userlistElements.length - 1; i >= 0; i--) {
	                var element = this.elements.userlistElements[i];
	                if (element.isRemoved) {
	                    this.elements.userlistElements.splice(i, 1);
	                    //delete this.elements.userlistElements[i];
	                }
	            }
	            this.elements.hasRemovals = false;
	        }
	    var elements = this.elements.userlistElements.slice();
	    if (this.elements.friendListElement) {
	        elements.push(this.elements.friendListElement);
	    }
	    return elements;
	};
	User.prototype.addNewUserlistElement = function (element) {
	    if (!element) element = null;
	    var userlistElement = new _UserlistElement.UserlistElement(element, this);
	    this.elements.userlistElements.push(userlistElement);
	    return userlistElement;
	};
	User.prototype.cssOnlineStatus = function () {
	    var classes = [];
	    if (this.is_online) {
	        classes.push('is_online');
	    } else {
	        classes.push('is_offline');
	    }
	    //if(this.data.is_browser_idle)
	    //{
	    //	classes.push('browser_idle');
	    //}
	
	    return classes;
	};
	User.prototype.addFlair = function (element) {
	    // console.trace('wat wat');
	    var flairUrl, flairIcons;
	    var player = this;
	    if (player.selected_flair) {
	        (function () {
	            if (!(player.selected_flair instanceof _Flair.Flair)) {
	                player.selected_flair = _Flair.Flair.retrieve(player.selected_flair);
	            }
	
	            var retrieveFlairData = function retrieveFlairData(element) {
	                var flairData = null;
	                if (element.data('flairData')) {
	                    flairData = element.data('flairData');
	                } else {
	                    flairData = {};
	                    flairData.parent = element.parent();
	
	                    var flairyHolder = $('<span>').addClass('flairy_holder');
	                    var afterFlairy = $('<span>').addClass('front_flairy_holder');
	                    flairyHolder.insertBefore(element);
	                    afterFlairy.insertAfter(element);
	
	                    flairData.icons = new Map();
	                    flairData.afterIcons = new Map();
	                    flairData.flairyHolder = flairyHolder;
	                    flairData.afterFlairyHolder = afterFlairy;
	                    element.data('flairData', flairData);
	                }
	                return flairData;
	            };
	
	            element.each(function (i, currentElement) {
	                var element = currentElement;
	                element = $(element);
	                element.addClass('wearing_flair');
	                var flairData = retrieveFlairData(element);
	
	                if (!flairData.icons.has(player.selected_flair)) {
	                    player.selected_flair.createElement().appendTo(flairData.flairyHolder);
	                    flairData.icons.set(player.selected_flair, true);
	                }
	
	                var afterFlair = null;
	                if (player.is_top_monthly_donator) {
	                    afterFlair = _Flair.Flair.retrieve({
	                        name: 'dolla',
	                        safe_url: "/images/smilies/ceo.png"
	                    });
	                }
	
	                if (afterFlair && !flairData.afterIcons.has(afterFlair)) {
	                    afterFlair.createElement().appendTo(flairData.afterFlairyHolder);
	                    flairData.afterIcons.set(afterFlair, true);
	                }
	            });
	        })();
	    }
	};
	User.prototype.updateUserElements = function (jqueryElements) {
	    var _this = this;
	
	    jqueryElements.applyUsernameClasses(this).data('username', this.username).data('id', this.id ? this.id : null);
	    if (!this.username) {
	        return;
	    }
	    jqueryElements.data('username', this.username);
	    jqueryElements.data('usernameLowercase', this.username.toLowerCase());
	    jqueryElements.each(function (i, element) {
	        element = $(element);
	        if (element.prop("tagName") == "A") {
	            element.attr('href', _this.getProfileUrl());
	        }
	        if (_this.display_name) {
	            if (!jqueryElements.data('displayNameSplit')) {
	                jqueryElements.data('displayNameSplit', true);
	                var displayName = $('<span>').addClass('display_name');
	                displayName.text(_this.display_name);
	                displayName.appendTo(element);
	                var usernameElement = $('<span>').addClass('gangster_name');
	                usernameElement.text(_this.getStyledUsername());
	                usernameElement.appendTo(element);
	            }
	            jqueryElements.addClass('has_display_name');
	
	            jqueryElements.data('display_name', _this.display_name);
	        } else {
	            if (jqueryElements.data('displayNameSplit')) {
	                jqueryElements.empty();
	                jqueryElements.removeClass('has_display_name');
	                jqueryElements.data('display_name', null);
	                jqueryElements.data('displayNameSplit', false);
	            }
	            element.text(_this.getStyledUsername());
	        }
	    });
	};
	User.prototype.getStyledUsername = function () {
	    return this.username.replace(/_/g, ' ');
	};
	User.prototype.getDisplayedName = function () {
	    return this.display_name ? this.display_name : this.getStyledUsername();
	};
	User.prototype.createUsernameElement = function () {
	    var element = $('<span>');
	    this.updateUserElements(element);
	    // if(this.id)
	    // {
	    //     element.data('id', this.id);
	    // }
	    if (showGlowColors && this.glow_color && this.is_subscribed) {
	        element.css('text-shadow', this.getTextShadowStyle());
	    }
	    return element;
	};
	User.prototype.createUsernameRankElement = function (ladderId) {
	    var userElement = $('<div>').addClass('advanced_user_element');
	
	    var league = this.ladder_information.getLeagueForLadder(ladderId);
	    if (league) {
	        league.createElement();
	        league.appendTo(userElement);
	    }
	    userElement.append(this.createUsernameElement());
	    if (this.location) {
	        userElement.append(this.location.createLocationElement());
	    }
	    return userElement;
	};
	$.fn.setTextShadowColors = function (user) {
	    var textShadowColors = user.getTextShadowColors();
	    if (textShadowColors) {
	        $(this).css('text-shadow', user.getTextShadowColors());
	    }
	};
	User.prototype.getTextShadowStyle = function () {
	    if (showGlowColors && this.glow_color && this.is_subscribed) {
	        return '-1px 1px 8px ' + this.glow_color + ', 1px -1px 8px ' + this.glow_color;
	    }
	    return '';
	};
	User.prototype.getProfileUrl = function () {
	    if (this.id) {
	        return siteUrl + '/player/' + this.id;
	    } else if (this.username) {
	        return siteUrl + '/player/' + this.username;
	    } else {
	        return '';
	    }
	};
	User.prototype.cssUsername = function () {
	    var classes = [];
	    classes.push('username');
	    if (this.is_mod) //Is a moderator
	        classes.push('is_mod');
	    if (this.is_admin) classes.push('is_admin'); //.attr('title','Is an Administrator');
	    if (this.is_subscribed) classes.push('is_subscribed'); //.attr('title','Is Subscribed to Smashladder');
	    if (this.is_ignored) classes.push('is_ignored');
	    if (this.is_donator) classes.push('is_donator'); //.attr('title','Is a Donator to Smashladder');
	    if (this.is_top_player) {
	        classes.push('is_top_player');
	        if (this.is_top_player.rank) {
	            var ordinal = (0, _getOrdinal.getOrdinal)(this.is_top_player.rank);
	            classes.push('top_player_' + this.is_top_player.rank);
	        }
	        if (this.is_top_player.ladder_name) {
	            //element.attr('title','Is '+ordinal+' in '+this.is_top_player.ladder_name)
	        }
	    }
	
	    return classes;
	};
	User.onlineUserTemplate = null;
	User.getOnlineUserTemplate = function () {
	    if (!User.onlineUserTemplate) {
	        User.onlineUserTemplate = $('.online_user.template').detach().removeClass('template');
	    }
	    return User.onlineUserTemplate.clone();
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Location = undefined;
	
	var _LadderDistance = __webpack_require__(14);
	
	var _Dashboard = __webpack_require__(5);
	
	var Location = exports.Location = function Location(location) {
	    var i;
	    this.distanceFromUser = null;
	    this.setProperties(location);
	};
	Location.prototype.setProperties = function (location) {
	    for (var i in location) {
	        if (location.hasOwnProperty(i)) {
	            this[i] = location[i];
	            if (i == 'coordinates') {
	                if (myUser.location) {
	                    this.distanceFromUser = this.distanceFromLocation(this, myUser.location);
	                }
	            }
	        }
	    }
	};
	Location.prototype.distanceFromLocation = function (location) {
	    return _LadderDistance.LadderDistance.getDistanceFromLocations(myUser.location, location);
	};
	Location.prototype.isWithinPreferredRange = function (gameId) {
	    return this.distanceFromUser && _Dashboard.Dashboard.getPreferredDistanceSeverity() >= this.distanceFromUser.getDistanceSeverity();
	};
	Location.prototype.createLocationElement = function () {
	    var text = this.relativeLocation();
	    var element = $('<span>').text(text).attr('title', text);
	    var distanceFromLocation = this.distanceFromLocation(this);
	    if (distanceFromLocation) {
	        distanceFromLocation = distanceFromLocation.getDistanceSeverity();
	    } else {
	        distanceFromLocation = 0;
	    }
	    element.addClass('location distance_severity distance_severity_' + distanceFromLocation);
	    return element;
	};
	Location.prototype.relativeLocation = function () {
	    var country;
	    var state;
	    var locality;
	    var localLocation = myUser.location;
	    var location = this;
	    if (location.country && localLocation.country && location.country.id != localLocation.country.id) country = location.country.name;
	    if (location.state) state = location.state;
	    if (location.locality) locality = location.locality;
	    if (locality && state && country) {
	        return locality + ', ' + state + ' (' + country + ')';
	    }
	    if (locality && state) {
	        return locality + ', ' + state;
	    }
	    if (state && country) {
	        return state + ', ' + country;
	    }
	    if (state) {
	        return state;
	    }
	    if (country) {
	        return country;
	    }
	    if (location.country) {
	        return location.country.name;
	    }
	    return 'Not Set';
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var LadderDistance = exports.LadderDistance = {
	    setDescription: function setDescription(element, location1, location2) {
	        var distance = LadderDistance.getDistanceFromLocations(location1, location2);
	        if (distance) {
	            element.attr('class', '');
	            LadderDistance.setDistanceCssClasses(element, location1, location2, distance).text(distance.getDistanceDescription());
	            element.data('distance', distance);
	        } else {
	            element.attr('class', '').addClass('distance_description').addClass('distance_severity distance_severity_0').text('Unknown');
	        }
	        return element;
	    },
	    setDistanceCssClasses: function setDistanceCssClasses(element, location1, location2, distance) {
	        if (!distance) {
	            distance = LadderDistance.getDistanceFromLocations(location1, location2);
	        }
	        if (!distance) {
	            return element;
	        }
	        element.addClass('distance_description').addClass(distance.getDistanceClasses());
	        return element;
	    },
	    getDistanceFromLocations: function getDistanceFromLocations(location1, location2) {
	        if (location1 && location1.coordinates && location2 && location2.coordinates) {
	            return LadderDistance.getDistanceFromLatLonInMeters(location1.coordinates[1], location1.coordinates[0], location2.coordinates[1], location2.coordinates[0]);
	        }
	        return null;
	    },
	    getDistanceFromLatLonInMeters: function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
	        var deltaLat = lat2 - lat1;
	        var deltaLon = lon2 - lon1;
	        var earthRadius = 6371000;
	        var alpha = deltaLat / 2;
	        var beta = deltaLon / 2;
	        var a = Math.sin(LadderDistance.deg2rad(alpha)) * Math.sin(LadderDistance.deg2rad(alpha)) + Math.cos(LadderDistance.deg2rad(lat1)) * Math.cos(LadderDistance.deg2rad(lat2)) * Math.sin(LadderDistance.deg2rad(beta)) * Math.sin(LadderDistance.deg2rad(beta));
	        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	        var distance = earthRadius * c;
	        return new Distance(distance);
	    },
	    deg2rad: function deg2rad(deg) {
	        return deg * (Math.PI / 180);
	    }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Ladder_Information = undefined;
	
	var _League = __webpack_require__(16);
	
	var Ladder_Information = exports.Ladder_Information = function Ladder_Information(data) {
	    this.games = {};
	    this.extend(data);
	};
	Ladder_Information.prototype.extend = function (games) {
	    if (games instanceof Ladder_Information) {
	        games = games.games;
	    }
	    if (games) {
	        $.extend(this.games, games);
	    }
	};
	Ladder_Information.prototype.getLeagueForLadder = function (ladderId) {
	    if (this.games[ladderId] && this.games[ladderId].league) {
	        if (!(this.games[ladderId].league instanceof _League.League)) {
	            this.games[ladderId].league = new _League.League(this.games[ladderId].league);
	        }
	        return this.games[ladderId].league;
	    }
	    return null;
	};
	Ladder_Information.prototype.getCharactersForLadder = function (ladderId) {
	    if (this.games[ladderId] && this.games[ladderId].characters) {
	        return this.games[ladderId].characters;
	    }
	    return [];
	};
	Ladder_Information.prototype.hasCharactersForLadder = function (ladderId) {
	    return this.getCharactersForLadder(ladderId).length != 0;
	};
	Ladder_Information.prototype.hasLadders = function () {
	    for (var i in this.games) {
	        if (this.games.hasOwnProperty(i)) {
	            return true;
	        }
	    }
	    return false;
	};
	Ladder_Information.prototype.getLadders = function () {
	    return this.games;
	};
	Ladder_Information.prototype.getLaddersInOrder = function () {
	    var games = [];
	    $.each(this.games, function (i, game) {
	        games.push(game);
	    });
	    games.sort(function (a, b) {
	        return a.order > b.order;
	    });
	    return games;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var League = exports.League = function League(data) {
	    this.setProperties(data);
	    return this;
	};
	League.prototype.setProperties = function (data) {
	    var i;
	    for (i in data) {
	        if (data.hasOwnProperty(i)) {
	            this[i] = data[i];
	        }
	    }
	};
	League.prototype.createElement = function (element) {
	    var league = this;
	    if (!element) {
	        element = this.getTemplate();
	    }
	    var leagueContainer = element.find('.leagued');
	    var unleagued = element.find('.unleagued');
	    if (league && (league.name || league.points)) {
	        element.addClass('has_league').removeClass('no_league');
	        element.attr('title', league.name + ' ' + league.points);
	        element.find('.ranked_requirements').hide();
	        leagueContainer.show();
	        unleagued.hide();
	        if (!leagueContainer.length) {
	            leagueContainer = element;
	        }
	        if (league.division === null) //Just numbers
	            {
	                leagueContainer.hide('.name');
	                leagueContainer.hide('.division');
	                leagueContainer.find('.rating_text').show();
	                leagueContainer.find('.points').text(league.points);
	            } else {
	            leagueContainer.find('.ranked_played').hide();
	            leagueContainer.find('.name').text(league.name);
	            leagueContainer.find('.league_icon').attr('src', league.image_url);
	            leagueContainer.find('.division').text(league.division);
	            leagueContainer.find('.rating_text').hide();
	        }
	    } else {
	        element.removeClass('has_league').addClass('no_league');
	        leagueContainer.hide();
	        if (!unleagued.length) {
	            element.hide();
	        }
	    }
	    if (league.season && element.find('.ranked_requirements').length && !league.meetsRankedRequirements() && league.hasPlayed()) {
	        unleagued.hide();
	        element.find('.ranked_requirements').show();
	
	        element.find('.ranked_played .total').text(league.stats.ranked_played).addClass(league.stats.ranked_played >= league.season.games_required_for_ladder ? 'met' : 'unmet');
	        element.find('.ranked_played .required').text(league.season.games_required_for_ladder);
	
	        element.find('.unique_opponents .total').text(league.stats.unique_opponents).addClass(league.stats.unique_opponents >= league.season.opponents_required_for_ladder ? 'met' : 'unmet');
	        element.find('.unique_opponents .required').text(league.season.opponents_required_for_ladder);
	    } else {
	        unleagued.show();
	        element.find('.ranked_requirements').hide();
	    }
	    return element;
	};
	League.prototype.getTemplate = function () {
	    if (League.templateElement) {
	        return League.templateElement.clone();
	    } else {
	        League.templateElement = $('.user_info .game_info.template .league').clone();
	        return League.templateElement;
	    }
	};
	League.prototype.meetsRankedRequirements = function () {
	    if (!this.season || !this.stats) {
	        return false;
	    }
	    return this.stats.ranked_played >= this.season.games_required_for_ladder && this.stats.unique_opponents >= this.season.opponents_required_for_ladder;
	};
	League.prototype.isGreaterOrEqualTo = function (otherLeague) {
	    if (!otherLeague) {
	        // alert('There was an error, you should contact anther');
	        return false;
	    }
	    return this.tier_rank >= otherLeague.tier_rank;
	};
	League.prototype.isLessOrEqualTo = function (otherLeague) {
	    if (!otherLeague) {
	        // alert('There was an error, you should contact anther');
	        return true;
	    }
	    return this.tier_rank <= otherLeague.tier_rank;
	};
	League.prototype.hasPlayed = function () {
	    if (!this.season || !this.stats) {
	        return false;
	    }
	    return this.stats.ranked_played || this.stats.unique_opponents;
	};
	League.prototype.isUnranked = function () {
	    return this.name == 'Unranked';
	};
	League.prototype.isRanked = function () {
	    return !this.isUnranked();
	};
	League.prototype.getClassName = function () {
	    var string = 'Ladder_League_';
	    if (this.name) {
	        string += this.name.replace(/ /g, "_");
	    } else {
	        string += "Unranked";
	    }
	    return string;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var User_Chat_Rooms = exports.User_Chat_Rooms = function User_Chat_Rooms(data) {
	    if (typeof data === 'undefined') {
	        return;
	    }
	    this.setProperties(data);
	    return this;
	};
	User_Chat_Rooms.prototype.setProperties = function (data) {
	    var i;
	    for (i in data) {
	        if (data.hasOwnProperty(i)) {
	            this[i] = data[i];
	        }
	    }
	};
	User_Chat_Rooms.prototype.isMod = function (chatRoomId) {
	    return this[chatRoomId] && this[chatRoomId].is_chat_mod;
	};
	User_Chat_Rooms.prototype.isAdmin = function (chatRoomId) {
	    return this[chatRoomId] && this[chatRoomId].is_chat_admin;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UserlistElement = undefined;
	
	var _User = __webpack_require__(12);
	
	var UserlistElement = exports.UserlistElement = function UserlistElement(jqueryElement, user) {
	    this.user = user;
	    this.element = jqueryElement;
	    this.isRemoved = false;
	    this.displayOptions = UserlistElement.displayOptions.challengeButtonOptionsOnlineUser;
	    this.isFirstUpdate = true;
	};
	UserlistElement.prototype.remove = function () {
	    if (this.element) {
	        this.element.remove();
	    }
	    this.isRemoved = true; //Mark for garbage collection next time the list is retrieved
	    this.user.elements.hasRemovals = true;
	};
	UserlistElement.prototype.updateAttribute = function (attribute) {
	    if (this.settables[attribute] && this.user[attribute]) {
	        this.settables[attribute](this.user[attribute]);
	    }
	};
	UserlistElement.prototype.update = function () {
	    if (!this.element) {
	        return;
	    }
	    var userlistElement = this.element.data().usernameElement;
	    this.user.updateUserElements(userlistElement);
	    if (this.isFirstUpdate) {
	        userlistElement.applyUsernameClasses(this.user);
	    }
	    if (this.user.location) {
	        this.element.data().locationElement.text(this.user.location.relativeLocation());
	    }
	    this.element.data().statusElement.text(this.user.away_message);
	    if (this.user.is_browser_idle) {
	        this.element.addClass('browser_idle');
	    } else {
	        this.element.removeClass('browser_idle');
	    }
	
	    if (this.user.wants_to_play !== null && typeof this.user.wants_to_play !== 'undefined') {
	        if (this.user.wants_to_play) {
	            this.element.removeClass('away');
	        } else {
	            this.element.addClass('away');
	        }
	    } else {}
	    if (this.user.is_online) {
	        this.element.addClass('is_online');
	        this.element.removeClass('is_offline');
	    } else {
	        this.element.removeClass('is_online');
	        this.element.addClass('is_offline');
	    }
	    if (this.user.is_playing) {
	        this.element.addClass('playing');
	    } else {
	        this.element.removeClass('playing');
	    }
	    //OLD STUFF
	    if (this.user.is_browser_idle) {
	        this.element.addClass('browser_idle');
	    } else {
	        this.element.removeClass('browser_idle');
	    }
	
	    if (this.displayOptions.showOffline && this.displayOptions.showOnline) {
	        if (this.user.is_online) {
	            this.element.addClass('is_online');
	            this.element.removeClass('is_offline');
	        } else //we just assume the worst of this person
	            {
	                this.element.addClass('is_offline');
	                this.element.removeClass('is_online');
	            }
	        return;
	    }
	    if (this.displayOptions.showOffline && !this.displayOptions.showOnline) {
	        if (!this.user.is_online) {
	            this.element.addClass('is_offline');
	            this.element.removeClass('is_online');
	            //If this isn't the case, then we'll show normal play buttons
	            return;
	        } else {
	            this.element.addClass('is_online');
	            this.element.removeClass('is_offline');
	        }
	    }
	
	    if (this.displayOptions.showPlayButtons) {
	        //var challenges =LadderInfo.retrieveReference('openChallenges');
	        //
	        //if(!challenges.extraData.users)
	        //	challenges.extraData.users = {};
	        //
	        //if(challenges.extraData.users[user.id])
	        //{
	        //	element.removeClass('away');
	        //	challenged.show();
	        //	return;
	        //}
	        //if(this.displayOptions.showAway)
	        //{
	        //	if(user.wants_to_play !== null && !user.wants_to_play)
	        //	{
	        //		element.addClass('away');
	        //		noChallenges.show();
	        //		return;
	        //	}
	        //}
	        //if(user.is_playing)
	        //{
	        //	element.removeClass('away');
	        //	nowPlaying.show();
	        //	return;
	        //}
	
	        //if(this.user.match && this.user.match.expiration)
	        //{
	        //	challenge.addClass('active').show();
	        //	updateMatchCount(user.match,challenge);
	        //	if(user.match.is_ranked)
	        //	{
	        //		challenge.removeClass('friendlies');
	        //		challenge.addClass('ranked');
	        //	}
	        //	else
	        //	{
	        //		challenge.removeClass('ranked');
	        //		challenge.addClass('friendlies');
	        //	}
	        //	return;
	        //}
	        //
	        //if(user.id != myUser.id)
	        //{
	        //	challenge.show();
	        //}
	    }
	    this.isFirstUpdate = false;
	    //challenge.text('Play').removeClass('active').removeClass('friendlies ranked').attr('title','Click to ask for a match!');
	};
	UserlistElement.newElement = function () {
	    var element = _User.User.getOnlineUserTemplate();
	    element.data('usernameElement', element.find('.username'));
	    element.data('locationElement', element.find('.location'));
	    element.data('statusElement', element.find('.title'));
	
	    return element;
	};
	UserlistElement.displayOptions = {
	    challengeButtonOptionsMatchmaking: { showPlayButtons: true, showOnline: false, showOffline: false, showAway: false },
	    challengeButtonOptionsMessages: { showPlayButtons: false, showOnline: true, showOffline: true, showAway: false },
	    challengeButtonOptionsFriends: { showPlayButtons: true, showOnline: false, showOffline: true, showAway: false },
	    challengeButtonOptionsUserInfo: { showPlayButtons: true, showOnline: false, showOffline: false, inviteToMatch: true },
	    challengeButtonOptionsUsersOnly: { showPlayButtons: false, showOnline: false, showOffline: false, showAway: false },
	    challengeButtonOptionsOnlineUser: { showPlayButtons: true, showOnline: false, showOffline: false, showAway: true }
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PreferredBuilds = function () {
	    function PreferredBuilds(data) {
	        _classCallCheck(this, PreferredBuilds);
	
	        if (!data) {
	            this.ladders = {};
	            return;
	        }
	        if (data instanceof PreferredBuilds) {
	            this.ladders = data.ladders;
	        } else {
	            this.ladders = data;
	        }
	    }
	
	    _createClass(PreferredBuilds, [{
	        key: "hasPreferredBuildsFor",
	        value: function hasPreferredBuildsFor(ladderId) {
	            if (this.ladders[ladderId] && this.ladders[ladderId].length) {
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: "getPreferredBuildsFor",
	        value: function getPreferredBuildsFor(ladderId) {
	            if (this.hasPreferredBuildsFor(ladderId)) {
	                return this.ladders[ladderId];
	            }
	            return [];
	        }
	    }, {
	        key: "extend",
	        value: function extend(ladderList) {
	            if (ladderList) {
	                this.byId = null; //Reset
	                $.extend(this.ladders, ladderList);
	            }
	        }
	    }, {
	        key: "getBuildById",
	        value: function getBuildById(id) {
	            if (!this.byId) {
	                this.byId = {};
	                var byId = this.byId;
	                $.each(this.ladders, function (ladderId, ladderBuilds) {
	                    $.each(ladderBuilds, function (index, build) {
	                        byId[build.id] = build;
	                    });
	                });
	            }
	            return this.byId[id];
	        }
	    }, {
	        key: "getBuildsByLadder",
	        value: function getBuildsByLadder(ladderId) {
	            return this.ladders[ladderId];
	        }
	    }, {
	        key: "getBestBuildHostPerspective",
	        value: function getBestBuildHostPerspective(otherBuilds, ladderId) {
	            if (this.ladders[ladderId] && otherBuilds.ladders[ladderId]) {
	                var myCurrent = this.ladders[ladderId];
	                var otherCurrent = otherBuilds.ladders[ladderId];
	                var buildToUse = null;
	
	                $.each(myCurrent, function (i, build) {
	                    if (buildToUse) {
	                        return false;
	                    }
	                    if (!build.active) {
	                        return;
	                    }
	                    $.each(otherCurrent, function (j, compareBuild) {
	                        if (!compareBuild.active) {
	                            return;
	                        }
	                        if (build.id == compareBuild.id) {
	                            buildToUse = build;
	                            return false;
	                        }
	                    });
	                });
	                return buildToUse;
	            } else {
	                return null;
	            }
	        }
	    }]);
	
	    return PreferredBuilds;
	}();
	
	exports.PreferredBuilds = PreferredBuilds;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getOrdinal = getOrdinal;
	function getOrdinal(n) {
	    if (parseFloat(n) == parseInt(n) && !isNaN(n)) {
	        var s = ["th", "st", "nd", "rd"],
	            v = n % 100;
	        return n + (s[(v - 20) % 10] || s[v] || s[0]);
	    }
	    return n;
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Flair = function () {
	    function Flair(data) {
	        _classCallCheck(this, Flair);
	
	        this.setProperties(data);
	    }
	
	    _createClass(Flair, [{
	        key: 'setProperties',
	        value: function setProperties(data) {
	            var i;
	            for (i in data) {
	                if (data.hasOwnProperty(i)) {
	                    this[i] = data[i];
	                }
	            }
	            if (imageUrl) {
	                this.fullUrl = '//' + imageUrl + data.safe_url;
	            } else {
	                this.fullUrl = siteUrl + '/' + data.safe_url;
	            }
	            if (this.name) {
	                Flair.cachedFlairs[this.name] = this;
	            }
	        }
	    }, {
	        key: 'createElement',
	        value: function createElement() {
	            var img = $('<img>');
	            var flairClass = 'flair-' + this.name;
	            img = img.addClass('flairy').addClass(flairClass).attr('src', this.fullUrl);
	            return img;
	        }
	    }]);
	
	    return Flair;
	}();
	
	Flair.cachedFlairs = {};
	Flair.retrieve = function (data) {
	    if (Flair.cachedFlairs[data.name]) {
	        return Flair.cachedFlairs[data.name];
	    } else {
	        return new Flair(data);
	    }
	};
	exports.Flair = Flair;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var MatchModeManager = exports.MatchModeManager = function MatchModeManager() {
	    this.currentMode = MatchModeManager.modes.SEARCH;
	    this.currentBattleMode = MatchModeManager.battleModes.NO_MATCH;
	};
	MatchModeManager.prototype.changeBattleMode = function (mode) {
	    var _this = this;
	
	    if (!this.battleContainer) {
	        this.battleContainer = $('#tab-pane-battle');
	    }
	    if (this.currentBattleMode == mode) {
	        return; //Already good
	    }
	    this.currentBattleMode = mode;
	    $.each(MatchModeManager.battleModes, function (i, otherMode) {
	        if (otherMode != mode) _this.battleContainer.removeClass(otherMode);
	    });
	    this.battleContainer.addClass(mode);
	};
	MatchModeManager.prototype.changeViewMode = function (mode) {
	    var _this2 = this;
	
	    if (!this.container) {
	        this.container = $('#tab-pane-matchmaking');
	    }
	    if (this.currentMode == mode) {
	        return; //Already good
	    }
	    this.currentMode = mode;
	    $.each(MatchModeManager.modes, function (i, otherMode) {
	        if (otherMode != mode) _this2.container.removeClass(otherMode);
	    });
	    this.container.addClass(mode);
	};
	MatchModeManager.prototype.getCurrentViewMode = function () {
	    return this.currentMode;
	};
	MatchModeManager.prototype.getCurrentBattleMode = function () {
	    return this.currentBattleMode;
	};
	MatchModeManager.prototype.viewModeIs = function (viewMode) {
	    return this.getCurrentViewMode() == viewMode;
	};
	MatchModeManager.prototype.battleModeIs = function (viewMode) {
	    return this.getCurrentBattleMode() == viewMode;
	};
	
	MatchModeManager.modes = {
	    SELECT_OPTIONS: 'select_options',
	    SEARCH: 'search_mode',
	    ACTIVITY_MODE: 'activity_mode'
	};
	MatchModeManager.battleModes = {
	    NO_MATCH: 'no_match',
	    MATCH_SINGLES: 'match_singles',
	    MATCH_DOUBLES: 'match_doubles'
	};
	
	var matchModeManager = exports.matchModeManager = new MatchModeManager();

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Match = undefined;
	
	var _MatchModeManager = __webpack_require__(22);
	
	var _User = __webpack_require__(12);
	
	var _matchmaking = __webpack_require__(10);
	
	var _LadderDistance = __webpack_require__(14);
	
	var _Request = __webpack_require__(7);
	
	var _BrowserNotification = __webpack_require__(24);
	
	var _MatchSounds = __webpack_require__(29);
	
	var _LadderInfo = __webpack_require__(30);
	
	var _Timer = __webpack_require__(31);
	
	var _Dashboard = __webpack_require__(5);
	
	var _UserCollection = __webpack_require__(11);
	
	var Match = exports.Match = function Match(matchData) {
	    var match = matchData;
	    for (var k in matchData) {
	        if (matchData.hasOwnProperty(k)) {
	            this[k] = matchData[k];
	        }
	    }
	    this.matchContainer = null;
	    this.playerList = null;
	    this.isFirst = true;
	    this.matchReference = match;
	    this.perspectivePlayer = null;
	};
	
	Match.prototype.report = function (result, disputeMessage, buttons) {
	    var data = { won: result, message: disputeMessage, match_id: this.id };
	    if (buttons) {
	        buttons.prop('disabled', true).addClass('disabled');
	    }
	    _Request.Request.send(data, 'report_match').done(function (response) {
	
	        if (response.success) {
	            if (response.error) {
	                alert(response.error);
	            }
	            if (response.message) {
	                // alert(response.message);
	            }
	        }
	        return true;
	    }).always(function () {
	        if (buttons) {
	            buttons.prop('disabled', false).removeClass('disabled');
	        }
	    }).fail(function () {
	        alert("There was a server side error");
	    });
	    addGaEvent('matchmaking', 'report-match');
	};
	Match.prototype.updateChanges = function (newMatch) {
	    var currentMatch = this;
	    if (newMatch == currentMatch) {
	        return newMatch;
	    }
	    newMatch.isFirst = false;
	    newMatch.setMatchContainer(this.matchContainer);
	    newMatch.playerList = this.playerList;
	
	    if (true) //Currently doesn't do anything...
	        {
	            //Check match players
	            $.each(this.players, function (i, player) {
	                if (player.match.still_chatting) {
	                    if (newMatch.players[i] && newMatch.players[i].match && !newMatch.players[i].match.still_chatting) {
	                        //currentMatch.postNotification(player.player.username+' left the match chat.');
	                    }
	                }
	            });
	        }
	    //Check match lobby
	    return newMatch;
	};
	Match.prototype.setPerspectivePlayer = function (player) {
	    this.perspectivePlayer = player;
	};
	Match.prototype.getOtherPlayerElements = function () {
	    var otherPlayers = this.getOtherPlayers();
	    return _UserCollection.UserCollection.convertListToElements(otherPlayers);
	};
	Match.prototype.getPlayers = function () {
	    var playerList = [];
	    if (this.players) //Primary list
	        {
	            $.each(this.players, function (i, player) {
	                player = player.player;
	                playerList.push(_matchmaking.Users.update(player));
	            });
	        }
	    return playerList;
	};
	Match.prototype.getOtherPlayers = function () {
	    var _this = this;
	
	    var playerList = [];
	    if (!this.perspectivePlayer) {
	        throw 'setPerspectivePlayer(player) needs to be used in order to call this function';
	    }
	    if (this.isSingles()) {
	        if (this.player1.id != this.perspectivePlayer.id) {
	            playerList.push(_matchmaking.Users.update(this.player1));
	        }
	        if (this.player2.id != this.perspectivePlayer.id) {
	            playerList.push(_matchmaking.Users.update(this.player2));
	        }
	        return playerList;
	    }
	    if (this.players) //Primary list
	        {
	            $.each(this.players, function (i, player) {
	                player = player.player;
	                if (player.id != _this.perspectivePlayer.id) {
	                    playerList.push(_matchmaking.Users.update(player));
	                }
	            });
	            return playerList;
	        }
	    if (this.lobby) {
	        $.each(this.lobby.players, function (i, player) {
	            if (player.id != _this.perspectivePlayer.id) {
	                playerList.push(_matchmaking.Users.update(player));
	            }
	        });
	        return playerList;
	    }
	};
	Match.prototype.postNotification = function (message, callback) {
	    if (this.matchContainer.data('chat_container')) {
	        this.matchContainer.data('chat_container').trigger('postNotification', [message, callback]);
	    } else {
	        console.log('Could not post notification:', message);
	    }
	};
	Match.prototype.scrollToBottom = function (message, callback) {
	    if (this.matchContainer.data('chat_container') && this.matchContainer.data('chat_container').data('reScroll')) {
	        this.matchContainer.data('chat_container').data('reScroll')();
	    }
	};
	Match.prototype.setMatchContainer = function (container) {
	    this.matchContainer = container;
	};
	Match.prototype.containsPlayer = function (player) {
	    if (this.player1 && this.player1.id == player.id || this.player2 && this.player2.id == player.id) {
	        return true;
	    }
	    if (this.players) {
	        return !!this.players[player.id];
	    }
	    return false;
	};
	Match.prototype.lobbyIsOpenOnMyScreen = function () {
	    return $('#match_container_' + this.id).length > 0;
	};
	Match.prototype.containsMe = function () {
	    return this.containsPlayerInLobby(myUser);
	};
	Match.prototype.containsPlayerInLobby = function (player) {
	    if (this.lobby && this.lobby.players) {
	        return !!this.lobby.players[player.id];
	    }
	    return false;
	};
	Match.prototype.getMatchPlayerCount = function () {
	    var count = 0;
	    $.each(this.players, function (i, player) {
	        if (player.match && player.match.still_chatting) {
	            count++;
	        }
	    });
	    return count;
	};
	Match.prototype.atLeastOneOtherPlayerIsChatting = function () {
	    return this.getMatchPlayerCount() > 1;
	};
	Match.prototype.isSingles = function () {
	    return this.team_size == 1;
	};
	Match.prototype.isDoubles = function () {
	    return this.team_size == 2;
	};
	Match.prototype.usesTeamList = function () {
	    return this.playerList !== null;
	};
	Match.prototype.setTitleElement = function () {
	    this.matchContainer;
	};
	Match.prototype.getUrl = function () {
	    return siteUrl + '/match/view/' + this.id;
	};
	Match.summaryTemplate = null;
	Match.prototype.generateSummary = function () {
	    if (!Match.summaryTemplate) {
	        Match.summaryTemplate = $('.summary_template.template').remove().clone().removeClass('template');
	    }
	};
	Match.prototype.populateCharacters = function () {
	    var match = this;
	    var characters = match.characters;
	    var characterTemplate = $('#character_template').find('.character');
	    var characterPicks = this.matchContainer.find('.character_picks');
	
	    $.each(characters, function (i, character) {
	        var element = characterTemplate.clone();
	        element.removeClass('character_for_game_').addClass('character_for_game_' + match.game_slug).addClass('character_name_' + character.slug_name).addClass('character_id_' + character.id);
	        element.attr('title', character.name);
	        element.find('input[name=character_id]').val(character.id);
	        element.find('input[name=name]').val(character.name);
	        element.find('.name').text(character.name);
	        element.data('name', character.name);
	        element.data('id', character.id);
	        element.css('background-image', 'url(' + character.image_url + ')');
	        element.appendTo(characterPicks);
	    });
	};
	Match.prototype.populateStages = function () {
	    var match = this;
	    var stages = match.stages;
	    var stageTemplate = $('#stage_template').find('.stage');
	    var stagePicks = this.matchContainer.find('.stage_picks');
	    $.each(stages, function (i, stage) {
	        var element = stageTemplate.clone();
	        element.removeClass('stage_for_game_').addClass('stage_for_game_' + match.game_slug);
	        element.css('background-image', 'url(' + stage.image_url + ')');
	        element.attr('title', stage.name);
	        element.find('input[name=stage_id]').val(stage.id);
	        element.find('input[name=name]').val(stage.name);
	        element.find('.name').text(stage.name);
	        element.data('name', stage.name);
	        element.appendTo(stagePicks);
	    });
	};
	Match.prototype.getTeamCount = function () {
	    var teams = {};
	    var total = 0;
	    var match = this;
	    $.each(this.players, function (i, player) {
	        match.players[i].player = _matchmaking.Users.update(player.player);
	        if (!teams[player.team_number]) {
	            total++;
	            teams[player.team_number] = 1;
	        }
	    });
	    return total;
	};
	Match.prototype.updateTeamLists = function () {
	    var teamListTemplate = this.matchContainer.find('.team_list.template');
	    if (!this.lobby.invited) {
	        this.lobby.invited = {};
	    }
	    if (this.team_size == 1) {
	        return;
	    }
	    if (!this.playerList) {
	        this.playerList = {
	            element: null,
	            userlist: null,
	            players: {}
	        };
	        this.playerList.element = teamListTemplate.removeClass('template');
	        this.playerList.userlist = this.playerList.element.find('.userlist');
	    }
	    var match = this;
	
	    // alert('update lists');
	    $.each(this.lobby.players, function (i, player) {
	        match.addToLobbyList(i, player);
	    });
	    $.each(this.lobby.invited, function (i, player) {
	        match.addToLobbyList(i, player);
	    });
	
	    $.each(this.playerList.players, function (i, player) {
	        if (!match.lobby.players[i] && !match.lobby.invited[i]) {
	            match.removePlayerFromPlayerList(player);
	            return true;
	        }
	    });
	};
	
	Match.prototype.addToLobbyList = function (i, player) {
	    var match = this;
	    var isInMatch = !!match.players[i];
	    var addedElement;
	    addedElement = match.playerList.players[i];
	    if (addedElement) {
	        //Already exists... Update the player I suppose? Perhaps match them to their match team and such, etc
	        addedElement = addedElement.element;
	    } else {
	        addedElement = match.addPlayerToPlayerList(player);
	    }
	
	    if (match.lobby.players[player.id]) {
	        addedElement.joined = true;
	    }
	    if (addedElement.joined && !addedElement.joinedAnnounced) {
	        if (!match.isFirst) {
	            match.postNotification(player.username + ' has joined the match.');
	            _MatchSounds.MatchSounds.playJingles();
	            _BrowserNotification.BrowserNotification.showNotification('New Player!', {
	                body: player.username + ' has joined the match.'
	            }
	            /*challengeNotificationOptions*/);
	        }
	        addedElement.joinedAnnounced = true;
	    }
	    if (player.id == myUser.id) {
	        addedElement.addClass('is_me');
	    }
	
	    if (match.lobby.invited[i]) {
	        addedElement.addClass('invited');
	        addedElement.removeClass('pending');
	        addedElement.removeClass('accepted');
	    } else {
	        addedElement.removeClass('invited');
	        if (match.players[i]) {
	            addedElement.addClass('accepted');
	            addedElement.removeClass('pending');
	            if (match.players[i].match && match.players[i].match.team_number) {
	                if (match.players[i].match.team_number === 1) {
	                    addedElement.data('selected_team', 1);
	                } else if (match.players[i].match.team_number === 2) {
	                    addedElement.data('selected_team', 2);
	                }
	                if (addedElement.data('selected_team')) {
	                    var changeSelectedTeamTo = addedElement.data('selected_team');
	                    if (addedElement.data('selected_team') != addedElement.data('set_selected_team')) {
	                        addedElement.data('set_selected_team', changeSelectedTeamTo);
	
	                        var buttons = addedElement.find('.select_team_button');
	                        var selectedButton = buttons.filter('[data-team_number=' + changeSelectedTeamTo + ']');
	                        buttons.removeClass('active');
	                        selectedButton.addClass('active');
	                    }
	                } else {
	                    addedElement.find('.select_team_button').removeClass('active');
	                }
	            }
	        } else {
	            addedElement.removeClass('accepted');
	            addedElement.addClass('pending');
	        }
	    }
	};
	Match.prototype.addPlayerToPlayerList = function (player) {
	    var match = this;
	    var userlistElement = Match.createUserlistElement();
	
	    var acceptButton = userlistElement.find('.accept_player');
	    var declineButton = userlistElement.find('.decline_player');
	    var uninviteButton = userlistElement.find('.invited_pending');
	    var selectTeamButton = userlistElement.find('.select_team_button');
	    var disableButtons = function disableButtons() {
	        acceptButton.add(declineButton).add(uninviteButton).prop('disabled', true);
	    };
	    var enableButtons = function enableButtons() {
	        acceptButton.add(declineButton).add(uninviteButton).prop('disabled', false);
	    };
	
	    selectTeamButton.on('click', function (e) {
	        e.stopImmediatePropagation();
	        var button = $(this);
	        if (!button.closest('.is_me').length) {
	            return;
	        }
	        var teamNumber = button.data('team_number');
	        selectTeamButton.prop('disabled', true);
	        var data = {};
	        data.match_id = match.id;
	        data.team_number = teamNumber;
	
	        $.post(siteUrl + '/match/select_team_number', data).done(function (response) {
	            selectTeamButton.removeClass('active');
	            if (response.success) {
	                button.addClass('active');
	            } else {}
	            if (response.error) {
	                alert(response.error);
	            }
	        }).always(function () {
	            selectTeamButton.prop('disabled', false);
	        });
	    });
	
	    uninviteButton.on('click', function (e) {
	        e.stopImmediatePropagation();
	        disableButtons();
	        var data = {
	            player_id: player.id,
	            match_id: match.id,
	            uninvite: 1
	        };
	        $.post(siteUrl + '/matchmaking/modify_player_for_match', data, function (response) {});
	    });
	    acceptButton.on('click', function (e) {
	        e.stopImmediatePropagation();
	        var data = {
	            player_id: player.id,
	            match_id: match.id,
	            accept: 1
	        };
	        disableButtons();
	        $.post(siteUrl + '/matchmaking/modify_player_for_match', data, function (response) {
	            if (response.error) {
	                alert(response.error);
	            }
	            enableButtons();
	        }).error(function () {
	            enableButtons();
	        });
	    });
	    declineButton.on('click', function (e) {
	        e.stopImmediatePropagation();
	        var data = {
	            player_id: player.id,
	            match_id: match.id,
	            decline: 1
	        };
	        disableButtons();
	        $.post(siteUrl + '/matchmaking/modify_player_for_match', data, function (response) {
	            if (response.error) {
	                alert(response.error);
	            }
	            enableButtons();
	        }).error(function () {
	            enableButtons();
	        });
	    });
	
	    var user = userlistElement.find('.username');
	
	    userlistElement.data('id', player.id);
	    userlistElement.data('username', player.username);
	    if (!(player instanceof _User.User)) {
	        player = _matchmaking.Users.update(player);
	    }
	    if (this.lobby.players[player.id] && !(this.lobby.players[player.id] instanceof _User.User)) {
	        this.lobby.players[player.id] = player;
	    }
	    player.updateUserElements(user);
	    var locationElement = userlistElement.find('.location');
	    _LadderDistance.LadderDistance.setDescription(locationElement, player.location, myUser.location);
	    locationElement.text(player.location.relativeLocation());
	
	    this.playerList.players[player.id] = {
	        player: player,
	        element: userlistElement
	    };
	
	    userlistElement.appendTo(this.playerList.userlist);
	    return userlistElement;
	};
	Match.prototype.closeMatch = function () {
	    this.matchContainer.find('.control-buttons .closing_x').click();
	    _MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SEARCH);
	};
	Match.prototype.removePlayerFromPlayerList = function (player) {
	    var playerListPlayer = this.playerList.players[player.player.id];
	    if (playerListPlayer) {
	        playerListPlayer.element.remove();
	        if (playerListPlayer.player.id == myUser.id) {
	            this.closeMatch();
	        }
	        this.postNotification(playerListPlayer.player.username + ' has left the match.');
	        delete this.playerList.players[player.player.id];
	    }
	};
	Match.prototype.setDoublesViewAsPriorityIfNeeded = function () {
	    if (this.containsPlayerInLobby(myUser) || this.lobbyIsOpenOnMyScreen()) {
	        if (this.team_size > 1) {
	            var tempMatchesList = {};
	            tempMatchesList[this.id] = this;
	            var reference = _LadderInfo.LadderInfo.retrieveReference('currentMatches');
	            delete reference.callbacks.preventReadd[this.id];
	            _LadderInfo.LadderInfo.parseChanges('currentMatches', tempMatchesList);
	            _MatchModeManager.matchModeManager.changeBattleMode(_MatchModeManager.MatchModeManager.battleModes.MATCH_DOUBLES);
	        }
	        if (!this.containsPlayerInLobby(myUser)) {
	            _MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SEARCH);
	        }
	    }
	};
	Match.prototype.setupCountdown = function (mainElement, countdownElement, finishedCallback) {
	
	    if (this.search_time_remaining === true) {
	        countdownElement.addClass('infinite');
	    } else {
	        var timer = new _Timer.Timer(countdownElement, this.search_time_remaining, function () {
	            setTimeout(finishedCallback, 1);
	        }, function () {
	            var shouldTick = _Dashboard.Dashboard.matchmakingTab.data('paneActive');
	            return shouldTick;
	        });
	        mainElement.data('attachedCountdown', timer);
	    }
	};
	Match.createUserlistElement = function () {
	    return $('<li class="online_user">' + '<button class="accept_player btn-xs btn btn-success search_only">Accept</button>' + '<button class="decline_player btn-xs btn btn-danger search_only">Decline</button>' + '<button class="invited_pending btn-xs btn-clear">Remove Invitation</button>' + '<span class="invited_text">Invited</span>' + '<span class="username"></span> <span class="location"></span> ' + '<span class="team">None</span>  ' + '<div class="select_team">' + '<button data-team_number="1" class="btn-xs btn btn-success select_team_button search_only">Team 1</button>' + '<button data-team_number="2" class="btn-xs btn btn-success select_team_button search_only">Team 2</button>' + '</div>' + '<div class="team_announcement"></div>' + '</li>');
	};
	Match.stickySearches = {};
	Match.hasSimilarSticky = function (newSearch) {};
	Match.prototype.isSimilarTo = function (otherSearch) {
	    if (this.is_ranked != otherSearch.is_ranked) return false;
	    if (this.ladder_id != otherSearch.ladder_id) return false;
	    if (this.team_size != otherSearch.team_size) return false;
	    if (this.match_count != otherSearch.match_count) return false;
	    return true;
	};
	Match.prototype.wantsToPlayRankedText = function () {
	    return this.player2.username + ' (' + this.player2.location.relativeLocation() + ')' + ' wants to play a ranked match!';
	};
	Match.prototype.wantsToPlayFriendliesText = function () {
	    return this.player2.username + ' (' + this.player2.location.relativeLocation() + ')' + ' wants to play friendlies!';
	};
	Match.prototype.showWantsToPlayNotification = function (notification, searchElement) {
	    var text;
	    var withinRange = true;
	    if (this.location) {
	        if (!this.location.isWithinPreferredRange() && this.gameData && this.gameData.preferred_distance_matters) {
	            withinRange = false;
	            notification.body = this.player2.username + ' is outside of your preferred range';
	        }
	    }
	
	    var inChatNotification = _BrowserNotification.BrowserNotification.showNotification(notification.title, notification, true).showInChatAlso(true);
	    if (inChatNotification) {
	        inChatNotification.find('.message').html(this.player2.createUsernameElement()).append(' ').append(this.player2.location.createLocationElement()).append(' wants to play ' + this.ladder.name + ' ' + (this.team_size == 1 ? ' singles' : ' doubles') + '!').append(withinRange ? '' : '<span class="error"> (Out of your preferred range)</span>');
	
	        inChatNotification.addClass('match_notification_shortcut').attr('title', 'Click to show challenge anyway');
	        inChatNotification.data('match_id', this.id);
	        inChatNotification.data('searchElement', searchElement);
	    }
	
	    _MatchSounds.MatchSounds.playMatchRequestNotification();
	};
	Match.prototype.browserNotification = function (title, text, showInChat) {
	    return _BrowserNotification.BrowserNotification.showNotification(title, {
	        body: text
	    }, this.getBrowserNotificationOptions()).showInChatAlso(showInChat);
	};
	Match.prototype.summaryDescription = function () {};
	Match.prototype.showSimilarSearchBrowserNotification = function (searchElement) {
	    if (!(this.player1 instanceof _User.User)) {
	        this.player1 = _matchmaking.Users.update(this.player1);
	    }
	    var title = this.player1.username;
	    var locationInformation = ' (' + this.player1.location.relativeLocation() + ')';
	
	    var matchInformation = ' started a ' + this.ladder.name + ' search';
	
	    title = title + ' ' + locationInformation + ' ' + matchInformation;
	
	    var type = this.is_ranked ? 'Ranked' : 'Friendlies';
	    var totalMatches;
	    if (this.match_count == 0) {
	        totalMatches = 'Endless';
	    } else {
	        totalMatches = 'Best of ' + this.match_count;
	    }
	
	    var inChatNotification = this.browserNotification(title, totalMatches + ' ' + type, true);
	    if (inChatNotification) {
	        inChatNotification.on('click', function () {
	            inChatNotification.remove();
	        });
	        setTimeout(function () {
	            inChatNotification.remove();
	        }, 1000 * 60 * 5);
	        var locationElement = this.player1.location.createLocationElement();
	        inChatNotification.html(this.player1.createUsernameElement()).append(' ').append(locationElement).append(matchInformation);
	    }
	    _MatchSounds.MatchSounds.playStickiedMatch();
	};
	Match.prototype.getMyCurrentCharacterId = function () {
	    if (this.game && this.game.players && this.game.players[myUser.id]) {
	        return this.game.players[myUser.id].character;
	    }
	    return null;
	};
	Match.prototype.addSearchPopover = function (popoverElement, player) {
	    var search = this;
	    var builds = player.preferred_builds.getPreferredBuildsFor(search.ladder_id);
	    var popoverContent = null;
	    if (builds.length) {
	        popoverContent = $('<div>').addClass('match_popover_content');
	        var list = $('<ul class="build_list"></ul>');
	        $.each(builds, function (i, build) {
	            if (!build.active) {
	                return;
	            }
	            list.append($('<li class="build">' + build.name + '</li>'));
	        });
	        popoverContent.append(list);
	    }
	
	    if (player.hasToxicWarning()) {
	        if (!popoverContent) {
	            popoverContent = $('<div>').addClass('match_popover_content');
	        }
	        var warningMessage = null;
	        var warning = $('<div>').addClass('reported_match_behavior_warning');
	        if (player.getToxicCount() == 1 || player.getToxicCount() == 2) {
	            warningMessage = 'Warning: Reported for toxic behavior';
	        } else if (player.getToxicCount() > 4) {
	            warningMessage = 'Warning: Has more than ' + (player.getToxicCount() - 1) + ' toxic reports. Please avoid if this behavior bothers you.';
	            warning.addClass('toxic_waste');
	        } else {
	            warningMessage = 'Warning: Reported multiple times for toxic behavior';
	            warning.addClass('toxic_radioactive');
	        }
	        warning.append(warningMessage);
	        popoverContent.append(warning);
	    }
	
	    if (popoverContent) {
	        var popoverItem = popoverElement.popover({
	            html: true,
	            content: popoverContent,
	            trigger: 'hover',
	            placement: 'top',
	            container: _Dashboard.Dashboard.dashboard
	        });
	    }
	};
	Match.prototype.getBrowserNotificationOptions = function () {
	    var challengeNotificationOptions = {};
	    if (this.ladder && this.ladder.small_image) {
	        challengeNotificationOptions.icon = this.ladder.small_image;
	    }
	    return challengeNotificationOptions;
	};
	Match.prototype.containsMeAsPlayer = function () {
	    return !!this.players[myUser.id];
	};
	Match.prototype.getMyTeamNumber = function () {
	    if (!this.players[myUser.id]) {
	        return 1;
	    }
	    if (this.players[myUser.id].match && !this.players[myUser.id].match.team_number) {
	        return 1; //Erm
	    }
	    if (!this.players[myUser.id].match) {
	        return 1;
	    }
	    return this.players[myUser.id].match.team_number;
	};
	Match.prototype.getOtherTeamNumber = function () {
	    var otherTeamNumber = this.getMyTeamNumber();
	    if (otherTeamNumber === null) {
	        return 2;
	    }
	
	    return otherTeamNumber == 1 ? 2 : 1;
	};
	Match.prototype.getMyTeamNameElement = function () {
	    if (this.isSingles()) {
	        return myUser.createUsernameElement().prop('outerHTML');
	    } else if (this.isDoubles()) {
	        return 'Your Team';
	    }
	};
	Match.prototype.getOtherTeamNameElement = function () {
	    if (this.isSingles()) {
	        return this.getOtherPlayers()[0].createUsernameElement().prop('outerHTML');
	    } else if (this.isDoubles()) {
	        return 'The Other Team';
	    }
	};
	
	$('#main_chat_area').on('click', '.match_notification_shortcut', function (e) {
	    var searchId = $(this).data('match_id');
	    if ($(this).data('searchElement')) {
	        $(this).data('searchElement').addClass('show_by_exception');
	        $(this).remove();
	    }
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BrowserNotification = undefined;
	
	var _Settings = __webpack_require__(25);
	
	var _Dashboard = __webpack_require__(5);
	
	var _ChatActions = __webpack_require__(4);
	
	var _Html = __webpack_require__(27);
	
	var _TokensManager = __webpack_require__(28);
	
	var NotificationManager = function NotificationManager() {
	    this.currentTitleAlertLevel = 0;
	    this.browserHasFocus = 1;
	    this.notification = null;
	
	    this.lastNotificationTitle = null;
	    this.lastNotificationMessage = null;
	
	    if ('serviceWorker' in navigator) {
	        navigator.serviceWorker.register(siteUrl + '/sw.js');
	    } else {
	        console.warn('Service workers aren\'t supported in this browser.');
	    }
	
	    this.titleNotification = function (message, duration, level) {
	        //0 = General Chat Messages
	        //1 = Subchat message
	        //2 =
	        //5 = Mentioned
	        duration = duration || 0;
	        level = level || 0;
	
	        if (level < this.currentTitleAlertLevel) {
	            return;
	        }
	
	        this.currentTitleAlertLevel = level;
	        if (isInLadder) {
	            $.titleAlert(message, {
	                requireBlur: true,
	                stopOnFocus: true,
	                duration: duration,
	                interval: 800
	            });
	        }
	    };
	
	    if (typeof document.hasFocus === 'undefined') {
	        document.hasFocus = function () {
	            return document.visibilityState == 'visible';
	        };
	    }
	    this.checkBrowserFocus = function () {
	        this.browserHasFocus = document.hasFocus();
	        if (this.browserHasFocus) this.currentTitleAlertLevel = 0;
	        return this.browserHasFocus;
	    };
	
	    this.showInChatAlso = function (largeScreensAlso) {
	        NotificationManager.initializePushNotificationState();
	        if (largeScreensAlso || !_Dashboard.Dashboard.dashboard.hasClass('dashboard-md')) {
	            return _ChatActions.ChatActions.addNotificationToChat(null, _Html.Html.encode(this.lastNotificationMessage), true);
	        }
	        return;
	    };
	    this.clearTag = function (tag) {
	        BrowserNotification.messageServiceWorker({ action: 'clearTag', data: { tag: tag } });
	    };
	    this.showNotification = function (title, options) {
	
	        options = options || {};
	        if (!options.body) {
	            options.body = '';
	        }
	        this.lastNotificationTitle = title;
	        this.lastNotificationMessage = options.body;
	        if ('serviceWorker' in navigator) {
	            navigator.serviceWorker.register(siteUrl + '/sw.js').then(NotificationManager.initializePushNotificationState);
	        } else {
	            console.warn('Service workers aren\'t supported in this browser.');
	        }
	
	        if (_Settings.Settings.isChecked('receive_browser_notifications')) {
	            if (!this.checkBrowserFocus() && isInLadder) {
	                var defaultOptions = {
	                    icon: siteUrl + "/android-icon-144x144.png",
	                    timeout: 5500,
	                    onClick: function onClick() {
	                        window.focus();
	                        this.close();
	                    },
	                    tag: title,
	                    serviceWorker: siteUrl + '/sw.js',
	                    timestamp: Date.now(),
	                    title: title
	                };
	
	                if (title) {
	                    this.titleNotification(title);
	                }
	                if (options.onClick) {
	                    var theClick = options.onClick;
	                    var defaultClick = defaultOptions.onClick;
	                    delete defaultOptions.onClick;
	                    delete options.onClick;
	                    options.onClick = function () {
	                        theClick.call(this);
	                        defaultClick.call(this);
	                    };
	                }
	                $.extend(defaultOptions, options);
	                if (navigator.serviceWorker && navigator.serviceWorker.controller && !options.onClick && options.url) {
	                    new Promise(function (resolve, reject) {
	                        // Create a Message Channel
	                        var msg_chan = new MessageChannel();
	
	                        // Handler for recieving message reply from service worker
	                        msg_chan.port1.onmessage = function (event) {
	                            if (event.data.error) {
	                                reject(event.data.error);
	                            } else {
	                                resolve(event.data);
	                            }
	                        };
	
	                        // Send message to service worker along with port for reply
	                        var messageData = {
	                            action: 'showNotification',
	                            data: defaultOptions
	                        };
	                        navigator.serviceWorker.controller.postMessage(JSON.parse(JSON.stringify(messageData)), [msg_chan.port2]);
	                    });
	                } else {
	                    this.notification = Push.create(title, defaultOptions);
	                }
	            }
	        }
	        return this;
	    };
	    this.showNotificationBar = function (message, duration, type) {
	
	        /*set default values*/
	        duration = typeof duration !== 'undefined' ? duration : 30000;
	        var notificationBar = $('#notification-bar');
	        if (notificationBar.data('previousTimeout')) {
	            clearTimeout(notificationBar.data('previousTimeout'));
	        }
	        notificationBar.stop(true, false).slideUp(0);
	        notificationBar.find('.notification-message').text(message);
	        /*animate the bar*/
	        notificationBar.click(function (e) {
	            notificationBar.slideUp();
	        });
	        notificationBar.slideDown(function () {
	            var previousTimeout = setTimeout(function () {
	                notificationBar.slideUp(function () {});
	            }, duration);
	            notificationBar.data('previousTimeout', previousTimeout);
	        });
	    };
	    return this;
	};
	
	NotificationManager.sendSubscriptionToServer = function (subscription) {
	    var fetchOptions = {
	        method: 'post',
	        headers: new Headers({
	            'Content-Type': 'application/json'
	        }),
	        body: JSON.stringify(subscription),
	        credentials: 'include'
	    };
	    return fetch(siteUrl + '/apiv1/update_push_subscription', fetchOptions);
	};
	
	NotificationManager.pushInitialized = false;
	NotificationManager.initializePushNotificationState = function () {
	    if (NotificationManager.pushInitialized) {
	        return;
	    }
	    NotificationManager.pushInitialized = true;
	
	    if (!('serviceWorker' in navigator)) {
	        console.warn('Service workers aren\'t supported in this browser.');
	        return;
	    }
	    // Are Notifications supported in the service worker?
	    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
	        console.warn('Notifications aren\'t supported.');
	        return;
	    }
	
	    navigator.serviceWorker.addEventListener('message', function (event) {
	        console.log(event);
	        if (event.data.appCommand) {
	            _TokensManager.TokensManager.parseData(event.data.appCommand);
	        } else if (event.data.url) {
	            alert('Post to ' + event.data.url);
	        }
	    });
	
	    // Check the current Notification permission.
	    // If its denied, it's a permanent block until the
	    // user changes the permission
	    if (Notification.permission === 'denied') {
	        console.warn('The user has blocked notifications.');
	        return;
	    }
	
	    // Check if push messaging is supported
	    if (!('PushManager' in window)) {
	        console.warn('Push messaging isn\'t supported.');
	        return;
	    }
	
	    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
	        // Do we already have a push message subscription?
	        serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {
	            if (!subscription) {
	                NotificationManager.setButtonToEnable();
	                NotificationManager.prototype.subscribe();
	                return;
	            }
	
	            NotificationManager.sendSubscriptionToServer(subscription);
	            NotificationManager.setButtonToDisable();
	        }).catch(function (err) {
	            console.error('Error during getSubscription()', err);
	        });
	    });
	};
	
	function urlB64ToUint8Array(base64String) {
	    var padding = '='.repeat((4 - base64String.length % 4) % 4);
	    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
	
	    var rawData = window.atob(base64);
	    var outputArray = new Uint8Array(rawData.length);
	
	    for (var i = 0; i < rawData.length; ++i) {
	        outputArray[i] = rawData.charCodeAt(i);
	    }
	    return outputArray;
	}
	
	NotificationManager.setButtonToEnable = function () {
	    var button = $('#browser_notifications_general');
	    button.prop('checked', false);
	};
	NotificationManager.setButtonToDisable = function () {
	    var button = $('#browser_notifications_general');
	    button.prop('checked', true);
	};
	
	NotificationManager.prototype.subscribe = function () {
	    var applicationServerPublicKey = 'BFbrkG2jtXgwtdorgeFdPG2S+cwP60FjUwJ1voo0RHblreCYzjMGLpm2igdEaJQxBgaIdLvaHibWjQuMHx2cmus=';
	    var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	
	    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
	        serviceWorkerRegistration.pushManager.subscribe({
	            userVisibleOnly: true,
	            applicationServerKey: applicationServerKey
	        }).then(function (subscription) {
	            NotificationManager.setButtonToDisable();
	
	            return NotificationManager.sendSubscriptionToServer(subscription);
	        }).catch(function (e) {
	            if (Notification.permission === 'denied') {
	                // The user denied the notification permission which
	                // means we failed to subscribe and the user will need
	                // to manually change the notification permission to
	                // subscribe to push messages
	                console.warn('Permission for Notifications was denied');
	            } else {
	                // A problem occurred with the subscription; common reasons
	                // include network errors, and lacking gcm_sender_id and/or
	                // gcm_user_visible_only in the manifest.
	                console.error('Unable to subscribe to push.', e);
	                NotificationManager.setButtonToEnable();
	            }
	        });
	    });
	};
	
	NotificationManager.prototype.unsubscribe = function () {
	    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
	        // To unsubscribe from push messaging, you need get the
	        // subscription object, which you can call unsubscribe() on.
	        serviceWorkerRegistration.pushManager.getSubscription().then(function (pushSubscription) {
	            // Check we have a subscription to unsubscribe
	            if (!pushSubscription) {
	                button.prop('disabled', false);
	                NotificationManager.setButtonToEnable();
	                return;
	            }
	
	            var subscriptionId = pushSubscription.subscriptionId;
	            // TODO: Make a request to your server to remove
	            // the subscriptionId from your data store so you
	            // don't attempt to send them push messages anymore
	
	            // We have a subscription, so call unsubscribe on it
	            pushSubscription.unsubscribe().then(function (successful) {
	                NotificationManager.setButtonToEnable();
	            }).catch(function (e) {
	
	                console.log('Unsubscription error: ', e);
	                NotificationManager.setButtonToEnable();
	            });
	        }).catch(function (e) {
	            console.error('Error thrown while unsubscribing from push messaging.', e);
	        });
	    });
	};
	
	var BrowserNotification = exports.BrowserNotification = new NotificationManager();

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Settings = undefined;
	
	var _Dashboard = __webpack_require__(5);
	
	var _Request = __webpack_require__(7);
	
	var _Ladder = __webpack_require__(26);
	
	var Settings = exports.Settings = {
	    getValue: function getValue(settingName) {
	        return Settings.getSetting(settingName).val();
	    },
	    getSetting: function getSetting(settingName) {
	        if (Settings.settingsElementCache[settingName]) {
	            return Settings.settingsElementCache[settingName];
	        }
	        var input = $('#settings_popup').find('input[name=' + settingName + ']');
	        if (input && input.length) {
	            return Settings.settingsElementCache[settingName] = input;
	        } else {
	            // console.error('error loading setting '+settingName);
	            return $();
	        }
	    },
	    isChecked: function isChecked(settingName) {
	        var input = Settings.getSetting(settingName);
	        if (input && input.length) {
	            return input.is(':checked');
	        }
	    },
	    disableAll: function disableAll() {
	        $('#settings_popup').find(':input').prop('disabled', true);
	    },
	    enableAll: function enableAll() {
	        $('#settings_popup').find(':input').prop('disabled', false);
	    },
	    settingsElementCache: {}
	};
	
	var settingsPopup = $('#settings_popup');
	settingsPopup.on('change', '.general_options input[type=checkbox]', function () {
	    var button = $(this);
	    var isChecked = button.is(':checked') ? 1 : 0;
	    var name = button.attr('name');
	    if (button.hasClass('offline_setting')) {
	        return changeOfflineSetting(button);
	    } else {}
	    var data = {};
	    data[name] = isChecked;
	
	    function changeOfflineSetting(button) {
	        if (!button.attr('name')) {
	            console.log(button);
	            console.error('Tried to change a setting with no name?');
	            return;
	        }
	        _Ladder.ladderLocalStorage.setItem('dashboardSetting' + button.attr('name'), isChecked);
	    }
	    function changeSyncedSetting(button) {}
	
	    if (button.attr('name') == 'compact_chat_style') {
	        checkChatStyle(button);
	        $('.chat_holder.active .chat_container').each(function () {
	            $(this).scrollTop($(this)[0].scrollHeight);
	        });
	    }
	    if (button.attr('name') == 'receive_browser_notifications') {
	        if (button.is(':checked')) {
	            BrowserNotification.subscribe();
	        } else {
	            BrowserNotification.unsubscribe();
	        }
	    }
	
	    button.prop('disabled', true);
	    if (button.data('justChecking')) {
	        return;
	    }
	    _Request.Request.send(data, 'update_user').done(function (response) {
	        var setting = Settings.getSetting(name).prop('checked', isChecked).trigger('settingChanged');
	        button.prop('disabled', false);
	        if (response.success) {
	            setting.trigger('changeSuccess');
	        }
	    }).fail(function () {
	        button.prop('disabled', false);
	        button.prop('checked', !button.is(':checked'));
	    });
	}).on('changeSuccess', 'input[name=chat_rooms_enabled]', function () {
	    window.location.reload(true);
	});
	
	function checkChatStyle(button) {
	    var isChecked = button.is(':checked') ? 1 : 0;
	    if (isChecked) {
	        $('body').removeClass('chat_style_modern');
	    } else {
	        $('body').addClass('chat_style_modern');
	    }
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ladderLocalStorage = exports.ladder = exports.Ladder = undefined;
	
	var _Dashboard = __webpack_require__(5);
	
	var Ladder = exports.Ladder = function Ladder() {
	    this.logging = IS_LOCALHOST;
	    Ladder.consumeAlert();
	    this.log = function (message, fThePolice) {
	        if (!console || !console.log) {
	            return;
	        }
	        if (fThePolice || ladder.logging) {
	            if (console.trace) {
	                console.trace(message);
	            }
	        }
	    };
	    var ladder = this;
	    return this;
	};
	Ladder.consumeAlert = function () {
	    if (Ladder._alert) return;
	    Ladder._alert = window.alert;
	    window.alert = Ladder.coolAlert;
	    window.coolAlert = window.alert;
	};
	Ladder.releaseAlert = function () {
	    if (!Ladder._alert) return;
	    window.alert = _alert;
	    Ladder._alert = null;
	};
	Ladder.realAlert = function (message) {
	    if (Ladder._alert) {
	        return Ladder._alert(message);
	    } else {
	        window.alert(message);
	    }
	};
	Ladder.coolAlert = function (message, title) {
	    if (typeof title == 'undefined') {
	        title = 'Alert';
	    }
	    new PNotify({
	        title: title,
	        text: message,
	        buttons: {
	            sticker: false,
	            show_on_nonblock: true
	        },
	        nonblock: {
	            nonblock: false,
	            nonblock_opacity: .4
	        }
	    });
	};
	Ladder.alert = Ladder.coolAlert;
	Ladder.declickables = [];
	var ladder = exports.ladder = new Ladder();
	var LadderLocalStorage = function LadderLocalStorage() {
	    if (!localStorage) {
	        window.localStorage = {};
	        localStorage.setItem = function () {};
	        localStorage.getItem = function () {};
	        localStorage.removeItem = function () {};
	    }
	};
	LadderLocalStorage.prototype.setItem = function (key, object) {
	    return localStorage.setItem(key, JSON.stringify(object));
	};
	LadderLocalStorage.prototype.getItem = function (key) {
	    return JSON.parse(localStorage.getItem(key));
	};
	LadderLocalStorage.prototype.incrementKey = function (key) {
	    if (!localStorage.getItem(key)) {
	        localStorage.setItem(key, 0);
	    }
	    localStorage.setItem(key, parseInt(localStorage.getItem(key)) + 1);
	    return this.getIntValue(key);
	};
	LadderLocalStorage.prototype.getIntValue = function (key) {
	    return parseInt(localStorage.getItem(key));
	};
	LadderLocalStorage.prototype.removeItem = function (key) {
	    return localStorage.removeItem(key);
	};
	var ladderLocalStorage = exports.ladderLocalStorage = new LadderLocalStorage();

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Html = exports.Html = {
	    encode: function encode(text) {
	        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
	    }
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TokensManager = undefined;
	
	var _ChatActions = __webpack_require__(4);
	
	var _PrivateChatLoader = __webpack_require__(9);
	
	var _matchmaking = __webpack_require__(10);
	
	var _Dashboard = __webpack_require__(5);
	
	var TokensManager = exports.TokensManager = function TokensManager(string) {
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
	    for (var i = this.tokens.length - 1; i >= 0; --i) {
	        if (this.tokens[i].trim().length === 0) {
	            if (i + 1 in this.tokens) {
	                that.tokens[i + 1] = " " + that.tokens[i + 1];
	                that.tokens.splice(i, 1);
	            }
	        }
	    }
	    this.get = function (key) {
	        return that.tokens[key];
	    };
	    this.command = this.get(0);
	    this.getStringAfterKey = function (key) {
	        return Array.prototype.slice.call(that.tokens, key).join(' ');
	    };
	    this.getMessage = function () {
	        return this.getStringAfterKey(1);
	    };
	    return this;
	};
	TokensManager.parseData = function (data) {
	    $.each(data, function (command, data) {
	        if (TokensManager.parseData.commands[command]) {
	            TokensManager.parseData.commands[command](data);
	        }
	    });
	};
	TokensManager.parseData.commands = {
	    private_chat: function private_chat(data) {
	        _PrivateChatLoader.PrivateChatLoader.openPrivateChat({
	            username: data.username,
	            id: data.id
	        }).load(function () {});
	    },
	    view_tab: function view_tab(data) {
	        var tab = _Dashboard.Dashboard.namedTabList[data.tab];
	        if (tab) {
	            if (!tab.hasClass('active')) {
	                tab.trigger('activate');
	            }
	        }
	    }
	};
	
	TokensManager.parseCommand = function (msg) {
	    var tokens = new TokensManager(msg);
	    if (!tokens.command) {
	        tokens.command = 'help';
	    }
	    var data;
	    if (tokens.command) {
	        if (tokens.command == 'join') {
	            if (tokens.get(1)) {
	                _ChatActions.ChatActions.joinChatRoom(tokens.getStringAfterKey(1), null, true);
	                return true;
	            }
	        }
	        if (tokens.command == 'away') {
	            changeWantsToPlay(0);
	            return true;
	        }
	        if (tokens.command == 'back') {
	            changeWantsToPlay(1);
	            return true;
	        }
	        if (tokens.command == 'private_chat') {
	            // private_chat [id] [username]
	            _PrivateChatLoader.PrivateChatLoader.openPrivateChat({
	                username: tokens.get(2),
	                id: tokens.get(1)
	            }).load(function () {});
	            return true;
	        }
	        if (false && tokens.command == 'w' || tokens.command == 'msg') //Did not work as planned
	            {
	                data = {};
	                if (!tokens.get(1)) {
	                    return 'Username is required!';
	                }
	                var user = _matchmaking.Users.retrieveByUsername(tokens.get(1));
	                user = _matchmaking.Users.retrieveByUsername(tokens.get(1));
	
	                data.message = tokens.getStringAfterKey(2);
	                _PrivateChatLoader.PrivateChatLoader.openPrivateChat(user, true).load(function (chatHolder, response) {
	                    var input = chatHolder.find('.chat_input').val(data.message);
	                    sendChat(input);
	                });
	            }
	        var currentChat = _ChatActions.ChatActions.getActiveChatContainer();
	        if (currentChat) {
	            currentChat = currentChat.data('chat');
	            var chatRoomId = currentChat.data('chat_room_id');
	            if (tokens.command == 'exit' || tokens.command == 'leave') {
	                _ChatActions.ChatActions.exitCurrentChat();
	                return true;
	            }
	            if (tokens.command == 'uninvite') {
	                data = {};
	                data.type = 'remove_invite';
	                data.chat_room_id = chatRoomId;
	                data.username = tokens.get(1);
	                $.post(siteUrl + '/matchmaking/chat_controls', data, function (response) {
	                    if (response.success) {
	                        _ChatActions.ChatActions.addNotificationToChat(null, data.username, ' has been uninvited.');
	                    } else {
	                        _ChatActions.ChatActions.addNotificationToChat(null, response.message);
	                    }
	                });
	                return true;
	            }
	            if (currentChat && tokens.command == 'all') {
	                var notifyAll = false;
	                if (!currentChat.data('chat').data('isChatMod')) {
	                    alert('You have to be a moderator of this chatroom in order to use this command');
	                    return true;
	                }
	                if (currentChat.data('button').data('has_ladder')) {
	                    notifyAll = false;
	                    alert('This command is disabled in ladder chat rooms currently');
	                } else {
	                    notifyAll = confirm('This will send a notification to all users with notifications turned on in ' + currentChat.data('name'));
	                }
	                return !notifyAll;
	            }
	            if (currentChat && tokens.command == 'mods') {
	                var modsCommandConfirmed = false;
	                if (currentChat.data('button')) {
	                    if (currentChat.data('button').data('has_ladder')) {
	                        modsCommandConfirmed = confirm('This will alert every moderator of this room to chat issues in the ladder chat ' + currentChat.data('name') + '. Unrelated alerts in a ladder chat can result in being muted or kicked.  Use disputes and reports for other issues.');
	                    } else {
	                        modsCommandConfirmed = confirm('This will alert every moderator of ' + currentChat.data('name'));
	                    }
	                } else {
	                    modsCommandConfirmed = false;
	                }
	                if (modsCommandConfirmed) {
	                    return { for_chat_mods: 1 };
	                } else {
	                    return true;
	                }
	            }
	            if (tokens.command == 'motd') {
	                currentChat.find('.chat_room_description').show();
	                return true;
	            }
	            if (tokens.command == 'invite') {
	                data = { name: theSecretField, value: theSecret };
	                data.chat_id = chatRoomId;
	                data.invite_player = tokens.get(1);
	                $.post(siteUrl + '/chats/invite_player', data, function (response) {
	                    if (response.invite && response.invite.error) {
	                        _ChatActions.ChatActions.inviteErrorMessageGenerator(tokens.get(1), response.invite);
	                    }
	                    if (response.success) {
	                        var invited = _matchmaking.Users.update(response.user);
	                        _ChatActions.ChatActions.addNotificationToChat(null, invited.createUsernameElement(), ' has been invited to ', $('<span>').addClass('chatlink').data('chatlink', currentChat.data('name')).text(currentChat.data('name') + '.'));
	                    }
	                });
	                return true;
	            }
	            if (tokens.command == 'help') {
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
	                $.each(commands, function (i, command) {
	                    helpString += command + "<br>";
	                });
	                return helpString;
	                //Add commands
	            }
	        }
	    }
	    if (tokens.command) {
	        return false;
	        return 'Command not found: ' + tokens.command;
	    }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MatchSounds = undefined;
	
	var _Settings = __webpack_require__(25);
	
	var _Dashboard = __webpack_require__(5);
	
	var MatchSounds = exports.MatchSounds = {
	    playMatchRequestNotification: function playMatchRequestNotification() {
	        if (isInLadder && !_Dashboard.Dashboard.playedSoundEffect && _Settings.Settings.isChecked('play_notifications')) {
	            _Dashboard.Dashboard.playedSoundEffect = true;
	            MatchSounds.playSound($('#challenger')[0]);
	        }
	    },
	    playJingles: function playJingles() {
	        if (isInLadder && _Settings.Settings.isChecked('play_notifications')) {
	            MatchSounds.playSound($('#jingles')[0]);
	        }
	    },
	    playStickiedMatch: function playStickiedMatch() {
	        if (isInLadder && _Settings.Settings.isChecked('play_notifications')) {
	            MatchSounds.playSound($('#stickied_match')[0]);
	        }
	    },
	    playModNotification: function playModNotification() {
	        if (isInLadder && _Settings.Settings.isChecked('play_notifications')) {
	            var sound = $('#enter')[0];
	            sound.volume = .2;
	            MatchSounds.playSound(sound);
	        }
	    },
	    playPrivateMessageSoundEffect: function playPrivateMessageSoundEffect() {
	
	        if (isInLadder && !_Dashboard.Dashboard.playedSoundEffect && _Settings.Settings.isChecked('play_notifications')) {
	            _Dashboard.Dashboard.playedSoundEffect = true;
	            MatchSounds.playSound($('#private_message_sound')[0]);
	        }
	    },
	    playSubHypeSoundEffect: function playSubHypeSoundEffect(type) {
	        if (isInLadder && !_Dashboard.Dashboard.playedSoundEffect && _Settings.Settings.isChecked('sub_hype_notification_sound')) {
	            _Dashboard.Dashboard.playedSoundEffect = true;
	            if (type && type == 'bumped') {
	                var sound = $('#sub_hype_sound_bumped')[0];
	                sound.volume = .2;
	                MatchSounds.playSound(sound);
	            } else {
	                MatchSounds.playSound($('#sub_hype_sound')[0]);
	            }
	        }
	    },
	    playSound: function playSound(soundElement) {
	        var waitTime = 150;
	        setTimeout(function () {
	            // Resume play if the element if is paused.
	            if (soundElement.paused) {
	                soundElement.play();
	            }
	        }, waitTime);
	    }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.LadderInfo = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _Ladder = __webpack_require__(26);
	
	var LadderInfo = function LadderInfo() {
	    this.version = '9.11.4';
	    this.allLists = {};
	    this.STATUS_NEW = 1;
	    this.STATUS_UPDATED = 2;
	    this.STATUS_REMOVED = 3;
	    var ladderInfo = this;
	
	    this.retrieveReference = function (listName) {
	        if ((typeof listName === 'undefined' ? 'undefined' : _typeof(listName)) == 'object') {
	            if (listName.items) {
	                return listName;
	            } else {
	                if (listName.callbackName) {
	                    var existingReference = this.retrieveReference(listName.callbackName);
	                    if (existingReference.callbacks) {
	                        listName.callbacks = existingReference.callbacks;
	                    }
	                } else {
	                    if (!listName.callbacks) {
	                        listName.callbacks = {};
	                    }
	                }
	                listName.items = {};
	                return listName;
	            }
	        }
	        if (this.allLists[listName]) {
	            return this.allLists[listName];
	        } else {
	            return this.allLists[listName] = { callbacks: {}, items: {}, extraData: {} };
	        }
	    };
	
	    this.setCallbacks = function (listName, callbacks) {
	        var currentReference = this.retrieveReference(listName);
	        $.extend(currentReference.callbacks, callbacks);
	        this.processChanges(listName); //Run it once
	    };
	
	    this.hasItems = function (listName) {
	        var currentReference = this.retrieveReference(listName);
	        return jQuery.isEmptyObject(currentReference.items);
	    };
	
	    this.processChanges = function (listName, updates) {
	        var currentReference = this.retrieveReference(listName);
	        var container = null;
	        var callbacks;
	        if (listName.callbackName) {
	            var callbackReference = this.retrieveReference(listName.callbackName);
	            callbacks = callbackReference.callbacks;
	        } else {
	            callbacks = currentReference.callbacks;
	        }
	        if (currentReference.container) {
	            container = currentReference.container;
	        }
	
	        if (!currentReference.items) {
	            currentReference.items = {};
	        }
	        if (updates) {
	            //				ladder.log('processing ',listName);
	        }
	        var items = currentReference.items;
	        //ITEMS are populated when parseChanges is run
	        //SO, we need to check that new items were added and none of the other blocks were executed
	        var somethingBesidesPopulationHappened = false;
	        var populationHappened = false;
	
	        $.each(items, function (id, currentItem) {
	            if (!items[id]) items[id] = {};
	            var property = items[id];
	
	            if (property.status == ladderInfo.STATUS_NEW) {
	                property.status = null;
	                if (callbacks.onNew) {
	                    property.element = callbacks.onNew(id, currentItem.data, container);
	                    if (!property.element) {
	                        // ladder.log('NO ELEMENT RETURNED FOR : '+ listName +' onNew!');
	                    }
	                }
	                populationHappened = true;
	            } else if (property.status == ladderInfo.STATUS_UPDATED) {
	                property.status = null;
	                if (callbacks.onUpdate) {
	                    var element = callbacks.onUpdate(id, currentItem.data, property.element, container);
	                    if (element) {
	                        property.element = element; //Element is optional for updates
	                    }
	                }
	                somethingBesidesPopulationHappened = true;
	            } else if (property.status == ladderInfo.STATUS_REMOVED) {
	                property.status = null;
	                if (callbacks.onRemove) {
	                    if (property) {
	                        callbacks.onRemove(id, currentItem.data, property.element);
	                    }
	                    delete items[id];
	                }
	                somethingBesidesPopulationHappened = true;
	            } else {
	                somethingBesidesPopulationHappened = true;
	            }
	            property.status = null;
	        });
	        if (populationHappened && !somethingBesidesPopulationHappened) {
	            if (callbacks.onPopulate) {
	                callbacks.onPopulate(currentReference.items);
	            }
	        }
	        if ($.isEmptyObject(currentReference.items)) {
	            if (callbacks.onEmpty) {
	                callbacks.onEmpty();
	            }
	        }
	        if (callbacks.onAlways) {
	            callbacks.onAlways(currentReference.items, container);
	        }
	    };
	
	    this.forceRemove = function (listName, itemId, allowReadd) {
	        var currentReference = this.retrieveReference(listName);
	
	        var item = currentReference.items[itemId];
	        if (item) {
	            item.status = ladderInfo.STATUS_REMOVED;
	            this.processChanges(listName);
	            if (allowReadd) {
	                delete currentReference.items[itemId];
	            }
	        }
	    };
	
	    this.parseChanges = function (listName, updatedInfo) {
	        var currentReference = this.retrieveReference(listName);
	        if ($.isEmptyObject(updatedInfo)) {
	            return;
	        }
	        if (updatedInfo) {
	            if (updatedInfo.all_entries) {
	                $.each(currentReference.items, function (id, info) {
	                    if (!updatedInfo[id]) {
	                        info.status = ladderInfo.STATUS_REMOVED;
	                    }
	                });
	                delete updatedInfo.all_entries;
	            }
	            $.each(updatedInfo, function (id, updatedInfo) {
	                var currentItem;
	                if (id) {
	                    currentItem = currentReference.items[id];
	                } else {
	                    currentItem = null;
	                }
	                if (currentItem) {
	                    if (!currentReference.callbacks.skipExtendOnUpdate) {
	                        currentItem.data = $.extend(currentItem.data, updatedInfo);
	                    } else {
	                        currentItem.data = updatedInfo;
	                    }
	                    currentItem.status = ladderInfo.STATUS_UPDATED;
	
	                    if (currentItem.data.is_removed) {
	                        currentItem.status = ladderInfo.STATUS_REMOVED;
	                    }
	                } else {
	                    var blocked = false;
	                    var callbacks = currentReference.callbacks;
	                    if (callbacks.preventReadd && id) {
	                        if (callbacks.preventReadd[id]) {
	                            blocked = true;
	                        } else {
	                            callbacks.preventReadd[id] = true;
	                        }
	                    }
	                    if (blocked && id) {
	                        _Ladder.ladder.log('BLOCKED');
	                    } else {
	                        currentItem = currentReference.items[id] = {};
	                        currentItem.data = updatedInfo;
	                        currentItem.status = ladderInfo.STATUS_NEW;
	                        if (currentItem.data.is_removed) {
	                            currentItem.status = ladderInfo.STATUS_REMOVED;
	                        } else {}
	                    }
	                }
	            });
	        }
	        this.processChanges(listName, updatedInfo);
	    };
	
	    return this;
	};
	exports.LadderInfo = LadderInfo = new LadderInfo();
	exports.LadderInfo = LadderInfo;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Timer = undefined;
	
	var _Ladder = __webpack_require__(26);
	
	var Timer = exports.Timer = function Timer(element, timeRemaining, callback, shouldUpdateTextElementCallback) {
	    this.element = element;
	    this.id = Timer.timerIds++;
	    this.changeTimeRemaining(timeRemaining);
	    this.callback = callback;
	    this.shouldUpdateTextElementCallback = shouldUpdateTextElementCallback;
	    var $this = this;
	    Timer.timers[this.id] = this;
	    Timer.generalLoop();
	    $this.updateCountdown();
	    element.data('attachedCountdown', this);
	};
	Timer.generalLoopStarted = false;
	Timer.generalLoop = function () {
	    if (Timer.generalLoopStarted) {
	        return;
	    }
	    Timer.interval = setInterval(function () {
	        $.each(Timer.timers, function (i, timer) {
	            timer.updateCountdown();
	        });
	    }, 1000);
	    Timer.generalLoopStarted = true;
	};
	Timer.timerIds = 1;
	Timer.timers = {};
	Timer.interval = null;
	
	Timer.prototype.changeTimeRemaining = function (timeRemaining) {
	    this.timeRemaining = timeRemaining;
	    this.expirationTimestamp = new Date();
	    this.expirationTimestamp.setTime(this.expirationTimestamp.getTime() + timeRemaining * 1000);
	};
	Timer.endCountdown = function (element) {
	    var countdown = element.data('attachedCountdown');
	    if (countdown) {
	        element.data('attachedCountdown', null);
	        countdown.expirationTimestamp = null;
	        countdown.updateCountdown();
	    } else {}
	};
	Timer.prototype.updateCountdown = function () {
	    if (this.expirationTimestamp) {
	        var now = new Date();
	        var difference = (this.expirationTimestamp.getTime() - now.getTime()) / 1000;
	
	        if (difference > 0 && this.expirationTimestamp) //If timeout is NaN or undefined we quit
	            {
	                if (!this.shouldUpdateTextElementCallback || this.shouldUpdateTextElementCallback()) {
	                    this.element.text(Math.floor(difference));
	                }
	                return true;
	            }
	    }
	    this.element.text('0');
	    delete Timer.timers[this.id];
	    if (this.callback) {
	        this.callback();
	    }
	    this.element.data('attachedCountdown', null);
	    return false;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var ChatNotification = exports.ChatNotification = function ChatNotification(message) {
	    if (!type) {
	        this.type = ChatNotification.types[ChatNotification.TYPE_NORMAL];
	    }
	    this.html = function () {};
	};
	ChatNotification.types = {
	    TYPE_NORMAL: { class: 'chat_notification_type_normal' },
	    TYPE_ALERT: { class: 'chat_notification_type_alert' }
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var LadderHistory = exports.LadderHistory = {};
	LadderHistory.actions = {};
	if (!History.enabled) {
	    // History.js is disabled for this browser.
	    // This is because we can optionally choose to support HTML4 browsers or not.
	    LadderHistory.history = {
	        pushState: function pushState() {}
	    };
	} else {
	    LadderHistory.history = window.History;
	
	    LadderHistory.history.Adapter.bind(window, 'statechange', function () {
	        var state = LadderHistory.history.getState();
	        var path = state.data.path;
	        if (path) {} else {
	            path = LadderHistory.basePath;
	        }
	    });
	}
	LadderHistory.checkDeclickables = true;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ChatMessages = undefined;
	
	var _ChatActions = __webpack_require__(4);
	
	var _Request = __webpack_require__(7);
	
	var _Dashboard = __webpack_require__(5);
	
	var ChatMessages = exports.ChatMessages = function ChatMessages($chatMessageList) {
	    this.messages = [];
	    this.chatMessageList = $chatMessageList; //jQuery element
	    this.currentlyVisible = false;
	};
	ChatMessages.prototype.addMessage = function (message) {
	    if (!message.time) {
	        message.time = Math.round(new Date().getTime() / 1000);
	    }
	    var insertPosition = this.binaryFind(message.time);
	    if (insertPosition.found) {
	        insertPosition.index++;
	    }
	    this.messages.splice(insertPosition.index, 0, message);
	    if (this.currentlyVisible) {
	        this.chatMessageList.find('li').eq(insertPosition.index).after(message.renderChatElement());
	    }
	    return this.messages;
	};
	ChatMessages.prototype.showMessages = function () {
	    this.currentlyVisible = true;
	    for (var i in this.messages) {
	        this.chatMessageList.insert(this.messages[i].renderChatElement());
	    }
	};
	ChatMessages.prototype.binaryFind = function (searchTimestamp) {
	    var minIndex = 0;
	    var maxIndex = this.messages.length - 1;
	    var currentIndex;
	    var currentElement;
	
	    while (minIndex <= maxIndex) {
	        currentIndex = (minIndex + maxIndex) / 2 | 0;
	        currentElement = this.messages[currentIndex];
	
	        if (currentElement.time < searchTimestamp) {
	            minIndex = currentIndex + 1;
	        } else if (currentElement.time > searchTimestamp) {
	            maxIndex = currentIndex - 1;
	        } else {
	            return { // Modification
	                found: true,
	                index: currentIndex
	            };
	        }
	    }
	    return { // Modification
	        found: false,
	        index: currentElement && currentElement.time < searchTimestamp ? currentIndex + 1 : currentIndex
	    };
	};
	ChatMessages.compareMessages = function (message1, message2) {
	    //TO BE DEPRECATED
	    if (!message2.length) {
	        return 1;
	    }
	    if (message1.data('time') == message2.data('time')) {
	        if (message1.data('message_id') > message2.data('message_id')) {
	            return 1;
	        } else if (message1.data('message_id') < message2.data('message_id')) {
	            return -1;
	        } else {
	            return 0;
	        }
	    }
	    if (message1.data('time') > message2.data('time')) {
	        return 1;
	    }
	    if (message1.data('time') < message2.data('time')) {
	        return -1;
	    }
	};
	ChatMessages.assignFirstAndLast = function (chatHolder) {
	    //TODO: write this in a way that isn't halfasssed
	    return;
	
	    var currentMessages = chatHolder.data('messages').items;
	    var first = null;
	    var last = null;
	    var firstMessage = { position: null, message: null };
	    var lastMessage = { position: null, message: null };
	    $.each(currentMessages, function (i, message) {
	        var timestamp = data.time;
	        if (firstMessage.position === null) {}
	    });
	};
	ChatMessages.attachChatEvents = function (chatHolder) {
	    if (chatHolder.data('chatEventsAttached')) {
	        return;
	    } else {
	        chatHolder.data('chatEventsAttached', true);
	    }
	
	    chatHolder.on('click', '.streamlink', function (e) {
	        e.preventDefault();
	        var button = $(this);
	        _ChatActions.ChatActions.onStreamlinkClick(button, e);
	    });
	
	    chatHolder.on('mouseover', '.youtubelink:not(.coolhover)', function () {
	        _ChatActions.ChatActions.onYoutubelinkHover($(this));
	    });
	
	    chatHolder.on('click', '.time_holder', function (e) {
	        e.stopImmediatePropagation();
	        var message = $(this).closest('.chat_message');
	        chatHolder.data('messages').callbacks.timeOptionsClick(e, message);
	    });
	
	    chatHolder.on('click', '.delete_holder', function (e) {
	        e.stopImmediatePropagation();
	        var element = $(this);
	        var message = element.closest('.chat_message');
	        if (message.data('message').deleted) {
	            message.trigger('undeleteMessage');
	        } else {
	            message.trigger('deleteMessage');
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
	
	    chatHolder.on('undeleteMessage', '.chat_message.normal_message', function (e) {
	        var element = $(this);
	        var message = element.data('message');
	        var isModOfMessage = element.data('isModOfMessage');
	        if (isModOfMessage) {
	            //activeDeleteButton.add($element.find('.time'));
	            if (!element.hasClass('deleted')) {
	                return;
	            }
	            element.addClass('update_action');
	
	            _Request.Request.send({ message_id: message.id, undelete: 1 }, 'delete_message', function () {
	                element.removeClass('update_action');
	                return true;
	            });
	        }
	    });
	    chatHolder.on('deleteMessage', '.chat_message.normal_message', function (e, remove) {
	        var data;
	        var element = $(this);
	        var message = element.data('message');
	        var isModOfMessage = element.data('isModOfMessage');
	        if (message.player.id == myUser.id || isModOfMessage) {
	            if (remove) {
	                if (message.is_shadow_muted) {
	                    return;
	                }
	            } else {
	                if (message.deleted) {
	                    return;
	                }
	            }
	            element.addClass('update_action');
	            _Request.Request.send({ message_id: message.id, remove: remove ? 1 : 0 }, 'delete_message', function () {
	                element.removeClass('update_action');
	                return true;
	            });
	        }
	    });
	    chatHolder.on('unshadowMuteMessage', '.chat_message.normal_message', function (e) {
	        var message = $(this).data('message');
	        _Request.Request.send({ message_id: message.id }, 'show_shadow_message');
	        $(this).trigger('unshadowMute');
	    });
	    chatHolder.on('unshadowMute', '.chat_message.normal_message', function (e) {
	        $(this).removeClass('is_shadow_muted');
	    });
	};
	ChatMessages.findPositionForMessage = function (placedMessages, $newElement) {
	    if (ChatMessages.compareMessages($newElement, placedMessages.first()) < 0) {
	        return 0;
	    }
	    if (ChatMessages.compareMessages($newElement, placedMessages.last()) > 0) {
	        return null;
	    }
	    var positionMessage = ChatMessages.findPosition(placedMessages, $newElement);
	    if (positionMessage) {
	        return positionMessage;
	    } else {
	        return null;
	    }
	};
	ChatMessages.findPosition = function (placedMessages, message, previous) {
	    var mid = Math.floor(placedMessages.length / 2);
	
	    if (placedMessages.length === 0) {
	        return mid;
	    }
	
	    var currentComparisonMessage = $(placedMessages[mid]);
	
	    var comparisonResult = ChatMessages.compareMessages(message, currentComparisonMessage);
	
	    if (placedMessages.length === 1) {
	        if (comparisonResult > 0) {
	            return currentComparisonMessage;
	        } else {
	            return currentComparisonMessage.data('usePrevious', true);
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

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ChatRoom = exports.ChatRoom = function () {
		function ChatRoom(data) {
			_classCallCheck(this, ChatRoom);
	
			var info = this;
			$.each(data, function (key, value) {
				info[key] = value;
			});
			this.button = null;
			this.listEntry = null;
			this.isLinkOnly = null;
		}
	
		_createClass(ChatRoom, [{
			key: 'getUrl',
			value: function getUrl() {
				return siteUrl + '/netplay/' + encodeURIComponent(this.name);
			}
		}, {
			key: 'addToList',
			value: function addToList(listElement, cache) {
				var list = listElement.findCache('.chat_tab_mover');
				var button = this.makeChatButtonFromTemplate();
				list.append(button);
				cache.set(this.id, this);
				this.listEntry = cache;
				listElement.addClass('active');
				return button;
			}
		}, {
			key: 'addToActiveList',
			value: function addToActiveList() {
				this.isLinkOnly = false;
				if (ChatRoom.featuredChats.has(this.id)) {
					ChatRoom.featuredChats.get(this.id).removeFromList();
				}
				return this.addToList($('#basic_chats'), ChatRoom.activeChats);
			}
		}, {
			key: 'addToRecentList',
			value: function addToRecentList() {
				this.isLinkOnly = true;
				if (ChatRoom.recentChats.has(this.id)) {
					return;
				}
				return this.addToList($('#recent_chats'), ChatRoom.recentChats);
			}
		}, {
			key: 'addToFeaturedList',
			value: function addToFeaturedList() {
				this.isLinkOnly = true;
				if (ChatRoom.activeChats.has(this.id) || ChatRoom.featuredChats.has(this.id)) {
					return;
				}
				return this.addToList($('#featured_chats'), ChatRoom.recentChats);
			}
		}, {
			key: 'removeFromList',
			value: function removeFromList() {
				var cache = this.listEntry;
				cache.delete(this.id);
				this.button.remove();
				if (cache === ChatRoom.activeChats) {
					this.addToRecentList();
				}
			}
		}, {
			key: 'makeChatButtonFromTemplate',
			value: function makeChatButtonFromTemplate(chatList, preferredChatId) {
				var chatInfo = this;
	
				var button = null;
				if (this.button) {
					button = this.button;
				} else {
					button = ChatRoom.chatTabTemplate.clone();
				}
	
				button.addClass('public_room');
				button.data('chatInfo', this);
				button.data('order', chatInfo.order);
	
				if (chatInfo.id == preferredChatId) {
					ChatRoom.preferredChat = this;
					button.addClass('preferred_chat');
				}
	
				if (chatInfo.has_ladder) {
					button.addClass('has_ladder');
					button.data('has_ladder', true);
					button.data('ladder_id', chatInfo.ladder_id);
					if (chatInfo.ladder.small_image) {
						button.addClass('has_logo');
						button.find('.chat_logo').addClass('active').attr('src', chatInfo.ladder.small_image);
					}
				} else {
					button.removeClass('has_ladder');
					button.data('has_ladder', false);
				}
	
				button.find('.name').text(chatInfo.name);
				button.attr('title', chatInfo.name);
	
				if (chatInfo.summary_description) {
					button.find('.description').text(chatInfo.summary_description).addClass('active');
					button.attr('title', chatInfo.summary_description);
				} else {
					button.find('.description').text('').removeClass('active');
				}
	
				if (this.isLinkOnly) {
					button.addClass('chatlink');
					button.data('chatlink', chatInfo.name);
				}
				button.find('a').attr('href', chatInfo.getUrl());
	
				return this.button = button;
			}
		}]);
	
		return ChatRoom;
	}();
	
	$('#basic_chats').addClass('active');
	ChatRoom.activeChats = new Map();
	ChatRoom.featuredChats = new Map();
	ChatRoom.recentChats = new Map();
	
	ChatRoom.preferredChat = null;
	
	ChatRoom.setChatTabTemplate = function (template) {
		ChatRoom.chatTabTemplate = template;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MatchSummary = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Dashboard = __webpack_require__(5);
	
	var _LadderHistory = __webpack_require__(33);
	
	var _Request = __webpack_require__(7);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MatchSummary = function () {
		function MatchSummary() {
			_classCallCheck(this, MatchSummary);
		}
	
		_createClass(MatchSummary, null, [{
			key: 'refreshMatchDetailPage',
			value: function refreshMatchDetailPage() {
				var currentMatch = CachedDispute.getCurrentMatch();
				var matchId = currentMatch.getMatchId();
				if (MatchSummary.currentRefresh && MatchSummary.currentRefresh.matchId) {
					if (MatchSummary.currentRefresh.matchId != matchId) {
						console.error('On a different match from the "Refreshing" page');
						return; //We're on a whole new match now
					}
				}
	
				if (MatchSummary.currentRefresh.xhr) {
					console.log('Clearing last XHR');
					MatchSummary.currentRefresh.xhr.abort();
					MatchSummary.resetCurrentRefresh();
				}
	
				MatchSummary.currentRefresh.matchId = matchId;
				MatchSummary.currentRefresh.xhr = $.get(retrieveMatchUrl(matchId), { json_page: 1 }, function (response) {
					if (response.html) {
						currentMatch = CachedDispute.getCurrentMatch();
	
						var updatedPage = CachedDispute.create($(response.html));
						if (updatedPage.getMatchId() != currentMatch.getMatchId()) {
							console.error('On a different match from the "Refreshing" page');
							return; //We're on a whole new match now
						}
						updatedPage.activate();
					}
					MatchSummary.resetCurrentRefresh();
				}).error(function () {
					MatchSummary.resetCurrentRefresh();
				});
			}
		}, {
			key: 'openMatchInNewWindow',
			value: function openMatchInNewWindow(id) {
				window.open(siteUrl + '/match/view/' + id, '_blank');
			}
		}, {
			key: 'resetCurrentRefresh',
			value: function resetCurrentRefresh() {
				MatchSummary.currentRefresh = {
					xhr: null,
					matchId: null
				};
			}
		}, {
			key: 'resetCurrentCaching',
			value: function resetCurrentCaching() {
				MatchSummary.currentlyCaching = {
					xhr: null,
					matchId: null
				};
			}
		}, {
			key: 'cacheNextDispute',
			value: function cacheNextDispute(matchId) {
				if (CachedDispute.retrieve(matchId) && CachedDispute.retrieve(matchId).isReady()) {
					return;
				}
				MatchSummary.resetCurrentCaching();
				var xhr = $.get(retrieveMatchUrl(matchId), { json_page: 1 }).done(function (response) {
					if (response.html) {
						CachedDispute.create($(response.html));
					}
				}).always(function () {
					MatchSummary.resetCurrentCaching();
				});
				MatchSummary.currentlyCaching.matchId = matchId;
				MatchSummary.currentlyCaching.xhr = xhr;
			}
		}, {
			key: 'isCurrentlyCaching',
			value: function isCurrentlyCaching(matchId) {
				if (!MatchSummary.currentlyCaching) {
					return false;
				}
				return MatchSummary.currentlyCaching.matchId == matchId;
			}
		}, {
			key: 'openMatchInline',
			value: function openMatchInline(matchId, loadingContainer) {
				if (!matchId) //How the eff would we know what to open!?
					{
						console.log('wtf!');
						return;
					}
	
				var url = retrieveMatchUrl(matchId);
				if (!loadingContainer) {
					loadingContainer = $();
				}
	
				var finish = function finish() {
					loadingContainer.removeClass('loading');
					disputesContainer.removeClass('loading');
					disputesContainer.data('xhr', null);
					disputesContainer.data('loading', null);
				};
				if (disputesContainer.data('loading')) {
					if (disputesContainer.data('loading') == matchId) {
						return;
					} else {
						disputesContainer.data('xhr').abort();
						finish();
					}
				}
	
				disputesContainer.data('loading', matchId);
				disputesContainer.addClass('loading');
				loadingContainer.addClass('loading');
	
				var cached = CachedDispute.retrieve(matchId);
				if (cached && cached.isReady()) {
					cached.activate(); //parsenewmatchdata
					finish();
				} else {
					var processResponse = function processResponse(response) {
						if (response.html) {
							var _match = CachedDispute.create($(response.html));
							_match.activate();
						}
						finish();
					};
					if (MatchSummary.isCurrentlyCaching(matchId)) {
						MatchSummary.currentlyCaching.xhr.done(processResponse).error(function () {
							finish();
						});
					} else {
						var xhr = $.get(retrieveMatchUrl(matchId), { json_page: 1 }, processResponse).error(function () {
							finish();
						});
						disputesContainer.data('xhr', xhr);
					}
				}
			}
		}]);
	
		return MatchSummary;
	}();
	
	MatchSummary.currentlyCaching = null;
	
	var CachedDispute = function () {
		function CachedDispute(matchSummary, skipCache) {
			_classCallCheck(this, CachedDispute);
	
			this.matchSummary = matchSummary;
			this.matchId = matchSummary.data('match_id');
			this.readyToActivate = true;
	
			if (this.matchSummary.length) {
				var totalDisputes = this.matchSummary.find('.next-dispute').find('.badge').text();
				if (Number.isInteger(totalDisputes)) {
					if (totalDisputes != CachedDispute.totalDisputes && CachedDispute.totalDisputes !== null) {
						CachedDispute.totalDisputes = parseInt(totalDisputes);
						CachedDispute.getCurrentMatch().matchSummary.find('.next-dispute').find('.badge').text(CachedDispute.totalDisputes);
					}
				}
			}
			if (!skipCache) {
				this.updateCache();
			}
		}
	
		_createClass(CachedDispute, [{
			key: 'replaceKeepNotes',
			value: function replaceKeepNotes(newMatchSummary) {
				if (newMatchSummary.matchSummary.length) {
	
					if (this.matchSummary) {
						var oldNotes = this.matchSummary.find('#merit_form_');
						var newNotes = newMatchSummary.matchSummary.find('#merit_form_');
	
						oldNotes.off('submit');
						oldNotes.detach();
						newNotes.replaceWith(oldNotes);
					}
					if (CachedDispute.getCurrentMatch() === this) {
						CachedDispute.currentMatchSummary = newMatchSummary;
					}
					this.replaceContent(newMatchSummary);
	
					delete CachedDispute.cache[this.getMatchId()];
				}
			}
		}, {
			key: 'replaceContent',
			value: function replaceContent(newMatchSummary) {
				var oldMatchSummaryElement = null;
				if (this === newMatchSummary) {
					console.log("DEFAULT CASE");
					console.log(newMatchSummary.matchSummary.children());
					oldMatchSummaryElement = $('.match_summary');
				} else {
					oldMatchSummaryElement = this.matchSummary;
				}
				oldMatchSummaryElement.empty().append(newMatchSummary.matchSummary.children());
	
				oldMatchSummaryElement.attr('class', newMatchSummary.matchSummary.attr('class'));
				oldMatchSummaryElement.data('match_id', newMatchSummary.getMatchId());
				newMatchSummary.matchSummary.find('.next-dispute').prop('disabled', false);
				if (CachedDispute.totalDisputes !== null) {
					newMatchSummary.matchSummary.find('.next-dispute .badge').text(CachedDispute.totalDisputes);
				}
				newMatchSummary.matchSummary = oldMatchSummaryElement;
				this.readyToActivate = false;
				if (this !== newMatchSummary) {
					this.matchSummary = null; //Is now replaced
				}
	
				newMatchSummary.readyToActivate = false;
			}
		}, {
			key: 'replace',
			value: function replace(newMatchSummary) {
				if (newMatchSummary.getMatchId() == this.getMatchId()) {
					return this.replaceKeepNotes(newMatchSummary);
				}
				if (CachedDispute.getCurrentMatch() === this) {
					CachedDispute.currentMatchSummary = newMatchSummary;
				}
				this.replaceContent(newMatchSummary);
	
				delete CachedDispute.cache[this.getMatchId()];
			}
		}, {
			key: 'cacheNextDispute',
			value: function cacheNextDispute() {
				var nextDisputeButton = this.getNextDisputeButton();
				if (!nextDisputeButton) {
					return false;
				}
				MatchSummary.cacheNextDispute(nextDisputeButton.data('next_match_id'));
			}
		}, {
			key: 'getNextDisputeButton',
			value: function getNextDisputeButton() {
				if (!this.matchSummary) {
					return null;
				}
				var nextDispute = this.matchSummary.find('.next-dispute');
				if (nextDispute.length) {
					return nextDispute;
				}
				return null;
			}
		}, {
			key: 'activate',
			value: function activate() {
				var current = CachedDispute.getCurrentMatch();
				if (disputesContainer.length) {
					disputesContainer.addClass('match_detail_view');
				} else {
					_LadderHistory.LadderHistory.history.pushState({
						matchId: this.getMatchId() }, document.title, retrieveMatchUrl(this.getMatchId()));
				}
				console.log('activing ' + this.getMatchId());
				current.replace(this);
	
				this.readyToActivate = false;
				this.cacheNextDispute();
	
				delete CachedDispute.cache[this.matchId];
			}
		}, {
			key: 'isReady',
			value: function isReady() {
				return this.readyToActivate;
			}
		}, {
			key: 'updateCache',
			value: function updateCache() {
				if (this.matchId) {
					if (!CachedDispute.currentMatchSummary) {
						console.log('setting first match summary');
						var previousPageSummary = $('.match_summary');
						if (previousPageSummary.length) {
							CachedDispute.currentMatchSummary = new CachedDispute(previousPageSummary, true);
						}
						CachedDispute.cache = {};
					}
					CachedDispute.cache[this.matchId] = this;
				} else {
					console.error('No match id somehow');
				}
			}
		}, {
			key: 'getMatchId',
			value: function getMatchId() {
				return this.matchId;
			}
		}], [{
			key: 'retrieve',
			value: function retrieve(matchId) {
				return CachedDispute.cache[matchId];
			}
		}, {
			key: 'create',
			value: function create(matchSummary) {
				var summary = new CachedDispute(matchSummary);
				return summary;
			}
		}, {
			key: 'getCurrentMatch',
			value: function getCurrentMatch() {
				if (CachedDispute.currentMatchSummary) {
					return CachedDispute.currentMatchSummary;
				} else {
					var matchSummary = $('.match_summary');
					return CachedDispute.currentMatchSummary = new CachedDispute(matchSummary);
				}
			}
		}, {
			key: 'parseNewMatchData',
			value: function parseNewMatchData(response) {
	
				if (response.success) {} else {
					MatchSummary.openMatchInNewWindow(match.id);
				}
			}
		}]);
	
		return CachedDispute;
	}();
	
	CachedDispute.cache = {};
	CachedDispute.currentMatchSummary = null;
	CachedDispute.totalDisputes = null;
	
	MatchSummary.resetCurrentRefresh();
	
	var disputesContainer = _Dashboard.Dashboard.disputesContainer;
	
	var matchSummaryContainer = $('.match_summary');
	matchSummaryContainer.on('submit', 'form.http_save', function (e) {
		e.preventDefault();
		var form = $(this);
		var url = form.attr('action');
		var data;
		if (form.hasClass('button_talker')) {
			var button = $(this).find('button.clicked');
			var buttonName = button.attr('name');
			var buttonValue = button.val();
			data = {};
			data[buttonName] = buttonValue;
			var hiddenInputs = form.find('input[type=hidden]');
			hiddenInputs.each(function () {
				var input = $(this);
				data[input.attr('name')] = input.val();
			});
		} else {
			data = form.serializeJSON();
		}
		var buttons = form.find('button');
		buttons.removeClass('clicked').prop('disabled', true);
		var saveType = null;
		if ($(this).hasClass('http_save') || true) {
			saveType = _Request.Request;
		} else {
			saveType = serverConnection;
		}
		//TODO: update dispute_message to go through http
		saveType.send(data, url, function (response) {
			if (response.success) {
				if (response.message) {
					if (response.keep_open) {
						_Dashboard.Dashboard.ladderPopup(response.message, 'Match Updated');
					} else {
						_Dashboard.Dashboard.ladderPopup(response.message, 'Match Updated');
					}
				} else {
					_Dashboard.Dashboard.ladderPopup('', 'Match Updated');
				}
			} else {
				_Dashboard.Dashboard.ladderPopup(response.message, 'Error');
			}
			buttons.prop('disabled', false);
			return true;
		});
	}).on('click', '.team_characters .character', function (e) {
		var currentMatch = CachedDispute.getCurrentMatch();
		var matchId = currentMatch.getMatchId();
	
		var button = $(this).closest('.character_pick');
		var changeVictor = button.hasClass('victorious');
	
		var data = {
			game_id: button.data('game_id'),
			team_number: button.data('team_number'),
			game_intervention: 1,
			win: changeVictor ? 0 : 1,
			match_id: matchId
		};
		var game = button.closest('.game').addClass('disabled');
		$.post(siteUrl + '/matchmaking/mod_intervention', data).done(function (response) {
			if (response.success) {
				return MatchSummary.refreshMatchDetailPage(matchId);
			} else {
				game.removeClass('disabled');
				alert('Something went wrong!');
			}
		}).fail(function () {
			game.removeClass('disabled');
			alert('Something went very wrong!');
		}).always(function () {});
	}).on('click', '.mod_intervention button', function (e) {
		e.preventDefault();
		var buttons = $('.mod_intervention button');
		var button = $(this);
		var form = $(this).closest('form');
		var matchId = form.data('match_id');
		var result;
		if (button.hasClass('undo_result')) {
			result = confirm('Undo match result!?!??!');
			if (!result) {
				return false;
			}
		}
		var faultButtonsClicked = false;
		if (button.hasClass('fault_button')) {
			faultButtonsClicked = true;
			//Do not disable the
		}
		if (button.hasClass('p1win') || button.hasClass('p2win')) {}
		if (faultButtonsClicked) {
			form.find('.fault_button').prop('disabled', true);
		} else {
			form.find('button').not('.fault_button').prop('disabled', true);
		}
	
		form.addClass('submitting');
		var data = {};
		data[button.attr('name')] = button.val();
		data['match_id'] = matchId;
		data['announce_results'] = form.find('input[name=announce_results]').is(':checked') ? 1 : 0;
		$.post(form.attr('action'), data, function (response) {
			if (response.success) {
				return MatchSummary.refreshMatchDetailPage(matchId);
			}
			form.removeClass('submitting');
			form.addClass('completed');
			if (faultButtonsClicked) {
				form.removeClass('completed');
				form.find('.fault_button').prop('disabled', false);
				if (button.val() == 0) {
					button.closest('.fault_buttons').removeClass('player_at_fault').addClass('player_not_at_fault');
				} else {
					button.closest('.fault_buttons').addClass('player_at_fault').removeClass('player_not_at_fault');
				}
			}
			form.find('.fault_buttons button').prop('disabled', false);
			var submitted = form.find('.submitted');
			if (response.success) {
				submitted.text('Results Saved');
			}
			if (response.message) {
				submitted.text(response.message);
			}
		}).error(function (e) {});
	}).on('success', '#merit_form_', function () {
		MatchSummary.refreshMatchDetailPage();
	}).on('click', '.next-dispute', function (e) {
		e.preventDefault();
		var button = $(this);
		button.prop('disabled', true);
		var matchId = $(this).data('next_match_id');
		console.log('Hmm');
		MatchSummary.openMatchInline(matchId);
	}).on('change', '.display_events input', function (e) {
		var input = $(this);
		if (input.is(':checked')) {
			matchSummaryContainer.find('.chat_container').addClass(input.data('items'));
		} else {
			matchSummaryContainer.find('.chat_container').removeClass(input.data('items'));
		}
	});
	
	function retrieveMatchUrl(matchId) {
		return siteUrl + '/match/view/' + matchId;
	}
	
	var cachedDispute = {
		id: null,
		content: null
	};
	
	disputesContainer.on('click', '.match', function (e) {
		e.preventDefault();
		var match = $(this).data('match');
		if ($(e.target).hasClass('username')) {
			return;
		}
		var matchContainer = $(this);
		MatchSummary.openMatchInline(match.id, matchContainer);
		return;
	});
	
	if ($('#page_match').length) {
		var currentMatch = CachedDispute.getCurrentMatch();
		if (currentMatch) {
			currentMatch.cacheNextDispute();
		}
		window.onpopstate = function (event) {
			if (event.state) {
				alert('reloading');
				return;
				//is probably a back event
				window.location.reload();
			}
		};
	}
	
	exports.MatchSummary = MatchSummary;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ElementUpdate = undefined;
	
	var _matchmaking = __webpack_require__(10);
	
	var _Flair = __webpack_require__(21);
	
	var _League = __webpack_require__(16);
	
	var _Character = __webpack_require__(2);
	
	var _DateFormat = __webpack_require__(38);
	
	var _ChatActions = __webpack_require__(4);
	
	var _LadderInfo = __webpack_require__(30);
	
	var _Populate = __webpack_require__(40);
	
	var _Match = __webpack_require__(23);
	
	var _Dashboard = __webpack_require__(5);
	
	var _Timer = __webpack_require__(31);
	
	var _getOrdinal = __webpack_require__(20);
	
	var _MatchSounds = __webpack_require__(29);
	
	var _BrowserNotification = __webpack_require__(24);
	
	var _GameInfoHelper = __webpack_require__(41);
	
	var _Request = __webpack_require__(7);
	
	var _Settings = __webpack_require__(25);
	
	var _MatchmakingPopup = __webpack_require__(42);
	
	var ElementUpdate = exports.ElementUpdate = {
	    mains: function mains(mainsContainer, player, match) {
	        if (match.is_ranked) {
	            return ElementUpdate.rankedMains(mainsContainer, player, match);
	        } else {}
	
	        if (player.mains && player.mains[match.ladder.id]) {} else {
	            return;
	        }
	        if (mainsContainer.data('populated')) {} else {
	            mainsContainer.data('populated', true);
	            var mains = player.mains[match.ladder.id];
	            $.each(mains, function (i, main) {
	                main = new _Character.Character(main);
	                mainsContainer.append(main.generateElement());
	            });
	        }
	    },
	    rankedMains: function rankedMains(mainsContainer, player, match) {
	        if (player.ladder_information.hasCharactersForLadder(match.ladder.id)) {} else {
	            return;
	        }
	        if (mainsContainer.data('populated')) {} else {
	            mainsContainer.data('populated', true);
	            $.each(player.ladder_information.getCharactersForLadder(match.ladder.id), function (i, main) {
	                if (main.percent < 5) {
	                    return true;
	                }
	                main = new _Character.Character(main);
	                mainsContainer.append(main.generateElement());
	            });
	        }
	    },
	    locationString: function locationString(location) {
	        var user = myUser;
	        var country, state, locality;
	        var localLocation = user.location;
	        if (location.country && localLocation.country && location.country.id != localLocation.country.id) country = location.country.name;
	        if (location.state) state = location.state;
	        if (location.locality) locality = location.locality;
	        if (locality && state && country) {
	            return locality + ', ' + state + ' (' + country + ')';
	        }
	        if (locality && state) {
	            return locality + ', ' + state;
	        }
	        if (state && country) {
	            return state + ', ' + country;
	        }
	        if (state) {
	            return state;
	        }
	        if (country) {
	            return country;
	        }
	        if (location.country) {
	            return location.country.name;
	        }
	        return 'Not Set';
	    },
	    league: function league(element, _league) {
	        _league = new _League.League(_league);
	        return _league.createElement(element);
	    },
	    userTypes: function userTypes(element, player) {
	        if (player.is_ignored) element.addClass('is_ignored');
	        if (player.is_donator) element.addClass('is_donator').attr('title', 'Is a Donator to Smashladder');
	        if (player.is_subscribed) element.addClass('is_subscribed').attr('title', 'Is Subscribed to Smashladder');
	        if (player.is_mod) element.addClass('is_mod').attr('title', 'Is a Moderator');
	        if (player.is_admin) element.addClass('is_admin').attr('title', 'Is an Administrator');
	        if (player.is_top_player) {
	            element.addClass('is_top_player');
	            if (player.is_top_player.rank) {
	                var ordinal = (0, _getOrdinal.getOrdinal)(player.is_top_player.rank);
	                element.addClass('top_player_' + player.is_top_player.rank);
	            }
	            if (player.is_top_player.ladder_name) {
	                element.attr('title', 'Is ' + ordinal + ' in ' + player.is_top_player.ladder_name);
	            }
	        }
	    },
	    flair: function flair(element, player) {
	        player = _matchmaking.Users.create(player);
	        player.addFlair(element);
	    },
	    dispute: function dispute(disputeContainer, _dispute) {
	        if (_dispute.ladder && _dispute.ladder.small_image) {
	            disputeContainer.find('.game_image img').attr('src', _dispute.ladder.small_image);
	        } else {
	            disputeContainer.find('.game_image img').addClass('hidden');
	        }
	        disputeContainer.data('id', _dispute.id);
	        disputeContainer.find('.match_link').attr('href', _dispute.getUrl()).attr('title', _DateFormat.DateFormat.full(_dispute.start_time));
	        var description = disputeContainer.find('.match_description');
	        if (_dispute.is_ranked) {
	            description.addClass('match_ranked');
	            disputeContainer.find('.shortcut_ranked').text('Ranked');
	        } else {
	            description.addClass('match_unranked');
	            disputeContainer.find('.shortcut_ranked').text('Unranked');
	        }
	        if (_dispute.match_count) {
	            disputeContainer.find('.best_of_text').text('Best Of ' + _dispute.match_count);
	            disputeContainer.find('.best_of_small').text('Bo' + _dispute.match_count);
	            disputeContainer.find('.best_of_endless').hide();
	        } else {
	            disputeContainer.find('.best_of_text').hide();
	            disputeContainer.find('.best_of_small').hide();
	            disputeContainer.find('.best_of_endless').show();
	        }
	        if (_dispute.team_size == 1) {
	            disputeContainer.find('.shortcut_team_size').text('Singles');
	        } else {
	            disputeContainer.find('.shortcut_team_size').text('Doubles');
	        }
	        disputeContainer.find('.match_description_season_link').hide();
	        disputeContainer.find('.emphasized_time').text(_DateFormat.DateFormat.full(_dispute.start_time));
	
	        _dispute.setPerspectivePlayer(myUser);
	        var players = _dispute.getPlayers();
	        var playersContainer = disputeContainer.find('.players').empty();
	        $.each(players, function (i, player) {
	            player = _matchmaking.Users.update(player);
	            var div = $('<div>').addClass('player');
	            var userRankElement = player.createUsernameRankElement();
	            div.append(userRankElement.html());
	            playersContainer.append(div);
	        });
	    },
	    matchContainer: function matchContainer(_matchContainer, match, isNew) {
	        if (!(match instanceof _Match.Match)) {
	            match = new _Match.Match(match);
	        }
	        var myPlayer;
	        var currentPlayer, otherPlayer;
	        var myTeamNumber, otherTeamNumber;
	        var isMatchHost = false;
	        match.setMatchContainer(_matchContainer);
	        match.setPerspectivePlayer(myUser);
	        if (_matchContainer.data('match')) {
	            _matchContainer.data('match').updateChanges(match);
	        }
	        match.updateTeamLists();
	
	        _matchContainer.data('match', match);
	        //Determine Player
	        var otherPlayers = {};
	        $.each(match.players, function (id, player) {
	            match.players[id].player = _matchmaking.Users.update(player.player);
	            if (id == myUser.id) {
	                myPlayer = match.players[id];
	                myTeamNumber = myPlayer.match.team_number;
	                currentPlayer = myPlayer.player;
	                return;
	            }
	            otherPlayer = player.player; //Just in case there is only one...
	        });
	        _Dashboard.Dashboard.sleep(25).then(function () {
	            match.scrollToBottom();
	        });
	
	        if (match.player1.id == myUser.id) {
	            isMatchHost = true;
	            _matchContainer.addClass('match_hoster');
	        }
	        var matchChatContainer = _matchContainer.find('.chat_container');
	        var newMessagesAdded = _Populate.Populate.chat(match.chat, matchChatContainer);
	        if (!_matchContainer.hasClass('game_type_' + match.game_slug)) {
	            _matchContainer.addClass('game_type_' + match.game_slug);
	        }
	
	        var dolphinLauncherContainer = _matchContainer.findCache('.dolphin_launcher_container');
	        var hostDolphin = _matchContainer.findCache('.host_dolphin');
	        var readyToLaunch = _matchContainer.findCache('.ready_to_launch');
	        var hasDolphinHost = null;
	        var allHaveDolphinLauncher = true;
	        if (match.host_code && match.host_code.code) {
	            hasDolphinHost = match.host_code;
	        }
	        $.each(match.players, function (id, player) {
	            if (!player.match) {
	                return;
	            }
	            if (!player.match.dolphin_launcher) {
	                allHaveDolphinLauncher = false;
	            }
	        });
	
	        if (hasDolphinHost) {
	            dolphinLauncherContainer.addClass('match_is_hosted');
	            if (hasDolphinHost && hasDolphinHost.insert_player_id == myUser.id) {
	                dolphinLauncherContainer.addClass('self_hosting');
	                readyToLaunch.addClass('not_available');
	                hostDolphin.removeClass('not_available').addClass('waiting').removeClass('pending');
	            } else {
	                dolphinLauncherContainer.removeClass('self_hosting');
	                readyToLaunch.removeClass('not_available');
	                hostDolphin.addClass('not_available').removeClass('pending');
	            }
	        } else {
	            dolphinLauncherContainer.removeClass('match_is_hosted self_hosting');
	            readyToLaunch.addClass('not_available');
	            hostDolphin.removeClass('waiting being_hosted not_available');
	        }
	        if (myPlayer && myPlayer.match.ready_to_launch) {
	            readyToLaunch.addClass('waiting');
	        } else {
	            readyToLaunch.removeClass('waiting');
	        }
	
	        if (allHaveDolphinLauncher) {} else {}
	        if (myPlayer && myPlayer.match) {
	            if (myPlayer.match.is_automatic) {
	                _matchContainer.findCache('.host_code').addClass('is_smart_dolphin').removeClass('is_dumb_dolphin');
	            } else {
	                _matchContainer.findCache('.host_code').addClass('is_dumb_dolphin').removeClass('is_smart_dolphin');
	            }
	            if (myPlayer.match.dolphin_launcher) {
	                _matchContainer.findCache('.host_code').addClass('dolphin_launcher');
	                dolphinLauncherContainer.addClass('enabled');
	            } else {
	                dolphinLauncherContainer.removeClass('enabled');
	                _matchContainer.findCache('.host_code').removeClass('dolphin_launcher');
	            }
	        }
	
	        // setPreferredBuild();
	        function setPreferredBuild() {
	            if (match.preferred_build && match.preferred_build.id != _matchContainer.data('preferred_build_id')) {
	                var dolphinVersion = _matchContainer.findCache('.dolphin_version').addClass('active');
	                _matchContainer.data('preferred_build_id', match.preferred_build.id);
	
	                var preferredBuild = match.preferred_build;
	                if (preferredBuild) {
	                    dolphinVersion.findCache('.version_text').text(preferredBuild.name);
	                    dolphinVersion.addClass('special_preferred_build');
	                    if (preferredBuild.icon_directory) {
	                        dolphinVersion.findCache('.dolphin_logo').addClass('square_logo').attr('src', siteUrl + preferredBuild.icon_directory + '/96x96.png');
	                    }
	                    if (preferredBuild.download_link) {
	                        dolphinVersion.attr('href', preferredBuild.download_link);
	                    }
	                }
	            } else {
	                _matchContainer.findCache('.dolphin_version').removeClass('active');
	            }
	        }
	
	        if (match.match_muted && !_matchContainer.data('responses_populated')) {
	            _matchContainer.data('responses_populated', true);
	            var premadeResponses = _matchContainer.find('.premade_responses');
	            premadeResponses.addClass('visible');
	            _matchContainer.addClass('premade_responses_visible');
	            var premadeTemplate = premadeResponses.find('.template').remove().removeClass('template');
	            $.each(match.match_muted, function (i, response) {
	                var responseElement = premadeTemplate.clone();
	                responseElement.data('response_id', response.id);
	                responseElement.text(response.response);
	                responseElement.appendTo(premadeResponses);
	            });
	        }
	
	        if (newMessagesAdded && newMessagesAdded.player.id != myUser.id) {
	            _MatchSounds.MatchSounds.playPrivateMessageSoundEffect();
	            _BrowserNotification.BrowserNotification.titleNotification("Received a message on your match with " + newMessagesAdded.player.username + "!", 0, 2);
	
	            var icon = null;
	            if (newMessagesAdded.player.selected_flair) {
	                icon = _Flair.Flair.retrieve(newMessagesAdded.player.selected_flair).fullUrl;
	            } else if (match.ladder && match.ladder.small_image) {
	                icon = match.ladder.small_image;
	            } else {
	                icon = undefined;
	            }
	            var notification = _BrowserNotification.BrowserNotification.showNotification("Match message from " + newMessagesAdded.player.username, {
	                body: newMessagesAdded.message,
	                icon: icon,
	                onClick: function onClick() {
	                    _Dashboard.Dashboard.battleTab.trigger('activate');
	                }
	            });
	
	            if (_Dashboard.Dashboard.battlePaneShouldGetFocus()) {
	                var chatUpdateMessage = notification.showInChatAlso(true);
	                _Dashboard.Dashboard.battleTab.addClass('notification');
	                if (chatUpdateMessage) {
	                    var messagePart = chatUpdateMessage.find('.message');
	                    chatUpdateMessage.click(function (e) {
	                        e.stopImmediatePropagation();
	                        _Dashboard.Dashboard.battleTab.trigger('activate');
	                    });
	                    var username = $('<span>').addClass('username').text(newMessagesAdded.player.username).data('username', newMessagesAdded.player.username);
	                    messagePart.empty();
	                    messagePart.append($('<span>').addClass('chatlink').text('Match Message From '));
	                    messagePart.append(username);
	                    var messageText = $('<span>').addClass('chatlink');
	                    messageText.text(' ' + newMessagesAdded.message);
	                    messagePart.append(messageText).addClass('chatlink');
	
	                    if (chatUpdateMessage.data('chatConatiner') && chatUpdateMessage.data('chatConatiner').data('reScroll')) {
	                        chatUpdateMessage.data('chatConatiner').trigger('reScroll');
	                    }
	                }
	            }
	        }
	
	        if (isNew && !_Dashboard.Dashboard.firstCheck && !isMatchHost) {
	            _MatchSounds.MatchSounds.playMatchRequestNotification();
	        }
	        if (match.id) {
	            _matchContainer.find('input[name=match_id]').val(match.id);
	        }
	
	        var timeout = _matchContainer.find('.timeout');
	        var timeoutCountdown = timeout.find('.countdown');
	        var matchExpired = function matchExpired() {
	            timeout.addClass('expired');
	            timeoutCountdown.text('This match is no longer visible for searching.');
	        };
	        var startMatchExpirationTimer = function startMatchExpirationTimer() {
	            if (match.expiration && match.search_time_remaining > 0) {
	                timeout.removeClass('expired');
	                var countdown = timeoutCountdown.text('0');
	                var timer = new _Timer.Timer(countdown, match.search_time_remaining, function () {
	                    matchExpired();
	                });
	            }
	        };
	
	        if (match.search_time_remaining) {
	            if (timeout.hasClass('expired')) {
	                startMatchExpirationTimer();
	            } else {
	                if (match.search_time_remaining <= 0) {
	                    matchExpired();
	                } else {
	                    if (timeoutCountdown.data('attachedCountdown')) {
	                        timeoutCountdown.data('attachedCountdown').changeTimeRemaining(match.search_time_remaining);
	                    }
	                }
	            }
	            delete match.matchReference.search_time_remaining; //So that future updates will not update the thingy
	        }
	
	        if (!_matchContainer.data('host_code')) {
	            _matchContainer.data('host_code', _matchContainer.find('.host_code'));
	            _matchContainer.data('host_code_input', _matchContainer.data('host_code').find('input'));
	        }
	
	        applyHostCode();
	        function applyHostCode() {
	            if (match.isDoubles()) {
	                if (match.containsPlayer(myUser)) {} else {
	                    return;
	                }
	            }
	
	            if (match.host_code) {
	                var currentInput = _matchContainer.data('host_code').findCache('input');
	                currentInput.data('timestamp', match.host_code.timestamp);
	                var currentInputValue = currentInput.val();
	
	                //We can assume that this is redundant information
	                if (_matchContainer.data('host_code_player') !== match.host_code.insert_player_id && match.host_code.insert_player_id) {
	                    _matchContainer.data('host_code').removeClass('updating');
	
	                    _matchContainer.data('host_code_player', match.host_code.insert_player_id);
	                    var hostCodePlayer = _matchmaking.Users.retrieveById(match.host_code.insert_player_id);
	                    if (hostCodePlayer && match.host_code.code) {
	                        _matchContainer.data('host_code').addClass('has_code');
	                        _matchContainer.find('.host_coder_user').empty().append(hostCodePlayer.createUsernameElement());
	                    } else {
	                        _matchContainer.data('host_code').removeClass('has_code');
	                        _matchContainer.find('.host_coder_user').empty();
	                    }
	                } else if (!match.host_code.insert_player_id) {
	                    _ChatActions.ChatActions.hostCodeFollow(null);
	                    _matchContainer.data('host_code').removeClass('updating');
	                    currentInput.val('');
	                    _matchContainer.data('host_code').removeClass('has_code');
	                    _matchContainer.find('.host_coder_user').empty();
	                }
	
	                if (currentInputValue && match.host_code.insert_player_id == myUser.id && match.host_code.code == currentInput.data('timestamp')) {} else {
	                    if (!match.host_code.insert_player_id) {}
	                    if (currentInputValue != match.host_code.code && match.host_code.code) {
	                        if (match.host_code.insert_player_id != myUser.id || myPlayer.match.dolphin_launcher) {
	                            var _hostCodePlayer = _matchmaking.Users.retrieveById(match.host_code.insert_player_id);
	                            var message = $('<span>' + _hostCodePlayer.createUsernameElement().prop('outerHTML') + ' is hosting @ ' + '<span class="inline_host_code">' + match.host_code.code + '</span>' + '<span class="copied_to_clipboard">' + "Copied to Clipboard" + '</span>' + '</span>');
	                            match.postNotification(message, function (message) {
	                                _matchContainer.data('chat_container').find('.host_code_notification.following').removeClass('following');
	
	                                message.data('host_code', message.find('.inline_host_code').text());
	                                message.on('click', function (e) {
	                                    e.preventDefault();
	                                    e.stopImmediatePropagation();
	                                    if (myPlayer.match.dolphin_launcher && dolphinLauncherContainer && dolphinLauncherContainer.length) {
	                                        dolphinLauncherContainer.findCache('.ready_to_launch').trigger('click');
	                                    } else {
	                                        copyToClipboard(message.data('host_code'));
	                                        message.addClass('copied');
	                                        setTimeout(function () {
	                                            message.remove();
	                                        }, 600);
	                                    }
	
	                                    _ChatActions.ChatActions.previousHostCodeFollow = null;
	                                });
	                                setTimeout(function () {
	                                    message.remove();
	                                }, 120000); //If for some reason the message hasn't been removed after two minutes
	
	                                message.addClass('host_code_notification');
	                                if (_Dashboard.Dashboard.battlePaneIsVisible()) {
	                                    if (_Settings.Settings.isChecked('host_code_clipboard_helper') && !_matchContainer.data('host_code').hasClass('dolphin_launcher')) {
	                                        message.addClass('following');
	                                        _ChatActions.ChatActions.hostCodeFollow(message);
	                                    }
	                                }
	                            });
	                        }
	
	                        currentInputValue = currentInput.val(match.host_code.code);
	                        _matchContainer.data('host_code').removeClass('updating').data('lastValidCode', match.host_code.code);
	                    }
	                }
	                _matchContainer.data('host_code').removeClass('updating');
	            }
	        }
	
	        if (!_matchContainer.data('characters_populated') && match.characters) {
	            _matchContainer.data('characters_populated', true);
	            match.populateCharacters();
	        }
	        if (!_matchContainer.data('stages_populated') && match.stages) {
	            _matchContainer.data('stages_populated', true);
	            match.populateStages();
	        }
	
	        var buildNotification = _matchContainer.findCache('.match_build_preference');
	        if (typeof match.preferred_build != 'undefined') {
	            buildNotification.addClass('active');
	            if (match.preferred_build && _matchContainer.data('preferredBuildId') != match.preferred_build.id) {
	                if (match.preferred_build && match.preferred_build.id) {
	                    _matchContainer.data('preferredBuildId', match.preferred_build.id);
	                    buildNotification.addClass('has_build').removeClass('no_build');
	                    buildNotification.findCache('.build_name').text(match.preferred_build.name);
	                }
	            }
	            if (!match.preferred_build || !match.preferred_build.id) {
	                _matchContainer.data('preferredBuildId', null);
	                buildNotification.addClass('no_build').removeClass('has_build');
	            }
	        } else {
	            buildNotification.removeClass('active');
	        }
	
	        if (match.dolphin_status) {
	            var dolphinStatusInformation = match.dolphin_status;
	            if (dolphinStatusInformation.players) {
	                if (!_matchContainer.data('dolphinPlayers')) {
	                    _matchContainer.data('dolphinPlayers', {});
	                }
	                var cachedDolphinPlayers = _matchContainer.data('dolphinPlayers');
	
	                for (var slotNumber in cachedDolphinPlayers) {
	                    cachedDolphinPlayers[slotNumber].touched = false;
	                }
	
	                for (var _slotNumber in dolphinStatusInformation.players) {
	                    if (!dolphinStatusInformation.players.hasOwnProperty(_slotNumber)) {
	                        continue;
	                    }
	                    var player = dolphinStatusInformation.players[_slotNumber];
	                    if (!cachedDolphinPlayers[_slotNumber]) {
	                        cachedDolphinPlayers[_slotNumber] = {};
	                        cachedDolphinPlayers[_slotNumber].joined = false;
	                        cachedDolphinPlayers[_slotNumber].confirmed = false;
	                    }
	                    cachedDolphinPlayers[_slotNumber].data = player;
	                    var dolphinPlayer = cachedDolphinPlayers[_slotNumber];
	                    dolphinPlayer.touched = true;
	
	                    if (player.username) {
	                        var confirmed = null;
	                        var message = $('<span>').addClass('dolphin_update dolphin_join');
	                        var dolphinUsername = null;
	                        var requiresUpdate = false;
	                        var justJoined = false;
	                        if (!dolphinPlayer.joined) {
	                            requiresUpdate = true;
	                            dolphinPlayer.joined = true;
	                            justJoined = true;
	                        }
	                        if (player.player) {
	                            player.player = _matchmaking.Users.update(player.player);
	                            confirmed = true;
	                            if (player.player.id == myUser.id) {
	                                message.data('isMe', true);
	                            }
	                            if (player.username.toLowerCase() != player.player.username.toLowerCase()) {
	                                dolphinUsername = player.username;
	                            }
	                            if (!dolphinPlayer.confirmed) {
	                                requiresUpdate = true;
	                                dolphinPlayer.confirmed = true;
	                            }
	                        } else {
	                            if (dolphinPlayer.confirmed) {
	                                requiresUpdate = true;
	                                dolphinPlayer.confirmed = false;
	                            }
	                            confirmed = false;
	                        }
	
	                        if (requiresUpdate) {
	                            if (confirmed && !justJoined) {
	                                message.append(player.player.createUsernameElement()).append(' confirmed in slot ' + _slotNumber);
	                            } else if (confirmed) {
	                                message.append(player.username);
	                                message.append(' joined dolphin in slot ' + player.slot);
	                                message.append(' (').append(player.player.createUsernameElement()).append(') ');
	                            } else {
	                                message.append(player.username);
	                                message.append(' joined dolphin in slot ' + player.slot);
	                                message.append(' (CLICK HERE to set player for match reporting) ');
	                                message.data('confirmUsername', player.username);
	                            }
	                            message.data('slot', player.slot);
	                            match.postNotification(message);
	                        }
	                    } else {
	                        dolphinPlayer.joined = false;
	                        dolphinPlayer.confirmed = false;
	
	                        var _message = $('<span>').addClass('dolphin_update dolphin_leave');
	                        _message.append(player.previous_username + ' exited the dolphin lobby!');
	                        match.postNotification(_message);
	                    }
	
	                    // console.log(dolphinPlayer);
	                    if (dolphinPlayer.joined) {
	                        if (!dolphinPlayer.matchElement) {
	                            dolphinPlayer.matchElement = $('<li>').addClass('dolphin_user_holder');
	
	                            var _dolphinUserElement = $('<a>').addClass('dolphin_update');
	                            dolphinPlayer.matchElement.append(_dolphinUserElement);
	                            dolphinPlayer.matchElement.append($('<span>').addClass('not_confirmed').text('(CLICK HERE TO SET PLAYER)'));
	                            dolphinPlayer.matchElement.append($('<span>').addClass('alternate_username').text(''));
	                            dolphinPlayer.matchElement.appendTo(_matchContainer.findCache('.dolphin_players'));
	
	                            _dolphinUserElement.data('slot', dolphinPlayer.data.slot);
	                        }
	                        var dolphinUserElement = dolphinPlayer.matchElement.findCache('.dolphin_update');
	
	                        dolphinUserElement.data('confirmUsername', dolphinPlayer.data.username);
	                        dolphinUserElement.text(dolphinPlayer.data.username);
	                        if (dolphinPlayer.confirmed) {
	                            dolphinPlayer.matchElement.addClass('confirmed');
	                            if (dolphinPlayer.data.player && dolphinPlayer.data.username && dolphinPlayer.data.username != dolphinPlayer.data.player.username) {
	                                if (!dolphinPlayer.matchElement.hasClass('alternate_username')) {
	                                    dolphinPlayer.matchElement.addClass('alternate_username');
	                                    dolphinPlayer.matchElement.findCache('.alternate_username').html(dolphinPlayer.data.player.createUsernameElement());
	                                }
	                            } else {
	                                dolphinPlayer.matchElement.removeClass('alternate_username');
	                            }
	                        } else {
	                            dolphinPlayer.matchElement.removeClass('confirmed');
	                            dolphinPlayer.matchElement.removeClass('alternate_username');
	                        }
	                    } else {
	                        if (dolphinPlayer.matchElement) {
	                            alert('removing');
	                            dolphinPlayer.matchElement.remove();
	                            dolphinPlayer.matchElement = null;
	                        }
	                    }
	                }
	            }
	        }
	
	        if (!_matchContainer.hasClass('assets_populated')) {
	            var hostDolphinClickFunction;
	            var clipboard;
	            var hostCode;
	
	            (function () {
	                var updateDisputeReason = function updateDisputeReason(message, finishedCallback) {
	                    var data = { match_id: match.id, dispute_message: message };
	                    $.post(siteUrl + '/matchmaking/update_dispute_message', data).always(function () {
	                        if (finishedCallback) {
	                            finishedCallback();
	                        }
	                    }).fail(function () {
	                        alert('There was a server error saving the dispute message');
	                    });
	                };
	
	                _matchContainer.on('click', '.dolphin_update', function () {
	                    var button = $(this);
	                    if (button.data('isMe')) {
	                        return _Dashboard.Dashboard.ladderPopup('You are using dolphin slot ' + button.data('slot'), 'This is you!');
	                    }
	                    if (!button.data('confirmUsername')) {
	                        return;
	                    }
	                    var players = match.getPlayers();
	                    var list = $('<div>').addClass('dolphin_player_select_list');
	
	                    var dolphinPlayers = _matchContainer.data('dolphinPlayers');
	                    var dolphinPlayersWithPlayers = {};
	                    for (var slot in dolphinPlayers) {
	                        var _dolphinPlayer = dolphinPlayers[slot];
	                        if (_dolphinPlayer.data.player) {
	                            dolphinPlayersWithPlayers[_dolphinPlayer.data.player.id] = true;
	                        }
	                    }
	                    for (var i = 0; i < players.length; i++) {
	                        var _player = players[i];
	                        if (dolphinPlayersWithPlayers[_player.id]) {
	                            continue;
	                        }
	                        list.append(_player.createUsernameElement());
	                    }
	                    var popup = _Dashboard.Dashboard.ladderPopup(list, 'Who is the player in slot ' + button.data('slot'));
	                    list.on('click', '.username', function (e) {
	                        e.stopImmediatePropagation();
	                        var player = $(this);
	                        var data = {};
	                        data.player_id = player.data('id');
	                        data.slot = button.data('slot');
	                        _Request.Request.api(data, 'dolphin_slot_update', function (e) {});
	                        popup.dismiss();
	                    });
	                });
	                _matchContainer.findCache('.dolphin_launcher_container').on('click', '.ready_to_launch', function (e) {
	                    var button = $(this);
	                    button.prop('disabled', true);
	                    var finished = function finished(failed) {
	                        button.prop('disabled', false);
	                        if (failed) {
	                            button.toggleClass('waiting');
	                        }
	                    };
	                    var data = {};
	                    if (button.hasClass('waiting')) {
	                        data.ready = 0;
	                    } else {
	                        alert('Launching...');
	                        data.ready = 1;
	                    }
	                    button.toggleClass('waiting');
	                    $.post(siteUrl + '/matchmaking/ready_to_launch', data, function (response) {
	                        finished(!response.success);
	                    }).error(function () {
	                        finished(true);
	                    });
	                }).on('click', '.close_host', function (e) {
	                    hostDolphinClickFunction($(this), false);
	                }).on('click', '.host_dolphin', function (e) {
	                    hostDolphinClickFunction($(this), true);
	                }).on('click', '.do_not_have_launcher', function (e) {
	                    var button = $(this);
	                    button.prop('disabled', true);
	                    var finished = function finished() {
	                        button.prop('disabled', false);
	                    };
	                    _Request.Request.api(null, 'disable_launchers', finished, finished);
	                }).on('click', '.start_game', function (e) {
	                    var button = $(this);
	                    button.prop('disabled', true);
	                    var finished = function finished() {
	                        button.prop('disabled', false);
	                    };
	                    _Request.Request.api(null, 'start_game', finished, finished);
	                });
	
	                hostDolphinClickFunction = function hostDolphinClickFunction(button, openDolphin) {
	                    button.prop('disabled', true);
	                    var finished = function finished(failed) {
	                        button.prop('disabled', false);
	                        if (failed) {
	                            button.toggleClass('waiting');
	                        }
	                    };
	                    var data = {};
	                    if (!openDolphin) {
	                        data.ready = 0;
	                    } else {
	                        button.addClass('pending');
	                        data.ready = 1;
	                    }
	                    button.toggleClass('waiting');
	                    $.post(siteUrl + '/matchmaking/host_dolphin', data, function (response) {
	                        finished(!response.success);
	                    }).error(function () {
	                        finished(true);
	                    });
	                };
	
	                _matchContainer.findCache('.dispute_update').on('click', '.result_change', function (e) {
	                    var button = $(this);
	                    var submitValue = button.val();
	                    var form = button.closest('.dispute_update');
	                    var message = button.closest('.dispute_update').find('.cancel_reason').val();
	
	                    var buttons = form.find(':input').prop('disabled', true);
	                    var enable = function enable() {
	                        buttons.prop('disabled', false);
	                    };
	                    var data = { match_id: match.id, result_change: submitValue, dispute_message: message };
	                    $.post(siteUrl + '/matchmaking/user_intervention', data).always(function () {
	                        enable();
	                    }).fail(function () {
	                        alert('There was a server error submitting your result');
	                    });
	                }).on('click', '.update_dispute_reason', function (e) {
	                    var button = $(this);
	                    var form = button.closest('.dispute_update');
	                    var message = button.closest('.dispute_update').find('.cancel_reason').val();
	                    var buttons = form.find(':input').prop('disabled', true);
	                    var enable = function enable() {
	                        buttons.prop('disabled', false);
	                    };
	                    updateDisputeReason(message, enable);
	                });
	                ;
	
	                _matchContainer.on('click', '.build_notification', function () {
	                    _MatchmakingPopup.MatchmakingPopup.showMatchSelectDialog(match.ladder_id, false).then(function () {
	                        var preference = $('#build_preference_' + match.ladder_id).clone().attr('id', '');
	                        if (!preference.length) {
	                            console.error('Could not load preference for this ladder');
	                            return;
	                        }
	                        preference.addClass('build_changer build_preferences');
	
	                        var popup = _Dashboard.Dashboard.ladderPopup(preference, 'Change Preferred Build? (For Dolphin Launcher)');
	
	                        preference.on('click', '.build', function () {
	
	                            var build = $(this);
	                            if (build.hasClass('disabled')) {
	                                return;
	                            }
	
	                            var buildPreferenceId = build.data('build_preference_id');
	
	                            build.addClass('loading');
	                            preference.find('.build').addClass('disabled');
	
	                            $.post(siteUrl + '/matchmaking/change_match_build_preference', { match_id: match.id, build_preference_id: buildPreferenceId }, function (response) {
	
	                                popup.dismiss();
	                            }).error(function () {
	                                alert('There was an error updating the build preference');
	                            });
	                        });
	                    });
	                });
	
	                _matchContainer.on('change', '.host_code_popup input[name="host_code_clipboard_helper"]', function (e) {
	                    _Settings.Settings.getSetting('host_code_clipboard_helper').prop('checked', $(this).is(':checked') ? 1 : 0).trigger('change');
	                });
	
	                clipboard = new Clipboard(_matchContainer.findCache('.copy_to_clipboard')[0], {
	                    text: function text(trigger) {
	                        if (_matchContainer.data('host_code_input').data('tempHostCode')) {
	                            var value = _matchContainer.data('host_code_input').data('tempHostCode');
	                            _matchContainer.data('host_code_input').data('tempHostCode', null);
	                            return value;
	                        } else {
	                            return _matchContainer.data('host_code_input').val().trim();
	                        }
	                    }
	                }).on('success', function (e) {
	                    // alert('"'+ e.text+'" Has been copied to your clipboard!');
	                    _matchContainer.findCache('.chat_input').focus().trigger('focus');
	                }).on('error', function (e) {
	                    alert('There was an error copying to your clipboard!');
	                });
	
	
	                _matchContainer.findCache('.chat_input').on('keydown', function (e) {
	                    if (e.which == _Dashboard.Dashboard.keyCodes.UP && !e.shiftKey) {
	                        e.preventDefault();
	                        _matchContainer.findCache('.copy_to_clipboard').trigger('click');
	                    }
	                });
	
	                hostCode = _matchContainer.data('host_code');
	
	                if (match.host_code) {
	
	                    _matchContainer.data('host_code_input').bindWithDelay('keyup', function () {
	                        hostCode.addClass('updating');
	                        var input = _matchContainer.data('host_code_input').val();
	                        if (match.host_code.code == input) {
	                            return; //No change
	                        }
	                        _Request.Request.api({ host_code: input }, 'set_host_code', function (response) {
	                            if (response.success) {
	                                match.host_code = response.host_code;
	                            } else {
	                                _matchContainer.data('host_code_input').val(_matchContainer.data('host_code').data('lastValidCode'));
	                            }
	                            hostCode.removeClass('updating');
	                        });
	                    }, 1000).on('keyup', function () {
	                        hostCode.addClass('updating');
	                    });
	                } else {
	                    hostCode.remove();
	                }
	
	                _matchContainer.addClass('assets_populated');
	
	                startMatchExpirationTimer();
	
	                _matchContainer.find('.start_team_match').on('click', function () {
	                    var button = $(this);
	                    var disableButton = function disableButton() {
	                        button.prop('disabled', true);
	                    };
	                    var enableButton = function enableButton() {
	                        button.prop('disabled', false);
	                    };
	                    disableButton();
	                    $.post(siteUrl + '/matchmaking/start_match', { match_id: match.id }, function (response) {
	                        enableButton();
	                        if (response.error) {
	                            match.postNotification(response.error);
	                        }
	                    }).error(function () {
	                        enableButton();
	                    });
	                });
	
	                _matchContainer.on('click', '.match_void', function (e) {
	                    var button = $(this);
	                    button.prop('disabled', true);
	                    var enableButton = function enableButton() {
	                        button.prop('disabled', false);
	                    };
	                    $.post(siteUrl + '/matchmaking/match_void', { match_id: match.id }, function (response) {
	                        if (response.success) {
	                            match.postNotification('Match Removed from your History');
	                        } else {
	                            match.postNotification('There was an error removing the match from your history!');
	                            enableButton();
	                        }
	                    }).error(function () {
	                        alert('There was an error!');
	                        enableButton();
	                    });
	                });
	
	                _matchContainer.on('click', '.rematch', function (e) {
	                    var button = $(this);
	                    button.prop('disabled', true);
	                    var enableButton = function enableButton() {
	                        button.prop('disabled', false);
	                    };
	                    $.post(siteUrl + '/matchmaking/rematch', { match_id: match.id }, function (response) {
	                        var data;
	                        if (response.success) {
	                            match.closeMatch(); //Close match so that new one can take over
	                        } else {
	                                match.postNotification(response.error);
	                                enableButton();
	                            }
	                    }).error(function () {
	                        alert('There was an error!');
	                        enableButton();
	                    });
	                });
	                _matchContainer.on('click', '.rehost_reinvite', function (e) {
	                    var button = $(this);
	                    button.prop('disabled', true);
	                    var enableButton = function enableButton() {
	                        button.prop('disabled', false);
	                    };
	                    $.post(siteUrl + '/matchmaking/rehost_reinvite', { match_id: match.id }, function (response) {
	                        var data;
	                        if (response.success) {
	                            if (response.player_ids && response.match_id) {
	                                data = {};
	                                data.match_id = response.match_id;
	                                data.player_ids = response.player_ids;
	                                //TODO this is a mistake, server should take care of this ;)
	                                $.post(siteUrl + '/chats/invite_players', data, function (response) {});
	                            }
	                            match.closeMatch(); //Close match so that new one can take over
	
	                            if (response.searches) {
	                                data = { searches: response.searches };
	                                _Dashboard.Dashboard.performOpenSearchUpdate(data);
	                            }
	                        } else {
	                            match.postNotification(response.error);
	                            enableButton();
	                        }
	                    }).error(function () {
	                        alert('There was an error!');
	                        enableButton();
	                    });
	                });
	
	                if (match.isDoubles()) {
	                    _matchContainer.find('.main_opponent_username').remove();
	                    _matchContainer.find('.main_match_title').text(match.ladder_name + ' Doubles').off('click').on('click', function () {
	                        window.open(siteUrl + '/match/view/' + match.id);
	                    });
	                    _matchContainer.find('.restart_search_timer').on('click', function (e) {
	                        var button = $(this);
	                        button.prop('disabled', true);
	                        $.post(siteUrl + '/matchmaking/restart_search_timer', { match_id: match.id }, function (response) {
	                            button.prop('disabled', false);
	                        }).error(function () {
	                            button.prop('disabled', false);
	                        });
	                    });
	                } else {
	                    _matchContainer.find('.main_opponent_username').html(match.getOtherPlayerElements()[0]);
	                }
	            })();
	        }
	
	        var matchIsActive = true;
	        if (match.end_phase || match.is_disputed || match.game && match.game.current_action === null) {
	            if (match.is_disputed && !match.is_completed) {
	                _matchContainer.addClass('is_disputed');
	                //var popup = $('.match_disputed.template').clone().removeClass('template');
	            } else if (match.is_completed && !match.is_disputed) {
	                    _matchContainer.removeClass('is_disputed');
	                    //Popups.matchFeedback(match.id,matchContainer.find('.username').first().text());
	                }
	            _matchContainer.addClass('ended');
	            if (match.short_match) {
	                _matchContainer.addClass('short_match');
	            } else {
	                _matchContainer.removeClass('short_match');
	            }
	            if (match.is_cancelled) {
	                _matchContainer.addClass('match_cancelled');
	                _matchContainer.removeClass('is_disputed');
	            }
	
	            _matchContainer.find('.picks_container, .controls, .code, .netplay_code_container').css('display', '');
	            if (match.player_report && match.player_report[match.getMyTeamNumber()]) {
	                var myReport = match.player_report[match.getMyTeamNumber()];
	                var disputeContainer = _matchContainer.find('.match_disputed');
	                var cancel = disputeContainer.find('.cancel');
	                var win = disputeContainer.find('.win');
	                var loss = disputeContainer.find('.loss');
	                var dispute = disputeContainer.find('.dispute_match');
	                var undispute = disputeContainer.find('.undispute_match');
	                var reportedSomething = false;
	                if (myReport.reported_cancel) {
	                    cancel.hide();
	                    reportedSomething = true;
	                } else {
	                    cancel.show();
	                }
	                if (myReport.reported_dispute) {
	                    dispute.hide();
	                    reportedSomething = true;
	                } else {
	                    dispute.show();
	                }
	                if (myReport.reported_loss) {
	                    loss.hide();
	                    reportedSomething = true;
	                } else {
	                    loss.show();
	                }
	                if (myReport.reported_win) {
	                    win.hide();
	                    reportedSomething = true;
	                } else {
	                    win.show();
	                }
	                if (reportedSomething) {
	                    undispute.show();
	                } else {
	                    undispute.hide();
	                }
	                var reportReasons = function reportReasons() {
	                    var disputeReasons = [];
	                    if (!match.player_report) {
	                        disputeReasons.push('No results reported...?');
	                        return disputeReasons;
	                    }
	                    if (!match.player_report[1] || !match.player_report[2]) {
	                        return disputeReasons;
	                    }
	                    var reason1 = match.player_report[match.getMyTeamNumber()];
	                    var reason2 = match.player_report[match.getOtherTeamNumber()];
	                    if (!reason1 || !reason2) {
	                        return disputeReasons;
	                    }
	
	                    reason1.player = match.getMyTeamNameElement();
	                    reason2.player = match.getOtherTeamNameElement();
	
	                    var independentReasons = function independentReasons(reason) {
	                        if (reason.reported_cancel) {
	                            disputeReasons.push(reason.player + ' wants to cancel the match.');
	                        }
	                        if (reason.reported_dispute) {
	                            disputeReasons.push(reason.player + ' is disputing the match.');
	                        }
	                    };
	                    $.each(match.player_report, function (i, reason) {
	                        independentReasons(reason);
	                    });
	                    if (reason1.reported_win && reason2.reported_win) {
	                        disputeReasons.push('Both reported the match as a win, you can clear your result to continue the match');
	                    } else if (reason1.reported_loss && reason2.reported_loss) {
	                        disputeReasons.push('Both reported the match as a loss, you can clear your result to continue the match');
	                    } else if (reason1.reported_cancel && reason2.reported_cancel) {
	                        _matchContainer.findCache('.dispute_reasons').addClass('success');
	                        disputeReasons.push('Match Successfully Cancelled');
	                    } else {
	                        var independentWinReasons = function independentWinReasons(reason) {
	                            if (reason.reported_win) disputeReasons.push(reason.player + ' reported a win.');
	                            if (reason.reported_loss) disputeReasons.push(reason.player + ' reported a loss.');
	                        };
	                        $.each(match.player_report, function (i, reason) {
	                            independentWinReasons(reason);
	                        });
	                    }
	                    return disputeReasons;
	                };
	                var disputeReasons = reportReasons(disputeReasons);
	                _matchContainer.findCache('.dispute_reasons').empty();
	                if (disputeReasons.length) {
	                    $.each(disputeReasons, function (i, reason) {
	                        _matchContainer.findCache('.dispute_reasons').append($('<li>' + reason + '</li>'));
	                    });
	                } else {
	                    _matchContainer.findCache('.dispute_reasons').text('Unknown Dispute Reason');
	                }
	
	                if (myReport.dispute_message && myReport.dispute_message != _matchContainer.findCache('.cancel_reason').val() && !_matchContainer.findCache('.cancel_reason').data('set')) {
	                    _matchContainer.findCache('.cancel_reason').val(myReport.dispute_message).data('set', true);
	                }
	            }
	            if (match.atLeastOneOtherPlayerIsChatting()) {} else {
	                if (!_matchContainer.data('chat_disabled')) {
	                    if (!match.game || !match.rps_game) {
	                        _ChatActions.ChatActions.addNotificationToChat(_matchContainer.find('.chat_container'), 'This chat has been closed.');
	                    }
	                }
	                _matchContainer.data('chat_disabled', true);
	                _matchContainer.find('.chat_input').addClass('disabled');
	                _matchContainer.find('.send_chat_button').prop('disabled', true);
	            }
	            _matchContainer.find('.rock_paper_scissors').hide();
	            matchIsActive = false;
	        } else {
	            if (_matchContainer.hasClass('ended')) {
	                _matchContainer.removeClass('ended');
	                _matchContainer.removeClass('is_disputed');
	                _matchContainer.find('.controls').show(); //Could be a hack
	                _matchContainer.data('chat_disabled', false);
	                _matchContainer.findCache('.chat_input').removeClass('disabled');
	                _matchContainer.find('.send_chat_button').prop('disabled', false);
	                _ChatActions.ChatActions.addNotificationToChat(_matchContainer.find('.chat_container'), 'Match has been reopened.');
	            }
	        }
	
	        if (match.is_ranked) {
	            _matchContainer.addClass('is_ranked_match');
	        } else {
	            _matchContainer.addClass('is_unranked_match');
	        }
	        if (match.expiration) {
	            _matchContainer.addClass('search_is_active');
	            _matchContainer.removeClass('match_active');
	        } else {
	            _matchContainer.addClass('match_active');
	            _matchContainer.removeClass('search_is_active');
	        }
	        if (!match.containsMeAsPlayer()) {
	            _matchContainer.addClass('spectating_match');
	        }
	        if (match.usesTeamList()) {
	            _matchContainer.addClass('is_teams_match');
	            if (match.match_count > 0) {
	                _matchContainer.addClass('assigned_teams');
	            }
	        } else {
	            _matchContainer.addClass('is_singles_match');
	            if (otherPlayer.specific_code_1) {
	                var codes = _matchContainer.find('.opponent_codes');
	                if (!codes.data('set')) {
	                    codes.addClass('active');
	                    codes.find('.user').html(otherPlayer.createUsernameElement());
	                    codes.find('.field_name').text(otherPlayer.specific_code_1.name);
	                    if (otherPlayer.specific_code_1.value) {
	                        codes.find('.field_value').removeClass('unknown').text(otherPlayer.specific_code_1.value);
	                    } else {
	                        codes.find('.field_value').addClass('unknown').text('Unknown');
	                    }
	                    codes.data('set', true);
	                }
	            } else {
	                _matchContainer.find('.opponent_codes').hide();
	            }
	        }
	
	        ElementUpdate.updateMatchCount(match, _matchContainer.find('.opponent .match_count'));
	
	        if (match.rps_game && matchIsActive && false) {
	            alert('no');
	            if (match.is_ranked) {
	                _matchContainer.find('.ranked_controls .cancel, .ranked_controls_only').show();
	                _matchContainer.find('.friendlies_controls').hide();
	            } else {
	                _matchContainer.find('.ranked_controls .cancel, .ranked_controls_only').hide();
	                _matchContainer.find('.friendlies_controls').show();
	            }
	        }
	
	        if (match.set_score) {
	            var setScoreContainer = _matchContainer.find('.set_score');
	            if (match.getMyTeamNumber() == 1) {
	                setScoreContainer.find('.wins').text(match.set_score.p1wins);
	                setScoreContainer.find('.losses').text(match.set_score.p2wins);
	                setScoreContainer.find('.draws').text(match.set_score.draws);
	            } else {
	                setScoreContainer.find('.wins').text(match.set_score.p2wins);
	                setScoreContainer.find('.losses').text(match.set_score.p1wins);
	                setScoreContainer.find('.draws').text(match.set_score.draws);
	            }
	        }
	
	        if (match.rps_game) {
	            _matchContainer.addClass('rock_paper_scissors_mode');
	            var rpsContainer = _matchContainer.find('.rock_paper_scissors');
	            var rpsConstants = {
	                1: { name: 'Rock', beats: 3, loses: 2, winTerm: 'smashes', loseTerm: 'is obliterated by' },
	                2: { name: 'Paper', beats: 1, loses: 3, winTerm: 'obliterates', loseTerm: 'is sliced by' },
	                3: { name: 'Scissors', beats: 2, loses: 1, winTerm: 'slices through', loseTerm: 'is smashed by' }
	            };
	
	            var getRpsSelection = function getRpsSelection(rpsMatch) {
	                if (rpsMatch.players && rpsMatch.players[myUserId] && rpsMatch.players[myUserId].selection) {
	                    return rpsMatch.players[myUserId].selection;
	                }
	                return null;
	            };
	            var myRpsSelection = getRpsSelection(match.rps_game);
	
	            var isLastMatch;
	            var lastGame = rpsContainer.data('lastGame');
	            if (match.rps_game.winner && rpsContainer.data('lastGame') == match.rps_game.game_number) isLastMatch = true;else isLastMatch = false;
	            if (match.rps_game.game_number > 1 && match.rps_game.game_number > rpsContainer.data('lastGame') || isLastMatch) {
	                var previousRpsGame;
	                if (isLastMatch) {
	                    previousRpsGame = match.rps_game;
	                    rpsContainer.data('lastGame', match.rps_game.game_number + 1);
	                } else {
	                    previousRpsGame = match.rps_game.rps_previous_game;
	                }
	                if (previousRpsGame) {
	                    var previousSelection = getRpsSelection(previousRpsGame);
	                    if (previousSelection && previousRpsGame.winner == 'draw') {
	                        match.postNotification('Draw! You both picked ' + rpsConstants[previousSelection].name + '!');
	                    } else if (previousSelection && previousRpsGame.winner) {
	                        if (previousRpsGame.winner == myUserId) {
	                            match.postNotification('You Won! ' + rpsConstants[previousSelection].name + ' ' + rpsConstants[previousSelection].winTerm + ' ' + rpsConstants[rpsConstants[previousSelection].beats].name + '!');
	                        } else {
	                            match.postNotification('You Lost! ' + rpsConstants[previousSelection].name + ' ' + rpsConstants[previousSelection].loseTerm + ' ' + rpsConstants[rpsConstants[previousSelection].loses].name + '!');
	                        }
	                    }
	                }
	                //Announce last result
	            }
	            if (!rpsContainer.data('lastGame') || rpsContainer.data('lastGame') < match.rps_game.game_number) {
	                rpsContainer.data('lastGame', match.rps_game.game_number);
	            }
	
	            if (myRpsSelection) {
	                rpsContainer.find('.selection').prop('disabled', true).removeClass('player_selected');
	                rpsContainer.find('.selection[value=' + myRpsSelection + ']').addClass('player_selected');
	            } else {
	                rpsContainer.find('.selection').prop('disabled', false).removeClass('player_selected');
	            }
	        }
	
	        var matchContainerViewModes = ['character_pick_main', 'blind_wait', 'blind_choose', 'choose_character', 'wait_for_choose_character', 'choose_stage', 'wait_for_choose_stage', 'stage_pick_main', 'strike_stage', 'wait_for_strike', 'play_match'];
	
	        // if(match.game.current_action == ACTION_FRIENDLY_PLAY_GAME && match.previous_game)
	        // {
	        //     // match.game = match.previous_game;
	        // }
	        if (match.game && !(match.game.current_action == ACTION_FRIENDLY_REPORT && match.game.current_action == ACTION_FRIENDLY_PLAY_GAME)) {
	            var changeMatchView = function changeMatchView(mode) {
	                _matchContainer.removeClass(matchContainerViewModes.join(' ')).addClass(mode);
	            };
	
	            var selectedCharactersContainer = _matchContainer.findCache('.selected_characters');
	            var game = match.game;
	            var picksContainer = _matchContainer.findCache('.picks_container');
	
	            picksContainer.data('currentAction', game.current_action);
	            picksContainer.data('myPlayerNumber', myTeamNumber);
	
	            otherPlayer = _matchmaking.Users.update(otherPlayer);
	
	            var currentInstructions = _matchContainer.findCache('.current_instructions');
	
	            picksContainer.findCache('.other_username').html(match.getOtherTeamNameElement());
	            picksContainer.findCache('.my_username').html(match.getMyTeamNameElement());
	            picksContainer.findCache('.game_number').text(game.game_number);
	            _matchContainer.findCache('.character.opponent_selected').removeClass('opponent_selected');
	            _matchContainer.findCache('.character.player_selected').removeClass('player_selected');
	
	            if (game.current_action == ACTION_PLAYERS_BLIND_PICK_CHARACTERS || game.current_action == ACTION_PLAYER_1_PICK_CHARACTER || game.current_action == ACTION_PLAYER_2_PICK_CHARACTER) {
	                changeMatchView('character_pick_main');
	
	                _matchContainer.find('.character').removeClass('waiting_active');
	                _matchContainer.find('.character_for_game_' + match.game_slug).addClass('waiting_active');
	                _GameInfoHelper.GameInfoHelper.setContainerToStage(_matchContainer.find('.stage_selected'), game.stage);
	
	                //Populate waiting on display
	                var waitingOn = _matchContainer.findCache('.waiting_on');
	                $.each(game.players, function (id, player) {
	                    var user = _matchmaking.Users.retrieveById(id);
	                    var waitingOnElement = user.createUsernameElement();
	                    var idClass = 'waiting_user_' + user.id;
	                    if (player.character === null && game.current_action == ACTION_PLAYERS_BLIND_PICK_CHARACTERS) {
	                        if (!waitingOn.find('.' + idClass).length) {
	                            waitingOnElement.addClass(idClass);
	                            waitingOnElement.appendTo(waitingOn);
	                        }
	                    } else {
	                        waitingOn.find('.' + idClass).remove();
	                    }
	                });
	
	                _GameInfoHelper.GameInfoHelper.updateCharacters(_matchContainer, match);
	                if (game.current_action == ACTION_PLAYER_1_PICK_CHARACTER && myTeamNumber == 1 || game.current_action == ACTION_PLAYER_2_PICK_CHARACTER && myTeamNumber == 2) {
	                    currentInstructions.addClass('active');
	
	                    changeMatchView('character_pick_main choose_character');
	
	                    if (otherPlayer.character) {
	                        var characterSelection = _GameInfoHelper.GameInfoHelper.characterElement(_matchContainer, otherPlayer.character);
	
	                        characterSelection.addClass('opponent_selected');
	                    }
	                } else if (game.current_action == ACTION_PLAYER_1_PICK_CHARACTER && myTeamNumber == 2 || game.current_action == ACTION_PLAYER_2_PICK_CHARACTER && myTeamNumber == 1) {
	                    currentInstructions.removeClass('active');
	
	                    changeMatchView('character_pick_main wait_for_choose_character');
	                } else {
	                    _matchContainer.find('.character').removeClass('player_selected opponent_selected');
	                }
	
	                if (match.getMyCurrentCharacterId()) {
	                    var _characterSelection = _GameInfoHelper.GameInfoHelper.characterElement(_matchContainer, match.getMyCurrentCharacterId());
	                    currentInstructions.removeClass('active');
	                    _characterSelection.addClass('player_selected');
	                }
	
	                if (game.current_action == ACTION_PLAYERS_BLIND_PICK_CHARACTERS) {
	                    if (match.game.players[myUser.id] && match.game.players[myUser.id].character != null) {
	                        changeMatchView('character_pick_main blind_wait');
	                        currentInstructions.removeClass('active');
	                    } else {
	                        changeMatchView('character_pick_main blind_choose');
	                        currentInstructions.addClass('active');
	                    }
	                }
	            }
	
	            if (game.current_action == ACTION_PLAYER_1_STRIKE_STAGE || game.current_action == ACTION_PLAYER_2_STRIKE_STAGE || game.current_action == ACTION_PLAYER_1_PICK_STAGE || game.current_action == ACTION_PLAYER_2_PICK_STAGE || game.current_action == ACTION_PLAYER_1_BAN_STAGE || game.current_action == ACTION_PLAYER_2_BAN_STAGE) {
	                changeMatchView('stage_pick_main');
	
	                _GameInfoHelper.GameInfoHelper.updateCharacters(_matchContainer, match);
	
	                if (myTeamNumber == 1 && game.current_action == ACTION_PLAYER_1_STRIKE_STAGE || myTeamNumber == 2 && game.current_action == ACTION_PLAYER_2_STRIKE_STAGE) {
	                    currentInstructions.addClass('active');
	                    changeMatchView('stage_pick_main strike_stage');
	                }
	                if (myTeamNumber == 2 && game.current_action == ACTION_PLAYER_1_STRIKE_STAGE || myTeamNumber == 1 && game.current_action == ACTION_PLAYER_2_STRIKE_STAGE) {
	                    currentInstructions.removeClass('active');
	                    changeMatchView('stage_pick_main wait_for_strike');
	                }
	                if (myTeamNumber == 1 && game.current_action == ACTION_PLAYER_1_BAN_STAGE || myTeamNumber == 2 && game.current_action == ACTION_PLAYER_2_BAN_STAGE) {
	                    currentInstructions.addClass('active');
	                    changeMatchView('stage_pick_main strike_stage');
	                }
	                if (myTeamNumber == 2 && game.current_action == ACTION_PLAYER_1_BAN_STAGE || myTeamNumber == 1 && game.current_action == ACTION_PLAYER_2_BAN_STAGE) {
	                    currentInstructions.removeClass('active');
	                    changeMatchView('stage_pick_main wait_for_strike');
	                }
	
	                if (game.current_action == ACTION_PLAYER_1_PICK_STAGE && myTeamNumber == 1 || game.current_action == ACTION_PLAYER_2_PICK_STAGE && myTeamNumber == 2) {
	                    currentInstructions.addClass('active');
	                    changeMatchView('stage_pick_main choose_stage');
	                }
	                if (game.current_action == ACTION_PLAYER_1_PICK_STAGE && myTeamNumber == 2 || game.current_action == ACTION_PLAYER_2_PICK_STAGE && myTeamNumber == 1) {
	                    currentInstructions.removeClass('active');
	                    changeMatchView('stage_pick_main wait_for_choose_stage');
	                }
	
	                var $stages = _matchContainer.find('.stage_picks .stage');
	                var visibleStages = 0;
	                $stages.each(function () {
	                    var stage = $(this);
	                    var stageId = $(this).find('input[name=stage_id]').val();
	                    if (game.visible_stages[stageId]) {
	                        visibleStages++;
	                        stage.removeClass('player_selected opponent_selected pending_selection');
	                    } else {
	                        if (game.all_stages[stageId] == myUser.id) {
	                            stage.addClass('player_selected');
	                        } else if (game.all_stages[stageId] !== true) {
	                            stage.addClass('opponent_selected');
	                        }
	                    }
	                    if (game.all_stages[stageId]) {
	                        stage.addClass('active');
	                    } else {
	                        stage.removeClass('active');
	                    }
	                });
	                if (game.strikes_remaining >= visibleStages) _matchContainer.find('.strikes_remaining').text(visibleStages - 1);else _matchContainer.find('.strikes_remaining').text(game.strikes_remaining);
	            }
	            if (game.current_action == ACTION_PLAYERS_PLAY_GAME || game.current_action == ACTION_FRIENDLY_REPORT || game.current_action == ACTION_FRIENDLY_PLAY_GAME) {
	                currentInstructions.addClass('active');
	
	                changeMatchView('play_match');
	                if (game.stage_data) {
	                    _matchContainer.addClass('stage_selected');
	                } else {
	                    _matchContainer.removeClass('stage_selected');
	                }
	
	                _GameInfoHelper.GameInfoHelper.setContainerToStage(_matchContainer.findCache('.stage_selected'), game.stage_data ? game.stage_data : game.stage);
	
	                var myCharacter = selectedCharactersContainer.find('.my_character');
	                var otherCharacter = selectedCharactersContainer.find('.other_character');
	
	                _GameInfoHelper.GameInfoHelper.updateCharacters(_matchContainer, match);
	            }
	
	            if (game.current_action == ACTION_FRIENDLY_REPORT || game.current_action == ACTION_FRIENDLY_PLAY_GAME) {
	                _matchContainer.addClass('auto_reported');
	            }
	
	            _matchContainer.removeClass('no_game_picks').addClass('has_game_picks');
	        } else {
	            _matchContainer.addClass('no_game_picks').removeClass('has_game_picks');
	        }
	
	        _matchContainer.find('.result_display_sentence').hide();
	
	        if (match.game && match.game.teams[1] && match.game.teams[2]) {
	            var myTeam = match.game.teams[match.getMyTeamNumber()];
	            var otherTeam = match.game.teams[match.getOtherTeamNumber()];
	
	            _matchContainer.find('.opponent .username, .opponent.username').text(otherPlayer.username);
	            _matchContainer.find('.results_display .username').text(otherPlayer.username);
	            _matchContainer.find('.opponent .netplay_code').text(otherPlayer.netplay_code ? otherPlayer.netplay_code : '');
	            _matchContainer.find('.opponent .match_start_time .time').text(_DateFormat.DateFormat.hourMinutes(match.start_time));
	
	            if (myTeam.match_report == LOSE_MATCH) {
	                _matchContainer.addClass('self_reported_loss');
	            } else {
	                _matchContainer.removeClass('self_reported_loss');
	            }
	            if (myTeam.match_report == WIN_MATCH) {
	                _matchContainer.addClass('self_reported_win');
	            } else {
	                _matchContainer.removeClass('self_reported_win');
	            }
	
	            if (otherTeam.match_report == LOSE_MATCH) {
	                _matchContainer.addClass('other_reported_loss');
	            } else {
	                _matchContainer.removeClass('other_reported_loss');
	            }
	            if (otherTeam.match_report == WIN_MATCH) {
	                _matchContainer.addClass('other_reported_win');
	            } else {
	                _matchContainer.removeClass('other_reported_win');
	            }
	        }
	
	        return _matchContainer;
	    },
	    /** Also calls ElementUpdate.Flair and ElementUpdate.userTypes */
	    user: function user(element, _user) {
	        if (!_user.id) {
	            return; //Error...
	        }
	        // element.find('input[name=player_id]').val(user.id);
	        _user = _matchmaking.Users.create(_user);
	        if (_user.id == myUser.id) {
	            element.addClass('is_me');
	        }
	        ElementUpdate.flair(element, _user);
	        var usernameElement = element.find('.username').text(_user.getDisplayedName());
	        if (usernameElement.length) {
	            ElementUpdate.userTypes(usernameElement, _user);
	        } else {
	            ElementUpdate.userTypes(element, _user);
	        }
	        element.data('username', _user.username);
	        element.data('usernameLowercase', new String(_user.username).toLowerCase());
	
	        if (_user.location) {
	            element.find('.location').text(_user.location.relativeLocation());
	        }
	
	        if (_user.is_online === false) {
	            element.addClass('offline');
	        } else {
	            if (_user.away_message) {
	                element.find('.title').text(_user.away_message);
	            }
	        }
	        if (_user.wants_to_play && element.hasClass('away')) {
	            element.removeClass('away');
	        }
	
	        if (typeof _user.league != 'undefined') {
	            ElementUpdate.league(element.find('.league'), _user.league);
	            element.data('league', _user.league);
	        }
	        if (_user.is_playing) element.addClass('playing');else element.removeClass('playing');
	
	        if (_user.message && _user.message.update_time) {
	            var message = _user.message;
	            var date = new Date(message.update_time * 1000);
	            element.find('.last_message_time').text(date.format('M j, g:ia')).data('timestamp', message.update_time);
	        }
	        if (_user.id) {
	            element.data('id', _user.id);
	        }
	        if (_user.username && usernameElement.length) {
	            var link = _ChatActions.ChatActions.getUsernameLink(_user);
	            if (link) {
	                usernameElement.attr('href', _ChatActions.ChatActions.getUsernameLink(_user));
	            }
	            usernameElement.data('id', _user.id);
	            usernameElement.data('useranme', _user.username);
	        }
	        ElementUpdate.updateChallengeButtons(_user, element);
	    }
	};
	ElementUpdate.updateChallengeButtons = function (user, elements, userOptions) {
	    var defaultOptions = {
	        showOffline: false,
	        showOnline: false,
	        showPlayButtons: true //Play, Specific Challenges, Away
	    };
	    elements.each(function () {
	        var element = $(this);
	        var userOptions = element.data('challengeButtonOptions');
	        var options = null;
	
	        if (userOptions) {
	            options = $.extend(defaultOptions, userOptions);
	        } else {
	            var onlineUser = element.closest('.online_user');
	            if (onlineUser.length) {
	                userOptions = onlineUser.data('challengeButtonOptions');
	                if (userOptions) {
	                    element.data('challengeButtonOptions', userOptions); //Steal the parent's options
	                }
	                options = $.extend(defaultOptions, userOptions);
	            } else {
	                options = defaultOptions;
	            }
	        }
	
	        var challenge = element.find('.challenge');
	        var challenged = element.find('.challenged');
	        var noChallenges = element.find('.no_challenges');
	        var nowPlaying = element.find('.now_playing');
	        var online = element.find('.is_online');
	        var offline = element.find('.is_offline');
	        var invite = element.find('.invite');
	        var allButtons = challenge.add(challenged).add(noChallenges).add(nowPlaying).add(online).add(invite);
	
	        allButtons.hide();
	
	        if (user.is_browser_idle) {
	            element.addClass('browser_idle');
	        } else {
	            element.removeClass('browser_idle');
	        }
	
	        if (options.showOffline && options.showOnline) {
	            if (user.is_online) {
	                element.addClass('is_online');
	                element.removeClass('is_offline');
	            } else //we just assume the worst of this person
	                {
	                    element.addClass('is_offline');
	                    element.removeClass('is_online');
	                }
	            return;
	        }
	        if (options.showOffline && !options.showOnline) {
	            if (!user.is_online) {
	                element.addClass('is_offline');
	                element.removeClass('is_online');
	                //If this isn't the case, then we'll show normal play buttons
	                return;
	            } else {
	                element.addClass('is_online');
	                element.removeClass('is_offline');
	            }
	        }
	
	        if (options.showPlayButtons) {
	            var challenges = _LadderInfo.LadderInfo.retrieveReference('openChallenges');
	
	            if (!challenges.extraData.users) challenges.extraData.users = {};
	
	            if (challenges.extraData.users[user.id]) {
	                element.removeClass('away');
	                challenged.show();
	                return;
	            }
	            // if(options.showAway)
	            // {
	            //     if(user.wants_to_play !== null && !user.wants_to_play)
	            //     {
	            //         element.addClass('away');
	            //         noChallenges.show();
	            //         return;
	            //     }
	            // }
	            if (user.is_playing) {
	                element.removeClass('away');
	                nowPlaying.show();
	                return;
	            }
	
	            if (options.showMatchSpecificOptions && user.match && user.match.expiration) {
	                challenge.addClass('active').show();
	                ElementUpdate.updateMatchCount(user.match, challenge);
	                if (user.match.is_ranked) {
	                    challenge.removeClass('friendlies');
	                    challenge.addClass('ranked');
	                } else {
	                    challenge.removeClass('ranked');
	                    challenge.addClass('friendlies');
	                }
	                return;
	            }
	
	            if (options.inviteToMatch && _Dashboard.Dashboard.currentMatch && _Dashboard.Dashboard.currentMatch.isDoubles()) {
	                invite.data('match_id', _Dashboard.Dashboard.currentMatch.id);
	                invite.show();
	                return;
	            }
	            if (user.id != myUser.id) {
	                challenge.show();
	            }
	        }
	        challenge.text('Play').removeClass('active').removeClass('friendlies ranked').attr('title', 'Click to ask for a match!');
	    });
	};
	ElementUpdate.updateMatchCount = function (match, $container, updateAnyway) {
	    if (!(match instanceof _Match.Match)) {
	        match = new _Match.Match(match);
	    }
	    var matchCount = match.match_count;
	    var ranked = match.is_ranked;
	    var gameType = match.game_type;
	
	    var gameName = $('<span>').addClass('game_name');
	    var textString = '';
	    if (!updateAnyway && $container.hasClass('game_name_added')) {
	        return;
	    }
	    $container.addClass('game_name_added');
	    $container.empty();
	    if (match.game_type && !$container.hasClass('game-' + match.game_slug) || updateAnyway) {
	        $container.addClass('game-' + match.game_slug);
	        if ($container.hasClass('show_image') && match.ladder && match.ladder.small_image && !gameName.hasClass('image_added')) {
	            gameName.addClass('image_added');
	            var image = $('<img>').attr('src', match.ladder.small_image);
	            image.prependTo(gameName);
	        } else {
	            gameName.text(match.ladder_name + ' ');
	        }
	        textString += gameName.text();
	        $container.append(gameName);
	    }
	
	    var matchCountText = $('<span>').addClass('match_count_text');
	    if (matchCount) {
	        matchCountText.text('Best of ' + matchCount);
	    } else {
	        matchCountText.text('Endless');
	    }
	    textString += matchCountText.text();
	    $container.append(matchCountText);
	    if (match.isDoubles()) {
	        var doublesText = $('<span>').addClass('is_doubles');
	        doublesText.text(' Doubles');
	        $container.append(doublesText);
	    }
	    if ($container.is('button')) {
	        //			$container.text('');
	    } else {
	            var matchType = $('<span>').addClass('match_type');
	            if (ranked) {
	                matchType.text(' Ranked');
	            } else {
	                matchType.text(' Friendlies');
	            }
	            $container.append(matchType);
	        }
	    return textString;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DateFormat = undefined;
	
	__webpack_require__(39);
	
	var DateFormat = exports.DateFormat = {
	    custom: function custom(timestamp, format) {
	        return new Date(timestamp * 1000).format(format);
	    },
	    small: function small(timestamp) {
	        return new Date(timestamp * 1000).format('g:ia');
	    },
	    hourMinutes: function hourMinutes(timestamp) {
	        return new Date(timestamp * 1000).format('g:i.sa');
	    },
	    monthDayYear: function monthDayYear(timestamp) {
	        return new Date(timestamp * 1000).format('M j, Y');
	    },
	    full: function full(timestamp) {
	        return new Date(timestamp * 1000).format('M j, Y g:i.sa');
	    },
	    daySmall: function daySmall(timestamp) {
	        return new Date(timestamp * 1000).format('M-j');
	    },
	    day: function day(timestamp) {
	        return new Date(timestamp * 1000).format('j');
	    },
	    smart: function smart(timestamp, datesOnly) {
	        if (typeof datesOnly == 'undefined') {
	            datesOnly = false;
	        }
	        var $time = new Date(timestamp * 1000);
	        var $current = new Date();
	
	        var diffHours = DateFormat.diffHours($current, $time);
	        var diffDays = DateFormat.diffDays($current, $time);
	        var diffMinutes = DateFormat.diffMinutes($current, $time);
	        if ($current.format('Y') != $time.format('Y')) {
	            if (DateFormat.diffDays($current, $time) < 365) {
	                return $time.format("M j 'y");
	            } else {
	                return $time.format('M \'y');
	            }
	        }
	        if ($time > $current) {
	            return $time.format("M j 'y");
	        }
	        if ($current.format('m') != $time.format('m')) {
	            return $time.format('M j');
	        }
	        if (diffDays < 1 && !datesOnly) {
	            if (diffHours) {
	                return diffHours + 'h';
	            }
	            if (diffMinutes) {
	                return diffMinutes + 'm';
	            }
	            return 'Just Now';
	        }
	        if (diffDays == 0 && diffHours <= 23 && diffHours > 0) {
	            return diffHours + 'h';
	        }
	        return $time.format('M j');
	    },
	
	    diffDays: function diffDays(firstDate, secondDate) {
	        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
	    },
	    diffMinutes: function diffMinutes(firstDate, secondDate) {
	        var oneDay = 60 * 1000; // hours*minutes*seconds*milliseconds
	        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
	    },
	    diffHours: function diffHours(firstDate, secondDate) {
	        var oneDay = 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
	    }
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	(function () {
	
	    Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	    Date.longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	    Date.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	    Date.longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	
	    // defining patterns
	    var replaceChars = {
	        // Day
	        d: function d() {
	            return (this.getDate() < 10 ? '0' : '') + this.getDate();
	        },
	        D: function D() {
	            return Date.shortDays[this.getDay()];
	        },
	        j: function j() {
	            return this.getDate();
	        },
	        l: function l() {
	            return Date.longDays[this.getDay()];
	        },
	        N: function N() {
	            return this.getDay() + 1;
	        },
	        S: function S() {
	            return this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th';
	        },
	        w: function w() {
	            return this.getDay();
	        },
	        z: function z() {
	            var d = new Date(this.getFullYear(), 0, 1);return Math.ceil((this - d) / 86400000);
	        }, // Fixed now
	        // Week
	        W: function W() {
	            var d = new Date(this.getFullYear(), 0, 1);return Math.ceil(((this - d) / 86400000 + d.getDay() + 1) / 7);
	        }, // Fixed now
	        // Month
	        F: function F() {
	            return Date.longMonths[this.getMonth()];
	        },
	        m: function m() {
	            return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1);
	        },
	        M: function M() {
	            return Date.shortMonths[this.getMonth()];
	        },
	        n: function n() {
	            return this.getMonth() + 1;
	        },
	        t: function t() {
	            var d = new Date();return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
	        }, // Fixed now, gets #days of date
	        // Year
	        L: function L() {
	            var year = this.getFullYear();return year % 400 == 0 || year % 100 != 0 && year % 4 == 0;
	        }, // Fixed now
	        o: function o() {
	            var d = new Date(this.valueOf());d.setDate(d.getDate() - (this.getDay() + 6) % 7 + 3);return d.getFullYear();
	        }, //Fixed now
	        Y: function Y() {
	            return this.getFullYear();
	        },
	        y: function y() {
	            return ('' + this.getFullYear()).substr(2);
	        },
	        // Time
	        a: function a() {
	            return this.getHours() < 12 ? 'am' : 'pm';
	        },
	        A: function A() {
	            return this.getHours() < 12 ? 'AM' : 'PM';
	        },
	        B: function B() {
	            return Math.floor(((this.getUTCHours() + 1) % 24 + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24);
	        }, // Fixed now
	        g: function g() {
	            return this.getHours() % 12 || 12;
	        },
	        G: function G() {
	            return this.getHours();
	        },
	        h: function h() {
	            return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12);
	        },
	        H: function H() {
	            return (this.getHours() < 10 ? '0' : '') + this.getHours();
	        },
	        i: function i() {
	            return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes();
	        },
	        s: function s() {
	            return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
	        },
	        u: function u() {
	            var m = this.getMilliseconds();return (m < 10 ? '00' : m < 100 ? '0' : '') + m;
	        },
	        // Timezone
	        e: function e() {
	            return "Not Yet Supported";
	        },
	        I: function I() {
	            var DST = null;
	            for (var i = 0; i < 12; ++i) {
	                var d = new Date(this.getFullYear(), i, 1);
	                var offset = d.getTimezoneOffset();
	
	                if (DST === null) DST = offset;else if (offset < DST) {
	                    DST = offset;break;
	                } else if (offset > DST) break;
	            }
	            return this.getTimezoneOffset() == DST | 0;
	        },
	        O: function O() {
	            return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + Math.abs(this.getTimezoneOffset() / 60) + '00';
	        },
	        P: function P() {
	            return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + Math.abs(this.getTimezoneOffset() / 60) + ':00';
	        }, // Fixed now
	        T: function T() {
	            var m = this.getMonth();this.setMonth(0);var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');this.setMonth(m);return result;
	        },
	        Z: function Z() {
	            return -this.getTimezoneOffset() * 60;
	        },
	        // Full Date/Time
	        c: function c() {
	            return this.format("Y-m-d\\TH:i:sP");
	        }, // Fixed now
	        r: function r() {
	            return this.toString();
	        },
	        U: function U() {
	            return this.getTime() / 1000;
	        }
	    };
	
	    // Simulates PHP's date function
	    Date.prototype.format = function (format) {
	        var date = this;
	        return format.replace(/(\\?)(.)/g, function (_, esc, chr) {
	            return esc === '' && replaceChars[chr] ? replaceChars[chr].call(date) : chr;
	        });
	    };
	}).call(undefined);

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Populate = undefined;
	
	var _LadderInfo = __webpack_require__(30);
	
	var _ChatMessages = __webpack_require__(34);
	
	var Populate = exports.Populate = {
	    disputes: function disputes(response) {},
	    pendingReplies: function pendingReplies(response) {},
	    chat: function chat(response, chatMessagesHolder, loadingAllMessages) {
	        loadingAllMessages = loadingAllMessages || false;
	        chatMessagesHolder.data('loadingAllMessages', loadingAllMessages);
	        if (!response) {
	            return;
	        }
	        if (chatMessagesHolder.data('chat')) {
	            if (!chatMessagesHolder.data('userlistData')) {
	                chatMessagesHolder.data('userlistData', { container: chatMessagesHolder, callbackName: 'userlists' });
	            }
	            chatMessagesHolder.data('isPopulated', true);
	
	            var userlistData = chatMessagesHolder.data('userlistData');
	            var theUserlist = chatMessagesHolder.data('userlist');
	            if (theUserlist && theUserlist.data('loadingAll') && userlistData.items) {
	                //If loading all we need to manually add players that are removed to the userlist changes
	                $.each(userlistData.items, function (playerId, userlistItemData) {
	                    if (!response.userlist[playerId]) {
	                        userlistItemData.status = _LadderInfo.LadderInfo.STATUS_REMOVED;
	                        response.userlist[playerId] = { is_removed: true };
	                    }
	                });
	            }
	
	            _LadderInfo.LadderInfo.parseChanges(chatMessagesHolder.data('userlistData'), response.userlist);
	        }
	        if (response.html || chatMessagesHolder.data('isIrc')) {
	            if (!chatMessagesHolder.data('isIrc')) chatMessagesHolder.data('isIrc', response.html);
	
	            chatMessagesHolder.data('reveal', function () {
	                if (!chatMessagesHolder.data('last_update') && chatMessagesHolder.is(':visible')) {
	                    chatMessagesHolder.html(chatMessagesHolder.data('isIrc'));
	
	                    chatMessagesHolder.data('last_update', 1);
	                    if (chatMessagesHolder.data('chat')) chatMessagesHolder.data('chat').find('.chat_input').hide();
	                }
	            });
	            if (chatMessagesHolder.data('switchTo')) {
	                chatMessagesHolder.data('reveal')();
	            }
	            return;
	        }
	        var messages = response.chat_messages;
	        chatMessagesHolder.data('newMessagesAdded', false);
	        if (!chatMessagesHolder.data('messages')) {
	            _ChatMessages.ChatMessages.attachChatEvents(chatMessagesHolder);
	            chatMessagesHolder.data('messages', { container: chatMessagesHolder, callbackName: 'chatMessages' });
	        }
	
	        if (messages && (messages.length == undefined || messages[0] /* comes in as an array sometimes */)) //Objects have no length property
	            {
	                _LadderInfo.LadderInfo.parseChanges(chatMessagesHolder.data('messages'), messages);
	                if (messages[0]) {
	                    chatMessagesHolder.data('newMessagesAdded', false);
	                }
	            }
	        return chatMessagesHolder.data('newMessagesAdded');
	    },
	    onlineUsers: function onlineUsers(chat, userlistResponse) {},
	    matchSearches: function matchSearches(response) {}
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.GameInfoHelper = undefined;
	
	var _Match = __webpack_require__(23);
	
	var _matchmaking = __webpack_require__(10);
	
	var GameInfoHelper = exports.GameInfoHelper = {
	    setContainerToCharacter: function setContainerToCharacter(container, character, findContainers) {
	        if (character) {
	            container.removeClass('empty');
	        } else {
	            container.addClass('empty');
	            return;
	        }
	        var picksContainer = container.closest('.picks_container');
	        var myCharacterContainer = GameInfoHelper.characterElement(picksContainer, character);
	
	        if (typeof findContainers == 'undefined') {
	            findContainers = true;
	        }
	        if (findContainers) {
	            container.find('.character_holder:first').css('background-image', myCharacterContainer.css('background-image'));
	            container.find('.character_name:first').text(myCharacterContainer.data('name'));
	        } else {
	            container.css('background-image', myCharacterContainer.css('background-image'));
	        }
	        return myCharacterContainer.data();
	    },
	    setContainerToStage: function setContainerToStage(container, stage) {
	        if (stage) {
	            container.removeClass('empty');
	        } else {
	            container.addClass('empty');
	            return;
	        }
	
	        if (stage.id) {
	            var backgroundCss = 'url("' + stage.image_url + '")';
	            if (container.findCache('.stage_holder').data('background-image') != backgroundCss) {
	                console.log('previous', container.findCache('.stage_holder').data('background-image'));
	                console.log('Changing background image', backgroundCss);
	                container.findCache('.stage_holder').data('background-image', backgroundCss);
	                container.findCache('.stage_holder').css('background-image', backgroundCss);
	                container.findCache('.stage_name').text(stage.name);
	            }
	        } else {
	            var stageContainer = GameInfoHelper.stageElement(container.closest('.picks_container'), stage);
	            container.findCache('.stage_holder').css('background-image', stageContainer.css('background-image'));
	            container.findCache('.stage_name').text(stageContainer.find('input[name=name]').val());
	        }
	    },
	    characterNameFromId: function characterNameFromId(container, characterId) {
	        var element = GameInfoHelper.characterElement(container, characterId);
	        return element.find('input[name=name]').val();
	    },
	
	    characterElement: function characterElement(container, characterId) {
	        return container.find('.character input[name=character_id][value=' + characterId + ']').first().closest('.character');
	    },
	    stageElement: function stageElement(container, stageId) {
	        return container.find('.stage input[name=stage_id][value=' + stageId + ']').first().closest('.stage');
	    },
	
	    stageNameFromId: function stageNameFromId(container, stageId) {
	        return GameInfoHelper.stageElement(container, characterId).find('input[name=name]').val();
	    },
	    updateCharacters: function updateCharacters(matchContainer, match) {
	        if (!(match instanceof _Match.Match)) {
	            throw "Match Required! Not whatever the f you gave me";
	        }
	
	        var selectedCharactersContainer = matchContainer.findCache('.selected_characters');
	        var teamContainers = {
	            1: selectedCharactersContainer.findCache('.team_1_characters'),
	            2: selectedCharactersContainer.findCache('.team_2_characters')
	        };
	
	        teamContainers[match.getMyTeamNumber()].addClass('my_team');
	        teamContainers[match.getOtherTeamNumber()].addClass('other_team');
	        $.each(match.game.players, function (id, player) {
	            var teamNumber = match.players[id].match.team_number;
	            var characterId = player.character;
	            var characterContainerId = 'player_character_' + id;
	            var myTeamContainer = teamContainers[teamNumber];
	            var characterContainer = myTeamContainer.find('.' + characterContainerId);
	            if (!characterContainer.length) {
	                var user = _matchmaking.Users.retrieveById(id);
	                characterContainer = matchContainer.findCache('.player_character.template');
	                characterContainer = characterContainer.clone().removeClass('template');
	                characterContainer.addClass(characterContainerId);
	                characterContainer.prependTo(myTeamContainer);
	                characterContainer.find('.username').replaceWith(user.createUsernameElement());
	            }
	            GameInfoHelper.setContainerToCharacter(characterContainer, characterId);
	            var randomCharacterData = null;
	            GameInfoHelper.assignRandomCharacter(characterContainer, player.random_character);
	
	            if (!characterContainer.data('stockStore')) {
	                characterContainer.data('stockStore', {});
	            }
	            var stockStore = characterContainer.data('stockStore');
	            if (player.stocks && player.stocks.stock_icon && player.stocks.detail) {
	                characterContainer.findCache('.stocks').addClass('has_stocks');
	                if (player.apm) {
	                    characterContainer.findCache('.apm_container').addClass('active');
	                    characterContainer.findCache('.apm').text(player.apm);
	                } else {
	                    characterContainer.findCache('.apm_container').removeClass('active');
	                }
	                var stockIconTemplate = $('<img>').attr('src', player.stocks.stock_icon).addClass('stock_icon');
	                player.stocks.detailMap = {};
	                for (var i in player.stocks.detail) {
	                    if (!player.stocks.detail.hasOwnProperty(i)) {
	                        continue;
	                    }
	                    var stock = player.stocks.detail[i];
	                    var stockIcon = stockStore[stock.stock_number];
	                    player.stocks.detailMap[stock.stock_number] = stock;
	                    if (!stockIcon) {
	                        stockIcon = stockIconTemplate.clone();
	                        stockIcon.addClass('stock_number_' + stock.stock_number);
	                        stockIcon.appendTo(characterContainer.findCache('.stocks'));
	                        stockStore[stock.stock_number] = stockIcon;
	                    }
	                    if (stockIcon.attr('src') != player.stocks.stock_icon) {
	                        stockIcon.attr('src', player.stocks.stock_icon);
	                    }
	
	                    stockIcon.data('data', stock);
	                    if (stock.time_lost) {
	                        stockIcon.addClass('dead');
	                    } else {
	                        stockIcon.removeClass('dead');
	                    }
	                    stockIcon.removeClass('not_used');
	                }
	                for (var stockNumber in stockStore) {
	                    if (!stockStore.hasOwnProperty(stockNumber)) {
	                        continue;
	                    }
	                    var currentStock = stockStore[stockNumber];
	
	                    if (!player.stocks.detailMap[stockNumber]) {
	                        currentStock.addClass('not_used');
	                    }
	                }
	            } else {
	                characterContainer.findCache('.stocks').removeClass('has_stocks');
	            }
	        });
	    },
	    assignRandomCharacter: function assignRandomCharacter(characterContainer, randomCharacterValue) {
	        var randomCharacterData;
	        if (randomCharacterValue) {
	            characterContainer.addClass('has_random_selection');
	            randomCharacterData = GameInfoHelper.setContainerToCharacter(characterContainer.find('.random_character_holder'), randomCharacterValue, false);
	            if (randomCharacterData) {
	                characterContainer.find('.character_name').text(randomCharacterData.name);
	            }
	        } else {
	            characterContainer.removeClass('has_random_selection');
	        }
	    }
	
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.MatchmakingPopup = undefined;
	
	var _Ladder = __webpack_require__(26);
	
	var _Dashboard = __webpack_require__(5);
	
	var _MatchModeManager = __webpack_require__(22);
	
	var _Request = __webpack_require__(7);
	
	var _LadderInfo = __webpack_require__(30);
	
	var _ChatActions = __webpack_require__(4);
	
	var lastOptionalDescription = null;
	var MatchmakingPopup = exports.MatchmakingPopup = function MatchmakingPopup(popup, gameId, keepPopup) {
		if (!gameId) {
			alert('game id required');
			return;
		}
	
		if (_Dashboard.Dashboard.startMatchWithPlayer) {
			_Dashboard.Dashboard.closeDeclickables();
		} else {}
		this.teamSize = null;
		this.hasRanked = null;
		this.hasBo3 = null;
		this.canPlayRanked = null;
		this.matchSystem = null;
	
		var reference = this;
		var that = this;
	
		this.selectedOptions = {
			team_size: null,
			game_id: null,
			match_count: null,
			title: null,
			ranked: null
		};
	
		var game = popup.find('.request_match_option[data-game_id=' + gameId + ']');
		var gameAppend = game.find('.game_image').clone();
		gameAppend.appendTo(popup.find('.game_append').empty());
	
		popup.find('.game_settings_link').data('ladder_id', gameId);
		if (game.data('has_bo3')) {
			popup.find('.game_settings_selection[data-match_count!=0]').show();
		} else {
			popup.find('.game_settings_selection[data-match_count!=0]').hide();
		}
	
		if (game.data('max_friendly_team_size') == 1) {
			popup.find('.game_settings_selection[data-team_size="2"]').hide();
			popup.find('.doubles_area').hide();
		} else {
			popup.find('.game_settings_selection[data-team_size="2"]').show();
	
			if (game.data('has_doubles_picks')) {
				popup.find('.doubles_area .game_settings_selection[data-team_size=2][data-match_count!=0]').show();
			} else {
				popup.find('.doubles_area .game_settings_selection[data-team_size=2][data-match_count!=0]').hide();
			}
			if (game.data('has_ranked_doubles')) {
				popup.find('.doubles_area.ranked').show();
			} else {
				popup.find('.doubles_area.ranked').hide();
			}
		}
	
		if (game.data('has_ranked') == 0 /*||  game.data('can_play_ranked') == 0 ||game.data('other_can_play_ranked') == 0 */) {
				popup.find('.game_settings_selection[data-ranked="1"]').hide();
			} else {
			popup.find('.game_settings_selection[data-ranked="1"]').show();
		}
	
		var buildsByLadder = myUser.preferred_builds.getBuildsByLadder(gameId);
		popup.find('.build_preferences .build').removeClass('active');
		if (buildsByLadder && buildsByLadder.length) {
			var currentBuild = popup.find('#build_preference_' + gameId).addClass('active');
			$.each(currentBuild.find('.build'), function (i, build) {
				build = $(build);
				var id = build.data('build_preference_id');
				var userBuild = myUser.preferred_builds.getBuildById(id);
				if (userBuild && userBuild.active) {
					build.addClass('selected').removeClass('unselected');
					build.find('input[name=build_active]').prop('checked', true);
				} else {
					build.addClass('unselected').removeClass('selected');
					build.find('input[name=build_active]').prop('checked', false);
				}
			});
			$.each(buildsByLadder, function (i, build) {
				popup.find('.build[data-build_preference_id=' + build.id + ']').appendTo(currentBuild);
			});
	
			if (!popup.data('eventsAttached')) {
				popup.data('eventsAttached', true);
				var updateBuild = function updateBuild(build) {
					var checkbox = build.find('input[name=build_active]');
					var changeTo = checkbox.is(':checked') ? 1 : 0;
					if (changeTo) {
						build.removeClass('unselected').addClass('selected');
					} else {
						build.removeClass('selected').addClass('unselected');
					}
					var undo = function undo() {
						if (changeTo) {
							build.removeClass('selected').addClass('unselected');
						} else {
							build.removeClass('unselected').addClass('selected');
						}
					};
	
					var data = {
						build_preference_id: build.data('build_preference_id'),
						active: changeTo
					};
					$.post(siteUrl + '/apiv1/update_build_preference_active', data, function (response) {
						if (response.success) {
							myUser.setProperties({ preferred_builds: response.preferred_builds });
							_Dashboard.Dashboard.updateSearchesByBuildPreference(_Dashboard.Dashboard.recentMatchSearchers.find('.recent_match_searcher').not('.template'));
						} else {
							undo();
						}
					}).error(function () {
						undo();
					});
				};
				popup.on('change', '.build input[name=build_active]', function (e) {
					var build = $(this).closest('.build');
					// var modal = $('#bootstrap-modal').modal(title, content);
					updateBuild(build);
				});
			}
			var currentBuildData = myUser.preferred_builds;
		} else {
			popup.find('.build_preference_set').removeClass('active');
		}
	
		if (!popup.data('playEvents')) {
			popup.data('playEvents', true);
			popup.on('click', '.game_settings_selection', function (e) {
	
				var button = $(this);
				if (button.hasClass('disabled')) {
					return;
				}
				button.addClass('disabled');
	
				that.selectedOptions.team_size = button.data('team_size');
				that.selectedOptions.ranked = button.data('ranked');
				that.selectedOptions.match_count = button.data('match_count');
				that.selectedOptions.game_id = gameId;
	
				that.selectedOptions.title = $('#match_options_optional_description').val();
				that.clickable = false;
				$('#matchmaking_popup_error_message').hide();
				finishedMenu($('#matchmaking_popup_game')).then(function (response) {
					if (response && response.error) {
						alert(response.error);
					}
					button.removeClass('disabled');
				});
			});
		}
		popup.find('.game_settings_selection').removeClass('disabled');
	
		var endSelectOption = function endSelectOption() {
			_MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SEARCH);
			if (!keepPopup) {
				popup.remove();
			}
		};
	
		popup.find('#matchmaking_popup_back_button').click(function (e) {
			e.preventDefault();
			endSelectOption();
		});
	
		this.optionalDescription = popup.find('.optional_description').val(lastOptionalDescription);
	
		var finishedMenu = function finishedMenu(goBackToMenuTab) {
			$('#matchmaking_popup_loading').addClass('active');
			$('#matchmaking_popup_error_message').hide();
			var visibleDescription = that.optionalDescription.filter(':visible');
			var ranked = that.selectedOptions.ranked;
	
			if (_Dashboard.Dashboard.startMatchWithPlayer) {
				return MatchmakingPopup.challengeSearch(_Dashboard.Dashboard.startMatchWithPlayer, that.selectedOptions, null, null, null, endSelectOption);
			} else {}
	
			var data = that.selectedOptions;
	
			lastOptionalDescription = that.selectedOptions.title;
			data.host_code = _Dashboard.Dashboard.retrieveHostCode();
			var activeChatContainer = _ChatActions.ChatActions.getActiveChatContainer();
			if (activeChatContainer && activeChatContainer.length) {
				data.chat_room_id = activeChatContainer.data('chat').data('chat_room_id');
			}
			addGaEvent('matchmaking', 'seeking');
	
			return new Promise(function (resolve, reject) {
				_Request.Request.send(data, 'begin_matchmaking', function (response) {
					$('#matchmaking_popup_loading').removeClass('active');
					if (response.success) {
						endSelectOption();
						if (response.message) {
							alert(response.message);
						}
					} else {
						goBackToMenuTab.click();
						if (response.message) $('#matchmaking_popup_error_message').text(response.message).show();
						if (response.error) $('#matchmaking_popup_error_message').text(response.error).show();
					}
					resolve(response);
					return true;
				});
			});
		};
	};
	
	var playOptionsHtml = null;
	MatchmakingPopup.showMatchSelectDialog = function (ladderId, launchPopup) {
		if (typeof launchPopup == 'undefined') {
			launchPopup = true;
		}
		$('#match_settings_holder').empty();
		return new Promise(function (resolve, reject) {
			if (!ladderId) {
				var errorMessage = new Error('A game needs to be specified!');
				alert(errorMessage);
				reject(errorMessage);
				return;
			}
			var data;
			var specificPlayer = null;
			if (_Dashboard.Dashboard.startMatchWithPlayer) {
				specificPlayer = true;
				data = { other: _Dashboard.Dashboard.startMatchWithPlayer.data('username') };
			} else {
				data = {};
			}
			data.ladder_id = ladderId;
	
			if (_Dashboard.Dashboard.currentMatch && launchPopup) {
				var _errorMessage = new Error('You cannot challenge another player while you are still in a match!');
				_Dashboard.Dashboard.battleTab.trigger('activate');
				reject(_errorMessage);
				_Ladder.Ladder.coolAlert(_errorMessage);
				return;
			}
	
			var openPopupWithData = function openPopupWithData(innerHtml) {
				var matchPlayOptions = $('#match_play_options').html(innerHtml);
	
				if (launchPopup) {
					_MatchModeManager.matchModeManager.changeViewMode(_MatchModeManager.MatchModeManager.modes.SELECT_OPTIONS);
				}
				var popup = new MatchmakingPopup($('#matchmaking_popup'), data.ladder_id);
				resolve();
			};
			if (launchPopup) {
				_Dashboard.Dashboard.matchmakingPaneShouldGetFocusIfNeeded();
			}
			if (!specificPlayer && playOptionsHtml) {
				openPopupWithData(playOptionsHtml);
			} else {
				$('#play_options_loading').addClass('active');
				$.post(siteUrl + '/matchmaking/play_options', data, function (response) {
					if (response.success) {
						var html = response.html;
						if (!specificPlayer && !response.error_message) {
							playOptionsHtml = html;
						}
						openPopupWithData(response.html);
					} else {}
					$('#play_options_loading').removeClass('active');
				}).error(function () {
					reject(new Error('Server Error'));
				});
			}
		});
	};
	
	MatchmakingPopup.challengeSearch = function (playerInfo, game, match_count, ranked, matchId, finishedCallback) {
		var player = playerInfo;
		var match = player.data('match');
		if (match) {
			var player_id = player.data('match').player1.id;
		} else {
			player_id = player.find('input[name=player_id]').val();
		}
	
		if (player.data('user')) {
			var user = player.data('user');
			if (user.getToxicCount() >= 2) {
	
				return user.showToxicWarning().then(function () {
					return sendTheChallenge();
				}).catch(function () {});
			}
		}
		return sendTheChallenge();
	
		function sendTheChallenge(resolver) {
			var data;
			if (game) {
				data = game;
			} else {
				data = {};
			}
			data.challenge_player_id = player_id;
			data.match_id = matchId;
	
			if (matchId) {
				var reference = _LadderInfo.LadderInfo.retrieveReference('currentMatches');
				delete reference.callbacks.preventReadd[matchId];
			}
			var challenge = player.find('.challenge');
			var challenged = player.find('.challenged');
	
			challenge.removeClass('active').hide();
			challenged.addClass('active').show();
	
			return new Promise(function (resolve, reject) {
	
				_Request.Request.send(data, 'challenge_search', function (response) {
					if (response.success) {
						if (finishedCallback) {
							finishedCallback();
						}
						if (response.challenged) {
							challenged.addClass('active').show();
							challenge.removeClass('active').hide();
							player.find('.no_challenges').hide();
						} else {
							challenge.addClass('active').show();
							challenged.removeClass('active').hide();
						}
						if (response.error) {
							alert(response.error);
						}
						if (response.message) {}
						resolve();
						if (resolver) {
							resolver();
						}
					} else {
						if (response.error) {
							$('#matchmaking_popup_match_count').click();
							if (response.message) $('#matchmaking_popup_error_message').text(response.message).show();
							if (response.error) $('#matchmaking_popup_error_message').text(response.error).show();
						}
						challenge.addClass('active').show();
						challenged.removeClass('active').hide();
						reject(response);
					}
	
					return true; //Ccontinue message response parsing
				});
			});
			addGaEvent('matchmaking', 'challenging');
		}
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Popups = exports.Popups = {
	    modMatchHistoryFromPlayerId: function modMatchHistoryFromPlayerId(playerId) {
	        var url = siteUrl + '/match/recent_matches/id/' + playerId + '/mod';
	        return Popups.matchHistory(url);
	    },
	    matchHistoryFromPlayerId: function matchHistoryFromPlayerId(playerId) {
	        var url = siteUrl + '/match/recent_matches/id/' + playerId;
	        return Popups.matchHistory(url);
	    },
	    matchHistoryFromUsername: function matchHistoryFromUsername(username) {
	        var url = siteUrl + '/match/recent_matches/username/' + username;
	        return Popups.matchHistory(url);
	    },
	    matchHistory: function matchHistory(url, callback) {
	        return Popups.ajax(url, null, callback);
	    },
	    matchmakingAjax: function matchmakingAjax(data, action, callback) {
	        var url = siteUrl + '/matchmaking/' + action;
	        Popups.ajax(url, data, callback);
	    },
	    ajax: function ajax(url, data, callback) {
	        var content = $('.popup_loading_popup').clone();
	        var xhr = null;
	        $.fancybox({ content: content,
	
	            onComplete: function onComplete() {
	                xhr = $.post(url, data, function (response) {
	                    xhr = null;
	                    if (response.success) {
	                        var innerContent = $(response.html);
	                        if (callback) {
	                            callback(response, innerContent);
	                        }
	                        $.fancybox({
	                            content: innerContent
	                        });
	                    } else {
	                        if (response.error) {
	                            $.fancybox({
	                                content: response.error
	                            });
	                        }
	                    }
	                }).error(function () {
	                    $.fancybox({
	                        content: "Error!"
	                    });
	                });
	            },
	            onClosed: function onClosed() {
	                if (xhr) xhr.abort();
	            }
	        });
	    },
	    match: function match(matchId) {
	        var url = siteUrl + '/match/view/' + matchId + '/ajax';
	        return Popups.matchHistory(url);
	    }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SiteLinker = undefined;
	
	var _LadderLinker = __webpack_require__(45);
	
	var SiteLinker = exports.SiteLinker = {
	    link: function link(text) {
	        text = Autolinker.link(text, _LadderLinker.LadderLinker.autolinkerOptions);
	        if (_LadderLinker.LadderLinker.autoReplaces) {
	            $.each(_LadderLinker.LadderLinker.autoReplaces, function (search, replace) {
	                var regex = new RegExp(search, "g");
	                text = text.replace(regex, '<a target="_blank" href="' + replace.link + '">' + search + '</a>');
	            });
	        }
	        return text;
	    }
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.LadderLinker = undefined;
	
	var _Html = __webpack_require__(27);
	
	var _TokensManager = __webpack_require__(28);
	
	var _BrowserNotification = __webpack_require__(24);
	
	var _Flair = __webpack_require__(21);
	
	var _ChatActions = __webpack_require__(4);
	
	var _matchmaking = __webpack_require__(10);
	
	var _array_flip = __webpack_require__(46);
	
	var LadderLinker = exports.LadderLinker = {
	
	    autolinkMessage: function autolinkMessage(message, massLoading, chatContainer, $element) {
	        massLoading = massLoading || false;
	        LadderLinker.autolinkerOptions.stripPrefix = false;
	        LadderLinker.autolinkerOptions.hashtag = 'twitter';
	
	        //if(massLoading)
	        //{
	        //LadderLinker.autolinkerOptions.usernameFoundCallback = null;
	        //}
	        //else
	        {
	            // if(!chatContainer || (chatContainer && !chatContainer.hasClass('private')))
	            {
	                LadderLinker.autolinkerOptions.usernameFoundCallback = function (username) {
	                    if (message.player && message.player.id != myUser.id) {
	                        LadderLinker.usernameFoundCallback(username, message, chatContainer, $element, null, !massLoading);
	                    }
	                };
	            }
	        }
	
	        var text = Autolinker.link(message.player.is_admin ? message.message : _Html.Html.encode(message.message), LadderLinker.autolinkerOptions);
	
	        $.each(LadderLinker.autoReplaces, function (search, replace) {
	            var regex = new RegExp(search, "g");
	            if (replace.link) {
	                text = text.replace(regex, '<a target="_blank" href="' + replace.link + '">' + search + '</a>');
	            }
	        });
	        if ( /* message.player.is_subscribed*/message.player.is_admin) {
	            // text = emotify(text);
	        } else {}
	
	        //Search for plain username
	        var usernameRegex = new RegExp("(?:^|\\s)(" + myUser.username + ")(?=\\s|$)", "gi");
	        if (usernameRegex.test(text)) {
	            text = text.replace(usernameRegex, function (match) {
	                return myUser.createUsernameElement().addClass('casual_mention').attr('title', 'You have been casually mentioned!').text(match).attr('data-username', myUser.username).prop('outerHTML');
	            });
	        }
	
	        return text;
	    }
	
	};
	
	LadderLinker.autoReplaces = {
	    '::guides::': { link: 'https://www.smashladder.com/help/netplay-guides' },
	    '::matchmaking-guide::': { link: 'https://www.smashladder.com/guides/view/26zx/matchmaking-guide' },
	    '::pm-guide::': { link: 'https://www.smashladder.com/guides/view/25js/2015-06-18/project-m-netplay-guide' },
	    '::melee-guide::': { link: 'https://www.smashladder.com/guides/view/272o/melee-dolphin-build-fastermelee-5-fm5' },
	    '::brawl-guide::': { link: 'https://www.smashladder.com/guides/view/25u6/brawl/brawl-netplay-guide' },
	    '::controller-guide::': { link: 'https://www.smashladder.com/guides/view/26oz/controller-guide-2-0' },
	    '::site-rules::': { link: 'https://www.smashladder.com/help/terms-and-conditions' },
	    '::rank-faq::': { link: 'https://www.smashladder.com/help/tiers' },
	    '::rank-guide::': { link: 'https://www.smashladder.com/help/tiers' },
	    '::ssf2-guide::': { link: 'https://www.smashladder.com/blogs/view/263z' },
	    '::desync-guide::': { link: 'https://www.smashladder.com/guides/view/26pv/desync-troubleshooting-guide' },
	    '::desynch-guide::': { link: 'https://www.smashladder.com/guides/view/26pv/desync-troubleshooting-guide' },
	    '::lag-guide::': { link: 'https://www.smashladder.com/guides/view/2688/killing-input-lag-the-perfect-pc-setup-guide' },
	    '::monitor-guide::': { link: 'https://www.smashladder.com/guides/view/2688/killing-input-lag-the-perfect-pc-setup-guide' },
	    '::netplay-guide::': { link: 'https://www.smashladder.com/guides/view/26c7/netplay-guide-dolphin-5-0-321' },
	    '::no-traversal-guide::': { link: 'https://www.smashladder.com/guides/view/26jo/direct-ip-hosting' },
	    '::direct-ip-guide::': { link: 'https://www.smashladder.com/guides/view/26jo/direct-ip-hosting' },
	    '::troubleshooting-guide::': { link: 'https://www.smashladder.com/guides/view/26q1' },
	    '::disputes::': { link: 'https://www.smashladder.com/guides/view/26zq/ranked-match-disputes' },
	    '::ladder-dolphin-launcher::': { link: 'https://www.smashladder.com/blogs/view/26zt/ladder-dolphin-launcher' },
	    '::dolphin-download::': { link: siteUrl + '/download/dolphin' }
	};
	LadderLinker.flippedAutoReplaces = null;
	
	LadderLinker.getGuideShortcuts = function () {
	    if (LadderLinker.flippedAutoReplaces) return LadderLinker.flippedAutoReplaces;
	
	    LadderLinker.flippedAutoReplaces = [];
	    var key = null,
	        temporaryArray = [];
	
	    $.each(LadderLinker.autoReplaces, function (key, data) {
	        if (LadderLinker.autoReplaces.hasOwnProperty(key)) {
	            temporaryArray.push(key);
	        }
	    });
	    return LadderLinker.flippedAutoReplaces = temporaryArray;
	};
	
	LadderLinker.emoteShortcuts = {
	    '*pls*': 'ヽ ╭ ° ͜ʖ͡°╮ﾉ',
	    '*gimace*': 'ヽ༼ ͒ ̶ ͒༽ﾉ',
	    '*grimace*': 'ヽ༼  ͒ ̶ ͒༽  ﾉ ',
	    '*KappaTears*': "ヽ( ͡°;╭​͜ʖ╮​͡°; )ﾉ",
	    '*Kappa*': '- ̗̀ ヽ( ͡°╭​͜ʖ╮​​͡ °)ﾉ ̖́-',
	    '*Kapap*': '- ̗̀ ヽ( ͡°╭​͜ʖ╮​​͡ °)ﾉ ̖́-',
	    'Kapap': 'ヽ(。 ╭​͜つ​╮​͡ °)ﾉ',
	    'Kappa': 'ヽ( ͡°╭​͜ʖ╮​͡° )ﾉ',
	    '*gub*': ' ༼ つ ◕_◕ ༽つ',
	    '*gib*': ' ༼  つ ◕_◕  ༽ つ',
	    '*bond*': 'c(ˊᗜˋ*c)',
	    '*lenny*': '( ͡° ͜ʖ ͡°)',
	    '*magic*': '(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧',
	    '*raise*': 'ヽ༼ຈل͜ຈ༽ﾉ',
	    '*coffee*': '☕c(ˊᗜˋ♡c)',
	    '*shroom*': '🍄c(ˊᗜˋ♡c)',
	    '*mippy*': ' ( ˘ ³˘)❤',
	    '*eeffoc*': '(ɔ♡ˊᗜˋ)ɔ☕',
	    '*tableflip*': '(╯°□°）╯︵ ┻━┻',
	    '*pikaflip*': 'ʕノ•ᴥ•ʔノ ︵ ┻━┻',
	    '*kirby*': '<(-^.^-)>',
	
	    '*table*': '┻━┻',
	    '*mfw*': 'O͡͡͡͡͡͡͡͡͡͡͡͡͡͡╮༼;´༎ຶ.̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̨̨̨̨̨̨̨̨̨̨̨̨.̸̸̨̨۝ ༎ຶ༽╭o͡͡͡͡͡͡͡͡͡͡͡͡͡͡',
	    '*doge*': 'ヽ༼°ᴥ°༽ﾉ',
	    '*pet*': 'ヽ༼°ᴥ°༽ﾉ',
	    '*gren*': 'gren 👌',
	    '*coffee!*': '- ̗̀ - ̗̀ ☕c(ˊᗜˋ♡c) ̖́- ̖́-',
	    '*why*': 'ლ(ಠ益ಠლ)',
	    '*nose*': '( ͡° ͜👃 ͡°)',
	    '*shrug*': '¯\\_(ツ)_/¯',
	    '*shrugs*': '¯\\_(ツ)_/¯',
	    '*spider*': '/\\\\; ;//\\',
	    '*alienlenny*': '(◕ ͜ʖ◕)',
	    '*kappashrug*': '乁(ツ​͜ʖ╮​͡° )ﾉ',
	    '*aok*': '👌',
	    '*goodstuff*': '👌( ͡° ͜ʖ ͡°👌)',
	    '*mono*': '(╭ರᴥ•́)',
	    '*zing*': '☜(ﾟヮﾟ☜)',
	    '*happy*': 'ᕕ( ᐛ )ᕗ',
	    '*yay*': '- ̗̀ ヽ( ͡° ³ ​​͡ °)ﾉ ̖́-',
	    '*strong*': 'ᕦ(눈‿눈ˇ)ᕤ'
	};
	LadderLinker.emoteShortcutsEntries = null;
	LadderLinker.getEmoteShortcuts = function () {
	    if (LadderLinker.emoteShortcutsEntries) {
	        return LadderLinker.emoteShortcutsEntries;
	    }
	    LadderLinker.emoteShortcutsEntries = [];
	    // var emotes = user.autoCompleteElementSecondary = {
	    //     label:displayed,
	    //     value:user.username,
	    //     searchValue:user.display_name +user.username,
	    //     isUsername: true
	    // };
	    $.each(LadderLinker.emoteShortcuts, function (shortcut, result) {
	        LadderLinker.emoteShortcutsEntries.push({
	            label: $('<span class="shortcut_text">' + shortcut + '</span>' + '<span class="shortcut_result">' + result + '</span>'),
	            value: shortcut
	        });
	    });
	    return LadderLinker.emoteShortcutsEntries;
	};
	/**
	 *
	 * @param username The Found username
	 * @param message the message element
	 * @param chatContainer Message's container
	 * @param $element Element that contains the message
	 * @param tokensManager TokenManager that possibly
	 * @returns {boolean} | true - Show message | false/null - Skip message
	 */
	LadderLinker.usernameFoundCallback = function (username, message, chatContainer, $element, tokensManager, notifyBrowser) {
	    var modMention = tokensManager instanceof _TokensManager.TokensManager && tokensManager.command == 'mods' && chatContainer && chatContainer.data('isChatMod');
	    if (!modMention) {
	        //modMention = (
	        //	chatContainer &&
	        //	chatContainer.data('isChatMod') &&
	        //	username.toUpperCase() === 'MODS'
	        //);
	    }
	    var allMention = tokensManager instanceof _TokensManager.TokensManager && tokensManager.command == 'all' && chatContainer && message.isChatMod();
	    var titleNotification;
	    var chatNotification;
	    var browserNotification;
	    if (modMention) {
	        titleNotification = 'Mods were privately mentioned!';
	        chatNotification = 'mods were privately mentioned in';
	    } else if (allMention) {
	        titleNotification = 'Chat Broadcast!';
	        chatNotification = 'broadcasted a message in';
	    } else {
	        titleNotification = 'You were Mentioned!';
	        chatNotification = 'mentioned you in';
	    }
	    chatNotification = ' ' + chatNotification + ' ';
	    if (modMention || allMention || username.toUpperCase() === myUser.username.toUpperCase() || myUser.display_name && username.toUpperCase() === myUser.display_name.toUpperCase()) {
	
	        if (notifyBrowser) {
	            if (chatContainer && chatContainer.data('chat')) {
	                if (ignoreList[message.player.id]) {
	                    return;
	                }
	                var name = chatContainer.data('chat').data('name');
	                var button = chatContainer.data('chat').data('button');
	                button.trigger('mentioned', [message.player.username, name, $element]);
	                _BrowserNotification.BrowserNotification.titleNotification(titleNotification, 0, 5);
	
	                if (!button.hasClass('active')) {
	                    var notificationMessage = $('<span>');
	                    var userMessage = $('<span>').addClass('username').text(message.player.username);
	                    var displayedMessage = $('<span>').addClass('chatlink').text(chatNotification + name + '!');
	                    notificationMessage = notificationMessage.append(userMessage).append(displayedMessage);
	                    notificationMessage = _ChatActions.ChatActions.addNotificationToChat(null, notificationMessage);
	                    displayedMessage.click(function (e) {
	                        e.stopImmediatePropagation();
	                        button.click();
	                        notificationMessage.remove();
	                    });
	                }
	
	                _BrowserNotification.BrowserNotification.showNotification(titleNotification, {
	                    body: message.player.username + chatNotification + name + ': ' + message.message,
	                    icon: message.player.selected_flair ? _Flair.Flair.retrieve(message.player.selected_flair).fullUrl : undefined,
	                    onClick: function onClick() {
	                        window.focus();
	                        // button.trigger('click');
	                        _ChatActions.ChatActions.changeMainChat(button);
	                    },
	                    tag: message.player.username + name + message.message
	                });
	            } else {
	                _BrowserNotification.BrowserNotification.titleNotification('You were mentioned!', 0, 5);
	                _BrowserNotification.BrowserNotification.showNotification('You were mentioned!');
	            }
	        }
	        if ($element) {
	            if (tokensManager && tokensManager.command == 'mods') {
	                $element.addClass('mods_mentioned');
	            }
	            $element.addClass('you_were_mentioned');
	        }
	        return true;
	    }
	    return false;
	};
	LadderLinker.autolinkerOptions = {};
	var linkTypes = {
	    url: function url() {}
	};
	function getExtensionFromUrl(url) {
	    var extension = url.match(/\.([^\./\?]+)($|\?)/);
	    if (!extension) {
	        return null;
	    }
	    if (!extension[1]) {
	        return null;
	    }
	    return extension[1];
	}
	LadderLinker.autolinkerOptions.replaceFn = function (autolinker, match) {
	    var tag = autolinker.getTagBuilder().build(match);
	    tag.addClass('autolinked');
	    tag.setInnerHtml(match.getMatchedText());
	    var location;
	    // if(linkTypes[match.getType()])
	    // {
	    //     linkTypes[match.getType()]();
	    // }
	    switch (match.getType()) {
	        case 'url':
	            var url = match.getUrl();
	            var parsed = LadderLinker.parse_url(url);
	            if (!parsed.host) {
	                parsed.host = "";
	            }
	            if (url.indexOf('i.imgur.com/') !== -1 || url.indexOf('puu.sh/') !== -1
	            // url.indexOf('prntscr.com/') doesn't support previews
	            ) {
	                    var imageMovieExtensions = {
	                        'gifv': true,
	                        'webm': true
	                    };
	                    var fileExt = getExtensionFromUrl(url);
	                    var previewUrl = null;
	                    if (imageMovieExtensions[fileExt]) {
	                        previewUrl = url.replace(/\.[^/.]+$/, "");
	                        previewUrl = previewUrl + '.png';
	                        tag.setAttr('data-preview', previewUrl);
	                    }
	                    if (!fileExt) {
	                        previewUrl = url + '.png';
	                        tag.setAttr('data-preview', previewUrl);
	                    }
	                    console.log(url, fileExt, previewUrl);
	
	                    tag.addClass('streamlink');
	                    tag.addClass('imagelink');
	                    tag.setAttr('title', "Click to preview image " + location);
	                    tag.setTagName('a');
	
	                    var httpsUrl = url;
	
	                    if (url.match('^http://')) {
	                        url = url.replace("http://", "https://");
	                        tag.setAttr('href', url);
	                        tag.setInnerHtml(url);
	                    }
	
	                    return tag;
	                } else if (url.indexOf('hitbox.tv/') !== -1) {
	                location = LadderLinker.getLastUrlPart(url);
	
	                tag.addClass('streamlink');
	                tag.setAttr('title', "Open embeded hitbox stream - " + location);
	                tag.setTagName('a');
	                tag.setAttr('data-literal', 'h~' + location);
	
	                return tag;
	            } else if (parsed.host.indexOf('twitch.tv') !== -1) {
	                location = LadderLinker.getLastUrlPart(url);
	
	                tag.addClass('streamlink');
	                tag.setAttr('title', "Open embeded twitch stream - " + location);
	                tag.setTagName('a');
	                tag.setAttr('data-literal', 't~' + location);
	
	                return tag;
	            } else if (parsed.host.indexOf('youtu.be') !== -1 && parsed.path) {
	                location = LadderLinker.parseYoutubeVideoId(parsed.path);
	                if (!location) {
	                    return;
	                }
	                tag.addClass('streamlink');
	                tag.addClass('youtubelink');
	                tag.setAttr('title', "Open embeded youtube video - " + location.id);
	                tag.setTagName('a');
	                tag.setAttr('data-literal', 'y~' + location.id);
	                tag.setAttr('data-id', location.id);
	                tag.setAttr('data-params', decodeURI(location.params));
	
	                return tag;
	            } else if (parsed.host.indexOf('youtube.com') !== -1 && parsed.path == '/watch') {
	                location = LadderLinker.parseYoutubeVideoId(url);
	                if (!location) {
	                    return;
	                }
	
	                tag.addClass('streamlink');
	                tag.addClass('youtubelink');
	                tag.setAttr('title', "Open embeded youtube video - " + location.id);
	                tag.setTagName('a');
	                tag.setAttr('data-literal', 'y~' + location.id);
	                tag.setAttr('data-id', location.id);
	                tag.setAttr('data-params', decodeURI(location.params));
	
	                return tag;
	            } else if (url.indexOf('smashladder') !== -1 && url.indexOf('/netplay/') !== -1) {
	                location = LadderLinker.getLastUrlPart(url);
	
	                tag.addClass('chatlink');
	                tag.setAttr('title', "Open chat room " + location);
	                tag.setTagName('a');
	                tag.setAttr('data-chatlink', decodeURIComponent(location));
	
	                return tag;
	            } else if (url.indexOf('www.amazon.com/') !== -1 || url.indexOf('http://amazon.com/') !== -1 || url.indexOf('amzn.com/') !== -1) {
	
	                // tag.setAttr('href',LadderLinker.addParameter(url,'tag','matchmake-20'));
	            } else {
	                    tag.addClass('rawlink');
	                }
	
	            return tag;
	        case 'hashtag':
	            location = match.getHashtag();
	
	            if (/^#[0-9A-F]{6}$/i.test(location)) {
	                tag.addClass('hexcode');
	                tag.setTagName('span');
	                tag.setAttr('href', '');
	                tag.setAttr('target', '');
	                return tag;
	            }
	
	            tag.addClass('chatlink');
	            tag.setAttr('title', "Open chat room " + location);
	            tag.setAttr('href', siteUrl + '/netplay/' + location);
	            tag.setTagName('a');
	            tag.setAttr('data-chatlink', location);
	
	            return tag;
	        case 'email':
	            tag.addClass('emaillink');
	            return tag;
	        case 'twitter':
	            var twitterHandle = match.getTwitterHandle();
	            var lowercaseHandle = twitterHandle.toLowerCase();
	            var user = _matchmaking.Users.retrieveByUsername(lowercaseHandle);
	
	            window.Users = _matchmaking.Users;
	            tag.addClass(user.cssUsername().join(' '));
	            var textShadowStyle = user.getTextShadowStyle();
	            if (textShadowStyle) {
	                tag.setAttr('style', 'text-shadow: ' + user.getTextShadowStyle());
	            }
	
	            tag.setAttr('href', siteUrl + '/player/' + twitterHandle);
	            tag.setAttr('data-username', twitterHandle);
	
	            if (autolinker.usernameFoundCallback && !autolinker.usernameFoundCallback.users) {
	                autolinker.usernameFoundCallback.users = {};
	            }
	            if (autolinker.usernameFoundCallback && !autolinker.usernameFoundCallback.users[lowercaseHandle]) {
	                autolinker.usernameFoundCallback.users[lowercaseHandle] = true;
	                autolinker.usernameFoundCallback(lowercaseHandle);
	            }
	            return tag;
	    }
	    return tag;
	};
	
	LadderLinker.getLastUrlPart = function (str) {
	    var split = str.split('/');
	    var test = split.pop();
	    if (test) {
	        return test;
	    } else {
	        return split.pop();
	    }
	};
	LadderLinker.addParameter = function (url, param, value) {
	    var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
	        parts = url.toString().split('#'),
	        url = parts[0],
	        hash = parts[1];
	    var qstring = /\?.+$/,
	        newURL = url;
	
	    // Check if the parameter exists
	    if (val.test(url)) {
	        // if it does, replace it, using the captured group
	        // to determine & or ? at the beginning
	        newURL = url.replace(val, '$1' + param + '=' + value);
	    } else if (qstring.test(url)) {
	        // otherwise, if there is a query string at all
	        // add the param to the end of it
	        newURL = url + '&' + param + '=' + value;
	    } else {
	        // if there's no query string, add one
	        newURL = url + '?' + param + '=' + value;
	    }
	
	    if (hash) {
	        newURL += '#' + hash;
	    }
	
	    return newURL;
	};
	
	LadderLinker.parse_url = function (str, component) {
	    //       discuss at: http://phpjs.org/functions/parse_url/
	    //      original by: Steven Levithan (http://blog.stevenlevithan.com)
	    // reimplemented by: Brett Zamir (http://brett-zamir.me)
	    //         input by: Lorenzo Pisani
	    //         input by: Tony
	    //      improved by: Brett Zamir (http://brett-zamir.me)
	    //             note: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	    //             note: blog post at http://blog.stevenlevithan.com/archives/parseuri
	    //             note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	    //             note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
	    //             note: a seriously malformed URL.
	    //             note: Besides function name, is essentially the same as parseUri as well as our allowing
	    //             note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
	    //        example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
	    //        returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
	    //        example 2: parse_url('http://en.wikipedia.org/wiki/%22@%22_%28album%29');
	    //        returns 2: {scheme: 'http', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
	    //        example 3: parse_url('https://host.domain.tld/a@b.c/folder')
	    //        returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
	    //        example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar');
	    //        returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder', query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }
	
	    var query;
	    var mode = 'php';
	    var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'];
	    var parser = {
	        php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
	        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
	        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
	    };
	
	    var m = parser[mode].exec(str);
	    var uri = {};
	    var i = 14;
	
	    while (i--) {
	        if (m[i]) {
	            uri[key[i]] = m[i];
	        }
	    }
	
	    if (component) {
	        return uri[component.replace('PHP_URL_', '').toLowerCase()];
	    }
	
	    if (mode !== 'php') {
	        var name = ini['phpjs.parse_url.queryKey'] && ini['phpjs.parse_url.queryKey'].local_value || 'queryKey';
	        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
	        uri[name] = {};
	        query = uri[key[12]] || '';
	        query.replace(parser, function ($0, $1, $2) {
	            if ($1) {
	                uri[name][$1] = $2;
	            }
	        });
	    }
	
	    delete uri.source;
	    return uri;
	};
	LadderLinker.parseYoutubeVideoId = function (url) {
	    var video_id;
	    if (url.indexOf('v=') !== -1) {
	        video_id = url.split('v=').pop();
	    } else {
	        video_id = LadderLinker.getLastUrlPart(url);
	    }
	    var ampersandPosition = video_id.indexOf('&');
	    if (ampersandPosition == -1) {
	        ampersandPosition = video_id.indexOf('?');
	    }
	
	    var params = video_id.substring(ampersandPosition, video_id.length);
	    if (ampersandPosition != -1) {
	        video_id = video_id.substring(0, ampersandPosition);
	    }
	    if (!video_id) {
	        return null;
	    }
	    return {
	        id: video_id,
	        params: params
	    };
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.array_flip = array_flip;
	function array_flip(trans) {
	    var key,
	        tmp_ar = {};
	
	    for (key in trans) {
	        if (trans.hasOwnProperty(key)) {
	            tmp_ar[trans[key]] = key;
	        }
	    }
	
	    return tmp_ar;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UserInfo = undefined;
	
	var _Popups = __webpack_require__(43);
	
	var _ElementUpdate = __webpack_require__(37);
	
	var _DateFormat = __webpack_require__(38);
	
	var _LadderDistance = __webpack_require__(14);
	
	var _ChatActions = __webpack_require__(4);
	
	var _Dashboard = __webpack_require__(5);
	
	var _SiteLinker = __webpack_require__(44);
	
	var _Html = __webpack_require__(27);
	
	var _UserlistElement = __webpack_require__(18);
	
	var _League = __webpack_require__(16);
	
	var _Character = __webpack_require__(2);
	
	var _Match = __webpack_require__(23);
	
	var _Infraction = __webpack_require__(48);
	
	var UserInfo = exports.UserInfo = function UserInfo(infoContainer) {
	    this.infoContainer = infoContainer;
	    this.currentUser = null;
	    this.currentData = {};
	};
	UserInfo.prototype.updateContainer = function (user, contextData) {
	    var infoContainer = this.infoContainer;
	    this.currentUser = user;
	    this.currentData = contextData;
	
	    infoContainer.data('user', user);
	
	    this.updateGames();
	
	    infoContainer.findCache('.report_user').data('context', {
	        player_id: user.id,
	        chat_room_id: contextData.chat_room_id,
	        message_id: contextData.message_id,
	        match_id: contextData.match_id
	    });
	
	    if (user.local_time) {
	        infoContainer.findCache('.local_time').text(user.local_time);
	    }
	    if (user.username) {
	        infoContainer.find('.flairy_holder, .ceo-flair').remove();
	        var myUsernameElements = infoContainer.findCache('.username').not('.other_username').not('.exempt');
	
	        user.updateUserElements(myUsernameElements);
	        myUsernameElements.text(user.getStyledUsername());
	        _ElementUpdate.ElementUpdate.flair(myUsernameElements, user);
	    }
	
	    if (user.has_dolphin_launcher) {
	        infoContainer.addClass('has_dolphin_launcher');
	    } else {
	        infoContainer.removeClass('has_dolphin_launcher');
	    }
	    if (user.subscription_streak) {
	        infoContainer.findCache('.subscription_streak').addClass('active');
	        infoContainer.findCache('.subscription_streak .count').text(user.subscription_streak);
	        if (user.subscription_streak == 1) {
	            infoContainer.findCache('.subscription_streak .subbed_once').addClass('active');
	            infoContainer.findCache('.subscription_streak .resubbed').removeClass('active');
	        } else {
	            infoContainer.findCache('.subscription_streak .subbed_once').removeClass('active');
	            infoContainer.findCache('.subscription_streak .resubbed').addClass('active');
	        }
	    } else {
	        infoContainer.findCache('.subscription_streak').removeClass('active');
	    }
	
	    var profileLink = infoContainer.findCache('.profile_link');
	    var challengeHolder = infoContainer.findCache('.challenge_holder');
	    challengeHolder.show();
	    if (user.is_online) {
	        profileLink.findCache('.is_offline').hide();
	        profileLink.findCache('.is_online').show();
	    } else {
	        profileLink.findCache('.is_offline').show();
	        profileLink.findCache('.is_online').hide();
	        // challengeHolder.hide();
	    }
	
	    if (this.isMyInfo()) {
	        infoContainer.addClass('my_info');
	    } else {
	        infoContainer.removeClass('my_info');
	    }
	
	    var showChatControls = false;
	    if (myUser.is_mod) {
	        showChatControls = true;
	    }
	    this.populateModControls(contextData);
	    if (contextData.chat_room) {
	        showChatControls = this.populateChatRoomControls(contextData, showChatControls);
	    } else {
	        infoContainer.findCache('.chat_mod_controls').hide();
	        infoContainer.findCache('.chat_admin_controls').hide();
	    }
	
	    if (showChatControls) {
	        infoContainer.findCache('.toggle_controls').show();
	    } else {
	        infoContainer.findCache('.toggle_controls').hide();
	    }
	
	    if (user.id) {
	        infoContainer.findCache('.open_private_chat').removeClass('disabled', false).attr('href', siteUrl + '/netplay?send_message=' + user.id).findCache('button').prop('disabled', false);
	        infoContainer.findCache('.holds_player_id_data').prop('disabled', false).data('player-id', user.id);
	    } else {
	        infoContainer.findCache('.open_private_chat').addClass('disabled').attr('href', '').findCache('button').prop('disabled', true);
	        infoContainer.findCache('.holds_player_id_data').prop('disabled', true);
	    }
	
	    var userNotes = infoContainer.findCache('.user_notes');
	    if (user.notes && user.notes.length) {
	        infoContainer.findCache('.user_notes_container').add(userNotes).addClass('has_notes');
	        infoContainer.findCache('.user_notes_container .when').text(_DateFormat.DateFormat.monthDayYear(user.notes[0].time.timestamp));
	        infoContainer.findCache('.user_notes_container .the_notes').show().text(user.notes[0].content);
	    } else {
	        infoContainer.findCache('.user_notes_container').add(userNotes).removeClass('has_notes');
	        infoContainer.findCache('.user_notes_container .the_notes').hide();
	    }
	
	    if (user.member_since) {
	        infoContainer.findCache('.member_for_text').text(user.member_since.courtesy);
	        infoContainer.findCache('.member_for').show();
	    } else {
	        infoContainer.findCache('.member_for').show();
	        infoContainer.findCache('.member_for_text').text('...');
	    }
	    var distanceContainer = infoContainer.findCache('.distance_container');
	    if (user.location || user.id == myUser.id) {
	        distanceContainer.show();
	        // LadderDistance.setDescription(distanceContainer.findCache('.distance_description'),user.location,myUser.location);
	        infoContainer.findCache('.location').removeClass(Distance.getAllDistanceClasses());
	        _LadderDistance.LadderDistance.setDistanceCssClasses(infoContainer.findCache('.location'), user.location, myUser.location).text(user.location.relativeLocation());
	        infoContainer.findCache('.location_container').show();
	    } else {
	        infoContainer.findCache('.location_container').hide();
	    }
	    if (user.id == myUser.id) {
	        infoContainer.findCache('.location_edit').show();
	    } else {
	        infoContainer.findCache('.location_edit').hide();
	    }
	
	    if (ignoreList[user.id]) {
	        infoContainer.findCache('.unignore_user').show();
	        infoContainer.findCache('.ignore_user').hide();
	    } else {
	        infoContainer.findCache('.ignore_user').show();
	        infoContainer.findCache('.unignore_user').hide();
	    }
	
	    if (user.profile_url) {
	        infoContainer.findCache('.profile_link').attr('href', user.profile_url);
	    }
	
	    infoContainer.findCache('input[name=player_id]').val(user.id);
	    infoContainer.findCache('input[name=to_user_id]').val(user.id);
	
	    if (user.display_name) {
	        infoContainer.findCache('.display_name').show();
	        infoContainer.findCache('.display_name .value').text(user.display_name);
	    } else {
	        infoContainer.findCache('.display_name').hide();
	    }
	
	    var awayMessageContainer = infoContainer.findCache('.away_message');
	    awayMessageContainer.removeClass('blocked');
	    if (user.away_message) {
	        var finalText;
	        if (user.id == myUser.id) {
	            finalText = _Html.Html.encode(user.away_message);
	        } else {
	            finalText = _SiteLinker.SiteLinker.link(_Html.Html.encode(user.away_message));
	            if (user.bio_banned) {
	                awayMessageContainer.addClass('blocked');
	            }
	        }
	        awayMessageContainer.addClass('active').html(finalText);
	    } else {
	        awayMessageContainer.text('');
	        awayMessageContainer.removeClass('active');
	    }
	    if (this.isMyInfo()) {
	        if (!user.away_message.length) {
	            awayMessageContainer.addClass('active').text('[Click here to edit your status message]');
	        }
	    }
	
	    challengeHolder.data('challengeButtonOptions', _UserlistElement.UserlistElement.displayOptions.challengeButtonOptionsUserInfo);
	    _ElementUpdate.ElementUpdate.updateChallengeButtons(user, challengeHolder);
	
	    var inviteButton = challengeHolder.findCache('.invite');
	    if (inviteButton && _Dashboard.Dashboard.currentMatch && _Dashboard.Dashboard.currentMatch.matchContainer) {
	
	        var matchContainer = _Dashboard.Dashboard.currentMatch.matchContainer;
	        inviteButton.off('click').on('click', function (e) {
	            e.preventDefault();
	            var button = $(this);
	            var data = {};
	            data.player_id = user.id;
	            data.match_id = button.data('match_id');
	            var chatHolder = matchContainer.data('chatHolder');
	            $.post(siteUrl + '/chats/invite_player', data, function (response) {
	                if (response.invite && response.invite.error) {
	                    _ChatActions.ChatActions.inviteErrorMessageGenerator(user.id, response.invite, matchContainer.data('chat_container'));
	                }
	            });
	        });
	    }
	
	    if (myFriends[user.id]) {
	        infoContainer.findCache('.add_friend').hide();
	        infoContainer.findCache('.remove_friend').show();
	    } else {
	        infoContainer.findCache('.add_friend').show();
	        infoContainer.findCache('.remove_friend').hide();
	    }
	
	    // infoContainer.findCache('.matches_played').text(user.matches_played);
	    if (typeof user.total_matches_played_recently !== 'undefined') {
	        infoContainer.findCache('.friendlies_played_recently_container').show();
	        infoContainer.findCache('.friendlies_played_recently').text(user.total_matches_played_recently);
	    } else {
	        infoContainer.findCache('.friendlies_played_recently_container').hide();
	    }
	    if (typeof user.total_matches_played_recently == 'undefined' && typeof user.total_matches_played !== 'undefined') {
	        infoContainer.findCache('.friendlies_played_container').show();
	        infoContainer.findCache('.friendlies_played').text(user.total_matches_played);
	    } else {
	        infoContainer.findCache('.friendlies_played_container').hide();
	        infoContainer.findCache('.friendlies_played').text('...');
	    }
	
	    if (this.currentUser.most_recent_match) {
	        if (!this.currentUser.most_recent_match instanceof _Match.Match) {
	            this.currentUser.most_recent_match = new _Match.Match(this.currentUser.most_recent_match);
	        }
	        var historyContainer = infoContainer.findCache('.my_history_with_other');
	        historyContainer.show();
	        historyContainer.findCache('.last_play_date').text(_DateFormat.DateFormat.smart(this.currentUser.most_recent_match.start_time));
	        historyContainer.findCache('input[name=match_id]').val(this.currentUser.most_recent_match.id);
	        _ElementUpdate.ElementUpdate.updateMatchCount(this.currentUser.most_recent_match, historyContainer.findCache('.match_count'), true);
	        // historyContainer.find('.match').attr('href',siteUrl+'/match/view/'+response.most_recent_match.id);
	    } else {
	            infoContainer.findCache('.my_history_with_other').hide();
	        }
	
	    if (user.hasToxicWarning()) {
	        var infractions = _Infraction.Infraction.convert(user.reported_match_behavior, user);
	        infoContainer.addClass('standing_toxic');
	        infoContainer.findCache('.reported_match_behavior').addClass('toxic');
	        infoContainer.findCache('.has_reported_match_behavior').addClass('active');
	
	        var reportedMatchBehaviorList = infoContainer.findCache('.reported_match_behavior_list').empty();
	
	        $.each(infractions, function (i, infraction) {
	            infraction.matchSummary().appendTo(reportedMatchBehaviorList);
	        });
	    } else if (user.total_matches_played > 20 || user.total_matches_played_recently > 20) {
	        infoContainer.removeClass('standing_toxic');
	        infoContainer.findCache('.reported_match_behavior').addClass('good');
	    } else {
	        infoContainer.removeClass('standing_toxic');
	    }
	
	    var nowPlaying = infoContainer.findCache('.now_playing_container');
	    if (this.currentData.now_playing || this.currentData.now_playing === null) {
	        this.currentUser.now_playing = this.currentData.now_playing;
	    }
	    if (this.currentUser.now_playing) {
	        var match = new _Match.Match(this.currentUser.now_playing);
	        if (match.isSingles()) {
	            nowPlaying.addClass('singles');
	        } else {
	            nowPlaying.removeClass('singles');
	        }
	
	        nowPlaying.show();
	        nowPlaying.findCache('.match').attr('href', siteUrl + '/match/view/' + match.id);
	        _ElementUpdate.ElementUpdate.updateMatchCount(match, nowPlaying.findCache('.match_count'), true);
	
	        var usersContainer = nowPlaying.findCache('.with_players').empty();
	        match.setPerspectivePlayer(user);
	        var otherPlayers = match.getOtherPlayerElements();
	        if (otherPlayers) {
	            nowPlaying.findCache('.with').hide();
	            $.each(otherPlayers, function (i, player) {
	                player.appendTo(usersContainer);
	            });
	        } else {
	            nowPlaying.findCache('.with').show();
	        }
	        nowPlaying.data('match_id', match.id);
	        // nowPlaying.find('.time').text(DateFormat.small(match.start_time)).data('timestamp',match.start_time);
	    } else {
	            nowPlaying.hide();
	        }
	};
	UserInfo.prototype.isMyInfo = function () {
	    return this.currentUser === myUser;
	};
	UserInfo.prototype.loadSuccess = function () {
	    var infoContainer = this.infoContainer;
	    infoContainer.findCache('.failed_request').hide();
	};
	UserInfo.prototype.populateModControls = function (response) {
	    var user = response.user;
	    if (!user) {
	        return;
	    }
	    var infoContainer = this.infoContainer;
	    if (user.is_mod) {
	        infoContainer.findCache('.remove_as_mod').show();
	        infoContainer.findCache('.set_as_mod').hide();
	    } else {
	        infoContainer.findCache('.remove_as_mod').hide();
	        infoContainer.findCache('.set_as_mod').show();
	    }
	    if (user.is_muted) {
	        infoContainer.findCache('.mute_player').hide();
	        infoContainer.findCache('.unmute_player').show().attr('title', 'Muted until ' + _DateFormat.DateFormat.full(user.is_muted));
	    } else {
	        infoContainer.findCache('.mute_player').show();
	        infoContainer.findCache('.unmute_player').hide();
	    }
	    if (user.is_shadow_muted) {
	        infoContainer.findCache('.shadowban').hide();
	        infoContainer.findCache('.unshadowban').show();
	    } else {
	        infoContainer.findCache('.shadowban').show();
	        infoContainer.findCache('.unshadowban').hide();
	    }
	    if (user.is_link_restricted) {
	        infoContainer.findCache('.link_ban').hide();
	        infoContainer.findCache('.unlink_ban').show().attr('title', 'Link Banned until ' + _DateFormat.DateFormat.full(user.is_link_restricted));
	    } else {
	        infoContainer.findCache('.link_ban').show();
	        infoContainer.findCache('.unlink_ban').hide();
	    }
	};
	UserInfo.prototype.populateChatRoomControls = function (response, showChatControls) {
	    var infoContainer = this.infoContainer;
	    var user = response.user;
	    var current_user_room = response.chat_room.current_user_room;
	    var other_user_room = response.chat_room.other_user_room;
	    if (other_user_room && current_user_room.is_mod) {
	        showChatControls = true;
	        var modControls = infoContainer.findCache('.chat_mod_controls').show();
	        if (other_user_room.muted) {
	            modControls.findCache('.chat_mute_player').hide();
	            modControls.findCache('.chat_unmute_player').show().attr('title', 'Muted ' + _DateFormat.DateFormat.full(other_user_room.muted));
	        } else {
	            modControls.findCache('.chat_mute_player').show();
	            modControls.findCache('.chat_unmute_player').hide();
	        }
	        if (other_user_room.kicked) {
	            modControls.findCache('.kick_player').hide();
	            modControls.findCache('.unkick_player').show().attr('title', 'Kicked until ' + _DateFormat.DateFormat.full(other_user_room.kicked));
	        } else {
	            modControls.findCache('.kick_player').show();
	            modControls.findCache('.unkick_player').hide();
	        }
	        if (other_user_room.banned) {
	            modControls.findCache('.ban_player').hide();
	            modControls.findCache('.unban_player').show();
	        } else {
	            modControls.findCache('.ban_player').show();
	            modControls.findCache('.unban_player').hide();
	        }
	        if (other_user_room.hyperlinks_enabled) {
	            modControls.findCache('.chat_link_ban').show();
	            modControls.findCache('.chat_unlink_ban').hide();
	        } else {
	            modControls.findCache('.chat_link_ban').hide();
	            modControls.findCache('.chat_unlink_ban').show();
	        }
	    } else {
	        infoContainer.findCache('.chat_mod_controls').hide();
	    }
	    if (other_user_room && current_user_room.is_admin) {
	        var adminControls = infoContainer.findCache('.chat_admin_controls').show();
	        if (other_user_room.is_admin) {
	            adminControls.findCache('.remove_admin').show();
	            adminControls.findCache('.add_admin').hide();
	        } else {
	            adminControls.findCache('.remove_admin').hide();
	            adminControls.findCache('.add_admin').show();
	        }
	        if (other_user_room.is_mod) {
	            adminControls.findCache('.remove_mod').show();
	            adminControls.findCache('.add_mod').hide();
	        } else {
	            adminControls.findCache('.remove_mod').hide();
	            adminControls.findCache('.add_mod').show();
	        }
	    } else {
	        infoContainer.findCache('.chat_admin_controls').hide();
	    }
	
	    if (other_user_room) {
	        infoContainer.findCache('.invite_controls').hide();
	    } else {
	        infoContainer.findCache('.invite_controls').show();
	    }
	
	    if (showChatControls) {
	        infoContainer.findCache('.cool_chat_controls').show();
	    } else {
	        infoContainer.findCache('.cool_chat_controls').hide();
	    }
	    return showChatControls;
	};
	
	UserInfo.prototype.updateGames = function () {
	    var _this = this;
	
	    var infoContainer = this.infoContainer;
	    var icons = $();
	    var user = this.currentUser;
	    var response = this.currentData;
	    if (infoContainer.findCache('.game_info_holder').data('populated') == true) {
	        return; //Prevent double population
	    }
	    if (user.ladder_information.hasLadders()) {
	        infoContainer.findCache('.game_info_holder').empty().data('populated', true);
	        var gameInfoTemplate = infoContainer.findCache('.game_info.template').clone();
	        $.each(user.ladder_information.getLaddersInOrder(), function (i, game) {
	            game.league = new _League.League(game.league);
	            var container = gameInfoTemplate.clone().removeClass('template');
	
	            container.on('click', '.extra_data', function (e) {
	                var extra = $(this);
	                if (!(user.id == myUser.id && extra.data('type') != 1 && extra.data('type') != 2)) {
	                    return;
	                }
	                e.preventDefault();
	                var data = {
	                    game_id: extra.data('game').id,
	                    field_name: extra.data('name')
	                };
	                _Dashboard.Dashboard.closeDeclickables();
	                _Popups.Popups.ajax(siteUrl + '/matchmaking/edit_game_specific_field', data, function (response, content) {
	                    var form = content.find('form');
	                    form.submit(function (e) {
	                        e.preventDefault();
	                        var data = form.serializeArray();
	                        var inputs = form.find(':input');
	                        inputs.prop('disabled', true);
	                        $.post(form.attr('action'), data).success(function (response) {
	
	                            if (response.success) {
	                                $.fancybox.close();
	                            } else {
	                                if (response.error) {
	                                    alert(response.error);
	                                } else {
	                                    alert('There was an error');
	                                }
	                            }
	                        }).fail(function () {
	                            alert('There was a server side error');
	                        }).always(function () {
	                            inputs.prop('disabled', false);
	                        });
	                    });
	                });
	            });
	            container.find('.title_value').text(game.name);
	            _ElementUpdate.ElementUpdate.league(container.find('.league'), game.league);
	
	            var characterImage;
	            var characterContainer = container.find('.characters');
	            $.each(game.characters, function (i, character) {
	                character = new _Character.Character(character);
	                characterContainer.append(character.generateElement());
	            });
	
	            var icon;
	            var gameIconContainer = container.find('.game_icon');
	            if (game.image_url) {
	                gameIconContainer.attr('src', game.image_url);
	            } else {
	                gameIconContainer.remove();
	            }
	
	            var miniTierIcon = container.find('.mini_tier_icon');
	            if (game.league.meetsRankedRequirements() && game.league && game.league.image_url) {
	                miniTierIcon.attr('src', game.league.image_url);
	            } else {
	                miniTierIcon.remove();
	            }
	            var buildsContainer = container.find('.builds');
	            container.find('.game_display').data('game', game);
	            if (game.builds && game.builds.length) {
	                var buildsTemplate = buildsContainer.find('.build.template').clone();
	                buildsTemplate.removeClass('template');
	                var hasOne = false;
	                $.each(game.builds, function (i, build) {
	                    if (!build.active) {
	                        return;
	                    }
	                    hasOne = true;
	                    var buildElement = buildsTemplate.clone();
	                    buildElement.text(build.name).attr('title', build.description);
	                    buildElement.appendTo(buildsContainer);
	                });
	                if (!hasOne) {
	                    buildsContainer.remove();
	                }
	            } else {
	                buildsContainer.remove();
	            }
	            if (game.extra) {
	                var extraDataHolder = container.find('.extra_data_holder');
	                $.each(game.extra, function (name, data) {
	                    var type = data.type;
	                    var value = data.value;
	                    var extra = container.find('.extra_data.template:first').clone().removeClass('template');
	                    extra.find('.field_name').text(name);
	                    extra.data('type', type);
	                    extra.data('name', name);
	                    extra.data('game', game);
	                    if (value) {
	                        extra.find('.field_value').removeClass('empty').text(value);
	                    } else {
	                        extra.find('.field_value').addClass('empty').text('Not Set');
	                    }
	                    if (_this.isMyInfo() && type != 1 && type != 2) {
	                        extra.addClass('editable');
	                    } else {
	                        extra.removeClass('editable');
	                    }
	                    extra.appendTo(extraDataHolder);
	                });
	            }
	            var textInfo = container.find('.text_info');
	            var selectables = container.find('.game_display');
	
	            selectables.data('content', textInfo);
	            icons = icons.add(selectables);
	
	            textInfo.detach();
	            if (user.id == myUser.id) {
	                selectables.popover({
	                    html: true,
	                    trigger: 'manual',
	                    placement: 'top'
	                });
	            } else {
	                selectables.popover({ html: true, trigger: 'manual', placement: 'top' });
	            }
	
	            //New code cannot be placed below the detach
	            container.appendTo(infoContainer.findCache('.game_info_holder'));
	        });
	    } else {}
	
	    $.each(icons, function (i, icon) {
	        icon = $(icon);
	        icon.data('holdOpen', false);
	        icon.on('click', function (e) {
	            icon.data('holdOpen', true);
	        });
	        icon.on('focus click mouseenter', function (e) {
	            if (icon.data('holdOpen') && user.id !== myUser.id) {
	                return;
	            }
	            icon.popover('show');
	            icons.not(icon).popover('hide').data('holdOpen', false);
	        });
	        icon.on('mouseleave', function (e) {
	            if (!icon.data('holdOpen')) {
	                icon.popover('hide');
	            }
	        });
	    });
	    infoContainer.data('gameIcons', icons);
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Infraction = undefined;
	
	var _Match = __webpack_require__(23);
	
	var _DateFormat = __webpack_require__(38);
	
	var Infraction = exports.Infraction = function Infraction(infraction, player) {
	    this.public_message = null;
	    this.match = null;
	    this.timestamp = null;
	    this.player = null;
	
	    if (!player) {
	        player = infraction.player;
	        delete infraction.player;
	    }
	
	    this.player = player;
	    this.setProperties(infraction);
	};
	Infraction.prototype.setProperties = function (data) {
	    for (var i in data) {
	        if (data.hasOwnProperty(i)) {
	            this[i] = data[i];
	        }
	    }
	};
	Infraction.prototype.matchSummary = function () {
	
	    if (!this.match) {}
	    if (!(this.match instanceof _Match.Match)) {
	        this.match = new _Match.Match(this.match);
	    }
	    var element = $('<div>').addClass('infraction_summary').data('match_id', this.match.id);
	    var when = $('<span>').addClass('infraction_when');
	    var description = $('<span>').addClass('infraction_public');
	
	    element.append(when).append(description);
	
	    when.text(_DateFormat.DateFormat.smart(this.timestamp));
	    description.text(this.public_message);
	
	    return element;
	};
	Infraction.convert = function (infractions, user) {
	    var list = [];
	    $.each(infractions, function (i, infraction) {
	        list.push(new Infraction(infraction, user));
	    });
	    return list;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AdvancedMatchHistory = undefined;
	
	var _Match = __webpack_require__(23);
	
	var _matchmaking = __webpack_require__(10);
	
	var AdvancedMatchHistory = exports.AdvancedMatchHistory = function AdvancedMatchHistory() {
	
	    var matchCalendar = $('#match_calendar');
	    var currentPlayerId = matchCalendar.data('player_id');
	    $('.month_display .month').click(function (e) {
	        if (e.which == 2) {
	            return true;
	        }
	        e.preventDefault();
	        var month = $(this).find('input[name=month]').val() - 1;
	        var year = $(this).find('input[name=year]').val();
	        matchCalendar.fullCalendar('gotoDate', year, month);
	    });
	    var request = null;
	    matchCalendar.fullCalendar({
	        events: function events(start, end, timezone, callback) {
	            if (request) {
	                request.abort();
	            }
	            var data = {};
	            data.start = start.unix();
	            data.end = end.unix();
	            data.calendar_history = 1;
	            var calendarContainer = $('.calendar_container');
	            calendarContainer.addClass('loading');
	            var matchList = $('.listed_matches_container');
	            var matchListBody = matchList.find('tbody');
	            matchListBody.empty();
	            request = $.post('', data, function (response) {
	                var listedFriendlies = 0;
	                var listedRanked = 0;
	                var events = response.events;
	                calendarContainer.removeClass('loading');
	                if (response.events && !response.events.length) {
	                    $('.listed_matches').hide();
	                    $('.no_results').show();
	                    $('.total_count').hide();
	                } else {
	                    $('.no_results').hide();
	                    $('.listed_matches').show();
	                    $('.total_count').show().text('(' + response.events.length + ')');
	                }
	                $.each(events, function (i, event) {
	                    var otherPlayer;
	                    event.match = new _Match.Match(event.match);
	                    event.other_player = _matchmaking.Users.create(event.other_player);
	                    var match = event.match;
	                    if (event.match.player1.id == currentPlayerId) {
	                        otherPlayer = event.match.player2;
	                    } else if (event.match.player2.id == currentPlayerId) {
	                        otherPlayer = event.match.player1;
	                    }
	
	                    if (match.is_ranked) {
	                        listedRanked++;
	                        if (otherPlayer.won) {} else {}
	                    } else {
	                        listedFriendlies++;
	                    }
	                    event.start = moment.unix(event.start);
	                    //							delete event.url;
	                    delete event.backgroundColor;
	                    delete event.textColor;
	                });
	
	                var listedResults = $('.listed_result_summary').addClass('active');
	                listedResults.find('.friendlies').find('.count').text(listedFriendlies);
	                listedResults.find('.ranked').find('.count').text(listedRanked);
	                matchList.find('.match_results').html(response.html);
	                callback(response.events);
	            }).error(function () {});
	        },
	        eventLimit: true,
	        views: {
	            agenda: {}
	        },
	        // viewRender: function(view) {
	        // var date = $('#match_calendar').fullCalendar('getDate');
	        // var year = date.getFullYear();
	        // var month = date.getMonth();
	        // var day = date.getDay();
	        //
	        // var $found = $('input[name="year/month"][value="'+year+'/'+(month+1)+'"]').closest('.month');
	        // $('.month_display .month').removeClass('selected');
	        // if($found.length)
	        // {
	        // $found.addClass('selected');
	        // }
	        // },
	        eventRender: function eventRender(event, element, view) {
	            var match = event.match;
	
	            var content = element.find('.fc-content');
	            var title = element.find('.fc-title');
	
	            title.addClass('username_formatted');
	
	            var user = event.other_player.createUsernameElement();
	            if (event.formatted_date) {
	                title.empty();
	                title.append(user).append(' ').append(event.formatted_date);
	            }
	            if (match.is_ranked) {
	                $('<img>').addClass('is_ranked_logo').attr('src', siteUrl + '/images/smash/tiers/grandsmasher.png').attr('title', 'Ranked Match').appendTo(content);
	                element.addClass('ranked');
	            } else {
	                element.addClass('unranked');
	            }
	
	            element.find('.fc-time').remove();
	            element.attr('title', event.hover);
	            element.click(function (e) {
	                e.preventDefault();
	                window.open(element.attr('href'));
	            });
	            element.addClass('game-'.match.game_slug);
	
	            var image = $('<img>').attr('src', event.game_url).addClass('calendar_logo').prependTo(content);
	            /*element.tooltip();*/
	        }
	    });
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MatchEndNotification = undefined;
	
	var _League = __webpack_require__(16);
	
	var MatchEndNotification = exports.MatchEndNotification = function MatchEndNotification(element, data) {
	    this.element = element;
	    this.data = data;
	    this.win = this.data.win;
	
	    var notification = this;
	
	    this.element.find('.promotion_text');
	    this.element.find('.placement_summary');
	
	    var from = new _League.League(this.data.from_league);
	    var to = new _League.League(this.data.to_league);
	
	    var league = this.element.find('.league');
	    league.find('.before').attr('src', from.image_url).addClass(from.getClassName());
	    league.find('.after').attr('src', to.image_url).addClass(to.getClassName());
	
	    if (this.data.games_remaining_for_league) {
	        element.find('.games_remaining').text(this.data.games_remaining_for_league);
	        element.addClass('placement');
	    } else {
	        var previousPoints;
	        if (from.name) {
	            element.find('.previous_division .division').text(from.name + ' ' + from.division);
	            previousPoints = element.find('.previous_division .points').text(from.points).data('to', null).data('from', from.points);
	        } else {
	            element.addClass('just_placed');
	            element.find('.previous_division .division').text("");
	            previousPoints = element.find('.previous_division .points').text("").data('to', null).data('from', from.points);
	        }
	
	        element.find('.current_division .division').text(to.name + ' ' + to.division);
	        var points = element.find('.current_division .points').text(to.points).data('to', to.points);
	
	        if (this.sameDivision()) {
	            points.data('from', from.points);
	            element.find('.divisions_container').addClass('skipped');
	        } else //New
	            {
	                if (this.win) {
	                    points.data('from', 0).text(0);
	                    previousPoints.data('to', 100);
	                } else {
	                    points.data('from', 100).text(100);
	                    previousPoints.data('to', 0);
	                }
	            }
	    }
	
	    if (this.win) {
	        element.addClass('win');
	    } else {
	        element.addClass('loss');
	    }
	    return this;
	};
	MatchEndNotification.prototype.sameTier = function () {
	    return this.data.difference === 0;
	};
	MatchEndNotification.prototype.sameDivision = function () {
	    return this.sameTier() && this.data.to_league.division_number == this.data.from_league.division_number;
	};
	MatchEndNotification.prototype.getContent = function () {
	    return this.element;
	};
	MatchEndNotification.prototype.start = function () {
	    var notification = this;
	    var element = notification.element;
	    var divisionContainer = notification.element.find('.divisions_container');
	    var previousPoints = element.find('.previous_division .points');
	    if (!notification.sameDivision() && previousPoints.data('from') !== null) {
	        previousPoints.countTo({
	            from: previousPoints.data('from'),
	            to: previousPoints.data('to'),
	            speed: 1000
	        });
	    }
	
	    setTimeout(function () {
	        if (!notification.sameTier()) {
	            notification.element.find('.placement_summary .league').addClass('transition');
	        }
	        divisionContainer.addClass('flipped');
	        setTimeout(function () {
	            var points = element.find('.current_division .points');
	            if (points.data('to') !== null) {
	                points.countTo({
	                    from: points.data('from'),
	                    to: points.data('to'),
	                    speed: 1500
	                });
	            }
	        }, notification.sameDivision() ? 100 : 1000);
	    }, notification.sameDivision() ? 100 : 1000);
	
	    return this;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PlayerUpdater = undefined;
	
	var _matchmaking = __webpack_require__(10);
	
	var PlayerUpdater = exports.PlayerUpdater = {
	    setPlayerToWaitingForReply: function setPlayerToWaitingForReply(playerId, match) {
	        var playerElement = PlayerUpdater.getPlayerInUserList(playerId);
	        var challenge = playerElement.find('.challenge');
	
	        if (playerId == myUser.id) {
	            updateMatchCount(match, playerElement.find('.match_count'));
	        }
	    },
	    getPlayerInUserList: function getPlayerInUserList(playerId) {
	        console.trace('when and why');
	        return $('.user_lists .online_user input[name=player_id][value=' + playerId + ']').closest('.online_user');
	    },
	    getPlayerListElementsByPlayerId: function getPlayerListElementsByPlayerId(playerId) {
	        var user = _matchmaking.Users.findById(playerId);
	
	        var userlistElements = user.getUserlistElements();
	        var elements = $();
	        $.each(userlistElements, function (i, userlistElement) {
	            if (userlistElement.element) {
	                elements = elements.add(userlistElement.element);
	            }
	        });
	        return elements;
	    }
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PostManager = undefined;
	
	var _TimeElement = __webpack_require__(53);
	
	var _UsernameElement = __webpack_require__(54);
	
	var _LadderLinker = __webpack_require__(45);
	
	var _Html = __webpack_require__(27);
	
	var _matchmaking = __webpack_require__(10);
	
	var PostManager = exports.PostManager = function PostManager(dynamicPostsGroup) {
	
	    this.dynamicPostsGroup = dynamicPostsGroup;
	    this.noPosts = dynamicPostsGroup.find('.no_posts_at_all');
	    this.topics = dynamicPostsGroup.find('.wall_posts_display');
	    this.parseTopics();
	
	    var scroller = new PostScrollLoader(dynamicPostsGroup.find('.wall_posts:first'));
	
	    var scrollUpdateCheck = function scrollUpdateCheck() {
	        var assetArea = dynamicPostsGroup.find('.wall_posts:first');
	        if (!assetArea.length || !assetArea.is(':visible')) {
	            return;
	        }
	        var assetAreaBottom = assetArea.position().top + assetArea.innerHeight();
	        var windowBottom = $(window).scrollTop() + $(window).innerHeight();
	
	        if (windowBottom + 120 >= assetAreaBottom) {
	            scroller.loadMore();
	        }
	    };
	    $(window).scroll(scrollUpdateCheck);
	
	    var dynamicPosts = dynamicPostsGroup.on('submit', '.reply_to_post', function (e) {
	        e.preventDefault();
	        var form = $(this).closest('form');
	        var data = form.serializeArray();
	        var message = form.find('textarea').val();
	        var buttons = form.find('textarea, button').prop('disabled', true);
	
	        var postIdInput = form.find('input[name=post_id]');
	        var postId = null;
	        if (postIdInput.length) {
	            postId = postIdInput.val();
	        }
	
	        data.push({ name: 'json', value: 1 });
	
	        $.post(form.attr('action'), data).done(function (response) {
	            buttons.prop('disabled', false);
	            if (response.success) {
	                var reply = new WallPostReply(response.reply);
	                if (!postId) {
	                    form.find('textarea').val('');
	                }
	                $.each(response.replies, function (i, replyData) {
	                    new WallPostReply(replyData).place();
	                });
	                reply.place();
	            } else {
	                if (response.errors && response.errors.content) {
	                    alert(response.errors.content);
	                } else {
	                    if (response.error) {
	                        alert(response.error);
	                    } else {
	                        alert('There was an error saving, sorry!');
	                    }
	                }
	            }
	        }).error(function (response) {
	            var data = JSON.parse(response.responseText);
	            if (response.status == 403 && data) {
	                alert('You may have been logged out, Sorry!');
	            } else {
	                alert('There was an error saving, sorry!');
	            }
	        });
	    }).on('click', '.delete_post', function (e) {
	        var doIt = confirm('Remove this post?');
	        if (!doIt) {
	            return false;
	        }
	        var form = $(this).closest('form');
	        var data = form.serializeArray();
	        var post = $(this).closest('.wall_post_reply');
	        if (!post.length) {
	            post = $(this).closest('.wall_post');
	        }
	        post.fadeTo('fast', .6);
	        $.post(siteUrl + '/posts/delete_post', data, function (response) {
	            if (!response.success) {
	                if (response.error) {
	                    alert(response.error);
	                } else {
	                    alert('There was an error deleting this post, please try again later');
	                }
	
	                post.fadeTo('fast', 1);
	            } else {
	                post.hide();
	            }
	        });
	    }).on('click', '.edit_post', function (e) {
	        var reply = $(this).closest('.editable-toggle');
	        if (reply.hasClass('editing')) {
	            reply.removeClass('editing');
	        } else {
	            reply.addClass('editing');
	        }
	    }).on('click', '.reply-toggle', function (e) {
	        e.preventDefault();
	        var replies = $(this).closest('.replies-list');
	        var button = $(this);
	        if (replies.hasClass('opened')) {
	            replies.removeClass('opened').addClass('closed');
	        } else {
	            var replyHolder = replies.find('.replies');
	            button.prop('disabled', true);
	            $.post(siteUrl + '/posts/get_replies', { get_replies: button.data('post_id') }, function (response) {
	                button.prop('disabled', false);
	                replies.removeClass('closed').addClass('opened');
	                if (response.success) {
	                    replyHolder.data('replies', response.replies);
	                    $.each(response.replies, function (i, replyData) {
	                        new WallPostReply(replyData).place();
	                    });
	                }
	            });
	        }
	    });
	    dynamicPosts.find('.reply_to_post .wall_post_content').elastic();
	};
	PostManager.prototype.parseTopics = function () {
	    var allReplies = this.topics.data('topics');
	    if (allReplies) {
	        if (this.noPosts.length) {
	            this.noPosts.remove();
	        }
	    }
	
	    $.each(allReplies, function (i, replyData) {
	        var helper = new WallPostReply(replyData);
	        var created = helper.place();
	
	        if (replyData.id == postOnLoadHelper.post || replyData.id == postOnLoadHelper.parent) {
	            setTimeout(function () {
	                $('body').scrollTop(created.offset().top - $('.header').height() - 20);
	                created.addClass('the_focus');
	                if (postOnLoadHelper.post != replyData.id) {
	                    created.find('.reply-toggle').not('.opened').trigger('click');
	                }
	            }, 100);
	        }
	    });
	};
	
	var PostScrollLoader = function PostScrollLoader(mainElement) {
	    var instance = this;
	    this.element = mainElement;
	    this.currentPage = 1;
	    this.itemsShown = null;
	    this.isLoadingMore = false;
	    this.loadedAll = false;
	
	    this.loadMore = function () {
	        if (this.loadedAll || this.isLoadingMore) {
	            return;
	        }
	        var loadingDiv = $('<div>').addClass('loading-more-container');
	        var loadingMoreLoader = $('<img>').attr('src', siteUrl + '/images/ajax-loader-long.gif').addClass('loading-more');
	        loadingDiv.append(loadingMoreLoader);
	        loadingDiv.appendTo(this.element);
	        this.isLoadingMore = true;
	        this.lastItem = mainElement.find('.wall_post:last');
	        this.element.addClass('loading_more');
	
	        var data = {};
	        data.last_loaded_post = this.lastItem.data('post_id');
	        $.post(siteUrl + '/posts/load_more', data, function (response) {
	            instance.isLoadingMore = false;
	            loadingDiv.remove();
	            if (response.posts && response.posts.length) {
	                $.each(response.posts, function (i, replyData) {
	                    var helper = new WallPostReply(replyData);
	                    helper.place();
	                });
	            } else {
	                instance.loadedAll = true;
	            }
	        });
	    };
	};
	var WallPostReply = function WallPostReply(data) {
	    this.data = data;
	
	    this.update = function (element) {
	        var data = this.data;
	        element.attr('id', 'site_post_' + data.id).data('post_id', data.id);
	
	        _TimeElement.TimeElement.populate(element.find('time'), data.time);
	        if (data.deleted) {
	            element.addClass('post-deleted');
	        } else {
	            element.removeClass('post-deleted');
	        }
	
	        if (data.permissions) {
	            var permissions = data.permissions;
	            if (permissions.reply) {
	                element.addClass('post-replyable');
	            }
	            if (permissions.edit) {
	                element.addClass('post-editable');
	            }
	            if (permissions.delete) {
	                element.addClass('post-deletable');
	            }
	        }
	
	        data.sender = _matchmaking.Users.update(data.sender);
	        data.sender.updateUserElements(element.find('.username'));
	        var repliesList = element.find('.replies-list');
	        if (data.parent_post_id) {
	            //                element.removeClass('wall_post_reply').addClass('wall_post');
	            repliesList.remove();
	        } else {
	            var replies = data.replies;
	            var replyToggleButton = element.find('.reply-toggle');
	            replyToggleButton.data('post_id', data.id);
	            element.find('input[name=parent_post_id]').val(data.id);
	            if (replies && replies.length || data.replies_count || true) {
	                var total = replies ? replies.length : data.replies_count;
	                replyToggleButton.find('.replies_number').text(total);
	                replyToggleButton.find('.replies_word').text(total == 1 ? 'Reply' : 'Replies');
	                if (replies) element.find('.replies').data('replies', replies);
	            } else {
	                element.find('.entries').hide();
	                repliesList.removeClass('closed').addClass('opened');
	            }
	            element.removeClass('wall_post_reply').addClass('wall_post').addClass('panel');
	        }
	        element.find('input[name=post_id]').val(data.id);
	
	        element.find('.response').html(Autolinker.link(_Html.Html.encode(data.content), _LadderLinker.LadderLinker.autolinkerOptions));
	
	        element.find('> .edit_mode textarea').text(data.content);
	        return element;
	    };
	    this.create = function () {
	        var data = this.data;
	        var template = WallPostReply.template.clone().removeClass('template');
	        this.update(template);
	        return template;
	    };
	    this.place = function () {
	        $('.no_posts_at_all').remove(); //Todo make this specific!
	        var preexisting = $('#site_post_' + this.data.id);
	        if (preexisting.length) {
	            var toggle = preexisting;
	            if (!preexisting.hasClass('editable-toggle')) toggle = preexisting.find('.editable-toggle');
	            toggle.removeClass('editing');
	            this.update(preexisting);
	            return preexisting;
	        }
	        if (this.data.parent_post_id) {
	            var parent = $('#site_post_' + this.data.parent_post_id);
	            parent.find('.entries').show();
	            created = this.create();
	            parent.closest('.wall_post').find('.replies-list .replies').append(created);
	            created.find('textarea').elastic();
	            return parent;
	        } else {
	            var created;
	            if (this.data.new) {
	                created = this.create();
	                $('.wall_posts_display .wall_posts').prepend(created);
	                created.find('textarea').elastic();
	                return created;
	            } else {
	                created = this.create();
	                $('.wall_posts_display .wall_posts').append(created);
	                created.find('textarea').elastic();
	                return created;
	            }
	        }
	    };
	};
	WallPostReply.template = $('.wall_post_reply.template');

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var TimeElement = exports.TimeElement = function TimeElement(data) {
	    this.data = data;
	    this.create = function () {
	        var template = TimeElement.template.clone().removeClass('template');
	        template.find('time');
	        return template;
	    };
	};
	TimeElement.template = $('<time>');
	TimeElement.populate = function (element, data) {
	    element.attr('title', data.full).text(data.courtesy).data('timestamp', data.timestamp);
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var UsernameElement = exports.UsernameElement = function UsernameElement(jqueryElement, user) {
	    this.user = user;
	    this.element = jqueryElement;
	};
	UsernameElement.populate = function (element, data) {
	    element.text(data.username);
	    element.attr('href', siteUrl + '/player/' + (data.id ? data.id + '/' : null) + data.username);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SocketConnection = undefined;
	
	var _ChatActions = __webpack_require__(4);
	
	var _LadderInfo = __webpack_require__(30);
	
	var _Dashboard = __webpack_require__(5);
	
	var _Settings = __webpack_require__(25);
	
	var _Ladder = __webpack_require__(26);
	
	var SocketConnection = exports.SocketConnection = function SocketConnection() {
	    var connection = null;
	    var reference = this;
	    var messageQueue = [];
	    var allStatuses = $('#connection_status').find('.status');
	    var newDisconnection = false;
	    this.authenticationFail = false;
	
	    allStatuses.each(function () {
	        var pendingImage = $('<img>').attr('src', siteUrl + '/images/ajax-loader.gif');
	        var pending = $('<span>').addClass('pending');
	        var success = $('<span>').addClass('success');
	        var fail = $('<span>').addClass('fail');
	    });
	
	    this.setStatus = function (status, changeTo) {
	        status = allStatuses.filter(status);
	        status.removeClass('success error');
	        if (changeTo == 'success') {
	            this.setStatusError(null);
	        }
	        if (changeTo) {
	            status.addClass(changeTo);
	        }
	    };
	
	    this.endConnectionState = function () {
	        _Dashboard.Dashboard.loadingDashboard.addClass('not_loading');
	    };
	    this.setStatusError = function (error) {
	        if (!_Dashboard.Dashboard.loadingDashboard) {
	            return;
	        }
	        if (error) {
	            _Dashboard.Dashboard.loadingDashboard.findCache('.server_message').addClass('active').text(error);
	        } else {
	            _Dashboard.Dashboard.loadingDashboard.findCache('.server_message').removeClass('active').empty();
	        }
	    };
	
	    this.connect = function (connectData) {
	        if (this.connection && (this.connection.readyState === 0 || this.connection.readyState === 1)) {
	            return;
	        } else {}
	
	        _Ladder.ladder.log('Attempting connection');
	        this.setStatus('.connecting-0', 'active');
	        var type = SocketConnection.types.LADDER;
	        if (!isInLadder) type = SocketConnection.types.GENERAL_PAGE;else if (typeof matchOnlyMode != 'undefined' && matchOnlyMode) type = SocketConnection.types.MATCH_ONLY_MODE;
	
	        if (!connectData) {
	            connectData = {};
	            var chatContainer = _ChatActions.ChatActions.getActiveChatContainer();
	            if (chatContainer && chatContainer.data('chat')) {
	                connectData.chat_focus_id = chatContainer.data('chat').data('chat_room_id');
	            }
	        }
	
	        if (window.isDolphin) {
	            type = SocketConnection.types.DOLPHIN;
	            connectData.session_key = isDolphin.session_id;
	            connectData.player_id = isDolphin.player_id;
	        }
	        connectData.type = type;
	        connectData.version = _LadderInfo.LadderInfo.version;
	        connectData.userlist_visible = _Dashboard.Dashboard.userlistIsVisible();
	
	        this.connection = new WebSocket(socketServerUrl + '?' + $.param(connectData));
	        this.connection.onopen = function (e) {
	            // ladder.log('Connection Established!',true);
	            reference.setStatus('.connecting-0', 'success');
	            _Dashboard.Dashboard.loadingDashboard.removeClass('chat_server_error');
	            if (reference.newDisconnection) {
	                reference.newDisconnection = false;
	                _Dashboard.Dashboard.getUserGoing();
	            }
	            //reference.send({version:LadderInfo.version});//Send current chat version!
	        };
	        this.connection.onmessage = function (e) {
	            // ladder.log('Received Socket Message');
	            if (_Dashboard.Dashboard.loadingDashboard.hasClass('active')) _Dashboard.Dashboard.loadingDashboard.removeClass('active');
	            if (!e.data) {
	                _Ladder.ladder.log('message was blank...');
	                return;
	            }
	            var message = $.parseJSON(e.data);
	            _Dashboard.Dashboard.parseGeneralData(message);
	        };
	        this.connection.onclose = function (e) {
	            reference.setStatus('.connecting-0', 'error');
	
	            _Dashboard.Dashboard.loadingDashboard.addClass('active').addClass('chat_server_error');
	
	            if (!_Dashboard.Dashboard.dashboard.data('search_disabled')) {
	                _Settings.Settings.disableAll();
	                _Dashboard.Dashboard.dashboard.data('search_disabled', true);
	                if (_Dashboard.Dashboard.matchmakingTab && _Dashboard.Dashboard.matchmakingTab.data('paneContainer')) {
	                    _Dashboard.Dashboard.gameFilters.addClass('disabled');
	                }
	            }
	
	            console.error('Connection to the chat server has been lost or rejected', true);
	
	            if (reference.authenticationFail) {
	                showConnectionIssue();
	                console.error('Could not verify user');
	                if (isInLadder) {
	                    setTimeout(function () {
	                        _Ladder.ladder.log('Attempting reconnection....', true);
	                        reference.connect();
	                    }, 5000);
	                }
	            } else {
	                showConnectionIssue();
	                reference.newDisconnection = true;
	                console.log('... attempting reconnection');
	                reference.send();
	            }
	        };
	    };
	    this.send = function (data, action, responseToActionCallback) {
	        if (!data) data = {};
	        if (this.connection.readyState == 3) //Closed or could not be opened, reattempt every 5 seconds
	            {
	                _Ladder.ladder.log('Connection failed for some reason', true);
	                setTimeout(function () {
	                    _Ladder.ladder.log('Attempting reconnection....', true);
	                    reference.connect();
	                }, isInLadder ? 15000 : 60000);
	            } else if (this.connection.readyState == 1) {
	            if (action) {
	                data.action = action;
	            }
	            this.connection.send(JSON.stringify(data));
	            var xhrLikeThing = {
	                error: function error(callback) {
	                    xhrLikeThing.onErrorCallback = callback;
	                },
	                onErrorCallback: null
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
	
	function showConnectionIssue(response) {
	    var loadingDashboard = _Dashboard.Dashboard.loadingDashboard;
	    if (response && response.logged_in == 0) {
	        window.location.href = siteUrl + '/log-in';
	    }
	    if (response && response.authentication === false) {
	        dashboard.find('input').prop('disabled', true);
	        loadingDashboard.addClass('active');
	        loadingDashboard.findCache('.bug_reort').show(0);
	        return;
	    }
	
	    loadingDashboard.addClass('active');
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _LadderHistory = __webpack_require__(33);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RankingsPage = function () {
		function RankingsPage() {
			var _this = this;
	
			_classCallCheck(this, RankingsPage);
	
			this.rankingsPage = $('#rankings_page');
			if (!this.rankingsPage.length) {
				return;
			}
			_LadderHistory.LadderHistory.history.Adapter.bind(window, 'statechange', function () {
				var state = _LadderHistory.LadderHistory.history.getState();
				var path = state.data.path;
				if (_this.resultsCache[state.url]) {
					return _this.processResults(_this.resultsCache[state.url]);
				} else {}
			});
			var requesting = false;
			var parent = this;
			this.rankingsPage.on('click', '.pagination_button', function (e) {
				parent.processPagination($(this), e);
			});
			this.resultsCache = {};
			var initialState = this.createStateFromCurrentStage();
			this.resultsCache[initialState.current_url] = initialState;
		}
	
		_createClass(RankingsPage, [{
			key: 'createStateFromCurrentStage',
			value: function createStateFromCurrentStage() {
				var _this2 = this;
	
				var data = {};
				data.current_url = this.getRankingsList().find('.rankings_content').data('current_url');
				data.elements = {};
				$.each(this.pageStateContentElements(), function (i, element) {
					data.elements[element] = _this2.rankingsPage.find(element);
				});
				data.success = true;
				return data;
			}
		}, {
			key: 'pageStateContentElements',
			value: function pageStateContentElements() {
				return ['.first_page_button', '.next_page_button', '.previous_page_button', '.rankings_content', '.pagination_links_container ul'];
			}
		}, {
			key: 'processResults',
			value: function processResults(response) {
				var _this3 = this;
	
				if (response.success) {
					this.resultsCache[response.current_url] = response;
					if (response.current_url) {
						_LadderHistory.LadderHistory.history.pushState({}, document.title, response.current_url);
					}
					var thingsToReplace = this.pageStateContentElements();
					$.each(thingsToReplace, function (i, element) {
						var current = _this3.rankingsPage.find(element);
						var replacement = response.elements[element];
						if (replacement.length) {
							current.replaceWith(replacement);
						}
					});
					this.finished();
				} else {
					this.error();
				}
			}
		}, {
			key: 'processPagination',
			value: function processPagination(clickedButton, event) {
				var _this4 = this;
	
				if (this.requesting) {
					return;
				}
				if (clickedButton.is('disabled')) {
					return;
				}
	
				event.preventDefault();
				var rankingsList = this.getRankingsList();
				var page = clickedButton.data('page');
				var url = clickedButton.attr('href');
				rankingsList.addClass('loading');
				this.requesting = true;
				if (this.resultsCache[url]) {
					this.processResults(this.resultsCache[url]);
				} else {
					$.post(url, { content_only: true }, function (response) {
						if (response.html) {
							var html = $($.trim(response.html));
							response.elements = {};
							$.each(_this4.pageStateContentElements(), function (i, element) {
								response.elements[element] = html.find(element);
							});
						}
						_this4.processResults(response);
					}, 'json').error(function (e) {
						_this4.error();
					});
				}
			}
		}, {
			key: 'getRankingsList',
			value: function getRankingsList() {
				return this.rankingsPage.find('.ranking_list_container');
			}
		}, {
			key: 'finished',
			value: function finished() {
				this.requesting = false;
				this.getRankingsList().removeClass('loading');
			}
		}, {
			key: 'error',
			value: function error() {
				this.finished();
			}
		}]);
	
		return RankingsPage;
	}();
	
	new RankingsPage();

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UserNotificationQueueItem = undefined;
	
	var _ChatActions = __webpack_require__(4);
	
	var _LadderInfo = __webpack_require__(30);
	
	var _Match = __webpack_require__(23);
	
	PNotify.prototype.options.styling = "fontawesome";
	PNotify.prototype.options.confirm.buttons = [];
	//var pNotifyStack =  {"dir1": "right", "dir2": "up", "push": "top"};
	var UserNotificationQueueItem = exports.UserNotificationQueueItem = function UserNotificationQueueItem(data) {
	    this.title = data.title;
	    this.message = $.trim(data.message);
	    this.acceptUrl = data.accept_url;
	    this.declineUrl = data.decline_url;
	    this.followUrl = data.follow_url;
	    this.type = data.type;
	    this.data = data.data;
	    var that = this;
	
	    if (data.id) {
	        if (UserNotificationQueueItem.displayedItems[data.id]) {
	            return;
	        } else {
	            UserNotificationQueueItem.displayedItems[data.id] = true;
	        }
	    } else {}
	
	    this.display = function () {
	        var notifyOptions = {
	            title: that.title,
	            text: that.message,
	            buttons: {
	                closer: true,
	                sticker: false
	            },
	            history: {
	                history: true,
	                maxonscreen: 6
	            },
	            confirm: {
	                confirm: true
	            },
	            icon: false,
	            animate_speed: 50,
	            position_animate_speed: 300,
	            insert_brs: false,
	            title_escape: true,
	            text_escape: true,
	            delay: null,
	            hide: false,
	            mobile: {
	                swipe_dismiss: true,
	                styling: true
	            }
	            //stack:pNotifyStack,
	        };
	        if (that.type == UserNotificationQueueItem.types.TYPE_CHAT_INVITE) {
	            notifyOptions.confirm = {
	                confirm: true,
	                buttons: [{
	                    text: 'Accept Invite',
	                    click: function click(notice) {
	                        notice.remove();
	                        if (that.type == UserNotificationQueueItem.types.TYPE_CHAT_INVITE) {
	                            _ChatActions.ChatActions.joinChatRoom(that.data.chat_room.name);
	                        }
	                    }
	                }, {
	                    text: 'Decline Invite',
	                    click: function click(notice, value) {
	                        $.post(that.declineUrl);
	                        notice.remove();
	                    }
	                }]
	            };
	        }
	        if (that.acceptUrl) {
	            if (that.rejectUrl) {
	                notifyOptions.confirm = {
	                    confirm: true
	                };
	            } else {
	                notifyOptions.confirm = {
	                    confirm: false
	                };
	                notifyOptions.buttons.closer = true;
	                notifyOptions.after_close = function (PNotify, timer_hide) {
	                    $.post(that.acceptUrl);
	                };
	            }
	        }
	
	        if (that.type == UserNotificationQueueItem.types.TYPE_WALL_POST || that.type == UserNotificationQueueItem.types.TYPE_BLOG_REPLY || that.type == UserNotificationQueueItem.types.TYPE_BUG_POST || that.type == UserNotificationQueueItem.types.TYPE_GROUP_POST) {
	            notifyOptions.text_escape = false;
	            notifyOptions.text = that.message;
	        }
	
	        if (that.type == UserNotificationQueueItem.types.TYPE_INFRACTION) {
	            notifyOptions.hide = false;
	        }
	        if (that.followUrl) {
	            notifyOptions.title = false;
	            notifyOptions.confirm = {
	                confirm: true,
	                buttons: [{
	                    text: 'Close',
	                    click: function click(notice, value) {
	                        notice.remove();
	                    },
	                    'addClass': 'btn-sm'
	                }]
	            };
	            notifyOptions.addclass = "clickable-notice";
	        }
	        var notice = new PNotify(notifyOptions);
	        if (that.followUrl) {
	            notice.get().click(function (e) {
	                if ($(e.target).is('.ui-pnotify-closer *, .ui-pnotify-sticker *, button, .username')) return;
	                if (isInLadder) {
	                    e.preventDefault();
	                    window.open(that.followUrl, '_blank');
	                } else {
	                    window.location(that.followUrl);
	                }
	                if (that.acceptUrl) {
	                    $.post(that.acceptUrl);
	                    notice.remove();
	                }
	            });
	        }
	    };
	};
	UserNotificationQueueItem.types = {
	    TYPE_CHAT_INVITE: 1,
	    TYPE_INFRACTION: 2,
	    TYPE_WALL_POST: 3,
	    TYPE_BLOG_REPLY: 4,
	    TYPE_BUG_POST: 5,
	    TYPE_GROUP_POST: 6,
	    TYPE_MATCH_INVITE: 7
	};
	UserNotificationQueueItem.displayedItems = {};

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PreferredGame = function () {
	    function PreferredGame(data) {
	        _classCallCheck(this, PreferredGame);
	
	        this.element = null;
	        for (var i in data) {
	            if (!data.hasOwnProperty(i)) {
	                continue;
	            }
	            this[i] = data[i];
	        }
	    }
	
	    _createClass(PreferredGame, [{
	        key: 'getElement',
	        value: function getElement() {
	            if (this.element) {
	                return this.element;
	            }
	            this.element = PreferredGame.template.clone().attr('id', 'preferred_game_filter_' + this.id);
	
	            this.element.attr('title', 'Start Matchmaking for ' + this.name);
	            this.element.data('enabled', this.filtered_on ? 1 : 0);
	            this.element.data('game-short-name', this.slug);
	            this.element.attr('data-order_by', this.order_by);
	            this.element.data('preferred_distance_matters', this.preferred_distance_matters);
	            this.element.data('id', this.id);
	            if (this.filtered_on) {
	                this.element.addClass('on');
	            } else {
	                this.element.removeClass('on');
	            }
	            this.element.find('.filter_image').attr('src', this.small_game_filter_image_url);
	            this.element.data('object', this);
	            return this.element;
	        }
	    }]);
	
	    return PreferredGame;
	}();
	
	PreferredGame.template = $('#preferred_game_filter_template').detach().attr('id', '');
	PreferredGame.initEvents = function () {
	    var preferredGamesContainer = $('.preferred_games');
	    if (!preferredGamesContainer.length) {
	        return;
	    }
	
	    preferredGamesContainer.on('click', '.game', function (e) {
	        var target = $(e.target);
	        if (target.hasClass('game_selection') || target.hasClass('description') || target.hasClass('game_selection') || target.closest('label').length || target.closest('.description').length) {
	            return;
	        }
	        $(this).find('.game_selection').trigger('click');
	    }).on('change', '.game_selection', function (e) {
	        if ($(this).is(':checked')) {
	            $(this).closest('.game').addClass('active');
	        } else {
	            $(this).closest('.game').removeClass('active');
	        }
	    });
	
	    preferredGamesContainer.find('.game_selection').each(function (i, checkbox) {
	        $(this).trigger('change');
	    });
	};
	
	PreferredGame.initEvents();
	exports.PreferredGame = PreferredGame;

/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ScrollPosition = ScrollPosition;
	function ScrollPosition(node) {
	    this.node = node;
	    this.previousScrollHeightMinusTop = 0;
	    this.readyFor = 'up';
	}
	
	ScrollPosition.prototype.restore = function () {
	    if (this.readyFor === 'up') {
	        this.node.scrollTop = this.node.scrollHeight - this.previousScrollHeightMinusTop;
	    }
	
	    // 'down' doesn't need to be special cased unless the
	    // content was flowing upwards, which would only happen
	    // if the container is position: absolute, bottom: 0 for
	    // a Facebook messages effect
	};
	
	ScrollPosition.prototype.prepareFor = function (direction) {
	    this.readyFor = direction || 'up';
	    this.previousScrollHeightMinusTop = this.node.scrollHeight - this.node.scrollTop;
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var StringHelpers = exports.StringHelpers = {
	
	    split: function split(val) {
	        return val.split(/@\s*/);
	    },
	
	    extractLast: function extractLast(term) {
	        return StringHelpers.split(term).pop();
	    }
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./AdvancedMatchHistory": 49,
		"./AdvancedMatchHistory.jsx": 49,
		"./BrowserNotification": 24,
		"./BrowserNotification.jsx": 24,
		"./ChatActions": 4,
		"./ChatActions.jsx": 4,
		"./Chat_Room": 62,
		"./Chat_Room.jsx": 62,
		"./Dashboard": 5,
		"./Dashboard.jsx": 5,
		"./DateFormat": 38,
		"./DateFormat.jsx": 38,
		"./DisplayUpdater": 6,
		"./DisplayUpdater.jsx": 6,
		"./Distance": 63,
		"./Distance.jsx": 63,
		"./ElementUpdate": 37,
		"./ElementUpdate.jsx": 37,
		"./FlairManager": 64,
		"./FlairManager.jsx": 64,
		"./GameInfoHelper": 41,
		"./GameInfoHelper.jsx": 41,
		"./GoogleAnalytics": 65,
		"./GoogleAnalytics.jsx": 65,
		"./Html": 27,
		"./Html.jsx": 27,
		"./Ladder": 26,
		"./Ladder.jsx": 26,
		"./LadderDistance": 14,
		"./LadderDistance.jsx": 14,
		"./LadderHistory": 33,
		"./LadderHistory.jsx": 33,
		"./LadderInfo": 30,
		"./LadderInfo.jsx": 30,
		"./LadderLinker": 45,
		"./LadderLinker.jsx": 45,
		"./Ladder_Information": 15,
		"./Ladder_Information.jsx": 15,
		"./MatchEndNotification": 50,
		"./MatchEndNotification.jsx": 50,
		"./MatchSounds": 29,
		"./MatchSounds.jsx": 29,
		"./MatchmakingPopup": 42,
		"./MatchmakingPopup.jsx": 42,
		"./PingAverage": 66,
		"./PingAverage.jsx": 66,
		"./PlayerUpdater": 51,
		"./PlayerUpdater.jsx": 51,
		"./Populate": 40,
		"./Populate.jsx": 40,
		"./Popups": 43,
		"./Popups.jsx": 43,
		"./PostManager": 52,
		"./PostManager.jsx": 52,
		"./PrivateChatLoader": 9,
		"./PrivateChatLoader.jsx": 9,
		"./Rankings": 56,
		"./Rankings.jsx": 56,
		"./Request": 7,
		"./Request.jsx": 7,
		"./ScrollPosition": 59,
		"./ScrollPosition.jsx": 59,
		"./ServerMessageController": 8,
		"./ServerMessageController.jsx": 8,
		"./Settings": 25,
		"./Settings.jsx": 25,
		"./SiteLinker": 44,
		"./SiteLinker.jsx": 44,
		"./SocketConnection": 55,
		"./SocketConnection.jsx": 55,
		"./StringHelpers": 60,
		"./StringHelpers.jsx": 60,
		"./TimeElement": 53,
		"./TimeElement.jsx": 53,
		"./Timer": 31,
		"./Timer.jsx": 31,
		"./TokensManager": 28,
		"./TokensManager.jsx": 28,
		"./UserInfo": 47,
		"./UserInfo.jsx": 47,
		"./UserNotificationQueueItem": 57,
		"./UserNotificationQueueItem.jsx": 57,
		"./User_Chat_Rooms": 17,
		"./User_Chat_Rooms.jsx": 17
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 61;


/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var User_Chat_Rooms = exports.User_Chat_Rooms = function User_Chat_Rooms(data) {
		if (typeof data === 'undefined') {
			return;
		}
		this.setProperties(data);
		return this;
	};
	User_Chat_Rooms.prototype.setProperties = function (data) {
		var i;
		for (i in data) {
			if (data.hasOwnProperty(i)) {
				this[i] = data[i];
			}
		}
	};
	User_Chat_Rooms.prototype.makeChatTab = function () {
		console.log(this);
	};
	User_Chat_Rooms.prototype.chatTabExists = function (chatRoomId) {
		return this[chatRoomId] && this[chatRoomId].is_chat_admin;
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Popups = __webpack_require__(43);
	
	$(function () {
	
	    $('.group-select').on('click', '.upload_to_folder', function (e) {
	        e.preventDefault();
	        var data = {};
	        data.folder_id = $(this).data('folder_id');
	        data.upload_to_folder = 1;
	        _Popups.Popups.ajax(siteUrl + '/mod/flair-manager', data, function () {});
	    });
	
	    $('.flair_detail').on('submit', '.flair_update_container', function (e) {
	        e.preventDefault();
	        var loading = $(this).find('.loading');
	        loading.show();
	        var data = $(this).serializeArray();
	        $.post('', data, function (response) {
	            loading.hide();
	            if (response.error) {
	                alert('error saving');
	            }
	        }).error(function () {
	            loading.hide();
	        });
	    });
	
	    var gameGroupSortableOptions = {
	        tolerance: "pointer",
	        items: ".sortable_folder",
	        connectWith: '.game_group',
	        placeholder: 'sortable-placeholder sortable_folder',
	        start: function start(e, ui) {
	            ui.placeholder.height(ui.item.height());
	
	            ui.placeholder.attr('class', ui.item.attr('class'));
	            ui.placeholder.addClass('sortable-placeholder sortable_folder');
	        },
	        update: function update(e, ui) {
	            if (this !== ui.item.parent()[0]) {
	                return;
	            }
	            var list = $(ui.item).closest('.game_group');
	            var elements = list.find('.sortable_folder').not('.template');
	            var ids = [];
	            elements.each(function () {
	                var element = $(this);
	                var chat = element.data('folder_id');
	                ids.push(chat);
	            });
	            var gameId = list.data('game_id');
	            var data = { game_id: gameId, folder_ids: ids, save_folder_order: 1 };
	            $.post(siteUrl + '/mod/flair-manager', data, function (response) {});
	        }
	    };
	    var folderGroupSortableOptions = {
	        tolerance: "pointer",
	        items: ".flair_groupable",
	        connectWith: ".folder_group",
	        placeholder: 'sortable-placeholder flair_groupable',
	        start: function start(e, ui) {
	            ui.placeholder.height(ui.item.height());
	        },
	        update: function update(e, ui) {
	            if (this !== ui.item.parent()[0]) {
	                return;
	            }
	            var list = $(ui.item).closest('.folder_group');
	            var elements = list.find('.flair_groupable').not('.template');
	            var ids = [];
	            elements.each(function () {
	                var element = $(this);
	                var chat = element.data('flair_id');
	                ids.push(chat);
	            });
	            var folderId = list.data('folder_id');
	            var data = { folder_id: folderId, flair_ids: ids, save_flair_order: 1 };
	            $.post(siteUrl + '/mod/flair-manager', data, function (response) {});
	        }
	    };
	
	    $('.group-select').on('click', '.flair_groupable', function () {
	        var button = $(this);
	        var detail = $('.flair_detail');
	
	        detail.find('input[name=flair_id]').val(button.data('flair_id'));
	        var data = {};
	        data.flair_id = button.data('flair_id');
	        data.load_flair_preview_thingy = 1;
	        detail.show('fast');
	        detail.addClass('loading');
	        detail.empty();
	        _Popups.Popups.ajax(siteUrl + '/mod/flair-manager', data, function () {});
	        return;
	    });
	
	    $('.group-select').on('click', '.folder_title', function (e) {
	        var folderId = $(this).closest('.sortable_folder').data('folder_id');
	        var title = $(this).find('input[name=text]').val();
	        var titleArea = $(this);
	
	        var others = $('.folder_title').not($(this));
	        others.removeClass('active');
	        $('.new_upload_form').find('.folder_helper').text(title);
	        $('.new_upload_form input[name=flair_folder_id]').val(folderId);
	    });
	
	    $('.group-select').on('click', '.edit_folder_button', function (e) {
	        var folder = $(this).closest('.sortable_folder');
	        var selected = $('.sortable_folder').not(folder);
	        selected.addClass('viewing');
	        folder.removeClass('viewing');
	    });
	
	    $('.group-select').on('submit', '.change_name_form', function (e) {
	        var folder = $(this).closest('.sortable_folder');
	        e.preventDefault();
	        var data = $(this).serializeArray();
	        var form = $(this);
	        form.addClass('spinner');
	        form.find(':input').prop('disabled', true);
	        var finished = function finished() {
	            form.find(':input').prop('disabled', false);
	            form.removeClass('spinner');
	            folder.addClass('viewing');
	            folder.find('.group_name').text(form.find('input[name=text]').val());
	        };
	        $.post('', data, function (response) {
	            if (!response.success) {
	                alert('error saving!');
	            }
	            finished();
	        }).error(function () {
	            finished();
	        });
	    });
	    $('.group-select').on('change', 'input[name=folder_enabled]', function (e) {
	        var form = $(this).closest('form');
	        var data = form.serializeArray();
	
	        var button = $(this);
	        button.addClass('spinner');
	        var finished = function finished() {
	            var group = button.closest('.sortable_folder');
	            console.log(group);
	            button.removeClass('spinner');
	            if (button.is(':checked')) {
	                group.addClass('enabled');
	            } else {
	                group.removeClass('enabled');
	            }
	        };
	        $.post('', data, function (response) {
	            if (!response.success) {
	                alert('error saving!');
	            }
	            finished();
	        }).error(function (e) {
	            finished();
	        });
	    });
	
	    $('.group-select .game_group_select').change(function (e) {
	        var select = $(this);
	        var groupSelect = $(this).closest('.group-select');
	        var gameId = select.val();
	        var groupArea = select.closest('.group-select').find('.group_flairs');
	        var data = {};
	        data.game_id = gameId;
	        data.load_game_flair_list = 1;
	        groupArea.empty();
	        if (!gameId) {
	            return null;
	        }
	        groupSelect.addClass('loading');
	        $.post('', data, function (response) {
	            groupSelect.removeClass('loading');
	            var gameFlairs = $(response.html);
	
	            groupArea.empty();
	            gameFlairs.appendTo(groupArea);
	
	            $('.game_group').sortable(gameGroupSortableOptions);
	            $('.folder_group').sortable(folderGroupSortableOptions);
	        }).error(function () {
	            groupSelect.removeClass('loading');
	            alert('Server errro! On No!');
	        });
	    });
	
	    $('.group-select').on('submit', '.add_new_folders_form', function (e) {
	        e.preventDefault();
	        var data = $(this).serializeArray();
	        var form = $(this);
	        $.post('', data, function (response) {
	            if (response.success) {
	                form.closest('.group-select').find('.game_group_select').trigger('change');
	            }
	        });
	    });
	});
	
	$('.flair_detail').on('click', '.delete', function () {
	    return confirm('Remove Flair?');
	});

/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var GoogleAnalytics = exports.GoogleAnalytics = {};

/***/ },
/* 66 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.PingAverage = PingAverage;
	function PingAverage() {
	    var pingList = [];
	    var pingAverage = null;
	    var pingListSize = 10;
	    var actualAverage = null;
	    var that = this;
	    this.getAverage = function () {
	        return actualAverage;
	    };
	    this.add = function (amount) {
	        var total = 0;
	        pingList.push(amount);
	        if (pingList.length > 10) {
	            pingList.shift();
	        }
	        for (var i = 0; i < pingList.length; i++) {
	            total += pingList[i];
	        }
	        if (total > 0) {
	            actualAverage = total / pingList.length;
	        } else {
	            actualAverage = 0;
	        }
	        return that;
	    };
	}

/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';
	
	window.messageServiceWorker = function (data) {
	    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
	        return new Promise(function (resolve, reject) {
	            // Create a Message Channel
	            var msg_chan = new MessageChannel();
	
	            // Handler for recieving message reply from service worker
	            msg_chan.port1.onmessage = function (event) {
	                if (event.data.error) {
	                    reject(event.data.error);
	                } else {
	                    resolve(event.data);
	                }
	            };
	
	            navigator.serviceWorker.controller.postMessage(JSON.parse(JSON.stringify(data)), [msg_chan.port2]);
	        });
	    }
	    return Promise.resolve('Service Workers Not Supported');
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _LadderHistory = __webpack_require__(33);
	
	var _matchmaking = __webpack_require__(10);
	
	var _Html = __webpack_require__(27);
	
	var _PostManager = __webpack_require__(52);
	
	var _LadderLinker = __webpack_require__(45);
	
	var _BrowserNotification = __webpack_require__(24);
	
	$.fn.elastic = function () {
	    if (this.hasClass('elasticfied')) {
	        return this;
	    }
	    this.addClass('elasticfied');
	    // return $this;
	    return this.textareaAutoSize();
	    // return $this.each(function(){
	    //     $.textareaAutoSize();
	    // });
	};
	
	_BrowserNotification.BrowserNotification.messageServiceWorker = window.messageServiceWorker;
	
	window.copyToClipboard = function (text) {
	    var helper = $('#clipboard_helper').text(text);
	    var clipboard = new Clipboard(helper[0], {
	        text: function text(trigger) {
	            return helper.text();
	        }
	    }).on('success', function (e) {
	        alert('Copied ' + text + ' to your clipboard');
	    }).on('error', function () {
	        alert('Failed to copy to your clipboard');
	    });
	    helper.trigger('click');
	    clipboard.destroy();
	};
	
	window.Bugs = {};
	Bugs.dynamicActivated = false;
	Bugs.activateDynamicClosing = function () {
	    if (Bugs.dynamicActivated) {
	        return;
	    }
	    Bugs.dynamicActivated = true;
	    $('.bug_list').on('change', 'input[type=checkbox]', function (e) {
	        var checkbox = $(this);
	        var row = checkbox.closest('.bug_row');
	        var container = checkbox.closest('div');
	        var bugId = checkbox.closest('.bug_row').data('bug_id');
	        var value = checkbox.is(':checked') ? 1 : 0;
	        var checkboxName = checkbox.attr('name');
	        var statusButton = row.find('.status button');
	
	        container.addClass('spinner');
	        var data = {
	            bug_id: bugId
	        };
	        data[checkboxName] = value;
	        var isChangingStatus = function isChangingStatus() {
	            return checkboxName == 'fixed';
	        };
	        if (isChangingStatus()) {
	            statusButton.prop('disabled', true);
	        }
	        $.post(siteUrl + '/bugs/update_bug', data, function (response) {
	            container.removeClass('spinner');
	            if (isChangingStatus()) {
	                statusButton.prop('disabled', false);
	            }
	            if (response.bug) {
	                if (response.bug.fixed) {
	                    row.find('.status').removeClass('open').addClass('closed');
	                } else {
	                    row.find('.status').addClass('open').removeClass('closed');
	                }
	            }
	        }).error(function () {
	            container.removeClass('spinner');
	            if (isChangingStatus()) {
	                statusButton.prop('disabled', false);
	            }
	            alert('there was an error');
	        });
	    }).on('click', '.status', function () {
	        $(this).closest('.bug_row').find('.fixed').find('input').trigger('click');
	    });
	    $('.bug_list').find('.description').siteLinker();
	};
	
	$('.match_history_container').on('submit', '.flag_forms form', function (e) {
	    e.preventDefault();
	    var values = $(this).serializeArray();
	    var form = $(this);
	    var other = $(this).closest('.flag_forms').find('form').not(form);
	    form.find(':input').prop('disabled', true);
	    var reset = function reset() {
	        form.find(':input').prop('disabled', false);
	    };
	    $.post($(this).attr('action'), values, function (response) {
	        if (response.success) {
	            other.addClass('active');
	            form.removeClass('active');
	        }
	        if (response.error) {
	            alert(response.error);
	        }
	        reset();
	    }).error(function () {
	        alert('Error!');
	        reset();
	    });
	}).on('submit', '.flag_confirm_forms form', function (e) {
	    e.preventDefault();
	    var values = $(this).serializeArray();
	    var form = $(this);
	    var other = $(this).closest('.flag_confirm_forms').find('form').not(form);
	    form.find(':input').prop('disabled', true);
	    var reset = function reset() {
	        form.find(':input').prop('disabled', false);
	    };
	    $.post($(this).attr('action'), values, function (response) {
	        if (response.success) {
	            other.addClass('active');
	            form.removeClass('active');
	        }
	        if (response.error) {
	            alert(response.error);
	        }
	        reset();
	    }).error(function () {
	        alert('Error!');
	        reset();
	    });
	});
	
	(function ($) {
	    var loadMoreElements = [];
	    var windowScrollEvent = false;
	    var activateOnce = function activateOnce() {
	        if (windowScrollEvent) {
	            return;
	        }
	        windowScrollEvent = true;
	
	        $(window).on('scroll', function () {
	            if (!loadMoreElements.length) {
	                return;
	            }
	            var window = $(this);
	            loadMoreElements = $.grep(loadMoreElements, function (item, i) {
	                console.log(loadMoreElements);
	                if (!item.length) {
	                    return false;
	                }
	                try {
	                    if (window.scrollTop() + window.innerHeight() >= item.offset().top + item.outerHeight() - 160) {
	                        item.trigger('loadMore');
	                    }
	                } catch (error) {
	                    return false;
	                }
	                return true;
	            });
	        });
	    };
	
	    $.fn.loadMoreable = function (options) {
	        activateOnce();
	        var table = $(this);
	        if (table.data('loadMoreable')) {
	            table.data('loadingMore', false);
	            return false; // Already done
	        }
	        if (!options) {
	            options = {};
	        }
	        if (options.loadMoreTable) {
	            table.data('load_more_table', options.loadMoreTable);
	        }
	        if (options.parent) {
	            options.parent.on('scroll', function () {
	                var window = $(this);
	                if (options.parent.scrollTop() + options.parent.innerHeight() >= table.position().top + table.outerHeight() - 160) {
	                    table.trigger('loadMore');
	                }
	            });
	        } else {
	            loadMoreElements.push($(this));
	        }
	        table.data('loadMoreable', true);
	        table.on('loadMore', function () {
	            var loadMoreUrl;
	            if (table.data('loadingMore')) {
	                return;
	            }
	            table.data('loadingMore', true);
	
	            if (table.data('load_more_url')) {
	                loadMoreUrl = table.data('load_more_url');
	            } else {
	                var last = table.find('.load_more:last');
	                if (last.length) {
	                    loadMoreUrl = last.attr('href');
	                }
	            }
	            var reset = function reset() {
	                table.data('loadingMore', false);
	            };
	            if (!loadMoreUrl) {
	                return;
	            }
	            $.post(loadMoreUrl).done(function (response) {
	                if (response.success) {
	                    if (response.html) {
	                        var html = $($.trim(response.html));
	                        var newTable;
	                        if (html.is(table.data('load_more_table'))) {
	                            newTable = html;
	                        } else {
	                            newTable = html.find(table.data('load_more_table'));
	                        }
	                        if (!newTable.length) {
	                            //Something broke
	                            return;
	                        }
	                        var newLoadMoreUrl = newTable.data('load_more_url');
	                        table.attr('data-load_more_url', newLoadMoreUrl).data('load_more_url', newLoadMoreUrl);
	
	                        var appendData = html.find(table.data('load_more_data_elements'));
	                        table.append(appendData);
	                        reset();
	                    }
	                }
	            }).error(function () {
	                reset();
	            });
	        });
	    };
	})(jQuery);
	
	$.fn.bindWithDelay = function (type, data, fn, timeout, throttle) {
	
	    if ($.isFunction(data)) {
	        throttle = timeout;
	        timeout = fn;
	        fn = data;
	        data = undefined;
	    }
	
	    // Allow delayed function to be removed with fn in unbind function
	    fn.guid = fn.guid || $.guid && $.guid++;
	
	    // Bind each separately so that each element has its own delay
	    return this.each(function () {
	
	        var wait = null;
	
	        function cb() {
	            var e = $.extend(true, {}, arguments[0]);
	            var ctx = this;
	            var throttler = function throttler() {
	                wait = null;
	                fn.apply(ctx, [e]);
	            };
	
	            if (!throttle) {
	                clearTimeout(wait);wait = null;
	            }
	            if (!wait) {
	                wait = setTimeout(throttler, timeout);
	            }
	        }
	
	        cb.guid = fn.guid;
	
	        $(this).bind(type, data, cb);
	    });
	};
	
	$.fn.serializeObject = function () {
	    var data = {};
	    $.each(this.serializeArray(), function (key, obj) {
	        var a = obj.name.match(/(.*?)\[(.*?)\]/);
	        if (a !== null) {
	            var subName = new String(a[1]);
	            var subKey = new String(a[2]);
	            if (!data[subName]) data[subName] = {};
	            if (data[subName][subKey]) {
	                if ($.isArray(data[subName][subKey])) {
	                    data[subName][subKey].push(obj.value);
	                } else {
	                    data[subName][subKey] = {};
	                    data[subName][subKey].push(obj.value);
	                }
	            } else {
	                data[subName][subKey] = obj.value;
	            }
	        } else {
	            var keyName = new String(obj.name);
	            if (data[keyName]) {
	                if ($.isArray(data[keyName])) {
	                    data[keyName].push(obj.value);
	                } else {
	                    data[keyName] = {};
	                    data[keyName].push(obj.value);
	                }
	            } else {
	                data[keyName] = obj.value;
	            }
	        }
	    });
	    return data;
	};
	
	$.fn.inlineEditable = function () {
	    var all = $(this);
	    return all.each(function () {
	        var inlineEditable = $(this);
	        if (inlineEditable.data('inline-editable')) {
	            return;
	        } else {
	            inlineEditable.data('inline-editable', true);
	        }
	        inlineEditable.find('.edit-button').click(function () {
	            var container = $(this).closest('.inline-editable');
	            container.addClass('editing');
	        });
	        inlineEditable.find('.cancel_button').click(function () {
	            var container = $(this).closest('.inline-editable');
	            container.removeClass('editing');
	        });
	        inlineEditable.find('textarea').elastic();
	
	        inlineEditable.find('form').submit(function (e) {
	            e.preventDefault();
	            var form = $(this);
	            var url = $(this).attr('action');
	            var data = $(this).serializeArrayCsrf();
	            data.push({ name: 'ajax', value: 1 });
	            form.addClass('spinner');
	            $.post(url, data, function (response) {
	                if (response.success) {
	                    var container = form.closest('.inline-editable');
	                    container.removeClass('editing');
	                    container.find('.displayed-value').text(response.value);
	                    form.trigger('inline-edit-success', [response]);
	                } else {
	                    if (response.error) {
	                        alert(response.error);
	                    } else {
	                        alert('There was an error saving...');
	                    }
	                }
	                form.removeClass('spinner');
	            });
	        });
	    });
	};
	$(function () {
	    $('#header_inbox_bar').click(function (e) {
	        $(this).find('.badge').empty();
	    });
	    $('#header_notification_bar').on('click', function (e) {
	        if ($(this).hasClass('open')) {
	            return;
	        }
	        var data = { notification_id: 'all' };
	        $.post(siteUrl + '/read_notifications', data, function (response) {
	            if (response.success) {
	                var unreadCount = response.unread;
	                $('#header_notification_bar').trigger('updateUnreadCount', [response.unread]);
	            }
	        });
	    });
	
	    $('#header_notification_bar').on('updateUnreadCount', function (e, count) {
	        var badge = $(this).find('.badge');
	        $(this).find('.new_notifications_count .count').text(count);
	        badge.text(count);
	        badge.show();
	        if (count === 0) {
	            badge.hide();
	        }
	    });
	
	    $('#header_notification_bar .dropdown-toggle').on('click', function (e) {
	        $(this).find('.badge').hide();
	    });
	
	    $('.inline-editable').inlineEditable();
	
	    $('.rename-user').submit(function (e) {
	        return confirm('Do Rename!?');
	    });
	
	    $('.require-email-validation-form').submit(function (e) {
	        if ($(this).data('warning')) {
	            return confirm($(this).data('warning'));
	        } else {
	            return confirm('Shadow Infract on New Accounts?');
	        }
	    });
	    $('.ban-user-form button').button(function (e) {
	        var result = confirm('Ban?');
	        if (!result) e.preventDefault();
	        return result;
	    });
	
	    $('.search_dropdown_button.disabled').click(function (e) {
	        $('.search_dropdown').find('input[name=search]').focus();
	    });
	
	    $('.ban-user-button, .rank-ban-user-button').click(function (e) {
	        var url = siteUrl + '/player/ban_user_popup';
	        var userId = $(this).data('player_id');
	        e.preventDefault();
	        var data = {
	            type: 'ajax',
	            ajax: {
	                url: url,
	                type: 'POST',
	                data: {
	                    title: $(this).data('title'),
	                    player_id: userId,
	                    field: $(this).data('field')
	                }
	
	            }
	        };
	        $.fancybox(data);
	    });
	
	    $('.wall_posts').on('click', '.delete', function (e) {
	        var result = confirm('Delete Wall Post?');
	        return result;
	    });
	
	    $('.remove_tournament').on('click', '.delete', function (e) {
	        var result = confirm('Remove Tournament?');
	        return result;
	    });
	
	    $('.blog_replies').on('click', '.delete', function (e) {
	        var result = confirm('Delete Message?');
	        return result;
	    });
	
	    $('.user_input,.autolinked').each(function () {
	        var input = $(this);
	        var result = Autolinker.link(input.html(), _LadderLinker.LadderLinker.autolinkerOptions);
	        input.html(result);
	    });
	});
	
	(function ($) {
	    $.fn.serializeArrayCsrf = function () {
	        var csrf = { name: theSecretField, value: theSecret };
	        var value = $(this).serializeArray();
	        value.push(csrf);
	        return value;
	    };
	
	    $.fn.countTo = function (options) {
	        // merge the default plugin settings with the custom options
	        options = $.extend({}, $.fn.countTo.defaults, options || {});
	
	        // how many times to update the value, and how much to increment the value on each update
	        var loops = Math.ceil(options.speed / options.refreshInterval),
	            increment = (options.to - options.from) / loops;
	
	        return $(this).each(function () {
	            var _this = this,
	                loopCount = 0,
	                value = options.from,
	                interval = setInterval(updateTimer, options.refreshInterval);
	
	            function updateTimer() {
	                value += increment;
	                loopCount++;
	                $(_this).html(value.toFixed(options.decimals));
	
	                if (typeof options.onUpdate == 'function') {
	                    options.onUpdate.call(_this, value);
	                }
	
	                if (loopCount >= loops) {
	                    clearInterval(interval);
	                    value = options.to;
	
	                    if (typeof options.onComplete == 'function') {
	                        options.onComplete.call(_this, value);
	                    }
	                }
	            }
	        });
	    };
	
	    $.fn.countTo.defaults = {
	        from: 0, // the number the element should start at
	        to: 100, // the number the element should end at
	        speed: 1000, // how long it should take to count between the target numbers
	        refreshInterval: 100, // how often the element should be updated
	        decimals: 0, // the number of decimal places to show
	        onUpdate: null, // callback method for every time the element is updated,
	        onComplete: null // callback method for when the element finishes updating
	    };
	})(jQuery);
	
	var SiteEditor = {
	    changeTimeout: null,
	    editorSettings: {
	        mode: "none",
	        plugins: "image, autolink, link, anchor, code, lists, advlist, textcolor, colorpicker, autoresize, fullscreen",
	        browser_spellcheck: true,
	        gecko_spellcheck: true,
	        image_advtab: true,
	        tools: 'inserttable, image, code, preview',
	        toolbar1: "undo redo | link image | styleselect | bold italic underline | forecolor backcolor | bullist numlist outdent indent ",
	        autoresize_max_height: 500,
	        content_css: siteCssFiles,
	        relative_urls: false,
	        entity_encoding: "raw",
	        add_unload_trigger: false,
	        remove_linebreaks: false,
	        inline_styles: false,
	        convert_fonts_to_spans: false,
	        setup: function setup(editor) {
	            var changeTimeoutFunction = function changeTimeoutFunction() {
	                if (SiteEditor.changeTimeout) {
	                    clearTimeout(SiteEditor.changeTimeout);
	                }
	                SiteEditor.changeTimeout = setTimeout(function () {
	                    $(editor.getElement()).trigger('NodeChange');
	                }, 10000);
	            };
	            editor.on('NodeChange', function (e) {
	                changeTimeoutFunction();
	            }).on('change', function () {
	                changeTimeoutFunction();
	            });
	        }
	    },
	    setEditors: function setEditors($elements) {
	        $elements.each(function (i, editor) {
	            var $editor = $(editor);
	            $editor.tinymce(SiteEditor.editorSettings);
	        });
	    }
	
	};
	SiteEditor.setEditors($('.post-editor'));
	
	var Script = function () {
	    //    sidebar toggle
	
	    $('.tooltips').tooltip();
	    $('.popovers').popover();
	}();
	
	$(function () {
	
	    $.each($('.dynamic-posts'), function (i, topic) {
	        new _PostManager.PostManager($(topic));
	    });
	});
	
	/*!
	 * jQuery Textarea AutoSize plugin
	 * Author: Javier Julio
	 * Licensed under the MIT license
	 */
	;(function ($, window, document, undefined) {
	
	    var pluginName = "textareaAutoSize";
	    var pluginDataName = "plugin_" + pluginName;
	
	    var containsText = function containsText(value) {
	        return value.replace(/\s/g, '').length > 0;
	    };
	
	    function Plugin(element, options) {
	        this.element = element;
	        this.$element = $(element);
	        this.init();
	    }
	
	    Plugin.prototype = {
	        init: function init() {
	            var diff = parseInt(this.$element.css('paddingBottom')) + parseInt(this.$element.css('paddingTop')) + parseInt(this.$element.css('borderTopWidth')) + parseInt(this.$element.css('borderBottomWidth')) || 0;
	
	            if (containsText(this.element.value)) {
	                this.$element.height(this.element.scrollHeight - diff);
	            }
	
	            // keyup is required for IE to properly reset height when deleting text
	            this.$element.on('input keyup', function (event) {
	                var $window = $(window);
	                var currentScrollPosition = $window.scrollTop();
	
	                $(this).height(0).height(this.scrollHeight - diff);
	
	                $window.scrollTop(currentScrollPosition);
	            });
	        }
	    };
	
	    $.fn[pluginName] = function (options) {
	        this.each(function () {
	            if (!$.data(this, pluginDataName)) {
	                $.data(this, pluginDataName, new Plugin(this, options));
	            }
	        });
	        return this;
	    };
	})(jQuery, window, document);

/***/ },
/* 69 */
/***/ function(module, exports) {

	"use strict";
	
	/* ========================================================================
	 * bootstrap-switch - v3.3.2
	 * http://www.bootstrap-switch.org
	 * ========================================================================
	 * Copyright 2012-2013 Mattia Larentis
	 *
	 * ========================================================================
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ========================================================================
	 */
	
	(function () {
	  var t = [].slice;!function (e, i) {
	    "use strict";
	    var n;return n = function () {
	      function t(t, i) {
	        null == i && (i = {}), this.$element = e(t), this.options = e.extend({}, e.fn.bootstrapSwitch.defaults, { state: this.$element.is(":checked"), size: this.$element.data("size"), animate: this.$element.data("animate"), disabled: this.$element.is(":disabled"), readonly: this.$element.is("[readonly]"), indeterminate: this.$element.data("indeterminate"), inverse: this.$element.data("inverse"), radioAllOff: this.$element.data("radio-all-off"), onColor: this.$element.data("on-color"), offColor: this.$element.data("off-color"), onText: this.$element.data("on-text"), offText: this.$element.data("off-text"), labelText: this.$element.data("label-text"), handleWidth: this.$element.data("handle-width"), labelWidth: this.$element.data("label-width"), baseClass: this.$element.data("base-class"), wrapperClass: this.$element.data("wrapper-class") }, i), this.prevOptions = {}, this.$wrapper = e("<div>", { "class": function (t) {
	            return function () {
	              var e;return e = ["" + t.options.baseClass].concat(t._getClasses(t.options.wrapperClass)), e.push(t.options.state ? t.options.baseClass + "-on" : t.options.baseClass + "-off"), null != t.options.size && e.push(t.options.baseClass + "-" + t.options.size), t.options.disabled && e.push(t.options.baseClass + "-disabled"), t.options.readonly && e.push(t.options.baseClass + "-readonly"), t.options.indeterminate && e.push(t.options.baseClass + "-indeterminate"), t.options.inverse && e.push(t.options.baseClass + "-inverse"), t.$element.attr("id") && e.push(t.options.baseClass + "-id-" + t.$element.attr("id")), e.join(" ");
	            };
	          }(this)() }), this.$container = e("<div>", { "class": this.options.baseClass + "-container" }), this.$on = e("<span>", { html: this.options.onText, "class": this.options.baseClass + "-handle-on " + this.options.baseClass + "-" + this.options.onColor }), this.$off = e("<span>", { html: this.options.offText, "class": this.options.baseClass + "-handle-off " + this.options.baseClass + "-" + this.options.offColor }), this.$label = e("<span>", { html: this.options.labelText, "class": this.options.baseClass + "-label" }), this.$element.on("init.bootstrapSwitch", function (e) {
	          return function () {
	            return e.options.onInit.apply(t, arguments);
	          };
	        }(this)), this.$element.on("switchChange.bootstrapSwitch", function (i) {
	          return function (n) {
	            return !1 === i.options.onSwitchChange.apply(t, arguments) ? i.$element.is(":radio") ? e("[name='" + i.$element.attr("name") + "']").trigger("previousState.bootstrapSwitch", !0) : i.$element.trigger("previousState.bootstrapSwitch", !0) : void 0;
	          };
	        }(this)), this.$container = this.$element.wrap(this.$container).parent(), this.$wrapper = this.$container.wrap(this.$wrapper).parent(), this.$element.before(this.options.inverse ? this.$off : this.$on).before(this.$label).before(this.options.inverse ? this.$on : this.$off), this.options.indeterminate && this.$element.prop("indeterminate", !0), this._init(), this._elementHandlers(), this._handleHandlers(), this._labelHandlers(), this._formHandler(), this._externalLabelHandler(), this.$element.trigger("init.bootstrapSwitch", this.options.state);
	      }return t.prototype._constructor = t, t.prototype.setPrevOptions = function () {
	        return this.prevOptions = e.extend(!0, {}, this.options);
	      }, t.prototype.state = function (t, i) {
	        return "undefined" == typeof t ? this.options.state : this.options.disabled || this.options.readonly ? this.$element : this.options.state && !this.options.radioAllOff && this.$element.is(":radio") ? this.$element : (this.$element.is(":radio") ? e("[name='" + this.$element.attr("name") + "']").trigger("setPreviousOptions.bootstrapSwitch") : this.$element.trigger("setPreviousOptions.bootstrapSwitch"), this.options.indeterminate && this.indeterminate(!1), t = !!t, this.$element.prop("checked", t).trigger("change.bootstrapSwitch", i), this.$element);
	      }, t.prototype.toggleState = function (t) {
	        return this.options.disabled || this.options.readonly ? this.$element : this.options.indeterminate ? (this.indeterminate(!1), this.state(!0)) : this.$element.prop("checked", !this.options.state).trigger("change.bootstrapSwitch", t);
	      }, t.prototype.size = function (t) {
	        return "undefined" == typeof t ? this.options.size : (null != this.options.size && this.$wrapper.removeClass(this.options.baseClass + "-" + this.options.size), t && this.$wrapper.addClass(this.options.baseClass + "-" + t), this._width(), this._containerPosition(), this.options.size = t, this.$element);
	      }, t.prototype.animate = function (t) {
	        return "undefined" == typeof t ? this.options.animate : (t = !!t, t === this.options.animate ? this.$element : this.toggleAnimate());
	      }, t.prototype.toggleAnimate = function () {
	        return this.options.animate = !this.options.animate, this.$wrapper.toggleClass(this.options.baseClass + "-animate"), this.$element;
	      }, t.prototype.disabled = function (t) {
	        return "undefined" == typeof t ? this.options.disabled : (t = !!t, t === this.options.disabled ? this.$element : this.toggleDisabled());
	      }, t.prototype.toggleDisabled = function () {
	        return this.options.disabled = !this.options.disabled, this.$element.prop("disabled", this.options.disabled), this.$wrapper.toggleClass(this.options.baseClass + "-disabled"), this.$element;
	      }, t.prototype.readonly = function (t) {
	        return "undefined" == typeof t ? this.options.readonly : (t = !!t, t === this.options.readonly ? this.$element : this.toggleReadonly());
	      }, t.prototype.toggleReadonly = function () {
	        return this.options.readonly = !this.options.readonly, this.$element.prop("readonly", this.options.readonly), this.$wrapper.toggleClass(this.options.baseClass + "-readonly"), this.$element;
	      }, t.prototype.indeterminate = function (t) {
	        return "undefined" == typeof t ? this.options.indeterminate : (t = !!t, t === this.options.indeterminate ? this.$element : this.toggleIndeterminate());
	      }, t.prototype.toggleIndeterminate = function () {
	        return this.options.indeterminate = !this.options.indeterminate, this.$element.prop("indeterminate", this.options.indeterminate), this.$wrapper.toggleClass(this.options.baseClass + "-indeterminate"), this._containerPosition(), this.$element;
	      }, t.prototype.inverse = function (t) {
	        return "undefined" == typeof t ? this.options.inverse : (t = !!t, t === this.options.inverse ? this.$element : this.toggleInverse());
	      }, t.prototype.toggleInverse = function () {
	        var t, e;return this.$wrapper.toggleClass(this.options.baseClass + "-inverse"), e = this.$on.clone(!0), t = this.$off.clone(!0), this.$on.replaceWith(t), this.$off.replaceWith(e), this.$on = t, this.$off = e, this.options.inverse = !this.options.inverse, this.$element;
	      }, t.prototype.onColor = function (t) {
	        var e;return e = this.options.onColor, "undefined" == typeof t ? e : (null != e && this.$on.removeClass(this.options.baseClass + "-" + e), this.$on.addClass(this.options.baseClass + "-" + t), this.options.onColor = t, this.$element);
	      }, t.prototype.offColor = function (t) {
	        var e;return e = this.options.offColor, "undefined" == typeof t ? e : (null != e && this.$off.removeClass(this.options.baseClass + "-" + e), this.$off.addClass(this.options.baseClass + "-" + t), this.options.offColor = t, this.$element);
	      }, t.prototype.onText = function (t) {
	        return "undefined" == typeof t ? this.options.onText : (this.$on.html(t), this._width(), this._containerPosition(), this.options.onText = t, this.$element);
	      }, t.prototype.offText = function (t) {
	        return "undefined" == typeof t ? this.options.offText : (this.$off.html(t), this._width(), this._containerPosition(), this.options.offText = t, this.$element);
	      }, t.prototype.labelText = function (t) {
	        return "undefined" == typeof t ? this.options.labelText : (this.$label.html(t), this._width(), this.options.labelText = t, this.$element);
	      }, t.prototype.handleWidth = function (t) {
	        return "undefined" == typeof t ? this.options.handleWidth : (this.options.handleWidth = t, this._width(), this._containerPosition(), this.$element);
	      }, t.prototype.labelWidth = function (t) {
	        return "undefined" == typeof t ? this.options.labelWidth : (this.options.labelWidth = t, this._width(), this._containerPosition(), this.$element);
	      }, t.prototype.baseClass = function (t) {
	        return this.options.baseClass;
	      }, t.prototype.wrapperClass = function (t) {
	        return "undefined" == typeof t ? this.options.wrapperClass : (t || (t = e.fn.bootstrapSwitch.defaults.wrapperClass), this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(" ")), this.$wrapper.addClass(this._getClasses(t).join(" ")), this.options.wrapperClass = t, this.$element);
	      }, t.prototype.radioAllOff = function (t) {
	        return "undefined" == typeof t ? this.options.radioAllOff : (t = !!t, t === this.options.radioAllOff ? this.$element : (this.options.radioAllOff = t, this.$element));
	      }, t.prototype.onInit = function (t) {
	        return "undefined" == typeof t ? this.options.onInit : (t || (t = e.fn.bootstrapSwitch.defaults.onInit), this.options.onInit = t, this.$element);
	      }, t.prototype.onSwitchChange = function (t) {
	        return "undefined" == typeof t ? this.options.onSwitchChange : (t || (t = e.fn.bootstrapSwitch.defaults.onSwitchChange), this.options.onSwitchChange = t, this.$element);
	      }, t.prototype.destroy = function () {
	        var t;return t = this.$element.closest("form"), t.length && t.off("reset.bootstrapSwitch").removeData("bootstrap-switch"), this.$container.children().not(this.$element).remove(), this.$element.unwrap().unwrap().off(".bootstrapSwitch").removeData("bootstrap-switch"), this.$element;
	      }, t.prototype._width = function () {
	        var t, e;return t = this.$on.add(this.$off), t.add(this.$label).css("width", ""), e = "auto" === this.options.handleWidth ? Math.max(this.$on.width(), this.$off.width()) : this.options.handleWidth, t.width(e), this.$label.width(function (t) {
	          return function (i, n) {
	            return "auto" !== t.options.labelWidth ? t.options.labelWidth : e > n ? e : n;
	          };
	        }(this)), this._handleWidth = this.$on.outerWidth(), this._labelWidth = this.$label.outerWidth(), this.$container.width(2 * this._handleWidth + this._labelWidth), this.$wrapper.width(this._handleWidth + this._labelWidth);
	      }, t.prototype._containerPosition = function (t, e) {
	        return null == t && (t = this.options.state), this.$container.css("margin-left", function (e) {
	          return function () {
	            var i;return i = [0, "-" + e._handleWidth + "px"], e.options.indeterminate ? "-" + e._handleWidth / 2 + "px" : t ? e.options.inverse ? i[1] : i[0] : e.options.inverse ? i[0] : i[1];
	          };
	        }(this)), e ? setTimeout(function () {
	          return e();
	        }, 50) : void 0;
	      }, t.prototype._init = function () {
	        var t, e;return t = function (t) {
	          return function () {
	            return t.setPrevOptions(), t._width(), t._containerPosition(null, function () {
	              return t.options.animate ? t.$wrapper.addClass(t.options.baseClass + "-animate") : void 0;
	            });
	          };
	        }(this), this.$wrapper.is(":visible") ? t() : e = i.setInterval(function (n) {
	          return function () {
	            return n.$wrapper.is(":visible") ? (t(), i.clearInterval(e)) : void 0;
	          };
	        }(this), 50);
	      }, t.prototype._elementHandlers = function () {
	        return this.$element.on({ "setPreviousOptions.bootstrapSwitch": function (t) {
	            return function (e) {
	              return t.setPrevOptions();
	            };
	          }(this), "previousState.bootstrapSwitch": function (t) {
	            return function (e) {
	              return t.options = t.prevOptions, t.options.indeterminate && t.$wrapper.addClass(t.options.baseClass + "-indeterminate"), t.$element.prop("checked", t.options.state).trigger("change.bootstrapSwitch", !0);
	            };
	          }(this), "change.bootstrapSwitch": function (t) {
	            return function (i, n) {
	              var o;return i.preventDefault(), i.stopImmediatePropagation(), o = t.$element.is(":checked"), t._containerPosition(o), o !== t.options.state ? (t.options.state = o, t.$wrapper.toggleClass(t.options.baseClass + "-off").toggleClass(t.options.baseClass + "-on"), n ? void 0 : (t.$element.is(":radio") && e("[name='" + t.$element.attr("name") + "']").not(t.$element).prop("checked", !1).trigger("change.bootstrapSwitch", !0), t.$element.trigger("switchChange.bootstrapSwitch", [o]))) : void 0;
	            };
	          }(this), "focus.bootstrapSwitch": function (t) {
	            return function (e) {
	              return e.preventDefault(), t.$wrapper.addClass(t.options.baseClass + "-focused");
	            };
	          }(this), "blur.bootstrapSwitch": function (t) {
	            return function (e) {
	              return e.preventDefault(), t.$wrapper.removeClass(t.options.baseClass + "-focused");
	            };
	          }(this), "keydown.bootstrapSwitch": function (t) {
	            return function (e) {
	              if (e.which && !t.options.disabled && !t.options.readonly) switch (e.which) {case 37:
	                  return e.preventDefault(), e.stopImmediatePropagation(), t.state(!1);case 39:
	                  return e.preventDefault(), e.stopImmediatePropagation(), t.state(!0);}
	            };
	          }(this) });
	      }, t.prototype._handleHandlers = function () {
	        return this.$on.on("click.bootstrapSwitch", function (t) {
	          return function (e) {
	            return e.preventDefault(), e.stopPropagation(), t.state(!1), t.$element.trigger("focus.bootstrapSwitch");
	          };
	        }(this)), this.$off.on("click.bootstrapSwitch", function (t) {
	          return function (e) {
	            return e.preventDefault(), e.stopPropagation(), t.state(!0), t.$element.trigger("focus.bootstrapSwitch");
	          };
	        }(this));
	      }, t.prototype._labelHandlers = function () {
	        return this.$label.on({ click: function click(t) {
	            return t.stopPropagation();
	          }, "mousedown.bootstrapSwitch touchstart.bootstrapSwitch": function (t) {
	            return function (e) {
	              return t._dragStart || t.options.disabled || t.options.readonly ? void 0 : (e.preventDefault(), e.stopPropagation(), t._dragStart = (e.pageX || e.originalEvent.touches[0].pageX) - parseInt(t.$container.css("margin-left"), 10), t.options.animate && t.$wrapper.removeClass(t.options.baseClass + "-animate"), t.$element.trigger("focus.bootstrapSwitch"));
	            };
	          }(this), "mousemove.bootstrapSwitch touchmove.bootstrapSwitch": function (t) {
	            return function (e) {
	              var i;if (null != t._dragStart && (e.preventDefault(), i = (e.pageX || e.originalEvent.touches[0].pageX) - t._dragStart, !(i < -t._handleWidth || i > 0))) return t._dragEnd = i, t.$container.css("margin-left", t._dragEnd + "px");
	            };
	          }(this), "mouseup.bootstrapSwitch touchend.bootstrapSwitch": function (t) {
	            return function (e) {
	              var i;if (t._dragStart) return e.preventDefault(), t.options.animate && t.$wrapper.addClass(t.options.baseClass + "-animate"), t._dragEnd ? (i = t._dragEnd > -(t._handleWidth / 2), t._dragEnd = !1, t.state(t.options.inverse ? !i : i)) : t.state(!t.options.state), t._dragStart = !1;
	            };
	          }(this), "mouseleave.bootstrapSwitch": function (t) {
	            return function (e) {
	              return t.$label.trigger("mouseup.bootstrapSwitch");
	            };
	          }(this) });
	      }, t.prototype._externalLabelHandler = function () {
	        var t;return t = this.$element.closest("label"), t.on("click", function (e) {
	          return function (i) {
	            return i.preventDefault(), i.stopImmediatePropagation(), i.target === t[0] ? e.toggleState() : void 0;
	          };
	        }(this));
	      }, t.prototype._formHandler = function () {
	        var t;return t = this.$element.closest("form"), t.data("bootstrap-switch") ? void 0 : t.on("reset.bootstrapSwitch", function () {
	          return i.setTimeout(function () {
	            return t.find("input").filter(function () {
	              return e(this).data("bootstrap-switch");
	            }).each(function () {
	              return e(this).bootstrapSwitch("state", this.checked);
	            });
	          }, 1);
	        }).data("bootstrap-switch", !0);
	      }, t.prototype._getClasses = function (t) {
	        var i, n, o, s;if (!e.isArray(t)) return [this.options.baseClass + "-" + t];for (n = [], o = 0, s = t.length; s > o; o++) {
	          i = t[o], n.push(this.options.baseClass + "-" + i);
	        }return n;
	      }, t;
	    }(), e.fn.bootstrapSwitch = function () {
	      var i, o, s;return o = arguments[0], i = 2 <= arguments.length ? t.call(arguments, 1) : [], s = this, this.each(function () {
	        var t, a;return t = e(this), a = t.data("bootstrap-switch"), a || t.data("bootstrap-switch", a = new n(this, o)), "string" == typeof o ? s = a[o].apply(a, i) : void 0;
	      }), s;
	    }, e.fn.bootstrapSwitch.Constructor = n, e.fn.bootstrapSwitch.defaults = { state: !0, size: null, animate: !0, disabled: !1, readonly: !1, indeterminate: !1, inverse: !1, radioAllOff: !1, onColor: "primary", offColor: "default", onText: "ON", offText: "OFF", labelText: "&nbsp;", handleWidth: "auto", labelWidth: "auto", baseClass: "bootstrap-switch", wrapperClass: "wrapper", onInit: function onInit() {}, onSwitchChange: function onSwitchChange() {} };
	  }(window.jQuery, window);
	}).call(undefined);

/***/ },
/* 70 */
/***/ function(module, exports) {

	"use strict";
	
	/*
	 * JavaScript Emotify - v0.6 - 11/17/2009
	 * http://benalman.com/projects/javascript-emotify/
	 *
	 * Copyright (c) 2009 "Cowboy" Ben Alman
	 * Dual licensed under the MIT and GPL licenses.
	 * http://benalman.com/about/license/
	 */
	window.emotify = function () {
	  var a,
	      b,
	      c = {},
	      d = [];a = function a(e, f) {
	    f = f || function (h, j, g, i) {
	      j = (j + ", " + g).replace(/"/g, "&quot;").replace(/</g, "&lt;");return '<img src="' + h + '" title="' + j + '" alt="" class="smiley"/>';
	    };return e.replace(b, function (j, g, m) {
	      var k = 0,
	          h = m,
	          l = c[m];if (!l) {
	        while (k < d.length && !d[k].regexp.test(m)) {
	          k++;
	        }h = d[k].name;l = c[h];
	      }return l ? g + f(l[0], l[1], h, m) : j;
	    });
	  };a.emoticons = function () {
	    var l = Array.prototype.slice.call(arguments),
	        n = typeof l[0] === "string" ? l.shift() : "",
	        f = typeof l[0] === "boolean" ? l.shift() : false,
	        g = l[0],
	        k,
	        j = [],
	        m,
	        h,
	        o;if (g) {
	      if (f) {
	        c = {};d = [];
	      }for (k in g) {
	        c[k] = g[k];c[k][0] = n + c[k][0];
	      }for (k in c) {
	        if (c[k].length > 2) {
	          m = c[k].slice(2).concat(k);h = m.length;while (h--) {
	            m[h] = m[h].replace(/(\W)/g, "\\$1");
	          }o = m.join("|");d.push({ name: k, regexp: new RegExp("^" + o + "$") });
	        } else {
	          o = k.replace(/(\W)/g, "\\$1");
	        }j.push(o);
	      }b = new RegExp("(^|\\s)(" + j.join("|") + ")(?=(?:$|\\s))", "g");
	    }return c;
	  };return a;
	}();

/***/ },
/* 71 */
/***/ function(module, exports) {

	'use strict';
	
	/*!
	 * jQuery Cookie Plugin v1.4.1
	 * https://github.com/carhartl/jquery-cookie
	 *
	 * Copyright 2006, 2014 Klaus Hartl
	 * Released under the MIT license
	 */
	(function (factory) {})(function ($) {
	
	    var pluses = /\+/g;
	
	    function encode(s) {
	        return config.raw ? s : encodeURIComponent(s);
	    }
	
	    function decode(s) {
	        return config.raw ? s : decodeURIComponent(s);
	    }
	
	    function stringifyCookieValue(value) {
	        return encode(config.json ? JSON.stringify(value) : String(value));
	    }
	
	    function parseCookieValue(s) {
	        if (s.indexOf('"') === 0) {
	            // This is a quoted cookie as according to RFC2068, unescape...
	            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	        }
	
	        try {
	            // Replace server-side written pluses with spaces.
	            // If we can't decode the cookie, ignore it, it's unusable.
	            // If we can't parse the cookie, ignore it, it's unusable.
	            s = decodeURIComponent(s.replace(pluses, ' '));
	            return config.json ? JSON.parse(s) : s;
	        } catch (e) {}
	    }
	
	    function read(s, converter) {
	        var value = config.raw ? s : parseCookieValue(s);
	        return $.isFunction(converter) ? converter(value) : value;
	    }
	
	    var config = $.cookie = function (key, value, options) {
	
	        // Write
	
	        if (arguments.length > 1 && !$.isFunction(value)) {
	            options = $.extend({}, config.defaults, options);
	
	            if (typeof options.expires === 'number') {
	                var days = options.expires,
	                    t = options.expires = new Date();
	                t.setTime(+t + days * 864e+5);
	            }
	
	            return document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
	            options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join('');
	        }
	
	        // Read
	
	        var result = key ? undefined : {};
	
	        // To prevent the for loop in the first place assign an empty array
	        // in case there are no cookies at all. Also prevents odd result when
	        // calling $.cookie().
	        var cookies = document.cookie ? document.cookie.split('; ') : [];
	
	        for (var i = 0, l = cookies.length; i < l; i++) {
	            var parts = cookies[i].split('=');
	            var name = decode(parts.shift());
	            var cookie = parts.join('=');
	
	            if (key && key === name) {
	                // If second argument (value) is a function it's a converter...
	                result = read(cookie, value);
	                break;
	            }
	
	            // Prevent storing a cookie that we couldn't decode.
	            if (!key && (cookie = read(cookie)) !== undefined) {
	                result[name] = cookie;
	            }
	        }
	
	        return result;
	    };
	
	    config.defaults = {};
	
	    $.removeCookie = function (key, options) {
	        if ($.cookie(key) === undefined) {
	            return false;
	        }
	
	        // Must not alter options, thus extending a fresh object...
	        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
	        return !$.cookie(key);
	    };
	});

/***/ },
/* 72 */
/***/ function(module, exports) {

	"use strict";
	
	/*!
	 SerializeJSON jQuery plugin.
	 https://github.com/marioizquierdo/jquery.serializeJSON
	 version 2.1.0 (May, 2014)
	
	 Copyright (c) 2014 Mario Izquierdo
	 Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
	 and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
	 */
	(function (e) {
	  "use strict";
	  e.fn.serializeJSON = function (t) {
	    var n, r, i, s, o, u;o = e.serializeJSON;r = this.serializeArray();u = o.optsWithDefaults(t);n = {};e.each(r, function (e, t) {
	      i = o.splitInputNameIntoKeysArray(t.name);s = o.parseValue(t.value, u);if (u.parseWithFunction) s = u.parseWithFunction(s);o.deepSet(n, i, s, u);
	    });return n;
	  };e.serializeJSON = { defaultOptions: { parseNumbers: false, parseBooleans: false, parseNulls: false, parseAll: false, parseWithFunction: null, useIntKeysAsArrayIndex: false }, optsWithDefaults: function optsWithDefaults(t) {
	      var n, r;if (t == null) t = {};n = e.serializeJSON;r = n.optWithDefaults("parseAll", t);return { parseNumbers: r || n.optWithDefaults("parseNumbers", t), parseBooleans: r || n.optWithDefaults("parseBooleans", t), parseNulls: r || n.optWithDefaults("parseNulls", t), parseWithFunction: n.optWithDefaults("parseWithFunction", t), useIntKeysAsArrayIndex: n.optWithDefaults("useIntKeysAsArrayIndex", t) };
	    }, optWithDefaults: function optWithDefaults(t, n) {
	      return n[t] !== false && (n[t] || e.serializeJSON.defaultOptions[t]);
	    }, parseValue: function parseValue(t, n) {
	      var r, i;i = e.serializeJSON;if (n.parseNumbers && i.isNumeric(t)) return Number(t);if (n.parseBooleans && (t === "true" || t === "false")) return t === "true";if (n.parseNulls && t == "null") return null;return t;
	    }, isObject: function isObject(e) {
	      return e === Object(e);
	    }, isUndefined: function isUndefined(e) {
	      return e === void 0;
	    }, isValidArrayIndex: function isValidArrayIndex(e) {
	      return (/^[0-9]+$/.test(String(e))
	      );
	    }, isNumeric: function isNumeric(e) {
	      return e - parseFloat(e) >= 0;
	    }, splitInputNameIntoKeysArray: function splitInputNameIntoKeysArray(t) {
	      var n, r, i;i = e.serializeJSON;if (i.isUndefined(t)) {
	        throw new Error("ArgumentError: param 'name' expected to be a string, found undefined");
	      }n = e.map(t.split("["), function (e) {
	        r = e[e.length - 1];return r === "]" ? e.substring(0, e.length - 1) : e;
	      });if (n[0] === "") {
	        n.shift();
	      }return n;
	    }, deepSet: function deepSet(t, n, r, i) {
	      var s, o, u, a, f, l;if (i == null) i = {};l = e.serializeJSON;if (l.isUndefined(t)) {
	        throw new Error("ArgumentError: param 'o' expected to be an object or array, found undefined");
	      }if (!n || n.length === 0) {
	        throw new Error("ArgumentError: param 'keys' expected to be an array with least one element");
	      }s = n[0];if (n.length === 1) {
	        if (s === "") {
	          t.push(r);
	        } else {
	          t[s] = r;
	        }
	      } else {
	        o = n[1];if (s === "") {
	          a = t.length - 1;f = t[a];if (l.isObject(f) && (l.isUndefined(f[o]) || n.length > 2)) {
	            s = a;
	          } else {
	            s = a + 1;
	          }
	        }if (l.isUndefined(t[s])) {
	          if (o === "") {
	            t[s] = [];
	          } else if (i.useIntKeysAsArrayIndex && l.isValidArrayIndex(o)) {
	            t[s] = [];
	          } else {
	            t[s] = {};
	          }
	        }u = n.slice(1);l.deepSet(t[s], u, r, i);
	      }
	    } };
	})(window.jQuery || window.Zepto || window.$);

/***/ }
/******/ ]);
//# sourceMappingURL=source.map