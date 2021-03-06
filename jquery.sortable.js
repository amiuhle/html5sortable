/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 *
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function($) {
var dragging, placeholders = $();
$.fn.sortable = function(options) {
	var items, method = String(options);
	options = $.extend({
		connectWith: false
	}, options);
	return this.each(function() {
		if (/^enable|disable|destroy$/.test(method)) {
			items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
			if (method == 'destroy') {
				items.add(this).removeData('connectWith items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			return;
		}
		var isHandle, index, placeholder;
		if(options.method === 'append') {
			items = dragging = $(this);
			index = -1;
			placeholder = $('<' + (/^li$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
			// console.log(placeholder);
		} else {
			items = $(this).children(options.items);
			placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
			items.find(options.handle).mousedown(function() {
				isHandle = true;
			}).mouseup(function() {
				isHandle = false;
			});
			$(this).data('items', options.items);
			placeholders = placeholders.add(placeholder);
		}
		if (options.connectWith) {
			$(options.connectWith).add(this).data('connectWith', options.connectWith);
		}
		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
			if (options.handle && !isHandle) {
				return false;
			}
			isHandle = false;
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			index = (dragging = $(this)).addClass('sortable-dragging').index();
		}).on('dragend.h5s', function() {
			if (!dragging) {
				return;
			}
			dragging.removeClass('sortable-dragging').show();
			placeholders.detach();
			if (index != dragging.index()) {
				dragging.parent().trigger('sortupdate', {item: dragging});
			}
			dragging = null;
		}).not('a[href], img').on('selectstart.h5s', function() {
			if(this.dragDrop) this.dragDrop();
			return false;
		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
			// console.log('dragover', this.id);
			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			if (e.type == 'drop') {
				e.stopPropagation();
				placeholders.filter(':visible').after(dragging);
				dragging.trigger('dragend.h5s');
				return false;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				if (options.forcePlaceholderSize) {
					placeholder.height(dragging.outerHeight());
				}
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
				placeholders.detach();
				$(this).append(placeholder);
			}
			return false;
		});
	});
};

// $.fn.draggable = function(options) {
// 	var items, method = String(options);
// 	options = $.extend({
// 		connectWith: false
// 	}, options);
// 	return this.each(function() {
// 		if (/^enable|disable|destroy$/.test(method)) {
// 			items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
// 			if (method == 'destroy') {
// 				items.add(this).removeData('connectWith items')
// 					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
// 			}
// 			return;
// 		}
// 		var isHandle, index;
// 		items = $(this).children(options.items);
// 		var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
// 		items.find(options.handle).mousedown(function() {
// 			isHandle = true;
// 		}).mouseup(function() {
// 			isHandle = false;
// 		});
// 		$(this).data('items', options.items);
// 		placeholders = placeholders.add(placeholder);
// 		if (options.connectWith) {
// 			$(options.connectWith).add(this).data('connectWith', options.connectWith);
// 		}
// 		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
// 			if (options.handle && !isHandle) {
// 				return false;
// 			}
// 			isHandle = false;
// 			var dt = e.originalEvent.dataTransfer;
// 			dt.effectAllowed = 'move';
// 			dt.setData('Text', 'dummy');
// 			var $helper = null;
// 			if(options.helper) {
// 				var helper = options.helper.apply(this, e);
// 				dt.setDragImage(helper, event.offsetX, event.offsetY);
// 				$helper = $(helper).on('dragover.h5s, dragenter.h5s', function(e) {
// 					$helper.hide();
// 				});
// 				$('.sortable-placeholder').attr('class', "sortable-placeholder #{$helper.attr('class')}");
// 				$(this).after($helper);
// 			}
// 			index = (dragging = $helper || $(this)).addClass('sortable-dragging').index();
// 			console.log(dragging);
// 		}).on('dragend.h5s', function() {
// 			if (!dragging) {
// 				return;
// 			}
// 			dragging.removeClass('sortable-dragging').show();
// 			placeholders.detach();
// 			if (index != dragging.index()) {
// 				dragging.parent().trigger('sortupdate', {item: dragging});
// 			}
// 			dragging = null;
// 		}).not('a[href], img').on('selectstart.h5s', function() {
// 			if(this.dragDrop) this.dragDrop();
// 			return false;
// 		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
// 			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
// 				return true;
// 			}
// 			if (e.type == 'drop') {
// 				e.stopPropagation();
// 				placeholders.filter(':visible').after(dragging);
// 				dragging.trigger('dragend.h5s');
// 				return false;
// 			}
// 			e.preventDefault();
// 			e.originalEvent.dataTransfer.dropEffect = 'move';
// 			if (items.is(this)) {
// 				if (options.forcePlaceholderSize) {
// 					placeholder.height(dragging.outerHeight());
// 				}
// 				dragging.hide();
// 				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
// 				placeholders.not(placeholder).detach();
// 			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
// 				placeholders.detach();
// 				$(this).append(placeholder);
// 			}
// 			return false;
// 		});
// 	});
// };
})(jQuery);