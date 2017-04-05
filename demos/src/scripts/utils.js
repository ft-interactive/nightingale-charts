module.exports = {
  getQueryVariable : function (variable) {
     const query = window ? window.location.search.substring(1) : "";
     const vars = query.split("&");
     for (let i=0;i<vars.length;i++) {
             const pair = vars[i].split("=");
             if(pair[0] === variable){return pair[1];}
     }
     return(false);
  },
  getRandomInt : function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  assign : function (target) {
    if (target === null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 1; index < arguments.length; index++) {
      const nextSource = arguments[index];

      if (nextSource !== null) { // Skip over if undefined or null
        for (const nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  }
};
