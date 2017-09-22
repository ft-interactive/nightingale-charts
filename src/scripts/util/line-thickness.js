module.exports = function (value, theme) {
  var thicknesses = {
      small: 2,
      medium: theme === 'ft-web' ? 3 : 4,
      large: 6
  };

  var defaultThickness = theme === 'ft-web' ? 3 : thicknesses.medium;

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
