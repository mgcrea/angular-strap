/**
 * angular-strap
 * @version v2.0.2 - 2014-05-28
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';
angular.module('mgcrea.ngStrap.tooltip').run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('tooltip/tooltip.tpl.html', '<div class="tooltip in" ng-show="title"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="title"></div></div>');
  }
]);