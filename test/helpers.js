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

/*
 * Counts the number of scopes beginning with the
 * passed in scope s.
 * It counts scopes recursively by traversing each
 * of the child scopes.
 *
 * returns the number of scopes found
 *
 * s -> scope to begin with
 * count -> current scope count, should begin with 0
 */
function countScopes(s, count) {
  if (s !== null) {
    s = s.$$childHead;
    while (s !== null) {
      count = countScopes(s, count);
      s = s.$$nextSibling;
    }
  }
  return ++count;
}
