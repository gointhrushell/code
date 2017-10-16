import {League} from "models/League";

export var MatchEndNotification = function(element, data){
    this.element = element;
    this.data = data;
    this.win = this.data.win;

    var notification = this;

    this.element.find('.promotion_text');
    this.element.find('.placement_summary');

    var from = new League(this.data.from_league);
    var to = new League(this.data.to_league);


    var league = this.element.find('.league');
    league.find('.before').attr('src',from.image_url).addClass(from.getClassName());
    league.find('.after').attr('src',to.image_url).addClass(to.getClassName());


    if(this.data.games_remaining_for_league)
    {
        element.find('.games_remaining').text(this.data.games_remaining_for_league);
        element.addClass('placement');
    }
    else
    {
        var previousPoints;
        if(from.name)
        {
            element.find('.previous_division .division').text(from.name +' '+from.division);
            previousPoints = element.find('.previous_division .points').text(from.points).data('to',null).data('from',from.points);
        }
        else
        {
            element.addClass('just_placed');
            element.find('.previous_division .division').text("");
            previousPoints = element.find('.previous_division .points').text("").data('to',null).data('from',from.points);

        }


        element.find('.current_division .division').text(to.name +' '+to.division);
        var points = element.find('.current_division .points').text(to.points).data('to',to.points);

        if(this.sameDivision())
        {
            points.data('from',from.points);
            element.find('.divisions_container').addClass('skipped');
        }
        else //New
        {
            if(this.win)
            {
                points.data('from',0).text(0);
                previousPoints.data('to',100);
            }
            else
            {
                points.data('from',100).text(100);
                previousPoints.data('to',0);
            }
        }
    }

    if(this.win)
    {
        element.addClass('win');
    }
    else
    {
        element.addClass('loss');
    }
    return this;
};
MatchEndNotification.prototype.sameTier = function(){
    return this.data.difference === 0;
};
MatchEndNotification.prototype.sameDivision = function(){
    return this.sameTier() && this.data.to_league.division_number == this.data.from_league.division_number;
};
MatchEndNotification.prototype.getContent = function() {
    return this.element;
};
MatchEndNotification.prototype.start = function(){
    var notification = this;
    var element = notification.element;
    var divisionContainer = notification.element.find('.divisions_container');
    var previousPoints = element.find('.previous_division .points');
    if(!notification.sameDivision() && previousPoints.data('from') !== null)
    {
        previousPoints.countTo({
            from:previousPoints.data('from'),
            to:previousPoints.data('to'),
            speed: 1000
        });
    }

    setTimeout(function(){
        if(!notification.sameTier())
        {
            notification.element.find('.placement_summary .league').addClass('transition');
        }
        divisionContainer.addClass('flipped');
        setTimeout(function(){
            var points = element.find('.current_division .points');
            if(points.data('to') !== null)
            {
                points.countTo({
                    from:points.data('from'),
                    to:points.data('to'),
                    speed: 1500
                });
            }
        },notification.sameDivision()?100:1000);

    },notification.sameDivision()?100:1000);

    return this;
};


/** WEBPACK FOOTER **
 ** ./../components/MatchEndNotification.jsx
 **/