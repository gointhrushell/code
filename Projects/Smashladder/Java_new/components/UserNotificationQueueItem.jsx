import {ChatActions} from "ChatActions";
import {LadderInfo} from "./LadderInfo.jsx";
import {Match} from "../models/Match.jsx";

PNotify.prototype.options.styling = "fontawesome";
PNotify.prototype.options.confirm.buttons = [];
//var pNotifyStack =  {"dir1": "right", "dir2": "up", "push": "top"};
export var UserNotificationQueueItem = function(data){
    this.title = data.title;
    this.message = $.trim(data.message);
    this.acceptUrl = data.accept_url;
    this.declineUrl = data.decline_url;
    this.followUrl = data.follow_url;
    this.type = data.type;
    this.data = data.data;
    var that = this;

    if(data.id)
    {
        if(UserNotificationQueueItem.displayedItems[data.id])
        {
            return;
        }
        else
        {
            UserNotificationQueueItem.displayedItems[data.id] = true;
        }
    }
    else
    {
    }

    this.display = function(){
        var notifyOptions = {
            title: that.title,
            text: that.message,
            buttons: {
                closer: true,
                sticker: false
            },
            history: {
                history: true,
                maxonscreen:6
            },
            confirm: {
                confirm: true
            },
            icon: false,
            animate_speed:50,
            position_animate_speed: 300,
            insert_brs:false,
            title_escape:true,
            text_escape:true,
            delay: null,
            hide:false,
            mobile:{
                swipe_dismiss:true,
                styling:true
            }
            //stack:pNotifyStack,
        };
        if(that.type == UserNotificationQueueItem.types.TYPE_CHAT_INVITE)
        {
            notifyOptions.confirm = {
                confirm:true,
                buttons:[
                    {
                        text: 'Accept Invite',
                        click: function (notice) {
                            notice.remove();
                            if(that.type == UserNotificationQueueItem.types.TYPE_CHAT_INVITE)
                            {
                                ChatActions.joinChatRoom(that.data.chat_room.name);
                            }
                        }
                    },
                    {
                        text:'Decline Invite',
                        click: function(notice, value){
                            $.post(that.declineUrl);
                            notice.remove();
                        }
                    }
                ]
            };
        }
        if(that.acceptUrl)
        {
            if(that.rejectUrl)
            {
                notifyOptions.confirm = {
                    confirm:true
                };

            }
            else
            {
                notifyOptions.confirm = {
                    confirm:false
                };
                notifyOptions.buttons.closer = true;
                notifyOptions.after_close= function(PNotify, timer_hide) {
                    $.post(that.acceptUrl);
                }
            }
        }

        if(that.type == UserNotificationQueueItem.types.TYPE_WALL_POST ||
            that.type == UserNotificationQueueItem.types.TYPE_BLOG_REPLY||
            that.type == UserNotificationQueueItem.types.TYPE_BUG_POST ||
            that.type == UserNotificationQueueItem.types.TYPE_GROUP_POST)
        {
            notifyOptions.text_escape = false;
            notifyOptions.text = that.message;
        }

        if(that.type == UserNotificationQueueItem.types.TYPE_INFRACTION)
        {
            notifyOptions.hide = false;
        }
        if(that.followUrl)
        {
            notifyOptions.title = false;
            notifyOptions.confirm = {
                confirm:true,
                buttons:[
                    {
                        text: 'Close',
                        click: function (notice, value) {
                            notice.remove();
                        },
                        'addClass':'btn-sm'
                    }
                ]
            };
            notifyOptions.addclass = "clickable-notice";
        }
        var notice = new PNotify(notifyOptions);
        if(that.followUrl)
        {
            notice.get().click(function(e){
                if ($(e.target).is('.ui-pnotify-closer *, .ui-pnotify-sticker *, button, .username'))
                    return;
                if(isInLadder)
                {
                    e.preventDefault();
                    window.open(that.followUrl, '_blank');
                }
                else
                {
                    window.location(that.followUrl);
                }
                if(that.acceptUrl)
                {
                    $.post(that.acceptUrl);
                    notice.remove();
                }
            });
        }
    };
};
UserNotificationQueueItem.types = {
    TYPE_CHAT_INVITE:1,
    TYPE_INFRACTION:2,
    TYPE_WALL_POST:3,
    TYPE_BLOG_REPLY:4,
    TYPE_BUG_POST:5,
    TYPE_GROUP_POST:6,
    TYPE_MATCH_INVITE:7
};
UserNotificationQueueItem.displayedItems = {

};


/** WEBPACK FOOTER **
 ** ./../components/UserNotificationQueueItem.jsx
 **/