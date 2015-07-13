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
    this.addTitle();
    this.addSubTitle();
    this.addSeriesKey();
    this.setPosition();
};

Dressing.prototype.addFooter = function () {
    this.addFootNotes();
    this.addSource();
    this.setHeight();
    this.addLogo();
};

Dressing.prototype.addFooterTextArea = function(datum, attrClass){
    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var gText = this.svg.append('g').attr('class', attrClass).datum(datum).call(text);
    this.footerHeight += getHeight(gText);
    return gText;
};

Dressing.prototype.addLogo = function () {
    var model = this.model;

    var logo = this.svg.append('g').attr('class', 'chart-logo').call(ftLogo, model.logoSize);
    logo.attr('transform', model.translate({
        left: model.width - model.logoSize - 3,
        top: model.height - getHeight(logo) - 3
    }));
};

Dressing.prototype.addSubTitle = function () {
    var svg = this.svg;
    var model = this.model;

    var subtitleLineHeight = Math.ceil(this.subtitleFontSize * this.defaultLineHeight);
    var subtitleTextWrapper = textArea().width(model.contentWidth).lineHeight(subtitleLineHeight);
    var subtitle = svg.append('g').attr('class', 'chart-subtitle').datum(model.subtitle).call(subtitleTextWrapper);
    if (!this.subtitlePosition) {
        if (model.subtitle) {
            this.subtitlePosition = {top: this.headerHeight + this.subtitleFontSize, left: 0};
            this.headerHeight += (getHeight(subtitle) + this.blockPadding);
        } else {
            this.subtitlePosition = {top: this.headerHeight, left: 0};
        }
    }
    subtitle.attr('transform', model.translate(this.subtitlePosition));
};

Dressing.prototype.addTitle = function () {
    var svg = this.svg;
    var model = this.model;

    var titleLineHeight = this.defaultLineHeight;
    var titleLineHeightActual = Math.ceil(this.titleFontSize * titleLineHeight);
    var titleLineSpacing = titleLineHeightActual - this.titleFontSize;
    var titleTextWrapper = textArea().width(model.contentWidth).lineHeight(titleLineHeightActual);
    var title = svg.append('g').attr('class', 'chart-title').datum(model.title).call(titleTextWrapper);
    if (!this.titlePosition) {
        if (model.title) {
            this.titlePosition = {top: this.headerHeight + this.titleFontSize, left: 0};
            this.headerHeight += (getHeight(title) + this.blockPadding - titleLineSpacing);
        } else {
            this.titlePosition = {top: this.headerHeight, left: 0};
        }
    }
    title.attr('transform', model.translate(this.titlePosition));
};

Dressing.prototype.addSeriesKey = function () {
    var svg = this.svg;
    var model = this.model;

    if (!model.key) {
        return;
    }

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

    var svgKey = svg.append('g').attr('class', 'chart__key').datum(entries).call(chartKey);
    if (!this.keyPosition) {
        this.keyPosition = {top: this.headerHeight, left: this.halfLineStrokeWidth};
        this.headerHeight += (getHeight(svgKey) + this.blockPadding);
    }
    svgKey.attr('transform', model.translate(this.keyPosition));
};

Dressing.prototype.addFootNotes = function () {
    if (!this.model.footnote) return;
    var model = this.model;

    var gText = this.addFooterTextArea(model.footnote, 'chart-footnote');
    var currentPosition = model.chartPosition.top + model.chartHeight;
    gText.attr('transform', model.translate({top: currentPosition + this.footerLineHeight + this.blockPadding}));
};

Dressing.prototype.addSource = function () {
    if (!this.model.source) return;
    var model = this.model;
    var gText = this.addFooterTextArea(model.sourcePrefix + model.source, 'chart-source');
    var currentPosition = model.chartPosition.top + model.chartHeight;
    var sourceLineHeight = this.sourceFontSize * this.defaultLineHeight;
    gText.attr('transform', model.translate({top: this.footerHeight + currentPosition + sourceLineHeight + (this.blockPadding * 2)}));
};

Dressing.prototype.setHeight = function () {
    var model = this.model;
    var footerHeight = Math.max(this.footerHeight + this.blockPadding + this.blockPadding + this.blockPadding, model.logoSize);
    if (model.height) {
        model.chartHeight = model.height - this.headerHeight - footerHeight;
        if (model.chartHeight < 0) {
            model.error({
                message: 'calculated plot height is less than zero'
            });
        }
    } else {
        model.height = this.headerHeight + model.chartHeight + footerHeight;
    }
    this.svg.attr('height', Math.ceil(model.height));
};

Dressing.prototype.setPosition = function () {
    this.model.chartPosition = {
        top: this.headerHeight + this.halfLineStrokeWidth,
        left: (this.model.dependentAxisOrient === 'left' ? 0 : this.halfLineStrokeWidth)
    };
};

module.exports = Dressing;
