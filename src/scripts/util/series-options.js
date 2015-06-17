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
