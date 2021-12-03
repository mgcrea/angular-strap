/**
 * angular-strap
 * @version v2.3.12 - 2021-12-03
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.tab').run([ '$templateCache', function($templateCache) {
  $templateCache.put('tab/tab.tpl.html', '<ul class="nav" ng-class="$navClass" role="tablist"><li role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="[ $isActive($pane, $index) ? $activeClass : \'\', $pane.disabled ? \'disabled\' : \'\' ]" ng-attr-aria-disabled="{{$pane.disabled || undefined}}" ng-attr-id="{{$pane.$describedBy || undefined}}" data-toggle="tab" data-index="{{ $index }}" ng-click="$onClick($event, $pane, $index)" ng-keydown="$onKeyPress($event, $pane.name || $index, $index)" ng-attr-aria-hidden="{{$pane.disabled || undefined}}" focus-on="$isActive($pane, $index)"><a ng-attr-id="{{$pane.$labeledBy || undefined}}" role="tab" tabindex="{{$isActive($pane, $index) ? 0 : -1}}" ng-bind-html="$pane.title" ng-attr-aria-selected="{{$isActive($pane, $index)}}" ng-attr-aria-controls="{{$pane.id || undefined}}"></a></li></ul><div ng-transclude class="tab-content"></div>');
} ]);