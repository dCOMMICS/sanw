

let loginForm = document.querySelector(".my-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    console.log('Email:', email.value);
    console.log('Password:', password.value);
    // process and send to API 
});




// https://projecteuler.net/problem=1
/* Multiples of 3 and 5
If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6, and 9. The sum of these multiples is 23.
Find the sum of all the multiples of 3 or 5 below the provided parameter value number.
*/

// This method uses the nSum function to add the nSum for 3 and 5. However, it needs to subtract the nSum for 15 once to avoid double counting.
const multiplesThreeAndFive = (num) => {
    if (num < 1) throw new Error('No natural numbers exist below 1')
    num -= 1
    let sum = 0
  
    // The nSum function calculates the sum of the first n numbers in the sequence with a common difference of num.
    // Here, n is denoted as frequency.
    const nSum = (num, frequency) => (frequency * (frequency + 1) * num) >> 1
  
    sum += nSum(3, Math.floor(num / 3))
    sum += nSum(5, Math.floor(num / 5))
    sum -= nSum(15, Math.floor(num / 15))
    return sum
  }
  

  export { multiplesThreeAndFive }


  // https://projecteuler.net/problem=2
const SQ5 = 5 ** 0.5 // Square root of 5
const PHI = (1 + SQ5) / 2 // definition of PHI

// theoretically it should take O(1) constant amount of time as long
// arithmetic calculations are considered to be in constant amount of time
export const EvenFibonacci = (limit) => {
  if (limit < 1)
    throw new Error("Fibonacci sequence limit can't be less than 1")

  const highestIndex = Math.floor(Math.log(limit * SQ5) / Math.log(PHI))
  const n = Math.floor(highestIndex / 3)
  
  return Math.floor(
    ((PHI ** (3 * n + 3) - 1) / (PHI ** 3 - 1) -
      ((1 - PHI) ** (3 * n + 3) - 1) / ((1 - PHI) ** 3 - 1)) /
      SQ5
  )
}


/**
 * Work out the first ten digits of the sum of the following one-hundred 50-digit numbers.
 */

export function largeSum(bignum) {
    const nums = []
    for (let i = 0; i < bignum.length; i += 50) {
      nums.push(bignum.slice(i, i + 50))
    }
  
    let pos = nums[0].length
    let ret = ''
    let num = 0
  
    while (pos--) {
      for (let i = nums.length; i--; ) {
        num += +nums[i].charAt(pos)
      }
      ret = (num % 10) + ret
      num = (num / 10) | 0
    }
  
    if (num > 0) {
      ret = num + ret
    }
    return ret.slice(0, 10)
  }



  /**
 * fullPage 2.5.4
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */

