# [AngularStrap](http://mgcrea.github.io/angular-strap) [![Build Status](http://img.shields.io/travis/mgcrea/angular-strap/master.svg?style=flat)](http://travis-ci.org/mgcrea/angular-strap) [![devDependency Status](http://img.shields.io/david/dev/mgcrea/angular-strap.svg?style=flat)](https://david-dm.org/mgcrea/angular-strap#info=devDependencies) [![Coverage Status](http://img.shields.io/codeclimate/coverage/github/mgcrea/angular-strap.svg?style=flat)](https://codeclimate.com/github/mgcrea/angular-strap)

[![Banner](http://mgcrea.github.io/angular-strap/images/snippet.png)](http://mgcrea.github.io/angular-strap)

AngularStrap is a set of native directives that enables seamless integration of [Bootstrap 3.0+](https://github.com/twbs/bootstrap) into your [AngularJS 1.2+](https://github.com/angular/angular.js) app.

- The only required dependency is [Bootstrap CSS Styles](https://github.com/twbs/bootstrap/blob/master/dist/css/bootstrap.css)!

>
AngularStrap was initially written to provide AngularJS wrapping directives for Bootstrap. It used to leverage the JavaScript code written by Bootstrap's contributors to minimize work, retro-compatibility issues & time to market.
>
While it worked pretty well, it required a big JavaScript payload: both jQuery & Bootstrap libraries. When the 1.2 release of AngularJS showed up with the ngAnimate module, greatly simplifying DOM manipulation, we knew it was time for a rewrite!

- If you don't want to use `ngAnimate`, you will have to include a tiny [ngAnimate mock](https://github.com/mgcrea/angular-strap/wiki/ngAnimate-mock).

## Documentation and examples

+ Check the [documentation](http://mgcrea.github.io/angular-strap) and [changelog](https://github.com/mgcrea/angular-strap/releases).


## Quick start

+ Install AngularStrap with [Bower](https://github.com/bower/bower).

>
```bash
$ bower install angular-strap --save
```

+ Include the required libraries is your `index.html`:

>
``` html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
<script src="bower_components/angular-strap/dist/angular-strap.tpl.min.js"></script>
```

+ Inject the `mgcrea.ngStrap` module into your app:

>
``` js
angular.module('myApp', ['mgcrea.ngStrap']);
```


## Developers

Clone the repo, `git clone git://github.com/mgcrea/angular-strap.git`, [download the latest release](https://github.com/mgcrea/angular-strap/zipball/master) or install with bower `bower install angular-strap --save`.

AngularStrap is tested with `karma` against the latest stable release of AngularJS.

>
	$ npm install --dev
	$ gulp test

You can build the latest version using `gulp`.

>
	$ gulp build

You can quickly hack around (the docs) with:

>
	$ gulp serve



## Contributing

Please submit all pull requests the against master branch. If your unit test contains JavaScript patches or features, you should include relevant unit tests. Thanks!



## Authors

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/mgcrea



## Copyright and license

	The MIT License

	Copyright (c) 2012 - 2014 Olivier Louvignes

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
