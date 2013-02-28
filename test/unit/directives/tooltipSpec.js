'use strict';

describe('tooltip', function () {
  var scope, $sandbox, $compile, $timeout, $httpBackend;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($rootScope, _$compile_, _$timeout_, _$httpBackend_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      scope: {content: 'Hello World<br>Multiline Content<br>'},
      element: '<a class="btn" bs-tooltip="content" data-unique="true" data-placement="left"></a>'
    },
    'click': {
      element: '<a class="btn" bs-tooltip="content" data-trigger="click" data-placement="left"></a>'
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope || templates['default'].scope);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    return $element;
  }

  // Tests

  it('should initialize the tooltip', function () {
    var elm = compileDirective();
    expect(elm.data('tooltip')).toBeDefined();
    expect(typeof elm.data('tooltip').options.title).toBe('function');
  });

  it('should correctly call $.fn.tooltip', function () {
    var old = $.fn.tooltip;
    var spy = angular.extend(spyOn($.fn, 'tooltip'), old).andCallThrough();
    var elm = compileDirective();
    expect(spy).toHaveBeenCalled();
  });

  it('should define a correct title', function() {
    var elm = compileDirective();
    elm.tooltip('show');
    expect(elm.data('tooltip').tip().find('.tooltip-inner').html()).toBe(scope.content);
  });

  it('should show correctly handle title update/replace', function() {
    var elm = compileDirective();
    scope.content += 'Update';
    scope.$digest();
    elm.tooltip('show');
    expect(elm.data('tooltip').tip().find('.tooltip-inner').html()).toBe(scope.content);
    elm.tooltip('hide');
    scope.content = 'Replace';
    scope.$digest();
    elm.tooltip('show');
    expect(elm.data('tooltip').tip().find('.tooltip-inner').html()).toBe(scope.content);
  });

  it('should define the tooltip reference on the tip', function() {
    var elm = compileDirective();
    elm.tooltip('show');
    expect(elm.data('tooltip').tip().data('tooltip')).toBeDefined();
  });

  it('should show/hide the tooltip on hover', function() {
    var elm = compileDirective();
    elm.trigger('mouseenter');
    expect(elm.data('tooltip').tip().hasClass('in')).toBe(true);
    elm.trigger('mouseleave');
    expect(elm.data('tooltip').tip().hasClass('in')).toBe(false);
  });

  it('should support data-unique attribute', function() {
    var elm = compileDirective();
    var elm2 = compileDirective('click');
    elm2.trigger('click');
    expect(elm2.data('tooltip').tip().hasClass('in')).toBe(true);
    elm.trigger('mouseenter');
    expect(elm2.data('tooltip').tip().hasClass('in')).toBe(false);
  });

});
