'use strict';

angular.module('mgcrea.ngStrap.tab', [])

  .provider('$tab', function() {

    var defaults = this.defaults = {
      animation: 'am-fade',
      template: 'tab/tab.tpl.html'
    };

    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation'], function(key) {
        if(angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      self.$panes = $scope.$panes = [];

      self.$viewChangeListeners = [];

      self.$push = function(pane) {
        self.$panes.push(pane);
      };

      self.$panes.$active = 0;
      self.$setActive = $scope.$setActive = function(value) {
        self.$panes.$active = value;
        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };

    };

    this.$get = function() {
      var $tab = {};
      $tab.defaults = defaults;
      $tab.controller = controller;
      return $tab;
    };

  })

  .directive('bsTabs', function($window, $animate, $tab) {

    var defaults = $tab.defaults;

    return {
      require: ['?ngModel', 'bsTabs'],
      transclude: true,
      scope: true,
      controller: $tab.controller,
      templateUrl: function(element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];

        // Add base class
        element.addClass('tabs');

        // Evaluate template modifiers against appropriate scope
        angular.forEach(['usePills', 'justified', 'stacked'], function (attr) {
          if (angular.isDefined(attrs[attr])) scope['$'+attr] = scope.$eval(attrs[attr]);
        });

        // Define template ngClass config object
        scope.$classConfig = {
          'nav-tabs': !scope.$usePills,
          'nav-pills': scope.$usePills,
          'nav-justified': scope.$justified,
          'nav-stacked': scope.$usePills && scope.$stacked
        };

        if(ngModelCtrl) {

          // Update the modelValue following
          bsTabsCtrl.$viewChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsTabsCtrl.$panes.$active);
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function(modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            bsTabsCtrl.$setActive(modelValue * 1);
            return modelValue;
          });

        }

      }
    };

  })

  .directive('bsPane', function($window, $animate, $sce) {

    return {
      require: ['^?ngModel', '^bsTabs'],
      scope: true,
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];

        // Add base class
        element.addClass('tab-pane');

        // Observe title attribute for change
        attrs.$observe('title', function(newValue, oldValue) {
          scope.title = $sce.trustAsHtml(newValue);
        });

        // Add animation class
        if(bsTabsCtrl.$options.animation) {
          element.addClass(bsTabsCtrl.$options.animation);
        }

        // Push pane to parent bsTabs controller
        bsTabsCtrl.$push(scope);

        function render() {
          var index = bsTabsCtrl.$panes.indexOf(scope);
          var active = bsTabsCtrl.$panes.$active;
          $animate[index === active ? 'addClass' : 'removeClass'](element, 'active');
        }

        bsTabsCtrl.$viewChangeListeners.push(function() {
          render();
        });
        render();

      }
    };

  });