(function($) {
	$.fn.fullpage = function(options) {
		// Create some defaults, extending them with any options that were provided
		options = $.extend({
			//navigation
			'menu': false,
			'anchors':[],
			'navigation': false,
			'navigationPosition': 'right',
			'navigationColor': '#000',
			'navigationTooltips': [],
			'slidesNavigation': false,
			'slidesNavPosition': 'bottom',
			'scrollBar': false,

			//scrolling
			'css3': true,
			'scrollingSpeed': 700,
			'autoScrolling': true,
			'easing': 'easeInQuart',
			'easingcss3': 'ease',
			'loopBottom': false,
			'loopTop': false,
			'loopHorizontal': true,
			'continuousVertical': false,
			'normalScrollElements': null,
			'scrollOverflow': false,
			'touchSensitivity': 5,
			'normalScrollElementTouchThreshold': 5,

			//Accessibility
			'keyboardScrolling': true,
			'animateAnchor': true,
			'recordHistory': true,

			//design
			'controlArrows': true,
			'controlArrowColor': '#fff',
			"verticalCentered": true,
			'resize': true,
			'sectionsColor' : [],
			'paddingTop': 0,
			'paddingBottom': 0,
			'fixedElements': null,
			'responsive': 0,

			//Custom selectors
			'sectionSelector': '.section',
			'slideSelector': '.slide',


			//events
			'afterLoad': null,
			'onLeave': null,
			'afterRender': null,
			'afterResize': null,
			'afterReBuild': null,
			'afterSlideLoad': null,
			'onSlideLeave': null
		}, options);

	    displayWarnings();

	    //easeInQuart animation included in the plugin
	    $.extend($.easing,{ easeInQuart: function (x, t, b, c, d) { return c*(t/=d)*t*t*t + b; }});

		//Defines the delay to take place before being able to scroll to the next section
		//BE CAREFUL! Not recommened to change it under 400 for a good behavior in laptops and
		//Apple devices (laptops, mouses...)
		var scrollDelay = 600;

		$.fn.fullpage.setAutoScrolling = function(value, type){
			setVariableState('autoScrolling', value, type);

			var element = $('.fp-section.active');

			if(options.autoScrolling && !options.scrollBar){
				$('html, body').css({
					'overflow' : 'hidden',
					'height' : '100%'
				});

				$.fn.fullpage.setRecordHistory(options.recordHistory, 'internal');

				//for IE touch devices
				container.css({
					'-ms-touch-action': 'none',
					'touch-action': 'none'
				});

				if(element.length){
					//moving the container up
					silentScroll(element.position().top);
				}

			}else{
				$('html, body').css({
					'overflow' : 'visible',
					'height' : 'initial'
				});

				$.fn.fullpage.setRecordHistory(false, 'internal');

				//for IE touch devices
				container.css({
					'-ms-touch-action': '',
					'touch-action': ''
				});

				silentScroll(0);

				//scrolling the page to the section with no animation
				$('html, body').scrollTop(element.position().top);
			}

		};

		/**
		* Defines wheter to record the history for each hash change in the URL.
		*/
		$.fn.fullpage.setRecordHistory = function(value, type){
			setVariableState('recordHistory', value, type);
		};

		/**
		* Defines the scrolling speed
		*/
		$.fn.fullpage.setScrollingSpeed = function(value, type){
			setVariableState('scrollingSpeed', value, type);
		};

		/**
		* Adds or remove the possiblity of scrolling through sections by using the mouse wheel or the trackpad.
		*/
		$.fn.fullpage.setMouseWheelScrolling = function (value){
			if(value){
				addMouseWheelHandler();
			}else{
				removeMouseWheelHandler();
			}
		};

		/**
		* Adds or remove the possiblity of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
		* Optionally a second parameter can be used to specify the direction for which the action will be applied.
		*
		* @param directions string containing the direction or directions separated by comma.
		*/
		$.fn.fullpage.setAllowScrolling = function (value, directions){
			if(typeof directions != 'undefined'){
				directions = directions.replace(' ', '').split(',');
				$.each(directions, function (index, direction){
					setIsScrollable(value, direction);
				});
			}
			else if(value){
				$.fn.fullpage.setMouseWheelScrolling(true);
				addTouchHandler();
			}else{
				$.fn.fullpage.setMouseWheelScrolling(false);
				removeTouchHandler();
			}
		};

		/**
		* Adds or remove the possiblity of scrolling through sections by using the keyboard arrow keys
		*/
		$.fn.fullpage.setKeyboardScrolling = function (value){
			options.keyboardScrolling = value;
		};

		$.fn.fullpage.moveSectionUp = function(){
			var prev = $('.fp-section.active').prev('.fp-section');

			//looping to the bottom if there's no more sections above
			if (!prev.length && (options.loopTop || options.continuousVertical)) {
				prev = $('.fp-section').last();
			}

			if (prev.length) {
				scrollPage(prev, null, true);
			}
		};

		$.fn.fullpage.moveSectionDown = function (){
			var next = $('.fp-section.active').next('.fp-section');

			//looping to the top if there's no more sections below
			if(!next.length &&
				(options.loopBottom || options.continuousVertical)){
				next = $('.fp-section').first();
			}

			if(next.length){
				scrollPage(next, null, false);
			}
		};

		$.fn.fullpage.moveTo = function (section, slide){
			var destiny = '';

			if(isNaN(section)){
				destiny = $('[data-anchor="'+section+'"]');
			}else{
				destiny = $('.fp-section').eq( (section -1) );
			}

			if (typeof slide !== 'undefined'){
				scrollPageAndSlide(section, slide);
			}else if(destiny.length > 0){
				scrollPage(destiny);
			}
		};

		$.fn.fullpage.moveSlideRight = function(){
			moveSlide('next');
		};

		$.fn.fullpage.moveSlideLeft = function(){
			moveSlide('prev');
		};

		/**
		 * When resizing is finished, we adjust the slides sizes and positions
		 */
		$.fn.fullpage.reBuild = function(resizing){
			isResizing = true;

			var windowsWidth = $(window).width();
			windowsHeight = $(window).height();  //updating global var

			//text and images resizing
			if (options.resize) {
				resizeMe(windowsHeight, windowsWidth);
			}

			$('.fp-section').each(function(){
				var scrollHeight = windowsHeight - parseInt($(this).css('padding-bottom')) - parseInt($(this).css('padding-top'));

				//adjusting the height of the table-cell for IE and Firefox
				if(options.verticalCentered){
					$(this).find('.fp-tableCell').css('height', getTableHeight($(this)) + 'px');
				}

				$(this).css('height', windowsHeight + 'px');

				//resizing the scrolling divs
				if(options.scrollOverflow){
					var slides = $(this).find('.fp-slide');

					if(slides.length){
						slides.each(function(){
							createSlimScrolling($(this));
						});
					}else{
						createSlimScrolling($(this));
					}
				}

				//adjusting the position fo the FULL WIDTH slides...
				var slides = $(this).find('.fp-slides');
				if (slides.length) {
					landscapeScroll(slides, slides.find('.fp-slide.active'));
				}
			});

			//adjusting the position for the current section
			var destinyPos = $('.fp-section.active').position();

			var activeSection = $('.fp-section.active');

			//isn't it the first section?
			if(activeSection.index('.fp-section')){
				scrollPage(activeSection);
			}

			isResizing = false;
			$.isFunction( options.afterResize ) && resizing && options.afterResize.call( this )
			$.isFunction( options.afterReBuild ) && !resizing && options.afterReBuild.call( this );
		}

		//flag to avoid very fast sliding for landscape sliders
		var slideMoving = false;

		var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
		var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
		var container = $(this);
		var windowsHeight = $(window).height();
		var isMoving = false;
		var isResizing = false;
		var lastScrolledDestiny;
		var lastScrolledSlide;
		var nav;
		var wrapperSelector = 'fullpage-wrapper';
		var isScrollAllowed = { 'up':true, 'down':true, 'left':true, 'right':true };
		var originals = jQuery.extend(true, {}, options); //deep copy

		$.fn.fullpage.setAllowScrolling(true);

		//if css3 is not supported, it will use jQuery animations
		if(options.css3){
			options.css3 = support3d();
		}

		if($(this).length){
			container.css({
				'height': '100%',
				'position': 'relative'
			});

			//adding a class to recognize the container internally in the code
			container.addClass(wrapperSelector);
		}

		//trying to use fullpage without a selector?
		else{
			showError('error', "Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();");
		}

		//adding internal class names to void problem with common ones
		$(options.sectionSelector).each(function(){
  			$(this).addClass('fp-section');
		});
		$(options.slideSelector).each(function(){
  			$(this).addClass('fp-slide');
		});

		//creating the navigation dots
		if (options.navigation) {
			addVerticalNavigation();
		}

		$('.fp-section').each(function(index){
			var that = $(this);
			var slides = $(this).find('.fp-slide');
			var numSlides = slides.length;

			//if no active section is defined, the 1st one will be the default one
			if(!index && $('.fp-section.active').length === 0) {
				$(this).addClass('active');
			}

			$(this).css('height', windowsHeight + 'px');

			if(options.paddingTop || options.paddingBottom){
				$(this).css('padding', options.paddingTop  + ' 0 ' + options.paddingBottom + ' 0');
			}

			if (typeof options.sectionsColor[index] !==  'undefined') {
				$(this).css('background-color', options.sectionsColor[index]);
			}

			if (typeof options.anchors[index] !== 'undefined') {
				$(this).attr('data-anchor', options.anchors[index]);
			}

			// if there's any slide
			if (numSlides > 1) {
				var sliderWidth = numSlides * 100;
				var slideWidth = 100 / numSlides;

				slides.wrapAll('<div class="fp-slidesContainer" />');
				slides.parent().wrap('<div class="fp-slides" />');

				$(this).find('.fp-slidesContainer').css('width', sliderWidth + '%');

				if(options.controlArrows){
					createSlideArrows($(this));
				}

				if(options.slidesNavigation){
					addSlidesNavigation($(this), numSlides);
				}

				slides.each(function(index) {
					$(this).css('width', slideWidth + '%');

					if(options.verticalCentered){
						addTableClass($(this));
					}
				});

				var startingSlide = that.find('.fp-slide.active');

				//if the slide won#t be an starting point, the default will be the first one
				if(startingSlide.length == 0){
					slides.eq(0).addClass('active');
				}

				//is there a starting point for a non-starting section?
				else{
					silentLandscapeScroll(startingSlide);
				}

			}else{
				if(options.verticalCentered){
					addTableClass($(this));
				}
			}

		}).promise().done(function(){
			$.fn.fullpage.setAutoScrolling(options.autoScrolling, 'internal');

			//the starting point is a slide?
			var activeSlide = $('.fp-section.active').find('.fp-slide.active');

			//the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
			if( activeSlide.length &&  ($('.fp-section.active').index('.fp-section') != 0 || ($('.fp-section.active').index('.fp-section') == 0 && activeSlide.index() != 0))){
				silentLandscapeScroll(activeSlide);
			}

			//fixed elements need to be moved out of the plugin container due to problems with CSS3.
			if(options.fixedElements && options.css3){
				$(options.fixedElements).appendTo('body');
			}

			//vertical centered of the navigation + first bullet active
			if(options.navigation){
				nav.css('margin-top', '-' + (nav.height()/2) + 'px');
				nav.find('li').eq($('.fp-section.active').index('.fp-section')).find('a').addClass('active');
			}

			//moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
			if(options.menu && options.css3 && $(options.menu).closest('.fullpage-wrapper').length){
				$(options.menu).appendTo('body');
			}

			if(options.scrollOverflow){
				if(document.readyState === "complete"){
					createSlimScrollingHandler();
				}
				//after DOM and images are loaded
				$(window).on('load', createSlimScrollingHandler);
			}else{
				$.isFunction( options.afterRender ) && options.afterRender.call( this);
			}

			responsive();

			//getting the anchor link in the URL and deleting the `#`
			var value =  window.location.hash.replace('#', '').split('/');
			var destiny = value[0];

			if(destiny.length){
				var section = $('[data-anchor="'+destiny+'"]');

				if(!options.animateAnchor && section.length){

					if(options.autoScrolling){
						silentScroll(section.position().top);
					}
					else{
						silentScroll(0);
						setBodyClass(destiny);

						//scrolling the page to the section with no animation
						$('html, body').scrollTop(section.position().top);
					}

					activateMenuAndNav(destiny, null);

					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, destiny, (section.index('.fp-section') + 1));

					//updating the active class
					section.addClass('active').siblings().removeClass('active');
				}
			}


			$(window).on('load', function() {
				scrollToAnchor();
			});

		});


		/**
		* Creates the control arrows for the given section
		*/
		function createSlideArrows(section){
			section.find('.fp-slides').after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>');

			if(options.controlArrowColor!='#fff'){
				section.find('.fp-controlArrow.fp-next').css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
				section.find('.fp-controlArrow.fp-prev').css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
			}

			if(!options.loopHorizontal){
				section.find('.fp-controlArrow.fp-prev').hide();
			}
		}

		/**
		* Creates a vertical navigation bar.
		*/
		function addVerticalNavigation(){
			$('body').append('<div id="fp-nav"><ul></ul></div>');
			nav = $('#fp-nav');

			nav.css('color', options.navigationColor);
			nav.addClass(options.navigationPosition);

			for (var i = 0; i < $('.fp-section').length; i++) {
				var link = '';
				if (options.anchors.length) {
					link = options.anchors[i];
				}

				var li = '<li><a href="#' + link + '"><span></span></a>';

				// Only add tooltip if needed (defined by user)
				var tooltip = options.navigationTooltips[i];
				if (tooltip != undefined && tooltip != '') {
					li += '<div class="fp-tooltip ' + options.navigationPosition + '">' + tooltip + '</div>';
				}

				li += '</li>';

				nav.find('ul').append(li);
			}
		}

		function createSlimScrollingHandler(){
			$('.fp-section').each(function(){
				var slides = $(this).find('.fp-slide');

				if(slides.length){
					slides.each(function(){
						createSlimScrolling($(this));
					});
				}else{
					createSlimScrolling($(this));
				}

			});
			$.isFunction( options.afterRender ) && options.afterRender.call( this);
		}

		var scrollId;
		var scrollId2;
		var isScrolling = false;

		//when scrolling...
		$(window).on('scroll', scrollHandler);

		function scrollHandler(){
			if(!options.autoScrolling || options.scrollBar){
				var currentScroll = $(window).scrollTop();
				var visibleSectionIndex = 0;
				var initial = Math.abs(currentScroll - $('.fp-section').first().offset().top);

				//taking the section which is showing more content in the viewport
				$('.fp-section').each(function(index){
					var current = Math.abs(currentScroll - $(this).offset().top);

					if(current < initial){
						visibleSectionIndex = index;
						initial = current;
					}
				});

				//geting the last one, the current one on the screen
				var currentSection = $('.fp-section').eq(visibleSectionIndex);
			}

			if(!options.autoScrolling){
				//executing only once the first time we reach the section
				if(!currentSection.hasClass('active')){
					isScrolling = true;

					var leavingSection = $('.fp-section.active').index('.fp-section') + 1;
					var yMovement = getYmovement(currentSection);
					var anchorLink  = currentSection.data('anchor');
					var sectionIndex = currentSection.index('.fp-section') + 1;
					var activeSlide = currentSection.find('.fp-slide.active');

					if(activeSlide.length){
						var slideAnchorLink = activeSlide.data('anchor');
						var slideIndex = activeSlide.index();
					}

					currentSection.addClass('active').siblings().removeClass('active');

					if(!isMoving){
						$.isFunction( options.onLeave ) && options.onLeave.call( this, leavingSection, sectionIndex, yMovement);

						$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, sectionIndex);
					}

					activateMenuAndNav(anchorLink, 0);

					if(options.anchors.length && !isMoving){
						//needed to enter in hashChange event when using the menu with anchor links
						lastScrolledDestiny = anchorLink;

						setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
					}

					//small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
					clearTimeout(scrollId);
					scrollId = setTimeout(function(){
						isScrolling = false;
					}, 100);
				}
			}

			if(options.scrollBar){
				//for the auto adjust of the viewport to fit a whole section
				clearTimeout(scrollId2);
				scrollId2 = setTimeout(function(){
					if(!isMoving){
						scrollPage(currentSection);
					}
				}, 1000);
			}
		}


		/**
		* Determines whether the active section or slide is scrollable through and scrolling bar
		*/
		function isScrollable(activeSection){
			//if there are landscape slides, we check if the scrolling bar is in the current one or not
			if(activeSection.find('.fp-slides').length){
				scrollable= activeSection.find('.fp-slide.active').find('.fp-scrollable');
			}else{
				scrollable = activeSection.find('.fp-scrollable');
			}

			return scrollable;
		}

		/**
		* Determines the way of scrolling up or down:
		* by 'automatically' scrolling a section or by using the default and normal scrolling.
		*/
		function scrolling(type, scrollable){
			if (!isScrollAllowed[type]){
				return;
			}

			if(type == 'down'){
				var check = 'bottom';
				var scrollSection = $.fn.fullpage.moveSectionDown;
			}else{
				var check = 'top';
				var scrollSection = $.fn.fullpage.moveSectionUp;
			}

			if(scrollable.length > 0 ){
				//is the scrollbar at the start/end of the scroll?
				if(isScrolled(check, scrollable)){
					scrollSection();
				}else{
					return true;
				}
			}else{
				// moved up/down
				scrollSection();
			}
		}


		var touchStartY = 0;
		var touchStartX = 0;
		var touchEndY = 0;
		var touchEndX = 0;

		/* Detecting touch events

		* As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
		* This way, the touchstart and the touch moves shows an small difference between them which is the
		* used one to determine the direction.
		*/
		function touchMoveHandler(event){
			var e = event.originalEvent;

			// additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
			if (!checkParentForNormalScrollElement(event.target)) {

				if(options.autoScrolling && !options.scrollBar){
					//preventing the easing on iOS devices
					event.preventDefault();
				}

				var activeSection = $('.fp-section.active');
				var scrollable = isScrollable(activeSection);

				if (!isMoving && !slideMoving) { //if theres any #
					var touchEvents = getEventsPage(e);

					touchEndY = touchEvents['y'];
					touchEndX = touchEvents['x'];

					//if movement in the X axys is greater than in the Y and the currect section has slides...
					if (activeSection.find('.fp-slides').length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

					    //is the movement greater than the minimum resistance to scroll?
					    if (Math.abs(touchStartX - touchEndX) > ($(window).width() / 100 * options.touchSensitivity)) {
					        if (touchStartX > touchEndX) {
					        	if(isScrollAllowed.right){
					            	$.fn.fullpage.moveSlideRight(); //next
					            }
					        } else {
					        	if(isScrollAllowed.left){
					            	$.fn.fullpage.moveSlideLeft(); //prev
					            }
					        }
					    }
					}

					//vertical scrolling (only when autoScrolling is enabled)
					else if(options.autoScrolling && !options.scrollBar){

						//is the movement greater than the minimum resistance to scroll?
						if (Math.abs(touchStartY - touchEndY) > ($(window).height() / 100 * options.touchSensitivity)) {
							if (touchStartY > touchEndY) {
								scrolling('down', scrollable);
							} else if (touchEndY > touchStartY) {
								scrolling('up', scrollable);
							}
						}
					}
				}
			}

		}

		/**
		 * recursive function to loop up the parent nodes to check if one of them exists in options.normalScrollElements
		 * Currently works well for iOS - Android might need some testing
		 * @param  {Element} el  target element / jquery selector (in subsequent nodes)
		 * @param  {int}     hop current hop compared to options.normalScrollElementTouchThreshold
		 * @return {boolean} true if there is a match to options.normalScrollElements
		 */
		function checkParentForNormalScrollElement (el, hop) {
			hop = hop || 0;
			var parent = $(el).parent();

			if (hop < options.normalScrollElementTouchThreshold &&
				parent.is(options.normalScrollElements) ) {
				return true;
			} else if (hop == options.normalScrollElementTouchThreshold) {
				return false;
			} else {
				return checkParentForNormalScrollElement(parent, ++hop);
			}
		}

		function touchStartHandler(event){
			var e = event.originalEvent;

			var touchEvents = getEventsPage(e);
			touchStartY = touchEvents['y'];
			touchStartX = touchEvents['x'];
		}


		/**
		 * Detecting mousewheel scrolling
		 *
		 * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
		 * http://www.sitepoint.com/html5-javascript-mouse-wheel/
		 */
		function MouseWheelHandler(e) {
			if(options.autoScrolling){
				// cross-browser wheel delta
				e = window.event || e;
				var delta = Math.max(-1, Math.min(1,
						(e.wheelDelta || -e.deltaY || -e.detail)));

				//preventing to scroll the site on mouse wheel when scrollbar is present
				if(options.scrollBar){
					e.preventDefault ? e.preventDefault() : e.returnValue = false;

				}

				var activeSection = $('.fp-section.active');
				var scrollable = isScrollable(activeSection);

				if (!isMoving) { //if theres any #
					//scrolling down?
					if (delta < 0) {
						scrolling('down', scrollable);

					//scrolling up?
					}else {
						scrolling('up', scrollable);
					}
				}

				return false;
			}
		}

		function moveSlide(direction){
		    var activeSection = $('.fp-section.active');
		    var slides = activeSection.find('.fp-slides');

		    // more than one slide needed and nothing should be sliding
			if (!slides.length || slideMoving) {
			    return;
			}

		    var currentSlide = slides.find('.fp-slide.active');
		    var destiny = null;

		    if(direction === 'prev'){
		        destiny = currentSlide.prev('.fp-slide');
		    }else{
		        destiny = currentSlide.next('.fp-slide');
		    }

		    //isn't there a next slide in the secuence?
			if(!destiny.length){
				//respect loopHorizontal settin
				if (!options.loopHorizontal) return;

			    if(direction === 'prev'){
			        destiny = currentSlide.siblings(':last');
			    }else{
			        destiny = currentSlide.siblings(':first');
			    }
			}

		    slideMoving = true;

		    landscapeScroll(slides, destiny);
		}

		/**
		* Maintains the active slides in the viewport
		* (Because he `scroll` animation might get lost with some actions, such as when using continuousVertical)
		*/
		function keepSlidesPosition(){
			$('.fp-slide.active').each(function(){
				silentLandscapeScroll($(this));
			});
		}

		/**
		* Scrolls the site to the given element and scrolls to the slide if a callback is given.
		*/
		function scrollPage(element, callback, isMovementUp){
			var dest = element.position();
			if(typeof dest === "undefined"){ return; } //there's no element to scroll, leaving the function

			//local variables
			var v = {
				element: element,
				callback: callback,
				isMovementUp: isMovementUp,
				dest: dest,
				dtop: dest.top,
				yMovement: getYmovement(element),
				anchorLink: element.data('anchor'),
				sectionIndex: element.index('.fp-section'),
				activeSlide: element.find('.fp-slide.active'),
				activeSection: $('.fp-section.active'),
				leavingSection: $('.fp-section.active').index('.fp-section') + 1,

				//caching the value of isResizing at the momment the function is called
				//because it will be checked later inside a setTimeout and the value might change
				localIsResizing: isResizing
			};

			//quiting when destination scroll is the same as the current one
			if((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $(window).scrollTop() === v.dtop)){ return; }

			if(v.activeSlide.length){
				var slideAnchorLink = v.activeSlide.data('anchor');
				var slideIndex = v.activeSlide.index();
			}

			// If continuousVertical && we need to wrap around
			if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
				((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
				(v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

				v = createInfiniteSections(v);
			}

			element.addClass('active').siblings().removeClass('active');

			//preventing from activating the MouseWheelHandler event
			//more than once if the page is scrolling
			isMoving = true;

			setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

			//callback (onLeave) if the site is not just resizing and readjusting the slides
			$.isFunction(options.onLeave) && !v.localIsResizing && options.onLeave.call(this, v.leavingSection, (v.sectionIndex + 1), v.yMovement);

			performMovement(v);

			//flag to avoid callingn `scrollPage()` twice in case of using anchor links
			lastScrolledDestiny = v.anchorLink;

			//avoid firing it twice (as it does also on scroll)
			if(options.autoScrolling){
				activateMenuAndNav(v.anchorLink, v.sectionIndex)
			}
		}

		/**
		* Performs the movement (by CSS3 or by jQuery)
		*/
		function performMovement(v){
			// using CSS3 translate functionality
			if (options.css3 && options.autoScrolling && !options.scrollBar) {

				var translate3d = 'translate3d(0px, -' + v.dtop + 'px, 0px)';
				transformContainer(translate3d, true);

				setTimeout(function () {
					afterSectionLoads(v);
				}, options.scrollingSpeed);
			}

			// using jQuery animate
			else{
				var scrollSettings = getScrollSettings(v);

				$(scrollSettings.element).animate(
					scrollSettings.options
				, options.scrollingSpeed, options.easing).promise().done(function () { //only one single callback in case of animating  `html, body`
					afterSectionLoads(v);
				});
			}
		}

		/**
		* Gets the scrolling settings depending on the plugin autoScrolling option
		*/
		function getScrollSettings(v){
			var scroll = {};

			if(options.autoScrolling && !options.scrollBar){
				scroll.options = { 'top': -v.dtop};
				scroll.element = '.'+wrapperSelector;
			}else{
				scroll.options = { 'scrollTop': v.dtop};
				scroll.element = 'html, body';
			}

			return scroll;
		}

		/**
		* Adds sections before or after the current one to create the infinite effect.
		*/
		function createInfiniteSections(v){
			// Scrolling down
			if (!v.isMovementUp) {
				// Move all previous sections to after the active section
				$(".fp-section.active").after(v.activeSection.prevAll(".fp-section").get().reverse());
			}
			else { // Scrolling up
				// Move all next sections to before the active section
				$(".fp-section.active").before(v.activeSection.nextAll(".fp-section"));
			}

			// Maintain the displayed position (now that we changed the element order)
			silentScroll($('.fp-section.active').position().top);

			// Maintain the active slides visible in the viewport
			keepSlidesPosition();

			// save for later the elements that still need to be reordered
			v.wrapAroundElements = v.activeSection;

			// Recalculate animation variables
			v.dest = v.element.position();
			v.dtop = v.dest.top;
			v.yMovement = getYmovement(v.element);

			return v;
		}

		/**
		* Fix section order after continuousVertical changes have been animated
		*/
		function continuousVerticalFixSectionOrder (v) {
			// If continuousVertical is in effect (and autoScrolling would also be in effect then),
			// finish moving the elements around so the direct navigation will function more simply
			if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
				return;
			}

			if (v.isMovementUp) {
				$('.fp-section:first').before(v.wrapAroundElements);
			}
			else {
				$('.fp-section:last').after(v.wrapAroundElements);
			}

			silentScroll($('.fp-section.active').position().top);

			// Maintain the active slides visible in the viewport
			keepSlidesPosition();
		};


		/**
		* Actions to do once the section is loaded
		*/
		function afterSectionLoads (v){
			continuousVerticalFixSectionOrder(v);
			//callback (afterLoad) if the site is not just resizing and readjusting the slides
			$.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(this, v.anchorLink, (v.sectionIndex + 1));

			setTimeout(function () {
				isMoving = false;
				$.isFunction(v.callback) && v.callback.call(this);
			}, scrollDelay);
		}


		/**
		* Scrolls to the anchor in the URL when loading the site
		*/
		function scrollToAnchor(){
			//getting the anchor link in the URL and deleting the `#`
			var value =  window.location.hash.replace('#', '').split('/');
			var section = value[0];
			var slide = value[1];

			if(section){  //if theres any #
				scrollPageAndSlide(section, slide);
			}
		}

		//detecting any change on the URL to scroll to the given anchor link
		//(a way to detect back history button as we play with the hashes on the URL)
		$(window).on('hashchange', hashChangeHandler);

		function hashChangeHandler(){
			if(!isScrolling){
				var value =  window.location.hash.replace('#', '').split('/');
				var section = value[0];
				var slide = value[1];

				if(section.length){
					//when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
					var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
					var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined' && !slideMoving);

					/*in order to call scrollpage() only once for each destination at a time
					It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
					event is fired on every scroll too.*/
					if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (!slideMoving && lastScrolledSlide != slide ))  {
						scrollPageAndSlide(section, slide);
					}
				}
			}
		}


		/**
		 * Sliding with arrow keys, both, vertical and horizontal
		 */
		$(document).keydown(function(e) {
			//Moving the main page with the keyboard arrows if keyboard scrolling is enabled
			if (options.keyboardScrolling && options.autoScrolling) {

				//preventing the scroll with arrow keys
				if(e.which == 40 || e.which == 38){
					e.preventDefault();
				}

				if(!isMoving){
					switch (e.which) {
						//up
						case 38:
						case 33:
							$.fn.fullpage.moveSectionUp();
							break;

						//down
						case 40:
						case 34:
							$.fn.fullpage.moveSectionDown();
							break;

						//Home
						case 36:
							$.fn.fullpage.moveTo(1);
							break;

						//End
						case 35:
							$.fn.fullpage.moveTo( $('.fp-section').length );
							break;

						//left
						case 37:
							$.fn.fullpage.moveSlideLeft();
							break;

						//right
						case 39:
							$.fn.fullpage.moveSlideRight();
							break;

						default:
							return; // exit this handler for other keys
					}
				}
			}
		});

		/**
		* Scrolls to the section when clicking the navigation bullet
		*/
		$(document).on('click touchstart', '#fp-nav a', function(e){
			e.preventDefault();
			var index = $(this).parent().index();
			scrollPage($('.fp-section').eq(index));
		});

		/**
		* Scrolls the slider to the given slide destination for the given section
		*/
		$(document).on('click touchstart', '.fp-slidesNav a', function(e){
			e.preventDefault();
			var slides = $(this).closest('.fp-section').find('.fp-slides');
			var destiny = slides.find('.fp-slide').eq($(this).closest('li').index());

			landscapeScroll(slides, destiny);
		});

		if(options.normalScrollElements){
			$(document).on('mouseenter', options.normalScrollElements, function () {
				$.fn.fullpage.setMouseWheelScrolling(false);
			});

			$(document).on('mouseleave', options.normalScrollElements, function(){
				$.fn.fullpage.setMouseWheelScrolling(true);
			});
		}

		/**
		 * Scrolling horizontally when clicking on the slider controls.
		 */
		$('.fp-section').on('click touchstart', '.fp-controlArrow', function() {
			if ($(this).hasClass('fp-prev')) {
				$.fn.fullpage.moveSlideLeft();
			} else {
				$.fn.fullpage.moveSlideRight();
			}
		});

		/**
		* Scrolls horizontal sliders.
		*/
		function landscapeScroll(slides, destiny){
			var destinyPos = destiny.position();
			var slidesContainer = slides.find('.fp-slidesContainer').parent();
			var slideIndex = destiny.index();
			var section = slides.closest('.fp-section');
			var sectionIndex = section.index('.fp-section');
			var anchorLink = section.data('anchor');
			var slidesNav = section.find('.fp-slidesNav');
			var slideAnchor = destiny.data('anchor');

			//caching the value of isResizing at the momment the function is called
			//because it will be checked later inside a setTimeout and the value might change
			var localIsResizing = isResizing;

			if(options.onSlideLeave){
				var prevSlideIndex = section.find('.fp-slide.active').index();
				var xMovement = getXmovement(prevSlideIndex, slideIndex);

				//if the site is not just resizing and readjusting the slides
				if(!localIsResizing && xMovement!=='none'){
					$.isFunction( options.onSlideLeave ) && options.onSlideLeave.call( this, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement);
				}
			}

			destiny.addClass('active').siblings().removeClass('active');


			if(typeof slideAnchor === 'undefined'){
				slideAnchor = slideIndex;
			}

			if(!options.loopHorizontal && options.controlArrows){
				//hidding it for the fist slide, showing for the rest
				section.find('.fp-controlArrow.fp-prev').toggle(slideIndex!=0);

				//hidding it for the last slide, showing for the rest
				section.find('.fp-controlArrow.fp-next').toggle(!destiny.is(':last-child'));
			}

			//only changing the URL if the slides are in the current section (not for resize re-adjusting)
			if(section.hasClass('active')){
				setState(slideIndex, slideAnchor, anchorLink, sectionIndex);
			}

			var afterSlideLoads = function(){
				//if the site is not just resizing and readjusting the slides
				if(!localIsResizing){
					$.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( this, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
				}
				//letting them slide again
				slideMoving = false;
			};

			if(options.css3){
				var translate3d = 'translate3d(-' + destinyPos.left + 'px, 0px, 0px)';

				addAnimation(slides.find('.fp-slidesContainer'), options.scrollingSpeed>0).css(getTransforms(translate3d));

				setTimeout(function(){
					afterSlideLoads();
				}, options.scrollingSpeed, options.easing);
			}else{
				slidesContainer.animate({
					scrollLeft : destinyPos.left
				}, options.scrollingSpeed, options.easing, function() {

					afterSlideLoads();
				});
			}

			slidesNav.find('.active').removeClass('active');
			slidesNav.find('li').eq(slideIndex).find('a').addClass('active');
		}

	    //when resizing the site, we adjust the heights of the sections, slimScroll...
	    $(window).resize(resizeHandler);

	    var previousHeight = windowsHeight;
	    var resizeId;
	    function resizeHandler(){
	    	//checking if it needs to get responsive
	    	responsive();

	    	// rebuild immediately on touch devices
			if (isTouchDevice) {

				//if the keyboard is visible
				if ($(document.activeElement).attr('type') !== 'text') {
					var currentHeight = $(window).height();

					//making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
					if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
			        	$.fn.fullpage.reBuild(true);
			        	previousHeight = currentHeight;
			        }
		        }
	      	}else{
	      		//in order to call the functions only when the resize is finished
	    		//http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
	      		clearTimeout(resizeId);

	        	resizeId = setTimeout(function(){
	        		$.fn.fullpage.reBuild(true);
	        	}, 500);
	      	}
	    }

	    /**
	    * Checks if the site needs to get responsive and disables autoScrolling if so.
	    * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
	    */
	    function responsive(){
	    	if(options.responsive){
	    		var isResponsive = container.hasClass('fp-responsive');
	    		if ($(window).width() < options.responsive ){
	    			if(!isResponsive){
	    				$.fn.fullpage.setAutoScrolling(false, 'internal');
	    				$('#fp-nav').hide();
						container.addClass('fp-responsive');
	    			}
	    		}else if(isResponsive){
	    			$.fn.fullpage.setAutoScrolling(originals.autoScrolling, 'internal');
	    			$('#fp-nav').show();
					container.removeClass('fp-responsive');
	    		}
	    	}
	    }

	    /**
		* Adds transition animations for the given element
		*/
		function addAnimation(element){
			var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

			element.removeClass('fp-notransition');
			return element.css({
				'-webkit-transition': transition,
     			'transition': transition
       		});
		}

		/**
		* Remove transition animations for the given element
		*/
		function removeAnimation(element){
			return element.addClass('fp-notransition');
		}

		/**
		 * Resizing of the font size depending on the window size as well as some of the images on the site.
		 */
		function resizeMe(displayHeight, displayWidth) {
			//Standard dimensions, for which the body font size is correct
			var preferredHeight = 825;
			var preferredWidth = 900;

			if (displayHeight < preferredHeight || displayWidth < preferredWidth) {
				var heightPercentage = (displayHeight * 100) / preferredHeight;
				var widthPercentage = (displayWidth * 100) / preferredWidth;
				var percentage = Math.min(heightPercentage, widthPercentage);
				var newFontSize = percentage.toFixed(2);

				$("body").css("font-size", newFontSize + '%');
			} else {
				$("body").css("font-size", '100%');
			}
		}

		/**
		 * Activating the website navigation dots according to the given slide name.
		 */
		function activateNavDots(name, sectionIndex){
			if(options.navigation){
				$('#fp-nav').find('.active').removeClass('active');
				if(name){
					$('#fp-nav').find('a[href="#' + name + '"]').addClass('active');
				}else{
					$('#fp-nav').find('li').eq(sectionIndex).find('a').addClass('active');
				}
			}
		}

		/**
		 * Activating the website main menu elements according to the given slide name.
		 */
		function activateMenuElement(name){
			if(options.menu){
				$(options.menu).find('.active').removeClass('active');
				$(options.menu).find('[data-menuanchor="'+name+'"]').addClass('active');
			}
		}

		function activateMenuAndNav(anchor, index){
			activateMenuElement(anchor);
			activateNavDots(anchor, index);
		}

		/**
		* Return a boolean depending on whether the scrollable element is at the end or at the start of the scrolling
		* depending on the given type.
		*/
		function isScrolled(type, scrollable){
			if(type === 'top'){
				return !scrollable.scrollTop();
			}else if(type === 'bottom'){
				return scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
			}
		}

		/**
		* Retuns `up` or `down` depending on the scrolling movement to reach its destination
		* from the current section.
		*/
		function getYmovement(destiny){
			var fromIndex = $('.fp-section.active').index('.fp-section');
			var toIndex = destiny.index('.fp-section');
			if( fromIndex == toIndex){
				return 'none'
			}
			if(fromIndex > toIndex){
				return 'up';
			}
			return 'down';
		}

		/**
		* Retuns `right` or `left` depending on the scrolling movement to reach its destination
		* from the current slide.
		*/
		function getXmovement(fromIndex, toIndex){
			if( fromIndex == toIndex){
				return 'none'
			}
			if(fromIndex > toIndex){
				return 'left';
			}
			return 'right';
		}


		function createSlimScrolling(element){
			//needed to make `scrollHeight` work under Opera 12
			element.css('overflow', 'hidden');

			//in case element is a slide
			var section = element.closest('.fp-section');
			var scrollable = element.find('.fp-scrollable');

			//if there was scroll, the contentHeight will be the one in the scrollable section
			if(scrollable.length){
				var contentHeight = scrollable.get(0).scrollHeight;
			}else{
				var contentHeight = element.get(0).scrollHeight;
				if(options.verticalCentered){
					contentHeight = element.find('.fp-tableCell').get(0).scrollHeight;
				}
			}

			var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));

			//needs scroll?
			if ( contentHeight > scrollHeight) {
				//was there already an scroll ? Updating it
				if(scrollable.length){
					scrollable.css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
				}
				//creating the scrolling
				else{
					if(options.verticalCentered){
						element.find('.fp-tableCell').wrapInner('<div class="fp-scrollable" />');
					}else{
						element.wrapInner('<div class="fp-scrollable" />');
					}

					element.find('.fp-scrollable').slimScroll({
						allowPageScroll: true,
						height: scrollHeight + 'px',
						size: '10px',
						alwaysVisible: true
					});
				}
			}

			//removing the scrolling when it is not necessary anymore
			else{
				removeSlimScroll(element);
			}

			//undo
			element.css('overflow', '');
		}

		function removeSlimScroll(element){
			element.find('.fp-scrollable').children().first().unwrap().unwrap();
			element.find('.slimScrollBar').remove();
			element.find('.slimScrollRail').remove();
		}

		function addTableClass(element){
			element.addClass('fp-table').wrapInner('<div class="fp-tableCell" style="height:' + getTableHeight(element) + 'px;" />');
		}

		function getTableHeight(element){
			var sectionHeight = windowsHeight;

			if(options.paddingTop || options.paddingBottom){
				var section = element;
				if(!section.hasClass('fp-section')){
					section = element.closest('.fp-section');
				}

				var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
				sectionHeight = (windowsHeight - paddings);
			}

			return sectionHeight;
		}

		/**
		* Adds a css3 transform property to the container class with or without animation depending on the animated param.
		*/
		function transformContainer(translate3d, animated){
			if(animated){
				addAnimation(container);
			}else{
				removeAnimation(container);
			}

			container.css(getTransforms(translate3d));

			//syncronously removing the class after the animation has been applied.
			setTimeout(function(){
				container.removeClass('fp-notransition');
			},10)
		}


		/**
		* Scrolls to the given section and slide
		*/
		function scrollPageAndSlide(destiny, slide){
			if (typeof slide === 'undefined') {
			    slide = 0;
			}

			if(isNaN(destiny)){
				var section = $('[data-anchor="'+destiny+'"]');
			}else{
				var section = $('.fp-section').eq( (destiny -1) );
			}


			//we need to scroll to the section and then to the slide
			if (destiny !== lastScrolledDestiny && !section.hasClass('active')){
				scrollPage(section, function(){
					scrollSlider(section, slide)
				});
			}
			//if we were already in the section
			else{
				scrollSlider(section, slide);
			}
		}

		/**
		* Scrolls the slider to the given slide destination for the given section
		*/
		function scrollSlider(section, slide){
			if(typeof slide != 'undefined'){
				var slides = section.find('.fp-slides');
				var destiny =  slides.find('[data-anchor="'+slide+'"]');

				if(!destiny.length){
					destiny = slides.find('.fp-slide').eq(slide);
				}

				if(destiny.length){
					landscapeScroll(slides, destiny);
				}
			}
		}

		/**
		* Creates a landscape navigation bar with dots for horizontal sliders.
		*/
		function addSlidesNavigation(section, numSlides){
			section.append('<div class="fp-slidesNav"><ul></ul></div>');
			var nav = section.find('.fp-slidesNav');

			//top or bottom
			nav.addClass(options.slidesNavPosition);

			for(var i=0; i< numSlides; i++){
				nav.find('ul').append('<li><a href="#"><span></span></a></li>');
			}

			//centering it
			nav.css('margin-left', '-' + (nav.width()/2) + 'px');

			nav.find('li').first().find('a').addClass('active');
		}


		/**
		* Sets the state of the website depending on the active section/slide.
		* It changes the URL hash when needed and updates the body class.
		*/
		function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
			var sectionHash = '';

			if(options.anchors.length){

				//isn't it the first slide?
				if(slideIndex){
					if(typeof anchorLink !== 'undefined'){
						sectionHash = anchorLink;
					}

					//slide without anchor link? We take the index instead.
					if(typeof slideAnchor === 'undefined'){
						slideAnchor = slideIndex;
					}

					lastScrolledSlide = slideAnchor;
					setUrlHash(sectionHash + '/' + slideAnchor);

				//first slide won't have slide anchor, just the section one
				}else if(typeof slideIndex !== 'undefined'){
					lastScrolledSlide = slideAnchor;
					setUrlHash(anchorLink);
				}

				//section without slides
				else{
					setUrlHash(anchorLink);
				}

				setBodyClass(location.hash);
			}
			else if(typeof slideIndex !== 'undefined'){
					setBodyClass(sectionIndex + '-' + slideIndex);
			}
			else{
				setBodyClass(String(sectionIndex));
			}
		}

		/**
		* Sets the URL hash.
		*/
		function setUrlHash(url){
			if(options.recordHistory){
				location.hash = url;
			}else{
				//Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
				if(isTouchDevice || isTouch){
					history.replaceState(undefined, undefined, "#" + url)
				}else{
					var baseUrl = window.location.href.split('#')[0];
					window.location.replace( baseUrl + '#' + url );
				}
			}
		}

		/**
		* Sets a class for the body of the page depending on the active section / slide
		*/
		function setBodyClass(text){
			//changing slash for dash to make it a valid CSS style
			text = text.replace('/', '-').replace('#','');

			//removing previous anchor classes
			$("body")[0].className = $("body")[0].className.replace(/\b\s?fp-viewing-[^\s]+\b/g, '');

			//adding the current anchor
			$("body").addClass("fp-viewing-" + text);
		}

		/**
		* Checks for translate3d support
		* @return boolean
		* http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
		*/
		function support3d() {
			var el = document.createElement('p'),
				has3d,
				transforms = {
					'webkitTransform':'-webkit-transform',
					'OTransform':'-o-transform',
					'msTransform':'-ms-transform',
					'MozTransform':'-moz-transform',
					'transform':'transform'
				};

			// Add it to the body to get the computed style.
			document.body.insertBefore(el, null);

			for (var t in transforms) {
				if (el.style[t] !== undefined) {
					el.style[t] = "translate3d(1px,1px,1px)";
					has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
				}
			}

			document.body.removeChild(el);

			return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
		}



		/**
		* Removes the auto scrolling action fired by the mouse wheel and trackpad.
		* After this function is called, the mousewheel and trackpad movements won't scroll through sections.
		*/
		function removeMouseWheelHandler(){
			if (document.addEventListener) {
				document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
				document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
			} else {
				document.detachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
			}
		}


		/**
		* Adds the auto scrolling action for the mouse wheel and trackpad.
		* After this function is called, the mousewheel and trackpad movements will scroll through sections
		*/
		function addMouseWheelHandler(){
			if (document.addEventListener) {
				document.addEventListener("mousewheel", MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
				document.addEventListener("wheel", MouseWheelHandler, false); //Firefox
			} else {
				document.attachEvent("onmousewheel", MouseWheelHandler); //IE 6/7/8
			}
		}


		/**
		* Adds the possibility to auto scroll through sections on touch devices.
		*/
		function addTouchHandler(){
			if(isTouchDevice || isTouch){
				//Microsoft pointers
				MSPointer = getMSPointer();

				$(document).off('touchstart ' +  MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
				$(document).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
			}
		}

		/**
		* Removes the auto scrolling for touch devices.
		*/
		function removeTouchHandler(){
			if(isTouchDevice || isTouch){
				//Microsoft pointers
				MSPointer = getMSPointer();

				$(document).off('touchstart ' + MSPointer.down);
				$(document).off('touchmove ' + MSPointer.move);
			}
		}


		/*
		* Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
		* http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
		*/
		function getMSPointer(){
			var pointer;

			//IE >= 11 & rest of browsers
			if(window.PointerEvent){
				pointer = { down: "pointerdown", move: "pointermove"};
			}

			//IE < 11
			else{
				pointer = { down: "MSPointerDown", move: "MSPointerMove"};
			}

			return pointer;
		}
		/**
		* Gets the pageX and pageY properties depending on the browser.
		* https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
		*/
		function getEventsPage(e){
			var events = new Array();

			events['y'] = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
			events['x'] = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

			return events;
		}

		function silentLandscapeScroll(activeSlide){
			$.fn.fullpage.setScrollingSpeed (0, 'internal');
			landscapeScroll(activeSlide.closest('.fp-slides'), activeSlide);
			$.fn.fullpage.setScrollingSpeed(originals.scrollingSpeed, 'internal');
		}

		function silentScroll(top){
			if(options.scrollBar){
				container.scrollTop(top);
			}
			else if (options.css3) {
				var translate3d = 'translate3d(0px, -' + top + 'px, 0px)';
				transformContainer(translate3d, false);
			}
			else {
				container.css("top", -top);
			}
		}

		function getTransforms(translate3d){
			return {
				'-webkit-transform': translate3d,
				'-moz-transform': translate3d,
				'-ms-transform':translate3d,
				'transform': translate3d
			};
		}

		function setIsScrollable(value, direction){
			switch (direction){
				case 'up': isScrollAllowed.up = value; break;
				case 'down': isScrollAllowed.down = value; break;
				case 'left': isScrollAllowed.left = value; break;
				case 'right': isScrollAllowed.right = value; break;
				case 'all': $.fn.fullpage.setAllowScrolling(value);
			}
		}


		/*
		* Destroys fullpage.js plugin events and optinally its html markup and styles
		*/
		$.fn.fullpage.destroy = function(all){
			$.fn.fullpage.setAutoScrolling(false, 'internal');
 			$.fn.fullpage.setAllowScrolling(false);
 			$.fn.fullpage.setKeyboardScrolling(false);


 			$(window)
				.off('scroll', scrollHandler)
  				.off('hashchange', hashChangeHandler)
  				.off('resize', resizeHandler);

			$(document)
				.off('click', '#fp-nav a')
				.off('mouseenter', '#fp-nav li')
				.off('mouseleave', '#fp-nav li')
				.off('click', '.fp-slidesNav a')
  				.off('mouseover', options.normalScrollElements)
  				.off('mouseout', options.normalScrollElements);

			$('.fp-section')
				.off('click', '.fp-controlArrow');

			//lets make a mess!
			if(all){
				destroyStructure();
			}
 		};

 		/*
		* Removes inline styles added by fullpage.js
		*/
		function destroyStructure(){
			//reseting the `top` or `translate` properties to 0
	 		silentScroll(0);

			$('#fp-nav, .fp-slidesNav, .fp-controlArrow').remove();

			//removing inline styles
			$('.fp-section').css( {
				'height': '',
				'background-color' : '',
				'padding': ''
			});

			$('.fp-slide').css( {
				'width': ''
			});

			container.css({
	 			'height': '',
	 			'position': '',
	 			'-ms-touch-action': '',
	 			'touch-action': ''
	 		});

			//removing added classes
			$('.fp-section, .fp-slide').each(function(){
				removeSlimScroll($(this));
				$(this).removeClass('fp-table active');
			});

			removeAnimation(container);
			removeAnimation(container.find('.fp-easing'));

			//Unwrapping content
			container.find('.fp-tableCell, .fp-slidesContainer, .fp-slides').each(function(){
				//unwrap not being use in case there's no child element inside and its just text
				$(this).replaceWith(this.childNodes);
			});

			//scrolling the page to the top with no animation
			$('html, body').scrollTop(0);
		}

		/*
		* Sets the state for a variable with multiple states (original, and temporal)
		* Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
		* This function is used to keep track of both states, the original and the temporal one.
		* If type is not 'internal', then we assume the user is globally changing the variable.
		*/
		function setVariableState(variable, value, type){
			options[variable] = value;
			if(type !== 'internal'){
				originals[variable] = value;
			}
		}

		/**
		* Displays warnings
		*/
		function displayWarnings(){
			// Disable mutually exclusive settings
			if (options.continuousVertical &&
				(options.loopTop || options.loopBottom)) {
			    options.continuousVertical = false;
			    showError('warn', "Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled");
			}
			if(options.continuousVertical && options.scrollBar){
				options.continuousVertical = false;
				showError('warn', "Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled");
			}

			//anchors can not have the same value as any element ID or NAME
			$.each(options.anchors, function(index, name){
				if($('#' + name).length || $('[name="'+name+'"]').length ){
					showError('error', "data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).");
				}
			});
		}

		function showError(type, text){
			console && console[type] && console[type]('fullPage: ' + text);
		}
	};
})(jQuery);



