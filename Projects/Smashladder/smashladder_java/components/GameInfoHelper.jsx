import {Match} from "../models/Match";
import {Users} from "../app/matchmaking.jsx";

export var GameInfoHelper = {
    setContainerToCharacter: function(container,character, findContainers){
        if(character)
        {
            container.removeClass('empty');
        }
        else
        {
            container.addClass('empty');
            return;
        }
        var picksContainer = container.closest('.picks_container');
        var myCharacterContainer = GameInfoHelper.characterElement(picksContainer,character);

        if(typeof findContainers == 'undefined')
        {
            findContainers = true;
        }
        if(findContainers)
        {
            container.find('.character_holder:first').css('background-image',myCharacterContainer.css('background-image'));
            container.find('.character_name:first').text(myCharacterContainer.data('name'));
        }
        else
        {
            container.css('background-image',myCharacterContainer.css('background-image'));
        }
        return myCharacterContainer.data();
    },
    setContainerToStage: function(container,stage){
        if(stage)
        {
            container.removeClass('empty');
        }
        else
        {
            container.addClass('empty');
            return;
        }

        if(stage.id)
        {
            let backgroundCss = 'url("' + stage.image_url+ '")';
            if(container.findCache('.stage_holder').data('background-image') != backgroundCss)
            {
                console.log('previous', container.findCache('.stage_holder').data('background-image') );
                console.log('Changing background image', backgroundCss);
                container.findCache('.stage_holder').data('background-image', backgroundCss);
                container.findCache('.stage_holder').css('background-image', backgroundCss);
                container.findCache('.stage_name').text(stage.name);
            }
        }
        else
        {
            let stageContainer = GameInfoHelper.stageElement(container.closest('.picks_container'),stage);
            container.findCache('.stage_holder').css('background-image',stageContainer.css('background-image'));
            container.findCache('.stage_name').text(stageContainer.find('input[name=name]').val());
        }

    },
    characterNameFromId: function(container,characterId){
        var element = GameInfoHelper.characterElement(container,characterId);
        return element.find('input[name=name]').val();
    },

    characterElement: function(container,characterId){
        return container.find('.character input[name=character_id][value='+characterId+']').first().closest('.character');
    },
    stageElement: function(container,stageId){
        return container.find('.stage input[name=stage_id][value='+stageId+']').first().closest('.stage');
    },

    stageNameFromId: function(container,stageId){
        return GameInfoHelper.stageElement(container,characterId).find('input[name=name]').val();
    },
    updateCharacters: function(matchContainer, match){
        if(!(match instanceof Match))
        {
            throw "Match Required! Not whatever the f you gave me";
        }

        var selectedCharactersContainer = matchContainer.findCache('.selected_characters');
        var teamContainers = {
            1: selectedCharactersContainer.findCache('.team_1_characters'),
            2: selectedCharactersContainer.findCache('.team_2_characters')
        };

        teamContainers[match.getMyTeamNumber()].addClass('my_team');
        teamContainers[match.getOtherTeamNumber()].addClass('other_team');
        $.each(match.game.players, function(id, player){
            var teamNumber = match.players[id].match.team_number;
            var characterId = player.character;
            var characterContainerId = 'player_character_' + id;
            var myTeamContainer = teamContainers[teamNumber];
            var characterContainer = myTeamContainer.find('.'+characterContainerId);
            if(!characterContainer.length)
            {
                var user = Users.retrieveById(id);
                characterContainer = matchContainer.findCache('.player_character.template');
                characterContainer = characterContainer.clone().removeClass('template');
                characterContainer.addClass(characterContainerId);
                characterContainer.prependTo(myTeamContainer);
                characterContainer.find('.username').replaceWith(user.createUsernameElement());
            }
            GameInfoHelper.setContainerToCharacter(characterContainer,characterId);
            var randomCharacterData = null;
            GameInfoHelper.assignRandomCharacter(characterContainer, player.random_character);

            if(!characterContainer.data('stockStore'))
            {
                characterContainer.data('stockStore', {});
            }
            let stockStore = characterContainer.data('stockStore');
            if(player.stocks && player.stocks.stock_icon &&  player.stocks.detail)
            {
                characterContainer.findCache('.stocks').addClass('has_stocks');
                if(player.apm)
                {
                    characterContainer.findCache('.apm_container').addClass('active');
                    characterContainer.findCache('.apm').text(player.apm);
                }
                else
                {
                    characterContainer.findCache('.apm_container').removeClass('active');
                }
                let stockIconTemplate = $('<img>').attr('src', player.stocks.stock_icon).addClass('stock_icon');
                player.stocks.detailMap = {};
                for(let i in player.stocks.detail)
                {
                    if(!player.stocks.detail.hasOwnProperty(i))
                    {
                        continue;
                    }
                    let stock = player.stocks.detail[i];
                    let stockIcon = stockStore[stock.stock_number];
                    player.stocks.detailMap[stock.stock_number] = stock;
                    if(!stockIcon)
                    {
                        stockIcon = stockIconTemplate.clone();
                        stockIcon.addClass('stock_number_'+stock.stock_number);
                        stockIcon.appendTo(characterContainer.findCache('.stocks'));
                        stockStore[stock.stock_number] = stockIcon;
                    }
                    if(stockIcon.attr('src') != player.stocks.stock_icon)
                    {
                        stockIcon.attr('src',player.stocks.stock_icon);
                    }

                    stockIcon.data('data', stock);
                    if(stock.time_lost)
                    {
                        stockIcon.addClass('dead');
                    }
                    else
                    {
                        stockIcon.removeClass('dead');
                    }
                    stockIcon.removeClass('not_used');
                }
                for(let stockNumber in stockStore)
                {
                    if(!stockStore.hasOwnProperty(stockNumber))
                    {
                        continue;
                    }
                    let currentStock = stockStore[stockNumber];

                    if(!player.stocks.detailMap[stockNumber])
                    {
                        currentStock.addClass('not_used');
                    }
                }
            }
            else
            {
                characterContainer.findCache('.stocks').removeClass('has_stocks');
            }
        });

    },
    assignRandomCharacter: function(characterContainer,randomCharacterValue){
        var randomCharacterData;
        if(randomCharacterValue)
        {
            characterContainer.addClass('has_random_selection');
            randomCharacterData = GameInfoHelper.setContainerToCharacter(
                characterContainer.find('.random_character_holder'),
                randomCharacterValue
                ,false
            );
            if(randomCharacterData)
            {
                characterContainer.find('.character_name').text(randomCharacterData.name);
            }
        }
        else
        {
            characterContainer.removeClass('has_random_selection');
        }
    },

};


/** WEBPACK FOOTER **
 ** ./../components/GameInfoHelper.jsx
 **/