'use strict';

angular.module('mgcrea.ngStrap.tab', [])

  .provider('$tab', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      template: 'tab/tab.tpl.html',
      navClass: 'nav-tabs',
      activeClass: 'active',
      isVertical: false
    };
    var _tabsHash = {};

    var _addTabControl = function (key, control) {
      if (!_tabsHash[key]) _tabsHash[key] = control;
    };

    var controller = this.controller = function ($scope, $element, $attrs, $timeout) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'navClass', 'activeClass', 'id', 'isVertical'], function (key) {
        if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      // use string regex match boolean attr falsy values, leave truthy values be
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach(['isVertical'], function (key) {
        if (angular.isDefined($attrs[key]) && falseValueRegExp.test($attrs[key])) self.$options[key] = false;
      });

      // Publish options on scope
      $scope.$navClass = self.$options.navClass;
      $scope.$activeClass = self.$options.activeClass;

      $scope.$onClick = function $onClick (evt, pane, index) {
        if (!pane.disabled) {
          self.$setActive(pane.name || index);
        }

        evt.preventDefault();
        evt.stopPropagation();
      };

      function navigatePane (index, toLeft) {
        var newIndex = 0;

        if (toLeft) {
          // Moving to the left
          newIndex = index - 1 < 0 ? (self.$panes.length - 1) : (index - 1);
        } else {
          // Moving to the right
          newIndex = (index + 1) >= self.$panes.length ? 0 : (index + 1);
        }

        if (self.$panes[newIndex].disabled) {
          navigatePane(newIndex, toLeft);
        } else {
          self.$setActive(self.$panes[newIndex].name || newIndex);
        }
      }

      self.$panes = $scope.$panes = [];

      // Please use $activePaneChangeListeners if you use `bsActivePane`
      // Because we removed `ngModel` as default, we rename viewChangeListeners to
      // activePaneChangeListeners to make more sense.
      self.$activePaneChangeListeners = self.$viewChangeListeners = [];

      self.$push = function (pane) {
        if (angular.isUndefined(self.$panes.$active)) {
          $scope.$setActive(pane.name || 0);
        }

        self.$panes.push(pane);

        self.$panes.forEach(function (tabPane, index) {
          // Set an id value for the pane so that it can be used in the template
          tabPane.$describedBy = self.$options.id === undefined ? undefined : self.$options.id + '_$tab_' + index;
          tabPane.$labeledBy = self.$options.id === undefined ? undefined : self.$options.id + '_$tab_' + index + '_a';
        });
      };

      self.$remove = function (pane) {
        var index = self.$panes.indexOf(pane);
        var active = self.$panes.$active;
        var activeIndex;
        if (angular.isString(active)) {
          activeIndex = self.$panes.map(function (pane) {
            return pane.name;
          }).indexOf(active);
        } else {
          activeIndex = self.$panes.$active;
        }

        // remove pane from $panes array
        self.$panes.splice(index, 1);

        if (index < activeIndex) {
          // we removed a pane before the active pane, so we need to
          // decrement the active pane index
          activeIndex--;
        } else if (index === activeIndex && activeIndex === self.$panes.length) {
          // we remove the active pane and it was the one at the end,
          // so select the previous one
          activeIndex--;
        }
        if (activeIndex >= 0 && activeIndex < self.$panes.length) {
          self.$setActive(self.$panes[activeIndex].name || activeIndex);
        } else {
          self.$setActive();
        }
      };

      self.$setActive = $scope.$setActive = function (value) {
        self.$panes.$active = value;
        self.$activePaneChangeListeners.forEach(function (fn) {
          fn();
        });
      };

      self.$isActive = $scope.$isActive = function ($pane, $index) {
        return self.$panes.$active === $pane.name || self.$panes.$active === $index;
      };

      self.$onKeyPress = $scope.$onKeyPress = function (e, name, index) {
        if (e.keyCode === 32 || e.charCode === 32 || e.keyCode === 13 || e.charCode === 13) {
          // If space or enter was pressed
          self.$setActive(name);

          e.preventDefault();
          e.stopPropagation();

        } else if (!self.$options.isVertical && (e.keyCode === 37 || e.charCode === 37 || e.keyCode === 39 || e.charCode === 39)) {
          // If the left of right arrow key was pressed.
          navigatePane(index, (e.keyCode === 37 || e.charCode === 37));
        } else if (self.$options.isVertical && (e.keyCode === 38 || e.charCode === 38 || e.keyCode === 40 || e.charCode === 40)) {
          // If the left of right arrow key was pressed.
          navigatePane(index, (e.keyCode === 38 || e.charCode === 38));
        }
      };
    };

    this.$get = function () {
      var $tab = {};
      $tab.defaults = defaults;
      $tab.controller = controller;
      $tab.addTabControl = _addTabControl;
      $tab.tabsHash = _tabsHash;
      return $tab;
    };

  })

  .directive('bsTabs', function ($window, $animate, $tab, $parse, $timeout) {

    var defaults = $tab.defaults;

    return {
      require: ['?ngModel', 'bsTabs'],
      transclude: true,
      scope: true,
      controller: ['$scope', '$element', '$attrs', '$timeout', $tab.controller],
      templateUrl: function (element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink (scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];

        // Add a way for developers to access tab scope if needed.  This allows for more fine grained control over what
        // tabs are available in the tab component
        if (attrs.tabKey !== '' && attrs.tabKey !== undefined) {
          $tab.addTabControl(attrs.tabKey, bsTabsCtrl);
        }

        // 'ngModel' does interfere with form validation
        // and status, use `bsActivePane` instead to avoid it
        if (ngModelCtrl) {

          // Update the modelValue following
          bsTabsCtrl.$activePaneChangeListeners.push(function () {
            ngModelCtrl.$setViewValue(bsTabsCtrl.$panes.$active);
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function (modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            bsTabsCtrl.$setActive(modelValue);
            return modelValue;
          });
        }

        bsTabsCtrl.$activePaneChangeListeners.push(function () {
          $timeout(function () {
            // get li elements
            var liElements = element.find('li');
            for (var i = 0; i < liElements.length; i++) {
              var iElement = angular.element(liElements[i]);
              iElement.removeAttr('tabindex');
              if (iElement.hasClass(bsTabsCtrl.$options.activeClass)) {
                // if li is active, set focus to it.
                iElement.find('a')[0].focus();
              }
            }
            // delay, for the class (.active) change to reflect in DOM.
          }, 100);
        });

        if (attrs.bsActivePane) {
          // adapted from angularjs ngModelController bindings
          // https://github.com/angular/angular.js/blob/v1.3.1/src%2Fng%2Fdirective%2Finput.js#L1730
          var parsedBsActivePane = $parse(attrs.bsActivePane);

          // Update bsActivePane value with change
          bsTabsCtrl.$activePaneChangeListeners.push(function () {
            parsedBsActivePane.assign(scope, bsTabsCtrl.$panes.$active);
          });

          // watch bsActivePane for value changes
          scope.$watch(attrs.bsActivePane, function (newValue, oldValue) {
            bsTabsCtrl.$setActive(newValue);
          }, true);
        }
      }
    };

  })

  .directive('bsPane', function ($window, $animate, $sce) {

    return {
      require: ['^?ngModel', '^bsTabs'],
      scope: true,
      link: function postLink (scope, element, attrs, controllers) {

        // var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];

        // Add base class
        element.addClass('tab-pane');

        // Set up the assistive attributes
        element.attr('role', 'tabpanel');

        // Observe title attribute for change
        attrs.$observe('title', function (newValue, oldValue) {
          scope.title = $sce.trustAsHtml(newValue);
        });

        // Save tab name into scope
        scope.name = attrs.name;
        // Save tab id into scope
        scope.id = attrs.id;

        scope.name = scope.name || scope.id;

        // Add animation class
        if (bsTabsCtrl.$options.animation) {
          element.addClass(bsTabsCtrl.$options.animation);
        }

        attrs.$observe('disabled', function (newValue, oldValue) {
          scope.disabled = scope.$eval(newValue);
        });

        // Push pane to parent bsTabs controller
        bsTabsCtrl.$push(scope);

        // Once the push has occured when can then update the element with some properties.
        // Update the aria-labelledby attribute
		// SS-11127 - removed aria-describedby from tab and tab-panel and utilized aria-labeledby on the tab-panel using the ID of the tab and not the ID of the tab link
        if (scope.$describedBy !== undefined) {
          element.attr('aria-labelledby', scope.$describedBy);
        }

        // remove pane from tab controller when pane is destroyed
        scope.$on('$destroy', function () {
          bsTabsCtrl.$remove(scope);
        });

        function render () {
          var index = bsTabsCtrl.$panes.indexOf(scope);

          $animate[bsTabsCtrl.$isActive(scope, index) ? 'addClass' : 'removeClass'](element, bsTabsCtrl.$options.activeClass);
        }

        bsTabsCtrl.$activePaneChangeListeners.push(function () {
          render();
        });
        render();

      }
    };

  })

  .directive('focusOn', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        scope.$watch(attr.focusOn, function (newValue, oldValue) {
          if (newValue !== oldValue && newValue) {
            elem[0].focus();
          }
        });
      }
    };
  });
