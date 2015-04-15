var textArea = require('../element/text-area.js');
var lineKey = require('../element/line-key.js');
var ftLogo = require('../element/logo.js');

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function getWidth(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().width);
}

function Dressing(svg, model){
    // TODO: don't hard-code the fontsize, get from CSS somehow.
    // TODO: move calculation of lineheight to the textarea component;
    this.svg = svg;
    this.model = model;
    this.defaultLineHeight = 1.2;
    this.footerLineHeight = 15;
    this.headerHeight = 0;
    this.footerHeight = 0;
    this.sourceFontOffset = 0;
}

Dressing.prototype.addHeader = function(){
    this.addTitle();
    this.addSubTitle();
    this.addSeriesKey();
    this.setPosition();
};

Dressing.prototype.addFooter = function(){
    this.addFootNotes();
    this.addSource();
};

Dressing.prototype.addLogo = function(){
    var svg = this.svg;
    var model = this.model;

    var logo = svg.append('g').attr('class','chart-logo').call(ftLogo, model.logoSize);
    var heightOfFontDescenders = 3;
    var baselineOfLastSourceLine = model.height - getHeight(logo) - heightOfFontDescenders - this.getSourceFontOffset();

    logo.attr('transform', model.translate({
        left: model.width - model.logoSize,
        top: baselineOfLastSourceLine
    }));
};

Dressing.prototype.addSubTitle = function(){
    var svg = this.svg;
    var model = this.model;

    var subtitleFontSize = 12;
    var subtitleLineHeight = this.defaultLineHeight;
    var subtitleLineHeightActual = Math.ceil(subtitleFontSize * subtitleLineHeight);
    var subtitleLineSpacing = subtitleLineHeightActual - subtitleFontSize;
    var subtitleTextWrapper = textArea().width(model.contentWidth).lineHeight(subtitleLineHeightActual);
    var subtitle = svg.append('g').attr('class','chart-subtitle').datum(model.subtitle).call(subtitleTextWrapper);
    if (!model.subtitlePosition) {
        if (model.subtitle) {
            model.subtitlePosition = {top: this.headerHeight + subtitleFontSize, left: 0};
            this.headerHeight += (getHeight(subtitle) + model.blockPadding);
        } else {
            model.subtitlePosition = {top: this.headerHeight, left: 0};
        }
    }
    subtitle.attr('transform', model.translate(model.subtitlePosition));
}

Dressing.prototype.addTitle = function(){
    var svg = this.svg;
    var model = this.model;

    var titleFontSize = 18;
    var titleLineHeight = this.defaultLineHeight;
    var titleLineHeightActual = Math.ceil(titleFontSize * titleLineHeight);
    var titleLineSpacing = titleLineHeightActual - titleFontSize;
    var titleTextWrapper = textArea().width(model.contentWidth).lineHeight(titleLineHeightActual);
    var title = svg.append('g').attr('class','chart-title').datum(model.title).call(titleTextWrapper);
    if (!model.titlePosition) {
        if (model.title) {
            model.titlePosition = {top: this.headerHeight + titleFontSize, left: 0};
            this.headerHeight += (getHeight(title) + model.blockPadding - titleLineSpacing);
        } else {
            model.titlePosition = {top: this.headerHeight, left: 0};
        }
    }
    title.attr('transform', model.translate(model.titlePosition));
};

Dressing.prototype.addSeriesKey = function(){
    var svg = this.svg;
    var model = this.model;

    if (!model.key) { return; }
    var halfLineStrokeWidth = Math.ceil(model.lineStrokeWidth / 2);
    var chartKey = lineKey({lineThickness: model.lineStrokeWidth})
        .style(function (d) {
            return d.value;
        })
        .label(function (d) {
            return d.key;
        });
    var entries = model.y.series.map(function (d) {
        return {key: d.label, value: d.className};
    });

    var key = svg.append('g').attr('class', 'chart-key').datum(entries).call(chartKey);

    if (!model.keyPosition) {
        model.keyPosition = {top: this.headerHeight, left: halfLineStrokeWidth};
        this.headerHeight += (getHeight(key) + model.blockPadding);
    }
    key.attr('transform', model.translate(model.keyPosition));
};


Dressing.prototype.addFootNotes = function(){
    var svg = this.svg;
    var model = this.model;

    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight)
    var footnotes = svg.append('g').attr('class','chart-footnote').datum(model.footnote).call(text);
    var footnotesHeight = getHeight(footnotes);

    var footerHeight = Math.max(footnotesHeight + (model.blockPadding * 2), model.logoSize);
    var currentPosition = model.chartPosition.top + model.chartHeight;

    footnotes.attr('transform', model.translate({ top: currentPosition + this.footerLineHeight + model.blockPadding }));
    this.footerHeight += (footerHeight + model.blockPadding);
};

Dressing.prototype.addSource = function(){
    var svg = this.svg;
    var model = this.model;

    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight)
    var sourceFontSize = 10;
    var sourceLineHeight = this.defaultLineHeight;
    var sourceLineHeightActual = sourceFontSize * sourceLineHeight;
    var source = svg.append('g').attr('class','chart-source').datum(model.sourcePrefix + model.source).call(text);
    var sourceHeight = getHeight(source);
    var currentPosition = model.chartPosition.top + model.chartHeight;

    source.attr('transform', model.translate({ top: currentPosition + this.footerHeight + sourceLineHeightActual + model.blockPadding }));
    if (model.hideSource) {
        source.remove();
    }
    this.sourceFontOffset = sourceLineHeightActual - sourceFontSize;
    this.footerHeight += sourceHeight;
};

Dressing.prototype.getSourceFontOffset = function(){
    return this.sourceFontOffset;
};

Dressing.prototype.setPosition = function(){
    var halfLineStrokeWidth = Math.ceil(this.model.lineStrokeWidth / 2);
    this.model.chartPosition = {
        top: this.headerHeight + halfLineStrokeWidth,
        left: (this.model.numberAxisOrient === 'left' ? 0 : halfLineStrokeWidth)
    };
};

module.exports = Dressing;