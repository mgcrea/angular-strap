'use strict';

angular.module('mgcrea.ngStrapDocs', [
  'mgcrea.ngStrap',
  'mgcrea.ngPlunkr',
  // 'ngSanitize',
  'ngRoute',
  'ngAnimate'
])

.constant('version', 'v2.1.3')

.config(function($plunkrProvider, version) {

  angular.extend($plunkrProvider.defaults, {
    plunkrTitle: 'AngularStrap Example Plunkr',
    plunkrTags: ['angular', 'angular-strap'],
    plunkrPrivate: false,
    contentHtmlUrlPrefix: 'https://rawgit.com/mgcrea/angular-strap/' + version + '/src/',
    contentJsUrlPrefix: 'https://rawgit.com/mgcrea/angular-strap/' + version + '/src/'
  });

})

.config(function($routeProvider, $locationProvider, $sceProvider) {

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(false);

  // disable strict context
  $sceProvider.enabled(false);

  // $routeProvider
    // .when('/', {
    //   id: 'home',
    //   templateUrl: 'views/home/main.html',
    //   footerUrl: 'views/home/footer.html'
    // })
    // .when('/directives', {
    //   id: 'getting-started',
    //   templateUrl: 'views/getting-started/main.html',
    //   headerUrl: 'views/common/header.html',
    //   headerTitle: 'Getting started',
    //   headerBody: 'An overview of Bootstrap, how to download and use, basic templates and examples, and more.',
    //   footerUrl: 'views/common/footer.html',
    //   reloadOnSearch: false
    // })
    // .when('/styles', {
    //   id: 'styles',
    //   controller: 'ComponentsCtrl',
    //   templateUrl: 'views/styles/main.html',
    //   headerUrl: 'views/common/header.html',
    //   headerTitle: 'Styles',
    //   headerBody: 'Fundamental HTML elements styled and enhanced with extensible classes.',
    //   footerUrl: 'views/common/footer.html',
    //   reloadOnSearch: false
    // })
    // .when('/javascript', {
    //   controller: 'JavascriptCtrl',
    //   templateUrl: 'views/javascript.html',
    //   headerUrl: 'views/layout/header.html',
    //   headerTitle: 'Javascript',
    //   headerBody: 'Bring components to life with over a dozen custom AngularJS plugins.',
    //   reloadOnSearch: false
    // })
    // .otherwise({
    //   redirectTo: '/directives'
    // });

})

.controller('MainCtrl', function ($scope, $rootScope, $location, $anchorScroll, $plunkr) {

  $scope.$location = $location;

  $scope.$scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };

  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    // $location.hash($routeParams.scrollTo);
    // $anchorScroll();
  });

  $scope.createPlunkr = function() {
    var myPlunkr = $plunkr();
  };

})

.run(function($window, $rootScope, $location, $anchorScroll, version) {

  $rootScope.version = version;

  // FastClick
  $window.FastClick.attach($window.document.body);

  var bodyElement = angular.element($window.document.body);
  var targetElement = bodyElement; //angular.element(document.querySelector('body > .bs-docs-container'));
  targetElement.on('click', function(evt) {
    var el = angular.element(evt.target);
    var hash = el.attr('href');
    if(!hash || hash[0] !== '#') return;
    if(hash.length > 1 && hash[1] === '/') return;
    if(evt.which !== 1) return;
    evt.preventDefault();
    console.warn('$location.hash', hash);
    $location.hash(hash.substr(1));
    // $location.path('/' + hash.substr(1));
    // $location.search('id', hash.substr(1));
    $anchorScroll();
    $rootScope.$digest();
    console.warn('in');
  });

  // Initial $anchorScroll()
  setTimeout(function() {
    $anchorScroll();
  }, 0);

})

.directive('code', function() {
  return {restrict: 'E', terminal: true};
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

// function normalizeHtml(html) {
//   var lines = html.split('\n');
//   var splitString = lines.filter(String);
//   if(!splitString.length) return '';

//   // Remove any leading blank lines
//   while(lines.length && lines[0].match(/^\s*$/)) lines.shift();
//   // Remove any trailing blank lines
//   while(lines.length && lines[lines.length - 1].match(/^\s*$/)) lines.pop();
//   // Calculate proper indent
//   var indent = 0;
//   for(; indent < splitString[0].length && splitString[0][indent] === ' '; indent++) {}
//   for(; indent < splitString[0].length && splitString[0][indent] === '\t'; indent+=2) {}
//   var re = new RegExp('^' + Array.apply(null, new Array(indent)).map(String.prototype.valueOf, '\\s').join(''), ['g']);

//   lines = lines.map(function(line) {
//     return line.replace(re, '').replace(/=""/g, '');
//   });

//   lines = lines.filter(function(line, num) {
//     if((!num || num === lines.length) && !line.trim()) return false;
//     return true;
//   });
//   return lines.join('\n');
// }
