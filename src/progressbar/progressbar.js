'use strict';

angular.module('mgcrea.ngStrap.progressbar', [])
.provider('$progressbar', function (){
    var defaults = {
      type: '',
      animate: true
    };

    this.$get = function (){
      return {
        defaults: defaults
      };
    };
  })
  .directive('bsProgressbar', function ($progressbar){
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'progressbar/progressbar.tpl.html',
      scope:{
        value: '=',
        type: '@',
        animate: '=?'
      },
      link: function (scope, element, attr){
        scope.type = scope.type || $progressbar.defaults.type;
        scope.animate = angular.isDefined(scope.animate) ? scope.animate : $progressbar.defaults.animate;
      }
    };
  });