//  API SET APP

import { Component } from 'types/component'
import { PropOptions } from 'types/options'
import { popTarget, pushTarget } from '../core/observer/dep'
import { def, invokeWithErrorHandling, isReserved, warn } from '../core/util'
import VNode from '../core/vdom/vnode'
import {
  bind,
  emptyObject,
  isArray,
  isFunction,
  isObject
} from '../shared/util'
import { currentInstance, setCurrentInstance } from './currentInstance'
import { shallowReactive } from './reactivity/reactive'
import { proxyWithRefUnwrap } from './reactivity/ref'

/**
 * @internal
 */
export interface SetupContext {
  attrs: Record<string, any>
  listeners: Record<string, Function | Function[]>
  slots: Record<string, () => VNode[]>
  emit: (event: string, ...args: any[]) => any
  expose: (exposed: Record<string, any>) => void
}

export function initSetup(vm: Component) {
  const options = vm.$options
  const setup = options.setup
  if (setup) {
    const ctx = (vm._setupContext = createSetupContext(vm))

    setCurrentInstance(vm)
    pushTarget()
    const setupResult = invokeWithErrorHandling(
      setup,
      null,
      [vm._props || shallowReactive({}), ctx],
      vm,
      `setup`
    )
    popTarget()
    setCurrentInstance()

    if (isFunction(setupResult)) {
      // render function
      // @ts-ignore
      options.render = setupResult
    } else if (isObject(setupResult)) {
      // bindings
      if (__DEV__ && setupResult instanceof VNode) {
        warn(
          `setup() should not return VNodes directly - ` +
            `return a render function instead.`
        )
      }
      vm._setupState = setupResult
      // __sfc indicates compiled bindings from <script setup>
      if (!setupResult.__sfc) {
        for (const key in setupResult) {
          if (!isReserved(key)) {
            proxyWithRefUnwrap(vm, setupResult, key)
          } else if (__DEV__) {
            warn(`Avoid using variables that start with _ or $ in setup().`)
          }
        }
      } else {
        // exposed for compiled render fn
        const proxy = (vm._setupProxy = {})
        for (const key in setupResult) {
          if (key !== '__sfc') {
            proxyWithRefUnwrap(proxy, setupResult, key)
          }
        }
      }
    } else if (__DEV__ && setupResult !== undefined) {
      warn(
        `setup() should return an object. Received: ${
          setupResult === null ? 'null' : typeof setupResult
        }`
      )
    }
  }
}

