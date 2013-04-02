'use strict';

describe('typeahead', function () {
  var scope, $sandbox, $compile, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
    $('.typeahead').remove();
  });

  var templates = {
    'default': {
      scope: {typeahead: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]},
      element: '<input type="text" class="span3" data-items="4" ng-model="typeaheadValue" bs-typeahead="typeahead">'
    },
    'minLength': {
      element: '<input type="text" class="span3" data-items="4" data-min-length="4" ng-model="typeaheadValue" bs-typeahead="typeahead">'
    },
    'minLength-0': {
      element: '<input type="text" class="span3" data-items="4" data-min-length="0" ng-model="typeaheadValue" bs-typeahead="typeahead">'
    }
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    angular.extend(scope, template.scope || templates['default'].scope);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    return $element;
  }

  // Tests

  it('should add "data-provide" attr for you', function () {
    var elm = compileDirective();
    expect(elm.attr('data-provide') === 'typeahead').toBe(true);
  });

  it('should correctly call $.fn.typeahead', function () {
    var old = $.fn.typeahead;
    var spy = angular.extend(spyOn($.fn, 'typeahead'), old).andCallThrough();
    var elm = compileDirective();
    expect(spy).toHaveBeenCalled();
  });

  it('should show the typeahead dropdown on keyup', function() {
    var elm = compileDirective();
    var $dropdown = $('body > .typeahead.dropdown-menu');
    expect($dropdown.attr('style')).toBeUndefined();
    elm.trigger('keyup');
    expect($dropdown.attr('style') !== '').toBe(true);
  });

  it('should show correctly limit dropdown to 4 items', function() {
    var elm = compileDirective();
    elm.val('a').trigger('keyup');
    var $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(4);
  });

  it('should show corretly set the value', function() {
    var elm = compileDirective();
    elm.val('a').trigger('keyup');
    var $dropdown = elm.next('.typeahead.dropdown-menu');
    $dropdown.find('li:first > a').trigger('click');
    expect(elm.val()).toBe('Alabama');
  });

  it('should show correctly handle source update', function() {
    var elm = compileDirective();
    scope.typeahead.push('Brazil');
    elm.val('brazil').trigger('keyup');
    var $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(1);
  });

  it('should show correctly handle source replace', function() {
    var elm = compileDirective();
    elm.val('a').trigger('keyup');
    var $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(4);
    scope.typeahead = ['Brazil'];
    scope.$digest();
    elm.val('brazil').trigger('keyup');
    $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(1);
    elm.val('a').trigger('keyup');
    $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(1);
  });

  it('should show correctly handle minLength attribute', function() {
    var elm = compileDirective('minLength');
    elm.val('a').trigger('keyup');
    var $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(0);
    elm.val('alab').trigger('keyup');
    $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(1);
  });

  it('should show correctly handle minLength=0 attribute', function() {
    var elm = compileDirective('minLength-0');
    elm.trigger('focus');
    var $dropdown = elm.next('.typeahead.dropdown-menu');
    expect($dropdown.children('li').length).toBe(0);
  });

});
