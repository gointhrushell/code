import {Html} from "../components/Html";
import {TokensManager} from "../components/TokensManager";
import {BrowserNotification} from '../components/BrowserNotification.jsx';
import {Flair} from '../models/Flair.jsx';
import {ChatActions} from "ChatActions.jsx";
import {Users} from "app/matchmaking.jsx";
import {array_flip} from "../functions/array_flip.jsx";

export var LadderLinker = {

    autolinkMessage: function(message,massLoading,chatContainer,$element)
    {
        massLoading = massLoading || false;
        LadderLinker.autolinkerOptions.stripPrefix = false;
        LadderLinker.autolinkerOptions.hashtag = 'twitter';

        //if(massLoading)
        //{
        //LadderLinker.autolinkerOptions.usernameFoundCallback = null;
        //}
        //else
        {
            // if(!chatContainer || (chatContainer && !chatContainer.hasClass('private')))
            {
                LadderLinker.autolinkerOptions.usernameFoundCallback = function(username){
                    if(message.player &&  message.player.id != myUser.id)
                    {
                        LadderLinker.usernameFoundCallback(username,message,chatContainer,$element,null,!massLoading);
                    }
                };
            }
        }

        var text = Autolinker.link(message.player.is_admin?message.message:Html.encode(message.message),LadderLinker.autolinkerOptions);

        $.each(LadderLinker.autoReplaces,function(search,replace){
            var regex = new RegExp(search, "g");
            if(replace.link)
            {
                text = text.replace(regex, '<a target="_blank" href="'+replace.link+'">'+search+'</a>');
            }
        });
        if(/* message.player.is_subscribed*/ message.player.is_admin)
        {
            // text = emotify(text);
        }
        else
        {
        }

        //Search for plain username
        var usernameRegex = new RegExp("(?:^|\\s)("+myUser.username+")(?=\\s|$)", "gi");
        if(usernameRegex.test(text))
        {
            text = text.replace(usernameRegex, function(match){
                return myUser.createUsernameElement()
                    .addClass('casual_mention')
                    .attr('title','You have been casually mentioned!')
                    .text(match).attr('data-username',myUser.username).prop('outerHTML');
            });
        }

        return text;
    }
    
};

LadderLinker.autoReplaces = {
    '::guides::':     {link: 'https://www.smashladder.com/help/netplay-guides'},
    '::matchmaking-guide::':{link: 'https://www.smashladder.com/guides/view/26zx/matchmaking-guide'},
    '::pm-guide::':{link: 'https://www.smashladder.com/guides/view/25js/2015-06-18/project-m-netplay-guide'},
    '::melee-guide::':{link: 'https://www.smashladder.com/guides/view/272o/melee-dolphin-build-fastermelee-5-fm5'},
    '::brawl-guide::':{link: 'https://www.smashladder.com/guides/view/25u6/brawl/brawl-netplay-guide'},
    '::controller-guide::':{link: 'https://www.smashladder.com/guides/view/26oz/controller-guide-2-0'},
    '::site-rules::':{link: 'https://www.smashladder.com/help/terms-and-conditions'},
    '::rank-faq::':{link: 'https://www.smashladder.com/help/tiers'},
    '::rank-guide::':{link: 'https://www.smashladder.com/help/tiers'},
    '::ssf2-guide::':{link: 'https://www.smashladder.com/blogs/view/263z'},
    '::desync-guide::':{link: 'https://www.smashladder.com/guides/view/26pv/desync-troubleshooting-guide'},
    '::desynch-guide::':{link: 'https://www.smashladder.com/guides/view/26pv/desync-troubleshooting-guide'},
    '::lag-guide::':{link: 'https://www.smashladder.com/guides/view/2688/killing-input-lag-the-perfect-pc-setup-guide'},
    '::monitor-guide::':{link: 'https://www.smashladder.com/guides/view/2688/killing-input-lag-the-perfect-pc-setup-guide'},
    '::netplay-guide::':{link: 'https://www.smashladder.com/guides/view/26c7/netplay-guide-dolphin-5-0-321'},
    '::no-traversal-guide::':{link: 'https://www.smashladder.com/guides/view/26jo/direct-ip-hosting'},
    '::direct-ip-guide::':{link: 'https://www.smashladder.com/guides/view/26jo/direct-ip-hosting'},
    '::troubleshooting-guide::':{link: 'https://www.smashladder.com/guides/view/26q1'},
    '::disputes::':{link: 'https://www.smashladder.com/guides/view/26zq/ranked-match-disputes'},
    '::ladder-dolphin-launcher::':{link: 'https://www.smashladder.com/blogs/view/26zt/ladder-dolphin-launcher'},
    '::dolphin-download::':{link: siteUrl+'/download/dolphin'},
};
LadderLinker.flippedAutoReplaces = null;