function createSetupContext(vm: Component): SetupContext {
  let exposeCalled = false
  return {
    get attrs() {
      if (!vm._attrsProxy) {
        const proxy = (vm._attrsProxy = {})
        def(proxy, '_v_attr_proxy', true)
        syncSetupProxy(proxy, vm.$attrs, emptyObject, vm, '$attrs')
      }
      return vm._attrsProxy
    },
    get listeners() {
      if (!vm._listenersProxy) {
        const proxy = (vm._listenersProxy = {})
        syncSetupProxy(proxy, vm.$listeners, emptyObject, vm, '$listeners')
      }
      return vm._listenersProxy
    },
    get slots() {
      return initSlotsProxy(vm)
    },
    emit: bind(vm.$emit, vm) as any,
    expose(exposed?: Record<string, any>) {
      if (__DEV__) {
        if (exposeCalled) {
          warn(`expose() should be called only once per setup().`, vm)
        }
        exposeCalled = true
      }
      if (exposed) {
        Object.keys(exposed).forEach(key =>
          proxyWithRefUnwrap(vm, exposed, key)
        )
      }
    }
  }
}

export function syncSetupProxy(
  to: any,
  from: any,
  prev: any,
  instance: Component,
  type: string
) {
  let changed = false
  for (const key in from) {
    if (!(key in to)) {
      changed = true
      defineProxyAttr(to, key, instance, type)
    } else if (from[key] !== prev[key]) {
      changed = true
    }
  }
  for (const key in to) {
    if (!(key in from)) {
      changed = true
      delete to[key]
    }
  }
  return changed
}

