/**
 * angular-strap
 * @version v2.3.12 - 2019-02-11
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.typeahead', [ 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions' ]).provider('$typeahead', function() {
  var defaults = this.defaults = {
    animation: 'am-fade',
    prefixClass: 'typeahead',
    prefixEvent: '$typeahead',
    placement: 'bottom-left',
    templateUrl: 'typeahead/typeahead.tpl.html',
    trigger: 'focus',
    container: false,
    keyboard: true,
    html: false,
    delay: 0,
    minLength: 1,
    filter: 'bsAsyncFilter',
    limit: 6,
    autoSelect: false,
    comparator: '',
    trimValue: true
  };
  var KEY_CODES = {
    downArrow: 40,
    enter: 13,
    escape: 27,
    upArrow: 38
  };
  this.$get = [ '$window', '$rootScope', '$tooltip', '$$rAF', '$timeout', function($window, $rootScope, $tooltip, $$rAF, $timeout) {
    function TypeaheadFactory(element, controller, config) {
      var $typeahead = {};
      var options = angular.extend({}, defaults, config);
      $typeahead = $tooltip(element, options);
      var parentScope = config.scope;
      var scope = $typeahead.$scope;
      scope.id = options.id;
      scope.$resetMatches = function() {
        scope.$matches = [];
        scope.$activeIndex = options.autoSelect ? 0 : -1;
      };
      scope.$resetMatches();
      scope.$activate = function(index) {
        scope.$$postDigest(function() {
          $typeahead.activate(index);
        });
      };
      scope.$select = function(index, evt) {
        scope.$$postDigest(function() {
          $typeahead.select(index);
        });
      };
      scope.$isVisible = function() {
        return $typeahead.$isVisible();
      };
      scope.$isActive = function isActive(index) {
        return scope.$activeIndex === index ? true : undefined;
      };
      $typeahead.update = function(matches) {
        scope.$matches = matches;
        if (scope.$activeIndex >= matches.length) {
          scope.$activeIndex = options.autoSelect ? 0 : -1;
        }
        safeDigest(scope);
        $$rAF($typeahead.$applyPlacement);
      };
      $typeahead.activate = function(index) {
        scope.$activeIndex = index;
      };
      $typeahead.select = function(index) {
        if (index === -1) return;
        var value = scope.$matches[index].value;
        controller.$setViewValue(value);
        controller.$render();
        scope.$resetMatches();
        if (parentScope) parentScope.$digest();
        scope.$emit(options.prefixEvent + '.select', value, index, $typeahead);
        if (angular.isDefined(options.onSelect) && angular.isFunction(options.onSelect)) {
          options.onSelect(value, index, $typeahead);
        }
      };
      $typeahead.$isVisible = function() {
        if (!options.minLength || !controller) {
          return !!scope.$matches.length;
        }
        return scope.$matches.length && angular.isString(controller.$viewValue) && controller.$viewValue.length >= options.minLength;
      };
      scope.$generateResultId = function(index) {
        return scope.id ? scope.id + '_typeahead_result_' + index : undefined;
      };
      $typeahead.$getIndex = function(value) {
        var index;
        for (index = scope.$matches.length; index--; ) {
          if (angular.equals(scope.$matches[index].value, value)) break;
        }
        return index;
      };
      $typeahead.$onMouseDown = function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
      };
      $typeahead.$$updateScrollTop = function(container, index) {
        if (index > -1 && index < container.children.length) {
          var active = container.children[index];
          var clientTop = active.offsetTop;
          var clientBottom = active.offsetTop + active.clientHeight;
          var highWatermark = container.scrollTop;
          var lowWatermark = container.scrollTop + container.clientHeight;
          if (clientBottom >= highWatermark && clientTop < highWatermark) {
            container.scrollTop = Math.max(0, container.scrollTop - container.clientHeight);
          } else if (clientBottom > lowWatermark) {
            container.scrollTop = clientTop;
          }
        }
      };
      $typeahead.$onKeyDown = function(evt) {
        if (!/(38|40|13)/.test(evt.keyCode)) return;
        if ($typeahead.$isVisible() && !(evt.keyCode === KEY_CODES.enter && scope.$activeIndex === -1)) {
          evt.preventDefault();
          evt.stopPropagation();
        }
        if (evt.keyCode === KEY_CODES.enter && scope.$matches.length) {
          $typeahead.select(scope.$activeIndex);
        } else if (evt.keyCode === KEY_CODES.upArrow && scope.$activeIndex > 0) {
          scope.$activeIndex--;
          setAriaActiveDescendant(scope.$activeIndex);
          angular.element(document.getElementById(options.id + '_sr_text')).html(scope.$matches[scope.$activeIndex].label);
        } else if (evt.keyCode === KEY_CODES.downArrow && scope.$activeIndex < scope.$matches.length - 1) {
          scope.$activeIndex++;
          setAriaActiveDescendant(scope.$activeIndex);
          angular.element(document.getElementById(options.id + '_sr_text')).html(scope.$matches[scope.$activeIndex].label);
        } else if (angular.isUndefined(scope.$activeIndex)) {
          scope.$activeIndex = 0;
          setAriaActiveDescendant();
        }
        $typeahead.$$updateScrollTop($typeahead.$element[0], scope.$activeIndex);
        scope.$digest();
      };
      var show = $typeahead.show;
      $typeahead.show = function() {
        show();
        $timeout(function() {
          if ($typeahead.$element) {
            if (options.id) {
              $typeahead.$element.attr('id', options.id + '_listbox');
              element.attr('aria-controls', options.id + '_listbox');
              var assertDiv = document.getElementById(options.id + '_sr_text');
              if (!assertDiv) {
                $typeahead.$element.parent().append('<div id="' + options.id + '_sr_text" aria-live="assertive" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;"></div>');
              }
            }
            $typeahead.$element.attr('aria-labelledby', options.ariaLabelledby);
            $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
            if (options.keyboard) {
              if (element) element.on('keydown', $typeahead.$onKeyDown);
            }
          }
        }, 0, false);
      };
      var hide = $typeahead.hide;
      $typeahead.hide = function() {
        if ($typeahead.$element) $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
        if (options.keyboard) {
          if (element) element.off('keydown', $typeahead.$onKeyDown);
        }
        if (!options.autoSelect) {
          $typeahead.activate(-1);
        }
        var assertDiv = document.getElementById(options.id + '_sr_text');
        angular.element(assertDiv).remove();
        setAriaActiveDescendant();
        hide();
      };
      var onKeyUp = $typeahead.$onKeyUp;
      $typeahead.$onKeyUp = function(evt) {
        if (evt.which === KEY_CODES.escape && $typeahead.$isShown) {
          $typeahead.hide();
          evt.stopPropagation();
        }
      };
      var onFocusKeyUp = $typeahead.$onFocusKeyUp;
      $typeahead.$onFocusKeyUp = function(evt) {
        if (evt.which === KEY_CODES.escape) {
          $typeahead.hide();
          evt.stopPropagation();
        }
      };
      function setAriaActiveDescendant(index) {
        if (index === undefined || !scope.id) {
          element.removeAttr('aria-activedescendant');
        } else {
          var resultId = scope.$generateResultId(index);
          if (resultId) {
            element.attr('aria-activedescendant', resultId);
          } else {
            element.removeAttr('aria-activedescendant');
          }
        }
      }
      return $typeahead;
    }
    function safeDigest(scope) {
      scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
    }
    TypeaheadFactory.defaults = defaults;
    return TypeaheadFactory;
  } ];
}).filter('bsAsyncFilter', [ '$filter', function($filter) {
  return function(array, expression, comparator) {
    if (array && angular.isFunction(array.then)) {
      return array.then(function(results) {
        return $filter('filter')(results, expression, comparator);
      });
    }
    return $filter('filter')(array, expression, comparator);
  };
} ]).directive('bsTypeahead', [ '$window', '$parse', '$q', '$typeahead', '$parseOptions', function($window, $parse, $q, $typeahead, $parseOptions) {
  var defaults = $typeahead.defaults;
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function postLink(scope, element, attr, controller) {
      element.off('change');
      var options = {
        scope: scope
      };
      angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'autoSelect', 'comparator', 'id', 'prefixEvent', 'prefixClass', 'ariaLabelledby' ], function(key) {
        if (angular.isDefined(attr[key])) options[key] = attr[key];
      });
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach([ 'html', 'container', 'trimValue', 'filter' ], function(key) {
        if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
      });
      angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide', 'onSelect' ], function(key) {
        var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
        if (angular.isDefined(attr[bsKey])) {
          options[key] = scope.$eval(attr[bsKey]);
        }
      });
      if (!element.attr('autocomplete')) element.attr('autocomplete', 'off');
      var filter = angular.isDefined(options.filter) ? options.filter : defaults.filter;
      var limit = options.limit || defaults.limit;
      var comparator = options.comparator || defaults.comparator;
      var bsOptions = attr.bsOptions;
      if (filter) {
        bsOptions += ' | ' + filter + ':$viewValue';
        if (comparator) bsOptions += ':' + comparator;
      }
      if (limit) bsOptions += ' | limitTo:' + limit;
      var parsedOptions = $parseOptions(bsOptions);
      var typeahead = $typeahead(element, controller, options);
      if (!element.attr('aria-autocomplete') && !bsOptions.templateUrl) {
        element.attr('aria-autocomplete', 'list');
      }
      if (options.watchOptions) {
        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
        scope.$watchCollection(watchedOptions, function(newValue, oldValue) {
          parsedOptions.valuesFn(scope, controller).then(function(values) {
            typeahead.update(values);
            controller.$render();
          });
        });
      }
      scope.$watch(attr.ngModel, function(newValue, oldValue) {
        scope.$modelValue = newValue;
        parsedOptions.valuesFn(scope, controller).then(function(values) {
          if (options.selectMode && !values.length && newValue.length > 0) {
            controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
            return;
          }
          if (values.length > limit) values = values.slice(0, limit);
          typeahead.update(values);
          controller.$render();
        });
      });
      controller.$formatters.push(function(modelValue) {
        var displayValue = parsedOptions.displayValue(modelValue);
        if (displayValue) {
          return displayValue;
        }
        if (angular.isDefined(modelValue) && typeof modelValue !== 'object') {
          return modelValue;
        }
        return '';
      });
      controller.$render = function() {
        if (controller.$isEmpty(controller.$viewValue)) {
          return element.val('');
        }
        var index = typeahead.$getIndex(controller.$modelValue);
        var selected = index !== -1 ? typeahead.$scope.$matches[index].label : controller.$viewValue;
        selected = angular.isObject(selected) ? parsedOptions.displayValue(selected) : selected;
        var value = selected ? selected.toString().replace(/<(?:.|\n)*?>/gm, '') : '';
        var ss = element[0].selectionStart;
        var sd = element[0].selectionEnd;
        element.val(options.trimValue === false ? value : value.trim());
        element[0].setSelectionRange(ss, sd);
      };
      scope.$on('$destroy', function() {
        element.off('keydown');
        if (typeahead) typeahead.destroy();
        options = null;
        typeahead = null;
      });
    }
  };
} ]);