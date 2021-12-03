'use strict';

// @BUG: following snippet won't compile correctly

angular.module('mgcrea.ngStrap.alert', ['mgcrea.ngStrap.modal'])

  .provider('$alert', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'alert',
      prefixEvent: 'alert',
      placement: null,
      templateUrl: 'alert/alert.tpl.html',
      container: false,
      element: null,
      backdrop: false,
      keyboard: true,
      show: true,
      // Specific options
      duration: false,
      type: false,
      dismissable: true,
      focusMeDisabled: false
    };

    this.$get = function ($modal, $timeout) {

      function AlertFactory (config) {

        var $alert = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $alert = $modal(options);
        $alert.returnFocus = function () {
          function findFocusableElements () {
            var containerEl = angular.element($alert.$element).closest('[ng-controller]');
            return containerEl.find('a:not([disabled]),button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([disabled]):not([tabindex="-1"])').filter(function (i, el) {
              return !angular.element(el).parentsUntil(containerEl, '[tabindex="-1"]').length;
            });
          }

          function findNextFocusableElement () {
            if (document.activeElement) {
              var focusable = findFocusableElements().toArray();
              if (focusable === undefined) return;
              var index = focusable.indexOf(document.activeElement);
              return focusable[index + 1];
            }
          }
          angular.element(findNextFocusableElement()).trigger('focus');
        };

        // Support scope as string options [/*title, content, */ type, dismissable]
        $alert.$scope.dismissable = !!options.dismissable;
        if (options.type) {
          $alert.$scope.type = options.type;
        }
        if (options.focusMeDisabled) {
          $alert.$scope.focusMeDisabled = options.focusMeDisabled;
        }

        // Support auto-close duration
        var show = $alert.show;
        if (options.duration) {
          $alert.show = function () {
            show();
            $timeout(function () {
              $alert.hide();
            }, options.duration * 1000);
          };
        }

        return $alert;

      }

      return AlertFactory;

    };

  })

  .directive('bsAlert', function ($window, $sce, $alert) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink (scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'keyboard', 'html', 'container', 'animation', 'duration', 'dismissable'], function (key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['keyboard', 'html', 'container', 'dismissable'], function (key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });

        // bind functions from the attrs to the show and hide events
        angular.forEach(['onBeforeShow', 'onShow', 'onBeforeHide', 'onHide'], function (key) {
          var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
          if (angular.isDefined(attr[bsKey])) {
            options[key] = scope.$eval(attr[bsKey]);
          }
        });

        // overwrite inherited title value when no value specified
        // fix for angular 1.3.1 531a8de72c439d8ddd064874bf364c00cedabb11
        if (!scope.hasOwnProperty('title')) {
          scope.title = '';
        }

        // Support scope as data-attrs
        angular.forEach(['title', 'content', 'type'], function (key) {
          if (attr[key]) {
            attr.$observe(key, function (newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });

        // Support scope as an object
        if (attr.bsAlert) {
          scope.$watch(attr.bsAlert, function (newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }

        // Initialize alert
        var alert = $alert(options);

        // Trigger
        element.on(attr.trigger || 'click', alert.toggle);

        // Garbage collection
        scope.$on('$destroy', function () {
          if (alert) alert.destroy();
          options = null;
          alert = null;
        });

      }
    };

  });
