

export var Character = function(data){
    this.data = data;
};

Character.prototype.generateElement = function(){
    var character = this.data;

    var characterImage = $('<div>').addClass('character')
        .addClass('character_for_game_'+character.game_slug)
        .addClass('character_name_'+character.slug_name)
        .addClass('character_id_'+character.id)
        .attr('title',character.name)
        .css('background-image','url('+character.image_url+')');
    if(character.percent)
    {
        var percentage = $('<span>').addClass('badge percentage').text(character.percent);
        percentage.appendTo(characterImage);
    }
    return characterImage;
};


/** WEBPACK FOOTER **
 ** ./../models/Character.jsx
 **/