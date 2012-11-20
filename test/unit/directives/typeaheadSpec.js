'use strict';

describe('typeahead', function () {
	var elm, scope, $timeout;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, $compile, _$timeout_) {
		scope = $rootScope;
		$timeout = _$timeout_;

		scope.typeahead = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

		elm = $compile(
			'<input type="text" class="span3" data-items="4" ng-model="typeaheadValue" bs-typeahead="typeahead">'
		)($rootScope);
	}));

	it('should add "data-provide" attr for you', function () {
		expect(elm.attr('data-provide') == 'typeahead').toBe(true);
	});

	it('should show the typeahead dropdown on keyup', function() {
		elm.val('a').trigger('keyup');
		$timeout(function() {
			expect($('.typeahead.dropdown-menu').is(':visible')).toBe(true);
		});
	});

	it('should show correctly limit dropdown to 4 items', function() {
		elm.val('a').trigger('keyup');
		$timeout(function() {
			expect($('.typeahead.dropdown-menu > li').length).toBe(4);
		});
	});

	it('should show corretly set the value', function() {
		elm.val('a').trigger('keyup');
		$('.typeahead.dropdown-menu > li:first > a').trigger('click');
		$timeout(function() {
			expect(elm.val()).toBe('Alabama');
		});
	});


});
