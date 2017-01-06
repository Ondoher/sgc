var NO_BUTTON = 0;
var LEFT_BUTTON = 1;
var RIGHT_BUTTON = 2;
var ROTATELEFT_BUTTON = 1;
var ROTATERIGHT_BUTTON = 2;
var SOFTDOWN_BUTTON = 1;
var HARDDOWN_BUTTON = 2;

var DOWN_BTN = 1
var MOVE_BTN = 2;
var ROTATE_BTN = 3;

var BOUCE_DELAY = 200;
var REPEAT_DELAY = 75;
var SPAWN_DELAY = 500;
var LOCK_DELAY = 1000;

var DRAWTETRONIMO = 0;
var HIDETETRONIMO = 1;
var DRAWSHADOW    = 2;
var HIDESHADOW    = 3;
var DRAWBOARD     = 4;
var DRAWONDECK    = 5;
var DRAWSCORE     = 6;
var DRAWLEVEL     = 7;
var DRAWHOLD      = 8;
var DRAWSHADOW    = 9;
var DRAWWHOOP     = 10;
var DRAWGAMEOVER  = 11;

var ROW_CLEAR_VALUES = [100, 300, 500, 800];
var TSPIN_VALUES = [400, 800, 1200, 1600]
var CLEAR_MATRIX = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

var IPIECE = 0;
var JPIECE = 1;
var LPIECE = 2;
var OPIECE = 3;
var SPIECE = 4;
var TPIECE = 5;
var ZPIECE = 6;

var ROWS = 20;
var COLS = 10;

var LEFT = -1;
var DOWN = 0;
var RIGHT = 1;
var UP = 2;

var EMPTY   = 0;
var CYAN    = 1;
var BLUE    = 2;
var ORANGE  = 3;
var YELLOW  = 4;
var GREEN   = 5;
var PURPLE  = 6;
var RED     = 7;

//----------------------------------------------------------------------------
// space = how much empty space is on [left, down, right]. used to get close to walls
// kick = how much to add to x when rotated to from the left or right and up against a wall
// collision = array of points relative to x, y to check for collision. a point is defined as an array with 0 = row, 1 = col
// shape = minimum square matrix representing blocks that make up the shape at the specific rotation

var IPIECE_ROTATION =
[
	{
	 	space: [0, 2, 0],
		kick: [2, 0, -1],
		collision:
		[
			[[1, -1]],
			[[2, 0], [2, 1], [2, 2], [2, 3]],
			[[1, 4]],
			[[0, 0], [0, 1], [0, 2], [0, 3]]
		],
		shape:
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	},
	{
		space: [2, 0, 1],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 1], [1, 1], [2, 1], [3, 1]],
			[[4, 2]],
			[[0, 3], [1, 3], [2, 3], [3, 3]],
			[[-1, 2]]
		],
		shape:
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0]
		]
	},
];

//----------------------------------------------------------------------------

var TPIECE_ROTATION =
[
	{
		space: [0, 0, 0],
		kick: [1, 0, -1],
		collision:
		[
			[[1, -1], [2, 0]],
			[[2, 0], [3, 1], [2, 2]],
			[[1, 3], [2, 2]],
			[[0, 0], [0, 1], [0, 2]]
		],
		shape:
			[
			[0, 0, 0],
			[2, 2, 2],
			[0, 2, 0]
			]
	},
	{
		space: [0, 0, 1],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 0], [1, -1], [2, 0]],
			[[2, 0], [3, 1]],
			[[0, 2], [1, 2], [2, 2]],
			[[0, 0], [-1, 1]]
		],
		shape:
		[
			[0, 2, 0],
			[2, 2, 0],
			[0, 2, 0]
		]
	},
	{
		space: [0, 0, 0],
		kick: [1, 0, -1],
		collision:
		[
			[[1, 0], [2, -1]],
			[[3, 0], [3, 1], [3, 2]],
			[[1, 2], [2, 3]],
			[[1, 0], [0, 1], [1, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[0, 2, 0],
			[2, 2, 2]
		]
	},
	{
		space: [1, 0, 0],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 0], [1, 0], [2,0]],
			[[3, 1], [2, 2]],
			[[0, 2], [1, 3], [2, 2]],
			[[-1, 1], [0, 2]]
		],
		shape:
		[
			[0, 2, 0],
			[0, 2, 2],
			[0, 2, 0]
		]
	}
];

//----------------------------------------------------------------------------

