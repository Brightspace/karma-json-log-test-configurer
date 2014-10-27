# VUI Tester
[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]

This library contains utilities to assist in testing Valence UI with the [Karma Test Runner](http://karma-runner.github.io/) and the [Jasmine Testing Framework](http://jasmine.github.io/).

It provides functionality to record test results and to compare actual test results with these records.

## Usage

Install as a development dependency:

```shell
npm install --save-dev vui-karma-jasmine-tester
```

Add it to your gulpfile.js:

```javascript
tester = require('vui-karma-jasmine-tester');
```

## Tester
### Test
Provides a [promise](http://documentup.com/kriskowal/q/) to reject or resolve a Jasmine test spec run through Karma. 

Takes an object representing [Karma config](http://karma-runner.github.io/0.12/config/configuration-file.html) values as the first parameter. Provided config will be merged with arbitrary, useful, and necessary defaults.

```javascript
gulp.task( 'test', function( ) {
	return tester.test( {
		files: ['test/**/*Spec.js']
	});
});
```

Based on the second parameter, it runs in either Record Mode (*true*) or Test Mode (*false* - default).

```javascript
gulp.task( 'record', function( ) {
	return tester.test( {
		files: ['test/**/*Spec.js']
	});
}, true);
```

Record Mode will only save results with certain matchers included in this module (ex: toMatchRecordedObject). All other matchers will behave as usual in both modes. 

## Record Functions

### Record Path
A typical Record Path is an array representing a tree traversal to find a record.

```javascript
['file', 'branch', 'branch', 'leaf']
```

This will store/retrieve a record in a JSON file *file* in the form

```javascript
branch : {
	branch : {
		leaf : { /* record saved here */ }
	}
}
```

Additional records recorded to *file* will be merged with this object. Additional records recorded to *leaf* will overwrite the record.

All records are stored in the test/rec folder.

### Get Standardized Record Path for a DOM Element.
Given a DOM element, *getStandardizedRecordPath* generates a sensible Record Path at which to store the record. The output can be confidently passed to any function that expects a Record Path.

```javascript
var rp = d2l.vui.records.getElementRecordPath( elem );
```

The "sensible path" will use the element's *tagName* as the file name and *className* as the leaf name.

#### More properties
To append more nodes to the "sensible path", pass in an array of properties as the second parameter.

```javascript
var rp = d2l.vui.records.getElementRecordPath( elem, ['disabled'] );
```

This will add a leaf of the form `{ "property=value" : { } }` to store the record. 

### Get Record
*getRecord* Retrieves a record at the specified Record Path. Should only be used in custom Jasmine matchers that recognize Recording Mode and Testing Mode.

```javascript
//@if !RECORDING
expectedResult = d2l.vui.records.getRecord(recordedObjectPath);
//@endif
```

### Set Record
*setRecord* stores a record at the specified Record Path. Should only be used in custom Jasmine matchers that recognize Recording Mode and Testing Mode.

```javascript
//@if RECORDING
d2l.vui.records.setRecord(recordedObjectPath, obj);
//@endif
```

## Matchers
Functions to use in Jasmine tests to verify object contents. Add matchers to your test with Jasmine's *addMatchers* function.

```javascript
jasmine.addMatchers(d2l.vui.matchers.jasmine);
```

### Match Recorded Object At
in a Jasmine test, *toMatchRecordedObject* will record or verify an object at the specified Record Path.

```javascript
var obj = { "key" : "value" };
var rp = [ "file", "root", "leaf" ];
it( 'contains the same object data', function() {
	expect( obj ).toMatchRecordedObject( rp );
});
```

#### Record Mode
Running this matcher with the tester in Record Mode will take the expected object and save it to a file as specified by the Record Path.

#### Test Mode
Running this matcher with the tester in Test Mode will check the actual object against the file saved at the Record Path and return true if they match.

- Each key in the actual object exists in the record.
- Each value for each key in the actual object matches the value stored at that key in the record.
- ***Keys absent from the actual result will not be verified in the record*** 

Running this matcher in Test Mode without records at the Record Path will result in an error and a failed test.


#### Exceptions
Exceptions can be specified to override the value in the recorded result.

```javascript
it( 'contains the same object data but with an override', function() {
	obj["key"] = "exception";
	var exceptions = { "key" : "exception" };
	expect( obj ).toMatchRecordedObjectAt( rp, exceptions );
});
```

## Differs
Functions to generate objects that will be compatible with expectations of Recorded Objects matchers.

These functions are not Jasmine matchers themselves.

### Diff default style.
*diffDefaultStyle* will compare a DOM node to an identical node with no className value. This should return an object representing any styles applied due to the class name.

```javascript
var diff = d2l.vui.differs.diffDefaultStyle( elem );
```

#### Pseudo Elements.
To diff a pseudo element of an element, pass in the pseudo element selector as a second parameter.

```javascript
var diff = d2l.vui.differs.diffDefaultStyle( elem, "before" );
```

**NOTE: Use with caution!** This usage will currently have unexpected behaviour, such as overwriting existing records with similar element properties. Verify your records after running record mode to ensure the results are what you want.

## Contributing

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and contributions should make use of them. See the valence-ui [Code Style wiki page](https://github.com/Desire2Learn-Valence/valence-ui-helpers/wiki/Code-Style) for details.

[npm-url]: https://npmjs.org/package/vui-karma-jasmine-tester
[npm-image]: https://badge.fury.io/js/vui-karma-jasmine-tester.png
[ci-image]: https://travis-ci.org/Desire2Learn-Valence/valence-ui-karma-jasmine-tester.svg?branch=master
[ci-url]: https://travis-ci.org/Desire2Learn-Valence/valence-ui-karma-jasmine-tester
