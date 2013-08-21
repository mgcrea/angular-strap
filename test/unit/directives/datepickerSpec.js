'use strict';

describe('datepicker', function () {
  var scope, $sandbox, $compile, $timeout;

  beforeEach(module('$strap.directives'));

  beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $timeout = _$timeout_;

    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
  }));

  afterEach(function() {
    $sandbox.remove();
    scope.$destroy();
    $('.datepicker').remove();
  });

  var fixtures = {
    'default': {
      element: '<input type="text" ng-model="foo.date" bs-datepicker>',
      scope: {foo: {date: new Date('2012-09-01T00:00:00.000Z')}}
    },
    'string': {
      element: '<input type="text" ng-model="foo.date" data-date-format="yyyy/mm/dd" data-date-type="string" bs-datepicker>',
      scope: {foo: {date: '2012/09/01'}}
    },
    'addon': {
      element: '<input type="text" ng-model="foo.date" bs-datepicker><span class="add-on" data-toggle="datepicker"><i class="icon-calendar"></i></span>'
    },
    'language': {
      element: '<input type="text" ng-model="foo.date" data-language="fr" bs-datepicker>'
    },
    'stringISO': {
      element: '<input type="text" ng-model="foo.date" data-date-format="yyyy/mm/dd" data-date-type="iso" bs-datepicker>',
      scope: {foo: {date: '2012-11-11T10:00:00.000Z'}}
    },
    'date': {
      element: '<input type="text" ng-model="foo.date" data-date-format="yyyy/mm/dd" data-date-type="date" bs-datepicker>',
      scope: {foo: {date: new Date('2012-11-11T10:00:00.000Z')}}
    }
  };

  function compileDirective(template) {
    template = template ? fixtures[template] : fixtures['default'];
    angular.extend(scope, template.scope || fixtures['default'].scope);
    $(template.element).appendTo($sandbox);
    var $element = $(template.element).appendTo($sandbox);
    $element = $compile($element)(scope);
    scope.$digest();
    return $element;
  }

  // Tests
  describe('desktop', function () {
    var isAppleTouch = /(iPad|iPho(ne|d))/g.test(navigator.userAgent);
    if(isAppleTouch) return;

    it('should add "data-toggle" attr for you', function () {
      var elm = compileDirective();
      // expect(elm.attr('data-toggle') === 'datepicker').toBe(true);
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



    describe("data-binding", function() {

      it('should support date as a string', function() {
        var elm = compileDirective('string');
        expect(+elm.data('datepicker').date).toBe(+new Date('2012-09-01T00:00:00.000Z'));
        expect(elm.prop('value')).toBe('2012/09/01');
      });

      it('should support date as a date', function() {
        var elm = compileDirective('date');
        expect(+elm.data('datepicker').date).toBe(+new Date('2012-11-11T10:00:00.000Z'));
        expect(elm.prop('value')).toBe('2012/11/11');
      });

      it('should support date as an ISO string', function() {
        var elm = compileDirective('stringISO');
        expect(+elm.data('datepicker').date).toBe(+new Date('2012-11-11T10:00:00.000Z'));
        expect(elm.prop('value')).toBe('2012/11/11');
      });

    });

    describe("data-binding", function() {

      it('should correctly apply model defaults to the view', function() {
        var elm = compileDirective();
        expect(elm.data('datepicker').date).toBe(scope.foo.date);
        expect(elm.val()).toBe('09/01/2012');
      });

      it('should correctly apply model changes to the view', function() {
        var elm = compileDirective();
        scope.foo.date = new Date('2000-01-01T00:00:00.000Z');
        scope.$digest();
        expect(elm.data('datepicker').date).toBe(scope.foo.date);
        expect(elm.val()).toBe('01/01/2000');
      });

      it('should correctly apply view changes to the model', function() {
        var elm = compileDirective();
        elm.trigger('focus');
        elm.data('datepicker').picker.find('td').trigger('click');
        expect(elm.val() !== '').toBe(true);
        expect(angular.equals(scope.foo.date, elm.data('datepicker').date)).toBe(true);
      });

    });

  });

});
