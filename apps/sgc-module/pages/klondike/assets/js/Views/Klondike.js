Package('SgcModule.Views', {
	Klondike : new Class({
		Extends : Sapphire.View,

		initialize : function(root)
		{
			this.parent();
			this.root = root;

			this.root.find('#stock').click(this.swallowEventAndFire.bind(this, 'resetStock'));
			this.root.find('#new-game').click(this.swallowEventAndFire.bind(this, 'newGame'));
		},

		newGame : function()
		{
			this.root.find('#game-message').html('');
		},

		gameMessage : function(message)
		{
			console.log('gameOver');
			this.root.find('#game-message').html(message);
		},

		drawWaste : function(waste, visible)
		{
			var cards = waste.slice(waste.length - visible, visible);
			var container = this.root.find('#waste');
			container.empty();
			this.wasteSelectors = [];

			waste.each(function(card, idx)
			{
				var selector = $('<div class="waste-card card card-' +  card.card + '">');
				container.append(selector);

				this.wasteSelectors.push(selector);

				if (idx == visible - 1)
					selector.mousedown(this.onWasteMouseDown.bind(this, card, idx));
			}, this);

		},

		drawFoundation : function(foundation)
		{
			var container = this.root.find('#foundations');
			container.empty();

			foundation.each(function(card, idx)
			{
				var selector = null;
				if (card == null)
				{
					selector = $('<div class="foundation">');
					selector.mouseup(this.onEmptyFoundationMouseUp.bind(this, idx));
				}
				else
				{
					selector = $('<div class="foundation card card-' + card.card + '">');
					selector.mouseup(this.onFoundationMouseUp.bind(this, card, idx));
				}

				container.append(selector);
			}, this);
		},

		drawTableau : function(tableau)
		{
			this.tableauSelectors = [];
			tableau.each(function(column, which)
			{
				var container = this.root.find('#tableau-' + which);
				container.empty();

				container.unbind('mouseup');

				container.mouseup(this.onEmptyTableauMouseUp.bind(this, which));

				this.tableauSelectors[which] = [];

				column.each(function(card, idx)
				{
					var selector;

					if (!card.up)
						selector = $('<div class="card card-back tableau-card">');
					else
						selector = $('<div class="card card-' + card.card + ' tableau-card">');

					this.tableauSelectors[which][idx] = selector;

					if (card.up) selector.mousedown(this.onTableauMouseDown.bind(this, card, which, idx));
					if (card.up) selector.mouseup(this.onTableauMouseUp.bind(this, card));
					container.append(selector);
				}, this);
			}, this);
		},

		drawStock : function(stock)
		{
			var container = this.root.find('#stock');
			container.empty();

			if (stock.length != 0)
			{
				var selector = $('<div class="card card-back">');
				selector.click(this.swallowEventAndFire.bind(this, 'dealStock'));
				container.append(selector);
			}
		},

		onWasteMouseDown : function(card, which, event)
		{
			event.preventDefault();
			this.fire('wasteMouseDown', card, which, event);
			return false;
		},

		onTableauMouseDown : function(card, which, idx, event)
		{
			event.preventDefault();
			this.fire('tableauMouseDown', card, which, idx, event);
			return false;
		},

		onFoundationMouseUp : function(card, which, event)
		{
			event.preventDefault();
			if (this.dragging)
				this.fire('foundationMouseUp', card, which, event, this.dragging);
			return false;
		},

		onEmptyFoundationMouseUp : function(which, event)
		{
			event.preventDefault();
			if (this.dragging)
				this.fire('emptyFoundationMouseUp', which, event, this.dragging);
			return false;
		},

		onTableauMouseUp : function(card, event)
		{
			event.preventDefault();
			if (this.dragging)
				this.fire('tableauMouseUp', card, this.dragging.which, this.dragging.idx, event, this.dragging);
			return false;
		},

		onEmptyTableauMouseUp : function(which, event)
		{
			event.preventDefault();
			if (this.dragging)
				this.fire('emptyTableauMouseUp', which, event, this.dragging);
			return false;
		},

		startWasteDrag : function(plays, card, which, event)
		{
			var drag = $('<div class="drag">');
			var newCard = this.wasteSelectors.getLast().clone(false, false);
			newCard.css({opacity: 0.75});
			drag.append(newCard);

			drag.css({position: 'absolute', top: (event.clientY - 46) + 'px', left: (event.clientX  - 35) + 'px'});
			$(document.body).mousemove(this.onMouseMove.bind(this, drag, plays));
			$(document.body).mouseup(this.onMouseUp.bind(this, drag, plays));
			$(document.body).append(drag);
			this.dragging = {plays: plays, type: 'waste', card: card, which: which};
		},

		startTableauDrag : function(plays, card, which, idx, event)
		{
			var drag = $('<div class="drag">');
			for (cloneIdx = idx; cloneIdx < this.tableauSelectors[which].length; cloneIdx++)
			{
				var newCard = this.tableauSelectors[which][cloneIdx].clone(false, false);
				newCard.css({opacity: 0.75});
				drag.append(newCard);
			}

			drag.css({position: 'absolute', top: (event.clientY -46) + 'px', left: (event.clientX  - 35) + 'px'});
			$(document.body).mousemove(this.onMouseMove.bind(this, drag, plays));
			$(document.body).mouseup(this.onMouseUp.bind(this, drag, plays));
			$(document.body).append(drag);
			this.dragging = {plays: plays, type: 'tableau', card: card, which: which, idx: idx};
		},

		onMouseMove: function(drag, plays, event)
		{
			event.preventDefault();
			drag.css({position: 'absolute', top: (event.clientY - 46) + 'px', left: (event.clientX - 35) + 'px'});
			return false;
		},

		onMouseUp: function(drag, plays, event)
		{
			event.preventDefault();
			$(document.body).unbind('mouseup');
			this.drag = drag;
			drag.remove();
			target = document.elementFromPoint(event.pageX, event.pageY);
			$(target).mouseup();
			this.dragging = null;
			return false;
			//this.root.find(event.target).mouseup();
		},

		swallowEventAndFire : function(which)
		{
			var args = Array.prototype.slice.call(arguments, 1);
			args.each(function(arg)
			{
			// see if this is a jquery event
				if (arg !== undefined && arg.preventDefault)
					arg.preventDefault();
				if (arg !== undefined && arg.stopPropagation)
					arg.stopPropagation();
			}, this);

			this.fireArgs(which, args);
		}
	})
});
