'use strict';

angular.module('mgcrea.ngStrapDocs')

  .directive('code', function() {

    return {
      restrict: 'E',
      terminal: true
    };

  });
