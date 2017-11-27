'use strict';
/**
 * Test Example - A JSDoc plugin for generating Test scripts by parsing @example
 *
 * @module    {object} test-example
 *
 * @version   0.4.0
 *
 * @see       {@link https://techquery.github.io/test-example|Offical Web site}
 *
 * @copyright TechQuery <shiy007@qq.com> 2017
 */
const Path = require('path'), FS = require('fs-extra');

/**
 * **Config namespace** of this plugin
 *
 * @namespace config
 *
 * @property {string}  [config.sourcePath="source/"] - Path of
 *                                                     the **Source directory**
 * @property {string}  [config.testPath="test/"]     - Path of
 *                                                     the **Test directory**
 * @property {boolean} [config.overWrite=true]       - Overwrite existed
 *                                                     test scripts or not
 * @property {string}  [config.hookModule]           - Path of Node.JS Module
 *                                                     contained **Hook method**
 *
 * @example  // Merge those options below to your JSDoc `config.json`
 *     {
 *         "plugins":         ["node_modules/test-example"],
 *         "test-example":    {
 *             "sourcePath":    "path/to/source/directory",
 *             "testPath":      "path/to/test/directory",
 *             "overWrite":     false,
 *             "hookModule":    "path/to/plugin/hook"
 *         }
 *     }
 */
const config = Object.assign(
          {
              sourcePath:    'source/',
              testPath:      'test/',
              overWrite:     true
          },
          require('jsdoc/env').conf['test-example']
      ),
      TestScript = require('./TestFile');

const hook = config.hookModule && require(
          Path.join(process.cwd(), config.hookModule)
      );

var file;


exports.handlers = {
    beforeParse:     function (event) {

        file = new TestScript(event.filename, config.sourcePath, config.testPath);

        for (var handler in hook)  file.on(handler,  hook[ handler ]);

        if (! /\s*define\(/.test( event.source ))
            file.addHeader(
                `var ${file.ID} = require('${file.sourceURI}')`
            );
    },
    newDoclet:       function(event) {

        file.addUnit( event.doclet );
    },
    fileComplete:    function (event) {

        if ((! file[0])  ||  (
            FS.existsSync( file.testURI )  &&  (! config.overWrite)
        ))
            return;

        FS.outputFileSync(file.testURI,  file + '');

        console.log(`\n\t[Test script] ${file.testURI}\n`);
    }
};
