'use strict';
/**
 * Event Emitter of Node.JS
 *
 * @external EventEmitter
 *
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/events.html#events_class_eventemitter}
 */
const EventEmitter = require('events'),
      Path = require('path'),
      StringKit = require('./StringKit');


/**
 * **Test script** class
 *
 * @extends external:EventEmitter
 */
class TestScript extends EventEmitter {
    /**
     * @author TechQuery <shiy007@qq.com>
     *
     * @param {string} URI        - Path of a **Source module**
     * @param {string} sourcePath - Path of the **Source directory**
     * @param {string} testPath   - Path of the **Test directory**
     */
    constructor(URI, sourcePath, testPath) {

        super().length = 0;

        this.sourcePath = Path.join(process.cwd(), sourcePath);

        this.testPath = Path.join(process.cwd(), testPath);

        this.URI = (
            Path.isAbsolute( URI )  ?
                Path.relative(this.sourcePath, URI)  :  URI
        ).replace(/\\/g, '/');

        this.testURI = Path.join(this.testPath, this.URI);

        this.sourceURI = Path.relative(
            this.testURI,  Path.join(this.sourcePath, this.URI)
        ).replace(/\\/g, '/');

        this.ID = StringKit.toBigCamel( Path.basename(URI, '.js') );

        this.header = [ ];
    }

    addHeader(raw) {

        if (raw  &&  (this.header.indexOf( raw )  <  0))
            this.header.push( StringKit.indent(0, raw) );
    }

    addUnit(Doclet) {

        if (Doclet.examples instanceof Array)
            this[ this.length++ ] = {
                title:    Doclet.longname,
                item:     Doclet.examples.map(function (item) {

                    item = item.split( /^\/\/|\s+\/\/|\n\n/ );

                    /**
                     * **Test item** object
                     *
                     * @typedef {object} TestItem
                     *
                     * @property {string} title       - **Comment text** in the
                     *                                  same line of `@example`
                     * @property {string} script      - **Source code** to be tested
                     * @property {string} expected    - Expected result
                     * @property {string} [source=''] - Full source code of
                     *                                  this test
                     */
                    return {
                        title:       item[1].trim(),
                        script:      item[2].trim(),
                        expected:    item[3].trim(),
                        source:      ''
                    };
                })
            };
    }

    getHeader() {
        /**
         * **Test header** object
         *
         * @typedef {object} TestHeader
         *
         * @property {string} URI         - Module URI relative to
         *                                  the **Source directory**
         * @property {string} sourceURI   - Module URI relative to
         *                                  this **Test scirpt**
         * @property {string} [source=''] - The header's source code of
         *                                  this **Test script**
         */
        var header = {
                URI:          this.URI,
                sourceURI:    this.sourceURI,
                source:       ''
            };
        /**
         * Before the **Test script** writed
         *
         * @event TestScript#fileWrite
         */
        this.emit('fileWrite', header);

        if ( header.source )  this.addHeader( header.source );

        /**
         * Before the header of **Test script** writed
         *
         * @event TestScript#headerWrite
         */
        header.source = '';

        this.emit('headerWrite', header);

        return  StringKit.indent(1, header.source);
    }

    /**
     * @author TechQuery <shiy007@qq.com>
     * @since  0.2.0
     *
     * @return {string} Source code of this **Test script**
     */
    toString() {

        var _this_ = this, header = this.getHeader();

        return `'use strict';

require('should');

${this.header.join("\n\n")}

describe('${this.URI}',  function () {

${header}

${Array.from(this,  function (test) {

    return `

    describe('${test.title}',  function () {

        ${test.item.map(function (item) {
            /**
             * Before **Test item** writed
             *
             * @event TestScript#itemWrite
             */
            _this_.emit('itemWrite', item);

            return  StringKit.indent(2,  item.source || `

        it('${item.title}',  function () {

            var result = ${item.script};

            result.should.be.deepEqual( ${item.expected} );
        });
    `);
        }).join('')}
    });
`;
}).join("\n")}
});`;
    }
}


/**
 * @callback fileWrite
 *
 * @param {TestHeader} header
 *
 * @example  // TestHook.js
 *
 *     exports.fileWrite = function (header) {
 *
 *         header.source = 'custom test script';
 *     };
 */

/**
 * @callback headerWrite
 *
 * @param {TestHeader} header
 *
 * @example  // TestHook.js
 *
 *     exports.headerWrite = function (header) {
 *
 *         header.source = 'custom test script';
 *     };
 */

/**
 * @callback itemWrite
 *
 * @param {TestItem} item
 *
 * @example  // TestHook.js
 *
 *     exports.itemWrite = function (item) {
 *
 *         item.source = 'custom test script';
 *     };
 */


module.exports = TestScript;
