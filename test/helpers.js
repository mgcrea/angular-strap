'use strict';

beforeEach(function() {
  this.addMatchers({
    toEquals: function(expected) {
      this.message = function() {
        return 'Expected "' + angular.mock.dump(this.actual) + '" to equal "' + angular.mock.dump(expected) + '".';
      };
      return angular.equals(this.actual, expected);
    },
    toHaveClass: function(cls) {
      this.message = function() {
        return 'Expected "' + angular.mock.dump(this.actual) + '" to have class "' + cls + '".';
      };
      return this.actual.hasClass(cls);
    }
  });
});
