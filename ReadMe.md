# Test Example

A [JSDoc](http://usejsdoc.org/) [plugin](http://usejsdoc.org/about-plugins.html) for generating test files by parsing @example.

[![NPM Dependency](https://david-dm.org/TechQuery/test-example.svg)](https://david-dm.org/TechQuery/test-example)

[![NPM](https://nodei.co/npm/test-example.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/test-example/)

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/terHRJgDULkGjswWhddcBSDJ/TechQuery/test-example'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/terHRJgDULkGjswWhddcBSDJ/TechQuery/test-example.svg' />
</a>



## Feature

 1. [BDD](https://www.agilealliance.org/glossary/bdd/) (Behavior-driven development) style Test wrapper, such as [Mocha](https://mochajs.org/)

 2. [Should](https://github.com/shouldjs/should.js) style Assertion

 3. One **Source file** to one **Test file**

 4. One **Doclet** to one `describe()`

 5. One `@example` to one `it()`



## Usage

 1. `npm i test-example -O`

 2. Add some [config options](https://techquery.github.io/test-example/module-test-example-test-example.html)

 3. [Custom hook module](https://techquery.github.io/test-example/global.html#EventHook) let you do more

 4. `jsdoc -c path/to/config.json`

 5. `npm test`



## Example

`source/say-sth.js`

```JavaScript
/**
 * Hello function
 *
 * @function hello
 *
 * @param {string} [name="World"]
 *
 * @return {string}
 *
 * @example  // No parameter
 *
 *     hello()    //  "Hello, World !"
 *
 * @example  // One parameter
 *
 *     hello('JSDoc')    //  "Hello, JSDoc !"
 */

exports.hello = function (name) {

    return  'Hello, ' + (name || 'World') + ' !';
};
```

will generate `test/say-sth.js`

```JavaScript
'use strict';

require('should');

var saySth = require('../source/say-sth');


describe('hello',  function () {


    it('No parameter',  function () {

        var result = saySth.hello();

        result.should.be.deepEqual( "Hello, World !" );
    });


    it('One parameter',  function () {

        var result = saySth.hello('JSDoc');

        result.should.be.deepEqual( "Hello, JSDoc !" );
    });

});
```


## User Case

 1. [iQuery](https://tech-query.me/iQuery.js/)
