import {ladder} from "../components/Ladder";


var LadderInfo = function(){
    this.version = '9.11.4';
    this.allLists = {};
    this.STATUS_NEW = 1;
    this.STATUS_UPDATED = 2;
    this.STATUS_REMOVED = 3;
    var ladderInfo = this;

    this.retrieveReference=function(listName){
        if((typeof listName) == 'object')
        {
            if(listName.items)
            {
                return listName;
            }
            else
            {
                if(listName.callbackName)
                {
                    var existingReference = this.retrieveReference(listName.callbackName);
                    if(existingReference.callbacks)
                    {
                        listName.callbacks = existingReference.callbacks;
                    }
                }
                else
                {
                    if(!listName.callbacks)
                    {
                        listName.callbacks={};
                    }
                }
                listName.items={};
                return listName;
            }
        }
        if(this.allLists[listName])
        {
            return this.allLists[listName];
        }
        else
        {
            return this.allLists[listName] = {callbacks:{},items:{},extraData:{}};
        }
    };

    this.setCallbacks = function(listName, callbacks)
    {
        var currentReference = this.retrieveReference(listName);
        $.extend(currentReference.callbacks,callbacks);
        this.processChanges(listName);//Run it once
    };

    this.hasItems = function(listName){
        var currentReference = this.retrieveReference(listName);
        return jQuery.isEmptyObject(currentReference.items);
    };

    this.processChanges = function(listName, updates){
        var currentReference = this.retrieveReference(listName);
        var container = null;
        var callbacks;
        if(listName.callbackName)
        {
            var callbackReference = this.retrieveReference(listName.callbackName);
            callbacks = callbackReference.callbacks;
        }
        else
        {
            callbacks = currentReference.callbacks;
        }
        if(currentReference.container)
        {
            container = currentReference.container;
        }

        if(!currentReference.items)
        {
            currentReference.items = {};
        }
        if(updates)
        {
//				ladder.log('processing ',listName);
        }
        var items = currentReference.items;
        //ITEMS are populated when parseChanges is run
        //SO, we need to check that new items were added and none of the other blocks were executed
        var somethingBesidesPopulationHappened = false;
        var populationHappened = false;

        $.each(items, function(id,currentItem){
            if(!items[id])
                items[id] = {};
            var property = items[id];

            if(property.status == ladderInfo.STATUS_NEW)
            {
                property.status = null;
                if(callbacks.onNew)
                {
                    property.element = callbacks.onNew(id,currentItem.data,container);
                    if(!property.element)
                    {
                        // ladder.log('NO ELEMENT RETURNED FOR : '+ listName +' onNew!');
                    }
                }
                populationHappened = true;
            }
            else if(property.status == ladderInfo.STATUS_UPDATED)
            {
                property.status = null;
                if(callbacks.onUpdate)
                {
                    var element = callbacks.onUpdate(id,currentItem.data,property.element,container);
                    if(element)
                    {
                        property.element = element;//Element is optional for updates
                    }
                }
                somethingBesidesPopulationHappened = true;
            }
            else if(property.status == ladderInfo.STATUS_REMOVED)
            {
                property.status = null;
                if(callbacks.onRemove)
                {
                    if(property)
                    {
                        callbacks.onRemove(id,currentItem.data,property.element);
                    }
                    delete items[id];
                }
                somethingBesidesPopulationHappened = true;
            }
            else
            {
                somethingBesidesPopulationHappened = true;
            }
            property.status = null;
        });
        if(populationHappened && !somethingBesidesPopulationHappened)
        {
            if(callbacks.onPopulate)
            {
                callbacks.onPopulate(currentReference.items);
            }
        }
        if($.isEmptyObject(currentReference.items))
        {
            if(callbacks.onEmpty)
            {
                callbacks.onEmpty();
            }
        }
        if(callbacks.onAlways)
        {
            callbacks.onAlways(currentReference.items,container);
        }
    };

    this.forceRemove = function(listName,itemId,allowReadd){
        var currentReference = this.retrieveReference(listName);

        var item = currentReference.items[itemId];
        if(item)
        {
            item.status = ladderInfo.STATUS_REMOVED;
            this.processChanges(listName);
            if(allowReadd)
            {
                delete currentReference.items[itemId];
            }
        }
    };

    this.parseChanges = function(listName,updatedInfo){
        var currentReference = this.retrieveReference(listName);
        if($.isEmptyObject(updatedInfo))
        {
            return;
        }
        if(updatedInfo)
        {
            if(updatedInfo.all_entries)
            {
                $.each(currentReference.items,function(id,info){
                    if(!updatedInfo[id])
                    {
                        info.status = ladderInfo.STATUS_REMOVED;
                    }
                });
                delete updatedInfo.all_entries;
            }
            $.each(updatedInfo,function(id,updatedInfo){
                var currentItem;
                if(id)
                {
                    currentItem = currentReference.items[id];
                }
                else
                {
                    currentItem = null;
                }
                if(currentItem)
                {
                    if(!currentReference.callbacks.skipExtendOnUpdate)
                    {
                        currentItem.data = $.extend(currentItem.data,updatedInfo);
                    }
                    else
                    {
                        currentItem.data = updatedInfo;
                    }
                    currentItem.status = ladderInfo.STATUS_UPDATED;

                    if(currentItem.data.is_removed)
                    {
                        currentItem.status  = ladderInfo.STATUS_REMOVED;
                    }
                }
                else
                {
                    var blocked = false;
                    var callbacks = currentReference.callbacks;
                    if(callbacks.preventReadd && id)
                    {
                        if(callbacks.preventReadd[id])
                        {
                            blocked = true;
                        }
                        else
                        {
                            callbacks.preventReadd[id] = true;
                        }
                    }
                    if(blocked && id)
                    {
                        ladder.log('BLOCKED');
                    }
                    else
                    {
                        currentItem = currentReference.items[id] = {};
                        currentItem.data = updatedInfo;
                        currentItem.status  = ladderInfo.STATUS_NEW;
                        if(currentItem.data.is_removed)
                        {
                            currentItem.status = ladderInfo.STATUS_REMOVED;
                        }
                        else
                        {
                        }
                    }
                }
            });
        }
        this.processChanges(listName,updatedInfo);
    };

    return this;
};
LadderInfo = new LadderInfo();
export {LadderInfo};


/** WEBPACK FOOTER **
 ** ./../components/LadderInfo.jsx
 **/