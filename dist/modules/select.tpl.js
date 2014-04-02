/**
 * angular-strap
 * @version v2.0.0-rc.4 - 2014-04-02
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('mgcrea.ngStrap.select').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('select/select.tpl.html',
    "<ul tabindex=\"-1\" class=\"select dropdown-menu\" ng-show=\"$isVisible()\" role=\"select\"><li role=\"presentation\" ng-repeat=\"match in $matches\" ng-class=\"{active: $isActive($index)}\"><a style=\"cursor: default\" role=\"menuitem\" tabindex=\"-1\" ng-click=\"$select($index, $event)\"><span ng-bind=\"match.label\"></span> <i class=\"glyphicon glyphicon-ok pull-right\" ng-if=\"$isMultiple && $isActive($index)\"></i></a></li></ul>"
  );

}]);
