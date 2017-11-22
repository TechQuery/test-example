'use strict';

const Path = require('path'), FS = require('fs-extra');

const config = require('jsdoc/env').conf['test-example'] || { },
      unit = [ ];


function Test_File(unit) {

    return `'use strict';

require('should');

${unit.map(function (test) {

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


exports.handlers = {
    fileBegin:       function () {

        unit.length = 0;
    },
    newDoclet:       function(event) {

        var DocLet = event.doclet;

        if (DocLet.examples instanceof Array)
            unit.push({
                title:    DocLet.longname,
                item:     DocLet.examples.map(function (item) {

                    item = item.match( /(.*?)[\r\n]+([\s\S]+?)\/\/([\s\S]+)/ );

                    return {
                        title:     item[1].trim(),
                        script:    item[2].trim(),
                        result:    item[3].trim()
                    };
                })
            });
    },
    fileComplete:    function (event) {

        var fileName = Path.join(
                'test',
                Path.relative(
                    Path.join(process.cwd(),  config.sourcePath || ''),
                    event.filename
                )
            );

        if ((! unit[0])  ||  (
            FS.pathExistsSync( fileName )  &&  (! config.overWrite)
        ))
            return;

        FS.outputFileSync(fileName,  Test_File( unit ));

        console.log(`\n\t[Test file] ${fileName}\n`);
    }
};
