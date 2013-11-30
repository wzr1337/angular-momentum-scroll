'use strict';

angular.module('angular-momentum-scroll', []);

/**
 * scrollable directive utilizing iScroll lib. Attach to wrapping container.
 * First child will be scrolled only, SEE: http://cubiq.org/iscroll-4
 *
 * automatically sets following CSS style on the container: overflow: auto;
 * position: relative;
 *  !! the container MUST have set width and height !!
 *  !! in order to scroll horizontally the .scroller class inside of your
 * container MUST have set width and height !!
 *
 * the container takes an additional attribute 'iscroll-parameters' according to
 * iScroll docs.
 *
 * e.g. <div id="my-cont" style="height: 400px; width: 100%;" scrollable
 * parameters="{{ {hScrollbar : true, snap: '.row'} }}">...</div>
 *
 * You can bind a page number from the parents container to the scrollers
 * current page by using curr-page-x and curr-page-y attributes. The binding is
 * two way, so your parent scope will be updated also on scrolling.
 * This means, you can use curr-page-x and curr-page-y for scrolling to a page 
 * programatically as well as for listening to page changes. 
 *
 * <div scrollable style="height: 80%; width: 100%;" 
 *      curr-page-y="{{ mypage }}" scroll-to-page-time = "5000"
 *      parameters="{{ { hScroll: true, hScrollbar: false, snap: true,
 *      momentum: false} }}"">...</div>
 */