var LPIECE_ROTATION =
[
 	{
		space: [0, 0, 0],
		kick: [1, 0, -1],
		collision:
		[
			[[1, -1], [2, -1]],
			[[3, 0], [2, 1], [2, 2]],
			[[1, 3], [2, 1]],
			[[0, 0], [0, 1], [0, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[3, 3, 3],
			[3, 0, 0]
		]
	},
	{
	 	space: [0, 0, 1],
		kick: [0, 0, 0],
		collision:
		[
			[[0, -1], [1, 0], [2, 0]],
			[[1, 0], [3, 1]],
			[[0, 2], [1, 2], [2, 2]],
			[[-1, 0], [-1, 1]]
		],
		shape:
		[
			[3, 3, 0],
			[0, 3, 0],
			[0, 3, 0]
		]
	},
	{
	 	space: [0, 0, 0],
		kick: [1, 0, -1],
		collision:
		[
			[[1, 1], [2, -1]],
			[[3, 0], [3, 1], [3, 2]],
			[[1, 3], [2, 3]],
			[[1, 0], [1, 1], [0, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[0, 0, 3],
			[3, 3, 3]
		]
	},
	{
		space: [1, 0, 0],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 1], [1, 1], [2, 1]],
			[[3, 1], [3, 2]],
			[[0, 2], [1, 2], [2, 3]],
			[[-1, 1], [1, 2]]
		],
		shape:
		[
			[0, 3, 0],
			[0, 3, 0],
			[0, 3, 3]
		]
	 }
];

//----------------------------------------------------------------------------

var JPIECE_ROTATION =
[
 	{
	 	space: [0, 0, 0],
		kick: [-1, 0, 1],
		collision:
		[
			[[1, -1], [2, 1]],
			[[2, 0], [2, 1], [3, 2]],
			[[1, 3], [2, 3]],
			[[0, 0], [0, 1], [0, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[4, 4, 4],
			[0, 0, 4]
		]
	},
	{
	 	space: [0, 0, 1],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 0], [1, 0], [2, -1]],
			[[3, 0], [3, 1]],
			[[0, 2], [1, 2], [2, 2]],
			[[1, 0], [-1, 1]]
		],
		shape:
		[
			[0, 4, 0],
			[0, 4, 0],
			[4, 4, 0]
		]
	},
	{
	 	space: [0, 0, 0],
		kick: [1, 0, -1],
		collision:
		[
			[[1, -1], [2, -1]],
			[[3, 0], [3, 1], [3, 2]],
			[[1, 1], [2, 3]],
			[[0, 0], [1, 1], [1, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[4, 0, 0],
			[4, 4, 4]
		]
	},
	{
	 	space: [1, 0, 0],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 0], [1, 0], [2, 0]],
			[[3, 1], [1, 2]],
			[[0, 2], [1, 2], [2, 2]],
			[[-1, 1], [-1, 2]]
		],
		shape:
		[
			[0, 4, 4],
			[0, 4, 0],
			[0, 4, 0]
		]
	}
];

//----------------------------------------------------------------------------

var SPIECE_ROTATION =
[
 	{
	 	space: [0, 0, 0],
		kick: [0, 0, -1],
		collision:
		[
			[[1, 0], [2, -1]],
			[[3, 0], [3, 1], [2, 2]],
			[[1, 3], [2, 2]],
			[[1, 0], [0, 1], [0, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[0, 5, 5],
			[5, 5, 0]
		]
	},
	{
	 	space: [0, 0, 1],
		kick: [0, 0, 0],
		collision:
		[
			[[0, -1], [1, -1], [2, 0]],
			[[2, 0], [3, 1]],
			[[0, 1], [1, 2], [2, 2]],
			[[-1, 1], [0, 1]]
		],
		shape:
		[
			[5, 0, 0],
			[5, 5, 0],
			[0, 5, 0]
		]
	}
];

//----------------------------------------------------------------------------

var ZPIECE_ROTATION =
[
 	{
	 	space: [0, 0, 0],
		kick: [1, 0, 0],
		collision:
		[
			[[1, -1], [2, 0]],
			[[2, 0], [3, 1], [3, 2]],
			[[1, 2], [2, 3]],
			[[0, 0], [0, 1], [1, 2]]
		],
		shape:
		[
			[0, 0, 0],
			[6, 6, 0],
			[0, 6, 6]
		]
	},
	{
	 	space: [1, 0, 0],
		kick: [0, 0, 0],
		collision:
		[
			[[0, 1], [1, 0], [2, 0]],
			[[3, 1], [2, 2]],
			[[0, 2], [1, 3], [2, 2]],
			[[0, 1], [-1, 2]]
		],
		shape:
		[
			[0, 0, 6],
			[0, 6, 6],
			[0, 6, 0]
		]
	 }
];

//----------------------------------------------------------------------------

var OPIECE_ROTATION =
[
 	{
	 	space: [0, 0, 0],
		kick: [0, 0, 0],
		collision:
		[
			[[0, -1], [1, -1]],
			[[2, 0], [2, 1]],
			[[0, 2], [1, 2]],
			[[-1, 0], [-1, 1]]
		],
		shape:
		[
			[7, 7],
			[7, 7]
		]
	}
];

var TILE_WIDTH = 25;
var TILE_HEIGHT = 30;
var LEFT_LAYER_OFFSET = 4;
var TOP_LAYER_OFFSET = 4;

var CONFIGURATION = {
    tilePath: "/sgc-module/pages/tetris/assets/images/normal/",
    tileImages: ["empty.png", "cyan.png", "blue.png", "orange.png", "yellow.png", "green.png", "purple.png", "red.png"],
    tileWidth: 16,
    tileHeight: 16,
    smallTilePath: "/sgc-module/pages/tetris/assets/images/small/",
    smallTileImages: ["empty.png", "cyan.png", "blue.png", "orange.png", "yellow.png", "green.png", "purple.png", "red.png"],
    smallTileWidth: 12,
    smallTileHeight: 12,
    whoopPath: "/sgc-module/pages/tetris/assets/images/whoop.png"
};




