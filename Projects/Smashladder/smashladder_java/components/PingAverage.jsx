export function PingAverage(){
    var pingList = [];
    var pingAverage = null;
    var pingListSize = 10;
    var actualAverage = null;
    var that = this;
    this.getAverage = function(){
        return actualAverage;
    };
    this.add = function(amount){
        var total = 0;
        pingList.push(amount);
        if(pingList.length > 10)
        {
            pingList.shift();
        }
        for(var i = 0; i < pingList.length; i++)
        {
            total += pingList[i];
        }
        if(total > 0)
        {
            actualAverage = total / pingList.length;
        }
        else
        {
            actualAverage = 0;
        }
        return that;
    }
}


/** WEBPACK FOOTER **
 ** ./../components/PingAverage.jsx
 **/