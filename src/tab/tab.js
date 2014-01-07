'use strict';

angular.module('mgcrea.ngStrap.tab', [])

  .run(function($templateCache) {

    $templateCache.put('$pane', '{{pane.content}}');

    var template = '<ul class="nav nav-tabs">' +
      '<li ng-repeat="pane in panes" ng-class="{active:$index==active}">' +
        '<a data-toggle="tab" ng-click="setActive($index, $event)" data-index="{{$index}}">{{pane.title}}</a>' +
      '</li>' +
    '</ul>' +
    '<div class="tab-content">' +
      '<div ng-repeat="pane in panes" class="tab-pane" ng-class="[$index==active?\'active\':\'\']" ng-include="pane.template || \'$pane\'"></div>' +
    '</div>';

    $templateCache.put('$tabs', template);

  })

  .provider('$tab', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      template: '$tabs'
    };

    this.$get = function() {
      return {defaults: defaults};
    };

  })

  .directive('bsTabs', function($window, $animate, $tab) {

    var defaults = $tab.defaults;

    return {
      restrict: 'EAC',
      scope: true,
      require: '?ngModel',
      templateUrl: function(element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = defaults;
        angular.forEach(['animation'/*, 'template'*/], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Require scope as an object
        attr.bsTabs && scope.$watch(attr.bsTabs, function(newValue, oldValue) {
          scope.panes = newValue;
        }, true);

        // Add base class
        element.addClass('tabs');

        // Support animations
        if(options.animation) {
          element.addClass(options.animation);
        }

        scope.active = scope.activePane = 0;
        // view -> model
        scope.setActive = function(index, ev) {
          scope.active = index;
          if(controller) {
            controller.$setViewValue(index);
          }
        };

        // model -> view
        if(controller) {
          controller.$render = function() {
            scope.active = controller.$modelValue * 1;
          };
        }

      }
    };

  });
