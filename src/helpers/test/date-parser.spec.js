'use strict';

describe('dateParser', function () {

  var $compile, scope, $dateParser, parser;

  var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non velit nulla. Suspendisse sit amet tempus diam. Sed at ultricies neque. Suspendisse id felis a sem placerat ornare. Donec auctor, purus at molestie tempor, arcu enim molestie lacus, ac imperdiet massa urna eu massa. Praesent velit tellus, scelerisque a fermentum ut, ornare in diam. Phasellus egestas molestie feugiat. Vivamus sit amet viverra metus.';

  beforeEach(module('mgcrea.ngStrap.helpers.dateParser'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$dateParser_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $dateParser = _$dateParser_;
  }));

  function generateTestCases(tests) {
    tests.forEach(function(test) {
      it('should report isValid(' + test.val + ')=' + test.expect + ' (' + test.reason + ')', function() {
        expect(parser.isValid(test.val)).toBe(test.expect);
      });
    });
  }

  // Tests
  describe('isValid', function () {
    describe('date format is "y" (single digit year -- extremely permissive)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'y', strict: true});
        });
        generateTestCases([
          {val:'-1', expect:true, reason:'negative single digit, no prefix'},
          {val:'-01', expect:false, reason:'negative single digit, prefixed'},
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:false, reason:'double digit, prefixed'},
          {val:'199', expect:true, reason:'multi digit, no prefix'},
          {val:'0199', expect:false, reason:'multi digit, prefixed'},
          {val:'2099', expect:true, reason:'many digit, no prefix'},
          {val:'002099', expect:false, reason:'many digit, multiple prefixed'},
          {val:'10000', expect:false, reason:'only support 4-digit years'},
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'y', strict: false});
        });
        generateTestCases([
          {val:'-1', expect:true, reason:'negative single digit, no prefix'},
          {val:'-01', expect:true, reason:'negative single digit, prefixed'},
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:true, reason:'double digit, prefixed'},
          {val:'199', expect:true, reason:'multi digit, no prefix'},
          {val:'0199', expect:true, reason:'multi digit, prefixed'},
          {val:'2099', expect:true, reason:'many digit, no prefix'},
          {val:'002099', expect:true, reason:'many digit, multiple prefixed'},
          {val:'10000', expect:false, reason:'only support 4-digit years'},
        ]);
      });
    });

    describe('date format is "M" (single digit month)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'M', strict: true});
        });
        generateTestCases([
          {val:'0', expect:false, reason:'invalid date'},
          {val:'00', expect:false, reason:'invalid date'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:false, reason:'double digit, prefixed'},
          {val:'12', expect:true, reason:'double digit, no prefix'},
          {val:'13', expect:false, reason:'invalid date'}
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'M', strict: false});
        });
        generateTestCases([
          {val:'0', expect:false, reason:'invalid date'},
          {val:'00', expect:false, reason:'invalid date'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:true, reason:'double digit, prefixed'},
          {val:'12', expect:true, reason:'double digit, no prefix'},
          {val:'13', expect:false, reason:'invalid date'}
        ]);
      });
    });

    describe('date format is "d" (single digit date)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'd', strict: true});
        });
        generateTestCases([
          {val:'0', expect:false, reason:'invalid date'},
          {val:'00', expect:false, reason:'invalid date'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:false, reason:'double digit, prefixed'},
          {val:'31', expect:true, reason:'double digit, no prefix'},
          {val:'32', expect:false, reason:'invalid date'}
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'd', strict: false});
        });
        generateTestCases([
          {val:'0', expect:false, reason:'invalid date'},
          {val:'00', expect:false, reason:'invalid date'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:true, reason:'double digit, prefixed'},
          {val:'31', expect:true, reason:'double digit, no prefix'},
          {val:'32', expect:false, reason:'invalid date'}
        ]);
      });
    });

    describe('date format is "dd" (two-digit date)', function() {
      beforeEach(function() {
        parser = $dateParser({format: 'dd', strict: true});
      });
      generateTestCases([
        {val:'0', expect:false, reason:'invalid date'},
        {val:'00', expect:false, reason:'invalid date'},
        {val:'1', expect:false, reason:'single digit, no prefix'},
        {val:'01', expect:true, reason:'double digit, prefixed'},
        {val:'31', expect:true, reason:'double digit, no prefix'},
        {val:'32', expect:false, reason:'invalid date'}
      ]);
    });

    describe('date format is "h" (single digit hour, 12-hour clock)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'h', strict: true});
        });
        generateTestCases([
          {val:'0', expect:false, reason:'invalid in 12-hour clock'},
          {val:'00', expect:false, reason:'invalid in 12-hour clock'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:false, reason:'double digit, prefixed'},
          {val:'12', expect:true, reason:'double digit, no prefix'},
          {val:'13', expect:false, reason:'double digit, invalid hour'}
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'h', strict: false});
        });
        generateTestCases([
          {val:'0', expect:false, reason:'invalid in 12-hour clock'},
          {val:'00', expect:false, reason:'invalid in 12-hour clock'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:true, reason:'double digit, prefixed'},
          {val:'12', expect:true, reason:'double digit, no prefix'},
          {val:'13', expect:false, reason:'double digit, invalid hour'}
        ]);
      });
    });

    describe('date format is "H" (single digit hour, 24-hour clock)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'H', strict: true});
        });
        generateTestCases([
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:false, reason:'double digit, prefixed'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:false, reason:'double digit, prefixed'},
          {val:'23', expect:true, reason:'double digit, no prefix'},
          {val:'24', expect:false, reason:'double digit, invalid hour'}
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'H', strict: false});
        });
        generateTestCases([
          {val:'0', expect:true, reason:'single digit'},
          {val:'00', expect:true, reason:'double digit, prefixed'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:true, reason:'double digit, prefixed'},
          {val:'23', expect:true, reason:'double digit, no prefix'},
          {val:'24', expect:false, reason:'double digit, invalid hour'}
        ]);
      });
    });

    describe('date format is "m" (single digit minute)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'm', strict: true});
        });
        generateTestCases([
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:false, reason:'double digit, prefixed'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:false, reason:'double digit, prefixed'},
          {val:'59', expect:true, reason:'double digit, no prefix'},
          {val:'60', expect:false, reason:'double digit, too many minutes'}
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 'm', strict: false});
        });
        generateTestCases([
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:true, reason:'double digit, prefixed'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:true, reason:'double digit, prefixed'},
          {val:'59', expect:true, reason:'double digit, no prefix'},
          {val:'60', expect:false, reason:'double digit, too many minutes'}
        ]);
      });
    });

    describe('date format is "s" (single digit second)', function() {
      describe('strict=true', function() {
        beforeEach(function() {
          parser = $dateParser({format: 's', strict: true});
        });
        generateTestCases([
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:false, reason:'double digit, prefixed'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:false, reason:'double digit, prefixed'},
          {val:'59', expect:true, reason:'double digit, no prefix'},
          {val:'60', expect:false, reason:'double digit, too many seconds'}
        ]);
      });
      describe('strict=false', function() {
        beforeEach(function() {
          parser = $dateParser({format: 's', strict: false});
        });
        generateTestCases([
          {val:'0', expect:true, reason:'single digit, no prefix'},
          {val:'00', expect:true, reason:'double digit, prefixed'},
          {val:'1', expect:true, reason:'single digit, no prefix'},
          {val:'01', expect:true, reason:'double digit, prefixed'},
          {val:'59', expect:true, reason:'double digit, no prefix'},
          {val:'60', expect:false, reason:'double digit, too many seconds'}
        ]);
      });
    });
  });
});
