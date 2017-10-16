import {LadderLinker} from "./LadderLinker";

export var SiteLinker = {
    link:function(text){
        text = Autolinker.link(text,LadderLinker.autolinkerOptions);
        if(LadderLinker.autoReplaces)
        {
            $.each(LadderLinker.autoReplaces,function(search,replace){
                var regex = new RegExp(search, "g");
                text = text.replace(regex, '<a target="_blank" href="'+replace.link+'">'+search+'</a>');
            });
        }
        return text;
    }
};


/** WEBPACK FOOTER **
 ** ./../components/SiteLinker.jsx
 **/