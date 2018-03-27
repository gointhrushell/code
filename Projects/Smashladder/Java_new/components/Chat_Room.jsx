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
User_Chat_Rooms.prototype.makeChatTab = function(){
	console.log(this);
};
User_Chat_Rooms.prototype.chatTabExists = function(chatRoomId){
	return this[chatRoomId] && this[chatRoomId].is_chat_admin;
};


/** WEBPACK FOOTER **
 ** ./../components/Chat_Room.jsx
 **/