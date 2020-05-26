/**
 * angular-strap
 * @version v2.3.12 - 2020-05-26
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

angular.module('mgcrea.ngStrap.datepicker', [ 'mgcrea.ngStrap.helpers.dateParser', 'mgcrea.ngStrap.helpers.dateFormatter', 'mgcrea.ngStrap.helpers.focusElement', 'mgcrea.ngStrap.helpers.ngFocusOut', 'mgcrea.ngStrap.tooltip' ]).provider('$datepicker', function() {
  var defaults = this.defaults = {
    animation: 'am-fade',
    prefixClass: 'datepicker',
    placement: 'bottom-left',
    templateUrl: 'datepicker/datepicker.tpl.html',
    trigger: 'focus',
    container: false,
    keyboard: true,
    html: false,
    delay: 0,
    useNative: false,
    dateType: 'date',
    dateFormat: 'shortDate',
    timezone: null,
    modelDateFormat: null,
    dayFormat: 'dd',
    monthFormat: 'MMM',
    yearFormat: 'yyyy',
    monthTitleFormat: 'MMMM yyyy',
    yearTitleFormat: 'yyyy',
    strictFormat: false,
    autoclose: false,
    minDate: -Infinity,
    maxDate: +Infinity,
    startView: 0,
    minView: 0,
    startWeek: 0,
    daysOfWeekDisabled: '',
    hasToday: false,
    hasClear: false,
    iconLeft: 'glyphicon glyphicon-chevron-left',
    iconRight: 'glyphicon glyphicon-chevron-right',
    screenReaderDateFormat: 'fullDate',
    focusOnOpen: false
  };
  this.$get = [ '$window', '$document', '$rootScope', '$sce', '$dateFormatter', 'datepickerViews', '$tooltip', '$timeout', function($window, $document, $rootScope, $sce, $dateFormatter, datepickerViews, $tooltip, $timeout) {
    var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
    var isTouch = 'createTouch' in $window.document && isNative;
    if (!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();
    function DatepickerFactory(element, controller, config) {
      var $datepicker = $tooltip(element, angular.extend({}, defaults, config));
      var parentScope = config.scope;
      var options = $datepicker.$options;
      var scope = $datepicker.$scope;
      if (options.startView) options.startView -= options.minView;
      element.attr('aria-expanded', 'false').attr('aria-haspopup', 'true');
      var pickerViews = datepickerViews($datepicker);
      $datepicker.$views = pickerViews.views;
      var viewDate = pickerViews.viewDate;
      scope.$mode = options.startView;
      scope.$iconLeft = options.iconLeft;
      scope.$iconRight = options.iconRight;
      scope.$hasToday = options.hasToday;
      scope.$hasClear = options.hasClear;
      scope.id = options.id !== null && options.id !== undefined ? options.id : undefined;
      scope.dropdownId = options.id !== null && options.id !== undefined ? options.id + '_dropdown' : undefined;
      scope.keyboard = options.keyboard;
      scope.focusOnOpen = options.focusOnOpen;
      scope.$nextLabel = options.labelNext;
      scope.$previousLabel = options.labelPrevious;
      var $picker = $datepicker.$views[scope.$mode];
      function handleOnKeyDown(evt, apply) {
        if (!/(33|34|38|37|39|40|13)/.test(evt.keyCode) && !(/(33|34|38|37|39|40|13)/.test(evt.keyCode) && evt.shiftKey) && !(/(33|34|38|37|39|40|13)/.test(evt.keyCode) && evt.altKey)) {
          return false;
        }
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.keyCode === 13) {
          if (!scope.$mode) {
            $datepicker.hide(true);
            if (options.focusOnOpen) return true;
          } else {
            if (apply === undefined || apply) {
              scope.$apply(function() {
                $datepicker.setMode(scope.$mode - 1);
              });
            } else {
              $datepicker.setMode(scope.$mode - 1);
            }
          }
          return false;
        }
        return true;
      }
      scope.$select = function(date, disabled) {
        if (disabled) return;
        $datepicker.select(date);
      };
      scope.$selectPane = function(value) {
        $datepicker.$selectPane(value);
      };
      scope.$toggleMode = function() {
        $datepicker.setMode((scope.$mode + 1) % $datepicker.$views.length);
      };
      scope.$setToday = function() {
        if (options.autoclose) {
          $datepicker.setMode(0);
          $datepicker.select(new Date());
        } else {
          $datepicker.select(new Date(), true);
        }
      };
      scope.$clear = function() {
        if (options.autoclose) {
          $datepicker.setMode(0);
          $datepicker.select(null);
        } else {
          $datepicker.select(null, true);
        }
      };
      scope.$focused = function(dayInfo) {
        scope.selectedDayId = dayInfo.id;
        if (dayInfo.isNext && !scope.selected) {
          if (scope.$mode) {
            $datepicker.update(dayInfo.date);
          } else {
            scope.$select(dayInfo.date);
          }
        }
      };
      scope.$onKeyDown = function(evt, day) {
        var continueHandling = handleOnKeyDown(evt, false);
        if (continueHandling) {
          $picker.onKeyDown(evt);
        }
      };
      scope.$onFocusOut = function(evt) {
        var inTable = false;
        var parent = angular.element(evt.relatedTarget);
        while (parent !== undefined && parent.length && parent[0] !== $window.document.body) {
          parent = parent.parent();
          if (parent !== undefined && parent[0] === $datepicker.$element[0]) {
            inTable = true;
            break;
          } else {
            inTable = false;
          }
        }
        if (!inTable && !evt.relatedTarget) {} else if (!inTable) {
          $datepicker.hide();
        } else {
          evt.stopPropagation();
          evt.preventDefault();
        }
      };
      $datepicker.update = function(date) {
        if (angular.isDate(date) && !isNaN(date.getTime())) {
          $datepicker.$date = date;
          $picker.update.call($picker, date);
        }
        $datepicker.$build(true);
      };
      $datepicker.updateDisabledDates = function(dateRanges) {
        options.disabledDateRanges = dateRanges;
        for (var i = 0, l = scope.rows.length; i < l; i++) {
          angular.forEach(scope.rows[i], $datepicker.$setDisabledEl);
        }
      };
      $datepicker.select = function(date, keep) {
        if (angular.isDate(date)) {
          if (!angular.isDate(controller.$dateValue) || isNaN(controller.$dateValue.getTime())) {
            controller.$dateValue = new Date(date);
          }
        } else {
          controller.$dateValue = null;
        }
        if (!scope.$mode || keep) {
          controller.$setViewValue(angular.copy(date));
          controller.$render();
          if (options.autoclose && !keep) {
            $timeout(function() {
              $datepicker.hide(true);
            });
          }
        } else {
          angular.extend(viewDate, {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate()
          });
          $datepicker.setMode(scope.$mode - 1);
          $datepicker.$build();
        }
      };
      $datepicker.setMode = function setMode(mode) {
        scope.$mode = mode;
        $picker = $datepicker.$views[scope.$mode];
        $datepicker.$build();
      };
      $datepicker.$build = function $build(pristine) {
        if (pristine === true && $picker.built) return;
        if (pristine === false && !$picker.built) return;
        $picker.build.call($picker);
      };
      $datepicker.$updateSelected = function() {
        for (var i = 0, l = scope.rows.length; i < l; i++) {
          angular.forEach(scope.rows[i], function(day) {
            updateSelected(day);
            if (day.selected) scope.selected = day;
          });
        }
      };
      $datepicker.$isSelected = function(date) {
        return $picker.isSelected(date);
      };
      $datepicker.$setDisabledEl = function(el) {
        el.disabled = $picker.isDisabled(el.date);
      };
      $datepicker.$selectPane = function(value) {
        var steps = $picker.steps;
        var targetDate = new Date(Date.UTC(viewDate.year + (steps.year || 0) * value, viewDate.month + (steps.month || 0) * value, 1));
        angular.extend(viewDate, {
          year: targetDate.getUTCFullYear(),
          month: targetDate.getUTCMonth(),
          date: targetDate.getUTCDate()
        });
        $datepicker.$build();
      };
      $datepicker.$onMouseDown = function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (isTouch) {
          var targetEl = angular.element(evt.target);
          if (targetEl[0].nodeName.toLowerCase() !== 'button') {
            targetEl = targetEl.parent();
          }
          targetEl.triggerHandler('click');
        }
      };
      $datepicker.$onKeyDown = function(evt) {
        var continueHandling = handleOnKeyDown(evt);
        if (continueHandling) {
          $picker.onKeyDown(evt);
          parentScope.$digest();
        }
      };
      function updateSelected(el) {
        el.selected = $datepicker.$isSelected(el.date);
        el.focused = el.selected;
      }
      function focusElement() {
        element[0].focus();
      }
      var _init = $datepicker.init;
      $datepicker.init = function() {
        if (isNative && options.useNative) {
          element.prop('type', 'date');
          element.css('-webkit-appearance', 'textfield');
          return;
        } else if (isTouch) {
          element.prop('type', 'text');
          element.attr('readonly', 'true');
          element.on('click', focusElement);
        }
        _init();
      };
      var _destroy = $datepicker.destroy;
      $datepicker.destroy = function() {
        if (isNative && options.useNative) {
          element.off('click', focusElement);
        }
        _destroy();
      };
      var _show = $datepicker.show;
      $datepicker.show = function show() {
        if (!isTouch && element.attr('readonly') || element.attr('disabled')) return;
        _show();
        $timeout(function() {
          if (!$datepicker.$isShown) return;
          $datepicker.$element.attr('aria-hidden', 'false');
          element.attr('aria-expanded', 'true');
          $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
          if (options.keyboard) {
            if (options.focusOnOpen) {} else {
              element.on('keydown', $datepicker.$onKeyDown);
            }
          }
        }, 0, false);
      };
      var _hide = $datepicker.hide;
      $datepicker.hide = function(blur) {
        if (!$datepicker.$isShown) return;
        $datepicker.$element.attr('aria-hidden', 'true');
        element.attr('aria-expanded', 'false');
        $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
        if (options.keyboard) {
          element.off('keydown', $datepicker.$onKeyDown);
          $datepicker.$element.off('keydown', $datepicker.$onKeyDown);
        }
        if (options.focusOnOpen) {
          element[0].focus();
        }
        _hide(blur);
      };
      return $datepicker;
    }
    DatepickerFactory.defaults = defaults;
    return DatepickerFactory;
  } ];
}).directive('bsDatepicker', [ '$window', '$parse', '$q', '$dateFormatter', '$dateParser', '$datepicker', function($window, $parse, $q, $dateFormatter, $dateParser, $datepicker) {
  var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function postLink(scope, element, attr, controller) {
      var options = {
        scope: scope
      };
      angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'autoclose', 'dateType', 'dateFormat', 'timezone', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled', 'id', 'prefixClass', 'prefixEvent', 'hasToday', 'hasClear', 'focusOnOpen', 'labelNext', 'labelPrevious', 'labelMonth', 'labelYear', 'labelDays' ], function(key) {
        if (angular.isDefined(attr[key])) options[key] = attr[key];
      });
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach([ 'html', 'container', 'autoclose', 'useNative', 'hasToday', 'hasClear', 'focusOnOpen' ], function(key) {
        if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
          options[key] = false;
        }
      });
      angular.forEach([ 'onBeforeShow', 'onShow', 'onBeforeHide', 'onHide' ], function(key) {
        var bsKey = 'bs' + key.charAt(0).toUpperCase() + key.slice(1);
        if (angular.isDefined(attr[bsKey])) {
          options[key] = scope.$eval(attr[bsKey]);
        }
      });
      var datepicker = $datepicker(element, controller, options);
      options = datepicker.$options;
      if (isNative && options.useNative) options.dateFormat = 'yyyy-MM-dd';
      var lang = options.lang;
      var formatDate = function(date, format) {
        return $dateFormatter.formatDate(date, format, lang);
      };
      var dateParser = $dateParser({
        format: options.dateFormat,
        lang: lang,
        strict: options.strictFormat
      });
      if (attr.bsShow) {
        scope.$watch(attr.bsShow, function(newValue, oldValue) {
          if (!datepicker || !angular.isDefined(newValue)) return;
          if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(datepicker),?/i);
          if (newValue === true) {
            datepicker.show();
          } else {
            datepicker.hide();
          }
        });
      }
      angular.forEach([ 'minDate', 'maxDate' ], function(key) {
        if (angular.isDefined(attr[key])) {
          attr.$observe(key, function(newValue) {
            datepicker.$options[key] = dateParser.getDateForAttribute(key, newValue);
            if (!isNaN(datepicker.$options[key])) datepicker.$build(false);
            validateAgainstMinMaxDate(controller.$dateValue);
          });
        }
      });
      if (angular.isDefined(attr.dateFormat)) {
        attr.$observe('dateFormat', function(newValue) {
          datepicker.$options.dateFormat = newValue;
        });
      }
      scope.$watch(attr.ngModel, function(newValue, oldValue) {
        datepicker.update(controller.$dateValue);
      }, true);
      function normalizeDateRanges(ranges) {
        if (!ranges || !ranges.length) return null;
        return ranges;
      }
      if (angular.isDefined(attr.disabledDates)) {
        scope.$watch(attr.disabledDates, function(disabledRanges, previousValue) {
          disabledRanges = normalizeDateRanges(disabledRanges);
          previousValue = normalizeDateRanges(previousValue);
          if (disabledRanges) {
            datepicker.updateDisabledDates(disabledRanges);
          }
        });
      }
      function validateAgainstMinMaxDate(parsedDate) {
        if (!angular.isDate(parsedDate)) return;
        var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
        var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
        var isValid = isMinValid && isMaxValid;
        controller.$setValidity('date', isValid);
        controller.$setValidity('min', isMinValid);
        controller.$setValidity('max', isMaxValid);
        if (isValid) controller.$dateValue = parsedDate;
      }
      controller.$parsers.unshift(function(viewValue) {
        var date;
        if (!viewValue) {
          controller.$setValidity('date', true);
          return null;
        }
        var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          controller.$setValidity('date', false);
          return;
        }
        validateAgainstMinMaxDate(parsedDate);
        if (options.dateType === 'string') {
          date = dateParser.timezoneOffsetAdjust(parsedDate, options.timezone, true);
          return formatDate(date, options.modelDateFormat || options.dateFormat);
        }
        date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
        if (options.dateType === 'number') {
          return date.getTime();
        } else if (options.dateType === 'unix') {
          return date.getTime() / 1e3;
        } else if (options.dateType === 'iso') {
          return date.toISOString();
        }
        return new Date(date);
      });
      controller.$formatters.push(function(modelValue) {
        var date;
        if (angular.isUndefined(modelValue) || modelValue === null) {
          date = NaN;
        } else if (angular.isDate(modelValue)) {
          date = modelValue;
        } else if (options.dateType === 'string') {
          date = dateParser.parse(modelValue, null, options.modelDateFormat);
        } else if (options.dateType === 'unix') {
          date = new Date(modelValue * 1e3);
        } else {
          date = new Date(modelValue);
        }
        if (options.timezone === 'UTC') {
          controller.$dateValue = date;
        } else {
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
        }
        return getDateFormattedString();
      });
      controller.$render = function() {
        element.val(getDateFormattedString());
      };
      function getDateFormattedString() {
        return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
      }
      scope.$on('$destroy', function() {
        if (datepicker) datepicker.destroy();
        options = null;
        datepicker = null;
      });
    }
  };
} ]).directive('bsDatepickerDisplay', [ '$datepicker', '$dateParser', '$dateFormatter', function($datepicker, $dateParser, $dateFormatter) {
  return {
    require: 'ngModel',
    link: function postLink(scope, element, attr, controller) {
      var options = {
        scope: scope
      };
      angular.forEach([ 'dateType', 'dateFormat', 'timezone', 'modelDateFormat', 'dayFormat', 'strictFormat', 'lang' ], function(key) {
        if (angular.isDefined(attr[key])) options[key] = attr[key];
      });
      options = angular.extend({}, $datepicker.defaults, options);
      var lang = options.lang;
      var formatDate = function(date, format) {
        return $dateFormatter.formatDate(date, format, lang);
      };
      var dateParser = $dateParser({
        format: options.dateFormat,
        lang: lang,
        strict: options.strictFormat
      });
      angular.forEach([ 'minDate', 'maxDate' ], function(key) {
        if (angular.isDefined(attr[key])) {
          attr.$observe(key, function(newValue) {
            options[key] = dateParser.getDateForAttribute(key, newValue);
            validateAgainstMinMaxDate(controller.$dateValue);
          });
        }
      });
      if (angular.isDefined(attr.dateFormat)) {
        attr.$observe('dateFormat', function(newValue) {
          options.dateFormat = newValue;
        });
      }
      function validateAgainstMinMaxDate(parsedDate) {
        if (!angular.isDate(parsedDate)) return;
        var isMinValid = isNaN(options.minDate) || parsedDate.getTime() >= options.minDate;
        var isMaxValid = isNaN(options.maxDate) || parsedDate.getTime() <= options.maxDate;
        var isValid = isMinValid && isMaxValid;
        controller.$setValidity('date', isValid);
        controller.$setValidity('min', isMinValid);
        controller.$setValidity('max', isMaxValid);
        if (isValid) controller.$dateValue = parsedDate;
      }
      controller.$parsers.unshift(function(viewValue) {
        var date;
        if (!viewValue) {
          controller.$setValidity('date', true);
          return null;
        }
        var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          controller.$setValidity('date', false);
          return;
        }
        validateAgainstMinMaxDate(parsedDate);
        if (options.dateType === 'string') {
          date = dateParser.timezoneOffsetAdjust(parsedDate, options.timezone, true);
          return formatDate(date, options.modelDateFormat || options.dateFormat);
        }
        date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
        if (options.dateType === 'number') {
          return date.getTime();
        } else if (options.dateType === 'unix') {
          return date.getTime() / 1e3;
        } else if (options.dateType === 'iso') {
          return date.toISOString();
        }
        return date === null ? null : new Date(date);
      });
      controller.$formatters.push(function(modelValue) {
        var date;
        if (angular.isUndefined(modelValue) || modelValue === null) {
          date = NaN;
        } else if (angular.isDate(modelValue)) {
          date = modelValue;
        } else if (options.dateType === 'string') {
          date = dateParser.parse(modelValue, null, options.modelDateFormat);
        } else if (options.dateType === 'unix') {
          date = new Date(modelValue * 1e3);
        } else {
          date = new Date(modelValue);
        }
        if (options.timezone === 'UTC') {
          controller.$dateValue = date;
        } else {
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
        }
        return getDateFormattedString();
      });
      function getDateFormattedString() {
        return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
      }
    }
  };
} ]).provider('datepickerViews', function() {
  function split(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  }
  function mod(n, m) {
    return (n % m + m) % m;
  }
  this.$get = [ '$dateFormatter', '$dateParser', '$sce', function($dateFormatter, $dateParser, $sce) {
    return function(picker) {
      var scope = picker.$scope;
      var options = picker.$options;
      var lang = options.lang;
      var formatDate = function(date, format) {
        return $dateFormatter.formatDate(date, format, lang);
      };
      var dateParser = $dateParser({
        format: options.dateFormat,
        lang: lang,
        strict: options.strictFormat
      });
      var weekDaysMin = $dateFormatter.weekdaysShort(lang);
      var weekDaysLong = $dateFormatter.weekdays(lang);
      var weekDaysShortLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
      var weekDaysLongLabels = weekDaysLong.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
      var weekDaysLabelsHtml = '';
      for (var i = 0; i < weekDaysShortLabels.length; i++) {
        var weekDayShortLabel = weekDaysShortLabels[i];
        var weekDayLabel = weekDaysLongLabels[i];
        weekDaysLabelsHtml += '<th scope="col" role="columnheader" class="dow text-center" aria-label="' + weekDayLabel + '"><abbr title="' + weekDayLabel + '">' + weekDayShortLabel + '</abbr></th>';
      }
      weekDaysLabelsHtml = $sce.trustAsHtml(weekDaysLabelsHtml);
      var startDate = picker.$date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
      var viewDate = {
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        date: startDate.getDate()
      };
      var views = [ {
        format: options.dayFormat,
        split: 7,
        steps: {
          month: 1
        },
        update: function(date, force) {
          if (!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
            angular.extend(viewDate, {
              year: picker.$date.getFullYear(),
              month: picker.$date.getMonth(),
              date: picker.$date.getDate()
            });
            picker.$build();
          } else if (date.getDate() !== viewDate.date || date.getDate() === 1) {
            viewDate.date = picker.$date.getDate();
            picker.$updateSelected();
          }
        },
        build: function() {
          var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1);
          var firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
          var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5);
          var firstDateOffset = firstDate.getTimezoneOffset();
          var today = dateParser.timezoneOffsetAdjust(new Date(), options.timezone).toDateString();
          if (firstDateOffset !== firstDayOfMonthOffset) firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 6e4);
          var days = [];
          var day;
          var selectedDay;
          var todayDay;
          for (var i = 0; i < 42; i++) {
            day = dateParser.daylightSavingAdjust(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i));
            var dayItem = {
              id: options.id !== null && options.id !== undefined ? options.id + '_cell_' + i : undefined,
              date: day,
              value: day.getDate(),
              isToday: day.toDateString() === today,
              label: formatDate(day, this.format),
              screenReaderLabel: formatDate(day, $dateFormatter.getDatetimeFormat(options.screenReaderDateFormat)),
              selected: picker.$date && this.isSelected(day),
              muted: day.getMonth() !== viewDate.month,
              disabled: this.isDisabled(day)
            };
            if (dayItem.selected) selectedDay = dayItem;
            if (dayItem.isToday) todayDay = dayItem;
            days.push(dayItem);
          }
          scope.selected = null;
          var defaultFirstDayTabIndex = false;
          if (options.focusOnOpen) {
            if (selectedDay) {
              scope.selectedDayId = selectedDay.id;
              if (todayDay) todayDay.focused = false;
              selectedDay.focused = true;
              scope.selected = selectedDay;
            } else if (todayDay) {
              todayDay.focused = true;
            } else {
              defaultFirstDayTabIndex = true;
            }
          }
          scope.title = formatDate(firstDayOfMonth, options.monthTitleFormat);
          scope.showLabels = true;
          scope.labels = weekDaysLabelsHtml;
          scope.rows = split(days, this.split);
          if (defaultFirstDayTabIndex) {
            scope.rows[0][0].isNext = true;
          }
          scope.isTodayDisabled = this.isDisabled(new Date());
          scope.hasSelectedDate = picker.$date != null;
          scope.$modeLabel = options.labelMonth;
          this.built = true;
        },
        isSelected: function(date) {
          return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth() && date.getDate() === picker.$date.getDate();
        },
        isDisabled: function(date) {
          var time = date.getTime();
          if (time < options.minDate || time > options.maxDate) return true;
          if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;
          if (options.disabledDateRanges) {
            for (var i = 0; i < options.disabledDateRanges.length; i++) {
              if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                return true;
              }
            }
          }
          return false;
        },
        onKeyDown: function(evt) {
          var actualTime;
          if (options.keyboard && options.focusOnOpen && !picker.$date) {
            if (angular.element(evt.target).find('span').hasClass('btn-today')) {
              picker.$date = new Date();
            } else {
              picker.$date = dateParser.parse(angular.element(evt.target).attr('aria-label'), null, options.screenReaderDateFormat);
            }
          }
          if (!picker.$date) {
            return false;
          }
          actualTime = picker.$date.getTime();
          var newDate;
          switch (evt.keyCode) {
           case 13:
            if (options.focusOnOpen) {
              picker.select(new Date(actualTime), true);
              return false;
            }
            break;

           case 33:
            if (evt.altKey) {
              newDate = new Date(picker.$date.getFullYear() - 1, picker.$date.getMonth(), picker.$date.getDate());
            } else {
              newDate = new Date(picker.$date.getFullYear(), picker.$date.getMonth() - 1, picker.$date.getDate());
              if (newDate.getMonth() > picker.$date.getMonth() - 1) {
                newDate = new Date(picker.$date.getFullYear(), picker.$date.getMonth(), 0);
              }
            }
            break;

           case 34:
            if (evt.altKey) {
              newDate = new Date(picker.$date.getFullYear() + 1, picker.$date.getMonth(), picker.$date.getDate());
            } else {
              newDate = new Date(picker.$date.getFullYear(), picker.$date.getMonth() + 1, picker.$date.getDate());
              if (newDate.getMonth() > picker.$date.getMonth() + 1) {
                newDate = new Date(picker.$date.getFullYear(), picker.$date.getMonth() + 1, 1);
              }
            }
            break;

           case 37:
            newDate = new Date(actualTime - 1 * 864e5);
            break;

           case 38:
            newDate = new Date(actualTime - 7 * 864e5);
            break;

           case 39:
            newDate = new Date(actualTime + 1 * 864e5);
            break;

           case 40:
            newDate = new Date(actualTime + 7 * 864e5);
            break;

           default:
            return false;
          }
          if (!this.isDisabled(newDate)) picker.select(newDate, true);
          if (evt && evt.stopPropagation) evt.stopPropagation();
          return false;
        }
      }, {
        name: 'month',
        format: options.monthFormat,
        split: 4,
        steps: {
          year: 1
        },
        update: function(date, force) {
          if (!this.built || date.getFullYear() !== viewDate.year) {
            angular.extend(viewDate, {
              year: picker.$date.getFullYear(),
              month: picker.$date.getMonth(),
              date: picker.$date.getDate()
            });
            picker.$build();
          } else if (date.getMonth() !== viewDate.month) {
            angular.extend(viewDate, {
              month: picker.$date.getMonth(),
              date: picker.$date.getDate()
            });
            picker.$updateSelected();
          }
        },
        build: function() {
          var months = [];
          var month;
          var thisMonthDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          var selectedMonth;
          var thisMonth;
          for (var i = 0; i < 12; i++) {
            month = new Date(viewDate.year, i, 1);
            var monthItem = {
              id: options.id !== null && options.id !== undefined ? options.id + '_cell_' + i : undefined,
              date: month,
              label: formatDate(month, this.format),
              selected: picker.$isSelected(month),
              isToday: month.getFullYear() === thisMonthDate.getFullYear() && month.getMonth() === thisMonthDate.getMonth(),
              disabled: this.isDisabled(month)
            };
            if (monthItem.selected) selectedMonth = monthItem;
            if (monthItem.isToday) thisMonth = monthItem;
            months.push(monthItem);
          }
          scope.selected = null;
          var defaultFirstDayTabIndex = false;
          if (options.focusOnOpen) {
            if (selectedMonth) {
              scope.selectedDayId = selectedMonth.id;
              if (thisMonth) thisMonth.focused = false;
              selectedMonth.focused = true;
              scope.selected = selectedMonth;
            } else if (thisMonth) {
              thisMonth.focused = true;
            } else {
              defaultFirstDayTabIndex = true;
            }
          }
          scope.title = formatDate(month, options.yearTitleFormat);
          scope.showLabels = false;
          scope.rows = split(months, this.split);
          if (defaultFirstDayTabIndex) {
            scope.rows[0][0].isNext = true;
          }
          scope.$modeLabel = options.labelYear;
          this.built = true;
        },
        isSelected: function(date) {
          return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth();
        },
        isDisabled: function(date) {
          var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
          return lastDate < options.minDate || date.getTime() > options.maxDate;
        },
        onKeyDown: function(evt) {
          if (options.keyboard && options.focusOnOpen && !picker.$date && angular.element(evt.target).find('span').hasClass('btn-today')) {
            picker.$date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          }
          if (!picker.$date) {
            return;
          }
          var actualMonth = picker.$date.getMonth();
          var newDate = new Date(picker.$date);
          if (evt.keyCode === 37) newDate.setMonth(actualMonth - 1); else if (evt.keyCode === 38) newDate.setMonth(actualMonth - 4); else if (evt.keyCode === 39) newDate.setMonth(actualMonth + 1); else if (evt.keyCode === 40) newDate.setMonth(actualMonth + 4);
          if (options.focusOnOpen && evt.keyCode === 13) picker.select(new Date(picker.$date)); else if (!this.isDisabled(newDate)) picker.select(newDate, true);
        }
      }, {
        name: 'year',
        format: options.yearFormat,
        split: 4,
        steps: {
          year: 12
        },
        update: function(date, force) {
          if (!this.built || force || parseInt(date.getFullYear() / 20, 10) !== parseInt(viewDate.year / 20, 10)) {
            angular.extend(viewDate, {
              year: picker.$date.getFullYear(),
              month: picker.$date.getMonth(),
              date: picker.$date.getDate()
            });
            picker.$build();
          } else if (date.getFullYear() !== viewDate.year) {
            angular.extend(viewDate, {
              year: picker.$date.getFullYear(),
              month: picker.$date.getMonth(),
              date: picker.$date.getDate()
            });
            picker.$updateSelected();
          }
        },
        build: function() {
          var firstYear = viewDate.year - viewDate.year % (this.split * 3);
          var years = [];
          var year;
          var selectedYear;
          var thisYear;
          for (var i = 0; i < 12; i++) {
            year = new Date(firstYear + i, 0, 1);
            var yearItem = {
              id: options.id !== null && options.id !== undefined ? options.id + '_cell_' + i : undefined,
              date: year,
              label: formatDate(year, this.format),
              selected: picker.$isSelected(year),
              isToday: year.getFullYear() === new Date().getFullYear(),
              disabled: this.isDisabled(year)
            };
            if (yearItem.selected) selectedYear = yearItem;
            if (yearItem.isToday) thisYear = yearItem;
            years.push(yearItem);
          }
          scope.selected = null;
          var defaultFirstDayTabIndex = false;
          if (options.focusOnOpen) {
            if (selectedYear) {
              scope.selectedDayId = selectedYear.id;
              if (thisYear) thisYear.focused = false;
              selectedYear.focused = true;
              scope.selected = selectedYear;
            } else if (thisYear) {
              thisYear.focused = true;
            } else {
              defaultFirstDayTabIndex = true;
            }
          }
          scope.title = years[0].label + '-' + years[years.length - 1].label;
          scope.startYear = years[0].label;
          scope.endYear = years[years.length - 1].label;
          scope.showLabels = false;
          scope.rows = split(years, this.split);
          if (defaultFirstDayTabIndex) {
            scope.rows[0][0].isNext = true;
          }
          scope.$modelLabel = options.labelDays;
          this.built = true;
        },
        isSelected: function(date) {
          return picker.$date && date.getFullYear() === picker.$date.getFullYear();
        },
        isDisabled: function(date) {
          var lastDate = +new Date(date.getFullYear() + 1, 0, 0);
          return lastDate < options.minDate || date.getTime() > options.maxDate;
        },
        onKeyDown: function(evt) {
          if (options.keyboard && options.focusOnOpen && !picker.$date && angular.element(evt.target).find('span').hasClass('btn-today')) {
            picker.$date = new Date(new Date().getFullYear(), 0, 1);
          }
          if (!picker.$date) {
            return;
          }
          var actualYear = picker.$date.getFullYear();
          var newDate = new Date(picker.$date);
          if (evt.keyCode === 37) newDate.setYear(actualYear - 1); else if (evt.keyCode === 38) newDate.setYear(actualYear - 4); else if (evt.keyCode === 39) newDate.setYear(actualYear + 1); else if (evt.keyCode === 40) newDate.setYear(actualYear + 4);
          if (!this.isDisabled(newDate)) picker.select(newDate, true);
        }
      } ];
      return {
        views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
        viewDate: viewDate
      };
    };
  } ];
});