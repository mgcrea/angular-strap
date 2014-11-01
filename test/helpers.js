'use strict';

beforeEach(function() {
  jasmine.addMatchers({
    toEquals: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var result = {};
          result.pass = angular.equals(actual, expected);
          result.message = 'Expected "' + angular.mock.dump(actual) + '" to equal "' + angular.mock.dump(expected) + '".';
          return result;
        }
      };
    },
    toHaveClass: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var result = {};
          result.pass = actual.hasClass(expected);
          result.message = 'Expected "' + angular.mock.dump(actual) + '" to have class "' + expected + '".';
          return result;
        }
      };
    }
  });
});
