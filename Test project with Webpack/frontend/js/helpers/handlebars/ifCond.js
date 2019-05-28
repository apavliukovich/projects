module.exports = function(val1, operator, val2, options) {
    switch (operator) {
        case '==':
            return (val1 == val2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (val1 === val2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (val1 !== val2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (val1 < val2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (val1 <= val2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (val1 > val2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (val1 >= val2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (val1 && val2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (val1 || val2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
};