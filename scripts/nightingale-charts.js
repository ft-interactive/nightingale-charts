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
            secondary:{}
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

},{"../util/dates.js":37,"../util/labels.js":38,"d3":"d3"}],6:[function(require,module,exports){
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

function getRange(model, orientation)     {
    var plotWidth = model.plotWidth = model.chartWidth - model.yLabelWidth;
    var plotHeight = model.plotHeight =  model.chartHeight - model.xLabelHeight;
    return (isVertical(orientation)) ? [0, plotHeight] : [0, plotWidth];
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
        .attrs(this.getAttr('dependent-ticks'), 'ticks')
        .attrs(this.getAttr('origin-ticks'), 'origin')
        .attrs(this.getAttr('axis-text'), 'primary');

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
        .attrs(this.getAttr('independent-ticks'), 'ticks')
        .attrs(this.getAttr('origin-ticks'), 'origin')
        .attrs(this.getAttr('axis-text'), 'primary')
        .attrs(this.getAttr('axis-secondary-text'), 'secondary');
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

},{"../scales/intra-day":30,"../themes":34,"./category.js":5,"./date.js":7,"./number.js":10,"d3":"d3"}],7:[function(require,module,exports){
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
            secondary:{}
        }
    };

    function isVertical(){
        if (!config.axes.length) return true; //todo: log error. no axis
        return ['right','left'].indexOf(config.axes[0].orient())>-1;
    }

    function render(g) {
        config.attr.primary['text-anchor'] = isVertical() ? 'end' : 'start';
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

},{"../util/dates.js":37,"../util/labels.js":38,"./date.scale.js":8,"d3":"d3"}],8:[function(require,module,exports){
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

},{"../util/dates.js":37,"d3":"d3"}],9:[function(require,module,exports){
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
            secondary:{}
        }
    };

    function isVertical(){
        return ['right','left'].indexOf(config.axes.orient())>-1;
    }

    function axis(g) {
        var orientOffset = (config.axes.orient() === 'right') ? -config.axes.tickSize() : 0;
        config.attr.primary['text-anchor'] = isVertical() ? 'end' : 'start';
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
            g.selectAll('text').attr('transform', 'translate( ' + textWidth + ', ' + -(config.lineHeight / 2) + ' )');
        }
    },
    extendAxis: function (g, axes, tickExtension) {
        var rules = g.selectAll('line');
        if (axes.orient() == 'right') {
            rules.attr('x1', tickExtension);
        } else {
            rules.attr('x1', -tickExtension);
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
            this.extendAxis(g, config.axes, config.tickExtension);
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
    return d3.sum(model.stacks[stack]);
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

Plot.prototype.xDependent = function(value, stack) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.min(0, value);
    if (this.model.stack) {
        var xValue = stackSeries(this.model, value, stack);
        var width = this.model.stacks[stack][this.model.stacks[stack].length-1];
        maxValue = (xValue<0) ? xValue : xValue - width ;
    }
    return this.axes.dependentAxisScale(maxValue);
};

Plot.prototype.yDependent = function(value, stack) {
    if (this.model.chartType == 'line') return this.axes.dependentAxisScale(value);
    var maxValue = Math.max(0, value);
    if (this.model.stack) {
        var yValue = stackSeries(this.model, value, stack);
        var height = this.model.stacks[stack][this.model.stacks[stack].length-1];
        maxValue = (yValue<0) ? yValue - height : Math.max(0, yValue);
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
        .attr('x',      function (d, i){ return plot.x(d.value, i); })
        .attr('y',      function (d, i){ return plot.y(d.key, seriesNumber); })
        .attr('height', function (d, i){ return plot.barHeight(d, i); })
        .attr('width',  function (d, i){ return plot.barWidth(d.value, i); })
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

},{"../axis":9,"../dressing":20,"../themes":34,"../util/data.model.js":36,"../util/metadata.js":41}],15:[function(require,module,exports){
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
        .attr('x',      function (d, i){ return plot.x(d.key, seriesNumber); })
        .attr('y',      function (d, i){ return plot.y(d.value, i); })
        .attr('height', function (d, i){ return plot.columnHeight(d.value); })
        .attr('width',  function (d, i){ return plot.columnWidth(d, i); })
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

},{"../axis":9,"../dressing":20,"../themes":34,"../util/data.model.js":36,"../util/metadata.js":41}],17:[function(require,module,exports){
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

    var creator = new axes.Create(chartSVG, model);
    creator.createAxes({
        dependent:'number',
        independent: 'time'
    });

    model.keyHover && dressing.addSeriesKey();

    var plotSVG = chartSVG.append('g').attr('class', 'plot');
    var i = model.y.series.length;
    var lineAttr = extend(
        themes.check(model.theme, 'lines').attributes,
        {'stroke-width': model.lineStrokeWidth});
    var borderAttrs = extend({}, lineAttr);
    borderAttrs.class = 'line line__border';
    borderAttrs['stroke-width'] =  lineAttr['stroke-width'] * 2;
    borderAttrs.stroke = lineAttr.border;

    while (i--) {
        plotSeries(plotSVG, model, creator, model.y.series[i], lineAttr, borderAttrs);
    }
    chartSVG.selectAll('path.domain').attr('fill', 'none');
}

module.exports = lineChart;

},{"../axis":9,"../dressing":20,"../themes":34,"../util/data.model.js":36,"../util/line-interpolators.js":39,"../util/metadata.js":41,"d3":"d3","util":3}],19:[function(require,module,exports){
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
    var currentPosition = {
        top: this.headerHeight + this.getAttr('chart-' + item)['font-size'] + this.model.paddingY,
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

},{"../themes":34,"./logo.js":21,"./series-key.js":22,"./text-area.js":23}],21:[function(require,module,exports){
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

},{"../themes":34,"../util/line-thickness.js":40,"d3":"d3"}],23:[function(require,module,exports){
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
                d3.select(this).attr('x', innerWidth - this.getComputedTextLength());
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
    MetricWeb: "data:application/font-woff;charset=utf-8;base64,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\n".trim(),
    MetricWebSemiBold: "data:application/font-woff;charset=utf-8;base64,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\n".trim()
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
var PADDING = 0;
var colours = {
    line: [
        'rgb(0,75,108)', 'rgb(221,183,49)', 'rgb(197,214,203)', 'rgb(172,29,32)', 'rgb(79,163,199)', 'rgb(221,223,240)'
    ],
    bar: [
        'rgb(0,75,108)', 'rgb(0,123,166)', 'rgb(99,163,193)', 'rgb(147,191,197)', 'rgb(197,214,203)', 'rgb(221,223,240)'
    ],
    column: [
        'rgb(0,75,108)', 'rgb(0,123,166)', 'rgb(99,163,193)', 'rgb(147,191,197)', 'rgb(197,214,203)', 'rgb(221,223,240)'
    ],
    accent: 'rgb(221,183,49)'
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
            'padding-x': 8,
            'padding-y': 10,
            background: 'rgba(255,255,255,1)'
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
    //Columns
    {   'id': 'columns',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 1
        }
    },
    //bars
    {   'id': 'bars',
        'attributes': {
            stroke: 'rgb(243, 236, 228)',
            'stroke-width': 1
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
            'font-size': 12,
            'line-height': 14,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-subtitle',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 10,
            'line-height': 12,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'key',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 12,
            'line-height': 16,
            'font-weight': '600',
            'padding': 3,
            'background': 'white',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'chart-source',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 8,
            'line-height': 10
        }
    }, {
        'id': 'chart-footnote',
        'attributes': {
            'font-family': 'MetricWeb, sans-serif',
            'font-size': 12,
            'line-height': 16
        }
    },
    {   'id': 'dependent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(54, 51, 52, 1)',
            'stroke-width': 1
        }
    },
    {   'id': 'independent-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(54, 51, 52, 1)',
            'stroke-width': 1
        }
    },
    {   'id': 'origin-ticks',
        'attributes': {
            'shape-rendering': 'crispEdges',
            'stroke': 'rgba(54, 51, 52, 1)',
            'stroke-width': 1
        }
    },
    {   'id': 'axis-text',
        'attributes': {
            'font-size': 12,
            'font-family': 'MetricWeb, sans-serif',
            'stroke': 'none',
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
        }
    },
    {   'id': 'axis-secondary-text',
        'attributes': {
            'font-size': 10,
            'font-weight': '600',
            'fill': 'rgba(0, 0, 0, 0.8)'
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
    }
];

module.exports.theme.colours = colours;
module.exports.theme.gradients = gradients;

},{}],33:[function(require,module,exports){
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
    }
];
module.exports.theme.colours = colours;

},{}],34:[function(require,module,exports){
// because of the need to export and convert browser rendered SVGs
// we need a simple way to attach styles as attributes if necessary,
// so, heres a list of attributes and the selectors to which they should be applied
var d3 = require('d3');
var web = require('./ft-web');
var video = require('./ft-video');
var print = require('./ft-print');

var themes = {
    'ft-web': web.theme,
    'ft-video': video.theme,
    'ft-print': print.theme,
    check: checkAttributes,
    createDefinitions: createDefinitions
};
var definitions = {
    'ft-web': web.defs,
    'ft-video': video.defs,
    'ft-print': print.defs
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

},{"./ft-print":31,"./ft-video":32,"./ft-web":33,"d3":"d3"}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

    var extents = (model.stack) ? sumStackedValues(model) : setExtents(model);
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

},{"../themes":34,"../util/aspect-ratios.js":35,"../util/dates.js":37,"../util/line-thickness.js":40,"../util/series-options.js":42,"d3":"d3"}],37:[function(require,module,exports){
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

},{"d3":"d3"}],38:[function(require,module,exports){
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
        this.removeOverlapping(g, '.' + rowClass + ' text');

    },

    intersection: function (a, b) {
        var PADDING = 2;
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

    removeOverlapping: function (g, selector) {
        var self = this;
        var dElements = g.selectAll(selector);
        var elementCount = dElements[0].length;
        var limit = 5;

        function remove(d, i) {
            var last = i === elementCount - 1;
            var previousLabel = dElements[0][elementCount - 2];
            var lastOverlapsPrevious = (last && self.intersection(previousLabel.getBoundingClientRect(), this.getBoundingClientRect()));
            if (last && lastOverlapsPrevious) {
                d3.select(previousLabel).remove();
            } else if (i % 2 !== 0 && !last) {
                d3.select(this).remove();
            }
        }

        while (self.overlapping(g.selectAll(selector)) && limit > 0) {
            limit--;
            g.selectAll(selector).each(remove);
            dElements = g.selectAll(selector);
            elementCount = dElements[0].length;
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

},{"../util/dates":37,"d3":"d3"}],39:[function(require,module,exports){
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

},{"d3":"d3"}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{"./axis/index.js":9,"./chart/index.js":17,"./dressing/logo.js":21,"./dressing/series-key.js":22,"./dressing/text-area.js":23,"./fonts":24,"./scales/index.js":29,"./themes":34,"./util/dates.js":37,"./util/version":43}]},{},["nightingale-charts"]);
