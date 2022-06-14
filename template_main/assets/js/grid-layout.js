(
	function( $ ) {
		'use strict';

		$.fn.SalaGridLayout = function() {
			var $el, $grid, resizeTimer;

			/**
			 * Calculate size for grid items
			 */
			function calculateMasonrySize( $isotopeOptions ) {
				var windowWidth = window.innerWidth,
				    $gridWidth  = $grid[ 0 ].getBoundingClientRect().width,
				    $column     = 1,
				    $gutter     = 0,
				    $row_gap    = 0,
				    settings    = $grid.data( 'grid' ),
				    lgGutter    = settings.gutter ? settings.gutter : 30,
				    mdGutter    = settings.gutterTablet ? settings.gutterTablet : lgGutter,
				    smGutter    = settings.gutterMobile ? settings.gutterMobile : mdGutter,
					lgRowGap    = settings.RowGap ? settings.RowGap : 60,
				    mdRowGap    = settings.RowGapTablet ? settings.RowGapTablet : lgRowGap,
				    smRowGap    = settings.RowGapMobile ? settings.RowGapMobile : mdRowGap,
				    lgColumns   = settings.columns ? settings.columns : 1,
				    mdColumns   = settings.columnsTablet ? settings.columnsTablet : lgColumns,
				    smColumns   = settings.columnsMobile ? settings.columnsMobile : mdColumns;

				var tabletBreakPoint = 1200;
				var mobileBreakPoint = 720;

				if ( typeof elementorFrontendConfig !== 'undefined' ) {
					tabletBreakPoint = elementorFrontendConfig.breakpoints.lg;
					mobileBreakPoint = elementorFrontendConfig.breakpoints.md;
				}

				if ( windowWidth >= tabletBreakPoint ) {
					$column  = lgColumns;
					$gutter  = lgGutter;
					$row_gap = lgRowGap;
				} else if ( windowWidth >= mobileBreakPoint ) {
					$column  = mdColumns;
					$gutter  = mdGutter;
					$row_gap = mdRowGap;
				} else {
					$column  = smColumns;
					$gutter  = smGutter;
					$row_gap = smRowGap;
				}

				var totalGutterPerRow = (
					$column - 1
				) * $gutter;

				var columnWidth = (
					$gridWidth - totalGutterPerRow
				) / $column;

				columnWidth = Math.floor( columnWidth );

				var columnWidth2 = columnWidth;
				if ( $column > 1 ) {
					columnWidth2 = columnWidth * 2 + $gutter;
				}

				if( settings.type != 'metro' ){
					$grid.children( '.grid-sizer' ).css( {
						'width': columnWidth + 'px'
					} );

					$grid.children( '.grid-item' ).each( function( index ) {
						var gridItem = $( this );

						if ( gridItem.data( 'width' ) === 2 ) {
							gridItem.css( {
								'width': columnWidth2 + 'px'
							} );
						} else {
							gridItem.css( {
								'width': columnWidth + 'px'
							} );
						}

						if ( 'masonry' !== settings.type ) {
							gridItem.css( {
								'marginBottom': $row_gap + 'px'
							} );
						}
					} );

				}

				if ($(window).width() > 767){

					$( '.sala-portfolio-mosaic .type-portfolio:nth-child(4n+2)' ).each( function() {

						var _this 		= $( this ),
							cur_height 	= 0,
							height 		= 0,
							marginTop 	= 0;

						cur_height = _this.height();
						height = _this.next().height();

						if( height > cur_height ){
							marginTop = (height - cur_height) / 2;
							_this.css( 'margin-top', marginTop + 'px' );
						} else if( cur_height > height ){
							marginTop = (cur_height - height) / 2;
							_this.next().css( 'margin-top', marginTop + 'px' );
						}
					});

					$( '.sala-portfolio-mosaic .type-portfolio:nth-child(4n+1)' ).each( function() {

						var _this 		= $( this ),
							cur_height 	= 0,
							height 		= 0,
							marginTop 	= 0;

						cur_height = _this.height();
						height = _this.prev().height();

						if( height > cur_height ){
							marginTop = (height - cur_height) / 2;
							_this.css( 'margin-top', marginTop + 'px' );
						} else if( cur_height > height ){
							marginTop = (cur_height - height) / 2;
							_this.prev().css( 'margin-top', marginTop + 'px' );
						}
					});

				}

				if ( $isotopeOptions ) {
					$isotopeOptions.packery.gutter = $gutter;
					$isotopeOptions.fitRows.gutter = $gutter;
					$grid.isotope( $isotopeOptions );
				}

				$grid.isotope( 'layout' );
			}

			function handlerEntranceAnimation() {
				// Used find() for flex layout.
				var items = $grid.find( '.grid-item' );

				items.waypoint( function() {
					// Fix for different ver of waypoints plugin.
					var _self = this.element ? this.element : this;
					var $self = $( _self );
					$self.addClass( 'animate' );
				}, {
					offset: '90%',
					triggerOnce: true
				} );
			}

			return this.each( function() {
				$el 			= $( this );
				$grid 			= $el.find( '.sala-grid' );

				var settings = $grid.data( 'grid' );
				var gridData;

				if ( $grid.length > 0 && settings && typeof settings.type !== 'undefined' ) {
					var $isotopeOptions = {
						itemSelector: '.grid-item',
						percentPosition: true,
						transitionDuration: 0,
						packery: {
							columnWidth: '.grid-sizer',
						},
						fitRows: {
							gutter: 30
						}
					};

					if ( 'masonry' === settings.type ) {
						$isotopeOptions.layoutMode = 'packery';
					} else {
						$isotopeOptions.layoutMode = 'fitRows';
					}

					gridData = $grid.imagesLoaded( function() {
						calculateMasonrySize( $isotopeOptions );
						if ( 'grid' === settings.type ) {
							$grid.isotope( 'layout' );
						}
						$grid.addClass( 'loaded' );
					} );

					gridData.one( 'arrangeComplete', function() {
						handlerEntranceAnimation();
					} );

					$( window ).on('resize', function() {
						calculateMasonrySize( $isotopeOptions );

						// Sometimes layout can be overlap. then re-cal layout one time.
						clearTimeout( resizeTimer );
						resizeTimer = setTimeout( function() {
							// Run code here, resizing has "stopped"
							calculateMasonrySize( $isotopeOptions );
						}, 500 ); // DO NOT decrease the time. Sometime, It'll make layout overlay on resize.
					} );
				} else {
					handlerEntranceAnimation();
				}

				$el.on( 'SalaQueryEnd', function( event, el, $items, $pagination ) {
					el.find( '.grid-item' ).removeClass('sala-skeleton-loading');
					var $pagination_type = el.data('pagination');
					if( $pagination_type == 'navigation' && el.length > 0 ) {
						var $grid_postision = parseInt(el.offset().top);
						$( 'html, body' ).animate( { scrollTop: $grid_postision - 100 }, 1000 );
					}

					if ( $grid.length > 0 && settings && typeof settings.type !== 'undefined' ) {
						el.find('.sala-pagination').html($pagination);
						var height = $grid.height();
						$grid.isotope()
							.css('height', height)
						    .append( $items )
						    .isotope( 'reloadItems', $items )
						    .imagesLoaded()
						    .always( function() {
							    $items.addClass( 'animate' );
							    calculateMasonrySize( $isotopeOptions );
							    if ( 'grid' === settings.type ) {
								    $grid.isotope( 'layout' );
							    }
						    } );
					} else {
						$grid.append( $items ).imagesLoaded().always( function() {
							$items.addClass( 'animate' );
						} );
					}
				} );
			} );
		};
	}( jQuery )
);
