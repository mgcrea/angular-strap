'use strict';

describe('popover', function () {
  var scope, $sandbox, $compile, $timeout, $httpBackend, $templateCache;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$httpBackend_, _$templateCache_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    $templateCache = _$templateCache_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      scope: {content: "World<br />Multiline Content<br />"},
      popover: 'Hello <span ng-bind-html-unsafe="content"></span>',
      element: '<a class="btn" bs-popover="\'partials/popover.html\'" data-title="aTitle" data-placement="left"></a>'
    },
    'unique': {
      scope: {content: "World<br />Multiline Content<br />"},
      popover: 'Hello <span ng-bind-html-unsafe="content"></span>',
      element: '<a class="btn" bs-popover="\'partials/popover.html\'" data-title="aTitle" data-unique="1"></a>'
    },
    'hide': {
      scope: {content: "World<br />Multiline Content<br />", foo: {hide: false}},
      popover: 'Hello <span ng-bind-html-unsafe="content"></span>',
      element: '<a class="btn" bs-popover="\'partials/popover.html\'" data-title="aTitle" data-hide="foo.hide"></a>'
    },
    'show': {
      scope: {content: "World<br />Multiline Content<br />", foo: {show: false}},
      popover: 'Hello <span ng-bind-html-unsafe="content"></span>',
      element: '<a class="btn" bs-popover="\'partials/popover.html\'" data-title="aTitle" data-show="foo.show"></a>'
    },
    'object': {
      scope: {popover: {title: "aTitle", content: "World<br />Multiline Content<br />"}},
      element: '<a class="btn" bs-popover="popover"></a>'
    },
    'cached': {
      scope: {content: "World<br />Multiline Content<br />"},
      element: '<script type="text/ng-template" id="cached-popover">' + 'Hello <span ng-bind-html-unsafe="content"></span>' + '</script>' + '<a class="btn" bs-popover="\'cached-popover\'" data-title="aTitle"></a>'
    },
    'ngRepeatWithoutTitle': {
      scope: {things: [{name: "A"}, {name: "B"}, {name: "C"}]},
      popover: '<ul><li ng-repeat="thing in things">{{thing.name}}</li></ul>',
      element: '<a class="btn" bs-popover="\'partials/popover.html\'"></a>'
    }
  };

  function compileDirective(template, expectCache) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope);
    var $element = $(template.element).appendTo($sandbox);
    if(!expectCache) { $httpBackend.expectGET('partials/popover.html').respond(template.popover); }
    $element = $compile($element)(scope);
    if(!expectCache) { $httpBackend.flush(); }
    scope.$digest(); // evaluate $evalAsync queue used by $q
    return $element;
  }

  // Tests

  it('should fetch the partial with $http and build the popover', function () {
    var elm = compileDirective();
    expect(elm.data('popover')).toBeDefined();
    expect(elm.data('popover').options.content).toBe(templates['default'].popover);
  });

  it('should fetch the partial from cache and build the popover', function () {
    compileDirective('cached', true);
    expect(scope.$$asyncQueue.length).toBe(0);
    var elm = $('a[bs-popover]');
    expect(elm.data('popover')).toBeDefined();
    expect(elm.data('popover').options.content).toBe(templates['default'].popover);
  });

  it('should support a plain object and build the popover', function () {
    compileDirective('object', true);
    var elm = $('a[bs-popover]');
    expect(elm.data('popover')).toBeDefined();
    expect(elm.data('popover').options.content).toBe(templates['object'].scope.popover.content);
  });

  it('should correctly call $.fn.popover', function () {
    var old = $.fn.popover;
    var spy = angular.extend(spyOn($.fn, 'popover'), old).andCallThrough();
    var elm = compileDirective();
    expect(spy).toHaveBeenCalled();
  });

  it('should define a correct title', function() {
    var elm = compileDirective();
    elm.popover('show');
    expect(elm.data('popover').tip().find('.popover-title').text()).toBe('aTitle');
  });

  it('should resolve scope variables in the external partial', function() {
    var elm = compileDirective();
    elm.popover('show');
    expect(elm.data('popover').tip().find('.popover-content').text()).toBe('Hello ' + scope.content.replace(/<br \/>/g, ''));
  });

  it('should define the popover reference on the tip', function() {
    var elm = compileDirective();
    elm.trigger('click');
    expect(elm.data('popover').tip().data('popover')).toBeDefined();
    expect(elm.data('popover')).toBe(elm.data('popover').tip().data('popover'));
  });

  it('should show/hide the popover on click', function() {
    var elm = compileDirective();
    elm.trigger('click');
    expect(elm.data('popover').tip().hasClass('in')).toBe(true);
    elm.trigger('click');
    expect(elm.data('popover').tip().hasClass('in')).toBe(false);
  });

  it('should support data-unique attribute', function() {
    var elm = compileDirective(), elm2 = compileDirective('unique', true);
    elm.trigger('click');
    expect(elm.data('popover').tip().hasClass('in')).toBe(true);
    elm2.trigger('click');
    // doom to fail until https://github.com/testacular/testacular/issues/349
    //expect(elm.data('popover').tip().hasClass('in')).toBe(false);
  });

  it('should support data-hide attribute', function() {
    var elm = compileDirective('hide');
    elm.trigger('click');
    expect(elm.data('popover').tip().hasClass('in')).toBe(true);
    scope.foo.hide = true;
    scope.$digest(); // $digest already in progress
    expect(elm.data('popover').tip().hasClass('in')).toBe(false);
  });

  it('should support data-show attribute', function() {
    var elm = compileDirective('show');
    expect(elm.data('popover').tip().hasClass('in')).toBe(false);
    scope.foo.show = true;
    $timeout(function() {
        expect(elm.data('popover').tip().hasClass('in')).toBe(true);
    });
  });

  it('should correctly compile ng-repeat without a title', function() {
    var elm = compileDirective('ngRepeatWithoutTitle');
    elm.popover('show');
    expect(elm.data('popover').tip().find('.popover-content').text()).toBe('ABC');
  });

  describe("events", function() {
    var elm, spy;

    beforeEach(function() {
      elm = compileDirective();
      spy = jasmine.createSpy('event');
    });

    it('should emit an event on show', function () {
      scope.$on('popover-show', spy);
      elm.popover('show');
      expect(spy).toHaveBeenCalled();
    });

    it('should emit an event on shown', function () {
      scope.$on('popover-shown', spy);
      elm.popover('show');
      // expect(spy).toHaveBeenCalled();
    });

    it('should emit an event on hide', function () {
      scope.$on('popover-hide', spy);
      elm.popover('hide');
      expect(spy).toHaveBeenCalled();
    });

    it('should emit an event on hidden', function () {
      scope.$on('popover-hidden', spy);
      elm.popover('hide');
      // expect(spy).toHaveBeenCalled();
    });

  });

});
