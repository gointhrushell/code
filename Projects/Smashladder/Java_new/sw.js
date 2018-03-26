
var activeCache = 'activeCache';
var OFFLINE_CACHE = 'OFFLINE';
var OFFLINE_URL = './offline';

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.warn('[INSTALL]', 'clear old resources');
    event.waitUntil(
        refreshCache()
    );
});

self.addEventListener('message', function(event){
    console.log('[SW MESSAGE]', event.data);
    if(event && event.data && event.data.action)
    {
        if(messageActions[event.data.action])
        {
            // console.log('[ACTION] '+event.data.action);
            messageActions[event.data.action](event, event.data.data);
        }
    }
    else
    {
    }
});

self.addEventListener('activate', function(e) {
    console.log('only happens on 2nd page load');
    console.warn('[ServiceWorker] Activate');

    caches.open(OFFLINE_CACHE).then(function(cache) {
        return cache.addAll([
            OFFLINE_URL,
            './images/ladder_pikachu.png',
            './android-icon-36x36.png',
        ]);

    });

    return self.clients.claim();
});
function refreshCache(){
    return caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (CacheLists.isKeeperCache(key)) {
                console.warn('[ServiceWorker Cache] Keeping '+ key);
                return;
            }
            console.warn('[ServiceWorker Cache] Removing old cache', key);
            return caches.delete(key);
        }));
    });
}

var BrowserNotificationManager = function(){
    this.notificationTagsUsed = {};
};
BrowserNotificationManager.prototype.addTag = function(tag){
    console.log('[ADD TAG]', tag);
    this.notificationTagsUsed[tag] = 1;
};
BrowserNotificationManager.prototype.usedTag = function(tag){
    var result = !!this.notificationTagsUsed[tag];
    console.log('[USED TAG]', tag, result);
    return result;
};
BrowserNotificationManager.prototype.clearTag = function(tag){
    console.log('[CLEAR TAG]', tag);
    return delete this.notificationTagsUsed[tag];
};
BrowserNotificationManager = new BrowserNotificationManager();

let console =
{
    log:()=>{

    },

    warn:()=>{

    },
    error:()=>{

    }
};

var CacheListEntry = function(url, groupName, group){
    this.url = url;
    this.groupName = groupName;
    this.group = group;
};
class CacheLists
{

    static isKeeperCache(key){
        var lists = CacheLists.neverUpdateCaches;
        return CacheLists.neverUpdateCaches.has(key);
    }
    static urlIsInNeverUpdateCaches(url){
        return CacheLists.urlIsInList(url, CacheLists.neverUpdateCaches);
    };
    static urlIsInSafeCaches(url){
        return CacheLists.urlIsInList(url, CacheLists.neverUpdateCaches) || CacheLists.urlIsInList(url, CacheLists.rarelyUpdateCaches);
    };

    static getEntryFromUrl(url) {
        var entry = null;
        for(var i = 0; i < CacheLists.getAllLists().length; i++)
        {
            var list = CacheLists.getAllLists()[i];
            entry = CacheLists.getEntryFromList(url, list);
            if(entry)
            {
                return entry;
            }
        }
        return new CacheListEntry(url, activeCache, null);
    }

    static getEntryFromList(url, list){
        for (var keyCacheName of list){
            if(url.pathname.includes(list[keyCacheName]))
            {
                return new CacheListEntry(url, keyCacheName, list[keyCacheName]);
            }
        }
        return null;
    };

    static urlIsInList(url, list){
        for (var keyCacheName of list){
            if(url.pathname.includes(list[keyCacheName]))
            {
                return true;
            }
        }
        return false;
    };

    static getAllLists(){
        return [
            CacheLists.neverUpdateCaches,
            CacheLists.rarelyUpdateCaches
        ];
    }
}

