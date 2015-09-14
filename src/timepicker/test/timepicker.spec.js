'use strict';

describe('timepicker', function() {

  var $compile, $templateCache, $animate, $timepicker, dateFilter, scope, sandboxEl, today, $timeout;

  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));
  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.timepicker'));

  beforeEach(inject(function ($injector, _$rootScope_, _$compile_, _$templateCache_, _$timepicker_, _dateFilter_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function() {
      flush.call($animate); if(!$animate.triggerCallbacks) $timeout.flush();
    };
    $timepicker = _$timepicker_;
    dateFilter = _dateFilter_;
    today = new Date();
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {selectedTime: new Date()},
      element: '<input type="text" ng-model="selectedTime" bs-timepicker>'
    },
    'default-with-namespace': {
      scope: {selectedTime: new Date()},
      element: '<input type="text" ng-model="selectedTime" bs-timepicker data-prefix-event="datepicker">'
    },
    'default-with-id': {
      scope: {selectedTime: new Date()},
      element: '<input id="timepicker1" type="text" ng-model="selectedTime" bs-timepicker>'
    },
    'value-past': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42)},
      element: '<input type="text" ng-model="selectedTime" bs-timepicker>'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><input type="text" ng-model="selectedTime" bs-timepicker></li></ul>'
    },
    'markup-ngChange': {
      scope: {selectedDate: new Date(1970, 0, 1, 10, 30, 42), onChange: function() {}},
      element: '<input type="text" ng-model="selectedTime" ng-change="onChange()" bs-timepicker>'
    },
    'markup-ngRequired': {
      scope: {selectedTime: new Date(2012, 5, 15, 9, 30, 42)},
      element: '<input type="text" ng-model="selectedTime" ng-required="true" bs-timepicker>'
    },
    'options-animation': {
      element: '<div class="btn" data-animation="am-flip-x" ng-model="timepickeredIcon" bs-timepicker></div>'
    },
    'options-placement': {
      element: '<div class="btn" data-placement="bottom" ng-model="timepickeredIcon" bs-timepicker></div>'
    },
    'options-placement-exotic': {
      element: '<div class="btn" data-placement="bottom-right" ng-model="timepickeredIcon" bs-timepicker></div>'
    },
    'options-trigger': {
      element: '<div class="btn" data-trigger="hover" ng-model="timepickeredIcon" bs-timepicker></div>'
    },
    'options-template': {
      element: '<input type="text" data-template-url="custom" ng-model="selectedTime" bs-timepicker>'
    },
    'options-timeFormat': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42)},
      element: '<input type="text" ng-model="selectedTime" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-timeFormat-seconds': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42)},
      element: '<input type="text" ng-model="selectedTime" data-time-format="HH:mm:ss" bs-timepicker>'
    },
    'options-timeFormat-seconds-meridian': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42)},
      element: '<input type="text" ng-model="selectedTime" data-time-format="HH:mm:ss a" bs-timepicker>'
    },
    'options-timezone-utc': {
      element: '<input type="text" ng-model="selectedTime" data-time-format="HH:mm" data-timezone="UTC" bs-timepicker>'
    },
    'options-timeType-string': {
      scope: {selectedTime: '10:30'},
      element: '<input type="text" ng-model="selectedTime" data-time-type="string" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-timeType-string-null': {
      scope: {selectedTime: null},
      element: '<input type="text" ng-model="selectedTime" data-time-type="string" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-timeType-number': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42).getTime()},
      element: '<input type="text" ng-model="selectedTime" data-time-type="number" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-timeType-unix': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42) / 1000},
      element: '<input type="text" ng-model="selectedTime" data-time-type="unix" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-timeType-iso': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42).toISOString()},
      element: '<input type="text" ng-model="selectedTime" data-time-type="iso" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-minTime': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 0), minTime: '09:30 AM'},
      element: '<input type="text" ng-model="selectedTime" data-min-time="{{minTime}}" bs-timepicker>'
    },
    'options-minTime-now': {
      scope: {},
      element: '<input type="text" ng-model="selectedTime" data-min-time="now" bs-timepicker>'
    },
    'options-maxTime-now': {
      scope: {},
      element: '<input type="text" ng-model="selectedTime" data-max-time="now" bs-timepicker>'
    },
    'options-maxTime': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 0), maxTime: '10:30 PM'},
      element: '<input type="text" ng-model="selectedTime" data-max-time="{{maxTime}}" bs-timepicker>'
    },
    'options-autoclose': {
      element: '<input type="text" ng-model="selectedTime" data-autoclose="{{autoclose}}" bs-timepicker>'
    },
    'options-useNative': {
      element: '<input type="text" ng-model="selectedTime" data-use-native="1" bs-timepicker>'
    },
    'options-modelTimeFormat': {
      scope: {selectedTime: '12:20:10'},
      element: '<input type="text" ng-model="selectedTime" data-time-type="string" data-model-time-format="HH:mm:ss" data-time-format="HH:mm" bs-timepicker>'
    },
    'options-arrowBehavior': {
      scope: {selectedTime: new Date(1970, 0, 1, 10, 30, 42), arrowBehavior: 'pager', timeType: 'date'},
      element: '<input type="text" ng-model="selectedTime" length="5" data-time-type="{{ timeType }}" data-arrow-behavior="{{ arrowBehavior }}" bs-timepicker>'
    },
    'options-roundDisplay': {
      element: '<input type="text" data-minute-step="15" ng-model="selectedTime" data-round-display="{{roundDisplay}}" bs-timepicker>'
    },
    'options-roundDisplay-seconds': {
      element: '<input type="text" data-minute-step="15" data-second-step="20" ng-model="selectedTime" data-round-display="{{roundDisplay}}" data-time-format="HH:mm:ss" bs-timepicker>'
    },
    'bsShow-attr': {
      scope: {selectedTime: new Date()},
      element: '<input type="text" ng-model="selectedTime" bs-timepicker bs-show="true">'
    },
    'bsShow-binding': {
      scope: {isVisible: false, selectedTime: new Date()},
      element: '<input type="text" ng-model="selectedTime" bs-timepicker bs-show="isVisible">'
    },
    'options-container': {
      scope: {selectedTime: new Date()},
      element: '<input type="text" data-container="{{container}}" ng-model="selectedTime" bs-timepicker>'
    }
  };

  function compileDirective(template, locals) {
    template = templates[template];
    angular.extend(scope, angular.copy(template.scope || templates['default'].scope), locals);
    var element = $(template.element).appendTo(sandboxEl);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  function triggerKeyDown(elm, keyCode) {
    var evt = $.Event('keydown');
    evt.which = evt.keyCode = keyCode;
    angular.element(elm[0]).triggerHandler(evt);
  }

  // Tests

  describe('with default template', function() {

    it('should open on focus', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
    });

    it('should close on blur', function() {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
    });

    it('should correctly compile inner content', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody tr').length).toBe($timepicker.defaults.length);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe($timepicker.defaults.length * 4);
    });

    it('should correctly display time', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'h'));
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'mm'));
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(6) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'a'));
    });

    it('should correctly update the model when the view is updated', function() {
      var elm = compileDirective('value-past');
      // Should have the predefined value
      expect(elm.val()).toBe('10:30 AM');
      // Should correctly set the model value if set via the timepicker
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(12)')).triggerHandler('click');
      expect(elm.val()).toBe('12:30 PM');
      expect(scope.selectedTime.toISOString().substr(0, 10)).toBe('1970-01-01');
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(12)')).triggerHandler('click');
      expect(scope.selectedTime.toISOString().substr(0, 10)).toBe('1970-01-01');
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(11)')).triggerHandler('click');
      expect(elm.val()).toBe('11:30 AM');
      expect(scope.selectedTime).toEqual(new Date(1970, 0, 1, 11, 30, 42));
      expect(scope.selectedTime.toISOString().substr(0, 10)).toBe('1970-01-01');
    });

    it('should correctly parse input time', function() {
      var elm = compileDirective('value-past');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val('12:30 AM');
      angular.element(elm[0]).triggerHandler('change');
      expect(scope.selectedTime.getHours()).toBe(0);
      elm.val('12:30 PM');
      angular.element(elm[0]).triggerHandler('change');
      expect(scope.selectedTime.getHours()).toBe(12);
    });


    it('should correctly support null values', function() {
      var elm = compileDirective('default', {selectedTime: null});
      angular.element(elm[0]).triggerHandler('focus');
      expect(elm.val()).toBe('');
      expect(sandboxEl.find('.dropdown-menu tbody tr').length).toBe($timepicker.defaults.length);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe($timepicker.defaults.length * 4);
      elm.val('0');
      angular.element(elm[0]).triggerHandler('change');
    });

    it('should correctly support undefined values', function() {
      var elm = compileDirective('default', {selectedTime: undefined});
      angular.element(elm[0]).triggerHandler('focus');
      expect(elm.val()).toBe('');
      expect(sandboxEl.find('.dropdown-menu tbody tr').length).toBe($timepicker.defaults.length);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe($timepicker.defaults.length * 4);
      angular.element(sandboxEl.find('.dropdown-menu tbody button:eq(0)')[0]).triggerHandler('click');
      expect(angular.isDate(scope.selectedTime)).toBeTruthy();
    });

    it('should ignore switch meridians with undefined time values', function() {
      var elm = compileDirective('default', {selectedTime: undefined});
      expect(elm.val()).toBe('');
      angular.element(elm[0]).triggerHandler('focus');
      var amButton = angular.element(sandboxEl.find('.dropdown-menu tbody td:eq(6) button:eq(0)')[0]);
      spyOn(scope.$$childHead, '$switchMeridian');
      amButton.triggerHandler('click');
      // expect not to throw exception
      expect(scope.$$childHead.$switchMeridian).toHaveBeenCalled();
    });

    it('should correctly support invalid values', function() {
      var elm = compileDirective('default');
      elm.val('invalid');
      angular.element(elm[0]).triggerHandler('change');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text().trim() * 1 % 12).toBe(today.getHours() % 12);
      angular.element(sandboxEl.find('.dropdown-menu tbody tr:eq(0) td:eq(0) .btn')[0]).triggerHandler('click');
      expect(scope.selectedTime.getHours()).not.toBe(today.getHours());
    });

    it('should handle null values', function() {
      var elm = compileDirective('default');
      elm.val('');
      angular.element(elm[0]).triggerHandler('change');
      expect(scope.selectedTime).toBeNull();
    });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-timepicker]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody tr').length).toBe($timepicker.defaults.length);
      expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe($timepicker.defaults.length * 4);
    });

    it('should support ngChange markup', function() {
      var elm = compileDirective('markup-ngChange');
      angular.element(elm[0]).triggerHandler('focus');
      var spy = spyOn(scope, 'onChange').and.callThrough();
      angular.element(sandboxEl.find('.dropdown-menu tbody .btn:eq(1)')[0]).triggerHandler('click');
      expect(spy).toHaveBeenCalled();
    });

    it('should support ngRequired markup', function() {
      var elm = compileDirective('markup-ngRequired');

      expect(elm.val()).toBe('9:30 AM');
      expect(scope.selectedTime).toBeDefined();
      expect(scope.selectedTime).toEqual(new Date(2012, 5, 15, 9, 30, 42));

      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'h'));
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'mm'));
      expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(6) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'a'));

    });

    it('should consider empty value valid-date with ngRequired markup', function() {
      var elm = compileDirective('markup-ngRequired');

      // we don't check ng-valid-parse because AngularJs 1.2
      // doesn't use that class

      expect(elm.hasClass('ng-valid')).toBe(true);
      expect(elm.hasClass('ng-valid-required')).toBe(true);

      angular.element(elm[0]).triggerHandler('focus');
      elm.val('');
      angular.element(elm[0]).triggerHandler('change');

      // if input is empty, consider valid-date and let
      // ngRequired invalidate the value
      expect(elm.hasClass('ng-valid-date')).toBe(true);
      expect(elm.hasClass('ng-invalid')).toBe(true);
      expect(elm.hasClass('ng-invalid-required')).toBe(true);
    });

    it('should consider empty value valid-parse without ngRequired markup', function() {
      var elm = compileDirective('default');

      // we don't check ng-valid-parse because AngularJs 1.2
      // doesn't use that class

      expect(elm.hasClass('ng-valid')).toBe(true);

      angular.element(elm[0]).triggerHandler('focus');
      elm.val('');
      angular.element(elm[0]).triggerHandler('change');

      // if input is empty, consider valid-date and let
      // other validators run
      expect(elm.hasClass('ng-valid-date')).toBe(true);
      expect(elm.hasClass('ng-valid')).toBe(true);
    });



    // iit('should only build the timepicker once', function() {
    //   var elm = compileDirective('value-past');
    //   angular.element(elm[0]).triggerHandler('focus');
    // });

  });

  describe('resource allocation', function() {
    it('should not create additional scopes after first show', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      $animate.flush();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
      angular.element(elm[0]).triggerHandler('blur');
      $animate.flush();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);

      var scopeCount = countScopes(scope, 0);

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('focus');
        $animate.flush();
        angular.element(elm[0]).triggerHandler('blur');
        $animate.flush();
      }

      expect(countScopes(scope, 0)).toBe(scopeCount);
    });

    it('should destroy scopes when destroying directive scope', function() {
      var scopeCount = countScopes(scope, 0);
      var originalScope = scope;
      scope = scope.$new();
      var elm = compileDirective('default');

      for (var i = 0; i < 10; i++) {
        angular.element(elm[0]).triggerHandler('focus');
        $animate.flush();
        angular.element(elm[0]).triggerHandler('blur');
        $animate.flush();
      }

      scope.$destroy();
      scope = originalScope;
      expect(countScopes(scope, 0)).toBe(scopeCount);
    });
  });

  describe('bsShow attribute', function() {
    it('should support setting to a boolean value', function() {
      var elm = compileDirective('bsShow-attr');
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
    });

    it('should support binding', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
      scope.isVisible = true;
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
      scope.isVisible = false;
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
    });

    it('should support initial value false', function() {
      var elm = compileDirective('bsShow-binding');
      expect(scope.isVisible).toBeFalsy();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
    });

    it('should support initial value true', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: true});
      expect(scope.isVisible).toBeTruthy();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
    });

    it('should support undefined value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: undefined});
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
    });

    it('should support string value', function() {
      var elm = compileDirective('bsShow-binding', {isVisible: 'a string value'});
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
      scope.isVisible = 'TRUE';
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
      scope.isVisible = 'dropdown';
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
      scope.isVisible = 'timepicker,tooltip';
      scope.$digest();
      expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
    });
  });

  // describe('using service', function() {

  //   it('should correctly open on next digest', function() {
  //     var myModal = $modal(templates['default'].scope.modal);
  //     scope.$digest();
  //     expect(bodyEl.children('.modal').length).toBe(1);
  //     myModal.hide();
  //     expect(bodyEl.children('.modal').length).toBe(0);
  //   });

  //   it('should correctly be destroyed', function() {
  //     var myModal = $modal(angular.extend(templates['default'].scope.modal));
  //     scope.$digest();
  //     expect(bodyEl.children('.modal').length).toBe(1);
  //     myModal.destroy();
  //     expect(bodyEl.children('.modal').length).toBe(0);
  //     expect(bodyEl.children().length).toBe(1);
  //   });

  //   it('should correctly work with ngClick', function() {
  //     var elm = compileDirective('markup-ngClick-service');
  //     var myModal = $modal(angular.extend({show: false}, templates['default'].scope.modal));
  //     scope.showModal = function() {
  //       myModal.$promise.then(myModal.show);
  //     };
  //     expect(bodyEl.children('.modal').length).toBe(0);
  //     angular.element(elm[0]).triggerHandler('click');
  //     expect(bodyEl.children('.modal').length).toBe(1);
  //   });

  // });

  describe('show / hide events', function() {

    it('should dispatch show and show.before events', function() {
      var myTimepicker = $timepicker(sandboxEl, { $datevalue: new Date() }, { scope: scope, options: templates['default'].scope });
      var emit = spyOn(myTimepicker.$scope, '$emit');
      scope.$digest();
      myTimepicker.show();

      expect(emit).toHaveBeenCalledWith('tooltip.show.before', myTimepicker);
      // show only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('tooltip.show', myTimepicker);
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('tooltip.show', myTimepicker);
    });

    it('should dispatch hide and hide.before events', function() {
      var myTimepicker = $timepicker(sandboxEl, { $datevalue: new Date() }, { scope: scope, options: templates['default'].scope });
      scope.$digest();
      myTimepicker.show();

      var emit = spyOn(myTimepicker.$scope, '$emit');
      myTimepicker.hide();

      expect(emit).toHaveBeenCalledWith('tooltip.hide.before', myTimepicker);
      // hide only fires AFTER the animation is complete
      expect(emit).not.toHaveBeenCalledWith('tooltip.hide', myTimepicker);
      $animate.flush();
      expect(emit).toHaveBeenCalledWith('tooltip.hide', myTimepicker);
    });

    it('should call show.before event with popover element instance id', function() {
      var elm = compileDirective('default-with-id');
      var id = "";
      scope.$on('tooltip.show.before', function(evt, timepicker) {
        id = timepicker.$id;
      });

      angular.element(elm[0]).triggerHandler('focus');
      scope.$digest();
      expect(id).toBe('timepicker1');
    });

  });

  describe('options', function() {

    describe('animation', function() {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('autoclose', function() {

      it('should close on select if truthy', function() {
        var elm = compileDirective('options-autoclose', {autoclose: 'true'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:first')).triggerHandler('click');
        $timeout.flush();
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
      });

      it('should NOT close on select if falsy', function() {
        var elm = compileDirective('options-autoclose', {autoclose: 'false'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:first')).triggerHandler('click');
        $timeout.flush();
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
      });

    });

    describe('placement', function() {
      var $$rAF;
      beforeEach(inject(function (_$$rAF_) {
        $$rAF = _$$rAF_
      }));

      it('should default to `bottom-left` placement', function() {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function() {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('template', function() {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner">foo: {{selectedTime}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: "' + scope.selectedTime.toISOString() + '"');
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><ul><li ng-repeat="i in [1, 2, 3]">{{i}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('123');
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('123');
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        scope.dropdown = {counter: 0};
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

    describe('seconds display', function() {

      it('should hide seconds', function() {
        var elm = compileDirective('options-timeFormat');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu thead .btn').length).toBe(2);
        expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe($timepicker.defaults.length * 2);
        expect(sandboxEl.find('.dropdown-menu tfoot .btn').length).toBe(2);
      });

      it('should show seconds', function() {
        var elm = compileDirective('options-timeFormat-seconds');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu thead .btn').length).toBe(3);
        expect(sandboxEl.find('.dropdown-menu tbody .btn').length).toBe($timepicker.defaults.length * 3);
        expect(sandboxEl.find('.dropdown-menu tfoot .btn').length).toBe(3);
      });

    });

    describe('keyboard', function() {

      it('should support keyboard navigation', function() {
        var elm = compileDirective('default', { selectedTime: new Date(2014, 10, 23, 8, 30, 40) });
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        // need to flush timeout to register keyboard events
        // IMPORTANT: do it before $animate.flush, because
        // on 1.3 that seems to do both and we get an error in 1.2
        $timeout.flush();
        $animate.flush();
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe('8');

        // cursor up
        triggerKeyDown(elm, 38);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe('7');
        // cursor down
        triggerKeyDown(elm, 40);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe('8');

        // cursor right -> select minutes
        triggerKeyDown(elm, 39);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2) .btn-primary').text()).toBe('30');
        // cursor up
        triggerKeyDown(elm, 38);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2) .btn-primary').text()).toBe('25');
        // cursor down
        triggerKeyDown(elm, 40);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2) .btn-primary').text()).toBe('30');
      });

      it('should support keyboard navigation with seconds', function() {
        var elm = compileDirective('options-timeFormat-seconds', { selectedTime: new Date(2014, 10, 23, 8, 30, 40) });
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        // need to flush timeout to register keyboard events
        // IMPORTANT: do it before $animate.flush, because
        // on 1.3 that seems to do both and we get an error in 1.2
        $timeout.flush();
        $animate.flush();
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe('08');

        // cursor right -> select minutes
        triggerKeyDown(elm, 39);
        // cursor right -> select seconds
        triggerKeyDown(elm, 39);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(4) .btn-primary').text()).toBe('40');
        // cursor up
        triggerKeyDown(elm, 38);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(4) .btn-primary').text()).toBe('35');
        // cursor down
        triggerKeyDown(elm, 40);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(4) .btn-primary').text()).toBe('40');
      });

      function getSelection(element) {
        return { start: element[0].selectionStart, end: element[0].selectionEnd};
      }

      it('should select date part when using keyboard navigation', function() {
        var elm = compileDirective('default', { selectedTime: new Date(2014, 10, 23, 8, 30, 40) });
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        // need to flush timeout to register keyboard events
        // IMPORTANT: do it before $animate.flush, because
        // on 1.3 that seems to do both and we get an error in 1.2
        $timeout.flush();
        $animate.flush();
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe('8');

        // cursor down -> select hours -> 9
        triggerKeyDown(elm, 40);
        var selection = getSelection(elm);
        expect(selection.start).toBe(0);
        expect(selection.end).toBe(1);
        // cursor down -> select hours -> 10
        triggerKeyDown(elm, 40);
        selection = getSelection(elm);
        expect(selection.start).toBe(0);
        expect(selection.end).toBe(2);
        // cursor up -> select hours -> 9
        triggerKeyDown(elm, 38);
        selection = getSelection(elm);
        expect(selection.start).toBe(0);
        expect(selection.end).toBe(1);

        // cursor right -> select minutes
        triggerKeyDown(elm, 39);
        selection = getSelection(elm);
        expect(selection.start).toBe(2);
        expect(selection.end).toBe(4);
        // cursor up -> select minutes
        triggerKeyDown(elm, 38);
        expect(selection.start).toBe(2);
        expect(selection.end).toBe(4);
      });

      it('should select date part when using keyboard navigation with seconds', function() {
        var elm = compileDirective('default', { selectedTime: new Date(2014, 10, 23, 8, 30, 40) });
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        // need to flush timeout to register keyboard events
        // IMPORTANT: do it before $animate.flush, because
        // on 1.3 that seems to do both and we get an error in 1.2
        $timeout.flush();
        $animate.flush();
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe('8');

        // cursor down -> select hours
        triggerKeyDown(elm, 40);

        // cursor right -> select minutes
        triggerKeyDown(elm, 39);

        // cursor right -> select seconds
        triggerKeyDown(elm, 39);
        selection = getSelection(elm);
        expect(selection.start).toBe(5);
        expect(selection.end).toBe(7);
        // cursor up -> select seconds
        triggerKeyDown(elm, 38);
        expect(selection.start).toBe(5);
        expect(selection.end).toBe(7);

        // cursor right -> select hours
        triggerKeyDown(elm, 39);
        var selection = getSelection(elm);
        expect(selection.start).toBe(0);
        expect(selection.end).toBe(1);
      });

    });

    describe('timeFormat', function() {

      it('should support a custom timeFormat', function() {
        var elm = compileDirective('options-timeFormat');
        expect(elm.val()).toBe('10:30');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(09)')).triggerHandler('click');
        expect(elm.val()).toBe('09:30');
      });

      it('should correctly display time with seconds and meridian', function() {
        var elm = compileDirective('options-timeFormat-seconds-meridian');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'h'));
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'mm'));
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(4) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'ss'));
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(6) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'a'));
      });

      it('should support a custom timeFormat with seconds', function() {
        var elm = compileDirective('options-timeFormat-seconds');
        expect(elm.val()).toBe('10:30:42');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(47)')).triggerHandler('click');
        expect(elm.val()).toBe('10:30:47');
      });

    });

    describe('timezone', function () {
      var elm, i = 0;
      var times = [
        new Date(2014, 0, 1, 0, 0),
        new Date(2015, 0, 1, 5, 0),
        new Date(2014, 11, 31, 0, 0),
        new Date(2015, 11, 31, 23, 0),
        new Date(2014, 7, 1, 15, 30),
        new Date(2015, 7, 1, 3, 15),
        new Date(1985, 0, 11, 0, 0)
      ];

      beforeEach(function() {
        elm = compileDirective('options-timezone-utc', {selectedTime: times[i]});
      });

      afterEach(function() { i++ });

      for (var t = 0; t < times.length; t++) {
        it('should render time in utc timezone', function () {
          expect(elm.val()).toBe(dateFilter(times[i], 'HH:mm', 'UTC'));
          expect(scope.selectedTime.toDateString()).toBe(times[i].toDateString());
        });
      }

    });

    describe('timeType', function() {

      it('should support a string timeType', function() {
        var elm = compileDirective('options-timeType-string');
        expect(elm.val()).toBe('10:30');
        expect(scope.selectedTime).toBe('10:30');
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(09)')).triggerHandler('click');
        expect(elm.val()).toBe('09:30');
        expect(scope.selectedTime).toBe('09:30');
      });

      it('should support a string timeType with a null value', function() {
        var elm = compileDirective('options-timeType-string-null');
        expect(elm.val()).toBe('');
        expect(scope.selectedTime).toBe(null);
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:eq(0)')).triggerHandler('click');
        expect(elm.val()).toBeTruthy();
        expect(scope.selectedTime).toBeTruthy();
      });

      it('should support a number timeType', function() {
        var elm = compileDirective('options-timeType-number');
        expect(elm.val()).toBe('10:30');
        expect(scope.selectedTime).toBe(new Date(1970, 0, 1, 10, 30, 42).getTime());
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(09)')).triggerHandler('click');
        expect(elm.val()).toBe('09:30');
        expect(scope.selectedTime).toBe(new Date(1970, 0, 1, 9, 30, 42).getTime());
      });

      it('should support a unix timeType', function() {
        var elm = compileDirective('options-timeType-unix');
        expect(elm.val()).toBe('10:30');
        expect(scope.selectedTime).toBe(new Date(1970, 0, 1, 10, 30, 42).getTime() / 1000);
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(09)')).triggerHandler('click');
        expect(elm.val()).toBe('09:30');
        expect(scope.selectedTime).toBe(new Date(1970, 0, 1, 9, 30, 42) / 1000);
      });

      it('should support a iso timeType', function() {
        var elm = compileDirective('options-timeType-iso');
        var date = new Date(1970, 0, 1, 10, 30);
        expect(elm.val()).toBe(date.getHours() + ':' + date.getMinutes());
        expect(scope.selectedTime).toBe(new Date(1970, 0, 1, 10, 30, 42).toISOString());
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(09)')).triggerHandler('click');
        expect(elm.val()).toBe('09:30');
        expect(scope.selectedTime).toBe(new Date(1970, 0, 1, 9, 30, 42).toISOString());
      });

    });

    describe('minTime', function() {

      it('should support a dynamic minTime', function() {
        var elm = compileDirective('options-minTime');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeTruthy();
        scope.minTime = '08:30 AM';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeFalsy();
      });

      it('should support now as minTime', function() {
        var elm = compileDirective('options-minTime-now');
        angular.element(elm[0]).triggerHandler('focus');
        var todayHour = today.getHours();
        // @TODO fixme
        // expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + (todayHour - 1) + ')').is(':disabled')).toBeTruthy();
      });

      it('should support date object as minTime', function() {
        var elm = compileDirective('options-minTime', { minTime: new Date(1970, 0, 1, 9, 30)});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeTruthy();
        scope.minTime = new Date(1970, 0, 1, 8, 30);
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeFalsy();
      });

      it('should ignore date part of date object as minTime', function() {
        var elm = compileDirective('options-minTime', { minTime: new Date(1987, 6, 13, 9, 30)});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeTruthy();
        scope.minTime = new Date(1987, 6, 13, 8, 30);
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeFalsy();
      });

      it('should consider empty minTime as no minTime defined', function() {
        var elm = compileDirective('options-minTime');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeTruthy();
        scope.minTime = '';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(8)').is(':disabled')).toBeFalsy();
      });

      it('should validate using minTime', function() {
        var elm = compileDirective('options-minTime');

        elm.val('10:00 AM'); // valid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-valid-min')).toBeTruthy();

        elm.val('8:00 AM'); // invalid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-invalid-min')).toBeTruthy();
      });

      it('should trigger validation when minTime changes', function() {
        var elm = compileDirective('options-minTime');

        elm.val('10:00 AM'); // valid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-valid-min')).toBeTruthy();

        elm.val('8:00 AM'); // invalid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-invalid-min')).toBeTruthy();

        scope.minTime = '07:00 AM'; // valid again
        scope.$digest();
        expect(elm.hasClass('ng-valid-min')).toBeTruthy();
      });

      it('should ignore date part of ngModel when validating with minTime', function() {
        var elm = compileDirective('options-minTime', { selectedTime: new Date(1957, 6, 13, 10, 30, 42)});
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-valid-min')).toBeTruthy();
      });

    });

    describe('maxTime', function() {

      it('should support a dynamic maxTime', function() {
        var elm = compileDirective('options-maxTime');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeFalsy();
        scope.maxTime = '10:30 AM';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeTruthy();
      });

      it('should support now as maxTime', function() {
        var elm = compileDirective('options-maxTime-now');
        angular.element(elm[0]).triggerHandler('focus');
        var todayHour = today.getHours();
        // @TODO fixme
        // expect(sandboxEl.find('.dropdown-menu tbody button:contains(' + (todayHour + 1) + ')').is(':disabled')).toBeTruthy();
      });

      it('should support date object as maxTime', function() {
        var elm = compileDirective('options-maxTime', { maxTime: new Date(1970, 0, 1, 22, 30)});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeFalsy();
        scope.maxTime = new Date(1970, 0, 1, 10, 30);
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeTruthy();
      });

      it('should ignore date part of date object as maxTime', function() {
        var elm = compileDirective('options-maxTime', { maxTime: new Date(1927, 6, 13, 22, 30)});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeFalsy();
        scope.maxTime = new Date(1927, 6, 13, 10, 30);
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeTruthy();
      });

      it('should consider empty maxTime as no maxTime defined', function() {
        var elm = compileDirective('options-maxTime');
        angular.element(elm[0]).triggerHandler('focus');
        scope.maxTime = '10:30 AM';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeTruthy();
        scope.maxTime = '';
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu tbody button:contains(11)').is(':disabled')).toBeFalsy();
      });

      it('should validate using maxTime', function() {
        var elm = compileDirective('options-maxTime');

        elm.val('8:00 PM'); // valid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-valid-max')).toBeTruthy();

        elm.val('11:00 PM'); // invalid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-invalid-max')).toBeTruthy();
      });

      it('should trigger validation when maxTime changes', function() {
        var elm = compileDirective('options-maxTime');

        elm.val('8:00 PM'); // valid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-valid-max')).toBeTruthy();

        elm.val('11:00 PM'); // invalid
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-invalid-max')).toBeTruthy();

        scope.maxTime = '11:00 PM'; // valid again
        scope.$digest();
        expect(elm.hasClass('ng-valid-max')).toBeTruthy();
      });

      it('should ignore date part of ngModel when validating with maxTime', function() {
        var elm = compileDirective('options-maxTime', { selectedTime: new Date(1987, 6, 13, 10, 30)});
        angular.element(elm[0]).triggerHandler('change');
        expect(elm.hasClass('ng-valid-max')).toBeTruthy();
      });

    });

    describe('useNative', function() {

      it('should correctly compile template according to useNative', function() {
        var elm = compileDirective('options-useNative');
        angular.element(elm[0]).triggerHandler('focus');
        // @TODO ?
      });

    });

    describe('modelTimeFormat', function() {

      it('should support a custom modelTimeFormat', function() {
        var elm = compileDirective('options-modelTimeFormat');

        // Should have the predefined value
        expect(elm.val()).toBe('12:20');

        // Should correctly set the model value if set via the timepicker
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu tbody .btn:contains(13)')).triggerHandler('click');
        expect(elm.val()).toBe('13:20');
        expect(scope.selectedTime).toBe('13:20:10');

        // Should correctly set the model if the date is manually typed into the input
        elm.val('10:00');
        angular.element(elm[0]).triggerHandler('change');
        scope.$digest();
        expect(scope.selectedTime).toBe('10:00:10');

      });

    });

    describe('arrowBehavior', function() {

      it('should scroll values shown when set to pager', function() {
        var elm = compileDirective('options-arrowBehavior');

        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'h'));

        sandboxEl.find('.dropdown-menu thead button:eq(0)').triggerHandler('click');

        // picker should scroll 5 hours (data-length)
        var newMiddleHour = new Date(scope.selectedTime.getTime() - (5 * 60 * 60 * 1000));
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0)').text()).toBe(dateFilter(newMiddleHour, 'h'));
      });

      it('should change ngModel value when set to picker', function() {
        var elm = compileDirective('options-arrowBehavior', {arrowBehavior: 'picker'});

        // we are going to increment time by 1 hour
        var testTime = new Date(scope.selectedTime.getTime() + (1 * 60 * 60 * 1000));

        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'h'));
        sandboxEl.find('.dropdown-menu thead button:eq(0)').triggerHandler('click');
        expect(scope.selectedTime).toEqual(testTime);
      });

      it('should change ngModel value when set to picker with an empty model', function() {
        var elm = compileDirective('options-arrowBehavior', {arrowBehavior: 'picker', selectedTime: '', timeType: 'string'});

        // we are going to increment time by 1 hour
        var testTime = new Date(Date.now() + (1 * 60 * 60 * 1000));

        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0) .btn-primary').text()).toBe(dateFilter(scope.selectedTime, 'h'));
        sandboxEl.find('.dropdown-menu thead button:eq(0)').triggerHandler('click');
        expect(scope.selectedTime).toEqual(dateFilter(testTime, 'h:00 a'));
      });

    });

    describe('roundDisplay', function() {

      var currentTime, i = 0;
      var times = [
        new Date(1970, 6, 13, 10, 33, 42),
        new Date(1970, 6, 13, 10, 33, 0),
        new Date(1970, 6, 13, 10, 0, 59),
        new Date(1970, 6, 13, 10, 0, 0),
        new Date(1970, 6, 13),
        new Date(1970, 6, 13, 23, 59, 59)
      ];

      beforeAll(function() { jasmine.clock().install(); });
      afterAll(function() { jasmine.clock().uninstall(); });

      beforeEach(function() {
        jasmine.clock().mockDate(times[i]);
        currentTime = new Date();
      });

      afterEach(function() { i++; });

      angular.forEach(times, function() {
        it('should floor display minutes to nearest minuteStep interval when ngModel value is undefined and roundDisplay is true', function() {
          var elm = compileDirective('options-roundDisplay', { selectedTime: undefined, roundDisplay: 'true' });
          currentTime.setMinutes(currentTime.getMinutes() - currentTime.getMinutes() % 15);
          angular.element(elm[0]).triggerHandler('focus');
          expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0)').text()).toBe(dateFilter(currentTime, 'h'));
          expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2)').text()).toBe(dateFilter(currentTime, 'mm'));
        });

        it('should floor display minutes to nearest minuteStep interval when ngModel value is undefined and seconds are shown and roundDisplay is true', function() {
          var elm = compileDirective('options-roundDisplay-seconds', { selectedTime: undefined, roundDisplay: 'true' });
          currentTime.setMinutes(currentTime.getMinutes() - currentTime.getMinutes() % 15);
          currentTime.setSeconds(0);
          angular.element(elm[0]).triggerHandler('focus');
          expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(0)').text()).toBe(dateFilter(currentTime, 'HH'));
          expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2)').text()).toBe(dateFilter(currentTime, 'mm'));
          expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(4)').text()).toBe(dateFilter(currentTime, 'ss'));
        });
      });


