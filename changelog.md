# Change-Log

## 2014-9-24
* Listening to resize of scroller instead of number of elements
* Default option preventDefualt set to false (allow clicktrhough)

## 2014-07-14
* Moved to version number 0.5.8
* Fixed bower.json of distribution package so that the ```main``` path is now a valid path
    * Fixes issue that grunt-wiredep couldn't inject angular-momentum-scroll
    * Bower package version contains now build timestamp
* Modified build process so that the minified file holds now proper license informations of angular-momentum-scroll and the used iScroll library
* Wrapped scrollable.js into an IIFE to avoid code leaking
* Source map gets now included into the distribution package
* Updated NPM and Bower dependencies
* Updated Karma test suite

## 2014-06-15
fixed check for scrollX

## 2014-01-17
fixed horizontal scroll css

## 2013-12-18
fixed $destroy

## 2013-11-30
fixed reinitialization on DOM extension
fixed accessing undefined scope vars

## 2013-10-31
fixed horizontal scroll for new iScroll parameter scrollX 

## 2013-10-30
Fixed regular scroll

## 2013-10-18
migrated to iscroll 5 for better performance on Android

## 2013-09-19 v0.4.9
initialization of snappping scroll fixed

## 2013-09-16 v0.4.8
smaller fix for orientation change

## 2013-09-16 v0.4.7


## 2013-08-27 v0.4.6
Fixed horizontal scroll (css)

## 2013-06-09v0.4.4
Add isMaxX/isMinX/isMaxY/isMinY as an interface to the final TOP and bottoms positions.

## 2013-06-08 v0.4.3
Now supports X and Y coordinates of scroller

## 2013-05-17 v0.4.1
Fixed a bug with emtpy scrollers

## 2013-05-16 v0.4.0
Added two way data bound pages

## 2013-05-09 v0.3.0
Added callbacks for 'on' handles of iScroll

## 2013-05-08 v0.2.0
now supporting scrollToPage method of iScroll

## 2013-05-06 v0.1.1
Added some css hack to allow horizontal scrolling with css only. No hacky width calculations necessary
