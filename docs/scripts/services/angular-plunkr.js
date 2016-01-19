'use strict';

angular.module('mgcrea.ngPlunkr', ['mgcrea.ngStrap.helpers.debounce'])

.run(function($templateCache, version) {

  var ngVersion = '1.4.5';

  var templateHtml = '' +
    '<!DOCTYPE html>\n' +
    '<html ng-app="{{ moduleName }}">\n' +
    '\n' +
    '  <head>\n' +
    '    <meta charset="utf-8" />\n' +
    '    <title>AngularJS Plunker</title>\n' +
    '    <script>document.write(\'<base href="\' + document.location + \'" />\');</script>\n' +

    // styles
    '    <link rel="stylesheet" href="//cdn.jsdelivr.net/fontawesome/4.3.0/css/font-awesome.css">\n' +
    '    <link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap/3.3.4/css/bootstrap.min.css">\n' +
    '    <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/libs.min.css">\n' +
    '    <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/docs.min.css">\n' +
    '    <link rel="stylesheet" href="style.css" />\n' +

    // scripts
    '    <script src="//cdn.jsdelivr.net/angularjs/' + ngVersion + '/angular.min.js" data-semver="' + ngVersion + '"></script>\n' +
    '    <script src="//cdn.jsdelivr.net/angularjs/' + ngVersion + '/angular-animate.min.js" data-semver="' + ngVersion + '"></script>\n' +
    '    <script src="//cdn.jsdelivr.net/angularjs/' + ngVersion + '/angular-sanitize.min.js" data-semver="' + ngVersion + '"></script>\n' +
    '    <script src="//mgcrea.github.io/angular-strap/dist/angular-strap.js" data-semver="' + version + '"></script>\n' +
    '    <script src="//mgcrea.github.io/angular-strap/dist/angular-strap.tpl.js" data-semver="' + version + '"></script>\n' +
    '    <script src="//mgcrea.github.io/angular-strap/docs/angular-strap.docs.tpl.js" data-semver="' + version + '"></script>\n' +
    '    <script src="app.js"></script>\n' +

    '  </head>\n' +
    '\n' +
    '  <body ng-controller="MainCtrl">\n' +
    '\n{{ contentHtml }}\n' +
    '  </body>\n' +
    '\n' +
    '</html>\n';

  $templateCache.put('$plunkr-html', templateHtml);

  var templateCss = '' +
    '/* Put your css in here */\n' +
    '\n{{ contentCss }}\n';

  $templateCache.put('$plunkr-css', templateCss);

  var templateJs = '' +
    'var app = angular.module(\'{{ moduleName }}\', [\'ngAnimate\', \'ngSanitize\', \'mgcrea.ngStrap\']);\n' +
    '\n' +
    'app.controller(\'MainCtrl\', function($scope) {\n' +
    '});\n' +
    '\n{{ contentJs }}\n';

  $templateCache.put('$plunkr-js', templateJs);

})

.provider('$form', function() {

  var defaults = {};

  this.$get = function($window) {

    var bodyEl = angular.element($window.document.body);

    var $form = {};

    $form.post = function(url, fields) {
      var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
      angular.forEach(fields, function(value, name) {
        var input = angular.element('<input type="hidden" name="' +  name + '">');
        input.attr('value', value);
        form.append(input);
      });
      bodyEl.append(form);
      form[0].submit();
      form.remove();
    };

    return $form;

  };

})

