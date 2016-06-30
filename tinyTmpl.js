(function (root, factory) {

    if(typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else if(typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.tinyTmpl = factory();
    }

}(this, function () {
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var matcher = new RegExp('<%=([\\s\\S]+?)%>|<%([\\s\\S]+?)%>|$', 'g');
    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };
    /**
     * @method template
     * @description template compile function
     * @param text [string] template string
     * @returns {function}
     */
    return function (text) {
        var cursor = 0;
        var source = "rst+='";

        text.replace(matcher, function (match, interpolate, evaluate, offset) {
            source += text.slice(cursor, offset).replace(escapeRegExp, escapeChar);
            cursor = offset + match.length;

            if (interpolate) {
                source += "'+\n((tmp=(" + interpolate + "))==null?'':tmp)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\nrst+='";
            }

            return match;
        });

        source += "';\n";
        source = 'with(obj||{}){\n' + source + '}\n';
        source = "var tmp,rst='';\n" + source + 'return rst;\n';

        return new Function('obj', source);
    };

}));