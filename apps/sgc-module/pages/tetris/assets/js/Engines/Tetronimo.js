Package('SgcModule.Engines', {
	Tetronimo : new Class({
		initialize : function(shape)
		{
			this.type = shape;
			this.reset();
		},

		//----------------------------------------------------------------------------

		testRotate : function(direction)
		{
			this.rotation = (this.rotation + direction + this.shape.length) % this.shape.length;
		},

		//----------------------------------------------------------------------------

		untestRotate : function(direction)
		{
			direction = 0 - direction;
			this.rotation = (this.rotation + direction + this.shape.length) % this.shape.length;
		},

		//----------------------------------------------------------------------------

		rotate : function(direction)
		{
			this.rotation = (this.rotation + direction + this.shape.length) % this.shape.length;
		},

		//----------------------------------------------------------------------------

		canMoveX : function(direction)
		{
			var extra = this.shape[this.rotation].space[direction + 1];
			if (direction == LEFT) return extra + this.x;
			else return (COLS - (this.x + this.shape[this.rotation].shape[0].length)) + extra;
		},

		//----------------------------------------------------------------------------

		move : function(direction)
		{
			var space = this.canMoveX(direction);
			if (space != 0)
				this.x += direction;
		},

		//----------------------------------------------------------------------------

		drop : function()
		{
			this.y++;
		},

		//----------------------------------------------------------------------------

		matrix : function()
		{
			return this.shape[this.rotation].shape;
		},

		//----------------------------------------------------------------------------

		collision : function(direction)
		{
			return this.shape[this.rotation].collision[direction + 1];
		},

		//----------------------------------------------------------------------------

		kick : function(direction)
		{
			return this.shape[this.rotation].kick[direction + 1];
		},

		//----------------------------------------------------------------------------

		space : function(direction)
		{
			return this.shape[this.rotation].space[direction + 1];
		},

		//----------------------------------------------------------------------------

		reset : function()
		{
			this.y = 0;
			this.rotation = 0;
			switch (this.type)
			{
				case IPIECE:
					this.shape = IPIECE_ROTATION;
					this.x = 3;
					this.y = -1
					break;
				case JPIECE:
					this.shape = JPIECE_ROTATION;
					this.x = 3;
					this.y = -1
					break;
				case LPIECE:
					this.shape = LPIECE_ROTATION;
					this.x = 3;
					this.y = -1
					break;
				case OPIECE:
					this.shape = OPIECE_ROTATION;
					this.x = 4;
					break;
				case SPIECE:
					this.shape = SPIECE_ROTATION;
					this.x = 3;
					this.y = -1
					break;
				case TPIECE:
					this.shape = TPIECE_ROTATION;
					this.x = 3;
					this.y = -1
					break;
				case ZPIECE:
					this.shape = ZPIECE_ROTATION;
					this.x = 3;
					this.y = -1
					break;
			}
		}
	})
});

