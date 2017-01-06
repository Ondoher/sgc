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

var Set = new Class({
	CHUNK_SIZE : 24,
	CHUNK_MASK : 0xffffff,

	initialize : function(bits, length)
	{
		this.length = length?length:1024;
		this.chunkCount = Math.ceil(this.length / this.CHUNK_SIZE);
		this.chunks = [];
		this.chunks = this.arrayPad(this.chunks, this.chunkCount, 0);
		this.assign(bits);
	},

	arrayPad : function(array, count, value)
	{
		for (var idx = array.length; idx < count; idx++)
			array.push(value)
		return array;
	},

	isEmpty : function()
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			if (this.chunks[idx] != 0) return false;

		return true;
	},

	assign : function(bits)
	{
		for (var idx = 0; idx < bits.length; idx++)
			this.includeBit(bits[idx]);
	},

	includeBit : function(bit)
	{
		this.chunks[Math.floor(bit / this.CHUNK_SIZE)] |= (1 << (bit % this.CHUNK_SIZE));
	},

	excludeBit : function(bit)
	{
		this.chunks[Math.floor(bit / this.CHUNK_SIZE)] &= (~(1 << (bit % this.CHUNK_SIZE))) & this.CHUNK_MASK;
	},

	inBit : function(bit)
	{
		var result = ((this.chunks[Math.floor(bit / this.CHUNK_SIZE)]) & (1 << (bit % this.CHUNK_SIZE)))
		return result != 0;
	},

	union : function (set)
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			this.chunks[idx] |= set.chunks[idx];
	},

	intersection : function(set)
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			this.chunks[idx] &= set.chunks[$idx];
	},

	difference : function(set)
	{
		for (var idx = 0; idx < this.chunks.length; idx++)
			this.chunks[idx] &= (~set.chunks[idx]) & this.CHUNK_MASK;
	}
});
