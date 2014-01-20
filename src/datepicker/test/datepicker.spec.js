'use strict';

describe('datepicker', function() {

  var $compile, $templateCache, $datepicker, scope, sandboxEl, today;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.datepicker'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$datepicker_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $datepicker = _$datepicker_;
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
    'options-autoclose': {
      element: '<input type="text" ng-model="selectedDate" data-autoclose="1" bs-datepicker>'
    },
    'options-template': {
      element: '<input type="text" data-template="custom" ng-model="selectedDate" bs-datepicker>'
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
    });

    it('should correctly display active date', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td .btn-primary').text().trim() * 1).toBe(today.getUTCDate());
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-datepicker]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody td').length).toBe(5);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe(7 * 5);
    });

  });


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
        // @TODO fix me
        // expect(sandboxEl.children('.dropdown-menu.datepicker').length).toBe(0);
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

  });

});
