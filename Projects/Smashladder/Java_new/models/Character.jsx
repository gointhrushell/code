import {CacheableDataObject} from './CacheableDataObject.jsx';

class Character extends CacheableDataObject
{
    generateElement(){
        var character = this;
        var characterImage = $('<div>').addClass('character')
            .addClass('character_for_game_'+character.game_slug)
            .addClass('character_name_'+character.slug_name)
            .addClass('character_id_'+character.id)
            .data('id', character.id)
            .data('name', character.name)
            .attr('title',character.name)
            .css('background-image','url('+character.image_url+')');

        let nameContainer = $('<span>').addClass('name').text(character.name);
        nameContainer.appendTo(characterImage);
        if(character.percent)
        {
            var percentage = $('<span>').addClass('badge percentage').text(character.percent);
            percentage.appendTo(characterImage);
        }
        return characterImage;
    }

    static newInstance(){
        return new Character();
        // character character_for_game_sm4sh-3ds character_id_105 character_name_pikachu
        //character character_for_game_sm4sh-3ds character_name_pikachu character_id_105
    }
}

export {Character};


/** WEBPACK FOOTER **
 ** ./../models/Character.jsx
 **/