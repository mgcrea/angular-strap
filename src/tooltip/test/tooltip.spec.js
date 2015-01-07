'use strict';
/* global countScopes */

describe('tooltip', function() {

  var bodyEl = $('body'), sandboxEl;
  var $rootScope, $compile, $templateCache, $$rAF, $animate, $httpBackend, $tooltip, scope;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('mgcrea.ngStrap.tooltip'));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $templateCache = $injector.get('$templateCache');
    $$rAF = $injector.get('$$rAF');
    $animate = $injector.get('$animate');
    $httpBackend = $injector.get('$httpBackend');
    $tooltip = $injector.get('$tooltip');

    bodyEl.html('');
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo(bodyEl);
    scope = $rootScope.$new();
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
    'default-with-id': {
      scope: {tooltip: {title: 'Hello Tooltip!'}},
      element: '<a id="link1" title="{{tooltip.title}}" bs-tooltip>hover me</a>'
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
    'options-delay-multiple': {
      element: '<a data-delay="15,30" bs-tooltip="tooltip">hover me</a>'
    },
    'options-keyboard': {
      scope: {tooltip: {title: 'Hello Tooltip!', keyboard: true}},
      element: '<a data-keyboard="true" bs-tooltip="tooltip">hover me</a>'
    },
    'options-animation': {
      element: '<a data-animation="am-flip-x" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-top': {
      element: '<a data-placement="top" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-right': {
      element: '<a data-placement="right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-bottom': {
      element: '<a data-placement="bottom" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-left': {
      element: '<a data-placement="left" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-exotic-top-left': {
      element: '<a data-placement="top-left" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-exotic-top-right': {
      element: '<a data-placement="top-right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-exotic-bottom-left': {
      element: '<a data-placement="bottom-left" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-exotic-bottom-right': {
      element: '<a data-placement="bottom-right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto': {
      element: '<a data-placement="auto" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-top': {
      element: '<a data-placement="auto top" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-right': {
      element: '<a data-placement="auto right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-bottom': {
      element: '<a data-placement="auto bottom" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-left': {
      element: '<a data-placement="auto left" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-exotic-top-left': {
      element: '<a data-placement="auto top-left" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-exotic-top-right': {
      element: '<a data-placement="auto top-right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-exotic-bottom-left': {
      element: '<a data-placement="auto bottom-left" bs-tooltip="tooltip">hover me</a>'
    },
    'options-placement-auto-exotic-bottom-right': {
      element: '<a data-placement="auto bottom-right" bs-tooltip="tooltip">hover me</a>'
    },
    'options-trigger': {
      element: '<a data-trigger="click" bs-tooltip="tooltip">click me</a>'
    },
    'options-html': {
      element: '<a data-html="1" title="Hello Tooltip<br>This is a multiline message!" bs-tooltip>hover me</a>'
    },
    'options-template': {
      scope: {tooltip: {title: 'Hello Tooltip!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{tooltip.title}}" data-template="custom" bs-tooltip>hover me</a>'
    },
    'options-contentTemplate': {
      scope: {tooltip: {title: 'Hello Tooltip!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{tooltip.title}}" data-content-template="custom" bs-tooltip>hover me</a>'
    },
    'bsShow-attr': {
      scope: {tooltip: {title: 'Hello Tooltip!'}},
      element: '<a title="{{tooltip.title}}" bs-tooltip bs-show="true">hover me</a>'
    },
    'bsShow-binding': {
      scope: {isVisible: false, tooltip: {title: 'Hello Tooltip!'}},
      element: '<a title="{{tooltip.title}}" bs-tooltip bs-show="isVisible">hover me</a>'
    },
    'bsEnabled-attr': {
      scope: {tooltip: {title: 'Hello Tooltip!'}},
      element: '<a title="{{tooltip.title}}" bs-tooltip bs-enabled="false">hover me</a>'
    },
    'bsEnabled-attr-binding': {
      scope: {tooltip: {title: 'Hello Tooltip!'}, isEnabled: true},
      element: '<a title="{{tooltip.title}}" bs-tooltip bs-enabled="isEnabled">hover me</a>'
    },
    'bsTooltip-string': {
      element: '<a bs-tooltip="tooltip.title">hover me</a>'
    },
    'bsTooltip-ngRepeat-string': {
      scope: {items: [{name: 'foo', tooltip: 'Hello Tooltip!'}]},
      element: '<ul><li ng-repeat="item in items"><a bs-tooltip="item.tooltip">{{item.name}}</a></li></ul>'
    },
    'bsTooltip-noValue': {
      scope: {title: 'Inherited Title'},
      element: '<a bs-tooltip>hover me</a>'
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

  describe('resource allocation', function() {
    it('should not create additional scopes after first show', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('mouseleave');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(0);

      var scopeCount = countScopes(scope, 0);

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.triggerCallbacks();
        angular.element(elm[0]).triggerHandler('mouseleave');
        $animate.triggerCallbacks();
      }

      expect(countScopes(scope, 0)).toBe(scopeCount);
    });

    it('should destroy scopes when destroying directive scope', function() {
      var scopeCount = countScopes(scope, 0);
      var originalScope = scope;
      scope = scope.$new();
      var elm = compileDirective('default');

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.triggerCallbacks();
        angular.element(elm[0]).triggerHandler('mouseleave');
        $animate.triggerCallbacks();
      }

      scope.$destroy();
      scope = originalScope;
      expect(countScopes(scope, 0)).toBe(scopeCount);
    });
  });

  describe('bsShow attribute', function() {
    it('should support setting to a boolean value', function() {
      var elm = compileDirective('bsShow-attr');
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should support binding', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      scope.isVisible = true;
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      scope.isVisible = false;
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should support initial value false', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should support initial value true', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: true});
      expect(scope.isVisible).toBeTruthy();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should support undefined value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: undefined});
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should support string value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: 'a string value'});
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      scope.isVisible = 'TRUE';
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      scope.isVisible = 'dropdown';
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      scope.isVisible = 'datepicker,tooltip';
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });
  });

  describe('bsEnabled attribute', function() {
    it('should support setting to a boolean value', function() {
      var elm = compileDirective('bsEnabled-attr');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should open on mouseenter when enabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should close on mouseleave when enabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should not open on mouseenter when disabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding', { isEnabled: false });
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should close on mouseleave when disabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      scope.isEnabled = false;
      scope.$digest();
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should support undefined value', function() {
      var elm = compileDirective('bsEnabled-attr-binding', { isEnabled: undefined });
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should support string values', function() {
      var elm = compileDirective('bsEnabled-attr-binding', { isEnabled: 'true' });
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('mouseleave');
      scope.isEnabled = 'false';
      scope.$digest();
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseleave');
      scope.isEnabled = '1';
      scope.$digest();
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('mouseleave');
      scope.isEnabled = '0';
      scope.$digest();
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseleave');
      scope.isEnabled = 'tooltip';
      scope.$digest();
      angular.element(elm[0]).triggerHandler('mouseenter');
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

  });

  describe('bsTooltip attribute', function() {

    it('should support string value', function() {
      var elm = compileDirective('bsTooltip-string');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support string value from within ngRepeat markup', function() {
      var elm = compileDirective('bsTooltip-ngRepeat-string');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.items[0].tooltip);
    });

    it('should overwrite inherited title when no value specified', function() {
      var elm = compileDirective('bsTooltip-noValue');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.triggerCallbacks();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe('');
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

    it('should open if option show is true', function() {
      var options = angular.extend({ show: true }, templates['default'].scope.tooltip);
      var myTooltip = $tooltip(sandboxEl, options);
      scope.$digest();
      $animate.triggerCallbacks();
      expect(bodyEl.children('.tooltip').length).toBe(1);
      myTooltip.hide();
      scope.$digest();
      $animate.triggerCallbacks();
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

    it('should store config id value in instance', function() {
      var myTooltip = $tooltip(sandboxEl, {scope:scope, trigger: 'manual', id: 'instance1'});
      expect(myTooltip.$id).toBe('instance1');
    });

    it('should fallback to element id value when id is not provided in config', function() {
      var myTooltip = $tooltip(sandboxEl, {scope:scope, trigger: 'manual'});
      expect(myTooltip.$id).toBe('sandbox');
    });

  });

  describe('using scope helpers', function() {

    var elm, elmScope;
    beforeEach(function() {
      elm = compileDirective('default');
      elmScope = angular.element(elm).scope().$$childTail;
      scope.$digest();
    });

    it('should correctly open on next digest', function() {
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$show();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$hide();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$toggle();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$toggle();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
    });

    it('should do nothing when hiding an already hidden popup', function() {
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$hide();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
    });

    it('should do nothing when showing an already visible popup', function() {
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      expect(elmScope.$isShown).toBeFalsy();
      elmScope.$show();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
      elmScope.$show();
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      expect(elmScope.$isShown).toBeTruthy();
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

    it('should call show.before event with tooltip element instance id', function() {
      var elm = compileDirective('default-with-id');
      var id = "";
      scope.$on('tooltip.show.before', function(evt, tooltip) {
        id = tooltip.$id;
      });

      angular.element(elm[0]).triggerHandler('mouseenter');
      scope.$digest();
      expect(id).toBe('link1');
    });

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

      it('should support multiple delay', function(done) {
        var elm = compileDirective('options-delay-multiple');
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.triggerCallbacks();

        expect(sandboxEl.children('.tooltip').length).toBe(0);
        setTimeout(function() {
          expect(sandboxEl.children('.tooltip').length).toBe(1);
          done();
        }, 20);
      });

    });

    describe('keyboard', function() {

      it('should dismiss and stopPropagation if ESC is pressed when trigger !== "focus"', function() {
        var myTooltip = $tooltip(sandboxEl, angular.extend({trigger: 'click'}, templates['options-keyboard'].scope.tooltip));
        scope.$digest();
        expect(bodyEl.children('.tooltip').length).toBe(0);
        myTooltip.show();
        expect(bodyEl.children('.tooltip').length).toBe(1);
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        spyOn(evt, 'stopPropagation');
        myTooltip.$onKeyUp(evt);
        expect(bodyEl.children('.tooltip').length).toBe(0);
        expect(evt.stopPropagation).toHaveBeenCalled();
      });

      it('should NOT stopPropagation if ESC is pressed while tooltip is hidden', function() {
        var myTooltip = $tooltip(sandboxEl, angular.extend({trigger: 'click'}, templates['options-keyboard'].scope.tooltip));
        scope.$digest();
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        spyOn(evt, 'stopPropagation');
        myTooltip.$onKeyUp(evt);
        expect(evt.stopPropagation).not.toHaveBeenCalled();
      });

      it('should blur and stopPropagation if ESC is pressed when trigger === "focus"', function() {
        var myTooltip = $tooltip(sandboxEl, angular.extend({trigger: 'focus'}, templates['options-keyboard'].scope.tooltip));
        spyOn(sandboxEl[0], 'blur');
        var evt = jQuery.Event( 'keyup', { keyCode: 27, which: 27 } );
        spyOn(evt, 'stopPropagation');
        myTooltip.$onFocusKeyUp(evt);
        expect(sandboxEl[0].blur).toHaveBeenCalled();
        expect(evt.stopPropagation).toHaveBeenCalled();
      });

    });

    describe('placement', function() {
      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('mouseenter');
        $$rAF.flush();
        expect(sandboxEl.children('.tooltip').hasClass('top')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement-bottom');
        angular.element(elm[0]).triggerHandler('mouseenter');
        $$rAF.flush();
        expect(sandboxEl.children('.tooltip').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic-bottom-right');
        angular.element(elm[0]).triggerHandler('mouseenter');
        $$rAF.flush();
        expect(sandboxEl.children('.tooltip').hasClass('bottom-right')).toBeTruthy();
      });

      describe('auto placement', function () {
        it('should remove `auto` from placements when auto positioning', function () {
          var elm = compileDirective('options-placement-auto-top');
          angular.element(elm[0]).triggerHandler('mouseenter');

          // set the offset to 0 so we don't trigger changing the placement
          spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
            if (prop === 'offsetWidth') return 0;
            if (prop === 'offsetHeight') return 0;
          });

          $$rAF.flush();
          expect(sandboxEl.children('.tooltip').hasClass('top')).toBeTruthy();
        })

        it('should remove `auto` from exotic placements when auto positioning', function () {
          var elm = compileDirective('options-placement-auto-exotic-top-left');
          angular.element(elm[0]).triggerHandler('mouseenter');

          // set the offset to 0 so we don't trigger changing the placement
          spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
            if (prop === 'offsetWidth') return 0;
            if (prop === 'offsetHeight') return 0;
          });

          $$rAF.flush();
          expect(sandboxEl.children('.tooltip').hasClass('top-left')).toBeTruthy();
        })

        it('should default to `top` when `auto` placement is set without a preference', function () {
          var elm = compileDirective('options-placement-auto');
          angular.element(elm[0]).triggerHandler('mouseenter');

          // set the offset to 0 so we don't trigger changing the placement
          spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
            if (prop === 'offsetWidth') return 0;
            if (prop === 'offsetHeight') return 0;
          });

          $$rAF.flush();
          expect(sandboxEl.children('.tooltip').hasClass('top')).toBeTruthy();
        });
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
        expect(sandboxEl.find('.tooltip-inner').html()).toBe('Hello Tooltip<br>This is a multiline message!');
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: ' + scope.tooltip.title);
      });

      it('should request custom template via $http', function() {
        $httpBackend.expectGET('custom').respond(200, '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        $httpBackend.flush();
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: ' + scope.tooltip.title);
      });

      it('should request custom template via $http only once', function() {
        $httpBackend.expectGET('custom').respond(200, '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        var elmBis = compileDirective('options-template');
        $httpBackend.flush();
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

  describe('standard placements', function() {
    var dimensions;

    beforeEach(inject (function (_dimensions_) {
      dimensions = _dimensions_;

      // Spy on the dimensions object so we can control the placement
      // and ensure things are calcing as we expect
      spyOn(dimensions, 'position').and.callFake(function () {
        return { top: 10, left: 10, height: 20, width: 100 };
      });
    }));

    it('should be placed off screen till its been positioned', function () {
      var elm = compileDirective('options-placement-top');
      angular.element(elm[0]).triggerHandler('mouseenter');

      var tip = sandboxEl.children('.tooltip');
      expect(tip[0].style.top).toBe('-9999px');
      expect(tip[0].style.left).toBe('-9999px');
    });

    it('should position the tooltip above the target when placement is `top`', function () {
      var elm = compileDirective('options-placement-top');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('-10px')
      expect(tipElement[0].style.left).toBe('35px')
    });

    it('should position the tooltip to the right of the target when placement is `right`', function () {
      var elm = compileDirective('options-placement-right');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('10px')
      expect(tipElement[0].style.left).toBe('110px')
    });

    it('should position the tooltip below the target when placement is `bottom`', function () {
      var elm = compileDirective('options-placement-bottom');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('30px')
      expect(tipElement[0].style.left).toBe('35px')
    });

    it('should position the tooltip to the left of the target when placement is `left`', function () {
      var elm = compileDirective('options-placement-left');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('10px')
      expect(tipElement[0].style.left).toBe('-40px')
    });

    it('should position the tooltip to the top-left of the target when placement is `top-left`', function () {
      var elm = compileDirective('options-placement-exotic-top-left');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('-10px')
      expect(tipElement[0].style.left).toBe('10px')
    });

    it('should position the tooltip to the top-right of the target when placement is `top-right`', function () {
      var elm = compileDirective('options-placement-exotic-top-right');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('-10px')
      expect(tipElement[0].style.left).toBe('60px')
    });

    it('should position the tooltip to the bottom-left of the target when placement is `bottom-left`', function () {
      var elm = compileDirective('options-placement-exotic-bottom-left');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('30px')
      expect(tipElement[0].style.left).toBe('10px')
    });

    it('should position the tooltip to the bottom-right of the target when placement is `bottom-right`', function () {
      var elm = compileDirective('options-placement-exotic-bottom-right');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('30px')
      expect(tipElement[0].style.left).toBe('60px')
    });
  });

  describe('auto placements', function() {
    var dimensions,
        $window

    beforeEach(inject (function (_dimensions_, _$window_) {
      dimensions = _dimensions_;
      $window = _$window_;
    }));

    it('should position the tooltip below the target when initial placement results in positioning off screen', function () {
      var elm = compileDirective('options-placement-auto-top');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(dimensions, 'position').and.callFake(function () {
        return { top: 10, right: 110, bottom: 30, left: 10, height: 20, width: 100 };
      });
      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('30px')
      expect(tipElement[0].style.left).toBe('35px')
    });

    it('should position the tooltip above the target when initial placement results in positioning off screen', function () {
      var elm = compileDirective('options-placement-auto-bottom');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(dimensions, 'position').and.callFake(function () {
        return { top: 10, right: 110, bottom: 30, left: 10, height: 20, width: 100 };
      });
      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('-10px')
      expect(tipElement[0].style.left).toBe('35px')
    });

    it('should position the tooltip to the right of the target when initial placement results in positioning off screen', function () {
      var elm = compileDirective('options-placement-auto-left');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(dimensions, 'position').and.callFake(function () {
        return { top: 10, right: 110, bottom: 30, left: 10, height: 20, width: 100 };
      });
      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('10px')
      expect(tipElement[0].style.left).toBe('110px')
    });

    it('should position the tooltip to the left of the target when initial placement results in positioning off screen', function () {
      var elm = compileDirective('options-placement-auto-right');
      angular.element(elm[0]).triggerHandler('mouseenter');

      spyOn(dimensions, 'position').and.callFake(function () {
        return { top: 10, right: 110, bottom: 30, left: 10, height: 20, width: 100 };
      });
      spyOn(angular.element.prototype, 'prop').and.callFake(function (prop) {
        if (prop === 'offsetWidth') return 50;
        if (prop === 'offsetHeight') return 20;
      });

      $$rAF.flush();

      var tipElement = sandboxEl.children('.tooltip');
      expect(tipElement[0].style.top).toBe('10px')
      expect(tipElement[0].style.left).toBe('-40px')
    });
  });
});
