import {PrivateChatLoader} from "PrivateChatLoader.jsx";
import {DateFormat} from "DateFormat.jsx";
import {Users} from "matchmaking.jsx";
import {Request} from "Request.jsx";
import {ChatActions} from "ChatActions.jsx";
import {LadderInfo} from "LadderInfo.jsx";
import {Populate} from "Populate.jsx";
import {MatchSounds} from "MatchSounds.jsx";
import {ladder} from "Ladder.jsx";
import {Settings} from "Settings.jsx";
import {BrowserNotification} from "BrowserNotification.jsx";
import {Flair} from "Flair.jsx";
import {Dashboard} from "Dashboard.jsx";
import {UserNotificationQueueItem} from "UserNotificationQueueItem.jsx";
import {PreferredGame} from "../models/PreferredGame";
import {PingAverage} from "./PingAverage";

var ServerMessageController = function(){
    this.restartingComputer = false;
};

ServerMessageController.prototype.restart_computer = function(){
    if(!this.restartingComputer)
    {
        this.restartingComputer = true;
        $('.restarting_computer').show();
        var time = 5;
        var maxTime = 5;
        var countDown = $('.restarting_computer .countdown');
        var timer = new Timer(countDown,5,function(){
            location.reload(true);
        });
        countDown.text(time);
    }
};
ServerMessageController.prototype.success = function(response){
    if(response.authentication === false)
    {
        showConnectionIssue(response);
        return false;
    }
};
ServerMessageController.prototype.authentication = ServerMessageController.success;
ServerMessageController.prototype.ladder_error_banned = function(response){
    var url = window.location.href;

    var lastSegment = url.split('/').pop();
    if(lastSegment == 'netplay')
    {
        window.location = siteUrl;
    }
};
ServerMessageController.prototype.ping_player = function(pingPlayerData){
    if(!BrowserNotification.checkBrowserFocus() || IS_LOCALHOST)
    {
        console.log('Browser tab does not have focus, do not start a ping test');
        return;
    }
    var pingPlayer = pingPlayerData.ping_player;
    var peerToConnectTo = pingPlayer.peer_id;

    var peer = new Peer({key: 'syic4as01jvvaemi'});
    var dataConnection = null;

    var isHost = false;
    var connectionEstablished = false;
    var otherUser = Users.retrieveById(pingPlayer.player_id);
    if(!otherUser)
    {
        return null;
    }
    if(!otherUser.peer)
    {
        otherUser.peer = {
            id:null,
            ping:new PingAverage()
        };
    }
    var destroyPeer = function(){
        console.trace('DESTRUCTION');
        peer.destroy();
    };
    otherUser.peer.id = pingPlayer.peer_id;
    peer.on('open', function(id) {
        console.log('my peer id',id);
        //Peer connections will be fire and forget since a long term connection should not be necessary
        if(!myUser.peer)
        {
            myUser.peer = {};
        }
        myUser.peer.id = id;

        if(pingPlayer.peer_id)
        {
            console.log('attempting connection to ',pingPlayer.peer_id);
            dataConnection = peer.connect(pingPlayer.peer_id);
            isHost = false;
            dataConnectionEventBinder(dataConnection,otherUser);
            connectionEstablished  = !!dataConnection;
            console.log(dataConnection);
            console.log(connectionEstablished);
        }
        else
        {
            peer.on('connection', function(conn) {
                dataConnection = conn;
                console.log('CONNECTION ESTABLISHED');
                otherUser.peer.id = dataConnection.peer;
                isHost = true;
                dataConnectionEventBinder(dataConnection,otherUser);
            });
            $.post(siteUrl+'/matchmaking/ping_player',{peer_id:myUser.peer.id,player_id:pingPlayer.player_id},function(response){
                if(!response.success)
                {
                    destroyPeer();
                    throw "Error establishing user to connect to";
                }
                else
                {
                    console.log('Success, it should only be a matter of time now...');
                }
            });
            //We're just going to wait for a connection
        }
        setTimeout(function(){
            //After a while, if no dataconnection is bound, we'll kill this to prevent a memory leak
            if(dataConnection)
            {
                return;
            }
            destroyPeer();
        },10000);

        //Since we were requested to connect to the peer, we'll request a connection to the other browser
    });
    peer.on('error', function(err) {
        console.log(':(');
        console.log(err);
        destroyPeer();
    });

    function dataConnectionEventBinder(dataConnection,otherUser){
        if(!dataConnection)
        {
            destroyPeer();
            throw "The peer data connection was not initialized";
        }
        else
        {
            console.log('');
            //peer.disconnect();
        }
        if(isHost)
        {
            var timeOutInterval = 1000;
            var sendPing = function(){
                console.log('sending PING');
                if(dataConnection && otherUser.peer && otherUser.peer.id)
                {
                    var test = new PingTester();
                    var measure = test.measure;
                    dataConnection.send({
                            type:'ping',
                            test:{uid:1,id:measure.id,key:measure.key}
                        }
                    );
                    setTimeout(sendPing,timeOutInterval);
                }
                else
                {
                    destroyPeer();
                    dataConnection = null;
                }
            };
            setTimeout(sendPing,1000);
        }
        dataConnection.on('data', function(data) {
            console.log('Received', data);
            if(data.type=='ping')
            {
                console.log('Sending PING');
                dataConnection.send({
                    type:'pong',
                    reply:data.test
                })
            }
            if(data.type=='pong')
            {
                if(data.reply)
                {
                    if(PingTester.pingTests[data.reply.id])
                    {
                        var result = PingTester.pingTests[data.reply.id].finished(data.reply);
                        if(result !== null)
                        {
                            otherUser.peer.ping.add(result);
                        }

                        $('#ping_test_result').addClass('visible').find('.number').text(otherUser.peer.ping.getAverage());
                    }
                    else
                    {
                        console.log('Invalid reply',data.reply);
                    }
                }
            }

        });
    }

    function PingMeasure(finishedCallback){
        this.id = PingMeasure.currentId++;
        this.key = getRandomInt(1,10000000);
        var that = this;
        var date = new Date();
        this.startTime = date.getTime();
        this.endTime = null;
        this.timedOut = false;
        this.totalTime = null;
        var finishPingMeasure = function(){
            finishedCallback();
            finishedCallback = null;
        };
        setTimeout(function(){
            if(!finishedCallback)
            {
                return;
            }
            that.timedOut = true;
            finishPingMeasure();
        }, 5000);
        this.reply = function(){

        };
        this.end = function(){
            var date = new Date();
            this.endTime = date.getTime();
            if(finishedCallback)
            {
                finishPingMeasure();
            }
            return that.totalTime = that.endTime - that.startTime;

        };
    }
    PingMeasure.currentId = 1;


    function PingTester(pingtestFinished){
        var finishedCallback = function(){

        };
        var test = new PingMeasure(finishedCallback);
        this.measure = test;
        var tests = PingTester.pingTests;
        tests[test.id] = this;
        this.finished = function(reply){
            if(reply.id == test.id && reply.key == test.key)
            {
                console.log(test);
                return test.end();
            }
            else
            {
                throw 'Error this test did not belong to this reply';
            }
        };
        finishedCallback = function(){
            pingtestFinished(test);
            delete PingTester.pingTests[test.id];
            return test;
        };
    }
    PingTester.pingTests = {};

};

