'use strict';

angular.module('mgcrea.ngStrap.collapse', [])

  .provider('$collapse', function () {

    var defaults = this.defaults = {
      animation: 'am-collapse',
      disallowToggle: false,
      activeClass: 'in',
      startCollapsed: false,
      allowMultiple: false
    };

    var controller = this.controller = function ($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'disallowToggle', 'activeClass', 'startCollapsed', 'allowMultiple'], function (key) {
        if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      // use string regex match boolean attr falsy values, leave truthy values be
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach(['disallowToggle', 'startCollapsed', 'allowMultiple'], function (key) {
        if (angular.isDefined($attrs[key]) && falseValueRegExp.test($attrs[key])) {
          self.$options[key] = false;
        }
      });

      self.$toggles = [];
      self.$targets = [];

      self.$viewChangeListeners = [];

      self.$registerToggle = function (element) {
        self.$toggles.push(element);
        element.attr('aria-expanded', 'false');
      };
      self.$registerTarget = function (element) {
        self.$targets.push(element);

        var i = 0;
        if (self.$targets) {
          for (i = 0; i < self.$targets.length; i++) {
            self.$targets[i].attr('aria-hidden', 'true');
          }
          for (i = 0; i < self.$targets.$active.length; i++) {
            if (self.$targets[self.$targets.$active[i]]) {
              self.$targets[self.$targets.$active[i]].attr('aria-hidden', 'false');
            }
            if (self.$toggles[self.$targets.$active[i]]) {
              self.$toggles[self.$targets.$active[i]].attr('aria-expanded', 'true');
            }
          }
        }
      };

      self.$unregisterToggle = function (element) {
        var index = self.$toggles.indexOf(element);
        // remove toggle from $toggles array
        self.$toggles.splice(index, 1);
      };
      self.$unregisterTarget = function (element) {
        var index = self.$targets.indexOf(element);

        // remove element from $targets array
        self.$targets.splice(index, 1);

        if (self.$options.allowMultiple) {
          // remove target index from $active array values
          deactivateItem(element);
        }

        // fix active item indexes
        fixActiveItemIndexes(index);

        self.$viewChangeListeners.forEach(function (fn) {
          fn();
        });
      };

      // use array to store all the currently open panels
      self.$targets.$active = !self.$options.startCollapsed ? [0] : [];
      self.$setActive = $scope.$setActive = function (value) {
        if (angular.isArray(value)) {
          self.$targets.$active = value;
        } else if (!self.$options.disallowToggle && isActive(value)) {
          deactivateItem(value);
        } else {
          activateItem(value);
        }

        self.$viewChangeListeners.forEach(function (fn) {
          fn();
        });
      };

      self.$activeIndexes = function () {
        if (self.$options.allowMultiple) {
          return self.$targets.$active;
        }
        return self.$targets.$active.length === 1 ? self.$targets.$active[0] : -1;
      };

      function fixActiveItemIndexes (index) {
        // item with index was removed, so we
        // need to adjust other items index values
        var activeIndexes = self.$targets.$active;
        for (var i = 0; i < activeIndexes.length; i++) {
          if (index < activeIndexes[i]) {
            activeIndexes[i] = activeIndexes[i] - 1;
          }

          // the last item is active, so we need to
          // adjust its index
          if (activeIndexes[i] === self.$targets.length) {
            activeIndexes[i] = self.$targets.length - 1;
          }
        }
      }

      function isActive (value) {
        var activeItems = self.$targets.$active;
        return activeItems.indexOf(value) !== -1;
      }

      function deactivateItem (value) {
        var index = self.$targets.$active.indexOf(value);
        if (index !== -1) {
          self.$targets[self.$targets.$active[index]].attr('aria-hidden', 'true');
          self.$toggles[self.$targets.$active[index]].attr('aria-expanded', 'false');
          self.$targets.$active.splice(index, 1);
        }
      }

      function activateItem (value) {
        if (!self.$options.allowMultiple) {
          // remove current selected item
          if (self.$targets[self.$targets.$active[0]] !== undefined) {
            self.$targets[self.$targets.$active[0]].attr('aria-hidden', 'true');
          }
          if (self.$toggles[self.$targets.$active[0]]) {
            self.$toggles[self.$targets.$active[0]].attr('aria-expanded', 'false');
          }
          self.$targets.$active.splice(0, 1);
        }

        if (self.$targets.$active.indexOf(value) === -1) {
          self.$targets.$active.push(value);

          if (self.$targets[self.$targets.$active[self.$targets.$active.length - 1]] !== undefined) {
            self.$targets[self.$targets.$active[self.$targets.$active.length - 1]].attr('aria-hidden', 'false');
          }
          if (self.$toggles[self.$targets.$active[self.$targets.$active.length - 1]] !== undefined) {
            self.$toggles[self.$targets.$active[self.$targets.$active.length - 1]].attr('aria-expanded', 'true');
          }
        }
      }

    };

    this.$get = function () {
      var $collapse = {};
      $collapse.defaults = defaults;
      $collapse.controller = controller;
      return $collapse;
    };

  })

  .directive('bsCollapse', function ($window, $animate, $collapse) {

    return {
      require: ['?ngModel', 'bsCollapse'],
      controller: ['$scope', '$element', '$attrs', $collapse.controller],
      link: function postLink (scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];

        if (ngModelCtrl) {

          // Update the modelValue following
          bsCollapseCtrl.$viewChangeListeners.push(function () {
            ngModelCtrl.$setViewValue(bsCollapseCtrl.$activeIndexes());
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function (modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            if (angular.isArray(modelValue)) {
              // model value is an array, so just replace
              // the active items directly
              bsCollapseCtrl.$setActive(modelValue);
            } else {
              var activeIndexes = bsCollapseCtrl.$activeIndexes();

              if (angular.isArray(activeIndexes)) {
                // we have an array of selected indexes
                if (activeIndexes.indexOf(modelValue * 1) === -1) {
                  // item with modelValue index is not active
                  bsCollapseCtrl.$setActive(modelValue * 1);
                }
              } else if (activeIndexes !== modelValue * 1) {
                bsCollapseCtrl.$setActive(modelValue * 1);
              }
            }
            return modelValue;
          });

        }

      }
    };

  })

  .directive('bsCollapseToggle', function () {
    var KEY_CODES = {
      ENTER: 13,
      SPACE: 32
    };
    return {
      require: ['^?ngModel', '^bsCollapse'],
      link: function postLink (scope, element, attrs, controllers) {

        // var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];

        // Add base attr
        element.attr('data-toggle', 'collapse');

        // Push pane to parent bsCollapse controller
        bsCollapseCtrl.$registerToggle(element);

        // remove toggle from collapse controller when toggle is destroyed
        scope.$on('$destroy', function () {
          bsCollapseCtrl.$unregisterToggle(element);
        });

        var actionEventHandler = function () {
          if (!attrs.disabled) {
            var index = attrs.bsCollapseToggle && attrs.bsCollapseToggle !== 'bs-collapse-toggle' ? attrs.bsCollapseToggle : bsCollapseCtrl.$toggles.indexOf(element);
            bsCollapseCtrl.$setActive(index * 1);
            scope.$apply();
          }
        };

        element.on('click', actionEventHandler);
        element.on('keydown keypress', function (e) {
          if (e.which === KEY_CODES.ENTER || e.which === KEY_CODES.SPACE) {
            console.log('key handler handling');
            actionEventHandler();
            e.preventDefault();
          }
        });
      }
    };

  })

  .directive('bsCollapseTarget', function ($animate) {

    return {
      require: ['^?ngModel', '^bsCollapse'],
      // scope: true,
      link: function postLink (scope, element, attrs, controllers) {

        // var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];

        // Add base class
        element.addClass('collapse');

        // Add animation class
        if (bsCollapseCtrl.$options.animation) {
          element.addClass(bsCollapseCtrl.$options.animation);
        }

        // Push pane to parent bsCollapse controller
        bsCollapseCtrl.$registerTarget(element);

        // remove pane target from collapse controller when target is destroyed
        scope.$on('$destroy', function () {
          bsCollapseCtrl.$unregisterTarget(element);
        });

        function render () {
          var index = bsCollapseCtrl.$targets.indexOf(element);
          var active = bsCollapseCtrl.$activeIndexes();
          var action = 'removeClass';
          if (angular.isArray(active)) {
            if (active.indexOf(index) !== -1) {
              action = 'addClass';
            }
          } else if (index === active) {
            action = 'addClass';
          }

          $animate[action](element, bsCollapseCtrl.$options.activeClass);
        }

        bsCollapseCtrl.$viewChangeListeners.push(function () {
          render();
        });
        render();

      }
    };

  });