angular.module('angular-momentum-scroll').directive('scrollable', ['$timeout',
  '$window', '$document', function($timeout, $window, $document) {

    return {
      restrict : 'AE',
      scope : {
        scrollToPageTime : '@' || 400,
        currPageX : '=',
        currPageY : '=',
        currY : '=',
        currX : '=' ,
        isMaxX : '=',
        isMinX : '=',
        isMaxY : '=',
        isMinY : '=',
        onRefresh: '&',
        onBeforeScrollStart: '&',
        onScrollStart: '&',
        onBeforeScrollMove: '&',
        onScrollMove: '&',
        parameters : '@',
        onBeforeScrollEnd: '&',
        onScrollEnd: '&',
        onTouchEnd: '&',
        onDestroy: '&',
        onZoomStart: '&',
        onZoom: '&',
        onZoomEnd: '&'
      },
      transclude : true,
      template : '<div class="scroller" ng-transclude></div>',
      link : function(scope, element, attrs) {
      // add stying
        var style =
        '.inline-flex {' +
        '  display: -webkit-inline-flex;' +
        '  display: -moz-inline-flex;' +
        '  display: -ms-inline-flexbox;' +
        '  display: -ms-inline-flex;' +
        '  display: inline-flex;' +
        '  display: -webkit-inline-box;' +
        '  overflow: hidden;' +
        '  white-space: nowrap;' +
        '}' +
        '.inline-flex > * {' +
        '  display: block;' +
        '}';
        var head = angular.element($document[0].head);
        head.append('<style type="text/css">' + style + '</style>');
        // apply some necessary styling 
        element.css('overflow', 'auto');
        element.css('position', 'relative');
        var scroller = angular.element(element.children('.scroller')[0]);
        // fix for automatic horizontal scroll
        if (angular.isDefined(scope.scrollX)){
          scroller.addClass('inline-flex');
        }

      //define handlers
        var handleScrollEnd = function() {
          $timeout(function(){
          // custom scrollend callback to intercept 'scroll' callback
            if (angular.isDefined(scope.currY)) {
              scope.currY = iScrollInstance.y;
            }
            if (angular.isDefined(scope.isMaxY)) {
              scope.isMaxY = (iScrollInstance.y <= iScrollInstance.maxScrollY);
            }
            if (angular.isDefined(scope.isMinY)) {
              scope.isMinY = (iScrollInstance.y >= 0);
            }
            if (angular.isDefined(scope.currX)) {
              scope.currX = iScrollInstance.x;
            }
            if (angular.isDefined(scope.isMaxX)) {
              scope.isMaxX = (iScrollInstance.x >= iScrollInstance.maxScrollX);
            }
            if (angular.isDefined(scope.isMinX)) {
              scope.isMinX = (iScrollInstance.x <= 0);
            }

            if (angular.isDefined(iScrollInstance.currentPage)) {
              if (angular.isDefined(scope.currPageY)) {
                scope.currPageY = iScrollInstance.currentPage.pageY;
              }
              if (angular.isDefined(scope.currPageX)) {
                scope.currPageX = iScrollInstance.currentPage.pageX;
              }
            }
            var state = {
              pageX: angular.isDefined(iScrollInstance.currentPage) ?
              iScrollInstance.currentPage.pageX : undefined,
              pageY: angular.isDefined(iScrollInstance.currentPage) ?
              iScrollInstance.currentPage.pageY : undefined,
              X: iScrollInstance.x,
              Y: iScrollInstance.y
            };
            scope.onScrollEnd(state);
          });
        };

        var iScrollInstance;
        var scrollToPageX = function (pageX) {
          if (angular.isDefined(iScrollInstance.pages) &&
            iScrollInstance.pages.length  !== 0 && angular.isDefined(pageX)) {
            iScrollInstance.goToPage(pageX, 0, scope.scrollToPageTime);
          }
        };
        var scrollToPageY = function (pageY) {
          if (angular.isDefined(iScrollInstance.pages) &&
            iScrollInstance.pages.length !== 0 && angular.isDefined(pageY)) {
            iScrollInstance.goToPage(0, pageY, scope.scrollToPageTime);
          }
        };
        var scrollToY = function (Y) {
          if (angular.isDefined(Y)) {
            iScrollInstance.scrollTo(0, Y, scope.scrollToPageTime);
          }
        };
        var scrollToX = function (newVal) {
          if (angular.isDefined(newVal)) {
            iScrollInstance.scrollTo(newVal, 0, scope.scrollToPageTime);
          }
        };

        // initializer
        var _init = function() {
          iScrollInstance = new IScroll(element[0], scope.iscrollParameters);
          // attach 'on'-callbacks
          for (var onMethod in scope) {
            if ((onMethod.indexOf('on') !== -1) &&
              scope.hasOwnProperty(onMethod) &&
              angular.isFunction(scope[onMethod])) {
              var event = onMethod.substring(2).charAt(0).toLowerCase() +
            onMethod.substring(2).slice(1);
              if (event === 'scrollEnd') { continue; }
              iScrollInstance.on(event, scope[onMethod]);
            }
          }

          iScrollInstance.on('scrollEnd', handleScrollEnd);
          scope.$watch('currPageY', scrollToPageY);
          scope.$watch('currPageX', scrollToPageX);
          scope.$watch('currY', scrollToY);
          scope.$watch('currX', scrollToX);

         /* refresh the scroller on orientation change for mobile 
          * 
          * Detect whether device supports orientationchange event,
          * otherwise fall back to the resize event. */
          var supportsOrientationChange = 'onorientationchange' in $window,
          orientationEvent = supportsOrientationChange ?
         'orientationchange' : 'resize';
          var scr = {};
          /* register for changes */
          $window.addEventListener(orientationEvent, function() {
            if (scr.width !== screen.width || scr.height !== screen.height) {
              scr = {'width' : screen.width, 'height' : screen.height};
              if (angular.isDefined(iScrollInstance)) {
                iScrollInstance.refresh();
              }
            }
          }, false);

          /* make sure to free memory if scrollable element is
          * destroyed (avoid memleaking)*/
          element.bind('$destroy', function() {
              iScrollInstance.destroy();
              iScrollInstance = undefined;
            });
        };

        attrs.$observe('parameters', function(val) {
          // parse the JSON string
          if (angular.isString(val)) {
            scope.iscrollParameters = angular.fromJson(val);
          }
          else {
            scope.iscrollParameters = val;
          }
          scope.scrollX = ('scrollX' in scope.iscrollParameters &&
            scope.iscrollParameters.scrollX);

          // refresh on content change
          scope.$watchCollection(function () { return scroller.children(); },
            function(nVal) {
              if (angular.isDefined(nVal)) {
                if (angular.isDefined(iScrollInstance)) {
                  iScrollInstance.destroy();
                }
                $timeout(function(){
                  _init();
                  if (angular.isDefined(iScrollInstance.pages) &&
                    iScrollInstance.pages.length > 0) {
                    scrollToPageX(nVal.currPageX);
                    scrollToPageY(nVal.currPageY);
                  }
                });
              }
            });
        });
      }
    };
  }]);