export var LadderHistory = {};
LadderHistory.actions = {};
if (!History.enabled) {
    // History.js is disabled for this browser.
    // This is because we can optionally choose to support HTML4 browsers or not.
    LadderHistory.history = {
        pushState: function () {
        }
    };
}
else {
    LadderHistory.history = window.History;

    LadderHistory.history.Adapter.bind(window, 'statechange', function () {
        var state = LadderHistory.history.getState();
        var path = state.data.path;
        if (path) {

        }
        else {
            path = LadderHistory.basePath;
        }
    });
}
LadderHistory.checkDeclickables = true;


/** WEBPACK FOOTER **
 ** ./../components/LadderHistory.jsx
 **/