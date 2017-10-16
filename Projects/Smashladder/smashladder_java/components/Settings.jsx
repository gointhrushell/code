import {Dashboard} from "../components/Dashboard.jsx";
import {Request} from "./Request";
import {ladderLocalStorage} from "./Ladder";

export var Settings = {
    getValue:function(settingName){
        return Settings.getSetting(settingName).val();
    },
    getSetting:function(settingName){
        if(Settings.settingsElementCache[settingName])
        {
            return Settings.settingsElementCache[settingName];
        }
        var input = $('#settings_popup').find('input[name='+settingName+']');
        if(input && input.length)
        {
            return Settings.settingsElementCache[settingName] = input;
        }
        else
        {
            // console.error('error loading setting '+settingName);
            return $();
        }
    },
    isChecked:function(settingName){
        var input = Settings.getSetting(settingName);
        if(input && input.length)
        {
            return input.is(':checked');
        }
    },
    disableAll:function(){
        $('#settings_popup').find(':input').prop('disabled',true);
    },
    enableAll:function(){
        $('#settings_popup').find(':input').prop('disabled',false);

    },
    settingsElementCache: {

    }
};

let settingsPopup = $('#settings_popup');
settingsPopup.on('change','.general_options input[type=checkbox]', function(){
    var button = $(this);
    var isChecked = button.is(':checked')?1:0;
    var name = button.attr('name');
    if(button.hasClass('offline_setting'))
    {
        return changeOfflineSetting(button);
    }
    else
    {

    }
    var data={};
    data[name] = isChecked;

    function changeOfflineSetting(button){
        if(!button.attr('name'))
        {
            console.log(button);
            console.error('Tried to change a setting with no name?');
            return;
        }
        ladderLocalStorage.setItem('dashboardSetting'+button.attr('name'), isChecked);
    }
    function changeSyncedSetting(button){

    }

    if(button.attr('name') == 'compact_chat_style')
    {
        checkChatStyle(button);
        $('.chat_holder.active .chat_container').each(function(){
            $(this).scrollTop($(this)[0].scrollHeight);
        });
    }
    if(button.attr('name') == 'receive_browser_notifications')
    {
        if(button.is(':checked'))
        {
            BrowserNotification.subscribe();
        }
        else
        {
            BrowserNotification.unsubscribe();
        }
    }

    button.prop('disabled', true);
    if(button.data('justChecking'))
    {
        return;
    }
    Request.send(data,'update_user').done(function(response){
        var setting = Settings.getSetting(name).prop('checked',isChecked).trigger('settingChanged');
        button.prop('disabled', false);
        if(response.success)
        {
            setting.trigger('changeSuccess');
        }

    }).fail(function(){
        button.prop('disabled', false);
        button.prop('checked', !button.is(':checked'));
    });
}).on('changeSuccess','input[name=chat_rooms_enabled]',function(){
    window.location.reload(true);
});


function checkChatStyle(button){
    let isChecked = button.is(':checked')?1:0;
    if(isChecked)
    {
        $('body').removeClass('chat_style_modern')
    }
    else
    {
        $('body').addClass('chat_style_modern');
    }
}




/** WEBPACK FOOTER **
 ** ./../components/Settings.jsx
 **/