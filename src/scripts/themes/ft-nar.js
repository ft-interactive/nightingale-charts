var colours = {
    line: [
        '#154577', '#58bdbb', '#cabd92', '#ac252a', '#ee5427', '#f9a71a'
    ],
    column: [
        '#154577', '#58bdbb', '#cabd92', '#ac252a', '#ee5427', '#f9a71a'
    ],
    bar: [
        '#154577', '#58bdbb', '#cabd92', '#ac252a', '#ee5427', '#f9a71a'
    ],
    accent: '#154577'
};

// SPECIAL 'non-svg' ATTRIBUTES:
// padding-x: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding-y: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding:   applied to 'text' elements (dressing/index.js does this)
// align:     applied to 'text' elements (dressing/index.js does this)
// background:applied to 'text' elements (dressing/index.js does this)
// border:    applied to 'line' and 'path' elements (dressing/index.js does this)

module.exports.theme = [
    {
        'selector': 'path.accent, line.accent, rect.accent',
        'attributes': {
            'stroke': colours.accent
        }
    },
    {
        'id': 'svg',
        'selector': 'svg',
        'attributes': {
          'background': 'none',
          'padding-y': 10,
        }
    },
    {
        'id': 'svg-borders',
        'attributes': {
            'top': true,
            'bottom': true
        }
    },
    //lines
    {
        'id': 'lines',
        'selector': 'path.line, line.key__line',
        'attributes': {
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
        },

    },
    ////Columns
    //{   'id': 'columns',
    //    'attributes': {
    //        'stroke': 'none'
    //    }
    //},
    ////Bars
    //{   'id': 'bars',
    //    'attributes': {
    //        'stroke': 'none'
    //    }
    //},
    {
        'id': 'null-label',
        'attributes': {
            'text-anchor': 'middle',
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 0.4)'
        }
    },

    //text
    {   'id': 'chart-title',
        'attributes': {
            'font-family': 'AvenirHeavy, sans-serif',
            'font-size': 18,
            'font-weight': 600,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'AvenirLightOblique, sans-serif',
            'font-size': 13,
            'font-style':'italic',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'AvenirLightOblique, sans-serif',
            'font-size': 11,
            'font-style':'italic',
            'line-height': 12,
            'fill': '#000000'
        }
    },
    {   'id': 'chart-footnote',
        'attributes': {
            'font-family': 'AvenirLightOblique, sans-serif',
            'font-size': 11,
            'font-style':'italic',
            'line-height': 12,
            'fill': '#000000',
            'padding-y': 5
        }
    },
    {   'id': 'chart-plot',
        'attributes': {
            'full-width': true,
            'padding-x': 0.05
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'AvenirLight, sans-serif',
            'font-size': 13,
            'line-height': 16,
            'fill': '#000000',
            'stroke-opacity':'0.8',
            'padding-y': 8
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#000000',
            'stroke-opacity':'0.3',
            'stroke-width': 1
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#000000',
            'stroke-opacity':'0.1',
            'stroke-width': 1
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#000000',
            'stroke-width': 1
        }
    },
    // Controls whether the tick is a line or circle
     {
       'id': 'ticks',
       'attributes': {
           'customTickShape': true
       }
     },
    // position plot lines, options: 'front', 'back'
    {   'id': 'axis-layer',
        'attributes': {
            'position': 'front'
        }
    },
    {   'id': 'axis-text',
        'attributes': {
            'font-size': 13,
            'font-family': 'AvenirLight, sans-serif',
            'stroke': 'none',
            'fill': '#000000'
        }
    },
    {   'id': 'axis-secondary-text',
        'selector': '.axis .secondary text',
        'attributes': {
            'font-family': 'AvenirLight, sans-serif',
            'font-size': 13,
            'fill': '#000000',
            'text-anchor': 'middle'
        }
    },
    {
        'id': 'x-axis-text',
        'attributes': {
            'text-anchor': 'middle'
        }
    },
    {
        'id': 'y-axis-text',
        'attributes': {
            'text-anchor': 'end',
            'transform': 'translate( 0, 0 )'
        }
    },
    {
        'id': 'y-axis-line',
        'attributes': {
            'x1': 0
        }
    },
    {   'id': 'chart-logo',
        'attributes': {
            'display': 'none'
        }
    },
    {
      'id' : 'datesFormatter',
      'attributes' : {
        'decade-long-year' : "'%y",
        'decade-short-year' : "'%y",
        'centuries-short-year' : "'%y",
        'years-short-year' : "'%y"
      }
    }
];
module.exports.theme.colours = colours;
