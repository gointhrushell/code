import {Dashboard} from "../components/Dashboard.jsx";

export var Ladder = function(){
    this.logging = IS_LOCALHOST;
    Ladder.consumeAlert();
    this.log = function(message,fThePolice){
        if(!console || !console.log)
        {
            return;
        }
        if(fThePolice || ladder.logging)
        {
            if(console.trace)
            {
                console.trace(message);
            }
        }
    };
    var ladder = this;
    return this;
};
 Ladder.consumeAlert = function(){
     if (Ladder._alert) return;
     Ladder._alert = window.alert;
     window.alert = Ladder.coolAlert;
     window.coolAlert = window.alert;
 };
 Ladder.releaseAlert = function(){
     if (!Ladder._alert) return;
     window.alert = _alert;
     Ladder._alert = null;
 };
 Ladder.realAlert = function(message){
   if(Ladder._alert)
   {
       return Ladder._alert(message);
   }
   else
   {
       window.alert(message);
   }
 };
 Ladder.coolAlert = function(message, title){
     if(typeof title == 'undefined')
     {
         title = 'Alert';
     }
     new PNotify({
         title: title,
         text: message,
         buttons:{
             sticker: false,
             show_on_nonblock: true
         },
         nonblock: {
             nonblock: false,
             nonblock_opacity: .4
         },
     });
 };
 Ladder.alert = Ladder.coolAlert;
 Ladder.declickables = [];
 export var ladder = new Ladder();
var LadderLocalStorage = function() {
    if(!localStorage)
    {
        window.localStorage = {};
        localStorage.setItem = function(){};
        localStorage.getItem = function(){};
        localStorage.removeItem = function(){};
    }
};
 LadderLocalStorage.prototype.setItem = function(key, object){
     return localStorage.setItem(key, JSON.stringify(object));
 };
 LadderLocalStorage.prototype.getItem = function(key){
    return JSON.parse(localStorage.getItem(key));
 };
 LadderLocalStorage.prototype.incrementKey = function(key) {
     if (!localStorage.getItem(key)) {
         localStorage.setItem(key, 0);
     }
     localStorage.setItem(key,
         parseInt(localStorage.getItem(key)) + 1
     );
     return this.getIntValue(key);
 };
 LadderLocalStorage.prototype.getIntValue = function(key) {
     return parseInt(localStorage.getItem(key));
 };
 LadderLocalStorage.prototype.removeItem = function(key){
     return localStorage.removeItem(key);
 };
 export var ladderLocalStorage = new LadderLocalStorage();


/** WEBPACK FOOTER **
 ** ./../components/Ladder.jsx
 **/