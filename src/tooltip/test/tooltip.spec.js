'use strict';

describe('tooltip', function() {

  var bodyEl = $('body'), sandboxEl;
  var $compile, $templateCache, $$rAF, $animate, $tooltip, scope;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.tooltip'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$$rAF_, _$animate_, _$tooltip_) {
    scope = _$rootScope_.$new();
    $$rAF = _$$rAF_;
    $animate = _$animate_;
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
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
    'markup-button': {
      element: '<button type="button" bs-tooltip="tooltip">hover me</button>'
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
    'options-delay': {
      element: '<a data-delay="15" bs-tooltip="tooltip">hover me</a>'
    },
    'options-animation': {
      element: '<a data-animation="am-flip-x" bs-tooltip="tooltip">hover me</a>'
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
    },
    'options-contentTemplate': {
      scope: {tooltip: {title: 'Hello Tooltip!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{tooltip.title}}" data-content-template="custom" bs-tooltip>hover me</a>'
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
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should close on mouseleave', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.items[0].tooltip);
    });

    it('should support button markup', function() {
      var elm = compileDirective('markup-button');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

  });

  describe('using service', function() {

    it('should correctly open on next digest', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      expect(bodyEl.children('.tooltip').length).toBe(0);
      myTooltip.show();
      $animate.triggerCallbacks();
      expect(bodyEl.children('.tooltip').length).toBe(1);
      myTooltip.hide();
      expect(bodyEl.children('.tooltip').length).toBe(0);
    });

    it('should do nothing when hiding an already hidden popup', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      expect(function() {
        myTooltip.hide();
      }).not.toThrow();
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

    it('should correctly work with ngClick with an isolated scope', function() {
      scope = scope.$new(true);
      var elm = compileDirective('markup-ngClick-service');
      var myTooltip = $tooltip(sandboxEl, {scope:scope, trigger: 'manual'});
      scope.showTooltip = function() {
        myTooltip.$promise.then(myTooltip.show);
      };
      expect(bodyEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('click');
      expect(bodyEl.children('.tooltip').length).toBe(1);
    });

  });

  describe('show / hide events', function() {

    it('should dispatch show and show.before events', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      var emit = spyOn(myTooltip.$scope, '$emit');
      scope.$digest();
      myTooltip.show();

      expect(emit).toHaveBeenCalledWith('tooltip.show.before', myTooltip);
      // show only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('tooltip.show', myTooltip);
      $animate.triggerCallbacks();
      expect(emit).toHaveBeenCalledWith('tooltip.show', myTooltip);
    });

    it('should dispatch hide and hide.before events', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      myTooltip.show();

      var emit = spyOn(myTooltip.$scope, '$emit');
      myTooltip.hide();

      expect(emit).toHaveBeenCalledWith('tooltip.hide.before', myTooltip);
      // hide only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('tooltip.hide', myTooltip);
      $animate.triggerCallbacks();
      expect(emit).toHaveBeenCalledWith('tooltip.hide', myTooltip);
    });

    it('should namespace show/hide events using the prefixEvent', function() {
      var myTooltip = $tooltip(sandboxEl, angular.extend({prefixEvent: 'datepicker'}, templates['default'].scope.tooltip));
      var emit = spyOn(myTooltip.$scope, '$emit');
      scope.$digest();
      myTooltip.show();
      myTooltip.hide();
      $animate.triggerCallbacks();

      expect(emit).toHaveBeenCalledWith('datepicker.show.before', myTooltip);
      expect(emit).toHaveBeenCalledWith('datepicker.show', myTooltip);
      expect(emit).toHaveBeenCalledWith('datepicker.hide.before', myTooltip);
      expect(emit).toHaveBeenCalledWith('datepicker.hide', myTooltip);
    });

    it('should be invisible until it is positioned', inject(function ($$rAF) {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      myTooltip.show();

      expect(bodyEl.children('.tooltip').css('visibility')).toBe('hidden');

      // Positioning and visibility occurs inside the rAF callback.
      $$rAF.flush();
      expect(bodyEl.children('.tooltip').css('visibility')).toBe('visible');
    }));
  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.tooltip').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('delay', function() {

      it('should support delay', function(done) {
        var elm = compileDirective('options-delay');
        angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();

        expect(sandboxEl.children('.tooltip').length).toBe(0);
        setTimeout(function() {
          expect(sandboxEl.children('.tooltip').length).toBe(1);
          done();
        }, 20);
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


    describe('contentTemplate', function() {

      it('should support custom contentTemplate', function() {
        $templateCache.put('custom', 'foo: {{title}}');
        var elm = compileDirective('options-contentTemplate');
        angular.element(elm[0]).triggerHandler('mouseenter');
        // @TODO fixme
        // expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: ' + scope.tooltip.title);
      });

    });

    describe('container', function() {
      it('accepts element object', function() {
      	var testElm = angular.element('<div></div>');
      	sandboxEl.append(testElm);
        var myTooltip = $tooltip(sandboxEl, angular.extend({}, templates['default'].scope.tooltip, {container: testElm}));
        scope.$digest();
        myTooltip.show();
        $animate.triggerCallbacks();
        expect(angular.element(testElm.children()[0]).hasClass('tooltip')).toBeTruthy();
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
