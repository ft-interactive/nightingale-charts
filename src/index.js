'use strict';

module.exports  = {

  chart: require('./chart/index.js'),

  axis: require('./axis/index.js'),

  element: {
    lineKey: require('./element/line-key.js'),
    textArea: require('./element/text-area.js')
  },

  util: {
    attributeStyler: require('./util/chart-attribute-styles.js')
  }

};
