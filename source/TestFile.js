'use strict';

const Path = require('path');



class TestFile extends Array {

    static toBigCamel(raw) {

        return  raw.replace(/^\w|[_\-](\w)/g,  function (A, B) {

            return  (B || A).toUpperCase();
        });
    }

    constructor(URI) {

        super().URI = URI;

        this.ID = TestFile.toBigCamel( Path.basename(URI, '.js') );

        this.header = [ ];
    }

    addHeader(raw) {

        if (this.header.indexOf( raw )  <  0)
            this.header.push( raw );
    }

    addUnit(Doclet) {

        if (Doclet.examples instanceof Array)
            this.push({
                title:    Doclet.longname,
                item:     Doclet.examples.map(function (item) {

                    item = item.match( /(.*?)[\r\n]+([\s\S]+?)\/\/([\s\S]+)/ );

                    return {
                        title:     item[1].trim(),
                        script:    item[2].trim(),
                        result:    item[3].trim()
                    };
                })
            });
    }

    toString() {

        return `'use strict';

require('should');

${this.header.join("\n\n")}

${Array.from(this,  function (test) {

    return `
describe('${test.title}',  function () {

    ${test.item.map(function (item) {

        return `
    it('${item.title}',  function () {

        var result = ${item.script};

        result.should.be.deepEqual( ${item.result} );
    });
`;
    }).join("\n")}
});
`;
}).join("\n")}`;
    }
}


module.exports = TestFile;
