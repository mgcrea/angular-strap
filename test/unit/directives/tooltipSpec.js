'use strict';

describe('tooltip', function () {
  var elm, elm2, scope, $httpBackend, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function (_$httpBackend_, _$timeout_, $rootScope, $compile) {
    $httpBackend = _$httpBackend_,
    $timeout = _$timeout_,
    scope = $rootScope;

    scope.content = "World<br>Multiline Content<br>";

    elm = $compile(
      '<a class="btn" bs-tooltip="content" data-placement="left"></a>'
    )($rootScope);

    elm2 = $compile(
      '<a class="btn" bs-tooltip="content" data-unique="true" data-placement="left"></a>'
    )($rootScope);

  }));

  it('should initialize the tooltip', function () {
    expect(elm.data('tooltip')).toBeDefined();
    expect(elm.data('tooltip').options.title).toBe(scope.content);
  });

  it('should define a correct title', function() {
    elm.tooltip('show');
    expect(elm.data('tooltip').tip().find('.tooltip-inner').html()).toBe(scope.content);
  });

  it('should define the tooltip reference on the tip', function() {
    elm.tooltip('show');
    expect(elm.data('tooltip').tip().data('tooltip')).toBeDefined();
  });

  it('should show/hide the tooltip on hover', function() {
    elm.trigger('mouseenter');
    expect(elm.data('tooltip').tip().hasClass('in')).toBe(true);
    elm.trigger('mouseleave');
    expect(elm.data('tooltip').tip().hasClass('in')).toBe(false);
  });

  it('should support data-unique attribute', function(done) {
    elm.trigger('mouseenter');
    expect(elm.data('tooltip').tip().hasClass('in')).toBe(true);
    setTimeout(function() {
      elm2.trigger('mouseenter');
      expect(elm.data('tooltip').tip().hasClass('in')).toBe(false);
      done();
    }, 100);
  });

});
