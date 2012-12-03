'use strict';

describe('timepicker', function () {
	var scope, $sandbox, $compile, $timeout;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
		scope = $rootScope;
		$compile = _$compile_;
		$timeout = _$timeout_;

		$sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
		scope.model = {};
	}));

	afterEach(function() {
		$sandbox.remove();
		scope.$destroy();
		$('.bootstrap-timepicker').remove();
	});

	var templates = {
		'default': '<input type="text" name="time" ng-model="model.time" data-default-time="false" data-show-meridian="false" bs-timepicker>'
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
		var spy = spyOn($.fn, 'timepicker');
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

	it('should correctly update both input value and bound model', function() {
		var elm = compileDirective();
		elm.trigger('focus');
		elm.data('timepicker').$widget.find('a[data-action="incrementHour"]').trigger('click');
		expect(elm.val()).toBe('01:00');
		expect(scope.model.time).toBe('01:00');
	});

});
