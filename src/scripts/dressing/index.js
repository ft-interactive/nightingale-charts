var textArea = require('./text-area.js');
var seriesKey = require('./series-key.js');
var ftLogo = require('./logo.js');
var themes = require('../themes');

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function Dressing(svg, model) {
    this.svg = svg;
    this.model = model;
    this.blockPadding = 8;
    this.defaultLineHeight = 1.2;
    this.titleFontSize = themes.check(model.theme, 'chart-title').attributes['font-size'];
    this.footerLineHeight = themes.check(model.theme, 'dressing-footnote').attributes['line-height'];
    this.subtitleFontSize = themes.check(model.theme, 'chart-subtitle').attributes['font-size'];
    this.sourceFontSize = themes.check(model.theme, 'dressing-source').attributes['font-size'];
    this.halfLineStrokeWidth = Math.ceil(model.lineStrokeWidth / 2);
    this.headerHeight = 0;
    this.footerHeight = 0;
}

Dressing.prototype.addHeader = function () {
    this.addHeaderItem('title');
    this.addHeaderItem('subtitle');
    this.addSeriesKey();
};

Dressing.prototype.addFooter = function () {
    var footerText = this.addFooterItem('footnote');
    var sourceText = this.addFooterItem('source', this.model.sourcePrefix);
    this.setHeight();
    this.addLogo();
    this.positionFooterItem(footerText, sourceText);
    this.positionFooterItem(sourceText);
};

Dressing.prototype.addLogo = function () {
    var model = this.model;
    var logo = this.svg.append('g').attr('class', 'chart-logo').call(ftLogo, model.logoSize);
    logo.attr('transform', model.translate({
        left: model.width - model.logoSize - 3,
        top: model.height - getHeight(logo) - 3
    }));
};

Dressing.prototype.addHeaderItem = function(item){
    if (!this.model[item]) return;
    var svg = this.svg;
    var model = this.model;
    var lineHeight = Math.ceil(this[item + 'FontSize'] * this.defaultLineHeight);
    var textWrapper = textArea().width(model.contentWidth).lineHeight(lineHeight);
    var gText = svg.append('g').attr('class', 'chart-' + item).datum(model[item]).call(textWrapper);
    var currentPosition = {top: this.headerHeight + this[item + 'FontSize'], left: 0};
    this.headerHeight += (getHeight(gText) + this.halfLineStrokeWidth);
    gText.attr('transform', model.translate(currentPosition));
    this.setPosition();
};

Dressing.prototype.addSeriesKey = function () {
    if (!this.model.key) {        return;    }
    var svg = this.svg;
    var model = this.model;

    var chartKey = seriesKey({
        lineThickness: model.lineStrokeWidth,
        chartType: model.chartType,
        theme: model.theme
    })
        .style(function (d) {
            return d.value;
        })
        .label(function (d) {
            return d.key;
        });
    var entries = model.y.series.map(function (d) {
        return {key: d.label, value: d.className};
    });

    var gText = svg.append('g').attr('class', 'chart__key').datum(entries).call(chartKey);
    var currentPosition = {top: this.headerHeight + this.blockPadding, left: this.halfLineStrokeWidth};
    this.headerHeight += getHeight(gText) + this.blockPadding;
    gText.attr('transform', model.translate(currentPosition));
    this.setPosition();
};

Dressing.prototype.addFooterItem = function(item, prefix){
    if (!this.model[item]) return;
    var model = this.model;
    var text = textArea().width(model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var gText = this.svg.append('g').attr('class', 'chart-' + item).datum((prefix || '') + this.model[item]).call(text);
    this.footerHeight += getHeight(gText) + this.blockPadding;
    gText.currentPosition = this.footerHeight;
    return gText;
};

Dressing.prototype.positionFooterItem = function(gText){
    if (!gText) return;
    var model = this.model;
    gText.attr('transform', model.translate({top: model.chartPosition.top + model.chartHeight + gText.currentPosition + this.halfLineStrokeWidth}));
};

Dressing.prototype.setHeight = function () {
    var model = this.model;
    var footerHeight = Math.max(this.footerHeight + this.blockPadding * 2, model.logoSize);
    if (model.height) {
        model.chartHeight = model.height - this.headerHeight - footerHeight;
        if (model.chartHeight < 0) {
            model.error({ message: 'calculated plot height is less than zero' });
        }
    } else {
        model.height = this.headerHeight + model.chartHeight + footerHeight;
    }
    this.svg.attr('height', Math.ceil(model.height));
};

Dressing.prototype.setPosition = function () {
    this.model.chartPosition = {
        top: this.headerHeight + this.halfLineStrokeWidth + this.blockPadding,
        left: (this.model.dependentAxisOrient === 'left' ? 0 : this.halfLineStrokeWidth)
    };
};

module.exports = Dressing;
