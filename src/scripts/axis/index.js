var DateAxis = require('./Date.js');

function d3Wrapper(fn, main, api){
    var exec = new fn;
    return fn;
}

module.exports = {
  category: require('./category.js'),
  date: d3Wrapper(DateAxis,'render'),
  number: require('./number.js')
};
