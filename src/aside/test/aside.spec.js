'use strict';

describe('aside', function () {

  var $compile, $templateCache, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.aside'));

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
      scope: {aside: {title: 'Title', content: 'Hello aside!'}},
      element: '<a title="{{aside.title}}" data-content="{{aside.content}}" bs-aside>click me</a>'
    },
    'markup-scope': {
      element: '<a bs-aside="aside">click me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', aside: {title: 'Title', content: 'Hello aside!'}}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.aside.title}}" data-content="{{item.aside.content}}" bs-aside>{{item.name}}</a></li></ul>'
    },
    'options-placement': {
      element: '<a data-placement="left" bs-aside="aside">click me</a>'
    },
    'options-html': {
      scope: {aside: {title: 'Title', content: 'Hello aside<br>This is a multiline message!'}},
      element: '<a data-html="1" bs-aside="aside">click me</a>'
    },
    'options-template': {
      scope: {aside: {title: 'Title', content: 'Hello aside!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a data-template="custom" bs-aside="aside">click me</a>'
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
      expect(sandboxEl.children('.aside').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.aside').length).toBe(1);
    });

    it('should close on click', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.aside').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.aside').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.aside-title').html()).toBe(scope.aside.title);
      expect(sandboxEl.find('.aside-body').html()).toBe(scope.aside.content);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.find('.aside-title').html()).toBe(scope.aside.title);
      expect(sandboxEl.find('.aside-body').html()).toBe(scope.aside.content);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-aside]')).triggerHandler('click');
      expect(sandboxEl.find('.aside-title').html()).toBe(scope.items[0].aside.title);
      expect(sandboxEl.find('.aside-body').html()).toBe(scope.items[0].aside.content);
    });

  });


  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade-and-slide-right` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.aside')).toHaveClass('am-fade-and-slide-right');
      });

    });

    describe('placement', function () {

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.aside')).toHaveClass('right');
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.aside')).toHaveClass('left');
      });

    });

    describe('html', function () {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-html');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-title').html()).toBe(scope.aside.title);
        expect(sandboxEl.find('.aside-body').html()).toBe(scope.aside.content);
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-inner').text()).toBe('foo: ' + scope.aside.title);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-inner').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.find('.aside-inner').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="aside"><div class="aside-inner"><a class="btn" ng-click="aside.counter=aside.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.aside-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.aside.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('click');
        angular.element(elm[0]).triggerHandler('click');
        expect(angular.element(sandboxEl.find('.aside-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.aside.counter).toBe(2);
      });

    });

  });

});
