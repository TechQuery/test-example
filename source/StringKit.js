'use strict';

exports.toBigCamel = function (raw) {

    return  raw.replace(/^\w|[_\-](\w)/g,  function (A, B) {

        return  (B || A).toUpperCase();
    });
};


exports.getIndent = function (raw) {

    var raw_indent = (raw.match( /^([ \t]*)/m ) || '')[1];

    return Math.floor(
        (raw_indent || '').replace(/\t/g, '    ').length  /  4
    );
};


exports.indent = function (level, raw) {

    var offset;

    return  (raw || '').replace(/^[ \t]*\S/mg,  function (match) {

        var raw_indent = exports.getIndent( match );

        if (! (offset != null))  offset = level - raw_indent;

        return  ' '.repeat(4 * (offset + raw_indent))  +  match.trim();

    }).replace(/\s*$/, '');
};
