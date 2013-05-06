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
 * parameters="{{ {hScrollbar : true, snap: '.row'} }}">
 */
var scrollable = function() {

    return {
        restrict : 'AE',
        scope : {
            parameters : '@'
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
angular.module('angular-momentum-scroll').directive('scrollable',
        [ scrollable ]);