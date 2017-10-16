class PreferredGame
{
    constructor(data){
        this.element = null;
        for(var i in data){
            if(!data.hasOwnProperty(i))
            {
                continue;
            }
            this[i] = data[i];
        }
    }

    getElement(){
        if(this.element)
        {
            return this.element;
        }
        this.element = PreferredGame.template.clone().attr('id', 'preferred_game_filter_'+this.id);

        this.element.attr('title','Start Matchmaking for '+this.name);
        this.element.data('enabled', this.filtered_on ? 1 : 0);
        this.element.data('game-short-name', this.slug);
        this.element.attr('data-order_by', this.order_by);
        this.element.data('preferred_distance_matters', this.preferred_distance_matters)
        this.element.data('id', this.id);
        if(this.filtered_on)
        {
            this.element.addClass('on');
        }
        else
        {
            this.element.removeClass('on');
        }
        this.element.find('.filter_image').attr('src', this.small_game_filter_image_url);
        this.element.data('object', this);
        return this.element;
    }

}
PreferredGame.template = $('#preferred_game_filter_template').detach().attr('id','');
PreferredGame.initEvents = function(){
    var preferredGamesContainer = $('.preferred_games');
    if(!preferredGamesContainer.length)
    {
        return;
    }

    preferredGamesContainer.on('click','.game', function(e){
        var target = $(e.target);
        if(target.hasClass('game_selection') ||
            target.hasClass('description') ||
            target.hasClass('game_selection') ||
            target.closest('label').length ||
            target.closest('.description').length)
        {
            return;
        }
        $(this).find('.game_selection').trigger('click');
    }).on('change', '.game_selection', function(e){
        if($(this).is(':checked')){
            $(this).closest('.game').addClass('active');
        }
        else
        {
            $(this).closest('.game').removeClass('active');
        }
    });

    preferredGamesContainer.find('.game_selection').each(function(i,checkbox){
        $(this).trigger('change');
    });
};

PreferredGame.initEvents();
export {PreferredGame};


/** WEBPACK FOOTER **
 ** ./../models/PreferredGame.jsx
 **/