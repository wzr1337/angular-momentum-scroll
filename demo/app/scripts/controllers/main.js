'use strict';

angular.module('demoApp')
  .controller('MainCtrl', function ($scope, $log) {
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
    $scope.log = function(msg) {$log.log(msg)};
  });
