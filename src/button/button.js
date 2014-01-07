'use strict';

var forEach = angular.forEach;
var jqLite = angular.element;

angular.module('mgcrea.ngStrap.button', [])

  .provider('$button', function() {

    var defaults = this.defaults = {
      activeClass:'active',
      toggleEvent:'click'
    };

    this.$get = function() {
      return {defaults: defaults};
    };

  })

  .directive('bsCheckboxGroup', function() {

    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="checkbox"]');
        forEach(children, function(child) {
          var childEl = jqLite(child);
          childEl.attr('bs-checkbox', '');
          childEl.attr('ng-model', attr.ngModel + '.' + childEl.attr('value'));
        });
      }

    };

  })

  .directive('bsCheckbox', function($button) {

    var defaults = $button.defaults;
    var isDefined = angular.isDefined;
    var constantValueRegExp = /^(true|false|\d+)$/;

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        var options = defaults;

        // Support label > input[type="checkbox"]
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;

        var trueValue = isDefined(attr.trueValue) ? attr.trueValue : true;
        if(constantValueRegExp.test(attr.trueValue)) {
          trueValue = scope.$eval(attr.trueValue);
        }
        var falseValue = isDefined(attr.falseValue) ? attr.falseValue : false;
        if(constantValueRegExp.test(attr.falseValue)) {
          falseValue = scope.$eval(attr.falseValue);
        }

        // Parse exotic values
        var hasExoticValues = typeof trueValue !== 'boolean' || typeof falseValue !== 'boolean';
        if(hasExoticValues) {
          controller.$parsers.push(function(viewValue) {
            // console.warn('$parser', element.attr('ng-model'), 'viewValue', viewValue);
            return viewValue ? trueValue : falseValue;
          });
          // Fix rendering for exotic values
          scope.$watch(attr.ngModel, function(newValue, oldValue) {
            controller.$render();
          });
        }

        // model -> view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var isActive = angular.equals(controller.$modelValue, trueValue);
          if(isInput) {
            element[0].checked = isActive;
          }
          activeElement.toggleClass(options.activeClass, isActive);
        };

        // view -> model
        element.bind(options.toggleEvent, function() {
          scope.$apply(function () {
            // console.warn('!click', element.attr('ng-model'), 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue, 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue);
            if(!isInput) {
              controller.$setViewValue(!activeElement.hasClass('active'));
            }
            if(!hasExoticValues) {
              controller.$render();
            }
          });
        });

      }

    };

  })

  .directive('bsRadioGroup', function() {

    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="radio"]');
        forEach(children, function(child) {
          jqLite(child).attr('bs-radio', '');
          jqLite(child).attr('ng-model', attr.ngModel);
        });
      }

    };

  })

  .directive('bsRadio', function($button) {

    var defaults = $button.defaults;
    var isDefined = angular.isDefined;
    var constantValueRegExp = /^(true|false|\d+)$/;

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        var options = defaults;

        // Support `label > input[type="radio"]` markup
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;

        var value = constantValueRegExp.test(attr.value) ? scope.$eval(attr.value) : attr.value;

        // model -> view
        controller.$render = function () {
          // console.warn('$render', element.attr('value'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var isActive = angular.equals(controller.$modelValue, value);
          if(isInput) {
            element[0].checked = isActive;
          }
          activeElement.toggleClass(options.activeClass, isActive);
        };

        // view -> model
        element.bind(options.toggleEvent, function() {
          scope.$apply(function () {
            // console.warn('!click', element.attr('value'), 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue, 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue);
            controller.$setViewValue(value);
            controller.$render();
          });
        });

      }

    };

  });