function defineProxyAttr(
  proxy: any,
  key: string,
  instance: Component,
  type: string
) {
  Object.defineProperty(proxy, key, {
    enumerable: true,
    configurable: true,
    get() {
      return instance[type][key]
    }
  })
}

function initSlotsProxy(vm: Component) {
  if (!vm._slotsProxy) {
    syncSetupSlots((vm._slotsProxy = {}), vm.$scopedSlots)
  }
  return vm._slotsProxy
}

export function syncSetupSlots(to: any, from: any) {
  for (const key in from) {
    to[key] = from[key]
  }
  for (const key in to) {
    if (!(key in from)) {
      delete to[key]
    }
  }
}

/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
export function useSlots(): SetupContext['slots'] {
  return getContext().slots
}

/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
export function useAttrs(): SetupContext['attrs'] {
  return getContext().attrs
}

/**
 * Vue 2 only
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
export function useListeners(): SetupContext['listeners'] {
  return getContext().listeners
}

function getContext(): SetupContext {
  if (__DEV__ && !currentInstance) {
    warn(`useContext() called without active instance.`)
  }
  const vm = currentInstance!
  return vm._setupContext || (vm._setupContext = createSetupContext(vm))
}

/**
 * Runtime helper for merging default declarations. Imported by compiled code
 * only.
 * @internal
 */
export function mergeDefaults(
  raw: string[] | Record<string, PropOptions>,
  defaults: Record<string, any>
): Record<string, PropOptions> {
  const props = isArray(raw)
    ? raw.reduce(
        (normalized, p) => ((normalized[p] = {}), normalized),
        {} as Record<string, PropOptions>
      )
    : raw
  for (const key in defaults) {
    const opt = props[key]
    if (opt) {
      if (isArray(opt) || isFunction(opt)) {
        props[key] = { type: opt, default: defaults[key] }
      } else {
        opt.default = defaults[key]
      }
    } else if (opt === null) {
      props[key] = { default: defaults[key] }
    } else if (__DEV__) {
      warn(`props default key "${key}" has no corresponding declaration.`)
    }
  }
  return props
}



