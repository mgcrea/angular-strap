'use strict';

describe('modal', function () {
	var scope, $sandbox, $compile, $timeout, $httpBackend;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$httpBackend_) {
		scope = $rootScope;
		$compile = _$compile_;
		$timeout = _$timeout_;
		$httpBackend = _$httpBackend_;

		$sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
		scope.content = "World<br />Multiline Content<br />";
		scope.modal = 'Hello <span ng-bind-html-unsafe="content"></span>';

	}));

	afterEach(function() {
		$sandbox.remove();
		scope.$destroy();
		$('.modal-backdrop, .modal').remove();
	});

	var templates = {
		'default': '<a class="btn" bs-modal="\'partials/modal.html\'"></a>',
		'extra': '<a class="btn" bs-modal="\'partials/modal.html\'" data-backdrop="0" data-keyboard="0" data-modal-class="modal-wide"></a>',
		'cached': '<script type="text/ng-template" id="cached-modal">' + 'Hello <span ng-bind-html-unsafe="content"></span>' + '</script><a class="btn" bs-modal="\'cached-modal\'" data-unique="1" data-title="aTitleBis" data-placement="left"></a>'
	};

	function compileDirective(template, expectCache) {
		template = template ? templates[template] : templates['default'];
		template = $(template).appendTo($sandbox);
		if(!expectCache) { $httpBackend.expectGET('partials/modal.html').respond(scope.modal); }
		var elm = $compile(template)(scope);
		if(!expectCache) { $httpBackend.flush(); }
		scope.$digest(); // evaluate $evalAsync queue used by $q
		return elm;
	}

	// Tests

	it('should fetch the partial and build the modal', function () {
		var elm = compileDirective();
		expect(elm.attr('data-toggle')).toBe('modal');
		expect(elm.attr('href')).toBeDefined();
		var $modal = $(elm.attr('href'));
		expect($modal.hasClass('modal')).toBe(true);
		expect($modal.html()).toBe(scope.modal);
	});

	it('should handle extra attributes', function () {
		var elm = compileDirective('extra');
		var $modal = $(elm.attr('href'));
		expect($modal.attr('data-backdrop')).toBe('0');
		expect($modal.attr('data-keyboard')).toBe('0');
		expect($modal.hasClass('modal-wide')).toBe(true);
	});

	it('should fetch the partial from cache and build the modal', function () {
		compileDirective('cached', true);
		expect(scope.$$asyncQueue.length).toBe(0);
		var elm = $('a[bs-modal]');
		expect(elm.attr('href')).toBeDefined();
		var $modal = $(elm.attr('href'));
		expect($modal.hasClass('modal')).toBe(true);
		expect($modal.html()).toBe(scope.modal);
	});

	it('should correctly call $.fn.modal', function () {
		var spy = spyOn($.fn, 'modal').andCallThrough();
		var elm = compileDirective();
		elm.modal('show');
		expect(spy).toHaveBeenCalled();
	});

	it('should resolve scope variables in the external partial', function() {
		var elm = compileDirective();
		var $modal = $(elm.attr('href'));
		$modal.modal('show'); $timeout.flush();
		expect($modal.text()).toBe('Hello ' + scope.content.replace(/<br \/>/g, ''));
	});

	it('should show the modal on click', function(/*done*/) {
		var elm = compileDirective();
		var $modal = $(elm.attr('href'));
		expect($modal.hasClass('hide')).toBe(true);
		elm.trigger('click');
		/*setTimeout(function() {
			dump($('body').html());
			expect($modal.hasClass('in')).toBe(true); //@fixme
			expect($modal.hasClass('hide')).toBe(false); //@fixme
			done();
		}, 100);*/
	});

});
