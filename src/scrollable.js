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
 * if you want to programatically scroll to a page (snapping option has to be
 * set), you can use additional attributes scroll-to-page and 
 * scroll-to-page-time like this:
 *
 * <div scrollable style="height: 80%; width: 100%;" 
 *      scroll-to-page="{{ mypage }}" scroll-to-page-time = "5000"
 *      parameters="{{ { hScroll: true, hScrollbar: false, snap: true,
 *      momentum: false} }}"">...</div>
 */
var scrollable = function() {

  return {
    restrict : 'AE',
    scope : {
      parameters : '@',
      scrollToPage : '@',
      scrollToPageTime : '@' || 100
    },
    transclude : true,
    template : '<div class="scroller" ng-transclude></div>',
    link : function(scope, element, attrs) {
      // strange behavior: if I do not observe, the scope.parameters will
      // be undefined
      attrs.$observe('parameters', function(val) {

        // parse the JSON string
        scope.iscrollParameters = angular.fromJson(val);

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

        //added to modify scroll container by param
        attrs.$observe('scrollToPage', function () {
          if (angular.isDefined(scope.scrollToPage)) {
            scope.$watch(scope.scrollToPage, function (newVal) {
              if (angular.isDefined(newVal)) {
                //NOTE: works if snap is active (according to iScroll doc)
                if ('hScroll' in scope.iscrollParameters &&
                  scope.iscrollParameters.hScroll) {
                  scroll.scrollToPage(newVal, 0, scope.scrollToPageTime);
                }
                else {
                  scroll.scrollToPage(0, newVal, scope.scrollToPageTime);
                }
              }
            });
          }
        });

        if (angular.isDefined(scope.iscrollParameters)) {
          var scroll = new iScroll(element[0],
              scope.iscrollParameters);
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
angular.module('angular-momentum-scroll').directive('scrollable', [scrollable]);