new Vue({
    el: '#app',
    data: {
        // Enter your Bing Maps API key here
        bingMapAPIKEY: '',
        currentLanguage: 'en',
        currentTexts: {},

        textEN: {
            nav: {
                id: 'nav',
                Title: 'IP Toolbox',
                IPinfo: 'IP Infos',
                Connectivity: 'Connectivity',
                WebRTC: 'WebRTC Test',
                DNSLeakTest: 'DNS Leak Test',
            },
            ipInfos: {
                id: "ipinfos",
                Title: "IP Infos",
                Notes: "IP data will be checked from 6 sources. If there is only 1 IP stack currently, sources without data will show as empty.",
                Simple: "Simple",
                Map: "Map",
                MapUnavailable: "Map Unavailable",
                Source: "Source",
                IP: "IP Address",
                Country: "Country",
                Region: "Region",
                City: "City",
                ISP: "ISP",
                ASN: "ASN",
                IPv4Error: "Fetch Failed or No IPv4 Address",
                IPv6Error: "Fetch Failed or No IPv6 Address",
            },
            connectivity: {
                id: "connectivity",
                Title: "Network Connectivity",
                Note: "Testing is done by loading small images from corresponding websites. Delay values are for reference only and will be smaller in reality.",
                StatusWait: "Awaiting Test",
                StatusAvailable: "OK",
                StatusUnavailable: "Unavailable",
                StatusTimeout: "Timeout or Unavailable",
                checking: 'Checking...',
            },
            webrtc: {
                id: "webrtc",
                Title: "WebRTC Test",
                Note: "WebRTC often establishes connections directly via UDP. If the test returns your real IP, it means your proxy settings do not cover these connections.",
                StatusWait: "Awaiting Test or Connection Error",
                StatusError: "Test Error",
            },
            dnsleaktest: {
                id: "dnsleaktest",
                Name: "Test",
                Title: "DNS Leak Test",
                Note: "A DNS leak means that when you are connected to a VPN/proxy, your domain name resolutions are still done through your local ISP, thus posing a risk of DNS leaks.",
                Note2: "The leak test method involves accessing a newly generated domain name to detect which region's DNS is being used as per your VPN/proxy settings.",
                Endpoint: "DNS Endpoint",
                EndpointCountry: "Endpoint Region",
                StatusWait: "Awaiting Test",
                StatusError: "Test Error",
            },
            ipcheck: {
                id: "ipcheck",
                Title: "IP Check",
                Placeholder: "Please enter an IP address",
                Button: "Check",
                Error: "Please enter a valid IPv4 or IPv6 address.",
            },
            alert: {
                id: 'alert',
                OhNo: 'Oh No!',
                Congrats: 'Congrats!',
                OhNo_Message: 'You seem to be not connected to a VPN/proxy, some content may not be displayed.',
                Congrats_Message: 'You are now connected to a VPN/proxy, welcome to the new world.',
            },
            page: {
                title: "Check My IP Address | Check My IP Address and Geolocation | Check WebRTC Connection IP | DNS Leak Test | Jason Ng Open Source",
            },

        },
        textCN: {
            nav: {
                id: 'nav',
                Title: 'IP 工具箱',
                IPinfo: 'IP 信息',
                Connectivity: '网络连通性',
                WebRTC: 'WebRTC 测试',
                DNSLeakTest: 'DNS 泄漏测试',
            },
            ipInfos: {
                id: 'ipinfos',
                Title: 'IP 信息',
                Notes: '将会从 6 个来源检查 IP 数据，如果当前 IP 栈只有 1 个，则没有数据的来源会显示为空。',
                Simple: '简约',
                Map: '地图',
                MapUnavailable: '地图不可用',
                Source: '来源',
                IP: 'IP 地址',
                Country: '国家',
                Region: '地区',
                City: '城市',
                ISP: 'ISP',
                ASN: 'ASN',
                IPv4Error: '获取失败或不存在 IPv4 地址',
                IPv6Error: '获取失败或不存在 IPv6 地址',

            },
            connectivity: {
                id: 'connectivity',
                Title: '网络连通性',
                Note: '通过加载对应网站上的小图片进行测试，延迟值仅供参考，实际会更小。',
                StatusWait: '待检测',
                StatusAvailable: '可用',
                StatusUnavailable: '不可用',
                StatusTimeout: '超时或不可用',
                checking: '检查中...',
            },
            webrtc: {
                id: 'webrtc',
                Title: 'WebRTC 测试',
                Note: 'WebRTC 往往通过 UDP 直连进行建立，如果测试返回了真实 IP，则意味着你的代理设置没有覆盖这些连接。',
                StatusWait: '待检测或连接错误',
                StatusError: '测试出错',
            },
            dnsleaktest: {
                id: 'dnsleaktest',
                Name: '测试',
                Title: 'DNS 泄漏测试',
                Note: 'DNS 泄露（DNS Leaks）的意思是，当你挂上 VPN/代理后，你解析域名时，依然通过当地的运营商进行解析，这时就有 DNS泄露的风险。',
                Note2: '泄露测试的方法是通过访问新生成的域名，检测你是通过哪个地区的改你的 VPN/代理设置。',
                Endpoint: 'DNS 出口',
                EndpointCountry: '出口地区',
                StatusWait: '待检测',
                StatusError: '测试出错',
            },
            ipcheck: {
                id: 'ipcheck',
                Title: 'IP 查询',
                Placeholder: '请输入有 IP 地址',
                Button: '查询',
                Error: '请输入有效的 IPv4 或 IPv6 地址。',
            },
            alert: {
                id: 'alert',
                OhNo: '糟糕！',
                Congrats: '恭喜呀！',
                OhNo_Message: '你当前似乎没有翻墙，部分内容无法显示。',
                Congrats_Message: '你当前已经翻墙，欢迎来到新世界。',
            },
            page: {
                title: "查看我的 IP 地址 | 查询本机 IP 地址及归属地 | 查看 WebRTC 连接 IP ｜ DNS 泄露检测 | Jason Ng 阿禅开源作品",
            },
        },
        ipDataCards: [
            {
                id: 'upai',
                ip: '',
                country_name: '',
                region: '',
                city: '',
                latitude: '',
                longitude: '',
                isp: '',
                asn: '',
                asnlink: '',
                mapUrl: 'res/defaultMap.jpg',
                showMap: false,
                source: 'Upai'
            },
            {
                id: 'taobao',
                ip: '',
                country_name: '',
                region: '',
                city: '',
                latitude: '',
                longitude: '',
                isp: '',
                asn: '',
                asnlink: '',
                mapUrl: 'res/defaultMap.jpg',
                showMap: false,
                source: 'Taobao'
            },
            {
                id: 'cloudflare_v4',
                ip: '',
                country_name: '',
                region: '',
                city: '',
                latitude: '',
                longitude: '',
                isp: '',
                asn: '',
                asnlink: '',
                mapUrl: 'res/defaultMap.jpg',
                showMap: false,
                source: 'Cloudflare IPv4'
            },
            {
                id: 'cloudflare_v6',
                ip: '',
                country_name: '',
                region: '',
                city: '',
                latitude: '',
                longitude: '',
                isp: '',
                asn: '',
                asnlink: '',
                mapUrl: 'res/defaultMap.jpg',
                showMap: false,
                source: 'Cloudflare IPv6'
            },
            {
                id: 'ipify_v4',
                ip: '',
                country_name: '',
                region: '',
                city: '',
                latitude: '',
                longitude: '',
                isp: '',
                asn: '',
                asnlink: '',
                mapUrl: 'res/defaultMap.jpg',
                showMap: false,
                source: 'IPify IPv4'
            },
            {
                id: 'ipify_v6',
                ip: '',
                country_name: '',
                region: '',
                city: '',
                latitude: '',
                longitude: '',
                isp: '',
                asn: '',
                asnlink: '',
                mapUrl: 'res/defaultMap.jpg',
                showMap: false,
                source: 'IPify IPv6'
            },
        ],
        connectivityTests: [
            {
                id: 'netease',
                name: 'Netease',
                icon: 'globe-americas',
                url: 'https://s2.music.126.net/style/web2/img/frame/topbar.png?',
                status: ''
            },
            {
                id: 'baidu',
                name: 'Baidu',
                icon: 'globe-americas',
                url: 'https://www.baidu.com/img/flexible/logo/pc/peak-result.png?',
                status: ''
            },
            {
                id: 'wechat',
                name: 'WeChat',
                icon: 'wechat',
                url: 'https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico?',
                status: ''
            },
            {
                id: 'google',
                name: 'Google',
                icon: 'google',
                url: 'https://www.google.com/images/errors/robot.png?',
                status: ''
            },
            {
                id: 'cloudflare',
                name: 'Cloudflare',
                icon: 'cloud-fill',
                url: 'https://www.cloudflare.com/favicon.ico?',
                status: ''
            },
            {
                id: 'youtube',
                name: 'Youtube',
                icon: 'youtube',
                url: 'https://i.ytimg.com/vi/GYkq9Rgoj8E/hq720.jpg?',
                status: ''
            },
            {
                id: 'github',
                name: 'Github',
                icon: 'github',
                url: 'https://raw.githubusercontent.com/jason5ng32/fulian4/master/background.jpg?',
                status: ''
            },
            {
                id: 'chatgpt',
                name: 'ChatGPT',
                icon: 'chat-quote-fill',
                url: 'https://chat.openai.com/favicon.ico?',
                status: ''
            }
        ],
        stunServers: [
            {
                id: 'google',
                name: 'Google',
                url: 'stun:stun.l.google.com:19302',
                ip: ''
            },
            {
                id: 'nextcloud',
                name: 'NxtCld',
                url: 'stun:stun.nextcloud.com:443',
                ip: ''
            },
            {
                id: 'peerjs',
                name: 'PeerJS',
                url: 'stun:us-0.turn.peerjs.com',
                ip: ''
            },
            {
                id: 'twilio',
                name: 'Twilio',
                url: 'stun:global.stun.twilio.com',
                ip: ''
            },
            {
                id: 'cloudflare',
                name: 'Cloudflare',
                url: 'stun:stun.cloudflare.com',
                ip: ''
            },
            {
                id: 'miwifi',
                name: 'MiWiFi',
                url: 'stun:stun.miwifi.com',
                ip: ''
            },
            {
                id: 'qq',
                name: 'QQ',
                url: 'stun:stun.qq.com',
                ip: ''
            },
            {
                id: 'stunprotocol',
                name: 'StnPtc',
                url: 'stun:stunserver.stunprotocol.org',
                ip: ''
            }
        ],
        leakTest: [
            {
                "id": "ipapi1",
                "name": "",
                "geo": "",
                "ip": ""
            },
            {
                "id": "ipapi2",
                "name": "",
                "geo": "",
                "ip": ""
            },
            {
                "id": "sfshark1",
                "name": "",
                "geo": "",
                "ip": ""
            },
            {
                "id": "sfshark2",
                "name": "",
                "geo": "",
                "ip": ""
            },
        ],
        alertMessage: '',
        alertStyle: '',
        alertTitle: '',
        alertToShow: false,
        inputIP: '',
        modalQueryResult: null,
        modalQueryError: '',
        isMapShown: false,
        isDarkMode: false,
        isMobile: false,
        isCardsCollapsed: false,
    },
    methods: {

        getIPFromUpai() {
            const unixTime = Date.now();
            const url = `https://pubstatic.b0.upaiyun.com/?_upnode&t=${unixTime}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const ip = data.remote_addr;
                    this.ipDataCards[0].ip = ip;
                    this.fetchIPDetails(this.ipDataCards[0], ip);
                })
                .catch(error => {
                    console.error('Error fetching IP from Upai:', error);
                    this.ipDataCards[0].ip = this.currentTexts.ipInfos.IPv4Error;
                });
        },

        getIPFromTaobao() {
            window.ipCallback = (data) => {
                var ip = data.ip;
                this.ipDataCards[1].ip = ip; // 存储获取到的 IP 地址
                this.ipDataCards[1].source = 'TaoBao';
                this.fetchIPDetails(this.ipDataCards[1], ip);
                delete window.ipCallback; // 清理
            };
            var script = document.createElement('script');
            script.src = 'https://www.taobao.com/help/getip.php?callback=ipCallback';
            document.head.appendChild(script);
            // 清理
            document.head.removeChild(script);
        },

        getIPFromCloudflare_V4() {
            fetch('https://1.0.0.1/cdn-cgi/trace')
                .then(response => response.text())
                .then(data => {
                    const lines = data.split('\n');
                    const ipLine = lines.find(line => line.startsWith('ip='));
                    if (ipLine) {
                        const ip = ipLine.split('=')[1];
                        this.ipDataCards[2].ip = ip;
                        this.fetchIPDetails(this.ipDataCards[2], ip);
                    }
                })
                .catch(error => {
                    console.error('Error fetching IP from Cloudflare:', error);
                    this.ipDataCards[2].ip = this.currentTexts.ipInfos.IPv4Error;
                });
        },

        getIPFromCloudflare_V6() {
            fetch('https://[2606:4700:4700::1111]/cdn-cgi/trace')
                .then(response => response.text())
                .then(data => {
                    const lines = data.split('\n');
                    const ipLine = lines.find(line => line.startsWith('ip='));
                    if (ipLine) {
                        const ip = ipLine.split('=')[1];
                        this.ipDataCards[3].ip = ip;
                        this.fetchIPDetails(this.ipDataCards[3], ip);
                    }
                })
                .catch(error => {
                    console.error('Error fetching IP from Cloudflare:', error);
                    this.ipDataCards[3].ip = this.currentTexts.ipInfos.IPv6Error;
                });
        },
        getIPFromIpify_V4() {
            fetch('https://api4.ipify.org?format=json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.ipDataCards[4].ip = data.ip;
                    this.fetchIPDetails(this.ipDataCards[4], data.ip);
                })
                .catch(error => {
                    console.error('Error fetching IPv4 address from ipify:', error);
                    this.ipDataCards[4].ip = this.currentTexts.ipInfos.IPv4Error;
                });
        },
        getIPFromIpify_V6() {
            fetch('https://api6.ipify.org?format=json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.ipDataCards[5].ip = data.ip;
                    this.fetchIPDetails(this.ipDataCards[5], data.ip);
                })
                .catch(error => {
                    console.error('Error fetching IPv6 address from ipify:', error);
                    this.ipDataCards[5].ip = this.currentTexts.ipInfos.IPv6Error;
                });
        },
        async fetchIPDetails(card, ip) {
            try {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.reason);
                }
                card.ip = ip;
                card.country_name = data.country_name || '';
                card.country_code = data.country || '';
                card.region = data.region || '';
                card.city = data.city || '';
                card.latitude = data.latitude || '';
                card.longitude = data.longitude || '';
                card.isp = data.org || '';
                card.asn = data.asn || '';

                bingMapAPIKEY = this.bingMapAPIKEY;

                // 构造 AS Number 的链接
                if (card.asn === '') {
                    card.asnlink = false;
                    card.mapUrl = '';
                } else {
                    card.asnlink = `https://radar.cloudflare.com/traffic/${card.asn}`;
                    card.mapUrl = `https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/${card.latitude},${card.longitude}/5?mapSize=800,640&pp=${card.latitude},${card.longitude};66&key=${bingMapAPIKEY}&fmt=jpeg&dpi=Large`;

                    // 可选改成 Google Maps 内嵌 iFrame
                    // card.mapUrl = `https://www.google.com/maps?q=${card.latitude},${card.longitude}&z=2&output=embed`;
                }


            } catch (error) {
                console.error('Get IP error:', error);
                // 设置错误信息或保持字段为空
                card.mapUrl = '';
            }
        },
        refreshCard(card) {
            // 清空卡片数据
            this.clearCardData(card);
            switch (card.source) {
                case 'Cloudflare IPv4':
                    this.getIPFromCloudflare_V4(card);
                    break;
                case 'Cloudflare IPv6':
                    this.getIPFromCloudflare_V6(card);
                    break;
                case 'IPify IPv4':
                    this.getIPFromIpify_V4(card);
                    break;
                case 'IPify IPv6':
                    this.getIPFromIpify_V6(card);
                    break;
                case 'Upai':
                    this.getIPFromUpai(card);
                    break;
                case 'TaoBao':
                    this.getIPFromTaobao(card);
                    break;
                default:
                    console.error('Undefind Source:', card.source);
            }
        },

        clearCardData(card) {
            card.ip = '';
            card.country_name = '';
            card.country_code = '';
            card.region = '';
            card.city = '';
            card.latitude = '';
            card.longitude = '';
            card.asn = '';
            card.isp = '';
            card.mapUrl = 'res/defaultMap.jpg';
        },

        toggleMaps() {
            this.isMapShown = !this.isMapShown;
            this.ipDataCards.forEach(card => {
                card.showMap = this.isMapShown;
            });
        },

        checkAllIPs() {
            // 从所有来源获取 IP 地址
            setTimeout(() => {
                this.getIPFromCloudflare_V4();
                this.getIPFromCloudflare_V6();
            }, 1000);
            setTimeout(() => {
                this.getIPFromTaobao();
                this.getIPFromUpai();
            }, 100);
            setTimeout(() => {
                this.getIPFromIpify_V4();
                this.getIPFromIpify_V6();
            }, 2000);
        },

        checkConnectivityHandler(test) {
            const beginTime = + new Date();
            test.status = this.currentTexts.connectivity.checking;
            var img = new Image();
            var timeout = setTimeout(() => {
                test.status = this.currentTexts.connectivity.StatusUnavailable;
                if (test.id === 'google') {
                    this.alertStyle = "text-danger";
                    this.alertMessage = this.currentTexts.alert.OhNo_Message;
                    this.alertTitle = this.currentTexts.alert.OhNo;
                    this.alertToShow = true;
                }
            }, 3 * 1000);

            img.onload = () => {
                clearTimeout(timeout);
                test.status = this.currentTexts.connectivity.StatusAvailable + ` ( ${+ new Date() - beginTime} ms )`;
                if (test.id === 'google') {
                    this.alertStyle = "text-success";
                    this.alertMessage = this.currentTexts.alert.Congrats_Message;
                    this.alertTitle = this.currentTexts.alert.Congrats;
                    this.alertToShow = true;
                }
            };

            img.onerror = () => {
                clearTimeout(timeout);
                test.status = this.currentTexts.connectivit.StatusUnavailable;
                if (test.id === 'google') {
                    this.alertStyle = "text-danger";
                    this.alertMessage = this.currentTexts.alert.OhNo_Message;
                    this.alertTitle = this.currentTexts.alert.OhNo;
                    this.alertToShow = true;
                }
            };

            img.src = `${test.url}${Date.now()}`;
        },

        checkAllConnectivity() {
            this.connectivityTests.forEach(test => {
                this.checkConnectivityHandler(test);
            });
        },
        showToast() {
            this.$nextTick(() => {
                const toastEl = this.$refs.toast;
                if (toastEl) {
                    const toast = new bootstrap.Toast(toastEl);
                    toast.show();
                } else {
                    console.error("Toast element not found");
                }
            });
        },
        async submitQuery() {
            if (this.isValidIP(this.inputIP)) {
                this.modalQueryError = '';
                this.modalQueryResult = null;
                await this.fetchIPForModal(this.inputIP);
            } else {
                this.modalQueryError = this.currentTexts.ipcheck.Error;
                this.modalQueryResult = null;
            }
        },
        isValidIP(ip) {
            const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?))$/;
            return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
        },
        async fetchIPForModal(ip) {
            try {
                const response = await fetch(`https://ipapi.co/${ip}/json/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.reason);
                }

                // 更新 modalQueryResult
                this.modalQueryResult = {
                    ip,
                    country_name: data.country_name || '',
                    country_code: data.country_code || '',
                    region: data.region || '',
                    city: data.city || '',
                    latitude: data.latitude || '',
                    longitude: data.longitude || '',
                    isp: data.org || '',
                    asn: data.asn || '',
                    asnlink: data.asn ? `https://radar.cloudflare.com/traffic/${data.asn}` : false,
                    mapUrl: data.latitude && data.longitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}&z=2&output=embed` : ''
                };
            } catch (error) {
                console.error('获取 IP 详情时出错:', error);
                this.modalQueryError = error.message;
            }
        },
        resetModalData() {
            this.inputIP = '';
            this.modalQueryResult = null;
            this.modalQueryError = '';
        },
        async checkSTUNServer(stun) {
            try {
                const servers = { iceServers: [{ urls: stun.url }] };
                const pc = new RTCPeerConnection(servers);
                let candidateReceived = false;

                pc.onicecandidate = event => {
                    if (event.candidate) {
                        candidateReceived = true;
                        const candidate = event.candidate.candidate;
                        const ipMatch = /(\b(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}\b)|([0-9]{1,3}(\.[0-9]{1,3}){3})/i.exec(candidate);
                        if (ipMatch) {
                            stun.ip = ipMatch[0];
                            pc.close();
                        }
                    }
                };

                pc.createDataChannel("");
                await pc.createOffer().then(offer => pc.setLocalDescription(offer));

                // 设置一个超时计时器
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (!candidateReceived) {
                            reject(new Error("连接 STUN 服务器超时"));
                        } else {
                            resolve();
                        }
                    }, 5000);
                });
            } catch (error) {
                console.error('STUN Server Test Error:', error);
                stun.ip = '测试超时或数据出错';
            }
        },

        checkAllWebRTC() {
            this.stunServers.forEach(stun => {
                this.checkSTUNServer(stun);
            });
        },

        generate32DigitString() {
            const unixTime = Date.now().toString(); // 13 位 Unix 时间戳
            const fixedString = "jason5ng32"; // 固定字符串
            const randomString = Math.random().toString(36).substring(2, 11); // 随机 9 位字符串

            return unixTime + fixedString + randomString; // 拼接字符串
        },

        generate14DigitString() {
            const fixedString = "jn32"; // 固定字符串
            const randomString = Math.random().toString(36).substring(2, 11); // 随机 9 位字符串

            return fixedString + randomString; // 拼接字符串
        },

        fetchLeakTestIpApiCom(index) {
            const urlString = this.generate32DigitString();
            const url = `https://${urlString}.edns.ip-api.com/json`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.dns && 'geo' in data.dns && 'ip' in data.dns) {
                        const geoSplit = data.dns.geo.split(' - ');
                        this.leakTest[index].geo = geoSplit[0];
                        this.leakTest[index].ip = data.dns.ip;
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching leak test data:', error);
                    this.leakTest[index].geo = this.currentTexts.dnsleaktest.StatusError;
                    this.leakTest[index].ip = this.currentTexts.dnsleaktest.StatusError;
                });
        },

        fetchLeakTestSfSharkCom(index, key) {
            const urlString = this.generate14DigitString();
            const url = `https://${urlString}.ipv4.surfsharkdns.com`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // 获取 data 对象中的指定键
                    const getKey = Object.keys(data)[key];
                    const keyEntry = data[getKey];

                    if (keyEntry && keyEntry.Country && keyEntry.IP) {
                        this.leakTest[index].geo = keyEntry.Country;
                        this.leakTest[index].ip = keyEntry.IP;
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching leak test data:', error);
                    this.leakTest[index].geo = this.currentTexts.dnsleaktest.StatusError;
                    this.leakTest[index].ip = this.currentTexts.dnsleaktest.StatusError;
                });
        },


        checkAllDNSLeakTest() {
            setTimeout(() => {
                this.fetchLeakTestIpApiCom(0);
            }, 100);

            setTimeout(() => {
                this.fetchLeakTestIpApiCom(1);
            }, 1000);

            setTimeout(() => {
                this.fetchLeakTestSfSharkCom(2, 0);
            }, 100);

            setTimeout(() => {
                this.fetchLeakTestSfSharkCom(3, 0);
            }, 1000);
        },
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            this.updateBodyClass();
        },
        updateBodyClass() {
            if (this.isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        },
        checkSystemDarkMode() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.isDarkMode = true;
                this.updateBodyClass();
            }
        },
        handleResize() {
            this.isMobile = window.innerWidth < 768; // 设置断点为 768px
        },
        toggleCollapse() {
            this.isCardsCollapsed = !this.isCardsCollapsed;
        },
        toggleLanguage() {
            this.currentLanguage = this.currentLanguage === 'en' ? 'cn' : 'en';
            this.updateTexts();
        },
        checkBrowserLanguage() {
            const browserLanguage = navigator.language || navigator.userLanguage;
            if (browserLanguage.includes('zh')) {
                this.currentLanguage = 'cn';
            } else {
                this.currentLanguage = 'en';
            }
        },
        updatePageTitle(lang) {
            document.title = this.currentTexts.page.title;
        },
        // 更新语言
        updateTexts() {
            this.currentTexts = this.currentLanguage === 'en' ? this.textEN : this.textCN;
        },
        // 语言补丁，弥补初始化时的翻译延迟
        langPatch() {
            this.connectivityTests.forEach(test => {
                test.status = this.currentTexts.connectivity.StatusWait;
            });
            this.stunServers.forEach(server => {
                server.ip = this.currentTexts.webrtc.StatusWait;
            });
            count = 1;
            this.leakTest.forEach(server => {
                server.name = this.currentTexts.dnsleaktest.Name + ' ' + count;
                count++;
                server.geo = this.currentTexts.dnsleaktest.StatusWait;
                server.ip = this.currentTexts.dnsleaktest.StatusWait;
            });
        }


    },

    created() {
        this.checkBrowserLanguage();
        this.updateTexts();
        this.langPatch();
        if (!this.bingMapAPIKEY) {
            this.isMapShown = false;
        } else if (localStorage.getItem('isMapShown')) {
            this.isMapShown = localStorage.getItem('isMapShown') === 'true';
        }
        this.isMobile = window.innerWidth < 768;
        this.isCardsCollapsed = this.isMobile;
        // this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        isMapShown(newVal) {
            localStorage.setItem('isMapShown', newVal);
        }
    },
    mounted() {
        this.updatePageTitle(this.currentLanguage);
        this.checkSystemDarkMode();
        this.checkAllIPs();
        setTimeout(() => {
            this.checkAllConnectivity();
        }, 2500);
        setTimeout(() => {
            this.showToast();
        }, 5500);
        setTimeout(() => {
            this.checkAllWebRTC();
        }, 4000);
        setTimeout(() => {
            this.checkAllDNSLeakTest();
        }, 2500);
        setTimeout(() => {
            this.checkAllConnectivity();
        }, 6000);
        const modalElement = document.getElementById('IPCheck');
        modalElement.addEventListener('hidden.bs.modal', this.resetModalData);
    }

});


