'use strict';

describe('tooltip', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, $tooltip, scope;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.tooltip'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$tooltip_) {
    scope = _$rootScope_.$new();
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $tooltip = _$tooltip_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {tooltip: {title: 'Hello Tooltip!'}},
      element: '<a title="{{tooltip.title}}" bs-tooltip>hover me</a>'
    },
    'markup-scope': {
      element: '<a bs-tooltip="tooltip">hover me</a>'
    },
    'markup-ngRepeat': {
      scope: {items: [{name: 'foo', tooltip: 'Hello Tooltip!'}]},
      element: '<ul><li ng-repeat="item in items"><a title="{{item.tooltip}}" bs-tooltip>{{item.name}}</a></li></ul>'
    },
    'markup-ngClick-service': {
      element: '<a ng-click="showTooltip()">click me</a>'
    },
    'options-animation': {
      element: '<a data-animation="animation-flipX" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement': {
      element: '<a data-placement="bottom" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-exotic': {
      element: '<a data-placement="bottom-right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-trigger': {
      element: '<a data-trigger="click" bs-tooltip="tooltip">click me</a>'
    },
    'options-html': {
      scope: {tooltip: {title: 'Hello Tooltip<br>This is a multiline message!'}},
      element: '<a data-html="1" bs-tooltip="tooltip">hover me</a>'
    },
    'options-template': {
      scope: {tooltip: {title: 'Hello Tooltip!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{tooltip.title}}" data-template="custom" bs-tooltip>hover me</a>'
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

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.items[0].tooltip);
    });

  });

  describe('using service', function() {

    it('should correctly open on next digest', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      expect(bodyEl.children('.tooltip').length).toBe(0);
      myTooltip.show();
      expect(bodyEl.children('.tooltip').length).toBe(1);
      myTooltip.hide();
      expect(bodyEl.children('.tooltip').length).toBe(0);
    });

    it('should correctly be destroyed', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      expect(bodyEl.children('.tooltip').length).toBe(0);
      myTooltip.show();
      expect(bodyEl.children('.tooltip').length).toBe(1);
      myTooltip.destroy();
      expect(bodyEl.children('.tooltip').length).toBe(0);
      expect(bodyEl.children().length).toBe(1);
    });

    it('should correctly work with ngClick', function() {
      var elm = compileDirective('markup-ngClick-service');
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.showTooltip = function() {
        myTooltip.$promise.then(myTooltip.show);
      };
      expect(bodyEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(bodyEl.children('.tooltip').length).toBe(1);
    });

  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `animation-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('animation-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('animation-flipX')).toBeTruthy();
      });

    });

    describe('placement', function() {

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

    describe('trigger', function() {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.tooltip').length).toBe(0);
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.tooltip').length).toBe(1);
        angular.element(elm[0]).triggerHandler('click');
        expect(sandboxEl.children('.tooltip').length).toBe(0);
      });

    });

    describe('html', function() {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-html');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: ' + scope.tooltip.title);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner"><ul><li ng-repeat="item in items">{{item}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').text()).toBe('foobarbaz');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('mouseleave');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').text()).toBe('foobarbaz');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner"><a class="btn" ng-click="tooltip.counter=tooltip.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(angular.element(sandboxEl.find('.tooltip-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.tooltip.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('mouseleave');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(angular.element(sandboxEl.find('.tooltip-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.tooltip.counter).toBe(2);
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
