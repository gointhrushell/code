import {Request} from "../components/Request";
import {Dashboard} from "../components/Dashboard"


var idleSpeed = 120000;
//	var idleSpeed = 10000;
var slowSpeed = 15000;
var defaultSpeed = 3000;
var highSpeed = 2000;

var refreshTimeout;
var lastUpdateInterval = 5000;
var gaUpdate = 0;
var chatUpdate = 0;
var userActive = 5;


var updateXhr = null;
export var DisplayUpdater = {
    pause: function(){
        if(refreshTimeout)
        {
            clearTimeout(refreshTimeout);
        }
        refreshTimeout = null;
    },
    reset: function(time){
        if(!time)
            time = lastUpdateInterval;
        lastUpdateInterval = time;
        if(!lastUpdateInterval)
            lastUpdateInterval = highSpeed;


        if(refreshTimeout)
            clearTimeout(refreshTimeout);


        if(userActive)
        {
            //Check more frequently if the user has been active
            lastUpdateInterval = highSpeed;
            userActive--;
            gaUpdate = 1;
        }
        else if(DisplayUpdater.isIdle())
        {
            //Check every minute and a half give or take if a user is idle
            var randomInterval = Math.round(Math.random() * (10000));
            lastUpdateInterval =  idleSpeed + randomInterval;
        }
        else if(DisplayUpdater.isSlow())
        {
            lastUpdateInterval = slowSpeed;
        }
        else
        {
            lastUpdateInterval = defaultSpeed;
        }
        Dashboard.playedSoundEffect = false;
        refreshTimeout = setTimeout(DisplayUpdater.update,  lastUpdateInterval);
    },
    cancel: function(){
        if(updateXhr)
        {
            updateXhr.abort();
        }
    },
    update: function(){
        DisplayUpdater.reset();

        Dashboard.playedSoundEffect = false;
    },
    userIsActive: function(count){
        count = count || 10;
        userActive = count;//10 fast requests ;]
    },
    userIsNotIdle: function(){
        if(DisplayUpdater.isIdle() /* && instanceCode !== false */)
        {
//				addNotificationToChat($('.chat_container.main'),'You are no longer idle.');
            return;
            Request.send({idle:0},'idle');
        }
        idleTime = 0;
    },
    idleTimer: function(){
        idleTime++;
        //Every idletime is = 10 seconds
        if (DisplayUpdater.justBecameIdle())
        {
            return;
//				addNotificationToChat($('.chat_container.main'),'You are now idle.');
            Request.send({idle:1},'idle');
        }
    },
    isSlow:function(){
        return idleTime >= isSlowLimit;
    },
    isIdle:function(){
        return idleTime >= isIdleLimit;
    },
    justBecameIdle:function(){
        return idleTime == isIdleLimit;
    }

};

var isIdleLimit = 30; // 5 minutes = 30
var isSlowLimit = 4; // 1 minute = 6
var idleTime = 0;
var idleInterval = setInterval(DisplayUpdater.idleTimer, 10000);

//$(window).mousemove(function(e){
//	DisplayUpdater.userIsNotIdle();
//});


/** WEBPACK FOOTER **
 ** ./../components/DisplayUpdater.jsx
 **/