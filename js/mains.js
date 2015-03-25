jQuery(document).ready(function($){
	//check if background-images have been loaded and show list items
	$('.cd-single-projects').bgLoaded({
	  	afterLoaded : function(){
	   		showCaption($('.projects-containers li').eq(0));
	  	}
	});

	//open project
	$('.cd-single-projects').on('click', function(){
		var selectedProject = $(this),
			toggle = !selectedProject.hasClass('is-full-width');
		if(toggle) toggleProject($(this), $('.projects-containers'), toggle);
	});

	//close project
	$('.projects-containers .cd-close').on('click', function(){
		toggleProject($('.is-full-width'), $('.projects-containers'), false);
	});

	//scroll to project info
	$('.projects-containers .cd-scrolls').on('click', function(){
		$('.projects-containers').animate({'scrollTop':$(window).height()}, 500); 
	});

	//update title and .cd-scrolls opacity while scrolling
	$('.projects-containers').on('scroll', function(){
		window.requestAnimationFrame(changeOpacity);
	});

	function toggleProject(project, container, bool) {
		if(bool) {
			//expand project
			container.addClass('project-is-open');
			project.addClass('is-full-width').siblings('li').removeClass('is-loaded');
		} else {
			//check media query
			var mq = window.getComputedStyle(document.querySelector('.projects-containers'), '::before').getPropertyValue('content'),
				delay = ( mq == 'mobile' ) ? 100 : 0;

			container.removeClass('project-is-open');
			//fade out project
			project.animate({opacity: 0}, 800, function(){
				project.removeClass('is-loaded');
				$('.projects-containers').find('.cd-scrolls').attr('style', '');
				setTimeout(function(){
					project.attr('style', '').removeClass('is-full-width').find('.cd-titles').attr('style', '');
				}, delay);
				setTimeout(function(){
					showCaption($('.projects-containers li').eq(0));
				}, 300);
			});		
		}
	}

	function changeOpacity(){
		var newOpacity = 1- ($('.projects-containers').scrollTop())/300;
		$('.projects-containers .cd-scrolls').css('opacity', newOpacity);
		$('.is-full-width .cd-titles').css('opacity', newOpacity);
		//Bug fixed - Chrome background-attachment:fixed rendering issue
		$('.is-full-width').hide().show(0);
	}

	function showCaption(project) {
		if(project.length > 0 ) {
			setTimeout(function(){
				project.addClass('is-loaded');
				showCaption(project.next());
			}, 150);
		}
	}
});

 /*
 * BG Loaded
 * Copyright (c) 2014 Jonathan Catmull
 * Licensed under the MIT license.
 */
 (function($){
 	$.fn.bgLoaded = function(custom) {
	 	var self = this;

		// Default plugin settings
		var defaults = {
			afterLoaded : function(){
				this.addClass('bg-loaded');
			}
		};

		// Merge default and user settings
		var settings = $.extend({}, defaults, custom);

		// Loop through element
		self.each(function(){
			var $this = $(this),
				bgImgs = window.getComputedStyle($this.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
			$this.data('loaded-count',0);
			$.each( bgImgs, function(key, value){
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function() {
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count',$this.data('loaded-count')+1);
					if ($this.data('loaded-count') >= bgImgs.length) {
						settings.afterLoaded.call($this);
					}
				});
			});

		});
	};
})(jQuery);