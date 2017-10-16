import {ladder} from "components/Ladder";

export var Timer = function(element,timeRemaining,callback,shouldUpdateTextElementCallback){
    this.element = element;
    this.id = Timer.timerIds++;
    this.changeTimeRemaining(timeRemaining);
    this.callback = callback;
    this.shouldUpdateTextElementCallback = shouldUpdateTextElementCallback;
    var $this = this;
    Timer.timers[this.id] = this;
    Timer.generalLoop();
    $this.updateCountdown();
    element.data('attachedCountdown',this);
};
Timer.generalLoopStarted = false;
Timer.generalLoop = function(){
    if(Timer.generalLoopStarted)
    {
        return;
    }
    Timer.interval = setInterval(function(){
        $.each(Timer.timers,function(i,timer){
            timer.updateCountdown();
        });
    },1000);
    Timer.generalLoopStarted = true;
};
Timer.timerIds = 1;
Timer.timers = {};
Timer.interval = null;

Timer.prototype.changeTimeRemaining = function(timeRemaining){
    this.timeRemaining = timeRemaining;
    this.expirationTimestamp = new Date();
    this.expirationTimestamp.setTime(this.expirationTimestamp.getTime()+(timeRemaining*1000));
};
Timer.endCountdown = function(element){
    var countdown = element.data('attachedCountdown');
    if(countdown)
    {
        element.data('attachedCountdown',null);
        countdown.expirationTimestamp = null;
        countdown.updateCountdown();
    }
    else
    {
    }
};
Timer.prototype.updateCountdown = function(){
    if(this.expirationTimestamp)
    {
        var now = new Date();
        var difference = (this.expirationTimestamp.getTime() - (now.getTime())) / 1000;

        if(difference > 0 && this.expirationTimestamp)//If timeout is NaN or undefined we quit
        {
            if(!this.shouldUpdateTextElementCallback || this.shouldUpdateTextElementCallback())
            {
                this.element.text(Math.floor(difference));
            }
            return true;
        }
    }
    this.element.text('0');
    delete Timer.timers[this.id];
    if(this.callback)
    {
        this.callback();
    }
    this.element.data('attachedCountdown',null);
    return false;
};


/** WEBPACK FOOTER **
 ** ./../components/Timer.jsx
 **/