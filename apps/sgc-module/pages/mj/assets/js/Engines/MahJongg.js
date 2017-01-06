/*
	Copyright 2013 Glenn Anderson

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** Due to the direction of the tiles' shadows (down & to the right), the
	startBoard configs should follow these rules (in order):
	- Grouped by ascending z: 1, 2, 3,...
	- Grouped by ascending y: 1, 2, 3,...
	- Ascending x: 1, 2, 3,...
	NOTE: Watch out for special cases, like the tiles at (y : 8, z : 1) in this config.
 */


//============================================================================
// Support functions
//============================================================================

function ObjectConverter(array)
{
	var object = new Object();
	for (var i = 0; i < array.length; i++)
	{
		object[array[i]]='';
	}
	return object;
};

//============================================================================
// Game Class
//============================================================================

Package('Sparcade.Engines', {
	MahJongg : new Class({
		Extends : Sapphire.Eventer,

	/*
  	The entire play field consists of a 3 dimensional grid upon which tiles are placed.
  	A tile occupies a 2x2x1 area of this grid.
	*/
		defaultSetup :
		{
			id : 'mjl',
			tiles : 144,
			layout :
			[
				{x : 3, y : 1, z : 1}, {x : 5, y : 1, z : 1}, {x : 7, y : 1, z : 1},
				{x : 9, y : 1, z : 1}, {x : 11, y : 1, z : 1}, {x : 13, y : 1, z : 1},
				{x : 15, y : 1, z : 1}, {x : 17, y : 1, z : 1}, {x : 19, y : 1, z : 1},
				{x : 21, y : 1, z : 1}, {x : 23, y : 1, z : 1}, {x : 25, y : 1, z : 1},

				{x : 7, y : 3, z : 1},  {x : 9, y : 3, z : 1},
				{x : 11, y : 3, z : 1}, {x : 13, y : 3, z : 1}, {x : 15, y : 3, z : 1},
				{x : 17, y :3, z : 1}, {x : 19, y : 3, z : 1}, {x : 21, y : 3, z : 1},

				{x : 5, y : 5, z : 1},
				{x : 7, y : 5, z : 1}, {x : 9, y : 5, z : 1}, {x : 11, y : 5, z : 1},
				{x : 13, y : 5, z : 1}, {x : 15, y : 5, z : 1}, {x : 17, y : 5, z : 1},
				{x : 19, y : 5, z : 1}, {x : 21, y : 5, z : 1}, {x : 23, y : 5, z : 1},

				{x : 1, y : 8, z : 1},

				{x : 3, y : 7, z : 1}, {x : 5, y : 7, z : 1}, {x : 7, y : 7, z : 1},
				{x : 9, y : 7, z : 1}, {x : 11, y : 7, z : 1}, {x : 13, y : 7, z : 1},
				{x : 15, y : 7, z : 1}, {x : 17, y : 7, z : 1}, {x : 19, y : 7, z : 1},
				{x : 21, y : 7, z : 1}, {x : 23, y : 7, z : 1}, {x : 25, y : 7, z : 1},

				{x : 3, y : 9, z : 1}, {x : 5, y : 9, z : 1}, {x : 7, y : 9, z : 1},
				{x : 9, y : 9, z : 1}, {x : 11, y : 9, z : 1}, {x : 13, y : 9, z : 1},
				{x : 15, y : 9, z : 1}, {x : 17, y : 9, z : 1}, {x : 19, y : 9, z : 1},
				{x : 21, y : 9, z : 1}, {x : 23, y : 9, z : 1}, {x : 25, y : 9, z : 1},

				{x : 27, y : 8, z : 1}, {x : 29, y : 8, z : 1},

				{x : 5, y : 11, z : 1},
				{x : 7, y : 11, z : 1}, {x : 9, y : 11, z : 1}, {x : 11, y : 11, z : 1},
				{x : 13, y : 11, z : 1}, {x : 15, y : 11, z : 1}, {x : 17, y : 11, z : 1},
				{x : 19, y : 11, z : 1}, {x : 21, y : 11, z : 1}, {x : 23, y : 11, z : 1},

				{x : 7, y : 13, z : 1}, {x : 9, y : 13, z : 1},
				{x : 11, y : 13, z : 1}, {x : 13, y : 13, z : 1}, {x : 15, y : 13, z : 1},
				{x : 17, y : 13, z : 1}, {x : 19, y : 13, z : 1}, {x : 21, y : 13, z : 1},

				{x : 3, y : 15, z : 1}, {x : 5, y : 15, z : 1}, {x : 7, y : 15, z : 1},
				{x : 9, y : 15, z : 1}, {x : 11, y : 15, z : 1}, {x : 13, y : 15, z : 1},
				{x : 15, y : 15, z : 1}, {x : 17, y : 15, z : 1}, {x : 19, y : 15, z : 1},
				{x : 21, y : 15, z : 1}, {x : 23, y : 15, z : 1}, {x : 25, y : 15, z : 1},

				{x : 9, y : 3, z : 2}, {x : 11, y : 3, z : 2}, {x : 13, y : 3, z : 2},
				{x : 15, y : 3, z : 2}, {x : 17, y : 3, z : 2}, {x : 19, y : 3, z : 2},

				{x : 9, y : 5, z : 2}, {x : 11, y : 5, z : 2}, {x : 13, y : 5, z : 2},
				{x : 15, y : 5, z : 2}, {x : 17, y : 5, z : 2}, {x : 19, y : 5, z : 2},

				{x : 9, y : 7, z : 2}, {x : 11, y : 7, z : 2}, {x : 13, y : 7, z : 2},
				{x : 15, y : 7, z : 2}, {x : 17, y : 7, z : 2}, {x : 19, y : 7, z : 2},

				{x : 9, y : 9, z : 2}, {x : 11, y : 9, z : 2}, {x : 13, y : 9, z : 2},
				{x : 15, y : 9, z : 2}, {x : 17, y : 9, z : 2}, {x : 19, y : 9, z : 2},

				{x : 9, y : 11, z : 2}, {x : 11, y : 11, z : 2}, {x : 13, y : 11, z : 2},
				{x : 15, y : 11, z : 2}, {x : 17, y : 11, z : 2}, {x : 19, y : 11, z : 2},

				{x : 9, y : 13, z : 2}, {x : 11, y : 13, z : 2}, {x : 13, y : 13, z : 2},
				{x : 15, y : 13, z : 2}, {x : 17, y : 13, z : 2}, {x : 19, y : 13, z : 2},

				{x : 11, y : 5, z : 3},
				{x : 13, y : 5, z : 3}, {x : 15, y : 5, z : 3}, {x : 17, y : 5, z : 3},

				{x : 11, y : 7, z : 3},
				{x : 13, y : 7, z : 3}, {x : 15, y : 7, z : 3}, {x : 17, y : 7, z : 3},

				{x : 11, y : 9, z : 3},
				{x : 13, y : 9, z : 3}, {x : 15, y : 9, z : 3}, {x : 17, y : 9, z : 3},

				{x : 11, y : 11, z : 3},
				{x : 13, y : 11, z : 3}, {x : 15, y : 11, z : 3}, {x : 17, y : 11, z : 3},

				{x : 13, y : 7, z : 4}, {x : 15, y : 7, z : 4},
				{x : 13, y : 9, z : 4}, {x : 15, y : 9, z : 4},

				{x : 14, y : 8, z : 5}
			]
		},

		initialize : function()
		{
			this.parent();
			this.seasonFaceSetArray = [34,35,36,37];
			this.flowerFaceSetArray = [38,39,40,41];

			this.layout = [];					// where tiles can be placed
			this.startBoard = [];	    		// where tiles have been placed
			this.board = [];					// where tiles currently are
			this.setup = {};          			// describes and contains the layout

			this.moveCount = [];				// number of moves in the UNDO stack
			this.lastMove = 0;					// top of the UNDO stack
			this.moves = new Array(144);		// the UNDO stack
			this.goodMoves = new Array(144);	// TRUE if specified index into the board is playable

			this.usedSpaces = [];				// where tiles are currently placed on the entire grid. two dimentional array of sets, indexed on z and y axis. sets represent xoffsets within the grid
			this.usedTiles = new Set([]);		    // index into the layout for tiles are on the board

		// DURING BOARD GENERAION
			this.placementCount = 0;		   	// number of placements for a tile
			this.goodPlacements = [];			// where tiles can be placed, each item is an index into the layout
			this.pairCount = 0;					// number of playable pairs
			this.pairs = [];					// playable pairs, each item consists of a tuple {piece1, piece2} which are indexes into the board layout
			this.cutile = 0;					// current tile being placed

			this.solution = new Array(144);		// guaranteed solution : order in which tiles were placed

			this.tiles = {};					// specifies which tile faces are considered matches.
			this.tiles.count = 36;
			this.tiles.faceSets = [];
			this.setSetup();
		},

	//============================================================================
	// Private methods
	//============================================================================

		addPair : function (tile1, tile2)
		{
			console.log('addPair', tile1, tile2)
			this.addPos(this.board.pieces[tile1].pos, tile1);
			this.board.pieces[tile1].face = this.startBoard.pieces[tile1].face;

			this.addPos(this.board.pieces[tile2].pos, tile2);
			this.board.pieces[tile2].face = this.startBoard.pieces[tile2].face;
		},

		//----------------------------------------------------------------------------

		addPos : function (position, tile)
		{
			console.log('addPos', position, tile)
			with(position)
			{
				if (x == -1) return;

				if (this.usedSpaces[z] == undefined)
					this.usedSpaces[z] = new Array();

				if (this.usedSpaces[z][y] == undefined)
					this.usedSpaces[z][y] = new Set([]);

				var nextY = y + 1;
				if (this.usedSpaces[z][nextY] == undefined)
					this.usedSpaces[z][nextY] = new Set([]);

				var tempSet = new Set([x, x + 1]);
				this.usedSpaces[z][y].union(tempSet);
				this.usedSpaces[z][nextY].union(tempSet);
				delete(vTempSet);
				delete(vNextY);
			}
			this.usedTiles.includeBit(tile);
		},

		//----------------------------------------------------------------------------

		isUsed : function(x, y, z)
		{
			if (this.usedSpaces[z] == undefined) return false;
			else if (this.usedSpaces[z][y] == undefined) return false;
			else return this.usedSpaces[z][y].inBit(x);
		},

		//----------------------------------------------------------------------------

		calcValidPlacements : function ()
		{
			var goodThis, doodAcross, goodUp;
			var idx = 0;

			this.placementCount = 0;
			try
			{
				while (idx < this.layout.count)
				{
					goodThis = this.usedTiles.inBit(idx);
					var x = this.layout.pieces[idx].pos.x;
					var y = this.layout.pieces[idx].pos.y;
					var z = this.layout.pieces[idx].pos.z;

					if (x == 1) goodAcross = true;
					else if (x == 29) goodAcross = true;
					else goodAcross = (!this.isUsed(x + 2, y, z) && !this.isUsed(x + 2, y + 1, z)) || (!this.isUsed(x -1, y, z) && !this.isUsed(x - 1, y + 1, z));

					if (z == 7) goodUp = true;
					else goodUp = !this.isUsed(x, y, z + 1) && !this.isUsed(x + 1, y, z + 1) && !this.isUsed(x, y + 1, z + 1) && !this.isUsed(x + 1, y + 1, z + 1);

					if (goodThis && goodAcross && goodUp)
					{
						this.goodPlacements[this.placementCount] = idx;
						this.placementCount++;
					}
					idx++;
				}
			}
			catch (err)
			{
				console.log('error: ' + err);
			}

			return this.placementCount;
		},

		//----------------------------------------------------------------------------

		configureBoard : function ()
		{
			this.cutile = 0;
			this.layout.count = this.setup.tiles;
			this.layout.pieces = [];
			for (var idx = 0; idx < this.layout.count; idx++)
			{
				this.layout.pieces[idx] = new Object();
				this.layout.pieces[idx].pos = this.setup.layout[idx];
				this.layout.pieces[idx].face = -0xFFFFFFF;
			}
			this.tileCount = this.layout.count;
		},

		//----------------------------------------------------------------------------

		drawOneOf : function (faceSetIdx)
		{
			var faceSet = this.tiles.faceSets[faceSetIdx];
			var idx = Math.random(faceSet.faces.length);
			var result = faceSet.faces[idx];

			faceSet.faces.splice(idx, 1);

			var facesCount = faceSet.faces.length;
			console.log('drawOneOf', faceSetIdx, faceSet);
			if (facesCount == 0)
			{
				console.log('deleted faceSet', faceSetIdx);
				delete faceSet;
				this.tiles.faceSets.splice(faceSetIdx, 1);
				this.tiles.count--;
			}
			return result;
		},

		//----------------------------------------------------------------------------

		drawTilePair : function ()
		{
			var faceSetIdx = Math.random(this.tiles.count);
			console.log(this.tiles.count, faceSetIdx);
			var pair = new Object();
			pair.tile1 = this.drawOneOf(faceSetIdx);
			pair.tile2 = this.drawOneOf(faceSetIdx);
			console.log('drawTilePair', pair);
			return pair;
		},

		//----------------------------------------------------------------------------

		generateLayout : function ()
		{
			console.log('generateLayout');
			var posIdx1 = 0;
			var posIdx2 = 0;
			var pairIdx = 0;
			var tileCount = this.layout.count;

		// start with a sorted pile of tiles
			this.shuffleTiles();

		// assign the initial layout
			this.startBoard = this.layout;

		// Add a blank tile to each position on the board
			for (posIdx1 = 0; posIdx1 < tileCount; posIdx1++)
			{
				this.addPos(this.layout.pieces[posIdx1].pos, posIdx1);
			}

		// Get the tile pairs and place them. This may throw an exception
			for (pairIdx = 0; pairIdx < Math.floor(tileCount / 2); pairIdx++)
			{
				this.placeTilePair();
			}

		// Read the positions, they will have been removed during board generation
			for (posIdx2 = 0; posIdx2 < tileCount; posIdx2++)
			{
				this.addPos(this.layout.pieces[posIdx2].pos, posIdx2);
			}
		},

		//----------------------------------------------------------------------------

		pickGoodPlacement : function ()
		{
			if (this.placementCount == 0)
				throw "BadLayoutException";

			var which = Math.random(this.placementCount);
			var piece = this.goodPlacements[which];

			this.solution[this.cutile] = piece;
			this.cutile++;		// add it to the solution

			var result = {};
			result.pos = this.layout.pieces[piece].pos;
			result.piece = piece;

			this.goodPlacements.splice(which, 1);	// remove from goodPlacements so it cannot be chosen again
			this.placementCount--;

			return result;
		},

		//----------------------------------------------------------------------------

		placeTilePair : function ()
		{
			if (this.calcValidPlacements() == undefined)
				this.calcValidPlacements();

		// pick 2 playable positions
			var placement1 = this.pickGoodPlacement();
			var placement2 = this.pickGoodPlacement();

		// remove them from the board
			this.subtractPos(placement1.pos, placement1.piece);
			this.subtractPos(placement2.pos, placement2.piece);

		// pick 2 faces from the pile
			var pair = this.drawTilePair();

			console.log('pair', pair);

		// assign faces to drawn tiles
			this.startBoard.pieces[placement1.piece].face = pair.tile1;
			this.startBoard.pieces[placement2.piece].face = pair.tile2;

			delete pair, placement1, placement2;
		},

		//----------------------------------------------------------------------------

		processPair : function (piece1, piece2)
		{
			if (this.goodMoves[piece1] && this.goodMoves[piece2] && (piece1 != piece2) &&
				this.matchPair(this.board.pieces[piece1].face, this.board.pieces[piece2].face))
			{
				if (this.pairs[this.pairCount] == undefined)
					this.pairs[this.pairCount] = {};
				this.pairs[this.pairCount].piece1 = piece1;
				this.pairs[this.pairCount].piece2 = piece2;
				this.pairCount++;
			}
		},

		//----------------------------------------------------------------------------

		removePair : function (piece1, piece2)
		{
			this.subtractPos(this.board.pieces[piece1].pos, piece1);
			this.subtractPos(this.board.pieces[piece2].pos, piece2);
		},

		//----------------------------------------------------------------------------

		shuffleTiles : function ()
		{
			this.tiles.faceSets = [];
			this.tiles.count = 36;

			for (var idx = 0; idx < 144; idx++)
			{
				var faceSetIdx = Math.floor(idx / 4);
				if (!this.tiles.faceSets[faceSetIdx]) this.tiles.faceSets[faceSetIdx] = {};
				if (!this.tiles.faceSets[faceSetIdx].faces) this.tiles.faceSets[faceSetIdx].faces = [];
				this.tiles.faceSets[faceSetIdx].faces.push(idx);
			}
		},

		//----------------------------------------------------------------------------

		subtractPos : function (position, tile)
		{
			with(position)
			{
				if (x == -1) return;
				var tmpSet = new Set([x, x + 1]);
				this.usedSpaces[z][y].difference(tmpSet);
				this.usedSpaces[z][y + 1].difference(tmpSet);
				delete(tmpSet);
			}

			this.usedTiles.excludeBit(tile);
		},

		//============================================================================
		// Private methods
		//============================================================================

		arePlayablePairs : function ()
		{
			this.calcPlayablePairs(-1);
			return (this.pairCount > 0);
		},

		//----------------------------------------------------------------------------

		calcPlayablePairs : function (selectedTile)
		{
			var idx = 0;
			var idx1 = 0;
			var idx2 = 0;

			this.pairCount = 0;
			if (selectedTile == -1)
			{
				for (idx1 = 0; idx1 < this.layout.count; idx1++)
				{
				// loop through all tiles
					if (this.goodMoves[idx1])
					{
					// compare against each other
						for (idx2 = idx1 + 1; idx2 < this.layout.count; idx2++)
						{
							this.processPair(idx1, idx2);
						}
					}
				}
			}
			else
			{
			// loop through all tiles matching against the selected tile
				for (idx = 0; idx < this.layout.count; idx++)
				{
					this.processPair(selectedTile, idx);
				}
			}
		},

		//----------------------------------------------------------------------------

		calcValidMoves : function ()
		{
			var goodThis, goodAcross, faceSet;

			for (var idx = 0; idx < this.layout.count; idx++)
			{
				goodThis = this.usedTiles.inBit(idx);

				with (this.board.pieces[idx].pos)
				{
					if (x == 1) goodAcross = true;
					else if (x == 29) goodAcross = true;
					else goodAcross = (!this.isUsed(x + 2, y, z) && !this.isUsed(x + 2, y + 1, z)) || (!this.isUsed(x -1, y, z) && !this.isUsed(x - 1, y + 1, z));

					if (z == 7) faceSet = true;
					else faceSet = !this.isUsed(x, y, z + 1) && !this.isUsed(x + 1, y, z + 1) && !this.isUsed(x, y + 1, z + 1) && !this.isUsed(x + 1, y + 1, z + 1);
				}

				this.goodMoves[idx] = (goodThis && goodAcross && faceSet);
			}
		},

		//----------------------------------------------------------------------------

		canRedo : function ()
		{
			return this.lastMove != this.moveCount;
		},

		//----------------------------------------------------------------------------

		canUndo : function ()
		{
			return this.lastMove != 0;
		},

		//----------------------------------------------------------------------------

		generateGame : function (gameNbr)
		{
			var badLayout;
			var tries = 0;

			try
			{
				gandSeed = gameNbr;
				do
				{
					badLayout = false;
					try
					{
						this.configureBoard();
						this.generateLayout();
					}
					catch (err)
					{
						console.log(err);
						if (err == "BadLayoutException")
						{
							badLayout = true;
							tries++;
							if (tries > 3)
							{
								msg = 'Unable to generate a solvable puzzle from the given game. There may be no way to place the last tiles for a valid game.';
								break;
							}
					}
						else
						{
							console.log(err);
							console.log(err.stack);
							break;
						}
					}
				} while (badLayout == true);

			// Remember the current game, initialize stack, and record initial playable tile set
				this.board = this.startBoard;
				this.moveCount = 0;
				this.lastMove = 0;
				this.calcValidMoves();
			}
			finally
			{
				console.log('finally');
				Math.randomize();
			}
		},

		//----------------------------------------------------------------------------

		matchPair : function (face1, face2)
		{
			var set1 = Math.floor(face1 / 4);
			var set2 = Math.floor(face2 / 4);

			return Boolean(set1 == set2);
		},

		//----------------------------------------------------------------------------

		playPair : function (piece1, piece2)
		{
			this.removePair(piece1, piece2);
			this.moves[this.lastMove] = piece1;
			this.lastMove++;
			this.moves[this.lastMove] = piece2;
			this.lastMove++;
			this.moveCount = this.lastMove;
			this.tileCount -= 2;
		},

		//----------------------------------------------------------------------------

		redo : function ()
		{
			if (this.canRedo() == false) return;

			var piece1 = -1;
			var piece2 = -1;

			piece1 = this.moves[this.lastMove];
			this.lastMove++;
			piece2 = this.moves[this.lastMove];
			this.lastMove++;
			this.removePair(piece1, piece2);

			this.tileCount -= 2;
			return {piece1: piece1, piece2 : piece2};
		},

		//----------------------------------------------------------------------------

		undo : function ()
		{
			if (this.canUndo() == false) return;

			var piece1 = -1;
			var piece2 = -1;

			this.lastMove--;
			piece1 = this.moves[this.lastMove];
			this.lastMove--;
			piece2 = this.moves[this.lastMove];

			this.addPair(piece1, piece2);

			this.tileCount += 2;
			return {piece1: piece1, piece2: piece2};
		},

		//----------------------------------------------------------------------------

		setSetup : function (setup)
		{
			if (setup == undefined) this.setup = this.defaultSetup
			else this.setup = setup;

		}

	})
});

