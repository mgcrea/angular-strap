'use strict';

describe('alert', function () {

  var $compile, $templateCache, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.modal', 'mgcrea.ngStrap.alert'));

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
      scope: {alert: {title: 'Title', content: 'Hello alert<br>This is a multiline message!'}},
      element: '<a title="{{alert.title}}" data-content="{{alert.content}}" bs-alert>click me</a>'
    },
    'markup-scope': {
      element: '<a bs-alert="alert">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', alert: {title: 'Title', content: 'Hello alert<br>This is a multiline message!'}}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.alert.title}}" data-content="{{item.alert.content}}" bs-alert>{{item.name}}</a></li></ul>'
    },
    'options-placement': {
      element: '<a data-placement="left" bs-alert="alert">click me</a>'
    },
    'options-template': {
      scope: {alert: {title: 'Title', content: 'Hello alert<br>This is a multiline message!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{alert.title}}" data-content="{{alert.content}}" data-template="custom" bs-alert>click me</a>'
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
      expect(sandboxEl.children('.alert').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.alert').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.alert').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.alert').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.alert > strong').html()).toBe(scope.alert.title);
      expect(sandboxEl.find('.alert > span').html()).toBe(scope.alert.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.alert > strong').html()).toBe(scope.alert.title);
      expect(sandboxEl.find('.alert > span').html()).toBe(scope.alert.content);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-alert]')).triggerHandler('click');
      expect(sandboxEl.find('.alert > strong').html()).toBe(scope.items[0].alert.title);
      expect(sandboxEl.find('.alert > span').html()).toBe(scope.items[0].alert.content);
    });

  });


  describe('options', function () {

    describe('animation', function () {

      it('should default to `animation-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.alert')).toHaveClass('animation-fade');
      });

    });

    describe('placement', function () {

      it('should default to `null` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.alert')).not.toHaveClass('top');
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.alert')).toHaveClass('left');
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="alert"><div class="alert-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert-inner').text()).toBe('foo: ' + scope.alert.title);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="alert"><div class="alert-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert-inner').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.alert-inner').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="alert"><div class="alert-inner"><a class="btn" ng-click="alert.counter=alert.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.alert-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.alert.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.alert-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.alert.counter).toBe(2);
      });

    });

  });

});
