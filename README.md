# angular-momentum-scroll

AngularJS directive that adds momentum scroll via iScroll (http://cubiq.org).

## Demo
Find a demonstration on http://wzr1337.github.com

## Usage

* Include `scrollable.js` or `scrollable.min.js` into your page
* Declare `'angular-momentum-scroll'` as a dependency for your angular app: `angular.module('myApp', ['angular-momentum-scroll']);`
* Add the `scrollable` attribute to a container of your choice:
    * the container MUST have set width and height !!
    * in order to scroll horizontally the .scroller class inside of your container MUST have set width and height !!
* The container takes an additional attribute `parameters` according to iScroll docs. e.g. 
   
    ```javascript
    <div id="my-cont" style="height: 400px; width: 100%;" scrollable 
    parameters="{{ {vScroll : true, snap: '.row'} }}">

* You can register any of the following handlers by specifying a callback function via attribute:
    * onRefresh
    * onBeforeScrollStart
    * onScrollStart
    * onBeforeScrollMove
    * onScrollMove
    * onBeforeScrollEnd
    * onScrollEnd
    * onTouchEnd
    * onDestroy
    * onZoomStart
    * onZoom
    * onZoomEnd

    ```javascript
    <div id="my-cont" style="height: 400px; width: 100%;" scrollable
    parameters="{{ {hScrollbar : true, snap: '.row'} }}"
    on-scroll-move="doSometginhg()">...</div>

* You can bind a variable to the curr-page-x and curr-page-y attribute. The data binding is bidirectional, so that you can scroll programatically as well as being notified on page change.

  ```javascript
    <div id="my-cont" style="height: 400px; width: 100%;" scrollable
    parameters="{{ {vScroll : true, snap: '.row'} }}"
    curr-page-y="myPageY">...</div>

* You can watch isMinY, isMinX and isMaxX, isMAxY to find out, if the scrlller reached its final top or bottom, left or right position. These help you to build an infinitescroll or similar. use them as follows:

  ```javascript
  <ol id='mycontainer' scrollable
    parameters="{{ {vScroll:true, vScrollbar: true, snap: 'li'} }}"
    curr-page-x="currPageX" curr-page-y="currPageY" curr-x="currX"
    curr-y="currY" is-min-y="isMinY" is-max-y="isMaxY">
    <li class="listitem" ng-repeat="thing in awesomeThings">{{thing}}</li>
  </ol>