// multpl wndw

class WindowManager 
{
	#windows;
	#count;
	#id;
	#winData;
	#winShapeChangeCallback;
	#winChangeCallback;
	
	constructor ()
	{
		let that = this;

		// event listener for when localStorage is changed from another window
		addEventListener("storage", (event) => 
		{
			if (event.key == "windows")
			{
				let newWindows = JSON.parse(event.newValue);
				let winChange = that.#didWindowsChange(that.#windows, newWindows);

				that.#windows = newWindows;

				if (winChange)
				{
					if (that.#winChangeCallback) that.#winChangeCallback();
				}
			}
		});

		// event listener for when current window is about to ble closed
		window.addEventListener('beforeunload', function (e) 
		{
			let index = that.getWindowIndexFromId(that.#id);

			//remove this window from the list and update local storage
			that.#windows.splice(index, 1);
			that.updateWindowsLocalStorage();
		});
	}

	// check if theres any changes to the window list
	#didWindowsChange (pWins, nWins)
	{
		if (pWins.length != nWins.length)
		{
			return true;
		}
		else
		{
			let c = false;

			for (let i = 0; i < pWins.length; i++)
			{
				if (pWins[i].id != nWins[i].id) c = true;
			}

			return c;
		}
	}

	// initiate current window (add metadata for custom data to store with each window instance)
	init (metaData)
	{
		this.#windows = JSON.parse(localStorage.getItem("windows")) || [];
		this.#count= localStorage.getItem("count") || 0;
		this.#count++;

		this.#id = this.#count;
		let shape = this.getWinShape();
		this.#winData = {id: this.#id, shape: shape, metaData: metaData};
		this.#windows.push(this.#winData);

		localStorage.setItem("count", this.#count);
		this.updateWindowsLocalStorage();
	}

	getWinShape ()
	{
		let shape = {x: window.screenLeft, y: window.screenTop, w: window.innerWidth, h: window.innerHeight};
		return shape;
	}

	getWindowIndexFromId (id)
	{
		let index = -1;

		for (let i = 0; i < this.#windows.length; i++)
		{
			if (this.#windows[i].id == id) index = i;
		}

		return index;
	}

	updateWindowsLocalStorage ()
	{
		localStorage.setItem("windows", JSON.stringify(this.#windows));
	}

	update ()
	{
		//console.log(step);
		let winShape = this.getWinShape();

		//console.log(winShape.x, winShape.y);

		if (winShape.x != this.#winData.shape.x ||
			winShape.y != this.#winData.shape.y ||
			winShape.w != this.#winData.shape.w ||
			winShape.h != this.#winData.shape.h)
		{
			
			this.#winData.shape = winShape;

			let index = this.getWindowIndexFromId(this.#id);
			this.#windows[index].shape = winShape;

			//console.log(windows);
			if (this.#winShapeChangeCallback) this.#winShapeChangeCallback();
			this.updateWindowsLocalStorage();
		}
	}

	setWinShapeChangeCallback (callback)
	{
		this.#winShapeChangeCallback = callback;
	}

	setWinChangeCallback (callback)
	{
		this.#winChangeCallback = callback;
	}

	getWindows ()
	{
		return this.#windows;
	}

	getThisWindowData ()
	{
		return this.#winData;
	}

	getThisWindowID ()
	{
		return this.#id;
	}
}

export default WindowManager;


import WindowManager from './WindowManager.js'


const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let cubes = [];
let sceneOffsetTarget = {x: 0, y: 0};
let sceneOffset = {x: 0, y: 0};

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

let internalTime = getTime();
let windowManager;
let initialized = false;

// get time in seconds since beginning of the day (so that all windows use the same time)
function getTime ()
{
	return (new Date().getTime() - today) / 1000.0;
}


if (new URLSearchParams(window.location.search).get("clear"))
{
	localStorage.clear();
}
else
{	
	// this code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
	document.addEventListener("visibilitychange", () => 
	{
		if (document.visibilityState != 'hidden' && !initialized)
		{
			init();
		}
	});

	window.onload = () => {
		if (document.visibilityState != 'hidden')
		{
			init();
		}
	};
	

	function init ()
	{
		initialized = true;

		// add a short timeout because window.offsetX reports wrong values before a short period 
		setTimeout(() => {
			setupScene();
			// createParticleSystem();
			setupWindowManager();
			resize();
			updateWindowShape(false);
			render();
			window.addEventListener('resize', resize);
		}, 500)	
	}
	

	function setupScene ()
	{
		camera = new t.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
		
		camera.position.z = 2.5;
		near = camera.position.z - .5;
		far = camera.position.z + 0.5;

		scene = new t.Scene();
		scene.background = new t.Color(0.0);
		scene.add( camera );

		var starGeometry = new THREE.Geometry();
		for (let i = 0; i < 5000; i++) {
			var star = new THREE.Vector3();
			star.x = Math.random() * 5000 - 2000;
			star.y = Math.random() * 5000 - 2000;
			star.z = Math.random() * 5000 - 2000;
			starGeometry.vertices.push(star);
			var color = new THREE.Color();
			if (Math.random() < 0.5) {
				color.setHSL(0.16, 0.5, Math.random() * 0.5 + 0.25);
			} else {
				color.setHSL(0.0, 0.0, Math.random() * 0.5 + 0.5);
			}
			starGeometry.colors.push(color);
		}
		
		var starMaterial = new THREE.PointsMaterial({
			size: 2,
			vertexColors: THREE.VertexColors
		});
		
		var starField = new THREE.Points(starGeometry, starMaterial);
		scene.add(starField);
	
		renderer = new t.WebGLRenderer({antialias: true, depthBuffer: true});
		renderer.setPixelRatio(pixR);
		
		world = new t.Object3D();
		scene.add(world);
	
		renderer.domElement.setAttribute("id", "scene");
		document.body.appendChild( renderer.domElement );

		// Lights
		var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		scene.add( light );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 0, 128, 128 );
		scene.add( directionalLight );
		
	}

	
	function setupWindowManager ()
	{
		windowManager = new WindowManager();
		windowManager.setWinShapeChangeCallback(updateWindowShape);
		windowManager.setWinChangeCallback(windowsUpdated);

		// here you can add your custom metadata to each windows instance
		let metaData = {foo: "bar"};

		// this will init the windowmanager and add this window to the centralised pool of windows
		windowManager.init(metaData);

		// call update windows initially (it will later be called by the win change callback)
		windowsUpdated();
	}

	
	function windowsUpdated ()
	{
		updateNumberOfCubes();
	}

	
	function updateNumberOfCubes ()
	{
		let wins = windowManager.getWindows();

		cubes.forEach((c) => {
			world.remove(c);
		})

		cubes = [];

		for (let i = 0; i < wins.length; i++)
		{
			let win = wins[i];

			let c;
			if (i == 0) {
				c = new t.Color('hsl(230, 80%, 75%)');
			} else if (i == 1) {
				c = new t.Color('hsl(350, 60%, 65%)');
			} else {
				let idBasedHueValue = (win.id % 10) / 10;
				let hue;
				if(idBasedHueValue < 0.5) {
					hue = 240 - (idBasedHueValue * 2 * 60);
				} else {
					hue = 360 - ((idBasedHueValue - 0.5) * 2 * 60);
				}
				c = new t.Color(`hsl(${hue}, 50%, 70%)`);
			}

			let s = 100 + i * 50;
			let radius = s / 2;

			let sphere = createComplexSphere(radius, c);
			sphere.position.x = win.shape.x + (win.shape.w * .5);
			sphere.position.y = win.shape.y + (win.shape.h * .5);
	
			world.add(sphere);
			cubes.push(sphere);

		}
	}

	
	function createComplexSphere(radius, color) {
		let innerSize = radius * 0.9; 
		let outerSize = radius;
		let innerColor = color;
		let outerColor = color;
	
		let complexSphere = new THREE.Group();
	
		let sphereWireframeInner = new THREE.Mesh(
			new THREE.IcosahedronGeometry(innerSize, 2),
			new THREE.MeshLambertMaterial({
				color: innerColor,
				wireframe: true,
				transparent: true,
				shininess: 0
			})
		);
		complexSphere.add(sphereWireframeInner);
	
		let sphereWireframeOuter = new THREE.Mesh(
			new THREE.IcosahedronGeometry(outerSize, 3),
			new THREE.MeshLambertMaterial({
				color: outerColor,
				wireframe: true,
				transparent: true,
				shininess: 0
			})
		);
		complexSphere.add(sphereWireframeOuter);
	

		let sphereGlassInner = new THREE.Mesh(
			new THREE.SphereGeometry(innerSize, 32, 32),
			new THREE.MeshPhongMaterial({
				color: innerColor,
				transparent: true,
				shininess: 25,
				opacity: 0.3
			})
		);
		complexSphere.add(sphereGlassInner);
	
		let sphereGlassOuter = new THREE.Mesh(
			new THREE.SphereGeometry(outerSize, 32, 32),
			new THREE.MeshPhongMaterial({
				color: outerColor,
				transparent: true,
				shininess: 25,
				opacity: 0.3
			})
		);
		complexSphere.add(sphereGlassOuter);

		let particlesOuter = createParticles(outerSize, outerColor);
		complexSphere.add(particlesOuter);
	
		let particlesInner = createParticles(innerSize, innerColor);
		complexSphere.add(particlesInner);
	
		return complexSphere;
	}
	
	function createParticles(size, color) {
		let geometry = new THREE.Geometry();
		for (let i = 0; i < 35000; i++) {
			let x = -1 + Math.random() * 2;
			let y = -1 + Math.random() * 2;
			let z = -1 + Math.random() * 2;
			let d = 1 / Math.sqrt(x * x + y * y + z * z);
			x *= d * size;
			y *= d * size;
			z *= d * size;
			geometry.vertices.push(new THREE.Vector3(x, y, z));
		}
		let material = new THREE.PointsMaterial({
			size: 0.1,
			color: color,
			transparent: true
		});
		return new THREE.Points(geometry, material);
	}
	

	function updateWindowShape (easing = true)
	{
		// storing the actual offset in a proxy that we update against in the render function
		sceneOffsetTarget = {x: -window.screenX, y: -window.screenY};
		if (!easing) sceneOffset = sceneOffsetTarget;
	}


	function render ()
	{
		let t = getTime();

		windowManager.update();

		// calculate the new position based on the delta between current offset and new offset times a falloff value (to create the nice smoothing effect)
		let falloff = .05;
		sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
		sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);

		// set the world position to the offset
		world.position.x = sceneOffset.x;
		world.position.y = sceneOffset.y;

		let wins = windowManager.getWindows();

		// loop through all our cubes and update their positions based on current window positions
		for (let i = 0; i < cubes.length; i++)
		{
			let complexSphere = cubes[i]; 
			let win = wins[i];
			let _t = t; 

			let posTarget = {x: win.shape.x + (win.shape.w * .5), y: win.shape.y + (win.shape.h * .5)}
			
			complexSphere.position.x = complexSphere.position.x + (posTarget.x - complexSphere.position.x) * falloff;
        	complexSphere.position.y = complexSphere.position.y + (posTarget.y - complexSphere.position.y) * falloff;

        
			complexSphere.rotation.x = _t * .5; 
			complexSphere.rotation.y = _t * .3; 
			updateComplexSphere(complexSphere, t);
		};

		// updateParticles();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	
	function updateComplexSphere(complexSphere, elapsedTime) {
		let sphereWireframeInner = complexSphere.children[0];
		let sphereWireframeOuter = complexSphere.children[1];
		let sphereGlassInner = complexSphere.children[2];
		let sphereGlassOuter = complexSphere.children[3];
		let particlesOuter = complexSphere.children[4];
		let particlesInner = complexSphere.children[5];
	
		sphereWireframeInner.rotation.x += 0.002;
		sphereWireframeInner.rotation.z += 0.002;
	  
		sphereWireframeOuter.rotation.x += 0.001;
		sphereWireframeOuter.rotation.z += 0.001;
	  
		sphereGlassInner.rotation.y += 0.005;
		sphereGlassInner.rotation.z += 0.005;
	
		sphereGlassOuter.rotation.y += 0.01;
		sphereGlassOuter.rotation.z += 0.01;
	
		particlesOuter.rotation.y += 0.0005;
		particlesInner.rotation.y -= 0.002;
	
		var innerShift = Math.abs(Math.cos(((elapsedTime + 2.5) / 20)));
		var outerShift = Math.abs(Math.cos(((elapsedTime + 5) / 10)));
	
		sphereWireframeOuter.material.color.setHSL(0.55, 1, outerShift);
		sphereGlassOuter.material.color.setHSL(0.55, 1, outerShift);
		particlesOuter.material.color.setHSL(0.55, 1, outerShift);
	
		sphereWireframeInner.material.color.setHSL(0.08, 1, innerShift);
		particlesInner.material.color.setHSL(0.08, 1, innerShift);
		sphereGlassInner.material.color.setHSL(0.08, 1, innerShift);
	
		sphereWireframeInner.material.opacity = Math.abs(Math.cos((elapsedTime + 0.5) / 0.9) * 0.5);
		sphereWireframeOuter.material.opacity = Math.abs(Math.cos(elapsedTime / 0.9) * 0.5);
	
	}
	
	
	// resize the renderer to fit the window size
	function resize ()
	{
		let width = window.innerWidth;
		let height = window.innerHeight
		
		camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	}
}

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const sessionParser = require('./routes/session_parser.js');
const utils = require('./services/utils.js');

require('./services/handlers.js');
require('./becca/becca_loader.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (!utils.isElectron()) {
    app.use(compression()); // HTTP compression
}

app.use(helmet({
    hidePoweredBy: false, // errors out in electron
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(express.text({limit: '500mb'}));
app.use(express.json({limit: '500mb'}));
app.use(express.raw({limit: '500mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/root')));
app.use(`/manifest.webmanifest`, express.static(path.join(__dirname, 'public/manifest.webmanifest')));
app.use(`/robots.txt`, express.static(path.join(__dirname, 'public/robots.txt')));
app.use(sessionParser);
app.use(favicon(`${__dirname}/../images/app-icons/win/icon.ico`));

require('./routes/assets.js').register(app);
require('./routes/routes.js').register(app);
require('./routes/custom.js').register(app);
require('./routes/error_handlers.js').register(app);

// triggers sync timer
require('./services/sync.js');

// triggers backup timer
require('./services/backup.js');

// trigger consistency checks timer
require('./services/consistency_checks.js');

require('./services/scheduler.js');

if (utils.isElectron()) {
    require('@electron/remote/main').initialize();
}

module.exports = app;

