require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  getQueryVariable : function (variable) {
     var query = window ? window.location.search.substring(1) : "";
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
             var pair = vars[i].split("=");
             if(pair[0] == variable){return pair[1];}
     }
     return(false);
  },
  getRandomInt : function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  assign : function (target, varArgs) {
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  }
}

},{}],"fixtures":[function(require,module,exports){
var utils = require('./utils');

module.exports = {
  barChart : [
    {
      data : [
       { key: 'red', value: 0.583, value2: 1.583},
       { key: 'blue', value: 0.12, value2: 2},
       { key: 'green', value: 1.03, value2: 1.4},
       { key: 'purple', value: 1.348, value2: 1.9},
       { key: 'orange', value: 1.0, value2: 0.21},
       { key: 'yellow', value: 2.2, value2: 0.98},
       { key: 'pink', value: 1.41, value2: 1.12}
     ],
     x : { series: 'key' },
     y : { series: ['value', 'value2'] }
   },
   {
     data : [
      { key: 'hammer', value: -0.583, value2: 1.583},
      { key: 'spanner', value: 0.12, value2: 2},
      { key: 'drill', value: 1.03, value2: -1.4},
      { key: 'dynomite', value: -3, value2: 1.9}
    ],
    x : { series: 'key' },
    y : { series: ['value', 'value2'] }
  },
  {
    data : [
     { key: 'Bruce Banner', value: utils.getRandomInt(-10,10), value2: utils.getRandomInt(-10,10), value3: utils.getRandomInt(-10,10), value4: utils.getRandomInt(-10,10)},
     { key: 'Clark Kent', value: utils.getRandomInt(-10,10), value2: utils.getRandomInt(-10,10), value3: utils.getRandomInt(-10,10), value4: utils.getRandomInt(-10,10)},
     { key: 'Tony Stark', value: utils.getRandomInt(-10,10), value2: utils.getRandomInt(-10,10), value3: utils.getRandomInt(-10,10), value4: utils.getRandomInt(-10,10)},
     { key: 'Peter Parker', value: utils.getRandomInt(-10,10), value2: utils.getRandomInt(-10,10), value3: utils.getRandomInt(-10,10), value4: utils.getRandomInt(-10,10)}
   ],
   x : { series: 'key' },
   y : { series: ['value', 'value2', 'value3', 'value4'] }
 }
 ],
 lineChart : [
   {
     x: { series: 'date' },
     y: { series: ['Aluminium', 'Crude', 'Steel', 'Nickle', 'Zinc'], reverse: false },
     data: [
       {date: new Date('1998'),Aluminium: 11.9, Crude: 12.8, Steel:1.3, Nickle: 5.9, Zinc:14.9},
       {date: new Date('1999'),Aluminium: 11.9, Crude: 12.8, Steel:1.3, Nickle: 5.9, Zinc:14.9},
       {date: new Date('2000'),Aluminium: 11.9, Crude: 12.8, Steel:1.3, Nickle: 5.9, Zinc:14.9},
       {date: new Date('2001'),Aluminium: 14.9, Crude: 14.7, Steel:9.8, Nickle: 17.9, Zinc:7.3},
       {date: new Date('2002'),Aluminium: 27.0, Crude: 18.4, Steel:12.5, Nickle: 8.8, Zinc:18.8},
       {date: new Date('2003'),Aluminium: 19.4, Crude: 18.6, Steel:26.6, Nickle: 10.9, Zinc:20.6},
       {date: new Date('2004'),Aluminium: 20.9, Crude: 20.2, Steel:27.6, Nickle: 13.2, Zinc:4.9 },
       {date: new Date('2005'),Aluminium: 14.9, Crude: 14.7, Steel:9.8, Nickle: 17.9, Zinc:7.3},
       {date: new Date('2006'),Aluminium: 27.0, Crude: 18.4, Steel:12.5, Nickle: 8.8, Zinc:18.8},
       {date: new Date('2007'),Aluminium: 19.4, Crude: 18.6, Steel:26.6, Nickle: 10.9, Zinc:20.6},
       {date: new Date('2008'),Aluminium: 20.9, Crude: 20.2, Steel:27.6, Nickle: 13.2, Zinc:4.9 },
       {date: new Date('2009'),Aluminium: 14.9, Crude: 14.7, Steel:9.8, Nickle: 17.9, Zinc:7.3},
       {date: new Date('2010'),Aluminium: 27.0, Crude: 18.4, Steel:12.5, Nickle: 8.8, Zinc:18.8},
       {date: new Date('2011'),Aluminium: 19.4, Crude: 18.6, Steel:26.6, Nickle: 10.9, Zinc:20.6},
       {date: new Date('2012'),Aluminium: 20.9, Crude: 20.2, Steel:27.6, Nickle: 13.2, Zinc:4.9 }
     ]
   },
   {
     x: { series: 'date' },
     y: { series: ['value', 'value2'], reverse: false },
     data: [
       { date: new Date('2001-01-01'), value: 0.583, value2: 1.583},
       { date: new Date('2001-02-01'), value: 0.12, value2: 2},
       { date: new Date('2001-03-01'), value: 1.03, value2: 1.4},
       { date: new Date('2001-04-01'), value: -1.348, value2: 1.9},
       { date: new Date('2001-05-01'), value: -1.348, value2: 1.9},
       { date: new Date('2001-06-01'), value: -1.348, value2: 1.9},
       { date: new Date('2001-07-01'), value: -1.348, value2: 1.9},
       { date: new Date('2001-08-01'), value: -1.348, value2: 1.2},
       { date: new Date('2001-09-01'), value: -1.348, value2: 1.1},
       { date: new Date('2001-10-01'), value: -1.348, value2: 0.1},
       { date: new Date('2001-11-01'), value: -1.348, value2: -0.3}
     ]
   },
   {
     x: { series: 'date' },
     y: { series: ['Aluminium', 'Crude', 'Steel', 'Nickle', 'Zinc'], reverse: false },
     data: [
       {date: new Date('2000'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
       {date: new Date('2001'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
       {date: new Date('2002'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
       {date: new Date('2003'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
       {date: new Date('2004'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
       {date: new Date('2005'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
       {date: new Date('2006'),Aluminium: utils.getRandomInt(-10,10), Crude: utils.getRandomInt(-10,10), Steel:utils.getRandomInt(-10,10), Nickle: utils.getRandomInt(-10,10), Zinc: utils.getRandomInt(-10,10)},
     ]
   },
 ]
}

},{"./utils":1}]},{},["fixtures"]);
