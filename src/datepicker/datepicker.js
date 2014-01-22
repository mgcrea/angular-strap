'use strict';

angular.module('mgcrea.ngStrap.datepicker', ['mgcrea.ngStrap.tooltip'])

  .provider('$datepicker', function() {

    var defaults = this.defaults = {
      animation: 'animation-fade',
      prefixClass: 'datepicker',
      placement: 'bottom-left',
      template: 'datepicker/datepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      // lang: $locale.id,
      useNative: false,
      dateType: 'date',
      dateFormat: 'shortDate',
      autoclose: false,
      minDate: -Infinity,
      maxDate: +Infinity,
      startView: 0,
      minView: 0,
      weekStart: 0
    };

    this.$get = function($window, $document, $rootScope, $sce, $locale, dateFilter, datepickerViews, $tooltip) {

      var bodyEl = angular.element($window.document.body);
      var isTouch = 'createTouch' in $window.document;
      var isAppleTouch = /(iP(a|o)d|iPhone)/g.test($window.navigator.userAgent);
      if(!defaults.lang) defaults.lang = $locale.id;

      function DatepickerFactory(element, controller, config) {

        var $datepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $datepicker.$options;
        var scope = $datepicker.$scope;

        // View vars

        var pickerViews = datepickerViews($datepicker);
        $datepicker.$views = pickerViews.views;
        var viewDate = pickerViews.viewDate;
        $datepicker.$mode = options.startView;
        var $picker = $datepicker.$views[$datepicker.$mode];

        // Scope methods

        scope.$select = function(date) {
          $datepicker.select(date);
        };
        scope.$selectPane = function(value) {
          $datepicker.$selectPane(value);
        };
        scope.$toggleMode = function() {
          $datepicker.setMode(($datepicker.$mode + 1) % $datepicker.$views.length);
        };

        // Public methods

        $datepicker.update = function(date) {
          // console.warn('$datepicker.update() newValue=%o', date);
          if(!isNaN(date.getTime())) {
            $datepicker.$date = date;
            $picker.update.call($picker, date);
          } else if(!$picker.built) {
            $datepicker.$build();
          }
        };

        $datepicker.select = function(date, keepMode) {
          // console.warn('$datepicker.select', date, $datepicker.$mode);
          if(!angular.isDate(date)) date = new Date(date);
          if(!$datepicker.$mode || keepMode) {
            controller.$setViewValue(date);
            controller.$render();
            if(options.autoclose && !keepMode) {
              $datepicker.hide(true);
            }
          } else {
            angular.extend(viewDate, {year: date.getUTCFullYear(), month: date.getUTCMonth(), date: date.getUTCDate()});
            $datepicker.setMode($datepicker.$mode - 1);
            $datepicker.$build();
          }
        };

        $datepicker.setMode = function(mode) {
          // console.warn('$datepicker.setMode', mode);
          $datepicker.$mode = mode;
          $picker = $datepicker.$views[$datepicker.$mode];
          $datepicker.$build();
        };

        // Protected methods

        $datepicker.$build = function() {
          // console.warn('$datepicker.$build() viewDate=%o', viewDate);
          $picker.build.call($picker);
        };

        $datepicker.$updateSelected = function() {
          for(var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], updateSelected);
          }
        };

        $datepicker.$isSelected = function(date) {
          return $picker.isSelected(date);
        };

        $datepicker.$selectPane = function(value) {
          var steps = $picker.steps;
          var targetDate = new Date(Date.UTC(viewDate.year + ((steps.year || 0) * value), viewDate.month + ((steps.month || 0) * value), viewDate.date + ((steps.day || 0) * value)));
          angular.extend(viewDate, {year: targetDate.getUTCFullYear(), month: targetDate.getUTCMonth(), date: targetDate.getUTCDate()});
          $datepicker.$build();
        };

        $datepicker.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            if(targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };

        $datepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();

          if(evt.keyCode === 13) {
            if(!$datepicker.$mode) {
              return $datepicker.hide(true);
            } else {
              return scope.$apply(function() { $datepicker.setMode($datepicker.$mode - 1); });
            }
          }

          // Navigate with keyboard
          $picker.onKeyDown(evt);
          parentScope.$digest();
        };

        // Private

        function updateSelected(el) {
          el.selected = $datepicker.$isSelected(el.date);
        }

        function focusElement() {
          element[0].focus();
        }

        // Overrides

        var _init = $datepicker.init;
        $datepicker.init = function() {
          if(isAppleTouch && options.useNative) {
            element.prop('type', 'date');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if(isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          if(controller.$dateValue) {
            $datepicker.$date = controller.$dateValue;
            $datepicker.$build();
          }
          _init();
        };

        var _destroy = $datepicker.destroy;
        $datepicker.destroy = function() {
          if(isAppleTouch && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };

        var _show = $datepicker.show;
        $datepicker.show = function() {
          _show();
          setTimeout(function() {
            $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $datepicker.$onKeyDown);
            }
          });
        };

        var _hide = $datepicker.hide;
        $datepicker.hide = function(blur) {
          $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $datepicker.$onKeyDown);
          }
          _hide(blur);
        };

        return $datepicker;

      }

      DatepickerFactory.defaults = defaults;
      return DatepickerFactory;

    };

  })

  .provider('$dateParser', function($localeProvider) {

    var proto = Date.prototype;

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var defaults = this.defaults = {
      format: 'shortDate'
    };

    this.$get = function($locale) {

      if(!defaults.lang) defaults.lang = $locale.id;

      var DateParserFactory = function(options) {

        var $dateParser = {};
        window.$locale = $locale;

        var regExpMap = {
          '/'     : '[\\/]',
          '-'     : '[-]',
          '.'     : '[.]',
          ' '     : '[\\s]',
          'EEEE'  : '((?:' + $locale.DATETIME_FORMATS.DAY.join('|') + '))',
          'EEE'   : '((?:' + $locale.DATETIME_FORMATS.SHORTDAY.join('|') + '))',
          'dd'    : '((?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1})))',
          'd'     : '((?:(?:[0-2]?[0-9]{1})|(?:[3][01]{1})))',
          'MMMM'  : '((?:' + $locale.DATETIME_FORMATS.MONTH.join('|') + '))',
          'MMM'   : '((?:' + $locale.DATETIME_FORMATS.SHORTMONTH.join('|') + '))',
          'MM'    : '((?:[0]?[1-9]|[1][012]))',
          'M'     : '((?:[0]?[1-9]|[1][012]))',
          'yyyy'  : '((?:(?:[1]{1}[0-9]{1}[0-9]{1}[0-9]{1})|(?:[2]{1}[0-9]{3}))(?![[0-9]]))',
          'yy'    : '((?:(?:[0-9]{1}[0-9]{1}))(?![[0-9]]))'
        };

        var setFnMap = {
          // 'EEEE'  : function(value) { return this.setUTCDay($locale.DATETIME_FORMATS.MONTH.indexOf(value)); },
          // 'EEE'   : function(value) { return this.setUTCDay($locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value)); },
          'dd'    : proto.setUTCDate,
          'd'     : proto.setUTCDate,
          'MMMM'  : function(value) { return this.setUTCMonth($locale.DATETIME_FORMATS.MONTH.indexOf(value)); },
          'MMM'   : function(value) { return this.setUTCMonth($locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value)); },
          'MM'    : function(value) { return this.setUTCMonth(1 * value - 1); },
          'M'     : function(value) { return this.setUTCMonth(1 * value - 1); },
          'yyyy'  : proto.setUTCFullYear,
          'yy'    : function(value) { return this.setUTCFullYear(2000 + 1 * value); },
          'y'    : proto.setUTCFullYear
        };

        var regex, setMap;

        $dateParser.init = function() {
          $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
          regex = regExpForFormat($dateParser.$format);
          setMap = setMapForFormat($dateParser.$format);
        };

        $dateParser.isValid = function(date) {
          if(angular.isDate(date)) return !isNaN(date.getTime());
          return regex.test(date);
        };

        $dateParser.parse = function(value, baseDate) {
          if(angular.isDate(value)) return value;
          var matches = regex.exec(value);
          if(!matches) return false;
          var date = baseDate || new Date(0);
          for(var i = 0; i < matches.length - 1; i++) {
            setMap[i] && setMap[i].call(date, matches[i+1]);
          }
          return date;
        };

        // Private functions

        function setMapForFormat(format) {
          var keys = Object.keys(setFnMap), i;
          var map = [], sortedMap = [];
          // Map to setFn
          for(i = 0; i < keys.length; i++) {
            if(['/', '.', '-', ' '].indexOf(keys[i]) !== -1) continue;
            if(format.split(keys[i]).length > 1) {
              var index = format.search(keys[i]);
              format = format.split(keys[i]).join('');
              if(setFnMap[keys[i]]) map[index] = setFnMap[keys[i]];
            }
          }
          // Sort result map
          angular.forEach(map, function(v) {
            sortedMap.push(v);
          });
          return sortedMap;
        }

        function regExpForFormat(format) {
          var keys = Object.keys(regExpMap), i;
          // Abstract replaces to avoid collisions
          for(i = 0; i < keys.length; i++) {
            format = format.split(keys[i]).join('${' + i + '}');
          }
          // Replace abstracted values
          for(i = 0; i < keys.length; i++) {
            format = format.split('${' + i + '}').join(regExpMap[keys[i]]);
          }
          return new RegExp('^' + format + '$', ['i']);
        }

        $dateParser.init();
        return $dateParser;

      };

      return DateParserFactory;

    };

  })

  .directive('bsDatepicker', function($window, $parse, $q, $locale, dateFilter, $datepicker, $dateParser, $timeout) {

    var isAppleTouch = /(iP(a|o)d|iPhone)/g.test($window.navigator.userAgent);
    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope, controller: controller};
        angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'autoclose', 'dateType', 'dateFormat', 'useNative', 'lang'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // Initialize datepicker
        if(isAppleTouch && options.useNative) options.dateFormat = 'yyyy-MM-dd';
        var datepicker = $datepicker(element, controller, options);
        options = datepicker.$options;

        // Observe attributes for changes
        angular.forEach(['minDate', 'maxDate'], function(key) {
          // console.warn('attr.$observe(%s)', key, attr[key]);
          angular.isDefined(attr[key]) && attr.$observe(key, function(newValue) {
            // console.warn('attr.$observe(%s)=%o', key, newValue);
            if(newValue === 'now' || newValue === 'today') newValue = null;
            if(newValue.match(/^".+"$/)) {
              datepicker.$options[key] = +new Date(newValue.substr(1, newValue.length - 2));
            } else {
              var parsedDate = new Date(newValue);
              datepicker.$options[key] = parsedDate.getTime() - parsedDate.getTimezoneOffset() * 6e4;
            }
            // console.warn(angular.isDate(newValue), newValue);
            !isNaN(datepicker.$options[key]) && datepicker.$build();
          });
        });

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          datepicker.update(controller.$dateValue);
        });

        var dateParser = $dateParser({format: options.dateFormat, lang: options.lang});

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
          var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
          if(!parsedDate || isNaN(parsedDate.getTime())) {
            controller.$setValidity('date', false);
            return;
          } else {
            var isValid = parsedDate.getTime() >= options.minDate &&  parsedDate.getTime() <= options.maxDate;
            controller.$setValidity('date', isValid);
          }
          controller.$dateValue = parsedDate;
          if(options.dateType === 'string') {
            return dateFilter(viewValue, options.dateFormat);
          } else if(options.dateType === 'number') {
            return controller.$dateValue.getTime();
          } else if(options.dateType === 'iso') {
            return controller.$dateValue.toISOString();
          } else {
            return controller.$dateValue;
          }
        });

        // modelValue -> $formatters -> viewValue
        controller.$formatters.push(function(modelValue) {
          // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
          controller.$dateValue = angular.isDate(modelValue) ? modelValue : new Date(modelValue);
          return controller.$dateValue;
        });

        // viewValue -> element
        controller.$render = function() {
          // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
          element.val(isNaN(controller.$dateValue.getTime()) ? '' : dateFilter(controller.$dateValue, options.dateFormat));
        };

        // Garbage collection
        scope.$on('$destroy', function() {
          datepicker.destroy();
          options = null;
          datepicker = null;
        });

      }
    };

  })

  .provider('datepickerViews', function() {

    var defaults = this.defaults = {
      dayFormat: 'dd',
      daySplit: 7
    };

    // Split array into smaller arrays
    function split(arr, size) {
      var arrays = [];
      while(arr.length > 0) {
        arrays.push(arr.splice(0, size));
      }
      return arrays;
    }

    this.$get = function($locale, $sce, dateFilter) {

      return function(picker) {

        var scope = picker.$scope;
        var options = picker.$options;

        var weekDaysMin = $locale.DATETIME_FORMATS.SHORTDAY;
        var weekDaysLabels = weekDaysMin.slice(options.weekStart).concat(weekDaysMin.slice(0, options.weekStart));
        var dayLabelHtml = $sce.trustAsHtml('<th class="dow text-center">' + weekDaysLabels.join('</th><th class="dow text-center">') + '</th>');

        var startDate = picker.$date || new Date();
        var viewDate = {year: startDate.getUTCFullYear(), month: startDate.getUTCMonth(), date: startDate.getUTCDate()};

        var views = [{
            format: 'dd',
            split: 7,
            height: 250,
            steps: { month: 1 },
            update: function(date, force) {
              if(!this.built || force || date.getUTCFullYear() !== viewDate.year || date.getUTCMonth() !== viewDate.month) {
                angular.extend(viewDate, {year: picker.$date.getUTCFullYear(), month: picker.$date.getUTCMonth(), date: picker.$date.getUTCDate()});
                picker.$build();
              } else if(date.getUTCDate() !== viewDate.date) {
                viewDate.date = picker.$date.getUTCDate();
                picker.$updateSelected();
              }
            },
            build: function() {
              var days = [], day;
              var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1);
              var firstDate = new Date(+firstDayOfMonth - (firstDayOfMonth.getUTCDay() + 1 - options.weekStart) * 864e5);
              // lastDate = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + 1, 0, 0, 0, -1));
              for(var i = 0; i < 35; i++) {
                // day = new Date(+firstDate + i * 864e5);
                day = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate() + i));
                days.push({date: day, label: dateFilter(day, this.format), selected: picker.$date && this.isSelected(day), muted: day.getUTCMonth() !== viewDate.month, disabled: this.isDisabled(day)});
              }
              scope.title = dateFilter(firstDayOfMonth, 'MMMM yyyy');
              scope.labels = dayLabelHtml;
              scope.rows = split(days, this.split);
              scope.width = 100 / this.split;
              // scope.height = 100 / scope.rows.length;
              scope.height = (this.height - 75) / scope.rows.length;
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getUTCFullYear() === picker.$date.getUTCFullYear() && date.getUTCMonth() === picker.$date.getUTCMonth() && date.getUTCDate() === picker.$date.getUTCDate();
            },
            isDisabled: function(date) {
              return date.getTime() < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              var actualTime = picker.$date.getTime();
              if(evt.keyCode === 37) picker.select(new Date(actualTime - 1 * 864e5), true);
              else if(evt.keyCode === 38) picker.select(new Date(actualTime - 7 * 864e5), true);
              else if(evt.keyCode === 39) picker.select(new Date(actualTime + 1 * 864e5), true);
              else if(evt.keyCode === 40) picker.select(new Date(actualTime + 7 * 864e5), true);
            }
          }, {
            name: 'month',
            format: 'MMM',
            split: 4,
            height: 250,
            steps: { year: 1 },
            update: function(date, force) {
              if(!this.built || date.getUTCFullYear() !== viewDate.year) {
                angular.extend(viewDate, {year: picker.$date.getUTCFullYear(), month: picker.$date.getUTCMonth(), date: picker.$date.getUTCDate()});
                picker.$build();
              } else if(date.getUTCMonth() !== viewDate.month) {
                angular.extend(viewDate, {month: picker.$date.getUTCMonth(), date: picker.$date.getUTCDate()});
                picker.$updateSelected();
              }
            },
            build: function() {
              var months = [], month;
              for (var i = 0; i < 12; i++) {
                month = new Date(viewDate.year, i, 1);
                months.push({date: month, label: dateFilter(month, this.format), selected: picker.$isSelected(month), disabled: this.isDisabled(month)});
              }
              scope.title = dateFilter(month, 'yyyy');
              scope.labels = false;
              scope.rows = split(months, this.split);
              scope.width = 100 / this.split;
              // scope.height = 100 / scope.rows.length;
              scope.height = (this.height - 50) / scope.rows.length;
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getUTCFullYear() === picker.$date.getUTCFullYear() && date.getUTCMonth() === picker.$date.getUTCMonth();
            },
            isDisabled: function(date) {
              var lastDate = +new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
              return lastDate < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              var actualMonth = picker.$date.getUTCMonth();
              if(evt.keyCode === 37) picker.select(picker.$date.setMonth(actualMonth - 1), true);
              else if(evt.keyCode === 38) picker.select(picker.$date.setMonth(actualMonth - 4), true);
              else if(evt.keyCode === 39) picker.select(picker.$date.setMonth(actualMonth + 1), true);
              else if(evt.keyCode === 40) picker.select(picker.$date.setMonth(actualMonth + 4), true);
            }
          }, {
            name: 'year',
            format: 'yyyy',
            split: 4,
            height: 250,
            steps: { year: 12 },
            update: function(date, force) {
              if(!this.built || force || parseInt(date.getUTCFullYear()/20, 10) !== parseInt(viewDate.year/20, 10)) {
                angular.extend(viewDate, {year: picker.$date.getUTCFullYear(), month: picker.$date.getUTCMonth(), date: picker.$date.getUTCDate()});
                picker.$build();
              } else if(date.getUTCFullYear() !== viewDate.year) {
                angular.extend(viewDate, {year: picker.$date.getUTCFullYear(), month: picker.$date.getUTCMonth(), date: picker.$date.getUTCDate()});
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstYear = viewDate.year - viewDate.year % (this.split * 3);
              var years = [], year;
              for (var i = 0; i < 12; i++) {
                year = new Date(firstYear + i, 0, 1);
                years.push({date: year, label: dateFilter(year, this.format), selected: picker.$isSelected(year), disabled: this.isDisabled(year)});
              }
              scope.title = years[0].label + '-' + years[years.length - 1].label;
              scope.labels = false;
              scope.rows = split(years, this.split);
              scope.width = 100 / this.split;
              // scope.height = 100 / scope.rows.length;
              scope.height = (this.height - 50) / scope.rows.length;
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getUTCFullYear() === picker.$date.getUTCFullYear();
            },
            isDisabled: function(date) {
              var lastDate = +new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 0));
              return lastDate < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              var actualYear = picker.$date.getUTCFullYear();
              if(evt.keyCode === 37) picker.select(picker.$date.setYear(actualYear - 1), true);
              else if(evt.keyCode === 38) picker.select(picker.$date.setYear(actualYear - 4), true);
              else if(evt.keyCode === 39) picker.select(picker.$date.setYear(actualYear + 1), true);
              else if(evt.keyCode === 40) picker.select(picker.$date.setYear(actualYear + 4), true);
            }
          }];

        return {
          views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
          viewDate: viewDate
        };

      };

    };

  });
