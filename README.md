# angular-momentum-scroll

AngularJS directive that adds momentum scroll via iScroll (http://cubiq.org/iscroll-4).

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
