#VUI Tester
[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]

This library contains utilities to assist in testing Valence UI with the [Karma Test Runner](http://karma-runner.github.io/ "Karma Test Runner") and the [Jasmine Testing Framework](http://jasmine.github.io/).

It provides functionality to record test results and to compare actual test results with these records.

##Usage

Install as a development dependency:

```shell
npm install --save-dev vui-karma-jasmine-tester
```

Add it to your gulpfile.js:

```javascript
tester = require('vui-karma-jasmine-tester');

gulp.task( 'test', function( ) {
	return tester.test( {
		files: [
			'test/**/*Spec.js',
			'list.css'
		]
	});
}, false);

gulp.task( 'record', function( ) {
	return tester.test( {
		files: [
			'test/**/*Spec.js',
			'list.css'
		]
	});
}, true);
```

## Contributing

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and contributions should make use of them. See the valence-ui [Code Style wiki page](https://github.com/Desire2Learn-Valence/valence-ui-helpers/wiki/Code-Style) for details.

[npm-url]: https://npmjs.org/package/vui-karma-jasmine-tester
[npm-image]: https://badge.fury.io/js/vui-karma-jasmine-tester.png
[ci-image]: https://travis-ci.org/Desire2Learn-Valence/valence-ui-karma-jasmine-tester.svg?branch=master
[ci-url]: https://travis-ci.org/Desire2Learn-Valence/valence-ui-karma-jasmine-tester
