import {Settings} from "../components/Settings";
import {Dashboard} from "../components/Dashboard";
import {ChatActions} from "../components/ChatActions";
import {Html} from "../components/Html";
import {TokensManager} from "./TokensManager";

var NotificationManager = function(){
    this.currentTitleAlertLevel = 0;
    this.browserHasFocus = 1;
    this.notification = null;

    this.lastNotificationTitle =null;
    this.lastNotificationMessage =null;

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(siteUrl+'/sw.js');
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }

    this.titleNotification = function(message,duration,level){
        //0 = General Chat Messages
        //1 = Subchat message
        //2 =
        //5 = Mentioned
        duration = duration || 0;
        level = level || 0;

        if(level < this.currentTitleAlertLevel){
            return;
        }


        this.currentTitleAlertLevel = level;
        if(isInLadder)
        {
            $.titleAlert(message, {
                requireBlur:true,
                stopOnFocus:true,
                duration:duration,
                interval:800
            });
        }
    };

    if(typeof document.hasFocus === 'undefined') {
        document.hasFocus = function () {return document.visibilityState == 'visible'; 	};
    }
    this.checkBrowserFocus = function(){
        this.browserHasFocus = document.hasFocus();
        if(this.browserHasFocus)
            this.currentTitleAlertLevel = 0;
        return this.browserHasFocus;
    };

    this.showInChatAlso = function(largeScreensAlso){
        NotificationManager.initializePushNotificationState();
        if(largeScreensAlso || !Dashboard.dashboard.hasClass('dashboard-md'))
        {
            return ChatActions.addNotificationToChat(null,Html.encode(this.lastNotificationMessage), true);
        }
        return;
    };
    this.clearTag = function(tag){
        BrowserNotification.messageServiceWorker({action:'clearTag', data:{tag:tag}});
    };
    this.showNotification = function(title, options){

        options = options||{};
        if(!options.body)
        {
            options.body = '';
        }
        this.lastNotificationTitle = title;
        this.lastNotificationMessage = options.body;
        if('serviceWorker' in navigator)
        {
            navigator.serviceWorker.register(siteUrl+'/sw.js')
                .then(NotificationManager.initializePushNotificationState);
        }
        else
        {
            console.warn('Service workers aren\'t supported in this browser.');
        }

        if(Settings.isChecked('receive_browser_notifications'))
        {
            if(!this.checkBrowserFocus() && isInLadder)
            {
                var defaultOptions = {
                    icon: siteUrl+"/android-icon-144x144.png",
                    timeout: 5500,
                    onClick:function(){
                        window.focus();
                        this.close();
                    },
                    tag: title,
                    serviceWorker: siteUrl+'/sw.js',
                    timestamp: Date.now(),
                    title: title
                };

                if(title)
                {
                    this.titleNotification(title);
                }
                if(options.onClick)
                {
                    var theClick = options.onClick;
                    var defaultClick = defaultOptions.onClick;
                    delete defaultOptions.onClick;
                    delete options.onClick;
                    options.onClick = function(){
                        theClick.call(this);
                        defaultClick.call(this);
                    }
                }
                $.extend(defaultOptions,options);
                if(navigator.serviceWorker && navigator.serviceWorker.controller && !options.onClick && options.url)
                {
                    new Promise(function(resolve, reject){
                        // Create a Message Channel
                        var msg_chan = new MessageChannel();

                        // Handler for recieving message reply from service worker
                        msg_chan.port1.onmessage = function(event){
                            if(event.data.error){
                                reject(event.data.error);
                            }else{
                                resolve(event.data);
                            }
                        };

                        // Send message to service worker along with port for reply
                        var messageData = {
                            action: 'showNotification',
                            data: defaultOptions
                        };
                        navigator.serviceWorker.controller.postMessage(JSON.parse(JSON.stringify(messageData)), [msg_chan.port2]);
                    });
                }
                else
                {
                    this.notification = Push.create(title,defaultOptions);
                }
            }
        }
        return this;
    };
    this.showNotificationBar = function(message, duration, type) {

        /*set default values*/
        duration = typeof duration !== 'undefined' ? duration : 30000;
        var notificationBar = $('#notification-bar');
        if(notificationBar.data('previousTimeout'))
        {
            clearTimeout(notificationBar.data('previousTimeout'));
        }
        notificationBar.stop(true,false).slideUp(0);
        notificationBar.find('.notification-message').text(message);
        /*animate the bar*/
        notificationBar.click(function(e){
            notificationBar.slideUp();
        });
        notificationBar.slideDown(function() {
            var previousTimeout = setTimeout(function() {
                notificationBar.slideUp(function() {});
            }, duration);
            notificationBar.data('previousTimeout',previousTimeout);
        });
    };
    return this;
};

