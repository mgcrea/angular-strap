'use strict';

describe('select directive', function () {

  var fixture;
  var element;
  var currentScope;
  var bootstrapSelect;
  var menu;

  beforeEach(module('$strap.directives'));

  beforeEach(function () {
    var body = angular.element('body');
    fixture = angular.element('<div></div>');
    fixture.appendTo(body);
  });

  afterEach(function () {
    fixture.remove();
  });

  beforeEach(inject(function ($compile, $rootScope) {

    element = angular.element('<select bs-select ng-model="model.item" ng-options="i.id as i.name for i in items"></select>');
    element.appendTo(fixture);

    currentScope = $rootScope;

    $rootScope.model = {
      item: 2
    };

    $rootScope.items = [
      {
        id: 1,
        name: 'item 1'
      },
      {
        id: 2,
        name: 'item 2'
      }
    ];

    $compile(element)($rootScope, false);
    $rootScope.$digest();

    bootstrapSelect = element.siblings('.bootstrap-select');
    menu = bootstrapSelect.find('ul[role=menu]');

  }));

  it('initialises bootstrap select on the element', function () {
    expect(bootstrapSelect.length).toBe(1);
  });

  it('adds every item to the bootstrap select menu', function () {
    expect(menu.children().length).toBe(2);
  });

  it('updates the bootstrap select menu when items are changed', function () {

    currentScope.items.push({
      id: 3,
      name: 'item 3'
    });
    currentScope.$apply();

    expect(menu.children().length).toBe(3);
  });

  it('selects the correct item by default', function () {
    expect(menu.find('.selected').text()).toBe('item 2');
  });

  it('updates the scope when a new item is selected', function () {

    menu.find('li a').first().click();

    expect(currentScope.model.item).toBe(1);
  });

  it('updates bootstrap select when the model changes', function () {

    currentScope.model.item = 1;
    currentScope.$apply();

    expect(menu.find('.selected').text()).toBe('item 1');
  });

  it('does not add ng-scope class to bootstrap select element', function () {
    expect(bootstrapSelect.hasClass('ng-scope')).toBe(false);
  });

  it('adds new classes from original element when the model changes', function () {

    element.addClass('dummy');

    currentScope.model.item = 1;
    currentScope.$apply();

    expect(bootstrapSelect.hasClass('dummy')).toBe(true);
  });

  it('syncs classes removed from original element when the model changes', function () {

    element.addClass('dummy');

    currentScope.model.item = 1;
    currentScope.$apply();

    element.removeClass('dummy');

    currentScope.model.item = 2;
    currentScope.$apply();

    expect(bootstrapSelect.hasClass('dummy')).toBe(false);
  });

});
