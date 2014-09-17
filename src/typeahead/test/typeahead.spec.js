'use strict';

describe('typeahead', function () {

  var $compile, $templateCache, $typeahead, scope, sandboxEl, $q;

  beforeEach(module('ngSanitize'));
  beforeEach(module('mgcrea.ngStrap.typeahead'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, _$typeahead_, _$q_) {
    scope = _$rootScope_.$new();
    sandboxEl = $('<div>').attr('id', 'sandbox').appendTo($('body'));
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $typeahead = _$typeahead_;
    $q = _$q_;
  }));

  afterEach(function() {
    scope.$destroy();
    sandboxEl.remove();
  });

  var statesArray = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  var stateObjs = [
    {"name":"Alabama","alpha-2":"AL"},
    {"name":"Alaska","alpha-2":"AK"},
    {"name":"Arizona","alpha-2":"AZ"},
    {"name":"Arkansas","alpha-2":"AR"},
    {"name":"California","alpha-2":"CA"},
    {"name":"Colorado","alpha-2":"CO"},
    {"name":"Connecticut","alpha-2":"CT"},
    {"name":"Delaware","alpha-2":"DE"},
    {"name":"District of Columbia","alpha-2":"DC"},
    {"name":"Florida","alpha-2":"FL"},
    {"name":"Georgia","alpha-2":"GA"},
    {"name":"Hawaii","alpha-2":"HI"},
    {"name":"Idaho","alpha-2":"ID"},
    {"name":"Illinois","alpha-2":"IL"},
    {"name":"Indiana","alpha-2":"IN"},
    {"name":"Iowa","alpha-2":"IA"},
    {"name":"Kansa","alpha-2":"KS"},
    {"name":"Kentucky","alpha-2":"KY"},
    {"name":"Lousiana","alpha-2":"LA"},
    {"name":"Maine","alpha-2":"ME"},
    {"name":"Maryland","alpha-2":"MD"},
    {"name":"Massachusetts","alpha-2":"MA"},
    {"name":"Michigan","alpha-2":"MI"},
    {"name":"Minnesota","alpha-2":"MN"},
    {"name":"Mississippi","alpha-2":"MS"},
    {"name":"Missouri","alpha-2":"MO"},
    {"name":"Montana","alpha-2":"MT"},
    {"name":"Nebraska","alpha-2":"NE"},
    {"name":"Nevada","alpha-2":"NV"},
    {"name":"New Hampshire","alpha-2":"NH"},
    {"name":"New Jersey","alpha-2":"NJ"},
    {"name":"New Mexico","alpha-2":"NM"},
    {"name":"New York","alpha-2":"NY"},
    {"name":"North Carolina","alpha-2":"NC"},
    {"name":"North Dakota","alpha-2":"ND"},
    {"name":"Ohio","alpha-2":"OH"},
    {"name":"Oklahoma","alpha-2":"OK"},
    {"name":"Oregon","alpha-2":"OR"},
    {"name":"Pennsylvania","alpha-2":"PA"},
    {"name":"Rhode Island","alpha-2":"RI"},
    {"name":"South Carolina","alpha-2":"SC"},
    {"name":"South Dakota","alpha-2":"SD"},
    {"name":"Tennessee","alpha-2":"TN"},
    {"name":"Texas","alpha-2":"TX"},
    {"name":"Utah","alpha-2":"UT"},
    {"name":"Vermont","alpha-2":"VT"},
    {"name":"Virginia","alpha-2":"VA"},
    {"name":"Washington","alpha-2":"WA"},
    {"name":"West Virginia","alpha-2":"WV"},
    {"name":"Wisconsin","alpha-2":"WI"},
    {"name":"Wyoming","alpha-2":"WY"}
    ]


  // Templates

  var templates = {
    'default': {
      scope: {selectedState: '', states: statesArray},
      element: '<input type="text" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'default-value': {
      scope: {selectedState: 'Alaska', states: statesArray},
      element: '<input type="text" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'object-values': {
      scope: {selectedState: '', states: stateObjs
        , searchStates: searchStates},
      element: '<input type="text" ng-model="selectedState" ng-options="state as state.name for state in states" bs-typeahead>'
    },
    'watch-options': {
      element: '<input type="text" ng-model="selectedState" ng-options="state for state in states" data-watch-options="1" bs-typeahead>'
    },
    'single-match': {
      scope: {selectedCode: '', codes: ['000000', '000001']},
      element: '<input type="text" ng-model="selecteCode" ng-options="code for code in codes" bs-typeahead>'
    },
    'markup-ngRepeat': {
      scope: {selectedStates:{}, states:statesArray},
      element: '<ul><li ng-repeat="i in [\'first\', \'second\', \'third\']"><input type="text" ng-model="selectedStates[i]" ng-options="state for state in states" bs-typeahead></li></ul>'
    },
    'markup-objectValue': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon"  data-select-mode="1" data-html="1" ng-options="icon as icon.label for icon in icons" bs-typeahead>'
    },
    'markup-objectValue-custom': {
      scope: {selectedIcon: {}, icons: [{val: 'gear', fr_FR: '<i class="fa fa-gear"></i> Gear'}, {val: 'globe', fr_FR: '<i class="fa fa-globe"></i> Globe'}, {val: 'heart', fr_FR: '<i class="fa fa-heart"></i> Heart'}, {val: 'camera', fr_FR: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-select-mode="1" data-html="1" ng-options="icon as icon[\'fr_FR\'] for icon in icons" bs-typeahead>'
    },
    'options-animation': {
      element: '<input type="text" data-animation="am-flip-x" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'options-placement': {
      element: '<input type="text" data-placement="bottom" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'options-placement-exotic': {
      element: '<input type="text" data-placement="bottom-right" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'options-trigger': {
      element: '<input type="text" data-trigger="hover" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'options-html': {
      scope: {selectedIcon: '', icons: [{value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'}, {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'}, {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'}, {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}]},
      element: '<input type="text" class="form-control" ng-model="selectedIcon" data-html="1" ng-options="icon.value as icon.label for icon in icons" bs-typeahead>'
    },
    'options-template': {
      element: '<input type="text" data-template="custom" ng-model="selectedState" ng-options="state for state in states" bs-typeahead>'
    },
    'options-minLength': {
      element: '<input type="text" ng-model="selectedState" data-min-length="0" ng-options="state for state in states" bs-typeahead>'
    },
    'asynch-search': {
      scope: {selectedState: '', states: statesArray
        , searchStates: searchStates},
      element: '<input type="text" ng-model="selectedState" ng-options="state as state.name for state in searchStates($viewValue)" bs-typeahead>'
    }
  };

  function compileDirective(template, locals, attrs, hook) {
    template = templates[template];
    angular.extend(scope, template.scope || templates['default'].scope, locals);
    var element = $(template.element)

    angular.forEach(attrs, function(value, key) {
      this.attr(key,value);
    }, element);

    element = element.appendTo(sandboxEl);

    if(angular.isFunction(hook)) hook(scope);
    element = $compile(element)(scope);
    scope.$digest();
    return jQuery(element[0]);
  }

  function triggerKeyDown(elm, keyCode) {
    var evt = $.Event('keydown');
    evt.which = evt.keyCode = keyCode;
    angular.element(elm[0]).triggerHandler(evt);
  }

  // Async matches function
  function searchStates(search){
    var deferred  = $q.defer();
    // return $q(function(resolve, reject){
      setTimeout(function(){
        if(search === "") return deferred.resolve([]);
        var result = [];
        stateObjs.forEach(function(item){
          if(item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) result.push(item)
        })
        deferred.resolve(result);
      },500)
    // })
    return deferred.promise;
  }

  // Tests

  describe('with default template', function () {

    it('should only open on input that returns search results and always close on blur', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);

      elm.val('Al')
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(3);

      elm.val('Alx')
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);

      elm.val('Ala')
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(2);

      angular.element(elm[0]).triggerHandler('blur');
      expect(sandboxEl.children('.dropdown-menu').length).toBe(0);

    });

    // it('should open on focus', function() {
    //   var elm = compileDirective('default');
    //   expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    //   angular.element(elm[0]).triggerHandler('focus');
    //   expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
    // });

    // it('should close on blur', function() {
    //   var elm = compileDirective('default');
    //   expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    //   angular.element(elm[0]).triggerHandler('focus');
    //   angular.element(elm[0]).triggerHandler('blur');
    //   expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
    // });

    // it('should correctly compile inner content', function() {
    //   var elm = compileDirective('default');
    //   angular.element(elm[0]).triggerHandler('focus');
    //   expect(sandboxEl.find('.dropdown-menu li').length).toBe($typeahead.defaults.limit);
    //   expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    //   expect(elm.val()).toBe('');
    // });

    it('should correctly set the default value', function() {
      var elm = compileDirective('default-value');
      expect(elm.val()).toBe(scope.states[1]);
    });

    it('should correctly filter the dropdown list when input changes', function() {
      var elm = compileDirective('default');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.states[0].substr(0, 2));
      expect(elm.val()).toBe(scope.states[0].substr(0, 2));
      angular.element(elm[0]).triggerHandler('change');
      elm.val(elm.val() + scope.states[0].substr(2, 4));
      expect(elm.val()).toBe(scope.states[0].substr(0, 2 + 4));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1);
      expect(sandboxEl.find('.dropdown-menu li:eq(0)').text()).toBe(scope.states[0]);
    });

    it('should correctly select a value', function() {
      var elm = compileDirective('default');
      elm.val('a')
      angular.element(elm[0]).triggerHandler('change');
      angular.element(sandboxEl.find('.dropdown-menu li:eq(2) a').get(0)).triggerHandler('click');
      expect(scope.selectedState).toBe(scope.states[2]); //Arizona
    });

    it('should only show one match when there is only one match left', function () {
      var elm = compileDirective('single-match');
      angular.element(elm[0]).triggerHandler('focus');
      elm.val(scope.codes[0].substr(0, 5)); // 00000
      expect(elm.val()).toBe(scope.codes[0].substr(0, 5));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(2); // 000000 & 000001
      elm.val(scope.codes[0].substr(0, 6)); // 000000
      expect(elm.val()).toBe(scope.codes[0].substr(0, 6));
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li').length).toBe(1); // 000000
    });

    // @TODO
    // it('should correctly select a value', function(done) {
    //   var elm = compileDirective('default');
    //   angular.element(elm[0]).triggerHandler('focus');
    //   elm.val('notintthelist');
    // });

    it('should support ngRepeat markup', function() {
      var elm = compileDirective('markup-ngRepeat');

      // get first input and chande value to "a"
      var firstInput = angular.element(elm.find('[bs-typeahead]:eq(0)'));
      firstInput.val("a") //should return more then the typeahead limit
      angular.element(firstInput[0]).triggerHandler('change');

      // typeahead should be visible and model value set
      var listItems = angular.element(elm.find('.dropdown-menu:eq(0) li'));
      var firstItem = angular.element(listItems[0])
      expect(listItems.length).toBe($typeahead.defaults.limit);
      expect(firstItem.text()).toBe(scope.states[0]);
      expect(scope.selectedStates.first).toBe('a');

      // selecting from list should update view and model values
      angular.element(firstItem.find('a')).triggerHandler('click');
      expect(firstInput.val()).toBe(scope.states[0]);
      expect(scope.selectedStates.first).toBe(scope.states[0]);

    });

  });

  describe('with object values', function () {

    it('should support objectValue markup', function() {
      var elm = compileDirective('markup-objectValue');
      elm.val('a')
      angular.element(elm[0]).triggerHandler('change');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[0].label);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[0]);
      expect(elm.val()).toBe(jQuery('div').html(scope.icons[0].label).text().trim());
    });


    it('should support custom objectValue markup', function() {
      var elm = compileDirective('markup-objectValue-custom');
      scope.selectedIcon = scope.icons[1];
      scope.$digest();
      expect(elm.val()).toBe(jQuery('<div></div>').html(scope.icons[1].fr_FR).text().trim());
      angular.element(elm[0]).triggerHandler('focus');
      expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[1].fr_FR);
      angular.element(sandboxEl.find('.dropdown-menu li:eq(0) a').get(0)).triggerHandler('click');
      expect(scope.selectedIcon).toBe(scope.icons[1]);
      expect(elm.val()).toBe(jQuery('<div></div>').html(scope.icons[1].fr_FR).text().trim());
    });

    it('should correctly set the viewValue for default object', function() {
      var elm = compileDirective('object-values',{selectedState: {"name":"California","alpha-2":"CA"}});
      expect(elm.val()).toBe(scope.states[4].name);
    });

  });

  describe('ngOptions', function () {

    // // what is the usecase for watchOptions??
    // it('should correctly watch for changes', function() {
    //   var elm = compileDirective('watch-options');
    //   scope.states.shift();
    //   scope.$digest();
    //   angular.element(elm[0]).triggerHandler('focus');
    //   expect(sandboxEl.find('.dropdown-menu li:eq(0)').text().trim()).toBe(scope.states[0]);
    // });

    it('should allow async search', function() {
      var elm = compileDirective('asynch-search');

      runs(function(){
        angular.element(elm[0]).triggerHandler('focus');
        elm.val('Al')
        angular.element(elm[0]).triggerHandler('change');
      });

      waits(1000);

      runs(function(){
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(3);
      });
    });

  });

  describe('options', function () {

    describe('animation', function () {

      it('should default to `am-fade` animation', function() {
        var elm = compileDirective('default');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-fade')).toBeTruthy();
      });

      it('should support custom animation', function() {
        var elm = compileDirective('options-animation');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.children('.dropdown-menu').hasClass('am-flip-x')).toBeTruthy();
      });

    });

    describe('placement', function () {

      it('should default to `top` placement', function() {
        var elm = compileDirective('default');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-left')).toBeTruthy();
      });

      it('should support placement', function() {
        var elm = compileDirective('options-placement');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom')).toBeTruthy();
      });

      it('should support exotic-placement', function() {
        var elm = compileDirective('options-placement-exotic');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.children('.dropdown-menu').hasClass('bottom-right')).toBeTruthy();
      });

    });

    describe('trigger', function () {

      it('should support an alternative trigger', function() {
        var elm = compileDirective('options-trigger');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
        angular.element(elm[0]).triggerHandler('mouseenter');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(1);
        angular.element(elm[0]).triggerHandler('mouseleave');
        expect(sandboxEl.children('.dropdown-menu').length).toBe(0);
      });

    });

    describe('html', function () {

      it('should correctly compile inner content', function() {
        var elm = compileDirective('options-html');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(scope.icons.length);
        expect(sandboxEl.find('.dropdown-menu li:eq(0) a').html()).toBe(scope.icons[0].label);
      });

    });

    describe('template', function () {

      it('should support custom template', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner">foo: {{states.length}}</div></div>');
        var elm = compileDirective('options-template');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe('foo: ' + scope.states.length);
      });

      it('should support template with ngRepeat', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><ul><li ng-repeat="state in states">{{state}}</li></ul></div></div>');
        var elm = compileDirective('options-template');
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe(scope.states.join(''));
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(sandboxEl.find('.dropdown-inner').text()).toBe(scope.states.join(''));
      });

      it('should support template with ngClick', function() {
        $templateCache.put('custom', '<div class="dropdown-menu"><div class="dropdown-inner"><a class="btn" ng-click="dropdown.counter=dropdown.counter+1">click me</a></div></div>');
        var elm = compileDirective('options-template');
        scope.dropdown = {counter: 0};
        elm.val('a')
        angular.element(elm[0]).triggerHandler('change');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(1);
        // Consecutive toggles
        angular.element(elm[0]).triggerHandler('blur');
        angular.element(elm[0]).triggerHandler('focus');
        expect(angular.element(sandboxEl.find('.dropdown-inner > .btn')[0]).triggerHandler('click'));
        expect(scope.dropdown.counter).toBe(2);
      });

    });

  });

  // describe('minLength', function() {
  //   it('should not throw when ngModel.$viewValue is undefined', function() {
  //     var elm = compileDirective('options-minLength', {}, function(scope) { delete scope.selectedState; });
  //     scope.$digest();
  //     expect(scope.$$childHead.$isVisible).not.toThrow();
  //   });
  // });

  describe('with selectMode', function() { //also using async search
    it('should only update model on valid selection', function() {
      var elm = compileDirective('asynch-search',{},{select_mode:"1"});

      runs(function(){
        angular.element(elm[0]).triggerHandler('focus');
        elm.val('Al')
        angular.element(elm[0]).triggerHandler('change');
      });

      waits(1000);

      runs(function(){
        scope.$digest();
        expect(sandboxEl.find('.dropdown-menu li').length).toBe(3);
        expect(scope.selectedState).toBeUndefined();
        angular.element(sandboxEl.find('.dropdown-menu li:eq(2) a').get(0)).triggerHandler('click');
        expect(scope.selectedState).toBe(stateObjs[4]);
      });
    });
  });

  // describe('with formatter', function() {
  //   it('should allow default value to be an object', function() {
  //
  //   });
  // });

});
