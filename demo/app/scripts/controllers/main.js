'use strict';

angular.module('demoApp')
  .controller('MainCtrl', function ($scope, $log) {
    $scope.currX = 0;
    $scope.currY = 0;
    $scope.currPageX = 0;
    $scope.currPageY = 0;
    $scope.isMaxY = false;
    $scope.isMinY = false;
    $scope.awesomeThings = [
      '01 scroll me down',
      '02 HTML5 Boilerplate',
      '03 AngularJS',
      '04 Karma',
      '05 iScroll',
      '06 momentum',
      '07 Demo',
      '08 Github',
      '09 HTML5',
      '10 Javascript',
      '11 -- and again --',
      '12 HTML5 Boilerplate',
      '13 AngularJS',
      '14 Karma',
      '15 iScroll',
      '16 momentum',
      '17 Demo',
      '18 Github',
      '19 HTML5',
      '20 Javascript',
      '21 -- and again --',
      '22 HTML5 Boilerplate',
      '23 AngularJS',
      '24 Karma',
      '25 iScroll',
      '26 momentum',
      '27 Demo',
      '28 Github',
      '29 HTML5',
      '30 Javascript',
      '31 -- and again --',
      '32 HTML5 Boilerplate',
      '33 AngularJS',
      '34 Karma',
      '35 iScroll',
      '36 momentum',
      '37 Demo',
      '38 Github',
      '39 HTML5',
      '40 Javascript'
    ];

    // setup scollable controller
    $scope.scrollableControl = {};

    // setup the scroller
    $scope.iScrollParameters = {vScroll:true, vScrollbar: true, snap : 'li'};
    // setup the logger
    $scope.logger = [];
    $scope.log = function (msg) {
      var _msg = Date.now() + ' : ' + msg;
      $scope.logger.splice(0, 0, _msg);
      $log.log(_msg);
    };
    $scope.logcallback = function(pageX, pageY, X, Y) {
      $scope.log('From callback: pageX ' + pageX + ' pageY ' + pageY +
          ' X ' + X, ' Y ' + Y);
    };
    $scope.$watch('currPageY', function() {
      $scope.log('From scope: pageX ' + $scope.currPageX + ' pageY ' +
          $scope.currPageY);
    });
    $scope.$watch('currY', function() {
      $scope.log('From scope: X ' + $scope.currX + ' Y ' +
          $scope.currY );
    });

    $scope.$watch('isMinY', function() {
      if ($scope.isMinY) {
        $scope.log('MinY is reached');
      }
    });
    $scope.$watch('isMaxY', function() {
      if ($scope.isMaxY) {
        $scope.log('MaxY is reached');
      }
    });
    // scope methods
    $scope.scrollToPage = function(page) {
      $scope.currPageY = page;
    };
    $scope.append = function(item) {
      $scope.log('pushing ' + item + ' to back of the list of awesome things');
      $scope.awesomeThings.push(item);
    };
    $scope.prepend = function(item) {
      $scope.log('pushing ' + item + ' to front of the list of awesome things');
      $scope.awesomeThings.splice(0, 0, item);
    };
  });
