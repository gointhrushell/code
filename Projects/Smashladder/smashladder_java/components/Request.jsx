import {Dashboard} from "../components/Dashboard";

export  var Request = {
    post: function(url,data,callback){
        if(!data)
            data = {};
//			data.ladder_id = gameId;
        return $.post(url,data,callback).error(function(){
            callback({success:false,serverError:true});
        });
    },
    generalSend: function(data, url, callback, errorCallback){
        return Request.post(url,data,function(response){

            if(callback)
            {
                var result = callback(response);
                if(result === true)
                {
                    Dashboard.performOpenSearchUpdate(response);
                }
            }
        }).then(null, function(){
            if(errorCallback)
            {
                errorCallback();
            }
        });
    },
    api: function(data, action, callback, errorCallback){
        return Request.generalSend(data, siteUrl+'/apiv1/'+action, callback, errorCallback);
    },
    send: function(data,action,callback, errorCallback){
        return Request.generalSend(data, siteUrl+'/matchmaking/'+action, callback, errorCallback);
    },
    socket: function(data, callback, errorCallback){
       Dashboard.serverConnection.send(data);
        alert('sending?!');
    }
};


/** WEBPACK FOOTER **
 ** ./../components/Request.jsx
 **/