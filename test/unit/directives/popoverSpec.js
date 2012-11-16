'use strict';

if(dump) console = {log: dump};

describe('popover', function () {
	var elm, scope, $httpBackend, $timeout;

	beforeEach(module('$strap.directives'));

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

		$httpBackend.flush();
	}));

	it('should fetch the partial and build the popover', function () {
		expect(elm.data('popover')).toBeDefined();
		expect(typeof elm.data('popover').options.content == 'function').toBe(true);
		expect(elm.data('popover').options.content()).toBe('Hello {{name}}');
	});

	it('should define a correct title', function() {
		elm.popover('show'); $timeout.flush();
		expect(elm.data('popover').tip().find('.popover-title').text()).toBe('aTitle');
	});

	it('should resolve scope variables in the external partial', function() {
		elm.popover('show'); $timeout.flush();
		expect(elm.data('popover').tip().find('.popover-content').text()).toBe('Hello World');
	});

	it('should define the popover reference on the tip', function() {
		elm.trigger('click');
		expect(elm.data('popover').tip().data('popover')).toBeDefined();
		//expect(elm.data('popover')).toBe(elm.data('popover').tip().data('popover'));
	});

	it('should show/hide the popover on click', function() {
		elm.trigger('click');
		expect(elm.data('popover').tip().hasClass('in')).toBe(true);
		elm.trigger('click');
		expect(elm.data('popover').tip().hasClass('in')).toBe(false);
	});
});
