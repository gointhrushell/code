export var ChatNotification = function(message){
    if(!type)
    {
        this.type = ChatNotification.types[ChatNotification.TYPE_NORMAL];
    }
    this.html = function(){

    };
};
ChatNotification.types = {
    TYPE_NORMAL:{class:'chat_notification_type_normal'},
    TYPE_ALERT:{class:'chat_notification_type_alert'}
};


/** WEBPACK FOOTER **
 ** ./../models/ChatNotification.jsx
 **/