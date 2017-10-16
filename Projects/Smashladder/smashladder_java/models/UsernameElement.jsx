export var UsernameElement = function(jqueryElement,user){
    this.user = user;
    this.element = jqueryElement;
};
UsernameElement.populate = function (element, data) {
    element.text(data.username);
    element.attr('href', siteUrl + '/player/' + (data.id ? data.id + '/' : null) + data.username);
};





/** WEBPACK FOOTER **
 ** ./../models/UsernameElement.jsx
 **/