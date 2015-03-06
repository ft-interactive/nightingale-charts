var thicknesses = {
  small: 2,
  medium: 4,
  large: 6
};

var defaultThickness = thicknesses.medium;

module.exports = function(value) {

  // fail fast
  if (!value) {
    return defaultThickness;
  }

  var lineThicknessIsNumber = value
                              && typeof value === 'number'
                              && !isNaN(value);

  if (lineThicknessIsNumber) {
    return value;
  } else if (typeof value === 'string' && value.toLowerCase() in thicknesses) {
    return thicknesses[value];
  } else {
    return defaultThickness;
  }
}