LadderLinker.getGuideShortcuts = function(){
  if(LadderLinker.flippedAutoReplaces)
      return LadderLinker.flippedAutoReplaces;

    LadderLinker.flippedAutoReplaces = [];
    var key = null, temporaryArray = [];

    $.each(LadderLinker.autoReplaces , function(key, data){
        if(LadderLinker.autoReplaces.hasOwnProperty(key))
        {
            temporaryArray.push(key);
        }
    });
    return LadderLinker.flippedAutoReplaces = temporaryArray;
};

LadderLinker.emoteShortcuts = {
    '*pls*': 'ヽ ╭ ° ͜ʖ͡°╮ﾉ',
    '*gimace*': 'ヽ༼ ͒ ̶ ͒༽ﾉ',
    '*grimace*': 'ヽ༼  ͒ ̶ ͒༽  ﾉ ',
    '*KappaTears*': "ヽ( ͡°;╭​͜ʖ╮​͡°; )ﾉ",
    '*Kappa*': '- ̗̀ ヽ( ͡°╭​͜ʖ╮​​͡ °)ﾉ ̖́-',
    '*Kapap*': '- ̗̀ ヽ( ͡°╭​͜ʖ╮​​͡ °)ﾉ ̖́-',
    'Kapap':  'ヽ(。 ╭​͜つ​╮​͡ °)ﾉ',
    'Kappa':  'ヽ( ͡°╭​͜ʖ╮​͡° )ﾉ',
    '*gub*':  ' ༼ つ ◕_◕ ༽つ',
    '*gib*':  ' ༼  つ ◕_◕  ༽ つ',
    '*bond*':  'c(ˊᗜˋ*c)',
    '*lenny*':  '( ͡° ͜ʖ ͡°)',
    '*magic*':  '(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧',
    '*raise*':  'ヽ༼ຈل͜ຈ༽ﾉ',
    '*coffee*':  '☕c(ˊᗜˋ♡c)',
    '*shroom*':  '🍄c(ˊᗜˋ♡c)',
    '*mippy*':  ' ( ˘ ³˘)❤',
    '*eeffoc*':  '(ɔ♡ˊᗜˋ)ɔ☕',
    '*tableflip*':  '(╯°□°）╯︵ ┻━┻',
    '*pikaflip*':  'ʕノ•ᴥ•ʔノ ︵ ┻━┻',
    '*kirby*':  '<(-^.^-)>',

    '*table*':  '┻━┻',
    '*mfw*':  'O͡͡͡͡͡͡͡͡͡͡͡͡͡͡╮༼;´༎ຶ.̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̸̨̨̨̨̨̨̨̨̨̨̨̨.̸̸̨̨۝ ༎ຶ༽╭o͡͡͡͡͡͡͡͡͡͡͡͡͡͡',
    '*doge*':  'ヽ༼°ᴥ°༽ﾉ',
    '*pet*':  'ヽ༼°ᴥ°༽ﾉ',
    '*gren*':  'gren 👌',
    '*coffee!*':  '- ̗̀ - ̗̀ ☕c(ˊᗜˋ♡c) ̖́- ̖́-',
    '*why*':  'ლ(ಠ益ಠლ)',
    '*nose*':  '( ͡° ͜👃 ͡°)',
    '*shrug*':  '¯\\_(ツ)_/¯',
    '*shrugs*':  '¯\\_(ツ)_/¯',
    '*spider*':  '/\\\\; ;//\\',
    '*alienlenny*':  '(◕ ͜ʖ◕)',
    '*kappashrug*':  '乁(ツ​͜ʖ╮​͡° )ﾉ',
    '*aok*':  '👌',
    '*goodstuff*':  '👌( ͡° ͜ʖ ͡°👌)',
    '*mono*':  '(╭ರᴥ•́)',
    '*zing*':  '☜(ﾟヮﾟ☜)',
    '*happy*':  'ᕕ( ᐛ )ᕗ',
    '*yay*':  '- ̗̀ ヽ( ͡° ³ ​​͡ °)ﾉ ̖́-',
    '*strong*':  'ᕦ(눈‿눈ˇ)ᕤ'
};
LadderLinker.emoteShortcutsEntries = null;
LadderLinker.getEmoteShortcuts = function(){
    if(LadderLinker.emoteShortcutsEntries)
    {
        return LadderLinker.emoteShortcutsEntries;
    }
    LadderLinker.emoteShortcutsEntries = [];
    // var emotes = user.autoCompleteElementSecondary = {
    //     label:displayed,
    //     value:user.username,
    //     searchValue:user.display_name +user.username,
    //     isUsername: true
    // };
    $.each(LadderLinker.emoteShortcuts, function(shortcut, result){
        LadderLinker.emoteShortcutsEntries.push({
            label: $('<span class="shortcut_text">'+shortcut+'</span>'
                + '<span class="shortcut_result">'+result+'</span>'),
            value: shortcut,
        });
    });
    return LadderLinker.emoteShortcutsEntries;
};
/**
 *
 * @param username The Found username
 * @param message the message element
 * @param chatContainer Message's container
 * @param $element Element that contains the message
 * @param tokensManager TokenManager that possibly
 * @returns {boolean} | true - Show message | false/null - Skip message
 */
