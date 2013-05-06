'use strict';

describe('Directive: scrollable', function () {
  beforeEach(module('angular-momentum-scroll'));

  var element, scope;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<div scrollable parameters={{{foo:\'bar\' }}}><ul>' +
            '<li>Item1</li><li>Item2</li>' +
            '<li>Item3</li></ul></div>');
    scope = $rootScope.$new();
    element = $compile(element)($rootScope);
    expect(scope.parameters).toBe(undefined);
  }));
});
