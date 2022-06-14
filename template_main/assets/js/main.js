var SALA = SALA || {};

( function( $ ) {
    'use strict';

    var $body                    = $( 'body' ),
        $window                  = $( window ),
        ajax_url                 = theme_vars.ajax_url,
        header_sticky            = theme_vars.header_sticky,
        content_protected_enable = theme_vars.content_protected_enable,
        scroll_top_enable        = theme_vars.scroll_top_enable;

	function isInViewport(node) {
		var rect = node.getBoundingClientRect()
		return (
			(rect.height > 0 || rect.width > 0) &&
			rect.bottom >= 0 &&
			rect.right >= 0 &&
			rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

    SALA.element = {
        init: function() {
            SALA.element.rtl();
			SALA.element.cookie_notices();
            SALA.element.general();
			SALA.element.nice_select();
			SALA.element.blog_filter();
            SALA.element.retina_logo();
            SALA.element.swiper_carousel();
            SALA.element.scroll_to_top();
            SALA.element.main_menu();
            SALA.element.smart_menu();
            SALA.element.header_sticky();
            SALA.element.toggle_popup();
			SALA.element.grid_layout();
			SALA.element.validate_form();
			SALA.element.forget_password();
			SALA.element.widget_toggle();
			SALA.element.colormode();
			SALA.element.salaconvertsvg();
			SALA.element.motionfx();
			SALA.element.atropos();
			SALA.element.scroll_bar();

            if( content_protected_enable == 1 ) {
                SALA.element.content_protected();
            }
    	},

        windowLoad: function() {
            SALA.element.page_loading_effect();
            SALA.element.handler_animation();
            SALA.element.handler_entrance_queue_animation();

            // Smooth scroll to section if url has hash tag when page loaded.
            var hashTag = window.location.hash;
            if ( SALA.element.is_valid_smoothscroll_target( hashTag ) ) {
                SALA.element.smooth_scroll( hashTag );
            }
        },

        rtl: function() {
            $( window ).load( function() {
                if ( $( 'body' ).attr( 'dir' ) == 'rtl' ) {
                    $( '.elementor-section-stretched' ).each( function() {
                        var val = $( this ).css( 'left' );
                        $( this ).css( 'left', 'auto' );
                        $( this ).css( 'right', val );
                    } );
                }
            });
        },

        general: function() {

            $( '.block-search.search-icon' ).on( 'click', function( e ) {
                e.preventDefault();
                $( '.search-form-wrapper.canvas-search' ).addClass( 'on' );
            } );

            $( '.canvas-search' ).on( 'click', '.btn-close,.bg-overlay', function( e ) {
                e.preventDefault();
                $( this ).parents( '.canvas-search' ).removeClass( 'on' );
            } );

        },

		nice_select: function() {
            $( '.nice-select' ).niceSelect();
        },

		blog_filter: function() {
            $( '.sala-filter-form .form-group select' ).each( function() {
                $( this ).on( 'change', function() {
					var baseUrl 		= $( this ).parents( 'form' ).data( 'homeurl' ),
					 	cat_name 		= $( this ).find( 'option:selected' ).val(),
					 	category 		= $( this ).attr( 'name' ),
					 	current_url 	= $( this ).parents( 'form' ).data( 'url' ),
					 	new_url 		= '';

					if( cat_name == '-1' ){
						new_url = current_url;
					} else {
						new_url = baseUrl + '/' + category + '/' + cat_name;
					}

					window.location.href = new_url;
				});
            } );
        },

        retina_logo: function() {
            if ( window.matchMedia( 'only screen and (min--moz-device-pixel-ratio: 1.5)' ).matches
                || window.matchMedia( 'only screen and (-o-min-device-pixel-ratio: 3/2)' ).matches
                || window.matchMedia( 'only screen and (-webkit-min-device-pixel-ratio: 1.5)' ).matches
                || window.matchMedia( 'only screen and (min-device-pixel-ratio: 1.5)' ).matches ) {
                $( '.site-logo img' ).each( function() {
                    $( this ).addClass( 'logo-retina' );
                    $( this ).attr( 'src', $( this ).data( 'retina' ) );
                });
            }
        },

		cookie_notices: function() {
            if ( theme_vars.notice_cookie_enable == 1 && theme_vars.notice_cookie_confirm != 'yes' && theme_vars.notice_cookie_messages != '' ) {
                $.growl( {
                    location: 'br',
                    fixed: true,
                    duration: 3600000,
                    size: 'large',
                    title: '',
                    message: theme_vars.notice_cookie_messages
                } );

                $( '#sala-button-cookie-notice-ok' ).on( 'click', function() {
                    $( this ).parents( '.growl-message' ).first().siblings( '.growl-close' ).trigger( 'click' );

                    var _data = {
                        action: 'notice_cookie_confirm'
                    };

                    _data = $.param( _data );

                    $.ajax( {
                        url: theme_vars.ajax_url,
                        type: 'POST',
                        data: _data,
                        dataType: 'json',
                        success: function( results ) {

                        },
                        error: function( errorThrown ) {
                            console.log( errorThrown );
                        }
                    } );
                } );
            }
        },


        page_loading_effect: function() {
            setTimeout( function() {
                $body.addClass( 'loaded' );
            }, 200 );

            var $loader = $( '#page-preloader' );

            setTimeout( function() {
                $loader.remove();
            }, 2000 );
        },

        handler_animation: function() {
            var items = $( '.sala-grid' ).children( '.grid-item' );

            items.waypoint( function() {
                // Fix for different ver of waypoints plugin.
                // eslint-disable-next-line no-underscore-dangle
                var _self = this.element ? this.element : this;
                var $self = $( _self );
                $self.addClass( 'animate' );
            }, {
                offset: '90%',
                triggerOnce: true
            } );
        },

        handler_entrance_queue_animation: function() {
            var animateQueueDelay  = 200,
                queueResetDelay;
            $( '.sala-entrance-animation-queue' ).each( function() {
                var itemQueue  = [],
                    queueTimer,
                    queueDelay = $( this ).data( 'animation-delay' ) ? $( this ).data( 'animation-delay' ) : animateQueueDelay;

                $( this ).children( '.item' ).waypoint( function() {
                    // Fix for different ver of waypoints plugin.
                    // eslint-disable-next-line no-underscore-dangle
                    var _self = this.element ? this.element : $( this );

                    // eslint-disable-next-line no-unused-vars
                    queueResetDelay = setTimeout( function() {
                        queueDelay = animateQueueDelay;
                    }, animateQueueDelay );

                    itemQueue.push( _self );
                    SALA.element.process_item_queue( itemQueue, queueDelay, queueTimer );
                    queueDelay += animateQueueDelay;
                }, {
                    offset: '90%',
                    triggerOnce: true
                } );
            } );
        },

        process_item_queue: function( itemQueue, queueDelay, queueTimer, queueResetDelay ) {
            clearTimeout( queueResetDelay );
            queueTimer = window.setInterval( function() {
                if ( itemQueue !== undefined && itemQueue.length ) {
                    $( itemQueue.shift() ).addClass( 'animate' );
                    SALA.element.process_item_queue();
                } else {
                    window.clearInterval( queueTimer );
                }
            }, queueDelay );
        },

        swiper_carousel: function() {
			var product_thumb = '';
			var product_review = '';
            $( '.sala-swiper-slider' ).each( function() {
				var slider_name = $( this ).data( 'name' );
				if( $( this ).find( '.woocommerce-product-gallery__image' ).length ){
					$( this ).find( '.woocommerce-product-gallery__image' ).wrap( '<div class="swiper-slide"></div>' );
				}
                if ( $( this ).hasClass( 'sala-swiper-linked-yes' ) ) {
                    var mainSlider = $( this ).children( '.sala-main-swiper' ).SalaSwiper();
                    var thumbsSlider = $( this ).children( '.sala-thumbs-swiper' ).SalaSwiper();

                    mainSlider.controller.control = thumbsSlider;
                    thumbsSlider.controller.control = mainSlider;
                } else {
					if( slider_name && slider_name == 'sala-product-detail-thumb' ){
						product_thumb = $( this ).SalaSwiper();
					} else if( slider_name && slider_name == 'sala-product-detail-review' ){
						product_review = $( this ).SalaSwiper();
					} else {
						$( this ).SalaSwiper();
					}
                }
            } );
			if( product_thumb != '' && product_review != '' ){
				product_thumb.controller.control = product_review;
    			product_review.controller.control = product_thumb;
			}

			$('.thumbnail-inner .woocommerce-product-gallery__image').each( function() {
				var img = $( this ).find( 'img' ).data( 'src' );
				$( this ).zoom({url: img});
			});


        },

        scroll_to_top: function() {
            if ( scroll_top_enable != 1 ) {
                return;
            }
            var $scrollUp = $( '#page-scroll-up' );
            var lastScrollTop = 0;
            $window.on('scroll', function() {
                var st = $( this ).scrollTop();
                if ( st > lastScrollTop ) {
                    $scrollUp.removeClass( 'show' );
                } else {
                    if ( $window.scrollTop() > 200 ) {
                        $scrollUp.addClass( 'show' );
                    } else {
                        $scrollUp.removeClass( 'show' );
                    }
                }
                lastScrollTop = st;
            } );

            $scrollUp.on( 'click', function( evt ) {
                $( 'html, body' ).animate( { scrollTop: 0 }, 600 );
                evt.preventDefault();
            } );
        },

    	main_menu: function() {
			var translate = 0,
				index = 0;
    		$( '.canvas-menu .menu-item-has-children>a,.canvas-menu .page_item_has_children>a, .canvas-menu .children .elementor-heading-title' ).on( 'click', function( e ) {
                e.preventDefault();
                e.stopPropagation();
				index++;
				translate = translate - 100;
				var ul_parent = $( this ).closest( 'ul.menu' );
				ul_parent.css( 'transform', 'translate(' + translate + '%, 0px)' );

                var parent = $( this ).closest('li, .elementor-widget-wrap');
                parent.find( '>.sub-menu,>.children, > .sala-list-layout-block' ).fadeIn( 300 );
				parent.find( '> ul.children, .sala-list' ).prepend( '<a href="#" class="btn-canvas-menu btn-back-menu"><i class="fal fa-arrow-left"></i></a>' );

				var height  = parent.find( '>.sub-menu,>.children, > .sala-list-layout-block' ).outerHeight();
                if ( height > 0 ) {
                    $( 'ul.menu' ).css( 'min-height', height + 'px' );
                }
			} );

			$( '.canvas-menu' ).on( 'click', '.btn-back-menu', function( e ) {
				e.preventDefault();
				translate = translate + 100;
				index--;
				var ul_parent = $( this ).parents( 'ul.menu' );
				ul_parent.css( 'transform', 'translate('+ translate +'%, 0px)' );
				$( this ).closest( '.sub-menu,.children, .sala-list-layout-block, ul.children' ).fadeOut( 300 );
				$( this ).closest( '.sub-menu,.children, .sala-list-layout-block, ul.children' ).find( '.btn-back-menu' ).remove();
				$( this ).remove();

				$( 'ul.menu' ).css( 'min-height', 'auto' );
			} );

    		// Open Canvas Menu
            $( '.canvas-menu' ).on( 'click', '.icon-menu', function( e ) {
            	e.preventDefault();
                $( this ).parents( '.canvas-menu' ).toggleClass( 'active' );
            } );

            // Close Canvas Menu
            $( '.canvas-menu' ).on( 'click', '.btn-close,.bg-overlay', function( e ) {
            	e.preventDefault();
                $( this ).parents( '.canvas-menu' ).removeClass( 'active' );
            } );

            // Check Sub Menu
            $( '.site-menu .sub-menu' ).each( function() {
                var width  = $( this ).outerWidth();

                if ( width > 0 ) {
                    var offset = $( this ).offset();
                    var w_body = $( 'body' ).outerWidth();
                    var left = offset.left;
                    if ( w_body < left + width ) {
                        $( this ).css( 'left', '-100%' );
                    }
                }
            } );
    	},

        smart_menu: function() {
            var $menu = $('header.site-header').find( '.desktop-menu' ).find( 'ul' ).first();

            if ( ! $menu.hasClass( 'sm' ) ) {
                return;
            }

            $menu.smartmenus( {
                hideTimeout: 250,
                subMenusSubOffsetX: 0,
                subMenusSubOffsetY: - 17
            } );

            // Add animation for sub menu.
            $menu.on( {
                'show.smapi': function( e, menu ) {
                    $( menu ).removeClass( 'hide-animation' ).addClass( 'show-animation' );
                },
                'hide.smapi': function( e, menu ) {
                    $( menu ).removeClass( 'show-animation' ).addClass( 'hide-animation' );
                }
            } ).on( 'animationend webkitAnimationEnd oanimationend MSAnimationEnd', 'ul', function( e ) {
                $( this ).removeClass( 'show-animation hide-animation' );
                e.stopPropagation();
            } );
        },

        header_sticky: function() {
            if( header_sticky == 'yes' ) {
                return;
            }

            var offset = 0,
                height = 0;

            if ( $( 'header.site-header' ).length > 0 ) {
                offset = $( 'header.site-header' ).offset().top;
                height = $( 'header.site-header' ).outerHeight();
            }
            var has_wpadminbar = $( '#wpadminbar' ).length;
            var wpadminbar = 0;

            var lastScroll = 0;
            if ( has_wpadminbar > 0 ) {
                wpadminbar = $( '#wpadminbar' ).height();
                $( '.header-sticky' ).addClass( 'has-wpadminbar' );
            }

            $( window ).on('scroll', function() {
                var currentScroll = $( window ).scrollTop();
                if ( currentScroll > offset + wpadminbar + height + 100 ) {
                    $( '.header-sticky' ).addClass( 'scroll' );
                }else{
                    $( '.header-sticky' ).removeClass( 'scroll' );
                }
                if ( currentScroll > lastScroll ) {
                    $( '.header-sticky' ).removeClass( 'on' );
                } else {
                    if ( currentScroll < offset + wpadminbar + height + 100 ) {
                        $( '.header-sticky' ).removeClass( 'on' );
                    }else{
                        $( '.header-sticky' ).addClass( 'on' );
                    }
                }
                lastScroll = currentScroll;
            });
        },

        toggle_popup: function() {
            $( '.sala-popup' ).on( 'click', '.bg-overlay, .btn-close', function( e ) {
                e.preventDefault();
                $( 'html' ).css( 'overflow', 'auto' );
                $( 'html' ).css( 'margin-right', '0' );
                $( this ).closest( '.sala-popup' ).removeClass( 'open' );
				$( 'iframe' ).each(function(index) {
					$ (this ).attr('src', $( this ).attr('src'));
					return false;
				});
            });

            $( '.btn-sala-popup' ).on( 'click', function( e ) {
                e.preventDefault();
                var id = $( this ).attr( 'href' );
                $( 'html' ).css( 'overflow', 'hidden' );
                $( 'html' ).css( 'margin-right', '15px' );
                $( '.sala-popup' ).removeClass( 'open' );
                $( id ).addClass( 'open' );
            } );
        },

        content_protected: function() {
            var $contentProtectedAlert = $( '#sala-content-protected-box' );
            var delayTime = 3000;

            /**
             * Prevent right click.
             */
            $( document ).on( 'contextmenu', function() {
                $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                return false;
            } );

            $( window ).on( 'keydown', function( event ) {
                /**
                 * Prevent open chrome dev tools on Win OS.
                 */
                // Prevent F12.
                if ( event.keyCode == 123 ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }

                /**
                 * CTRL + SHIFT + I
                 * CTRL + SHIFT + J
                 * CTRL + SHIFT + C
                 */
                if ( event.ctrlKey && event.shiftKey && (
                    event.keyCode == 67 ||
                    event.keyCode == 73 ||
                    event.keyCode == 74
                ) ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }

                /**
                 * Prevent open chrome dev tools on Mac OS.
                 */

                /**
                 * COMMAND + OPTION + I
                 * COMMAND + OPTION + J
                 * COMMAND + OPTION + C
                 */
                if ( event.metaKey && event.altKey && (
                    event.keyCode == 67 ||
                    event.keyCode == 73 ||
                    event.keyCode == 74
                ) ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }

                // COMMAND + SHIFT + C
                if ( event.metaKey && event.shiftKey && event.keyCode == 67 ) {
                    $contentProtectedAlert.show().delay( delayTime ).fadeOut();
                    return false;
                }
            } );

            $('html').bind('cut copy paste', function (e) {
                e.preventDefault();
           });
        },

        get_smooth_scroll_offset: function() {
            if ( smoothScrollOffset ) {
                return smoothScrollOffset
            }

            var windowWidth = window.innerWidth,
                smoothScrollOffset = 0;


            // Add offset of admin bar when viewport min-width 600.
            if ( windowWidth > 600 ) {
                var adminBarHeight = $( '#wpadminbar' ).height();
                smoothScrollOffset += adminBarHeight;
            }

            if ( smoothScrollOffset > 0 ) {
                smoothScrollOffset = - smoothScrollOffset;
            }

            return smoothScrollOffset;
        },

        is_valid_smoothscroll_target: function( selector ) {
            if ( selector.match( /^([.#])(.+)/ ) ) {
                return true;
            }

            return false;
        },

        smooth_scroll: function(target) {
            var offset = SALA.element.get_smooth_scroll_offset();

            $.smoothScroll( {
                offset: 0,
                scrollTarget: $( target ),
                speed: 600,
                easing: 'linear'
            } );
        },

		grid_layout: function() {
            $( '.sala-grid-wrapper' ).SalaGridLayout();
            $( '.sala-grid-wrapper' ).SalaGridQuery();
        },

		validate_form: function() {
            $('#sala-login').validate({
                rules: {
                    email: {
                        required: true,
                    },
                    password: {
                        required: true,
                        minlength: 5,
                        maxlength: 30
                    }
                },
                submitHandler: function(form) {
                    $.ajax({
                        url: ajax_url,
                        type: 'POST',
                        cache: false,
                        dataType: 'json',
                        data: {
                            email: $('#ip_email').val(),
                            password: $('#ip_password').val(),
                            action: 'get_login_user',
                        },
                        beforeSend: function () {
                            $('.form-account p.msg').removeClass('text-error text-success text-warning');
                            $('.form-account p.msg').text(theme_vars.send_user_info);
                            $('#sala-login p.msg').show();
                            $('.form-account .loading-effect').fadeIn();
                        },
                        success: function(data) {
                            $('.form-account p.msg').text(data.messages);
                            if( data.success != true ) {
                                $('#sala-login p.msg').addClass(data.class);
                            }
                            $('.form-account .loading-effect').fadeOut();
							if( data.redirect != '' ){
								window.location.href = data.redirect;
							}
                        }
                    });
                }
            });
            $('#sala-register').validate({
                rules: {
                    reg_firstname: {
                        required: true,
                    },
                    reg_lastname: {
                        required: true,
                    },
                    reg_email: {
                        required: true,
                        email: true
                    },
                    reg_password: {
                        required: true,
                        minlength: 5,
                        maxlength: 20
                    },
                    accept_account: {
                        required: true,
                    }
                },
                submitHandler: function(form) {
                    $.ajax({
                        url: ajax_url,
                        type: 'POST',
                        cache: false,
                        dataType: 'json',
                        data: {
                            account_type: $('input[name="account_type"]:checked').val(),
                            firstname: $('#ip_reg_firstname').val(),
                            lastname: $('#ip_reg_lastname').val(),
                            email: $('#ip_reg_email').val(),
                            password: $('#ip_reg_password').val(),
                            action: 'get_register_user',
                        },
                        beforeSend: function () {
                            $('.form-account p.msg').removeClass('text-error text-success text-warning');
                            $('.form-account p.msg').text(theme_vars.send_user_info);
                            $('#sala-register p.msg').show();
                            $('.form-account .loading-effect').fadeIn();
                        },
                        success: function(data) {
                            $('.form-account p.msg').text(data.messages);
                            if( data.success != true ) {
                                $('#sala-register p.msg').addClass(data.class);
                            } else {
								if( data.redirect != '' ){
									window.location.href = data.redirect;
								}
							}
                            $('.form-account .loading-effect').fadeOut();
                        }
                    });
                }
            });
            jQuery.extend(jQuery.validator.messages, {
                required: "This field is required",
                remote: "Please fix this field",
                email: "A valid email address is required",
                url: "Please enter a valid URL",
                date: "Please enter a valid date",
                dateISO: "Please enter a valid date (ISO)",
                number: "Please enter a valid number.",
                digits: "Please enter only digits",
                creditcard: "Please enter a valid credit card number",
                equalTo: "Please enter the same value again",
                accept: "Please enter a value with a valid extension",
                maxlength: jQuery.validator.format("Please enter no more than {0} characters"),
                minlength: jQuery.validator.format("Please enter at least {0} characters"),
                rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long"),
                range: jQuery.validator.format("Please enter a value between {0} and {1}"),
                max: jQuery.validator.format("Please enter a value less than or equal to {0}"),
                min: jQuery.validator.format("Please enter a value greater than or equal to {0}")
            });
        },

		forget_password: function($this) {

            $('#sala_forgetpass').on('click',function (e) {
                e.preventDefault();
                var $form = $(this).parents('form');

                $.ajax({
                    type: 'post',
                    url: ajax_url,
                    dataType: 'json',
                    data: $form.serialize(),
                    beforeSend: function () {
                        $('.forgot-form p.msg').removeClass('text-error text-success text-warning');
                        $('.forgot-form p.msg').text(theme_vars.forget_password);
                        $('.forgot-form p.msg').show();
                        $('.forgot-form .loading-effect').fadeIn();

                    },
                    success: function(data) {
                        $('.forgot-form p.msg').text(data.message);
                        $('.forgot-form p.msg').addClass(data.class);
                        $('.forgot-form .loading-effect').fadeOut();
                    },
                });
            });

            $( '.generate-password' ).on( 'click', function(e) {
                e.preventDefault();
                var Password = {

                    _pattern : /[a-zA-Z0-9_\-\+\.\}\{\?\!\@\#\$\%\&\*\~]/,


                    _getRandomByte : function() {
                        // http://caniuse.com/#feat=getrandomvalues
                        if(window.crypto && window.crypto.getRandomValues)
                        {
                          var result = new Uint8Array(1);
                          window.crypto.getRandomValues(result);
                          return result[0];
                        }
                        else if(window.msCrypto && window.msCrypto.getRandomValues)
                        {
                          var result = new Uint8Array(1);
                          window.msCrypto.getRandomValues(result);
                          return result[0];
                        }
                        else
                        {
                          return Math.floor(Math.random() * 256);
                        }
                    },

                    generate : function(length) {
                        return Array.apply(null, {'length': length})
                          .map(function()
                          {
                            var result;
                            while(true)
                            {
                              result = String.fromCharCode(this._getRandomByte());
                              if(this._pattern.test(result))
                              {
                                return result;
                              }
                            }
                          }, this)
                          .join('');
                    }

                };
                $( '#new-password' ).val(Password.generate(24));
                $( '#new-password-error' ).fadeOut();
            });


            $('#reset-form').validate({
                rules: {
                    new_password: {
                        required: true,
                        minlength : 8,
                    },
                },
                submitHandler: function(form) {
                    var new_password = $(form).find( 'input[name="new_password"]' ).val();
                    var login = $(form).find( 'input[name="login"]' ).val();

                    $.ajax({
                        type: 'POST',
                        url: ajax_url,
                        data:  {
                            new_password: new_password,
                            login: login,
                            action: 'change_password_ajax',
                        },
                        beforeSend: function () {
                            $('.reset-form p.msg').removeClass('text-error text-success text-warning');
                            $('.reset-form p.msg').text(theme_vars.change_password);
                            $('.reset-form p.msg').show();
                            $('.reset-form .loading-effect').fadeIn();
                        },
                        success: function(data) {
                            var data = $.parseJSON(data);
                            $('.reset-form p.msg').text(data.message);
                            $('.reset-form p.msg').addClass(data.class);
                            $('.reset-form .loading-effect').fadeOut();

                            if( data.redirect ){
								window.location.href = data.redirect;
							}
                        },
                    });
                },
            });
        },

		widget_toggle: function($this) {

            $('.sala-pricing-plan .switch').on('click',function (e) {
                e.preventDefault();

				var _this = $( this ),
					item = $( this ).parents( '.sala-pricing-plan' ).find( '.pricing-plan-item' );

				_this.toggleClass( 'active' );

				item.each( function() {
					if( $( this ).hasClass( 'active' ) ){
						$( this ).removeClass( 'active' );
					} else {
						$( this ).addClass( 'active' );
					}
				});


            });

        },

		colormode: function($this) {

			$( '.sala-mode-switcher' ).on( 'click', function(e) {
				e.preventDefault();
				var _this 	= $( this ),
					body 	= $( 'body' );

				_this.toggleClass( 'sala-dark-scheme' );
				body.toggleClass( 'sala-dark-scheme' );

			});

		},

		salaconvertsvg: function() {
            // ==========================================
			// ! (function) => salasvg
			// ==========================================

			((window, { implementation }) => {
				const isLocal = window.location.protocol === "file:";
				const hasSvgSupport = implementation.hasFeature(
					"http://www.w3.org/TR/SVG11/feature#BasicStructure",
					"1.1"
				);

				function uniqueClasses(list) {
					list = list.split(" ");
					const hash = {};
					let i = list.length;
					const out = [];
					while (i--) {
						if (!hash.hasOwnProperty(list[i])) {
							hash[list[i]] = 1;
							out.unshift(list[i]);
						}
					}
					return out.join(" ");
				}

				const forEach =
					Array.prototype.forEach ||
					function (fn, scope) {
						if (this === void 0 || this === null || typeof fn !== "function") {
							throw new TypeError();
						}

						let i;
						const len = this.length >>> 0;
						for (i = 0; i < len; ++i) {
							if (i in this) {
								fn.call(scope, this[i], i, this);
							}
						}
					};

				const svgCache = {};
				let svgCount = 0;
				const svgCountEls = [];
				const requestQueue = [];
				const ranScripts = {};
				const svgClone = (sourceSvg) => sourceSvg.cloneNode(true);
				const queueRequest = (url, callback) => {
					requestQueue[url] = requestQueue[url] || [];
					requestQueue[url].push(callback);
				};
				const processRequestQueue = (url) => {
					for (let i = 0, len = requestQueue[url].length; i < len; i++) {
						((index) => {
							setTimeout(() => {
								requestQueue[url][index](svgClone(svgCache[url]));
							}, 0);
						})(i);
					}
				};
				const svgLoad = (url, callback) => {
					if (!window.SVGSVGElement) return;
					if (svgCache[url] !== undefined) {
						if (svgCache[url] instanceof SVGSVGElement) {
							callback(svgClone(svgCache[url]));
						} else {
							queueRequest(url, callback);
						}
					} else {
						if (!window.XMLHttpRequest) {
							callback("Browser does not support XMLHttpRequest");
							return false;
						}
						svgCache[url] = {};
						queueRequest(url, callback);
						const httpRequest = new XMLHttpRequest();
						httpRequest.onreadystatechange = () => {
							if (httpRequest.readyState === 4) {
								if (httpRequest.status === 404 || httpRequest.responseXML === null) {
									callback(`Unable to load SVG file: ${url}`);
									if (isLocal)
										callback(
											"Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver."
										);
									callback();
									return false;
								}
								if (httpRequest.status === 200 || (isLocal && httpRequest.status === 0)) {
									if (httpRequest.responseXML instanceof Document) {
										svgCache[url] = httpRequest.responseXML.documentElement;
									} else if (DOMParser && DOMParser instanceof Function) {
										let xmlDoc;
										try {
											const parser = new DOMParser();
											xmlDoc = parser.parseFromString(httpRequest.responseText, "text/xml");
										} catch (e) {
											xmlDoc = undefined;
										}
										if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length) {
											callback(`Unable to parse SVG file: ${url}`);
											return false;
										} else {
											svgCache[url] = xmlDoc.documentElement;
										}
									}
									processRequestQueue(url);
								} else {
									callback(
										`There was a problem injecting the SVG: ${httpRequest.status} ${httpRequest.statusText}`
									);
									return false;
								}
							}
						};
						httpRequest.open("GET", url);
						if (httpRequest.overrideMimeType) httpRequest.overrideMimeType("text/xml");
						httpRequest.send();
					}
				};
				const injectElement = (el, evalScripts, pngFallback, callback) => {
					const imgUrl = el.getAttribute("data-src") || el.getAttribute("src");
					if (!/\.svg/i.test(imgUrl)) {
						callback(`Attempted to inject a file with a non-svg extension: ${imgUrl}`);
						return;
					}
					if (!hasSvgSupport) {
						const perElementFallback =
							el.getAttribute("data-fallback") || el.getAttribute("data-png");
						if (perElementFallback) {
							el.setAttribute("src", perElementFallback);
							callback(null);
						} else if (pngFallback) {
							el.setAttribute(
								"src",
								`${pngFallback}/${imgUrl.split("/").pop().replace(".svg", ".png")}`
							);
							callback(null);
						} else {
							callback(
								"This browser does not support SVG and no PNG fallback was defined."
							);
						}
						return;
					}
					if (svgCountEls.includes(el)) {
						return;
					}

					svgCountEls.push(el);
					el.setAttribute("src", "");
					svgLoad(imgUrl, (svg) => {
						if (typeof svg === "undefined" || typeof svg === "string") {
							callback(svg);
							return false;
						}
						const imgId = el.getAttribute("id");
						if (imgId) {
							svg.setAttribute("id", imgId);
						}
						const imgTitle = el.getAttribute("title");
						if (imgTitle) {
							svg.setAttribute("title", imgTitle);
						}
						const classMerge = []
							.concat(
								svg.getAttribute("class") || [],
								"injected-svg",
								el.getAttribute("class") || []
							)
							.join(" ");
						svg.setAttribute("class", uniqueClasses(classMerge));
						const imgStyle = el.getAttribute("style");
						if (imgStyle) {
							svg.setAttribute("style", imgStyle);
						}
						const imgData = [].filter.call(
							el.attributes,
							({ name }) => /^data-\w[\w\-]*$/.test(name) || "onclick".match(name)
						);
						forEach.call(imgData, ({ name, value }) => {
							if (name && value) {
								svg.setAttribute(name, value);
							}
						});

						const iriElementsAndProperties = {
							clipPath: ["clip-path"],
							"color-profile": ["color-profile"],
							cursor: ["cursor"],
							filter: ["filter"],
							linearGradient: ["fill", "stroke"],
							marker: ["marker", "marker-start", "marker-mid", "marker-end"],
							mask: ["mask"],
							pattern: ["fill", "stroke"],
							radialGradient: ["fill", "stroke"]
						};
						let element;
						let elementDefs;
						let properties;
						let currentId;
						let newId;
						Object.keys(iriElementsAndProperties).forEach((key) => {
							element = key;
							properties = iriElementsAndProperties[key];
							elementDefs = svg.querySelectorAll(`defs ${element}[id]`);
							for (let i = 0, elementsLen = elementDefs.length; i < elementsLen; i++) {
								currentId = elementDefs[i].id;
								newId = `${currentId}-${svgCount}`;
								let referencingElements;
								forEach.call(properties, (property) => {
									referencingElements = svg.querySelectorAll(
										`[${property}*="${currentId}"]`
									);
									for (
										let j = 0, referencingElementLen = referencingElements.length;
										j < referencingElementLen;
										j++
									) {
										referencingElements[j].setAttribute(property, `url(#${newId})`);
									}
								});
								elementDefs[i].id = newId;
							}
						});
						svg.removeAttribute("xmlns:a");
						const scripts = svg.querySelectorAll("script");
						const scriptsToEval = [];
						let script;
						let scriptType;
						for (let k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
							scriptType = scripts[k].getAttribute("type");
							if (
								!scriptType ||
								scriptType === "application/ecmascript" ||
								scriptType === "application/javascript"
							) {
								script = scripts[k].innerText || scripts[k].textContent;
								scriptsToEval.push(script);
								svg.removeChild(scripts[k]);
							}
						}
						if (
							scriptsToEval.length > 0 &&
							(evalScripts === "always" ||
								(evalScripts === "once" && !ranScripts[imgUrl]))
						) {
							for (
								let l = 0, scriptsToEvalLen = scriptsToEval.length;
								l < scriptsToEvalLen;
								l++
							) {
								new Function(scriptsToEval[l])(window);
							}
							ranScripts[imgUrl] = true;
						}
						const styleTags = svg.querySelectorAll("style");
						forEach.call(styleTags, (styleTag) => {
							styleTag.textContent += "";
						});
						el.parentNode.replaceChild(svg, el);
						delete svgCountEls[svgCountEls.indexOf(el)];
						el = null;
						svgCount++;
						callback(svg);
					});
				};

				const salasvg = (elements, options = {}, done) => {
					const evalScripts = options.evalScripts || "always";
					const pngFallback = options.pngFallback || false;
					const eachCallback = options.each;
					if (elements && elements.length !== undefined) {
						let elementsLoaded = 0;
						forEach.call(elements, (element) => {
							injectElement(element, evalScripts, pngFallback, (svg) => {
								if (eachCallback && typeof eachCallback === "function") eachCallback(svg);
								if (done && elements.length === ++elementsLoaded) done(elementsLoaded);
							});
						});
					} else {
						if (elements) {
							injectElement(elements, evalScripts, pngFallback, (svg) => {
								if (eachCallback && typeof eachCallback === "function") eachCallback(svg);
								if (done) done(1);
								elements = null;
							});
						} else {
							if (done) done(0);
						}
					}
				};
				if (typeof module === "object" && typeof module.exports === "object") {
					module.exports = exports = salasvg;
				} else if (typeof define === "function" && define.amd) {
					define(() => salasvg);
				} else if (typeof window === "object") {
					window.salasvg = salasvg;
				}
			})(window, document);

			// ==========================================
			// ! (function) => document ready
			// ==========================================

			const ready = (callback) => {
				if (document.readyState !== "loading") {
					callback();
				} else {
					document.addEventListener("DOMContentLoaded", callback);
				}
			};

			// ==========================================
			// ! (function) => initialize
			// ==========================================

			ready(() => {
				const el = document.querySelectorAll(".salasvg img");
				salasvg(el);
			});
        },

		motionfx: function($this) {

			$( '.elementor-element' ).each( function() {
                var _this = $( this );
				var data = $( this ).data( 'settings' );
                var array = [];
                $.map(data, function(value, index){
                    return array[index] = value;
                });
                if( array['motion_fx_translateY_effect'] ){
                    _this.addClass( 'sala-parallax' );
					_this.attr( 'data-direction', array['motion_fx_translateY_direction'] );
					var speed = [];
					$.map(array['motion_fx_translateY_speed'], function(value, index){
						return speed[index] = value;
					});
					_this.attr( 'data-size', speed['size'] );
                }
				if( array['motion_fx_translateX_effect'] ){
                    _this.addClass( 'sala-parallax' );
					_this.attr( 'data-direction', array['motion_fx_translateX_direction'] );
					var speed = [];
					$.map(array['motion_fx_translateX_speed'], function(value, index){
						return speed[index] = value;
					});
					_this.attr( 'data-size', speed['size'] );
                }
				if( array['motion_fx_opacity_effect'] ){
                    _this.addClass( 'sala-parallax' );
					_this.attr( 'data-direction', array['motion_fx_opacity_direction'] );
					var speed = [];
					$.map(array['motion_fx_opacity_level'], function(value, index){
						return speed[index] = value;
					});
					_this.attr( 'data-size', speed['size'] );
					_this.attr( 'data-height', $( this ).outerHeight() );
                }
				if( array['motion_fx_mouseTrack_effect'] ){
                    _this.addClass( 'sala-mousetrack' );
					_this.attr( 'data-direction', array['motion_fx_mouseTrack_direction'] );
					var speed = [];
					$.map(array['motion_fx_mouseTrack_speed'], function(value, index){
						return speed[index] = value;
					});
					_this.attr( 'data-type', 'mousetrack' );
					_this.attr( 'data-size', speed['size'] );
                }
				if( array['motion_fx_tilt_effect'] ){
                    _this.addClass( 'sala-mousetrack' );
					_this.attr( 'data-direction', array['motion_fx_tilt_direction'] );
					var speed = [];
					$.map(array['motion_fx_tilt_speed'], function(value, index){
						return speed[index] = value;
					});
					_this.attr( 'data-type', 'tilt' );
					_this.attr( 'data-size', speed['size'] );
                }
			});

		},

		atropos: function($this) {
			$('.atropos') .each( function() {
				var shadow 			= $( this ).data( 'shadow' );
				var highlight 		= $( this ).data( 'highlight' );
				var duration 		= $( this ).data( 'duration' );
				var shadow_scale 	= $( this ).data( 'shadowscale' );
				window.atropos 	= new Atropos({
					el: this,
					shadow: shadow,
					highlight: highlight,
					duration: duration,
					shadowScale: shadow_scale,
				});
			});
		},

		scroll_bar: function($this) {
			$('.scroll-bar-wrap').each( function() {
				var height 	= $( 'body' ).outerHeight();
				var current = $( window ).scrollTop();
				var top = (current / height) * 100;
				$( this ).find( '.scroll-bar-current' ).css( 'top', top + '%' );
			});
		},
    }

    SALA.woocommerce = {
        init: function() {
            SALA.woocommerce.quantity();
        },

        quantity: function() {
            $( 'body' ).on( 'click', '.entry-quantity .plus', function( e ) {
                var input = $( this ).parents( '.entry-quantity' ).find( '.input-text.qty' );
                // eslint-disable-next-line radix
                var val = parseInt( input.val() ) + 1;
                input.attr( 'value',val );
                $( '.button[name="update_cart"]' ).prop( 'disabled', false );
            } );
            $( 'body' ).on( 'click', '.entry-quantity .minus', function( e ) {
                var input = $( this ).parents( '.entry-quantity' ).find( '.input-text.qty' );
                // eslint-disable-next-line radix
                var val = parseInt( input.val() ) - 1;
                if ( input.val() > 0 ) { input.attr( 'value',val ); }
                $( '.button[name="update_cart"]' ).prop( 'disabled', false );
            } );
        },
    }

    SALA.onReady = {
        init: function() {
            SALA.element.init();
            SALA.woocommerce.init();
        }
    };

    SALA.onLoad = {
        init: function() {
            SALA.element.windowLoad();
        }
    };

    SALA.onScroll = {
        init: function() {
            var scrolled = $(window).scrollTop()
			$('.sala-parallax').each(function(index, element) {
				var initY = $(this).offset().top
				var height = $(this).height()
				var endY  = initY + $(this).height()
				var direction = $(this).data( 'direction' );
				var size = $(this).data( 'size' );
				var targetHeight = $(this).data( 'height' );
				var targetHeightTop = $(this).offset().top;

				// Check if the element is in the viewport.
				var visible = isInViewport(this)
				if(visible && $( window ).width() > 767) {
					var diff = scrolled - initY
					var ratio = Math.round((diff / height) * 100)
					if( direction == 'up' ){
						$(this).find( '> .elementor-widget-container' ).css('transform','translateY(' + parseInt(-(ratio * size)) + 'px)')
					} else if( direction == 'down' ){
						$(this).find( '> .elementor-widget-container' ).css('transform','translateY(' + parseInt((ratio * size)) + 'px)')
					} else if( direction == 'left' ){
						$(this).find( '> .elementor-widget-container' ).css('transform','translateX(' + parseInt(-(ratio * size)) + 'px)')
					} else if( direction == 'right' ){
						$(this).find( '> .elementor-widget-container' ).css('transform','translateX(' + parseInt((ratio * size)) + 'px)')
					} else if( direction == 'out-in' ){
						if( window.scrollY > targetHeightTop ){
							var scrollPercent = (targetHeight - (window.scrollY - targetHeightTop)) / targetHeight;
							if(scrollPercent >= 0){
								$(this).css('opacity', scrollPercent);
							}
						}
					}
				}
			});

			$( '.elementor-element' ).each( function() {
				if( $( this ).hasClass( 'elementor-invisible' ) ){
					var _this = $( this ),
						settings = _this.data( 'settings' ),
						animation = settings['_animation'] ? settings['_animation'] : settings['animation'],
						animationDelay = 400;

					if( settings['_animation_delay'] ){
						animationDelay = settings['_animation_delay'];
					} else if( settings['animation_delay'] ){
						animationDelay = settings['animation_delay'];
					}

					var visible = isInViewport(this)
					if(visible) {
						setTimeout(function () {
							_this.removeClass('elementor-invisible').addClass('animated ' + animation);
						}, animationDelay);
					}
				}
			});
			SALA.element.scroll_bar();
        }
    };

    SALA.onResize = {
        init: function() {
            SALA.element.salaconvertsvg();
        }
    };

	SALA.onMouseMove = {
        init: function(e) {
            var w = $(window).width();
			var h = $(window).height();

			if( $( window ).width() > 767 ) {

				$(".sala-mousetrack").each(function(i, el) {
					var offset = parseInt($(el).data('size'));
					var direction = $(this).data( 'direction' );
					var type = $(this).data( 'type' );
					$(el).removeClass( 'sala-tilt' );

					var offsetX = 0.5 - e.pageX / w;
					var offsetY = 0.5 - (e.pageY - $(window).scrollTop()) / h;

					if( type == 'mousetrack' ){

						if( direction == 'direct' ){
							var offsetX = e.pageX / w;
							var offsetY = (e.pageY - $(window).scrollTop()) / h;
						}

						var translate = "translate3d(" + Math.round(offsetX * offset) + "px," + Math.round(offsetY * offset) + "px, 0px)";
						$(el).css({
							'-webkit-transform': translate,
							'transform': translate,
							'moz-transform': translate
						});

					} else if( type == 'tilt' ){

						if( direction == 'opposite' ){
							var tiltX = Math.round(offsetY * offset);
							var tiltY = Math.round(offsetX * offset);
						} else if( direction == 'direct' ){
							var tiltX = - Math.round(offsetY * offset);
							var tiltY = - Math.round(offsetX * offset);
						}
						var translate = "rotateX(var(--rotateX))rotateY(var(--rotateY))";
						$(el).addClass( 'sala-tilt' );
						$(el).find( '> .elementor-widget-container' ).css({
							'--rotateX': tiltX + 'deg',
							'--rotateY': tiltY + 'deg',
							'-webkit-transform': translate,
							'transform': translate,
							'moz-transform': translate
						});

					}
				});

			}
        }
    };

    $( document ).on('ready', SALA.onReady.init );
    $( window ).on('scroll', SALA.onScroll.init );
    $( window ).on('resize', SALA.onResize.init );
    $( window ).on('load', SALA.onLoad.init );
	$( window ).on('mousemove', SALA.onMouseMove.init );

} )( jQuery );
