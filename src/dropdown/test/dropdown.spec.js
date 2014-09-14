'use strict';

describe('dropdown', function () {

  var $compile, $templateCache, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.dropdown'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {dropdown: [{text: 'Another action', href: '#foo'}, {text: 'External link', href: '/auth/facebook', target: '_self'}, {text: 'Something else here', click: '$alert(\'working ngClick!\')'}, {divider: true}, {text: 'Separated link', href: '#separatedLink'}]},
      element: '<a bs-dropdown="dropdown">click me</a>'
    },
    'in-navbar': {
      element: '<div class="collapse navbar-collapse"><ul class="nav navbar-nav"><li class="dropdown"><a bs-dropdown="dropdown">click me</a></li></ul>'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><a bs-dropdown="dropdown">{{i}}</a></li></ul>'
    },
    'options-animation': {
      element: '<a data-animation="am-flip-x" bs-dropdown="dropdown">click me</a>'
    },
    'options-placement': {
      element: '<a data-placement="bottom" bs-dropdown="dropdown">click me</a>'
    },
    'options-placement-exotic': {
      element: '<a data-placement="bottom-right" bs-dropdown="dropdown">click me</a>'
    },
    'options-trigger': {
      element: '<a data-trigger="hover" bs-dropdown="dropdown">hover me</a>'
    },
    'options-html': {
      scope: {dropdown: [{text: '<i icon="fa fa-edit"></i> Edit', href: '#foo'}]},
      element: '<a bs-dropdown="dropdown">click me</a>'
    },
    'options-template': {
      element: '<a title="{{dropdown.title}}" data-template="custom" bs-dropdown>click me</a>'
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

  describe('with default template', function () {

    it('should open on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').text()).toBe(scope.dropdown[0].text);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').attr('href')).toBe(scope.dropdown[0].href);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').attr('ng-click')).toBeUndefined();
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').text()).toBe(scope.dropdown[1].text);
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').attr('href')).toBe(scope.dropdown[1].href);
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').attr('target')).toBe(scope.dropdown[1].target);
      expect(sandboxEl.find('.dropdown-menu a:eq(1)').attr('ng-click')).toBeUndefined();
      expect(sandboxEl.find('.dropdown-menu a:eq(2)').attr('href')).toBeDefined();
      expect(sandboxEl.find('.dropdown-menu a:eq(2)').attr('ng-click')).toBe('$eval(item.click);$hide()');
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-dropdown]:eq(0)')).triggerHandler('click');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
      expect(sandboxEl.find('.dropdown-menu a:eq(0)').text()).toBe(scope.dropdown[0].text);
    });

  });

  describe('in navbar', function() {
    it('should add class .open to the parent <li> when dropdown is open', function() {
      var elm = compileDirective('in-navbar');
      angular.element(elm.find('a')).triggerHandler('click');
      expect(sandboxEl.find('.dropdown').hasClass('open')).toBeTruthy();
      angular.element(elm.find('a')).triggerHandler('click');
      expect(sandboxEl.find('.dropdown').hasClass('open')).toBeFalsy();
    });
  });


  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function () {

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function () {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('html', function () {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-html');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.dropdown.length);
        expect(sandboxEl.find('.dropdown-menu a:eq(0)').text()).toBe(scope.dropdown[0].text);
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner">foo: {{dropdown.length}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: ' + scope.dropdown.length);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner"><ul><li ng-repeat="item in dropdown">{{$index}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('01234');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('01234');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

  });

});