LadderLinker.usernameFoundCallback = function (username,message,chatContainer,$element,tokensManager,notifyBrowser)
    {
        var modMention = (
            tokensManager instanceof TokensManager && tokensManager.command == 'mods' &&
            chatContainer &&
            chatContainer.data('isChatMod')
        );
        if(!modMention)
        {
            //modMention = (
            //	chatContainer &&
            //	chatContainer.data('isChatMod') &&
            //	username.toUpperCase() === 'MODS'
            //);
        }
        var allMention = (
            tokensManager instanceof TokensManager && tokensManager.command == 'all' &&
            chatContainer &&
            (message.isChatMod())
        );
        var titleNotification;
        var chatNotification;
        var browserNotification;
        if(modMention)
        {
            titleNotification = 'Mods were privately mentioned!';
            chatNotification = 'mods were privately mentioned in';
        }
        else if(allMention)
        {
            titleNotification = 'Chat Broadcast!';
            chatNotification = 'broadcasted a message in';
        }
        else
        {
            titleNotification = 'You were Mentioned!';
            chatNotification = 'mentioned you in';
        }
        chatNotification = ' '+chatNotification+' ';
        if(
            modMention || allMention ||
            username.toUpperCase() === myUser.username.toUpperCase() || (myUser.display_name) && username.toUpperCase() === myUser.display_name.toUpperCase()
        )
        {

            if(notifyBrowser)
            {
                if (chatContainer && chatContainer.data('chat'))
                {
                    if (ignoreList[message.player.id])
                    {
                        return;
                    }
                    var name = chatContainer.data('chat').data('name');
                    var button = chatContainer.data('chat').data('button');
                    button.trigger('mentioned', [message.player.username, name, $element]);
                    BrowserNotification.titleNotification(titleNotification, 0, 5);


                    if (!button.hasClass('active'))
                    {
                        var notificationMessage = $('<span>');
                        var userMessage = $('<span>').addClass('username').text(message.player.username);
                        var displayedMessage = $('<span>').addClass('chatlink').text((chatNotification) + name + '!');
                        notificationMessage = notificationMessage.append(userMessage).append(displayedMessage);
                        notificationMessage = ChatActions.addNotificationToChat(null, notificationMessage);
                        displayedMessage.click(function (e) {
                            e.stopImmediatePropagation();
                            button.click();
                            notificationMessage.remove();
                        });
                    }

                    BrowserNotification.showNotification(titleNotification,
                        {
                            body: message.player.username + (chatNotification) + name + ': ' + message.message,
                            icon:
                                message.player.selected_flair?Flair.retrieve(message.player.selected_flair).fullUrl:undefined,
                            onClick: function () {
                                window.focus();
                                // button.trigger('click');
                                ChatActions.changeMainChat(button);

                            },
                            tag: message.player.username + name + message.message
                        }
                    );
                }
                else {
                    BrowserNotification.titleNotification('You were mentioned!', 0, 5);
                    BrowserNotification.showNotification('You were mentioned!');
                }
            }
            if($element)
            {
                if(tokensManager && tokensManager.command == 'mods')
                {
                    $element.addClass('mods_mentioned');
                }
                $element.addClass('you_were_mentioned');
            }
            return true;
        }
        return false;
    };