NotificationManager.sendSubscriptionToServer = function(subscription){
    var fetchOptions = {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(subscription),
        credentials: 'include'
    };
    return fetch(siteUrl+'/apiv1/update_push_subscription', fetchOptions);
};

NotificationManager.pushInitialized = false;
NotificationManager.initializePushNotificationState = function(){
    if(NotificationManager.pushInitialized)
    {
        return;
    }
    NotificationManager.pushInitialized = true;

    if (!('serviceWorker' in navigator)) {
        console.warn('Service workers aren\'t supported in this browser.');
        return;
    }
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        return;
    }

    navigator.serviceWorker.addEventListener('message', function(event){
        console.log(event);
        if(event.data.appCommand)
        {
            TokensManager.parseData(event.data.appCommand);
        }
        else if(event.data.url)
        {
            alert('Post to ' + event.data.url);
        }
    });


    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        console.warn('Push messaging isn\'t supported.');
        return;
    }
    
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                if (!subscription) {
                    NotificationManager.setButtonToEnable();
                    NotificationManager.prototype.subscribe();
                    return;
                }

                NotificationManager.sendSubscriptionToServer(subscription);
                NotificationManager.setButtonToDisable();
            })
            .catch(function(err) {
                console.error('Error during getSubscription()', err);
            });
    });
};


    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    NotificationManager.setButtonToEnable = function()
    {
        var button = $('#browser_notifications_general');
        button.prop('checked', false);
    };
    NotificationManager.setButtonToDisable = function()
    {
        var button = $('#browser_notifications_general');
        button.prop('checked', true);
    };

    NotificationManager.prototype.subscribe = function() {
        var applicationServerPublicKey = 'BFbrkG2jtXgwtdorgeFdPG2S+cwP60FjUwJ1voo0RHblreCYzjMGLpm2igdEaJQxBgaIdLvaHibWjQuMHx2cmus=';
        var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                })
                .then(function(subscription) {
                    NotificationManager.setButtonToDisable();

                    return NotificationManager.sendSubscriptionToServer(subscription);
                })
                .catch(function(e) {
                    if (Notification.permission === 'denied') {
                        // The user denied the notification permission which
                        // means we failed to subscribe and the user will need
                        // to manually change the notification permission to
                        // subscribe to push messages
                        console.warn('Permission for Notifications was denied');
                    } else {
                        // A problem occurred with the subscription; common reasons
                        // include network errors, and lacking gcm_sender_id and/or
                        // gcm_user_visible_only in the manifest.
                        console.error('Unable to subscribe to push.', e);
                        NotificationManager.setButtonToEnable();
                    }
                });
        });
    };

    NotificationManager.prototype.unsubscribe = function(){
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            // To unsubscribe from push messaging, you need get the
            // subscription object, which you can call unsubscribe() on.
            serviceWorkerRegistration.pushManager.getSubscription().then(
                function(pushSubscription) {
                    // Check we have a subscription to unsubscribe
                    if (!pushSubscription) {
                        button.prop('disabled', false);
                        NotificationManager.setButtonToEnable();
                        return;
                    }

                    var subscriptionId = pushSubscription.subscriptionId;
                    // TODO: Make a request to your server to remove
                    // the subscriptionId from your data store so you
                    // don't attempt to send them push messages anymore

                    // We have a subscription, so call unsubscribe on it
                    pushSubscription.unsubscribe().then(function(successful) {
                        NotificationManager.setButtonToEnable();
                    }).catch(function(e) {

                        console.log('Unsubscription error: ', e);
                        NotificationManager.setButtonToEnable();
                    });
                }).catch(function(e) {
                console.error('Error thrown while unsubscribing from push messaging.', e);
            });
        });
    };



export var BrowserNotification = new NotificationManager();


/** WEBPACK FOOTER **
 ** ./../components/BrowserNotification.jsx
 **/