'use strict';
/* global countScopes */

describe('tooltip', function() {

  var bodyEl = $('body'), sandboxEl;
  var $rootScope, $compile, $templateCache, $$rAF, $animate, $timeout, $httpBackend, $tooltip, scope;

  beforeEach(module('ngSanitize'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('mgcrea.ngStrap.tooltip'));

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $templateCache = $injector.get('$templateCache');
    $$rAF = $injector.get('$$rAF');
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function() {
      flush.call($animate); if(!$animate.triggerCallbacks) $timeout.flush();
    };
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
      element: '<a data-placement="top" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-right': {
      element: '<a data-placement="right" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-bottom': {
      element: '<a data-placement="bottom" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-left': {
      element: '<a data-placement="left" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-top-left': {
      element: '<a data-placement="top-left" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-top-right': {
      element: '<a data-placement="top-right" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-bottom-left': {
      element: '<a data-placement="bottom-left" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-bottom-right': {
      element: '<a data-placement="bottom-right" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-right-top': {
      element: '<a data-placement="right-top" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-right-bottom': {
      element: '<a data-placement="right-bottom" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-left-top': {
      element: '<a data-placement="left-top" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-exotic-left-bottom': {
      element: '<a data-placement="left-bottom" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto': {
      element: '<a data-placement="auto" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-top': {
      element: '<a data-placement="auto top" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-right': {
      element: '<a data-placement="auto right" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-bottom': {
      element: '<a data-placement="auto bottom" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-left': {
      element: '<a data-placement="auto left" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-exotic-top-left': {
      element: '<a data-placement="auto top-left" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-exotic-top-right': {
      element: '<a data-placement="auto top-right" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-exotic-bottom-left': {
      element: '<a data-placement="auto bottom-left" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-auto-exotic-bottom-right': {
      element: '<a data-placement="auto bottom-right" bs-tooltip="tooltip" data-viewport="null">hover me</a>'
    },
    'options-placement-viewport-top': {
      element: '<a data-placement="top" bs-tooltip="tooltip" data-viewport="\'#sandbox\'">hover me</a>'
    },
    'options-placement-viewport-right': {
      element: '<a data-placement="right" bs-tooltip="tooltip" data-viewport="\'#sandbox\'">hover me</a>'
    },
    'options-placement-viewport-bottom': {
      element: '<a data-placement="bottom" bs-tooltip="tooltip" data-viewport="\'#sandbox\'">hover me</a>'
    },
    'options-placement-viewport-left': {
      element: '<a data-placement="left" bs-tooltip="tooltip" data-viewport="\'#sandbox\'">hover me</a>'
    },
    'options-placement-viewport-padding': {
      element: '<a data-placement="right" bs-tooltip="tooltip" data-viewport="{ selector: \'#sandbox\', padding: 10 }">hover me</a>'
    },
    'options-placement-viewport-exotic': {
      element: '<a data-placement="bottom-right" bs-tooltip="tooltip" data-viewport="{ selector: \'#sandbox\', padding: 10 }">hover me</a>'
    },
    'options-trigger': {
      element: '<a data-trigger="click" bs-tooltip="tooltip">click me</a>'
    },
    'options-trigger-contextmenu': {
      element: '<a data-trigger="contextmenu" bs-tooltip="tooltip">right-click me</a>'
    },
    'options-html': {
      scope: {tooltip: {title: 'title<br>next'}},
      element: '<a data-html="{{html}}" bs-tooltip="tooltip">hover me</a>'
    },
    'options-container': {
      element: '<a data-container="{{container}}" bs-tooltip="tooltip">hover me</a>'
    },
    'options-template': {
      scope: {tooltip: {title: 'Hello Tooltip!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{tooltip.title}}" data-template-url="custom" bs-tooltip>hover me</a>'
    },
    'options-titleTemplate': {
      scope: {tooltip: {title: 'Hello Tooltip!', counter: 0}, items: ['foo', 'bar', 'baz']},
      element: '<a title="{{tooltip.title}}" data-title-template="custom" bs-tooltip>hover me</a>'
    },
    'options-events': {
      scope: {onShow: function(tooltip) {}, onBeforeShow: function(tooltip) {}, onHide: function(tooltip) {}, onBeforeHide: function(tooltip) {}},
      element: '<a data-bs-on-show="onShow" data-bs-on-before-show="onBeforeShow" data-bs-on-hide="onHide" data-bs-on-before-hide="onBeforeHide" bs-tooltip>hover me</a>'
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
    },
    'bsTooltip-ngDisabled': {
      scope: {tooltip: {title: 'Hello Tooltip!'}, isDisabled: false},
      element: '<a title="{{tooltip.title}}" bs-tooltip ng-disabled="isDisabled">hover me</a>'
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
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should close on mouseleave', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support scope as object', function() {
      var elm = compileDirective('markup-scope');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.items[0].tooltip);
    });

    it('should support button markup', function() {
      var elm = compileDirective('markup-button');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('click');
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should close when element becomes disabled', function() {
      var elm = compileDirective('bsTooltip-ngDisabled');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      scope.isDisabled = true;
      scope.$digest();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should NOT stopPropagation on mousedown if mouseDownStopPropagation is false', function() {
      var elm = compileDirective('markup-button');
      var myTooltip = $tooltip(elm, {mouseDownStopPropagation: false, trigger: 'focus'});
      scope.$digest();
      var evt = jQuery.Event('mousedown');
      spyOn(evt, 'stopPropagation');
      myTooltip.$onFocusElementMouseDown(evt);
      expect(evt.stopPropagation).not.toHaveBeenCalled();
    });

    it('should NOT preventDefault on mousedown if mouseDownPreventDefault is false', function() {
      var elm = compileDirective('markup-button');
      var myTooltip = $tooltip(elm, {mouseDownPreventDefault: false, trigger: 'focus'});
      scope.$digest();
      var evt = jQuery.Event('mousedown');
      spyOn(evt, 'preventDefault');
      myTooltip.$onFocusElementMouseDown(evt);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });

  });

  describe('resource allocation', function() {
    it('should not create additional scopes after first show', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('mouseleave');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(0);

      var scopeCount = countScopes(scope, 0);

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.flush();
        angular.element(elm[0]).triggerHandler('mouseleave');
        $animate.flush();
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
        $animate.flush();
        angular.element(elm[0]).triggerHandler('mouseleave');
        $animate.flush();
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
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should open on mouseenter when enabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should close on mouseleave when enabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should not open on mouseenter when disabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding', { isEnabled: false });
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should close on mouseleave when disabled', function() {
      var elm = compileDirective('bsEnabled-attr-binding');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
      scope.isEnabled = false;
      scope.$digest();
      angular.element(elm[0]).triggerHandler('mouseleave');
      expect(sandboxEl.children('.tooltip').length).toBe(0);
    });

    it('should support undefined value', function() {
      var elm = compileDirective('bsEnabled-attr-binding', { isEnabled: undefined });
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.children('.tooltip').length).toBe(1);
    });

    it('should support string values', function() {
      var elm = compileDirective('bsEnabled-attr-binding', { isEnabled: 'true' });
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
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
      $animate.flush();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.tooltip.title);
    });

    it('should support string value from within ngRepeat markup', function() {
      var elm = compileDirective('bsTooltip-ngRepeat-string');
      angular.element(elm.find('[bs-tooltip]')).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe(scope.items[0].tooltip);
    });

    it('should overwrite inherited title when no value specified', function() {
      var elm = compileDirective('bsTooltip-noValue');
      angular.element(elm[0]).triggerHandler('mouseenter');
      $animate.flush();
      expect(sandboxEl.find('.tooltip-inner').html()).toBe('');
    });

  });

  describe('using service', function() {

    it('should correctly open on next digest', function() {
      var myTooltip = $tooltip(sandboxEl, templates['default'].scope.tooltip);
      scope.$digest();
      expect(bodyEl.children('.tooltip').length).toBe(0);
      myTooltip.show();
      $animate.flush();
      expect(bodyEl.children('.tooltip').length).toBe(1);
      myTooltip.hide();
      expect(bodyEl.children('.tooltip').length).toBe(0);
    });

    it('should open if option show is true', function() {
      var options = angular.extend({ show: true }, templates['default'].scope.tooltip);
      var myTooltip = $tooltip(sandboxEl, options);
      scope.$digest();
      $animate.flush();
      expect(bodyEl.children('.tooltip').length).toBe(1);
      myTooltip.hide();
      scope.$digest();
      $animate.flush();
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
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('tooltip.show', myTooltip);
    });

    it('should invoke show and beforeShow event callbacks', function() {
      var myTooltip = $tooltip(sandboxEl, {
        onShow: function(tooltip) {},
        onBeforeShow: function(tooltip) {}
      });
      var onBeforeShow = spyOn(myTooltip.$options, 'onBeforeShow');
      var onShow = spyOn(myTooltip.$options, 'onShow');
      myTooltip.$scope.$digest();
      myTooltip.show();

      expect(onBeforeShow).toHaveBeenCalledWith(myTooltip);
      // show only fires AFTER the animation is complete
      expect(onShow).not.toHaveBeenCalledWith(myTooltip);
      $animate.flush();
      expect(onShow).toHaveBeenCalledWith(myTooltip);
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
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('tooltip.hide', myTooltip);
    });

    it('should invoke hide and beforeHide event callbacks', function() {
      var myTooltip = $tooltip(sandboxEl, {
        onHide: function(tooltip) {},
        onBeforeHide: function(tooltip) {}
      });
      var onBeforeHide = spyOn(myTooltip.$options, 'onBeforeHide');
      var onHide = spyOn(myTooltip.$options, 'onHide');
      myTooltip.$scope.$digest();
      myTooltip.show();
      myTooltip.hide();

      expect(onBeforeHide).toHaveBeenCalledWith(myTooltip);
      // show only fires AFTER the animation is complete
      expect(onHide).not.toHaveBeenCalledWith(myTooltip);
      $animate.flush();
      expect(onHide).toHaveBeenCalledWith(myTooltip);
    });

    describe('onBeforeShow', function() {

      it('should invoke beforeShow event callback', function() {
        var beforeShow = false;

        function onBeforeShow(select) {
          beforeShow = true;
        }

        var elm = compileDirective('options-events', {onBeforeShow: onBeforeShow});

        angular.element(elm[0]).triggerHandler('mouseenter');

        expect(beforeShow).toBe(true);
      });
    });

    describe('onShow', function() {

      it('should invoke show event callback', function() {
        var show = false;

        function onShow(select) {
          show = true;
        }

        var elm = compileDirective('options-events', {onShow: onShow});

        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.flush();

        expect(show).toBe(true);
      });
    });

    describe('onBeforeHide', function() {

      it('should invoke beforeHide event callback', function() {
        var beforeHide = false;

        function onBeforeHide(select) {
          beforeHide = true;
        }

        var elm = compileDirective('options-events', {onBeforeHide: onBeforeHide});

        angular.element(elm[0]).triggerHandler('mouseenter');
        angular.element(elm[0]).triggerHandler('blur');

        expect(beforeHide).toBe(true);
      });
    });

    describe('onHide', function() {

      it('should invoke show event callback', function() {
        var hide = false;

        function onHide(select) {
          hide = true;
        }

        var elm = compileDirective('options-events', {onHide: onHide});

        angular.element(elm[0]).triggerHandler('mouseenter');
        angular.element(elm[0]).triggerHandler('blur');
        $animate.flush();

        expect(hide).toBe(true);
      });
    });

    it('should namespace show/hide events using the prefixEvent', function() {
      var myTooltip = $tooltip(sandboxEl, angular.extend({prefixEvent: 'datepicker'}, templates['default'].scope.tooltip));
      var emit = spyOn(myTooltip.$scope, '$emit');
      scope.$digest();
      myTooltip.show();
      myTooltip.hide();
      $animate.flush();

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
        $animate.flush();

        expect(sandboxEl.children('.tooltip').length).toBe(0);
        setTimeout(function() {
          expect(sandboxEl.children('.tooltip').length).toBe(1);
          done();
        }, 20);
      });

      it('should support multiple delay', function(done) {
        var elm = compileDirective('options-delay-multiple');
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.flush();

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

          // need to change the width and height so we don't trigger
          // the repositioning
          sandboxEl.children('.tooltip').css({ width: 0, height: 0 });

          $$rAF.flush();
          expect(sandboxEl.children('.tooltip').hasClass('top')).toBeTruthy();
        });

        it('should remove `auto` from exotic placements when auto positioning', function () {
          var elm = compileDirective('options-placement-auto-exotic-top-left');
          angular.element(elm[0]).triggerHandler('mouseenter');

          // need to change the width and height so we don't trigger
          // the repositioning
          sandboxEl.children('.tooltip').css({ width: 0, height: 0 });

          $$rAF.flush();
          expect(sandboxEl.children('.tooltip').hasClass('bottom-right')).toBeTruthy();
        });

        it('should default to `top` when `auto` placement is set without a preference', function () {
          var elm = compileDirective('options-placement-auto');
          angular.element(elm[0]).triggerHandler('mouseenter');

          // need to change the width and height so we don't trigger
          // the repositioning
          sandboxEl.children('.tooltip').css({ width: 0, height: 0 });

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

      it('should support a contextmenu trigger', function() {
        var elm = compileDirective('options-trigger-contextmenu');
        expect(sandboxEl.children('.tooltip').length).toBe(0);
        angular.element(elm[0]).triggerHandler('contextmenu');
        expect(sandboxEl.children('.tooltip').length).toBe(1);
        angular.element(elm[0]).triggerHandler('contextmenu');
        expect(sandboxEl.children('.tooltip').length).toBe(0);
      });
    });

    describe('html', function() {

      it('should not compile inner content by default', function() {
        var elm = compileDirective('default', {tooltip: {title: 'title<br>next'}});
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').html()).not.toBe('title<br>next');
      });

      it('should compile inner content if html is truthy', function() {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').html()).toBe('title<br>next');
      });

      it('should NOT compile inner content if html is false', function() {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').html()).not.toBe('title<br>next');
      });


    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: ' + scope.tooltip.title);
      });

      it('should support custom template loaded by ngInclude', function() {
        $templateCache.put('custom', [200, '<div class="tooltip"><div class="tooltip-inner">foo: {{title}}</div></div>', {}, 'OK']);
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

    describe('titleTemplate', function() {

      it('should support custom titleTemplate', function() {
        $templateCache.put('custom', 'foo: {{title}}');
        var elm = compileDirective('options-titleTemplate');
        angular.element(elm[0]).triggerHandler('mouseenter');
         expect(sandboxEl.find('.tooltip-inner').text()).toBe('foo: ' + scope.tooltip.title);
      });

    });

    describe('container', function() {
      it('accepts element object', function() {
        var testElm = angular.element('<div></div>');
        sandboxEl.append(testElm);
        var myTooltip = $tooltip(sandboxEl, angular.extend({}, templates['default'].scope.tooltip, {container: testElm}));
        scope.$digest();
        myTooltip.show();
        $animate.flush();
        expect(angular.element(testElm.children()[0]).hasClass('tooltip')).toBeTruthy();
      });

      it('should be contained by element specified in data-container', function() {
        var testElm = angular.element('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.tooltip, {container: '#testElm'}));
        expect(testElm.children('.tooltip').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.flush();
        expect(testElm.children('.tooltip').length).toBe(1);
      });

      it('should belong to sandbox when data-container is falsy', function() {
        var elm = compileDirective('options-container', angular.extend({}, templates['default'].scope.tooltip, {container: 'false'}));
        expect(sandboxEl.children('.tooltip').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        $animate.flush();
        expect(sandboxEl.children('.tooltip').length).toBe(1);
      });

    });

    describe('viewport', function () {
      it('should default the viewport to body with a padding of 0 when not set', function () {
        var myTooltip = $tooltip(sandboxEl, {});
        var tipOptions = myTooltip.$options;

        expect(tipOptions.viewport.selector).toBe('body');
        expect(tipOptions.viewport.padding).toBe(0);
      });

      it('should support using an element', function () {
        var myViewport = angular.element(document.createElement('div'));
        var myTooltip = $tooltip(sandboxEl, { viewport: myViewport });
        var tipOptions = myTooltip.$options;

        expect(tipOptions.viewport).toBe(myViewport);
      });

      it('should support specifying a selector and padding', function () {
        var myViewport = { selector: '#someSelector', padding: 100 };
        var myTooltip = $tooltip(sandboxEl, { viewport: myViewport });
        var tipOptions = myTooltip.$options;

        expect(tipOptions.viewport.selector).toBe('#someSelector');
        expect(tipOptions.viewport.padding).toBe(100);
      });
    });
  });

  describe('placements', function () {
    function calculatePlacements(placements, styleEl) {
      if (styleEl) {
        bodyEl.append(styleEl);
      }

      for (var placement in placements) {
        var elm = compileDirective(placement);
        angular.element(elm[0]).triggerHandler('mouseenter');

        // Find the tip in the sandbox and grab it's
        // top and left styles
        var tipElement = sandboxEl.children('.tooltip')[0];
        placements[placement] = {
          top: tipElement.style.top,
          left: tipElement.style.left,
        };

        // Clear the sandbox after we've rendered
        // each tooltip
        sandboxEl.html('');
      }
      if (styleEl) {
        styleEl.remove();
      }

      return placements;
    }

    var standardPlacements,
        autoPlacements,
        viewportPlacements;

    beforeEach(function () {
      var styleEl = $('<style>' +
                      '    body { padding: 0; margin: 0; } ' +
                      '    #sandbox { height: 100px; width: 100px; } ' +
                      '    a { display: inline-block; height: 20px; width: 20px; } ' +
                      '    .tooltip { height: 100px; width: 200px; position: absolute; } ' +  // Tooltip is purposely bigger than sandbox to trigger auto placement
                      '</style>');

      standardPlacements = calculatePlacements({
        'options-placement-top': {},
        'options-placement-right': {},
        'options-placement-bottom': {},
        'options-placement-left': {},
        'options-placement-exotic-top-left': {},
        'options-placement-exotic-top-right': {},
        'options-placement-exotic-bottom-left': {},
        'options-placement-exotic-bottom-right': {},
        'options-placement-exotic-right-top': {},
        'options-placement-exotic-right-bottom': {},
        'options-placement-exotic-left-top': {},
        'options-placement-exotic-left-bottom': {}
      }, styleEl);

      autoPlacements = calculatePlacements({
        'options-placement-auto-top': {},
        'options-placement-auto-right': {},
        'options-placement-auto-bottom': {},
        'options-placement-auto-left': {},
        'options-placement-auto-exotic-top-left': {},
        'options-placement-auto-exotic-top-right': {},
        'options-placement-auto-exotic-bottom-left': {},
        'options-placement-auto-exotic-bottom-right': {}
      }, styleEl);

      // Change the style for viewport testing
      styleEl = $('<style>' +
                  '    body { padding: 0; margin: 0; } ' +
                  '    #sandbox { height: 200px; width: 200px; position: absolute; top: 100px; left: 100px; } ' +
                  '    a { display: inline-block; height: 20px; width: 20px; position: absolute; } ' +
                  '    .tooltip { height: 100px; width: 100px; position: absolute; } ' +
                  '    a[data-placement="top"] { bottom: 0; left: 0; } ' +
                  '    a[data-placement="right"] { top: 0; left: 0; } ' +
                  '    a[data-placement="bottom"] { top: 0; right: 0; } ' +
                  '    a[data-placement="left"] { bottom: 0; right: 0; } ' +
                  '</style>');

      viewportPlacements = calculatePlacements({
        'options-placement-viewport-top': {},
        'options-placement-viewport-right': {},
        'options-placement-viewport-bottom': {},
        'options-placement-viewport-left': {},
        'options-placement-viewport-padding': {},
        'options-placement-viewport-exotic': {}
      }, styleEl);
    });

    describe('default placement', function () {
      it('should be placed off screen till its been positioned', inject(function (dimensions) {
        // Spy on setOffset and make it do nothing.  That way
        // the initial position is maintained.
        spyOn(dimensions, 'setOffset').and.callFake(function () {});

        var elm = compileDirective('options-placement-top');
        angular.element(elm[0]).triggerHandler('mouseenter');

        var tip = sandboxEl.children('.tooltip')[0];
        expect(tip.style.top).toBe('-9999px');
        expect(tip.style.left).toBe('-9999px');
      }));

      it('should have the correct width when right:0 is previously set for the tooltip', inject(function (dimensions) {
        bodyEl.append('<style>' +
                      '    .tooltip { position: absolute; right: 0; } ' +
                      '</style>');

        var elm = compileDirective('options-placement-top');
        angular.element(elm[0]).triggerHandler('mouseenter');

        var tip = sandboxEl.children('.tooltip')[0];
        expect(tip.offsetWidth <= 500).toBe(true);
      }));
    });

    describe('standard placements', function() {
      it('should position the tooltip above the target when placement is `top`', function () {
        var placement = standardPlacements['options-placement-top'];

        expect(placement.top).toBe('-100px');
        expect(placement.left).toBe('-90px');
      });

      it('should position the tooltip to the right of the target when placement is `right`', function () {
        var placement = standardPlacements['options-placement-right'];

        expect(placement.top).toBe('-40px');
        expect(placement.left).toBe('20px');
      });

      it('should position the tooltip below the target when placement is `bottom`', function () {
        var placement = standardPlacements['options-placement-bottom'];

        expect(placement.top).toBe('20px');
        expect(placement.left).toBe('-90px');
      });

      it('should position the tooltip to the left of the target when placement is `left`', function () {
        var placement = standardPlacements['options-placement-left'];

        expect(placement.top).toBe('-40px');
        expect(placement.left).toBe('-200px');
      });

      it('should position the tooltip to the top-left of the target when placement is `top-left`', function () {
        var placement = standardPlacements['options-placement-exotic-top-left'];

        expect(placement.top).toBe('-100px');
        expect(placement.left).toBe('0px');
      });

      it('should position the tooltip to the top-right of the target when placement is `top-right`', function () {
        var placement = standardPlacements['options-placement-exotic-top-right'];

        expect(placement.top).toBe('-100px');
        expect(placement.left).toBe('-180px');
      });

      it('should position the tooltip to the bottom-left of the target when placement is `bottom-left`', function () {
        var placement = standardPlacements['options-placement-exotic-bottom-left'];

        expect(placement.top).toBe('20px');
        expect(placement.left).toBe('0px');
      });

      it('should position the tooltip to the bottom-right of the target when placement is `bottom-right`', function () {
        var placement = standardPlacements['options-placement-exotic-bottom-right'];

        expect(placement.top).toBe('20px');
        expect(placement.left).toBe('-180px');
      });

      it('should position the tooltip to the left-top of the target when placement is `left-top`', function () {
        var placement = standardPlacements['options-placement-exotic-left-top'];

        expect(placement.top).toBe('-80px');
        expect(placement.left).toBe('-200px');
      });

      it('should position the tooltip to the left-bottom of the target when placement is `left-bottom`', function () {
        var placement = standardPlacements['options-placement-exotic-left-bottom'];

        expect(placement.top).toBe('0px');
        expect(placement.left).toBe('-200px');
      });

      it('should position the tooltip to the right-top of the target when placement is `right-top`', function () {
        var placement = standardPlacements['options-placement-exotic-right-top'];

        expect(placement.top).toBe('-80px');
        expect(placement.left).toBe('20px');
      });

      it('should position the tooltip to the right-bottom of the target when placement is `right-bottom`', function () {
        var placement = standardPlacements['options-placement-exotic-right-bottom'];

        expect(placement.top).toBe('0px');
        expect(placement.left).toBe('20px');
      });
    });

    describe('auto placements', function () {
      it('should position the tooltip below the target when initial placement results in positioning outside its container', function () {
        var autoTop = autoPlacements['options-placement-auto-top'];
        var bottom = standardPlacements['options-placement-bottom'];

        // top is offscreen, so it should swap to bottom and match the standard bottom
        expect(autoTop.top).toBe(bottom.top);
        expect(autoTop.left).toBe(bottom.left)
      });

      it('should position the tooltip to the left of the target when initial placement results in positioning outside its container', function () {
        var autoRight = autoPlacements['options-placement-auto-right'];
        var left = standardPlacements['options-placement-left'];

        // right is offscreen, so it should swap to left and match the standard left
        expect(autoRight.top).toBe(left.top);
        expect(autoRight.left).toBe(left.left)
      });

      it('should position the tooltip above the target when initial placement results in positioning outside its container', function () {
        var autoBottom = autoPlacements['options-placement-auto-bottom'];
        var top = standardPlacements['options-placement-top'];

        // bottom is offscreen, so it should swap to top and match the standard top
        expect(autoBottom.top).toBe(top.top);
        expect(autoBottom.left).toBe(top.left)
      });

      it('should position the tooltip to the right of the target when initial placement results in positioning outside its container', function () {
        var autoLeft = autoPlacements['options-placement-auto-left'];
        var right = standardPlacements['options-placement-right'];

        // left is offscreen, so it should swap to right and match the standard right
        expect(autoLeft.top).toBe(right.top);
        expect(autoLeft.left).toBe(right.left)
      });

      it('should position the tooltip to the bottom-left of the target when initial placement results in positioning outside its container', function () {
        var autoTopRight = autoPlacements['options-placement-auto-exotic-top-right'];
        var bottomLeft = standardPlacements['options-placement-exotic-bottom-left'];

        // should swap to bottom-left and match the standard bottom-left
        expect(autoTopRight.top).toBe(bottomLeft.top);
        expect(autoTopRight.left).toBe(bottomLeft.left)
      });

      it('should position the tooltip to the bottom-right of the target when initial placement results in positioning outside its container', function () {
        var autoTopLeft = autoPlacements['options-placement-auto-exotic-top-left'];
        var bottomRight = standardPlacements['options-placement-exotic-bottom-right'];

        // should swap to bottom-right and match the standard bottom-right
        expect(autoTopLeft.top).toBe(bottomRight.top);
        expect(autoTopLeft.left).toBe(bottomRight.left)
      });

      it('should position the tooltip to the top-left of the target when initial placement results in positioning outside its container', function () {
        var autoBottomRight = autoPlacements['options-placement-auto-exotic-bottom-right'];
        var topLeft = standardPlacements['options-placement-exotic-top-left'];

        // should swap to top-left and match the standard top-left
        expect(autoBottomRight.top).toBe(topLeft.top);
        expect(autoBottomRight.left).toBe(topLeft.left)
      });

      it('should position the tooltip to the top-left of the target when initial placement results in positioning outside its container', function () {
        var autoBottomLeft = autoPlacements['options-placement-auto-exotic-bottom-left'];
        var topRight = standardPlacements['options-placement-exotic-top-right'];

        // should swap to top-right and match the standard top-right
        expect(autoBottomLeft.top).toBe(topRight.top);
        expect(autoBottomLeft.left).toBe(topRight.left)
      });
    });

    describe('viewport placements', function () {
      it('should shift down when positioning results in being outsie of the viewport', function () {
        var right = viewportPlacements['options-placement-viewport-right'];

        expect(right.top).toBe('0px');
        expect(right.left).toBe('20px');
      });

      it('should shift left when positioning results in being outside of the viewport', function () {
        var bottom = viewportPlacements['options-placement-viewport-bottom'];

        expect(bottom.top).toBe('20px');
        expect(bottom.left).toBe('100px');
      });

      it('should shift right when positioning results in being outside of the viewport', function () {
        var top = viewportPlacements['options-placement-viewport-top'];

        expect(top.top).toBe('80px');
        expect(top.left).toBe('0px');
      });

      it('should shift up when positioning results in being outside of the viewport', function () {
        var top = viewportPlacements['options-placement-viewport-left'];

        expect(top.top).toBe('100px');
        expect(top.left).toBe('80px');
      });

      it('should use the padding to position the tooltip from the edge of the viewport', function () {
        var padding = viewportPlacements['options-placement-viewport-padding'];

        expect(padding.top).toBe('10px');
        expect(padding.left).toBe('20px');
      });

      it('should ignore exotic placements', function () {
        var exotic = viewportPlacements['options-placement-viewport-exotic'];

        expect(exotic.top).toBe('20px');
        expect(exotic.left).toBe('-80px');
      });
    });
  });
});