ServerMessageController.prototype.search_notifications = function(response){
  if(response.search_notifications)
  {
      let searchNotifications = response.search_notifications;
      myUser.getSearchNotifications().updateAll(searchNotifications);
  }
};
ServerMessageController.prototype.preferred_builds = function(response) {
    if(response.preferred_builds)
    {
        myUser.setProperties({'preferred_builds':response.preferred_builds});
    }
};
ServerMessageController.prototype.preferred_games = function(response) {
    if(response.preferred_games)
    {
        Dashboard.updatePreferredGames(response.preferred_games);
    }
};
ServerMessageController.prototype.chat_motd_update = function(response){
    var updated = response.chat_motd_update;
    if(chatRooms[updated.chat_room_id])
    {
        var chat = chatRooms[updated.chat_room_id];
        var description = chat.find('.chat_room_description');
        description.data('descriptionId', updated.description_id);
        if(updated.motd)
        {
            description.show();
            description.find('.description_message').html(updated.motd);
        }
        else
        {
            description.hide();
        }
    }

};
ServerMessageController.prototype.notification_queue = function(response){
    $.each(response.notification_queue,function(id,notification){
        var item = new UserNotificationQueueItem(notification);
        if(item && item.display)
        {
            item.display();
        }
    });
};
ServerMessageController.prototype.my_user = function(response){
    Users.update(response.my_user); //TODO: Verify that this is updating myUser....
};
ServerMessageController.prototype.friend_requests = function(response) {
    if(response.friend_requests.count > 0)
    {
        Dashboard.friendListButton.addClass('has_notifications');
    }
    else
    {
        Dashboard.friendListButton.removeClass('has_notifications');
    }
    if(response.friend_requests.new)
    {
        $.each(response.friend_requests.new, function(id, friendRequest){
            if(!Dashboard.pendingFriendRequests[id])
            {
                BrowserNotification.showNotification(
                    'Friend Request!',
                    {
                        body: friendRequest.username + ' wants to be friends!',
                        icon:friendRequest.selected_flair?Flair.retrieve(friendRequest.selected_flair).fullUrl:undefined,
                    }
                );

                var message = $('<span>');
                friendRequest = Users.update(friendRequest);
                message = message.append(friendRequest.createUsernameElement())
                    .append(' wants to be friends!');

                ChatActions.addNotificationToChat(null,message);
                Dashboard.pendingFriendRequests[id] = true;
            }

        });
    }
    if(response.friend_requests.accepted)
    {
        var friend = Users.update(response.friend_requests.accepted.player);
        var message = $('<span>');
        message = message.append(friend.createUsernameElement())
            .append(' accepted your friend request!');

        BrowserNotification.showNotification(
            'New Friend!',
            {
                body: friend.username + ' accepted your friend request!',
            }
        );

        ChatActions.addNotificationToChat(null,message);
    }
};
ServerMessageController.prototype.friend_online = function(response){
    $.each(response.friend_online,function(id,friend){
        Dashboard.friendListButton.trigger('updateFriend',[friend]);
    });
};
ServerMessageController.prototype.disputed_matches = function(response){
    LadderInfo.parseChanges('disputedMatches',response.disputed_matches);
};
ServerMessageController.prototype.searches = function(response){
    if(!matchmakingDisabled && isInLadder)
    {
        LadderInfo.parseChanges('matchSearches',response.searches);
    }
};
ServerMessageController.prototype.email_validated = function(response) {
    if(response.email_validated)
    {
        $('.email_validation_notification').trigger('email_validated');
    }
};
ServerMessageController.prototype.new_notification = function(response) {
    if(response.new_notification.achievement)
    {
        return;
        var achievement = response.new_notification.achievement;
        alert(achievement.title+' - '+achievement.description);
    }
    else
    {
        var notification = response.new_notification.notification;
        var unread = response.new_notification.unread;
        var append = $('#header_notification_bar .notification_bar_message.template').clone();
        append.removeClass('template');
        var otherContent = append.clone().html();
        append.html(notification.notification_text);
        append.append(otherContent);
        append.insertAfter($('#header_notification_bar .new_notifications_count'));
        $('.notification_bar_message').data('notification_id',notification.id);

        $('#header_notification_bar').trigger('updateUnreadCount',[unread]);
        var allMessages = $('#header_notification_bar .notification_bar_message').not('.template');
        if(allMessages.length > 5)
        {
            allMessages.last().remove();
        }

    }
};
ServerMessageController.prototype.top_donators = function(response){
    var donators = response.top_donators;
    Dashboard.subList.empty();
    $.each(donators, function(i, donator){
        donator = Users.update(donator);
        var element = $('<div>').addClass('latest_sub').append(
            donator.createUsernameElement()
        );
        let amount = $('<span>').addClass('amount');
        element.append(amount);
        amount.text(donator.total);
        if(!donator.total)
        {
            amount.remove();
        }
        element.appendTo(Dashboard.subList);
    });
};
ServerMessageController.prototype.sub_hype = function(response){
    if(!isInLadder)
    {
        return;
    }
    var hype = response.sub_hype;
    hype.user = Users.update(hype.user);
    console.log(hype.user);
    var user = hype.user;
    var playSound = false;
    let notificationBar = $('#notification-bar');
    notificationBar.removeClass();
    if(hype.classes && hype.classes.length)
    {
        notificationBar.addClass(hype.classes.join(' '));
    }

    if(hype.type == 'donation')
    {
        playSound = hype.play_sound;
        var love = '<3';
        if((hype.amount % 1).toFixed(2) == .69)
        {
            love = 'ヽ( ͡°╭​͜ʖ╮​͡° )ﾉ';
        }
        if(hype.amount >= 1)
        {
            playSound = true;
            BrowserNotification.showNotificationBar('Donation hype from '+user.username+'! $'+hype.amount.toFixed(2)+', '+love+'.');
        }
        else
        {
            BrowserNotification.showNotificationBar('Very low so no sound Donation hype from '+user.username+'! $'+hype.amount.toFixed(2)+', '+love+'.');
        }
    }
    else if(hype.type == 'subscription')
    {
        playSound = true;
        if(hype.is_latest_subscriber)
        {
            $('.latest_subscribers').trigger('addUser',[user]);
        }
        if(hype.user && hype.user.id == myUser.id)
        {
            alert('A Sub! That is you!');
            $('.donate.special_buttons').addClass('new_subscriber');
            $('.sub_hype_hype').addClass('done');
        }
        if(hype.message)
        {
            BrowserNotification.showNotificationBar(hype.message);
        }
        else
        {
            if(hype.gift_user)
            {
                BrowserNotification.showNotificationBar(hype.gift_user.username+ ' Gifted Sub Hype for '+user.username+'!');
            }
            else
            {
                if(hype.amount >= 50)
                {
                    BrowserNotification.showNotificationBar('Year Long Sub Hype! '+user.username+'! O.O!');
                }
                else
                {
                    BrowserNotification.showNotificationBar('Sub Hype! '+user.username+'! A New Pikachu Warrior is Born!');
                }
            }
        }
    }
    else if(hype.type == 'message')
    {
        playSound = hype.play_sound;
        BrowserNotification.showNotificationBar(hype.message);
    }

    if(!Settings.isChecked('sub_hype_notification_sound'))
    {
        return;
    }
    if((playSound && hype.amount >= 50) || hype.is_super_hype)
    {
        MatchSounds.playSubHypeSoundEffect('bumped');
    }
    else if(playSound)
    {
        MatchSounds.playSubHypeSoundEffect();
    }
};
ServerMessageController.prototype.rank_change = function(response) {
    if(!isInLadder)
    {
        return;
    }
    var notification = new MatchEndNotification($('.match_result_notification.template').clone().removeClass('template'), response.rank_change);
    var popup = $.fancybox({
        content:notification.getContent()
    });
    notification.start();
};
ServerMessageController.prototype.bug_notifications = function(response) {
    var notification = response.bug_notifications;
    var element = $('#header_bug_notification .new_bug_notification').text(notification.count);


    if(notification.count)
        element.show();
    else
        element.hide();
};
ServerMessageController.prototype.flagged_matches = function(response) {
    var notification = response.flagged_matches;
    if(typeof response.flagged_matches.count != 'undefined')
    {
        var element = $('#flagged_matches_notification_count').text(response.flagged_matches.count);
        if(notification.count)
            element.show();
        else
            element.hide();
    }
    
};
ServerMessageController.prototype.featured_streams = function(response) {
    var streamContainer = $('#stream_container');
    streamContainer.trigger('updateStreams',[response.featured_streams]);
};
ServerMessageController.prototype.mod_ban_notification = function(response) {
    var notification = response.mod_ban_notification;
    var count = notification.count;
    var element = $('#ban_appeal_notifications_count');

    if(typeof count != 'undefined')
    {
        if(count)
        {
            element.show();
        }
        else
        {
            element.hide();
        }
        element.text(count);
    }
    if(notification.is_new)
    {
        var notificationUser = Users.update(notification.bug.submitter);
        var chatNotification = BrowserNotification.showNotification(notificationUser.username+' Ban Discussion',
            {
                body: notification.bug.description,
                icon:siteUrl+'/images/random/BibleThump.jpg',
                onClick:function(){
                    window.open(notification.bug.url);
                }
            }).showInChatAlso(true);

        var usernameElement = notificationUser.createUsernameElement();
        var chatNotificationTitle = $('<span>').addClass('chat_notification_title').text(' (Ban Discussion) ');
        chatNotification.empty();

        var link = $('<a>').attr('href',notification.bug.url).attr('target','_blank');
        chatNotification.append(link);
        var lengthOfDescription = 70;
        var textSummaryString = notification.bug.description.length > lengthOfDescription ? notification.bug.description.substring(0,lengthOfDescription) + '...':notification.bug.description;
        link.append(usernameElement).append(chatNotificationTitle).append(' - ').append($('<span>').addClass('description_summary').text(textSummaryString)).attr('title',notification.bug.description);

        if(chatNotification.data('chatConatiner') && chatNotification.data('chatConatiner').data('reScroll'))
        {
            chatNotification.data('chatConatiner').trigger('reScroll');
        }
    }
};
ServerMessageController.prototype.mod_notifications = function(response) {
    var notification = response.mod_notifications;
    var container = $('#header_mod_notification');
    var element = container.find('.new_mod_notification').text(notification.count);

    if(notification.count)
    {
        container.addClass('has_notifications');
        element.show();
    }
    else
    {
        element.hide();
    }

    if(notification.is_new)
    {
        var notificationUser = Users.update(notification.bug.submitter);
        var chatNotification = BrowserNotification.showNotification(notification.bug.title+' Mod Notification',
            {
                body: notification.bug.description,
                icon:siteUrl+'/images/random/BibleThump.jpg',
                onClick:function(){
                    window.open(notification.bug.url);
                }
            }).showInChatAlso(true);
        if(chatNotification)
        {
            var usernameElement = notificationUser.createUsernameElement();
            var chatNotificationTitle = $('<span>').addClass('chat_notification_title').text(' (Report To Mods) ' + notification.bug.title+' ');
            chatNotification.empty();


            var link = $('<a>').attr('href',notification.bug.url).attr('target','_blank');
            chatNotification.append(link);
            var lengthOfDescription = 70;
            var textSummaryString = notification.bug.description.length > lengthOfDescription ? notification.bug.description.substring(0,lengthOfDescription) + '...':notification.bug.description;
            link.append(usernameElement).append(chatNotificationTitle).append(' - ').append($('<span>').addClass('description_summary').text(textSummaryString)).attr('title',notification.bug.description);

            if(chatNotification.data('chatConatiner') && chatNotification.data('chatConatiner').data('reScroll'))
            {
                chatNotification.data('chatConatiner').trigger('reScroll');
            }
        }
        MatchSounds.playModNotification();
    }
    else
    {
        if(notification.bug)
        {
            var bug = notification.bug;
            if(!bug.modified_by)
            {
                bug.modified_by = {};
            }
            if(bug.fixed)
            {
                BrowserNotification.showNotification(bug.title,
                    {
                        body:'Marked resolved by '+bug.modified_by.username
                    }
                    );
            }
            else
            {
                BrowserNotification.showNotification('Reopened Notification from '+bug.submitter.username+': '+bug.title,
                    {body: 'Opened by '+bug.modified_by.username});
            }
        }

    }
};
ServerMessageController.prototype.kicked_from_chat = function(response) {
    $('.chat_tab:not(.template)').each(function(i,tab){
        if($(tab).data('chat') && $(tab).data('chat').data('chat_room_id') == response.kicked_from_chat.id)
        {
            ChatActions.leaveChatRoom($(tab).data('chat'));
            //alert("You've been kicked from "+response.kicked_from_chat.name);
        }
    });
};
ServerMessageController.prototype.muted_from_chat = function(response) {
    if(response.muted_from_chat.id)
    {
        ChatActions.addNotificationToChat(null,"You've been muted in "+response.muted_from_chat.name +" until "+DateFormat.full(response.muted_from_chat.until)
            + ((response.muted_from_chat.reason)?" Reason: "+$('<div>').text(response.muted_from_chat.reason).text():''));
    }
    else
    {
        ChatActions.addNotificationToChat(null,"You've been muted from chatting until "+DateFormat.full(response.muted_from_chat.until)
            + ((response.muted_from_chat.reason)?" Reason: "+$('<div>').text(response.muted_from_chat.reason).text():''));
    }
};
ServerMessageController.prototype.acceptedAChallenge = function(response) {
    if(!matchmakingDisabled && isInLadder)
    {
        var searches = LadderInfo.retrieveReference('matchSearches');
        $.each(response.userChanges,function(i,user){
            var userId = user.id;
            $.each(searches.items,function(i,item){
                if(item.data.player1.id == userId)
                {
                    LadderInfo.forceRemove('matchSearches',item.data.id);
                }
            });

        });

    }
};
ServerMessageController.prototype.chat_rooms = function(response) {
    ChatActions.updateChatsFromInfo(response);
};
ServerMessageController.prototype.private_chat = function(response) {
    var newMessages = [];
    $.each(response.private_chat,function(userId,chat){
        var pmWindow;
        if(!chat.id)
        {
            chat.id = parseInt(userId);
        }
        pmWindow = PrivateChatLoader.getPrivateChat({id: chat.id, username: chat.username, chat:chat});

        if(!pmWindow)
        {
            return;//Window might not be initialized yet
        }
        var newMessage = Populate.chat(chat,pmWindow.data('chatHolder').find('.chat_container'));
        if(newMessage)
        {
            if(!pmWindow.hasClass('opened'))
            {
                pmWindow.addClass('has_new_messages');
            }
            else
            {
                Request.send({from_user:userId},'read_all_private_messages');
            }
            var directChatsElement = pmWindow.data('listing');
            if(directChatsElement)
            {
                directChatsElement.addClass('has_new_messages');
                var quickSummaryMessage;
                if(newMessage.player && newMessage.player.username)
                {
                    quickSummaryMessage = newMessage.player.username + ' - ' + newMessage.message;
                }
                else
                {
                    quickSummaryMessage = newMessage.message;
                }
                directChatsElement.find('.message_summary')
                    .text(quickSummaryMessage).attr('title',newMessage.message).removeClass('no_messages');
                directChatsElement.prependTo('#private_chat_listing');
                directChatsElement.find('.time').add(pmWindow.find('.time')).timestampUpdate(newMessage.time);
            }
            if(chat.username)
            {
                if(chat.notification)
                {
                    var chatUpdateMessage = BrowserNotification.showNotification(chat.notification.title, chat.notification);
                }
                if(pmWindow.hasClass('opened'))
                {
                    chatUpdateMessage = null;
                }
                if(chatUpdateMessage)
                {
                    chatUpdateMessage = chatUpdateMessage.showInChatAlso(true);
                    chatUpdateMessage.click(function(e){
                        if($(e.target).hasClass('username'))
                        {
                            return;
                        }
                        e.stopImmediatePropagation();

                        PrivateChatLoader.openPrivateChat({username:chat.username,id:chat.id}).load();
                    });
                    setTimeout(function(){
                        if(chat.notification && chat.notification.tag)
                        {
                            BrowserNotification.clearTag(chat.notification.tag);
                        }
                    },60000);
                    chatUpdateMessage.addClass('direct_chat_notification');
                    var messagePart = chatUpdateMessage.find('.message');
                    var username = newMessage.player.createUsernameElement();
                    messagePart.empty();
                    messagePart.append( $('<span>').addClass('chatlink').text('Direct Chat From '));
                    messagePart.append(username);
                    var messageText = $('<span>').addClass('chatlink');
                    messageText.text(' '+newMessage.message);
                    messagePart.append(messageText).addClass('chatlink');

                    if(chatUpdateMessage.data('chatConatiner') && chatUpdateMessage.data('chatConatiner').data('reScroll'))
                    {
                        chatUpdateMessage.data('chatConatiner').trigger('reScroll');
                    }
                }
            }
            PrivateChatLoader.appendChatElements(pmWindow);
            newMessages.push(newMessage);
        }
        PrivateChatLoader.updateUnreadPrivateMessageCount();

    });
    if(newMessages.length)
    {
        $.each(newMessages,function(i,message){
            if(message.player && message.player.id != myUser.id)
            {
                MatchSounds.playPrivateMessageSoundEffect();
                return false;
            }
        });

    }
};
ServerMessageController.prototype.current_matches = function(response) {
    if(matchmakingDisabled || !isInLadder)
        return;
    LadderInfo.parseChanges('currentMatches',response.current_matches);
};
ServerMessageController.prototype.open_challenges = function(response) {
    if(matchmakingDisabled || !isInLadder)
        return;
    LadderInfo.parseChanges('openChallenges',response.open_challenges);
};
ServerMessageController.prototype.awaiting_replies = function(response) {
    if(matchmakingDisabled || !isInLadder)
        return;
    LadderInfo.parseChanges('awaitingReplies',response.awaiting_replies);
};
ServerMessageController.prototype.userChanges = function(response) {
    var matches = LadderInfo.retrieveReference('currentMatches');
    $.each(response.userChanges,function(i,user){
        user = Users.update(user);
        user.updateElements();
        //var elements = PlayerUpdater.getPlayerListElementsByPlayerId(user.id);
        //elements.each(function(){
        //	var element = $(this);
        //	ElementUpdate.user(element,user);
        //});

        ladder.log(matches);
        //$.each(matches.items,function(i,container){
        //	container = container.element;
        //	ladder.log('container to update');
        //	ladder.log(container);
        //
        //});
    });
};
ServerMessageController.prototype.recent_private_chats = function(response) {
    LadderInfo.parseChanges('recentPrivateMessages',response.recent_private_chats);
};
ServerMessageController.prototype.chat_events = function(response) {
    if(response.chat_events)
    {
        var events = response.chat_events;
        if(events.invited)
        {
            $.each(events.invited,function(chatId,event){
                var chat = 	event.chat;
                var invitee = Users.update(event.by);

                var container = $('<span>');
                var usernameElement = invitee.createUsernameElement();
                var chatElement =  $('<span>').addClass('chatlink').text("You've been invited to "+chat.name+ " by ").data('chatlink',chat.name);
                container.append(chatElement).append(usernameElement);
                ChatActions.addNotificationToChat(null,container);
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
ServerMessageController.prototype.stub = function(response) {
};

export var ServerMessage = new ServerMessageController();



/** WEBPACK FOOTER **
 ** ./../components/ServerMessageController.jsx
 **/