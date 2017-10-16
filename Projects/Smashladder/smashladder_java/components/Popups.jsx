
export var Popups = {
    modMatchHistoryFromPlayerId: function(playerId){
        var url = siteUrl+'/match/recent_matches/id/'+playerId+'/mod';
        return Popups.matchHistory(url);
    },
    matchHistoryFromPlayerId: function(playerId){
        var url = siteUrl+'/match/recent_matches/id/'+playerId;
        return Popups.matchHistory(url);
    },
    matchHistoryFromUsername: function(username){
        var url = siteUrl+'/match/recent_matches/username/'+username;
        return Popups.matchHistory(url);
    },
    matchHistory:function(url,callback){
        return Popups.ajax(url,null,callback);
    },
    matchmakingAjax:function(data,action,callback){
        var url = siteUrl+'/matchmaking/'+action;
        Popups.ajax(url,data,callback);
    },
    ajax: function(url,data,callback){
        var content = $('.popup_loading_popup').clone();
        var xhr = null;
        $.fancybox({content:content,

            onComplete: function(){
                xhr = $.post(url ,data,function(response){
                    xhr = null;
                    if(response.success)
                    {
                        var innerContent = $(response.html);
                        if(callback)
                        {
                            callback(response,innerContent);
                        }
                        $.fancybox({
                            content:innerContent
                        });
                    }
                    else
                    {
                        if(response.error)
                        {
                            $.fancybox({
                                content:response.error
                            });
                        }
                    }
                }).error(function(){
                    $.fancybox({
                        content:"Error!"
                    });
                });
            },
            onClosed : function(){
                if(xhr)
                    xhr.abort();
            }
        });
    },
    match: function(matchId){
        var url = siteUrl+'/match/view/'+matchId+'/ajax';
        return Popups.matchHistory(url);
    }
};


/** WEBPACK FOOTER **
 ** ./../components/Popups.jsx
 **/