CacheLists.neverUpdateCaches = new Map([
        ['flairImages', '/images/flairs/'],
        ['characterImages', '/images/character/'],
        ['generalImages', '/images/'],
        ['sounds', '/sounds/'],
        ['cssFonts', '/css/fonts/']
    ]
);
CacheLists.rarelyUpdateCaches = new Map(
    [
        ['css','/css/'],
        ['generalJs', '/js/']
    ]
);

var messageActions = {};
messageActions.addTag = function(event, data){
    BrowserNotificationManager.addTag(data.tag);
};
messageActions.clearTag = function(event, data){
    console.log('[CLEAR TAG]', data.tag);
    BrowserNotificationManager.clearTag(data.tag);
};
messageActions.clearCachedUserData = function(event, data){
    refreshCache();
    console.log('clear cached data!');
};
messageActions.showNotification = function(event, data){

    const title = data.title;
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        data: data,
        actions: data.actions,
        url: data.url,
        timestamp: data.timestamp,
        tag: data.tag
    };

    if(data.tag)
    {
        if(BrowserNotificationManager.usedTag(data.tag))
        {
            console.log('[SKIP TAG WAS USED]', data.tag);
            return;
        }

        BrowserNotificationManager.addTag(data.tag)
    }

    mustShowNotification = true;
    event.waitUntil(
        clients.matchAll()
            .then(function (clients) {
                console.log('[SHOW NOTIFICATION]');
                if (clients.length < 0) {
                    return showNotification();
                }
                if (data.always_show) {
                    return showNotification();
                }

                for (var i = 0; i < clients.length; i++) {
                    var url = new URL(clients[i].url);

                    if (clients[i].visibilityState === 'visible'
                        && url.pathname.includes('/netplay') && !url.pathname.includes('guides')) {
                        mustShowNotification = false;
                        break;
                    }
                }

                if (mustShowNotification) {
                    return showNotification();
                }
                else
                {
                    console.log('Notification skipped');
                }

                function showNotification() {
                    console.log('[FUNCTION SHOW NOTIFICATION]');
                    return self.registration.getNotifications({tag: data.tag}).then(function(notifications){

                        var alreadyShown = false;
                        for(var i = 0; i < notifications.length; i++)
                        {
                            var notification = notifications[i];
                            if(!notification.data || !notification.data.data || !notification.data.data.unique)
                            {
                                continue;
                            }
                            console.log('mine', data.data.unique);
                            console.log('other', notification.data.data.unique);
                            if(notification.data.data.unique == data.data.unique)
                            {
                                alreadyShown = true;
                                break;
                            }
                        }

                        if(!alreadyShown)
                        {
                            return self.registration.showNotification(title, options);
                        }
                    }, function(fail){
                    });
                }
            })
    );
};

self.addEventListener('push', function(event) {
    var data;
    try{
        data = JSON.parse(event.data.text());
    }catch(e){
        console.warn(e, event);
        data = {
            title:'Invalid!',
            body: event.data.text(),
            always_show: true
        };
        console.log(data);
    }

    // data.title = data.title;
    messageActions.showNotification(event, data);
});

