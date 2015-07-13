// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied
var d3 = require('d3');

var themes = {
    ft: require('./ft'),
    video: require('./video'),
    applyTheme: applyAttributes,
    check: checkAttributes
};

function applyAttributes(g, theme, keepD3Styles) {
    theme = theme || 'ft';
    if (!keepD3Styles) {
        (g || d3).selectAll('*').attr('style', null);
    }
    themes[theme].forEach(function (style, i) {
        (g || d3).selectAll(style.selector).attr(style.attributes);
    });
    return true;
}

function checkAttributes(theme, selector) {
    theme = theme || 'ft';
    return themes[theme].filter(function (style, i) {
        return (style.id == selector);
    })[0];//return only a single object by id
}

module.exports = themes;
