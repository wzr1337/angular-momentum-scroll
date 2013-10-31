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

      attrs.$observe('parameters', function(val) {
        var scr = {};
        // parse the JSON string
        if (typeof val === 'string') {
          scope.iscrollParameters = angular.fromJson(val);
        }
        else {
          scope.iscrollParameters = val;
        }
        scope.scrollX = ('scrollX' in scope.iscrollParameters &&
            scope.iscrollParameters.scrollX);

        // apply some necessary styling 
        element.css('overflow', 'auto');
        element.css('position', 'relative');
        // fix for automatic horizontal scroll
        if (scope.scrollX){
          var scroller = angular.element(
              element.children('.scroller')[0]);
          scroller.addClass('inline-flex');
        }

        if (angular.isDefined(scope.iscrollParameters)) {
          $timeout(function() {
            //wait for the transcluded content to be rendered by using $timeout
            var scroll = new IScroll(element[0], scope.iscrollParameters);
            // attach 'on'-callbacks
            for (var onMethod in scope) {
              if ((onMethod.indexOf('on') !== -1) &&
                  scope.hasOwnProperty(onMethod) &&
                  angular.isFunction(scope[onMethod])) {
                var event = onMethod.substring(2).charAt(0).toLowerCase() +
                  onMethod.substring(2).slice(1);
                if (event === 'scrollEnd') { continue; }
                scroll.on(event, scope[onMethod]);
              }
            }

            scroll.on('scrollEnd', function() {
              // custom scrollend callback to intercept 'scroll' callback
              $timeout(function(){
                  if (angular.isDefined(scroll.currentPage)) {
                    if (angular.isDefined(scope.currPageY)) {
                      scope.currPageY = scroll.currentPage.pageY;
                    }
                    if (angular.isDefined(scope.currPageX)) {
                      scope.currPageX = scroll.currentPage.pageX;
                    }
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
                    scope.isMinY = (scroll.y >= 0);
                  }
                  if (angular.isDefined(scope.isMaxX)) {
                    scope.isMaxX = (scroll.x >= scroll.maxScrollX);
                  }
                  if (angular.isDefined(scope.isMinX)) {
                    scope.isMinX = (scroll.x <= 0);
                  }
                });
              var state = {
                pageX: angular.isDefined(this.currentPage) ?
                    this.currentPage.pageX : undefined,
                pageY: angular.isDefined(this.currentPage) ?
                    this.currentPage.pageY : undefined,
                X: this.x,
                Y: this.y
              };
              scope.onScrollEnd(state);
            });

            var scrollToPageY = function (pageY) {
              if (angular.isDefined(scroll.pages) &&
                  scroll.pages.length !== 0 && angular.isDefined(pageY)) {
                scroll.goToPage(0, pageY, scope.scrollToPageTime);
              }
            };
            scope.$watch('currPageY', scrollToPageY);

            var scrollToPageX = function (pageX) {
              if (angular.isDefined(scroll.pages) &&
                  scroll.pages.length  !== 0 && angular.isDefined(pageX)) {
                scroll.goToPage(pageX, 0, scope.scrollToPageTime);
              }
            };
            scope.$watch('currPageX', scrollToPageX);

            var scrollToY = function (Y) {
              if (angular.isDefined(Y)) {
                scroll.scrollTo(0, Y, scope.scrollToPageTime);
              }
            };
            scope.$watch('currY', scrollToY);

            var scrollToX = function (newVal) {
              if (angular.isDefined(newVal)) {
                scroll.scrollTo(newVal, 0, scope.scrollToPageTime);
              }
            };
            scope.$watch('currX', scrollToX);

            // refresh on content change
            var initialized = false;
            scope.$watch(function(nVal) {
              if (angular.isDefined(nVal)) {
                scroll.refresh();
                if (angular.isDefined(scroll.pages) &&
                    scroll.pages.length > 0 && !initialized) {
                  scrollToPageX(nVal.currPageX);
                  scrollToPageY(nVal.currPageY);
                  initialized = true;
                }
              }
            });

            /* refresh the scroller on orientation change for mobile 
             * 
             * Detect whether device supports orientationchange event,
             * otherwise fall back to the resize event. */
            var supportsOrientationChange = 'onorientationchange' in $window,
              orientationEvent = supportsOrientationChange ?
                  'orientationchange' : 'resize';
            /* register for changes */
            $window.addEventListener(orientationEvent, function() {
              if (scr.width !== screen.width || scr.height !== screen.height) {
                scr = {'width' : screen.width, 'height' : screen.height};
                if (angular.isDefined(scroll)) {
                  scroll.refresh();
                }
              }
            }, false);

            /* make sure to free memory if scrollable element is
             * destroyed (avoid memleaking)*/
            element.bind('$destroy', function() {
              scroll.destroy();
              scroll = undefined;
            });
          }, 0);
        }
      });
    }
  };
}]);