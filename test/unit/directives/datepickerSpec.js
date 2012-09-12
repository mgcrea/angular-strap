'use strict';

describe('datepicker', function () {
	var elm, scope, $timeout;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, $compile) {
		scope = $rootScope;
		elm = $compile(
			'<input type="text" ng-model="user.date" data-date-format="dd/mm/yyyy" bs-datepicker>'
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

});
