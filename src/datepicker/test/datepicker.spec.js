'use strict';

describe('datepicker', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, dateFilter, $datepicker, scope, today;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.datepicker'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _dateFilter_, _$datepicker_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    dateFilter = _dateFilter_;
    today = new Date();
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
    $datepicker = _$datepicker_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {selectedDate: new Date()},
      element: '<input type="text" ng-model="selectedDate" bs-datepicker>'
    },
    'value-past': {
      scope: {selectedDate: new Date(1986, 1, 22)},
      element: '<input type="text" ng-model="selectedDate" bs-datepicker>'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><input type="text" ng-model="selectedDate" bs-datepicker></li></ul>'
    },
    'markup-ngChange': {
      scope: {selectedDate: new Date(1986, 1, 22), onChange: function() {}},
      element: '<input type="text" ng-model="selectedDate" ng-change="onChange()" bs-datepicker>'
    },
    'options-animation': {
      element: '<div class="btn" data-animation="am-flip-x" ng-model="datepickeredIcon" ng-options="icon.value as icon.label for icon in icons" bs-datepicker></div>'
    },
    'options-placement': {
      element: '<div class="btn" data-placement="bottom" ng-model="datepickeredIcon" ng-options="icon.value as icon.label for icon in icons" bs-datepicker></div>'
    },
    'options-placement-exotic': {
      element: '<div class="btn" data-placement="bottom-right" ng-model="datepickeredIcon" ng-options="icon.value as icon.label for icon in icons" bs-datepicker></div>'
    },
    'options-trigger': {
      element: '<div class="btn" data-trigger="hover" ng-model="datepickeredIcon" ng-options="icon.value as icon.label for icon in icons" bs-datepicker></div>'
    },
    'options-template': {
      element: '<input type="text" data-template="custom" ng-model="selectedDate" bs-datepicker>'
    },
    'options-typeStringDateFormat': {
      scope: {selectedDate: '22/02/1986'},
      element: '<input type="text" ng-model="selectedDate" data-date-type="string" data-date-format="dd/MM/yyyy" bs-datepicker>'
    },
    'options-typeStringDateFormatAlternative': {
      scope: {selectedDate: '2014-04-11'},
      element: '<input type="text" ng-model="selectedDate" data-date-type="string" data-date-format="yyyy-MM-dd" bs-datepicker>'
    },
    'options-dateFormat': {
      scope: {selectedDate: new Date(1986, 1, 22)},
      element: '<input type="text" ng-model="selectedDate" data-date-format="yyyy-MM-dd" bs-datepicker>'
    },
    'options-strictFormat': {
      scope: {selectedDate: new Date(1986, 1, 4)},
      element: '<input type="text" ng-model="selectedDate" data-date-format="yyyy-M-d" data-strict-format="1" bs-datepicker>'
    },
    'options-minDate': {
      scope: {selectedDate: new Date(1986, 1, 22), minDate: '02/20/86'},
      element: '<input type="text" ng-model="selectedDate" data-min-date="{{minDate}}" bs-datepicker>'
    },
    'options-minDate-today': {
      scope: {selectedDate: new Date()},
      element: '<input type="text" ng-model="selectedDate" data-min-date="today" bs-datepicker>'
    },
    'options-minDate-date': {
      scope: {selectedDate: new Date(1986, 1, 22), minDate: new Date(1986, 1, 20)},
      element: '<input type="text" ng-model="selectedDate" data-min-date="{{minDate}}" bs-datepicker>'
    },
    'options-minDate-number': {
      scope: {selectedDate: new Date(1986, 1, 22), minDate: +new Date(1986, 1, 20)},
      element: '<input type="text" ng-model="selectedDate" data-min-date="{{minDate}}" bs-datepicker>'
    },
    'options-maxDate': {
      scope: {selectedDate: new Date(1986, 1, 22), maxDate: '02/24/86'},
      element: '<input type="text" ng-model="selectedDate" data-max-date="{{maxDate}}" bs-datepicker>'
    },
    'options-maxDate-today': {
      scope: {selectedDate: new Date()},
      element: '<input type="text" ng-model="selectedDate" data-max-date="today" bs-datepicker>'
    },
    'options-maxDate-date': {
      scope: {selectedDate: new Date(1986, 1, 22), maxDate: new Date(1986, 1, 24)},
      element: '<input type="text" ng-model="selectedDate" data-max-date="{{maxDate}}" bs-datepicker>'
    },
    'options-maxDate-number': {
      scope: {selectedDate: new Date(1986, 1, 22), maxDate: +new Date(1986, 1, 24)},
      element: '<input type="text" ng-model="selectedDate" data-max-date="{{maxDate}}" bs-datepicker>'
    },
    'options-startWeek': {
      scope: {selectedDate: new Date(2014, 1, 22), startWeek: 1},
      element: '<input type="text" ng-model="selectedDate" data-start-week="{{startWeek}}" bs-datepicker>'
    },
    'options-startWeek-bis': {
      scope: {selectedDate: new Date(2014, 6, 15), startWeek: 6},
      element: '<input type="text" ng-model="selectedDate" data-start-week="{{startWeek}}" bs-datepicker>'
    },
    'options-startDate': {
      scope: {startDate: '02/03/04'},
      element: '<input type="text" ng-model="selectedDate" data-start-date="{{startDate}}" bs-datepicker>'
    },
    'options-autoclose': {
      element: '<input type="text" ng-model="selectedDate" data-autoclose="1" bs-datepicker>'
    },
    'options-useNative': {
      element: '<input type="text" ng-model="selectedDate" data-use-native="1" bs-datepicker>'
    },
    'options-modelDateFormat': {
      scope: {selectedDate: '2014-12-01' },
      element: '<input type="text" ng-model="selectedDate" data-date-format="dd/MM/yyyy" data-model-date-format="yyyy-MM-dd" data-date-type="string" bs-datepicker>'
    },
    'options-daysOfWeekDisabled': {
      scope: {selectedDate: new Date(2014, 6, 27)},
      element: '<input type="text" ng-model="selectedDate" data-days-of-week-disabled="{{daysOfWeekDisabled}}" bs-datepicker>'
    },
    'options-daysOfWeekDisabled-bis': {
      scope: {selectedDate: new Date(2014, 6, 27), daysOfWeekDisabled: "0246"},
      element: '<input type="text" ng-model="selectedDate" data-days-of-week-disabled="{{daysOfWeekDisabled}}" bs-datepicker>'
    },
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  // Tests

  describe('with default template', function() {

    it('should open on focus', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(1);
    });

    it('should close on blur', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(7 * 6);
      expect(sandboxEl.find('.dropdown-menu tbody td .btn').length).toBe(7 * 6);
      expect(sandboxEl.find('.dropdown-menu thead button:eq(1)').text()).toBe(dateFilter(today, 'MMMM yyyy'));
      var todayDate = today.getDate();
      var firstDate = sandboxEl.find('.dropdown-menu tbody .btn:eq(0)').text() * 1;
      expect(new Date(today.getFullYear(), today.getMonth() - (firstDate !== 1 ? 1 : 0), firstDate).getDay()).toBe($datepicker.defaults.startWeek);
    });

    it('should correctly display active date', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td .btn-primary').text().trim() * 1).toBe(today.getDate());
      expect(elm.val()).toBe((today.getMonth() + 1) + '/' + today.getDate() + '/' + (today.getFullYear() + '').substr(2));
    });

    it('should correctly select a new date', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(15)')[0]).triggerHandler('click');
      expect(elm.val()).toBe((today.getMonth() + 1) + '/15/' + (today.getFullYear() + '').substr(2));
    });

    it('should correctly be cleared when model is cleared', function() {
      var elm = compileDirective('default');
      scope.selectedDate = null;
      scope.$digest();
      expect(elm.val()).toBe('');
      scope.selectedDate = new Date(1986, 1, 22);
      scope.$digest();
      expect(elm.val()).toBe('2/22/86');
    });

    it('should correctly navigate to upper month view', function() {
      var elm = compileDirective('default');
      var date = today.getDate(), month = today.getMonth();
      angular.element(elm[0]).triggerHandler('focus');
      expect(scope.$$childHead.$mode).toBe(0);
      angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
      expect(scope.$$childHead.$mode).toBe(1);
    });

    describe('once in month view', function() {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(4 * 3);
        expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(4 * 3);
        expect(sandboxEl.find('.dropdown-menu thead button:eq(1)').text()).toBe(dateFilter(today, 'yyyy'));
      });

      it('should correctly display active date', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu tbody td .btn-primary').text()).toBe(dateFilter(today, 'MMM'));
      });

    });

    it('should correctly navigate to upper year view', function() {
      var elm = compileDirective('default');
      var date = today.getDate(), month = today.getMonth();
      angular.element(elm[0]).triggerHandler('focus');
      expect(scope.$$childHead.$mode).toBe(0);
      angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
      angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
      expect(scope.$$childHead.$mode).toBe(2);
    });

    describe('once in year view', function() {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(4 * 3);
        expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(4 * 3);
        // expect(sandboxEl.find('.dropdown-menu thead button:eq(1)').text()).toBe(dateFilter(today, 'yyyy'));
      });

      it('should correctly display active date', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
        angular.element(sandboxEl.find('.dropdown-menu thead button:eq(1)')[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu tbody td .btn-primary').text()).toBe(dateFilter(today, 'yyyy'));
      });

    });

    it('should correctly support null values', function() {
      var elm = compileDirective('default', {selectedDate: null});
      angular.element(elm[0]).triggerHandler('focus');
      expect(elm.val()).toBe('');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(7 * 6);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 6);
      elm.val('0');
      angular.element(elm[0]).triggerHandler('change');
    });

    it('should correctly support undefined values', function() {
      var elm = compileDirective('default', {selectedDate: undefined});
      angular.element(elm[0]).triggerHandler('focus');
      expect(elm.val()).toBe('');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(7 * 6);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 6);
      elm.val('0');
      angular.element(elm[0]).triggerHandler('change');
    });

    it('should correctly support invalid values', function() {
      var elm = compileDirective('default');
      elm.val('invalid');
      angular.element(elm[0]).triggerHandler('change');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td .btn-primary').text().trim() * 1).toBe(today.getDate());
      angular.element(sandboxEl.find('.dropdown-menu tbody td .btn-primary')[0]).triggerHandler('click');
    });

    it('should handle empty values', function() {
      var elm = compileDirective('default');
      elm.val('');
      angular.element(elm[0]).triggerHandler('change');
      expect(scope.selectedDate).toBeUndefined();
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-datepicker]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(7 * 6);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 6);
    });

    it('should support ngChange markup', function() {
      var elm = compileDirective('markup-ngChange');
      angular.element(elm[0]).triggerHandler('focus');
      var spy = spyOn(scope, 'onChange').andCallThrough();
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:eq(1)')[0]).triggerHandler('click');
      expect(spy).toHaveBeenCalled();
    });

    // iit('should only build the datepicker once', function() {
    //   var elm = compileDirective('value-past');
    //   angular.element(elm[0]).triggerHandler('focus');
    // });

  });

  // describe('using service', function() {

  //   it('should correctly open on next digest', function() {
  //     var myModal = $modal(templates['default'].scope.modal);
  //     scope.$digest();
  //     expect(bodyEl.children('.modal').length).toBe(1);
  //     myModal.hide();
  //     expect(bodyEl.children('.modal').length).toBe(0);
  //   });

  //   it('should correctly be destroyed', function() {
  //     var myModal = $modal(angular.extend(templates['default'].scope.modal));
  //     scope.$digest();
  //     expect(bodyEl.children('.modal').length).toBe(1);
  //     myModal.destroy();
  //     expect(bodyEl.children('.modal').length).toBe(0);
  //     expect(bodyEl.children().length).toBe(1);
  //   });

  //   it('should correctly work with ngClick', function() {
  //     var elm = compileDirective('markup-ngClick-service');
  //     var myModal = $modal(angular.extend({show: false}, templates['default'].scope.modal));
  //     scope.showModal = function() {
  //       myModal.$promise.then(myModal.show);
  //     };
  //     expect(bodyEl.children('.modal').length).toBe(0);
  //     angular.element(elm[0]).triggerHandler('click');
  //     expect(bodyEl.children('.modal').length).toBe(1);
  //   });

  // });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('autoclose', function() {

      it('should close on select', function() {
        var elm = compileDirective('options-autoclose');
        expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:first')).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(0);
      });

    });

    describe('placement', function() {

      it('should default to `bottom-left` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function() {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner">foo: {{selectedDate}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: "' + scope.selectedDate.toISOString() + '"');
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><ul><li ng-repeat="i in [1, 2, 3]">{{i}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('123');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('123');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        scope.dropdown = {counter: 0};
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

    describe('type', function() {

      it('should support string type with a dateFormat', function() {
        var elm = compileDirective('options-typeStringDateFormat');
        expect(elm.val()).toBe('22/02/1986');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(16)')).triggerHandler('click');
        expect(elm.val()).toBe('16/02/1986');
      });

      it('should support string type with an alternative dateFormat', function() {
        var elm = compileDirective('options-typeStringDateFormatAlternative');
        expect(elm.val()).toBe('2014-04-11');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(16)')).triggerHandler('click');
        expect(elm.val()).toBe('2014-04-16');
      });

    });

    describe('dateFormat', function() {

      it('should support a custom dateFormat', function() {
        var elm = compileDirective('options-dateFormat');
        expect(elm.val()).toBe('1986-02-22');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(24)')).triggerHandler('click');
        expect(elm.val()).toBe('1986-02-24');
      });

    });

    describe('strictFormat', function () {

      it('should support strict format date parse', function () {
        var elm = compileDirective('options-strictFormat');
        expect(elm.val()).toBe('1986-2-4');
        elm.val('1996-4-7');
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.val()).toBe('1996-4-7');
        expect(elm.hasClass('ng-valid')).toBe(true);
      });

    });

    describe('minDate', function() {

      it('should support a dynamic minDate', function() {
        var elm = compileDirective('options-minDate');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(19)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeFalsy();
        scope.minDate = '02/12/86';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(12)').is(':disabled')).toBeFalsy();
      });

      it('should support today as minDate', function() {
        var elm = compileDirective('options-minDate-today');
        angular.element(elm[0]).triggerHandler('focus');
        var todayDate = today.getDate();
        expect(sandboxEl.find('.dropdown-menu tbody button[disabled]').length > 0).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + todayDate + ').btn-primary').length).toBe(1);
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + todayDate + ').btn-primary').is(':disabled')).toBeFalsy();
      });

      it('should support number as minDate', function() {
        var elm = compileDirective('options-minDate-number');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(19)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeFalsy();
      });

      it('should support Date object as minDate', function() {
        var elm = compileDirective('options-minDate-date');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(19)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeFalsy();
      });

      it('should reset minDate to -Infinity when set empty string', function() {
        var elm = compileDirective('options-minDate');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(19)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeFalsy();
        scope.minDate = '';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(19)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeFalsy();
      });

    });

    describe('maxDate', function() {

      it('should support a dynamic maxDate', function() {
        var elm = compileDirective('options-maxDate');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeTruthy();
        scope.maxDate = '02/12/86';
        scope.$digest();
        // @TODO fixme
        // expect(sandboxEl.find('.dropdown-menu tbody button:contains(12)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(13)').is(':disabled')).toBeTruthy();
      });

      it('should support today as maxDate', function() {
        var elm = compileDirective('options-maxDate-today');
        angular.element(elm[0]).triggerHandler('focus');
        var todayDate = today.getDate();
        expect(sandboxEl.find('.dropdown-menu tbody button[disabled]').length > 0).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + todayDate + ').btn-primary').length).toBe(1);
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + todayDate + ').btn-primary').is(':disabled')).toBeFalsy();
      });

      it('should support number as maxDate', function() {
        var elm = compileDirective('options-maxDate-number');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeTruthy();
      });

      it('should support Date object as maxDate', function() {
        var elm = compileDirective('options-maxDate-date');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeTruthy();
      });

      it('should reset maxDate to +Infinity when set empty string', function() {
        var elm = compileDirective('options-maxDate');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeTruthy();
        scope.maxDate = '';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeFalsy();
      });

    });

    describe('startWeek', function() {

      it('should support a dynamic startWeek', function() {
        var elm = compileDirective('options-startWeek');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu thead tr:eq(1) th:eq(0)').text()).toBe('Mon');
        expect(sandboxEl.find('.dropdown-menu tbody button:eq(0)').text()).toBe('27');
      });

      it('should support a negative gap induced by startWeek', function() {
        var elm = compileDirective('options-startWeek-bis');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu thead tr:eq(1) th:eq(0)').text()).toBe('Sat');
        expect(sandboxEl.find('.dropdown-menu tbody button:eq(0)').text()).toBe('28');
      });

    });

    describe('startDate', function() {

      it('should support a dynamic startDate', function() {
        var elm = compileDirective('options-startDate');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu thead button:eq(1)').text()).toBe(dateFilter(new Date(scope.startDate), 'MMMM yyyy'));
      });

    });

    describe('useNative', function() {

      it('should correctly compile template according to useNative', function() {
        var elm = compileDirective('options-useNative');
        angular.element(elm[0]).triggerHandler('focus');
        // @TODO ?
      });

    });

  });

  describe('dateModelFormat', function() {

    it('should support a custom modelDateFormat', function() {
      var elm = compileDirective('options-modelDateFormat');

      // Should have the predefined value
      expect(elm.val()).toBe('01/12/2014');

      // Should correctly set the model value if set via the datepicker
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(24)')).triggerHandler('click');
      expect(elm.val()).toBe('24/12/2014');
      expect(scope.selectedDate).toBe('2014-12-24');

      // Should correctly set the model if the date is manually typed into the input
      elm.val('20/11/2014');
      angular.element(elm[0]).triggerHandler('change');
      scope.$digest();
      expect(scope.selectedDate).toBe('2014-11-20');
    });

  });

  describe('daysOfWeekDisabled', function() {

      it('should enable all days of the week by default', function() {
        var elm = compileDirective('options-daysOfWeekDisabled');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(21)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(22)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(23)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(26)').is(':disabled')).toBeFalsy();
      });

      it('should allow disabling some days of the week', function() {
        var elm = compileDirective('options-daysOfWeekDisabled-bis');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(20)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(21)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(22)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(23)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(24)').is(':disabled')).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(25)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(26)').is(':disabled')).toBeTruthy();
      });

    });

});
