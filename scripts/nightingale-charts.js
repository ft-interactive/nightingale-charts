require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"./support/isBuffer":2,"inherits":1}],4:[function(require,module,exports){
module.exports={"version":"1.0.0"}

},{}],5:[function(require,module,exports){
var d3 = require('d3');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var timeDiff = dates.timeDiff;

function categoryAxis() {

    var config = {
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false,
        dataType: 'categorical',
        attr: {
            ticks: {
                'stroke-dasharray': 'none',
                'stroke': 'rgba(0, 0, 0, 0.3)',
                'shape-rendering': 'crispEdges'
            },
            primary: {
                fill:'#757470',
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12
            },
            secondary: {},
            xAxisLabel:{
              'text-anchor': 'start'
            },
            yAxisLabel:{
              'text-anchor': 'end'
            },
            yAxisLine: {}
        }
    };

    function isVertical(){
        return ['right','left'].indexOf(config.axes[0].orient())>-1;
    }

    function render(g) {
        var orientOffset = (isVertical()) ? -config.axes[0].tickSize() : 0;
        var className = isVertical() ? 'y' : 'x';
        config.attr.primary['text-anchor'] = isVertical() ? 'end' : 'middle';
        config.attr.secondary['text-anchor'] = isVertical() ? 'end' : 'middle';

        g = g.append('g')
            .attr('transform', 'translate(' + (config.xOffset + orientOffset) + ',' + config.yOffset + ')')
            .attr('class', className + ' axis axis--independent axis--category').each(function () {
                labels.add(d3.select(this), config);
            });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
    }

    render.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return render;
    };

    render.dataType = function (dataType) {
        if (!arguments.length) return config.dataType;
        config.dataType = dataType;
        return render;
    };

    render.nice = function (bool) {
        if (!arguments.length) return config.nice;
        config.nice = bool;
        return render;
    };

    render.tickSize = function (int) {
        if (!arguments.length) return config.tickSize;
        config.tickSize = int;
        return render;
    };

    render.labelWidth = function (int) {
        if (!arguments.length) return config.labelWidth;
        config.labelWidth = int;
        return render;
    };

    render.lineHeight = function (int) {
        if (!arguments.length) return config.lineHeight;
        config.lineHeight = int;
        return render;
    };

    render.orient = function (string) {
        if (!arguments.length) return config.axes[0].orient();
        config.axes[0].orient(string);
        return render;
    };

    render.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return render;
    };

    render.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return render;
    };

    render.attrs = function (obj, target) {
        if (!arguments.length) return config.attr[target || 'primary'];
        if (typeof obj !== "undefined") config.attr[target || 'primary'] = obj;
        //for (var prop in config.attr){
        //    if (render[prop]) render[prop](obj[prop]);
        //}
        return render;
    };

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        units = units || ['unknown'];
        if (config.dataType === 'categorical'){
            units = ['categorical'];
        }
        config.scale = scale;
        config.units = units;

        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (dates.formatGroups[unit]) {
                var axis = d3.svg.axis()
                    .orient(config.axes[0].orient())
                    .scale(scale)
                    .tickFormat(dates.formatGroups[unit])
                    .tickSize(config.tickSize, 0);
                axes.push(axis);
            }
        }

        config.axes = axes;
        return render;
    };

    return render;
}

module.exports = categoryAxis;

},{"../util/dates.js":38,"../util/labels.js":39,"d3":"d3"}],6:[function(require,module,exports){
var d3 = require('d3');
var axis = {
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};
var intraDay = require('../scales/intra-day');
var themes = require('../themes');


var PADDING = 4;

function getDimension(dimension, selection) {
    if (!selection.node()) return 0;
    return Math.ceil(selection.node().getBoundingClientRect()[dimension]);
}
function getWidth(selection)  { return getDimension('width', selection);  }
function getHeight(selection) { return getDimension('height', selection); }
function isVertical(orient)   { return orient == 'right' || orient == 'left'; }

function getRange(model, orientation) {
    var chartType = model.chartType;
    var plotWidth = model.plotWidth = model.chartWidth - model.yLabelWidth;
    var plotHeight = model.plotHeight =  model.chartHeight - model.xLabelHeight;
    var plotPaddingX = themes.check(model.theme, 'chart-plot').attributes['padding-x'] || 0;
    var plotWidthInPixels = (chartType !== 'bar' && plotPaddingX > 0) ? (plotWidth * plotPaddingX) : 0;    
    var rangePlotWidth = (plotWidthInPixels > 0) ? [0 + plotWidthInPixels, plotWidth - plotWidthInPixels] : [0, plotWidth];
    return (isVertical(orientation)) ? [0, plotHeight] : rangePlotWidth;
}

function ordinalScale(model, options, orientation) {
    var range = getRange(model, orientation);
    return d3.scale.ordinal()
        .domain(model.independentDomain)
        .rangeRoundBands(range, 0, options.margin);
}

function timeScale(model, options, orientation) {
    var range = getRange(model, orientation);
    return d3.time.scale()
        .domain(model.independentDomain)
        .range(range);
}

function intraDayScale(model, options, orientation) {
    var range = getRange(model, orientation);
    return intraDay(model.open, model.close)
        .domain(model.independentDomain)
        .range(range);
}

function linearScale(model, options, orientation) {
    var range = getRange(model, orientation);
    var domain = (isVertical(orientation)) ? model.dependentDomain.reverse() : model.dependentDomain;
    return d3.scale.linear()
        .range(range)
        .domain(domain);
}

function setChartPosition(g, model){
    var labelSpace = 0,
        spacing = PADDING,
        top = model.chartPosition.top,
        left = model.chartPosition.left;
    if (isVertical(model.independentAxisOrient)) {
        spacing = model.tickSize + (PADDING * 2);
    } else {
        top += (getHeight(g.select('.y.axis')) - model.plotHeight);
    }
    if ([model.dependentAxisOrient,model.independentAxisOrient].indexOf('top') >-1) {
        g.selectAll('.x.axis text').each(function () {
            labelSpace = Math.max(labelSpace, getHeight(d3.select(this)));
        });
        top += labelSpace;
    }
    if ([model.dependentAxisOrient,model.independentAxisOrient].indexOf('left') >-1) {
        g.selectAll('.y.axis text').each(function () {
            labelSpace = Math.max(labelSpace, getWidth(d3.select(this)));
        });
        left += labelSpace + spacing;
    }
    return { top: top, left: left};
}

function Create(svg, model) {
    if (!model.independentAxisOrient) {
        throw new Error("No independent axis orientation {left, right, top, bottom}");
    }
    if (!model.dependentAxisOrient) {
        throw new Error("No dependent axis orientation {left, right, top, bottom}");
    }

    this.model = model;
    this.chart = svg;
    this.margin = 0.2;
    this.attrs = {};
}

Create.prototype.getAttr = function(id){
    if (!this.attrs[id]){
        this.attrs[id] = themes.check(this.model.theme, id).attributes;
    }
    return this.attrs[id];
};

Create.prototype.hideTicks = function () {
    var tickCount = this.chart.selectAll('.x.axis .primary line')[0].length;
    var labelCount= this.chart.selectAll('.x.axis .primary text')[0].length;
    var labelsShownRatio = labelCount/tickCount;
    var allPositiveValues = Math.min.apply(null, this.dependentAxisScale.domain()) >= 0;
    return labelsShownRatio===1 && allPositiveValues;
};

Create.prototype.configureDependentScale = function (model) {
    this.dependentAxis
        .tickFormat(model.numberAxisFormatter)
        .simple(model.simpleValue)
        .orient(model.dependentAxisOrient)
        .reverse(model.y.reverse)
        .attrs(model.chartType, 'chart-type')
        .attrs(model.dependentAxisOrient, 'chart-alignment')
        .attrs(this.getAttr('dependent-ticks'), 'ticks')
        .attrs(this.getAttr('origin-ticks'), 'origin')
        .attrs(this.getAttr('axis-text'), 'primary')
        .attrs(this.getAttr('x-axis-text'), 'xAxisLabel')
        .attrs(this.getAttr('y-axis-text'), 'yAxisLabel')
        .attrs(this.getAttr('y-axis-line'), 'yAxisLine');

    if (isVertical(model.dependentAxisOrient)) {
        this.dependentAxis.tickSize(model.plotWidth)
            .tickExtension(model.yLabelWidth);
    } else {
        this.dependentAxis.tickSize(model.plotHeight)
            .yOffset(model.dependentAxisOrient =='bottom' ? model.plotHeight : 0);
        //this.dependentAxis.noLabels(true);
    }
    // THIS IS A HACK BECAUSE FOR SOME REASON THE
    // DOMAIN IS COMING BACK DIFFERENT ON THESE SCALES
    // ;_;
    this.dependentAxis.scale(this.dependentAxisScale);
    this.dependentAxis.scale().domain(this.dependentAxisScale.domain());
    this.chart.call(this.dependentAxis);
};

Create.prototype.configureIndependentScale = function (model) {
    this.independentAxis
        .simple(model.simpleDate)
        .tickSize(model.tickSize)
        .orient(model.independentAxisOrient)
        .attrs(model.chartType, 'chart-type')
        .attrs(model.dependentAxisOrient, 'chart-alignment')
        .attrs(this.getAttr('independent-ticks'), 'ticks')
        .attrs(this.getAttr('origin-ticks'), 'origin')
        .attrs(this.getAttr('axis-text'), 'primary')
        .attrs(this.getAttr('axis-secondary-text'), 'secondary')
        .attrs(this.getAttr('x-axis-text'), 'xAxisLabel')
        .attrs(this.getAttr('y-axis-text'), 'yAxisLabel')
        .attrs(this.getAttr('y-axis-line'), 'yAxisLine');
    if (!isVertical(model.independentAxisOrient)) {
        this.independentAxis.yOffset(model.plotHeight);	//position the axis at the bottom of the chart
    }
    this.independentAxis.scale(this.independentAxisScale, this.model.units);
    // ?? do we need to do the same here?
    this.chart.call(this.independentAxis);
};

Create.prototype.repositionAxis = function () {
    var model = this.model;
    var independentRange = getRange(model, model.independentAxisOrient);
    var dependentRange = getRange(model, model.dependentAxisOrient);

    if (this.independentAxisScale.rangeRoundBands) {
        this.independentAxisScale.rangeRoundBands(independentRange, this.margin);
    } else {
        this.independentAxisScale.range(independentRange);
    }
    this.dependentAxisScale.range(dependentRange);

    this.configureIndependentScale(model);
    this.configureDependentScale(model);
};

Create.prototype.independentScale = function (scale) {
    var model = this.model;
    if(scale == 'ordinal'){
        this.independentAxisScale = ordinalScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.category().dataType(model.dataType);
    } else if (model.intraDay) {
        this.independentAxisScale = intraDayScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.date();
    } else {
        this.independentAxisScale = timeScale(model, this, model.independentAxisOrient);
        this.independentAxis = axis.date();
    }
    this.configureIndependentScale(this.model);
};

Create.prototype.dependentScale = function (scale) {
    var model = this.model;
    this.dependentAxisScale = linearScale(model, this, model.dependentAxisOrient);
    this.dependentAxis = axis.number();
    if (model.niceValue) {
        this.dependentAxisScale.nice();
    }
    this.configureDependentScale(this.model);
};

Create.prototype.yLabelWidth = function () {
    var widest  = 0;
    this.chart.selectAll('.axis.y text').each(function(d, i){
        widest = Math.max(getWidth(d3.select(this)) + PADDING, widest);
    });
    return widest;
};

Create.prototype.createAxes = function (axesSpec) {
    var model = this.model;
    var spacing = model.tickSize + (PADDING * 2);
    this.independentScale(axesSpec.independent);

    if (isVertical(model.dependentAxisOrient)) {
        model.xLabelHeight = getHeight(this.chart) + spacing;
        this.dependentScale(axesSpec.dependent); //create Y
        model.yLabelWidth = this.yLabelWidth();
    } else {
        model.yLabelWidth = this.yLabelWidth();
        this.dependentScale(axesSpec.dependent);
        model.xLabelHeight = getHeight(this.chart) - model.chartHeight;
    }
    this.model.tickSize = (model.chartType == 'column' && this.hideTicks()) ? 0 : model.tickSize;
    this.chart.selectAll('*').remove();
    this.repositionAxis();
    model.chartPosition = setChartPosition(this.chart, model);
    this.chart.attr('transform', model.translate(model.chartPosition));
};

module.exports = Create;

},{"../scales/intra-day":30,"../themes":35,"./category.js":5,"./date.js":7,"./number.js":10,"d3":"d3"}],7:[function(require,module,exports){
var d3 = require('d3');
var labels = require('../util/labels.js');
var dates = require('../util/dates.js');
var dateScale = require('./date.scale.js');
var timeDiff = dates.timeDiff;

function dateAxis() {
    var config = {
        axes: [d3.svg.axis().orient('bottom')],
        scale: false,
        lineHeight: 20,
        tickSize: 5,
        simple: false,//axis has only first and last points as ticks, i.e. the scale's domain extent
        nice: false,
        pixelsPerTick: 100,
        units: ['multi'],
        unitOverride: false,
        yOffset: 0,
        xOffset: 0,
        labelWidth: 0,
        showDomain: false,
        attr: {
            ticks: {
                'stroke': 'rgba(0, 0, 0, 0.3)',
                'shape-rendering': 'crispEdges'
            },
            primary: {
                fill:'#757470',
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12
            },
            secondary: {},
            xAxisLabel: {
              'text-anchor': 'start'
            },
            yAxisLabel: {
              'text-anchor': 'end'
            },
            yAxisLine: {}
        }
    };

    function isVertical(){
        if (!config.axes.length) return true; //todo: log error. no axis
        return ['right','left'].indexOf(config.axes[0].orient())>-1;
    }

    function render(g) {

        var lineChartTextAnchor = isVertical() ? 'end' : 'start';

        if(config.attr['chart-type'] === 'line') {
          lineChartTextAnchor = isVertical() ? config.attr.yAxisLabel['text-anchor'] : config.attr.xAxisLabel['text-anchor'];
        }

        config.attr.primary['text-anchor'] = lineChartTextAnchor;
        config.attr.secondary['text-anchor'] = isVertical() ? 'end' : 'start';

        g = g.append('g').attr('transform', 'translate(' + config.xOffset + ',' + config.yOffset + ')');
        g.append('g').attr('class', 'x axis axis--independent axis--date').each(function () {
            labels.add(d3.select(this), config);
        });

        if (!config.showDomain) {
            g.select('path.domain').remove();
        }
    }

    render.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return render;
    };

    render.nice = function (bool) {
        if (!arguments.length) return config.nice;
        config.nice = bool;
        return render;
    };

    render.tickSize = function (int) {
        if (!arguments.length) return config.tickSize;
        config.tickSize = int;
        return render;
    };

    render.labelWidth = function (int) {
        if (!arguments.length) return config.labelWidth;
        config.labelWidth = int;
        return render;
    };

    render.lineHeight = function (int) {
        if (!arguments.length) return config.lineHeight;
        config.lineHeight = int;
        return render;
    };

    render.orient = function (string) {
        if (!arguments.length) return config.axes[0].orient();
        if (!config.axes.length) return render;
        config.axes[0].orient(string);
        return render;
    };

    render.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return render;
    };

    render.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return render;
    };

    render.attrs = function (obj, target) {
        if (!arguments.length) return config.attr[target || 'primary'];
        if (typeof obj !== "undefined") config.attr[target || 'primary'] = obj;
        //for (var prop in config.attr){
        //    if (render[prop]) render[prop](obj[prop]);
        //}
        return render;
    };

    render.scale = function (scale, units) {
        if (!arguments.length) return config.axes[0].scale();
        if (!units ||
            (units[0] === 'daily' && timeDiff(scale.domain()).months > 1) ||
            (units[0] === 'weekly' && timeDiff(scale.domain()).years > 1) ||
            (units[0] === 'quarterly' && timeDiff(scale.domain()).decades > 1) ||
            (units[0] === 'monthly' && timeDiff(scale.domain()).years > 4.9) ||
            (units[0] === 'yearly' && timeDiff(scale.domain()).years > 10)){
            units = dates.unitGenerator(scale.domain(), config.simple);
        }
        if (config.nice) {
            scale.nice((scale.range()[1] - scale.range()[0]) / config.pixelsPerTick);
        }
        config.units = units;
        config.scale = scale;
        config.axes = dateScale.render(scale, units, config);
        return render;
    };

    return render;
}

module.exports = dateAxis;

},{"../util/dates.js":38,"../util/labels.js":39,"./date.scale.js":8,"d3":"d3"}],8:[function(require,module,exports){
var d3 = require('d3');
var utils = require('../util/dates.js');

var interval = {
    centuries: d3.time.year,
    decades: d3.time.year,
    yearly: d3.time.year,
    years: d3.time.year,
    fullYears: d3.time.year,
    quarterly: d3.time.month,
    monthly: d3.time.month,
    months: d3.time.month,
    weeks: d3.time.week,
    weekly: d3.time.week,
    days: d3.time.day,
    daily: d3.time.day,
    hours: d3.time.hours
};

var increment = {
    centuries: 100,
    decades: 10,
    yearly: 1,
    years: 1,
    fullYears: 1,
    quarterly: 3,
    monthly: 1,
    months: 1,
    weeks: 1,
    weekly: 1,
    days: 1,
    daily: 1,
    hours: 1
};

module.exports = {
    customTicks: function (scale, unit, primaryUnit) {
        if (primaryUnit == 'quarterly' && unit == 'yearly') unit = 'quarterly';
        var customTicks = scale.ticks(interval[unit], increment[unit]);
        customTicks.push(scale.domain()[0]); //always include the first and last values
        customTicks.push(scale.domain()[1]);
        customTicks.sort(this.dateSort);

        //if the last 2 values labels are the same, remove them
        var labels = customTicks.map(utils.formatter[unit]);
        if (labels[labels.length - 1] == labels[labels.length - 2]) {
            customTicks.pop();
        }
        return customTicks;
    },
    dateSort: function (a, b) {
        return (a.getTime() - b.getTime());
    },
    createAxes: function(scale, unit, config, primaryUnit){
        var firstDate ;
        var customTicks = (config.simple) ? scale.domain() : this.customTicks(scale, unit, primaryUnit);
        var axis = d3.svg.axis()
            .scale(scale)
            .tickValues(customTicks)
            .tickFormat(function(d,i){
                firstDate = firstDate || d;
                return utils.formatter[unit](d,i, firstDate);
            })
            .tickSize(config.tickSize, 0);
        return axis;
    },
    render: function (scale, units, config) {
        var axes = [];
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (utils.formatter[unit]) {
                axes.push(this.createAxes(scale, unit, config, units[0]));
            }
        }
        return axes;
    }
};

},{"../util/dates.js":38,"d3":"d3"}],9:[function(require,module,exports){
module.exports = {
    Create: require('./create.js'),
    Plot: require('./plot.js'),
    category: require('./category.js'),
    date: require('./date.js'),
    number: require('./number.js')
};

},{"./category.js":5,"./create.js":6,"./date.js":7,"./number.js":10,"./plot.js":13}],10:[function(require,module,exports){
//this is wrapper for d3.svg.axis
//for a standard FT styled numeric axis
//usually these are vertical

var d3 = require('d3');
var numberLabels = require('./number.labels');
var numberScales = require('./number.scale');

function numericAxis() {
    'use strict';

    var config = {
        axes: d3.svg.axis().orient('left').tickSize(5, 0),
        tickSize: 5,
        lineHeight: 16,
        userTicks: [],
        hardRules: [0],
        yOffset: 0,
        xOffset: 0,
        reverse: false,
        simple: false,
        noLabels: false,
        pixelsPerTick: 100,
        tickExtension: 0,
        attr: {
            ticks: {
                'stroke': 'rgba(0, 0, 0, 0.1)',
                'shape-rendering': 'crispEdges'
            },
            origin: {
                'stroke': 'rgba(0, 0, 0, 0.3)',
                'stroke-dasharray': 'none'
            },
            primary:{
                fill:'#757470',
                'font-family': 'BentonSans, sans-serif',
                'font-size': 12
            },
            secondary: {},
            xAxisLabel: {
              'text-anchor': 'start'
            },
            yAxisLabel: {
              'text-anchor': 'end'
            },
            yAxisLine: {}
        }
    };

    function isVertical(){
        return ['right','left'].indexOf(config.axes.orient())>-1;
    }

    function axis(g) {
        var orientOffset = (config.axes.orient() === 'right') ? -config.axes.tickSize() : 0;

        var yAxisRightAligned = config.attr['chart-alignment'] === 'right' && config.attr['chart-type'] === 'line' && config.attr.yAxisLine.x1 === 0;
        var yAxisLabelTextAnchor = yAxisRightAligned ? 'start' : config.attr.yAxisLabel['text-anchor'];
        config.attr.primary['text-anchor'] = isVertical() ? yAxisLabelTextAnchor : config.attr.xAxisLabel['text-anchor'];
        config.attr.secondary['text-anchor'] = isVertical() ? 'end' : 'start';

        g = g.append('g').attr('transform', 'translate(' + (config.xOffset + orientOffset) + ',' + config.yOffset + ')');
        numberLabels.render(g, config);
        if (config.noLabels) {
            g.selectAll('text').remove();
        }
    }

    axis.tickExtension = function (int) { // extend the axis ticks to the right/ left a specified distance
        if (!arguments.length) return config.tickExtension;
        config.tickExtension = int;
        return axis;
    };

    axis.tickSize = function (int) {
        if (!arguments.length) return config.axes.tickSize();
        config.axes.tickSize(-int);
        return axis;
    };

    axis.ticks = function (int) {
        if (!arguments.length) return config.axes.ticks();
        if (int.length > 0) {
            config.userTicks = int;
        }
        return axis;
    };

    axis.orient = function (string) {
        if (!arguments.length) return config.axes.orient();
        if (string) {
            config.axes.orient(string);
        }
        return axis;
    };

    axis.reverse = function (bool) {
        if (!arguments.length) return config.reverse;
        config.reverse = bool;
        if (config.reverse){
            config.axes.scale().domain(config.axes.scale().domain().reverse());
        }
        return axis;
    };

    axis.simple = function (bool) {
        if (!arguments.length) return config.simple;
        config.simple = bool;
        return axis;
    };

    axis.pixelsPerTick = function (int) {
        if (!arguments.length) return config.pixelsPerTick;
        config.pixelsPerTick = int;
        return axis;
    };

    axis.scale = function (x) {
        if (!arguments.length) return config.axes.scale();
        config.axes.scale(x);
        axis.reverse(config.reverse);
        if (config.userTicks.length > 0) {
            config.axes.tickValues(config.userTicks);
        } else {
            var customTicks = numberScales.customTicks(config);
            config.axes.tickValues(customTicks);
        }
        config.reverse = false; //only reverse once, even if scale is called twice i.e. in redraw
        return axis;
    };

    axis.hardRules = function (int) { //this allows you to set which lines will be solid rather than dotted, by default it's just zero and the bottom of the chart
        if (!arguments.length) return config.hardRules;
        config.hardRules = int;
        return axis;
    };

    axis.yOffset = function (int) {
        if (!arguments.length) return config.yOffset;
        config.yOffset = int;
        return axis;
    };

    axis.xOffset = function (int) {
        if (!arguments.length) return config.xOffset;
        config.xOffset = int;
        return axis;
    };

    axis.tickFormat = function (format) {
        if (!arguments.length) return config.axes.tickFormat();
        config.axes.tickFormat(format);
        return axis;
    };

    axis.noLabels = function (bool) {
        if (!arguments.length) return config.noLabels;
        config.noLabels = bool;
        return axis;
    };

    axis.attrs = function (obj, target) {
        if (!arguments.length) return config.attr[target || 'primary'];
        if (typeof obj !== "undefined") config.attr[target || 'primary'] = obj;
        //for (var prop in config.attr){
        //    if (axis[prop]) axis[prop](obj[prop]);
        //}
        return axis;
    };

    return axis;
}

module.exports = numericAxis;

},{"./number.labels":11,"./number.scale":12,"d3":"d3"}],11:[function(require,module,exports){
module.exports = {

    isVertical: function (axis) {
        return axis.orient() === 'left' || axis.orient() === 'right';
    },
    arrangeTicks: function (g, config) {
        var textWidth = this.textWidth(g, config.axes.orient());
        g.selectAll('.tick')
            .classed('origin', function (d, i) {
                return config.hardRules.indexOf(d) > -1;
            });
        g.selectAll('line').attr(config.attr.ticks);
        g.selectAll('.origin line').attr(config.attr.origin);
        if (this.isVertical(config.axes)) {
            var checkIfYAxisLine = config.attr['chart-type'] === 'line' ? config.attr.yAxisLabel.transform : undefined;
            var configYAxisTranslate = checkIfYAxisLine || 'translate( ' + textWidth + ', ' + -(config.lineHeight / 2) + ' )';
            g.selectAll('text').attr('transform', configYAxisTranslate);
        }
    },
    extendAxis: function (g, axes, tickExtension) {
        var rules = g.selectAll('line');
        if (axes.orient() === 'right') {
            rules.attr('x1', tickExtension);
        } else {
            rules.attr('x1', (tickExtension === 0 ? 0 : -tickExtension));
        }
    },
    textWidth: function (g, orient) {
        var textWidth = 0;
        if (orient == 'right') {
            g.selectAll('text').each(function (d) {
                textWidth = Math.max(textWidth, Math.ceil(this.getBoundingClientRect().width));
            });
        }
        return textWidth;
    },
    removeDecimals: function (g) {
        var decimalTotal = 0;
        g.selectAll('text').each(function (d) {
            var val0 = parseFloat(this.textContent.split('.')[0]);
            var val1 = parseFloat(this.textContent.split('.')[1]);
            decimalTotal += val1;
            if (val0 === 0 && val1 === 0) {
                this.textContent = 0;
            }
        });
        if (!decimalTotal) {
            g.selectAll('text').each(function (d) {
                this.textContent = this.textContent.split('.')[0];
            });
        }
    },
    render: function (g, config) {
        var xOrY = (this.isVertical(config.axes)) ? 'y' : 'x';
        var orient = config.axes.orient();
        g.append('g')
            .attr('class', 'axis axis--dependent axis--number ' + xOrY + ' ' + orient)
            .append('g')
            .attr('class', 'primary')
            .call(config.axes);

        g.selectAll('text').attr('style','').attr(config.attr.primary);

        this.removeDecimals(g);
        this.arrangeTicks(g, config);
        if (this.isVertical(config.axes)) {
            var yAxisLine = config.attr.yAxisLine.x1;
            var tickExtension = yAxisLine !== undefined && config.attr['chart-type'] === 'line' ? yAxisLine : config.tickExtension;
            this.extendAxis(g, config.axes, tickExtension);
        }
    }

};

},{}],12:[function(require,module,exports){
module.exports = {
    removeDuplicateTicks: function (scale, ticks) {
        var formatted = [];
        var tickFormat = scale.tickFormat();
        ticks = ticks.filter(function (d) {
            var f = tickFormat(d);
            if (formatted.indexOf(f) > -1) {
                return false;
            }
            formatted.push(f);
            return true;
        });
        return ticks;
    },
    tickIntervalBoundaries: function (ticks) {
        var interval = 0, step;
        ticks.forEach(function (d, i) {
            if (i == ticks.length - 1)  return;
            // there was an issue with float precission
            // so we're ensuring the step is sound
            step = +((ticks[i + 1] - d).toPrecision(12));
            interval = Math.max(step, interval);
        });
        return interval;
    },
    detailedTicks: function (scale, pixelsPerTick) {
        var count = this.tickCount(scale, pixelsPerTick);
        var ticks = scale.ticks(count);
        var interval = this.tickIntervalBoundaries(ticks);
        var pos = scale.domain()[0] > scale.domain()[1] ? 0 : 1;
        var d1 = Math.ceil(scale.domain()[pos] / interval) * interval;
        var d2 = Math.floor(scale.domain()[1-pos] / interval) * interval;
        ticks[d1<=0 ? 'unshift' : 'push'](d1);
        ticks[d2<=0 ? 'unshift' : 'push'](d2);
        scale.domain()[pos] = d1;
        scale.domain()[1-pos] = d2;
        return ticks;
    },
    simpleTicks: function (scale) {
        var customTicks = [];
        var domain = scale.domain();
        if (Math.min(domain[0], domain[1]) < 0 && Math.max(domain[0], domain[1]) > 0) {
            customTicks.push(0);
        }
        customTicks.push(domain[1]);
        customTicks.push(domain[0]);
        return customTicks;
    },
    tickCount: function (scale, pixelsPerTick) {
        var count = Math.round((scale.range()[1] - scale.range()[0]) / pixelsPerTick);
        if (count < 2) {
            count = 3;
        }
        else if (count < 5) {
            count = 5;
        }
        else if (count < 10) {
            count = 10;
        }
        return count;
    },
    customTicks: function (config){
        var customTicks = [];
        var scale = config.axes.scale();
        if (config.simple) {
            customTicks = this.simpleTicks(scale);
        } else {
            customTicks = this.detailedTicks(scale, config.pixelsPerTick);
            var pos = scale.domain()[0] > scale.domain()[1] ? 1 : 0;
            if (config.reverse) pos = 1 - pos;
            config.hardRules.push(scale.domain()[pos]);
        }
        customTicks = this.removeDuplicateTicks(scale, customTicks);
        return customTicks;
    }
};

},{}],13:[function(require,module,exports){
var d3 = require('d3');

function stackSeries(model, value, stack){
    if(!model.stacks )        model.stacks = [];
    if (!model.stacks[stack]) model.stacks[stack] = [];
    model.stacks[stack].push(value);
    return model.stacks[stack];
}

function Plot(model, axes) {
    this.model = model;
    this.axes = axes;
}

Plot.prototype.columnHeight = function (value){
    return Math.abs(this.axes.dependentAxisScale(value) - this.axes.dependentAxisScale(0));
};

Plot.prototype.barWidth = function(value) {
    return Math.abs(this.axes.dependentAxisScale(value) - this.axes.dependentAxisScale(0));
};

Plot.prototype.columnWidth = function (){
    var size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if(!this.model.stack){
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.barHeight = function() {
    var size = 20;
    if (this.axes.independentAxisScale.rangeBand) {
        size = this.axes.independentAxisScale.rangeBand();
    }
    if (!this.model.stack) {
        size = size / this.model.y.series.length;
    }
    return size;
};

Plot.prototype.x = function (){
    if (['bottom','top'].indexOf(this.model.independentAxisOrient)>-1){
        return this.xIndependent.apply(this, arguments);
    } else {
        return this.xDependent.apply(this, arguments);
    }
};

Plot.prototype.y = function(){
    if (['bottom','top'].indexOf(this.model.independentAxisOrient)>-1){
        return this.yDependent.apply(this, arguments);
    } else {
        return this.yIndependent.apply(this, arguments);
    }
};

Plot.prototype.xDependent = function(value, stack, width) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.min(0, value);
    if (this.model.stack && width !== undefined) {
      maxValue = value < 0 ? Math.min(0, value) : Math.max(0, value - width);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.yDependent = function(value, stack, height) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.max(0, value);
    if (this.model.stack && height !== undefined) {
      maxValue = value < 0 && value !== height ? Math.min(0, value - height) : Math.max(0, value);
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.xIndependent = function(key, seriesNumber) {
    var position = this.axes.independentAxisScale(key);
    var adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

Plot.prototype.yIndependent = function(key, seriesNumber) {
    var position = this.axes.independentAxisScale(key);
    var adjust = 0;
    if (this.axes.independentAxisScale.rangeBand && !this.model.stack) {
        adjust = (this.axes.independentAxisScale.rangeBand() / this.model.y.series.length) ;
    }
    return position + (adjust * seriesNumber);
};

module.exports = Plot;

},{"d3":"d3"}],14:[function(require,module,exports){
var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){

	var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var s = plotSVG.append('g').attr('class', 'series');
    var attr = themes.check(model.theme, 'bars').attributes;
    attr.fill = model.gradients[series.index] || model.colours[series.index];

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'bar '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x', function (d, i){
					if (model.stack) {
						return plot.x(d.value, i, getStackedWidth(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.x(d.value, i);
				})
        .attr('y', function (d, i){ return plot.y(d.key, seriesNumber); })
        .attr('height', function (d, i){ return plot.barHeight(d, i); })
        .attr('width', function (d, i){
					if (model.stack) {
						return plot.barWidth(getStackedWidth(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.barWidth(d.value);
				})
        .attr(attr);

    if (!model.stack) {
        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('x',  function (d, i) { return plot.x(d.value, i); })
            .attr('y',  function (d, i) {
                var yPos = plot.y(d.key, seriesNumber);
                var halfHeight = plot.barHeight(d, i) / 2;
                return yPos + halfHeight;
            })
            .attr({
                'class': 'null-label',
                'dx': '1em',
                'dy': '0.31em'
            }).attr(themes.check(model.theme, 'null-label').attributes)
            .text('n/a');
    }

    if (!model.stack) {
        // make those labels who don't fit smaller
        s.selectAll('text.null-label')
            .each(function(d, i) {
                var w = this.getBoundingClientRect();
                if ((w.height + 2) >= plot.barHeight(d, i)) {
                    this.innerHTML = '–';
                }
            });
    }
}

function formatData(model, series) {

    var nulls = [];
    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        var isNull = !(d.value !== null && !isNaN(d.value));
        if (isNull) nulls.push(d);
        // if we're stacking - we transform nulls
        // into zeros to avoid problems
        if (model.stack && isNull) {
            d.value = 0;
            return true;
        }
        return !isNull;
    });

    data._nulls = nulls;

    return data;
}

function getStackedWidth(data, stacks, key, val, xKey) {
	var value = isNaN(val) ? 0 : val;
	var width;
	var seriesKey;
	function calculateWidth(val, nextVal, previousVal) {
		if (val < 0 && previousVal >= 0) {
			return val;
		} else if (val >= 0 && nextVal < 0) {
			return val;
		} else if (val < 0 && nextVal < 0) {
			return val - nextVal;
		}
		return val - nextVal;
	}
	data.map(function(d, i) {
		if (d[xKey] === key) {
			seriesKey = i;
		}
	});
	stacks[seriesKey].sort(function(a, b) {
		return b-a;
	}).map(function(data, i) {
		var isValuePositive = data < 0 ? false : true;
		var previousVal = stacks[seriesKey][i-1];
		if (data === value) {
			if (isValuePositive && stacks[seriesKey][i+1] !== undefined) {
				width = calculateWidth(value, stacks[seriesKey][i+1], previousVal);
			} else if (isValuePositive && stacks[seriesKey][i+1] === undefined) {
				width = calculateWidth(value, 0, previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] !== undefined) {
				width = calculateWidth(value, stacks[seriesKey][i-1], previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] === undefined) {
				width = calculateWidth(value, 0, previousVal);
			}
		}
	});
	return isNaN(width) ? 0 : width;
}

function barChart(g){
	'use strict';

	var model = new DataModel('bar', Object.create(g.data()[0]));
	var svg = g.append('svg')
		.attr({
			'class': 'graphic bar-chart',
			height: model.height,
			width: model.width,
			xmlns: 'http://www.w3.org/2000/svg',
			version: '1.2'
		}).attr(themes.check(model.theme, 'svg').attributes);
	metadata.create(svg, model);
    themes.createDefinitions(svg, model);

	var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

	var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    model.tickSize = 0;
    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

	var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = 0;

	for(i; i < model.y.series.length; i++){
		plotSeries(plotSVG, model, creator, model.y.series[i], i);
	}
    chartSVG.selectAll('path.domain').attr('fill', 'none');
}

module.exports = barChart;

},{"../axis":9,"../dressing":20,"../themes":35,"../util/data.model.js":37,"../util/metadata.js":42}],15:[function(require,module,exports){
//var d3 = require('d3');

function blankChart() {
    'use strict';

    function buildModel(opts) {
        var m = {
            //layout stuff
            title: 'chart title',
            subtitle: 'chart subtitle (letters)',
            height: undefined,
            width: 300,
            chartHeight: 300,
            chartWidth: 300,
            blockPadding: 8,
            data: [],
            error: function (err) {
                console.log('ERROR: ', err);
            }
        };

        for (var key in opts) {
            m[key] = opts[key];
        }

        return m;
    }

    function getHeight(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().height);
    }

    function getWidth(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().width);
    }

    function translate(position) {
        return 'translate(' + position.left + ',' + position.top + ')';
    }

    function chart(g) {

        var model = buildModel(g.data()[0]);

        if (!model.height) {
            model.height = model.width;
        }

        var svg = g.append('svg')
            .attr({
                'class': 'null-chart',
                height: model.height,
                width: model.width
            });

        var title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
        title.attr('transform', translate({top: getHeight(title), left: 0}));
        var subtitle = svg.append('text').text(model.subtitle);
        subtitle.attr('transform', translate({top: getHeight(title) + getHeight(subtitle), left: 0}));

        svg.selectAll('text').attr({
            fill: '#000',
            stroke: 'none'
        });
    }

    return chart;
}

module.exports = blankChart;

},{}],16:[function(require,module,exports){
var axes = require('../axis');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');

function plotSeries(plotSVG, model, createdAxes, series, seriesNumber){

	var data = formatData(model, series);
    var plot = new axes.Plot(model, createdAxes);
    var s = plotSVG.append('g').attr('class', 'series');
    var attr = themes.check(model.theme, 'columns').attributes;
    attr.fill = model.gradients[series.index] || model.colours[series.index];

    s.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', function (d){return 'column '  + series.className + (d.value < 0 ? ' negative' : ' positive');})
        .attr('data-value', function (d){return d.value;})
        .attr('x', function (d, i){ return plot.x(d.key, seriesNumber); })
        .attr('y', function (d, i){
					if (model.stack) {
						return plot.y(d.value, i, getStackedHeight(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.y(d.value, i);
				})
        .attr('height', function (d, i){
					if (model.stack) {
						return plot.columnHeight(getStackedHeight(model.data, model.stacks, d.key, d.value, model.x.series.key));
					}
					return plot.columnHeight(d.value);
				})
        .attr('width', function (d, i){ return plot.columnWidth(d, i); })
        .attr(attr);

    if (!model.stack) {

        // add N/As for null values
        s.selectAll('text.null-label')
            .data(data._nulls)
            .enter()
            .append('text')
            .attr('class', 'null-label')
            .attr('x',  function (d, i) { return plot.x(d.key, seriesNumber); })
            .attr('y',  function (d, i) { return plot.y(d.value, i); })
            .attr('dy', '-0.5em')
            .attr('dx', function (d, i) { return plot.columnWidth(d, i) / 4; })
            .attr('font-family', "BentonSans, sans-serif")
            .attr('font-size', '10')
            .attr('fill', "rgba(0,0,0,0.4)")
            .text('n/a');
    }

    if (!model.stack) {
        // make those labels who don't fit smaller
        s.selectAll('text.null-label')
            .each(function(d, i) {
                var w = this.getBoundingClientRect();
                if ((w.width + 2) >= plot.columnWidth(d, i)) {
                    this.innerHTML = '–';
                }
            });
    }
}

function formatData(model, series) {

    var nulls = [];

    var data = model.data.map(function (d){
        return{
            key:d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        var isNull = !(d.value !== null && !isNaN(d.value));
        if (isNull) nulls.push(d);
        // if we're stacking - we transform nulls
        // into zeros to avoid problems
        if (model.stack && isNull) {
            d.value = 0;
            return true;
        }
        return !isNull;
    });

    data._nulls = nulls;

    return data;
}

function getStackedHeight(data, stacks, key, val, xKey) {
	var value = isNaN(val) ? 0 : val;
	var height;
	var seriesKey;
	function calculateHeight(val, nextVal, previousVal) {
		if (val < 0 && previousVal >= 0) {
			return val;
		} else if (val >= 0 && nextVal < 0) {
			return val;
		} else if (val < 0 && nextVal < 0) {
			return val - nextVal;
		}
		return val - nextVal;
	}
	data.map(function(d, i) {
		if (d[xKey] === key) {
			seriesKey = i;
		}
	});
	stacks[seriesKey].sort(function(a, b) {
		return b-a;
	}).map(function(data, i) {
		var isValuePositive = data < 0 ? false : true;
		var previousVal = stacks[seriesKey][i-1];
		if (data === value) {
			if (isValuePositive && stacks[seriesKey][i+1] !== undefined) {
				height = calculateHeight(value, stacks[seriesKey][i+1], previousVal);
			} else if (isValuePositive && stacks[seriesKey][i+1] === undefined) {
				height = calculateHeight(value, 0, previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] !== undefined) {
				height = calculateHeight(value, stacks[seriesKey][i-1], previousVal);
			} else if (!isValuePositive && stacks[seriesKey][i-1] === undefined) {
				height = calculateHeight(value, 0, previousVal);
			}
		}
	});
	return isNaN(height) ? 0 : height;
}

function columnChart(g){
    var model = new DataModel('column', Object.create(g.data()[0]));
    var svg = g.append('svg')
        .attr({
            'id': model.id,
            'class': 'graphic column-chart',
            height: model.height,
            width: model.width,
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.2'
        }).attr(themes.check(model.theme, 'svg').attributes);
    metadata.create(svg, model);
    themes.createDefinitions(svg, model);

    var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

    var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    var independent = (model.groupData || model.dataType === 'categorical') ? 'ordinal' : 'time';
    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({dependent:'number', independent: independent});

    model.keyHover && dressing.addSeriesKey();

    var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = 0;

    for(i; i < model.y.series.length; i++){
        plotSeries(plotSVG, model, creator, model.y.series[i], i);
    }
    chartSVG.selectAll('path.domain').attr('fill', 'none');
}

module.exports = columnChart;

},{"../axis":9,"../dressing":20,"../themes":35,"../util/data.model.js":37,"../util/metadata.js":42}],17:[function(require,module,exports){
module.exports = {
    line: require('./line.js'),
    blank: require('./blank.js'),
    pie: require('./pie.js'),
    column: require('./column.js'),
    bar: require('./bar.js')
};

},{"./bar.js":14,"./blank.js":15,"./column.js":16,"./line.js":18,"./pie.js":19}],18:[function(require,module,exports){
var d3 = require('d3');
var axes = require('../axis');
var interpolator = require('../util/line-interpolators.js');
var DataModel = require('../util/data.model.js');
var metadata = require('../util/metadata.js');
var Dressing = require('../dressing');
var themes = require('../themes');
var extend = require('util')._extend;


function drawLine(plotSVG, data, attrs){
    plotSVG.append('path').datum(data).attr(attrs);
}

function plotSeries(plotSVG, model, createdAxes, series, lineAttr, borderAttrs) {
    var plot = new axes.Plot(model, createdAxes);
    var line = d3.svg.line()
        .interpolate(interpolator.gappedLine)
        .x(function (d, i) { return plot.x(d.key, 0); })
        .y(function (d, i) { return plot.y(d.value, i);});
    var data = formatData(model, series);
    lineAttr.d = function (d) { return line(d); };
    lineAttr.class = 'line '  + series.className;
    lineAttr.stroke = model.colours[series.index];
    if (lineAttr.border){
        borderAttrs.d = lineAttr.d;
        drawLine(plotSVG, data, borderAttrs);
    }
    drawLine(plotSVG, data, lineAttr);
}

function formatData(model, series) {
    //null values in the data are interpolated over, filter these out
    //NaN values are represented by line breaks
    var data = model.data.map(function (d) {
        return {
            key: d[model.x.series.key],
            value: (Array.isArray(d.values)) ? d.values[0][series.key] : d[series.key]
        };
    }).filter(function (d) {
        return (d.value !== null);
    });
    return data;
}

function lineChart(g) {
    'use strict';

    var model = new DataModel('line',Object.create(g.data()[0]));
    var svg = g.append('svg')
        .attr({
            'class': 'graphic line-chart',
            height: model.height,
            width: model.width,
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.2'
        }).attr(themes.check(model.theme, 'svg').attributes);
    metadata.create(svg, model);

    var dressing = new Dressing(svg, model);
    dressing.addHeaderItem('title');
    dressing.addHeaderItem('subtitle');
    !model.keyHover && dressing.addSeriesKey();
    dressing.addFooter();

    var chartSVG = svg.append('g').attr('class', 'chart');
    chartSVG.attr('transform', model.translate(model.chartPosition));

    // Add the axis to the SVG
    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({
        dependent:'number',
        independent: 'time'
    });

    model.keyHover && dressing.addSeriesKey();

    // Set up the SVG to plot the line
    var axisLayer = themes.check(model.theme, 'axis-layer').attributes.position || 'back';
    var plotSVG = axisLayer === 'front' ? chartSVG.insert('g', ':first-child').attr('class', 'plot') : chartSVG.append('g').attr('class', 'plot');

    var i = model.y.series.length;
    var lineAttr = extend(
        themes.check(model.theme, 'lines').attributes,
        {'stroke-width': model.lineStrokeWidth});
    var borderAttrs = extend({}, lineAttr);
    borderAttrs.class = 'line line__border';
    borderAttrs['stroke-width'] =  lineAttr['stroke-width'] * 2;
    borderAttrs.stroke = lineAttr.border;

    // Plot the line
    while (i--) {
        plotSeries(plotSVG, model, creator, model.y.series[i], lineAttr, borderAttrs);
    }

    // Add transparency
    chartSVG.selectAll('path.domain').attr('fill', 'none');



}

module.exports = lineChart;

},{"../axis":9,"../dressing":20,"../themes":35,"../util/data.model.js":37,"../util/line-interpolators.js":40,"../util/metadata.js":42,"d3":"d3","util":3}],19:[function(require,module,exports){
//var d3 = require('d3');

function pieChart() {
    'use strict';

    function buildModel(opts) {
        var m = {
            //layout stuff
            title: 'chart title',
            height: undefined,
            width: 300,
            chartHeight: 300,
            chartWidth: 300,
            indexProperty: '&',
            valueProperty: 'value',
            blockPadding: 8,
            data: [],
            error: function (err) {
                console.log('ERROR: ', err);
            }
        };

        for (var key in opts) {
            m[key] = opts[key];
        }

        return m;
    }

    function getHeight(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().height);
    }

    function getWidth(selection) {
        return Math.ceil(selection.node().getBoundingClientRect().width);
    }

    function translate(position) {
        return 'translate(' + position.left + ',' + position.top + ')';
    }

    function chart(g) {
        var model = buildModel(g.data()[0]);
        if (!model.height) {
            model.height = model.width;
        }
        var svg = g.append('svg')
            .attr({
                'class': 'null-chart',
                'height': model.height,
                'width': model.width
            });

        var title = svg.append('text').text(model.title + " - PLACE HOLDER CHART");
        title.attr('transform', translate({top: getHeight(title), left: 0}));

        var subtitle = svg.append('text').text(model.subtitle);
        subtitle.attr('transform', translate({top: getHeight(title) + getHeight(subtitle), left: 0}));

        var chartSvg = svg.append('g').attr('class', 'chart');

        if (model.data.length > 3) {
            model.error('PIE warning: too many segments!');
        }

        var outerRadius = model.width / 2;

        chartSvg.selectAll('.slice')
            .data(model.data)
            .enter();
        //.append(path);

        svg.selectAll('text').attr({
            fill: '#000',
            stroke: 'none'
        });
    }

    return chart;
}

module.exports = pieChart;

},{}],20:[function(require,module,exports){
var textArea = require('./text-area.js');
var seriesKey = require('./series-key.js');
var ftLogo = require('./logo.js');
var themes = require('../themes');
var PADDING = 8;

function getHeight(selection) {
    return Math.ceil(selection.node().getBoundingClientRect().height);
}

function Dressing(svg, model) {
    this.svg = svg;
    this.model = model;
    this.halfLineStrokeWidth = Math.ceil(model.lineStrokeWidth / 2);
    this.headerHeight = 0;
    this.footerHeight = 0;
    this.footerItemCount = 0;
    this.attrs = {};
    if (this.getAttr('chart-logo').display === 'none') this.model.logoSize = 0;
    this.entries = model.y.series.map(function (d) {
        return {key: d.label, value: d.className};
    });
}

Dressing.prototype.getAttr = function(id){
    if (!this.attrs[id]){
        this.attrs[id] = themes.check(this.model.theme, id).attributes;
    }
    return this.attrs[id];
};

Dressing.prototype.addBackground = function (g, viewBox){
    return g.insert('rect', ':first-child')
        .attr({
            'id': 'backgroundFill',
            'x': viewBox[0] * 2,
            'y': viewBox[1],
            'width': viewBox[2] + (viewBox[0] * -2),
            'height': viewBox[3],
            'fill': g.attr('background')
        });
};

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
    this.positionFooterItem(footerText);
    this.positionFooterItem(sourceText);
    this.addBackground(this.svg, [0,0, this.model.width, this.model.height]);
};

Dressing.prototype.addLogo = function () {
    var model = this.model;
    if (!model.logoSize) return;
    var logo = this.svg.append('g').attr('class', 'chart-logo').call(ftLogo, model.logoSize);
    logo.attr('transform', model.translate({
        left: model.width - model.logoSize - 3,
        top: model.height - getHeight(logo) - 3
    }));
};

Dressing.prototype.addItem = function(item, widthRestrict, prefix){
    var text = textArea()
        .width(this.model.width - widthRestrict - this.model.paddingX * 2)
        .attrs(this.getAttr('chart-' + item));

    return this.svg.append('g')
        .attr('class', 'chart-' + item)
        .datum((prefix || '') + this.model[item])
        .call(text);
};

Dressing.prototype.addHeaderItem = function(item){
    if (!this.model[item]) return;
    var gText = this.addItem(item, 0);
    var fontSize = Math.round(this.getAttr('chart-' + item)['font-size']);

    var currentPosition = {
        top: this.headerHeight + fontSize + this.model.paddingY,
        left: this.model.paddingX
    };
    if (this.getAttr('chart-' + item).position!=='absolute' &&
        this.getAttr('chart-' + item).float!=='right'
    ){
        this.headerHeight += getHeight(gText) + this.halfLineStrokeWidth;
    }
    gText.attr('transform', this.model.translate(currentPosition));
    this.setChartPosition();
};

Dressing.prototype.addFooterItem = function(item, prefix){
    if (!this.model[item]) return;
    var gText = this.addItem(item, this.model.logoSize, prefix);
    if (this.getAttr('chart-' + item).position!=='absolute' &&
        this.getAttr('chart-' + item).float!=='right'
    ){
        this.footerHeight += getHeight(gText) + PADDING;
    }
    gText.currentPosition = this.footerHeight;
    return gText;
};

Dressing.prototype.positionSeriesKey = function (g) {
    var model = this.model;
    var labelWidth = model.yLabelWidth + PADDING;
    var labelHeight = model.xLabelHeight + PADDING;
    var hasTopAxis = [model.dependentAxisOrient,model.independentAxisOrient].indexOf('top')>-1;
    var hasLeftAxis = [model.dependentAxisOrient,model.independentAxisOrient].indexOf('left')>-1;
    var left = this.halfLineStrokeWidth;
    var top = this.headerHeight ;
    if (model.keyHover){
        left = (hasLeftAxis && left < labelWidth) ? labelWidth : left;
        top = (hasTopAxis && top < labelHeight) ? labelHeight : top;
    } else {
        this.headerHeight += getHeight(g) + (PADDING);
    }
    model.keyPosition = model.keyPosition || { top: top + model.paddingY, left: left+ model.paddingX };
    g.attr('transform', model.translate(model.keyPosition));
};


Dressing.prototype.addSeriesKey = function () {
    if (!this.model.key) {        return;    }
    var model = this.model;

    var chartKey = seriesKey(model)
        .style(function (d) {  return d.value; })
        .label(function (d) {  return d.key;  })
        .width(model.keyWidth || model.contentWidth)
        .colours(model.gradients || model.colours)
        .attrs(this.getAttr('key'));

    var gText = this.svg.append('g')
        .attr('class', 'chart__key')
        .datum(this.entries)
        .call(chartKey);

    this.positionSeriesKey(gText);
    this.setChartPosition();
};

Dressing.prototype.positionFooterItem = function(gText) {
    if (!gText) return;
    var model = this.model;
    this.footerItemCount++;
    // when tspans have been wrapped, we have to move the
    // group up by the height of every nth-child(1+n);
    var spans = gText.selectAll('tspan').size();
    var gHeight = (gText.node().getBBox().height / (spans)) * (spans - 1);
    var yTrans = model.chartPosition.top + model.chartHeight + gText.currentPosition - gHeight;
    if (this.footerItemCount==1 && gText.select('text').attr('float')){
        this.footerHeight += getHeight(gText) + PADDING;
        this.setHeight();
    }

    gText.attr('transform', model.translate({
        top: yTrans,
        left: +model.paddingX
    }));
};

Dressing.prototype.setHeight = function () {
    var model = this.model;
    var footerHeight = Math.max(this.footerHeight + PADDING * 2, model.logoSize);
    if (model.height) {
        model.chartHeight = model.height - this.headerHeight - footerHeight - model.paddingY*2;
        if (model.chartHeight < 0) {
            model.error({ message: 'calculated plot height is less than zero' });
        }
    } else {
        model.height = this.headerHeight + model.chartHeight + footerHeight;
    }
    this.svg.attr('height', Math.ceil(model.height));
};

Dressing.prototype.setChartPosition = function () {
    this.model.chartPosition = {
        top: this.halfLineStrokeWidth + this.model.paddingY + this.headerHeight + PADDING,
        left: this.halfLineStrokeWidth + this.model.paddingX + this.model.chartPadding
    };
};

module.exports = Dressing;

},{"../themes":35,"./logo.js":21,"./series-key.js":22,"./text-area.js":23}],21:[function(require,module,exports){
//the ft logo there's probably an easier ay to do this...
//var d3 = require('d3');

function ftLogo(g, dim) {
    'use strict';

    if (!dim) {
        dim = 32;
    }
    var d = 'M21.777,53.336c0,6.381,1.707,7.1,8.996,7.37v2.335H1.801v-2.335c6.027-0.27,7.736-0.989,7.736-7.37v-41.67 c0-6.387-1.708-7.104-7.556-7.371V1.959h51.103l0.363,13.472h-2.519c-2.16-6.827-4.502-8.979-16.467-8.979h-9.27 c-2.785,0-3.415,0.624-3.415,3.142v19.314h4.565c9.54,0,11.61-1.712,12.779-8.089h2.338v21.559h-2.338 c-1.259-7.186-4.859-8.981-12.779-8.981h-4.565V53.336z M110.955,1.959H57.328l-1.244,13.477h3.073c1.964-6.601,4.853-8.984,11.308-8.984h7.558v46.884 c0,6.381-1.71,7.1-8.637,7.37v2.335H98.9v-2.335c-6.931-0.27-8.64-0.989-8.64-7.37V6.453h7.555c6.458,0,9.351,2.383,11.309,8.984 h3.075L110.955,1.959z';
    var path = g.append('path').attr('d', d); //measure and rescale to the bounds
    var rect = path.node().getBoundingClientRect();
    if (!rect.width) return; //todo: look into why this is being added before a svg exists?
    //the logo is square so
    var scale = Math.min(dim / rect.width, dim / rect.height);

    path.attr({
        'transform': 'scale(' + scale + ')',
        'fill': 'rgba(0,0,0,0.1)'
    });
}

module.exports = ftLogo;

/*
 <path fill="none" d="M21.777,53.336c0,6.381,1.707,7.1,8.996,7.37v2.335H1.801v-2.335c6.027-0.27,7.736-0.989,7.736-7.37v-41.67
 c0-6.387-1.708-7.104-7.556-7.371V1.959h51.103l0.363,13.472h-2.519c-2.16-6.827-4.502-8.979-16.467-8.979h-9.27
 c-2.785,0-3.415,0.624-3.415,3.142v19.314h4.565c9.54,0,11.61-1.712,12.779-8.089h2.338v21.559h-2.338
 c-1.259-7.186-4.859-8.981-12.779-8.981h-4.565V53.336z"/>
 <path fill="none" d="M110.955,1.959H57.328l-1.244,13.477h3.073c1.964-6.601,4.853-8.984,11.308-8.984h7.558v46.884
 c0,6.381-1.71,7.1-8.637,7.37v2.335H98.9v-2.335c-6.931-0.27-8.64-0.989-8.64-7.37V6.453h7.555c6.458,0,9.351,2.383,11.309,8.984
 h3.075L110.955,1.959z"/>
 */

},{}],22:[function(require,module,exports){
var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var themes = require('../themes');

function seriesKey(options) {
    'use strict';

    options = options || {};

    var theme = options.theme;
    var columns = options.keyColumns || 1;
    var width = options.keyWidth || options.width || 300;
    var strokeLength = 15;
    var lineHeight = 16;
    var lineAttr = themes.check(theme, 'lines').attributes;
    var colAttr = themes.check(theme, 'columns').attributes;
    var strokeWidth = lineThickness(options.lineThickness);
    var colours = [
        '#af516c', '#ecafaf', '#d7706c', '#76acb8', '#7fd8f5', '#3d7ab3', '#b8b1a9'
    ];
    var padding = 0;
    var paddingY = 0;
    var paddingX = 0;
    var xOffset = 0;
    var yOffset = 0;
    var background = false;
    var attr = {};

    var charts = {
        'line' : addLineKeys,
        'column' : addColumnKeys,
        'bar' : addColumnKeys
    };

    var style = function (d) {
        return d.style;
    };

    var label = function (d) {
        return d.label;
    };

    var filter = function () {
        return true;
    };

    function addBackgroundColor (keyItems){
        if (!background) return;
        var parent = keyItems.node().parentNode;
        var box = parent.getBoundingClientRect();
        return d3.select(parent).insert('rect', ':first-child')
            .attr({
                'class': 'background',
                'fill': background,
                'x': 0,
                'y': 5,
                'width': box.width + (paddingX * 2),
                'height': box.height + (paddingY * 2),
                'transform': 'translate(' + xOffset +','+ yOffset +')'
            });
    }

    function addLineKeys(keyItems, isBorder){
        if (lineAttr.border && !isBorder){
            addLineKeys(keyItems, true).attr(lineAttr)
                .attr({
                    'stroke': lineAttr.border,
                    'stroke-width': strokeWidth * 2,
                    'class': 'key__border'
                });
        }
        return keyItems.append('line').attr(lineAttr).attr({
            'class': style,
            x1: 1,
            y1: -5,
            x2: strokeLength,
            y2: -5,
            'stroke-width':strokeWidth,
            'stroke':function (d, i) {
                return colours[i];
            }
        }).classed('key__line', true);
    }

    function addColumnKeys(keyItems){
        keyItems.append('rect').attr(colAttr).attr({
            'class': style,
            x: 1,
            y: -10,
            width: strokeLength,
            height: 10,
            'fill':function (d, i) {
                return colours[i];
            }
        }).classed('key__column', true);
    }

    function addKey(keyItems){
        charts[options.chartType](keyItems);
        attr.x = strokeLength + 10;
        keyItems.append('text').attr(attr).text(label);
    }

    function positionKey(keyItems){
        var innerWidth = width - (paddingX * 2);
        var columnWidth = 10;
        keyItems.each(function(d, i){
            if (i == keyItems[0].length-1) return;
            columnWidth = Math.max(this.getBoundingClientRect().width, columnWidth) + 10;
        });
        while (columnWidth * columns > innerWidth && columns>1) columns --;

        keyItems.attr({
            'class':'key__item',
            'transform': function (d, i) {
                var column = (i % columns);
                var row = Math.ceil((i + 1) / columns);
                var x = column * (columnWidth + 8) + paddingX;
                var y = (row * lineHeight) + paddingY;
                return 'translate(' + x + ',' + y  + ')';
            }
        });
    }

    function key(g) {
        var gKey = g.append('g').attr('class', 'key');
        var keyItems = gKey.selectAll('g')
            .data(g.datum().filter(filter))
            .enter()
            .append('g');

        addKey(keyItems);
        positionKey(keyItems);
        addBackgroundColor(keyItems);
    }

    key.colours = function (col) {
        if (!arguments.length) return colours;
        if (col) colours = col;
        return key;
    };

    key.theme = function (themeUpdate) {
        if (!arguments.length) return theme;
        if (themeUpdate) theme = themeUpdate;
        return key;
    };

    key.label = function (f) {
        if (!arguments.length) return label;
        label = f;
        return key;
    };

    key.style = function (f) {
        if (!arguments.length) return style;
        style = f;
        return key;
    };

    key.width = function (x) {
        if (!arguments.length) return width;
        width = x;
        return key;
    };

    key.lineHeight = key['line-height'] = function (x) {
        if (!arguments.length) return lineHeight;
        lineHeight = x;
        return key;
    };

    key.columns = function (x) {
        if (!arguments.length) return columns;
        columns = x;
        return key;
    };

    key.background = function (color) {
        if (!arguments.length) return background;
        background = color;
        return key;
    };

    key['padding-x'] = function (pad) {
        if (!arguments.length) return paddingX;
        paddingX = pad;
        return key;
    };

    key['padding-y'] = function (pad) {
        if (!arguments.length) return paddingY;
        paddingY = pad;
        return key;
    };

    key.padding = function (pad) {
        if (!arguments.length) return padding;
        paddingX = pad;
        paddingY = pad;
        return key;
    };

    key.attrs = function (obj) {
        if (!arguments.length) return attr;
        if (typeof obj !== "undefined") attr = obj;
        for (var prop in attr){
            if (key[prop]) key[prop](obj[prop]);
        }
        return key;
    };


    return key;
}

module.exports = seriesKey;

},{"../themes":35,"../util/line-thickness.js":41,"d3":"d3"}],23:[function(require,module,exports){
/*jshint -W084 */
//text area provides a wrapping text block of a given type
var d3 = require('d3');

function textArea() {

    var xOffset = 0,
        yOffset = 0,
        paddingX = 0,
        paddingY = 0,
        align = 'left',
        float = 'left',
        attr = {},
        width = 1000,
        lineHeight = 20,
        units = 'px', //pixels by default
        bounds,
        fill = false,
        background = false;

    function createBackgroundColor (g, viewBox, translate){
        return g.insert('rect', ':first-child')
            .attr({
                'class': 'background',
                'fill': background,
                'x': viewBox[0] * 2,
                'y': viewBox[1] * 0.85,// (i.e. -0.25em)
                'width': viewBox[2],
                'height': viewBox[3],
                'transform': 'translate(' +translate[0]+','+ translate[1]+')'
            });
    }

    function wrap(text, width) {
        var innerWidth = width - (paddingX * 2);
        var lines = 1;
        text.each(function () {
            var text = d3.select(this),
                words = text.text().trim().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                y = text.attr('y'),
                dy = parseFloat(text.attr('dy'));

            if (isNaN(dy)) {
                dy = 0;
            }

            var tspan = text.text(null).append('tspan')
                .attr('x', paddingX)
                .attr('y', y + paddingY )
                .attr('dy', dy + units);
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > innerWidth) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    lineNumber++;
                    var newY = (lineNumber * lineHeight) + paddingY;
                    tspan = text.append('tspan')
                        .attr('x', paddingX)
                        .attr('y', + newY + units)
                        .text(word);
                }
            }
            lines = lineNumber+1;
        });
        if (align === 'right' || float === 'right'){
            text.selectAll('tspan').each(function(d,i){
                var xPosRounded = Math.round(innerWidth - this.getComputedTextLength());
                d3.select(this).attr('x', xPosRounded);
            });
        }
        if (background){
            var d3El = d3.select(text.node().parentNode);
            var fillHeight = text.node().getBoundingClientRect().height + (paddingY * 2);
            fillHeight = Math.max(fillHeight, (lineHeight * lines)  + (paddingY * 2));
            var viewBox = [0, 0 - lineHeight, width, fillHeight];
            var translate = [xOffset, yOffset];
            createBackgroundColor(d3El, viewBox, translate);
        }
    }

    function area(g, accessor) {
        if (!accessor) {
            accessor = function (d) { return d; };
        }
        g.append('text').text(accessor).attr(attr).call(wrap, width);
    }

    area.bounds = function () {
        return bounds;
    };

    area.units = function (x) { //px, em, rem
        if (!arguments.length) return units;
        units = x;
        return area;
    };

    area['line-height'] = function (h) { //pixels by default
        if (!arguments.length) return lineHeight;
        if (typeof h !== "undefined") lineHeight = h;
        return area;
    };

    area.width = function (x) {
        if (!arguments.length) return width;
        width = x;
        return area;
    };

    area.yOffset = function (y) {
        if (!arguments.length) return yOffset;
        yOffset = y;
        return area;
    };

    area.xOffset = function (x) {
        if (!arguments.length) return xOffset;
        xOffset = x;
        return area;
    };

    area.fill = function (bool) {
        if (!arguments.length) return fill;
        fill = bool;
        return area;
    };

    area.background = function (color) {
        if (!arguments.length) return background;
        background = color;
        return area;
    };

    area.align = function (a) {
        if (!arguments.length) return align;
        if (typeof a !== "undefined") align = a;
        return area;
    };

    area.float = function (a) {
        if (!arguments.length) return float;
        if (typeof a !== "undefined") float = a;
        return area;
    };

    area.padding = function (pad) {
        if (!arguments.length) return [paddingX, paddingY];
        if (typeof pad !== "undefined"){
            paddingX = pad;
            paddingY = pad;
        }
        return area;
    };

    area['padding-x'] = function (pad) {
        if (!arguments.length) return paddingX;
        if (typeof pad !== "undefined") paddingX = pad;
        return area;
    };

    area['padding-y'] = function (pad) {
        if (!arguments.length) return paddingY;
        if (typeof pad !== "undefined") paddingY = pad;
        return area;
    };

    area.attrs = function (obj) {
        if (!arguments.length) return attr;
        if (typeof obj !== "undefined") attr = obj;
        for (var prop in attr){
            if (area[prop]) area[prop](obj[prop]);
        }
        return area;
    };

    return area;
}

module.exports = textArea;

},{"d3":"d3"}],24:[function(require,module,exports){
/* globals __dirname, Promise */

var dataURI = {
    BentonSans: "data:application/font-woff;charset=utf-8;base64,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\n".trim(),
    MetricWeb: "data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAMRyABMAAAABgnAAAQAAAACzrAAAEMYAACoiAAAAAAAAAABHUE9TAACTlAAAHYEAAFDED3sMWkdTVUIAALEYAAACkQAABH7LHMBFTFRTSAAABmQAAAC9AAABwqrJ4OpPUy8yAAACIAAAAEoAAABgWR9x9lZETVgAAAckAAADKQAABeBuS3XVY21hcAAAGmQAAAPaAAAFXEHya+1jdnQgAAAgAAAAAFIAAABSBe0KlGZwZ20AAB5AAAAA9wAAAWGSQdr6Z2FzcAAAk4AAAAAUAAAAFAB9ACxnbHlmAAAj1AAAXsMAAMtoyu8W42hkbXgAAApQAAAQEwAAHcgTCa7QaGVhZAAAAagAAAA2AAAANgADJlxoaGVhAAAB4AAAAB8AAAAkBpUEK2htdHgAAAJsAAAD9QAABvgzBlNbbG9jYQAAIFQAAAN+AAADfita9dhtYXhwAAACAAAAACAAAAAgA9YC7W5hbWUAAIKYAAAKFgAAG5mw8yTPcG9zdAAAjLAAAAbQAAALqSLxHgdwcmVwAAAfOAAAAMgAAAFVAAAqbQABAAAAAQAA5fs3n18PPPUAHwPoAAAAAM0OaSQAAAAA0K15nf+I/zcDjAN+AAAACQACAAAAAAAAeNpjYGRgYK77bw4k1/7v+N/B3MMAFEEGjPsAldwGxgAAAQAAAb4AUgAHAEMABAABAAAAAAAKAAACAAJWAAIAAXjaY2BmvM44gYGVgYGpiymCgYHBG0IzxjEYMXIxoAJ2ZI63j6cvgwMDw28mpo//ORkYmOsYTiowMEwGyTHuYUoDUgoMzAAMQwvWAAB42m2UX2jVdRjGn+/3LFmalJ7ZOrKt/aF2ZhoWa7qLLY/HisFchVFXlTfeBQtqBEkEQWV00U27KiQLUhpBId5l2KDCicQS7EISThDLoAttDAPl9Hne85uM6MDD+zu/3/fP8z7v+7z5oFq/XwusqCc1NJje01DeoU3pR23OFU2kFdXTZQ3kTXw/oXvzF3z/SEPsuTt/reG0QVtTWR25i7UX9UTeoB6d0850u6p5jzrTAvEt9eVJDepDVVONc2q8n+Qs9mhOG/lfJfam/botb2XNhCrpG3WkU+pON4jfqj/9pj7ebU5LrWevj73HNZ4H9SSxlo5qS2mdevMz2sI5E5x/X36eWILb78Sn+f8+dzb4/6668xDxOu8vgGkww3dyzq8Sq3xDj7xLPflFPZqnOLOpsrUJWI9R1sCZ2JkOodk0XJc1l87AcUV706wGiANpHvTx7W/iFdW1qN36qflXOh3P9Xweja+0dA69vadGpBZpnLOXNBb1mCH/7wDPrkU6oA5dgsMB1nyKzs7bcN6lNTnBPzj9H2YLfmsAp5oWm1fBDXDzFrf/wrzWYgxNntKOOPMC/M7C67nI+U50qaePVcnz8BmFv3Va1tuuXekFOL+pbblXU2kOrnNo0kkPDOiONKKN1Kc//UFfHFUX3Ham2ebFqPkh1oC8rai5Qb6lcbCeey+pWpqKnquAsk6oAsrRq9aTOurn5hF6oFO/8A2ka9TJeEz9+gocU9l7S1/Swz7fuq7GUvTSPjXQqoFWjea10HsV7psCrjP5HgavgQ/AEbAAPgMnwRtg3mvyS3ihtfZza1SseaX4f9g9nM9qOJ/Ei8f0IP0zEh61b0/HPedcg9yux8FDYNy1Di6n2HOVPe599y/1cS+6Z1KbJqNHl/W9+yD6Zlmvxze42hOuX3im0IH377BP3NEbWl8vfGa0a1/4fSXO/IH/Y+Zi2APE6fDmbHGX5wI1s6fs48Ife6Pf3V/uQ8fRVr1iXsGXGuzx2bf8djnuWwhfsIdv3eGFdj3rXiLWoj7tGo5ZZc72OWu4767wGTPJ76jpn6GbtW3T/pgB6GDfRR/cT68wS+xT9u5irtXDV/ZvvGv+Ezk7T9fdutLrUS80ihzsZefmedOuh90PMV+sC5xiJhecS73kVNNI1MSzgfzNwx6K+Qzn8Ao5ceb68Idn2VJo/0DkYt1nWnMkcmBGpk+0O/zUplH3H/Nuws+hHznbC7HPuViD46xxTp4Z8I7+PhNrtkf+zKaYX/asZ91qP7l+fu+5WdMjrH85Zk6jeZPng0XftOYX9Qne5E2Ntxf18R33BC804rkc3l1UKc62Hubb0LrQrSu8GLPT3P8FHn5jlgAAAHjadZDRCoMwDEW9IKx7GH3xLQ4yJ1Zoodj/Z9+2Js1ExxbEtCH35jRdh9cCjRljO6AVHsg3B3gPBB+kcgXu9QthxQoQMADJNDxiA2K1meVarAyXNcnfY6p9VicSUcQ58t/7c9skqaCUhUiNBE7Ia/S9jiDhUiDmGL/9zYtM8zFU0HaWKc0hJfhdEv2RyJ3wuK5KUm2JszhU/SQwk7Wlw0NY1uBIJ+eiK2PQcCm/nm983kxsexk7AzPe+HcRMwAAAHjaHc5VlBAEFEXR45coKV3SSDcSSiPS3d1IS0lLSzeIdKdIdyMCUtPAwDABE3TnSD2u75619vflM9T/IxmJSYwkfG4f+YKk8kuS2weSusnc5KSQKUgpU7qpSCW/clOT2t6ThjQyrZuOtDI96WQG0suMZLB3ZHIzk1FmIZPM6n5NFntLNjc7WWUOssmcbi6yWyK53TzkkHnJKb9x85HL3pCf3LIAeWVB8slCbmHyyyIUkEXdYhSUxd0SFLLXlKSILOWWpqj8luKyjFuWEvaKcvIl5Skpv6OUveB7SssKlJEV3UqUlZUpJ6tQXlalgqxGRVnd/YFK9pwaVJY/UkXWpKo9o5Zbm2qyjluX6rIeNWR9twE17SkNqWVPaOQ2prZs4jaljmxGXdncbUE9e0xL6stWNJKtaWyPaOO2pYls57anqexAM9nR7UQL2ZmWsovbldb2kG7yAd1pI3vQ1u7zk9uTdrIX7WVvOsg+dJR93X50kf3pavf4mW5yAN3lQHrIQfSUg+klh7i/0FsOlXcZRh85nL52hxHuSPrJUQyw24x2f2WgHOOOZZAcx2A53p3AEDlRJjCJofI3hlk8kxkupzBCTmWknOZOZ5Sc4c5ktJzFGItjNmPlHMbJue48xlss85koF7gLmSR/l7dYxGT5B1PkYqbZTZYwXS5lhlzmLmemXMEsuZLZchVz5GrmyjXMk2vddcy3GNazwKLZ4G5kodzEIotis7uFJfJPdytL5V8sk9vc7Sy3SHa4O1khd7FS7maV3MNquZc1doN9rJX7WScPuAdZLw+xwSI47B5hkzzqHmOzXec4W+QJ9yRb5d9sk6fcf9hu1zjNLgvnDLvlWfbIf91z7JXn3QvskxfZLy9xQAZwSAbKqwRxWAZzRIa4oRyVYRyzy1x2r3BcXuWEDOekvMYpqS8WRgSn5Q03kjMyirMy2o3hnLzJeXnLjeWCjOOihRLPJQshgQB5271DoLxLkLxHsLxPiAXzwH1IqHxEmHzsPiHcgnjqPuO6fE6EfCEDeUmkfOW+Jkq+IVomuv8RI98SawG8c98TJz+4H4mXRoIFfAKB8cjVAAAAeNplV2lz5LaS1KpJ4r4Bgkcfkmfe2GFH7IvY//9hf9pmons09lvYzaZGqEJVZlYV9Pb2lt7e/ut/jRZv7++XeVrmBf/PUrzLywVv73iI5X2aJjzep2Wa8Vuu93e+KLEsAjsEfrVIIfgDPnJZlst0megOn8vY/i5hu8DTPAs4gDfYwVyI4XCenm6x82tduHliPHC44DB4uFzgh5FMNFVqVtP0/s5QF5rifdKMY6ErMdb78rXEz28phZxHeEgYPyHe9+UyM1ssyZ2XReGIsQPeELqY5knNI74Lnu/LyO+ZsOAO8S6AEywlnxNTxGOcMHJG/vSyCEUkhWIAA3MEDDDm6QLbWb4TS+RKiIHAO2xJAA4Uw9e7YL4jXflOGBZrxNuFhAkeAbzkhfxhDzyCzH/y9zIWP/kDGhfkrYTkuUSVaU/jTP4HR8j3ouh6YrySdF1e/Ekx/42xyzj2taZp5Ec9YaPmTuCsqAgxTThIarXoJ3/istCU/JnBH11J0CTE5f/zJ5WUYGekQv6UINCX5cmfePGnf/E3foX8Fc5mZMxpGE/cqsAg0BUXOYkLvhSfI8WJOylAMXYPKhep4QkJjcOmgaF88YdgFfhTEtspp4k0CvJIHJ/iujwzYroKeyA+Z+WLv2UUkVIXdYFjcSF/kvwJ8iemnxC8UwwzIAX+2AFAhaKmBaWtAdqz0Kgrpgjf5E9QwkPeC5MjuoD4Cen8jOk/+WOi0AmWGSxOL/5mVo00ejHkj6GKn/xZxiFe/GFdxNeSP78V1kv2iF9p+CUsVOtTgBIODct0GgbkQwJ1vYz4Bn/MjdUksZ/bIWPyh1fNJ/lb6JYnjJxHswFT4A920iyjYREySh+qRsBQDdqGZmUwHIB4gS34g6BG+AtrizwxXX0hDCJ4Bf4mRk8SFq0vkDXeoHb4YssARRee/YLgQq+LpYwRvsZP0ig1flDKSgaDYhlxEQHo4GJIFjvUqE/qWNFcqSeky9Pt5W9owwMe8GGwUTqNE+U0G5YG/NPUWuFYtQxV0pSdzTMOSVdqrBeNXOr1rY3W5gUb4zcDvIlU8NeGOyfpcIScnxqAzBRUY8WIb2alMDeyobBfYQdVP+MjoaALK2jIbDQBjZyXp1hRq8oSSeXYskAoPSjgBpaUmoSFhWVlkK+ZOhmTA7IY4QvWFnliuhZIIMYY9BsKBs5H/MKYCbImCF/8KfKnBn8vY+ButVIauaIfKJyplUYkWlmmzW7/5G8e2y+GOIzhyvpEZxAwkFrr/+DvF9pP/hgPifYQJWbGjPLiaFoUTNE4PPlD3OQPJpfLHLREUOzfeqy/edRf/GFJ9eJPGwu/FzXxnWAa7pyk/yd/GqiTP0aGn6dhPHOrxQfoQvUYx1pNls9/8EdlD0doylI7ICm1H2ADOVhrgIFqg60c/BkqcvCHAyFc8jc95aenZ0ZM106EQab45A8OWUTCmsmCMgnSNHoULiDstETtJdAXf478gQMzQT7WGGUGIQ6iH6Nl6IopwjdECecz+QA8YgwAmBvzwnSkR9D/xh+b8cJ4sFEF88Ufjhv8Ge9e/Ek1KZqiA8+ROlJ0BZIQzqS+lvn5ba2xL9kjZOsQLxzgX3gSBQgklccRqCgu+MC8wqSRI74Zz4m5sZoM9htUBWAwsyYHjvxBomwTPB0ZaybIZmOEMn7wFwaty5A8NpA/o1H1aBuOnY3hcOTQdgEbE9OCL9QWeWK6DkgA9pIt+MOYMYxYS+cmtCW8oVuBF7Z8tEgOdGqFxiAfuAfAA2yNnYTR3trnDyYAttHt6WsgQP48QNFjuLI+Fw4Amlv7hHSMJIL+C23eMwAS4iENEU1Fwq9na0PRghwbg4qcmjh20jTlpM2G7ZGu7FivMuSyP7+9c56gUW7KOo9ZNKF48M5fO0hDzzpqJjIM4ENa6DfIEd/CTsfcNGRktcdnQhVPFuPYGnQAMEGJIoVpnEBlM394EdoGIKlMxMjR7G+wxgbocoatChetAyuDfEHBE6wxDSELpgVfEzJSeqQbJnizulX3hoYH54zYKO9nvyx4mxaLHsWWjxKbqB3FM4cxcI/OGGBr/YyKD84Zh0icjVA3LwmSBWlwReT2KQAUzhzWJ9WJAUBz534Rpn41PT0aK05Cd1MBtW2zQ/UA58DSQDFbmKJxZN6VEAO0P2M37gsVcRjDAezGYhm+lnt9+xB8IGhQr1EuRAsvKB68UxaBO2eTWaZiGEzchsYf1YhP4ChIGwghPAfBOuywUL2ws7Nz5HO0CbqlKZXN/PEqjUtAUrsMsZiBOQLWwEHSVkdYRA+YJ4Qn2Fgcp6FRM0oD9LgZGcHVjEjiDG/ObD2AP1xHyAB8xTinReCHefEmeLYMN42BDqDgBZqeKNICGQdrfZxR8SkEF5z1wWeAxssCShd8GmHRjM2caIfifdan5ADwzoYQnpCOkUTQ7fiRhTPmlIS+EmrbNYhSOyGSRWmAdOd9qMVUdl2GikNggkrv3noeOc9hrNl+rfD6jinFBNgs69+ElBHv7Ba+Q38uISe72Gq9t3IYwIcOaIMFtDKymf9ELCSdJnxmZD4HtPPgluxmTzo4KeZxgvHjKOt0UDYUIGl9Y8sC5vSADdDlEvxiM9pGjnBNvtBbZ8SkOBJnpoXNMzNyI90M4EOw5x7fFhIGRx7NJOelCBGcn0W0KbJlBLRshbPhAwmiu5KFFkOI3sW8gOWaUkigMMYGdXOUID6PwNGOcVVdCloWehaZRkaKDSQGDyCfkA7GeMl2XwvlhkGAeEoAVz1RKlKivHAcekyMaW2uY6jOiHvxNFWYN3v00Xu6SvAe4+K/Vnp951JygfQQHiiKpQZMsiAc3qG/UDw8CN99jF4NA/gwUTnVQCvViaMgbWCF8JKv+Mw+pCWpsMQgGp9MET2Kp9vk0KqYvzfJ+LQCSRc7WpYHoQ6HJRsjWm6KwrXZ+5YB8wKs0R8WG9l5ICim5R1OWXDwSLcBiZT87czkDyE6QBpsLQtkjVQWmVxJ4A+VqjgQUG+OxiAfuK+AJ4ODIkwMLeeYAV1OK4hhl0V8ABZXDJ61NHAQwJ93qE+LuWKBbsg5P8kiLI6g/0JbcU5pxoPajnvBiVGqxtKI6B0p5a37nfwh7iXQFO/qpI4Cr7N5rCV8rfz6Lq3W5iPDQ9fIdY2YZFF6vIcYYg3wIMMObIIaBvBhM67Aq1vIAlkRFHtAeDk0fJYAGWcVRY5yjUuKHByQIE93BQRb5g8vJuSuovJpH2LRkR6ySxnzPSfpV7SNtQLmBVhjqC4ue6NVcIJpobsJZARXTHcF8DmHj3t5w7xi9IA0+bWJVSnAICSCK2j2Js0oZGjH88wY5tln7/aSUomxNOFy7LWmikhK2XNO6Oy4XgAiKDhGIbzoAAYC0DFUuMBccaWkWGt5kkVYPEGPAzDUDa4PaA6oUtczdHKtqJ6kdI8OxxmDg+q5hxOTaE4hCxwCk2XW9xILjxSiwnspIn6t+vpufV17yAgPJerLumVMsiRRbiWmmDtyijKdERFimGAPKsMVHcwO2hgZngJFFaKJqaaOj4i5iopxXLLc+XRaGK9ZU9HXUIgamrarLtVDw225eqQVTY6pJGwozshaZNzRNvYVMAuQjqIViAmXjOQF9iE6nAKfCAl57QLeavp8VPIXwV/Gr3xfBdoSHAtVyB/mEVrkgoGOYqNAcekDf/6oOVd4JH9pay23jF70kz+LkZhcCppgBrERCMwcVGoY/Plac2qtPkvC8TH4+1ov/hAPdJKvaCo+a72htbmM3o8SOo94RYdZELcYCZllNg/oiOkJ0eC9ItuvVV/fbevrhtaRyF+ofSd/KB68p5xy506VrsTGDAP4cNVEc4QXf5H8cYjG1NKGD9Btopkialbgr+K6JThjeHpoUI4fQnDNpXYAyVivQyyYdTishVrRLWtRL/4AM+vNOAim8p6YghjhR5zyd/5ya+lf3/ob7huotVRLrnHf5aF1TUVqBLdyBNdlDHQIM6FN5mVBROG21rqWvG7S13L2XnvNbV2vgI2z2pdUQkkYp2jG8syoGIzqDLlCzdKFda2l9/UJaeCDf1vlr4VZjYRzCUdDrX1sqJ5qzJnR2ip6P0roccsPTk0AIAtNrVjst7WspdBVh/d1leVr9df3dhz7mVtEeCix9bhW6ySKB+/QXz0KPOjyKOta7DCAj7DabG8oS0aGoySMMUQznJ74yNK67LbJtelrlWvl1QeTnqenLa9EDVmEHkq/A8m8fsSWUaY147Ce1hXdsq86X0UpV3S2LFFvELBMa8bkL0kyrZJxigRJI90rkOi9/PnH8YYZh0ZQeqtrvl3VzdheV2W2cu4YlL4Lx4FecmOCFbOl5/S5976vdT9V7O1+HP3odTv2D8CGKRlQui21YltTqqh7qw3ic7UAnox7Qd73vh7H8YQ08cG/IVgyz4WrAbor9HVHbffvZ895te7eUBo9hL7vx7fP+h0dRiBuhUNaQwd2f+zrvq50dYyFf/65jtf3eb9d77UjPPBbjttHx02km9bK0Xrr97buzazf276vrkEoq1rXdLjqP4sqFX9uqdrUmpCRb+ux3vFRbTvU4TZ1dPPR1Y42rzzubLBs5aw7lF3XBi+Qy2+uu7Z/z0irBcB8rEfZd1TbsZv2Idb14wYdKfCF+50qByaHW4tiWmvFKQqOkGBtH0DiONb//uv6hhm35qMB0q0+HvrDun3dlD3b/RTobLscA73W3tYKTcuyl/L93Pfrtp53nff+ebvttx1aPr8dx8YpmQAFBOF6RzHrz752zJywthvqM2IAnOe+3W7XJ6SFD/5txZJ5Lt4zWoS+Pg7o5I/bXuvu/CdLY0fvOM/bj+/r71Co3NuhcQj8SxH+Ordz2+jqBu/XK/7557q9vu+fH4/P9QCD27a168e33Ue9297bte8dAtzObrff+3luoXfs0dtWrmEN36tua19xkel6K8go9u22feKj+nHTt3Do62G/7frcc9CcFLDs7baeawWyfSu3vN3+BST7+Uc9gEgEzNft1s4r7me30/Zvctu+Pba26ra1mItuVxRg2JpmWtuKUzQcIcG1fwPwt9v2P/++v+FPrq1eOyA92m+f5jfnz+3Q7tY/bmi0CSWmMNBXaGBbtw1aB+6/38/zfmz3T1Ov+/fH43xct+v9/uN6PXgNyCiEuuOKyLP0923bd3TdrT/W3jBX2v1+Ho/H/UlWJa4EfftaGAy9p21v367QyV8fJwonxO/IpF7RO+73x5+/b3/GKOXZr2Y3Bv6VjP++H+gF/CPyAe/3u96/1uP1/fn922/ftyvCQ32u928/rjHp06Eh3Pdzv37bj/vujj/3+/3AMMEefRz1Hrf0+6pJZzTbbo66b3vajsfxHR+9Xx/6gXF8v7offEKivInDcu8fG1rIhtZ01Ec9Hn/EM+73v9p127d83RDuo9/vLbvH3W0/0DZ+/Hb0TaMuU2263zdcMlDWTOvYHuahDwwAo7f9h6nn43H8H1GOcJYAeNp9lHt4jmUcxz/fx1pMy6lsTuvZS8oxxy2S5HyKbHPWDFNDcjaLsRmRteaYMLSwsFnUzLGQQpJ0UArbQvrH1YG4XKXefu+76eKf7ut67ue+n/d5fs9z39/P5wXKUXrURviGUTaTfx5QLsLOPenAPQTZKBiX2WxgE7kUqLtma6m8Tg0n0jnqnA+bH3bNfcCt6Ya5Hre+28xt63Z288I94THhsZ6qnu6eOM/oG4f/crxe31v8tcLJtlrvkE+helqtP51Qq3XEOROWEnbVreaGurVd11+rTVmt6PChZbXirRZWS97r3oveG2Vr8DdvHV//z4nb85KcsnNGSVZJesnskpDi5OJcKHKKEoo6FnUMamU/6vbddLSjM70ZpFl2+YKuWH9Fv+im44DjOIFOEHc1546xblmXz0reZJWtbh1b2MFainnDVlqNqrzFGj7lIpXZyntU4n6qsI0CvuBzdjKN6ba/iXzJDE5yitN8xdd8w88kcYZv+Y5CXuZBNnKW7/mBmdxLBbJIZpYlk8IcUi2bucwjjfm8wkIW8CqLqEg6GbzG6ywmkwPksZQlLGM55S3Zg5rLLVXRQPXTSgVojPaqtSqqriZyU2mqpQWK0DBt0GaVV2XFyqMsLbHERqiFQjVZISpUjgL5VfFarCRLc4h2q6s2qkB5yldLzmmh5ilaa2yjb6iBqquhZqi/Omm5KmkA1QnQNm1XF7XVWC1SOzVRriI1nj/UQXHsYrdmapD6KlvBmqCRGqdlWqXm2mN0BqqzJmm6YtRDg43LdVqrxuqlnaqnpqpgSf6trdql/eqtVA4pQdO0Q6O4j2BN0QpNVXsNV6JGaz3nuUwJP3KBnyjikvponzLVTelK4boa8QEfcpx97OczVnCM1fzOb1zjqqI4wlHK+NCdTJXB8R8qDv/fSp8sRwih1KAmtczGOoTxkN8aD3Wpx8PU5xEepQENaURjmtCUx2hGc1rQkla0JoJIHqcNbXmCdjxJe54yl582wjsZ4V3oSje608MM72W8P0Mf+vIs/Ygimhj6M4CBDGIwQxjKMJ4jluHEMYKRjCKe0TzPCyQwhrGM40XG8xITmMgkJjOFqfb9PpoTjeQkY3amEZpsjM4xSlON0DRj1EfoAmPUR2i60ZlhfGYaoUuMTh+bK8yaUpNWmzVZ5tE61ptB2bxtlmy0N2wix/4/Nt+1d1vMLMyCPPMq33/lXbZbv8N8e9/2tMA8K/TxxB72+nP0JXrA7jjIIT7iMB/ziT/JY2bqcUv5hLl50gw9ZV6W+nja7yLmpM/Cs5wzaorM8lJuLnLJ2Ln8Lx1vMXgAAHjaXZA9TsQwEIVjEhZyAyQLySNrKVa26KlSOJFQmrCh8DT8SLsS2TsgpaFxwVnedilzMQTeBFZA4/F7o/n0ZpCYGnnj90K88yA+3+Au93n6+GAhjFJl5yCeLE4MxIosUqMqpMtq7TWroMLtJqhKvTxvkC2nGhvbwNcKSeu7+N57QsHy+N0y31hkB0w2YQJHwO4bsJsAcf7D4tTUCulV4+88eidROJZEqsTYeIxOErPF4pgx1tfuYk57ZrBYWZzPhNajkEg4hFlpQh+CDHGDHz3+1YNI/hvFbyNeoBxE30ydXpM8GJo0xYTsLHJTt76MEYntF+Vga1wAeNrbwKDNsIlRkEmbcZMQL5DcLuRlZaQkxsChvV0YzhIx0VWS4AexRHMi7TRlQCyxSC8oSxzOkoCzJPsKI6y1QCwpoCGyQiCWdDNMTCbRH6pOFi4rF+hlBbaNYTsjjLmdKRLGYg6BsVhiYCxWY5iz2OAOZM+DOZAjDuYYzhQYiwvuLG64xTztMDFeLRV5MS4Qi09KVICHHcTiN4OZLCDIx83BCmIJ6qnJgtUxbJJnZdfewKDgWpsp4bJJXpmxeJO8KmMxAF89RGYAFABGAD4AQgA8AG0AagAyADsANwAnAGAAKQCGANsAZwFRAHkASwBPAGsAMwBCAD4AOwAnAGAAKgA5AF0ARAAAAAn/VgAKAbwACQJmAAkCigAIAAAAAAAAAAAAAAAAAFgAZABwAHwAiADOATgCGAIkAjACygNiA5AEYATEBRwFMAWeBfwGQAZsBw4HughSCQoJJAlYCY4KGApSCooKngrCCuALIgtaC7gMJAx2DOINQA12DfoOWg6aDvAPJA9OD4QP9hCiEPgRXBGyEeoSMBJsEtITGBM4E3ITzBP0FFoUqBTqFSoVthYMFpQWyBcEF0YXvhgqGHoYxBj0GRIZOhlsGYAZohomGpIa6BtUG8IcLBy2HQgdRB2WHeYeBh6AHswfDh94H+AgMCDMIRIhYiGgIhQifiLEIwQjZCN+I9wkFCQgJDgkRCRQJFwkaCR0JIAkjCSYJKQksCS8JMgk1CTgJOwk+CUEJRAlXCWsJbglxCXQJdwl6CX0JgAmDCYYJiQmYCaaJxonkihuKIwoxilOKdAqXirgKwArPiucLAos1C0mLWYtrC5GLuovLi/4MLoxHjFaMdQySjKEMsAzGjMmMzIzPjOgNFA0ZDR4NIQ0kDTONQw1WDVkNXA1lDZMNmw2jDaYNqQ3ADceN1w3zjiQOJw4qDi0OMA4zDjYOOQ48Dj8OQg5FDkgOSw5ODlEOWQ5nDn+Oiw6bDqUOuI6/DsyO2g7njv6PDA8UjyOPOI9QD1iPZo9pj6cP1xAHkEUQSBBLEE4QW5BekImQqpDIkMuQ5pEQkUURSBFRkVkRZhFpEXkRfBGMkY+RkpGgEaMRrJGvkc4R0RHUEdcR5xHnEfeR/JH/kgKSBZIXkiOSJpIykk0SZBJtknsSh5KmkqmSrpK6kr+SxZLHktsS4ZLkkueTAZMEkw6TGBMbEx4TIRM+k0GTYxNmE22ThROIE5wTt5PXE9oT9JP3lA+UIRQmlCmULJQ6FD0UQhRXFFoUXRRgFGkUbBRvFHQUlpS/lMKUxZTIlMuUzpTTlO8VA5USFRUVH5UilSWVKJUrlS6VMZU8FT8VTJVTFVYVWRVcFV8Vc5V2lacVqhWtFbAVsxXaFd0V4BXjFeYV6RYFlhcWGhYdFjyWP5ZSFlUWWBZbFl4WYRZyFoGWmZaclrIWtRa4Fr+W0RbWFtkW+Rb8Fv8XAhcFFzgXT5d8l5SXl5e1F84X9Jf3l/qX/ZgEGAcYFBgXGBoYNZg4mGUYaBiBGKGYpJi5GLwY15j+GQEZBBknmTAZQZlEmUeZSplNmVCZU5lWmVmZbQAAHjazL0JfGRVlTB+73u1pKpSe2rfU6lUlk4qSWXvdJLO1p1OdycNNPQWoFmapdm6EWhaFkFFaVTcBQRBBVxGxlpaXPDT1hmdv858WsqIg0bAGUFBRRwzojhd+Z9z7nu1ZGkaZ+b7TUO9eu/Wy3t3OffsC+MszBj7mXSMmdhteebgmtYMt2XkQkZO4Ym2kNGmMsyWqSlkaujEWMgYUwx/ZpO7MrpUIKtLDu+mCwNcGOLKBYcLHoELgy1r5Is5STbaHQMZ2ZbVyIs5rcYAV7kagwa/TEYZvjo603G7vqfPnnb1ufQfn+nvnxka4r3x8QZu+01yIgkdXVpiyaVX+Zdlp9TIpqFBx351UrQ3Q/t+6Q7WyF74IbZfxkS7nTEpJNvh/lm6/8VJ0e5YOpt/QToG7VdT+0N2/AMJn8r/LB1gtczFpvJGp03TmpecMsyLZMu4ChldgWX0MHgxfg2MUpNQhizBhYRDZrasmS9m9Lasky92dCbirjgMKt3ldtXpkl29Pd2N8biLpz4yO/uR+SuvPG94dHT4Q299q3Tg2nP37Dl3cjTdPfIC9WUc+vgkrE0tC7Hr8xaHFfrideihLxZbhhcyDugLvtgGL7apq+CCC5e6Cha4sMSUiwBcBLB/LlqSTADWAlaGGWkRuAYXKGcOuPDL4QrQkjhdbndadLleJ+M47L29YiTx+sb32IfjI5s3j8SH7TMz9vHmCw4cuKB5nPcfr0/OT03NJ4s/eUbuLha9ibv27bsrQWOKwzo9AWOKsnW8L590wMzmw44YHF2OOk1rziCHqRuxOgSXOlvGWshYU7l7rPxwzlYXw9+8LrwlE7Zl/IWMPzVq2Ozf5b/Uf8SvOZwLhLH7LONLwdhp1HUw6jp1cghe1clhcMFgPnIGHcPnXm3h86OGiCVlGbHMWjTzubuhIRfxwWEED1YfP3z8Gt9bfNJ8bg4aMj5b1q9fHHVG/Cn/iH/Wf57/av+t/rv9D/oNh3Mjfn4oZ7b4sasWW9YKN7qY1WaNWjuso9Y56/nWa6xvsb7Xajyc67DCrTarDzvhrKMvr8+KXwG/Bf9eZ8s2yIsIVy0yAJSnvrGnG1fBk25sTOqTfXDsSbvdnj6P3o1L00fL5arDpfvd3kNX74yn7bKps/5Sx5wn7b/A2WjfaR8Z2nS4cWJoaAI/hrdcfPFtPqdvtD6eCtQlnRpzyBZMucY/te+y25/fvG/f5s1794p9A/iC/052wj77lQ/3zZyyzyLQfrvYfz/F9muwncmsGRb9BukSaDGyOPt6nnskWOuoxwnHGrcBjnq3UewuTQH2U8Zpy/gKuH608BnTQiZqy9QWMrUpAexGWDVjonI9E5X4J6JcmOHCjBcwd5INMI5OgpncAOjMm9VIizlZo8OZNduytYbFnNVcq1yFbItZd81izuc24wL4Q/hDLl4bEtvBTihKy+PcmXbFe/p6la2h71G3hf7rw7uu4A8Xzxznj9Xc+PxF3mjQ5++2OfrqO/oafdIlxTyX14328pP3SQdO/rBfujWS8rmCEeuIzdvTWj8UVebscmXOfOyfxQwpsyXmry7ogqPJ7aucORPNk8uWMRdg+Lh3bAXADXjiAGSRAnjNeBWUUTVxVVNaNYuETF5/FgGhmOBXtwk3X8adypoNixnLAsyn0gW3LeMsZJypnNfsXjGR+nQPYEcXYMmeeI+zYvpi52/tT6X6P3lD9awVf/nD8fGeqSmJaxHGOHNzP3uM5mtQzE9pTlh5o8P4shyHwPiyIbDKHj02suuK0utgLbphLW4DeiADDl7HXXnuxvlnbsRbJq8XsZdnHRzrPYDDMl7lvbmAxotTEUhlaxxACQr4i1iEgC0TKiDyihQy9bZMQyHTkMKTxkKmMZWJ2TLNhUxzKrPOlmlV1kqG7svq8mjhQptYTmTxogkumvBCC3gdYFqvRbyOVxYYdsCiVTtkXMzZxRXgJRfc6dAQzg8GarCxyZYNwx80h5vwqjmVjcJixmgbxguZeCrTrHQ21xptpqnjsIpaWEOBfIAuJHtUqoFrXL2+0iytbbHlh1vrW6c6Yu02Z7s32NCXHOM3nb8N1/vhI7AzYJ37+6XbDV2J9Hpb7bDDEfJHw5J09c+Xrb2fu9jvYH187Ehe7wUKguDOCkB8kYuBc0sh57EQMfGkshpYDA8iGFaePwQMBrMgcwQE4HqyRhi+x8jVv4H5Mosroy1rhzstzE442qMRkLPm0IM/mFk2RqldGdSgtXbY7ggGIjgoGEcdwPCfpYPMy87Puzw1MA4X0XieytTgIJCcVYC0A3ruwJ7Drsxy6JOG487MOGAnAvbSSibsocWEjTmrg1N/uUP0dy3MdduR5y/yRYN+f9ru6I919CV8fEcfIKh2vysQto3aPICg1kfFvE9zI3+Sb4Z9Yc3JTG6FbqWyXFrE6Yi5pvkxbhwehvs2sdv53fy7wF9+Oqc3ya05ZtJjR004upxRXBhtGamQ0+mp0zLTEW9IVzh4Da2mtqDQaQb4KiMt5GTJSBtZTnlzBqPASwY4ZzLxllz5mae8ZRQpWFpgY3UF4DrF35jgBtigRoXJhQEk+5CSevRAWr9xtPXI0daj8P+RVp68seXo0ZYb6RrnAGnhLwD2zOwdeb1TB2umw4EAI4gn4o3Qc0MB+oUnpgK8DE8IQTNsVfhoPSynPrGML1mFdears84Kx9nRGYv1EAdtBw7aFeO/KB4ZHp697z4+8BfftI/XF/9zePPwk8SHdSz9hX2U8JqVbQMOV+H8WeFmeD/NmFy4CecWW2koWWPdYvW2qSK0Wb12MSMvdHT2yWlZ311mErfYdzvmIm53NOp2R77BHynufa8nGvV4IhHsRxO/i/2c+qFnaaB0GsClsptpWtka6C6hYDgL8EMFsfni8Hlw7Mtj/K6fwj/Bx3vg0ETPjbCf53UOA/GZWhillvADbC0doQhYL4Mi1uACGYiIwgKZaNcBEyKImEQUDOaijpB3oIDMp4fOAZ2HUplgAfkWoq8p3LXYYTt02J6opKXqBQkOKuam1VcEB620iADDCFo4gQpgpDpotRI681Crj+6ATmjx9SBi9MX1HvjE++J9afqk9fTRx+nDd8bfHd/Z8u6W8ZbzzfvrD9Re2jJBV+fViqtfv/e9v85kMuvfuz6jfAF8Ny19ij8sfZG1sULe53DDDLY4auEYdwD3hjRdwLoTtxNwFLlQbQsCY4g4jbZCpk1BVm4Yn1sdeRtctNFgFzJttO+1bcgTwEXWAEyu25aNgoSoM0QRvm3uNtqkNtjYtQYbYTMbbQCnjf4KeuFZwKOvkAvSzblQFG/I2GzZRtgv8UZ6ULKRfmtpayQcqI33NFbg6mSyEVnqPgAkYKNdjQr77PEQWtdz/WRqztc039k30d62s3t2z+hkYtwf39HVMZZq2jc2vGty9wWasPOM+ljbusYmZ6xuYnJ8m37vXo3XMReMNrcmEtYG/9ahjWcYADa1LLb0qrQfsL4J9l6AJVmavTdv8+qQr/DiLLd76+EY9DaBPFQbJA6rNpWz6IJEs4G7AipWCyKFQ9mPtAWr+Df1ohYualUwi8BFROCVjHMhK9csIobxwVcEmI2FbILOsp01gEg4bV0hZcg8zeW6shhY+Zu+QtLgrdv7+rbj5//jtw4Xb5tsjUTWrYtEWiWt+sN6tYm/JBq2n3wWiT1/KdJKPxWvVdr7lAbcyyDzS8MwXwbWwX6a1zvsMDvrwq0Ag8AldRQyHYCbHECy7XpBsnMaowcXu86DiDPbANMVhp2ayiU7GrC9qaEDv1J0JabQD3PjT1RKzZFK5hgvgFliwC+2CpGsNZVrarUQbDYBbJosrSoxyclNRMfqxI11wEHoF3MhceW3ZWPwkHCMJM5kzEIdMTURUPZ19fYldTibWvgSc9zXqMp6FVDZ29uX1un0npdbxn25htQmnhiq3917zjWjnZ7A/k2J8WBwtKmpr8n/ObOVT/GA93Bv2P8181hL76be0frkwR19ezzB/sTmM+uc2z3h9tb6nuAXQ5ONnfubjhJtR5x8BeFOf14Ol3BxmVuyLArE2zSBKJf+Jrz0Od4Ccr0ZsbgD/gbpnCCBisrIlCpzsyCPIzEDJIsUDh4GA3XRyHGY4fcfnTt0aO7o+3ngzm9H5+ruufbae+rmot/G93jgPXF6T29edqDkCIQbyLc+pVJVXapMRZNCdNHzxRKJdIot3UP8T9Jz9P3iZdKx6LfvLL+NxhThB3mbdCezsyfz5oBF6F3sBUDrOWan5RQMmlmhHzmb3ahiK8SNFlWTZlYxpMloX43nyBnMxhIoEmnAjluAx9EQgFgtROyZTEoBLq4k+g3YAny2RJPA6XkMWY6cXfxsx77lbPQngBKRqliRxAk2B9ZQcDpAQ/XJG/e4967b6967l774az2N3Zde2g3w19h92WXdjYLvYxcB3/cy4K7pPHdoVK4BiZ5G1Rdq1BXhJX0hQ5YNe6bB/mVNEglFQGMNwDFwIRqQmMCffHT4UfifG/H4KL3TvPQhdhc7wCysP2+sg3fmLKSsugl2qjfLXIuK8opVCUXEkADttOhQZVLaR7j4evOI04fsiNnQc/By2ef2hMNBW8yyS/C2TexfuY83VfC2ciorIfAggWj6/b9OTdF9UeCh7mKXwlz487q60j5RJeisrMU/qWCFiAVCVqizxAHhc7QA05sBpoFXAZhmqHFETSxTtYw0IoAIGIYzLWv/NPOns6RnTtYTn9O09Cr/d6IlHtaXt5I+zeBwqX2pkvNLjCVsiVqxJRw4Km19eW5kFZvDqnPzgVtvPYCfmW3bZrZs327IvOtdGfxInccOHjyGH+y/D3pSJPl7a547K+VvPCHIrxbEq9apWiIHii0zTaVEXtx2z+PSJSfvlWq2z83TfMHu5PfDmL3syrzLibJStYiUZc7FkvhULS9VKWqznFcJTshdm2hvWbhJCE5SpeDUl3bFVhWcHjxZPPLV1PhgX8+eaOT83rMunElPTWl+OXDBQPtQd2wu2nru7NibRqjvIViv95G8CjKDQ5FXRd9pFy0TVgF/rCKvVhMmgHHGVfk15+FG9e+lKsGVlwVXjUcIDfBgIa+tLr7G+MH7JvYePXNwLhQ7q21o+5U73i1Fp+RF43kzey4Puc+M1o9tmJiQ5WeUNUFZyMKuyTMn4Mq8BmERXwLLoFHAAE+EKUFWxSEL8rhCp74cQkqqKL0tqwPWUPDsmgUhS+XMep1QP8hlBUOsx8kHn3h8+sCB6eKzT0sHipd88INjd92l4T+GPtbD3N8PfQyxm/IB4mdlh01wsgJ/+2wkTfkUoPHA+z1VqkYEV6YTswdYW5x5gImC3aQjApMz+syKROYENtbtNBOicgNfEGCiv86uFZON4GSPuWKu3t6/33PLrfPp7aHYtrYNu3cPtwxE+FhxydzIb7tkfv6ygHtntH5yw9Ckzcwnpz6j1SIOAH6SfwPGZYeRnZ/3Eg6wOhwwMlnBxNka52LO4K0pIclVBU6QwAmEaukLeU5DLZ5lXUL5HOAl5XMfCBcq+Fdqm3+/53pv+F07bqtNOHZde0Nq++DgdvwYjuxO7OhefE5vOrJr95EfrD/jjPVDO3bgfnDAIQN917EpBXcIeiIJ4axKj1clDJasLVrFjKHVqMooZ6wnxjPFF2dfK36Pf0y68OQDALaAXXH9vwV4w8PiLAUw0EYz5XIkgaLoZNKBGWQUEwDyctYkKTOtqZzDhVCRDTiIX44h192SKrPXK7Briy3rRQmmxUuWFPpCfj0s0Sw2SOVZrCRKtAVlFRxgOp0V53/YdeNkurXvyu3br+pv6Zq6cXfHxo0dqY0bU4Nbtw4ObN1q2D87dKbZOt21ZdeuLV3TVvOZQ7P7+ZX9be39/e1t/cUnx7rTY2Pp7jGCF5jzb8A8ILzszzvIriQ7vDALeittABVgarwlgKnamKrAmtMx/esCjFOhufE+lafVVwgTawCMdPUaEIP9J7rLP0E0r1dQXsQzZCRADEGKVobWg+XkGHifrGs5VbavRqGXU2q+QyXZkuBH4P0W5mdnnZIjQXwn7BhGsh66oFuO1FpsChIhr3YltyJXdLCCcyn1sYqF4U9V8RbD7DJ+gD8P+2scCK1M6g9iSnMapiWyq0l5iWmWFgC1SUJ1hogqKxN1ZIoBSktr2ZNw6T2uYd708sucbf/Iphtu2CTWZJb9A3+av5v0OLCbtLKqaGEpRdEiw9jRmLyAakLataq2UAufWX6seD0/xncMDR0bHBR93wh9v5z6PpXjstya08hc7TKiNuI2GanblvUdEIfoPrEWpe5zeFVfsodfXvwx9H97Zf9dS3/ht8Oe8LEEO5yzwdvwDUJ1J5PaBSiqW6iPyeyYjdatJn7H4SKOWMAMNAuoQtyWDcECu7GDbsIwblJvGskQknOSmQmmYRWuAiS8eG9vpSrtOf/6gd7evchj7LxwIu6z82nJl1LBlQ+ER9e19/bVnxFr3zfbtzMRSDgSXb8sw2106YD0gtTL0myUfTxv9vjREufVw3F9aB1ZNdIqxc45zSRMO1OZtC3TU8h0A40OpXASbIbFTAjkNsNirtlmFDYCYRkgs4PTaBOyd4hEW7rKpFK5xuYUNnSl0GaQSRcyabQkZIcBFlK2bD/wKt3D/XhHT/+wQOR6XRlNCOqCMmK8gllFGlrR4unT9zWW75Y6WrUub8/m+657V/Z714xd0Zo4PPa+X//wMx/40o1b4n1G60B4ZPLiHfUpo77VU5MM9I40N0TW8Zv/EPZesPuKt37p2IO3BpwDjsAn8/c/89mbj94QDvqiZw/vuD1kT7xwkzuyr7eps16BHTiMAA2TmJHdkNc5cUaN6DOQq9GTUd1gJDTJagwCGpGTkVH3xZBHRrCpAbCpUWGIROTICr6jRibgZ8BKPMH4fO6jcAAEIyQTYII8ybg+7kw7efNF39m/6eTU3CtbXpE0xdeKX/4y6liEPRb9G/5AfJqHRdkFeR/1VnaGUNcUkgUaR/2dQFtAtpxOgHPvKt1Ue5bx2rJWIHjMaxUa+6xbsEM+6phgLeN2sWQJZUnjdpdyxt/WOXzVuc9897wreosv37xhbGzDze8b3rhxmA+bd6TP2i0dOGu2d8LR1dXVUfzTPw92dA4QbkgALX+J9uu+vNmJFMCsSp1kaVzFdEbsHFEt2aMo1NENAtg3G6AKvYBbJ4E0gK9wSXEu072UgTDx6NGeM8KJudT8ddfNp+YS4TN6jj7K03c/FvSdWR95x1VXvSNSf6Yv+JjwKZH6Yc5rgOJ25w3Y27zWaV6uV6niIrIGTmTBhnOYViYvnlRnb/pbdzz88B3XX3fpdfC/dOBT73rXpzbddvDg7YqMzngB3meCualxmoR8JFCZ0NjWqOJZTUk8063Cf5ckDEZApqBRFCZqiBggw6r8N83fUfwHHiz+gg8Ub5QOTH1z6gebSn05AX0xsFmQC7jAL+LlTBUKVP8iRj5GKm+3gq+SiNFD+NLTpMTtysvvmeU3FP+Fu4svwZu/P6XChxQE+Aixa/M1xOcFUCrJaQME49pUziWTudNVHnyVut4EFyZcCJCtMnYgzCSZEksX0cHGw8kAoK8xkUhVZyeB0eUVxuQEgAlqNCrxVRmI+FTLZPgdhXXXDrzlwc/eAvg8uavr/BsPb3D73jf2Smfyb99z92Nh31nxGADRO5U5lMZoPXcr2EV4JOlIbiFJqoRIqhawaruW3ZMq966G5F7YpmmQtmN2dPCJ8T/MzhYfmZ3le0k36y3+CgSpPzN1Pdk9pBuMC379FJK9EOHvmRXmXFaSf7fAhZUNA47UCz1hhaBe1WXVtgS4D8kk8flcUyOEcUV4gg4TIQiF+up7u2bndyVG/Ttcnomt/CPFA1dd4lbmzwfvNLJbYD8YxH4QqjuDCoOq2S6rdS6qDFKNdnX2two8SSiJVE44dphrSZLSiy8N1ysaDZ5GYznOCnddWPwh7ztQfB7mp/g7bi/+pHiCx4rP4kyJffMDONWyDsU6Vy0LrY40ZAVbwM6YnuUDMPE/31RaN+kY+bV9KCdrgJcykjG20vdLUSXqUjm94PpMpX25Qvpam16pSAM4NvIx4KmcJAtOU0LKJQHl0nPRoBeWRtRGJuIyAp/TiXDIr9Q8uW36J09PbruTzxabYH4e5PsBEv+lPJZGwilX5DTAaeYZmvdwLcUqqvrHVZauSh9W5T6hWuQUPYqwK9co5zUpL2wRO61cmtulxsHiZ7bO8E20P35V9EIP2/iTyAsg3pkr6eMcTrLqOGurdIMr5g3ESitgGSBILr7M+FJpYJHmHrjxyAMPHLnxgdmrdu+66qpdu6/i6WO53LG7stm7hDruWKUPo5E52ajAFQD3FgFDzgJ7Xe9FwAiIGOxl78VlvovrPjj7b/PXXHPu8NjY8Af++EfpAHouTo2ku0eepzlYoDmwg5z9qXyMMJbZGQDsa3cj0LntJUaGM2KDPUqTB5psdjLeuNxMOFnYxSZMrXRVKi2Z4rtoI2hGnWbGs5CzMw890w5ABiQrDLjD5SDnQrdHrCoqZbxhodvTJqtZS70nidaYPk9vmQPli13hyYRYgVRL+hV/CtkDf5AWo2HE7hQrMf3mltEBk3GsaTQyP6hqSZV1kazEB7jZfN6NmAggBD3hLE4tHO3OOhVO1nbJIk0mXhiF2s9lMAoyluUyaT3tqNNTmStZWTq9My4D0nkvuvs9+/P5q8/a/IU9mSul2E8G0+lBtMHtPWdml7H4Z64p/iftMfKzhTVMso/mAhZYtXq9rPqdwpZ21etV4rmCcibgIkFYO2FXsLZKQDm5ReVM9kTJWqbXEOU0KopXlZwmBDmlBcWlC4QF6Q3TD/WJcBURKFlwlxnKVLVmc+v5ves3d3bu6T3r+tmuffWJnT3pqc7W/VNj1+8evqhjZyLelWpqrYu7pjfPnuH3nhmKt7Unm22NgbmR7Xuiiq8H0RA9G8trVLpVsnso4u0KxFwiDkJHi/dpFJVrHFBJmP/lqVkpOjV18jlJ8asZAfwRJV3eIPCIGoKNEqdYtWGrxM5KtlEo9JEulgkkT136zu27tmzZNXun4dZb+OHiRy4499wL+GXFd998K70XZZgB0sPtB2kAfdx0CJPVYrWiDmBrUMEV+kQNk1R5PXdcA4j/g3Do6IzFZUT0fOuW35554htzgDwlXoQ+OKEPvyEadTxvcqLPo4akqGoPZZ240oorSaclQkuCfq5Go8hbdEutoWZ1Al4lFlRttdWpea1WIIxaHEctjgMO6LqgV37QE33AQclxWcbh8f0jt9+y9ZObb3vrpk9uvwWG6OW/AlrxbDGG52KtyTed+LpPwFrrKj3NhS1AmXW9WAPBRSDXR1Q5a3Au5ox6rmibTc5F9kY4QHWkOaMkxmCEwWmUc1wwLiZRb1T0qrIzngT5EuTMPqnuBz/Z87ePnfP0D/Y8/CiM55+L337tNd7P23/3u8px1bA3ASzpCIpkhcEgCp3lTpQmyrrpVbZOlYa6hOmZhpdox+MoBH8YDzK1Cv4Fegqr4Ir3yGnuzZ713PZnzuYTvL74kZMn+WVi3smHmfiHA3lDHVFH1OEhVyh2dFm3tCbPIEwuBHWPPy2/KP9ZlucVASlXQzD5+FM1L9T8sUYGgE+4Yj08Bpue898Uu/jO4lf4N4uPbdqkkYJTmpPPE0+z9DleLx0D/LKhbFeVFmCKSsEWtGJVnux4IZdkM5KKnPY0RRu8731PPy1NnfzshPTMxHIbI3eQDytKRUx1VVLN5fAEIBVzf5r5k3TsZL30jGJzZ69Q39ryGjVGROmbbplVv7IvHjuIQPD5NPTFJp09cbJ+QsA9f5ifRbhmvBLul+MamtxlMK1dABwKTF8JTNGd0YOA+Z4tN20/80zgpb/5lregPWrp/Xzv0lNkw5W4TAPFNYNewTrU8U1XTdC8/I2k4dM0L815FlLkU3khKyFQAqGLcICvh/BwAg5Z2Yz8GcjhfHpy93ZJcwfS9fqlP/G38m8B3mpmd+f1jgaUNh0WNU4jV9egF54gOG9hxZbnhSF51VCEIFwE1Z0Zg4sYgphRWswlvRjzkEkKc96yWI0k/eYVxr068i0AmklBEuFYUkiiPZWqi2odIyxNBdPDBw3r401jY03x9YaBzsSGoHumefvuafNIcmL/BZvqR65q94UTTU3J8D2DzR0uxyab64yp4pMxc3Dr2PA2dLdjY8AzYLyKjSxsAspMaFfAcQvv54ptpYJMGU/FV+PLVWecHLPUEN6vsShapgCAmoVY5py9Omqlb3mgilwZxvKerVttE837L7lkf/OErRTB0t0tHcNQlWPz596Z4EE1hAVhBGNWroH1JV2TQ7E2rK5rip9C1yQLXZO8lq6pb01dU/ymPdFRj3cwuv6ss9ZHB72e0eiem565/GZ73Vave9fWrbvc3q119pvV+JrjSszQjcLCnA86gPdGx3Mh85K1mZVDgpKVfY4vj58osXcEkUJftjJsyCKYdj9x68ugzlMJZR5YGH5pOW6ovBJb36bO+QXd3sSd584fS3i5dPJ6VoobehDWQMcC7C15lwN4oryT8KRLNWgEnBrh4l4RFRVfrsqyCS8ul9BLu1KPP+TKuE645EPHC67nXNJ87hUXP5RjLn44K0vqSiGvjSa9AOl/AOXAHko3NjorRQZXjECs76XWCePzUvf5gYmm86+/ateefcXvyWcPJdaH+duHNnRuLt7rcrz50kvedmR/YNtMnbvkzxCTPgAS47tgvyDeMKlrpYrgeCJ8VC2qalb1RWJl79JVd1PVPKgOgTDCWiVyA+PxeK1G2VSAc4TfK1pLxCKiaR2YVXTQEYgiZvTVxpouumjLzMz2QUdAunNCr21umhgtvo3fNLplbEZL67WVZxWceM8p4DDXUEfIsaESIuOrQWQULqKxtSBSPiVE5uJR2oZRWzYJsNuQ1LwemPYoaiXFRs8vtg81jExNjTQM2W3jzfsvvnh/87ht67HZ1hlfbFNy/Rnv/EKkce/k5J7GmZAncWz37mMNnq7iJW+60O04M+JVdDDjcHgM9qYTeGwn+fkYHaidda4UIE4ZsFatZ5F1qonOCkNzWIUGMl1CgLB0ioPB+IxzsnVmx9aOruRwLWC71/zJPZuLP+Oe9vWphqLwC++H473SYfJNHQJsp1AxXeEm6Is3y/wKr0aAtAJZ1BLtNJiQEalUYkAf7g3VOUMhZ13INCON0VkweF9xgn+V9vfSb5e2Ke8NsK3wXj+811/1XrysQLdVHSAYj1V2ADe6R17Rjyq/i4o+jQ+jA79VH4pUdM4+PCZJo1yKJPhL6vp9CdbPyK7NS6RTNhI1kCoU2YIsGFdqzlbdm1UceVlzZiRKp6sRwoyO04rGkkTV+tJ6D9/7f2dmvrX/J8/87GewjDc88Y+/V+GLvYd4mbigvqzaE3KlbvY9M8DlXS8dK8Gn9D7Ys/XsrrwPVyBvI19bvaMGuTM7oUKf4vC+ynatooC0XeMrPNzVxVIvfHDhI4SkV0QEck1zFXKhqE8IHsvBuOIk7aIf+S2uifbx6a3NrfW9xhlxnLGNNLcM81vCzedsLv6E+9sHWhuK3yt9f7XbH29S9ySM2cnOWbknKzZk/K/ckLQTXafcifyr/cs3ohInC/1S9IgO0iM6qvWI8dX0iLLQIyLoJ9Zy1H7i8J69hw7t3XN4qxoA+szFt99+MX42z89vhk85/phw+GnEH8f/H8Ufu95Y/LF0oLscfkzzejbPw5hsZBmi0QCUKzydvUC+aKWeV3EPVYseW0MFaRYqyIAwk63CmmqXUxm5kgYBZ6SOAkekju6zzyhj8HafvI+3V/KmCL9JGI+dXZCvcVTZNmpQs85WDsAKF9b4ch0HqyHrrdVWYWXJ6WuEIsUqbC4KR1C585KGgCU+YJqZsaxPWDz8a9t0unXJ4lP8q4PBJEhwIi4f+pdk38zX02xXSkYuff0KNWJ8LTWiJNSIUlmNmCh5Ux9/wfRHE3BvOhM/dPxO071wfnzatBu+Hq8zNZi6TfJ87p9NaHo4DXUjcnre8H9F3RiZaUr0xUMbuob3jiUmAsHRpvqueGSiq3f/ZOv2+FwwGor5QkaXrb93cJyc8MPBgM/ksW9IbZjwES4GgYo3Sp2w//cLXL7cp5aTSZcrbpQVhCb+eukYgP8Viki0mNQsCEqguF+7vj4zPz9zCb+JeLnrrhvFvmyANXwECLWT7QX+1EiYyFmNI2lTrLpdqoS5kjODwJFVHAsviaOq6rLPzh/Z6hxvnZnbmupKDgGiLE4QquTx4ouIKnkbU30IvwD90wEOl0nq1DlOQ3cZr9SExU+huyxrLGu2fG7H7bfNQkc+yefVd0sXwrtr2WeBchjIk07Cd4soRK340igxiVpFLykTfa8VNkJxVSO+TDX6aq1HFauw6tquGkuWM2lYKdQAdppOudSRprJCUenk83svmH7r9L756bfOXLAXhvYYPxP4sh3Fz4tzVppjaBC6SqJGxAGdtq7SUaWrdCyuMsK1OaM3rKvUk0qoL5n29PFH739k55tv2vHwR8++5lr+1adeeOyxf3v6wQdpTJgDBMakZxcKb2XgdASd5bCCEqcBaXVlNVQVg7OSE4gt6zs63Kme7R2dnngfAdG3t4w/tuOtt23/7Kf414uf4OeK+aX8CdAXAzsrb6C+1DheTycZX6GTlEphzDoKJVRUkUID6Yz3xFwyv634sd/9gu96eXRUw4+MaorvFDLo0uf4EDCCDWwP4Buj0NmIcA6jKnFqFde3XL1RzAmwvIqTJbFxSrQN+ohYyXOFMmTAFq+3WRW9DOxrkCZhj5MhsQeRKaJRbANBk7xgP++0X3Zp57Dd0d7usA93XnqZ3el1Or3f+7LDOTHS+UWHc8rh/GLnyITT8eVgo8nUqNiElz7H3k+8r0/EUKwWPQGIZXpajZ0QsUQjNOZzQDaFv8lpgkzxjI8VMrGU4lIaVPz/GDC18FUWeXDAHnJ3ymncHjWfBIwb5MyYiBcRTr7qaN0udQZotGIGHsbhrRy0SwwvqIzb6ZhyOmjcSozK9/hRfgbg5FTe6DFRZggaNcYcF7IWdMBVrVNCcYAGXZk8PYhGYRfiRMGQ71g/km5vH4y43Pg9EK3z8NmhybFoeGhiLEb5PcjHTWZSI+ujfDkvdbKK9h7RznXs1x0MaFcugqlTZil/ShTPomj3wfsTS9PotwX3D9Bz/q1NPId8lmQ7a2QvjmD7elZqlxop38hvhrF9QmknO7vMoP2ljdg+qbST/Uy092L7jNJOOlrK93OOyPfjXL397L+rbH97qf1nv65sv7zU/vHfVLbfVGp/pqr9vlL7vyrPicM8XMO/Be27xTz8m9r+Kn8QYLKRPRTA9r2sqh3u3yv6+Y+V7W+H+3/2h5X3Xw7tH1+sbIfJYs+K538Y2xdE+xJKkHfT87FFz85emiK5HK3BP4LnYy6SSwWHmdd4tGomkhzTkuFNJ75kJUJfUxHWvoLTjGjIb7HkrJHVmdVMIuR1AQyJQN8e4Evu2jLa1jayZfOM9PZ37tz5zu8IjYG8dJL6dTnJRwG2SZFXHSGMT9aFaCe4UitFVIrzpE64oBMgiFhNxAy5kJtS3f0Uz9KKc+zJjX6nMxh0Ov03BZzOAH7eNyOtrwsE6vBK+b6C+gfzLHQ9CA8XCXgoltflCTH/QWy/mFW1w/0Xi/X9p8p2Wt//WHk/re8fV7bfVHrOM/8h2omHE++NYvtBVtUO9x8U7y1UttN7/7zyfnrva6V2tKmBFBKmPGLb8tx72nGBcoVfKWJT/QI6EaMAo8d7lsUGhi8cvBD+53/8/vf79+0jea6N38Djir9NMl8bJPoddCz3t8E8J6gZshqW+9dUBjbHN6fTm/Hz9aZgsAk//A/p6ek0fui6uVnYAz7Dr5EagGZ/LK8JY04BjTpWrZK9CBkevBAEpBQFwNZWYZWE+Fo155UI96S8DwikqpKp1pY1m5BtlpW4ErdEIn8QxBanO0hiS1Bk2UnodHoXRrqvEtuO/DW/xtnpm9hywQVbJnydzrJ9odFml3fvM984P3+jeffZst1WMjOUeBX0DYmx9+RDqBvKhNTxlxxNReBrDYknIWXUeOKny2AhEyy7e5JAutLAKqtiSg0FjOYcXJVQ3TRUrvio+fEOeKTgctK9wFKUdNWeCh02RfJ/uXhgg7H2zDOvmo8OOl299Rsm77uv1rRx40Z7c+zakZn919nMk2bH3KZNI9f6u6xKLomle3kOxmsG7PkqrPgIwFgibEJ/phHSm9uB/RWSZKspoUSHw7QINbRJ6aa3gF7UIMGGgRduatUo4SFdhUxXKtNqy/YjU9xekbQsgbJvXXuFr1QdMbntdarPQa5G304vqROhf3Rzps6WDQBItNuyPTBr3kCPwnXXY+B5AAXuXKw+QIHw7eSX3klPzHX1BCj4x5Ydgjv7h/DvcuvpC/aMCEz3CH+otaXfVSIJFVmZt9zv8TX58PALg3HPWGIyENzYVN8RDR1tHmqsX9nEvZfp455AwnaprsEdSHzGHHP1K9JyyB9z7giMdCY22M2xuoFxF7RGIiFfPbQOdyaGBU6Ks5t5N3834AYLeiBQHK8IOK5AALx7bmBgdnZgYI5rh7ZuHYIPrrl16VH+EPkIwKrnDchb5c0eY4X/conBrPJUILfhBMUsZviCyJiInKd4HWrl0/aF6be9bXpkamQPf8fMGWdsOTkqnTg5irqcpW38KekD0O9H8nHSRbocQXhjXDUCxVU84lJsP8iaRgqZSCrrAHwTVJDPsjjyFTofMj3Hlusw0RNYJs4dAcVeT7HmEeHTjy8wLqKl2QdbL+qIKDaG6j1WiiPtcdO69/TF7ePbB5wBs8lbG2vi03d0b/3wW869anbk6p9IurEZrVYYjjQF3/zEZUfG+BnbB7a6NZ8vvg3XT8N8nAPvJHB7lLWzm/MOH+F3H2UhCaCdvdkXwGwQgZiYp2gBePQSWSlhf6tRaEWNi7lGK8X1NaayYbiKu2h8cZBp4pgZJFOfykbh5npbZl0hs46mvL0A23Jtr8ySV6QHSZXqPRjnbz24ZctB/ER2DQ/v3j08vOsui81mafL5Ws6KJDzOzhT/0uyll87iZ/ycc8bHzjlnxmY02XriEydiYXdYuxnjNZDPfUCZg052TJmBBFrVxTxkEgoIZFoLgHdez820PBEBMRGBVC4lJiGVAvSQojaAAZnicppAtInUNxFqayLUsS4lFJlrTUdiTSu29MBXbr/9K/hJPnzo0MP4KfYdPDPa5XSn/L0TE73+lNvZFT3zIE/fmc/fiR/0tYTP0T1XWs3TdvvmoaFNNvu02Xol4WUHv1SykE9eHftmXuvCmTG5EDYcLqfwjy9RZWEirnFQOj9DrUNBysIGaSVHMdRnUbq6tbIcJSoNGAnFq0+/WM4tpVvIGXRmJYDUSGekq8CeECcAbxKNVmisVcmiEbMKKamMAIS0cUzHkPb0YWYjx9M7enlKu7m7c9v2jm6pv729UPjIFY8Ub7ih+Ei1/0qj8NtDRkHEz3Ly9M1F0EPqBByyEjqvOON96Vcm51TflbdLZn6Vwkd3LOefiUseNQgTecGlmV/GLvM12GXuUHnldwcFrxxcwSlD32fZQf40/xXIsDe/Ds9YQ5mODAWFoRDuJIABLZTtwgYDdaZIr1lKMiEySSpOGnDLgoJCbbAH4D4Re261ZcwL6OKMiZN60vRJ62Ha9Wn+9Cvj68fPu3PoWy9PrJ/Yf2zo2/+wb9/AGQPz8wNnKDFfcivFfDnYR5SoDJtDicrQFkoRXkgH4M02FWELWdxG8GCzqb4YmlK60tcPBCMrPdpNaowqa6BEgaE3jFn4kduUmDBXD4yNlwN1+BeOH3/mmjP4If5I8ce8trjIm6XG4r9QiJgStCOzlqXfSzsp346TtXI5zzA6LN+MfqjIvIn0nM22TKKQSaRyDQkf9aMBU9/4KMGOpkFJYircfL3o1Z0glb3dSwp1j/jyi9vj4vbGRDncmKyH6jQ0wEVDopJ4qXNCfBJeREWSlzoxNbIIu9PoFbdw4nLs4stTR/mgfN4G6psP+uaP1gkfAfpKNHjplwT80kg3oxHZ7eGE0URQdpIDK12v5F5Vgw+V5Ks31jl50DvSuOuqb+++yukoPu/ZkOg4q74r1R9LPHCk85z6VHtPtOEBnm7fEeEH3J5jxYeOHWzfHil+1OXeFA6MxDY1X7PxrmwkuD423nzVxmM5wnXb2S7+pKQju/xBkL1PU8LCbSPSgbISsFXmYqEwLDUdiz4lMrIg8rAs4D5ZJn+hB+OTDw9/8pPDDxffzN/ON9122/BttxWfHB6mPo6wvfxS/irpCuZyhhpZUV/mNIRfRdwuRdwsDzimL3K40VSqL3EvGRbQJ6UUeoyxwiO8+YUXAHybefeWGyf27B0/Hzsggcy9l1+hvH93Tm+U1eAikV9QQwAgeiHhjK0dOixVhQ4jXoH5XMgapIogYvTpvKL44+ef583Ql1u23Di+d89E8RM0F5QThZ8E/OBmv85z56lWS6uKTBqFSGTNzsWcRbi0coUkZa3OxZL0iK0u6L17lSwEVbJUSYnuBkKlIULlJjHSjYafxws1z9W8UiMDhmc1tppoTUeN5tCoKVNzokb8oj30uPhBPpw1aaBPUi1NoCXlffxpy4uWP1vkeYQYO+FlZ0EEixC0wIeU3TKStDT//gPbH3jggVsfO+uhB3c8dusDD9xxxx1DU+t5vPhb7iz+bP2UkLNq+RBAwjXkM/T9vN6N/F3QHaqULwmWyw6VFa6UOObYQm4uxueP22LRmDSfS8a8wndy1BBJppIjydkkkDANUOwY4An9Yk5PRttRQ52+Qd+tn9Br5it9KmtUn8pRg6+uuW6gbroObhD+ldDkanYNuKaBKGLSVnKJUJwucw1JcYu7obGht2GqQTOP4Lu2H6aryg/z77X1Lndjo9tVr22IuVsctp7gwMhYTYtv3caxlLuJvztgdgD2cTv2R7whi2nIaBlI/53LYO9sa+m20Tya+SBvgnlEmj6Qd7iJZ3avjEGSYbpknC45KkvzxB7WCPaw5hRRSLxp+8jI7OzIyPaJZH19Ej/8RxPnnDOBn9be3tbWnh4Ra1wPvCv6gK1jaTbMFvJDpD2MO/rhGHN0gvws98dxtvtt6sIahsTC5gJxCgZv7oypEeZKqrdVvGfDcBFe1SejbG8UkZv1LCyY/OOF+ufqpflsJ+zt2gItt8jO0Qhf3YVcXbfiTEs2IOH3h7m02gq5ZiWTYJgQFQgK/QWKuCgHEKWrltfTW+UfCLywLNwHOQWJ0rRKxv5zAr7ZvrH5CzdfNag43/ZO2zzTqT3zxe9pzhpKrI8EJvvWTRhekHqKH24dMl/WtHHA0NYc79oyPLrFu66LPHLXNTSsO7o/sH1znXvS5eDvGd7QuaWYa49vagAhnNakaekX/AT/kaDt7C955iDa7vh/Tdvjq1FwWVBw+XQoOOZNEiqVqJJF+Q3S9D6g6SJdgEfQdP3aNP1ak/FLtkb30ORtQ5Mm45dtjZ76Dd51zZ0e/6G99et9zc3tXv/hZ4Jddb81m+d/O785mK572Wweq3MMhEbCO1IX3+509ITWR+Y6Lr4d9mdw6SP8TskE+zPBzspbScYH2b2+AIAplHxZVoeSuEgZAjCWjaNyCGiED0NWKZOJj5J3IZNZv5BzOUg2c9f7Vshmsm5F8oQ+kT+Qm9TMEdtWyyvBf6Rkjij+fLW8EpRD9iH2URoH+gpaMcqRHPBQ1Moa6jBJJezrm2Fje3EwlgKlRyHaT4lasgzGgQy4szIBmTPtvFjJwTJm73Xwj1EnPJ5oUcLksYwvPbU0y98B/Gmc3ZGPkreWqSIHurGgZEKvTZWTuAKMuAtIMKOEq4PUIsTmKBr7SukJqxKFqVZdgkyTLWuRKEeLT0ZWG59jQo0DZfNR1F19TpQheitEYD3KE7AIDmfQbI6ZYwF936YzvbVzI/aI2Ry2R1v1nvMPDphGszrdhF7f0sAHR46NzYiL5NtGiidGZkR+lS+BrHQ/7Nokuw7kMpkcn4EoRkT4d32KlH6WBYVQgiiglxZVT1ug0QvkQCOYQruafKue8tnWUVZyFdYyiQV0shEpM0vaBaRgvYq1UPVKL6G4qrbZYI+va67T1xsO99JJT3BFC+8edjuaXe4N7roW1/s3uJ0tdR44NtcR/fKxLXwrP8y0AFljeV0YZSsWrqpNwlbkV9aVbAoAXiJTmBGDRZApSYJUp6cj3zq1b9/Uvh46bvmg+Lf8nZPibeLNp/dOZOsWFP9PjRCO+8j/wEPH81Z9K+Lj6NJfJCPlEMSsVNP5cB1qdhx1JIevzClYnZW/MlpExQsA7AEc9BqieZWY/qCaQejrKiY4sTzvkWfZd9nmay/Zgn+rqbQFO0vtv+motNWSDbdsq8U4YZiAWuCRbTD7V+U9KF/m9ZS3TK9qPAX8imTu+pIHhPZUyeKAiHO+qKQFw1lBwdCO3oq4lMBA15Fve0kmFrgH486JFMu1xadIMG4pjmOODWli4tLrrlOkY8yzcfLn/OnbDx68TaxfHMb2S4pLcACX86282REhHyCE2Vb04Mj5yLE1l5D1SowaZUbOpYUFIK0wNPXQ/fp4ZSp/9YKyJ0eWBwo12dBAkmtzU5Z+eN4rbRi30MYPHy+0PdcmzT/+UFum7USbfAilGaVyT1CEnzjpj3I+NxGNBH0Bc5VLsw5BPgR/Usn0aXUrku1UszVSV+uEEXiTP6sepXy3f7JpYE/Av7MHfU17d/p9O9LLoyE+pbibHnE5Uq0tHeiC2tHa0lkKjkA/h1/yPG9YJc98H0iCTfyuX27YoNwnN659n1TE+wAWffwe3g4w18j+D9m5/w+7l2DUyT8OPPPV0P41av8atqMcx+9hH6J8OeN5TZ0RM32Rk9GGcqYv4XtkNlpWhKtluXUxq7cu5sx6pchEyTxCOfQ+tEFN5pWWDlwi+12UxCtq3SnsF9Andjf0Cd9dmWWs4t3MuPzdqjWC3m3Bd1uU5BPVScWc5Xfzjy9/N+YJ2smf5CeVHNUjebcfMyXaiOQIGdKmElm3YpXAjGtEIkFkl63EvzgXsj7rYrVdXY/5JiuuF0IuVzjscoU+wI+9qp7z79J3OPw3w8O3K6cVdZsuL9Vt+vhLlXWeWKnO00shmsMlTKCyhfKVNFfHPZ4iawmm6OBbireN81uV1CXoK/QqfwrWopP9az7hUDgdmIVatcSJwFe1pJlMqIy0oJ4JxS6BJ6K6RwKre6ArfWch0wkT15xamSJeVf7lGOUfzKWa+SHMmNUCgrywBDerdKgZWZibgRR4R02RWCo2EpuNnRfTzivWIpB2o/BHFIGX89LT0PUhKFSF7Xwx5wu2C0NgULUb424HVgaz/3ajXrSKpUnr47o6tPnBidj+/CnfSHL+Lu9oL+e9I553zydHfMGRhtHznf9U+4+c86/XfrruvJGGkWDA7rz+4iGDw1hj1w9desRp3+5xn7VpSG+vMToMQ5M73B6m6E+2sK8RPY4tr0tWZYDTYMUBIu1fm963b5qo6xv/e6TRF5T/HuAJY7K+In0AuK3zeIwgah9T2z9P7ReU2zG3KE/yBortueV1dNna6ooQQpetKrLJ+qCv0OskRfpTxSkCUw0sIJCZFrI1hkWFv60hFYweH1ShsFM9elH/0nDx4IXwb/Diiy/mN+3c2T3Xs3Nnzxz1mxXYu/kG2Oc2ld8wpETm4spNW6/yBVynMgKAn5buZXezSwA/Tan4aTlu1KzAT+W8h1aR95DQo4XgzrMmirqkGkNJ+G7eRO8OgRTgq8MsGmvgyMo+5EJOIdGG4Fcr/GrzOan2TchX6mFVfErJfdlmy4as5FQHZ24rKkxzQTcmuUPZzVxY0ft49eXnyoP5pzXGVT1GPeZ1ld9VVSdghM2wR/JOL2V59vrgOOVth2OTdxSOg0rdgG7K/4ocpMVhXjUTdJU5a/UiAXjRChetImF0xr2QZTUU220TFQP6RMWAThRBshvgrM+WGS9kNtgy04VlIh1Pc2dlXukK8VRbce6pMiOWzx9VagIcpbICWqUygPQPalWB4o/Us1fU+gLFH5UqDVxcuu2jhM17sBV/LW5Saw0sqzkQUWsPlHhaT4mnfbmj0l8R29eLdk8lD1zmjV/cW3k/+SV6l/k3Kn6Pv/1NZTv6Of6anjMinvOxsp/e7+i9I8SnvLx0PbWjn97zRP9E+0tLN1D7v2M8X+k5evbbpa0VPDn5W15a6T8p2vH5k2Jco2zZ/b91r/S3pOfMV/pbinZ8zox4Ts/y+39rKt2vxq7xr64auxZfI3YN4wFE/CBnb+Yn+Y3kp7g1r3GTf6Kb/BMp1dRK/0TyQsydwMNDGkrmUfJE1GnKnohceCLy0L6Nw8Mb90lvf+euXZST7QZJ5jdLNwG+vz1vdJnUmF3EOKs9Xr+AnNGo9b2WhywZywlLwfKc5RWL/tCoiVlslqilwzJq0R5ezWWX/sr+kD1jP2Ev2J+zv2Knv7Lb7FF7h33Urj28hkvvto5kor7da7fDd7zNa7NLN/ZsHAz78CDm7G7JwS+SZmHOx0o8M5mLR03vZQ/B1QkgDtp5ZKOhD/whnuEneIE/x1/h1Adu41HewUc59gGt13f/SHIgOw7Pfidf5FdIb2Jmtj2vCVK1tKBRU35F7qGSWVpjJs2rHt5iyuhP6Av65/Sv6LX4Br1NH9V36Ef1MDca4UqDiCUtMAmM+rWu0YFQMBgaGOWLY8OojR4eo/d/F8bWQvGk8Tzz6zTk/JOLyDQ4+SE5I5+QCzIMjoJVqxyCWkJODAF1hkqhoEBvPslf5juk+0hO35Z3BEinHqhVnns1PDd3Nx5mUaEekVOoULcuHI9YU1Zp/jgWfZQOPZ6xnrAWrDK8tFbo2WtPpWff0ZVIdOGnxe90+vEjTSQ6OxP4Edd+sY75pWk+svR/YR2DIvqk2gdASmUZWv498b70a5vGtnzxbTCemyUNv4H8BvRAvYVHL/OouT2IG5GJV9EVBN9ShuqHVNAWHAluGvgL5DyAC4MPT4+Mjz4xMrZR0txxxx3Qv28uTfF+pkGNc17jtcM77NQ/jZobXlGioAl8gTRX6KWJKsrlmss/94fdtUaj3Wj026L1YU1nq8NsrtF31ZgawsF+gQeKgAfuADwwDXhAJssHZqDhMrnISeJLK4kABjXBxwk1ywcNRlNQoj6UyA2uj1MkyY37phANSHe8853nnIP5dAHXb6J8RT52MO+jrElGp11ExQhek+yMyOi7C6L8YsYrMhavXZxBosSSahFZoLd1pM3AJ0j4BIxGosQqSlI2NSUosno89K3+fkwN+p8iM+ib38yD41xfSg/6jXGaI+k+fqPspDmSSNOlDWtW4kpKV48b9niEpZg0nzuPnEjsgCKlUoo8EZaG1UTQYUX/430T69dP7JPuu3HTphvxXY9K9/NtgO9l1lTmw1X4Wu3hwkPl37fOnSPdf53QE71dephfBbQT994yH28D/L0hZcC/N2B6FhMpwAyozXxj7ik/FC7dpQ++95PSO/kOuYfeu2fFnr8Vt/uzePg8Hs6r2vi5h6z8UPXuHzU8ZBUIQPPXI4BnGrq6GrCRukkIgLNrpXv5W2A9nezNghbluUuJBTke0aQ0ODsqEZL/KiIk/7VEaA6IT6I9YLd34nfQZpdtPWP9QR8e2GnAB4cR8BTHEVD6HbuafmfbzD4FQBCeHwB49gjaHybaHz4V7a+alHIUgn1N2k8wLXuObtp0VI1JGSPeZljwNsTEaFn30n9KH1RqhfawjWwbN1TVC53BGqH5tGdSrR1argpasl4INwwvFXcT1UNzyRklBVCuLT0ptH3ZAe9iJmnLjngX31CNULKU/jfUCA3bsi3wB5vDVPBtcyrbq1/MNWzuxVs6ejdjY4stO6RfxDvH9IuvVyOUr1EOIVmR/9tTcX6KIqJXdE3V+1z+0XXrRv1uX/1klysUcuHHF4v54HOK2qInv9e9LtKiNzb61nV2rvM1GvUtkXXd/+h31vlAwPTfG3K7g0G3O4Rr3QxrfYtSo7eetbNB9k+V9YyVOr39HgtVO+6qiN/N1Vn6FSO3v4ssmf5UttFLps916nquXZ9XzUtcrfReqz4vwTOarjzwa4+JYtR6Utk4LBfQEBKIe+JKEZNmPRm5UvrF6vq8b3BtKgr42nEt3L6RttJaBIMunEN1LaqrIX/4dKcf5r8d5v9KyiGmzv/3q+ok05wr8097cNW6Irm6fsvrrsXKBIGJZSFN1Quj7C1W2luwMn/FEnA5jsbE2F+xBDz8kbFbP/wKNxTPGuefc6QnYRX8o22tGwOu0iqEQqVVuKj4Be7qf4NLAGvQC2sgckHH2ABIhDvYkoLpBNab9STg2OeZxl2BtXnzEa+S10VUPNKrjjOtiVklbKJzug/POlPZDbAMrbbsuLoMZPpYNYMj2U5WKGyCopCvxkhlE2GtzeJMFPFFjO/BWr6VaYLwb0LQGBH5kOtt2XZ4wtZ6CqvYmsoOwpo1DW7FP+jeOoiN7bbsqB7dxbNTJSy3enkfcu7t7X3DmO5Mgenu6JrYlI602extvmBTc8jVYPvS23V2/iGxw14H290wmO5ab63dYAOuJxCq0X2lf0KSi+bTXutSXNmbSnFlz/1Hpd7dXtK7//bfRfv4Uh/lymlkr/4S2/crcv4/Qnv70pPMwnrzRr/mFPYUiyjppk/lbHog/RxYO7awQsv2T0m7J+SqC1lqQt8ZlbwOVyDotgXNnWqfD4ma9H/CPuxW+jC19Cn+d0pdU6plmm9DfkFUNy2VM0UkIXwG2hR1frnA6Sp1TUu+dnwBxAu34kmIWfyXVTSl3067oql0ioqm9FuL1CjelWkrvOG6pomJjlk/1TVta9+Znts7OoF1Tee6Oqmu6cjuN1LXVGadMN8/eZ36Sm2yWl/JlfwfrK+kfYP1lbh2z9GpdGv/Ndvnru5vTU+9eU/n+Hhnx/h4x/rZ2fWDs7OnX2BJAq7wS/w7iq/Gm3Phsq8GsNXhUsKO/z0eG8PB3mr/jN7gipY1PTZKMc6zpRjnZ3+j5jKeolzGSba/Mpdx3oV6apwS4nEZOuGcfnZj1DZ7DWouvlwwIiyrK1Me61dxfNJVJEIeTPckzUajzWTy2aLxUFDnX5YZ+cwDicRGX61F6BciwcEAlwjOm5f+It2q8H4N7McKr1fJ/Tm8kcqMLRHVHijW0KHSv4ji9FUu5buy/kZiNaePMuNhy3Lk+ypLKEpqCUU08tXaFqkivMVEkS/1Iu0fvhJYfG8pCWAQZtRnouDReL21svwisoDymox7BbO35Ycz9S2TxIsDjYr3NW6sZu+KfzsgvdXQWea5IxFJugrnsx3m8wk49bIg6+U873MHYQ79bozsavB2IsR4Vqvy6ChXecx02kT8k1KNu0E1uUJ7dyHTnRJ4pZSqIlGZTT2xLDicLpJwkcQLBzFwWQ4zpCG1EdWKrMFakdJatSJRNgvDH4XgtmiYKiF1J8n1FHsCM98STiq3tcNzW9vplp7umJh5DPxZrc5k4pRr8dEjz1/kiwb9/rTd0R/r6Ev4+GdXW5ne5EZ+Vr90ayTldwXCthG7p6e1fij61NqLhDLvUh/lPwd6Xot7fCNT8258jddL9zM92dc1JfldSqk1GHQppXzq6jmKd538m0klR3GcPcK7+RdOO16zrRSvySl/INoPrKwD+qFkmKrIwVdlSCBMg359JsoQuCwr4HvKyQD5V6uSAAo7CH+J+B2Rv+LFNwkd1dalv7Av/s/UpNv6ujXpiNfZyrPSp1kj1xuwX/PK+nxLMvAWaLegbsR/Gv4rwG9F9KgNxcOJMueVexYV9mamVzLsVDmy8OYmhyfkdoXMhpD06Y2Szwl8mMcWLvNhDxLvKHJXPPeHKluQaiPixn1iLo9K9/OjpBPSo9cNWXOY+3V001VKHUUxbV+mmO7dODb+9Y3jY9L91113XcmuBespwbzVTmPfBpR5+670cd4C7SYWLNsPFP0e6fpOaTj4gUgrGSrnMLGS/9uvXPiOzUzEt1bGdtazVnZdVXyrP4z4LxpuFBJTa+H0Qzv9IqDTDxyrCPIEEcvnD4napli8rVkiB+JW6RTqx+QqhT9WCeH8/ZmT9wxs2rQhEotFZldEbo7fzg8NDwwOD0cC/uibFHvnD6QDsOZjZI/8OTtc/H3JDkrr4Km0gwp7qkO1p3JHp1ifO6T7+JWyg5nZ3Ar7EqqSFbVyVmMvGZfMD+nL5iXdquYlILnLLUx/To8OxHz+2MCodN/wYBT+DQ5TLb1X+a/+p+ouaw7ccssB/FDd5W3b1qi73MStciPfuorPm1P4vHHrhg3qnAsb7WdxbscqbL1BMefbsX1DVbsD2h1nlNrhfYikfwJ8j8gEo+SkE+S3utpzKQ3EKSaDii9rday69DNlgVHqmKMTbbonjUwI5tCc+Pznvpu6b4p/c9fcJSefnaKa818D3HY/wMC6cs15RWktHHyAfphSlEHjNIrNt2H5d+e91x6+F4vNC7wlTYEMm+RBHifMtYfm4dv8BapBL6OnsHelTUOVBjEfPjMvHn+OvYIWjijjh0YN57Nr2FvYe5lm/jgaWKVDAj9xaSg2xF94WOTb+yPV8/Wxt5ZrRAshQa8alurUmpRYJboitu90q0SLutD49/pTVok+VX3ojfymhzeff+s5Q2dG6nd1DO+8/qwPifrQ51N96LNisbEN45OiPvQwOwgyEcb63nC6sb6G1FrhvuQlhRG/NRURv0Jud6LghM+wE5OWqV0QTlJrRPl+B6N8z6co36EVUb6MZLl/gH6LuqaJyrqmOrHYyN0sZCVJcDeVFU2H+V3F6/hdpYqmIrfyPdJh3K8srXgjEk2uLn+9InOinjK+CI68rwJbv2dmp0pxhCvEHaq9mrOr2WX8HqqdOky1U0X+uJxGKwyfb7xm6j3La6Yi7zdFdQZj7L35GifaNqze4FrVBtVSg6WwFoa06NRlB9VgoZU1CKNUgxBfg3EwBiztRF5ebqOIgKmoTRgHSXCZINjX21dZsTAWNJrKVmWrxVP8oeLv3V7nrjAwBwOJki7sGulwKXfXz/9Uyc/0CH4Gc6H1MMBNFESfiyQpA5qSd+5rgD8QbzXnZcq1Z1QNPxQGR46JuhQ5rgszMAxIaGx6RPoVz9H3C7Ql3R/99p2It+ruPXztvU7xfKALPL82XQCYBLpANUFO8M3Sx+A+l8iZl5fQAidqggAh9DjTsvZPM38axYx5ML7o0jelF6T3SzrWy/ap+bCB5zaya1bJh71GMmzivavyQq8auVfKochJlM3pxFd1MmzXsmTY/KtPUC5s6CvSuBfldUjz7g/AWlwA1z52/G72IKLiEeRlr1bdUDqUXHbCt/hYybf47G9U5ryaLeXIevY1xWdpaRvljo6wq5XMaJRBWiTezflrmGDCXi8FL6kRY8sleyURb1UGXlQlhlBk0a5Ige2qTle/nzJLz4g00yDP1Gk1FpBn2vmkSDGt5pz+rCrdlMd5H8zZv/65MrcXwCt7hWS8dXltdf0L2uFEZ3Wp5aVo+irKv8jSzomT9ZOqb+/H2Ndg3rSs9RS+uVWwssxL92MfoPgZ6HNyaRpzUcHaTIs8ek+p+mqUhyh/WVkegnZ0Z3tIllR/OF6L/nNIc+HwY8ppdVc5p5WItj51Zqv/SkIrK69MaEWl8N5wQqsfFw8MGc2nn9CqhL9obhbLenGRc/w3VDskwR4EzgM14w2OhMgxI2ZBqLGqdSysbFpOVoJ0vDJ9w/Lk75QB3L1qBnBSg+d8btKN+91hxSwXMizi+/yoM1teuqEqp3bJ8dkeX73SyBVXbO3vL5cbaVerjdzQu3Nnb5FX2DtmYY6eLefXQ7lw6SLesvT35C+tyIXoL43kWbuqLHgF0OM6QZMR74/APmpgZ6v5RllQyTeqL6ySddRRqMg9GqEcId4UZRXXeF2Kcd4kVKL1/9V0o8mvBBOUbtTpmBjuojSrji92jUw6yvYcxHWN7FWO83GRMh8g4vLfUnzM5SD/UG5oqjTJyokX0B1HS0eBMyw2yrKuP1UQF7A8OnlRiePTLAhf+ZxZr1Nqkamu7fGeWI+Tjz/x+PSBA9PFZ/9FOlC85IMfHLvrLg3/scKjTFKtUBd7t9I/K2qHctxoFdVJsTt66p2aLL2UwquUB169cMKFM7asrzlmcYrsQUrmdIvI6mwRWZ1NagHRnFk5N6NziVaJF1UqiirVRrjR1xHq7ebFr2B10Zm950T7Htxus4/O8O+rRUZPfuGqSx1i7s9e+gx/mPIQ3p+Xw7qS3x8jjVMpRFGAk7w8ByHqDHyOxVOkIswxmfTDMP8V2Qcz5oVyjkJH7X9DFsKHnZ2+ScxCOOnrdPoGYpiFMDbgE1kILUfm549YqrMQks3hVSmLshl7iD1CmP9vaE42wr79Lqx3COSMgNtNsXgYueRWJMOcTxZlLBS0RSVmEitqrXuII2YpYDjUfCRmwY05YYBGMwUNuJ1mxW7vwwqVTACnc3X7LxWr7u198dy3vu383rlI/RntI+edN7pufYzPFv/d0sJvu2R+/rKAe2e0fmJ4aNJm5pNTn9XoK32vVZ9sbrxE4OtuGOs/U63IELsw7yUOzIrxkzk9pY6kHIFYXi9noGSRbGW6ulK6cx0p9nK1FKiGmaoMlJ0cC0ngqANlfUUfMF2qRrqv0l1Ns/sGb/hdO26rTTh2XXtDavvg4Hb8GI7sTuzoXnxObzqya/eRH6w/44z1Qzt2YP/Rlf6j0kGKb5h7A/HjK3QKpQiG040pL1bHlJf1UqyRB0cWuNCROFjuVixX/Hk8dEiCUYR7w2VdeD1C3hbVlx/aG0V7OVcxjBOzcnyD/Kz1bCKvcaxVPTS1kkEuZT5Hn2my9gg2Pu1C3s+WTc+gx/XZih888rCYj17keSW//iuZKhMYuY/PLZMJuPKwpt9z49RUZZ1TK7v2dfLWaFQUw1UUw3GNVi/VW1FdGBkgJgqV6ApKMXl8gJk0tUopAkxVjoFLxw/NHjr0FP/LU4dIVAuOf2Nq6hsY14Bhf69SrLGIa/iNiHdQZDDSXVXlfxZ+Cp6Sn8LLIj6QbUO9PcVf+1eLtxaRUJWa+W0RoYWPqFp48XyqXSriGnbh87dVwIRVwESF7hfp0gn2fpK9rGq+clXqoizlJHNhnrGlKWka/t4PezynZDmWHIjXtLTTmV8R4f3C2UgxMbqJbSCPY0BMxGYCi+pBfxsyQnhSa5Q1XzXGXC3Sg6xqDQjbJqlGCCWSyI6iJhJ8IgAb5aNwQJwYEmXlnauYYeNJzEomp7l2yyvhugojrNe76eTUHK+76DvouNKZrBC+exu//GVJU3xN1EuDffYB1sq+J/Dd6lXTHKRosCo+RnjSUEBqnyiw6pz1eNEMF82r1miiDCVVvGx8tcAplbHNsWYims0KO7CyshqydU5i94Kk2wrRXoquUnGtsupamfEX11KjyWuONl100cxXlDpsZirL9hU4DVaVZKNSHhOldJvDVKENYTME9OMTtCdGxZ5oFjCLtUfmpA8iLmwzQvvlCiz3LfWx+4jmvrp0Bf3FBUzNdb2BcM4Fik7fuSSX/ALeVPILeE7JfY73twoc9a+oJwFExcy5TwOGY2V5vKIGipN9vGxbXCvjmaY6rNKUKhedFEZjXpXdsUocryr2U9oGwFzXwJo5FyizYEnDKARBC/FBBnqmfVnmq1LYpXVuZnoa66lcMvfTn/50w0VYUOUiUe8MBGz2FMUPedg5eRftaGOAfLcDah7/FdCnbspSCnXh0b1Wpn9nySNbX/LIRrLx6fZYJJSAvcXxpNFhrvXNYHAQ+mXD4WFBTVBnexH/Dn8ZcON0XvJUVvsoVaPAE0UTUJkLo6SUVZLL6Qois9yyfHLfeXT4U58afpQbH310+NFHy/Fw0gLA3nw5To5ilR7kF0G7zNaX6FdV6MAbCVJ6UOQCEHbJwyW75M8VuyTlPyR+62Fh471yee72Xzgrc64Lewnuow1iH+1QdROv8i/Tc4Ru4sWEaKdaH/Tea8R7f1reF4/JDdB+LukPXz5pZoPs+N3eB73S/PHfeZfwa9Z7nlc6lPu8lx/K3erFIANvChqOf937ffg5d7UXUPCIt8SrJEFu+zLlNXj1L/iuaWU+u+DwIvnPTgGdX8s/lp3Cn1yrCO9apeYKjztjPTH+YvHF2deKX+BflC48+YAUnfpr4pOQx8IazTR3c2LuNrIK3QXhjmRJd1FVJ+JXVXUiqP6UuJ90WpcpPNlGtot/+39DPsVvP7zhYfh/RT7FEt9PvExF3hQ95iKQa1aJC7Z5UYer87rfSFxwlaNVlVvtacQFy5TiwaAn0c+nL8UF60txwfrlccEVrJSTp7lcmX//DcYFezal05vw46TA4GBTKNjcHAw1SV/d1IU/dG0q/h7ONm+Gs5/iD3hD8ZWmYKi5ORRs4v8hbtpU3IDcBv8P+uvm5uJ5SnuX+q38EFK+cW2AueTdwrf0CVybS1mlP4Gz5B/yq60KTYV9iLQM9uH9rIKmCj0l0sh5QSMNwrda2L1vIVtRAHZDI/tqvt4Zh7VrdGKGGXcAdRmagE3TujJuJtdAyaxzicY4+cg1JJRUdbECchsRUtxhIepoamWC1Spv6tKyNyCxgcUeNUScKeeIc9apmc+ajegZgikJ9LD8xkV4U4TkzmDKm3siCDQqasuGiQ9EF4w1HA30ctqDDCEIafzMLX1n13UnEul0ItHdokZnpS76zn5kDF/Z8orcdPYXKTwbPra6Oht88sXXKH/tyfuEv4DcCnx4kr3Ij9KMfrIC5xIekLH1GmX+Sd4ReKNKlqM8eWQL+JyoFxMt8fNCTmSvBkq2dMBxRqW2a4C9V7Hs1aE3wCpV28yFlYXbSCZPrlawtyp8p5QszyZUDoxTcj3ZJlILpbI6A9nEZKEts/GSI1+ZK6kuRfmemYGBmSuuKFej5G3FJ/kSKkLfXFGUkil5uT7Gt5Le3sR253WU42gN/f2qObJWrVsZJ+8VBC7i3U+RrguV/h8gxX/Jpwbpw2ZBHzasXs/kF16xPq1Ls3yBcsa9678vZ9yaCePyFslE6l0H6Ynoa0XmuMhpZo675L+SOa4sE1P+rbJMDOt5NdvL71Hy5V5cka8XKZpBVfiJxOkaplNz56LNO18j6UWqa2mZFVmYkMtJfOW1kvhevUoS35L+gurLbCzpL0q2ubeXbHM/e6nCP0haKPkHzXeW+YF+sa/DeP+g8pz+pW38cukwtJ9HtPR89oMVsH22gGoB4acP21XV4UqALlMdCP0pEsKV4RrgdGDpQ+yL7IDIqeJYER/heJ2cKlqRU0W3Zk6VgRGHD7UXtcaeg5fLPjflG4lZdrFl8cyH8j7CYkbHKvHMwBn51M3xvySqWeDmVyU74WahExpl/0BrS3PKPwFz6mc7q7LE3LQsS4xSqcco8is7Uq8zu7ilvaggWjbJcgWTMzCiJnvpKTlwVs08f6qkSCrVjSK+omxnKemXGNC1l9gdTNUwYf6eP7F384tPP39Pu/q26v3/X8uXLS9zG1krX/Y9a+bLHuZGkDU3r+GzMMzv4kbCD6qeDeg7y5XmQcDuOygWzcO+lNc60Y/S5QROWHHXYaQTE+ohtSplaf/i1hZcPVddzEsVVlylkk2KRF5lHqqy9KrK2moFmkZk6pMYGZyEXzTMGcrtQo9gpy2A6bNRgHK5VGodU62YPY/yvcVHZvv6ZvleOvYe+coi/9ux6+HfWPGMxXIeGcJ3Vf6TQsYleKqqDydkU09JNn35ZFkGjSGfxINFRcND/KjQ5fxM4UebQBZ5Mh8Po3TR7xh4PX40M0C6ruZCriM+SskGFZTZDZPUraLMfrjoV6dvA1xswIvutRhPwKqSyniCdIGZm3Pj3Rvw8eOpbBSugiJQKhQlZrh5nH7rtmXbgER1tFFj54Zu/BrcMC6E2FOwqafK4G2vyuDNTatysS2G9fGmsbGm+HrDgJLiefvuafNIcmL/BZvqR6R3VHC2LhdytsVd7b5woqkpGb5nsLmDMjyfMVV8Mvb/N3d9MW1VYfycS//QXkrb29Lyp4UVVqh0UEFIgSDokEYFBiYzmkWUGY2OZLrNhTB0yWL0wZjsRR/EBM1MDLwY6a1xiVnM9MXogyGLL7pkukxjfEEfME4Th+f7zj3n3ksvyLKZ+ELbW9r03nvuPd/5fv8CifH9QxPQHiP72J/PWV1TS46WajQnlUTEVEk4VCyi24V0TIu+gZr6BsXQN1BT38AmsxQbn04ahfNUvTF7ITfS39d7CAyFDz41fleh4Pq5/8n+zsGe1NSe7OOT+08OwzXbvFmgZ9mcmyOD5GIpD7++lICUcejVsvUjuwfVVOZ5QLS+J4hQOVuxtK6ttkIJVuywSMWwmevIJEqyF8myJFnVXYdsi5yuuFUeBe3m8fZoq+wOFQcUYJUNYAFX5zYk7S1oulbsYe/dOYBDp6tngDOSWuzJ3vbx4dAEt+V+j4XlOKg2B0dS9sZTzUmPHD7i/Aesg8LWLM+/IQYOz3b9lA4i7+Axdm2qHJ3n07gqUGEVdWUi4RX+oWlNb1a5ZQIn6gVz/12669VPNG10uPu8himn3UP3aRGMP02bPRzkq1yy9nASbPtriB+mydxN+GiX0eglvuHkrV3FvbWFxXYdPjTdTqdtpXdnp23oF4O+hedwxsh8qRLWliKHc1ufK7juDWdOY+6y8XJwIkttG8hpWmHAiNewoSxyOe2CGZHRaepmRFinVTwjOEYF+i675ttJFzlXCiNrLqjl2N9GZMTEc0FuMAFgTRjCt8hqJlfOUZBQfdhTxSP4Pub2JBXHPwKHEmVa/y0MjrhhegLLzQqAk0HxoMejmMxXyz+YCRVTvg19ryeFHZOMhzv9Fzuh9oijZlCeYauJ/1Z5YYSb5l5uSLjCrpm55x41vW798UA8HTAIpk17g/tG/D8pPXOJfILSF5995pX5ww0HHozGRr3VvkhfQ4gLDtNK/d2DXffL9RvvidswTb7WfUmuda/8JXqeeXqYc3U+M68XO98TXVCF05qBPEYiLRVT18euK+/83axc4d/Vy76rjX0XYD6zRHS6KDkm+cUjEHOd5RlbustNrOtEPqR2XiFSc114jGbW1ymRHGNZv0zKHv33G9wHD8qVH1EXwnl8GuC/7HfNkJfpMv2K3ROWda9awS4M1WvQ6uia7le9MpOLzS4er2o6HemVXsnVgbkT7aYN/geBIpEtdSsUv7godJ+fe2342HMj7Z0ab1Phi8RDtHWPke1ufAIi2b1rnBcLzkl5yBmIe9u8bd8tZOcX2k+dal+Yz9I29sBeLGQXFrJGbzGvJHgv36bLgJ7jNfSm/XZX3rRoOrsbh1qMHNjBmJZrunM+ehzunB4XCLjZHec0xJvdo4L70XBwMvhE0D1d1FwbO1nPAljbhGBtCrlYGSR+ta/diiXtNW5JO9xLae+QsKRtuVdY0l4MrERnhlt2Y0kr62vsxVtwKYX0sO3fsGMPHJzZkgbVS6kC0vmsHBzdg+bfZVQcG/yOPcDdUnGoNBkVtydbkK3r0JwTFUd5fhsuDmhOCvRDeoGNrbPsTpzEKr7VJfzaJLTYaiz7icgrsykWsNTauXNpm2651Zvu92IbU62r5jMsMQox5DRSp9pJ1FpC8Z0P0/eTUZPDn4xHIyPZsanxXHfbYBWII+zlURrZz7Tlxi9Ah6YdFo9Lfp+14C2sxt4skPcwy+mREo3UlB0V+8FI77j/cpdxnlZptdGiddrJ8FtIjpD7FC8jReTT7GdZ8C/UeD1t5R6xGpssog9iM3mhFNBApRGqhUylVEjUSPUbYOZtnNf6nEjPtM23CBNtFWWgnyJcyD51Y7U+VIywPYtxbly8PmAkp1lWU857uZiMcrmkKurd+iCrd+MR6b/4dtn5YyOVsjUPob+KjC3tf5mxtU2clmP01i1mbH2xNLG0tHRm5eDi4kMrZxwztmR/CXGQjLW/xPFW1ALWwfYpY90fYXPL7zas8bQNZ+w0sMXM7cAWneDELIcTm0LFLu/G7vFD28p9G5yQfiDQwd7dY4ICA7TpGNI2HAQbxVt6wnSLTzlXMCisFiPka/RJDZMD7AhC/2SLnrWcooID0MoKFBaq6GvkrGMF4seRjv58rK42lu+rHDP9UvtEZj2vJ0/KevKHP60Y5QmJUV71WXuS0EOa4F7E5FXc7mGvLmNPntdm0wY3747NB6AuZduPcK3GshUzjUvMdH3cxmVk249yPU6tdTuuB02MgB3JIfIw/VJmFoyWYtpNZBasYd/UiC2AO8C/JxdcStZEGxujNck36et/iOdOyQX/AF5uLl4AeNqdV7uSHLcVxYqUyF0+qhQ4sKwAciLJNTu7Q0osFZmIlkpVrCUZSBRZUmR0Az2Dmh50q4Ge4ShwOXfgD3DiH3DuxIEDf4P/wqFjn3uBfszOLh/ard1GAxf3ce65F2ghxIcHz8WBiD+n+IvjA/EbvMXxO+JDcZbGV8SvxTyNr4ovxJ/S+F1xS/wjjd8TM/HvNL4mNuJ/aXxdvH+wSuNDcevgj2l8Q/zq4M9pfHM0vnXto4O/pfFtnr8iDq4e4u0P1/+Vxgfi3uFHafyO+OLwRRpfEXcO/5LGV0V92Mm/Kz44mqXxeyI7Okvja+K/R39P4+vitzf+msaH4oMb/0zjG+J3N/6TxjdH41u3f3/zII1v0/wn+afyzulsJs9Ku5LPtrWR31St0812Kh+WpWzsfBG8bIw3zdro6VdVveW5/Q1PqyAf29w4b7QsqkZ+bfwyVLX83pvZdHZ6+uDs8aMnD56Y0Nj8+Fszb0vVvEKffJXC56bxtnJyNj09Pe2VkA5SkTQcQ0OnAPvTduyOPkjrpbFhYRqpEOHc+mAamAqN0malmqWsaGX0WlyClbROPjUb+aNRpXJa4u8EeyvWnUMG5oyf7u07a+DCd9UGwWTbRQj1/ZOTzWYzXUJwmldT9/O+qRcmKyrXIyMfzhtjVsaFo9lUPltAoavcsXmZl623azNBZOsqV1lpZJm2zBvlkFSotgHxphyHSrZYhM+dDS+BML3raqUQoq9NbguLLZjfVm0jvSoNsSM3tg6RMTHoqHMigw0lfLCOoPWBkJHaeDt3hOaOrcyUlZuTGxT0VP5QtVJRcBBTYSxLiaPXPkhZN1VtmrAlpQwZ2YEm89I0uUVUjVG+coxCrhpDa2pdWS1bp9qwqJAIhKVBgcZmbQC1pkd3CE8Qn2DxknbBzMJmDFpKcWN+ai1WlNaWdqmyQ9nfR9R51dRVo4JFYJA2q8xAkKKE++xoHz7w1WaNvZ4kfVWEDTtKsSPe1kfYdSQxoC1VHQebqln6oMj8RPa0M6XJQ1M58DzpfSB9QKBuPkEw+cKuediYY6ptHoPqzoMUgd+gaqWWF3ur1sqWDCfVSA7t3tIblSmxKNvKu42WtWqCJcuqBAFYqyGgknq2V0Z4EL9yW7lR24n0bRZRZEFvyrLbgfoc5YjSuGNGVxtXVkqnyNYoLNDEza0zbB6EgM28y8eq0rbYXhjh9OhuoiCS4NCJwC9CxkReUSJ36Qv/QQ+U1ooTmDCfoPwd3AhUAlVKDUBaqcBiOYgZUGDwbg0cQGXO5l5xEFhUiFw6bGy8PD36bBrd31iUILnr2xrMiwXHPSFQE68rN8rTmPrr2FB7y+fA+Jxr4RwJVmrLijMT6QmvDBV6QLOgjkRez9WK8AU0us2xZ4OGW7WxnOsWNFTIEGwqd0ENTY/uXWSXUtLpMS9rxMUA2VVdUnNC3VCDs8ZHxVsJEnPFSqPyBW9P28ott8clTrZoI0FVWuY2dQlsR3CcNH7RKPc8UEvrRsiwRxtAwFaVzFIUvtV4RyRardSceIC5suXaT1OyaKqVLCvPbmZoZI4CAVKFpdbZz3DzbNo6Fni3QaugyFb3Tr5ZF6lFpQHyO2kLCif2bCowvVYuN3u9lUL/2KPp8CGhMlta9FLmUhZPhMYUOH64bCI/urOkgI5aoZFycdalyk1MfbFXHmMrqGJQn/usfFTQYSIXCuwHjD4wD2mKCAZ0Ayo2tfUgl+Drl8MBKT4RufhUSHEHl8AZfiUugKWwYoXRM7EVtTAYfSMq0QontGgwN8XMQ0iVeDaQnYuFCMLzm8HT4LnGfw3Jr7Czxp5B7k0sPMUbST6GXI51x1o1ZgqsNHh+zZaWkCL9UnzPEjNYnCGSU/EAVh6LR+IJRk+wEtiDXByLb/E2h61SKMz9Mv/kL/bwOaPjsavCHsken/LvviedH50Xuz4cJx/OexDt71qPtsc4SPynjBk8A6wZ9lmlHM55NfBsjIr2KYwM/CHclpir+j0XrxZvySvyyTG2Bh8TUvyIp+I8OfYhPk+S3Wrkd570xOgo8ukb2DtjaULhO8xvUmYyrBD6AXvuw9oJVuh3iqiixinbm0LPz28U1QvMZpwXdwFnqJbmjDOhZ1jmiHlBOhfJQ8e7j7H+EntL6CcOUZVNUs7WkMiBUYZV0lqeszLnHLlUqdFryznWe3VMrJFsw/Dbgp+7cXjOgRuta7xT/mMWPaOR463gnOhefsv4NCyj2Nuud+TMxxoaxz1mnOmxnxO2TTGUCQfLnpnUh0LPGcnc9LzX9dy8PK4MMyW/z3s0zvrsS/EDR0Dau8xFbYptXqy3q7hudT+TEpE3XK8UQWDuRE8HlnXxRJ9IB8nmrNskFBXGZHPgQs5Vafp9itliWVPLki37VaWKMAmz2AVoLmOJ2LWm4Oednp8mWY5s8ay9GUWz4N0D03armCR/wl6b9lAX0SxtUwzlHpc96jLmOmctNf9XvCdmLOqmesrYqu5XOvQHRPezH/mruaaiXd/r9JyRgH4wINrlPea37fGrej1DJ46spZ5W78xsWP+S8VZ99JPe7rgGDGc158yQVOznu/4+YF9DyijFPkmZyTkj69EsxXHcn9vDfEgdw6dOEUZr0Suq9uVbYUvMow5RjtjZnSN58t0zY+Jad5p2vSjjqriLOc0MU1wpto+Z+BI7wOCr6Rm16/0QX7nDnph/WtlyZhSeE8azZb8GLg4aPWel3LPRJOsX1VFXjZdHo/lcctyLVM/ioePHEyt2E8entuNu1PSxUIeIceZ79bHCU3N/3r5FDqn6757rgrESXLoTxf7Vccbs9KuuIl/VfSP+sXvEU2s1qsBdnk/S6e8SGqE/BapzVROZtOJMD9ry1DFDOsEiduvEh9iVh9p8/cnRMWvR6+tOnSGyy3YTsp8xsgP6G66VcoQusbBOPW98wg33hNDfxGvWfXE9Xdb11zs31P2YX82Mz0fnwqs7wYrravA4G50iusfK9Cd6SDeL7o7UYT1nfnT8jazR0JMnO5t0w6042iGOmu8gOXdvn/pQkfB8s3OI4r33xvF2VXLeH6rQOuVrYBBpqVlbRCOeN90NzvZnUjHqVLET6xEnDNf9YmR911rJ+7rb4zJ9s43j2GUVzQ59u7tLROttOkEGjnUrOp3ulJHulnZ+Lk9si7cBk6Ik1CcjTBzfdHRajznRnH+6iXX9IMrRzWo493elyMeGb6uSe6sfoZmlG5nrMxI5VXDeooV9meHm2XB9jk/w8xY0dxfVx3V+vcONdI67VndqxM7vWKLoszO+Z9uew2vWljNbX3dv7bL+MftCN53hS0LxHa5kDLY7fSnb+UYgrUX6+hlOm3H/OP9dUiQ/aq5vvXNy1nwy56Mvo9d34Bj7ZbHEszh2/eE+K8Uj1rpN+Cz4nkLykY2+l/Ujqa6D5cl6PGN3b+uB6zL21y8v+oL8P/lzduAAAHjabVUHcCTFFX1PYVYbpNOJnHMGwSVy0kmLTndCAgXEHeGY3e3dHWl2Zm+CVhI552SCEzkaMJkDDPgIJmeMYznncs4uuxzwTPfu7LjKU7Xb3dPd/7///vt/0AL5fLIRS/F/Hm4Kfi1oQSt+gp/iZ/g1foPf4nf4FX6OX+Av+Cv+iL/hz/gTfo8/4MdoQzs0JNCBJFJII4NOdGERurEYPdgMm2MLbImtsDW2wbbYDttjB+yInbAzdsGu2A27Yw/sib2wN/bBvtgP++MA9OJAHIQlAcJlWI4VOBiH4FAchsNxBI7EUTgax+BY9GEl+jGALI7DIFZhCKuxBsM4HiMYxQk4EWMYxwQmcRKmcDLWYh1Owak4DadjPc6AjhzyKECgiBLKMDCNGZiowIKNKjbAgQsPPmZRwxzmsYAzcRbOxjk4F+fhfFyAC3ERLsYluBSX4XJcgStxFa7GNbgW1+F63IAbcRNuxq24DXfgTtyFu3Ef7scDeBAP4WE8gkfxGB7HE3gST2EjnsYzeBbP4Xm8wFZswot4CS/jFbbhVbyG1/EG3sRbeBvv4F28h/fxAT7ER/gYX8PX8Q18E9/Ct9mO7+C7+B6+jx/gh/gRfkmNCXYwyRTTzLCTXVzEbi5mDzfj5tyC4JbciltzG27L7bg9d+CO3Ik749/chbtyN+7OPbgn9+Le3If7cj/uzwPYywN5EJdwKZfh71zOFTyYh/BQHsbDeQSP5FE8msfwWPZxJfs5wCyP4yBXcYiruQb/5DCP5whHeQJP5BjHOcFJnsQpnsy1XMdTeCpP4+lczzOoM8c8CxQsssQyDU5zhiYrtGizyg106NKjz1nWOMd5LvBMnsWzeQ7P5Xk8nxfgP7yQF/FiXsJLeRk+4eX4B6/glbyKV/MaXsvreD0/xRt4I2/izfw0P8PP8nP8PG/hrbyNt/MO3sm7eDfv4b28j/fzC3yAD/IhfpEP8xE+ysf4OJ/gk3yKG/k0n+Gz/BKf4/N8gV/mJr7Il/gyX+FX+Cpf4+t8g2/yLb7Nd/gu3+P7/AD/4of8iF/lx+29lm+abVnfsbuqwjHsQl5YnnBEQavoece2knk9+O/N69Wknvc9Ec4yBSM44RpuuOhwDKsk9z3DLMj9ZMnRZ+WsK284eb9SNMVcuEyvaq4TvmUsXbKivz6urI/Z+jig2TlHzAptrTSWmcnblYqu50N46dg8WbBNU3d6Ta9DGKWyF0y69GrVsefEBl83g2VCV5EkJu2SbYmZuoNl9XF5Zk3M3KKco+dnhGeKohciTuUCeoScdhTs4LXrTifzthlQ4um5TCmORM4937E0IaF3TpZ9q6Q7fsXUfa87vpCm+wOD6mpnNAs3tDHJebLq50zDLYtC23Cwn8pGh7Q+aT8p/yXhblXPixBRYkE4dhB0SlQKuluW5oZl4lKDzfsBDcGZzqruCKsRqVaQXjMq3+OmPavPdHhlR4RH05btNfjsaExSRmQxVXKEHsgmpDuraE7lo932yVAjXdKdI5MUhi+sBsKkazaw6nIvMxPYC6DpVsHIa6bEr81LISR8lc1WYZXa/dBudz1lkeWekm+YbrBjRq/SpabwUkMRsLQbYDZD/QYh5ptHAi4cW/cStvIVZj4nTLvWFboSkdWMFUt/omj7YfytWauUkKkMpSck9kTRmJWMj8ZFoLnGXChXMZc39UrBrlkqXSoPEzHbmZG4I0Oh0moqr+X5alnIq20TOd3RhmQdapNSHem1scBVgYcy0aZUVY3F7QaXQyuJPpXA1uL6Ynp1jBRPATNjd9rMgBpNV5XqSDxtXgjCkCASVdN3pSYU5JQaVPqbWRiV+Ze3O+04Q+nBmPtxFe5C8165uZsZj6HqcAM4lsypKBhBe+jVTU9bp2Q0IqPQXLnKhAArhiVRaqMyjrAPemXbdwP1hW8dFbYXc5DqC4WnUtuXVXYX1DAhT6ftZkiZ4Thh5YCdxaFATVGxozajjano/Xj0yaJpB35CDJOSzkzYfhrVl6w1unB6PtZV++riGJA4WozpnshZpFvVqaQOBqTQW4ZWd7qiYkSNTbNUC5pq+Oj5349DaGVRveajvhDxOKWEsCoUQlbRLRQt47F8mvJVSo+o1LyaLYtG6a9TFluDobTbvNq9wReuZ9hWo2bS0zEGRL3NT9aZ8BV3biwLnbmgY0RNJ+PEqyDkOEQh6teHVB1VfNMzquZ8sJUZjJ8PP51h0Fl5LmEZsrcm/DqK0frHZ0ittRGlGqO+nJc61Syl7XXNhhrwXW8ii6N2FqnFUAXnyyFValbEVIyHIeU53R/jvCbLPl1rvkoWjFmjEEL+L3CouWUAAQAEAAgACgAVAAUAYAAP//8ACnja1ZwJfFTV9cfPmUkyyWRCyAKIQQhIhpAAQRBQwQUUUAgguNS6oOJSaynutna11raIttXWakUptmJbscWVigu2UBQrSAsUaqF8oPxF/tKUgEmnpBje/3vPvJm8hISgkvbfnM+buXPfXc492+/c+2YiKiJRuVnelNAZ46rPlU4zL795lvSQDOrF8yTEW5b7PPrCsaUSP33auaUyeNqUSaVy0rnTJpbKGX4rlYhfCkm2XwpLjl/KYI5kKVNyJXbF9TddLxMO/fqZq26cJWcf+hXeHP/uVRk7S3raZ4UDZcZMq3cUtnWEJBq7h081trobcpdHP9B1oeJQRei00ITQuaE7Qo/GRoU2hYvD08N3htdkdM64OmNBZijzS5mLMvdlHsgqzqqIZWVdlvW92MzYzOhg95pVEzkld3Xk+diE7K7RD3KX5x6duzz7yuxZ2ffGsqCZ2Quz387JyinNOT/nmpwbc+7NeT1nj7sT7QR9EC2Gh4poRbJtiqgfHD2fNrfHYtG50Tdyl1O3O3d1bKa7oh/EJsSymGeUq6e0mr4ToFhsVKyQmlE2yihqZrLWG1hrBD3kShfpLkejyZ5SKn2kTOLST8qlv1RIpQyQgTJIqmSIDJXjZbiMkBNklJwip8poOR0dj5PxMkGqZZJMlilyoVwsM+RTMlNmyS1yq9wm35I58kOZK4/I4/Jz+aUskqfkeVksr8irskx+Kyuxr1Xylvxe1sl6+aNskFr5B4oJaYEerSXaT8u1QofqGD1Dx+pZOkGrdbJO1Wl6rp6n1+pNeqveoXfrd/V+fVDn6gJdqL/QX+oifUGXSGfp5SWk1NsvZd5WGeY1soKwVHu1Mtmrg8uwzKJursRkHlYx39ulIemqZV6N9qNcTn0mvWvpuYW7CXmZ1ku5MqWf1yDl3g7pT20F5YHe37GiCkatQqoh7jVIFVeuxL0aWq/n3rtSaS3fkUH0qvLehJPfwcl+mem9DSd19HTjVngbZYC3F8lHaNWIZCO0qJFOjNWAborRThj9hGm5GB2Fab2G1oWMW4cuIoxZK1d7B1hhMeM20DMXDsq87zBCnd87Qu+3/d6b6d2D3g30DtNzK/PV0XMrY5ZSW8Z45d4+Vtvor7bel2ZEHuDeXOaZ7+2RJ5DMQurqvAYkWYAkG5FkLZJ0ltYFjkoZ13E+hFGGev+kd73MZaR5tAwhiUJaNUoPrjJalTNef3zWzVnJ+wBaDEz33k9vtMf8T6C9hZLnRtB+kq/lzNSZuQ7AeYOvK+SKXtx6B3FV2Qh1rCDEKO+xgrDjQd7nvc64bsAvetGi1FvJCDX++g/gESHWX8soTjs7kMMqRokyylJ5kN7JkdYij1XyBFpc6G2X9+G1Djk4bvKRdIhRGxl1f5qvQay0ihmG8Tkp1RRPdYywH2mG1OmtG76aZyP0oncp9lNmIzn91NlIA73djORsdg0jZTLSSkbKY6RaeNoATw2M+L6vozA8ITPvgI3eE+lvZY6odMcmenjrpBe8lEoBsyz2bSfk2846tPEntBHDbvahkQ3Ic70c7+2S4d7r8qCblWse9+czwuPearTUFS0VOhmjqVVaJhFmfhZtbaGVswy3lgr4GMh7Fetz3uos5EFmnY8sn+DdtMN7odlTdzypByvuZbre4FvoLnhzVnpAhsHrcEZ+kCvp442MUgwfxU4rzL+RWDgw4NO1jFFLzWbzvUxftm9T+x61b5rl5BEjna/Wp2NAJTIYYJz/Pm1f1fSazP2Z3J/l7WSNPVw8gfcyaoZjz9W0mgmXcxltnq0xYTrpxxrLud8VXYRY31700J2emfRcy5pirKkBP62ndwNj18hs7t9F+znMMQ/+5kshI+Uh43xG+7OO4/1C6aEPE9+eR3bFjIptY41l3jJGzGfEXfBDtGElV/Oeio53of05zDgXfcxjlvnG3xuMGGHEPEYsYMSwHCMxevahVV+Lt3tlBPydZrG2Xs7m3i2838r1mLdJnmXU52j3PJ8Xc73G57d4/71XrwVceIoiQz2Rayqfz8F7rvH26U2Ub/Y26R28P8OYRxHZNrGWd1hLhFnXsJYwa9nEGrYhnfdYwzak0411FJt05tLmEWcNrG2+FGOJm1nPCqxwM2sqZE0lep33LusqZl3dpYjRE0k/MK9Ccy6yMvJs/OUuZD2Hkeei63nUzUcqIW8tFhpmxBpGjDJiMaPlMVqxef4B9Pwu2jW9ortS6suIEilbtXgIx2RXaNfir60pYbFuPj1ywe6wXMA1netyrhlcCebEe/Q8rvO5ruS6n/pcQ/oLuKZzXc41gysBpxVc53Gdz3Ul1/3UZ4mzvP7YWgUzVfI+wLBsr1l9MVa/Hav/E1a/23y10mJiPpa/xjymmvfJSGMm5Vnwm5GMw4zjbNWhRMg8ZyCWHLH4l0SyPcxTRzzJ89Gxzs2HR/cjxjkk7o+FVDB2Jb0GYKuDjKslzPekj5AbyTqK8fG4xdUEHDosbTTUHcDngazBxdhqfHKyoW0ST6Pi8Ck5/gZaboeL3kSFXOIS/u+4NInEmDvGvXzuXYZ+crCAYiwgjAXkyQKk9QusMukXhWg8jMZjjh9G7gfWlWOVLookJZYNP6/By2Z4WSs7TfJxHxUqsNkk1kUtDrosYrevkzfgIsTdtdwtNsSv8nF7snnmA/AVN8nWM1sNPf5G60Zm20Jrp59dzLjTZO4+Jfh0gPaziR5JX+/JGvLMD5K+nQ+vs5ntLux9jpRzt4S7A/Q6yaRFT1oci7wy4KYXeWEp/J1DvngBn6dzXYpsLuO6nPIMrpu49y0+z+ZKeo+LVkPkZdb3CtdSrle5EnhNGD4qeHf8nMf7+Vwu5lzJ+5283+971iLzrjzkMtu0ESHjyfJWoME3JQ/7uZ3ybClhvs7c7W3jfcJbwlg98fWt+pC3knE6M0ZXdLsAmaJ91hT1NbIGfkqS1k6LZJz/O3G+ANmvR4bLqLkMTw9zPUyvbGbezYy9/Zjclxkd5739+FuCJh2nd8HpHLMXZytg/HEH3A5k6F9GzkGGk9gZJdAUiODVMp7bN4XpEUZnId7zmMfpJoL+MyWEFv+Nf95279nApxpewskLuxO30wMP6r23PfIMaDWyyuNOVPK9RlfXgZxt9B5zezqbN4HcXN0uZOakuNPNL9lejbcMbpCn92u73wh/xXxq6FCZvYeluN3wO1CtSasADRZTyuTV5V3sTZFlJhSmjc99un9jh3H2B+9xZOKv3lvrbUW/64ji4q33VnibvVV8Xo/MtiDD98jvXKttzhrhcRvo27G2hhSSvPEagZu18JOAtnsrsabN6NZJFc7SPfag+z3Ud7QX7GWeF9CqEDOa5t7TVLbXneBKsNdOPKDR2wQedQxXS73bTF559qk+fSMC8qXa7DCenVc+FOjazTtg+W3HRY1NduKz2FveYvWRdCnbWsIHSNy8dwt/OKKcbWH/lofXbcGe252FnU3Lmg6LHPjlWjJ28V7CE3c2uxVOl6IpLpo0nIwXeEVdh3G2w3sJC3L2torsq73W6w+qqevYaCv/NX++9URMp3ntRXqiR6Ij7A1L20dc2kGkr289dpI9N+MtVfYtbX/6U3GHSGn/R4vo/97MKO2VkdSnlrrCSxubfWroWE84SBLhYMxI5ybwQL4WjB8bsLM1fnRMdBRapfPH5vaUk/aLSJO1dVwG1OpfyNmcP3e94ZLT5lstpJnfQpKJJILBdySAakdaYo0paTTJpD3pdBRGNWmpdV6c18Jtorn3OrtvhvsifY84Z3UtZmj7LyL/nX/hIzpapts/cS3wFgRHDlqOxYFMdlTvOOwPZHb7ySVXuD2D/3fskV4n/hbzniTfbj8KFB5kCVs7dm/XLJLu8F5PygF57GBv5SLr0+kG+SY3d0bRbAeWjHggZ/7B3B/Bv7y0PCN2nmCY7vPwT1+TQQzYlsrcmnY1R0BG67xF3i6fD38P7mc2r6fLlLzV1NR6i30JJVtsRLbhDtPeKu9RdLYvKZt2Wy/pYH88fO+PpHKkg/ZMjc0yxwbfD0IdmH8XEu0bUjv29PwFAV5bibYdfYrwsf9O7cCYsa9pp04OXudj5j78JJUR1frem/fvXbRl9olkROC9xucsIZEWUdidQsq/OT8TOwVN7TWK8YZo8mSjRQ4SabN35pHNYb3feavMtwqIou+QTSfstHOrRdUGO2FMpHJd6paRYe+mPgxm1LZyJtfAznofu7Id3nJvIa0WNvX9EHlinXuO6Tyy6TwtMFvELCpbQn4+GTVpZRsytJFvW23TLids2m9knPyPs7ezbwfVu3jhx7BI8ryPdTeaf0T8PDvyoTLZCH3zmmfohyEzd84SRnJ7k5HSvicUsvzIyafAzt6lZcbrR7zGNjw8bOeUFvvMq+p5NSmbdg7Lc+iz9TCzXj/v/giaaLbP+zAnbti4H/ctgm30XsLCG8gU95AHJcjAdkqOndpuCnAawr53t8Wt955k0H6V95KV3am437fFSVh7nG2znDaZg+V5a8krVsLXfjj7I3f+jna62+53o+nYaegJ7w1m3mun4TsOGm8xXM/Fa9d4v4Yeg6+HyFciKas4vP0EY6y3jHub91dvr1lAIZZV6J8CFbinJdjGdv+pz/bkOQHeEW57v0eECKGBQqiAfDnKuDXuuQa2vJtPH0Jq9A7RK3l67HywxkUNZFaXjPTw0TJ6RlO23dqZSyoTwALeD+ShHzJjYhR3ruee7uyFj1DA0kOpHbrxFQrmQhZVGg+1f7XvekTTnpxI9qX2sPeFxP5vOztLW8gaovtzeMAuovjT7Fqew46X8urel5HzEgnwC+Im8X2F95s2Rt3M/T/gSUtpvR8/KLZnSKCtt4TalRYTVrTDWW3T84dDSKGmWaYhh3uq8HGiBh70YiCCvmNPdWotw9jlMBGbS3g7sfx6q9/h8wdmsf7agzEzbQ15tK/DW1x8fVe6JZ8Q2ai1SU7b6hvYB8x3XplG6nWmtZVwtBJtLkOTa3ldRpTY4m3yXrRWm7x/oZk63je0Map7orYGba8yj1yJNlPx7BVG2pA8azsMue1uOqGyXGMzttZoWL/JsvxGKbJcI/hUKmjVreCTPS3dQtR2GUo+vWuCpwJH/iw3sEOpb++823/f4e/k93/MU6qG4MlUcBbDr9p2zsz6HsrTWqnb6GSLpve7+Niq7A/7lOqjrfwQEWu/vy+Ltjt/KJ1DhZqdJGSmI3nyfol9y+lQNtOUi3X1NdDFrw8fphz8nSSetO4w2he2Eh8OlkXLvCrWDMkDZ9AgcoONELM1xlpkQEtt97sBD/9L2+v3kXDzQXlna5xtb1N/m5utJpSMQfbsdEdLuRBbVxEV6wyRtrcmTb9k3+AInOIl0THRqmWvay1Dtde1Tf7qY/H71OWz89hm9lIYjIneYmSWsOi6vV2bXXNY2ny77bjewrtD3j9pTWZE3HU7yR6H3FtE0tLKC2QuGf6TsdSJx37nV634amYgjkWSWalh4D4/KuS1bgHtysT1yWl2qp4sbccSknlPP6uqsu+KHRzTqqTcndYyTrl/1/0KQGQEfY/3Y/QeolTX/9zhS/ocJLlXePcjjkGMwQOWtnn2b09gW3vO6PLf9qwpaI+pXLepzvsb+B6ycrh53oueXnd7Z2LG2vafWidPadv1gHaiRvPsG+/ONNtLxuC8wHnhX7HKfWQ8Twc5a/YdkYL0OcPu5jyR17aymtay1STCJ3lOyzlM/994q3nfZScojUGUIgt4ncyn0X37pmUcPayoUduuZIJ3VrY8UyWevS7ZRNVNIHtj2+cLvh3s8D0ykZZf1zSOJteUc+jn/kmr8SNqxPeAvECG8nGeX7WV0dxgr5fIta08zx8ZKJ+fLlVzzUr3PJy/ke6XYh8xc2xoenZx6F1JyrKOSP4U9TEg5D/HcbvRutQprl9K+Lvk1jDAdqemyaghpdPrn/GxhI8B+w4TA4olh3VlO0QP2h94kmjmV5nuu3wpxGUfs44W9VZ7UERz32RrA+UjzZ4yYP3ecpe5u284s5a8/8DZbxt7BXxzl/dn2+ttSZ1f/7/gbIWdYEYs0wwftLs4Sjp569Hmo96jfhRutvdpsj72aBuavlviIgGjRL230jvJ9JmF9/M2I2E08OpOhxaDPPvtpDQHbcbMcjP954PLvB9YVhdzuxfvb4GT1a0BBFtnu+2wtzCwrqhlH3mt5lEH/7XyvNnyyHwi7NrWdj/es943icANyYw6kMGHm+K9tx7ONtm+7udNEcFsxJ2HJQ7aV4XbRKeGJnTy9rKH388q3P7dneDtalVXTTlxJDWH+UzKUt9OZzXJOOV+gdnq2Zm/b63BSpJ3I7RNYmydH9neOkLPtyPNI62PX/6znbbjZ1pj9hTP+x+sqcGXZ+ijRAY/i2rwzyYS6VOK99IyS46ff+inDrTqlo5N3YM9GWtnB3t8e9/HOdCMn5ojO1+TvppyQV9m7TxFtG/Dp6yhWzN97PuIzxTqA6+Hfr6ZceiTTEOahlY4q21/79iWzFK5PTa7Iy23mOXqwac7jeknU63jTp3/DLDBouae9MoSh3l+FpIp/mlKscN2MsSuRLaj3G/c7NfZMaLDce6XenKy9JbTZIz0l7EyVQbIedCJ8gn5pJwkF8l07l8OjZYryMPGyC3yeVp9Qb5Jq7vlfpkhD0AzZS70WXkEmiU/gq6Tx2SBXC9PyiK5UZ6RZXKrrJDX5FvyO1kld8lbslbukY2yWe6TndCDUi8J+aHsgx6WD6RRHnG/3JYfaYZmyI81S7PkJ5qtOfKY5mquPK55WiA/1S56lDzpft0tT2kf7SvPaFz7y/NaqQNkiQ7SQfKSDtYh8rIO0xHyqp6kJ8kyPUVPkeV6mp4mv3W/BpcVOl7PkpU6UavlTZ2sU2S1TtVzZY1+Qi+QdXqxXix/1Ol6lWzQa/TTskU/o5+RrfpZ/axs0+v0S/JX/Yp+RWr1dv267NFv6DekXmfrbPmHztF7JKHf1e9Kg96nP5B/ud+Wi6eP6HwN64+hiD4GZetPoRz9ORTVhfok63xan2Gdz0H5ulhf0M76or6iRRLS8Zb7DZQsaJI9BzxOsqGp6DrHnl3nos8YNMQ8dJp0kiLfGsZLFzslczZRgeV3s4zhKDmTmFbiTi2gLDkGOhNL6el+uwwJFuN+F9kbGi99oHHs84/FVvpC49jll9EvDh0r/fxflpfTrz/Uk3kqiAOVUGdsbADzDISOlkFQnjtLgLvBrGEE/A5jruH2m9YRUF85ARLmOZEZToIqyfNHMs8oSLHPk5ntFPtGxWlQObY6mjnHQBX2fwUESYyl1zgoBO/jKZ8JDZCzoIEyARokE6Eq9hzVRI1J0GCZDGXiR1Pg62xoCNKdKscjy3MZ0/lJKbsVt1/5BDRULoDG4jefhPcLIcF/LoLTi6FR7HwugdPp0BlyqVzGXedXY/CgGZSvkCupv0quZoRPQd3kGqhaPg1NYs90Lbx8BpqCr81EA5+FzsbXZqGH66Cp+Nr1cHYDdDwedzNjuv+a0Fc+B5XhtZ9HYrdBgvd+AQl8EaqSL8nX4PwOaLh8Ha8eaf9lQfDtu+HnHrkXfu7Dz6fIDyAxb4/hre53Hs7no3jrw5Sd5xfKPEjM/0+Q+fITyo9BcSLBAmZ8XFw+9yQ0Un4BjZVfQkcRIRZhnU+Je6L6DHSKPAudJs9B4+w/PPSVX0GV8gIUlyXQSHlRXsIiXoYmyCvQRFkKTZBXoYnya2i8/AaaSuxZhgaXy28ZfwV0CnHoNcZ/Xd6g5nfQifafI86S1ZAQm95ixjVQXH4P9ZU/EK3isk7cM5WN4v7TwZ+JXFXyF3E7Zxe/KuV/xWVP9dBY+Qd0HPEsgX7/Ke6MxcW14dIgLuZ/AA0lwjUywgHxkv9YRPorfzJMQ0S9XCIDcd9iX5lmKjHfIuDJxApyKmJFtowkVuRIFbGCjNViYpnGlGybiJEnA7STdpITiBv5UkHc6CxxLSBi9tVCZf9N3OwiJ2lXJQJoN2JoP+2uZDRE0qOlq5YQT0/XHtqbmj7ah77H6rEyXPsSYau0TMuoj2ucEfppPzlGy7VccrQ/kXeMVmgFdyu1UqbqAKLwFB2oA6lxsXiKVmkV5cE6WEbrcXqcDNQhROeTdageT/0wHcYskFTqCOL1WD1BT6TeRe0zdKSeTNnF7pF6quLvFsErdbSOpjxGx0i+nq6ns6IziOmDdKyOo348sfJsPVPPhNuziPKDdIJOoH6i4u9aTcQ/TifpJGom62QZrFOI/gP0bD2bmqk6FYlN02kySs/Rc6RczwUVJut5iteDDXi9XgBCVOsn9SJqHE7E9RK9hPJ0nQ6fl+qlcHiZXsZaLtfLkfMMncGqr9ArZJpeqXi9XgWuDNSr9VP0ukavkSH6aTBmuF6r11LjkGaSztSZlB3eVOosnUX5Or2Oea/X69H7DXoDXN2oNyLJm/QmeL5Zb4aTW/QWZrlVb2XVn9PPwcPn9fPI5za9jXm/oF+QU/WL+kXW+yUwbIp+Wb/MyA7JqvSr+lXKt+vtSO9r+jW0eYfewchfB+Eq9U69k7sO50brN/VblB3aletdehflOTqH8e/Wu5HnPeDfSfpt/Q71DgUH6716L+X79D44/J5+Dyl9X7+PBO7X+7G6H4CRQ/UBfYA2D+qDlH+oP8QvHtKHkMNcsLO7PqzEHBD0EfrO03lw+yP9EfzP1/m0eVQf5S7Iinx+okQhh6+0XKCPUwZl0cLP9GeUwVp4eEKfoLxQFzLCk/okq/uFPkXN0/o0q3hGn0Ejz+qz1IDESOx5fZ7yYl1M+1/pr5D5C/oC61qiS6h/UV+Eh5f0JfTysr5ClA5haRlQtWF2hmF2F8PsLMPsbobZcfvF5gRwOxcsdMgdMeQuJTZ2BtUKiK/9uVMEqjkU78sY7gzd4fcow+8y+9877qlZCRjsUHyAoXiZobgYig83FB9oKN7XULzYUDzXULzYUPwkQ/FxhuKjDcXHGoqfYSh+qqH4eEPx0w3FxxiKn2UofpqheA5Y6c76h0HHGZafaFiuhuVxw/Iw84yi7PA7bPgdN/w+ijnPoOwwO2yYHTfMDhtmxw2zMwyzMw2z+xhmVxpm9zbMPsEwO8swO0L8nwYn50Ddwe0UWmcbWleD1RchUYfQeYbQnQyhq0HoSxn7MqgfKD2DGofQJSD0VbS/GjrFcLrIcLrEcLqL4XRPw+lehtPDDKe7Gk6PNJzuZjhdCkrfCCc3Qd3B6hRaq6F1GKy+jZU6nA4bTvcxnM4Gpb/JjA6hJxpClxhCFxlC9wKfU6hcFUDlkw2VhxgqR0Hl+Wjm0TQ2hwybwwFszjZsLgKZU3icb3hcYHhcbHisoPEL9HJIXGRInGtI3MOQ+BhD4h6GxMcYEvc1JO5mSJwVQOJ8Q+ICkHgl8n8jjce5hsdieHys4bEG8FjB4w2UHRKHDYn7BJD4TJDYPTuoheKyB+ove6FyeT+N0EWG0FmG0NUBhC4KIHS2IXQfEPoAfT2ownA6bjgthtODDaf7GU6HAzjdKYDTRYbTfQI4HQ7gdNxwOgpOpxBaAwgdM4SOG0KHQWi827C56CBsLjJs7mPYPMKwOWbYPNSweZBhc4lhc7VhczfD5l6GzSWGzb0Mm482bC40bM4wbO4ENg9lluN9hB7BXCcoGbmeCDYfbdhcAjaPpGaU4tF6chqnswM4HQanx1B2CB03hM4EocdSHgdOTzSc7mo4HTOczjScjhtO9zGczgrgdG/D6XgAp9VwWgynjzKc7mk4XW04nW04XQJOf5I2F+qFzHhRq5hdZJgdNswuMswOG2ZnGGaXGmZXG2ZnBDA7YphdZJgdN8zuEsDscACzSwyzw4bZPQ2zOxlmq2F2yDC71DA70zC7yDA7bpgthtmdDbPjhtm9ApjdJ4DZXQ2zuxlmq2F23DB7omF2YQCz4wHMLjHM7m2YHQtgdu+DMLvIMDvDMLvaMDs7gNnZhtlimN3FMFsMs/sZZhcZZvcxzO5lmN0lgNklAcwuArMXMOPjaeQOt4HcvQy5w+7/tVG/SBex0qfSKF5iKB4JoHhnQ/GJhuK9DMU7GYr3NhSPG4p3MRQPG4p3/T/Irte1AAAAeNqFU01IVFEYPefNj2ZlpjOVluM4/pvmTxKUWGgmQUo2uUpBRtEKpqnUNoG4SjCqpYqbZMC/RWm2MrAI+yGQVq1atWrVomylQXbe9SGzmhjeuXe+d+/5zjn3PhBAGqY5Bau5pbUD6dHIUAwhuFXH9jY8GrzYh0M4pp+78dqFICrOhzuCOBu+3BZEe0f4UhA9zloiBftxGLnmvxcWUpGOTBxBwKm4sAcHkIVs5DkVt/pnwIccBJ2KB3txEH4cRT5CvZHBPnxOjv0DkV58SY7Rm9cj+PofvN0bxfcE/LYzvxO7dws/kuOQjRvJUVlSCdhoGXQbpEEYtPO2lEGKcvKhFE1YZy17LFgPrdfOylQ9Xrw1O7t3a5ZytNjHpzY7a7jisNurh8SbgTNoQRdumMQzlXdIZ+NCkbr8NWOZTsYey/HLjCeMwm3nna0qXeeys+JnworfCfON3bkHJWIuw3FUJmishp85LOJFlrCU5DSrOMl2nqbFKTbxPh+wmH6+ZDUfaY9fNycPBeI8hSsI4yruYgCDmMIzPMcLLGMFr/AO7/EpwW/IjC5z+3wMq28XPgi78VHYY5LrSlDVqg45Ur0kfS4US3kZ4jiJOkzK64Q8VKBQt7ESM1jHImbVoQZz5oRqpXENVZjXfX0jvgJsYgt/6GEWfcxmLgPMYz7rWM8GnmMj29jJfkYZ4zBHOMoxPuYTjjPOGc5xgYtc5mqCuiYE9H4Gm6p3Gs5xsdYbrn5saUfcdGhQj4B4R8S3yGFpWBVfTCwBKfXLof1FFTvnUm5cVcp1lTzYXifkNi6Hs3I2L5dL8rMmv15HiUvo09PsjDBZp0nBjk9HkdQtJKjPgJ3EqFx7OGbuhUvpFSrpmn+erdEvAAAAeNqdWl2T2zayfbZ+BUovO1Mly7Gzd7O1ZWfXm2T2uvJhVzzZ1N43iIQk7JCEApAja3/9PacbICmN4qp7H+whKQJodJ/uPt3g679+ahvz6GLyoXuzfLn+YmlcV4Xad7s3y1/u757/efnXrxevW9fb2vb2/NWvF8+ePeO/10Pnfxucr42v3yyr0K4fGt+uj26zDV2f9G7bL80LGfL60XV1iKazrXuz/B4/mvvTwZm7MHR1PC3NEJs3SxlUhXX3n3FcFV3t+yQ35a7MEn0yH8MR8m0wQwwNHn7rkt91LuYZ931/+MuLF8fjcX1l8hfz2V/XLlXRH3psNi/Xu0+9aSwV4zrd+7Nnv+oWzRbbGZIzoTPbHhO3uGpOax35gkPzIpfzvm585brkXN7Hne9sV3nbmHvfujRtPRxO0e/2/UyaLMNNdWteffHypXmiybV52zRGhiUTXXLx0dVXhDqf/HUfbe1aGx+ervWj66OvDHTtfL930VjMu/Opd1CeGQeawF9mt9vfkdD4zvzkjuZ/nIVqa4N/LzA2yNwV3sFyLl0R+VzGosUzO082flGQ+CK/t/wdmz6Rb1EM/ENe4O0uOte6rl8s7vfO3LvYJm6v30Mn32EHv0DL+nY1e9vcjJe35uhhFXs4NCezcf3Rue6KYm746JYKMf8Kg7nBf7fGb80JN4chVnsLaaxp8kpQWr5Mpg+CRU7wh4QJsfzHsO2PNjpzw9t0u14sft1j3YvZ8m5X8pyv598QDrBDp1Aq8/d725cRBkILGg429r4aGhtNcj01U4UObgW8p7WByjBwemIidO/MNoZ2JT7kPtn20LiV2YejaW13MnVorcebXF5WqmwHtVGCmu4GYY57J3jx44+u3bi6xguAV+13vreqcF/ZLMm7niD27SHE3nayp+isAFD3knpeilknK25cZbl1rFS7re+gbGgqZhdbiZC2qtyht5tGZBRw8JWsKLyk87ril2L67JwUTE28cY13j06nH5LdiYk7xz0l04Xe2LrGKGhhxV8yMmizoUsD/ggonWmd7Wg+3FKdcNSW7482WBnoW6yfHrAQFoYdMMw+cJQd0QHEiKSWyhCM7SIVR3B+FoYUomxeDIb7/sxtJv1SNYcYHj1tJ/ji9Ain9JUjIg5Hpzx+bYAnDC9rZ724T1UzJA/dQQAMX2EvJ/kFwEDY6NLWRUarzUl/5qIZN9E9hgf9iZvFnmV7lE/FERWEI/Box8i6AsqwJHOmuaGQYUBQ8S1QRwXDa7veNY2r+gEwxPYOLvancbDAwfeAC8AqN+FcZxIXsdoY8jBoFnQVsbMHx72v9oqEpC5AfHQY04hAlwtgly/X5lviWb0S93ZtJDEvqVW+/CRAKdgpE/e9iRQDBmVQ/MH1kGQPd0qIhNADk87i5Ub8n0LFlVlCsUv9g/RcXGJZIugyI1kcMQTsUsUYs2VG95mS+IDx56S2EjPxmYYQ8QCDTJAgEKQQp4hAv+3EQWZRc1JNjhMzQWRqcbUmBbpRD64hy/CaIM6iZVHrsiQme9uBXdWiASIuY9IiRCXkuc3Qh7iSUAC04KpGUuTfNGyel43T2RHQOiDJ/Tb4g7gNAuWwtcBXxMQ3y/ff/bi8xTBGFMTkuoVhsYCV6cfsetyDIyWsYDbDCfcQO+UssTKur9bnqhANlxeI4nqo8HTmW+Mu3JjHU2gynn2sNTcgMBQfyQnqED1ePUYP1HTUYsKeCBiI8NYsswCKRAIQO82pYBRHjIIoBTE4BSJ5L3ERPKv1EiLF8Rs+HjVwxC8mHRzZFsJLC9a79fh9xuVox3ewauyccrzUn5oMnEfvjoIbcgi8O2KLoteK9aVCb/SifUhKWM/ACB3sQ0vs7pyOy4ilcjdO4l/0ku+QSzr6Bek2DMwo/rxBnmjKEJn8BprA9TJn0yXHzchvfkyaCpi0Q9N73MJOh7O5UpmHL67MOsQd/t9GRcetRq5xNEF6MW6Z9uEgi/NivqzAcLlpwk5+5sX5z7LC2vwirKIfo3yShIhFk7j33Lsliv9fvBFWcgKw/ESMpFldwo3FFBK1GTIxi4RPnUAshfwVd8itnLSwHwaVpoikpiwBJ9uSqOEkzGUCAITOcGRAyC7z6K3+8HxjOXUbNh5Tgr1cZMbz8AcnoBtqJlKQjyQIm3GfEOdkZ1BVypt6teX+ry7lpV4g1+eW4cFMWsgehD6hvoe0z/cO3l27R6jWxEGjKOGZVb6F+oK4yDQ4nZCk2vQXhMI6Bg/H3KCwXJm/N7Z62CAvn8z7jxR+9uDlF/g9uiPy7PuPK/Px1G480jWvf/UoJI/JfNjLunF88PM97Lt4tTYfwBQYWCStaBD7OW9MU90rK1VSoFW+zfjlW+8IRkZXyZlC9kdtZ1tKep1HhRIKhLQVw9OgVMc3Hz+av3H8cwlgcWicDJ5hWIKRxKAyCeMzTVE51Ixr8x5FpRr+/d0dIv36GLZbpFFIZt4fEPqE7N+F2FrUGbKP797f80UXerz3XYEEX2Y2vx0J/NZzpRFimQHNtzqmbwleDaMiHIJ7wGpw+jSQdiRzf38HK/3zH+Lk7+/vbqVc/HQgW4X4WGLvN0IKzD9zDFXeB57Em+xcCqLzfH2GeS8kjIZbm//Gn0fmSt1AedcC0B58YBu0Um1DrwSEkJbugZjs+uRCsjMyvEqDLSDeycrg4kfYrRqIEeZo3TwIM5hCQH72Sr4eMw1cGbJI2WBlI4BfIYgFyU6GRQi8xQdh5rPnmmVL3UQnb0HxoMQcLLWkOg8DY6TjpnP54LQdIWy6ZOwn3FykB8dpKAV2iqFVgeg8fUN1mmGviMqgOGoF0t0Nkal2db7SjDRoT0LIVzdKnvMI0sAjMK26P8nmmEDVPay5eB0O/woU8wPQwyCrzFPLPXpvdDlICr7kjYmjp1JcTOUEpwMBGWW+Y2j8EAEgiRzzwkCJI1RCu7PuQ83FEkxU5bQaexKt7aP1jbxN04yRAHpE7STw/1xUQcwCOA2ZXTu0morhskcoFiN9gwqIhI9Rnoqedrq6KmdOG8aubyEBtS5AnZlEIPBc2TUr3MSyZw059qGHlA/FizeYYXQcPqw9ohfKZaTrJtj6CXFn6aKJNZclv6eBEc4TzXolMYnY/CCClVj2EaCC4GJ3gUymbARbroXPZIDmpDYeYX7SVysw4cY/gMcxVn7vGUKXDLHfuuqB15jh3U/fL4XN4Jr0dHnexwCgNNucRz7IDt39HTnu+XAw34QDHGtRvBO1t5NEevPy1rA390RgLrHJg1GgH4I0GsTFdS6lSORAzCscm0gMi2dmKIx9v9VUXCqWtERgrRq9620Uf/VS1ZN7gCI4CxrdrXJ5WWrzWeX0r0LUHpw7qGsVkWVPYCF0DCWRpMUFNU9sAWDs7aPLuOOtZ31A+vJTMD8Kb8+NnRWfaJaDodVJMzU6jEwAEwjZRw0L8nHoZ9UB3UMTGq/Y7XbwYNRbTgsyUnFPu6LYsSmBYvFGkqH0PDF/e5BuEl6owqOLmYy2h6GXlmb9tHYtJEC61Ym8DdKJzyFqFR7pyqa0mpcehxLTszJtdTkbd3OZ3cRqU7G3Rz7Sq9IrGyP4iqbW/5tJx8r5Uu4r0FyKF65FxM9T/FsYGmZkuigUXhoaFXWCocIKSx3Hf84yk47Rkb1B3WLORKkgnhDYSYQGt2ODjOxoMeMo5/Wr5Axo5QF1DtwaduffY4gPSf1htJLoUCgDdiY9PO0rjQxmRJIa6HLLuYWH+nJ/tQlGnbFm76Cyc2RuTmfFzmqqdoq3XNXmC6E35QGCJf5yQ5hOQkAlAVDUoeGYRxOLL9fmZ21B/pyPBvDMquNOm4XLduHYuHrnntYdq88Cd2oR6elGKrIKNUspoPLu58cGKVdxOSqlCQ8cMTX2xh5aNvLZOce5raRJOVZoZ5UkJy+HIrRT7vh9uVEVzLp+VztNuuup2OFvlxqQNZD5ZoS6DC/z/YH5YZDezapUlApH1UWtgnLIo20G8QlVKSARXZ8mJYjUnzOXESe3bWAUEY9ldzgJayavGfU0P5KZTnGy9Ub7wIlQlG1Ok5mvv8ZZsrYwQjvisnpXAkqmL77TosKTP2NGkEye/hQW2YbopqOJJzE9up3rnPgGMVZC+qXvsZgdo5WdGVRIbY6pcvLgon/EEwBOooTRKnk45MbQ78XvJ61Jgvha+bNY/BHhy0ZC1OfidM5aF3+063I8wOGuwO+oY9IVC8vZEtQioTgNGx5j9NrgIhwRdWNt2S0fM/Y4d2bCLbE1Zp6gbMSWNRFRGuvbWWQiMdgqBkrJwJCtXWi+FTa9th7OBO3DTk9tciuk8JxrZe+7C43WoVj//71NjU3kuZmDTNGl8aVs5HMUja4GW9mzBb9xSqUntoppG5Tz7azVdIkLMIqhqy8aUWbrtJd1sL4e2f/EnjRYh5x78hEFL7MdlCqrAmw+edHqNKlpWAmI4ulYTwtcgm+Tl5nASdJC8+rxxnGE5qq8I5J4UFvPpup47oEoMPRTpSHqUQ3nd2dzURGoYqs9bueK3vq+4wpaq8/OEUu6v9DJpIjsA7nLFC5isnjERpqm7cHVlBuXjDRxOOR+MK5DfL6N2l+fppwcuPSsa7dFoISBfp0f9BTt8uhsF7R0qiW7m8pHcCnik4xJYSQb2SjSpPGqfhJnVEqY72o62uy0uYlULgKG2Jub6dipc7vG71i23p61t1cjjcl97pX2138bnLjLKpNJX9MxwPtsy+bL/ESrYcsaQQvmwXO5S/ZRbI4bsSa/DFnlp4L6DfFGW45qlnyWpAcjHZRsoUzUMvp9V/AwY005seZGgAQbr21MWz8q8rfafQFIktcJgO7/QvDKh31844dSyGqPbzEWW+VEcH4ke4204RkParZ4lb5ezpRKbpesVBLJ1HqeomDuTc/qohw4CQYh5DwBEb1m5YySlXm14yTrisG40anDMgbk2jXuMu1JSJYQrYdCOYWx1vdhoOtfdFPguIh75Gf4TVPeqKhwIc25ps84lmhtXsvlvtqYuGGpP63lMwqviX+xeAu4bqLQvqKJs+PiMvcYkvVMnkgfhZYhecbRdyVIbOAoY5TQolZc5sAmHAKDoo9kOweccRnReKOhPzn3IH5VDmclTTC6qeOD50hc+W3wdOPJnXz376GrhFREHvFvPyOdcH4KRJcKXX3GS8OZhaTaZNNmKK1SJV2XSJiVWkwpINGau20vsYo5GDuRJrjPHSe6FXxZZIojjBeLr9bmm33w6oA/2KPMOB7lJ77w8imRPjvuL6F5x0I5O1I+xyEpzm5+JZkXGnnx6ZAsBzbQ+r6gdErr/4YuU+2reYaYj/8Gm2Wk+cTPNxh4eQAdd5TzqdHkfATGjYLgr9avpm452yNsYPgWSm5d9l2FsIJDg4LvZ59KTLHwzG1v3nICN9Pr7YgXPTbVgFiNB/vQAHKTCC8S5YCppECIrXky59gWHiF0LQBKENh5aaCVw9riP1s1skw2VVJfrb/ULzSmlXKBlObsa/rcRr4kmH8RVWwqZ88DgkaFBK7kRLcvHGCniCM8z+biFyLvZMu5fcFkK2ZmJwfUQjj3SSKTtE1F+A0TEUotX+uErkNkqZyVTo/yOTqInFTwsCEJa9YoMSoQuN0OeCBDlV9uSRyglT+zRydF+YJVq+8Io8yL5kcuST44Ohmu1lCwB+D3b9NHbfL5y5UPM8YjE4bKUEmFDUyef/V45Yu6HFZ59/pF+eDz6/8FJFH1tQ==\n".trim(),
    MetricWebSemiBold: "data:application/font-woff;charset=utf-8;base64,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\n".trim(),
    AvenirLight: "data:application/font-woff;charset=utf-8;base64,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AHMAZQByAGkAZgAgAHQAeQBwAGUAZgBhAGMAZQBzAC4AIABJAG4AIABhAG4AIABpAG4AdABlAHIAdgBpAGUAdwAgAHcAaQB0AGgAIABMAGkAbgBvAHQAeQBwAGUALAAgAGgAZQAgAHMAYQBpAGQAIABoAGUAIABmAGUAbAB0ACAAYQBuACAAbwBiAGwAaQBnAGEAdABpAG8AbgAgAHQAbwAgAGQAZQBzAGkAZwBuACAAYQAgAGwAaQBuAGUAYQByACAAcwBhAG4AcwAgAGkAbgAgAHQAaABlACAAdAByAGEAZABpAHQAaQBvAG4AIABvAGYAIABFAHIAYgBhAHIAIABhAG4AZAAgAEYAdQB0AHUAcgBhACwAIABiAHUAdAAgAHQAbwAgAGEAbABzAG8AIABtAGEAawBlACAAdQBzAGUAIABvAGYAIAB0AGgAZQAgAGUAeABwAGUAcgBpAGUAbgBjAGUAIABhAG4AZAAgAHMAdAB5AGwAaQBzAHQAaQBjACAAZABlAHYAZQBsAG8AcABtAGUAbgB0AHMAIABvAGYAIAB0AGgAZQAgAHQAdwBlAG4AdABpAGUAdABoACAAYwBlAG4AdAB1AHIAeQAuACAAVABoAGUAIAB3AG8AcgBkACAAQQB2AGUAbgBpAHIAIABtAGUAYQBuAHMAIAAnAGYAdQB0AHUAcgBlACcAIABpAG4AIABGAHIAZQBuAGMAaAAgAGEAbgBkACAAaABpAG4AdABzACAAdABoAGEAdAAgAHQAaABlACAAdAB5AHAAZQBmAGEAYwBlACAAbwB3AGUAcwAgAHMAbwBtAGUAIABvAGYAIABpAHQAcwAgAGkAbgB0AGUAcgBwAHIAZQB0AGEAdABpAG8AbgAgAHQAbwAgAEYAdQB0AHUAcgBhAC4AIABCAHUAdAAgAHUAbgBsAGkAawBlACAARgB1AHQAdQByAGEALAAgAEEAdgBlAG4AaQByACAAaQBzACAAbgBvAHQAIABwAHUAcgBlAGwAeQAgAGcAZQBvAG0AZQB0AHIAaQBjADsAIABpAHQAIABoAGEAcwAgAHYAZQByAHQAaQBjAGEAbAAgAHMAdAByAG8AawBlAHMAIAB0AGgAYQB0ACAAYQByAGUAIAB0AGgAaQBjAGsAZQByACAAdABoAGEAbgAgAHQAaABlACAAaABvAHIAaQB6AG8AbgB0AGEAbABzACwAIABhAG4AIAAiAG8AIgAgAHQAaABhAHQAIABpAHMAIABuAG8AdAAgAGEAIABwAGUAcgBmAGUAYwB0ACAAYwBpAHIAYwBsAGUALAAgAGEAbgBkACAAcwBoAG8AcgB0AGUAbgBlAGQAIABhAHMAYwBlAG4AZABlAHIAcwAuACAAVABoAGUAcwBlACAAbgB1AGEAbgBjAGUAcwAgAGEAaQBkACAAaQBuACAAbABlAGcAaQBiAGkAbABpAHQAeQAgAGEAbgBkACAAZwBpAHYAZQAgAEEAdgBlAG4AaQByACAAYQAgAGgAYQByAG0AbwBuAGkAbwB1AHMAIABhAG4AZAAgAHMAZQBuAHMAaQBiAGwAZQAgAGEAcABwAGUAYQByAGEAbgBjAGUAIABmAG8AcgAgAGIAbwB0AGgAIAB0AGUAeAB0AHMAIABhAG4AZAAgAGgAZQBhAGQAbABpAG4AZQBzAC4AIABJAG4AIAAyADAAMAA0ACAAQQBkAHIAaQBhAG4AIABGAHIAdQB0AGkAZwBlAHIAIABhAG4AZAAgAHQAaABlACAAdAB5AHAAZQAgAGQAaQByAGUAYwB0AG8AcgAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgAIAAgAEEAawBpAHIAYQAgAEsAbwBiAGEAeQBhAHMAaABpACAAcgBlAHcAbwByAGsAZQBkACAAdABoAGUAIABBAHYAZQBuAGkAcgAgAGEAbgBkACAAYwByAGUAYQB0AGUAZAAgAHQAaABlACAAQQB2AGUAbgBpAHIAIABOAGUAeAB0ACAAZgBvAHIAIAB0AGgAZQAgAFAAbABhAHQAaQBuAHUAbQAgAEMAbwBsAGwAZQBjAHQAaQBvAG4ALgAgAABBZHJpYW4gRnJ1dGlnZXIgZGVzaWduZWQgQXZlbmlyIGluIDE5ODgsIGFmdGVyIHllYXJzIG9mIGhhdmluZyBhbiBpbnRlcmVzdCBpbiBzYW5zIHNlcmlmIHR5cGVmYWNlcy4gSW4gYW4gaW50ZXJ2aWV3IHdpdGggTGlub3R5cGUsIGhlIHNhaWQgaGUgZmVsdCBhbiBvYmxpZ2F0aW9uIHRvIGRlc2lnbiBhIGxpbmVhciBzYW5zIGluIHRoZSB0cmFkaXRpb24gb2YgRXJiYXIgYW5kIEZ1dHVyYSwgYnV0IHRvIGFsc28gbWFrZSB1c2Ugb2YgdGhlIGV4cGVyaWVuY2UgYW5kIHN0eWxpc3RpYyBkZXZlbG9wbWVudHMgb2YgdGhlIHR3ZW50aWV0aCBjZW50dXJ5LiBUaGUgd29yZCBBdmVuaXIgbWVhbnMgJ2Z1dHVyZScgaW4gRnJlbmNoIGFuZCBoaW50cyB0aGF0IHRoZSB0eXBlZmFjZSBvd2VzIHNvbWUgb2YgaXRzIGludGVycHJldGF0aW9uIHRvIEZ1dHVyYS4gQnV0IHVubGlrZSBGdXR1cmEsIEF2ZW5pciBpcyBub3QgcHVyZWx5IGdlb21ldHJpYzsgaXQgaGFzIHZlcnRpY2FsIHN0cm9rZXMgdGhhdCBhcmUgdGhpY2tlciB0aGFuIHRoZSBob3Jpem9udGFscywgYW4gIm8iIHRoYXQgaXMgbm90IGEgcGVyZmVjdCBjaXJjbGUsIGFuZCBzaG9ydGVuZWQgYXNjZW5kZXJzLiBUaGVzZSBudWFuY2VzIGFpZCBpbiBsZWdpYmlsaXR5IGFuZCBnaXZlIEF2ZW5pciBhIGhhcm1vbmlvdXMgYW5kIHNlbnNpYmxlIGFwcGVhcmFuY2UgZm9yIGJvdGggdGV4dHMgYW5kIGhlYWRsaW5lcy4gSW4gMjAwNCBBZHJpYW4gRnJ1dGlnZXIgYW5kIHRoZSB0eXBlIGRpcmVjdG9yIG9mIExpbm90eXBlIEdtYkggIEFraXJhIEtvYmF5YXNoaSByZXdvcmtlZCB0aGUgQXZlbmlyIGFuZCBjcmVhdGVkIHRoZSBBdmVuaXIgTmV4dCBmb3IgdGhlIFBsYXRpbnVtIENvbGxlY3Rpb24uIAAAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAABodHRwOi8vd3d3Lmxpbm90eXBlLmNvbQAAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAC8AZgBvAG4AdABkAGUAcwBpAGcAbgBlAHIAcwAAaHR0cDovL3d3dy5saW5vdHlwZS5jb20vZm9udGRlc2lnbmVycwAAQQB2AGUAbgBpAHIAAEF2ZW5pcgAATABpAGcAaAB0AABMaWdodAAAQQB2AGUAbgBpAHIA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dW1mbGV4amNpcmN1bWZsZXhLY29tbWFhY2NlbnRrY29tbWFhY2NlbnRMYWN1dGVsYWN1dGVMY29tbWFhY2NlbnRsY29tbWFhY2NlbnRMY2Fyb25sY2Fyb25MZG90bGRvdE5hY3V0ZW5hY3V0ZU5jb21tYWFjY2VudG5jb21tYWFjY2VudE5jYXJvbm5jYXJvbm5hcG9zdHJvcGhlT21hY3Jvbm9tYWNyb25PYnJldmVvYnJldmVPaHVuZ2FydW1sYXV0b2h1bmdhcnVtbGF1dFJhY3V0ZXJhY3V0ZVJjb21tYWFjY2VudHJjb21tYWFjY2VudFJjYXJvbnJjYXJvblNhY3V0ZXNhY3V0ZVNjaXJjdW1mbGV4c2NpcmN1bWZsZXhTY2VkaWxsYXNjZWRpbGxhVGNvbW1hYWNjZW50dGNvbW1hYWNjZW50VGNhcm9udGNhcm9uVGJhcnRiYXJVdGlsZGV1dGlsZGVVbWFjcm9udW1hY3JvblVicmV2ZXVicmV2ZVVyaW5ndXJpbmdVaHVuZ2FydW1sYXV0dWh1bmdhcnVtbGF1dFVvZ29uZWt1b2dvbmVrV2NpcmN1bWZsZXh3Y2lyY3VtZmxleFljaXJjdW1mbGV4eWNpcmN1bWZsZXhaYWN1dGV6YWN1dGVaZG90YWNjZW50emRvdGFjY2VudFNjb21tYWFjY2VudHNjb21tYWFjY2VudHVuaTAyMUF1bmkwMjFCZG90bGVzc2p1bmkwMkM5dW5pMDM5NHVuaTAzQTl1bmkwM0JDcGlFdXJvYWZpaTYxMjg5T21lZ2Flc3RpbWF0ZWRwYXJ0aWFsZGlmZkRlbHRhcHJvZHVjdHN1bW1hdGlvbnVuaTIyMTV1bmkyMjE5cmFkaWNhbGluZmluaXR5aW50ZWdyYWxhcHByb3hlcXVhbG5vdGVxdWFsbGVzc2VxdWFsZ3JlYXRlcmVxdWFsbG96ZW5nZWdyYXZlLmNhcGFjdXRlLmNhcGNpcmN1bWZsZXguY2FwY2Fyb24uY2FwdGlsZGUuY2FwZGllcmVzaXMuY2FwbWFjcm9uLmNhcGJyZXZlLmNhcHJpbmcuY2FwaHVuZ2FydW1sYXV0LmNhcGRvdGFjY2VudC5jYXBjYXJvbi5hbHRjb21tYWFjY2VudGNvbW1hYWNjZW50LmFsdHVuaUY4RkY4LjBkNWUzQ29weXJpZ2h0KGMpIDIwMDcgTGlub3R5cGUgR21iSCwgd3d3Lmxpbm90eXBlLmNvbS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5BdmVuaXIgTGlnaHRBdmVuaXIgTGlnaHQAAAABhwABAAIAAwAEAAUABgAHAGgACQAKAAsADAANAA4ADwAQABEAEgATABQAFQAWABcAGAAZABoAGwAcAB0AHgAfACAAIQAiACMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AD4APwBAAHwAQgBDAEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQBeAF8BiABgAGEAYgBnAGQAoABmAIMAqgCLAGoAlwGJAKUAgAChAJwApACpAH0AmABzAHIAhQCWAI8AeACeAJsAowB7AK4AqwCsALAArQCvAIoAsQC1ALIAswC0ALkAtgC3ALgAmgC6AL4AuwC8AL8AvQCoAI0AxADBAMIAwwDFAJ0AlQDLAMgAyQDNAMoAzACQAM4A0gDPANAA0QDWANMA1ADVAKcA1wDbANgA2QDcANoAnwCTAOEA3gDfAOAA4gCiAOMBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AJEBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAIwAkgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAI4AlAHUAdUB1gHXAdgB2QHaAdsB3AHdAd4B3wDAAN0B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAfEB8gHzAfQB9QDGAfYB9wH4AfkAxwDkAGUB+gH7AfwB/QH+AH4AiAH/AIEAggCEAIcAfwCGAgACAQICAgMAbwCJAEEACAB1AGkAdwB2AHAAcQB0AHkAegBrAGwAYwIEAgUAmQIGAgcCCAIJAgoCCwCmAgwCDQIOAg8CEAIRAhICEwIUAhUCFgIXAhgCGQIaAhsCHAIdAh4CHwIgAiECIgIjAiQAbQBuAYMCAAEAJwAqAC0AQQBWALcEsQTRCS0JOgpaC4YLsgvLC9sL5wvvDAIQUhBqEiIVSBVzF7oa1RrqID0jTCNaI3AjiiOfI7cluCu6K8gunC6mLrYuvi7ULt0u5i7vLvgvAC8ILzUvPi9LMCIy5DL0Mv0zBjMPMyozMzNfM2gzbzODM5UzqDPEM80z1TPkNW01dTWDNZE1mzWpNbE1vjXLNdM12jiiOKo4tjo/O7c7wDvJO9M73Dv4PAE8LTw3PD8+oj6vQRFC1kLZQu1FJkZeSKJI5Ej5TplOpVFtVERUUlRiVG5V21XjWCJYRVhOW0FbSVtSW/Fb+l1XXWFf3F/sYApgImM1ZTZlS2VgZXVliWWiZbtl/Wk7aUlpWGlnaXtpiWmYaadpvGnMadpp7moCahZqKmpDam9simyabKpsumzPbN9tunDmcPtxEHElcTtxVnFxdX94z3jjePh5DXkneTN5QHlNeWB7tHvCe9V76Hv7fA18JHyrf0V/VX9lf3V/in+agSSBOoFPgWSBeIGOgw2GYoZzhoKGk4aihrOGwobThuKG+IcNhx2JoomvicOJ0onnifaKC4uAjoyOmo6vjr+O1I7kjvmPCY8ejy6PSo9aj2iPj5DskPuRCZEXkSSSjJP4lAeUDpQelDqUSZRWlGWUc5SBlI6UnJSplLaUw5TSlOGVCJUmlTaVRZVVlWSVc5WClZCVpJW3lcuV3ZX1lgyXh5tjm3mbiZufm66bw5vTm+Ob85wDnBKgtqTvpP+lD6UfpS+lPqVOpW+mkKagprCmwKbPpt+m76cEpxmnLadBqeetK607rUutW61rrYCtjq2craqtua3GrdSviq+ar6qvuq/Kr9Gv2K/gr+iv76/2sAKxe7GCsY2xnrGmsa+y17Lhsuyy/bMHsxCzLLM6s0ezYbOJtPK1BbUutTe1QbVLt/O6BLpCukq8HMAawCvAQMBnwHLAfMCFwKXFwsjlyPPJLclQyXTJnsmmya7Jtcm9ycTJ0MnYyd/J68n2yf3KBMoKyhnKP8pVymVJ93L3CRXDzlMGjr0VIAr3g/tdFfww+P34MAa9vhX8lP1i+JQGDvzWDvvSDvtk92v3ThX4nk/8ngd5+yQVIQoOUfc1+VgV+3jH93gH2Rb7eMf3eAcOUfcN93kVbft5v4up93n3H4tt+3m/i6n3efcHi4u7+wCLoPcw9weLi7v7AIuq93cFV4ts+3f7H4uq93dXi237d/sHi4tb9wCLdfsw+weLi1sF99v3YBV2+zD7Houg9zAFDlH3rbUVi/ektnsFnf//+VVV/wAO1VX///hVVv8AC6qr///3VVX/AAuqq///91VVlP//9qqr/wAGVVWB/wAGVVWB/wAEgAD///Wqq/8AAqqr///1VVX/AAKqq///9VVV/wABVVX///Wqq4uBi3f///yqq///7YAA///5VVV6///5VVV6///2qqv///Eqq3////NVVQh////zVVV9///11VZ7///4VVV7///4VVX//+6qq///+9VW///tVVX///9VVQhb+QQVi/ueepEF///gqqv/AAtVVXL/AA6qq///7VVVnf//7VVVnf//9qqr/wAaqquL/wAjVVWL/wASqqv/AANVVf8AESqq/wAGqqv/AA+qq/8ABqqr/wAPqqv/AAjVVf8ADaqqlv8AC6qrlv8AC6qr/wAMqqv/AAmAAP8ADlVV/wAHVVX/AA5VVf8AB1VV/wAPKquQm/8AAqqrCP06BEi7zgf/ABlVVf8AAVVV/wAYqqv/AAWAAKP/AAmqq6P/AAmqq/8AFSqr/wANKqr/ABJVVf8AEKqr/wASVVX/ABCqq/8ADqqr/wAT1VWWopai/wAFgAD/ABnVVYv/AByqq4v/ABqqq////Cqr/wAXVVX///hVVZ////hVVZ+B/wARKqv///Oqq/8ADlVVCP//86qr/wAOVVX///Iqqv8AC9VW///wqqv/AAlVVf//8Kqr/wAJVVV8/wAHVVb///FVVf8ABVVVCEWji/euBaOL/wAX1VX///mAAP8AF6qrfv8AF6qrfv8AE4AA///tgAD/AA9VVXMIwrMF///yqqud///yKqr/AA7VVf//8aqr/wALqqv///Gqq/8AC6qrfP8ACSqq///wVVX/AAaqq///8FVV/wAGqqv//+/VVv8ABIAA///vVVX/AAJVVf//71VV/wACVVX//+9VVv8AASqr///vVVWLCM5bSAd1iXWFdYF1gXf///Kqq3n//+9VVXn//+9VVf//8YAA///sKquAdIB0///6gAD//+aAAItvi///9Kqr/wABVVX///Kqqv8AAqqr///wqqv/AAKqq///8Kqr/wAFgAD///BVVf8ACFVVewj/AAhVVXv/AAuqq///8Kqrmv//8VVVmv//8VVV/wAT1VX///RVVv8AGKqr///3VVUI0nGL+7YF///jVVX/AAFVVXD/AAiAAP//5qqr/wAPqqv//+aqq/8AD6qr///rVVX/ABWAAHv/ABtVVQhSZAWX///uqqv/AA2qq///8NVV/wAPVVV+/wAPVVV+/wAQgACA/wARqquC/wARqquC/wASKqr///lVVf8AEqqr///7qqv/ABKqq///+6qr/wASVVX///3VVZ2LCA73gfj6+XoVIgr9Avs6FSMKwRYkCvfp/BgVIwrBFiQKDvcS+Hv3YhX7QPdKBZ//AAqqq/8AE1VVlv8AEqqr/wALVVX/ABKqq/8AC1VV/wAQ1VWYmv8ADqqrmv8ADqqrl/8AEKqqlP8AEqqrlP8AEqqr/wAEgAChi/8AGVVVi/8AFqqr///7qqv/ABSAAP//91VV/wASVVX///dVVf8AElVV///0Kqv/AA+qq3yYCHyY///u1VX/AAoqq///7Kqr/wAHVVX//+yqq/8AB1VVd/8AA6qr///rVVWL///oqquL///pgAD///xVVf//6lVV///4qqv//+pVVf//+KqreP//9YAA///vqqv///JVVf//76qr///yVVV+///vKqv///ZVVXf///ZVVXf///sqq///6VVVi///5qqrCIt7/wACqqv///CAAP8ABVVVfP8ABVVVfP8ABqqr///xgACTfZN9/wAJKqv///KAAP8AClVVfv8AClVVfv8ACiqr///zgACVf///61VV///zVVV3///zKqv//+yqq37//+yqq37//+7VVf//8YAAfHsIfHv///PVVf//7aqr///2qqv//+tVVf//9qqr///rVVX///tVVXOL///kqquL///gqqv/AAWqq///46qq/wALVVX//+aqq/8AC1VV///mqqv/AA9VVv//6lVV/wATVVV5/wATVVV5/wAW1Vb///Iqq/8AGlVV///2VVX/ABpVVf//9lVV/wAcKqv///sqq6mLCP8AMVVVi/8AKdVW/wALgAD/ACJVVaL/ACJVVaL/AB+AAP8AHtVV/wAcqqv/ACaqqwj1+wbki/s19z33FPd2R4sF+633qBX/AByqq4v/ABeqqv//9yqr/wASqqv//+5VVf8AEqqr///uVVX/AAlVVf//6Sqri2+L///tVVX///vVVf//74AA///3qqv///Gqq///96qr///xqqv///WAAP//8yqq///zVVX///Sqq///81VV///0qqt9gf//8Kqr///3VVX///Cqq///91VV///xVVWDff//+KqrCP//+Kqr/wAIqqv///fVVf8ACaqqgv8ACqqrgv8ACqqr///3qqv/AAtVVf//+FVVl///+FVVl///+aqr/wAMVVWG/wAMqquG/wAMqqv///2AAP8ADFVVi5eLqf8AClVV/wAYKqv/ABSqq/8AElVV/wAUqqv/ABJVVf8AGVVV/wAJKqupiwha+8sV91j7YAWB///xVVWA///yKqt/fn9+fv//9IAAfYF9gf//8NVVg///76qrhf//76qrhf//7oAAiP//7VVVi3WL///rKqv/AAOAAP//7FVVkv//7FVVknqV///xqquYCP//8aqrmP//9Kqq/wAPgAD///eqq53///eqq53///vVVf8AFFVVi/8AFqqri/8AFKqrj/8AEoAAk/8AEFVVk/8AEFVV/wAKgAD/AA6qq5iYmJj/AA5VVf8AC9VV/wAPqqv/AAqqq/8AD6qr/wAKqqv/AA/VVZWb/wAJVVUIDvvS7/lYFft4x/d4Bw770veM+VAVWKsFX03//93VVf//ulVV///nqqv//7Kqq///56qr//+yqqv///PVVf//saqqi///sKqri2X/AAMqq///2aqr/wAGVVX//9lVVf8ABlVV///ZVVX/AAkqq///2aqrl2WXZf8ADtVV///a1VX/ABGqq///26qr/wARqqv//9uqq/8AFIAA///d1VX/ABdVVWsIuqkF///Wqqv/AECqq2v/AEGqqv//6VVV/wBCqqv//+lVVf8AQqqr///0qqv/AEhVVYvZi/8AIqqr/wACqqv/ACOqqv8ABVVV/wAkqqv/AAVVVf8AJKqr/wAIKqv/ACRVVZavlq//AA2AAP8AItVVm/8AIaqrm/8AIaqrnv8AHoAAof8AG1VVCA770pf7EBW+awW3yf8AIiqr/wBFqqv/ABhVVf8ATVVV/wAYVVX/AE1VVf8ADCqr/wBOVVaL/wBPVVWLsf///NVV/wAmVVX///mqq/8AJqqr///5qqv/ACaqq///9tVV/wAmVVV/sX+x///xKqv/ACUqq///7lVV/wAkVVX//+5VVf8AJFVV///rgAD/ACIqq///6KqrqwhcbQX/ABSqq///31VV/wASVVX//9+AAJv//9+qq5v//9+qq/8ADYAA///e1VWWaZZp/wAIgABokWeRZ47//9qqq4v//9lVVYv//91VVf///VVV///cKqv///qqq2b///qqq2b///fVVf//24AAgGcIgGf///KAAP//3VVVe///3qqre///3qqreP//4aqqdf//5KqrCA77GveL+MAV9yxb+ywH+ye7fV73Jlkw+w6zbuT3Een7EbCoMPcO9yS6fLsFDuPZ99sVW/d7+3u793v3e7v7e/d7W/t7Bw770vcI5RVJ+3jGi9j3eAUO+4m295wVVfeLwQcO+9LdtRUhCg77ZPfN+XwV+8T9jsB598P5jgUOUaX39hWLcf8AASqrcP8AAlVVb/8AAlVVb/8ABFVW///kgAD/AAZVVXD/AAZVVXD/AAiqq///5lVVlv//56qrlv//56qr/wAOKqv//+qAAP8AEVVV///tVVX/ABFVVf//7VVV/wAU1Vb///Eqq/8AGFVVgP8AGFVVgP8AHNVW///6gAD/ACFVVYsI/wAhVVWL/wAc1Vb/AAWAAP8AGFVVlv8AGFVVlv8AFNVW/wAO1VX/ABFVVf8AEqqr/wARVVX/ABKqq/8ADiqr/wAVgACW/wAYVVWW/wAYVVX/AAiqq/8AGaqr/wAGVVWm/wAGVVWm/wAEVVb/ABuAAP8AAlVVp/8AAlVVp/8AASqrpoulCIv/ABlVVf///tVV/wAa1Vb///2qq/8AHFVV///9qqv/ABxVVf//+6qq/wAbqqv///mqq6b///mqq6b///dVVf8AGaqrgP8AGFVVgP8AGFVV///x1VX/ABWAAP//7qqr/wASqqv//+6qq/8AEqqr///rKqr/AA7VVf//56qrlv//56qrlv//4yqq/wAFgAD//96qq4sI///eqquL///jKqr///qAAP//56qrgP//56qrgP//6yqq///xKqv//+6qq///7VVV///uqqv//+1VVf//8dVV///qgACA///nqquA///nqqv///dVVf//5lVV///5qqtw///5qqtw///7qqr//+RVVf///aqr///jqqv///2qq///46qr///+1VX//+Uqqov//+aqqwjNFoud/wAAqqv/ABRVVf8AAVVV/wAWqqv/AAFVVf8AFqqr/wACqqv/ABbVVY+ij6L/AAXVVf8AFoAA/wAHqquh/wAHqquhlf8AE4AA/wAMVVWc/wAMVVWc/wAPVVb/AA2qq/8AElVV/wAKVVX/ABJVVf8AClVV/wAVgAD/AAUqq/8AGKqriwj/ABiqq4v/ABWAAP//+tVV/wASVVX///Wqq/8AElVV///1qqv/AA9VVv//8lVV/wAMVVV6/wAMVVV6lf//7IAA/wAHqqt1/wAHqqt1/wAF1VX//+mAAI90j3T/AAKqq///6Sqr/wABVVX//+lVVf8AAVVV///pVVX/AACqq///66qri3kIi///7VVV////VVX//+uAAP///qqr///pqqv///6qq///6aqr///9VVX//+lVVYd0h3T///oqq///6YAA///4VVV1///4VVV1gf//7IAA///zqqt6///zqqt6///wqqr///JVVf//7aqr///1qqv//+2qq///9aqr///qgAD///rVVf//51VViwj//+aqq4v//+pVVf8ABSqref8AClVVef8AClVV///w1VX/AA2qq///86qrnP//86qrnIH/ABOAAP//+FVVof//+FVVof//+iqr/wAWgACHooei///9VVX/ABaqq////qqr/wAWVVX///6qq/8AFlVV////VVX/ABSAAIv/ABKqqwgOUfeZ+QQV/QTH+VhYB/tD+yOwXfcU9AUOUbTRFUX4SsH8CAf3cfd3BZ3/ABKqq/8AEdVV/wASqqr/ABGqq/8AEqqr/wARqqv/ABKqq/8AD6qq/wAT1VX/AA2qq6D/AA2qq6CW/wAWKqv/AAhVVf8AF1VV/wAIVVX/ABdVVf8ABCqr/wAZVVaL/wAbVVWL/wAcqqv///qAAP8AGYAAgP8AFlVVgP8AFlVV///xKqv/ABLVVv//7VVV/wAPVVUI///tVVX/AA9VVf//6lVW/wAL1Vb//+dVVf8ACFVV///nVVX/AAhVVXH/AAQqq///5Kqri///yVVVi///0VVW///ygAD//9lVVXD//9lVVXBy///XKqv///Sqq///yVVVCNGEBf8AB1VV/wAiqqv/ABBVVqf/ABlVVf8AFVVV/wAZVVX/ABVVVar/AAqqq/8AJKqri/8AKKqri/8AIaqq///0VVX/ABqqq///6Kqr/wAaqqv//+iqq/8ADVVV///fqqqL///WqquL///sqquIeYX//+9VVYX//+9VVf//+Cqr///wKqv///ZVVXwI///2VVV8///1Kqv///Gqq3////JVVX////JVVX////Mqq39/CA5R9fcoFUp2Bf8AEqqrW/8AG9VV///c1VWw///pqquw///pqqv/AC0qq///9NVV/wA1VVWL/wAkqquLq/8ABVVV/wAbVVX/AAqqq/8AG1VV/wAKqqv/ABbVVv8ADoAA/wASVVX/ABJVVf8AElVV/wASVVX/AA2qq/8AFYAAlP8AGKqrlP8AGKqr/wAEgAD/ABpVVYunCIv/ABaqq////FVV/wAVVVX///iqq5////iqq5////Wqqp3///Kqq5v///Kqq5v///Aqqv8ADYAA///tqquW///tqquW///rgAD/AAeAAP//6VVVjwiNB/8AKVVV/wALVVX/AB9VVv8AFIAA/wAVVVX/AB2qq/8AFVVV/wAdqqv/AAqqq/8AIiqqi/8AJqqri/8AHqqr///61VX/ABqqqv//9aqr/wAWqqv///Wqq/8AFqqr///x1VX/ABLVVXmaeZp2/wALVVVz/wAHqqtz/wAHqqv//+aqq/8AA9VV///lVVWLCP//11VVi///2tVW///3qqv//95VVf//71VV///eVVX//+9VVf//5YAA///lVVb//+yqq///21VVCMRrBf8ADVVV/wAZVVX/ABJVVv8AFCqr/wAXVVWa/wAXVVWa/wAaVVb/AAeAAP8AHVVVi7OL/wAf1VX///PVVf8AF6qr///nqqv/ABeqq///56qr/wAL1VX//+DVVYtli3P///tVVf//64AA///2qqt6///2qqt6///z1VX///Iqq3z///VVVQh8///1VVV6///4Kqt4hniG///tKqv///2AAP//7VVViwhtT6UG/wAWqquL/wAWgAD///1VVf8AFlVV///6qqv/ABZVVf//+qqrn///94AA/wARqqv///RVVf8AEaqr///0VVX/AA5VVf//8NVWlv//7VVVlv//7VVV/wAFgAD//+mqq4txi///6qqr///8qqt3///5VVX//+1VVf//+VVV///tVVX///Yqq///76qrfn0Ifn3//++AAIB3g3eDdIdxi2OL///ggAD/AAkqq3T/ABJVVXT/ABJVVf//7dVV/wAaKqv///Kqq60IDlH33fdCFftCx/dC9wDB+wD4dDgH+6/8Y4tEBffG+GgV/DL7kAf3jvgyBQ5R+Ff5IhXB+/IHhfv9BZ+Zof8AC4AAo5SjlP8AGKqr/wAEgAD/ABlVVYv/ABlVVYv/ABeAAP//+yqr/wAVqqv///ZVVf8AFaqr///2VVX/ABLVVf//8tVWm///71VVm///71VV/wAMgAD//+yAAJT//+mqq5T//+mqq/8ABIAA///oKqqL///mqqsIi2////qqq///51VV///1VVX//+qqq///9VVV///qqqv///Kqq///7lVVe317ff//7qqr///1gAD//+1VVYT//+1VVYT//+6qq////IAAe4t7i///8FVV/wACgAD///Cqq5D///Cqq5D///GqqpL///Kqq5QI///yqquU///0Kqr/AApVVf//9aqr/wALqqv///Wqq/8AC6qr///31VX/AAyAAIX/AA1VVQhNbAX/ABNVVf//2qqr/wAbKqv//+Kqqq7//+qqq67//+qqq/8AK4AA///1VVW/i6WL/wAaVVX/AASqq/8AGqqr/wAJVVX/ABqqq/8ACVVV/wAYVVWZof8AEqqrof8AEqqr/wAR1VX/ABeqqv8ADaqr/wAcqqv/AA2qq/8AHKqr/wAG1VX/ACFVVYuxCIur///61VX/AB4qq///9aqr/wAcVVX///Wqq/8AHFVV///xVVX/ABjVVnj/ABVVVXj/ABVVVXT/ABDVVnD/AAxVVXD/AAxVVf//4YAA/wAGKqtpi///7qqri///7lVV///+qqt5///9VVV5///9VVX//+9VVf//+qqr///wqquDCI73dQUOUfc8+CAV91X3zD+L+1T70wX///iqq3////iqqv//81VV///4qqv///Kqq///+Kqr///yqquE///x1VX///lVVXz///lVVXz///qqq///8Cqrh///71VVh///71VVif//7lVWi///7VVVi2v/AAXVVf//4oAA/wALqqtw/wALqqtw/wAQKqr//+jVVf8AFKqr///sqqsI/wAUqqv//+yqq/8AGIAA///w1VX/ABxVVYD/ABxVVYD/AB7VVv//+oAA/wAhVVWL/wAhVVWL/wAe1Vb/AAWAAP8AHFVVlv8AHFVVlv8AGIAA/wAPKqv/ABSqq/8AE1VV/wAUqqv/ABNVVf8AECqq/wAXKqv/AAuqq6b/AAuqq6b/AAXVVf8AHYAAi6sIi/8AHqqr///6qqv/AByAAP//9VVV/wAaVVX///VVVf8AGlVVfKL//+yqq/8AE6qr///sqqv/ABOqq3T/AA+AAP//5VVV/wALVVX//+VVVf8AC1VVbv8ABaqr///gqquL///uqquL///tKqr///2AAP//66qrhv//66qrhv//79VV///4gAB/gQjldRX/ABaqq4v/ABWAAP//+6qr/wAUVVX///dVVf8AFFVV///3VVX/ABGqq///9CqrmnyafP8AC9VV///uVVX/AAiqq///66qr/wAIqqv//+uqq/8ABFVV///qgACL///pVVWL///nVVWH///pgACD///rqquD///rqqv///Sqq///7oAA///xVVX///FVVQj///FVVf//8VVV///ugAD///Sqq///66qrg///66qrg///6YAAh///51VVi///51VVi///6YAAj///66qrk///66qrk///7oAA/wALVVX///FVVf8ADqqr///xVVX/AA6qq///9Kqr/wARgACD/wAUVVWD/wAUVVWH/wAWgACL/wAYqqsIi/8AFqqr/wAEVVX/ABWAAP8ACKqr/wAUVVX/AAiqq/8AFFVV/wAL1VX/ABGqq5qampr/ABGAAP8AC9VVn/8ACKqrn/8ACKqr/wAVqqv/AARVVf8AF1VViwgOUfhP+SIVwfwmVffoB/uz/SLOiwUOUc34rBWL///vVVX/AAKqq///74AA/wAFVVX//++qq/8ABVVV///vqqv/AAeAAP//8Kqq/wAJqqv///Gqq/8ACaqr///xqqv/AAvVVf//84AAmf//9VVVmf//9VVV/wAPqqv///hVVv8AEVVV///7VVUIigf//+lVVf//+1VV///sKqv///fVVnr///RVVXr///RVVf//8aqrff//9FVV///vqqv///RVVf//76qr///3Kqt5hf//7FVVhf//7FVViP//64AAi///6qqri2v/AAWAAP//4yqrlv//5lVVlv//5lVV/wAPVVX//+oqq/8AE6qreQj/ABOqq3n/ABcqqn3/ABqqq4H/ABqqq4Gohv8AH1VVi/8AH1VVi6iQ/wAaqquV/wAaqquV/wAXKqqZ/wATqqud/wATqqud/wAPVVX/ABXVVZb/ABmqq5b/ABmqq/8ABYAA/wAc1VWLqwiL/wAVVVWI/wAUgACF/wATqquF/wATqqv///cqq53///RVVf8AEFVV///0VVX/ABBVVf//8aqrmXr/AAuqq3r/AAuqq///7Cqr/wAIKqr//+lVVf8ABKqrCIwH/wARVVX/AASqq/8AD6qr/wAHqqqZ/wAKqquZ/wAKqqv/AAvVVf8ADIAA/wAJqqv/AA5VVf8ACaqr/wAOVVX/AAeAAP8AD1VW/wAFVVX/ABBVVf8ABVVV/wAQVVX/AAKqq/8AEIAAi/8AEKqri/8AG1VVhqSB/wAWqquB/wAWqqv///JVVf8AE1VV///uqqubCP//7qqrm///64AA/wAMgAD//+hVVZT//+hVVZT//+aAAP8ABIAA///kqquL///kqquL///mgAD///uAAP//6FVVgv//6FVVgv//64AA///zgAD//+6qq3v//+6qq3v///JVVf//7Kqrgf//6VVVgf//6VVVhnKL///kqqsIzRaL/wAnVVX/AAwqq/8AH4AA/wAYVVX/ABeqq/8AGFVV/wAXqqv/AB6AAP8AC9VV/wAkqquL/wAkqquL/wAegAD///Qqq/8AGFVV///oVVX/ABhVVf//6FVV/wAMKqv//+CAAIv//9iqq4t5///81VX//+8qq///+aqr///wVVX///mqq///8FVV///3VVX///JVVoD///RVVQiA///0VVX///KAAP//9qqre4R7hP//7qqr///8gAD//+1VVYv//+yqq4v//+6AAP8AA4AA///wVVWS///wVVWS///yqqv/AAlVVYD/AAuqq4D/AAuqq///91VV/wANqqr///mqq/8AD6qr///5qqv/AA+qq////NVV/wAQ1VWLnQhy++cVi/8AF1VVj/8AFSqrk56Tnv8ACtVV/wAQVVX/AA2qq/8ADaqr/wANqqv/AA2qq/8AECqq/wAKgAD/ABKqq/8AB1VV/wASqqv/AAdVVZ//AAOqq/8AFVVVi/8AFVVVi5////xVVf8AEqqr///4qqv/ABKqq///+Kqr/wAQKqr///WAAP8ADaqr///yVVUI/wANqqv///JVVf8ACtVV///vqquTeJN4j///6tVVi///6Kqri///6qqr///8VVV3///4qqv//+1VVf//+Kqr///tVVX///Wqqv//76qr///yqqt9///yqqt9e///9NVV///tVVX///eqq///7VVV///3qqt2///71VX//+iqq4sI///oqquLdv8ABCqr///tVVX/AAhVVf//7VVV/wAIVVV7/wALKqv///Kqq5n///Kqq5n///Wqqv8AEFVV///4qqv/ABKqq///+Kqr/wASqqv///xVVZ+L/wAVVVUIDlH39PfMFftV+8zXi/dU99MF/wAGqquX/wAHKqr/AAyqq/8AB6qr/wANVVX/AAeqq/8ADVVV/wAHKqr/AA4qq/8ABqqrmv8ABqqrmv8ABVVV/wAP1VWP/wAQqquP/wAQqquN/wARqqqL/wASqquLq///+iqr/wAdgAD///RVVab///RVVab//+/VVv8AFyqr///rVVX/ABNVVQj//+tVVf8AE1VV///ngAD/AA8qq///46qrlv//46qrlv//4Sqq/wAFgAD//96qq4v//96qq4v//+Eqqv//+oAA///jqquA///jqquA///ngAD///DVVf//61VV///sqqv//+tVVf//7Kqr///v1Vb//+jVVf//9FVVcP//9FVVcP//+iqr///igACLawiL///hVVX/AAVVVf//44AA/wAKqqv//+Wqq/8ACqqr///lqquadP8AE1VV///sVVX/ABNVVf//7FVVov//8IAA/wAaqqv///Sqq/8AGqqr///0qquo///6VVX/AB9VVYv/ABFVVYv/ABLVVv8AAoAA/wAUVVWQ/wAUVVWQ/wAQKqv/AAeAAJeVCDGhFf//6Kqri///6lVV/wAEVVV3/wAIqqt3/wAIqqv//+6AAP8AC9VVfJp8mv//9Cqr/wARgAD///dVVZ////dVVZ////uqq/8AFaqri/8AF1VVi/8AGKqrj/8AFoAAk/8AFFVVk/8AFFVV/wALVVX/ABGAAP8ADqqr/wAOqqsI/wAOqqv/AA6qq/8AEYAA/wALVVX/ABRVVZP/ABRVVZP/ABaAAI//ABiqq4v/ABiqq4v/ABaAAIf/ABRVVYP/ABRVVYP/ABGAAP//9Kqr/wAOqqv///FVVf8ADqqr///xVVX/AAtVVf//7oAAk///66qrk///66qrj///6YAAi///51VVCIv//+iqq///+6qr///qVVX///dVVXf///dVVXf///Qqq///7oAAfHx8fP//7lVV///0Kqv//+uqq///91VV///rqqv///dVVf//6oAA///7qqv//+lVVYsIDvvS3fg4FSEK/A4EIQoO+9L3COUVSft4xovY93gFI/feFSEKDuP43PiTFYu9/Ir7fotb+Ir7fou9/FT3ZAUO49n4IxVb+JK7B/yS+yQVW/iSuwcO493qFYtZ+Ir3fou7/Ir3fotZ+FT7ZAUO+wf3YPeiFTfHyweL/wAXVVWP/wAT1VaT/wAQVVWT/wAQVVWV/wAOqquXmJeYmP8ADKqrmf8ADFVVmf8ADFVVmP8ADYAAl/8ADqqrl/8ADqqrlZyT/wATVVWT/wATVVWP/wAXqquLpwiL/wAbVVX///tVVf8AGFVW///2qqv/ABVVVf//9qqr/wAVVVX///Mqqp3//++qq/8ADqqr///vqqv/AA6qq///7IAA/wALKqr//+lVVf8AB6qr///pVVX/AAeqq///56qr/wAD1VVxi1mL///VVVX///HVVf//3Kqr///jqqv//9yqq///46qr///pqqr//9gqqv//9qqr///MqqsIzIMF/wAHVVX/ACKqq/8ADtVWp/8AFlVV/wAVVVX/ABZVVf8AFVVV/wAc1Vb/AAqqq/8AI1VVi/8AJKqri/8AHKqq///01VX/ABSqq///6aqr/wAUqqv//+mqq/8AClVV///i1VWLZ4t1///8Kqt4///4VVV7///4VVV7///2VVb///Eqq///9FVV///yVVUI///0VVX///JVVf//84AA///zKqv///Kqq3////Kqq3////OAAP//81VV///0VVX///Kqq///9FVV///yqqv///ZVVnz///hVVf//71VV///4VVX//+9VVf///Cqr///sqquLdQh6+3gVIQoO93L3kvesFYuj/wAEKqv/ABmqq/8ACFVV/wAbVVX/AAhVVf8AG1VV/wAL1Vb/ABlVVv8AD1VV/wAXVVX/AA9VVf8AF1VV/wASKqv/ABNVVqD/AA9VVaD/AA9VVf8AFyqr/wAHqqv/ABlVVYuni/8AFIAAgph5mHn/AAaAAHKLawiLdf//+6qr///n1VX///dVVf//5aqr///3VVX//+Wqq3///+dVVf//8KqrdP//8KqrdHn//+zVVf//61VV///wqqv//+tVVf//8Kqrdf//+FVV///oqquLcYv//+uAAP8ACNVVfP8AEaqrfP8AEaqr///4gAD/ABbVVYunCPejdhXs97ZPi3NLiYsF///2qqv/AB6qq///8YAA/wAVgAD//+xVVf8ADFVV///sVVX/AAxVVf//6yqr/wAGKqt1i///21VVi///3yqr///3VVVu///uqqtu///uqqv//+dVVf//6aqq///rqqv//+Sqq///66qr///kqqv///BVVWyA///dVVWA///dVVX///qAAP//3VVWi///3VVVCIt3/wAC1VX//+0qq/8ABaqr///uVVX/AAWqq///7lVV/wAIgAD///BVVv8AC1VV///yVVX/AAtVVf//8lVVmf//9VVW/wAQqqv///hVVf8AEKqr///4VVX/ABOqqv///Cqr/wAWqquLpYv/ABiqq5L/ABdVVZn/ABdVVZn/ABJVVv8AD1VV/wANVVX/ABCqqwiNBov//+lVVZH//+8qq5eAl4D/AA6qq///+oAA/wARVVWLp4un/wAHgACnmqea/wAZKqv/ABTVVf8AFlVV/wAaqqv/ABZVVf8AGqqrnf8AH1VV/wANqquv/wANqquv/wAG1VX/ACaqq4v/AClVVQiL/wAqqqv///dVVf8AJ6qq///uqqv/ACSqq///7qqr/wAkqqtz/wAfqqr//+FVVf8AGqqr///hVVX/ABqqq///29VWoP//1lVV/wAPVVX//9ZVVf8AD1VV///S1Vb/AAeqq///z1VVi///zKqri///z9VV///2gABeeF54///Y1VX//+Wqq///3qqr///eVVUI///eqqv//95VVf//5aqq///Yqqv//+yqq17//+yqq17///ZVVf//z4AAi1eLV/8ACVVV///PVVX/ABKqq///0qqr/wASqqv//9Kqq/8AGdVV///YgACs///eVVWs///eVVX/ACeAAP//5YAAuf//7Kqruf//7Kqrvf//9lVVwYsI/wAfVVWLqv8ABCqr/wAeqqv/AAhVVf8AHqqr/wAIVVWol/8AG1VV/wAPqqv/ABtVVf8AD6qrpP8AEtVV/wAWqquh/wAWqquhnqT/AA9VVacIUQb///Kqq///7Kqre///7lVV///tVVV7///tVVV7///rgAD///Iqq///6aqr///0VVX//+mqq///9FVV///ogAD///bVVv//51VV///5VVX//+dVVf//+VVV///nVVb///yqq///51VVi1+L///WgAD/AAiAAGScZJxp/wAXVVVu/wAdqqsIbv8AHaqr///pKqv/ACKAAP//71VV/wAnVVX//+9VVf8AJ1VV///3qqu1i/8ALKqri/8AKqqrk/8AKNVVm7Kbsv8AFiqr/wAiVVX/ABxVVf8AHaqr/wAcVVX/AB2qq/8AIaqr/wAXqqqy/wARqquy/wARqqv/ACoqq/8ACNVV/wAtVVWLCP8AJVVVi6////nVVf8AIqqr///zqqv/ACKqq///86qr/wAegAD//+7VVf8AGlVVdf8AGlVVdaD//+WAAP8AD6qrbP8AD6qrbP8AB9VV///d1VWL///aqquLb///+tVV///jqqv///Wqq///41VV///1qqv//+NVVf//8tVV///mKqt7dAh7dP//7oAA///tKqt4///xVVV4///xVVX//+3VVf//+Kqr///uqquL///0qquL///41VWOiJGIkf///oAA/wAFqquL/wAFVVWLj4z/AAZVVY3/AAiqq43/AAiqq/8AAqqr/wAJqqr/AANVVf8ACqqrCA729875WBUlCmZDFSYKDr/s+VgV/Vj3dgeji/8AGdVV/wACqqv/ABuqq/8ABVVV/wAbqqv/AAVVVf8AGaqqlf8AF6qr/wAOqqv/ABeqq/8ADqqr/wATqqr/ABQqqv8AD6qr/wAZqqv/AA+qq/8AGaqr/wAH1VX/ACEqqov/ACiqq4v/ABiqq////Cqr/wAWqqr///hVVf8AFKqr///4VVX/ABSqq///9Sqr/wAR1VV9mgh9mv//71VVl///7KqrlP//7KqrlP//6qqq/wAFgAD//+iqq40IjQe1/wAIqqv/AB+qq/8AEaqq/wAVVVX/ABqqq/8AFVVV/wAaqqv/AAqqq/8AH1VVi6+Ls///+Sqr/wAgKqv///JVVf8AGFVV///yVVX/ABhVVf//7lVWnv//6lVV/wANqqv//+pVVf8ADaqr///ngACU///kqqv/AARVVf//5Kqr/wAEVVVw/wACKqv//+VVVYsI+x77xhX3ivcmB/8AFKqri/8AE6qqif8AEqqrh/8AEqqrh/8AEFVV///5KquZ///2VVWZ///2VVX/AAsqq37/AAhVVf//76qr/wAIVVX//++qq/8ABCqr///rgACL///nVVWL///0qquJ///zgACH///yVVWH///yVVWD///zKqt/fwh/f///71VV///11VX//+qqq///96qr///qqqv///eqq///5FVV///71VVpiwj7HfvqFfeu9zUH/wAUqquL/wAUgAD///1VVf8AFFVV///6qqv/ABRVVf//+qqr/wASKqv///eAAJv///RVVZv///RVVZj///DVVpX//+1VVZX//+1VVZD//+mqq4txi///81VV///91VX///HVVv//+6qr///wVVX///uqq///8FVV///3gAD///Eqq///81VVfQj///NVVX3//+3VVv//9FVV///oVVX///aqq///6FVV///2qqv//+DVVv//+1VV///ZVVWLCA73Evk89wMVJwoO9zfj+VgVKAr7Lf0cFSkKDprs+VgVKgoOdez5WBX9WM335Pfhx/vh95D3+scHDvdc+T25FSsKDvck7PlYFSwKDvvS7PlYFS0KDiv4FfdkFS4KDqzs+VgVLwoOPez5WBUwCg73y+X5WBX9WM35BI0H96b9BKiL96L5BI2Li/0EzYuL+Vgti/uW/Ob7lvjmBQ73XOz5WBUxCg73lL739hUyCs0WMwoOh+z5WBX9WM335PctB6eL/wAa1VX/AAOqq/8AGaqr/wAHVVX/ABmqq/8AB1VV/wAWqqr/AAsqq/8AE6qrmv8AE6qrmv8AD6qq/wATKqv/AAuqq/8AF1VV/wALqqv/ABdVVf8ABdVV/wAbqquLq4v/ACSqq///+NVV/wAegAD///Gqq/8AGFVV///xqqv/ABhVVf//7aqq/wATKqv//+mqq5kI///pqquZ///nVVX/AAnVVXD/AAWqq3D/AAWqq///5iqr/wAC1VX//+dVVYsI+x77zBU0Cg73lPnBFsf7cY0H/wAbVVX/AAqqq/8AGKqr/wAP1VWhoKGg/wASqqv/ABgqq/8AD1VV/wAbVVX/AA9VVf8AG1VV/wALqqv/AB0qq5Oqk6qP/wAfKquL/wAfVVWL/wAzVVX///eAAP8AL9VWev8ALFVVev8ALFVVc/8AJlVWbP8AIFVVCGz/ACBVVf//2lVV/wAZgAD//9Oqq/8AEqqr///Tqqv/ABKqq///zoAA/wAJVVX//8lVVYv//8lVVYv//86AAP//9qqr///Tqqv//+1VVf//06qr///tVVX//9pVVf//5oAAbP//36qrbP//36qrc///2aqqev//06qrev//06qr///3gAD//9Aqqov//8yqqwiL///JVVX/AAoqq///zlVW/wAUVVX//9NVVf8AFFVV///TVVX/ABsqq///2dVWrf//4FVVrf//4FVV/wAngAD//+eAALj//+6qq7j//+6qq/8ALyqr///3VVX/ADFVVYsI+8b3/xWL/wAqqqv/AAaqq/8AJ9VV/wANVVWw/wANVVWw/wATKqv/ACAqq6T/ABtVVaT/ABtVVf8AHqqr/wAVVVb/ACRVVf8AD1VV/wAkVVX/AA9VVf8AKSqr/wAHqqu5i7mL/wApKqv///hVVf8AJFVV///wqqv/ACRVVf//8Kqr/wAeqqv//+qqqqT//+Sqqwik///kqqv/ABMqq///39VV/wANVVVm/wANVVVm/wAGqqv//9gqq4v//9VVVYv//9iqq///+dVV///aKqr///Oqq///26qr///zqqv//9uqq///7dVV///f1VVzb3Nv///igAD//+mAAGh6aHr//9fVVf//94AA///SqquLCP//01VVi///1yqrk2abZptr/wAVqqtw/wAbVVVw/wAbVVV2/wAgKqt8sHyw///4gAD/ACcqq4v/AClVVQgOmvc3+CAVNQr7YvfMFTYKDnX3CPcXFTcKDof3kvkcFTgKDvX47PejFTkKDpqI+VgV95z9WM2L96H5WEWL+3r9Aft4+QEFDvgCkPlYFToKDqz3n/gIFfue/Ajai/d099T3dPvU3Yv7m/gI94T35DyL+137tPtg97Q9iwUOh/eS98UVOwoOdaK/FTwKDvvS93T5QBW7+yr+DPcquzH5rAcO+2T3/XkV+8T5jld598P9jgUO+9Kv+wAVW/cq+gz7Klvl/awHDuP3yvlYFft4/FjEi/dW+CL3V/wiw4v7ePhYBQ49QARZ+Ii9Bw73RvjIFT0KDlD4S/dWFT4K+wyxFT8KDqzO+YgV/YjH3I0H/wAJVVV7/wALqqv///Iqq5n///RVVZn///RVVf8ADyqr///2VVb/ABBVVf//+FVV/wAQVVX///hVVf8AESqr///6VVad///8VVWd///8VVX/ABGqq////iqr/wARVVWL/wAjVVWL/wAggACR/wAdqquX/wAdqquX/wAZqqr/ABDVVf8AFaqr/wAVqqsI/wAVqqv/ABWqq/8AENVV/wAZqqqX/wAdqquX/wAdqquR/wAggACL/wAjVVWL/wAjVVWF/wAggAB//wAdqqt//wAdqqv//+8qq/8AGaqq///qVVX/ABWqq///6lVV/wAVqqv//+ZVVv8AENVV///iVVWX///iVVWX///fgACR///cqquLCP//7qqri///7lVV///+Kqt5///8VVV5///8VVX//+7VVf//+lVW///vqqv///hVVf//76qr///4VVX///DVVf//9lVWff//9FVVff//9FVV///0VVX///Iqq///9qqrewiJ+AsGhfyhFUAKDir4Z88VQQoOrPh43BVCCpP3KhVDCg51+HziFUQKXfdLFUUKDvuu9wb4LBVGCg6s+LSpFUcKUfdjFUgKDnXb+YgVSQoO5fhiFUoKQPdLFUsKDvcqOhVMCkD5ahVLCg4q2/mIFU0KDuX5iBVOCg73ptv34BX74Mf3eweLq/8ABCqr/wAb1VX/AAhVVf8AF6qr/wAIVVX/ABeqq/8AC1VW/wATqqr/AA5VVf8AD6qr/wAOVVX/AA+qq5z/AAuqqv8AE6qr/wAHqqv/ABOqq/8AB6qr/wAU1VX/AAPVVaGL/wAgqquL/wAYKqp+/wAPqqtx/wAPqqtx/wAH1VX//92qq4v//9VVVQj7qsf3mAeL/wAQqqv/AAIqq/8AEaqq/wAEVVX/ABKqq/8ABFVV/wASqqv/AAdVVv8AEVVV/wAKVVWb/wAKVVWb/wAOKqv/AA0qq53/AApVVZ3/AApVVaL/AAUqq6eLo4v/ABOAAP//+9VVmv//96qrmv//96qr/wALqqv///TVVf8ACFVVfQj/AAhVVX3/AAXVVv//8Cqr/wADVVX//+5VVf8AA1VV///uVVX/AAGqq///7dVWi///7VVVCPukx/enB4v/ABlVVf///YAA/wAYqquGo4ajgv8AFSqrfv8AElVVfv8AElVV///uKqv/AA7VVv//6VVV/wALVVX//+lVVf8AC1VV///iqqv/AAWqq2eLa4v//+GAAINue257///qKqv//+aqq///8VVV///dVVUI///0qqv/ACNVVf//7aqq/wAZgAD//+aqq/8AD6qr///mqqv/AA+qq2//AAfVVf//4VVVi///2qqri///31VV///21VVv///tqqtv///tqqt3///qKqp////mqqsIiAb///6qq/8ABKqr////Kqr/AApVVf///6qrm////6qrm////4AA/wAQqqv///9VVf8AEVVVCE8Gi4X/AABVVf//94AA/wAAqquA/wAAqquA/wAAgAD///Qqq/8AAFVV///zVVX/AABVVf//81VV/wAAgAD///OAAP8AAKqr///zqqv/AACqq///86qr/wAAVVX///WAAIv///dVVQgOddv34BVPCg6bwfd7FVAKxxZRCg6szvhiFf1Gx/fJjQf/AAlVVXv/AAuqq///8iqrmf//9FVVmf//9FVV/wAPKqv///ZVVv8AEFVV///4VVX/ABBVVf//+FVV/wARKqv///pVVp3///xVVZ3///xVVf8AEaqr///+Kqv/ABFVVYv/ACNVVYv/ACCAAJH/AB2qq5f/AB2qq5f/ABmqqv8AENVV/wAVqqv/ABWqqwj/ABWqq/8AFaqr/wAQ1VX/ABmqqpf/AB2qq5f/AB2qq5H/ACCAAIv/ACNVVYv/ACNVVYX/ACCAAH//AB2qq3//AB2qq///7yqr/wAZqqr//+pVVf8AFaqr///qVVX/ABWqq///5lVW/wAQ1VX//+JVVZf//+JVVZf//9+AAJH//9yqq4sI///uqquL///uVVX///4qq3n///xVVXn///xVVf//7tVV///6VVb//++qq///+FVV///vqqv///hVVf//8NVV///2VVZ9///0VVV9///0VVX///RVVf//8iqr///2qqt7CIncBoX7exVACg6s+HjcFfvJx/lGTzqJB///9qqrm///9FVV/wAN1VV9/wALqqt9/wALqqv///DVVf8ACaqq///vqqv/AAeqq///76qr/wAHqqv//+7VVf8ABaqqef8AA6qref8AA6qr///uVVX/AAHVVf//7qqri///3Kqri///31VVhW1/bX///+ZVVf//7yqr///qqqv//+pVVQj//+qqq///6lVV///vVVX//+ZVVn///+JVVX///+JVVYX//9+AAIv//9yqq4v//9yqq5H//9+AAJf//+JVVZf//+JVVf8AEKqr///mVVb/ABVVVf//6lVV/wAVVVX//+pVVf8AGaqr///vKqupf6l//wAgqquF/wAjVVWLCP8AEVVVi/8AEaqr/wAB1VWd/wADqqud/wADqqv/ABEqq/8ABaqq/wAQVVX/AAeqq/8AEFVV/wAHqqv/AA8qq/8ACaqqmf8AC6qrmf8AC6qr/wALqqv/AA3VVf8ACVVVmwiT9yoVQwoO+4nb9+AVUgoO+yzc9woVUwoO+4n3xvgsFVQKDnX4a/cWFVUKDvsHmvhiFfdR/GLJi/dK+GJOi/sq/CH7LvghBQ73Epr4YhVWCg4q91r3jhX7VPuO04v3Mvdl9zX7ZdmL+1r3jvc392hAi/sT+0P7FPdDPosFDvsH92b7IxVXCg77LKavFVgKDvuJ96b5QBW7WQdvi///6lVV///1VVX///Cqq///6qqr///wqqv//+qqq///+FVV///iVVWLZQj7JQeL///sqquKeIn//+1VVYn//+1VVf///FVV///vgAD///qqq///8aqr///6qqv///Gqq///+NVV///0gACC///3VVWC///3VVX///SAAP//+6qrfYsIWweZi/8AC4AA///7qquU///3VVWU///3VVX/AAcqq///9IAA/wAFVVX///Gqq/8ABVVV///xqqv/AAOqq///76qqjf//7aqrjf//7aqrjP//7Sqqi///7KqrCPsmB4v//9qqq/8AB6qr///igAD/AA9VVf//6lVV/wAPVVX//+pVVf8AFaqr///1Kquniwi9u3QGgYv///eAAP8AAtVVhP8ABaqrhP8ABaqr///6VVX/AAdVVf//+6qrlP//+6qrlP///NVV/wAKVVWJ/wALqquJ/wALqquK/wAL1VWLlwj3IgeLpYj/ABaAAIWehZ6E/wAPqquD/wAMVVWD/wAMVVX///gqq/8ACYAA///4VVX/AAaqq///+FVV/wAGqqv///qAAP8ABFVV///8qquNCI0H/wADVVX/AAFVVf8ABYAAj/8AB6qr/wAGqqv/AAeqq/8ABqqr/wAH1VX/AAmqqpP/AAyqq5P/AAyqq5L/AA/VVZGekZ6O/wAWgACLpQj3IQeL/wAMqquM/wAMKqqN/wALqquN/wALqqv/AAMqq/8AClVV/wAEVVWU/wAEVVWU/wAFqqv/AAdVVZL/AAWqq5L/AAWqq/8ACIAA/wAC1VWViwgO+/j3G/mCFVv+fLsGDvuJxvsAFVu9B6eL/wAVqqv/AAqqq/8AD1VV/wAVVVX/AA9VVf8AFVVV/wAHqqv/AB2qq4uxCPclB4v/ABNVVYyejf8AEqqrjf8AEqqr/wADqqv/ABCAAP8ABVVV/wAOVVX/AAVVVf8ADlVV/wAHKqv/AAuAAJT/AAiqq5T/AAiqq/8AC4AA/wAEVVWZiwi7B32L///0gAD/AARVVYL/AAiqq4L/AAiqq///+NVV/wALgAD///qqq/8ADlVV///6qqv/AA5VVf///FVV/wAQVVaJ/wASVVWJ/wASVVWK/wAS1VaL/wATVVUI9yYHi/8AJVVV///4VVX/AB2AAP//8Kqr/wAVqqv///Cqq/8AFaqr///qVVX/AArVVW+LCFlbogaVi/8ACIAA///9KquS///6VVWS///6VVX/AAWqq///+Kqr/wAEVVWC/wAEVVWC/wADKqv///Wqq43///RVVY3///RVVYz///Qqq4t/CPsiB4txjv//6YAAkXiReJL///BVVZP///Oqq5P///Oqq/8AB9VV///2gAD/AAeqq///+VVV/wAHqqv///lVVf8ABYAA///7qqv/AANVVYkIiQf///yqq////qqr///6gACH///4VVX///lVVf//+FVV///5VVX///gqq///9lVWg///81VVg///81VVhP//8CqrhXiFeIj//+mAAItxCPshB4v///NVVYr///PVVon///RVVYn///RVVf///NVV///1qqv///uqq4L///uqq4L///pVVf//+KqrhP//+lVVhP//+lVV///3gAD///0qq4GLCA7j+Mf34BVpqwX///Sqq///7qqr///zgAD///BVVf//8lVVff//8lVVff//7yqrhHeL///zVVWL///xVVb/AAMqq///71VV/wAGVVX//+9VVf8ABlVVef8AB4AA///sqqv/AAiqq///7VVVk///7NVWk///7FVVk///7FVVk///7NVWj///7VVViwj//+9VVYv///Eqq////VVVfv//+qqrfv//+qqr///0gACEgf//91VVgf//91VV///3Kqv///ZVVv//+FVV///1VVX///hVVf//9VVV///5gAD///VVVv//+qqr///1VVUIrWsF/wALVVX/ABFVVf8ADIAA/wAPqqv/AA2qq5n/AA2qq5n/ABDVVZKfi/8ADKqri/8ADqqq///81VX/ABCqq///+aqr/wAQqqv///mqq53///iAAP8AE1VV///3VVX/ABKqq4P/ABMqqoP/ABOqq4P/ABOqq4P/ABMqqof/ABKqq4sI/wAQqquL/wAO1VX/AAKAAJiQmJD/AAuAAP8ABqqrlf8ACFVVlf8ACFVV/wAI1VX/AAmqq/8AB6qrlv8AB6qrlv8ABoAA/wALKqv/AAVVVf8AC1VVCA770g77ZPcv98AV/J7H+J4HnfckFVkKDlH3lPg1FfwGB3X/AASqq///7Cqr/wAIKqr//+5VVf8AC6qr///uVVX/AAuqq///8NVW/wAOKqr///NVVf8AEKqr///zVVX/ABCqq///9lVW/wASgAD///lVVf8AFFVV///5VVX/ABRVVf///Kqr/wAVKquLoYuh/wADKqv/ABVVVf8ABlVV/wAUqqv/AAZVVf8AFKqr/wAJVVb/ABKqqv8ADFVV/wAQqqsI/wAMVVX/ABCqq5qZ/wARqqv/AAtVVf8AEaqr/wALVVX/ABSAAP8AB1VW/wAXVVX/AANVVQi7/AsV+AwH/wAYqquJ/wAVqqr///nVVf8AEqqr///1qqv/ABKqq///9aqrnP//8iqq/wAPVVX//+6qqwi7rwX//+qqq6P//+eAAP8AEtVV///kVVX/AA2qq///5FVV/wANqqv//+HVVv8AByqq///fVVX/AACqqwjSW0MHbYf//+SAAP//9yqrcv//8lVVcv//8lVV///qgAD//+6qq3l2eXZ9c4FwgXCG///i1VWL///gqquL///gqqv/AATVVf//4qqq/wAJqqv//+Sqq/8ACaqr///kqqv/AA3VVf//54AAnf//6lVVCJ3//+pVVf8AFYAA///uKqukfaR9/wAb1VWC/wAeqquHCEO70AfNjcH/ABqqq7X/ADNVVQhdsQX///FVVXn//+7VVv//8Sqr///sVVX///RVVf//7FVV///0VVX//+qAAP//+YAA///oqqv///6qqwgOUcXBFVX4NMH7ife09znB+zn3EAeL/wAOqqv/AAKqq5v/AAVVVf8AEVVV/wAFVVX/ABFVVf8ACFVW/wAP1Vb/AAtVVf8ADlVV/wALVVX/AA5VVf8ADoAAl/8AEaqr/wAJqqv/ABGqq/8ACaqr/wAVgAD/AATVVf8AGVVVi/8AFVVVi/8AE4AA///7Kqv/ABGqq///9lVV/wARqqv///ZVVf8AD9VV///0KquZfQizuwX//9VVVf8AJVVV///QVVb/ABKqq///y1VVi///2VVVi///31VW///5gAD//+VVVX7//+VVVX7//+pVVv//71VV///vVVX//+uqq///71VV///rqqt////pqqr///iqq///56qr///4qqv//+eqq////FVV///ogACL///pVVUI+wksVer7tAcOUdL3WRVSVK1mxMMFof//7qqr/wAYVVX///LVVf8AGqqrgv8AGqqrgv8AG1VV///7gACni6eL/wAbVVX/AASAAP8AGqqrlP8AGqqrlP8AGFVV/wANKquh/wARVVUIxFOtsFLCBbP/ACtVVZ//ADRVVov/AD1VVYv/AD1VVXf/ADRVVmP/ACtVVQjEwmmwUlMFdf8AEVVV///nqqv/AA0qq///5VVVlP//5VVVlP//5Kqr/wAEgABvi2+L///kqqv///uAAP//5VVVgv//5VVVgv//56qr///y1VV1///uqqsIUsNpZsRUBWP//9Sqq3f//8uqqov//8Kqq4v//8Kqq5///8uqqrP//9Sqqwj3MQSL/wAaqquQpJX/ABdVVZX/ABdVVf8ADaqr/wAUVVb/ABFVVf8AEVVV/wARVVX/ABFVVZ//AA2qq/8AFqqrlf8AFqqrlf8AGFVVkKWLpYv/ABhVVYb/ABaqq4H/ABaqq4Gf///yVVX/ABFVVf//7qqrCP8AEVVV///uqqv/AA2qq///66qqlf//6Kqrlf//6KqrkHKL///lVVWL///lVVWGcoH//+iqq4H//+iqq///8lVV///rqqr//+6qq///7qqr///uqqv//+6qq3f///JVVf//6VVVgf//6VVVgf//56qrhnGLCHGL///nqquQ///pVVWV///pVVWVd/8ADaqr///uqqv/ABFVVf//7qqr/wARVVX///JVVf8AFFVWgf8AF1VVgf8AF1VVhqSL/wAaqqsIDlH3d/dIFftIzfdI9z67+z7YB5Sb9zWLi7v7Gov3U/fnSov7V/vs+1T37EeL91P75/sai4tb9zWLlHuLPgX7PlsGDvv49xv5NxVb+/K7BvsqBFv78rsGDlH3zvdDFSW/Bf//7VVV/wAJVVV7/wAKqqv///Kqq5f///Kqq5f///lVVf8AEqqri/8AGVVVi/8ADVVVjv8AC9VWkf8AClVVkf8AClVV/wAH1VWU/wAJqqv/AAeqq/8ACaqr/wAHqqv/AAqAAP8ABoAA/wALVVX/AAVVVf8AC1VV/wAFVVWW/wAEVVb/AAqqq/8AA1VVCNZiBZOH/wAIVVX///rVVf8ACKqr///5qqv/AAiqq///+aqrk///+Kqq/wAHVVX///eqq/8AB1VV///3qquR///21VX/AASqq4H/AASqq4H/AAJVVYCLf4v///VVVf///aqr///11Vb///tVVf//9lVV///7VVX///ZVVYX///cqq///+Kqrgwj///iqq4P///fVVf//+Kqrgv//+VVVgv//+VVV///3Kqv///pVVv//91VV///7VVUI+1H7PRVObQWT///rVVX/AAqqq///7iqr/wANVVV8/wANVVV8mv//84AA/wAQqquB/wAQqquB/wASKqr///iqq/8AE6qr///7VVX/ABOqq///+1VV/wAUKqr///2qq/8AFKqri6OL/wAXKqv/AAOqq/8AFlVV/wAHVVX/ABZVVf8AB1VV/wAT1Vb/AArVVv8AEVVV/wAOVVUI/wARVVX/AA5VVf8ADdVW/wARgAD/AApVVf8AFKqr/wAKVVX/ABSqq/8ABSqr/wAXqqqL/wAaqquL/wAaqquE/wAX1VV9oH2gef8AESqrdf8ADVVV/wAZVVWZ/wAVKqv/ABHVVZz/ABWqq5z/ABWqq/8ACIAA/wAaKqqL/wAeqqsIi/8AHVVV///41VX/ABiqq///8aqrn///8aqrn///7iqq/wARVVX//+qqq/8ADqqr///qqqv/AA6qq3T/AAzVVf//51VVlv//51VVlnT/AAtVVf//6qqr/wALqqv//+qqq/8AC6qr///uKqqY///xqqv/AA5VVf//8aqr/wAOVVX///jVVf8AEdVWi/8AFVVVCIub/wADVVX/AA4qq/8ABqqr/wAMVVX/AAaqq/8ADFVV/wAIqqr/AAoqq/8ACqqrk/8ACqqrk/8ADFVVkZmPmY//AA6qq43/AA9VVYuji/8AFSqr///6VVX/ABJVVf//9Kqr/wASVVX///Sqq/8ADdVWev8ACVVV///pVVUIxa0F///5VVX/ABCqq///9yqr/wAOVVWAl4CX///zVVX/AAmqq///8aqr/wAHVVX///Gqq/8AB1VV///wqqr/AAWAAP//76qr/wADqqv//++qq/8AA6qr///vgAD/AAHVVf//71VVi///6Kqri///6VVV///8qqt1///5VVV1///5VVX//+wqq4H//+5VVf//8qqrCP//7lVV///yqqv///HVVv//76qq///1VVX//+yqq///9VVV///sqqv///qqq///6VVVi3GLbf8AB6qrcv8AD1VVd/8AD1VVd/8AE6qr///uqquj///xVVV9hf//8qqr///5Kqv///NVVf//+FVV///zVVX///hVVf//9Kqr///21VaB///1VVUIgf//9VVV///4Kqt////6VVX///Kqq///+lVV///yqqv///0qq3yL///vVVWL///gqqv/AAdVVf//5iqq/wAOqqv//+uqq/8ADqqr///rqqv/ABJVVf//7lVVoXyhfKN+pYClgKP///Sqq6H///RVVQih///0VVX/ABJVVf//8qqr/wAOqqt8/wAOqqt8/wAHVVX//+0qq4v//+lVVYt7///8gAB9hH+Ef///9tVV///11VX///Sqq///96qr///0qqv///eqq37///nVVf//8VVVh///8VVVh///8VVWif//8VVViwj//+Cqq4v//+VVVf8AB4AAdZp1mv//71VV/wAWgAD///Sqq6kIDnT5IBUhCvdSFiEKDvdy+LD4QxXBBv///Kqr/wAYqquE/wAVqqr///VVVf8AEqqr///1VVX/ABKqq///8lVW/wAP1VX//+9VVZj//+9VVZj//+0qq/8ACdVVdv8ABqqrdv8ABqqr///p1VX/AANVVf//6Kqri2mL///hqqv///pVVf//5VVV///0qqv//+VVVf//9Kqr///pqqt7ef//61VVCHn//+tVVf//8iqr///nqqv///ZVVW////ZVVW////sqq///4aqri///31VVi///3qqr/wAE1VX//+GAAP8ACaqr///kVVX/AAmqq///5FVV/wAN1VX//+fVVp3//+tVVZ3//+tVVf8AFlVVe/8AGqqr///0qqv/ABqqq///9Kqr/wAeVVX///pVVa2LCP8AF1VVi/8AFiqr/wADVVWg/wAGqqug/wAGqqv/ABLVVf8ACdVV/wAQqquY/wAQqquY/wANqqr/AA/VVf8ACqqr/wASqqv/AAqqq/8AEqqrkv8AFaqq/wADVVX/ABiqqwhVBv///VVVff//+yqr///y1VWE///zqquE///zqquCgID///ZVVYD///ZVVX7///hVVnz///pVVXz///pVVf//74AA///9Kqt5i///5qqri///6VVV/wAE1VV3/wAJqqt3/wAJqqv//+8qq5j///JVVf8AEFVVCP//8lVV/wAQVVX///WAAP8AEyqr///4qquh///4qquh///8VVX/ABdVVYv/ABiqq4v/ABiqq/8AA6qr/wAXKqr/AAdVVf8AFaqr/wAHVVX/ABWqq/8ACoAA/wATKqr/AA2qq/8AEKqr/wANqqv/ABCqq/8AENVV/wANKqqf/wAJqquf/wAJqqv/ABaqq/8ABNVV/wAZVVWLCP8AJKqr////VVX/AB1VVf//9VVWof//61VVof//61VVmXOR///kqqsI/JQ+FVoKwRZbCg77hfeO+O4VSwZ5i3n///6qq3n///1VVXn///1VVf//76qrhv//8VVV///4qqv///FVVf//+Kqr///0KquBgv//81VVgv//81VV///7gAB7i///7Kqri///8VVVjv//84AAkf//9aqrkf//9aqr/wAIKqv///eqqv8AClVV///5qqsI/wAKVVX///mqq/8AC9VW///7VVX/AA1VVYj/AA1VVYj/AA2qq////oAAmYv/ABdVVYv/ABRVVo//ABFVVZP/ABFVVZP/AA5VVv8ADVVV/wALVVX/ABKqqwiNBv8AAKqr///3VVX/AABVVYOL///4qquL///4qquM///4qqqN///4qqsIvAb///1VVZv///6AAP8AEIAA////qquc////qquc////1VX/ABEqq4v/ABFVVQjbB4v/ACiqq4H/ABxVVXebd5ttk2OL///IqquL///UVVV+a3EIpWUFmf8AC1VV/wAOKqv/AAiqq/8ADlVVkf8ADlVVkf8AESqrjp+Lm4v/AA0qq////oAA/wAKVVWI/wAKVVWI/wAIVVb///uqq/8ABlVV///6VVX/AAZVVf//+lVV/wAEgACE/wACqqv///eqq/8AAqqr///3qqv/AAGqqv//9oAA/wAAqqv///VVVQhlWBWxhAaL///3VVX///5VVf//9oAA///8qqv///Wqq////Kqr///1qqv///qAAP//9oAA///4VVX///dVVf//+FVV///3VVWB///41Vb///Oqq///+lVV///zqqv///pVVf//8Sqq///9Kqv//+6qq4t5i///74AA/wAD1VV8/wAHqqt8/wAHqqv///iAAP8ACdVVi5cIi/8ACqqr/wAEKqv/AAjVVf8ACFVVkv8ACFVVkv8ACoAA/wAFgAD/AAyqq4//AAyqq4+Z/wACqqv/AA9VVf8AAVVV/wAPVVX/AAFVVf8ADqqr/wAAqquZiwgOKsr3gRVcCqj7XxVcCg7j+LD38xX7bbv3nfySWwcO+4m295wVVfeLwQcO93L30/chFfdQ2Af3FPtQyIv7FPdQBf8ADqqr/wACqqv/AA3VVf8ABCqqmP8ABaqrmP8ABaqr/wALgAD/AAeqqpX/AAmqq5X/AAmqq/8AB9VV/wAL1VX/AAWqq5n/AAWqq5n/AALVVZyLn4v/ACaqq///9aqr/wAdgAD//+tVVf8AFFVV///rVVX/ABRVVf//3VVW/wAKKqv//89VVYsI+zn8QQbB94AV9yXrB/8AC1VVi/8AC4AA///+1VX/AAuqq////aqr/wALqqv///2qq/8AClVV///8KqqU///6qquU///6qqv/AAdVVf//+NVV/wAFqquC/wAFqquC/wAC1VX///SAAIt9i3n///xVVf//8iqr///4qqv///ZVVf//+Kqr///2VVX///aAAP//+Kqr///0VVWGCP//9FVVhv//8tVWiP//8VVViv//8VVViv//8VVW////gAD///FVVYsI+/x0FVoKwRZbCg73kPjyFV0KDvtG91z4RBWfi/8AEqqr/wAD1VX/ABFVVf8AB6qr/wARVVX/AAeqq/8ADyqr/wAKVVWYmJiY/wAKVVX/AA9VVf8AB6qr/wARqqv/AAeqq/8AEaqr/wAD1VX/ABLVVYufi5////wqq/8AEqqr///4VVX/ABFVVf//+FVV/wARVVX///Wqq/8ADyqrfpgIfpj///DVVf8ACiqr///uqqv/AAdVVf//7qqr/wAHVVX//+1VVf8AA6qrd4t3i///7Sqr///8VVX//+5VVf//+Kqr///uVVX///iqq///8Kqr///11VV+fn5+///11VX///DVVf//+Kqr///uqqv///iqq///7qqr///8VVX//+1VVYt3CIt3/wADqqv//+0qq/8AB1VV///uVVX/AAdVVf//7lVV/wAKKqv///Cqq5h+mH7/AA9VVf//9aqr/wARqqv///hVVf8AEaqr///4VVX/ABLVVf///Cqrn4sIuwT//+VVVYv//+lVVv8ACVVV///tVVX/ABKqq///7VVV/wASqqv///aqq/8AFqqqi/8AGqqri/8AGqqr/wAJVVX/ABaqqv8AEqqr/wASqqv/ABKqq/8AEqqr/wAWqqr/AAlVVf8AGqqri/8AGqqri/8AFqqq///2qqv/ABKqq///7VVV/wASqqv//+1VVf8ACVVV///pVVaL///lVVUIi///5VVV///2qqv//+lVVv//7VVV///tVVX//+1VVf//7VVV///pVVb///aqq///5VVViwgO49n4CxVb93j7S7v3S/d+u/t+90tb+0sH+3T7qxVb+Iq7Bw77hKL34BVeCg77hPcT+KwVW5wH/wAOqquL/wAOKqr///6qq/8ADaqr///9VVX/AA2qq////VVVl///+6qr/wAKVVWF/wAKVVWF/wAIVVb///fVVf8ABlVV///1qqv/AAZVVf//9aqr/wADKqv///LVVYt7i4H///1VVf//9lVV///6qqv///aqq///+qqr///2qqv///kqqv//99VV///3qquECP//96qrhP//9lVV///6gACAh4CH///01VWJ///0qquLcYt3/wAFVVV9/wAKqqt9/wAKqqv///VVVf8ADlVV///4qqudCFx5BZdrnf//6Sqro///8lVVo///8lVV/wAcVVX///kqq/8AIKqri/8AFKqri/8AEyqq/wAC1VX/ABGqq/8ABaqr/wARqqv/AAWqq/8AD1VVk5j/AApVVZj/AApVVf8ACiqr/wAMqqv/AAdVVZr/AAdVVZr/AAOqq/8AENVVi/8AEqqrCIv/ABtVVf//96qr/wAXqqv//+9VVZ///+9VVZ90l///4qqrjwiNB/8AF1VV/wAHVVX/ABOAAP8ADIAA/wAPqqv/ABGqq/8AD6qr/wARqqv/AAfVVf8AFIAAi/8AF1VVi/8AEKqr///8qqua///5VVX/AA1VVf//+VVV/wANVVX///aqq/8AC1VWf/8ACVVVf/8ACVVVff8AByqre5B7kHr/AAKAAHmLCP//41VVi3L///kqq///6qqr///yVVX//+qqq///8lVV///uqqr//+6AAP//8qqr///qqqsIsnIF/wAJVVX/AA9VVf8ADCqr/wAMKqualJqU/wARKqv/AASAAP8AE1VVi/8AF1VVi/8AEqqr///6KquZ///0VVWZ///0VVWS///xgACL///uqquLfYj///Qqq4X///ZVVYX///ZVVf//+FVV///4VVb///aqq///+lVVCP//9qqr///6VVX///Wqqv//+9VW///0qqv///1VVf//9Kqr///9VVX///VVVf///qqrgYsIDvc6+VgVXwoOdfhr9xYVYAoOofef99cV/FXH+ab3D/2mx/nW+3cH//+5VVWL///JKqv//+8qq2T//95VVWT//95VVf//7IAA///PgACL///AqquLcf8ABVVV///nqqv/AAqqq///6VVV/wAKqqv//+lVVf8ADoAAd/8AElVV///uqqv/ABJVVf//7qqr/wAV1Vb///JVVf8AGVVVgf8AGVVVgf8AG1VWhv8AHVVViwgO+9Ld99IVIQoO9xBLFbrLZYtMM5t8BZn/AAVVVf8ADqqr/wACqqv/AA9VVYv/AA1VVYv/AAyqq////NVVl///+aqrl///+aqrkf//9Sqqi///8Kqri4OJ///5VVWH///6qquH///6qqv///rVVf//+6qq///5qqv///yqq///+aqr///8qqv///kqqv///YAA///4qqv///5VVQj///iqq////lVVhP///yqr///5VVWL///jVVWL///mqqv/AAWqq3X/AAtVVQh9awWpff8AH6qrhP8AIVVVi/8ADKqri5j/AAGqq/8ADVVV/wADVVX/AA1VVf8AA1VV/wAMKquQlv8ABqqrlv8ABqqr/wAI1VX/AAiqqv8ABqqr/wAKqqv/AAaqq/8ACqqr/wADVVWYi/8AD1VVi6P///eAAJ16lwh6l///7NVVkf//6qqri3+L///1qqv///2qq///91VV///7VVUIDvuE90X5KBVhCg77VK340BWLdf8AA6qrd/8AB1VVef8AB1VVef8ACqqr///wgACZfpl+/wAQqqv///XVVf8AE1VV///4qqv/ABNVVf//+Kqr/wAVqqv///xVVaOL/wAWqquL/wAVKqr/AAOqq/8AE6qr/wAHVVX/ABOqq/8AB1VVnP8ACiqr/wAOVVWYCP8ADlVVmP8ACyqr/wAPgACTnZOdj5+LoYv/ABaqq4f/ABRVVYOdg53///TVVf8AD4AA///xqquY///xqquYepX//+xVVZL//+xVVZL//+rVVv8AA4AA///pVVWLCHOL///qVVX///xVVf//7Kqr///4qqv//+yqq///+Kqr///vVVX///XVVX1+fX7///VVVf//8IAA///4qqt5///4qqt5///8VVV3i3UIuxaLmf8AAqqr/wANVVX/AAVVVf8ADKqr/wAFVVX/AAyqq/8AB6qr/wALVVWVlZWV/wALqqv/AAfVVf8ADVVV/wAFqqv/AA1VVf8ABaqr/wAOqqv/AALVVZuLrYv/ABsqq///9dVV/wAUVVX//+uqq/8AFFVV///rqqv/AAoqq///5tVVi20Ii///8VVV///9Kqv///JVVv//+lVV///zVVX///pVVf//81VV///4Kqv///TVVoH///ZVVYH///ZVVf//9Cqr///4VVb///JVVf//+lVV///yVVX///pVVf//8Sqr///9Kqt7i3uL///xKqv/AALVVf//8lVV/wAFqqv///JVVf8ABaqr///0VVb/AAfVVf//9lVVlQj///ZVVZX///iAAP8AC1VV///6qqv/AAyqq///+qqr/wAMqqv///1VVf8ADVVVi5kIDir3kPeBFWIK98P3XxViCg73XPcm+SgVYQr4kvcoFSIKkvz4FWMK91L3jhVkCg73XPce+SgVYQr4kfcoFSIK+yr9MxVeCg73XPcN+KwVW5wH/wAOqquL/wAOKqr///6qq/8ADaqr///9VVX/AA2qq////VVVl///+6qr/wAKVVWF/wAKVVWF/wAIVVb///fVVf8ABlVV///1qqv/AAZVVf//9aqr/wADKqv///LVVYt7i4H///1VVf//9lVV///6qqv///aqq///+qqr///2qqv///kqqv//99VV///3qquECP//96qrhP//9lVV///6gACAh4CH///01VWJ///0qquLcYt3/wAFVVV9/wAKqqt9/wAKqqv///VVVf8ADlVV///4qqudCFt5Bf8ADKqra/8AElVV///pKquj///yVVWj///yVVX/ABxVVf//+Sqr/wAgqquL/wAUqquL/wATKqr/AALVVf8AEaqr/wAFqqv/ABGqq/8ABaqr/wAPVVWTmP8AClVVmP8AClVV/wAKKqv/AAyqq/8AB1VVmv8AB1VVmv8AA6qr/wAQ1VWL/wASqqsIi/8AG1VV///3qqv/ABeqq///71VVn///71VVn3SX///iqquPCI0H/wAXVVX/AAdVVf8AE4AA/wAMgAD/AA+qq/8AEaqr/wAPqqv/ABGqq/8AB9VV/wAUgACL/wAXVVWL/wAQqqv///yqq5r///lVVf8ADVVV///5VVX/AA1VVf//9qqr/wALVVZ//wAJVVV//wAJVVV9/wAHKqt7kHuQev8AAoAAeYsI///jVVWLcv//+Sqr///qqqv///JVVf//6qqr///yVVX//+6qqv//7oAA///yqqv//+qqqwiycgX/AAlVVf8AD1VV/wAMKqv/AAwqq5qUmpT/ABEqq/8ABIAA/wATVVWL/wAXVVWL/wASqqv///oqq5n///RVVZn///RVVZL///GAAIv//+6qq4t9iP//9FVVhf//9qqrhf//9qqr///4VVX///iAAP//9qqr///6VVUI///2qqv///pVVf//9aqq///71Vb///Sqq////VVV///0qqv///1VVf//9VVV///+VVaB////VVUI+HL3YhUiCm/8+BVjCvdQ944VZAoO+wf3l/dsFd9PSweL///oqquH///sKqqD///vqquD///vqquB///xVVV/fn9+fv//81VVff//86qrff//86qrfv//8oAAf///8VVVf///8VVVgXqD///sqquD///sqquH///oVVWLbwiL///kqqv/AASqq///56qq/wAJVVX//+qqq/8ACVVV///qqqv/AAzVVnn/ABBVVf//8VVV/wAQVVX///FVVf8AE4AA///01Vb/ABaqq///+FVV/wAWqqv///hVVf8AGFVV///8Kquli72L/wAqqqv/AA4qq/8AI1VV/wAcVVX/ACNVVf8AHFVV/wAWVVb/ACfVVv8ACVVV/wAzVVUISpMF///4qqv//91VVf//8Sqqb///6aqr///qqqv//+mqq///6qqr///jKqr///VVVf//3Kqri///21VVi///41VW/wALKqv//+tVVf8AFlVV///rVVX/ABZVVf//9aqr/wAdKquLr4uh/wAD1VWe/wAHqqub/wAHqqub/wAJqqr/AA7VVf8AC6qr/wANqqsI/wALqqv/AA2qq/8ADIAA/wAM1VX/AA1VVZf/AA1VVZf/AAyAAP8ADKqr/wALqqv/AA1VVf8AC6qr/wANVVX/AAmqqpr/AAeqq/8AEKqr/wAHqqv/ABCqq/8AA9VV/wATVVWLoQic93gVWQoO9vfO+VgVJQpmQxUmCvdx+IwVPQoO9vfO+VgVJQpmQxUmCvdl+RwVXwoO9vfO+VgVJQpmQxUmCvcU+RwVZQoO9vfO+VgVJQpmQxUmCpL4nRVmCg729875WBUlCmZDFSYKn/jkFSEK91IWIQoO9vfO+VgVJQpmQxUmCtH44RVnCvcqFmgKDvfw+Fz5WBX8Yf1Y0Yv3D/dQ98yLi/tQ+AOLi8f7wYuL96j3qIuLx/uoi4v3kPe5i4vHBfv7TxX8JPulB/eZ+CQFDvcS+Tz3AxVVtAX///NVVf//7Kqr///xVVb//++AAP//71VV///yVVX//+9VVf//8lVV///ugAD///Sqq///7aqrgv//7aqrgv//7Sqq///5VVX//+yqq///+6qr///sqqv///uqq///7VVV///91VV5i12L///WgACTZptmm///4IAAoXGnCHGnd6x9sX2xhLSLt4u3krSZsZmxn6ylp6Wn/wAfgAChsJuwm/8AKYAAk7mLCK+L/wAjKqv///hVVf8AIlVV///wqqv/ACJVVf//8Kqr/wAcKqv//+eqqqH//96qqwjBuAX//+Cqq7P//9uAAP8AHIAA///WVVWc///WVVWc///TKqv/AAiAAFuLVYv//86AAP//9qqrXv//7VVVXv//7VVV///ZgAD//+Yqq2tqa2py///Y1VV5///Sqqt5///SqquC///OVVWLVQiL///PVVX/AAdVVf//0qqr/wAOqqth/wAOqqth/wAUqqpm/wAaqqtr/wAaqqtr/wAgKqr//+WAAP8AJaqrdv8AJaqrdv8AKYAA///ygAD/AC1VVYUIVUCbfAWZ/wAFVVX/AA6qq/8AAqqr/wAPVVWL/wANVVWL/wAMqqv///zVVZf///mqq5f///mqq5H///Uqqov///Cqq4uDif//+VVVh///+qqrh///+qqr///61VX///uqqv//+aqr///8qqv///mqq////Kqr///5Kqr///2AAP//+Kqr///+VVUI///4qqv///5VVYT///8qq///+VVVi///41VVi///5qqr/wAFqqt1/wALVVUIfWsFqX3/AB+qq4T/ACFVVYv/AAyqq4uY/wABqqv/AA1VVf8AA1VV/wANVVX/AANVVf8ADCqrkJb/AAaqq5b/AAaqq/8ACNVV/wAIqqr/AAaqq/8ACqqr/wAGqqv/AAqqq/8AA1VVmIv/AA9VVYuj///3gACdepcIepf//+zVVZH//+qqq4t/i///9aqr///9qqv///dVVf//+1VVCImNrboF/wAEqqv///9VVf8ABIAA////qqv/AARVVYsI/wANgAAGv4v/ADBVVZX/ACyqq5//ACyqq5//ACdVVaytuQgOmuz5WBUqCvtDtxU9Cg6a7PlYFSoK+0/3UBVfCg6a7PlYFSoK+6D3UBVlCg6a7PlYFSoK/Az3GBUhCvdSFiEKDvvS7PlYFS0KpLcVPQoO+9Ls+VgVLQqY91AVXwoO+9Ls+VgVLQpH91AVZQoO+9Ls+VgVLQr7RPcYFSEK91IWIQoO9zf3LvggFWkK+9hVFWoKDvdc7PlYFTEKvsgVZgoO95S+9/YVMgrNFjMK9/r4IhU9Cg73lL739hUyCs0WMwr37viyFV8KDveUvvf2FTIKzRYzCved+LIVZQoO95S+9/YVMgrNFjMK9yT4MxVmCg73lL739hUyCs0WMwr3Mfh6FSEK91IWIQoO4/fi9+UV+1r3Wmlp91r7Wvtc+1quafdb91v3Wftbra37Wvda91v3WmqtBQ73lPck7BU/Oa5s1twF/wAfVVX//+VVVf8AI6qr///rgACz///xqquz///xqqu3///41VW7i8GL/wAxgAD/AAkqq7j/ABJVVbj/ABJVVf8AJoAA/wAZqqurrKuspP8AJ1VVnf8ALaqrnf8ALaqrlP8AMdVVi8EIi/8ANVVV///3gAD/ADDVVnr/ACxVVXr/ACxVVf//59VV/wAmgAD//+Cqq/8AIKqrCNbcaapBOgX//+Cqq/8AGVVV///cqqr/ABOAAP//2Kqr/wANqqv//9iqq/8ADaqrYP8ABtVV///RVVWLVYv//86AAP//9qqrXv//7VVVXv//7VVV///ZgAD//+Yqq2tqa2py///Y1VV5///Sqqt5///SqquC///OVVWLVQiLV5P//9BVVZv//9Sqq5v//9Sqq6Jlqf//31VVCPhl+IwV/Dn8XQX//9Cqq/8AN1VV///oVVXRi/8AVKqri7eStJmxmbGfrKWnpaf/AB+AAKGwm7Cb/wApgACTuYv/ACaqq4v/ACNVVf//+lVVq///9KqrCKv///Sqq/8AHKqre/8AGVVV///rVVUI/Bn8fhX4OvheBaP//+Sqq/8AEoAAa5j//9tVVZj//9tVVf8ABoAA///YVVaL///VVVWLX4RifWV9ZXdqcW9xb///4IAAdWZ7Znv//9aAAINdiwhji///24AAkWqXapf//+LVVZz//+aqq6EIDvX47PejFTkK+1z4dRU9Cg71+Oz3oxU5Cvto+QUVXwoO9fjs96MVOQr7ufkFFWUKDvX47PejFTkK/CX4zRUhCvdSFiEKDof3kvfFFTsK9+f3UBVfCg6H7PlYFf1YzfdI9y0Hp4v/ABrVVf8AA6qr/wAZqqv/AAdVVf8AGaqr/wAHVVX/ABaqqv8ACyqr/wATqqua/wATqqua/wAPqqr/ABMqq/8AC6qr/wAXVVX/AAuqq/8AF1VV/wAF1VX/ABuqq4uri/8AJKqr///41VX/AB6AAP//8aqr/wAYVVX///Gqq/8AGFVV///tqqr/ABMqq///6aqrmQj//+mqq5n//+dVVf8ACdVVcP8ABaqrcP8ABaqr///mKqv/AALVVf//51VViwj7H/cwBoz8aBU0Cg6a9574XhVVoAf/ABiqq4v/ABeqqv///FVV/wAWqqv///iqq/8AFqqr///4qqv/ABQqqv//9NVV/wARqqt8/wARqqt8mf//7NVV/wAKVVX//+iqq/8AClVV///oqqv/AAUqq///5Kqqi///4Kqri3H///uqq///6FVV///3VVX//+qqq///91VV///qqqv///Oqq///7dVVe3wIe3z//+zVVf//9IAA///pqquD///pqquD///ngACH///lVVWL///2qquLgv8AAKqr///3VVX/AAFVVf//91VV/wABVVX///dVVv8AAlVW///3VVX/AANVVQhRB5OJ/wAH1VX///6qq/8AB6qr////VVX/AAeqq////1VV/wAH1VX///+qq5OLr4uskKmVqZWl/wAOqquh/wATVVWh/wATVVX/ABEqq/8AF9VW/wAMVVX/ABxVVf8ADFVV/wAcVVX/AAYqq/8AICqri68Ii/8AJqqr///7Kqv/ACAqqv//9lVV/wAZqqv///ZVVf8AGaqr///zgAD/ABTVVf//8Kqrm///8Kqrm3qX///tVVWT///tVVWT///tVVb/AAWqq///7VVV/wADVVUIjQep/wAJVVWj/wASKqudpp2mlP8AISqri/8AJ1VVi/8AHKqr///7Kqv/ABmAAP//9lVV/wAWVVX///ZVVf8AFlVVfv8AEqqr///vqqua///vqqua///sgAD/AAuAAP//6VVVk///6VVVk///56qrj3GLCGmL///h1VX///oqq///5aqr///0VVX//+Wqq///9FVV///p1VX//+/VVnn//+tVVXn//+tVVf//8oAA///nVVaC///jVVWC///jVVX///uAAP//4Kqri2kI/KrH+KEHi/8AGVVV/wACgAD/ABgqq5CikKL/AAgqq/8AFCqr/wALVVX/ABFVVf8AC1VV/wARVVWa/wANqqv/ABKqq5X/ABKqq5WikP8AG1VVi7GL/wAfKqv///VVVf8AGFVV///qqqv/ABhVVf//6qqr/wAMKqv//+BVVYthCItj///zgAD//+CAAHJ0cnT//9+AAP//9IAAY4sIDlD4S/dWFT4K+wyxFT8KivfgFT0KDlD4S/dWFT4K+wyxFT8KfvhwFV8KDlD4S/dWFT4K+wyxFT8KLfhwFWUKDlD4S/dWFT4K+wyxFT8K+2v38RVrCg5Q+Ev3VhU+CvsMsRU/Cvte+DgVIQr3UhYhCg5Q+Ev3VhU+CvsMsRU/Cvss+DUVbAr3KhZoCg73pvgc96sVgvsHB///0Kqri///2dVV///7Kqtu///2VVVu///2VVX//+mAAH97///xqqt7///xqqv///Uqq///8FVV///6VVV6///6VVV6///9Kqv///Aqq4v///FVVYv//+dVVf8ABNVVdv8ACaqr///uqqv/AAmqq///7qqr/wAMgAD///HVVf8AD1VVgAj/AA9VVYD/ABFVVoP/ABNVVYb/ABNVVYb/ABOqq////YAAn4u3i7P/AAiqq6//ABFVVa//ABFVVf8AG6qr/wAdVVb/ABNVVf8AKVVV/wAQqqtj/wAYVVVuq3mref8AJFVVgv8AKKqriwj/ACqqq4v/ACPVVf8AByqrqP8ADlVVqP8ADlVV/wAbgAD/ABgqq6WtCFytBf//8VVV///oqqv//+1VVv//7dVV///pVVV+///pVVV+///mVVb///mAAP//41VVi///5Kqri///6Cqq/wAEqqv//+uqq/8ACVVV///rqqv/AAlVVf//7yqq/wAMgAD///Kqq/8AD6qr///yqqv/AA+qq4H/ABJVVf//+VVVoP//+VVVoP///VVW/wAWgAD/AAFVVaMI9/iuBov/ACdVVf//+lVV/wAh1Vb///Sqq/8AHFVV///0qqv/ABxVVf//8NVV/wAXKqt4nXid///p1VX/AA0qq///5qqr/wAIVVX//+aqq/8ACFVV///lVVX/AAQqq2+Le4v//+/VVYn//++qq4f//++qq4f///BVVYV8gwh8g///8iqrgf//81VVf///81VVf///9VVWff//91VVe///7qqr/wAkqqv//+gqqv8AGSqq///hqqv/AA2qq///4aqr/wANqqv//9vVVf8ABtVVYYtti///4Kqr///6gAD//99VVYD//99VVYD//+Sqq///79VVdf//6qqrCK5iBf8AKKqr/wAiqqu6/wARVVX/ADVVVYu9i/8AJCqr///z1VX/ABZVVf//56qr/wAWVVX//+eqq/8ACyqr///dKqqL///SqqsI+wlMFfcJBotz///81VX//+mAAP//+aqrdv//+aqrdv//9dVV///tqqt9///wVVV9///wVVV5///zgAB1///2qqt1///2qqv//+Wqq///+1VV///hVVWL///zVVWL///zgAD/AAHVVf//86qr/wADqqv///Oqq/8AA6qr///01VX/AAVVVYGSCIGS///31VWU///5qquW///5qquW///81VX/AAyAAIuZi/8ABqqr/wAB1VX/AAiAAP8AA6qr/wAKVVX/AAOqq/8AClVV/wAHgAD/AAmqq/8AC1VVlP8AC1VVlP8AECqr/wAH1VWg/wAGqqug/wAGqqv/ABwqq/8AA1VV/wAjVVWLCPhtwRVtCg4q+GfPFV2xBf//8Kqr///sqqv//+3VVf//8IAAdv//9FVVdv//9FVV///o1VX///oqq///5qqri2+L///mqquQ///pVVWV///pVVWV///sqqv/AA2AAHuce5z///PVVZ////eqq6L///eqq6L///vVVf8AGIAAi6UIi6X/AAQqq/8AGIAA/wAIVVWi/wAIVVWi/wAMKqufm5ybnP8AE1VV/wANgAD/ABaqq5X/ABaqq5X/ABlVVZCni6OL/wAWVVX///qAAP8AFKqrgP8AFKqrgJ7///DVVf8AEVVV///sqqsIu68F///pVVX/ABlVVf//5iqr/wATqqtumW6Z///ggACSaYv//9yqq4v//99VVYVtf21////mVVX//+8qq///6qqr///qVVX//+qqq///6lVV///vVVX//+ZVVn///+JVVX///+JVVYX//9+AAIv//9yqqwiL///gqqv/AASqq///4tVV/wAJVVVw/wAJVVVw/wANKqv//+gqq5z//+tVVZz//+tVVf8AFIAA///u1Vaj///yVVWj///yVVX/ABpVVf//9tVW/wAcqqv///tVVQhSOpt8BZn/AAVVVf8ADqqr/wACqqv/AA9VVYv/AA1VVYv/AAyqq////NVVl///+aqrl///+aqrkf//9Sqqi///8Kqri4OJ///5VVWH///6qquH///6qqv///rVVf//+6qq///5qqv///yqq///+aqr///8qqv///kqqv///YAA///4qqv///5VVQj///iqq////lVVhP///yqr///5VVWL///jVVWL///mqqv/AAWqq3X/AAtVVQh9awWpff8AH6qrhP8AIVVVi/8ADKqri5j/AAGqq/8ADVVV/wADVVX/AA1VVf8AA1VV/wAMKquQlv8ABqqrlv8ABqqr/wAI1VX/AAiqqv8ABqqr/wAKqqv/AAaqq/8ACqqr/wADVVWYi/8AD1VVi6P///eAAJ16lwh6l///7NVVkf//6qqri3+L///1qqv///2qq///91VV///7VVUIiY2xwAX/AANVVf///1VV/wAEqqv///+qq5GL/wAhVVWLqv8ABoAA/wAcqquY/wAcqquY/wAZqqr/ABQqq/8AFqqr/wAbVVUIDnX4fOIVRApd90sVRQoh97oVPQoOdfh84hVECl33SxVFCvsK+EoVXwoOdfh84hVECl33SxVFCvtb+EoVZQoOdfh84hVECl33SxVFCvvH+BIVIQr3UhYhCg7l+GIVSgqn8RU9Cg7l+GIVSgqb94oVXwoO5fhiFUoKSveKFWUKDuX4YhVKCvtB91IVIQr3UhYhCg6b95H5KBUjU6pq9sQF/wAYqqt1/wAaqqr//+Mqq/8AHKqr///cVVX/AByqq///3FVVpv//19VW/wAZVVX//9NVVQiJiQX//+qqq/8AE1VV///o1VWZcv8ACKqrcv8ACKqr///lgAD/AARVVW+L///cqquL///fVVWFbX9tf///5lVV///vKqv//+qqq///6lVV///qqqv//+pVVf//71VV///mVVZ////iVVV////iVVWF///fgACL///cqqsIi///3Kqrkf//34AAl///4lVVl///4lVV/wAQqqv//+ZVVv8AFVVV///qVVX/ABVVVf//6lVV/wAZqqv//+8qq6l/qX//ACCqq4X/ACNVVYv/ACNVVYv/ACCAAP8ABiqr/wAdqqv/AAxVVf8AHaqr/wAMVVX/ABmqqv8AEaqr/wAVqquiCP8AFaqrov8AENVV/wAcKquX/wAhVVWX/wAhVVWR/wAlVVaL/wApVVWLv///+FVV/wAvqqv///Cqq/8AK1VV///wqqv/ACtVVf//7aqq/wAmgAD//+qqq/8AIaqr///qqqv/ACGqq3X/ABzVVf//6VVVo///6VVVo///7VVW/wASqqv///FVVf8ADVVVCPXEZ6kjUwX///Kqq/8ADVVV///wqqr/AA3VVv//7qqr/wAOVVX//+6qq/8ADlVV///vqqr/AAzVVv//8Kqr/wALVVUIV20F/wAMqqv///aqq5r///Qqqv8AEVVV///xqqv/ABFVVf//8aqr/wAQVVb///HVVf8AD1VVfQj7H/xBFVEKDnXb9+AVTwq1940VawoOm8H3exVQCscWUQr3hffhFT0KDpvB93sVUArHFlEK93n4cRVfCg6bwfd7FVAKxxZRCvco+HEVZQoOm8H3exVQCscWUQqm9/IVawoOm8H3exVQCscWUQqz+DkVIQr3UhYhCg7j2ffbFVv4krsH+8b3FhWLfZB/lYGVgZeGmYuZi5eQlZWVlZCXi5mLmYaXgZWBlX+QfYsIfYt/hoGBgYGGf4t9CPvIBIt9kH+VgZWBl4aZi5mLl5CVlZWVkJeLmYuZhpeBlYGVf5B9iwh9////VVV/hoH///aqq4H///aqq4Z/i///8VVVCA6b9wHUFUVEq27P0AWf///uqqv/ABdVVf//8qqq/wAaqqv///aqq/8AGqqr///2qqv/AB1VVf//+1VVq4v/ACNVVYv/ACCAAJH/AB2qq5f/AB2qq5f/ABmqqv8AENVV/wAVqqv/ABWqq/8AFaqr/wAVqqv/ABDVVf8AGaqql/8AHaqrl/8AHaqrkf8AIIAAi/8AI1VVCIur///7Kqv/AB2AAP//9lVVpv//9lVVpv//8iqr/wAX1VV5/wAUqqsI0tJrqEZFBf//61VV/wAQqqv//+iAAJj//+Wqq/8ACVVV///lqqv/AAlVVf//4yqq/wAEqqv//+Cqq4v//9yqq4v//99VVYVtf21////mVVX//+8qq///6qqr///qVVX//+qqq///6lVV///vVVX//+ZVVn///+JVVX///+JVVYX//9+AAIv//9yqqwiL///BVVX/ABJVVf//y1VW/wAkqqv//9VVVQj3xPfHFfub+50Ff/8AD1VVgv8AEaqrhZ+Fn4igi6GLpf8ABCqr/wAYgAD/AAhVVaL/AAhVVaL/AAwqq5+bnJuc/wATVVX/AA2AAP8AFqqrlf8AFqqrlf8AGVVVkKeLCP8AF1VVi/8AFVVW///8gAD/ABNVVYT/ABNVVYT/ABFVVv//9iqr/wAPVVX///NVVQj7ffu9Ffeb954Fl///8Kqr/wAJKqv//+5VVf8ABlVVd/8ABlVVd/8AAyqr///qVVWL///oqquLcf//+9VV///ngAD///eqq3T///eqq3T///PVVXd7ent6///sqqv///KAAP//6VVVgf//6VVVgf//5qqrhm+LCHOL///qKqv/AAOAAP//7FVVkv//7FVVkv//7tVW/wAKKqv///FVVf8ADVVVCA51+Gv3FhVVCvsb+EYVPQoOdfhr9xYVVQr7J/jWFV8KDnX4a/cWFVUK+3j41hVlCg51+Gv3FhVVCvvk+J4VIQr3UhYhCg77B/dm+yMVVwrP+ecVXwoOrM75iBX+bMf3yY0H/wAJVVV7/wALqqv///Iqq5n///RVVZn///RVVf8ADyqr///2VVb/ABBVVf//+FVV/wAQVVX///hVVf8AESqr///6VVad///8VVWd///8VVX/ABGqq////iqr/wARVVWL/wAjVVWL/wAggACR/wAdqquX/wAdqquX/wAZqqr/ABDVVf8AFaqr/wAVqqsI/wAVqqv/ABWqq/8AENVV/wAZqqqX/wAdqquX/wAdqquR/wAggACL/wAjVVWL/wAjVVWF/wAggAB//wAdqqt//wAdqqv//+8qq/8AGaqq///qVVX/ABWqq///6lVV/wAVqqv//+ZVVv8AENVV///iVVWX///iVVWX///fgACR///cqquLCP//7qqri///7lVV///+Kqt5///8VVV5///8VVX//+7VVf//+lVW///vqqv///hVVf//76qr///4VVX///DVVf//9lVWff//9FVVff//9FVV///0VVX///Iqq///9qqrewiJ+AsGhfyhFUAKDvsH92b7IxVXCvsN+a8VIQr3UhYhCg729875WBUlCmZDFSYK9734uxVdCg5Q+Ev3VhU+CvsMsRU/CuD4ChVdCg729875WBUlCmZDFSYK3fkNFW4KDlD4S/dWFT4K+wyxFT8K+yn4cBVvCg72+Uv7SxV4sQX///tVVf//+qqr///5Kqv///rVVYKGgob///SAAP///YAAfYv//+NVVYv///Gqq/8AD6qri/8AH1VVi/8ADKqr/wACgAD/AAxVVZCXkJf/AAYqq/8AC1VV/wAHVVX/AAqqq/8AB1VV/wAKqqv/AAfVVv8ACaqq/wAIVVX/AAiqqwj/AAhVVf8ACKqr/wAH1VaS/wAHVVX/AAVVVQioi/u++VhHi/vJ/VjQi9v3UPgLi9j7UAWBg///9aqrgv//9VVVgf//9VVVgf//9oAA///1gAD///eqq4D///eqq4D///kqqv//9Cqr///6qqv///NVVf//+qqr///zVVX///1VVf//8qqri32L///mqqv/AAiqq3f/ABFVVf//8VVV/wARVVX///FVVaH///iqq/8AGqqriwj/ABKqq4v/ABAqqv8AAyqr/wANqqv/AAZVVf8ADaqr/wAGVVX/AAwqqv8AB9VW/wAKqqv/AAlVVQj78vnHFSYKDlD4dftLFXixBf//+1VV///6qqv///kqq///+tVVgoaChv//9IAA///9gAB9i///41VVi///8aqr/wAPqquL/wAfVVWL/wAMqqv/AAKAAP8ADFVVkJeQl/8ABiqr/wALVVX/AAdVVf8ACqqr/wAHVVX/AAqqq/8AB9VW/wAJqqr/AAhVVf8ACKqrCP8ACFVV/wAIqqv/AAfVVpL/AAdVVf8ABVVVCJYGif8ADVVV///+VVX/AA1VVv///qqr/wANVVX///6qq/8ADVVV////Kqr/AA5VVv///6qr/wAPVVX///+qq/8AD1VV////qqr/ABCqq////6qrnf///6qrnf///9VV/wAUVVWL/wAWqqsI9wUHi/8AOqqr///vVVX/ACqAAP//3qqr/wAaVVX//96qq/8AGlVV///TVVX/AA0qq1OLbYv//+Cqq///+oAA///fVVWA///fVVWA///kqqv//+/VVXX//+qqqwiuYgX/ACiqq/8AIqqruv8AEVVV/wA1VVWLsYv/AB8qq///91VV/wAYVVX//+6qq/8AGFVV///uqqv/AAwqq///41VVi2MIb0UH///oqquL///lqqr///6AAP//4qqriP//4qqriP//5Cqq///5VVX//+Wqq///9aqr///lqqv///Wqq///6dVV///wgAB5///rVVV5///rVVWCb4v//9yqq4v//+dVVf8ABNVVdv8ACaqr///uqqv/AAmqq///7qqr/wAMgAD///HVVf8AD1VVgAj/AA9VVYD/ABFVVoP/ABNVVYb/ABNVVYb/ABOqq////YAAn4uzi/8AIKqrkv8AGVVVmf8AGVVVmf8AFVVWof8AEVVVqQiNBov//+Sqq41yj///6VVVgYP///Wqq4L///VVVYH///VVVYH///aAAP//9YAA///3qquA///3qquA///5Kqr///Qqq///+qqr///zVVX///qqq///81VV///9VVX///Kqq4t9i///5qqr/wAIqqt3/wARVVX///FVVQj/ABFVVf//8VVVof//+Kqr/wAaqquL/wASqquL/wAQKqr/AAMqq/8ADaqr/wAGVVX/AA2qq/8ABlVV/wAMKqr/AAfVVv8ACqqr/wAJVVUI+zb4MxU/Cg73Evk89wMVJwr7f/mlFV8KDir4Z88VQQr7EvkUFV8KDvcS+Tz3AxUnCvu++aUVZQoOKvhnzxVBCvtk+RQVZQoO9xL5PPcDFScK+8j5bRUhCg4q+GfPFUEK+2743BUhCg73Evk89wMVJwr7evkVFXAKDir4Z88VQQr7IPiEFXAKDvc34/lYFSgK+y39HBUpCtH5SBVwCg6s+HjcFUIKk/cqFUMK90b4cRVxCg73N/cu+CAVaQr72FUVagoOrPh43BU6x/jZ08BD9w5P+w77Nlb3NvtciQf///aqq5v///RVVf8ADdVVff8AC6qrff8AC6qr///w1VX/AAmqqv//76qr/wAHqqv//++qq/8AB6qr///u1VX/AAWqqnn/AAOqq3n/AAOqq///7lVV/wAB1VX//+6qq4v//9yqq4v//99VVYVtf21////mVVX//+8qq///6qqr///qVVUI///qqqv//+pVVf//71VV///mVVZ////iVVV////iVVWF///fgACL///cqquL///cqquR///fgACX///iVVWX///iVVX/ABCqq///5lVW/wAVVVX//+pVVf8AFVVV///qVVX/ABmqq///7yqrqX+pf/8AIKqrhf8AI1VViwj/ABFVVYv/ABGqq/8AAdVVnf8AA6qrnf8AA6qr/wARKqv/AAWqqv8AEFVV/wAHqqv/ABBVVf8AB6qr/wAPKqv/AAmqqpn/AAuqq5n/AAuqq/8AC6qr/wAN1VX/AAlVVZsIk/cqFYtxhv//54AAgXSBdP//8lVVd///7qqrev//7qqrev//64AA///ygAD//+hVVYH//+hVVYH//+bVVob//+VVVYtvi///5qqrkP//6VVVlf//6VVVlf//7Kqr/wANgAB7nAh7nP//89VVn///96qrov//96qrov//+9VV/wAYgACLpYul/wAEKqv/ABiAAP8ACFVVov8ACFVVov8ADCqrn5ucm5z/ABNVVf8ADYAA/wAWqquV/wAWqquV/wAZVVWQp4sI/wAaqquL/wAZKqqG/wAXqquB/wAXqquB/wAUgAD///KAAP8AEVVVev8AEVVVev8ADaqrd5V0lXSQ///ngACLcQgOmuz5WBUqCj7mFV0KDnX4fOIVRApd90sVRQp79+QVXQoOmuz5WBUqCvvL90EVbgoOdfh84hVECl33SxVFCvuO+EoVbwoOmuz5WBUqCvuS9xgVIQoOdfh84hVECl33SxVFCvtV+BIVIQoOmuz5WBX9WPf0B4GD///1qquC///1VVWB///1VVWB///2gAD///WAAP//96qrgP//96qrgP//+Sqq///0Kqv///qqq///81VV///6qqv///NVVf///VVV///yqquLfYv//+aqq/8ACKqrd/8AEVVV///xVVX/ABFVVf//8VVVof//+Kqr/wAaqquLCP8AEqqri/8AECqq/wADKqv/AA2qq/8ABlVV/wANqqv/AAZVVf8ADCqq/wAH1Vb/AAqqq/8ACVVVCHixBf//+1VV///6qqv///kqq///+tVVgoaChv//9IAA///9gAB9i///41VVi///8aqr/wAPqquL/wAfVVWL/wAMqqv/AAKAAP8ADFVVkJeQl/8ABiqr/wALVVX/AAdVVf8ACqqr/wAHVVX/AAqqq/8AB9VW/wAJqqr/AAhVVf8ACKqrCP8ACFVV/wAIqqv/AAfVVpL/AAdVVf8ABVVVCL/H/BP3qPfsx/vs95D4A8cGDnX4GPtLFXixBf//+1VV///6qqv///kqq///+tVVgoaChv//9IAA///9gAB9i///41VVi///8aqr/wAPqquL/wAfVVWL/wAWqqv/AAbVVf8AFVVV/wANqquf/wANqquf/wAN1VWbmZer/wAEqquolaX/AA9VVQil/wAPVVX/ABaqq6H/ABNVVf8AHKqrCF+wBYP///NVVf//9lVV///0gAD///Sqq///9aqr///0qqv///Wqq///84AA///3VVX///JVVYT///JVVYT///Gqq///+qqrfP///FVVfP///FVV///w1VX///4qq///8Kqri///3Kqri///4yqq/wAGqqv//+mqq/8ADVVV///pqqv/AA1VVf//7iqqm///8qqr/wASqqsI///yqqv/ABKqq///9tVV/wATKqqG/wATqquG/wATqqv///2AAP8AECqqi/8ADKqrCPgYtQaL/wAaqqv///tVVf8AGlVV///2qqul///2qqul///yKqr/ABcqq///7aqr/wAUVVX//+2qq/8AFFVV///pVVX/ABBVVnD/AAxVVXD/AAxVVf//4NVV/wAGKqv//9yqq4tpi2z///nVVW////Oqq2////Oqq///56qrev//61VV///qVVUI///rVVX//+pVVXv//+aAAP//9Kqr///iqqv///Sqq///4qqr///6VVVri///3VVVi///3Kqr/wAFgAD//9+AAJb//+JVVZb//+JVVf8AD4AA///mgACf///qqquf///qqqv/ABgqq///7yqq/wAcVVX///Oqq/8AHFVV///zqqv/AB+AAP//+YAA/wAiqqv///9VVQj//+1VVf//8Kqr///vKqt5fP//61VVfP//61VV///4gAD//+lVVov//+dVVYv//+aqq/8ACKqrd/8AEVVV///xVVX/ABFVVf//8VVVof//+Kqr/wAaqquL/wASqquL/wAQKqr/AAMqq/8ADaqr/wAGVVX/AA2qq/8ABlVV/wAMKqr/AAfVVv8ACqqr/wAJVVUIwfhZFUUKDprs+VgVKgr7RLcVcAoOdfh84hVECl33SxVFCvsH97oVcAoO91z5PbkVKwr7wfnmFWUKDqz4tKkVRwpR92MVSAr7VPhrFWUKDvdc+T25FSsK/AT51xVuCg6s+LSpFUcKUfdjFUgK+5f4axVvCg73XPk9uRUrCvvL+a4VIQoOrPi0qRVHClH3YxVICvte+DMVIQoO91z5PbkVKwr7uvsEFXIKDqz4tKkVRwpR92MVSAr7HPf5Fb73OVaLTPs5BQ73JOz5WBUsCvc291AVZQoOddv5iBVJCtf3SBVlCg73JOz5WBX9WM335Pgg++TN+VhJ+wP8IPcDB/gg+8wV/CD3LfggBg512/jZFfzZx/d7B4ur/wAEKqv/ABvVVf8ACFVV/wAXqqv/AAhVVf8AF6qr/wALVVb/ABOqqv8ADlVV/wAPqqv/AA5VVf8AD6qrnP8AC6qq/wATqqv/AAeqq/8AE6qr/wAHqqv/ABTVVf8AA9VVoYuji/8AE4AA///71VWa///3qqua///3qqv/AAuqq///9NVV/wAIVVV9CP8ACFVVff8ABdVW///wKqv/AANVVf//7lVV/wADVVX//+5VVf8AAaqr///t1VaL///tVVUI+6TH96cHi/8AGVVV///9gAD/ABiqq4ajhqOC/wAVKqt+/wASVVV+/wASVVX//+4qq/8ADtVW///pVVX/AAtVVf//6VVV/wALVVX//+Kqq/8ABaqrZ4v//9qqq4v//99VVf//9tVVb///7aqrb///7aqrd///6iqqf///5qqrCIn3XPc2wPs29w5P+w5DVgYO+9Ls+VgVLQr7UMgVZgoO5fhiFUoK+0z3CxVrCg770uz5WBUtCu3mFV0KDuX4YhVKCvL3JBVdCg770uz5WBX9WJMHgYP///Wqq4L///VVVYH///VVVYH///aAAP//9YAA///3qquA///3qquA///5Kqr///Qqq///+qqr///zVVX///qqq///81VV///9VVX///Kqq4t9i///5qqr/wAIqqt3/wARVVX///FVVf8AEVVV///xVVWh///4qqv/ABqqq4sI/wASqquL/wAQKqr/AAMqq/8ADaqr/wAGVVX/AA2qq/8ABlVV/wAMKqr/AAfVVv8ACqqr/wAJVVUIeLEF///7VVX///qqq///+Sqr///61VWChoKG///0gAD///2AAH2L///jVVWL///xqqv/AA+qq4v/AB9VVYv/AAyqq/8AAoAA/wAMVVWQl5CX/wAGKqv/AAtVVf8AB1VV/wAKqqv/AAdVVf8ACqqr/wAH1Vb/AAmqqv8ACFVV/wAIqqsI/wAIVVX/AAiqq/8AB9VWkv8AB1VV/wAFVVUImPlYBg7l+GIV/GKQB4GD///1qquC///1VVWB///1VVWB///2gAD///WAAP//96qrgP//96qrgP//+Sqq///0Kqv///qqq///81VV///6qqv///NVVf///VVV///yqquLfYv//+aqq/8ACKqrd/8AEVVV///xVVX/ABFVVf//8VVVof//+Kqr/wAaqquLCP8AEqqri/8AECqq/wADKqv/AA2qq/8ABlVV/wANqqv/AAZVVf8ADCqq/wAH1Vb/AAqqq/8ACVVVCHixBf//+1VV///6qqv///kqq///+tVVgoaChv//9IAA///9gAB9i///41VVi///8aqr/wAPqquL/wAfVVWL/wAMqqv/AAKAAP8ADFVVkJeQl/8ABiqr/wALVVX/AAdVVf8ACqqr/wAHVVX/AAqqq/8AB9VW/wAJqqr/AAhVVf8ACKqrCP8ACFVV/wAIqqv/AAfVVpL/AAdVVf8ABVVVCJX4YgZA90sVSwoO+9Ls+VgVLQo+9xgVIQoO5fhiFUoKDvcW7PlYFS0K+FT8iBUuCg77D+X4YhVKCkD3SxVLCve2/WoVTApA+WoVSwoOK/gV92QVLgpF+UQVZQoO9yo6FXMKSvmpFWUKDqzs+VgVLwr3KP2aFXIKDirb+YgVTQrS/coVcgoOPez5WBUwCpj3UBVfCg7l+YgVTgqj90gVXwoOPez5WBUwCvb9mhVyCg7l+YgVTgpm/coVcgoOPez5WBUwCvcMFnEKDuX5iBVOCvcMWxVxCg497PlYFTAK90P7/xUhCg77huX5iBVOCt/8ERUhCg497Pd7Fft7+CDH+973eAf3bPdRi8n7bPtRi/f6SYuL/DFDTItKBQ7l99gV+9jH+BUH3+CLzjc1i/fFT4uL/AE3NotIBQ73XOz5WBUxCvec91AVXwoOddv34BVPCvd8+AwVXwoO91zs+VgVMQr3Sf2aFXIKDnXb9+AVTwr3Q/wiFXIKDvdc7PlYFTEK94e3FXAKDnXb9+AVTwr3gvd8FXAKDnXb9+AVTwp8+AwVcQoO95S+9/YVMgrNFjMK+EX4URVdCg6bwfd7FVAKxxZRCvfQ+AsVXQoO95S+9/YVMgrNFjMK91v4oxVuCg6bwfd7FVAKxxZRCt34cRVvCg73lL739hUyCs0WMwr3u/iyFV8KzRZfCg6bwfd7FVAKxxZRCvdJ+HEVXwrNFl8KDvgC+NnHFfeo96vH+6v3kPe8x/xEB///zqqri///0Cqq///4gAD//9Gqq3z//9Gqq3z//9bVVf//6aqrZ///4lVVZ///4lVV///jKqv//9sqq///6lVVX///6lVVX///9Sqr///MqquL///FVVWL///Kqqv/AAmAAP//z4AAnv//1FVVnv//1FVV/wAZqqv//9qqq/8AIFVVbAj/ACBVVWz/ACWqq///6Cqrtv//71VVtv//71VV/wAtKqv///eqq/8AL1VViwj4bMcG/Ab44BX84DcH///iqquL///fqqqQ///cqquV///cqquV///e1VX/ABCAAGyibKJx/wAeKqt2/wAlVVV2/wAlVVX///WAAP8ALlVWi/8AN1VVi/8AM1VV/wAJqqv/ACwqq/8AE1VVsP8AE1VVsP8AGNVW/wAegAD/AB5VVaMI/wAeVVWj/wAhgAD/ABGqq/8AJKqr/wALVVX/ACSqq/8AC1VVr/8ABaqr/wAjVVWLCA733fm396IVbQr7vFUV9/iuBov/ACdVVf//+lVV/wAh1Vb///Sqq/8AHFVV///0qqv/ABxVVf//8NVV/wAXKqt4nXid///p1VX/AA0qq///5qqr/wAIVVX//+aqq/8ACFVV///lVVX/AAQqq2+L///mqquL///pVVX///yAAHeEd4T//+6qq4L///FVVYAI///xVVWA///zqqv///Oqq4H///JVVYH///JVVYP///KAAIX///Kqq4eT///5gAD/AAqAAIKYgpj///PVVf8ADKqr///wqqv/AAxVVf//8Kqr/wAMVVX//+yqqv8ACqqr///oqquU///oqquU///jqqr/AASAAP//3qqriwj//96qq4v//+FVVYVvf29////n1VX//+8qq///66qr///qVVX//+uqq///6lVVe///5lVW///0VVX//+JVVf//9FVV///iVVX///oqq///34AAi///3Kqri///3Kqr/wAF1VX//9+AAP8AC6qr///iVVX/AAuqq///4lVVm///5lVW/wAUVVX//+pVVQj/ABRVVf//6lVV/wAYKqv//+8qq6d/p3//AB6qq4X/ACFVVYu3i/8AJ1VV/wAJqqv/ACKqq/8AE1VV/wAiqqv/ABNVVab/ABxVVv8AE1VV/wAlVVUIjQb/ABCqq2P/ABhVVW6reat5/wAkVVWC/wAoqquL/wAqqquL/wAj1VX/AAcqq6j/AA5VVaj/AA5VVf8AG4AA/wAYKqulrQhcrQX///FVVf//6Kqr///tVVb//+3VVf//6VVVfv//6VVVfv//5lVW///5gAD//+NVVYv//+Sqq4v//+gqqv8ABKqr///rqqv/AAlVVf//66qr/wAJVVX//+8qqv8ADIAA///yqqv/AA+qq///8qqr/wAPqquB/wASVVX///lVVaD///lVVaD///1VVv8AFoAA/wABVVWjCPwnmhWL/wAYqquP/wAXqqqT/wAWqquT/wAWqqv/AAuAAP8AFCqqmv8AEaqrmv8AEaqrnZmg/wAKVVWg/wAKVVX/ABfVVf8ABSqr/wAaqquL/wAaqquL/wAX1VWGoIGggf8AEdVV///ygAD/AA6qq3oI/wAOqqt6/wALVVV3k3STdI///+eAAItxi3GH///ngACDdIN0///0qqt3///xVVV6///xVVV6///uKqv///KAAHaBdoH//+gqq4b//+VVVYsI///lVVWL///oKqv/AAUqq3b/AApVVXb/AApVVXmZfP8AEaqrfP8AEaqr///0gAD/ABQqqoP/ABaqq4P/ABaqq4f/ABeqqov/ABiqqwgOmvc3+CAVNQr7YvfMFTYKvPdQFV8KDvuJ2/fgFVIK9y34DBVfCg6a9zf4IBU1Cvti98wVNgp9/ZoVcgoO+4nb9+AVUgq7/CIVcgoOmvc3+CAVNQr7YvfMFTYKubcVcAoO+4nb9+AVUgr3Ivd8FXAKDnX3CPcXFTcK93b5kRVfCg77LNz3ChVTCvdN+OIVXwoOdfcI9xcVNwr3J/mRFWUKDvss3PcKFVMK8PjiFWUKDnX3CPcXFUxhBf8AGVVVZ/8AHiqrca57rnv/ACaAAP//9qqrtf///VVVCFlEm3wF/wAOqqv/AAVVVf8ADqqq/wACqqv/AA6qq4v/AA1VVYv/AAyqq////NVVl///+aqrl///+aqrkf//9Sqqi///8Kqri4OJ///5VVWH///6qquH///6qqv///rVVf//+6qq///5qqv///yqq///+aqr///8qqv///kqqv///YAA///4qqv///5VVQj///iqq////lVVhP///yqr///5VVWLb4v//+aqq/8ABaqr///pVVX/AAtVVQh9awWpff8AH6qrhP8AIVVVi/8ADKqri5j/AAGqq/8ADVVV/wADVVX/AA1VVf8AA1VV/wAMKquQlv8ABqqrlv8ABqqr/wAI1VX/AAiqqv8ABqqr/wAKqqv/AAaqq/8ACqqr/wADVVWYi/8AD1VVi6P///eAAJ16lwh6l///7NVVkf//6qqri3+L///1qqv///2qq///91VV///7VVUIiY2tugX/ABqqq/8AAVVV/wAZ1VX/AAVVVqT/AAlVVaT/AAlVVaGYnv8AEKqrnv8AEKqr/wAPKqv/ABRVVf8AC1VVo/8AC1VVo/8ABaqr/wAbVVWL/wAeqquLt4L/ACKAAHmkeaT//+mAAP8AE4AAcJkIcJn//+Kqq/8ACyqr///gVVX/AAhVVf//4FVV/wAIVVX//+Kqq/8ACaqrcJZwlv//6YAAmnmeeZ6C/wAbKquL/wAjVVWL/wAWqqv/AARVVf8AE6qq/wAIqqv/ABCqq/8ACKqr/wAQqqv/AAuAAP8ADdVV/wAOVVWWCP8ADlVVlv8AENVW/wAIVVX/ABNVVf8ABaqr/wATVVX/AAWqq/8AFFVW/wAC1VX/ABVVVYv/ADtVVYu5///oqqv/ACCqq///0VVVCMS0BXOr///jgAD/ABbVVWr/AA2qq2r/AA2qq///3Cqr/wAG1VX//9lVVYtti///41VV///71VX//+Sqq///96qr///kqqv///eqq///59VV///zqqp2///vqqt2///vqqv//+9VVf//66qq///zqqv//+eqq///86qr///nqqv///nVVf//5Cqqi///4KqrCIv//96qq/8ABSqrb/8AClVV///pVVX/AApVVf//6VVV/wAN1Vb//+0qq/8AEVVVfP8AEVVVfP8AE4AA///z1VX/ABWqq///9qqr/wAVqqv///aqq/8AFlVV///3qqqi///4qqui///4qqv/ABZVVf//+Kqq/wAVqqv///iqq/8AFaqr///4qqv/ABOAAP//9yqq/wARVVX///Wqqwj/ABFVVf//9aqr/wAN1Vb///LVVf8AClVVe/8AClVVe/8ABSqr///rqquL///nVVWL///qqqv///vVVf//7NVV///3qqt6///3qqt6///0qqr///GAAP//8aqrf///8aqrf///7yqq///2qqv//+yqq///+VVV///sqqv///lVVf//61VV///8qqt1iwhni///4FVV/wAHVVX//+Sqq/8ADqqr///kqqv/AA6qq///6aqq/wAWVVX//+6qq6kIDvss3PcKFVZnBf8AEKqrbf8AFtVV///pgACofKh8/wAggAD///eAAK+JCFQ+m3wF/wAOqqv/AAVVVf8ADqqq/wACqqv/AA6qq4v/AA1VVYv/AAyqq////NVVl///+aqrl///+aqrkf//9Sqqi///8Kqri4OJ///5VVWH///6qquH///6qqv///rVVf//+6qq///5qqv///yqq///+aqr///8qqv///kqqv///YAA///4qqv///5VVQj///iqq////lVVhP///yqr///5VVWLb4v//+aqq/8ABaqr///pVVX/AAtVVQh9awWpff8AH6qrhP8AIVVVi/8ADKqri5j/AAGqq/8ADVVV/wADVVX/AA1VVf8AA1VV/wAMKquQlv8ABqqrlv8ABqqr/wAI1VX/AAiqqv8ABqqr/wAKqqv/AAaqq/8ACqqr/wADVVWYi/8AD1VVi6P///eAAJ16lwh6l///7NVVkf//6qqri3+L///1qqv///2qq///91VV///7VVUIiY2ywAWf/wABVVWej53/AAaqq53/AAaqq/8AD9VV/wAJVVX/AA2qq5f/AA2qq5f/AArVVf8ADoAAk5yTnI//ABOAAIuhi/8AH1VV///5Kqv/ABgqq///8lVVnP//8lVVnP//7yqrmHeUCHeUdf8ABoAAc49zj3X/AATVVXf/AAWqq3f/AAWqq///7yqr/wAH1VX///JVVZX///JVVZX///kqq/8AD1VVi/8AFKqri5f/AAMqq/8ACqqr/wAGVVX/AAlVVf8ABlVV/wAJVVX/AAfVVv8AB6qr/wAJVVWRCP8ACVVVkf8ACoAA/wAEqqv/AAuqq/8AA1VV/wALqqv/AANVVf8ACyqq/wABqqv/AAqqq4uni/8AFlVV///6gAD/ABCqq4D/ABCqq4CZ///v1VX/AAtVVf//6qqrCMGrBf//8Kqrqf//6oAAof//5FVVmf//5FVVmf//3yqrkmWL///sqquLeP///VVV///tVVX///qqq///7VVV///6qqv//+8qq///99VVfIB8gP//89VV///yKqv///aqq///71VV///2qqv//+9VVf//+1VV///sVVaL///pVVUIi///4qqr/wAG1VX//+lVVf8ADaqre/8ADaqre/8AENVV///zgACfgp+Cof//+VVVo///+6qro///+6qrof//+tVVn4Wfhf8AENVV///3qqv/AA2qq///9VVV/wANqqv///VVVf8ABtVVe4v//+qqqwiL///yqqv///zVVf//9Cqq///5qqv///Wqq///+aqr///1qqv///fVVf//9yqqgf//+Kqrgf//+Kqr///0qqv///pVVf//81VVh///81VVh///81VWif//81VVi2+L///l1VX/AAaAAP//56qrmP//56qrmP//7YAA/wAS1VX///NVVf8AGKqrCA519wj3FxU3CvdX+QEVcAoO+yzc9woVUwr3OfhSFXAKDof3kvkcFTgK94v9XhVyCg77iffG+CwVVAp7/G4VcgoOh/eS+RwVOAr3zPMVcAoO+4n3xvgsFVQK8/fAFXEKDof4avgyFbv7KvdO94bH/LpP94b7TvsoW/co/DLN+DIHDvuJ97f3qRW7+wne9xjB+xj3GU/7GSdV7zg0Wwfi+z4Gi///71VV/wACKqv///CAAP8ABFVV///xqqv/AARVVf//8aqr/wAG1Vb///OAAP8ACVVV///1VVX/AAlVVf//9VVV/wAMVVb///eAAP8AD1VV///5qqv/AA9VVf//+aqr/wASVVb///zVVf8AFVVVi/8AC1VVi5j/AAGqq/8ADqqr/wADVVX/AA6qq/8AA1VVmP8AA6qr/wALVVWPCIbBBf//9VVV///7VVX///TVVv///Cqr///0VVWI///0VVWI///0gAD///6AAP//9Kqri3eL///wVVX/AAWqq///9Kqr/wALVVX///Sqq/8AC1VV///6VVWbi/8AFKqrCPc+Bw71+Oz3oxU5Cvwx+IYVZgoOdfhr9xYVVQr78vhXFWsKDvX47PejFTkK+xH4pBVdCg51+Gv3FhVVCk34cBVdCg71+Oz3oxU5Cvv7+PYVbgoOdfhr9xYVVQr7vPjWFW8KDvX47PejFTkK+/L4yhVnCvcqFmgKDnX4a/cWFVUK+7P4mxVsCvcqFmgKDvX47PejFTkK+6b5BRVfCs0WXwoOdfhr9xYVVQr7Z/jWFV8KzRZfCg71+E77SxV4sQX///tVVf//+qqr///5Kqv///rVVYKGgob///SAAP///YAAfYv//+NVVYv///Gqq/8AD6qri/8AH1VVi/8AFKqr/wAFqqv/ABOAAP8AC1VV/wASVVX/AAtVVf8AElVV/wAMVVb/AA+AAP8ADVVV/wAMqqv/ACiqq4//ACKAAP8ACqqr/wAcVVX/ABFVVQj/ABxVVf8AEVVV/wAW1Vb/ABWqq/8AEVVVpf8AEVVVpf8ADIAA/wAdVVX/AAeqq/8AIKqr/wAHqqv/ACCqq/8AA9VVrYv/ACNVVQj4SUn8OAeL///mqqv///2qq3D///tVVf//41VV///7VVX//+NVVf//9tVW///lVVb///JVVf//51VV///yVVX//+dVVf//7IAA///rqqv//+aqq3v//+aqq3tqg///11VVi///1qqri///3tVVk3Kbcpv//+yqq/8AFFVV///yVVX/ABiqqwj///JVVf8AGKqr///21Vb/ABqqqv//+1VV/wAcqqv///tVVf8AHKqr///9qqumi/8AGVVVCPg4SfxJB4v//9qqq/8ABCqr///cVVX/AAhVVWn/AAhVVWmZ///h1VX/ABOqq///5aqr/wATqqv//+Wqq/8AGYAA///qqqr/AB9VVf//76qr/wAfVVX//++qq/8AJqqr///3Kqq5///+qqv//+6qq///8Kqr///wqqr//+6AAP//8qqr///sVVX///Kqq///7FVV///5VVX//+qAAIv//+iqqwiL///mqqv/AAiqq3f/ABFVVf//8VVV/wARVVX///FVVaH///iqq/8AGqqri/8AEqqri/8AECqq/wADKqv/AA2qq/8ABlVV/wANqqv/AAZVVf8ADCqq/wAH1Vb/AAqqq/8ACVVVCA51+I37SxV4sQX///tVVf//+qqr///5Kqv///rVVYKGgob///SAAP///YAAfYv//+NVVYv///Gqq/8AD6qri/8AH1VVi/8ADKqr/wACgAD/AAxVVZCXkJf/AAYqq/8AC1VV/wAHVVX/AAqqq/8AB1VV/wAKqqv/AAfVVv8ACaqq/wAIVVX/AAiqqwj/AAhVVf8ACKqr/wAH1VaS/wAHVVX/AAVVVQiaBouR////qqv/AAiAAP///1VVlv///1VVlv///4AA/wAL1VX///+qq/8ADKqr////qqv/AAyqq////4AA/wAMgAD///9VVf8ADFVV////VVX/AAxVVf///6qr/wAKgACL/wAIqqsI9+BP+3sHi2v///vVVf//5Cqr///3qqv//+hVVf//96qr///oVVX///Sqqv//7FVW///xqqv///BVVf//8aqr///wVVV6///0VVb//+xVVf//+FVV///sVVX///hVVf//6yqr///8Kqt1i3OL///sgAD/AAQqq3z/AAhVVXz/AAhVVf//9FVV/wALKqv///eqq5kI///3qquZ///6Kqr/AA/VVf///Kqr/wARqqv///yqq/8AEaqr///+VVX/ABIqqov/ABKqqwj3pE/7pweL///mqqv/AAJVVf//51VV/wAEqqtz/wAEqqtz/wAI1VX//+rVVZj//+2qq5j//+2qq53///EqqqL///Sqq6L///Sqq/8AHYAA///6VVWvi/8AJVVVi/8AIKqr/wAJKqun/wASVVWn/wASVVWf/wAV1VaX/wAZVVUIjgb/AAFVVf//+1VV/wAA1Vb///Wqq/8AAFVVe/8AAFVVe/8AAIAA///vVVX/AACqq///7qqrgYP///Wqq4L///VVVYH///VVVYH///aAAP//9YAA///3qquA///3qquA///5Kqr///Qqq///+qqr///zVVX///qqq///81VV///9VVX///Kqq4t9CIv//+aqq/8ACKqrd/8AEVVV///xVVX/ABFVVf//8VVVof//+Kqr/wAaqquL/wASqquL/wAQKqr/AAMqq/8ADaqr/wAGVVX/AA2qq/8ABlVV/wAMKqr/AAfVVv8ACqqr/wAJVVUIDvgCkPlYFToK+AD3UBVlCg73Epr4YhVWCveB94oVZQoOh/eS98UVOwr3lvdQFWUKDvsH92b7IxVXCoP55xVlCg6H95L3xRU7Cvcq9xgVIQr3UhYhCg51or8VPAr7APeMFV8KDvsspq8VWApl98AVXwoOdaK/FTwK+1P3VBUhCg77LKavFVgK+wz3iBUhCg51or8VPAr7EvMVcAoO+yymrxVYClH3MBVwCg5R+B/4BxW7+wAHqPcxBf8ABKqr/wAYqqv/AAiqqv8AFSqq/wAMqqv/ABGqq/8ADKqr/wARqque/wAI1VX/ABlVVYv/AAqqq4v/AAoqqon/AAmqq4f/AAmqq4f/AAkqqob/AAiqq4UIq7gF///kqqufbZX//99VVYv//+iqq4t3///7qqv//+9VVf//91VV///vVVX///dVVX3///Sqq///9Kqrff//9Kqrff//9yqq///wKqv///mqq///7lVV///5qqv//+5VVf//+yqq///ugAD///yqq///7qqrCG77LvsJi4tb9wCLS/vyBf//+VVVZ///9oAA///kgAD///Oqq3j///Oqq3j//+yAAP//9oAA///lVVWL///2qquL///2qqr/AAFVVf//9qqr/wACqqv///aqq/8AAqqr///3qqr/AARVVf//+KqrkQhtXAX/AAtVVf//9qqr/wAMgAD///mqqv8ADaqr///8qqv/AA2qq////Kqr/wAN1VX///5VVZmL/wArVVWL/wAg1VaW/wAWVVWh/wAWVVWh/wAO1Vb/AB5VVf8AB1VV/wAmqqsI0/gbBQ519wj3FxU3Cvce+1kVcgoO+yzc9woVUwr3A/tMFXIKDof3kvkcFTgK94v9XhVyCg77iffG+CwVVAp7/G4VcgoO9yo6FXMKDuD5WBVlCg73LfjIFXAKDveQ+PIVXQoOnflYFW8KDtb5IBUhCg6m+R0VbAr3KhZoCg73T/tLFXixBf//+1VV///6qqv///kqq///+tVVgoaChv//9IAA///9gAB9i///41VVi///8aqr/wAPqquL/wAfVVWL/wAMqqv/AAKAAP8ADIAAkP8ADFVVkP8ADFVV/wAGKqv/AAtVVv8AB1VV/wAKVVX/AAdVVf8AClVV/wAH1Vb/AAmAAP8ACFVV/wAIqqsI/wAIVVX/AAiqq/8AB9VWkv8AB1VV/wAFVVUIXgaBg///9aqr///3Kqv///VVVf//9lVV///1VVX///ZVVf//9oAA///1gAD///eqq///9Kqr///3qqv///Sqq///+Sqqf///+qqr///zVVX///qqq///81VV///9VVX///Kqq4t9i///5qqr/wAIqqt3/wARVVX///FVVf8AEVVV///xVVWh///4qqv/ABqqq4sI/wASqquL/wAQKqr/AAMqq/8ADaqr/wAGVVX/AA2qq/8ABlVV/wAMKqr/AAfVVv8ACqqr/wAJVVUIDmf42RVrCg7o+VgVXwrNFl8KDueaFnQKr0gV93n82/xbiwUO9zr4RhZ1Cg51+Gv3FhVgCg58+KCUFa8HhYn///nVVf///lVV///5qqv///6qq///+aqr///+qqv///oqqv///1VV///6qquL///1VVWL///31Vb/AAGqq///+lVV/wADVVX///pVVf8AA1VV///7qqv/AARVVoj/AAVVVYj/AAVVVf///iqr/wAGVVb///9VVf8AB1VV////VVX/AAdVVf///6qr/wAHqquLkwj30de6/HZc0fwzv/gz93z7ygeL///xVVX/AACAAH2M///yqquM///yqqv/AALVVf//9Cqq/wAEqqv///Wqq/8ABKqr///1qqv/AAdVVf//99VVlYWVhZmInYv/AAtVVYuV/wABVVX/AAiqq/8AAqqr/wAIqqv/AAKqq/8ACVVV/wADqqqV/wAEqqsIDj33nARV+IjBBw74OvecBFX6fMEHDvvS9xr4dBXL93hPiz/7eAUO+9L3EflYFXYKDvvS9xHlFXYKDlH3Rvh0Fcr3eFCLPvt4BfeLFsr3eFCLPvt4BQ5R9+r5WBV2CvuLFnYKDlH36uUVdgr7ixZ2Cg5R93r4YRX838f43/dUu/tU91tP+1v7VFsHDlH3etQV+1vH91v3VLv7VPfo91S7+1T3W0/7W/tUWwf3VPvo+1RbBg491Pf2FYv//+dVVf8ABKqrdP8ACVVV///qqqv/AAlVVf//6qqr/wAMqqv//+1VVZt7m3v/ABKqq///81VV/wAVVVX///aqq/8AFVVV///2qqui///7VVX/ABiqq4v/ABiqq4ui/wAEqqv/ABVVVf8ACVVV/wAVVVX/AAlVVf8AEqqr/wAMqqubmwibm/8ADKqr/wASqqv/AAlVVf8AFVVV/wAJVVX/ABVVVf8ABKqroov/ABiqq4v/ABiqq///+1VVov//9qqr/wAVVVX///aqq/8AFVVV///zVVX/ABKqq3ube5v//+1VVf8ADKqr///qqqv/AAlVVf//6qqr/wAJVVV0/wAEqqv//+dVVYsI///nVVWLdP//+1VV///qqqv///aqq///6qqr///2qqv//+1VVf//81VVe3t7e///81VV///tVVX///aqq///6qqr///2qqv//+qqq///+1VVdIv//+dVVQgO+Dr3C7UVIQr34RYhCvfhFiEKDvgn+J75ehUiCvua/NEVdwq7FngK97sWdwq7FngK/TP4PhV3CrsWeAoO+5vK94EVXAoO+5v3kPeBFWIKDvwu97X5ehUiCg77APg9+R0Vm8IF///0qqv/AAVVVf//8Sqq/wAEqqv//+2qq4///+2qq4///+wqqo3//+qqq4tLi///ytVV///qgAD//9Wqq2D//9Wqq2D//+LVVf//vdVVe///pqqrCFeLgFvGiwX///6qq///9qqriv//9YAA////VVX///RVVf///1VV///0VVX///+qq///9YAAi///9qqri///+Kqr/wAAKqv///cqqv8AAFVV///1qqv/AABVVf//9aqr/wAA1Vb///cqqv8AAVVV///4qqsIW4t/W8qLBf8ABVVV///ZVVWU///cgAD/AAyqq///36qr/wAMqqv//9+qq/8AECqqb/8AE6qr///oVVX/ABOqq///6FVV/wAXKqr//+2qq/8AGqqrfv8AGqqrfv8AHlVV///5gACti6eL/wAXqquO/wATVVWR/wATVVWR/wAPVVb/AAaqq/8AC1VV/wAHVVUIf8QF///zVVX///iqq///8dVW///5qqr///BVVf//+qqr///wVVX///qqq///7YAA///9VVX//+qqq4tdi///2VVV/wASKqv//+Cqq/8AJFVV///gqqv/ACRVVf//7FVV/wAygACD/wBAqqsI90uLlrv7XIsF////VVX/AAdVVf///4AA/wAI1Vb///+qq/8AClVV////qqv/AApVVf///9VV/wAI1VaL/wAHVVWLlf8AAFVV/wAK1VX/AACqq/8AC6qr/wAAqqv/AAuqq4z/AAoqqv8AAVVV/wAIqqsI926LmLv7c4sF/wALVVXP/wAVKqv/ADNVVar/ACKqq6r/ACKqq/8AJoAA/wARVVW5i5+L/wARKqv///4qq/8ADlVV///8VVX/AA5VVf///FVV/wALgAD///vVVv8ACKqr///7VVUIDj34K7UVeKMF///wqqt/fP//91VV///xVVX///qqq///8VVV///6qqt9///9VVX///Kqq4v///aqq4v///aAAP8AAVVV///2VVX/AAKqq///9lVV/wACqqv///dVVv8ABNVV///4VVWS///4VVWS///5qqv/AAmAAIaXhpf///2AAP8AD1VVi/8AEqqrCPcsB/8AOKqrxf8AKqqq/wA21VX/AByqq/8AM6qr/wAcqqv/ADOqq/8ADlVV/wAygACL/wAxVVWLsf//9lVV/wAd1VX//+yqq/8AFaqr///sqqv/ABWqq3L/AArVVf//4VVVi///3VVVi///4tVW///xVVX//+hVVf//4qqr///oVVX//+Kqq///9Cqr///WVVWLVQiL+5k3OaBvys+L+xUFi2H/AAtVVf//4Sqr/wAWqqv//+xVVf8AFqqr///sVVWo///2Kqv/ACNVVYuhi/8AFVVV/wAEVVX/ABSqq/8ACKqr/wAUqqv/AAiqq/8AE1VV/wAMVVWdmwhO+LYVi///2Kqr///1gAD//9Uqqnb//9Gqq3b//9Gqq///4IAA///Q1VVhWwj3gweLtf8ABtVV/wAe1VX/AA2qq/8AE6qr/wANqqv/ABOqq/8AD4AA/wAJ1VX/ABFVVYv/ABFVVYv/AA4qq///99VVlv//76qrlv//76qr/wAFgAD//+nVVYtvCA74MPdt+SgV/ADB+AD3Gbv71FsH+B67Ffwwwff9jQf3Ivv9q4v3Ivf9jYuL+/3Bi4v4MDiL+xX73PsW99wFDvc6+EYWdQoOPfcx95cV+CgGi/8AKKqr///5qqv/ACUqqv//81VV/wAhqqv///NVVf8AIaqr///uVVao///pVVX/ABhVVf//6VVV/wAYVVX//+TVVp7//+BVVf8ADaqr///gVVX/AA2qq///3NVW/wAG1VX//9lVVYv//9iqq4v//9yAAP//+NVV///gVVX///Gqq///4FVV///xqqv//+TVVv//7IAA///pVVX//+dVVQj//+lVVf//51VV///uqqv//+LVVn///95VVX///95VVYX//9vVVov//9lVVYv//9lVVZFnl///3qqrl///3qqr/wARVVX//+LVVf8AFqqrcv8AFqqrcv8AGyqq///sVVX/AB+qq///8aqr/wAfqqv///Gqq/8AI4AA///41VX/ACdVVYsIpYv/ABeqq/8AAoAA/wAVVVWQ/wAVVVWQ/wAT1VaT/wASVVWW/wASVVWWnJn/AA+qq5z/AA+qq5z/AA+AAP8AFIAA/wAPVVWjCGigBf//5qqrYW///+GAAP//4VVVeP//4VVVeP//26qr///2gABhi///xqqri///z6qq/wATqqv//9iqq/8AJ1VVCPe3920V+7f3JQazs7ufw4vDi7x3tWMIDjn4W/f/FYul///+VVX/ABrVVf///Kqr/wAbqqv///yqq/8AG6qr///6qqr/ABsqqv//+Kqr/wAaqqv///iqq/8AGqqr///2Kqr/ABkqqv//86qr/wAXqqv///Oqq/8AF6qr///w1VX/ABTVVXmdeZ3//+qqq/8ADiqr///nVVX/AApVVf//51VV/wAKVVX//+Oqq/8ABSqra4sI///jVVWLcYb//+iqq4H//+iqq4H//+mqqv//8aqr///qqqv//+1VVQivYAX/ABFVVf8ADVVV/wARKquWnP8ACKqrnP8ACKqr/wAUKqv/AARVVf8AF1VVi/8AIqqri/8AHNVVgqJ5onn/ABJVVf//6VVV/wANqqv//+Sqq/8ADaqr///kqqv/AAmqqv//4oAA/wAFqqv//+BVVf8ABaqr///gVVX/AALVVf//4iqri28Ii///91VV////1VX///dVVv///6qr///3VVX///+qq///91VV////1VX///dVVov///dVVf//61VV/wAZVVX//+dVVv8AFFVW///jVVX/AA9VVf//41VV/wAPVVX//+FVVv8AB6qr///fVVWL///hVVWL///kqqv///pVVXP///Sqq3P///Sqq///66qr///wqqr//+9VVf//7KqrCP//71VV///sqqv///NVVv//6VVV///3VVVx///3VVVx///7qqv//+Sqq4v//+NVVYv//+Kqq/8ABIAA///j1VWUcJRwmP//6CqrnP//61VVnP//61VV/wAU1VX//++AAP8AGKqr///zqqv/ABiqq///86qrp///+dVV/wAfVVWLCLuL/wAm1VX/AAyqq/8AHaqr/wAZVVX/AB2qq/8AGVVV/wAW1VX/AB+AAJv/ACWqq5v/ACWqq/8ACqqr/wAoqqr/AAVVVf8AK6qr/wAFVVX/ACuqq/8AAqqr/wAoKqqL/wAkqqsIRjYV///+qqv//+iqq////Kqq///mqqr///qqq///5Kqr///6qqv//+Sqq///91VV///mVVV/c39z///wVVV3///sqqt7///sqqt7c4P//+NVVYv//+lVVYv//+wqq5B6lXqV///xqqv/AA0qq///9FVV/wAQVVUI///0VVX/ABBVVf//91VW/wASKqv///pVVZ////pVVZ////0qq5+Ln4v/ABSqq/8AAtVVn/8ABaqr/wATVVX/AAWqq/8AE1VV/wAIqqqc/wALqqv/AA6qq/8AC6qr/wAOqqv/AA5VVf8AC6qqnP8ACKqrnP8ACKqr/wAT1VX/AARVVf8AFqqriwiri/8AHVVV///21VX/ABqqq///7aqr/wAaqqv//+2qq/8AFlVV///q1VWdcwgO55oWdAqvSBX3efzb/FuLBQ73GfjT+2oVzfp8/M7+fM36PvhKBg6lpPtqFfi9yPxtBvfc+E77yfhH+E6Li8n8o4uLU/fP/E373fxUBQ7j2ffbFVv4krsHDvwu97X5ehUiCg770t330hUhCg4297j7ahX3Zvp8TIv7Uf4o+zL34Cdbo1m5ofc4++gFDvc3+VD3kBWL/wAUqqv///yqq/8AE1VV///5VVWd///5VVWd///2VVb/AA+AAP//81VVmP//81VVmHz/AAoqq///7qqr/wAHVVX//+6qq/8AB1VV///sqqr/AAOqq///6qqri3eL///tgAD///yAAHqEeoR7gnyACHyA///xqqv///PVVf//8lVV///yqqv///JVVf//8qqr///ygAB+///yqqv///NVVf//8qqr/wAMqqv///Iqqv8ADNVV///xqquY///xqquYfJf///BVVZb///BVVZb//+9VVpT//+5VVZL//+5VVZL//+2AAP8AA4AA///sqquLCP//6qqri///7NVV///8Kqt6///4VVV6///4VVX///GAAP//9VVWf///8lVVf///8lVV///21VX///Aqq///+aqref//+aqref///NVVeIt3i///61VV/wADVVX//+zVVv8ABqqr///uVVX/AAaqq///7lVV/wAJgAD///Cqq/8ADFVVfgj/AAxVVX7/AA6qq///9dVVnP//+KqrnP//+Kqr/wATKqv///xVVf8AFVVVi5+L/wASgAD/AANVVZz/AAaqq5z/AAaqq5v/AAiAAJr/AApVVZr/AApVVf8ADoAA/wALgACZ/wAMqquZ/wAMqqv/AA5VVf8ADFVV/wAOqquXCP8ADKqr///zVVX/AA1VVf//81VWmf//81VVmf//81VV/wAO1VX///SAAP8AD6qr///1qqv/AA+qq///9aqr/wAQgAD///eqqv8AEVVV///5qqv/ABFVVf//+aqr/wASVVb///zVVf8AE1VVi/8AFVVVi/8AE1VW/wAD1VX/ABFVVf8AB6qr/wARVVX/AAeqq/8ADqqr/wAKgACX/wANVVUIl/8ADVVV/wAJVVX/AA+qq/8ABqqrnf8ABqqrnf8AA1VV/wATVVWL/wAUqqsIUogVi///51VVhP//61VWff//71VVff//71VV///sVVX///eqq///5qqri///8Kqri///8YAA/wACqqv///JVVf8ABVVV///yVVX/AAVVVf//8qqrkn7/AAiqq37/AAiqq///86qr/wAJVVX///RVVZX///RVVZX///TVVv8ACaqr///1VVX/AAlVVQiV/wAIqquW/wAJqqqX/wAKqquX/wAKqqv/AAxVVf8ACiqq/wAMqqv/AAmqq/8ADKqr/wAJqqv/AA0qqpP/AA2qq/8ABlVV/wANqqv/AAZVVf8ADdVV/wADKquZi6eL/wAU1VWC/wANqqt5/wANqqt5/wAG1VX//+pVVYv//+aqqwj7yhb///aqq///91VV///1VVX///aAAH////Wqq3////Wqq///84AA///2gAB+///3VVV+///3VVX///Kqq///+NVW///yVVX///pVVf//8lVV///6VVX///Iqq////SqrfYv//+VVVYv//+tVVv8ACFVV///xVVX/ABCqq///8VVV/wAQqqv///iqq6CL/wAZVVUIi5f/AAHVVf8AC1VV/wADqqv/AAqqq/8AA6qr/wAKqqv/AAUqqv8ACYAA/wAGqqv/AAhVVf8ABqqr/wAIVVX/AAhVVf8ABqqrlZCVkP8AC1VV/wACgAD/AAyqq4uZi5n///zVVZn///mqq5n///mqq/8ADdVV///4Kqr/AA2qq///9qqrCP8ADaqr///2qqv/AAzVVf//9iqql///9aqrl///9aqrlv//9oAAlf//91VVCA5o+Cr5dBWL/wAJVVX///3VVf8AB9VW///7qqv/AAZVVf//+6qr/wAGVVX///pVVf8ABSqrhI+Ej///+FVV/wAC1VX///eqq/8AAaqr///3qqv/AAGqq///+Cqq/wAA1VX///iqq4v//+iqq4v//+zVVf//+yqrfP//9lVVfP//9lVVf///8yqrgnsIgnv///mqq3n///xVVXf///xVVXf///2qq///64AAinaKdv///9VV///rgAD/AACqq3f/AACqq3f/AABVVf//7lVVi///8KqrCIv8g4p2i///4IAABYt6////Kqt5///+VVV4///+VVV4///81VZ6///7VVV8///7VVV8///5VVb///iAAP//91VVi4eL///8qquN///9VVWP///9VVWP///9Kqv/AARVVYj/AASqq4j/AASqq////Cqr/wAEVVX///tVVY8I///7VVWP///5VVaN///3VVWL///2qquL///4KqqI///5qquF///5qquF///81VX///hVVYv///aqq4v//+9VVf8ABoAAf5j///iqq5j///iqq/8ADYAA///8VVWZi6uL/wAYVVX/AAmAAP8AEKqrngj/ABCqq56X/wAXKqv/AAdVVf8AG1VV/wAHVVX/ABtVVY//AByAAP8AAKqr/wAdqqv/AACqq/8AHaqr/wAAVVX/ABmAAIv/ABVVVQj4jAeL/wADVVX////VVZL///+qq/8ACqqr////qqv/AAqqq////6qq/wAMgAD///+qq/8ADlVV////qqv/AA5VVf8AAFVV/wAO1VaM/wAPVVWM/wAPVVX/AAGqq/8ADiqr/wACVVWY/wACVVWY/wADgAD/AArVVf8ABKqr/wAIqqv/AASqq/8ACKqr/wAGVVX/AARVVZOLCP8ABKqri/8AA6qq///91VX/AAKqq///+6qr/wACqqv///uqq/8AAtVV///7VVWOho6G/wAD1VX///uAAP8ABKqrh/8ABKqrh5KJ/wAJVVWL/wAKqquL/wAI1VX/AALVVZL/AAWqq5L/AAWqq/8AA4AA/wAIgACL/wALVVUIDuP44fghFXkK+z8EeQoO4/e69xIV97C7+5cG1/ci90uLi7v7MovM9w9ioT77Jfuri4tb95GLQPsi+0aLi1v3LYtL+w0FtXYFDuPjlxX4frr8fgb3hgT4fvtMi778Q/c0+EP3NYu//H77TAUO4+P3CRX4fvdMi8P8fvdMi1f4Q/s1/EP7NAX7MAT4frr8fgYOmvfbaBX3P/gb+z/4G0yL+z38G/c9/BsFq/lgFfcd+9n7HfvZ+xz32QUO90b5hBU9Cg73OvoUFV8KDuD6FBVlCg73LfmEFXAKDmf5lRVmCg50+dwVIQr3UhYhCg73kPmzFV0KDp36BRVuCg6m+dkVZwr3KhZoCg7o+hQVXwrNFl8KDtb53BUhCg7n+VgVcQoO50kVcgoO9xv45hW+9zlWi0z7OQUOSfdy9wkVw85TBo69FSAK94P7XRX8MPj9+DAGvb4V/JT9YviUBg5Q+AX4YhVKCkD3SxVLCvuE+4EVRgoOUPcG+CwVRgr38/fwFU4KDveEFPjWFXmd+GKX936dqYsG+4SXB4sMChwAHBMAWgIAAQGFAlgCZAPIBUwFYwVsBxQIHAjUCOkKggqXCp4LnAu+C8kL5gzqDW4OJg72D/QTbhN7FOQVFBUsFUMVThc2GEAZRBsTHIAdhB9kICYgsyMGJKol9iX9JtAnoCe/J8YprCsALAQtcTBGMVUzOzNrNGw0gzVWNto4fjiQOJY5/ToIO8072zvtO/88CjwePb8/Pz/2QLZBxUNuRPJFmEYzRtpG7Ub3RwFH1UfgSqdKsUu1TWlPNrkGi/8AIqqrjaOP/wANVVWP/wAMqqv/AA5VVf8AEVVV/wAYqquh/wAZVVX/ABdVVf8AENVW/wAUgAD/AAhVVf8AEaqr/wAIVVX/ABGqq/8ABCqr/wATgACL/wAVVVWLs///9FVV/wAf1VX//+iqq/8AF6qr///oqqv/ABeqq///4lVV/wAL1VVniwhni///4aqr///1Kqv//+dVVf//6lVV///nVVX//+pVVf//8VVW///dKqv///tVVVsIvYMFj63/AAmAAP8AGFVVmv8ADqqrmv8ADqqr/wAR1VX/AAdVVf8AFKqri/8AFKqri/8AEdVV///31VWa///vqqua///vqqv/AAeAAP//69VVi3OLf4j///Qqq4X///RVVYX///RVVf//8lVV///wKqv//+qqq3cI///0qqv///Sqq///9qqq///1gAD///iqq///9lVV///4qqv///ZVVYX///bVVv//+1VV///3VVX///dVVf//71VV///7qqtwi///2qqrCAuL///yqqv/AASqq///9Kqq/wAJVVX///aqq/8ACVVV///2qqv/AAtVVv//+1VV/wANVVWL/wANVVWL/wALVVb/AASqq/8ACVVV/wAJVVX/AAlVVf8ACVVV/wAEqqv/AAtVVov/AA1VVYv/AA1VVf//+1VV/wALVVb///aqq/8ACVVV///2qqv/AAlVVf//9Kqq/wAEqqv///Kqq4sI///yqquL///0qqr///tVVf//9qqr///2qqv///aqq///9qqr///7VVX///Sqqov///KqqwgL/Fz9gLhv+F35gAULi3P/AASAAP//6aqrlP//61VVlP//61VV/wAMVVX//+3VVv8AD6qr///wVVX/AA+qq///8FVV/wASKqr///Oqq/8AFKqrgv8AFKqrgv8AFlVV///7gACji6OL/wAWVVX/AASAAP8AFKqrlP8AFKqrlP8AEiqq/wAMVVX/AA+qq/8AD6qrCP8AD6qr/wAPqqv/AAxVVf8AEiqqlP8AFKqrlP8AFKqr/wAEgAD/ABZVVYuji6P///uAAP8AFlVVgv8AFKqrgv8AFKqr///zqqv/ABIqqv//8FVV/wAPqqv///BVVf8AD6qr///t1Vb/AAxVVf//61VVlP//61VVlP//6aqr/wAEgABziwhzi///6aqr///7gAD//+tVVYL//+tVVYL//+3VVv//86qr///wVVX///BVVf//8FVV///wVVX///Oqq///7dVWgv//61VVgv//61VV///7gAD//+mqq4tzCAuL/wAQqqv/AAMqq/8AD4AA/wAGVVX/AA5VVf8ABlVV/wAOVVX/AAiAAP8ADIAA/wAKqqv/AAqqq/8ACqqr/wAKqqv/AAyAAP8ACFVV/wAOVVWR/wAOVVWR/wAPKquOm4ubi/8ADyqriP8ADlVVhf8ADlVVhf8ADIAA///3qqv/AAqqq///9VVVCP8ACqqr///1VVX/AAiAAP//84AA/wAGVVX///Gqq/8ABlVV///xqqv/AAMqq///8IAAi///71VVi///71VV///81VX///CAAP//+aqr///xqqv///mqq///8aqr///3gAD///OAAP//9VVV///1VVX///VVVf//9VVV///zgAD///eqq///8aqrhf//8aqrhf//8NVViHuLCHuL///w1VWO///xqquR///xqquR///zgAD/AAhVVf//9VVV/wAKqqv///VVVf8ACqqr///3gAD/AAyAAP//+aqr/wAOVVX///mqq/8ADlVV///81VX/AA+AAIv/ABCqqwgL+8n9WNCL2/dQ+AuL2PtQ1Yv7vvlYBQv3NPwY+9mLBQtVtAX///NVVf//7Kqr///xVVb//++AAP//71VV///yVVX//+9VVf//8lVV///ugAD///Sqq///7aqrgv//7aqrgv//7Sqq///5VVX//+yqq///+6qr///sqqv///uqq///7VVV///91VV5i12L///WgACTZptmm///4IAAoXGnCHGnd6x9sX2xhLSLt4u3krSZsZmxn6ylp6Wn/wAfgAChsJuwm/8AKYAAk7mLCK+L/wAjKqv///hVVf8AIlVV///wqqv/ACJVVf//8Kqr/wAcKqv//+eqqqH//96qqwjBuAX//+Cqq7P//9uAAP8AHIAA///WVVWc///WVVWc///TKqv/AAiAAFuLVYv//86AAP//9qqrXv//7VVVXv//7VVV///ZgAD//+Yqq2tqa2py///Y1VV5///Sqqt5///SqquC///OVVWLVQiLVZT//84qq53//9JVVZ3//9JVVaT//9iqq6tqq2r/ACaAAP//5lVVuP//7aqruP//7aqr/wAxgAD///bVVcGLv4v/ADBVVZX/ACyqq5//ACyqq5//ACdVVaytuQgL/Vj3bwf/AD1VVYu//wAHgAD/ACqqq5r/ACqqq5r/ACOAAP8AEyqr/wAcVVX/ABdVVf8AHFVV/wAXVVX/ABZVVv8AGdVW/wAQVVX/ABxVVf8AEFVV/wAcVVWX/wAbKqv/AAeqq6X/AAeqq6X/AATVVf8AF4AAjaCNoIz/AA7VVYv/AAiqqwiL/wAIqquK/wAO1VWJoImg///7Kqv/ABeAAP//+FVVpf//+FVVpX//ABsqq///76qr/wAcVVX//++qq/8AHFVV///pqqr/ABnVVv//46qr/wAXVVX//+Oqq/8AF1VV///cgAD/ABMqq///1VVVmv//1VVVmlf/AAeAAP//wqqriwgL+OD3HAf/AC6qq4v/ACuqqv//+iqr/wAoqqv///RVVf8AKKqr///0VVX/ACNVVf//7iqrqXOpc/8AF6qr///hgAD/ABFVVWb/ABFVVWb/AAiqq///1Cqri///zVVVi///zVVV///3VVX//9Qqq///7qqrZv//7qqrZv//6FVV///hgABtcwhtc///3Kqr///uKqv//9dVVf//9FVV///XVVX///RVVf//1FVW///6Kqv//9FVVYsIC/1Y+FXH/BP3qPfsx/vs95D4A8cHC/fk+4BP9z77ggf//+Sqq3v//+GqqoD//96qq4X//96qq4X//9xVVYhli12L///WgACTZptmm///4IAAoXGncad3rH2xfbGEtIu3CIu3krSZsZmxn6ylp6Wn/wAfgAChsJuwm/8AKYAAk7mL/wATVVWL/wATqqv///3VVZ////uqq5////uqq/8AEyqrhf8AElVV///4VVUI/wASVVX///hVVZz///aqq/8AD6qrgP8AD6qrgP8ADSqq///0Kqv/AAqqq///81VVCLu9Bf//v1VV/wBBVVU2/wAgqqv//5aqq4tVi///zoAA///2qqte///tVVVe///tVVX//9mAAP//5iqra2pranL//9jVVXn//9Kqq3n//9Kqq4L//85VVYtVi1WU///OKqud///SVVUInf//0lVVpP//2Kqrq2qrav8AJoAA///mVVW4///tqqu4///tqqv/ADGAAP//9tVVwYu5i/8ALSqr/wAE1VX/ACxVVf8ACaqr/wAsVVX/AAmqq/8AKtVW/wAQgAD/AClVVf8AF1VVCAv9WM335Pgg++TN+VhJ+8z8IPfMBwv9WM35WAcL+IhJ/JgHi///6qqr///9qqv//+wqqv//+1VV///tqqv///tVVf//7aqr///4qqv///AqqoH///Kqq4H///Kqq///8tVV///1gAD//++qq///+FVV///vqqv///hVVf//7Cqq///8Kqv//+iqq4v//8FVVYv//9iqq/8AIFVVe/8AQKqrCEl/BZVf/wAUKqv//9zVVf8AHlVV///lqqv/AB5VVf//5aqr/wApKqv///LVVb+LuYv/ACPVVf8AB9VV/wAZqqv/AA+qq/8AGaqr/wAPqqv/ABNVVf8AE1VVmKKYopP/ABiAAI6ljqX/AAGAAP8AF6qri/8AFVVVCAv9WM34ApEH9/v8AuqL/A74FPf699gwi/vr+8yFi4v3zAUL/Vj4IMf73vkcBwv9WM35AI0H+EP9AOCLi/lYSYuL/QCJi/xD+QAFC4tVlP//ziqrnf//0lVVnf//0lVVpP//2Kqrq2qrav8AJoAA///mVVW4///tqqu4///tqqv/ADGAAP//9tVVwYvBi/8AMYAA/wAJKqu4/wASVVW4/wASVVX/ACaAAP8AGaqrq6wIq6yk/wAnVVWd/wAtqqud/wAtqquU/wAx1VWLwYvBgv8AMaqref8ALVVVef8ALVVVcv8AJyqra6xrrP//2YAA/wAZ1VVe/wASqqte/wASqqv//86AAP8ACVVVVYsIVYv//86AAP//9qqrXv//7VVVXv//7VVV///ZgAD//+Yqq2tqa2py///Y1VV5///Sqqt5///SqquC///OVVWLVQgLi7eStJmxmbGfrKWnpaf/AB+AAKGwm7Cb/wApgACTuYu5i/8AKYAAg7B7sHv/AB+AAHWlbwilb59qmWWZZZJii1+LX4RifWV9ZXdqcW9xb///4IAAdWZ7Znv//9aAAINdiwhdi///1oAAk2abZpv//+CAAKFxp3Gnd6x9sX2xhLSLtwgL95D3Jgf/ABKqq4v/ABKqqv///aqr/wASqqv///tVVf8AEqqr///7VVX/ABCAAP//+IAA/wAOVVX///Wqq/8ADlVV///1qqv/AAuqq///8tVVlHuUe/8ABIAA///sqquL///pVVWL///oqqv///uqq///7FVV///3VVV7///3VVV7///0qqv///Mqq33///ZVVQh9///2VVV7hHn///uqq3n///uqq///7aqr///91VX//+1VVYsIC/eQ9yAH/wAiqquL/wAcKqr///uqq/8AFaqr///3VVX/ABWqq///91VV/wAQ1VX///VVVpf///NVVZf///NVVf8ACCqr///yVVb/AARVVf//8VVV/wAEVVX///FVVf8AAiqr///yqquLf4t////91VX///Kqq///+6qr///xVVX///uqq///8VVV///31VX///JVVn////NVVQh////zVVX//+8qq///9VVW///qVVX///dVVf//6lVV///3VVX//+PVVv//+6qr///dVVWLCAv9WM335PcPB/db++TWi/ti9+gF/wATVVX/AAKqq/8AFFVW/wAEqqr/ABVVVf8ABqqr/wAVVVX/AAaqq/8AE4AA/wAKKqr/ABGqq/8ADaqr/wARqqv/AA2qq/8ADqqq/wAR1VX/AAuqq6H/AAuqq6H/AAXVVaeLrYv/AB6qq4algf8AFVVVgf8AFVVV///zVVX/ABGqq///8KqrmQj///Cqq5n//+6qqv8ACqqr///sqqv/AAdVVf//7Kqr/wAHVVV4/wAFVVb//+1VVf8AA1VV///tVVX/AANVVf//7qqrjXv/AACqq3v/AACqq///81VV/wAAVVX///aqq4sIC0xhBaf//9lVVf8AIaqr///kgAD/ACdVVf//76qr/wAnVVX//++qq7b///fVVf8ALqqri/8AHKqri/8AG6qq/wAEVVX/ABqqq/8ACKqr/wAaqqv/AAiqq/8AF4AA/wAM1VX/ABRVVZz/ABRVVZz/ABAqq/8AFNVVl/8AGKqrl/8AGKqrkf8AHFVVi6sIi7eC/wAigAB5pHmk///pgAD/ABOAAHCZcJn//+Kqq/8ACyqr///gVVX/AAhVVf//4FVV/wAIVVX//+Kqq/8ACaqrcJZwlv//6YAAmnmeeZ6C/wAbKquL/wAjVVUIi/8AFqqr/wAEVVX/ABOqqv8ACKqr/wAQqqv/AAiqq/8AEKqr/wALgAD/AA3VVf8ADlVVlv8ADlVVlv8AENVW/wAIVVX/ABNVVf8ABaqr/wATVVX/AAWqq/8AFFVW/wAC1VX/ABVVVYv/AB6qq4v/ABqAAP//+iqr/wAWVVX///RVVf8AFlVV///0VVX/ABOAAP//7oAA/wAQqqv//+iqqwjEtAVzq///44AA/wAW1VVq/wANqqtq/wANqqv//9wqq/8ABtVV///ZVVWLbYv//+NVVf//+9VV///kqqv///eqq///5Kqr///3qqv//+fVVf//86qqdv//76qrdv//76qr///vVVX//+uqqv//86qr///nqqv///Oqq///56qr///51VX//+Qqqov//+CqqwiL///eqqv/AAUqq2//AApVVf//6VVV/wAKVVX//+lVVf8ADdVW///tKqv/ABFVVXz/ABFVVXz/ABOAAP//89VV/wAVqqv///aqq/8AFaqr///2qqv/ABZVVf//96qqov//+Kqrov//+Kqr/wAWVVX///iqqv8AFaqr///4qqv/ABWqq///+Kqr/wATgAD///cqqv8AEVVV///1qqsI/wARVVX///Wqq/8ADdVW///y1VX/AApVVXv/AApVVXv/AAUqq///66qri///51VVi///6qqr///71VX//+zVVf//96qrev//96qrev//9Kqq///xgAD///Gqq3////Gqq3///+8qqv//9qqr///sqqv///lVVf//7Kqr///5VVX//+tVVf///KqrdYsI///cqquL///ggAD/AAdVVf//5FVV/wAOqqv//+RVVf8ADqqr///pgAD/ABZVVf//7qqrqQgL/RzN+Rz3hsf8uk8HC/hJSfw4B4v//+aqq////aqrcP//+1VV///jVVX///tVVf//41VV///21Vb//+VVVv//8lVV///nVVX///JVVf//51VV///sqqv//+uqq3J7cnv//97VVYP//9aqq4v//9aqq4v//97VVZNym3Kb///sqqv/ABRVVf//8lVV/wAYqqsI///yVVX/ABiqq///9tVW/wAaqqr///tVVf8AHKqr///7VVX/AByqq////aqrpov/ABlVVQj4OEn8SQeLZf8ABFVV///bqqv/AAiqq///3VVV/wAIqqv//91VVf8ADoAA///hVVb/ABRVVf//5VVV/wAUVVX//+VVVf8AGqqr///qqquse6x7/wAogACDu4u7i/8AKIAAk6ybrJv/ABqqq/8AFVVV/wAUVVX/ABqqqwj/ABRVVf8AGqqr/wAOgAD/AB6qqv8ACKqr/wAiqqv/AAiqq/8AIqqr/wAEVVX/ACRVVYuxCAv3Yv1Y3Iv3R/kKjYv3R/0K3Iv3YvlYR4v7RP0HiYv7R/kHN4v7R/0HiYv7RPkHBQv7xc33xQf3mPgnQYv7b/vk+2r35DyLBQtX+JLH/EAH+DX45ovB/IGLi0/4LIsFCyP3JDuL9xr7JAUL9wUHi/8AOqqr///vVVX/ACqAAP//3qqr/wAaVVX//96qq/8AGlVV///TVVX/AA0qq1OLbYv//+Cqq///+oAA///fVVWA///fVVWA///kqqv//+/VVXX//+qqqwiuYgX/ACiqq/8AIqqruv8AEVVV/wA1VVWL/wAlVVWLqv//91VV/wAYqqv//+6qq/8AGKqr///uqqv/AAxVVf//41VVi2MIb0UH///pVVWL///l1Vb///6AAP//4lVViP//4lVViG////lVVf//5aqr///1qqv//+Wqq///9aqr///p1VX///CAAHn//+tVVXn//+tVVYJvi///3Kqri///51VV/wAE1VV2/wAJqqv//+6qq/8ACaqr///uqqv/AAyAAP//8dVV/wAPVVWACP8AD1VVgP8AEVVWg/8AE1VVhv8AE1VVhv8AE6qr///9gACfi/8AJ1VVi/8AIIAAkv8AGaqrmf8AGaqrmf8AFYAAof8AEVVVqQiNBov//+Sqq41yj///6VVVCMMGif8ADVVV///+gAD/AA1VVor/AA1VVYr/AA1VVf///yqr/wAOVVb///9VVf8AD1VV////VVX/AA9VVf///4AA/wAQqqv///+qq53///+qq53////VVf8AFFVVi/8AFqqrCAvNbAaL///sqqv///2qq///7NVV///7VVV4///7VVV4///3gAB6///zqqt8///zqqt8///vgAD///PVVf//61VV///2qqv//+tVVf//9qqr///lqqv///tVVWuL///zVVWL///zgAD/AAHVVf//86qr/wADqqv///Oqq/8AA6qr///01VX/AAVVVYGSCIGS///31VWU///5qquW///5qquW///81VX/AAyAAIuZi5//AAWqq/8AEKqr/wALVVX/AA1VVf8AC1VV/wANVVX/AA8qq/8ACqqrnpOek/8AFVVV/wAFqqv/ABeqq/8AA1VV/wAXqqv/AANVVf8AGIAA/wABqqv/ABlVVYsIC4ulkP8AGIAAlaKVov8ADaqrn/8AEVVVnP8AEVVVnP8AFFVW/wANgAD/ABdVVZX/ABdVVZX/ABlVVpD/ABtVVYuni/8AGVVVhv8AFqqrgf8AFqqrgf8AE1VV///ygACbegibev8ADCqrd/8ACFVVdP8ACFVVdP8ABCqr///ngACLcYtx///71VX//+eAAP//96qrdP//96qrdP//89VVd3t6e3r//+yqq///8oAA///pVVWB///pVVWB///mqquGb4sI///kqquL///mqqqQ///oqquV///oqquV///rqqr/AA2AAP//7qqrnP//7qqrnP//8lVVn4GigaKG/wAYgACLpQgLXbEF///wqqv//+yqq///7dVV///wgAB2///0VVV2///0VVX//+jVVf//+iqr///mqquLb4v//+aqq5D//+lVVZX//+lVVZX//+yqq/8ADYAAe5x7nP//89VVn///96qrov//96qrov//+9VV/wAYgACLpQiLpf8ABCqr/wAYgAD/AAhVVaL/AAhVVaL/AAwqq5+bnJuc/wATVVX/AA2AAP8AFqqrlf8AFqqrlf8AGVVVkKeLo4v/ABZVVf//+oAA/wAUqquA/wAUqquAnv//8NVV/wARVVX//+yqqwi7rwX//+lVVf8AGVVV///mKqv/ABOqq26Zbpn//+CAAJJpi///3Kqri///31VVhW1/bX///+ZVVf//7yqr///qqqv//+pVVf//6qqr///qVVX//+9VVf//5lVWf///4lVVf///4lVVhf//34AAi///3KqrCIv//9yqq5H//9+AAJf//+JVVZf//+JVVf8AEKqr///mVVb/ABVVVf//6lVV/wAVVVX//+pVVf8AGaqr///vKqupf6l//wAgqquF/wAjVVWL/wAhVVWLqv8ABoAA/wAcqquY/wAcqquY/wAZqqr/ABQqq/8AFqqr/wAbVVUICzrH+YhP/AuJB///9qqrm///9FVV/wAN1VV9/wALqqt9/wALqqv///DVVf8ACaqq///vqqv/AAeqq///76qr/wAHqqv//+7VVf8ABaqqef8AA6qref8AA6qr///uVVX/AAHVVf//7qqri///3Kqri///31VVhW1/bX///+ZVVf//7yqr///qqqv//+pVVQj//+qqq///6lVV///vVVX//+ZVVn///+JVVX///+JVVYX//9+AAIv//9yqq4v//9yqq5H//9+AAJf//+JVVZf//+JVVf8AEKqr///mVVb/ABVVVf//6lVV/wAVVVX//+pVVf8AGaqr///vKqupf6l//wAgqquF/wAjVVWLCP8AEVVVi/8AEaqr/wAB1VWd/wADqqud/wADqqv/ABEqq/8ABaqq/wAQVVX/AAeqq/8AEFVV/wAHqqv/AA8qq/8ACaqqmf8AC6qrmf8AC6qr/wALqqv/AA3VVf8ACVVVmwgLi3GG///ngACBdIF0///yVVV3///uqqt6///uqqt6///rqqr///KAAP//6Kqrgf//6Kqrgf//5qqqhv//5Kqri2+L///mqquQ///pVVWV///pVVWV///sqqv/AA2AAHucCHuc///z1VWf///3qqui///3qqui///71VX/ABiAAIuli6X/AAQqq/8AGIAA/wAIVVWi/wAIVVWi/wAMKqufm5ybnP8AE1VV/wANgAD/ABaqq5X/ABaqq5X/ABlVVZCniwj/ABtVVYv/ABlVVob/ABdVVYH/ABdVVYH/ABRVVv//8oAA/wARVVV6/wARVVV6/wANqqt3lXSVdJD//+eAAItxCAtfsAX///Cqq///5qqrdXf//+NVVf//8VVV///jVVX///FVVf//4lVW///4qqv//+FVVYv//9yqq4v//+Mqqv8ABqqr///pqqv/AA1VVf//6aqr/wANVVX//+4qqpv///Kqq/8AEqqr///yqqv/ABKqq///9tVV/wATKqqG/wATqquG/wATqqv///2AAP8AECqqi/8ADKqrCPgYtQaL/wAaqqv///tVVf8AGlVV///2qqul///2qqul///yKqr/ABcqq///7aqr/wAUVVX//+2qq/8AFFVV///pVVX/ABBVVnD/AAxVVXD/AAxVVf//4NVV/wAGKqv//9yqq4tpi2z///nVVW////Oqq2////Oqq///56qrev//61VV///qVVUI///rVVX//+pVVXv//+aAAP//9Kqr///iqqv///Sqq///4qqr///6VVVri///3VVVi2f/AAWAAP//3yqrlv//4lVVlv//4lVV/wAP1VX//+ZVVv8AFKqr///qVVX/ABSqq///6lVV/wAYqqr//+8qq/8AHKqrf/8AHKqrf6uF/wAjVVWLCP8AKVVVi/8AJdVW/wAHqqv/ACJVVf8AD1VV/wAiVVX/AA9VVf8AHNVW/wAZVVb/ABdVVf8AI1VVCAv73AaLkf8AAqqr/wALKqv/AAVVVf8AEFVV/wAFVVX/ABBVVZT/ABDVVv8ADKqr/wARVVX/AAyqq/8AEVVV/wARKqr/AA9VVv8AFaqr/wANVVX/ABWqq/8ADVVV/wAbKqr/AAaqq/8AIKqri6GL/wAU1VWH/wATqquD/wATqquDnP//9Sqr/wAOVVX///JVVQj/AA5VVf//8lVV/wALVVb///Aqq/8ACFVVef8ACFVVef8ABCqr///sqquL///rVVUIC/wsx/gs9wDB+wD3FQfdprTBHv8AFqqri53///yqq/8ADVVV///5VVUIl78FeZN0j2+L///xVVWL///wgAD///2AAP//76qrhv//76qrhv//8Sqq///3gAD///Kqq3////Kqq3////TVVf//8Cqrgv//7FVVgv//7FVV///7gAD//+cqq4ttCPsrK1UHC/hETz2JB///7qqrp///6IAAof//4lVVm///4lVVm///3Sqrk2OLaYtr///5qqtt///zVVVt///zVVX//+XVVXr//+mqq///6qqr///pqqv//+qqq///7lVVcn7//+NVVX7//+NVVf//+YAA///hVVaL///fVVUIi///31VV/wAGgAD//+FVVpj//+NVVZj//+NVVf8AEaqr///m1Vb/ABZVVf//6lVV/wAWVVX//+pVVf8AGiqreqn///Oqq6n///Oqq6v///nVVa2Ls4v/ACLVVZP/AB2qq5v/AB2qq5v/ABeAAKH/ABFVVacIjUsGi///91VV////qqv///Sqq////1VVff///1VVff///dVW///xKqv///xVVf//8FVV///8VVX///BVVf//+lVW///wVVb///hVVf//8FVV///4VVX///BVVf//9VVW///xqqv///JVVX7///JVVX7//+6qq///9YAAdoN2g///5iqrh///4VVViwhni2mSa5lrmf//5VVVof//6qqrqQhcXwWX///wqqv/AA4qq///8lVV/wAQVVV//wAQVVV//wASKqv///XVVZ////eqq5////eqq/8AFSqr///5qqr/ABZVVf//+6qr/wAWVVX///uqq/8AFtVW///91VX/ABdVVYv/ABdVVYul/wADVVX/AByqq/8ABqqr/wAcqqv/AAaqq/8AGtVVmKT/ABNVVQik/wATVVX/ABTVVf8AG1VW/wAQqqv/ACNVVf8AEKqr/wAjVVX/AAhVVf8ALlVWi/8AOVVVCAuL///mqqv///sqq///6Cqq///2VVX//+mqq///9lVV///pqqt+///sqqr//++qq///76qr///vqqv//++qq///7Kqqfv//6aqr///2VVX//+mqq///9lVV///oKqr///sqq///5qqri///5qqri///6Cqq/wAE1VX//+mqq/8ACaqr///pqqv/AAmqq///7KqqmP//76qr/wAQVVUI///vqqv/ABBVVX7/ABNVVv//9lVV/wAWVVX///ZVVf8AFlVV///7Kqv/ABfVVov/ABlVVYv/ABlVVf8ABNVV/wAX1Vb/AAmqq/8AFlVV/wAJqqv/ABZVVZj/ABNVVv8AEFVV/wAQVVX/ABBVVf8AEFVV/wATVVaY/wAWVVX/AAmqq/8AFlVV/wAJqqv/ABfVVv8ABNVV/wAZVVWLCP8AGVVVi/8AF9VW///7Kqv/ABZVVf//9lVV/wAWVVX///ZVVf8AE1VWfv8AEFVV///vqqv/ABBVVf//76qrmP//7Kqq/wAJqqv//+mqq/8ACaqr///pqqv/AATVVf//6Cqqi///5qqrCAv9iMf3eweLq/8ABCqr/wAb1VX/AAhVVf8AF6qr/wAIVVX/ABeqq/8AC1VW/wATqqr/AA5VVf8AD6qr/wAOVVX/AA+qq5z/AAuqqv8AE6qr/wAHqqv/ABOqq/8AB6qr/wAU1VX/AAPVVaGLo4v/ABOAAP//+9VVmv//96qrmv//96qr/wALqqv///TVVf8ACFVVfQj/AAhVVX3/AAXVVv//8Cqr/wADVVX//+5VVf8AA1VV///uVVX/AAGqq///7dVWi///7VVVCPukx/enB4v/ABlVVf///YAA/wAYqquGo4ajgv8AFSqrfv8AElVVfv8AElVV///uKqv/AA7VVv//6VVV/wALVVX//+lVVf8AC1VV///iqqv/AAWqq2eL///aqquL///fVVX///bVVW///+2qq2///+2qq3f//+oqqn///+aqqwiJ+AsGC/xix/hiBwuL///zVVX/AARVVf//9VVW/wAIqqv///dVVf8ACKqr///3VVX/AAqqqv//+6qr/wAMqquL/wAMqquL/wAKqqr/AARVVf8ACKqr/wAIqqv/AAiqq/8ACKqr/wAEVVX/AAqqqov/AAyqq4v/AAyqq///+6qr/wAKqqr///dVVf8ACKqr///3VVX/AAiqq///9VVW/wAEVVX///NVVYsI///zVVWL///1VVb///uqq///91VV///3VVX///dVVf//91VV///7qqv///VVVov///NVVQgL+LNP/LgHi///8qqr////Kqv///NVVf///lVVf////lVVf////Kqr///1gACGgoaC///4qqv///iqq///9lVV///6VVX///ZVVf//+lVV///zKqv///0qq3uL///0qquL///zVVX/AAKqq33/AAVVVQiCVgWbhZuIm4v/ABqqq4v/ABXVVf8AA9VVnP8AB6qrnP8AB6qr/wANgAD/AArVVZWZlZn/AAbVVf8AEKqr/wADqqv/ABNVVf8AA6qr/wATVVX/AAHVVf8AFaqri6MIC/2Ix/eIB/eR+4jmi/ue9473gvdnM4v7ePtli/iMBQv9iMf5iAcL++DH93sHi6v/AAQqq/8AG9VV/wAIVVX/ABeqq/8ACFVV/wAXqqv/AAtVVv8AE6qq/wAOVVX/AA+qq/8ADlVV/wAPqquc/wALqqr/ABOqq/8AB6qr/wATqqv/AAeqq/8AFNVV/wAD1VWhi6OL/wATgAD///vVVZr///eqq5r///eqq/8AC6qr///01VX/AAhVVX0I/wAIVVV9/wAF1Vb///Aqq/8AA1VV///uVVX/AANVVf//7lVV/wABqqv//+3VVov//+1VVQj7pMf3pweL/wAZVVX///2AAP8AGKqrhqOGo4L/ABUqq37/ABJVVX7/ABJVVf//7iqr/wAO1Vb//+lVVf8AC1VV///pVVX/AAtVVf//4qqr/wAFqqtni///2qqri///31VV///21VVv///tqqtv///tqqt3///qKqp////mqqsIiAb///6qq/8ABKqr////Kqr/AApVVf///6qrm////6qrm////4AA/wAQqqv///9VVf8AEVVVCE8Gi4X/AABVVf//94AA/wAAqquA/wAAqquA/wAAgAD///Qqq/8AAFVV///zVVX/AABVVf//81VV/wAAgAD///OAAP8AAKqr///zqqv/AACqq///86qr/wAAVVX///WAAIv///dVVQgLi///3Kqrkf//34AAl///4lVVl///4lVV/wAQqqv//+ZVVv8AFVVV///qVVX/ABVVVf//6lVV/wAZqqv//+8qq6l/qX//ACCqq4X/ACNVVYv/ACNVVYv/ACCAAJH/AB2qq5f/AB2qq5f/ABmqqv8AENVV/wAVqqv/ABWqqwj/ABWqq/8AFaqr/wAQ1VX/ABmqqpf/AB2qq5f/AB2qq5H/ACCAAIv/ACNVVYv/ACNVVYX/ACCAAH//AB2qq3//AB2qq///7yqr/wAZqqr//+pVVf8AFaqr///qVVX/ABWqq///5lVW/wAQ1VX//+JVVZf//+JVVZf//9+AAJH//9yqq4sI///cqquL///fVVWFbX9tf///5lVV///vKqv//+qqq///6lVV///qqqv//+pVVf//71VV///mVVZ////iVVV////iVVWF///fgACL///cqqsIC4ul/wAEKqv/ABiAAP8ACFVVov8ACFVVov8ADCqrn5ucm5z/ABNVVf8ADYAA/wAWqquV/wAWqquV/wAZVVWQp4uni/8AGVVVhv8AFqqrgf8AFqqrgf8AE1VV///ygACbegibev8ADCqrd/8ACFVVdP8ACFVVdP8ABCqr///ngACLcYtx///71VX//+eAAP//96qrdP//96qrdP//89VVd3t6e3r//+yqq///8oAA///pVVWB///pVVWB///mqquGb4sIb4v//+aqq5D//+lVVZX//+lVVZX//+yqq/8ADYAAe5x7nP//89VVn///96qrov//96qrov//+9VV/wAYgACLpQgL++DH95AHi/8AFqqrjv8AFSqqkf8AE6qrkf8AE6qr/wAJKqv/ABEqqv8ADFVV/wAOqqv/AAxVVf8ADqqr/wAPqqv/AAuAAJ7/AAhVVZ7/AAhVVf8AFoAA/wAEKquli/8AB1VVi/8AB6qr///+qquT///9VVUIksYFhf8AAVVV///6Kqv/AAEqq///+lVVjP//+lVVjP//+iqr/wAAgACFi///3VVVi///4qqr///3VVVz///uqqtz///uqqv//+xVVf//6aqq///wqqv//+Sqq////qqr/wAEqqv///8qqv8AClVV////qqub////qqub////gAD/ABCqq////1VV/wARVVUITwaLhf8AAFVV///3gAD/AACqq4D/AACqq4D/AACAAP//9Cqr/wAAVVX///NVVf8AAFVV///zVVX/AACAAP//84AA/wAAqqv///Oqq/8AAKqr///zqqv/AABVVf//9YAAi///91VVCAtWZwWda/8AGYAA///oVVWs///wqqus///wqqv/ACSAAP//+FVVs4uhi6COn5Gfkf8AEdVVlP8AD6qrl/8AD6qrl/8ADFVV/wAO1VWU/wARqquU/wARqqv/AASAAP8AFNVVi6MIi/8AH1VV///5Kqv/ABgqq///8lVVnP//8lVVnP//7yqrmHeUd5R1/wAGgABzj3OPdf8ABNVVd/8ABaqrd/8ABaqr///vKqv/AAfVVf//8lVVlf//8lVVlf//+Sqr/wAPVVWL/wAUqqsIi5f/AAMqq/8ACqqr/wAGVVX/AAlVVf8ABlVV/wAJVVX/AAfVVv8AB6qr/wAJVVWR/wAJVVWR/wAKgAD/AASqq/8AC6qr/wADVVX/AAuqq/8AA1VV/wALKqr/AAGqq/8ACqqri/8AG1VVi/8AFiqr///6gACcgJyA/wAOKqv//+/VVf8AC1VV///qqqsIwasF///wqqup///qgACh///kVVWZ///kVVWZ///fKquSZYv//+yqq4t4///9VVX//+1VVf//+qqr///tVVX///qqq///7yqr///31VV8gHyA///z1VX///Iqq///9qqr///vVVX///aqq///71VV///7VVX//+xVVov//+lVVQiL///iqqv/AAbVVf//6VVV/wANqqt7/wANqqt7/wAQ1VX///OAAJ+Cn4Kh///5VVWj///7qquj///7qquh///61VWfhZ+F/wAQ1VX///eqq/8ADaqr///1VVX/AA2qq///9VVV/wAG1VV7i///6qqrCIv///Kqq////NVV///0Kqr///mqq///9aqr///5qqv///Wqq///99VV///3KqqB///4qquB///4qqv///Sqq///+lVV///zVVWH///zVVWH///zVVaJ///zVVWL///kqquLcf8ABoAA///nVVWY///nVVWY///tVVb/ABLVVf//81VV/wAYqqsIC8H7GPcZT/sZJ1Xv+8EHi///71VV/wACKqv///CAAP8ABFVV///xqqv/AARVVf//8aqr/wAG1Vb///OAAP8ACVVV///1VVX/AAlVVf//9VVV/wAMVVb///eAAP8AD1VV///5qqv/AA9VVf//+aqr/wASVVb///zVVf8AFVVVi/8AC1VVi5j/AAGqq/8ADqqr/wADVVX/AA6qq/8AA1VVmP8AA6qr/wALVVWPCIbBBf//9VVV///7VVX///TVVv///Cqr///0VVWI///0VVWI///0gAD///6AAP//9Kqri3eL///wVVX/AAWqq///9Kqr/wALVVX///Sqq/8AC1VV///6VVWbi/8AFKqrCPfBBwv34E/7eweLa///+9VV///kKqv///eqq///6FVV///3qqv//+hVVf//9Kqq///sVVb///Gqq///8FVV///xqqv///BVVXr///RVVv//7FVV///4VVX//+xVVf//+FVV///rKqv///wqq3WLc4v//+yAAP8ABCqrfP8ACFVVfP8ACFVV///0VVX/AAsqq///96qrmQj///eqq5n///oqqv8AD9VV///8qqv/ABGqq////Kqr/wARqqv///5VVf8AEiqqi/8AEqqrCPekT/unB4v//+aqq/8AAlVV///nVVX/AASqq3P/AASqq3P/AAjVVf//6tVVmP//7aqrmP//7aqrnf//8Sqqov//9Kqrov//9Kqr/wAdgAD///pVVa+L/wAlVVWL/wAgqqv/AAkqq6f/ABJVVaf/ABJVVZ//ABXVVpf/ABlVVQiOBv8AAVVV///7VVX/AADVVv//9aqr/wAAVVV7/wAAVVV7/wAAgAD//+9VVf8AAKqr///uqqsIxwaLkf///6qr/wAIgAD///9VVZb///9VVZb///+AAP8AC9VV////qqv/AAyqq////6qr/wAMqqv///+AAP8ADIAA////VVX/AAxVVf///1VV/wAMVVX///+qq/8ACoAAi/8ACKqrCAv3JfxiyYv3FfgOjYv3HvwOyYv3HPhiT4v7AfwXiYv7HfgXUov7FfwXiYv7BPgXBQv3gvjxS4v7KfwZ+y34GUiL91D8ZGEgBf///Kqr///2qqv///wqqv//9tVV///7qquC///7qquC///61VX///fVVYX///iqq4X///iqq///+NVVhf//96qr///7VVX///eqq///+1VV///2gAD///2qq///9VVVi///9qqri///9tVV/wABKquC/wACVVWC/wACVVX///cqq/8AAoAA///3VVX/AAKqqwiFUwX/AAlVVf///VVV/wAJqqv///3VVpX///5VVZX///5VVZX///8qq5WL/wAhVVWL/wAaqqv/AAiqq5//ABFVVZ//ABFVVf8AD6qr/wAXqqv/AAtVVakIC2f4CMH7tAf3qPgIi6/77ouLVfebiwULi/8ADVVV///7VVX/AAtVVv//9qqr/wAJVVX///aqq/8ACVVV///0qqr/AASqq///8qqri///8qqri///9Kqq///7VVX///aqq///9qqr///2qqv///aqq///+1VV///0qqqL///yqquL///yqqv/AASqq///9Kqq/wAJVVX///aqq/8ACVVV///2qqv/AAtVVv//+1VV/wANVVWLCP8ADVVVi/8AC1VW/wAEqqv/AAlVVf8ACVVV/wAJVVX/AAlVVf8ABKqr/wALVVaL/wANVVUIC4v//8yqq/8ACdVV///P1VX/ABOqq17/ABOqq17/ABqqqv//2Kqr/wAhqqv//95VVf8AIaqr///eVVX/ACdVVf//5VVWuP//7FVVuP//7FVV/wAwKqv///Yqq/8AM1VVi/8AM1VVi/8AMCqr/wAJ1VW4/wATqqu4/wATqqv/ACdVVf8AGqqq/wAhqqv/ACGqqwj/ACGqq/8AIaqr/wAaqqr/ACdVVf8AE6qruP8AE6qruP8ACdVV/wAwKquL/wAzVVWL/wAzVVX///Yqq/8AMCqr///sVVW4///sVVW4///lVVb/ACdVVf//3lVV/wAhqqv//95VVf8AIaqr///Yqqv/ABqqql7/ABOqq17/ABOqq///z9VV/wAJ1VX//8yqq4sI///MqquL///P1VX///Yqq17//+xVVV7//+xVVf//2Kqr///lVVb//95VVf//3lVV///eVVX//95VVf//5VVW///Yqqv//+xVVV7//+xVVV7///Yqq///z9VVi///zKqrCAuLt/8ACFVV/wApVVX/ABCqq/8AJqqr/wAQqqv/ACaqq/8AFqqq/wAhqqr/AByqq/8AHKqr/wAcqqv/AByqq/8AIaqq/wAWqqr/ACaqq/8AEKqr/wAmqqv/ABCqq/8AKVVV/wAIVVW3i7eL/wApVVX///eqq/8AJqqr///vVVX/ACaqq///71VV/wAhqqr//+lVVv8AHKqr///jVVUI/wAcqqv//+NVVf8AFqqq///eVVb/ABCqq///2VVV/wAQqqv//9lVVf8ACFVV///WqquLX4tf///3qqv//9aqq///71VV///ZVVX//+9VVf//2VVV///pVVb//95VVv//41VV///jVVX//+NVVf//41VV///eVVb//+lVVv//2VVV///vVVX//9lVVf//71VV///Wqqv///eqq1+LCF+L///Wqqv/AAhVVf//2VVV/wAQqqv//9lVVf8AEKqr///eVVb/ABaqqv//41VV/wAcqqv//+NVVf8AHKqr///pVVb/ACGqqv//71VV/wAmqqv//+9VVf8AJqqr///3qqv/AClVVYu3CAv3Hftft6b7CvdE9wj3QmGoBQu7+5xbBwtg97i7+3AH9xP3DQWX/wALVVX/AAuAAP8AC1VWlv8AC1VVlv8AC1VV/wAJqqv/AAuqq/8ACFVVl/8ACFVVl/8ABtVWmP8ABVVVmf8ABVVVmf8AAqqrmoubi/8AIqqrfv8AGtVVcZ5xnv//36qr/wAJgAD//9lVVYsI///zVVWL///ygAD///4qq///8aqr///8VVX///Gqq////FVV///yVVX///oqq36DfoP///RVVf//9YAA///1qqt+///1qqt+///4gAD//+/VVf//+1VV///sqqsIvocF/wAFVVX/AA9VVf8ACVVW/wANqqv/AA1VVZf/AA1VVZf/ABNVVpH/ABlVVYv/ABqqq4v/ABSqqv//+iqr/wAOqqv///RVVf8ADqqr///0VVX/AAdVVf//8NVWi///7VVVi///6Kqr///5qqv//+xVVf//81VVe///81VVe///8Kqr///vVVV5///uqqsICyP7JL2L9xr3JAUL9+BP+3sHi2v///vVVf//5Cqr///3qqv//+hVVf//96qr///oVVX///Sqqv//7FVW///xqqv///BVVf//8aqr///wVVV6///0VVb//+xVVf//+FVV///sVVX///hVVf//6yqr///8Kqt1i3OL///sgAD/AAQqq3z/AAhVVXz/AAhVVf//9FVV/wALKqv///eqq5kI///3qquZ///6Kqr/AA/VVf///Kqr/wARqqv///yqq/8AEaqr///+VVX/ABIqqov/ABKqqwj3pE/9Rsb3kgf/AA1VVX+b///2qqv/ABKqq///+VVV/wASqqv///lVVaL///yqq/8AG1VVi/8AJVVVi/8AIKqr/wAJKqun/wASVVWn/wASVVWf/wAV1VaX/wAZVVUIjgb/AAFVVf//+1VV/wAA1Vb///Wqq/8AAFVVe/8AAFVVe/8AAIAA///vVVX/AACqq///7qqrCMcGi5H///+qq/8ACIAA////VVWW////VVWW////gAD/AAvVVf///6qr/wAMqqv///+qq/8ADKqr////gAD/AAyAAP///1VV/wAMVVX///9VVf8ADFVV////qqv/AAqAAIv/AAiqqwgL/AfB+D1VB/sCNaRpBQv7HfdfX3D3CvtE+wj7QrVuBQslwfHLu0v3plAH+037qYteBQv7XvscB/ca914FC/sA+yTGi9z3ANz7AMyL+wD3JAULrwb/AANVVZf/AAWAAJb/AAeqq5X/AAeqq5X/AAuAAJD/AA9VVYuVi/8ACoAA///9VVWW///6qquW///6qqv/AAuAAP//+qqql///+qqrl///+qqr/wAMKqv///qqqv8ADFVV///6qqv/AAxVVf//+qqr/wAM1Vb///1VVf8ADVVViwj/AAyqq4v/AAtVVY6VkZWR/wAIgAD/AAfVVZL/AAmqq5L/AAmqq/8ABYAAlo//AAxVVY//AAxVVf8AAqqr/wAMKqv/AAFVVZcIZwb///1VVX+GgP//+Kqrgf//+KqrgYCG///xVVWL///2qquLgf8AAoAA///1VVWQ///1VVWQgP8ABSqr///0qqv/AAVVVf//9KqrkX//AAWqq///81VV/wAFVVX///NVVf8ABVVVfv8AAqqr///yqquLCP//8qqri3////zVVf//9VVV///5qqv///VVVf//+aqrgv//99VV///4qquB///4qqv///aqq4X///Uqqv//+1VV///zqqv///tVVf//86qriP//9Cqq///+qqv///SqqwgLi///8qqr/wACgAD///OqqpD///Sqq5D///Sqq/8ABqqrgf8ACFVV///3VVX/AAhVVf//91VV/wAJ1Vb///kqq/8AC1VVhv8AC1VVhv8ADFVW///9gAD/AA1VVYv/AAyqq4uX/wACqqv/AAtVVf8ABVVV/wALVVX/AAVVVf8ACdVWkv8ACFVV/wAIqqsI/wAIVVX/AAiqq/8ABoAAlf8ABKqr/wALVVX/AASqq/8AC1VV/wACVVX/AAuqq4uXi/8ADKqr///9qquX///7VVX/AAtVVf//+1VV/wALVVX///mAAP8ACiqr///3qquU///3qquU///2Kqr/AAcqq///9Kqr/wAFVVX///Sqq/8ABVVVf/8AAqqr///zVVWLCP//8qqri///86qq///9gAD///Sqq4b///Sqq4b///Yqqv//+Sqr///3qqv///dVVf//96qr///3VVX///lVVf//9dVWhv//9FVVhv//9FVV///9gAD///PVVov///NVVQgLi///71VV///6qqt9///1VVX///Sqq///9VVV///0qqv///JVVv//+lVV///vVVWLe4v///KAAP8ABYAAgJaAlv//+oAA/wAN1VWL/wAQqquL/wAQqqv/AAVVVf8ADiqq/wAKqqv/AAuqq/8ACqqr/wALqqv/AA2qqv8ABdVV/wAQqquLCP8AEKqri/8ADaqq///6VVX/AAqqq///9Kqr/wAKqqv///Sqq/8ABVVVfYv//+9VVQgL95D3HAf/AC6qq4v/ACuqqv//+iqr/wAoqqv///RVVf8AKKqr///0VVX/ACNVVf//7iqrqXOpc/8AF6qr///hgAD/ABFVVWb/ABFVVWb/AAiqq///1Cqri///zVVVi///zVVV///3VVX//9Qqq///7qqrZv//7qqrZv//6FVV///hgABtcwhtc///3Kqr///uKqv//9dVVf//9FVV///XVVX///RVVf//1FVW///6Kqv//9FVVYsI+xz3rveWwQYL++r3bwf/AD1VVYu//wAHgAD/ACqqq5r/ACqqq5r/ACOAAP8AEyqr/wAcVVX/ABdVVf8AHFVV/wAXVVX/ABZVVv8AGdVW/wAQVVX/ABxVVf8AEFVV/wAcVVWX/wAbKqv/AAeqq6X/AAeqq6X/AATVVf8AF4AAjaCNoIz/AA7VVYv/AAiqqwiL/wAIqquK/wAO1VWJoImg///7Kqv/ABeAAP//+FVVpf//+FVVpX//ABsqq///76qr/wAcVVX//++qq/8AHFVV///pqqr/ABnVVv//46qr/wAXVVX//+Oqq/8AF1VV///cgAD/ABMqq///1VVVmv//1VVVmlf/AAeAAP//wqqriwj7b/vMPVUGC68G/wADVVWX/wAFgACW/wAHqquV/wAHqquV/wALgACQ/wAPVVWLlYv/AAqAAP///VVVlv//+qqrlv//+qqr/wALgAD///qqqpf///qqq5f///qqq/8ADCqr///6qqr/AAxVVf//+qqr/wAMVVX///qqq/8ADNVW///9VVX/AA1VVYsI/wANVVWL/wALgACO/wAJqquR/wAJqquR/wAIVVX/AAfVVZL/AAmqq5L/AAmqq/8ABYAAlo//AAxVVY//AAxVVf8AAqqr/wAMKqv/AAFVVZcIZwb///1VVX+GgP//+Kqrgf//+KqrgYCG///xVVWL///2qquLgf8AAoAA///1VVWQ///1VVWQgP8ABSqr///0qqv/AAVVVf//9KqrkX//AAWqq///81VV/wAFVVX///NVVf8ABVVVfv8AAqqr///yqquLCP//8qqri3////zVVf//9VVV///5qqv///VVVf//+aqrgv//99VV///4qquB///4qqv///aqq4X///Uqqv//+1VV///zqqv///tVVf//86qriP//9Cqq///+qqv///SqqwgLi///81VV/wACgAD///PVVpD///RVVZD///RVVf8ABqqr///11Vb/AAhVVf//91VV/wAIVVX///dVVf8ACdVW///5Kqv/AAtVVYb/AAtVVYb/AAxVVv///YAA/wANVVWL/wAMqquLl/8AAqqr/wALVVX/AAVVVf8AC1VV/wAFVVX/AAnVVpL/AAhVVf8ACKqrCP8ACFVV/wAIqqv/AAaAAJX/AASqq/8AC1VV/wAEqqv/AAtVVf8AAlVV/wALqquLl4v/AAyqq////aqrl///+1VV/wALVVX///tVVf8AC1VV///5gAD/AAoqq///96qrlP//96qrlP//9iqq/wAHKqv///Sqq/8ABVVV///0qqv/AAVVVX//AAKqq///81VViwj///Kqq4v///Oqqv///YAA///0qquG///0qquG///2Kqr///kqq///96qr///3VVX///eqq///91VV///5VVX///XVVob///RVVYb///RVVf///YAA///z1VaL///zVVUIC/u8Bov/ABSqq/8AA4AA/wATVVWSnZKd/wAJ1VX/AA/VVf8ADKqr/wANqqv/AAyqq/8ADaqr/wAPgAD/AArVVf8AElVVk/8AElVVk/8AFNVWj/8AF1VVi/8AGVVVi/8AFdVWh/8AElVVg/8AElVVg/8ADyqr///1VVWX///yqqsIl///8qqrlP//8Cqqkf//7aqrkf//7aqrjv//7IAAi///61VVCAthBo1j/wAOKqts/wAaVVV1/wAaVVV1/wAhKquAs4uzi/8AISqrlv8AGlVVof8AGlVVof8AD4AAqv8ABKqrswhhBv//+VVVbf//9IAA///rgAD//++qq4D//++qq4D//+jVVf//+oAAbYtxi///6dVV/wAGVVX//+2qq/8ADKqr///tqqv/AAyqq///9NVV/wATqqqH/wAaqqsIC2EGjWP/AA5VVWz/ABqqq3X/ABqqq3WsgP8AJ1VVi7OL/wAhKquW/wAaVVWh/wAaVVWh/wAPgACq/wAEqquzCGEG///5VVX//+Kqq///9IAA///rqqr//++qq///9Kqr///vqqv///Sqq///6NVV///6VVVti3GL///p1VX/AAZVVf//7aqr/wAMqqv//+2qq/8ADKqr///01VX/ABOqqof/ABqqqwgL9fckVYs1+wY49wZNi/cB+yQFC1j7TcCLyvdNBQtZ+znAi8n3OQUL+LNP/LgHi///8qqr////Kqv///NVVf///lVVf////lVVf////Kqr///1gACGgoaC///4qqv///iqq///9lVV///6VVX///ZVVf//+lVV///zKqv///0qq3uL///1VVWL///zVVb/AAKqq///8VVV/wAFVVUIglYFm4WbiJuL/wAaqquL/wAV1VX/AAPVVZz/AAeqq5z/AAeqq/8ADYAA/wAK1VWVmZWZ/wAG1VX/ABCqq/8AA6qr/wATVVX/AAOqq/8AE1VV/wAB1VX/ABWqq4ujCAv5Fov7s/lcQYsFC/ePxftZ3Qar/wAIqqv/ABwqq/8ADSqq/wAYVVX/ABGqq/8AGFVV/wARqqv/ABSAAP8AFSqq/wAQqqv/ABiqq/8AEKqr/wAYqqv/AAyqqv8AGyqq/wAIqqv/AB2qq/8ACKqr/wAdqqv/AARVVf8AHtVVi6uLt///94AA/wAoqqt6/wAlVVV6/wAlVVV0/wAgKqtupghupv//3iqroP//2VVVmv//2VVVmv//11VW/wAHgAD//9VVVYv//9Sqq4ti///4gAD//9lVVXz//9lVVXxpdv//4qqrcP//4qqrcP//6NVV///f1VV6///aqqt6///aqqv///eAAGKL///TVVUIi2v/AARVVf//4VVV/wAIqqv//+Kqq/8ACKqr///iqqv/AAzVVf//5SqqnP//56qrnP//56qr/wAUqqv//+rVVf8AGFVVef8AGFVVef8AG9VW///yqqv/AB9VVf//91VVCDn7WVH3j/dJB23/AASqq///5YAA/wAJVVV0mXSZ///sqqv/ABFVVf//8FVV/wAUqqv///BVVf8AFKqr///0VVb/ABeAAP//+FVV/wAaVVX///hVVf8AGlVV///8Kqv/ABvVVov/AB1VVYv/ACNVVf8ABoAA/wAgqquYqZip/wAR1VX/ABnVVf8AFqqr/wAVqqsI/wAWqqv/ABWqq/8AGqqqnP8AHqqr/wAMVVX/AB6qq/8ADFVVrP8ABiqr/wAjVVWL/wAjVVWLrIX/AB6qq3//AB6qq3//ABqqqv//7yqr/wAWqqv//+pVVf8AFqqr///qVVX/ABHVVf//5iqrmG2Ybf8ABoAAaotnCItt///8Kqtv///4VVVx///4VVVx///0VVb//+iqq///8FVV///rVVX///BVVf//61VV///sqqv//+7VVnT///JVVXT///JVVf//5YAA///2gABt///6qqsIC0z7eMaL2Pd4BQuL///qqquP///sKqqT///tqquT///tqquW///v1VWZfZl9/wAQKquA/wASVVWD/wASVVWD/wAT1VaH/wAVVVWL/wAUqquL/wATqqqP/wASqquT/wASqquT/wAQVVWWmZkImZmW/wAQKquT/wASVVWT/wASVVWP/wAT1VaL/wAVVVWL/wAUqquH/wATqqqD/wASqquD/wASqquA/wAQVVV9mX2Z///vqquW///tVVWT///tVVWT///sVVaP///rVVWLCP//6qqri///7Cqqh///7aqrg///7aqrg///79VVgH19fX2A///vqquD///tVVWD///tVVWH///sVVaL///rVVUIC4v/AA6qq/8AAqqr/wANqqr/AAVVVf8ADKqr/wAFVVX/AAyqq/8AB4AAlv8ACaqr/wAJVVX/AAmqq/8ACVVV/wALKqr/AAeAAP8ADKqr/wAFqqv/AAyqq/8ABaqr/wANqqr/AALVVf8ADqqri/8ADqqri/8ADaqq///9Kqv/AAyqq///+lVV/wAMqqv///pVVZb///iAAP8ACVVV///2qqsI/wAJVVX///aqq/8AB4AAgP8ABaqr///zVVX/AAWqq///81VV/wAC1VX///JVVov///FVVYv///FVVf///Sqr///yVVb///pVVf//81VV///6VVX///NVVf//+IAA///01Vb///aqq///9lVV///2qqv///ZVVYD///iAAP//81VV///6qqv///NVVf//+qqr///yVVb///1VVf//8VVViwj///FVVYv///JVVv8AAqqr///zVVX/AAVVVf//81VV/wAFVVX///TVVv8AB4AA///2VVX/AAmqq///9lVV/wAJqqv///iAAP8ACyqq///6qqv/AAyqq///+qqr/wAMqqv///1VVf8ADaqqi/8ADqqrCAtrBv//+qqrdYL//+2AAP//81VVfP//81VVfP//7VVW///4gAD//+dVVYt3i3X/AAPVVXP/AAeqq3P/AAeqq3P/AAiAAHP/AAlVVf//5qqr/wAJVVX//+cqqv8ACFVW///nqqv/AAdVVf//56qr/wAHVVX//+mAAP8AA6qr///rVVWLCP//7Kqri///76qq///8gAD///Kqq4T///Kqq4T///TVVf//9oAAgn+Cf///+NVV///yVVX///qqq///8Kqr///6qqv///Cqq4d7///9VVX//+9VVQisBv8ABKqr/wAVVVX/AAlVVf8AEqqrmZuZm/8AEqqrk/8AF1VVi/8AE1VVi/8AFSqr///8VVWi///4qqui///4qqv/ABfVVf//96qq/wAYqqv///aqq/8AGKqr///2qqv/ABiqqv//94AA/wAYqqv///hVVf8AGKqr///4VVX/ABaqqv///Cqr/wAUqquLCP8AEqqri/8AECqq/wADgAD/AA2qq5L/AA2qq5L/AAuAAP8ACVVV/wAJVVX/AAuqq/8ACVVV/wALqqv/AAeAAP8ADYAA/wAFqqv/AA9VVf8ABaqr/wAPVVX/AAPVVf8AD6qrjZsICwAAAQAAAAwAAAAWAAAAAgABAAEBggABAAQAAAACAAAAAAABAAAACgAcAB4AAURGTFQACAAEAAAAAP//AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAA//8AAQAAAAFrZXJuAAgAAAABAAAAAQAEAAIAAAADAAwO+hkcAAEOhAAEAAAAMwBwAKoA5AEWAVABfgLAA/4FBAYOBpgGDgaqBg4HQAdOB1gHZgdmB2YHZgdmB2YHtAdYB1gHZgdmB2YI3gloCWgJaAmqCjQKcgo0CnIKNApyCxwLHAySDRwOQge0B1gHtAscDlAOVgAOADj/zgBY/+4Anv+2AL7/7gDA/+4BHv+8ASD/vAEw//sBMf/uATL/tgEz/+4BNP+2AT7/vAFR/6oADgAO/38AEP9/ACP/yQCB/8kAgv/JAIP/yQCE/8kAhf/JAIb/yQCH/8kAwf/JAMP/yQDF/8kBWf9/AAwAOP+kAJ7/kQC+/9sAwP/bAR7/pAEg/6QBMP/JATL/kQEz/9sBNP+RAT7/pAFR/5EADgAO/2cAEP9nACP/tgCB/7YAgv+2AIP/tgCE/7YAhf+2AIb/tgCH/7YAwf+2AMP/tgDF/7YBWf9nAAsAOAAGAJ7/8wC+ABgAwAAYAR4ABgEgAAYBMAAGATL/8wEzABgBNP/zAT4ABgBQAA7/kQAc/5EAHf+RAG7/fwCB/7wAgv+8AIP/vACE/7wAhf+8AIb/vACH/7wAof+RAKL/kQCj/5EApP+RAKX/kQCm/5EAp/+RAKj/kQCp/5EAqv+RAKv/kQCs/5EArQAYAK4AGACvABgAsAAYALP/kQC0/5EAtf+RALb/kQC3/5EAuf+RALr/pAC7/6QAvP+kAL3/pAC+/5EAwP+RAMH/vADC/5EAw/+8AMT/kQDF/7wAxv+RAMj/kQDK/5EAzP+RAM7/kQDU/5EA1v+RANj/kQDa/5EA3P+RAOoAGADsABgA7gAYAPAAGADyABgBCf+RAQv/kQEN/5EBD/+RARH/pAET/6QBFf+kARf/kQEZ/5EBG/+RAR3/kQEl/6QBJ/+kASn/pAEr/6QBLf+kAS//pAEx/5EBM/+RAT3/kQFZ/5EATwAO/38AD//JABD/fwAc/8oAHf/KACP/yQBD/8kAR//JAEsABgBR/8kAVP/bAFf/2wBb/+4Abv/JAIH/yQCC/8kAg//JAIT/yQCF/8kAhv/JAIf/yQCh/8kAov/JAKP/yQCk/8kApf/JAKb/yQCn/8kAqf/JAKr/yQCr/8kArP/JAK0ABgCuAAYArwAGALAABgCz/8kAtP/JALX/yQC2/8kAt//JALn/yQC6/9sAu//bALz/2wC9/9sAvv/uAMD/7gDB/8kAwv/JAMP/yQDE/8kAxf/JAMb/yQDU/8kA1v/JANj/yQDa/8kA3P/JAOoABgDsAAYA7gAGAPAABgDyAAYBCf/JAQv/yQEN/8kBD//JARH/2wET/9sBFf/bASX/2wEn/9sBKf/bASv/2wEt/9sBL//bATP/7gFZ/38AQQAO/7YAHP/uAB3/7gCB/+4Agv/uAIP/7gCE/+4Ahf/uAIb/7gCH/+4Aof/bAKL/2wCj/9sApP/bAKX/2wCm/9sAp//bAKn/7gCq/+4Aq//uAKz/7gCtABgArgAYAK8AGACwABgAs//uALT/7gC1/+4Atv/uALf/7gC5/+4Auv/uALv/7gC8/+4Avf/uAMH/7gDC/9sAw//uAMT/2wDF/+4Axv/bANT/7gDW/+4A2P/uANr/7gDc/+4A6gAYAOwAGADuABgA8AAYAPIAGAEJ/+4BC//uAQ3/7gEP/+4BEf/uARP/7gEV/+4BJf/uASf/7gEp/+4BK//uAS3/7gEv/+4BWf+2AEIADv+FABz/pAAd/6QAUv+2AFP/pABY/8kAbv+RAIH/tgCC/7YAg/+2AIT/tgCF/7YAhv+2AIf/tgCh/6QAov+kAKP/pACk/6QApf+kAKb/pACn/6QAqf+kAKr/pACr/6QArP+kAK3/+QCu//kAr//5ALD/+QCz/6QAtP+kALX/pAC2/6QAt/+kALn/pAC6/7YAu/+2ALz/tgC9/7YAwf+2AML/pADD/7YAxP+kAMX/tgDG/6QA1P+kANb/pADY/6QA2v+kANz/pADq//kA7P/5AO7/+QDw//kA8v/5AQn/pAEL/6QBDf+kAQ//pAEl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AFQADgBVAFUADwBXAFcAEABZAFkABABbAFsABQBuAG4ABgCBAIcACACeAJ4AAwChAKcACQCoAKgACgCpAKwACwCtALAADACzALcADQC5ALkADQC6AL0AEAC+AL4ABQDAAMAABQDBAMEACADCAMIACQDDAMMACADEAMQACQDFAMUACADGAMYACQDIAMgACgDKAMoACgDMAMwACgDOAM4ACgDUANQACwDWANYACwDYANgACwDaANoACwDcANwACwDqAOoADADsAOwADADuAO4ADADwAPAADADyAPIADAEJAQkADQELAQsADQENAQ0ADQEPAQ8ADQERAREADgETARMADgEVARUADgEXARcADwEZARkADwEbARsADwEdAR0ADwEeAR4AAQEgASAAAQElASUAEAEnAScAEAEpASkAEAErASsAEAEtAS0AEAEvAS8AEAEwATAAAgExATEABAEyATIAAwEzATMABQE0ATQAAwE9AT0ADwE+AT4AAQFZAVkABwABACIAIwAuADQANgA5ADsAVABZAIEAggCDAIQAhQCGAJ4AwQDDAMUA9wD5APsBEAERARIBEwEUARUBHgEgATABMQEyATQBPgAAAgAAAAAAAAABBAAAAXIAiQIIAKECCAANAggAIQMvACYCwAA7AQQAZAEEADoBBAAMAbwAJgKaAE4BBAAyAU0AKwEEAFIBcgAJAggAGgIIAF8CCAApAggAKQIIABcCCAApAggAHAIIACkCCAApAggAHAEEAFIBBAAyApoAUgKaAE4CmgBSAc8ALwMgACwCrQAFAnYAYQLAADMC5QBYAlEAYQIsAGEDCgAzAtIAYQEEAGEB4gAHAmMAYQH0AGEDeQBaAwoAYQNCADMCPgBhA0IAMwJRAGECLAA1Aj4ADAKsAFQCUf/9A7AABQJjAAECPv/6AiwAFwEEAEoBcgAFAQQAJAKaAFIB9AAAAPD/+gIHADsCYwBDAeEANgJjADYCLAA2ASgAEgJjADwCLABQAPAASwDw/+IB4QBQAPAAWgNUAEsCLABLAlIANgJjAEMCYwA2AU0ASwGqABwBTQAOAiwASwHPAA8CwAAPAeEABgHPAA8BqgAbAU0AQgDeAFcBTQA7ApoAZwEEAAABcgCJAggANAIIADoCCAALAggAAADeAFcCCABAAPD/6QMgABwBUQAiAeEAPwKaAE4BTQArAyAAHADw//QBkAA4ApoATgFSABcBUgAbAPAAPgIsAEsCWAA8AQQAUgDwACEBUgBDAYIAIgHhAEcDCgAkAwoAHAMKABQBzwAlAq0ABQKtAAUCrQAFAq0ABQKtAAUCrQAFA57/+wLAADMCUQBhAlEAYQJRAGECUQBhAQQABAEEAEgBBP/zAQT/8wLlAAoDCgBhA0IAMwNCADMDQgAzA0IAMwNCADMCmgBkA0IAMwKsAFQCrABUAqwAVAKsAFQCPv/6Aj4AYQJRAFACBwA7AgcAOwIHADsCBwA7AgcAOwIHADsDVAA2AeEANgIsADYCLAA2AiwANgIsADYA8P/6APAAPgDw/+kA8P/pAlIANgIsAEsCUgA2AlIANgJSADYCUgA2AlIANgKaAE4CUgAnAiwASwIsAEsCLABLAiwASwHPAA8CYwBDAc8ADwKtAAUCBwA7Aq0ABQIHADsCrQAFAgcAOwLAADMB4QA2AsAAMwHhADYCwAAzAeEANgLAADMB4QA2AuUAWAJjADYC5QAKAmMANgJRAGECLAA2AlEAYQIsADYCUQBhAiwANgJRAGECLAA2AlEAYQIsADYDCgAzAmMAPAMKADMCYwA8AwoAMwJjADwDCgAzAmMAPALSAGECLABQAtIAYQIsAAgBBP/nAPD/3gEE//0A8P/1AQQAEQDwAAcBBABWAPAAWgLEAGEBxwBLAeIABwDw/+ICYwBhAeEAUAH0AEgA8ABGAfQAYQDwAD8B9ABhAPAAWgH0AGEBUABaAfQAGQDwAAYDCgBhAiwASwMKAGECLABLAwoAYQIsAEsCLAAOA0IAMwJSADYDQgAzAlIANgNCADMCUgA2A7AAOwOLACwCUQBhAU0ASwJRAGEBTQBLAlEAYQFNACsCLAA1AaoAHAIsADUBqgAcAiwANQGqABwCLAA1AaoAHAI+AAwBTQAOAj4ADAFNAA4CPgAMAU0ADgKsAFQCLABLAqwAVAIsAEsCrABUAiwASwKsAFQCLABLAqwAVAIsAEsCrABUAiwASwOwAAUCwAAPAj7/+gHPAA8CPv/6AiwAFwGqABsCLAAXAaoAGwIsABcBqgAbAgj/8AIsADUBqgAcAj4ADAFNAA4A8P/iAPD/6QDw/+YA8P/0APD/6ADwAEsA8AAbAPAACgDw/9wA8P/1Ap4ADwLoAC8CLABLAjMAJgH0AAAD6AAAAQQAPgEEAD4BBAA+AggAaQIIAGkCCABpAggAJgIIACYB9ABJA+gAdwPVABoBOwA/ATsARwCo/1kB1gAZAfQAUAPeAFQC6AAvAfQALAHwAB8CngAPAscARwJcABkCmgBOAKj/WQEEAFIB7f/4AuUAKQIfAGUCmgBOApoAWAKaAFgCmgBYAlEAXwDw//oA8AA+APD/6QDw/+YA8P/cAPD/6QDw//QA8P/oAPAAGwDw//UA8ABLAPAAKQDwACoA8ABGAgAAAAIHABIAEgAAAAAAAQAAAADQcD/WAAAAAMJXW6UAAAAAzEYHPw==\n".trim(),
    AvenirLightOblique: "data:application/font-woff;charset=utf-8;base64,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ZQBhAHIAcwAgAG8AZgAgAGgAYQB2AGkAbgBnACAAYQBuACAAaQBuAHQAZQByAGUAcwB0ACAAaQBuACAAcwBhAG4AcwAgAHMAZQByAGkAZgAgAHQAeQBwAGUAZgBhAGMAZQBzAC4AIABJAG4AIABhAG4AIABpAG4AdABlAHIAdgBpAGUAdwAgAHcAaQB0AGgAIABMAGkAbgBvAHQAeQBwAGUALAAgAGgAZQAgAHMAYQBpAGQAIABoAGUAIABmAGUAbAB0ACAAYQBuACAAbwBiAGwAaQBnAGEAdABpAG8AbgAgAHQAbwAgAGQAZQBzAGkAZwBuACAAYQAgAGwAaQBuAGUAYQByACAAcwBhAG4AcwAgAGkAbgAgAHQAaABlACAAdAByAGEAZABpAHQAaQBvAG4AIABvAGYAIABFAHIAYgBhAHIAIABhAG4AZAAgAEYAdQB0AHUAcgBhACwAIABiAHUAdAAgAHQAbwAgAGEAbABzAG8AIABtAGEAawBlACAAdQBzAGUAIABvAGYAIAB0AGgAZQAgAGUAeABwAGUAcgBpAGUAbgBjAGUAIABhAG4AZAAgAHMAdAB5AGwAaQBzAHQAaQBjACAAZABlAHYAZQBsAG8AcABtAGUAbgB0AHMAIABvAGYAIAB0AGgAZQAgAHQAdwBlAG4AdABpAGUAdABoACAAYwBlAG4AdAB1AHIAeQAuACAAVABoAGUAIAB3AG8AcgBkACAAQQB2AGUAbgBpAHIAIABtAGUAYQBuAHMAIAAnAGYAdQB0AHUAcgBlACcAIABpAG4AIABGAHIAZQBuAGMAaAAgAGEAbgBkACAAaABpAG4AdABzACAAdABoAGEAdAAgAHQAaABlACAAdAB5AHAAZQBmAGEAYwBlACAAbwB3AGUAcwAgAHMAbwBtAGUAIABvAGYAIABpAHQAcwAgAGkAbgB0AGUAcgBwAHIAZQB0AGEAdABpAG8AbgAgAHQAbwAgAEYAdQB0AHUAcgBhAC4AIABCAHUAdAAgAHUAbgBsAGkAawBlACAARgB1AHQAdQByAGEALAAgAEEAdgBlAG4AaQByACAAaQBzACAAbgBvAHQAIABwAHUAcgBlAGwAeQAgAGcAZQBvAG0AZQB0AHIAaQBjADsAIABpAHQAIABoAGEAcwAgAHYAZQByAHQAaQBjAGEAbAAgAHMAdAByAG8AawBlAHMAIAB0AGgAYQB0ACAAYQByAGUAIAB0AGgAaQBjAGsAZQByACAAdABoAGEAbgAgAHQAaABlACAAaABvAHIAaQB6AG8AbgB0AGEAbABzACwAIABhAG4AIAAiAG8AIgAgAHQAaABhAHQAIABpAHMAIABuAG8AdAAgAGEAIABwAGUAcgBmAGUAYwB0ACAAYwBpAHIAYwBsAGUALAAgAGEAbgBkACAAcwBoAG8AcgB0AGUAbgBlAGQAIABhAHMAYwBlAG4AZABlAHIAcwAuACAAVABoAGUAcwBlACAAbgB1AGEAbgBjAGUAcwAgAGEAaQBkACAAaQBuACAAbABlAGcAaQBiAGkAbABpAHQAeQAgAGEAbgBkACAAZwBpAHYAZQAgAEEAdgBlAG4AaQByACAAYQAgAGgAYQByAG0AbwBuAGkAbwB1AHMAIABhAG4AZAAgAHMAZQBuAHMAaQBiAGwAZQAgAGEAcABwAGUAYQByAGEAbgBjAGUAIABmAG8AcgAgAGIAbwB0AGgAIAB0AGUAeAB0AHMAIABhAG4AZAAgAGgAZQBhAGQAbABpAG4AZQBzAC4AIABJAG4AIAAyADAAMAA0ACAAQQBkAHIAaQBhAG4AIABGAHIAdQB0AGkAZwBlAHIAIABhAG4AZAAgAHQAaABlACAAdAB5AHAAZQAgAGQAaQByAGUAYwB0AG8AcgAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgAIAAgAEEAawBpAHIAYQAgAEsAbwBiAGEAeQBhAHMAaABpACAAcgBlAHcAbwByAGsAZQBkACAAdABoAGUAIABBAHYAZQBuAGkAcgAgAGEAbgBkACAAYwByAGUAYQB0AGUAZAAgAHQAaABlACAAQQB2AGUAbgBpAHIAIABOAGUAeAB0ACAAZgBvAHIAIAB0AGgAZQAgAFAAbABhAHQAaQBuAHUAbQAgAEMAbwBsAGwAZQBjAHQAaQBvAG4ALgAgAABBZHJpYW4gRnJ1dGlnZXIgZGVzaWduZWQgQXZlbmlyIGluIDE5ODgsIGFmdGVyIHllYXJzIG9mIGhhdmluZyBhbiBpbnRlcmVzdCBpbiBzYW5zIHNlcmlmIHR5cGVmYWNlcy4gSW4gYW4gaW50ZXJ2aWV3IHdpdGggTGlub3R5cGUsIGhlIHNhaWQgaGUgZmVsdCBhbiBvYmxpZ2F0aW9uIHRvIGRlc2lnbiBhIGxpbmVhciBzYW5zIGluIHRoZSB0cmFkaXRpb24gb2YgRXJiYXIgYW5kIEZ1dHVyYSwgYnV0IHRvIGFsc28gbWFrZSB1c2Ugb2YgdGhlIGV4cGVyaWVuY2UgYW5kIHN0eWxpc3RpYyBkZXZlbG9wbWVudHMgb2YgdGhlIHR3ZW50aWV0aCBjZW50dXJ5LiBUaGUgd29yZCBBdmVuaXIgbWVhbnMgJ2Z1dHVyZScgaW4gRnJlbmNoIGFuZCBoaW50cyB0aGF0IHRoZSB0eXBlZmFjZSBvd2VzIHNvbWUgb2YgaXRzIGludGVycHJldGF0aW9uIHRvIEZ1dHVyYS4gQnV0IHVubGlrZSBGdXR1cmEsIEF2ZW5pciBpcyBub3QgcHVyZWx5IGdlb21ldHJpYzsgaXQgaGFzIHZlcnRpY2FsIHN0cm9rZXMgdGhhdCBhcmUgdGhpY2tlciB0aGFuIHRoZSBob3Jpem9udGFscywgYW4gIm8iIHRoYXQgaXMgbm90IGEgcGVyZmVjdCBjaXJjbGUsIGFuZCBzaG9ydGVuZWQgYXNjZW5kZXJzLiBUaGVzZSBudWFuY2VzIGFpZCBpbiBsZWdpYmlsaXR5IGFuZCBnaXZlIEF2ZW5pciBhIGhhcm1vbmlvdXMgYW5kIHNlbnNpYmxlIGFwcGVhcmFuY2UgZm9yIGJvdGggdGV4dHMgYW5kIGhlYWRsaW5lcy4gSW4gMjAwNCBBZHJpYW4gRnJ1dGlnZXIgYW5kIHRoZSB0eXBlIGRpcmVjdG9yIG9mIExpbm90eXBlIEdtYkggIEFraXJhIEtvYmF5YXNoaSByZXdvcmtlZCB0aGUgQXZlbmlyIGFuZCBjcmVhdGVkIHRoZSBBdmVuaXIgTmV4dCBmb3IgdGhlIFBsYXRpbnVtIENvbGxlY3Rpb24uIAAAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAABodHRwOi8vd3d3Lmxpbm90eXBlLmNvbQAAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAC8AZgBvAG4AdABkAGUAcwBpAGcAbgBlAHIAcwAAaHR0cDovL3d3dy5saW5vdHlwZS5j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ZW50Z2RvdGFjY2VudEdjb21tYWFjY2VudGdjb21tYWFjY2VudEhjaXJjdW1mbGV4aGNpcmN1bWZsZXhIYmFyaGJhckl0aWxkZWl0aWxkZUltYWNyb25pbWFjcm9uSW9nb25la2lvZ29uZWtJZG90YWNjZW50SUppakpjaXJjdW1mbGV4amNpcmN1bWZsZXhLY29tbWFhY2NlbnRrY29tbWFhY2NlbnRMYWN1dGVsYWN1dGVMY29tbWFhY2NlbnRsY29tbWFhY2NlbnRMY2Fyb25sY2Fyb25MZG90bGRvdE5hY3V0ZW5hY3V0ZU5jb21tYWFjY2VudG5jb21tYWFjY2VudE5jYXJvbm5jYXJvbm5hcG9zdHJvcGhlT21hY3Jvbm9tYWNyb25PYnJldmVvYnJldmVPaHVuZ2FydW1sYXV0b2h1bmdhcnVtbGF1dFJhY3V0ZXJhY3V0ZVJjb21tYWFjY2VudHJjb21tYWFjY2VudFJjYXJvbnJjYXJvblNhY3V0ZXNhY3V0ZVNjaXJjdW1mbGV4c2NpcmN1bWZsZXhTY2VkaWxsYXNjZWRpbGxhVGNvbW1hYWNjZW50dGNvbW1hYWNjZW50VGNhcm9udGNhcm9uVGJhcnRiYXJVdGlsZGV1dGlsZGVVbWFjcm9udW1hY3JvblVicmV2ZXVicmV2ZVVyaW5ndXJpbmdVaHVuZ2FydW1sYXV0dWh1bmdhcnVtbGF1dFVvZ29uZWt1b2dvbmVrV2NpcmN1bWZsZXh3Y2lyY3VtZmxleFljaXJjdW1mbGV4eWNpcmN1bWZsZXhaYWN1dGV6YWN1dGVaZG90YWNjZW50emRvdGFjY2VudFNjb21tYWFjY2VudHNjb21tYWFjY2VudHVuaTAyMUF1bmkwMjFCZG90bGVzc2p1bmkwMkM5dW5pMDM5NHVuaTAzQTl1bmkwM0JDcGlFdXJvYWZpaTYxMjg5T21lZ2Flc3RpbWF0ZWRwYXJ0aWFsZGlmZkRlbHRhcHJvZHVjdHN1bW1hdGlvbnVuaTIyMTV1bmkyMjE5cmFkaWNhbGluZmluaXR5aW50ZWdyYWxhcHByb3hlcXVhbG5vdGVxdWFsbGVzc2VxdWFsZ3JlYXRlcmVxdWFsbG96ZW5nZWdyYXZlLmNhcGFjdXRlLmNhcGNpcmN1bWZsZXguY2FwY2Fyb24uY2FwdGlsZGUuY2FwZGllcmVzaXMuY2FwbWFjcm9uLmNhcGJyZXZlLmNhcHJpbmcuY2FwaHVuZ2FydW1sYXV0LmNhcGRvdGFjY2VudC5jYXBjYXJvbi5hbHRjb21tYWFjY2VudGNvbW1hYWNjZW50LmFsdHVuaUY4RkY4LjBkNWUzQ29weXJpZ2h0KGMpIDIwMDcgTGlub3R5cGUgR21iSCwgd3d3Lmxpbm90eXBlLmNvbS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5BdmVuaXIgTGlnaHQgT2JsaXF1ZUF2ZW5pciBMaWdodAAAAAGHAAEAAgADAAQABQAGAAcAaAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAfABCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwGIAGAAYQBiAGcAZACgAGYAgwCqAIsAagCXAYkApQCAAKEAnACkAKkAfQCYAHMAcgCFAJYAjwB4AJ4AmwCjAHsArgCrAKwAsACtAK8AigCxALUAsgCzALQAuQC2ALcAuACaALoAvgC7ALwAvwC9AKgAjQDEAMEAwgDDAMUAnQCVAMsAyADJAM0AygDMAJAAzgDSAM8A0ADRANYA0wDUANUApwDXANsA2ADZANwA2gCfAJMA4QDeAN8A4ADiAKIA4wGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgAkQG5AboBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYAjACSAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMAjgCUAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAMAA3QHgAeEB4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1AMYB9gH3AfgB+QDHAOQAZQH6AfsB/AH9Af4AfgCIAf8AgQCCAIQAhwB/AIYCAAIBAgICAwBvAIkAQQAIAHUAaQB3AHYAcABxAHQAeQB6AGsAbABjAgQCBQCZAgYCBwIIAgkCCgILAKYCDAINAg4CDwIQAhECEgITAhQCFQIWAhcCGAIZAhoCGwIcAh0CHgIfAiACIQIiAiMCJABtAG4BgwIAAQAnACoALQBEAFEAsgT0CnQPRQ9PELwSGBJHEmwSdRKEEowSnxbbFvYY1RwHHDoeliFdIXUnIio1KkUqVCpuKoQqnCzZMyozODYzNj02TjZXNnc2gDaKNpQ2nTamNq824DbqNvc30zq0OsQ6zTrWOt86+jsDOy87ODs/O1w7bjuKO6Y7szu7O8o9fj2GPZQ9oj2sPbo9wz3RPd495z3vQPVA/kEKQr5EdER+RIdEkUSaRLVEvkTpRPNE+0fMR91KsUxiTGVMfE65T+9SrFL2UxJY/lkKW/ZepF6yXsde02BHYE9i52MZZIFnt2e/Z8hoemiEailqM2zTbONtAW6scfN0E3QodD10UnRmdH90mXTceJ54rXi9eM144njxeQF5EXkneTd5RnlaeW55gnmWea9523ycfKx8vHzMfOF88X3TgSaBO4FQgWWBe4GWgbCFzol+iZKJpom7idWJ4onwif6KEoyqjLmMzIzfjPKNBI0bjimQr5C+kM2Q3ZDykQOSuZLOkuOS+ZMOkyOUipf1mAaYFJglmDSYRZhUmGWYc5iLmKCYsJtzm4GblZulm7qbypvfnUmgl6CmoLqgyqDfoO+hBKEUoSmhOaFUoWWhdKGqo2WjdaOEo5Sjo6T8pl2mbaZ1poamo6aypr+mzqbdpuym+qcJpxinJqc0p0OnU6d/p6CnsafBp9Gn4afxqAGoEKgkqDeoS6heqHaojapErrauzK7drvSvBK8ZryqvOq9Kr1qvarSWuYC5kLmgubC5wLnPueC6ELs/u0+7X7tuu327jbudu7K7x7vbu+++l8IWwibCNsJGwlfCbMJ5wofClcKjwrDCvsRDxFPEYsRyxILEicSRxJnEocSpxLHEvsYfxibGMsZDxkvGVMeEx5LHocezx73HxsfUx+LH78gUyE/JucnMzHrMg8yNzKDPLNFw0bbRvtOQ163XvtfT1/rYA9gW2CDYQN1d4IDgj+DL4PLhGuFE4UzhVOFc4WTha+F34X/hh+GU4aDhqOGw4bbhxeHr4gHiEUn3cvcJFcPOUwaOvRUgCveD+10V/DD4/fgwBr2+FfyU/WL4lAYO/NYO+9IO+2T3hfdOFdT4nk+LQvyeBWT7JBUhCg5R95j5WBUiCtkWIgoOUfct93kVTft5v4vJ93n3H4tN+3m/i8n3efcHi5G7+wCLtvcw9weLkrv7AIvK93cFV4tM+3f7H4vK93dXi037d/sHi4Rb9wCLX/sw+weLhVsF9/f3YBVg+zD7Hou29zAFDlH3srUVsveks3sF/wARVVX///lVVf8ADdVW///4VVb/AApVVf//91VV/wAKVVX///dVVf8AB9VW///2qqv/AAVVVYH/AAVVVYH/AAMqq///9aqrjP//9VVVjP//9VVV////1VX///Wqq////qqrgf///Kqrd///+dVV///tgACCeoJ6///0qqv///Eqq///8lVV///zVVUI///yVVX///NVVf//8IAA///11Vb//+6qq///+FVV///uqqv///hVVXn///vVVv//7VVV////VVUIs/kEFWb7nnuRBf//8VVV/wAFVVX///LVVv8ABiqr///0VVWS///0VVWS///2VVb/AAiAAP//+FVVlf//+FVVlf//+oAA/wALgAD///yqq5j///yqq5j///+qqv8ADyqr/wACqqv/ABFVVf8AAqqr/wASqqv/AAXVVf8AESqqlP8AD6qrlP8AD6qr/wAK1VX/AA2qqv8ADKqr/wALqqsI/wAMqqv/AAuqq5n/AAmAAP8AD1VV/wAHVVX/AA9VVf8AB1VV/wAPqquQm/8AAqqrCCz9OhWBSLuLlc4Fpf8AAVVV/wAZgAD/AAWAAKT/AAmqq6T/AAmqq/8AFtVV/wANKqr/ABSqq/8AEKqr/wAUqqv/ABCqq/8AEYAA/wAT1VX/AA5VVaL/AA5VVaL/AAkqq/8AGdVVj/8AHKqrj/8AGqqr////gAD/ABdVVYafhp////hVVf8AESqr///1qqv/AA5VVQj///Wqq/8ADlVV///z1VX/AAvVVn3/AAlVVX3/AAlVVX3/AAdVVn3/AAVVVQhIo7P3rgWji/8AFtVV///5gAD/ABWqq37/ABWqq37/ABEqqv//7YAA/wAMqqtzCMezBf//9VVVnf//9Cqr/wAO1VV+/wALqqt+/wALqqv///Iqq/8ACSqq///xVVX/AAaqq///8VVV/wAGqqv///Cqq/8ABIAAe/8AAlVVe/8AAlVV///vqqv/AAEqq///71VViwiUzluLgkgF///pVVWJ///o1VaF///oVVWB///oVVWB///qKqv///Kqq3f//+9VVXf//+9VVf//7tVV///sKqv///Gqq3T///Gqq3T///bVVf//5oAAh2////6qq///9Kqr////gAD///Kqqv8AAFVV///wqqv/AABVVf//8Kqr/wADKqv///BVVZF7CJF7/wAJqqv///Cqq/8ADVVV///xVVX/AA1VVf//8VVV/wASVVb///RVVv8AF1VV///3VVUIznFi+7YFb/8AAVVV///mVVX/AAiAAP//6Kqr/wAPqqv//+iqq/8AD6qr///uVVX/ABWAAH//ABtVVQhNZAX/AAlVVf//7qqr/wALgAD///DVVf8ADaqrfv8ADaqrfpqA/wAQVVWC/wAQVVWC/wARKqv///lVVZ3///uqq53///uqq53///3VVZ2LCA73gfli+XoVIwr9Gfs6Ff///Kqrc/8AAVVV///pqquR///rVVWR///rVVX/AAmqq///7dVW/wANVVX///BVVf8ADVVV///wVVX/ABBVVv//86qr/wATVVWC/wATVVWC/wAVqqv///uAAKOLo4ui/wAEgAChlKGUn/8ADFVVnf8AD6qrCJ3/AA+qq5r/ABIqqpf/ABSqq5f/ABSqq/8AB6qr/wAWVVX/AANVVaP/AANVVaP///6qq/8AFlVVhf8AFKqrhf8AFKqr///2Kqv/ABIqqv//8lVV/wAPqqv///JVVf8AD6qr///vgAD/AAxVVf//7KqrlP//7KqrlP//6lVV/wAEgABziwhzi3T///uAAHWCdYL//+wqq///86qr///uVVX///BVVf//7lVV///wVVX///Eqq///7dVWf///61VVf///61VV///4VVX//+mqq////KqrcwjBFo3/ABCqq/8ABSqr/wAPgAD/AAhVVf8ADlVV/wAIVVX/AA5VVf8ACiqr/wAMgACX/wAKqquX/wAKqqv/AA2qq/8ACFVV/wAPVVWR/wAPVVWR/wAPqquOm4ubi/8ADtVViP8ADaqrhf8ADaqrhf8AC4AA///3qqv/AAlVVf//9VVVCP8ACVVV///1VVX/AAaqq///84AAj///8aqrj///8aqrjP//8IAAif//71VV///9VVX//+9VVf//+oAA///wgAD///eqq///8aqr///3qqv///Gqq///9dVV///zgAB////1VVV////1VVX///JVVf//96qr///wqquF///wqquF///wVVWIe4sIe4v///Eqq47///JVVZH///JVVZH///Sqq/8ACFVVgv8ACqqrgv8ACqqr///5VVX/AAyAAP//+6qr/wAOVVX///uqq/8ADlVV////Kqr/AA+AAP8AAqqr/wAQqqsI97L8GBX///yqq3P/AAFVVf//6aqrkf//61VVkf//61VV/wAJ1VX//+3VVv8ADaqr///wVVX/AA2qq///8FVV/wAQgAD///Oqq/8AE1VVgv8AE1VVgv8AFaqr///7gACji6OLov8ABIAAoZShlP8AE9VV/wAMVVX/ABGqq/8AD6qrCP8AEaqr/wAPqqv/AA7VVf8AEiqql/8AFKqrl/8AFKqr/wAHqqv/ABZVVf8AA1VVo/8AA1VVo////qqr/wAWVVWF/wAUqquF/wAUqqv///Yqq/8AEiqq///yVVX/AA+qq///8lVV/wAPqqv//++AAP8ADFVV///sqquU///sqquU///qVVX/AASAAHOLCHOLdP//+4AAdYJ1gv//7Cqr///zqqv//+5VVf//8FVV///uVVX///BVVf//8Sqr///t1VZ////rVVV////rVVX///hVVf//6aqr///8qqtzCMEWjf8AEKqr/wAFKqv/AA+AAP8ACFVV/wAOVVX/AAhVVf8ADlVV/wAKVVb/AAyAAP8ADFVV/wAKqqv/AAxVVf8ACqqr/wAN1Vb/AAhVVf8AD1VVkf8AD1VVkf8AD6qrjpuLm4v/AA7VVYj/AA2qq4X/AA2qq4X/AAtVVf//96qrlP//9VVVCJT///VVVf8ABoAA///zgACP///xqquP///xqquM///wgACJ///vVVWJ///vVVX///rVVf//8IAA///3qqv///Gqq///96qr///xqqv///Wqqv//84AA///zqqv///VVVf//86qr///1VVX///Iqqv//96qr///wqquF///wqquF///wVVWIe4sIe4v///Eqq47///JVVZH///JVVZH///Sqq/8ACFVVgv8ACqqrgv8ACqqr///5gAD/AAyAAIf/AA5VVYf/AA5VVYr/AA+AAI3/ABCqqwgO9xL4l/diFfsm90oF/wAVVVX/AAqqq/8AFNVWlv8AFFVV/wALVVX/ABRVVf8AC1VV/wASqquYnP8ADqqrnP8ADqqr/wAOVVX/ABCqqv8AC6qr/wASqqv/AAuqq/8AEqqr/wAHgACh/wADVVX/ABlVVf8AA1VV/wAWqqv///6qq/8AFIAAhf8AElVVhf8AElVV///2gAD/AA+qq36YCH6Y///wVVX/AAoqq///7aqr/wAHVVX//+2qq/8AB1VV///sgAD/AAOqq///61VVi///6Kqri3T///xVVf//6VVV///4qqv//+lVVf//+Kqr///rgAD///WAAP//7aqr///yVVX//+2qq///8lVV///wgAD//+8qq///81VVd///81VVd4P//+lVVf///Kqr///mqqsIiXv/AACAAP//8IAAjnyOfP8ABKqr///xgAD/AAZVVX3/AAZVVX3/AAdVVv//8oAA/wAIVVV+/wAIVVV+/wAIKqv///OAAJN/df//81VV///qVVX///Mqq///6qqrfv//6qqrfv//7Kqq///xgAD//+6qq3sI///uqqt7///xVVX//+2qq3///+tVVX///+tVVYNzh///5Kqr///7VVX//+Cqq/8AAYAA///jqqr/AAeqq///5qqr/wAHqqv//+aqq/8ADFVV///qVVWceZx5oP//8iqrpP//9lVVpP//9lVV/wAbgAD///sqq6mLCP8AMVVVi/8AK4AA/wALgAD/ACWqq6L/ACWqq6L/ACPVVf8AHtVVrf8AJqqrCOX7BuSL+x33Pfcz93ZHiwX7hveoFf8AHKqri/8AFoAA///3Kqv/ABBVVf//7lVV/wAQVVX//+5VVf8ABiqr///pKquHb////VVV///tVVX///mAAP//74AA///1qqv///Gqq///9aqr///xqqv///Oqqv//8yqq///xqqv///Sqq///8aqr///0qqv///CAAIH//+9VVf//91VV///vVVX///dVVf//8FVWg///8VVV///4qqsIhf8ACKqr///5Kqv/AAmqqv//+FVV/wAKqqv///hVVf8ACqqr///5Kqv/AAtVVYWXhZf///tVVf8ADFVV///8qqv/AAyqq////Kqr/wAMqqv///9VVf8ADFVVjZeN/wAOqqv/AASqq/8ADYAA/wAHVVX/AAxVVf8AB1VV/wAMVVX/AAkqq/8ACoAAlv8ACKqrCJb/AAiqq/8ADFVV/wAG1VX/AA2qq5D/AA2qq5D/AA4qqv8AAoAA/wAOqquLCC77yxX3PPtgBX////FVVf//8yqr///yKqv///JVVX7///JVVX7///FVVv//9IAA///wVVWB///wVVWB///vgACD///uqquF///uqquFeYj//+1VVYt1i///66qr/wADgAD//+1VVZL//+1VVZL///CAAJX///Oqq5gI///zqquY///21VX/AA+AAIWdhZ3///6qq/8AFFVV/wADVVX/ABaqq/8AAqqr/wAUqqv/AAaqqv8AEoAA/wAKqqv/ABBVVf8ACqqr/wAQVVX/AAyAAP8ADqqr/wAOVVWY/wAOVVWY/wAP1Vb/AAvVVf8AEVVV/wAKqqv/ABFVVf8ACqqr/wARVVaV/wARVVX/AAlVVQgO+9L3W/lYFSIKDvvS9+75UBVcqwX//8tVVU3//9Qqq///ulVVaP//sqqraP//sqqr///o1VX//7Gqqv//9Kqr//+wqqv///qqq2X///2qqv//2aqr/wAAqqv//9lVVf8AAKqr///ZVVX/AAPVVf//2aqrkmWSZf8ACdVV///a1VX/AAyqq///26qr/wAMqqv//9uqq/8AD6qq///d1VX/ABKqq2sIvqkFe/8AIKqr///yKqv/ACCAAP//9FVV/wAgVVX///RVVf8AIFVVgv8AISqr///5qqut///5qqut///8gAD/ACLVVf///1VV/wAjqqv///9VVf8AI6qr/wACVVb/ACWAAP8ABVVV/wAnVVX/AASqq/8AIqqr/wAHqqr/ACOqqv8ACqqr/wAkqqv/AAqqq/8AJKqr/wANKqr/ACRVVf8AD6qrrwj/AA+qq6//ABJVVf8AItVVoP8AIaqroP8AIaqr/wAXgAD/AB6AAKX/ABtVVQgO+9KG+xAVuWsF/wA0qqvJ/wAr1VX/AEWqq67/AE1VVa7/AE1VVf8AFyqr/wBOVVb/AAtVVf8AT1VV/wAFVVWx/wACVVb/ACZVVf///1VV/wAmqqv///9VVf8AJqqr///8Kqv/ACZVVYSxhLH///Yqq/8AJSqr///zVVX/ACRVVf//81VV/wAkVVX///BVVv8AIiqr///tVVWrCFhtBZv//99VVf8ADdVV///fgAD/AAuqq///36qr/wALqqv//9+qq5T//97VVf8ABlVVaf8ABlVVaf8AA4AAaP8AAKqrZ/8AAKqrZ////aqq///aqqv///qqq///2VVV///7VVX//91VVf//+FVW///cKqv///VVVWb///VVVWb///LVVv//24AA///wVVVnCP//8FVVZ///7aqr///dVVV2///eqqt2///eqqv//+jVVf//4aqq///mqqv//+SqqwgO+xr32fjAFaD3LFuLdvss+yG7d173H1n7APsOr2719xHY+xG0qEH3DvcruoK7BQ7j9w/32xWFW/d7i2r7e7uLrPd793uLkbv7e4us93tbi2r7ewUO+9L3FOUVJAoO+4nb95wVg1X3i4uTwQUO+9LitRUhCg77ZPg1+XwV/C/9jr15+C/5jgUOUdb39hX///yqq3H///2AAHD///5VVW////5VVW//AACAAP//5IAA/wACqqtw/wACqqtwkP//5lVV/wAHVVX//+eqq/8AB1VV///nqqv/AAsqq///6oAAmv//7VVVmv//7VVV/wAS1VX///Eqq/8AFqqrgP8AFqqrgKf///qAAP8AIVVViwj/ACFVVYv/AB2qq/8ABYAApZallqL/AA7VVZ//ABKqq5//ABKqq/8AESqr/wAVgAD/AA5VVf8AGFVV/wAOVVX/ABhVVf8ADCqr/wAZqquVppWm/wAIKqv/ABuAAP8ABlVVp/8ABlVVp/8ABNVWpv8AA1VVpQj/AANVVf8AGVVV/wACgAD/ABrVVv8AAaqr/wAcVVX/AAGqq/8AHFVV////qqr/ABuqq////aqrpv///aqrpv//+yqq/wAZqqv///iqq/8AGFVV///4qqv/ABhVVf//9NVV/wAVgAB8/wASqqt8/wASqqv//+0qq/8ADtVV///pVVWW///pVVWWb/8ABYAA///eqquLCP//3qqri///4lVV///6gABxgHGAdP//8Sqrd///7VVVd///7VVV///u1VX//+qAAP//8aqr///nqqv///Gqq///56qr///z1VX//+ZVVYFwgXD///fVVf//5FVV///5qqv//+Oqq///+aqr///jqqv///rVVf//5Sqqh///5qqrCM0W/wACqqud/wADqqr/ABRVVf8ABKqr/wAWqqv/AASqq/8AFqqrkf8AFtVV/wAHVVWi/wAHVVWilP8AFoAA/wAKqquh/wAKqquh/wAMqqr/ABOAAP8ADqqrnP8ADqqrnP8AESqq/wANqqv/ABOqq/8AClVV/wATqqv/AApVVf8AFiqq/wAFKqv/ABiqq4sI/wAYqquL/wAUqqr///rVVf8AEKqr///1qqv/ABCqq///9aqr/wANVVX///JVVZV6lXr/AAdVVf//7IAA/wAEqqt1/wAEqqt1/wAC1VX//+mAAIx0jHT///+AAP//6Sqrif//6VVVif//6VVV///9qqv//+uqq////VVVeQj///1VVf//7VVV///8gAD//+uAAP//+6qr///pqqv///uqq///6aqr///6Kqr//+lVVf//+KqrdP//+KqrdIL//+mAAP//9VVVdf//9VVVdf//8yqr///sgAB8enx6///uqqv///JVVf//7FVV///1qqv//+xVVf//9aqr///p1Vb///rVVf//51VViwj//+aqq4v//+sqqv8ABSqr///vqqv/AApVVf//76qr/wAKVVX///LVVf8ADaqrgZyBnP//+Kqr/wATgAD///tVVaH///tVVaH///1VVv8AFoAA////VVWi////VVWi/wAAgAD/ABaqq/8AAaqr/wAWVVX/AAGqq/8AFlVV/wACKqr/ABSAAP8AAqqr/wASqqsIDlH38PkEFTT9BMeL7vlYWIv7V/sjqV33I/QFDlG90RWCRfhKi5LB/AiL95H3dwX/ABSqq/8AEqqr/wAUgAD/ABKqqv8AFFVV/wASqqv/ABRVVf8AEqqr/wASVVb/ABPVVf8AEFVVoP8AEFVVoJn/ABYqq/8AC6qr/wAXVVX/AAuqq/8AF1VV/wAH1VX/ABlVVo//ABtVVY//AByqq////iqr/wAZgAD///hVVf8AFlVV///4VVX/ABZVVf//89VW/wAS1Vb//+9VVf8AD1VVCP//71VV/wAPVVV3/wAL1Vb//+iqq/8ACFVV///oqqv/AAhVVf//5qqq/wAEKqv//+Sqq4v//8lVVYv//8+AAP//8oAA///Vqqtw///Vqqtw///hKqr//9cqq///7Kqr///JVVUI0IQFl/8AIqqr/wAUKqun/wAcVVX/ABVVVf8AHFVV/wAVVVX/ACCAAP8ACqqr/wAkqquL/wAoqquLq///9FVV/wAXVVX//+iqq/8AF1VV///oqquU///fqqr///qqq///1qqr///9VVX//+yqq///+lVWef//91VV///vVVX///dVVf//71VV///11Vb///Aqq///9FVVfAj///RVVXz///Mqq///8aqrff//8lVVff//8lVV///yVVX///Mqq///8qqrfwgOUfcS9ygVR3YFl1ui///c1VWt///pqqut///pqqv/ACuqq///9NVV/wA1VVWL/wAkqquL/wAgqqr/AAVVVf8AHKqr/wAKqqv/AByqq/8ACqqr/wAY1VX/AA6AAKD/ABJVVaD/ABJVVf8AEKqr/wAVgAD/AAxVVf8AGKqr/wAMVVX/ABiqq/8ACCqr/wAaVVWPpwj/AANVVf8AFqqr////gAD/ABVVVf//+6qrn///+6qrn///+FVVnYCbgJt9/wANgAB6lnqW///sgAD/AAeAAHWPCI0H/wAqqqv/AAtVVf8AIiqq/wAUgAD/ABmqq/8AHaqr/wAZqqv/AB2qq/8AD4AA/wAiKqr/AAVVVf8AJqqrj/8AHqqr///+gAD/ABqqqoT/ABaqq4T/ABaqq///9Kqr/wAS1VX///BVVZr///BVVZr//+yqq/8AC1VVdP8AB6qrdP8AB6qr///nKqv/AAPVVf//5VVViwj//9dVVYv//9mqq///96qrZ///71VVZ///71VV///hqqv//+VVVv//51VV///bVVUIv2sF/wARVVX/ABlVVf8AFVVW/wAUKqv/ABlVVZr/ABlVVZr/ABtVVv8AB4AA/wAdVVWLs4v/AB4qq///89VV/wAUVVX//+eqq/8AFFVV///nqqv/AAeAAP//4NVV///6qqtl///8qqtz///4VVX//+uAAH96f3r///HVVf//8iqr///vqqv///VVVQj//++qq///9VVVef//+Cqr///sVVWG///sVVWG///s1Vb///2AAP//7VVViwhti4NPpYsF/wAWqquLof///VVV/wAVVVX///qqq/8AFVVV///6qqv/ABKqq///94AAm///9FVVm///9FVV/wAMVVX///DVVv8ACKqr///tVVX/AAiqq///7VVV/wACVVX//+mqq4dx///8qqv//+qqq///+dVVd4L//+1VVYL//+1VVf//89VV///vqqv///Cqq30I///wqqt9///t1VWAdoN2g///6IAAh3GLY4v//+HVVf8ACSqr///rqqv/ABJVVf//66qr/wASVVX///GAAP8AGiqr///3VVWtCA5R9/X3QhVz+0LHi6P3QvcAi5PB+wCLzvh0OIv78PxjgUQF+Aj4aBVR/DL7kIv3yPgyBQ5R+LL5IhWTwfvyi1L7/QWhmf8AF6qr/wALgAD/ABlVVZT/ABlVVZT/ABlVVv8ABIAA/wAZVVWL/wAZVVWL/wAW1Vb///sqq/8AFFVV///2VVX/ABRVVf//9lVV/wAQ1Vb///LVVv8ADVVV///vVVX/AA1VVf//71VV/wAJqqv//+yAAJH//+mqq5H//+mqq/8AAVVV///oKqr///yqq///5qqrCIdv///3Kqv//+dVVf//8lVV///qqqv///JVVf//6qqr///wKqv//+5VVXl9eX3//+0qq///9YAA///sVVWE///sVVWE///uKqv///yAAHuLe4v///Cqq/8AAoAA///xVVWQ///xVVWQ///yqquSf5QIf5T///Wqq/8AClVV///3VVX/AAuqq///91VV/wALqqv///mqq/8ADIAAh/8ADVVVCElsBZn//9qqq6L//+Kqqqv//+qqq6v//+qqq7X///VVVb+LpYum/wAEqqun/wAJVVWn/wAJVVX/ABoqq5n/ABhVVf8AEqqr/wAYVVX/ABKqq/8AFSqr/wAXqqqd/wAcqqud/wAcqqv/AAuqq/8AIVVV/wAFVVWxCP8ABKqrq////yqq/wAeKqv///mqq/8AHFVV///5qqv/ABxVVf//9NVV/wAY1VZ7/wAVVVV7/wAVVVX//+tVVf8AENVW///mqqv/AAxVVf//5qqr/wAMVVX//+JVVf8ABiqraYv//+6qq4v//+4qqv///qqr///tqqv///1VVf//7aqr///9VVX//+6AAP//+qqr///vVVWDCK33dQUOUfdz+CAV94H3zD+L+4H70wX//+6qq///6Kqref//5VVV///tVVVt///tVVVtf///3lVV///6qqv//9qqq///+1VVa/8AAaqr///igACTcJNw/wAM1VX//+jVVf8AEaqr///sqqv/ABGqq///7Kqr/wAWVVX///DVVaaApoD/AB4qq///+oAA/wAhVVWLCP8AIVVVi/8AH6qr/wAFgACplqmW/wAaqqv/AA8qq/8AF1VV/wATVVX/ABdVVf8AE1VV/wATVVb/ABcqq/8AD1VVpv8AD1VVppX/AB2AAP8ABKqrq4//AB6qq////oAA/wAcgACE/wAaVVWE/wAaVVX///Qqq6L//+9VVf8AE6qrCP//71VV/wATqqv//+sqq/8AD4AAcv8AC1VVcv8AC1VV///j1VX/AAWqq///4Kqri///7qqri///7NVV///9gAB2hnaG///u1VX///iAAP//8qqrgQjidRX/ABaqq4v/ABTVVf//+6qrnv//91VVnv//91VVm///9CqrmHyYfP8ACYAA///uVVWR///rqquR///rqqv/AAFVVf//6oAA///8qqv//+lVVf///Kqr///nVVX///jVVf//6YAAgP//66qrgP//66qrff//7oAAev//8VVVCHr///FVVf//7NVV///0qqv//+qqq4P//+qqq4N0h///51VVi///51VVi///6iqrj3iTeJP///Aqq/8AC1VV///zVVX/AA6qq///81VV/wAOqqv///cqq/8AEYAAhv8AFFVVhv8AFFVV////Kqv/ABaAAP8AA1VV/wAYqqsI/wADVVX/ABaqq/8AB1VW/wAVgAD/AAtVVf8AFFVV/wALVVX/ABRVVf8ADiqr/wARqqucmpya/wATKqv/AAvVVf8AFVVV/wAIqqv/ABVVVf8ACKqr/wAWVVb/AARVVf8AF1VViwgOUfiq+SIVk8H8JouDVffoi/wO/SLOiwUOUfch+KwVif//71VV/wAAgAD//++AAI7//++qq47//++qq/8ABVVV///wqqr/AAeqq///8aqr/wAHqqv///Gqq5X///OAAP8ADFVV///1VVX/AAxVVf//9VVV/wAOgAD///hVVv8AEKqr///7VVUIigf//+iqq///+1VVdv//99VW///tVVX///RVVf//7VVV///0VVX//++qq319///vqqt9///vqqv///SAAHmC///sVVWC///sVVX///oqq///64AA///9VVX//+qqq///+1VVa/8AAYAA///jKqv/AAeqq///5lVV/wAHqqv//+ZVVf8ADFVV///qKquceQicef8AFSqrff8AGVVVgf8AGVVVgf8AHFVWhv8AH1VVi/8AH1VVi/8AHaqrkKeVp5WkmaGdoZ3/ABJVVf8AFdVV/wAOqqv/ABmqq/8ADqqr/wAZqqv/AAmqqv8AHNVV/wAEqqurCP8AAqqr/wAVVVX////VVf8AFIAAiP8AE6qriP8AE6qr///51VWd///2qqv/ABBVVf//9qqr/wAQVVX///Oqqpn///Cqq/8AC6qr///wqqv/AAuqq///7VVV/wAIKqp1/wAEqqsIjAed/wAEqqv/ABCqq/8AB6qq/wAPVVX/AAqqq/8AD1VV/wAKqqv/AA2qq/8ADIAAl/8ADlVVl/8ADlVV/wAJ1VX/AA9VVv8AB6qr/wAQVVX/AAeqq/8AEFVV/wAE1VX/ABCAAI3/ABCqq4//ABtVVf///oAApIT/ABaqq4T/ABaqq4D/ABNVVXybCHyb///tVVX/AAyAAP//6aqrlP//6aqrlP//5yqq/wAEgAD//+Sqq4v//+Sqq4v//+XVVf//+4AAcoJygv//6aqr///zgAD//+xVVXv//+xVVXv//++qq///7Kqrfv//6VVVfv//6VVV///3gAByh///5KqrCM0W/wACqqv/ABNVVf8ABaqq/wARqqv/AAiqq5v/AAiqq5v/AArVVf8ADaqrmP8AC1VVmP8AC1VV/wAO1VX/AAjVVv8AEKqr/wAGVVX/ABCqq/8ABlVV/wARVVX/AAMqq52L/wAkqquL/wAc1VX///Qqq6D//+hVVaD//+hVVf8AB9VV///ggAD///qqq///2KqrCP///VVVef//+oAA///vKqv///eqq///8FVV///3qqv///BVVf//9VVV///yVVZ+///0VVV+///0VVX///Eqq///9qqr///vVVWE///vVVWE///uVVb///yAAP//7VVVi///7Kqri3r/AAOAAP//8VVVkv//8VVVkv//89VW/wAJVVX///ZVVf8AC6qrCP//9lVV/wALqqv///kqq/8ADaqqh/8AD6qrh/8AD6qr////VVX/ABDVVf8AAqqrnQhC++cV/wADVVX/ABdVVZL/ABUqq/8ACqqrnv8ACqqrnv8ADSqq/wAQVVX/AA+qq/8ADaqr/wAPqqv/AA2qq/8AEaqq/wAKgAD/ABOqq/8AB1VV/wATqqv/AAdVVf8AFIAA/wADqqv/ABVVVYv/ABVVVYv/ABNVVv///FVV/wARVVX///iqq/8AEVVV///4qqv/AA6qq///9YAAl///8lVVCJf///JVVf8ACKqr///vqqv/AAVVVXj/AAVVVXiM///q1VX///yqq///6Kqr///8qqv//+qqq///+YAAd///9lVV///tVVX///ZVVf//7VVV///zgAD//++qq///8Kqrff//8Kqrff//7lVV///01VV3///3qqt3///3qqv//+pVVf//+9VV///oqquLCP//6Kqri///64AA/wAEKqv//+5VVf8ACFVV///uVVX/AAhVVf//8YAA/wALKqv///Sqq5n///Sqq5mD/wAQVVX///tVVf8AEqqr///7VVX/ABKqq////1VWn/8AA1VV/wAVVVUIDlH4H/fMFfuA+8zXi/eA99MF/wAIqquX/wAJKqr/AAyqq/8ACaqr/wANVVX/AAmqq/8ADVVVlP8ADiqr/wAIVVWa/wAIVVWa/wAHgAD/AA/VVf8ABqqr/wAQqqv/AAaqq/8AEKqr/wAEqqr/ABGqqv8AAqqr/wASqqv/AASqq6v///5VVf8AHYAAg6aDpv//8yqr/wAXKqv//+5VVf8AE1VVCP//7lVV/wATVVX//+mqq/8ADyqrcJZwlv//4dVV/wAFgAD//96qq4v//96qq4v//+BVVf//+oAAbYBtgP//5VVV///w1VX//+iqq///7Kqr///oqqv//+yqq///7Kqq///o1VX///Cqq3D///Cqq3CB///igAD///tVVWsIh///4VVV/wABgAD//+OAAJL//+Wqq5L//+Wqq/8AC6qrdP8AEFVV///sVVX/ABBVVf//7FVV/wAUqqv///CAAKT///Sqq6T///Sqq/8AHCqr///6VVX/AB9VVYv/ABFVVYv/ABMqq/8AAoAAoJCgkP8AESqr/wAHgAD/AA1VVZUINKEV///oqquLdv8ABFVV///tVVX/AAiqq///7VVV/wAIqqv///Aqq/8AC9VVfpp+mv//9qqr/wARgAD///pVVZ////pVVZ////7VVv8AFaqr/wADVVX/ABdVVf8AA1VV/wAYqqv/AAcqq/8AFoAAlv8AFFVVlv8AFFVV/wAN1VX/ABGAAP8AEKqr/wAOqqsI/wAQqqv/AA6qq57/AAtVVf8AFVVVk/8AFVVVk6KP/wAYqquL/wAYqquLoYf/ABNVVYP/ABNVVYP/AA/VVv//9Kqr/wAMVVX///FVVf8ADFVV///xVVX/AAjVVv//7oAA/wAFVVX//+uqq/8ABVVV///rqquM///pgAD///yqq///51VVCP///Kqr///oqqv///iAAP//6lVV///0VVV3///0VVV3///xqqv//+6AAHp8enz//+yqq///9Cqr///qVVX///dVVf//6lVV///3VVX//+nVVv//+6qr///pVVWLCA770vch+DgVJQpV/A4VIQoO+9L3FOUVJApS994VJQoO4/kj+JMVkr38q/t+hVv4aft+kr38N/dkBQ7j9xr4IxWEW/iSi5K7Bfyn+yQVJgoO4+rqFYRZ+Kv3fpG7/Gn3foRZ+Df7ZAUO+wf3hfeiFYA3x4uUywX/AANVVf8AF1VV/wAGqqv/ABPVVpX/ABBVVZX/ABBVVZf/AA6qq5mYmZj/AA7VVf8ADKqr/wAPqqv/AAxVVf8AD6qr/wAMVVX/AA7VVf8ADYAAmf8ADqqrmf8ADqqr/wAMVVWc/wAKqqv/ABNVVf8ACqqr/wATVVX/AAdVVf8AF6qrj6cIj/8AG1VV///+1VX/ABhVVv//+aqr/wAVVVX///mqq/8AFVVV///1qqqd///xqqv/AA6qq///8aqr/wAOqqv//+4qqv8ACyqq///qqqv/AAeqq///6qqr/wAHqqv//+hVVf8AA9VVcYv//+dVVYv//+gqq////FVVdP//+KqrdP//+Kqrdv//9VVVeH0IeH3//+9VVXr///Gqq3f///Gqq3f///TVVf//6VVVg///5qqrCMuDBf8AC1VV/wAiqqv/ABKAAKf/ABmqq/8AFVVV/wAZqqv/ABVVVf8AHoAA/wAKqqv/ACNVVYv/ACSqq4v/ABsqqv//9NVV/wARqqv//+mqq/8AEaqr///pqqv/AAYqqv//4tVV///6qqtn///8qqt1///5gAB4///2VVV7///2VVV7///0VVb///Eqq///8lVV///yVVUI///yVVX///JVVf//8aqr///zKqt8f3x////xqqv///NVVf//8lVV///yqqv///JVVf//8qqr///0Kqt8gf//71VVgf//71VV///5VVX//+yqq////KqrdQha+3gVIQoO93L3ufesFf8AA1VVo/8AB9VW/wAZqqv/AAxVVf8AG1VV/wAMVVX/ABtVVf8AD1VW/wAZVVb/ABJVVf8AF1VV/wASVVX/ABdVVf8AFNVW/wATVVb/ABdVVf8AD1VV/wAXVVX/AA9VVf8AGFVW/wAHqqv/ABlVVYuni/8AEyqrgv8AClVVef8AClVVef8AAtVWcv//+1VVawj///yqq3X///gqqv//59VV///zqqv//+Wqq///86qr///lqqv///Cqqv//51VV///tqqt0///tqqt0///rgAD//+zVVf//6VVV///wqqv//+lVVf//8KqrdP//+FVV///oqquLcYv//+yqq/8ACNVV///zVVX/ABGqq///81VV/wARqqv///uqq/8AFtVVj6cI96B2Ffce97ZPi2pLiYsF///6qqv/AB6qq///9FVV/wAVgAB5/wAMVVV5/wAMVVV3/wAGKqt1i///21VVi2n///dVVf//4Kqr///uqqv//+Cqq///7qqr///kKqr//+mqqv//56qr///kqqv//+eqq///5Kqrd2z///BVVf//3VVV///wVVX//91VVf//9dVW///dVVb///tVVf//3VVVCP///Kqrd4v//+0qq/8AA1VV///uVVX/AANVVf//7lVV/wAGVVb///BVVv8ACVVV///yVVX/AAlVVf//8lVV/wAMgAD///VVVv8AD6qr///4VVX/AA+qq///+FVV/wATKqr///wqq/8AFqqri6WL/wAZqquS/wAZVVWZ/wAZVVWZ/wAUVVb/AA9VVf8AD1VV/wAQqqsIjQb///yqq///6VVV/wADqqr//+8qq/8ACqqrgP8ACqqrgJn///qAAP8AEVVVi6eLqP8AB4AAqZqpmqf/ABTVVaX/ABqqq6X/ABqqq/8AFlVV/wAfVVX/ABKqq6//ABKqq6//AAxVVf8AJqqrkf8AKVVVCJH/ACqqq4j/ACeqqn//ACSqq3//ACSqq///7Kqr/wAfqqr//+VVVf8AGqqr///lVVX/ABqqq///3tVWoP//2FVV/wAPVVX//9hVVf8AD1VV///T1Vb/AAeqq///z1VVi///zKqri///zoAA///2gAD//9BVVXj//9BVVXhg///lqqv//9mqq///3lVVCP//2aqr///eVVVr///Yqqv//+ZVVV7//+ZVVV7//++AAP//z4AA///4qqtX///4qqtX/wACgAD//89VVf8ADFVV///Sqqv/AAxVVf//0qqr/wAUVVb//9iAAP8AHFVV///eVVX/ABxVVf//3lVV/wAj1Vb//+WAAP8AK1VV///sqqv/ACtVVf//7Kqr/wAwqqv///ZVVcGLCP8AH1VVi/8AH6qr/wAEKqur/wAIVVWr/wAIVVX/AB6qq5f/AB1VVf8AD6qr/wAdVVX/AA+qq/8AG4AA/wAS1VX/ABmqq6H/ABmqq6H/ABaAAKT/ABNVVacIUQZ7///sqqv//+2AAP//7lVVdnt2e///6aqr///yKqv//+hVVf//9FVV///oVVX///RVVf//51VW///21Vb//+ZVVf//+VVV///mVVX///lVVf//5tVW///8qqv//+dVVYtfi///16qr/wAIgAD//9tVVZz//9tVVZz//+Eqq/8AF1VVcv8AHaqrCHL/AB2qq3n/ACKAAID/ACdVVYD/ACdVVf///YAAtZH/ACyqq5H/ACqqq/8ADdVV/wAo1VX/ABWqq7L/ABWqq7L/ABsqqv8AIlVV/wAgqqv/AB2qq/8AIKqr/wAdqquw/wAXqqr/AClVVf8AEaqr/wApVVX/ABGqq/8AK1VW/wAI1VX/AC1VVYsI/wAlVVWLrv//+dVV/wAgqqv///Oqq/8AIKqr///zqqun///u1VX/ABdVVXX/ABdVVXX/ABFVVv//5YAA/wALVVVs/wALVVVsjv//3dVV///6qqv//9qqq4dv///21VX//+Oqq///8aqr///jVVX///Gqq///41VV///vVVX//+Yqq3h0CHh0d///7Sqrdv//8VVVdv//8VVV///s1VX///iqq///7qqri///9Kqri///+Sqqjv///aqrkf///aqrkf///yqq/wAFqqv/AACqq/8ABVVV/wABVVX/AAlVVZGb/wAKqqv/ABaqqwgO9vgx+VgVJwpcQxUoCg6/91j5WBUo/Vj3dosFo4v/ABoqq/8AAqqr/wAcVVX/AAVVVf8AHFVV/wAFVVWmlf8AGaqr/wAOqqv/ABmqq/8ADqqr/wAWVVX/ABQqqp7/ABmqq57/ABmqq/8ADIAA/wAhKqqR/wAoqqv/AANVVf8AGKqr////VVb/ABaqqv//+1VV/wAUqqv///tVVf8AFKqr///31Vb/ABHVVf//9FVVmgj///RVVZp8l///7aqrlP//7aqrlP//64AA/wAFgAD//+lVVY0IjQf/ACtVVf8ACKqr/wAiKqv/ABGqqqT/ABqqq6T/ABqqq/8ADyqr/wAfVVX/AAVVVa//AAVVVbP///2qq/8AICqrgf8AGFVVgf8AGFVVfJ53/wANqqt3/wANqqv//+iqq5T//+VVVf8ABFVV///lVVX/AARVVf//5VVW/wACKqv//+VVVYsI+0n7xhWu94r3JosF/wAUqquL/wATgACJ/wASVVWH/wASVVWH/wAPgAD///kqq/8ADKqr///2VVX/AAyqq///9lVV/wAJKqp+/wAFqqv//++qq/8ABaqr///vqqv/AAEqqv//64AA///8qqv//+dVVf///qqr///0qqv///wqqv//84AA///5qqv///JVVf//+aqr///yVVX///Yqqv//8yqr///yqqt/CP//8qqrf3n///XVVf//6VVV///3qqv//+lVVf//96qr///jqqv///vVVWmLCPtN++oVs/eu9zWLBf8AFKqri/8AFCqq///9VVX/ABOqq///+qqr/wATqqv///qqq5z///eAAP8ADlVV///0VVX/AA5VVf//9FVV/wAK1Vb///DVVv8AB1VV///tVVX/AAdVVf//7VVV/wABqqv//+mqq4dxif//81VV///71VX///HVVv//+aqr///wVVX///mqq///8FVV///1gAD///Eqq///8VVVfQj///FVVX3//+wqq///9FVVcv//9qqrcv//9qqr///gKqv///tVVf//2VVViwgO9xL5S/cDFSkKDvc390/5WBUqCvuI/RwVKwoOmvdY+VgVLAoOdfdY+VgVKP1YzYu69+T34YuTx/vhi6/3kPf6i5PHBQ73XPlDuRUtCg73JPdY+VgVLgoO+9L3WPlYFS8KDiv4MvdkFTAKDqz3WPlYFTEKDj33WPlYFTIKDvfL91H5WBUo/VjNi+L5BI2L90/9BKiL9/n5BI2LNP0EzYvu+Vgti/vp/Ob7Q/jmBQ73XPdY+VgVMwoO95Tv9/YVNArNFjUKDof3WPlYFSj9WM2Luvfk9y2LBaeL/wAbVVX/AAOqq/8AGqqr/wAHVVX/ABqqq/8AB1VV/wAYKqr/AAsqq/8AFaqrmv8AFaqrmv8AElVV/wATKqua/wAXVVWa/wAXVVX/AAnVVf8AG6qr/wAEqqur/wAFVVX/ACSqq////Sqr/wAegACA/wAYVVWA/wAYVVX///BVVf8AEyqr///rqquZCP//66qrmf//6Kqq/wAJ1VX//+Wqq/8ABaqr///lqqv/AAWqq///5oAA/wAC1VX//+dVVYsI+0r7zBU2Cg73lPnBFpPH+3GLi40F/wAcqqv/AAqqq/8AGtVV/wAP1VWkoKSgof8AGCqrnv8AG1VVnv8AG1VV/wAP1VX/AB0qq/8ADKqrqv8ADKqrqv8ACKqq/wAfKqv/AASqq/8AH1VV/wAGqqv/ADNVVYn/AC/VVv//9VVV/wAsVVX///VVVf8ALFVV///tgAD/ACZVVv//5aqr/wAgVVUI///lqqv/ACBVVWn/ABmAAP//1lVV/wASqqv//9ZVVf8AEqqr///P1Vb/AAlVVf//yVVVi///yVVVi///zSqr///2qqtc///tVVVc///tVVX//9aqq///5oAA///cVVX//9+qq///3FVV///fqqv//+KAAP//2aqq///oqqv//9Oqq///6Kqr///Tqqt8///QKqr///lVVf//zKqrCIP//8lVVY7//85VVpn//9NVVZn//9NVVaH//9nVVqn//+BVVan//+BVVf8AJCqr///ngAD/ACpVVf//7qqr/wAqVVX//+6qq/8ALdVW///3VVX/ADFVVYsI+5P3/xWR/wAqqqv/AAwqq/8AJ9VV/wASVVWw/wASVVWw/wAXqqv/ACAqq6j/ABtVVaj/ABtVVf8AIaqr/wAVVVb/ACZVVf8AD1VV/wAmVVX/AA9VVf8AKiqr/wAHqqu5i7mLs///+FVVrf//8Kqrrf//8Kqr/wAb1VX//+qqqv8AFaqr///kqqsI/wAVqqv//+Sqq/8ADtVV///f1VWTZpNmjP//2Cqrhf//1VVVhf//2Kqr///0VVX//9oqqv//7qqr///bqqv//+6qq///26qr///pVVX//9/VVW9vb2///99VVf//6YAA///aqqt6///aqqt6///Wqqr///eAAP//0qqriwj//9NVVYv//9gqq5Nom2ibbv8AFaqrdP8AG1VVdP8AG1VV///vqqv/ACAqq///9lVVsP//9lVVsP///iqr/wAnKquR/wApVVUIDpr3bvggFTcK+zb3zBU4Cg519xr3FxU5Cg6H9+35HBU6Cg71+RL3oxU7Cg6a6/lYFfc5/VjNi/gE+VhFi/vR/QH7IfkBBQ74AvP5WBU8Cg6s99P4CBX70vwI2ov3oPfU90j71N2L+2f4CPez9+Q8i/uF+7T7OPe0PYsFDof3vPfFFT0KDnWpvxU+Cg770vfU+UAVkbv7Kov7EP4M9yqLkbsxi/cE+awFDvtk9/p5FftZ+Y5VefdX/Y4FDvvSn/sAFYVb9yqL9xD6DPsqi4Vb5Yv7BP2sBQ7j+C35WBX7uPxYxIv3jvgi9x/8IsOL+zj4WAUOPYFAFYRZ+IeLkr0FDveV+MgVPwoOUPhm91YVQAr7B7EVQQoOrPdB+YgVIf2Ix4uW3I2LBf8ABqqre/8ACYAA///yKqv/AAxVVf//9FVV/wAMVVX///RVVZn///ZVVv8AD6qr///4VVX/AA+qq///+FVV/wAQgAD///pVVv8AEVVV///8VVX/ABFVVf///FVV/wARVVb///4qq/8AEVVVi/8AI1VVi/8AIVVWkf8AH1VVl/8AH1VVl6f/ABDVVf8AGKqr/wAVqqsI/wAYqqv/ABWqq/8AFFVV/wAZqqqb/wAdqqub/wAdqqv/AAqqq/8AIIAA/wAFVVX/ACNVVf8ABKqr/wAjVVX///6AAP8AIIAA///4VVX/AB2qq///+FVV/wAdqqv///LVVv8AGaqq///tVVX/ABWqq///7VVV/wAVqqv//+iqq/8AENVVb5dvl///4FVVkf//3Kqriwj//+6qq4v//+4qqv///iqr///tqqv///xVVf//7aqr///8VVV5///6VVb//+5VVf//+FVV///uVVX///hVVf//71VW///2VVb///BVVf//9FVV///wVVX///RVVf//8oAA///yKqv///Sqq3sIiYvA+AsFO/yhFUIKDir4cM8VQwoOrPiD3BVECqj3KhVFCg51+IjiFUYKdvdLFUcKDvuu9z/4LBVICg6s+LipFUkKbvdjFUoKDnX3TvmIFUsKDvcu+GIVTApa90sVTQoO9x46FU4KpvlqFU0KDir3TvmIFU8KDvdY+YgVUAoO96b3EvfgFV374MeLq/d7Bf8ABKqrq/8ACCqq/wAb1VX/AAuqq/8AF6qr/wALqqv/ABeqq/8ADiqq/wATqqr/ABCqq/8AD6qr/wAQqqv/AA+qq/8AEqqq/wALqqr/ABSqq/8AB6qr/wAUqqv/AAeqq/8AFVVV/wAD1VWhi/8AIKqri/8AFlVVfpdxl3GO///dqquF///VVVUIZPuqx4uv95gFjf8AEKqr/wAEgAD/ABGqqpL/ABKqq5L/ABKqq5X/ABFVVZibmJv/ABAqq/8ADSqr/wATVVX/AApVVf8AE1VV/wAKVVX/ABeqq/8ABSqrp4uji/8AEtVV///71VX/AA2qq///96qr/wANqqv///eqq/8ACiqq///01VX/AAaqq30I/wAGqqt9/wADqqr///Aqq/8AAKqr///uVVX/AACqq///7lVViv//7dVW///9VVX//+1VVQhl+6THi7H3pwX/AANVVf8AGVVVjP8AGKqr///+qquj///+qquj///6Kqr/ABUqq///9aqr/wASVVX///Wqq/8AElVV///wKqr/AA7VVv//6qqr/wALVVX//+qqq/8AC1VV///jVVX/AAWqq2eLa4v//+BVVYP//+Cqq3v//+Cqq3v//+aqqv//5qqr///sqqv//91VVQiF/wAjVVX///FVVf8AGYAA///oqqv/AA+qq///6Kqr/wAPqqtw/wAH1VX//+FVVYv//+1VVYt5///9gAD//+6qq4b//+6qq4Z7///5VVX///FVVf//96qr///xVVX///eqq///8tVW///2Kqr///RVVf//9Kqr///0VVX///Sqq///9iqrf4P///NVVQiIBv///1VV/wAEqqv/AACqq/8AClVVjZuNm/8AAaqr/wAQqqv/AAFVVf8AEVVVCE8G////VVWF////Kqv///eAAIqAioCK///0KquK///zVVWK///zVVX///7VVf//84AA///+qqv///Oqq////qqr///zqqv///6qqv//9YAA///+qqv///dVVQgOdfcS9+AVUQoOm+H3exVSCscWUwoOrPcX+GIVKv1Gx4u398mNiwX/AAaqq3v/AAmAAP//8iqr/wAMVVX///RVVf8ADFVV///0VVWZ///2VVb/AA+qq///+FVV/wAPqqv///hVVf8AEIAA///6VVb/ABFVVf///FVV/wARVVX///xVVf8AEVVW///+Kqv/ABFVVYv/ACNVVYv/ACFVVpH/AB9VVZf/AB9VVZen/wAQ1VX/ABiqq/8AFaqrCP8AGKqr/wAVqqv/ABRVVf8AGaqqm/8AHaqrm/8AHaqr/wAKqqv/ACCAAP8ABVVV/wAjVVX/AASqq/8AI1VV///+gAD/ACCAAP//+FVV/wAdqqv///hVVf8AHaqr///y1Vb/ABmqqv//7VVV/wAVqqv//+1VVf8AFaqr///oqqv/ABDVVW+Xb5f//+BVVZH//9yqq4sI///uqquL///uKqr///4qq///7aqr///8VVX//+2qq////FVVef//+lVW///uVVX///hVVf//7lVV///4VVX//+9VVv//9lVW///wVVX///RVVf//8FVV///0VVX///KAAP//8iqr///0qqt7CImLltwFZft7FUIKDqz4g9wVX/vJx4vs+UZPi4A6iYsF///4qqub///2VVX/AA3VVX//AAuqq3//AAuqq///8iqr/wAJqqr///BVVf8AB6qr///wVVX/AAeqq///74AA/wAFqqr//+6qq/8AA6qr///uqqv/AAOqq///7qqq/wAB1VX//+6qq4v//9yqq4v//96AAIX//+BVVX///+BVVX9v///vKqv//+eqq///6lVVCP//56qr///qVVX//+uqqv//5lVW///vqqv//+JVVf//76qr///iVVX///WAAP//34AA///7VVX//9yqq///+qqr///cqqv/AAFVVf//34AAk///4lVVk///4lVV/wANKqv//+ZVVv8AElVV///qVVX/ABJVVf//6lVV/wAXVVb//+8qq/8AHFVVf/8AHFVVf/8AH9VWhf8AI1VViwj/ABFVVYv/ABHVVv8AAdVV/wASVVX/AAOqq/8AElVV/wADqqud/wAFqqr/ABGqq/8AB6qr/wARqqv/AAeqq/8AEKqq/wAJqqr/AA+qq/8AC6qr/wAPqqv/AAuqq/8ADYAA/wAN1VX/AAtVVZsIqPcqFUUKDvuJ9xL34BVUCg77LOz3ChVVCg77iff/+CwVVgoOdfh99xYVVwoO+wfa+GIV9xH8YsmL94r4Yk6L+2H8ISj4IQUO9xLa+GIVWAoOKvd9944V+3f7jtOL90/3ZfcY+2XZi/s39473VPdoQIv7K/tDI/dDPosFDvsH91H7IxVZCg77LKuvFVoKDvuJ+Ab5QBWRu1mLBW+L///o1VX///VVVf//7aqr///qqqv//+2qq///6qqr///0Kqr//+JVVf//+qqrZQh3+yUF///9VVX//+yqq////FVWeP//+1VV///tVVX///tVVf//7VVVhf//74AA///4qqv///Gqq///+Kqr///xqqv///cqqv//9IAA///1qqv///dVVf//9aqr///3VVX///PVVf//+6qrfYsIhVsFmYv/AArVVf//+6qr/wAHqqv///dVVf8AB6qr///3VVX/AAWAAP//9IAA/wADVVX///Gqq/8AA1VV///xqqv/AAFVVv//76qq////VVX//+2qq////1VV///tqqv///5VVv//7Sqq///9VVX//+yqqwh3+yYF///6qqv//9qqq/8AA4AA///igAD/AAxVVf//6lVV/wAMVVX//+pVVf8AFCqr///1Kquniwi9i5G7dIsFgYv///fVVf8AAtVV///5qqv/AAWqq///+aqr/wAFqqv///tVVf8AB1VViJSIlP///lVV/wAKVVX///+qq/8AC6qr////qqv/AAuqq/8AANVV/wAL1VWNlwif9yIFj6X/AABVVf8AFoAA///8qque///8qque///7Kqr/AA+qq///+aqr/wAMVVX///mqq/8ADFVV///5VVX/AAmAAIT/AAaqq4T/AAaqq///+yqr/wAEVVX///1VVY0IjQf/AANVVf8AAVVVkY//AAiqq/8ABqqr/wAIqqv/AAaqq/8ACVVV/wAJqqqV/wAMqquV/wAMqqv/AAlVVf8AD9VV/wAIqque/wAIqquekf8AFoAA/wADVVWlCJ/3IQWN/wAMqqv/AAKqq/8ADCqq/wADVVX/AAuqq/8AA1VV/wALqqv/AASAAP8AClVV/wAFqquU/wAFqquU/wAG1VX/AAdVVZP/AAWqq5P/AAWqq5T/AALVVZWLCA77+PeE+YIVW4v7If58u4sFDvuJtvsAFYVbvYsFp4v/ABcqq/8ACqqr/wASVVX/ABVVVf8AElVV/wAVVVX/AAvVVv8AHaqr/wAFVVWxCJ/3JQX/AAKqq/8AE1VV/wADqqqe/wAEqqv/ABKqq/8ABKqr/wASqquR/wAQgAD/AAdVVf8ADlVV/wAHVVX/AA5VVf8ACNVW/wALgAD/AApVVf8ACKqr/wAKVVX/AAiqq/8ADCqr/wAEVVWZiwiRuwV9i///9Sqr/wAEVVX///hVVf8ACKqr///4VVX/AAiqq///+oAA/wALgAD///yqq/8ADlVV///8qqv/AA5VVf///qqq/wAQVVb/AACqq/8AElVV/wAAqqv/ABJVVf8AAaqq/wAS1Vb/AAKqq/8AE1VVCJ/3JgX/AAVVVf8AJVVV///8gAD/AB2AAP//86qr/wAVqqv///Oqq/8AFaqr///r1VX/AArVVW+LCFmLhVuiiwWVi/8ACCqr///9Kqv/AAZVVf//+lVV/wAGVVX///pVVf8ABKqr///4qquOgo6C/wABqqv///Wqq/8AAFVV///0VVX/AABVVf//9FVV////Kqv///Qqq4l/CHf7IgWHcf///6qr///pgAD/AANVVXj/AANVVXj/AATVVv//8FVV/wAGVVX///Oqq/8ABlVV///zqqv/AAaAAP//9oAA/wAGqqv///lVVf8ABqqr///5VVWQ///7qqv/AANVVYkIiQf///yqq////qqrhYf///dVVf//+VVV///3VVX///lVVf//9qqr///2VVaB///zVVWB///zVVX///aqq///8Cqr///3VVV4///3VVV4hf//6YAA///8qqtxCHf7IQWJ///zVVX///1VVf//89VW///8qqv///RVVf///Kqr///0VVX///uAAP//9aqr///6VVWC///6VVWC///5Kqv///iqq4P///pVVYP///pVVYL///0qq4GLCA7j+PX34BVuqwV9///uqqv///Eqq///8FVV///wVVV9///wVVV9///uKquEd4v///NVVYv///Gqq/8AAyqre/8ABlVVe/8ABlVV///vVVX/AAeAAP//7qqr/wAIqqv//+6qq5N5k///7VVVk///7VVVk///7VVWj///7VVViwj//+9VVYv///Cqq////VVVff//+qqrff//+qqr///zVVWE///0qqv///dVVf//9Kqr///3VVX///XVVf//9lVWgv//9VVVgv//9VVV///4Kqv///VVVv//+VVV///1VVUIqWsF/wANVVX/ABFVVf8ADoAA/wAPqqv/AA+qq5n/AA+qq5n/ABHVVZKfi/8ADKqri/8ADlVV///81VWb///5qqub///5qquc///4gACd///3VVX/ABFVVYOdg/8AEqqrg/8AEqqrg/8AEqqqh/8AEqqriwj/ABCqq4v/AA8qqv8AAoAA/wANqquQ/wANqquQ/wAMgAD/AAaqq/8AC1VV/wAIVVX/AAtVVf8ACFVVlf8ACaqr/wAIqquW/wAIqquWk/8ACyqr/wAHVVX/AAtVVQgO+9IO+2T3WffAFUH8nseL1fieBbH3JBVbCg5R9874NRVX/AYF///qqqv/AASqq///7VVV/wAIKqp7/wALqqt7/wALqqv///LVVf8ADiqq///1qqv/ABCqq///9aqr/wAQqqv///jVVf8AEoAAh/8AFFVVh/8AFFVV////qqv/ABUqq/8AA1VVof8AA1VVof8ABlVW/wAVVVX/AAlVVf8AFKqr/wAJVVX/ABSqq/8AC9VW/wASqqr/AA5VVf8AEKqrCP8ADlVV/wAQqqucmf8AE6qr/wALVVX/ABOqq/8AC1VV/wAVgAD/AAdVVv8AF1VV/wADVVUIhvwLFcD4DAX/ABiqq4n/ABTVVf//+dVVnP//9aqrnP//9aqr/wAPKqv///Iqqv8ADVVV///uqqsIwK8FeaP//+oqq/8AEtVV///mVVX/AA2qq///5lVV/wANqqv//+LVVv8AByqq///fVVX/AACqqwiV0luLgUMF///hVVWH///jKqv///cqq3D///JVVXD///JVVXP//+6qq3Z2dnb//+6qq3P///JVVXD///JVVXD///bVVv//4tVV///7VVX//+Cqq4f//+Cqq4z//+KqqpH//+Sqq5H//+Sqq/8AClVV///ngAD/AA6qq///6lVVCP8ADqqr///qVVX/ABLVVf//7iqron2iff8AGoAAgqmHCIFDu4uV0AXNjf8AOaqr/wAaqqv/ADFVVf8AM1VVCGKxBf//7qqref//7NVV///xKqt2///0VVV2///0VVX//+mAAP//+YAAc////qqrCA5RzMEVhFX4NIuSwfuJi7T3tPc5i5LB+zmLnfcQBY3/AA6qq/8ABNVVm/8AB6qr/wARVVX/AAeqq/8AEVVV/wAKgAD/AA/VVv8ADVVV/wAOVVX/AA1VVf8ADlVV/wAQKquXnv8ACaqrnv8ACaqr/wAWKqv/AATVVf8AGVVVi/8AFVVVi/8AEtVW///7Kqv/ABBVVf//9lVV/wAQVVX///ZVVf8ADiqr///0KquXfQi6uwX//9qqq/8AJVVVXv8AEqqr///LVVWL///ZVVWL///eVVb///mAAP//41VVfv//41VVfnP//+9VVf//7Kqr///rqqv//+yqq///66qr///w1VX//+mqqoD//+eqq4D//+eqq///+Sqr///ogAD///1VVf//6VVVCHr7CSyLhFXqi2L7tAUOUe33WRVKVKhmzMMF/wATVVX//+6qq/8AFoAA///y1VX/ABmqq4L/ABmqq4L/ABrVVf//+4AAp4uni/8AG9VV/wAEgAD/ABuqq5T/ABuqq5T/ABoqqv8ADSqr/wAYqqv/ABFVVQi8U7KwWsIF/wAWqqv/ABVVVf8AElVV/wAX1VaZ/wAaVVWZ/wAaVVWU/wAcgACP/wAeqqv/AASqq/8AHqqriv8AHIAA///5VVX/ABpVVf//+VVV/wAaVVX///RVVv8AF9VW///vVVX/ABVVVQjMwm6wSlMF///sqqv/ABFVVf//6aqq/wANKqv//+aqq5T//+aqq5T//+VVVf8ABIAAb4tvi2////uAAG+Cb4L//+Wqq///8tVV///nVVX//+6qqwhaw2RmvFQF///Sqqv//9VVVf//5Kqq///Lqqv///aqq02DTf8ADKqr///Lqqv/ACFVVf//1VVVCKH3MRWP/wAaqqv/AAiqq6T/AA1VVf8AF1VV/wANVVX/ABdVVf8AEFVW/wAUVVb/ABNVVf8AEVVV/wATVVX/ABFVVf8AFdVW/wANqqv/ABhVVZX/ABhVVZX/ABkqq5Cli6WL/wAXqquG/wAVVVWB/wAVVVWBnf//8lVV/wAOqqv//+6qqwj/AA6qq///7qqr/wAK1VX//+uqqpL//+iqq5L//+iqq/8AAYAAcof//+VVVYf//+VVVf//91VVcv//8qqr///oqqv///Kqq///6Kqr///vqqr//+uqqv//7Kqr///uqqv//+yqq///7qqr///qKqr///JVVf//56qrgf//56qrgf//5tVVhnGLCHGL///oVVWQ///qqquV///qqquVef8ADaqr///xVVX/ABFVVf//8VVV/wARVVX///Uqq/8AFFVWhP8AF1VVhP8AF1VV///+gACkj/8AGqqrCA5R95D3SBVy+0jNi6T3SPc+i5K7+z6LldiXm/c1i5G7+xqL94P350qL+4f77Psk9+wFR4v3I/vn+xqLhVv3NYuRe4E++z6LhFsFDvv493n5NxVbi1r78ruLBXb7KhVbi1r78ruLBQ5R9+b3QxUsvwX//+6qq/8ACVVV///xqqr/AAqqq///9Kqrl///9Kqrl4f/ABKqq/8AA1VV/wAZVVWN/wANVVX/AASqq/8AC9VW/wAHVVX/AApVVf8AB1VV/wAKVVX/AAjVVpT/AApVVf8AB6qr/wAKVVX/AAeqq/8AC1VW/wAGgAD/AAxVVf8ABVVV/wAMVVX/AAVVVf8AC9VW/wAEVVb/AAtVVf8AA1VVCNBiBf8AB1VVh/8AB6qr///61VWT///5qquT///5qquS///4qqqR///3qquR///3qqv/AASqq///9tVV/wADVVWB/wADVVWBjID///6qq3////6qq///9VVV///8Kqr///XVVv//+aqr///2VVX///mqq///9lVV///4qqr///cqq///96qrgwj///eqq4P///bVVf//+Kqrgf//+VVVgf//+VVV///2VVX///pVVv//9qqr///7VVUI+2n7PRVKbQX/AASqq///61VVk///7iqr/wALVVV8/wALVVV8/wANVVb///OAAP8AD1VVgf8AD1VVgf8AESqr///4qque///7VVWe///7VVX/ABPVVf///aqr/wAUqquLo4v/ABeqq/8AA6qr/wAXVVX/AAdVVf8AF1VV/wAHVVX/ABVVVv8ACtVW/wATVVX/AA5VVQj/ABNVVf8ADlVV/wAQVVb/ABGAAP8ADVVV/wAUqqv/AA1VVf8AFKqr/wAIqqv/ABeqqo//ABqqq/8AA1VV/wAaqqv///wqq/8AF9VVgKCAoP//8IAA/wARKqt3/wANVVWnmf8AF9VV/wAR1VX/ABOqq/8AFaqr/wATqqv/ABWqq/8ADCqq/wAaKqr/AASqq/8AHqqrCI//AB1VVf///FVV/wAYqqv///Sqq5////Sqq5////Cqqv8AEVVV///sqqv/AA6qq///7Kqr/wAOqqv//+qAAP8ADNVV///oVVWW///oVVWW///qVVb/AAtVVf//7FVV/wALqqv//+xVVf8AC6qre5j///Oqq/8ADlVV///zqqv/AA5VVf//+4AA/wAR1Vb/AANVVf8AFVVVCP8AAqqrm/8ABYAA/wAOKqv/AAhVVf8ADFVV/wAIVVX/AAxVVf8ACiqr/wAKKquXk5eT/wANKquR/wAOVVWP/wAOVVWP/wAO1VaN/wAPVVWLo4v/ABRVVf//+lVV/wAQqqv///Sqq/8AEKqr///0qqv/AAuqqnr/AAaqq///6VVVCMmtBYf/ABCqq///+VVV/wAOVVX///aqq5f///aqq5f///TVVf8ACaqrfv8AB1VVfv8AB1VV///xgAD/AAWAAHv/AAOqq3v/AAOqq///76qr/wAB1VX//+9VVYv//+iqq4v//+jVVf///KqrdP//+VVVdP//+VVV///qqquB///sVVX///Kqqwj//+xVVf//8qqr///vgAD//++qqv//8qqr///sqqv///Kqq///7Kqr///3VVX//+lVVYdxh23/AARVVXL/AAyqq3f/AAyqq3f/ABFVVf//7qqrof//8VVV///wqquF///xgAD///kqq///8lVV///4VVX///JVVf//+FVV///zgAD///bVVv//9Kqr///1VVUI///0qqv///VVVf//9oAAf///+FVV///yqqv///hVVf//8qqr///61VZ8///9VVX//+9VVf//+1VV///gqqv/AAOqq///5iqql///66qrl///66qrm///7lVVn3yffP8AFiqrfv8AGFVVgP8AGFVVgP8AFlVW///0qqv/ABRVVf//9FVVCP8AFFVV///0VVX/ABCAAP//8qqr/wAMqqt8/wAMqqt8/wAEqqr//+0qq////Kqr///pVVWJe///+qqrff//91VVf///91VVf///9VVW///11VX///NVVf//96qr///zVVX///eqq///8iqr///51VV8h3yH///xKquJ///xVVWLCP//4Kqri///5lVV/wAHgAB3mnea///yVVX/ABaAAP//+KqrqQgOz/kgFVwK91IWXAoO93L47PhDFcEGi/8AGKqrh/8AFaqqg/8AEqqrg/8AEqqr///0qqv/AA/VVf//8VVVmP//8VVVmP//7oAA/wAJ1VX//+uqq/8ABqqr///rqqv/AAaqq///6iqq/wADVVX//+iqq4tpi2z///pVVW////Sqq2////Sqq///54AAe3b//+tVVQh2///rVVX//+6qq///56qr///yVVVv///yVVVv///21Vb//+Gqq///+1VV///fVVX///tVVf//3qqr/wAAgAD//+GAAP8ABaqr///kVVX/AAWqq///5FVV/wAKgAD//+fVVv8AD1VV///rVVX/AA9VVf//61VV/wAUKqt7pP//9KqrpP//9Kqr/wAdgAD///pVVa2LCP8AF1VVi/8AFqqr/wADVVWh/wAGqquh/wAGqqv/ABQqq/8ACdVV/wASVVWY/wASVVWY/wAP1Vb/AA/VVf8ADVVV/wASqqv/AA1VVf8AEqqrlf8AFaqq/wAGqqv/ABiqqwhVBod9///5qqv///LVVf//91VV///zqqv///dVVf//86qr///1VVaA///zVVX///ZVVf//81VV///2VVX///HVVv//+FVW///wVVX///pVVf//8FVV///6VVX//+8qq////SqreYv//+aqq4t1/wAE1VX//+1VVf8ACaqr///tVVX/AAmqq///8NVWmP//9FVV/wAQVVUI///0VVX/ABBVVf//+Cqr/wATKquHoYeh////qqv/ABdVVf8AA1VV/wAYqqv/AANVVf8AGKqr/wAG1Vb/ABcqqv8AClVV/wAVqqv/AApVVf8AFaqr/wANVVb/ABMqqv8AEFVV/wAQqqv/ABBVVf8AEKqr/wAS1Vb/AA0qqv8AFVVV/wAJqqv/ABVVVf8ACaqr/wAXVVb/AATVVf8AGVVViwj/ACSqq////1VV/wAb1VX///VVVp7//+tVVZ7//+tVVf8ACoAAc43//+Sqqwj8nz4VXQrBFl4KDvuF9+L47hVLBnmL///tqqv///6qq///7VVV///9VVX//+1VVf///VVVeob///Cqq///+Kqr///wqqv///iqq///8tVVgYD///NVVYD///NVVf//+Sqre////VVV///sqquJ///xVVX/AAFVVf//84AA/wAEqqv///Wqq/8ABKqr///1qquS///3qqr/AAlVVf//+aqrCP8ACVVV///5qqv/AAsqq///+1VVmIiYiP8ADYAA///+gACZi/8AF1VVi/8AFNVWj/8AElVVk/8AElVVk/8AECqr/wANVVWZ/wASqqsIjQb///9VVf//91VV////KquDiv//+Kqriv//+Kqr/wAAKqv///iqqv8AAVVV///4qqsIvAb///9VVZv/AACqq/8AEIAAjZyNnP8AAlVV/wARKqv/AAKqq/8AEVVVCJbbBZH/ACiqq///+iqr/wAcVVX//+5VVZv//+5VVZv//+Mqq5Nji///yKqri///0lVVfmdxCKBlBf8AD1VV/wALVVX/AA9VVv8ACKqr/wAPVVWR/wAPVVWR/wARqquOn4uri/8AFKqr///6Kqv/AAlVVf//9FVV/wAJVVX///RVVf8AA6qr///vgACJ///qqqsIXlgVsYuKhAX///6qq///91VViP//9oAA///7VVX///Wqq///+1VV///1qqv///kqq///9oAAgv//91VVgv//91VVgP//+NVWfv//+lVVfv//+lVV///w1VX///0qq///7qqri3mLe/8AA9VVff8AB6qrff8AB6qrhf8ACdVVjZcI/wABVVX/AAqqq/8ABVVW/wAI1VX/AAlVVZL/AAlVVZL/AAsqq/8ABYAAmI+Yj/8ADlVV/wACqqv/AA+qq/8AAVVV/wAPqqv/AAFVVf8ADtVV/wAAqquZiwgOKuv3gRVfCoz7XxVfCg7j+OH38xVs+227i7H3nfySi4RbBQ77ibb3nBVV94vBBw73cvfm9yEVpvdQ2Ivw+1DIiyb3UAX/AA6qq/8AAqqr/wAOVVX/AAQqqpn/AAWqq5n/AAWqq/8ADIAA/wAHqqqW/wAJqquW/wAJqqv/AAmAAP8AC9VVk5mTmf8ABVVVnP8AAqqrn/8ABVVV/wAmqqv///nVVv8AHYAA///uVVX/ABRVVf//7lVV/wAUVVX//97VVv8ACiqr///PVVWLCPs5i078QQXi94AVoPcl64sF/wALVVWL/wALVVb///7VVf8AC1VV///9qqv/AAtVVf///aqr/wAJ1Vb///wqqv8ACFVV///6qqv/AAhVVf//+qqr/wAGVVb///jVVf8ABFVVgv8ABFVVgv8AASqr///0gACJff///VVVef//+lVW///yKqv///dVVf//9lVV///3VVX///ZVVf//9YAA///4qqv///Oqq4YI///zqquG///yVVWIfIp8iv//8Sqr////gAD///FVVYsI+/90FV0KwRZeCg735fjyFWAKDvtG95j4RBWfi/8AE1VV/wAD1VX/ABKqq/8AB6qr/wASqqv/AAeqq/8AEKqq/wAKVVX/AA6qq5j/AA6qq5j/AAxVVf8AD1VVlf8AEaqrlf8AEaqr/wAGqqv/ABLVVf8AA1VVn/8AAqqrn////tVV/wASqquG/wARVVWG/wARVVX///fVVf8ADyqr///0qquYCP//9KqrmP//8iqq/wAKKqv//++qq/8AB1VV///vqqv/AAdVVf//7dVV/wADqqt3i3eL///sqqv///xVVf//7VVV///4qqv//+1VVf//+Kqr///vVVb///XVVf//8VVVfv//8VVVfv//86qr///w1VWB///uqquB///uqqv///mqq///7VVV///9VVV3CP///Kqrd/8AANVV///tKquQ///uVVWQ///uVVX/AAgqq///8Kqr/wALVVV+/wALVVV+/wAN1Vb///Wqq/8AEFVV///4VVX/ABBVVf//+FVV/wASKqv///wqq5+LCJK7Ff//5VVVi///6qqr/wAJVVV7/wASqqt7/wASqqv///mqq/8AFqqq/wADVVX/ABqqq43/AA1VVf8ABFVV/wAMgAD/AAaqq/8AC6qr/wAGqqv/AAuqq/8ACFVV/wAKKqqV/wAIqquV/wAIqqv/AAsqq/8ABtVV/wAMVVWQ/wAMVVWQ/wAM1Vb/AAKAAP8ADVVViwj/ABqqq4v/ABVVVf//9qqrm///7VVVm///7VVVkf//6VVWh///5VVVif//8qqr///71VX///OAAP//+aqr///0VVX///mqq///9FVV///31VX///XVVoH///dVVYH///dVVf//9NVV///5Kqv///Oqq4b///Oqq4b///Mqqv///YAA///yqquLCA7j9xb4CxWEW/d4i3L7S7uLpPdL936Lkrv7foul90tbi3H7SwX7m/urFYRb+IqLkrsFDvuE0PfgFYVg97iLkrv7cIv3JPcNBf8ADVVV/wALVVWY/wALVVb/AAyqq/8AC1VV/wAMqqv/AAtVVf8AC1VV/wALqquVl5WX/wAIqquY/wAHVVWZ/wAHVVWZ/wAEqquajZv/AASqq/8AIqqr///21VX/ABrVVXSedJ7//+Eqq/8ACYAA///ZVVWLCP//81VVi///8iqr///+Kqt8///8VVV8///8VVX///FVVf//+iqr///xqquD///xqquD///y1VX///WAAH9+f37///ZVVf//79VV///4qqv//+yqqwi+hwX/AAdVVf8AD1VV/wALKqv/AA2qq5qXmpf/ABQqq5H/ABlVVYv/ABqqq4v/ABPVVf//+iqrmP//9FVVmP//9FVV/wAFKqv///DVVv///VVV///tVVX///yqq///6Kqrgv//7FVV///xVVV7///xVVV7///uVVb//+9VVf//61VV///uqqsIDvuE9174rBWEW5yLBf8ADqqri5n///6qq/8ADVVV///9VVX/AA1VVf///VVV/wALgAD///uqq/8ACaqrhf8ACaqrhf8AByqq///31VX/AASqq///9aqr/wAEqqv///Wqq/8AAVVV///y1VWJe////qqrgYf///ZVVf//+VVV///2qqv///lVVf//9qqr///31Vb///fVVf//9lVVhAj///ZVVYT///WAAP//+oAA///0qquH///0qquH///0qqqJ///0qquLcYv//+yqq/8ABVVV///zVVX/AAqqq///81VV/wAKqqv///dVVv8ADlVV///7VVWdCFp5Bf8AB1VVa/8ADqqr///pKquh///yVVWh///yVVX/ABtVVf//+Sqr/wAgqquL/wAUqquL/wATgAD/AALVVf8AElVV/wAFqqv/ABJVVf8ABaqr/wAQgACT/wAOqqv/AApVVf8ADqqr/wAKVVWX/wAMqqv/AAlVVZr/AAlVVZqR/wAQ1VX/AAKqq/8AEqqrCI//ABtVVYb/ABeqq32ffZ///+qqq5f//+NVVY8IjI0Fo/8AB1VV/wAVKqv/AAyAAP8AElVV/wARqqv/ABJVVf8AEaqr/wAK1Vb/ABSAAP8AA1VV/wAXVVWN/wAQqqv///6AAJqG/wANVVWG/wANVVX///hVVf8AC1VW///1qqv/AAlVVf//9aqr/wAJVVX///Mqqv8AByqr///wqquQ///wqquQ///vVVX/AAKAAHmLCP//41VVi3H///kqq///6Kqr///yVVX//+iqq///8lVVd///7oAA///vVVX//+qqqwivcgX/AAtVVf8AD1VV/wAN1Vb/AAwqq/8AEFVVlP8AEFVVlP8AEdVW/wAEgAD/ABNVVYv/ABdVVYv/ABHVVv//+iqr/wAMVVX///RVVf8ADFVV///0VVX/AATVVv//8YAA///9VVX//+6qq4l9///7VVX///Qqq///+Kqr///2VVX///iqq///9lVV///3VVX///hVVoH///pVVQiB///6VVX///Uqq///+9VW///0VVX///1VVf//9FVV///9VVX///Uqq////qqrgYsIDved+VgVYQoOdfh99xYVYgoOoffM99cVTPxVx4v3Avmm9w+L+wL9pseL9wn51vt3iwX//7lVVYv//8bVVv//7yqr///UVVX//95VVf//1FVV///eVVX//+WAAP//z4AA///2qqv//8Cqq////KqrcY3//+eqq/8AB1VV///pVVX/AAdVVf//6VVV/wAL1VZ3/wAQVVX//+6qq/8AEFVV///uqquf///yVVX/ABeqq4H/ABeqq4H/ABqAAIb/AB1VVYsIDvvS9xL30hVcCg73B0sVw8tliz8zmXwF/wAOqqv/AAVVVZr/AAKqq/8AD1VVi/8ADVVVi/8ADCqr///81VWW///5qquW///5qqv/AASAAP//9Sqqif//8Kqr///+qquDiP//+VVV///7VVX///qqq///+1VV///6qqv///pVVv//+6qq///5VVX///yqq///+VVV///8qqv///jVVv///YAA///4VVX///5VVQj///hVVf///lVV///41Vb///8qq///+VVVi///41VVi///56qr/wAFqqt3/wALVVUIeGsFp33/AB6qq4T/ACFVVYv/AAyqq4v/AA1VVf8AAaqrmf8AA1VVmf8AA1VV/wAM1VWQ/wALqqv/AAaqq/8AC6qr/wAGqquV/wAIqqr/AAhVVf8ACqqr/wAIVVX/AAqqq/8ABSqrmI3/AA9VVY2X////VVX/AAqAAP///KqrlAj///yqq5T///rVVf8AB4AAhJGEkf//96qr/wAEgAD///ZVVY7///ZVVY7///XVVv8AAYAA///1VVWLf4v///VVVf///aqr///2qqv///tVVQgO+4T3ofkoFWMKDvtU9wb40BX///yqq3X/AADVVXeQeZB5/wAIgAD///CAAJd+l37/AA8qq///9dVV/wASVVX///iqq/8AElVV///4qqv/ABUqq////FVVo4v/ABaqq4v/ABWqqv8AA6qr/wAUqqv/AAdVVf8AFKqr/wAHVVX/ABKAAP8ACiqr/wAQVVWYCP8AEFVVmP8ADVVW/wAPgAD/AApVVZ3/AApVVZ3/AAbVVp//AANVVaH/AANVVf8AFqqriv8AFFVV///6qqud///6qqudgv8AD4AA///zVVWY///zVVWY///wVVaV///tVVWS///tVVWS///rVVb/AAOAAP//6VVViwhzi///6aqr///8VVX//+tVVf//+Kqr///rVVX///iqq3n///XVVf//8Kqrfv//8Kqrfv//8yqq///wgAD///Wqq3n///Wqq3n///mAAHf///1VVXUIuxaNmf8ABKqr/wANVVX/AAdVVf8ADKqr/wAHVVX/AAyqq/8ACSqr/wALVVWWlZaV/wAMqqv/AAfVVf8ADlVV/wAFqqv/AA5VVf8ABaqr/wAPKqv/AALVVZuLrYv/ABmqq///9dVV/wARVVX//+uqq/8AEVVV///rqqv/AAaqq///5tVVh20Iif//8VVV///7VVX///JVVv//+Kqr///zVVX///iqq///81VV///2gAD///TVVv//9FVV///2VVX///RVVf//9lVVfv//+FVW///xqqv///pVVf//8aqr///6VVX///DVVf///Sqre4t7i///8aqr/wAC1VX///NVVf8ABaqr///zVVX/AAWqq///9YAA/wAH1VX///eqq5UI///3qquVhf8AC1VV///8VVX/AAyqq////FVV/wAMqqv///8qq/8ADVVVjZkIDir3sfeBFWQK9+D3XxVkCg73XPeC+SgVYwr4p/coFSMKPPz4FWUK93X3jhVmCg73XPd6+SgVYwr4pvcoFSMK+4j9MxWFYPe4i5G7+3CL9yT3DQX/AA1VVf8AC1VVmP8AC1VW/wAMqqv/AAtVVf8ADKqr/wALVVX/AAuAAP8AC6qr/wAKVVWX/wAKVVWX/wAI1VaY/wAHVVWZ/wAHVVWZ/wAEqquajZuN/wARVVX///6AAP8AD1VWhv8ADVVVhv8ADVVVg/8AC1VWgP8ACVVVCID/AAlVVf//8qqr/wAHKqv///BVVZD///BVVZD//+6AAP8AAoAA///sqquL///zVVWL///yKqv///4qq3z///xVVXz///xVVf//8YAA///6Kqt9g32D///y1VX///WAAP//86qrfv//86qrfv//9oAA///v1VX///lVVf//7KqrCL2HBf8AB1VV/wAPVVX/AAsqq/8ADaqrmpeal/8AFCqrkf8AGVVVi/8AGqqri5////oqq/8ADVVV///0VVX/AA1VVf//9FVVkP//8NVW///8qqv//+1VVf///Kqr///oqquC///sVVX///FVVXv///FVVXv//+5VVv//71VV///rVVX//+6qqwgO91z3WPisFYRbnIsF/wAOqquLmf///qqr/wANVVX///1VVf8ADVVV///9VVX/AAuAAP//+6qr/wAJqquF/wAJqquF/wAHKqr///fVVf8ABKqr///1qqv/AASqq///9aqr/wABVVX///LVVYl7///+qquBh///9lVV///5VVX///aqq///+VVV///2qqv///fVVv//99VV///2VVWECP//9lVVhP//9YAA///6gAD///Sqq4f///Sqq4f///Sqqon///Sqq4txi///7Kqr/wAFVVX///NVVf8ACqqr///zVVX/AAqqq///91VW/wAOVVX///tVVZ0IWXkFk2ua///pKquh///yVVWh///yVVX/ABtVVf//+Sqr/wAgqquL/wAUqquL/wATgAD/AALVVf8AElVV/wAFqqv/ABJVVf8ABaqr/wAQgACT/wAOqqv/AApVVf8ADqqr/wAKVVWX/wAMqqv/AAlVVZr/AAlVVZqR/wAQ1VX/AAKqq/8AEqqrCI//ABtVVYb/ABeqq32ffZ///+qqq5f//+NVVY8IjI0Fo/8AB1VV/wAVKqv/AAyAAP8AElVV/wARqqv/ABJVVf8AEaqr/wAK1Vb/ABSAAP8AA1VV/wAXVVWN/wAQqqv///6AAJqG/wANVVWG/wANVVX///hVVf8AC1VW///1qqv/AAlVVf//9aqr/wAJVVX///Mqqv8AByqr///wqquQ///wqquQ///vVVX/AAKAAHmLCP//41VVi3H///kqq///6Kqr///yVVX//+iqq///8lVVd///7oAA///vVVX//+qqqwivcgX/AAtVVf8AD1VV/wAN1Vb/AAwqq/8AEFVVlP8AEFVVlP8AEdVW/wAEgAD/ABNVVYv/ABdVVYv/ABHVVv//+iqr/wAMVVX///RVVf8ADFVV///0VVX/AATVVv//8YAA///9VVX//+6qq4l9///7VVX///RVVf//+Kqr///2qqv///iqq///9qqr///3VVX///iAAIH///pVVQiB///6VVX///Uqq///+9VW///0VVX///1VVf//9FVV///9VVX///Uqq////lVWgf///1VVCPiP92IVIwr7Bvz4FWUK93P3jhVmCg77B/e192wVl99Pi4JLBf///Kqr///oqqv///kqqv//7Cqq///1qqv//++qq///9aqr///vqqt////xVVX///JVVX7///JVVX7///Eqq///81VVe///86qre///86qrfP//8oAAff//8VVVff//8VVV///zqqt6///1VVX//+yqq///9VVV///sqqv///iqq///6FVVh28Ih///5Kqr/wABKqv//+eqqv8ABlVV///qqqv/AAZVVf//6qqr/wAKVVZ5/wAOVVX///FVVf8ADlVV///xVVWd///01Vb/ABWqq///+FVV/wAVqqv///hVVf8AF9VV///8Kquli72L/wAsqqv/AA4qq/8AJ1VV/wAcVVX/ACdVVf8AHFVVp/8AJ9VW/wAQqqv/ADNVVQhLkwV////dVVX//+0qq2///+ZVVf//6qqr///mVVX//+qqq///4YAA///1VVX//9yqq4v//9tVVYv//+TVVv8ACyqr///uVVX/ABZVVf//7lVV/wAWVVX///nVVv8AHSqr/wAFVVWv/wADVVWh/wAGqquelZuVm/8AC6qr/wAO1VX/AA1VVf8ADaqrCP8ADVVV/wANqqv/AA5VVv8ADNVV/wAPVVWX/wAPVVWX/wAOVVb/AAyqq/8ADVVV/wANVVX/AA1VVf8ADVVV/wALqqualf8AEKqrlf8AEKqr/wAGqqv/ABNVVf8AA1VVoQi893gVWwoO9vgx+VgVJwpcQxUoCve4+IwVPwoO9vgx+VgVJwpcQxUoCvfA+RwVYQoO9vgx+VgVJwpcQxUoCvdv+RwVZwoO9vgx+VgVJwpcQxUoCtz4nRVoCg72+DH5WBUnClxDFSgK8/jkFSUK91IWJQoO9vgx+VgVJwpcQxUoCvct+OEVaQr3KhZqCg738Pi/+VgV/MT9WNGL9yn3UPfMi3H7UPgDi5PH+8GLsveo96iLk8f7qIuv95D3uYuTxwX8A08VUvwk+6WL99L4JAUO9xL5S/cDFVu0Bf//8Kqr///sqqt6///vgAD//+1VVf//8lVV///tVVX///JVVf//7Kqr///0qqt3gneC///sKqv///lVVf//7FVV///7qqv//+xVVf//+6qr///tKqv///3VVXmLXYv//9eqq5P//91VVZv//91VVZv//+Oqq6F1pwh1p///8KqrrP//91VVsf//91VVsf///qqrtJG3kbf/AAyqq7T/ABNVVbH/ABNVVbH/ABiqq6ypp6mn/wAiqquh/wAnVVWb/wAnVVWb/wAqqquTuYsI/wAjVVWLrf//+Cqr/wAgqqv///BVVf8AIKqr///wVVWk///n1Vb/ABFVVf//31VVCMe4Bf//5qqrs///36qq/wAcgAD//9iqq5z//9iqq5z//9RVVf8ACIAAW4tVi///zVVV///2qqv//9Cqq///7VVV///Qqqv//+1VVf//1dVV///mKqtmamZq///hVVX//9jVVf//56qr///Sqqv//+eqq///0qqr///v1VX//85VVYNVCP//+VVV///PVVWM///Sqqv/AAiqq2H/AAiqq2H/AA+AAGb/ABZVVWv/ABZVVWv/AByAAP//5YAA/wAiqqt2/wAiqqt2/wAnqqr///KAAP8ALKqrhQhKQJl8Bf8ADqqr/wAFVVWa/wACqqv/AA9VVYv/AA1VVYv/AAwqq////NVVlv//+aqrlv//+aqr/wAEgAD///Uqqon///Cqq////qqrg4j///lVVf//+1VV///6qqv///tVVf//+qqr///6VVb///uqqv//+VVV///8qqv///lVVf///Kqr///41Vb///2AAP//+FVV///+VVUI///4VVX///5VVf//+NVW////Kqv///lVVYv//+NVVYv//+eqq/8ABaqrd/8AC1VVCHhrBad9/wAeqquE/wAhVVWL/wAMqquL/wANVVX/AAGqq5n/AANVVZn/AANVVf8ADNVVkP8AC6qr/wAGqqv/AAuqq/8ABqqrlf8ACKqq/wAIVVX/AAqqq/8ACFVV/wAKqqv/AAUqq5iN/wAPVVWNl////1VV/wAKgAD///yqq5QI///8qquU///61VX/AAeAAISRhJH///eqq/8ABIAA///2VVWO///2VVWO///11Vb/AAGAAP//9VVVi3+L///1VVX///2qq///9qqr///7VVUIio2zugX/AASqq////1VV/wAEgAD///+qq/8ABFVViwj/AA2AAAa/i/8AMdVVlf8AL6qrn/8AL6qrn/8AK9VVrLO5CA6a91j5WBUsCvs9txU/Cg6a91j5WBUsCvs191AVYQoOmvdY+VgVLAr7hvdQFWcKDpr3WPlYFSwK+/n3GBUlCvdSFiUKDvvS91j5WBUvCqq3FT8KDvvS91j5WBUvCrL3UBVhCg770vdY+VgVLwph91AVZwoO+9L3WPlYFS8K+zH3GBUlCvdSFiUKDvc392X4IBVrCvvfVRVsCg73XPdY+VgVMwrHyBVoCg73lO/39hU0Cs0WNQr4MvgiFT8KDveU7/f2FTQKzRY1Cvg6+LIVYQoO95Tv9/YVNArNFjUK9+n4shVnCg73lO/39hU0Cs0WNQr3X/gzFWgKDveU7/f2FTQKzRY1Cvd2+HoVJQr3UhYlCg7j+BH35RX7PvdaZGn3Pvta+3j7Wqlp93f3W/c9+1uyrfs+91r3d/dab60FDveU9zHsFTQ5qWzi3AX/ABtVVf//5VVV/wAgqqv//+uAALH///Gqq7H///Gqq7b///jVVbuLwYv/ADKqq/8ACSqr/wAvVVX/ABJVVf8AL1VV/wASVVX/ACoqq/8AGaqrsKywrP8AHqqr/wAnVVX/ABhVVf8ALaqr/wAYVVX/AC2qq/8AD9VW/wAx1VX/AAdVVcEI/wAHVVX/ADVVVf///lVW/wAw1Vb///VVVf8ALFVV///1VVX/ACxVVf//7VVW/wAmgAD//+VVVf8AIKqrCOHcbqo1OgVv/wAZVVX//9+AAP8AE4AAZv8ADaqrZv8ADaqr///WKqv/AAbVVf//0VVVi1WL///NVVX///aqq///0Kqr///tVVX//9Cqq///7VVV///V1VX//+Yqq2ZqZmr//+FVVf//2NVV///nqqv//9Kqq///56qr///Sqqv//+/VVf//zlVVg1UI///4qqtX/wABVVX//9BVVZX//9Sqq5X//9Sqq/8AEaqrZf8AGVVV///fVVUI+Kz4jBX8efxdBf//7Kqr/wAbVVX///LVVf8AH1VWhP8AI1VVhP8AI1VV////Kqv/ACaqq/8ABVVVtZG3/wAMqqu0/wATVVWx/wATVVWx/wAYqqusqaepp/8AIqqrof8AJ1VVm/8AJ1VVm/8AKqqrk7mLCP8AJqqri/8AIqqq///6VVX/AB6qq///9Kqr/wAeqqv///Sqq/8AGlVVe6H//+tVVQj8Xvx+Ffh6+F4F/wAUqqv//+Sqq/8ADiqqa/8AB6qr///bVVX/AAeqq///21VV/wAA1VX//9hVVoX//9VVVYVf///zVVVi///sqqtl///sqqtl///nVVVqbW9tb///3VVVdf//2Kqre///2Kqre///1VVVg12LCGOL///cVVWR///gqquX///gqquX///lVVWcdaEIDvX5EvejFTsK+xn4dRU/Cg71+RL3oxU7CvsR+QUVYQoO9fkS96MVOwr7YvkFFWcKDvX5EvejFTsK+9X4zRUlCvdSFiUKDof3vPfFFT0K+AH3UBVhCg6H91j5WBUo/VjNi6T3SPctiwWni/8AG1VV/wADqqv/ABqqq/8AB1VV/wAaqqv/AAdVVf8AGCqq/wALKqv/ABWqq5r/ABWqq5r/ABJVVf8AEyqrmv8AF1VVmv8AF1VV/wAJ1VX/ABuqq/8ABKqrq/8ABVVV/wAkqqv///0qq/8AHoAAgP8AGFVVgP8AGFVV///wVVX/ABMqq///66qrmQj//+uqq5n//+iqqv8ACdVV///lqqv/AAWqq///5aqr/wAFqqv//+aAAP8AAtVV///nVVWLCPsfi6H3MAVK/GgVNgoOmvfe+F4Vg1WgiwX/ABiqq4v/ABcqqv///FVV/wAVqqv///iqq/8AFaqr///4qqv/ABKAAP//9NVV/wAPVVV8/wAPVVV8/wALVVb//+zVVf8AB1VV///oqqv/AAdVVf//6Kqr/wABVVb//+Sqqv//+1VV///gqqv///yqq3H///hVVf//6FVVf///6qqrf///6qqrfP//7dVVeXwIeXz//+tVVf//9IAA///oqquD///oqquDcof//+VVVYv///aqq4v///cqqv8AAKqr///3qqv/AAFVVf//96qr/wABVVX///fVVf8AAlVWg/8AA1VVCIJRBZOJ/wAH1VX///6qq/8AB6qr////VVX/AAeqq////1VV/wAH1VX///+qq5OLr4v/ACGqq5D/AB9VVZX/AB9VVZWn/wAOqqv/ABiqq/8AE1VV/wAYqqv/ABNVVf8AFIAA/wAX1Vb/ABBVVf8AHFVV/wAQVVX/ABxVVf8ACtVW/wAgKqv/AAVVVa8I/wAFVVX/ACaqq////4AA/wAgKqr///mqq/8AGaqr///5qqv/ABmqq///9lVV/wAU1VV+m36b///wqquX///uVVWT///uVVWT///uKqv/AAWqq3n/AANVVQiMjQX/AB9VVf8ACVVV/wAagAD/ABIqq/8AFaqrpv8AFaqrpv8ADYAA/wAhKqv/AAVVVf8AJ1VVj/8AHKqr///+1VX/ABmAAP//+aqr/wAWVVX///mqq/8AFlVV///1gAD/ABKqq///8VVVmv//8VVVmnn/AAuAAP//6qqrk///6qqrk///6FVVj3GLCGmLbP//+iqrb///9FVVb///9FVV///nqqv//+/VVv//61VV///rVVX//+tVVf//61VV///vKqv//+dVVn7//+NVVX7//+NVVf//9yqr///gqqv///tVVWkIQPyqx4vU+KEFj/8AGVVVkf8AGCqrk6KTopb/ABQqq5n/ABFVVZn/ABFVVZz/AA2qq5+Vn5X/ABeqq5D/ABtVVYuxi/8AHaqr///1VVX/ABVVVf//6qqr/wAVVVX//+qqq/8AB6qr///gVVWFYQj///qqq2P//+8qqv//4IAA///jqqt0///jqqt0///d1VX///SAAGOLCA5Q+Gb3VhVACvsHsRVBCrn34BU/Cg5Q+Gb3VhVACvsHsRVBCsH4cBVhCg5Q+Gb3VhVACvsHsRVBCnD4cBVnCg5Q+Gb3VhVACvsHsRVBCvs69/EVbQoOUPhm91YVQAr7B7EVQQr7I/g4FVwK91IWXAoOUPhm91YVQAr7B7EVQQou+DUVbgr3KhZvCg73pvhD96sViYL7B4sF///QqquL///ZKqr///sqq///4aqr///2VVX//+Gqq///9lVV///n1VV/ef//8aqref//8aqrfv//8FVVg3qDeob///Aqq4n///FVVf///Kqr///nVVX/AAHVVXaS///uqquS///uqqv/AAqAAP//8dVVmYAImYD/ABBVVYP/ABKqq4b/ABKqq4b/ABNVVf///YAAn4u3i/8AKSqr/wAIqqv/ACZVVf8AEVVV/wAmVVX/ABFVVf8AH9VW/wAdVVb/ABlVVf8AKVVV/wALVVVj/wAUVVZu/wAdVVV5/wAdVVV5roL/ACiqq4sI/wAVVVWL/wATqqv/AAGqq53/AANVVZ3/AANVVZz/AAWAAJv/AAeqq5v/AAeqq/8AD6qr/wAJqqr/AA9VVf8AC6qr/wAPVVX/AAuqq/8AD1VW/wAOgAD/AA9VVf8AEVVVCGGtBXn//+iqq///6qqr///t1VX//+dVVX7//+dVVX7//+VVVv//+YAA///jVVWL///kqquL///o1VX/AASqq3j/AAlVVXj/AAlVVXz/AAyAAID/AA+qq4D/AA+qq///+NVV/wASVVX///yqq6D///yqq6D/AABVVf8AFoAAj6MI9/iLkK4F/wAFVVX/ACdVVYr/ACHVVv//+Kqr/wAcVVX///iqq/8AHFVVf/8AFyqr///vVVWd///vVVWd///rqqv/AA0qq3P/AAhVVXP/AAhVVXH/AAQqq2+Le4v//++AAIl6h3qH///vgACFe4MIe4P///DVVYH///Gqq3////Gqq3////OAAH3///VVVXv///NVVf8AJKqr///rgAD/ABkqqv//46qr/wANqqv//+Oqq/8ADaqr///c1VX/AAbVVWGLbYtr///6gABpgGmA///iVVX//+/VVf//5qqr///qqqsIqGIF/wAtVVX/ACKqq/8AMaqr/wARVVXBi72L/wAiVVX///PVVf8AEqqr///nqqv/ABKqq///56qr/wAGVVX//90qqoX//9Kqqwj7EkwV9wkG///8qqtz///5qqr//+mAAP//9qqrdv//9qqrdv//8yqq///tqqv//++qq///8FVV///vqqv///BVVf//7Cqq///zgAD//+iqq///9qqr///oqqv///aqq3D///tVVf//4VVVi///81VVi///86qr/wAB1VV//wADqqt//wADqqv///WAAP8ABVVVgpIIgpL///kqq5T///tVVZb///tVVZb///6qq/8ADIAAjZn/AACqq/8ABqqrjv8ACIAA/wAFVVX/AApVVf8ABVVV/wAKVVWU/wAJqqv/AAyqq5T/AAyqq5T/ABFVVf8AB9VVof8ABqqrof8ABqqr/wAcqqv/AANVVf8AI1VViwj4dMEVcAoOKvhwzxVisQV5///sqqv//+uqq///8IAA///pVVX///RVVf//6VVV///0VVVz///6Kqv//+aqq4tvi///51VVkP//6qqrlf//6qqrlf//7qqq/wANgAD///Kqq5z///Kqq5z///aqqp////qqq6L///qqq6L///9VVf8AGIAAj6UIj6X/AAfVVf8AGIAA/wALqqui/wALqquimp//ABJVVZz/ABJVVZz/ABUqq/8ADYAAo5WjlaWQp4uji/8AFVVV///6gAD/ABKqq4D/ABKqq4Cc///w1VX/AA9VVf//7KqrCMCvBf//7Kqr/wAZVVX//+jVVf8AE6qrcJlwmf//4YAAkmmL///cqquL///egACF///gVVV////gVVV/b///7yqr///nqqv//+pVVf//56qr///qVVX//+uqqv//5lVW///vqqv//+JVVf//76qr///iVVX///WAAP//34AA///7VVX//9yqqwj///tVVf//4Kqr/wAAgAD//+LVVf8ABaqrcP8ABaqrcJX//+gqq/8ADlVV///rVVX/AA5VVf//61VV/wASKqv//+7VVqH///JVVaH///JVVaT///bVVqf///tVVQhGOpl8Bf8ADqqr/wAFVVWa/wACqqv/AA9VVYv/AA1VVYv/AAwqq////NVVlv//+aqrlv//+aqr/wAEgAD///Uqqon///Cqq////qqrg4j///lVVf//+1VV///6qqv///tVVf//+qqr///6VVb///uqqv//+VVV///8qqv///lVVf///Kqr///41Vb///2AAP//+FVV///+VVUI///4VVX///5VVf//+NVW////Kqv///lVVYv//+NVVYv//+eqq/8ABaqrd/8AC1VVCHhrBad9/wAeqquE/wAhVVWL/wAMqquL/wANVVX/AAGqq5n/AANVVZn/AANVVf8ADNVVkP8AC6qr/wAGqqv/AAuqq/8ABqqrlf8ACKqq/wAIVVX/AAqqq/8ACFVV/wAKqqv/AAUqq5iN/wAPVVWNl////1VV/wAKgAD///yqq5QI///8qquU///61VX/AAeAAISRhJH///eqq/8ABIAA///2VVWO///2VVWO///11Vb/AAGAAP//9VVVi3+L///1VVX///2qq///9qqr///7VVUIio24wAX/AANVVf///1VV/wAEqqv///+qq5GL/wAhVVWL/wAf1Vb/AAaAAP8AHlVVmP8AHlVVmP8AHIAA/wAUKqv/ABqqq/8AG1VVCA51+IjiFUYKdvdLFUcKS/e6FT8KDnX4iOIVRgp290sVRwpT+EoVYQoOdfiI4hVGCnb3SxVHCvsd+EoVZwoOdfiI4hVGCnb3SxVHCvuR+BIVXAr3UhZcCg73LvhiFUwKtvEVPwoO9y74YhVMCr73ihVhCg73LvhiFUwKbfeKFWcKDvcu+GIVTAr7JvdSFVwK91IWXAoOm/ft+SgV+wRTpmr3B8QF/wAVVVV1/wAWgAD//+Mqq/8AF6qr///cVVX/ABeqq///3FVV/wAVgAD//9fVVv8AE1VV///TVVUIiIkF///tVVX/ABNVVf//6tVWmf//6FVV/wAIqqv//+hVVf8ACKqr///mKqv/AARVVW+L///cqquL///egACF///gVVV////gVVV/b///7yqr///nqqv//+pVVf//56qr///qVVX//+uqqv//5lVW///vqqv//+JVVf//76qr///iVVX///WAAP//34AA///7VVX//9yqqwj///qqq///3Kqr/wABVVX//9+AAJP//+JVVZP//+JVVf8ADSqr///mVVb/ABJVVf//6lVV/wASVVX//+pVVf8AF1VW///vKqv/ABxVVX//ABxVVX//AB/VVoX/ACNVVYv/ACNVVYv/ACGAAP8ABiqr/wAfqqv/AAxVVf8AH6qr/wAMVVX/ABwqqv8AEaqr/wAYqquiCP8AGKqrov8AFIAA/wAcKqv/ABBVVf8AIVVV/wAQVVX/ACFVVf8ACyqr/wAlVVaR/wApVVX/AAdVVb+K/wAvqqv///aqq/8AK1VV///2qqv/ACtVVf//8yqq/wAmgAD//++qq/8AIaqr///vqqv/ACGqq///7iqq/wAc1VX//+yqq6P//+yqq6N7/wASqqv///NVVf8ADVVVCPcGxGup+wRTBf//9Kqr/wANVVX///KAAP8ADdVW///wVVX/AA5VVf//8FVV/wAOVVX///GAAP8ADNVW///yqqv/AAtVVQhTbQX/AAtVVf//9qqr/wANVVb///Qqqv8AD1VV///xqqv/AA9VVf//8aqr/wAOVVb///HVVf8ADVVVfQj7W/xBFVMKDnX3EvfgFVEK2PeNFW0KDpvh93sVUgrHFlMK97T34RU/Cg6b4fd7FVIKxxZTCve8+HEVYQoOm+H3exVSCscWUwr3a/hxFWcKDpvh93sVUgrHFlMK1/fyFW0KDpvh93sVUgrHFlMK7vg5FVwK91IWXAoO4/cP99sVJgr7s/cWFYl9/wADVVV//wAIqquB/wAIqquB/wALVVWGmYuZi/8ADKqrkP8AC1VVlf8AC1VVlf8ABqqrl42ZjZn///yqq5f///dVVZX///dVVZX///Sqq5B9iwh9i///81VVhv//9Kqrgf//9Kqrgf//+VVVf4l9CF/7yBX///6qq33/AAOAAH//AAhVVYH/AAhVVYH/AAsqq4aZi5mL/wAM1VWQ/wALqquV/wALqquV/wAGgACX/wABVVWZjZn///zVVZf///eqq5X///eqq5X///TVVZB9iwj///FVVf///1VV///zKquGgP//9qqrgP//9qqr///5Kqt////9VVX///FVVQgOm/cL1BU7RKdu2NAFnf//7qqr/wAVqqv///Kqqv8AGVVV///2qqv/ABlVVf//9qqr/wAcqqv///tVVauL/wAjVVWL/wAhVVaR/wAfVVWX/wAfVVWXp/8AENVV/wAYqqv/ABWqq/8AGKqr/wAVqqv/ABRVVf8AGaqqm/8AHaqrm/8AHaqr/wAKqqv/ACCAAP8ABVVV/wAjVVUI/wAJVVX/AECqq///9Kqr/wA1VVVrtQjc0nCoPEUF///tVVX/ABCqq///6iqrmHL/AAlVVXL/AAlVVf//49VV/wAEqqv//+Cqq4v//9yqq4v//96AAIX//+BVVX///+BVVX9v///vKqv//+eqq///6lVV///nqqv//+pVVf//66qq///mVVb//++qq///4lVV///vqqv//+JVVf//9YAA///fgAD///tVVf//3KqrCP//91VVTZb//8tVVf8AHqqr///UqqsI9+/3xxX7wPudBYH/AA9VVf//+VVV/wARqqv///yqq5////yqq5+LoP8AA1VVoY+l/wAH1VX/ABiAAP8AC6qrov8AC6qropqf/wASVVWc/wASVVWc/wAVKqv/AA2AAKOVo5WlkKeLCP8AF1VVi/8AFNVW///8gAD/ABJVVYT/ABJVVYT/AA/VVv//9iqr/wANVVX///NVVQj7p/u9FffB954F/wAJVVX///Cqq/8ABoAA///uVVX/AAOqq3f/AAOqq3f/AAAqqv//6lVV///8qqv//+iqq4dx///4Kqv//+eAAP//9FVVdP//9FVVdHx3///tqqt6///tqqt6///q1VX///KAAHOBc4Fxhm+LCP//0VVVi2b/AA2qq///5Kqr/wAbVVUIDnX4ffcWFVcKQfhGFT8KDnX4ffcWFVcKSfjWFWEKDnX4ffcWFVcK+yf41hVnCg51+H33FhVXCvub+J4VXAr3UhZcCg77B/dR+yMVWQr3UPnnFWEKDqz3QfmIFfsf/mzHi7f3yY2LBf8ABqqre/8ACYAA///yKqv/AAxVVf//9FVV/wAMVVX///RVVZn///ZVVv8AD6qr///4VVX/AA+qq///+FVV/wAQgAD///pVVv8AEVVV///8VVX/ABFVVf///FVV/wARVVb///4qq/8AEVVVi/8AI1VVi/8AIVVWkf8AH1VVl/8AH1VVl6f/ABDVVf8AGKqr/wAVqqsI/wAYqqv/ABWqq/8AFFVV/wAZqqqb/wAdqqub/wAdqqv/AAqqq/8AIIAA/wAFVVX/ACNVVf8ABKqr/wAjVVX///6AAP8AIIAA///4VVX/AB2qq///+FVV/wAdqqv///LVVv8AGaqq///tVVX/ABWqq///7VVV/wAVqqv//+iqq/8AENVVb5dvl///4FVVkf//3Kqriwj//+6qq4v//+4qqv///iqr///tqqv///xVVf//7aqr///8VVV5///6VVb//+5VVf//+FVV///uVVX///hVVf//71VW///2VVb///BVVf//9FVV///wVVX///RVVf//8oAA///yKqv///Sqq3sIiYvA+AsFO/yhFUIKDvsH91H7IxVZCoL5rxVcCvdSFlwKDvb4MflYFScKXEMVKAr4C/i7FXEKDlD4ZvdWFUAK+wexFUEK9x74ChVgCg72+DH5WBUnClxDFSgK9z/5DRVyCg5Q+Gb3VhVACvsHsRVBCjn4cBVzCg72+TH7SxV9sQX///qqq///+qqr///4gAD///rVVf//9lVVhv//9lVVhv//9Cqr///9gAB9i///41VVi///86qr/wAPqquP/wAfVVWN/wAMqqv/AARVVf8ADFVV/wAGqquX/wAGqquX/wAH1VX/AAtVVZT/AAqqq5T/AAqqq/8ACVVV/wAJqqr/AAmqq/8ACKqrCP8ACaqr/wAIqqv/AAjVVZKT/wAFVVUIqIv7W/lYR4v8LP1Y0Iv191D4C4u++1AF///0qquD///0VVWCf4F/gYD///WAAIGAgYD///eAAP//9CqrhP//81VVhP//81VV///7gAD///Kqq4l9h///5qqr/wAFqqt3/wAPVVX///FVVf8AD1VV///xVVWg///4qqv/ABqqq4sI/wASqquL/wAQqqr/AAMqq/8ADqqr/wAGVVX/AA6qq/8ABlVV/wANVVX/AAfVVpf/AAlVVQj7f/nHFSgKDlD4W/tLFX2xBf//+qqr///6qqv///iAAP//+tVV///2VVWG///2VVWG///0Kqv///2AAH2L///jVVWL///zqqv/AA+qq4//AB9VVY3/AAyqq/8ABFVV/wAMVVX/AAaqq5f/AAaqq5f/AAfVVf8AC1VVlP8ACqqrlP8ACqqr/wAJVVX/AAmqqv8ACaqr/wAIqqsI/wAJqqv/AAiqq/8ACNVVkpP/AAVVVQiWBov/AA1VVf8AACqr/wANVVb/AABVVf8ADVVV/wAAVVX/AA1VVYz/AA5VVv8AAaqr/wAPVVX/AAGqq/8AD1VVjf8AEKqr/wACVVWd/wACVVWd/wAC1Vb/ABRVVf8AA1VV/wAWqqsIm/cFBZP/ADqqq///9Sqr/wAqgAD//+JVVf8AGlVV///iVVX/ABpVVf//1Sqr/wANKqtTi22La///+oAAaYBpgP//4lVV///v1VX//+aqq///6qqrCKhiBf8ALVVV/wAiqqv/ADGqq/8AEVVVwYuxi/8AHdVV///3VVX/ABWqq///7qqr/wAVqqv//+6qq/8ACCqq///jVVX///qqq2MIh29FiwX///Cqq4t6////gAD//+1VVYr//+1VVYr//+zVVv///aqr///sVVX///xVVf//7FVV///8VVX//+zVVv//+qqr///tVVWE///tVVWE///u1Vb///bVVf//8FVV///0qqv///BVVf//9Kqr///y1Vb///HVVf//9VVVev//9VVVeoT//+vVVf///Kqr///oqqsI///8qqv//+dVVf8AAdVVdpL//+6qq5L//+6qq/8ACoAA///x1VWZgJmA/wAQVVWD/wASqquG/wASqquG/wATVVX///2AAJ+Ls4v/ACGqq5L/ABtVVZn/ABtVVZn/ABhVVqH/ABVVVakIjQaH///mqqv///6qq3L/AAFVVf//51VV///0qquD///0VVWCf4F/gYD///WAAIGAgYD///eAAP//9CqrhP//81VVhP//81VV///7gAD///Kqq4l9h///5qqr/wAFqqt3/wAPVVX///FVVQj/AA9VVf//8VVVoP//+Kqr/wAaqquL/wASqquL/wAQqqr/AAMqq/8ADqqr/wAGVVX/AA6qq/8ABlVV/wANVVX/AAfVVpf/AAlVVQgj+DMVQQoO9xL5S/cDFSkK+xH5pRVhCg4q+HDPFUMKZ/kUFWEKDvcS+Uv3AxUpCvtQ+aUVZwoOKvhwzxVDCvsK+RQVZwoO9xL5S/cDFSkK+2H5bRUlCg4q+HDPFUMK+xz43BVcCg73EvlL9wMVKQr7IPkVFXQKDir4cM8VQwpF+IQVdAoO9zf3T/lYFSoK+4j9HBUrCvc7+UgVdAoOrPiD3BVECqj3KhVFCveJ+HEVdQoO9zf3ZfggFWsK+99VFWwKDqz4g9wVgDrHi9z42dOLk8BDi5z3Dk+LevsO+zaLg1b3Notv+1yJiwX///iqq5v///ZVVf8ADdVVf/8AC6qrf/8AC6qr///yKqv/AAmqqv//8FVV/wAHqqv///BVVf8AB6qr///vgAD/AAWqqv//7qqr/wADqqv//+6qq/8AA6qr///uqqr/AAHVVf//7qqri///3Kqri///3oAAhf//4FVVf///4FVVf2///+8qq///56qr///qVVUI///nqqv//+pVVf//66qq///mVVb//++qq///4lVV///vqqv//+JVVf//9YAA///fgAD///tVVf//3Kqr///6qqv//9yqq/8AAVVV///fgACT///iVVWT///iVVX/AA0qq///5lVW/wASVVX//+pVVf8AElVV///qVVX/ABdVVv//7yqr/wAcVVV//wAcVVV//wAf1VaF/wAjVVWLCP8AEVVVi/8AEdVW/wAB1VX/ABJVVf8AA6qr/wASVVX/AAOqq53/AAWqqv8AEaqr/wAHqqv/ABGqq/8AB6qr/wAQqqr/AAmqqv8AD6qr/wALqqv/AA+qq/8AC6qr/wANgAD/AA3VVf8AC1VVmwio9yoVh3H///eAAP//54AAfnR+dP//74AAd3d6d3r//+mAAP//8oAAcoFygf//5iqrhv//5VVVi2+L///nVVWQ///qqquV///qqquV///uqqr/AA2AAP//8qqrnAj///Kqq5z///aqqp////qqq6L///qqq6L///9VVf8AGIAAj6WPpf8AB9VV/wAYgAD/AAuqq6L/AAuqq6Kan/8AElVVnP8AElVVnP8AFSqr/wANgACjlaOVpZCniwj/ABqqq4v/ABiAAIb/ABZVVYH/ABZVVYH/ABKqq///8oAAmnqaev8ACtVVd/8ABqqrdP8ABqqrdP8AAVVV///ngACHcQgOmvdY+VgVLApL5hVxCg51+IjiFUYKdvdLFUcKq/fkFWAKDpr3WPlYFSwK+7P3QRVyCg51+IjiFUYKdvdLFUcK+1D4ShVzCg6a91j5WBUsCvt/9xgVJQoOdfiI4hVGCnb3SxVHCvsf+BIVXAoOmvdY+VgVKP1Y9/SLBf//9Kqrg///9FVVgn+Bf4GA///1gACBgIGA///3gAD///Qqq4T///NVVYT///NVVf//+4AA///yqquJfYf//+aqq/8ABaqrd/8AD1VV///xVVX/AA9VVf//8VVVoP//+Kqr/wAaqquLCP8AEqqri/8AEKqq/wADKqv/AA6qq/8ABlVV/wAOqqv/AAZVVf8ADVVV/wAH1VaX/wAJVVUIfbEF///6qqv///qqq///+IAA///61VX///ZVVYb///ZVVYb///Qqq////YAAfYv//+NVVYv///Oqq/8AD6qrj/8AH1VVjf8ADKqr/wAEVVX/AAxVVf8ABqqrl/8ABqqrl/8AB9VV/wALVVWU/wAKqquU/wAKqqv/AAlVVf8ACaqq/wAJqqv/AAiqqwj/AAmqq/8ACKqr/wAI1VWSk/8ABVVVCL+Lk8f8E4uy96j37IuTx/vsi6/3kPgDi5PHBQ519/77SxV9sQX///qqq///+qqr///4gAD///rVVf//9lVVhv//9lVVhv//9Cqr///9gAB9i///41VVi///86qr/wAPqquP/wAfVVWN/wALVVX/AAOqq5b/AAVVVf8ACqqr/wAFVVX/AAqqq/8ABlVW/wAKKqr/AAdVVf8ACaqr/wAHVVX/AAmqq/8AB9VWlP8ACFVV/wAIVVUI/wAIVVX/AAhVVf8ACCqr/wAHKquTkf8AIVVV/wAEqqv/AB6qq5Wn/wAPVVWn/wAPVVX/ABmqq6H/ABdVVf8AHKqrCGSwBf//7Kqr///mqqtyd///4VVV///xVVX//+FVVf//8VVV///hVVb///iqq///4VVVi///3Kqri///5Cqq/wAGqqv//+uqq/8ADVVV///rqqv/AA1VVf//8IAAm///9VVV/wASqqv///VVVf8AEqqr///5gAD/ABMqqv///aqr/wATqqv///2qq/8AE6qr////1VX/ABAqqo3/AAyqqwj4GIuRtQWP/wAaqquK/wAaVVWFpYWl///1VVX/ABcqq///8Kqr/wAUVVX///Cqq/8AFFVV///rqqr/ABBVVv//5qqr/wAMVVX//+aqq/8ADFVV///hqqr/AAYqq///3Kqri2mL///gKqv///nVVf//4lVV///zqqv//+JVVf//86qr///lVVZ6///oVVX//+pVVQj//+hVVf//6lVV///sVVb//+aAAP//8FVV///iqqv///BVVf//4qqr///11VZr///7VVX//91VVf//+qqr///cqqv/AADVVf//34AAkv//4lVVkv//4lVVl///5oAAnP//6qqrnP//6qqr/wAV1VX//+8qqv8AGqqr///zqqv/ABqqq///86qr/wAeqqr///mAAP8AIqqr////VVUI///qqqv///Cqq///7IAAef//7lVV///rVVX//+5VVf//61VV///1gAD//+lVVv///Kqr///nVVWH///mqqv/AAWqq3f/AA9VVf//8VVV/wAPVVX///FVVaD///iqq/8AGqqri/8AEqqri/8AEKqq/wADKqv/AA6qq/8ABlVV/wAOqqv/AAZVVf8ADVVV/wAH1VaX/wAJVVUI9wn4WRVHCg6a91j5WBUsCvs+txV0Cg51+IjiFUYKdvdLFUcKQve6FXQKDvdc+UO5FS0K+0r55hVnCg6s+LipFUkKbvdjFUoK+xL4axVnCg73XPlDuRUtCvuP+dcVcgoOrPi4qRVJCm73YxVKCvtV+GsVcwoO91z5Q7kVLQr7W/muFSUKDqz4uKkVSQpu92MVSgr7JPgzFVwKDvdc+UO5FS0K+8r7BBV2Cg6s+LipFUkKbvdjFUoKNff5FdX3OVaLNfs5BQ73JPdY+VgVLgr3UPdQFWcKDnX3TvmIFUsK6vdIFWcKDvck91j5WBUo/VjNi7r35Pggi1z75M2L7vlYSYt7+wP8IIub9wMF9/T7zBX8IIuh9y34IIsFDnX3NfjZFTr82ceLq/d7Bf8ABKqrq/8ACCqq/wAb1VX/AAuqq/8AF6qr/wALqqv/ABeqq/8ADiqq/wATqqr/ABCqq/8AD6qr/wAQqqv/AA+qq/8AEqqq/wALqqr/ABSqq/8AB6qr/wAUqqv/AAeqq/8AFVVV/wAD1VWhi6OL/wAS1VX///vVVf8ADaqr///3qqv/AA2qq///96qr/wAKKqr///TVVf8ABqqrfQj/AAaqq33/AAOqqv//8Cqr/wAAqqv//+5VVf8AAKqr///uVVWK///t1Vb///1VVf//7VVVCGX7pMeLsfenBf8AA1VV/wAZVVWM/wAYqqv///6qq6P///6qq6OF/wAVKqv///VVVf8AElVV///1VVX/ABJVVf//8Cqr/wAO1VZ2/wALVVV2/wALVVX//+OAAP8ABaqrZ4v//+1VVYt5///9gAD//+6qq4b//+6qq4Z7///5VVX///FVVf//96qrCP//8VVV///3qqv///LVVv//9iqq///0VVX///Sqq///9FVV///0qqv///Yqq3+D///zVVUIiYun91z3NouTwPs2i5z3Dk+LevsOQ4uDVgUO+9L3WPlYFS8K+0fIFWgKDvcu+GIVTAr7O/cLFW0KDvvS91j5WBUvCvcD5hVxCg73LvhiFUwK9xD3JBVgCg770vdY+VgVKP1Yk4sF///0qquD///0VVWCf4F/gYD///WAAIGAgYD///eqq///9Cqr///5VVX///NVVf//+VVV///zVVX///uqq///8qqriX2H///mqqv/AAWAAHea///xVVWa///xVVX/ABTVVf//+Kqr/wAaqquLCP8AEqqri/8AEKqq/wADKqv/AA6qq/8ABlVV/wAOqqv/AAZVVf8ADVVV/wAH1VaX/wAJVVUIfbEF///6qqv///qqq///+IAA///61VX///ZVVYb///ZVVYb///Qqq////YAAfYv//+NVVYv///Oqq/8AD6qrj/8AH1VVjf8ADKqr/wAEVVX/AAxVVf8ABqqrl/8ABqqrl/8AB9VV/wALVVWU/wAKqquU/wAKqqv/AAlVVf8ACaqq/wAJqqv/AAiqqwj/AAmqq/8ACKqr/wAI1VWSk/8ABVVVCJiL7vlYBQ73LvhiFUv8YpCLBf//9Kqrg///9IAAgv//9FVVgf//9FVVgf//9Sqr///1gACBgIGA///3gAD///Qqq4T///NVVYT///NVVf//+4AA///yqquJfYf//+aqq/8ABYAAd5r///FVVZr///FVVf8AFNVV///4qqv/ABqqq4sI/wASqquL/wAQqqr/AAMqq/8ADqqr/wAGVVX/AA6qq/8ABlVV/wANVVX/AAfVVpf/AAlVVQh9sQX///qqq///+qqr///4gAD///rVVf//9lVVhv//9lVVhv//9Cqr///9gAB9i///41VVi///86qr/wAPqquP/wAfVVWN/wAMqqv/AARVVf8ADFVV/wAGqquX/wAGqquX/wAH1VX/AAtVVZT/AAqqq5T/AAqqq/8ACVVV/wAJqqr/AAmqq/8ACKqrCP8ACaqr/wAIqqv/AAjVVZKT/wAFVVUIlYvL+GIFWvdLFU0KDvvS91j5WBUvClH3GBUlCg73LvhiFUwKDvcW91j5WBUvCvgO/IgVMAoO+w/3LvhiFUwKWvdLFU0K91D9ahVOCqb5ahVNCg4r+DL3ZBUwCqX5RBVnCg73HjoVdwq5+akVZwoOrPdY+VgVMQqy/ZoVdgoOKvdO+YgVTwpe/coVdgoOPfdY+VgVMgqy91AVYQoO91j5iBVQCsr3SBVhCg4991j5WBUyCon9mhV2Cg73WPmIFVAK+y39yhV2Cg4991j5WBUyCvcMFnUKDvdY+YgVUAr3BVsVdQoOPfdY+VgVMgr1++kVXAoO+4b3WPmIFVAKpPwIFVwKDj33Ffd7FWv7e/ggi5PH+96Lq/d494f3UZPJ+4b7Ub33+kmLUfwxOkyCSgUO9xv32BVe+9jHi8H4FevglM4rNbb3xU+LV/wBLDaBSAUO91z3WPlYFTMK97b3UBVhCg519xL34BVRCvex+AwVYQoO91z3WPlYFTMK0/2aFXYKDnX3EvfgFVEK9wv8IhV2Cg73XPdY+VgVMwr3jbcVdAoOdfcS9+AVUQr3o/d8FXQKDnX3EvfgFVEKsfgMFXUKDveU7/f2FTQKzRY1CviE+FEVcQoOm+H3exVSCscWUwr4BfgLFWAKDveU7/f2FTQKzRY1Cvel+KMVcgoOm+H3exVSCscWUwr3KfhxFXMKDveU7/f2FTQKzRY1CvgH+LIVYQrNFmEKDpvh93sVUgrHFlMK94z4cRVhCs0WYQoO+AL44ccVsveo96uLk8f7q4uv95D3vIuTx/xEiwX//86qq4ta///4gAD//89VVXz//89VVXz//9Oqq///6aqrY///4lVVY///4lVVaf//2yqrb19vX3n//8yqq4P//8VVVf//+Kqr///Kqqv/AALVVf//z4AAmP//1FVVmP//1FVV/wAUgAD//9qqq6dsCKds/wAiVVX//+gqq/8AKKqr///vVVX/ACiqq///71VVt///96qr/wAvVVWLCPhsi5PHBfuz+OAVOPzgN4sF///sqquL///rVVX/AAIqq3X/AARVVXX/AARVVf//6lVVkv//6qqr/wAJqqv//+qqq/8ACaqr///r1VX/AAxVVXiaeJr//+/VVf8AEoAA///yqquh///yqquh///2gAD/ABlVVf//+lVV/wAcqqv///pVVf8AHKqr////1Vb/ACCqqv8ABVVV/wAkqqsI/wAHVVX/ADNVVZv/ACwqq/8AGKqrsP8AGKqrsP8AHSqq/wAegAD/ACGqq6P/ACGqq6Ov/wARqqv/ACZVVf8AC1VV/wAmVVX/AAtVVf8AJNVW/wAFqqv/ACNVVYsIDvfd+dz3ohVwCvvDVRX3+IuQrgX/AAVVVf8AJ1VViv8AIdVW///4qqv/ABxVVf//+Kqr/wAcVVV//wAXKqv//+9VVZ3//+9VVZ3//+uqq/8ADSqrc/8ACFVVc/8ACFVVcf8ABCqrb4v//+aqq4v//+jVVf///IAAdoR2hP//7VVVgv//76qrgAj//++qq4B9///zqqv///RVVf//8lVV///0VVX///JVVf//9iqr///ygACD///yqqv///yqq5P///rVVf8ACoAAhJiEmP//9aqr/wAMqqv///JVVf8ADFVV///yVVX/AAxVVf//7iqr/wAKqqt1lHWU///kVVX/AASAAP//3qqriwj//96qq4v//+CAAIX//+JVVX///+JVVX///+WAAP//7yqr///oqqv//+pVVf//6Kqr///qVVX//+xVVf//5lVWe///4lVVe///4lVV///1qqv//9+AAP//+1VV///cqqv///qqq///3Kqr/wABKqr//9+AAP8AB6qr///iVVX/AAeqq///4lVV/wAMgAD//+ZVVv8AEVVV///qVVUI/wARVVX//+pVVf8AFdVW///vKqv/ABpVVX//ABpVVX//AB3VVoX/ACFVVYu3i/8AKKqr/wAJqqv/ACVVVf8AE1VV/wAlVVX/ABNVVar/ABxVVv8AGKqr/wAlVVUIjQb/AAtVVWP/ABRVVm7/AB1VVXn/AB1VVXmugv8AKKqri/8AFVVVi/8AE6qr/wABqqud/wADVVWd/wADVVWc/wAFgACb/wAHqqub/wAHqqv/AA+qq/8ACaqq/wAPVVX/AAuqq/8AD1VV/wALqqv/AA9VVv8ADoAA/wAPVVX/ABFVVQhhrQV5///oqqv//+qqq///7dVV///nVVV+///nVVV+///lVVb///mAAP//41VVi///5Kqri///6NVV/wAEqqt4/wAJVVV4/wAJVVV8/wAMgACA/wAPqquA/wAPqqv///jVVf8AElVV///8qqug///8qqug/wAAVVX/ABaAAI+jCPwlmhX/AANVVf8AGKqr/wAHVVb/ABeqqv8AC1VV/wAWqqv/AAtVVf8AFqqr/wAOVVb/ABQqqv8AEVVV/wARqqv/ABFVVf8AEaqrn5n/ABaqq/8AClVV/wAWqqv/AApVVf8AGKqq/wAFKqv/ABqqq4v/ABqqq4v/ABcqqob/ABOqq4H/ABOqq4Gb///ygAD/AAxVVXoI/wAMVVV6/wAIgAB3/wAEqqt0/wAEqqt0/wAAVVX//+eAAIdxh3H///iAAP//54AAgHSAdP//8dVVd///7qqrev//7qqrev//7Cqq///ygAD//+mqq4H//+mqq4H//+eAAIb//+VVVYsI///lVVWL///o1Vb/AAUqq///7FVV/wAKVVX//+xVVf8AClVVe5n///Oqq/8AEaqr///zqqv/ABGqq///94AA/wAUKqr///tVVf8AFqqr///7VVX/ABaqq////1VW/wAXqqr/AANVVf8AGKqrCA6a9274IBU3Cvs298wVOArW91AVYQoO+4n3EvfgFVQK92L4DBVhCg6a9274IBU3Cvs298wVOAr7D/2aFXYKDvuJ9xL34BVUCoP8IhV2Cg6a9274IBU3Cvs298wVOAq/txV0Cg77ifcS9+AVVAr3Q/d8FXQKDnX3GvcXFTkK9+H5kRVhCg77LOz3ChVVCveg+OIVYQoOdfca9xcVOQr3kvmRFWcKDvss7PcKFVUK90z44hVnCg519xr3FxVGYQX/ABSqq2f/ABqAAHH/ACBVVXv/ACBVVXv/ACUqq///9qqrtf///VVVCE9EmXwFm/8ABVVVmv8AAqqrmYv/AA1VVYv/AAxVVv///NVV/wALVVX///mqq/8AC1VV///5qqv/AARVVv//9Sqq///9VVX///Cqq////qqrg4j///lVVf//+1VV///6qqv///tVVf//+qqr///6VVb///uqqv//+VVV///8qqv///lVVf///Kqr///41Vb///2AAP//+FVV///+VVUI///4VVX///5VVf//+NVW////Kqv///lVVYtvi///56qr/wAFqqv//+tVVf8AC1VVCHhrBad9/wAeqquE/wAhVVWL/wAMqquL/wANVVX/AAGqq5n/AANVVZn/AANVVf8ADNVVkP8AC6qr/wAGqqv/AAuqq/8ABqqrlf8ACKqq/wAIVVX/AAqqq/8ACFVV/wAKqqv/AAUqq5iN/wAPVVWNl////1VV/wAKgAD///yqq5QI///8qquU///61VX/AAeAAISRhJH///eqq/8ABIAA///2VVWO///2VVWO///11Vb/AAGAAP//9VVVi3+L///1VVX///2qq///9qqr///7VVUIio2zugX/ABtVVf8AAVVV/wAaqqv/AAVVVqX/AAlVVaX/AAlVVf8AF9VVmP8AFaqr/wAQqqv/ABWqq/8AEKqr/wASKqr/ABRVVf8ADqqro/8ADqqro/8ACVVV/wAbVVWP/wAeqqv/AASqq/8AIVVV///+qqr/ABuqq///+Kqrof//+Kqrof//9Kqq/wASKqv///Cqq/8ADlVVCP//8Kqr/wAOVVV5/wALgAD//+tVVf8ACKqr///rVVX/AAiqq///6tVW/wAH1VX//+pVVZL//+pVVZL//+qqq5J2knaS///t1VWU///wqquW///wqquW///0KqqZ///3qquc///3qquc///91VX/ABXVVY//ABqqqwj/AANVVf8AFqqr/wAHKqv/ABOqqpb/ABCqq5b/ABCqq/8ADYAA/wAN1VWblpuWnf8ACFVVn/8ABaqrn/8ABaqr/wAUqqv/AALVVf8AFVVVi/8AO1VVi/8AKqqr///oqqul///RVVUIyrQF///sqqur///m1VX/ABbVVWz/AA2qq2z/AA2qq///3Sqr/wAG1VX//9lVVYtti///4qqr///71VX//+NVVf//96qr///jVVX///eqq3H///Oqqv//6Kqr///vqqv//+iqq///76qr///sgAD//+uqqv//8FVV///nqqv///BVVf//56qr///11Vb//+Qqqv//+1VV///gqqsI///7VVX//96qq/8AAVVWb/8AB1VV///pVVX/AAdVVf//6VVV/wALKqv//+0qq5p8mnz/ABHVVf//89VV/wAUqqv///aqq/8AFKqr///2qqv/ABUqqv//96qq/wAVqqv///iqq/8AFaqr///4qqv/ABVVVf//+KqqoP//+KqroP//+Kqr/wASVVX///cqqv8AD6qr///1qqsI/wAPqqv///Wqq/8AC9VV///y1VWTe5N7/wACVVX//+uqq////Kqr///nVVX///yqq///6qqrhP//7NVV///1VVV6///1VVV6///yqqv///GAAHt/e3///+3VVf//9qqr///rqqv///lVVf//66qr///5VVX//+rVVf///KqrdYsIZ4v//+GAAP8AB1VVcv8ADqqrcv8ADqqr///s1VX/ABZVVf//8qqrqQgO+yzs9woVUWcF/wAMqqtt/wATqqr//+mAAP8AGqqrfP8AGqqrfP8AH1VV///3gACviQhJPpl8BZv/AAVVVZr/AAKqq5mL/wANVVWL/wAMVVb///zVVf8AC1VV///5qqv/AAtVVf//+aqr/wAEVVb///Uqqv///VVV///wqqv///6qq4OI///5VVX///tVVf//+qqr///7VVX///qqq///+lVW///7qqr///lVVf///Kqr///5VVX///yqq///+NVW///9gAD///hVVf///lVVCP//+FVV///+VVX///jVVv///yqr///5VVWLb4v//+eqq/8ABaqr///rVVX/AAtVVQh4awWnff8AHqqrhP8AIVVVi/8ADKqri/8ADVVV/wABqquZ/wADVVWZ/wADVVX/AAzVVZD/AAuqq/8ABqqr/wALqqv/AAaqq5X/AAiqqv8ACFVV/wAKqqv/AAhVVf8ACqqr/wAFKquYjf8AD1VVjZf///9VVf8ACoAA///8qquUCP///KqrlP//+tVV/wAHgACEkYSR///3qqv/AASAAP//9lVVjv//9lVVjv//9dVW/wABgAD///VVVYt/i///9VVV///9qqv///aqq///+1VVCIqNucAFn/8AAVVV/wATgACPnv8ABqqrnv8ABqqr/wARKqv/AAlVVf8AD1VVl/8AD1VVl/8ADNVW/wAOgAD/AApVVZz/AApVVZz/AAbVVv8AE4AA/wADVVWhj/8AH1VV///8gAD/ABgqq4CcgJx8mHiUCHiUdv8ABoAAdI90j///6qqr/wAE1VX//+xVVf8ABaqr///sVVX/AAWqq///8Cqr/wAH1VV/lX+V///7VVX/AA9VVf8AAqqr/wAUqquNl/8ABKqr/wAKqqv/AAdVVf8ACVVV/wAHVVX/AAlVVZT/AAeqq/8ACqqrkQj/AAqqq5H/AAtVVf8ABKqrl/8AA1VVl/8AA1VV/wALVVX/AAGqq/8ACqqri6eL/wAVVVX///qAAP8ADqqrgP8ADqqrgP8AC6qq///v1VX/AAiqq///6qqrCMarBf//9Kqrqf//7YAAof//5lVVmf//5lVVmf//4CqrkmWL///sqquL///sqqr///1VVf//7Kqr///6qqv//+yqq///+qqref//99VV///vVVWA///vVVWA///x1Vb///Iqq///9FVV///vVVX///RVVf//71VV///4gAD//+xVVv///Kqr///pVVUI///8qqt1/wABVVX//+3VVZH///Gqq5H///Gqq/8ACNVV///0Kqr/AAuqq///9qqr/wALqqv///aqq/8ADaqq///4qqr/AA+qq///+qqr/wAPqqv///qqq/8AECqq///7gAD/ABCqq////FVV/wAQqqv///xVVf8AECqq///8Kqv/AA+qq4f/AA+qq4f/AA3VVYaXhQiXhf8ACSqr///4Kqv/AAZVVf//9lVV/wAGVVX///ZVVf8AAiqr///zKquJe4n///Kqq///+yqr///0Kqr///hVVf//9aqr///4VVX///Wqq///9qqr///3KqqA///4qquA///4qqv///PVVf//+lVV///yqquH///yqquHfon///NVVYsIb4v//+bVVf8ABoAA///pqquY///pqquY///wKqr/ABLVVf//9qqr/wAYqqsIDnX3GvcXFTkK9675ARV0Cg77LOz3ChVVCvd4+FIVdAoOh/ft+RwVOgr3Jv1eFXYKDvuJ9//4LBVWCjj8bhV2Cg6H9+35HBU6Cvfa8xV0Cg77iff/+CwVVgr3JvfAFXUKDof4pPgyFZG7+yqLpvdO94aLk8f8uouDT/eGi3D7Tvsoi4Vb9yiLUfwyzYvF+DIFDvuJ9933qRWSu/sJi5fe9xiLksH7GIue9xlPi3j7GSeLhFXvi384NIuEWwXii3T7PgX///1VVf//71VV////1Vb///CAAP8AAlVV///xqqv/AAJVVf//8aqr/wAFKqv///OAAJP///VVVZP///VVVf8ACyqr///3gAD/AA5VVf//+aqr/wAOVVX///mqq/8AEdVW///81VX/ABVVVYv/AAtVVYv/AA0qq/8AAaqrmv8AA1VVmv8AA1VV/wANgAD/AAOqq5ePCI7BBf//9Kqr///7VVX///Qqqv///Cqr///zqquI///zqquI///0Kqr///6AAP//9Kqri3eL///xKqv/AAWqq///9lVV/wALVVX///ZVVf8AC1VV///81Vab/wADVVX/ABSqqwii9z4FDvX5EvejFTsK++v4hhVoCg51+H33FhVXCvuz+FcVbQoO9fkS96MVOwpY+KQVcQoOdfh99xYVVwqQ+HAVYAoO9fkS96MVOwr7pvj2FXIKDnX4ffcWFVcK+2v41hVzCg71+RL3oxU7Cvuj+MoVaQr3KhZqCg51+H33FhVXCvtq+JsVbgr3KhZvCg71+RL3oxU7CvtP+QUVYQrNFmEKDnX4ffcWFVcK+xb41hVhCs0WYQoO9fg0+0sVfbEF///6qqv///qqq///+IAA///61VX///ZVVYb///ZVVYb///Qqq////YAAfYv//+NVVYv///Oqq/8AD6qrj/8AH1VV/wADVVX/ABSqq/8ACIAA/wATgAD/AA2qq/8AElVV/wANqqv/ABJVVf8ADoAA/wAPgAD/AA9VVf8ADKqrtY//ACRVVf8ACqqr/wAeqqv/ABFVVQj/AB6qq/8AEVVV/wAZ1VX/ABWqq6CloKX/ABCAAP8AHVVVl/8AIKqrl/8AIKqr/wAIqqut/wAFVVX/ACNVVQjI+ElJi1D8OAX///yqq///5qqrhXD///dVVf//41VV///3VVX//+NVVX7//+VVVv//7qqr///nVVX//+6qq///51VV///pgAD//+uqq///5FVVe///5FVVe///3dVWg///11VVi///1qqri2uT///pVVWb///pVVWb///vgAD/ABRVVf//9aqr/wAYqqsI///1qqv/ABiqq///+qqq/wAaqqr///+qq/8AHKqr////qqv/AByqq/8AAYAApv8AA1VV/wAZVVUIxvg4SYtO/EkF///6qqv//9qqq////yqq///cVVX/AAOqq2n/AAOqq2n/AAmqqv//4dVV/wAPqqv//+Wqq/8AD6qr///lqqv/ABZVVf//6qqqqP//76qrqP//76qr/wAlgAD///cqqrn///6qq///7Kqr///wqqv//+5VVf//7oAAe///7FVVe///7FVV///2VVX//+qAAP///Kqr///oqqsIh///5qqr/wAFqqt3/wAPVVX///FVVf8AD1VV///xVVWg///4qqv/ABqqq4v/ABKqq4v/ABCqqv8AAyqr/wAOqqv/AAZVVf8ADqqr/wAGVVX/AA1VVf8AB9VWl/8ACVVVCA51+HP7SxV9sQX///qqq///+qqr///4gAD///rVVf//9lVVhv//9lVVhv//9Cqr///9gAB9i///41VVi///86qr/wAPqquP/wAfVVWN/wAMqqv/AARVVf8ADFVV/wAGqquX/wAGqquX/wAH1VX/AAtVVZT/AAqqq5T/AAqqq/8ACVVV/wAJqqr/AAmqq/8ACKqrCP8ACaqr/wAIqqv/AAjVVZKT/wAFVVUImgb/AACqq5H/AADVVf8ACIAAjJaMloz/AAvVVYz/AAyqq4z/AAyqq/8AASqr/wAMgAD/AAFVVf8ADFVV/wABVVX/AAxVVf8AAVVW/wAKgAD/AAFVVf8ACKqrCLn34E+La/t7Bf//+1VVa///99VW///kKqv///RVVf//6FVV///0VVX//+hVVf//8dVW///sVVb//+9VVf//8FVV///vVVX///BVVf//7VVW///0VVb//+tVVf//+FVV///rVVX///hVVf//6qqr///8Kqt1i3OL///tKqv/AAQqq///8lVV/wAIVVX///JVVf8ACFVV///11Vb/AAsqq///+VVVmQj///lVVZn///xVVv8AD9VV////VVX/ABGqq////1VV/wARqquM/wASKqr/AAKqq/8AEqqrCLH3pE+LZfunBf///Kqr///mqquK///nVVX/AAFVVXP/AAFVVXP/AAXVVv//6tVV/wAKVVX//+2qq/8AClVV///tqqv/AA/VVv//8Sqq/wAVVVX///Sqq/8AFVVV///0qqv/AByqq///+lVVr4v/ABKqq4ud/wACgAD/ABFVVZD/ABFVVZCb/wAGqqv/AA6qq/8ACFVVCP8ADqqr/wAIVVX/AA0qqv8ACdVW/wALqqv/AAtVVf8AC6qr/wALVVX/AAnVVZeT/wAMqqsIjgb/AAFVVf//+1VV////gAD///Wqq////aqre////aqre////iqq///vVVX///6qq///7qqr///0qquD///0VVWCf4F/gYD///WAAIGAgYD///eAAP//9CqrhP//81VVhP//81VV///7gAD///Kqq4l9CIf//+aqq/8ABaqrd/8AD1VV///xVVX/AA9VVf//8VVVoP//+Kqr/wAaqquL/wASqquL/wAQqqr/AAMqq/8ADqqr/wAGVVX/AA6qq/8ABlVV/wANVVX/AAfVVpf/AAlVVQgO+ALz+VgVPAr4GvdQFWcKDvcS2vhiFVgK96T3ihVnCg6H97z3xRU9Cvew91AVZwoO+wf3UfsjFVkK9wT55xVnCg6H97z3xRU9Cvc99xgVJQr3UhYlCg51qb8VPgpB94wVYQoO+yyrrxVaCo/3wBVhCg51qb8VPgr7OPdUFSUKDvssq68VWgo194gVXAoOdam/FT4K+wTzFXQKDvssq68VWgpn9zAVdAoOUfhT+AcVkbv7AIu+9zEFk/8AGKqr/wALqqv/ABUqqv8AD1VV/wARqqv/AA9VVf8AEaqr/wAUVVb/AAjVVf8AGVVVi/8ACqqri5WJ/wAJVVWH/wAJVVWH/wAIVVaG/wAHVVWFCLG4BXOf///jqquV///fVVWL///oqquL///rVVX///uqq3n///dVVXn///dVVf//8IAA///0qqt+fX59gP//8Cqrgv//7lVVgv//7lVV///4gAD//+6AAIX//+6qqwhY+y77CYuFW/cAi/sG+/IF///0qqtn///y1VX//+SAAHx4fHj//+sqq///9oAA///lVVWL///2qquLgv8AAVVV///3VVX/AAKqq///91VV/wACqquD/wAEVVX///iqq5EIaFwF/wAJVVX///aqq/8ACyqr///5qqqY///8qquY///8qqv/AA2AAP///lVVmYv/ACtVVYv/ACJVVpb/ABlVVaH/ABlVVaH/ABNVVv8AHlVV/wANVVX/ACaqqwj3E/gbBQ519xr3FxU5CvcC+1kVdgoO+yzs9woVVQrg+0wVdgoOh/ft+RwVOgr3Jv1eFXYKDvuJ9//4LBVWCjj8bhV2Cg73HjoVdwoO90z5WBVnCg73fPjIFXQKDvfl+PIVYAoO9wn5WBVzCg73OvkgFVwKDvcK+R0Vbgr3KhZvCg73NftLFX2xBf//+qqr///6qqv///iAAP//+tVV///2VVWG///2VVWG///0Kqv///2AAH2L///jVVWL///zqqv/AA+qq4//AB9VVY3/AAyqq/8ABFVV/wAMgAD/AAaqq/8ADFVV/wAGqqv/AAxVVf8AB6qq/wALVVb/AAiqq/8AClVV/wAIqqv/AApVVf8ACVVV/wAJgACV/wAIqqsIlf8ACKqrlJKT/wAFVVUIXgb///Sqq4P///RVVf//9yqrf///9lVVf///9lVVgP//9YAAgf//9Kqrgf//9Kqr///3qqt////5VVX///NVVf//+VVV///zVVX///uqq///8qqriX2H///mqqv/AAWAAHea///xVVWa///xVVX/ABTVVf//+Kqr/wAaqquLCP8AEqqri/8AEKqq/wADKqv/AA6qq/8ABlVV/wAOqqv/AAZVVf8ADVVV/wAH1VaX/wAJVVUIDrj42RVtCg73VPlYFWEKzRZhCg7nmhZ4CqVIFfcn/Nv8W4sFDvc6+EYWeQoOdfh99xYVYgoOfPihlBWQrwX///lVVYn///mAAP///lVV///5qqv///6qq///+aqr///+qqv///oqqv///1VV///6qquL///1VVWLg/8AAaqr///6qqv/AANVVf//+qqr/wADVVX///xVVf8ABFVWif8ABVVVif8ABVVViv8ABlVWi/8AB1VVi/8AB1VV/wAAqqv/AAeqq/8AAVVVkwi499HXi5G6/HaLhVzRi1H8M7+Lxfgz93yLX/vKBYn///FVVf///oAAfYr///Kqq4r///Kqq/8AAVVV///0Kqr/AAOqq///9aqr/wADqqv///Wqq/8ABlVV///31VWUhZSF/wANgACInYv/AAtVVYv/AAoqq/8AAVVVlP8AAqqrlP8AAqqr/wAJ1VX/AAOqqv8ACqqr/wAEqqsIDj2w95wVg1X4iIuTwQUO+Dqw95wVg1X6fIuTwQUO+9L3Xfh0Fev3eE+L+wD7eAUO+9L3dPlYFXoKDvvS9x3lFXoKDlH3ifh0FXsK94sWewoOUfhN+VgVegr7ixZ6Cg5R9/blFXoK+4sWegoOUfe6+GEVOfzfx4vd+N/3VIuSu/tUi6f3W0+Lb/tb+1SLhFsFDlH3hNQVb/tbx4un91v3VIuSu/tUi7r36PdUi5K7+1SLp/dbT4tv+1v7VIuEWwX3VItc++j7VIuEWwUOPfcO9/YV///8qqv//+dVVf8AAVVVdJH//+qqq5H//+qqq5X//+1VVZl7mXuc///zVVWf///2qquf///2qqv/ABZVVf//+1VV/wAYqquL/wAYqquL/wAXqqr/AASqq/8AFqqr/wAJVVX/ABaqq/8ACVVV/wAUgAD/AAyqq/8AElVVmwj/ABJVVZv/AA9VVv8AEqqr/wAMVVX/ABVVVf8ADFVV/wAVVVX/AAfVVqL/AANVVf8AGKqr/wADVVX/ABiqq////qqrooX/ABVVVYX/ABVVVYH/ABKqq32bfZt6/wAMqqt3/wAJVVV3/wAJVVX//+mqq/8ABKqr///nVVWLCP//51VVi///6FVW///7VVX//+lVVf//9qqr///pVVX///aqq///64AA///zVVX//+2qq3v//+2qq3v///Cqqv//7VVV///zqqv//+qqq///86qr///qqqv///gqqnT///yqq///51VVCA74OvcQtRUhCvfhFiEK9+EWIQoO+Cf5Bvl6FSMK++v80RV8CrsWfQr3uxZ8CrsWfQr89/g+Ff///Kqr///qqqv/AAEqqv//7Cqq/wAFqqv//+2qq/8ABaqr///tqqv/AAjVVf//79VVl32Xff8ADqqrgP8AEVVVg/8AEVVVg/8AE1VWh/8AFVVVi/8AFKqri/8AFCqqj/8AE6qrk/8AE6qrk/8AEdVVlpuZCJuZ/wANKqv/ABAqq/8AClVV/wASVVX/AApVVf8AElVV/wAG1Vb/ABPVVv8AA1VV/wAVVVX/AAKqq/8AFKqr///+qqr/ABOqqv//+qqr/wASqqv///qqq/8AEqqr///3gAD/ABBVVf//9FVVmf//9FVVmf//8VVWlv//7lVVk///7lVVk///7NVWj///61VViwj//+qqq4v//+uAAIf//+xVVYP//+xVVYP//+5VVoD///BVVX3///BVVX3///Kqq///76qrgP//7VVVgP//7VVV///5Kqv//+xVVv///VVV///rVVUIuxaN/wAOqqv/AASqq/8ADaqq/wAHVVX/AAyqq/8AB1VV/wAMqqv/AAkqq5aW/wAJVVWW/wAJVVX/AAwqq/8AB4AA/wANVVX/AAWqq/8ADVVV/wAFqquZ/wAC1VX/AA6qq4v/AB1VVYv/ABdVVv//9dVV/wARVVX//+uqq/8AEVVV///rqqv/AAaqq///5yqqh///4qqrCIn///FVVf//+1VV///yVVb///iqq///81VV///4qqv///NVVf//9tVV///01VaA///2VVWA///2VVX///PVVf//+IAA///yqqv///qqq///8qqr///6qqt9///9VVX///FVVYv//+Kqq4v//+iqqv8ACiqr///uqqv/ABRVVf//7qqr/wAUVVX///lVVf8AGNVWj/8AHVVVCA77m+v3gRVfCg77m/ex94EVZAoO/C74Hfl6FfzE/YC0b/jF+YAFDvsA+Jj5HRWiwgX///VVVf8ABVVV///x1Vb/AASqq///7lVVj///7lVVj///7IAAjf//6qqri0uL///H1VX//+qAAP//z6qrYP//z6qrYP//2YAA//+91VX//+NVVf//pqqrCFeLelvGiwX///yqq///9qqr///9VVX///WAAIn///RVVYn///RVVf///lVV///1gAD///6qq///9qqr///+qqv///iqq////qqq///3Kqr///6qq///9aqr///+qqv///Wqq////6qq///3Kqr/AACqq///+KqrCFuLeFvKiwWL///ZVVWP///cgACT///fqquT///fqqv/AAxVVW//ABCqq///6FVV/wAQqqv//+hVVf8AFKqq///tqqv/ABiqq37/ABiqq37/AB1VVf//+YAArYuni6OOn5Gfkf8AEFVV/wAGqqv/AAyqq/8AB1VVCIfEBf//8qqr///4qqv///Eqqv//+aqq///vqqv///qqq///76qr///6qqv//+0qqv///VVV///qqquLXYv//9uqq/8AEiqr///lVVX/ACRVVf//5VVV/wAkVVX///NVVv8AMoAA/wABVVX/AECqqwj3S4udu/tciwX/AACqq/8AB1VV/wAA1VX/AAjVVoz/AApVVYz/AApVVf8AASqr/wAI1Vb/AAFVVf8AB1VV/wABVVWV/wABqqv/AArVVY3/AAuqq43/AAuqq/8AAqqr/wAKKqr/AANVVf8ACKqrCPdui567+3OLBf8AFVVVz/8AHIAA/wAzVVX/ACOqq/8AIqqr/wAjqqv/ACKqq/8AKNVV/wARVVW5i5+LnP///iqrmf///FVVmf///FVVlv//+9VWk///+1VVCA49+DC1FXyjBf//7qqrf///76qq///3VVX///Cqq///+qqr///wqqv///qqq///8aqq///9VVX///Kqq4v///aqq4v///bVVf8AAVVVgv8AAqqrgv8AAqqrg/8ABNVVhJKEkv//+tVV/wAJgAD///yqq5f///yqq5f///+qqv8AD1VV/wACqqv/ABKqqwig9ywF/wBAqqvF/wAyVVX/ADbVVa//ADOqq6//ADOqq/8AFaqr/wAygAD/AAdVVf8AMVVV/wAFVVWx///6gAD/AB3VVf//76qr/wAVqqv//++qq/8AFaqr///ogAD/AArVVf//4VVVi///7qqri///71VV///8VVV7///4qqt7///4qqv///GAAIB+///xVVUIfv//8VVV///01VX//+4qq///9qqrdv//9qqrdv//+VVV///oKquH///lVVUIZ/uZKzmcb9TPefsVBYVh/wAG1VX//+Eqq/8AE6qr///sVVX/ABOqq///7FVV/wAbgAD///Yqq/8AI1VVi6GLof8ABFVVof8ACKqrof8ACKqroP8ADFVVn5sIm/i2Ff//+qqr///Yqqv//++AAP//1Sqq///kVVX//9Gqq///5FVV///Rqqv//9nVVv//0NVV///PVVVbCK33gwWRtf8ACyqr/wAe1VX/ABBVVf8AE6qr/wAQVVX/ABOqq/8AENVW/wAJ1VX/ABFVVYv/ABFVVYuY///31VX/AAiqq///76qr/wAIqqv//++qq/8AAlVV///p1VWHbwgO+DD3yfkoFVj8AMGLvvgA9xmLkrv71IuEWwX4JbsVUfwwwYu+9/2Ni+b7/auL91X3/Y2LWPv9wYvF+DA4i/tD+9w399wFDvc6+EYWeQoOPfcx95cV+CgGi/8AKKqr///5qqv/ACUqqv//81VV/wAhqqv///NVVf8AIaqr///uVVao///pVVX/ABhVVf//6VVV/wAYVVX//+TVVp7//+BVVf8ADaqr///gVVX/AA2qq///3NVW/wAG1VX//9lVVYv//9iqq4v//9yAAP//+NVV///gVVX///Gqq///4FVV///xqqv//+TVVv//7IAA///pVVX//+dVVQj//+lVVf//51VV///uqqv//+LVVn///95VVX///95VVYX//9vVVov//9lVVYv//9lVVZFnl///3qqrl///3qqr/wARVVX//+LVVf8AFqqrcv8AFqqrcv8AGyqq///sVVX/AB+qq///8aqr/wAfqqv///Gqq/8AI4AA///41VX/ACdVVYsIpYv/ABeqq/8AAoAA/wAVVVWQ/wAVVVWQ/wAT1VaT/wASVVWW/wASVVWWnJn/AA+qq5z/AA+qq5z/AA+AAP8AFIAA/wAPVVWjCGigBf//5qqrYW///+GAAP//4VVVeP//4VVVeP//26qr///2gABhi///xqqri///z6qq/wATqqv//9iqq/8AJ1VVCPe3920V+7f3JQazs7ufw4vDi7x3tWMIDjn4jvf/Ff8ABVVV/wAmqqv/AAHVVv8AKIAA///+VVX/ACpVVf///lVV/wAqVVX///hVVv8AJqqr///yVVWu///yVVWudv8AHNVV///jqqv/ABaqq///46qr/wAWqqv//9nVVf8AC1VVW4v//+NVVYv//+VVVob//+dVVYH//+dVVYH//+eqq///8aqrc///7VVVCKlgBf8AE1VV/wANVVX/ABKqq5ad/wAIqqud/wAIqqv/ABSqq/8ABFVV/wAXVVWL/wAiqquL/wAbgACC/wAUVVV5/wAUVVV5/wAPKqv//+lVVZX//+Sqq5X//+Sqq/8ABaqr///igAD/AAFVVf//4FVV/wABVVX//+BVVf///qqr///iKquHbwj///6qq///91VV///+gAD///dVVv///lVV///3VVX///5VVf//91VV///+gAD///dVVv///qqr///3VVX//+9VVf8AGVVV///qVVb/ABRVVv//5VVV/wAPVVX//+VVVf8AD1VV///iVVb/AAeqq///31VVi///4VVVi///49VW///6VVX//+ZVVf//9Kqr///mVVX///Sqq///6YAA///wqqr//+yqq///7KqrCP//7Kqr///sqqv///Aqqv//6VVV///zqqtx///zqqtx///31VX//+Sqq4f//+NVVYf//+Kqq/8AAKqr///j1VX/AAVVVXD/AAVVVXD/AAmqq///6Cqrmf//61VVmf//61VV/wASgAD//++AAKL///Oqq6L///Oqq/8AGyqr///51VX/AB9VVYsIq4v/AByqq/8ABdVV/wAZVVX/AAuqq/8AGVVV/wALqqv/ABZVVv8AD6qq/wATVVX/ABOqq/8AE1VV/wATqqv/ABDVVv8AFqqq/wAOVVX/ABmqq/8ADlVV/wAZqquX/wAaqqr/AAmqq/8AG6qr/wAJqqv/ABuqq5P/ABvVVf8ABlVVp/8ABlVVp/8ABNVW/wAaVVX/AANVVf8AGKqrCDo2Ff//+1VV///oqquE///mqqr///aqq///5Kqr///2qqv//+Sqq///86qq///mVVX///Cqq3P///Cqq3P//+2AAHf//+pVVXv//+pVVXv//+bVVoP//+NVVYv//+lVVYv//+zVVpD///BVVZX///BVVZX///Oqq/8ADSqrgv8AEFVVCIL/ABBVVYX/ABIqq4ifiJ/////VVZ//AAKqq5//AAKqq/8AFKqr/wAFqqqf/wAIqqv/ABNVVf8ACKqr/wATVVWWnP8ADVVV/wAOqqv/AA1VVf8ADqqr/wAP1Vb/AAuqqv8AElVV/wAIqqv/ABJVVf8ACKqr/wAUgAD/AARVVf8AFqqriwiri6f///bVVaP//+2qq6P//+2qq/8AE6qr///q1VX/AA9VVXMIDueaFngKpUgV9yf82/xbiwUO9xn40/tqFc36fPzO/nzN+j74SgYOpaT7ahX4vcj8bQb33PhO+8n4R/hOi4vJ/KOLi1P3z/xN+938VAUO4/cP99sVJgoO/C73tfl6Ffxc/YC4b/hd+YAFDvvS9xL30hVcCg4297j7ahX3Zvp8TIv7Uf4o+zL34Cdbo1m5ofc4++gFDvc3+VD3kBWL/wAUqqv///yqq/8AE1VV///5VVWd///5VVWd///2VVb/AA+AAP//81VVmP//81VVmHz/AAoqq///7qqr/wAHVVX//+6qq/8AB1VV///sqqr/AAOqq///6qqri3eL///tgAD///yAAHqEeoR7gnyACHyA///xqqv///PVVf//8lVV///yqqv///JVVf//8qqr///ygAB+///yqqv///NVVf//8qqr/wAMqqv///Iqqv8ADNVV///xqquY///xqquYfJf///BVVZb///BVVZb//+9VVpT//+5VVZL//+5VVZL//+2AAP8AA4AA///sqquLCP//6qqri///7NVV///8Kqt6///4VVV6///4VVX///GAAP//9VVWf///8lVVf///8lVV///21VX///Aqq///+aqref//+aqref///NVVeIt3i///61VV/wADVVX//+zVVv8ABqqr///uVVX/AAaqq///7lVV/wAJgAD///Cqq/8ADFVVfgj/AAxVVX7/AA6qq///9dVVnP//+KqrnP//+Kqr/wATKqv///xVVf8AFVVVi5+L/wASgAD/AANVVZz/AAaqq5z/AAaqq5v/AAiAAJr/AApVVZr/AApVVf8ADoAA/wALgACZ/wAMqquZ/wAMqqv/AA5VVf8ADFVV/wAOqquXCP8ADKqr///zVVX/AA1VVf//81VWmf//81VVmf//81VV/wAO1VX///SAAP8AD6qr///1qqv/AA+qq///9aqr/wAQgAD///eqqv8AEVVV///5qqv/ABFVVf//+aqr/wASVVb///zVVf8AE1VVi/8AFVVVi/8AE1VW/wAD1VX/ABFVVf8AB6qr/wARVVX/AAeqq/8ADqqr/wAKgACX/wANVVUIl/8ADVVV/wAJVVX/AA+qq/8ABqqrnf8ABqqrnf8AA1VV/wATVVWL/wAUqqsIUogVi///51VVhP//61VWff//71VVff//71VV///sVVX///eqq///5qqri///8Kqri///8YAA/wACqqv///JVVf8ABVVV///yVVX/AAVVVf//8qqrkn7/AAiqq37/AAiqq///86qr/wAJVVX///RVVZX///RVVZX///TVVv8ACaqr///1VVX/AAlVVQiV/wAIqquW/wAJqqqX/wAKqquX/wAKqqv/AAxVVf8ACiqq/wAMqqv/AAmqq/8ADKqr/wAJqqv/AA0qqpP/AA2qq/8ABlVV/wANqqv/AAZVVf8ADdVV/wADKquZi6eL/wAU1VWC/wANqqt5/wANqqt5/wAG1VX//+pVVYv//+aqqwj7yhb///aqq///91VV///1VVX///aAAH////Wqq3////Wqq///84AA///2gAB+///3VVV+///3VVX///Kqq///+NVW///yVVX///pVVf//8lVV///6VVX///Iqq////SqrfYv//+VVVYv//+tVVv8ACFVV///xVVX/ABCqq///8VVV/wAQqqv///iqq6CL/wAZVVUIi5f/AAHVVf8AC1VV/wADqqv/AAqqq/8AA6qr/wAKqqv/AAUqqv8ACYAA/wAGqqv/AAhVVf8ABqqr/wAIVVX/AAhVVf8ABqqrlZCVkP8AC1VV/wACgAD/AAyqq4uZi5n///zVVZn///mqq5n///mqq/8ADdVV///4Kqr/AA2qq///9qqrCP8ADaqr///2qqv/AAzVVf//9iqql///9aqrl///9aqrlv//9oAAlf//91VVCA5o+Cr5dBWL/wAJVVX///3VVf8AB9VW///7qqv/AAZVVf//+6qr/wAGVVX///pVVf8ABSqrhI+Ej///+FVV/wAC1VX///eqq/8AAaqr///3qqv/AAGqq///+Cqq/wAA1VX///iqq4v//+iqq4v//+zVVf//+yqrfP//9lVVfP//9lVVf///8yqrgnsIgnv///mqq3n///xVVXf///xVVXf///2qq///64AAinaKdv///9VV///rgAD/AACqq3f/AACqq3f/AABVVf//7lVVi///8KqrCIv8g4p2i///4IAABYt6////Kqt5///+VVV4///+VVV4///81VZ6///7VVV8///7VVV8///5VVb///iAAP//91VVi4eL///8qquN///9VVWP///9VVWP///9Kqv/AARVVYj/AASqq4j/AASqq////Cqr/wAEVVX///tVVY8I///7VVWP///5VVaN///3VVWL///2qquL///4KqqI///5qquF///5qquF///81VX///hVVYv///aqq4v//+9VVf8ABoAAf5j///iqq5j///iqq/8ADYAA///8VVWZi6uL/wAYVVX/AAmAAP8AEKqrngj/ABCqq56X/wAXKqv/AAdVVf8AG1VV/wAHVVX/ABtVVY//AByAAP8AAKqr/wAdqqv/AACqq/8AHaqr/wAAVVX/ABmAAIv/ABVVVQj4jAeL/wADVVX////VVZL///+qq/8ACqqr////qqv/AAqqq////6qq/wAMgAD///+qq/8ADlVV////qqv/AA5VVf8AAFVV/wAO1VaM/wAPVVWM/wAPVVX/AAGqq/8ADiqr/wACVVWY/wACVVWY/wADgAD/AArVVf8ABKqr/wAIqqv/AASqq/8ACKqr/wAGVVX/AARVVZOLCP8ABKqri/8AA6qq///91VX/AAKqq///+6qr/wACqqv///uqq/8AAtVV///7VVWOho6G/wAD1VX///uAAP8ABKqrh/8ABKqrh5KJ/wAJVVWL/wAKqquL/wAI1VX/AALVVZL/AAWqq5L/AAWqq/8AA4AA/wAIgACL/wALVVUIDuP5GPghFX4Kc/s/FX4KDuP3y/cSFfewi5K7+5eL6/ci90uLkrv7Movd9w9loSr7Jfuri4Rb95GLLPsi+0aLBYRb9y2LOvsNsnYFDuPklxX4fouSuvx+iwWt94YV+GT7TJK+/Cz3NPhZ9zWTv/yY+0wFDuPz9wkV+Jj3TJPD/GT3TINX+C37Nfxa+zQFdfswFfh+i5K6/H6LBQ6a99toFfc/+Bv7P/gbTIv7Pfwb9z38GwWr+WAV9x372fsd+9n7HPfZBQ73r/mEFT8KDve3+hQVYQoO92b6FBVnCg73lvmEFXQKDtP5lRVoCg7q+dwVJQr3UhYlCg74APmzFXEKDvch+gUVcgoO9yT52RVpCvcqFmoKDvdu+hQVYQrNFmEKDvdV+dwVJQoO91P5WBV1Cg7dSRV2Cg73bvjmFdX3OVaLNfs5BQ5J93L3CRXDzlMGjr0VIAr3g/tdFfww+P34MAa9vhX8lP1i+JQGDlD4RfhiFUwKWvdLFU0K+6X7gRVICg5Q9z/4LBVICvgk9/AVUAoO94QU+NYVeZ34Ypf3fp2piwb7hJcHiwwKHAAcEwBfAgABAYUCQAJKAlYCYQMcAyUDPANEBUQGTgcIBygJMglSCVwKWQp+Co4KrgwiDP4NwA6WD5sTUhNmFPEVHRU3FVEVXBdhGGEZXRtUHP8d+x/9IMshayOjJUcm9Cb+J8kovijfKOkrGiyeLaIvADIiM0M1dDWgNqg2wjd1OCg5rDsoOzk7QjtOPU89YD1xPYo9lj2pP3ZAskFtQjNDSETyRm5HLUfjR+xIe0kaSS1JN0lBShxKJ0zzTP5NCU5lT5RRdbkGi/8AIqqrjaOP/wANVVWP/wAMqqv/AA5VVf8AEVVV/wAYqquh/wAZVVX/ABdVVf8AENVW/wAUgAD/AAhVVf8AEaqr/wAIVVX/ABGqq/8ABCqr/wATgACL/wAVVVWLs///9FVV/wAf1VX//+iqq/8AF6qr///oqqv/ABeqq///4lVV/wAL1VVniwhni///4aqr///1Kqv//+dVVf//6lVV///nVVX//+pVVf//8VVW///dKqv///tVVVsIvYMFj63/AAmAAP8AGFVVmv8ADqqrmv8ADqqr/wAR1VX/AAdVVf8AFKqri/8AFKqri/8AEdVV///31VWa///vqqua///vqqv/AAeAAP//69VVi3OLf4j///Qqq4X///RVVYX///RVVf//8lVV///wKqv//+qqq3cI///0qqv///Sqq///9qqq///1gAD///iqq///9lVV///4qqv///ZVVYX///bVVv//+1VV///3VVX///dVVf//71VV///7qqtwi///2qqrCAv///6qq///8qqr/wADVVX///SqqpP///aqq5P///aqq/8ACqqr///7VVX/AA1VVYv/AA1VVYuX/wAEqqv/AAqqq/8ACVVV/wAKqqv/AAlVVZH/AAtVVv8AAVVV/wANVVWN/wANVVWI/wALVVaD/wAJVVWD/wAJVVX///VVVf8ABKqr///yqquLCP//8qqri3////tVVf//9VVV///2qqv///VVVf//9qqr///5qqv///Sqqon///KqqwgLa/t4x4ur93gFC/zF/YC0b/jG+YAFCyn7eMaL9wH3eAULif//8qqrjv//9Kqqk///9qqrk///9qqr/wAKqqv///tVVf8ADVVVi/8ADVVVi5f/AASqq/8ACqqr/wAJVVX/AAqqq/8ACVVV/wAGVVX/AAtVVo3/AA1VVf8AAVVV/wANVVX///yqq/8AC1VWg/8ACVVVg/8ACVVV///1VVX/AASqq///8qqriwj///Kqq4t////7VVX///VVVf//9qqr///1VVX///aqq4X///Sqqv///qqr///yqqsIC4Vb+JKLkbsFC/ws/VjQi/X3UPgLi777UNWL+1v5WAUL9PwY+9mLBQtbtAX///Cqq///7Kqrev//74AA///tVVX///JVVf//7VVV///yVVX//+yqq///9Kqrd4J3gv//7Cqr///5VVX//+xVVf//+6qr///sVVX///uqq///7Sqr///91VV5i12L///XqquT///dVVWb///dVVWb///jqquhdacIdaf///Cqq6z///dVVbH///dVVbH///6qq7SRt5G3/wAMqqu0/wATVVWx/wATVVWx/wAYqqusqaepp/8AIqqrof8AJ1VVm/8AJ1VVm/8AKqqrk7mLCP8AI1VVi63///gqq/8AIKqr///wVVX/ACCqq///8FVVpP//59VW/wARVVX//99VVQjHuAX//+aqq7P//9+qqv8AHIAA///Yqquc///Yqquc///UVVX/AAiAAFuLVYv//81VVf//9qqr///Qqqv//+1VVf//0Kqr///tVVX//9XVVf//5iqrZmpmav//4VVV///Y1VX//+eqq///0qqr///nqqv//9Kqq///79VV///OVVWDVQj///iqq1WN///OKqv/AAtVVf//0lVV/wALVVX//9JVVf8AE4AA///Yqqv/ABuqq2r/ABuqq2qu///mVVX/ACpVVf//7aqr/wAqVVX//+2qq/8AMCqr///21VXBi7+L/wAx1VWV/wAvqquf/wAvqquf/wAr1VWss7kICyj9WPdviwX/AD1VVYv/ADUqq/8AB4AAuJq4mv8AJiqr/wATKqv/AB9VVf8AF1VV/wAfVVX/ABdVVf8AGaqr/wAZ1Vaf/wAcVVWf/wAcVVX/AA/VVf8AGyqr/wALqqul/wALqqul/wAIKqr/ABeAAP8ABKqroP8ABKqroI7/AA7VVf8AAVVV/wAIqqsI/wABVVX/AAiqq/8AASqr/wAO1VWMoIyg///+gAD/ABeAAIelh6X///fVVf8AGyqr///zqqv/ABxVVf//86qr/wAcVVX//+1VVf8AGdVWcv8AF1VVcv8AF1VV///fKqv/ABMqq///11VVmv//11VVmlj/AAeAAP//wqqriwgL3vjg9xyLBf8ALqqri7b///oqq/8AJ1VV///0VVX/ACdVVf//9FVV/wAg1Vb//+4qq/8AGlVVc/8AGlVVc/8AEyqr///hgACXZpdm/wACVVX//9Qqq///+Kqr///NVVX///iqq///zVVV///xVVX//9Qqq3VmdWb//+Qqq///4YAA///eVVVzCP//3lVVc2X//+4qq///1aqr///0VVX//9Wqq///9FVV///TgAD///oqq///0VVViwgLKP1Y+FWLk8f8E4uy96j37IuTx/vsi6/3kPgDi5PHBQu69+T7gIuDT/c+i2n7ggX//+Kqq3v//+AqqoD//92qq4X//92qq4X//9vVVYhli12L///XqquT///dVVWb///dVVWb///jqquhdad1p///8KqrrP//91VVsf//91VVsf///qqrtJG3CJG3/wAMqqu0/wATVVWx/wATVVWx/wAYqqusqaepp/8AIqqrof8AJ1VVm/8AJ1VVm/8AKqqrk7mL/wATVVWL/wATVVb///3VVf8AE1VV///7qqv/ABNVVf//+6qr/wASVVaF/wARVVX///hVVQj/ABFVVf//+FVV/wAPqqv///aqq5mAmYD/AAuqq///9Cqr/wAJVVX///NVVQjCvQX//8iqq/8AQVVV//+vqqr/ACCqq///lqqri1WL///NVVX///aqq///0Kqr///tVVX//9Cqq///7VVV///V1VX//+Yqq2ZqZmr//+FVVf//2NVV///nqqv//9Kqq///56qr///Sqqv//+/VVf//zlVVg1X///iqq1WN///OKqv/AAtVVf//0lVVCP8AC1VV///SVVX/ABOAAP//2Kqr/wAbqqtq/wAbqqtqrv//5lVV/wAqVVX//+2qq/8AKlVV///tqqv/ADAqq///9tVVwYu5i/8ALdVV/wAE1VX/AC2qq/8ACaqr/wAtqqv/AAmqq/8ALSqq/wAQgAD/ACyqq/8AF1VVCAso/VjNi7r35Pggi1z75M2L7vlYSYtf+8z8IIu398wFCyj9WM2L7vlYBQvR+IhJi0L8mAX///yqq///6qqr///61VX//+wqqoT//+2qq4T//+2qq///9oAA///wKqp////yqqt////yqqv///FVVf//9YAA///uqqv///hVVf//7qqr///4VVX//+uqqv///Cqr///oqquL///BVVWL///dVVb/ACBVVf//+VVV/wBAqqsIR38Fj1//AA9VVf//3NVV/wAaqqv//+Wqq/8AGqqr///lqqv/ACdVVf//8tVVv4u5i7D/AAfVVaf/AA+qq6f/AA+qq6H/ABNVVZuim6L/AAtVVf8AGIAA/wAGqqul/wAGqqulkP8AF6qr/wADVVX/ABVVVQgLKP1YzYu++AKRi/fI/ALqi/vZ+BT4KPfYMIv8F/vMhYu398wFCyj9WPggi5PH+96L5vkcBQso/VjNi+L5AI2L9+z9AOCL7vlYSYs0/QCJi/vs+QAFC///+KqrVY3//84qq/8AC1VV///SVVX/AAtVVf//0lVV/wATgAD//9iqq/8AG6qrav8AG6qraq7//+ZVVf8AKlVV///tqqv/ACpVVf//7aqr/wAwKqv///bVVcGLwYv/ADKqq/8ACSqr/wAvVVX/ABJVVf8AL1VV/wASVVX/ACoqq/8AGaqrsKwIsKz/AB6qq/8AJ1VV/wAYVVX/AC2qq/8AGFVV/wAtqqv/AA/VVv8AMdVV/wAHVVXBk8H///4qq/8AMaqr///0VVX/AC1VVf//9FVV/wAtVVX//+yAAP8AJyqr///kqqus///kqqus///dKqr/ABnVVf//1aqr/wASqqv//9Wqq/8AEqqr///P1VX/AAlVVVWLCFWL///NVVX///aqq///0Kqr///tVVX//9Cqq///7VVV///V1VX//+Yqq2ZqZmr//+FVVf//2NVV///nqqv//9Kqq///56qr///Sqqv//+/VVf//zlVVg1UIC5G3/wAMqqu0/wATVVWx/wATVVWx/wAYqqusqaepp/8AIqqrof8AJ1VVm/8AJ1VVm/8AKqqrk7mLuYv/ACiAAIOue657/wAcgAB1oW8IoW//AA8qq2r/AAhVVWX/AAhVVWX/AAEqq2KFX4Vf///zVVVi///sqqtl///sqqtl///nVVVqbW9tb///3VVVdf//2Kqre///2Kqre///1VVVg12LCF2L///XqquT///dVVWb///dVVWb///jqquhdad1p///8KqrrP//91VVsf//91VVsf///qqrtJG3CAuv95D3JosF/wASqquL/wASVVX///2qq53///tVVZ3///tVVf8AD4AA///4gACY///1qquY///1qqv/AAnVVf//8tVV/wAGqqt7/wAGqqt7/wABqqr//+yqq////Kqr///pVVX///yqq///6Kqr///41VX//+xVVYB7gHv///LVVf//8yqr///wqqv///ZVVQj///Cqq///9lVVeoT//+1VVf//+6qr///tVVX///uqq///7VVW///91VX//+1VVYsIC6/3kPcgiwX/ACKqq4v/ABuAAP//+6qr/wAUVVX///dVVf8AFFVV///3VVX/AA9VVv//9VVW/wAKVVX///NVVf8AClVV///zVVX/AAZVVv//8lVW/wACVVX///FVVf8AAlVV///xVVX/AAAqq///8qqriX+Jf///+9VV///yqqv///mqq///8VVV///5qqv///FVVYH///JVVv//8lVV///zVVUI///yVVX///NVVf//7aqr///1VVZ0///3VVV0///3VVX//+Mqq///+6qr///dVVWLCAso/VjNi7r35PcPi/cs++TWi/sz9+gFn/8AAqqr/wAVKqv/AASqqv8AFlVV/wAGqqv/ABZVVf8ABqqroP8ACiqq/wATqqv/AA2qq/8AE6qr/wANqqv/ABEqqv8AEdVV/wAOqquh/wAOqquh/wAJqqqn/wAEqqutj/8AHqqr///+qqul///5VVX/ABVVVf//+VVV/wAVVVX///XVVv8AEaqr///yVVWZCP//8lVVmf//8Cqr/wAKqqt5/wAHVVV5/wAHVVX//+3VVf8ABVVW///tqqv/AANVVf//7aqr/wADVVX//+7VVY17/wAAqqt7/wAAqqv///NVVf8AAFVV///2qquLCAtGYQWh///ZVVX/AB2qq///5IAA/wAlVVX//++qq/8AJVVV///vqqu1///31VX/AC6qq4v/AByqq4v/ABwqqv8ABFVV/wAbqqv/AAiqq/8AG6qr/wAIqqv/ABkqqv8ADNVV/wAWqquc/wAWqquc/wATKqr/ABTVVf8AD6qr/wAYqqv/AA+qq/8AGKqr/wAKKqr/ABxVVf8ABKqrqwj/AASqq/8AIVVV///+qqr/ABuqq///+Kqrof//+Kqrof//9Kqq/wASKqv///Cqq/8ADlVV///wqqv/AA5VVXn/AAuAAP//61VV/wAIqqv//+tVVf8ACKqr///q1Vb/AAfVVf//6lVVkv//6lVVkv//6qqrknaSdpL//+3VVZT///Cqq5YI///wqquW///0KqqZ///3qquc///3qquc///91VX/ABXVVY//ABqqq/8AA1VV/wAWqqv/AAcqq/8AE6qqlv8AEKqrlv8AEKqr/wANgAD/AA3VVZuWm5ad/wAIVVWf/wAFqquf/wAFqqv/ABSqq/8AAtVV/wAVVVWLCP8AHqqri/8AGaqq///6Kqv/ABSqq///9FVV/wAUqqv///RVVZz//+6AAP8ADVVV///oqqsIyrQF///sqqur///m1VX/ABbVVWz/AA2qq2z/AA2qq///3Sqr/wAG1VX//9lVVYtti///4tVV///71VX//+Oqq///96qr///jqqv///eqq///5iqq///zqqr//+iqq///76qr///oqqv//++qq///7FVV///rqqp7///nqqt7///nqqv///Wqq///5Cqq///7VVX//+Cqqwj///tVVf//3qqr/wABVVZv/wAHVVX//+lVVf8AB1VV///pVVX/AAsqq///7SqrmnyafP8AEdVV///z1VX/ABSqq///9qqr/wAUqqv///aqq/8AFSqq///3qqr/ABWqq///+Kqr/wAVqqv///iqq/8AFVVV///4qqqg///4qqug///4qqv/ABJVVf//9yqq/wAPqqv///Wqqwj/AA+qq///9aqr/wAL1VX///LVVZN7k3v/AAJVVf//66qr///8qqv//+dVVf///Kqr///qqquE///s1VX///VVVXr///VVVXr///Kqq///8YAAe397f///7dVV///2qqv//+uqq///+VVV///rqqv///lVVf//6tVV///8qqt1iwj//9yqq4v//+Gqqv8AB1VV///mqqv/AA6qq///5qqr/wAOqqv//+yqqv8AFlVV///yqqupCAsw/RzNi+b5HPeGi5PH/LqLg08FC8j4SUmLUPw4Bf///Kqr///mqquFcP//91VV///jVVX///dVVf//41VVfv//5VVW///uqqv//+dVVf//7qqr///nVVX//+mqqv//66qr///kqqt7///kqqt7///dqqqD///WqquL///WqquLa5P//+lVVZv//+lVVZv//++AAP8AFFVV///1qqv/ABiqqwj///Wqq/8AGKqr///6qqr/ABqqqv///6qr/wAcqqv///+qq/8AHKqr/wABgACm/wADVVX/ABlVVQjG+DhJi078SQX///qqq2X///8qqv//26qr/wADqqv//91VVf8AA6qr///dVVX/AAoqqv//4VVW/wAQqqv//+VVVf8AEKqr///lVVX/ABeqqv//6qqr/wAeqqt7/wAeqqt7/wAnVVWDu4u7i/8AKaqrk/8AI1VVm/8AI1VVm/8AHaqr/wAVVVWj/wAaqqsIo/8AGqqr/wAS1VX/AB6qqv8ADaqr/wAiqqv/AA2qq/8AIqqr/wAJgAD/ACRVVf8ABVVVsQgL9v1Y3Iv3n/kKjYvm/Qrci/fF+VhHi/uc/QeJizD5BzeL+5/9B4mLM/kHBQth+8XNi7X3xffR+CdBi/ue++T7O/fkPIsFC4RX+JKLk8f8QIv4iPjmk8H8gYuDT/gsiwULN/ckO4v3BvskBQub9wUFk/8AOqqr///1Kqv/ACqAAP//4lVV/wAaVVX//+JVVf8AGlVV///VKqv/AA0qq1OLbYtr///6gABpgGmA///iVVX//+/VVf//5qqr///qqqsIqGIF/wAtVVX/ACKqq/8AMaqr/wARVVXBi/8AJVVVi/8AHaqr///3VVWh///uqquh///uqqv/AAhVVf//41VV///6qqtjCIdvRYsF///pVVWL///lqqv///6AAG2IbYj//+Mqq///+VVV///kVVX///Wqq///5FVV///1qqv//+eAAP//8IAA///qqqv//+tVVf//6qqr///rVVV+b///+1VV///cqqv///yqq///51VV/wAB1VV2kv//7qqrkv//7qqr/wAKgAD///HVVZmACJmA/wAQVVWD/wASqquG/wASqquG/wATVVX///2AAJ+L/wAnVVWL/wAhgACS/wAbqquZ/wAbqquZ/wAYgACh/wAVVVWpCI0Gif//8qqr///+qqt+////VVX///NVVf///1VV///zVVWLf/8AAKqr///0qqsIwwaL/wANVVX/AABVVf8ADVVW/wAAqqv/AA1VVf8AAKqr/wANVVWM/wAOVVb/AAFVVf8AD1VV/wABVVX/AA9VVf8AAdVW/wAQqqv/AAJVVZ3/AAJVVZ3/AALVVv8AFFVV/wADVVX/ABaqqwgLzYuHbAX///1VVf//7Kqr///61Vb//+zVVf//+FVVeP//+FVVeIB6///xqqt8///xqqt8///t1VX///PVVXX///aqq3X///aqq3D///tVVWuL///zVVWL///zqqv/AAHVVX//AAOqq3//AAOqq///9YAA/wAFVVWCkgiCkv//+SqrlP//+1VVlv//+1VVlv///qqr/wAMgACNmf8AAqqrn/8ACCqq/wAQqqv/AA2qq/8ADVVV/wANqqv/AA1VVf8AEKqq/wAKqqv/ABOqq5P/ABOqq5Oh/wAFqqv/ABhVVf8AA1VV/wAYVVX/AANVVf8AGNVW/wABqqv/ABlVVYsIC4+l/wAIgAD/ABiAAJiimKL/ABBVVZ//ABOqq5z/ABOqq5z/ABZVVf8ADYAApJWklf8AGiqrkP8AG1VVi6eL/wAYqquG/wAVVVWB/wAVVVWB/wARVVb///KAAP8ADVVVegj/AA1VVXr/AAlVVnf/AAVVVXT/AAVVVXT/AACqq///54AAh3GHcf//+Cqr///ngAD///RVVXT///RVVXR8d///7aqrev//7aqrev//6tVV///ygABzgXOBcYZviwj//+Sqq4v//+dVVZB1lXWV///tgAD/AA2AAHycfJz///Uqq5////lVVaL///lVVaL///6qq/8AGIAAj6UIC2KxBXn//+yqq///66qr///wgAD//+lVVf//9FVV///pVVX///RVVXP///oqq///5qqri2+L///nVVWQ///qqquV///qqquV///uqqr/AA2AAP//8qqrnP//8qqrnP//9qqqn///+qqrov//+qqrov///1VV/wAYgACPpQiPpf8AB9VV/wAYgAD/AAuqq6L/AAuqq6Kan/8AElVVnP8AElVVnP8AFSqr/wANgACjlaOVpZCni6OL/wAVVVX///qAAP8AEqqrgP8AEqqrgJz///DVVf8AD1VV///sqqsIwK8F///sqqv/ABlVVf//6NVV/wATqqtwmXCZ///hgACSaYv//9yqq4v//96AAIX//+BVVX///+BVVX9v///vKqv//+eqq///6lVV///nqqv//+pVVf//66qq///mVVb//++qq///4lVV///vqqv//+JVVf//9YAA///fgAD///tVVf//3KqrCP//+qqr///cqqv/AAFVVf//34AAk///4lVVk///4lVV/wANKqv//+ZVVv8AElVV///qVVX/ABJVVf//6lVV/wAXVVb//+8qq/8AHFVVf/8AHFVVf/8AH9VWhf8AI1VVi/8AIVVVi/8AH9VW/wAGgAD/AB5VVZj/AB5VVZj/AByAAP8AFCqr/wAaqqv/ABtVVQgLgDrHi/X5iE+LVvwLiYsF///4qqub///2VVX/AA3VVX//AAuqq3//AAuqq///8iqr/wAJqqr///BVVf8AB6qr///wVVX/AAeqq///74AA/wAFqqr//+6qq/8AA6qr///uqqv/AAOqq///7qqq/wAB1VX//+6qq4v//9yqq4v//96AAIX//+BVVX///+BVVX9v///vKqv//+eqq///6lVVCP//56qr///qVVX//+uqqv//5lVW///vqqv//+JVVf//76qr///iVVX///WAAP//34AA///7VVX//9yqq///+qqr///cqqv/AAFVVf//34AAk///4lVVk///4lVV/wANKqv//+ZVVv8AElVV///qVVX/ABJVVf//6lVV/wAXVVb//+8qq/8AHFVVf/8AHFVVf/8AH9VWhf8AI1VViwj/ABFVVYv/ABHVVv8AAdVV/wASVVX/AAOqq/8AElVV/wADqqud/wAFqqr/ABGqq/8AB6qr/wARqqv/AAeqq/8AEKqq/wAJqqr/AA+qq/8AC6qr/wAPqqv/AAuqq/8ADYAA/wAN1VX/AAtVVZsIC4dx///3gAD//+eAAH50fnT//++qq3f//+xVVXr//+xVVXr//+mqq///8oAAcoFygf//5dVVhv//5Kqri2+L///nVVWQ///qqquV///qqquV///uqqr/AA2AAP//8qqrnAj///Kqq5z///aqqp////qqq6L///qqq6L///9VVf8AGIAAj6WPpf8AB9VV/wAYgAD/AAuqq6L/AAuqq6Kan/8AElVVnP8AElVVnP8AFSqr/wANgACjlaOVpZCniwj/ABtVVYv/ABiqq4ahgaGB/wASgAD///KAAJp6mnr/AArVVXf/AAaqq3T/AAaqq3T/AAFVVf//54AAh3EIC2SwBf//7VVV///mqqv//+cqq3ds///xVVVs///xVVX//+Eqq///+Kqr///hVVWL///cqquL///kKqr/AAaqq///66qr/wANVVX//+uqq/8ADVVV///wgACb///1VVX/ABKqq///9VVV/wASqqv///mAAP8AEyqq///9qqv/ABOqq////aqr/wATqqv////VVf8AECqqjf8ADKqrCPgYi5G1BY//ABqqq////yqr/wAaVVX///pVVaX///pVVaX///VVVv8AFyqr///wVVX/ABRVVf//8FVV/wAUVVX//+uAAP8AEFVW///mqqv/AAxVVf//5qqr/wAMVVX//+Gqqv8ABiqr///cqquLaYv//+Aqq///+dVV///iVVX///Oqq///4lVV///zqqv//+VVVnr//+hVVf//6lVVCP//6FVV///qVVX//+xVVv//5oAA///wVVX//+Kqq///8FVV///iqqv///XVVmv///tVVf//3VVV///6qqtn/wAA1VX//98qq5L//+JVVZL//+JVVf8ADFVV///mVVb/ABGqq///6lVV/wARqqv//+pVVf8AFlVV///vKqumf6Z//wAfKquF/wAjVVWLCP8AKVVVi/8AJtVW/wAHqqv/ACRVVf8AD1VV/wAkVVX/AA9VVf8AIIAA/wAZVVb/AByqq/8AI1VVCAv73Ab/AACqq5H/AAQqqv8ACyqr/wAHqqv/ABBVVf8AB6qr/wAQVVX/AAuAAP8AENVW/wAPVVX/ABFVVf8AD1VV/wARVVX/ABOAAP8AD1VW/wAXqqv/AA1VVf8AF6qr/wANVVX/ABwqqv8ABqqr/wAgqquLoYv/ABQqq4f/ABJVVYP/ABJVVYP/AA+AAP//9Sqr/wAMqqv///JVVQj/AAyqq///8lVVlP//8Cqr/wAFVVV5/wAFVVV5/wABVVb//+yqq////VVV///rVVUIC1L8LMeLxPgs9wCLksH7AIue9xUF/wAKqqvd/wAgqqq0/wA2qquLoYv/ABFVVf///Kqr/wAMqqv///lVVQifvwX//+6qq5P//+lVVY9vi///8VVVi///8Cqr///9gAB6hnqGe///94AAfH98f///8qqr///wKqv///RVVf//7FVV///0VVX//+xVVf//+Cqr///nKquHbQh1+ysri4RVBQvH+ERPi4A9iYsF///yqqun///rqqqh///kqqub///kqqub///eVVWTY4tpi///3yqr///5qqv//+BVVf//81VV///gVVX///NVVf//44AAev//5qqr///qqqv//+aqq///6qqr///q1VVyev//41VVev//41VV///1Kqv//+FVVv//+1VV///fVVUI///7VVX//99VVf8AAiqr///hVVaU///jVVWU///jVVX/AA4qq///5tVW/wATVVX//+pVVf8AE1VV///qVVX/ABfVVnr/ABxVVf//86qr/wAcVVX///Oqq/8AHyqr///51VWti7OL/wAj1VWT/wAfqqub/wAfqqub/wAagACh/wAVVVWnCI2LgksF///+qqv///dVVYn///Sqq////VVVff///VVVff//+9VW///xKqv///pVVf//8FVV///6VVX///BVVf//+Cqr///wVVaB///wVVWB///wVVX///Mqq///8aqr///wVVV+///wVVV+///tKqv///WAAHWDdYP//+Wqq4f//+FVVYsIZ4tqkm2ZbZn//+iqq6H//+9VVakIVV8F/wATVVX//+FVVf8AHSqr///oKquyerJ6/wAq1VX///eAAP8ALqqri/8AF1VVi/8AGoAA/wADVVX/AB2qq/8ABqqr/wAdqqv/AAaqq/8AHIAAmP8AG1VV/wATVVX/ABtVVf8AE1VV/wAYqqv/ABtVVqH/ACNVVaH/ACNVVZr/AC5VVpP/ADlVVQgL///8qqv//+aqq4P//+gqqv//81VV///pqqv///NVVf//6aqr///wKqv//+yqqnj//++qq3j//++qq///6qqrfv//6FVV///2VVX//+hVVf//9lVV///ngAD///sqq///5qqri///5qqri3T/AATVVf//61VV/wAJqqv//+tVVf8ACaqr///ugACY///xqqv/ABBVVQj///Gqq/8AEFVV///1qqr/ABNVVv//+aqr/wAWVVX///mqq/8AFlVV///+gAD/ABfVVv8AA1VV/wAZVVX/AANVVf8AGVVVk/8AF9VW/wAMqqv/ABZVVf8ADKqr/wAWVVX/AA/VVf8AE1VWnv8AEFVVnv8AEFVV/wAVVVWY/wAXqqv/AAmqq/8AF6qr/wAJqqv/ABiAAP8ABNVV/wAZVVWLCP8AGVVVi6L///sqq/8AFKqr///2VVX/ABSqq///9lVV/wARgAB+/wAOVVX//++qq/8ADlVV///vqqv/AApVVv//7Kqq/wAGVVX//+mqq/8ABlVV///pqqv/AAGAAP//6Cqq///8qqv//+aqqwgLIf2Ix4ur93sF/wAEqqur/wAIKqr/ABvVVf8AC6qr/wAXqqv/AAuqq/8AF6qr/wAOKqr/ABOqqv8AEKqr/wAPqqv/ABCqq/8AD6qr/wASqqr/AAuqqv8AFKqr/wAHqqv/ABSqq/8AB6qr/wAVVVX/AAPVVaGLo4v/ABLVVf//+9VV/wANqqv///eqq/8ADaqr///3qqv/AAoqqv//9NVV/wAGqqt9CP8ABqqrff8AA6qq///wKqv/AACqq///7lVV/wAAqqv//+5VVYr//+3VVv///VVV///tVVUIZfukx4ux96cF/wADVVX/ABlVVYz/ABiqq////qqro////qqro///+iqq/wAVKqv///Wqq/8AElVV///1qqv/ABJVVf//8Cqq/wAO1Vb//+qqq/8AC1VV///qqqv/AAtVVf//41VV/wAFqqtni///7VVVi3n///2AAP//7qqrhv//7qqrhnv///lVVf//8VVV///3qqsI///xVVX///eqq///8tVW///2Kqr///RVVf//9Kqr///0VVX///Sqq///9iqrf4P///NVVQiJi8D4CwULS/xix4vL+GIFC////qqr///zVVWO///1VVb/AAdVVf//91VV/wAHVVX///dVVZX///uqq/8ADKqri/8ADKqri/8AC1VV/wAEVVWV/wAIqquV/wAIqqv/AAWqq/8ACqqq/wABVVX/AAyqq43/AAyqq////Sqr/wAKqqr///hVVf8ACKqr///4VVX/AAiqq///9dVW/wAEVVX///NVVYsI///zVVWL///01Vb///uqq///9lVV///3VVX///ZVVf//91VV///6Kqv///VVVon///NVVQgL1/izT4s+/LgFif//8qqr///9gAD///NVVYh/iH////tVVf//9YAA///5qquC///5qquC///3qqr///iqq///9aqr///6VVX///Wqq///+lVV///y1VX///0qq3uL///5VVWL///51Vb/AACqq///+lVV/wABVVX///pVVf8AAVVV///51VaN///5VVX/AAKqqwh7VgX/AA6qq4X/AA+qqoj/ABCqq4uli6H/AAPVVZ3/AAeqq53/AAeqq5r/AArVVZeZl5n/AAkqq/8AEKqr/wAGVVX/ABNVVf8ABlVV/wATVVX/AATVVv8AFaqr/wADVVWjCAsh/YjHi633iPdv+4jmi/t79473n/dnM4v7lftl0viMBQsh/YjHi/X5iAULXfvgx4ur93sF/wAEqqur/wAIKqr/ABvVVf8AC6qr/wAXqqv/AAuqq/8AF6qr/wAOKqr/ABOqqv8AEKqr/wAPqqv/ABCqq/8AD6qr/wASqqr/AAuqqv8AFKqr/wAHqqv/ABSqq/8AB6qr/wAVVVX/AAPVVaGLo4v/ABLVVf//+9VV/wANqqv///eqq/8ADaqr///3qqv/AAoqqv//9NVV/wAGqqt9CP8ABqqrff8AA6qq///wKqv/AACqq///7lVV/wAAqqv//+5VVYr//+3VVv///VVV///tVVUIZfukx4ux96cF/wADVVX/ABlVVYz/ABiqq////qqro////qqro///+iqq/wAVKqv///Wqq/8AElVV///1qqv/ABJVVf//8Cqq/wAO1Vb//+qqq/8AC1VV///qqqv/AAtVVf//41VV/wAFqqtni///7VVVi3n///2AAP//7qqrhv//7qqrhnv///lVVf//8VVV///3qqsI///xVVX///eqq///8tVW///2Kqr///RVVf//9Kqr///0VVX///Sqq///9iqrf4P///NVVQiIBv///1VV/wAEqqv/AACqq/8AClVVjZuNm/8AAaqr/wAQqqv/AAFVVf8AEVVVCE8G////VVWF////Kqv///eAAIqAioCK///0KquK///zVVWK///zVVX///7VVf//84AA///+qqv///Oqq////qqr///zqqv///6qqv//9YAA///+qqv///dVVQgL///6qqv//9yqq/8AAVVV///fgACT///iVVWT///iVVX/AA0qq///5lVW/wASVVX//+pVVf8AElVV///qVVX/ABdVVv//7yqr/wAcVVV//wAcVVV//wAf1VaF/wAjVVWL/wAjVVWL/wAhVVaR/wAfVVWX/wAfVVWXp/8AENVV/wAYqqv/ABWqqwj/ABiqq/8AFaqr/wAUVVX/ABmqqpv/AB2qq5v/AB2qq/8ACqqr/wAggAD/AAVVVf8AI1VV/wAEqqv/ACNVVf///oAA/wAggAD///hVVf8AHaqr///4VVX/AB2qq///8tVW/wAZqqr//+1VVf8AFaqr///tVVX/ABWqq///6Kqr/wAQ1VVvl2+X///gVVWR///cqquLCP//3Kqri///3oAAhf//4FVVf///4FVVf2///+8qq///56qr///qVVX//+eqq///6lVV///rqqr//+ZVVv//76qr///iVVX//++qq///4lVV///1gAD//9+AAP//+1VV///cqqsIC4+l/wAH1VX/ABiAAP8AC6qrov8AC6qropqf/wASVVWc/wASVVWc/wAVKqv/AA2AAKOVo5WlkKeLp4v/ABiqq4b/ABVVVYH/ABVVVYH/ABFVVv//8oAA/wANVVV6CP8ADVVVev8ACVVWd/8ABVVVdP8ABVVVdP8AAKqr///ngACHcYdx///4Kqv//+eAAP//9FVVdP//9FVVdHx3///tqqt6///tqqt6///q1VX///KAAHOBc4Fxhm+LCG+L///nVVWQ///qqquV///qqquV///uqqr/AA2AAP//8qqrnP//8qqrnP//9qqqn///+qqrov//+qqrov///1VV/wAYgACPpQgLXfvgx4uu95AF/wADVVX/ABaqq5H/ABUqqv8ACKqr/wATqqv/AAiqq/8AE6qr/wALqqr/ABEqqv8ADqqr/wAOqqv/AA6qq/8ADqqr/wARVVX/AAuAAJ//AAhVVZ//AAhVVaL/AAQqq6WL/wAHVVWL/wAHVVb///6qq/8AB1VV///9VVUImsYFf/8AA1VV///0qqv/AAGqq///9VVVi///3VVVi///4YAA///3VVX//+Wqq///7qqr///lqqv//+6qq///6Sqq///pqqr//+yqq///5Kqr////VVX/AASqq/8AAKqr/wAKVVWNm42b/wABqqv/ABCqq/8AAVVV/wARVVUITwb///9VVYX///8qq///94AAioCKgIr///Qqq4r///NVVYr///NVVf///tVV///zgAD///6qq///86qr///+qqv///Oqq////qqq///1gAD///6qq///91VVCAtRZwX/AA1VVWv/ABYqq///6FVVqv//8Kqrqv//8Kqr/wAjgAD///hVVbOLoYv/ABWAAI6gkaCRnpScl5yX/wAOVVX/AA7VVf8AC6qr/wARqqv/AAuqq/8AEaqr/wAHgAD/ABTVVf8AA1VVowiP/wAfVVX///yAAP8AGCqrgJyAnHyYeJR4lHb/AAaAAHSPdI///+qqq/8ABNVV///sVVX/AAWqq///7FVV/wAFqqv///Aqq/8AB9VVf5V/lf//+1VV/wAPVVX/AAKqq/8AFKqrCI2X/wAEqqv/AAqqq/8AB1VV/wAJVVX/AAdVVf8ACVVVlP8AB6qr/wAKqquR/wAKqquR/wALVVX/AASqq5f/AANVVZf/AANVVf8AC1VV/wABqqv/AAqqq4v/ABtVVYv/ABUqq///+oAAmoCagP8AC9VV///v1VX/AAiqq///6qqrCMarBf//9Kqrqf//7YAAof//5lVVmf//5lVVmf//4CqrkmWL///sqquL///sqqr///1VVf//7Kqr///6qqv//+yqq///+qqref//99VV///vVVWA///vVVWA///x1Vb///Iqq///9FVV///vVVX///RVVf//71VV///4gAD//+xVVv///Kqr///pVVUI///8qqt1/wABVVX//+3VVZH///Gqq5H///Gqq/8ACNVV///0Kqr/AAuqq///9qqr/wALqqv///aqq/8ADaqq///4qqr/AA+qq///+qqr/wAPqqv///qqq/8AECqq///7gAD/ABCqq////FVV/wAQqqv///xVVf8AECqq///8Kqv/AA+qq4f/AA+qq4f/AA3VVYaXhQiXhf8ACSqr///4Kqv/AAZVVf//9lVV/wAGVVX///ZVVf8AAiqr///zKquJe4n///Kqq///+yqr///0Kqr///hVVf//9aqr///4VVX///Wqq///9qqr///3KqqA///4qquA///4qqv///PVVf//+lVV///yqquH///yqquHfon///NVVYsI///kqquLcv8ABoAA///pVVWY///pVVWYe/8AEtVV///2qqv/ABiqqwgLksH7GIue9xlPi3j7GSeLhFXvi2H7wQX///1VVf//71VV////1Vb///CAAP8AAlVV///xqqv/AAJVVf//8aqr/wAFKqv///OAAJP///VVVZP///VVVf8ACyqr///3gAD/AA5VVf//+aqr/wAOVVX///mqq/8AEdVW///81VX/ABVVVYv/AAtVVYv/AA1VVv8AAaqr/wAPVVX/AANVVf8AD1VV/wADVVX/AA1VVv8AA6qr/wALVVWPCI7BBf//9Kqr///7VVX///Qqqv///Cqr///zqquI///zqquI///0Kqr///6AAP//9Kqri3eL///xKqv/AAWqq///9lVV/wALVVX///ZVVf8AC1VV///81Vab/wADVVX/ABSqqwi198EFC7n34E+La/t7Bf//+1VVa///99VW///kKqv///RVVf//6FVV///0VVX//+hVVf//8dVW///sVVb//+9VVf//8FVV///vVVX///BVVf//7VVW///0VVb//+tVVf//+FVV///rVVX///hVVf//6qqr///8Kqt1i3OL///tKqv/AAQqq///8lVV/wAIVVX///JVVf8ACFVV///11Vb/AAsqq///+VVVmQj///lVVZn///xVVv8AD9VV////VVX/ABGqq////1VV/wARqquM/wASKqr/AAKqq/8AEqqrCLH3pE+LZfunBf///Kqr///mqquK///nVVX/AAFVVXP/AAFVVXP/AAXVVv//6tVV/wAKVVX//+2qq/8AClVV///tqqv/AA/VVv//8Sqq/wAVVVX///Sqq/8AFVVV///0qqv/AByqq///+lVVr4v/ABKqq4ud/wACgAD/ABFVVZD/ABFVVZCb/wAGqqv/AA6qq/8ACFVVCP8ADqqr/wAIVVX/AA0qqv8ACdVW/wALqqv/AAtVVf8AC6qr/wALVVX/AAnVVZeT/wAMqqsIjgb/AACqq///+1VV////VVX///Wqq4l7iXv///5VVf//71VV///+qqv//+6qqwjHBv8AAKqrkf8AANVV/wAIgACMloyWjP8AC9VVjP8ADKqrjP8ADKqr/wABKqv/AAyAAP8AAVVV/wAMVVX/AAFVVf8ADFVV/wABVVb/AAqAAP8AAVVV/wAIqqsIC9z8YsmL90r4Do2L4PwOyYv3XPhiT4v7N/wXiYs4+BdSi/tL/BeJi1H4FwUL99f48UuL+1/8GSj4GUiL9w/8ZFIgBf//+1VV///2qqv///rVVv//9tVV///6VVWC///6VVWC///5qqv///fVVYT///iqq4T///iqq4OFgv//+1VVgv//+1VV///2Kqv///2qq///9VVVi///9qqri4L/AAEqq///91VV/wACVVX///dVVf8AAlVV///3qqv/AAKAAIP/AAKqqwh+UwX/AAiqq////VVV/wAJKqr///3VVv8ACaqr///+VVX/AAmqq////lVV/wAJ1VX///8qq5WL/wAhVVWL/wAb1Vb/AAiqq/8AFlVV/wARVVX/ABZVVf8AEVVV/wAS1Vb/ABeqq/8AD1VVqQgLhmf4CIuSwfu0i/fc+AiQr/vui4RV95uLBQuN/wANVVWI/wALVVaD/wAJVVWD/wAJVVX///VVVf8ABKqr///yqquL///yqquLf///+1VV///1VVX///aqq///9VVV///2qqv///mqq///9Kqqif//8qqrif//8qqrjv//9Kqqk///9qqrk///9qqr/wAKqqv///tVVf8ADVVViwj/AA1VVYuX/wAEqqv/AAqqq/8ACVVV/wAKqqv/AAlVVf8ABlVV/wALVVaN/wANVVUIC4n///Kqq47///SqqpP///aqq5P///aqq/8ACqqr///7VVX/AA1VVYv/AA1VVYuX/wAEqqv/AAqqq/8ACVVV/wAKqqv/AAlVVf8ABlVV/wALVVaN/wANVVWN/wANVVWI/wALVVaD/wAJVVWD/wAJVVX///VVVf8ABKqr///yqquLCP//8qqri3////tVVf//9VVV///2qqv///VVVf//9qqr///5qqv///Sqqon///KqqwgL///4qqv//8yqq47//8/VVf8ADVVVXv8ADVVVXv8AFSqr///Yqquo///eVVWo///eVVX/ACOqq///5VVW/wAqVVX//+xVVf8AKlVV///sVVX/AC7VVv//9iqr/wAzVVWL/wAzVVWL/wAxgAD/AAnVVf8AL6qr/wATqqv/AC+qq/8AE6qr/wArKqr/ABqqqv8AJqqr/wAhqqsI/wAmqqv/ACGqq/8AICqq/wAnVVX/ABmqq7j/ABmqq7j/ABCAAP8AMCqr/wAHVVX/ADNVVf8AB1VV/wAzVVX///0qq/8AMCqrfrh+uHb/ACdVVW7/ACGqq27/ACGqq///3FVV/wAaqqr//9Wqq/8AE6qr///Vqqv/ABOqq///0Sqq/wAJ1VX//8yqq4sI///MqquL///OVVX///Yqq1v//+xVVVv//+xVVf//1NVV///lVVb//9mqq///3lVV///Zqqv//95VVf//39VV///YqqtxXnFe///vVVX//8/VVf//+Kqr///MqqsIC5G3/wAOKqv/AClVVf8AFlVV/wAmqqv/ABZVVf8AJqqr/wAbgAD/ACGqqv8AIKqr/wAcqqv/ACCqq/8AHKqr/wAk1VX/ABaqqrT/ABCqq7T/ABCqq/8AKoAA/wAIVVW3i7eL/wAoKqv///eqq/8AJFVV///vVVX/ACRVVf//71VV/wAegAD//+lVVv8AGKqr///jVVUI/wAYqqv//+NVVf8AEdVV///eVVaW///ZVVWW///ZVVX/AAKAAP//1qqrhV+FX33//9aqq3X//9lVVXX//9lVVf//5Kqr///eVVb//99VVf//41VV///fVVX//+NVVf//2yqr///pVVZi///vVVVi///vVVX//9WAAP//96qrX4sIX4v//9fVVf8ACFVV///bqqv/ABCqq///26qr/wAQqqv//+GAAP8AFqqq///nVVX/AByqq///51VV/wAcqqt5/wAhqqr///Sqq/8AJqqr///0qqv/ACaqq////VVV/wApVVWRtwgL9wD7X7umLvdE9yD3QmWoBQuRu/uci4VbBQv7EPskvYv3LvckBQu59+BPi2v7ewX///tVVWv///fVVv//5Cqr///0VVX//+hVVf//9FVV///oVVX///HVVv//7FVW///vVVX///BVVf//71VV///wVVX//+1VVv//9FVW///rVVX///hVVf//61VV///4VVX//+qqq////CqrdYtzi///7Sqr/wAEKqv///JVVf8ACFVV///yVVX/AAhVVf//9dVW/wALKqv///lVVZkI///5VVWZ///8VVb/AA/VVf///1VV/wARqqv///9VVf8AEaqrjP8AEiqq/wACqqv/ABKqqwix96RPiyr9RsaLr/eSBZd//wAO1VX///aqq/8AEaqr///5VVX/ABGqq///+VVV/wAWgAD///yqq/8AG1VVi/8AEqqri53/AAKAAP8AEVVVkP8AEVVVkJv/AAaqq/8ADqqr/wAIVVX/AA6qq/8ACFVV/wANKqr/AAnVVv8AC6qr/wALVVX/AAuqq/8AC1VV/wAJ1VWXk/8ADKqrCI4G/wAAqqv///tVVf///1VV///1qquJe4l7///+VVX//+9VVf///qqr///uqqsIxwb/AACqq5H/AADVVf8ACIAAjJaMloz/AAvVVYz/AAyqq4z/AAyqq/8AASqr/wAMgAD/AAFVVf8ADFVV/wABVVX/AAxVVf8AAVVW/wAKgAD/AAFVVf8ACKqrCAtX/AfBi8f4PVWL+w41n2kFC/sB919ccOj7RPsh+0KxbgULfSXBi5nxy4uSu0uLsfemUIv7dPuphV4FC2/7Xvsci/c2914FC/sU+yTGi+v3AM37AMyLM/ckBQuvBv8ABVVVl5KW/wAIqquV/wAIqquVl5D/AA9VVYuVi/8ACiqr///9VVX/AApVVf//+qqr/wAKVVX///qqq/8ACtVW///6qqr/AAtVVf//+qqr/wALVVX///qqq/8AC4AA///6qqr/AAuqq///+qqr/wALqqv///qqq/8ADIAA///9VVX/AA1VVYsI/wAMqquL/wAL1VWOlpGWkf8ACYAA/wAH1VWT/wAJqquT/wAJqqv/AAbVVZb/AAWqq/8ADFVV/wAFqqv/AAxVVf8ABIAA/wAMKqv/AANVVZcIZwaHf///+YAAgIKBgoH///Qqq4b///FVVYv///aqq4v///aAAP8AAoAA///2VVWQ///2VVWQ///1gAD/AAUqq///9Kqr/wAFVVX///VVVZH///TVVv8ABaqr///0VVX/AAVVVf//9FVV/wAFVVX///OAAP8AAqqr///yqquLCP//8qqri///86qq///81VX///Sqq///+aqr///0qqv///mqq///9aqq///31VX///aqq4H///aqq///9qqr///4gAD///Uqqv//+lVV///zqqv///pVVf//86qr///7gAD///Qqqv///Kqr///0qqsIC////Kqrcf8ABiqq///pqqv/AA+qq///7VVV/wAPqqv//+1VVf8AFNVV///2qquli/8ADKqri/8ADFVV/wACqquX/wAFVVWX/wAFVVX/AArVVZL/AAmqq/8ACKqr/wAJqqv/AAiqq/8AB9VVlZH/AAtVVZH/AAtVVY//AAuqq42XCI3/AAyqq////1VVl////Kqr/wALVVX///yqq/8AC1VV///61VX/AAoqq4SUhJT///cqq/8AByqr///1VVX/AAVVVf//9VVV/wAFVVX///RVVv8AAqqr///zVVWL///yqquL///zVVX///2AAH+Gf4b///Uqq///+Sqr///2VVX///dVVQj///ZVVf//91VVg///9dVW///5qqv///RVVf//+aqr///0VVX///vVVf//89VWif//81VVCAv///1VVf//71VV///4qqt9f///9Kqrf///9Kqr///xqqv///pVVf//71VVi3uL///zKqv/AAWAAP//9lVVlv//9lVVlv///IAA/wAN1VX/AAKqq/8AEKqr/wACqqv/ABCqq/8AB1VV/wAOKqqX/wALqquX/wALqqv/AA5VVf8ABdVV/wAQqquLCP8AEKqri5j///pVVf8ACVVV///0qqv/AAlVVf//9Kqr/wADVVZ9///9VVX//+9VVQgLr/eQ9xyLBf8ALqqri7b///oqq/8AJ1VV///0VVX/ACdVVf//9FVV/wAg1Vb//+4qq/8AGlVVc/8AGlVVc/8AEyqr///hgACXZpdm/wACVVX//9Qqq///+Kqr///NVVX///iqq///zVVV///xVVX//9Qqq3VmdWb//+Qqq///4YAA///eVVVzCP//3lVVc2X//+4qq///1aqr///0VVX//9Wqq///9FVV///TgAD///oqq///0VVViwj7HIuz9673louSwQULW/vq92+LBf8APVVVi/8ANSqr/wAHgAC4mria/wAmKqv/ABMqq/8AH1VV/wAXVVX/AB9VVf8AF1VV/wAZqqv/ABnVVp//ABxVVZ//ABxVVf8AD9VV/wAbKqv/AAuqq6X/AAuqq6X/AAgqqv8AF4AA/wAEqqug/wAEqqugjv8ADtVV/wABVVX/AAiqqwj/AAFVVf8ACKqr/wABKqv/AA7VVYygjKD///6AAP8AF4AAh6WHpf//99VV/wAbKqv///Oqq/8AHFVV///zqqv/ABxVVf//7VVV/wAZ1VZy/wAXVVVy/wAXVVX//98qq/8AEyqr///XVVWa///XVVWaWP8AB4AA///CqquLCPtvi1/7zD2LhFUFC68G/wAFVVWX/wAHKquWlJWUlf8ADCqrkP8AD1VVi5WL/wAKKqv///1VVf8AClVV///6qqv/AApVVf//+qqr/wAK1Vb///qqqv8AC1VV///6qqsIrXsF/wALVVX///qqq/8ADFVW///9VVX/AA1VVYv/AA1VVYuXjv8ACqqrkf8ACqqrkf8ACYAA/wAH1VX/AAhVVf8ACaqr/wAIVVX/AAmqq/8ABtVWlv8ABVVV/wAMVVX/AAVVVf8ADFVV/wAEVVb/AAwqq/8AA1VVlwhnBod////5qquA///3VVWB///3VVWB///0VVaG///xVVWL///2qquL///2Kqr/AAKAAP//9aqrkP//9aqrkP//9dVV/wAFKquB/wAFVVX///VVVZH///Sqq/8ABaqrf/8ABVVVf/8ABVVV///zVVX/AAKqq///8qqriwj///Kqq4v///PVVf///NVVgP//+aqrgP//+aqr///11VX///fVVf//9qqrgf//9qqr///2qqv///hVVf//9Sqqhf//86qrhf//86qr///7VVX///Qqqv///Kqr///0qqsIC4n///NVVf8AAKqr///z1Vb/AANVVf//9FVV/wADVVX///RVVf8ABVVW///11Vb/AAdVVf//91VV/wAHVVX///dVVf8ACNVW///5Kqv/AApVVYb/AApVVYb/AAvVVv///YAA/wANVVWL/wAMqquL/wAMVVX/AAKqq5f/AAVVVZf/AAVVVf8ACtVVkv8ACaqr/wAIqqsI/wAJqqv/AAiqq5OV/wAGVVX/AAtVVf8ABlVV/wALVVX/AAQqq/8AC6qrjZeN/wAMqqv///9VVZf///yqq/8AC1VV///8qqv/AAtVVf//+tVV/wAKKquElISU///3Kqv/AAcqq///9VVV/wAFVVX///VVVf8ABVVV///0VVb/AAKqq///81VViwj///Kqq4v///NVVf///YAAf4Z/hv//9Sqr///5Kqv///ZVVf//91VV///2VVX///dVVYP///XVVv//+aqr///0VVX///mqq///9FVV///71VX///PVVon///NVVQgL///9VVX//+9VVf//+IAAff//86qr///0qqv///Oqq///9Kqr///xgAD///pVVf//71VVi3uL///zVVX/AAWAAP//9qqrlv//9qqrlv///Kqq/wAN1VX/AAKqq/8AEKqrjf8AEKqr/wAHKqv/AA4qqv8ADFVV/wALqqv/AAxVVf8AC6qr/wAOgAD/AAXVVf8AEKqriwj/ABCqq4v/AAzVVf//+lVVlP//9KqrlP//9Kqr/wADgAB9if//71VVCAv7vAb/AAKqq/8AFKqr/wAGKqr/ABNVVf8ACaqrnf8ACaqrnf8ADFVV/wAP1VWa/wANqqua/wANqqv/ABEqq/8ACtVV/wATVVWT/wATVVWT/wAVVVaP/wAXVVWL/wAZVVWL/wAVVVaH/wARVVWD/wARVVWD/wANqqv///VVVZX///KqqwiV///yqqv/AAaAAP//8Cqqjv//7aqrjv//7aqr/wAAKqv//+yAAP///VVV///rVVUIC5K7+5yLhFsFC2EG///8qqtjlWz/ABdVVXX/ABdVVXX/AB+qq4Czi7OL/wAiqquW/wAdVVWh/wAdVVWh/wATqquqlbMIYQb///VVVW3///Gqq///64AAeYB5gHP///qAAG2LcYv//+rVVf8ABlVV///vqqv/AAyqq///76qr/wAMqqv///eAAP8AE6qq////VVX/ABqqqwgLYQb///yqq2OVbP8AF1VVdf8AF1VVdf8AH1VWgP8AJ1VVi7OL/wAi1VWW/wAdqquh/wAdqquh/wAT1VWqlbMIYQb///VVVf//4qqr///xqqv//+uqqnn///Sqq3n///Sqq3P///pVVW2LcYv//+rVVf8ABlVV///vqqv/AAyqq///76qr/wAMqqv///eAAP8AE6qq////VVX/ABqqqwgL9xL3JFWLJfsGSPcGTYvk+yQFCz37TcCL5fdNBQtC+znAi+D3OQUL1/izT4s+/LgFif//8qqr///9gAD///NVVYh/iH////sqq///9YAA///5VVWC///5VVWC///3qqv///iqq4H///pVVYH///pVVX7///0qq3uLgYv///Oqq/8AAqqr///xVVX/AAVVVQh7VgX/AA6qq4X/AA+qqoj/ABCqq4v/ABqqq4v/ABZVVf8AA9VVnf8AB6qrnf8AB6qr/wAO1VX/AArVVf8AC6qrmf8AC6qrmZT/ABCqq/8ABlVV/wATVVX/AAZVVf8AE1VV/wAE1Vb/ABWqq/8AA1VVowgL+RaL+0/5XEGLBQv3j4uTxftZi5bdBf8AIKqr/wAIqqup/wANKqr/ABtVVf8AEaqr/wAbVVX/ABGqq/8AF6qr/wAVKqqf/wAYqquf/wAYqqv/ABBVVf8AGyqq/wAMqqv/AB2qq/8ADKqr/wAdqqv/AAiqqv8AHtVV/wAEqqurkbf///0qq/8AKKqr///0VVX/ACVVVf//9FVV/wAlVVX//+2qq/8AICqrcqYIcqb//+Eqq6D//9tVVZr//9tVVZr//9hVVv8AB4AA///VVVWL///UqquL///V1VX///iAAGJ8YnxmdmpwanD//+RVVf//39VV///pqqv//9qqq///6aqr///aqqv///HVVWKF///TVVUI///7VVVri///4VVV/wAEqqv//+Kqq/8ABKqr///iqquU///lKqr/AA1VVf//56qr/wANVVX//+eqq/8AEaqr///q1VWheaF5pf//8qqrqf//91VVCIA5+1mLg1H3j4uk90kF///iqqv/AASqq///5tVV/wAJVVV2mXaZ///vKqv/ABFVVf//81VV/wAUqqv///NVVf8AFKqr///3qqv/ABeAAIf/ABpVVYf/ABpVVYv/ABvVVo//AB1VVf8ABKqr/wAjVVWW/wAgqqv/ABFVVan/ABFVVan/ABWAAP8AGdVV/wAZqqv/ABWqqwj/ABmqq/8AFaqrqJz/ACBVVf8ADFVV/wAgVVX/AAxVVf8AIdVW/wAGKqv/ACNVVYv/ACNVVYv/ACAqq4Wof6h//wAYVVX//+8qq/8AE6qr///qVVX/ABOqq///6lVV/wAOKqr//+Yqq/8ACKqrbf8ACKqrbY1q///7VVVnCIdt///4Kqtv///0VVVx///0VVVxfP//6Kqr///tqqv//+tVVf//7aqr///rVVX//+pVVf//7tVWcv//8lVVcv//8lVV///kKqv///aAAP//4VVV///6qqsICyz7eMaL9wH3eAUL6vd4UIv7Aft4BQv///1VVf//6qqr/wABVVb//+wqqv8ABVVV///tqqv/AAVVVf//7aqr/wAIqqv//+/VVZd9l33/AA6qq4D/ABFVVYP/ABFVVYP/ABNVVof/ABVVVYv/ABSqq4v/ABRVVY+fk5+T/wAR1VWW/wAPqquZCP8AD6qrmf8ADSqq/wAQKqv/AAqqq/8AElVV/wAKqqv/ABJVVf8ABqqq/wAT1Vb/AAKqq/8AFVVV/wACqqv/ABSqq////qqq/wATqqr///qqq/8AEqqr///6qqv/ABKqq///94AA/wAQVVX///RVVZn///RVVZn///FVVpb//+5VVZP//+5VVZP//+zVVo///+tVVYsI///qqquL///rgACH///sVVWD///sVVWD///uVVaA///wVVV9///wVVV9///yqqv//++qq4D//+1VVYD//+1VVf//+Sqr///sVVb///1VVf//61VVCAuN/wAOqqv/AASqq/8ADaqq/wAHVVX/AAyqq/8AB1VV/wAMqqv/AAkqq5aW/wAJVVWW/wAJVVX/AAwqq/8AB4AA/wANVVX/AAWqq/8ADVVV/wAFqquZ/wAC1VX/AA6qq4v/AB1VVYv/ABdVVv//9dVV/wARVVX//+uqq/8AEVVV///rqqv/AAaqq///5yqqh///4qqrCIn///FVVf//+1VV///yVVb///iqq///81VV///4qqv///NVVYL///TVVv//9VVV///2VVX///VVVf//9lVVf///+IAA///yqqv///qqq///8qqr///6qqt9///9VVX///FVVYv//+Kqq4v//+iAAP8ACiqr///uVVX/ABRVVf//7lVV/wAUVVX///kqq/8AGNVWj/8AHVVVCAtrBoN1///0gAD//+2AAHx8fHz//+wqq///+IAA///nVVWLd4v//+qqq/8AA9VV///pVVX/AAeqq///6VVV/wAHqqv//+lVVv8ACIAA///pVVX/AAlVVXP/AAlVVf//6FVV/wAIVVb//+iqq/8AB1VV///oqqv/AAdVVXX/AAOqq///61VViwj//+yqq4v//+8qqv///IAA///xqquE///xqquE///zgAD///aAAP//9VVVf///9VVVf///9tVW///yVVX///hVVf//8Kqr///4VVX///Cqq///+dVWe///+1VV///vVVUIrAb/AAdVVf8AFVVV/wAL1Vb/ABKqq/8AEFVVm/8AEFVVm/8AE9VWk/8AF1VVi/8AE1VVi/8AFKqr///8VVWh///4qquh///4qqv/ABaqq///96qq/wAXVVX///aqq/8AF1VV///2qqv/ABeAAP//94AA/wAXqqv///hVVf8AF6qr///4VVX/ABYqqv///Cqr/wAUqquLCP8AEqqri/8AEIAA/wADgAD/AA5VVZL/AA5VVZL/AAyqq/8ACVVVlv8AC6qrlv8AC6qr/wAJVVX/AA2AAP8AB6qr/wAPVVX/AAeqq/8AD1VV/wAGKqr/AA+qq/8ABKqrmwgLAAAAAQAAAAwAAAAWAAAAAgABAAEBggABAAQAAAACAAAAAAABAAAACgAcAB4AAURGTFQACAAEAAAAAP//AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAA//8AAQAAAAFrZXJuAAgAAAABAAAAAQAEAAIAAAADAAwO+hkcAAEOhAAEAAAAMwBwAKoA5AEWAVABfgLAA/4FBAYOBpgGDgaqBg4HQAdOB1gHZgdmB2YHZgdmB2YHtAdYB1gHZgdmB2YI3gloCWgJaAmqCjQKcgo0CnIKNApyCxwLHAySDRwOQge0B1gHtAscDlAOVgAOADj/zgBY/+4Anv+2AL7/7gDA/+4BHv+8ASD/vAEw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/7YAWP/JAG7/kQCB/7YAgv+2AIP/tgCE/7YAhf+2AIb/tgCH/7YAof+kAKL/pACj/6QApP+kAKX/pACm/6QAp/+kAKn/pACq/6QAq/+kAKz/pACt//kArv/5AK//+QCw//kAs/+kALT/pAC1/6QAtv+kALf/pAC5/6QAuv+2ALv/tgC8/7YAvf+2AMH/tgDC/6QAw/+2AMT/pADF/7YAxv+kANT/pADW/6QA2P+kANr/pADc/6QA6v/5AOz/+QDu//kA8P/5APL/+QEJ/6QBC/+kAQ3/pAEP/6QBJf+2ASf/tgEp/7YBK/+2AS3/tgEv/7YBWf+dACIAAwBiAAQAYgAJAJAAIQCQAEQAeABIAHgASgB4AEsAeABMAHgATQB4AE4AeABWAHgArQB4AK4AeACvAHgAsAB4AOYAeADqAHgA7AB4AO4AeADwAHgA8gB4APQAeAD2AHgA+AB4APoAeAD8AHgBHwB4ASEAeAE/AHgBUACQAVEAkAFTAGIBVABiABAANv+kADj/pAA5/8kAO/+RAFv/2wCe/5EAvv/bAMD/2wEe/6QBIP+kATD/yQEy/5EBM//bATT/kQE+/6QBUf+RACIAAwBiAAQAYgAJAJAAIQCIAEQAeABIAFgASgB4AEsAeABMAHgATQB4AE4AeABWAHgArQB4AK4AeACvAHgAsAB4AOYAeADqAHgA7AB4AO4AeADwAHgA8gB4APQAeAD2AHgA+AB4APoAeAD8AHgBHwB4ASEAeAE/AHgBUACQAVEAkAFTAGIBVABiAA8ANgAGADgABgA5AAYAO//zAFsAGACe//MAvgAYAMAAGAEeAAYBIAAGATAABgEy//MBMwAYATT/8wE+AAYAKgAO/6QAD//JABD/pABF/+4ARv/uAEf/7gBQABIAUf/uAFP/7gBu/8kAqP/uAKn/7gCq/+4Aq//uAKz/7gCx/+4AsgASALP/7gC0/+4Atf/uALb/7gC3/+4Auf/uAMj/7gDK/+4AzP/uAM7/7gDQ/+4A0v/uANT/7gDW/+4A2P/uANr/7gDc/+4BAgASAQQAEgEGABIBCf/uAQv/7gEN/+4BD//uAVn/pABdAA7/kQAP/38AEP+RABz/kQAd/5EAI/+8AEP/kQBF/5EAR/+RAEsAGABR/5EAVP+kAFX/kQBX/6QAWf+RAFv/kQBu/38Agf+8AIL/vACD/7wAhP+8AIX/vACG/7wAh/+8AKH/kQCi/5EAo/+RAKT/kQCl/5EApv+RAKf/kQCo/5EAqf+RAKr/kQCr/5EArP+RAK0AGACuABgArwAYALAAGACz/5EAtP+RALX/kQC2/5EAt/+RALn/kQC6/6QAu/+kALz/pAC9/6QAvv+RAMD/kQDB/7wAwv+RAMP/vADE/5EAxf+8AMb/kQDI/5EAyv+RAMz/kQDO/5EA1P+RANb/kQDY/5EA2v+RANz/kQDqABgA7AAYAO4AGADwABgA8gAYAQn/kQEL/5EBDf+RAQ//kQER/6QBE/+kARX/pAEX/5EBGf+RARv/kQEd/5EBJf+kASf/pAEp/6QBK/+kAS3/pAEv/6QBMf+RATP/kQE9/5EBWf+RACIAAwAMAAQADAAJAEIAIQBCAEQAGABIABgASgAYAEsAGABMABgATQAYAE4AGABWAA4ArQAYAK4AGACvABgAsAAYAOYAGADqABgA7AAYAO4AGADwABgA8gAYAPQAGAD2ABgA+AAYAPoAGAD8ABgBHwAOASEADgE/AA4BUABCAVEAQgFTAAwBVAAMAEkADv+2ABD/tgAc/+4AHf/uACP/7gBD/9sAR//uAEsAGABR/+4AVP/uAFf/7gCB/+4Agv/uAIP/7gCE/+4Ahf/uAIb/7gCH/+4Aof/bAKL/2wCj/9sApP/bAKX/2wCm/9sAp//bAKn/7gCq/+4Aq//uAKz/7gCtABgArgAYAK8AGACwABgAs//uALT/7gC1/+4Atv/uALf/7gC5/+4Auv/uALv/7gC8/+4Avf/uAMH/7gDC/9sAw//uAMT/2wDF/+4Axv/bANT/7gDW/+4A2P/uANr/7gDc/+4A6gAYAOwAGADuABgA8AAYAPIAGAEJ/+4BC//uAQ3/7gEP/+4BEf/uARP/7gEV/+4BJf/uASf/7gEp/+4BK//uAS3/7gEv/+4BWf+2AAMADv/JABD/yQFZ/8kACwBV/5EAVv/uARf/kQEZ/5EBG/+RAR3/kQEf/+4BIf/uAT3/kQE//+4BUf+JAAEAKQAoADIAOABGAE4AVgBYAFsAgQCCAIMAhACFAIYAngC+AMAAwQDDAMUA0AD3APkA+wD8ARABEQESARMBFAEVAR4BIAEhATABMQEyATMBNAE+AVEAAgN6AAQAAAEgAbQACAARAAD/vP/7/7b/7v/uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6T/yf+RAAD/2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAb/8wAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/kf+R/3//kf+8/5H/kf+RABj/kf+k/5H/pAAAAAAAAAAAAAAAAAAA/7b/7v/bAAD/7gAY/+7/7gAA/+4AAAAAAAAAAAAAAAD/kf+d/7b/pAAA/6T/+f+kAAAAAP+2AAAAAAAAAAAAAAAA/8n/pAAAAAD/7v/uAAD/7gAAAAAAAAAAAAAAAAAAAAAAAAAA/8kAAAAAAAAAAAAAAAAAAAAAAAAAAgAYAC4ALgABADQANAACADYANgADADkAOQAEADsAOwAFAFQAVAAGAFkAWQAHAJ4AngAFAPcA9wABAPkA+QABAPsA+wABARABEAACAREBEQAGARIBEgACARMBEwAGARQBFAACARUBFQAGAR4BHgADASABIAADATABMAAEATEBMQAHATIBMgAFATQBNAAFAT4BPgADAAIASwAPAA8ABgAQABAABwAjACMACAA2ADYAAQA5ADkAAgA7ADsAAwBDAEMACQBFAEUACgBHAEcACwBLAEsADABRAFEADQBUAFQADgBVAFUADwBXAFcAEABZAFkABABbAFsABQBuAG4ABgCBAIcACACeAJ4AAwChAKcACQCoAKgACgCpAKwACwCtALAADACzALcADQC5ALkADQC6AL0AEAC+AL4ABQDAAMAABQDBAMEACADCAMIACQDDAMMACADEAMQACQDFAMUACADGAMYACQDIAMgACgDKAMoACgDMAMwACgDOAM4ACgDUANQACwDWANYACwDYANgACwDaANoACwDcANwACwDqAOoADADsAOwADADuAO4ADADwAPAADADyAPIADAEJAQkADQELAQsADQENAQ0ADQEPAQ8ADQERAREADgETARMADgEVARUADgEXARcADwEZARkADwEbARsADwEdAR0ADwEeAR4AAQEgASAAAQElASUAEAEnAScAEAEpASkAEAErASsAEAEtAS0AEAEvAS8AEAEwATAAAgExATEABAEyATIAAwEzATMABQE0ATQAAwE9AT0ADwE+AT4AAQFZAVkABwABACIAIwAuADQANgA5ADsAVABZAIEAggCDAIQAhQCGAJ4AwQDDAMUA9wD5APsBEAERARIBEwEUARUBHgEgATABMQEyATQBPgAAAgAAAAAAAAABBAAAAXIAjQIIAOQCCAAtAggALgMvAHECwABSAQQApwEEAFoBBP/7AbwAdAKaAHUBBAAeAU0ASAEEAFYBcgAGAggAQgIIAK4CCAApAggAOgIIAC8CCAA4AggANgIIAF4CCABBAggAXwEEAFYBBAAeApoAeQKaAGsCmgBYAc8AfgMgAFgCrQAFAnYAYQLAAF8C5QBYAlEAYQIsAGEDCgBfAtIAYQEEAGEB4gAYAmMAYQH0AGEDeQBaAwoAYQNCAF8CPgBhA0IAYQJRAGECLABBAj4AZwKsAHUCUQBgA7AAaAJjAAECPgBdAiwAFwEEADQBcgBrAQQADgKaAHUB9P/vAPAAXQIHAEoCYwBDAeEAUgJjAFICLABSASgASwJjADACLABQAPAAWgDw/8IB4QBQAPAAWgNUAFACLABQAlIAUgJjACICYwBSAU0AUAGqACcBTQBHAiwAYQHPAE8CwABPAeEABgHP//gBqgAbAU0AZwDeADMBTQAlApoAjQEEAAABcgB7AggAUQIIADoCCAAhAggAUgDeAD4CCAA8APAAQwMgAEkBUQBnAeEAYAKaAH8BTQArAyAASQDwAEkBkACHApoAWAFSAD8BUgBPAPAAjQIsACoCWACBAQQAfQDwAAUBUgCbAYIAcAHhAFEDCgByAwoAaQMKAEgBzwAYAq0ABQKtAAUCrQAFAq0ABQKtAAUCrQAFA57/+wLAAF8CUQBhAlEAYQJRAGECUQBhAQQAYQEEAGEBBABcAQQAYQLlADoDCgBhA0IAXwNCAF8DQgBfA0IAXwNCAF8CmgByA0IARgKsAHUCrAB1AqwAdQKsAHUCPgBdAj4AYQJRAFACBwBKAgcASgIHAEoCBwBKAgcASgIHAEoDVABFAeEAUgIsAFICLABSAiwAUgIsAFIA8ABaAPAAWgDwADgA8ABDAlIAUgIsAFACUgBSAlIAUgJSAFICUgBSAlIAUgKaAHUCUgAnAiwAYQIsAGECLABhAiwAYQHP//gCYwAiAc//+AKtAAUCBwBKAq0ABQIHAEoCrQAFAgcASgLAAF8B4QBSAsAAXwHhAFICwABfAeEAUgLAAF8B4QBSAuUAWAJjAFIC5QA6AmMAUgJRAGECLABSAlEAYQIsAFICUQBhAiwAUgJRAGECLABSAlEAYQIsAFIDCgBfAmMAMAMKAF8CYwAwAwoAXwJjADADCgBfAmMAMALSAGECLABQAtIAYQIsAFABBABTAPAALwEEAGEA8ABKAQT//gDw//QBBABhAPAAWgLEAGEBxwBaAeIAGADw/8ICYwBhAeEAUAH0AGEA8ABaAfQAYQDwAB4B9ABhAPAAWgH0AGEBUABaAfQAMADwACcDCgBhAiwAUAMKAGECLABQAwoAYQIsAFACLABQA0IAXwJSAFIDQgBfAlIAUgNCAF8CUgBSA7AAaAOLAEgCUQBhAU0AUAJRAGEBTQAtAlEAYQFNAFACLABBAaoAJwIsAEEBqgAnAiwAQQGqACcCLABBAaoAJwI+AGcBTQBHAj4AZwFNAEcCPgBnAU0AQQKsAHUCLABhAqwAdQIsAGECrAB1AiwAYQKsAHUCLABhAqwAdQIsAGECrAB1AiwAYQOwAGgCwABPAj4AXQHP//gCPgBdAiwAFwGqABsCLAAXAaoAGwIsABcBqgAbAgj/4AIsAEEBqgAnAj4AZwFNAEcA8P/CAPAAOADwAEkA8ABJAPAASgDwAKUA8AB0APD/9wDwAC0A8ABEAp4ADwLoAC8CLAAqAjMAYAH0AB0D6AAdAQQAgQEEAIEBBAAqAggArAIIAKwCCABVAggAZgIIADAB9AB4A+gAewPVAEEBOwBgATsAUQCo/1kB1gA7AfQAbAPeALAC6AAvAfQALAHwADkCngAPAscARwJcABkCmgB1AKj/WQEEAH0B7f/4AuUAKQIfAGUCmgBbApoAaQKaAFkCmgBZAlEAXwDwAHcA8ACnAPAAUgDwAGMA8ABIAPAAXgDwAGQA8ABiAPAAjwDwAF4A8ADAAPAAcQDwAAkA8ACZAgAAAAIHAEsASwAAAAAAAQAAAADQcD/WAAAAAMJXVuQAAAAAzEYHQA==\n".trim(),
    AvenirHeavy: "data:application/font-woff;charset=utf-8;base64,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AHMAZQByAGkAZgAgAHQAeQBwAGUAZgBhAGMAZQBzAC4AIABJAG4AIABhAG4AIABpAG4AdABlAHIAdgBpAGUAdwAgAHcAaQB0AGgAIABMAGkAbgBvAHQAeQBwAGUALAAgAGgAZQAgAHMAYQBpAGQAIABoAGUAIABmAGUAbAB0ACAAYQBuACAAbwBiAGwAaQBnAGEAdABpAG8AbgAgAHQAbwAgAGQAZQBzAGkAZwBuACAAYQAgAGwAaQBuAGUAYQByACAAcwBhAG4AcwAgAGkAbgAgAHQAaABlACAAdAByAGEAZABpAHQAaQBvAG4AIABvAGYAIABFAHIAYgBhAHIAIABhAG4AZAAgAEYAdQB0AHUAcgBhACwAIABiAHUAdAAgAHQAbwAgAGEAbABzAG8AIABtAGEAawBlACAAdQBzAGUAIABvAGYAIAB0AGgAZQAgAGUAeABwAGUAcgBpAGUAbgBjAGUAIABhAG4AZAAgAHMAdAB5AGwAaQBzAHQAaQBjACAAZABlAHYAZQBsAG8AcABtAGUAbgB0AHMAIABvAGYAIAB0AGgAZQAgAHQAdwBlAG4AdABpAGUAdABoACAAYwBlAG4AdAB1AHIAeQAuACAAVABoAGUAIAB3AG8AcgBkACAAQQB2AGUAbgBpAHIAIABtAGUAYQBuAHMAIAAnAGYAdQB0AHUAcgBlACcAIABpAG4AIABGAHIAZQBuAGMAaAAgAGEAbgBkACAAaABpAG4AdABzACAAdABoAGEAdAAgAHQAaABlACAAdAB5AHAAZQBmAGEAYwBlACAAbwB3AGUAcwAgAHMAbwBtAGUAIABvAGYAIABpAHQAcwAgAGkAbgB0AGUAcgBwAHIAZQB0AGEAdABpAG8AbgAgAHQAbwAgAEYAdQB0AHUAcgBhAC4AIABCAHUAdAAgAHUAbgBsAGkAawBlACAARgB1AHQAdQByAGEALAAgAEEAdgBlAG4AaQByACAAaQBzACAAbgBvAHQAIABwAHUAcgBlAGwAeQAgAGcAZQBvAG0AZQB0AHIAaQBjADsAIABpAHQAIABoAGEAcwAgAHYAZQByAHQAaQBjAGEAbAAgAHMAdAByAG8AawBlAHMAIAB0AGgAYQB0ACAAYQByAGUAIAB0AGgAaQBjAGsAZQByACAAdABoAGEAbgAgAHQAaABlACAAaABvAHIAaQB6AG8AbgB0AGEAbABzACwAIABhAG4AIAAiAG8AIgAgAHQAaABhAHQAIABpAHMAIABuAG8AdAAgAGEAIABwAGUAcgBmAGUAYwB0ACAAYwBpAHIAYwBsAGUALAAgAGEAbgBkACAAcwBoAG8AcgB0AGUAbgBlAGQAIABhAHMAYwBlAG4AZABlAHIAcwAuACAAVABoAGUAcwBlACAAbgB1AGEAbgBjAGUAcwAgAGEAaQBkACAAaQBuACAAbABlAGcAaQBiAGkAbABpAHQAeQAgAGEAbgBkACAAZwBpAHYAZQAgAEEAdgBlAG4AaQByACAAYQAgAGgAYQByAG0AbwBuAGkAbwB1AHMAIABhAG4AZAAgAHMAZQBuAHMAaQBiAGwAZQAgAGEAcABwAGUAYQByAGEAbgBjAGUAIABmAG8AcgAgAGIAbwB0AGgAIAB0AGUAeAB0AHMAIABhAG4AZAAgAGgAZQBhAGQAbABpAG4AZQBzAC4AIABJAG4AIAAyADAAMAA0ACAAQQBkAHIAaQBhAG4AIABGAHIAdQB0AGkAZwBlAHIAIABhAG4AZAAgAHQAaABlACAAdAB5AHAAZQAgAGQAaQByAGUAYwB0AG8AcgAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgAIAAgAEEAawBpAHIAYQAgAEsAbwBiAGEAeQBhAHMAaABpACAAcgBlAHcAbwByAGsAZQBkACAAdABoAGUAIABBAHYAZQBuAGkAcgAgAGEAbgBkACAAYwByAGUAYQB0AGUAZAAgAHQAaABlACAAQQB2AGUAbgBpAHIAIABOAGUAeAB0ACAAZgBvAHIAIAB0AGgAZQAgAFAAbABhAHQAaQBuAHUAbQAgAEMAbwBsAGwAZQBjAHQAaQBvAG4ALgAgAABBZHJpYW4gRnJ1dGlnZXIgZGVzaWduZWQgQXZlbmlyIGluIDE5ODgsIGFmdGVyIHllYXJzIG9mIGhhdmluZyBhbiBpbnRlcmVzdCBpbiBzYW5zIHNlcmlmIHR5cGVmYWNlcy4gSW4gYW4gaW50ZXJ2aWV3IHdpdGggTGlub3R5cGUsIGhlIHNhaWQgaGUgZmVsdCBhbiBvYmxpZ2F0aW9uIHRvIGRlc2lnbiBhIGxpbmVhciBzYW5zIGluIHRoZSB0cmFkaXRpb24gb2YgRXJiYXIgYW5kIEZ1dHVyYSwgYnV0IHRvIGFsc28gbWFrZSB1c2Ugb2YgdGhlIGV4cGVyaWVuY2UgYW5kIHN0eWxpc3RpYyBkZXZlbG9wbWVudHMgb2YgdGhlIHR3ZW50aWV0aCBjZW50dXJ5LiBUaGUgd29yZCBBdmVuaXIgbWVhbnMgJ2Z1dHVyZScgaW4gRnJlbmNoIGFuZCBoaW50cyB0aGF0IHRoZSB0eXBlZmFjZSBvd2VzIHNvbWUgb2YgaXRzIGludGVycHJldGF0aW9uIHRvIEZ1dHVyYS4gQnV0IHVubGlrZSBGdXR1cmEsIEF2ZW5pciBpcyBub3QgcHVyZWx5IGdlb21ldHJpYzsgaXQgaGFzIHZlcnRpY2FsIHN0cm9rZXMgdGhhdCBhcmUgdGhpY2tlciB0aGFuIHRoZSBob3Jpem9udGFscywgYW4gIm8iIHRoYXQgaXMgbm90IGEgcGVyZmVjdCBjaXJjbGUsIGFuZCBzaG9ydGVuZWQgYXNjZW5kZXJzLiBUaGVzZSBudWFuY2VzIGFpZCBpbiBsZWdpYmlsaXR5IGFuZCBnaXZlIEF2ZW5pciBhIGhhcm1vbmlvdXMgYW5kIHNlbnNpYmxlIGFwcGVhcmFuY2UgZm9yIGJvdGggdGV4dHMgYW5kIGhlYWRsaW5lcy4gSW4gMjAwNCBBZHJpYW4gRnJ1dGlnZXIgYW5kIHRoZSB0eXBlIGRpcmVjdG9yIG9mIExpbm90eXBlIEdtYkggIEFraXJhIEtvYmF5YXNoaSByZXdvcmtlZCB0aGUgQXZlbmlyIGFuZCBjcmVhdGVkIHRoZSBBdmVuaXIgTmV4dCBmb3IgdGhlIFBsYXRpbnVtIENvbGxlY3Rpb24uIAAAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAABodHRwOi8vd3d3Lmxpbm90eXBlLmNvbQAAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAC8AZgBvAG4AdABkAGUAcwBpAGcAbgBlAHIAcwAAaHR0cDovL3d3dy5saW5vdHlwZS5jb20vZm9udGRlc2lnbmVycwAAQQB2AGUAbgBpAHIAAEF2ZW5pcgAASABlAGEAdgB5AABIZWF2eQAAQQB2AGUAbgBpAHIAIABIAGUAYQB2AHkAAEF2ZW5pciBIZWF2eQAAAAAAAAMAAAADAAAAHAABAAAAAALUAAMAAQAAABwABAK4AAAAqgCAAAYAKgANAH4BNwFJAX4BkgGhAbABwQHcAeMB7QH1AhsCHwIzAjcCvALHAskC3QLuAwQDDAMPAxEDGwMoAy4DMQNBA0QDfgOKA4wDoQPOBAwETwRcBF8EkQTABNUemR75IBQgGiAeICIgJiAwIDogRCCsIQMhCSETIRYhIiEmISshLiF/IgIiBiIPIhIiFSIaIh4iKyJIImAiZSXK4w34//sC/hD+Fv4Z/jj+SP//AAAADQAgAKABOQFMAZIBoAGvAcABwwHeAeYB8AH4Ah4CJgI3ArsCxgLJAtgC7gMAAwYDDwMRAxsDIwMtAzADQANEA34DhAOMA44DowQBBA4EUQReBJAEwATUHgAeoCATIBggHCAgICYgMCA5IEQgrCEDIQkhEyEWISIhJiEqIS4hYCICIgYiDyIRIhUiGSIeIisiSCJgImQlyuMA+P/7Af4Q/hP+Gf4x/kf////0/+L/wf/A/77/q/+e/5H/gv+B/4D/fv98/3r/eP9y/2/+7P7j/uL+1P7E/rP+sv6w/q/+pv6f/pv+mv6M/or+Uf5M/kv+Sv5J/hf+Fv4V/hT95P22/aPkeeRz41rjV+NW41XjUuNJ40HjOOLR4nviduJt4mviYOJd4lriWOIn4aXhouGa4Znhl+GU4ZHhheFp4VLhT93rILYKxQjEBbcFtQWzBZwFjgABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgIKAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAMABAAFAAYABwAIAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAAACFAIYAiACKAJIAlwCdAKIAoQCjAKUApACmAKgAqgCpAKsArACuAK0ArwCwALIAtACzALUAtwC2ALsAugC8AL0DdQBxAGMAZABoA3cAdwCgAG8AagOCAHUAaQOyAIcAmQOvAHIDswO0AGYAdgOnA6oDqQIJA7AAawB7AfIApwC5AIAAYgBtA64BPQOxA6gAbAB8A3gAYQCBAIQAlgEQAREDbQNuA3IDcwNvA3AAuAO1AMABNgN8A30DegN7A8UDxgN2AHgDcQN0A3kAgwCLAIIAjACJAI4AjwCQAI0AlACVA8QAkwCbAJwAmgDyAakBsABwAawBrQGuAHkBsQGvAaoAAAADAAAAAAAA/7UAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAQAEBAABAQENQXZlbmlyLUhlYXZ5AAECAAEAPhwEeQAcBHoBHAR7AhwEfAP4EwRZDAP8VvxFHAWR+voFHQAAIQAPHQAAAAAQHQAAKK0RHQAAAB8dAAGXARIC9gIAAQARABgAHwAmAC0AMwA5AEAARwBNAFMAXgBpAHMAfQCDAIkAjwCVAJsAoQCoAK8AtQC7AMUAzwDWAN0A4wDpAPQA/wEFAQsBFQEfASsBNwFCAU0BUQFVAVsBYQFoAW8BdQF7AYIBiQGTAZUBlwGiAa0BuQHFAcsB0QHdAekB7wH1AfkB/QIDAgkCFQIhAicCLQI4Aj8CRgJMAlICXwJsAnICeAKEApAClgKcAqICqAKzAr4CxgLOAtYC3gLkAuoC7gLyAvgC/gMFAwwDEgMYAx0DIgMvAzwDQwNKA1UDYANrA3YDfAOCA4wDlgObA6ADpQOqA7UDwQPPA9YD3QPkA+YD6APqA+wD7gPwA/YD/AQCBAgEDgQUBBoEIAQvBD4ETARaBGgEdgSEBJIEoQSwBLoExATMBNQE2gTgBOYE7ATzBPoFBwUUBRoFHAUeBSAFJgUsBTIFOAVCBUwFUwVaBWUFcAV5BYIFkAWeBacFsAW+BcwF1QXeBewF+gYDBgwGGgYoBjEGOgZIBlYGXwZoBnYGhAaQBpwGowaqBrAGtgbABsoG0gbaBukG+AcEBxAHGgckBzQHRAdLB1IHWgdoB3EHeAd/B4cHjwecB6QHrQe1B8EHzAfYB98H7gf2CAQIFAgbCCYINghCCE8IWQhiCHQIgQiOCJwIqAi0CMUI0gjXCNwI4QjqCO8I9Aj5CP4JAwkICQ0JEgkXCRwJIQkmCSsJMAk1CToJPwlECUkJTglTCVgJXQliCWcJbAlxCXYJewmACYUJigmPCZQJmQmeCaMJqAmtCbIJtwm8CcEJxgnLCdAJ1QnaCd8J5AnpCe4J8wn4Cf0KAgoHCgwKEQoWChsKIAolCioKLwo0CjkKPgpDCkgKTQpSClcKXAphCmYKawpwCnUKegp/CoQKiQqOCpMKmAqdCqIKpwqsCrEKtgq7CsAKxQrKCs8K1ArZCt4K4wroCu0K8gr3CvwLAQsGCwsLEAsVCxoLHwskCykLLgszCzgLPQtCC0cLTAtRC1YLWwtgC2ULagtvC3QLeQt+C4MLiAuNC5ILlwucC6ELpgurC7ALtQu6C78LxAvJC84L0wvYC90L4gvnC+wL8Qv2C/sMAAwFDAoMDwwUDCQMLww6DEQMTgxYDGIMawx0DH4MiAyVDKIMrAy2DL8MyAzSDNwM6Az0DQQNFA0gDSwNOA1EDVQNZA1vDXoNhw2UDZ4NqA2vDbYNwA3KDdMN3A3lDe4N9g3+DgkOFA4fDioOOA5GDkwOUg5bDmQObg54DoEOig6ZDqgOsg68DswO3A7iDugO8g78DwUPDg8YDyIPKw80Dz4PSA9YD2gPcw9+D4wPmg+mD7IPvg/KD9AP1g/gD+oP9A/+EAcQEBAfEC4QOBBCEEwQVhBfEGgQdxCGEJUQpBC2EMgQ0hDcEOUQ7hD4EQIREhEiETARPhFJEVQRZBF0EX8RihGZEagRrhG0Eb0RxhHMEdIR2BHeEecR8BH6EgQSDRIWEiASKhIzEjwSRhJQElsSZhJvEngSghKMEpYSnxKkEqkSshK7EsUSzxLfEu8S/xMPEyMTNxNHE1cTahN9E4gTkxOeE6kTuBPHE9IT3RPrE/kUAhQLFBUUHxQlFCsUOxRLFFsUaxR/FJMUoxSzFMYU2RTjFO0U9hT/FQgVERUbFSUVNRVFFVUVZRV5FY0VnRWtFcAV0xXdFecV8RX7FgkWFxYhFisWOBZFFk4WVxZhFmsWdRZ/FokWkxahFq8WuRbDFtAW3RbjFukW8hb7FwUXDxcVFxsXHxcpFzMXPBdBF0YXTBdUF10XZRdtF3cXgBeJF5EXmxelF64XthfBF8wX0xfaF+EX6BfwF/gYAhgLGBQYHBgmGDAYORhBGEwYVxheGGUYbBh5GIQYiRiQGJkYoBinGK4Ythi+GMkY0RjaGOYY7Rj2GP8ZDRkWGR8ZKxk1GT4ZRhlWGWMZbBl3GYYZjRmUGZsZohmpGbAZtxnFGdMZ5Rn7GgwaHhovGkEaSBpPGlYanRqpGrVub25tYXJraW5ncmV0dXJudW5pMDBBMHVuaTAwQURBbWFjcm9uYW1hY3JvbkFicmV2ZWFicmV2ZUFvZ29uZWthb2dvbmVrQ2FjdXRlY2FjdXRlQ2NpcmN1bWZsZXhjY2lyY3VtZmxleENkb3RhY2NlbnRjZG90YWNjZW50Q2Nhcm9uY2Nhcm9uRGNhcm9uZGNhcm9uRGNyb2F0ZGNyb2F0RW1hY3JvbmVtYWNyb25FYnJldmVlYnJldmVFZG90YWNjZW50ZWRvdGFjY2VudEVvZ29uZWtlb2dvbmVrRWNhcm9uZWNhcm9uR2NpcmN1bWZsZXhnY2lyY3VtZmxleEdicmV2ZWdicmV2ZUdkb3RhY2NlbnRnZG90YWNjZW50R2NvbW1hYWNjZW50Z2NvbW1hYWNjZW50SGNpcmN1bWZsZXhoY2lyY3VtZmxleEhiYXJoYmFySXRpbGRlaXRpbGRlSW1hY3JvbmltYWNyb25JYnJldmVpYnJldmVJb2dvbmVraW9nb25la0lkb3RhY2NlbnRJSmlqSmNpcmN1bWZsZXhqY2lyY3VtZmxleEtjb21tYWFjY2VudGtjb21tYWFjY2VudExhY3V0ZWxhY3V0ZUxjb21tYWFjY2VudGxjb21tYWFjY2VudExjYXJvbmxjYXJvbkxkb3RsZG90TmFjdXRlbmFjdXRlTmNvbW1hYWNjZW50bmNvbW1hYWNjZW50TmNhcm9ubmNhcm9ubmFwb3N0cm9waGVPbWFjcm9ub21hY3Jvbk9icmV2ZW9icmV2ZU9odW5nYXJ1bWxhdXRvaHVuZ2FydW1sYXV0UmFjdXRlcmFjdXRlUmNvbW1hYWNjZW50cmNvbW1hYWNjZW50UmNhcm9ucmNhcm9uU2FjdXRlc2FjdXRlU2NpcmN1bWZsZXhzY2lyY3VtZmxleFNjZWRpbGxhc2NlZGlsbGFUY2VkaWxsYXRjZWRpbGxhVGNhcm9udGNhcm9uVGJhcnRiYXJVdGlsZGV1dGlsZGVVbWFjcm9udW1hY3JvblVicmV2ZXVicmV2ZVVyaW5ndXJpbmdVaHVuZ2FydW1sYXV0dWh1bmdhcnVtbGF1dFVvZ29uZWt1b2dvbmVrV2NpcmN1bWZsZXh3Y2lyY3VtZmxleFljaXJjdW1mbGV4eWNpcmN1bWZsZXhaYWN1dGV6YWN1dGVaZG90YWNjZW50emRvdGFjY2VudE9ob3Jub2hvcm5VaG9ybnVob3JuY2xpY2tkZW50YWxjbGlja2xhdGVyYWxjbGlja3JldHJvZmxleERaY2Fyb25EemNhcm9uZHpjYXJvbkxKTGpsak5KTmpuakFjYXJvbmFjYXJvbkljYXJvbmljYXJvbk9jYXJvbm9jYXJvblVjYXJvbnVjYXJvblVkaWVyZXNpc21hY3JvbnVkaWVyZXNpc21hY3JvblVkaWVyZXNpc2FjdXRldWRpZXJlc2lzYWN1dGVVZGllcmVzaXNjYXJvbnVkaWVyZXNpc2Nhcm9uVWRpZXJlc2lzZ3JhdmV1ZGllcmVzaXNncmF2ZUFkaWVyZXNpc21hY3JvbmFkaWVyZXNpc21hY3JvbkFkb3RtYWNyb25hZG90bWFjcm9uQUVtYWNyb25hZW1hY3JvbkdjYXJvbmdjYXJvbktjYXJvbmtjYXJvbk9vZ29uZWtvb2dvbmVrT29nb25la21hY3Jvbm9vZ29uZWttYWNyb25qY2Fyb25EWkR6ZHpHYWN1dGVnYWN1dGVOZ3JhdmVuZ3JhdmVBcmluZ2FjdXRlYXJpbmdhY3V0ZUFFYWN1dGVhZWFjdXRlT3NsYXNoYWN1dGVvc2xhc2hhY3V0ZUFkYmxncmF2ZWFkYmxncmF2ZUFpbnZlcnRlZGJyZXZlYWludmVydGVkYnJldmVFZGJsZ3JhdmVlZGJsZ3JhdmVFaW52ZXJ0ZWRicmV2ZWVpbnZlcnRlZGJyZXZlSWRibGdyYXZlaWRibGdyYXZlSWludmVydGVkYnJldmVpaW52ZXJ0ZWRicmV2ZU9kYmxncmF2ZW9kYmxncmF2ZU9pbnZlcnRlZGJyZXZlb2ludmVydGVkYnJldmVSZGJsZ3JhdmVyZGJsZ3JhdmVSaW52ZXJ0ZWRicmV2ZXJpbnZlcnRlZGJyZXZlVWRibGdyYXZldWRibGdyYXZlVWludmVydGVkYnJldmV1aW52ZXJ0ZWRicmV2ZVNjb21tYWFjY2VudHNjb21tYWFjY2VudHVuaTAyMUF1bmkwMjFCSGNhcm9uaGNhcm9uQWRvdGFjY2VudGFkb3RhY2NlbnRFY2VkaWxsYWVjZWRpbGxhT2RpZXJlc2lzbWFjcm9ub2RpZXJlc2lzbWFjcm9uT3RpbGRlbWFjcm9ub3RpbGRlbWFjcm9uT2RvdGFjY2VudG9kb3RhY2NlbnRPZG90YWNjZW50bWFjcm9ub2RvdGFjY2VudG1hY3JvblltYWNyb255bWFjcm9uZG90bGVzc2pjb21tYXR1cm5lZG1vZGFmaWk1NzkyOXVuaTAyQzl1bmkwMkVFZ3JhdmVjbWJhY3V0ZWNtYmNpcmN1bWZsZXhjbWJ0aWxkZWNtYm1hY3JvbmNtYmJyZXZlY21iZG90YWNjZW50Y21iZGllcmVzaXNjbWJob29rYWJvdmVjbWJyaW5nY21iaHVuZ2FydW1sYXV0Y21iY2Fyb25jbWJkb3VibGVncmF2ZWNtYmludmVydGVkYnJldmVjbWJob3JuY21iZG90YmVsb3djbWJkaWVyZXNpc2JlbG93Y21icmluZ2JlbG93Y21iY29tbWFiZWxvd2NtYmNlZGlsbGFjbWJvZ29uZWtjbWJjaXJjdW1mbGV4YmVsb3djbWJicmV2ZWJlbG93Y21idGlsZGViZWxvd2NtYm1hY3JvbmJlbG93Y21iZ3JhdmV0b25lY21iYWN1dGV0b25lY21iZGlhbHl0aWthdG9ub3NjbWJxdWVzdGlvbmdyZWVrdTAzODR1MDM4NXUwMzg2YW5vdGVsZWlhdTAzODh1MDM4OXUwMzhBdTAzOEN1MDM4RXUwMzhGdTAzOTB1MDM5MXUwMzkydTAzOTN1MDM5NHUwMzk1dTAzOTZ1MDM5N3UwMzk4dTAzOTl1MDM5QXUwMzlCdTAzOUN1MDM5RHUwMzlFdTAzOUZ1MDNBMHUwM0ExdTAzQTN1MDNBNHUwM0E1dTAzQTZ1MDNBN3UwM0E4dTAzQTl1MDNBQXUwM0FCdTAzQUN1MDNBRHUwM0FFdTAzQUZ1MDNCMHUwM0IxdTAzQjJ1MDNCM3UwM0I0dTAzQjV1MDNCNnUwM0I3dTAzQjh1MDNCOXUwM0JBdTAzQkJ1MDNCQ3UwM0JEdTAzQkV1MDNCRnUwM0MwdTAzQzF1MDNDMnUwM0MzdTAzQzR1MDNDNXUwM0M2dTAzQzd1MDNDOHUwM0M5dTAzQ0F1MDNDQnUwM0NDdTAzQ0R1MDNDRXUwNDAxdTA0MDJ1MDQwM3UwNDA0dTA0MDV1MDQwNnUwNDA3dTA0MDh1MDQwOXUwNDBBdTA0MEJ1MDQwQ3UwNDBFdTA0MEZ1MDQxMHUwNDExdTA0MTJ1MDQxM3UwNDE0dTA0MTV1MDQxNnUwNDE3dTA0MTh1MDQxOXUwNDFBdTA0MUJ1MDQxQ3UwNDFEdTA0MUV1MDQxRnUwNDIwdTA0MjF1MDQyMnUwNDIzdTA0MjR1MDQyNXUwNDI2dTA0Mjd1MDQyOHUwNDI5dTA0MkF1MDQyQnUwNDJDdTA0MkR1MDQyRXUwNDJGdTA0MzB1MDQzMXUwNDMydTA0MzN1MDQzNHUwNDM1dTA0MzZ1MDQzN3UwNDM4dTA0Mzl1MDQzQXUwNDNCdTA0M0N1MDQzRHUwNDNFdTA0M0Z1MDQ0MHUwNDQxdTA0NDJ1MDQ0M3UwNDQ0dTA0NDV1MDQ0NnUwNDQ3dTA0NDh1MDQ0OXUwNDRBdTA0NEJ1MDQ0Q3UwNDREdTA0NEV1MDQ0RnUwNDUxdTA0NTJ1MDQ1M3UwNDU0dTA0NTV1MDQ1NnUwNDU3dTA0NTh1MDQ1OXUwNDVBdTA0NUJ1MDQ1Q3UwNDVFdTA0NUZ1MDQ5MHUwNDkxcGFsb2Noa2FjeXJpbGxpY0FpZWN5cmlsbGljYWllY3lyaWxsaWNBcmluZ2JlbG93YXJpbmdiZWxvd0Jkb3RhY2NlbnRiZG90YWNjZW50QmRvdGJlbG93YmRvdGJlbG93QmxpbmViZWxvd2JsaW5lYmVsb3dDY2VkaWxsYWFjdXRlY2NlZGlsbGFhY3V0ZURkb3RhY2NlbnRkZG90YWNjZW50RGRvdGJlbG93ZGRvdGJlbG93RGxpbmViZWxvd2RsaW5lYmVsb3dEY29tbWFhY2NlbnRkY29tbWFhY2NlbnREY2lyY3VtZmxleGJlbG93ZGNpcmN1bWZsZXhiZWxvd0VtYWNyb25ncmF2ZWVtYWNyb25ncmF2ZUVtYWNyb25hY3V0ZWVtYWNyb25hY3V0ZUVjaXJjdW1mbGV4YmVsb3dlY2lyY3VtZmxleGJlbG93RXRpbGRlYmVsb3dldGlsZGViZWxvd0VjZWRpbGxhYnJldmVlY2VkaWxsYWJyZXZlRmRvdGFjY2VudGZkb3RhY2NlbnRHbWFjcm9uZ21hY3Jvbkhkb3RhY2NlbnRoZG90YWNjZW50SGRvdGJlbG93aGRvdGJlbG93SGRpZXJlc2lzaGRpZXJlc2lzSGNlZGlsbGFoY2VkaWxsYUhicmV2ZWJlbG93aGJyZXZlYmVsb3dJdGlsZGViZWxvd2l0aWxkZWJlbG93SWRpZXJlc2lzYWN1dGVpZGllcmVzaXNhY3V0ZUthY3V0ZWthY3V0ZUtkb3RiZWxvd2tkb3RiZWxvd0tsaW5lYmVsb3drbGluZWJlbG93TGRvdGJlbG93bGRvdGJlbG93TGRvdGJlbG93bWFjcm9ubGRvdGJlbG93bWFjcm9uTGxpbmViZWxvd2xsaW5lYmVsb3dMY2lyY3VtZmxleGJlbG93bGNpcmN1bWZsZXhiZWxvd01hY3V0ZW1hY3V0ZU1kb3RhY2NlbnRtZG90YWNjZW50TWRvdGJlbG93bWRvdGJlbG93TmRvdGFjY2VudG5kb3RhY2NlbnROZG90YmVsb3duZG90YmVsb3dObGluZWJlbG93bmxpbmViZWxvd05jaXJjdW1mbGV4YmVsb3duY2lyY3VtZmxleGJlbG93T3RpbGRlYWN1dGVvdGlsZGVhY3V0ZU90aWxkZWRpZXJlc2lzb3RpbGRlZGllcmVzaXNPbWFjcm9uZ3JhdmVvbWFjcm9uZ3JhdmVPbWFjcm9uYWN1dGVvbWFjcm9uYWN1dGVQYWN1dGVwYWN1dGVQZG90YWNjZW50cGRvdGFjY2VudFJkb3RhY2NlbnRyZG90YWNjZW50UmRvdGJlbG93cmRvdGJlbG93UmRvdGJlbG93bWFjcm9ucmRvdGJlbG93bWFjcm9uUmxpbmViZWxvd3JsaW5lYmVsb3dTZG90YWNjZW50c2RvdGFjY2VudFNkb3RiZWxvd3Nkb3RiZWxvd1NhY3V0ZWRvdGFjY2VudHNhY3V0ZWRvdGFjY2VudFNjYXJvbmRvdGFjY2VudHNjYXJvbmRvdGFjY2VudFNkb3RiZWxvd2RvdGFjY2VudHNkb3RiZWxvd2RvdGFjY2VudFRkb3RhY2NlbnR0ZG90YWNjZW50VGRvdGJlbG93dGRvdGJlbG93VGxpbmViZWxvd3RsaW5lYmVsb3dUY2lyY3VtZmxleGJlbG93dGNpcmN1bWZsZXhiZWxvd1VkaWVyZXNpc2JlbG93dWRpZXJlc2lzYmVsb3dVdGlsZGViZWxvd3V0aWxkZWJlbG93VWNpcmN1bWZsZXhiZWxvd3VjaXJjdW1mbGV4YmVsb3dVdGlsZGVhY3V0ZXV0aWxkZWFjdXRlVW1hY3JvbmRpZXJlc2lzdW1hY3JvbmRpZXJlc2lzVnRpbGRldnRpbGRlVmRvdGJlbG93dmRvdGJlbG93V2dyYXZld2dyYXZlV2FjdXRld2FjdXRlV2RpZXJlc2lzd2RpZXJlc2lzV2RvdGFjY2VudHdkb3RhY2NlbnRXZG90YmVsb3d3ZG90YmVsb3dYZG90YWNjZW50eGRvdGFjY2VudFhkaWVyZXNpc3hkaWVyZXNpc1lkb3RhY2NlbnR5ZG90YWNjZW50WmNpcmN1bWZsZXh6Y2lyY3VtZmxleFpkb3RiZWxvd3pkb3RiZWxvd1psaW5lYmVsb3d6bGluZWJlbG93aGxpbmViZWxvd3RkaWVyZXNpc3dyaW5neXJpbmdBZG90YmVsb3dhZG90YmVsb3dBaG9va2Fib3ZlYWhvb2thYm92ZUFjaXJjdW1mbGV4YWN1dGVhY2lyY3VtZmxleGFjdXRlQWNpcmN1bWZsZXhncmF2ZWFjaXJjdW1mbGV4Z3JhdmVBY2lyY3VtZmxleGhvb2thYm92ZWFjaXJjdW1mbGV4aG9va2Fib3ZlQWNpcmN1bWZsZXh0aWxkZWFjaXJjdW1mbGV4dGlsZGVBY2lyY3VtZmxleGRvdGJlbG93YWNpcmN1bWZsZXhkb3RiZWxvd0FicmV2ZWFjdXRlYWJyZXZlYWN1dGVBYnJldmVncmF2ZWFicmV2ZWdyYXZlQWJyZXZlaG9va2Fib3ZlYWJyZXZlaG9va2Fib3ZlQWJyZXZldGlsZGVhYnJldmV0aWxkZUFicmV2ZWRvdGJlbG93YWJyZXZlZG90YmVsb3dFZG90YmVsb3dlZG90YmVsb3dFaG9va2Fib3ZlZWhvb2thYm92ZUV0aWxkZWV0aWxkZUVjaXJjdW1mbGV4YWN1dGVlY2lyY3VtZmxleGFjdXRlRWNpcmN1bWZsZXhncmF2ZWVjaXJjdW1mbGV4Z3JhdmVFY2lyY3VtZmxleGhvb2thYm92ZWVjaXJjdW1mbGV4aG9va2Fib3ZlRWNpcmN1bWZsZXh0aWxkZWVjaXJjdW1mbGV4dGlsZGVFY2lyY3VtZmxleGRvdGJlbG93ZWNpcmN1bWZsZXhkb3RiZWxvd0lob29rYWJvdmVpaG9va2Fib3ZlSWRvdGJlbG93aWRvdGJlbG93T2RvdGJlbG93b2RvdGJlbG93T2hvb2thYm92ZW9ob29rYWJvdmVPY2lyY3VtZmxleGFjdXRlb2NpcmN1bWZsZXhhY3V0ZU9jaXJjdW1mbGV4Z3JhdmVvY2lyY3VtZmxleGdyYXZlT2NpcmN1bWZsZXhob29rYWJvdmVvY2lyY3VtZmxleGhvb2thYm92ZU9jaXJjdW1mbGV4dGlsZGVvY2lyY3VtZmxleHRpbGRlT2NpcmN1bWZsZXhkb3RiZWxvd29jaXJjdW1mbGV4ZG90YmVsb3dPaG9ybmFjdXRlb2hvcm5hY3V0ZU9ob3JuZ3JhdmVvaG9ybmdyYXZlT2hvcm5ob29rYWJvdmVvaG9ybmhvb2thYm92ZU9ob3JudGlsZGVvaG9ybnRpbGRlT2hvcm5kb3RiZWxvd29ob3JuZG90YmVsb3dVZG90YmVsb3d1ZG90YmVsb3dVaG9va2Fib3ZldWhvb2thYm92ZVVob3JuYWN1dGV1aG9ybmFjdXRlVWhvcm5ncmF2ZXVob3JuZ3JhdmVVaG9ybmhvb2thYm92ZXVob3JuaG9va2Fib3ZlVWhvcm50aWxkZXVob3JudGlsZGVVaG9ybmRvdGJlbG93dWhvcm5kb3RiZWxvd1lncmF2ZXlncmF2ZVlkb3RiZWxvd3lkb3RiZWxvd1lob29rYWJvdmV5aG9va2Fib3ZlWXRpbGRleXRpbGRlRXVyb2NlbnRpZ3JhZGVmYWhyZW5oZWl0YWZpaTYxMjg5dTIxMTZPbWVnYWtlbHZpbmFuZ3N0cm9tZXN0aW1hdGVkT25lcm9tYW5Ud29yb21hblRocmVlcm9tYW5Gb3Vycm9tYW5GaXZlcm9tYW5TaXhyb21hblNldmVucm9tYW5FaWdodHJvbWFuTmluZXJvbWFuVGVucm9tYW5FbGV2ZW5yb21hblR3ZWx2ZXJvbWFudW5pMjE2Q3VuaTIxNkR1bmkyMTZFdW5pMjE2Rm9uZXJvbWFudHdvcm9tYW50aHJlZXJvbWFuZm91cnJvbWFuZml2ZXJvbWFuc2l4cm9tYW5zZXZlbnJvbWFuZWlnaHRyb21hbm5pbmVyb21hbnRlbnJvbWFuZWxldmVucm9tYW50d2VsdmVyb21hbnVuaTIxN0N1bmkyMTdEdW5pMjE3RXRob3VzYW5kcm9tYW5wYXJ0aWFsZGlmZkRlbHRhcHJvZHVjdHN1bW1hdGlvbnVuaTIyMTV1bmkyMjE5cmFkaWNhbGluZmluaXR5aW50ZWdyYWxhcHByb3hlcXVhbG5vdGVxdWFsbGVzc2VxdWFsZ3JlYXRlcmVxdWFsbG96ZW5nZWdyYXZlLmNhcGFjdXRlLmNhcGNpcmN1bWZsZXguY2FwY2Fyb24uY2FwdGlsZGUuY2FwZGllcmVzaXMuY2FwbWFjcm9uLmNhcGJyZXZlLmNhcHJpbmcuY2FwaHVuZ2FydW1sYXV0LmNhcGRvdGFjY2VudC5jYXBjYXJvbi5hbHRjb21tYWFjY2VudGNvbW1hYWNjZW50LmFsdHVuaUY4RkZ1bmlGRTEwdW5pRkUxM3VuaUZFMTR1bmlGRTE1dW5pRkUxNnVuaUZFMTllbWRhc2h2ZXJ0aWNhbGVuZGFzaHZlcnRpY2FsdW5kZXJzY29yZXZlcnRpY2Fsd2F2eXVuZGVyc2NvcmV2ZXJ0aWNhbHBhcmVubGVmdHZlcnRpY2FscGFyZW5yaWdodHZlcnRpY2FsYnJhY2VsZWZ0dmVydGljYWxicmFjZXJpZ2h0dmVydGljYWx1bmlGRTQ3dW5pRkU0ODguMGQ1ZTNDb3B5cmlnaHQoYykgMjAwNyBMaW5vdHlwZSBHbWJILCB3d3cubGlub3R5cGUuY29tLiBBbGwgcmlnaHRzIHJlc2VydmVkLkF2ZW5pciBIZWF2eUF2ZW5pciBIZWF2eQAAAAGHAAEAAgADAAQABQAGAAcAaAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAfABCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwGIAGAAYQBiAGcAZACgAGYAgwCqAIsAagCXAYkApQCAAKEAnACkAKkAfQCYAHMAcgCFAJYAjwB4AJ4AmwCjAHsArgCrAKwAsACtAK8AigCxALUAsgCzALQAuQC2ALcAuACaALoAvgC7ALwAvwC9AKgAjQDEAMEAwgDDAMUAnQCVAMsAyADJAM0AygDMAJAAzgDSAM8A0ADRANYA0wDUANUApwDXANsA2ADZANwA2gCfAJMA4QDeAN8A4ADiAKIA4wGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AJEBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYBxwHIAIwAkgHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVAI4AlAHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QDAAN0B4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1AfYB9wDGAfgB+QH6AfsAxwDkAGUB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISAhMCFAIVAhYCFwIYAhkCGgIbAhwCHQIeAh8CIAIhAiICIwIkAiUCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUAJRAlICUwJUAlUCVgJXAlgCWQJaAlsCXAJdAl4CXwJgAmECYgJjAmQCZQJmAH4AiAJnAIEAggCEAIcAfwCGAmgCaQJqAmsCbAJtAm4CbwJwAnECcgJzAnQCdQJ2AncCeAJ5AnoCewJ8An0CfgJ/AoACgQKCAoMChAKFAoYChwKIAokCigKLAowCjQKOAo8CkAKRApICkwKUApUClgKXApgCmQKaApsCnAKdAp4CnwKgAqECogKjAqQCpQKmAqcCqAKpAqoCqwKsAq0CrgKvArACsQKyArMCtAK1ArYCtwK4ArkCugK7ArwCvQK+Ar8CwALBAsICwwLEAsUCxgLHAsgCyQLKAssCzALNAs4CzwLQAtEC0gLTAtQC1QLWAtcC2ALZAtoC2wLcAt0C3gLfAuAC4QLiAuMC5ALlAuYC5wLoAukC6gLrAuwC7QLuAu8C8ALxAvIC8wL0AvUC9gL3AvgC+QL6AvsC/AL9Av4C/wMAAwEDAgMDAwQDBQMGAwcDCAMJAwoDCwMMAw0DDgMPAxADEQMSAxMDFAMVAxYDFwMYAxkDGgMbAxwDHQMeAx8DIAMhAyIDIwMkAyUDJgMnAygDKQMqAysDLAMtAy4DLwMwAzEDMgMzAzQDNQM2AzcDOAM5AzoDOwM8Az0DPgM/A0ADQQNCA0MDRANFA0YDRwNIA0kDSgNLA0wDTQNOA08DUANRA1IDUwNUA1UDVgNXA1gDWQNaA1sDXANdA14DXwNgA2EDYgNjA2QDZQNmA2cDaANpA2oDawNsA20DbgNvA3ADcQNyA3MDdAN1A3YDdwN4A3kDegN7A3wDfQN+A38DgAOBA4IDgwOEA4UDhgOHA4gDiQOKA4sDjAONA44DjwOQA5EDkgOTA5QDlQOWA5cDmAOZA5oDmwOcA50DngOfA6ADoQOiA6MDpAOlA6YDpwOoA6kDqgOrA6wDrQOuA68DsAOxA7IDswO0A7UDtgO3A7gDuQO6A7sDvAO9A74DvwPAA8EDwgPDA8QDxQPGA8cDyAPJA8oDywPMA80DzgPPA9AD0QPSA9MD1APVA9YD1wPYA9kD2gPbA9wD3QPeA98D4APhA+ID4wPkA+UD5gPnA+gD6QPqA+sD7APtA+4D7wPwA/ED8gPzA/QD9QP2A/cD+AP5A/oD+wP8A/0D/gP/BAAEAQQCBAMEBAQFBAYEBwQIBAkECgQLBAwEDQQOBA8EEAQRBBIEEwQUBBUEFgQXBBgEGQQaBBsEHAQdBB4EHwQgBCEEIgBvAIkAQQAIAHUAaQB3AHYAcABxAHQAeQB6AGsAbABjBCMEJAQlBCYEJwCZBCgEKQQqBCsELAQtBC4ELwQwBDEEMgQzBDQENQQ2BDcEOAQ5BDoEOwQ8BD0EPgQ/BEAEQQRCBEMERARFBEYERwRIBEkESgRLBEwETQROBE8ApgRQBFEEUgRTBFQEVQRWBFcEWARZBFoEWwRcBF0EXgRfBGAEYQRiBGMEZARlBGYEZwRoAG0AbgRpBGoEawRsBG0E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AP0yAP07AP1WAP2BAP2dAP2rAP2/AQAvAQKyAQLGAQPtAQaUAQbCAQbcAQeuAQfKAQfsAQj9AQn3AQsiAQyyAQ+9ARGfARQ6ARY6ARZaARf2ARseARvVARvpAR2HAR5fAR+kASDUASDkASIQASIrASI+ASJTASJcASJtASKFASKeASK2ASLSASLoASMFASMbASM4ASNNASNdASNtASOCASOXASOsASPBASPXASPtASQCASQYASQtASRDASRXASRyASSGASShASSwASTEASTTASToAST9ASUYASUmASU3ASVHASVeASVtASV7ASWKASWYASWsASW/ASXOASXcASXrASX5ASYJASYfASY6ASZVASZkASZzASaBASaPASaeASatASa7ASbLASbgASb3AScGAScVASckASczASdDASdTASdjASdzASeDASeTASeiASevASe+ASfLASfbASfpASf5ASgHASgjASg9AShdASh7ASiYASizASjQASjrASj/ASkVASkpASk/ASlTASliASl2ASmGASmhASm2ASnLASnbASnqASn7ASoKASobASoxASpIASpdASp0ASqIASqeASqtASq8ASrLASrbASrqASr6ASsJASsZASsuAStAAStQAStdASttASt5ASuQASukASu/ASvWASvjASvwASv/ASwNASwbASwqASw5ASxJASxdASxxASyAASyQASyfASyvASy/ASzPASzkASz4AS0IAS0WAS0kAS0zAS1CAS1SAS1gAS1wAS1/AS2TAS2nAS26AS3PAS3kAS35AS4OAS4pAS5DAS5eAS54AS6TAS6tAS7IAS7iAS79AS8XAS8zAS9PAS9qAS+FAS+fAS+5AS/TAS/tATAIATAjATAyATBHATBVATBqATB4ATCNATChATC7ATDPATDpATD9ATEXATErATFFATFZATFzATGBATGPATGfATG0ATHKATHdATHzATIHATIjATI9ATJZATJzATKPATKpATLFATLfATL7ATMVATMrATM/ATNVATNpATN/ATOSATOnATO6ATPQATPjATPzATQAATQQATQdATQuATQ7ATRMATRZATRqATR4ATSJATSXATSoATS2ATTFATTTATTjATTxATUAATUNATUcATUpATU2ATVDATVNATVXATVhATVvATV9ATWLATWnATXSATc8ATdOATd7ATeFATePATeZATomATo5ATpNATwrAT5fAT6aAUFeAUFmAUF/AUNSAUNbAUNoAUN7AUOIAUOQAUOeAUOxAUPJAUPZAUPiAUPxAUQFAUQNAUQWAUQlAUQuAUQ+AURbAUSHAUSeAUSmAUS7AUTeAUUPAUUmAUUvAUVFAUVpAUVyAUV8AUWLAUWUAUkjAUk+AUlVAUl8AUmFAUmPAUmYAUm6AU6/AVIIAVWfAVXVAVX7AVYhAVZLAVZVAVZfAVZpAVZyAVZ7AVaJAVaTAVacAVaqAVa3AVbAAVbKAVbSAVbjAVmSAVmoAVm4AVnCAVnPAVngAVnwAVn/AVrwAVsAAVsPAVsgAVsxAVwFAVzdAV+/AWKUAWKvAWLK+wX3cvcJFcPOUwaOvRW5Bov/ACKqq42jj/8ADVVVj/8ADKqr/wAOVVX/ABFVVf8AGKqrof8AGVVV/wAXVVX/ABDVVv8AFIAA/wAIVVX/ABGqq/8ACFVV/wARqqv/AAQqq/8AE4AAi/8AFVVVi7P///RVVf8AH9VV///oqqv/ABeqq///6Kqr/wAXqqv//+JVVf8AC9VVZ4sIZ4v//+Gqq///9Sqr///nVVX//+pVVf//51VV///qVVX///FVVv//3Sqr///7VVVbCL2DBY+t/wAJgAD/ABhVVZr/AA6qq5r/AA6qq/8AEdVV/wAHVVX/ABSqq4v/ABSqq4v/ABHVVf//99VVmv//76qrmv//76qr/wAHgAD//+vVVYtzi3+I///0KquF///0VVWF///0VVX///JVVf//8Cqr///qqqt3CP//9Kqr///0qqv///aqqv//9YAA///4qqv///ZVVf//+Kqr///2VVWF///21Vb///tVVf//91VV///3VVX//+9VVf//+6qrcIv//9qqqwj3g/tdFfww+P34MAa9vhX8lP1i+JQGDv0FDvvdDvvd92T3chUgCnf7LBUhCg4h9wz5WBX7nPH3nAfWFvuc8fecBw5q9x33ZRVt+2Xii6n3ZfOLbftl4ouq92Xvi4vfMYuc9w7xi4vfMYup92UFNItt+2Uki6n3ZTOLbftlJouLN+WLefsOJouLNwX3YvdiFfKLevsOJIsFDmr30vlkFc1VSAdv///9VVVw///5VVZx///1VVVx///1VVV0///x1VZ3///uVVV3///uVVV7///rKqt/c39zhXCLbYv//96qq/8ABaqr///kKqr/AAtVVf//6aqr/wALVVX//+mqq/8AD4AAeP8AE6qr///wVVUI/wATqqv///BVVf8AFoAA///zVVb/ABlVVf//9lVV/wAZVVX///ZVVf8AGqqr///3KqungwiQiov7ZwVv/wACqqv//+VVVf8AB1VV///mqquX///mqquX///rVVX/ABFVVXv/ABaqqwgwLgX/AB6qq2v/ACOAAHT/AChVVX3/AChVVX3/ACoqq///+VVVt/8AAKqrCETB0wer/wADVVX/AB3VVZL/ABuqq/8ACqqr/wAbqqv/AAqqq/8AGCqq/wAOgAD/ABSqq/8AElVV/wAUqqv/ABJVVf8AEFVVoZf/ABmqq5f/ABmqq5H/AB2AAIv/ACFVVYut///5gAD/ABxVVX7/ABaqq37/ABaqq3r/ABLVVXaaCHaac/8ADCqrcP8ACVVVcP8ACVVV///kgAD/AAhVVm//AAdVVQiHjIv3XAX/ABdVVYv/ABZVVv//+yqr/wAVVVX///ZVVf8AFVVV///2VVX/ABJVVv//8tVW/wAPVVX//+9VVQje6AX//+aqq/8AFqqr///hgAD/ABEqqv//3FVV/wALqqv//9xVVf8AC6qr///dKqv/AAXVVWmLCEz7AhX7Swd//wAFVVX///SAAP8ABNVWgP8ABFVVgP8ABFVV///2gAD/AAWAAIP/AAaqq4P/AAaqq///+YAAk4b/AAlVVYb/AAlVVf///YAA/wAMVVaL/wAPVVWL/wAZVVX/AAkqq/8AFIAA/wASVVX/AA+qq/8AElVV/wAPqqv/ABTVVv8ACdVV/wAXVVWPCMH8lhX3VweXh5f///uqq5f///tVVZf///tVVZb///pVVpX///lVVZX///lVVf8ACCqr///3qqv/AAZVVYH/AAZVVYH/AAMqq///86qri///8VVVi///8VVV///9Kqv///LVVv//+lVV///0VVX///pVVf//9FVV///4gACB///2qqv///eqqwj///aqq///96qr///1KqqE///zqqv///pVVf//86qr///6VVX///LVVf//+9VWff///VVVCA73rviN90IVIgr3qBYjCv2D9/wVIgr3qBYjCvfP92IVJAoO9wj40vc7Ffci92H7IYs8+wz7BvcPBf8AEVVV/wAIqqv/ABEqq/8ACoAAnP8ADFVVnP8ADFVV/wAPKqv/AA2qq/8ADVVVmv8ADVVVmv8ACqqr/wAQqquT/wASVVWT/wASVVWP/wAUKquLoYv/AByqq///+oAApID/ABVVVYD/ABVVVf//8VVV/wARgAD//+2qq/8ADaqrCP//7aqr/wANqqv//+rVVf8ACiqqc/8ABqqrc/8ABqqr///mqqv/AANVVf//5VVVi///5VVVi///5lVW///8VVX//+dVVf//+Kqr///nVVX///iqq///6lVW///1Kqr//+1VVf//8aqr///tVVX///Gqq///8Sqr///t1VWAdYB1///6gAD//+aqq4v//+NVVQiL///uqqv/AAIqq3v/AARVVf//8VVV/wAEVVX///FVVf8ABdVW///yVVb/AAdVVf//81VV/wAHVVX///NVVf8ACIAA///zqqv/AAmqq3//AAmqq3//AAqAAP//86qr/wALVVX///NVVf//6qqrg3f///WAAP//7VVVfv//7VVVfv//79VWfP//8lVVegj///JVVXr///Uqq///7VVVg///66qrg///66qrh///6dVVi3OLaf8ABqqr///iKqv/AA1VVf//5lVV/wANVVX//+ZVVf8AEaqr///qVVah///uVVWh///uVVX/ABmAAP//8qqrqIKogv8AHiqr///7gAD/AB9VVYsI/wAtVVWLspP/ACCqq5v/ACCqq5v/AB6qqqT/AByqq60I1jr3L4sF/Cb4/hX/ABVVVYv/ABJVVv//+dVV/wAPVVX///Oqq/8AD1VV///zqqv/AAeqq///8Cqqi///7Kqri///8qqriH+F///1VVWF///1VVX///gqq///9iqr///2VVWC///2VVWC///1gACD///0qquE///0qquE///1VVX///nVVYH///qqqwiD/wAHVVX///gqq/8AB6qr///4VVWT///4VVWT///41Vb/AAiAAP//+VVVlP//+VVVlP//+qqrlIeUh5SJ/wAJKquL/wAJVVWL/wAVVVX/AAhVVf8AESqr/wAQqquY/wAQqquYn/8ABoAA/wAXVVWLCFv7wBX3JfsyBXn//+6qq///7Kqre///61VV///xVVX//+tVVf//8VVVc///+Kqr///kqquL///wqquL///xqqr/AAKqq///8qqr/wAFVVX///Kqq/8ABVVV///0Kqr/AAdVVv//9aqr/wAJVVX///Wqq/8ACVVV///31VX/AAtVVoX/AA1VVYX/AA1VVYj/AA5VVov/AA9VVQiL/wAPVVX/AALVVf8ADaqr/wAFqquX/wAFqquX/wAHgAD/AAqqq/8ACVVV/wAJVVX/AAlVVf8ACVVV/wAKVVb/AAiAAP8AC1VV/wAHqqv/AAtVVf8AB6qr/wALqqv/AAeAAJf/AAdVVQgO+93s+VgV+5zx95wHDvvd96v5PBU2vwVd///Aqqv//9wqq///uoAA///mVVX//7RVVf//5lVV//+0VVX///Mqq///sYAAi///rqqrizn/AAzVVf//sVVV/wAZqqv//7Sqq/8AGaqr//+0qqv/ACPVVf//uqqquf//wKqrCN/CBWPD///gqqv/AD2AAP//6VVVzv//6VVVzv//9Kqr/wBEKquL/wBFVVWL/wBEqqv/AAtVVf8AQ9VV/wAWqqvO/wAWqqvO/wAfVVX/AD2AALPDCA773ZwjFeBXBbn/AD9VVf8AI9VV/wBFgAD/ABmqq/8AS6qr/wAZqqv/AEuqq/8ADNVV/wBOgACL/wBRVVWL3f//8yqr/wBOqqv//+ZVVf8AS1VV///mVVX/AEtVVf//3Cqr/wBFVVZd/wA/VVUIN1MFs1P/AB9VVf//wqqr/wAWqqv//71VVf8AFqqr//+9VVX/AAtVVUeL//+6qquL//+7VVX///Sqq///vCqr///pVVVI///pVVVI///gqqv//8KAAGNTCA77Nvem+MoV9yI3+yIH+xy6cTv3HVw1+wXOWN/3B+H7CtC9NfcJ9xy3cdsFDrT3rvf2FftwJfdw+3Dx93D3cPH7cPdwJQYO+933APceFSUKDvvK9633VxXx+4slBw773c/RFSEKDvuA1VsV98z5mjir+8z9nAUOarP39hWLU/8ABIAA///QKquU///YVVWU///YVVX/AAvVVf//3qqr/wAOqqtw/wAOqqtw/wAQgAD//+pVVf8AElVV///vqqv/ABJVVf//76qr/wASqqv///Oqqp7///eqq57///eqq/8AElVV///6gAD/ABGqq////VVV/wARqqv///1VVf8AD4AA///+qqv/AA1VVYsI/wANVVWL/wAPgAD/AAFVVf8AEaqr/wACqqv/ABGqq/8AAqqr/wASVVX/AAWAAJ7/AAhVVZ7/AAhVVf8AEqqr/wAMVVb/ABJVVf8AEFVV/wASVVX/ABBVVf8AEIAA/wAVqqv/AA6qq6b/AA6qq6b/AAvVVf8AIVVVlP8AJ6qrlP8AJ6qr/wAEgAD/AC/VVYvDCIvD///7gAD/AC/VVYL/ACeqq4L/ACeqq///9Cqr/wAhVVX///FVVab///FVVab//++AAP8AFaqr///tqqv/ABBVVf//7aqr/wAQVVX//+1VVf8ADFVWeP8ACFVVeP8ACFVV///tqqv/AAWAAP//7lVV/wACqqv//+5VVf8AAqqr///wgAD/AAFVVf//8qqriwj///Kqq4v///CAAP///qqr///uVVX///1VVf//7lVV///9VVX//+2qq///+oAAeP//96qreP//96qr///tVVX///Oqqv//7aqr///vqqv//+2qq///76qr///vgAD//+pVVf//8VVVcP//8VVVcP//9Cqr///eqquC///YVVWC///YVVX///uAAP//0Cqri1MI9wwWi6H/AAGAAP8AGYAAjqiOqP8ABiqr/wAbgAD/AAlVVaX/AAlVVaX/AA2qq6GdnZ2do5Spi6mLo4KdeZ15/wANqqt1/wAJVVVxCP8ACVVVcf8ABiqr///kgACObo5u/wABgAD//+aAAIt1i3X///6AAP//5oAAiG6Ibv//+dVV///kgAD///aqq3H///aqq3H///JVVXV5eXl5c4Jtiwhti3OUeZ15nf//8lVVof//9qqrpf//9qqrpf//+dVV/wAbgACIqIio///+gAD/ABmAAIuhCA5q96D4zhX8zvcM+Vj7AQf7avtG0TgFDmrG9xMV+xP4bvcA+9wH92/3XwWr/wAdVVX/ABoqq/8AHtVW/wAUVVX/ACBVVf8AFFVV/wAgVVX/AAoqq/8AJoAAi/8ALKqri62F/wAdqqt//wAZVVV//wAZVVX//++qq/8AFNVW///rVVX/ABBVVf//61VV/wAQVVX//+fVVv8ADFVW///kVVX/AAhVVf//5FVV/wAIVVX//+Iqq/8ABCqra4sIa4v//+JVVf//+6qr///kqqv///dVVf//5Kqr///3VVVz///zVVb//+tVVf//71VV///rVVX//+9VVf//7yqr///rKqt+cn5y///4Kqv//+Mqq////VVV///fVVUI9xKBBY//AB1VVf8AC6qr/wAXVVb/ABNVVf8AEVVV/wATVVX/ABFVVf8AGKqr/wAIqqupi5mL/wANKqv///3VVf8ADFVV///7qqv/AAxVVf//+6qr/wAK1Vb///nVVf8ACVVVg/8ACVVVg/8AB4AA///2VVX/AAWqq///9Kqr/wAFqqv///Sqq/8AAtVVfov///FVVQiLf////aqr///0gAD///tVVYD///tVVYD///oqq///9YAAhIGEgf//+Cqr///2gAD///dVVYL///dVVYL///eqq///94AAg4MIDmr3cvg7FfsAqAedi/8AElVV///+qqv/ABKqq////VVV/wASqqv///1VVf8AENVV///61Vaa///4VVWa///4VVX/AAxVVYD/AAmqq///8aqr/wAJqqv///Gqq/8ABNVV///tgACL///pVVWL///vVVX///zVVf//8NVW///5qqv///JVVf//+aqr///yVVX///dVVf//9FVWgP//9lVVCID///ZVVf//81VV///4gAD///Gqq///+qqr///xqqv///qqq///8NVV///9VVV7i2uL///mqquT///tVVWb///tVVWbfv8AFqqr///4qqv/AB1VVQj7FGkFk///4qqr/wALqqv//+bVVf8AD1VVdv8AD1VVdv8AEiqr///u1VWg///yqqug///yqqv/ABeAAP//9iqqpf//+aqrpf//+aqr/wAbqqv///zVVf8AHVVVi/8AH1VVi/8AHiqr/wAEgAColKiU/wAZgAD/AA1VVaH/ABGqqwih/wARqqv/ABGAAP8AFdVVmKWYpf8ABoAAqYuti7f///RVVbH//+iqq6v//+iqq6v//92qqv8AE1VV///Sqqv/AAaqqwiNB7H/AAlVVf8AHaqr/wATgAD/ABVVVf8AHaqr/wAVVVX/AB2qq/8ACqqr/wAh1VWLsYv/AB9VVf//+dVV/wAbgAD///Oqq/8AF6qr///zqqv/ABeqq///74AA/wATqqr//+tVVf8AD6qr///rVVX/AA+qq3P/AAvVVf//5Kqrk///5Kqrk26P///hVVWLCHGLcohzhXOFdf//9tVVd///86qrd///86qr///uqqv///Aqqv//8VVV///sqqv///FVVf//7Kqr///0qqv//+lVVYNxCPcTaQX/AAiqq/8AGKqr/wAN1VX/ABMqqp7/AA2qq57/AA2qq/8AFYAA/wAG1VWji6mL/wAYVVX///dVVf8AEqqr///uqqv/ABKqq///7qqr/wAJVVX//+mqqov//+Sqq4v//+qqq4d6g///81VVg///81VV///1gAD///ZVVn7///lVVQh+///5VVX///FVVf//+6qr///vqquJ///vqquJ///vKqqK///uqquLCA5q9+P3JBX7JPcM9yTy9wAk+Fz7HAf7sfxRi/sLBffB+B4V+7L7Rwf3RfeyBQ5q+I347BX3APwnB4T8EgX/ABVVVf8ACqqr/wAXgAD/AAhVVf8AGaqrkf8AGaqrkf8AGdVVjqWLoYug///9gACfhp+G/wARqquD/wAPVVWA/wAPVVWA/wAMKqv///HVVZT//+6qq5T//+6qq/8ABIAAdov//+dVVQiL///uqquIe4X///FVVYX///FVVf//94AA///zKquAgICAfv//94AAfIV8hf//74AAiHmL///hVVWLcv8AB1VV///sqqv/AA6qq///7Kqr/wAOqqv///JVVZ+D/wAZVVUI+xJpBf8AEKqr///JVVX/ABwqqv//11VW/wAnqqv//+VVVf8AJ6qr///lVVX/ADAqqv//8qqr/wA4qquLr4v/ACGqq/8ABaqr/wAfVVX/AAtVVf8AH1VV/wALVVX/ABsqq/8AECqroqCioJ3/ABmqq5j/AB5VVZj/AB5VVf8ABoAA/wAiKquLsQiLr///+iqr/wAgVVX///RVVf8AHKqr///0VVX/AByqq///79VW/wAYqqr//+tVVf8AFKqr///rVVX/ABSqq///5yqr/wAP1VVulm6W///gKqv/AAWAAP//3VVVi///81VVi///8oAA////VVX///Gqq////qqr///xqqv///6qq///9Cqq///9qqr///aqq////KqrCI73IQUOavhJ+VgV+yaL+0n7sQX//+yqq///4Kqr///wKqr//+Eqqv//86qr///hqqv///Oqq///4aqr///51VX//94qqov//9qqq4v//9qqq/8ABiqr///eVVX/AAxVVW3/AAxVVW3/ABFVVv//5qqr/wAWVVX//+tVVf8AFlVV///rVVX/ABqAAP//8Cqr/wAeqquA/wAeqquArf//+oAA/wAlVVWLCK+L/wAhgAD/AAWqq6r/AAtVVar/AAtVVf8AGqqr/wAQKqv/ABZVVaD/ABZVVaD/ABGAAP8AGYAA/wAMqqup/wAMqqup/wAGVVX/ACFVVYv/ACSqq4v/AB6qq///+tVVqP//9aqr/wAbVVX///Wqq/8AG1VV///xVVWjeP8AFKqrCHj/ABSqq///6YAA/wAQVVVxl3GX///jVVWR///gqquLf4v///PVVYr///Oqq4n///Oqq4n///Yqqoj///iqq4cIiY0FKvtrFYud/wADVVX/ABDVVf8ABqqr/wAPqqv/AAaqq/8AD6qr/wAJKqr/AA2qqv8AC6qr/wALqqv/AAuqq/8AC6qr/wANqqr/AAkqqv8AD6qr/wAGqqv/AA+qq/8ABqqr/wAQ1VX/AANVVZ2LnYv/ABDVVf///Kqr/wAPqqv///lVVf8AD6qr///5VVX/AA2qqv//9tVW/wALqqv///RVVQj/AAuqq///9FVV/wAJKqr///JVVv8ABqqr///wVVX/AAaqq///8FVV/wADVVX//+8qq4t5i3n///yqq///7yqr///5VVX///BVVf//+VVV///wVVX///bVVv//8lVW///0VVX///RVVf//9FVV///0VVX///JVVv//9tVW///wVVX///lVVf//8FVV///5VVX//+8qq////KqreYsIeYv//+8qq/8AA1VV///wVVX/AAaqq///8FVV/wAGqqv///JVVv8ACSqq///0VVX/AAuqq///9FVV/wALqqv///bVVv8ADaqq///5VVX/AA+qq///+VVV/wAPqqv///yqq/8AENVVi50IDmq1+VgV+wb37gf7tfzm9yGL96/46ov3AgUOave8+WQVbYv//+PVVf//+9VV///lqqv///eqq///5aqr///3qqt0f///7FVV///wVVX//+xVVf//8FVV///wgAD//+yqq///9KqrdP//9KqrdP//+lVV///lgACLbYtl/wAI1VX//96qq/8AEaqr///jVVX/ABGqq///41VV/wAa1VX//+xVVq////VVVQiJB///71VV///8qqv//+/VVv//+Sqq///wVVX///Wqq///8FVV///1qqv///Iqq///81VVf3x/fP//9oAA///u1VWE///sqquE///sqqv///yAAP//61VVi3WL///cqqv/AAZVVf//4Sqq/wAMqqv//+Wqq/8ADKqr///lqquc///p1VX/ABVVVXkI/wAVVVV5/wAZKqv///KAAKiCqIL/AB8qq///+4AA/wAhVVWL/wAgqquLqv8ABIAA/wAdVVWU/wAdVVWU/wAZVVb/AA2AAP8AFVVVnf8AFVVVnZz/ABYqq/8ADKqr/wAaVVX/AAyqq/8AGlVV/wAGVVX/AB7VVov/ACNVVQiLof///IAA/wAUqquE/wATVVWE/wATVVX///aAAP8AESqrf5p/mv//8iqr/wAMqqv///BVVf8AClVV///wVVX/AApVVf//79VW/wAG1Vb//+9VVf8AA1VVCI0Hr/8ACqqr/wAa1VX/ABOqqv8AEaqr/wAcqqv/ABGqq/8AHKqr/wAI1VX/ACFVVYuxi6n///pVVf8AGoAA///0qqui///0qqui///wgAD/ABNVVf//7FVV/wAPqqv//+xVVf8AD6qrdJf//+Wqq/8ACFVV///lqqv/AAhVVf//49VV/wAEKqttiwglBKeL/wAXKqv///aqq/8AElVV///tVVX/ABJVVf//7VVV/wAJKqv//+lVVov//+VVVYt9///9gAB+hn+Gf4T///WAAIKCgoL///Wqq4T///RVVYb///RVVYb///OAAP///YAA///yqquLCG2L///oVVX/AAmAAP//7qqrnv//7qqrnv//91VV/wAXgACLp4v/ABqqq/8ACIAA/wAWqqqc/wASqquc/wASqqv/ABfVVf8ACVVV/wAeqquLCPu3BJuL/wAPVVX///1VVf8ADqqr///6qqv/AA6qq///+qqr/wAMqqr///hVVf8ACqqrgf8ACqqrgf8ACIAA///0Kqv/AAZVVf//8lVV/wAGVVX///JVVf8AAyqr///xKquLe4tp///01VX//+SAAP//6aqrdv//6aqrdv//44AA///1gAD//91VVYsI///dVVWL///jgAD/AAqAAP//6aqroP//6aqroP//9NVV/wAbgACLrYub/wADKqv/AA7VVf8ABlVV/wANqqv/AAZVVf8ADaqr/wAIgAD/AAvVVf8ACqqrlf8ACqqrlf8ADKqq/wAHqqv/AA6qq/8ABVVV/wAOqqv/AAVVVf8AD1VV/wACqqubiwgOavcvFvcmi/dJ97EF/wATVVX/AB9VVf8AD9VW/wAe1Vb/AAxVVf8AHlVV/wAMVVX/AB5VVf8ABiqr/wAh1VaL/wAlVVWL/wAlVVX///nVVf8AIaqr///zqqup///zqqup///uqqr/ABlVVf//6aqr/wAUqqv//+mqq/8AFKqr///lVVX/AA/VVWyWbJb//94qq/8ABYAA///bVVWLCGeL///egAD///pVVWz///Sqq2z///Sqq///5VVV///v1VX//+mqq3b//+mqq3b//+6AAP//5oAA///zVVVt///zVVVt///5qqv//96qq4v//9tVVYv//+FVVf8ABSqrbv8AClVV///kqqv/AApVVf//5Kqr/wAOqqtznv//61VVCJ7//+tVVf8AFoAA///vqqulf6V//wAcqquF/wAfVVWLl4v/AAwqq4z/AAxVVY3/AAxVVY3/AAnVVo7/AAdVVY8IjYkF7PdrFYt5///8qqv//+8qq///+VVV///wVVX///lVVf//8FVV///21Vb///JVVv//9FVV///0VVX///RVVf//9FVV///yVVb///bVVv//8FVV///5VVX///BVVf//+VVV///vKqv///yqq3mLeYv//+8qq/8AA1VV///wVVX/AAaqq///8FVV/wAGqqv///JVVv8ACSqq///0VVX/AAuqqwj///RVVf8AC6qr///21Vb/AA2qqv//+VVV/wAPqqv///lVVf8AD6qr///8qqv/ABDVVYudi53/AANVVf8AENVV/wAGqqv/AA+qq/8ABqqr/wAPqqv/AAkqqv8ADaqq/wALqqv/AAuqq/8AC6qr/wALqqv/AA2qqv8ACSqq/wAPqqv/AAaqq/8AD6qr/wAGqqv/ABDVVf8AA1VVnYsInYv/ABDVVf///Kqr/wAPqqv///lVVf8AD6qr///5VVX/AA2qqv//9tVW/wALqqv///RVVf8AC6qr///0VVX/AAkqqv//8lVW/wAGqqv///BVVf8ABqqr///wVVX/AANVVf//7yqri3kIDvvdz9EVIQr35wQhCg773fcA9x4VJQr7NvejFSEKDrTb958V+I77dYv3Avvm9yv35vcri/cC/I77dQUOtPjw+FAVJgo9BCYKDrT43vfnFfyO93WL+wL35vsr++b7K4v7AviO93UFDiH3ZvdlFScKd/tWFSEKDvdD+CX4XBX/ABlVVYv/ABKqq///91VVl///7qqrl///7qqrkXWL///lVVWLff///oAA///x1VWI///xqquI///xqqv///rVVX7///iqq///9FVV///4qqv///RVVYH///aAAP//81VV///4qqv///NVVf//+Kqr///wVVb///xVVf//7VVViwj//+tVVYt7/wAD1VX///Sqq/8AB6qr///0qqv/AAeqq///99VV/wAI1VWGlYaViP8ACiqriv8AClVViv8AClVV////gAD/AAfVVov/AAVVVYv/ABCqq/8AAlVV/wAPqqr/AASqq/8ADqqr/wAEqqv/AA6qq/8ABtVV/wAM1VWUlgiUlv8ACyqr/wAIqqv/AA1VVf8ABlVV/wANVVX/AAZVVZr/AAMqq/8AEKqriwj32vvXFfsCBv//51VV///sqqv//+PVVnz//+BVVf//9VVV///gVVX///VVVf//3Sqr///6qqtli2GLZP8ABoAAZ5hnmP//4NVV/wASgAD//+Wqq6P//+Wqq6P//+uAAP8AHVVV///xVVX/ACKqq///8VVV/wAiqqv///iqq/8AJ1VVi7cIi/8AKKqr/wAGqqv/ACWqqv8ADVVV/wAiqqv/AA1VVf8AIqqr/wAS1Vap/wAYVVX/ABlVVf8AGFVV/wAZVVX/AB0qq/8AE6qrrZmtmf8AJaqrkv8AKVVVi7GLrv//+tVVq///9aqrq///9aqr/wAbgAD///CAAKL//+tVVQii///rVVWd///mgACY///hqquY///hqqv/AAaAAP//3NVVi2OLcf///YAA///pqquG///tVVWG///tVVX///mAAP//8IAAg///86qrg///86qr///21VWC///1qqv///pVVf//9aqr///6VVX///WAAP///Sqr///1VVWLCP//9VVVi///+NVW/wADKqv///xVVf8ABlVV///8VVX/AAZVVf///iqr/wAJKquLl4uVjP8ACaqrjf8ACVVVCJGnsPdZLYuDXomLBYH/ABSqq///8iqr/wAOqqr//+5VVf8ACKqr///uVVX/AAiqq///6dVW/wAEVVX//+VVVYv//+Cqq4tv///51VX//+dVVf//86qr///nVVX///Oqq///6yqr///vVVV6dnp2///y1VVz///2qqtw///2qqtw///7VVX//+PVVYv//+KqqwiL///nVVX/AAOAAP//6VVWkv//61VVkv//61VV/wAJ1VX//+5VVv8ADKqr///xVVX/AAyqq///8VVV/wAPKqr///SAAP8AEaqr///3qqv/ABGqq///96qr/wATgAD///vVVf8AFVVVi6uLpf8ABaqrn/8AC1VVn/8AC1VV/wAQqqv/AAxVVv8ADVVV/wANVVUIjQb/AACqq///8qqr/wAGVVX///Oqqpf///Sqq5f///Sqq5////pVVaeLlYv/AAyAAP8AASqrmv8AAlVVmv8AAlVV/wAPqqv/AAQqq/8AEFVVkf8AEFVVkf8AEFVW/wAIqqv/ABBVVf8AC1VV/wAQVVX/AAtVVf8ADqqr/wAOqquYnQiYnf8ACqqrof8ACFVVpf8ACFVVpf8ABCqr/wAeqquL/wAjVVWL/wA0qqv///XVVf8ALtVV///rqqu0///rqqu0///lKqr/ACKAAP//3qqrp///3qqrp///2iqq/wAVKqv//9Wqq/8ADlVV///Vqqv/AA5VVf//1NVV/wAHKqtfiwj//8tVVYv//86AAP//9oAA///Rqqt4///Rqqt4///XgAD//+XVVf//3VVV///eqqv//91VVf//3qqr///kqqv//9iqqnf//9Kqq3f//9Kqq4H//86qqov//8qqq4tV/wAKKqv//84qq/8AFFVV///SVVX/ABRVVf//0lVV/wAb1Vb//9jVVv8AI1VV///fVVUI/wAjVVX//99VVf8AKSqr///mgAC6///tqqu6///tqqv/ADIqq///9tVV/wA1VVWL/wA9VVWL/wA5gAD/AAzVVf8ANaqr/wAZqqv/ADWqq/8AGaqr/wAs1VX/ACWAAK//ADFVVQgO7PfI+VgVKAq+/EoVKQoOotr5WBUqCvsq+7QVKwr7B/vMFSwKDsf4yfiyFS0KDvca2vlYFS4KUPzmFS8KDn3a+VgVMAoO2vlYFTEKDvct+Vi/FTIKDvcI2vlYFTMKDvvv1/lYFTQKDvsR+D73WBU1Cg7H2vlYFTYKDiHa+VgVNwoO98Hd+VgVOAoO9z/a+VgVOQoO92S09/MVOgr3GJMVOwoOfdr5WBU8Cmf7xxU9Cg73d/nbFvH7X40H/wAQqquV/wARKqr/AAxVVf8AEaqr/wAOqqv/ABGqq/8ADqqr/wAQKqr/ABIqqv8ADqqr/wAVqqv/AA6qq/8AFaqr/wAL1VWklP8AHFVVlP8AHFVV/wAEgAD/ACDVVov/ACVVVYu////2Kqv/AC/VVf//7FVV/wArqqv//+xVVf8AK6qr///lKqv/ACWqqmn/AB+qqwhp/wAfqqv//9iAAP8AGKqqXv8AEaqrXv8AEaqr///QKqv/AAjVVf//zVVVi///zVVVi///0Cqr///3Kqte///uVVVe///uVVX//9iAAP//51VWaf//4FVVaf//4FVV///lKqv//9pVVv//7FVV///UVVX//+xVVf//1FVV///2Kqv//9Aqq4tXCIv//8aqq/8ACdVV///MgAD/ABOqq///0lVV/wATqqv//9JVVab//9lVVv8AIlVV///gVVX/ACJVVf//4FVV/wAoqqv//+eqq7p6unr/ADMqq///94AA/wA3VVWLCHr4+BWvi/8AINVV///51VX/AB2qq///86qr/wAdqqv///Oqq/8AGYAA///u1VX/ABVVVXX/ABVVVXX/ABCqq3GXbZdtkf//31VVi///3Kqri2eF///egAB/bH9s///vVVX//+VVVf//6qqr///pqqsI///qqqv//+mqq///5oAA///ugAD//+JVVf//81VV///iVVX///NVVf//39VW///5qqv//91VVYv//91VVYv//+Aqq/8ABlVVbv8ADKqrbv8ADKqr///m1VX/ABGAAP//6qqr/wAWVVX//+qqq/8AFlVV///vVVX/ABqqq3+qf6qF/wAhgACLrwiL/wAjVVWR/wAgqquXqZep/wAQgACloKGgoaT/ABEqq6j/AAxVVaj/AAxVVf8AH4AA/wAGKqutiwgOkNr5WBU+CnX7wBU/Cg74PvjAFUAKDvd0+OYVQQoO7Pka95gVQgoOtYj5WBVDCg73+PlYBEQKDsf3kPgGFUUKDpD3kPfDFUYKDn2u9wYVRwoO++/3lvkiFdn7VP4M91TZMflwBw77gOH5ihU4a/fM/ZreqQUO+++fPRU991T6DPtUPeX9cAcOtND36xX3Cov3JfeD9yf7g/cKi/tz+AE5iwUO+xH7EQT4iL38iAYO/AH3RfjIFUgKDjP4BM0VSQqH9ykVSgoOkM/5iBVLCveq/JgVTAoO+yP4IPfkFU0KDpD4VNMVTgr7rvc8FU8KDvc491oVUAr3iuUVUQoO+6X3A/gOFVIKDpD4xvh0FVMK+5T36RVUCg73UPgxFVUKDvwB0fh0FVYK+x33NxVXCg78AfdS+HQVWAr7Hfk0FVcKDjPP+YgVWQoO/AHR+YgVWgoO94nK+HQVWwoOz/h0FVwKDny394QVXQr3DBZPCg6Qz/h0FV4K97D7hBVMCg6Q+Mb7eBX5WPsGQ4kH///uqqv/AB1VVf//6Kqq/wAVVVb//+Kqq/8ADVVV///iqqv/AA1VVf//4FVV/wAGqqtpi///2qqri///3tVV///5gABufm5+///nKqv//+4qq///61VV///pVVX//+tVVf//6VVV///wVVb//+VVVv//9VVV///hVVX///VVVf//4VVV///6qqtqi///3KqrCIv//9yqq/8ABaqrav8AC1VV///hVVX/AAtVVf//4VVV/wAP1Vb//+VVVv8AFFVV///pVVX/ABRVVf//6VVV/wAYgAD//+4qq/8AHKqrfv8AHKqrfv8AH1VV///5gACti/8AFqqri5//AAJVVf8AEVVV/wAEqqv/ABFVVf8ABKqr/wAPVVaR/wANVVX/AAdVVQj/AA1VVf8AB1VV/wALVVb/AAfVVv8ACVVV/wAIVVX/AAlVVf8ACFVV/wAHqqv/AAgqq5GTCI77tQb7qvhoFU8KDvuAz/h0FV8KDvtJ99j37xVgCg77gJf4DhVhCg74jhZiCg4hjvh0FWMKDvc/jvh0FWQKDjP3VPeWFWUKDiGO+HQVZgoO+yOt9wMVZwoO++/34AQzB/8ABqqri/8ACKqqiv8ACqqrif8ACqqrif8AClVV///8KquV///6VVWV///6VVX/AAiqq///+Cqr/wAHVVWB/wAHVVWB/wADqqt+i3sI+1MHi///6VVV/wAEqqv//+yAAP8ACVVV///vqqv/AAlVVf//76qr/wALVVb///JVVf8ADVVVgP8ADVVVgJn///fVVf8ADqqr///6qqv/AA6qq///+qqr/wAMqqr///1VVf8ACqqriwjm31QGfYv///TVVf8AAlVV///3qqv/AASqq///96qr/wAEqqv///mqqv8ABdVV///7qquS///7qquS///9VVX/AAeAAIqTipP///+AAP8AB6qri/8AB1VVCPdKB4v/ABdVVf///FVV/wASgAD///iqq/8ADaqr///4qqv/AA2qq///9yqq/wAKgAD///Wqq/8AB1VV///1qqv/AAdVVf//9VVVkID/AAKqq4D/AAKqq///9oAA/wABqqqD/wAAqqsIjQeT/wAAqqv/AAmAAI2W/wADVVWW/wADVVX/AAqqq/8ABYAA/wAKVVX/AAeqq/8AClVV/wAHqqv/AAjVVv8ACiqq/wAHVVX/AAyqq/8AB1VV/wAMqqv/AAOqq5uL/wATVVUI91AHi/8AB1VV/wAAgAD/AAeqq4yTjJP/AAKqq/8AB4AA/wAEVVWS/wAEVVWS/wAGVVb/AAXVVf8ACFVV/wAEqqv/AAhVVf8ABKqr/wALKqv/AAJVVZmLCMLfMAb///VVVYv///NVVv///VVV///xVVX///qqq///8VVV///6qqt9///31VX///Kqq4D///Kqq4D///Sqqv//8lVV///2qqv//++qq///9qqr///vqqv///tVVf//7IAAi///6VVVCPtaB4t9///8VVX///RVVf//+Kqr///2qqv///iqq///9qqr///3VVX///jVVYGGgYb///Wqq////IAA///1VVWJ///1VVWJ///3VVaK///5VVWLCA78J/c2+YIVJf588QYO++/3qveIFeMH///4qquLgoz///VVVY3///VVVY3///Wqq/8AA9VVgf8ABaqrgf8ABaqr///3gAD/AAfVVYSVhJX///yAAJiLmwj3UweL/wAWqqv///tVVf8AE4AA///2qqv/ABBVVf//9qqr/wAQVVX///Sqqv8ADaqr///yqquW///yqquWff8ACCqr///xVVX/AAVVVf//8VVV/wAFVVX///NVVv8AAqqr///1VVWLCDA3wgaZi/8ACyqr///9qqv/AAhVVf//+1VV/wAIVVX///tVVf8ABlVW///6Kqv/AARVVYT/AARVVYT/AAKqq///+IAAjIOMg/8AAIAA///4VVWL///4qqsI+0oHi///6Kqr/wADqqv//+2AAP8AB1VV///yVVX/AAdVVf//8lVV/wAI1Vb///WAAP8AClVV///4qqv/AApVVf//+Kqr/wAKqquGlv///VVVlv///VVV/wAJgAD///5VVpP///9VVQiJB4P///6qq///9oAA///9qqqA///8qquA///8qqv///VVVf//+qqq///1qqv///iqq///9aqr///4qqv///cqqoH///iqq///81VV///4qqv///NVVf///FVVe4v//+yqqwj7UAeL///4qqv///+AAP//+FVVioOKg////VVV///4gAD///uqq4T///uqq4T///mqqv//+iqr///3qqv///tVVf//96qr///7VVX///TVVf///aqrfYsIVDfmBv8ACqqri/8ADKqq/wACqqv/AA6qq/8ABVVV/wAOqqv/AAVVVZn/AAgqq/8ADVVVlv8ADVVVlv8AC1VW/wANqqv/AAlVVf8AEFVV/wAJVVX/ABBVVf8ABKqr/wATgACL/wAWqqsI91oHi5n/AAOAAP8AC6qrkv8ACVVVkv8ACVVV/wAIgAD/AAcqq5WQlZD/AApVVf8AA4AA/wAKqquN/wAKqquNlIz/AAdVVYsIDrT4yffBFWffeXMFhYP///mAAP//+NVVhP//+aqrhP//+aqr///4Kqv///qqqv//91VV///7qqv///dVVf//+6qr///2qqv///3VVYGL///yqquL///wgACP///uVVWT///uVVWT///t1VaT///tVVWT///sqqv/AAiqq///7Kqq/wAHgAD//+yqq/8ABlVVCP//7Kqr/wAGVVX//+yqqv8AAyqr///sqquLe4v///Gqq////YAA///zVVWG///zVVWG///0qqv///mAAIGDgYP///dVVf//9tVV///4qqv///Wqq///+Kqr///1qqv///mqqv//9YAA///6qqv///VVVQivNwWPk/8ABIAAk5CTkJOR/wAHKquS/wAGVVWS/wAGVVWT/wAFVVaU/wAEVVWU/wAEVVX/AAoqq/8AAiqr/wALVVWL/wAXVVWLoP///IAA/wASqquE/wASqquE/wARVVX///fVVZv///aqqwj/ABCqq///9qqr/wAQgAD///gqqv8AEFVV///5qqv/ABBVVf//+aqr/wARgAD///zVVf8AEqqri/8AD1VVi/8ADdVW/wACgAD/AAxVVZD/AAxVVZCW/wAGgAD/AAmqq5P/AAmqq5OU/wAJKqv/AAhVVf8AClVV/wAIVVX/AApVVf8AB9VW/wAKgAD/AAdVVf8ACqqrCA773Q773eP3nRX8e/cM+HsHn/crFWgKDmr39viAFc5VSAf//7tVVf//9qqr///J1Vb//+VVVf//2FVVX///2FVVX///7CqrUotFi2n/AAUqq///4FVV/wAKVVX//+Kqq/8AClVV///iqqv/AA6qq///5iqqnv//6aqrnv//6aqr/wAXVVX//+2qqv8AG6qr///xqqv/ABuqq///8aqr/wAe1VX///eAAK3///1VVQhDwdMH/wAfVVX/AAFVVf8AHtVWkf8AHlVV/wAKqqv/AB5VVf8ACqqr/wAZ1Vac/wAVVVX/ABdVVQhC2gV////yqqv///GAAIB6///3VVV6///3VVX//+4qq///+6qr///tVVWLCPfAB53///6qq/8AENVV///7gAD/AA+qq///+FVV/wAPqqv///hVVf8ADiqq///1gAD/AAyqq///8qqrCNjZBf//61VV/wAYqqv//+aAAP8AEVVV///hqquV///hqquV///g1VX/AAWqq2v/AAFVVQhVJBX7vwdn/wAJVVVw/wASgAB5/wAbqqt5/wAbqquC/wAfgACL/wAjVVWLnf8AAiqr/wARVVX/AARVVf8AEKqr/wAEVVX/ABCqq/8ABqqr/wAO1VWUmJSY/wALKquW/wANVVWU/wANVVWUm/8ABoAA/wASqquPCA5qzesVK/hv6/uR92/3Nt/7NuUHi5v/AAKAAP8AD1VVkP8ADqqrkP8ADqqr/wAHgACYlf8AC1VVlf8AC1VV/wAMKqv/AAkqq/8ADlVVkv8ADlVVkv8AEIAA/wADgAD/ABKqq4v/ABVVVYv/ABNVVv///Cqr/wARVVX///hVVf8AEVVV///4VVWb///1gAD/AA6qq///8qqrCNziBf//51VVoW7/ABAqq///3qqr/wAKVVX//96qq/8AClVV///dVVX/AAUqq2eL///WqquL///cqqr///kqq///4qqr///yVVX//+Kqq///8lVVc///7lVW///tVVX//+pVVf//7VVV///qVVX///JVVv//6Cqr///3VVVx///3VVVx///7qqv//+aqq4v//+dVVQgnJTfx+28HDmqv9y8Vx0+8vAX/ACyqq///31VV/wAyVVX//++qq8OL/wAcqquLpv8ABFVV/wAZVVX/AAiqq/8AGVVV/wAIqqv/ABdVVpf/ABVVVf8AD1VVCLxax8davAX/AA9VVf8AFVVVl/8AF4AA/wAIqqv/ABmqq/8ACKqr/wAZqqv/AARVVf8AGtVVi6eLw///76qr/wAyVVX//99VVf8ALKqrCLy8T8ZaWwX//+qqq/8AD1VV///oqqr/AAvVVv//5qqr/wAIVVX//+aqq/8ACFVVcP8ABCqr///jVVWL///jVVWLcP//+9VV///mqqv///eqq///5qqr///3qqv//+iqqv//9Cqq///qqqv///Cqqwhau09QvFoF///wqqv//+qqq3///+iAAP//91VV///mVVX///dVVf//5lVV///7qqv//+Uqq4tvi///41VV/wAEVVVw/wAIqqv//+aqq/8ACKqr///mqquX///oqqr/AA9VVf//6qqrCMz3KxWLuf8ADSqr/wAkqqv/ABpVVf8AG1VV/wAaVVX/ABtVVf8AI4AA/wANqqv/ACyqq4v/ACyqq4v/ACOAAP//8lVV/wAaVVX//+Sqq/8AGlVV///kqqv/AA0qq///21VVi12LXf//8tVV///bKqv//+Wqq///5FVV///lqqv//+RVVf//3IAA///yKqv//9NVVYsI///TVVWL///cgAD/AA3VVf//5aqr/wAbqqv//+Wqq/8AG6qr///y1VX/ACTVVYu5CA5q94D3RRX7RfcM90X3Ptn7PrsHnq33K4uL2fsAi/c297n7FYv7Kfu6+y/3uvsbi/c2+7n7AIuLPfcri55pi1sF+z49Bg78J/c2+TcVJfvy8Qb7KgQl+/LxBg5r+CL4yhX0xgX///aqq/8AEqqr///z1VX/AA/VVXyYfJj//+9VVf8ACoAA///tqquT///tqquT///s1VX/AAWqq3f/AANVVXf/AANVVf//7FVV/wABqqv//+yqq4v//+dVVYv//+eAAP///Kqr///nqqv///lVVf//56qr///5VVX//+oqqv//9dVW///sqqv///JVVQj//+yqq///8lVV///wVVX//+7VVn///+tVVX///+tVVYX//+eqq4tvi///5qqr/wAF1VV1/wALqqv//+1VVf8AC6qr///tVVX/ABAqqnv/ABSqq///8qqr///jVVX///Cqq///6NVW///sqqr//+5VVf//6Kqr///uVVX//+iqq///9yqrbYv//9tVVQiL///gqqv/AAdVVf//5iqq/wAOqqv//+uqq/8ADqqr///rqqv/ABKAAP//7qqq/wAWVVX///Gqq/8AFlVV///xqqv/ABgqq///86qqpf//9aqrpf//9aqr/wAYKqv///XVVf8AFlVVgf8AFlVVgf8AEoAAgP8ADqqrf/8ADqqrf/8AB1VV///wqquL///tVVUIi3////0qq///9dVV///6VVX///eqq///+lVV///3qqv///iqq///+VVVgoaChoH///xVVYD///2qq4D///2qq///9YAA///+1VWBi///51VVi///6Kqr/wAF1VV1/wALqqt1/wALqqv///FVVf8AEoAA///4qqv/ABlVVQggVwWV///oqqv/AAzVVf//7IAA/wAPqqv///BVVf8AD6qr///wVVX/ABGAAP//84AA/wATVVX///aqq/8AE1VV///2qqv/ABSqq///+Sqqof//+6qrof//+6qrov///dVVo4uli/8AGlVV/wADgAD/ABqqq5L/ABqqq5Kj/wAK1VX/ABVVVf8ADqqrCP8AFVVV/wAOqqv/ABFVVv8AEoAA/wANVVX/ABZVVf8ADVVV/wAWVVX/AAaqq/8AGiqri6mLo///+qqr/wAWKqv///VVVf8AFFVV///1VVX/ABRVVXz/ABGAAP//7Kqr/wAOqqv/ABiqq/8AC1VV/wAUVVX/ABEqq5uim6KT/wAZgACLpwiL/wAfVVX///iqq/8AGlVW///xVVX/ABVVVf//8VVV/wAVVVX//+2AAP8AEiqr///pqqua///pqqua///n1VX/AAzVVXH/AAqqq3H/AAqqq///59VV/wAKgAD//+mqq/8AClVV///pqqv/AApVVf//7YAA/wALVVb///FVVf8ADFVV///xVVX/AAxVVf//+Kqr/wAPgACL/wASqqsIi/8AFqqr/wAIgAD/ABCqqpz/AAqqq5z/AAqqq/8AEoAA/wAFVVWfi/8AFVVVi/8AE1VW///6VVX/ABFVVf//9Kqr/wARVVX///Sqq/8ADFVW///wVVX/AAdVVXcIZ/wIFSq4Bf//9qqrj///9lVV/wAEgACBkIGQ///21VX/AAWqq///96qr/wAGVVX///eqq/8ABlVV///5Kqr/AAeqq///+qqrlP//+qqrlP///VVV/wAKgACLl4v/ABNVVf8ABaqr/wAOqqv/AAtVVZX/AAtVVZX/AA2qq/8ACKqrm/8AB1VVCORhBf8ACVVV///6qqv/AAmAAP//+tVV/wAJqquG/wAJqquG/wAIqqr///oqq/8AB6qr///5VVX/AAeqq///+VVV/wAGVVX///hVVpD///dVVZD///dVVf8AAoAA///1VVaL///zVVWL///yqqv///tVVf//8qqq///2qqv///Kqq///9qqr///yqqv///VVVYF////5VVUIDvwBWfkQFVcK92IWVwoO90P44Pe9FS0G///+qqtx///3qqr//+3VVf//8Kqr///1qqv///Cqq///9aqr///tqqr///rVVf//6qqri///7qqri///8Kqq/wADVVX///Kqq/8ABqqr///yqqv/AAaqq///9NVV/wAJVVWCl4KX///5KquZ///7VVWb///7VVWb///9qqv/ABFVVYv/ABKqqwiLr/8ACIAA/wAdqquc/wAXVVWc/wAXVVX/ABvVVf8AC6qr/wAmqquLnYv/ABBVVf//+6qr/wAOqqv///dVVf8ADqqr///3VVX/AAmqqnv/AASqq///6KqrCOkGh6P///iqq/8AFSqr///1VVX/ABJVVf//9VVV/wASVVX///Kqq/8ADyqre5d7l3mUd5F3kf//6qqrjv//6VVVi2uL///jqqv///rVVf//51VV///1qqv//+dVVf//9aqr///rgAD///GAAP//76qr///tVVUI///vqqv//+1VVf//84AA///p1Vb///dVVf//5lVV///3VVX//+ZVVf//+6qr///j1VaL///hVVWLbf8ABIAAb5RxlHGY///pVVWc///sqquc///sqqv/ABTVVf//8NVV/wAYqquA/wAYqquAp///+oAA/wAfVVWLCKGL/wAU1VX/AANVVf8AE6qr/wAGqqv/ABOqq/8ABqqr/wAR1VX/AAnVVZuYm5j/AA2AAJuWnpae/wAHKqv/ABYqq/8AA1VV/wAZVVUI/MTEFWkK6xZqCg77qPeH+GoVZNn3PQeL/wAoqqv///WAAP8AHiqqdv8AE6qrdv8AE6qr///dgAD/AAnVVVuL///lVVWL///mqqv///xVVXP///iqq3P///iqq///61VV///0qqr//+6qq///8KqrCLZWBZeV/wAMqqv/AAfVVf8ADVVV/wAFqqv/AA1VVf8ABaqrmv8AAtVV/wAQqquL/wATVVWL/wAQVVb///1VVf8ADVVV///6qqv/AA1VVf//+qqr/wAGqqv///eqqov///SqqwiDegd3i///6oAA////Kqt0///+VVV0///+VVX//+qqq///+9VW///sVVX///lVVf//7FVV///5VVX//++AAIH///Kqq///8qqr///yqqv///Kqq///+VVV///tqqqL///oqquLef8ABCqr///xKqv/AAhVVf//9FVV/wAIVVX///RVVZWC/wALqqv///mqqwj/AAuqq///+aqrl///+6qq/wAMVVX///2qq/8ADFVV///9qqv/AAqAAP///tVV/wAIqquL/wATVVWL/wATgAD/AANVVf8AE6qr/wAGqqv/ABOqq/8ABqqr/wAO1VX/AAuqqpX/ABCqqwht3hWnhQaLef//+lVV///xKqv///Sqq///9FVV///0qqv///RVVXf///oqq///41VVi///81VVi///9IAA/wACqqv///Wqq/8ABVVV///1qqv/AAVVVf//+tVV/wAHqquLlYv/AAiqq/8AA6qr/wAGqqr/AAdVVf8ABKqr/wAHVVX/AASqq/8ACNVW/wADqqr/AApVVf8AAqqrCP8AClVV/wACqqv/AArVVv8AAaqq/wALVVX/AACqq/8AC1VV/wAAqqv/AAmqq/8AAFVVk4sIDiH3IveMFWsK9vdDFWsKDrT4ivfqFftX8fe9/LIlBw773Q73Q/eV+L0V/Brr9yqiB+T7KvSLJ/cvBf8ACqqr/wABVVX/AAqAAP8AA9VW/wAKVVX/AAZVVf8AClVV/wAGVVX/AAlVVv8ACCqr/wAIVVWV/wAIVVWV/wAG1Vb/AAwqq/8ABVVV/wAOVVX/AAVVVf8ADlVV/wACqqv/AA/VVov/ABFVVYv/ABdVVYb/ABMqq4GagZr///LVVf8AC6qr///vqqv/AAhVVQj//++qq/8ACFVV///tVVX/AAXVVnb/AANVVXb/AANVVf//6iqr/wABqqv//+lVVYsIbfs2Fd+6B5GL/wAGqqv///+qq/8AB1VV////VVX/AAdVVf///1VV/wAG1Vb///5VVv8ABlVV///9VVX/AAZVVf///VVV/wAFVVb///vVVv8ABFVV///6VVX/AARVVf//+lVV/wACKqv///gqq4uBi4H///3VVf//+Cqr///7qqv///pVVf//+6qr///6VVX///qqqv//+9VW///5qqv///1VVQj///mqq////VVV///5Kqr///5VVv//+Kqr////VVX///iqq////1VV///5VVX///+qq4WLCPwHZhVpCusWagoO/AH3tvjnFWwKDvt1s/jEFW0K2RZuCg6096/40hX7I/txJfdx+yPx9yP3b/H7b/cjB/vX/EwVJfiy8QcO+4Sq+BQVLPfX3/tajQf3IPcABf8AJqqr/wAdVVX/ABNVVf8AJFVWi/8AK1VVi/8AKqqr///xgACrbv8AFVVVbv8AFVVV///bgAD/AAqqq1+LXYv//9oqq4D//+JVVXX//+JVVXX//++AAGj///yqq1sI64UF/wABVVX/AA9VVf8ABiqr/wAM1VaW/wAKVVWW/wAKVVX/AA6AAP8ABSqrnYv/AA9VVYv/AA0qq4iWhZaF/wAFgACBi32Lgf//+4AA///2VVWC///2qquC///2qqv///bVVf//91VV///2qquDCA77hPcm+LwVbwoO/AH3SvlYFXAKDvdQ+HQV+wz9WPcM93MG/wAOqqv///tVVf8AElVV///9qquhi7OL/wAfqqv/AAjVVf8AF1VV/wARqqv/ABdVVf8AEaqr/wARVVb/ABTVVf8AC1VVowiNPvcG+HT7DPuaBot7if//8Kqrh///8VVVh///8VVV///5gAB+gv//9Kqrgv//9Kqr///0qquC///yVVX///lVVf//8lVV///5VVX//+8qq////Kqrd4v//+qqq4v//++AAP8ABNVV///0VVX/AAmqq///9FVV/wAJqqv///dVVpf///pVVf8ADlVVCP//+lVV/wAOVVX///yAAP8AD1VW///+qqv/ABBVVf///qqr/wAQVVX///9VVf8ADtVWi/8ADVVVCA5y94r35hX8ZOX5jvb9juX51vuhB///3VVVi///4FVW///8gAD//+NVVYT//+NVVYT//+eAAID//+uqq3z//+uqq3z///Aqqv//7IAA///0qqtz///0qqtz///6VVX//+NVVYv//96qq4tx/wAFKqv//+fVVf8AClVV///pqqv/AApVVf//6aqr/wAOgAD//+yqqv8AEqqr///vqqsI/wASqqv//++qq/8AFoAA///zVVX/ABpVVYL/ABpVVYL/AB2AAP//+4AA/wAgqquLCA773c/3txUhCg78AfdFTxVxCg77hPdH+PIVcgoO+3j3Wfg9Ff8AF1VVi6H/AAOAAP8AFKqrkv8AFKqrkp2V/wAPVVWY/wAPVVWYl/8AD4AA/wAIqqud/wAIqqud/wAEVVWfi6GLof//+6qrn///91VVnf//91VVnX//AA+AAP//8KqrmAj///Cqq5h5/wAKKqv//+tVVf8AB1VV///rVVX/AAdVVXX/AAOqq///6Kqri///6Kqri///6lVV///8VVV3///4qqt3///4qqv//+6AAP//9dVVfH58fv//9Cqr///wgAD///dVVXn///dVVXn///uqq3eLdQj///9VVXWPd/8ACKqref8ACKqref8AC9VV///wgACafpp+/wARqquB/wAUVVWE/wAUVVWE/wAV1Vb///yAAP8AF1VViwjTBH2L///zqqv/AAJVVf//9VVV/wAEqqv///VVVf8ABKqr///3KquRhP8AB1VVhP8AB1VV///61VWT///8qqv/AAiqq////Kqr/wAIqqv///5VVf8ACKqqi/8ACKqri/8ACKqr/wABqqv/AAjVVf8AA1VVlP8AA1VVlP8ABSqr/wAIKquS/wAHVVUIkv8AB1VV/wAI1VWR/wAKqqv/AASqq/8ACqqr/wAEqqv/AAxVVf8AAlVVmYuZi/8ADFVV///9qqv/AAqqq///+1VV/wAKqqv///tVVf8ACNVVhZL///iqq5L///iqq/8ABVVV///31VX/AAOqq4L/AAOqq4L/AAHVVf//9yqri///91VVCIv///dVVf///iqr///3VVb///xVVf//91VV///8VVX///dVVf//+qqrg4T///iqq4T///iqq///9yqrhf//9VVV///7VVX///VVVf//+1VV///zqqv///2qq32LCA4h+A33ihVzCiD7QxVzCg73nPc8+PIVcgr5AfxSFTbx4MDfVveU+wQH+1D7mos9Bfda924V+xorB+r3HAUj+EcVJAoO95z3P/jyFXIK+FT8SBUs99bf+1qNB/cg9wAF/wAmqqv/AB1VVf8AE1VV/wAkVVaL/wArVVWL/wAqqqv///GAAKtu/wAVVVVu/wAVVVX//9uAAP8ACqqrX4tdi///2iqrgP//4lVVdf//4lVVdf//74AAaP///KqrWwjrhQX/AAFVVf8AD1VV/wAGKqv/AAzVVpb/AApVVZb/AApVVf8ADoAA/wAFKqudi/8AD1VVi/8ADSqriJaFloX/AAWAAIGLfYuB///7gAD///ZVVYL///aqq4L///aqq///9tVV///3VVX///aqq4MI+wT4gRUkCg73nPlf9+MV+0b7DI0H9wr3RAX8z/dtFW8K+K78ZxU28eC/31f3lPsEB/tQ+5qLPQX3BfkjFSQKDiH3yfepFfsMZQaL///yqquKgIn///dVVYn///dVVf///NVV///4Kqv///uqq4T///uqq4T///qAAP//+Sqr///5VVX///lVVf//+VVV///5VVWD///4VVb///aqq///91VV///xVVV9///yKqv///Kqq37///NVVX7///NVVf//9IAA///yqquBfQiBfYP/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VVWv///2qqv/ACKqq///9qqr/wAiqqv///Mqqv8AISqq///vqqv/AB+qq///76qr/wAfqqv//+0qqv8AHlVV///qqquo///qqquo///pVVX/ABuAAHOlCDf8xhV1i///7FVVj///7qqrk///7qqrk///8Sqq/wAKqqv///Oqq/8ADVVV///zqqv/AA1VVf//9qqq/wAPVVb///mqq/8AEVVV///5qqv/ABFVVf///NVVnYv/ABKqq4v/ABKqq/8AAyqrnf8ABlVV/wARVVX/AAZVVf8AEVVV/wAJVVb/AA9VVv8ADFVV/wANVVUI/wAMVVX/AA1VVf8ADtVW/wAKqqv/ABFVVZP/ABFVVZP/ABOqq4+hi6GL/wATqquH/wARVVWD/wARVVWD/wAO1Vb///VVVf8ADFVV///yqqv/AAxVVf//8qqr/wAJVVb///Cqqv8ABlVV///uqqv/AAZVVf//7qqr/wADKqt5i///7VVVCIv//+1VVf///NVVef//+aqr///uqqv///mqq///7qqr///2qqr///Cqqv//86qr///yqqv///Oqq///8qqr///xKqr///VVVf//7qqrg///7qqrg///7FVVh3WLCA7P+HQVXAo84xV1Cg58t/eEFV0K9wwWTwr3UPfYFUgKDny394QVXQr3DBZPCvdV+GgVcAoOfLf3hBVdCvcMFk8K92X32BV0Cg58t/eEFV0K9wwWTwpg99wVdQoOfLf3hBVdCvcMFk8KZPggFVcK92IWVwoOtPjw9/YVJgr77vd7FYUK+/wEhQoOfPgU9/wVhgr7MfuFFYcK9/T39xWICg74jhZiClH4yBVICg74jhZiClb5WBVwCg74jhZiCmb4yBV0Cg74jhZiCvux+RAVVwr3YhZXCg4hjvh0FWYK90X3eBVwCg6Qz/mIFf5s9wz3tY4HkYP/AAeqq///99VV/wAJVVX///eqq/8ACVVV///3qqv/AAtVVv//+Cqq/wANVVX///iqq/8ADVVV///4qqv/AA9VVoX/ABFVVf//+1VV/wARVVX///tVVZ////2qq/8AFqqri62L/wAfVVX/AAaAAP8AHKqrmP8AHKqrmP8AGIAA/wAR1VX/ABRVVf8AFqqrCP8AFFVV/wAWqqv/AA/VVv8AGqqq/wALVVX/AB6qq/8AC1VV/wAeqqv/AAWqq6yL/wAjVVWL/wAjVVX///qqq6z///VVVf8AHqqr///1VVX/AB6qq///8FVW/wAaqqr//+tVVf8AFqqr///rVVX/ABaqq3L/ABHVVf//4qqrmP//4qqrmGr/AAaAAP//21VViwhpi///4Kqr///5qqv//+NVVf//81VV///jVVX///NVVf//6lVW///tqqv///FVVXMIiffmBveq/JgVTAoOIY74dBVmClT3MBVXCvdiFlcKDuz3yPlYFSgKvvxKFSkK9zP3eRVsCg4z+ATNFUkKh/cpFUoK9wD4EBVsCg7s98j5WBUoCr78ShUpCiP36hWJCg4z+ATNFUkKh/cpFUoK+y/4gRWKCg7s+UX7WBVyvAX///iqq4X///eAAIb///ZVVYf///ZVVYf///aAAIn///aqq4v///NVVYv///Uqq/8ABIAAgpSClP//+4AA/wAK1VWL/wAMqquLlf8AAoAA/wAKqquQ/wALVVWQ/wALVVX/AAZVVf8ACyqr/wAHqquWCP8AB6qrlv8ACCqq/wAKVVX/AAiqq/8ACaqr/wAIqqv/AAmqq/8ACFVV/wAIgACT/wAHVVUI3Yv7xflY+wGL+8j9WPchi8v3NvfHi837NgX///VVVf//91VV///1VVb///Yqq///9VVVgP//9VVVgP//9iqr///0KquC///zVVWC///zVVX///iqq///8tVW///6VVX///JVVf//+lVV///yVVX///0qq///8oAAi///8qqri///8VVV/wAC1VX///Mqq/8ABaqrgP8ABaqrgP8AB6qq///2qqv/AAmqq///+FVVCP8ACaqr///4VVWW///6VVb/AAxVVf///FVV/wAMVVX///xVVf8ADNVW///+Kqv/AA1VVYv/ABKqq4v/ABHVVf8AA4AAnJKckv8AD4AA/wAJKquZ/wALVVUI+3H4ZhUpCg4z+ATNFUkH///1VVX///dVVf//9VVW///2Kqv///VVVYD///VVVYD///Yqq///9Cqrgv//81VVgv//81VV///4qqv///LVVv//+lVV///yVVX///pVVf//8lVV///9Kqv///KAAIv///Kqq4v///FVVf8AAtVV///zKqv/AAWqq4D/AAWqq4D/AAeqqv//9qqr/wAJqqv///hVVQj/AAmqq///+FVVlv//+lVW/wAMVVX///xVVf8ADFVV///8VVX/AAzVVv///iqr/wANVVWL/wASqquL/wAR1VX/AAOAAJySnJL/AA+AAP8ACSqrmf8AC1VVCHK8Bf//+Kqrhf//94AAhv//9lVVh///9lVVh///9oAAif//9qqri///81VVi///9Sqr/wAEgACClIKU///7gAD/AArVVYv/AAyqq4uV/wACgAD/AAqqq5D/AAtVVZD/AAtVVf8ABlVV/wALKqv/AAeqq5YI/wAHqquW/wAIKqr/AApVVf8ACKqr/wAJqqv/AAiqq/8ACaqr/wAIVVX/AAiAAJP/AAdVVQi596gGi/8AC1VV////qqv/AA0qq////1VVmv///1VVmv///dVW/wAPgAD///xVVZv///xVVZuF/wAP1VX///eqq/8AD6qr///3qqv/AA+qq///9Cqq/wAN1VX///Cqq5f///Cqq5f//+yqqv8ACdVV///oqqv/AAeqq///6Kqr/wAHqqv//+NVVf8AA9VVaYsIZYv//9sqq///+iqr///cVVX///RVVf//3FVV///0VVX//+DVVv//7Cqr///lVVVvCMpMBZv/AA9VVZ7/AAwqq6GUoZT/ABeqq/8ABIAA/wAZVVWLq4v/ABpVVf//+IAA/wAUqqt8/wAUqqt8/wAKVVX//+mAAIttCH5tB3eL///qqqv///+AAP//6VVViv//6VVViv//6YAA///9qqv//+mqq////FVV///pqqv///xVVf//6oAA///6gAD//+tVVf//+Kqr///rVVX///iqq///7dVW///2Kqr///BVVf//86qr///wVVX///Oqq///84AA///wqqr///aqq///7aqr///2qqv//+2qq///+1VV///p1VWLcQiLc5B2lXmVef8ADSqrfP8AEFVVf/8AEFVVf/8AEqqrgqCFoIX/ABWAAIihi6uL/wAdVVWR/wAaqquX/wAaqquXoZ//ABFVVacIh/cpFXAHi2n///ZVVf//5Sqr///sqqv//+xVVf//7Kqr///sVVX//+FVVf//9iqrYYuBi4H/AAEqq4H/AAJVVYH/AAJVVYL/AAPVVoP/AAVVVYP/AAVVVf//+YAA/wAGgACG/wAHqquG/wAHqqv///2AAP8ACYAAi/8AC1VVCIv/ABCqq/8ABlVV/wANVVX/AAyqq5X/AAyqq5X/AA+AAP8AB4AA/wASVVWQ/wASVVWQ/wATgAD/AAMqq/8AFKqr/wABVVX/ABSqq/8AAVVV/wASqqr/AACqq/8AEKqriwgOx/jJ+LIVLQr7Eff6FXAKDvsj+CD35BVNClT4CBVwCg7H+Mn4shUtCjb3ahV0Cg77I/gg9+QVTQpp93gVdAoOx/jJ+LIVLQr7eveyFVcKDvsj+CD35BVNCvtH98AVVwoOx/jJ+LIVLQr7cPf6FYsKDvsj+CD35BVNCvs++AgViwoO9xra+VgVLgpQ/OYVLwpq+aYViwoOkPhU0xVOCvuu9zwVTwr4jvhoFYwKDvca2vfYFXsK97L7ZhV8Cg6Q+Q34yRXZRPcF+wz7BfsVPfcV+yaIB4WT///4VVX/AAgqq///9qqr/wAIVVX///aqq/8ACFVV///0qqr/AAfVVv//8qqr/wAHVVX///Kqq/8AB1VV///wgACR///uVVX/AASqq///7lVV/wAEqqv//+wqq/8AAlVVdYtpi///4Kqr///5gAD//+NVVX7//+NVVX7//+eAAP//7iqr///rqqv//+lVVQj//+uqq///6VVV///wKqr//+VVVv//9Kqr///hVVX///Sqq///4VVV///6VVVqi///3Kqri///3Kqr/wAFVVVq/wAKqqv//+FVVf8ACqqr///hVVX/AA+qqv//5VVW/wAUqqv//+lVVf8AFKqr///pVVX/ABjVVf//7iqrqH6ofv8AISqr///5gAD/ACVVVYsIrYv/AB+qq/8ABoAA/wAdVVWY/wAdVVWY/wAXVVb/ABWAAP8AEVVVqQiNQ/cG+MkG/CL72RVPCg592vlYFTAKR9oVbAoO9zj3WhVQCveK5RVRCr33xxVsCg592vlYFTAK+9z3VBWJCg73OPdaFVAK94rlFVEK+2n4OBWKCg592vlYFTAK+7b3DBVXCg73OPdaFVAK94rlFVEK+0/38BVXCg592vlYFf1Y+AIH///1VVX///dVVf//9VVW///2Kqv///VVVYD///VVVYD///Yqq///9Cqrgv//81VVgv//81VV///4qqv///LVVv//+lVV///yVVX///pVVf//8lVV///9Kqv///KAAIv///Kqq4v///FVVf8AAtVV///zKqv/AAWqq4D/AAWqq4D/AAeqqv//9qqr/wAJqqv///hVVQj/AAmqq///+FVVlv//+lVW/wAMVVX///xVVf8ADFVV///8VVX/AAzVVv///iqr/wANVVWL/wASqquL/wAR1VX/AAOAAJySnJL/AA+AAP8ACSqrmf8AC1VVCHK8Bf//+Kqrhf//94AAhv//9lVVh///9lVVh///9oAAif//9qqri///81VVi///9Sqr/wAEgACClIKU///7gAD/AArVVYv/AAyqq4uV/wACgAD/AAqqq5D/AAtVVZD/AAtVVf8ABlVV/wALKqv/AAeqq5YI/wAHqquW/wAIKqr/AApVVf8ACKqr/wAJqqv/AAiqq/8ACaqr/wAIVVX/AAiAAJP/AAdVVQjG9wb7/fdU99n3BvvZ90L36/cGBg74MvtYFXK8Bf//+Kqrhf//94AAhv//9lVVh///9lVVh///9oAAif//9qqri///81VVi///9Sqr/wAEgACClIKU///7gAD/AArVVYv/AAyqq4v/AAlVVf8AAiqrlf8ABFVV/wAKqqv/AARVVf8ACqqr/wAFgAD/AApVVf8ABqqrlQj/AAaqq5X/AAdVVf8ACaqrk/8ACVVVk/8ACVVV/wAHqqv/AAhVVv8AB1VV/wAHVVWn/wAFVVX/ABrVVf8ACdVW/wAZqqv/AA5VVf8AGaqr/wAOVVX/ABeAAP8AFIAA/wAVVVX/ABqqqwg1zAX///Cqq///7VVV///uKqr///CAAP//66qr///zqqv//+uqq///86qr///m1VX///nVVW2LaYtulXOfc599p4evCPgCrAaLtf//+oAA/wAlKquA/wAgVVWA/wAgVVX///Cqq/8AGyqr///sVVWh///sVVWh///oVVb/ABDVVf//5FVV/wALqqv//+RVVf8AC6qr///hgAD/AAXVVf//3qqri2eLaYVrf2t////kVVV6///oqqt1CP//6Kqrdf//7YAA///lgAD///JVVWz///JVVWz///kqq///3YAAi2WL///bVVX/AAZVVf//3qqr/wAMqqtt/wAMqqtt/wARVVX//+Yqq6H//+pVVaH//+pVVaX//+7VVqn///NVVan///NVVav///iqq62JCP//9qqr///3VVX///aqqv//9lVW///2qqv///VVVf//9qqr///1VVX///eqqoD///iqq///9Kqr///4qqv///Sqq4X///Qqqv//+1VV///zqqv///tVVf//86qr///9qqv///PVVYt/i///8VVV/wAC1VX///Mqq/8ABaqrgP8ABaqrgP8AB6qq///2qqv/AAmqq///+FVVCP8ACaqr///4VVWW///6VVb/AAxVVf///FVV/wAMVVX///xVVf8ADNVW///+Kqv/AA1VVYv/ABKqq4v/ABHVVf8AA4AAnJKckv8AD4AA/wAJKquZ/wALVVUIh/h4FfuKBv8ABKqr/wAiqqv/AAzVVf8AG6qqoP8AFKqroP8AFKqr/wAcgAD/AApVVa+LsYv/AB2qq4H/ABVVVXf/ABVVVXeWb/8AAKqrZwgOfdr5WBUwCvu291QViwoO9zj3WhVQCveK5RVRCvtF+DgViwoO9y35WL8VMgr7eflUFXQKDpD4xvh0FVMK+5T36RVUCuT3SBV0Cg73LflYvxUyCvwi+eQViQoOkPjG+HQVUwr7lPfpFVQKOffYFYoKDvct+Vi/FTIK/Af5nBVXCg6Q+Mb4dBVTCvuU9+kVVApJ95AVVwoO9y35WL8VMgr73fsEFY0KDpD4xvh0FVMK+5T36RVUCr73XBXR91ogizb7WgUO9wja+VgVMwr3fbsVdAoO91D4MRVVCvc8+BMVdAoO9wja+VgV/Vj3EvfM99/7zPcS+Vj7EjL73+QH99/7rhX73/cH998GDvfR+MkV2fsV9wX7DPsFRD3S/Mn3DPeaB4ubjf8AD1VVj/8ADqqrj/8ADqqr/wAGgACYlP8AC1VVlP8AC1VV/wALVVWU/wANqqv/AAaqq/8ADaqr/wAGqqv/ABDVVf8AA1VVn4v/ABSqq4v/ABBVVf//+yqrl///9lVVl///9lVV/wAI1VV//wAFqqv///Gqqwj/AAWqq///8aqr/wADgAD///Cqqv8AAVVV///vqqv/AAFVVf//76qr/wAAqqv///Eqqov///Kqqwj7h/cM98MHi/8AGKqriP8AF6qqhf8AFqqrhf8AFqqrgZ99/wARVVV9/wARVVX//+3VVZn//+mqq/8ACqqr///pqqv/AAqqq///5NVV/wAFVVVri2WL///hVVX///fVVf//6Kqr///vqqv//+iqq///76qr///vqqr//+3VVf//9qqrdwiJ9ywGDvvv1/lYFTQK+4q/FXUKDvwB0fh0FVYK+4bjFXUKDvvv1/lYFTQK69oVbAoO/AHR+HQVVgrx9wcVbAoO++/X+VgVNAr7OvdWFYoKDvwB0fh0FVYK+zf3VxWKCg7779f5WBX9WKcH///1VVX///dVVf//9VVW///2Kqv///VVVYD///VVVYD///Yqq///9Cqrgv//81VVgv//81VV///4qqv///LVVv//+lVV///yVVX///pVVf//8lVV///9Kqv///KAAIv///Kqq4v///FVVf8AAtVV///zKqv/AAWqq4D/AAWqq4D/AAeqqv//9qqr/wAJqqv///hVVQj/AAmqq///+FVVlv//+lVW/wAMVVX///xVVf8ADFVV///8VVX/AAzVVv///iqr/wANVVWL/wASqquL/wAR1VX/AAOAAJySnJL/AA+AAP8ACSqrmf8AC1VVCHK8Bf//+Kqrhf//94AAhv//9lVVh///9lVVh///9oAAif//9qqri///81VVi///9Sqr/wAEgACClIKU///7gAD/AArVVYv/AAyqq4uV/wACgAD/AAqqq5D/AAtVVZD/AAtVVf8ABlVV/wALKqv/AAeqq5YI/wAHqquW/wAIKqr/AApVVf8ACKqr/wAJqqv/AAiqq/8ACaqr/wAIVVX/AAiAAJP/AAdVVQiv+VgGDvwB0fh0Ffx0B///9VVV///3VVX///VVVv//9iqr///1VVWA///1VVWA///2Kqv///Qqq4L///NVVYL///NVVf//+Kqr///y1Vb///pVVf//8lVV///6VVX///JVVf///Sqr///ygACL///yqquL///xVVX/AALVVf//8yqr/wAFqquA/wAFqquA/wAHqqr///aqq/8ACaqr///4VVUI/wAJqqv///hVVZb///pVVv8ADFVV///8VVX/AAxVVf///FVV/wAM1Vb///4qq/8ADVVVi/8AEqqri/8AEdVV/wADgACckpyS/wAPgAD/AAkqq5n/AAtVVQhyvAX///iqq4X///eAAIb///ZVVYf///ZVVYf///aAAIn///aqq4v///NVVYv///Uqq/8ABIAAgpSClP//+4AA/wAK1VWL/wAMqquLlf8AAoAA/wAKqquQ/wALVVWQ/wALVVX/AAZVVf8ACyqr/wAHqquWCP8AB6qrlv8ACCqq/wAKVVX/AAiqq/8ACaqr/wAIqqv/AAmqq/8ACFVV/wAIgACT/wAHVVUIxfh0Bvsd9zcVVwoO++/X+VgVNAr7H/cMFVcKDvwB0fh0FVYKDvci1/lYFTQK+H/8lBU1Cg77IdH4dBVWCvsd9zcVVwr3/fs3FVgK+x35NBVXCg77Efg+91gVNQqR+MQVdAoO/AH3Uvh0FVgKk/jlFXQKDsfa+VgVNgrY/ZQVjQoOM8/5iBVZCqP9xBWNCg4h2vlYFTcKYvdUFXAKDvwB0fmIFVoKZvdMFXAKDiHa+VgVNwqh/ZQVjQoO/AHR+YgVWgol/cQVjQoOIdr5WBU3CvcFFowKDvwB0fmIFVoK9wlbFYwKDiHa+VgVNwr3F/vdFVcKDvuF0fmIFVoKv/wMFVcKDiHa908V+0/4P/cG+8H3TAf3YvdKi/cB+2L7SYv3wPsSi4v8L0VNi/sCBQ78AdH3pRX7pfcM+B8H0M+L9kZGi/eT+wyLi/wKRkaL+wEFDvc/2vlYFTkK91n3VBVwCg7P+HQVXAr3E/d4FXAKDvc/2vlYFTkK4P2UFY0KDs/4dBVcCrv8sBWNCg73P9r5WBU5Ct/3VBWLCg7P+HQVXAq293gViwoOz/h0FVwK+0z3eBWMCg73ZLT38xU6CvcYkxU7Cvgm+EAVbAoOfLf3hBVdCvcMFk8K98H39xVsCg73ZLT38xU6CvcYkxU7Cvcf+LEViQoOfLf3hBVdCvcMFk8Ks/hoFYoKDvdktPfzFToK9xiTFTsK91L4sRVwCtAWcAoOfLf3hBVdCvcMFk8K2vhoFXAK0BZwCg74C/kZ+DgV90L3tPcG/HQHS4v//8cqq4L//85VVXn//85VVXn//9XVVv//5yqr///dVVX//+BVVf//3VVV///gVVX//+Wqq///2qqreWB5YIL//9Eqq4v//81VVYtZlP//0YAAnWCdYP8AGlVV///agAD/ACKqq2sI/wAiqqtr/wAqKqpy/wAxqqt5/wAxqqt5/wA41VWCy4sI+IX3BvvF91T3ovcGBvwg90IV/HRMB///8Kqri///7qqq/wABgAD//+yqq47//+yqq47//+yAAJD//+xVVZL//+xVVZL//+yqq/8ACVVVeP8AC6qreP8AC6qr///vKqv/AA6qqv//8VVV/wARqqv///FVVf8AEaqr///0Kqv/ABUqqoL/ABiqq4L/ABiqq///+4AA/wAcVVWLqwiLq/8ABIAA/wAcVVWU/wAYqquU/wAYqqv/AAvVVf8AFSqq/wAOqqv/ABGqq/8ADqqr/wARqqv/ABDVVf8ADqqqnv8AC6qrnv8AC6qr/wATVVX/AAlVVf8AE6qrkv8AE6qrkv8AE4AAkP8AE1VVjv8AE1VVjv8AEVVW/wABgAD/AA9VVYsIDvfB+LD3YBX38qwGi/8AI1VV///7VVX/ACEqq///9qqrqv//9qqrqv//8aqqpv//7Kqrov//7Kqrov//59VV/wASKqtu/wANVVVu/wANVVX//94qq/8ABqqr///ZVVWLZ4v//96qq///+aqr///hVVX///NVVf//4VVV///zVVVx///sVVb//+qqq///5VVVCHP/ABqqq///5FVV/wATqqr//+Cqq/8ADKqr///gqqv/AAyqq///3lVV/wAGVVVni2eLaYVrf2t////kVVV6///oqqt1///oqqt1///tgAD//+WAAP//8lVVbP//8lVVbP//+Sqr///dgACLZQiLZf8ABtVV///dgAD/AA2qq2z/AA2qq2z/ABKAAP//5YAA/wAXVVV1/wAXVVV1/wAbqqt6q3+rf62Fr4v/ACNVVYv/ACEqq/8ABiqrqv8ADFVVqv8ADFVV/wAbgAD/ABOAAKP/ABqqqwj/ABKqq///51VV/wAYVVV4qf//8qqrqf//8qqrrv//+VVVs4u3i/8AJ4AA/wAHqquu/wAPVVWu/wAPVVX/AB7VVf8AGlVW/wAaqqv/ACVVVQg4xgX///Cqq///7VVV///uVVX///CAAHf///Oqq3f///Oqq3L///nVVW2L///zVVWL///yqqv/AALVVX3/AAWqq33/AAWqq///8yqr/wAIKqr///RVVf8ACqqr///0VVX/AAqqq///9oAA/wAMqqr///iqq/8ADqqr///4qqv/AA6qq////Kqq/wAQVVX/AACqq50I93rfFft+Bv8AAKqr/wASqquP/wAQgAD/AAdVVf8ADlVV/wAHVVX/AA5VVf8ACYAA/wAL1Vb/AAuqq/8ACVVV/wALqqv/AAlVVf8ADSqq/wAHKqv/AA6qq5D/AA6qq5D/AA5VVf8AAoAAmYuri/8AGlVV///11VX/ABSqq///66qr/wAUqqv//+uqq/8ACqqq///kKqr/AACqq///3KqrCPz6WxWLn/8AAyqr/wATKqv/AAZVVf8AElVV/wAGVVX/ABJVVf8ACVVWm/8ADFVV/wANqqv/AAxVVf8ADaqr/wAO1Vb/AArVVf8AEVVVk/8AEVVVk/8AE6qrj6GL/wAWqquL/wAUKqqH/wARqquD/wARqquDmv//9Sqr/wAMVVX///JVVQj/AAxVVf//8lVV/wAJVVZ7/wAGVVX//+2qq/8ABlVV///tqqv/AAMqq///7NVVi3eLd////NVV///s1VX///mqq///7aqr///5qqv//+2qq///9qqqe///86qr///yVVX///Oqq///8lVVfP//9Sqr///uVVWD///uVVWD///r1VaH///pVVWLCHWL///sVVWP///uqquT///uqquT///xKqr/AArVVf//86qr/wANqqv///Oqq/8ADaqr///2qqqb///5qqv/ABJVVf//+aqr/wASVVX///zVVf8AEyqri58IDpDa+VgVPgp1+8AVPwqR+IAVcAoO+4DP+HQVXwq393gVcAoOkNr5WBU+CnX7wBU/Ck38aBWNCg77gM/4dBVfClT8sBWNCg6Q2vlYFT4KdfvAFT8KVfiAFYsKDvuAz/h0FV8KXPd4FYsKDvg++MAVQAot9+wVcAoO+0n32PfvFWAKR/f9FXAKDvg++MAVQApT91wVdAoO+0n32PfvFWAKd/dtFXQKDvg++MAV5+wFb6X//+Cqq/8AEqqr///dVVX/AAtVVf//3VVV/wALVVX//9uqq/8ABaqrZYv//99VVYtr///7qqv//+Cqq///91VV///gqqv///dVVf//5Cqq///y1Vb//+eqq///7lVV///nqqv//+5VVf//7FVV///p1VZ8///lVVV8///lVVX///iAAP//4FVWi///21VVCIth/wAIVVX//96AAP8AEKqrcv8AEKqrcv8AFKqqd/8AGKqrfP8AGKqrfKb///Qqq/8AHVVV///3VVX/AB1VVf//91VVpv//9tVW/wAYqqv///ZVVf8AGKqr///2VVX/ABSqqv//9Cqr/wAQqqt9/wAQqqt9/wAIVVV3i3EIi3v///xVVf//8dVV///4qqv///Oqq///+Kqr///zqqv///ZVVf//9dVVf4N/g///8qqrhf//8VVVh///8VVVh///8VVWif//8VVVi2+L///lgAD/AAaAAHKYcpj//+vVVf8AEiqr///wqqv/ABdVVQgsLwWn///fVVX/ACCAAP//6CqrsHywfP8AJ4AA///31VW1///+qqsIWUOmcgWRjZH/AAGqq5H/AAFVVZH/AAFVVf8ABlVV/wAAqqv/AAaqq4v/AAqqq4v/AAsqqv///VVV/wALqqv///qqq/8AC6qr///6qqv/AAXVVf//9qqqi///8qqri4OJ///5KquH///6VVWH///6VVX///sqq///+6qr///6VVWICP//+lVViP//+dVW///91VX///lVVf///qqr///5VVX///6qq4X///9VVf//+qqri///4qqri///5Kqq/wAGqqv//+aqq/8ADVVVCHVdBf8AIKqr///tVVX/ACNVVf//9qqrsYv/AA6qq4v/AA+qqv8AAaqr/wAQqqv/AANVVf8AEKqr/wADVVWa/wAFVVb/AA1VVf8AB1VV/wANVVX/AAdVVf8ACyqrlZT/AAyqq5T/AAyqq/8ABIAA/wAPVVWLnYv/ABNVVf///IAA/wAPKquElgiElv//9qqr/wAIVVX///RVVf8ABaqr///0VVX/AAWqq37/AAOAAP//8aqr/wABVVX///Gqq/8AAVVV///xgAD/AACqq///8VVViwiquAWp/wADVVX/ABwqq/8AByqr/wAaVVWW/wAaVVWW/wAW1Vb/AA6qq/8AE1VV/wASVVX/ABNVVf8AElVV/wAPVVb/ABZVVv8AC1VV/wAaVVX/AAtVVf8AGlVV/wAFqqv/AB4qq4uti7X///eqq/8AIaqr///vVVX/ABlVVf//71VV/wAZVVX//+tVVv8AFFVW///nVVX/AA9VVQj//+dVVf8AD1VVcJf//+Kqq/8ACKqr///iqqv/AAiqq3CU///nVVX/AAlVVf//51VV/wAJVVX//+tVVpb//+9VVf8ADKqr///vVVX/AAyqq///96qr/wASVVWLo4ub/wADVVX/AA3VVf8ABqqr/wALqqv/AAaqq/8AC6qr/wAI1VX/AAmAAJb/AAdVVQiW/wAHVVX/AAxVVf8ABVVW/wANqqv/AANVVf8ADaqr/wADVVX/AA4qqv8AAaqr/wAOqquL/wAYqquL/wAXgAD///uAAP8AFlVVgv8AFlVVgv8AEdVW///x1VX/AA1VVf//7KqrCA77SffY9+8V29MF///sqqv/ABqqq///5qqq/wAS1VX//+Cqq5b//+Cqq5b//+BVVf8ABYAAa4tzi///6FVViP//6Kqrhf//6Kqrhf//61VV///2qqt5///zVVV5///zVVX///GAAP//79VWgP//7FVVgP//7FVV///6gAD//+jVVov//+VVVQiL///hVVX/AAZVVXP/AAyqq///7qqr/wAMqqv//+6qq5v///KAAP8AE1VV///2VVX/ABNVVf//9lVV/wAU1VaE/wAWVVX///uqq/8AFlVV///7qqv/ABTVVv//+1VV/wATVVWG/wATVVWGm///+YAA/wAMqquD/wAMqquD/wAGVVX///Oqq4v//+9VVQiL///2qqv///2AAP//99VVhoSGhP//+YAA///6KquD///7VVWD///7VVX///dVVf///Kqr///2qquJ///2qquJgor///dVVYv//+aqq4v//+qAAP8ABYAA///uVVWW///uVVWW///vgAD/AA4qq///8Kqr/wARVVUIO0AF/wAXVVVx/wAaVVb//+2AAP8AHVVVgP8AHVVVgKv///nVVf8AIqqr///+qqsIVj2mcgWRjZH/AAGqq5H/AAFVVZH/AAFVVf8ABlVV/wAAqqv/AAaqq4v/AAqqq4v/AAsqqv///VVV/wALqqv///qqq/8AC6qr///6qqv/AAXVVf//9qqqi///8qqri4OJ///5KquH///6VVWH///6VVX///sqq///+6qr///6VVWICP//+lVViP//+dVW///91VX///lVVf///qqr///5VVX///6qq4X///9VVf//+qqri///4qqri///5Kqq/wAGqqv//+aqq/8ADVVVCHVdBf8AIKqr///tVVX/ACNVVf//9qqrsYv/AA6qq4v/AA+qqv8AAaqr/wAQqqv/AANVVf8AEKqr/wADVVWa/wAFVVb/AA1VVf8AB1VV/wANVVX/AAdVVf8ACyqrlZT/AAyqq5T/AAyqq/8ABIAA/wAPVVWLnYv/ABNVVf///IAA/wAPKquElgiElv//9qqr/wAIVVX///RVVf8ABaqr///0VVX/AAWqq37/AAOAAP//8aqr/wABVVX///Gqq/8AAVVV///xgAD/AACqq///8VVViwivvwX/ABSqq/8AAqqr/wAT1VX/AATVVZ6SnpL/ABDVVf8ACaqr/wAOqqv/AAxVVf8ADqqr/wAMVVX/AAuqqv8ADtVW/wAIqqv/ABFVVf8ACKqr/wARVVX/AARVVf8AFKqri6OL/wAfVVX///mqq/8AGKqr///zVVWd///zVVWde/8ADiqr///sqqv/AApVVQj//+yqq/8AClVV///rKqr/AAeqq///6aqrkP//6aqrkP//6yqq/wAE1VX//+yqq/8ABKqr///sqqv/AASqq3v/AAWqqv//81VV/wAGqqv///NVVf8ABqqr///5qqv/AAqqqov/AA6qq4ud/wAHqquY/wAPVVWT/wAPVVWT/wAPqquPm4sIs4v/AB9VVf//76qr/wAWqqv//99VVQgO+D74wBVACvti9+wViwoO+0n32PfvFWAK+z33/RWLCg73dPjmFUEK95X9IhVxCg77gJf4DhVhCvdo/LAVcQoO93T45hVBCvdp98YViwoO+4CX+A4VYQr34PegFYwKDviI+CgV2fsq9wT3bfcG/MT7Bvdt+wT7JD33JPwo9xL4KAcO+4D35PeDFdkiyPcY8fsY9x/7DPsfKCXuTkA9B9Y6Botv/wACKqv//+dVVf8ABFVV///qqqv/AARVVf//6qqrk///7iqq/wALqqv///Gqq/8AC6qr///xqqub///1VVX/ABRVVYT/ABRVVYT/ABoqq////IAAq4uZi/8AECqr/wABKqv/ABJVVf8AAlVV/wASVVX/AAJVVf8AD4AA/wAEKqv/AAyqq5EI8Af///iqq///+qqrgf///Cqq///zVVX///2qq///81VV///9qqv///RVVv///tVV///1VVWL///lVVWL///uKquSgpmCmf//+4AAnoujCNIHDuz5GveYFUIK/GT4iBV1Cg74jhZiCvuy+MwVdQoO7Pka95gVQgr7FfijFWwKDviOFmIKwfjnFWwKDuz5GveYFUIK/Bz5FBWJCg74jhZiCvti+VgVigoO7Pka95gVQgr7R/jVFXYKWxZ3Cg74jhZiCoj5IxWAClsWdwoO7Pka95gVQgr76vkUFXAK0BZwCg74jhZiCvs8+VgVcArQFnAKDuz4cPtYFXK8Bf//+Kqrhf//94AAhv//9lVVh///9lVVh///9oAAif//9qqri///81VVi///9Sqr/wAEgACClIKU///7gAD/AArVVYv/AAyqq4v/AAiqq/8AAdVV/wAJKqr/AAOqq/8ACaqr/wADqqv/AAmqq/8ABKqq/wAJgAD/AAWqq/8ACVVVCP8ABaqr/wAJVVX/AAaAAP8ACSqr/wAHVVWU/wAHVVWU/wAHVVb/AAgqq/8AB1VV/wAHVVWt/wAEqqv/AB9VVf8ACdVV/wAcqqua/wAcqqua/wAYqqr/ABMqq/8AFKqr/wAXVVX/ABSqq/8AF1VV/wAQKqr/ABuAAP8AC6qr/wAfqqv/AAuqq/8AH6qr/wAF1VX/ACLVVYuxCPhU+xL8UAeL///uqqv///1VVf//7dVV///6qqt4///6qqt4///3Kqr//+6AAP//86qre///86qre///76qq///y1VX//+uqq///9aqr///rqqv///Wqq///5tVV///61VVti22L///m1VX/AAUqq///66qr/wAKVVX//+uqq/8AClVV///vqqr/AA0qq///86qrmwj///Oqq5v///cqqv8AEYAA///6qque///6qque///9VVX/ABIqq4v/ABFVVQj4UPsS/FQHi///1qqr/wAG1VX//9qqqv8ADaqr///eqqv/AA2qq///3qqr/wAS1VX//+OAAKP//+hVVaP//+hVVf8AHFVV///tVVb/ACCqq///8lVV/wAgqqv///JVVf8AI6qq///4Kqv/ACaqq4n//+1VVf//7qqr///vVVZ3///xVVX//+lVVf//8VVV///pVVX///iqq///6VVWi///6VVVCIv///FVVf8AAtVV///zKqv/AAWqq4D/AAWqq4D/AAeqqv//9qqr/wAJqqv///hVVf8ACaqr///4VVWW///6VVb/AAxVVf///FVV/wAMVVX///xVVf8ADNVW///+Kqv/AA1VVYv/ABKqq4v/ABHVVf8AA4AAnJKckv8AD4AA/wAJKquZ/wALVVUIDviL+1gVcrwF///4qquF///3gACG///2VVWH///2VVWH///2gACJ///2qquL///zVVWL///1Kqv/AASAAIKUgpT///uAAP8ACtVVi/8ADKqri5X/AAKAAP8ACqqrkP8AC1VVkP8AC1VV/wAGVVX/AAsqq/8AB6qrlgj/AAeqq5b/AAgqqv8AClVV/wAIqqv/AAmqq/8ACKqr/wAJqqv/AAhVVf8ACIAAk/8AB1VVCL/4dPsM+5oGi3uJ///wqquH///xVVWH///xVVX///mAAH6C///0qquC///0qqv///Sqq4L///JVVf//+VVV///yVVX///lVVf//7yqr///8qqt3i///6qqri///74AA/wAE1VX///RVVf8ACaqr///0VVX/AAmqq///91VWl///+lVV/wAOVVUI///6VVX/AA5VVf///IAA/wAPVVb///6qq/8AEFVV///+qqv/ABBVVf///1VV/wAO1VaL/wANVVUI94f7DPvDB4v//+dVVY7//+hVVpH//+lVVZH//+lVVZX//+vVVpn//+5VVZn//+5VVf8AEiqrff8AFlVV///1qqv/ABZVVf//9aqr/wAbKqv///rVVauLs4v/AB+qq/8ACNVV/wAXVVX/ABGqq/8AF1VV/wARqqv/ABFVVv8AFNVV/wALVVWjCI0+Bv//9VVV///3VVX///VVVv//9iqr///1VVWA///1VVWA///2Kqv///Qqq4L///NVVYL///NVVf//+Kqr///y1Vb///pVVf//8lVV///6VVX///JVVf///Sqr///ygACL///yqquL///xVVX/AALVVf//8yqr/wAFqquA/wAFqquA/wAHqqr///aqq/8ACaqr///4VVUI/wAJqqv///hVVZb///pVVv8ADFVV///8VVX/AAxVVf///FVV/wAM1Vb///4qq/8ADVVVi/8AEqqri/8AEdVV/wADgACckpyS/wAPgAD/AAkqq5n/AAtVVQgO9/j5WARECvg5uxV0Cg73P474dBVkCvff3xV0Cg6Q95D3wxVGCvgkuxV0Cg4hjvh0FWYK917fFXQKDpD3kPfDFUYK9yn3DBVXCvdiFlcKDn2u9wYVRwpC98YVcAoO+yOt9wMVZwp699oVcAoOfa73BhVHCvs1934VVwoO+yOt9wMVZwoh95IVVwoOfa73BhVHCvtC98YViwoO+yOt9wMVZwr7CffaFYsKDmr4dPfkFeX7Dged3wX/AAKqq5f/AALVVZeOl46X/wAEgAD/AArVVZH/AAmqq5H/AAmqq/8AB6qrk/8ACVVV/wAGVVX/AAlVVf8ABlVVl/8AAyqr/wAOqquL/wASqquL/wASVVX///qqq53///VVVQi56AX//+1VVZX//+0qq/8AB6qreP8ABVVVeP8ABVVV///r1VX/AAKqq///6qqri///4qqri///5yqq///7Kqv//+uqq///9lVV///rqqv///ZVVf//7tVV///y1VZ9///vVVV9///vVVX///Sqq///7IAA///3VVX//+mqq///91VV///pqqv///lVVv//6IAA///7VVX//+dVVQh1+wP7F4uLMfcFi1b7oQWFbf//96qr///nKqv///VVVf//7FVV///1VVX//+xVVf//7aqr///2Kqtxi4OL///3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+2oVdAoO/QX7VUUVigoO/QX7mPteFXUKDv0Fx/soFWwKDv0FcvjIFUgKDv0F+zX5WBVwCg79BfuY+RAVVwr3YhZXCl73nhVwCg773fcA9x4VJQr7NvejFSEKDvwB2fmAFZUKDvwVMfjoFZYK98IWlgr7H/c3FZcKDvbF+ZAVlQqD/ZAVyfcy98uLy/sy9yaL+775WPsTi/vB/VgF94r3nhX3CPe89wf7vAUO+93P97cVIQoOy/mQBJUK91b9HxX3WvfO9vvO90X34fcF/GH9WPhx9wUHDvdf+ZAElQrIUxX9WPcY98z30/vM9xj5WPsY+7D70/ewBw77h/mQBJUK91n9kBWYCg73u/mQBJUK+Zb8LBWL/wA3VVX///aAAP8AMoAAeP8ALaqreP8ALaqr///lqquy///eVVX/ACBVVf//3lVV/wAgVVVj/wAZKqv//9Gqq53//9Gqq53//82AAJT//8lVVYtVi///zdVVgv//0aqref//0aqreWP//+bVVf//3lVV///fqqsI///eVVX//9+qq///5aqrZHj//9JVVXj//9JVVf//9oAA///NgACL///IqquL///Iqqv/AAmAAP//zVVVnl2eXf8AGlVV///YgAD/ACGqq2r/ACGqq2qz///mVVX/AC5VVf//7aqr/wAuVVX//+2qq/8AMiqr///21VXBiwj/ADaqq4v/ADKAAP8ACSqr/wAuVVX/ABJVVf8ALlVV/wASVVWz/wAZqqv/ACGqq6z/ACGqq6z/ABpVVf8AJ4AAnrmeuf8ACYAA/wAyqquL/wA3VVUI+yAWmQoO90f5kASVCvhQ/ZAVi/fC96H4Kvsui/tE+7r7RPe6+zSL9538Kov7wgUO94iK+WcVlQr4O/1nFfe68PtXrgb/ABiqq/8ABKqr/wAY1VX/AAoqqqT/AA+qq6T/AA+qq/8AFoAA/wAT1VWfo5+j/wAQVVX/ABtVVf8ADKqr/wAeqqv/AAyqq/8AHqqr/wAGVVWsi/8AI1VVi7v///bVVf8AK4AA///tqquy///tqquycv8AIYAA///gVVWnCP//4FVVp///2qqr/wAVqqtg/wAPVVVg/wAPVVX//9HVVf8AB6qr///OqquLWYv//9DVVf//+Kqr///Tqqv///FVVf//06qr///xVVX//9lVVf//6tVWav//5FVVav//5FVVcf//3lVWeP//2FVVeP//2FVV///2gAD//9OAAIv//86qqwiLZ/8ABdVV///eqqv/AAuqq///4VVV/wALqqv//+FVVf8AD6qq///k1Vb/ABOqq///6FVV/wATqqv//+hVVf8AFlVV///sgACk///wqquk///wqqv/ABnVVYH/ABqqq///+1VVCGj7UCb3u/dWB///5qqrj///6Kqq/wAHgAD//+qqq5b//+qqq5b//+2AAP8ADiqr///wVVX/ABFVVf//8FVV/wARVVX///PVVv8AFKqr///3VVWj///3VVWj///7qqv/ABqqq4v/AB1VVYv/ACFVVf8ABYAA/wAdgACW/wAZqquW/wAZqqv/AA8qq/8AFaqq/wATVVX/ABGqqwj/ABNVVf8AEaqr/wAXVVb/AA2AAP8AG1VV/wAJVVX/ABtVVf8ACVVV/wAdqqv/AASqq6uL/wBAqquL/wAz1VV5smeyZ/8AE4AA///MqquL//+9VVWL///Gqqv///Eqq///0oAA///iVVX//95VVf//4lVV///eVVX//9bVVv//6IAA///LVVX///KqqwgO+3eE+PQVlgr3whaWCvsf9zcVlwqZ/ZcVmgoO5/cfFpsK94n3nhX3CPe89wj7vAUOp9z5WBWcCvsS+7kVnQr7BfvHFZ4KDiD3aRafCg73DrQW+S33Agb7oPjq+xaL+5/86wX33fheFfdW/Fv8GYsFDnP3ZfcFFaAKDnz4zPjuFfX8n/sF9/sH/AT8dov7Bfivi4v3BvwPiwUO9w3c+VgVoQoO93b5uPf4FaIK/A/7kxVri///4oAA/wAFVVVw/wAKqqtw/wAKqqv//+iAAP8ADqqqd/8AEqqrd/8AEqqr///vgAD/ABYqqn7/ABmqq37/ABmqq///9yqr/wAb1VX///tVVakI+GoG///7VVVt///3Kqv//+Qqq37//+ZVVX7//+ZVVf//71VV///p1Vb//+uqq///7VVV///rqqv//+1VVf//6IAA///xVVb//+VVVf//9VVV///lVVX///VVVf//4qqr///6qqtriwj4kAT/AB9VVYuohv8AGqqrgf8AGqqrgf8AF1VVfZ95n3n/ABCAAP//6qqrmP//51VVmP//51VV/wAJKqv//+VVVv8ABVVV///jVVUI/GgG/wAEqqv/AByqq5T/ABqqqv8ADVVV/wAYqqv/AA1VVf8AGKqr/wAQqqv/ABVVVZ+dn53/ABcqq5n/ABpVVZX/ABpVVZX/AB0qq5CriwgO+973aRaYCg7A92f4LBX3wPsW/Vj3FvfujQf3v/vu90SL++z4FPfa99j7Pov7s/vABQ7n9yUW92j4pvdp/Kb3JIv7tvlY+xmL+7T9WAUO98L4ZPddFaMKDvcv+M73UhX75Pia+y2Li/1Y9xWLiPidjov35Pyd9yyLi/lY+xSLjfyaBQ5q+LP5WBX8iPsF+IgGZPtIFfw9Ivg9Brj7WRX8jvsF+I4GDvd2+bj3+BWiCvsgFpkKDvH5GflYFaQKDoLc+VgVpQoj+8oVpgoOfMUW+JL3AfvXBveD94aLlvuS94H33ouL9wH8iouLMPed+5aLhfud+5sFDlv39hanCg6c+BUWqAoO96z4mPlMFakK++D76hWqCvitFqsKDsP36PhiFawKDveL+In3jRX4X/sX/F94B///0Kqri///2tVV/wAN1VVw/wAbqqtw/wAbqqv///KAAP8AJ9VVi78I9777F/vUB4v//9VVVf8AB1VV///aqqv/AA6qq2v/AA6qq2v/ABPVVf//5VVVpP//6qqrpP//6qqr/wAdVVV7/wAhqqv///VVVf8AIaqr///1VVX/ACQqqv//+qqr/wAmqquLCKP7GPcX9xifBv8AJqqri/8AJIAA/wAFVVX/ACJVVf8ACqqr/wAiVVX/AAqqq6mb/wAZqqv/ABVVVf8AGaqr/wAVVVX/ABRVVf8AGqqrmquaq/8AB4AA/wAlVVWL/wAqqqsI99T7F/u+B4tX///yVVX//9gqq///5Kqr///kVVX//+Sqq///5FVV///aqqr///Iqq///0KqriwgO9zb4Txb3uvD7V64G/wAYqqv/AASqq/8AGNVV/wAKKqqk/wAPqquk/wAPqqv/ABaAAP8AE9VVn6Ofo/8AEFVV/wAbVVX/AAyqq/8AHqqr/wAMqqv/AB6qq/8ABlVVrIv/ACNVVYu7///21VX/ACuAAP//7aqrsv//7aqrsnL/ACGAAP//4FVVpwj//+BVVaf//9qqq/8AFaqrYP8AD1VVYP8AD1VV///R1VX/AAeqq///zqqri1mLXP//+KqrX///8VVVX///8VVV///ZgAD//+rVVmr//+RVVWr//+RVVXH//95VVnj//9hVVXj//9hVVf//9oAA///TgACL///OqqsIi2f/AAXVVf//3qqr/wALqqv//+FVVf8AC6qr///hVVX/AA+AAP//5NVW/wATVVX//+hVVf8AE1VV///oVVX/ABYqq///7IAApP//8KqrpP//8Kqr/wAZ1VWB/wAaqqv///tVVQho+08m97r3Vgf//+aqq4///+iqqv8AB4AA///qqquW///qqquW///tgAD/AA4qq///8FVV/wARVVX///BVVf8AEVVV///z1Vb/ABSqq///91VVo///91VVo///+6qr/wAaqquL/wAdVVWL/wAhVVX/AAWAAP8AHYAAlv8AGaqrlv8AGaqr/wAPKqv/ABWqqv8AE1VV/wARqqsI/wATVVX/ABGqq/8AF1VW/wANgAD/ABtVVf8ACVVV/wAbVVX/AAlVVf8AHaqr/wAEqquri/8AQKqri/8AM9VVebJnsmf/ABOAAP//zKqri///vVVVi///xqqr///xKqv//9KAAP//4lVV///eVVX//+JVVf//3lVV///W1Vb//+iAAP//y1VV///yqqsIDvve92kWmAr7APnlFa0K92QWrgoOnPgVFqgKI/nlFa8K92QWrgoOmPeq+YoVlQrP/UMVsAr7sPdBFbEKDjH30fmKFSSLlvtf3YsF9wf7ZBWyCg5895D5ihWVCvs1+6QVswoO/AL3Uhb4evsR/HoHl/mzFZUKDnP3v34VtAr7Y/kBFZYK98IWlgr7H/c3FZcKDpj4VdIVsAr7sPdBFbEKDqP3W/edFfeWB4u5lf8AISqrn/8AFFVVn/8AFFVV/wAYqqv/AAoqq/8AHVVVi/8AHVVVi6T///bVVf8AFKqr///tqqv/ABSqq///7aqr/wAKVVX//+XVVYtpi2v///ZVVf//54AA///sqqt6///sqqt6///oVVX///eAAG+LCGIlvga7i/8AJNVV///0gAD/ABmqq3T/ABmqq3T/AAzVVf//4YAAi2WLd////IAA///uVVWE///wqquE///wqqv///aAAP//8yqqf///9aqrf///9aqrff//+Cqqe///+qqre///+qqrev///VVVeYsI///UqquL///eVVX/AA4qq3P/ABxVVXP/ABxVVX//ACnVVov/ADdVVQj8jQT32Qf/AAiqq3mXe/8AD1VVff8ADVVVf/8AEYAAgP8AFaqrgf8AFaqrgf8AG9VVhq2Lq4up/wAFVVWn/wAKqqun/wAKqqv/ABhVVZr/ABSqq/8AE1VV/wAUqqv/ABNVVf8AEFVV/wAXVVaX/wAbVVUIl/8AG1VVkf8AHlVWi/8AIVVVi/8AIqqr///5gAD/AB1VVX6jfqP///Aqq/8AE4AA///tVVWa///tVVWa///sKquWdpJ2kv//7YAA/wAD1VV7/wAAqqsIjgeZjZn/AAWAAJmUmZT/AAyAAP8AC4AAlpmWmZT/ABCAAJKekp7/AAOAAP8AFNVVi/8AFqqri6n///nVVf8AGtVV///zqqv/ABeqq///86qr/wAXqqv//+9VVZ92/wAQVVUIdv8AEFVV///ngAD/AAyAAG//AAiqq2//AAiqq///4qqr/wAEVVX//+FVVYtpi///4NVV///7Kqv//+Oqq///9lVV///jqqv///ZVVf//56qq///xqqv//+uqq3j//+uqq3h7///oqqv///RVVf//5FVV///0VVX//+RVVf//+iqr///gKquLZwj9nAcOYff8+4QVi/ei9234XPsdi/si++v7Kvfr+yKL93j8XIv7ogUOitv5BBWL///uqquP///xKqqT///zqquT///zqqv/AAnVVf//9aqq/wALqqv///eqq/8AC6qr///3qqv/AAxVVf//+SqqmP//+qqrmP//+qqr/wAL1VX///tVVf8ACqqrh/8ADqqr///6qqv/AAxVVf//+4AAlf///FVVlf///FVV/wAIVVX///0qq/8ABqqriQj/AAdVVf///VVVkf///lVW/wAEqqv///9VVQiIhQX///dVVYv///dVVv///qqr///3VVX///1VVf//6Kqr///8qqv//+iAAP//+FVV///oVVV////oVVV////qqqt7eHd4d///8Kqr///oKqv///RVVf//5FVV///0VVX//+RVVf//+iqr///hKquLaYv//9qqq/8ABoAA///d1VWYbAiYbP8AEiqrcP8AF1VVdP8AF1VVdP8AG9VW///uKqv/ACBVVf//81VV/wAgVVX///NVVf8AI9VW///5qqv/ACdVVYv/ACiqq4v/ACTVVf8ABqqrrP8ADVVVrP8ADVVVp/8AEiqroqKiov8AEaqr/wAbKqv/AAxVVf8AH1VVCP8ADFVV/wAfVVX/AAYqq/8AIVVWi/8AI1VVi/8AKVVV///4gAD/ACTVVnz/ACBVVXz/ACBVVf//7NVV/wAcVVb//+iqq/8AGFVV///oqqv/ABhVVf//5lVV/wAUVVZv/wAQVVVv/wAQVVVw/wAM1VZx/wAJVVX//9iqq/8ADqqr///jqqr/AAwqqv//7qqr/wAJqqsI///uqqv/AAmqq///91VV/wAMKqqL/wAOqquLmf8ACVVV/wAKgAD/ABKqq5L/ABKqq5Kk/wADgAD/AB9VVYv/ABtVVYv/ABlVVv///dVV/wAXVVX///uqq/8AF1VV///7qqv/ABRVVv//+yqq/wARVVX///qqq5////lVVf8AElVVhP8AEKqr///4qqsIp/UF///uqqv/AAdVVf//7FVV/wAGqqt1kf//7Kqr/wAFVVV0/wAE1Vb//+VVVf8ABFVV///lVVX/AARVVf//4aqr/wACKqtpi///2qqri///3dVV///81VVs///5qqts///5qqv//+VVVf//9yqq///pqqv///Sqq///6aqr///0qqv//+6qqv//8iqq///zqqv//++qqwj///Oqq///76qr///51VX//+2AAIv//+tVVQj4CvwRFYv//+qqq////Kqrd///+VVV///tVVX///lVVf//7VVV///2qqt7f///8qqrf///8qqr///xKqv///WAAP//7lVV///4VVX//+5VVf//+FVV///sKqv///wqq3WLdYv//+xVVf8AA9VV///uqqv/AAeqq///7qqr/wAHqqv///FVVf8ACoAAf/8ADVVVCH//AA1VVf//9qqr/wAP1Vb///lVVf8AElVV///5VVX/ABJVVf///Kqr/wAT1VaL/wAVVVWL/wAVVVX/AAMqq/8AE9VW/wAGVVX/ABJVVf8ABlVV/wASVVX/AAlVVv8AD9VW/wAMVVX/AA1VVf8ADFVV/wANVVX/AA7VVv8ACoAA/wARVVX/AAeqq/8AEVVV/wAHqqv/ABOqq/8AA9VVoYsIoYv/ABOqq////Cqr/wARVVX///hVVf8AEVVV///4VVX/AA7VVv//9YAA/wAMVVX///Kqq/8ADFVV///yqqv/AAmAAP//8FVV/wAGqqt5/wAGqqt5/wADVVX//+xVVYv//+qqqwgOMfg69+8VsgoOKvewjBX/AA1VVYf/AAzVVof/AAxVVYf/AAxVVYeW///7Kqv/AAmqq///+lVV/wAJqqv///pVVf8AB6qq///41Vb/AAWqq///91VV/wAFqqv///dVVf8AAtVV///1VVaL///zVVWL///yqqv///wqq///89VV///4VVWA///4VVWA///2Kqv///Yqq3////dVVQh////3VVX///JVVf//+Cqr///wqquE///wqquEfP//+YAA///xVVWFCORMBZn/AASqq/8AEFVV/wAHKqr/ABKqq/8ACaqr/wASqqv/AAmqq/8AEaqq/wAMgAD/ABCqq/8AD1VV/wAQqqv/AA9VVZn/ABJVVv8AC1VV/wAVVVX/AAtVVf8AFVVV/wAFqqv/ABiqq4uni/8AJVVV///0VVX/AB5VVv//6Kqr/wAXVVX//+iqq/8AF1VV///hVVX/ABFVVmX/AAtVVQhnl///4Kqr/wALqqv//+VVVf8AC1VV///lVVX/AAtVVf//6dVW/wAM1Vb//+5VVf8ADlVV///uVVX/AA5VVX7/ABEqq///96qrn///96qrn///+9VV/wAYVVWL/wAcqquLtf8ACFVV/wAmgAD/ABCqq67/ABCqq66irP8AHVVVqgj/AB1VVar/ACLVVv8AHdVV/wAoVVX/AByqq/8AKFVV/wAcqqv/ACwqq/8AHVVVu6kI4PxFI/eCB2///+9VVf//4qqr///sVVb//+FVVf//6VVV///hVVX//+lVVf//49VW///lKqv//+ZVVWz//+ZVVWx2///cgAD//++qq2P//++qq2P///fVVV6LWYtf/wAHKqv//9qqq/8ADlVV///hVVX/AA5VVf//4VVV/wASqqv//+Yqq6J2CKJ2/wAZgAD//+9VVaf///Oqq6f///Oqq/8AG6qr///2Kqr/ABtVVf//+KqrCA5791b4ehWzCg6a99b5jRX//9NVVYv//9jVVv//9iqr///eVVX//+xVVf//3lVV///sVVVv///kqqv//+mqq2j//+mqq2j//+9VVf//1qqrgP//0FVVgP//0FVV///6gAD//8yAAIv//8iqq4v//8iqq/8ABSqr///Mqqr/AApVVf//0Kqr/wAKVVX//9Cqq5ti/wAVqqv//91VVQj/ABWqq///3VVV/wAbqqr//+TVVv8AIaqr///sVVX/ACGqq///7FVV/wAogAD///Yqq/8AL1VVi/8ALqqri/8AKFVV/wAJ1VWt/wATqqut/wATqqun/wAbKqqh/wAiqquh/wAiqqv/ABAqq7T/AApVVf8AL1VV/wAKVVX/AC9VVf8ABSqr/wAzVVaL/wA3VVUIi/8AN1VV///6VVX/ADOAAP//9Kqr/wAvqqv///Sqq/8AL6qr///vKqr/AClVVf//6aqrrv//6aqrrm//ABtVVf//3lVV/wATqqv//95VVf8AE6qr///Y1Vb/AAnVVf//01VViwgkBKOL/wAUgAD///nVVZz///Oqq5z///Oqq/8ADiqr///vKqr/AAtVVf//6qqr/wALVVX//+qqq/8ACKqrcpH//+NVVZH//+NVVf8AA6qrbP8AAVVV///eqqsI+68G/wABVVWt/wADqqv/AB+AAJGokaj/AAjVVaT/AAuqq6D/AAuqq6D/AA5VVf8AEIAAnJecl/8AFIAAkaOLCPsi++IV97CKBYn//96qq////CqrbP//+lVV///jVVX///pVVf//41VV///3gABy///0qqv//+qqq///9Kqr///qqqv///Gqqv//71VV///uqqt////uqqt////rVVWFc4tzi///61VV/wAF1VX//+6qq/8AC6qr///uqqv/AAuqq///8aqq/wAQVVX///Sqq6AI///0qqug///3VVWkhaiFqP///FVV/wAf1VX///6qq/8AIqqrCA77+/dYFpoKDl73W/esFfdi+xH8evcR94aOB/dV+4b3MIv7dPed92b3cfsti/tK+2IFDk73Jxb3HfgMjYv3H/wM9xmL+3n45QWB/wAZVVX///ZVVf8AFoAA///2qqv/ABOqq///9qqr/wATqqv///TVVf8AEKqqfv8ADaqrfv8ADaqr///wKqv/AAqAAP//7VVV/wAHVVX//+1VVf8AB1VV///oVVb/AAOqq///41VVi///4qqri3P///xVVf//7VVV///4qqv//+1VVf//+Kqr///xVVaE///1VVX///lVVQicJgWR/wAFVVWU/wAFKquXkJeQ/wANqqv/AAKAAP8AD1VVi/8ADqqri5eJ/wAJVVWH/wAJVVWH/wAH1Vb///oqq/8ABlVV///4VVX/AAZVVf//+FVV/wAFgAD///aqq/8ABKqrgP8ABKqrgJD///PVVf8ABVVV///yqqsImGj7Y/ycBQ6J1Ph6Ff1q9w73xo0H/wAHVVX//+aqq/8ADCqr///sqqqc///yqquc///yqqv/ABeAAP//+VVVqYv/ABtVVYv/ABcqq/8AB1VVnv8ADqqrnv8ADqqr/wAPKquf/wALVVX/ABlVVQiNi45F9xOLBf///qqr/wARVVX///7VVf8AESqripyKnP///4AA/wARKquL/wARVVUI+BP7EfuCB4tXgf//2aqrd///51VVd///51VVb///86qrZ4v//9iqq4tvlv//71VVof//71VVof//96qrsIu/CPeKBw4x9+QW91b4evsbi/sQ+/SJi/sQ9/T7H4v3Vvx6BQ4jufdHFYv//96qq/8ABoAA///kqqqY///qqquY///qqqv/ABAqq///7qqq/wATVVX///Kqq/8AE1VV///yqqv/ABUqq4Gi///5VVWi///5VVX/ABWAAIaf///8qqun///7VVX/ABYqq///+lVW/wAQVVX///lVVf8AEFVV///5VVX/AAyAAP//+Kqr/wAIqquDCP8ACKqrg/8ABaqq///31VX/AAKqq///96qr/wACqqv///eqq/8AAVVV///31VWLg4t9///7Kqv///NVVf//9lVV///0qqv///ZVVf//9Kqr///0gAD///XVVf//8qqrgv//8qqrgv//8dVV///4gAB8hXyF///zKqv///uqq///9VVV///9VVUI61cF/wAPVVX/AASqq/8AEYAA/wAHKqr/ABOqq/8ACaqr/wATqqv/AAmqq/8AElVV/wAMVVWcmpya/wAOVVX/ABHVVf8AC6qr/wAUqqv/AAuqq/8AFKqr/wAF1VWji/8AG1VVi/8ADVVV///+Kqv/AA0qq////FVVmP///FVVmP//+aqr/wAMKquC/wALVVUIgv8AC1VV///z1VX/AApVVv//8Kqr/wAJVVX///Cqq/8ACVVVeJP//+lVVf8ABqqr///eqqv/AAlVVf//4oAA/wAHqqv//+ZVVZH//+ZVVZH//+qAAP8AByqr///uqqv/AAhVVf//7qqr/wAIVVX///LVVf8ACoAAgv8ADKqrgv8ADKqr///7gACdi/8AF1VVCIv/AB9VVf8ADYAA/wAZKqumnqae/wAkgAD/AAmAALmLCPcT9w0nBluL///Yqqv/AAhVVf//4VVV/wAQqqv//+FVVf8AEKqr///wqqv/ABuqqov/ACaqq4v/ABdVVf8ABVVV/wATKqv/AAqqq5r/AAqqq5r/ABBVVf8ADFVVof8ACaqrof8ACaqrp/8AByqqrf8ABKqrrf8ABKqr/wAoVVX/AAOqqv8ALqqr/wACqqsI6PwlLP8AQYAAB/8AEaqri/8ADqqq/wAAKqv/AAuqq/8AAFVV/wALqqv/AABVVf8ACYAA/wAAKqv/AAdVVYsInocG///qqquH///rqqr///qqq///7Kqr///5VVX//+yqq///+VVVev//94AA///xVVX///Wqq///8VVV///1qqv///RVVn7///dVVf//8FVV///3VVX///BVVf//+6qr///s1VaL///pVVWL///kqqv/AAYqq///6YAA/wAMVVX//+5VVf8ADFVV///uVVX/ABAqq///8VVWn///9FVVCJ////RVVf8AFoAA///3KqukhaSF/wAZKqv///uqq/8AGVVV///9VVVv///8qqv//+Sqq4X//+VVVf//91VV///lVVX///dVVf//6IAAf///66qr///wqqv//+uqq///8Kqr///vqqr//+1VVf//86qrdf//86qrdf//+dVVcYttCA6K+Nb3iBW1CvsQFrYKDnP3Whb4F/dg/Bf3Evh6/Fv8egcOofdY+4QV966OB/8ADqqr///wqqv/ABPVVX6k///1VVWk///1VVX/ABvVVf//+qqr/wAeqquL/wAkqquLrf8ABiqr/wAfVVX/AAxVVf8AH1VV/wAMVVX/ABtVVv8AEVVW/wAXVVX/ABZVVf8AF1VV/wAWVVX/ABJVVv8AGqqr/wANVVWq/wANVVWq/wAGqqv/ACKAAIuxCIux///5VVX/ACLVVf//8qqr/wAfqqv///Kqq/8AH6qr///tqqr/ABtVVf//6Kqrov//6Kqrov//5Kqq/wAR1VX//+Cqq/8ADKqr///gqqv/AAyqq2n/AAZVVf//21VVi2WL///cqquF///fVVV////fVVV////jqqv//+6AAHN0CHN0///tKqv//+Qqq///8lVV///fVVX///JVVf//31VV///5Kqv//9qqq4thCPxuB/gp+HcVi///6qqr///81VV3///5qqv//+1VVf//+aqr///tVVX///bVVf//79VWf///8lVVf///8lVV///xKqv///Uqq///7lVVg///7lVVg///69VWh///6VVVi///61VVi///7NVW/wADqqv//+5VVf8AB1VV///uVVX/AAdVVf//8NVW/wAKVVb///NVVf8ADVVVCP//81VV/wANVVX///Yqq5uE/wASqquE/wASqqv///yAAKCL/wAXVVWLof8AA1VV/wAUKqv/AAaqq/8AElVV/wAGqqv/ABJVVf8ACaqqm/8ADKqr/wANqqv/AAyqq/8ADaqr/wAPKqr/AAqqqv8AEaqr/wAHqqv/ABGqq/8AB6qr/wATgAD/AAPVVf8AFVVViwi5i/8AIyqr///xqqv/ABhVVf//41VV/wAYVVX//+NVVf8ADCqr///bqquLXwgOKvfX6RX//+yqq/8ABKqr///tKqr/AAVVVf//7aqrkf//7aqrkf//76qq/wAIgAD///Gqq5b///Gqq5b///SAAP8ADlVV///3VVX/ABGqq///91VV/wARqqv///uqq/8AFoAAi/8AG1VVi6P/AAOqq/8AFVVV/wAHVVX/ABKqq/8AB1VV/wASqquV/wAPqqr/AAyqq/8ADKqrCP8ADKqr/wAMqqua/wAJqqr/ABFVVf8ABqqr/wARVVX/AAaqq/8AEqqr/wADVVWfi/8AHKqri6P///pVVf8AE1VV///0qqv/ABNVVf//9Kqr/wAOqqv///KqqpX///CqqwjY3AWB/wANVVX///Oqq/8AC6qr///xVVWV///xVVWVe/8ACFVV///uqqv/AAaqq///7qqr/wAGqqv//+3VVZB4/wADVVV4/wADVVX//+0qq/8AAaqr///tVVWL///cqquL///egAD///oqq///4FVV///0VVX//+BVVf//9FVV///kKqt6c///6aqrCHP//+mqq///7NVV///kqqr///Gqq///36qr///xqqv//9+qq///+NVV///bKqqL///WqquLa/8ABCqrb/8ACFVVc/8ACFVVc/8ACtVW///rgAD/AA1VVXr/AA1VVXqa///xqqv/ABCqq///9FVV/wAQqqv///RVVf8AENVV///2qquchAichP8AECqr///6gAD/AA9VVYf/AA9VVYf/AA1VVoj/AAtVVYn/AAlVVYn/AAnVVv///aqr/wAKVVX///1VVf8AClVV///9VVX/AAmqq///+9VWlP//+lVVlP//+lVV/wAHgAD///iqq5GCkYKO///0gACLfQiL///yqqv///wqq///89VV///4VVWA///4VVWA///2Kqv///Yqq3////dVVX////dVVf//8lVV///4Kqv///Cqq4T///Cqq4R8///5gAD///FVVYUI5EwFmf8ABKqr/wAQVVX/AAcqqv8AEqqr/wAJqqv/ABKqq/8ACaqr/wARgAD/AAyAAP8AEFVV/wAPVVX/ABBVVf8AD1VVmf8AElVW/wALqqv/ABVVVf8AC6qr/wAVVVX/AAXVVf8AGKqri6eLpf//+qqrof//9VVVnf//9VVVnf//8qqrmnuXCHuX///uVVX/AAmqq///7Kqr/wAHVVX//+yqq/8AB1VV///tVVX/AAWqq3mPCA6i+J74FhX3DfH7Mwb//+qqq4v//+5VVf8AAKqrff8AAVVVff8AAVVV///yqqv/AAGqq///81VVjf//81VVjf//81VW/wABqqv///NVVf8AAVVV///zVVX/AAFVVf//8Kqr/wAAqqt5i2WLaP//+YAAa35rfv//5IAA///t1VV0///oqqsIdP//6Kqref//5IAAfv//4FVVfv//4FVV///5gAD//93VVov//9tVVYv//9qqq/8ABoAA///dqqqY///gqquY///gqqud///k1VWidKJ0/wAbgAB5q36rfq7///mAALGLCP8AJqqri/8AI1VV/wAGgACrmKuY/wAbqqv/ABHVVf8AF1VV/wAWqqv/ABdVVf8AFqqr/wASKqv/ABrVVZiqmKr/AAaAAP8AIYAAi6+Lnf///lVV/wAQqqv///yqq/8AD1VV///8qqv/AA9VVf//+9VV/wAN1VaG/wAMVVUIhv8ADFVV///61VX/AAqqq///+qqrlP//+qqrlIb/AAaAAP//+1VVjwhE+x8Vi///6qqr///8qqv//+wqqv//+VVV///tqqv///lVVf//7aqr///2VVZ7///zVVX///JVVf//81VV///yVVX///DVVv//9Sqr///uVVWD///uVVWD///sKquHdYt1i///7FVVj///7qqrk///7qqrk3z/AArVVf//81VV/wANqqsI///zVVX/AA2qq///9lVWm///+VVV/wASVVX///lVVf8AElVV///8qqv/ABPVVov/ABVVVYv/ABVVVf8AA1VVn/8ABqqr/wASqqv/AAaqq/8AEqqr/wAJqqr/ABAqqv8ADKqr/wANqqv/AAyqq/8ADaqrmv8ACtVV/wARVVWT/wARVVWT/wATqquPoYsIoYv/ABPVVYf/ABGqq4P/ABGqq4P/AA8qqv//9Sqr/wAMqqv///JVVf8ADKqr///yVVX/AAmqqv//79VW/wAGqqv//+1VVf8ABqqr///tVVX/AANVVXeL///qqqsIDvsukPh6FSj3O/wX9xL4F/c87gcOc/e/fhW1i/8AI9VVkf8AHaqrl/8AHaqrl6Ob/wASVVWf/wASVVWf/wANVVb/ABaqq/8ACFVV/wAZVVX/AAhVVf8AGVVV/wAEKquli/8AGqqrCPez+xH7mweL///uqqv///4qq///74AA///8VVX///BVVf///FVV///wVVX///oqq///8iqrg3+Df///9Sqr///2gAD///JVVYT///JVVYT//+8qq////IAAd4t3i///7yqr/wADgAD///JVVZL///JVVZL///Uqq/8ACYAAg5cIg5f///pVVf8ADdVV///8qqv/AA+qq////Kqr/wAPqqv///5VVf8AEIAAi/8AEVVVCPeb+xH7sweL///lVVWPcZP//+aqq5P//+aqq5j//+lVVZ13nXf/ABeAAHuof6h//wAj1VWF/wAqqquLCA73Y/kp94oVi///z1VV///wKqv//9qqq///4FVVcf//4FVVcf//09VW///yqqv//8dVVf///1VVCPe3qQf/AA9VVYv/ABBVVv///dVV/wARVVX///uqq/8AEVVV///7qqv/ABAqq///+IAAmv//9VVVmv//9VVV/wAMgAD///Gqq5V5lXmQ///pqquL///lVVUI/PsWi///0qqr/wAIVVX//9lVVf8AEKqra/8AEKqra/8AFtVV///lgACodqh2/wAh1VX///CAAP8AJqqrgf8AJqqrgf8AKVVV///6qqu3////VVUI+3j3CPd4B/8AJVVVi7D/AAVVVf8AJKqr/wAKqqv/ACSqq/8ACqqr/wAgqqr/AA/VVf8AHKqroP8AHKqroP8AFyqq/wAa1VX/ABGqq/8AIKqr/wARqqv/ACCqq/8ACNVV/wAmVVWLt4v/ACaqq///+NVV/wAiVVX///Gqq6n///Gqq6n//+yAAP8AGVVV///nVVX/ABSqqwj//+dVVf8AFKqr///jgAD/AA+qqv//36qr/wAKqqv//9+qq/8ACqqr///dgAD/AAVVVf//21VViwj7LPwfBv//41VV/wAAqqv//+XVVv8AA4AA///oVVX/AAZVVf//6FVV/wAGVVX//+uAAP8ACYAA///uqqv/AAyqq///7qqr/wAMqqv///KAAJv///ZVVf8AE1VV///2VVX/ABNVVf//+yqroov/ABqqq4uh/wADqqv/ABOAAP8AB1VVnP8AB1VVnP8ACaqrmpeYCJeY/wANgAD/AArVVZr/AAiqq5r/AAiqq/8AD4AA/wAGqqqb/wAEqqsIVeUF///oqqv///iqq///6IAA///11VX//+hVVX7//+hVVX7//+rVVv//71VV///tVVX//+uqq///7VVV///rqqv///DVVv//59VV///0VVVv///0VVVv///6Kqv//9+qq4v//9tVVQgOZPc0+HoV+xuL91D76ftk/BT3HIv3LPe39yz7t/cci/tl+BL3Uffr+xmL+xn7jgUO92P4c+gV+B37EvwdB1X/AANVVf//11VVnP//5Kqr/wAeqqv//+Sqq/8AHqqr///yVVW7i/8AQVVVCPda+xL7fAeLXf8AB6qr///X1VX/AA9VVf//3aqr/wAPVVX//92qq6D//+Oqqv8AGqqr///pqqv/ABqqq///6aqr/wAeqqr//+8qqv8AIqqr///0qqv/ACKqq///9KqrsIX/ACdVVf///1VVCPtw9xL3cAf/ACaqq/8AAKqr/wAk1VWRrv8AC1VVrv8AC1VV/wAe1VX/ABDVVv8AGqqr/wAWVVX/ABqqq/8AFlVVoP8AHFVW/wAPVVX/ACJVVf8AD1VV/wAiVVX/AAeqq/8AKCqri7kI93z7EvtaB4v//76qq///8iqrW///5FVV///hVVX//+RVVf//4VVV///XgAB6///Kqqv///yqqwgO91D3w/g3FbcKDvvv914Wmgr7AvkiFa0K92QWrgoOdPcv+SIVrwr3ZBauCmv9LxW0Cg6K+Nb3iBW1CvsQFrYK+1b4kBWVCg509475gBWVClX9jRW0Cg73UPhd+YAVJIuW+1/diwX7JPsSFbcKDnP3ZfcFFaAK/DX5dBWtCvdkFq4KDu2T+OcV90X85/cX9/HnBr2L/wAkKqv///Wqq/8AFlVV///rVVX/ABZVVf//61VV/wALKqv//+Gqq4tji///7VVV///81VX//++AAP//+aqr///xqqv///mqq///8aqr///3VVX///PVVYCBgIH///Mqq///+FVV///xVVX///qqq///8VVV///6qqv///BVVv///VVV///vVVWLCGj7AqoG/wAqqquL/wAlVVX/AAXVVav/AAuqq6v/AAuqq/8AGtVV/wAQKqr/ABWqq/8AFKqr/wAVqqv/ABSqq/8AEFVV/wAYKqqW/wAbqquW/wAbqqv/AAWAAP8AHdVVi6uL0///6iqr/wA5Kqv//9RVVf8AKlVV///UVVX/ACpVVf//vtVW/wAVKqv//6lVVYsIIfcY93f3BfyrBg4y+GP6IBX7HIsl+yTtiwX7Av2QFZ8KDuL5SvcBFTTZBf//0VVV///Gqqv//8Oqq///41VVQYv//+Kqq4v//+RVVf8ABKqrcf8ACVVVcf8ACVVV///ogAD/AA2AAHb/ABGqq3b/ABGqq///7oAA/wAVqqp9/wAZqqt9/wAZqqv///aqq/8AHSqq///7VVX/ACCqqwj4A/T8AQaRqf8ACdVVpv8ADaqro/8ADaqro5z/ABSAAP8AFFVVnP8AFFVVnKKY/wAZqquU/wAZqquU/wAbgAD/AASAAP8AHVVVi/8AKKqri/8AIoAA///4VVX/ABxVVf//8Kqr/wAcVVX///Cqq/8AFdVW///sqqr/AA9VVf//6KqrCOTnBXH/ACNVVf//3NVV/wAaqqv//9Oqq53//9Oqq53//8zVVZRRi///yKqri///zSqq///2qqv//9Gqq///7VVV///Rqqv//+1VVWP//+Yqq///3lVVav//3lVVav//5dVW///Y1VX//+1VVf//0qqr///tVVX//9Kqq///9qqr///OVVWLVQiLVf8ACVVV///OVVX/ABKqq///0qqr/wASqqv//9Kqq6X//9jVVf8AIVVVav8AIVVVav8AJ9VW///mKqv/AC5VVf//7VVV/wAuVVX//+1VVf8AMyqr///2qqvDi6uL/wAdgAD/AANVVab/AAaqq6b/AAaqq/8AGNVVlP8AFqqr/wALVVUI/wAWqqv/AAtVVf8AFCqq/wANVVb/ABGqq/8AD1VV/wARqqv/AA9VVf8ADyqq/wAQqqv/AAyqq50IDl74T/i8FePiBf//5qqr/wAaqqtr/wAVKqr//9lVVf8AD6qr///ZVVX/AA+qq2L/AAfVVf//1Kqri22L///h1VWH///hqquD///hqquD///kqqr///OAAP//56qrev//56qrev//7Cqq///qKqv///Cqq///5VVV///wqqv//+VVVf//+FVVa4v//9qqqwiLa/8ABVVV///k1VX/AAqqq///6aqr/wAKqqv//+mqq5n//+0qqv8AEVVV///wqqv/ABFVVf//8Kqr/wATqqv///OAAKH///ZVVaH///ZVVf8AFqqr///3gAD/ABdVVf//+Kqr/wAWqqv///iqq6CE/wATVVX///lVVf8AE1VV///5VVX/ABCqq///+CqrmYIImYL/AArVVf//9VVV/wAHqqv///Oqq/8AB6qr///zqqv/AAPVVf//8NVVi3mL///uqqv///yAAHyE///zVVWE///zVVX///bVVf//9YAA///0qqv///eqq///9Kqr///3qqt+///51VX///FVVYf///FVVYf///FVVon///FVVYsIa4tt/wAHqqtv/wAPVVVv/wAPVVX//+mqq/8AE1VW///vVVX/ABdVVQgvNAX/AB1VVWn/ACSqq///5lVVt///7qqrt///7qqruf//91VVu4uri/8AH1VV/wAEVVX/AB6qq/8ACKqr/wAeqqv/AAiqq/8AG1VV/wANgACj/wASVVWj/wASVVX/ABMqq/8AFyqr/wAOVVWn/wAOVVWn/wAHKqv/ACFVVYv/ACaqqwiL/wAjVVX///lVVf8AHVVW///yqqv/ABdVVf//8qqr/wAXVVX//+7VVf8AE4AAdv8AD6qrdv8AD6qr///o1VX/AAyqqv//5qqr/wAJqqv//+aqq/8ACaqrcv8ACNVV///nVVWTeZH//+9VVf8ABdVV///wqqv/AAWqq///8Kqr/wAFqqv///KAAP8ABqqq///0VVX/AAeqqwj///RVVf8AB6qrgv8ACSqq///5qqv/AAqqq///+aqr/wAKqqv///zVVf8ADVVVi5uL/wARVVX/AAOqq/8ADtVW/wAHVVX/AAxVVf8AB1VV/wAMVVX/AAmAAJX/AAuqq/8AB6qr/wALqqv/AAeqq5j/AAWAAP8ADlVV/wADVVX/AA5VVf8AA1VV/wAN1Vb/AAGqq/8ADVVViwj/ABqqq4v/ABlVVYWjf6N//wATVVX///BVVf8ADqqr///sqqsIDvve92kWmAoO+9L3cxaYCvsA+eUVrwr3ZBauCg77A/cS90QV+wpmBZH//+iqq/8ACSqr///qqqr/AAxVVf//7Kqr/wAMVVX//+yqq/8AD1VW///vVVX/ABJVVX3/ABJVVX2g///1Kqv/ABeqq///+FVV/wAXqqv///hVVf8AGdVV///8Kquni/8ALKqri/8AJFVVk6ebp5uhn5ujCJuj/wAK1VX/ABqAAP8ABaqrqP8ABaqrqP8AAtVV/wAbgACLpQj4dfsY/HQHi3n///6qq///71VV///9VVX///Cqq////VVV///wqqv///sqq///8oAAhP//9FVVhP//9FVV///2gAD///bVVn////lVVX////lVVXz///yqq3mL///oqquL///sqqr/AAcqq///8Kqr/wAOVVX///Cqq/8ADlVVgf8AEiqr///7VVWhCA738vchFvdl+ML3ZPzC7YsFuYu0/wAEqquv/wAJVVWv/wAJVVX/AB6qq/8ADaqr/wAZVVWd/wAZVVWd/wATVVah/wANVVWl/wANVVWl/wAGqqv/AB2qq4v/ACFVVYuz///4qqut///xVVWn///xVVWn///rVVb/ABaqq///5VVV/wARVVUI///lVVX/ABFVVf//4Cqr/wAMqqtmk2aT///XgACPX4sI+wqL+wb3qvsUi/uy/VgF+M/31BXTBv8AFqqri/8AFdVV///+qqug///9VVWg///9VVX/ABIqq///+tVW/wAPVVX///hVVf8AD1VV///4VVX/AAxVVv//9Sqr/wAJVVV9/wAJVVV9/wAEqqt5i3WL///qqqv///uAAP//7qqqgv//8qqrgv//8qqrf///9YAAfP//+FVVCHz///hVVf//7yqr///6qqv//+1VVYj//+1VVYj//+yqq////oAAd4sIDvgi92j5WBX7F/1Y9xf30vem+9L3ewb/ACVVVYv/ACKqq/8ABCqrq/8ACFVVq/8ACFVV/wAbqqv/AAzVVv8AF1VV/wARVVX/ABdVVf8AEVVV/wASVVah/wANVVX/ABqqq/8ADVVV/wAaqqv/AAaqq/8AH6qqi/8AJKqri7H///kqq/8AIKqr///yVVX/ABtVVf//8lVV/wAbVVX//+0qq/8AFoAAc/8AEaqrCHP/ABGqq2//AA0qqmv/AAiqq2v/AAiqq///3aqr/wAEVVX//9tVVYsIKfeq+xf7qvumBvgp+wMV4wb/AClVVYutg/8AGqqre/8AGqqre/8ADVVV///lVVWL///aqquLZ///8yqrcf//5lVVe///5lVVe///3iqrg2GLCDEGDvX30PfxFd0Gq4ul///71VWf///3qquf///3qqv/AA9VVf//86qq/wAKqqv//++qq/8ACqqr///vqqv/AAcqqv//69VV/wADqqtz/wADqqtz/wAB1VVvi2sI+y/3GPdYB4v/ACdVVf//+9VVr///96qr/wAgqqv///eqq/8AIKqr///ygACn///tVVX/ABdVVf//7VVV/wAXVVX//+eAAP8AEiqr///hqquY///hqquY///bKqr/AAaAAP//1Kqriwj7FPcZ93f3Bfyr+wX3Rfzn9xcGDtrcFrgK99DDFbkKDqT3aPooFboK+1/7ZBX3Jov3SPwh90L4Ifcji/uR/L4F///0qqv//+dVVf//86qq///pVVb///Kqq///61VV///yqqv//+tVVf//8FVVeXn///Cqq3n///Cqq///61VVf///6Kqr///3VVX//+iqq///91VVcP//+6qr///hVVWL///pVVWL///s1Vb/AAGqq///8FVV/wADVVX///BVVf8AA1VV///yqqv/AAQqq4CQCICQ///21VX/AAVVVf//+Kqr/wAFqqv///iqq/8ABaqr///5qqr/AAUqqv//+qqr/wAEqqsI2OsFk///+Kqr/wAKKqv///iqqv8ADFVV///4qqv/AAxVVf//+Kqr/wAO1Vb///xVVf8AEVVVi52L/wAP1VX/AAVVVf8ADaqr/wAKqqv/AA2qq/8ACqqr/wAM1VWbl/8AFVVVCA73APid9wUV+8n45/sX/Vj3gfsf9wX3H/dw+Vj7FgYO5/cfFpsK94n3nhX3CPe89wj7vAUOoffP9wUVJPdg9Aafi/8AEqqr///+Kqv/ABFVVf///FVV/wARVVX///xVVZqF/wAMqqv///eqq/8ADKqr///3qquV///1gAD/AAdVVf//81VV/wAHVVX///NVVf8AA6qr///wqquLeYv//91VVf//8oAA///mKqtwenB6///dgAD///eAAGGLCPt++wUV94gG/wAkqquL/wAiVVX/AARVVav/AAiqq6v/AAiqq6f/AA0qqqP/ABGqq6P/ABGqq57/ABaAAJn/ABtVVZn/ABtVVZL/ACBVVov/ACVVVYv/ACSqq///+YAA/wAfqqp+/wAaqqt+/wAaqqv//+3VVf8AFiqq///oqqv/ABGqqwj//+iqq/8AEaqr///kVVWYa/8ACFVVa/8ACFVVaP8ABCqrZYsI+wj3Offi9wX8ZQYOp9z5WBWcCvsS+7kVnQr7BfvHFZ4KDjL3aRafCg73OPcCFvjN+x/3BfeQ+wMG+3P45/sUi/t1/Of7AIuL+5D3BYsF9xb3kBX3K/hU9yv8VAUOc/dl9wUVoAoO+An4RvfSFfvS9xb30gf/ACaqq/8AAKqr/wAiVVX///iAAKn///BVVan///BVVf8AGdVV///qKqv/ABWqq2//ABWqq2//ABGqqv//3lVV/wANqqv//9iqq/8ADaqr///Yqqv/AAnVVWCR///RVVUI9yMG///oqqv/AL9VVf//uVVV/wB/qqv7CssI92j32fsji/tU+68F///0qquN///0gAD/AAFVVf//9FVV/wAAqqv///RVVf8AAKqr///z1Vb/AABVVf//81VViwj3qvsW+6oH///yqquL///zgAD///+qq///9FVV////VVX///RVVf///1VV///0gAD///6qq///9KqriQj7U/ev+yOL92f72QVR///hVVX//9Eqq1z//9xVVf//wKqr///cVVX//8Cqq///6IAA//+vVVX///SqqykI9yMGkf8ALqqr/wAJ1VX/ACrVVf8ADaqrsv8ADaqrsv8AEaqq/wAhqqv/ABWqq/8AHFVV/wAVqqv/ABxVVf8AGdVVoan/AA+qq6n/AA+qq/8AIlVV/wAHgAD/ACaqq////1VVCA6I90z4MxUq0gf/AHlVVf8APKqrZD0fi2n///RVVf//5VVV///oqqv//+yqq///6Kqr///sqqv//99VVf//9lVVYYtli///4YAAlHSddJ3//+4qq/8AGaqr///zVVX/ACFVVQj7CGAF/wAIqqv//+dVVf8AC6qq///pKqv/AA6qq3b/AA6qq3b/ABHVVXmgfKB8/wAYKqv///Qqq/8AG1VV///3VVX/ABtVVf//91VVqv//+6qr/wAiqquLsYv/ACOqq5D/ACFVVZX/ACFVVZWo/wAOgAD/ABiqq54I/wAYqque/wATgACi/wAOVVWm/wAOVVWm/wAHKqv/AB6AAIuti6n///qqq/8AGVVV///1VVX/ABSqq///9VVV/wAUqqv///JVVv8AESqq///vVVX/AA2qq///71VV/wANqqv//+3VVv8ACiqq///sVVX/AAaqq///7FVV/wAGqqv//+0qq/8ABFVVeY0IjQeb/wADVVX/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/wAUqqv/ABeqq5r/ABxVVZr/ABxVVf8AB4AA/wAg1VaL/wAlVVWL/wAkqquE/wAfqqp9/wAaqqt9/wAaqqv//+zVVaH//+eqq/8AEVVVCP//56qr/wARVVVu/wAMqqv//95VVZP//95VVZP//9vVVo///9lVVYsIQAb72gT3atwH/wAvVVWL/wAigAD///aAAP8AFaqreP8AFaqreP8ACtVV///m1VWL///gqquLa///9VVV///lqqv//+qqq///61VV///qqqv//+tVVf//3VVV///1qqtbiwgO92H3aPlYFfsX/Vj3YQb/ACaqq4v/ACQqqv8ABKqr/wAhqqv/AAlVVf8AIaqr/wAJVVX/AB1VVZmk/wASqquk/wASqqv/ABOAAP8AFyqqmf8AG6qrmf8AG6qrkv8AIIAAi/8AJVVVi/8AJVVVhP8AICqrfaZ9pv//7NVV/wAWVVX//+eqq/8AEaqrCP//56qr/wARqqtumP//3lVV/wAIVVX//95VVf8ACFVV///b1Vb/AAQqq///2VVViwg/BvvaBPdq3Qf/AC9VVYv/ACJVVv//9lVV/wAVVVX//+yqq/8AFVVV///sqqv/AAqqq///5qqqi///4Kqri2f///WAAP//5NVVdv//7aqrdv//7aqr///dgAD///bVVVuLCPhb+OgV+xf9WPcXBg6E3PlYFf1Y920H/wAnVVWL/wAkgAD/AATVVf8AIaqr/wAJqqv/ACGqq/8ACaqr/wAdKqr/AA5VVf8AGKqrnv8AGKqrnv8AE1VV/wAXqquZ/wAcVVWZ/wAcVVWS/wAg1VaL/wAlVVWL/wAkqqv///kqq/8AH4AA///yVVX/ABpVVf//8lVV/wAaVVX//+zVVv8AFdVW///nVVX/ABFVVQj//+dVVf8AEVVVbv8ADNVW///eqqv/AAhVVf//3qqr/wAIVVVn/wAEKqv//9lVVYsIMveiBvwSBOkGu4v/ACKqq///9oAA/wAVVVV4/wAVVVV4/wAKqqv//+aAAItri2v///VVVf//5dVV///qqqv//+uqq///6qqr///rqqv//91VVf//9dVVW4sILQYO453yFf8AGVVVZ/8AJCqr///i1VW6///pqqu6///pqqv/ADeAAP//9NVVy4vDi/8AMtVV/wAJVVX/AC2qq/8AEqqr/wAtqqv/ABKqq/8AJ1VV/wAZ1VWsrKys/wAZgAD/ACcqq53/AC1VVZ3/AC1VVZT/ADGqq4vBCIvB///3qqv/ADGqq///71VV/wAtVVX//+9VVf8ALVVV///oKqv/ACcqq2ysbKxl/wAZ1VVe/wASqqte/wASqqv//80qq/8ACVVV///HVVWL///CqquL///JgACA///QVVV1///QVVV1///bgAD//+NVVf//5qqr///cqqsI3DUF/wANVVX/ABaqq6H/ABQqqv8AHqqr/wARqqv/AB6qq/8AEaqr/wAmVVX/AAjVVbmL/wAdVVWL/wAbgAD///uAAP8AGaqrgv8AGaqrgqL///Mqq/8AFFVV///vVVX/ABRVVf//71VVnP//66qr/wANqqtz/wANqqtz/wAJ1VX//+Sqq5H//+FVVQj8BiL4Bwb///tVVf//31VVgv//4tVW///yqqv//+ZVVf//8qqr///mVVX//+8qqv//6lVW///rqqv//+5VVf//66qr///uVVX//+jVVf//8oAAcf//9qqrcf//9qqr///kVVX///tVVf//4qqri///21VVi///3NVWkf//3lVVl///3lVVl///44AAoP//6KqrqQgO+I/3aPlYFfsX/Vj3F/e/9wsGkf//0VVV/wANgAD//9Uqq6BkoGSm///egACsb6xvsf//6iqrtv//8FVVtv//8FVV/wAugAD///gqq72L/wA2qquL/wAygAD/AAkqq/8ALlVV/wASVVX/AC5VVf8AElVV/wAoKqv/ABmqq62sCK2s/wAagAD/ACeAAJ65nrn/AAmAAP8AMqqri/8AN1VVi/8AN1VV///2gAD/ADKAAHj/AC2qq3j/AC2qq///5YAAsmn/ACBVVWn/ACBVVf//19VV/wAZKqv//9Gqq53//9Gqq53//82AAJT//8lVVYsIWYv//9FVVf//+FVV///Uqqv///Cqq///1Kqr///wqqv//9nVVf//6qqqav//5Kqrav//5KqrcP//3tVVdmR2ZP//8tVV///VKqv///qqq///0VVVCPsLBveUUxWL/wAiqqv/AAWqq/8AINVV/wALVVWq/wALVVWqm/8AGtVV/wAUqqv/ABaqq/8AFKqr/wAWqquknf8AHVVV/wANVVX/AB1VVf8ADVVV/wAgqqv/AAaqq6+Lr4v/ACDVVf//+VVV/wAdqqv///Kqq/8AHaqr///yqqv/ABkqqnn/ABSqq///6VVVCP8AFKqr///pVVWb///lKqv/AAtVVWz/AAtVVWz/AAWqq///3yqri///3VVVi2f///pVVf//3oAA///0qqts///0qqtse3D//+tVVXT//+tVVXT//+bVVnn//+JVVX7//+JVVX7//98qq///+YAAZ4sIZ4v//99VVf8ABoAA///iqquY///iqquYcp3//+tVVaL//+tVVaJ7pv//9Kqrqv//9Kqrqv//+lVV/wAhgACLrwgOufhe+OcV+1grB///xKqri///1SqqlP//5aqrnf//5aqrnf//8tVV/wAXVVWL/wAcqquLrf8ADaqrpP8AG1VVm/8AG1VVm/8AKlVWk/8AOVVViwj7KfuYFYkH///mqqt////oKqr//+/VVf//6aqr///rqqv//+mqq///66qr///sVVX//+fVVXpvem////HVVf//4Cqr///0qqv//9xVVf//9Kqr///cVVWE///ZKqv///1VVWEI9yQG/wAKqqv/AGNVVaT/AEiAAP8AJ1VV/wAtqqv/ACdVVf8ALaqr/wAyVVb/ABbVVf8APVVViwjQ+7L3F/lY+4MG//+gqquL//+2qqr//+5VVf//zKqr///cqqv//8yqq///3Kqr///mqqr//8yqqv8AAKqr//+8qquL///Qqqv/AA6AAP//2oAAqP//5FVVqP//5FVV/wAmgAD//+4qq7uDCA5D+AL3zRWAB///2Kqri///2Sqq///+Kqv//9mqq////FVV///Zqqv///xVVf//3VVV///4gABs///0qqts///0qqty///vgAB4///qVVV4///qVVX///aAAP//4yqri2eLb/8ABYAA///ogACWeJZ4/wAN1VX///Cqq/8AEKqr///0VVUI/wAQqqv///RVVf8AEoAA///3gAD/ABRVVf//+qqr/wAUVVX///qqq/8AE9VW///9VVX/ABNVVYv/ACFVVYv/AB3VVv8ABiqr/wAaVVX/AAxVVf8AGlVV/wAMVVX/ABUqq/8AEoAAm/8AGKqrCI0Gi///9VVV/wAAVVX///WAAP8AAKqr///1qqv/AACqq///9aqr/wAAqqr///XVVf8AAKqrgQj3Bwb///6qq/8AD1VViv8AEIAA////VVX/ABGqq////1VV/wARqqv///+qq/8AEYAAi/8AEVVVCIv3LIupBYv/AAlVVf///6qr/wAJVVb///9VVf8ACVVV///7VVX/AECqq///7Cqr/wAvgABo/wAeVVVo/wAeVVX//84qq/8ADyqr//+/VVWLY4v//9nVVf//+Sqr///bqqv///JVVf//26qr///yVVX//+Eqqv//7Sqr///mqqtzCMxEBZv/AA9VVf8AE1VV/wAMgAD/ABaqq/8ACaqr/wAWqqv/AAmqq6P/AATVVf8AGVVVi6uL/wAZVVX///iqq/8AEqqr///xVVX/ABKqq///8VVV/wAJVVV0i///4KqrCHkyFaBzBotn///1gAD//+JVVXb//+iqq3b//+iqq///4dVV///0VVX//9iqq4uBi///9dVV/wABKqv///Wqq/8AAlVV///1qqv/AAJVVf//9qqq/wAD1Vb///eqq/8ABVVV///3qqv/AAVVVf//+Sqq/wAG1Vb///qqq/8ACFVV///6qqv/AAhVVf///VVV/wAKgACL/wAMqqsIi53/AAWqq/8ADlVV/wALVVX/AAqqq/8AC1VV/wAKqqv/AA6qq/8ACCqqnf8ABaqrnf8ABaqr/wAUKqv/AAOqqv8AFlVV/wABqqv/ABZVVf8AAaqr/wAWKqv/AADVVaGLCA6C99z4dxVxi///5iqr///7qqv//+ZVVf//91VV///mVVX///dVVf//6oAAfv//7qqr///uqquPp/8ABtVVpP8ACaqrof8ACaqrof8ADVVV/wAS1VWc/wAPqquc/wAPqqug/wAL1VWkk6ST/wAdgACPrYsI9y3s+ysG///FVVWL///NKqv///gqq2D///BVVWD///BVVf//3IAA///nqqtvam9q///q1VX//9XVVf//8aqr///Mqqv///Gqq///zKqr///4Kqr//8JVVf///qqrQ////1VV///xVVX/AAAqq///8iqrjH6Mfv8AAYAA///zKquN///zVVUI/wAEqqtl/wAJVVX//96AAJlumW6d///nqquh///sVVWh///sVVX/ABlVVf//8Sqr/wAcqquB/wAcqquBqob/ACFVVYv/ACSqq4v/ACJVVf8ABdVVq/8AC6qrq/8AC6qr/wAbgAD/ABDVVaKhCKKh/wASKqv/ABqAAP8ADVVVqv8ADVVVqv8ABqqr/wAigACLsYux///51VX/ACIqq///86qr/wAeVVX///Oqq/8AHlVVev8AGdVW///qVVX/ABVVVf//6lVV/wAVVVX//+aAAP8AEFVW///iqqv/AAtVVf//4qqr/wALVVVr/wAFqqv//91VVYsI9w37jBWLd////NVV///tKqv///mqq///7lVV///5qqv//+5VVf//9yqq///wqqv///Sqq37///Sqq359///1qqv//+9VVf//+FVV///vVVX///hVVf//7VVW///8Kqv//+tVVYthi///3lVV/wANqqv//+aqq/8AG1VV///mqqv/ABtVVf//81VVr4v/ACyqqwiLo/8AA6qr/wAU1VX/AAdVVf8AEaqr/wAHVVX/ABGqq5X/AA6qqv8ADKqr/wALqqv/AAyqq/8AC6qr/wAOqqr/AAiqqv8AEKqr/wAFqqv/ABCqq/8ABaqrnf8AAtVV/wATVVWLn4v/ABIqq////FVV/wAQVVX///iqq/8AEFVV///4qqv/AA4qq///9dVVl34Il37/AAkqq///8Kqr/wAGVVX//+5VVf8ABlVV///uVVX/AAMqq///7NVWi///61VVCA5Q97b3sBUv9wXHBv8AEKqri/8AD9VV////gACaipqKmP///aqrlv///FVVlv///FVV/wAI1VX///pVVv8ABqqr///4VVX/AAaqq///+FVV/wADVVX///WAAIv///Kqq4v//+iqq///91VV///w1VX//+6qq4T//+6qq4T//+pVVf///IAAcYsIL/tXFfcK0wedi5z///+qq5v///9VVZv///9VVf8ADiqr///9qqv/AAxVVYf/AAxVVYf/AAmqq4WSg5KD/wADgAD///Sqq4v///FVVYv///FVVf///IAA///01VaE///4VVWE///4VVX///ZVVf//+lVW///zqqv///xVVQj///Oqq////FVV///x1VX///3VVnv///9VVXv///9VVXr///+qq3mLCPtZMhX3lgbLi/8AMYAA/wAL1VWu/wAXqquu/wAXqqv/ABGAAP8AH4AAi/8AJ1VVi5////yAAP8AESqrhP8ADlVVhP8ADlVV///2VVX/AAvVVv//86qr/wAJVVX///Oqq/8ACVVV///x1VWSe/8ABKqre/8ABKqreo55/wABVVUI/wAOqquP/wAN1VX/AASAAJiQmJD/AAuAAP8ABoAAlZOVk/8AB9VVlf8ABaqrl/8ABaqrl/8AAtVVmoudi7N7/wAf1VVr/wAXqqtr/wAXqqv//9FVVf8AC9VV///CqquLCPuKBg77ZfdaFvgY913t+9r8egcOevcC+x8V9x/4GPsf9veDOAf7I/gW+ySL+y38FjyLi/uDBfex+FYVpKve+4f7TIsFDmT4O/e4FfuSBv8AAVVV/wAPVVX/AAQqq/8ADtVWkv8ADlVVkv8ADlVV/wAJVVX/AAyqq/8AC6qrlv8AC6qrlv8ADaqq/wAIqqv/AA+qq/8ABlVV/wAPqqv/AAZVVf8AESqq/wADKqv/ABKqq4v/ACdVVYv/AB2qq///9Kqrn///6VVVn///6VVV/wAKqqtv/wABVVX//96qqwj3ClwVi7H///qAAP8AIqqrgP8AH1VVgP8AH1VV///wKqv/ABrVVv//61VV/wAWVVX//+tVVf8AFlVV///m1Vb/ABFVVv//4lVV/wAMVVX//+JVVf8ADFVV///e1Vb/AAYqq///21VVi2eL///eVVX///nVVf//4Kqr///zqqv//+Cqq///86qr///k1VX//+6AAHT//+lVVQh0///pVVV5///k1VZ+///gVVV+///gVVX///mAAP//3NVWi///2VVVi///2Kqr/wAGqqv//9yAAP8ADVVV///gVVX/AA1VVf//4FVV/wASgAD//+Uqq/8AF6qrdf8AF6qrdf8AG6qqev8AH6qrf/8AH6qrf/8AIiqqhf8AJKqriwi5i/8AKSqr/wAIgAD/ACRVVZz/ACRVVZz/AB7VVv8AGdVV/wAZVVX/ACKqqwgyxgX///Sqq///7qqr///vqqp8///qqqv///NVVf//6qqr///zVVX//+ZVVf//+aqrbYv//+1VVYv//+6AAP8AAyqr///vqqv/AAZVVf//76qr/wAGVVX///GAAP8ACNVW///zVVX/AAtVVf//81VV/wALVVX///Wqq/8ADSqrg5qDmv//+6qr/wAQgAD///9VVZ0I+AgG/wAAqquR/wAAVVX/AAYqq4v/AAZVVQgO94L4BfdhFfth9xH3YQejif8AFiqrhv8AFFVVg/8AFFVVg/8AElVW///0Kqv/ABBVVf//8FVV/wAQVVX///BVVf8ADlVW///rgAD/AAxVVf//5qqr/wAMVVX//+aqq/8ACiqrbJP//9tVVQj3Hwb///Cqq8l1v///41VVtf//41VVtf//21VWrP//01VVowj3Mfd7+x+L+xD7UQWD/wABVVX///eqq/8AASqr///3VVWM///3VVWMgv8AASqr///2qqv/AAFVVQj3SvsR+0oH///2qqv///6qq///9tVV///+1VWCioKK///3gAD///7VVYP///6qqwj7D/dR+x+L9zH7ewX//9Kqq3P//9sqqmr//+Oqq2H//+Oqq2H//+oqqlf///Cqq00I9x8Gk/8AJKqrlaqX/wAZVVWX/wAZVVX/AA4qq/8AFIAA/wAQVVX/AA+qq/8AEFVV/wAPqqv/ABJVVv8AC9VV/wAUVVWT/wAUVVWT/wAWgACQ/wAYqquNCA77Iu/37xWRl5OWlZX/AAiqq5P/AAtVVf8AB4AAmZKZkv8AEaqr/wADgAD/ABVVVYuti/8AGSqr///41VX/ABBVVf//8aqr/wAQVVX///Gqq/8ACCqr///v1VWLeYv//+qqq///9iqr///xVVX//+xVVYMI///sVVWD///ngACH///iqquLCEY51Ab/ACFVVYv/ABsqq///+tVVoP//9aqroP//9aqr/wAKgAD///DVVYt3i///6qqr///2gAD//+/VVXiAeID//+aAAP//+oAAa4v//+yqq4v//+7VVf8AAoAAfJB8kP//8tVV/wAF1VX///Sqq/8ABqqrCP//9Kqr/wAGqqv///aAAP8ABoAA///4VVX/AAZVVf//+FVV/wAGVVX///qAAP8ABIAA///8qqv/AAKqqwhKQwX/AASqq////Kqrkv//+dVV/wAJVVWC/wAJVVWC/wAM1Vb///bVVf8AEFVV///2qqv/ABBVVf//9qqrn///96qq/wAXqqv///iqq/8AF6qr///4qqv/AByAAP///FVV/wAhVVWL/wAgqquLqf8AAtVV/wAbVVX/AAWqq/8AG1VV/wAFqqv/ABeqq/8ACNVVn5cIn5f/AA+qq/8ADyqr/wALVVX/ABJVVf8AC1VV/wASVVX/AAWqq/8AFdVWi/8AGVVVi/8AE1VV///8Kqv/ABDVVv//+FVV/wAOVVX///hVVf8ADlVV///2Kqv/AAvVVn//AAlVVX//AAlVVf//8tVV/wAHKqv///Gqq5D///Gqq5D///Iqqv8AAyqr///yqqv/AAFVVQiOB/8ADKqr/wACqqv/AAxVVf8ABIAAl/8ABlVVl/8ABlVV/wAKqquT/wAJVVX/AAmqq/8ACVVV/wAJqqv/AAeqq/8AC1VVkZiRmI7/AA8qq4v/ABFVVYv/ABNVVf//+6qr/wASKqv///dVVZz///dVVZz///Mqq/8ADqqrev8ADFVVCHr/AAxVVf//6tVV/wAJqqv//+aqq5L//+aqq5L//+Kqqv8AA4AA///eqquLaYtuh3ODc4P//+wqq///9oAA///wVVWA///wVVWA///z1Vb///Sqq///91VV///0VVX///dVVf//9FVV///5qqv///bVVof///lVVQgOn/hR99kV+9n3E/h6+xMH+4r70ov30vsSi4v8evcSiwUOn/d9+V8Vuwr3aP1fFYv32fuK+9n7EouL+Hr3EouL+9L3ivfS9xOLi/x6BQ5X91r3wRW8Cg5D+CoW9xqL+074evsii/ta/Hr3G4v3GPfkBQ7u90r4ehX7Afx69xH3xwb3KvtUp4v3KfdXi/vK9xKLi/h6+wKL+0b7bQUOdvdaFvde92P7XvcS+Hr7EvtO+2P3TvsR/HoHDor41veIFbUK+xAWtgoObvdaFvgX91v8F/cS+Hr8Vvx6Bw6i91z7hBX3xY0H/wARVVX//+aqq/8AF1VW///sqqr/AB1VVf//8qqr/wAdVVX///Kqq/8AHlVW///5VVX/AB9VVYv/ACVVVYv/ACGAAP8ABtVV/wAdqqv/AA2qq/8AHaqr/wANqquk/wASqqr/ABRVVf8AF6qr/wAUVVX/ABeqq/8AD6qr/wAbVVWWqpaq/wAFgAD/ACDVVYv/ACKqqwiL/wAiqqv///pVVf8AINVV///0qquq///0qquqe6b//+tVVaL//+tVVaJy/wASVVX//+Kqq/8ADaqr///iqqv/AA2qq///31VV/wAG1VVni2eL///fqqv///hVVf//41VV///wqqv//+NVVf//8KqrdP//7FVV///uqqtzCIjQ+w39agb4KPh4FYt3iP//7NVVhf//7aqrhf//7aqrgv//79VVf31/ff//8Sqr///01VX//+5VVf//96qr///uVVX///eqq///69VW///71VX//+lVVYv//+qqq4v//+yAAI///+5VVZP//+5VVZP///DVVpb///NVVZkI///zVVWZ///2Kqv/ABAqq4T/ABJVVYT/ABJVVf///IAA/wATgACL/wAUqquLn/8AA4AA/wATKquS/wASVVWS/wASVVX/AAnVVf8AECqr/wAMqquZ/wAMqquZ/wAPKqr/AAsqq/8AEaqr/wAIVVX/ABGqq/8ACFVV/wATgAD/AAQqq/8AFVVViwj/ABaqq4v/ABQqqv//+9VV/wARqqv///eqq/8AEaqr///3qqv/AA7VVf//9NVVl32XfZT//+/VVZH//+2qq5H//+2qq47//+zVVYt3CA77D/gz9+8V2dwFgf8AC1VV///0Kqv/AAoqq///8lVVlP//8lVVlP//8VVW/wAHgAD///BVVZH///BVVZH//++AAP8ABKqr///uqqv/AANVVf//7qqr/wADVVV6/wABqqv//+9VVYv//9lVVYv//9xVVv//+dVV///fVVX///Oqq///31VV///zqqv//+PVVv//7oAA///oVVX//+lVVQj//+hVVf//6VVV///tgABw///yqqv//+Cqq///8qqr///gqqv///lVVWiL///ZVVWL///ZVVX/AAaqq///3NVW/wANVVX//+BVVf8ADVVV///gVVX/ABKAAHD/ABeqq///6aqr/wAXqqv//+mqq/8AHCqq///uqqr/ACCqq///86qr/wAgqqv///Oqq/8AI6qq///51VX/ACaqq4sIsYv/ACKqq/8ABlVV/wAfVVX/AAyqq/8AH1VV/wAMqqulnP8AFKqr/wAVVVUIQN0F///0qqv///FVVf//8Sqq///0qqv//+2qq4P//+2qq4P//+wqqof//+qqq4t1i///7FVVj///7qqrk///7qqrk///8Sqq/wAKqqv///Oqq/8ADVVV///zqqv/AA1VVf//9oAA/wAP1Vb///lVVf8AElVV///5VVX/ABJVVf///Kqr/wAT1VaL/wAVVVUIi/8AFKqr/wADVVX/ABOqqv8ABqqr/wASqqv/AAaqq/8AEqqr/wAJgAD/ABAqqv8ADFVV/wANqqv/AAxVVf8ADaqr/wAO1Vb/AArVVf8AEVVVk/8AEVVVk/8AE1VWj/8AFVVVi5+L/wATKqv///uAAP8AElVVgv8AElVVgv8ADiqr///0gACVfQgO+zib+HoVKPcp/Bf3EvgX9y7uBw4x96j3HBX7F/fy+x+L92H8dXJLBf//9qqr///oqqv///VVVXl////zVVV////zVVX//+2qq///+aqr///nVVWLg4v///dVVf8AANVV///2qqv/AAGqq///9qqr/wABqqv///eqqv8AAiqq///4qqv/AAKqqwh9+wAF/wALVVX///1VVf8ADIAA///91Vb/AA2qq////lVV/wANqqv///5VVf8ADYAA////Kqv/AA1VVYupi/8AGVVV/wAEKqv/ABSqq/8ACFVV/wAUqqv/AAhVVZ3/AAvVVv8AD1VV/wAPVVX/AA9VVf8AD1VV/wANVVb/ABKAAP8AC1VV/wAVqqv/AAtVVf8AFaqr/wAKqqv/ABgqqpX/ABqqqwj3bPi6+xqL+wr78gUO5vg0+IUV95f7CvuXB///21VV////VVX//94qq4Rs///yqqts///yqqv//+VVVXn//+mqq///6VVV///pqqv//+lVVf//7qqq///lVVb///Oqq///4VVV///zqqv//+FVVf//+dVV///eqquLZ4tn/wAGgAD//96qq5j//+FVVZj//+FVVf8AEaqr///lVVb/ABZVVf//6VVVCP8AFlVV///pVVX/ABqAAP//7iqr/wAeqqt+/wAeqqt+/wAhVVX///kqq6////9VVQj7evcK93oH/wAlVVX/AACqq/8AIiqr/wAG1VWqmKqY/wAaqqv/ABHVVf8AFlVV/wAWqqv/ABZVVf8AFqqr/wARVVb/ABqqqv8ADFVV/wAeqqv/AAxVVf8AHqqr/wAGKqv/ACFVVYuvi6////nVVf8AIYAA///zqquq///zqquq///ugAD/ABrVVf//6VVV/wAWqqsI///pVVX/ABaqq///5Sqr/wAR1VVsmGyY///eKqv/AAbVVf//21VV/wAAqqsI9xn7kxWL///UqquA///b1VV1bnVu///eqqv///CAAP//01VViQj3yweh///+qqv/ABNVVf//+yqq/wAQqqv///eqq/8AEKqr///3qqv/AA3VVf//9NVVln2Wff8ACFVV///v1VX/AAWqq///7aqr/wAFqqv//+2qq/8AAtVV///sKqqL///qqqsI/BMWi/8AFVVV/wACqquf/wAFVVX/ABKqq/8ABVVV/wASqqv/AAgqq/8AEFVVlpmWmf8ADdVV/wALKqv/ABCqq/8ACFVV/wAQqqv/AAhVVf8AE1VV/wAEgACh/wAAqqsI+8sH///UqquN///fKqr/AA+AAP//6aqrqP//6aqrqP//9NVV/wAkKquL/wArVVUIDkD3WveRFftV+5H3Jov3EPc+9wv7Pvcsi/tV95P3Q/d7+ySLIPsrIPcr+yqLBQ581Bb4Nvsf9wD3hD34FfsS/BX7WfgV+xEGDlO4+HoV+w8Hi///3VVV/wADKqts/wAGVVX//+Sqq/8ABlVV///kqqv/AAtVVnT/ABBVVf//7VVV/wAQVVX//+1VVf8AFlVW///xqqv/ABxVVYH/ABxVVYH/ACPVVob/ACtVVYsI9wCKi/si9xKLi/h6+xKLi/t9LosF///mqquL///sKqr/AAMqq///8aqr/wAGVVX///Gqq/8ABlVV///1VVX/AAnVVoT/AA1VVYT/AA1VVf//+4AA/wARKquJoImgiv8AGSqri/8AHVVVCM4HDvd11Bb5VPh6+xL8F/s4+Bf7EfwX+zj4F/sRBg73b9QW+SH7H/b3gjz4F/sR/Bf7LfgX+xH8F/st+Bf7EQYOdveh+HoV+5Eo9xP8F/d9BquLp/8ABFVVo/8ACKqro/8ACKqrn/8AC9VVm5qbmv8ADCqr/wARqqv/AAhVVf8AFFVV/wAIVVX/ABRVVf8ABCqr/wAV1VaL/wAXVVWL/wAWqqv///yAAP8AFVVVhJ+En///9NVV/wARgAD///Cqq5oI///wqqua///rqqr/AAuqq///5qqr/wAIVVX//+aqq/8ACFVV///hVVX/AAQqq2eLCCQG+4QE9ynYB/8AHKqri/8AF9VV///61VWe///1qque///1qqv/AAmAAP//7IAAi///41VVi///4qqrgv//7Cqqef//9aqref//9aqr///oVVX///rVVf//4qqriwgO9xH3Wvh6FfsR/Hr3VAbZi/8AOtVV/wANgAD/ACeqq6b/ACeqq6b/ABPVVf8AKiqri/8AOVVVi/8AGqqrh/8AF4AAg/8AFFVVg/8AFFVV///y1VX/ABEqq///7aqrmf//7aqrmf//6Cqq/wAKgAD//+Kqq5L//+Kqq5Jn/wADgAD//9VVVYsIQwb7hAT3KdsH/wAcqquL/wAXqqr///rVVf8AEqqr///1qqv/ABKqq///9aqr/wAJVVX//+yAAIv//+NVVYv//+Kqq4L//+wqqnn///Wqq3n///Wqq///6Kqr///61VX//+NVVYsI+CH4HxX7Evx69xIGDjv3Wvh6FfsR/Hr3hgari/8AHCqr/wAEVVX/ABhVVf8ACKqr/wAYVVX/AAiqq/8AFFVW/wAL1VX/ABBVVZr/ABBVVZr/AAxVVv8AEaqr/wAIVVX/ABRVVf8ACFVV/wAUVVX/AAQqq/8AFdVWi/8AF1VVi/8AFqqr///8gAD/ABVVVYSfhJ////SAAP8AEYAAe5oIe5r//+tVVf8AC6qr///mqqv/AAhVVf//5qqr/wAIVVX//+FVVf8ABCqrZ4sI+wUG+4QE9ynjB/8AHKqri/8AF9VV///61VWe///1qque///1qqv/AAmAAP//7IAAi///41VVi///4qqr///21VX//+wqqv//7aqr///1qqv//+2qq///9aqr///ogAD///rVVf//41VViwgORPcO99wV/wALVVX/ABNVVf8AD9VW/wAQqqv/ABRVVZn/ABRVVZn/ABqAAJL/ACCqq4v/ACaqq4v/AB7VVf//9aqrov//61VVov//61VV/wAOgAD//+Wqq5FrCPtxOvdxBv//+1VV///bVVX///Gqq25z///qqqtz///qqqv//+BVVf//9VVV///YqquLbYv//+Yqq5L//+pVVZn//+pVVZn//++AAJv///Sqq50INkYF/wAcqqv//9tVVf8AICqq///lqqv/ACOqq3v/ACOqq3v/ACbVVYO1i7GL/wAi1VX/AAaAAP8AH6qrmP8AH6qrmP8AG1VV/wAR1VWi/wAWqqui/wAWqqudppj/AB9VVZj/AB9VVf8ABoAA/wAiVVaL/wAlVVUIi/8AJKqr///6VVX/ACIqqv//9Kqr/wAfqqv///Sqq/8AH6qr///vVVX/ABtVVXWidaJwnWuYa5j//9uqq/8ABoAA///XVVWLVYv//9Qqq4H//95VVXf//95VVXf//+WAAHP//+yqq28IDvdz+bX3iBWL/wAmqqv///kqq67///JVVf8AH1VV///yVVX/AB9VVf//7Sqr/wAa1VZz/wAWVVVz/wAWVVX//+PVVf8AEVVW///fqqv/AAxVVf//36qr/wAMVVX//90qqv8ABiqr///aqquLa4v//+HVVf//+4AA///jqquC///jqquC///mqqp+///pqqt6CP//6aqrev//7NVV///rqqt7///oVVV7///oVVX///Sqq///5YAA///5VVX//+Kqqwg890f7Efx69xH3ZNUGj///3qqr/wAJqqv//+Gqqv8AD1VV///kqqv/AA9VVf//5Kqr/wATVVb//+iqqv8AF1VV///sqqv/ABdVVf//7Kqr/wAaqqt8qf//9VVVqf//9VVVq///+qqrrYv/ACVVVYv/ACLVVv8ABiqr/wAgVVX/AAxVVf8AIFVV/wAMVVX/ABwqq/8AEYAAo/8AFqqrCKP/ABaqq/8AEtVV/wAbKqr/AA2qq/8AH6qr/wANqqv/AB+qq/8ABtVV/wAjKqqL/wAmqqsI+w8Wi3f///zVVf//7NVV///5qqv//+2qq///+aqr///tqqv///bVVf//79VVf31/ff//8Sqr///01VX//+5VVf//96qr///uVVX///eqq///69VW///71VX//+lVVYv//+lVVYv//+vVVv8ABCqr///uVVX/AAhVVf//7lVV/wAIVVX///Eqq/8ACyqrf5kIf5n///bVVf8AECqr///5qqv/ABJVVf//+aqr/wASVVX///zVVf8AEyqri5+Ln/8AAyqr/wATKqv/AAZVVf8AElVV/wAGVVX/ABJVVf8ACSqr/wAQKquXmZeZ/wAO1VX/AAsqq/8AEaqr/wAIVVX/ABGqq/8ACFVV/wAT1VX/AAQqq6GLCP8AFqqri/8AFCqq///71VX/ABGqq///96qr/wARqqv///eqq5r///TVVf8ADFVVff8ADFVVff8ACVVW///v1VX/AAZVVf//7aqr/wAGVVX//+2qq/8AAyqr///s1VWLdwgOMPfA9z4Vv/s+9xL4evt5Bv//5qqri///54AA///91VX//+hVVf//+6qr///oVVX///uqq///6yqr///4qqp5///1qqt5///1qqv///GAAP//8iqqgP//7qqrgP//7qqr///6gAD//+pVVYtxi///6VVVjv//7NVWkf//8FVVkf//8FVV/wAIKqt+/wAKVVX///Wqqwj/AApVVf//9aqr/wAMVVb///gqqv8ADlVV///6qqv/AA5VVf//+qqr/wAPgAD///xVVf8AEKqriQiIB3v///tVVf//8Cqrg///8FVV///0qqv///BVVf//9Kqr///xqqv///FVVX55fnn///Sqq///6qqr///2VVX//+dVVf//9lVV///nVVX///jVVv//46qr///7VVVrCPcfBo//ACCqq/8ABdVV/wAbVVX/AAeqq6H/AAeqq6H/AAmAAP8AEYAA/wALVVWY/wALVVWY/wANKqv/AAkqq5r/AAVVVZr/AAVVVf8AESqr/wACqqv/ABNVVYsI+xD3LhWLo5P/AA9VVZv/AAaqq5v/AAaqq6X/AANVVa+LCNX7AkIGaYv//+ZVVf8AAyqr///uqqv/AAZVVf//7qqr/wAGVVX///dVVf8ADtVWi/8AF1VVCA5W+EX3uBX7kgb/AAFVVf8AD1VV/wAEKqv/AA7VVpL/AA5VVZL/AA5VVf8ACVVV/wAMqqv/AAuqq5b/AAuqq5b/AA2qqv8ACKqr/wAPqqv/AAZVVf8AD6qr/wAGVVX/ABEqqv8AAyqr/wASqquL/wAnVVWL/wAd1Vb///Sqq/8AFFVV///pVVX/ABRVVf//6VVV/wAKgABv/wAAqqv//96qqwj3ClwVi7H///qAAP8AIqqrgP8AH1VVgP8AH1VV///wKqv/ABrVVv//61VV/wAWVVX//+tVVf8AFlVV///m1Vb/ABFVVv//4lVV/wAMVVX//+JVVf8ADFVV///e1Vb/AAYqq///21VVi2eL///eVVX///nVVf//4Kqr///zqqv//+Cqq///86qr///k1VX//+6AAHT//+lVVQh0///pVVV5///k1VZ+///gVVV+///gVVX///mAAP//3NVWi///2VVVi///2Kqr/wAG1VX//9yAAP8ADaqr///gVVX/AA2qq///4FVV/wASgAD//+Uqq/8AF1VVdf8AF1VVdf8AG6qreqt/q3+tha+LCLmL/wApKqv/AAiAAP8AJFVVnP8AJFVVnP8AHtVW/wAZ1VX/ABlVVf8AIqqrCDLGBf//9Kqr///uqqv//++qqnz//+qqq///81VV///qqqv///NVVf//5lVV///5qqtti3mL///uqqv/AAMqq///71VV/wAGVVX//+9VVf8ABlVV///xVVb/AAjVVv//81VV/wALVVX///NVVf8AC1VV///11Vb/AA0qq///+FVVmv//+FVVmv//+9VW/wAQgAD///9VVZ0I+AcG/wAAqquR/wAAVVX/AAYqq4v/AAZVVQj8K/8BqoAAFb0K92MWvQoOe/eSLxVVPQX/ABFVVX//ABPVVv//9lVV/wAWVVX///iqq/8AFlVV///4qqv/ABaAAP///FVV/wAWqquLrYv/AB2AAJCklaSVoP8ADaqrnP8AEVVVnP8AEVVVmP8AFFVWlP8AF1VVlP8AF1VV/wAFgACkjf8AGqqrCP8AAKqrk/8AAIAA/wAIKqv/AABVVf8ACFVV/wAAVVX/AAhVVf8AACqr/wAIgACL/wAIqqsI95kHi/8AHKqr///8gACmhP8AGVVVhP8AGVVV///1Kqv/ABXVVv//8VVV/wASVVX///FVVf8AElVV///tqqv/AA6AAHX/AAqqq3X/AAqqq///5aqr/wAFVVX//+FVVYv//96qq4v//+GqqoT//+Sqq33//+Sqq33//+uqqv//61VV///yqqv//+SqqwiJ9zD3ONX7OPcC+xL7AjhB3vzQ9xL3jwaL/wAuqquV/wAjgACf/wAYVVWf/wAYVVX/ABqqq/8ADCqr/wAhVVWLq4v/ABfVVf//9dVV/wAPqqv//+uqq/8AD6qr///rqqv/AAfVVf//3Sqqi///zqqrCPt/B4td///4qqtp///xVVV1///xVVV1///oVVaA///fVVWL///wqquL///yVVX/AALVVX//AAWqq3//AAWqq///+Kqr/wADgAD///1VVf8AAVVVCA77WfdbFvgY913t+9v8egf3WvjBFfcg9yT7HIsl+yQFDk34mvgjFf//7Kqrp///5VVVo2mfaZ9flVWL///XVVWL///b1Vb///mAAP//4FVVfv//4FVVfv//5SqreXV0dXT//+9VVf//5Kqr///0qqv//+BVVf//9Kqr///gVVX///pVVf//3dVWi///21VVCIv//9qqq/8ABiqr///dqqr/AAxVVf//4Kqr/wAMVVX//+Cqq/8AEVVWcP8AFlVV///pVVX/ABZVVf//6VVVpv//7iqr/wAfqqt+/wAfqqt+/wAjKqr///mAAP8AJqqri/8AK1VVi/8AJ6qrk6+br5v/ACBVVf8AGlVV/wAcqqv/ACSqqwg10AX///VVVXn///BVVnv//+tVVX3//+tVVX3//+aqq4Rti///2Kqri///39VV/wAKqqty/wAVVVVy/wAVVVX///DVVaj///qqq/8AJKqrCPdx3PtwBpGr/wAOgAD/ABpVVaL/ABSqq6L/ABSqq/8AHoAA/wAKVVWxi/8AIKqri/8AGqqqhP8AFKqrff8AFKqrff8AD6qq///vVVX/AAqqq///7KqrCA77HvgC9/UV1tMF///qqqv/ABiqq///5Kqq/wASqqr//96qq/8ADKqr///eqqv/AAyqq///3VVV/wAGVVVni///6VVVi///6VVW///9Kqv//+lVVf//+lVV///pVVX///pVVf//64AA///21Vb//+2qq///81VV///tqqv///NVVf//8Sqqe///9Kqr///sqqv///Sqq///7Kqr///6VVX//+iqqov//+SqqwiL///oqqv/AARVVf//7IAA/wAIqqv///BVVf8ACKqr///wVVX/AAsqqv//8tVW/wANqqv///VVVf8ADaqr///1VVX/AA8qqv//96qr/wAQqquF/wAQqquF/wAQVVWGm4ex///2qqv/AByAAP//9tVVnoKegv8ACYAA///x1VWL///sqqsIi///9VVV///9qquC///7VVX///iqq///+1VV///4qquFhf//+Kqr///7VVX///iqq///+1VV///3qqr///yqq///9qqrif//9qqrif//9lVVioGL///mqquL///oKqqR///pqquX///pqquX///uKqr/AA6qq///8qqr/wARVVUIPkEFo2//AB5VVf//61VV/wAkqqv///Kqq/8AJKqr///yqqv/ACWqqv//+VVV/wAmqquLo4v/ABfVVf8AAtVV/wAXqqv/AAWqq/8AF6qr/wAFqqv/ABUqqpT/ABKqq/8ADFVV/wASqqv/AAxVVf8ADyqq/wAQVVb/AAuqq/8AFFVV/wALqqv/ABRVVf8ABdVV/wAZKquLqQiLof//+9VVnv//96qrm///96qrm///9Kqq/wANqqv///Gqq/8AC1VV///xqqv/AAtVVf//7yqq/wAJgAD//+yqq/8AB6qr///sqqv/AAeqq3b/AAaAAP//6VVV/wAFVVX//91VVf8AB1VV///m1Vb/AAfVVv//8FVV/wAIVVX///BVVf8ACFVV///4Kqv/AAzVVov/ABFVVQiL/wATVVWT/wANqqubk5uT/wARqquP/wATVVWLoYv/ABSAAP//+tVVnv//9aqrnv//9aqr/wAPgAD///Mqqpf///CqqwgO++/3XhaaCvce+SEVi/8AFVVV///4qqv/ABGqq///8VVVmf//8VVVmf//7lVWkv//61VVi///6qqri3n///iqq///8VVV///xVVX///FVVf//8VVV///4qqv//+6qq4t3i3f/AAdVVf//7tVV/wAOqqv///Gqq/8ADqqr///xqqud///41VX/ABVVVYsI/wAUqquL/wARqqqS/wAOqquZ/wAOqquZ/wAHVVX/ABFVVYv/ABSqqwgO++/3XhaaCvsC+SIVrQr3ZBauCg777XX7ExWAIgX/AAlVVf///VVV/wAKqquJl////qqrl////qqr/wAKqqv///9VVf8ACVVVi/8AJqqri/8AHtVV/wAGgACimKKY/wARgACcl6CXoP8AB6qr/wAX1VX/AANVVf8AGqqr/wADVVX/ABqqq/8AAaqrpov/ABtVVQj4i/sS/IcHi///71VV////gAD///BVVor///FVVYr///FVVf///YAA///zVVaH///1VVWH///1VVX///nVVf//94AA///3qqv///mqq///96qr///5qqv///SAAP///NVV///xVVWL///6qquL///51VX/AACAAISMhIz///mAAP8AAYAAhY0I94P5oBWL/wAVVVX///iAAP8AEaqrfJl8mf//7iqrkv//61VVi///61VVi///7iqr///4qqt8///xVVV8///xVVX///iAAP//7qqri3eLd/8AB4AA///u1VWa///xqqua///xqqv/ABHVVf//+NVV/wAUqquLCP8AFKqri/8AEdVVkpqZmpn/AAeAAP8AEVVVi/8AFKqrCA73DvgQFvchBv8APqqri/8AMVVV/wAOgACvqK+onf8AKSqri/8ANVVVi/8AFVVV///81VX/ABSqq///+aqrn///+aqrn4D/ABGAAP//8FVVmv//8FVVmv//64AAl///5qqrlP//5qqrlP//4FVV/wAEgABliwj7GYtW9y/7HYv7R/x69xOL9wv35AX3LSsV1Qb/ACVVVYv/ABqqq///+lVVm///9Kqrm///9Kqrk///7Kqqi///5Kqri///5qqrg///7VVVe397f///5aqrhf//21VViwh0Bg73i/da+HoV+xH8evcR92v3aPtr93wGq4v/ABwqq/8ABCqr/wAYVVX/AAhVVf8AGFVV/wAIVVX/ABRVVv8AC1VW/wAQVVX/AA5VVf8AEFVV/wAOVVX/AAxVVv8AEKqr/wAIVVWe/wAIVVWe/wAEKqv/ABQqq4v/ABVVVYv/ABVVVf///IAA/wAUKquEnoSe///0gAD/ABCqq3v/AA5VVQh7/wAOVVX//+tVVf8AC1VW///mqqv/AAhVVf//5qqr/wAIVVX//+FVVf8ABCqrZ4sIJfdA+xL7QPtoBvfm+3MV9xjYB/8AHKqri/8AF9VV///7VVWe///2qque///2qqv/AAmAAP//7qqqi///5qqri///5qqr///21VX//+6qqv//7aqr///2qqv//+2qq///9qqr///ogAD///tVVf//41VViwgOePdj+DUVifcv9zjV+zj3AvsS+wI4Qd780PcS95UGi/8AK1VV/wAKVVX/ACGqq/8AFKqro/8AFKqro/8AGlVVl6uL/wASqquL/wAPgAD///yqq/8ADFVV///5VVX/AAxVVf//+VVV/wAJqquCkv//9Kqrkv//9KqrkP//8oAAjv//8FVVjv//8FVV/wABgAD//+8qq4t5CPue9xL3wAeL/wAaqqv///yqq/8AGVVV///5VVWj///5VVWj///1VVb/ABUqq///8VVV/wASVVX///FVVf8AElVV///tVVb/AA6AAP//6VVV/wAKqqv//+lVVf8ACqqr///kqqv/AAVVVWuLaYv//+GAAP//+CqrcP//8FVVcP//8FVV///s1VX//+yAAP//9Kqr///oqqsIDlf3WvfBFbwK9xX3lBW5Cg4x9zf5XxW7Cnn7eRX3F/vyjYv3Cvfy9xqL+2z8ugWB///lVVX///VVVf//59VW///0qqv//+pVVf//9Kqr///qVVX///Kqqv//7YAA///wqqv///Cqq///8Kqr///wqqt5///0Kqr//+tVVf//96qr///rVVX///eqq///5qqr///71VVti///8qqri///8oAA/wAA1VX///JVVf8AAaqr///yVVX/AAGqq///84AA/wACKqr///Sqq/8AAqqrCJn3AAX/AAdVVf///VVV/wAIVVb///3VVv8ACVVV///+VVX/AAlVVf///lVV/wAIqqv///8qq5OL/wAYqquL/wASVVX/AAZVVZf/AAyqq5f/AAyqq/8ACqqrnf8ACVVV/wAXVVUIpMv7Yfh1BQ5s9/YW9zz4evsS/Bb7WvgW+xH8evdC+x/2Bg4s91wW+OX3vfeUJfsh+9v9WAcO+1j3Whb4F/dh94v7APso+3L8egcO++/X+VgVNAoO+Av4pfdOFXgK96D3ABV5Cg73d/nE92AVgQr7d/sRFYIK+GH3ZRWDCg7s98j5WBUoCr78ShUpCvb9WRWAClsWdwoOM/gEzRVJCof3KRVKCqT8DhWAClsWdwoOotr5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+I4WkQqB+MsVSAoO92L5GvkRFZAK+8D4nhWUCg7T+I4WkQr7HfjGFZQKDvdi+Rr5ERWQCvxb+KIVdQoO0/iOFpEK+6f43hV1Cg73Yvka+REVkAr8C/w8FVcKDtP4jhaRCvtX+zIVVwoOkPeQ98MVRgr4Hr0VSAoOIY74dBVmCvdbvhVICg6Q95D3wxVGCveQ/dEVVwoOIY74dBVmCnD93RVXCg6Q95D3wxVGCvfNpBWUCg4hjvh0FWYK9c8VlAoOkPeQ98MVRgr3Jb0VdQoOIY74dBVmCk++FXUKDvsR+Ij3WhXr/IgrBw74C/p891oV6/58KwcO+933QvhQFZMKDvvd9w75WBUlCg773fcO9x4VJQoOIfdI+FAVkwr34RaTCg4h9+f5WBUlCvvhFiUKDiH35vceFSUK+98WJQoOa/f1+I0V91/7Bvtf+1or91r8q/cG+Kv3W+sHDmv39fifFfdN+wb7TftUK/dU+6P7VCv3VPtO9wb3TvdV6wf7Vfej91XrBg77EdT39hWL///nVVX/AASqq3T/AAlVVf//6qqr/wAJVVX//+qqq/8ADKqr///tVVWbe5t7/wASqqv///NVVf8AFVVV///2qqv/ABVVVf//9qqrov//+1VV/wAYqquL/wAYqquLov8ABKqr/wAVVVX/AAlVVf8AFVVV/wAJVVX/ABKqq/8ADKqrm5sIm5v/AAyqq/8AEqqr/wAJVVX/ABVVVf8ACVVV/wAVVVX/AASqq6KL/wAYqquL/wAYqqv///tVVaL///aqq/8AFVVV///2qqv/ABVVVf//81VV/wASqqt7m3ub///tVVX/AAyqq///6qqr/wAJVVX//+qqq/8ACVVVdP8ABKqr///nVVWLCP//51VVi3T///tVVf//6qqr///2qqv//+qqq///9qqr///tVVX///NVVXt7e3v///NVVf//7VVV///2qqv//+qqq///9qqr///qqqv///tVVXSL///nVVUIDvgL4tEVIQr34RYhCvfhFiEKDviy+C/3ORW+CvggFr4K/bT4DxW+CuUWvwr4KPwPFb8K+CAWvwr77/jTFSQKDvvd9yL3jBVrCg773fcu94oVcwoO/F73jvl4FSQKDnz43KQVYusF///aqqt1///UVVWAWYv//+aqq4v//+iqqv8AA4AA///qqquS///qqquSeP8ACYAA///vVVWX///vVVWXff8ADiqr///0qqv/ABBVVf//9Kqr/wAQVVWD/wARgAD///tVVf8AEqqrCPdqi6bh+5SLBf///1VV/wADVVX///+AAP8AA4AA////qqv/AAOqq////6qr/wADqqv////VVf8AA9VVi48IoAeL/wASqquM/wAQVVWNmQj3q4un4fu0iwX/AAaqq6H/AAnVVf8AE1VVmP8AEKqrmP8AEKqrmpmc/wALVVWc/wALVVX/ABKAAP8ACKqrn5GfkZ+On4v/ABiqq4v/ABeqqv///aqr/wAWqqv///tVVf8AFqqr///7VVWehP8AD1VV///2qqsIse8Fef8ACVVV///o1VX/AAfVVv//46qr/wAGVVX//+Oqq/8ABlVV///h1VX/AAMqq2uLY4v//9rVVf//+lVV///dqqv///Sqq///3aqr///0qqv//+FVVf//79VVcHZwdv//6NVV///m1VX//+yqq///4qqr///sqqv//+Kqq///8VVVaoH//9tVVQhUi20104sF///+qqv///iqq////yqq///4Kqr///+qq///96qr////qqv///eqq////9VV///31VWLgwiLdYuABYuH/wAAVVX///xVVf8AAKqr///8qqsIXotvNd+LBZP//99VVZf//+Eqq5tum27/ABSqq///5oAA/wAZVVV1/wAZVVV1/wAeKqv//+6qq67///NVVa7///NVVf8AKCqr///5qqv/AC1VVYuvi/8AIYAAj6qTqpP/ABkqq/8AClVV/wATVVX/AAyqqwgO+GCz+MQVbQrZFm4K+eN5FS0KDvfxs/jEFW0K2RZuCvf99ygVMQoO+xH4T7wVY8iJiwX//+Cqq///5qqr///iqqr///NVVf//5Kqri4OL///4Kqv/AAEqq///+FVV/wACVVX///hVVf8AAlVV///5KquPhf8ABaqrhf8ABaqrhv8AB6qqh/8ACaqrh/8ACaqrif8AC9VVi5kI9w4H/wA+qqvD/wAugADA/wAeVVW9/wAeVVW9/wAPKqv/ADJVVYv/ADKqq4u3///zqqv/ACLVVf//51VV/wAZqqv//+dVVf8AGaqr///eqqv/AAzVVWGLc4t1///7VVV3///2qqt3///2qqv//+6qq///8tVV///xVVV6CP//8VVVev//9IAAd///96qrdP//96qrdP//+9VV///mgACLbwiL+4goNrVMjYvDv4tLBYv//9VVVf8ADYAA///d1Vam///mVVWm///mVVX/ACWAAP//8yqru4v/ADlVVYv/ADSqq6C7tQgi+J0Vi2v///iqq///3tVV///xVVX//92qq///8VVV///dqqv//+lVVv//3dVV///hVVVpCPdNB4v/AByqq/8ABKqr/wAWKqr/AAlVVf8AD6qr/wAJVVX/AA+qq5b/AAfVVf8ADKqri/8ADKqri/8AClVVhJN9k32P///uqquL///rVVUIDvir+s33shXO+5RIB/uHKxX74/ia+y2Li/1Y9xSLifidjov34/yd9y2Li/lY+xWLjvyaBfie+BQVi6GH/wAUKquD/wASVVWD/wASVVX///Uqq/8AD6qr///yVVWY///yVVWY///v1VaV///tVVWS///tVVWS///rqqv/AAOAAHWLdYv//+uqq////IAA///tVVWE///tVVWE///v1VaB///yVVV+CP//8lVVfv//9Sqr///wVVWD///tqquD///tqquH///r1VWLdYt1j///66qrk///7VVVk///7VVV/wAK1VX///Aqq/8ADaqrfv8ADaqrfv8AECqq///11VX/ABKqq///+Kqr/wASqqv///iqq/8AFFVV///8VVWhiwihi/8AFFVV/wADqqv/ABKqq/8AB1VV/wASqqv/AAdVVf8AECqq/wAKKqv/AA2qq5j/AA2qq5j/AArVVf8AD9VVk/8AEqqrk/8AEqqrj/8AFFVVi6EIOxaL///qqqv///mqq///7YAA///zVVX///BVVf//81VV///wVVX//+2qq///+Cqrc4tzi///7dVV/wAH1VX///Oqq/8AD6qr///zqqv/AA+qq///+dVV/wASgACL/wAVVVWL/wAUqqv/AAYqq/8AEiqq/wAMVVX/AA+qq/8ADFVV/wAPqqv/ABIqq/8AB9VVo4sI/wAXVVWL/wASKqv///gqq5j///BVVZj///BVVf8ABoAA///t1VaL///rVVUIDvgL9zb4/hX71vH31vcO5fvuMQf4TOUV/DDx96CNB/D7oNGL8PegjYuL+6Dxi4v4MPsiiyn7oCn3oAUO9xr4PRb3qPX7QasG/wAeqqv/AAlVVf8AGlVV/wANgACh/wARqquh/wARqqud/wAUgACZ/wAXVVWZ/wAXVVX/AAoqq/8AGdVW/wAGVVX/ABxVVf8ABlVV/wAcVVX/AAMqq/8AHdVWi/8AH1VVi/8ALqqr///3gAD/ACqqqnr/ACaqq3r/ACaqq///6KqrrP//4lVV/wAbVVUI///iVVX/ABtVVf//3Sqr/wAVVVZj/wAPVVVj/wAPVVX//9VVVf8AB6qr///SqquL///SqquL///VgAD///gqq///2FVV///wVVX//9hVVf//8FVV///dVVb//+oqq///4lVVb///4lVVb///6Kqr///egAB6ZHpk///3gAD//9WAAItdCIv//+FVVf8AA1VV///iqqv/AAaqq2//AAaqq2//AApVVf//5lVVmf//6Kqrmf//6Kqr/wAR1VX//+uqqv8AFaqr///uqqv/ABWqq///7qqr/wAZ1VX///Kqqqn///aqqwhr+0Ah96b3UQdX/wANVVX//9lVVf8AGNVW///mqqv/ACRVVf//5qqr/wAkVVX///NVVf8ALCqri7+LqZD/ABxVVZX/ABqqq5X/ABqqq/8ADiqr/wAXVVX/ABJVVZ//ABJVVZ+h/wAP1VX/ABmqq/8AC6qr/wAZqqv/AAuqq/8AHIAA/wAF1VX/AB9VVYsI/wAeqquLp///+iqr/wAZVVX///RVVf8AGVVV///0VVX/ABXVVv//8Cqr/wASVVV3/wASVVV3/wAOKqv//+jVVZX//+Wqq5X//+Wqq5D//+PVVYtti///51VV///8qqv//+gqq///+VVVdP//+VVVdIH//+sqq///8qqr///tVVUI///yqqv//+1VVf//74AA///wKqv//+xVVX7//+xVVX7//+mAAP//9yqr///mqqv///tVVQgOx9r5WBU2Cg7s98j5WBUoCr78ShUpCvb3qxV2ClsWdwoO+xH3MfeXFfgoBov/ACiqq///+aqr/wAlKqr///NVVf8AIaqr///zVVX/ACGqq///7lVWqP//6VVV/wAYVVX//+lVVf8AGFVV///k1Vae///gVVX/AA2qq///4FVV/wANqqv//9zVVv8ABtVV///ZVVWL///YqquL///cgAD///jVVf//4FVV///xqqv//+BVVf//8aqr///k1Vb//+yAAP//6VVV///nVVUI///pVVX//+dVVf//7qqr///i1VZ////eVVV////eVVWF///b1VaL///ZVVWL///ZVVWRZ5f//96qq5f//96qq/8AEVVV///i1VX/ABaqq3L/ABaqq3L/ABsqqv//7FVV/wAfqqv///Gqq/8AH6qr///xqqv/ACOAAP//+NVV/wAnVVWLCKWL/wAXqqv/AAKAAP8AFVVVkP8AFVVVkP8AE9VWk/8AElVVlv8AElVVlpyZ/wAPqquc/wAPqquc/wAPgAD/ABSAAP8AD1VVowhooAX//+aqq2Fv///hgAD//+FVVXj//+FVVXj//9uqq///9oAAYYv//8aqq4v//8+qqv8AE6qr///Yqqv/ACdVVQj3t/dtFfu39yUGs7O7n8OLw4u8d7VjCA7779f5WBU0Cg5G1/lYFTQK9ywWNAoO92XX+VgVNAr3LBY0CvcsFjQKDvfU1/lYFTQK1BZDCg61iPlYFUMKDvfUiPlYFUMK+O0WNAoO+OqI+VgVQwr47RY0CvcsFjQKDvoAiPlYFUMK+O0WNAr3LBY0CvcsFjQKDvfm1/lYFTQK99z75hVFCg7H95D4BhVFCg735veQ+AYVRQr5fRY0Cg74/PeQ+AYVRQr5fRY0CvcsFjQKDiHa+VgVNwoOx/jJ+LIVLQoO9xra+VgVLgpQ/OYVLwoO98Hd+VgVOAoO/AHR+HQVVgr7Hfc3FVcKDiLR+HQVVgr7Hfc3FVcK96n7NxVWCvsd9zcVVwoO9y/R+HQVVgr7Hfc3FVcK96n7NxVWCvsd9zcVVwr3qfs3FVYK+x33NxVXCg73LtH4dBVWCvsd9zcVVwr3Zvs3FWMKDiGO+HQVYwoO9y6O+HQVYwr4WxZWCvsd9zcVVwoO+DKO+HQVYwr4WxZWCvsd9zcVVwr3qfs3FVYK+x33NxVXCg75No74dBVjCvhbFlYK+x33NxVXCvep+zcVVgr7Hfc3FVcK96n7NxVWCvsd9zcVVwoO90DR+HQVVgr7Hfc3FVcK+CP8FRVlCg4z91T3lhVlCg73QPdU95YVZQr42RZWCvsd9zcVVwoO+ET3VPeWFWUK+NkWVgr7Hfc3FVcK96n7NxVWCvsd9zcVVwoO/AHR+YgVWgoO+yP4IPfkFU0KDpD4VNMVTgr7rvc8FU8KDveJyvh0FVsKDkb4lvf6FYu3///7gAD/ACuAAIK2grZ8/wAm1VV2/wAiqqt2/wAiqqv//+Qqq6f//91VVf8AFVVV///dVVX/ABVVVf//1Kqr/wAKqqtXi2eL///g1VX///pVVf//5aqr///0qqv//+Wqq///9Kqr///k1VX//++qqm///+qqqwjGRQWd/wAOqque/wAL1VWflJ+U/wAVqqv/AASAAP8AF1VVi/8AHVVVi/8AGIAA///4qqv/ABOqq///8VVV/wATqqv///FVVf8AD6qq///tqqv/AAuqq3X/AAuqq3X/AAgqqv//59VV/wAEqqv//+Wqq/8ABKqr///lqquN///m1VX///9VVXMIbwf//+qqq/8AEVVV///p1VX/AA2AAHT/AAmqq3T/AAmqq///5oAA/wAE1VVvi2uL///iqqv///qAAP//5VVVgP//5VVVgP//6Sqr///wqqt4///sVVV4///sVVX///FVVf//6Kqr///1qqtw///1qqtw///61VX//+KAAItrCIv//99VVf8ABSqr///h1Vb/AApVVf//5FVV/wAKVVX//+RVVf8ADtVWc/8AE1VV///rqqv/ABNVVf//66qronv/ABqqq///9FVV/wAaqqv///RVVan///oqq/8AIVVVi/8ANKqri/8AKtVV/wALVVWs/wAWqqus/wAWqqv/ABnVVf8AHSqq/wASqqv/ACOqqwj/ABKqq/8AI6qr/wAM1VX/ACfVVZK3krf/AAOAAP8AK1VVi/8AKqqrCPsJRhWMcgX/AACqq3f///3VVf//6qqrhv//6VVVhv//6VVV///31VX//+sqq///9KqreP//9KqreP//8aqq///wKqv//+6qq///81VV///uqqv///NVVf//66qq///5qqv//+iqq4t3i///7tVV/wAD1VX///Gqq/8AB6qr///xqqv/AAeqq///9Cqq/wAKKqr///aqq/8ADKqrCP//9qqr/wAMqqv///kqqv8ADqqq///7qqv/ABCqq///+6qr/wAQqqv///3VVf8AEVVVi52L/wASqqv/AAKAAP8AEiqqkP8AEaqrkP8AEaqr/wAHgAD/AA9VVZWYlZj/AAyqq/8ACoAA/wAPVVWT/wAPVVWTnY//ABSqq4sIp4v/ABeqq///+iqr/wATVVX///RVVf8AE1VV///0VVX/ABJVVv//8IAA/wARVVX//+yqqwgOx5MW+TGL+7D5XPsHiwXD+xcV9038cfv6iwUO9wj4yftqFfcG+nz8/f589wb6FfgZBg6ipPtqFfjr8vxZBve5+Cj7p/ga+DqLi/L80YuLMve2/Cn7w/w1BQ60+PD39hUmCg78XveO+XgVJAoO+93P97cVIQoOM/fm+2oV92f6fPsIi/s8/cv7Ffel+yhHtDG+pPcs+9EFDvdS+Zb3mxWL/wAYqqv///wqq/8AF1VV///4VVWh///4VVWh///01Vae///xVVWb///xVVWb///uVVb/AAyqq///61VV/wAJVVX//+tVVf8ACVVV///oqqv/AASqq3GL///qqquL///sKqr///yqq///7aqr///5VVX//+2qq///+VVVeoL///BVVf//9KqrCP//8FVV///0qqv///FVVv//8yqq///yVVX///Gqq///8lVV///xqqv///LVVv//8Sqq///zVVX///Cqq///8qqr/wAPVVX///KAAP8ADtVW///yVVX/AA5VVf//8lVV/wAOVVX///FVVv8ADKqr///wVVWW///wVVWWev8ACNVV///tqqv/AAaqq///7aqr/wAGqqv//+vVVf8AA1VVdYsIcYv//+iqq///+1VV///rVVX///aqq///61VV///2qqv//+6AAP//81VV///xqqt7///xqqt7gHj///hVVXX///hVVXX///wqq///6Kqri///51VVi///5qqrj///6FVVk3WTdf8AC1VVeP8ADqqrewj/AA6qq3ud///zVVX/ABVVVf//9qqr/wAVVVX///aqq/8AF6qr///7VVWli/8AFVVVi/8AE4AAjv8AEaqrkf8AEaqrkf8AEFVV/wAIKqua/wAKVVWa/wAKVVX/AA5VVf8AC9VW/wANqqv/AA1VVf8ADaqr/wANVVX/AA3VVZmZ/wAOqqsI/wAMqqv///FVVf8ADVVVfZn///Kqq5n///Kqq/8ADtVV///0Kqr/AA+qq///9aqr/wAPqqv///Wqq/8AENVV///3qqqd///5qqud///5qqv/ABNVVf///NVV/wAUqquL/wAaqquL/wAXqqr/AASqq/8AFKqr/wAJVVX/ABSqq/8ACVVV/wARqqqY/wAOqqv/ABCqqwj/AA6qq/8AEKqr/wALKqr/ABNVVf8AB6qrof8AB6qrof8AA9VV/wAXqquL/wAZVVUIMYgVi///6Kqr///5VVX//+xVVf//8qqre///8qqre3iD///nVVWLfYv///KAAP8AAoAAfpB+kP//86qr/wAGVVX///RVVf8AB6qr///0VVX/AAeqq///9Sqr/wAIqqqB/wAJqquB/wAJqqv///aqq/8ACdVV///3VVWVCJP/AAiqq/8ACSqr/wAJgAD/AApVVf8AClVV/wAKVVX/AApVVZb/AAmAAP8AC6qr/wAIqqv/AAuqq/8ACKqrl/8AByqq/wAMVVX/AAWqq/8ADFVV/wAFqqv/AAzVVv8AAtVV/wANVVWL/wAZVVWL/wATqqv///eqq5n//+9VVZn//+9VVZL//+uqq4tzCPveihWD///2qqv///bVVf//9oAA///1qqv///ZVVf//9aqr///2VVWA///3VVb///RVVf//+FVV///0VVX///hVVf//89VW///5qqv///NVVYb///NVVYb///NVVv///YAA///zVVWL///nVVWL///sgAD/AAeAAP//8aqrmv//8aqrmv//+NVV/wAT1VWL/wAYqqsIi/8AFqqrkv8AE9VVmZyZnP8AEqqr/wAIgAD/ABdVVYv/AAyqq4v/AAzVVf///SqrmP//+lVVmP//+lVV/wAMgAD///jVVpf///dVVZf///dVVf8AC1VV///2qqv/AAqqq4H/AAqqq4H/AAlVVf//9qqrk///91VVCA59+Hr5WRWLmf///IAA/wAL1VWE/wAJqquE/wAJqquC/wAH1VWAkYCRf/8ABIAAfo5+jv//89VV/wABgAD///Sqq4v//+Sqq4v//+lVVf//+4AAeYJ5gv//8aqr///z1VX///VVVf//8KqrCP//9VVV///wqqv///gqq///7lVVhneGd////NVV///rKqv///6qq///6lVV///+qqv//+pVVf///4AA///qVVb/AABVVf//6lVV/wAAVVX//+pVVf8AACqr///r1VaL///tVVUI/I4Hi///7qqr/wAAqqt6/wABVVX//+9VVf8AAVVV///vVVX/AACqq3qL///uqquL///8qqv/AAAqq///+9VV/wAAVVWG/wAAVVWG////qquGioaKhv///lVV///7qqv///2qq////FVV///9qqv///xVVf///Cqq///+Kqv///qqq4sI///5VVWL///7VVb/AAPVVf///VVV/wAHqqv///1VVf8AB6qr///81Vb/AAhVVf///FVVlP///FVVlP//+qqr/wAIVVWE/wAHqquE/wAHqqv///SAAP8AA9VVe4v///Cqq4v///NVVYaBgYGBhv//81VVi///8KqrCIt9/wADgAD///Qqq5L///ZVVZL///ZVVZT///gqq5aFloWX///7qquY///9VVWY///9VVX/AAyAAP///qqrl4v/AB9VVYv/ABkqq/8ABiqrnv8ADFVVnv8ADFVV/wAOgACblf8AE6qrCJX/ABOqq/8ABqqr/wAWKqr/AANVVf8AGKqr/wADVVX/ABiqq/8AAaqrpIv/ABlVVQj44QeL/wAUqqv///9VVf8AFFVV///+qquf///+qquf////VVX/ABRVVYv/ABSqq4v/AAVVVf8AANVV/wAFqqv/AAGqq5H/AAGqq5H/AASAAI7/AAdVVYv/AAdVVYv/AAUqq////Cqrjv//+FVVjv//+FVV/wADVVX///eqq/8AA6qrggj/AAOqq4L/AAVVVf//96qrkv//+FVVkv//+FVV/wALgAD///wqq5uL/wAPVVWL/wAMgAD/AATVVf8ACaqr/wAJqqv/AAmqq/8ACaqr/wAE1VX/AAyAAIv/AA9VVQgOtPju+FcVRAb///yqq///71VV///5gAB8///2VVX///Kqq///9lVV///yqqv///HVVv//+VVV///tVVWLd4v//+sqq/8AA4AA///qVVWS///qVVWS///qKqv/AAeAAHWTdZN1/wAHgAB1knWS///qqqv/AAOAAP//61VViwhzi///6yqr///61VX//+5VVf//9aqr///uVVX///Wqq///8VVW///yqqr///RVVf//76qr///0VVX//++qq4L//+2AAP//+aqr///rVVX///mqq///61VV///71VX//+tVVon//+tVVQjSBv8AA1VVm/8ABtVW/wAPgAD/AApVVZr/AApVVZr/AA6AAP8AB4AA/wASqquL/wANVVWLnP///FVV/wAUqqv///iqq/8AFKqr///4qquh///4Kqr/ABdVVf//96qr/wAXVVX///eqq/8AF4AA///4Kqr/ABeqq///+Kqr/wAXqqv///iqq/8AFdVV///8VVWfiwj/ABiqq4v/ABVVVf8ABNVVnf8ACaqrnf8ACaqrmv8ADNVVl5uXm/8ACSqr/wASVVX/AAZVVf8AFKqr/wAGVVX/ABSqq/8ABCqr/wAVVVWNoQiJ+2QVRAb///yqq///71VV///5gAB8///2VVX///Kqq///9lVV///yqqv///HVVv//+VVV///tVVWLd4v//+sqq/8AA4AA///qVVWS///qVVWS///qKqv/AAeAAHWTdZN1/wAHgAB1knWS///qqqv/AAOAAP//61VViwhzi///6yqrhv//7lVVgf//7lVVgf//8VVW///y1VX///RVVf//76qr///0VVX//++qq4L//+2AAP//+aqr///rVVX///mqq///61VV///71VX//+tVVon//+tVVQjSBv8AA1VVm/8ABtVW/wAPVVX/AApVVf8ADqqr/wAKVVX/AA6qq/8ADoAA/wAHVVX/ABKqq4uZi/8AEVVV///8VVX/ABSqq///+Kqr/wAUqqv///iqq6H///gqqv8AF1VV///3qqv/ABdVVf//96qr/wAXgAD///gqqv8AF6qr///4qqv/ABeqq///+Kqr/wAV1VX///xVVZ+LCP8AGKqri/8AFVVV/wAE1VWd/wAJqqud/wAJqqv/AA7VVf8ADNVV/wALqqub/wALqqublP8AElVV/wAGVVX/ABSqq/8ABlVV/wAUqqv/AAQqq/8AFVVVjaEIDrT31vc2Ffec8ftqBrHZ90SLi/H7EYu+7jG3Q/sj+6KLiyX3b4tlPftJi4sl9xaLWSgF414FDrTb984V+I77Pov3BPv79wT3+/cKi/cF/I77RQX8NgT4jvb8jgYOtNv3lBWL+wT4jvc+i/cA/I73RYv7Bff7+woF+/v7lRUg+I72Bw5r9+5oFfdG+Bv7RvgbJ4v7Rfwb90X8GwW9+TgV9wv7sfsL+7L7CveyBQ78AfdF+YgVSAoO/AH3SvoYFXAKDvwB91r5iBV0Cg78Acr6GBWLCg78AVX5jBV1Cg78AVn50BVXCvdiFlcKDvwB97b5pxVsCg78Aab6GBWJCg78Afd/+dkVdgpbFncKDvwB2voYFXAK0BZwCg78AcD50BVXCg78AfcA+VgVjAoO/AHtTxWNCg78Afc0+NwV0fdaIIs2+1oFDveP+Hj5LBV5///oqqv///RVVf//7qqq///6qqv///Sqq///9qqrd///+1VV///rqquL///rVVX/ACqqq4v/ACSqqv8AEVVV/wAeqqv/ACKqq/8AHqqr/wAiqqv/AA9VVf8AJ6qqi/8ALKqrfYv//+6qq///+yqr///rVVX///ZVVf//61VV///2VVX//+2qq///8YAAe///7KqrCPdW/D8V///yqqv/ABNVVf//+VVVp4v/ACSqq4v/AB6qq/8ACFVV/wAc1VX/ABCqq6b/ABCqq6b/ABZVVf8AE9VVp/8ADKqrbf8AIqqrd/8AFVVVgZP//+qqq/8AD1VVbf8AB6qr///ZVVWLe4tt///3VVVf///uqqsId4N4h3mLgYtx/wAIqqth/wARVVX//+yqq5P//+hVVY9vi///xVVVi///z1VW///mqqv//9lVVf//zVVVZ///0KqreVaL///FVVWLW/8ABqqr///VgAD/AA1VVWYI/wANVVVm/wAUVVb//9mAAP8AG1VVY/8ADqqrdf8ADqqq///tVVX/AA6qq///8Kqrr///2VVV/wAiVVX//+yqq/8AIKqri5eLm/8AA6qrn/8AB1VV/wAlVVX/AA6qq6T/AAdVVf8ADKqri5mL/wATqqv///qqq/8AGVVV///1VVUI/wAaqqv///Sqq6L///pVVf8AE1VVi/8AFqqri5//AAWqq/8AEVVV/wALVVWX/wAIqqv/ABNVVZ7/ABqqq/8AHVVV/wAQqqv/ABKqq5ul/wAPVVX/ACFVVf8AAqqr/wAFVVX/AAKqqv8ABlVW/wACqqv/AAdVVf8AAqqr/wAHVVWO/wAIVVb/AANVVf8ACVVVCH//AANVVf//8YAA/wAJKqt6mnqa///xKqv/ABEqq///81VV/wATVVUIDmv3A/gOFVIK+CzxFVYK+xz3NxVXCg5r9wP4DhVSCvgs+A4VWgoO+933A/chFSUKDvvd0tQVIQr35wQhCg773fcD9yEVJQr7NvejFSEKDvvd92f3dRUgCnf7LBUhCg4h92n3aBUnCnf7VhUhCg74C/iH+HcVwAr74QT///VVVYuB///91VX///aqq///+6qr///2qqv///uqq4P///oqqv//+VVV///4qqv///lVVf//+Kqr///6qqv///eAAIf///ZVVYf///ZVVYn///Yqq4uB/wAAqqt1k///7Sqr/wAPVVX///BVVf8AD1VV///wVVWd///4gAD/ABSqq/8AAKqrCP8AFVVVi52T/wAOqqub/wAOqqub/wAHVVX/ABJVVYv/ABSqq////1VVoYP/ABLVVf//8Kqr/wAPqqv///Cqq/8AD6qref8AB4AA///rVVX///9VVQiM++AVwAoO+Av4WfuSFeqMivp7LIoFDvsR91+HFeqMiviHLIoFDvsR93X3KRWM/Ie8jIr4hwUO+xH3dfcpFYz8h7yMiviHBQ773fi/90EVv+AFS/8ALVVV//+6Kqv/ACOAAP//tFVV/wAZqqv//7RVVf8AGaqr//+x1Vb/AAzVVf//r1VVizn///9VVf//sVVV///y1Vb//7Sqq///5lVV//+0qqv//+ZVVUb//9yAAP//wVVV///SqqsIwjcFw7P/AD1VVf8AHyqr/wBCqqv/ABZVVf8AQqqr/wAWVVXP/wALgAD/AEVVVf8AAKqrz4v/AEOqq///9NVV/wBDVVX//+mqq/8AQ1VV///pqqv/AD2qq///4NVVw2MIDvvd+5j4JhVXNgXL///Sqqv/AEXVVf//3IAA/wBLqqv//+ZVVf8AS6qr///mVVX/AE4qqv//8yqr/wBQqquL3f8AAKqr/wBOqqv/AA0qqv8AS1VV/wAZqqv/AEtVVf8AGaqr0P8AI4AA/wA+qqv/AC1VVQhT3wVTY///wtVV///g1VX//72qq///6aqr//+9qqv//+mqq///vCqq///0gAD//7qqq////1VVR4v//7xVVf8ACyqr//+8qqv/ABZVVf//vKqr/wAWVVX//8JVVf8AHyqrU7MIDvvv91v4UBU0igWL///5VVWK///3VVaJ///1VVWJ///1VVX///wqq///9aqr///6VVWB///6VVWB///4Kqv///dVVYH///iqq4H///iqq37///xVVXuLCPtTBv//6VVVi///7IAA///7VVX//++qq///9qqr///vqqv///aqq///8oAA///01VX///VVVX7///VVVX6D///yKqv///qqq///8VVV///6qqv///FVVf///VVV///zVVaL///1VVUIMN/CB4uZ/wACVVX/AAsqq/8ABKqr/wAIVVX/AASqq/8ACFVV/wAF1VX/AAZVVpL/AARVVZL/AARVVf8AB4AA/wACqquTjJOM/wAHqqv/AACAAP8AB1VViwj3Sgb/ABdVVYv/ABKAAP8AA6qr/wANqqv/AAdVVf8ADaqr/wAHVVX/AApVVf8ACKqrkpWSlf8ABNVV/wAKgAD/AAKqq5b/AAKqq5b/AAGqqv8ACYAA/wAAqquTCIyMBf8AAKqrg43///aAAP8AA1VVgP8AA1VVgP8ABaqr///1gACTgZOB/wAKVVX///dVVf8ADKqr///4qqv/AAyqq///+Kqrm////FVV/wATVVWLCPdQBv8AB1VVi/8AB6qr////gACTipOK/wAHgAD///1VVZL///uqq5L///uqq/8ABdVV///5qqr/AASqq///96qr/wAEqqv///eqq/8AAlVV///01VWLfQhU3+YHi/8ACqqr///9VVX/AAyqqv//+qqr/wAOqqv///qqq/8ADqqr///3qqr/AA3VVf//9KqrmP//9KqrmP//8iqq/wALKqv//++qq/8ACVVV///vqqv/AAlVVf//7IAA/wAEqqv//+lVVYsI+1oGfYv///RVVf8AA6qr///2qqv/AAdVVf//9qqr/wAHVVX///jVVf8ACKqrhpWGlf///IAA/wAKVVWJ/wAKqquJ/wAKqquK/wAIqqqL/wAGqqsIDvvv2fcXFeKMBYv/AAdVVYyUjf8ACqqrjf8ACqqr/wAD1VX/AApVVf8ABaqrlf8ABaqrlf8AB9VV/wAIgACVkpWSmP8AA4AAm4sI91MG/wAWqquL/wATgAD/AASqq/8AEFVV/wAJVVX/ABBVVf8ACVVV/wANgAD/AAsqq/8ACqqrmP8ACqqrmJP/AA3VVf8ABVVV/wAOqqv/AAVVVf8ADqqr/wACqqv/AAyqqov/AAqqqwjmN1QHi33///2qq///9NVV///7VVX///eqq///+1VV///3qqv///oqq///+aqqhP//+6qrhP//+6qr///4gAD///1VVYOKg4r///hVVf///4AA///4qquLCPtKBv//6Kqri///7YAA///8VVX///JVVf//+Kqr///yVVX///iqq///9aqr///3VVWEgYSB///7Kqv///WAAP///VVVgP///VVVgP///lVW///2gAD///9VVYMIiooF///+qquT///9qqr/AAmAAP///Kqrlv///Kqrlv//+oAA/wAKgAD///hVVZX///hVVZX///XVVv8ACKqr///zVVX/AAdVVf//81VV/wAHVVV7/wADqqv//+yqq4sI+1AG///4qquL///4VVX/AACAAIOMg4z///iAAP8AAqqrhP8ABFVVhP8ABFVV///6Kqv/AAZVVv//+1VV/wAIVVX///tVVf8ACFVV///9qqv/AAsqq4uZCMI3MAeL///1VVX/AAKqq///81VW/wAFVVX///FVVf8ABVVV///xVVX/AAhVVv//8iqr/wALVVV+/wALVVV+/wAN1Vb///TVVf8AEFVV///2qqv/ABBVVf//9qqr/wATgAD///tVVf8AFqqriwj3WgaZi/8AC6qr///8gAD/AAlVVYT/AAlVVYT/AAcqq///94AAkIGQgf8AA4AA///1qquN///1VVWN///1VVWMgov///iqqwgO++/4pPdVFdmLivdT/guKjPtT2YuL5flvjAUO++/7jvgTFT2LjPtT+guMivdTPYuLMf1vigUO+NIU+QUVeZ34dJf3bJ2mmgb7ho0HjgwKjAwOHAAfEwChAgABAAkA7AJQAyMDLwM5A0AFXwV4BYEG4Ac2B8EJ3AqgC0ULXQtxDY8Npw2vDn0Oog6uDtgO+BCEEegSrxNXE/kUnhfPF98ZXhl2GaoZ1BnvGgoaFhwYHQEeZB/YIgQjZyTbJismjCehKY0qxSwLLBMsxi3ZLfwuBDAEMUUyOTOcNIA3azhXOaQ5vjntOhU7LztKPC09sT8FPxc/HUChQRREEEQbRcRF00XlRfpHt0heSR1JQ0lOTTFN/E6oTz5P1FFhUgRUxVXUViFaJFr3W6VcLF15XiBe017oXvJe/GE2YwBlKGcgaLZowGnfaelqnGqmaq5r5mvubAdtSm3cbltuZ25+bpZv2nAKcBpw1XFrcXtxmXM4c+Z0fHSmdV12FHbLd915JX0Kfq5/6YGFgvGFs4aQhpyHuoj4ibiKV4u7jF6NQfh6+wz8egcLi///9VVV/wACKquB/wAEVVX///aqq/8ABFVV///2qqv/AAXVVoP/AAdVVf//+VVV/wAHVVX///lVVf8ACIAA///6qqv/AAmqq4f/AAmqq4f/AAoqqon/AAqqq4uhi/8AEtVV/wAHqqv/AA+qq/8AD1VV/wAPqqv/AA9VVf8AB9VV/wASVVaL/wAVVVUIi/8AFVVVg517/wAOqqt7/wAOqqv//+1VVf8AB1VV///qqquLdYv//+0qq///+FVV///wVVX///Cqq///8FVV///wqqv///gqq///7aqqi///6qqrCAuLcf8ABNVV///n1VX/AAmqq///6aqr/wAJqqv//+mqq/8ADVVV///sVVWcepx6/wATqqv///Kqq/8AFlVV///2VVX/ABZVVf//9lVV/wAYKqv///sqq6WLpYv/ABgqq/8ABNVV/wAWVVX/AAmqq/8AFlVV/wAJqqv/ABOqq/8ADVVVnJwInJz/AA1VVf8AE6qr/wAJqqv/ABZVVf8ACaqr/wAWVVX/AATVVf8AGCqri6WLpf//+yqr/wAYKqv///ZVVf8AFlVV///2VVX/ABZVVf//8qqr/wATqqt6nHqc///sVVX/AA1VVf//6aqr/wAJqqv//+mqq/8ACaqr///n1VX/AATVVXGLCHGL///n1VX///sqq///6aqr///2VVX//+mqq///9lVV///sVVX///Kqq3p6enr///Kqq///7FVV///2VVX//+mqq///9lVV///pqqv///sqq///59VVi3EIC4v//+aqq///91VV///qqqr//+6qq///7qqr///uqqv//+6qq///6qqq///3VVX//+aqq4v//+aqq4v//+qqqv8ACKqr///uqqv/ABFVVf//7qqr/wARVVX///dVVf8AFVVWi/8AGVVVi/8AGVVV/wAIqqv/ABVVVv8AEVVV/wARVVX/ABFVVf8AEVVV/wAVVVb/AAiqq/8AGVVViwj/ABlVVYv/ABVVVv//91VV/wARVVX//+6qq/8AEVVV///uqqv/AAiqq///6qqqi///5qqrCAv8NP1y3mX4NPlyBQtF+5z2i+D3nAUL/LIl+LIGC/cMsQaL/wAMqquM/wAK1VWNlI2U/wADKquT/wAEVVWS/wAEVVWS/wAFgAD/AAbVVf8ABqqr/wAGqqv/AAaqq/8ABqqrk/8AB6qq/wAJVVX/AAiqq/8ADqqrmf8ADdVV/wANVVWY/wAMqquY/wAMqqv/AAuAAP8ADVVVlZkIlZmT/wAPVVWR/wAQqquR/wAQqquO/wATVVWLoYv/AB9VVf//+qqr/wAb1Vb///VVVf8AGFVV///1VVX/ABhVVf//8Sqr/wAUVVZ4/wAQVVV4/wAQVVX//+mqq/8ADIAA///mVVX/AAiqq///5lVV/wAIqqv//+Qqq/8ABFVVbYsIa4v//+Kqq///+4AA///lVVWC///lVVWC///ogAD///LVVf//66qr///uqqv//+uqq///7qqr///vgAD//+rVVf//81VVcv//81VVcv//96qr///jgACHawj3FIEF/wACqqv/ABtVVf8AClVV/wAXKqudnp2eov8ACYAAp4uli/8AFYAA///31VWc///vqquc///vqqv/AAiAAP//6tVVi3GL///lVVX///eqq///6lVW///vVVX//+9VVQg+PQWB///1VVX///eAAP//9tVWhP//+FVVhP//+FVV///6VVWD///7qqv///eqq///+6qr///3qquI///2qqr///5VVf//9aqr///+VVX///Wqq////yqr///zgACL///xVVUIC/vI/Vj3IYvL9zb3x4vN+zb3JIv7xflYBQv7cIv3A/e0BQv9WPeTB/8AIVVVi/8AINVW/wADVVX/ACBVVf8ABqqr/wAgVVX/AAaqq/8AHKqr/wALKqqk/wAPqquk/wAPqqv/ABQqq/8AFKqq/wAPVVX/ABmqq/8AD1VV/wAZqqv/AAeqq/8AICqqi/8AJqqri/8AFqqr///8Kqv/ABUqqv//+FVV/wATqqv///hVVf8AE6qr///1gAD/ABFVVf//8qqrmgj///Kqq5r//+/VVf8ADFVVeP8ACaqreP8ACaqr///rgAD/AAYqqnX/AAKqqwiNB/8AJKqr/wALVVX/AB2qqv8AEqqr/wAWqqul/wAWqqul/wALVVWsi7OLq///+aqr/wAbVVX///NVVf8AFqqr///zVVX/ABaqq///74AA/wASgAD//+uqq/8ADlVV///rqqv/AA5VVf//6NVV/wAKVVZx/wAGVVVx/wAGVVX//+Wqq/8AAyqr///lVVWLCAv3SPMHu4v/ACLVVf//+IAA/wAVqqt8/wAVqqt8/wAK1VX//+kqq4v//+FVVYv//+VVVf//9YAA///qgAB2///vqqt2///vqqv//+CAAP//99VVYYsIC/dg9w0H/wAzVVWL/wAl1Vb///iqq/8AGFVV///xVVX/ABhVVf//8VVV/wAMKqtxi///2qqri///6Kqrhv//7YAAgf//8lVVgf//8lVV///zVVX///WAAP//8Kqr///4qqv///Cqq///+Kqr///vKqr///tVVf//7aqrif//7aqrif//7tVVinuLCAvt0wX//9yqq/8AKKqr///Z1VX/ABzVVWKcYpz//9OAAP8ACIAAW4v//8lVVYv//83VVv//9yqr///SVVX//+5VVf//0lVV///uVVX//9iqq///5tVWav//31VVav//31VV///mKqv//9iAAP//7VVV///Rqqv//+1VVf//0aqr///2qqv//8yAAIv//8dVVQiL///Iqqv/AAlVVf//zaqq/wASqqv//9Kqq/8AEqqr///Sqqv/ABnVVf//2SqqrP//36qrrP//36qr/wAnVVVy/wAtqqv//+5VVf8ALaqr///uVVX/ADIqqv//9yqr/wA2qquLv4u8lbmfuZ+yq6u3CCPVBf//6Kqrbf//5tVV///qKqtw///yVVVw///yVVX//+Qqq///+Sqr///jVVWL///bVVWL///e1Vb/AAaqq///4lVV/wANVVX//+JVVf8ADVVV///mgAD/ABJVVv//6qqr/wAXVVX//+qqq/8AF1VV///vgAD/ABuqq///9FVVq///9FVVq///+iqrrouxCIv/ACNVVf8ABdVVrP8AC6qr/wAeqqv/AAuqq/8AHqqr/wAQgAD/ABrVVf8AFVVVov8AFVVVov8AGYAAnf8AHaqrmP8AHaqrmP8AISqq/wAGgAD/ACSqq4v/ABiqq4v/ABiAAP//+1VV/wAYVVX///aqq/8AGFVV///2qqv/ABkqq///7VVVpW8IC/1Y95wH/wAqqquL/wArgAD/AAcqq/8ALFVV/wAOVVX/ACxVVf8ADlVV/wAoVVb/ABWqq/8AJFVVqP8AJFVVqP8AHaqr/wAkqqui/wAsVVWi/wAsVVX/AAuAAP8ANIAAi/8APKqri8eB/wA0Kqt3/wAsVVV3/wAsVVX//+VVVf8AJNVW///eqqv/AB1VVQj//96qq/8AHVVV///Zqqr/ABXVVv//1Kqr/wAOVVX//9Sqq/8ADlVVXv8AByqr///RVVWLCAst+HT3Bwb/ACaqq4v/ACOAAP//+4AA/wAgVVWC/wAgVVWCp33/ABeqq3j/ABeqq3j/ABKAAP//5yqr/wANVVX//+FVVf8ADVVV///hVVX/AAaqq///21VWi///1VVVi///1Kqr///4gAD//9sqqnz//+Gqq3z//+Gqq///64AA///nVVVxeAhxeP//4YAAfWiCaIL//9rVVf//+4AA///YqquLCAv9WPh79wb7/fdU99n3BvvZ90L36/cGBwv9WPcS97r3zPcG+8z3Tvff9wYHC/f++6P7Bvcl+zsHdf//81VV///m1VX///aqq///46qrhf//46qrhf//4dVViGuL///bVVWL///e1Vb/AAaqq///4lVV/wANVVX//+JVVf8ADVVV///mgAD/ABJVVv//6qqr/wAXVVX//+qqq/8AF1VV///vgAD/ABuqq///9FVVq///9FVVq///+iqrrouxCIv/ACNVVf8ABdVVrP8AC6qr/wAeqqv/AAuqq/8AHqqr/wAQgAD/ABrVVf8AFVVVov8AFVVVov8AGYAAnf8AHaqrmP8AHaqrmP8AISqq/wAGgAD/ACSqq4uvi/8AIiqrhf8AIFVVf/8AIFVVf/8AG4AAev8AFqqrdQjo6QX//9qqq/8AIVVV///Vqqr/ABcqq///0KqrmP//0KqrmP//zVVV/wAGgABVi///yVVVi///zdVW///3Kqv//9JVVf//7lVV///SVVX//+5VVf//2Kqr///m1VZq///fVVVq///fVVX//+Yqq///2IAA///tVVX//9Gqq///7VVV///Rqqv///aqq///zIAAi///x1VVCIv//8iqq/8ACVVV///Nqqr/ABKqq///0qqr/wASqqv//9Kqq/8AGdVV///ZKqqs///fqqus///fqqv/ACdVVXL/AC2qq///7lVV/wAtqqv//+5VVf8AMiqq///3Kqv/ADaqq4v3AIv/AGGqq/8AF1VV/wBXVVX/AC6qqwgL/Vj3EvfM99/7zPcS+Vj7Evuu+9/3rgcL/Vj3EvlYBwv4lPsS/G8Hi///1VVV///5gAD//96AAH7//+eqq37//+eqq///54AA///z1VVni3WL///tgACSfJl8mf//9oAA/wASqquH/wAXVVUI+wpvBf8AC1VV///HVVX/ABeAAP//1qqr/wAjqqtx/wAjqqtx/wAt1VV+w4v/ACNVVYuq/wAF1VX/ABqqq/8AC6qr/wAaqqv/AAuqq/8AFiqq/wAPqqr/ABGqq/8AE6qr/wARqqv/ABOqq/8ADVVV/wAW1VWUpZSl/wAEgACmi6cIC/1Y9xL38JIH98f78PdFi/v1+BH33/fb+z6L+7n7wIWLi/fABQv9WPg/9wb7wfjmBwv9WPcM+OCNB/dr/ODji/dr+OCNi4v84PcMi4v5WPtSi/tT/IT7UfiEBQv9WPcS+LONB/fy/LP3NIuL+Vj7EouL/KKJi/vr+KIFC4v//8iqq/8ACVVV///Nqqr/ABKqq///0qqr/wASqqv//9Kqq/8AGdVV///ZKqqs///fqqus///fqqv/ACdVVXL/AC2qq///7lVV/wAtqqv//+5VVf8AMiqq///3Kqv/ADaqq4v/ADdVVf8AAKqr/wAyqqv/AAmAALn/ABJVVbn/ABJVVf8AJ6qr/wAZgAD/ACFVVf8AIKqrCP8AIVVV/wAgqqulsv8AEqqr/wAtVVX/ABKqq/8ALVVV/wAJVVX/ADJVVov/ADdVVYv/ADiqq///9qqr/wAzVVX//+1VVbn//+1VVblx/wAnVVX//96qq/8AIKqr///eqqv/ACCqq///2FVV/wAY1VVdnF2c///NVVX/AAgqq///yKqr////VVUI///JVVWL///N1Vb///cqq///0lVV///uVVX//9JVVf//7lVV///Yqqv//+bVVmr//99VVWr//99VVf//5iqr///YgAD//+1VVf//0aqr///tVVX//9Gqq///9qqr///MgACL///HVVUIC4v/ACNVVf8ABdVVrP8AC6qr/wAeqqv/AAuqq/8AHqqr/wAQgAD/ABrVVf8AFVVVov8AFVVVov8AGYAAnf8AHaqrmP8AHaqrmP8AISqq/wAGgAD/ACSqq4v/ACSqq4v/ACFVVf//+YAAqX6pfv8AGaqref8AFVVVdAj/ABVVVXT/ABCAAP//5Sqr/wALqqv//+FVVf8AC6qr///hVVX/AAXVVWqL///cqquLZf//+iqraP//9FVVa///9FVVa///74AA///kVVX//+qqq///6Kqr///qqqv//+iqq///5lVV///tqqpt///yqqtt///yqqv//96qq///+VVV///bVVWLCP//21VVi///3tVW/wAGqqv//+JVVf8ADVVV///iVVX/AA1VVf//5oAA/wASVVb//+qqq/8AF1VV///qqqv/ABdVVf//74AA/wAbqqv///RVVav///RVVav///oqq66LsQgL/Vj3Eve55Qf/ACVVVYv/ACPVVv8AAqqr/wAiVVX/AAVVVf8AIlVV/wAFVVX/AB4qq/8ACiqrpZqlmv8AFKqr/wAVKqv/AA9VVf8AG1VV/wAPVVX/ABtVVf8AB6qrr4v/ACyqq4v/ACdVVf//+NVV/wAg1Vb///Gqq/8AGlVV///xqqv/ABpVVf//7NVVoHP/AA+qqwhz/wAPqqv//+Qqq/8ACyqq///gVVX/AAaqq///4FVV/wAGqqv//98qq/8AA1VVaYsICz/3W+UG/wAQqquL/wARVVWKnYmdif8AEFVV///7gAD/AA6qq4T/AA6qq4SXgf8ACVVVfv8ACVVVfv8ABKqr///ugACLdYtz///61VX//+1VVf//9aqr///yqqv///Wqq///8qqr///yqqqB///vqqv///lVVQj//++qq///+VVV///uKqqH///sqqv///6qq///7Kqr///+qqv//+1VVf///1VVeYsIC/1Y9xL3wOcH9zj7wPcsi/tQ980F/wA0qqv/AAdVVf8AKIAAoP8AHFVV/wAiqqv/ABxVVf8AIqqr/wAOKqu2i/8AM1VVi7P///iqq6z///FVVaX///FVVaX//+xVVv8AFKqr///nVVX/AA9VVf//51VV/wAPVVX//+PVVv8ACtVW///gVVX/AAZVVf//4FVV/wAGVVX//98qq/8AAyqraYsICyn3VPcBBpuL/wAQgACKnImcif8AD4AA///71VWZ///5qquZ///5qqv/AAtVVf//9oAA/wAIqqv///NVVf8ACKqr///zVVX/AARVVf//71VWi///61VVi///6Kqr///7VVX//+3VVf//9qqrfv//9qqrfv//89VV///2VVV8///5qqsIfP//+aqr///vgACHef///lVVef///lVVef///yqreYsIC+fsBW+l///ggAD/ABKqq2j/AAtVVWj/AAtVVf//29VV/wAFqqv//9qqq4v//99VVYtr///7qqv//+Cqq///91VV///gqqv///dVVf//5Cqq///y1Vb//+eqq///7lVV///nqqv//+5VVf//7FVV///p1VZ8///lVVV8///lVVX///iAAP//4FVWi///21VVCIth/wAIVVX//96AAP8AEKqrcv8AEKqrcv8AFKqqd/8AGKqrfP8AGKqrfKb///Qqq/8AHVVV///3VVX/AB1VVf//91VVpv//9tVW/wAYqqv///ZVVf8AGKqr///2VVX/ABSqqv//9Cqr/wAQqqt9/wAQqqt9/wAIVVV3i3EIi3v///xVVf//8dVV///4qqv///Oqq///+Kqr///zqqv///ZVVf//9dVVf4N/g///8qqrhf//8VVVh///8VVVh///8VVWif//8VVVi2+L///lgAD/AAaAAHKYcpj//+vVVf8AEiqr///wqqv/ABdVVQgsLwX/AB1VVf//3VVVrv//51VW/wAoqqv///FVVf8AKKqr///xVVX/ACpVVf//+Kqrt4v/ACKqq4us/wAEqqv/AB9VVf8ACVVV/wAfVVX/AAlVVf8AG4AAmf8AF6qr/wASqqv/ABeqq/8AEqqr/wAS1VX/ABeAAJn/ABxVVZn/ABxVVZL/ACEqq4uxCIu1///3qqv/ACGqq///71VV/wAZVVX//+9VVf8AGVVV///rVVb/ABRVVv//51VV/wAPVVX//+dVVf8AD1VVcJf//+Kqq/8ACKqr///iqqv/AAiqq3CU///nVVX/AAlVVf//51VV/wAJVVX//+tVVpb//+9VVf8ADKqr///vVVX/AAyqq///96qr/wASVVWLowiLm/8AA1VV/wAN1VX/AAaqq/8AC6qr/wAGqqv/AAuqq/8ACNVV/wAJgACW/wAHVVWW/wAHVVX/AAxVVf8ABVVW/wANqqv/AANVVf8ADaqr/wADVVX/AA4qqv8AAaqr/wAOqquL/wAYqquL/wAXgAD///uAAP8AFlVVgv8AFlVVgv8AEdVW///x1VX/AA1VVf//7KqrCAv85vcS+Ob3bfcG/MT7BgcL+FT7EvxQB4v//+6qq////VVV///t1VX///qqq3j///qqq3j///cqqv//7oAA///zqqt7///zqqt7///vqqr///LVVf//66qr///1qqv//+uqq///9aqr///m1VX///rVVW2LbYv//+bVVf8ABSqr///rqqv/AApVVf//66qr/wAKVVX//++qqv8ADSqr///zqqubCP//86qrm///9yqq/wARgAD///qqq57///qqq57///1VVf8AEiqri/8AEVVVCPhQ+xL8VAeL///VVVX/AAcqq///2YAA/wAOVVX//92qq/8ADlVV///dqquf///i1VX/ABmqq3P/ABmqq3P/AB4qqv//7YAA/wAiqqt+/wAiqqt+/wAlqqr///mAAP8AKKqri/8AKKqri/8AJaqq/wAGgAD/ACKqq5j/ACKqq5ip/wASgAD/ABlVVaMI/wAZVVWjn/8AHSqr/wAOqqv/ACJVVf8ADqqr/wAiVVX/AAdVVf8AJoAAi/8AKqqrCAv3qv1Y9wGL97L5WPsci/tb/Kv7VfirBQv3Zf1Y9wiL9zj4r42L9zj8r/cMi/di+Vj7FIv7H/ySiYv7MPiS+xCL+zP8komL+xn4kgUL+5D8Bvcsi/dO97/3T/u/9zSL+5X4Bvd89+b7LYv7Ofua+zv3mvsziwUL+8P3EvfDB/ee+Cn7Kov7RPuu+0L3rvsyiwUL+wb4sfcG/BcH+BH4dIv3Bvyli4v7BvgIiwULKPck+xyL9yH7JAULSfcA96gHi/8AC1VV////qqv/AA0qq////1VVmv///1VVmv///dVW/wAPgAD///xVVZv///xVVZuF/wAP1VX///eqq/8AD6qr///3qqv/AA+qq///9Cqq/wAN1VX///Cqq5f///Cqq5f//+yqqv8ACdVV///oqqv/AAeqq///6Kqr/wAHqqv//+NVVf8AA9VVaYsIZYv//9sqq4X//9xVVX///9xVVX///+DVVv//7FVV///lVVX//+SqqwjKTAWb/wAPVVWe/wAMKquhlKGU/wAXqqv/AASAAP8AGVVVi6uL/wAaVVX///iAAP8AFKqrfP8AFKqrfP8AClVV///pgACLbQh+bQd3i///6qqr////gAD//+lVVYr//+lVVYr//+mAAP///aqr///pqqv///xVVf//6aqr///8VVX//+qAAP//+oAA///rVVX///iqq///61VV///4qqv//+3VVv//9iqq///wVVX///Oqq///8FVV///zqqv///OAAP//8Kqq///2qqv//+2qq///9qqr///tqqv///tVVf//6dVVi3EIi3OQdpV5lXn/AA0qq3z/ABBVVX//ABBVVX//ABKqq4KghaCF/wAVgACIoYuri/8AHVVV/wAGKqv/ABqqq/8ADFVV/wAaqqv/AAxVVaH/ABPVVv8AEVVV/wAbVVUIC3AHi2n///Yqq///5Sqr///sVVX//+xVVf//7FVV///sVVX//+GAAP//9iqr///WqquLgYuB/wABKquB/wACVVWB/wACVVWC/wAD1VaD/wAFVVWD/wAFVVX///mAAP8ABoAAhv8AB6qrhv8AB6qr///9gAD/AAmAAIv/AAtVVQiL/wARVVX/AAZVVf8ADYAA/wAMqqv/AAmqq/8ADKqr/wAJqqv/AA+AAP8AB1VV/wASVVWQ/wASVVWQ/wATgAD/AAMqq/8AFKqr/wABVVX/ABSqq/8AAVVV/wASqqr/AACqq/8AEKqriwgL/Yj3BtONB/8AEVVV///iqqv/ABdVVv//6qqq/wAdVVX///Kqq/8AHVVV///yqqv/AB+qq///+VVVrYv/ACSqq4us/wAGgAD/AB1VVZj/AB1VVZik/wAR1VX/ABSqq/8AFqqr/wAUqqv/ABaqq/8AD6qq/wAaqqr/AAqqq/8AHqqr/wAKqqv/AB6qq/8ABVVVrIv/ACNVVQiL/wAjVVX///pVVaz///Sqq/8AHqqr///0qqv/AB6qq///8Cqq/wAaqqr//+uqq/8AFqqr///rqqv/ABaqq///54AA/wAR1VX//+NVVZj//+NVVZj//+Cqq/8ABoAAaYv//+lVVYt3///9qqv//+6qq///+1VV///uqqv///tVVf//8Kqqhf//8qqr///4qqsI///yqqv///iqq///9Kqq///4Kqr///aqq///96qr///2qqv///eqq///+FVV///31VWFgwiI9+UGC4v//+1VVf///NVVef//+aqr///uqqv///mqq///7qqr///2qqr///Cqqv//86qr///yqqv///Oqq///8qqr///xKqr///VVVf//7qqrg///7qqrg///7FVVh3WLdYv//+xVVY///+6qq5P//+6qq5P///Eqqv8ACqqr///zqqv/AA1VVQj///Oqq/8ADVVV///2qqr/AA9VVv//+aqr/wARVVX///mqq/8AEVVV///81VWdi/8AEqqri/8AEqqr/wADKqud/wAGVVX/ABFVVf8ABlVV/wARVVX/AAlVVv8AD1VW/wAMVVX/AA1VVf8ADFVV/wANVVX/AA7VVv8ACqqr/wARVVWT/wARVVWT/wATqquPoYsIoYv/ABOqq4f/ABFVVYP/ABFVVYP/AA7VVv//9VVV/wAMVVX///Kqq/8ADFVV///yqqv/AAlVVv//8Kqq/wAGVVX//+6qq/8ABlVV///uqqv/AAMqq3mL///tVVUIC97eBf//6Kqr/wAZVVX//+TVVf8AEoAAbP8AC6qrbP8AC6qr///hKqv/AAXVVf//4VVVi2eLaYVrf2t////kVVV6///oqqt1///oqqt1///tgAD//+WAAP//8lVVbP//8lVVbP//+Sqr///dgACLZQiLZf8ABtVV///dgAD/AA2qq2z/AA2qq2z/ABKAAP//5YAA/wAXVVV1/wAXVVV1/wAbqqt6q3+rf62Fr4v/AAqqq4v/AAyqqv8AASqr/wAOqqv/AAJVVf8ADqqr/wACVVX/AA9VVf8AA9VWm/8ABVVVCJv/AAVVVf8AD9VVkv8AD6qr/wAIqqv/AA+qq/8ACKqr/wAN1VX/AApVVZeXCDvhBf//9Kqr///xVVX///JVVf//9NVWe///+FVVe///+FVV///uqqv///wqq///7VVVi3WL///sVVWP///uqquT///uqquT///xKqr/AAqqq///86qr/wANVVX///Oqq/8ADVVV///2qqr/AA9VVv//+aqr/wARVVX///mqq/8AEVVV///81VWdi/8AEqqrCIv/ABKqq/8AAyqrnf8ABlVV/wARVVX/AAZVVf8AEVVV/wAJVVb/AA9VVv8ADFVV/wANVVX/AAxVVf8ADVVV/wAO1Vb/AAqqq/8AEVVVk/8AEVVVk/8AE6qrj6GLm4v/AA+qq///+6qr/wAPVVX///dVVf8AD1VV///3VVX/AA6qq///9FVWmf//8VVVCAtD9wb5iPsM++WIB4WT///4VVX/AAgqq///9qqr/wAIVVX///aqq/8ACFVV///0qqr/AAfVVv//8qqr/wAHVVX///Kqq/8AB1VV///wqqqR///uqqv/AASqq///7qqr/wAEqqt3/wACVVX//+lVVYtpi///4Kqr///5gAD//+NVVX7//+NVVX7//+eAAP//7iqr///rqqv//+lVVQj//+uqq///6VVV///wKqr//+VVVv//9Kqr///hVVX///Sqq///4VVV///6VVVqi///3Kqri///3Kqr/wAFVVVq/wAKqqv//+FVVf8ACqqr///hVVX/AA+qqv//5VVW/wAUqqv//+lVVf8AFKqr///pVVX/ABjVVf//7iqrqH6ofv8AISqr///5gAD/ACVVVYsIrYv/AB+qq/8ABqqr/wAdVVX/AA1VVf8AHVVV/wANVVX/ABdVVv8AFVVW/wARVVX/AB1VVQgLi/8AEqqr/wADKqud/wAGVVX/ABFVVf8ABlVV/wARVVX/AAlVVv8AD1VW/wAMVVX/AA1VVf8ADFVV/wANVVX/AA7VVv8ACqqr/wARVVWT/wARVVWT/wATqquPoYuhi/8AE6qrh/8AEVVVg/8AEVVVg/8ADtVW///1VVX/AAxVVf//8qqrCP8ADFVV///yqqv/AAlVVv//8Kqq/wAGVVX//+6qq/8ABlVV///uqqv/AAMqq3mL///tVVWL///tVVX///zVVXn///mqq///7qqr///5qqv//+6qq///9qqq///wqqr///Oqq///8qqr///zqqv///Kqq///8Sqq///1VVX//+6qq4P//+6qq4P//+xVVYd1iwh1i///7FVVj///7qqrk///7qqrk///8Sqq/wAKqqv///Oqq/8ADVVV///zqqv/AA1VVf//9qqq/wAPVVb///mqq/8AEVVV///5qqv/ABFVVf///NVVnYv/ABKqqwgL+AKsBou1///6gAD/ACUqq4D/ACBVVYD/ACBVVf//8Kqr/wAbKqv//+xVVaH//+xVVaH//+hVVv8AENVV///kVVX/AAuqq///5FVV/wALqqv//+GAAP8ABdVV///eqquLZ4tphWt/a3///+RVVXr//+iqq3UI///oqqt1///tgAD//+WAAP//8lVVbP//8lVVbP//+Sqr///dgACLZYtl/wAG1VX//92AAP8ADaqrbP8ADaqrbP8AEoAA///lgAD/ABdVVXX/ABdVVXX/ABuqq3qrf6t/rYWviwixi/8AJFVV/wAHVVX/ACKqq/8ADqqr/wAiqqv/AA6qq/8AH1VV/wAYqqqn/wAiqqsINcwF///wqqv//+1VVf//7iqq///wgAD//+uqq///86qr///rqqv///Oqq///5tVV///51VVti2mLbpVzn3OffaeHrwgL+4oG/wAEqqv/ACKqq/8ADNVV/wAbqqqg/wAUqqug/wAUqqv/AByAAP8AClVVr4uxi/8AHaqr///11VX/ABVVVf//66qr/wAVVVX//+uqq5b//+Qqqv8AAKqr///cqqsIC/wO9wz4DvcD8fsD4geL/wANVVX/AADVVf8ADKqr/wABqquX/wABqquX/wADqqr/AAqAAP8ABaqrlP8ABaqrlP8AB9VV/wAHKquV/wAFVVWV/wAFVVX/AA1VVf8AAqqr/wAQqquL/wAIqquL/wAIVVX///9VVZP///6qq5P///6qq/8ACFVV///+VVX/AAiqq4kIk/EF///oqqv/AASqq///5qqq/wACVVX//+Sqq4v//9qqq4v//+Gqqv//+tVV///oqqv///Wqq///6Kqr///1qqv//+3VVf//8Sqqfv//7Kqrfv//7Kqr///3Kqv//+jVVf//+1VVcP//+1VVcP///aqr///h1VWL///eqqsIRyglBwv7BkOJBv//7qqr/wAdVVX//+iqqv8AFVVW///iqqv/AA1VVf//4qqr/wANVVX//+BVVf8ABqqraYv//9qqq4v//97VVf//+YAAbn5ufv//5yqr///uKqv//+tVVf//6VVV///rVVX//+lVVf//8FVW///lVVb///VVVf//4VVV///1VVX//+FVVf//+qqraov//9yqqwiLaf8ABaqra/8AC1VVbf8AC1VVbf8AECqrcaB1oHX/ABkqq///7oAA/wAdVVV+/wAdVVV+/wAgqqv///mAAK+LqYv/AB1VVf8ABdVV/wAcqqv/AAuqq/8AHKqr/wALqqui/wARgAD/ABFVVf8AF1VVCI1oBotz///9gAD//+oqq4b//+xVVYb//+xVVf//96qr///vKqv///RVVX3///RVVX3///BVVoD//+xVVYP//+xVVYP//+fVVof//+NVVYtpi22RcZdxl3Kcc6EIQykFrW2w///rVVWz///0qquz///0qqv/ACpVVf//+lVV/wAsqquL/wAuqquL/wAoVVX/AAaqq63/AA1VVa3/AA1VVf8AHCqr/wAS1Vb/ABZVVf8AGFVV/wAWVVX/ABhVVf8AEIAA/wAdqqv/AAqqq67/AAqqq67/AAVVVf8AJyqri/8AK1VVCAu3i/8AIqqrfv8AGVVVcf8AGVVVcf8ADKqraYthi3f///yqq///7VVV///5VVX//+6qq///+VVV///uqqv///aAAP//8Sqq///zqqv///Oqq///86qr///zqqt8///2Kqr//+5VVf//+Kqr///uVVX///iqq///7Cqr///8VVV1iwh3i///7VVV/wADqqv//+6qq/8AB1VV///uqqv/AAdVVXyV///zVVX/AAyqq///81VV/wAMqqv///Yqq/8ADqqqhP8AEKqrhP8AEKqr///8gACdi/8AE1VVi/8AFVVV/wADgAD/ABOAAJL/ABGqq5L/ABGqq/8ACaqrmv8ADFVV/wAMVVUI/wAMVVX/AAxVVf8ADtVW/wAJqqv/ABFVVZL/ABFVVZL/ABNVVv8AA4AA/wAVVVWLCAv36/sM/Yj3DPeaB4ubjf8AD1VVj/8ADqqrj/8ADqqr/wAGgACYlP8AC1VVlP8AC1VV/wALVVWU/wANqqv/AAaqq/8ADaqr/wAGqqv/ABDVVf8AA1VVn4v/ABSqq4v/ABBVVf//+yqrl///9lVVl///9lVV/wAI1VV//wAFqqv///Gqqwj/AAWqq///8aqr/wADgAD///Cqqv8AAVVV///vqqv/AAFVVf//76qr/wAAqqv///Eqqov///Kqqwj7h/cM98MHi/8AGKqriP8AF6qqhf8AFqqrhf8AFqqrgZ99/wARVVV9/wARVVX//+3VVZn//+mqq/8ACqqr///pqqv/AAqqq///5NVV/wAFVVVri///2qqri///4YAA///31VX//+hVVf//76qr///oVVX//++qq///74AA///t1VX///aqq3cIC/x09wz4dAcLi///7Kqr/wAHKqv//+8qqv8ADlVV///xqqv/AA5VVf//8aqr/wASKqv///jVVaGLoYv/ABKAAP8ABtVVmv8ADaqrmv8ADaqr/wAHgAD/ABEqqov/ABSqq4v/ABSqq///+IAA/wARKqp8/wANqqt8/wANqqv//+2AAP8ABtVVdYsIdYv//+3VVf//+NVV///xqqv///Gqq///8aqr///xqqv///jVVf//7yqqi///7KqrCAv7DPySBov///Sqq////6qr///0VVX///9VVX////9VVX////3VVoD///xVVYH///xVVYGF///31VX///eqq///+aqr///3qqv///mqq///9IAA///81VX///FVVYv///lVVYv///mqq/8AAIAAhYyFjP//+aqr/wABKqv///lVVf8AAVVVCIIjBf8ACqqr///8qqv/AAqqqv///aqq/wAKqqv///6qq/8ACqqr///+qquW////VVX/AAtVVYuti/8AG6qr/wAFVVX/ABVVVf8ACqqr/wAVVVX/AAqqq/8AEIAA/wAO1VX/AAuqq57/AAuqq57/AAfVVf8AFlVVj/8AGaqrj/8AGaqrjf8AG9VVi6kIC/2I9wz3iY0H91P7ifczi/tv95r3Yvdu+y6L+037W4v4bwUL/Yj3DPmIBwv8dPcM95oHi5uN/wAPVVWP/wAOqquP/wAOqqv/AAaAAJiU/wALVVWU/wALVVX/AAtVVZT/AA2qq/8ABqqr/wANqqv/AAaqq/8AENVV/wADVVWfi/8AHVVVi6D///cqq/8ADKqr///uVVX/AAyqq///7lVV/wAGVVX//+gqq4ttCPuy9wz3mAeL/wAPVVX/AAHVVf8ADyqr/wADqqua/wADqquakf8ADVVV/wAIVVX/AAuqq/8ACFVV/wALqqv/AAqqq/8ACVVVmJKYkv8AD9VV/wADgAD/ABKqq4udi/8ADqqriP8AC1VVhf8AC1VVhZT///fVVf8ABqqr///1qqsI/wAGqqv///Wqq/8ABKqqf/8AAqqr///yVVX/AAKqq///8lVV/wABVVX///HVVov///FVVQj7pPcM97IHi/8AHKqriP8AGtVVhaSFpP//9iqr/wAV1VX///JVVf8AEqqr///yVVX/ABKqq///7iqr/wAOqqp1/wAKqqt1/wAKqqtw/wAFVVVri2eLbP//+NVVcf//8aqrcf//8aqr///qVVX//+mAAP//7qqr///hVVUI///nVVX/ADtVVVn/AB2qq///tKqri2OL///gKqv///cqq///6FVV///uVVX//+hVVf//7lVV///u1Vb//+vVVv//9VVV///pVVUIidYGC/x09wz3mgeLm43/AA9VVY//AA6qq4//AA6qq/8ABoAAmJT/AAtVVZT/AAtVVf8AC1VVlP8ADaqr/wAGqqv/AA2qq/8ABqqr/wAQ1VX/AANVVZ+L/wAUqquL/wAQVVX///sqq5f///ZVVZf///ZVVf8ACNVVf/8ABaqr///xqqsI/wAFqqv///Gqq/8AA4AA///wqqr/AAFVVf//76qr/wABVVX//++qq/8AAKqr///xKqqL///yqqsI+4f3DPfDB4v/ABiqq4j/ABeqqoX/ABaqq4X/ABaqq4Gfff8AEVVVff8AEVVV///t1VWZ///pqqv/AAqqq///6aqr/wAKqqv//+TVVf8ABVVVa4tji///4FVV///3Kqv//+iqq///7lVV///oqqv//+5VVf//7qqq///rKqv///Sqq3MIidgGC4tl/wAG1VX//92AAP8ADaqrbP8ADaqrbP8AEoAA///lgAD/ABdVVXX/ABdVVXX/ABuqq3qrf6t/rYWvi6+LrZGrl6uX/wAbqquc/wAXVVWhCP8AF1VVof8AEoAA/wAagAD/AA2qq6r/AA2qq6r/AAbVVf8AIoAAi7GLsf//+Sqr/wAigAD///JVVar///JVVar//+2AAP8AGoAA///oqquh///oqquh///kVVWca5drl2mRZ4sIZ4tphWt/a3///+RVVXr//+iqq3X//+iqq3X//+2AAP//5YAA///yVVVs///yVVVs///5Kqv//92AAItlCAv9WPcM97WOB5GD/wAHqqv///fVVf8ACVVV///3qqv/AAlVVf//96qr/wALVVb///gqqv8ADVVV///4qqv/AA1VVf//+Kqr/wAPVVaF/wARVVX///tVVf8AEVVV///7VVWf///9qqv/ABaqq4uti/8AH1VV/wAGgAD/AByqq5j/AByqq5j/ABiAAP8AEdVV/wAUVVX/ABaqqwj/ABRVVf8AFqqr/wAP1Vb/ABqqqv8AC1VV/wAeqqv/AAtVVf8AHqqr/wAFqqusi/8AI1VVi/8AI1VV///6qqus///1VVX/AB6qq///9VVV/wAeqqv///BVVv8AGqqq///rVVX/ABaqq///61VV/wAWqqty/wAR1VX//+Kqq5j//+Kqq5hq/wAGgAD//9tVVYsIaYv//+BVVf//+VVV///iqqv///Kqq///4qqr///yqqv//+iqqv//6qqq///uqqv//+KqqwiJ0wYL/HT3DPeVB4v/AAaqq/8AAYAAlY7/AA1VVY7/AA1VVZH/AA1VVpT/AA1VVZT/AA1VVZj/AAvVVpz/AApVVZz/AApVVf8AFoAA/wAFKquni/8ACVVVi/8ACYAA////Kqv/AAmqq////lVV/wAJqqv///5VVf8ACdVV///91VaV///9VVUI9wgH///4qquN///41VX/AAGqq4T/AAFVVYT/AAFVVf//+NVV/wAAqqv///iqq4tri///46qr///4VVX//+dVVf//8Kqr///nVVX///Cqq3j//+pVVf//8qqrbwiJ1wYL29MF///sqqv/ABqqq///5qqq/wAS1VX//+Cqq5b//+Cqq5b//+BVVf8ABYAAa4tzi///6FVViP//6Kqrhf//6Kqrhf//61VV///2qqt5///zVVV5///zVVX///GAAP//79VWgP//7FVVgP//7FVV///6gAD//+jVVov//+VVVQiL///hVVX/AAZVVXP/AAyqq///7qqr/wAMqqv//+6qq5v///KAAP8AE1VV///2VVX/ABNVVf//9lVV/wAU1VaE/wAWVVX///uqq/8AFlVV///7qqv/ABTVVv//+1VV/wATVVWG/wATVVWGm///+YAA/wAMqquD/wAMqquD/wAGVVX///Oqq4v//+9VVQiL///2qqv///2AAP//99VVhoSGhP//+YAA///6KquD///7VVWD///7VVX///dVVf///Kqr///2qquJ///2qquJgor///dVVYv//+aqq4v//+qAAP8ABYAA///uVVWW///uVVWW///vgAD/AA4qq///8Kqr/wARVVUIO0AF/wAYqqtvp///7Kqr/wAfVVX///VVVf8AH1VV///1VVX/ACJVVv//+qqr/wAlVVWL/wAYqquL/wAYqqr/AAKqq/8AGKqr/wAFVVX/ABiqq/8ABVVV/wAWKqr/AAiqq/8AE6qrl/8AE6qrl5v/AA/VVf8ADFVV/wATqqv/AAxVVf8AE6qr/wAGKqv/ABgqqov/AByqqwiL/wAfVVX///mqq/8AGKqr///zVVWd///zVVWde/8ADiqr///sqqv/AApVVf//7Kqr/wAKVVX//+sqqv8AB6qr///pqquQ///pqquQ///rKqr/AATVVf//7Kqr/wAEqqv//+yqq/8ABKqre/8ABaqq///zVVX/AAaqq///81VV/wAGqqv///mqq/8ACqqqi/8ADqqrCIud/wAHqquY/wAPVVWT/wAPVVWT/wAPqquPm4v/ACdVVYv/AB9VVv//76qr/wAXVVX//99VVQgL7vtwBotv/wACKqv//+dVVf8ABFVV///qqqv/AARVVf//6qqrk///7iqq/wALqqv///Gqq/8AC6qr///xqqub///1VVX/ABRVVYT/ABRVVYT/ABoqq////IAAq4uZi/8AECqr/wABKqv/ABJVVf8AAlVV/wASVVX/AAJVVf8AD4AA/wAEKqv/AAyqq5EI8Af///iqq///+qqrgf///Cqq///zVVX///2qq///81VV///9qqv///RVVv///tVV///1VVWL///lVVWL///uKquSgpmCmf//+4AAnoujCPdm9xjx+xj3H/sM+x8oBwv4dPsM+5oHi3uJ///wqquH///xVVWH///xVVX///mAAH6C///0qquC///0qqv///Sqq4L///JVVf//+VVV///yVVX///lVVf//7yqr///8qqt3i///6qqri///74AA/wAE1VX///RVVf8ACaqr///0VVX/AAmqq///91VWl///+lVV/wAOVVUI///6VVX/AA5VVf///IAA/wAPVVb///6qq/8AEFVV///+qqv/ABBVVf///1VV/wAO1VaL/wANVVUI94f7DPvDB4v//+dVVY7//+hVVpH//+lVVZH//+lVVZX//+vVVpn//+5VVZn//+5VVf8AEiqrff8AFlVV///1qqv/ABZVVf//9aqr/wAbKqv///rVVauLs4v/AB+qq/8ACNVV/wAXVVX/ABGqq/8AF1VV/wARqqv/ABFVVv8AFNVV/wALVVWjCI0+Bgv3WPx09xSL91H4dPsPi/sV++SJi/sU9+QFC/c7/HT3EIvw99yNi/cG+9z3C4v3N/h0+w2LJ/vkiYsj9+T7Fosq++SJiyP35AUL+1X7lvcii/cS90D3EftA9yaL+1X3lvc493L7HYsj+yQr9yT7JosFC/dh/Hh0UgX///qqq///81VVhv//9Sqr///7VVWC///7VVWC///6Kqv///iqq4T///pVVYT///pVVf//94AA///71VaB///9VVWB///9VVX///Oqq////qqr///xVVWL///1VVWL///1gAD/AAEqq///9aqr/wACVVX///Wqq/8AAlVV///2Kqr/AALVVv//9qqr/wADVVUIfPsABamD/wAeqquH/wAfVVWL/wAaqquL/wAW1VX/AALVVZ7/AAWqq57/AAWqq/8AEIAA/wAIqqqZ/wALqquZ/wALqqv/AAwqq/8ADlVV/wAKVVWc/wAKVVWc/wAJgAD/ABPVVf8ACKqr/wAWqqsI93f42/sRi/sM++GJi/sa9+EFC/sD+DLr+6QH95j3p4v3Afwai4sr94mLi4kFC4v/AAqqq////dVVlf//+6qr/wAJVVX///uqq/8ACVVV///6KqqT///4qqv/AAaqq///+Kqr/wAGqqv///eAAP8ABVVV///2VVWP///2VVWP///11VaN///1VVWLdYv//+0qq///+FVV///wVVX///Cqq///8FVV///wqqv///gqq///7aqqi///6qqrCIv//+qqq5N5m///8VVVm///8VVV/wASqqv///iqq/8AFVVVi6GL/wAS1VX/AAeqq/8AD6qr/wAPVVX/AA+qq/8AD1VV/wAH1VX/ABJVVov/ABVVVQgLi///zKqr/wAJ1VX//8/VVf8AE6qrXv8AE6qrXv8AGqqq///Yqqv/ACGqq///3lVV/wAhqqv//95VVf8AJ1VV///lVVa4///sVVW4///sVVX/ADAqq///9iqr/wAzVVWL/wAzVVWL/wAwKqv/AAnVVbj/ABOqq7j/ABOqq/8AJ1VV/wAaqqr/ACGqq/8AIaqrCP8AIaqr/wAhqqv/ABqqqv8AJ1VV/wATqqu4/wATqqu4/wAJ1VX/ADAqq4v/ADNVVYv/ADNVVf//9iqr/wAwKqv//+xVVbj//+xVVbj//+VVVv8AJ1VV///eVVX/ACGqq///3lVV/wAhqqv//9iqq/8AGqqqXv8AE6qrXv8AE6qr///P1VX/AAnVVf//zKqriwj//8yqq4v//8/VVf//9iqrXv//7FVVXv//7FVV///Yqqv//+VVVv//3lVV///eVVX//95VVf//3lVV///lVVb//9iqq///7FVVXv//7FVVXv//9iqr///P1VWL///MqqsIC4uz/wAHKqv/ACWAAP8ADlVVrv8ADlVVrv8AE4AA/wAegAD/ABiqq6X/ABiqq6X/AB0qqv8AFIAA/wAhqqua/wAhqqua/wAkKqr/AAeAAP8AJqqri/8AJqqri/8AJCqq///4gAD/ACGqq3z/ACGqq3z/AB0qqv//64AA/wAYqqtxCP8AGKqrcf8AE4AA///hgAD/AA5VVWj/AA5VVWj/AAcqq///2oAAi2OLY///+NVV///agAD///Gqq2j///Gqq2j//+yAAP//4YAA///nVVVx///nVVVx///i1Vb//+uAAP//3lVVfP//3lVVfP//29VW///4gAD//9lVVYsI///ZVVWL///b1Vb/AAeAAP//3lVVmv//3lVVmv//4tVW/wAUgAD//+dVVaX//+dVVaX//+yAAP8AHoAA///xqquu///xqquu///41VX/ACWAAIuzCAv3B/dBQL77LPt09yz7dte+BQvZ+9Q9BwuLdf8ABCqr///rVVX/AAhVVf//7Kqr/wAIVVX//+yqq/8AC4AAev8ADqqr///xVVX/AA6qq///8VVVnP//9IAA/wATVVX///eqq/8AE1VV///3qqv/ABSqq///+9VVoYuhi/8AFKqr/wAEKqv/ABNVVf8ACFVV/wATVVX/AAhVVZz/AAuAAP8ADqqr/wAOqqsI/wAOqqv/AA6qq/8AC4AAnP8ACFVV/wATVVX/AAhVVf8AE1VV/wAEKqv/ABSqq4uhi6H///vVVf8AFKqr///3qqv/ABNVVf//96qr/wATVVX///SAAJz///FVVf8ADqqr///xVVX/AA6qq3r/AAuAAP//7Kqr/wAIVVX//+yqq/8ACFVV///rVVX/AAQqq3WLCHWL///rVVX///vVVf//7Kqr///3qqv//+yqq///96qrev//9IAA///xVVX///FVVf//8VVV///xVVX///SAAHr///eqq///7Kqr///3qqv//+yqq///+9VV///rVVWLdQgLi/8AFqqrk/8AE1VVm5ubm/8AE1VVk/8AFqqri/8AFqqri/8AE1VVg5t7m3uT///sqquL///pVVWL///pVVWD///sqqt7e3t7///sqquD///pVVWLCP//6VVVi///7Kqrk3ube5uD/wATVVWL/wAWqqsICzeiB/8ACqqri/8ACqqq////qqv/AAqqq////1VV/wAKqqv///9VVf8ACVVV///+KquTiJOI/wAGgAD///tVVZD///mqq5D///mqq/8AAoAA///3KqqL///0qquL///uqqv///nVVf//86qq///zqqv///iqq///86qr///4qqv///DVVf///FVVeYsIeYt9/wAEgACBlIGU///5VVX/AAwqq////Kqr/wAPVVUIJHUF/wAJVVX//9VVVf8AE4AA///hqqv/AB2qq3n/AB2qq3n/ACOAAIL/AClVVYv/ABaqq4v/ABVVVf8AAqqrn/8ABVVVn/8ABVVV/wARgACTmv8ACqqrmv8ACqqrl/8ADVVVlJuUm/8ABIAA/wASqquL/wAVVVUIi/8AGKqr///4gAChfP8AE1VVfP8AE1VV///qgAD/AAtVVm//AANVVQiNB/8AGVVV/wAEqqv/ABOAAP8ACtVV/wANqquc/wANqquc/wAG1VX/ABQqq4v/ABdVVYv/ABNVVf//+6qr/wAQ1Vb///dVVf8ADlVV///3VVX/AA5VVf//9IAA/wAL1Vb///Gqq/8ACVVV///xqqv/AAlVVf//74AAkv//7VVV/wAEqqv//+1VVf8ABKqr///sqqv/AAJVVXeLCP//7Kqri///7YAAif//7lVVh///7lVVh3v///mAAP//8aqrgv//8aqrgv//84AA///0VVX///VVVf//8aqr///1VVX///Gqq///+FVW///uKqr///tVVf//6qqrCPJ3Bf8AA1VVmf8AByqr/wAK1VWW/wAHqquW/wAHqqv/AA0qq/8AA9VV/wAPVVWLm4v/AAzVVf///Sqr/wAJqqv///pVVf8ACaqr///6VVX/AATVVf//99VWi///9VVVi///9qqrif//+FVVh4WHhf//+tVV///7VVX///mqq////KqrCP//+aqr///8qqv///iAAP///dVV///3VVWK///3VVWK///3VVb///+AAP//91VViwgLKPsk6Yv3IfckBQu1x1GLTTGmcgWRjZH/AAGqq5H/AAFVVZH/AAFVVf8ABlVV/wAAqqv/AAaqq4v/AAqqq4v/AAsqqv///VVV/wALqqv///qqq/8AC6qr///6qqv/AAXVVf//9qqqi///8qqri4OJ///5KquH///6VVWH///6VVX///sqq///+6qr///6VVWICP//+lVViP//+dVW///91VX///lVVf///qqr///5VVX///6qq4X///9VVf//+qqri///4qqri///5Kqq/wAGqqv//+aqq/8ADVVVCHVdBf8AIVVV///tVVX/ACNVVv//9qqr/wAlVVWL/wAOqquL/wAPqqr/AAGqq/8AEKqr/wADVVX/ABCqq/8AA1VVmv8ABVVW/wANVVX/AAdVVf8ADVVV/wAHVVX/AAsqq5WU/wAMqquU/wAMqqv/AASAAP8AD1VVi52L/wATVVX///yAAP8ADyqrhJYIhJb///aqq/8ACFVV///0VVX/AAWqq///9FVV/wAFqqt+/wADgAD///Gqq/8AAVVV///xqqv/AAFVVf//8YAA/wAAqqv///FVVYsIC/vR8fg9MAf7KvsJwkkFC/sH+0HWWPcs93T7LPd2P1gFC/cGi/sG9yT7G4v7B/sk9wSL0OUFC80G/wADVVX/AAtVVf8ABSqrlZL/AAiqq5L/AAiqq/8ACiqr/wAEVVX/AA1VVYuTi/8ACYAAiZaHlof/AAvVVf//+6qr/wAMqqv///tVVf8ADKqr///7VVX/AA0qqv//+6qr/wANqquH/wANqquH/wANgACJ/wANVVWLCP8AEqqri/8AD9VV/wADqquY/wAHVVWY/wAHVVX/AArVVf8ACYAA/wAIqqv/AAuqq/8ACKqr/wALqqv/AAbVVf8ADYAAkP8AD1VVkP8AD1VV/wAD1VX/AA+qq/8AAqqrmwhJBv///Kqr///0qqv///rVVf//9iqqhP//96qrhP//96qr///11VX///vVVf//8qqri4OL///2gACNgI+Aj///9Cqr/wAEKqv///NVVf8ABFVV///zVVX/AARVVf//8tVW/wAEKqv///JVVY////JVVY////KAAI3///Kqq4sI///tVVWL///wKqv///xVVX7///iqq37///iqq///9Sqr///2gAD///dVVf//9FVV///3VVX///RVVf//+Sqr///ygACG///wqquG///wqqv///wqq///8FVV///9VVV7CAuLqYH/ABiAAHeed55y/wAJgABti///8Kqri33///1VVf//81VV///6qqv///NVVf//+qqrgP//+NVV///2qquC///2qquC///4qqr///Uqq///+qqr///zVVX///qqq///81VV///9VVX///JVVov///FVVQiLbZX//+eqq5///+1VVZ///+1VVaT///aqq6mLqYuk/wAJgACfnp+elf8AGIAAi6kIC4t7///6VVV+///0qquB///0qquB///yqqqG///wqquL///wqquL///yqqr/AAUqq///9Kqr/wAKVVX///Sqq/8AClVV///6VVX/AAzVVov/AA9VVYv/AA9VVf8ABaqr/wAM1Vb/AAtVVf8AClVV/wALVVX/AApVVf8ADVVW/wAFKqv/AA9VVYsI/wAPVVWL/wANVVb///rVVf8AC1VV///1qqv/AAtVVf//9aqr/wAFqqv///Mqqov///CqqwgL+074PvcG+8D3VPei9wb7ovdC97T3BvyEB/xZ/Vj3LYv3BvdOBQv7Xov3T/fAmosFC+3TBf//3Kqr/wAoqqv//9nVVf8AHNVVYpxinP//04AA/wAIgABbi///yVVVi///zdVW///3Kqv//9JVVf//7lVV///SVVX//+5VVf//2Kqr///m1VZq///fVVVq///fVVX//+Yqq///2IAA///tVVX//9Gqq///7VVV///Rqqv///aqq///zIAAi///x1VVCIv//81VVf8AB9VV///RgAD/AA+qq///1aqr/wAPqqv//9Wqq6Fm/wAcVVX//+BVVf8AHFVV///gVVX/ACHVVv//5iqr/wAnVVV3/wAnVVV3/wArqqv///NVVbv///qqqwhYQKZyBZGNkf8AAaqrkf8AAVVVkf8AAVVV/wAGVVX/AACqq/8ABqqri/8ACqqri/8ACyqq///9VVX/AAuqq///+qqr/wALqqv///qqq/8ABdVV///2qqqL///yqquLg4n///kqq4f///pVVYf///pVVf//+yqr///7qqv///pVVYgI///6VVWI///51Vb///3VVf//+VVV///+qqv///lVVf///qqrhf///1VV///6qquL///iqquL///kqqr/AAaqq///5qqr/wANVVUIdV0F/wAhVVX//+1VVf8AI1VW///2qqv/ACVVVYv/AA6qq4v/AA+qqv8AAaqr/wAQqqv/AANVVf8AEKqr/wADVVWa/wAFVVb/AA1VVf8AB1VV/wANVVX/AAdVVf8ACyqrlZT/AAyqq5T/AAyqq/8ABIAA/wAPVVWLnYv/ABNVVf///IAA/wAPKquElgiElv//9qqr/wAIVVX///RVVf8ABaqr///0VVX/AAWqq37/AAOAAP//8aqr/wABVVX///Gqq/8AAVVV///xgAD/AACqq///8VVViwiotQW//wAAqqv/ADBVVf8ACiqq/wAsqqv/ABOqq/8ALKqr/wATqqv/ACZVVf8AH9VVq7cII9UF///oqqtt///m1VX//+oqq3D///JVVXD///JVVf//5Cqr///5Kqv//+NVVYv//9tVVYv//97VVv8ABqqr///iVVX/AA1VVf//4lVV/wANVVX//+aAAP8AElVW///qqqv/ABdVVf//6qqr/wAXVVX//++AAP8AG6qr///0VVWr///0VVWr///6Kquui7EIi/8AI1VV/wAF1VWs/wALqqv/AB6qq/8AC6qr/wAeqqv/ABCAAP8AGtVV/wAVVVWi/wAVVVWi/wAZgACd/wAdqquY/wAdqquY/wAhKqr/AAaAAP8AJKqri/8AGKqri/8AGIAA///7VVX/ABhVVf//9qqr/wAYVVX///aqq/8AGSqr///tVVWlbwgL+9j3nAf/ACqqq4v/ACuAAP8AByqr/wAsVVX/AA5VVf8ALFVV/wAOVVX/AChVVv8AFaqr/wAkVVWo/wAkVVWo/wAdqqv/ACSqq6L/ACxVVaL/ACxVVf8AC4AA/wA0gACL/wA8qquLx4H/ADQqq3f/ACxVVXf/ACxVVf//5VVV/wAk1Vb//96qq/8AHVVVCP//3qqr/wAdVVX//9mqqv8AFdVW///Uqqv/AA5VVf//1Kqr/wAOVVVe/wAHKqv//9FVVYsI+6v7wEk3Bgst92b3bN/7bPdO9wcG/wAmqquL/wAjgAD///uAAP8AIFVVgv8AIFVVgqd9/wAXqqt4/wAXqqt4/wASgAD//+cqq/8ADVVV///hVVX/AA1VVf//4VVV/wAGqqv//9tVVov//9VVVYv//9Sqq///+IAA///bKqp8///hqqt8///hqqv//+uAAP//51VVcXgIcXj//+GAAH1ogmiC///a1VX///uAAP//2KqriwgL++j8BgX///FVVaH///Sqq/8AGKqrg/8AG1VVg/8AG1VVh/8AHVVWi/8AH1VVi/8AI1VV/wAF1VWs/wALqqv/AB6qq/8AC6qr/wAeqqv/ABCAAP8AGtVV/wAVVVWi/wAVVVWi/wAZgACd/wAdqquY/wAdqquY/wAhKqr/AAaAAP8AJKqriwjBi/8AL6qrfP8AKVVVbQgL9+r4CQWv///UqqudVYv//79VVYtl///6Kqto///0VVVr///0VVVr///vgAD//+RVVf//6qqr///oqqv//+qqq///6Kqr///mVVX//+2qqm3///Kqq23///Kqq///3qqr///5VVX//9tVVYtti///5FVV/wAEgAD//+aqq5QI///mqquUdP8ADNVV///rVVX/ABCqqwgLWrY0LQVr/wAVVVX//9zVVf8AEIAA///Zqqv/AAuqq///2aqr/wALqqv//9aAAP8ABSqq///TVVX///6qq///yVVVi///zdVW///3Kqv//9JVVf//7lVV///SVVX//+5VVf//2Kqr///m1VZq///fVVVq///fVVX//+Yqq///2IAA///tVVX//9Gqq///7VVV///Rqqv///aqq///zIAAi///x1VVCIv//81VVf8AB9VV///Rqqv/AA+qq2H/AA+qq2H/ABYqqmb/AByqq2sINC29YODnBf8AH1VV///oqqv/ACOqq///7dVVs36zfrb///mAALmL/wA3VVX/AACqq/8AMqqr/wAJgAC5/wASVVW5/wASVVX/ACeqq/8AGYAA/wAhVVX/ACCqq/8AIVVV/wAgqqulsv8AEqqr/wAtVVX/ABKqq/8ALVVV/wAJVVX/ADJVVov/ADdVVQiLwf//96qr/wAxKqv//+9VVf8ALFVV///vVVX/ACxVVXP/ACaAAP//4Kqr/wAgqqsIC4upgf8AGIAAd553nnL/AAmAAG2L///wqquLff///VVV///zVVX///qqq///81VV///6qquA///41VX///aqq4L///aqq4L///iqqv//9Sqr///6qqv///NVVf//+qqr///zVVX///1VVf//8lVWi///8VVVCIv//+Kqq5X//+fVVZ94n3ik///2gACpi6mLpP8ACYAAn56fnpX/ABiAAIupCAusB4v/ACNVVf//+1VV/wAhKqv///aqq6r///aqq6r///Gqqqb//+yqq6L//+yqq6L//+fVVf8AEiqrbv8ADVVVbv8ADVVV///eKqv/AAaqq///2VVVi///3VVV/wAAqqv//+JVVv//+dVV///nVVV+///nVVV+df//7tVV///sqqv//+qqqwj//+yqq/8AGVVV///nqqr/ABKAAP//4qqr/wALqqv//+Kqq/8AC6qr///jVVX/AAUqqm////6qq2WL///bKquF///cVVV////cVVV////g1Vb//+xVVf//5VVV///kqqsIykwFm/8AD1VVnv8ADCqroZShlP8AF6qr/wAEgAD/ABlVVYuvi6b///Wqq53//+tVVZ3//+tVVZRvi///3KqrCCkGQYv//8bVVf//9FVV///Xqqv//+iqq///16qr///oqqv//+vVVWOL///HVVWL///mqqv/AAUqq///6lVV/wAKVVV5/wAKVVV5/wANVVb///Eqq/8AEFVV///0VVX/ABBVVf//9FVV/wASqqv///dVVqD///pVVaD///pVVf8AFSqr///9Kqv/ABVVVYsIs4v/ACTVVZH/ACGqq5f/ACGqq5f/ABuAAP8AFlVV/wAVVVX/ACCqq/8AEVVVc6P//+uqq/8AHqqr///vVVX/AB6qq///71VV/wAjqqr///eqq/8AKKqri7eL/wAngAD/AAeAAK6arpr/AB7VVf8AGIAA/wAaqqutCDjGBf//8Kqr///tVVX//+5VVf//8IAAd///86qrd///86qrcv//+dVVbYv///NVVYv///Kqq/8AAtVVff8ABaqrff8ABaqr///zKqv/AAhVVf//9FVVlv//9FVVlv//9oAA/wANVVX///iqq/8AD6qr///4qqv/AA+qq////Kqq/wARgAD/AACqq/8AE1VVCAuDi///9yqrjP//9lVVjf//9lVVjYL/AAOAAP//96qrkP//96qrkIT/AAaAAP//+lVVk///+lVVk////Sqr/wAJqquL/wALVVWL/wANVVX/AASqq/8ACtVW/wAJVVX/AAhVVf8ACVVV/wAIVVWX/wAGVVb/AA6qq/8ABFVVCP8ADqqr/wAEVVX/ABAqqo7/ABGqq/8AAaqr/wARqqv/AAGqq/8AESqq/wAA1VX/ABCqq4sIx38Gi33///0qq///8iqr///6VVX///JVVf//+lVV///yVVX///fVVn////VVVf//9aqr///1VVX///Wqq///8qqr///3gAB7///5VVV7///5VVV5///8qqt3iwgL+3wGjf8AIVVV/wALgAD/ABtVVqD/ABVVVaD/ABVVVf8AGyqr/wAKqqv/ACFVVYv/ACNVVYv/ABuqq///9YAAn3afdpb//+SAAI1pCAve3gX//+iqq/8AGVVV///k1VX/ABKAAGz/AAuqq2z/AAuqq///4Sqr/wAF1VX//+FVVYtni2mFa39rf///5FVVev//6Kqrdf//6Kqrdf//7YAA///lgAD///JVVWz///JVVWz///kqq///3YAAi2UIi///3qqr/wAFVVX//+GAAP8ACqqr///kVVX/AAqqq///5FVV/wAOgAD//+eAAP8AElVV///qqqv/ABJVVf//6qqr/wAV1Vb//+5VVf8AGVVVff8AGVVVff8AG6qr///2VVWp///6qqsIUjimcgWRjZH/AAGqq5H/AAFVVZH/AAFVVf8ABlVV/wAAqqv/AAaqq4v/AAqqq4v/AAsqqv///VVV/wALqqv///qqq/8AC6qr///6qqv/AAXVVf//9qqqi///8qqri4OJ///5KquH///6VVWH///6VVX///sqq///+6qr///6VVWICP//+lVViP//+dVW///91VX///lVVf///qqr///5VVX///6qq4X///9VVf//+qqri///4qqri///5Kqq/wAGqqv//+aqq/8ADVVVCHVdBf8AIVVV///tVVX/ACNVVv//9qqr/wAlVVWL/wAOqquL/wAPqqr/AAGqq/8AEKqr/wADVVX/ABCqq/8AA1VVmv8ABVVW/wANVVX/AAdVVf8ADVVV/wAHVVX/AAsqq5WU/wAMqquU/wAMqqv/AASAAP8AD1VVi52L/wATVVX///yAAP8ADyqrhJYIhJb///aqq/8ACFVV///0VVX/AAWqq///9FVV/wAFqqt+/wADgAD///Gqq/8AAVVV///xqqv/AAFVVf//8YAA/wAAqqv///FVVYsIrbsF/wAKqquL/wAMqqr/AAEqq/8ADqqr/wACVVX/AA6qq/8AAlVV/wAPKqqP/wAPqqv/AAWqq/8AD6qr/wAFqqv/AA+AAJL/AA9VVf8ACFVV/wAPVVX/AAhVVf8ADaqr/wAKKquXlwg74QX///Sqq///8VVV///yVVX///TVVnv///hVVXv///hVVf//7qqr///8Kqv//+1VVYt1i///7FVVj///7qqrk///7qqrk///8Sqq/wAKqqv///Oqq/8ADVVV///zqqv/AA1VVf//9qqq/wAPVVb///mqq/8AEVVV///5qqv/ABFVVf///NVVnYv/ABKqqwiL/wASqqv/AAMqq53/AAZVVf8AEVVV/wAGVVX/ABFVVf8ACVVW/wAPVVb/AAxVVf8ADVVV/wAMVVX/AA1VVf8ADtVW/wAKqqv/ABFVVZP/ABFVVZP/ABOqq4+hi5uL/wAPqqv///uqq/8AD1VV///3VVX/AA9VVf//91VV/wAOqqv///RVVpn///FVVQgLi///61VV/wAHVVX//+5VVv8ADqqr///xVVX/AA6qq///8VVV/wARqqr///iqq/8AFKqri/8AFKqri/8AEaqq/wAHVVX/AA6qq/8ADqqr/wAOqqv/AA6qq/8AB1VV/wARqqqL/wAUqquL/wAUqqv///iqq/8AEaqq///xVVX/AA6qq///8VVV/wAOqqv//+5VVv8AB1VV///rVVWLCP//61VVi///7lVW///4qqv///FVVf//8VVV///xVVX///FVVf//+Kqr///uVVaL///rVVUIC/tZ+1wF///wqqv/ABdVVf//+FVV/wAaqquLqYv/ABKqq/8AAyqrnf8ABlVV/wARVVX/AAZVVf8AEVVV/wAJVVb/AA9VVv8ADFVV/wANVVX/AAxVVf8ADVVV/wAO1Vb/AAqqq/8AEVVVk/8AEVVVk/8AE6qrj6GL/wAPVVWL/wAOVVb///3VVf8ADVVV///7qqsI/wANVVX///uqq5f///oqqv8ACqqr///4qqsIC/da91sFmf//6KqrknGL///jVVWL///tVVX///zVVXn///mqq///7qqr///5qqv//+6qq///9qqq///wqqr///Oqq///8qqr///zqqv///Kqq///8Sqq///1VVX//+6qq4P//+6qq4P//+xVVYd1i///4VVVi3H/AAeqq///6qqr/wAPVVUIC2GzREMFdZv//+dVVf8ADFVV///kqqv/AAiqq///5Kqr/wAIqqtu/wAEVVX//+FVVYtni2mFa39rf///5FVVev//6Kqrdf//6Kqrdf//7YAA///lgAD///JVVWz///JVVWz///kqq///3YAAi2UIi///3qqr/wAFKqv//+GAAP8AClVV///kVVX/AApVVf//5FVV/wAOgAD//+eAAP8AEqqr///qqqsISEezYtHSBf8AFVVV///wqqv/ABgqq3+m///3VVWm///3VVX/ABzVVf//+6qr/wAeqquLr4utkauXq5f/ABuqq5z/ABdVVaH/ABdVVaH/ABKAAP8AGoAA/wANqquq/wANqquq/wAG1VX/ACKAAIuxCIv/ACCqq///+tVVqf//9aqr/wAbVVX///Wqq/8AG1VV///yKqr/ABhVVv//7qqr/wAVVVUIC0gG/wADVVVZnP//24AA/wAeqqt0/wAeqqt0/wAnVVX///SAALuLu4v/ACcqq/8AC4AA/wAeVVWi/wAeVVWi/wAR1Vb/ACSAAP8ABVVVvQhJBv//+Kqrb395///vVVWD///vVVWD///pVVaH///jVVWL///mqquL///pqqr/AASqq///7Kqr/wAJVVX//+yqq/8ACVVVf/8AEVVW///7VVX/ABlVVQgLSAb/AANVVVmc///bgAD/AB6qq3T/AB6qq3T/ACdVVf//9IAAu4u7i/8AJyqr/wALqqv/AB5VVf8AF1VV/wAeVVX/ABdVVf8AEdVW/wAkVVb/AAVVVf8AMVVVCEkG///4qqtvf3n//+9VVYP//+9VVYP//+lVVof//+NVVYv//+aqq4v//+mqqv8ABKqr///sqqv/AAlVVf//7Kqr/wAJVVV//wARVVb///tVVf8AGVVVCAv7Bov3Bvsk9xmL9wf3JPsCi0YxBQtP+1rsi+D3WgULRfta9ovg91oFC4v//8iqq/8ACVVV///Nqqr/ABKqq///0qqr/wASqqv//9Kqq/8AGdVV///ZKqqs///fqqus///fqqv/ACdVVXL/AC2qq///7lVV/wAtqqv//+5VVf8AMiqq///3Kqv/ADaqq4v/ADdVVf8AAKqr/wAyqqv/AAmAALn/ABJVVbn/ABJVVf8AJ6qr/wAZgAD/ACFVVf8AIKqrCP8AIVVV/wAgqqulsv8AEqqr/wAtVVX/ABKqq/8ALVVV/wAJVVX/ADJVVov/ADdVVYv/ADiqq///9qqr/wAzVVX//+1VVbn///aqq6H///VVVf8AFKqrf/8AE1VV/wAnVVWP/wAd1VaZ/wAUVVWj/wAUVVWj/wAKKquwi70Ii/8AEqqr///+gAD/AA+qqoj/AAyqq4j/AAyqq///+yqr/wAMqqr///lVVf8ADKqrCPsGbgX/AAVVVYP/AARVVv//9lVV/wADVVX///Sqq/8AA1VV///0qqv/AAGqq///9Kqqi///9Kqri///6VVV///61VX//+4qq///9aqrfv//9aqrfv//7tVV///4gABziW2l///dqquf///ZVVWZXf8AEVVV///NVVX/AAhVVv//yKqr////VVUI///JVVWL///N1Vb///cqq///0lVV///uVVX//9JVVf//7lVV///Yqqv//+bVVmr//99VVWr//99VVf//5iqr///YgAD//+1VVf//0aqr///tVVX//9Gqq///9qqr///MgACL///HVVUIC4tl/wAG1VX//92AAP8ADaqrbP8ADaqrbP8AEoAA///lgAD/ABdVVXX/ABdVVXX/ABuqq3qrf6t/rYWvi6+LrZGrl6uX/wAbqquc/wAXVVWhCP8AF1VVof8AEoAA/wAagAD/AA2qq6r/AA2qq6r/AAbVVf8AIoAAi7GLsYT/ACJVVX3/AB6qq///+Kqrnf//9qqq/wAQVVX///Sqq/8ADqqrr/8ABVVV/wAbKqv/AA7VVv8AElVV/wAYVVX/ABJVVf8AGFVV/wAJKqv/ACPVVov/AC9VVQiL/wASqqv///6AAP8AD6qqiP8ADKqriP8ADKqr///7Kqv/AAyqqv//+VVV/wAMqqsI+wZuBf8ABVVVg/8ABFVW///2VVX/AANVVf//9Kqr/wADVVX///Sqq/8AAaqr///0qqqL///0qquL///oqqv///pVVf//7dVV///0qqt+///0qqt+///sqqr///jVVf//5Kqr///+qqv///aqq/8ABKqr///2VVX/AARVVYGPa5dpkWeLCGeLaYVrf2t////kVVV6///oqqt1///oqqt1///tgAD//+WAAP//8lVVbP//8lVVbP//+Sqr///dgACLZQgLpgb/ACqqq/8AAqqr/wAggAD/AA1VVf8AFlVVo/8AFlVVo/8ACyqrsYu/i/8AEqqr///+gAD/AA+qqoj/AAyqq4j/AAyqq///+yqr/wAMqqr///lVVf8ADKqrCPsGbgX/AAVVVYP/AARVVv//9lVV/wADVVX///Sqq/8AA1VV///0qqv/AAGqq///9Kqqi///9Kqri///51VVhf//7Sqrf35/fnb///mAAG2LCDP8UAaL///uqqv///1VVf//7dVV///6qqt4///6qqt4///3Kqr//+6AAP//86qre///86qre///76qq///y1VX//+uqq///9aqr///rqqv///Wqq///5tVV///61VVti22L///m1VX/AAUqq///66qr/wAKVVX//+uqq/8AClVV///vqqr/AA0qq///86qrmwj///Oqq5v///cqqv8AEYAA///6qque///6qque///9VVX/ABIqq4v/ABFVVQj4UPsS/FQHi///1VVV/wAHKqv//9mAAP8ADlVV///dqqv/AA5VVf//3aqrn///4tVV/wAZqqtz/wAZqqtz/wAeKqr//+2AAP8AIqqrfv8AIqqrfv8AJaqq///5gAD/ACiqq4v/ACiqq4v/ACWqqv8ABoAA/wAiqquY/wAiqquYqf8AEoAA/wAZVVWjCP8AGVVVo5//AB0qq/8ADqqr/wAiVVX/AA6qq/8AIlVV/wAHVVX/ACaAAIv/ACqqqwgL+C2mB/8AKqqr/wACqqv/ACCAAP8ADVVV/wAWVVWj/wAWVVWj/wALKquxi7+L/wASqqv///6AAP8AD6qqiP8ADKqriP8ADKqr///7Kqv/AAyqqv//+VVV/wAMqqsI+wZuBf8ABVVVg/8ABFVW///2VVX/AANVVf//9Kqr/wADVVX///Sqq/8AAaqr///0qqqL///0qquL///nVVWF///tKqt/fn9+dv//+YAAbYsIOfuaBot7if//8Kqrh///8VVVh///8VVV///5gAB+gv//9Kqrgv//9Kqr///0qquC///yVVX///lVVf//8lVV///5VVX//+8qq////Kqrd4v//+qqq4v//++AAP8ABNVV///0VVX/AAmqq///9FVV/wAJqqv///dVVpf///pVVf8ADlVVCP//+lVV/wAOVVX///yAAP8AD1VW///+qqv/ABBVVf///qqr/wAQVVX///9VVf8ADtVWi/8ADVVVCPeH+wz7wweL///nVVWO///oVVaR///pVVWR///pVVWV///r1VaZ///uVVWZ///uVVX/ABIqq33/ABZVVf//9aqr/wAWVVX///Wqq/8AGyqr///61VWri7OL/wAfqqv/AAjVVf8AF1VV/wARqqv/ABdVVf8AEaqr/wARVVb/ABTVVf8AC1VVowiNPgYLcrwF///4qquF///3gACG///2VVWH///2VVWH///2gACJ///2qquL///zVVWL///1Kqv/AASAAIKUgpT///uAAP8ACtVVi/8ADKqri/8ACqqr/wAC1VX/AAuAAP8ABaqr/wAMVVX/AAWqq/8ADFVV/wAHKqqX/wAIqqv/AAuqqwj/AAiqq/8AC6qrlP8ACtVV/wAJVVWV/wAJVVWV/wAIqqv/AAhVVZP/AAaqqwhOBv//9VVVg///9NVW///2Kqv///RVVf//9FVV///0VVX///RVVf//9Sqr///zqquBfoF+///31VX///Iqq///+aqr///xVVX///mqq///8VVV///81VX///Gqq4t9i///8VVV/wAC1VX///Mqq/8ABaqrgP8ABaqrgP8AB6qq///2qqv/AAmqq///+FVVCP8ACaqr///4VVWW///6VVb/AAxVVf///FVV/wAMVVX///xVVf8ADNVW///+Kqv/AA1VVYv/ABKqq4v/ABHVVf8AA4AAnJKckv8AD4AA/wAJKquZ/wALVVUIC9H3nCCLNvucBQvPBov/AASqq/8AAdVV/wAEVVX/AAOqq4//AAOqq4//AAaAAI//AAlVVY//ABFVVf8AB1VV/wAMVVb/AAiqq/8AB1VVlf8AB1VVlf8AA6qr/wANqquL/wARVVWLn4L/ABEqq3n/AA5VVXn/AA5VVf//5qqr/wAHKqv//99VVYsI///gqquL///mqqr///jVVf//7Kqr///xqqv//+yqq///8aqr///0qqr//+rVVf///KqrbwjXggWP/wAYqqv/AAqqq/8ADFVV/wARVVWL/wAPVVWL/wAHqqv///lVVYv///Kqq4uBhP//9qqrff//91VV///wqqv///aqq///9dVV///3KqqG///3qquG///3qqv///2AAP//9NVVi30IC5b7X92LlfdfBQuLff8ABVVV///zKqv/AAqqq///9FVV/wAKqqv///RVVf8ADVVV///6Kqubi5uL/wANVVX/AAXVVf8ACqqr/wALqqv/AAqqq/8AC6qr/wAFVVX/AAzVVYuZi/8ADqqr///6qquY///1VVX/AAtVVf//9VVV/wALVVX///Kqq/8ABaqre4sIe4v///Kqq///+lVV///1VVX///Sqq///9VVV///0qqv///qqq36L///xVVUIC5b7a9GLlfdrBQv5WPsY/VgHC4tn///6VVX//96AAP//9KqrbP//9KqrbP//79VVcHZ0dnT//+bVVXn//+Kqq37//+Kqq37//99VVf//+YAAZ4tni///31VV/wAGgAD//+Kqq5j//+Kqq5hynf//61VVogj//+tVVaJ7pv//9Kqrqv//9Kqrqv//+lVV/wAhgACLr4v/ACKqq/8ABaqr/wAg1VX/AAtVVar/AAtVVaqb/wAa1VX/ABSqq/8AFqqr/wAUqqv/ABaqq6Sd/wAdVVX/AA1VVf8AHVVV/wANVVX/ACCqq/8ABqqrr4sIr4v/ACDVVf//+VVV/wAdqqv///Kqq/8AHaqr///yqqv/ABkqqnn/ABSqq///6VVV/wAUqqv//+lVVZv//+Uqq/8AC1VVbP8AC1VVbP8ABaqr///fKquL///dVVUIC/h6+xL8egcLyfcy98uLy/sy9yaL+775WPsUi/vA/VgFC/1Y95IH/wAkqquL/wAigACP/wAgVVWT/wAgVVWT/wAcVVb/AAwqq/8AGFVV/wAQVVX/ABhVVf8AEFVV/wATKqv/ABTVVpn/ABlVVZn/ABlVVZL/AB5VVov/ACNVVYuj///8Kqv/ABXVVf//+FVV/wATqqv///hVVf8AE6qr///1VVac///yVVX/AA5VVQj///JVVf8ADlVVe/8AC6qr///tqquU///tqquU///sKqr/AAYqq///6qqr/wADVVUIjQevlaj/ABJVVaH/ABqqq6H/ABqqq5b/ACBVVYuxi6////jVVf8AHaqr///xqqv/ABdVVf//8aqr/wAXVVX//+2AAP8AEoAA///pVVX/AA2qq///6VVV/wANqqv//+aqq/8ACaqqb/8ABaqrb/8ABaqr///kVVX/AALVVf//5KqriwgL90/wB7OL/wAgKqv///jVVf8AGFVV///xqqv/ABhVVf//8aqr/wAMKqv//+jVVYtri///7qqr///81VX///FVVf//+aqrf///+aqrf///91VV///2KquA///4VVWA///4VVX///Mqq///+lVW///xVVX///xVVf//8VVV///8VVX///BVVv///iqr///vVVWLCAv3ZPcIB/8ALVVVi/8AI4AAg/8AGaqre/8AGaqre/8ADNVV///lqquL///bVVWLd///+6qr///vKqv///dVVf//8lVV///3VVX///JVVf//9Kqr///1Kqt9g32De///+lVVef///Kqref///Kqr///tqqv///5VVf//7VVViwgL+OX3vfcH/EH9WAcL91r3zvb7zvdF9+L3Bfxi/Vj4cfcFBwv9WPcY98z31PvM9xf5WPsX+7D71PewBwuL/wA3VVX///aAAP8AMoAAeP8ALaqreP8ALaqr///lqquy///eVVX/ACBVVf//3lVV/wAgVVVj/wAZKqv//9Gqq53//9Gqq53//82AAJT//8lVVYtVi///zdVVgv//0aqref//0aqref//19VV///m1VVp///fqqsIaf//36qr///lgABkeP//0lVVeP//0lVV///2gAD//82AAIv//8iqq4v//8iqq/8ACYAA///NVVWeXZ5d/wAagAD//9iAAK1qrWr/ACgqq///5lVV/wAuVVX//+2qq/8ALlVV///tqqv/ADIqq///9tVVwYsI/wA2qquL/wAygAD/AAkqq/8ALlVV/wASVVX/AC5VVf8AElVVs/8AGaqr/wAhqqus/wAhqqus/wAaVVX/ACeAAJ65nrn/AAmAAP8AMqqri/8AN1VVCAv7VfiP+1KLi/1Y9xKLiPi2jov3Zvy24ov3afi2jYuJ/Lb3FYuL+Vj7VIv7T/yPBQv8yP1Y9xf45/fD/Of3FgYL/Vj3GPe48Af/ACSqq4v/ACKAAP8AA9VV/wAgVVX/AAeqq/8AIFVV/wAHqqv/ABwqq/8ADFVVo5yjnP8AEtVV/wAV1VX/AA2qq/8AGqqr/wANqqv/ABqqq/8ABtVVq4v/ACVVVYv/ACSqq///+YAA/wAfgAB+/wAaVVV+/wAaVVX//+3VVf8AFVVW///oqqv/ABBVVQj//+iqq/8AEFVV///kVVWXa/8AB6qra/8AB6qraP8AA9VVZYsIC/de6Qefi/8AEqqr///+VVX/ABFVVf///Kqr/wARVVX///yqq/8ADtVW///6qqr/AAxVVf//+Kqr/wAMVVX///iqq/8ACdVW///11VX/AAdVVX7/AAdVVX7/AAOqq///8Cqri///7VVVi///2qqr///ygAD//+WAAHD///BVVXD///BVVf//3dVV///4Kqv//9aqq4sIC/jn92v3BfzF+wX3a/znBwuL98L3ofgq+y2L+0X7uvtE97r7NIv3nvwqi/vCBQvP+xFHB1n///qqq///0aqrf///1VVV///tVVX//9VVVf//7VVV///bVVZz///hVVX//+Kqq///4VVV///iqqtz///dgAD//+6qq///2FVV///uqqv//9hVVf//91VV///UgACL///QqquL///Qqqv/AAiqq///1IAA/wARVVX//9hVVf8AEVVV///YVVWj///dVVb/AB6qq///4lVVCP8AHqqr///iVVX/ACSqqv//59VW/wAqqqv//+1VVf8AKqqr///tVVX/AC5VVX+9///6qqsIQfcR1Qe9/wAFVVX/AC4qq5f/ACpVVf8AEqqr/wAqVVX/ABKqq/8AJIAA/wAYKqr/AB6qq/8AHaqr/wAeqqv/AB2qq/8AF9VV/wAiqqqc/wAnqquc/wAnqqv/AAiAAP8AK4AAi/8AL1VVi/8AL1VV///3gAD/ACtVVnr/ACdVVXr/ACdVVf//6Cqr/wAiVVb//+FVVf8AHVVVCP//4VVV/wAdVVX//9uAAKP//9Wqq/8AEqqr///Vqqv/ABKqq///0dVV/wAMVVVZkQgLi6f/AASAAP8AGoAAlKSUpP8ADSqr/wAWVVX/ABFVVf8AE6qr/wARVVX/ABOqq/8AFaqr/wAQVVWlmKWY/wAdqqv/AAkqq/8AIVVV/wAFVVUI/FIH///eqqv/AASqq///4lVVlHH/AA1VVXH/AA1VVf//6lVV/wAQVVb//+6qq/8AE1VV///uqqv/ABNVVf//8tVV/wAWKquCpIKk///7gAD/ABrVVYv/AByqqwgLi2////uAAP//5YAAgnKCcv//8tVV///p1VX//+6qq///7Kqr///uqqv//+yqq///6oAA///vqqr//+ZVVf//8qqr///mVVX///Kqq///4tVWgv//31VV///7VVUI+FEHzf//9VVV/wAyqqv//+ZVVv8AI1VV///XVVX/ACNVVf//11VV/wARqqv//89VVov//8dVVQgL+zD3ivs0i/d8++P7kfwJ9zKL90T3qvdH+6r3N4v7lvgJ93j34/stiwULi///7Kqr/wAG1VX//++AAP8ADaqr///yVVX/AA2qq///8lVV/wAQ1VX///kqq5+L/wATVVWL/wAQgAD/AAbVVf8ADaqr/wANqqv/AA2qq/8ADaqr/wAG1VX/ABCAAIv/ABNVVYv/ABKqq///+Sqr/wAQKqr///JVVf8ADaqr///yVVX/AA2qq///74AA/wAG1VX//+yqq4sId4v//+8qq4T///JVVX3///JVVX3///kqq3uLeQgLi///7Kqr/wAGqqv//++AAP8ADVVV///yVVX/AA1VVf//8lVV/wAQqqv///kqq5+L/wATVVWL/wAQgAD/AAbVVf8ADaqr/wANqqv/AA2qq/8ADaqr/wAG1VX/ABCAAIv/ABNVVYv/ABKqq///+Sqr/wAQKqr///JVVf8ADaqr///yVVX/AA2qq///74AA/wAG1VX//+yqq4sId4v//+9VVYT///Kqq33///Kqq33///lVVXuLeQgLi///7Kqr/wAG1VX//++AAP8ADaqr///yVVX/AA2qq///8lVV/wAQgAD///kqq/8AE1VVi5+L/wAQ1VX/AAbVVf8ADaqr/wANqqv/AA2qq/8ADaqr/wAG1VX/ABCAAIv/ABNVVYv/ABKqq///+Sqr/wAQKqr///JVVf8ADaqr///yVVX/AA2qq///7yqr/wAG1VV3iwj//+yqq4v//++AAIT///JVVX3///JVVX3///kqq3uLeQgLjUT3Cvh7+xFKiQb//+9VVaH//+mqq/8AElVVb/8ADqqrb/8ADqqr///gVVX/AAdVVf//3Kqri///21VVi2r///kqq///4qqr///yVVX//+Kqq///8lVVcv//7aqr///rVVV0///rVVV0///wKqtwgGyAbP//+oAA///fKquL///dVVUIi///3VVV/wAFgAD//98qq5Zslmz/AA+qq///5Kqr/wAUVVX//+hVVf8AFFVV///oVVWk///tVVb/AB2qq///8lVV/wAdqqv///JVVf8AIYAA///5Kqv/ACVVVYv/ACFVVYur/wAHKqv/AB6qq/8ADlVV/wAeqqv/AA5VVaP/ABTVVv8AEVVV/wAbVVUIC4ufjv8AEyqrkf8AElVVkf8AElVVlP8AECqrl5mXmf8ADtVV/wALKqv/ABGqq/8ACFVV/wARqqv/AAhVVf8AFIAA/wAEKqv/ABdVVYv/ABVVVYv/ABOAAP//+9VV/wARqqv///eqq/8AEaqr///3qqv/AA8qqv//9NVV/wAMqqt9CP8ADKqrff8ACdVV///v1VWS///tqquS///tqqv/AAOAAP//7NVVi3eL///rVVX///yAAP//7IAAhP//7aqrhP//7aqr///2Kqv//+/VVf//81VVff//81VVff//8NVWgP//7lVVg///7lVVg///7IAAh///6qqriwj//+iqq4v//+uAAP8ABCqr///uVVX/AAhVVf//7lVV/wAIVVX///Eqq/8ACyqrf5l/mYL/ABAqq4X/ABJVVYX/ABJVVYj/ABMqq4ufCAvTzgWH/wAGqquE/wAIKqqB/wAJqquB/wAJqqv///KAAP8ACYAAev8ACVVVev8ACVVV///rVVWT///nqqv/AAaqq///56qr/wAGqqv//+LVVf8AA1VVaYtri23///zVVW////mqq2////mqq///56qr///2qqr//+tVVf//86qrCP//61VV///zqqv//++qq///8Sqqf///7qqrf///7qqrhf//7FVVi3WL///vVVX/AANVVf//8VVW/wAGqqv///NVVf8ABqqr///zVVX/AAiAAP//9Sqr/wAKVVWC/wAKVVWC/wALKqv///iqq5f///pVVZf///pVVf8AC1VV///71Vb/AAqqq////VVVCIgH///1VVX///6qq///89VWiP//8lVV///7VVX///JVVf//+1VV///zKqv///jVVn////ZVVX////ZVVf//9dVVf///96qr///xqqv///eqq///8aqr///71VX//+6AAIv//+tVVYtz/wAGVVX//+sqq/8ADKqr///uVVX/AAyqq///7lVV/wARKqr///FVVv8AFaqr///0VVUI/wAVqqv///RVVf8AGSqq///3VVb/AByqq///+lVV/wAcqqv///pVVan///0qq/8AH1VVi/8AJVVVi/8AIIAA/wADgAD/ABuqq5L/ABuqq5L/ABdVVf8ACCqrnv8ACVVVnv8ACVVV/wAO1VX/AAkqq/8ACqqrlP8ACqqrlJL/AAaAAP8AA1VVjwhL1QWBgf//86qr///3VVX///FVVf//+Kqr///yqqv///lVVf//74AA///6Kqv//+xVVYb//+xVVYb//+eAAP///YAA///iqquLfYt9/wAA1VV9/wABqqt9/wABqqv///NVVf8AAtVV///0qquP///0qquP///21VX/AAWAAISSCISS///8gAD/AAiAAIuVi/8AFKqr/wAMKqv/AA5VVf8AGFVVk/8AGFVVk/8AI9VWj/8AL1VViwjY5DYG///vVVWLe4z///Cqq43///Cqq43///KAAP8AAyqr///0VVX/AARVVf//9FVV/wAEVVX///aqq/8ABdVWhP8AB1VVhP8AB1VV///8gAD/AAiqq4uVi/8ACVVVjv8ACCqrkZKRkv8ACCqr/wAFqqv/AApVVf8ABFVVCP8AClVV/wAEVVX/AAvVVv8AA1VW/wANVVX/AAJVVf8ADVVV/wACVVWZ/wABKqv/AA6qq4uji/8AFKqr///9VVX/ABFVVf//+qqr/wARVVX///qqq/8ADlVWhf8AC1VV///5VVX/AAyqq///+Kqr/wAKqqr///dVVf8ACKqrgQgL+w0G/wAAqqv//+tVVf8AAFVV///qqquLdQiLTYv7/PcTi4v3lgWLtf8AClVV/wAhVVX/ABSqq/8AGKqr/wAUqqv/ABiqq/8AG1VV/wAMVVWti/8AE1VVi/8AECqr///8qquY///5VVWY///5VVX/AAqAAIKT///0qquT///0qqv/AAWqq///8oAA/wADVVX///BVVf8AA1VV///wVVX/AAGqq///7yqri3kI/I/3EfiwB4v/ABqqq////FVV/wAZVVX///iqq6P///iqq6P///Sqqv8AFSqr///wqqv/ABJVVf//8Kqr/wASVVX//+yqqv8ADoAA///oqqv/AAqqq///6Kqr/wAKqqv//+RVVf8ABVVVa4v//+9VVYv//++AAP///dVV///vqqv///uqq///76qr///7qqv///DVVf//+dVVfYMIfYP///Oqq///9tVV///1VVX///Wqq///9VVV///1qqv///eqq///9NVVhX8IiQaL/wAKqqv////VVf8AC9VV////qquY////qquY////gAD/AAyAAP///1VVlwgL/wAqqquLr5H/AB1VVZf/AB1VVZejm/8AEqqrn/8AEqqrn/8ADYAA/wAWqqv/AAhVVf8AGVVV/wAIVVX/ABlVVf8ABCqrpYv/ABqqqwj3s/sS+5sHi///7qqr///+Kqv//++AAP///FVV///wVVX///xVVf//8FVV///6Kqv///Iqq4N/g3////Uqq///9oAA///yVVWE///yVVWE///vKqv///yAAHeLd4v//+9VVf8AA4AA///yqquS///yqquS///1VVX/AAmAAIOXCIOX///6VVX/AA3VVf///Kqr/wAPqqv///yqq/8AD6qr///+VVX/ABCAAIv/ABFVVQj3m/sS+7MHi///5VVVj3GT///mqquT///mqquY///pVVWdd513/wAXgAB7qH+of/8AI9VVhf8AKqqriwgLi/8AJqqr///5Kquu///yVVX/AB9VVf//8lVV/wAfVVX//+0qq/8AGtVWc/8AFlVVc/8AFlVV///j1VX/ABFVVv//36qr/wAMVVX//9+qq/8ADFVV///dKqr/AAYqq///2qqri///2qqri///3Sqq///51VX//9+qq///86qr///fqqv///Oqq///49VV///uqqpz///pqqsIc///6aqr///tKqv//+Uqqv//8lVV///gqqv///JVVf//4Kqr///5Kqtoi///2VVVi///2VVV/wAG1VX//9zVVv8ADaqr///gVVX/AA2qq///4FVV/wAS1VX//+TVVqP//+lVVaP//+lVVf8AHCqr///ugAD/ACBVVf//86qr/wAgVVX///Oqq/8AItVW///51VX/ACVVVYsI/wAlVVWL/wAi1Vb/AAYqq/8AIFVV/wAMVVX/ACBVVf8ADFVV/wAcKqv/ABGAAKP/ABaqq6P/ABaqq/8AEtVV/wAbKqr/AA2qq/8AH6qr/wANqqv/AB+qq/8ABtVV/wAjKqqL/wAmqqsIC4t3///81VX//+zVVf//+aqr///tqqv///mqq///7aqr///21VX//+/VVX99f33///Eqq///9NVV///uVVX///eqq///7lVV///3qqv//+vVVv//+9VV///pVVWLdYv//+wqq/8ABCqr///uVVX/AAhVVf//7lVV/wAIVVX///Eqq/8ACyqrf5kIf5n///bVVf8AECqr///5qqv/ABJVVf//+aqr/wASVVX///zVVf8AEyqri5+Ln/8AAyqr/wATKqv/AAZVVf8AElVV/wAGVVX/ABJVVf8ACSqr/wAQKquXmZeZ/wAOqqv/AAsqq/8AEVVV/wAIVVX/ABFVVf8ACFVVn/8ABCqr/wAWqquLCKGL/wAT1VX///vVVf8AEaqr///3qqv/ABGqq///96qrmv//9NVV/wAMVVV9/wAMVVV9/wAJVVb//+/VVf8ABlVV///tqqv/AAZVVf//7aqr/wADKqv//+zVVYt3CAtA2AX//+dVVf//9qqr///ogAB////pqqv///FVVf//6aqr///xVVX//+xVVf//7dVWev//6lVVev//6lVV///yVVX//+Yqq///9aqrbf//9aqrbf//+tVVaItji///tqqr/wARqqv//8bVVf8AI1VVYv8AI1VVYv8AMVVW///rgAD/AD9VVYsI/wAmqquLrZX/AB1VVZ//AB1VVZ+f/wAgVVX/AAqqq/8ALKqrCI8G/wAIqqv//9aqq/8AElVV///ggACn///qVVWn///qVVWu///1Kqu1i/8AQVVVi72g/wAiqqu1/wAiqqu1/wARVVX/ADiqq4v/AEdVVYuxhv8AIaqrgf8AHVVVgf8AHVVV///ygAD/ABnVVnr/ABZVVQh6/wAWVVX//+wqq57//+lVVf8AD6qr///pVVX/AA+qq///6FVW/wAMgAD//+dVVf8ACVVVCEE+BaP///aqq/8AFIAA///11VWcgJyAmf//81VVlv//8aqrlv//8aqr/wAIKqv//++qqv8ABVVV///tqqv/AAVVVf//7aqr/wACqqv//+qAAIv//+dVVYv//9NVVYP//92AAHv//+eqq3v//+eqq///6VVV///z1VX//+Kqq4sIcYv//+sqq5b///BVVaH///BVVaH///gqq/8AJKqri/8AM1VVCOL7ETQHi1f///fVVWb//++qq3X//++qq3X//+sqqoD//+aqq4tvi///6dVV/wAMVVX//++qq/8AGKqr///vqqv/ABiqq///99VV/wAiqqqL/wAsqquL/wAYqqv/AAKqq/8AFaqq/wAFVVX/ABKqq/8ABVVV/wASqqv/AAhVVv8AEIAA/wALVVX/AA5VVQj/AAtVVf8ADlVV/wAOVVb/AAyAAP8AEVVV/wAKqqv/ABFVVf8ACqqr/wAUVVaV/wAXVVX/AAlVVQgL9xf31Qa7/wABVVX/ACnVVf//+qqr/wAjqqt//wAjqqt//wAeqqr//+zVVf8AGaqr///lqqv/ABmqq///5aqr/wAVVVX//95VVZxinGL/AA2AAP//zyqrlf//x1VVCPcjBv//7VVV/wBsqqv//+FVVv8AVqqq///VVVX/AECqq///1VVV/wBAqqv//8eqq/8ALlVVRacI94/3yfsji/uC+6sF///0qqv/AAFVVf//9CqqjP//86qr/wAAqqv///Oqq/8AAKqr///zKqr/AABVVf//8qqriwj3p/sXBwv3Ifck+xyLJPskBQtBZQWR///wqqv/AAjVVf//8VVV/wALqqt9/wALqqt9/wAOKqr///PVVf8AEKqr///1qqv/ABCqq///9aqr/wASgAD///fVVf8AFFVVhf8AFFVVhf8AFdVWiP8AF1VVi/8AF1VVi/8AFdVWjv8AFFVVkf8AFFVVkf8AEoAA/wAIKqv/ABCqq/8AClVVCP8AEKqr/wAKVVX/AA4qqv8ADCqr/wALqquZ/wALqquZ/wAI1VX/AA6qq5H/AA9VVQhBsQX///aqq3X///DVVf//7dVVdv//8aqrdv//8aqr///ogAD///jVVXGL///mqquL///oqqr/AAcqq///6qqr/wAOVVX//+qqq/8ADlVV///wqqr/ABIqq///9qqroQgLSWkF/wAFVVV9/wAH1Vb///LVVf8AClVV///zqqv/AApVVf//86qr/wAMgAD///Uqqv8ADqqr///2qqv/AA6qq///9qqr/wAQgAD///iAAP8AElVV///6VVX/ABJVVf//+lVV/wAT1Vb///0qq/8AFVVVi/8AFKqri/8AE6qq/wAC1VX/ABKqq/8ABaqr/wASqqv/AAWqq/8AEKqq/wAHgAD/AA6qq/8ACVVVCP8ADqqr/wAJVVX/AAyqqv8ACtVW/wAKqqv/AAxVVf8ACqqr/wAMVVWT/wANKqv/AAVVVZkISa0F///3VVX//+yqq///8lVW///v1VX//+1VVX7//+1VVX7//+qqq///+YAAc4v//+iqq4t2/wAGgAD//+1VVZj//+1VVZj///JVVv8AECqr///3VVX/ABNVVQgL9037Efx69xH3Xgf/ABqqq4mj///7VVX/ABVVVf//+Kqr/wAVVVX///iqq57///Sqqv8AEKqr///wqqv/ABCqq///8Kqr/wAOKqr//+vVVf8AC6qrcv8AC6qrcv8ACdVV///g1VWT///aqqsI9x8Ge8n//+qAAP8ANFVVcP8AKqqrcP8AKqqr///a1VX/ACFVVf//0Kqrowj3O/d5+x+L+xz7UwX//+9VVf8AAqqr///tVVaN///rVVX/AAFVVQgLi///7Kqr/wAGqqv//++AAP8ADVVV///yVVX/AA1VVf//8lVV/wAQqqv///kqq5+L/wATVVWL/wAQqqv/AAbVVZn/AA2qq5n/AA2qq5L/ABCAAIv/ABNVVYv/ABKqq4T/ABAqqn3/AA2qq33/AA2qq///71VV/wAG1VX//+yqq4sId4v//+9VVYT///Kqq33///Kqq33///lVVXuLeQgLi3P/AASqq///6Sqr/wAJVVX//+pVVf8ACVVV///qVVX/AAyqq///7Sqrm3ube/8AEqqr///zVVX/ABVVVf//9qqr/wAVVVX///aqq/8AFqqr///7VVWji6OL/wAW1VX/AASqq/8AFaqr/wAJVVX/ABWqq/8ACVVV/wAS1VX/AAyqq5ubCJub/wAMqqv/ABLVVf8ACVVV/wAVqqv/AAlVVf8AFaqr/wAEqqv/ABbVVYuji6P///tVVf8AFqqr///2qqv/ABVVVf//9qqr/wAVVVX///NVVf8AEqqre5t7m///7Sqr/wAMqqv//+pVVf8ACVVV///qVVX/AAlVVf//6Sqr/wAEqqtziwhzi///6VVV///7VVX//+qqq///9qqr///qqqv///aqq///7VVV///zVVV7e3t7///zVVX//+1VVf//9qqr///qqqv///aqq///6qqr///7VVX//+lVVYtzCAuL/wAZVVWT/wAUqqubm5ub/wAUqquT/wAZVVWL/wAZVVWL/wAU1VaD/wAQVVV7/wAQVVV7/wAIKqv//+tVVYv//+aqq4v//+aqq///99VV///rKqr//++qq///76qr///vqqv//++qq///6yqq///31VX//+aqq4sI///mqquL///rVVX/AAgqq3v/ABBVVXv/ABBVVYP/ABTVVov/ABlVVQgL///1VVWLgf///dVV///2qqv///uqq///9qqr///7qquD///6Kqr///lVVf//+Kqr///5VVX///iqq///+qqr///3gACH///2VVWH///2VVWJ///11VaL///1VVWLdf8AB6qr///tKqv/AA9VVf//8FVV/wAPVVX///BVVZ3///iAAP8AFKqr/wAAqqsI/wAVVVWLnZP/AA6qq5v/AA6qq5v/AAdVVf8AEqqri/8AFVVVi6H///hVVf8AEtVV///wqqv/AA+qq///8Kqr/wAPqqt5/wAHgAD//+tVVf///1VVCAsAAAEAAAAMAAAAggAAAAIAEwABAAYAAQAHAAcAAgAIAHwAAQB9AH8AAgCAAIYAAQCHAIcAAgCIAKYAAQCnAKcAAgCoAPIAAQDzAPQAAgD1AQgAAQEJAQkAAgEKAQ8AAQEQAREAAgESA3cAAQN4A3kAAgN6A8QAAQPFA8YAAgPHA9YAAQAEAAAAAgAAAAAAAQAAAAoAtgGAAAJERkxUAA5sYXRuABgABAAAAAD//wAAACIABUFG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AAIAHAAiAAEAFAAAAAEAAAAXAAEAAgAjAEMAAQABABAAAgABABIAGwAAAAMAAgAcACIAAQAUAAAAAQAAABcAAQACADEAUQABAAEAEAACAAEAEgAbAAAAAgAMAAMDfAN8A3wAAQADABEDfAOsAAIAIAANABIAEwAUABUAFgAXABgAGQAaABsAFAAVABMAAgADABIAGwAAAHMAdAAKAHoAegAMAAIADAADAHoAcwB0AAEAAwATABQAFQADAAAABAAWABwAIgAoAAAAAQAAABgAAQABABIAAQABA3wAAQABABIAAQABABIAAwAAAAMAFAAaACAAAAABAAAAGQABAAEAEgABAAEDfAABAAEAEgADAAAAAwAUABwAIgAAAAEAAAAZAAEAAgATAHoAAQABA3wAAQABABYAAwAAAAMAFAAcACIAAAABAAAAGQABAAIAEwB6AAEAAQN8AAEAAgAUAHMAAwAAAAMAFAAcACIAAAABAAAAGQABAAIAFQB0AAEAAQN8AAEAAQAWAAIAIAANABIAEwAUABUAFgAXABgAGQAaABsAFAAVABMAAgADABIAGwAAAHMAdAAKAHoAegAMAAIADAADAHoAcwB0AAEAAwATABQAFQACAA4ABABrAHsAawB7AAEABAAjADEAQwBRAAEAXAAHABQAIAAqADQAPgBIAFIAAQAEA3gAAwAQABAAAQAEAIcAAgAnAAEABADzAAIALAABAAQBEAACACcAAQAEAKcAAgBHAAEABAD0AAIATAABAAQBEQACAEcAAQAHABAAIwArADEAQwBLAFEAAQASAAEACAABAAQDxQACAEsAAQABAEgAAQASAAEACAABAAQDxgACAE4AAQABAEgAAQAeAAIACgAUAAEABADzAAIALAABAAQA9AACAEwAAQACACsASwABAB4AAgAKABQAAQAEAPMAAgAsAAEABAD0AAIATAABAAIAKwBLAAEAlgAMAB4AKAAyADwARgBQAFoAZABuAHgAggCMAAEABAEJAAIAUAABAAQBCQACAFAAAQAEAQkAAgBQAAEABAEJAAIAUAABAAQBCQACAFAAAQAEAQkAAgBQAAEABAEJAAIAUAABAAQBCQACAFAAAQAEAQkAAgBQAAEABAEJAAIAUAABAAQBCQACAFAAAQAEAQkAAgBQAAEADAAEAAkAbAB8A28DcANxA3IDcwN0A3oDewACAA4ABABrAHsAawB7AAEABAAjADEAQwBRAAEAFgABAAgAAQAEA3kABAN8ABIAEgABAAEAEgABAHQABQAQABwAPABIAFQAAQAEAAcAAwN8ABIAAwAIABAAGAB+AAMDfAAUAH4AAwN8AHMAfQADA3wAFgABAAQAfwADA3wAFgABAAQAfwADA3wAFgADAAgAEAAYAH4AAwN8ABQAfgADA3wAcwB9AAMDfAAWAAEABQASABMAFQB0AHoAAQAAAAoAMAA+AAJERkxUAA5sYXRuABoABAAAAAD//wABAAAABAAAAAD//wABAAAAAWtlcm4ACAAAAAEAAAABAAQAAgAAAAEACAABCZ4ABAAAADMAcAC+APgBOgF0AZYC5AQiBSgGUgbcBlIG7gZSB7AHvgewAHAAcABwAHAAcABwBSgHsAewAHAAcABwB8wA+AD4APgIVgF0Bu4BdAbuAXQG7gGWAZYI4AQiB74FKAewBSgBlglqCXAAEwA2/6QAOP/CADn/5wA7/7YAWP/uAFn/7gBb/+4Anv+2AL7/7gDA/+4BIP+kASL/pAEy/+cBM//uATT/tgE1/+4BNv+2AZT/pANw/3QADgAO/38AEP9/ACP/yQCB/8kAgv/JAIP/yQCE/8kAhf/JAIb/yQCH/8kAwf/JAMP/yQDF/8kDeP9/ABAANv+kADj/pAA5/8kAO/+RAFv/2wCe/5EAvv/bAMD/2wEg/6QBIv+kATL/yQE0/5EBNf/bATb/kQGU/6QDcP8kAA4ADv9XABD/VwAj/7YAgf+2AIL/tgCD/7YAhP+2AIX/tgCG/7YAh/+2AMH/tgDD/7YAxf+2A3j/VwAIADb/7gA7/9sAnv/bASD/7gEi/+4BNP/bATb/2wGU/+4AUwAO/5EAD/9/ABD/kQAc/60AHf+tACP/pABD/5wARf+RAEf/kQBR/5EAVP+kAFX/kQBX/6QAWf+RAFv/kQBu/38Agf+kAIL/pACD/6QAhP+kAIX/pACG/6QAh/+kAKH/nACi/5wAo/+cAKT/nACl/5wApv+cAKf/nACo/5EAqf+RAKr/kQCr/5EArP+RALP/kQC0/5EAtf+RALb/kQC3/5EAuf+RALr/pAC7/6QAvP+kAL3/pAC+/5EAwP+RAMH/pADC/5wAw/+kAMT/nADF/6QAxv+cAMj/kQDK/5EAzP+RAM7/kQDU/5EA1v+RANj/kQDa/5EA3P+RAQv/kQEN/5EBD/+RARH/kQET/6QBFf+kARf/pAEZ/5EBG/+RAR3/kQEf/5EBJ/+kASn/pAEr/6QBLf+kAS//pAEx/6QBM/+RATX/kQGT/5EDeP+RAE8ADv9/AA//yQAQ/38AHP/SAB3/0gAj/8kAQ//JAEf/yQBLAAoAUf/JAFT/2wBX/9sAW//uAG7/yQCB/8kAgv/JAIP/yQCE/8kAhf/JAIb/yQCH/8kAof/JAKL/yQCj/8kApP/JAKX/yQCm/8kAp//JAKn/yQCq/8kAq//JAKz/yQCtAAoArgAKAK8ACgCwAAoAs//JALT/yQC1/8kAtv/JALf/yQC5/8kAuv/bALv/2wC8/9sAvf/bAL7/7gDA/+4Awf/JAML/yQDD/8kAxP/JAMX/yQDG/8kA1P/JANb/yQDY/8kA2v/JANz/yQDqAAoA7AAKAPAACgDyAAoA9AAKAQv/yQEN/8kBD//JARH/yQET/9sBFf/bARf/2wEn/9sBKf/bASv/2wEt/9sBL//bATH/2wE1/+4DeP9/AEEADv+2AA//5AAQ/7YAHP/uAB3/7gAj/+cAQ//bAEf/7gBR/+4AVP/uAFf/7gBu/+QAgf/nAIL/5wCD/+cAhP/nAIX/5wCG/+cAh//nAKH/2wCi/9sAo//bAKT/2wCl/9sApv/bAKf/2wCp/+4Aqv/uAKv/7gCs/+4As//uALT/7gC1/+4Atv/uALf/7gC5/+4Auv/uALv/7gC8/+4Avf/uAMH/5wDC/9sAw//nAMT/2wDF/+cAxv/bANT/7gDW/+4A2P/uANr/7gDc/+4BC//uAQ3/7gEP/+4BEf/uARP/7gEV/+4BF//uASf/7gEp/+4BK//uAS3/7gEv/+4BMf/uA3j/tgBKAA7/kQAP/5EAEP+RABz/pAAd/6QAI/+2AEP/pABH/6QAS//3AFH/pABS/6oAU/+kAFf/qgBY/8kAbv+RAIH/tgCC/7YAg/+2AIT/tgCF/7YAhv+2AIf/tgCh/6QAov+kAKP/pACk/6QApf+kAKb/pACn/6QAqf+kAKr/pACr/6QArP+kAK3/9wCu//cAr//3ALD/9wCz/6QAtP+kALX/pAC2/6QAt/+kALn/pAC6/6oAu/+qALz/qgC9/6oAwf+2AML/pADD/7YAxP+kAMX/tgDG/6QA1P+kANb/pADY/6QA2v+kANz/pADq//cA7P/3APD/9wDy//cA9P/3AQv/pAEN/6QBD/+kARH/pAEn/6oBKf+qASv/qgEt/6oBL/+qATH/qgN4/5EAIgADAAEABAABAAkAAQAhAAEARAABAEgAAQBKAAEASwABAEwAAQBNAAEATgABAFYAAQCtAAEArgABAK8AAQCwAAEA5gABAOoAAQDsAAEA8AABAPIAAQD0AAEA9gABAPgAAQD6AAEA/AABAP4AAQEhAAEBIwABAZUAAQNvAAEDcAABA3IAAQNzAAEABABI/+4DcAASA8X/7gPG/+4AMAAO/6QAD//JABD/pABF/+4ARv/uAEf/7gBJ/+4ATwASAFAAEgBR/+4AU//uAG7/yQCo/+4Aqf/uAKr/7gCr/+4ArP/uALH/7gCyABIAs//uALT/7gC1/+4Atv/uALf/7gC5/+4AyP/uAMr/7gDM/+4Azv/uAND/7gDS/+4A1P/uANb/7gDY/+4A2v/uANz/7gDe/+4A4P/uAOL/7gDk/+4BBAASAQYAEgEIABIBC//uAQ3/7gEP/+4BEf/uA3j/pAADAA7/pAAQ/6QDeP+kAAMADv+2ABD/tgN4/7YAIgADAJAABACQAAkAkAAhAJAARACQAEgAWABKAJAASwCQAEwAkABNAJAATgCQAFYAeACtAJAArgCQAK8AkACwAJAA5gCQAOoAkADsAJAA8ACQAPIAkAD0AJAA9gCQAPgAkAD6AJAA/ACQAP4AkAEhAHgBIwB4AZUAeANvAJADcACQA3IAkANzAJAAIgADAJAABACQAAkAkAAhAIgARACQAEgAWABKAJAASwCQAEwAkABNAJAATgCQAFYAeACtAJAArgCQAK8AkACwAJAA5gCQAOoAkADsAJAA8ACQAPIAkAD0AJAA9gCQAPgAkAD6AJAA/ACQAP4AkAEhAHgBIwB4AZUAeANvAJADcACQA3IAkANzAJAAIgADAEIABABCAAkAQgAhAEIARABCAEgAKQBKAEIASwBCAEwAQgBNAEIATgBCAFYADgCtAEIArgBCAK8AQgCwAEIA5gBCAOoAQgDsAEIA8ABCAPIAQgD0AEIA9gBCAPgAQgD6AEIA/ABCAP4AQgEhAA4BIwAOAZUADgNvAEIDcABCA3IAQgNzAEIAAQNv/6gACwBV/7YAVv/uARn/tgEb/7YBHf+2AR//tgEh/+4BI//uAZP/tgGV/+4DcP+oAAEAMwAjACgALgAyADQANgA4ADkAOwBGAEgATgBUAFYAWABZAFsAgQCCAIMAhACFAIYAngC+AMAAwQDDAMUA0AD5APsA/QD+ARIBEwEUARUBFgEXASABIgEjATIBMwE0ATUBNgGUA28DcAAAAgAAAAAAAAABKAAAASgARAIHAHgCUAAvAlAAHwOLAB4C5QAwASgAYQEoADABKAARAc8AHAKaAD4BKAAmATsAIgEoAEQBhf/3AlAAKAJQAEECUAA7AlAALgJQACICUAAsAlAALAJQACoCUAA5AlAALAEoAEQBKAAmApoAUAKaAD4CmgBQAgcAMAMgACAC0gAAAogATwKtACkC9wBPAmMATwI+AE8DCgApAuUATwEWAEwB9AAFAq0ATwIHAE8DngBSAxwATwNBACkCYwBPA1QAKQJ2AE8CPgAfAj4ABwLSAEwCm//9A9UAAAKtAAACdv/yAmMAIwEWAEIBhQADARYAFAKaAEUB9AAAAQT/xgIZACQCdgBEAeIALAJ2ACwCPgAsAWAADAJ2ACwCPgBEAQQANQEE/9sCGQBEAQQARgNmAD8CPgBEAmIALAJ2AEQCdgAsAYUARAG8ABkBhQAMAj4ARAIHAAMDHAADAhn//wIHAAMB4gAiARYAAADeADwBFv/dApoAZQEoAAABKABEAlAATgJQAEICUAAkAlAADADeADwCUQA1AQT/zgMgABwBXQAcAgcAHgKaAD4BKAAAAyAAHAEE/+IBkAAoApoAPgGBAB8BgQAbAQQAUwI+AEQCWAAfASgARAEEADUBgQAoAY0AHgIHACYDeQAdA3kAIAN5ABcCBwAbAtIAAALSAAAC0gAAAtIAAALSAAAC0gAAA+j/+gKtACkCYwBPAmMATwJjAE8CYwBPARb/zwEWAEwBFv/VARb/1wL3AA0DHABPA0EAKQNBACkDQQApA0EAKQNBACkCmgBNA0EAKQLSAEwC0gBMAtIATALSAEwCdv/yAmMATwJjADgCGQAkAhkAJAIZACQCGQAkAhkAJAIZACQDVAAkAeIALAI+ACwCPgAsAj4ALAI+ACwBBP/SAQQARgEE/8wBBP/OAmIALAI+AEQCYgAsAmIALAJiACwCYgAsAmIALAKaAD4CYgAkAj4ARAI+AEQCPgBEAj4ARAIHAAMCdgBEAgcAAwLSAAACGQAkAtIAAAIZACQC0gAAAhkAJAKtACkB4gAsAq0AKQHiACwCrQApAeIALAKtACkB4gAsAvcATwJ2ACwC9wANAnYALAJjAE8CPgAsAmMATwI+ACwCYwBPAj4ALAJjAE8CPgAsAmMATwI+ACwDCgApAnYALAMKACkCdgAsAwoAKQJ2ACwDCgApAnYALALlAE8CPgBEAuUATwI+//0BFv/UAQT/zAEW/+oBBP/kARb/4QEE/9gBFgAMAQT/6gEWAD8BBABGAv8ATAHkADUB9AAFAQT/zAKtAE8CGQBEAgcAQQEEADYCBwBPAQQAEgIHAE8BBABGAgcATwGAAEYCBwAJAQQAAQMcAE8CPgBEAxwATwI+AEQDHABPAj4ARAI+/8IDQQApAmIALANBACkCYgAsA0EAKQJiACwD6AAyA54AJAJ2AE8BhQBEAnYATwGFAD8CdgBPAYUAGwI+AB8BvAAZAj4AHwG8ABkCPgAfAbwAGQI+AB8BvAAZAj4ABwGFAAwCPgAHAYUADAI+AAcBhQAMAtIATAI+AEQC0gBMAj4ARALSAEwCPgBEAtIATAI+AEQC0gBMAj4ARALSAEwCPgBEA9UAAAMcAAMCdv/yAgcAAwJ2//ICYwAjAeIAIgJjACMB4gAiAmMAIwHiACICUP/8A3YAKQKPACwDPwBMArkARADeADwBvAA8ASgARAVaAE8E2QBPBFgALAP7AE8DCwBPAggARgUQAE8EIABPA0IARALSAAACGQAkARb/1gEE/80DQQApAmIALALSAEwCPgBEAtIATAI+AEQC0gBMAj4ARALSAEwCPgBEAtIATAI+AEQC0gAAAhkAJALSAAACGQAkA+j/+gNUACQDCgApAnYALAKtAE8CGQBEA0EAKQJiACwDQQApAmIALAEE/9MFWgBPBNkATwRYACwDCgApAnYALAMcAE8CPgBEAtIAAAIZACQD6P/6A1QAJANBACkCYgAkAtIAAAIZABcC0gAAAhkAJAJjADsCPgAsAmMATwI+ACwBFv+OAQT/ewEW/+EBBP/YA0EAKQJiACwDQQApAmIALAJ2ADgBhf/PAnYATwGFADMC0gBMAj4AHwLSAEwCPgBEAj4AHwG8ABkCPgAHAYUADALlAE8CPgBEAtIAAAIZACQCYwBPAj4ALANBACkCYgAsA0EAKQJiACwDQQApAmIALANBACkCYgAsAnb/8gIHAAMBBP/bASgANAEoADQBBP/MAQT/zQEE/+IBBP/YAQQANQEEABkBBP//AQT/ygEE/+wCBwA6AAD+/AAA/vwAAP78AAD+/AAA/vwAAP78AAD+/AAA/vwAAP6UAAD+/AAA/vwAAP78AAD+PgAA/qwAAP7YAAD+2AAA/vwAAP78AAD+2AAA/vwAAP78AAD+/AAA/vwAAP78AAD+/AAA/vwAAP78AAD+/AEoACYBBABOAPD/pgLcAAoBKABEArEAAAM8AAABfgAAA5gAAAMkAAADZf//AY7/+QLN//wCjQBRAgYAUQLrACkCWQBRAmIAJALqAFEDUwAuAScAUQKmAFECzQADA58AUQMMAFECUAArA1MALgLXAFECaABRAmIAOgJBAAgCgv/0A4kALAKpAAMDaABEAxMAJAEn/+UCgv/0An4AKgIXACYCYgBJAQMAQQJZAEYCfgAqAokASgJHAAYCcAAvAhcAJgIQAC8CYQBJAoAANgEKAEYCRABKAjQADgJvAEkCFwAGAgkALgJwAC4CWQBJAocASgIQAC4CiAAuAdcABQJZAEYDQAAuAkoABQNAAEADLQAqARb/3gJaAGYCcAAuAloARgMtACoCWQBRAtMACAIYAFECyAAuAkQAHQEnAFEBM//vAgIACAPPAAID/wBRAtsACALAAFECigAJAt0AUQLN//wChwBRAo0AUQIYAFEDFf/9AlkAUQPmABwCbgArAxUAUQMUAFECwABRArb//AOfAFEC6gBRA1MALgLXAFECaABRAsIALgJBAAgCigAJA4kALAKpAAMC9wBRAowANAPoAFEEHABRAsMACAM+AFECagBRAskAEgRsAFECnwATAikAKgJoADUCNgBJAaAASQJgAAMCSgAuA18AIwHjABMChQBJAoUASQI9AEkCKQAOAtQASQJcAEkCcAAuAlQASQKIAEoB9gAuAc0AEAIXAAYCzAAuAiYABQJiAEkCOQAtA1IASQNMAEkCXAAQAu4ASQIhAEkCKgAjA1AASQIWABgCPAA4AmH//AGsAEkCMwAyAecAJgEWAD8BFv/eARj/3wLrABYDaABJAl7//AI9AEkCFwAGAlIASQISAEQBrQBJARYATAPo//oDVAAkAtIAAAIZACQCiABPAnYARAKIAE8CdgBEAogATwJ2AEQCrQApAeIALAL3AE8CdgAsAvcATwJ2ACwC9wBPAnYALAL3AE8CdgAsAvcATwJ2ACwCYwBPAj4ALAJjAE8CPgAsAmMATwI+ACwCYwBPAj4ALAJjAE8CPgAsAj4ATwFgAAwDCgApAnYALALlAE8CPgBEAuUATwI+AEQC5QBPAj4ARALlABoCPgAIAuUATwI+AEQBFv/TAQT/ygEW/9cBBP/OAq0ATwIZAEQCrQBPAhkARAKtAE8CGQBEAgcATwEEADUCBwBPAQT/4gIHAE8BBP/iAgcATwEE/8wDngBSA2YAPwOeAFIDZgA/A54AUgNmAD8DHABPAj4ARAMcAE8CPgBEAxwATwI+AEQDHABPAj4ARANBACkCYgAsA0EAKQJiACwDQQApAmIALANBACkCYgAsAmMATwJ2AEQCYwBPAnYARAJ2AE8BhQBEAnYATwGFADUCdgBPAYUANAJ2AE8BhQA9Aj4AHwG8ABkCPgAfAbwAGQI+AB8BvAAZAj4AHwG8ABkCPgAfAbwAGQI+AAcBhQAMAj4ABwGFAAwCPgAHAYUADAI+AAcBhQAMAtIATAI+AEQC0gBMAj4ARALSAEwCPgBEAtIATAI+AEQC0gBMAj4ARAKb//0CBwADApv//QIHAAMD1QAAAxwAAwPVAAADHAADA9UAAAMcAAMD1QAAAxwAAwPVAAADHAADAq0AAAIZ//8CrQAAAhn//wJ2//ICBwADAmMAIwHiACICYwAjAeIAIgJjACMB4gAiAj4ARAGFAAcDHAADAgcAAwLSAAACGQAkAtIAAAIZACQC0gAAAhkAJALS/5cCGf8uAtIAAAIZACQC0gAAAhkAJALSAAACGQAkAtIAAAIZACQC0gAAAhkAJALSAAACGQAkAtIAAAIZACQC0gAAAhkAJAJjAE8CPgAsAmMATwI+ACwCYwBPAj4ALAJjAE8CPgAsAmP/cAI+/00CYwBPAj4ALAJjAE8CPgAsAmMATwI+ACwBFgAgAQQAFAEWAD4BBAA1A0EAKQJiACwDQQApAmIALANBACkCYgAsA0H/zQJi/18DQQApAmIALANBACkCYgAsA0EAKQJiACwDdgApAo8ALAN2ACkCjwAsA3YAKQKPACwDdgApAo8ALAN2ACkCjwAsAtIATAI+AEQC0gBMAj4ARAM/AEwCuQBEAz8ATAK5AEQDPwBMArkARAM/AEwCuQBEAz8ATAK5AEQCdv/yAgcAAwJ2//ICBwADAnb/8gIHAAMCdv/yAgcAAwH0AAAD6AAAASgANAEoADQBKAA0AgcAOgIHADoCBwA7AlEAKQJRAC8B9ABJA+gAVwSPAAcBKAAeASgAJgCn/1oCYgAPBD0AKAPOACgB9AAgBIgAXgPoACgC9wAuAq0ATwLSAAAB9AAsARYATAIsAEwDQgBMA7EATAKb//0Dsf/9BMf//QXd//0DwwBMAq0AAAPDAAAE2QAAAgcATwKtACkC9wBPA54AUgEEADUCCAA1AwwANQMLADUCBwADAwsAAwQPAAMFEwADAx0ANQIZ//8DHf//BCH//wEEAEYB4gAsAnYALANmAD8CLAAoAq0ACALlAD4CiAAZApoAPgCn/1oBKABEAhn/9AMvAC0CYwBbApoAPwKaAFACmgBQApoAUAJRAEUBBP/GAQQAUwEE/8wBBP/NAQT/ygEE/84BBP/iAQT/2AEEABkBBP/sAQQANQEEADABBAAcAQQAJgNsAGgCUQAMAlEADAEoACkBKABHASgAKQEoAEcCBwAzA+gBpwPoAcQB9ADKAfQA4QH0AOEBKP7oASj+yAEW/uH+vf7m/rgAAAAAAAEAAAAA0HA/1gAAAADCV26ZAAAAAMxGBzw=\n".trim()
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

},{}],25:[function(require,module,exports){
var d3 = require('d3');
var identity = require('./discontinuityProviders/identity');


module.exports = function() {
    return discontinuableDateTime();
};

// obtains the ticks from the given scale, transforming the result to ensure
// it does not include any discontinuities
module.exports.tickTransformer = function(ticks, discontinuityProvider, domain) {
    var clampedTicks = ticks.map(function(tick, index) {
        if (index < ticks.length - 1) {
            return discontinuityProvider.clampUp(tick);
        } else {
            var clampedTick = discontinuityProvider.clampUp(tick);
            return clampedTick < domain[1] ?
                clampedTick : discontinuityProvider.clampDown(tick);
        }
    });
    var uniqueTicks = clampedTicks.reduce(function(arr, tick) {
        if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
            arr.push(tick);
        }
        return arr;
    }, []);
    return uniqueTicks;
};

/**
* The `discontinuableDateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
* As an example, you can use this scale to render a chart where the weekends are skipped.
*/
function discontinuableDateTime(adaptedScale, discontinuityProvider) {

    if (!arguments.length) {
        adaptedScale = d3.time.scale();
        discontinuityProvider = identity();
    }

    function scale(date) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        // The discontinuityProvider is responsible for determine the distance between two points
        // along a scale that has discontinuities (i.e. sections that have been removed).
        // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
        // over the domain of this axis, versus the discontinuous distance to 'x'
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = discontinuityProvider.distance(domain[0], date);
        var ratioToX = distanceToX / totalDomainDistance;
        var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
        return scaledByRange;
    }

    scale.invert = function(x) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();

        var ratioToX = (x - range[0]) / (range[1] - range[0]);
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = ratioToX * totalDomainDistance;
        return discontinuityProvider.offset(domain[0], distanceToX);
    };

    scale.domain = function(x) {
        if (!arguments.length) {
            return adaptedScale.domain();
        }
        // clamp the upper and lower domain values to ensure they
        // do not fall within a discontinuity
        var domainLower = discontinuityProvider.clampUp(x[0]);
        var domainUpper = discontinuityProvider.clampDown(x[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.nice = function() {
        adaptedScale.nice();
        var domain = adaptedScale.domain();
        var domainLower = discontinuityProvider.clampUp(domain[0]);
        var domainUpper = discontinuityProvider.clampDown(domain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
    };

    scale.ticks = function() {
        var ticks = adaptedScale.ticks.apply(this, arguments);
        return module.exports.tickTransformer(ticks, discontinuityProvider, scale.domain());
    };

    scale.copy = function() {
        return discontinuableDateTime(adaptedScale.copy(), discontinuityProvider.copy());
    };

    scale.discontinuityProvider = function(x) {
        if (!arguments.length) {
            return discontinuityProvider;
        }
        discontinuityProvider = x;
        return scale;
    };

    return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
        'tickFormat');
}

},{"./discontinuityProviders/identity":26,"d3":"d3"}],26:[function(require,module,exports){
var d3 = require('d3');


/**
    # Discontinuity Providers

    The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps. As an
    example, you can use this scale to render a chart where the weekends are skipped.

    You can use a discontinuity provider to inform the `dateTime` scale of the discontinuities between a particular range of dates. In order
    to achieve this, the discontinuity provider must expose the following functions:

     + `clampUp` - When given a date, if it falls within a discontinuity (i.e. an excluded period of time) it should be shifted
     forwards in time to the discontinuity boundary. Otherwise, it should be returned unchanged.
     + `clampDown` - When given a date, if it falls within a discontinuity (i.e. an excluded period of time) it should be shifted
     backwards in time to the discontinuity boundary. Otherwise, it should be returned unchanged.
     + `distance` - When given a pair of dates this function returns the number of milliseconds between the two dates minus any
     discontinuities.
     + `offset` - When given a date and a number of milliseconds, the date should be advanced by the number of milliseconds, skipping
     any discontinuities, to return the final date.
     + `copy` - When the `dateTime` scale is copied, the discontinuity provider is also copied.
 */
module.exports = function() {

    var identity = {};

    identity.distance = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    };

    identity.offset = function(startDate, ms) {
        return new Date(startDate.getTime() + ms);
    };

    identity.clampUp = function(date) {
        return date;
    };

    identity.clampDown = function(date) {
        return date;
    };

    identity.copy = function() { return identity; };

    return identity;
};

},{"d3":"d3"}],27:[function(require,module,exports){
var d3 = require('d3');

var createIntraDay = function(openTime, closeTime) {

    if (!openTime) {
        throw new Error("You need to provide an opening time as 24H time, i.e. 08:30");
    }

    if (!closeTime) {
        throw new Error("You need to provide a closing time as 24H time, i.e. 16:30");
    }

    var open = openTime;
    var close = closeTime;


    var millisPerDay = 864e5;
    var millisPerWorkDay = calculateMillis();
    var millisPerWorkWeek = millisPerWorkDay * 5;
    var millisPerWeek = millisPerDay * 7;

    var intraDay = {};


    function calculateMillis() {
        var openHour = +open.split(':')[0];
        var openMinute = +open.split(':')[1];
        var closeHour = +close.split(':')[0];
        var closeMinute = +close.split(':')[1];
        var openDate = new Date(1970, 0, 0, openHour, openMinute);
        var closeDate = new Date(1970, 0, 0, closeHour, closeMinute);
        return closeDate.getTime() - openDate.getTime();
    }

    function isWeekend(date) {
        return [0, 6].indexOf(date.getDay()) >= 0;
    }

    function isTradingHours(date) {

        if (isWeekend(date)) {
            return false;
        }

        var openDate = dateFromTime(date, open);
        var closeDate = dateFromTime(date, close);

        return (openDate <= date) && (date <= closeDate);
    }

    // given a date and a time in 24h,
    // create a new date with the time
    // specified
    function dateFromTime(date, time) {
        var hour = +time.split(':')[0];
        var minute = +time.split(':')[1];
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute
        );
    }

    function calculateOpenTimeFor(date) {
        return dateFromTime(date, open);
    }

    function calculateCloseTimeFor(date) {
        return dateFromTime(date, close);
    }

    function moveToNextBoundary(date) {
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        if (date.getTime() === closeTimeToday.getTime()) {
            // add a second and clamp, you'll get tomorrow
            date = intraDay.clampUp(new Date(date.getTime() + 1000));
            return date;
        }

        return closeTimeToday;

    }

    function moveToPrevBoundary(date) {
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        if (date.getTime() === openTimeToday.getTime()) {
            // add a second and clamp, you'll get tomorrow
            return intraDay.clampDown(new Date(date.getTime() - 1000));
        }

        return openTimeToday;

    }

    function findWeekends(startDate, endDate) {
        var counter = new Date(startDate.getTime());
        var weekendDays = 0;

        while (counter < endDate) {
            if (isWeekend(counter)) {
                weekendDays++;
            }
            counter = d3.time.day.offset(counter, 1);
        }

        return weekendDays * millisPerWorkDay;

    }


    intraDay.clampDown = function(date) {
        // first move the date back into the week
        // if it's in the weekend
        if (isWeekend(date)) {
            var daysToSubtract = date.getDay() === 0 ? 2 : 1;
            var newDate = d3.time.day.ceil(date);
            date = d3.time.day.offset(newDate, -daysToSubtract);
        }
        // and now check if it's working hours
        if (isTradingHours(date)) {
            return date;
        }

        // when we get here, we know it's not a weekend or working hours, so
        // we have to find the closest date
        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        // date is before open time
        if (date < openTimeToday) {
            // we gotta return yesterday's close time, if it is
            // monday, then it's 3 days back, otherwise it is just one
            var prevWorkDays = date.getDay() === 1 ? 3 : 1;
            var yesterdayClose = d3.time.day.offset(closeTimeToday, -prevWorkDays);
            return yesterdayClose;
        }

        // date is after close time today
        if (date > closeTimeToday) {
            return closeTimeToday;
        }

        return date;

    };

    intraDay.clampUp = function(date) {
        // first move the date forward into the week
        // if it's in the weekend
        if (isWeekend(date)) {
            var daysToAdd = date.getDay() === 0 ? 2 : 1;
            var newDate = d3.time.day.ceil(date);
            date = d3.time.day.offset(newDate, daysToAdd);
        }

        // check if it's working hours after moving it
        // out of the weekend
        if (isTradingHours(date)) {
            return date;
        }

        var openTimeToday = calculateOpenTimeFor(date);
        var closeTimeToday = calculateCloseTimeFor(date);

        // date is before open time
        if (date < openTimeToday) {
            return openTimeToday;
        }

        if (date > closeTimeToday) {
            var nextWorkDays = (date.getDay() === 5) ? 3 : 1;
            var tomorrowOpen = d3.time.day.offset(openTimeToday, nextWorkDays);
            return tomorrowOpen;
        }

    };

    // number of ms within discontinuities along the scale
    intraDay.distance = function(startDate, endDate) {
        startDate = intraDay.clampUp(startDate);
        endDate = intraDay.clampDown(endDate);

        var openTimeStart = calculateOpenTimeFor(startDate);
        var closeTimeStart = calculateCloseTimeFor(startDate);
        var openTimeEnd = calculateOpenTimeFor(endDate);
        var closeTimeEnd = calculateCloseTimeFor(endDate);

        if (endDate < closeTimeStart) {
            return endDate.getTime() - startDate.getTime();
        }

        var msStartDayAdded = closeTimeStart.getTime() - startDate.getTime();
        var msEndDayRemoved = openTimeEnd.getTime() - endDate.getTime();

        var offsetDayStart = d3.time.day.ceil(startDate);
        var offsetDayEnd = d3.time.day.floor(endDate);
        var days = (offsetDayEnd.getTime() - offsetDayStart.getTime()) / millisPerDay;

        var weekendTime = findWeekends(startDate, endDate);

        return days * millisPerWorkDay + msStartDayAdded - msEndDayRemoved - weekendTime;

    };

    intraDay.offset = function(startDate, ms) {
        var date = isTradingHours(startDate) ? startDate : intraDay.clampUp(startDate);
        var remainingms = Math.abs(ms);
        var diff;

        if (ms >= 0) {
            while (remainingms > 0) {
                var closeTimeStart = calculateCloseTimeFor(date);
                diff = closeTimeStart.getTime() - date.getTime();
                if (diff < remainingms) {
                    date = new Date(date.getTime() + diff);
                    remainingms -= diff;

                    // we've crossed a boundary;
                    date = moveToNextBoundary(date);
                } else {
                    return new Date(date.getTime() + remainingms);
                }

            }
        } else {
            // we're going backwards!
            while (remainingms > 0) {
                var openTimeStart = calculateOpenTimeFor(date);
                diff = date.getTime() - openTimeStart.getTime();
                if (diff < remainingms) {
                    date = new Date(date.getTime() - diff);
                    remainingms -= diff;

                    date = moveToPrevBoundary(date);
                } else {
                    return new Date(date.getTime() - remainingms);
                }

            }
        }

        return date;

    };

    intraDay.copy = function() {
        return createIntraDay(open, close);
    };

    return intraDay;
};

module.exports = createIntraDay;

},{"d3":"d3"}],28:[function(require,module,exports){
var d3 = require('d3');

module.exports = function () {
    var millisPerDay = 24 * 3600 * 1000;
    var millisPerWorkWeek = millisPerDay * 5;
    var millisPerWeek = millisPerDay * 7;

    var skipWeekends = {};

    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    skipWeekends.clampDown = function(date) {
        if (isWeekend(date)) {
            var daysToSubtract = date.getDay() === 0 ? 2 : 1;
            // round the date up to midnight
            var newDate = d3.time.day.ceil(date);
            // then subtract the required number of days
            return d3.time.day.offset(newDate, -daysToSubtract);
        } else {
            return date;
        }
    };

    skipWeekends.clampUp = function(date) {
        if (isWeekend(date)) {
            var daysToAdd = date.getDay() === 0 ? 1 : 2;
            // round the date down to midnight
            var newDate = d3.time.day.floor(date);
            // then add the required number of days
            return d3.time.day.offset(newDate, daysToAdd);
        } else {
            return date;
        }
    };

    // returns the number of included milliseconds (i.e. those which do not fall)
    // within discontinuities, along this scale
    skipWeekends.distance = function(startDate, endDate) {
        startDate = skipWeekends.clampUp(startDate);
        endDate = skipWeekends.clampDown(endDate);

        // move the start date to the end of week boundary
        var offsetStart = d3.time.saturday.ceil(startDate);
        if (endDate < offsetStart) {
            return endDate.getTime() - startDate.getTime();
        }

        var msAdded = offsetStart.getTime() - startDate.getTime();

        // move the end date to the end of week boundary
        var offsetEnd = d3.time.saturday.ceil(endDate);
        var msRemoved = offsetEnd.getTime() - endDate.getTime();

        // determine how many weeks there are between these two dates
        var weeks = (offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek;

        return weeks * millisPerWorkWeek + msAdded - msRemoved;
    };

    skipWeekends.offset = function(startDate, ms) {
        var date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;
        var remainingms = ms;

        // move to the end of week boundary
        var endOfWeek = d3.time.saturday.ceil(date);
        remainingms -= (endOfWeek.getTime() - date.getTime());

        // if the distance to the boundary is greater than the number of ms
        // simply add the ms to the current date
        if (remainingms < 0) {
            return new Date(date.getTime() + ms);
        }

        // skip the weekend
        date = d3.time.day.offset(endOfWeek, 2);

        // add all of the complete weeks to the date
        var completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
        date = d3.time.day.offset(date, completeWeeks * 7);
        remainingms -= completeWeeks * millisPerWorkWeek;

        // add the remaining time
        date = new Date(date.getTime() + remainingms);
        return date;
    };

    skipWeekends.copy = function() { return skipWeekends; };

    return skipWeekends;
};

},{"d3":"d3"}],29:[function(require,module,exports){
module.exports = {
    intraDay: require('./intra-day.js')
};

},{"./intra-day.js":30}],30:[function(require,module,exports){
var discontScale = require('./discontinuableDateTime');
var intraDayDiscontinuity = require('./discontinuityProviders/intra-day');
var skipWeekends = require('./discontinuityProviders/skipWeekends');

/*
this is just a wrapper for the discontinuity scale, so that we get
a scale
 */
module.exports = function(open, close) {

    return discontScale()
        .discontinuityProvider(intraDayDiscontinuity(open, close));

};

},{"./discontinuableDateTime":25,"./discontinuityProviders/intra-day":27,"./discontinuityProviders/skipWeekends":28}],31:[function(require,module,exports){
var colours = {
    line: [
        '#154577', '#58BDBB', '#009A8E', '#B0D480', '#F9A71A', '#EE5427', '#AC252A'
    ],
    column: [
        '#154577', '#58BDBB', '#009A8E', '#B0D480', '#F9A71A', '#EE5427', '#AC252A', '#b8b1a9'
    ],
    bar: [
        '#154577', '#58BDBB', '#009A8E', '#B0D480', '#F9A71A', '#EE5427', '#AC252A', '#b8b1a9'
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
            'background': 'transparent'
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
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'AvenirLightOblique, sans-serif',
            'font-size': 12,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'AvenirLightOblique, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'chart-footnote',
        'attributes': {
            'font-family': 'AvenirLightOblique, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'fill': 'rgba(0, 0, 0, 1)',
            'padding-y': 5
        }
    },
    {   'id': 'chart-plot',
        'attributes': {
            'padding-x': 0.05
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'AvenirLight, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': 'rgba(0, 0, 0, 0.8)',
            'padding-y': 8
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-width': 1
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.1)',
            'stroke-width': 1
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 1)',
            'stroke-width': 1
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
            'font-size': 12,
            'font-family': 'AvenirLight, sans-serif',
            'stroke': 'none',
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'axis-secondary-text',
        'selector': '.axis .secondary text',
        'attributes': {
            'font-size': 10,
            'fill': 'rgba(0, 0, 0, 1)'
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
    }
];
module.exports.theme.colours = colours;

},{}],32:[function(require,module,exports){
var PADDING = 0;
var colours = {
    line: [
        "#004b6c","#c99b2d","#bac9b8","#4988ad","#8d221f", "#dee3dd"
    ],
    bar: [
        '#006791', '#003149', '#5288a5', '#80a9ac', '#bac9b8', '#d3e2eb'
    ],
    column: [
        '#006791', '#003149', '#5288a5', '#80a9ac', '#bac9b8', '#d3e2eb'
    ],
    accent: 'rgb(221,183,49)',
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
        'attributes': {
            background: 'none'
        }
    },
    //lines
    {
        'id': 'lines',
        'selector': 'path.line, line.key__line',
        'attributes': {
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
            'stroke-width': 3
        }
    },
    //Columns
    {   'id': 'columns',
        'attributes': {
            'stroke-width': 0
        }
    },
    //bars
    {   'id': 'bars',
        'attributes': {
            'stroke-width': 0
        }
    },
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
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': '12',
            'line-height': 12,
            'font-weight': 400,
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': '9.2',
            'line-height': 12,
            'font-weight': 400,
            'fill': 'rgba(0, 0, 0, 1)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': '9.2',
            'line-height': 16,
            'font-weight': 400,
            'padding': 3,
            'background': 'white',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': '7.2',
            'line-height': 10,
            'font-weight': 400
        }
    }, {
        'id': 'chart-footnote',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': '9.6',
            'line-height': 16,
            'font-weight': 400
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#111111',
            'stroke-width': '0.3'
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#111111',
            'stroke-width': '0.3'
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': '#111111',
            'stroke-width': '0.3'
        }
    },
    // position plot lines, options: 'front', 'back'
    {   'id': 'axis-layer',
        'attributes': {
            'position': 'back'
        }
    },
    {   'id': 'axis-text',
        'attributes': {
            'font-size': '9.6',
            'font-family': 'MetricWeb, sans-serif',
            'stroke': 'none',
            'font-weight': 400,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'axis-secondary-text',
        'attributes': {
            'font-size': '9.6',
            'font-family': 'MetricWeb, sans-serif',
            'font-weight': 400,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {
        'id': 'x-axis-text',
        'attributes': {
            'text-anchor': 'start'
        }
    },
    {
        'id': 'y-axis-text',
        'attributes': {
            'text-anchor': 'end'
        }
    },
    {   'id': 'chart-logo',
        'attributes': {
            'display': 'none'
        }
    }
];
module.exports.theme.colours = colours;

},{}],33:[function(require,module,exports){
var PADDING = 8;
var colours = {
    line: [
        'rgb(180,63,51)', 'rgb(92,141,179)', 'rgb(165,174,103)', 'rgb(238,168,88)', 'rgb(163,91,133)', 'rgb(157,153,151)'
    ],
    bar: [
        'rgb(180,63,51)', 'rgb(92,141,179)', 'rgb(165,174,103)', 'rgb(238,168,88)', 'rgb(163,91,133)', 'rgb(157,153,151)'
    ],
    column: [
        'rgb(180,63,51)', 'rgb(92,141,179)', 'rgb(165,174,103)', 'rgb(238,168,88)', 'rgb(163,91,133)', 'rgb(157,153,151)'
    ],
    accent: '#9e2f50',
    border: 'rgb(243, 236, 228)'
};
var gradients = {
    bar: [
        'url(#hgradient--series1)', 'url(#hgradient--series2)', 'url(#hgradient--series3)', 'url(#hgradient--series4)', 'url(#hgradient--series5)', 'url(#hgradient--series6)'
    ],
    column: [
        'url(#gradient--series1)', 'url(#gradient--series2)', 'url(#gradient--series3)', 'url(#gradient--series4)', 'url(#gradient--series5)', 'url(#gradient--series6)'
    ]
};

function linearGradient(id, start, stop, positions){
    var x1 = positions.x1 || 0;
    var x2 = positions.x2 || 0;
    var y1 = positions.y1 || 0;
    var y2 = positions.y2 || 0;
    return ['<linearGradient id="' + id + '" x1="' + x1 + '" x2="' + x2 + '" y1="' + y1 + '" y2="' + y2 + '">',
        '<stop offset="0%" stop-color="' + start + '"/>',
        '<stop offset="100%" stop-color="' + stop + '"/>',
        '</linearGradient>'].join('');
}

function seriesGradient(chart, idPrefix, series, positions){
    var start = colours[chart][series-1];
    var stop = colours[chart][series-1].replace('rgb','rgba').replace(')',',0.5)');
    return linearGradient(idPrefix + series, start, stop, positions);
}

module.exports.defs = {
    'gradient--series1': seriesGradient('column', 'gradient--series', 1, {y2:1}),
    'gradient--series2': seriesGradient('column', 'gradient--series', 2, {y2:1}),
    'gradient--series3': seriesGradient('column', 'gradient--series', 3, {y2:1}),
    'gradient--series4': seriesGradient('column', 'gradient--series', 4, {y2:1}),
    'gradient--series5': seriesGradient('column', 'gradient--series', 5, {y2:1}),
    'gradient--series6': seriesGradient('column', 'gradient--series', 6, {y2:1}),
    'hgradient--series1': seriesGradient('bar', 'hgradient--series', 1, {x1:1}),
    'hgradient--series2': seriesGradient('bar', 'hgradient--series', 2, {x1:1}),
    'hgradient--series3': seriesGradient('bar', 'hgradient--series', 3, {x1:1}),
    'hgradient--series4': seriesGradient('bar', 'hgradient--series', 4, {x1:1}),
    'hgradient--series5': seriesGradient('bar', 'hgradient--series', 5, {x1:1}),
    'hgradient--series6': seriesGradient('bar', 'hgradient--series', 6, {x1:1})
};

// SPECIAL 'non-svg' ATTRIBUTES:
// padding-x: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding-y: applied to the SVG (affects svg > child) and 'text' elements (dressing/index.js does this)
// padding:   applied to 'text' elements (dressing/index.js does this)
// align:     applied to 'text' elements (dressing/index.js does this)
// background:applied to 'text' elements (dressing/index.js does this)
// position:  absolute. applied to 'text' elements (dressing/index.js does this). means the height isnt accumulated.
// border:    applied to 'line' and 'path' elements (dressing/index.js does this)

module.exports.theme = [
    //general
    {
        'selector': 'path.accent, line.accent, rect.accent',
        'attributes': {
            'stroke': colours.accent
        }
    },
    {
        'id': 'svg',
        'attributes': {
            'padding-x': 52,
            'padding-y': 25,
            'background': 'rgb(229,216,196)'
        }
    },
    {   'id': 'chart',
        'attributes': {
            'padding': PADDING
        }
    },
    {   'id': 'chart-logo',
        'attributes': {
            'display': 'none'
        }
    },

    //lines
    {
        'id': 'lines',
        'attributes': {
            'border': colours.border,
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
        }
    },
    //Columns
    {   'id': 'columns',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 2
        }
    },
    //bars
    {   'id': 'bars',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 2
        }
    },
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
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 20,
            'padding': PADDING,
            'font-weight': '600',
            'fill': 'rgba(255, 255, 255, 1)',
            'background': 'rgb(124,120,119)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 14,
            'line-height': 14,
            'fill': '#43423e',
            'padding': PADDING
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 14,
            'line-height': 16,
            'font-weight': '600',
            'fill': '#43423e',
            'padding': PADDING
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 12,
            'line-height': 14,
            'fill': '#43423e',
            float: 'right',
            'padding-x': PADDING
        }
    },
    {   'id': 'chart-footnote',
        'attributes': {
            'font-family': 'MetricWebSemiBold, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': '#43423e',
            align: 'left',
            'padding-x': PADDING
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(255, 255, 255, 1)',
            'stroke-width': 2
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(255, 255, 255, 1)',
            'stroke-width': 2
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(255, 255, 255, 1)',
            'stroke-width': 2
        }
    },
    // position plot lines, options: 'front', 'back'
    {   'id': 'axis-layer',
        'attributes': {
            'position': 'back'
        }
    },
    {
        'id': 'axis-text',
        'attributes': {
            'font-size': 14,
            'font-family': 'MetricWebSemiBold, sans-serif',
            'stroke': 'none',
            'font-weight': '600',
            'fill': '#43423e'
        }
    },
    {
        'id': 'axis-secondary-text',
        'attributes': {
            'font-size': 12,
            'font-weight': '600',
            'fill': '#43423e'
        }
    },
    {
        'id': 'x-axis-text',
        'attributes': {
            'text-anchor': 'start'
        }
    },
    {
        'id': 'y-axis-text',
        'attributes': {
            'text-anchor': 'end'
        }
    }
];

module.exports.theme.colours = colours;
module.exports.theme.gradients = gradients;

},{}],34:[function(require,module,exports){
var colours = {
    line: [
        '#af516c', '#ecafaf', '#d7706c', '#76acb8', '#7fd8f5', '#3d7ab3', '#b8b1a9'
    ],
    column: [
        '#bb6d82', '#ecafaf', '#d7706c', '#cb9f8c', '#b07979', '#ccc2c2', '#8f7d95', '#b8b1a9'
    ],
    bar: [
        '#bb6d82', '#ecafaf', '#d7706c', '#cb9f8c', '#b07979', '#ccc2c2', '#8f7d95', '#b8b1a9'
    ],
    accent: '#9e2f50'
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
            'background': '#fff1e0'
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
        }
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
            'font-family': 'BentonSans, sans-serif',
            'font-size': 18,
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'chart-footnote',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 15,
            'fill': 'rgba(0, 0, 0, 0.5)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'BentonSans, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'fill': 'rgba(0, 0, 0, 0.5)',
            'padding-y': 8
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-dasharray': 'none'
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.1)',
            'stroke-dasharray': '2 2'
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(0, 0, 0, 0.3)',
            'stroke-dasharray': 'none'
        }
    },
    // position plot lines, options: 'front', 'back'
    {   'id': 'axis-layer',
        'attributes': {
            'position': 'back'
        }
    },
    {   'id': 'axis-text',
        'attributes': {
            'font-size': 12,
            'font-family': 'BentonSans, sans-serif',
            'stroke': 'none',
            'fill': '#757470'
        }
    },
    {   'id': 'axis-secondary-text',
        'selector': '.axis .secondary text',
        'attributes': {
            'font-size': 10,
            'fill': '#757470'
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
            'text-anchor': 'end'
        }
    }
];
module.exports.theme.colours = colours;

},{}],35:[function(require,module,exports){
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

},{"./ft-nar":31,"./ft-print":32,"./ft-video":33,"./ft-web":34,"d3":"d3"}],36:[function(require,module,exports){
// More info:
// http://en.wikipedia.org/wiki/Aspect_ratio_%28image%29

var commonRatios = {
    square: {width: 1, height: 1},
    standard: {width: 4, height: 3},
    golden: {width: 1.618, height: 1},
    classicPhoto: {width: 3, height: 2},
    widescreen: {width: 16, height: 9},
    panoramic: {width: 2.39, height: 1}
};

function getRatio(name) {
    if (!name) return;

    if (name in commonRatios) {
        return commonRatios[name];
    }

    if (typeof name === 'string') {
        var p = name.split(':');
        return {width: p[0], height: p[1]};
    }

    return name;
}

module.exports = {

    commonRatios: commonRatios,

    widthFromHeight: function (height, ratio) {

        ratio = getRatio(ratio);

        if (!ratio) {
            throw new Error('Ratio is falsey');
        }

        if (typeof ratio === 'number') return height * ratio;

        if (!ratio.height || !ratio.width) {
            throw new Error('Ratio must have width and height values');
        }

        ratio = ratio.width / ratio.height;

        return Math.ceil(height * ratio);
    },

    heightFromWidth: function (width, ratio) {

        ratio = getRatio(ratio);

        if (!ratio) {
            throw new Error('Ratio is falsey');
        }

        if (typeof ratio === 'number') return width * ratio;

        if (!ratio.height || !ratio.width) {
            throw new Error('Ratio must have width and height values');
        }

        ratio = ratio.height / ratio.width;

        return Math.ceil(width * ratio);
    }
};

},{}],37:[function(require,module,exports){
var d3 = require('d3');
var lineThickness = require('../util/line-thickness.js');
var ratios = require('../util/aspect-ratios.js');
var seriesOptions = require('../util/series-options.js');
var dateUtil = require('../util/dates.js');
var themes = require('../themes');

function isDate(d) {
    return d && d instanceof Date && !isNaN(+d);
}

function translate(margin) {
    return function (position) {
        var left = position.left || 0;
        var top = position.top || 0;
        return 'translate(' + (margin + left) + ',' + top + ')';
    };
}

function chartWidth(model) {
    if (model.chartWidth) {
        return model.chartWidth;
    }
    var rightGutter = model.contentWidth < 260 ? 16 : 26;
    if (model.paddingX) rightGutter = 0;
    return model.contentWidth - rightGutter - model.chartPadding * 2;
}

function setExtents(model){
	var extents = [];
	model.y.series.forEach(function (l) {
		var key = l.key;
		model.data = model.data.map(function (d, j) {
			var value = (Array.isArray(d.values)) ? d.values[0][key] : d[key];
			var isValidNumber = value === null || typeof value === 'number';
			if (!isValidNumber) {
				model.error({
					node: null,
					message: 'Value is not a number',
					value: value,
					row: j,
					column: key
				});
			}
			return d;
		});
		var ext = d3.extent(model.data, function(d){
			return (Array.isArray(d.values)) ? d.values[0][key] : d[key];
		});
		extents = extents.concat (ext);
	});
	return extents;
}

function findOpenCloseTimes(model) {
    var maxGap = Number.MIN_VALUE;
    var gapIndex;

    var gaps = [];
    // brute force search for maximum gap.
    // this will also work for weekend skips
    // since intra-day skips weekends automatically
    model.data.forEach(function(d, i) {
        if (!i) return;
        var prevdt = model.data[i-1][model.x.series.key];
        var dt = d[model.x.series.key];
        var gap = dt - prevdt;

        // weekend gaps
        if (gap > 1000 * 60 * 60 * 24 * 2) {
            return;
        }
        gaps.push([i, gap]);
        if (gap > maxGap) {
            gapIndex = i;
            maxGap = gap;
        }
    });

    var openTime = model.data[gapIndex][model.x.series.key];
    var closeTime = model.data[gapIndex-1][model.x.series.key];

    var fmt = d3.time.format("%H:%M");

    var open = fmt(new Date(openTime.getTime()));
    var close = fmt(new Date(closeTime.getTime()));

    // ;_; side effects ewww
    model.open = open;
    model.close = close;

}




function independentDomain(model, chartType) {
    if (model.independentDomain) { return model.independentDomain;  }

    var isCategorical = model.dataType === 'categorical';
    var isBarOrColumn = ['column', 'bar'].indexOf(chartType) >= 0;

    if ((model.groupData || isCategorical) && isBarOrColumn){
        model.data = (model.groupData && !isCategorical) ? groupDates(model, model.units) : model.data;
        return model.data.map(function (d) {
            return d[model.x.series.key];
        });
    } else {
        return d3.extent(model.data, function (d) {
            return d[model.x.series.key];
        });
    }
}

function sumStackedValues(model){
    var extents = [];
    model.data.map(function (d, j) {
        var key, sum = 0;
        var values = Array.isArray(d.values) ? d.values[0] : d;
        for (key in values) {
            if (key !== model.x.series.originalKey) {
                sum += values[key];
            }
        }
        extents.push(sum);
    });
    return extents;
}

function dependentDomain(model, chartType){
    if(model.dependentDomain){ return model.dependentDomain; }

    var extents = setExtents(model);
    var domain = d3.extent(extents);
    if(!model.falseOrigin && domain[0] > 0){
        domain[0] = 0;
    }

    var isBarOrColumn = ['column', 'bar'].indexOf(chartType) >= 0;
    if (isBarOrColumn && domain[1] < 0) {
        domain[1] = 0;
    }

    return domain;
}

function chartHeight(model) {
    if (model.chartHeight) {
        return model.chartHeight - model.paddingY*2;
    }
    var isNarrow = model.chartWidth < 220;
    var isWide = model.chartWidth > 400;
    var ratio = isNarrow ? 1.1 : (isWide ? ratios.commonRatios.widescreen : ratios.commonRatios.standard);
    return ratios.heightFromWidth(model.chartWidth, ratio) - model.paddingY*2;
}

function stackSeries(model) {
    var data = JSON.parse(JSON.stringify(model.data));
    return !Array.isArray(data) ? [] : data.map(function (dataItem, i) {
      delete dataItem[model.x.series.key];
      var chartValues = [];
      for (var item in dataItem) {
        chartValues.push(dataItem[item]);
      }
      return chartValues;
    });
}

function verifyData(model) {
    return !Array.isArray(model.data) ? [] : model.data.map(function (dataItem, i) {

        var s = dataItem[model.x.series.key];
        var error = {
            node: null,
            message: '',
            row: i,
            column: model.x.series.key,
            value: s
        };

        if (!dataItem) {
            error.message = 'Empty row';
        } else if (!s) {
            error.message = 'X axis value is empty or null';
        } else if (!isDate(s) && model.chartType == 'line') {
            error.message = 'Value is not a valid date';
        }

        if (error.message) {
            model.error(error);
            dataItem[model.x.series.key] = null;
        }

        return dataItem;

    });
}

function setKey(model) {
    var key = model.key;
    if (typeof model.key !== 'boolean') {
        key = model.y.series.length > 1;
    } else if (model.key && !model.y.series.length) {
        key = false;
    }
    return key;
}

function groupDates(m, units){
    var firstDate = m.data[0][m.x.series.key];
    var data = [];
    m.data.forEach(function(d,i){
        var dateStr = [dateUtil.formatter[units[0]](d[m.x.series.key], i, firstDate)];
        units[1] && dateStr.push(dateUtil.formatter[units[1]](d[m.x.series.key], i, firstDate));
        units[2] && dateStr.push(dateUtil.formatter[units[2]](d[m.x.series.key], i, firstDate));
        data.push({key:dateStr.join(' '),values:[d]});
    });
    m.data = data;
	m.x.series.key = 'key';
	return m.data;
}

function needsGrouping(units){
    if (!units) return false;
    var isGroupingUnit = false;
    units.forEach(function(unit){
        var groupThis = ['weekly', 'quarterly', 'monthly', 'yearly'].indexOf(unit);
        isGroupingUnit = isGroupingUnit || (groupThis>-1);
    });
    return isGroupingUnit;
}

function Model(chartType, opts) {
    var classes = {
        line: ['line--series1', 'line--series2', 'line--series3', 'line--series4', 'line--series5', 'line--series6', 'line--series7', 'accent'],
        column: ['column--series1', 'column--series2', 'column--series3', 'column--series4', 'column--series5', 'column--series6', 'column--series7', 'accent'],
        bar: ['bar--series1', 'bar--series2', 'bar--series3', 'bar--series4', 'bar--series5', 'bar--series6', 'bar--series7', 'accent']
    };
    var m = {
        //layout stuff
        theme: 'ft-web',
        chartType: chartType,
        keyColumns: (chartType == 'column' ? 5 : 1),
        keyHover: false,
        height: undefined,
        paddingX: 0,
        paddingY: 0,
        tickSize: 5,
        width: 300,
        chartHeight: undefined,
        chartWidth: undefined,
        simpleDate: false,
        simpleValue: false,
        logoSize: 28,
        //data stuff
        falseOrigin: false, //TODO, find out if there's a standard 'pipeline' temr for this
        error: this.error,
        lineClasses: {},
        columnClasses: {},
        niceValue: true,
        stack: false,
        dependentAxisOrient: 'left',
        independentAxisOrient: 'bottom',
        margin: 2,
        lineThickness: undefined,
        yLabelWidth: 0,
        xLabelHeight: 0,
        gradients: false,
        x: {
            series: '&'
        },
        y: {
            series: [], reverse: false
        },
        labelLookup: null,
        sourcePrefix: 'Source: '
    };

    for (var key in opts) {
        m[key] = opts[key];
    }

    m.paddingX = themes.check(m.theme, 'svg').attributes['padding-x'] || 0;
    m.paddingY = themes.check(m.theme, 'svg').attributes['padding-y'] || 0;
    m.chartPadding = themes.check(m.theme, 'chart').attributes.padding || 0;
    m.x.series = seriesOptions.normalise(m.x.series);
    m.y.series = seriesOptions.normaliseY(m.y.series)
        .filter(function (d) {
            return !!d.key && d.key !== m.x.series.key;
        })
        .map(function (d, i) {
            d.index = i;
            d.className = classes[chartType][i];
            return d;
        });
    m.colours = themes[m.theme].colours[m.chartType];
	m.contentWidth = m.width - (m.margin * 2) - (m.paddingX * 2);
	m.chartWidth = chartWidth(m);
	m.chartHeight = chartHeight(m);
	m.translate = translate(0);
	m.data = verifyData(m);
  if (m.stack){
    m.stacks = stackSeries(m);
  }
    m.groupData = needsGrouping(m.units);
    m.independentDomain = independentDomain(m, chartType);
	m.dependentDomain = dependentDomain(m, chartType);
	m.lineStrokeWidth = lineThickness(m.lineThickness, m.theme);
	m.key = setKey(m);
    if (m.intraDay) {
        findOpenCloseTimes(m);
    }
    if (themes[m.theme].gradients && !m.stack){
        m.gradients = themes[m.theme].gradients[m.chartType];
    }
    return m;
}

Model.prototype.error = function (err) {
    console.log('ERROR: ', err);
};
module.exports = Model;

},{"../themes":35,"../util/aspect-ratios.js":36,"../util/dates.js":38,"../util/line-thickness.js":41,"../util/series-options.js":43,"d3":"d3"}],38:[function(require,module,exports){
var d3 = require('d3');

var formatter = {
    centuries: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    decades: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    years: function (d, i) {
        if (i === 0 || d.getYear() % 100 === 0) {
            return d3.time.format('%Y')(d);
        }
        return d3.time.format('%y')(d);
    },

    fullYears: function (d, i) {
        return d3.time.format('%Y')(d);
    },
    yearly: function (d, i, firstDate) {
        var years = (firstDate && !Array.isArray(firstDate) &&
        (formatter.years(firstDate, i) == formatter.years(d, i))) ?
            'fullYears' : 'years';

        return formatter[years](d, i);
    },
    quarterly: function (d, i) {
        return 'Q' + Math.floor((d.getMonth() + 3) / 3);
    },
    weekly: function (d, i) {
        return d3.time.format('%W')(d);
    },
    monthly: function (d, i) {
        return formatter.months(d, i);
    },
    shortmonths: function (d, i) {
        return d3.time.format('%b')(d)[0];
    },
    months: function (d, i) {
        return d3.time.format('%b')(d);
    },

    weeks: function (d, i) {
        return d3.time.format('%e %b')(d);
    },

    days: function (d, i) {
        return d3.time.format('%e')(d);
    },

    daily: function (d, i) {
        var str = d3.time.format('%e')(d);
        if (str[0] === ' ') str = str.substring(1);
        return str;
    },

    hours: function (d, i) {
        return parseInt(d3.time.format('%H')(d)) + ':00';
    }
};

function timeDiff(domain){
    if (!domain[0].getTime || !domain[1].getTime) return {};
    var jsTimeDiff = domain[1].getTime() - domain[0].getTime();
    var dayLength = 86400000;
    return {
        days: jsTimeDiff / dayLength,
        months: jsTimeDiff / (dayLength * 30),
        years: jsTimeDiff / (dayLength * 365.25),
        decades: jsTimeDiff / (dayLength * 365.25 * 10),
        centuries: jsTimeDiff / (dayLength * 365.25 * 100)
    };
}

function unitGenerator(domain, simple) {	//which units are most appropriate
    if (!domain[0].getTime || !domain[1].getTime) return [];
    var timeDif = timeDiff(domain);
    var units;
    if (timeDif.days < 2) {
        units = ['hours', 'days', 'months'];
    } else if (timeDif.days < 60) {
        units = ['days', 'months'];
    } else if (timeDif.years < 1) {
        units = ['months', 'years'];
    } else if (timeDif.decades < 1.5) {
        units = ['years'];
    } else if (timeDif.centuries < 1.5) {
        units = ['decades'];
    } else if (timeDif.centuries < 10) {
        units = ['centuries'];
    } else {
        units = ['multi'];
    }
    if (simple && (
        units.indexOf('years') > -1 ||
        units.indexOf('decades') ||
        units.indexOf('centuries'))) {
        units = ['fullYears']; //simple axis always uses full years
    }
    return units;
}

var groups = {
    unknown: function (d, i) {
        return d;
    },
    years: function (d, i) {
        return formatter.years(new Date(d), i);
    },
    yearly: function (d, i) {
        return d.split(' ')[d.split(' ').length-1];
    },
    quarterly: function (d, i) {
        return d.split(' ')[0];
    },
    weekly: function (d, i) {
        return d.split(' ')[0];
    },
    daily: function (d, i) {
        if (d[0] === ' ') {
            d = d.substring(1);
        }
        return d.split(' ')[0];
    },
    monthly: function (d, i) {
        var parts = d.split(' ');
        var pos = (parts.length == 3) ? 1 : 0;
        return parts[pos];
    },
    months: function (d, i) {
        return d.split(' ')[0];
    },
    decades: function (d, i) {
        return d.split(' ')[1];
    },
    centuries: function (d, i) {
        return d.split(' ')[1];
    },
    categorical: function (d, i) {
        return d;
    }
};

module.exports = {
    timeDiff: timeDiff,
    formatGroups: groups,
    formatter: formatter,
    unitGenerator: unitGenerator
};

},{"d3":"d3"}],39:[function(require,module,exports){
var d3 = require('d3');
var dates = require('../util/dates');
var dateFormatter = dates.formatter;

module.exports = {
    extendedTicks : function (g, config) {
        var tickExtender = 1.5;
        var extendedTicks_selector = ".tick line[y2=\"" + (config.tickSize * tickExtender) + "\"]";
        var ticks_selector = ".tick line";

        g.selectAll(ticks_selector)
            .attr("y2", function (d) {
                var formatted = d.getMonth ? dateFormatter[config.units[0]](d) : d.toString();
                var isFirstInPeriod = formatted.indexOf('Q1') === 0 || formatted.indexOf('Jan') === 0;
                return (isFirstInPeriod) ? (config.tickSize * tickExtender) : config.tickSize ;
            });
        var tickCount = g.selectAll(ticks_selector)[0].length;
        var extendedCount = g.selectAll(extendedTicks_selector)[0].length;
        if (extendedCount+2 >= tickCount){
            //take into account of first + last starting on something not q1
            g.selectAll(extendedTicks_selector).attr("y2", config.tickSize);
        }
    },
    add: function(g, config){
        var self = this;
        var options = { row: 0 };

        config.axes.forEach(function (axis, i) {
            self.addRow(g, axis, options, config);
            options.row ++;
        });
        g.selectAll('.axis .primary line').attr(config.attr.ticks);

        //remove text-anchor attribute from year positions
        g.selectAll('.x.axis .primary text')
            .attr({
                x: null,
                y: null,
                dy: 15 + config.tickSize
            });

        //if xAxisLabel is centre-aligned, and chart yAxis is right-aligned, make first xAxisLabel left-aligned
        if(config.attr['chart-type'] === 'line' && config.attr['chart-alignment'] === 'right' && config.attr.primary['text-anchor'] === 'middle') {
          g.selectAll('.x.axis .primary .tick:first-child text')
              .attr({
                'text-anchor': 'start'
              });
        }
    },

    addRow: function(g, axis, options, config){
        var rowClass = (options.row) ? 'secondary': 'primary';
        var attr = config.attr[rowClass] || config.attr.primary;
        g.append('g')
            .attr('class', rowClass)
            .attr('transform', 'translate(0,' + (options.row * config.lineHeight) + ')')
            .call(axis);

        g.selectAll('.axis .' + rowClass + ' text').attr('style','').attr(attr);

        if (config.dataType === 'categorical') {
            return;
        }

        this.removeDuplicates(g, '.' + rowClass + ' text');
        if (options.extendTicks) {
            this.extendedTicks(g, config, options.extendTicks);
        }
        if (dates.unitGenerator(config.scale.domain())[0] == 'days') {
            this.removeDays(g, '.primary text');
        }
        if (config.units[0] == 'quarterly'){
            this.removeQuarters(g, axis, options);
        }
        if (config.units[0] == 'weekly'){
            this.removeWeekly(g, axis, options);
        }
        if (config.units[0] == 'daily'){
            // in this case we don't remove daily ticks
        }
        if (config.units[0] == 'monthly'){
            this.removeMonths(g, axis, options, config);
        }
        this.removeOverlapping(g, '.' + rowClass + ' text', config.attr['chart-alignment'], config.attr['chart-type']);

        this.removePrimaryOverlappingSecondary(g);
    },

    intersection: function (a, b, padding) {
        var PADDING = padding || 3;
        var overlap = (
        a.left <= b.right + PADDING &&
        b.left <= a.right + PADDING &&
        a.top <= b.bottom &&
        b.top <= a.bottom
        );
        return overlap;
    },

    overlapping: function (dElements) {
        var self = this;
        var bounds = [];
        var overlap = false;
        dElements.each(function (d, i) {
            var rect = this.getBoundingClientRect();
            var include = true;
            bounds.forEach(function (b, i) {
                if (self.intersection(b, rect)) {
                    include = false;
                    overlap = true;
                }
            });
            if (include) {
                bounds.push(rect);
            }
        });
        return overlap;
    },

    removeQuarters: function(g, axis, options){
        if (!this.overlapping(g.selectAll(".primary text")) || options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeWeekly: function(g, axis, options){
        if (options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeDaily: function(g, axis, options){
        if (options.extendTicks) return;
        options.row--;
        options.extendTicks = true;
        g.select(".primary").remove();
    },
    removeMonths: function(g, axis, options, config){
        if (g.selectAll(".primary text")[0].length < 13) return;
        options.extendTicks = true;
        var text = g.selectAll('.primary .tick text');
        text.each(function(d,i){
            if (i === 0 || i === text[0].length-1 || d3.select(this).text() == 'Jan') return;
            d3.select(this).remove();
        });
    },

    removeDays: function (g, selector) {
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;

        function remove(d, i) {
            var d3This = d3.select(this);
            if (i !== 0 && i !== elementCount - 1 && d3This.text() != 1) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    },

    removeOverlapping: function (g, selector, alignment, type) {
        var self = this;
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;
        var limit = 5;

        function removeNonOverlappingLabels(count) {
            var firstLabel = dElements[0][0];
            var nextLabel = dElements[0][count];
            if(firstLabel !== undefined && nextLabel !== undefined) {
              if(self.intersection(nextLabel.getBoundingClientRect(), firstLabel.getBoundingClientRect(), 20)) {
                  d3.select(nextLabel).remove();
              }
            }
        }

        function remove(d, i) {
            var last = i === elementCount - 1;
            var previousLabel = dElements[0][elementCount - 2];
            var lastOverlapsPrevious = (last && self.intersection(previousLabel.getBoundingClientRect(), this.getBoundingClientRect()));

            if (last && lastOverlapsPrevious) {
                d3.select(previousLabel).remove();
            } else if (i % 2 !== 0 && !last) {
                d3.select(this).remove();
            }

            if (alignment === 'right' && type === 'line' && i > 0 && i < 3) {
              removeNonOverlappingLabels(i);
            }
        }

        while (self.overlapping(g.selectAll(selector)) && limit > 0) {
            limit--;
            g.selectAll(selector).each(remove);
            dElements = g.selectAll(selector);
            elementCount = dElements[0].length;
        }

        if (alignment === 'right' && type === 'line') {
          removeNonOverlappingLabels(1);
        }
    },

    removePrimaryOverlappingSecondary: function(g) {
        var self = this;
        var primaryLabels = g.selectAll('.primary text');
        var secondaryLabels = g.selectAll('.secondary text');

        if(secondaryLabels[0].length > 0) {
          secondaryLabels.each(function() {
            var secondaryLabel = this;
            primaryLabels.each(function() {
              var primaryLabel = this;
              if(self.intersection(primaryLabel.getBoundingClientRect(), secondaryLabel.getBoundingClientRect(), 40)) {
                  d3.select(primaryLabel).remove();
              }
            });
          });
        }
    },

    removeDuplicates: function (g, selector) {
        var dElements = g.selectAll(selector);

        function remove(label, i) {
            if (i === 0) return;
            var d3This = d3.select(this);
            var previousLabel = dElements[0][i - 1];
            if (d3This.text() === d3.select(previousLabel).text()) {
                d3This.remove();
            }
        }

        dElements.each(remove);
    }
};

},{"../util/dates":38,"d3":"d3"}],40:[function(require,module,exports){
//a place to define custom line interpolators

var d3 = require('d3');

function gappedLineInterpolator(points) {  //interpolate straight lines with gaps for NaN
    'use strict';

    var section = 0;
    var arrays = [[]];
    points.forEach(function (d, i) {
        if (isNaN(d[1])) {
            if (arrays[section].length == 1) {
                console.log('warning: Found a line fragment which is a single point this won\'t be drawn');
            }
            section++;
            arrays[section] = [];
        } else {
            arrays[section].push(d);
        }
    });

    var pathSections = [];
    arrays.forEach(function (points) {
        pathSections.push(d3.svg.line()(points));
    });
    var joined = pathSections.join('');
    return joined.substr(1); //substring becasue D£ always adds an M to a path so we end up with MM at the start
}

module.exports = {
    gappedLine: gappedLineInterpolator
};

},{"d3":"d3"}],41:[function(require,module,exports){
var thicknesses = {
    small: 2,
    medium: 4,
    large: 6
};

var defaultThickness = thicknesses.medium;

module.exports = function (value) {

    // fail fast
    if (!value) {
        return defaultThickness;
    }

    var lineThicknessIsNumber = value &&
        typeof value === 'number' && !isNaN(value);

    if (lineThicknessIsNumber) {
        return value;
    } else if (typeof value === 'string' && value.toLowerCase() in thicknesses) {
        return thicknesses[value];
    } else {
        return defaultThickness;
    }
};

},{}],42:[function(require,module,exports){
//example:
//http://codinginparadise.org/projects/svgweb-staging/tests/htmlObjectHarness/basic-metadata-example-01-b.html
var svgSchema = 'http://www.w3.org/2000/svg';
var xlinkSchema = 'http://www.w3.org/1999/xlink';
var xmlnsSchema = 'http://www.w3.org/2000/xmlns/';
var rdfSchema = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
var dcSchema = 'http://purl.org/dc/elements/1.1/';
var ccSchema = 'http://creativecommons.org/ns#';
var prismSchema = "http://prismstandard.org/namespaces/1.0/basic/";
var rdfsSchema = "http://www.w3.org/2000/01/rdf-schema#";

function create(svg, model) {
    svg.append('title').text(model.title);
    svg.append('desc').text(model.subtitle);
    svg.append('metadata').attr({'id': "license"});

    var container = svg.node();
    var meta = container.querySelector('metadata');

    var rdf = document.createElement('rdf:RDF');
    var rdfDesc = document.createElement('rdf:Description');
    var title = document.createElement('dc:title');
    var description = document.createElement('dc:description');
    var format = document.createElement('dc:format');
    var date = document.createElement('dc:date');

    container.setAttribute('xmlns', svgSchema);
    container.setAttributeNS(xmlnsSchema, 'xmlns:xlink', xlinkSchema);
    rdfDesc.setAttribute('rdf:about', '');
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:rdf', rdfSchema);
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:dc', dcSchema);
    rdf.setAttributeNS(xmlnsSchema, 'xmlns:cc', ccSchema);

    title.textContent = model.title;
    description.textContent = model.subtitle;
    format.textContent = 'image/svg+xml';
    date.textContent = (new Date()).toString();

    meta.appendChild(rdf);
    rdf.appendChild(rdfDesc);
    rdfDesc.appendChild(title);
    rdfDesc.appendChild(description);
    rdfDesc.appendChild(format);
    rdfDesc.appendChild(date);
}

module.exports = {
    create: create
};

},{}],43:[function(require,module,exports){
function isTruthy(value) {
    return !!value;
}

function normalise(value) {
    var d = {key: null, label: null};

    if (!value) {
        return d;
    }

    if (typeof value === 'string') {
        d.key = d.label = value;
    } else if (Array.isArray(value) && value.length <= 2 && typeof value[0] === 'string') {
        d.key = value[0];
        d.label = (typeof value[1] === 'string') ? value[1] : d.key;
    } else if (typeof value === 'function') {
        d = value();
    } else if (value.key) {
        d.key = value.key;
        d.label = value.label || d.key;
    }

    if (typeof d.key === 'function') {
        d.key = d.key();
    }

    if (typeof d.label === 'function') {
        d.label = d.label();
    }
    d.originalKey = d.key;

    return d;
}

function normaliseY(value) {
    if (!value) return [];
    return (!Array.isArray(value) ? [normalise(value)] : value.map(normalise)).filter(isTruthy);
}

module.exports = {
    normaliseY: normaliseY,
    normalise: normalise
};

},{}],44:[function(require,module,exports){
var app = require('../../app.json');
module.exports = app.version;

},{"../../app.json":4}],"nightingale-charts":[function(require,module,exports){
module.exports = {
    chart: require('./chart/index.js'),

    axis: require('./axis/index.js'),

    dressing: {
        seriesKey: require('./dressing/series-key.js'),
        textArea: require('./dressing/text-area.js'),
        logo: require('./dressing/logo.js')
    },

    util: {
        themes: require('./themes'),
        dates: require('./util/dates.js')
    },

    scale: require('./scales/index.js'),

    addFont: require('./fonts'),

    version: require('./util/version')

};

},{"./axis/index.js":9,"./chart/index.js":17,"./dressing/logo.js":21,"./dressing/series-key.js":22,"./dressing/text-area.js":23,"./fonts":24,"./scales/index.js":29,"./themes":35,"./util/dates.js":38,"./util/version":44}]},{},["nightingale-charts"]);
