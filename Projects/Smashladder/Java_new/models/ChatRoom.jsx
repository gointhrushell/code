export class ChatRoom{


	constructor(data){
		var info = this;
		$.each(data, function(key, value){
			info[key] = value;
		});
		this.button = null;
		this.listEntry = null;
		this.isLinkOnly = null;
	}

	getUrl(){
		return siteUrl+'/netplay/'+encodeURIComponent(this.name);
	}

	addToList(listElement, cache){
		let list = listElement.findCache('.chat_tab_mover');
		let button = this.makeChatButtonFromTemplate();
		list.append(button);
		cache.set(this.id, this);
		this.listEntry = cache;
		listElement.addClass('active');
		return button;
	}

	addToActiveList(){
		this.isLinkOnly = false;
		if(ChatRoom.featuredChats.has(this.id))
		{
			ChatRoom.featuredChats.get(this.id).removeFromList();
		}
		return this.addToList($('#basic_chats'), ChatRoom.activeChats);
	}

	addToRecentList(){
		this.isLinkOnly = true;
		if(ChatRoom.recentChats.has(this.id))
		{
			return;
		}
		return this.addToList($('#recent_chats'), ChatRoom.recentChats);
	}

	addToFeaturedList(){
		this.isLinkOnly = true;
		if(ChatRoom.activeChats.has(this.id) || ChatRoom.featuredChats.has(this.id))
		{
			return;
		}
		return this.addToList($('#featured_chats'), ChatRoom.recentChats);
	}

	removeFromList(){
		let cache = this.listEntry;
		cache.delete(this.id);
		this.button.remove();
		if(cache === ChatRoom.activeChats)
		{
			this.addToRecentList();
		}
	}

	makeChatButtonFromTemplate(chatList, preferredChatId){
		let chatInfo = this;

		let button = null;
		if(this.button)
		{
			button = this.button;
		}
		else
		{
			button = ChatRoom.chatTabTemplate.clone();
		}

		button.addClass('public_room');
		button.data('chatInfo', this);
		button.data('order',chatInfo.order);

		if(chatInfo.id == preferredChatId)
		{
			ChatRoom.preferredChat = this;
			button.addClass('preferred_chat');
		}

		if(chatInfo.has_ladder)
		{
			button.addClass('has_ladder');
			button.data('has_ladder',true);
			button.data('ladder_id',chatInfo.ladder_id);
			if(chatInfo.ladder.small_image)
			{
				button.addClass('has_logo');
				button.find('.chat_logo').addClass('active').attr('src', chatInfo.ladder.small_image);
			}
		}
		else
		{
			button.removeClass('has_ladder');
			button.data('has_ladder',false);
		}

		button.find('.name').text(chatInfo.name);
		button.attr('title',chatInfo.name);

		if(chatInfo.summary_description)
		{
			button.find('.description').text(chatInfo.summary_description).addClass('active');
			button.attr('title', chatInfo.summary_description);
		}
		else
		{
			button.find('.description').text('').removeClass('active');
		}

		if(this.isLinkOnly)
		{
			button.addClass('chatlink');
			button.data('chatlink', chatInfo.name);
		}
		button.find('a').attr('href',chatInfo.getUrl());

		return this.button = button;
	}
}
$('#basic_chats').addClass('active');
ChatRoom.activeChats = new Map();
ChatRoom.featuredChats = new Map();
ChatRoom.recentChats = new Map();

ChatRoom.preferredChat = null;

ChatRoom.setChatTabTemplate = function(template){
	ChatRoom.chatTabTemplate = template;
};


/** WEBPACK FOOTER **
 ** ./../models/ChatRoom.jsx
 **/