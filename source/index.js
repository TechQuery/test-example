'use strict';

const Path = require('path'), FS = require('fs-extra');

const config = require('jsdoc/env').conf['test-example'] || { },
      TestFile = require('./TestFile');

var sourcePath = Path.join(process.cwd(),  config.sourcePath || ''),
    testPath = Path.join(process.cwd(), 'test'),
    file;


exports.handlers = {
    beforeParse:     function (event) {

        file = new TestFile( Path.relative(sourcePath, event.filename) );

        if (! /\s*define\(/.test( event.source ))
            file.addHeader(
                `var ${file.ID} = require('${Path.relative(
                    Path.join(testPath, file.URI),
                    Path.join(sourcePath, file.URI)
                )}')`
            );
    },
    newDoclet:       function(event) {

        file.addUnit( event.doclet );
    },
    fileComplete:    function (event) {

        var fileName = Path.join(testPath, file.URI);

        if ((! file[0])  ||  (
            FS.existsSync( fileName )  &&  (! config.overWrite)
        ))
            return;

        if (config.headerFile  &&  FS.existsSync( config.headerFile ))
            file.addHeader( FS.readFileSync( config.headerFile ) );

        FS.outputFileSync(fileName,  file + '');

        console.log(`\n\t[Test file] ${fileName}\n`);
    }
};
