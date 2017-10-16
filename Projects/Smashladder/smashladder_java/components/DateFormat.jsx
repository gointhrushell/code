import "../addons/date-format.jsx";
export var DateFormat = {
    custom: function(timestamp,format){
        return new Date(timestamp*1000).format(format);
    },
    small: function(timestamp){
        return new Date(timestamp*1000).format('g:ia');
    },
    hourMinutes: function(timestamp){
        return new Date(timestamp*1000).format('g:i.sa');
    },
    monthDayYear: function(timestamp){
        return new Date(timestamp*1000).format('M j, Y');
    },
    full:function(timestamp){
        return new Date(timestamp*1000).format('M j, Y g:i.sa');
    },
    daySmall:function(timestamp){
        return new Date(timestamp*1000).format('M-j');
    },
    day:function(timestamp){
        return new Date(timestamp*1000).format('j');
    },
    smart:function(timestamp, datesOnly){
        if(typeof datesOnly == 'undefined')
        {
            datesOnly = false;
        }
        var $time = new Date(timestamp*1000);
        var $current = new Date();

        var diffHours = DateFormat.diffHours($current,$time);
        var diffDays = DateFormat.diffDays($current,$time);
        var diffMinutes = DateFormat.diffMinutes($current,$time);
        if($current.format('Y') != $time.format('Y'))
        {
            if(DateFormat.diffDays($current,$time) < 365)
            {
                return $time.format("M j 'y");
            }
            else
            {
                return $time.format('M \'y');
            }
        }
        if($time > $current)
        {
            return $time.format("M j 'y");
        }
        if($current.format('m') != $time.format('m'))
        {
            return $time.format('M j');
        }
        if(diffDays < 1 && !datesOnly)
        {
            if(diffHours)
            {
                return diffHours + 'h';
            }
            if(diffMinutes)
            {
                return diffMinutes + 'm';
            }
            return 'Just Now';
        }
        if(diffDays == 0 && diffHours <=23 && diffHours > 0)
        {
            return diffHours + 'h';
        }
        return $time.format('M j');
    },

    diffDays: function(firstDate,secondDate){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    },
    diffMinutes: function(firstDate,secondDate){
        var oneDay = 60*1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    },
    diffHours: function(firstDate,secondDate){
        var oneDay = 60*60*1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    }
};


/** WEBPACK FOOTER **
 ** ./../components/DateFormat.jsx
 **/