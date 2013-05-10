'use strict';

angular.module('demoApp')
  .controller('MainCtrl', function ($scope, $log, $timeout) {
    $scope.awesomeThings = [
      'scroll me down',
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'iScroll',
      'momentum',
      'Demo',
      'Github',
      'HTML5',
      'Javascript',
      '-- and again --',
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'iScroll',
      'momentum',
      'Demo',
      'Github',
      'HTML5',
      'Javascript',
      '-- and again --',
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'iScroll',
      'momentum',
      'Demo',
      'Github',
      'HTML5',
      'Javascript',
      '-- and again --',
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'iScroll',
      'momentum',
      'Demo',
      'Github',
      'HTML5',
      'Javascript'
    ];
    $scope.logger = [];
    $scope.log = function(pageX, pageY) {
      $scope.logger.push('From callback: pageX ' + pageX + ' pageY ' + pageY);
      };
    $scope.$watch('currPageY', function() {
      $scope.logger.push('From scope: pageX ' + $scope.currPageX + ' pageY ' + $scope.currPageY);
    });
    $timeout(function() {
      $scope.currPageY = 5;
    }, 1000);
    $timeout(function() {
      $scope.currPageY = 10;
    }, 2000);
    $timeout(function() {
      $scope.awesomeThings.splice(0, 0, 'foo');
      $scope.awesomeThings.push('bar');
    }, 3000);
  });
