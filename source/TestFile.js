'use strict';
/**
 * Event Emitter of Node.JS
 *
 * @external EventEmitter
 *
 * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/events.html#events_class_eventemitter}
 */
const Path = require('path'), EventEmitter = require('events');


/**
 * **Test file** class
 *
 * @extends external:EventEmitter
 */
class TestFile extends EventEmitter {

    static toBigCamel(raw) {

        return  raw.replace(/^\w|[_\-](\w)/g,  function (A, B) {

            return  (B || A).toUpperCase();
        });
    }
    /**
     * @author TechQuery <shiy007@qq.com>
     *
     * @param {string} URI - Path of a **Source module**
     *                     (relative to the source directory)
     */
    constructor(URI) {

        super().length = 0;

        this.URI = URI;

        this.ID = TestFile.toBigCamel( Path.basename(URI, '.js') );

        this.header = [ ];
    }

    addHeader(raw) {

        if (this.header.indexOf( raw )  <  0)
            this.header.push( raw );
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
    /**
     * @author TechQuery <shiy007@qq.com>
     * @since  0.2.0
     *
     * @returns {string} Source code of this **Test file**
     */
    toString() {

        var _this_ = this;

        return `'use strict';

require('should');

${this.header.join("\n\n")}

${Array.from(this,  function (test) {

    return `
describe('${test.title}',  function () {

    ${test.item.map(function (item) {
        /**
         * Before **Test item** writed
         *
         * @event TestFile#itemWrite
         */
        _this_.emit('itemWrite', item);

        return  item.source || `

    it('${item.title}',  function () {

        var result = ${item.script};

        result.should.be.deepEqual( ${item.expected} );
    });
`;
    }).join('')}
});
`;
}).join("\n")}`;
    }
}


/**
 * @callback EventHook
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


module.exports = TestFile;
