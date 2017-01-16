// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied
var d3 = require('d3');
var web = require('./ft-web');
var video = require('./ft-video');
var print = require('./ft-print');
var nar = require('./ft-nar');

var themes = {
    'ft-web': web.theme,
    'ft-video': video.theme,
    'ft-print': print.theme,
    'ft-nar': nar.theme,
    check: checkAttributes,
    createDefinitions: createDefinitions
};
var definitions = {
    'ft-web': web.defs,
    'ft-video': video.defs,
    'ft-print': print.defs,
    'ft-nar': nar.defs
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

function checkAttributes(theme, selector) {
    return themes[theme || 'ft-web'].filter(function (style, i) {
        return (style.id == selector);
    })[0] || {attributes:{}};//return only a single object by id
}

module.exports = themes;
