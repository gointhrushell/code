
import {Users} from "../app/matchmaking.jsx";
import {ChatActions} from "../components/ChatActions.jsx";
import {Populate} from "../components/Populate";
import {Dashboard} from "../components/Dashboard";
import {PlayerUpdater} from "../components/PlayerUpdater";
import {ladder} from "../components/Ladder";

var PrivateChatLoader = function(){
    var self = this;
    this.currentTimeout = null;
    this.activePrivateChat = null;
    this.privateWindowsById = {

    };
    this.getActivePrivateChat = ()=>{
        if(this.activePrivateChat)
        {
            return this.activePrivateChat;
        }
        else
        {
            return null;
        }
    };
    this.load = function(){

    };
    this.delayLoad = function(){
        self.load();
        self.currentTimeout = setTimeout(function(){
        },1200);
    };
    this.openPrivateChat = function(user){
        if(self.currentTimeout)
        {
            clearTimeout(self.currentTimeout);
        }

        var chat = self.getPrivateChat(user);

        self.minimizeAllPrivateChats(chat);

        if(!chat)
        {
            return null;//Chat failed to be initialized
        }
        if(chat.hasClass('opened'))
        {
            self.positionPrivateChat(chat);
            self.updateUnreadPrivateMessageCount();
            return chat;
        }
        chat.addClass('opened');

        var data = {
            username:user.username
        };
        var privateChatHolder = chat.findCache('.chat_container');


        //Retrieves and appends chat to appropriate container
        var chatHolder = privateChatHolder
            .closest('.chat_holder')
            ;

        var updateHistory = !Dashboard.dashboard.hasClass('dashboard-md') || Dashboard.directChatsTab.hasClass('active');
        if(updateHistory)
        {
            Dashboard.directChatsTab.trigger('activate');
            var directChatContent = Dashboard.directChatsTab.data('paneContainer');
            directChatContent.addClass('chatting');
            chatHolder.appendTo($('#big_private_chat').findCache('.private_chat_holder'));
            chatHolder.css({height:'',left:'',width:''});
        }
        else
        {
            var privateChatsHolder = $('#private_chats');
            chatHolder.appendTo($('#bottom_dock').findCache('.private_chat_holder')).addClass('float_displayed')
                .css(
                    {height:privateChatsHolder.data('default-height'),
                        width:privateChatsHolder.data('default-width')}
                );
            self.positionPrivateChat(chat);
        }




        chat.data('chatHolder',chatHolder);
        chatHolder.data('chat',chat);

        ChatActions.resizeOpenChats();

        if(chat.is(':visible'))
            chat.stop().fadeTo(0,1);

        if(chat.data('listing'))
        {
            chat.data('listing').removeClass('has_new_messages').removeClass('closed_chat');
        }
        PrivateChatLoader.updateUnreadPrivateMessageCount();
        if(chat.data('player_id'))
        {
            data.id = chat.data('player_id');
            // chatHolder.show();
        }

        var chatContainer = chatHolder.find('.chat_container');
        ChatActions.scrollToBottom(chatContainer);

        if(chatHolder.is(':visible'))
            chatHolder.find('.chat_input').focus().trigger('focus');

        //Chat was opened before so the chat window exists already

        // var loader = getListLoader();
        if(chat.data('privateXhr'))
        {
            chat.data('privateXhr').abort();
        }
        chatHolder.addClass('loading');

        self.finished = function(){
            chatHolder.removeClass('loading');
            chatHolder.removeClass('loading_error');
        };

        self.activePrivateChat = chat;
        self.load = function(loadCallback){ //So that it may be called later
            var xhr = $.post(siteUrl+'/matchmaking/private_chat', data);
            chat.data('privateXhr',xhr);
            xhr.then(function(response){
                if(loadCallback)
                {
                    loadCallback(chatHolder,response);
                }
                if(response.success)
                {
                    chat.removeClass('has_new_messages');
                    PrivateChatLoader.updateUnreadPrivateMessageCount();
                    chatHolder.removeClass('loading');
                    chatHolder.removeClass('loading_error');
                    if(response.private_chat_user)
                    {
                        if(response.friendship_required)
                        {
                            chatHolder.addClass('friendship_required');
                        }
                        //chat.show();
                        //chatHolder.show();
                        user = Users.update(response.private_chat_user);
                        chatHolder.addClass('user_pm_' + (user.username?user.username.toLowerCase():'') );
                        chat.data('player_id',user.id);

                        user.updateUserElements(chatHolder.findCache('.chat_title.user'));
                        chatHolder.resizable({
                                ghost: true,
                                handles: 'n, e, w, ne, nw',
                                start: function(event, ui) {
                                    chatHolder.css({
                                        position: "relative !important",
                                    });
                                },
                                stop: function(event, ui){
                                    $('#private_chats').data('default-height',ui.size.height)
                                        .data('default-width',ui.size.width);
                                    chatHolder.css({
                                        position: "",
                                        top: "",
                                    });
                                }
                            }
                        );
                        chatHolder.find('.title_area').off('click').on('click',function(e){
                            if($(e.target).hasClass('closing_x'))
                            {
                                return;
                            }
                            e.stopImmediatePropagation();
                            return PrivateChatLoader.togglePrivateChat(chat);
                        });
                        //					chatHolder.show();
                        chat.removeClass('pending');
                        chat.data('username', user.username);
                        self.cacheChat(chat);
                        chat.data('player_id', user.id);

                        user.updateUserElements(chat.find('.chat_title'));

                        if(user.private_chat)
                        {
                            Populate.chat(user.private_chat,privateChatHolder,false);//TODO: Used to be true.. let's see what happens...
                            PlayerUpdater.getPlayerListElementsByPlayerId(user.id).removeClass('has_new_messages');
                        }
                    }

                }
                else
                {
                    if(!response.serverError)
                    {
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

    this.minimizeAllPrivateChats = function(exceptions){
        if(self.activePrivateChat)
        {
            if(exceptions && self.activePrivateChat[0] === exceptions[0])
            {
                return;
            }
            self.activePrivateChat.each(function(){
                self.closePrivateChat($(this));
            });
        }
    }

};
PrivateChatLoader.prototype.cacheChat = function(chat){
    if(chat.data('player_id'))
    {
        this.privateWindowsById[chat.data('player_id')] = chat;
    }
};
PrivateChatLoader.prototype.unCacheChat = function(chat){
    if(chat.data('player_id'))
    {
        delete this.privateWindowsById[chat.data('player_id')];
    }
};
PrivateChatLoader.prototype.closePrivateChat = function(chat)
{
    if(chat.data('privateXhr'))
    {
        chat.data('privateXhr').abort();
    }
    if(this.activePrivateChat && chat[0] === this.activePrivateChat[0])
    {
        this.activePrivateChat = null;
    }
    var userId = chat.data('player_id');
    var pmArea = chat.data('chatHolder');

    pmArea.appendTo(chat.findCache('.private_window_display'));
    pmArea.removeClass('float_displayed');
    chat.removeClass('opened');

    Dashboard.directChatsTab.data('paneContainer').removeClass('chatting');
    return chat;
};

PrivateChatLoader.prototype.positionPrivateChat = function(chat) {

    if(!Dashboard.dashboard.hasClass('dashboard-sm') || Dashboard.directChatsTab.hasClass('active'))
    {
        return;
    }
    var privateChatHolder = chat.data('chatHolder');

    var windowLeft = $(window).scrollLeft();
    var windowRight = $(window).scrollLeft() + $(window).width();

    var chatRight = chat.offset().left + privateChatHolder.width();
    var chatLeft = chat.offset().left + 16;

    if(chatLeft < windowLeft)
        chatLeft = windowLeft + 16;
    if(chatRight > windowRight)
        chatLeft = windowRight - privateChatHolder.width();


    var chatHolder = privateChatHolder
        .closest('.chat_holder')
        .css('left',chatLeft);
};

PrivateChatLoader.prototype.updateUnreadPrivateMessageCount = function() {
    var unread = $('.private_window.has_new_messages').length;
    if(unread > 0)
    {
        $('#header_inbox_bar').find('.badge').text(unread);
        $('#direct_message_count').text(unread).show();
    }
    else
    {
        $('#header_inbox_bar').find('.badge').empty();
        $('#direct_message_count').hide();
    }
};
PrivateChatLoader.prototype.togglePrivateChat = function(chat)
{
    if(chat.hasClass('opened'))
    {
        PrivateChatLoader.closePrivateChat(chat);
    }
    else
    {
        var username, id;
        if(chat.data('username'))
        {
            username = chat.data('username');
        }
        else
        {
            username = chat.find('.user:first').text();
        }
        if(chat.data('player_id'))
        {
            id = chat.data('player_id');
        }
        var loader = this.openPrivateChat({username:username,id:id});
        if(false && chat.data('delayLoad'))
        {
            chat.data('delayLoad',false);
            loader.delayLoad();
        }
        else
        {
            loader.load();
        }
    }
};

var privateChatWindowTemplate;
var privateChatListingTemplate;
PrivateChatLoader.prototype.getPrivateChat = function(user, autoCreate)
{
    if(typeof autoCreate == 'undefined')
    {
        autoCreate = true;
    }
    var chat;
    var userChat = user.chat;

    if(user.id == myUser.id || user.username == myUser.username)
    {
        return;
    }

    if(user.id)
    {
        user = Users.create(user);
        chat = this.privateWindowsById[user.id];
    }
    else
    {
        alert('not enough info!');
        ladder.log('Not enough info to retrieve chat');
        ladder.log(user);
        return;
    }

    if(chat && chat.length)
    {
        return chat;
    }
    else if(autoCreate)
    {
        if($('.private_window.pending').length)
        {
            return null;
        }
        if(!privateChatWindowTemplate)
        {
            privateChatWindowTemplate = $('.private_window.template').remove().removeClass('template');
        }
        //Start a new chat
        chat = privateChatWindowTemplate.clone();
        chat.data('user', user);


        var listing = PrivateChatLoader.getListingForChat(chat);

        var chatAndListing = chat.add(listing);
        user.updateUserElements(chatAndListing.find('.user'));

        var chatContainer = chat.find('.chat_container').on('click','.streamlink',function(e){
            e.preventDefault();
            var button = $(this);
            ChatActions.onStreamlinkClick(button,e);
        });
        chatContainer.on('scroll',ChatActions.chatScroll);

        if(!PrivateChatLoader.hasEventsSet)
        {
            PrivateChatLoader.hasEventsSet = true;
            ChatActions.attachUniversalChatActions($('.private_chat_holder'));
        }

        chat.find('.send_chat_button').prop('disabled',false)

        var input = chat.find('.chat_input').keydown((e) => {
            var goToNext = false;
            var next;
            if(e.which == Dashboard.keyCodes.ESCAPE)
            {
                goToNext = true;
            }
            if(e.which == Dashboard.keyCodes.TAB && e.shiftKey)
            {
                e.preventDefault();
                next = chat.prevAll('.private_window').not('.template').first();
                if(!next || !next.length || next.hasClass('template'))
                {
                    next = $('.private_window').last();
                }
                if(next.length  && next[0] !== chat[0])
                {
                    next.data('delayLoad',true);
                    next.trigger('click');
                }
                return;
            }

            if(e.which == Dashboard.keyCodes.ESCAPE)
            {
                next = chat.nextAll('.private_window').first();
                this.removePrivateChat(chat);
            }
            if(e.which == Dashboard.keyCodes.TAB || goToNext)
            {
                e.preventDefault();
                if(!next || !next.length)
                {
                    next = chat.nextAll('.private_window').first();
                }
                if(!next.length || next.hasClass('template'))
                {
                    if(e.which == Dashboard.keyCodes.ESCAPE)
                    {
                        next = $('.private_window').last();
                    }
                    else
                    {
                        next = $('.private_window').first();
                    }
                }
                if(next.length && next[0] !== chat[0])
                {
                    if(e.which != Dashboard.keyCodes.ESCAPE)
                    {
                        next.data('delayLoad',true);
                    }
                    next.trigger('click');
                    Dashboard.directChatsTab.data('paneContainer').addClass('chatting');
                }
                else
                {
                    Dashboard.directChatsTab.data('paneContainer').removeClass('chatting');
                }
                return;
            }

        }).addClass('chat_autocomplete');
        input.data('chatContainer',chatContainer);

        chat.find('.closing_x').click(function(e){
            e.stopPropagation();
            PrivateChatLoader.removePrivateChat(chat);
        });

        if(!user.username || !user.id)
        {
            chat.addClass('pending');
        }
        else
        {
//				chat.css('display','table-cell');
        }


        if(userChat && userChat.message && userChat.message.message)
        {
            var quickSummaryMessage;
            if(userChat.message.username)
            {
                quickSummaryMessage = userChat.message.username + ' - ' + userChat.message.message;
            }
            else
            {
                quickSummaryMessage = userChat.message.message;
            }
            listing.find('.message_summary').text(quickSummaryMessage).attr('title',userChat.message.message).removeClass('no_messages');
            listing.find('.time').add(chat.find('.time')).timestampUpdate(userChat.message.date);
        }
        else
        {
            listing.find('.message_summary').addClass('no_messages');
        }

        chatAndListing = chat.add(listing); //So that we can copy the attributes to the listing
        chatAndListing.attr('title',user.username);
        // chatAndListing.find('input[name=username]').val(user.username);
        chatAndListing.data('player_id', user.id);
        chatAndListing.data('chatHolder',chat.find('.chat_holder'));


        this.cacheChat(chat);
        var chatHolder = chat.data('chatHolder');

        var privateChatListings = $('#private_chat_listing');
        if(!privateChatListings.find('.private_chat_'+user.id).length)
        {
            listing.addClass('private_chat_'+user.id).prependTo('#private_chat_listing');
            if(userChat && userChat.message && userChat.message.is_open === false)
            {
                listing.addClass('closed_chat');
            }
        }

        if(userChat && userChat.message && userChat.message.is_open === false)
        {
            //Don't append, just let it float out in the wilderness..?
            chat.addClass('detached');
        }
        else
        {
            chat.appendTo('#private_chats');
            $('#bottom_dock').addClass('has_direct_messages');
            $('#dashboard').addClass('has_direct_messages');
        }
        return chat;
    }
};
function getPrivateChatListingTemplate(){
    if(!privateChatListingTemplate)
    {
        privateChatListingTemplate = $('.private_chat_listing.template').remove().removeClass('template');
    }
    return privateChatListingTemplate.clone();
}
PrivateChatLoader.prototype.getListingForChat = function(chat){
    var listing;
    var user = chat.data('user');
    if(chat.data('listing'))
    {
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
    if(!listing)
    {
        listing = getPrivateChatListingTemplate();
    }
    chat.data('listing', listing);
    return listing;
};
PrivateChatLoader.prototype.appendChatElements = function(chat){
    if(chat.data('listing').hasClass('closed_chat'))
    {
        chat.data('listing').removeClass('closed_chat');
    }

    if(chat.hasClass('detached'))
    {
        chat.removeClass('detached');
        chat.appendTo('#private_chats');
    }
};
PrivateChatLoader.prototype.removePrivateChat = function(chat) {
    var userId = chat.data('player_id');
    $.post(siteUrl+'/matchmaking/close_private_chat',{player_id:userId});
    this.unCacheChat(chat);
    this.closePrivateChat(chat);
    chat.detach();
    chat.addClass('detached');
    chat.data('listing').addClass('closed_chat'); //Don't worry about removing the listing
};

PrivateChatLoader = new PrivateChatLoader();
export {PrivateChatLoader};


/** WEBPACK FOOTER **
 ** ./../components/PrivateChatLoader.jsx
 **/