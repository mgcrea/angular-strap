'use strict';
// global describe, it

describe('select', function () {
  var scope, $sandbox, $compile, $timeout, $httpBackend, $templateCache;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_, _$httpBackend_, _$templateCache_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $httpBackend = _$httpBackend_;
    $templateCache = _$templateCache_;

    $sandbox = angular.element('<div id="sandbox"></div>').appendTo('body');
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
  });

  var templates = {
    'default': {
      scope: {items: [{id: '1', name: 'foo'}, {id: '2', name: 'bar'}, {id: '3', name: 'baz'}], selectedItem: '2'},
      element: '<select ng-model="selectedItem" ng-options="value.id as value.name for (key, value) in items" bs-select ></select>'
    },
    'validate': {
      scope: {items: [{id: '1', name: 'foo'}, {id: '2', name: 'bar'}, {id: '3', name: 'baz'}], selectedItem: '2', isRequired: false},
      element: '<form name="testForm"><select name="mySelect" ng-model="selectedItem" ng-options="value.id as value.name for (key, value) in items" ng-required="isRequired" bs-select></select></form>'
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope);
    var $element = angular.element(template.element).appendTo($sandbox);
    $element = $compile(angular.element($element))(scope);
    scope.$digest(); // evaluate $evalAsync queue used by $q
    $timeout.flush();
    return $element;
  }

  describe('default template', function() {

    var elm, select, menu;
    beforeEach(function() {
      elm = compileDirective();
      select = elm.next('.bootstrap-select');
      menu = select.find('ul[role=menu]');
    });

    it('initialises bootstrap select on the element', function () {
      expect(select.length).toBe(1);
    });

    it('adds every item to the bootstrap select menu', function () {
      expect(menu.children().length).toBe(scope.items.length);
    });

    it('updates the bootstrap select menu when items are changed', function () {
      scope.items.push({id: '4', name: 'qux'});
      scope.$digest();
      expect(menu.children().length).toBe(scope.items.length);
    });

    it('selects the correct item by default', function () {
      expect(menu.find('.selected').text()).toBe('bar');
    });

    it('updates the scope when a new item is selected', function () {
      menu.find('li a').first().click();
      expect(scope.selectedItem).toBe('1');
    });

    it('updates bootstrap select when the model changes', function () {
      scope.selectedItem = '3';
      scope.$digest();
      expect(menu.find('.selected').text()).toBe('baz');
    });

    it('does not add ng-scope class to bootstrap select element', function () {
      expect(select.hasClass('ng-scope')).toBe(false);
    });

    it('updates bootstrap select when the option items change', function () {
      scope.items.push({id: '4', name: 'shock'});
      scope.selectedItem = '4';
      scope.$digest();
      expect(menu.find('.selected').text()).toBe('shock');
    });

    // it('adds new classes from original element when the model changes', function () {
    //   elm.addClass('dummy');
    //   scope.model.item = 1;
    //   scope.$digest();
    //   expect(select.hasClass('dummy')).toBe(true);
    // });

    // it('syncs classes removed from original element when the model changes', function () {
    //   element.addClass('dummy');
    //   scope.model.item = 1;
    //   scope.$digest();
    //   element.removeClass('dummy');
    //   scope.model.item = 2;
    //   scope.$digest();
    //   expect(select.hasClass('dummy')).toBe(false);
    // });

  });

  describe('validate template', function() {

    var elm, selectPicker, select, menu;
    beforeEach(function() {
      elm = compileDirective('validate');
      elm = elm.find('select');
      selectPicker = elm.next('.bootstrap-select');
      menu = selectPicker.find('ul[role=menu]');
      scope.$digest();
      select = scope.testForm.mySelect;
    });
    
    var expectValid = function(valid) {
      if (valid === undefined) {
        valid = true;
      }
      // Test the original select
      expect(elm.hasClass('ng-valid')).toBe(valid);
      expect(elm.hasClass('ng-valid-required')).toBe(valid);
      expect(elm.hasClass('ng-invalid')).toBe(!valid);
      expect(elm.hasClass('ng-invalid-required')).toBe(!valid);
      // Test the selectpicker
      expect(selectPicker.hasClass('ng-valid')).toBe(valid);
      expect(selectPicker.hasClass('ng-valid-required')).toBe(valid);
      expect(selectPicker.hasClass('ng-invalid')).toBe(!valid);
      expect(selectPicker.hasClass('ng-invalid-required')).toBe(!valid);
      // Test the NgModelController
      expect(select.$valid).toBe(valid);
      expect(select.$invalid).toBe(!valid);
    };

    it('should be a valid element in the form', function () {
      expect(select).toBeDefined();
      expect(select.$pristine).toBe(true);
      expect(select.$dirty).toBe(false);
      expectValid();
    });

    it('should set the selectPicker as required', function () {
      scope.isRequired = true;
      scope.$digest();
      expect(elm.attr('required')).toBe('required');
    });

    it('should be a valid element after a selection', function () {
      scope.isRequired = true;
      scope.selectedItem = '2';
      scope.$digest();
      expect(elm.attr('required')).toBe('required');
      expectValid();
    });

    it('should be an invalid element', function () {
      scope.isRequired = true;
      scope.selectedItem = undefined;
      scope.$digest();
      expect(elm.attr('required')).toBe('required');
      expectValid(false);
    });

    it('should become invalid when a selection is performed through click', function () {
      scope.isRequired = true;
      scope.selectedItem = undefined;
      scope.$digest();
      menu.find('li:nth-child(2) a').click();
      expect(scope.selectedItem).toBe('1');
      expectValid();
    });
    
  });


});