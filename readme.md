# [AngularStrap](http://mgcrea.github.com/angular-strap) [![Build Status](https://secure.travis-ci.org/mgcrea/angular-strap.png?branch=master)](http://travis-ci.org/#!/mgcrea/angular-strap)

AngularStrap is a set of directives that enables seamless integration of [Twitter Bootstrap](https://twitter.github.com/bootstrap) into your [AngularJS](https://github.com/angular/angular.js) app.



## Documentation and examples

+ Check the [documentation](http://mgcrea.github.com/angular-strap) and [changelog](https://github.com/mgcrea/angular-strap/wiki/Changelog).

+ Use & fork the available [plunkers](https://github.com/mgcrea/angular-strap/wiki/Plunkers) to test a directive or report an issue.



## Quick start

+ Include the required libraries (cdn/local)

>
``` html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.0/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-strap/0.7.1/angular-strap.min.js"></script>
```

+ Inject the `$strap.directives` into your app module

>
``` javascript
var app = angular.module('angularjs-starter', ['$strap.directives']);
```


## Developers

Clone the repo, `git clone git://github.com/mgcrea/angular-strap.git`, [download the latest release](https://github.com/mgcrea/angular-strap/zipball/master) or install with bower `bower install angular-strap`.

AngularStrap is tested with `testacular` against the latest available release of jQuery & Bootstrap.

>
	$ sudo npm install grunt-cli --global
	$ npm install --dev
	$ grunt test

You can build the latest version using `grunt`.

>
	$ grunt build

## RequireJS

[RequireJS](http://requirejs.org/) users can include AngularStrap modules as they would any other dependency, optionally including only the functionality they need.

### Configuration

Include in your RequireJS configuration a mapping that looks similar to the following. (Assumes you've unpacked AngularStrap into `vendor/angular-strap` inside your project. You can, of course, put this anywhere; modify the following to suit your needs.)

```javascript
{
  map : {
    '*' : {
      'angular-strap' : 'vendor/angular-strap/src'
    }
  }
}
```

Note that [`map`](http://requirejs.org/docs/api.html#config-map) is used instead of `path`, allowing AngularStrap modules to resolve dependencies internally within the package.

You'll also have to provide various dependencies to AngularStrap's common module using a shim similar to the following. (The location and versions of these dependencies may differ in your project. Modify the following example to suit your needs.)

```javascript
{
  shim : {
    'angular-strap' : {
      deps : [
        'vendor/angular-1.1.3/angular',
        'vendor/jquery-1.9.1',
        'vendor/bootstrap-2.3.1/js/bootstrap'
      ]
    }
  }
}
```

### Inclusion

Once you've added AngularStrap to your RequireJS configuration as described previously, referencing its modules as dependencies is trivial.

The following requires only the `alert` and `typeahead` directives.

```javascript
require([
  'angular-strap/directives/alert',
  'angular-strap/directives/typeahead'
]), function() {
  // ...
})
```

You can also include all directives at once.

```javascript
require([
  'angular-strap/directives'
]), function() {
  // ...
})
```

Or make them module dependencies.

```javascript
define([
  'angular-strap/directives'
]), function() {
  // ...
})
```

## Contributing

Please submit all pull requests the against master branch. If your unit test contains JavaScript patches or features, you should include relevant unit tests. Thanks!



## Authors

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/mgcrea



## Copyright and license

	The MIT License

	Copyright (c) 2012 Olivier Louvignes

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
