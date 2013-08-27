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
var scrollable = function($timeout, $window) {

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
      attrs.$observe('parameters', function(val) {
        var scr = {};
        // parse the JSON string
        if (typeof val === 'string') {
          scope.iscrollParameters = angular.fromJson(val);
        }
        else {
          scope.iscrollParameters = val;
        }
        scope.hScroll = ('hScroll' in scope.iscrollParameters &&
            scope.iscrollParameters.hScroll);

        // attach 'on'-callbacks
        for (var onMethod in scope) {
          if ((onMethod.indexOf('on') !== -1) &&
              scope.hasOwnProperty(onMethod) &&
              angular.isFunction(scope[onMethod])) {
            scope.iscrollParameters[onMethod] = scope[onMethod];
          }
        }

        // apply some necessary styling 
        element.css('overflow', 'auto');
        element.css('position', 'relative');
        // fix for automatic horizontal scroll
        if (scope.hScroll){
          var scroller = angular.element(
              element.children('.scroller')[0]);
          scroller.css('display', '-webkit-inline-flex');
          scroller.css('display', '-moz-inline-flex');
          scroller.css('display', '-ms-inline-flexbox');
          scroller.css('display', '-ms-inline-flex');
          scroller.css('display', 'inline-flex');
          scroller.css('overflow', 'hidden');
          scroller.css('white-space', 'nowrap');
          scroller.css('font-size', '0rem');
          angular.forEach(scroller.children(), function(value){
            var child = angular.element(value);
            child.css('font-size', '1rem');
            child.css('display', 'block');
          });
        }

        if (angular.isDefined(scope.iscrollParameters)) {
          var scroll = new iScroll(element[0],
              scope.iscrollParameters);
          scroll.options.onScrollEnd = function() {
            $timeout(function(){
                if (angular.isDefined(scope.currPageY)) {
                  scope.currPageY = scroll.currPageY;
                }
                if (angular.isDefined(scope.currPageX)) {
                  scope.currPageX = scroll.currPageX;
                }
                if (angular.isDefined(scope.currY)) {
                  scope.currY = scroll.y;
                }
                if (angular.isDefined(scope.currX)) {
                  scope.currX = scroll.x;
                }
                if (angular.isDefined(scope.isMaxY)) {
                  scope.isMaxY = (scroll.y <= scroll.maxScrollY);
                }
                if (angular.isDefined(scope.isMinY)) {
                  scope.isMinY = (scroll.y >= scroll.minScrollY);
                }
                if (angular.isDefined(scope.isMaxX)) {
                  scope.isMaxX = (scroll.x >= scroll.maxScrollX);
                }
                if (angular.isDefined(scope.isMinX)) {
                  scope.isMinX = (scroll.x <= scroll.minScrollX);
                }
                console.log(scope);
              });
            scope.onScrollEnd({pageX: this.currPageX,
                pageY: this.currPageY,
                X: this.currX,
                Y: this.currY});
          };

          scope.$watch('currPageY', function (newVal) {
            if (scroll.pagesY.length !== 0 && angular.isDefined(newVal)) {
              scroll.scrollToPage(0, newVal, scope.scrollToPageTime);
            }
          });
          scope.$watch('currPageX', function (newVal) {
            if (scroll.pagesX.length  !== 0 && angular.isDefined(newVal)) {
              scroll.scrollToPage(newVal, 0, scope.scrollToPageTime);
            }
          });

          scope.$watch('currY', function (newVal) {
            if (angular.isDefined(newVal)) {
              scroll.scrollTo(0, newVal, scope.scrollToPageTime);
            }
          });
          scope.$watch('currX', function (newVal) {
            if (angular.isDefined(newVal)) {
              scroll.scrollTo(newVal, 0, scope.scrollToPageTime);
            }
          });

          /* refresh on content change */
          scope.$watch(function() {
            scroll.refresh();
          });

          /* refresh the scroller on orientation change for mobile 
           * 
           * Detect whether device supports orientationchange event,
           * otherwise fall back to the resize event. */
          var supportsOrientationChange = 'onorientationchange' in $window,
            orientationEvent = supportsOrientationChange ? 'orientationchange' :
              'resize';
          /* register for changes */
          $window.addEventListener(orientationEvent, function() {
              if (scr.width !== screen.width || scr.height !== screen.height) {
                scr = {'width' : screen.width, 'height' : screen.height};
                scroll.refresh();
              }
            }, false);

          /* make sure to free memory if scrollable element is
           * destroyed (avoid memleaking)*/
          element.bind('$destroy', function() {
            scroll.destroy();
            scroll = null;
          });
        }
      });
    }
  };
};
angular.module('angular-momentum-scroll').directive('scrollable',
    ['$timeout', '$window', scrollable]);