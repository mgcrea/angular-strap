'use strict';

describe('tooltip', function () {

  var $compile, $templateCache, scope, sandboxEl;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.tooltip'));

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
      scope: {tooltip: {title: 'Hello Tooltip<br>This is a multiline message!'}},
      element: '<a title="{{tooltip.title}}" bs-tooltip>hover me</a>'
    },
    'markup-scope': {
      element: '<a bs-tooltip="tooltip">hover me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', tooltip: 'Hello Tooltip<br>This is a multiline message!'}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.tooltip}}" bs-tooltip>{{item.name}}</a></li></ul>'
    },
    'custom-template': {
      scope: {items: ['foo', 'bar', 'baz'], foo: {bar: 0}},
      element: '<a title="bar" data-template="custom" bs-tooltip>hover me</a>'
    },
    'options-placement': {
      element: '<a title="{{tooltip.title}}" data-placement="bottom" bs-tooltip>hover me</a>'
    },
    'options-placement-exotic': {
      element: '<a title="{{tooltip.title}}" data-placement="bottom-right" bs-tooltip>hover me</a>'
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

    it('should open on mouseenter', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should close on mouseleave', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support ngRepeat markup inside', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.items[0].tooltip);
    });

    it('should support custom template', function() {
      $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: bar');
    });

    it('should support template with ngRepeat', function() {
      $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').text()).toBe('foobarbaz');
      // Consecutive toggles
      angular.element(elm[0]).triggerHandler('mouseleave');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').text()).toBe('foobarbaz');
    });

    it('should support template with ngClick', function() {
      $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner"><a class="btn" ng-click="foo.bar=foo.bar+1">click me</a></div></div>');
      var elm = compileDirective('custom-template');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(angular.element(sandboxEl.find('.tooltip-inner > .btn')[0]).triggerHandler('click'));
      expect(scope.foo.bar).toBe(1);
      // Consecutive toggles
      angular.element(elm[0]).triggerHandler('mouseleave');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(angular.element(sandboxEl.find('.tooltip-inner > .btn')[0]).triggerHandler('click'));
      expect(scope.foo.bar).toBe(2);
    });

    it('should default to `animation-fade` animation', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').hasClass('animation-fade')).toBeTruthy();
    });

  });


  describe('options', function () {

    describe('placement', function () {

      it('should default to `animation-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('animation-fade')).toBeTruthy();
      });

    });

    describe('placement', function () {

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('top')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('bottom-right')).toBeTruthy();
      });

    });

  });

});


// https://github.com/angular-ui/bootstrap/blob/master/src/tooltip/test/tooltip.spec.js
// iit('test-cache', function() {
//   var elm = compileDirective('default');
//   var tooltipScope = scope.$$childTail;
//   console.warn(scope.$id);
//   scope.$destroy();
//   console.warn(tooltipScope.$id);
//   angular.forEach(angular.element.cache, function(item) {
//     if (item.data && item.data.$scope === tooltipScope) {
//       console.warn('in');
//     }
//   });
// })
