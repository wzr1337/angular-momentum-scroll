'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('demoApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(40);
  });

  it('should attach a current values equal to 0 to the scope', function () {
    expect(scope.currX).toBe(0);
    expect(scope.currY).toBe(0);
    expect(scope.currPageX).toBe(0);
    expect(scope.currPageY).toBe(0);
    expect(scope.isMaxY).toBe(false);
    expect(scope.isMinY).toBe(false);
    expect(scope.iScrollParameters).toEqual(jasmine.any(Object));
  });

  it('should append an item to the of awesomeThings on the scope', function () {
    var _len = scope.awesomeThings.length;
    scope.append('appended item');
    expect(scope.awesomeThings.length).toBe(_len + 1);
    expect(scope.awesomeThings[_len]).toEqual('appended item');
  });

  it('should prepend an item to the of awesomeThings on the scope', function () {
    var _len = scope.awesomeThings.length;
    scope.prepend('prepended item');
    expect(scope.awesomeThings.length).toBe(_len + 1);
    expect(scope.awesomeThings[0]).toEqual('prepended item');
  });
});