self.addEventListener('notificationclick', function(event){
    // console.log('[ServiceWorker] NOTIFICATION CLICK');
    event.notification.close();

    var data = event.notification.data;
    // console.log('Notification', event.notification);
    // console.log('Notification Data', event.notification.data);
    // console.log('--- Processing --- ', event.notification.data);

    var appCommand;
    var notificationClickUrl;
    var noClientsOpenUrl;

    function getCommand(event){

        if(data.data) //Default appCommand
        {
            if(data.data.app_command)
            {
                var allCommandData = data.data.app_command;
                appCommand = allCommandData.command;
                noClientsOpenUrl = allCommandData.no_clients;
                notificationClickUrl = allCommandData.server_response;
            }
        }
        if(event.action && data.data) //If there was an action click
        {
            var actionData = data.data.actions[event.action];
            // console.log('[ActionData]', actionData);
            if(actionData)
            {
                actionData = actionData.app_command;
                if(actionData.command)
                {
                    appCommand = actionData.command;
                }
                if(actionData.no_clients)
                {
                    noClientsOpenUrl = actionData.no_clients;
                }
                if(actionData.server_response)
                {
                    notificationClickUrl = actionData.server_response
                }
            }
        }
        if(!noClientsOpenUrl)
        {
            noClientsOpenUrl = data.url;
        }
        if(!noClientsOpenUrl)
        {
            console.log('[ERROR CLICK]', data);
        }
        noClientsOpenUrl = new URL(noClientsOpenUrl);
        noClientsOpenUrl = noClientsOpenUrl.pathname + noClientsOpenUrl.search ;
    }
    getCommand(event);

    // console.log('AppCommand', appCommand);
    // console.log('notificationClickUrl', notificationClickUrl);
    // console.log('noClientsOpenUrl', noClientsOpenUrl);

    event.waitUntil(
        clients.matchAll({
            includeUncontrolled: true,
            type: 'window'
        }).then(function (activeClients) {
            var clientFound = null;
            for(var i = 0; i < activeClients.length; i++)
            {
                var client = activeClients[i];
                var urlData = new URL(client.url);
                if(urlData.pathname.includes('/netplay') && !urlData.pathname.includes('guides'))
                {
                    clientFound = client;

                    break;
                }
            }

            // console.log('[CLICK ACTION]', notificationClickUrl);
            if(notificationClickUrl)
            {
                ajaxToUrl(notificationClickUrl);
            }

            if(clientFound)
            {
                interactWithClient(clientFound, appCommand); //Send appCommand and focus that window
            }
            else
            {
                clients.openWindow(noClientsOpenUrl).then(function(client){

                });
            }
        })
    );

    function interactWithClient(client, appCommand)
    {
        client.focus();
        if(appCommand)
        {
            postMessageToClient(client, {
                appCommand: appCommand
            });
        }
    }
    function postMessageToClient(client, data){
        if(client.constructor !== Array)
        {
            client = [client];
        }
        client.forEach(function(client){
            client.postMessage(data);
        });
    }

    function ajaxToUrl(url){
        // console.log('URL!', url.location, url.data);
        var fetchOptions = {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: searchParams(url.data)
        };
        var request = new Request(url.location);
        fetch(request, fetchOptions)
            .then(function(response){ })
            .catch(function(error){ })

    }
});

self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);
    console.log('fetching', event);

    if (event.request.method !== 'GET') {
        console.log('Not GET');
        return;
    }
    var request = event.request;

    var cacheSearch = event.request;
    var cacheBeforeNetwork = true;
    let credentials = null;
    if(url.pathname.includes('/netplay'))
    {
        request = new Request(url.origin + url.pathname, {
            method: event.request.method,
            headers: event.request.headers,
            mode: 'same-origin', // need to set this properly
            credentials: event.request.credentials,
            redirect: 'manual'   // let browser handle redirects
        });
    }
    if(
        (url.pathname.includes('/smashladder') && url.host == 'localhost')
        || url.hostname.includes('smashladder.com'))
    {
        credentials = {credentials: 'include'};
    }
    else
    {
        credentials = {credentials: 'omit'};
        return;
    }

    event.respondWith(
        caches
            .match(request)
            .then(function(cached) {

                var fetcher = new RequestFetcher(event, request, cached, url);

                return fetcher.getRequest();
            })
    );
});

