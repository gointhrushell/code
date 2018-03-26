import {ChatActions} from "../components/ChatActions";
export var ChatMessage = function(data){
    this.sender = null;
    this.timestamp = null;
    this.element = null;
    this.inserted = false;
    this.setProperties(data);
};
ChatMessage.prototype.getContext = function(){
    return {
        player_id:this.player.id,
        chat_room_id:this.chat_room_id,
        message_id:this.id,
        match_id:this.match_id
    };
};
ChatMessage.prototype.setProperties = function(data) {
    var i;
    for(i in data)
    {
        if (data.hasOwnProperty(i))
        {
            this[i] = data[i];
        }
    }
};
ChatMessage.prototype.renderChatElement = function(){
    if(this.element)
    {
        return this.element;
    }
    this.element = ChatMessage.newElement();
    this.element.data('message',this.message);
    this.element.data('senderElement').applyUsernameClasses(this.sender).text(this.sender.username);
    this.element.data('message').text(this.message.message);
    this.element.data('timeElement').text(this.message.time);
};
ChatMessage.newElement = function(){
    var element =  ChatActions.getChatMessageTemplate();
    element.data('controlsElement',element.find('.delete_holder'));
    element.data('timeHolderElement',element.find('.time_holder'));
    element.data('timeElement',element.find('.time'));
    element.data('senderElement',element.find('.sender'));
    element.data('message',null);
    return element;
};
ChatMessage.prototype.isChatMod = function(){
  return this.is_chat_mod || this.is_chat_admin;
};



/** WEBPACK FOOTER **
 ** ./../models/ChatMessage.jsx
 **/