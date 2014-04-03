/**
 * angular-strap
 * @version v2.0.0-rc.4 - 2014-04-03
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes (olivier@mg-crea.com)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('mgcrea.ngStrap.tab').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('tab/tab.tpl.html',
    "<ul class=\"nav nav-tabs\"><li ng-repeat=\"pane in panes\" ng-class=\"{active: $index == active}\"><a data-toggle=\"tab\" ng-click=\"setActive($index, $event)\" data-index=\"{{$index}}\">{{pane.title}}</a></li></ul><div class=\"tab-content\"><div ng-repeat=\"pane in panes\" class=\"tab-pane\" ng-class=\"[$index == active ? 'active' : '']\" ng-include=\"pane.template || '$pane'\"></div></div>"
  );

}]);
