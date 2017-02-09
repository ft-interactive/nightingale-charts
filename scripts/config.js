require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"config":[function(require,module,exports){
module.exports = {
  config : {
    barChart : {
      comment: 'Bar chart',
      title: 'Bar Chart',
      subtitle: 'Categories, with a vertical independent axis',
      dependentAxisOrient: 'bottom',
      independentAxisOrient: 'left',
      stack: false,
      dataType : 'categorical'
    },
    columnChart : {
      theme: 'ft-web',
      comment: 'Column chart',
      title: 'Column Chart',
      subtitle: 'Cheeky subtitle',
      source: 'with a source',
      footnote: 'my footnote',
      dependentAxisOrient: 'right',
      independentAxisOrient: 'bottom',
      dataType : 'categorical'
    },
    lineChart : {
      comment: 'Line chart',
      title: 'Line Chart',
      subtitle: 'Dates, with a vertical independent axis',
      dependentAxisOrient: 'left',
      independentAxisOrient: 'bottom',
      footnote: "This is another way of doing things which i enjoy",
      source: "This is a source, a very lengthy one at that, so that we can test the layout",
      dataType : 'time',
      keyHover: true,
    },
    sizes : {
      small : {
        width: 200
      },
      medium : {
        width: 300
      },
      large : {
        width: 600
      }
    }
  }
}

},{}]},{},["config"]);