LadderLinker.autolinkerOptions = {};
var linkTypes = {
  url: function(){

  }
};
function getExtensionFromUrl(url){
    let extension = url.match(/\.([^\./\?]+)($|\?)/);
    if(!extension)
    {
        return null;
    }
    if(!extension[1])
    {
        return null;
    }
    return extension[1];
}
LadderLinker.autolinkerOptions.replaceFn = function(autolinker,match){
        var tag = autolinker.getTagBuilder().build( match );
        tag.addClass('autolinked');
        tag.setInnerHtml(match.getMatchedText());
        var location;
        // if(linkTypes[match.getType()])
        // {
        //     linkTypes[match.getType()]();
        // }
        switch(match.getType()){
            case 'url':
                var url = match.getUrl();
                var parsed = LadderLinker.parse_url(url);
                if(!parsed.host)
                {
                    parsed.host = "";
                }
                if(url.indexOf('i.imgur.com/') !== -1 ||
                    url.indexOf('puu.sh/') !== -1
                    // url.indexOf('prntscr.com/') doesn't support previews
                )
                {
                    let imageMovieExtensions = {
                        'gifv':true,
                        'webm':true,
                    };
                    var fileExt = getExtensionFromUrl(url);
                    var previewUrl = null;
                    if(imageMovieExtensions[fileExt])
                    {
                        previewUrl = url.replace(/\.[^/.]+$/, "");
                        previewUrl = previewUrl + '.png';
                        tag.setAttr('data-preview', previewUrl);
                    }
                    if(!fileExt)
                    {
                        previewUrl = url + '.png';
                        tag.setAttr('data-preview', previewUrl);
                    }
                    console.log(url, fileExt, previewUrl);

                    tag.addClass('streamlink');
                    tag.addClass('imagelink');
                    tag.setAttr('title',"Click to preview image "+ location);
                    tag.setTagName('a');

                    var httpsUrl = url;

                    if(url.match('^http://')){
                        url = url.replace("http://","https://");
                        tag.setAttr('href', url);
                        tag.setInnerHtml(url);
                    }


                    return tag;
                }
                else if(url.indexOf( 'hitbox.tv/' ) !== -1 )
                {
                    location = LadderLinker.getLastUrlPart(url);

                    tag.addClass('streamlink');
                    tag.setAttr('title',"Open embeded hitbox stream - "+ location);
                    tag.setTagName('a');
                    tag.setAttr('data-literal','h~'+location);

                    return tag;
                }
                else if(parsed.host.indexOf( 'twitch.tv' ) !== -1 )
                {
                    location = LadderLinker.getLastUrlPart(url);

                    tag.addClass('streamlink');
                    tag.setAttr('title',"Open embeded twitch stream - "+ location);
                    tag.setTagName('a');
                    tag.setAttr('data-literal','t~'+location);

                    return tag;
                }
                else if(parsed.host.indexOf('youtu.be') !== -1
                    && parsed.path)
                {
                    location = LadderLinker.parseYoutubeVideoId(parsed.path);
                    if(!location)
                    {
                        return;
                    }
                    tag.addClass('streamlink');
                    tag.addClass('youtubelink');
                    tag.setAttr('title',"Open embeded youtube video - "+ location.id);
                    tag.setTagName('a');
                    tag.setAttr('data-literal','y~'+location.id);
                    tag.setAttr('data-id',location.id);
                    tag.setAttr('data-params',decodeURI(location.params));

                    return tag;
                }
                else if(parsed.host.indexOf('youtube.com') !== -1
                    && parsed.path == '/watch')
                {
                    location = LadderLinker.parseYoutubeVideoId(url);
                    if(!location)
                    {
                        return;
                    }

                    tag.addClass('streamlink');
                    tag.addClass('youtubelink');
                    tag.setAttr('title',"Open embeded youtube video - "+ location.id);
                    tag.setTagName('a');
                    tag.setAttr('data-literal','y~'+location.id);
                    tag.setAttr('data-id',location.id);
                    tag.setAttr('data-params',decodeURI(location.params));

                    return tag;
                }
                else if(url.indexOf('smashladder') !== -1 && url.indexOf('/netplay/') !== -1)
                {
                    location = LadderLinker.getLastUrlPart(url);

                    tag.addClass('chatlink');
                    tag.setAttr('title',"Open chat room "+ location);
                    tag.setTagName('a');
                    tag.setAttr('data-chatlink',decodeURIComponent(location));

                    return tag;
                }
                else if(url.indexOf('www.amazon.com/') !== -1
                    || url.indexOf('http://amazon.com/') !== -1
                    || url.indexOf('amzn.com/') !== -1)
                {

                    // tag.setAttr('href',LadderLinker.addParameter(url,'tag','matchmake-20'));
                }
                else
                {
                    tag.addClass('rawlink');
                }

                return tag;
            case 'hashtag':
                location = match.getHashtag();

                if(/^#[0-9A-F]{6}$/i.test(location))
                {
                    tag.addClass('hexcode');
                    tag.setTagName('span');
                    tag.setAttr('href','');
                    tag.setAttr('target','');
                    return tag;
                }

                tag.addClass('chatlink');
                tag.setAttr('title',"Open chat room "+ location);
                tag.setAttr('href',siteUrl+'/netplay/'+location);
                tag.setTagName('a');
                tag.setAttr('data-chatlink',location);

                return tag;
            case 'email':
                tag.addClass('emaillink');
                return tag;
            case 'twitter':
                var twitterHandle = match.getTwitterHandle();
                var lowercaseHandle = twitterHandle.toLowerCase();
                var user = Users.retrieveByUsername(lowercaseHandle);

                window.Users = Users;
                tag.addClass(user.cssUsername().join(' '));
                var textShadowStyle = user.getTextShadowStyle();
                if(textShadowStyle)
                {
                    tag.setAttr('style','text-shadow: '+user.getTextShadowStyle());
                }

                tag.setAttr('href',siteUrl+'/player/'+twitterHandle);
                tag.setAttr('data-username',twitterHandle);

                if(autolinker.usernameFoundCallback && !autolinker.usernameFoundCallback.users)
                {
                    autolinker.usernameFoundCallback.users = {};
                }
                if(autolinker.usernameFoundCallback && !autolinker.usernameFoundCallback.users[lowercaseHandle])
                {
                    autolinker.usernameFoundCallback.users[lowercaseHandle] = true;
                    autolinker.usernameFoundCallback(lowercaseHandle);
                }
                return tag;
        }
        return tag;
    };

LadderLinker.getLastUrlPart = function(str) {
    var split = str.split('/');
    var test = split.pop();
    if(test)
    {
        return test;
    }
    else
    {
        return split.pop();
    }
};
LadderLinker.addParameter = function(url, param, value) {
    var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))'),
        parts = url.toString().split('#'),
        url = parts[0],
        hash = parts[1]
    var qstring = /\?.+$/,
        newURL = url;

    // Check if the parameter exists
    if (val.test(url))
    {
        // if it does, replace it, using the captured group
        // to determine & or ? at the beginning
        newURL = url.replace(val, '$1' + param + '=' + value);
    }
    else if (qstring.test(url))
    {
        // otherwise, if there is a query string at all
        // add the param to the end of it
        newURL = url + '&' + param + '=' + value;
    }
    else
    {
        // if there's no query string, add one
        newURL = url + '?' + param + '=' + value;
    }

    if (hash)
    {
        newURL += '#' + hash;
    }

    return newURL;
};

