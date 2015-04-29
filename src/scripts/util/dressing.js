var textArea = require('../element/text-area.js');
var lineKey = require('../element/line-key.js');
var ftLogo = require('../element/logo.js');

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function Dressing(svg, model) {
    // TODO: don't hard-code the fontsize, get from CSS somehow.
    // TODO: move calculation of lineheight to the textarea component;
    this.svg = svg;
    this.model = model;
    this.blockPadding = 8;
    this.defaultLineHeight = 1.2;
    this.titleFontSize = 18;
    this.footerLineHeight = 15;
    this.subtitleFontSize = 12;
    this.sourceFontSize = 10;
    this.halfLineStrokeWidth = Math.ceil(model.lineStrokeWidth / 2);

    this.headerHeight = 0;
    this.footerHeight = 0;
    this.sourceFontOffset = 0;
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

Dressing.prototype.addLogo = function () {
    var svg = this.svg;
    var model = this.model;

    var logo = svg.append('g').attr('class', 'chart-logo').call(ftLogo, model.logoSize);
    var heightOfFontDescenders = 3;
    var baselineOfLastSourceLine = model.height - getHeight(logo) - heightOfFontDescenders - this.getSourceFontOffset();

    logo.attr('transform', model.translate({
        left: model.width - model.logoSize,
        top: baselineOfLastSourceLine
    }));
};

Dressing.prototype.addSubTitle = function () {
    var svg = this.svg;
    var model = this.model;

    var subtitleLineHeight = this.defaultLineHeight;
    var subtitleLineHeightActual = Math.ceil(this.subtitleFontSize * subtitleLineHeight);
    var subtitleTextWrapper = textArea().width(model.contentWidth).lineHeight(subtitleLineHeightActual);
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
    if (!this.keyPosition) {
        this.keyPosition = {top: this.headerHeight, left: this.halfLineStrokeWidth};
        this.headerHeight += (getHeight(key) + this.blockPadding);
    }
    key.attr('transform', model.translate(this.keyPosition));
};


Dressing.prototype.addFootNotes = function () {
    var svg = this.svg;
    var model = this.model;

    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var footnotes = svg.append('g').attr('class', 'chart-footnote').datum(model.footnote).call(text);
    var footnotesHeight = getHeight(footnotes);

    var footerHeight = Math.max(footnotesHeight + (this.blockPadding * 2), model.logoSize);
    var currentPosition = model.chartPosition.top + model.chartHeight;

    footnotes.attr('transform', model.translate({top: currentPosition + this.footerLineHeight + this.blockPadding}));
    this.footerHeight += (footerHeight + this.blockPadding);
};

Dressing.prototype.addSource = function () {
    var svg = this.svg;
    var model = this.model;

    var text = textArea().width(this.model.contentWidth - this.model.logoSize).lineHeight(this.footerLineHeight);
    var sourceLineHeight = this.defaultLineHeight;
    var sourceLineHeightActual = this.sourceFontSize * sourceLineHeight;
    var source = svg.append('g').attr('class', 'chart-source').datum(model.sourcePrefix + model.source).call(text);
    var sourceHeight = getHeight(source);
    var currentPosition = model.chartPosition.top + model.chartHeight;

    source.attr('transform', model.translate({top: this.footerHeight + currentPosition + this.blockPadding}));
    if (model.hideSource) {
        source.remove();
    }
    this.sourceFontOffset = sourceLineHeightActual - this.sourceFontSize;
    this.footerHeight += sourceHeight;
};

Dressing.prototype.getSourceFontOffset = function () {
    return this.sourceFontOffset;
};

Dressing.prototype.setHeight = function () {
    var model = this.model;
    if (!model.height) {
        model.height = this.headerHeight + model.chartHeight + this.footerHeight;
    } else {
        model.chartHeight = model.height - this.headerHeight - this.footerHeight;
        if (model.chartHeight < 0) {
            model.error({
                message: 'calculated plot height is less than zero'
            });
        }
    }
    this.svg.attr('height', Math.ceil(model.height));
};

Dressing.prototype.setPosition = function () {
    this.model.chartPosition = {
        top: this.headerHeight + this.halfLineStrokeWidth,
        left: (this.model.numberAxisOrient === 'left' ? 0 : this.halfLineStrokeWidth)
    };
};

module.exports = Dressing;
