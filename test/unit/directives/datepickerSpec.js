'use strict';

describe('datepicker', function () {
	var elm, scope, $timeout;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, $compile) {
		scope = $rootScope;
		scope.model = {};
		elm = $compile(
			'<input type="text" ng-model="model.date" data-date-format="yyyy/mm/dd" bs-datepicker>'
		)($rootScope);
	}));

	it('should add "data-toggle" attr for you', function () {
		expect(elm.attr('data-toggle') == 'datepicker').toBe(true);
	});

	it('should show/hide the datepicker', function() {
		elm.datepicker('show');
		expect(elm.data('datepicker').picker.is(':visible')).toBe(true);
		elm.datepicker('hide');
		expect(elm.data('datepicker').picker.is(':visible')).toBe(false);
	});

	it('should show the datepicker on click', function() {
		elm.trigger('click');
		expect(elm.data('datepicker').picker.is(':visible')).toBe(true);
	});

	it('should show the datepicker on focus', function() {
		elm.trigger('focusin');
		expect(elm.data('datepicker').picker.is(':visible')).toBe(true);
		elm.trigger('focusout');
		//expect(elm.data('datepicker').picker.is(':visible')).toBe(false);
	});

	it('should correctly update both input value and bound model', function() {
		var date = (new Date()).toISOString().substr(0, 10).replace(/-/g, '/');
		elm.trigger('focusin');
		$("body > .datepicker").find('td.active').trigger('click');
		elm.trigger('focusout');
		expect(elm.val()).toBe(date);
		expect(scope.model.date).toBe(date);
	});

});
