import {DisplayUpdater} from '../components/DisplayUpdater.jsx';
import {ServerMessage} from '../components/ServerMessageController.jsx';
import {LadderHistory} from "./LadderHistory";
import {PrivateChatLoader} from "./PrivateChatLoader";
import {UserInfo} from "../components/UserInfo";
import {matchModeManager} from "../models/MatchModeManager.jsx";
import {MatchModeManager} from "../models/MatchModeManager.jsx";
import {Ladder} from "../components/Ladder.jsx";
import {ChatActions} from "./ChatActions";
import {Settings} from "./Settings";
import {Request} from "./Request";

$.fn.findCache = function(selector){
    var element = this;
    
    if(!this.data('findCache'))
    {
        this.data('findCache', {});
    }
    if(!this.data('findCache'))
    {
        console.error('UNDEFINED ELEMENT');
        return $();
    }
    if(this.data('findCache')[selector])
    {
        return this.data('findCache')[selector];
    }
    else
    {
        var result = this.find(selector);
        this.data('findCache')[selector] = result;
        return result;
    }
};

$.fn.ladderSortable = function(options){
    let list = $(this);

    if(!options.items)
    {
        throw new Error('items is a required option');
    }
    let defaultOptions = {
        axis:'y',
        tolerance: "pointer",
        items: null,
        idDataElement : "id",
        updateUrl : '',
        urlListKey: 'ids',
        update: function(e,ui){
            var elements = list.find(defaultOptions.items).not('.template');
            var ids = [];
            elements.each(function(){
                var element = $(this);
                var chat = element.data(defaultOptions.idDataElement);
                ids.push(chat);
            });
            var data = {};
            data[defaultOptions.urlListKey] = ids;
            $.post(defaultOptions.updateUrl,data);
        }
    };

    $.extend(defaultOptions, options);

    console.log(options);
    console.log(defaultOptions);
    list.sortable(defaultOptions);
};
export var Dashboard = {};
Dashboard.ladderPopupDismiss = function(){
    $('#bootstrap-modal').modal('hide');
};
Dashboard.setupLadderPopupAutoSubmit = function(modal){
    modal.data('submitButton', null);
    if(modal.data('autoSubmit'))
    {
        return;
    }
    modal.data('autoSubmit', true);
    modal.on('submit', function(e){
        e.preventDefault();
        if(modal.data('submitButton'))
        {
            modal.data('submitButton').click();
        }
    });
}
Dashboard.ladderPopup = function(content, title, options){
    let modal = $('#bootstrap-modal').modal(options);
    Dashboard.setupLadderPopupAutoSubmit(modal);
    if(!modal.data('buttonTemplate'))
    {
        modal.data('buttonTemplate', modal
            .find('button.template')
            .attr('data-dismiss', null)
            .removeClass('template').remove());
    }
    let footer = modal.findCache('.modal-footer').show();
    footer.empty();
    if(!options)
    {
        options = {};
    }
    if(options.buttons)
    {
        if(options.buttons === true)
        {
            options.buttons = [
                {
                    dismiss: false,
                    text:'Hate',
                },
                {
                    dismiss: true,
                    text:'Love',
                }
            ]
        }

        for(let buttonData of options.buttons)
        {
            let buttonItem = modal.data('buttonTemplate').clone();
            if(buttonData.dismiss)
            {
                buttonItem.attr('data-dismiss', 'modal');
            }
            if(buttonData.click)
            {
                buttonItem.on('click', function(){
                    buttonData.click(modalPopupCallbackData)
                });
                if(!modal.data('submitButton') || buttonData.defaultSubmit)
                {
                    //Default to setting a button with a click event as the auto submit button
                    modal.data('submitButton', buttonItem);
                }
            }
            buttonItem.text(buttonData.text);
            buttonItem.appendTo(footer);
        }
    }
    else
    {
        modal.findCache('.modal-footer').hide();
    }
    delete options.buttons;

    modal.findCache('.modal-body').html(content).show();
    if(title)
    {
        modal.findCache('.modal-header').show();
        modal.findCache('.modal-title').html(title);
    }
    else
    {
        modal.findCache('.modal-header').hide();
    }

    var modalPopupCallbackData = {
        popup: modal,
        dismiss: function(exitMessage){
            if(exitMessage)
            {
                modal.findCache('.modal-header').show();
                modal.findCache('.modal-title').html(exitMessage);

                modal.findCache('.modal-footer').hide();
                modal.findCache('.modal-body').hide();

                setTimeout(()=>{
                    Dashboard.ladderPopupDismiss();
                }, 1500)
            }
            else
            {
                Dashboard.ladderPopupDismiss();
            }
        },
        onDismiss: function(){}
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
    is_in_ladder:isInLadder?1:0,
    match_only_mode:matchOnlyMode?1:0
};

Dashboard.startMatchWithPlayer = null;
Dashboard.hostCodePopup = {popup:null, value:null};
Dashboard.attachedTabEvents = false;
Dashboard.retrieveHostCode = function(){
  var value = null;
    if(Dashboard.hostCodePopup.popup)
    {
        value = Dashboard.hostCodePopup.popup.get().find('input').val();
    }
    return value;
};

Dashboard.closeDeclickables = function()
{
    if(Ladder.declickables.length)
    {
        $.each(Ladder.declickables,function(i,declick){
            if(!declick.data('canBeUnclicked'))
            {
                return;
            }
            declick.trigger('notClicked');
        });
    }
};
Dashboard.parseGeneralData = function(message){
    if(message && message.authentication === false)
    {
        Dashboard.serverConnection.authenticationFail = true;
        if(message.error)
        {
            // console.log(message.error);
            Dashboard.serverConnection.setStatusError(message.error);
        }
    }
    if(Dashboard.dashboard.data('search_disabled'))
    {
        Dashboard.dashboard.data('search_disabled',false);
        if(Dashboard.matchmakingTab.data('paneContainer'))
        {
            Dashboard.matchmakingTab.data('paneContainer').find('.game_filters').removeClass('disabled');
        }
        Settings.enableAll();

        // ChatActions.resizeOpenChats();
    }
    if(Dashboard.dashboard.data('isReady'))
    {
        Dashboard.performOpenSearchUpdate(message);
    }
    else
    {
        Dashboard.serverMessageQueue.push(message);
    }
};
Dashboard.dashboard.on('ready', function(){
    do{
        var message = Dashboard.serverMessageQueue.shift();

        Dashboard.parseGeneralData(message);
    }while(message);
});
Dashboard.serverMessageQueue = [];
Dashboard.keepContainerOnScreen = function(container,startPoint)
{
    if(!startPoint)
    {
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


    if(startPoint.y+ minHeight > windowBottom)
        startPoint.y = windowBottom - minHeight;

    if(startPoint.y < windowTop)
        startPoint.y = windowTop + 20;

    if(startPoint.x < windowLeft)
        startPoint.x = windowLeft;

    if(containerRight > windowRight)
        startPoint.x = windowRight - container.width() - 40;

    container.css('left',startPoint.x);
    container.css('top',startPoint.y);
    // container.css('display','inline-block');
    // container.css('position','absolute');
};
Dashboard.mainChatHolderTemplate = $('.chat_holder.template_visible');

Dashboard.performOpenSearchUpdate = function(response,extract)
{
    if(extract)
    {
        var replacement = {};
        if(!response[extract])
        {
            return;
        }
        replacement[extract] = response[extract];
        delete response[extract];
        response = replacement;
    }
    for(var key in response)
    {
        if(response.hasOwnProperty(key) && ServerMessage[key] instanceof Function)
        {
            if(ServerMessage[key](response) === false)
            {
                break;
            }
        }
    }
    Dashboard.firstCheck = false;
    DisplayUpdater.reset();
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
Dashboard.retrieveNamedTab = function(name){
    return Dashboard.namedTabList[name] || $();
};
allTabs.each(function(i, tab){
    tab = $(tab);
    Dashboard.namedTabList[tab.data('pane')] = tab;
    if(tab.is('.disabled'))
    {
        allTabs = allTabs.not(tab);
    }
});
Dashboard.allTabs = allTabs;

var chatsTab = Dashboard.chatsTab = Dashboard.retrieveNamedTab('chat');
var directChatsTab = Dashboard.directChatsTab= Dashboard.retrieveNamedTab('direct_messages');
var matchmakingTab = Dashboard.matchmakingTab = Dashboard.retrieveNamedTab('matchmaking');
Dashboard.battleTab = Dashboard.retrieveNamedTab('battle');
var groupsTab = Dashboard.groupsTab = Dashboard.retrieveNamedTab('groups');
var matchmakingPane = Dashboard.matchmakingPane =  $('#tab-pane-matchmaking');
var disputesTab = Dashboard.disputesTab = Dashboard.retrieveNamedTab('disputes');
var gameFilters = Dashboard.gameFilters = $('.game_filters');
var matchmakingContainers = Dashboard.matchmakingContainers = $('#tab-pane-matchmaking')
    .find('.ladder_game_list');

Dashboard.disputesContainer = $('#disputes');

Dashboard.activityView = $('#tab-pane-matchmaking').find('.activity_view');
Dashboard.userlistSide = $('#user_list_side');
Dashboard.midsideContainer = $('#tab-pane-chat');
Dashboard.chatDrawerSelect = $('#chat_drawer_select');
Dashboard.userlistIsVisible = function(){
    if(!Dashboard.chatsTab.hasClass('active'))
    {
        return false;
    }
    if(Dashboard.dashboard.hasClass('dashboard-md'))
    {
        return true;
    }
    if(Dashboard.userlistSide.hasClass('toggleable') && !Dashboard.midsideContainer.hasClass('userlist_showing'))
    {
        return false;
    }
    return true;
};


Dashboard.userInfoTab = $('#user_info_button');

Dashboard.recentMatchSearchers = $('#recent_match_searchers');
Dashboard.sortSearchLists = function(){
    Dashboard.sortSearchList(Dashboard.recentMatchSearchers.data('friendlies_list'));
    Dashboard.sortSearchList(Dashboard.recentMatchSearchers.data('ranked_list'));
};
Dashboard.sortSearchList = function(currentList){
    if(
        currentList.data('needsSort') &&
        !Dashboard.recentMatchSearchers.hasClass('hard_focus'))
    {
        currentList.data('needsSort', false);
        currentList.find('.recent_match_searcher').tsort({data:'distance', order:'asc'});
    }
};
Dashboard.recentMatchSearchers.data('friendlies_list',
    Dashboard.recentMatchSearchers.find('.friendlies_search .ladder_game_list'));
Dashboard.recentMatchSearchers.data('ranked_list',
    Dashboard.recentMatchSearchers.find('.ranked_search .ladder_game_list'));
Dashboard.recentMatchSearchers.data('elementsToRemoveOnUnFocus',[]);

Dashboard.userInfoContainer.on('click', 'a', function(e){
    let link = $(this);
   if(isInLadder && link.attr('target') != '_blank')
   {
       if(link.hasClass('username') && link.closest('.opponent'))
       {
           return;
       }
       e.preventDefault();
       window.open(link.attr('href'), '_blank');
   }
});
Dashboard.UserInfo = new UserInfo(Dashboard.userInfoContainer);


Dashboard.recentMatchSearchers.on('mouseenter',function(){
    $(this).addClass('hard_focus');
}).on('mouseleave',function(){
    $(this).removeClass('hard_focus');
    var popped = null;
    do{
        popped = Dashboard.recentMatchSearchers.data('elementsToRemoveOnUnFocus').pop();
        if(popped)
        {
            popped.remove();
        }
    }while(popped);
    Dashboard.sortSearchLists();
});
Dashboard.battleTab.on('activate', function(){
    if(!Dashboard.battleTab.data('paneContainer'))
    {
        return;
    }
    if(!Dashboard.battleTab.data('eventsAdded'))
    {
        Dashboard.battleTab.data('eventsAdded', true);
        Dashboard.battleTab.data('paneContainer').on('click', '.match_search_link', function(){
           Dashboard.matchmakingTab.trigger('activate');
        });
    }
    if(Dashboard.battleTab.data('paneContainer'))
    {
        var chatWindow = Dashboard.battleTab.data('paneContainer').find('.chat_container');
        if(chatWindow.length)
        {
            ChatActions.scrollToBottom(chatWindow);
        }
    }
});
Dashboard.matchmakingTab.on('activate', function(){

    if(matchModeManager.viewModeIs(MatchModeManager.modes.SEARCH))
    {
        if(!Dashboard.matchmakingTab.data('paneContainer'))
        {
            return;
        }
        if(Dashboard.matchmakingTab.data('paneContainer').hasClass('loading'))
        {
            return;
        }
        else
        {
        }
        Dashboard.matchmakingTab.data('paneContainer').addClass('loading');
        Request.send({},'retrieve_match_searches',function(){
            Dashboard.matchmakingTab.data('paneContainer').removeClass('loading');
            return true;
        });
    }
}).on('viewportActive', function(){
    matchModeManager.changeViewMode(MatchModeManager.modes.SEARCH);
    // ChatActions.resizeOpenChats();
});
matchmakingTab.on('activate',function(){
    if(!matchmakingTab)
    {
        return;
    }
    if(!matchmakingTab.data('paneContainer'))
    {
        return;
    }
    if(matchmakingTab.data('paneContainer'))
    {
        var chatWindow = matchmakingTab.data('paneContainer').find('.chat_container');
        if(chatWindow.length)
        {
            ChatActions.scrollToBottom(chatWindow);
        }
    }


    if(!matchmakingTab.data('paneContainer').data('maximize_events_set'))
    {
        var toggleMaximize = function(container, name){
            var toggle;
            if(container.hasClass('maximized'))
            {
                container.removeClass('maximized');
                toggle = 0;
            }
            else
            {
                container.addClass('maximized');
                toggle = 1;
            }
            $.post(siteUrl+'/account/toggle_matchmaking_display',{name:name, toggle:toggle});
        };

        matchmakingTab.data('paneContainer').data('maximize_events_set', true);
        matchmakingTab.data('paneContainer').on('click', '.maximizable_container .heading', function(e){
            var container = $(this).closest('.maximizable_container');
            toggleMaximize(container, container.data('name'));
        });
    }
});
directChatsTab.on('activate',function(){
    $(this).trigger('updateTimestamps');
    let currentActivePrivateChat = PrivateChatLoader.getActivePrivateChat();
    if(directChatsTab.data('paneContainer'))
    {
        if(!directChatsTab.data('paneContainer').data('eventsAttached'))
        {
            directChatsTab.data('paneContainer').data('eventsAttached', true);
            directChatsTab.data('paneContainer').on('click','.back_button',function(){
                PrivateChatLoader.minimizeAllPrivateChats();
            }).on('click','.close_button',function(){
                PrivateChatLoader.removePrivateChat($('.private_window.opened'));
            })
        }
    }
    if(currentActivePrivateChat)
    {
        setTimeout(()=>{
            PrivateChatLoader.minimizeAllPrivateChats();
            PrivateChatLoader.openPrivateChat(currentActivePrivateChat.data('user')).finished();
        },1);
    }
});
directChatsTab.on('timestampUpdate',function(){
    if($(this).data('paneContainer'))
    {
        $(this).data('paneContainer').find('.private_chat_listing .time').timestampUpdate();
    }
});

directChatsTab.on('deactivate',function(){
    let currentActivePrivateChat = PrivateChatLoader.getActivePrivateChat();
    if(currentActivePrivateChat && Dashboard.isMediumOrLarger())
    {
        setTimeout(()=>{
            PrivateChatLoader.minimizeAllPrivateChats();
            let chat = PrivateChatLoader.openPrivateChat(currentActivePrivateChat.data('user'));
            if(chat.finished)
            {
                chat.finished();
            }
            else
            {
                console.log(chat);
            }
        },1);
    }
});
Dashboard.isTiny = function(){
    return !Dashboard.dashboard.hasClass('dashboard-sm');
};
Dashboard.isMediumOrSmaller = function(){
    return !Dashboard.dashboard.hasClass('dashboard-lg');
};
Dashboard.isLarge = function(){
    return Dashboard.dashboard.hasClass('dashboard-lg');
};
Dashboard.isMediumOrLarger = function(){
    return Dashboard.dashboard.hasClass('dashboard-md');
}

Dashboard.preferredDistanceSeverityElement = $('#preferred_distance_severity');
Dashboard.getPreferredDistanceSeverity = function(){
    var element = Dashboard.preferredDistanceSeverityElement;
    if(typeof element.data('selected') == 'undefined')
    {
        element.data('selected', element.find(':selected').val());
    }
    return element.data('selected');
};
Dashboard.getDataForGame = function(gameId){
    var element = $('#preferred_game_filter_'+gameId);
    if(!element.length)
    {
        return {};
    }
    return element.data();
};


var tabChanger = new TabChanger(allTabs);
TabChanger.tabChangeDelay = 10;
function TabChanger(tabs){
    this.allTabs = tabs;
    var allTabs = this.allTabs;
    allTabs.data('keepOthersActive',true);
    allTabs.on('reactivate',function(e){
        var button = $(this);
        if(button.hasClass('active'))
        {
            var currentlyActive = allTabs.filter('.active').length;
            if(currentlyActive > 1)
            {
                button.trigger('deactivate');
                return;
            }
        }
    });

    allTabs.on('activate',function(e){
        var button = $(this);
        if(!button.data('paneContainer'))
        {
            return;
        }

        var pane = button.data('paneContainer');//.css('display','block');

        var activeTabs = allTabs.filter('.active');
        var maxOpenTabs = TabChanger.getMaximumNumberOfOpenTabs();
        if(activeTabs.length >= maxOpenTabs)
        {
            // Dashboard.sleep(TabChanger.tabChangeDelay).then(() =>
            {

                if(maxOpenTabs == 1)
                {
                    activeTabs.not(button).trigger('deactivate');
                }
                else
                {
                    var selectedTabPosition = getPositionInList(button[0]);
                    var others = activeTabs.not(button);
                    var first = others[0];
                    var second = others[1];

                    $(second).trigger('deactivate');
                }
            }

        }
        function getPositionInList(compareTab)
        {
            var position = 0;
            allTabs.each(function(i,tab){
                if(tab === compareTab)
                {
                    position = i;
                    return false;
                }
            });
            return position;
        }
    });
    allTabs.on('deactivate',function(e){
        var button = $(this);
        // button.data('paneContainer').hide();
    });


}
TabChanger.prototype.initialize = function(){

};
TabChanger.getMaximumNumberOfOpenTabs = function(){
    if(Dashboard.dashboard.hasClass('dashboard-sm'))
    {
        return 2;
    }
    else
    {
        return 1;
    }
};

$(window).resize(function(){
    ChatActions.calculateWindowHeight();
    ChatActions.resizeOpenChats();
}).trigger('resize');

attachTabEvents(allTabs);

function attachTabEvents(allTabs){
    if(Dashboard.attachedTabEvents)
    {
        return;
    }
    var initialActive = null;
    if(!allTabs)
    {
        allTabs = $('.tab_list .tab_button:not(.disabled)');
    }
    if(!allTabs.length)
    {
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
        tab.data('link',tab.find('a'));

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
        LadderHistory.actions.activatePane(paneName, true);
    });
    allTabs.on('deactivate', function () {
        var button = $(this);
        button.removeClass('active').data('paneActive',false);
        if(button.data('paneContainer'))
        {
            button.data('paneContainer').removeClass('active').data('paneActive',false);
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

        if(pane.hasClass('active'))
        {
            if(button.hasClass('active') && changeHistory)
            {
                button.trigger('reactivate');
                return;
            }
            return;
        }


        clicked.addClass('active').data('paneActive',true);
        pane.data('paneActive',true);

        // Dashboard.sleep(TabChanger.tabChangeDelay).then(() =>
        {
            if(button.data('keepOthersActive') !== true)
            {
                others.not(clicked).trigger('deactivate');
            }
            clicked.addClass('active').data('paneActive',true);
            pane.addClass('active').data('paneActive',true);
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
                    }
                    else {
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
                LadderHistory.history.pushState(historyData, document.title, link.attr('href'));
            }
        }
    });
    LadderHistory.actions.activatePane = function (paneId, changeHistory) {
        var pane = $(paneId);
        var button = pane.data('button');
        if (button) {
            if(button.data('activatedBeforeStateChange')) //Prevent state chang efrom triggering twice
            {
                return;
            }
            if(button.hasClass('active'))
            {
                button.trigger('reactivate');
                return;
            }
            button.data('activatedBeforeStateChange', true);

            button.trigger('activate', [changeHistory]);
        }
        else {
            console.error('Container not found for ' + paneId);
        }
    };
    if(LadderHistory.history.Adapter)
    {
        LadderHistory.history.Adapter.bind(window, 'statechange', function () {
            var state = LadderHistory.history.getState();
            var paneId = state.data.pane;

            var currentIndex = History.getCurrentIndex();
            var internal = (state.data._index == (currentIndex - 1));
            if (internal && !paneId)
            {

                if(initialActive)
                {
                    paneId = initialActive;
                    if(!paneId)
                    {
                        return;
                    }
                }
                else
                {
                    return;
                }
            }
            if(typeof state.data._index == 'undefined')
            {
                paneId = initialActive;
            }

            // console.log(currentIndex);
            // console.log(state.data._index);

            if (paneId) {
                LadderHistory.actions.activatePane(paneId, false);
            }
            else {
                //LadderHistory.checkUserActionState();
            }
            allTabs.data('activatedBeforeStateChange', false);
        });
    }
    allTabs.filter('.active').trigger('activate');
    if(chatsTab.hasClass('active') && Dashboard.dashboard.hasClass('dashboard-sm'))
    {
        Dashboard.matchmakingTab.trigger('activate');
    }
}

$(function(){
    attachTabEvents();
});

matchmakingTab.on('showNotified',function(){
    if(!matchmakingTab.hasClass('active') && !matchmakingTab.data('paneContainer').is(':visible'))
    {
        matchmakingTab.addClass('notification');
    }
});
Dashboard.battleTab.on('showNotified',function(){
    if(!Dashboard.battlePaneIsVisible())
    {
        Dashboard.battleTab.addClass('notification');
    }
});


Dashboard.sleep = function(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};
Dashboard.matchmakingPaneIsVisible = function(){
    return Dashboard.matchmakingTab.data('paneContainer').is(':visible');
};
Dashboard.matchmakingPaneShouldGetFocus = function()
{
    return !Dashboard.matchmakingPaneIsVisible();
};
Dashboard.matchmakingPaneShouldGetFocusIfNeeded = function()
{
    if(Dashboard.matchmakingPaneShouldGetFocus())
    {
        Dashboard.matchmakingTab.trigger('click');
    }
};
Dashboard.battlePaneIsVisible = function(){
    return Dashboard.battleTab.hasClass('active') && Dashboard.battleTab.data('paneContainer').is(':visible');
};
Dashboard.battlePaneShouldGetFocus = function()
{
    return !Dashboard.battlePaneIsVisible();
};
Dashboard.battlePaneShouldGetFocusIfNeeded = function()
{
    if(Dashboard.battlePaneShouldGetFocus())
    {
        Dashboard.battleTab.trigger('click');
    }
};

Dashboard.updateSearchesByBuildPreference = function($searches)
{
    $searches.each(function(i,search){
        var element = $(search);
        search = element.data('match');
        var userObject = search.player1;
        if(!userObject)
        {
            return;
        }
        if(userObject.id == myUser.id)
        {
            return;
        }
        if(userObject.preferred_builds.hasPreferredBuildsFor &&
            userObject.preferred_builds.hasPreferredBuildsFor(search.ladder.id) && myUser.preferred_builds)
        {
            var result = userObject.preferred_builds.getBestBuildHostPerspective(myUser.preferred_builds, search.ladder.id);
            if(result === null)
            {
                element.addClass('no_matching_builds').removeClass('has_matching_builds');
            }
            else
            {
                element.addClass('has_matching_builds').removeClass('no_matching_builds');
            }
        }
        else
        {

        }
    });
};


Dashboard.dashboard.on('ready', function(e){
    var steps = [];
    var runTours = window.runTours;
    if(runTours && Dashboard.dashboard.hasClass('dashboard-sm'))
    {
        if(runTours[1])
        {
            Tours.siteIntroTour(steps);
        }
        if(runTours[2])
        {
            if(Dashboard.matchmakingTab.hasClass('active')
                && matchModeManager.viewModeIs(MatchModeManager.modes.SEARCH))
            {
                Tours.gameSpecificSettingsTour(steps);
            }

        }
        if(runTours[3])
        {
            Tours.fasterMeleeTour(steps);
        }
    }
    if(steps.length)
    {
        var intro = introJs();
        intro.setOptions({
            exitOnOverlayClick: false,
            exitOnEsc: false,
            steps: steps,
            showBullets: false
        });
        intro.start();
        $('.introjs-overlay').on('click', function(e){
            if($(this).data('finished'))
            {
                return;
            }
            intro.nextStep();
        });

        intro.oncomplete(function(){
           $('.introjs-overlay').data('finished',true);
           $.post(siteUrl+'/finished_tour',{tours:runTours}).done(function(response){
           });
        });
    }

}).on('ready', function(){
    
});
var Tours = {
    siteIntroTour: function(steps){
        steps.push({
           intro: "Welcome to SmashLadder!",
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
    gameSpecificSettingsTour: function(steps){
        steps.push({
            element: $('.game_filters:first')[0],
            intro: "You can change specific search settings for each game by clicking its icon."
        });
        var meleeFilter = $('#preferred_game_filter_2');
        if(meleeFilter.length)
        {
            steps.push({
                element: meleeFilter[0],
                intro: "You can set <em>Faster Melee</em> preferences by clicking into " +
                '<img class="logo" src="'+siteUrl+'/images/logos/game-filter-logos/melee-on.png">' +
                " settings"
            });
        }
    },
    fasterMeleeTour: function(steps){
        var meleeFilter = $('#preferred_game_filter_2');
        if(meleeFilter.length && meleeFilter.is(':visible'))
        {
            steps.push({
                element: meleeFilter[0],
                intro:

                    '<a target="_blank" href="https://www.smashladder.com/guides/view/272o/melee-dolphin-build-fastermelee-5-fm5">' +
                    '<img style="display: block; margin: 0 auto;" class="logo" src="'+siteUrl+'/images/logos/dolphin/ishiiruka/48x48.png">' +
                    '</a>' +
                    "Faster Melee "+
                    "is now the default dolphin build, if you cannot run it please click the" +
                    '<br> <img class="logo" src="'+siteUrl+'/images/logos/game-filter-logos/melee-on.png">' +
                    ' icon to change your preferences'
            });
        }
    }
};

Dashboard.activeAutoComplete = null;
$(document).on('focus','.chat_input.chat_autocomplete', function(){
    Dashboard.setAutocomplete(this);
}).on('elastic:resized', '.chat_input', function(e, rawr){
    var input = $(this);
    console.log(input.css('height'));
    console.log('resized!');
    console.log(e, rawr);
});

Dashboard.setAutocomplete = function(chatInput){
    chatInput = $(chatInput);
    if(Dashboard.activeAutoComplete)
    {
        if(chatInput[0] === Dashboard.activeAutoComplete[0])
        {
            return;
        }
        if(Dashboard.activeAutoComplete.data('ui-autocomplete') != undefined)
        {
            Dashboard.activeAutoComplete.autocomplete('destroy');
        }
    }
    ChatActions.autoCompleteCache = null;
    Dashboard.activeAutoComplete = chatInput;
    Dashboard.activeAutoComplete.autocomplete(ChatActions.chatAutocompleteOptions);
};

Dashboard.circleLoaderElement = null;
Dashboard.getCircleLoaderElement = function(){
    if(Dashboard.circleLoaderElement)
    {
        return Dashboard.circleLoaderElement.clone();
    }
    else
    {
        return Dashboard.circleLoaderElement = $('#circle_loader_element').remove().attr('id','').removeClass('template');
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


/** WEBPACK FOOTER **
 ** ./../components/Dashboard.jsx
 **/