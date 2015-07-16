// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied
var d3 = require('d3');
var ft = require('./ft');
var video = require('./video');
var print = require('./print');

var themes = {
    ft: ft.theme,
    video: video.theme,
    print: print.theme,
    applyTheme: applyAttributes,
    check: checkAttributes,
    createDefinitions: createDefinitions
};
var definitions = {
    ft: ft.defs,
    video: video.defs,
    print: print.defs
};

function createDefinitions(g, model) {
    if (!model.gradients) return;

    var theme = model.theme;
    var series = model.y.series.length;
    var defs = model.gradients.map(function(grad, i){
        if (i >= series) return;
        var id = grad.match(/url\(#(.*)\)/)[1];
        return definitions[theme][id];
    });
    var elDefs = g.select('.chart-definitions');
    if (!elDefs.size()) elDefs = g.append('g').attr('class', 'chart-definitions');
    elDefs.node().innerHTML += defs.join('');
}

function applyAttributes(g, theme, keepD3Styles) {
    theme = theme || 'ft';
    if (!keepD3Styles) {
        (g || d3).selectAll('*').attr('style', null);
    }
    themes[theme].forEach(function (style, i){
        var els = (g || d3).selectAll(style.selector);
        els.attr(style.attributes);
    });
}

function checkAttributes(theme, selector) {
    theme = theme || 'ft';
    return themes[theme].filter(function (style, i) {
        return (style.id == selector);
    })[0] || {attributes:{}};//return only a single object by id
}

module.exports = themes;
