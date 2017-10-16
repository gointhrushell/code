import {Settings} from "../components/Settings";
import {Dashboard} from "../components/Dashboard";

export var MatchSounds = {
    playMatchRequestNotification: function(){
        if(isInLadder && !Dashboard.playedSoundEffect && Settings.isChecked('play_notifications'))
        {
            Dashboard.playedSoundEffect = true;
            MatchSounds.playSound($('#challenger')[0]);
        }
    },
    playJingles: function(){
        if(isInLadder && Settings.isChecked('play_notifications'))
        {
            MatchSounds.playSound($('#jingles')[0]);
        }
    },
    playStickiedMatch: function(){
        if(isInLadder && Settings.isChecked('play_notifications'))
        {
            MatchSounds.playSound($('#stickied_match')[0]);
        }
    },
    playModNotification: function(){
        if(isInLadder && Settings.isChecked('play_notifications'))
        {
            var sound = $('#enter')[0];
            sound.volume = .2;
            MatchSounds.playSound(sound);
        }
    },
    playPrivateMessageSoundEffect: function(){

        if(isInLadder && !Dashboard.playedSoundEffect && Settings.isChecked('play_notifications'))
        {
            Dashboard.playedSoundEffect = true;
            MatchSounds.playSound($('#private_message_sound')[0])
        }
    },
    playSubHypeSoundEffect: function(type){
        if(isInLadder && !Dashboard.playedSoundEffect && Settings.isChecked('sub_hype_notification_sound'))
        {
            Dashboard.playedSoundEffect = true;
            if(type && type=='bumped')
            {
                var sound = $('#sub_hype_sound_bumped')[0];
                sound.volume = .2;
                MatchSounds.playSound(sound)
            }
            else
            {
                MatchSounds.playSound($('#sub_hype_sound')[0]);
            }
        }
    },
    playSound: function(soundElement){
        var waitTime = 150;
        setTimeout(function () {
            // Resume play if the element if is paused.
            if (soundElement.paused) {
                soundElement.play();
            }
        }, waitTime);
    }
};


/** WEBPACK FOOTER **
 ** ./../components/MatchSounds.jsx
 **/