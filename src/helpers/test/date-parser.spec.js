'use strict';

describe('dateParser', function () {

  var $compile, scope, $dateParser, parser, $locale;

  var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non velit nulla. Suspendisse sit amet tempus diam. Sed at ultricies neque. Suspendisse id felis a sem placerat ornare. Donec auctor, purus at molestie tempor, arcu enim molestie lacus, ac imperdiet massa urna eu massa. Praesent velit tellus, scelerisque a fermentum ut, ornare in diam. Phasellus egestas molestie feugiat. Vivamus sit amet viverra metus.';

  beforeEach(module('mgcrea.ngStrap.helpers.dateParser'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$dateParser_, _$locale_) {
    scope = _$rootScope_;
    $compile = _$compile_;
    $dateParser = _$dateParser_;
    $locale = _$locale_;
  }));

  function generateTestCases(tests) {
    tests.forEach(function(test) {
      it('should report isValid(' + test.val + ')=' + test.expect + ' (' + test.reason + ')', function() {
        expect(parser.isValid(test.val)).toBe(test.expect);
      });
    });
  }

  function generateTestCasesForParsing(tests) {
    tests.forEach(function(test) {
      it('should return parse(' + test.val + ')=' + test.expect + ' (' + test.reason + ')', function() {
        expect(parser.parse(test.val)).toEqual(test.expect);
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

    describe('date format is "MMM" (month initials)', function() {
      beforeEach(function() {
        $locale.id = 'en-US';
        parser = $dateParser({format: 'MMM'});
      });
      generateTestCases([
        {val:'Feb', expect:true, reason:'standard month initials'},
        {val:'FEB', expect:true, reason:'upper case month initials'},
        {val:'feb', expect:true, reason:'lower case month initials'},
        {val:'Fab', expect:false, reason:'invalid month initials'},
      ]);
    });

    describe('date format is "MMMM" (month name)', function() {
      beforeEach(function() {
        $locale.id = 'en-US';
        parser = $dateParser({format: 'MMMM'});
      });
      generateTestCases([
        {val:'February', expect:true, reason:'standard month name'},
        {val:'FEBRUARY', expect:true, reason:'upper case month name'},
        {val:'february', expect:true, reason:'lower case month name'},
        {val:'Fabulous', expect:false, reason:'invalid month name'},
      ]);
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

  describe('parse', function () {

    describe('date format "dd/MM/yyyy"', function() {
      beforeEach(function() {
        parser = $dateParser({ format: 'dd/MM/yyyy' });
      });
      generateTestCasesForParsing([
        {val:'01/01/2014', expect: new Date(2014,0,1), reason:'4 digit year with leading digits'},
        {val:'20/10/2014', expect: new Date(2014,9,20), reason:'4 digit year unambiguous day/month'},
        {val:'10/10/2014', expect: new Date(2014,9,10), reason:'4 digit year ambiguous day/month'},
        {val:'10/10/1814', expect: new Date(1814,9,10), reason:'4 digit year ambiguous day/month with different century'},
        {val:'30/02/2014', expect: false, reason:'non-existing month day'},
      ]);
    });

    describe('date format "M/d/y"', function() {
      beforeEach(function() {
        parser = $dateParser({ format: 'M/d/y' });
      });
      generateTestCasesForParsing([
        {val: '1/1/1',    expect: new Date(1,0,1),    reason:'1 digit year gives one digit year'},
        {val: '1/1/00',   expect: new Date(2000,0,1), reason:'2 digit year less than fifty gives current century'},
        {val: '1/1/50',   expect: new Date(2050,0,1), reason:'2 digit year equal to fifty gives current century'},
        {val: '1/1/51',   expect: new Date(1951,0,1), reason:'2 digit year greater than fifty gives previous century'},
        {val: '1/1/99',   expect: new Date(1999,0,1), reason:'2 digit year, maximum possible, gives previous century'},
        {val: '1/1/123',  expect: new Date(123,0,1),  reason:'3 digit year gives three digit year'},
        {val: '1/1/2015', expect: new Date(2015,0,1), reason:'4 digit year gives four digit year'},
      ]);
    });

    describe('date format "dd/MM/yyyy" with base values', function() {

      var tests = [
        { val: '01/09/1998', baseVal: new Date(1998,7,31), expect: new Date(1998,8,1) },
        { val: '01/09/2014', baseVal: new Date(2014,7,31), expect: new Date(2014,8,1) },
        { val: '01/02/2014', baseVal: new Date(2014,0,31), expect: new Date(2014,1,1) },
        { val: '31/08/2014', baseVal: new Date(2014,1,25), expect: new Date(2014,7,31) },
        { val: '45/20/2014', baseVal: new Date(2014,1,25), expect: false },
        { val: '2014/08/31', baseVal: new Date(2014,1,25), expect: false },
        { val: '2014', baseVal: new Date(2014,1,25), expect: false },
        { val: 'Jan', baseVal: new Date(2014,1,25), expect: false },
        { val: '31/09/2014', baseVal: new Date(2014,1,25), expect: false },
      ];

      beforeEach(function() {
        parser = $dateParser({ format: 'dd/MM/yyyy' });
      });

      tests.forEach(function(test) {
        it('should parse value (' + test.val + ') with base value (' + test.baseVal + ')', function() {
          expect(parser.parse(test.val, test.baseVal)).toEqual(test.expect);
        });
      });

    });

    describe('date format "yyyy/MM/dd" with base values', function() {

      var tests = [
        { val: '1998/09/01', baseVal: new Date(1998,7,31), expect: new Date(1998,8,1) },
        { val: '2014/09/01', baseVal: new Date(2014,7,31), expect: new Date(2014,8,1) },
        { val: '2014/02/01', baseVal: new Date(2014,0,31), expect: new Date(2014,1,1) },
        { val: '2014/08/31', baseVal: new Date(2014,1,25), expect: new Date(2014,7,31) },
        { val: '2014/20/45', baseVal: new Date(2014,1,25), expect: false },
        { val: '31/08/2014', baseVal: new Date(2014,1,25), expect: false },
        { val: '2014', baseVal: new Date(2014,1,25), expect: false },
        { val: 'Jan', baseVal: new Date(2014,1,25), expect: false },
        { val: '2014/09/31', baseVal: new Date(2014,1,25), expect: false },
      ];

      beforeEach(function() {
        parser = $dateParser({ format: 'yyyy/MM/dd' });
      });

      tests.forEach(function(test) {
        it('should parse value (' + test.val + ') with base value (' + test.baseVal + ')', function() {
          expect(parser.parse(test.val, test.baseVal)).toEqual(test.expect);
        });
      });

    });

    describe('date format is "MMM" (month initials)', function() {
      beforeEach(function() {
        $locale.id = 'en-US';
        parser = $dateParser({format: 'MMM'});
      });
      generateTestCasesForParsing([
        {val:'Feb', expect:new Date(1970,1,1), reason:'standard month initials'},
        {val:'FEB', expect:new Date(1970,1,1), reason:'upper case month initials'},
        {val:'feb', expect:new Date(1970,1,1), reason:'lower case month initials'},
        {val:'Fab', expect:false, reason:'invalid month initials'},
      ]);
    });

    describe('date format is "MMMM" (month name)', function() {
      beforeEach(function() {
        $locale.id = 'en-US';
        parser = $dateParser({format: 'MMMM'});
      });
      generateTestCasesForParsing([
        {val:'February', expect:new Date(1970,1,1), reason:'standard month name'},
        {val:'FEBRUARY', expect:new Date(1970,1,1), reason:'upper case month name'},
        {val:'february', expect:new Date(1970,1,1), reason:'lower case month name'},
        {val:'Fabulous', expect:false, reason:'invalid month name'},
      ]);
    });

  });
});
