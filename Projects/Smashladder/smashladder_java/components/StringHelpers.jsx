export var StringHelpers = {

    split: function(val) {
        return val.split(/@\s*/);
    },

    extractLast: function(term) {
        return StringHelpers.split(term).pop();
    }
};


/** WEBPACK FOOTER **
 ** ./../components/StringHelpers.jsx
 **/