/*
      // seems this would fail when currentTime % 15 == 0, so will leave it out for now

      it('should NOT floor display minutes to nearest minuteStep interval when ngModel value is undefined and roundDisplay is false', function() {
        var elm = compileDirective('options-roundDisplay', { selectedTime: undefined, roundDisplay: 'false' });
        currentTime.setMinutes(currentTime.getMinutes() - currentTime.getMinutes() % 15);
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu tbody tr:eq(2) td:eq(2)').text()).not.toBe(dateFilter(currentTime, 'mm'));
      });
*/

    });

    describe('container', function() {

      it('should append to container if defined', function() {
        var testElm = $('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', {container: '#testElm'});
        expect(testElm.children('.dropdown-menu.timepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        expect(testElm.children('.dropdown-menu.timepicker').length).toBe(1);
      })

      it('should put datepicker in sandbox when container is falsy', function() {
        var elm = compileDirective('options-container', {container: 'false'});
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(0);
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu.timepicker').length).toBe(1);
      })

    })

    describe('prefix', function () {
      it('should call namespaced events through provider', function() {
        var myTimepicker = $timepicker(sandboxEl, { $datevalue: new Date() }, {prefixEvent: 'datepicker', scope : scope});
        var emit = spyOn(myTimepicker.$scope, '$emit');
        scope.$digest();
        myTimepicker.show();
        myTimepicker.hide();
        $animate.flush();

        expect(emit).toHaveBeenCalledWith('datepicker.show.before', myTimepicker);
        expect(emit).toHaveBeenCalledWith('datepicker.show', myTimepicker);
        expect(emit).toHaveBeenCalledWith('datepicker.hide.before', myTimepicker);
        expect(emit).toHaveBeenCalledWith('datepicker.hide', myTimepicker);
      });

      it('should call namespaced events through directive', function() {
        var elm = compileDirective('default-with-namespace');
        var showBefore, show, hideBefore, hide;
        scope.$on('datepicker.show.before', function() {
          showBefore = true;
        });
        scope.$on('datepicker.show', function() {
          show = true;
        });
        scope.$on('datepicker.hide.before', function() {
          hideBefore = true;
        });
        scope.$on('datepicker.hide', function() {
          hide = true;
        });

        angular.element(elm[0]).triggerHandler('focus');
        $animate.flush();

        expect(showBefore).toBe(true);
        expect(show).toBe(true);

        angular.element(elm[0]).triggerHandler('blur');
        $animate.flush();

        expect(hideBefore).toBe(true);
        expect(hide).toBe(true);
      });

    });

  });

});
