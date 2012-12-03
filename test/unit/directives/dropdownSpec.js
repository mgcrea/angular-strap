'use strict';

describe('dropdown', function () {
	var scope, $sandbox, $compile, $timeout;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
		scope = $rootScope;
		$compile = _$compile_;
		$timeout = _$timeout_;

		$sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
		scope.items = [
			{text: 'Another action', href:"#anotherAction"},
			{text: 'Something else here', href:"#"},
			{divider: true},
			{text: 'Separated link', href:"#",
			submenu: [
				{text: 'Second level link', href: "#"},
				{text: 'Second level link 2', href: "#", submenu: [
					{text: 'Second level link', href: "#"},
					{text: 'Second level link 2', href: "#"}
				]}
			]}
		];
	}));

	afterEach(function() {
		$sandbox.remove();
		scope.$destroy();
	});

	var templates = {
		'default': '<button type="button" href="#" class="dropdown btn" bs-dropdown="items">Dropdown <b class="caret"></b></button>'
	};

	function compileDirective(template) {
		template = template ? templates[template] : templates['default'];
		template = $(template).appendTo($sandbox);
		return $compile(template)(scope);
	}

	// Tests

	it('should add "data-toggle" attr & "dropdown-toggle" class for you', function () {
		var elm = compileDirective();
		expect(elm.attr('data-toggle')).toBe('dropdown');
		expect(elm.hasClass('dropdown-toggle')).toBe(true);
	});

	it('should correctly append dropdown ul element', function() {
		var elm = compileDirective();
		var ul = elm.next('ul');
		expect(ul.length).toBe(1);
		expect(ul.attr('class')).toBe('dropdown-menu ng-scope');
		expect(ul.html()).toBe('<!-- ngRepeat: item in items -->');
	});

	it('should correctly support nested views', function(/*done*/) {
		var elm = compileDirective();
		var ul = elm.next('ul');
		/*elm.trigger('click');
		setTimeout(function() {
			dump($('body').html());
			done();
		}, 500);*/
	});

});