var logRequest = false;
function searchParams(params){
    return Object.keys(params).map(function(key){
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}

function RequestFetcher(event, request, cached, url){
    this.event = event;
    this.request = request;
    this.cached = cached;

    this.url = url;

    this.showLogs = true;
}
RequestFetcher.prototype.getRequest = function(){
    // var credentials = {};
    // var request = event.request;
    this.doCache = true;

    var request = this.request;
    var cached = this.cached;
    var url = this.url;

    this.requestFromNetworkRequest = request;
    var networked;

    if(this.event.request.mode === 'navigate' || this.event.request.mode === 'cors')
    {
        request = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            mode: 'same-origin',
            credentials: request.credentials,
            redirect: 'manual'
        });
        this.requestFromNetworkRequest = request;

        this.showLogs = true;
        console.log('[SW]', 'navigate');
        if(url.pathname.includes('/netplay'))
        {
            logRequest = true;
            console.log('IS NETPLAY');
            if(cached)
                console.log('CACHED');
            else
                console.log('NOT CACHED');

            networked = this.requestFromNetwork();
            return cached || networked;
        }
        else
        {
            this.doCache = false;
            console.log('[Ignore SW on fetch]', 'Just ignore the service worker');
            return this.requestFromNetwork();
        }
    }

    if(cached && CacheLists.urlIsInNeverUpdateCaches(url))
    {
        return cached;
    }
    networked = this.requestFromNetwork();
    return cached || networked;
};
RequestFetcher.prototype.requestFromNetwork = function(){

    var request = this.request;
    var cached = this.cached;
    var url = this.url;

    var credentials = {};
    if(request.credentials)
    {
        credentials = {credentials: request.credentials};
    }
    if(this.showLogs)
    {
        console.log('[CREDENTIALS]',request.url);
        console.log('[CREDENTIALS]',credentials);
    }
    return fetch(this.requestFromNetworkRequest, credentials)
        .then((response) => {
                return this.fetchedFromNetwork(response);
            }
            , (error) =>{
                if(cached)
                {
                    return cached;
                }
                return this.unableToResolve(error)
            })
        .catch((error) => {
            if(cached)
            {
                return cached;
            }
            return this.unableToResolve(error);
        });
};

RequestFetcher.prototype.unableToResolve = function(error) {
    /* There's a couple of things we can do here.
     - Test the Accept header and then return one of the `offlineFundamentals`
     e.g: `return caches.match('/some/cached/image.png')`
     - You should also consider the origin. It's easier to decide what
     "unavailable" means for requests against your origins than for requests
     against a third party, such as an ad provider
     - Generate a Response programmaticaly, as shown below, and return that
     */

    // console.log('WORKER: fetch request failed in both cache and network!');

    /* Here we're creating a response programmatically. The first parameter is the
     response body, and the second one defines the options for the response.
     */

    console.error(error);
    return caches.open(OFFLINE_CACHE).then(function(cache) {
        return cache.match(OFFLINE_URL);
    });

    return new Response('<h1>Service Unavailable</h1>', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
            'Content-Type': 'text/html'
        })
    });
};
RequestFetcher.prototype.fetchedFromNetwork = function(response) {

    var cached = this.cached;
    var url = this.url;

    var cacheCopy = response.clone();

    if(!response || response.status !== 200  || response.type !== 'basic') {
        return response;
    }
    if(this.showLogs)
    {
        console.log('[SW][CURRENT URL]', this.requestFromNetworkRequest.url);
        console.log('[SW]', this.doCache);
    }
    if(!this.doCache)
    {
        return response;
    }
    var entry = CacheLists.getEntryFromUrl(url);
    
    if(this.showLogs)
    {
        try
        {
            console.log('[SW][CURRENT CACHE NAME]', entry.groupName);
        }catch(error)
        {
            console.error('[SW]', 'ERROR ON ', this.url);
            throw error;
        }

    }



    var fetcher = this;
    try{

        caches
            .open(entry.groupName)
            .then((cache) => {
                if(this.showLogs)
                {
                    console.trace('PLACING INTO CACHE ', entry.url.pathname, entry.groupName);
                }
                cache.put(this.requestFromNetworkRequest, cacheCopy);
            })
            .then(function() {
                // console.log('WORKER: fetch response stored in cache.', event.request.url);
            }).catch((error) => {
                if(this.showLogs)
                {
                    console.log('WORKER: something went wrong placing into cache.', error, entry.url.pathname);
                }
            });
    }
    catch(error)
    {
        console.error('caught');
        console.error(error);
    }


    // Return the response so that the promise is settled in fulfillment.
    return response;
};
