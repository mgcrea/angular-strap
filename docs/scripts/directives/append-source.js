'use strict';

angular.module('mgcrea.ngStrapDocs')

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

  });
