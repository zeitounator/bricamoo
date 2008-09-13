/**
 * Bricamoo menu
 *
 * A class to handle a dynamic menu
 * @copyright Olivier Clavel (olivier DOT clavel AT gmail DOT com)
 */
var bmMenu = new Class({
	
	Implements: [Options],

	options: {
		duration: 500,
		delay: 100,
	},
	
	initialize: function(element, options) {
		this.setOptions(options);
		this.parseMenu(element);
	},

	parseMenu: function(element) {
		/* Get all second level menus, set absolute display and fade to 0 */	
		var secondLevel = element.getElements('dd');
		secondLevel.setStyle('position', 'absolute');
		secondLevel.setStyle('opacity', 0);

		/* Get all top level entries, set the cursor on mouseover */
		var firstLevel = element.getElements('dt');
		firstLevel.setStyle('cursor', 'pointer');

		secondLevel.each(function(menu) {
			var title = menu.getPrevious('dt');
			menu.set('tween', {
				duration: this.options.duration, 
				transition: Fx.Transitions.Quart.easeInOut
			});
 
			title.addEvent('mouseenter', function() {
				menu.tween('opacity', 0, 1).delay(this.options.delay);
			}),
			title.addEvent('mouseleave', function() {
				menu.tween('opacity', 1, 0).delay(this.options.delay);
			});
		}, this);
	}
});
