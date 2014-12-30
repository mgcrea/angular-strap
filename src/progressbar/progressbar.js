'use strict';

angular.module('mgcrea.ngStrap.progressbar', [])
.provider('$progressbar', function (){
    var defaults = {
      barType: '',
      animate: function (){ return true;}
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
        animate: '&'
      },
      link: function (scope, element, attr){
        scope.type = scope.type || $progressbar.defaults.barType;
        scope.animate = angular.isDefined(scope.animate()) ? scope.animate : $progressbar.defaults.animate;
        scope.$watch('type', function (){
          if(scope.type) {
            scope.barClass = 'progress-bar-' + scope.type;
          }
          else{
            scope.barClass = null;
          }
        });
      }
    };
  });
