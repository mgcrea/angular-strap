'use strict';

angular.module('mgcrea.ngStrap.popover', ['mgcrea.ngStrap.tooltip'])

  .provider('$popover', function () {

    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      // uncommenting the next two lines will break backwards compatability
      // prefixClass: 'popover',
      // prefixEvent: 'popover',
      container: false,
      target: false,
      placement: 'right',
      templateUrl: 'popover/popover.tpl.html',
      contentTemplate: false,
      trigger: 'click',
      keyboard: true,
      html: false,
      title: '',
      content: '',
      delay: 0,
      autoClose: false
    };

    this.$get = function ($tooltip) {

      function PopoverFactory(element, config) {

        // Common vars
        var options = angular.extend({}, defaults, config);

        var $popover = $tooltip(element, options);

        // Support scope as string options [/*title, */content]
        if (options.content) {
          $popover.$scope.content = options.content;
        }

        return $popover;

      }

      return PopoverFactory;

    };

  })

  .directive('bsPopover', function ($window, $sce, $popover) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr) {

        var popover;
        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'customClass', 'autoClose', 'id', 'prefixClass', 'prefixEvent'], function (key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container', 'autoClose'], function (key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });

        // should not parse target attribute (anchor tag), only data-target #1454
        var dataTarget = element.attr('data-target');
        if (angular.isDefined(dataTarget)) {
          if (falseValueRegExp.test(dataTarget)) {
            options.target = false;
          } else {
            options.target = dataTarget;
          }
        }

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function (key) {
          if (attr[key]) {
            attr.$observe(key, function (newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
              if (angular.isDefined(oldValue)) {
                requestAnimationFrame(function () {
                  if (popover) popover.$applyPlacement();
                });
              }
            });
          }
        });

        // Support scope as an object
        if (attr.bsPopover) {
          scope.$watch(attr.bsPopover, function (newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
            if (angular.isDefined(oldValue)) {
              requestAnimationFrame(function () {
                if (popover) popover.$applyPlacement();
              });
            }
          }, true);
        }

        // Visibility binding support
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function (newValue, oldValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(popover),?/i);
            if (newValue === true) {
              popover.show();
            } else {
              popover.hide();
            }
          });
        }

        // Viewport support
        if (attr.viewport) {
          scope.$watch(attr.viewport, function (newValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            popover.setViewport(newValue);
          });
        }

        // Initialize popover
        popover = $popover(element, options);

        // Garbage collection
        scope.$on('$destroy', function () {
          if (popover) popover.destroy();
          options = null;
          popover = null;
        });

      }
    };

  });
