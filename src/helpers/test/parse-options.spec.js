'use strict';

describe('parseOptions', function () {

  var $compile, scope, $parseOptions;

  beforeEach(module('mgcrea.ngStrap.helpers.parseOptions'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$parseOptions_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $parseOptions = _$parseOptions_;
  }));

  function getParsedValues(parsedOptions) {
      var parsedValues = null;

      parsedOptions.valuesFn(scope, null)
        .then(function(values) {
          parsedValues = values;
        });

      scope.$digest();

      return parsedValues;
  }

  // Tests
  function generateParsedValuesLengthTests(parsedValues, optionsArray) {
      expect(parsedValues).toBeDefined();
      expect(parsedValues.length).toBe(optionsArray.length);
  }

  describe('for array data sources', function () {
    describe('with "label for value in array" format', function() {

      it('should support using objects', function() {
        scope.colors = [
          {name:'black', shade:'dark'},
          {name:'white', shade:'light'},
          {name:'red', shade:'dark'},
          {name:'blue', shade:'dark'},
          {name:'yellow', shade:'light'},
          {name:'false', shade:false},
          {name:'', shade:''}
        ];

        var parsedOptions = $parseOptions('color.name for color in colors');
        var parsedValues = getParsedValues(parsedOptions);
        generateParsedValuesLengthTests(parsedValues, scope.colors);

        angular.forEach(parsedValues, function(v) {
          expect(v.label).toBe(scope.colors[v.index].name);
          expect(v.value).toBe(scope.colors[v.index]);
        });
      });

      it('should support basic value types', function() {
        scope.values = [
          'true',
          'false',
          true,
          false,
          0,
          1,
          14.5,
          18.3,
          0.0,
          -1,
          new Date()
        ];
        var parsedOptions = $parseOptions('val for val in values');
        var parsedValues = getParsedValues(parsedOptions);
        generateParsedValuesLengthTests(parsedValues, scope.values);

        angular.forEach(parsedValues, function(v) {
          expect(v.label).toBe(scope.values[v.index]);
          expect(v.value).toBe(scope.values[v.index]);
        });
      });

      it('should support boolean values', function() {
        scope.values = [
          true,
          false
        ];
        var parsedOptions = $parseOptions('val for val in values');
        var parsedValues = getParsedValues(parsedOptions);
        generateParsedValuesLengthTests(parsedValues, scope.values);

        angular.forEach(parsedValues, function(v) {
          expect(v.label).toBe(scope.values[v.index]);
          expect(v.value).toBe(scope.values[v.index]);
        });
      });

      it('should support null/undefined/empty string values', function() {
        scope.values = [
          'true',
          undefined,
          'false',
          '',
          null
        ];
        var parsedOptions = $parseOptions('val for val in values');
        var parsedValues = getParsedValues(parsedOptions);
        generateParsedValuesLengthTests(parsedValues, scope.values);

        angular.forEach(parsedValues, function(v) {
          expect(v.label).toBe(scope.values[v.index]);
          expect(v.value).toBe(scope.values[v.index]);
        });
      });

      it('should support filtered values', function() {
        scope.values = [
          'foo',
          'bar',
          'baz'
        ];
        var parsedOptions = $parseOptions('val for val in values | filter:b:startsWith');
        var parsedValues = getParsedValues(parsedOptions);
        generateParsedValuesLengthTests(parsedValues, scope.values);

        angular.forEach(parsedValues, function(v) {
          expect(v.label).toBe(scope.values[v.index]);
          expect(v.value).toBe(scope.values[v.index]);
        });
      });

    });

    describe('with "select as label for value in array" format', function() {

      it('should support using objects', function() {
        scope.colors = [
          {name:'black', shade:'dark'},
          {name:'white', shade:'light'},
          {name:'red', shade:'dark'},
          {name:'blue', shade:'dark'},
          {name:'yellow', shade:'light'},
          {name:'false', shade:false},
          {name:'', shade:''}
        ];

        var parsedOptions = $parseOptions('color.shade as color.name for color in colors');
        var parsedValues = getParsedValues(parsedOptions);
        generateParsedValuesLengthTests(parsedValues, scope.colors);

        angular.forEach(parsedValues, function(v) {
          expect(v.label).toBe(scope.colors[v.index].name);
          expect(v.value).toBe(scope.colors[v.index].shade);
        });
      });

    });

    //
    // TODO: looks like group by it is not implemented yet ?
    //
    // describe('with "label group by group for value in array" format', function() {
    //
    //   it('should support using objects', function() {
    //     scope.colors = [
    //       {name:'black', shade:'dark'},
    //       {name:'white', shade:'light'},
    //       {name:'red', shade:'dark'},
    //       {name:'blue', shade:'dark'},
    //       {name:'yellow', shade:'light'},
    //       {name:'false', shade:false},
    //       {name:'', shade:''}
    //     ];
    //
    //     var parsedOptions = $parseOptions('color.name group by color.shade for color in colors');
    //     var parsedValues = getParsedValues(parsedOptions);
    //     // generateParsedValuesLengthTests(parsedValues, scope.colors);
    //
    //     // angular.forEach(parsedValues, function(v) {
    //     //   expect(v.label).toBe(scope.colors[v.index].name);
    //     //   expect(v.value).toBe(scope.colors[v.index].shade);
    //     // });
    //   });
    //
    // });

  });

  //
  // TODO: looks like this format is not implemented yet
  //
  // describe('for object data sources', function () {
  //   describe('with "label for (key , value) in object" format', function() {
  //
  //     it('should support using objects', function() {
  //       scope.colors = {
  //         black: 'Black',
  //         white: 'White',
  //         red: 'Red',
  //         blue: 'Blue',
  //         yellow: 'Yellow',
  //         none: false
  //       };
  //
  //       var parsedOptions = $parseOptions('value for (key, value) in colors');
  //       var parsedValues = getParsedValues(parsedOptions);
  //       generateParsedValuesLengthTests(parsedValues, scope.colors);
  //     });
  //
  //   });
  //
  // });
});
