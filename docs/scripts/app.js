'use strict';

angular.module('mgcrea.ngStrapDocs', [
  'mgcrea.ngStrap',
  'mgcrea.ngPlunkr',
  'ngRoute',
  'ngAnimate'
])

.constant('version', 'v2.1.6')

.config(function($plunkrProvider, version) {

  angular.extend($plunkrProvider.defaults, {
    plunkrTitle: 'AngularStrap Example Plunkr',
    plunkrTags: ['angular', 'angular-strap'],
    plunkrPrivate: false,
    contentHtmlUrlPrefix: 'https://rawgit.com/mgcrea/angular-strap/' + version + '/src/',
    contentJsUrlPrefix: 'https://rawgit.com/mgcrea/angular-strap/' + version + '/src/'
  });

})

.config(function($routeProvider, $compileProvider, $locationProvider, $sceProvider) {

  // Configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(false);

  // Disable strict context
  $sceProvider.enabled(false);

  // Disable scope debug data
  $compileProvider.debugInfoEnabled(false);

})

.controller('MainCtrl', function ($scope, $rootScope, $location, $anchorScroll, $plunkr) {

  $scope.$location = $location;

  $scope.$scrollTo = function(hash) {
    $location.hash(hash);
    $anchorScroll();
  };

  $scope.createPlunkr = function() {
    var myPlunkr = $plunkr();
  };

})

.run(function($window, $rootScope, $location, $anchorScroll, version) {

  $rootScope.version = version;

  // FastClick
  $window.FastClick.attach($window.document.body);
  
  // Support simple anchor id scrolling
  var bodyElement = angular.element($window.document.body);
  bodyElement.on('click', function(evt) {
    var el = angular.element(evt.target);
    var hash = el.attr('href');
    if(!hash || hash[0] !== '#') return;
    if(hash.length > 1 && hash[1] === '/') return;
    if(evt.which !== 1) return;
    $location.hash(hash.substr(1));
    $anchorScroll();
  });

  // Initial $anchorScroll()
  setTimeout(function() {
    $anchorScroll();
  }, 0);

})

.directive('code', function() {

  return {
    restrict: 'E',
    terminal: true
  };

})

.directive('appendSource', function($window, $compile, indent) {

  return {
    compile: function(element, attr) {

      // Directive options
      var options = {placement: 'after'};
      angular.forEach(['placement', 'hlClass'], function(key) {
        if(angular.isDefined(attr[key])) options[key] = attr[key];
      });

      var hlElement = angular.element('<div class="highlight" ng-non-bindable><pre><code class="html" style="margin:0"></code></pre></div>');
      var codeElement = hlElement.children('pre').children('code');
      var elementHtml = indent(element.html());
      codeElement.text(elementHtml);
      if(options.hlClass) codeElement.addClass(options.hlClass);
      element[options.placement](hlElement);
      $window.hljs.highlightBlock(codeElement[0]);

    }
  };

})

.directive('highlightBlock', function($window, indent) {

  return {
    compile: function(element, attr) {
      element.html(indent(element.html()));
      return function postLink(scope, element, attr) {
        $window.hljs.highlightBlock(element[0]);
      };
    }
  };


})

.value('indent', function(text, spaces) {

  if(!text) return text;
  var lines = text.split(/\r?\n/);
  var prefix = '      '.substr(0, spaces || 0);
  var i;

  // Remove any leading blank lines
  while(lines.length && lines[0].match(/^\s*$/)) lines.shift();
  // Remove any trailing blank lines
  while(lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
  // Calculate proper indent
  var minIndent = 999;
  for(i = 0; i < lines.length; i++) {
    var line = lines[0];
    var indent = line.match(/^\s*/)[0];
    if(indent !== line && indent.length < minIndent) {
      minIndent = indent.length;
    }
  }

  for(i = 0; i < lines.length; i++) {
    lines[i] = prefix + lines[i].substring(minIndent).replace(/=""/g, '');
  }
  lines.push('');
  return lines.join('\n');

});
