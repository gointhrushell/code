export var TimeElement = function (data) {
    this.data = data;
    this.create = function () {
        var template = TimeElement.template.clone().removeClass('template');
        template.find('time');
        return template;
    };
};
TimeElement.template = $('<time>');
TimeElement.populate = function (element, data) {
    element.attr('title', data.full).text(data.courtesy).data('timestamp', data.timestamp)
};


/** WEBPACK FOOTER **
 ** ./../components/TimeElement.jsx
 **/