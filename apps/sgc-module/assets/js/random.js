Math.randomize = function (value)
{
	value = (value == undefined)?new Date().getTime():value;

	Math.randSeed = value;
};

Math.random = function(limit)
{
    var randPow = Math.pow(2, -31);
    var randLimit = Math.pow(2, 31);
	var magic = 0x8088405;
    var rand = this.randSeed * magic + 1;


    this.randSeed = rand % randLimit

    rand = rand % randLimit
    rand = rand * randPow;

	if (limit)
	    rand = Math.floor(rand * limit);

    return rand;
}

Math.randomize();


