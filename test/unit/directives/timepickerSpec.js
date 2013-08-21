'use strict';

describe('timepicker', function () {
  var scope, $sandbox, $compile, $timeout, $strapConfig;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$strapConfig_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
  $strapConfig = _$strapConfig_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
    scope.model = {};
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
    $('.bootstrap-timepicker').remove();
  });

  var templates = {
    'default': '<input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" bs-timepicker>',
    'addon': '<input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" bs-timepicker><span class="add-on" data-toggle="timepicker"><i class="icon-time"></i></span>',
    'date': '<input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" data-time-type="date" bs-timepicker>',
    'appendNoFocus': '<div class="input-append"><input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" data-time-type="date" bs-timepicker></div>',
    'appendWithFocus': '<div class="input-append"><input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" data-time-type="date" open-on-focus="true" bs-timepicker></div>'
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    template = $(template).appendTo($sandbox);
    return $compile(template)(scope);
  }

  // Tests

  it('should add "data-toggle" attr for you', function () {
    var elm = compileDirective();
    expect(elm.attr('data-toggle')).toBe('timepicker');
  });

  it('should correctly call $.fn.timepicker', function () {
    var old = $.fn.timepicker;
    var spy = angular.extend(spyOn($.fn, 'timepicker'), old).andCallThrough();
    var elm = compileDirective();
    expect(spy).toHaveBeenCalled();
  });

  it('should show the timepicker on click', function() {
    var elm = compileDirective();
    elm.trigger('click');
    expect(elm.data('timepicker').$widget.hasClass('open')).toBe(true);
  });

  it('should show the timepicker on focus', function() {
    var elm = compileDirective();
    elm.trigger('focus');
    expect(elm.data('timepicker').$widget.hasClass('open')).toBe(true);
  });

  it('should show the timepicker on [data-toggle="timepicker"] click', function() {
    var elm = compileDirective('addon');
    elm.next('[data-toggle="timepicker"]').trigger('click');
    expect(elm.data('timepicker').$widget.hasClass('open')).toBe(true);
  });

  it('should correctly update both input value and bound model for string type', function() {
    var elm = compileDirective();
    elm.trigger('focus');
    elm.data('timepicker').$widget.find('a[data-action="incrementHour"]').trigger('click');
    $timeout.flush();
    expect(elm.val()).toBe('01:00');
    expect(scope.model.time).toBe('01:00');
  });

  it('should correctly update both input value and bound model for date type', function() {
    var elm = compileDirective('date');
    elm.trigger('focus');
    elm.data('timepicker').$widget.find('a[data-action="incrementHour"]').trigger('click');
    $timeout.flush();
    expect(elm.val()).toBe('01:00');
    expect(scope.model.time).toMatch(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2} \d{4} 01:00:\d{2} GMT[-+]\d{4} \([A-Z]{3,4}\)/);
  });

  it('should not accept bad input', function() {
    var elm = compileDirective();
    elm.trigger('click');
    elm.val('bad');
    elm.trigger('blur');
    expect(elm.val()).toBe('00:00');
  });

  it('should not show widget on focus when inside input-append if openOnFocus is set to false', function() {
    var elm = compileDirective('appendNoFocus');
    var inputElm = $(elm.children('input')[0]);
    inputElm.trigger('focus');
    expect(inputElm.data('timepicker').$widget.hasClass('open')).toBe(false);
  });

  it('should show widget on focus when inside input-append if openOnFocus is set', function() {
    var elm = compileDirective('appendWithFocus');
    var inputElm = $(elm.children('input')[0]);
    inputElm.trigger('focus');
    expect(inputElm.data('timepicker').$widget.hasClass('open')).toBe(true);
  });
});
