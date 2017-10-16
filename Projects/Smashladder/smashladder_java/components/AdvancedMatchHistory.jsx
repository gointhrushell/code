import {Match} from "models/Match.jsx";
import {Users} from "app/matchmaking.jsx";

export var AdvancedMatchHistory = function (){


    var matchCalendar = $('#match_calendar');
    var currentPlayerId = matchCalendar.data('player_id');
    $('.month_display .month').click(function (e) {
        if (e.which == 2) {
            return true;
        }
        e.preventDefault();
        var month = $(this).find('input[name=month]').val() - 1;
        var year = $(this).find('input[name=year]').val();
        matchCalendar.fullCalendar('gotoDate', year, month);
    });
    var request = null;
    matchCalendar.fullCalendar({
        events: function (start, end, timezone, callback) {
            if (request) {
                request.abort();
            }
            var data = {};
            data.start = start.unix();
            data.end = end.unix();
            data.calendar_history = 1;
            var calendarContainer = $('.calendar_container');
            calendarContainer.addClass('loading');
            var matchList = $('.listed_matches_container');
            var matchListBody = matchList.find('tbody');
            matchListBody.empty();
            request = $.post('', data, function (response) {
                var listedFriendlies = 0;
                var listedRanked = 0;
                var events = response.events;
                calendarContainer.removeClass('loading');
                if (response.events && !response.events.length) {
                    $('.listed_matches').hide();
                    $('.no_results').show();
                    $('.total_count').hide();
                }
                else {
                    $('.no_results').hide();
                    $('.listed_matches').show();
                    $('.total_count').show().text('(' + response.events.length + ')');
                }
                $.each(events, function (i, event) {
                    var otherPlayer;
                    event.match = new Match(event.match);
                    event.other_player = Users.create(event.other_player);
                    var match = event.match;
                    if (event.match.player1.id == currentPlayerId) {
                        otherPlayer = event.match.player2;
                    }
                    else if (event.match.player2.id == currentPlayerId) {
                        otherPlayer = event.match.player1;
                    }

                    if (match.is_ranked) {
                        listedRanked++;
                        if (otherPlayer.won) {
                        }
                        else {
                        }
                    }
                    else {
                        listedFriendlies++;
                    }
                    event.start = moment.unix(event.start);
//							delete event.url;
                    delete event.backgroundColor;
                    delete event.textColor;
                });

                var listedResults = $('.listed_result_summary').addClass('active');
                listedResults.find('.friendlies').find('.count').text(listedFriendlies);
                listedResults.find('.ranked').find('.count').text(listedRanked);
                matchList.find('.match_results').html(response.html);
                callback(response.events);
            }).error(function () {

            });
        },
        eventLimit: true,
        views: {
            agenda: {}
        },
        // viewRender: function(view) {
        // var date = $('#match_calendar').fullCalendar('getDate');
        // var year = date.getFullYear();
        // var month = date.getMonth();
        // var day = date.getDay();
//
        // var $found = $('input[name="year/month"][value="'+year+'/'+(month+1)+'"]').closest('.month');
        // $('.month_display .month').removeClass('selected');
        // if($found.length)
        // {
        // $found.addClass('selected');
        // }
        // },
        eventRender: function (event, element, view) {
            var match = event.match;

            var content = element.find('.fc-content');
            var title = element.find('.fc-title');

            title.addClass('username_formatted');

            var user = event.other_player.createUsernameElement();
            if (event.formatted_date) {
                title.empty();
                title.append(user).append(' ').append(event.formatted_date);
            }
            if (match.is_ranked) {
                $('<img>').addClass('is_ranked_logo').attr('src', siteUrl + '/images/smash/tiers/grandsmasher.png').attr('title', 'Ranked Match').appendTo(content);
                element.addClass('ranked');
            }
            else {
                element.addClass('unranked');
            }

            element.find('.fc-time').remove();
            element.attr('title', event.hover);
            element.click(function (e) {
                e.preventDefault();
                window.open(element.attr('href'));
            });
            element.addClass('game-'.match.game_slug);

            var image = $('<img>').attr('src', event.game_url).addClass('calendar_logo').prependTo(content);
            /*element.tooltip();*/
        }
    });

};


/** WEBPACK FOOTER **
 ** ./../components/AdvancedMatchHistory.jsx
 **/