/* globals __dirname, Promise */
var fs = require('fs');
var dataURI = {
    BentonSans: fs.readFileSync(__dirname + '/BentonSans.txt', 'utf8').trim(),
    MetricWeb: fs.readFileSync(__dirname + '/MetricWeb.txt', 'utf8').trim(),
    MetricWebSemiBold: fs.readFileSync(__dirname + '/MetricWebSemiBold.txt', 'utf8').trim(),
    AvenirLight: fs.readFileSync(__dirname + '/Avenir-Light.txt', 'utf8').trim(),
    AvenirLightOblique: fs.readFileSync(__dirname + '/Avenir-LightOblique.txt', 'utf8').trim(),
    AvenirHeavy: fs.readFileSync(__dirname + '/Avenir-Heavy.txt', 'utf8').trim()
};

function svgStyleElement(stylesheet) {
    return '<style type="text/css"><![CDATA[' + stylesheet + ']]></style>';
}

function fontFace(name) {
    return '@font-face{font-family: "' + name + '";src: url("' + dataURI[name] + '") format("woff"), local(\'' + name + '\');font-style: normal;font-weight: normal;}';
}

function addOne(fontName) {
    var id = 'nightingale-charts__webfonts';
    var svg = document.querySelector('#' + id);
    if (!svg){
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('width', 11);
        svg.setAttribute('height', 11);
        svg.setAttribute('id', id);
        svg.style.position = 'fixed';
        svg.style.top = '-20px';
    }

    var style = svgStyleElement(fontFace(fontName));
    svg.insertAdjacentHTML('afterbegin', '<defs>' + style + '</defs>');

    document.body.appendChild(svg);
    var dF = document.fonts;

    if(document.fonts === undefined) {
        var ffTrigger = document.createElement('div');

        ffTrigger.setAttribute("style", "font-family: 1em " + fontName + ";");

        document.body.appendChild(ffTrigger);

        return true;
    } else {
        return dF.load('1em ' + fontName);
    }

}

module.exports = function addMultiple(fontNames){
    if (!Array.isArray(fontNames)) fontNames = [fontNames];
    return Promise.all(fontNames.map(addOne));
};
