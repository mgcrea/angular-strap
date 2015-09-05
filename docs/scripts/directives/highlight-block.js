'use strict';

angular.module('mgcrea.ngStrapDocs')

  .directive('highlightBlock', function($window, indent) {

    return {
      compile: function(element, attr) {
        element.html(indent(element.html()));
        return function postLink(scope, element, attr) {
          $window.hljs.highlightBlock(element[0]);
        };
      }
    };

  });
