/**
 * angular-strap
 * @version v2.0.0-rc.2 - 2014-01-29
 * @link http://mgcrea.github.io/angular-strap
 * @author [object Object]
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('mgcrea.ngStrap.select').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('select/select.tpl.html',
    "<ul tabindex=\"-1\" class=\"select dropdown-menu\" ng-show=\"$isVisible()\" role=\"select\"><li ng-repeat-start=\"match in $matches\" ng-if='match.groupBy && ($index == 0 || match.groupBy != $matches[$index-1].groupBy)'><a style='cursor: default; background-color: #fff;'><span ng-bind=\"match.groupBy\" style='font-weight: bold;'></span></a></li><li role=\"presentation\" ng-repeat-end><a style=\"cursor: default\" role=\"menuitem\" tabindex=\"-1\" ng-click=\"$select($index, $event)\"><span ng-bind=\"match.label\"></span> <i class=\"glyphicon glyphicon-ok pull-right\" ng-if=\"$isMultiple && $isActive($index)\"></i></a></li></ul>"
  );

}]);
