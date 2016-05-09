/**
 * angular-strap
 * @version v2.3.8 - 2016-05-09
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
  'use strict';
  angular.module('mgcrea.ngStrapDocs', [ 'mgcrea.ngStrap', 'mgcrea.ngPlunkr', 'ngRoute', 'ngAnimate' ]).constant('version', 'v2.3.8').constant('ngVersion', angular.version.full).config([ '$plunkrProvider', 'version', function($plunkrProvider, version) {
    angular.extend($plunkrProvider.defaults, {
      plunkrTitle: 'AngularStrap Example Plunkr',
      plunkrTags: [ 'angular', 'angular-strap' ],
      plunkrPrivate: false,
      contentHtmlUrlPrefix: 'https://rawgit.com/mgcrea/angular-strap/' + version + '/src/',
      contentJsUrlPrefix: 'https://rawgit.com/mgcrea/angular-strap/' + version + '/src/'
    });
  } ]).config([ '$routeProvider', '$compileProvider', '$locationProvider', '$sceProvider', function($routeProvider, $compileProvider, $locationProvider, $sceProvider) {
    $locationProvider.html5Mode(false);
    $sceProvider.enabled(false);
    $compileProvider.debugInfoEnabled(false);
  } ]).run([ '$window', '$rootScope', '$location', '$anchorScroll', 'version', 'ngVersion', function($window, $rootScope, $location, $anchorScroll, version, ngVersion) {
    $rootScope.version = version;
    $rootScope.ngVersion = ngVersion;
    $window.FastClick.attach($window.document.body);
    var bodyElement = angular.element($window.document.body);
    bodyElement.on('click', function(evt) {
      var el = angular.element(evt.target);
      var hash = el.attr('href');
      if (!hash || hash[0] !== '#') return;
      if (hash.length > 1 && hash[1] === '/') return;
      if (evt.which !== 1) return;
      $location.hash(hash.substr(1));
      $anchorScroll();
    });
    setTimeout(function() {
      $anchorScroll();
    }, 0);
  } ]);
  angular.module('mgcrea.ngStrapDocs').value('indent', function(text, spaces) {
    if (!text) return text;
    var lines = text.split(/\r?\n/);
    var prefix = '      '.substr(0, spaces || 0);
    var i;
    while (lines.length && lines[0].match(/^\s*$/)) lines.shift();
    while (lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
    var minIndent = 999;
    for (i = 0; i < lines.length; i++) {
      var line = lines[0];
      var indent = line.match(/^\s*/)[0];
      if (indent !== line && indent.length < minIndent) {
        minIndent = indent.length;
      }
    }
    for (i = 0; i < lines.length; i++) {
      lines[i] = prefix + lines[i].substring(minIndent).replace(/=""/g, '');
    }
    lines.push('');
    return lines.join('\n');
  });
  angular.module('mgcrea.ngPlunkr', [ 'mgcrea.ngStrap.helpers.debounce' ]).run([ '$templateCache', 'version', function($templateCache, version) {
    var ngVersion = '1.5.5';
    var templateHtml = '' + '<!DOCTYPE html>\n' + '<html ng-app="{{ moduleName }}">\n' + '\n' + '  <head>\n' + '    <meta charset="utf-8" />\n' + '    <title>AngularJS Plunker</title>\n' + '    <script>document.write(\'<base href="\' + document.location + \'" />\');</script>\n' + '    <link rel="stylesheet" href="//cdn.jsdelivr.net/fontawesome/4.5.0/css/font-awesome.css">\n' + '    <link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap/3.3.6/css/bootstrap.min.css">\n' + '    <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/libs.min.css">\n' + '    <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/docs.min.css">\n' + '    <link rel="stylesheet" href="style.css" />\n' + '    <script src="//cdn.jsdelivr.net/angularjs/' + ngVersion + '/angular.min.js" data-semver="' + ngVersion + '"></script>\n' + '    <script src="//cdn.jsdelivr.net/angularjs/' + ngVersion + '/angular-animate.min.js" data-semver="' + ngVersion + '"></script>\n' + '    <script src="//cdn.jsdelivr.net/angularjs/' + ngVersion + '/angular-sanitize.min.js" data-semver="' + ngVersion + '"></script>\n' + '    <script src="//mgcrea.github.io/angular-strap/dist/angular-strap.js" data-semver="' + version + '"></script>\n' + '    <script src="//mgcrea.github.io/angular-strap/dist/angular-strap.tpl.js" data-semver="' + version + '"></script>\n' + '    <script src="//mgcrea.github.io/angular-strap/docs/angular-strap.docs.tpl.js" data-semver="' + version + '"></script>\n' + '    <script src="app.js"></script>\n' + '  </head>\n' + '\n' + '  <body ng-controller="MainCtrl">\n' + '\n{{ contentHtml }}\n' + '  </body>\n' + '\n' + '</html>\n';
    $templateCache.put('$plunkr-html', templateHtml);
    var templateCss = '' + '/* Put your css in here */\n' + '\n{{ contentCss }}\n';
    $templateCache.put('$plunkr-css', templateCss);
    var templateJs = '' + 'var app = angular.module(\'{{ moduleName }}\', [\'ngAnimate\', \'ngSanitize\', \'mgcrea.ngStrap\']);\n' + '\n' + 'app.controller(\'MainCtrl\', function($scope) {\n' + '});\n' + '\n{{ contentJs }}\n';
    $templateCache.put('$plunkr-js', templateJs);
  } ]).provider('$form', function() {
    var defaults = {};
    this.$get = [ '$window', function($window) {
      var bodyEl = angular.element($window.document.body);
      var $form = {};
      $form.post = function(url, fields) {
        var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
        angular.forEach(fields, function(value, name) {
          var input = angular.element('<input type="hidden" name="' + name + '">');
          input.attr('value', value);
          form.append(input);
        });
        bodyEl.append(form);
        form[0].submit();
        form.remove();
      };
      return $form;
    } ];
  }).provider('$plunkr', function() {
    var defaults = this.defaults = {
      preload: false,
      plunkrTitle: 'AngularJS Example Plunkr',
      plunkrPrivate: true,
      plunkrTags: [ 'angular' ],
      moduleName: 'plunker',
      templateHtml: '$plunkr-html',
      contentHtml: '    <p>Hello {{name}}!</p>\n',
      contentHtmlUrl: '',
      templateCss: '$plunkr-css',
      contentCss: 'body {\n  padding: 40px !important;\n}\n',
      contentCssUrl: '',
      templateJs: '$plunkr-js',
      contentJs: '  $scope.name = \'World\';\n',
      contentJsUrl: ''
    };
    this.$get = [ '$rootScope', '$compile', '$templateCache', '$q', '$http', '$form', function($rootScope, $compile, $templateCache, $q, $http, $form) {
      function PlunkrFactory(config) {
        var $plunkr = {};
        var options = angular.extend({}, defaults, config);
        var scope = $plunkr.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        $plunkr.$isReady = false;
        var deferred = $q.defer();
        $plunkr.$promise = deferred.promise;
        var postData = {};
        $plunkr.init = function() {
          postData.description = options.plunkrTitle;
          angular.forEach(options.plunkrTags, function(tag, index) {
            postData['tags[' + index + ']'] = tag;
          });
          postData.private = options.plunkrPrivate;
          if (options.preload) {
            $plunkr.load();
          }
        };
        $plunkr.load = function() {
          deferred.resolve($q.all([ 'templateHtml', 'contentHtmlUrl', 'templateCss', 'contentCssUrl', 'templateJs', 'contentJsUrl' ].map(function(key) {
            var template = options[key + 'Prefix'] ? options[key + 'Prefix'] + options[key] : options[key];
            return options[key] && $q.when($templateCache.get(template) || $http.get(template));
          })).then(function(results) {
            return results.map(function(result) {
              if (angular.isString(result)) return result; else if (angular.isArray(result)) return result[1]; else if (angular.isObject(result)) return result.data; else return result;
            });
          }).then(function(results) {
            postData['files[index.html]'] = results[0].replace(/{{ contentHtml }}/i, results[1] || options.contentHtml).replace(/{{ moduleName }}/i, options.moduleName);
            postData['files[style.css]'] = results[2].replace(/{{ contentCss }}/i, results[3] || options.contentCss).replace(/{{ moduleName }}/i, options.moduleName);
            postData['files[app.js]'] = results[4].replace(/{{ contentJs }}/i, results[5] || options.contentJs).replace(/{{ moduleName }}/i, options.moduleName);
            $plunkr.$isReady = true;
          }));
          return $plunkr.$promise;
        };
        $plunkr.open = function(load) {
          if (!$plunkr.$isReady) $plunkr.load(); else $form.post('http://plnkr.co/edit/?p=preview', postData);
        };
        $plunkr.init();
        return $plunkr;
      }
      return PlunkrFactory;
    } ];
  }).directive('ngPlunkr', [ '$plunkr', 'debounce', function($plunkr, debounce) {
    return {
      restrict: 'EAC',
      scope: true,
      template: '<i class="fa fa-edit"></i><small>plunker</small>',
      compile: function(tElement, tAttr) {
        tAttr.$set('title', 'edit in plunker');
        return function postLink(scope, element, attr, transclusion) {
          var options = {
            scope: scope
          };
          angular.forEach([ 'moduleName', 'templateHtml', 'templateJs', 'templateCss', 'contentHtmlUrl', 'contentJsUrl', 'contentCssUrl' ], function(key) {
            if (angular.isDefined(attr[key])) options[key] = attr[key];
          });
          var plunkr = $plunkr(options);
          var previousTitle = attr.title;
          function onClickHandler() {
            if (!plunkr.$isReady) {
              attr.$set('title', '<i class="fa fa-spinner fa-spin"></i>&nbsp;preparing plunker...');
              plunkr.load();
            } else {
              plunkr.open();
            }
          }
          function plunkerIsReady() {
            scope.$apply(function() {
              attr.$set('title', '<i class="fa fa-check"></i>&nbsp;punker ready, click again!');
            });
          }
          plunkr.$promise.then(debounce(plunkerIsReady, 400));
          element.on('click', onClickHandler);
          scope.$on('$destroy', function() {
            attr.$set('title', previousTitle);
            element.off('click', onClickHandler);
            plunkr.destroy();
            options = null;
            plunkr = null;
          });
        };
      }
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').directive('highlightBlock', [ '$window', 'indent', function($window, indent) {
    return {
      compile: function(element, attr) {
        element.html(indent(element.html()));
        return function postLink(scope, element, attr) {
          $window.hljs.highlightBlock(element[0]);
        };
      }
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').directive('code', function() {
    return {
      restrict: 'E',
      terminal: true
    };
  });
  angular.module('mgcrea.ngStrapDocs').directive('appendSource', [ '$window', '$compile', 'indent', function($window, $compile, indent) {
    return {
      compile: function(element, attr) {
        var options = {
          placement: 'after'
        };
        angular.forEach([ 'placement', 'hlClass' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var hlElement = angular.element('<div class="highlight" ng-non-bindable><pre><code class="html" style="margin:0"></code></pre></div>');
        var codeElement = hlElement.children('pre').children('code');
        var elementHtml = indent(element.html());
        codeElement.text(elementHtml);
        if (options.hlClass) codeElement.addClass(options.hlClass);
        element[options.placement](hlElement);
        $window.hljs.highlightBlock(codeElement[0]);
      }
    };
  } ]);
  angular.module('mgcrea.ngStrapDocs').controller('MainCtrl', [ '$scope', '$rootScope', '$location', '$anchorScroll', '$plunkr', function($scope, $rootScope, $location, $anchorScroll, $plunkr) {
    $scope.$scrollTo = function(hash) {
      $location.hash(hash);
      $anchorScroll();
    };
    $scope.createPlunkr = function() {
      var myPlunkr = $plunkr();
    };
  } ]);
})(window, document);