export var User_Chat_Rooms = function(data){
    if(typeof data === 'undefined')
    {
        return;
    }
    this.setProperties(data);
    return this;
};
User_Chat_Rooms.prototype.setProperties = function(data) {
    var i;
    for(i in data)
    {
        if (data.hasOwnProperty(i))
        {
            this[i] = data[i];
        }
    }
};
User_Chat_Rooms.prototype.isMod = function(chatRoomId){
    return this[chatRoomId] && this[chatRoomId].is_chat_mod;
};
User_Chat_Rooms.prototype.isAdmin = function(chatRoomId){
    return this[chatRoomId] && this[chatRoomId].is_chat_admin;
};


/** WEBPACK FOOTER **
 ** ./../components/User_Chat_Rooms.jsx
 **/