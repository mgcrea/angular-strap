/**
 * angular-strap
 * @version v2.3.12 - 2021-12-03
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.typeahead').run([ '$templateCache', function($templateCache) {
  $templateCache.put('typeahead/typeahead.tpl.html', '<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="listbox" ng-attr-aria-hidden="{{!$isVisible()}}"><li role="option" ng-repeat="match in $matches" ng-class="{active: $isActive($index)}" ng-attr-aria-selected="{{$isActive($index)}}" ng-attr-id="{{::$generateResultId($index)}}"><a role="presentation" ng-click="$select($index, $event)" ng-bind="match.label"></a></li></ul>');
} ]);