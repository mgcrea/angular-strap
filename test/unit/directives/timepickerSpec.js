'use strict';

describe('timepicker', function () {
  var elm, scope, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function (_$timeout_, $injector, $rootScope, $compile) {
    $timeout = _$timeout_;
    scope = $rootScope;
    scope.model = {};
    elm = $compile(
      '<input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" bs-timepicker>'
    )($rootScope);
    //$timeout.flush();
  }));

  it('should correctly be loaded', function() {
    expect($.fn.timepicker).toBeDefined();
  });

  it('should add "data-toggle" attr for you', function () {
    expect(elm.attr('data-toggle')).toBe('timepicker');
  });

  // it('should show/hide the datepicker', function() {
  //   elm.timepicker('show');
  //   expect(elm.data('timepicker').$widget.hasClass('open')).toBe(true);
  //   elm.timepicker('hide');
  //   expect(elm.data('timepicker').$widget.hasClass('open')).toBe(false);
  // });

  it('should show the timepicker on click', function() {
    elm.trigger('click');
    expect(elm.data('timepicker').$widget.hasClass('open')).toBe(true);
  });

  it('should show the datepicker on focus', function() {
    elm.trigger('focus');
    expect(elm.data('timepicker').$widget.hasClass('open')).toBe(true);
    $('body').trigger('click');
    expect(elm.data('timepicker').$widget.hasClass('open')).toBe(false);
  });

  it('should correctly update both input value and bound model', function() {
    elm.trigger('focus');
    elm.data('timepicker').$widget.find('a[data-action="incrementHour"]').trigger('click');
    expect(elm.val()).toBe('01:00');
    expect(scope.model.time).toBe('01:00');
  });

});
