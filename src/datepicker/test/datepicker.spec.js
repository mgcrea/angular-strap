'use strict';

describe('datepicker', function() {

  var $compile, $templateCache, $datepicker, dateFilter, scope, sandboxEl, today;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.datepicker'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$datepicker_, _dateFilter_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $datepicker = _$datepicker_;
    dateFilter = _dateFilter_;
    today = new Date();
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
    'value-undefined': {
      element: '<input type="text" ng-model="selectedUndefined" bs-datepicker>'
    },
    'value-past': {
      scope: {selectedDate: new Date(1986, 1, 22)},
      element: '<input type="text" ng-model="selectedDate" bs-datepicker>'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><input type="text" ng-model="selectedDate" bs-datepicker></li></ul>'
    },
    'options-animation': {
      element: '<div class="btn" data-animation="animation-flipX" ng-model="datepickeredIcon" ng-options="icon.value as icon.label for icon in icons" bs-datepicker></div>'
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
    'options-dateFormat': {
      scope: {selectedDate: new Date(1986, 1, 22)},
      element: '<input type="text" ng-model="selectedDate" data-date-format="yyyy-MM-dd" bs-datepicker>'
    },
    'options-minDate': {
      scope: {selectedDate: new Date('02/22/86'), minDate: '02/20/86'},
      element: '<input type="text" ng-model="selectedDate" data-min-date="{{minDate}}" bs-datepicker>'
    },
    'options-minDate-today': {
      scope: {},
      element: '<input type="text" ng-model="selectedDate" data-min-date="today" bs-datepicker>'
    },
    'options-maxDate-today': {
      scope: {},
      element: '<input type="text" ng-model="selectedDate" data-max-date="today" bs-datepicker>'
    },
    'options-maxDate': {
      scope: {selectedDate: new Date('02/22/86'), maxDate: '02/24/86'},
      element: '<input type="text" ng-model="selectedDate" data-max-date="{{maxDate}}" bs-datepicker>'
    },
    'options-autoclose': {
      element: '<input type="text" ng-model="selectedDate" data-autoclose="1" bs-datepicker>'
    },
    'options-useNative': {
      element: '<input type="text" ng-model="selectedDate" data-use-native="1" bs-datepicker>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, template.scope || templates['default'].scope, locals);
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
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(5);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 5);
      expect(sandboxEl.find('.dropdown-menu thead button:eq(1)').text()).toBe(dateFilter(today, 'MMMM yyyy'));
    });

    it('should correctly display active date', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td .btn-primary').text().trim() * 1).toBe(today.getUTCDate());
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
        expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(3);
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
        expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(3);
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

    it('should correctly support undefined values', function() {
      var elm = compileDirective('value-undefined');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(5);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 5);
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-datepicker]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(5);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 5);
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

      it('should default to `animation-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('animation-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('animation-flipX')).toBeTruthy();
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
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner">foo: {{selectedDate}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: "' + scope.selectedDate.toISOString() + '"');
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner"><ul><li ng-repeat="i in [1, 2, 3]">{{i}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('123');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(elm[0]).triggerHandler('blur');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('123');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        scope.dropdown = {counter: 0};
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(elm[0]).triggerHandler('blur');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

    describe('dateFormat', function() {

      it('should support a custom dateFormat', function() {
        var elm = compileDirective('options-dateFormat');
        expect(elm.val()).toBe('1986-02-22');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(26)')).triggerHandler('click');
        expect(elm.val()).toBe('1986-01-26');
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
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + todayDate + ')').is(':disabled')).toBeFalsy();
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
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(12)').is(':disabled')).toBeFalsy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(13)').is(':disabled')).toBeTruthy();
      });

      it('should support today as maxDate', function() {
        var elm = compileDirective('options-maxDate-today');
        angular.element(elm[0]).triggerHandler('focus');
        var date = new Date(), today = date.getDate();
        expect(sandboxEl.find('.dropdown-menu tbody button[disabled]').length > 0).toBeTruthy();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + today + ')').is(':disabled')).toBeFalsy();
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

});
