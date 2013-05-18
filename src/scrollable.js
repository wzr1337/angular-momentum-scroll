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
var scrollable = function($timeout) {

  return {
    restrict : 'AE',
    scope : {
      parameters : '@',
      scrollToPageTime : '@' || 400,
      currPageX : '=',
      currPageY : '=',
      onRefresh: '&',
      onBeforeScrollStart: '&',
      onScrollStart: '&',
      onBeforeScrollMove: '&',
      onScrollMove: '&',
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

        // parse the JSON string
        if (typeof val === 'string') {
          scope.iscrollParameters = angular.fromJson(val);
        }
        else {
          scope.iscrollParameters = val;
        }
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
        if ('hScroll' in scope.iscrollParameters &&
            scope.iscrollParameters.hScroll) {
          var scroller = angular.element(
              element.children('.scroller')[0]);
          scroller.css('display', 'inline-block');
          scroller.css('overflow', 'hidden');
          scroller.css('white-space', 'nowrap');
          scroller.css('font-size', '0rem');
          angular.forEach(scroller.children(), function(value){
            var child = angular.element(value);
            child.css('font-size', '1rem');
            child.css('display', 'inline-block');
          });
        }

        if (angular.isDefined(scope.iscrollParameters)) {
          var scroll = new iScroll(element[0],
              scope.iscrollParameters);
          scroll.options.onScrollEnd = function() {
              //weired behavior, a $timeout needs to wrap scope manipulations
            $timeout(function(){
                scope.currPageY = scroll.currPageY;
                scope.currPageX = scroll.currPageX;
              });
            scope.onScrollEnd({pageX: this.currPageX,
                pageY: this.currPageY});
          };

          scope.$watch('currPageY', function (newVal) {
            //console.log('newVal %s, oldVal %s', newVal, oldVal);
            if (scroll.pagesY.length !== 0 && angular.isDefined(newVal)) {
              scroll.scrollToPage(0, newVal, scope.scrollToPageTime);
            }
          });
          scope.$watch('currPageX', function (newVal) {
            //console.log('newVal %s, oldVal %s', newVal, oldVal);
            if (scroll.pagesX.length  !== 0 && angular.isDefined(newVal)) {
              scroll.scrollToPage(newVal, 0, scope.scrollToPageTime);
            }
          });

          scope.$watch(function() {
            scroll.refresh();
          });
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
angular.module('angular-momentum-scroll').directive('scrollable', ['$timeout', scrollable]);