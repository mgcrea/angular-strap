'use strict';

describe('popover', function () {
	var elm, scope, $httpBackend, $timeout;

	beforeEach(module('$bs.directives'));

	beforeEach(inject(function (_$httpBackend_, _$timeout_, $rootScope, $compile) {
		$httpBackend = _$httpBackend_,
		$timeout = _$timeout_,
		scope = $rootScope;

		scope.name = "World";
		$httpBackend
				.expectGET('partials/popover.html')
				.respond('Hello {{name}}');

		elm = $compile(
			'<a class="btn" bs-popover="partials/popover.html" data-title="aTitle" data-placement="left"></a>'
		)($rootScope);
	}));

	beforeEach(function() {
		$httpBackend.flush();
		elm.data('popover').show();
		$timeout.flush();
	});

	it('should fetch the partial and build the popover', function () {
		expect(typeof elm.data('popover') != 'undefined').toBe(true);

		expect(typeof elm.data('popover').options.content == 'function').toBe(true);

		expect(elm.data('popover').options.content()).toBe('Hello {{name}}');
	});

	it('should define a correct title', function() {
		expect(elm.data('popover').tip().find('.popover-title').text()).toBe('aTitle');
	});

	it('should resolve scope variables in the external partial', function() {
		expect(elm.data('popover').tip().find('.popover-content').text()).toBe('Hello World');
	});

	it('should define the popover reference on the tip', function() {
		elm.data('popover').hide();
		elm.trigger('click'); // require 2.1.2-wip to go away
		expect(elm.data('popover')).toBe(elm.data('popover').tip().data('popover'));
	});

	it('should show/hide the popover on click', function() {
		elm.data('popover').hide();
		elm.trigger('click');
		expect(elm.data('popover').tip().hasClass('in')).toBe(true);
		elm.trigger('click');
		expect(elm.data('popover').tip().hasClass('in')).toBe(false);
	});
});
