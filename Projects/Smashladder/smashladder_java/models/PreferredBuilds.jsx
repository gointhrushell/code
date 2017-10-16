class PreferredBuilds{

    constructor(data){
        if(!data)
        {
            this.ladders = {};
            return;
        }
        if(data instanceof PreferredBuilds)
        {
            this.ladders = data.ladders;
        }
        else
        {
            this.ladders = data;
        }
    }

    hasPreferredBuildsFor(ladderId){
        if(this.ladders[ladderId] && this.ladders[ladderId].length)
        {
            return true;
        }
        return false;
    }

    getPreferredBuildsFor(ladderId){
        if(this.hasPreferredBuildsFor(ladderId))
        {
            return this.ladders[ladderId];
        }
        return [];
    }

    extend(ladderList){
        if(ladderList)
        {
            this.byId = null;//Reset
            $.extend(this.ladders, ladderList);
        }
    }

    getBuildById(id){
        if(!this.byId){
            this.byId = {};
            var byId = this.byId;
            $.each(this.ladders, function(ladderId, ladderBuilds){
                $.each(ladderBuilds, function(index, build){
                    byId[build.id] = build;
                }) ;
            });
        }
        return this.byId[id];
    }

    getBuildsByLadder(ladderId)
    {
        return this.ladders[ladderId];
    }

    getBestBuildHostPerspective(otherBuilds, ladderId){
        if(this.ladders[ladderId] && otherBuilds.ladders[ladderId])
        {
            var myCurrent = this.ladders[ladderId];
            var otherCurrent = otherBuilds.ladders[ladderId];
            var buildToUse = null;

            $.each(myCurrent, function(i, build){
                if(buildToUse)
                {
                    return false;
                }
                if(!build.active)
                {
                    return;
                }
                $.each(otherCurrent, function(j, compareBuild){
                    if(!compareBuild.active)
                    {
                        return;
                    }
                    if(build.id == compareBuild.id)
                    {
                        buildToUse = build;
                        return false;
                    }
                });
            });
            return buildToUse;
        }
        else
        {
            return null;
        }
    }
}


export {PreferredBuilds};


/** WEBPACK FOOTER **
 ** ./../models/PreferredBuilds.jsx
 **/