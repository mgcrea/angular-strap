'use strict';

describe('datepicker', function () {
    var scope, $sandbox, $compile, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope;
    $compile = _$compile_;
    $timeout = _$timeout_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
    scope.model = {};
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
    $('.datepicker').remove();
  });

  var templates = {
    'default': '<input type="text" ng-model="model.date" data-date-format="yyyy/mm/dd" bs-datepicker>',
    'addon': '<input type="text" ng-model="model.date" data-date-format="yyyy/mm/dd" bs-datepicker><span class="add-on" data-toggle="datepicker"><i class="icon-calendar"></i></span>',
    'language': '<input type="text" ng-model="model.date" data-language="fr" bs-datepicker>'
  };

  function compileDirective(template) {
    template = template ? templates[template] : templates['default'];
    template = $(template).appendTo($sandbox);
    return $compile(template)(scope);
  }

  // Tests

  it('should add "data-toggle" attr for you', function () {
    var elm = compileDirective();
    expect(elm.attr('data-toggle') === 'datepicker').toBe(true);
  });

  it('should correctly call $.fn.datepicker', function () {
    var old = $.fn.datepicker;
    var spy = angular.extend(spyOn($.fn, 'datepicker'), old).andCallThrough();
    var elm = compileDirective();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle "data-language" attr', function () {
    (function($){$.fn.datepicker.dates["fr"]={days:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],daysShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],daysMin:["D","L","Ma","Me","J","V","S","D"],months:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],monthsShort:["Jan","Fev","Mar","Avr","Mai","Jui","Jul","Aou","Sep","Oct","Nov","Dec"],today:"Aujourd'hui",weekStart:1,format:"dd/mm/yyyy"}})(jQuery);
    var elm = compileDirective('language');
    expect(elm.data('datepicker').language).toBe('fr');
  });

  it('should show/hide the datepicker', function() {
    var elm = compileDirective();
    elm.datepicker('show');
    expect(elm.data('datepicker').picker.is(':visible')).toBe(true);
    elm.datepicker('hide');
    expect(elm.data('datepicker').picker.is(':visible')).toBe(false);
  });

  it('should show the datepicker on focus', function() {
    var elm = compileDirective();
    elm.trigger('focus');
    expect(elm.data('datepicker').picker.is(':visible')).toBe(true);
  });

  it('should show the datepicker on [data-toggle="datepicker"] click', function() {
    var elm = compileDirective('addon');
    elm.next('[data-toggle="datepicker"]').trigger('click');
    expect(elm.data('datepicker').picker.is(':visible')).toBe(true);
  });

  it('should correctly update both input value and bound model', function() {
    var elm = compileDirective();
    elm.trigger('focus');
    elm.data('datepicker').picker.find('td.active').trigger('click');
    expect(elm.val() !== '').toBe(true);
    expect(scope.model.date).toBe(elm.val());
  });

});
