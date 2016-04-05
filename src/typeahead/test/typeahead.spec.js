'use strict';

describe('typeahead', function () {

  var $compile, $templateCache, $typeahead, scope, sandboxEl, $q, $animate, $timeout, $$rAF;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.typeahead'));
  beforeEach(module('ngAnimate'));
  beforeEach(module('ngAnimateMock'));

  beforeEach(inject(function ($injector, _$rootScope_, _$compile_, _$templateCache_, _$typeahead_, _$q_, _$animate_, _$$rAF_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $typeahead = _$typeahead_;
    $q = _$q_;
    $animate = $injector.get('$animate');
    $timeout = $injector.get('$timeout');
    var flush = $animate.flush || $animate.triggerCallbacks;
    $animate.flush = function () {
      flush.call($animate); if (!$animate.triggerCallbacks) $timeout.flush();
    };
    $$rAF = _$$rAF_;
  }));

  afterEach(function () {
    scope.$destroy();
    sandboxEl.remove();
  });

  // Templates

  var templates = {
    'default': {
      scope: {selectedState: '', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'default-without-filter': {
      scope: {selectedState: 'blah', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" data-filter="false" bs-typeahead>'
    },
    'default-with-promise': {
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in getAsyncStates($viewValue)" bs-typeahead>'
    },
    'default-with-namespace': {
      scope: {selectedState: '', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead data-prefix-event="datepicker">'
    },
    'default-with-id': {
      scope: {selectedState: '', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input id="typeahead1" type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'default-value': {
      scope: {selectedState: 'Alaska', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'default-autocomplete-present': {
      scope: {selectedState: '', states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead autocomplete="thisShouldNotChange">'
    },
    'by-id': {
      scope: {selectedIcon: 2, icons: [{id: 0, value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {id: 1, value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {id: 2, value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {id: 3, value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="{{html}}" bs-options="icon.id as icon.label for icon in icons" bs-typeahead>'
    },
    'watch-options': {
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" data-watch-options="1" bs-typeahead>'
    },
    'single-match': {
      scope: {selectedCode: '', codes: ['000000', '000001']},
      element: '<input type="text" ng-model="selecteCode" bs-options="code for code in codes" bs-typeahead>'
    },
    'comparator': {
      scope: {selectedCode: '', codes: ['001000', '002001']},
      element: '<input type="text" ng-model="selecteCode" bs-options="code for code in codes" bs-typeahead comparator="{{ comparator }}">'
    },
    'markup-ngRepeat': {
      element: '<ul><li ng-repeat="i in [1, 2, 3]"><input type="text" ng-model="selectedState" bs-options="state for state in states" bs-typeahead></li></ul>'
    },
    'markup-objectValue': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="1" bs-options="icon as icon.label for icon in icons" bs-typeahead>'
    },
    'markup-objectValue-custom': {
      scope: {selectedIcon: {}, icons: [{val: 'gear', fr_FR: '<i class="fa fa-gear"></i> Gear'}, {val: 'globe', fr_FR: '<i class="fa fa-globe"></i> Globe'}, {val: 'heart', fr_FR: '<i class="fa fa-heart"></i> Heart'}, {val: 'camera', fr_FR: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="1" bs-options="icon as icon[\'fr_FR\'] for icon in icons" bs-typeahead>'
    },
    'markup-renew-items': {
      scope: {selectedIcon: {}, icons: function () {return [{alt: 'Gear'}, {alt: 'Globe'}, {alt: 'Heart'}, {alt: 'Camera'}];}},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" bs-options="icon as icon.alt for icon in icons()" bs-typeahead>'
    },
    'options-animation': {
      element: '<input type="text" data-animation="am-flip-x" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-placement': {
      element: '<input type="text" data-placement="bottom" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-placement-exotic': {
      element: '<input type="text" data-placement="bottom-right" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-trigger': {
      element: '<input type="text" data-trigger="hover" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-html': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="{{html}}" bs-options="icon.value as icon.label for icon in icons" bs-typeahead>'
    },
    'options-template': {
      element: '<input type="text" data-template-url="custom" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-minLength': {
      element: '<input type="text" ng-model="selectedState" data-min-length="0" bs-options="state for state in states" bs-typeahead>'
    },
    'options-container': {
      element: '<input type="text" data-container="{{container}}" ng-model="selectedState" bs-options="state for state in states" bs-typeahead>'
    },
    'options-autoSelect': {
      element: '<input type="text" ng-model="selectedState" data-min-length="0" data-auto-select="1" bs-options="state for state in states" bs-typeahead>'
    },
    'options-trimValue': {
      scope: {selectedState: '', states: [' Alabama ', ' Alaska', 'Arizona ']},
      element: '<input type="text" ng-model="selectedState" data-trim-value="{{trimValue}}" bs-options="state for state in states" bs-typeahead>'
    },
    'options-events': {
      scope: {selectedState: '', states: [' Alabama', ' Alaska', 'Arizona']},
      element: '<input type="text" ng-model="selectedState" bs-options="state for state in states" bs-on-before-hide="onBeforeHide" bs-on-hide="onHide" bs-on-before-show="onBeforeShow" bs-on-show="onShow" bs-on-select="onSelect" bs-typeahead>'
    }
  };

  function compileDirective (template, locals, hook) {
    template = templates[template];
    angular.extend(scope, template.scope || templates['default'].scope, locals);
    var element = $(template.element).appendTo(sandboxEl);
    if (angular.isFunction(hook)) hook(scope);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  function triggerKeyDown (elm, keyCode) {
    var evt = $.Event('keydown');
    evt.which = evt.keyCode = keyCode;
    angular.element(elm[0]).triggerHandler(evt);
  }

  // Tests

  describe('with default template', function () {

    it('should open on focus', function () {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    });

    it('should close on blur', function () {
      var elm = compileDirective('default');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    });

    it('should correctly compile inner content', function () {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
      expect(elm.val()).toBe('');
    });

    it('should correctly set the default value', function () {
      var elm = compileDirective('default-value');
      expect(elm.val()).toBe(scope.states[1]);
    });

    it('should correctly filter the dropdown list when input changes', function () {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.states[0].substr(0, 2));
      expect(elm.val()).toBe(scope.states[0].substr(0, 2));
      angular.element(elm[0]).triggerHandler('input');
      elm.val(elm.val() + scope.states[0].substr(2, 4));
      expect(elm.val()).toBe(scope.states[0].substr(0, 2 + 4));
      angular.element(elm[0]).triggerHandler('input');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    });

    it('should correctly select a value', function () {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedState).toBe(scope.states[0]);
    });

    it('should only show one match when there is only one match left', function () {
      var elm = compileDirective('single-match');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 5)); // 00000
      expect(elm.val()).toBe(scope.codes[0].substr(0, 5));
      angular.element(elm[0]).triggerHandler('input');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(2); // 000000 & 000001
      elm.val(scope.codes[0].substr(0, 6)); // 000000
      expect(elm.val()).toBe(scope.codes[0].substr(0, 6));
      angular.element(elm[0]).triggerHandler('input');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1); // 000000
    });

    it('should correctly handle focus selection position', function () {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.states[0].substr(0, 2));
      angular.element(elm[0]).triggerHandler('input');
      elm.val(elm.val() + scope.states[0].substr(2, 4));
      expect(elm[0].selectionStart).toBe(6);
      expect(elm[0].selectionEnd).toBe(6);
      angular.element(elm[0]).triggerHandler('blur');
      angular.element(elm[0]).triggerHandler('focus');
      elm[0].setSelectionRange(0, 0);
      angular.element(elm[0]).triggerHandler('input');
      expect(elm[0].selectionStart).toBe(0);
      expect(elm[0].selectionEnd).toBe(0);
    });

    it('should correctly support a promise', function () {
      scope.getAsyncStates = function () {
        var deferred = $q.defer();
        deferred.resolve(['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']);
        return deferred.promise;
      };
      var elm = compileDirective('default-with-promise');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedState).toBe(scope.states[0]);
    });

    it('should not filter the results if the filter is false', function () {
      var elm = compileDirective('default-without-filter');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    });

    it('should not use a comparator if one is not set', function () {
      scope.comparator = '';

      var elm = compileDirective('comparator');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 3)); // 001
      expect(elm.val()).toBe(scope.codes[0].substr(0, 3));
      angular.element(elm[0]).triggerHandler('input');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(2); // 001000, 002001
    });

    it('should use the comparator if it is set', function () {
      scope.startsWith = function (actual, expected) { return actual.indexOf(expected) === 0; };
      scope.comparator = 'startsWith';

      var elm = compileDirective('comparator');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 3)); // 001
      expect(elm.val()).toBe(scope.codes[0].substr(0, 3));
      angular.element(elm[0]).triggerHandler('input');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1); // Our comparator should only match the beginning - 001000
    });

    it('should support ngRepeat markup', function () {
      var elm = compileDirective('markup-ngRepeat');
      angular.element(elm.find('[bs-typeahead]:eq(0)')).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    });

    it('should support objectValue markup', function () {
      var elm = compileDirective('markup-objectValue');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[0].label);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[0]);
      expect(elm.val()).toBe(jQuery('div').html(scope.icons[0].label).text().trim());
    });

    it('should support custom objectValue markup', function () {
      var elm = compileDirective('markup-objectValue-custom');
      scope.selectedIcon = scope.icons[1];
      scope.$digest();
      expect(elm.val()).toBe(jQuery('<div></div>').html(scope.icons[1].fr_FR).text().trim());
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[1].fr_FR);
      elm.val('');
      angular.element(elm[0]).triggerHandler('input');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[0]);
      expect(elm.val()).toBe(jQuery('<div></div>').html(scope.icons[0].fr_FR).text().trim());
    });

    it('should support custom label with renewed source', function () {
      var elem = compileDirective('markup-renew-items');
      var target = scope.icons()[0];

      elem.val('');
      angular.element(elem[0]).triggerHandler('focus');
      scope.$digest();
      expect(sandboxEl.find('.dropdown-menu li a').length).toBe(4);

      elem.val(target.alt);
      angular.element(elem[0]).triggerHandler('change');
      scope.$digest();
      expect(elem.val()).toBe(target.alt);

      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      scope.$digest();

      expect(elem.val()).toBe(target.alt);
    });

    it('should support numeric values', function () {
      var elm = compileDirective('default', {states: [1, 2, 3]});
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe('1');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedState).toBe(scope.states[0]);
      expect(elm.val()).toBe(jQuery('div').html(scope.states[0]).text().trim());
    });

    it('should use the model value if the display value cannot be determined', function () {
      var elm = compileDirective('markup-objectValue', {}, function (scope) { scope.selectedIcon = 'Ge'; });
      expect(elm.val()).toBe('Ge'); // display value will be undefined, use model value for display
    });

    it('should use \'\' if the  model is an object and the display value cannot be determined', function () {
      var elm = compileDirective('markup-objectValue', {}, function (scope) { scope.selectedIcon = {}; });
      expect(elm.val()).toBe('');
    });

    it('should add the autocomplete attribute if one is not already present', function () {
      var elm = compileDirective('default');
      expect(elm.attr('autocomplete')).toBe('off');
    });

    it('should not change an already present autocomplete attribute', function () {
      var elm = compileDirective('default-autocomplete-present');
      expect(elm.attr('autocomplete')).toBe('thisShouldNotChange');
    });
  });

  describe('ngModel', function () {

    it('should correctly render', function () {
      var elm = compileDirective('by-id');
      expect(elm.val()).toBe(scope.icons[scope.selectedIcon].value);
    });

    it('should correctly render a model set to falsy value', function () {
      var elm = compileDirective('by-id', {selectedIcon: 0});
      expect(elm.val()).toBe(scope.icons[scope.selectedIcon].value);
    });

  });

  describe('bsOptions', function () {

    it('should correctly watch for changes', function () {
      var elm = compileDirective('watch-options');
      scope.states.shift();
      scope.$digest();
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.states[0]);
    });

  });

  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade` animation', function () {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function () {
        var elm = compileDirective('options-animation');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function () {
      var $$rAF,
        $timeout;

      beforeEach(inject(function (_$$rAF_, _$timeout_) {
        $$rAF = _$$rAF_;
        $timeout = _$timeout_;
      }));

      it('should default to `top` placement', function () {
        var elm = compileDirective('default');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function () {
        var elm = compileDirective('options-placement');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function () {
        var elm = compileDirective('options-placement-exotic');
        angular.element(elm[0]).triggerHandler('focus');
        $$rAF.flush();
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

      it('should re-apply placement when the results change', function () {
        var typeahead = $typeahead($('<input>'), null, {placement: 'top'});
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $$rAF.flush();
        expect(typeahead.$applyPlacement).toHaveBeenCalled();
      });

      it('should not re-apply placement when the results change if the placement is bottom', function () {
        var typeahead = $typeahead($('<input>'), null, {placement: 'bottom'});
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).not.toHaveBeenCalled();
      });

      it('should not re-apply placement when the results change if the placement is bottom-left', function () {
        var typeahead = $typeahead($('<input>'), null, {placement: 'bottom-left'});
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).not.toHaveBeenCalled();
      });

      it('should not re-apply placement when the results change if the placement is bottom-right', function () {
        var typeahead = $typeahead($('<input>'), null, {placement: 'bottom-right'});
        spyOn(typeahead, '$applyPlacement');
        typeahead.update([]);

        $timeout.flush();
        expect(typeahead.$applyPlacement).not.toHaveBeenCalled();
      });
    });

    describe('trigger', function () {

      it('should support an alternative trigger', function () {
        var elm = compileDirective('options-trigger');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('html', function () {

      it('should correctly compile inner content when truthy', function () {
        var elm = compileDirective('options-html', {html: 'true'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[0].label);
      });

      it('should NOT compile inner content when falsy', function () {
        var elm = compileDirective('options-html', {html: 'false'});
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).not.toBe(scope.icons[0].label);
      });

    });

    describe('container', function () {

      it('should put typeahead in a container when specified', function () {
        var testElm = $('<div id="testElm"></div>');
        sandboxEl.append(testElm);
        var elm = compileDirective('options-container', angular.extend({}, templates.default.scope, {container: '#testElm'}));
        angular.element(elm[0]).triggerHandler('focus');
        expect(testElm.find('ul.typeahead').length).toBe(1);
      });

      it('should put typeahead in sandbox when container is falsy', function () {
        var elm = compileDirective('options-container', angular.extend({}, templates.default.scope, {container: 'false'}));
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('ul.typeahead').length).toBe(1);
      });

    });

    describe('template', function () {

      it('should support custom template', function () {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner">foo: {{states.length}}</div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: ' + scope.states.length);
      });

      it('should support template with ngRepeat', function () {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><ul><li ng-repeat="state in states">{{state}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe(scope.states.join(''));
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe(scope.states.join(''));
      });

      it('should support template with ngClick', function () {
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

    describe('trimValue', function () {

      it('should correctly trim model value when truthy', function () {
        var elm = compileDirective('options-trimValue', {trimValue: 'true'});
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
        expect(elm.val()).toBe(scope.states[0].trim());
      });

      it('should NOT trim model value when falsy', function () {
        var elm = compileDirective('options-trimValue', {trimValue: 'false'});
        angular.element(elm[0]).triggerHandler('focus');
        angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
        expect(elm.val()).toBe(scope.states[0]);
      });

    });

  });

  describe('minLength', function () {

    it('should not throw when ngModel.$viewValue is undefined', function () {
      var elm = compileDirective('options-minLength', {}, function (scope) { delete scope.selectedState; });
      scope.$digest();
      expect(scope.$$childHead.$isVisible).not.toThrow();
    });

    it('should should show options on focus when minLength is 0', function () {
      var elm = compileDirective('options-minLength', {}, function (scope) { delete scope.selectedState; });
      angular.element(elm[0]).triggerHandler('focus');
      scope.$digest();
      expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
      expect(scope.$$childHead.$isVisible()).toBeTruthy();
    });

  });

  describe('autoSelect', function () {

    it('should not auto-select the first match upon meeting minLength', function () {
      var elm = compileDirective('options-minLength', {});
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').hasClass('active')).not.toBeTruthy();
    });

    it('should auto-select the first match upon meeting minLength', function () {
      var elm = compileDirective('options-autoSelect', {});
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li').hasClass('active')).toBeTruthy();
    });

  });

  describe('onBeforeShow', function() {

    it('should invoke beforeShow event callback', function() {
      var beforeShow = false;

      function onBeforeShow(select) {
        beforeShow = true;
      }

      var elm = compileDirective('options-events', {onBeforeShow: onBeforeShow});

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).val('alab');

      expect(beforeShow).toBe(true);
    });
  });

  describe('onShow', function() {

    it('should invoke show event callback', function() {
      var show = false;

      function onShow(select) {
        show = true;
      }

      var elm = compileDirective('options-events', {onShow: onShow});

      angular.element(elm[0]).triggerHandler('focus');
      $animate.flush();

      expect(show).toBe(true);
    });
  });

  describe('onBeforeHide', function() {

    it('should invoke beforeHide event callback', function() {
      var beforeHide = false;

      function onBeforeHide(select) {
        beforeHide = true;
      }

      var elm = compileDirective('options-events', {onBeforeHide: onBeforeHide});

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');

      expect(beforeHide).toBe(true);
    });
  });

  describe('onHide', function() {

    it('should invoke show event callback', function() {
      var hide = false;

      function onHide(select) {
        hide = true;
      }

      var elm = compileDirective('options-events', {onHide: onHide});

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(elm[0]).triggerHandler('blur');
      $animate.flush();

      expect(hide).toBe(true);
    });
  });

  describe('onSelect', function() {

    it('should invoke the onSelect callback', function () {
      var selected = null;

      function onSelect(value, index, select) {
        selected = index;
      }

      var elm = compileDirective('options-events', {onSelect: onSelect});

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a').get(0)).triggerHandler('click');

      expect(selected).toBe(1);
    });
  });

  describe('select event', function () {

    it('should dispatch .select event when item is selected', function () {
      var elm = compileDirective('default');

      var selected = null;
      scope.$on('$typeahead.select', function (evt, value, index, typeahead) {
        selected = index;
      });

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a').get(0)).triggerHandler('click');

      expect(selected).toBe(1);
    });

    it('should call .select event with typeahead element instance id', function () {
      var elm = compileDirective('default-with-id');

      var id = '';
      scope.$on('$typeahead.select', function (evt, value, index, typeahead) {
        id = typeahead.$id;
      });

      angular.element(elm[0]).triggerHandler('focus');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a').get(0)).triggerHandler('click');

      expect(id).toBe('typeahead1');
    });
  });

  describe('prefix', function () {
    it('should dispatch namespaced events from provider', function () {
      var fauxController = {$setViewValue : angular.noop, $render : angular.noop};
      var myTypeahead = $typeahead(sandboxEl, fauxController, {prefixEvent: 'datepicker'});
      var emit = spyOn(myTypeahead.$scope, '$emit');
      scope.$digest();
      myTypeahead.show();
      myTypeahead.hide();
      var option = {value : 'Canada'};
      myTypeahead.update([option]);
      myTypeahead.select(0);
      $animate.flush();

      expect(emit).toHaveBeenCalledWith('datepicker.show.before', myTypeahead);
      expect(emit).toHaveBeenCalledWith('datepicker.show', myTypeahead);
      expect(emit).toHaveBeenCalledWith('datepicker.hide.before', myTypeahead);
      expect(emit).toHaveBeenCalledWith('datepicker.hide', myTypeahead);
      expect(emit).toHaveBeenCalledWith('datepicker.select', option.value, 0, myTypeahead);
    });

    it('should dispatch namespaced events from directive', function () {
      var elm = compileDirective('default-with-namespace');

      var select, showBefore, show, hideBefore, hide;
      scope.$on('datepicker.select', function () {
        select = true;
      });
      scope.$on('datepicker.show.before', function () {
        showBefore = true;
      });
      scope.$on('datepicker.show', function () {
        show = true;
      });
      scope.$on('datepicker.hide.before', function () {
        hideBefore = true;
      });
      scope.$on('datepicker.hide', function () {
        hide = true;
      });

      angular.element(elm[0]).triggerHandler('focus');
      $animate.flush();
      angular.element(sandboxEl.find('.dropdown-menu li:eq(1) a')[0]).triggerHandler('click');
      angular.element(elm[0]).triggerHandler('blur');
      $animate.flush();

      expect(select).toBe(true);
      expect(show).toBe(true);
      expect(hide).toBe(true);
    });

  });


});
