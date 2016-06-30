# tinyTmpl
A tiny template engine written with just dozens of lines, simplified [underscore template](http://underscorejs.org/#template)

## Install
### NPM
```sh
npm install tiny-tmpl
```
### Bower
```sh
bower install tiny-tmpl
```

## Usage
```javascript
var tinyTmpl = require('tiny-tmpl');
var tmplStr = '<a href="<%= item.url %>"><% if(item.shown) { %><%= item.text %><% } %></a>';
var item = {
  url: 'https://github.com/icefox0801/tinyTmpl',
  shown: true,
  text: 'tiny-tmpl'
}
var compile = tinyTmpl(tmplStr);
console.log(compile(item)); // <a href="https://github.com/icefox0801/tinyTmpl">tiny-tmpl</a>
```

## Source code
You can just simply copy the source code into your javascript, it's less than 40 lines!
```javascript
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

    function tinyTmpl (text) {
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
```