.provider('$plunkr', function() {

  var defaults = this.defaults = {
    preload: false,
    plunkrTitle: 'AngularJS Example Plunkr',
    plunkrPrivate: true,
    plunkrTags: ['angular'],
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

  this.$get = function($rootScope, $compile, $templateCache, $q, $http, $form) {

    function PlunkrFactory(config) {

      var $plunkr = {};

      // Common vars
      var options = angular.extend({}, defaults, config);
      var scope = $plunkr.$scope = options.scope && options.scope.$new() || $rootScope.$new();
      $plunkr.$isReady = false;

      // Private vars

      var deferred = $q.defer();
      $plunkr.$promise = deferred.promise;
      var postData = {};

      $plunkr.init = function() {

        postData.description = options.plunkrTitle;
        angular.forEach(options.plunkrTags, function(tag, index) {
          postData['tags[' + index + ']'] = tag;
        });
        postData.private = options.plunkrPrivate;
        if(options.preload) {
          $plunkr.load();
        }

      };

      $plunkr.load = function() {
        deferred.resolve($q.all(['templateHtml', 'contentHtmlUrl', 'templateCss', 'contentCssUrl', 'templateJs', 'contentJsUrl'].map(function(key) {
          var template = options[key + 'Prefix'] ? options[key + 'Prefix'] + options[key] : options[key];
          return options[key] && $q.when($templateCache.get(template) || $http.get(template));
        })).then(function(results) {
          return results.map(function(result) {
            if(angular.isString(result)) return result;
            else if(angular.isArray(result)) return result[1];
            else if(angular.isObject(result)) return result.data;
            else return result;
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
        if(!$plunkr.$isReady) $plunkr.load();
        else $form.post('http://plnkr.co/edit/?p=preview', postData);
      };

      $plunkr.init();
      return $plunkr;

    }

    return PlunkrFactory;

  };

})

.directive('ngPlunkr', function($plunkr, debounce) {

  return {
    restrict: 'EAC',
    scope: true,
    // priority: 10000,
    template: '<i class="fa fa-edit"></i><small>plunker</small>',
    compile: function(tElement, tAttr) {

      // tElement.attr('data-title', 'edit in plunker');
      // tElement.attr('data-placement', 'right');
      // tElement.attr('bs-tooltip', '');

      tAttr.$set('title', 'edit in plunker');

      return function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['moduleName', 'templateHtml', 'templateJs', 'templateCss', 'contentHtmlUrl', 'contentJsUrl', 'contentCssUrl'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Initialize plnkr
        var plunkr = $plunkr(options);

        var previousTitle = attr.title;
        function onClickHandler() {
          if(!plunkr.$isReady) {
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

        // Trigger
        element.on('click', onClickHandler);

        // Garbage collection
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
});


/*
function(templateMerge, formPostData, prepareEditorAssetTags, prepareDefaultAppModule) {
  return function(content) {
    var hasRouting = false;
    angular.forEach(content.deps, function(file) {
      hasRouting = hasRouting || file.name == 'angular-route.js';
    });
    var indexHtmlContent = '<!doctype html>\n' +
                           '<html ng-app="{{module}}">\n' +
                           '  <head>\n' +
                           '{{scriptDeps}}';

    if(hasRouting) {
        indexHtmlContent += '<script type="text/javascript">\n' +
                            '//this is here to make plunkr work with AngularJS routing\n' +
                            'angular.element(document.getElementsByTagName(\'head\')).append(' +
                              'angular.element(\'<base href="\' + window.location.pathname + \'" />\')' +
                            ');\n' +
                            '</script>\n';
    }

    indexHtmlContent += '</head>\n' +
                        '  <body>\n\n' +
                        '{{indexContents}}\n\n' +
                        '  </body>\n' +
                        '</html>\n';

    indexProp = {
      module: content.module,
      scriptDeps: prepareEditorAssetTags(content, { includeLocalFiles : true }),
      indexContents: content.html[0].content
    };

    var allFiles = [].concat(content.js, content.css, content.html, content.json);

    if(!content.module) {
      var moduleData = prepareDefaultAppModule(content);
      indexProp.module = moduleData.module;

      var found = false;
      angular.forEach(content.js, function(file) {
        if(file.name == 'script.js') {
          file.content = moduleData.script + file.content;
          found = true;
        }
      });
      if(!found) {
        indexProp.scriptDeps += '<script type="text/javascript" src="script.js"></script>\n';
        allFiles.push({
          name : 'script.js',
          content : moduleData.script
        });
      }
    };

    var postData = {};

    angular.forEach(allFiles, function(file, index) {
      if (file.content && file.name != 'index.html') {
        postData['files[' + file.name + ']'] = file.content;
      }
    });

    postData['files[index.html]'] = templateMerge(indexHtmlContent, indexProp);
    postData['tags[]'] = "angularjs";

    postData.private = true;
    postData.description = 'AngularJS Example Plunkr';

    formPostData('http://plnkr.co/edit/?p=preview', postData);
  };
};*/