LadderLinker.parse_url = function(str, component) {
    //       discuss at: http://phpjs.org/functions/parse_url/
    //      original by: Steven Levithan (http://blog.stevenlevithan.com)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //         input by: Lorenzo Pisani
    //         input by: Tony
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //             note: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: blog post at http://blog.stevenlevithan.com/archives/parseuri
    //             note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
    //             note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
    //             note: a seriously malformed URL.
    //             note: Besides function name, is essentially the same as parseUri as well as our allowing
    //             note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
    //        example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
    //        returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
    //        example 2: parse_url('http://en.wikipedia.org/wiki/%22@%22_%28album%29');
    //        returns 2: {scheme: 'http', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
    //        example 3: parse_url('https://host.domain.tld/a@b.c/folder')
    //        returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
    //        example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar');
    //        returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder', query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }

    var query
    var mode = 'php';
    var key = [
        'source',
        'scheme',
        'authority',
        'userInfo',
        'user',
        'pass',
        'host',
        'port',
        'relative',
        'path',
        'directory',
        'file',
        'query',
        'fragment'
    ]
    var parser = {
        php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
    }

    var m = parser[mode].exec(str)
    var uri = {}
    var i = 14

    while (i--) {
        if (m[i]) {
            uri[key[i]] = m[i]
        }
    }

    if (component) {
        return uri[component.replace('PHP_URL_', '')
            .toLowerCase()]
    }

    if (mode !== 'php') {
        var name = (ini['phpjs.parse_url.queryKey'] &&
            ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey'
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g
        uri[name] = {}
        query = uri[key[12]] || ''
        query.replace(parser, function ($0, $1, $2) {
            if ($1) {
                uri[name][$1] = $2
            }
        })
    }

    delete uri.source
    return uri
};
LadderLinker.parseYoutubeVideoId = function (url)
{
    var video_id;
    if(url.indexOf('v=') !== -1)
    {
        video_id = url.split('v=').pop();
    }
    else
    {
        video_id = LadderLinker.getLastUrlPart(url);
    }
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition == -1)
    {
        ampersandPosition = video_id.indexOf('?');
    }

    var params = video_id.substring(ampersandPosition, video_id.length);
    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    if(!video_id)
    {
        return null;
    }
    return {
        id:video_id,
        params: params
    };
};


/** WEBPACK FOOTER **
 ** ./../components/LadderLinker.jsx
 **/